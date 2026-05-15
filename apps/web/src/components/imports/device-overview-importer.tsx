"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

const requiredHeaders = [
  "采购",
  "运营",
  "设备在线情况",
  "设备提供",
  "供应商",
  "计费方式",
  "账户编码",
  "5G设备",
  "10G设备",
  "2G设备",
  "1G小主机",
  "报废设备",
];

type ImportResult = {
  importJobId: string;
  totalRows: number;
  successRows: number;
  failedRows: number;
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

export function DeviceOverviewImporter() {
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ImportResult | null>(null);

  const apiBaseUrl = useMemo(() => getApiBaseUrl(), []);
  const canCallApi = Boolean(apiBaseUrl);

  async function handleImport() {
    setError(null);
    setResult(null);

    if (!file) {
      setError("请先选择一个 Excel 文件。");
      return;
    }

    if (!canCallApi) {
      setError("未配置 NEXT_PUBLIC_API_BASE_URL，无法调用后端导入接口。");
      return;
    }

    const body = new FormData();
    body.append("file", file);

    setBusy(true);
    try {
      const response = await fetch(`${apiBaseUrl}/api/imports/device-overview`, {
        method: "POST",
        body,
      });

      if (!response.ok) {
        const text = await response.text();
        setError(text || `导入失败（HTTP ${response.status}）`);
        return;
      }

      const json = (await response.json()) as ImportResult;
      setResult(json);
    } catch (e: any) {
      setError(e?.message || "导入失败，请检查网络或后端是否可用。");
    } finally {
      setBusy(false);
    }
  }

  function handleExport() {
    setError(null);
    if (!canCallApi) {
      setError("未配置 NEXT_PUBLIC_API_BASE_URL，无法调用后端导出接口。");
      return;
    }
    window.open(`${apiBaseUrl}/api/exports/device-overview.xlsx`, "_blank");
  }

  return (
    <div className="space-y-6">
      <section className="rounded-[28px] border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.16),transparent_26%),rgba(255,255,255,0.04)] p-6 shadow-[0_24px_70px_rgba(0,0,0,0.28)]">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-3xl">
            <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
              Import Center
            </p>
            <h2 className="mt-3 font-heading text-3xl font-semibold text-slate-50">
              导入中心
            </h2>
            <p className="mt-3 text-sm leading-7 text-slate-400">
              上传设备总览 Excel 后自动入库，并在设备在线总览里展示真实数据。导出可直接下载当前筛选维度的汇总明细表。
              未显式配置时，前端会按当前访问域名自动请求
              <span className="mx-1 text-slate-200">:3001</span>
              后端。
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/device-overview"
              className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm text-slate-200"
            >
              打开设备总览
            </Link>
            <button
              type="button"
              onClick={handleExport}
              className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm text-slate-200 transition hover:border-sky-400/30 hover:bg-sky-400/10"
            >
              导出 Excel
            </button>
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.25fr_0.75fr]">
        <article className="rounded-[24px] border border-white/10 bg-white/5 p-5 shadow-[0_18px_50px_rgba(0,0,0,0.18)]">
          <div className="flex flex-col gap-4">
            <div>
              <h3 className="font-heading text-xl font-semibold text-slate-50">
                设备总览 Excel 导入
              </h3>
              <p className="mt-2 text-sm leading-7 text-slate-400">
                后端接口：<span className="text-slate-200">POST /api/imports/device-overview</span>
              </p>
            </div>

            <div className="rounded-[18px] border border-white/10 bg-black/20 p-4">
              <p className="text-sm font-semibold text-slate-100">选择文件</p>
              <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <input
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={(event) => {
                    const nextFile = event.target.files?.[0] ?? null;
                    setFile(nextFile);
                    setError(null);
                    setResult(null);
                  }}
                  className="block w-full text-sm text-slate-300 file:mr-4 file:rounded-xl file:border-0 file:bg-white/10 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-slate-100 hover:file:bg-white/15"
                />
                <button
                  type="button"
                  onClick={handleImport}
                  disabled={busy}
                  className="rounded-2xl bg-gradient-to-r from-sky-400 to-violet-500 px-5 py-3 text-sm font-semibold text-slate-950 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {busy ? "导入中..." : "开始导入"}
                </button>
              </div>
              {file ? (
                <p className="mt-3 text-xs text-slate-400">
                  已选择：<span className="text-slate-200">{file.name}</span>
                </p>
              ) : null}
            </div>

            {!canCallApi ? (
              <div className="rounded-[18px] border border-amber-400/30 bg-amber-400/10 p-4 text-sm text-amber-200">
                当前未显式配置 NEXT_PUBLIC_API_BASE_URL，前端会优先尝试使用当前访问域名自动拼接
                <span className="mx-1 text-slate-50">:3001</span>。
                如果你的部署不是前端
                <span className="mx-1 text-slate-50">3000</span>
                、后端
                <span className="mx-1 text-slate-50">3001</span>
                这种结构，再在前端
                <span className="mx-1 text-slate-50">.env.local</span>
                设置为你的后端地址，例如
                <span className="mx-1 text-slate-50">http://101.42.167.97:3001</span>。
              </div>
            ) : null}

            {error ? (
              <div className="rounded-[18px] border border-rose-400/30 bg-rose-400/10 p-4 text-sm text-rose-200">
                {error}
              </div>
            ) : null}

            {result ? (
              <div className="rounded-[18px] border border-emerald-400/30 bg-emerald-400/10 p-4 text-sm text-emerald-200">
                <div className="flex flex-wrap gap-x-6 gap-y-2">
                  <span>
                    导入批次：<span className="text-slate-50">{result.importJobId}</span>
                  </span>
                  <span>总行数：{result.totalRows}</span>
                  <span>成功：{result.successRows}</span>
                  <span>失败：{result.failedRows}</span>
                </div>
                <p className="mt-2 text-xs text-emerald-100/90">
                  导入完成后打开“设备总览”即可看到真实数据（确保关闭 mock）。
                </p>
              </div>
            ) : null}
          </div>
        </article>

        <aside className="space-y-4">
          <article className="rounded-[24px] border border-white/10 bg-white/5 p-5">
            <h3 className="text-sm font-semibold text-slate-100">
              必要字段（表头必须一致）
            </h3>
            <div className="mt-4 flex flex-wrap gap-2">
              {requiredHeaders.map((header) => (
                <span
                  key={header}
                  className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300"
                >
                  {header}
                </span>
              ))}
            </div>
          </article>

          <article className="rounded-[24px] border border-white/10 bg-white/5 p-5">
            <h3 className="text-sm font-semibold text-slate-100">接口说明</h3>
            <div className="mt-3 space-y-2 text-sm text-slate-400">
              <p>
                导入：<span className="text-slate-200">POST /api/imports/device-overview</span>
              </p>
              <p>
                导出：<span className="text-slate-200">GET /api/exports/device-overview.xlsx</span>
              </p>
              <p>
                统计：<span className="text-slate-200">/api/dashboard/device-overview/*</span>
              </p>
            </div>
          </article>
        </aside>
      </section>
    </div>
  );
}
