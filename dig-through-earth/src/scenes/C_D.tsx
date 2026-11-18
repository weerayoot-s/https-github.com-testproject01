import React from "react";
import { useCurrentFrame, random, Easing } from "remotion";
import { Stage, SpaceBg, Stars, Label, Counter, CutEarth } from "../common";
import { C, FONT } from "../theme";
import { ramp, pop, lerp } from "../anim";
import { phF, SHOTS } from "../timing";

const GROUND = 700;

const Aurora: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <g filter="url(#blur12)" opacity={0.75}>
      {[0, 1, 2].map((k) => {
        const pts = Array.from({ length: 13 }).map((_, i) => {
          const x = -200 + i * 200;
          const y = 160 + k * 60 + Math.sin(i * 0.7 + f / 28 + k) * 50;
          return `${x},${y}`;
        });
        return (
          <polyline key={k} points={pts.join(" ")} fill="none" stroke={k === 1 ? C.cyan : "#5cf0a4"}
            strokeWidth={70 - k * 18} strokeOpacity={0.35 - k * 0.06} strokeLinecap="round" />
        );
      })}
    </g>
  );
};

const Rig: React.FC<{ x: number }> = ({ x }) => {
  const f = useCurrentFrame();
  const H = 340, wB = 120, wT = 30;
  const rungs = Array.from({ length: 9 }).map((_, i) => i / 9);
  return (
    <g>
      <rect x={x - 160} y={GROUND - 80} width={110} height={80} fill="#2b2a5e" />
      <rect x={x - 160} y={GROUND - 80} width={110} height={14} fill="#3d3c80" />
      {[0, 1, 2].map((i) => <rect key={i} x={x - 148 + i * 34} y={GROUND - 54} width={20} height={16} fill={C.yellow} opacity={0.85} />)}
      <path d={`M${x - wB / 2} ${GROUND} L${x - wT / 2} ${GROUND - H} L${x + wT / 2} ${GROUND - H} L${x + wB / 2} ${GROUND}`} fill="none" stroke="#c9cbe8" strokeWidth={7} />
      {rungs.map((t, i) => {
        const y = GROUND - t * H; const hw = lerp(wB, wT, t) / 2; const y2 = GROUND - (t + 1 / 9) * H; const hw2 = lerp(wB, wT, t + 1 / 9) / 2;
        return (
          <g key={i} stroke="#9fa3d6" strokeWidth={3}>
            <line x1={x - hw} y1={y} x2={x + hw} y2={y} />
            <line x1={x - hw} y1={y} x2={x + hw2} y2={y2} />
            <line x1={x + hw} y1={y} x2={x - hw2} y2={y2} />
          </g>
        );
      })}
      <rect x={x - 26} y={GROUND - H - 22} width={52} height={22} rx={4} fill="#c9cbe8" />
      {[0, 1].map((i) => {
        const on = Math.floor((f + i * 15) / 15) % 2 === 0;
        return (
          <g key={i}>
            <circle cx={x + (i ? 18 : -18)} cy={GROUND - H - 30} r={6} fill={C.red} opacity={on ? 1 : 0.3} />
            {on && <circle cx={x + (i ? 18 : -18)} cy={GROUND - H - 30} r={22} fill={C.red} opacity={0.35} filter="url(#blur4)" />}
          </g>
        );
      })}
    </g>
  );
};

