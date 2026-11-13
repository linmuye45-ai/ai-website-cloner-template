import * as THREE from 'three';
import { GLTFLoader, type GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { clone as cloneSkeleton } from 'three/examples/jsm/utils/SkeletonUtils.js';
import { VEIL_LAYOUTS, VEIL_CHARACTER_ASSETS } from '@/lib/veil-asset-layout.mjs';

const assetUrl=(path:string)=>new URL(`../models/veil/${path}`,document.baseURI).toString();
type Placement={asset:string;x:number;z:number;height:number;rotation:number};
type Character={group:THREE.Group;tell:THREE.Mesh;bar:THREE.Mesh;barBack:THREE.Mesh};

// Stage-scoped cache shares GPU resources across repeats and is discarded with the stage.
export function mountWorldAssets(root:THREE.Group, fallback:THREE.Group, index:number) {
 const loader=new GLTFLoader();const layout=VEIL_LAYOUTS[index] as Placement[];
 const paths=[...new Set(layout.map(p=>p.asset))];
 root.userData.veilAssets='loading';
 void Promise.allSettled(paths.map(async p=>[p,await loader.loadAsync(assetUrl(p))] as const)).then(results=>{
  const entries=results.flatMap(r=>r.status==='fulfilled'?[r.value]:[]);const failed=results.some(r=>r.status==='rejected');
  if(root.userData.veilDisposed||failed){entries.forEach(([,g])=>disposeLoaded(g.scene));if(!root.userData.veilDisposed){console.error('Environment models failed; procedural fallback retained');root.userData.veilAssets='fallback';}return;}
  const models=new Map(entries);const group=new THREE.Group();group.name='licensed-environment';
  for(const item of layout){const source=models.get(item.asset);if(!source)continue;const object=source.scene.clone(true);const bounds=new THREE.Box3().setFromObject(object),size=bounds.getSize(new THREE.Vector3());const scale=item.height/Math.max(size.y,.01);object.scale.multiplyScalar(scale);const scaled=new THREE.Box3().setFromObject(object),center=scaled.getCenter(new THREE.Vector3());object.position.x-=center.x;object.position.y-=scaled.min.y;object.position.z-=center.z;const wrapper=new THREE.Group();wrapper.position.set(item.x,0,item.z);wrapper.rotation.y=item.rotation;wrapper.add(object);group.add(wrapper);}
  root.add(group);fallback.visible=false;root.userData.veilAssets='ready';root.userData.veilAssetInstances=layout.length;
 });
}

export function mountCharacters(enemies:Character[],types:string[]) {
 const loader=new GLTFLoader();const cache=new Map<string,Promise<GLTF>>();
 enemies.forEach((enemy,i)=>{const path=VEIL_CHARACTER_ASSETS[types[i] as keyof typeof VEIL_CHARACTER_ASSETS];if(!path)return;let pending=cache.get(path);if(!pending){pending=loader.loadAsync(assetUrl(path));cache.set(path,pending);}void pending.then(gltf=>{
  if(enemy.group.userData.veilDisposed){disposeLoaded(gltf.scene);return;}
  const rig=cloneSkeleton(gltf.scene);const box=new THREE.Box3().setFromObject(rig);const height=box.getSize(new THREE.Vector3()).y;const scale=2.3/Math.max(height,.01);rig.scale.multiplyScalar(scale);const adjusted=new THREE.Box3().setFromObject(rig);rig.position.y-=adjusted.min.y;
  // Keep the gameplay telegraph and health bars, replace only the primitive character.
  for(const child of enemy.group.children){if(child!==enemy.tell&&child!==enemy.bar&&child!==enemy.barBack)child.visible=false;}
  enemy.group.add(rig);const mixer=new THREE.AnimationMixer(rig);enemy.group.userData.animation={mixer,clips:gltf.animations,current:'',action:null};enemy.group.userData.licensedCharacter=true;
 }).catch(error=>{if(!enemy.group.userData.veilDisposed)console.error('Character model failed; fallback retained',error);});});
}
export function animateCharacter(group:THREE.Group,state:string,dt:number,slowed:boolean){const data=group.userData.animation as {mixer:THREE.AnimationMixer;clips:THREE.AnimationClip[];current:string;action:THREE.AnimationAction|null}|undefined;if(!data)return;const name=state==='windup'?'1H_Melee_Attack_Chop':state==='stagger'?'Hit_A':state==='chase'?'Walking_A':'Idle_Combat';if(name!==data.current){const clip=data.clips.find(c=>c.name===name);if(clip){const next=data.mixer.clipAction(clip);if(data.action)data.action.fadeOut(.15);next.reset().fadeIn(.15).play();data.action=next;data.current=name;}}data.mixer.update(dt*(slowed?.24:1));}
function disposeLoaded(root:THREE.Object3D){root.traverse(o=>{if(o instanceof THREE.Mesh){o.geometry.dispose();const materials=Array.isArray(o.material)?o.material:[o.material];materials.forEach(m=>{if('map' in m && m.map instanceof THREE.Texture)m.map.dispose();m.dispose();});}});}
