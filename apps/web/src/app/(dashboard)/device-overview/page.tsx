import Link from "next/link";
import { LayeredDeviceStack } from "@/components/device-overview/layered-device-stack";
import {
  getDeviceOverviewDistribution,
  getDeviceOverviewStatuses,
  getDeviceOverviewSummary,
  getDeviceOverviewTable,
  getDeviceOverviewVendors,
} from "@/lib/api/device-overview";

export const dynamic = "force-dynamic";

type DeviceOverviewPageProps = {
  searchParams?: Record<string, string | string[] | undefined>;
};

function getSearchParam(
  value: string | string[] | undefined,
): string | undefined {
  if (!value) return undefined;
  if (Array.isArray(value)) return value[0];
  return value;
}

export default async function DeviceOverviewPage({
  searchParams,
}: DeviceOverviewPageProps) {
  const activeOnlineStatus = getSearchParam(searchParams?.onlineStatus)?.trim();
  const appliedFilters = activeOnlineStatus ? { onlineStatus: activeOnlineStatus } : undefined;

  const [summary, distribution, vendors, table, statuses] = await Promise.all([
    getDeviceOverviewSummary(appliedFilters),
    getDeviceOverviewDistribution(appliedFilters),
    getDeviceOverviewVendors(appliedFilters),
    getDeviceOverviewTable({ ...appliedFilters, page: 1, pageSize: 8 }),
    getDeviceOverviewStatuses(),
  ]);

  return (
    <div className="space-y-6">
      <section className="rounded-[28px] border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.16),transparent_26%),rgba(255,255,255,0.04)] p-6 shadow-[0_24px_70px_rgba(0,0,0,0.28)]">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-3xl">
            <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
              Device Overview
            </p>
            <h2 className="mt-3 font-heading text-3xl font-semibold text-slate-50">
              设备在线总览
            </h2>
            <p className="mt-3 text-sm leading-7 text-slate-400">
              面向领导的设备状态入口，聚合 5G、10G、2G、1G 小主机和报废设备的在线情况，并提供供应商、运营和账户编码维度的筛选分析。
            </p>
            <p className="mt-3 text-xs text-slate-500">
              供应商 {summary.totalVendors} · 账户编码 {summary.totalAccounts}
            </p>
            <p className="mt-2 text-xs text-slate-500">
              当前状态：{activeOnlineStatus ? (
                <span className="text-slate-200">{activeOnlineStatus}</span>
              ) : (
                <span className="text-slate-200">全部</span>
              )}{" "}
              · 设备数{" "}
              <span className="text-slate-200">{summary.totalDevices}</span>
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/device-overview"
              className={`rounded-full border px-4 py-2 text-sm transition ${
                activeOnlineStatus
                  ? "border-white/10 bg-white/5 text-slate-300 hover:border-sky-400/30 hover:bg-sky-400/10 hover:text-slate-100"
                  : "border-sky-400/30 bg-sky-400/10 text-slate-100"
              }`}
            >
              全部状态
            </Link>
            {statuses.items.slice(0, 8).map((item) => {
              const isActive = item.onlineStatus === activeOnlineStatus;
              const href = `/device-overview?onlineStatus=${encodeURIComponent(item.onlineStatus)}`;
              return (
                <Link
                  key={item.onlineStatus}
                  href={href}
                  className={`rounded-full border px-4 py-2 text-sm transition ${
                    isActive
                      ? "border-sky-400/30 bg-sky-400/10 text-slate-100"
                      : "border-white/10 bg-white/5 text-slate-300 hover:border-sky-400/30 hover:bg-sky-400/10 hover:text-slate-100"
                  }`}
                >
                  <span className="inline-flex items-center gap-2">
                    <span>{item.onlineStatus}</span>
                    <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-xs text-slate-200">
                      {item.count}
                    </span>
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 2xl:grid-cols-4">
        <article className="rounded-[20px] border border-white/10 bg-white/5 p-5">
          <p className="text-sm text-slate-400">设备总数</p>
          <p className="mt-3 font-heading text-4xl font-semibold text-slate-50">
            {summary.totalDevices}
          </p>
          <p className="mt-3 text-sm text-slate-400">包含在线、离线与异常状态</p>
        </article>
        <article className="rounded-[20px] border border-white/10 bg-white/5 p-5">
          <p className="text-sm text-slate-400">在线服役</p>
          <p className="mt-3 font-heading text-4xl font-semibold text-slate-50">
            {summary.onlineServiceDevices}
          </p>
          <p className="mt-3 text-sm text-emerald-300">onlineStatus = 在线服役</p>
        </article>
        <article className="rounded-[20px] border border-white/10 bg-white/5 p-5">
          <p className="text-sm text-slate-400">未回寄 / 待回库</p>
          <p className="mt-3 font-heading text-4xl font-semibold text-slate-50">
            {summary.notReturnedDevices}
          </p>
          <p className="mt-3 text-sm text-amber-300">包含 待设备回库 / 待回寄 等状态</p>
        </article>
        <article className="rounded-[20px] border border-white/10 bg-white/5 p-5">
          <p className="text-sm text-slate-400">报废设备</p>
          <p className="mt-3 font-heading text-4xl font-semibold text-slate-50">
            {summary.totalScrappedDevices}
          </p>
          <p className="mt-3 text-sm text-slate-400">用于设备处置跟踪</p>
        </article>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <LayeredDeviceStack items={summary.deviceStats} />

        <div className="space-y-6">
          <section className="rounded-[24px] border border-white/10 bg-white/5 p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="font-heading text-xl font-semibold text-slate-50">
                  设备类型分布
                </h3>
                <p className="mt-1 text-sm text-slate-400">
                  当前为按设备类型汇总的总量分布，可结合顶部在线状态筛选。
                </p>
              </div>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300">
                /distribution
              </span>
            </div>

            <div className="mt-6 space-y-4">
              {distribution.items.map((item) => (
                <div key={item.type}>
                  <div className="flex items-center justify-between text-sm text-slate-300">
                    <span>{item.type}</span>
                    <span>{item.count} 台</span>
                  </div>
                  <div className="mt-2 h-2 rounded-full bg-white/8">
                    <div
                      className="h-2 rounded-full bg-gradient-to-r from-sky-400 to-violet-500"
                      style={{
                        width: `${Math.max(
                          8,
                          (item.count / Math.max(1, summary.totalDevices)) * 100,
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-[24px] border border-white/10 bg-white/5 p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="font-heading text-xl font-semibold text-slate-50">
                  供应商在线设备排行
                </h3>
                <p className="mt-1 text-sm text-slate-400">
                  适合做供应商维度对比和成本归属分析。
                </p>
              </div>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300">
                /vendors
              </span>
            </div>

            <div className="mt-6 space-y-3">
              {vendors.items.map((item, index) => (
                <div
                  key={item.vendor}
                  className="flex items-center justify-between rounded-2xl border border-white/8 bg-white/4 px-4 py-3"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/6 text-xs text-slate-300">
                      {index + 1}
                    </span>
                    <span className="text-sm text-slate-200">{item.vendor}</span>
                  </div>
                  <span className="text-sm font-semibold text-slate-100">
                    {item.count} 台
                  </span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </section>

      <section className="rounded-[24px] border border-white/10 bg-white/5 p-5 shadow-[0_18px_50px_rgba(0,0,0,0.18)]">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="font-heading text-xl font-semibold text-slate-50">
              在线设备明细
            </h3>
            <p className="mt-1 text-sm text-slate-400">
              对应后端 `/table` 接口，可筛选运营、供应商、计费方式和账户编码。
            </p>
          </div>
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300">
            /table
          </span>
        </div>

        <div className="mt-6 overflow-x-auto rounded-[18px] border border-white/8">
          <div className="min-w-[980px]">
            <div className="grid grid-cols-[1fr_0.9fr_0.8fr_0.9fr_0.8fr_0.9fr_0.7fr_0.7fr_0.7fr_0.9fr_0.7fr] bg-white/5 px-4 py-3 text-xs uppercase tracking-[0.2em] text-slate-500">
              <span>运营</span>
              <span>在线情况</span>
              <span>提供方</span>
              <span>供应商</span>
              <span>计费方式</span>
              <span>账户编码</span>
              <span>5G</span>
              <span>10G</span>
              <span>2G</span>
              <span>1G小主机</span>
              <span>报废</span>
            </div>
            <div className="divide-y divide-white/6">
              {table.items.map((item) => (
                <div
                  key={`${item.operation}-${item.accountCode}`}
                  className="grid grid-cols-[1fr_0.9fr_0.8fr_0.9fr_0.8fr_0.9fr_0.7fr_0.7fr_0.7fr_0.9fr_0.7fr] items-center px-4 py-4 text-sm text-slate-300"
                >
                  <span className="font-medium text-slate-100">{item.operation}</span>
                  <span>{item.onlineStatus}</span>
                  <span>{item.provider}</span>
                  <span>{item.vendor}</span>
                  <span>{item.billingMode}</span>
                  <span>{item.accountCode}</span>
                  <span>{item.device5g}</span>
                  <span>{item.device10g}</span>
                  <span>{item.device2g}</span>
                  <span>{item.device1g}</span>
                  <span>{item.scrapped}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
