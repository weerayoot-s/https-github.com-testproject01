import React from "react";
import { useCurrentFrame, random, Easing } from "remotion";
import { Stage, SpaceBg, Stars, Label, Planet } from "../common";
import { Sky, Sea, Ship } from "../sea";
import { Train, Coins, Title } from "../props";
import { C, FONT } from "../theme";
import { ramp, pop, lerp } from "../anim";
import { cF, SHOTS, TOTAL } from "../timing";

const Water: React.FC<{ top: number }> = ({ top }) => (
  <>
    <defs>
      <linearGradient id={`w${top}`} x1={0} y1={0} x2={0} y2={1}>
        <stop offset="0%" stopColor="#2a6fd6" /><stop offset="35%" stopColor="#163b9a" /><stop offset="100%" stopColor="#081440" />
      </linearGradient>
    </defs>
    <rect x={-500} y={top} width={2100} height={3000} fill={`url(#w${top})`} />
  </>
);

const Tube: React.FC<{ y: number; r: number; x0?: number; x1?: number; cut?: boolean }> = ({ y, r, x0 = -500, x1 = 1600, cut = false }) => {
  const f = useCurrentFrame();
  return (
    <g>
      <defs>
        <linearGradient id={`tube${r}`} x1={0} y1={0} x2={0} y2={1}>
          <stop offset="0%" stopColor="#c9d6f2" /><stop offset="45%" stopColor="#8a9cc8" /><stop offset="100%" stopColor="#3d4a7a" />
        </linearGradient>
      </defs>
      <rect x={x0} y={y - r - 30} width={x1 - x0} height={2 * r + 60} fill={C.cyan} opacity={0.12} filter="url(#blur12)" />
      <rect x={x0} y={y - r} width={x1 - x0} height={2 * r} fill={`url(#tube${r})`} />
      {cut && <rect x={x0} y={y - r + 18} width={x1 - x0} height={2 * r - 36} fill="#0b1240" />}
      {cut && <rect x={x0} y={y - r + 18} width={x1 - x0} height={2 * r - 36} fill={C.blue} opacity={0.35} />}
      {Array.from({ length: Math.ceil((x1 - x0) / 120) }).map((_, i) => (
        <rect key={i} x={x0 + i * 120 + ((-f * 0) % 120)} y={y - r} width={10} height={2 * r} fill="#2a3466" opacity={0.6} />
      ))}
      <rect x={x0} y={y - r + 6} width={x1 - x0} height={8} fill="#ffffff" opacity={0.35} />
    </g>
  );
};

/** Shot 6: a submerged floating tunnel, held by cables */
export const Float: React.FC = () => {
  const f = useCurrentFrame();
  const s0 = SHOTS.float;
  const cTube = cF(12) - s0 + 100, cCable = cF(12) - s0 + 150;
  const cam = { x: 540, y: lerp(820, 1080, ramp(f, 0, 170)), s: lerp(1.0, 0.92, ramp(f, 0, 170)) };
  const TY = 1000, FLOOR = 1850;
  return (
    <Stage cam={cam}>
      <Sky id="float" horizon={560} moon={[170, 430]} w={1080} x0={0} />
      <Water top={560} />
      <Sea layer="back" horizon={560} x0={-500} w={2100} />
      <Ship x={lerp(-300, 700, ramp(f, 0, 200))} y={565} s={0.42} bob={0.6} />
      {[0, 1, 2, 3].map((i) => <path key={i} d={`M${100 + i * 260} 580 L${40 + i * 260} 1500 L${180 + i * 260} 1500Z`} fill="#8fd4ff" opacity={0.07} />)}
      {/* sea floor and anchors */}
      <path d={`M-500 ${FLOOR} Q 200 ${FLOOR - 40} 540 ${FLOOR + 10} T 1600 ${FLOOR} V 3000 H -500Z`} fill="#2c1a3e" />
      {[-140, 220, 580, 940, 1300].map((x, i) => (
        <g key={i} opacity={ramp(f, cCable - 10 + i * 3, cCable + i * 3)}>
          <line x1={x - 60} y1={TY + 60} x2={x - 150} y2={FLOOR} stroke={C.cream} strokeWidth={5} />
          <line x1={x + 60} y1={TY + 60} x2={x + 150} y2={FLOOR} stroke={C.cream} strokeWidth={5} />
          <rect x={x - 180} y={FLOOR - 14} width={60} height={30} rx={6} fill="#5a6488" />
          <rect x={x + 120} y={FLOOR - 14} width={60} height={30} rx={6} fill="#5a6488" />
        </g>
      ))}
      <g transform={`translate(0 ${Math.sin(f / 30) * 6})`}><Tube y={TY} r={64} /></g>
      {Array.from({ length: 12 }).map((_, i) => (
        <g key={i} transform={`translate(${((random(`ff${i}`) * 1400 + f * (1.5 + (i % 3))) % 1500) - 200} ${700 + random(`ffy${i}`) * 1000})`}>
          <path d="M-22 0 Q 0 -14 22 0 Q 0 14 -22 0Z M-22 0 L-34 -10 L-34 10Z" fill={i % 2 ? C.amber : C.pink} opacity={0.8} />
        </g>
      ))}
      <Title x={540} y={250} at={8} text="ไอเดีย: อุโมงค์ลอยน้ำ" size={76} />
      <Label x={540} y={TY - 190} at={cTube} text="ท่อลอยอยู่ใต้ผิวน้ำ" color={C.cyan} size={46} px={540} py={TY - 64} />
      <Label x={540} y={1560} at={cCable} text="ยึดไว้ด้วยสายเคเบิล" color={C.cream} size={46} px={640} py={1350} />
    </Stage>
  );
};

