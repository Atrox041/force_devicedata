import { Injectable } from "@nestjs/common";
import ExcelJS from "exceljs";
import { DatabaseService } from "../database/database.service";

type Filters = {
  operation?: string;
  vendor?: string;
  billingMode?: string;
  onlineStatus?: string;
  accountCode?: string;
};

function parseFilters(query: Record<string, string | undefined>): Filters {
  const operation = query.operation?.trim();
  const vendor = query.vendor?.trim();
  const billingMode = query.billingMode?.trim();
  const onlineStatus = query.onlineStatus?.trim();
  const accountCode = query.accountCode?.trim();

  return {
    operation: operation || undefined,
    vendor: vendor || undefined,
    billingMode: billingMode || undefined,
    onlineStatus: onlineStatus || undefined,
    accountCode: accountCode || undefined,
  };
}

function buildWhere(filters: Filters) {
  const clauses: string[] = [];
  const params: unknown[] = [];

  const push = (sql: string, value: unknown) => {
    params.push(value);
    clauses.push(sql.replace("?", `$${params.length}`));
  };

  if (filters.operation) push(`operation = ?`, filters.operation);
  if (filters.vendor) push(`vendor = ?`, filters.vendor);
  if (filters.billingMode) push(`billing_mode = ?`, filters.billingMode);
  if (filters.onlineStatus) push(`online_status = ?`, filters.onlineStatus);
  if (filters.accountCode) push(`account_code = ?`, filters.accountCode);

  const whereSql = clauses.length ? `WHERE ${clauses.join(" AND ")}` : "";
  return { whereSql, params };
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

@Injectable()
export class ExportsService {
  constructor(private readonly db: DatabaseService) {}

  async exportDeviceOverview(query: Record<string, string | undefined>) {
    const filters = parseFilters(query);
    const { whereSql, params } = buildWhere(filters);

    const sql = `
      SELECT
        operation,
        online_status,
        device_provider,
        vendor,
        billing_mode,
        account_code,
        SUM(CASE WHEN device_type = '5G设备' THEN device_count ELSE 0 END)::bigint AS device5g,
        SUM(CASE WHEN device_type = '10G设备' THEN device_count ELSE 0 END)::bigint AS device10g,
        SUM(CASE WHEN device_type = '2G设备' THEN device_count ELSE 0 END)::bigint AS device2g,
        SUM(CASE WHEN device_type = '1G小主机' THEN device_count ELSE 0 END)::bigint AS device1g,
        SUM(CASE WHEN device_type = '报废设备' THEN device_count ELSE 0 END)::bigint AS scrapped
      FROM bi.device_inventory_fact
      ${whereSql}
      GROUP BY operation, online_status, device_provider, vendor, billing_mode, account_code
      ORDER BY vendor NULLS LAST, operation NULLS LAST, account_code NULLS LAST
      LIMIT 50000
    `;

    const res = await this.db.query<{
      operation: string | null;
      online_status: string | null;
      device_provider: string | null;
      vendor: string | null;
      billing_mode: string | null;
      account_code: string | null;
      device5g: string;
      device10g: string;
      device2g: string;
      device1g: string;
      scrapped: string;
    }>(sql, params);

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("设备总览");

    sheet.columns = [
      { header: "运营", key: "operation", width: 16 },
      { header: "设备在线情况", key: "onlineStatus", width: 14 },
      { header: "设备提供", key: "provider", width: 14 },
      { header: "供应商", key: "vendor", width: 18 },
      { header: "计费方式", key: "billingMode", width: 14 },
      { header: "账户编码", key: "accountCode", width: 18 },
      { header: "5G设备", key: "device5g", width: 12 },
      { header: "10G设备", key: "device10g", width: 12 },
      { header: "2G设备", key: "device2g", width: 12 },
      { header: "1G小主机", key: "device1g", width: 12 },
      { header: "报废设备", key: "scrapped", width: 12 },
    ];

    for (const r of res.rows) {
      sheet.addRow({
        operation: r.operation ?? "",
        onlineStatus: r.online_status ?? "",
        provider: r.device_provider ?? "",
        vendor: r.vendor ?? "",
        billingMode: r.billing_mode ?? "",
        accountCode: r.account_code ?? "",
        device5g: toInt(r.device5g),
        device10g: toInt(r.device10g),
        device2g: toInt(r.device2g),
        device1g: toInt(r.device1g),
        scrapped: toInt(r.scrapped),
      });
    }

    sheet.getRow(1).font = { bold: true };
    sheet.views = [{ state: "frozen", ySplit: 1 }];

    const written = await workbook.xlsx.writeBuffer();
    const buffer = Buffer.isBuffer(written) ? written : Buffer.from(written as ArrayBuffer);
    const fileName = `device-overview-${new Date().toISOString().slice(0, 10)}.xlsx`;
    return { fileName, buffer };
  }
}
