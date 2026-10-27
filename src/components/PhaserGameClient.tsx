'use client';

import dynamic from 'next/dynamic';

/**
 * Next 16 forbids `ssr: false` inside Server Components, so the
 * dynamic import lives in this client-only wrapper.
 */
const PhaserGame = dynamic(() => import('./PhaserGame'), {
  ssr: false,
  loading: () => (
    <div className="mx-auto aspect-video w-full max-w-[960px] animate-pulse rounded-lg border-2 border-[#3a2a4a] bg-[#1b1230]" />
  ),
});

export default function PhaserGameClient() {
  return <PhaserGame />;
}
