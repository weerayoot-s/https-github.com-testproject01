import React from "react";
import { useCurrentFrame, random } from "remotion";
import { C } from "./theme";

/** dusk sky: deep navy to violet to a warm horizon, moon, soft clouds */
export const Sky: React.FC<{ horizon?: number; warm?: string; moon?: [number, number] | null; id: string; w?: number; x0?: number }> = ({
  horizon = 640, warm = "#c4527a", moon = [1450, 230], id, w = 1920, x0 = 0,
}) => {
  const f = useCurrentFrame();
  return (
    <g>
      <defs>
        <linearGradient id={`sky-${id}`} x1={0} y1={0} x2={0} y2={1}>
          <stop offset="0%" stopColor={C.space0} />
          <stop offset="45%" stopColor={C.space1} />
          <stop offset="78%" stopColor={C.violet} />
          <stop offset="100%" stopColor={warm} />
        </linearGradient>
      </defs>
      <rect x={x0 - 400} y={-600} width={w + 800} height={horizon + 640} fill={`url(#sky-${id})`} />
      {Array.from({ length: 110 }).map((_, i) => {
        const y = -500 + random(`${id}sy${i}`) * (horizon + 300);
        const o = Math.max(0, 1 - (y + 500) / (horizon + 400)) * (0.55 + 0.45 * Math.sin(f / 15 + i));
        return <circle key={i} cx={x0 - 300 + random(`${id}sx${i}`) * (w + 600)} cy={y} r={0.8 + random(`${id}sr${i}`) * 1.6} fill={C.cream} opacity={o} />;
      })}
      {moon && (
        <g>
          <circle cx={moon[0]} cy={moon[1]} r={150} fill={C.cream} opacity={0.12} filter="url(#blur30)" />
          <circle cx={moon[0]} cy={moon[1]} r={62} fill="#f3eccf" />
          <circle cx={moon[0] - 18} cy={moon[1] - 10} r={12} fill="#ddd3ae" />
          <circle cx={moon[0] + 20} cy={moon[1] + 18} r={8} fill="#ddd3ae" />
          <circle cx={moon[0] + 14} cy={moon[1] - 24} r={6} fill="#ddd3ae" />
        </g>
      )}
      <g opacity={0.55}>
        {[0, 1, 2, 3].map((i) => {
          const cx = x0 + ((i * 560 + f * (0.25 + i * 0.05)) % (w + 800)) - 400, cy = 150 + i * 90;
          return (
            <g key={i} fill={i % 2 ? "#3a1f6b" : "#4b2a7a"}>
              <ellipse cx={cx} cy={cy} rx={190} ry={34} />
              <ellipse cx={cx - 60} cy={cy - 22} rx={90} ry={34} />
              <ellipse cx={cx + 50} cy={cy - 16} rx={70} ry={28} />
            </g>
          );
        })}
      </g>
      <rect x={x0 - 400} y={horizon - 60} width={w + 800} height={80} fill={warm} opacity={0.35} filter="url(#blur30)" />
    </g>
  );
};

const wave = (y: number, amp: number, len: number, ph: number, x0: number, x1: number, bottom: number) => {
  let d = `M${x0} ${bottom} L${x0} ${y}`;
  for (let x = x0; x <= x1; x += 24) d += ` L${x} ${y + Math.sin(x / len + ph) * amp + Math.sin(x / (len * 0.37) + ph * 1.7) * amp * 0.3}`;
  return d + ` L${x1} ${bottom}Z`;
};

