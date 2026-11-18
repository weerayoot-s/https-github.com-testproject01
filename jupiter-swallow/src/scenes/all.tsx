import React from "react";
import { useCurrentFrame, random, Easing } from "remotion";
import { Stage, SpaceBg, Stars, Label, Counter } from "../common";
import { Title } from "../props";
import { Ball, Jupiter, Planetoid, P, JUP_BANDS } from "../planets";
import { C, FONT } from "../theme";
import { ramp, pop, lerp } from "../anim";
import { cF, SHOTS, TOTAL } from "../timing";

const Space: React.FC<{ hue?: string; children: React.ReactNode; cam: { x: number; y: number; s: number }; seed: string }> = ({ hue = C.space2, children, cam, seed }) => (
  <Stage cam={cam} bg={<SpaceBg hue={hue} />}>
    <Stars seed={seed} n={110} w={1080} />
    {children}
  </Stage>
);

/** Shot 1: Jupiter, the giant — what if it swallowed every planet? */
export const Intro: React.FC = () => {
  const f = useCurrentFrame();
  const s0 = SHOTS.intro;
  const cWhat = cF(1) - s0;
  const cam = { x: 540, y: lerp(1000, 960, ramp(f, 0, 200)), s: lerp(0.95, 1.05, ramp(f, 0, 200)) };
  const order: (keyof typeof P)[] = ["mercury", "venus", "earth", "mars", "saturn", "uranus", "neptune"];
  return (
    <Space cam={cam} seed="intro">
      <Jupiter x={540} y={1200} r={420} id="ji" />
      {order.map((k, i) => {
        const a = Math.PI * (1.08 + (i / 6) * 0.84) + f / 300;
        const x = 540 + Math.cos(a) * 450, y = 1200 + Math.sin(a) * 360 - 120;
        const r = k === "saturn" ? 46 : k === "uranus" || k === "neptune" ? 40 : 26;
        return <g key={k} transform={`translate(${x} ${y}) scale(${pop(f, cWhat + i * 3)}) translate(${-x} ${-y})`}><Planetoid k={k} x={x} y={y} r={r} id={`io${i}`} /></g>;
      })}
      <Title x={540} y={300} at={6} text="ดาวพฤหัสบดี" sub="ยักษ์ใหญ่แห่งระบบสุริยะ" size={120} color={C.yellow} />
      <Title x={540} y={1800} at={cWhat + 6} text="ถ้ามันกลืนดาวทุกดวง?" size={76} />
    </Space>
  );
};

/** Shot 2: ~1,300 Earths fit inside; more massive than all the other planets combined */
export const Size: React.FC = () => {
  const f = useCurrentFrame();
  const s0 = SHOTS.size;
  const cMass = 140;
  const cam = { x: 540, y: lerp(980, 1000, ramp(f, 0, 230)), s: 1 };
  const R = 360, cx = 540, cy = 820;
  const dots: [number, number, number][] = [];
  const sp = 17.6;
  for (let yy = -R; yy <= R; yy += sp * 0.866) for (let xx = -R; xx <= R; xx += sp) {
    const ox = xx + (Math.round((yy + R) / (sp * 0.866)) % 2 ? sp / 2 : 0);
    if (ox * ox + yy * yy < (R - 8) ** 2) dots.push([ox, yy, Math.hypot(ox, yy)]);
  }
  const fill = ramp(f, 10, cMass - 10, Easing.inOut(Easing.cubic));
  const n = dots.length;
  const tilt = lerp(0, -8, ramp(f, cMass + 10, cMass + 40, Easing.out(Easing.back(2))));
  return (
    <Space cam={cam} seed="size" hue={C.blue}>
      <circle cx={cx} cy={cy} r={R + 8} fill="#120638" />
      <circle cx={cx} cy={cy} r={R} fill="#f6d7a8" opacity={0.25} />
      {dots.map(([x, y, d], i) => (d / R < fill * 1.05 ? <circle key={i} cx={cx + x} cy={cy + y} r={7.2} fill={i % 7 === 0 ? "#46d36a" : "#3f9bff"} /> : null))}
      <circle cx={cx} cy={cy} r={R} fill="none" stroke={C.orange} strokeWidth={10} />
      <Title x={540} y={300} at={4} text="ใส่โลกได้ราว" size={72} />
      <Counter x={540} y={1300} a={10} b={cMass - 10} to={1300} unit="ใบ" size={130} />
      {/* balance: Jupiter vs all the other planets */}
      <g opacity={ramp(f, cMass, cMass + 12)} transform={`translate(540 1650) rotate(${tilt})`}>
        <rect x={-6} y={-10} width={12} height={150} fill={C.lilac} transform={`rotate(${-tilt})`} />
        <rect x={-380} y={-14} width={760} height={16} rx={8} fill={C.lilac} />
        <Jupiter x={-280} y={-100} r={86} id="bal" />
        {(["mercury", "venus", "earth", "mars", "saturn", "uranus", "neptune"] as const).map((k, i) => (
          <Planetoid key={k} k={k} x={200 + (i % 4) * 44 - 40} y={-40 - Math.floor(i / 4) * 52} r={k === "saturn" ? 30 : 20} id={`bp${i}`} />
        ))}
      </g>
      <Label x={540} y={1840} at={cMass + 14} text="มวลมากกว่าดาวเคราะห์อื่นรวมกัน ~2.5 เท่า" color={C.amber} size={38} />
    </Space>
  );
};

