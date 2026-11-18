import React from "react";
import { useCurrentFrame } from "remotion";
import { C, FONT } from "./theme";
import { pop } from "./anim";

/** original high-speed train, side view, nose to the right. origin = left end of the rails, length L */
export const Train: React.FC<{ x: number; y: number; L?: number; s?: number; col?: string; stripe?: string; flip?: boolean; glow?: boolean }> = ({
  x, y, L = 640, s = 1, col = "#eef2fb", stripe = C.cyan, flip = false, glow = false,
}) => {
  const cars = Math.max(1, Math.round(L / 210));
  const cw = L / cars;
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
      {glow && <rect x={-20} y={-90} width={L + 140} height={110} rx={40} fill={stripe} opacity={0.35} filter="url(#blur12)" />}
      {Array.from({ length: cars }).map((_, i) => {
        const x0 = i * cw, last = i === cars - 1;
        return (
          <g key={i}>
            {last ? (
              <path d={`M${x0} -80 L${x0 + cw - 40} -80 Q ${x0 + cw + 90} -70 ${x0 + cw + 110} -4 L${x0} -4Z`} fill={col} />
            ) : (
              <rect x={x0} y={-80} width={cw - 6} height={76} rx={10} fill={col} />
            )}
            <rect x={x0 + 14} y={-62} width={(last ? cw - 70 : cw - 34)} height={20} rx={8} fill="#1b2a5a" />
            {Array.from({ length: 4 }).map((_, k) => (
              <rect key={k} x={x0 + 22 + k * ((cw - 60) / 4)} y={-59} width={(cw - 80) / 4} height={14} rx={5} fill={C.yellow} opacity={0.85} />
            ))}
            <rect x={x0} y={-30} width={last ? cw + 60 : cw - 6} height={8} fill={stripe} />
            {last && <path d={`M${x0 + cw - 30} -62 Q ${x0 + cw + 40} -60 ${x0 + cw + 70} -36 L${x0 + cw - 20} -36Z`} fill="#1b2a5a" />}
          </g>
        );
      })}
      <rect x={0} y={-6} width={L + 80} height={6} fill="#5a6488" />
    </g>
  );
};

export const Plane: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-90 0 Q -80 -14 60 -12 Q 96 -10 100 0 Q 96 10 60 12 Q -80 14 -90 0Z" fill={C.cream} />
    <path d="M-10 -10 L-40 -70 L-20 -70 L30 -10Z M-10 10 L-40 70 L-20 70 L30 10Z" fill={C.lilac} />
    <path d="M-80 -6 L-96 -38 L-84 -38 L-60 -8Z" fill={C.lilac} />
    {[0, 1, 2, 3, 4].map((i) => <circle key={i} cx={-40 + i * 20} cy={-2} r={4} fill="#1b2a5a" />)}
  </g>
);

export const RedX: React.FC<{ x: number; y: number; at: number; r?: number }> = ({ x, y, at, r = 120 }) => {
  const f = useCurrentFrame();
  const p = pop(f, at);
  if (p <= 0) return null;
  return (
    <g transform={`translate(${x} ${y}) scale(${p})`}>
      <circle r={r} fill="none" stroke={C.red} strokeWidth={18} />
      <line x1={-r * 0.7} y1={-r * 0.7} x2={r * 0.7} y2={r * 0.7} stroke={C.red} strokeWidth={18} strokeLinecap="round" />
    </g>
  );
};

/** stack of coins, h coins tall */
export const Coins: React.FC<{ x: number; y: number; h: number; s?: number }> = ({ x, y, h, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    {Array.from({ length: Math.max(0, Math.floor(h)) }).map((_, i) => (
      <g key={i} transform={`translate(${Math.sin(i * 1.7) * 3} ${-i * 14})`}>
        <ellipse cx={0} cy={6} rx={46} ry={14} fill="#b88a1a" />
        <rect x={-46} y={-2} width={92} height={8} fill="#d9a62a" />
        <ellipse cx={0} cy={-2} rx={46} ry={14} fill={C.yellow} />
      </g>
    ))}
  </g>
);

export const Title: React.FC<{ x: number; y: number; at: number; text: string; sub?: string; size?: number; color?: string }> = ({
  x, y, at, text, sub, size = 84, color = C.cream,
}) => {
  const f = useCurrentFrame();
  const p = pop(f, at);
  if (p <= 0.001) return null;
  return (
    <g transform={`translate(${x} ${y}) scale(${p})`}>
      <text textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={size} fill={color} stroke="#0b0430" strokeWidth={14} paintOrder="stroke">{text}</text>
      {sub && <text y={size * 0.72} textAnchor="middle" fontFamily={FONT} fontWeight={500} fontSize={size * 0.46} fill={C.cyan}
        stroke="#0b0430" strokeWidth={8} paintOrder="stroke">{sub}</text>}
    </g>
  );
};
