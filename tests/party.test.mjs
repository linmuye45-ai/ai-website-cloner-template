import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { WebSocket } from 'ws';

const port = 19327;
const url = `ws://127.0.0.1:${port}/api/party`;
function open() { return new Promise((resolve, reject) => { const ws = new WebSocket(url); const queue=[]; const waiters=[]; ws.on('message', data => { const m=JSON.parse(data.toString()); const i=waiters.findIndex(w=>w.pred(m)); if(i>=0) {const w=waiters.splice(i,1)[0];clearTimeout(w.timer);w.resolve(m);} else queue.push(m); }); ws.on('open', () => resolve({ ws, send: m=>ws.send(JSON.stringify(m)), next: pred=>new Promise((res,rej)=>{ const i=queue.findIndex(pred); if(i>=0) return res(queue.splice(i,1)[0]); const w={pred,resolve:res,timer:setTimeout(()=>rej(new Error('message timeout')),3000)}; waiters.push(w); }) })); ws.on('error',reject); }); }
const state = (room) => m=>m.type==='state' && (!room || room(m.room));
test('two clients share a server-authoritative game with room limits and win condition', {timeout:15000}, async t => {
  const server = spawn(process.execPath,['server/party.mjs'],{env:{...process.env,PORT:String(port)},stdio:['ignore','pipe','pipe']});
  t.after(()=>server.kill());
  await new Promise((resolve,reject)=>{ server.stdout.on('data',resolve);server.on('exit',code=>reject(new Error('server exited '+code))); setTimeout(()=>reject(new Error('server startup timeout')),4000).unref();});
  const a=await open(), b=await open(), c=await open(), d=await open(), e=await open(); t.after(()=>[a,b,c,d,e].forEach(x=>x.ws.terminate()));
  a.send({type:'create', name:'Alice', spec:{title:'测试', targetScore:3, seconds:15}});
  const joined=await a.next(m=>m.type==='joined'); assert.match(joined.code,/^[A-F0-9]{10}$/);
  await a.next(state(r=>r.players.length===1));
  b.send({type:'join',name:'Bob',code:joined.code}); await b.next(m=>m.type==='joined'); await a.next(state(r=>r.players.length===2));
  b.send({type:'start'}); assert.match((await b.next(m=>m.type==='error')).message,/房主/);
  c.send({type:'join',name:'C',code:joined.code}); await c.next(m=>m.type==='joined');
  d.send({type:'join',name:'D',code:joined.code}); await d.next(m=>m.type==='joined');
  e.send({type:'join',name:'E',code:joined.code}); assert.match((await e.next(m=>m.type==='error')).message,/房间已满/);
  a.send({type:'start'}); let current=(await a.next(state(r=>r.phase==='playing'))).room;
  const bobStarted=(await b.next(state(r=>r.phase==='playing'))).room; assert.equal(current.target,bobStarted.target);
  b.send({type:'tap',cell:(current.target+1)%9});
  for(let score=1;score<=3;score++) { a.send({type:'tap',cell:current.target}); current=(await a.next(state(r=>r.players.find(p=>p.id===joined.playerId)?.score===score))).room; }
  assert.equal(current.phase,'finished'); assert.equal(current.players.find(p=>p.name==='Alice').score,3); assert.equal(current.players.find(p=>p.name==='Bob').score,0);
  a.send({type:'leave'}); await a.next(m=>m.type==='left'); const updated=(await b.next(state(r=>r.host!==joined.playerId && r.players.length===3))).room; assert.equal(updated.host, updated.players[0].id);
});
