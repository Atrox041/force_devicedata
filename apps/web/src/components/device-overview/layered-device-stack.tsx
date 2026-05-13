"use client";

import { motion } from "framer-motion";
import { DeviceStat } from "@/types/device-overview";

type LayeredDeviceStackProps = {
  items: DeviceStat[];
};

const accentMap: Record<string, string> = {
  "5G设备": "from-sky-400 to-cyan-300",
  "10G设备": "from-violet-400 to-fuchsia-400",
  "2G设备": "from-emerald-400 to-teal-300",
  "1G小主机": "from-amber-400 to-orange-300",
  "报废设备": "from-rose-400 to-red-400",
};

export function LayeredDeviceStack({ items }: LayeredDeviceStackProps) {
  return (
    <div className="relative min-h-[420px] rounded-[28px] border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.18),transparent_28%),rgba(255,255,255,0.04)] p-6 shadow-[0_24px_70px_rgba(0,0,0,0.28)]">
      <div className="max-w-sm">
        <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
          Layered Live Cards
        </p>
        <h2 className="mt-3 font-heading text-2xl font-semibold text-slate-50">
          在线设备层叠总览
        </h2>
        <p className="mt-3 text-sm leading-7 text-slate-400">
          通过层叠卡片快速查看不同类型设备在线数量、总量和利用率，点击后续可继续钻取到明细。
        </p>
      </div>

      <div className="relative mt-10 h-[260px]">
        {items.map((item, index) => {
          const offset = index * 22;
          const scale = 1 - index * 0.045;

          return (
            <motion.article
              key={item.type}
              initial={{ opacity: 0, y: 40, rotate: -6 + index * 2 }}
              animate={{
                opacity: 1,
                y: [0, -6, 0],
                rotate: -5 + index * 2,
              }}
              transition={{
                delay: index * 0.1,
                duration: 0.65,
                y: {
                  delay: 0.5 + index * 0.08,
                  duration: 4.2,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                },
              }}
              whileHover={{
                y: -18,
                scale: scale + 0.03,
                transition: { duration: 0.25 },
              }}
              className="absolute left-0 right-0 mx-auto w-full max-w-xl rounded-[26px] border border-white/12 bg-[rgba(15,23,42,0.94)] p-5 shadow-[0_24px_50px_rgba(0,0,0,0.25)]"
              style={{
                top: `${offset}px`,
                zIndex: items.length - index,
                scale,
              }}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div
                    className={`inline-flex rounded-full bg-gradient-to-r px-3 py-1 text-xs font-semibold text-slate-950 ${accentMap[item.type]}`}
                  >
                    {item.type}
                  </div>
                  <p className="mt-4 font-heading text-3xl font-semibold text-slate-50">
                    {item.onlineCount}
                    <span className="ml-2 text-sm font-medium text-slate-400">
                      在线台数
                    </span>
                  </p>
                  <p className="mt-2 text-sm text-slate-400">
                    总量 {item.count} 台 · 利用率 {item.utilization}%
                  </p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-right">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                    Health
                  </p>
                  <p className="mt-2 text-lg font-semibold text-slate-100">
                    {item.utilization >= 90 ? "Stable" : "Watch"}
                  </p>
                </div>
              </div>

              <div className="mt-5 h-2 rounded-full bg-white/8">
                <motion.div
                  className={`h-2 rounded-full bg-gradient-to-r ${accentMap[item.type]}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${item.utilization}%` }}
                  transition={{ delay: index * 0.12 + 0.3, duration: 0.6 }}
                />
              </div>
            </motion.article>
          );
        })}
      </div>
    </div>
  );
}
