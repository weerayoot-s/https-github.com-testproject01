import data from "./timing.json";

export const FPS = 30;
export const TOTAL = 60 * FPS;
export const hasVoice = data.source === "elevenlabs";
export const segs = data.segments;
const fr = (s: number) => Math.round(s * FPS);
export const segF = (i: number) => fr(segs[i].s);
export const segEndF = (i: number) => fr(segs[i].e);
/** start frame of phrase j of segment i (clamped) */
export const phF = (i: number, j: number) => {
  const p = segs[i].phrases;
  return fr(p[Math.max(0, Math.min(p.length - 1, j))].s);
};
const LEAD = 3; // cut 3 frames before the cue word
export const SHOTS = {
  intro: 0,
  diameter: segF(1) - LEAD,
  kola: segF(2) - LEAD,
  zoomOut: segF(3) - LEAD,
  hot: segF(4) - LEAD,
  dive: segF(5) - LEAD,
  melt: segF(8) - LEAD,
  waves: segF(9) - LEAD,
  outro: segF(10) - LEAD,
  end: TOTAL,
};
