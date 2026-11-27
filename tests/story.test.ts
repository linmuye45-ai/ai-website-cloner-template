import test from "node:test";
import assert from "node:assert/strict";
import { chapters, emptyTraits, nextTraits, resolveEnding } from "../src/lib/story.ts";

test("each launch chapter has three authored scenes and three choices per scene", () => { for (const chapter of chapters) { assert.equal(chapter.scenes.length, 3); for (const scene of chapter.scenes) assert.equal(scene.choices.length, 3); } });
test("choices update only the selected trait", () => { assert.deepEqual(nextTraits(emptyTraits, "curiosity", 2), { tenderness: 0, curiosity: 2, patience: 0 }); });
test("different paths produce different endings", () => { const warm=resolveEnding("tomorrow-cloud",{tenderness:4,curiosity:0,patience:0}); const curious=resolveEnding("tomorrow-cloud",{tenderness:0,curiosity:4,patience:0}); const patient=resolveEnding("tomorrow-cloud",{tenderness:0,curiosity:0,patience:4}); assert.equal(warm.id,"warm-pouch"); assert.equal(curious.id,"little-lantern"); assert.equal(patient.id,"moon-envelope"); });
test("all launch ending ids are unique", () => { const ids=chapters.flatMap((chapter)=>Object.values(chapter.endings).map((ending)=>ending.id)); assert.equal(new Set(ids).size,ids.length); });
