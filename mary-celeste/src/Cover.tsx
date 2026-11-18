import React, { useEffect, useState } from "react";
import { AbsoluteFill, delayRender, continueRender } from "remotion";
import "@fontsource/prompt/thai-500.css";
import "@fontsource/prompt/thai-700.css";
import "@fontsource/prompt/latin-500.css";
import "@fontsource/prompt/latin-700.css";
import { Stage, OrientCtx } from "./common";
import { Sky, Sea, Ship } from "./sea";
import { C, FONT } from "./theme";

/** 9:16 cover. Key text sits between y≈420 and y≈1500, so a 3:4 grid crop (y 240–1680) keeps it. */
export const Cover: React.FC = () => {
  const [handle] = useState(() => delayRender("cover fonts"));
  useEffect(() => {
    Promise.all(["500", "700"].map((w) => document.fonts.load(`${w} 80px Prompt`, "แมรี เซเลสต์ 1872")))
      .then(() => continueRender(handle)).catch(() => continueRender(handle));
  }, [handle]);
  const text = (
    <g>
      {/* kicker */}
      <g transform="translate(540 470)">
        <rect x={-230} y={-50} width={460} height={84} rx={42} fill={C.red} />
        <text y={10} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={50} fill={C.cream}>ปริศนาเรือผี</text>
      </g>
      <text x={540} y={680} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={168} fill={C.cream}
        stroke="#0b0430" strokeWidth={22} paintOrder="stroke">แมรี</text>
      <text x={540} y={850} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={168} fill={C.cream}
        stroke="#0b0430" strokeWidth={22} paintOrder="stroke">เซเลสต์</text>
      <text x={540} y={950} textAnchor="middle" fontFamily={FONT} fontWeight={500} fontSize={58} fill={C.cyan}
        stroke="#0b0430" strokeWidth={10} paintOrder="stroke">10 คน หายไปกลางทะเล</text>
      {/* big question mark accent */}
      <text x={915} y={1470} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={300} fill={C.amber}
        stroke="#0b0430" strokeWidth={16} paintOrder="stroke" transform="rotate(10 915 1370)">?</text>
      <g transform="translate(540 1600)">
        <rect x={-150} y={-44} width={300} height={76} rx={38} fill="#140a3d" opacity={0.85} stroke={C.lilac} strokeOpacity={0.5} strokeWidth={3} />
        <text y={10} textAnchor="middle" fontFamily={FONT} fontWeight={500} fontSize={44} fill={C.amber}>ค.ศ. 1872</text>
      </g>
    </g>
  );
  return (
    <AbsoluteFill style={{ background: "#07021c" }}>
      <OrientCtx.Provider value="v">
        <Stage cam={{ x: 960, y: 640, s: 1 }} vcam={{ x: 980, y: 700, s: 1.25 }} voverlay={text}>
          <Sky id="cover" horizon={1000} moon={[1270, 130]} warm="#5a2a7a" />
          <circle cx={1270} cy={130} r={260} fill={C.cream} opacity={0.08} filter="url(#blur30)" />
          <Sea layer="back" horizon={1000} />
          <circle cx={980} cy={880} r={260} fill={C.cyan} opacity={0.22} filter="url(#blur30)" />
          <rect x={700} y={1000} width={600} height={12} fill={C.cream} opacity={0.3} filter="url(#blur4)" />
          <Ship x={960} y={1030} s={0.6} torn={1} ghost={0.6} lifeboat={false} bob={0} />
          <rect x={-400} y={900} width={2800} height={220} fill={C.lilac} opacity={0.18} filter="url(#blur30)" />
          <Sea layer="front" horizon={1000} />
        </Stage>
      </OrientCtx.Provider>
    </AbsoluteFill>
  );
};
