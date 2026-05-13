import Link from "next/link";

type FeaturePageProps = {
  eyebrow: string;
  title: string;
  description: string;
  primaryAction?: {
    href: string;
    label: string;
  };
};

export function FeaturePage({
  eyebrow,
  title,
  description,
  primaryAction,
}: FeaturePageProps) {
  return (
    <div className="space-y-6">
      <section className="rounded-[24px] border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.16),transparent_28%),rgba(255,255,255,0.04)] px-6 py-8 shadow-[0_20px_50px_rgba(0,0,0,0.22)]">
        <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
          {eyebrow}
        </p>
        <h2 className="mt-3 font-heading text-3xl font-semibold text-slate-50">
          {title}
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-400">
          {description}
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          {primaryAction ? (
            <Link
              href={primaryAction.href}
              className="rounded-2xl bg-gradient-to-r from-sky-400 to-violet-500 px-5 py-3 text-sm font-semibold text-slate-950"
            >
              {primaryAction.label}
            </Link>
          ) : null}
          <Link
            href="/dashboard"
            className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm text-slate-200"
          >
            返回总览
          </Link>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        {[
          ["页面目标", "承接该业务模块的关键操作、筛选条件和状态概览。"],
          ["下一步实现", "接入真实 API、表格列配置、导出动作和详情抽屉。"],
          ["交互约定", "保留统一筛选栏、页面标题区、反馈状态和空态规范。"],
        ].map(([label, value]) => (
          <article
            key={label}
            className="rounded-[20px] border border-white/10 bg-white/5 p-5"
          >
            <p className="text-sm font-semibold text-slate-100">{label}</p>
            <p className="mt-2 text-sm leading-6 text-slate-400">{value}</p>
          </article>
        ))}
      </section>
    </div>
  );
}
