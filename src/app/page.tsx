import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-[#16131F] px-6 py-12 text-[#F0E6C8]">
      <div className="w-full max-w-2xl rounded-xl border border-cyan-400/25 bg-[#07070f] p-8 shadow-[0_0_70px_rgba(80,255,200,0.10)]">
        <p className="font-mono text-xs tracking-widest text-amber-300/70">
          FLAGSHIP · 刀痕成矿
        </p>
        <h1 className="mt-2 font-mono text-3xl text-white">烛龙 · ZHULONG</h1>
        <p className="mt-4 font-mono text-sm leading-6 text-[#b8a892]">
          完美弹反会把敌人的力道刻进石壁，凭空长出一条矿脉——弹反手感就是你唯一的采矿工具。
          暗潮从上方逼近，只能不断下潜；火盆存魂，深度即赌注。
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/zhulong"
            className="rounded-md border border-amber-300/50 bg-amber-400/15 px-5 py-3 font-mono text-sm font-bold text-amber-100 transition-colors hover:bg-amber-400/25"
          >
            ▶ 进入地脉
          </Link>
          <Link
            href="/echo"
            className="rounded-md border border-cyan-300/30 px-5 py-3 font-mono text-sm text-cyan-200/80 transition-colors hover:bg-cyan-400/10"
          >
            ECHOWEAVE · 回声织网
          </Link>
        </div>
      </div>

      <div className="w-full max-w-2xl rounded-xl border border-[#3A3646] bg-[#211C2E] p-8">
        <p className="font-mono text-xs tracking-widest text-[#49A8B0]">
          ORIGINAL PIXEL PLATFORMER
        </p>
        <h1 className="mt-2 font-mono text-3xl text-[#FFE9A8]">
          Hearthwarden: Ember Trail
        </h1>
        <p className="mt-4 font-mono text-sm leading-6 text-[#D8C9A3]">
          A side-scrolling 2.5D platformer rendered entirely in the locked
          Hearthwarden densely-detailed pixel style: a 52-colour indexed
          palette, shaped pixel clusters, stepped ramps, parallax depth and
          integer-only scaling. Run, wall-jump, spend an Ember Charge to
          double-jump, dash through danger, and stomp Thornlings so they bloom
          into bonus shards on the trail to the hearth.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/play"
            className="rounded-md border border-[#E8782C] bg-[#D15C52] px-5 py-3 font-mono text-sm font-bold text-[#FFE9A8] transition-colors hover:bg-[#E8782C]"
          >
            ▶ PLAY SUNNY LAND (PHASER 版)
          </Link>
          <Link
            href="/game"
            className="rounded-md border border-[#E8782C] bg-[#9C3540] px-5 py-3 font-mono text-sm text-[#FFE9A8] transition-colors hover:bg-[#D15C52]"
          >
            EMBER TRAIL（自研引擎版）
          </Link>
          <a
            href="https://gameartstyle.loopyhop.com/styles/detailed-pixel/"
            target="_blank"
            rel="noreferrer"
            className="rounded-md border border-[#676078] px-5 py-3 font-mono text-sm text-[#D8C9A3] transition-colors hover:bg-[#2A2733]"
          >
            ART STYLE REFERENCE
          </a>
        </div>
        <ul className="mt-8 grid gap-2 font-mono text-xs text-[#A79FB4] sm:grid-cols-2">
          <li>· 320×180 framebuffer, integer-scaled</li>
          <li>· 32×48 hero, 7 animated frames</li>
          <li>· 16×16 authored tile and icon set</li>
          <li>· 4-plane parallax, palette-indexed</li>
          <li>· Coyote time, jump buffering, i-frames</li>
          <li>· Keyboard + 44px touch controls</li>
        </ul>
      </div>
    </main>
  );
}