/** Shot 3: first the rocky planets — Mercury, Venus, Earth, Mars */
export const Rocky: React.FC = () => {
  const f = useCurrentFrame();
  const s0 = SHOTS.rocky;
  const cues = [cF(3), cF(4), cF(5), cF(6)].map((c) => c - s0);
  const pull = ramp(f, cues[3] + 25, cues[3] + 45, Easing.in(Easing.quad));
  const cam = { x: 540, y: lerp(1020, 960, ramp(f, 0, 130)), s: 1 };
  const keys = ["mercury", "venus", "earth", "mars"] as const;
  const rs = [44, 70, 74, 54];
  return (
    <Space cam={cam} seed="rocky" hue={C.violet}>
      <Jupiter x={540} y={-420} r={760} id="jr" />
      <Title x={540} y={620} at={2} text="เริ่มจากดาวหิน 4 ดวง" size={70} />
      {keys.map((k, i) => {
        const x0 = 170 + i * 247, y0 = 1180;
        const x = lerp(x0, 540, pull), y = lerp(y0, 300, pull);
        const p = pop(f, cues[i]);
        return (
          <g key={k} transform={`translate(${x} ${y}) scale(${p * (1 - pull * 0.6)}) translate(${-x} ${-y})`}>
            <Planetoid k={k} x={x} y={y} r={rs[i]} id={`rk${i}`} />
            <text x={x} y={y + rs[i] + 64} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={42} fill={C.cream} stroke="#120638" strokeWidth={8} paintOrder="stroke" opacity={1 - pull}>{P[k].name}</text>
          </g>
        );
      })}
    </Space>
  );
};

