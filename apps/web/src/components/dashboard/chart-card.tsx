type ChartCardProps = {
  title: string;
  description: string;
  children: React.ReactNode;
  actionLabel?: string;
};

export function ChartCard({
  title,
  description,
  children,
  actionLabel = "查看详情",
}: ChartCardProps) {
  return (
    <section className="rounded-[20px] border border-white/10 bg-white/5 p-5 shadow-[0_18px_50px_rgba(0,0,0,0.18)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="font-heading text-lg font-semibold text-slate-50">
            {title}
          </h2>
          <p className="mt-1 text-sm text-slate-400">{description}</p>
        </div>
        <button className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-300 transition hover:border-sky-400/30 hover:text-slate-100">
          {actionLabel}
        </button>
      </div>
      <div className="mt-6">{children}</div>
    </section>
  );
}
