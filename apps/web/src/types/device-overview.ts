export type DeviceTypeKey =
  | "5G设备"
  | "10G设备"
  | "2G设备"
  | "1G小主机"
  | "报废设备";

export type DeviceOverviewFilters = {
  operation?: string;
  vendor?: string;
  billingMode?: string;
  onlineStatus?: string;
  accountCode?: string;
  page?: number;
  pageSize?: number;
};

export type DeviceStat = {
  type: DeviceTypeKey;
  count: number;
  onlineCount: number;
  utilization: number;
};

export type DeviceOverviewSummary = {
  totalOnlineDevices: number;
  totalScrappedDevices: number;
  totalVendors: number;
  totalAccounts: number;
  deviceStats: DeviceStat[];
};

export type DeviceDistributionItem = {
  type: DeviceTypeKey;
  count: number;
};

export type DeviceVendorItem = {
  vendor: string;
  count: number;
};

export type DeviceOverviewTableItem = {
  operation: string;
  onlineStatus: string;
  provider: string;
  vendor: string;
  billingMode: string;
  accountCode: string;
  device5g: number;
  device10g: number;
  device2g: number;
  device1g: number;
  scrapped: number;
};

export type DeviceOverviewTableResponse = {
  total: number;
  items: DeviceOverviewTableItem[];
};
