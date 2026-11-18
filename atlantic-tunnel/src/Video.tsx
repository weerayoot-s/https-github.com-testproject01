import React, { useEffect, useState } from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, interpolate, delayRender, continueRender } from "remotion";
import "@fontsource/prompt/thai-400.css";
import "@fontsource/prompt/thai-500.css";
import "@fontsource/prompt/thai-600.css";
import "@fontsource/prompt/thai-700.css";
import "@fontsource/prompt/latin-400.css";
import "@fontsource/prompt/latin-600.css";
import "@fontsource/prompt/latin-700.css";
import { Hook, Channel, Scale, Depth, Ridge } from "./scenes/part1";
import { Float, Vac, Cost, Bering, Outro } from "./scenes/part2";
import { SHOTS, TOTAL, chunks, FPS, cF } from "./timing";

const order: [keyof typeof SHOTS, React.FC][] = [
  ["hook", Hook], ["channel", Channel], ["scale", Scale], ["depth", Depth], ["ridge", Ridge],
  ["float", Float], ["vac", Vac], ["cost", Cost], ["bering", Bering], ["outro", Outro],
];
const keys = Object.keys(SHOTS) as (keyof typeof SHOTS)[];

/** sound effects keyed to the voice chunks (frames) */
const SFX: [number, string, number][] = [
  [6, "pop", 0.35], [10, "whoosh", 0.35], [cF(1), "pop", 0.35], [cF(1) + 45, "pop", 0.35], [cF(1) + 53, "boom", 0.3],
  [SHOTS.channel, "whoosh", 0.3], [SHOTS.channel + 6, "pop", 0.3], [cF(3), "pop", 0.35], [cF(4), "tick", 0.4],
  [SHOTS.scale, "whoosh_down", 0.3], [SHOTS.scale + 14, "chime", 0.3], [cF(7), "rise", 0.3],
  [SHOTS.depth, "whoosh_down", 0.35], [SHOTS.depth + 10, "rumble", 0.3], [cF(9), "creak", 0.18], [cF(9) + 12, "pop", 0.3],
  [SHOTS.ridge, "rumble", 0.35], [SHOTS.ridge + 30, "pop", 0.3], [cF(11), "boom", 0.45], [cF(11) + 4, "rumble", 0.4],
  [SHOTS.float, "whoosh", 0.3], [SHOTS.float + 8, "pop", 0.3], [cF(12) + 100, "pop", 0.3], [cF(12) + 150, "tick", 0.35],
  [SHOTS.vac + 10, "sizzle", 0.3], [SHOTS.vac + 75, "whoosh", 0.55], [SHOTS.vac + 150, "chime", 0.3], [SHOTS.vac + 190, "whoosh", 0.45],
  [SHOTS.cost, "tick", 0.3], [SHOTS.cost + 18, "pop", 0.35], [cF(15), "bell", 0.35],
  [SHOTS.bering, "whoosh_down", 0.3], [SHOTS.bering + 70, "pop", 0.35], [SHOTS.bering + 115, "rise", 0.3], [SHOTS.bering + 135, "pop", 0.3],
  [SHOTS.outro, "whoosh", 0.3], [cF(18), "chime", 0.3], [cF(19), "pop", 0.35],
];

export const Video: React.FC<{ bedOnly: boolean }> = ({ bedOnly }) => {
  const [handle] = useState(() => delayRender("fonts"));
  useEffect(() => {
    Promise.all(["400", "500", "600", "700"].map((w) => document.fonts.load(`${w} 40px Prompt`, "กขค 1988")))
      .then(() => continueRender(handle)).catch(() => continueRender(handle));
  }, [handle]);
  const fade = (f: number) => interpolate(f, [0, 30, TOTAL - 60, TOTAL], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const speaking = (f: number) => chunks.some((c) => f / FPS >= c.s - 0.15 && f / FPS <= c.e + 0.15);
  return (
    <AbsoluteFill style={{ background: "#07021c" }}>
      {order.map(([k, Comp]) => {
        const from = SHOTS[k], next = SHOTS[keys[keys.indexOf(k) + 1]];
        return <Sequence key={k} from={from} durationInFrames={next - from} name={k}><Comp /></Sequence>;
      })}
      <Audio src={staticFile("music.wav")} volume={(f) => fade(f) * (speaking(f) ? 0.07 : 0.13)} />
      {!bedOnly && <Sequence from={Math.round(0.5 * FPS)}><Audio src={staticFile("voice.mp3")} /></Sequence>}
      {SFX.map(([at, name, vol], i) => (
        <Sequence key={i} from={Math.max(0, at)} durationInFrames={Math.min(200, TOTAL - Math.max(0, at))} name={`sfx-${name}`}>
          <Audio src={staticFile(`sfx/${name}.wav`)} volume={vol * 0.32} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
