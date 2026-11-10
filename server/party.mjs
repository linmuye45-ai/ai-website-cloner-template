// Prototype only: in-memory, single instance, no accounts or persistence.
import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
import { randomBytes, randomInt } from 'node:crypto';
import { WebSocketServer, WebSocket } from 'ws';

const root = resolve(process.env.SITE_DIR || 'site');
const rooms = new Map();
const MAX_ROOMS = 100;
const colors = ['#ff886b', '#91b8ff', '#eabf5f', '#b8a3fa'];
const id = () => randomBytes(4).toString('hex');
const code = () => randomBytes(5).toString('hex').toUpperCase();
const safeName = value => typeof value === 'string' ? value.replace(/[\u0000-\u001f\u007f]/g, '').trim().slice(0, 16) || '玩家' : '玩家';
const integer = (value, fallback, min, max) => Number.isInteger(value) ? Math.min(max, Math.max(min, value)) : fallback;
const specFrom = value => ({ title: safeName(value?.title || '星光争夺战'), targetScore: integer(value?.targetScore, 10, 3, 25), seconds: integer(value?.seconds, 30, 15, 90) });
function publicRoom(room) {
  return { code: room.code, spec: room.spec, phase: room.phase, endAt: room.endAt, target: room.target, players: [...room.players.values()].map(({id, name, score, color}) => ({id, name, score, color})), host: room.host };
}
function send(ws, data) { if (ws.readyState === WebSocket.OPEN) ws.send(JSON.stringify(data)); }
function broadcast(room) { const message = { type: 'state', room: publicRoom(room), serverNow: Date.now() }; for (const p of room.players.values()) send(p.ws, message); }
function sendError(ws, message) { send(ws, { type: 'error', message }); }
function clearRound(room) { if (room.timer) clearTimeout(room.timer); room.timer = null; }
function leave(ws) {
  const room = rooms.get(ws.roomCode); if (!room) return;
  room.players.delete(ws.playerId); ws.roomCode = null;
  if (!room.players.size) { clearRound(room); rooms.delete(room.code); return; }
  if (room.host === ws.playerId) room.host = room.players.keys().next().value;
  if (room.phase === 'playing' && room.players.size < 2) { clearRound(room); room.phase = 'finished'; room.endAt = null; }
  broadcast(room);
}
function newTarget(last = -1) { let next; do { next = randomInt(9); } while (next === last); return next; }
function addPlayer(ws, room, name) {
  const player = { id: id(), name: safeName(name), score: 0, color: colors[[...room.players.values()].length], ws };
  room.players.set(player.id, player); ws.playerId = player.id; ws.roomCode = room.code;
  if (!room.host) room.host = player.id;
  send(ws, { type: 'joined', playerId: player.id, code: room.code }); broadcast(room);
}
const types = { '.html': 'text/html; charset=utf-8', '.js':'text/javascript; charset=utf-8', '.css':'text/css; charset=utf-8', '.png':'image/png', '.ico':'image/x-icon', '.woff2':'font/woff2', '.txt':'text/plain; charset=utf-8', '.svg':'image/svg+xml' };
const server = http.createServer(async (req, res) => {
  if (req.url?.split('?')[0] === '/api/health') { res.writeHead(200, {'content-type':'application/json','cache-control':'no-store'}); res.end(JSON.stringify({ok:true, multiplayer:'prototype'})); return; }
  try {
    const pathname = decodeURIComponent(new URL(req.url || '/', 'http://local').pathname);
    let file = resolve(root, '.' + pathname);
    if (file !== root && !file.startsWith(root + sep)) throw new Error('invalid path');
    if ((await stat(file)).isDirectory()) file = resolve(file, 'index.html');
    const body = await readFile(file); res.writeHead(200, {'content-type':types[extname(file)] || 'application/octet-stream','x-content-type-options':'nosniff'}); res.end(body);
  } catch { res.writeHead(404, {'content-type':'text/plain; charset=utf-8'}); res.end('Not found'); }
});
const wss = new WebSocketServer({ noServer:true, maxPayload:2048 });
server.on('upgrade', (req, socket, head) => {
  if (req.url !== '/api/party') { socket.destroy(); return; }
  // Same-origin browser requests only; server-to-server tests may omit Origin.
  if (req.headers.origin) { try { if (new URL(req.headers.origin).host !== req.headers.host) { socket.destroy(); return; } } catch { socket.destroy(); return; } }
  wss.handleUpgrade(req, socket, head, ws => wss.emit('connection', ws, req));
});
wss.on('connection', ws => {
  let count = 0; let windowStart = Date.now();
  ws.on('message', data => {
    if (Date.now() - windowStart > 1000) { count = 0; windowStart = Date.now(); }
    if (++count > 35) { ws.close(1008, 'Rate limit'); return; }
    let msg; try { msg = JSON.parse(data.toString()); } catch { return sendError(ws, '消息格式错误'); }
    if (!msg || typeof msg !== 'object') return;
    if (msg.type === 'create') {
      if (ws.roomCode) return sendError(ws, '请先离开当前房间');
      if (rooms.size >= MAX_ROOMS) return sendError(ws, '服务器房间已满');
      let roomCode; do { roomCode = code(); } while (rooms.has(roomCode));
      const room = { code:roomCode, spec:specFrom(msg.spec), players:new Map(), host:null, phase:'lobby', target:0, endAt:null, timer:null };
      rooms.set(roomCode, room); addPlayer(ws, room, msg.name); return;
    }
    if (msg.type === 'join') {
      if (ws.roomCode) return sendError(ws, '请先离开当前房间');
      const room = rooms.get(typeof msg.code === 'string' ? msg.code.toUpperCase() : '');
      if (!room) return sendError(ws, '房间不存在，或服务已重启');
      if (room.players.size >= 4) return sendError(ws, '房间已满（最多 4 人）');
      if (room.phase === 'playing') return sendError(ws, '对局中，请等下一局');
      addPlayer(ws, room, msg.name); return;
    }
    if (msg.type === 'leave') { leave(ws); send(ws, {type:'left'}); return; }
    const room = rooms.get(ws.roomCode); const player = room?.players.get(ws.playerId); if (!room || !player) return sendError(ws, '请先加入房间');
    if (msg.type === 'start') {
      if (room.host !== player.id) return sendError(ws, '只有房主能开始');
      if (room.players.size < 2) return sendError(ws, '至少需要 2 名玩家');
      if (room.phase === 'playing') return;
      for (const p of room.players.values()) p.score = 0;
      room.phase = 'playing'; room.target = newTarget(); room.endAt = Date.now() + room.spec.seconds * 1000;
      clearRound(room); room.timer = setTimeout(() => { room.phase = 'finished'; room.endAt = null; broadcast(room); }, room.spec.seconds * 1000); broadcast(room); return;
    }
    if (msg.type === 'tap') {
      if (room.phase !== 'playing' || Date.now() >= room.endAt || !Number.isInteger(msg.cell) || msg.cell !== room.target) return;
      player.score++; room.target = newTarget(room.target);
      if (player.score >= room.spec.targetScore) { clearRound(room); room.phase = 'finished'; room.endAt = null; }
      broadcast(room);
    }
  });
  ws.on('close', () => leave(ws)); ws.on('error', () => leave(ws));
});
const port = Number(process.env.PORT || 3000);
server.listen(port, '0.0.0.0', () => console.log(`Party prototype listening on 0.0.0.0:${port} (site: ${root})`));
for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => { for (const room of rooms.values()) clearRound(room); wss.clients.forEach(client => client.terminate()); server.close(() => process.exit(0)); });
