import * as THREE from 'three';
import { GLTFLoader, type GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { clone as cloneSkeleton } from 'three/examples/jsm/utils/SkeletonUtils.js';
import { MeshoptDecoder } from 'meshoptimizer/decoder';
import { VEIL_LAYOUTS, VEIL_CHARACTER_ASSETS } from '@/lib/veil-asset-layout.mjs';
const url=(path:string)=>new URL(`../models/veil/${path}`,document.baseURI).toString();
type Placement={asset:string;x:number;z:number;height:number;rotation:number};
type Character={group:THREE.Group;body:THREE.Mesh;tell:THREE.Mesh;bar:THREE.Mesh;barBack:THREE.Mesh};
function loader(){return new GLTFLoader().setMeshoptDecoder(MeshoptDecoder);}
// No bitmap surfaces or image-backed scenery: imported meshes keep their geometry,
// skeletons and animation, but every image material channel is disconnected.
function useSculptedMaterials(root:THREE.Object3D,kind:'rock'|'body'|'coat'|'boots'|'jeans'){
 const seen=new Set<THREE.Material>();const maps=new Set<THREE.Texture>();
 root.traverse(o=>{if(!(o instanceof THREE.Mesh))return;for(const material of (Array.isArray(o.material)?o.material:[o.material])){
  if(seen.has(material))continue;seen.add(material);const m=material as THREE.MeshStandardMaterial;
  for(const key of ['map','normalMap','roughnessMap','metalnessMap','aoMap','emissiveMap','alphaMap','bumpMap','displacementMap'] as const){const t=m[key];if(t instanceof THREE.Texture){maps.add(t);m[key]=null;}}
  if(m.color)m.color.setHex(kind==='rock'?0x65736a:kind==='body'?0xaaa399:kind==='coat'?0x35403b:kind==='jeans'?0x343c3a:0x242e2b);
  m.roughness=kind==='rock'?.95:.78;m.metalness=kind==='rock'?0:.16;m.needsUpdate=true;
 }});maps.forEach(t=>t.dispose());
}
function equip(rig:THREE.Object3D){
 const hand=rig.getObjectByName('hand_r');if(!hand)return;
 const metal=new THREE.MeshStandardMaterial({color:0x9b9f93,metalness:.75,roughness:.3});const brass=new THREE.MeshStandardMaterial({color:0x9b7950,metalness:.7,roughness:.38});
 const sword=new THREE.Group();sword.position.set(0,.05,0);sword.rotation.set(.1,0,-.1);
 const blade=new THREE.Mesh(new THREE.BoxGeometry(.075,.77,.018),metal);blade.position.y=.47;
 const point=new THREE.Mesh(new THREE.ConeGeometry(.044,.16,6),metal);point.position.y=.93;
 const guard=new THREE.Mesh(new THREE.CylinderGeometry(.025,.025,.28,12),brass);guard.rotation.z=Math.PI/2;guard.position.y=.08;
 const grip=new THREE.Mesh(new THREE.CylinderGeometry(.025,.03,.2,12),brass);grip.position.y=-.04;sword.add(blade,point,guard,grip);hand.add(sword);
}

function disposeLoaded(root:THREE.Object3D){root.traverse(o=>{if(o instanceof THREE.Mesh){o.geometry.dispose();(Array.isArray(o.material)?o.material:[o.material]).forEach(m=>{if('map' in m&&m.map instanceof THREE.Texture)m.map.dispose();m.dispose();});}});}
export function mountWorldAssets(root:THREE.Group,fallback:THREE.Group,index:number){
 root.userData.veilAssets='loading';const layout=VEIL_LAYOUTS[index] as Placement[];
 void loader().loadAsync(url(layout[0].asset)).then(gltf=>{
  if(root.userData.veilDisposed){disposeLoaded(gltf.scene);return;}
  useSculptedMaterials(gltf.scene,'rock');
  const group=new THREE.Group();group.name='photogrammetry-environment';
  for(const item of layout){const object=gltf.scene.clone(true);const bounds=new THREE.Box3().setFromObject(object),size=bounds.getSize(new THREE.Vector3());object.scale.multiplyScalar(item.height/Math.max(size.y,.01));const scaled=new THREE.Box3().setFromObject(object),center=scaled.getCenter(new THREE.Vector3());object.position.set(-center.x,-scaled.min.y,-center.z);const wrapper=new THREE.Group();wrapper.position.set(item.x,0,item.z);wrapper.rotation.y=item.rotation;wrapper.add(object);group.add(wrapper);}
  root.add(group);fallback.visible=false;root.userData.veilAssets='ready';root.userData.veilAssetInstances=layout.length;
 }).catch(error=>{if(!root.userData.veilDisposed){console.error('Scanned environment failed to load',error);root.userData.veilAssets='fallback';}});
}
export function mountCharacters(enemies:Character[]){
 const paths=Object.values(VEIL_CHARACTER_ASSETS);const l=loader();
 void Promise.allSettled(paths.map(p=>l.loadAsync(url(p)))).then(results=>{
  const loaded=results.flatMap(r=>r.status==='fulfilled'?[r.value]:[]);if(loaded.length!==paths.length){loaded.forEach(g=>disposeLoaded(g.scene));console.error('Realistic character could not be loaded');return;}
  const [body,...clothes]=loaded as GLTF[];useSculptedMaterials(body.scene,'body');(['coat','boots','jeans'] as const).forEach((kind,i)=>useSculptedMaterials(clothes[i].scene,kind));let attached=0;
  for(const enemy of enemies){if(enemy.group.userData.veilDisposed)continue;
   const rig=cloneSkeleton(body.scene);const base=rig.getObjectByName('Body');if(!(base instanceof THREE.SkinnedMesh)||!base.parent)throw Error('Missing rigged body');const bones=new Map(base.skeleton.bones.map((b,i)=>[b.name,{bone:b,inverse:base.skeleton.boneInverses[i]}]));
   for(const garment of clothes){const clothing=cloneSkeleton(garment.scene);const meshes:THREE.SkinnedMesh[]=[];clothing.traverse(o=>{if(o instanceof THREE.SkinnedMesh)meshes.push(o);});for(const mesh of meshes){const joints=mesh.skeleton.bones.map(b=>bones.get(b.name));if(joints.some(b=>!b))throw Error(`Missing clothing joints for ${mesh.name}`);mesh.removeFromParent();mesh.position.copy(base.position);mesh.quaternion.copy(base.quaternion);mesh.scale.copy(base.scale);base.parent.add(mesh);mesh.bind(new THREE.Skeleton(joints.map(j=>j!.bone),joints.map(j=>j!.inverse)),base.bindMatrix);mesh.frustumCulled=false;}}
   equip(rig);const materials:THREE.MeshStandardMaterial[]=[];rig.traverse(o=>{if(!(o instanceof THREE.Mesh))return;const cloned=(Array.isArray(o.material)?o.material:[o.material]).map(m=>m.clone());o.material=Array.isArray(o.material)?cloned:cloned[0];for(const m of cloned)if(m instanceof THREE.MeshStandardMaterial)materials.push(m);});const bounds=new THREE.Box3().setFromObject(rig);const height=bounds.getSize(new THREE.Vector3()).y;rig.scale.multiplyScalar(2.3/Math.max(height,.01));const adjusted=new THREE.Box3().setFromObject(rig);rig.position.y-=adjusted.min.y;
   enemy.group.add(rig);enemy.body.visible=false;const mixer=new THREE.AnimationMixer(rig);enemy.group.userData.animation={mixer,clips:body.animations,current:'',action:null,arm:rig.getObjectByName('upperarm_r'),materials};enemy.group.userData.licensedCharacter=true;attached++;
  }
  if(!attached)loaded.forEach(g=>disposeLoaded(g.scene));
 }).catch(error=>console.error('Character setup failed',error));
}
export function animateCharacter(group:THREE.Group,state:string,dt:number,slowed:boolean,timer:number,flash:number){
 const data=group.userData.animation as {mixer:THREE.AnimationMixer;clips:THREE.AnimationClip[];current:string;action:THREE.AnimationAction|null;arm:THREE.Object3D|undefined;materials:THREE.MeshStandardMaterial[]}|undefined;if(!data)return;
 const name=state==='chase'?'walk':state==='stagger'?'idle_look':'idle';
 if(name!==data.current){const clip=data.clips.find(c=>c.name===name);if(clip){const next=data.mixer.clipAction(clip);if(data.action)data.action.fadeOut(.15);next.reset().fadeIn(.15).play();data.action=next;data.current=name;}}
 data.mixer.update(dt*(slowed?.24:1));for(const m of data.materials){m.emissive.setHex(flash>0?0xf0a259:state==='windup'?0x4a1309:0x000000);m.emissiveIntensity=flash>0?.7:.28;}
 // Timed windup is driven by the combat state, rather than a decorative idle clip.
 if(data.arm&&state==='windup')data.arm.rotateX(-Math.min(1.25,Math.max(0,(.9-timer)*2.2)));
 if(data.arm&&state==='recover')data.arm.rotateX(-Math.max(0,timer)*.45);
}
