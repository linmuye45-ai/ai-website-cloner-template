'use client';

import { useEffect, useRef, useState } from 'react';
import type * as Phaser from 'phaser';

/**
 * Full-viewport game mount. Deliberately no surrounding copy: the game itself
 * owns the screen, the way a real build would.
 */
export default function ZhulongClient() {
  const hostRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    let game: Phaser.Game | null = null;

    const onError = (e: ErrorEvent) => {
      if (!cancelled) setError(e.message || 'unknown');
    };
    const onRejection = (e: PromiseRejectionEvent) => {
      const r = e.reason as { message?: string } | undefined;
      if (!cancelled) setError(r?.message ?? String(e.reason));
    };
    window.addEventListener('error', onError);
    window.addEventListener('unhandledrejection', onRejection);

    void (async () => {
      try {
        const { createZhulongGame } = await import('@/zhulong/createZhulongGame');
        if (cancelled || !hostRef.current) return;
        game = createZhulongGame(hostRef.current);
        game.events.on('error', (err: unknown) => {
          if (!cancelled) setError(String(err));
        });
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : String(err));
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
    <div className="fixed inset-0 overflow-hidden bg-[#05030a]">
      <div
        ref={hostRef}
        className="absolute inset-0 touch-none select-none [&_canvas]:block [&_canvas]:h-full [&_canvas]:w-full"
      />
      {error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/90 p-8 text-center">
          <p className="font-mono text-sm text-red-300">启动失败</p>
          <p className="max-w-lg break-words font-mono text-[11px] text-white/40">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="border border-white/25 px-4 py-1.5 font-mono text-xs text-white/70 hover:bg-white/10"
          >
            RELOAD
          </button>
        </div>
      )}
    </div>
  );
}
