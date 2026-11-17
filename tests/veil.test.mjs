import test from 'node:test';
import assert from 'node:assert/strict';
import {CHAPTERS,DIFFICULTIES,createVeilGame,startVeil,stepVeil,slash,parry,dodge,focus,heal,interact,retryChapter,setDifficulty,checkpointFor,restoreCheckpoint} from '../src/lib/veil-game.mjs';
const playing=(difficulty='balanced')=>{const g=createVeilGame(difficulty);startVeil(g);return g;};
const advance=(g,n=20,input={x:0,z:0})=>{for(let i=0;i<n;i++)stepVeil(g,.05,input);};
test('movement follows view and cannot pass through a landmark',()=>{const g=playing();g.yaw=Math.PI/2;stepVeil(g,.05,{x:0,z:1});assert.ok(g.x>.2);const o=CHAPTERS[0].obstacles[0];g.x=o.x;g.z=o.z+o.r+.4;g.yaw=0;advance(g,10,{x:0,z:1});assert.ok(Math.hypot(g.x-o.x,g.z-o.z)>=o.r+.36-1e-6);});
test('combo and heavy attack deal damage in front only and consume stamina',()=>{const g=playing();g.enemies=[{id:1,x:0,z:1,hp:8,maxHp:8,type:'warden',state:'chase',timer:0,flash:0},{id:2,x:0,z:5,hp:3,maxHp:3,type:'hunter',state:'chase',timer:0,flash:0}];assert.equal(slash(g,true),true);assert.equal(g.enemies[0].hp,5);assert.equal(g.enemies[1].hp,3);assert.equal(g.stamina,68);assert.equal(slash(g),false);});
test('timed frontal parry stuns enemy; dodge prevents damage',()=>{const g=playing();g.enemies=[{id:1,x:0,z:2,hp:3,maxHp:3,type:'hunter',state:'windup',timer:.05,flash:0}];assert.ok(parry(g));stepVeil(g,.05);assert.equal(g.hp,100);assert.equal(g.enemies[0].state,'stagger');g.hitstop=0;g.parry=0;g.enemies[0].state='windup';g.enemies[0].timer=.01;dodge(g);stepVeil(g,.05);assert.equal(g.hp,100);});
test('weave slows enemies and healing is limited',()=>{const normal=playing(),slow=playing();normal.enemies=[{id:1,x:0,z:-2,hp:3,maxHp:3,type:'hunter',state:'chase',timer:0,flash:0}];slow.enemies=[{...normal.enemies[0]}];assert.ok(focus(slow));stepVeil(normal,.05);stepVeil(slow,.05);assert.ok(slow.enemies[0].z<normal.enemies[0].z);assert.equal(slow.charges,1);slow.hp=25;assert.ok(heal(slow));assert.equal(slow.hp,70);assert.equal(slow.heals,1);});
test('difficulty affects damage, health and can be changed during play',()=>{const g=playing('story');assert.ok(setDifficulty(g,'challenge'));assert.equal(g.difficulty,'challenge');assert.equal(g.enemies[0].maxHp,Math.ceil(3*DIFFICULTIES.challenge.enemyHealth));assert.equal(setDifficulty(g,'fake'),false);g.enemies=[{id:1,x:0,z:2,hp:3,maxHp:3,type:'hunter',state:'windup',timer:.01,flash:0}];stepVeil(g,.05);assert.equal(g.hp,71);});
test('three real areas progress in order; final guardian gates ending',()=>{const g=playing();for(let i=0;i<3;i++){const c=CHAPTERS[i];assert.equal(g.chapter,i);g.x=c.gate.x;g.z=c.gate.z;assert.equal(interact(g),false);g.x=c.memoryPos.x;g.z=c.memoryPos.z;assert.equal(interact(g),true);assert.equal(g.memoryFound,true);g.x=c.beacon.x;g.z=c.beacon.z;assert.equal(interact(g),true);g.x=c.gate.x;g.z=c.gate.z;if(i===2){assert.equal(interact(g),false);g.enemies.find(e=>e.type==='warden').hp=0;}assert.equal(interact(g),true);}assert.equal(g.phase,'won');});
test('retry keeps the current chapter and restores a fresh checkpoint',()=>{const g=playing();g.chapter=1;g.hp=0;g.phase='lost';retryChapter(g);assert.equal(g.phase,'playing');assert.equal(g.chapter,1);assert.equal(g.hp,100);assert.equal(g.beaconLit,false);assert.equal(g.enemies.length,CHAPTERS[1].enemies.length);});

