import * as THREE from 'three';
import { CHAPTERS } from '@/lib/veil-game.mjs';

// Geometry is deliberately laid out from the same circular obstacles as the rules.
// Columns sit beyond the playable boundary; no decorative geometry blocks the route.
export function makeWorld(index:number) {
 const cfg=CHAPTERS[index];const root=new THREE.Group();
 const palette=[{floor:0x354746,stone:0x485552,dark:0x273834,accent:0xe6ab6d},{floor:0x383b36,stone:0x515248,dark:0x282e29,accent:0xe2b670},{floor:0x405040,stone:0x62634f,dark:0x293a2f,accent:0xe8a384}][index];
 const stone=new THREE.MeshStandardMaterial({color:palette.stone,roughness:.95});const dark=new THREE.MeshStandardMaterial({color:palette.dark,roughness:.92});const floor=new THREE.MeshStandardMaterial({color:palette.floor,roughness:.85});const trim=new THREE.MeshStandardMaterial({color:0x8c7b60,metalness:.5,roughness:.5});const ember=new THREE.MeshStandardMaterial({color:palette.accent,emissive:palette.accent,emissiveIntensity:1.4});const ghost=new THREE.MeshStandardMaterial({color:0x9be1d1,emissive:0x55c6ae,emissiveIntensity:1.7});const wood=new THREE.MeshStandardMaterial({color:0x4a3629,roughness:1});
 // Far backdrop is a painterly environment plate; collision and combat remain fully 3D.
 const texture=new THREE.TextureLoader().load(new URL(`../images/veil-${['shore','archive','garden'][index]}.jpg`, document.baseURI).toString());texture.colorSpace=THREE.SRGBColorSpace;
 const panorama=new THREE.Mesh(new THREE.PlaneGeometry(160,76),new THREE.MeshBasicMaterial({map:texture,fog:false}));panorama.position.set(0,21,-59);root.add(panorama);
 const canvas=document.createElement('canvas');canvas.width=512;canvas.height=512;const ctx=canvas.getContext('2d');
 if(ctx){ctx.fillStyle=['#778782','#827e6e','#75866e'][index];ctx.fillRect(0,0,512,512);let seed=index+71;const random=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};for(let i=0;i<7000;i++){const a=.025+random()*.06;ctx.fillStyle=random()>.5?`rgba(0,0,0,${a})`:`rgba(255,255,255,${a})`;ctx.fillRect(random()*512,random()*512,1+random()*4,1+random()*2);}ctx.strokeStyle='rgba(10,18,17,.32)';ctx.lineWidth=3;for(let y=0;y<=512;y+=64){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(512,y);ctx.stroke();for(let x=((y/64)%2)*64;x<=512;x+=128){ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x,y+64);ctx.stroke();}}const t=new THREE.CanvasTexture(canvas);t.colorSpace=THREE.SRGBColorSpace;t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(12,14);floor.map=t;floor.color.setHex(0xffffff);floor.needsUpdate=true;}
 const box=(parent:THREE.Object3D,w:number,h:number,d:number,mat:THREE.Material,x:number,y:number,z:number)=>{const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mat);m.position.set(x,y,z);parent.add(m);return m;};
 const ground=new THREE.Mesh(new THREE.PlaneGeometry(95,110),floor);ground.rotation.x=-Math.PI/2;ground.position.y=-.06;root.add(ground);
 // Inlaid stone slabs sit above the floor rather than overlapping it.
 for(let z=3;z>=-30;z-=3.5){box(root,15,.025,.045,dark,0,-.025,z);for(let x=-6;x<=6;x+=3)box(root,.045,.025,3.45,dark,x,-.025,z-1.72);}
 for(let z=5;z>=-30;z-=8){for(const side of [-1,1]){const x=side*11.4;box(root,1.3,7,1.3,stone,x,3.5,z);box(root,1.8,.5,1.8,stone,x,.25,z);box(root,1.8,.5,1.8,stone,x,6.75,z);const lamp=new THREE.Mesh(new THREE.OctahedronGeometry(.19),ember);lamp.position.set(side*10.5,3.1,z);root.add(lamp);}}
 // Each arch ends exactly at the column centers, instead of crossing them.
 if(index!==2){for(let z=5;z>=-30;z-=8){const arch=new THREE.Mesh(new THREE.TorusGeometry(11.4,.2,8,48,Math.PI),stone);arch.position.set(0,7,z);root.add(arch);}}
 if(index===0){for(let z=2;z>=-30;z-=4){for(const side of [-1,1]){const rock=new THREE.Mesh(new THREE.DodecahedronGeometry(.9),dark);rock.scale.set(1.4,.6,1.1);rock.position.set(side*(14+(Math.abs(z)%3)),.2,z);root.add(rock);}}}
 if(index===1){for(let z=0;z>=-25;z-=7){for(const side of [-1,1]){const x=side*13;box(root,2,6,3.2,wood,x,3,z);for(let y=1;y<6;y+=1.15){box(root,2.1,.12,3.3,trim,x,y,z);for(let i=0;i<6;i++){const book=box(root,.18,.65,.35,i%2?stone:ember,x+(i-2.5)*.27,y+.39,z+.8);book.rotation.z=(i%3-1)*.04;}}}}}
 if(index===2){for(let z=3;z>=-30;z-=5){for(const side of [-1,1]){const x=side*(14+Math.abs(z)%3);const trunk=new THREE.Mesh(new THREE.CylinderGeometry(.27,.55,5,7),wood);trunk.position.set(x,2.5,z);trunk.rotation.z=side*.12;root.add(trunk);for(let k=0;k<3;k++){const leaves=new THREE.Mesh(new THREE.IcosahedronGeometry(2.1,1),k%2?stone:dark);leaves.position.set(x+(k-1)*1.3,5.3+k*.45,z+(k%2)*1.1);root.add(leaves);}}}}
 // Layered silhouettes and suspended fragments add depth outside the playable path.
 for(let z=1;z>=-28;z-=7){for(const side of [-1,1]){const baseX=side*15.5;const slab=box(root,2.2,.45,2.4,stone,baseX,.22,z);slab.rotation.y=side*.12;const broken=new THREE.Mesh(new THREE.CylinderGeometry(.45,.75,3.5,7),stone);broken.position.set(baseX,1.95,z);broken.rotation.z=side*.12;root.add(broken);}}
 // The collision circles match these isolated landmarks.
 cfg.obstacles.forEach((o:{x:number;z:number;r:number})=>{const group=new THREE.Group();group.position.set(o.x,0,o.z);if(index===0){const rock=new THREE.Mesh(new THREE.DodecahedronGeometry(o.r),stone);rock.scale.set(.85,1.55,.85);rock.position.y=o.r*1.05;group.add(rock);}
 else if(index===1){box(group,1.5,3.2,1.5,wood,0,1.6,0);for(let y=.8;y<3;y+=.65)box(group,1.55,.08,1.55,trim,0,y,0);}
 else {const trunk=new THREE.Mesh(new THREE.CylinderGeometry(.36,.65,4,7),wood);trunk.position.y=2;group.add(trunk);const canopy=new THREE.Mesh(new THREE.IcosahedronGeometry(1.8,1),dark);canopy.position.y=4.2;group.add(canopy);}root.add(group);});
 const beacon=new THREE.Group();beacon.position.set(cfg.beacon.x,0,cfg.beacon.z);const base=new THREE.Mesh(new THREE.CylinderGeometry(.7,1,.35,8),stone);base.position.y=.18;const pedestal=new THREE.Mesh(new THREE.CylinderGeometry(.22,.4,1.5,8),trim);pedestal.position.y=1.1;const flame=new THREE.Mesh(new THREE.OctahedronGeometry(.35),ember);flame.position.y=2.15;const halo=new THREE.Mesh(new THREE.TorusGeometry(.55,.025,6,32),ember);halo.position.y=2.15;halo.rotation.x=Math.PI/2;beacon.add(base,pedestal,flame,halo);root.add(beacon);
 const memory=new THREE.Group();memory.position.set(cfg.memoryPos.x,0,cfg.memoryPos.z);const memoryBase=new THREE.Mesh(new THREE.CylinderGeometry(.5,.7,.3,8),stone);memoryBase.position.y=.15;const fragment=new THREE.Mesh(new THREE.IcosahedronGeometry(.38),ghost);fragment.position.y=1.25;memory.add(memoryBase,fragment);root.add(memory);
 const gate=new THREE.Group();gate.position.set(cfg.gate.x,0,cfg.gate.z);for(const side of [-1,1])box(gate,.55,3.5,.7,trim,side*3.2,1.75,0);const arch=new THREE.Mesh(new THREE.TorusGeometry(3.2,.28,8,48,Math.PI),trim);arch.position.y=3.5;gate.add(arch);const portal=new THREE.Mesh(new THREE.CircleGeometry(2.7,48),new THREE.MeshBasicMaterial({color:0x82dfc9,transparent:true,opacity:.08,side:THREE.DoubleSide,depthWrite:false}));portal.position.set(0,3.45,-.1);gate.add(portal);root.add(gate);
 // Distant sun does not intersect the playable architecture.
 const sun=new THREE.Group();sun.visible=false;sun.position.set(0,15,-60);const disk=new THREE.Mesh(new THREE.CircleGeometry(6.5,64),new THREE.MeshBasicMaterial({color:0x0b1110,side:THREE.DoubleSide}));const rim=new THREE.Mesh(new THREE.TorusGeometry(6.8,.15,8,64),ember);sun.add(disk,rim);root.add(sun);
 const dustGeo=new THREE.BufferGeometry();const positions=new Float32Array(450);let seed=index+123;const rand=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};for(let i=0;i<positions.length;i+=3){positions[i]=(rand()-.5)*27;positions[i+1]=rand()*10;positions[i+2]=rand()*40-31;}dustGeo.setAttribute('position',new THREE.BufferAttribute(positions,3));const dust=new THREE.Points(dustGeo,new THREE.PointsMaterial({color:0xc8d8c4,size:.055,transparent:true,opacity:.55}));root.add(dust);
 const lights=new THREE.Group();lights.add(new THREE.HemisphereLight(index===2?0xb5d6aa:0xb8cdc7,0x29302a,2.2));const sunLight=new THREE.DirectionalLight(0xe5d8bb,2);sunLight.position.set(-8,16,5);lights.add(sunLight);const local=new THREE.PointLight(palette.accent,18,11);local.position.set(cfg.beacon.x,3,cfg.beacon.z);lights.add(local);root.add(lights);
 return {root,flame,halo,fragment,portal,dust,rim,ember,ghost};
}
export function makeEnemy(type:string){
 const group=new THREE.Group();
 const armor=new THREE.MeshStandardMaterial({color:type==='warden'?0x595044:0x38423c,roughness:.7,metalness:.45});
 const cloth=new THREE.MeshStandardMaterial({color:0x242d2a,roughness:1,side:THREE.DoubleSide});
 const bronze=new THREE.MeshStandardMaterial({color:0x957c5d,metalness:.7,roughness:.45});
 const eye=new THREE.MeshBasicMaterial({color:0xff7a45});
 const box=(parent:THREE.Object3D,w:number,h:number,d:number,x:number,y:number,z:number,mat:THREE.Material)=>{const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mat);m.position.set(x,y,z);parent.add(m);return m;};
 const body=new THREE.Mesh(new THREE.CylinderGeometry(.35,.48,.9,8),armor);body.position.y=1.45;group.add(body);
 const cape=new THREE.Mesh(new THREE.ConeGeometry(.67,1.1,8,1,true),cloth);cape.position.y=.85;group.add(cape);
 const head=new THREE.Mesh(new THREE.IcosahedronGeometry(.34,1),armor);head.position.y=2.1;group.add(head);box(group,.4,.07,.04,0,2.13,.31,eye);
 const crown=new THREE.Mesh(new THREE.TorusGeometry(.3,.035,6,20),bronze);crown.rotation.x=Math.PI/2;crown.position.y=2.3;group.add(crown);
 for(const side of [-1,1]){const shoulder=new THREE.Mesh(new THREE.SphereGeometry(.22,10,8),bronze);shoulder.scale.set(1.35,.7,1);shoulder.position.set(side*.47,1.78,0);group.add(shoulder);}
 const leftArm=new THREE.Group();leftArm.position.set(-.5,1.72,0);box(leftArm,.18,.7,.2,0,-.35,0,armor);group.add(leftArm);
 const rightArm=new THREE.Group();rightArm.position.set(.5,1.72,0);box(rightArm,.18,.7,.2,0,-.35,0,armor);const sword=box(rightArm,.07,1.15,.08,.04,-.85,.12,bronze);sword.rotation.z=-.18;group.add(rightArm);
 const leftLeg=new THREE.Group();leftLeg.position.set(-.22,.72,0);box(leftLeg,.2,.68,.23,0,-.34,0,armor);group.add(leftLeg);
 const rightLeg=new THREE.Group();rightLeg.position.set(.22,.72,0);box(rightLeg,.2,.68,.23,0,-.34,0,armor);group.add(rightLeg);
 if(type==='warden'){for(const side of [-1,1]){const horn=new THREE.Mesh(new THREE.ConeGeometry(.09,.6,7),bronze);horn.position.set(side*.26,2.55,0);horn.rotation.z=side*-.35;group.add(horn);}group.scale.setScalar(1.3);}
 const tell=new THREE.Mesh(new THREE.TorusGeometry(.85,.05,6,30),new THREE.MeshBasicMaterial({color:0xf65738}));tell.rotation.x=-Math.PI/2;tell.position.y=.04;tell.visible=false;group.add(tell);
 const barBack=box(group,.85,.09,.025,0,2.65,0,cloth);const bar=box(group,.8,.055,.03,0,2.65,.02,new THREE.MeshBasicMaterial({color:0xe6a475}));
 return {group,body,tell,bar,barBack,rightArm,leftArm,leftLeg,rightLeg};
}
export function disposeWorld(root:THREE.Object3D){const geometries=new Set<THREE.BufferGeometry>(),materials=new Set<THREE.Material>();root.traverse(o=>{if(o instanceof THREE.Mesh||o instanceof THREE.Points){geometries.add(o.geometry);(Array.isArray(o.material)?o.material:[o.material]).forEach((m:THREE.Material)=>materials.add(m));}});geometries.forEach(g=>g.dispose());materials.forEach(m=>{if(m instanceof THREE.MeshStandardMaterial||m instanceof THREE.MeshBasicMaterial){if(m.map)m.map.dispose();}m.dispose();});}
