/**
 * Versioned, data-only rules for the fixed star-tapping template.
 * Shared by the browser and server; this is not an AI generator.
 * @typedef {{version:1, title:string, targetScore:number, seconds:number, mode:'race'|'team', theme:'star'|'gem'|'bolt'}} PartySpec
 */
/** @type {PartySpec} */
export const DEFAULT_SPEC = Object.freeze({version:1, title:'星光争夺战', targetScore:10, seconds:30, mode:'race', theme:'star'});
/** @param {unknown} value @param {number} fallback @param {number} min @param {number} max */
function number(value, fallback, min, max) { return typeof value === 'number' && Number.isInteger(value) && value >= min && value <= max ? value : fallback; }
/** @param {unknown} input @returns {PartySpec} */
export function normalizeSpec(input) {
  const obj = input && typeof input === 'object' && !Array.isArray(input) ? /** @type {Record<string, unknown>} */(input) : {};
  const title = typeof obj.title === 'string' ? obj.title.replace(/[\u0000-\u001f\u007f]/g, '').trim().slice(0,16) : '';
  return {version:1, title:title || DEFAULT_SPEC.title, targetScore:number(obj.targetScore, 10, 3, 25), seconds:number(obj.seconds, 30, 15, 90), mode:obj.mode === 'team' ? 'team' : 'race', theme:obj.theme === 'gem' || obj.theme === 'bolt' ? obj.theme : 'star'};
}
/** @param {URLSearchParams} params @returns {PartySpec | null} */
export function specFromParams(params) {
  if (params.get('v') !== '1') return null;
  const goal = params.get('goal'); const duration = params.get('time');
  return normalizeSpec({title:params.get('title'), targetScore:goal && /^\d{1,2}$/.test(goal) ? Number(goal) : undefined, seconds:duration && /^\d{1,2}$/.test(duration) ? Number(duration) : undefined, mode:params.get('mode'), theme:params.get('theme')});
}
/** @param {string} baseUrl @param {PartySpec} spec */
export function specUrl(baseUrl, spec) {
  const url = new URL(baseUrl); const clean = normalizeSpec(spec); url.search = ''; url.hash = '';
  url.searchParams.set('v','1'); url.searchParams.set('title',clean.title); url.searchParams.set('goal',String(clean.targetScore)); url.searchParams.set('time',String(clean.seconds)); url.searchParams.set('mode',clean.mode); url.searchParams.set('theme',clean.theme);
  return url.toString();
}
