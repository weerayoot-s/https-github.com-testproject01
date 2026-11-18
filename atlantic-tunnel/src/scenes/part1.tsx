import React from "react";
import { useCurrentFrame, random, Easing } from "remotion";
import { Stage, SpaceBg, Stars, Label, Counter } from "../common";
import { Sky, Sea } from "../sea";
import { Train, Plane, RedX, Title } from "../props";
import { C, FONT } from "../theme";
import { ramp, pop, lerp } from "../anim";
import { cF, SHOTS } from "../timing";

/** small stylised North Atlantic map card (not to scale) */
const MiniMap: React.FC<{ x: number; y: number; s?: number; p: number }> = ({ x, y, s = 1, p }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-420} y={-230} width={840} height={460} rx={40} fill="#1f4fb5" stroke={C.lilac} strokeOpacity={0.5} strokeWidth={4} />
    <clipPath id="mm"><rect x={-420} y={-230} width={840} height={460} rx={40} /></clipPath>
    <g clipPath="url(#mm)">
      <path d="M-420 -230 L-230 -230 Q -250 -120 -300 -40 Q -280 40 -330 120 Q -350 200 -320 230 L-420 230Z" fill={C.land0} />
      <path d="M420 -230 L230 -230 Q 250 -170 215 -120 Q 260 -110 250 -60 Q 290 0 260 80 Q 300 160 280 230 L420 230Z" fill={C.land0} />
      <path d="M205 -150 Q 190 -120 210 -95 Q 230 -110 225 -140Z" fill={C.land0} />
      <path d="M-300 -30 Q 0 -200 222 -110" fill="none" stroke={C.yellow} strokeWidth={7} strokeDasharray="4 14" strokeLinecap="round"
        pathLength={100} strokeDashoffset={0} opacity={0.4} />
      <path d="M-300 -30 Q 0 -200 222 -110" fill="none" stroke={C.yellow} strokeWidth={8} strokeLinecap="round" pathLength={100} strokeDasharray={`${100 * p} 100`} />
    </g>
    <circle cx={-300} cy={-30} r={12} fill={C.cream} stroke="#0b0430" strokeWidth={4} />
    <circle cx={222} cy={-110} r={12} fill={C.cream} stroke="#0b0430" strokeWidth={4} />
    <text x={-300} y={20} textAnchor="middle" fontFamily={FONT} fontWeight={600} fontSize={36} fill={C.cream} stroke="#0b0430" strokeWidth={6} paintOrder="stroke">นิวยอร์ก</text>
    <text x={222} y={-140} textAnchor="middle" fontFamily={FONT} fontWeight={600} fontSize={36} fill={C.cream} stroke="#0b0430" strokeWidth={6} paintOrder="stroke">ลอนดอน</text>
  </g>
);

/** Shot 1: board a train in New York... come out in London, no plane */
export const Hook: React.FC = () => {
  const f = useCurrentFrame();
  const s0 = SHOTS.hook;
  const cLon = cF(1) - s0, cPlane = cF(1) - s0 + 45;
  const cam = { x: 540, y: lerp(1000, 940, ramp(f, 0, 180)), s: lerp(1.04, 1.1, ramp(f, 0, 180)) };
  const tx = lerp(-700, 1300, ramp(f, 0, 170, Easing.inOut(Easing.quad)));
  return (
    <Stage cam={cam}>
      <Sky id="hook" horizon={1300} moon={[860, 520]} w={1080} x0={0} />
      {/* skyline */}
      {Array.from({ length: 16 }).map((_, i) => {
        const w = 60 + random(`bw${i}`) * 70, h = 160 + random(`bh${i}`) * 420, x = -100 + i * 85;
        return (
          <g key={i}>
            <rect x={x} y={1300 - h} width={w} height={h + 40} fill={i % 2 ? "#1d1550" : "#261a62"} />
            {Array.from({ length: Math.floor(h / 40) }).map((_, k) => (
              <rect key={k} x={x + 12} y={1300 - h + 18 + k * 40} width={w - 24} height={10} fill={C.yellow}
                opacity={random(`win${i}-${k}`) > 0.45 ? 0.55 : 0.08} />
            ))}
          </g>
        );
      })}
      {/* elevated track */}
      <rect x={-300} y={1300} width={1700} height={900} fill="#120a33" />
      <rect x={-300} y={1300} width={1700} height={22} fill="#5a6488" />
      {Array.from({ length: 12 }).map((_, i) => <rect key={i} x={-260 + i * 140} y={1322} width={18} height={140} fill="#2a2466" />)}
      <Train x={tx} y={1300} L={700} />
      {[0, 1, 2].map((i) => <rect key={i} x={tx - 220 - i * 60} y={1235 + i * 18} width={160} height={5} rx={2} fill={C.cream} opacity={0.35} />)}
      <Title x={540} y={260} at={6} text="ขึ้นรถไฟที่นิวยอร์ก" size={80} />
      <MiniMap x={540} y={580} s={pop(f, cLon)} p={ramp(f, cLon, cLon + 40)} />
      <g transform={`translate(540 1600) scale(${pop(f, cPlane)})`}>
        <Plane x={0} y={0} s={1.3} />
      </g>
      <RedX x={540} y={1600} at={cPlane + 8} r={150} />
      <Label x={540} y={1800} at={cPlane + 10} text="ไม่ต้องขึ้นเครื่องบิน?" color={C.amber} size={48} />
    </Stage>
  );
};

