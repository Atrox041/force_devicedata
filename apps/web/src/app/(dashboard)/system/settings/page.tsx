import { FeaturePage } from "@/components/dashboard/feature-page";

export default function SettingsPage() {
  return (
    <FeaturePage
      eyebrow="System Settings"
      title="系统设置"
      description="用于配置主题、数据源、导入规则和通知能力。当前以框架页为主，后续接入多标签设置面板和环境配置项。"
      primaryAction={{ href: "/login", label: "回到登录页" }}
    />
  );
}
