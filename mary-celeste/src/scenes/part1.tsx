import React from "react";
import { useCurrentFrame, random, Easing } from "remotion";
import { Stage, Person, Label, Counter, useV } from "../common";
import { Sky, Sea, Ship, Barrel } from "../sea";
import { C, FONT } from "../theme";
import { ramp, pop, lerp } from "../anim";
import { cF, SHOTS } from "../timing";

const BigText: React.FC<{ x: number; y: number; at: number; text: string; sub?: string; size?: number; color?: string }> = ({
  x, y, at, text, sub, size = 110, color = C.cream,
}) => {
  const f = useCurrentFrame();
  const p = pop(f, at);
  if (p <= 0.001) return null;
  return (
    <g transform={`translate(${x} ${y}) scale(${p})`}>
      <text textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={size} fill={color} stroke="#140a3d" strokeWidth={14} paintOrder="stroke">{text}</text>
      {sub && <text y={size * 0.62} textAnchor="middle" fontFamily={FONT} fontWeight={500} fontSize={size * 0.38} fill={C.cyan}>{sub}</text>}
    </g>
  );
};

/** Shot 1: December 1872, the middle of the Atlantic at dusk */
export const Intro: React.FC = () => {
  const f = useCurrentFrame();
  const s0 = SHOTS.intro;
  const V = useV();
  const cam = { x: lerp(860, 1060, ramp(f, 0, 190)), y: lerp(560, 500, ramp(f, 0, 190)), s: lerp(1.0, 1.12, ramp(f, 0, 190)) };
  const vcam = { x: lerp(900, 1020, ramp(f, 0, 190)), y: lerp(600, 540, ramp(f, 0, 190)), s: lerp(0.92, 1.02, ramp(f, 0, 190)) };
  return (
    <Stage cam={cam} vcam={vcam}>
      <Sky id="intro" moon={V ? [1200, 120] : [1450, 230]} />
      <Sea layer="back" />
      <g opacity={ramp(f, cF(1) - s0, cF(1) - s0 + 20)}><Ship x={V ? 1230 : 1500} y={652} s={V ? 0.22 : 0.16} torn={1} bob={0.5} /></g>
      <Sea layer="front" />
      <BigText x={960} y={V ? 300 : 360} at={10} text="ธันวาคม ค.ศ. 1872" sub="(พ.ศ. 2415)" size={V ? 96 : 110} />
      <Label x={960} y={880} at={cF(1) - s0} text="กลางมหาสมุทรแอตแลนติก" color={C.cyan} size={46} />
    </Stage>
  );
};

/** Shot 2: a passing crew spots a ship drifting — telescope view */
export const Spot: React.FC = () => {
  const f = useCurrentFrame();
  const s0 = SHOTS.spot;
  const cScope = cF(3) - s0 - 20;
  const cam = { x: lerp(900, 1020, ramp(f, 0, 150)), y: 540, s: 1.02 };
  const vcam = { x: lerp(820, 900, ramp(f, 0, 150)), y: 660, s: 0.95 };
  const sc = ramp(f, cScope, cScope + 18, Easing.out(Easing.back(1.4)));
  const ov = sc > 0 ? (
        <g>
          <clipPath id="scope"><circle cx={1250} cy={470} r={320 * sc} /></clipPath>
          <g clipPath="url(#scope)">
            <rect width={1920} height={1080} fill={C.space1} />
            <g transform="translate(1250 470) scale(1.6) translate(-1250 -560)">
              <Sky id="scope" horizon={640} moon={null} />
              <Sea layer="back" />
              <Ship x={1250} y={650} s={0.55} torn={1} />
              <Sea layer="front" />
            </g>
          </g>
          <circle cx={1250} cy={470} r={320 * sc} fill="none" stroke="#2a1a3a" strokeWidth={34} />
          <circle cx={1250} cy={470} r={320 * sc} fill="none" stroke="url(#metal)" strokeWidth={14} />
          <Label x={1250} y={880} at={cScope + 10} text="ลอยไปมา ไร้คนบังคับ" color={C.amber} size={42} />
        </g>
      ) : null;
  return (
    <Stage cam={cam} vcam={vcam} overlay={ov}
      voverlay={<g transform="translate(540 600) scale(0.85) translate(-1250 -470)">{ov}</g>}>

      <Sky id="spot" moon={[400, 200]} />
      <Sea layer="back" />
      <Ship x={1250} y={650} s={0.2} torn={1} bob={0.6} />
      <Sea layer="front" />
      {/* the observers' ship rail in the foreground */}
      <rect x={-200} y={930} width={2400} height={1300} fill="#2a1428" />
      <rect x={-200} y={915} width={2400} height={26} rx={8} fill="#6b3a4a" />
      {Array.from({ length: 14 }).map((_, i) => <rect key={i} x={-150 + i * 170} y={940} width={18} height={200} fill="#4a2338" />)}
      <rect x={-200} y={1140} width={2400} height={14} fill="#6b3a4a" />
      {Array.from({ length: 12 }).map((_, i) => <line key={i} x1={-200} y1={1200 + i * 60} x2={2200} y2={1200 + i * 60} stroke="#3a1a34" strokeWidth={4} />)}
      <g transform="translate(470 930)">
        <Person x={0} y={0} s={2.4} shovel={false} wave={1} />
        <rect x={20} y={-200} width={130} height={22} rx={8} fill="url(#metal)" transform="rotate(-8 20 -190)" />
      </g>
      <Person x={260} y={930} s={2.1} shovel={false} wave={Math.sin(f / 7)} />
    </Stage>
  );
};

