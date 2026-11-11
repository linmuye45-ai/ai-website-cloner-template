import { test } from 'node:test';
import assert from 'node:assert/strict';
import { DEFAULT_SPEC, normalizeSpec, specFromParams, specUrl } from '../src/lib/party-spec.mjs';

test('shared rules round trip Unicode without exposing prior room or private URL', () => {
  const spec = normalizeSpec({title:'朋友的派对 ✨',targetScore:15,seconds:45,mode:'team',theme:'gem'});
  const url = new URL(specUrl('https://example.com/party/?room=ABC123#x',spec));
  assert.equal(url.searchParams.has('room'), false); assert.equal(url.hash,'');
  assert.deepEqual(specFromParams(url.searchParams),spec);
});
test('malformed and out-of-range shared rules are bounded, unknown versions ignored', () => {
  assert.equal(specFromParams(new URLSearchParams('v=99')),null);
  const parsed=specFromParams(new URLSearchParams('v=1&title=%00&goal=999&time=-1&mode=evil&theme=evil'));
  assert.deepEqual(parsed,DEFAULT_SPEC);
  assert.deepEqual(normalizeSpec(null),DEFAULT_SPEC);
});
