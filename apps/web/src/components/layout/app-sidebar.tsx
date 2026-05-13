"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navGroups } from "@/lib/navigation";

function isActive(pathname: string, href: string) {
  if (href === "/dashboard") {
    return pathname === href;
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-[260px] shrink-0 border-r border-white/10 bg-[rgba(8,12,24,0.88)] px-5 py-6 lg:flex lg:flex-col">
      <div className="rounded-3xl border border-white/10 bg-white/5 px-4 py-4 shadow-[0_18px_60px_rgba(0,0,0,0.24)]">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-400 to-violet-500 font-heading text-sm font-semibold tracking-[0.24em] text-slate-950">
            BI
          </div>
          <div>
            <p className="font-heading text-sm font-semibold text-slate-50">
              资产分析平台
            </p>
            <p className="mt-1 text-xs text-slate-400">Data Workspace</p>
          </div>
        </div>
      </div>

      <nav className="mt-8 flex flex-1 flex-col gap-7">
        {navGroups.map((group) => (
          <div key={group.title}>
            <p className="mb-3 px-3 text-xs font-medium tracking-[0.22em] text-slate-500 uppercase">
              {group.title}
            </p>
            <div className="space-y-2">
              {group.items.map((item) => {
                const active = isActive(pathname, item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center justify-between rounded-2xl border px-3 py-3 text-sm transition ${
                      active
                        ? "border-sky-400/40 bg-gradient-to-r from-sky-400/14 to-violet-500/14 text-slate-50 shadow-[0_0_0_1px_rgba(96,165,250,0.14)]"
                        : "border-transparent bg-transparent text-slate-400 hover:border-white/10 hover:bg-white/5 hover:text-slate-100"
                    }`}
                  >
                    <span>{item.label}</span>
                    {item.badge ? (
                      <span className="rounded-full border border-sky-400/30 bg-sky-400/10 px-2 py-0.5 text-[11px] font-semibold text-sky-200">
                        {item.badge}
                      </span>
                    ) : null}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="rounded-3xl border border-white/10 bg-white/5 px-4 py-4">
        <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
          当前组织
        </p>
        <p className="mt-2 font-heading text-sm font-semibold text-slate-100">
          Infra Assets Team
        </p>
        <p className="mt-1 text-xs leading-5 text-slate-400">
          支持采购、发货、资产台账与领导汇总看板的统一分析空间。
        </p>
      </div>
    </aside>
  );
}
