// Curated placements, separate from the gameplay collision map.
// All decorative assets stay outside the walkable |x| <= 10.3 corridor.
const add=(asset,x,z,height,rotation=0)=>({asset,x,z,height,rotation});
export const VEIL_LAYOUTS = [
 [
  ...[-1,1].flatMap(s=>[-2,-11,-20,-27].map((z,i)=>add(`dungeon/${i%2?'pillar_decorated':'pillar'}.gltf.glb`,s*12.5,z,5.5))),
  ...[-1,1].flatMap(s=>[-6,-17,-25].map((z,i)=>add(`nature/${['rock_largeA','rock_largeC','rock_tallA'][i]}.glb`,s*15,z,2.7))),
  add('dungeon/wall_broken.gltf.glb',-14,-8,3,1.4),add('dungeon/wall_cracked.gltf.glb',14,-23,3,-1.4),
  add('nature/grass_large.glb',-12,-6,.8),add('nature/grass.glb',13,-16,.7),add('dungeon/rubble_large.gltf.glb',-13,-22,.85),
  add('dungeon/torch_lit.gltf.glb',-12,-11,2.1),add('dungeon/torch_lit.gltf.glb',12,-20,2.1),
 ],
 [
  ...[-1,1].flatMap(s=>[-2,-10,-18,-26].map((z,i)=>add(`dungeon/${i%2?'wall_shelves':'shelves'}.gltf.glb`,s*12.8,z,4.3,s>0?-Math.PI/2:Math.PI/2))),
  ...[-1,1].flatMap(s=>[-5,-15,-24].map(z=>add('dungeon/pillar_decorated.gltf.glb',s*11.7,z,5))),
  add('dungeon/table_long_decorated_A.gltf.glb',-13,-5,1.5),add('dungeon/table_long_tablecloth.gltf.glb',13,-15,1.5),
  add('dungeon/candle_triple.gltf.glb',-11.5,-17,1),add('dungeon/box_stacked.gltf.glb',13,-25,1.7),add('dungeon/barrel_large_decorated.gltf.glb',-12,-24,1.4),
  add('dungeon/banner_patternA_red.gltf.glb',-13,-9,3),add('dungeon/banner_patternA_brown.gltf.glb',13,-18,3),
 ],
 [
  ...[-1,1].flatMap(s=>[-1,-8,-16,-24].map((z,i)=>add(`nature/${['tree_oak','tree_default','tree_detailed','tree_oak_fall'][i]}.glb`,s*14,z,6.5,i*.6))),
  ...[-1,1].flatMap(s=>[-4,-12,-21,-27].map((z,i)=>add(`nature/${['plant_bushLarge','rock_largeC','plant_bush','rock_largeA'][i]}.glb`,s*12.3,z,1.7))),
  add('nature/flower_purpleA.glb',-11.5,-7,.7),add('nature/flower_yellowA.glb',11.5,-11,.7),add('nature/flower_redA.glb',-11.5,-18,.7),
  add('dungeon/pillar_decorated.gltf.glb',12,-24,4),add('dungeon/rubble_large.gltf.glb',-12,-25,.9),
 ],
];
export const VEIL_CHARACTER_ASSETS={hunter:'skeleton/Skeleton_Rogue.glb',guard:'skeleton/Skeleton_Warrior.glb',warden:'skeleton/Skeleton_Mage.glb'};
