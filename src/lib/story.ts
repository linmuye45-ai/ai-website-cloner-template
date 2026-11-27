export type Trait = "tenderness" | "curiosity" | "patience";
export type Choice = { id: string; label: string; response: string; trait: Trait; weight: number };
export type Scene = { eyebrow: string; title: string; body: string; choices: Choice[] };
export type Ending = { id: string; title: string; treat: string; description: string; shareLine: string };
export type Chapter = { id: string; number: string; title: string; subtitle: string; duration: string; intro: string; scenes: Scene[]; endings: Record<Trait, Ending> };
export type Traits = Record<Trait, number>;
export const emptyTraits: Traits = { tenderness: 0, curiosity: 0, patience: 0 };

export const chapters: Chapter[] = [
{
 id:"tomorrow-cloud",number:"01",title:"The Tomorrow Cloud",subtitle:"A small thing that feels bigger after dark",duration:"3 min",
 intro:"A little cloud arrives at the Dream Station carrying a list of things that can wait until morning. It is trying very hard not to rain.",
 scenes:[
  {eyebrow:"THE NIGHT WINDOW",title:"A cloud with a long list",body:"The cloud is no bigger than a teacup, but it has brought a very long list. The ink has run into little blue rivers. KURU looks at it, then at the empty shelf beside the window.",choices:[
   {id:"hold",label:"Hold the cloud gently",response:"KURU cups the cloud in both paws. It stops trembling. A little warmth returns to its edges.",trait:"tenderness",weight:2},
   {id:"ask",label:"Ask what it is protecting",response:"A tiny star peeks out from behind the list. The cloud was keeping it safe from the wind.",trait:"curiosity",weight:2},
   {id:"shelf",label:"Make room on the quiet shelf",response:"KURU clears one small space. The cloud lets out a breath it has been holding all evening.",trait:"patience",weight:2}
  ]},
  {eyebrow:"THE PAPER STAIR",title:"One line keeps glowing",body:"Most of the list has gone pale. One line still glows: “Remember this tomorrow.” KURU cannot tell whether it is a reminder or a worry wearing a reminder's coat.",choices:[
   {id:"fold",label:"Fold the line into a small envelope",response:"The words fit. They do not disappear; they simply stop taking up the whole sky.",trait:"patience",weight:1},
   {id:"listen",label:"Listen for the little star",response:"The star gives one quiet blink. Being remembered is not the same as being solved.",trait:"tenderness",weight:1},
   {id:"turn",label:"Turn the paper toward the moon",response:"Under moonlight, the line becomes smaller. It was written in a very large hand.",trait:"curiosity",weight:1}
  ]},
  {eyebrow:"THE LAST BELL",title:"The cloud is ready to rest",body:"The station bell rings once. The cloud is lighter now. KURU can turn what remains into one small dream treat for the morning shelf.",choices:[
   {id:"warm",label:"Warm it between two paws",response:"A soft golden glow settles in the middle of the cloud.",trait:"tenderness",weight:1},
   {id:"name",label:"Give it a kinder name",response:"The cloud is no longer called “Everything”. It is called “One Thing, Later”.",trait:"curiosity",weight:1},
   {id:"rest",label:"Let it rest without a label",response:"The cloud curls up on the shelf. For once, nothing asks it to explain itself.",trait:"patience",weight:1}
  ]}
 ],
 endings:{
  tenderness:{id:"warm-pouch",title:"A Warm Little Pouch",treat:"A pocket of moon-warmth",description:"KURU folds the cloud into a soft oat-coloured pouch. It can hold one small thought until daylight. Nothing has been erased; it has simply been given a gentler place to sit.",shareLine:"Tonight, I gave one small worry a softer place to sit."},
  curiosity:{id:"little-lantern",title:"The Little Lantern",treat:"A star with room to breathe",description:"The hidden star becomes a tiny lantern. It does not show the whole road. It only makes the next step easier to see.",shareLine:"Tonight, I found a little light inside a very ordinary worry."},
  patience:{id:"moon-envelope",title:"The Moon Envelope",treat:"A note for tomorrow",description:"The cloud becomes an envelope and waits on the quiet shelf. Tomorrow can open it. Tonight does not have to.",shareLine:"Tonight, I put one unfinished thing somewhere safe for tomorrow."}
 }
},
{
 id:"sour-star",number:"02",title:"The Sour Star",subtitle:"A star that forgot how to shine",duration:"3 min",
 intro:"A small star has fallen into the tea tin. It tastes of lemon peel and says it has been trying to shine for everyone at once.",
 scenes:[
  {eyebrow:"THE TEA ROOM",title:"A very sour star",body:"KURU lifts the star from the tin. It makes a face so sour that both lavender ears curl at the tips. The star says it has been bright for so long that it has forgotten how to rest.",choices:[
   {id:"sip",label:"Offer it warm milk",response:"The star takes one careful sip. Its light becomes softer, like a lamp behind a curtain.",trait:"tenderness",weight:2},
   {id:"why",label:"Ask when it last rested",response:"The star counts the nights on its tiny points. It loses count, then laughs at itself.",trait:"curiosity",weight:2},
   {id:"wait",label:"Sit beside it in silence",response:"For a little while, nobody asks the star to sparkle. The room feels larger.",trait:"patience",weight:2}
  ]},
  {eyebrow:"THE SUGAR DRAWER",title:"A brightness of its own",body:"Inside the drawer are three things: a honey crumb, a blank label, and a little bell. The star may choose what to carry into the next night.",choices:[
   {id:"honey",label:"Share the honey crumb",response:"The star discovers that a small sweetness can be enough for one evening.",trait:"tenderness",weight:1},
   {id:"blank",label:"Leave the label blank",response:"The star likes the idea of not having to explain its light.",trait:"curiosity",weight:1},
   {id:"bell",label:"Keep the bell for later",response:"The bell can ring when the star is ready, not when the sky demands it.",trait:"patience",weight:1}
  ]},
  {eyebrow:"THE WINDOW SEAT",title:"A smaller kind of shine",body:"The star climbs onto the window seat. Outside, the moon is not trying to outshine anything. KURU waits for the star to decide what kind of light feels right.",choices:[
   {id:"glow",label:"Let it glow softly",response:"The star becomes a warm dot of light, easy to keep nearby.",trait:"tenderness",weight:1},
   {id:"wander",label:"Let it explore the dark",response:"The star finds a new constellation made of spaces between things.",trait:"curiosity",weight:1},
   {id:"pause",label:"Let it switch off for a moment",response:"The dark is kind. When the star returns, it is still itself.",trait:"patience",weight:1}
  ]}
 ],
 endings:{
  tenderness:{id:"honey-star",title:"The Honey Star",treat:"A little sweetness, shared",description:"KURU makes a honey-glazed star that gives off a soft, steady warmth. It is not the brightest thing in the sky. It is bright enough for the windowsill.",shareLine:"Tonight, I let a small light be enough."},
  curiosity:{id:"new-constellation",title:"A New Constellation",treat:"A map made of quiet spaces",description:"The star finds a pattern no one has named before. It learns that a different way of shining can still belong to the same sky.",shareLine:"Tonight, I found a new shape in the spaces between things."},
  patience:{id:"resting-bell",title:"The Resting Bell",treat:"A bell that rings only when ready",description:"KURU hangs the little bell beside the window. The star can ring it when it wants company. Silence is allowed, too.",shareLine:"Tonight, I remembered that rest is part of the rhythm."}
 }
},
{
 id:"quiet-shelf",number:"03",title:"The Quiet Shelf",subtitle:"A place for things that are not finished",duration:"4 min",
 intro:"The quiet shelf is full. Some thoughts are old, some are new, and a few are simply waiting for someone to notice them.",
 scenes:[
  {eyebrow:"THE BACK ROOM",title:"A shelf with no more room",body:"KURU opens the back room and finds a shelf crowded with tiny boxes. None of them are dangerous. They are just things that have not found their right time yet.",choices:[
   {id:"sort",label:"Make a little room for each box",response:"KURU moves slowly. Every box gets a place, even if the place is temporary.",trait:"patience",weight:2},
   {id:"open",label:"Open one box together",response:"Inside is a small paper boat. It has been waiting for a river, not an answer.",trait:"curiosity",weight:2},
   {id:"share",label:"Ask which box wants company",response:"One box gives a tiny knock. It does not need fixing. It only wants not to be alone on the shelf.",trait:"tenderness",weight:2}
  ]},
  {eyebrow:"THE LABEL MAKER",title:"Not everything needs a deadline",body:"There are labels for “soon”, “later”, and “not mine to carry”. KURU places them beside the boxes. One box has no label at all.",choices:[
   {id:"later",label:"Choose “later” for now",response:"The box relaxes. “Later” turns out to be a real place, not a failure.",trait:"patience",weight:1},
   {id:"mine",label:"Ask whether it belongs here",response:"The box is surprised by the question. It has been carried from room to room without being asked.",trait:"curiosity",weight:1},
   {id:"near",label:"Keep it near the warm lamp",response:"The box does not need to speak. It is enough to be kept with care.",trait:"tenderness",weight:1}
  ]},
  {eyebrow:"THE MORNING DOOR",title:"One last thing to leave behind",body:"The first pale line of morning appears. KURU can take one small thing from the shelf into the new day, or leave the room exactly as it is.",choices:[
   {id:"carry",label:"Carry one small box into morning",response:"KURU chooses one box, not the whole shelf. The day can begin with one thing.",trait:"curiosity",weight:1},
   {id:"leave",label:"Leave the shelf as it is",response:"The room stays quiet. Nothing has to be finished before the door opens.",trait:"patience",weight:1},
   {id:"wave",label:"Wave goodnight to every box",response:"The boxes seem a little less lonely. KURU switches off the lamp.",trait:"tenderness",weight:1}
  ]}
 ],
 endings:{
  tenderness:{id:"company-box",title:"The Company Box",treat:"A small box with two seats",description:"KURU leaves a warm place beside the lamp. Some things are easier to carry when they are not carried alone. The shelf can wait until another night.",shareLine:"Tonight, I left a little room for company."},
  curiosity:{id:"paper-boat",title:"The Paper Boat",treat:"A boat for one small tomorrow",description:"The paper boat finds a narrow ribbon of morning light. It does not know the whole river yet. It only needs somewhere to begin.",shareLine:"Tonight, I let one small thing begin without knowing the whole way."},
  patience:{id:"quiet-shelf-treat",title:"The Quiet Shelf",treat:"A place that can wait",description:"KURU closes the door softly. The boxes are still there, but they no longer feel like a list of failures. They are simply things with their own time.",shareLine:"Tonight, I let unfinished things have their own time."}
 }
}
];

export function resolveEnding(chapterId: string, traits: Traits): Ending {
 const chapter = chapters.find((item) => item.id === chapterId) ?? chapters[0];
 const order: Trait[] = ["tenderness", "curiosity", "patience"];
 const winner = order.reduce((best, trait) => traits[trait] > traits[best] ? trait : best, order[0]);
 return chapter.endings[winner];
}
export function nextTraits(current: Traits, trait: Trait, weight: number): Traits {
 return { ...current, [trait]: current[trait] + weight };
}