/** Shot 3: on board — nobody at all; the name board */
export const Deck: React.FC = () => {
  const f = useCurrentFrame();
  const s0 = SHOTS.deck;
  const cName = cF(5) - s0;
  const toName = ramp(f, cName - 6, cName + 24);
  const cam = { x: lerp(lerp(820, 940, ramp(f, 0, cName)), 1500, toName), y: lerp(560, 600, toName), s: lerp(1.0, 1.25, toName) };
  const vcam = { x: lerp(lerp(560, 720, ramp(f, 0, cName)), 1500, toName), y: lerp(640, 640, toName), s: lerp(1.0, 1.3, toName) };
  const door = Math.sin(f / 20) * 18;
  return (
    <Stage cam={cam} vcam={vcam} bg={<rect width={1920} height={1080} fill={C.space1} />}>
      <Sky id="deck" horizon={720} moon={[300, 180]} w={2600} />
      <Sea layer="back" horizon={720} w={3400} />
      {/* deck */}
      <rect x={-300} y={760} width={2700} height={1600} fill="#6b3f3a" />
      {Array.from({ length: 50 }).map((_, i) => <line key={i} x1={-300} y1={780 + i * (i < 12 ? 30 : 30 + (i - 12) * 1.5)} x2={2400} y2={780 + i * 30} stroke="#4f2b2c" strokeWidth={3} />)}
      <rect x={-300} y={700} width={2700} height={18} fill="#8a5a46" />
      {Array.from({ length: 26 }).map((_, i) => <rect key={i} x={-280 + i * 105} y={716} width={12} height={48} fill="#5a3330" />)}
      {/* cabin with a door swinging */}
      <rect x={180} y={480} width={460} height={290} fill="#7a4a3e" />
      <rect x={160} y={460} width={500} height={34} fill="#9b6650" />
      <rect x={260} y={560} width={70} height={60} rx={6} fill="#2a1a3a" />
      <rect x={500} y={560} width={70} height={60} rx={6} fill="#2a1a3a" />
      <rect x={370} y={570} width={90} height={200} fill="#1a0b1c" />
      <rect x={370} y={570} width={90} height={200} fill="#9b6650" transform={`skewY(${door}) `} style={{ transformOrigin: "370px 570px" }} />
      {/* mast foot, coiled rope, wheel, an abandoned hat */}
      <rect x={880} y={-200} width={34} height={970} fill="#5a3a2a" />
      {[0, 1, 2].map((i) => <ellipse key={i} cx={1050} cy={770 - i * 12} rx={70 - i * 12} ry={16} fill="none" stroke="#d9c49a" strokeWidth={9} />)}
      <Barrel x={760} y={730} s={1.3} />
      <Barrel x={690} y={740} s={1.1} />
      <g transform={`translate(1330 620) rotate(${Math.sin(f / 30) * 8})`}>
        <circle r={90} fill="none" stroke="#9b6650" strokeWidth={16} />
        {Array.from({ length: 8 }).map((_, i) => <line key={i} x1={0} y1={0} x2={Math.cos(i * 0.785) * 118} y2={Math.sin(i * 0.785) * 118} stroke="#9b6650" strokeWidth={12} strokeLinecap="round" />)}
        <circle r={18} fill="#c98a5a" />
      </g>
      <rect x={1318} y={630} width={24} height={140} fill="#5a3a2a" />
      <g transform="translate(1150 768)"><ellipse rx={46} ry={10} fill="#2a1a3a" /><path d="M-26 0 Q -24 -36 0 -38 Q 24 -36 26 0Z" fill="#2a1a3a" /></g>
      {/* stern name board */}
      <g transform="translate(1500 600)">
        <rect x={-300} y={-60} width={600} height={120} rx={20} fill="#3a1d33" stroke="#c9a46a" strokeWidth={8} />
        <text x={0} y={22} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={64} fill="#e8d7b0" letterSpacing={8}>MARY CELESTE</text>
        <circle cx={-260} cy={0} r={10} fill="#c9a46a" /><circle cx={260} cy={0} r={10} fill="#c9a46a" />
      </g>
      <Label x={560} y={300} at={20} text="ไม่มีใครอยู่เลยสักคน" color={C.amber} size={50} out={cName - 4} />
      <Label x={1500} y={430} at={cName + 8} text="แมรี เซเลสต์" sub="เรือใบสองเสา (brigantine)" color={C.cyan} size={48} />
    </Stage>
  );
};

