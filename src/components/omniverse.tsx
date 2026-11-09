"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowDownToLine, ArrowLeft, ArrowRight, ArrowUpRight, Check, CircleHelp, Gamepad2, Globe2, Layers3, Menu, MousePointer2, Pause, Play, Plus, RotateCcw, Sparkles, WandSparkles, X } from "lucide-react";

type Tab = "discover" | "studio" | "play" | "model";
type Draft = { name: string; idea: string; genre: string; created: string };
const STORE = "omniverse-drafts-v1";

const worlds = [
  { number: "01", tag: "SURVIVAL / ACTION", title: "After the fall", cn: "余烬之境", desc: "在文明的尽头，重新点燃希望。", theme: "ember" },
  { number: "02", tag: "STRATEGY / BUILD", title: "The last frontier", cn: "星际边界", desc: "建造你的基地，守住最后的星球。", theme: "violet" },
  { number: "03", tag: "ADVENTURE / RPG", title: "Echoes of aether", cn: "以太回响", desc: "每一个选择，都通向新的世界。", theme: "teal" },
];

function Arcade({ onBack }: { onBack: () => void }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const game = useRef({ x: 240, target: 240, time: 0, score: 0, lives: 3, running: false, enemies: [] as { x: number; y: number; r: number; speed: number }[], keys: new Set<string>(), last: 0 });
  const [playing, setPlaying] = useState(false);
  const [stats, setStats] = useState({ score: 0, lives: 3 });
  const [ended, setEnded] = useState(false);
  useEffect(() => {
    const c = canvas.current; if (!c) return;
    const ctx = c.getContext("2d"); if (!ctx) return;
    const g = game.current;
    let frame = 0; let lastUi = 0;
    const down = (e: KeyboardEvent) => { if (["ArrowLeft", "ArrowRight", "a", "d"].includes(e.key)) { e.preventDefault(); g.keys.add(e.key); } };
    const up = (e: KeyboardEvent) => g.keys.delete(e.key);
    window.addEventListener("keydown", down); window.addEventListener("keyup", up);
    const draw = (now: number) => {
      const dt = Math.min((now - (g.last || now)) / 1000, .05); g.last = now;
      if (g.running) {
        g.time += dt;
        if (g.keys.has("ArrowLeft") || g.keys.has("a")) g.target -= 280 * dt;
        if (g.keys.has("ArrowRight") || g.keys.has("d")) g.target += 280 * dt;
        g.target = Math.max(20, Math.min(460, g.target)); g.x += (g.target - g.x) * Math.min(1, dt * 10);
        if (Math.random() < dt * (1.7 + Math.min(g.time / 20, 3))) g.enemies.push({ x: 20 + Math.random() * 440, y: -20, r: 9 + Math.random() * 10, speed: 95 + Math.random() * 75 + g.time });
        g.enemies.forEach(e => { e.y += e.speed * dt; });
        g.enemies = g.enemies.filter(e => {
          if (Math.hypot(e.x - g.x, e.y - 525) < e.r + 15) { g.lives--; return false; }
          if (e.y > 620) { g.score += 10; return false; } return true;
        });
        if (g.lives <= 0) { g.running = false; setPlaying(false); setEnded(true); }
        if (now - lastUi > 150 || g.lives <= 0) { setStats({ score: g.score, lives: g.lives }); lastUi = now; }
      }
      const bg = ctx.createLinearGradient(0, 0, 0, 600); bg.addColorStop(0, "#17182d"); bg.addColorStop(1, "#080a11"); ctx.fillStyle = bg; ctx.fillRect(0, 0, 480, 600);
      ctx.strokeStyle = "#ffffff0a"; ctx.lineWidth = 1;
      for (let i = 0; i < 480; i += 40) { ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, 600); ctx.stroke(); }
      for (let i = 0; i < 600; i += 40) { ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(480, i); ctx.stroke(); }
      g.enemies.forEach(e => { ctx.shadowBlur = 20; ctx.shadowColor = "#ff6f51"; ctx.fillStyle = "#ff795d"; ctx.beginPath(); ctx.arc(e.x, e.y, e.r, 0, Math.PI * 2); ctx.fill(); ctx.shadowBlur = 0; });
      ctx.shadowBlur = 26; ctx.shadowColor = "#a9c7ff"; ctx.fillStyle = "#d7e5ff"; ctx.beginPath(); ctx.moveTo(g.x, 505); ctx.lineTo(g.x - 15, 540); ctx.lineTo(g.x, 533); ctx.lineTo(g.x + 15, 540); ctx.closePath(); ctx.fill(); ctx.shadowBlur = 0;
      frame = requestAnimationFrame(draw);
    };
    frame = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(frame); window.removeEventListener("keydown", down); window.removeEventListener("keyup", up); };
  }, []);
  function toggle() { if (ended) { Object.assign(game.current, { time: 0, score: 0, lives: 3, enemies: [], x: 240, target: 240 }); setStats({ score: 0, lives: 3 }); setEnded(false); } game.current.running = !game.current.running; setPlaying(game.current.running); }
  return <div className="subpage arcade-page"><button className="back" onClick={onBack}><ArrowLeft size={15}/> 返回探索</button><div className="arcade-layout"><div className="arcade-copy"><div className="eyebrow"><span className="dot"/> PLAYABLE PROTOTYPE · 01</div><h1>躲过流星。<br/><i>活到最后。</i></h1><p>一段可直接在浏览器里玩的微型世界。移动飞船，避开流星，看看你能坚持多久。</p><div className="howto"><span><MousePointer2 size={17}/> 鼠标 / 触屏移动</span><span>← → 键盘控制</span></div><button className="primary" onClick={toggle}>{playing ? <Pause size={16}/> : ended ? <RotateCcw size={16}/> : <Play size={16} fill="currentColor"/>}{playing ? "暂停游戏" : ended ? "再玩一次" : "开始试玩"}</button><p className="small-note">本游戏为原创浏览器原型，不涉及真实支付或广告投放。</p></div><div className="game-frame"><div className="game-top"><span><span className="dot"/> LIVE PLAY</span><span>分数 {stats.score} &nbsp; · &nbsp; 生命 {stats.lives}</span></div><canvas ref={canvas} width={480} height={600} onPointerMove={e => { if (e.pointerType === "mouse" || e.buttons) { const r = e.currentTarget.getBoundingClientRect(); game.current.target = (e.clientX-r.left)/r.width*480; } }} onPointerDown={e => { e.currentTarget.setPointerCapture(e.pointerId); const r = e.currentTarget.getBoundingClientRect(); game.current.target = (e.clientX-r.left)/r.width*480; }} aria-label="流星躲避游戏"/><div className="game-bottom">{ended ? "游戏结束 · 点击再玩一次" : playing ? "DODGE THE FALLING STARS" : "READY WHEN YOU ARE"}</div></div></div></div>;
}

