"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, RotateCcw, Pause, Play, Volume2, VolumeX, Zap } from "lucide-react";
import { createGame, startGame, stepGame, tryDash, tryRewind, EXIT } from "@/lib/echo-game.mjs";

type Game = ReturnType<typeof createGame>;
type Hud = {hp:number; shards:number; kills:number; charges:number; time:number; dash:number; phase:string};
const initialHud:Hud = {hp:5,shards:0,kills:0,charges:1,time:0,dash:0,phase:'ready'};
const timeLabel = (n:number) => `${String(Math.floor(n/60)).padStart(2,'0')}:${String(Math.floor(n%60)).padStart(2,'0')}`;

export function EchoGame() {
  const host = useRef<HTMLDivElement>(null);
  const game = useRef<Game>(createGame());
  const keys = useRef(new Set<string>());
  const touch = useRef(new Set<string>());
  const pausedRef = useRef(false);
  const mutedRef = useRef(true);
  const audio = useRef<AudioContext|null>(null);
  const [hud,setHud] = useState<Hud>(initialHud);
  const [paused,setPaused] = useState(false);
  const [muted,setMuted] = useState(true);
  const [supported,setSupported] = useState(true);
  const [best,setBest] = useState<number|null>(null);
  const [message,setMessage] = useState('');
  const lastHud = useRef(0);
  const toastTimeout = useRef<ReturnType<typeof setTimeout>|null>(null);

  const signal = useCallback((text:string) => {setMessage(text);if(toastTimeout.current)clearTimeout(toastTimeout.current);toastTimeout.current=setTimeout(()=>setMessage(''),2000);},[]);
  const sound = useCallback((frequency:number) => {
    if(mutedRef.current)return;
    try {const ctx=audio.current || new AudioContext();audio.current=ctx;if(ctx.state==='suspended')void ctx.resume();const osc=ctx.createOscillator(), gain=ctx.createGain();osc.type='sine';osc.frequency.value=frequency;gain.gain.setValueAtTime(.035,ctx.currentTime);gain.gain.exponentialRampToValueAtTime(.001,ctx.currentTime+.18);osc.connect(gain);gain.connect(ctx.destination);osc.start();osc.stop(ctx.currentTime+.18);} catch { /* Audio may be unavailable. */ }
  },[]);
  const refreshHud = useCallback(() => {const g=game.current;setHud({hp:g.hp,shards:g.shards.filter(s=>s.taken).length,kills:g.kills,charges:g.charges,time:g.time,dash:g.dashCooldown,phase:g.phase});},[]);
  const begin = useCallback(() => {game.current=createGame();startGame(game.current);keys.current.clear();touch.current.clear();pausedRef.current=false;setPaused(false);setMessage('');refreshHud();sound(440);},[refreshHud,sound]);
  const rewind = useCallback(() => {if(pausedRef.current)return;if(tryRewind(game.current)){signal('时间回溯 · 留下一个会战斗的回响');sound(660);refreshHud();}else signal(game.current.charges<1?'回响能量不足：收集记忆碎片':'先移动一会儿，再使用回响');},[refreshHud,signal,sound]);
  const direction = useCallback(() => {const all=new Set([...keys.current,...touch.current]);return {x:(all.has('d')||all.has('arrowright')?1:0)-(all.has('a')||all.has('arrowleft')?1:0),z:(all.has('s')||all.has('arrowdown')?1:0)-(all.has('w')||all.has('arrowup')?1:0)};},[]);
  const dash = useCallback(() => {if(pausedRef.current)return;const d=direction();if(tryDash(game.current,d.x,d.z)){sound(520);refreshHud();}else if(game.current.dashCooldown<=0)signal('移动时才能冲刺');},[direction,refreshHud,signal,sound]);
  const togglePause = useCallback(() => {if(game.current.phase!=='playing')return;pausedRef.current=!pausedRef.current;setPaused(pausedRef.current);},[]);
  const toggleMute = useCallback(() => {mutedRef.current=!mutedRef.current;setMuted(mutedRef.current);if(!mutedRef.current)sound(440);},[sound]);
  useEffect(()=>{try{const n=Number(localStorage.getItem('echo-best-v1'));if(n>0){const id=setTimeout(()=>setBest(n),0);return()=>clearTimeout(id);}}catch{}},[]);
  useEffect(()=>{
    const down=(e:KeyboardEvent)=>{const k=e.key.toLowerCase();if(game.current.phase==='playing' && ['arrowup','arrowdown','arrowleft','arrowright',' ','w','a','s','d'].includes(k))e.preventDefault();if(e.repeat)return;keys.current.add(k);if(k==='e')rewind();if(k==='shift'||k===' ')dash();if(k==='escape')togglePause();};
    const up=(e:KeyboardEvent)=>keys.current.delete(e.key.toLowerCase());
    const blur=()=>{keys.current.clear();touch.current.clear();if(game.current.phase==='playing'&&!pausedRef.current){pausedRef.current=true;setPaused(true);}};
    window.addEventListener('keydown',down);window.addEventListener('keyup',up);window.addEventListener('blur',blur);
    return()=>{window.removeEventListener('keydown',down);window.removeEventListener('keyup',up);window.removeEventListener('blur',blur);if(toastTimeout.current)clearTimeout(toastTimeout.current);};
  },[dash,rewind,togglePause]);

  useEffect(()=>{
    const el=host.current;if(!el)return;
    let renderer:THREE.WebGLRenderer;
    try {renderer=new THREE.WebGLRenderer({antialias:true,alpha:false,powerPreference:'high-performance'});} catch {const id=setTimeout(()=>setSupported(false),0);return()=>clearTimeout(id);}
    renderer.setPixelRatio(Math.min(window.devicePixelRatio,1.6));renderer.setSize(el.clientWidth,el.clientHeight);renderer.setClearColor(0x0b1e25);renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.2;el.appendChild(renderer.domElement);
    const scene=new THREE.Scene();scene.fog=new THREE.FogExp2(0x0c2227,.025);
    const camera=new THREE.PerspectiveCamera(43,el.clientWidth/el.clientHeight,.1,180);camera.position.set(0,27,23);camera.lookAt(0,0,0);
    scene.add(new THREE.HemisphereLight(0xb8e9e4,0x122822,2.1));const sun=new THREE.DirectionalLight(0xf3dbb3,2.1);sun.position.set(-12,28,12);scene.add(sun);
    const stone=new THREE.MeshStandardMaterial({color:0x2b514b,roughness:.9});const darkStone=new THREE.MeshStandardMaterial({color:0x18363a,roughness:1});const green=new THREE.MeshStandardMaterial({color:0x224b40,roughness:1});const gold=new THREE.MeshStandardMaterial({color:0xc6935d,metalness:.55,roughness:.38});const glow=new THREE.MeshStandardMaterial({color:0x74eee4,emissive:0x43e8dc,emissiveIntensity:2,roughness:.25});const pale=new THREE.MeshStandardMaterial({color:0xdcebe0,roughness:.7});const red=new THREE.MeshStandardMaterial({color:0xee8d68,emissive:0xb6442b,emissiveIntensity:.9});
    const ground=new THREE.Mesh(new THREE.CylinderGeometry(18,18.6,.8,64),stone);ground.position.y=-.55;scene.add(ground);
    const groundRing=new THREE.Mesh(new THREE.RingGeometry(16.9,17.05,96),gold);groundRing.rotation.x=-Math.PI/2;groundRing.position.y=-.12;scene.add(groundRing);
    // Deterministic environmental layout around the arena. Obstacles are decorative only.
    let seed=42;const rand=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
    const treeTrunk=new THREE.CylinderGeometry(.12,.2,1.5,6), treeLeaf=new THREE.ConeGeometry(.85,2.8,7), rockGeo=new THREE.DodecahedronGeometry(1,0);
    for(let i=0;i<100;i++){const a=rand()*Math.PI*2,r=18.5+rand()*14,x=Math.cos(a)*r,z=Math.sin(a)*r;if(i%3){const group=new THREE.Group();const trunk=new THREE.Mesh(treeTrunk,darkStone);trunk.position.y=.7;const leaves=new THREE.Mesh(treeLeaf,green);leaves.position.y=2;group.add(trunk,leaves);const scale=.65+rand()*1.5;group.scale.setScalar(scale);group.position.set(x,-.2,z);scene.add(group);}else{const rock=new THREE.Mesh(rockGeo,darkStone);rock.scale.set(1+rand()*1.6,1+rand()*3,1+rand()*1.6);rock.position.set(x,.3,z);scene.add(rock);}}
    // Floor markings give motion and distance cues.
    for(let i=0;i<11;i++){const tile=new THREE.Mesh(new THREE.BoxGeometry(.18,.04,31),darkStone);tile.position.set((i-5)*3,-.1,0);scene.add(tile);const other=new THREE.Mesh(new THREE.BoxGeometry(31,.04,.18),darkStone);other.position.set(0,-.1,(i-5)*3);scene.add(other);}
    const platform=new THREE.Mesh(new THREE.CylinderGeometry(2.4,2.7,.32,32),darkStone);platform.position.set(EXIT.x,0,EXIT.z);scene.add(platform);
    const portal=new THREE.Group();portal.position.set(EXIT.x,2.4,EXIT.z);const ring=new THREE.Mesh(new THREE.TorusGeometry(2,.18,12,64),gold);portal.add(ring);const ring2=new THREE.Mesh(new THREE.TorusGeometry(1.7,.035,8,64),glow);portal.add(ring2);const core=new THREE.Mesh(new THREE.CircleGeometry(1.65,48),new THREE.MeshBasicMaterial({color:0x51c7b8,transparent:true,opacity:.12,side:THREE.DoubleSide}));portal.add(core);scene.add(portal);
    const makeTraveler=(material:THREE.Material)=>{const group=new THREE.Group();const cloak=new THREE.Mesh(new THREE.ConeGeometry(.55,1.5,7),material);cloak.position.y=.95;const head=new THREE.Mesh(new THREE.SphereGeometry(.32,12,10),material);head.position.y=1.84;const eye=new THREE.Mesh(new THREE.BoxGeometry(.42,.09,.1),glow);eye.position.set(0,1.88,.29);group.add(cloak,head,eye);return group;};
    const traveler=makeTraveler(pale);scene.add(traveler);const shadow=new THREE.Mesh(new THREE.CircleGeometry(.7,24),new THREE.MeshBasicMaterial({color:0x071615,transparent:true,opacity:.35}));shadow.rotation.x=-Math.PI/2;shadow.position.y=-.08;scene.add(shadow);
    const shardMeshes=game.current.shards.map(s=>{const group=new THREE.Group();const crystal=new THREE.Mesh(new THREE.OctahedronGeometry(.5,0),glow);const halo=new THREE.Mesh(new THREE.TorusGeometry(.8,.035,6,32),gold);halo.rotation.x=Math.PI/2;group.add(crystal,halo);group.position.set(s.x,1,s.z);scene.add(group);return group;});
    const enemyGeo=new THREE.OctahedronGeometry(.55,0);const bulletGeo=new THREE.SphereGeometry(.13,8,6);const enemyMeshes=new Map<number,THREE.Mesh>();const bulletMeshes=new Map<number,THREE.Mesh>();const echoMeshes=new Map<number,THREE.Group>();const echoMaterial=new THREE.MeshStandardMaterial({color:0x8ffff2,emissive:0x39cbbf,emissiveIntensity:.8,transparent:true,opacity:.55});
    const dustGeometry=new THREE.BufferGeometry();const dust=new Float32Array(180*3);for(let i=0;i<dust.length;i+=3){dust[i]=(rand()-.5)*42;dust[i+1]=rand()*9+.3;dust[i+2]=(rand()-.5)*42;}dustGeometry.setAttribute('position',new THREE.BufferAttribute(dust,3));const particles=new THREE.Points(dustGeometry,new THREE.PointsMaterial({color:0x9be2c8,size:.065,transparent:true,opacity:.55}));scene.add(particles);
    const resize=()=>{if(!el.clientWidth||!el.clientHeight)return;camera.aspect=el.clientWidth/el.clientHeight;camera.updateProjectionMatrix();renderer.setSize(el.clientWidth,el.clientHeight);};const observer=new ResizeObserver(resize);observer.observe(el);
    let raf=0,last=performance.now(),previousPhase='ready',previousShards=0,previousHp=5;
    const loop=(t:number)=>{const dt=Math.min((t-last)/1000,.05);last=t;const g=game.current;
      if(!pausedRef.current){stepGame(g,dt,direction());}
      const shardCount=g.shards.filter(s=>s.taken).length;if(shardCount>previousShards){sound(650);if(shardCount===8)signal('出口已开启 · 回到中央光环');else if(shardCount===3||shardCount===6)signal('回响能量 +1');}if(g.hp<previousHp)sound(155);previousShards=shardCount;previousHp=g.hp;
      if(g.phase!==previousPhase){if(g.phase==='won'){sound(880);try{const old=Number(localStorage.getItem('echo-best-v1'));if(!old||g.time<old){localStorage.setItem('echo-best-v1',String(g.time));setBest(g.time);}}catch{}}previousPhase=g.phase;refreshHud();}
      traveler.position.set(g.x,.05,g.z);traveler.rotation.y=Math.sin(t*.001)*.08;traveler.visible=g.invuln<=0||Math.floor(t/100)%2===0;shadow.position.set(g.x,-.08,g.z);portal.rotation.z+=dt*.09;ring2.rotation.z-=dt*.45;core.material.opacity=shardCount===8?.5:.1+Math.sin(t*.003)*.025;
      shardMeshes.forEach((mesh,i)=>{mesh.visible=!g.shards[i]?.taken;mesh.position.y=1.15+Math.sin(t*.002+i)*.25;mesh.rotation.y=t*.001;});
      const sync=<T extends THREE.Object3D>(map:Map<number,T>,items:{id:number;x:number;z:number}[],make:()=>T,y:number)=>{const live=new Set(items.map(item=>item.id));for(const [id,mesh] of map){if(!live.has(id)){scene.remove(mesh);map.delete(id);}}for(const item of items){let mesh=map.get(item.id);if(!mesh){mesh=make();map.set(item.id,mesh);scene.add(mesh);}mesh.position.set(item.x,y,item.z);}};
      sync(enemyMeshes,g.enemies,()=>new THREE.Mesh(enemyGeo,red),.65);for(const mesh of enemyMeshes.values()){mesh.rotation.y=t*.002;mesh.position.y=.7+Math.sin(t*.004+mesh.position.x)*.15;}
      sync(bulletMeshes,g.bullets,()=>new THREE.Mesh(bulletGeo,glow),.9);sync(echoMeshes,g.echoes,()=>makeTraveler(echoMaterial),.05);
      camera.position.set(g.x*.2,27,g.z*.2+23);camera.lookAt(g.x*.2,0,g.z*.2);renderer.render(scene,camera);
      if(t-lastHud.current>160){refreshHud();lastHud.current=t;}raf=requestAnimationFrame(loop);
    };raf=requestAnimationFrame(loop);
    return()=>{cancelAnimationFrame(raf);observer.disconnect();renderer.dispose();scene.traverse(obj=>{if(obj instanceof THREE.Mesh){obj.geometry.dispose();const m=obj.material; if(Array.isArray(m))m.forEach(x=>x.dispose());else m.dispose();}});dustGeometry.dispose();if(el.contains(renderer.domElement))el.removeChild(renderer.domElement);};
  },[direction,refreshHud,signal,sound]);

  const pointer=(key:string,on:boolean)=>(e:React.PointerEvent<HTMLButtonElement>)=>{e.preventDefault();if(on){touch.current.add(key);e.currentTarget.setPointerCapture(e.pointerId);}else touch.current.delete(key);};
  return <div className="game-wrap" id="game"><div className="game-head"><div><span className="tiny-label"><span/> NOW PLAYING / THE LAST ECHO</span><h2>回响之境 <i>·</i> 序章</h2></div><div className="game-tools"><button onClick={toggleMute} aria-label={muted?'开启音效':'关闭音效'}>{muted?<VolumeX size={18}/>:<Volume2 size={18}/>}</button><button onClick={togglePause} aria-label={paused?'继续':'暂停'} disabled={hud.phase!=='playing'}>{paused?<Play size={17}/>:<Pause size={17}/>}</button></div></div>
    <div className="game-screen"><div ref={host} className="game-canvas" aria-label="回响之境 3D 游戏画面"/><div className="game-vignette"/>
      <div className="game-hud"><div className="health"><span>生命</span><b>{'◆'.repeat(Math.max(0,hud.hp))}<em>{'◇'.repeat(5-Math.max(0,hud.hp))}</em></b></div><div className="shard-hud"><span>记忆碎片</span><b>{String(hud.shards).padStart(2,'0')} <em>/ 08</em></b></div><div className="clock"><span>旅程</span><b>{timeLabel(hud.time)}</b></div></div>
      {hud.phase==='playing'&&!paused&&<div className="mission-pill"><span/> {hud.shards===8?'返回中央光环，开启出口':'收集 8 枚碎片，避开追猎者'}</div>}
      {message&&<div className="game-toast" role="status">{message}</div>}
      {(!supported||hud.phase==='ready'||hud.phase==='won'||hud.phase==='lost'||paused)&&<div className="game-overlay"><div className="overlay-card"><div className="overlay-icon">✧</div><div className="tiny-label">{!supported?'WEBGL UNAVAILABLE':paused?'PAUSED':hud.phase==='won'?'JOURNEY COMPLETE':hud.phase==='lost'?'THE LIGHT FADES':'A WORLD BETWEEN MOMENTS'}</div><h3>{!supported?'无法启动 3D 画面':paused?'旅途暂停':hud.phase==='won'?'你找回了光。':hud.phase==='lost'?'光芒暂时熄灭':'每一次回头，\n都会留下一个你。'}</h3><p>{!supported?'请尝试启用 WebGL 的现代浏览器。':paused?'准备好之后，继续这段旅程。':hud.phase==='won'?`用时 ${timeLabel(hud.time)} · 击败 ${hud.kills} 个追猎者` :hud.phase==='lost'?`已收集 ${hud.shards} / 8 枚碎片 · 再试一次。`:'收集散落的记忆碎片，躲避追猎者。回溯时间，让过去的自己和你并肩作战。'}</p>{supported&&<button className="game-start" onClick={paused?togglePause:begin}>{paused?'继续旅程':hud.phase==='ready'?'开始旅程':'再来一次'} <ArrowRight size={16}/></button>}<small>桌面：WASD / 方向键移动 · 空格冲刺 · E 回溯<br/>手机：使用下方触控按钮</small>{best!==null&&<small>最佳通关时间 {timeLabel(best)}</small>}</div></div>}
    </div>
    <div className="game-bottom-bar"><div className="controls-desc"><span><b>W A S D</b> 移动</span><span><b>SPACE</b> 冲刺</span><span><b>E</b> 回溯 & 留下分身</span></div><div className="abilities"><button onClick={dash} disabled={hud.phase!=='playing'||paused}><Zap size={16}/><span>冲刺 <small>{hud.dash>0?`${hud.dash.toFixed(1)}s`:'READY'}</small></span></button><button onClick={rewind} disabled={hud.phase!=='playing'||paused}><RotateCcw size={16}/><span>回响 <small>× {hud.charges}</small></span></button></div></div>
    <div className="touch-controls" aria-label="触控移动"><button className="up" aria-label="向上" onPointerDown={pointer('w',true)} onPointerUp={pointer('w',false)} onPointerCancel={pointer('w',false)} onLostPointerCapture={pointer('w',false)}><ArrowUp/></button><button className="left" aria-label="向左" onPointerDown={pointer('a',true)} onPointerUp={pointer('a',false)} onPointerCancel={pointer('a',false)} onLostPointerCapture={pointer('a',false)}><ArrowLeft/></button><button className="down" aria-label="向下" onPointerDown={pointer('s',true)} onPointerUp={pointer('s',false)} onPointerCancel={pointer('s',false)} onLostPointerCapture={pointer('s',false)}><ArrowDown/></button><button className="right" aria-label="向右" onPointerDown={pointer('d',true)} onPointerUp={pointer('d',false)} onPointerCancel={pointer('d',false)} onLostPointerCapture={pointer('d',false)}><ArrowRight/></button></div><p className="game-note">免费浏览器试玩原型 · 自动攻击附近敌人 · 需要支持 WebGL 的浏览器</p>
  </div>;
}
