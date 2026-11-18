import React from "react";
import { useCurrentFrame } from "remotion";
import { Stage, SpaceBg, Stars, Planet, Person, Label, Counter, CutEarth } from "../common";
import { C, FONT } from "../theme";
import { ramp, pop, lerp } from "../anim";
import { phF, SHOTS } from "../timing";

/** Shot 1: a small person on top of a planet; a dotted path drops straight through it */
export const Intro: React.FC = () => {
  const f = useCurrentFrame();
  const s0 = SHOTS.intro;
  const cPerson = 8, cLine = phF(0, 1) - s0, cOther = phF(0, 2) - s0;
  const cam = { x: lerp(1080, 880, ramp(f, 0, 140)), y: lerp(580, 510, ramp(f, 0, 140)), s: lerp(0.98, 1.18, ramp(f, 0, 140)) };
  const R = 330, cy = 560;
  const line = ramp(f, cLine, cLine + 30);
  return (
    <Stage cam={cam} bg={<SpaceBg />}>
      <Stars seed="intro" n={190} x0={-200} y0={-200} w={2320} h={1480} />
      <Planet cx={960} cy={cy} r={R} id="intro" />
      {/* dotted path through the planet */}
      <line x1={960} y1={cy - R - 10} x2={960} y2={lerp(cy - R - 10, cy + R + 10, line)} stroke={C.yellow} strokeWidth={6}
        strokeDasharray="4 16" strokeLinecap="round" />
      {line > 0 && <circle cx={960} cy={lerp(cy - R - 10, cy + R + 10, line)} r={12} fill={C.yellow} opacity={0.9} />}
      {line > 0 && <circle cx={960} cy={lerp(cy - R - 10, cy + R + 10, line)} r={30} fill={C.yellow} opacity={0.3} filter="url(#blur12)" />}
      <g transform={`translate(960 ${cy - R}) scale(${pop(f, cPerson)}) translate(-960 ${-(cy - R)})`}>
        <Person x={960} y={cy - R + 2} s={1.1} wave={Math.sin(f / 6) * 0.5 + 0.5} />
      </g>
      <g transform={`translate(960 ${cy + R}) scale(${pop(f, cOther)}) translate(-960 ${-(cy + R)})`}>
        <Person x={960} y={cy + R - 2} s={1.1} rot={180} shovel={false} wave={Math.sin(f / 5)} />
      </g>
      <text x={960} y={cy + R + 130} textAnchor="middle" fontFamily={FONT} fontSize={40} fill={C.lilac} opacity={ramp(f, cOther + 6, cOther + 20)}>?</text>
    </Stage>
  );
};

/** Shot 2: half-cut Earth with the diameter measured */
export const Diameter: React.FC = () => {
  const f = useCurrentFrame();
  const s0 = SHOTS.diameter;
  const cNum = phF(1, 1) - s0;
  const R = 400, cx = 960, cy = 540;
  const cam = { x: lerp(1130, 860, ramp(f, 0, 105)), y: lerp(560, 520, ramp(f, 0, 105)), s: lerp(0.98, 1.06, ramp(f, 0, 105)) };
  const d = ramp(f, 4, 34);
  return (
    <Stage cam={cam} bg={<SpaceBg hue={C.violet} />}>
      <Stars seed="diam" n={150} x0={-100} w={2120} />
      <CutEarth cx={cx} cy={cy} r={R} id="diam" open={ramp(f, 0, 18)} />
      <line x1={cx - 70} y1={cy - R} x2={cx - 70} y2={lerp(cy - R, cy + R, d)} stroke={C.cream} strokeWidth={5} />
      <path d={`M${cx - 86} ${cy - R + 22} L${cx - 70} ${cy - R} L${cx - 54} ${cy - R + 22}`} fill="none" stroke={C.cream} strokeWidth={5} opacity={d > 0 ? 1 : 0} />
      <path d={`M${cx - 86} ${cy + R - 22} L${cx - 70} ${cy + R} L${cx - 54} ${cy + R - 22}`} fill="none" stroke={C.cream} strokeWidth={5} opacity={d > 0.98 ? 1 : 0} />
      <Counter x={cx - 520} y={cy + 30} a={cNum} b={cNum + 40} to={12742} unit="กม." />
      <Label x={cx - 520} y={cy - 110} at={cNum - 12} text="จากผิวโลกฝั่งหนึ่ง ถึงอีกฝั่ง" size={36} color={C.lilac} />
    </Stage>
  );
};
