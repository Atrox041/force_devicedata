import { FeaturePage } from "@/components/dashboard/feature-page";

export default function ProcurementPage() {
  return (
    <FeaturePage
      eyebrow="Procurement Analytics"
      title="采购分析"
      description="用于查看年度采购趋势、供应商占比、资产类型结构和采购明细。当前骨架已预留统一分析页样式，后续接入真实指标卡、趋势图与明细联动。"
      primaryAction={{ href: "/dashboard", label: "查看总览联动" }}
    />
  );
}