/** Shot 2: the Channel Tunnel — cross-section of the English Channel */
export const Channel: React.FC = () => {
  const f = useCurrentFrame();
  const s0 = SHOTS.channel;
  const cName = cF(3) - s0, cYears = cF(4) - s0;
  const cam = { x: lerp(500, 580, ramp(f, 0, 220)), y: lerp(940, 1000, ramp(f, 0, 220)), s: lerp(1.0, 1.06, ramp(f, 0, 220)) };
  const tx = -800 + ((f * 9) % 2600);
  return (
    <Stage cam={cam}>
      <Sky id="chan" horizon={760} moon={[880, 520]} w={1080} x0={0} warm="#d0607e" />
      <Sea layer="back" horizon={760} x0={-400} w={1900} />
      {/* rock strata */}
      {["#5b3a5e", "#6e4466", "#7f4f6e", "#5e365a", "#4a2a4e"].map((c, i) => (
        <path key={i} d={`M-400 ${1080 + i * 160} Q 200 ${1050 + i * 160} 540 ${1090 + i * 160} T 1500 ${1080 + i * 160} V 2600 H -400Z`} fill={c} />
      ))}
      <path d="M-400 1080 Q 200 1040 540 1090 T 1500 1080" stroke="#9a6a8a" strokeWidth={6} fill="none" />
      {/* white cliffs and France */}
      <path d="M-400 700 L60 700 Q 110 760 90 900 L120 1100 L-400 1100Z" fill="#e8e4d8" />
      <path d="M-400 680 L60 690 L60 710 L-400 710Z" fill={C.land0} />
      <path d="M1500 720 L1010 720 Q 970 800 990 900 L960 1100 L1500 1100Z" fill="#c9b79a" />
      <path d="M1500 700 L1010 708 L1010 726 L1500 726Z" fill={C.land0} />
      {/* tunnel */}
      <path d="M-400 1180 Q 540 1260 1500 1180" stroke="#1a0b2a" strokeWidth={110} fill="none" />
      <path d="M-400 1180 Q 540 1260 1500 1180" stroke="#3a2d6e" strokeWidth={90} fill="none" />
      {(() => {
        const L = 620 * 0.85, t = (tx + L / 2 + 400) / 1900;
        const ty = 1180 + 160 * t * (1 - t) + 34;
        const ang = (Math.atan2(160 * (1 - 2 * t), 1900) * 180) / Math.PI;
        return <g transform={`rotate(${ang} ${tx + L / 2} ${ty})`}><Train x={tx} y={ty} L={620} s={0.85} glow /></g>;
      })()}
      {Array.from({ length: 9 }).map((_, i) => <circle key={i} cx={-200 + i * 200} cy={1192 + Math.sin(((i * 200) / 1900) * Math.PI) * 40} r={6} fill={C.yellow} opacity={0.6} />)}
      <Title x={540} y={300} at={6} text="เรามีอุโมงค์ใต้ทะเลอยู่แล้ว" size={66} />
      <Label x={540} y={1520} at={cName} text="อุโมงค์ช่องแคบอังกฤษ" sub="ยาวราว 50 กม. (ใต้ทะเล ~38 กม.)" color={C.cyan} size={54} />
      <Label x={540} y={1730} at={cYears} text="สร้างราว 6 ปี" sub="ค.ศ. 1988–1994" color={C.amber} size={50} />
      <text x={130} y={640} fontFamily={FONT} fontWeight={600} fontSize={34} fill={C.cream} opacity={ramp(f, 10, 20)}>อังกฤษ</text>
      <text x={950} y={660} textAnchor="end" fontFamily={FONT} fontWeight={600} fontSize={34} fill={C.cream} opacity={ramp(f, 10, 20)}>ฝรั่งเศส</text>
    </Stage>
  );
};

