"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface SeparatorProps {
  orientation?: "horizontal" | "vertical";
  className?: string;
}

export function Separator({
  orientation = "horizontal",
  className,
}: SeparatorProps) {
  return (
    <div
      className={cn(
        orientation === "horizontal"
          ? "h-[1px] w-full bg-zj-border border-0 my-12"
          : "w-[1px] h-full bg-zj-border mx-12",
        className,
      )}
    />
  );
}
