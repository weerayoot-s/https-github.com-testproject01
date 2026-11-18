import data from "./chunks.json";
export const FPS = 30;
export const chunks = data.chunks;
export const cF = (i: number) => Math.round(chunks[Math.min(i, chunks.length - 1)].s * FPS);
export const cEndF = (i: number) => Math.round(chunks[Math.min(i, chunks.length - 1)].e * FPS);
export const TOTAL = Math.round((chunks[chunks.length - 1].e + 2.4) * FPS);
const LEAD = 3;
export const SHOTS = {
  intro: 0, size: cF(2) - LEAD, rocky: cF(3) - LEAD, fall: cF(7) - LEAD, tiny: cF(11) - LEAD, giants: cF(12) - LEAD,
  squeeze: cF(16) - LEAD, star: cF(18) - LEAD, comet: cF(21) - LEAD, outro: cF(23) - LEAD, end: TOTAL,
};