/** Shot 3: the Atlantic is about 100 times wider */
export const Scale: React.FC = () => {
  const f = useCurrentFrame();
  const s0 = SHOTS.scale;
  const cLong = cF(7) - s0;
  const cam = { x: 540, y: lerp(960, 920, ramp(f, 0, 160)), s: lerp(1.06, 1.0, ramp(f, 0, 160)) };
  const grow = ramp(f, 18, cLong + 10, Easing.inOut(Easing.cubic));
  const BAR = 860;
  return (
    <Stage cam={cam} bg={<SpaceBg hue={C.blue} />}>
      <Stars seed="scale" n={90} w={1080} />
      <Title x={540} y={330} at={4} text="แต่แอตแลนติกกว้างกว่า" size={70} />
      <Title x={540} y={520} at={14} text="~100 เท่า" size={150} color={C.yellow} />
      {/* short bar = Channel Tunnel */}
      <g transform="translate(110 820)" opacity={pop(f, 6)}>
        <text x={0} y={-24} fontFamily={FONT} fontWeight={600} fontSize={38} fill={C.cyan}>ช่องแคบอังกฤษ</text>
        <rect x={0} y={0} width={BAR / 100 + 6} height={44} rx={8} fill={C.cyan} />
        <text x={30} y={34} fontFamily={FONT} fontWeight={600} fontSize={34} fill={C.cream}>~50 กม.</text>
      </g>
      {/* long bar = ocean crossing, drawn as 100 segments */}
      <g transform="translate(110 1010)">
        <text x={0} y={-24} fontFamily={FONT} fontWeight={600} fontSize={38} fill={C.amber} opacity={pop(f, 18)}>ข้ามแอตแลนติก</text>
        {Array.from({ length: 100 }).map((_, i) => (
          <rect key={i} x={(i % 10) * (BAR / 10)} y={Math.floor(i / 10) * 52} width={BAR / 10 - 6} height={44} rx={6} fill={C.amber}
            opacity={grow * 100 > i ? 1 : 0.08} />
        ))}
      </g>
      <Counter x={540} y={1700} a={cLong} b={cLong + 40} from={50} to={5000} unit="กม.+" size={110} />
      <text x={540} y={1780} textAnchor="middle" fontFamily={FONT} fontSize={38} fill={C.lilac} opacity={ramp(f, cLong + 20, cLong + 30)}>ความยาวอุโมงค์ข้ามทวีป</text>
    </Stage>
  );
};

