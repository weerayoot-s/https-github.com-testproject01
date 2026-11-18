import React from "react";
import { useCurrentFrame, random, Easing } from "remotion";
import { Stage, Label, Counter } from "../common";
import { C, FONT } from "../theme";
import { ramp, pop, lerp } from "../anim";
import { phF, segF, SHOTS } from "../timing";

/** Shot 5: the bottom of the hole — 180 °C, the rock goes soft and squeezes the hole */
export const Hot: React.FC = () => {
  const f = useCurrentFrame();
  const s0 = SHOTS.hot;
  const cSoft = phF(4, 1) - s0, cSqueeze = phF(4, 3) - s0;
  const heat = ramp(f, 0, 60);
  const bulge = ramp(f, cSoft, cSqueeze + 40) * 70;
  const cam = { x: lerp(900, 1000, ramp(f, 0, 140)), y: lerp(500, 640, ramp(f, 0, 140)), s: lerp(0.98, 1.12, ramp(f, 0, 140)) };
  const wall = (side: number) => {
    const pts: string[] = [];
    for (let i = 0; i <= 40; i++) {
      const y = -100 + i * 32;
      const b = Math.sin(Math.PI * Math.min(1, Math.max(0, (y - 150) / 800))) * bulge;
      const wob = Math.sin(y / 40 + f / 14) * 3 * (bulge / 70);
      pts.push(`${960 + side * (95 - b - wob)},${y}`);
    }
    return `M${960 + side * 1100},-100 L${pts.join(" L")} L${960 + side * 1100},1300Z`;
  };
  const temp = lerp(20, 180, ramp(f, 6, 70, Easing.out(Easing.quad)));
  return (
    <Stage cam={cam} bg={<rect width={1920} height={1080} fill="#1a0718" />}>
      <circle cx={960} cy={900} r={700} fill="url(#hotglow)" opacity={0.25 + 0.5 * heat} />
      {/* hole (dark) */}
      <rect x={760} y={-100} width={400} height={1400} fill="#0d0310" />
      {[-1, 1].map((side) => (
        <g key={side}>
          <defs>
            <linearGradient id={`wall${side}`} x1={side < 0 ? 1 : 0} y1={0} x2={side < 0 ? 0 : 1} y2={0}>
              <stop offset="0%" stopColor={C.orange} />
              <stop offset="12%" stopColor="#a63a3a" />
              <stop offset="100%" stopColor="#3d1238" />
            </linearGradient>
          </defs>
          <path d={wall(side)} fill={`url(#wall${side})`} />
          {Array.from({ length: 26 }).map((_, i) => {
            const y = random(`r${side}${i}`) * 1200 - 50;
            const x = 960 + side * (220 + random(`rx${side}${i}`) * 700);
            return <ellipse key={i} cx={x} cy={y} rx={10 + random(`rr${i}`) * 30} ry={6 + random(`rq${i}`) * 14} fill="#ff9a6a" opacity={0.12 + 0.1 * heat} />;
          })}
          {[0, 1, 2, 3].map((i) => (
            <path key={i} d={`M${960 + side * 300} ${200 + i * 260} q ${side * 200} 40 ${side * 600} -20`} stroke="#ffb37a" strokeOpacity={0.18} strokeWidth={4} fill="none" />
          ))}
        </g>
      ))}
      {/* drill pipe and bit */}
      <rect x={950} y={-100} width={20} height={880} fill="url(#metal)" />
      <path d="M920 780 H1000 L985 840 L960 870 L935 840Z" fill="url(#metal)" />
      <circle cx={960} cy={850} r={60} fill={C.yellow} opacity={0.35 + 0.25 * Math.sin(f / 3)} filter="url(#blur12)" />
      {/* squeeze arrows */}
      {[-1, 1].map((side) => (
        <g key={side} opacity={ramp(f, cSqueeze, cSqueeze + 10)} transform={`translate(${960 + side * (330 - bulge)} 560)`}>
          <path d={`M${side * 70} 0 H${side * 10} M${side * 34} -26 L${side * 6} 0 L${side * 34} 26`} stroke={C.cream} strokeWidth={10} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      ))}
      {/* thermometer */}
      <g transform="translate(1560 260)">
        <rect x={-28} y={0} width={56} height={460} rx={28} fill="#2a0f3f" stroke={C.cream} strokeWidth={5} />
        <circle cx={0} cy={500} r={52} fill={C.red} stroke={C.cream} strokeWidth={5} />
        <rect x={-14} y={460 - (temp / 200) * 440} width={28} height={(temp / 200) * 440 + 40} rx={14} fill={C.red} />
        <circle cx={0} cy={500} r={80} fill={C.red} opacity={0.35} filter="url(#blur12)" />
        <text x={0} y={-36} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={84} fill={C.yellow} stroke="#1a0718" strokeWidth={10} paintOrder="stroke">{Math.round(temp)}°C</text>
      </g>
      <Label x={440} y={330} at={cSoft} text="หินร้อนจนนิ่ม" sub="ไหลตัวได้เหมือนพลาสติก" color={C.amber} />
    </Stage>
  );
};

