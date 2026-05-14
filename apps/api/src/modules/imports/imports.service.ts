import { BadRequestException, Injectable } from "@nestjs/common";
import type { PoolClient } from "pg";
import * as XLSX from "xlsx";
import { DatabaseService } from "../database/database.service";
import { DEVICE_TYPES } from "../device-overview/device-overview.types";

type ParsedRow = {
  purchase: string;
  operation: string;
  onlineStatus: string;
  deviceProvider: string;
  vendor: string;
  billingMode: string;
  accountCode: string;
  device5g: number;
  device10g: number;
  device2g: number;
  device1g: number;
  scrapped: number;
  raw: Record<string, unknown>;
};

const REQUIRED_HEADERS = [
  "采购",
  "运营",
  "设备在线情况",
  "设备提供",
  "供应商",
  "计费方式",
  "账户编码",
  "5G设备",
  "10G设备",
  "2G设备",
  "1G小主机",
  "报废设备",
] as const;

function normalizeHeader(value: unknown): string {
  if (value == null) return "";
  return String(value).trim();
}

function toInt(value: unknown): number {
  if (typeof value === "number" && Number.isFinite(value)) return Math.trunc(value);
  if (typeof value === "string") {
    const s = value.trim();
    if (!s) return 0;
    const n = Number(s.replace(/,/g, ""));
    return Number.isFinite(n) ? Math.trunc(n) : 0;
  }
  return 0;
}

function toText(value: unknown): string {
  if (value == null) return "";
  return String(value).trim();
}

function parseExcel(buffer: Buffer) {
  const wb = XLSX.read(buffer, { type: "buffer" });
  const sheetName = wb.SheetNames[0];
  if (!sheetName) throw new BadRequestException("Excel 没有可读取的 Sheet");

  const ws = wb.Sheets[sheetName];
  if (!ws) throw new BadRequestException("Excel Sheet 读取失败");

  const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(ws, {
    defval: "",
    raw: false,
  });

  const presentHeaders = new Set<string>();
  for (const row of rows.slice(0, 5)) {
    Object.keys(row).forEach((k) => presentHeaders.add(normalizeHeader(k)));
  }

  const missing = REQUIRED_HEADERS.filter((h) => !presentHeaders.has(h));
  if (missing.length) {
    throw new BadRequestException(`缺少必要字段: ${missing.join("、")}`);
  }

  const parsed: ParsedRow[] = rows.map((row) => {
    return {
      purchase: toText(row["采购"]),
      operation: toText(row["运营"]),
      onlineStatus: toText(row["设备在线情况"]),
      deviceProvider: toText(row["设备提供"]),
      vendor: toText(row["供应商"]),
      billingMode: toText(row["计费方式"]),
      accountCode: toText(row["账户编码"]),
      device5g: toInt(row["5G设备"]),
      device10g: toInt(row["10G设备"]),
      device2g: toInt(row["2G设备"]),
      device1g: toInt(row["1G小主机"]),
      scrapped: toInt(row["报废设备"]),
      raw: row,
    };
  });

  return { sheetName, rows: parsed };
}

@Injectable()
export class ImportsService {
  constructor(private readonly db: DatabaseService) {}

  async importDeviceOverview(file?: Express.Multer.File) {
    if (!file) throw new BadRequestException("缺少上传文件字段 file");
    if (!file.buffer || !file.buffer.length) throw new BadRequestException("上传文件为空");

    const { sheetName, rows } = parseExcel(file.buffer);

    const result = await this.db.withClient(async (client) => {
      await client.query("BEGIN");
      try {
        const job = await client.query<{ id: string }>(
          `
            INSERT INTO bi.import_jobs (source_name, source_file_name, sheet_name, status, total_rows)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id
          `,
          ["excel", file.originalname ?? null, sheetName, "processing", rows.length],
        );

        const importJobId = job.rows[0]?.id;
        if (!importJobId) throw new Error("import_job_id create failed");

        let successRows = 0;
        let failedRows = 0;

        for (const row of rows) {
          try {
            await insertRaw(client, importJobId, row);
            await insertFacts(client, importJobId, row);
            successRows += 1;
          } catch {
            failedRows += 1;
          }
        }

        await client.query(
          `
            UPDATE bi.import_jobs
            SET status = $2, success_rows = $3, failed_rows = $4, updated_at = now()
            WHERE id = $1
          `,
          [importJobId, "done", successRows, failedRows],
        );

        await client.query("COMMIT");
        return { importJobId, totalRows: rows.length, successRows, failedRows };
      } catch (e: any) {
        await client.query("ROLLBACK");
        throw e;
      }
    });

    return result;
  }
}

async function insertRaw(client: PoolClient, importJobId: string, row: ParsedRow) {
  await client.query(
    `
      INSERT INTO bi.import_device_raw (
        import_job_id,
        purchase,
        operation,
        online_status,
        device_provider,
        vendor,
        billing_mode,
        account_code,
        device_5g,
        device_10g,
        device_2g,
        device_1g,
        scrapped,
        raw_payload
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)
    `,
    [
      importJobId,
      row.purchase || null,
      row.operation || null,
      row.onlineStatus || null,
      row.deviceProvider || null,
      row.vendor || null,
      row.billingMode || null,
      row.accountCode || null,
      row.device5g,
      row.device10g,
      row.device2g,
      row.device1g,
      row.scrapped,
      row.raw,
    ],
  );
}

async function insertFacts(client: PoolClient, importJobId: string, row: ParsedRow) {
  const counts: Record<string, number> = {
    "5G设备": row.device5g,
    "10G设备": row.device10g,
    "2G设备": row.device2g,
    "1G小主机": row.device1g,
    "报废设备": row.scrapped,
  };

  const base = [
    importJobId,
    row.purchase || null,
    row.operation || null,
    row.onlineStatus || null,
    row.deviceProvider || null,
    row.vendor || null,
    row.billingMode || null,
    row.accountCode || null,
  ] as const;

  for (const type of DEVICE_TYPES) {
    await client.query(
      `
        INSERT INTO bi.device_inventory_fact (
          import_job_id,
          purchase,
          operation,
          online_status,
          device_provider,
          vendor,
          billing_mode,
          account_code,
          device_type,
          device_count
        )
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
      `,
      [...base, type, counts[type] ?? 0],
    );
  }
}

