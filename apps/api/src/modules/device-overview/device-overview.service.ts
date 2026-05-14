import { BadRequestException, Injectable } from "@nestjs/common";
import { DatabaseService } from "../database/database.service";
import { DEVICE_TYPES } from "./device-overview.types";

type Filters = {
  operation?: string;
  vendor?: string;
  billingMode?: string;
  onlineStatus?: string;
  accountCode?: string;
};

type StatusItem = {
  onlineStatus: string;
  count: number;
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
export class DeviceOverviewService {
  constructor(private readonly db: DatabaseService) {}

  async getSummary(query: Record<string, string | undefined>) {
    const filters = parseFilters(query);
    const { whereSql, params } = buildWhere(filters);

    const sql = `
      SELECT
        device_type,
        SUM(device_count)::bigint AS total_count,
        SUM(CASE WHEN online_status ILIKE '%在线%' THEN device_count ELSE 0 END)::bigint AS online_count
      FROM bi.device_inventory_fact
      ${whereSql}
      GROUP BY device_type
    `;

    const result = await this.db.query<{
      device_type: string;
      total_count: string;
      online_count: string;
    }>(sql, params);

    const byType = new Map<string, { total: number; online: number }>();
    for (const row of result.rows) {
      byType.set(row.device_type, {
        total: toInt(row.total_count),
        online: toInt(row.online_count),
      });
    }

    const deviceStats = DEVICE_TYPES.map((type) => {
      const v = byType.get(type) ?? { total: 0, online: 0 };
      const utilization =
        type === "报废设备" || v.total === 0 ? 0 : Math.round((v.online / v.total) * 100);
      return { type, count: v.total, onlineCount: type === "报废设备" ? 0 : v.online, utilization };
    });

    const totalDevices = deviceStats
      .filter((s) => s.type !== "报废设备")
      .reduce((sum, s) => sum + s.count, 0);

    const totalOnlineDevices = deviceStats
      .filter((s) => s.type !== "报废设备")
      .reduce((sum, s) => sum + s.onlineCount, 0);

    const totalScrappedDevices = deviceStats
      .filter((s) => s.type === "报废设备")
      .reduce((sum, s) => sum + s.count, 0);

    const vendorsSql = `
      SELECT COUNT(DISTINCT vendor)::bigint AS vendors
      FROM bi.device_inventory_fact
      ${whereSql}
    `;
    const vendorsRes = await this.db.query<{ vendors: string }>(vendorsSql, params);

    const accountsSql = `
      SELECT COUNT(DISTINCT account_code)::bigint AS accounts
      FROM bi.device_inventory_fact
      ${whereSql}
    `;
    const accountsRes = await this.db.query<{ accounts: string }>(accountsSql, params);

    const statusSql = `
      SELECT
        online_status,
        SUM(CASE WHEN device_type <> '报废设备' THEN device_count ELSE 0 END)::bigint AS count
      FROM bi.device_inventory_fact
      ${whereSql}
      GROUP BY online_status
    `;
    const statusRes = await this.db.query<{ online_status: string | null; count: string }>(
      statusSql,
      params,
    );
    const statusItems: StatusItem[] = statusRes.rows
      .map((r) => ({ onlineStatus: (r.online_status ?? "").trim(), count: toInt(r.count) }))
      .filter((r) => r.onlineStatus);

    const onlineServiceDevices = statusItems
      .filter((r) => r.onlineStatus === "在线服役")
      .reduce((sum, r) => sum + r.count, 0);

    const notReturnedDevices = statusItems
      .filter((r) => {
        const s = r.onlineStatus;
        return (
          s.includes("待设备回库") ||
          s.includes("待回库") ||
          s.includes("未回寄") ||
          s.includes("待回寄")
        );
      })
      .reduce((sum, r) => sum + r.count, 0);

    return {
      totalDevices,
      totalOnlineDevices,
      totalScrappedDevices,
      totalVendors: toInt(vendorsRes.rows[0]?.vendors ?? 0),
      totalAccounts: toInt(accountsRes.rows[0]?.accounts ?? 0),
      onlineServiceDevices,
      notReturnedDevices,
      deviceStats,
    };
  }

  async getDistribution(query: Record<string, string | undefined>) {
    const filters = parseFilters(query);
    const { whereSql, params } = buildWhere(filters);

    const sql = `
      SELECT
        device_type,
        SUM(device_count)::bigint AS count
      FROM bi.device_inventory_fact
      ${whereSql}
      GROUP BY device_type
    `;
    const result = await this.db.query<{ device_type: string; count: string }>(sql, params);

    const map = new Map(result.rows.map((r) => [r.device_type, toInt(r.count)]));
    const items = DEVICE_TYPES.map((type) => ({ type, count: map.get(type) ?? 0 }));
    return { items };
  }

  async getVendors(query: Record<string, string | undefined>) {
    const filters = parseFilters(query);
    const { whereSql, params } = buildWhere(filters);

    const sql = `
      SELECT
        vendor,
        SUM(CASE WHEN device_type <> '报废设备' THEN device_count ELSE 0 END)::bigint AS count
      FROM bi.device_inventory_fact
      ${whereSql}
      GROUP BY vendor
      ORDER BY count DESC
      LIMIT 50
    `;
    const result = await this.db.query<{ vendor: string; count: string }>(sql, params);
    return {
      items: result.rows.map((r) => ({ vendor: r.vendor ?? "", count: toInt(r.count) })),
    };
  }

  async getTable(query: Record<string, string | undefined>) {
    const filters = parseFilters(query);
    const page = Math.max(1, Number(query.page ?? "1") || 1);
    const pageSize = Math.min(200, Math.max(1, Number(query.pageSize ?? "20") || 20));
    const offset = (page - 1) * pageSize;

    const { whereSql, params } = buildWhere(filters);

    const totalSql = `
      SELECT COUNT(*)::bigint AS total
      FROM (
        SELECT 1
        FROM bi.device_inventory_fact
        ${whereSql}
        GROUP BY operation, online_status, device_provider, vendor, billing_mode, account_code
      ) t
    `;
    const totalRes = await this.db.query<{ total: string }>(totalSql, params);
    const total = toInt(totalRes.rows[0]?.total ?? 0);

    const dataSql = `
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
      LIMIT $${params.length + 1} OFFSET $${params.length + 2}
    `;
    const dataRes = await this.db.query<{
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
    }>(dataSql, [...params, pageSize, offset]);

    const items = dataRes.rows.map((r) => ({
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
    }));

    return { total, items, page, pageSize };
  }

  async getStatuses(query: Record<string, string | undefined>) {
    const filters = parseFilters(query);
    const { whereSql, params } = buildWhere(filters);

    const sql = `
      SELECT
        online_status,
        SUM(CASE WHEN device_type <> '报废设备' THEN device_count ELSE 0 END)::bigint AS count
      FROM bi.device_inventory_fact
      ${whereSql}
      GROUP BY online_status
      ORDER BY count DESC
    `;
    const res = await this.db.query<{ online_status: string | null; count: string }>(sql, params);

    return {
      items: res.rows
        .map((r) => ({ onlineStatus: (r.online_status ?? "").trim(), count: toInt(r.count) }))
        .filter((r) => r.onlineStatus),
    };
  }
}
