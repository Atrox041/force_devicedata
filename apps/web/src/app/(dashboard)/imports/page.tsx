import { FeaturePage } from "@/components/dashboard/feature-page";

export default function ImportsPage() {
  return (
    <FeaturePage
      eyebrow="Import Center"
      title="导入中心"
      description="用于上传 Excel、识别表头、校验数据、查看导入记录和状态反馈。该页面后续会成为动态字段与原样导入能力的核心入口。"
      primaryAction={{ href: "/imports/mappings", label: "查看字段映射" }}
    />
  );
}