function Studio({ onBack }: { onBack: () => void }) {
  const [name, setName] = useState(""); const [idea, setIdea] = useState(""); const [genre, setGenre] = useState("动作冒险"); const [drafts, setDrafts] = useState<Draft[]>([]); const [saved, setSaved] = useState(false);
  useEffect(() => { const timer = window.setTimeout(() => { try { const value = JSON.parse(localStorage.getItem(STORE) || "[]"); if (Array.isArray(value)) setDrafts(value); } catch { /* unavailable storage */ } }, 0); return () => window.clearTimeout(timer); }, []);
  function create() { if (!name.trim() || !idea.trim()) return; const next = [{ name: name.trim(), idea: idea.trim(), genre, created: new Date().toLocaleDateString("zh-CN") }, ...drafts]; setDrafts(next); try { localStorage.setItem(STORE, JSON.stringify(next)); } catch { /* UI remains usable */ } setName(""); setIdea(""); setSaved(true); }
  function remove(index: number) { const next = drafts.filter((_, i) => i !== index); setDrafts(next); try { localStorage.setItem(STORE, JSON.stringify(next)); } catch {} }
  function exportDraft(d: Draft) { const blob = new Blob([JSON.stringify(d, null, 2)], {type:"application/json"}); const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = "omniverse-project.json"; a.click(); URL.revokeObjectURL(url); }
  return <div className="subpage"><button className="back" onClick={onBack}><ArrowLeft size={15}/> 返回探索</button><div className="sub-heading"><div><div className="eyebrow"><span className="dot"/> CREATOR WORKSPACE</div><h1>从一个想法，<br/><i>开始一个世界。</i></h1></div><p>把创意整理成项目草稿。你的草稿保存在当前浏览器中，也可以导出为 JSON 文件。</p></div><div className="studio-grid"><div className="panel form-panel"><div className="panel-head"><div><span className="panel-label">NEW PROJECT</span><h3>创建项目</h3></div><WandSparkles size={20}/></div><label>项目名称<input value={name} onChange={e => {setName(e.target.value); setSaved(false);}} placeholder="例如：星际拾荒者" maxLength={80}/></label><label>游戏类型<select value={genre} onChange={e => setGenre(e.target.value)}><option>动作冒险</option><option>策略塔防</option><option>互动叙事</option><option>休闲益智</option></select></label><label>你的创意<textarea value={idea} onChange={e => {setIdea(e.target.value); setSaved(false);}} placeholder="描述世界、玩家目标和核心玩法……" maxLength={2000} rows={5}/></label><button className="primary" onClick={create} disabled={!name.trim() || !idea.trim()}><Plus size={16}/> 创建草稿</button>{saved && <span className="saved"><Check size={14}/> 草稿已创建</span>}<p className="small-note">当前是本地创意工作台；尚未接入 AI 生成、账号或云端协作。</p></div><div className="panel drafts"><div className="panel-head"><div><span className="panel-label">YOUR WORLDS</span><h3>项目草稿 <small>{drafts.length}</small></h3></div><Layers3 size={20}/></div>{drafts.length === 0 ? <div className="empty"><div className="empty-icon"><Sparkles size={23}/></div><h4>你的第一个世界在这里开始</h4><p>填写左侧的创意，创建一个属于你的项目。</p></div> : <div className="draft-list">{drafts.map((d, i) => <article className="draft" key={`${d.created}-${i}`}><div className="draft-icon"><Layers3 size={19}/></div><div className="draft-info"><h4>{d.name}</h4><span>{d.genre} · {d.created}</span><p>{d.idea}</p></div><div className="draft-actions"><button onClick={() => exportDraft(d)} aria-label={`导出 ${d.name}`} title="导出"><ArrowDownToLine size={17}/></button><button onClick={() => remove(i)} aria-label={`删除 ${d.name}`} title="删除"><X size={17}/></button></div></article>)}</div>}</div></div></div>;
}

