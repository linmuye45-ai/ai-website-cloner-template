"use client";

import { useEffect, useRef } from "react";

interface Mote {
  x: number;
  y: number;
  r: number;
  vy: number;
  vx: number;
  flicker: number;
  hue: number;
}

// Full-bleed decorative night backdrop for the marketing hero: drifting
// firefly motes over a faint ground fog. Pure canvas, no game-engine deps,
// pauses when the tab is hidden and honors prefers-reduced-motion.
export function AmbientCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let w = 0;
    let h = 0;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const motes: Mote[] = [];

    const resize = () => {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const target = Math.min(70, Math.floor((w * h) / 18000));
      while (motes.length < target) {
        motes.push({
          x: Math.random() * w,
          y: Math.random() * h,
          r: 1 + Math.random() * 2.2,
          vx: (Math.random() - 0.5) * 0.25,
          vy: -0.12 - Math.random() * 0.35,
          flicker: Math.random() * Math.PI * 2,
          hue: 38 + Math.random() * 18,
        });
      }
      motes.length = target;
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      // ground fog band
      const grad = ctx.createLinearGradient(0, h * 0.55, 0, h);
      grad.addColorStop(0, "rgba(74,96,88,0)");
      grad.addColorStop(1, "rgba(74,96,88,0.16)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, h * 0.55, w, h * 0.45);

      for (const m of motes) {
        if (!reduced) {
          m.x += m.vx;
          m.y += m.vy;
          m.flicker += 0.03;
          if (m.y < -8) {
            m.y = h + 8;
            m.x = Math.random() * w;
          }
          if (m.x < -8) m.x = w + 8;
          if (m.x > w + 8) m.x = -8;
        }
        const alpha = 0.25 + (Math.sin(m.flicker) * 0.5 + 0.5) * 0.55;
        ctx.beginPath();
        ctx.fillStyle = `hsla(${m.hue}, 85%, 68%, ${alpha})`;
        ctx.arc(m.x, m.y, m.r, 0, Math.PI * 2);
        ctx.fill();
        // soft halo
        ctx.beginPath();
        ctx.fillStyle = `hsla(${m.hue}, 85%, 68%, ${alpha * 0.12})`;
        ctx.arc(m.x, m.y, m.r * 4, 0, Math.PI * 2);
        ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    };

    const onVis = () => {
      if (document.hidden) cancelAnimationFrame(raf);
      else raf = requestAnimationFrame(draw);
    };

    resize();
    draw();
    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", onVis);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden
      className="pointer-events-none absolute inset-0 h-full w-full"
    />
  );
}
