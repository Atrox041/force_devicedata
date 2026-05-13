export type NavItem = {
  href: string;
  label: string;
  badge?: string;
};

export type NavGroup = {
  title: string;
  items: NavItem[];
};

export const navGroups: NavGroup[] = [
  {
    title: "总览",
    items: [
      { href: "/dashboard", label: "Dashboard" },
      { href: "/device-overview", label: "设备总览", badge: "Live" },
    ],
  },
  {
    title: "资产数据",
    items: [
      { href: "/assets", label: "资产台账" },
      { href: "/procurement", label: "采购分析" },
      { href: "/shipments", label: "发货流水" },
    ],
  },
  {
    title: "数据接入",
    items: [
      { href: "/imports", label: "导入中心", badge: "AI" },
      { href: "/imports/mappings", label: "字段映射" },
      { href: "/imports/templates", label: "导入模板" },
    ],
  },
  {
    title: "系统管理",
    items: [
      { href: "/system/users", label: "用户管理" },
      { href: "/system/roles", label: "角色权限" },
      { href: "/system/settings", label: "系统设置" },
    ],
  },
];

export const topMetrics = [
  { label: "资产总量", value: "12,684", trend: "+8.4%", tone: "primary" },
  { label: "年度采购", value: "1,286", trend: "+12.1%", tone: "secondary" },
  { label: "发货总量", value: "968", trend: "+5.2%", tone: "success" },
  { label: "异常资产", value: "34", trend: "-2.3%", tone: "warning" },
];