/** Shot 4: dive 3+ km down to the ocean floor; crushing water pressure */
export const Depth: React.FC = () => {
  const f = useCurrentFrame();
  const s0 = SHOTS.depth;
  const cPress = cF(9) - s0;
  const dive = ramp(f, 0, cPress + 10, Easing.inOut(Easing.cubic));
  const cam = { x: 540, y: lerp(900, 3500, dive), s: 1 };
  const D = 3600; // world px for 3.6 km
  const depthM = lerp(0, 3600, dive);
  return (
    <Stage cam={cam}>
      <Sky id="depth" horizon={500} moon={[860, 200]} w={1080} x0={0} />
      <defs>
        <linearGradient id="deep" x1={0} y1={0} x2={0} y2={1}>
          <stop offset="0%" stopColor="#1f5fd0" />
          <stop offset="20%" stopColor="#163b9a" />
          <stop offset="55%" stopColor="#0d1f5c" />
          <stop offset="100%" stopColor="#060a26" />
        </linearGradient>
      </defs>
      <rect x={-400} y={500} width={1900} height={D + 600} fill="url(#deep)" />
      <Sea layer="back" horizon={500} x0={-400} w={1900} />
      {/* light rays near the top */}
      {[0, 1, 2, 3].map((i) => <path key={i} d={`M${120 + i * 260} 520 L${60 + i * 260} 1500 L${200 + i * 260} 1500Z`} fill="#8fd4ff" opacity={0.08} />)}
      {/* fish and deep-sea creatures */}
      {Array.from({ length: 16 }).map((_, i) => {
        const y = 700 + i * 200, x = ((random(`fx${i}`) * 1300 + f * (1 + (i % 3))) % 1400) - 160;
        const deep = y > 2400;
        return (
          <g key={i} transform={`translate(${x} ${y}) scale(${0.8 + random(`fs${i}`) * 0.8})`}>
            <path d="M-30 0 Q 0 -20 30 0 Q 0 20 -30 0Z M-30 0 L-48 -14 L-48 14Z" fill={deep ? "#3a2a6e" : C.amber} opacity={0.8} />
            {deep && <circle cx={34} cy={-14} r={6} fill={C.mint} />}
            {deep && <circle cx={34} cy={-14} r={18} fill={C.mint} opacity={0.3} filter="url(#blur4)" />}
          </g>
        );
      })}
      {/* sea floor */}
      <path d={`M-400 ${D + 600} Q 200 ${D + 540} 540 ${D + 590} T 1500 ${D + 570} V ${D + 1400} H -400Z`} fill="#2c1a3e" />
      {Array.from({ length: 30 }).map((_, i) => <ellipse key={i} cx={-200 + random(`sf${i}`) * 1500} cy={D + 620 + random(`sfy${i}`) * 300} rx={14 + random(`sfr${i}`) * 30} ry={8} fill="#4a2d5e" />)}
      {/* depth ruler */}
      <line x1={120} y1={500} x2={120} y2={D + 590} stroke={C.lilac} strokeWidth={4} strokeDasharray="12 12" />
      {[0, 1, 2, 3].map((k) => (
        <g key={k}>
          <line x1={100} x2={150} y1={500 + (k * 1000 * (D + 90)) / 3600} y2={500 + (k * 1000 * (D + 90)) / 3600} stroke={C.lilac} strokeWidth={4} />
          <text x={165} y={512 + (k * 1000 * (D + 90)) / 3600} fontFamily={FONT} fontSize={36} fill={C.lilac}>{k} กม.</text>
        </g>
      ))}
      {/* HUD in world space, follows the camera */}
      <g transform={`translate(0 ${cam.y - 960})`}>
        <Counter x={600} y={360} a={6} b={7} from={depthM} to={depthM} unit="เมตร" size={110} />
        <Label x={600} y={470} at={6} text="ความลึกเฉลี่ย ~3.6 กม." color={C.cyan} size={42} />
        {/* pressure: a crushed can and a gauge */}
        <g transform={`translate(540 1300) scale(${pop(f, cPress)})`}>
          <circle r={170} fill="#0b0430" stroke={C.cream} strokeWidth={10} />
          {Array.from({ length: 11 }).map((_, i) => {
            const a = Math.PI * (0.8 + (i / 10) * 1.4);
            return <line key={i} x1={Math.cos(a) * 140} y1={Math.sin(a) * 140} x2={Math.cos(a) * 160} y2={Math.sin(a) * 160} stroke={C.cream} strokeWidth={6} />;
          })}
          <line x1={0} y1={0} x2={Math.cos(Math.PI * (0.8 + 1.38 * ramp(f, cPress, cPress + 30))) * 130}
            y2={Math.sin(Math.PI * (0.8 + 1.38 * ramp(f, cPress, cPress + 30))) * 130} stroke={C.red} strokeWidth={12} strokeLinecap="round" />
          <circle r={16} fill={C.red} />
        </g>
        <Label x={540} y={1560} at={cPress + 12} text="แรงดันน้ำ ~360 เท่า" sub="ของแรงดันอากาศบนผิวน้ำ" color={C.amber} size={52} />
      </g>
    </Stage>
  );
};

