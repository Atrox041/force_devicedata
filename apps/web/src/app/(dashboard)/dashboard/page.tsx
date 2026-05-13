import Link from "next/link";
import { ChartCard } from "@/components/dashboard/chart-card";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { PlaceholderChart } from "@/components/dashboard/placeholder-chart";
import { topMetrics } from "@/lib/navigation";

const feedRows = [
  {
    orderNo: "PO-2026-0032",
    assetType: "服务器",
    destination: "上海数据中心",
    amount: "128 台",
    status: "已入库",
  },
  {
    orderNo: "SHIP-2026-0148",
    assetType: "交换机",
    destination: "杭州研发中心",
    amount: "64 台",
    status: "已发货",
  },
  {
    orderNo: "PO-2026-0021",
    assetType: "存储设备",
    destination: "深圳机房",
    amount: "28 套",
    status: "审批中",
  },
  {
    orderNo: "SHIP-2026-0136",
    assetType: "办公电脑",
    destination: "北京总部",
    amount: "96 台",
    status: "待签收",
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-2 2xl:grid-cols-4">
        {topMetrics.map((metric) => (
          <KpiCard
            key={metric.label}
            label={metric.label}
            value={metric.value}
            trend={metric.trend}
            tone={metric.tone as "primary" | "secondary" | "success" | "warning"}
          />
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.35fr_1fr]">
        <ChartCard
          title="年度采购与发货趋势"
          description="按月跟踪采购数量、发货执行和异常回落情况。"
          actionLabel="切换维度"
        >
          <PlaceholderChart variant="line" />
        </ChartCard>
        <ChartCard
          title="资产结构总览"
          description="按资产类型拆分当前库存与采购结构。"
          actionLabel="查看资产"
        >
          <PlaceholderChart variant="split" />
        </ChartCard>
      </section>

      <section className="rounded-[24px] border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.16),transparent_24%),rgba(255,255,255,0.04)] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.24)]">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
              Device Entry
            </p>
            <h2 className="mt-3 font-heading text-2xl font-semibold text-slate-50">
              设备总览已预留真实 Excel 接口
            </h2>
            <p className="mt-3 text-sm leading-7 text-slate-400">
              支持从设备在线情况、供应商、计费方式和账户编码维度查看 5G、10G、2G 与 1G 小主机的在线数量，适合作为领导一键跳转的核心入口。
            </p>
          </div>
          <Link
            href="/device-overview"
            className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-sky-400 to-violet-500 px-5 py-3 text-sm font-semibold text-slate-950 shadow-[0_18px_40px_rgba(96,165,250,0.28)] transition hover:brightness-110"
          >
            进入设备总览
          </Link>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_0.92fr]">
        <ChartCard
          title="地点发货排行"
          description="跟踪发货目的地、接收部门与在途波动。"
          actionLabel="导出分析"
        >
          <PlaceholderChart variant="bars" />
        </ChartCard>

        <section className="rounded-[20px] border border-white/10 bg-white/5 p-5 shadow-[0_18px_50px_rgba(0,0,0,0.18)]">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="font-heading text-lg font-semibold text-slate-50">
                最近业务动态
              </h2>
              <p className="mt-1 text-sm text-slate-400">
                采购与发货记录的最新状态，可作为领导简报入口。
              </p>
            </div>
            <button className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-300">
              查看全部
            </button>
          </div>

          <div className="mt-6 overflow-hidden rounded-[18px] border border-white/8">
            <div className="grid grid-cols-[1.2fr_1fr_1.2fr_0.8fr_0.8fr] bg-white/5 px-4 py-3 text-xs uppercase tracking-[0.22em] text-slate-500">
              <span>单号</span>
              <span>资产类型</span>
              <span>去向</span>
              <span>数量</span>
              <span>状态</span>
            </div>
            <div className="divide-y divide-white/6">
              {feedRows.map((row) => (
                <div
                  key={row.orderNo}
                  className="grid grid-cols-[1.2fr_1fr_1.2fr_0.8fr_0.8fr] items-center px-4 py-4 text-sm text-slate-300"
                >
                  <span className="font-medium text-slate-100">{row.orderNo}</span>
                  <span>{row.assetType}</span>
                  <span>{row.destination}</span>
                  <span>{row.amount}</span>
                  <span className="justify-self-start rounded-full border border-sky-400/20 bg-sky-400/10 px-2.5 py-1 text-xs text-sky-200">
                    {row.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </section>
    </div>
  );
}
