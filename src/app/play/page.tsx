import type { Metadata } from 'next';
import PhaserGameClient from '@/components/PhaserGameClient';

export const metadata: Metadata = {
  title: 'Sunny Land · Phaser 引擎版',
  description:
    '基于 Phaser 3 与 CC0 Sunny Land 素材包打造的横版平台跳跃：像素视差、三种敌人、粒子与顿帧手感、完整音乐音效。',
};

export default function PlayPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-6 px-4 py-8">
      <header className="text-center">
        <h1 className="font-mono text-2xl font-bold tracking-wide text-amber-300">
          SUNNY LAND
        </h1>
        <p className="mt-1 text-sm text-white/60">
          Phaser 3 引擎 · Arcade 物理 · CC0 素材（WispSnow/SunnyLand）
        </p>
      </header>

      <PhaserGameClient />

      <section className="mx-auto grid w-full max-w-[960px] gap-4 font-mono text-xs text-white/70 sm:grid-cols-3">
        <div className="rounded border border-white/10 bg-white/5 p-3">
          <h2 className="mb-1 font-bold text-amber-200">游戏手感</h2>
          <p>挤压拉伸、落地尘屑、踩头顿帧、镜头震动/闪红、土狼时间与跳跃缓冲。</p>
        </div>
        <div className="rounded border border-white/10 bg-white/5 p-3">
          <h2 className="mb-1 font-bold text-amber-200">输入</h2>
          <p>键盘 ←→/AD + 空格/W，W3C 标准手柄（A/B/X 跳跃），移动端虚拟按键。</p>
        </div>
        <div className="rounded border border-white/10 bg-white/5 p-3">
          <h2 className="mb-1 font-bold text-amber-200">音频</h2>
          <p>原创循环 BGM 与 7 个独立音效总线，右上角可随时静音。</p>
        </div>
      </section>

      <footer className="text-center font-mono text-[10px] text-white/40">
        美术/音频/地图：WispSnow SunnyLand（CC0-1.0，public/vendor/sunnyland/LICENSE）·
        引擎：Phaser 3（MIT）
      </footer>
    </main>
  );
}
