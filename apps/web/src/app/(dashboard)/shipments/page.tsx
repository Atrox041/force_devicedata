import { FeaturePage } from "@/components/dashboard/feature-page";

export default function ShipmentsPage() {
  return (
    <FeaturePage
      eyebrow="Shipment Flow"
      title="发货流水"
      description="用于查看发货单列表、地点分布、接收部门排行和单笔流向跟踪。后续会在这个页面接入表格、趋势图和发货状态分层展示。"
      primaryAction={{ href: "/imports", label: "导入发货流水" }}
    />
  );
}