/** Shot 7: pump the air out, run a maglev train through the vacuum */
export const Vac: React.FC = () => {
  const f = useCurrentFrame();
  const s0 = SHOTS.vac;
  const cTrain = 75, cSpeed = 150;
  const cam = { x: lerp(560, 520, ramp(f, 0, 250)), y: 960, s: lerp(1.0, 1.06, ramp(f, 0, 250)) };
  const TY = 960, R = 170;
  const air = ramp(f, 10, 70);
  const tx = lerp(-1400, 1800, ramp(f, cTrain, cTrain + 50, Easing.in(Easing.quad)));
  const tx2 = lerp(-1400, 1800, ramp(f, cSpeed + 40, cSpeed + 80, Easing.in(Easing.quad)));
  return (
    <Stage cam={cam}>
      <Water top={-600} />
      {Array.from({ length: 50 }).map((_, i) => (
        <circle key={i} cx={random(`b${i}`) * 1080} cy={((random(`by${i}`) * 1900 - f * (1 + (i % 4))) % 1900 + 1900) % 1900} r={3 + random(`br${i}`) * 6}
          fill="#bfe8ff" opacity={0.25} />
      ))}
      <Tube y={TY} r={R} x0={-500} x1={1600} cut />
      {/* air molecules being pumped out to the right */}
      {Array.from({ length: 40 }).map((_, i) => {
        const x0 = -300 + random(`a${i}`) * 1500, y0 = TY - R + 40 + random(`ay${i}`) * (2 * R - 80);
        const x = x0 + air * (1500 - x0) * (0.6 + random(`as${i}`) * 0.6);
        return <circle key={i} cx={x + Math.sin(f / 5 + i) * 6} cy={y0 + Math.cos(f / 6 + i) * 6} r={9} fill={C.mint} opacity={(1 - air) * 0.9} />;
      })}
      {/* maglev guideway coils */}
      {Array.from({ length: 22 }).map((_, i) => (
        <rect key={i} x={-400 + i * 90} y={TY + R - 40} width={60} height={14} rx={7} fill={C.pink} opacity={0.3 + 0.7 * ramp(f, cTrain - 20, cTrain)} />
      ))}
      <Train x={tx} y={TY + R - 50} L={1100} s={0.9} col="#f4f6ff" stripe={C.pink} glow />
      <Train x={tx2} y={TY + R - 50} L={1100} s={0.9} col="#f4f6ff" stripe={C.pink} glow />
      {[0, 1, 2, 3, 4].map((i) => (
        <rect key={i} x={tx - 300 - i * 120} y={TY - 60 + i * 30} width={240} height={6} rx={3} fill={C.cream} opacity={0.4 * (tx > -1300 && tx < 1700 ? 1 : 0)} />
      ))}
      {/* pump */}
      <g transform={`translate(950 ${TY - R - 70})`}>
        <rect x={-60} y={-60} width={120} height={80} rx={14} fill="#5a6488" />
        <g transform={`rotate(${f * 12})`}>{[0, 1, 2].map((i) => <rect key={i} x={-6} y={-40} width={12} height={40} rx={6} fill={C.cream} transform={`rotate(${i * 120})`} />)}</g>
      </g>
      <Title x={540} y={330} at={6} text="ดูดอากาศออก" sub="เหลือแต่สุญญากาศ" size={80} />
      <Label x={540} y={1360} at={cTrain} text="รถไฟแม่เหล็ก (maglev)" sub="ลอยเหนือราง ไม่มีแรงต้านอากาศ" color={C.pink} size={48} />
      <g opacity={pop(f, cSpeed)}>
        <Title x={540} y={1600} at={cSpeed} text="หลายพัน กม./ชม." sub="ตามทฤษฎี · เร็วกว่าเครื่องบินหลายเท่า" size={92} color={C.yellow} />
      </g>
    </Stage>
  );
};

