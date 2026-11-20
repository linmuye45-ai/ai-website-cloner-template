import React from "react";

/**
 * Clean, solid-color institutional medical seal for ZhongJing (中净).
 * Zero rainbow gradients — uses authoritative Medical Cobalt (#0720A6)
 * with crisp geometric negative space representing "中" (upright clinical axis).
 */
export function ZhongJingLogoMark({
  className = "h-7 w-7",
  inverted = false,
}: {
  className?: string;
  inverted?: boolean;
}) {
  const bg = inverted ? "#FFFFFF" : "#0720A6";
  const fg = inverted ? "#0720A6" : "#FFFFFF";
  const accent = inverted ? "#0F8A4C" : "#5AD2E6";

  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <rect width="32" height="32" rx="4" fill={bg} />
      <path d="M16 5.5V26.5" stroke={fg} strokeWidth="1.8" />
      <rect
        x="8"
        y="11"
        width="16"
        height="10"
        rx="1.5"
        stroke={fg}
        strokeWidth="1.6"
      />
      <circle cx="16" cy="16" r="2" fill={accent} />
    </svg>
  );
}
