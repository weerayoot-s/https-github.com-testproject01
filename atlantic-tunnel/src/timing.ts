import data from "./chunks.json";
export const FPS = 30;
export const chunks = data.chunks;
/** start / end frame of speech chunk i (voice split at its pauses) */
export const cF = (i: number) => Math.round(chunks[Math.min(i, chunks.length - 1)].s * FPS);
export const cEndF = (i: number) => Math.round(chunks[Math.min(i, chunks.length - 1)].e * FPS);
export const TOTAL = Math.round((chunks[chunks.length - 1].e + 2.4) * FPS);
const LEAD = 3;
export const SHOTS = {
  hook: 0, channel: cF(2) - LEAD, scale: cF(6) - LEAD, depth: cF(8) - LEAD, ridge: cF(10) - LEAD, float: cF(12) - LEAD,
  vac: cF(13) - LEAD, cost: cF(14) - LEAD, bering: cF(16) - LEAD, outro: cF(17) - LEAD, end: TOTAL,
};
