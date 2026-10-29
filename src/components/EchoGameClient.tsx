'use client';

import { useEffect, useRef } from 'react';
import type * as Phaser from 'phaser';

/**
 * Mounts the Phaser canvas. Kept as a client component because Next 16 forbids
 * `ssr: false` dynamic imports inside Server Components.
 */
export default function EchoGameClient() {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    let game: Phaser.Game | null = null;
    void (async () => {
      const { createEchoGame } = await import('@/echo/createEchoGame');
      if (cancelled || !hostRef.current) return;
      game = createEchoGame(hostRef.current);
    })();
    return () => {
      cancelled = true;
      game?.destroy(true);
    };
  }, []);

  return (
    <div
      ref={hostRef}
      className="relative aspect-video w-full touch-none overflow-hidden rounded-xl border border-cyan-400/20 bg-[#07070f] shadow-[0_0_60px_rgba(80,255,200,0.12)] [&_canvas]:block [&_canvas]:h-full [&_canvas]:w-full"
    />
  );
}
