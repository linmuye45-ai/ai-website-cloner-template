"use client";

import { useEffect, useRef } from "react";
import { ensureSprites, getSprite } from "@/game/sprites";

interface SpriteIconProps {
  name: string;
  size?: number;
  frame?: number;
  className?: string;
  dim?: boolean;
}

export function SpriteIcon({ name, size = 32, frame = 0, className, dim }: SpriteIconProps) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    ensureSprites();
    const canvas = ref.current;
    if (!canvas) return;
    const spr = getSprite(name);
    const f = spr.frames[frame % spr.frames.length];
    canvas.width = f.width;
    canvas.height = f.height;
    const ctx = canvas.getContext("2d")!;
    ctx.imageSmoothingEnabled = false;
    ctx.clearRect(0, 0, f.width, f.height);
    ctx.drawImage(f, 0, 0);
    const ratio = f.height / f.width;
    canvas.style.width = `${size}px`;
    canvas.style.height = `${Math.round(size * ratio)}px`;
    if (dim) {
      ctx.globalCompositeOperation = "source-atop";
      ctx.fillStyle = "rgba(11,15,20,0.72)";
      ctx.fillRect(0, 0, f.width, f.height);
    }
  }, [name, size, frame, dim]);

  return (
    <canvas
      ref={ref}
      className={className}
      style={{ imageRendering: "pixelated", display: "inline-block" }}
      aria-hidden
    />
  );
}
