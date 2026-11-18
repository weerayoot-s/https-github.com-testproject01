import { interpolate, spring, Easing } from "remotion";
export const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
/** 0..1 ramp from frame a to b, eased */
export const ramp = (f: number, a: number, b: number, ease = Easing.inOut(Easing.cubic)) =>
  interpolate(f, [a, b], [0, 1], { ...clamp, easing: ease });
/** springy pop-in starting at frame a */
export const pop = (f: number, a: number, fps = 30) =>
  f < a ? 0 : spring({ frame: f - a, fps, config: { damping: 11, stiffness: 140, mass: 0.7 } });
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