/** Shot 4: falling into the clouds — winds of hundreds of km/h, then heat and pressure melt rock */
export const Fall: React.FC = () => {
  const f = useCurrentFrame();
  const s0 = SHOTS.fall;
  const cWind = cF(8) - s0, cDeep = cF(9) - s0, cMelt = cF(10) - s0;
  const deep = ramp(f, cDeep - 10, cMelt + 60);
  const scroll = f * 14;
  const shake = f > cWind && f < cDeep ? Math.sin(f * 1.7) * 6 : 0;
  const cam = { x: 540 + shake, y: 960, s: 1 };
  const hot = ramp(f, cMelt, cMelt + 70);
  return (
    <Stage cam={cam} bg={<rect width={1920} height={1080} fill="#f6d7a8" />}>
      {/* cloud bands scrolling upward */}
      {Array.from({ length: 16 }).map((_, i) => {
        const h = 170;
        const y = ((i * h - scroll) % (16 * h) + 16 * h) % (16 * h) - h;
        let d = `M-200 ${y}`;
        for (let k = 0; k <= 14; k++) d += ` L${-200 + k * 110} ${y + Math.sin(k * 0.9 + i + f / 20) * 22}`;
        d += ` L1340 ${y + h + 30} L-200 ${y + h + 30}Z`;
        return <path key={i} d={d} fill={JUP_BANDS[i % JUP_BANDS.length]} />;
      })}
      {/* getting darker and hotter with depth */}
      <rect x={-200} y={-200} width={1500} height={2400} fill="#a8321e" opacity={deep * 0.75} />
      <rect x={-200} y={-200} width={1500} height={2400} fill="#ff6a1a" opacity={hot * 0.35} />
      <circle cx={540} cy={1000} r={600} fill={C.yellow} opacity={hot * 0.4} filter="url(#blur30)" />
      {/* wind streaks */}
      {f > cWind && Array.from({ length: 22 }).map((_, i) => {
        const y = 200 + random(`w${i}`) * 1600, x = ((random(`wx${i}`) * 1600 + f * (40 + (i % 4) * 12)) % 1800) - 400;
        return <rect key={i} x={x} y={y} width={260 + (i % 3) * 120} height={8} rx={4} fill="#ffffff" opacity={0.7 * (1 - deep)} />;
      })}
      {/* Earth falling, glowing as it heats */}
      <g transform={`translate(${540 + Math.sin(f / 9) * 30 * (1 - deep)} 1000) scale(${lerp(1, 0.85, hot)} ${lerp(1, 0.75, hot)})`}>
        <circle r={150} fill={C.red} opacity={hot * 0.7} filter="url(#blur12)" />
        <Planetoid k="earth" x={0} y={0} r={110} id="fall" />
        <circle r={110} fill="#ff5a1a" opacity={hot * 0.75} />
        <circle r={60} fill={C.yellow} opacity={hot * 0.6} filter="url(#blur12)" />
      </g>
      <Title x={540} y={320} at={4} text="ดิ่งลงสู่ชั้นเมฆ" size={90} color={C.cream} />
      <Label x={540} y={1450} at={cWind + 4} text="ลมแรงหลายร้อย กม./ชม." color={C.cyan} size={54} out={cMelt - 6} />
      <Label x={540} y={1450} at={cMelt + 6} text="ร้อน + แรงดันสูง" sub="จนหินหลอมละลาย" color={C.yellow} size={60} />
    </Stage>
  );
};

/** Shot 5: all four together are less than 1% of Jupiter's mass */
export const Tiny: React.FC = () => {
  const f = useCurrentFrame();
  const cam = { x: 540, y: lerp(990, 950, ramp(f, 0, 130)), s: 1 };
  const g = ramp(f, 30, 70);
  return (
    <Space cam={cam} seed="tiny" hue={C.violet}>
      <Title x={540} y={330} at={4} text="ทั้ง 4 ดวงรวมกัน" size={80} />
      <Title x={540} y={520} at={14} text="หนักไม่ถึง 1%" sub="ของมวลดาวพฤหัสบดี (≈ 0.6%)" size={120} color={C.yellow} />
      {/* 10x10 grid = Jupiter's mass; the rocky planets fill 0.6 of one cell */}
      <g transform="translate(190 760)">
        {Array.from({ length: 100 }).map((_, i) => (
          <rect key={i} x={(i % 10) * 70} y={Math.floor(i / 10) * 70} width={62} height={62} rx={10} fill={C.orange}
            opacity={ramp(f, 8 + i * 0.2, 14 + i * 0.2)} stroke="#120638" strokeWidth={4} />
        ))}
        <rect x={0} y={0} width={62} height={62} rx={10} fill="#2a1060" opacity={g} />
        <rect x={0} y={62 - 62 * 0.6 * g} width={62} height={62 * 0.6 * g} rx={6} fill={C.cyan} />
        <circle cx={31} cy={31} r={60} fill="none" stroke={C.cyan} strokeWidth={6} opacity={g * (0.6 + 0.4 * Math.sin(f / 5))} />
      </g>
      <Label x={540} y={1600} at={40} text="ช่องเล็กๆ นี้ = ดาวหินทั้ง 4" color={C.cyan} size={46} px={221} py={791} />
    </Space>
  );
};

