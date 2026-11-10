"use client";

import React, { ReactNode } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

export interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: ReactNode;
  title?: string;
  description?: string;
  size?: "sm" | "md" | "lg" | "xl" | "full";
}

export function Dialog({
  open,
  onOpenChange,
  children,
  title,
  description,
  size = "lg",
}: DialogProps) {
  if (!open) return null;

  const sizes = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
    full: "max-w-[90vw]",
  };

  return createPortal(
    <>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zj-ink/40 backdrop-blur-sm"
        onClick={() => onOpenChange(false)}
      >
        <div
          className={cn(
            "relative z-10 w-full bg-zj-white border border-zj-border-strong rounded-[10px] shadow-[0_25px_50px_-12px_rgba(9,30,58,0.35)]",
            sizes[size],
          )}
        >
          {title && (
            <div className="px-6 py-5 bg-zj-mist/30 border-b border-zj-border flex items-start justify-between gap-4">
              <div>
                {description && (
                  <div className="text-[11px] text-zj-muted font-mono-hud uppercase tracking-wider mb-0.5">
                    {description}
                  </div>
                )}
                <h3 className="text-[18px] font-semibold text-zj-ink tracking-tight">
                  {title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                className="p-1.5 text-zj-muted hover:text-zj-ink rounded-[4px] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          )}
          <div className="p-6">{children}</div>
        </div>
      </div>
    </>,
    document.body,
  );
}
