import {test} from 'node:test';import assert from 'node:assert/strict';import {createGame,action,update} from '../src/sim.js';
test('moves, places a pad and kicks the ball',()=>{let s=createGame();update(s,{z:-1},.05);assert(s.player.z<5);action(s,'pad');assert(s.pad);s.player.z=2;action(s,'kick');assert(s.ball.vz<0)});
test('pad charges and ball entering goal scores and resets',()=>{let s=createGame();s.pad={x:0,z:1,cooldown:0};update(s,{},.03);assert(s.charged);s.ball.x=0;s.ball.z=-6.3;update(s,{},.01);assert.equal(s.score,1);assert.equal(s.charged,false)});
test('timer ends',()=>{let s=createGame();s.time=.01;update(s,{},.05);assert(s.over);let x=s.player.x;update(s,{x:1},.05);assert.equal(s.player.x,x)});
test('ordinary player inputs can complete a score',()=>{let s=createGame();action(s,'pad');for(let i=0;i<12;i++) update(s,{z:-1},.05);action(s,'kick');for(let i=0;i<200 && !s.score;i++)update(s,{},.05);assert.equal(s.score,1)});
