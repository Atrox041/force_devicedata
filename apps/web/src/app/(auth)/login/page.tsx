import Link from "next/link";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen bg-background">
      <section className="relative hidden flex-1 overflow-hidden border-r border-white/10 lg:flex">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.18),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(139,92,246,0.22),transparent_34%)]" />
        <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(148,163,184,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.12)_1px,transparent_1px)] [background-size:56px_56px]" />
        <div className="relative z-10 flex max-w-2xl flex-col justify-between px-14 py-16">
          <div>
            <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
              实时资产洞察工作台
            </div>
            <h1 className="mt-10 max-w-xl font-heading text-5xl font-semibold leading-[1.15] text-slate-50">
              给领导看的，不只是图表，而是完整的资产决策界面。
            </h1>
            <p className="mt-6 max-w-lg text-base leading-8 text-slate-300">
              统一资产台账、采购记录、发货流水和动态导入模板，用一套深色专业仪表盘完成日常分析与汇报展示。
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {[
              ["采购分析", "按年、月、供应商和资产类型快速汇总。"],
              ["发货去向", "跟踪流向、地点、部门和负责人。"],
              ["灵活导入", "支持 Excel 原样接入和字段自动识别。"],
            ].map(([title, copy]) => (
              <article
                key={title}
                className="rounded-[20px] border border-white/10 bg-white/6 p-5 shadow-[0_20px_50px_rgba(0,0,0,0.18)]"
              >
                <p className="font-heading text-lg font-semibold text-slate-50">
                  {title}
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-400">{copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="flex w-full items-center justify-center px-6 py-10 lg:w-[520px]">
        <div className="w-full max-w-md rounded-[28px] border border-white/10 bg-[rgba(15,23,42,0.92)] p-8 shadow-[0_24px_80px_rgba(0,0,0,0.34)]">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-400 to-violet-500 font-heading text-sm font-semibold tracking-[0.22em] text-slate-950">
              BI
            </div>
            <div>
              <p className="font-heading text-lg font-semibold text-slate-50">
                资产分析 BI 平台
              </p>
              <p className="text-sm text-slate-400">Sign in to workspace</p>
            </div>
          </div>

          <div className="mt-10">
            <h2 className="font-heading text-3xl font-semibold text-slate-50">
              欢迎回来
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              登录后进入统一分析工作台，查看 Dashboard、资产台账与导入中心。
            </p>
          </div>

          <form className="mt-8 space-y-4">
            <label className="block">
              <span className="mb-2 block text-sm text-slate-300">账号</span>
              <input
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-slate-100 placeholder:text-slate-500"
                placeholder="请输入账号"
              />
            </label>
            <label className="block">
              <span className="mb-2 block text-sm text-slate-300">密码</span>
              <input
                type="password"
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-slate-100 placeholder:text-slate-500"
                placeholder="请输入密码"
              />
            </label>
            <div className="flex items-center justify-between text-sm text-slate-400">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="h-4 w-4 rounded border-white/10 bg-white/5" />
                <span>记住登录</span>
              </label>
              <button type="button" className="text-sky-300">
                忘记密码
              </button>
            </div>
            <Link
              href="/dashboard"
              className="flex w-full items-center justify-center rounded-2xl bg-gradient-to-r from-sky-400 to-violet-500 px-4 py-3 text-sm font-semibold text-slate-950 shadow-[0_18px_40px_rgba(96,165,250,0.3)] transition hover:brightness-110"
            >
              登录并进入控制台
            </Link>
          </form>

          <p className="mt-6 rounded-2xl border border-amber-400/18 bg-amber-400/8 px-4 py-3 text-sm leading-6 text-amber-100">
            当前为前端框架演示版本，登录操作暂未接入真实鉴权接口。
          </p>
        </div>
      </section>
    </main>
  );
}
