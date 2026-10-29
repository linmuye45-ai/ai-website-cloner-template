'use client';

import { useEffect, useRef, useState } from 'react';
import type * as Phaser from 'phaser';

/**
 * Mounts the Phaser canvas. Kept as a client component because Next 16 forbids
 * `ssr: false` dynamic imports inside Server Components.
 *
 * A visible error surface is deliberate: a WebGL/asset failure would otherwise
 * only ever manifest as a black canvas with no clue for the player.
 */
export default function EchoGameClient() {
  const hostRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    let game: Phaser.Game | null = null;

    const fail = (message: string) => {
      if (!cancelled) setError(message);
    };
    const onError = (event: ErrorEvent) => fail(event.message || 'unknown error');
    const onRejection = (event: PromiseRejectionEvent) => {
      const reason = event.reason as { message?: string } | undefined;
      fail(reason?.message ?? String(event.reason));
    };
    window.addEventListener('error', onError);
    window.addEventListener('unhandledrejection', onRejection);

    void (async () => {
      try {
        const { createEchoGame } = await import('@/echo/createEchoGame');
        if (cancelled || !hostRef.current) return;
        game = createEchoGame(hostRef.current);
        game.events.on('error', (err: unknown) => fail(String(err)));
      } catch (err) {
        fail(err instanceof Error ? err.message : String(err));
      }
    })();

    return () => {
      cancelled = true;
      window.removeEventListener('error', onError);
      window.removeEventListener('unhandledrejection', onRejection);
      game?.destroy(true);
    };
  }, []);

  return (
    <div className="relative">
      <div
        ref={hostRef}
        className="relative aspect-video w-full touch-none overflow-hidden rounded-xl border border-cyan-400/20 bg-[#07070f] shadow-[0_0_60px_rgba(80,255,200,0.12)] [&_canvas]:block [&_canvas]:h-full [&_canvas]:w-full"
      />
      {error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-xl bg-black/85 p-6 text-center">
          <p className="font-mono text-sm text-red-300">游戏启动失败 / game failed to start</p>
          <p className="max-w-md break-words font-mono text-[11px] leading-relaxed text-white/45">
            {error}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="rounded border border-white/30 px-4 py-1.5 font-mono text-xs text-white/80 hover:bg-white/10"
          >
            重新加载
          </button>
        </div>
      )}
    </div>
  );
}
