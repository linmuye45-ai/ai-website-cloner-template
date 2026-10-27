// Canvas renderer for the authored 5x7 bitmap font (see font-data.ts).
import {
  FONT_5X7,
  FONT_ADVANCE,
  FONT_GLYPH_H,
  FONT_GLYPH_W,
} from "./font-data";

export function measureText(text: string, scale = 1): number {
  return Math.max(0, text.length * FONT_ADVANCE - 1) * scale;
}

export function drawText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  color: string,
  scale = 1,
): void {
  ctx.fillStyle = color;
  let cx = x;
  for (const raw of text) {
    const ch = raw.toUpperCase();
    const glyph = FONT_5X7[ch] ?? FONT_5X7["?"];
    for (let row = 0; row < FONT_GLYPH_H; row += 1) {
      for (let col = 0; col < FONT_GLYPH_W; col += 1) {
        if (glyph[row][col] === "#") {
          ctx.fillRect(cx + col * scale, y + row * scale, scale, scale);
        }
      }
    }
    cx += FONT_ADVANCE * scale;
  }
}
