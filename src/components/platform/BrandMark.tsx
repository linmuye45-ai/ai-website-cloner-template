"use client";

import React from "react";

interface BrandMarkProps {
  className?: string;
  size?: number;
}

/**
 * Rikyū-inspired architectural geometric monogram for 知微 DeepScholar.
 * Constructed on a 32x32 orthogonal grid: twin symmetric folio arcs
 * unified by a 45-degree verification aperture at the crown.
 */
export function BrandMark({ className = "", size = 28 }: BrandMarkProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
      className={`shrink-0 ${className}`}
    >
      <rect
        width="32"
        height="32"
        rx="8"
        className="fill-foreground transition-colors duration-300"
      />
      <path
        d="M8.5 10C12.1 10 15.1 13 15.1 16.6V22.8C15.1 19.2 12.1 16.2 8.5 16.2V10Z"
        className="fill-background transition-colors duration-300"
      />
      <path
        d="M23.5 10C19.9 10 16.9 13 16.9 16.6V22.8C16.9 19.2 19.9 16.2 23.5 16.2V10Z"
        className="fill-background transition-colors duration-300"
      />
      <rect
        x="16"
        y="6.8"
        width="4.8"
        height="4.8"
        rx="0.9"
        transform="rotate(45 16 6.8)"
        className="fill-brand"
      />
    </svg>
  );
}
