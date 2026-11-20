// Deterministic cooperative simulation. Positions, scoring and hazards are server-authoritative.
export const ARENA=10;
export const GOAL=3;
const spawns=[[-5,-6],[0,-7],[5,-6]];
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const dist=(a,b)=>Math.hypot(a.x-b.x,a.z-b.z);
export function createGame(){return {phase:'lobby',players:[],objects:spawns.map(([x,z],id)=>({id,x,z,startX:x,startZ:z,delivered:false,holders:[],strain:0,breaks:0})),monster:{x:0,z:-9,stun:0},time:150,delivered:0,losses:0,reason:'',tick:0};}
export function addPlayer(g,id,name,color){if(g.phase!=='lobby'||g.players.length>=6)return false;g.players.push({id,name,color,x:(g.players.length-2.5)*1.1,z:8,inputX:0,inputZ:0,stun:0,held:null});return true;}
export function removePlayer(g,id){drop(g,id);g.players=g.players.filter(p=>p.id!==id);if(g.phase==='playing'&&g.players.length===0){g.phase='ended';g.reason='empty';}}
export function startGame(g){if(g.phase!=='lobby'||g.players.length<2)return false;g.phase='playing';return true;}
export function input(g,id,x,z){const p=g.players.find(p=>p.id===id);if(!p||g.phase!=='playing'||!Number.isFinite(x)||!Number.isFinite(z))return false;const len=Math.hypot(x,z);p.inputX=len>1?x/len:x;p.inputZ=len>1?z/len:z;return true;}
export function drop(g,id){const p=g.players.find(p=>p.id===id);if(!p)return false;for(const o of g.objects)o.holders=o.holders.filter(h=>h!==id);p.held=null;return true;}
export function grab(g,id){const p=g.players.find(p=>p.id===id);if(!p||p.stun>0||g.phase!=='playing')return false;if(p.held!==null){drop(g,id);return true;}const options=g.objects.filter(o=>!o.delivered&&o.holders.length<2&&dist(o,p)<2.4).sort((a,b)=>dist(a,p)-dist(b,p));if(!options.length)return false;options[0].holders.push(id);p.held=options[0].id;return true;}
export function stepGame(g,dt){if(g.phase!=='playing')return;dt=clamp(dt,0,.1);g.time=Math.max(0,g.time-dt);g.tick++;
 for(const p of g.players){p.stun=Math.max(0,p.stun-dt);const o=g.objects.find(o=>o.id===p.held);const speed=o?(o.holders.length>=2?3.2:2.15):4.2;if(p.stun<=0){p.x=clamp(p.x+p.inputX*speed*dt,-9.3,9.3);p.z=clamp(p.z+p.inputZ*speed*dt,-9.3,9.3);}}
 for(const o of g.objects){if(o.delivered)continue;let holders=o.holders.map(id=>g.players.find(p=>p.id===id)).filter(Boolean);o.holders=holders.map(p=>p.id);if(holders.length===2&&dist(holders[0],holders[1])>4.5){for(const p of holders)drop(g,p.id);holders=[];o.strain=Math.min(100,o.strain+25);}
  if(holders.length){const x=holders.reduce((s,p)=>s+p.x,0)/holders.length,z=holders.reduce((s,p)=>s+p.z,0)/holders.length;const gap=Math.hypot(x-o.x,z-o.z);const rate=Math.min(1,dt*(holders.length===2?5:2.4));o.x+=(x-o.x)*rate;o.z+=(z-o.z)*rate;o.strain=clamp(o.strain+(gap>(holders.length===1?.65:1.35)?(holders.length===1?18:9):-12)*dt,0,100);if(o.strain>=100){for(const p of holders)drop(g,p.id);o.x=o.startX;o.z=o.startZ;o.strain=0;o.breaks++;g.losses++;}if(o.z>7&&Math.abs(o.x)<3){for(const p of holders)drop(g,p.id);o.delivered=true;g.delivered++;}}
  else o.strain=Math.max(0,o.strain-6*dt);
 }
 const m=g.monster;const targets=g.players.filter(p=>p.held!==null&&p.stun<=0);const target=targets.sort((a,b)=>dist(a,m)-dist(b,m))[0];if(target&&m.stun<=0){const d=dist(target,m),speed=1.65;if(d>.1){m.x+=(target.x-m.x)/d*speed*dt;m.z+=(target.z-m.z)/d*speed*dt;}if(d<1.1){target.stun=2;drop(g,target.id);m.stun=1.5;}}m.stun=Math.max(0,m.stun-dt);
 if(g.delivered>=GOAL){g.phase='ended';g.reason='win';}else if(g.losses>=3){g.phase='ended';g.reason='broken';}else if(g.time<=0){g.phase='ended';g.reason='time';}
}
export function snapshot(g){return {phase:g.phase,players:g.players.map(({inputX,inputZ,...p})=>p),objects:g.objects,monster:g.monster,time:g.time,delivered:g.delivered,losses:g.losses,reason:g.reason,tick:g.tick};}