/** Shot 6: then Saturn, Uranus, Neptune — swallowed; mass up ~40% */
export const Giants: React.FC = () => {
  const f = useCurrentFrame();
  const s0 = SHOTS.giants;
  const cShow = cF(13) - s0, cEat = cF(14) - s0, cMass = cF(15) - s0;
  const cam = { x: 540, y: lerp(980, 940, ramp(f, 0, 250)), s: lerp(1, 1.04, ramp(f, 0, 250)) };
  const JX = 540, JY = 1250;
  const gs = [{ k: "saturn" as const, x: 230, y: 560, r: 100 }, { k: "uranus" as const, x: 560, y: 470, r: 70 }, { k: "neptune" as const, x: 860, y: 600, r: 70 }];
  const eat = (i: number) => ramp(f, cEat + i * 10, cEat + 30 + i * 10, Easing.in(Easing.cubic));
  const flash = Math.max(0, ...gs.map((_, i) => { const t = f - (cEat + 30 + i * 10); return t >= 0 && t < 12 ? 1 - t / 12 : 0; }));
  return (
    <Space cam={cam} seed="giants" hue={C.blue}>
      <Jupiter x={JX} y={JY} r={360 + flash * 14} id="jg" />
      <circle cx={JX} cy={JY} r={420} fill={C.yellow} opacity={flash * 0.5} filter="url(#blur30)" />
      {gs.map((g, i) => {
        const t = eat(i);
        const x = lerp(g.x, JX, t), y = lerp(g.y, JY, t);
        const sc = pop(f, cShow + i * 20) * (1 - t);
        if (sc <= 0.01) return null;
        return (
          <g key={g.k} transform={`translate(${x} ${y}) scale(${sc}) translate(${-x} ${-y})`}>
            <Planetoid k={g.k} x={x} y={y} r={g.r} id={`gg${i}`} />
            <text x={x} y={y + g.r + 60} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={40} fill={C.cream} stroke="#120638" strokeWidth={8} paintOrder="stroke">{P[g.k].name}</text>
          </g>
        );
      })}
      <Title x={540} y={290} at={4} text="ต่อมาคือดาวยักษ์" size={78} />
      <g opacity={ramp(f, cMass, cMass + 8)}>
        <Counter x={540} y={760} a={cMass} b={cMass + 45} from={318} to={447} unit="เท่าของโลก" size={110} />
        <Label x={540} y={860} at={cMass + 20} text="มวลเพิ่มขึ้นราว 40%" color={C.yellow} size={50} />
      </g>
    </Space>
  );
};

/** Shot 7: but it barely gets bigger — extra mass squeezes it */
export const Squeeze: React.FC = () => {
  const f = useCurrentFrame();
  const s0 = SHOTS.squeeze;
  const cWhy = cF(17) - s0 + 60;
  const cam = { x: 540, y: lerp(960, 940, ramp(f, 0, 200)), s: 1 };
  const sq = ramp(f, cWhy, cWhy + 20);
  const pulse = 1 - 0.03 * sq * (0.5 + 0.5 * Math.sin(f / 4));
  return (
    <Space cam={cam} seed="sq" hue={C.violet}>
      <Title x={540} y={330} at={4} text="แต่ที่แปลกคือ…" size={76} />
      <Title x={540} y={490} at={30} text="ขนาดแทบไม่ใหญ่ขึ้น" size={86} color={C.yellow} />
      <Jupiter x={290} y={1050} r={220} id="before" />
      <g transform={`translate(790 1050) scale(${pulse}) translate(-790 -1050)`}><Jupiter x={790} y={1050} r={226} id="after" /></g>
      <line x1={40} y1={830} x2={1040} y2={830} stroke={C.cream} strokeWidth={4} strokeDasharray="14 12" opacity={pop(f, 40)} />
      <line x1={40} y1={1270} x2={1040} y2={1270} stroke={C.cream} strokeWidth={4} strokeDasharray="14 12" opacity={pop(f, 40)} />
      <text x={290} y={1400} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={44} fill={C.cream} opacity={pop(f, 20)}>ก่อน</text>
      <text x={790} y={1400} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={44} fill={C.cream} opacity={pop(f, 26)}>หลังกลืน (+40%)</text>
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
        const a = (i / 8) * Math.PI * 2, r = 268 - 14 * Math.sin(f / 5);
        return (
          <path key={i} d="M30 0 L-6 0 M14 -16 L-6 0 L14 16" transform={`translate(${790 + Math.cos(a) * r} ${1050 + Math.sin(a) * r}) rotate(${(a * 180) / Math.PI})`}
            stroke={C.cyan} strokeWidth={10} fill="none" strokeLinecap="round" strokeLinejoin="round" opacity={sq} />
        );
      })}
      <Label x={540} y={1580} at={cWhy + 4} text="มวลมากขึ้น = แรงโน้มถ่วงมากขึ้น" sub="บีบเนื้อดาวให้แน่นขึ้น" color={C.cyan} size={46} />
    </Space>
  );
};

