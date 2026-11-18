import React from "react";
import { useCurrentFrame } from "remotion";
import { C } from "./theme";

const OUT = "#120638";

/** a bold, bright planet: base colour, optional bands, highlight, soft shade, thick outline, glow */
export const Ball: React.FC<{
  x: number; y: number; r: number; col: string; col2?: string; bands?: string[]; ring?: string; id: string; glow?: string; spin?: number; spots?: boolean;
}> = ({ x, y, r, col, col2, bands, ring, id, glow, spin = 0.4, spots = false }) => {
  const f = useCurrentFrame();
  const ringEl = (front: boolean) => ring ? (
    <g>
      <clipPath id={`rc-${id}-${front}`}><rect x={x - r * 2.6} y={front ? y : y - r * 2} width={r * 5.2} height={r * 2} /></clipPath>
      <g clipPath={`url(#rc-${id}-${front})`} transform={`rotate(-14 ${x} ${y})`}>
        <ellipse cx={x} cy={y} rx={r * 2.15} ry={r * 0.55} fill="none" stroke={OUT} strokeWidth={r * 0.3} />
        <ellipse cx={x} cy={y} rx={r * 2.15} ry={r * 0.55} fill="none" stroke={ring} strokeWidth={r * 0.22} />
        <ellipse cx={x} cy={y} rx={r * 1.8} ry={r * 0.46} fill="none" stroke="#fff4cf" strokeWidth={r * 0.06} opacity={0.8} />
      </g>
    </g>
  ) : null;
  return (
    <g>
      {glow && <circle cx={x} cy={y} r={r * 1.35} fill={glow} opacity={0.35} filter="url(#blur30)" />}
      {ringEl(false)}
      <defs>
        <radialGradient id={`bg-${id}`} cx="35%" cy="30%" r="80%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.55" />
          <stop offset="30%" stopColor={col} />
          <stop offset="100%" stopColor={col2 ?? col} />
        </radialGradient>
        <clipPath id={`bc-${id}`}><circle cx={x} cy={y} r={r} /></clipPath>
      </defs>
      <circle cx={x} cy={y} r={r + Math.max(3, r * 0.045)} fill={OUT} />
      <circle cx={x} cy={y} r={r} fill={`url(#bg-${id})`} />
      {bands && (
        <g clipPath={`url(#bc-${id})`}>
          {bands.map((b, i) => {
            const yy = y - r + ((i + 0.5) / bands.length) * 2 * r;
            const h = (2 * r) / bands.length;
            let d = `M${x - r - 40} ${yy - h * 0.32}`;
            for (let k = 0; k <= 12; k++) d += ` L${x - r - 40 + k * ((2 * r + 80) / 12)} ${yy - h * 0.32 + Math.sin(k * 1.3 + f * 0.03 * spin * (i % 2 ? 1 : -1) + i) * h * 0.12}`;
            d += ` L${x + r + 40} ${yy + h * 0.32} L${x - r - 40} ${yy + h * 0.32}Z`;
            return <path key={i} d={d} fill={b} opacity={0.9} />;
          })}
          {spots && (
            <g transform={`translate(${x + r * 0.32 + Math.sin(f / 90) * r * 0.05} ${y + r * 0.3})`}>
              <ellipse rx={r * 0.26} ry={r * 0.14} fill="#ffffff" opacity={0.5} />
              <ellipse rx={r * 0.22} ry={r * 0.115} fill="#e8462f" />
              <ellipse rx={r * 0.13} ry={r * 0.065} fill="#ff7a4a" />
            </g>
          )}
        </g>
      )}
      <circle cx={x} cy={y} r={r} fill={`url(#shade-${id})`} />
      <defs>
        <radialGradient id={`shade-${id}`} cx="30%" cy="28%" r="90%">
          <stop offset="55%" stopColor={OUT} stopOpacity="0" />
          <stop offset="100%" stopColor={OUT} stopOpacity="0.45" />
        </radialGradient>
      </defs>
      <ellipse cx={x - r * 0.38} cy={y - r * 0.42} rx={r * 0.22} ry={r * 0.12} fill="#ffffff" opacity={0.45} transform={`rotate(-30 ${x - r * 0.38} ${y - r * 0.42})`} />
      {ringEl(true)}
    </g>
  );
};

export const JUP_BANDS = ["#fff1d6", "#e9b47a", "#fbe6c4", "#d98a4c", "#f6dcb4", "#c96d3a", "#fff1d6", "#e0a064", "#fbe6c4", "#d98a4c"];
export const Jupiter: React.FC<{ x: number; y: number; r: number; id: string }> = ({ x, y, r, id }) => (
  <Ball x={x} y={y} r={r} col="#f6d7a8" col2="#d78a4e" bands={JUP_BANDS} id={id} glow={C.orange} spots />
);

/** planet catalogue (relative radii exaggerated for the small ones so they read on a phone) */
export const P = {
  mercury: { col: "#c9c3d6", col2: "#7f7894", name: "ดาวพุธ" },
  venus: { col: "#ffe08a", col2: "#e0a040", name: "ดาวศุกร์" },
  earth: { col: "#3f9bff", col2: "#1f4fd0", name: "โลก" },
  mars: { col: "#ff7a4a", col2: "#c8402a", name: "ดาวอังคาร" },
  saturn: { col: "#ffe3a0", col2: "#d9a650", name: "ดาวเสาร์", ring: "#f2cf86", bands: ["#fff0c8", "#f0cf8a", "#ffe8b0", "#e6bd70", "#fff0c8", "#f0cf8a"] },
  uranus: { col: "#8ff4f0", col2: "#3fc2d8", name: "ดาวยูเรนัส" },
  neptune: { col: "#4f7dff", col2: "#2233c8", name: "ดาวเนปจูน", bands: ["#4f7dff", "#3f66f0", "#5a8aff", "#3f66f0", "#4f7dff"] },
};
type Key = keyof typeof P;
export const Planetoid: React.FC<{ k: Key; x: number; y: number; r: number; id: string }> = ({ k, x, y, r, id }) => {
  const p = P[k] as { col: string; col2: string; ring?: string; bands?: string[] };
  if (k === "earth") {
    return (
      <g>
        <Ball x={x} y={y} r={r} col={p.col} col2={p.col2} id={id} />
        <path d={`M${x - r * 0.5} ${y - r * 0.3} q ${r * 0.3} ${-r * 0.4} ${r * 0.6} ${-r * 0.1} q ${r * 0.1} ${r * 0.4} ${-r * 0.2} ${r * 0.6} q ${-r * 0.4} ${r * 0.1} ${-r * 0.4} ${-r * 0.5}Z`} fill="#46d36a" />
        <path d={`M${x + r * 0.2} ${y + r * 0.2} q ${r * 0.3} ${-r * 0.1} ${r * 0.4} ${r * 0.2} q ${-r * 0.1} ${r * 0.3} ${-r * 0.4} ${r * 0.2}Z`} fill="#46d36a" />
      </g>
    );
  }
  return <Ball x={x} y={y} r={r} col={p.col} col2={p.col2} ring={p.ring} bands={p.bands} id={id} />;
};