/** layered sea; `back` layers draw behind a ship, `front` layers in front */
export const Sea: React.FC<{ horizon?: number; layer: "back" | "front"; x0?: number; w?: number; storm?: number }> = ({
  horizon = 640, layer, x0 = -400, w = 2720, storm = 1,
}) => {
  const f = useCurrentFrame();
  const cols = ["#1b2f8a", "#18308f", "#142a7d", "#10226a", "#0c1a55", "#09143f"];
  const L = layer === "back" ? [0, 1, 2] : [3, 4, 5];
  return (
    <g>
      {layer === "back" && <rect x={x0} y={horizon} width={w} height={2000} fill={cols[0]} />}
      {L.map((i) => {
        const y = horizon + (i === 0 ? 0 : 40 + i * i * 22);
        const amp = (4 + i * 5) * storm;
        return (
          <g key={i}>
            <path d={wave(y, amp, 70 + i * 30, f / (22 - i * 2) + i, x0, x0 + w, y + 2000)} fill={cols[i]} />
            <path d={wave(y, amp, 70 + i * 30, f / (22 - i * 2) + i, x0, x0 + w, y + 2000)} fill="none" stroke="#5fb8e8" strokeOpacity={0.18 + i * 0.03} strokeWidth={3} />
          </g>
        );
      })}
      {layer === "back" &&
        Array.from({ length: 30 }).map((_, i) => {
          const x = x0 + ((random(`gl${i}`) * w + f * 0.6) % w), y = horizon + 10 + random(`gy${i}`) * 140;
          return <rect key={i} x={x} y={y} width={20 + random(`gw${i}`) * 60} height={3} rx={1.5} fill={C.cream} opacity={0.18 * (0.5 + 0.5 * Math.sin(f / 9 + i))} />;
        })}
    </g>
  );
};

/** an original two-masted sailing ship (side view, bow to the right). origin = waterline centre */
export const Ship: React.FC<{ x: number; y: number; s?: number; torn?: number; ghost?: number; name?: boolean; lifeboat?: boolean; bob?: number }> = ({
  x, y, s = 1, torn = 0, ghost = 0, name = false, lifeboat = true, bob = 1,
}) => {
  const f = useCurrentFrame();
  const rot = Math.sin(f / 28) * 2.2 * bob, dy = Math.sin(f / 21) * 6 * bob;
  const sail = (mx: number, top: number, h: number, wTop: number, wBot: number, k: number) => {
    const billow = 14 + Math.sin(f / 18 + k) * 4;
    const tear = torn * (k % 2 ? 1 : 0.5);
    return (
      <g key={`${mx}-${top}`}>
        <path d={`M${mx - wTop / 2} ${top} L${mx + wTop / 2} ${top} Q ${mx + wBot / 2 + billow} ${top + h / 2} ${mx + wBot / 2} ${top + h}
          L${mx + wBot * (0.1 - tear * 0.3)} ${top + h - tear * 40} L${mx - wBot / 2} ${top + h} Q ${mx - wBot / 2 + billow} ${top + h / 2} ${mx - wTop / 2} ${top}Z`}
          fill="#efe6cf" opacity={1 - ghost * 0.4} />
        <path d={`M${mx - wTop / 2} ${top} L${mx + wTop / 2} ${top} Q ${mx + wBot / 2 + billow} ${top + h / 2} ${mx + wBot / 2} ${top + h} L${mx} ${top + h}Z`}
          fill="#d4c6a6" opacity={0.55} />
        <line x1={mx - wTop / 2 - 8} y1={top} x2={mx + wTop / 2 + 8} y2={top} stroke="#5a3a2a" strokeWidth={6} strokeLinecap="round" />
      </g>
    );
  };
  return (
    <g transform={`translate(${x} ${y + dy}) rotate(${rot}) scale(${s})`} opacity={1 - ghost * 0.35}>
      {/* rigging */}
      <g stroke="#2b1a2e" strokeWidth={2} opacity={0.8}>
        <line x1={-280} y1={-10} x2={-95} y2={-430} />
        <line x1={110} y1={-470} x2={420} y2={-50} />
        <line x1={-95} y1={-430} x2={110} y2={-470} />
        <line x1={-95} y1={-430} x2={-30} y2={-10} />
        <line x1={110} y1={-470} x2={180} y2={-10} />
      </g>
      {/* masts */}
      <rect x={-101} y={-440} width={12} height={440} fill="#5a3a2a" />
      <rect x={104} y={-480} width={12} height={480} fill="#5a3a2a" />
      <rect x={290} y={-50} width={150} height={8} fill="#5a3a2a" transform="rotate(-12 290 -46)" />
      {/* fore-mast square sails, main-mast fore-and-aft sail, jib */}
      {sail(110, -455, 110, 150, 190, 1)}
      {sail(110, -330, 130, 190, 240, 2)}
      {sail(110, -185, 140, 240, 280, 3)}
      <path d={`M-92 -400 L-92 -60 L${-250 - Math.sin(f / 18) * 10} -60 Q -190 -230 -92 -400Z`} fill="#efe6cf" opacity={1 - ghost * 0.4} />
      <path d={`M-92 -400 L-92 -60 L-170 -60 Q -150 -230 -92 -400Z`} fill="#d4c6a6" opacity={0.5} />
      <path d={`M125 -440 L${400 + Math.sin(f / 16) * 8} -60 L140 -60Z`} fill="#efe6cf" opacity={(1 - ghost * 0.4) * (1 - torn * 0.6)} />
      {/* flag */}
      <path d={`M110 -480 l40 ${6 + Math.sin(f / 6) * 5} l-40 ${14}Z`} fill={C.red} />
      {/* lifeboat on davits */}
      {lifeboat && <path d="M-210 -34 Q -170 -10 -120 -34Z" fill="#7a4a3a" stroke="#3b1f2e" strokeWidth={3} />}
      {!lifeboat && <path d="M-210 -34 Q -170 -10 -120 -34" fill="none" stroke={C.cream} strokeWidth={3} strokeDasharray="6 6" opacity={0.8} />}
      <line x1={-215} y1={-50} x2={-215} y2={-20} stroke="#3b1f2e" strokeWidth={4} />
      <line x1={-115} y1={-50} x2={-115} y2={-20} stroke="#3b1f2e" strokeWidth={4} />
      {/* hull */}
      <path d="M-280 -24 L300 -24 Q 360 -30 400 -64 L 380 0 Q 340 92 220 100 L-200 100 Q -265 88 -290 30Z" fill="#3a1d33" />
      <path d="M-280 -24 L300 -24 Q 360 -30 400 -64 L 392 -40 Q 350 -6 300 -4 L-280 -4Z" fill="#6b3a4a" />
      <path d="M-284 20 L370 20" stroke="#e8d7b0" strokeWidth={6} />
      {[-200, -120, -40, 40, 120, 200, 280].map((px) => <rect key={px} x={px} y={34} width={22} height={16} rx={3} fill="#1d0c1c" />)}
      <path d="M-200 100 L220 100 Q 340 92 380 0 L392 20 Q 350 110 220 116 L-200 116Z" fill="#1d0c1c" opacity={0.6} />
      {name && <text x={-60} y={78} fontFamily="Prompt, sans-serif" fontWeight={600} fontSize={30} fill="#e8d7b0" letterSpacing={4}>MARY CELESTE</text>}
      {/* lantern */}
      <circle cx={380} cy={-60} r={8} fill={C.amber} opacity={ghost ? 0.3 : 1} />
      {!ghost && <circle cx={380} cy={-60} r={30} fill={C.amber} opacity={0.4} filter="url(#blur12)" />}
    </g>
  );
};

