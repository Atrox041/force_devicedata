import { AppHeader } from "@/components/layout/app-header";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { MobileNav } from "@/components/layout/mobile-nav";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="flex min-h-screen">
        <AppSidebar />
        <div className="flex min-h-screen flex-1 flex-col">
          <AppHeader
            title="运营总览工作台"
            description="聚合资产、采购、发货与导入任务，构建统一的领导汇报与后台操作体验。"
          />
          <main className="flex-1 px-5 py-6 sm:px-8 lg:pb-8">
            <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-6">
              {children}
            </div>
          </main>
        </div>
      </div>
      <MobileNav />
    </div>
  );
}
