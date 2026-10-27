"use client";

import { useEffect, useState } from "react";

const LINKS = [
  { href: "#now", label: "为什么是现在" },
  { href: "#sheet", label: "到岸表" },
  { href: "#edge", label: "为什么是我们" },
  { href: "#ladder", label: "千亿阶梯" },
  { href: "#moat", label: "护城河" },
  { href: "#odds", label: "诚实的概率" },
  { href: "#three", label: "三案" },
  { href: "#method", label: "方法" },
];

export function Nav() {
  const [progress, setProgress] = useState(0);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement;
      const total = doc.scrollHeight - doc.clientHeight;
      setProgress(total > 0 ? doc.scrollTop / total : 0);
      setScrolled(doc.scrollTop > 24);
    };
    onScroll();
    document.addEventListener("scroll", onScroll, { passive: true });
    return () => document.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      {/* scroll progress */}
      <div className="h-[2px] w-full bg-white/[0.04]">
        <div
          className="h-full bg-gradient-to-r from-gold-3 via-gold to-gold-2 transition-[width] duration-150 ease-out"
          style={{ width: `${Math.min(100, progress * 100)}%` }}
        />
      </div>

      <div
        className={`transition-colors duration-300 ${
          scrolled
            ? "border-b border-line bg-ink/80 backdrop-blur-xl"
            : "border-b border-transparent bg-transparent"
        }`}
      >
        <div className="mx-auto flex h-16 max-w-[1240px] items-center justify-between px-6 lg:px-10">
          <a href="#top" className="group flex items-center gap-2.5">
            {/* staircase mark */}
            <svg width="26" height="26" viewBox="0 0 26 26" aria-hidden>
              <rect
                x="3"
                y="17"
                width="5"
                height="6"
                rx="1"
                fill="#8a6a2b"
                className="transition-colors group-hover:fill-gold"
              />
              <rect
                x="10.5"
                y="11"
                width="5"
                height="12"
                rx="1"
                fill="#d9a441"
                className="transition-colors group-hover:fill-gold-2"
              />
              <rect
                x="18"
                y="3"
                width="5"
                height="20"
                rx="1"
                fill="#f0c674"
                className="transition-colors group-hover:fill-white"
              />
            </svg>
            <div className="leading-none">
              <div className="text-[15px] font-semibold tracking-tight">
                到岸{" "}
                <span className="text-gradient-gold font-mono text-[13px] tracking-[0.18em]">
                  LANDED
                </span>
              </div>
              <div className="label-mono mt-[3px] text-muted-ink/80">
                AI 原生贸易银行
              </div>
            </div>
          </a>

          <nav className="hidden items-center gap-7 lg:flex">
            {LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="text-[13px] text-muted-ink transition-colors hover:text-paper"
              >
                {l.label}
              </a>
            ))}
          </nav>

          <a
            href="#ladder"
            className="glow-gold rounded-full bg-gold px-4 py-2 text-[13px] font-medium text-ink transition-transform hover:scale-[1.03] active:scale-[0.98]"
          >
            看千亿阶梯 →
          </a>
        </div>

        {/* mobile links */}
        <div className="flex gap-5 overflow-x-auto border-t border-line px-6 py-2.5 lg:hidden">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="whitespace-nowrap text-[12px] text-muted-ink"
            >
              {l.label}
            </a>
          ))}
        </div>
      </div>
    </header>
  );
}
