import React from "react";
import { useCurrentFrame, Easing } from "remotion";
import { Stage, SpaceBg, Stars, Planet, Person, Label } from "../common";
import { C, FONT } from "../theme";
import { ramp, pop, lerp } from "../anim";
import { phF, SHOTS, segEndF, TOTAL } from "../timing";

/** Shot 9: no drill bit and no material survives */
export const Melt: React.FC = () => {
  const f = useCurrentFrame();
  const s0 = SHOTS.melt;
  const cMat = phF(8, 1) - s0, cX = phF(8, 2) - s0;
  const m = ramp(f, cX - 4, cX + 30, Easing.in(Easing.quad));
  const cam = { x: lerp(880, 1030, ramp(f, 0, 90)), y: 520, s: lerp(1.12, 0.98, ramp(f, 0, 90)) };
  const glow = 0.4 + 0.6 * ramp(f, 0, cX);
  return (
    <Stage cam={cam} bg={<rect width={1920} height={1080} fill="#22071f" />}>
      <circle cx={960} cy={1150} r={900} fill="url(#hotglow)" opacity={glow} />
      {/* drill bit, sagging as it melts */}
      <g transform={`translate(960 ${lerp(-120, 80, pop(f, 0))})`}>
        <g transform={`translate(0 640) scale(${1 + m * 0.25} ${1 - m * 0.35}) translate(0 -640)`}>
          <rect x={-40} y={0} width={80} height={360} fill="url(#metal)" />
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <path key={i} d={`M-90 ${360 + i * 45} L90 ${330 + i * 45} L90 ${352 + i * 45} L-90 ${382 + i * 45}Z`} fill="url(#metal)" opacity={0.95} />
          ))}
          <path d={`M-90 630 L90 600 L${m * 30} ${700 + m * 40}Z`} fill="url(#metal)" />
          <path d={`M-90 630 L90 600 L${m * 30} ${700 + m * 40}Z`} fill={C.orange} opacity={0.3 + 0.6 * glow} />
        </g>
        {[0, 1, 2].map((i) => {
          const d = Math.max(0, f - cX - i * 8);
          return <ellipse key={i} cx={-50 + i * 50} cy={720 + d * d * 0.12} rx={14} ry={20} fill={C.amber} opacity={d > 0 && d < 40 ? 1 : 0} />;
        })}
      </g>
      {/* materials */}
      <g transform={`translate(420 520) scale(${pop(f, cMat)})`}>
        <path d="M-80 -30 L-40 -80 H40 L80 -30 L0 80Z" fill="#bff3ff" />
        <path d="M-80 -30 H80 M-40 -80 L-20 -30 L0 80 L20 -30 L40 -80" stroke="#6fc9e6" strokeWidth={5} fill="none" />
        <path d={`M-10 -60 L${10 + m * 10} 0 L-5 40`} stroke="#22071f" strokeWidth={6} fill="none" opacity={m} />
        <text y={150} textAnchor="middle" fontFamily={FONT} fontSize={40} fontWeight={600} fill={C.cream}>เพชร</text>
      </g>
      <g transform={`translate(1500 520) scale(${pop(f, cMat + 6)})`}>
        <g transform={`scale(1 ${1 - m * 0.4}) translate(0 ${m * 40})`}>
          <rect x={-110} y={-50} width={220} height={100} rx={10} fill="url(#metal)" />
          <rect x={-110} y={-50} width={220} height={100} rx={10} fill={C.orange} opacity={m * 0.7} />
        </g>
        <text y={150} textAnchor="middle" fontFamily={FONT} fontSize={40} fontWeight={600} fill={C.cream}>ทังสเตน</text>
      </g>
      <g transform={`translate(960 540) scale(${pop(f, cX + 12) * 1.0})`} opacity={0.95}>
        <circle r={300} fill="none" stroke={C.red} strokeWidth={28} />
        <line x1={-212} y1={-212} x2={212} y2={212} stroke={C.red} strokeWidth={28} strokeLinecap="round" />
      </g>
    </Stage>
  );
};

