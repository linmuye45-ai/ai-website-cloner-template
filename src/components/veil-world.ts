import * as THREE from 'three';
import { CHAPTERS } from '@/lib/veil-game.mjs';
import { mountWorldAssets } from './veil-assets';

// Geometry is deliberately laid out from the same circular obstacles as the rules.
// Columns sit beyond the playable boundary; no decorative geometry blocks the route.
export function makeWorld(index:number) {
 const cfg=CHAPTERS[index];const root=new THREE.Group();
 const palette=[{floor:0x354746,stone:0x485552,dark:0x273834,accent:0xe6ab6d},{floor:0x383b36,stone:0x515248,dark:0x282e29,accent:0xe2b670},{floor:0x405040,stone:0x62634f,dark:0x293a2f,accent:0xe8a384}][index];
 const stone=new THREE.MeshStandardMaterial({color:palette.stone,roughness:.95});const dark=new THREE.MeshStandardMaterial({color:palette.dark,roughness:.92});const floor=new THREE.MeshStandardMaterial({color:palette.floor,roughness:.85});const trim=new THREE.MeshStandardMaterial({color:0x8c7b60,metalness:.5,roughness:.5});const ember=new THREE.MeshStandardMaterial({color:palette.accent,emissive:palette.accent,emissiveIntensity:1.4});const ghost=new THREE.MeshStandardMaterial({color:0x9be1d1,emissive:0x55c6ae,emissiveIntensity:1.7});const wood=new THREE.MeshStandardMaterial({color:0x4a3629,roughness:1});
 // Far backdrop is a painterly environment plate; collision and combat remain fully 3D.
 const texture=new THREE.TextureLoader().load(new URL(`../images/veil-${['shore','archive','garden'][index]}.jpg`, document.baseURI).toString());texture.colorSpace=THREE.SRGBColorSpace;
 const panorama=new THREE.Mesh(new THREE.PlaneGeometry(160,76),new THREE.MeshBasicMaterial({map:texture,fog:false}));panorama.position.set(0,21,-59);root.add(panorama);
 const groundTexture=new THREE.TextureLoader().load(new URL('../images/veil-ground-stone.jpg',document.baseURI).toString());groundTexture.colorSpace=THREE.SRGBColorSpace;groundTexture.wrapS=groundTexture.wrapT=THREE.RepeatWrapping;groundTexture.repeat.set(12,14);floor.map=groundTexture;floor.color.setHex(0x999f95);
 const box=(parent:THREE.Object3D,w:number,h:number,d:number,mat:THREE.Material,x:number,y:number,z:number)=>{const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mat);m.position.set(x,y,z);parent.add(m);return m;};
 const ground=new THREE.Mesh(new THREE.PlaneGeometry(95,110),floor);ground.rotation.x=-Math.PI/2;ground.position.y=-.06;root.add(ground);
 // Inlaid stone slabs sit above the floor rather than overlapping it.
 for(let z=3;z>=-30;z-=3.5){box(root,15,.025,.045,dark,0,-.025,z);for(let x=-6;x<=6;x+=3)box(root,.045,.025,3.45,dark,x,-.025,z-1.72);}
 const environmentFallback=new THREE.Group();root.add(environmentFallback);
 // The collision circles match these isolated landmarks.
 cfg.obstacles.forEach((o:{x:number;z:number;r:number})=>{const group=new THREE.Group();group.position.set(o.x,0,o.z);if(index===0){const rock=new THREE.Mesh(new THREE.SphereGeometry(o.r,32,24),stone);rock.scale.set(.85,1.55,.85);rock.position.y=o.r*1.05;group.add(rock);}
 else if(index===1){box(group,1.5,3.2,1.5,wood,0,1.6,0);for(let y=.8;y<3;y+=.65)box(group,1.55,.08,1.55,trim,0,y,0);}
 else {const trunk=new THREE.Mesh(new THREE.CylinderGeometry(.36,.65,4,32),wood);trunk.position.y=2;group.add(trunk);const canopy=new THREE.Mesh(new THREE.SphereGeometry(1.8,32,24),dark);canopy.position.y=4.2;group.add(canopy);}root.add(group);});
 const beacon=new THREE.Group();beacon.position.set(cfg.beacon.x,0,cfg.beacon.z);const base=new THREE.Mesh(new THREE.CylinderGeometry(.7,1,.35,8),stone);base.position.y=.18;const pedestal=new THREE.Mesh(new THREE.CylinderGeometry(.22,.4,1.5,8),trim);pedestal.position.y=1.1;const flame=new THREE.Mesh(new THREE.OctahedronGeometry(.35),ember);flame.position.y=2.15;const halo=new THREE.Mesh(new THREE.TorusGeometry(.55,.025,6,32),ember);halo.position.y=2.15;halo.rotation.x=Math.PI/2;beacon.add(base,pedestal,flame,halo);root.add(beacon);
 const memory=new THREE.Group();memory.position.set(cfg.memoryPos.x,0,cfg.memoryPos.z);const memoryBase=new THREE.Mesh(new THREE.CylinderGeometry(.5,.7,.3,8),stone);memoryBase.position.y=.15;const fragment=new THREE.Mesh(new THREE.IcosahedronGeometry(.38),ghost);fragment.position.y=1.25;memory.add(memoryBase,fragment);root.add(memory);
 const gate=new THREE.Group();gate.position.set(cfg.gate.x,0,cfg.gate.z);for(const side of [-1,1])box(gate,.55,3.5,.7,trim,side*3.2,1.75,0);const arch=new THREE.Mesh(new THREE.TorusGeometry(3.2,.28,8,48,Math.PI),trim);arch.position.y=3.5;gate.add(arch);const portal=new THREE.Mesh(new THREE.CircleGeometry(2.7,48),new THREE.MeshBasicMaterial({color:0x82dfc9,transparent:true,opacity:.08,side:THREE.DoubleSide,depthWrite:false}));portal.position.set(0,3.45,-.1);gate.add(portal);root.add(gate);
 // Distant sun does not intersect the playable architecture.
 const sun=new THREE.Group();sun.visible=false;sun.position.set(0,15,-60);const disk=new THREE.Mesh(new THREE.CircleGeometry(6.5,64),new THREE.MeshBasicMaterial({color:0x0b1110,side:THREE.DoubleSide}));const rim=new THREE.Mesh(new THREE.TorusGeometry(6.8,.15,8,64),ember);sun.add(disk,rim);root.add(sun);
 const dustGeo=new THREE.BufferGeometry();const positions=new Float32Array(450);let seed=index+123;const rand=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};for(let i=0;i<positions.length;i+=3){positions[i]=(rand()-.5)*27;positions[i+1]=rand()*10;positions[i+2]=rand()*40-31;}dustGeo.setAttribute('position',new THREE.BufferAttribute(positions,3));const dust=new THREE.Points(dustGeo,new THREE.PointsMaterial({color:0xc8d8c4,size:.055,transparent:true,opacity:.55}));root.add(dust);
 const lights=new THREE.Group();lights.add(new THREE.HemisphereLight(index===2?0xb5d6aa:0xb8cdc7,0x29302a,2.2));const sunLight=new THREE.DirectionalLight(0xe5d8bb,2);sunLight.position.set(-8,16,5);lights.add(sunLight);const local=new THREE.PointLight(palette.accent,18,11);local.position.set(cfg.beacon.x,3,cfg.beacon.z);lights.add(local);root.add(lights);
 mountWorldAssets(root,environmentFallback,index);
 return {root,flame,halo,fragment,portal,dust,rim,ember,ghost};
}
export function makeEnemy(type:string){
 const group=new THREE.Group();
 // The combat marker remains visible during loading; no stylised character fallback.
 const cloth=new THREE.MeshStandardMaterial({color:0x242d2a,roughness:1});
 const body=new THREE.Mesh(new THREE.SphereGeometry(.34,32,24),new THREE.MeshStandardMaterial({color:0x38423c,emissive:0x58baa7,emissiveIntensity:.8}));body.position.y=1.2;group.add(body);
 const leftArm=new THREE.Group(),rightArm=new THREE.Group(),leftLeg=new THREE.Group(),rightLeg=new THREE.Group();group.add(leftArm,rightArm,leftLeg,rightLeg);
 const box=(parent:THREE.Object3D,w:number,h:number,d:number,x:number,y:number,z:number,mat:THREE.Material)=>{const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mat);m.position.set(x,y,z);parent.add(m);return m;};
 if(type==='warden')group.scale.setScalar(1.3);
 const tell=new THREE.Mesh(new THREE.TorusGeometry(.85,.05,6,30),new THREE.MeshBasicMaterial({color:0xf65738}));tell.rotation.x=-Math.PI/2;tell.position.y=.04;tell.visible=false;group.add(tell);
 const barBack=box(group,.85,.09,.025,0,2.65,0,cloth);const bar=box(group,.8,.055,.03,0,2.65,.02,new THREE.MeshBasicMaterial({color:0xe6a475}));
 return {group,body,tell,bar,barBack,rightArm,leftArm,leftLeg,rightLeg};
}
export function disposeWorld(root:THREE.Object3D){const geometries=new Set<THREE.BufferGeometry>(),materials=new Set<THREE.Material>();root.traverse(o=>{o.userData.veilDisposed=true;if(o.userData.animation?.mixer)o.userData.animation.mixer.stopAllAction();if(o instanceof THREE.Mesh||o instanceof THREE.Points){geometries.add(o.geometry);(Array.isArray(o.material)?o.material:[o.material]).forEach((m:THREE.Material)=>materials.add(m));}});geometries.forEach(g=>g.dispose());materials.forEach(m=>{if(m instanceof THREE.MeshStandardMaterial||m instanceof THREE.MeshBasicMaterial){if(m.map)m.map.dispose();}m.dispose();});}
