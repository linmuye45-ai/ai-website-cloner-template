import * as THREE from 'three';

// Built from meshes, not backdrop cards: architectural dressing stays outside the
// rules' walkable corridor and does not introduce invisible collisions.
export function buildScenery(root:THREE.Group,chapter:number){
 const group=new THREE.Group();group.name=`scene-${['tidal-ruin','sunken-library','forgotten-garden'][chapter]}`;root.add(group);
 const stone=new THREE.MeshStandardMaterial({color:[0x697b75,0x77766a,0x777a68][chapter],roughness:.9});
 const edge=new THREE.MeshStandardMaterial({color:[0x384e4d,0x414740,0x465447][chapter],roughness:.9});
 const gold=new THREE.MeshStandardMaterial({color:0xa98453,roughness:.45,metalness:.62});
 const wood=new THREE.MeshStandardMaterial({color:0x513f32,roughness:.94});
 const leaf=new THREE.MeshStandardMaterial({color:0x667d60,roughness:1});
 const leafDark=new THREE.MeshStandardMaterial({color:0x394f40,roughness:1});
 const warm=new THREE.MeshStandardMaterial({color:0xffc17d,emissive:0xf09143,emissiveIntensity:1.7,roughness:.4});
 const place=(geo:THREE.BufferGeometry,mat:THREE.Material,x:number,y:number,z:number,rx=0,ry=0,rz=0)=>{const mesh=new THREE.Mesh(geo,mat);mesh.position.set(x,y,z);mesh.rotation.set(rx,ry,rz);group.add(mesh);return mesh;};
 const slabGeo=new THREE.BoxGeometry(1,1,1);const cylinder=new THREE.CylinderGeometry(1,1,1,24);const sphere=new THREE.SphereGeometry(1,24,16);
 const block=(x:number,y:number,z:number,w:number,h:number,d:number,mat:THREE.Material=stone)=>{const m=place(slabGeo,mat,x,y,z);m.scale.set(w,h,d);return m;};
 const column=(x:number,z:number,h:number,damaged=false)=>{
  block(x,.16,z,2.05,.32,2.05,edge);block(x,.4,z,1.75,.18,1.75,stone);
  const shaft=place(cylinder,stone,x,h/2+.4,z);shaft.scale.set(.58,h,.58);if(damaged)shaft.rotation.z=.1;
  for(const y of [.55,h*.52,h+.34]){const ring=place(cylinder,gold,x,y,z);ring.scale.set(.68,.08,.68);}
  block(x,h+.48,z,1.7,.25,1.7,stone);
 };
 // Actual stone blocks form the walkway; the gap lines are geometric, not an image.
 const tiles=new THREE.InstancedMesh(slabGeo,stone,8*16);tiles.name='3d-walkway-stones';const dummy=new THREE.Object3D();let n=0;
 for(let row=0;row<16;row++)for(let col=0;col<8;col++) {dummy.position.set(-7.1+col*2.03+(row%2)*.18,-.045,-30+row*2.4);dummy.scale.set(1.99,.08,2.33);dummy.rotation.set(0,0,0);dummy.updateMatrix();tiles.setMatrixAt(n,dummy.matrix);const light=.82+((row*13+col*7)%9)*.025;tiles.setColorAt(n,new THREE.Color(light,light,light*.98));n++;}group.add(tiles);
 // A large eclipse is actual spherical and ring geometry, in the distance.
 const eclipse=place(sphere,new THREE.MeshStandardMaterial({color:0x161d1d,roughness:1}),0,17,-54);eclipse.scale.setScalar(4.3);
 const rim=place(new THREE.TorusGeometry(4.55,.12,12,80),warm,0,17,-53.8);rim.name='eclipse-ring';
 const distant=place(new THREE.TorusGeometry(5.1,.025,8,80),gold,0,17,-54);distant.rotation.z=.2;
 // Smooth geological silhouette at multiple depths; no 2D backgrounds.
 for(const side of [-1,1])for(let i=0;i<6;i++){const m=place(sphere,edge,side*(23+i*5),-2,-14-i*11);m.scale.set(10+i*1.5,8+i*2,12);}
 if(chapter===0){
  // A procession of broken columns and arches frames the sea road.
  for(const side of [-1,1])for(const [i,z] of [3,-6,-15,-24].entries()){
   column(side*12.1,z,i===3?4.1:5.8,i===3);
   if(i<3){const arch=place(new THREE.TorusGeometry(4.5,.28,12,48,Math.PI),stone,side*12.1,6.25,z-4.5,0,Math.PI/2);arch.name='shore-arch';}
   const flame=place(sphere,warm,side*11.15,2.7,z);flame.scale.set(.14,.27,.14);
  }
  for(const side of [-1,1])for(let i=0;i<5;i++){const m=block(side*(15+i*.45),.35,-3-i*6,1.8,.6,2.8,edge);m.rotation.y=side*(i*.17);}
 }else if(chapter===1){
  // Vault and densely packed shelves: each book is 3D geometry in a single batch.
  for(const side of [-1,1])for(const z of [3,-6,-15,-24]){column(side*12.1,z,6.1);const cap=block(side*12.1,6.8,z-4.5,1.0,.42,8.5,edge);cap.rotation.z=side*.04;}
  const shelfGeo=new THREE.BoxGeometry(1,1,1);const books=new THREE.InstancedMesh(shelfGeo,wood,2*3*4*9);let count=0;
  for(const side of [-1,1])for(const z of [-3,-12,-21]){
   block(side*13.5,2.5,z,1,5,7,wood);for(let row=0;row<5;row++)block(side*12.94,.55+row*1.03,z,.26,.12,6.8,gold);
   for(let row=0;row<4;row++)for(let j=0;j<9;j++){dummy.position.set(side*12.78,1+row*1.03,z-3+j*.72);dummy.scale.set(.25,.75,.53);dummy.rotation.set(0,0,0);dummy.updateMatrix();books.setMatrixAt(count,dummy.matrix);books.setColorAt(count,new THREE.Color().setHSL(.055+((j+row)%4)*.03,.25,.18+((j*3+row)%5)*.04));count++;}
  }group.add(books);
  for(const z of [-5,-17,-26]){const chandelier=place(new THREE.TorusGeometry(1.5,.09,10,32),gold,0,6.2,z,Math.PI/2);chandelier.name='chandelier';for(let i=0;i<6;i++){const a=i*Math.PI/3;const flame=place(sphere,warm,Math.cos(a)*1.5,6.35,z+Math.sin(a)*1.5);flame.scale.set(.1,.22,.1);}}
 }else{
  // Branches and canopies have volume, so they hold their form as the player turns.
  for(const side of [-1,1])for(const [i,z] of [0,-9,-18,-27].entries()){
   const x=side*(14.1+(i%2));const trunk=place(cylinder,wood,x,2.7,z);trunk.scale.set(.46,5.4,.46);trunk.rotation.z=side*.08;
   for(let k=0;k<3;k++){const branch=place(cylinder,wood,x+side*(k-1)*.65,4.6,z+(k-1)*.5);branch.scale.set(.18,2.9,.18);branch.rotation.z=(k-1)*.65;
    const canopy=place(sphere,k%2?leafDark:leaf,x+side*(k-1)*1.45,6.4+(k%2)*.6,z+(k-1)*.8);canopy.scale.set(2.15,1.35,1.8);}
   if(i%2===0)column(side*11.8,z-4,3.6,true);
  }
  for(const side of [-1,1])for(let i=0;i<10;i++){const bloom=place(sphere,i%2?warm:leaf,side*(11.4+(i%3)*.45),.35,-1-i*2.8);bloom.scale.set(.16,.23,.16);}
 }
 // A dramatic 3D threshold beyond the playable gate.
 for(const side of [-1,1])column(side*6,-35,8);const lintel=block(0,8.7,-35,12.5,.55,1.4,stone);lintel.name='distant-threshold';
 return group;
}
