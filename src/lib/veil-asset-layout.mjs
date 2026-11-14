// Photogrammetry, positioned outside the walkable corridor. Gameplay collision is independent.
const add=(x,z,height,rotation=0)=>({asset:'real/rock-moss-set-01.glb',x,z,height,rotation});
export const VEIL_LAYOUTS=[
 [...[-1,1].flatMap(s=>[-2,-10,-18,-26].map((z,i)=>add(s*13.8,z,2.2+i*.22,i*1.1)))],
 [...[-1,1].flatMap(s=>[-3,-12,-21,-27].map((z,i)=>add(s*14,z,1.8+i*.15,i*.9)))],
 [...[-1,1].flatMap(s=>[-1,-9,-17,-25].map((z,i)=>add(s*13.5,z,2.0+i*.2,i*1.2)))],
];
export const VEIL_CHARACTER_ASSETS={body:'real/body.glb',coat:'real/coat.glb',boots:'real/boots.glb',jeans:'real/jeans.glb'};