/** Shot 3: Kola borehole — arctic night, a rig, then a tilt down along the drill string */
export const Kola: React.FC = () => {
  const f = useCurrentFrame();
  const s0 = SHOTS.kola;
  const cName = phF(2, 1) - s0, cDepth = phF(2, 2) - s0, cYears = phF(2, 3) - s0;
  const tilt = ramp(f, cDepth - 8, cDepth + 40);
  const cam = { x: lerp(1100, 900, ramp(f, 0, 200)), y: lerp(470, 1180, tilt), s: lerp(1.04, 0.92, tilt) };
  const drill = ramp(f, cDepth, cDepth + 70, Easing.out(Easing.cubic));
  const bottom = GROUND + 30 + drill * 1150;
  const strata = ["#4a2a6a", "#3c2160", "#5a2a5e", "#43205a", "#36184e", "#4b1e4f", "#3a1440"];
  return (
    <Stage cam={cam} bg={<SpaceBg hue={C.blue} />}>
      <Stars seed="kola" n={120} x0={-200} y0={-400} w={2320} h={900} />
      <Aurora />
      {/* snowy hills */}
      <path d={`M-300 ${GROUND - 90} Q 200 ${GROUND - 220} 600 ${GROUND - 100} T 1500 ${GROUND - 130} T 2300 ${GROUND - 80} V ${GROUND + 10} H -300Z`} fill="#3a4a9a" />
      <path d={`M-300 ${GROUND - 40} Q 300 ${GROUND - 120} 800 ${GROUND - 50} T 2300 ${GROUND - 40} V ${GROUND + 10} H -300Z`} fill="#8fa2e0" />
      {Array.from({ length: 14 }).map((_, i) => {
        const x = -200 + random(`tree${i}`) * 2300; if (Math.abs(x - 960) < 220) return null;
        const h = 40 + random(`th${i}`) * 50;
        return <path key={i} d={`M${x} ${GROUND - 30 - h} L${x - h * 0.3} ${GROUND - 30} H${x + h * 0.3}Z`} fill="#1d2a66" />;
      })}
      {/* ground and strata */}
      {strata.map((c, i) => (
        <path key={i} d={`M-400 ${GROUND + i * 190 + Math.sin(i) * 20} Q 500 ${GROUND + i * 190 - 30} 960 ${GROUND + i * 190 + 10} T 2400 ${GROUND + i * 190} V ${GROUND + 1500} H -400Z`} fill={c} />
      ))}
      <rect x={-400} y={GROUND} width={2800} height={16} fill="#e8f0ff" />
      {Array.from({ length: 90 }).map((_, i) => (
        <ellipse key={i} cx={-300 + random(`pb${i}`) * 2500} cy={GROUND + 40 + random(`pby${i}`) * 1350} rx={6 + random(`pbr${i}`) * 14}
          ry={4 + random(`pbr${i}`) * 8} fill="#7a4f8f" opacity={0.45} />
      ))}
      {/* borehole and drill string */}
      <rect x={952} y={GROUND} width={16} height={bottom - GROUND} fill="#14061f" />
      <rect x={957} y={GROUND - 20} width={6} height={bottom - GROUND + 10} fill="url(#metal)" />
      <circle cx={960} cy={bottom} r={26} fill={C.orange} opacity={0.5} filter="url(#blur12)" />
      <path d={`M948 ${bottom - 18} H972 L960 ${bottom + 6}Z`} fill={C.amber} />
      <Rig x={960} />
      {/* depth ruler */}
      <g opacity={ramp(f, cDepth, cDepth + 15)}>
        <line x1={1120} y1={GROUND} x2={1120} y2={GROUND + 1180} stroke={C.lilac} strokeWidth={3} strokeDasharray="10 10" />
        {Array.from({ length: 13 }).map((_, i) => (
          <g key={i}>
            <line x1={1110} x2={1135} y1={GROUND + 30 + i * (1150 / 12.262)} y2={GROUND + 30 + i * (1150 / 12.262)} stroke={C.lilac} strokeWidth={3} />
            {i % 4 === 0 && <text x={1150} y={GROUND + 42 + i * (1150 / 12.262)} fontFamily={FONT} fontSize={34} fill={C.lilac}>{i} กม.</text>}
          </g>
        ))}
      </g>
      <Label x={640} y={GROUND - 420} at={cName} text="หลุมเจาะโคลา" sub="คาบสมุทรโคลา, รัสเซีย" color={C.cyan} px={960} py={GROUND - 370} />
      <Counter x={1500} y={1060} a={cDepth} b={cDepth + 70} to={12262} unit="เมตร" size={110} />
      <Label x={1500} y={1220} at={cYears} text="พ.ศ. 2513 – 2532" sub="ค.ศ. 1970 – 1989 (เกือบ 20 ปี)" color={C.amber} size={44} />
    </Stage>
  );
};

/** Shot 4: continuous zoom-out from the hole to the whole Earth — 12 km is ~0.2% of the way to the centre */
export const ZoomOut: React.FC = () => {
  const f = useCurrentFrame();
  const s0 = SHOTS.zoomOut;
  const cPct = phF(3, 1) - s0, cCentre = phF(3, 2) - s0;
  const R = 380, cx = 960, cy = 620;
  const t = ramp(f, 0, cPct + 6, Easing.inOut(Easing.quad));
  const s = Math.exp(lerp(Math.log(28), 0, t));
  // camera keeps the hole on a smooth screen path (screen y 560 -> 240) while zooming on a log scale
  const screenY = lerp(560, cy - R, t);
  const cam = { x: 960, y: cy - R - (screenY - 540) / s, s };
  const holeLen = (R * 12.262) / 6371; // true scale
  const centre = ramp(f, cCentre, cCentre + 25);
  return (
    <Stage cam={cam} bg={<SpaceBg hue={C.space2} />}>
      <Stars seed="zoom" n={130} x0={0} y0={0} />
      <CutEarth cx={cx} cy={cy} r={R} id="zoom" />
      <line x1={cx + 2} y1={cy - R} x2={cx + 2} y2={lerp(cy - R, cy, centre)} stroke={C.cream} strokeWidth={4 / s} strokeDasharray={`${4 / s} ${10 / s}`} />
      <rect x={cx - 3 / s} y={cy - R} width={6 / s} height={Math.max(holeLen, 10 / s)} fill={C.red} />
      <circle cx={cx} cy={cy - R} r={16 / s} fill="none" stroke={C.red} strokeWidth={4 / s} opacity={1 - ramp(f, cPct, cPct + 10) * 0.2} />
      {centre > 0 && <circle cx={cx} cy={cy} r={10} fill={C.cream} opacity={centre} />}
      {/* labels in world space but sized for the final zoom */}
      <g opacity={ramp(f, cPct - 4, cPct + 6)}>
        <Label x={cx - 360} y={cy - R - 40} at={cPct} text="0.2%" sub="ของทางไปถึงใจกลางโลก" color={C.red} size={64} px={cx - 6} py={cy - R + 2} />
      </g>
      <Label x={cx + 430} y={cy + 30} at={cCentre} text="ใจกลางโลก" sub="ลึก 6,371 กม." color={C.yellow} size={42} px={cx + 6} py={cy} />
    </Stage>
  );
};