/** Shot 8: the cost — trillions — so it's still a dream */
export const Cost: React.FC = () => {
  const f = useCurrentFrame();
  const s0 = SHOTS.cost;
  const cDream = cF(15) - s0;
  const cam = { x: 540, y: lerp(1000, 940, ramp(f, 0, 140)), s: lerp(1.0, 1.05, ramp(f, 0, 140)) };
  const grow = ramp(f, 4, cDream - 6, Easing.out(Easing.cubic));
  const dream = ramp(f, cDream, cDream + 16);
  return (
    <Stage cam={cam} bg={<SpaceBg hue="#3a1060" />}>
      <Stars seed="cost" n={80} w={1080} />
      <g opacity={1 - dream * 0.75}>
        {[0, 1, 2, 3, 4, 5, 6].map((i) => (
          <Coins key={i} x={140 + i * 135} y={1600 - (i % 2) * 20} h={grow * (18 + ((i * 7) % 11) * 4)} s={1.1} />
        ))}
        <Title x={540} y={420} at={4} text="ค่าก่อสร้าง" size={90} />
        <Title x={540} y={560} at={18} text="อาจถึงระดับล้านล้าน" size={74} color={C.yellow} />
      </g>
      {/* dream bubble */}
      <g transform={`translate(540 1000) scale(${pop(f, cDream)})`}>
        {[[-200, 20, 150], [0, -40, 200], [210, 10, 150], [-90, 110, 140], [110, 110, 140]].map(([x, y, r], i) => (
          <circle key={i} cx={x} cy={y} r={r} fill={C.lilac} opacity={0.95} />
        ))}
        <circle cx={-260} cy={300} r={36} fill={C.lilac} /><circle cx={-310} cy={380} r={20} fill={C.lilac} />
        <rect x={-260} y={10} width={520} height={60} rx={30} fill="#8a9cc8" />
        <rect x={-250} y={22} width={500} height={36} rx={18} fill="#1b2a5a" />
        <g transform={`translate(${lerp(-260, 120, (f % 60) / 60)} 54) scale(0.32)`}><Train x={0} y={0} L={400} stripe={C.cyan} /></g>
        <text x={0} y={-90} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={64} fill="#2a1a5a">ยังเป็นแค่ความฝัน</text>
      </g>
    </Stage>
  );
};

/** Shot 9: the more realistic route — the Bering Strait, Russia to Alaska */
export const Bering: React.FC = () => {
  const f = useCurrentFrame();
  const s0 = SHOTS.bering;
  const cName = 70, cSides = 90, cLine = 115;
  const cam = { x: lerp(560, 520, ramp(f, 0, 200)), y: lerp(1000, 960, ramp(f, 0, 200)), s: lerp(0.95, 1.08, ramp(f, 0, 200)) };
  const line = ramp(f, cLine, cLine + 30);
  return (
    <Stage cam={cam} bg={<rect width={1920} height={1080} fill="#123a8a" />}>
      <defs><radialGradient id="bs" cx="50%" cy="45%" r="70%"><stop offset="0%" stopColor="#2a64c8" /><stop offset="100%" stopColor="#0f2a6e" /></radialGradient></defs>
      <rect x={-500} y={-500} width={2100} height={3000} fill="url(#bs)" />
      {Array.from({ length: 22 }).map((_, i) => <line key={i} x1={-500} y1={-400 + i * 140} x2={1600} y2={-400 + i * 140} stroke="#7fb5ff" strokeOpacity={0.12} strokeWidth={2} />)}
      {/* Russia (Chukotka) left, Alaska right — stylised, not to scale */}
      <path d="M-500 -500 L420 -500 Q 400 300 440 640 Q 420 820 470 960 Q 380 1160 300 1400 Q 200 1700 -500 1900Z" fill={C.land1} />
      <path d="M-500 -500 L400 -500 Q 380 300 420 640 Q 400 820 450 960 Q 360 1160 280 1400 Q 180 1700 -500 1880Z" fill={C.land0} />
      <path d="M1600 -500 L680 -500 Q 700 300 650 640 Q 670 820 620 960 Q 700 1150 820 1400 Q 900 1700 1600 1900Z" fill={C.land1} />
      <path d="M1600 -500 L700 -500 Q 720 300 670 640 Q 690 820 640 960 Q 720 1150 840 1400 Q 920 1700 1600 1880Z" fill={C.land0} />
      <circle cx={530} cy={930} r={16} fill={C.land0} /><circle cx={565} cy={950} r={12} fill={C.land0} />
      {/* ice floes */}
      {Array.from({ length: 14 }).map((_, i) => (
        <ellipse key={i} cx={460 + random(`ice${i}`) * 180} cy={((random(`icey${i}`) * 1900 + f * 0.6) % 2200) - 200} rx={14 + random(`icer${i}`) * 18} ry={8} fill="#e8f4ff" opacity={0.7} />
      ))}
      <path d={`M440 960 L${lerp(440, 650, line)} 960`} stroke={C.yellow} strokeWidth={14} strokeLinecap="round" />
      <path d="M440 960 L650 960" stroke={C.yellow} strokeWidth={14} strokeDasharray="2 22" strokeLinecap="round" opacity={0.35} />
      <Title x={540} y={300} at={6} text="เส้นทางที่เป็นไปได้มากกว่า" size={64} />
      <Title x={540} y={470} at={cName} text="ช่องแคบแบริ่ง" size={108} color={C.yellow} />
      <Label x={230} y={700} at={cSides} text="รัสเซีย" color={C.cream} size={48} />
      <Label x={760} y={1240} at={cSides + 8} text="อลาสกา (สหรัฐฯ)" color={C.cream} size={44} />
      <Label x={540} y={1560} at={cLine + 20} text="แคบสุดราว 82 กม." sub="สั้นกว่าข้ามแอตแลนติกหลายสิบเท่า" color={C.amber} size={52} />
    </Stage>
  );
};

