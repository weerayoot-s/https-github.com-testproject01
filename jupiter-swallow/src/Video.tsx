import React, { useEffect, useState } from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, interpolate, delayRender, continueRender } from "remotion";
import "@fontsource/prompt/thai-400.css";
import "@fontsource/prompt/thai-500.css";
import "@fontsource/prompt/thai-600.css";
import "@fontsource/prompt/thai-700.css";
import "@fontsource/prompt/latin-400.css";
import "@fontsource/prompt/latin-600.css";
import "@fontsource/prompt/latin-700.css";
import { Intro, Size, Rocky, Fall, Tiny, Giants, Squeeze, Star, Comet, Outro } from "./scenes/all";
import { SHOTS, TOTAL, chunks, FPS, cF } from "./timing";

const order: [keyof typeof SHOTS, React.FC][] = [
  ["intro", Intro], ["size", Size], ["rocky", Rocky], ["fall", Fall], ["tiny", Tiny], ["giants", Giants],
  ["squeeze", Squeeze], ["star", Star], ["comet", Comet], ["outro", Outro],
];
const keys = Object.keys(SHOTS) as (keyof typeof SHOTS)[];

/** sound effects keyed to the voice chunks (frames) */
const SFX: [number, string, number][] = [
  [6, "boom", 0.35], [8, "chime", 0.3], ...[0, 1, 2, 3, 4, 5, 6].map((i) => [cF(1) + i * 3, "pop", 0.2] as [number, string, number]),
  [SHOTS.size, "whoosh", 0.3], [SHOTS.size + 10, "rise", 0.3], [SHOTS.size + 140, "tick", 0.4], [SHOTS.size + 150, "boom", 0.25],
  [cF(3), "pop", 0.4], [cF(4), "pop", 0.4], [cF(5), "pop", 0.4], [cF(6), "pop", 0.4], [cF(6) + 25, "whoosh", 0.35],
  [SHOTS.fall, "whoosh_down", 0.4], [cF(8), "wind", 0.45], [cF(9), "rumble", 0.35], [cF(10), "sizzle", 0.45],
  [SHOTS.tiny, "pop", 0.3], [SHOTS.tiny + 14, "chime", 0.3], [SHOTS.tiny + 40, "tick", 0.4],
  [cF(13), "pop", 0.4], [cF(13) + 20, "pop", 0.4], [cF(13) + 40, "pop", 0.4], [cF(14) + 30, "boom", 0.4], [cF(14) + 40, "boom", 0.35], [cF(14) + 50, "boom", 0.35], [cF(15), "rise", 0.3],
  [SHOTS.squeeze, "whoosh", 0.3], [SHOTS.squeeze + 30, "pop", 0.35], [cF(17) + 60, "creak", 0.15],
  [SHOTS.star, "whoosh_down", 0.3], [cF(19), "boom", 0.4], [cF(20), "tick", 0.35], [cF(20) + 10, "rise", 0.3],
  [SHOTS.comet, "whoosh", 0.35], [cF(22) + 20, "boom", 0.45], [cF(22) + 50, "boom", 0.4], [cF(22) + 90, "boom", 0.4],
  [SHOTS.outro, "whoosh", 0.3], [cF(24), "chime", 0.3], [cF(25), "pop", 0.35],
];

export const Video: React.FC<{ bedOnly: boolean }> = ({ bedOnly }) => {
  const [handle] = useState(() => delayRender("fonts"));
  useEffect(() => {
    Promise.all(["400", "500", "600", "700"].map((w) => document.fonts.load(`${w} 40px Prompt`, "กขค 1994")))
      .then(() => continueRender(handle)).catch(() => continueRender(handle));
  }, [handle]);
  const fade = (f: number) => interpolate(f, [0, 30, TOTAL - 60, TOTAL], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const speaking = (f: number) => chunks.some((c) => f / FPS >= c.s - 0.15 && f / FPS <= c.e + 0.15);
  return (
    <AbsoluteFill style={{ background: "#160a52" }}>
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