/** Shot 4: the route on a map and the ten people aboard */
export const Route: React.FC = () => {
  const f = useCurrentFrame();
  const s0 = SHOTS.route;
  const cCap = cF(7) - s0, cFam = cF(8) - s0, cCrew = cF(9) - s0;
  const V = useV();
  const cam = { x: lerp(900, 1000, ramp(f, 0, 200)), y: lerp(520, 500, ramp(f, 0, 200)), s: lerp(1.08, 1.0, ramp(f, 0, 200)) };
  const vcam = { x: lerp(940, 1000, ramp(f, 0, 200)), y: lerp(640, 600, ramp(f, 0, 200)), s: lerp(0.84, 0.8, ramp(f, 0, 200)) };
  const ny = [330, 360], az = [1180, 470], found = [1330, 520], ge = [1640, 330];
  const p = ramp(f, 4, cCrew + 20, Easing.inOut(Easing.sin));
  const path = `M${ny[0]} ${ny[1]} C 700 520 1000 520 ${az[0]} ${az[1]} S ${found[0]} ${found[1]} ${found[0]} ${found[1]}`;
  const people: { col: string; at: number; small?: boolean }[] = [
    { col: C.amber, at: cCap }, { col: C.pink, at: cFam }, { col: C.pink, at: cFam + 8, small: true },
    ...Array.from({ length: 7 }).map((_, i) => ({ col: C.teal, at: cCrew + i * 3 })),
  ];
  return (
    <Stage cam={cam} vcam={vcam} bg={<rect width={1920} height={1080} fill="#123a8a" />}>
      <defs>
        <radialGradient id="mapsea" cx="50%" cy="45%" r="70%"><stop offset="0%" stopColor="#2a64c8" /><stop offset="100%" stopColor="#0f2a6e" /></radialGradient>
      </defs>
      <rect x={-400} y={-1500} width={2800} height={4000} fill="url(#mapsea)" />
      {Array.from({ length: 24 }).map((_, i) => <line key={i} x1={-400} y1={-1120 + i * 140} x2={2400} y2={-1120 + i * 140} stroke="#7fb5ff" strokeOpacity={0.12} strokeWidth={2} />)}
      {Array.from({ length: 15 }).map((_, i) => <line key={i} x1={i * 150} y1={-1500} x2={i * 150} y2={2500} stroke="#7fb5ff" strokeOpacity={0.12} strokeWidth={2} />)}
      {/* stylised coasts (not to scale) */}
      <path d="M-400 -1500 L520 -1500 L460 -100 Q 420 120 360 250 Q 300 330 330 400 Q 250 520 230 700 Q 180 900 160 1300 Q 260 1700 120 2500 L-400 2500Z" fill={C.land1} />
      <path d="M-400 -1500 L500 -1500 L440 -100 Q 400 120 340 240 Q 280 320 310 390 Q 230 510 210 690 Q 160 880 140 1290 Q 240 1700 100 2500 L-400 2500Z" fill={C.land0} />
      <path d="M2400 -1500 L1460 -1500 L1500 -100 Q 1560 120 1520 260 Q 1580 300 1600 280 Q 1660 330 1700 300 Q 1660 420 1500 460 Q 1440 600 1560 760 Q 1620 900 1700 1300 L1760 2500 L2400 2500Z" fill={C.land1} />
      <path d="M2400 -1500 L1480 -1500 L1520 -100 Q 1580 120 1540 250 Q 1600 290 1620 270 Q 1680 320 1720 290 Q 1680 410 1520 450 Q 1460 590 1580 750 Q 1640 890 1720 1300 L1780 2500 L2400 2500Z" fill={C.land0} />
      {[[1170, 465], [1190, 478], [1150, 455]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={6} fill={C.land0} />)}
      <path d={path} fill="none" stroke={C.cream} strokeWidth={6} strokeDasharray="4 14" strokeLinecap="round" pathLength={1000}
        style={{ strokeDashoffset: 0 }} opacity={0.35} />
      <path d={path} fill="none" stroke={C.yellow} strokeWidth={7} strokeLinecap="round" pathLength={1000} strokeDasharray={`${1000 * p} 1000`} />
      <path d={`M${found[0]} ${found[1]} Q 1500 430 ${ge[0]} ${ge[1]}`} fill="none" stroke={C.lilac} strokeWidth={4} strokeDasharray="10 12" opacity={0.6} />
      {[ny, ge].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={12} fill={C.cream} stroke="#140a3d" strokeWidth={4} />)}
      <circle cx={found[0]} cy={found[1]} r={16 * pop(f, cCrew + 20)} fill={C.red} />
      <circle cx={found[0]} cy={found[1]} r={34 * pop(f, cCrew + 20)} fill={C.red} opacity={0.3} />
      <Label x={V ? 450 : 330} y={260} at={4} text="นิวยอร์ก" sub="7 พ.ย. 1872" color={C.cream} size={40} />
      <Label x={V ? 1440 : 1690} y={V ? 190 : 230} at={14} text="ปลายทาง: เจนัว อิตาลี" color={C.lilac} size={34} />
      {/* the people aboard */}
      <g transform="translate(960 890)">
        <rect x={-560} y={-150} width={1120} height={270} rx={36} fill="#140a3d" opacity={0.85} />
        {people.map((q, i) => {
          const sc = pop(f, q.at) * (q.small ? 0.7 : 1);
          return (
            <g key={i} transform={`translate(${-470 + i * 104} 50) scale(${sc * 1.9})`}>
              <rect x={-12} y={-44} width={24} height={34} rx={10} fill={q.col} />
              <circle cx={0} cy={-56} r={11} fill="#ffd9b8" />
              {i === 0 && <rect x={-13} y={-71} width={26} height={8} rx={3} fill="#1d0c1c" />}
            </g>
          );
        })}
        <text x={-470} y={-100} textAnchor="middle" fontFamily={FONT} fontSize={34} fill={C.amber} opacity={ramp(f, cCap, cCap + 8)}>กัปตัน</text>
        <text x={-366} y={96} textAnchor="middle" fontFamily={FONT} fontSize={34} fill={C.pink} opacity={ramp(f, cFam, cFam + 8)}>ภรรยา + ลูกสาว 2 ขวบ</text>
        <text x={154} y={-100} textAnchor="middle" fontFamily={FONT} fontSize={34} fill={C.teal} opacity={ramp(f, cCrew, cCrew + 8)}>ลูกเรือ 7 คน</text>
      </g>
      <Counter x={V ? 960 : 1500} y={V ? 1210 : 760} a={cCrew + 18} b={cCrew + 30} from={3} to={10} unit="คน" size={84} />
    </Stage>
  );
};

