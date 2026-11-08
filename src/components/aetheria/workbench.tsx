"use client";

import { useEffect, useRef, useState } from "react";
import {
  ARSENAL_ITEMS,
  GAME_MODES,
  PIXELFX_PRESETS,
  STUDIO_DEPARTMENTS,
  calculateDecacornTrajectory,
  generateGameBlueprint,
  type GameModeId,
  type VfxPresetId,
} from "@/lib/aetheria";

type Enemy = {
  id: number;
  x: number;
  y: number;
  hp: number;
  maxHp: number;
  speed: number;
  radius: number;
  isBoss: boolean;
};

type Bullet = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  dmg: number;
};

type Gate = {
  x: number;
  y: number;
  w: number;
  label: string;
  op: "add" | "mul";
  val: number;
  color: string;
};

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
};

type FloatText = {
  x: number;
  y: number;
  text: string;
  color: string;
  life: number;
};

export function AetheriaWorkbench() {
  // ── 1. 游戏模式与 PixelFX 状态 ──
  const [modeId, setModeId] = useState<GameModeId>("gate_runner");
  const [vfxId, setVfxId] = useState<VfxPresetId>("flame_slash");
  const currentMode =
    GAME_MODES.find((m) => m.id === modeId) ?? GAME_MODES[0];
  const baseVfx =
    PIXELFX_PRESETS.find((v) => v.id === vfxId) ?? PIXELFX_PRESETS[0];

  const [hitstopMs, setHitstopMs] = useState<number>(baseVfx.hitstopMs);
  const [screenshakePx, setScreenshakePx] = useState<number>(
    baseVfx.screenshakePx
  );
  const [particleCount, setParticleCount] = useState<number>(
    baseVfx.particleCount
  );
  const [autopilotOn, setAutopilotOn] = useState<boolean>(true);
  const [vipAwakened, setVipAwakened] = useState<boolean>(false);
  const [showPaywallToast, setShowPaywallToast] = useState<boolean>(false);

  // ── 2. 实时遥测 HUD 数据 ──
  const [hudStats, setHudStats] = useState({
    squadSize: 3,
    wave: 1,
    kills: 0,
    gold: 1280,
    dps: 480,
    autopilotRuns: 10420,
  });

  // ── 3. 49-Agent 造游总控台状态 ──
  const [customPrompt, setCustomPrompt] = useState(
    "末日寒霜倍增门 + 赛博加特林割草 + 基地星核塔防"
  );
  const [pipelineRunning, setPipelineRunning] = useState(false);
  const [activeDeptIdx, setActiveDeptIdx] = useState<number>(5);
  const [blueprint, setBlueprint] = useState(() =>
    generateGameBlueprint(
      "末日寒霜倍增门 + 赛博加特林割草 + 基地星核塔防",
      "gate_runner",
      PIXELFX_PRESETS[0]
    )
  );

  // ── 4. 十角兽财务沙盘状态 ──
  const [monthlyGames, setMonthlyGames] = useState(4);
  const [hitRatePct, setHitRatePct] = useState(18);
  const [cpiSavingPct, setCpiSavingPct] = useState(55);
  const [creatorSeatsWan, setCreatorSeatsWan] = useState(90);
  const [axonAdSpendB, setAxonAdSpendB] = useState(7.0);

  // ── 5. 开源武器库过滤状态 ──
  const [arsenalCat, setArsenalCat] = useState<string>("all");

  // ── Canvas 引用与可变游戏状态 ──
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const stateRef = useRef({
    playerX: 360,
    playerY: 360,
    targetX: 360,
    squadCount: 3,
    wave: 1,
    kills: 0,
    gold: 1280,
    frame: 0,
    hitstopUntil: 0,
    shakeTime: 0,
    slashAngle: 0,
    enemies: [] as Enemy[],
    bullets: [] as Bullet[],
    gates: [] as Gate[],
    particles: [] as Particle[],
    floatTexts: [] as FloatText[],
  });

  // 切换 VFX 预设时同步滑块
  function selectVfxPreset(id: VfxPresetId) {
    const found =
      PIXELFX_PRESETS.find((v) => v.id === id) ?? PIXELFX_PRESETS[0];
    setVfxId(id);
    setHitstopMs(found.hitstopMs);
    setScreenshakePx(found.screenshakePx);
    setParticleCount(found.particleCount);
  }

  // 一键启动 49-Agent 管线
  function run49AgentPipeline() {
    setPipelineRunning(true);
    setActiveDeptIdx(0);
    let step = 0;
    const timer = setInterval(() => {
      step += 1;
      if (step < STUDIO_DEPARTMENTS.length) {
        setActiveDeptIdx(step);
      } else {
        clearInterval(timer);
        const tunedVfx = {
          ...baseVfx,
          hitstopMs,
          screenshakePx,
          particleCount,
        };
        const nextBp = generateGameBlueprint(customPrompt, modeId, tunedVfx);
        setBlueprint(nextBp);
        // 热更新注入上方实机游戏：直接增加分身与金币
        stateRef.current.squadCount = Math.min(
          24,
          stateRef.current.squadCount + 4
        );
        stateRef.current.gold += 2500;
        setPipelineRunning(false);
      }
    }, 320);
  }

  // ── HTML5 Canvas 60FPS 商业副玩法实机渲染循环 ──
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId = 0;
    const W = 720;
    const H = 420;

    // 初始化一批敌人与倍增门
    const st = stateRef.current;
    st.enemies = [];
    st.bullets = [];
    st.gates = [
      {
        x: 130,
        y: 80,
        w: 170,
        label: "×2 分身觉醒",
        op: "mul",
        val: 2,
        color: "#10B981",
      },
      {
        x: 420,
        y: 190,
        w: 170,
        label: "+3 散射火力",
        op: "add",
        val: 3,
        color: "#38BDF8",
      },
    ];

    const loop = (now: number) => {
      animId = requestAnimationFrame(loop);

      // Hitstop 卡肉顿帧效果：命中重击瞬间短暂停顿画面，增强打击感
      if (now < st.hitstopUntil) {
        return;
      }

      st.frame += 1;
      const fireBoost = vipAwakened ? 2.4 : 1.0;

      // 1. 生成敌人
      const spawnInterval = modeId === "rogue_slash" ? 24 : 32;
      if (st.frame % spawnInterval === 0 && st.enemies.length < 28) {
        const isBoss = st.frame % 240 === 0;
        let ex = 80 + ((st.frame * 53) % (W - 160));
        let ey = -24;
        if (modeId === "rogue_slash") {
          const angle = (st.frame * 0.47) % (Math.PI * 2);
          ex = W / 2 + Math.cos(angle) * 310;
          ey = H / 2 + Math.sin(angle) * 190;
        }
        const baseHp = isBoss ? 480 + st.wave * 90 : 55 + st.wave * 15;
        st.enemies.push({
          id: st.frame + Math.random(),
          x: ex,
          y: ey,
          hp: baseHp,
          maxHp: baseHp,
          speed: isBoss ? 0.65 : 1.25 + (st.wave % 4) * 0.15,
          radius: isBoss ? 26 : 13,
          isBoss,
        });
        if (isBoss && !vipAwakened) {
          setShowPaywallToast(true);
        }
      }

      // 2. 倍增门循环（仅 gate_runner 模式）
      if (modeId === "gate_runner") {
        for (const g of st.gates) {
          g.y += 1.35;
          // 触碰玩家防线
          if (Math.abs(g.y - 355) < 14) {
            if (st.playerX >= g.x && st.playerX <= g.x + g.w) {
              if (g.op === "mul") {
                st.squadCount = Math.min(28, st.squadCount * g.val);
              } else {
                st.squadCount = Math.min(28, st.squadCount + g.val);
              }
              st.floatTexts.push({
                x: st.playerX,
                y: 325,
                text: `小队 ${g.label} → ${st.squadCount}人!`,
                color: "#34D399",
                life: 45,
              });
            }
          }
          if (g.y > H + 20) {
            g.y = -40;
            g.x = g.x < 300 ? 400 : 110;
          }
        }
      }

      // 3. Autopilot AI 自动寻优走位 (ramenvr/autopilot)
      if (autopilotOn) {
        if (modeId === "gate_runner") {
          // 优先去吃最近的倍增门，否则瞄准最近的 Boss/怪
          const lowGate = st.gates.reduce((a, b) => (a.y > b.y ? a : b));
          if (lowGate && lowGate.y > 110 && lowGate.y < 350) {
            st.targetX = lowGate.x + lowGate.w / 2;
          } else if (st.enemies.length > 0) {
            const closest = st.enemies.reduce((a, b) => (a.y > b.y ? a : b));
            st.targetX = closest.x;
          }
          st.playerX += (st.targetX - st.playerX) * 0.12;
          st.playerY = 362;
        } else {
          st.playerX = W / 2 + Math.cos(st.frame * 0.03) * 85;
          st.playerY = H / 2 + Math.sin(st.frame * 0.03) * 45;
        }
      }

      // 4. 发射弹幕 / 炮塔 / 刀光
      const shootEvery = Math.max(4, Math.round(11 / fireBoost));
      if (st.frame % shootEvery === 0) {
        if (modeId === "gate_runner") {
          const streams = Math.min(7, Math.ceil(st.squadCount / 3));
          for (let i = 0; i < streams; i++) {
            const offset = (i - (streams - 1) / 2) * 14;
            st.bullets.push({
              x: st.playerX + offset,
              y: 345,
              vx: offset * 0.04,
              vy: -9.5,
              dmg: 28 * fireBoost,
            });
          }
        } else if (modeId === "mindustry_td") {
          // 4 座星核等离子炮塔向最近敌人索敌
          const turrets = [
            { x: 170, y: 210 },
            { x: 360, y: 210 },
            { x: 550, y: 210 },
          ];
          for (const t of turrets) {
            if (st.enemies.length > 0) {
              const target =
                st.enemies[Math.floor(Math.random() * st.enemies.length)];
              const dx = target.x - t.x;
              const dy = target.y - t.y;
              const dist = Math.max(1, Math.hypot(dx, dy));
              st.bullets.push({
                x: t.x,
                y: t.y,
                vx: (dx / dist) * 9.5,
                vy: (dy / dist) * 9.5,
                dmg: 36 * fireBoost,
              });
            }
          }
        } else {
          // rogue_slash 360度环形刀光波
          st.slashAngle += 0.55;
          for (let k = 0; k < (vipAwakened ? 4 : 2); k++) {
            const ang = st.slashAngle + k * Math.PI * (vipAwakened ? 0.5 : 1);
            st.bullets.push({
              x: st.playerX,
              y: st.playerY,
              vx: Math.cos(ang) * 8.5,
              vy: Math.sin(ang) * 8.5,
              dmg: 42 * fireBoost,
            });
          }
        }
      }

      // 5. 更新子弹与碰撞检测 + 触发 PixelFX 粒子/顿帧/震屏
      for (let i = st.bullets.length - 1; i >= 0; i--) {
        const b = st.bullets[i];
        b.x += b.vx;
        b.y += b.vy;
        if (b.x < -20 || b.x > W + 20 || b.y < -20 || b.y > H + 20) {
          st.bullets.splice(i, 1);
          continue;
        }
        for (let j = st.enemies.length - 1; j >= 0; j--) {
          const e = st.enemies[j];
          const d = Math.hypot(b.x - e.x, b.y - e.y);
          if (d < e.radius + 7) {
            const isCrit = Math.random() < 0.28 || vipAwakened;
            const dealt = Math.round(
              b.dmg * (isCrit ? baseVfx.critMultiplier : 1)
            );
            e.hp -= dealt;
            st.bullets.splice(i, 1);

            // 生成 PixelFX 粒子迸发
            const pCount = Math.min(20, Math.round(particleCount / 3));
            for (let p = 0; p < pCount; p++) {
              const ang = Math.random() * Math.PI * 2;
              const spd = 1.5 + Math.random() * 5.2;
              st.particles.push({
                x: e.x,
                y: e.y,
                vx: Math.cos(ang) * spd,
                vy: Math.sin(ang) * spd,
                life: 16 + Math.floor(Math.random() * 12),
                maxLife: 28,
                color:
                  p % 2 === 0 ? baseVfx.colorPrimary : baseVfx.colorSecondary,
                size: isCrit ? 4.2 : 2.8,
              });
            }

            if (isCrit && st.floatTexts.length < 18) {
              st.floatTexts.push({
                x: e.x + (Math.random() * 16 - 8),
                y: e.y - 10,
                text: `⚡${dealt}`,
                color: baseVfx.colorSecondary,
                life: 26,
              });
            }

            if (e.hp <= 0) {
              const wasBoss = e.isBoss;
              st.enemies.splice(j, 1);
              st.kills += 1;
              st.gold += wasBoss ? 360 : 28;
              if (st.kills % 18 === 0) {
                st.wave += 1;
              }
              if (wasBoss || st.kills % 10 === 0) {
                st.shakeTime = 8;
                st.hitstopUntil = performance.now() + Math.min(65, hitstopMs);
              }
            }
            break;
          }
        }
      }

      // 6. 更新敌人位置
      for (let j = st.enemies.length - 1; j >= 0; j--) {
        const e = st.enemies[j];
        if (modeId === "rogue_slash") {
          const dx = st.playerX - e.x;
          const dy = st.playerY - e.y;
          const dist = Math.max(1, Math.hypot(dx, dy));
          e.x += (dx / dist) * e.speed;
          e.y += (dy / dist) * e.speed;
          if (dist < 24) {
            e.hp = 0;
            st.enemies.splice(j, 1);
          }
        } else {
          e.y += e.speed;
          if (e.y > H - 45) {
            st.enemies.splice(j, 1);
          }
        }
      }

      // 7. 开始绘制画面（带 Screenshake 震屏偏移）
      ctx.save();
      if (st.shakeTime > 0) {
        st.shakeTime -= 1;
        const sx = (Math.random() - 0.5) * screenshakePx * 1.4;
        const sy = (Math.random() - 0.5) * screenshakePx * 1.4;
        ctx.translate(sx, sy);
      }

      // 背景深空网格
      ctx.fillStyle = "#070A10";
      ctx.fillRect(0, 0, W, H);
      ctx.strokeStyle = "rgba(56, 189, 248, 0.08)";
      ctx.lineWidth = 1;
      const gridOffset = (st.frame * 1.2) % 36;
      for (let gx = 0; gx < W; gx += 36) {
        ctx.beginPath();
        ctx.moveTo(gx, 0);
        ctx.lineTo(gx, H);
        ctx.stroke();
      }
      for (let gy = gridOffset; gy < H; gy += 36) {
        ctx.beginPath();
        ctx.moveTo(0, gy);
        ctx.lineTo(W, gy);
        ctx.stroke();
      }

      // Mindustry 传送带与能量晶核绘制
      if (modeId === "mindustry_td") {
        ctx.strokeStyle = "#F59E0B";
        ctx.lineWidth = 3;
        const turrets = [170, 360, 550];
        for (const tx of turrets) {
          // 传送带轨道
          ctx.fillStyle = "rgba(245, 158, 11, 0.14)";
          ctx.fillRect(tx - 12, 210, 24, 175);
          // 传送带上的流动晶核
          for (let cy = 0; cy < 4; cy++) {
            const py = 380 - (((st.frame * 2 + cy * 42) % 165));
            ctx.fillStyle = "#38BDF8";
            ctx.fillRect(tx - 5, py, 10, 10);
          }
          // 炮塔底座
          ctx.beginPath();
          ctx.arc(tx, 210, 20, 0, Math.PI * 2);
          ctx.fillStyle = "#1E293B";
          ctx.fill();
          ctx.stroke();
        }
      }

      // 绘制倍增门 (gate_runner)
      if (modeId === "gate_runner") {
        for (const g of st.gates) {
          ctx.fillStyle = `${g.color}28`;
          ctx.strokeStyle = g.color;
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.roundRect(g.x, g.y - 16, g.w, 32, 8);
          ctx.fill();
          ctx.stroke();
          ctx.fillStyle = "#F8FAFC";
          ctx.font = "bold 14px monospace";
          ctx.textAlign = "center";
          ctx.fillText(g.label, g.x + g.w / 2, g.y + 5);
        }
      }

      // 绘制敌人与 Boss 血条
      for (const e of st.enemies) {
        ctx.beginPath();
        ctx.arc(e.x, e.y, e.radius, 0, Math.PI * 2);
        ctx.fillStyle = e.isBoss ? "#F43F5E" : "#6366F1";
        ctx.fill();
        ctx.lineWidth = e.isBoss ? 3 : 1.5;
        ctx.strokeStyle = e.isBoss ? "#FDE047" : "#A5B4FC";
        ctx.stroke();

        // 血条
        const bw = e.radius * 2;
        ctx.fillStyle = "#1E293B";
        ctx.fillRect(e.x - e.radius, e.y - e.radius - 9, bw, 4);
        ctx.fillStyle = e.isBoss ? "#F43F5E" : "#34D399";
        ctx.fillRect(
          e.x - e.radius,
          e.y - e.radius - 9,
          bw * Math.max(0, e.hp / e.maxHp),
          4
        );
        if (e.isBoss) {
          ctx.fillStyle = "#FDE047";
          ctx.font = "bold 11px monospace";
          ctx.textAlign = "center";
          ctx.fillText("BOSS", e.x, e.y + 4);
        }
      }

      // 绘制主角小队分身
      if (modeId !== "mindustry_td") {
        const displayClones = Math.min(12, st.squadCount);
        for (let c = 0; c < displayClones; c++) {
          const cx =
            st.playerX +
            Math.cos((c / displayClones) * Math.PI * 2) *
              (c === 0 ? 0 : 18 + (c % 2) * 10);
          const cy =
            st.playerY +
            Math.sin((c / displayClones) * Math.PI * 2) * (c === 0 ? 0 : 10);
          ctx.beginPath();
          ctx.arc(cx, cy, c === 0 ? 13 : 8, 0, Math.PI * 2);
          ctx.fillStyle = vipAwakened ? "#EAB308" : "#38BDF8";
          ctx.fill();
          ctx.strokeStyle = "#FFFFFF";
          ctx.lineWidth = 2;
          ctx.stroke();
        }
      }

      // 绘制子弹与刀光
      for (const b of st.bullets) {
        ctx.beginPath();
        ctx.arc(b.x, b.y, vipAwakened ? 5.5 : 4, 0, Math.PI * 2);
        ctx.fillStyle = baseVfx.colorSecondary;
        ctx.fill();
      }

      // 绘制 PixelFX 粒子
      for (let p = st.particles.length - 1; p >= 0; p--) {
        const pt = st.particles[p];
        pt.x += pt.vx;
        pt.y += pt.vy;
        pt.life -= 1;
        if (pt.life <= 0) {
          st.particles.splice(p, 1);
          continue;
        }
        ctx.globalAlpha = pt.life / pt.maxLife;
        ctx.fillStyle = pt.color;
        ctx.fillRect(pt.x, pt.y, pt.size, pt.size);
      }
      ctx.globalAlpha = 1;

      // 绘制浮动暴击字
      for (let f = st.floatTexts.length - 1; f >= 0; f--) {
        const ft = st.floatTexts[f];
        ft.y -= 1.1;
        ft.life -= 1;
        if (ft.life <= 0) {
          st.floatTexts.splice(f, 1);
          continue;
        }
        ctx.fillStyle = ft.color;
        ctx.font = "bold 13px monospace";
        ctx.textAlign = "center";
        ctx.fillText(ft.text, ft.x, ft.y);
      }

      // 顶层状态角标
      ctx.fillStyle = "rgba(9, 13, 22, 0.82)";
      ctx.fillRect(12, 12, 275, 54);
      ctx.strokeStyle = "rgba(229, 184, 75, 0.5)";
      ctx.strokeRect(12, 12, 275, 54);
      ctx.fillStyle = "#E5B84B";
      ctx.font = "bold 11px monospace";
      ctx.textAlign = "left";
      ctx.fillText(
        autopilotOn
          ? "🤖 AUTOPILOT AI 压测代玩运行中 (60 FPS)"
          : "🖐️ 手动触控/鼠标拖拽实机试玩中",
        22,
        31
      );
      ctx.fillStyle = "#F8FAFC";
      ctx.font = "bold 12px monospace";
      ctx.fillText(
        `小队 x${st.squadCount} · 击杀 ${st.kills} · 金币 ${st.gold}`,
        22,
        52
      );

      ctx.restore();

      // 每 20 帧同步一次 React HUD
      if (st.frame % 20 === 0) {
        setHudStats({
          squadSize: st.squadCount,
          wave: st.wave,
          kills: st.kills,
          gold: st.gold,
          dps: Math.round(st.squadCount * 165 * (vipAwakened ? 2.4 : 1)),
          autopilotRuns: 10420 + Math.floor(st.frame / 15),
        });
      }
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [
    modeId,
    vfxId,
    autopilotOn,
    vipAwakened,
    hitstopMs,
    screenshakePx,
    particleCount,
    baseVfx,
  ]);

  // 计算三年十角兽与首年数亿流动现金
  const fin = calculateDecacornTrajectory({
    monthlyGamesBuilt: monthlyGames,
    hitRatePct,
    playableCpiSavingPct: cpiSavingPct,
    y2CreatorSeatsWan: creatorSeatsWan,
    y3AxonAdSpendBillionUSD: axonAdSpendB,
  });

  const filteredArsenal =
    arsenalCat === "all"
      ? ARSENAL_ITEMS
      : ARSENAL_ITEMS.filter((it) => it.catId === arsenalCat);

  return (
    <div className="space-y-20">
      {/* ══════════════════════════════════════════════════════════════════
          模块 1：60FPS 商业级副玩法实机引擎 + Autopilot AI 压测 + PixelFX 实验室
         ══════════════════════════════════════════════════════════════════ */}
      <div className="rounded-3xl border border-[#243044] bg-[#0D121B] p-5 shadow-[0_32px_90px_-20px_rgba(0,0,0,0.85)] sm:p-8">
        {/* 模式切换选项卡 */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#1E293B] pb-5">
          <div>
            <span className="text-[11px] font-bold tracking-[0.22em] text-[#38BDF8] uppercase">
              MODULE 01 · 60FPS PLAYABLE AD &amp; HYBRID-CASUAL ENGINE (VibeGame × Mindustry × RogueLegacy × Autopilot)
            </span>
            <h3 className="mt-1 text-[20px] font-black text-[#F8FAFC]">
              直接上手玩：三大年入 $10 亿–$24 亿美金的「副玩法买量 + 数值内购」商业实机引擎
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setAutopilotOn((v) => !v)}
              className={`rounded-full border px-4 py-2 text-[12px] font-extrabold transition-all ${
                autopilotOn
                  ? "border-[#10B981] bg-[#10B981]/20 text-[#34D399]"
                  : "border-[#E5B84B] bg-[#E5B84B]/20 text-[#E5B84B]"
              }`}
            >
              {autopilotOn
                ? "🤖 Autopilot AI 自动走位压测中（点此切手动）"
                : "🖐️ 手动鼠标/触屏操作中（点此切 AI 托管）"}
            </button>
          </div>
        </div>

        {/* 3大商业游戏模式选择 */}
        <div className="mt-5 grid gap-3 lg:grid-cols-3">
          {GAME_MODES.map((m) => {
            const active = m.id === modeId;
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => setModeId(m.id)}
                className={`rounded-2xl border p-4 text-left transition-all ${
                  active
                    ? "border-[#38BDF8] bg-[#131C2B] shadow-[0_14px_34px_-12px_rgba(56,189,248,0.35)]"
                    : "border-[#1E293B] bg-[#090D14] hover:border-[#334155]"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[14.5px] font-extrabold text-[#F8FAFC]">
                    {m.title}
                  </span>
                  <span
                    className="rounded-full px-2.5 py-0.5 font-mono text-[10.5px] font-bold"
                    style={{
                      backgroundColor: `${m.accent}22`,
                      color: m.accent,
                    }}
                  >
                    CPI ${m.cpiUSD} · 次留 {m.d1RetentionPct}%
                  </span>
                </div>
                <div className="mt-1 text-[12px] text-[#94A3B8]">
                  {m.subtitle}
                </div>
                <div className="mt-2 text-[11px] font-semibold text-[#E5B84B]">
                  ★ {m.benchmarkRev}
                </div>
              </button>
            );
          })}
        </div>

        {/* 主画布 + 右侧 PixelFX 244 特效调优与首充变现转化面板 */}
        <div className="mt-6 grid gap-6 lg:grid-cols-12">
          {/* 左：60FPS HTML5 Canvas 游乐场 (7 cols) */}
          <div className="space-y-3 lg:col-span-7">
            <div className="relative overflow-hidden rounded-2xl border-2 border-[#283548] bg-[#070A10]">
              <canvas
                ref={canvasRef}
                width={720}
                height={420}
                onMouseMove={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const rx = ((e.clientX - rect.left) / rect.width) * 720;
                  const ry = ((e.clientY - rect.top) / rect.height) * 420;
                  stateRef.current.playerX = rx;
                  if (modeId !== "gate_runner") {
                    stateRef.current.playerY = ry;
                  }
                }}
                onClick={() => {
                  setAutopilotOn(false);
                }}
                className="aspect-[12/7] w-full cursor-crosshair touch-none block"
              />

              {/* 模拟第85秒触发的 ¥6 首充暴利弹窗（混合休闲核心印钞点） */}
              {showPaywallToast && !vipAwakened && (
                <div className="absolute inset-x-4 bottom-3 flex flex-wrap items-center justify-between gap-3 rounded-2xl border-2 border-[#E5B84B] bg-[#090D16]/95 px-4 py-3 backdrop-blur">
                  <div>
                    <div className="text-[11px] font-extrabold text-[#E5B84B] uppercase">
                      🔥 AUTOPILOT 锁定黄金付费卡点 · 首充转化率 14.8%
                    </div>
                    <div className="text-[13px] font-bold text-[#F8FAFC]">
                      深渊 Boss 降临！立即解锁【全屏雷霆加特林 + 2.4倍攻速 + 黄金护盾】
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setVipAwakened(true);
                      setShowPaywallToast(false);
                      stateRef.current.squadCount = Math.min(
                        28,
                        stateRef.current.squadCount + 8
                      );
                    }}
                    className="rounded-xl bg-gradient-to-r from-[#E5B84B] to-[#F59E0B] px-4 py-2 text-[12.5px] font-black text-[#090B0E] shadow-lg hover:scale-105 transition-transform"
                  >
                    ⚡ 模拟玩家秒付 ¥6 觉醒（点此狂暴清屏）
                  </button>
                </div>
              )}
            </div>

            {/* 底部实时遥测条 */}
            <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-6">
              {[
                { k: "小队编制", v: `${hudStats.squadSize} 人` },
                { k: "实时秒伤 DPS", v: hudStats.dps.toLocaleString() },
                { k: "击退尸潮", v: `Wave ${hudStats.wave}` },
                { k: "暴击金币池", v: `🪙 ${hudStats.gold.toLocaleString()}` },
                {
                  k: "Autopilot 压测局",
                  v: `${hudStats.autopilotRuns.toLocaleString()} 局`,
                },
                {
                  k: "预测 D7 ROAS",
                  v: `${vipAwakened ? currentMode.d7RoasPct + 28 : currentMode.d7RoasPct}%`,
                },
              ].map((s) => (
                <div
                  key={s.k}
                  className="rounded-xl border border-[#1E293B] bg-[#090D14] px-3 py-2.5"
                >
                  <div className="text-[10px] text-[#64748B]">{s.k}</div>
                  <div className="mt-0.5 font-mono text-[13.5px] font-black text-[#38BDF8]">
                    {s.v}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 右：PixelFX 244 纯代码特效与打击感实时调优台 (5 cols) */}
          <div className="flex flex-col justify-between rounded-2xl border border-[#222E42] bg-[#090D14] p-5 lg:col-span-5">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold tracking-[0.16em] text-[#E5B84B] uppercase">
                  PATCH-GG / PIXELFX · 244 代码特效调优器
                </span>
                <span className="rounded bg-[#10B981]/15 px-2 py-0.5 font-mono text-[10.5px] font-bold text-[#34D399]">
                  0 美术外包费
                </span>
              </div>
              <h4 className="mt-1.5 text-[16px] font-extrabold text-[#F8FAFC]">
                切换刀光/闪电与卡肉顿帧，左边画布立即生效
              </h4>

              <div className="mt-3.5 grid grid-cols-2 gap-2">
                {PIXELFX_PRESETS.map((v) => {
                  const active = v.id === vfxId;
                  return (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => selectVfxPreset(v.id)}
                      className={`rounded-xl border p-2.5 text-left transition-all ${
                        active
                          ? "border-[#E5B84B] bg-[#161F30]"
                          : "border-[#1E293B] bg-[#0D121B] hover:border-[#334155]"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className="h-3 w-3 rounded-full"
                          style={{ backgroundColor: v.colorPrimary }}
                        />
                        <span className="text-[12.5px] font-bold text-[#F8FAFC]">
                          {v.name}
                        </span>
                      </div>
                      <div className="mt-1 font-mono text-[10px] text-[#64748B]">
                        顿帧 {v.hitstopMs}ms · 暴击 ×{v.critMultiplier}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* 三个手感滑块：蓄力-命中-顿帧-震屏 */}
              <div className="mt-4 space-y-3 border-t border-[#1E293B] pt-4">
                <div>
                  <div className="flex justify-between text-[11.5px]">
                    <span className="text-[#94A3B8]">
                      命中卡肉顿帧 (Hitstop 冻结毫秒)
                    </span>
                    <span className="font-mono font-bold text-[#E5B84B]">
                      {hitstopMs} ms
                    </span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={110}
                    step={5}
                    value={hitstopMs}
                    onChange={(e) => setHitstopMs(Number(e.target.value))}
                    className="mt-1 w-full accent-[#E5B84B]"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-[11.5px]">
                    <span className="text-[#94A3B8]">
                      暴击镜头震幅 (Screenshake 像素)
                    </span>
                    <span className="font-mono font-bold text-[#38BDF8]">
                      {screenshakePx} px
                    </span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={18}
                    step={1}
                    value={screenshakePx}
                    onChange={(e) => setScreenshakePx(Number(e.target.value))}
                    className="mt-1 w-full accent-[#38BDF8]"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-[11.5px]">
                    <span className="text-[#94A3B8]">
                      代码粒子迸发密度 (Particle Burst)
                    </span>
                    <span className="font-mono font-bold text-[#34D399]">
                      {particleCount} 颗/帧
                    </span>
                  </div>
                  <input
                    type="range"
                    min={12}
                    max={72}
                    step={6}
                    value={particleCount}
                    onChange={(e) => setParticleCount(Number(e.target.value))}
                    className="mt-1 w-full accent-[#10B981]"
                  />
                </div>
              </div>
            </div>

            {/* 一键开启/重置狂暴内购状态 */}
            <div className="mt-4 border-t border-[#1E293B] pt-4">
              <button
                type="button"
                onClick={() => {
                  setVipAwakened((v) => !v);
                  stateRef.current.squadCount = Math.min(
                    28,
                    stateRef.current.squadCount + 6
                  );
                }}
                className={`w-full rounded-xl py-3 text-[13px] font-black transition-all ${
                  vipAwakened
                    ? "bg-[#10B981] text-[#052E16]"
                    : "bg-gradient-to-r from-[#E5B84B] to-[#D97706] text-[#090B0E]"
                }`}
              >
                {vipAwakened
                  ? "✅ 已激活「首充黄金加特林 + ×2.4 攻速」（点此切换普通态对比）"
                  : "🔥 点此测试「玩家付 ¥6 首充后」全屏狂暴割草爽感"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════
          模块 2：49-Agent 一人游戏大厂全流程总控台 (Claude-Code-Game-Studios)
         ══════════════════════════════════════════════════════════════════ */}
      <div className="rounded-3xl border border-[#243044] bg-[#0D121B] p-6 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="text-[11px] font-bold tracking-[0.22em] text-[#E5B84B] uppercase">
              MODULE 02 · 49-AGENT SOLO GAME STUDIO OS (Claude-Code-Game-Studios × BMAD × QFramework × Lieflat)
            </span>
            <h3 className="mt-1 text-[21px] font-black text-[#F8FAFC]">
              一人带着 49 个 AI 专职员工冲：输入一句话创意，6 大部门全自动出架构、去 AI 味文案与可玩包
            </h3>
          </div>
          <span className="rounded-full border border-[#38BDF8]/40 bg-[#38BDF8]/10 px-3.5 py-1 text-[11.5px] font-bold text-[#38BDF8]">
            立项周期：6 个月 → 48 小时 · 研发人力成本砍掉 95%
          </span>
        </div>

        {/* 一句话输入与启动按钮 */}
        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <input
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            placeholder="输入你想做的副玩法+重度变现混合题材…"
            className="flex-1 rounded-2xl border border-[#2C3A50] bg-[#070A10] px-4 py-3.5 text-[14px] font-semibold text-[#F8FAFC] outline-none focus:border-[#E5B84B]"
          />
          <button
            type="button"
            onClick={run49AgentPipeline}
            disabled={pipelineRunning}
            className="rounded-2xl bg-gradient-to-r from-[#38BDF8] to-[#2563EB] px-7 py-3.5 text-[14px] font-black text-white shadow-lg transition-transform hover:scale-[1.02] disabled:opacity-60"
          >
            {pipelineRunning
              ? "⚙️ 49-Agent 六大部门并行编译中…"
              : "🚀 一键启动 49-Agent 造游管线（热注入上方引擎）"}
          </button>
        </div>

        {/* 6大部门流水线状态卡片 */}
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
          {STUDIO_DEPARTMENTS.map((d, idx) => {
            const done = idx <= activeDeptIdx;
            return (
              <div
                key={d.id}
                className={`rounded-2xl border p-3.5 transition-all ${
                  done
                    ? "border-[#10B981]/60 bg-[#0B1518]"
                    : "border-[#1E293B] bg-[#080B11] opacity-60"
                }`}
              >
                <div className="flex items-center justify-between text-[10.5px] font-mono">
                  <span className="font-bold text-[#E5B84B]">{d.deptNum}</span>
                  <span className="text-[#34D399]">
                    {done ? `✓ ${d.latencySec}` : "排队中"}
                  </span>
                </div>
                <div className="mt-1.5 text-[13px] font-extrabold text-[#F8FAFC]">
                  {d.name}
                </div>
                <div className="mt-1 text-[10.5px] font-semibold text-[#38BDF8]">
                  {d.leadAgent}
                </div>
                <p className="mt-2 text-[11px] leading-relaxed text-[#94A3B8]">
                  {d.outputSummary}
                </p>
              </div>
            );
          })}
        </div>

        {/* 管线实时产出：QFramework 干净代码 + Elephant-Goldfish 审查 + Lieflat 去AI味吸量文案 */}
        <div className="mt-6 grid gap-5 lg:grid-cols-12">
          <div className="rounded-2xl border border-[#222E42] bg-[#070A10] p-4 lg:col-span-6">
            <div className="flex items-center justify-between border-b border-[#1E293B] pb-2.5">
              <span className="font-mono text-[11px] font-bold text-[#38BDF8]">
                liangxiegame/QFramework · 自动生成 MVC/Command 核心代码
              </span>
              <span className="text-[10.5px] text-[#64748B]">
                核心 &lt; 1000 行 · 零意大利面代码
              </span>
            </div>
            <pre className="mt-3 overflow-x-auto font-mono text-[11.5px] leading-relaxed text-[#A7F3D0]">
              {blueprint.qframeworkCode}
            </pre>
          </div>

          <div className="flex flex-col justify-between space-y-4 lg:col-span-6">
            {/* Elephant-Goldfish 独立审查报告 */}
            <div className="rounded-2xl border border-[#222E42] bg-[#090D14] p-4">
              <div className="text-[11px] font-bold tracking-[0.14em] text-[#E5B84B] uppercase">
                google/elephant-goldfish-model · 独立审查 Agent 挑刺报告
              </div>
              <ul className="mt-2.5 space-y-2 text-[12px] leading-relaxed text-[#CBD5E1]">
                {blueprint.elephantAudit.map((line) => (
                  <li key={line} className="flex gap-2">
                    <span className="text-[#34D399]">✔</span>
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Lieflat 去AI味高转化买量台词 */}
            <div className="rounded-2xl border border-[#222E42] bg-[#090D14] p-4">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold tracking-[0.14em] text-[#F472B6] uppercase">
                  lieflat-less-ai-tone · 520万字去 AI 味引擎实测输出
                </span>
                <span className="rounded bg-[#10B981]/15 px-2 py-0.5 font-mono text-[10.5px] font-bold text-[#34D399]">
                  机器味：{blueprint.deAiCopy.beforeAiScore}% →{" "}
                  {blueprint.deAiCopy.afterAiScore}%
                </span>
              </div>
              <div className="mt-2.5 space-y-1.5 text-[12.5px]">
                <div className="font-bold text-[#F8FAFC]">
                  🇨🇳 抖音/小红书前 3 秒钩子：{blueprint.deAiCopy.hookLineCN}
                </div>
                <div className="font-mono text-[11.5px] text-[#38BDF8]">
                  🇺🇸 AppLovin/TikTok Hook: {blueprint.deAiCopy.hookLineEN}
                </div>
                <div className="pt-1 text-[11.5px] text-[#E5B84B]">
                  💰 数值付费卡点：{blueprint.deAiCopy.paywallTrigger}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════
          模块 3：「一年数亿流动净资产 → 三年上等十角兽 ($20B-$45B)」资本推演终端
         ══════════════════════════════════════════════════════════════════ */}
      <div
        id="decacorn-sim"
        className="scroll-mt-16 rounded-3xl border-2 border-[#E5B84B]/60 bg-gradient-to-b from-[#121926] to-[#090C12] p-6 shadow-[0_32px_90px_-20px_rgba(229,184,75,0.25)] sm:p-9"
      >
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="text-[11px] font-bold tracking-[0.22em] text-[#E5B84B] uppercase">
              MODULE 03 · DUAL-TARGET CAPITAL TERMINAL (Year 1 Cash Cow → Year 3 Upper-Tier Decacorn)
            </span>
            <h3 className="mt-1 text-[22px] font-black text-[#F8FAFC]">
              硬核账本推演：第 1 年怎么装进口袋数亿流动净现金？第 3 年怎么成为 $300 亿+ 顶级十角兽？
            </h3>
          </div>
          <div className="flex gap-2">
            <span className="rounded-full border border-[#10B981] bg-[#10B981]/20 px-3.5 py-1 text-[11.5px] font-extrabold text-[#34D399]">
              首年流动净现金：¥{fin.y1LiquidNetCashYiRMB} 亿 ✅
            </span>
            <span className="rounded-full border border-[#E5B84B] bg-[#E5B84B]/20 px-3.5 py-1 text-[11.5px] font-extrabold text-[#E5B84B]">
              第3年估值：${fin.y3DecacornValuationBillionUSD}B USD（上等十角兽 ✅）
            </span>
          </div>
        </div>

        {/* 5个核心商业杠杆滑块 */}
        <div className="mt-6 grid gap-4 rounded-2xl border border-[#243044] bg-[#090D14] p-5 sm:grid-cols-2 lg:grid-cols-5">
          <div>
            <div className="flex justify-between text-[11.5px]">
              <span className="text-[#94A3B8]">① 月均 AI 造游量</span>
              <span className="font-mono font-bold text-[#38BDF8]">
                {monthlyGames} 款/月
              </span>
            </div>
            <input
              type="range"
              min={2}
              max={10}
              step={1}
              value={monthlyGames}
              onChange={(e) => setMonthlyGames(Number(e.target.value))}
              className="mt-2 w-full accent-[#38BDF8]"
            />
            <div className="mt-1 text-[10px] text-[#64748B]">
              全年 {fin.annualGames} 款可玩副玩法原型
            </div>
          </div>

          <div>
            <div className="flex justify-between text-[11.5px]">
              <span className="text-[#94A3B8]">② 爆款跑出率</span>
              <span className="font-mono font-bold text-[#E5B84B]">
                {hitRatePct}%（{fin.hitGamesCount} 款爆款）
              </span>
            </div>
            <input
              type="range"
              min={10}
              max={35}
              step={2}
              value={hitRatePct}
              onChange={(e) => setHitRatePct(Number(e.target.value))}
              className="mt-2 w-full accent-[#E5B84B]"
            />
            <div className="mt-1 text-[10px] text-[#64748B]">
              Autopilot 压测确保次留 ≥ 48%
            </div>
          </div>

          <div>
            <div className="flex justify-between text-[11.5px]">
              <span className="text-[#94A3B8]">③ 可玩广告省买量费</span>
              <span className="font-mono font-bold text-[#34D399]">
                -{cpiSavingPct}% CPI
              </span>
            </div>
            <input
              type="range"
              min={30}
              max={70}
              step={5}
              value={cpiSavingPct}
              onChange={(e) => setCpiSavingPct(Number(e.target.value))}
              className="mt-2 w-full accent-[#10B981]"
            />
            <div className="mt-1 text-[10px] text-[#64748B]">
              video-to-game 转化率翻 3.8 倍
            </div>
          </div>

          <div>
            <div className="flex justify-between text-[11.5px]">
              <span className="text-[#94A3B8]">④ Y2 造游平台席位</span>
              <span className="font-mono font-bold text-[#A855F7]">
                {creatorSeatsWan} 万付费席位
              </span>
            </div>
            <input
              type="range"
              min={30}
              max={200}
              step={10}
              value={creatorSeatsWan}
              onChange={(e) => setCreatorSeatsWan(Number(e.target.value))}
              className="mt-2 w-full accent-[#A855F7]"
            />
            <div className="mt-1 text-[10px] text-[#64748B]">
              对标 Lovable 22 个月 $133 亿估值
            </div>
          </div>

          <div>
            <div className="flex justify-between text-[11.5px]">
              <span className="text-[#94A3B8]">⑤ Y3 AXON 广告总盘</span>
              <span className="font-mono font-bold text-[#F43F5E]">
                ${axonAdSpendB}B USD
              </span>
            </div>
            <input
              type="range"
              min={3}
              max={15}
              step={0.5}
              value={axonAdSpendB}
              onChange={(e) => setAxonAdSpendB(Number(e.target.value))}
              className="mt-2 w-full accent-[#F43F5E]"
            />
            <div className="mt-1 text-[10px] text-[#64748B]">
              对标 AppLovin 60.8% 净利率印钞机
            </div>
          </div>
        </div>

        {/* 三幕跃迁大卡片：Y1 现金牛 → Y2 十角兽 → Y3 上等顶级十角兽 */}
        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          {/* 第一年 */}
          <div className="rounded-2xl border-2 border-[#10B981] bg-[#0B1518] p-5">
            <div className="flex items-center justify-between">
              <span className="rounded-full bg-[#10B981]/20 px-3 py-0.5 text-[11px] font-extrabold text-[#34D399]">
                第一幕（第 1–12 月）· 现金牛落袋
              </span>
              <span className="font-mono text-[11px] text-[#94A3B8]">
                对标 Habby / 点点互动
              </span>
            </div>
            <div className="mt-3 text-[13px] text-[#94A3B8]">
              12 个月装进口袋的税后流动净资产：
            </div>
            <div className="mt-1 font-mono text-[28px] font-black text-[#34D399]">
              ¥{fin.y1LiquidNetCashExactRMB.toLocaleString()}
            </div>
            <div className="text-[12.5px] font-bold text-[#F8FAFC]">
              即人民币 {fin.y1LiquidNetCashYiRMB} 亿元（≈ $
              {fin.y1LiquidNetCashUSD.toLocaleString()} USD）
            </div>
            <p className="mt-3 text-[11.5px] leading-relaxed text-[#94A3B8]">
              靠 49-Agent 全年试错 {fin.annualGames} 款原型，跑出{" "}
              {fin.hitGamesCount} 款《Capybara Go!》级混合休闲现金牛 + B 端可玩广告定制，零人力包袱，纯现金入账。
            </p>
          </div>

          {/* 第二年 */}
          <div className="rounded-2xl border border-[#38BDF8]/60 bg-[#0B121E] p-5">
            <div className="flex items-center justify-between">
              <span className="rounded-full bg-[#38BDF8]/20 px-3 py-0.5 text-[11px] font-extrabold text-[#38BDF8]">
                第二幕（第 13–24 月）· 造游平台化
              </span>
              <span className="font-mono text-[11px] text-[#94A3B8]">
                对标 Lovable ($13.3B)
              </span>
            </div>
            <div className="mt-3 text-[13px] text-[#94A3B8]">
              第 2 年末平台 ARR 与公司估值：
            </div>
            <div className="mt-1 font-mono text-[28px] font-black text-[#38BDF8]">
              ${fin.y2ValuationBillionUSD}B USD 估值
            </div>
            <div className="text-[12.5px] font-bold text-[#F8FAFC]">
              平台年化经常性收入 (ARR)：${fin.y2TotalArrMillionUSD}M USD
            </div>
            <p className="mt-3 text-[11.5px] leading-relaxed text-[#94A3B8]">
              把内部造游管线开放为「Aetheria Studio」，全球 {creatorSeatsWan}{" "}
              万创作者与短剧团队订阅 + 发行流水抽成 30%，正式跨入十角兽行列。
            </p>
          </div>

          {/* 第三年 */}
          <div className="rounded-2xl border-2 border-[#E5B84B] bg-[#161B26] p-5">
            <div className="flex items-center justify-between">
              <span className="rounded-full bg-[#E5B84B]/20 px-3 py-0.5 text-[11px] font-extrabold text-[#E5B84B]">
                第三幕（第 25–36 月）· 上等顶级十角兽
              </span>
              <span className="font-mono text-[11px] text-[#94A3B8]">
                对标 AppLovin ($90B)
              </span>
            </div>
            <div className="mt-3 text-[13px] text-[#94A3B8]">
              第 3 年末顶级十角兽估值与年税后净利：
            </div>
            <div className="mt-1 font-mono text-[28px] font-black text-[#E5B84B]">
              ${fin.y3DecacornValuationBillionUSD}B USD（≈¥
              {fin.y3DecacornValuationYiRMB}亿）
            </div>
            <div className="text-[12.5px] font-bold text-[#34D399]">
              第3年单年税后净利：${fin.y3AfterTaxNetProfitBillionUSD}B USD（¥
              {fin.y3AfterTaxNetProfitYiRMB} 亿元）
            </div>
            <p className="mt-3 text-[11.5px] leading-relaxed text-[#94A3B8]">
              升级为「Aetheria AXON 可玩广告算法交易所」，掌控全网试玩前 10 秒付费转化数据，净利率 56%+，坐稳世界级上等十角兽。
            </p>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════
          模块 4：全量 8 大类开源武器库作战检索矩阵（一键直达 GitHub）
         ══════════════════════════════════════════════════════════════════ */}
      <div className="rounded-3xl border border-[#243044] bg-[#0D121B] p-6 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="text-[11px] font-bold tracking-[0.22em] text-[#38BDF8] uppercase">
              MODULE 04 · COMPLETE 8-CATEGORY OPEN-SOURCE ARSENAL MATRIX
            </span>
            <h3 className="mt-1 text-[20px] font-black text-[#F8FAFC]">
              您的全量技能弹药库已按「5 大印钞职能」完成编组（点击任意卡片直达源码）
            </h3>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {[
              { id: "all", label: "全部核心弹药" },
              { id: "studio", label: "① 49-Agent 工作室/架构" },
              { id: "vfx", label: "② PixelFX 代码特效/视频" },
              { id: "asset", label: "③ 2D序列帧/Sand3D管线" },
              { id: "playable", label: "④ Video-to-Game/去AI味" },
              { id: "growth", label: "⑤ 爬虫/红队审查/GrokBot出海" },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setArsenalCat(tab.id)}
                className={`rounded-full px-3.5 py-1.5 text-[11.5px] font-bold transition-all ${
                  arsenalCat === tab.id
                    ? "bg-[#E5B84B] text-[#090B0E]"
                    : "border border-[#243044] bg-[#090D14] text-[#94A3B8] hover:text-[#F8FAFC]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filteredArsenal.map((item) => (
            <a
              key={item.name}
              href={item.url}
              target="_blank"
              rel="noreferrer"
              className="group flex flex-col justify-between rounded-2xl border border-[#1E293B] bg-[#080B11] p-4 transition-all hover:border-[#E5B84B] hover:bg-[#0E1420]"
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="rounded bg-[#1E293B] px-2 py-0.5 text-[10px] font-bold text-[#38BDF8]">
                    {item.catName}
                  </span>
                  <span className="font-mono text-[11px] text-[#E5B84B] group-hover:translate-x-0.5 transition-transform">
                    GitHub ↗
                  </span>
                </div>
                <div className="mt-2 font-mono text-[13.5px] font-extrabold text-[#F8FAFC] group-hover:text-[#E5B84B]">
                  {item.name}
                </div>
                <p className="mt-1.5 text-[12px] leading-relaxed text-[#94A3B8]">
                  {item.role}
                </p>
              </div>
              <div className="mt-3 border-t border-[#161F2E] pt-2 text-[11px] font-semibold text-[#34D399]">
                ⚡ 印钞价值：{item.impact}
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