/** Shot 5: the Mid-Atlantic Ridge — the plates are pulling apart, and there are earthquakes */
export const Ridge: React.FC = () => {
  const f = useCurrentFrame();
  const s0 = SHOTS.ridge;
  const cQuake = cF(11) - s0;
  const shake = f > cQuake && f < cQuake + 30 ? Math.sin(f * 2.3) * 14 * (1 - (f - cQuake) / 30) : 0;
  const cam = { x: 540 + shake, y: lerp(1000, 960, ramp(f, 0, 200)) + shake * 0.6, s: lerp(1.0, 1.08, ramp(f, 0, 200)) };
  const gap = 40 + ramp(f, 10, 160) * 50;
  return (
    <Stage cam={cam}>
      <defs>
        <linearGradient id="abyss" x1={0} y1={0} x2={0} y2={1}><stop offset="0%" stopColor="#0d1f5c" /><stop offset="100%" stopColor="#060a26" /></linearGradient>
      </defs>
      <rect x={-400} y={-400} width={1900} height={2800} fill="url(#abyss)" />
      {Array.from({ length: 40 }).map((_, i) => (
        <circle key={i} cx={random(`mar${i}`) * 1080} cy={((random(`mary${i}`) * 1400 + f * 0.8) % 1400) - 100} r={2 + random(`marr${i}`) * 3} fill={C.mint} opacity={0.3} />
      ))}
      {/* magma rising in the crack */}
      <ellipse cx={540} cy={1500} rx={gap + 60} ry={500} fill={C.orange} opacity={0.4} filter="url(#blur30)" />
      <path d={`M${540 - gap} 1100 Q 540 1600 ${540 + gap} 1100 L ${540 + gap} 2200 L ${540 - gap} 2200Z`} fill={C.outer0} />
      <path d={`M${540 - gap * 0.4} 1150 Q 540 1500 ${540 + gap * 0.4} 1150 L ${540 + gap * 0.4} 2200 L ${540 - gap * 0.4} 2200Z`} fill={C.yellow} />
      {/* the two plates */}
      {[-1, 1].map((side) => (
        <g key={side} transform={`translate(${side * (gap - 40)} 0)`}>
          <path d={side < 0 ? "M-400 1180 L200 1150 Q 420 1080 500 1060 L500 2400 L-400 2400Z" : "M1480 1180 L880 1150 Q 660 1080 580 1060 L580 2400 L1480 2400Z"} fill="#3a2350" />
          <path d={side < 0 ? "M-400 1180 L200 1150 Q 420 1080 500 1060 L500 1100 Q 420 1120 200 1190 L-400 1220Z" : "M1480 1180 L880 1150 Q 660 1080 580 1060 L580 1100 Q 660 1120 880 1190 L1480 1220Z"} fill="#5a3a6e" />
          {[0, 1, 2].map((k) => <path key={k} d={`M${side < 0 ? -380 : 600} ${1300 + k * 200} h 460`} stroke="#5a3a6e" strokeWidth={6} />)}
          <g opacity={ramp(f, 20, 34)} transform={`translate(${side < 0 ? 220 : 860} 1500)`}>
            <path d={`M${-side * 70} 0 H${side * 70} M${side * 40} -30 L${side * 74} 0 L${side * 40} 30`} stroke={C.cream} strokeWidth={14} fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </g>
        </g>
      ))}
      <Title x={540} y={420} at={6} text="กลางมหาสมุทร" sub="มีรอยแยกของเปลือกโลก" size={84} />
      <Label x={540} y={760} at={30} text="สันเขากลางแอตแลนติก" sub="แยกออกจากกันปีละ ~2–5 ซม." color={C.amber} size={48} />
      {/* earthquake */}
      {f > cQuake && [0, 1, 2].map((i) => {
        const r = ((f - cQuake) * 9 + i * 80) % 300;
        return <circle key={i} cx={540} cy={1180} r={r} fill="none" stroke={C.yellow} strokeWidth={6} opacity={1 - r / 300} />;
      })}
      <Label x={540} y={1800} at={cQuake + 4} text="และมีแผ่นดินไหว" color={C.yellow} size={56} />
    </Stage>
  );
};