/** Shot 5: a cut-away of the ship — in good shape, cargo untouched, food left, belongings left */
export const Cutaway: React.FC = () => {
  const f = useCurrentFrame();
  const s0 = SHOTS.cutaway;
  const cGood = cF(10) - s0 + 30, cCargo = cF(11) - s0, cFood = cF(11) - s0 + 95, cStuff = cF(12) - s0;
  const cam = {
    x: lerp(lerp(lerp(960, 760, ramp(f, cCargo - 10, cCargo + 30)), 1180, ramp(f, cFood - 10, cFood + 30)), 1400, ramp(f, cStuff - 6, cStuff + 30)),
    y: lerp(500, 580, ramp(f, cCargo - 10, cCargo + 30)), s: lerp(0.92, 1.25, ramp(f, cCargo - 10, cCargo + 30)),
  };
  const vcam = {
    x: lerp(lerp(lerp(1000, 760, ramp(f, cCargo - 10, cCargo + 30)), 1180, ramp(f, cFood - 10, cFood + 30)), 1420, ramp(f, cStuff - 6, cStuff + 30)),
    y: lerp(560, 620, ramp(f, cCargo - 10, cCargo + 30)),
    s: lerp(lerp(lerp(0.74, 1.0, ramp(f, cCargo - 10, cCargo + 30)), 1.1, ramp(f, cFood - 10, cFood + 30)), 1.2, ramp(f, cStuff - 6, cStuff + 30)),
  };
  const check = (x: number, y: number, at: number) => {
    const p = pop(f, at);
    return p > 0 ? (
      <g transform={`translate(${x} ${y}) scale(${p})`}>
        <circle r={38} fill={C.land0} /><path d="M-16 0 L-4 13 L18 -12" stroke="#fff" strokeWidth={9} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    ) : null;
  };
  return (
    <Stage cam={cam} vcam={vcam}>
      <Sky id="cut" horizon={700} moon={[1700, 150]} w={2200} />
      <Sea layer="back" horizon={700} />
      <g transform="translate(960 640) scale(1.9)">
        <Ship x={0} y={0} s={1} bob={0} />
      </g>
      {/* interior cut-out drawn over the hull */}
      <g>
        <path d="M480 600 L1500 600 L1500 790 Q 1400 820 1300 826 L640 826 Q 540 815 480 760Z" fill="#26101f" stroke="#e8d7b0" strokeWidth={5} />
        <line x1={1080} y1={600} x2={1080} y2={826} stroke="#6b3a4a" strokeWidth={8} />
        <line x1={1290} y1={600} x2={1290} y2={826} stroke="#6b3a4a" strokeWidth={8} />
        {Array.from({ length: 24 }).map((_, i) => (
          <g key={i} opacity={ramp(f, cCargo + i, cCargo + i + 6)}>
            <Barrel x={545 + (i % 8) * 64} y={792 - Math.floor(i / 8) * 62} s={0.95} />
          </g>
        ))}
        {[0, 1, 2, 3].map((i) => (
          <g key={i} transform={`translate(${1110 + (i % 2) * 85} ${770 - Math.floor(i / 2) * 70}) scale(${pop(f, cFood + i * 3)})`}>
            <rect x={-36} y={-28} width={72} height={56} rx={4} fill="#c98a5a" /><path d="M-36 -28 L36 28 M36 -28 L-36 28" stroke="#8a5a3a" strokeWidth={4} />
          </g>
        ))}
        {/* belongings: hanging coat, a toy, a chest, a lamp */}
        <g transform={`scale(${1})`} opacity={ramp(f, cStuff, cStuff + 10)}>
          <path d="M1330 640 l20 0 l14 90 l-48 0Z" fill={C.blue} />
          <rect x={1380} y={760} width={70} height={50} rx={6} fill="#7a4a3a" /><rect x={1380} y={760} width={70} height={14} fill="#9b6650" />
          <circle cx={1470} cy={792} r={16} fill={C.pink} /><circle cx={1470} cy={770} r={10} fill="#ffd9b8" />
          <circle cx={1420} cy={640} r={12} fill={C.amber} /><circle cx={1420} cy={640} r={34} fill={C.amber} opacity={0.35} filter="url(#blur12)" />
        </g>
      </g>
      {check(960, 330, cGood)}
      <Label x={960} y={240} at={cGood} text="เรือยังอยู่ในสภาพดี" color={C.mint} size={46} out={cCargo + 10} />
      <g opacity={1 - ramp(f, cFood - 12, cFood)}><Counter x={760} y={500} a={cCargo + 6} b={cCargo + 40} to={1701} unit="ถังแอลกอฮอล์" size={70} /></g>
      <Label x={760} y={560} at={cCargo + 50} text="แทบไม่ถูกแตะต้อง" color={C.cream} size={34} out={cFood - 10} />
      <Label x={1180} y={500} at={cFood} text="เสบียงพอกินอีกราว 6 เดือน" color={C.amber} size={38} out={cStuff - 6} />
      <Label x={1400} y={520} at={cStuff + 6} text="ข้าวของส่วนตัว ยังอยู่ครบ" color={C.pink} size={34} />
    </Stage>
  );
};