/** Shot 8: would it become a star? not yet — it would need ~80 times Jupiter's mass */
export const Star: React.FC = () => {
  const f = useCurrentFrame();
  const s0 = SHOTS.star;
  const cNo = cF(19) - s0, cNeed = cF(20) - s0;
  const cam = { x: 540, y: lerp(980, 940, ramp(f, 0, 250)), s: 1 };
  const grid = ramp(f, cNeed + 10, cNeed + 110);
  return (
    <Space cam={cam} seed="star" hue="#7a2ad0">
      <Title x={540} y={300} at={4} text="จะกลายเป็นดาวฤกษ์ไหม?" size={74} />
      <g opacity={1 - ramp(f, cNeed, cNeed + 10)}>
        <circle cx={540} cy={1000} r={420} fill={C.yellow} opacity={0.25 + 0.1 * Math.sin(f / 6)} filter="url(#blur30)" />
        <Jupiter x={540} y={1000} r={300} id="js" />
        <g transform={`translate(540 1000) scale(${pop(f, cNo)}) rotate(-8)`}>
          <rect x={-300} y={-90} width={600} height={170} rx={30} fill={C.red} stroke="#120638" strokeWidth={8} />
          <text y={36} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={100} fill={C.cream}>ยังไม่ได้!</text>
        </g>
      </g>
      <g opacity={ramp(f, cNeed, cNeed + 10)}>
        <Title x={540} y={490} at={cNeed} text="ต้องหนักกว่านี้อีกหลายสิบเท่า" size={60} color={C.yellow} />
        {Array.from({ length: 80 }).map((_, i) => {
          const x = 135 + (i % 8) * 116, y = 650 + Math.floor(i / 8) * 96;
          return grid * 80 > i ? <Ball key={i} x={x} y={y} r={38} col="#f6d7a8" col2="#d78a4e" bands={JUP_BANDS.slice(0, 5)} id={`g80-${i}`} /> : null;
        })}
        <Label x={540} y={1690} at={cNeed + 40} text="ดาวฤกษ์ต้องมีมวล ~80 เท่าของดาวพฤหัสบดี" sub="จึงจะเริ่มหลอมไฮโดรเจนได้" color={C.cyan} size={40} />
      </g>
    </Space>
  );
};

/** Shot 9: in 1994 comet Shoemaker–Levy 9 really did hit Jupiter */
export const Comet: React.FC = () => {
  const f = useCurrentFrame();
  const s0 = SHOTS.comet;
  const cHit = cF(22) - s0;
  const cam = { x: 540, y: lerp(980, 1000, ramp(f, 0, 230)), s: lerp(1, 1.06, ramp(f, 0, 230)) };
  const JX = 540, JY = 1250, R = 400;
  const frags = 21;
  return (
    <Space cam={cam} seed="comet" hue={C.blue}>
      <Jupiter x={JX} y={JY} r={R} id="jc" />
      {Array.from({ length: frags }).map((_, i) => {
        const tHit = cHit + 20 + i * 6;
        const t = ramp(f, tHit - 90, tHit, Easing.in(Easing.quad));
        const hx = JX - 260 + i * 26, hy = JY - Math.sqrt(R * R - (hx - JX) ** 2) * 0.96;
        const sx = hx + 700, sy = hy - 900;
        const x = lerp(sx, hx, t), y = lerp(sy, hy, t);
        const after = f - tHit;
        return (
          <g key={i}>
            {after < 0 && f > tHit - 90 && (
              <g>
                <line x1={x} y1={y} x2={x + 60} y2={y - 80} stroke={C.mint} strokeWidth={8} strokeLinecap="round" opacity={0.6} />
                <circle cx={x} cy={y} r={9} fill="#ffffff" />
                <circle cx={x} cy={y} r={20} fill={C.cyan} opacity={0.5} filter="url(#blur4)" />
              </g>
            )}
            {after >= 0 && (
              <g>
                <ellipse cx={hx} cy={hy + 26} rx={16 + Math.min(after, 20) * 0.6} ry={9} fill="#3a1a2a" opacity={0.85} />
                {after < 16 && <circle cx={hx} cy={hy} r={20 + after * 5} fill={C.yellow} opacity={1 - after / 16} />}
              </g>
            )}
          </g>
        );
      })}
      <Title x={540} y={320} at={2} text="ค.ศ. 1994" size={130} color={C.yellow} />
      <Label x={540} y={560} at={cHit} text="ดาวหางชูเมกเกอร์–เลวี 9" sub="แตกเป็น 21 ชิ้น พุ่งชนดาวพฤหัสบดีจริง" color={C.cyan} size={48} />
    </Space>
  );
};

