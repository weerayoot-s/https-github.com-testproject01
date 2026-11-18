import React, { useEffect, useState } from "react";
import { AbsoluteFill, delayRender, continueRender } from "remotion";
import "@fontsource/prompt/thai-500.css";
import "@fontsource/prompt/thai-700.css";
import "@fontsource/prompt/latin-500.css";
import "@fontsource/prompt/latin-700.css";
import { Stage, SpaceBg, Stars, OrientCtx } from "./common";
import { Jupiter, Planetoid } from "./planets";
import { C, FONT } from "./theme";

/** 9:16 cover; key text between y≈400 and y≈1600 so a 3:4 grid crop keeps it */
export const Cover: React.FC = () => {
  const [handle] = useState(() => delayRender("cover fonts"));
  useEffect(() => {
    Promise.all(["500", "700"].map((w) => document.fonts.load(`${w} 80px Prompt`, "ดาวพฤหัสบดี กลืน")))
      .then(() => continueRender(handle)).catch(() => continueRender(handle));
  }, [handle]);
  const falling: [Parameters<typeof Planetoid>[0]["k"], number, number, number][] = [
    ["earth", 200, 1050, 70], ["mars", 880, 1000, 52], ["saturn", 860, 1660, 70], ["venus", 150, 1700, 60], ["neptune", 960, 1330, 50], ["mercury", 330, 1280, 34],
  ];
  return (
    <AbsoluteFill style={{ background: "#160a52" }}>
      <OrientCtx.Provider value="v">
        <Stage cam={{ x: 540, y: 960, s: 1 }} bg={<SpaceBg hue={C.violet} />}>
          <Stars seed="cover" n={120} w={1080} />
          <Jupiter x={540} y={1520} r={430} id="cj" />
          {falling.map(([k, x, y, r], i) => {
            const dx = 540 - x, dy = 1520 - y, L = Math.hypot(dx, dy);
            return (
              <g key={i}>
                {[1, 2, 3].map((t) => <line key={t} x1={x - (dx / L) * (r + 20 * t)} y1={y - (dy / L) * (r + 20 * t)} x2={x - (dx / L) * (r + 20 * t + 50)} y2={y - (dy / L) * (r + 20 * t + 50)}
                  stroke={C.cream} strokeWidth={8 - t * 2} strokeLinecap="round" opacity={0.7 - t * 0.15} />)}
                <Planetoid k={k} x={x} y={y} r={r} id={`cf${i}`} />
              </g>
            );
          })}
        </Stage>
        <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
          <g transform="translate(540 420)">
            <rect x={-250} y={-52} width={500} height={88} rx={44} fill={C.pink} stroke="#120638" strokeWidth={6} />
            <text y={10} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={50} fill={C.cream}>จะเกิดอะไรขึ้น?</text>
          </g>
          <text x={540} y={610} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={104} fill={C.cream} stroke="#120638" strokeWidth={20} paintOrder="stroke">ถ้าดาวพฤหัสบดี</text>
          <text x={540} y={790} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={150} fill={C.yellow} stroke="#120638" strokeWidth={24} paintOrder="stroke">กลืนดาว</text>
          <text x={540} y={930} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={120} fill={C.cream} stroke="#120638" strokeWidth={22} paintOrder="stroke">ทุกดวง!</text>
        </svg>
      </OrientCtx.Provider>
    </AbsoluteFill>
  );
};
