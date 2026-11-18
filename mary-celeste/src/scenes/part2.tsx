import React from "react";
import { useCurrentFrame, random, Easing } from "remotion";
import { Stage, SpaceBg, Stars, Label, Counter, useV } from "../common";
import { Sky, Sea, Ship, Barrel, Lifeboat } from "../sea";
import { C, FONT } from "../theme";
import { ramp, pop, lerp } from "../anim";
import { cF, cEndF, SHOTS, TOTAL } from "../timing";

const Cross: React.FC<{ at: number; r?: number }> = ({ at, r = 150 }) => {
  const f = useCurrentFrame();
  const p = pop(f, at);
  if (p <= 0) return null;
  return (
    <g transform={`scale(${p})`}>
      <circle r={r} fill="none" stroke={C.red} strokeWidth={20} />
      <line x1={-r * 0.7} y1={-r * 0.7} x2={r * 0.7} y2={r * 0.7} stroke={C.red} strokeWidth={20} strokeLinecap="round" />
    </g>
  );
};

/** Shot 7: what happened? pirates? — no struggle, nothing stolen */
export const Pirates: React.FC = () => {
  const f = useCurrentFrame();
  const s0 = SHOTS.pirates;
  const cPir = cF(16) - s0, cNoFight = cF(17) - s0, cNoSteal = cF(17) - s0 + 48;
  const cam = { x: lerp(900, 1020, ramp(f, 0, 170)), y: 540, s: lerp(1.1, 1.0, ramp(f, 0, 170)) };
  const q = pop(f, 0);
  const V = useV();
  const vcam = { x: 960, y: lerp(660, 620, ramp(f, 0, 170)), s: lerp(1.06, 1.0, ramp(f, 0, 170)) };
  const qx = V ? 960 : lerp(960, 330, ramp(f, cPir - 6, cPir + 18));
  const qy = V ? lerp(560, 130, ramp(f, cPir - 6, cPir + 18)) : 560;
  return (
    <Stage cam={cam} vcam={vcam} bg={<SpaceBg hue="#3a1060" />}>
      <Stars seed="pir" n={120} x0={-100} w={2120} />
      {/* big question mark that slides aside */}
      <g transform={`translate(${qx} ${qy}) scale(${q * lerp(1, 0.65, ramp(f, cPir - 6, cPir + 18))})`}>
        <circle r={230} fill={C.violet} opacity={0.5} filter="url(#blur30)" />
        <text y={130} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={400} fill={C.amber} stroke="#140a3d" strokeWidth={16} paintOrder="stroke">?</text>
        <text y={250} textAnchor="middle" fontFamily={FONT} fontWeight={600} fontSize={64} fill={C.cream} opacity={1 - ramp(f, cPir, cPir + 10)}>เกิดอะไรขึ้น?</text>
      </g>
      {/* theory card: pirates */}
      <g transform={`translate(960 ${V ? 640 : 520}) scale(${pop(f, cPir)})`}>
        <rect x={-210} y={-230} width={420} height={460} rx={34} fill="#1a0f45" stroke={C.lilac} strokeOpacity={0.4} strokeWidth={3} />
        <rect x={-6} y={-170} width={12} height={250} fill="#c9cbe8" />
        <path d={`M6 -170 h150 q ${-10 + Math.sin(f / 5) * 8} 50 0 100 h-150Z`} fill="#140a1e" />
        <circle cx={80} cy={-125} r={22} fill="#f6f3e6" />
        <rect x={68} y={-110} width={24} height={14} rx={4} fill="#f6f3e6" />
        <circle cx={72} cy={-128} r={6} fill="#140a1e" /><circle cx={88} cy={-128} r={6} fill="#140a1e" />
        <path d="M48 -90 L112 -78 M112 -90 L48 -78" stroke="#f6f3e6" strokeWidth={7} strokeLinecap="round" />
        <text y={170} textAnchor="middle" fontFamily={FONT} fontWeight={600} fontSize={50} fill={C.cream}>โจรสลัด?</text>
        <g transform="translate(0 -40)"><Cross at={cNoFight + 10} r={170} /></g>
      </g>
      <Label x={V ? 960 : 1520} y={V ? 1000 : 420} at={cNoFight + 4} text="ไม่มีร่องรอยการต่อสู้" color={C.mint} size={42} />
      <g transform={`translate(${V ? 960 : 1520} ${V ? 1170 : 650}) scale(${pop(f, cNoSteal)})`}>
        {[0, 1, 2, 3, 4].map((i) => <ellipse key={i} cx={-60 + i * 30} cy={20 - (i % 2) * 8} rx={28} ry={10} fill={C.yellow} stroke="#b88a1a" strokeWidth={3} />)}
        <path d="M40 -30 L70 -60 L100 -30 L70 20Z" fill={C.cyan} />
        <text y={100} textAnchor="middle" fontFamily={FONT} fontWeight={600} fontSize={38} fill={C.cream}>ไม่มีอะไรถูกขโมย</text>
      </g>
    </Stage>
  );
};