function Model({ onBack }: { onBack: () => void }) {
  const [revenue, setRevenue] = useState(20); const [cost, setCost] = useState(14); const [multiple, setMultiple] = useState(15);
  const profit = revenue - cost; const valuation = revenue * multiple;
  return <div className="subpage"><button className="back" onClick={onBack}><ArrowLeft size={15}/> 返回探索</button><div className="sub-heading"><div><div className="eyebrow"><span className="dot"/> STRATEGY LAB</div><h1>大目标，<br/><i>从真实假设开始。</i></h1></div><p>探索 $100B 估值需要什么规模。这里所有数字都是可调整的假设，不是预测、业绩或承诺。</p></div><div className="model-grid"><div className="panel form-panel"><div className="panel-label">SCENARIO INPUTS · 假设输入</div><h3>调整你的商业模型</h3><label>年净收入 <b>${revenue}B</b><input type="range" min="1" max="30" value={revenue} onChange={e => setRevenue(+e.target.value)}/></label><label>年度总成本及税费 <b>${cost}B</b><input type="range" min="0" max="30" value={cost} onChange={e => setCost(+e.target.value)}/></label><label>估值 / 年收入倍数 <b>{multiple}×</b><input type="range" min="1" max="30" value={multiple} onChange={e => setMultiple(+e.target.value)}/></label><p className="small-note">B = 十亿美元。估值倍数受市场、增长、风险等影响；实际流动净资产还需计算现金、债务及股权归属。</p></div><div className="panel model-result"><div className="panel-label">ILLUSTRATIVE OUTPUT · 示意结果</div><p>假设年收入 × 估值倍数</p><div className="big-value">${valuation}<span>B</span></div><div className="target-line"><span style={{width:`${Math.min(100, valuation / 100 * 100)}%`}}/></div><div className="target-caption"><span>$0</span><span>$100B 目标</span></div><div className="result-row"><span>假设税后利润（收入 − 成本及税费）</span><b className={profit < 0 ? "negative" : ""}>${profit}B</b></div><div className="result-row"><span>距 $100B 估值</span><b>{valuation >= 100 ? "达到模型门槛" : `还差 $${100-valuation}B`}</b></div><div className="caution"><CircleHelp size={17}/> 这是数学情景演示，不代表业务已经产生收入，也不能保证一年净资产或三年估值。</div></div></div></div>;
}

