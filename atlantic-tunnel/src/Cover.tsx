import React, { useEffect, useState } from "react";
import { AbsoluteFill, delayRender, continueRender } from "remotion";
import "@fontsource/prompt/thai-500.css";
import "@fontsource/prompt/thai-700.css";
import "@fontsource/prompt/latin-500.css";
import "@fontsource/prompt/latin-700.css";
import { Stage, OrientCtx } from "./common";
import { Sky, Sea } from "./sea";
import { Train } from "./props";
import { C, FONT } from "./theme";

/** 9:16 cover; key text kept between y≈400 and y≈1600 so a 3:4 grid crop keeps it */
export const Cover: React.FC = () => {
  const [handle] = useState(() => delayRender("cover fonts"));
  useEffect(() => {
    Promise.all(["500", "700"].map((w) => document.fonts.load(`${w} 80px Prompt`, "รถไฟ นิวยอร์ก ลอนดอน")))
      .then(() => continueRender(handle)).catch(() => continueRender(handle));
  }, [handle]);
  const TY = 1290;
  return (
    <AbsoluteFill style={{ background: "#07021c" }}>
      <OrientCtx.Provider value="v">
        <Stage cam={{ x: 540, y: 960, s: 1 }}>
          <Sky id="cov" horizon={760} moon={[900, 150]} w={1080} x0={0} />
          <defs>
            <linearGradient id="covw" x1={0} y1={0} x2={0} y2={1}>
              <stop offset="0%" stopColor="#2a6fd6" /><stop offset="40%" stopColor="#163b9a" /><stop offset="100%" stopColor="#060a26" />
            </linearGradient>
          </defs>
          <rect x={-200} y={760} width={1500} height={1300} fill="url(#covw)" />
          <Sea layer="back" horizon={760} x0={-200} w={1500} />
          {[0, 1, 2, 3].map((i) => <path key={i} d={`M${80 + i * 280} 780 L${20 + i * 280} 1700 L${160 + i * 280} 1700Z`} fill="#8fd4ff" opacity={0.07} />)}
          <path d="M-200 1760 Q 300 1720 540 1770 T 1300 1750 V 2100 H -200Z" fill="#2c1a3e" />
          {/* glowing tube with the train */}
          <rect x={-200} y={TY - 150} width={1500} height={300} fill={C.cyan} opacity={0.18} filter="url(#blur30)" />
          <rect x={-200} y={TY - 110} width={1500} height={220} rx={0} fill="#8a9cc8" />
          <rect x={-200} y={TY - 92} width={1500} height={184} fill="#0b1240" />
          {Array.from({ length: 14 }).map((_, i) => <rect key={i} x={-180 + i * 110} y={TY - 110} width={10} height={220} fill="#2a3466" opacity={0.7} />)}
          <Train x={-120} y={TY + 70} L={980} s={1} col="#f4f6ff" stripe={C.pink} glow />
          {[0, 1, 2, 3].map((i) => <rect key={i} x={-200} y={TY - 40 + i * 26} width={220 - i * 30} height={6} rx={3} fill={C.cream} opacity={0.45} />)}
          {[[120, 1580], [760, 1640], [960, 1520], [300, 1000]].map(([x, y], i) => (
            <path key={i} d="M-26 0 Q 0 -16 26 0 Q 0 16 -26 0Z M-26 0 L-40 -12 L-40 12Z" fill={i % 2 ? C.amber : C.pink} transform={`translate(${x} ${y})`} />
          ))}
        </Stage>
        <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
          <g transform="translate(540 450)">
            <rect x={-270} y={-50} width={540} height={84} rx={42} fill={C.pink} />
            <text y={10} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={48} fill={C.cream}>เป็นไปได้ไหม?</text>
          </g>
          <text x={540} y={640} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={128} fill={C.cream} stroke="#0b0430" strokeWidth={20} paintOrder="stroke">รถไฟ</text>
          <text x={540} y={790} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={96} fill={C.yellow} stroke="#0b0430" strokeWidth={18} paintOrder="stroke">นิวยอร์ก → ลอนดอน</text>
          <text x={540} y={920} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={88} fill={C.cream} stroke="#0b0430" strokeWidth={16} paintOrder="stroke">ลอดใต้มหาสมุทร</text>
          <g transform="translate(540 1560)">
            <rect x={-260} y={-46} width={520} height={80} rx={40} fill="#140a3d" opacity={0.85} stroke={C.lilac} strokeOpacity={0.5} strokeWidth={3} />
            <text y={10} textAnchor="middle" fontFamily={FONT} fontWeight={500} fontSize={42} fill={C.cyan}>อุโมงค์ข้ามแอตแลนติก</text>
          </g>
        </svg>
      </OrientCtx.Provider>
    </AbsoluteFill>
  );
};