/** Shot 6: what is missing — one lifeboat, and the log's last entry */
export const Missing: React.FC = () => {
  const f = useCurrentFrame();
  const s0 = SHOTS.missing;
  const cLog = cF(14) - s0;
  const toLog = ramp(f, cLog - 8, cLog + 22);
  const cam = { x: lerp(lerp(700, 820, ramp(f, 0, cLog)), 1350, toLog), y: lerp(560, 520, toLog), s: lerp(1.3, 1.15, toLog) };
  const page = ramp(f, cLog + 8, cLog + 30);
  const vcam = { x: lerp(lerp(700, 780, ramp(f, 0, cLog)), 1350, toLog), y: lerp(620, 600, toLog), s: lerp(1.2, 1.25, toLog) };
  return (
    <Stage cam={cam} vcam={vcam}>
      <Sky id="miss" horizon={720} moon={[300, 160]} w={2200} />
      <Sea layer="back" horizon={720} />
      <g transform="translate(900 700) scale(1.4)"><Ship x={0} y={0} lifeboat={false} bob={0.5} /></g>
      <Sea layer="front" horizon={720} />
      <g opacity={0.5 + 0.5 * Math.sin(f / 6)}>
        <circle cx={658} cy={650} r={95} fill="none" stroke={C.amber} strokeWidth={6} strokeDasharray="14 10" />
      </g>
      <Label x={640} y={470} at={12} text="เรือชูชีพ 1 ลำ — หายไป" color={C.amber} size={44} px={658} py={560} />
      {/* the log book */}
      <g transform={`translate(1350 560) scale(${pop(f, cLog)})`}>
        <rect x={-330} y={-200} width={660} height={400} rx={18} fill="#5a2a2a" />
        <rect x={-310} y={-185} width={300} height={370} fill="#f1e6c8" />
        <rect x={10} y={-185} width={300} height={370} fill="#f6eed6" />
        {Array.from({ length: 9 }).map((_, i) => <line key={i} x1={-290} x2={-30} y1={-140 + i * 36} y2={-140 + i * 36} stroke="#b9a77f" strokeWidth={3} />)}
        {Array.from({ length: 5 }).map((_, i) => (
          <line key={i} x1={30} x2={30 + 250 * Math.min(1, Math.max(0, page * 5 - i))} y1={-60 + i * 36} y2={-60 + i * 36} stroke="#3a2a3a" strokeWidth={4} strokeLinecap="round" />
        ))}
        <text x={160} y={-115} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={38} fill="#5a2a2a" opacity={page}>25 พ.ย. 1872</text>
        <text x={160} y={150} textAnchor="middle" fontFamily={FONT} fontSize={26} fill="#7a5a4a" opacity={page}>…ใกล้หมู่เกาะอะซอเรส</text>
      </g>
      <Label x={1350} y={300} at={cLog + 10} text="บันทึกหน้าสุดท้าย" color={C.cream} size={42} />
    </Stage>
  );
};
