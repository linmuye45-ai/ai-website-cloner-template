"use client";

import React, { useEffect, useRef, useState } from "react";

interface WordByWordTaglineProps {
  segments: string[];
  eyebrow: string;
}

/**
 * B11 Mandatory Tagline Reveal Section:
 * Words/phrases start at ~28% muted ink and activate sequentially in reading order
 * as the user scrolls across the viewport trigger line.
 * Uses IntersectionObserver + requestAnimationFrame throttling and honors prefers-reduced-motion.
 */
export function WordByWordTagline({
  segments,
  eyebrow,
}: WordByWordTaglineProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [activeCount, setActiveCount] = useState<number>(0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) {
      return;
    }

    let rafId = 0;
    let isIntersecting = false;

    const updateProgress = () => {
      rafId = 0;
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || 800;
      // Trigger window: starts activating when top hits 82% viewport height, completes by 32%
      const start = vh * 0.82;
      const end = vh * 0.28;
      const raw = (start - rect.top) / Math.max(1, start - end);
      const clamped = Math.max(0, Math.min(1, raw));
      const count = Math.round(clamped * segments.length);
      setActiveCount((prev) => (count > prev ? count : prev));
    };

    const onScroll = () => {
      if (!isIntersecting || rafId !== 0) return;
      rafId = window.requestAnimationFrame(updateProgress);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        isIntersecting = Boolean(entry?.isIntersecting);
        if (isIntersecting) {
          updateProgress();
        }
      },
      { threshold: [0, 0.15, 0.35, 0.6, 0.85, 1] }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (rafId !== 0) {
        window.cancelAnimationFrame(rafId);
      }
    };
  }, [segments.length]);

  const effectiveCount = activeCount;

  return (
    <section
      ref={containerRef}
      aria-label={eyebrow}
      className="border-y border-border bg-card py-20 sm:py-24"
    >
      <div className="mx-auto max-w-[1280px] px-4 sm:px-8">
        <div className="max-w-[760px] space-y-6">
          <p className="caption-3 text-muted-foreground">{eyebrow}</p>
          <p className="heading-3 leading-[1.32] text-foreground">
            {segments.map((seg, idx) => {
              const active = idx < effectiveCount;
              return (
                <span
                  key={`${idx}-${seg}`}
                  className={`inline motion-reduce:opacity-100 transition-opacity duration-500 motion-decel ${
                    active ? "opacity-100" : "opacity-25"
                  }`}
                >
                  {seg}
                </span>
              );
            })}
          </p>
        </div>
      </div>
    </section>
  );
}