/** Shot 10: tunnels linking every continent — where would you go? */
export const Outro: React.FC = () => {
  const f = useCurrentFrame();
  const s0 = SHOTS.outro;
  const dur = TOTAL - s0;
  const cAsk = cF(18) - s0, cComment = cF(19) - s0;
  const cam = { x: 540, y: lerp(1000, 960, ramp(f, 0, dur)), s: lerp(1.15, 1.0, ramp(f, 0, dur, Easing.inOut(Easing.sin))) };
  const fadeOut = 1 - ramp(f, dur - 20, dur - 2);
  const R = 360, cx = 540, cy = 1080;
  const arcs = [[-0.7, -0.3, 0.2, -0.55], [0.2, -0.55, 0.7, -0.1], [-0.5, 0.2, 0.3, 0.5], [-0.7, -0.3, -0.5, 0.2], [0.7, -0.1, 0.3, 0.5]];
  return (
    <div style={{ position: "absolute", inset: 0, opacity: fadeOut, background: "#07021c" }}>
      <Stage cam={cam} bg={<SpaceBg hue={C.violet} />}>
        <Stars seed="outro" n={150} w={1080} />
        <Planet cx={cx} cy={cy} r={R} id="outro" spin={0.4} />
        {arcs.map(([a, b, c, d], i) => {
          const x1 = cx + a * R, y1 = cy + b * R, x2 = cx + c * R, y2 = cy + d * R;
          const mx = (x1 + x2) / 2 + (cx - (x1 + x2) / 2) * -0.15, my = (y1 + y2) / 2 - 60;
          const p = ramp(f, 6 + i * 6, 30 + i * 6);
          const t = ((f / 40 + i * 0.3) % 1);
          const tx = (1 - t) ** 2 * x1 + 2 * (1 - t) * t * mx + t * t * x2, ty = (1 - t) ** 2 * y1 + 2 * (1 - t) * t * my + t * t * y2;
          return (
            <g key={i}>
              <path d={`M${x1} ${y1} Q ${mx} ${my} ${x2} ${y2}`} fill="none" stroke={C.yellow} strokeWidth={7} strokeLinecap="round" pathLength={100} strokeDasharray={`${p * 100} 100`} />
              <circle cx={x1} cy={y1} r={10} fill={C.cream} /><circle cx={x2} cy={y2} r={10} fill={C.cream} />
              {p >= 1 && <circle cx={tx} cy={ty} r={12} fill={C.pink} />}
              {p >= 1 && <circle cx={tx} cy={ty} r={26} fill={C.pink} opacity={0.4} filter="url(#blur4)" />}
            </g>
          );
        })}
        <Title x={540} y={330} at={4} text="ถ้ามีอุโมงค์เชื่อมทุกทวีป" size={70} />
        <Title x={540} y={520} at={cAsk} text="คุณจะนั่งรถไฟไปที่ไหน?" size={78} color={C.yellow} />
        <g transform={`translate(540 1640) scale(${pop(f, cComment) * 1.2})`}>
          <rect x={-170} y={-70} width={340} height={120} rx={30} fill={C.cream} />
          <path d="M-90 46 L-110 96 L-50 46Z" fill={C.cream} />
          {[0, 1, 2].map((i) => <circle key={i} cx={-70 + i * 70} cy={-10} r={16} fill={C.violet} opacity={0.5 + 0.5 * Math.sin(f / 4 - i)} />)}
        </g>
        <text x={540} y={1810} textAnchor="middle" fontFamily={FONT} fontWeight={600} fontSize={46} fill={C.cream} opacity={ramp(f, cComment + 6, cComment + 16)}>คอมเมนต์บอกกันหน่อย</text>
      </Stage>
    </div>
  );
};
