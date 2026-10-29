import { createCanvas, loadImage } from '@napi-rs/canvas';
import { readdirSync, writeFileSync } from 'node:fs';
const [dir, out, cols='16', scale='4'] = process.argv.slice(2);
const files = readdirSync(dir).filter(f=>f.endsWith('.png')).sort();
const C=+cols, S=+scale;
const img0 = await loadImage(`${dir}/${files[0]}`);
const cw = img0.width*S, ch = img0.height*S;
const rows = Math.ceil(files.length/C);
const canvas = createCanvas(C*cw, rows*ch + rows*12);
const ctx = canvas.getContext('2d');
ctx.fillStyle='#202028'; ctx.fillRect(0,0,canvas.width,canvas.height);
for (let i=0;i<files.length;i++){
  const img = await loadImage(`${dir}/${files[i]}`);
  const x=(i%C)*cw, y=Math.floor(i/C)*(ch+12);
  ctx.drawImage(img, x, y, cw, ch);
  ctx.fillStyle='#8890a0'; ctx.font='9px monospace';
  ctx.fillText(files[i].replace('.png','').slice(-9), x+2, y+ch+9);
}
writeFileSync(out, canvas.toBuffer('image/png'));
console.log(out, canvas.width+'x'+canvas.height, files.length+' files');
