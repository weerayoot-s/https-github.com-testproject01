import React, { useEffect, useState } from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame, interpolate, delayRender, continueRender } from "remotion";
import "@fontsource/prompt/thai-400.css";
import "@fontsource/prompt/thai-500.css";
import "@fontsource/prompt/thai-600.css";
import "@fontsource/prompt/thai-700.css";
import "@fontsource/prompt/latin-400.css";
import "@fontsource/prompt/latin-600.css";
import "@fontsource/prompt/latin-700.css";
import { Intro, Diameter } from "./scenes/A_B";
import { Kola, ZoomOut } from "./scenes/C_D";
import { Hot, Dive } from "./scenes/E_F";
import { Melt, Waves, Outro } from "./scenes/G_I";
import { SHOTS, TOTAL, segs, FPS, hasVoice, phF, segF } from "./timing";
import { FONT } from "./theme";

const order: [keyof typeof SHOTS, React.FC][] = [
  ["intro", Intro], ["diameter", Diameter], ["kola", Kola], ["zoomOut", ZoomOut], ["hot", Hot],
  ["dive", Dive], ["melt", Melt], ["waves", Waves], ["outro", Outro],
];
const keys = Object.keys(SHOTS) as (keyof typeof SHOTS)[];

/** sound effects keyed to narration phrases (frames) */
const SFX: [number, string, number][] = [
  [8, "pop", 0.5], [phF(0, 1), "whoosh_down", 0.35], [phF(0, 2), "pop", 0.45],
  [SHOTS.diameter, "whoosh", 0.35], [phF(1, 1), "rise", 0.25],
  [SHOTS.kola, "wind", 0.3], [phF(2, 1), "pop", 0.45], [phF(2, 2), "drill", 0.35], [phF(2, 3), "tick", 0.5],
  [SHOTS.zoomOut, "whoosh", 0.4], [phF(3, 1), "chime", 0.35], [phF(3, 2), "pop", 0.35],
  [SHOTS.hot, "sizzle", 0.3], [SHOTS.hot + 10, "drill", 0.25], [phF(4, 1), "pop", 0.35], [phF(4, 3), "creak", 0.35],
  [SHOTS.dive, "rumble", 0.45], [phF(5, 2), "pop", 0.45], [phF(5, 4), "tick", 0.45],
  [segF(6) - 6, "whoosh_down", 0.4], [phF(6, 2), "rumble", 0.35],
  [segF(7) - 6, "whoosh_down", 0.4], [phF(7, 2), "sizzle", 0.3], [phF(7, 3), "whoosh", 0.3], [phF(7, 4), "rise", 0.3],
  [SHOTS.melt, "sizzle", 0.4], [phF(8, 1), "pop", 0.4], [phF(8, 2) + 12, "boom", 0.55],
  [SHOTS.waves, "boom", 0.5], [phF(9, 1) - 6, "rumble", 0.4], [phF(9, 1) + 40, "ping", 0.3], [phF(9, 2), "pop", 0.35],
  [SHOTS.outro, "whoosh", 0.3], [phF(10, 2), "ping", 0.3], [segF(10) + 100, "chime", 0.3],
];

const Captions: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / FPS;
  const seg = segs.find((s) => t >= s.s - 0.1 && t <= s.e + 0.35);
  if (!seg) return null;
  const o = interpolate(t, [seg.s - 0.1, seg.s + 0.1, seg.e + 0.15, seg.e + 0.35], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div style={{ position: "absolute", left: 0, right: 0, bottom: 56, display: "flex", justifyContent: "center", opacity: o }}>
      <div style={{ maxWidth: 1500, padding: "14px 34px", borderRadius: 18, background: "rgba(12,6,40,0.72)", color: "#f6f3e6",
        fontFamily: FONT, fontWeight: 500, fontSize: 42, lineHeight: 1.45, textAlign: "center" }}>{seg.text}</div>
    </div>
  );
};

export const Video: React.FC<{ captions: boolean; bedOnly: boolean }> = ({ captions, bedOnly }) => {
  const [handle] = useState(() => delayRender("fonts"));
  useEffect(() => {
    Promise.all(["400", "500", "600", "700"].map((w) => document.fonts.load(`${w} 40px Prompt`, "กขค 0.2%")))
      .then(() => continueRender(handle)).catch(() => continueRender(handle));
  }, [handle]);
  // music: fade in/out; ducked a little while the voice speaks
  const musicVol = (f: number) => {
    const t = f / FPS;
    const fade = interpolate(f, [0, 45, TOTAL - 60, TOTAL], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    const speaking = hasVoice && segs.some((s) => t >= s.s - 0.2 && t <= s.e + 0.2);
    return fade * (speaking ? 0.32 : 0.5);
  };
  return (
    <AbsoluteFill style={{ background: "#07021c" }}>
      {order.map(([k, Comp]) => {
        const from = SHOTS[k];
        const next = SHOTS[keys[keys.indexOf(k) + 1]];
        return (
          <Sequence key={k} from={from} durationInFrames={next - from} name={k}>
            <Comp />
          </Sequence>
        );
      })}
      {captions && <Captions />}
      <Audio src={staticFile("music.wav")} volume={musicVol} />
      {hasVoice && !bedOnly && <Audio src={staticFile("voice.mp3")} />}
      {SFX.map(([at, name, vol], i) => (
        <Sequence key={`sfx${i}`} from={Math.max(0, at)} durationInFrames={Math.min(200, TOTAL - Math.max(0, at))} name={`sfx-${name}`}>
          <Audio src={staticFile(`sfx/${name}.wav`)} volume={vol} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
