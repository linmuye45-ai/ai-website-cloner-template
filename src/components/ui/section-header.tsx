"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  className?: string;
}

export function SectionHeader({
  eyebrow,
  title,
  subtitle,
  className,
}: SectionHeaderProps) {
  return (
    <div className={cn("section-head mb-12", className)}>
      {eyebrow && (
        <span className="eyebrow text-zj-cobalt mb-4 block">
          {eyebrow}
        </span>
      )}
      <h2 className="text-[32px] sm:text-[42px] lg:text-[52px] leading-[1.15] tracking-[-0.03em] mb-5">
        {title}
      </h2>
      {subtitle && (
        <p className="max-w-[55ch] text-[16px] leading-[1.8] text-zj-slate">
          {subtitle}
        </p>
      )}
    </div>
  );
}
