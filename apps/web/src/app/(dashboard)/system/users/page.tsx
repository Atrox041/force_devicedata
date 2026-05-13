import { FeaturePage } from "@/components/dashboard/feature-page";

export default function UsersPage() {
  return (
    <FeaturePage
      eyebrow="User Management"
      title="用户管理"
      description="用于维护用户列表、账号状态、角色绑定和最近登录情况，后续会接入真实权限接口与用户状态操作。"
      primaryAction={{ href: "/system/roles", label: "查看角色权限" }}
    />
  );
}
