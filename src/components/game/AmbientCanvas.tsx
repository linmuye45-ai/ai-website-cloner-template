"use client";

import { useEffect, useRef } from "react";
import { ensureSprites, getSprite, makeGroundTile } from "@/game/sprites";

interface Wanderer {
  sprite: string;
  x: number;
  y: number;
  speed: number;
  dir: 1 | -1;
  bob: number;
  scale: number;
  fly: boolean;
}

const WANDER_SPRITES = ["en_zombie", "en_skeleton", "en_ghost", "en_slime", "en_bat"];

// Animated pixel diorama used behind menu screens.
export function AmbientCanvas({ tint = "#233029", speckles = ["#2a3a31", "#1d2922", "#31453a"] }: { tint?: string; speckles?: string[] }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    ensureSprites();
    const canvas = ref.current!;
    const ctx = canvas.getContext("2d")!;
    let raf = 0;
    let w = 0;
    let h = 0;
    const dpr = Math.min(2, window.devicePixelRatio || 1);

    const tile = makeGroundTile(tint, speckles, 48, 1337);
    const pattern = ctx.createPattern(tile, "repeat");

    const wanderers: Wanderer[] = [];
    const seed = (): void => {
      wanderers.length = 0;
      const count = Math.max(8, Math.floor(window.innerWidth / 130));
      for (let i = 0; i < count; i++) {
        const fly = WANDER_SPRITES[i % WANDER_SPRITES.length] === "en_bat";
        wanderers.push({
          sprite: WANDER_SPRITES[i % WANDER_SPRITES.length],
          x: Math.random() * window.innerWidth,
          y: window.innerHeight * (0.35 + Math.random() * 0.55),
          speed: 12 + Math.random() * 22,
          dir: Math.random() > 0.5 ? 1 : -1,
          bob: Math.random() * 10,
          scale: 1.6 + Math.random() * 1.4,
          fly,
        });
      }
    };

    const resize = (): void => {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.imageSmoothingEnabled = false;
      seed();
    };
    resize();
    window.addEventListener("resize", resize);

    let last = performance.now();
    const loop = (ts: number): void => {
      const dt = Math.min(0.05, (ts - last) / 1000);
      last = ts;
      ctx.fillStyle = tint;
      ctx.fillRect(0, 0, w, h);
      if (pattern) {
        ctx.save();
        ctx.fillStyle = pattern;
        ctx.fillRect(0, 0, w, h);
        ctx.restore();
      }

      // moon
      ctx.globalAlpha = 0.9;
      ctx.fillStyle = "#fef3c7";
      ctx.beginPath();
      ctx.arc(w - Math.min(180, w * 0.16), Math.min(130, h * 0.2), 42, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 0.18;
      ctx.beginPath();
      ctx.arc(w - Math.min(180, w * 0.16), Math.min(130, h * 0.2), 64, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;

      for (const wd of wanderers) {
        wd.x += wd.speed * wd.dir * dt;
        wd.bob += dt * 6;
        if (wd.dir === 1 && wd.x > w + 60) wd.x = -60;
        if (wd.dir === -1 && wd.x < -60) wd.x = w + 60;
        const spr = getSprite(wd.sprite);
        const frame = spr.frames[Math.floor(ts / 220) % spr.frames.length];
        const dw = frame.width * wd.scale;
        const dh = frame.height * wd.scale;
        const yOff = wd.fly ? Math.sin(wd.bob) * 10 : 0;
        ctx.globalAlpha = 0.3;
        ctx.fillStyle = "#000";
        ctx.beginPath();
        ctx.ellipse(wd.x, wd.y + 4, dw * 0.36, 4, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 0.82;
        ctx.save();
        ctx.translate(wd.x, wd.y + yOff);
        ctx.scale(wd.dir, 1);
        ctx.drawImage(frame, -dw / 2, -dh, dw, dh);
        ctx.restore();
        ctx.globalAlpha = 1;
      }

      // drifting fog
      const grad = ctx.createLinearGradient(0, 0, 0, h);
      grad.addColorStop(0, "rgba(11,15,20,0.55)");
      grad.addColorStop(0.5, "rgba(11,15,20,0.15)");
      grad.addColorStop(1, "rgba(11,15,20,0.75)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [tint, speckles]);

  return <canvas ref={ref} className="absolute inset-0 h-full w-full" style={{ imageRendering: "pixelated" }} aria-hidden />;
}