/** Shot 10: seismic waves are the only things that cross the planet — that is how we know */
export const Waves: React.FC = () => {
  const f = useCurrentFrame();
  const s0 = SHOTS.waves;
  const cQuake = phF(9, 1) - s0 - 6, cKnow = phF(9, 2) - s0;
  const cx = 960, cy = 560, R = 430;
  const rc = R * (3480 / 6371), ri = R * (1220 / 6371);
  const q = { a: (-115 * Math.PI) / 180 };
  const qx = cx + Math.cos(q.a) * R, qy = cy + Math.sin(q.a) * R;
  const ends = [-60, -20, 15, 40, 60, 85, 100, 125, 150];
  const cam = { x: lerp(870, 1060, ramp(f, 0, 150)), y: 545, s: lerp(1.06, 0.96, ramp(f, 0, 150)) };
  return (
    <Stage cam={cam} bg={<SpaceBg hue={C.blue} />}>
      <Stars seed="waves" n={130} />
      <circle cx={cx} cy={cy} r={R * 1.15} fill="url(#atmo)" />
      <circle cx={cx} cy={cy} r={R} fill={C.crust} />
      <circle cx={cx} cy={cy} r={R * 0.975} fill="url(#mantle)" />
      <circle cx={cx} cy={cy} r={rc * 1.1} fill={C.outer0} opacity={0.3} filter="url(#blur12)" />
      <circle cx={cx} cy={cy} r={rc} fill="url(#outer)" />
      <circle cx={cx} cy={cy} r={ri} fill="url(#inner)" />
      {/* rays: bow away from the centre (speed rises with depth); through-core rays bend at the boundary */}
      {ends.map((deg, i) => {
        const a = (deg * Math.PI) / 180;
        const ex = cx + Math.cos(a) * R, ey = cy + Math.sin(a) * R;
        const mx = (qx + ex) / 2, my = (qy + ey) / 2;
        const dm = Math.hypot(mx - cx, my - cy);
        const k = dm < rc ? 0.55 : 1.25;
        const kx = cx + (mx - cx) * k + (dm < rc ? 40 : 0), ky = cy + (my - cy) * k;
        const t0 = cQuake + 4 + i * 2;
        const p = ramp(f, t0, t0 + 40 + (dm < rc ? 12 : 0), Easing.out(Easing.quad));
        const len = 2000;
        return (
          <g key={i}>
            <path d={`M${qx} ${qy} Q ${kx} ${ky} ${ex} ${ey}`} fill="none" stroke={C.cyan} strokeWidth={5} strokeLinecap="round"
              strokeDasharray={`${len * p} ${len}`} opacity={0.9} />
            {p >= 1 && (
              <g>
                <circle cx={ex} cy={ey} r={10} fill={C.mint} />
                <circle cx={ex} cy={ey} r={10 + ((f - t0 - 40) % 30)} fill="none" stroke={C.mint} strokeWidth={3} opacity={1 - ((f - t0 - 40) % 30) / 30} />
              </g>
            )}
          </g>
        );
      })}
      {/* epicentre */}
      <g transform={`translate(${qx} ${qy}) scale(${pop(f, cQuake)})`}>
        <circle r={60} fill={C.yellow} opacity={0.35} filter="url(#blur12)" />
        <path d="M0 -34 L10 -10 L34 -10 L14 6 L22 32 L0 16 L-22 32 L-14 6 L-34 -10 L-10 -10Z" fill={C.yellow} />
        {[0, 1, 2].map((i) => {
          const r = 20 + ((f - cQuake + i * 10) % 30) * 4;
          return f > cQuake ? <circle key={i} r={r} fill="none" stroke={C.yellow} strokeWidth={4} opacity={1 - r / 140} /> : null;
        })}
      </g>
      <Label x={330} y={170} at={cQuake + 2} text="คลื่นแผ่นดินไหว" color={C.cyan} size={50} px={qx - 10} py={qy - 10} />
      {/* what the waves revealed */}
      <Label x={1560} y={300} at={cKnow} text="แมนเทิล" color={C.cream} size={38} px={cx + R * 0.75} py={cy - R * 0.35} />
      <Label x={1600} y={560} at={cKnow + 8} text="แก่นชั้นนอก (เหลว)" color={C.amber} size={38} px={cx + rc * 0.7} py={cy} />
      <Label x={1560} y={820} at={cKnow + 16} text="แก่นชั้นใน (แข็ง)" color={C.yellow} size={38} px={cx + ri * 0.4} py={cy + ri * 0.4} />
    </Stage>
  );
};

/** Shot 11: back to space — the person listens; title */
export const Outro: React.FC = () => {
  const f = useCurrentFrame();
  const s0 = SHOTS.outro;
  const dur = TOTAL - s0;
  const cListen = phF(10, 2) - s0;
  const cTitle = segEndF(10) - s0 + 8;
  const cam = { x: 960, y: lerp(470, 560, ramp(f, 0, dur)), s: lerp(1.35, 1.0, ramp(f, 0, dur, Easing.inOut(Easing.sin))) };
  const R = 280, cy = 660;
  const fadeOut = 1 - ramp(f, dur - 22, dur - 2);
  return (
    <div style={{ position: "absolute", inset: 0, opacity: fadeOut, background: "#07021c" }}>
      <Stage cam={cam} bg={<SpaceBg hue={C.violet} />}
        overlay={
          <g opacity={ramp(f, cTitle, cTitle + 18)} transform={`translate(0 ${lerp(20, 0, ramp(f, cTitle, cTitle + 18))})`}>
            <text x={960} y={150} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={92} fill={C.cream}
              stroke="#140a3d" strokeWidth={12} paintOrder="stroke">ทำไมเราขุดทะลุโลกไม่ได้</text>
            <text x={960} y={218} textAnchor="middle" fontFamily={FONT} fontWeight={400} fontSize={40} fill={C.cyan}>แต่เรายังรู้ได้ ว่าข้างในมีอะไร</text>
          </g>
        }>
        <Stars seed="outro" n={200} x0={-300} y0={-300} w={2520} h={1680} />
        {[0, 1, 2, 3].map((i) => {
          const r = R + ((f * 2.2 + i * 70) % 280);
          return f > cListen - 10 ? <circle key={i} cx={960} cy={cy} r={r} fill="none" stroke={C.cyan} strokeWidth={3} opacity={(1 - (r - R) / 280) * 0.5} /> : null;
        })}
        <Planet cx={960} cy={cy} r={R} id="outro" spin={0.5} />
        <Person x={960} y={cy - R + 2} s={1.05} shovel={false} wave={ramp(f, cListen, cListen + 12)} />
        <g opacity={ramp(f, cListen, cListen + 12)}>
          {[0, 1, 2].map((i) => (
            <path key={i} d={`M${985 + i * 12} ${cy - R - 92 - i * 6} q 10 14 0 28`} stroke={C.mint} strokeWidth={4} fill="none" strokeLinecap="round"
              opacity={0.5 + 0.5 * Math.sin(f / 5 - i)} />
          ))}
        </g>
        <Label x={1420} y={cy - 240} at={phF(10, 1) - s0} text="ฟังเสียงจากใต้ดิน" color={C.mint} size={40} out={cTitle - 6} />
      </Stage>
    </div>
  );
};