/** Shot 8: the theory historians favour — alcohol vapour, fear of an explosion, everyone into the lifeboat */
export const Vapour: React.FC = () => {
  const f = useCurrentFrame();
  const s0 = SHOTS.vapour;
  const cLeak = cF(19) - s0, cFear = cF(20) - s0, cBoat = cF(20) - s0 + 60;
  const toBoat = ramp(f, cBoat - 10, cBoat + 25);
  const cam = { x: lerp(lerp(900, 1000, ramp(f, 0, cBoat)), 700, toBoat), y: lerp(520, 640, toBoat), s: lerp(1.2, 1.0, toBoat) };
  const vap = ramp(f, cLeak - 10, cFear + 20);
  const V = useV();
  const vcam = { x: lerp(lerp(960, 960, ramp(f, 0, cBoat)), 1000, toBoat), y: lerp(lerp(700, 660, ramp(f, 0, cBoat)), 660, toBoat), s: lerp(0.84, 0.8, toBoat) };
  return (
    <Stage cam={cam} vcam={vcam} bg={<rect width={1920} height={1080} fill="#1a0b2a" />}>
      <Label x={960} y={150} at={8} text="ทฤษฎีที่นักประวัติศาสตร์เชื่อกันมาก" color={C.cyan} size={44} out={cBoat - 10} />
      {/* the hold */}
      <g opacity={1 - toBoat}>
        <rect x={300} y={260} width={1320} height={640} rx={40} fill="#2c1530" stroke="#6b3a4a" strokeWidth={12} />
        {Array.from({ length: 21 }).map((_, i) => <Barrel key={i} x={400 + (i % 7) * 185} y={830 - Math.floor(i / 7) * 160} s={2.1} />)}
        {Array.from({ length: 26 }).map((_, i) => {
          const bx = 400 + (i % 7) * 185, by0 = 760 - Math.floor((i % 21) / 7) * 160;
          const t = ((f * (0.9 + random(`v${i}`) * 0.6) + random(`vo${i}`) * 120) % 120) / 120;
          return (
            <circle key={i} cx={bx + Math.sin(t * 6 + i) * 30} cy={by0 - t * 260} r={(16 + t * 50) * vap} fill="#b8e86a" opacity={(1 - t) * 0.45 * vap} filter="url(#blur12)" />
          );
        })}
        <Label x={960} y={240} at={cLeak} text="ไอแอลกอฮอล์รั่วออกจากถัง" color="#c6f07a" size={46} />
        {/* warning sign */}
        <g transform={`translate(${V ? 960 : 1500} ${V ? 1160 : 380}) scale(${pop(f, cFear)}) rotate(${Math.sin(f / 3) * 4 * ramp(f, cFear, cFear + 10)})`}>
          <circle r={120} fill={C.red} opacity={0.35} filter="url(#blur30)" />
          <path d="M0 -95 L95 75 L-95 75Z" fill={C.yellow} stroke="#140a3d" strokeWidth={10} strokeLinejoin="round" />
          <rect x={-9} y={-35} width={18} height={65} rx={9} fill="#140a3d" />
          <circle cy={52} r={10} fill="#140a3d" />
        </g>
        <Label x={V ? 960 : 1500} y={V ? 1340 : 560} at={cFear + 6} text="กลัวเรือระเบิด" color={C.yellow} size={40} />
      </g>
      {/* everyone into the lifeboat */}
      <g opacity={toBoat}>
        <Sky id="vap" horizon={700} moon={[1600, 160]} />
        <Sea layer="back" horizon={700} />
        <g transform="translate(1150 720) scale(1.1)"><Ship x={0} y={0} lifeboat={false} bob={0.5} /></g>
        <Lifeboat x={lerp(820, 640, ramp(f, cBoat, cBoat + 60))} y={760} s={1.5} people={10} />
        <Sea layer="front" horizon={700} />
        <Label x={640} y={540} at={cBoat + 10} text="ทุกคนลงเรือชูชีพ" color={C.amber} size={42} />
      </g>
    </Stage>
  );
};