test('checkpoint restores chapter and difficulty and rejects corrupt data',()=>{const g=playing('challenge');g.chapter=2;const save=checkpointFor(g);const restored=restoreCheckpoint(JSON.parse(JSON.stringify(save)));assert.equal(restored.chapter,2);assert.equal(restored.difficulty,'challenge');assert.equal(restored.phase,'playing');assert.equal(restored.hp,100);assert.equal(restoreCheckpoint({version:1,chapter:99,difficulty:'story'}),null);assert.equal(restoreCheckpoint({version:1,chapter:0,difficulty:'__proto__'}),null);assert.equal(restoreCheckpoint(null),null);});
test('time echo replays a past attack once against the enemy in its current position',()=>{
 const g=playing();g.enemies=[{id:1,x:0,z:1,hp:15,maxHp:15,type:'guard',state:'stagger',timer:100,flash:0}];advance(g,10);assert.equal(slash(g),true);assert.equal(g.enemies[0].hp,14);advance(g,8);g.enemies[0].state='stagger';g.enemies[0].timer=100;assert.ok(focus(g));assert.equal(g.charges,1);assert.equal(focus(g),false);advance(g,5);assert.equal(g.enemies[0].hp,14);advance(g,12);assert.equal(g.enemies[0].hp,13);advance(g,30);assert.equal(g.enemies[0].hp,13);assert.equal(g.echo,null);
});
test('time echo cannot strike enemies who have moved out of the recorded attack arc',()=>{
 const g=playing();g.enemies=[{id:1,x:0,z:1,hp:10,maxHp:10,type:'guard',state:'stagger',timer:100,flash:0}];advance(g,10);slash(g);advance(g,8);g.enemies[0].x=8;g.enemies[0].state='stagger';g.enemies[0].timer=100;focus(g);advance(g,30);assert.equal(g.enemies[0].hp,9);
});
test('echo and player occupy opposite resonance circles for a one-time reward',()=>{
 const g=playing();g.enemies=[];const [a,b]=CHAPTERS[0].resonance;g.x=a.x;g.z=a.z;advance(g,8);for(let i=0;i<36;i++)stepVeil(g,.05,{x:1,z:0});assert.ok(Math.hypot(g.x-b.x,g.z-b.z)<1.15);g.hp=50;assert.ok(focus(g));stepVeil(g,.05);assert.equal(g.resonanceSolved,true);assert.equal(g.hp,75);assert.equal(g.charges,2);advance(g,20);assert.equal(g.hp,75);assert.equal(g.charges,2);
});
test('history is bounded and cleared on retry and chapter transition',()=>{
 const g=playing();g.enemies=[];advance(g,200);assert.ok(g.history.length<=500);assert.ok(g.time-g.history[0].t<=4.1);focus(g);assert.ok(g.echo);retryChapter(g);assert.equal(g.echo,null);assert.equal(g.history.length,0);assert.equal(g.historyActions.length,0);assert.equal(g.resonanceSolved,false);
});
test('guard blocks frontal light attacks, but a heavy attack breaks guard',()=>{
 const g=playing();g.enemies=[{id:1,x:0,z:1,hp:8,maxHp:8,type:'guard',state:'chase',timer:0,flash:0}];assert.equal(slash(g),false);assert.equal(g.enemies[0].hp,8);assert.equal(g.eventType,'guardBlock');g.attack=0;assert.equal(slash(g,true),true);assert.equal(g.enemies[0].hp,5);assert.equal(g.enemies[0].state,'stagger');
});
test('guardian windup reaches farther than a regular hunter',()=>{
 const g=playing();g.enemies=[{id:1,x:0,z:.5,hp:8,maxHp:8,type:'warden',state:'windup',timer:.01,flash:0}];stepVeil(g,.05);assert.equal(g.hp,70);
});
test('an echo can flank a shield guard while the player stands behind it',()=>{
 const g=playing();g.x=0;g.z=2;g.enemies=[{id:1,x:0,z:0,hp:5,maxHp:5,type:'guard',state:'windup',timer:100,flash:0}];assert.equal(slash(g),false);assert.equal(g.enemies[0].hp,5);g.z=-2;assert.ok(focus(g));stepVeil(g,.05);assert.equal(g.enemies[0].hp,4);
});
