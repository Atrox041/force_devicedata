type PlaceholderChartProps = {
  variant?: "line" | "bars" | "split";
};

export function PlaceholderChart({
  variant = "line",
}: PlaceholderChartProps) {
  if (variant === "bars") {
    return (
      <div className="flex h-64 items-end gap-3 rounded-[18px] border border-white/8 bg-[rgba(255,255,255,0.03)] p-4">
        {[28, 46, 72, 58, 80, 54, 68, 92].map((height, index) => (
          <div key={index} className="flex flex-1 flex-col justify-end gap-2">
            <div
              className="rounded-t-2xl bg-gradient-to-t from-sky-400 to-violet-500"
              style={{ height: `${height}%` }}
            />
            <div className="h-2 rounded-full bg-white/8" />
          </div>
        ))}
      </div>
    );
  }

  if (variant === "split") {
    return (
      <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <div className="h-64 rounded-[18px] border border-white/8 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.18),transparent_32%),rgba(255,255,255,0.03)] p-4">
          <div className="flex h-full items-end gap-3">
            {[40, 56, 48, 72, 68, 88].map((height, index) => (
              <div key={index} className="flex flex-1 flex-col justify-end gap-2">
                <div
                  className="rounded-t-2xl bg-gradient-to-t from-sky-400 to-cyan-300"
                  style={{ height: `${height}%` }}
                />
                <div className="h-2 rounded-full bg-white/8" />
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-[18px] border border-white/8 bg-[rgba(255,255,255,0.03)] p-5">
          <div className="space-y-4">
            {[
              ["服务器", "36%"],
              ["存储设备", "24%"],
              ["网络设备", "18%"],
              ["办公资产", "12%"],
            ].map(([label, value]) => (
              <div key={label}>
                <div className="flex items-center justify-between text-sm text-slate-300">
                  <span>{label}</span>
                  <span>{value}</span>
                </div>
                <div className="mt-2 h-2 rounded-full bg-white/8">
                  <div
                    className="h-2 rounded-full bg-gradient-to-r from-sky-400 to-violet-500"
                    style={{ width: value }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-64 rounded-[18px] border border-white/8 bg-[rgba(255,255,255,0.03)] p-4">
      <div className="relative h-full overflow-hidden rounded-[14px] border border-white/6 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),transparent)]">
        <div className="absolute inset-x-0 top-1/2 h-px bg-white/10" />
        <div className="absolute inset-x-0 top-1/4 h-px bg-white/5" />
        <div className="absolute inset-x-0 top-3/4 h-px bg-white/5" />
        <div className="absolute inset-y-0 left-1/4 w-px bg-white/5" />
        <div className="absolute inset-y-0 left-2/4 w-px bg-white/5" />
        <div className="absolute inset-y-0 left-3/4 w-px bg-white/5" />
        <svg
          viewBox="0 0 600 240"
          className="absolute inset-0 h-full w-full text-sky-400"
          fill="none"
        >
          <path
            d="M0 180C55 172 95 126 150 120C203 114 224 164 282 154C347 142 355 70 419 70C483 70 506 110 600 48"
            stroke="url(#gradient)"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <defs>
            <linearGradient id="gradient" x1="0" x2="1" y1="0" y2="0">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  );
}
