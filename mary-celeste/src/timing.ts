import data from "./chunks.json";
export const FPS = 30;
export const chunks = data.chunks;
/** start / end frame of speech chunk i (split at the voice's pauses) */
export const cF = (i: number) => Math.round(chunks[Math.min(i, chunks.length - 1)].s * FPS);
export const cEndF = (i: number) => Math.round(chunks[Math.min(i, chunks.length - 1)].e * FPS);
export const TOTAL = Math.round((chunks[chunks.length - 1].e + 2.4) * FPS);
const LEAD = 3; // cut 3 frames before the cue
export const SHOTS = {
  intro: 0, spot: cF(2) - LEAD, deck: cF(4) - LEAD, route: cF(6) - LEAD, cutaway: cF(10) - LEAD, missing: cF(13) - LEAD,
  pirates: cF(15) - LEAD, vapour: cF(18) - LEAD, rope: cF(21) - LEAD, empty: cF(23) - LEAD, outro: cF(26) - LEAD, end: TOTAL,
};
