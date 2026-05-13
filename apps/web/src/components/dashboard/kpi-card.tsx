type KpiCardProps = {
  label: string;
  value: string;
  trend: string;
  tone?: "primary" | "secondary" | "success" | "warning";
};

const toneClassMap = {
  primary: "from-sky-400/18 to-sky-500/6 text-sky-200 border-sky-400/20",
  secondary:
    "from-violet-400/18 to-violet-500/6 text-violet-200 border-violet-400/20",
  success: "from-emerald-400/18 to-emerald-500/6 text-emerald-200 border-emerald-400/20",
  warning: "from-amber-400/18 to-amber-500/6 text-amber-200 border-amber-400/20",
};

export function KpiCard({
  label,
  value,
  trend,
  tone = "primary",
}: KpiCardProps) {
  return (
    <article
      className={`rounded-[20px] border bg-gradient-to-br p-5 shadow-[0_20px_50px_rgba(0,0,0,0.22)] ${toneClassMap[tone]}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-slate-300">{label}</p>
          <p className="mt-3 font-heading text-3xl font-semibold tracking-tight text-slate-50">
            {value}
          </p>
        </div>
        <div className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] font-semibold text-slate-200">
          今日更新
        </div>
      </div>
      <div className="mt-6 flex items-center justify-between">
        <span className="text-xs uppercase tracking-[0.22em] text-slate-500">
          环比变化
        </span>
        <span className="text-sm font-semibold text-slate-100">{trend}</span>
      </div>
    </article>
  );
}