/** Shot 9: the tow line snaps and the small boat drifts away */
export const Rope: React.FC = () => {
  const f = useCurrentFrame();
  const s0 = SHOTS.rope;
  const cSnap = cF(21) - s0 + 30, cDrift = cF(22) - s0;
  const snap = ramp(f, cSnap, cSnap + 12);
  const drift = ramp(f, cSnap, cDrift + 70, Easing.in(Easing.quad));
  const boatX = lerp(700, -60, drift), shipX = 1400 + f * 0.6;
  const cam = { x: lerp(1000, 820, ramp(f, 0, 140)), y: 560, s: 1.05 };
  const sternX = shipX - 290 * 0.8, sternY = 700;
  const vcam = { x: lerp(1080, 960, ramp(f, 0, 140)), y: 640, s: 0.76 };
  return (
    <Stage cam={cam} vcam={vcam}>
      <Sky id="rope" horizon={660} moon={[500, 170]} warm="#9a3f72" />
      <Sea layer="back" horizon={660} storm={1.4} />
      <Ship x={shipX} y={700} s={0.8} lifeboat={false} />
      <Lifeboat x={boatX} y={740} s={1.4} people={10} />
      <Sea layer="front" horizon={660} storm={1.4} />
      {/* the rope: taut, then two loose ends */}
      {snap < 1 ? (
        <path d={`M${boatX + 110} 730 Q ${(boatX + sternX) / 2} ${745 + snap * 30} ${sternX} ${sternY - 20}`} stroke="#e8d7b0" strokeWidth={6} fill="none" />
      ) : (
        <>
          <path d={`M${boatX + 110} 730 q 80 ${30 + Math.sin(f / 5) * 10} 160 ${60}`} stroke="#e8d7b0" strokeWidth={6} fill="none" />
          <path d={`M${sternX} ${sternY - 20} q -90 ${20 + Math.sin(f / 4) * 14} -170 ${70}`} stroke="#e8d7b0" strokeWidth={6} fill="none" />
        </>
      )}
      {f >= cSnap && f < cSnap + 14 && (
        <g transform={`translate(${(boatX + sternX) / 2} 740)`}>
          {Array.from({ length: 8 }).map((_, i) => {
            const a = (i / 8) * Math.PI * 2, r = (f - cSnap) * 7;
            return <line key={i} x1={Math.cos(a) * r * 0.4} y1={Math.sin(a) * r * 0.4} x2={Math.cos(a) * r} y2={Math.sin(a) * r} stroke={C.yellow} strokeWidth={6} strokeLinecap="round" />;
          })}
        </g>
      )}
      {/* fog rolling in */}
      <rect x={-600} y={500} width={1400} height={500} fill={C.lilac} opacity={0.35 * ramp(f, cDrift, cDrift + 60)} filter="url(#blur30)" />
      <Label x={1000} y={420} at={cSnap - 4} text="เชือกที่ผูกไว้ อาจขาด" color={C.cream} size={44} />
    </Stage>
  );
};

/** Shot 10: none of the ten were ever found — to this day */
export const Empty: React.FC = () => {
  const f = useCurrentFrame();
  const s0 = SHOTS.empty;
  const cToday = cF(24) - s0, cKnow = cF(25) - s0;
  const cam = { x: lerp(860, 1060, ramp(f, 0, 160)), y: lerp(560, 520, ramp(f, 0, 160)), s: lerp(1.0, 1.08, ramp(f, 0, 160)) };
  const vcam = { x: lerp(920, 1000, ramp(f, 0, 160)), y: lerp(640, 600, ramp(f, 0, 160)), s: lerp(1.08, 1.16, ramp(f, 0, 160)) };
  return (
    <Stage cam={cam} vcam={vcam}>
      <Sky id="empty" horizon={620} moon={[1500, 210]} warm="#5a2a6a" />
      <Sea layer="back" horizon={620} />
      <rect x={-400} y={480} width={2800} height={300} fill={C.lilac} opacity={0.18} filter="url(#blur30)" />
      <Sea layer="front" horizon={620} />
      <g transform="translate(960 380)">
        {Array.from({ length: 10 }).map((_, i) => {
          const o = pop(f, 6 + i * 2) * (1 - 0.75 * ramp(f, 40 + i * 4, 52 + i * 4));
          return (
            <g key={i} transform={`translate(${-405 + i * 90} 0) scale(1.3)`} opacity={o}>
              <rect x={-12} y={-44} width={24} height={34} rx={10} fill={i === 0 ? C.amber : i < 3 ? C.pink : C.teal} />
              <circle cx={0} cy={-56} r={11} fill="#ffd9b8" />
            </g>
          );
        })}
      </g>
      <Label x={960} y={480} at={20} text="ไม่มีใครพบทั้ง 10 คนอีกเลย" color={C.cream} size={48} />
      <Counter x={960} y={760} a={cToday} b={cToday + 40} from={1872} to={2026} unit="" group={false} size={130} color={C.amber} />
      <Label x={960} y={860} at={cKnow} text="ยังไม่มีใครรู้ความจริง" color={C.cyan} size={44} />
    </Stage>
  );
};