const flow = (f: number, y0: number, amp: number, k: number, spd: number) => {
  const pts: string[] = [];
  for (let i = 0; i <= 24; i++) {
    const x = -300 + i * 105;
    pts.push(`${x},${y0 + Math.sin(i * k + f * spd) * amp}`);
  }
  return pts.join(" ");
};

/** Shots 6–8 as one continuous dive: mantle -> outer core -> inner core (no hard cuts) */
export const Dive: React.FC = () => {
  const f = useCurrentFrame();
  const s0 = SHOTS.dive;
  const cThick = phF(5, 1) - s0, cLava = phF(5, 2) - s0, cSlow = phF(5, 3) - s0, cCm = phF(5, 4) - s0;
  const cOuter = segF(6) - s0, cOuterL = phF(6, 1) - s0, cIron = phF(6, 2) - s0;
  const cInner = segF(7) - s0, cInnerL = phF(7, 1) - s0, cTemp = phF(7, 2) - s0, cSun = phF(7, 3) - s0, cPress = phF(7, 4) - s0;
  const toOuter = ramp(f, cOuter - 6, cOuter + 34);
  const toInner = ramp(f, cInner - 6, cInner + 40);
  const camY = lerp(lerp(lerp(580, 780, ramp(f, 0, cOuter)), 2050, toOuter), 3260, toInner);
  const cam = { x: 960 + Math.sin(f / 45) * 110 * (1 - 0.85 * toInner), y: camY, s: lerp(1, 1.06, ramp(f, cInner + 40, cInner + 200)) };
  const OUT = 1500; // top of the outer core
  const ICY = 3300, ICR = 330;
  return (
    <Stage cam={cam} bg={<rect width={1920} height={1080} fill="#2a0a2e" />}>
      <defs>
        <linearGradient id="mantleBand" x1={0} y1={0} x2={0} y2={1}>
          <stop offset="0%" stopColor={C.mantleTop} />
          <stop offset="100%" stopColor={C.mantleBot} />
        </linearGradient>
        <linearGradient id="coreBand" x1={0} y1={0} x2={0} y2={1}>
          <stop offset="0%" stopColor={C.outer1} />
          <stop offset="40%" stopColor={C.outer0} />
          <stop offset="100%" stopColor={C.amber} />
        </linearGradient>
      </defs>
      {/* crust strip and mantle */}
      <rect x={-600} y={-200} width={3120} height={300} fill={C.crust} />
      <path d="M-600 100 Q 960 40 2520 100" stroke="#5a3826" strokeWidth={14} fill="none" />
      <rect x={-600} y={95} width={3120} height={OUT + 300} fill="url(#mantleBand)" />
      {/* convection cells */}
      {[-1, 0, 1].map((k) => {
        const cx = 960 + k * 620, cy = 780;
        const vis = ramp(f, cSlow + Math.abs(k) * 5, cSlow + 20 + Math.abs(k) * 5);
        const dir = k % 2 === 0 ? 1 : -1;
        return (
          <g key={k} opacity={vis} transform={`rotate(${dir * f * 0.35} ${cx} ${cy})`}>
            <ellipse cx={cx} cy={cy} rx={250} ry={250} fill="none" stroke="#ffd2a8" strokeOpacity={0.55} strokeWidth={10} strokeDasharray="160 70" strokeLinecap="round" />
            {[0, 1, 2].map((i) => {
              const a = (i * 2 * Math.PI) / 3;
              const x = cx + Math.cos(a) * 250, y = cy + Math.sin(a) * 250;
              const ang = (a * 180) / Math.PI + 90 * dir;
              return <path key={i} d="M-22 -18 L10 0 L-22 18" transform={`translate(${x} ${y}) rotate(${ang})`} stroke="#ffd2a8" strokeOpacity={0.8} strokeWidth={10} fill="none" strokeLinecap="round" strokeLinejoin="round" />;
            })}
          </g>
        );
      })}
      {Array.from({ length: 40 }).map((_, i) => (
        <circle key={i} cx={-200 + random(`m${i}`) * 2300} cy={150 + ((random(`my${i}`) * 1300 - f * 0.3) % 1300 + 1300) % 1300}
          r={4 + random(`mr${i}`) * 10} fill="#ffb37a" opacity={0.18} />
      ))}
      <Label x={960} y={340} at={6} text="แมนเทิล" sub="หนาเกือบ 2,900 กม." color={C.cream} size={60} />
      {/* not lava */}
      <g transform={`translate(1500 330) scale(${pop(f, cLava)})`}>
        <path d="M-70 40 Q -80 -40 -20 -50 Q 0 -90 40 -50 Q 90 -40 70 40Z" fill={C.orange} />
        <path d="M-40 40 Q -40 0 -10 -10 Q 20 -30 40 0 Q 50 20 40 40Z" fill={C.yellow} />
        <circle cx={0} cy={0} r={100} fill="none" stroke={C.red} strokeWidth={14} />
        <line x1={-70} y1={-70} x2={70} y2={70} stroke={C.red} strokeWidth={14} strokeLinecap="round" />
        <text x={0} y={160} textAnchor="middle" fontFamily={FONT} fontWeight={600} fontSize={44} fill={C.cream}>ไม่ใช่ลาวา</text>
      </g>
      <Label x={520} y={990} at={cCm} text="ไหลได้ปีละไม่กี่ ซม." sub="ช้าพอๆ กับเล็บมืองอก" color={C.mint} size={44} />
      {/* outer core */}
      <circle cx={960} cy={OUT + 6000} r={6000} fill="url(#coreBand)" />
      <path d={`M-600 ${OUT + 160} Q 960 ${OUT - 40} 2520 ${OUT + 160}`} stroke={C.yellow} strokeOpacity={0.5} strokeWidth={30} fill="none" filter="url(#blur12)" />
      {[0, 1, 2, 3, 4, 5, 6].map((i) => (
        <polyline key={i} points={flow(f, OUT + 250 + i * 150, 40 + i * 6, 0.45 + i * 0.05, (i % 2 ? 1 : -1) * 0.05)} fill="none"
          stroke="#fff0b8" strokeOpacity={0.3} strokeWidth={8} strokeDasharray="60 50" strokeDashoffset={-f * (3 + i)} strokeLinecap="round" />
      ))}
      <Label x={960} y={OUT + 340} at={cOuterL} text="แก่นโลกชั้นนอก" sub="เหล็กและนิกเกิลหลอมเหลว หนา ~2,200 กม." color={C.cream} size={58} />
      <Label x={960} y={OUT + 560} at={cIron} text="มหาสมุทรเหล็กเหลว" color={C.yellow} size={44} />
      {/* inner core */}
      <circle cx={960} cy={ICY} r={ICR * 1.8} fill={C.yellow} opacity={0.35} filter="url(#blur30)" />
      <circle cx={960} cy={ICY} r={ICR} fill="url(#inner)" />
      {Array.from({ length: 12 }).map((_, i) => {
        const a = (i / 12) * Math.PI * 2 + f / 120;
        return <line key={i} x1={960 + Math.cos(a) * (ICR + 20)} y1={ICY + Math.sin(a) * (ICR + 20)} x2={960 + Math.cos(a) * (ICR + 60 + 15 * Math.sin(f / 8 + i))}
          y2={ICY + Math.sin(a) * (ICR + 60 + 15 * Math.sin(f / 8 + i))} stroke={C.yellow} strokeWidth={8} strokeLinecap="round" opacity={0.7} />;
      })}
      <Label x={960} y={ICY - 20} at={cInnerL} text="แก่นชั้นใน" sub="เหล็กแข็ง รัศมี ~1,220 กม." color={C.amber} size={52} />
      <Label x={430} y={ICY - 230} at={cTemp} text="~5,000–6,000 °C" sub="ร้อนพอๆ กับผิวดวงอาทิตย์" color={C.yellow} size={54} />
      {/* the Sun's surface for comparison slides in */}
      <g transform={`translate(${lerp(2300, 1540, ramp(f, cSun, cSun + 30, Easing.out(Easing.cubic)))} ${ICY - 150})`}>
        <circle r={260} fill={C.yellow} opacity={0.4} filter="url(#blur30)" />
        <circle r={190} fill="#ffcf4a" />
        {Array.from({ length: 14 }).map((_, i) => (
          <circle key={i} cx={Math.cos(i * 2.1) * (60 + (i % 4) * 30)} cy={Math.sin(i * 2.1) * (60 + (i % 4) * 30)} r={10 + (i % 3) * 6} fill="#ffad2e" opacity={0.6} />
        ))}
        <text y={260} textAnchor="middle" fontFamily={FONT} fontWeight={600} fontSize={40} fill={C.cream} opacity={ramp(f, cSun + 20, cSun + 30)}>ผิวดวงอาทิตย์ ~5,500 °C</text>
      </g>
      <Counter x={470} y={ICY + 110} a={cPress} b={cPress + 45} to={3600000} unit="เท่า" size={90} color={C.cream} />
      <text x={470} y={ICY + 175} textAnchor="middle" fontFamily={FONT} fontSize={36} fill={C.lilac} opacity={ramp(f, cPress + 10, cPress + 20)}>ความดันที่ใจกลาง เทียบกับผิวโลก</text>
    </Stage>
  );
};