/** Shot 10: if you were Jupiter, which planet would you swallow first? */
export const Outro: React.FC = () => {
  const f = useCurrentFrame();
  const s0 = SHOTS.outro;
  const dur = TOTAL - s0;
  const cAsk = cF(24) - s0, cComment = cF(25) - s0;
  const cam = { x: 540, y: lerp(1000, 960, ramp(f, 0, dur)), s: lerp(1.1, 1, ramp(f, 0, dur, Easing.inOut(Easing.sin))) };
  const fade = 1 - ramp(f, dur - 20, dur - 2);
  const order: (keyof typeof P)[] = ["mercury", "venus", "earth", "mars", "saturn", "uranus", "neptune"];
  return (
    <div style={{ position: "absolute", inset: 0, opacity: fade, background: "#160a52" }}>
      <Space cam={cam} seed="outro" hue={C.violet}>
        {order.map((_, i) => <ellipse key={i} cx={540} cy={1080} rx={340 + i * 28} ry={110 + i * 20} fill="none" stroke={C.lilac} strokeOpacity={0.25} strokeWidth={3} />)}
        {order.map((k, i) => {
          const a = f / (40 + i * 12) + i * 1.3;
          const x = 540 + Math.cos(a) * (340 + i * 28), y = 1080 + Math.sin(a) * (110 + i * 20);
          const behind = Math.sin(a) < 0;
          return behind ? <Planetoid key={k} k={k} x={x} y={y} r={k === "saturn" ? 34 : 24} id={`ob${i}`} /> : null;
        })}
        <Jupiter x={540} y={1080} r={260} id="jo" />
        {order.map((k, i) => {
          const a = f / (40 + i * 12) + i * 1.3;
          const x = 540 + Math.cos(a) * (340 + i * 28), y = 1080 + Math.sin(a) * (110 + i * 20);
          return Math.sin(a) >= 0 ? <Planetoid key={k} k={k} x={x} y={y} r={k === "saturn" ? 34 : 24} id={`of${i}`} /> : null;
        })}
        <Title x={540} y={320} at={4} text="ถ้าคุณเป็นดาวพฤหัสบดี" size={74} />
        <Title x={540} y={500} at={cAsk} text="จะกลืนดาวดวงไหนก่อน?" size={82} color={C.yellow} />
        <g transform={`translate(540 1600) scale(${pop(f, cComment) * 1.2})`}>
          <rect x={-170} y={-70} width={340} height={120} rx={30} fill={C.cream} stroke="#120638" strokeWidth={6} />
          <path d="M-90 46 L-110 96 L-50 46Z" fill={C.cream} />
          {[0, 1, 2].map((i) => <circle key={i} cx={-70 + i * 70} cy={-10} r={16} fill={C.violet} opacity={0.5 + 0.5 * Math.sin(f / 4 - i)} />)}
        </g>
        <text x={540} y={1780} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={48} fill={C.cream} stroke="#120638" strokeWidth={8} paintOrder="stroke" opacity={ramp(f, cComment + 6, cComment + 16)}>คอมเมนต์บอกกันหน่อย</text>
      </Space>
    </div>
  );
};
