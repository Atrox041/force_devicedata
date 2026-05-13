import { FeaturePage } from "@/components/dashboard/feature-page";

export default function ImportTemplatesPage() {
  return (
    <FeaturePage
      eyebrow="Import Templates"
      title="导入模板"
      description="用于保存同类 Excel 的字段模板、识别规则和默认映射配置，减少重复导入时的人工处理成本。"
      primaryAction={{ href: "/imports", label: "返回导入中心" }}
    />
  );
}
