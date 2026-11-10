"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface BentoGridItemProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  children?: React.ReactNode;
  variant?: "default" | "soft" | "highlight";
  className?: string;
}

export function BentoGridItem({
  title,
  description,
  icon,
  children,
  variant = "default",
  className,
}: BentoGridItemProps) {
  const variants = {
    default: "bg-zj-white border border-zj-border",
    soft: "bg-zj-mist border border-zj-border",
    highlight: "bg-zj-white border border-zj-cobalt/60",
  };

  return (
    <div
      className={cn(
        "p-6 sm:p-8 rounded-[12px] overflow-hidden transition-all duration-250 hover:border-zj-cobalt/50",
        variants[variant],
        "bento-item",
        className,
      )}
    >
      {icon && (
        <div className="w-10 h-10 rounded-[6px] bg-zj-cobalt-soft flex items-center justify-center mb-4">
          {icon}
        </div>
      )}
      <h3 className="text-[15px] font-semibold text-zj-ink mb-2">{title}</h3>
      <p className="text-[13.5px] leading-[1.68] text-zj-slate mb-4">
        {description}
      </p>
      {children && <div className="pt-4 border-t border-zj-border/50">{children}</div>}
    </div>
  );
}

export interface BentoGridProps {
  children: React.ReactNode;
  cols?: 1 | 2 | 3 | 4;
  gap?: string;
}

export function BentoGrid({
  children,
  cols = 3,
  gap = "gap-6",
}: BentoGridProps) {
  const colMap: Record<number, string> = {
    1: "grid-cols-1",
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
  };

  return (
    <div className={cn("grid", colMap[cols], gap)}>
      {children}
    </div>
  );
}