export function Omniverse() {
  const [tab, setTab] = useState<Tab>("discover"); const [menu, setMenu] = useState(false);
  function navigate(t: Tab) { setTab(t); setMenu(false); window.scrollTo({top:0, behavior:"smooth"}); }
  return <main className="omni"><header className="topbar"><button className="brand" onClick={() => navigate("discover")} aria-label="OMNIVERSE 首页"><span className="brand-mark"><span>✳</span></span><span>OMNIVERSE<small>WORLD BUILDING SYSTEM</small></span></button><nav className={menu ? "nav open" : "nav"}><button className={tab === "discover" ? "active" : ""} onClick={() => navigate("discover")}>探索 <span>DISCOVER</span></button><button className={tab === "studio" ? "active" : ""} onClick={() => navigate("studio")}>创作工作台 <span>STUDIO</span></button><button className={tab === "play" ? "active" : ""} onClick={() => navigate("play")}>试玩 <span>PLAY</span></button><button className={tab === "model" ? "active" : ""} onClick={() => navigate("model")}>战略沙盘 <span>STRATEGY</span></button></nav><div className="header-actions"><span className="prototype-label"><span className="dot"/> PROTOTYPE V1.0</span><button className="header-cta" onClick={() => navigate("studio")}>开始创作 <ArrowUpRight size={15}/></button><button className="menu-button" onClick={() => setMenu(!menu)} aria-label="切换菜单">{menu ? <X/> : <Menu/>}</button></div></header>
  {tab === "studio" ? <Studio onBack={() => navigate("discover")}/> : tab === "play" ? <Arcade onBack={() => navigate("discover")}/> : tab === "model" ? <Model onBack={() => navigate("discover")}/> : <>
    <section className="hero"><div className="hero-art"/><div className="hero-shade"/><div className="hero-content"><div className="eyebrow hero-eyebrow"><span className="dot"/> THE NEXT FRONTIER OF PLAY <span className="eyebrow-line"/> 交互世界，由此开始</div><h1>Worlds are<br/><em>waiting to be</em><br/>made<span className="orange">.</span></h1><p>想象一个世界。然后，走进去。<br/><span>为下一代可玩内容而生的创作与探索空间。</span></p><div className="hero-actions"><button className="primary" onClick={() => navigate("studio")}>开始创造 <ArrowUpRight size={17}/></button><button className="secondary" onClick={() => navigate("play")}><Play size={15} fill="currentColor"/> 试玩一个世界</button></div><div className="hero-bottom"><span>01 / 03</span><div className="progress"><span/></div><span>THE WORLD IS YOURS TO MAKE</span></div></div><div className="hero-aside"><span>FEATURED WORLD &nbsp; / &nbsp; 001</span><h3>After the fall</h3><p>余烬之境 · 概念视觉</p><button onClick={() => navigate("play")} aria-label="进入试玩"><ArrowUpRight size={20}/></button></div><div className="hero-side-text">IMAGINE MORE &nbsp; · &nbsp; PLAY BEYOND</div></section>
    <section className="ticker"><div><span className="ticker-icon"><Sparkles size={17}/></span><span><strong>从灵感到交互。</strong> 一个正在构建中的全新世界。</span></div><button onClick={() => navigate("studio")}>探索创作工作台 <ArrowRight size={15}/></button></section>
    <section className="content-section worlds-section"><div className="section-heading"><div><div className="eyebrow"><span className="tiny-square"/> CURATED WORLDS &nbsp; / &nbsp; 01</div><h2>不止是观看。<i>进入其中。</i></h2><p>探索可玩内容的可能性，创造属于你的下一段体验。</p></div><button className="text-link" onClick={() => navigate("play")}>体验可玩原型 <ArrowUpRight size={16}/></button></div><div className="world-grid">{worlds.map((w, i) => <button className="world-card" key={w.number} onClick={() => navigate(i === 0 ? "play" : "studio")}><div className={`world-image ${w.theme}`}><div className="world-image-shade"/><span className="world-tag">{w.tag}</span><div className="world-orb"/><div className="card-index">{w.number} <ArrowUpRight size={19}/></div></div><div className="world-info"><div><span>{w.cn}</span><h3>{w.title}</h3><p>{w.desc}</p></div><span className="circle-arrow"><ArrowUpRight size={17}/></span></div></button>)}</div><div className="world-note">概念展示 · 第一个入口可试玩浏览器原型，其余入口进入创意工作台。</div></section>
    <section className="manifesto"><div className="manifesto-inner"><div className="manifesto-left"><div className="eyebrow"><span className="tiny-square"/> BUILT FOR WHAT&#39;S NEXT &nbsp; / &nbsp; 02</div><h2>想象力，<br/><i>不该有边界。</i></h2><p>我们相信下一代内容不仅被观看，更可以被体验、被创造、被分享。</p><button className="text-link" onClick={() => navigate("studio")}>进入工作台 <ArrowUpRight size={16}/></button></div><div className="capabilities"><div><span className="cap-icon"><WandSparkles size={20}/></span><div><small>01 / CREATE</small><h3>把灵感变成项目</h3><p>记录想法、选择类型，为下一款体验打好基础。</p></div><ArrowUpRight size={17}/></div><div><span className="cap-icon"><Gamepad2 size={20}/></span><div><small>02 / PLAY</small><h3>即刻进入世界</h3><p>无需下载，在浏览器中直接体验可玩的原型。</p></div><ArrowUpRight size={17}/></div><div><span className="cap-icon"><Globe2 size={20}/></span><div><small>03 / GROW</small><h3>面向全球，验证规模</h3><p>用透明的假设推演业务规模，而不是把目标当成事实。</p></div><ArrowUpRight size={17}/></div></div></div></section>
    <section className="cta-section"><div className="cta-glow"/><div className="eyebrow"><span className="dot"/> YOUR NEXT WORLD STARTS HERE</div><h2>精彩的世界，<br/><i>从你开始。</i></h2><p>先动手创造，再让想象走得更远。</p><button className="primary" onClick={() => navigate("studio")}>创建你的第一个项目 <ArrowUpRight size={17}/></button></section>
    <footer><div className="footer-brand"><div className="brand-mark"><span>✳</span></div><div><strong>OMNIVERSE</strong><p>MAKE WORLDS WORTH PLAYING.</p></div></div><div className="footer-links"><button onClick={() => navigate("studio")}>创作工作台</button><button onClick={() => navigate("play")}>试玩原型</button><button onClick={() => navigate("model")}>战略沙盘</button><a href="./slabai/index.html">历史版本 ↗</a></div><div className="footer-end"><span>© 2026 OMNIVERSE. CONCEPT PROTOTYPE.</span><span>MADE FOR THE IMAGINATIVE &nbsp; ✳</span></div></footer>
  </>}</main>;
}
