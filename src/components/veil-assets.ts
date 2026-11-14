import * as THREE from 'three';
import { GLTFLoader, type GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { clone as cloneSkeleton } from 'three/examples/jsm/utils/SkeletonUtils.js';
import { MeshoptDecoder } from 'meshoptimizer/decoder';
import { VEIL_LAYOUTS, VEIL_CHARACTER_ASSETS } from '@/lib/veil-asset-layout.mjs';
const url=(path:string)=>new URL(`../models/veil/${path}`,document.baseURI).toString();
type Placement={asset:string;x:number;z:number;height:number;rotation:number};
type Character={group:THREE.Group;body:THREE.Mesh;tell:THREE.Mesh;bar:THREE.Mesh;barBack:THREE.Mesh};
function loader(){return new GLTFLoader().setMeshoptDecoder(MeshoptDecoder);}
function disposeLoaded(root:THREE.Object3D){root.traverse(o=>{if(o instanceof THREE.Mesh){o.geometry.dispose();(Array.isArray(o.material)?o.material:[o.material]).forEach(m=>{if('map' in m&&m.map instanceof THREE.Texture)m.map.dispose();m.dispose();});}});}
export function mountWorldAssets(root:THREE.Group,fallback:THREE.Group,index:number){
 root.userData.veilAssets='loading';const layout=VEIL_LAYOUTS[index] as Placement[];
 void loader().loadAsync(url(layout[0].asset)).then(gltf=>{
  if(root.userData.veilDisposed){disposeLoaded(gltf.scene);return;}
  const group=new THREE.Group();group.name='photogrammetry-environment';
  for(const item of layout){const object=gltf.scene.clone(true);const bounds=new THREE.Box3().setFromObject(object),size=bounds.getSize(new THREE.Vector3());object.scale.multiplyScalar(item.height/Math.max(size.y,.01));const scaled=new THREE.Box3().setFromObject(object),center=scaled.getCenter(new THREE.Vector3());object.position.set(-center.x,-scaled.min.y,-center.z);const wrapper=new THREE.Group();wrapper.position.set(item.x,0,item.z);wrapper.rotation.y=item.rotation;wrapper.add(object);group.add(wrapper);}
  root.add(group);fallback.visible=false;root.userData.veilAssets='ready';root.userData.veilAssetInstances=layout.length;
 }).catch(error=>{if(!root.userData.veilDisposed){console.error('Scanned environment failed to load',error);root.userData.veilAssets='fallback';}});
}
export function mountCharacters(enemies:Character[]){
 const paths=Object.values(VEIL_CHARACTER_ASSETS);const l=loader();
 void Promise.allSettled(paths.map(p=>l.loadAsync(url(p)))).then(results=>{
  const loaded=results.flatMap(r=>r.status==='fulfilled'?[r.value]:[]);if(loaded.length!==paths.length){loaded.forEach(g=>disposeLoaded(g.scene));console.error('Realistic character could not be loaded');return;}
  const [body,...clothes]=loaded as GLTF[];let attached=0;
  for(const enemy of enemies){if(enemy.group.userData.veilDisposed)continue;
   const rig=cloneSkeleton(body.scene);const base=rig.getObjectByName('Body');if(!(base instanceof THREE.SkinnedMesh)||!base.parent)throw Error('Missing rigged body');const bones=new Map(base.skeleton.bones.map((b,i)=>[b.name,{bone:b,inverse:base.skeleton.boneInverses[i]}]));
   for(const garment of clothes){const clothing=cloneSkeleton(garment.scene);const meshes:THREE.SkinnedMesh[]=[];clothing.traverse(o=>{if(o instanceof THREE.SkinnedMesh)meshes.push(o);});for(const mesh of meshes){const joints=mesh.skeleton.bones.map(b=>bones.get(b.name));if(joints.some(b=>!b))throw Error(`Missing clothing joints for ${mesh.name}`);mesh.removeFromParent();mesh.position.copy(base.position);mesh.quaternion.copy(base.quaternion);mesh.scale.copy(base.scale);base.parent.add(mesh);mesh.bind(new THREE.Skeleton(joints.map(j=>j!.bone),joints.map(j=>j!.inverse)),base.bindMatrix);mesh.frustumCulled=false;}}
   const bounds=new THREE.Box3().setFromObject(rig);const height=bounds.getSize(new THREE.Vector3()).y;rig.scale.multiplyScalar(2.3/Math.max(height,.01));const adjusted=new THREE.Box3().setFromObject(rig);rig.position.y-=adjusted.min.y;
   enemy.group.add(rig);enemy.body.visible=false;const mixer=new THREE.AnimationMixer(rig);enemy.group.userData.animation={mixer,clips:body.animations,current:'',action:null};enemy.group.userData.licensedCharacter=true;attached++;
  }
  if(!attached)loaded.forEach(g=>disposeLoaded(g.scene));
 }).catch(error=>console.error('Character setup failed',error));
}
export function animateCharacter(group:THREE.Group,state:string,dt:number,slowed:boolean){const data=group.userData.animation as {mixer:THREE.AnimationMixer;clips:THREE.AnimationClip[];current:string;action:THREE.AnimationAction|null}|undefined;if(!data)return;const name=state==='chase'?'walk':state==='windup'?'idle_fidget':state==='stagger'?'idle_look':'idle';if(name!==data.current){const clip=data.clips.find(c=>c.name===name);if(clip){const next=data.mixer.clipAction(clip);if(data.action)data.action.fadeOut(.15);next.reset().fadeIn(.15).play();data.action=next;data.current=name;}}data.mixer.update(dt*(slowed?.24:1));}
