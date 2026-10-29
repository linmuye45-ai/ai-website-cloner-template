import { createCanvas, loadImage } from '@napi-rs/canvas';
import { writeFileSync } from 'node:fs';
const [dir, out, from, to, cols, scale] = process.argv.slice(2);
const files = Array.from({length:+to-+from},(_,i)=>`tile_${String(+from+i).padStart(4,'0')}.png`);
const C=+cols, S=+scale, cw=16*S, ch=16*S, pad=14;
const rows=Math.ceil(files.length/C);
const canvas=createCanvas(C*cw, rows*(ch+pad));
const ctx=canvas.getContext('2d');
ctx.fillStyle='#181820'; ctx.fillRect(0,0,canvas.width,canvas.height);
for(let i=0;i<files.length;i++){
  const img=await loadImage(`${dir}/${files[i]}`);
  const x=(i%C)*cw, y=Math.floor(i/C)*(ch+pad);
  ctx.imageSmoothingEnabled=false;
  ctx.drawImage(img,x,y,cw,ch);
  ctx.fillStyle='#7f8898'; ctx.font='10px monospace';
  ctx.fillText(files[i].replace('tile_','').replace('.png',''), x+2, y+ch+10);
}
writeFileSync(out, canvas.toBuffer('image/png'));
console.log(out, canvas.width+'x'+canvas.height);