export const Barrel: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-22 -30 Q -30 0 -22 30 L22 30 Q 30 0 22 -30Z" fill="#9b5a35" />
    <path d="M-22 -30 Q -30 0 -22 30 L-6 30 Q -12 0 -6 -30Z" fill="#b87043" />
    <rect x={-27} y={-14} width={54} height={5} fill="#4b2a2a" />
    <rect x={-27} y={10} width={54} height={5} fill="#4b2a2a" />
    <ellipse cx={0} cy={-30} rx={22} ry={6} fill="#c98a5a" />
  </g>
);

/** small rowing boat */
export const Lifeboat: React.FC<{ x: number; y: number; s?: number; people?: number }> = ({ x, y, s = 1, people = 0 }) => {
  const f = useCurrentFrame();
  return (
    <g transform={`translate(${x} ${y + Math.sin(f / 14) * 5}) rotate(${Math.sin(f / 19) * 4}) scale(${s})`}>
      {Array.from({ length: people }).map((_, i) => (
        <g key={i} transform={`translate(${-60 + i * 13} ${-18 - (i % 2) * 4})`}>
          <rect x={-5} y={-14} width={10} height={16} rx={4} fill={i % 3 === 0 ? C.teal : i % 3 === 1 ? "#3b6fd0" : C.pink} />
          <circle cx={0} cy={-19} r={6} fill="#ffd9b8" />
        </g>
      ))}
      <path d="M-80 -10 L80 -10 Q 70 20 40 24 L-50 24 Q -75 18 -80 -10Z" fill="#7a4a3a" />
      <path d="M-80 -10 L80 -10 L76 -2 L-78 -2Z" fill="#a8684c" />
    </g>
  );
};
