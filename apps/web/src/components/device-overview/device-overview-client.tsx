"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { LayeredDeviceStack } from "@/components/device-overview/layered-device-stack";
import { EChart } from "@/components/charts/echart";
import type {
  DeviceDistributionItem,
  DeviceFilterOptionGroup,
  DeviceFilterOptionsResponse,
  DeviceOverviewFilters,
  DeviceOverviewSummary,
  DeviceOverviewTableResponse,
  DeviceTypeKey,
  DeviceVendorItem,
} from "@/types/device-overview";

type LoadState = "idle" | "loading" | "ready" | "error";
type FilterKey =
  | "purchase"
  | "operation"
  | "onlineStatus"
  | "deviceProvider"
  | "vendor"
  | "billingMode"
  | "accountCode";

type FilterState = Record<FilterKey, string[]> & {
  deviceTypes: DeviceTypeKey[];
};

const FILTER_KEYS: FilterKey[] = [
  "purchase",
  "operation",
  "onlineStatus",
  "deviceProvider",
  "vendor",
  "billingMode",
  "accountCode",
];

const FILTER_TITLES: Record<FilterKey, string> = {
  purchase: "采购",
  operation: "运营",
  onlineStatus: "设备在线情况",
  deviceProvider: "设备提供",
  vendor: "供应商",
  billingMode: "计费方式",
  accountCode: "账户编码",
};

const EMPTY_FILTERS: FilterState = {
  purchase: [],
  operation: [],
  onlineStatus: [],
  deviceProvider: [],
  vendor: [],
  billingMode: [],
  accountCode: [],
  deviceTypes: ["5G设备", "10G设备", "2G设备", "1G小主机", "报废设备"],
};

function getApiBaseUrl() {
  const configuredBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL
    ?.trim()
    .replace(/^['"`\s]+|['"`\s]+$/g, "")
    .replace(/\/$/, "");
  if (configuredBaseUrl) {
    return configuredBaseUrl;
  }

  if (typeof window !== "undefined") {
    return `${window.location.protocol}//${window.location.hostname}:3001`;
  }

  return "";
}

function buildQuery(filters: DeviceOverviewFilters) {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      if (value.length) params.set(key, value.join(","));
      return;
    }
    if (value !== undefined && value !== null) {
      params.set(key, String(value));
    }
  });
  const query = params.toString();
  return query ? `?${query}` : "";
}

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || `HTTP ${response.status}`);
  }
  return (await response.json()) as T;
}

function compactFilters(filters: FilterState): DeviceOverviewFilters {
  return {
    purchase: filters.purchase,
    operation: filters.operation,
    onlineStatus: filters.onlineStatus,
    deviceProvider: filters.deviceProvider,
    vendor: filters.vendor,
    billingMode: filters.billingMode,
    accountCode: filters.accountCode,
    deviceTypes: filters.deviceTypes,
  };
}

function countActiveFilters(filters: FilterState) {
  return FILTER_KEYS.reduce((sum, key) => sum + filters[key].length, 0);
}

function MultiSelectFilter({
  title,
  items,
  selected,
  onToggle,
  onClear,
}: {
  title: string;
  items: DeviceFilterOptionGroup["items"];
  selected: string[];
  onToggle: (value: string) => void;
  onClear: () => void;
}) {
  const [keyword, setKeyword] = useState("");
  const visibleItems = useMemo(() => {
    const normalized = keyword.trim().toLowerCase();
    if (!normalized) return items;
    return items.filter((item) => item.label.toLowerCase().includes(normalized));
  }, [items, keyword]);

  return (
    <details className="group rounded-2xl border border-white/10 bg-white/5 p-4 open:bg-white/7">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{title}</p>
          <p className="mt-2 text-sm text-slate-100">
            {selected.length ? `已选 ${selected.length} 项` : "未设置"}
          </p>
        </div>
        <span className="rounded-full border border-white/10 bg-white/5 px-2 py-1 text-xs text-slate-300">
          {items.length}
        </span>
      </summary>

      <div className="mt-4 space-y-3">
        <div className="flex items-center gap-2">
          <input
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
            placeholder={`搜索${title}`}
            className="h-10 flex-1 rounded-xl border border-white/10 bg-slate-950/40 px-3 text-sm text-slate-100 outline-none placeholder:text-slate-500 focus:border-sky-400/30"
          />
          <button
            type="button"
            onClick={onClear}
            className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-slate-300 hover:border-white/20"
          >
            清空
          </button>
        </div>

        <div className="max-h-60 space-y-2 overflow-auto pr-1">
          {visibleItems.map((item) => {
            const checked = selected.includes(item.value);
            return (
              <label
                key={item.value}
                className={`flex cursor-pointer items-center justify-between rounded-xl border px-3 py-2 text-sm transition ${
                  checked
                    ? "border-sky-400/30 bg-sky-400/10 text-slate-50"
                    : "border-white/8 bg-white/4 text-slate-300 hover:border-white/15 hover:bg-white/6"
                }`}
              >
                <span className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => onToggle(item.value)}
                    className="h-4 w-4 rounded border-white/20 bg-transparent"
                  />
                  <span>{item.label}</span>
                </span>
                <span className="text-xs text-slate-400">{item.count}</span>
              </label>
            );
          })}
          {!visibleItems.length ? (
            <div className="rounded-xl border border-dashed border-white/10 px-3 py-6 text-center text-sm text-slate-500">
              没有匹配项
            </div>
          ) : null}
        </div>
      </div>
    </details>
  );
}

