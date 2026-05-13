import { FeaturePage } from "@/components/dashboard/feature-page";

export default function AssetsPage() {
  return (
    <FeaturePage
      eyebrow="Assets Ledger"
      title="资产台账"
      description="这里将承载资产列表、筛选栏、批量导入导出、详情抽屉和状态标签。当前先完成统一视觉骨架，后续接入动态字段表格与资产详情页。"
      primaryAction={{ href: "/imports", label: "批量导入资产" }}
    />
  );
}
