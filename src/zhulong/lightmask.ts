/**
 * Torchlight compositing.
 *
 * A plain radial gradient either blinds the player (too small) or washes the
 * screen grey (too large). Real cave games cheat: they punch a *clear* viewing
 * hole around the avatar and only fall into darkness outside it. This module
 * bakes that two-stage mask into a single 512px texture:
 *
 *   0 → 30%   fully transparent (everything near the player is readable)
 *   55%       gentle dimming (peripheral context stays legible)
 *   100%      near-opaque ink (unknown territory)
 *
 * The mask is drawn as a screen-space quad sized to the player's light radius,
 * so upgrades widen the clear hole rather than brightening the whole frame.
 */
export const MASK_SIZE = 512;
/** Fraction of the mask radius that stays fully clear. */
export const MASK_CLEAR = 0.3;

export function paintLightMask(ctx: CanvasRenderingContext2D, size = MASK_SIZE): void {
  const c = size / 2;
  const g = ctx.createRadialGradient(c, c, 0, c, c, c);
  g.addColorStop(0, 'rgba(6,4,11,0)');
  g.addColorStop(MASK_CLEAR, 'rgba(6,4,11,0)');
  g.addColorStop(0.46, 'rgba(6,4,11,0.10)');
  g.addColorStop(0.62, 'rgba(5,3,10,0.40)');
  g.addColorStop(0.8, 'rgba(4,2,8,0.74)');
  g.addColorStop(0.93, 'rgba(3,1,6,0.94)');
  g.addColorStop(1, 'rgba(3,1,6,0.97)');
  ctx.clearRect(0, 0, size, size);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
}

/**
 * Scale that keeps the whole viewport covered even when the player is in a
 * corner: the mask is a square of `MASK_SIZE * scale` centred on the player.
 */
export function maskScale(lightRadius: number, viewW: number, viewH: number): number {
  const reach = Math.hypot(viewW, viewH) / 2;
  const fromRadius = lightRadius / (MASK_CLEAR * MASK_SIZE);
  const fromCoverage = (reach * 2) / MASK_SIZE;
  return Math.max(fromRadius, fromCoverage);
}
