"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navGroups } from "@/lib/navigation";

export function MobileNav() {
  const pathname = usePathname();
  const links = navGroups.flatMap((group) => group.items).slice(0, 5);

  return (
    <nav className="fixed inset-x-3 bottom-3 z-30 rounded-3xl border border-white/10 bg-[rgba(8,12,24,0.92)] p-2 shadow-[0_18px_60px_rgba(0,0,0,0.34)] lg:hidden">
      <div className="grid grid-cols-5 gap-2">
        {links.map((item) => {
          const active =
            pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-2xl px-2 py-3 text-center text-xs transition ${
                active
                  ? "bg-gradient-to-r from-sky-400/18 to-violet-500/18 text-slate-50"
                  : "text-slate-400"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
