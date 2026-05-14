import "server-only";

import {
  DeviceDistributionItem,
  DeviceOverviewFilters,
  DeviceOverviewSummary,
  DeviceOverviewTableResponse,
  DeviceVendorItem,
} from "@/types/device-overview";

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "");
const useMockData = process.env.NEXT_PUBLIC_USE_MOCK_DATA !== "false";

const mockSummary: DeviceOverviewSummary = {
  totalDevices: 1645,
  totalOnlineDevices: 1326,
  totalScrappedDevices: 74,
  totalVendors: 6,
  totalAccounts: 14,
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

function buildQuery(filters?: DeviceOverviewFilters) {
  const params = new URLSearchParams();

  if (!filters) {
    return "";
  }

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
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
