import { FeaturePage } from "@/components/dashboard/feature-page";

export default function ImportMappingsPage() {
  return (
    <FeaturePage
      eyebrow="Field Mapping"
      title="字段映射"
      description="用于管理 Excel 原始字段与系统标准字段的映射关系，配置字段类型、筛选能力和统计能力。后续会扩展为三栏式字段映射工作台。"
      primaryAction={{ href: "/imports/templates", label: "管理导入模板" }}
    />
  );
}