/** Shot 11: the ghost ship in moonlight — what do you think happened? */
export const Outro: React.FC = () => {
  const f = useCurrentFrame();
  const s0 = SHOTS.outro;
  const dur = TOTAL - s0;
  const cComment = cF(27) - s0;
  const cam = { x: lerp(1100, 960, ramp(f, 0, dur)), y: lerp(600, 540, ramp(f, 0, dur)), s: lerp(1.25, 1.0, ramp(f, 0, dur, Easing.inOut(Easing.sin))) };
  const fadeOut = 1 - ramp(f, dur - 20, dur - 2);
  const V = useV();
  const vcam = { x: lerp(1160, 1120, ramp(f, 0, dur)), y: lerp(640, 600, ramp(f, 0, dur)), s: lerp(1.15, 0.95, ramp(f, 0, dur, Easing.inOut(Easing.sin))) };
  const ov = (
          <g>
            <g opacity={ramp(f, 8, 22)}>
              <text x={960} y={170} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={96} fill={C.cream} stroke="#140a3d" strokeWidth={12} paintOrder="stroke">แมรี เซเลสต์</text>
              <text x={960} y={240} textAnchor="middle" fontFamily={FONT} fontWeight={500} fontSize={44} fill={C.cyan}>คุณคิดว่าเกิดอะไรขึ้น?</text>
            </g>
            <g transform={`translate(1560 860) scale(${pop(f, cComment)})`}>
              <rect x={-170} y={-70} width={340} height={120} rx={30} fill={C.cream} />
              <path d="M-90 46 L-110 96 L-50 46Z" fill={C.cream} />
              {[0, 1, 2].map((i) => <circle key={i} cx={-70 + i * 70} cy={-10} r={16} fill={C.violet} opacity={0.5 + 0.5 * Math.sin(f / 4 - i)} />)}
            </g>
            <text x={1560} y={1000} textAnchor="middle" fontFamily={FONT} fontWeight={600} fontSize={40} fill={C.cream} opacity={ramp(f, cComment + 6, cComment + 16)}>คอมเมนต์บอกกันหน่อย</text>
          </g>
  );
  const vov = (
    <g>
      <g opacity={ramp(f, 8, 22)}>
        <text x={540} y={330} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={110} fill={C.cream} stroke="#140a3d" strokeWidth={14} paintOrder="stroke">แมรี เซเลสต์</text>
        <text x={540} y={415} textAnchor="middle" fontFamily={FONT} fontWeight={500} fontSize={52} fill={C.cyan}>คุณคิดว่าเกิดอะไรขึ้น?</text>
      </g>
      <g transform={`translate(540 1380) scale(${pop(f, cComment) * 1.2})`}>
        <rect x={-170} y={-70} width={340} height={120} rx={30} fill={C.cream} />
        <path d="M-90 46 L-110 96 L-50 46Z" fill={C.cream} />
        {[0, 1, 2].map((i) => <circle key={i} cx={-70 + i * 70} cy={-10} r={16} fill={C.violet} opacity={0.5 + 0.5 * Math.sin(f / 4 - i)} />)}
      </g>
      <text x={540} y={1560} textAnchor="middle" fontFamily={FONT} fontWeight={600} fontSize={48} fill={C.cream} opacity={ramp(f, cComment + 6, cComment + 16)}>คอมเมนต์บอกกันหน่อย</text>
    </g>
  );
  return (
    <div style={{ position: "absolute", inset: 0, opacity: fadeOut, background: "#07021c" }}>
      <Stage cam={cam} vcam={vcam} overlay={ov} voverlay={vov}>
        <Sky id="outro" horizon={680} moon={V ? [1360, 260] : [380, 380]} warm="#4a2470" />
        <Sea layer="back" horizon={680} />
        <rect x={300} y={680} width={800} height={14} fill={C.cream} opacity={0.25} filter="url(#blur4)" />
        <Ship x={1150} y={705} s={0.7} torn={1} ghost={1} lifeboat={false} name />
        <rect x={-400} y={560} width={2800} height={260} fill={C.lilac} opacity={0.14} filter="url(#blur30)" />
        <Sea layer="front" horizon={680} />
      </Stage>
    </div>
  );
};
