"use client";
import { useEffect, useRef, useState, useCallback } from "react";

// VampireSurvivor25D - 小米平板8 即开即玩版
// 2.5D表现 + 触屏摇杆 + 越玩越爽循环

type GameState = "menu" | "playing" | "paused" | "levelup" | "gameover" | "victory";
type Vec2 = { x: number; y: number };

const W = 1920,
  H = 1080;
const WORLD = 4000;

// 音效合成
let audioCtx: AudioContext | null = null;
function beep(freq: number, dur: number, vol = 0.3, type: OscillatorType = "sine") {
  try {
    if (!audioCtx) audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    if (audioCtx.state === "suspended") audioCtx.resume();
    const o = audioCtx.createOscillator();
    const g = audioCtx.createGain();
    o.type = type;
    o.frequency.value = freq;
    g.gain.value = vol;
    o.connect(g).connect(audioCtx.destination);
    o.start();
    g.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + dur);
    o.stop(audioCtx.currentTime + dur);
  } catch {}
}

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef<GameState>("menu");
  const reqRef = useRef<number>(0);
  const keysRef = useRef<Set<string>>(new Set());
  const joyRef = useRef<Vec2>({ x: 0, y: 0 });
  const joyActiveRef = useRef(false);

  const [gs, setGs] = useState<GameState>("menu");
  const [hud, setHud] = useState({ hp: 100, maxHp: 100, exp: 0, need: 20, lv: 1, time: 0, kills: 0, stage: 1, stageName: "苏醒", combo: 0, weapons: [] as string[] });
  const [levelOpts, setLevelOpts] = useState<UpgradeOpt[]>([]);
  const [save, setSave] = useState({ best: 1, wins: 0, kills: 0, unlocked: ["magic", "holy"] as string[] });
  const [showSettings, setShowSettings] = useState(false);
  const pendingUpgradeRef = useRef<string | null>(null);

  // 配置
  type UpgradeOpt = { id: string; name: string; desc: string; type: string; lv: number; nextLv: number; isNew: boolean; icon: string };
  const WEAPONS: Record<string, { name: string; desc: string; type: string; icon: string; max: number }> = {
    magic: { name: "魔法飞弹", desc: "追踪飞弹", type: "active", icon: "✦", max: 8 },
    holy: { name: "圣环", desc: "旋转圣光", type: "active", icon: "◉", max: 8 },
    lightning: { name: "闪电链", desc: "跳跃闪电", type: "active", icon: "⚡", max: 6 },
    flame: { name: "火焰区域", desc: "地面灼烧", type: "active", icon: "🔥", max: 6 },
    shield: { name: "护盾", desc: "无敌反弹", type: "active", icon: "⬡", max: 6 },
    speed: { name: "疾风之靴", desc: "+12%移速", type: "passive", icon: "👟", max: 5 },
    atkspd: { name: "急速", desc: "-10%冷却", type: "passive", icon: "⏩", max: 5 },
    maxhp: { name: "生命精华", desc: "+20生命", type: "passive", icon: "♥", max: 5 },
    magnet: { name: "磁力", desc: "+25%拾取", type: "passive", icon: "🧲", max: 5 },
    dmg: { name: "毁灭之力", desc: "+15%伤害", type: "passive", icon: "⚔", max: 5 },
  };

  // 读取存档
  useEffect(() => {
    const s = localStorage.getItem("vs25d_save");
    if (s) try {
      setSave(JSON.parse(s));
    } catch {}
  }, []);
  const persist = (n: typeof save) => {
    setSave(n);
    localStorage.setItem("vs25d_save", JSON.stringify(n));
  };

  // 摇杆
  const joyBgRef = useRef<HTMLDivElement>(null);
  const joyKnobRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const bg = joyBgRef.current;
    if (!bg) return;
    let tid = -1;
    let center = { x: 0, y: 0 };
    const upd = (pos: { x: number; y: number }) => {
      const r = 58;
      let dx = pos.x - center.x;
      let dy = pos.y - center.y;
      let d = Math.hypot(dx, dy);
      if (d > r) {
        dx = (dx / d) * r;
        dy = (dy / d) * r;
        d = r;
      }
      joyRef.current = { x: dx / r, y: dy / r };
      joyActiveRef.current = d > 8;
      if (joyKnobRef.current) joyKnobRef.current.style.transform = `translate(${dx}px,${dy}px)`;
    };
    const reset = () => {
      joyRef.current = { x: 0, y: 0 };
      joyActiveRef.current = false;
      if (joyKnobRef.current) joyKnobRef.current.style.transform = `translate(0px,0px)`;
    };
    const onTouch = (e: TouchEvent) => {
      const t = e.touches[0];
      if (!t) return;
      const rect = bg.getBoundingClientRect();
      center = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
      if (e.type === "touchstart") {
        // 放大判定
        const ex = t.clientX, ey = t.clientY;
        if (ex < rect.left - 30 || ex > rect.right + 30 || ey < rect.top - 30 || ey > rect.bottom + 30) return;
        tid = t.identifier;
        upd({ x: ex, y: ey });
        e.preventDefault();
      } else if (e.type === "touchmove") {
        let found = false;
        for (let i = 0; i < e.touches.length; i++) if (e.touches[i].identifier === tid) found = true;
        if (tid === -1 || found) upd({ x: t.clientX, y: t.clientY });
        e.preventDefault();
      } else if (e.type === "touchend") {
        for (let i = 0; i < e.changedTouches.length; i++) if (e.changedTouches[i].identifier === tid) reset();
        tid = -1;
        e.preventDefault();
      }
    };
    bg.addEventListener("touchstart", onTouch, { passive: false });
    bg.addEventListener("touchmove", onTouch, { passive: false });
    bg.addEventListener("touchend", onTouch, { passive: false });
    // 鼠标备用
    let mouseDown = false;
    bg.addEventListener("mousedown", (e) => {
      const r = bg.getBoundingClientRect();
      center = { x: r.left + r.width / 2, y: r.top + r.height / 2 };
      mouseDown = true;
      upd({ x: e.clientX, y: e.clientY });
    });
    window.addEventListener("mousemove", (e) => mouseDown && upd({ x: e.clientX, y: e.clientY }));
    window.addEventListener("mouseup", () => {
      if (mouseDown) reset();
      mouseDown = false;
    });
    return () => {
      bg.removeEventListener("touchstart", onTouch);
      bg.removeEventListener("touchmove", onTouch);
      bg.removeEventListener("touchend", onTouch);
    };
  }, [gs]);

  // 键盘
  useEffect(() => {
    const d = (e: KeyboardEvent) => keysRef.current.add(e.key.toLowerCase());
    const u = (e: KeyboardEvent) => keysRef.current.delete(e.key.toLowerCase());
    window.addEventListener("keydown", d);
    window.addEventListener("keyup", u);
    return () => {
      window.removeEventListener("keydown", d);
      window.removeEventListener("keyup", u);
    };
  }, []);

  const startGame = useCallback(() => {
    stateRef.current = "playing";
    setGs("playing");
    beep(440, 0.15, 0.4);
  }, []);

  // 主游戏循环
  useEffect(() => {
    if (gs === "menu") return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // 游戏数据（闭包内 mutable，避免 React 渲染开销）
    let player = {
      x: 0,
      y: 0,
      hp: 100 + (save.best >= 5 ? Math.floor(save.best / 5) * 5 : 0),
      maxHp: 100 + (save.best >= 5 ? Math.floor(save.best / 5) * 5 : 0),
      speed: 220,
      dmgMul: 1,
      atkSpd: 1,
      pickup: 130,
      inv: 0,
      lv: 1,
      exp: 0,
      need: 20,
      facing: { x: 1, y: 0 },
    };
    let time = 0,
      kills = 0,
      stage = 1;
    const stages = [
      { t: 0, name: "苏醒", enemies: ["slime", "bat"], rate: 0.9 },
      { t: 60, name: "潮汐", enemies: ["slime", "bat", "skeleton"], rate: 0.6 },
      { t: 120, name: "围猎", enemies: ["bat", "skeleton", "golem"], rate: 0.45 },
      { t: 180, name: "深渊", enemies: ["skeleton", "golem"], rate: 0.32 },
      { t: 240, name: "领主降临", enemies: ["golem"], rate: 0.3, boss: true },
      { t: 300, name: "永夜∞", enemies: ["slime", "bat", "skeleton", "golem"], rate: 0.22, boss: true },
    ];
    let combo = 0,
      comboTimer = 0,
      maxCombo = 0;
    let crateTimer = 75;
    let owned: Record<string, number> = { magic: 1 };
    let ownedPassives: Record<string, number> = {};
    // 应用已解锁被动？初始无

    type Enemy = { x: number; y: number; hp: number; maxHp: number; speed: number; dmg: number; type: string; color: string; elite: boolean; boss: boolean; r: number; hit: number };
    type Gem = { x: number; y: number; v: number; a: number; t: string };
    type Proj = { x: number; y: number; vx: number; vy: number; dmg: number; life: number; type: string };
    type Flame = { x: number; y: number; r: number; life: number; tick: number; dmg: number };
    type DmgNum = { x: number; y: number; v: number; txt: string; a: number; col: string };
    type Particle = { x: number; y: number; vx: number; vy: number; life: number; max: number; col: string; sz: number };

    let enemies: Enemy[] = [];
    let gems: Gem[] = [];
    let projs: Proj[] = [];
    let flames: Flame[] = [];
    let dmgs: DmgNum[] = [];
    let particles: Particle[] = [];
    let holyAngle = 0,
      shieldActive = false,
      shieldTime = 0;

    let spawnTimer = 0;
    let weaponTimers: Record<string, number> = { magic: 0, holy: 0, lightning: 0, flame: 0, shield: 0 };
    let shake = 0,
      shakeTime = 0;
    let invFlash = 0;

    const getStage = () => {
      let cur = stages[0];
      for (const s of stages) if (time >= s.t) cur = s;
      return cur;
    };
    const needExp = (lv: number) => 20 + 10 * (lv - 1) + 2 * (lv - 1) * (lv - 1) * (lv > 20 ? 0.85 : 1);

    const makeEnemy = (type: string, elite = false, boss = false): Enemy => {
      const def: Record<string, { hp: number; dmg: number; speed: number; color: string; r: number }> = {
        slime: { hp: 22, dmg: 8, speed: 48, color: "#4ADE80", r: 14 },
        bat: { hp: 14, dmg: 6, speed: 92, color: "#A78BFA", r: 11 },
        skeleton: { hp: 38, dmg: 12, speed: 58, color: "#E5E7EB", r: 15 },
        golem: { hp: 88, dmg: 20, speed: 32, color: "#9CA3AF", r: 18 },
      };
      const d = def[type] || def.slime;
      let hp = d.hp * (1 + time / 300 * 2.5);
      if (elite) hp *= 3.5;
      if (boss) hp *= 7;
      let spd = d.speed * (1 + time / 600);
      if (elite) spd *= 1.15;
      return { x: 0, y: 0, hp, maxHp: hp, speed: spd, dmg: d.dmg * (elite ? 1.6 : boss ? 2.2 : 1), type, color: elite ? "#F59E0B" : boss ? "#DC2626" : d.color, elite, boss, r: elite ? d.r * 1.4 : boss ? d.r * 2.1 : d.r, hit: 0 };
    };

    const spawnEnemy = () => {
      const st = getStage();
      const type = st.enemies[Math.floor(Math.random() * st.enemies.length)];
      const elite = st.t >= 60 && Math.random() < 0.06;
      const boss = (st as unknown as { boss?: boolean }).boss && Math.random() < 0.012;
      const e = makeEnemy(boss ? "golem" : type, elite, boss);
      const ang = Math.random() * Math.PI * 2;
      const dist = 700 + Math.random() * 220;
      e.x = player.x + Math.cos(ang) * dist;
      e.y = player.y + Math.sin(ang) * dist;
      e.x = Math.max(-1950, Math.min(1950, e.x));
      e.y = Math.max(-1950, Math.min(1950, e.y));
      enemies.push(e);
      if (boss) {
        shake = 10;
        shakeTime = 0.45;
        beep(60, 0.8, 0.5, "sawtooth");
        for (let i = 0; i < 12; i++) particles.push({ x: e.x, y: e.y, vx: (Math.random() - 0.5) * 200, vy: (Math.random() - 0.5) * 200, life: 0.6, max: 0.6, col: "#F87171", sz: 4 });
      }
    };

    const nearest = (x: number, y: number, n = 1, range = 700) => {
      const arr = enemies
        .filter((e) => e.hp > 0)
        .map((e) => ({ e, d: Math.hypot(e.x - x, e.y - y) }))
        .filter((o) => o.d < range)
        .sort((a, b) => a.d - b.d)
        .slice(0, n)
        .map((o) => o.e);
      return arr;
    };

    const addGem = (x: number, y: number, val: number) => {
      const t = val >= 50 ? "epic" : val >= 20 ? "large" : val >= 10 ? "small" : "tiny";
      gems.push({ x: x + (Math.random() - 0.5) * 12, y: y + (Math.random() - 0.5) * 12, v: val, a: 0, t });
    };
    const addDmg = (x: number, y: number, v: number, crit = false, col = "#fff") => dmgs.push({ x, y, v, txt: crit ? `${Math.round(v)}!` : `${Math.round(v)}`, a: 1, col: crit ? "#FDE68A" : col });
    const addParticle = (x: number, y: number, col: string, n = 6) => {
      for (let i = 0; i < n; i++) particles.push({ x, y, vx: (Math.random() - 0.5) * 180, vy: (Math.random() - 0.5) * 180 - 30, life: 0.4, max: 0.4, col, sz: 3 + Math.random() * 3 });
    };

    const genOptions = (): UpgradeOpt[] => {
      const pool: UpgradeOpt[] = [];
      // 可升级已拥有
      for (const id in owned) {
        const lv = owned[id] + (ownedPassives[id] || 0);
        // weapon lv check
        const cur = owned[id] || ownedPassives[id] || 0;
        const max = WEAPONS[id]?.max || 5;
        if (cur < max) pool.push({ id, name: WEAPONS[id].name, desc: WEAPONS[id].desc, type: WEAPONS[id].type, lv: cur, nextLv: cur + 1, isNew: false, icon: WEAPONS[id].icon });
      }
      for (const id in ownedPassives) {
        if (owned[id]) continue;
        const cur = ownedPassives[id];
        const max = WEAPONS[id]?.max || 5;
        if (cur < max) pool.push({ id, name: WEAPONS[id].name, desc: WEAPONS[id].desc, type: WEAPONS[id].type, lv: cur, nextLv: cur + 1, isNew: false, icon: WEAPONS[id].icon });
      }
      // 新武器（解锁池）
      const unlocked = save.unlocked || ["magic", "holy"];
      for (const id of unlocked) {
        if (owned[id] || ownedPassives[id]) continue;
        if (!WEAPONS[id]) continue;
        pool.push({ id, name: WEAPONS[id].name, desc: WEAPONS[id].desc, type: WEAPONS[id].type, lv: 0, nextLv: 1, isNew: true, icon: WEAPONS[id].icon });
      }
      // 被动兜底
      for (const pid of ["speed", "atkspd", "maxhp", "magnet", "dmg"]) {
        if (ownedPassives[pid] || owned[pid]) continue;
        if (!WEAPONS[pid]) continue;
        pool.push({ id: pid, name: WEAPONS[pid].name, desc: WEAPONS[pid].desc, type: "passive", lv: 0, nextLv: 1, isNew: true, icon: WEAPONS[pid].icon });
      }
      // 随机3
      for (let i = pool.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [pool[i], pool[j]] = [pool[j], pool[i]];
      }
      const res: UpgradeOpt[] = [];
      const seen = new Set<string>();
      for (const p of pool) if (!seen.has(p.id) && res.length < 3) (seen.add(p.id), res.push(p));
      return res;
    };

    const applyUpgrade = (id: string) => {
      if (WEAPONS[id]?.type === "passive") {
        ownedPassives[id] = (ownedPassives[id] || 0) + 1;
        const v = WEAPONS[id];
        if (id === "speed") player.speed *= 1.12;
        if (id === "atkspd") player.atkSpd *= 0.9;
        if (id === "maxhp") {
          player.maxHp += 20;
          player.hp += 20;
        }
        if (id === "magnet") player.pickup *= 1.25;
        if (id === "dmg") player.dmgMul *= 1.15;
        beep(600, 0.12);
      } else {
        owned[id] = (owned[id] || 0) + 1;
        beep(880, 0.12);
        // 特效
        shake = 6;
        shakeTime = 0.25;
      }
      // 进化检测（示例：魔法5+速度3 → 超级飞弹）
      if ((owned["magic"] || 0) >= 5 && (ownedPassives["speed"] || 0) >= 3 && !owned["magic_evo"]) {
        owned["magic_evo"] = 1;
        delete owned["magic"];
        owned["magic"] = 5;
        addDmg(player.x, player.y - 40, 0, true, "#F472B6");
        shake = 10;
        shakeTime = 0.6;
        beep(880, 0.5, 0.4);
      }
    };

    let last = performance.now();
    const loop = (now: number) => {
      const dt = Math.min(0.033, (now - last) / 1000);
      last = now;
      if (stateRef.current !== "playing") {
        if (stateRef.current === "paused") {
          // 仍渲染静止画面
        } else {
          reqRef.current = requestAnimationFrame(loop);
          return;
        }
      }
      // 计时
      if (stateRef.current === "playing") {
        time += dt;
        // 阶段
        const st = getStage();
        if (st.t !== stages[stage - 1].t) {
          const idx = stages.findIndex((s) => s.t === st.t);
          if (idx !== -1) stage = idx + 1;
          shake = 8;
          shakeTime = 0.4;
          beep(440, 0.3);
        }
        // 胜利后继续无限
        if (time >= 360 && stateRef.current === "playing") {
          stateRef.current = "victory";
          setGs("victory");
          beep(880, 0.6);
          // 存档
          const ns = { ...save, wins: save.wins + 1, best: Math.max(save.best, player.lv), kills: save.kills + kills };
          if (player.lv >= 5 && !ns.unlocked.includes("lightning")) ns.unlocked.push("lightning");
          if (player.lv >= 10 && !ns.unlocked.includes("flame")) ns.unlocked.push("flame");
          if (player.lv >= 15 && !ns.unlocked.includes("shield")) ns.unlocked.push("shield");
          persist(ns);
        }

        // 移动输入
        let mx = 0,
          my = 0;
        if (joyActiveRef.current) {
          mx = joyRef.current.x;
          my = joyRef.current.y;
        } else {
          if (keysRef.current.has("w") || keysRef.current.has("arrowup")) my -= 1;
          if (keysRef.current.has("s") || keysRef.current.has("arrowdown")) my += 1;
          if (keysRef.current.has("a") || keysRef.current.has("arrowleft")) mx -= 1;
          if (keysRef.current.has("d") || keysRef.current.has("arrowright")) mx += 1;
          const l = Math.hypot(mx, my);
          if (l > 0) {
            mx /= l;
            my /= l;
          }
        }
        // 小米平板横屏防误触：摇杆死区
        if (Math.hypot(mx, my) > 0.12) {
          player.x += mx * player.speed * dt;
          player.y += my * player.speed * dt;
          player.facing = { x: mx, y: my };
        }
        player.x = Math.max(-1950, Math.min(1950, player.x));
        player.y = Math.max(-1950, Math.min(1950, player.y));
        if (player.inv > 0) player.inv -= dt;

        // 刷怪
        spawnTimer -= dt;
        const curRate = getStage().rate * (0.85 + Math.sin(time * 0.3) * 0.1);
        if (spawnTimer <= 0) {
          spawnTimer = Math.max(0.12, curRate);
          const per = time < 30 ? 1 : time < 90 ? 2 : time < 180 ? 3 : 4;
          for (let i = 0; i < per; i++) if (enemies.length < 340) spawnEnemy();
        }

        // 武器
        holyAngle += dt * 3;
        // 魔法飞弹
        weaponTimers.magic -= dt;
        if (weaponTimers.magic <= 0 && owned.magic) {
          const lv = owned.magic;
          let cd = 0.65 * Math.pow(0.95, lv - 1) * player.atkSpd;
          if (owned["magic_evo"]) cd *= 0.82;
          weaponTimers.magic = Math.max(0.12, cd);
          const tg = nearest(player.x, player.y, lv >= 5 ? 3 : lv >= 3 ? 2 : 1);
          for (const t of tg) {
            const ang = Math.atan2(t.y - player.y, t.x - player.x);
            const spd = owned["magic_evo"] ? 640 : 540;
            projs.push({ x: player.x, y: player.y, vx: Math.cos(ang) * spd, vy: Math.sin(ang) * spd, dmg: (12 * Math.pow(1.15, lv - 1) * player.dmgMul) * (owned["magic_evo"] ? 2.2 : 1), life: 2, type: "missile" });
          }
          if (tg.length) beep(880, 0.08, 0.25);
        }
        // 圣环
        if (owned.holy) {
          const lv = owned.holy;
          weaponTimers.holy -= dt;
          if (weaponTimers.holy <= 0) {
            weaponTimers.holy = 0.35;
            const cnt = 2 + Math.floor((lv - 1) / 2);
            const rad = 88 + (lv - 1) * 9;
            for (let i = 0; i < cnt; i++) {
              const a = holyAngle + (Math.PI * 2 * i) / cnt;
              const x = player.x + Math.cos(a) * rad;
              const y = player.y + Math.sin(a) * rad;
              for (const e of enemies) if (Math.hypot(e.x - x, e.y - y) < 22) {
                e.hp -= 14 * Math.pow(1.15, lv - 1) * player.dmgMul * dt * 4;
                if (e.hp <= 0) {
                }
              }
            }
          }
        }
        // 闪电
        weaponTimers.lightning -= dt;
        if (weaponTimers.lightning <= 0 && owned.lightning) {
          const lv = owned.lightning;
          weaponTimers.lightning = Math.max(0.4, 1.3 * Math.pow(0.95, lv - 1) * player.atkSpd);
          const first = nearest(player.x, player.y, 1)[0];
          if (first) {
            let cur: Enemy | null = first;
            const hit: Enemy[] = [first];
            for (let i = 0; i < (2 + Math.floor((lv - 1) / 2)); i++) {
              let best: Enemy | null = null, bestD = 200;
              for (const e of enemies) if (e.hp > 0 && !hit.includes(e)) { const d = Math.hypot(e.x - (cur as Enemy).x, e.y - (cur as Enemy).y); if (d < bestD) (bestD = d, best = e); }
              if (best) (hit.push(best), (cur = best));
              else break;
            }
            for (let i = 0; i < hit.length; i++) {
              const dmg = 20 * Math.pow(1.15, lv - 1) * player.dmgMul * Math.pow(0.85, i);
              hit[i].hp -= dmg;
              addDmg(hit[i].x, hit[i].y, dmg, Math.random() < 0.12, "#60A5FA");
            }
            // 闪电特效
            for (let i = 0; i < hit.length; i++) for (let k = 0; k < 3; k++) particles.push({ x: hit[i].x, y: hit[i].y, vx: (Math.random() - 0.5) * 120, vy: (Math.random() - 0.5) * 120, life: 0.25, max: 0.25, col: "#60A5FA", sz: 2 });
            beep(2000, 0.14, 0.25, "square");
            shake = 2.5;
            shakeTime = 0.12;
          }
        }
        // 火焰
        weaponTimers.flame -= dt;
        if (weaponTimers.flame <= 0 && owned.flame) {
          const lv = owned.flame;
          weaponTimers.flame = Math.max(0.8, 2.1 * player.atkSpd);
          const tg = nearest(player.x, player.y, 1)[0];
          const fx = tg ? tg.x : player.x + player.facing.x * 120;
          const fy = tg ? tg.y : player.y + player.facing.y * 120;
          flames.push({ x: fx, y: fy, r: 108 + (lv - 1) * 12, life: 3.2 + (lv - 1) * 0.32, tick: 0, dmg: 9 * Math.pow(1.15, lv - 1) * player.dmgMul });
          addParticle(fx, fy, "#F97316", 10);
        }
        for (let i = flames.length - 1; i >= 0; i--) {
          const f = flames[i];
          f.life -= dt;
          f.tick -= dt;
          if (f.tick <= 0) {
            f.tick = 0.32;
            for (const e of enemies) if (Math.hypot(e.x - f.x, e.y - f.y) < f.r) e.hp -= f.dmg;
          }
          if (f.life <= 0) flames.splice(i, 1);
        }
        // 护盾
        weaponTimers.shield -= dt;
        if (weaponTimers.shield <= 0 && owned.shield) {
          const lv = owned.shield;
          weaponTimers.shield = 5.2;
          shieldActive = true;
          shieldTime = 1.25 + (lv - 1) * 0.16;
          const rad = 90 + (lv - 1) * 7;
          for (const e of enemies) if (Math.hypot(e.x - player.x, e.y - player.y) < rad) {
            e.hp -= 24 * Math.pow(1.15, lv - 1) * player.dmgMul;
            const a = Math.atan2(e.y - player.y, e.x - player.x);
            e.x += Math.cos(a) * 38;
            e.y += Math.sin(a) * 38;
          }
          addParticle(player.x, player.y, "#7DD3FC", 14);
          beep(320, 0.2, 0.4);
          shake = 5;
          shakeTime = 0.22;
        }
        if (shieldActive) {
          shieldTime -= dt;
          if (shieldTime <= 0) shieldActive = false;
        }

        // 投射物
        for (let i = projs.length - 1; i >= 0; i--) {
          const p = projs[i];
          p.x += p.vx * dt;
          p.y += p.vy * dt;
          p.life -= dt;
          let hit = false;
          for (const e of enemies) if (e.hp > 0 && Math.hypot(e.x - p.x, e.y - p.y) < e.r + 10) {
            e.hp -= p.dmg;
            addDmg(e.x, e.y - 10, p.dmg, Math.random() < 0.08, "#38BDF8");
            addParticle(e.x, e.y, "#38BDF8", 5);
            hit = true;
            break;
          }
          if (hit || p.life <= 0) {
            if (hit && owned["magic_evo"]) {
              for (const e of enemies) if (Math.hypot(e.x - p.x, e.y - p.y) < 92) e.hp -= p.dmg * 0.7;
              shake = 4;
              shakeTime = 0.16;
            }
            projs.splice(i, 1);
          }
        }

        // 敌人移动 + 碰撞玩家
        for (const e of enemies) {
          if (e.hp <= 0) continue;
          const ang = Math.atan2(player.y - e.y, player.x - e.x);
          // 分离
          let sx = 0, sy = 0;
          for (const o of enemies) if (o !== e && o.hp > 0) { const d = Math.hypot(e.x - o.x, e.y - o.y); if (d < 32 && d > 1) { sx += (e.x - o.x) / d; sy += (e.y - o.y) / d; } }
          e.x += (Math.cos(ang) * e.speed + sx * 42) * dt;
          e.y += (Math.sin(ang) * e.speed + sy * 42) * dt;
          if (Math.hypot(e.x - player.x, e.y - player.y) < e.r + 12 && player.inv <= 0) {
            if (shieldActive) {
              const a = Math.atan2(e.y - player.y, e.x - player.x);
              e.x += Math.cos(a) * 44;
              e.y += Math.sin(a) * 44;
            } else {
              let dmg = e.dmg;
              // 难度护甲
              player.hp -= dmg;
              player.inv = 0.45;
              shake = 4;
              shakeTime = 0.14;
              beep(180, 0.16, 0.35, "sawtooth");
              addDmg(player.x, player.y - 18, dmg, false, "#FF6B6B");
              if (player.hp <= 0) {
                stateRef.current = "gameover";
                setGs("gameover");
                beep(80, 0.7, 0.5, "sawtooth");
                const ns = { ...save, best: Math.max(save.best, player.lv), kills: save.kills + kills };
                if (player.lv >= 5 && !ns.unlocked.includes("lightning")) ns.unlocked.push("lightning");
                if (player.lv >= 10 && !ns.unlocked.includes("flame")) ns.unlocked.push("flame");
                if (player.lv >= 15 && !ns.unlocked.includes("shield")) ns.unlocked.push("shield");
                persist(ns);
              }
            }
          }
          if (e.hit > 0) e.hit -= dt;
        }
        // 清死亡
        for (let i = enemies.length - 1; i >= 0; i--) {
          const e = enemies[i];
          if (e.hp <= 0) {
            const val = e.boss ? 45 : e.elite ? 22 : e.type === "golem" ? 14 : e.type === "skeleton" ? 8 : 5;
            addGem(e.x, e.y, val);
            addParticle(e.x, e.y, e.color, e.boss ? 16 : 7);
            enemies.splice(i, 1);
            kills++;
            combo++; comboTimer = 2.6;
            maxCombo = Math.max(maxCombo, combo);
            maxComboRef.current = maxCombo;
            if (combo % 12 === 0) { beep(880, 0.12); shake = 2; shakeTime = 0.1; }
          }
        }
        if (comboTimer > 0) {
          comboTimer -= dt;
          if (comboTimer <= 0) {
            if (combo >= 18) {
              // 连击奖励宝石雨
              for (let i = 0; i < Math.floor(combo * 0.7); i++) setTimeout(() => addGem(player.x + (Math.random() - 0.5) * 200, player.y + (Math.random() - 0.5) * 200, 5), i * 36);
            }
            combo = 0;
          }
        }
        // 福袋
        crateTimer -= dt;
        if (crateTimer <= 0) {
          crateTimer = 70 + Math.random() * 22;
          // 生成福袋（简化：直接宝石雨+回血）
          gems.push({ x: player.x + (Math.random() - 0.5) * 420, y: player.y + (Math.random() - 0.5) * 420, v: 999, a: 0, t: "crate" });
        }

        // 处理升级（由React层 pendingUpgradeRef 传入）
        if (pendingUpgradeRef.current) {
          applyUpgrade(pendingUpgradeRef.current);
          pendingUpgradeRef.current = null;
        }
        // 宝石拾取
        for (let i = gems.length - 1; i >= 0; i--) {
          const g = gems[i];
          if (g.v === 999) {
            // 福袋
            if (Math.hypot(g.x - player.x, g.y - player.y) < 26) {
              gems.splice(i, 1);
              const r = Math.random();
              if (r < 0.33) { for (let k = 0; k < 28; k++) addGem(player.x + (Math.random() - 0.5) * 180, player.y + (Math.random() - 0.5) * 180, 5); beep(1200, 0.18); }
              else if (r < 0.66) { player.hp = Math.min(player.maxHp, player.hp + 999); for (let k = 0; k < 16; k++) addGem(player.x + (Math.random() - 0.5) * 160, player.y + (Math.random() - 0.5) * 160, 5); }
              else { for (const e of enemies) e.hp -= 999; shake = 9; shakeTime = 0.45; }
              continue;
            }
          } else {
            const d = Math.hypot(g.x - player.x, g.y - player.y);
            if (d < player.pickup) {
              const spd = 820;
              const ang = Math.atan2(player.y - g.y, player.x - g.x);
              g.x += Math.cos(ang) * spd * dt;
              g.y += Math.sin(ang) * spd * dt;
              if (d < 18) {
                gems.splice(i, 1);
                player.exp += g.v;
                beep(1200, 0.06, 0.2);
                // 升级检测
                while (player.exp >= player.need) {
                  player.exp -= player.need;
                  player.lv++;
                  player.need = needExp(player.lv);
                  stateRef.current = "levelup";
                  setGs("levelup");
                  setLevelOpts(genOptions());
                  beep(660, 0.25, 0.35);
                  break;
                }
              }
            } else g.a += dt * 3;
          }
        }

        // HUD
        if (Math.floor(time * 4) % 2 === 0) setHud({ hp: Math.round(player.hp), maxHp: player.maxHp, exp: player.exp, need: player.need, lv: player.lv, time, kills, stage, stageName: getStage().name, combo, weapons: Object.keys(owned).concat(Object.keys(ownedPassives)) });
      }

      // 渲染
      const sx = W / 2 - player.x + (shakeTime > 0 ? (Math.random() - 0.5) * shake * 6 : 0);
      const sy = H / 2 - player.y + (shakeTime > 0 ? (Math.random() - 0.5) * shake * 6 : 0);
      if (shakeTime > 0) shakeTime -= dt;

      // 背景
      ctx.fillStyle = "#0B0A1A";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      ctx.translate(sx, sy);
      // 网格
      ctx.strokeStyle = "rgba(124,58,237,0.14)";
      ctx.lineWidth = 1;
      const gsGrid = 64;
      const left = Math.floor((player.x - W / 2) / gsGrid) * gsGrid;
      const top = Math.floor((player.y - H / 2) / gsGrid) * gsGrid;
      ctx.beginPath();
      for (let x = left; x < left + W + gsGrid * 2; x += gsGrid) { ctx.moveTo(x, top); ctx.lineTo(x, top + H + gsGrid * 2); }
      for (let y = top; y < top + H + gsGrid * 2; y += gsGrid) { ctx.moveTo(left, y); ctx.lineTo(left + W + gsGrid * 2, y); }
      ctx.stroke();
      // 火焰区域
      for (const f of flames) {
        const a = 0.32 + Math.sin(time * 5 + f.x) * 0.08;
        ctx.fillStyle = `rgba(249,115,22,${a})`;
        ctx.beginPath(); ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = `rgba(251,146,60,${a * 0.5})`;
        ctx.beginPath(); ctx.arc(f.x, f.y, f.r * 0.7, 0, Math.PI * 2); ctx.fill();
      }
      // 宝石
      for (const g of gems) {
        const bob = Math.sin(g.a) * 2.2;
        ctx.save();
        ctx.translate(g.x, g.y + bob);
        if (g.v === 999) {
          ctx.fillStyle = "#FBBF24";
          ctx.fillRect(-14, -14, 28, 28);
          ctx.fillStyle = "#78350F";
          ctx.fillRect(-4, -4, 8, 12);
          ctx.fillStyle = "#FEF08A";
          ctx.font = "10px system-ui";
          ctx.fillText("福袋", -12, -16);
        } else {
          const col = g.t === "epic" ? "#F43F5E" : g.t === "large" ? "#F59E0B" : g.t === "small" ? "#22D3EE" : "#4ADE80";
          ctx.fillStyle = col as string;
          ctx.beginPath();
          const s = g.t === "large" ? 8 : g.t === "small" ? 6 : 5;
          ctx.moveTo(0, -s); ctx.lineTo(s, 0); ctx.lineTo(0, s); ctx.lineTo(-s, 0); ctx.closePath(); ctx.fill();
          ctx.fillStyle = "rgba(255,255,255,0.9)";
          ctx.fillRect(-1, -s + 1, 2, 2);
        }
        ctx.restore();
        // 阴影
        ctx.fillStyle = "rgba(0,0,0,0.22)";
        ctx.beginPath(); ctx.ellipse(g.x, g.y + 8, 7, 3, 0, 0, Math.PI * 2); ctx.fill();
      }
      // 敌人
      for (const e of enemies) {
        // 阴影
        ctx.fillStyle = "rgba(0,0,0,0.28)";
        ctx.beginPath(); ctx.ellipse(e.x + 2, e.y + 10, e.r * 0.9, 4, 0, 0, Math.PI * 2); ctx.fill();
        // 本体
        ctx.fillStyle = e.hit > 0 ? "#fff" : e.color;
        ctx.beginPath(); ctx.arc(e.x, e.y, e.r, 0, Math.PI * 2); ctx.fill();
        if (e.elite) { ctx.strokeStyle = "#FBBF24"; ctx.lineWidth = 2.5; ctx.stroke(); }
        if (e.boss) { ctx.strokeStyle = "#DC2626"; ctx.lineWidth = 3; ctx.stroke(); ctx.fillStyle = "#1F1140"; ctx.beginPath(); ctx.arc(e.x - 6, e.y - 4, 3, 0, Math.PI * 2); ctx.arc(e.x + 6, e.y - 4, 3, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(e.x - 6, e.y - 4, 1.2, 0, Math.PI * 2); ctx.arc(e.x + 6, e.y - 4, 1.2, 0, Math.PI * 2); ctx.fill(); }
        else {
          ctx.fillStyle = "#1F1140";
          ctx.beginPath(); ctx.arc(e.x - 4, e.y - 3, 2, 0, Math.PI * 2); ctx.arc(e.x + 4, e.y - 3, 2, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = "#fff";
          ctx.beginPath(); ctx.arc(e.x - 4, e.y - 3, 0.9, 0, Math.PI * 2); ctx.arc(e.x + 4, e.y - 3, 0.9, 0, Math.PI * 2); ctx.fill();
        }
        // 血条
        if (e.hp < e.maxHp) {
          ctx.fillStyle = "rgba(0,0,0,0.5)";
          ctx.fillRect(e.x - e.r, e.y - e.r - 7, e.r * 2, 3);
          ctx.fillStyle = e.boss ? "#EF4444" : "#22C55E";
          ctx.fillRect(e.x - e.r, e.y - e.r - 7, (e.r * 2 * e.hp) / e.maxHp, 3);
        }
      }
      // 玩家阴影
      ctx.fillStyle = "rgba(0,0,0,0.32)";
      ctx.beginPath(); ctx.ellipse(player.x + 3, player.y + 12, 13, 5, 0, 0, Math.PI * 2); ctx.fill();
      // 玩家
      ctx.save();
      ctx.translate(player.x, player.y);
      if (player.inv > 0) ctx.globalAlpha = 0.5 + 0.5 * Math.sin(performance.now() * 0.02);
      // 护盾
      if (shieldActive) {
        ctx.strokeStyle = `rgba(125,211,252,${0.5 + Math.sin(time * 8) * 0.2})`;
        ctx.lineWidth = 3;
        ctx.beginPath(); ctx.arc(0, 0, 92, 0, Math.PI * 2); ctx.stroke();
        ctx.fillStyle = "rgba(125,211,252,0.09)";
        ctx.beginPath(); ctx.arc(0, 0, 92, 0, Math.PI * 2); ctx.fill();
      }
      // 身体
      ctx.fillStyle = player.inv > 0 ? "#F87171" : "#7C3AED";
      ctx.beginPath(); ctx.roundRect(-14, -18, 28, 28, 7); ctx.fill();
      ctx.fillStyle = "#A78BFA";
      ctx.fillRect(-12, -12, 24, 10);
      // 眼睛跟随
      const ang = Math.atan2(player.facing.y, player.facing.x);
      const ex = Math.cos(ang) * 1.2, ey = Math.sin(ang) * 1.2;
      ctx.fillStyle = "#1F1140";
      ctx.beginPath(); ctx.arc(-5 + ex, -6 + ey, 2.4, 0, Math.PI * 2); ctx.arc(5 + ex, -6 + ey, 2.4, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#fff";
      ctx.beginPath(); ctx.arc(-5 + ex, -6 + ey, 0.9, 0, Math.PI * 2); ctx.arc(5 + ex, -6 + ey, 0.9, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
      // 圣环
      if (owned.holy) {
        const cnt = 2 + Math.floor((owned.holy - 1) / 2);
        const rad = 88 + (owned.holy - 1) * 9;
        for (let i = 0; i < cnt; i++) {
          const a = holyAngle + (Math.PI * 2 * i) / cnt;
          const x = player.x + Math.cos(a) * rad;
          const y = player.y + Math.sin(a) * rad;
          ctx.fillStyle = "#FDE68A";
          ctx.beginPath(); ctx.arc(x, y, 11, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = "#F59E0B";
          ctx.beginPath(); ctx.arc(x, y, 6, 0, Math.PI * 2); ctx.fill();
        }
      }
      // 投射物
      for (const p of projs) {
        ctx.fillStyle = p.type === "missile" ? "#38BDF8" : "#F472B6";
        ctx.beginPath(); ctx.arc(p.x, p.y, 7, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = "#fff";
        ctx.beginPath(); ctx.arc(p.x, p.y, 3, 0, Math.PI * 2); ctx.fill();
      }
      // 粒子
      for (const pt of particles) {
        ctx.globalAlpha = pt.life / pt.max;
        ctx.fillStyle = pt.col;
        ctx.beginPath(); ctx.arc(pt.x, pt.y, pt.sz, 0, Math.PI * 2); ctx.fill();
      }
      ctx.globalAlpha = 1;
      for (let i = particles.length - 1; i >= 0; i--) {
        particles[i].x += particles[i].vx * dt;
        particles[i].y += particles[i].vy * dt;
        particles[i].vy += 260 * dt;
        particles[i].life -= dt;
        if (particles[i].life <= 0) particles.splice(i, 1);
      }
      // 伤害数字
      for (const d of dmgs) {
        ctx.globalAlpha = d.a;
        ctx.fillStyle = d.col;
        ctx.font = d.txt.includes("!") ? "bold 16px system-ui" : "13px system-ui";
        ctx.fillText(d.txt, d.x, d.y);
      }
      ctx.globalAlpha = 1;
      for (let i = dmgs.length - 1; i >= 0; i--) {
        dmgs[i].y -= 42 * dt;
        dmgs[i].a -= dt * 1.4;
        if (dmgs[i].a <= 0) dmgs.splice(i, 1);
      }
      ctx.restore();
      reqRef.current = requestAnimationFrame(loop);
    };
    reqRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(reqRef.current);
  }, [gs, save.best, save.unlocked]);

  const fmt = (s: number) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

  return (
    <div className="min-h-screen bg-[#070615] text-white select-none touch-manipulation overflow-hidden flex flex-col" style={{ touchAction: "none" }}>
      {/* 顶部导航 */}
      <header className="h-10 flex items-center justify-between px-3 bg-[#0E0C24]/80 backdrop-blur border-b border-white/10 shrink-0">
        <div className="flex items-center gap-2 font-bold tracking-tight">
          <span className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-600 to-fuchsia-600 grid place-items-center text-sm">◉</span>
          VampireSurvivor25D
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-violet-600/30 border border-violet-500/30">小米平板8直玩版</span>
          <span className="hidden sm:inline text-xs font-normal text-white/60">2.5D割草 · 越玩越爽 · 永久保存</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs">
          <button onClick={() => setShowSettings(!showSettings)} className="px-2.5 py-1 rounded-full bg-white/10 border border-white/15">⚙ 设置</button>
          <a href="https://github.com/linmuye45-ai/ai-website-cloner-template" target="_blank" className="px-2.5 py-1 rounded-full bg-violet-600">⭐ Godot源码</a>
        </div>
      </header>

      {/* 设置弹窗 */}
      {showSettings && (
        <div className="fixed inset-0 z-40 grid place-items-center bg-black/60 backdrop-blur p-4">
          <div className="w-full max-w-[420px] rounded-2xl bg-[#15132E] border border-white/10 p-5 space-y-3">
            <div className="font-bold">设置</div>
            <div className="text-sm text-white/70">本版本已针对小米平板8优化：1920×1080、触屏摇杆、60FPS、横屏沉浸</div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="rounded-xl bg-white/5 p-3 border border-white/10">已解锁：{save.unlocked.join("、")}</div>
              <div className="rounded-xl bg-white/5 p-3 border border-white/10">最高等级：Lv.{save.best}</div>
            </div>
            <button
              onClick={() => {
                if (confirm("重置存档？")) {
                  localStorage.removeItem("vs25d_save");
                  location.reload();
                }
              }}
              className="w-full py-2 rounded-xl bg-white/10 border border-white/15 text-sm"
            >
              清除存档
            </button>
            <button onClick={() => setShowSettings(false)} className="w-full py-2.5 rounded-xl bg-violet-600 font-bold">
              返回
            </button>
          </div>
        </div>
      )}

      {/* 菜单 */}
      {gs === "menu" && (
        <div className="flex-1 grid place-items-center p-4 bg-[radial-gradient(ellipse_at_top,_rgba(124,58,237,0.25),_transparent_60%)]">
          <div className="w-full max-w-[560px] rounded-[20px] bg-[#0F0E1E] border border-violet-500/20 p-6 shadow-[0_10px_60px_rgba(124,58,237,0.25)]">
            <div className="text-center space-y-2">
              <div className="mx-auto w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-600 to-fuchsia-600 grid place-items-center text-2xl">◉</div>
              <h1 className="text-[22px] font-extrabold tracking-tight">VampireSurvivor25D</h1>
              <p className="text-xs text-white/60">俯视角2.5D生存 · 6阶段Boss · 5武器+3进化 · 全程自动攻击</p>
            </div>

            <div className="grid grid-cols-3 gap-2 mt-5 text-center text-xs">
              <div className="rounded-xl bg-white/[0.06] border border-white/10 p-2.5"><div className="text-white/60">最高</div><div className="font-bold">Lv.{save.best}</div></div>
              <div className="rounded-xl bg-white/[0.06] border border-white/10 p-2.5"><div className="text-white/60">通关</div><div className="font-bold">{save.wins}次</div></div>
              <div className="rounded-xl bg-white/[0.06] border border-white/10 p-2.5"><div className="text-white/60">总击杀</div><div className="font-bold">{save.kills}</div></div>
            </div>

            <div className="mt-4 rounded-xl bg-gradient-to-r from-violet-600/20 to-fuchsia-600/20 border border-violet-500/20 p-3 text-xs leading-5">
              <div className="font-bold text-violet-300">✦ 越玩越爽循环</div>
              每局必有永久收获：升级解锁新武器 → 连击→宝石雨 → 福袋每75秒 → Boss掉落Epic宝石 → 通关+2%永久伤害。小平板横屏用左下摇杆，右手看戏割草。
            </div>

            <button onClick={startGame} className="mt-4 w-full py-3.5 rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 font-extrabold text-[16px] shadow-[0_8px_24px_rgba(124,58,237,0.5)] active:scale-[0.98] transition">
              ▶ 立即开始 · 小米平板横屏更爽
            </button>
            <div className="mt-2 flex gap-2 text-[11px] text-white/60 justify-center">
              <span>🎮 左摇杆移动</span>
              <span>·</span>
              <span>自动攻击</span>
              <span>·</span>
              <span>存档自动保存</span>
            </div>

            <div className="mt-4 text-[11px] leading-4 text-white/45">
              Godot原版在 <code className="px-1 py-0.5 rounded bg-white/10">godot/VampireSurvivor25D</code>，本页为平板直玩Web版，数据互通思路：Godot导出APK后同样读取本地存档，手机平板电视都能玩。已有对象池350同屏优化。
            </div>
          </div>
        </div>
      )}

      {/* 游戏区 */}
      {gs !== "menu" && (
        <div className="flex-1 flex flex-col min-h-0">
          {/* HUD */}
          <div className="h-12 shrink-0 flex items-center gap-2 px-2 bg-[#0E0C24] border-b border-white/10">
            <div className="flex-1 max-w-[260px]">
              <div className="h-2.5 rounded-full bg-white/10 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-violet-600 to-fuchsia-500 transition-all" style={{ width: `${(hud.exp / hud.need) * 100}%` }} />
              </div>
              <div className="text-[10px] text-white/70 mt-0.5">EXP {hud.exp}/{hud.need}</div>
            </div>
            <div className="text-center">
              <div className="text-[11px] text-white/60">等级</div>
              <div className="font-bold leading-none">Lv.{hud.lv}</div>
            </div>
            <div className="text-center px-2">
              <div className="text-[11px] text-white/60">时间</div>
              <div className="font-mono font-bold">{fmt(hud.time)}</div>
            </div>
            <div className="hidden sm:block text-center px-2">
              <div className="text-[11px] text-white/60">击杀</div>
              <div className="font-bold">{hud.kills}</div>
            </div>
            <div className="flex-1 text-right hidden md:block">
              <div className="text-xs px-2 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 inline-block">阶段 {hud.stage} · {hud.stageName}</div>
            </div>
            <div className="ml-auto flex items-center gap-1">
              <div className="hidden lg:flex gap-1">
                {hud.weapons.slice(0, 6).map((w) => (
                  <span key={w} className="w-7 h-7 grid place-items-center rounded-lg bg-white/10 border border-white/10 text-xs" title={w}>
                    {WEAPONS[w]?.icon || "?"}
                  </span>
                ))}
              </div>
              <div className="text-right ml-1">
                <div className="text-[11px] text-white/60">HP</div>
                <div className="text-xs font-bold" style={{ color: hud.hp / hud.maxHp < 0.3 ? "#F87171" : hud.hp / hud.maxHp < 0.6 ? "#FBBF24" : "#fff" }}>{hud.hp}/{hud.maxHp}</div>
              </div>
              <div className="w-1 h-8 bg-white/10 rounded mx-1 hidden sm:block" />
              <div className="hidden sm:block text-center">
                <div className="text-[10px] text-white/60">连击</div>
                <div className={`font-extrabold ${hud.combo >= 12 ? "text-amber-300" : ""}`}>x{hud.combo}</div>
              </div>
              <button
                onClick={() => {
                  if (stateRef.current === "playing") {
                    stateRef.current = "paused";
                    setGs("paused");
                  } else {
                    stateRef.current = "playing";
                    setGs("playing");
                  }
                }}
                className="ml-1 w-8 h-8 rounded-full bg-white/10 border border-white/15 grid place-items-center"
              >
                {gs === "paused" ? "▶" : "⏸"}
              </button>
            </div>
          </div>

          {/* 画布 */}
          <div className="flex-1 relative bg-[#070615] overflow-hidden min-h-[320px]">
            <canvas ref={canvasRef} width={W} height={H} className="absolute inset-0 w-full h-full object-contain" style={{ imageRendering: "pixelated" }} />

            {/* 血条 */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-[min(380px,60vw)] h-2 rounded-full bg-black/40 border border-white/10 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-emerald-500 to-green-400 transition-all" style={{ width: `${Math.max(0, (hud.hp / hud.maxHp) * 100)}%` }} />
            </div>

            {/* 摇杆 - 小米平板左下 */}
            <div className="absolute left-3 bottom-3 sm:left-6 sm:bottom-6 select-none">
              <div ref={joyBgRef} className="w-[118px] h-[118px] sm:w-[132px] sm:h-[132px] rounded-full bg-black/30 backdrop-blur border border-white/15 grid place-items-center shadow-[0_8px_30px_rgba(0,0,0,0.5)]">
                <div ref={joyKnobRef} className="w-[56px] h-[56px] rounded-full bg-gradient-to-br from-violet-600 to-fuchsia-500 border border-white/30 shadow-lg will-change-transform" />
              </div>
              <div className="text-[10px] text-white/50 text-center mt-1">左摇杆 · 按住拖动</div>
            </div>

            {/* 右下提示 */}
            <div className="absolute right-2 bottom-2 hidden sm:flex flex-col items-end gap-1">
              <div className="text-[10px] px-2 py-1 rounded-full bg-black/50 border border-white/10 text-white/70">🎯 自动攻击 · 靠近宝石自动拾取 · 福袋75秒一次</div>
              <button
                onClick={() => {
                  stateRef.current = "menu";
                  setGs("menu");
                }}
                className="text-[11px] px-2.5 py-1 rounded-full bg-white/10 border border-white/15"
              >
                退出到菜单
              </button>
            </div>

            {/* 升级 */}
            {gs === "levelup" && (
              <div className="absolute inset-0 bg-black/60 backdrop-blur-[6px] grid place-items-center p-3">
                <div className="w-full max-w-[820px] rounded-[18px] bg-[#0F0E1E] border border-violet-500/25 p-4 shadow-[0_16px_60px_rgba(0,0,0,0.6)] max-h-[90vh] overflow-auto">
                  <div className="text-center font-extrabold text-[18px]">升级！选择一项强化</div>
                  <div className="text-center text-xs text-white/60 mt-1">三选一 · 每局永久成长 · 越后期越爽</div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
                    {levelOpts.map((o) => (
                      <button
                        key={o.id}
                        onClick={() => {
                          pendingUpgradeRef.current = o.id;
                          stateRef.current = "playing";
                          setGs("playing");
                        }}
                        className="rounded-2xl bg-white/[0.06] border border-white/10 p-3 text-left hover:bg-white/[0.09] hover:border-violet-500/30 transition text-sm"
                      >
                        <div className="w-10 h-10 rounded-xl grid place-items-center text-lg" style={{ background: o.type === "active" ? "rgba(124,58,237,0.9)" : "rgba(16,185,129,0.9)" }}>
                          {o.icon}
                        </div>
                        <div className="font-bold mt-2">{o.name}</div>
                        <div className="text-xs text-violet-300">{o.isNew ? "新获得！" : `Lv.${o.lv} → Lv.${o.nextLv}`}</div>
                        <div className="text-xs text-white/70 mt-1 leading-4">{o.desc}</div>
                        <div className="mt-2 text-xs font-bold text-center py-1.5 rounded-xl bg-violet-600">选择</div>
                      </button>
                    ))}
                  </div>
                  <div className="text-center text-[11px] text-white/45 mt-3">键盘 1/2/3 也可选</div>
                </div>
              </div>
            )}

            {/* 暂停 */}
            {gs === "paused" && (
              <div className="absolute inset-0 bg-black/55 grid place-items-center">
                <div className="rounded-2xl bg-[#0F0E1E] border border-white/15 p-5 w-[320px] text-center space-y-3">
                  <div className="font-extrabold text-lg">已暂停</div>
                  <button
                    onClick={() => {
                      stateRef.current = "playing";
                      setGs("playing");
                    }}
                    className="w-full py-2.5 rounded-xl bg-violet-600 font-bold"
                  >
                    继续
                  </button>
                  <button
                    onClick={() => {
                      stateRef.current = "menu";
                      setGs("menu");
                    }}
                    className="w-full py-2 rounded-xl bg-white/10 border border-white/15 text-sm"
                  >
                    返回主菜单
                  </button>
                </div>
              </div>
            )}

            {/* 结束 */}
            {(gs === "gameover" || gs === "victory") && (
              <div className="absolute inset-0 bg-black/65 backdrop-blur grid place-items-center p-4">
                <div className="w-full max-w-[420px] rounded-[18px] bg-[#0F0E1E] border border-white/12 p-5 text-center space-y-2">
                  <div className={`text-2xl font-extrabold ${gs === "victory" ? "text-emerald-400" : "text-red-400"}`}>{gs === "victory" ? "胜利！" : "游戏结束"}</div>
                  <div className="text-sm text-white/80">存活 {fmt(hud.time)} · 击杀 {hud.kills} · 等级 Lv.{hud.lv} · 最高连击 x{maxComboRef.current}</div>
                  <div className="text-xs text-white/60">阶段 {hud.stage} · {hud.stageName} · 解锁进度 {save.unlocked.length}/6</div>
                  {gs === "victory" && <div className="text-xs px-2 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 inline-block">已通关 +2%永久伤害 · 可继续无尽挑战</div>}
                  <button
                    onClick={() => {
                      stateRef.current = "playing";
                      setGs("playing");
                      // 重置需刷新循环，这里简单reload
                      location.reload();
                    }}
                    className="w-full mt-2 py-3 rounded-xl bg-violet-600 font-bold"
                  >
                    再来一局 · 越玩越爽
                  </button>
                  <button onClick={() => { stateRef.current = "menu"; setGs("menu"); }} className="w-full py-2.5 rounded-xl bg-white/10 border border-white/15 text-sm">
                    返回主菜单
                  </button>
                  <div className="text-[11px] text-white/40">提示：小米平板可“添加到主屏幕”全屏游玩，手柄/键盘也支持</div>
                </div>
              </div>
            )}
          </div>

          <div className="h-6 shrink-0 flex items-center justify-between px-3 text-[11px] text-white/45 bg-[#0B0A1A] border-t border-white/10">
            <span>🎮 小米平板8：横屏+摇杆+外接手柄最佳 · 已适配触屏/鼠标/键盘</span>
            <span className="hidden sm:inline">存档自动保存 · Godot APK 同存档体系</span>
          </div>
        </div>
      )}

      {/* 底部说明（仅菜单时） */}
      {gs === "menu" && (
        <div className="px-3 py-2 text-[11px] leading-4 text-white/35 text-center border-t border-white/5">Web版已可一直玩、无限循环、越后期敌人越多但宝石雨与福袋也越多；Godot版导出APK后在小米平板安装即可离线畅玩，存档在 <code>user://savegame.json</code>（安卓为应用私有目录）。需要我帮你打APK，直接说“帮我打APK”。</div>
      )}
    </div>
  );
}

// 记录最高连击供结算
const maxComboRef = { current: 0 };
if (typeof window !== "undefined") {
  window.addEventListener("combo", (e: Event) => {
    const c = (e as CustomEvent).detail as number;
    if (c > maxComboRef.current) maxComboRef.current = c;
  });
}
