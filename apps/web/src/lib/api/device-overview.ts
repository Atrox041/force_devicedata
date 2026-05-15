import "server-only";

import {
  DeviceFilterOptionsResponse,
  DeviceDistributionItem,
  DeviceOverviewFilters,
  DeviceOverviewSummary,
  DeviceOverviewTableResponse,
  DeviceOnlineStatusItem,
  DeviceVendorItem,
} from "@/types/device-overview";

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL
  ?.trim()
  .replace(/^['"`\s]+|['"`\s]+$/g, "")
  .replace(/\/$/, "");
const useMockData = process.env.NEXT_PUBLIC_USE_MOCK_DATA !== "false";

const mockSummary: DeviceOverviewSummary = {
  totalDevices: 1645,
  totalOnlineDevices: 1326,
  totalScrappedDevices: 74,
  totalVendors: 6,
  totalAccounts: 14,
  onlineServiceDevices: 1184,
  notReturnedDevices: 142,
  appliedFilters: {
    purchase: [],
    operation: [],
    onlineStatus: [],
    deviceProvider: [],
    vendor: [],
    billingMode: [],
    accountCode: [],
    deviceTypes: ["5G设备", "10G设备", "2G设备", "1G小主机", "报废设备"],
  },
  deviceStats: [
    { type: "5G设备", count: 486, onlineCount: 452, utilization: 93 },
    { type: "10G设备", count: 332, onlineCount: 316, utilization: 95 },
    { type: "2G设备", count: 241, onlineCount: 218, utilization: 90 },
    { type: "1G小主机", count: 193, onlineCount: 182, utilization: 94 },
    { type: "报废设备", count: 74, onlineCount: 0, utilization: 0 },
  ],
};

const mockDistribution: DeviceDistributionItem[] = mockSummary.deviceStats.map(
  ({ type, onlineCount }) => ({ type, count: onlineCount }),
);

const mockVendors: DeviceVendorItem[] = [
  { vendor: "供应商A", count: 328 },
  { vendor: "供应商B", count: 274 },
  { vendor: "供应商C", count: 243 },
  { vendor: "供应商D", count: 211 },
  { vendor: "供应商E", count: 170 },
];

const mockTable: DeviceOverviewTableResponse = {
  total: 4,
  items: [
    {
      purchase: "2024采购",
      operation: "华东运营",
      onlineStatus: "在线",
      provider: "自有",
      vendor: "供应商A",
      billingMode: "包月",
      accountCode: "ACC-1001",
      device5g: 32,
      device10g: 14,
      device2g: 6,
      device1g: 8,
      scrapped: 1,
    },
    {
      purchase: "2024采购",
      operation: "华北运营",
      onlineStatus: "在线",
      provider: "托管",
      vendor: "供应商B",
      billingMode: "按量",
      accountCode: "ACC-1003",
      device5g: 18,
      device10g: 22,
      device2g: 10,
      device1g: 6,
      scrapped: 0,
    },
    {
      purchase: "2023采购",
      operation: "华南运营",
      onlineStatus: "部分异常",
      provider: "自有",
      vendor: "供应商C",
      billingMode: "包月",
      accountCode: "ACC-1012",
      device5g: 20,
      device10g: 8,
      device2g: 9,
      device1g: 7,
      scrapped: 3,
    },
    {
      purchase: "2022采购",
      operation: "西南运营",
      onlineStatus: "在线",
      provider: "合作方",
      vendor: "供应商D",
      billingMode: "按量",
      accountCode: "ACC-1021",
      device5g: 12,
      device10g: 10,
      device2g: 4,
      device1g: 9,
      scrapped: 2,
    },
  ],
};

const mockStatuses: DeviceOnlineStatusItem[] = [
  { onlineStatus: "在线服役", count: 1184 },
  { onlineStatus: "资源暂停待恢复", count: 216 },
  { onlineStatus: "库存", count: 143 },
  { onlineStatus: "资源下线待设备回库", count: 142 },
  { onlineStatus: "旧设备回收", count: 74 },
];

function buildQuery(filters?: DeviceOverviewFilters) {
  const params = new URLSearchParams();

  if (!filters) {
    return "";
  }

  Object.entries(filters).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      if (value.length) {
        params.set(key, value.join(","));
      }
      return;
    }
    if (value !== undefined && value !== null) {
      params.set(key, String(value));
    }
  });

  const query = params.toString();
  return query ? `?${query}` : "";
}

async function fetchApi<T>(path: string, fallback: T): Promise<T> {
  if (!baseUrl || useMockData) {
    return fallback;
  }

  try {
    const response = await fetch(`${baseUrl}${path}`, {
      cache: "no-store",
    });

    if (!response.ok) {
      return fallback;
    }

    return (await response.json()) as T;
  } catch {
    return fallback;
  }
}

export async function getDeviceOverviewSummary(
  filters?: DeviceOverviewFilters,
) {
  return fetchApi<DeviceOverviewSummary>(
    `/api/dashboard/device-overview/summary${buildQuery(filters)}`,
    mockSummary,
  );
}

export async function getDeviceOverviewDistribution(
  filters?: DeviceOverviewFilters,
) {
  return fetchApi<{ items: DeviceDistributionItem[] }>(
    `/api/dashboard/device-overview/distribution${buildQuery(filters)}`,
    { items: mockDistribution },
  );
}

export async function getDeviceOverviewVendors(
  filters?: DeviceOverviewFilters,
) {
  return fetchApi<{ items: DeviceVendorItem[] }>(
    `/api/dashboard/device-overview/vendors${buildQuery(filters)}`,
    { items: mockVendors },
  );
}

export async function getDeviceOverviewTable(filters?: DeviceOverviewFilters) {
  return fetchApi<DeviceOverviewTableResponse>(
    `/api/dashboard/device-overview/table${buildQuery(filters)}`,
    mockTable,
  );
}

export async function getDeviceOverviewStatuses(filters?: DeviceOverviewFilters) {
  return fetchApi<{ items: DeviceOnlineStatusItem[] }>(
    `/api/dashboard/device-overview/statuses${buildQuery(filters)}`,
    { items: mockStatuses },
  );
}

export async function getDeviceOverviewFilterOptions(filters?: DeviceOverviewFilters) {
  return fetchApi<DeviceFilterOptionsResponse>(
    `/api/dashboard/device-overview/filter-options${buildQuery(filters)}`,
    {
      fields: {
        purchase: { label: "采购", items: [] },
        operation: { label: "运营", items: [] },
        onlineStatus: { label: "设备在线情况", items: mockStatuses.map((item) => ({ ...item, value: item.onlineStatus, label: item.onlineStatus })) },
        deviceProvider: { label: "设备提供", items: [] },
        vendor: { label: "供应商", items: mockVendors.map((item) => ({ ...item, value: item.vendor, label: item.vendor })) },
        billingMode: { label: "计费方式", items: [] },
        accountCode: { label: "账户编码", items: [] },
      },
      deviceTypes: mockSummary.deviceStats.map((item) => ({ value: item.type, label: item.type })),
    },
  );
}
