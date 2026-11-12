// Deterministic game rules for The Last Echo. Visuals are intentionally separate.
export const SHARDS = [[-10,-10],[-2,-13],[8,-11],[13,-4],[11,8],[3,12],[-7,10],[-13,2]];
export const EXIT = {x:0,z:-3};
export function createGame() {
  return {phase:'ready',x:0,z:7,hp:5,shards:SHARDS.map(([x,z])=>({x,z,taken:false})),kills:0,time:0,charges:1,dashCooldown:0,dashTime:0,invuln:0,shotCooldown:0,spawnCooldown:2,enemies:[],bullets:[],history:[],historyCooldown:0,echoes:[],nextId:0};
}
const dist = (a,b) => Math.hypot(a.x-b.x,a.z-b.z);
export function startGame(g) {g.phase='playing';}
export function tryDash(g,dx,dz) { if(g.phase!=='playing'||g.dashCooldown>0||Math.hypot(dx,dz)<0.1) return false; g.dashTime=.22; g.dashCooldown=2.5;g.invuln=Math.max(g.invuln,.22);return true; }
export function tryRewind(g) {
  if(g.phase!=='playing'||g.charges<1||g.history.length<4)return false;
  const path=g.history.map(p=>({...p}));const old=path[0];g.charges--;g.x=old.x;g.z=old.z;g.hp=Math.max(g.hp,old.hp);g.invuln=1;g.echoes.push({id:g.nextId++,path,age:0,x:old.x,z:old.z,shotCooldown:0});g.history=[];return true;
}
function fire(g,x,z) {
  let target=null,best=8.5;for(const e of g.enemies){const d=dist({x,z},e);if(d<best){best=d;target=e;}}
  if(!target)return false;const dx=(target.x-x)/best,dz=(target.z-z)/best;g.bullets.push({id:g.nextId++,x,z,vx:dx*15,vz:dz*15,life:.85});return true;
}
export function stepGame(g,dt,input={x:0,z:0},random=Math.random) {
  if(g.phase!=='playing')return;dt=Math.min(Math.max(dt,0),.05);g.time+=dt;
  g.dashCooldown=Math.max(0,g.dashCooldown-dt);g.dashTime=Math.max(0,g.dashTime-dt);g.invuln=Math.max(0,g.invuln-dt);
  const len=Math.hypot(input.x,input.z);if(len>0){const speed=g.dashTime>0?14:5.4;g.x=Math.max(-15.5,Math.min(15.5,g.x+input.x/len*speed*dt));g.z=Math.max(-15.5,Math.min(15.5,g.z+input.z/len*speed*dt));}
  g.historyCooldown-=dt;if(g.historyCooldown<=0){g.history.push({x:g.x,z:g.z,hp:g.hp});if(g.history.length>40)g.history.shift();g.historyCooldown=.1;}
  for(const shard of g.shards){if(!shard.taken&&dist(g,shard)<1.15){shard.taken=true;const count=g.shards.filter(s=>s.taken).length;if(count===3||count===6)g.charges=Math.min(3,g.charges+1);}}
  if(g.shards.every(s=>s.taken)&&dist(g,EXIT)<1.65){g.phase='won';return;}
  g.spawnCooldown-=dt;if(g.spawnCooldown<=0&&g.enemies.length<22){const a=random()*Math.PI*2;const r=14+random()*2;g.enemies.push({id:g.nextId++,x:Math.cos(a)*r,z:Math.sin(a)*r,hp:2,speed:1.6+Math.min(g.time/80,1.1)});g.spawnCooldown=Math.max(1.25,3.1-g.time/45);}
  g.shotCooldown-=dt;if(g.shotCooldown<=0&&fire(g,g.x,g.z))g.shotCooldown=.48;
  for(const echo of g.echoes){echo.age+=dt;const i=Math.min(echo.path.length-1,Math.floor(echo.age*10));echo.x=echo.path[i].x;echo.z=echo.path[i].z;echo.shotCooldown-=dt;if(echo.shotCooldown<=0&&fire(g,echo.x,echo.z))echo.shotCooldown=.65;}
  g.echoes=g.echoes.filter(e=>e.age<e.path.length*.1);
  for(const e of g.enemies){const d=dist(g,e);if(d>.01){e.x+=(g.x-e.x)/d*e.speed*dt;e.z+=(g.z-e.z)/d*e.speed*dt;}if(d<.8&&g.invuln<=0){g.hp--;g.invuln=1.2;if(g.hp<=0){g.phase='lost';return;}}}
  for(const b of g.bullets){b.x+=b.vx*dt;b.z+=b.vz*dt;b.life-=dt;for(const e of g.enemies){if(e.hp>0&&dist(b,e)<.68){e.hp--;b.life=0;break;}}}
  g.bullets=g.bullets.filter(b=>b.life>0);const dead=g.enemies.filter(e=>e.hp<=0).length;g.kills+=dead;g.enemies=g.enemies.filter(e=>e.hp>0);
}
