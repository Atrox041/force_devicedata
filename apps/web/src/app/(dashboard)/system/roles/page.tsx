import { FeaturePage } from "@/components/dashboard/feature-page";

export default function RolesPage() {
  return (
    <FeaturePage
      eyebrow="Role Permissions"
      title="角色权限"
      description="用于维护菜单权限、数据范围和页面访问控制，后续会扩展为更清晰的角色能力矩阵与分配面板。"
      primaryAction={{ href: "/system/settings", label: "系统设置" }}
    />
  );
}
