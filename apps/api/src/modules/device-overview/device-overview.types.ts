export type DeviceType =
  | "5G设备"
  | "10G设备"
  | "2G设备"
  | "1G小主机"
  | "报废设备";

export type DeviceFilterKey =
  | "purchase"
  | "operation"
  | "onlineStatus"
  | "deviceProvider"
  | "vendor"
  | "billingMode"
  | "accountCode";

export const DEVICE_TYPES: DeviceType[] = [
  "5G设备",
  "10G设备",
  "2G设备",
  "1G小主机",
  "报废设备",
];

export const FILTER_FIELD_CONFIG: Record<
  DeviceFilterKey,
  { label: string; column: string }
> = {
  purchase: { label: "采购", column: "purchase" },
  operation: { label: "运营", column: "operation" },
  onlineStatus: { label: "设备在线情况", column: "online_status" },
  deviceProvider: { label: "设备提供", column: "device_provider" },
  vendor: { label: "供应商", column: "vendor" },
  billingMode: { label: "计费方式", column: "billing_mode" },
  accountCode: { label: "账户编码", column: "account_code" },
};
