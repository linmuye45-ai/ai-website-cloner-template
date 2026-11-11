"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Check, Copy, Globe2, RotateCcw, Sparkles, Users, Zap } from "lucide-react";
import { DEFAULT_SPEC, normalizeSpec, specFromParams, specUrl } from "@/lib/party-spec.mjs";

type Spec = ReturnType<typeof normalizeSpec>;
type Player = { id:string; name:string; score:number; color:string };
type Room = { code:string; spec:Spec; phase:"lobby"|"playing"|"finished"; reason:null|"goal"|"timeout"|"disconnected"; target:number; endAt:number|null; players:Player[]; host:string };
type Solo = {score:number; target:number; endAt:number; ended:boolean; spec:Spec};
const STORAGE_KEY = "party-spec-v1";
const SYMBOLS = {star:"✦", gem:"◆", bolt:"ϟ"};

export function Party() {
  const [name,setName] = useState("");
  const [spec,setSpec] = useState<Spec>(DEFAULT_SPEC);
  const [notice,setNotice] = useState("");
  const [shareLink,setShareLink] = useState("");
  const [code,setCode] = useState("");
  const [room,setRoom] = useState<Room|null>(null);
  const [playerId,setPlayerId] = useState("");
  const [status,setStatus] = useState<"checking"|"online"|"offline">("checking");
  const [error,setError] = useState("");
  const [copied,setCopied] = useState(false);
  const [now,setNow] = useState(0);
  const [offset,setOffset] = useState(0);
  const [solo,setSolo] = useState<Solo|null>(null);
  const ws = useRef<WebSocket|null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const params = new URLSearchParams(window.location.search);
      const c = params.get("room");
      if (c && /^[A-F0-9]{10}$/i.test(c)) setCode(c.toUpperCase());
      const incoming = specFromParams(params);
      if (incoming) { setSpec(incoming); setNotice("已载入分享的玩法，可直接试玩或修改后再分享。"); }
      else {
        try { const saved = localStorage.getItem(STORAGE_KEY); if (saved) { setSpec(normalizeSpec(JSON.parse(saved))); setNotice("已恢复本机保存的玩法。"); } } catch { /* Storage may be unavailable. */ }
      }
    },0);
    return () => clearTimeout(timer);
  }, []);
  useEffect(() => {
    let mounted = true;
    fetch('/api/health', {cache:'no-store'}).then(r => r.ok ? r.json() : Promise.reject()).then(j => { if (mounted) setStatus(j.multiplayer === 'prototype' ? 'online' : 'offline'); }).catch(() => { if(mounted) setStatus('offline'); });
    return () => { mounted = false; ws.current?.close(); };
  }, []);
  useEffect(() => { const timer = setInterval(() => setNow(Date.now()), 250); return () => clearInterval(timer); }, []);
  useEffect(() => { if (solo && !solo.ended && now >= solo.endAt) { const timer = setTimeout(() => setSolo(s => s ? {...s, ended:true} : null), 0); return () => clearTimeout(timer); } }, [solo,now]);
  function update(patch:Partial<Spec>) { setSpec(s => ({...s,...patch})); setShareLink(''); setNotice(''); }
  function save() { try { localStorage.setItem(STORAGE_KEY,JSON.stringify(normalizeSpec(spec))); setNotice('玩法已保存在当前浏览器。'); } catch {setError('保存失败：浏览器存储不可用。');} }
  async function copyUrl(url:string) { setShareLink(url); setCopied(false); try { await navigator.clipboard.writeText(url); setCopied(true); setTimeout(()=>setCopied(false),2000); } catch { setNotice('请手动复制下方链接。'); } }
  function send(data:object) { if (ws.current?.readyState === WebSocket.OPEN) ws.current.send(JSON.stringify(data)); }
  function connect(action:"create"|"join") {
    if (!name.trim()) {setError("先输入你的昵称");return;}
    if (action === 'join' && !/^[A-F0-9]{10}$/i.test(code.trim())) {setError("请输入 10 位房间码");return;}
    setError(''); setShareLink(''); ws.current?.close();
    const socket = new WebSocket(`${location.protocol === 'https:' ? 'wss:' : 'ws:'}//${location.host}/api/party`); ws.current = socket;
    socket.onopen = () => socket.send(JSON.stringify(action === 'create' ? {type:'create',name,spec:normalizeSpec(spec)} : {type:'join',name,code:code.trim()}));
    socket.onmessage = e => { try {const msg = JSON.parse(e.data); if(msg.type === 'joined') setPlayerId(msg.playerId); if(msg.type === 'state') {setRoom(msg.room); setOffset(msg.serverNow-Date.now()); setSolo(null); setError('');} if(msg.type === 'error') setError(msg.message); if(msg.type === 'left') {setRoom(null);setPlayerId('');socket.close();}} catch {setError('服务器返回了无法识别的数据');} };
    socket.onclose = () => { if(ws.current === socket) {setRoom(null);setPlayerId('');ws.current = null;} };
    socket.onerror = () => setError('连接失败，请确认多人服务已启动。');
  }
  function beginSolo() { setError(''); const time=Date.now(); setNow(time); setSolo({score:0,target:Math.floor(Math.random()*9),endAt:time+spec.seconds*1000,ended:false,spec:normalizeSpec(spec)}); }
  function tapSolo(cell:number) {setSolo(s => {if (!s || s.ended || Date.now() >= s.endAt || cell !== s.target) return s; let target; do {target=Math.floor(Math.random()*9);} while (target===s.target); const score=s.score+1; return {...s,score,target,ended:score>=s.spec.targetScore};});}
  const activeSpec = room?.spec || solo?.spec || spec;
  const remaining = room?.endAt ? Math.max(0, Math.ceil((room.endAt - (now + offset)) / 1000)) : solo && !solo.ended ? Math.max(0, Math.ceil((solo.endAt-now)/1000)) : 0;
  const active = room?.phase === 'playing' || (solo && !solo.ended);
  const winning = room?.players.length ? Math.max(...room.players.map(p => p.score)) : 0;
  const teamScore = room?.players.reduce((sum,p)=>sum+p.score,0) || 0;
  function roomMessage() {
    if (!room) return solo ? solo.ended ? `试玩结束 · 你获得 ${solo.score} 分` : `单人试玩 · ${solo.score} / ${solo.spec.targetScore} 分` : '点亮单人试玩，或邀请朋友加入房间';
    if (room.phase === 'lobby') return '等待朋友加入，房主开始后点击亮起的目标';
    if (room.phase === 'playing') return room.spec.mode === 'team' ? `一起收集！团队 ${teamScore} / ${room.spec.targetScore} 分` : '快！点击亮起的目标抢分';
    if (room.reason === 'disconnected') return '有玩家离开，本局提前结束。';
    if (room.spec.mode === 'team') return room.reason === 'goal' ? `合作成功！团队获得 ${teamScore} 分` : `时间到，团队获得 ${teamScore} / ${room.spec.targetScore} 分`;
    const winners = room.players.filter(p=>p.score===winning);
    return `本局结束 · ${winners.map(p=>p.name).join('、')} ${winners.length>1?'并列领先':'领先'}（${winning} 分）`;
  }
  function shareRoom() { if(!room) return; const url = new URL(window.location.href); url.search = ''; url.searchParams.set('room',room.code); copyUrl(url.href); }
  return <main className="party"><header className="party-header"><a href="../" className="party-back"><ArrowLeft size={17}/> OMNIVERSE <span>/</span> PARTY LAB</a><div className="party-status"><span className={status === 'online' ? 'green-dot' : 'gray-dot'}/>{status === 'checking' ? '检测服务中' : status === 'online' ? '多人服务已连接' : '静态版 · 多人服务未连接'}</div></header><div className="party-shell"><div className="party-intro"><div><div className="party-kicker"><Sparkles size={14}/> PLAY TOGETHER, INSTANTLY</div><h1>把朋友叫上，<br/><em>开一场星光争夺。</em></h1><p>创造属于你们的短局挑战。可以争夺第一，也可以合作完成共同目标。</p></div><div className="party-badge"><Users size={19}/><span><b>2–4 人</b><small>实时对战原型</small></span></div></div>
  <div className="party-columns"><section className="party-panel setup"><div className="panel-number">01 / CREATE YOUR MATCH</div><h2>{room ? '你的房间' : '创建一场游戏'}</h2>{!room ? <><label>你的昵称<input value={name} maxLength={16} onChange={e=>setName(e.target.value)} placeholder="给自己起个名字"/></label><label>游戏标题<input value={spec.title} maxLength={16} onChange={e=>update({title:e.target.value})}/></label><div className="party-inputs"><label>游戏模式<select value={spec.mode} onChange={e=>update({mode:e.target.value as Spec['mode']})}><option value="race">个人竞速</option><option value="team">团队合作</option></select></label><label>目标外观<select value={spec.theme} onChange={e=>update({theme:e.target.value as Spec['theme']})}><option value="star">星星 ✦</option><option value="gem">宝石 ◆</option><option value="bolt">闪电 ϟ</option></select></label></div><div className="party-inputs"><label>目标分数<select value={spec.targetScore} onChange={e=>update({targetScore:+e.target.value})}>{Array.from({length:23},(_,i)=>i+3).map(v=><option key={v} value={v}>{v} 分</option>)}</select></label><label>每局时长<select value={spec.seconds} onChange={e=>update({seconds:+e.target.value})}>{Array.from({length:76},(_,i)=>i+15).map(v=><option key={v} value={v}>{v} 秒</option>)}</select></label></div><div className="spec-actions"><button onClick={save}>保存到本机</button><button onClick={()=>copyUrl(specUrl(location.href,spec))}><Copy size={14}/> 分享玩法链接</button></div>{notice && <p className="party-notice" role="status">{notice}</p>}<button className="party-primary" onClick={()=>connect('create')} disabled={status !== 'online'}><Users size={17}/> 创建多人房间 <ArrowRight size={17}/></button><div className="or"><span/>或者加入朋友<span/></div><div className="join"><input value={code} maxLength={10} onChange={e=>setCode(e.target.value.toUpperCase())} placeholder="输入 10 位房间码"/><button onClick={()=>connect('join')} disabled={status !== 'online'}>加入</button></div><button className="solo-button" onClick={beginSolo}><Zap size={15}/> 先单人体验规则</button><p className="party-hint">{status === 'online' ? '房间保存在服务器内存中；服务重启后失效。无需账号。' : '当前公开静态站没有常驻多人服务器。你仍可单人试玩、保存和分享玩法。'}</p></> : <><div className="room-code"><span>房间码</span><strong>{room.code}</strong><button onClick={shareRoom}>{copied ? <Check size={16}/> : <Copy size={16}/>} {copied ? '已复制' : '复制邀请链接'}</button></div><div className="room-info"><span>{room.spec.title}</span><span>{room.spec.mode === 'team' ? '合作' : '竞速'} · {room.spec.targetScore} 分 · {room.spec.seconds} 秒</span></div><div className="players">{room.players.map(p=><div key={p.id}><i style={{background:p.color}}/><span>{p.name} {p.id === playerId && '（你）'} {p.id === room.host && ' · 房主'}</span><b>{p.score}</b></div>)}</div>{room.host === playerId && <button className="party-primary" onClick={()=>send({type:'start'})} disabled={room.players.length < 2 || room.phase === 'playing'}><Zap size={17}/> {room.phase === 'playing' ? '游戏进行中' : room.players.length < 2 ? '等待至少一位朋友' : room.phase === 'finished' ? '再来一局' : '开始游戏'}</button>}<button className="solo-button" onClick={()=>{send({type:'leave'});setShareLink('');}}>退出房间</button><p className="party-hint">房间链接是临时邀请，不是永久游戏配置。房主离开时由下一位玩家接任。</p></>}{shareLink && <label className="share-field">{room ? '房间邀请链接' : '玩法分享链接'}{copied && ' · 已复制'}<input readOnly value={shareLink} onFocus={e=>e.currentTarget.select()}/></label>}{error && <p className="party-error" role="alert">{error}</p>}</section>
  <section className="party-panel board-panel"><div className="board-top"><div><div className="panel-number">02 / THE GAME</div><h2>{activeSpec.title}</h2></div><div className="timer"><span>TIME LEFT</span><strong>{active ? `${remaining}s` : '—'}</strong></div></div><div className="board-message" aria-live="polite">{roomMessage()}</div><div className="party-board">{Array.from({length:9},(_,i)=>{const lit=active && i === (room ? room.target : solo?.target); return <button key={i} className={lit ? `star-tile lit theme-${activeSpec.theme}` : 'star-tile'} onClick={()=>room ? send({type:'tap',cell:i}) : tapSolo(i)} disabled={!active} aria-label={`位置 ${i+1}${lit?'，目标':''}`}><span>{lit ? SYMBOLS[activeSpec.theme] : '·'}</span></button>;})}</div><div className="board-footer"><span><Globe2 size={15}/> 浏览器即玩 · 规则可分享</span>{solo && <button onClick={beginSolo}><RotateCcw size={14}/> 重试</button>}</div></section></div><div className="party-disclaimer"><b>原型说明</b><p>这是固定模板与规则配置，不是 AI 游戏生成器。玩法链接包含所选规则，不包含昵称；房间链接依赖多人服务器且会失效。没有账号、支付、审核和生产级防作弊。</p></div></div></main>;
}
