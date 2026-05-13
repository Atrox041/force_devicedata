type AppHeaderProps = {
  title: string;
  description: string;
};

export function AppHeader({ title, description }: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-[rgba(11,16,32,0.78)] backdrop-blur-xl">
      <div className="flex flex-col gap-4 px-5 py-5 sm:px-8 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
            资产分析 BI 平台
          </p>
          <h1 className="mt-2 font-heading text-2xl font-semibold text-slate-50">
            {title}
          </h1>
          <p className="mt-1 text-sm text-slate-400">{description}</p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <label className="flex min-w-[220px] items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
            <span className="text-slate-500">/</span>
            <input
              className="w-full bg-transparent text-sm text-slate-100 outline-none placeholder:text-slate-500"
              placeholder="搜索资产、地点、供应商"
            />
          </label>

          <button className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200 transition hover:border-sky-400/40 hover:bg-sky-400/10">
            2026 全年
          </button>
          <button className="rounded-2xl bg-gradient-to-r from-sky-400 to-violet-500 px-4 py-3 text-sm font-semibold text-slate-950 shadow-[0_12px_30px_rgba(96,165,250,0.28)] transition hover:brightness-110">
            快速导入
          </button>
        </div>
      </div>
    </header>
  );
}
