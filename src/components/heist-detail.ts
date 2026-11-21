import * as THREE from 'three';
// All meshes are geometry: no flat painted backdrops or external model claims.
const metal=new THREE.MeshStandardMaterial({color:0xb89760,metalness:.65,roughness:.38});
const stone=new THREE.MeshStandardMaterial({color:0x818c91,roughness:.9});
const panel=new THREE.MeshStandardMaterial({color:0x263345,roughness:.85});
const red=new THREE.MeshStandardMaterial({color:0xbd635c,roughness:.7});
const clay=new THREE.MeshStandardMaterial({color:0xedc19b,roughness:.38});
const glow=new THREE.MeshStandardMaterial({color:0x8fdce8,emissive:0x267b8a,emissiveIntensity:.8,roughness:.3,metalness:.2});
function addMesh(parent:THREE.Object3D,geometry:THREE.BufferGeometry,material:THREE.Material,x:number,y:number,z:number){const mesh=new THREE.Mesh(geometry,material);mesh.position.set(x,y,z);parent.add(mesh);return mesh;}
export function decorateMuseum(scene:THREE.Scene){const root=new THREE.Group();scene.add(root);
 const box=(x:number,y:number,z:number,w:number,h:number,d:number,m=panel)=>addMesh(root,new THREE.BoxGeometry(w,h,d),m,x,y,z);
 // Displays stay outside the player bounds; there are no hidden collisions.
 for(const side of [-1,1])for(const z of [-8,-4,0,4,8]){const x=side*9.75;box(x,2.4,z,.35,4.8,.42,stone);box(x,.22,z,.65,.44,.7,metal);box(x,4.65,z,.75,.2,.72,metal);for(const dz of [-.22,.22])box(x-side*.21,2.45,z+dz,.06,3.9,.04,metal);}
 for(const side of [-1,1]){box(side*9.8,4.8,0,.24,.25,20,metal);box(side*9.82,3.9,0,.18,.14,20,metal);}box(0,5.1,-9.9,20,.35,.35,stone);box(0,5.1,9.9,20,.35,.35,stone);
 for(const z of [-7,-1,5]){box(0,5.4,z,19.6,.16,.24,stone);const chandelier=new THREE.Group();chandelier.position.set(0,5.1,z);root.add(chandelier);const ring=addMesh(chandelier,new THREE.TorusGeometry(.7,.05,8,40),metal,0,-.4,0);ring.rotation.x=Math.PI/2;addMesh(chandelier,new THREE.CylinderGeometry(.025,.025,.8,12),metal,0,-.4,0);for(let i=0;i<6;i++){const angle=i*Math.PI/3;addMesh(chandelier,new THREE.SphereGeometry(.085,16,12),glow,Math.cos(angle)*.7,-.42,Math.sin(angle)*.7);}}
 // Raised exhibition panels and inlays make the hall legible from the spawn.
 for(const x of [-7,-3,3,7]){box(x,2.6,-9.72,2.6,2.4,.12,metal);box(x,2.6,-9.61,2.37,2.17,.1,x===-3||x===3?red:panel);box(x,1.3,-9.55,1.1,.1,.12,metal);}
 const floorRing=addMesh(root,new THREE.TorusGeometry(4,.035,8,64),metal,0,.025,-2);floorRing.rotation.x=Math.PI/2;
 return root;
}
export function makeArtifact(id:number){const g=new THREE.Group();
 if(id===0){const pts=[new THREE.Vector2(0,0),new THREE.Vector2(.35,.03),new THREE.Vector2(.48,.2),new THREE.Vector2(.53,.48),new THREE.Vector2(.45,.78),new THREE.Vector2(.23,1.04),new THREE.Vector2(.2,1.18),new THREE.Vector2(.3,1.25)];addMesh(g,new THREE.LatheGeometry(pts,48),clay,0,.15,0);for(const y of [.28,.52,.81,1.27]){const r=y===.28?.45:y===.52?.53:y===.81?.45:.3;const ring=addMesh(g,new THREE.TorusGeometry(r,.025,8,48),metal,0,y,0);ring.rotation.x=Math.PI/2;}}
 else if(id===1){const pts=[new THREE.Vector2(.45,0),new THREE.Vector2(.57,.12),new THREE.Vector2(.45,.22),new THREE.Vector2(.4,.6),new THREE.Vector2(.22,.95),new THREE.Vector2(.1,1.08)];addMesh(g,new THREE.LatheGeometry(pts,48),metal,0,.25,0);addMesh(g,new THREE.SphereGeometry(.12,24,16),red,0,.22,0);const ring=addMesh(g,new THREE.TorusGeometry(.15,.04,12,32),metal,0,1.5,0);ring.rotation.y=Math.PI/2;}
 else{const shard=addMesh(g,new THREE.IcosahedronGeometry(.62,2),glow,0,.88,0);shard.scale.set(.75,1.35,.75);for(const angle of [0,Math.PI/2]){const ring=addMesh(g,new THREE.TorusGeometry(.72,.035,10,48),metal,0,.9,0);ring.rotation.set(.7,angle,.35);}addMesh(g,new THREE.CylinderGeometry(.28,.45,.2,32),metal,0,.12,0);}
 return g;
}
