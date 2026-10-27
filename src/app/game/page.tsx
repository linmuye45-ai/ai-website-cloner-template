import Link from "next/link";
import { GameCanvas } from "@/components/GameCanvas";

export const metadata = {
  title: "Hearthwarden: Ember Trail",
  description:
    "An original 2.5D pixel-art platformer built in the locked Hearthwarden art direction.",
};

export default function GamePage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col items-center gap-4 bg-[#16131F] px-4 py-6 text-[#F0E6C8]">
      <header className="flex w-full flex-col items-center gap-1 text-center">
        <h1 className="font-mono text-2xl tracking-wide text-[#FFE9A8]">
          HEARTHWARDEN: EMBER TRAIL
        </h1>
        <p className="max-w-2xl font-mono text-xs text-[#A79FB4]">
          ORIGINAL 2.5D PLATFORMER · DENSELY DETAILED PIXEL ILLUSTRATION ·
          VARIABLE JUMPS, WALL JUMPS, EMBER CHARGE DOUBLE JUMP AND DASH,
          STOMP ECOLOGY AND CHECKPOINT LANTERNS
        </p>
      </header>
      <GameCanvas />
      <Link
        href="/"
        className="font-mono text-xs text-[#49A8B0] underline-offset-4 hover:underline"
      >
        ← BACK TO THE HEARTH
      </Link>
    </main>
  );
}
