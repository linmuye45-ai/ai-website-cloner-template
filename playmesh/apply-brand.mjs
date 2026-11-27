import fs from 'node:fs';
import path from 'node:path';
const root=process.argv[2];
function edit(rel, fn){const p=path.join(root,rel);const before=fs.readFileSync(p,'utf8');const after=fn(before);if(after===before)throw new Error('Expected PlayMesh patch did not change '+rel);fs.writeFileSync(p,after);}
function rep(s,a,b,rel){if(!s.includes(a))throw new Error('Missing expected text in '+rel+': '+a.slice(0,80));return s.replace(a,b);}
function all(s,a,b){return s.split(a).join(b);}
edit('package.json',s=>{
 const p=JSON.parse(s);p.devDependencies.vitest='5.1.2';
 p.description='PlayMesh — browser-first social game platform';
 p.repository={type:'git',url:'https://github.com/linmuye45-ai/ai-website-cloner-template.git'};
 p.bugs={url:'https://github.com/linmuye45-ai/ai-website-cloner-template/issues'};
 p.homepage='https://github.com/linmuye45-ai/ai-website-cloner-template/tree/playmesh-foundation/playmesh';
 return JSON.stringify(p,null,2)+String.fromCharCode(10);
});
edit('apps/web/src/components/Layout.tsx',s=>{
 s=all(s,'#ffb12e','#6e63f5');s=all(s,'#d98a00','#5147ce');s=all(s,'#ffe29a','#d5f45a');s=all(s,'#8a5a00','#312a83');
 s=rep(s,'<span>mini-games<span className="wordmark-cursor">_</span></span>','<span>playmesh<span className="wordmark-cursor">.</span></span>','Layout.tsx');
 s=rep(s,"const links = [{ to: '/games', label: 'Games' }, { to: '/play', label: 'Create or join' },","const links = [{ to: '/games', label: 'Discover' }, { to: '/play', label: 'Play' },",'Layout.tsx');
 s=all(s,'Start a game','Start playing');s=rep(s,'Short games for people who used to<br />hang around arcades. One more round.','Find a game. Bring your people.<br />Play one more round.','Layout.tsx');
 s=all(s,'Find a game <Arrow />','Discover games <Arrow />');s=all(s,'Make a room <Arrow />','Create a room <Arrow />');
 s=all(s,'Free to play. No coins required.','Free to start. Play in your browser.');
 s=all(s,'Guest sessions are temporary. Your nickname is visible to your party.','Your nickname is visible to the players in your room.');
 return s;
});
edit('apps/web/src/pages/Home.tsx',s=>{
 const pairs=[
 ['Open late. No quarters needed.','GOOD TIMES, ONE LINK AWAY'],
 ['Insert friends<br />to <span className="chaos-word">continue</span>.','Play together.<br />Stay for <span className="chaos-word">one more round</span>.'],
 ['Short multiplayer games for the people you used to spend whole afternoons with. Make a room, send the code, play for ten minutes. No downloads, no accounts.','Quick multiplayer games for friends, wherever they are. Open a room, share one link, and start playing in seconds. No download required.'],
 ['Create a room','Start a room'],['Join with a code','Join a friend'],
 ['Two to twelve players.<br /><strong>Runs in a browser tab.</strong>','2–12 players.<br /><strong>Works in your browser.</strong>'],
 ['Free play, always.','Free to start.'],['No downloads <Spark /> No accounts <Spark /> No coins','No downloads <Spark /> Quick invites <Spark /> Just play'],
 ['See the cabinets ↓','Explore games ↓'],['The cabinets','Discover'],['Pick a game, pick a fight.','Find your next favourite game.'],
 ['All games and rules','Explore all games'],['Tonight’s pick: Majority Trap','Featured game · Majority Trap'],
 ['Great minds<br />don’t think alike.','How well do you<br />know your friends?'],
 ['Pick a side. Predict the least popular answer. Discover just how badly you know your friends.','Choose your answer, then predict what everyone else will choose. The best read on the room wins.'],
 ['Strong opinions encouraged','Quick rounds. Big reactions.'],['Private rooms','Bring your people'],
 ['Bring the<br />old gang.<span className="social-asterisk">*</span>','Better with<br />your <span className="social-asterisk">people.</span>'],
 ['*Or they will be. Make a private room, send the code, and settle who was actually the best.','Create a private room, send a link, and bring everyone into the same game.'],
 ['Claim your player','Pick your player'],['A nickname. A face. That’s your entire signup.','Choose a nickname and avatar. Start without a full account.'],
 ['Send the invite','Share the invite'],['One code gets everyone into the same room.','One link brings everyone into the same room.'],
 ['Make it a game night','Play together'],['Ready up, play, and keep the party together.','Play, rematch, and switch games without splitting up.'],
 ['Redeem this ticket for one room','Your next game starts here']
 ];
 for(const [a,b] of pairs)s=rep(s,a,b,'Home.tsx');
 return s;
});
edit('apps/web/src/pages/Library.tsx',s=>{
 s=all(s,'The cabinets','Explore');s=rep(s,'<h1>Games<span','<h1>Discover<span','Library.tsx');
 s=all(s,'Short rounds, long grudges. Pick a game and bring your people.','Quick games for good company. Pick one and invite your people.');
 s=all(s,'No installs.<br />All play.','One link.<br />All play.');s=all(s,'games on the floor','games to explore');
 s=all(s,'One room, every game. Your host can change the game while the whole party stays together.','One room, every game. Switch games without losing your party.');
 return s;
});
edit('apps/web/src/pages/Play.tsx',s=>{
 s=all(s,'One room. All your favorite people.','Your next game night starts here.');
 s=all(s,'Make room for fun.','Start a room.');
 s=all(s,'Choose a nickname and avatar, then jump into the party. No account needed.','Choose a nickname and avatar, then join the game. No account needed.');
 s=all(s,'Rooms are private: only people with the code or invite link can enter. You get both after you create one.','Create a private room and invite friends with a link. You can switch games without creating a new room.');
 return s;
});
edit('apps/web/src/pages/Legal.tsx',s=>{
 s=all(s,'https://github.com/trazhub/Mini-Games/issues','https://github.com/linmuye45-ai/ai-website-cloner-template/issues');
 s=all(s,'Mini-Games contains original implementations of game ideas.','PlayMesh contains original implementations of game ideas.');
 s=all(s,"Sound effects are samples from Kenney's Interface Sounds pack (CC0). Game art was generated with Canva's image generator for this project; avatars are pixel sprites drawn in code.","The multiplayer foundation is adapted from the MIT-licensed MiniGameHub project by trazhub. Sound effects from Kenney's Interface Sounds pack are identified upstream as CC0. Existing generated game artwork is a prototype placeholder; verify Canva's current commercial terms or replace it before commercial release.");
 return s;
});
edit('apps/web/src/lib/config.ts',s=>{
 s=rep(s,'return `${window.location.protocol}//${window.location.hostname}:2567`;',"return import.meta.env.DEV ? `${window.location.protocol}//${window.location.hostname}:2567` : '';","config.ts");
 return all(s,"|| 'Mini-Games'","|| 'PlayMesh'");
});
edit('apps/web/vite.config.ts',s=>{
 s=rep(s,"export default defineConfig(({ command, isPreview }) => ({","export default defineConfig(() => ({",'vite.config.ts');
 s=all(s,"/**\n * GitHub Pages project sites are served from /<repo>/, so the base path is injected at build\n * time (VITE_BASE_PATH=/<repo>/). Production builds default to /Mini-Games/ (see below).\n * Routing uses the hash (#/...) so no server rewrites are needed.\n */","/** PlayMesh deploys at the origin root; VITE_BASE_PATH remains available for subpath hosting. */");
 s=all(s,"// Production builds target https://trazhub.github.io/Mini-Games/. Override with VITE_BASE_PATH\n  // (e.g. for a fork). Local dev serves from \"/\".","// PlayMesh is deployed at the origin root; VITE_BASE_PATH remains available for subpath hosting.");
 s=rep(s,"base: process.env.VITE_BASE_PATH ?? (command === 'build' || isPreview ? '/Mini-Games/' : '/'),","base: process.env.VITE_BASE_PATH ?? '/',",'vite.config.ts');
 return s;
});
edit('apps/web/index.html',s=>{
 s=all(s,'content="#f6f1e8"','content="#f7f8fc"');
 s=all(s,'Free multiplayer mini-games you can play with friends in your browser. No download, no sign-up: share a room code and play.','PlayMesh is a social game space for quick multiplayer games. Create a room, invite friends with one link, and play in your browser.');
 return all(s,'Mini-Games · Small games. Big chaos.','PlayMesh · Play together. One more round.');
});
edit('apps/server/src/main.ts',s=>all(s,'MiniGameHub','PlayMesh'));
edit('apps/web/src/index.css',s=>s+'\n'+fs.readFileSync(path.join(process.cwd(),'playmesh-theme.css'),'utf8'));
edit('docs/LEGAL.md',s=>{
 s=all(s,'MiniGameHub','PlayMesh');
 s=all(s,"Game art was generated with Canva's image generator for this project; avatars are pixel sprites drawn in code.","The inherited game art is a prototype placeholder originally generated for the upstream project. Verify Canva's current commercial terms or replace these assets before commercial release.");
 return s;
});
