import type { Metadata } from 'next';
import Link from 'next/link';
import EchoGameClient from '@/components/EchoGameClient';
import { RESONANCE_LIST, ELEMENTS, ELEMENT_ORDER } from '@/echo/sim/elements';

export const metadata: Metadata = {
  title: 'ECHOWEAVE · 回声织网',
  description:
    '一款把「走位」本身变成武器的自动战斗游戏：你的轨迹会留下回声与丝线，敌人撞进网里被割伤，两种元素的丝线交叉就会共振爆炸。',
};

const PAIR_ROWS: { a: string; b: string; name: string; cn: string; detail: string; color: string }[] =
  RESONANCE_LIST.map((r) => {
    const pair = r.kind;
    const map: Record<string, [string, string]> = {
      steam: ['fire', 'frost'],
      plasma: ['fire', 'volt'],
      singularity: ['fire', 'void'],
      superconduct: ['frost', 'volt'],
      crystal: ['frost', 'void'],
      annihilate: ['volt', 'void'],
    };
    const [a, b] = map[pair] ?? ['fire', 'frost'];
    return {
      a,
      b,
      name: r.name,
      cn: r.cn,
      detail: r.detail,
      color: `#${r.color.toString(16).padStart(6, '0')}`,
    };
  });

export default function EchoPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-8 px-4 py-10">
      <header className="text-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.4em] text-cyan-300/60">
          auto-battler · zero-asset · procedurally drawn
        </p>
        <h1 className="mt-3 font-mono text-4xl font-bold tracking-[0.18em] text-white sm:text-5xl">
          ECHOWEAVE
        </h1>
        <p className="mt-2 text-lg text-cyan-200/90">回声织网</p>
        <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-white/55">
          自动战斗游戏通常给你固定武器槽位。这里没有武器——<span className="text-cyan-200">你的移动轨迹就是武器</span>。
          你走过的路会留下回声，回声走过的格子变成持续 5.5 秒的丝线；敌人追你时会自己撞进这张网。
          两种不同元素的丝线真正交叉时，网会炸开。
        </p>
      </header>

      <EchoGameClient />

      <p className="text-center font-mono text-[11px] text-white/35">
        WASD / 方向键移动 · 手机拖动屏幕转向 · 数字键 1/2/3 选择强化 · M 静音 · P 暂停
      </p>

      <section className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-cyan-400/15 bg-cyan-400/5 p-4">
          <h2 className="mb-2 font-mono text-sm font-bold text-cyan-200">① 轨迹即武器</h2>
          <p className="text-xs leading-relaxed text-white/60">
            站着不动 = 没有输出。回声按你原本的速度重走旧路，你跑得越刁钻，网铺得越广。
          </p>
        </div>
        <div className="rounded-lg border border-fuchsia-400/15 bg-fuchsia-400/5 p-4">
          <h2 className="mb-2 font-mono text-sm font-bold text-fuchsia-200">② 交叉才爆炸</h2>
          <p className="text-xs leading-relaxed text-white/60">
            两条平行丝线不会触发共振——必须真的成角度相交。转圈保命，织十字网才能推进。
          </p>
        </div>
        <div className="rounded-lg border border-amber-400/15 bg-amber-400/5 p-4">
          <h2 className="mb-2 font-mono text-sm font-bold text-amber-200">③ 元素决定爆炸形状</h2>
          <p className="text-xs leading-relaxed text-white/60">
            你拥有的元素组合决定能搓出哪几种共振，6 种组合的攻击形状各不相同。
          </p>
        </div>
      </section>

      <section className="rounded-lg border border-white/10 bg-white/[0.03] p-5">
        <h2 className="mb-1 font-mono text-sm font-bold text-white/80">共振表 · RESONANCE MATRIX</h2>
        <p className="mb-4 text-xs text-white/40">
          拥有的元素越多，能触发的组合越多（4 元素 = 6 种组合全解锁）
        </p>
        <div className="grid gap-2 sm:grid-cols-2">
          {PAIR_ROWS.map((r) => (
            <div key={r.name} className="flex items-start gap-3 rounded border border-white/5 bg-black/30 p-3">
              <span className="mt-1 flex shrink-0 gap-1">
                <span
                  className="inline-block h-3 w-3 rotate-45"
                  style={{ backgroundColor: `#${ELEMENTS[r.a as keyof typeof ELEMENTS].color.toString(16).padStart(6, '0')}` }}
                />
                <span
                  className="inline-block h-3 w-3 rotate-45"
                  style={{ backgroundColor: `#${ELEMENTS[r.b as keyof typeof ELEMENTS].color.toString(16).padStart(6, '0')}` }}
                />
              </span>
              <span>
                <span className="font-mono text-xs" style={{ color: r.color }}>
                  {r.name} · {r.cn}
                </span>
                <span className="mt-0.5 block text-[11px] text-white/45">{r.detail}</span>
              </span>
            </div>
          ))}
        </div>
        <div className="mt-5 flex flex-wrap gap-2">
          {ELEMENT_ORDER.map((id) => (
            <span
              key={id}
              className="rounded-full border px-3 py-1 font-mono text-[11px]"
              style={{
                borderColor: `${ELEMENTS[id].css}55`,
                color: ELEMENTS[id].css,
                backgroundColor: `${ELEMENTS[id].css}12`,
              }}
            >
              {ELEMENTS[id].name} · {ELEMENTS[id].cn}
            </span>
          ))}
        </div>
      </section>

      <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-5 font-mono text-[11px] text-white/35">
        <span>零美术素材 · 全部图形与音效由代码实时生成 · 引擎 Phaser 3 (MIT)</span>
        <span className="flex gap-4">
          <Link href="/" className="underline hover:text-white/70">
            首页
          </Link>
          <Link href="/play" className="underline hover:text-white/70">
            Sunny Land
          </Link>
          <Link href="/game" className="underline hover:text-white/70">
            Ember Trail
          </Link>
        </span>
      </footer>
    </main>
  );
}