export function DeviceOverviewClient() {
  const apiBaseUrl = useMemo(() => getApiBaseUrl(), []);
  const canCallApi = Boolean(apiBaseUrl);

  const [state, setState] = useState<LoadState>("idle");
  const [error, setError] = useState<string | null>(null);
  const [lastUpdatedAt, setLastUpdatedAt] = useState<number | null>(null);
  const [filters, setFilters] = useState<FilterState>(EMPTY_FILTERS);
  const [summary, setSummary] = useState<DeviceOverviewSummary | null>(null);
  const [distribution, setDistribution] = useState<DeviceDistributionItem[]>([]);
  const [vendors, setVendors] = useState<DeviceVendorItem[]>([]);
  const [table, setTable] = useState<DeviceOverviewTableResponse | null>(null);
  const [filterOptions, setFilterOptions] = useState<DeviceFilterOptionsResponse | null>(null);

  const effectiveFilters = useMemo(() => compactFilters(filters), [filters]);
  const activeFilterCount = useMemo(() => countActiveFilters(filters), [filters]);

  useEffect(() => {
    if (!canCallApi) {
      setState("error");
      setError("未配置 NEXT_PUBLIC_API_BASE_URL，无法从后端拉取真实数据。");
      return;
    }

    const query = buildQuery({ ...effectiveFilters, page: 1, pageSize: 12 });
    setState("loading");
    setError(null);

    Promise.all([
      fetchJson<DeviceOverviewSummary>(`${apiBaseUrl}/api/dashboard/device-overview/summary${query}`),
      fetchJson<{ items: DeviceDistributionItem[] }>(
        `${apiBaseUrl}/api/dashboard/device-overview/distribution${query}`,
      ),
      fetchJson<{ items: DeviceVendorItem[] }>(
        `${apiBaseUrl}/api/dashboard/device-overview/vendors${query}`,
      ),
      fetchJson<DeviceOverviewTableResponse>(
        `${apiBaseUrl}/api/dashboard/device-overview/table${query}`,
      ),
      fetchJson<DeviceFilterOptionsResponse>(
        `${apiBaseUrl}/api/dashboard/device-overview/filter-options${buildQuery(effectiveFilters)}`,
      ),
    ])
      .then(([summaryRes, distributionRes, vendorsRes, tableRes, optionsRes]) => {
        setSummary(summaryRes);
        setDistribution(distributionRes.items);
        setVendors(vendorsRes.items);
        setTable(tableRes);
        setFilterOptions(optionsRes);
        setState("ready");
        setLastUpdatedAt(Date.now());
      })
      .catch((e: unknown) => {
        setState("error");
        setError(e instanceof Error ? e.message : "拉取数据失败");
      });
  }, [apiBaseUrl, canCallApi, effectiveFilters]);

  function toggleFilterValue(key: FilterKey, value: string) {
    setFilters((current) => ({
      ...current,
      [key]: current[key].includes(value)
        ? current[key].filter((item) => item !== value)
        : [...current[key], value],
    }));
  }

  function clearFilter(key: FilterKey) {
    setFilters((current) => ({ ...current, [key]: [] }));
  }

  function toggleDeviceType(type: DeviceTypeKey) {
    setFilters((current) => {
      const nextSelected = current.deviceTypes.includes(type)
        ? current.deviceTypes.filter((item) => item !== type)
        : [...current.deviceTypes, type];

      return {
        ...current,
        deviceTypes: nextSelected.length ? nextSelected : current.deviceTypes,
      };
    });
  }

  function resetAllFilters() {
    setFilters(EMPTY_FILTERS);
  }

  const distributionOption = useMemo(() => {
    const total = distribution.reduce((sum, item) => sum + item.count, 0);
    return {
      backgroundColor: "transparent",
      grid: { left: 10, right: 10, top: 18, bottom: 0, containLabel: true },
      tooltip: { trigger: "axis", axisPointer: { type: "shadow" } },
      xAxis: {
        type: "value",
        axisLine: { lineStyle: { color: "rgba(148,163,184,0.24)" } },
        splitLine: { lineStyle: { color: "rgba(148,163,184,0.10)" } },
      },
      yAxis: {
        type: "category",
        data: distribution.map((item) => item.type),
        axisLine: { lineStyle: { color: "rgba(148,163,184,0.24)" } },
        axisLabel: { color: "rgba(226,232,240,0.85)" },
      },
      series: [
        {
          type: "bar",
          data: distribution.map((item) => item.count),
          barWidth: 16,
          showBackground: true,
          backgroundStyle: { color: "rgba(255,255,255,0.05)" },
          itemStyle: {
            borderRadius: [10, 10, 10, 10],
            color: {
              type: "linear",
              x: 0,
              y: 0,
              x2: 1,
              y2: 0,
              colorStops: [
                { offset: 0, color: "#22d3ee" },
                { offset: 1, color: "#8b5cf6" },
              ],
            },
          },
          label: {
            show: true,
            position: "right",
            color: "rgba(226,232,240,0.9)",
            formatter: (params: { value: number }) =>
              total ? `${params.value} (${Math.round((params.value / total) * 100)}%)` : `${params.value}`,
          },
        },
      ],
    };
  }, [distribution]);

  return (
    <div className="space-y-6">
      <section className="rounded-[30px] border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.16),transparent_22%),radial-gradient(circle_at_top_right,rgba(139,92,246,0.12),transparent_28%),rgba(255,255,255,0.03)] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.28)]">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-4xl">
            <p className="text-xs uppercase tracking-[0.26em] text-slate-500">Device Analysis Workbench</p>
            <h2 className="mt-3 font-heading text-4xl font-semibold text-slate-50">设备在线分析工作台</h2>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-400">
              现在不是固定死展示，而是按你选中的采购、运营、在线情况、设备提供、供应商、计费方式、账户编码和设备类型实时计算。
              上面的条件一改，下面的指标、图表和明细一起刷新。
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-slate-500">
              <span>已启用 {activeFilterCount} 个维度筛选</span>
              <span>设备类型 {filters.deviceTypes.length} / 5</span>
              {lastUpdatedAt ? <span>最后刷新 {new Date(lastUpdatedAt).toLocaleString()}</span> : null}
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/imports"
              className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm text-slate-200 transition hover:border-white/20 hover:bg-white/8"
            >
              去导入数据
            </Link>
            <button
              type="button"
              onClick={resetAllFilters}
              className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm text-slate-200 transition hover:border-rose-400/30 hover:bg-rose-400/10"
            >
              重置全部条件
            </button>
          </div>
        </div>
      </section>

      {!canCallApi ? (
        <section className="rounded-[24px] border border-amber-400/30 bg-amber-400/10 p-5 text-sm text-amber-200">
          未配置 `NEXT_PUBLIC_API_BASE_URL`，无法从后端拉取真实数据。请先在前端 `.env.local` 设置后重启。
        </section>
      ) : null}

      {state === "error" ? (
        <section className="rounded-[24px] border border-rose-400/30 bg-rose-400/10 p-5 text-sm text-rose-200">
          {error ?? "加载失败"}
        </section>
      ) : null}

      <section className="grid gap-6 2xl:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-[28px] border border-white/10 bg-white/5 p-5 shadow-[0_18px_50px_rgba(0,0,0,0.18)]">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h3 className="font-heading text-2xl font-semibold text-slate-50">多字段筛选器</h3>
              <p className="mt-2 text-sm text-slate-400">每个字段支持多选，适合组合分析和交叉验证。</p>
            </div>
            {state === "loading" ? (
              <span className="rounded-full border border-sky-400/20 bg-sky-400/10 px-3 py-1 text-xs text-sky-200">
                数据刷新中
              </span>
            ) : null}
          </div>

          <div className="mt-6 grid gap-4 xl:grid-cols-2">
            {FILTER_KEYS.map((key) => (
              <MultiSelectFilter
                key={key}
                title={FILTER_TITLES[key]}
                items={filterOptions?.fields[key]?.items ?? []}
                selected={filters[key]}
                onToggle={(value) => toggleFilterValue(key, value)}
                onClear={() => clearFilter(key)}
              />
            ))}
          </div>
        </div>

        <div className="rounded-[28px] border border-white/10 bg-white/5 p-5 shadow-[0_18px_50px_rgba(0,0,0,0.18)]">
          <h3 className="font-heading text-2xl font-semibold text-slate-50">设备类型选择</h3>
          <p className="mt-2 text-sm text-slate-400">5 个设备列不再当死数据展示，而是作为分析范围动态切换。</p>

          <div className="mt-5 flex flex-wrap gap-3">
            {(filterOptions?.deviceTypes ?? []).map((item) => {
              const active = filters.deviceTypes.includes(item.value);
              return (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => toggleDeviceType(item.value)}
                  className={`rounded-full border px-4 py-2 text-sm transition ${
                    active
                      ? "border-sky-400/30 bg-sky-400/10 text-slate-100"
                      : "border-white/10 bg-white/5 text-slate-300 hover:border-sky-400/30 hover:bg-sky-400/10 hover:text-slate-100"
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>

          <div className="mt-6 rounded-2xl border border-white/10 bg-slate-950/30 p-4 text-sm text-slate-400">
            <p className="text-slate-200">当前已选设备类型</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {filters.deviceTypes.map((type) => (
                <span
                  key={type}
                  className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-200"
                >
                  {type}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {summary ? (
        <>
          <section className="grid gap-4 md:grid-cols-2 2xl:grid-cols-4">
            <article className="rounded-[22px] border border-white/10 bg-white/5 p-5">
              <p className="text-sm text-slate-400">设备总数</p>
              <p className="mt-3 font-heading text-4xl font-semibold text-slate-50">{summary.totalDevices}</p>
              <p className="mt-3 text-sm text-slate-400">当前筛选条件下，非报废设备合计</p>
            </article>
            <article className="rounded-[22px] border border-white/10 bg-white/5 p-5">
              <p className="text-sm text-slate-400">在线服役</p>
              <p className="mt-3 font-heading text-4xl font-semibold text-slate-50">{summary.onlineServiceDevices}</p>
              <p className="mt-3 text-sm text-emerald-300">口径：online_status = 在线服役</p>
            </article>
            <article className="rounded-[22px] border border-white/10 bg-white/5 p-5">
              <p className="text-sm text-slate-400">报废设备</p>
              <p className="mt-3 font-heading text-4xl font-semibold text-slate-50">{summary.totalScrappedDevices}</p>
              <p className="mt-3 text-sm text-amber-300">当前筛选 + 已选设备类型后的报废量</p>
            </article>
            <article className="rounded-[22px] border border-white/10 bg-white/5 p-5">
              <p className="text-sm text-slate-400">供应商 / 账户编码</p>
              <p className="mt-3 font-heading text-4xl font-semibold text-slate-50">
                {summary.totalVendors} / {summary.totalAccounts}
              </p>
              <p className="mt-3 text-sm text-violet-300">支持继续 drill down</p>
            </article>
          </section>

          <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
            <LayeredDeviceStack items={summary.deviceStats} />

            <div className="space-y-6">
              <section className="rounded-[24px] border border-white/10 bg-white/5 p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-heading text-xl font-semibold text-slate-50">设备类型分布</h3>
                    <p className="mt-1 text-sm text-slate-400">按当前所有条件计算，不再是固定展示。</p>
                  </div>
                  <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300">
                    {distribution.length} 类
                  </span>
                </div>
                <div className="mt-4">
                  <EChart option={distributionOption as never} className="h-[280px] w-full" />
                </div>
              </section>

              <section className="rounded-[24px] border border-white/10 bg-white/5 p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-heading text-xl font-semibold text-slate-50">供应商排行</h3>
                    <p className="mt-1 text-sm text-slate-400">同一套筛选条件下的实时总量排行。</p>
                  </div>
                  <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300">
                    Top 10
                  </span>
                </div>

                <div className="mt-6 space-y-3">
                  {vendors.slice(0, 10).map((item, index) => (
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
                      <span className="text-sm font-semibold text-slate-100">{item.count} 台</span>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </section>

          {table ? (
            <section className="rounded-[24px] border border-white/10 bg-white/5 p-5 shadow-[0_18px_50px_rgba(0,0,0,0.18)]">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-heading text-xl font-semibold text-slate-50">明细结果</h3>
                  <p className="mt-1 text-sm text-slate-400">当前条件下前 12 行分组结果，供你核对计算逻辑。</p>
                </div>
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300">
                  共 {table.total} 组
                </span>
              </div>

              <div className="mt-6 overflow-x-auto rounded-[18px] border border-white/8">
                <div className="min-w-[1180px]">
                  <div className="grid grid-cols-[0.9fr_1fr_1fr_0.9fr_0.9fr_0.9fr_1fr_0.7fr_0.7fr_0.7fr_0.9fr_0.7fr] bg-white/5 px-4 py-3 text-xs uppercase tracking-[0.2em] text-slate-500">
                    <span>采购</span>
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
                        key={`${item.purchase}-${item.operation}-${item.accountCode}-${item.vendor}-${item.onlineStatus}`}
                        className="grid grid-cols-[0.9fr_1fr_1fr_0.9fr_0.9fr_0.9fr_1fr_0.7fr_0.7fr_0.7fr_0.9fr_0.7fr] items-center px-4 py-4 text-sm text-slate-300"
                      >
                        <span>{item.purchase}</span>
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
          ) : null}
        </>
      ) : null}
    </div>
  );
}
