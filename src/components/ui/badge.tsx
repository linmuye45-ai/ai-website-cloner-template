"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "success" | "outline" | "soft";
}

const variants = {
  default: "bg-zj-cobalt text-zj-white",
  secondary: "bg-zj-mist text-zj-ink border border-zj-border",
  success: "bg-zj-safe-bright/10 text-zj-safe border border-zj-safe/20",
  outline: "bg-zj-white text-zj-ink border border-zj-border-strong",
  soft: "bg-zj-cobalt-soft text-zj-cobalt border border-zj-cobalt/30",
};

export function Badge({
  className,
  variant = "default",
  ...props
}: BadgeProps) {
  return (
    <div
      {...props}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-[6px] px-2.5 py-1 text-[10px] font-bold tracking-wider uppercase",
        variants[variant],
        className,
      )}
    />
  );
}
