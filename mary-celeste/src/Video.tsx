import React, { useEffect, useState } from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, interpolate, delayRender, continueRender } from "remotion";
import "@fontsource/prompt/thai-400.css";
import "@fontsource/prompt/thai-500.css";
import "@fontsource/prompt/thai-600.css";
import "@fontsource/prompt/thai-700.css";
import "@fontsource/prompt/latin-400.css";
import "@fontsource/prompt/latin-600.css";
import "@fontsource/prompt/latin-700.css";
import { Intro, Spot, Deck, Route, Cutaway, Missing } from "./scenes/part1";
import { Pirates, Vapour, Rope, Empty, Outro } from "./scenes/part2";
import { SHOTS, TOTAL, chunks, FPS, cF } from "./timing";

const order: [keyof typeof SHOTS, React.FC][] = [
  ["intro", Intro], ["spot", Spot], ["deck", Deck], ["route", Route], ["cutaway", Cutaway], ["missing", Missing],
  ["pirates", Pirates], ["vapour", Vapour], ["rope", Rope], ["empty", Empty], ["outro", Outro],
];
const keys = Object.keys(SHOTS) as (keyof typeof SHOTS)[];

/** sound effects keyed to the voice chunks (frames) */
const SFX: [number, string, number][] = [
  [10, "pop", 0.35], [cF(1), "chime", 0.25],
  [SHOTS.spot, "whoosh", 0.3], [cF(3) - 20, "rise", 0.3],
  [SHOTS.deck, "creak", 0.15], [SHOTS.deck + 20, "pop", 0.3], [cF(5) - 6, "whoosh", 0.3], [cF(5) + 8, "bell", 0.3],
  [SHOTS.route, "whoosh", 0.3], [cF(7), "pop", 0.35], [cF(8), "pop", 0.35], [cF(9), "tick", 0.4], [cF(9) + 30, "chime", 0.25],
  [SHOTS.cutaway, "whoosh_down", 0.3], [cF(10) + 30, "pop", 0.35], [cF(11) + 6, "tick", 0.35], [cF(11) + 95, "pop", 0.3], [cF(12) + 6, "pop", 0.3],
  [SHOTS.missing, "creak", 0.14], [cF(14), "whoosh", 0.25], [cF(14) + 10, "tick", 0.3],
  [SHOTS.pirates, "boom", 0.4], [cF(16), "pop", 0.35], [cF(17) + 10, "boom", 0.35], [cF(17) + 48, "chime", 0.25],
  [SHOTS.vapour, "whoosh_down", 0.3], [cF(19), "sizzle", 0.4], [cF(20), "rise", 0.35], [cF(20) + 60, "whoosh", 0.3],
  [SHOTS.rope, "wind", 0.35], [cF(21) + 30, "snap", 0.6], [cF(22), "whoosh_down", 0.25],
  [SHOTS.empty, "rumble", 0.3], [cF(24), "tick", 0.3], [cF(25), "bell", 0.3],
  [SHOTS.outro, "whoosh", 0.25], [cF(27), "pop", 0.35],
];

export const Video: React.FC<{ bedOnly: boolean }> = ({ bedOnly }) => {
  const [handle] = useState(() => delayRender("fonts"));
  useEffect(() => {
    Promise.all(["400", "500", "600", "700"].map((w) => document.fonts.load(`${w} 40px Prompt`, "กขค 1872")))
      .then(() => continueRender(handle)).catch(() => continueRender(handle));
  }, [handle]);
  const fade = (f: number) => interpolate(f, [0, 45, TOTAL - 60, TOTAL], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const speaking = (f: number) => chunks.some((c) => f / FPS >= c.s - 0.15 && f / FPS <= c.e + 0.15);
  return (
    <AbsoluteFill style={{ background: "#07021c" }}>
      {order.map(([k, Comp]) => {
        const from = SHOTS[k], next = SHOTS[keys[keys.indexOf(k) + 1]];
        return <Sequence key={k} from={from} durationInFrames={next - from} name={k}><Comp /></Sequence>;
      })}
      <Audio src={staticFile("music.wav")} volume={(f) => fade(f) * (speaking(f) ? 0.07 : 0.13)} />
      <Audio src={staticFile("sfx/waves.wav")} volume={(f) => fade(f) * (speaking(f) ? 0.05 : 0.09)} />
      {!bedOnly && <Sequence from={Math.round(0.5 * FPS)}><Audio src={staticFile("voice.mp3")} /></Sequence>}
      {SFX.map(([at, name, vol], i) => (
        <Sequence key={i} from={Math.max(0, at)} durationInFrames={Math.min(200, TOTAL - Math.max(0, at))} name={`sfx-${name}`}>
          <Audio src={staticFile(`sfx/${name}.wav`)} volume={vol * 0.32} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
