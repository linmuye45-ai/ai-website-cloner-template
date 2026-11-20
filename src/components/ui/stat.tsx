"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface StatProps {
  value: string;
  label: string;
  sub?: string;
  className?: string;
}

export function Stat({
  value,
  label,
  sub,
  className,
}: StatProps) {
  return (
    <div className={cn(className)}>
      <div className="stat-value text-[22px] sm:text-[28px] leading-none text-zj-ink mb-1">
        {value}
      </div>
      <div className="text-[10px] font-medium tracking-wider text-zj-cobalt uppercase mb-0.5">
        {label}
      </div>
      {sub && <div className="text-[10px] text-zj-muted">{sub}</div>}
    </div>
  );
}
