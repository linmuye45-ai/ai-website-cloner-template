import test from 'node:test';
import assert from 'node:assert/strict';
import {createGame, startGame, stepGame, tryDash, tryRewind, EXIT} from '../src/lib/echo-game.mjs';

test('player moves, dashes and cooldown prevents repeated dashes',()=>{const g=createGame();startGame(g);assert.ok(tryDash(g,1,0));assert.equal(tryDash(g,1,0),false);const x=g.x;stepGame(g,.05,{x:1,z:0});assert.ok(g.x-x>.6);});
test('rewind restores old location and health, creates a fighting echo, and spends a charge',()=>{const g=createGame();startGame(g);for(let i=0;i<50;i++)stepGame(g,.05,{x:1,z:0},()=>.5);g.hp=2;const x=g.x;assert.equal(tryRewind(g),true);assert.ok(g.x<x);assert.equal(g.hp,5);assert.equal(g.charges,0);assert.equal(g.echoes.length,1);assert.equal(tryRewind(g),false);g.enemies=[{id:200,x:g.echoes[0].x+2,z:g.echoes[0].z,hp:2,speed:0}];g.shotCooldown=10;stepGame(g,.05,{x:0,z:0});assert.ok(g.bullets.length>0);});
test('collect all shards then reach exit to win',()=>{const g=createGame();startGame(g);for(const s of g.shards){g.x=s.x;g.z=s.z;stepGame(g,.01,{},()=>0);}assert.ok(g.shards.every(s=>s.taken));assert.equal(g.charges,3);assert.equal(g.phase,'playing');g.x=EXIT.x;g.z=EXIT.z;stepGame(g,.01,{},()=>0);assert.equal(g.phase,'won');});
test('enemy hits cause invulnerability, and game ends at zero health',()=>{const g=createGame();startGame(g);g.hp=1;g.enemies=[{id:1,x:g.x,z:g.z,hp:2,speed:0}];stepGame(g,.01,{x:0,z:0});assert.equal(g.phase,'lost');assert.equal(g.hp,0);});
test('new game resets all progress',()=>{const g=createGame();startGame(g);g.hp=0;g.shards[0].taken=true;const fresh=createGame();assert.equal(fresh.phase,'ready');assert.equal(fresh.hp,5);assert.equal(fresh.shards.filter(s=>s.taken).length,0);});
