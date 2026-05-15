export type DeviceTypeKey =
  | "5G设备"
  | "10G设备"
  | "2G设备"
  | "1G小主机"
  | "报废设备";

export type DeviceOverviewFilters = {
  purchase?: string[];
  operation?: string[];
  onlineStatus?: string[];
  deviceProvider?: string[];
  vendor?: string[];
  billingMode?: string[];
  accountCode?: string[];
  deviceTypes?: DeviceTypeKey[];
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
  totalDevices: number;
  totalOnlineDevices: number;
  totalScrappedDevices: number;
  totalVendors: number;
  totalAccounts: number;
  onlineServiceDevices: number;
  notReturnedDevices: number;
  deviceStats: DeviceStat[];
  appliedFilters: Record<string, string[]>;
};

export type DeviceDistributionItem = {
  type: DeviceTypeKey;
  count: number;
};

export type DeviceVendorItem = {
  vendor: string;
  count: number;
};

export type DeviceOnlineStatusItem = {
  onlineStatus: string;
  count: number;
};

export type DeviceFilterOptionItem = {
  value: string;
  label: string;
  count: number;
};

export type DeviceFilterOptionGroup = {
  label: string;
  items: DeviceFilterOptionItem[];
};

export type DeviceFilterOptionsResponse = {
  fields: Record<string, DeviceFilterOptionGroup>;
  deviceTypes: Array<{ value: DeviceTypeKey; label: string }>;
};

export type DeviceOverviewTableItem = {
  purchase: string;
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
