import React, { createContext, useContext } from "react";
import { random, useCurrentFrame } from "remotion";
import { C, FONT } from "./theme";
import { pop, ramp, lerp } from "./anim";

/** "h" = 16:9 (1920x1080), "v" = 9:16 (1080x1920). Scenes are drawn in the same world coordinates for both. */
export const OrientCtx = createContext<"h" | "v">("h");
export const useV = () => useContext(OrientCtx) === "v";

/** Full-frame SVG stage with a camera: scale around (cx, cy) then translate.
 *  Vertical: the same world is seen through a 1080x1920 window (world shown at `vk` x the camera scale);
 *  `vcam` overrides the camera, screen-space `bg` is scaled to cover, `voverlay` replaces `overlay`. */
export const Stage: React.FC<{
  children: React.ReactNode;
  cam?: { x: number; y: number; s: number; r?: number };
  vcam?: { x: number; y: number; s: number; r?: number };
  vk?: number;
  bg?: React.ReactNode;
  overlay?: React.ReactNode;
  voverlay?: React.ReactNode;
}> = ({ children, cam = { x: 960, y: 540, s: 1 }, vcam, vk = 1, bg, overlay, voverlay }) => {
  const V = useV();
  const W = V ? 1080 : 1920, H = V ? 1920 : 1080;
  const c = V && vcam ? vcam : cam;
  const s = V ? c.s * vk : c.s;
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0 }}>
      <Defs />
      {V ? <g transform="translate(540 960) scale(1.7778) translate(-960 -540)">{bg}</g> : bg}
      <g transform={`translate(${W / 2} ${H / 2}) rotate(${c.r ?? 0}) scale(${s}) translate(${-c.x} ${-c.y})`}>{children}</g>
      {V ? (voverlay ?? <g transform="translate(0 660) scale(0.5625)">{overlay}</g>) : overlay}
      <Grain w={W} h={H} />
      <Vignette w={W} h={H} />
    </svg>
  );
};

export const Defs: React.FC = () => (
  <defs>
    <filter id="blur4" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="4" /></filter>
    <filter id="blur12" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="12" /></filter>
    <filter id="blur30" x="-80%" y="-80%" width="260%" height="260%"><feGaussianBlur stdDeviation="30" /></filter>
    <filter id="grain" x="0" y="0" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="3" />
      <feColorMatrix values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.55 0" />
    </filter>
    <radialGradient id="vig" cx="50%" cy="50%" r="75%">
      <stop offset="60%" stopColor="#05010f" stopOpacity="0" />
      <stop offset="100%" stopColor="#0b0430" stopOpacity="0.28" />
    </radialGradient>
    <radialGradient id="ocean" cx="38%" cy="32%" r="75%">
      <stop offset="0%" stopColor="#3f8cf0" />
      <stop offset="55%" stopColor={C.ocean0} />
      <stop offset="100%" stopColor={C.ocean1} />
    </radialGradient>
    <radialGradient id="shade" cx="30%" cy="28%" r="85%">
      <stop offset="45%" stopColor="#0b0430" stopOpacity="0" />
      <stop offset="100%" stopColor="#0b0430" stopOpacity="0.78" />
    </radialGradient>
    <radialGradient id="atmo" cx="50%" cy="50%" r="50%">
      <stop offset="86%" stopColor={C.cyan} stopOpacity="0" />
      <stop offset="92%" stopColor={C.cyan} stopOpacity="0.45" />
      <stop offset="100%" stopColor={C.cyan} stopOpacity="0" />
    </radialGradient>
    <radialGradient id="mantle" cx="50%" cy="50%" r="50%">
      <stop offset="55%" stopColor={C.mantleBot} />
      <stop offset="100%" stopColor={C.mantleTop} />
    </radialGradient>
    <radialGradient id="outer" cx="50%" cy="50%" r="50%">
      <stop offset="35%" stopColor={C.amber} />
      <stop offset="100%" stopColor={C.outer1} />
    </radialGradient>
    <radialGradient id="inner" cx="45%" cy="40%" r="55%">
      <stop offset="0%" stopColor="#ffffff" />
      <stop offset="60%" stopColor={C.inner} />
      <stop offset="100%" stopColor={C.yellow} />
    </radialGradient>
    <radialGradient id="hotglow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stopColor={C.yellow} stopOpacity="0.9" />
      <stop offset="40%" stopColor={C.orange} stopOpacity="0.45" />
      <stop offset="100%" stopColor={C.red} stopOpacity="0" />
    </radialGradient>
    <linearGradient id="metal" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stopColor="#5c6a8f" />
      <stop offset="45%" stopColor="#dfe6f5" />
      <stop offset="100%" stopColor="#4a5576" />
    </linearGradient>
  </defs>
);

/** fine film grain: breaks up perfectly flat fills a little (the reference is ~81% flat, not 99%) */
export const Grain: React.FC<{ o?: number; w?: number; h?: number }> = ({ o = 0.05, w = 1920, h = 1080 }) => (
  <rect x={0} y={0} width={w} height={h} filter="url(#grain)" opacity={o} style={{ mixBlendMode: "overlay" }} />
);
export const Vignette: React.FC<{ w?: number; h?: number }> = ({ w = 1920, h = 1080 }) => <rect x={0} y={0} width={w} height={h} fill="url(#vig)" />;

export const SpaceBg: React.FC<{ hue?: string }> = ({ hue = C.space2 }) => (
  <>
    <defs>
      <radialGradient id="spacebg" cx="50%" cy="45%" r="80%">
        <stop offset="0%" stopColor={hue} />
        <stop offset="55%" stopColor={C.space1} />
        <stop offset="100%" stopColor={C.space0} />
      </radialGradient>
    </defs>
    <rect width={1920} height={1080} fill="url(#spacebg)" />
    <Nebula />
  </>
);

const Nebula: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <g opacity={0.75} filter="url(#blur30)">
      <ellipse cx={420 + f * 0.1} cy={260} rx={420} ry={180} fill={C.violet} opacity={0.6} />
      <ellipse cx={1560 - f * 0.08} cy={820} rx={460} ry={200} fill={C.blue} opacity={0.5} />
      <ellipse cx={1500} cy={200} rx={260} ry={120} fill={C.teal} opacity={0.25} />
    </g>
  );
};

/** twinkling stars with parallax (world-space or screen-space depending on where it is placed) */
export const Stars: React.FC<{ seed: string; n?: number; w?: number; h?: number; x0?: number; y0?: number }> = ({
  seed, n: n0 = 160, w = 1920, h: h0 = 1080, x0 = 0, y0: y00 = 0,
}) => {
  const f = useCurrentFrame();
  const V = useV();
  // the vertical frame sees ~2x more height: spread the stars over it
  const h = V ? h0 + 1600 : h0, y0 = V ? y00 - 800 : y00, n = V ? Math.round(n0 * 1.8) : n0;
  return (
    <g>
      {Array.from({ length: n }).map((_, i) => {
        const x = x0 + random(`${seed}x${i}`) * w;
        const y = y0 + random(`${seed}y${i}`) * h;
        const big = random(`${seed}b${i}`) > 0.93;
        const r = big ? 2.6 : 0.8 + random(`${seed}r${i}`) * 1.3;
        const tw = 0.55 + 0.45 * Math.sin(f / (12 + random(`${seed}t${i}`) * 20) + i);
        const col = random(`${seed}c${i}`) > 0.8 ? C.mint : random(`${seed}c${i}`) > 0.65 ? C.yellow : C.cream;
        return (
          <g key={i} opacity={tw}>
            {big && <circle cx={x} cy={y} r={9} fill={col} opacity={0.25} filter="url(#blur4)" />}
            {big && <path d={`M${x - 9} ${y}H${x + 9}M${x} ${y - 9}V${y + 9}`} stroke={col} strokeWidth={1} opacity={0.6} />}
            <circle cx={x} cy={y} r={r} fill={col} />
          </g>
        );
      })}
    </g>
  );
};

/** original stylised planet: ocean, scrolling continents, clouds, terminator shade, atmosphere glow */
export const Planet: React.FC<{ cx: number; cy: number; r: number; spin?: number; id: string }> = ({ cx, cy, r, spin = 0.6, id }) => {
  const f = useCurrentFrame();
  const off = (f * spin) % (4 * r);
  const blobs = [
    "M0 -0.55 C0.25 -0.7 0.55 -0.55 0.6 -0.3 C0.7 -0.05 0.45 0.05 0.3 0.25 C0.2 0.45 -0.05 0.4 -0.1 0.2 C-0.2 -0.05 -0.3 -0.35 0 -0.55Z",
    "M1.2 -0.2 C1.4 -0.4 1.75 -0.3 1.8 -0.05 C1.9 0.3 1.6 0.6 1.4 0.75 C1.25 0.85 1.15 0.55 1.2 0.35 C1.25 0.15 1.05 0 1.2 -0.2Z",
    "M-0.9 0.35 C-0.7 0.25 -0.5 0.4 -0.55 0.6 C-0.6 0.8 -0.85 0.8 -0.95 0.65 C-1.05 0.5 -1 0.42 -0.9 0.35Z",
    "M-1.6 -0.7 C-1.3 -0.85 -1 -0.7 -1.05 -0.45 C-1.1 -0.2 -1.45 -0.15 -1.6 -0.35 C-1.7 -0.5 -1.7 -0.62 -1.6 -0.7Z",
  ];
  return (
    <g>
      <circle cx={cx} cy={cy} r={r * 1.18} fill="url(#atmo)" />
      <circle cx={cx} cy={cy} r={r * 1.05} fill={C.cyan} opacity={0.12} filter="url(#blur30)" />
      <clipPath id={`pc-${id}`}><circle cx={cx} cy={cy} r={r} /></clipPath>
      <g clipPath={`url(#pc-${id})`}>
        <circle cx={cx} cy={cy} r={r} fill="url(#ocean)" />
        {[0, 1].map((k) => (
          <g key={k} transform={`translate(${cx - off + k * 4 * r} ${cy}) scale(${r})`}>
            {blobs.map((d, i) => (
              <g key={i}>
                <path d={d} fill={C.land1} transform="translate(0.02 0.03)" />
                <path d={d} fill={C.land0} />
              </g>
            ))}
          </g>
        ))}
        <ellipse cx={cx} cy={cy - r * 0.93} rx={r * 0.5} ry={r * 0.14} fill="#eaf6ff" opacity={0.9} />
        <ellipse cx={cx} cy={cy + r * 0.95} rx={r * 0.45} ry={r * 0.12} fill="#eaf6ff" opacity={0.85} />
        {[0, 1, 2, 3, 4].map((i) => (
          <ellipse key={i} cx={cx - r + ((i * 0.47 * r + f * spin * 1.5) % (2.4 * r))} cy={cy + (i - 2) * r * 0.32}
            rx={r * 0.22} ry={r * 0.035} fill="#ffffff" opacity={0.55} />
        ))}
        <circle cx={cx} cy={cy} r={r} fill="url(#shade)" />
      </g>
      <circle cx={cx - r * 0.35} cy={cy - r * 0.4} r={r * 0.25} fill="#ffffff" opacity={0.06} filter="url(#blur12)" />
    </g>
  );
};

/** half-cut Earth: right half shows the layers (radii from PREM; crust drawn thicker than true scale) */
export const CutEarth: React.FC<{ cx: number; cy: number; r: number; id: string; open?: number; glow?: number }> = ({
  cx, cy, r, id, open = 1, glow = 1,
}) => {
  const f = useCurrentFrame();
  const rc = r * (3480 / 6371), ri = r * (1220 / 6371), rm = r * 0.975;
  const w = r * 1.3 * open;
  return (
    <g>
      <Planet cx={cx} cy={cy} r={r} id={id} spin={0.3} />
      <clipPath id={`cut-${id}`}><rect x={cx} y={cy - r - 4} width={w} height={2 * r + 8} /></clipPath>
      <g clipPath={`url(#cut-${id})`}>
        <circle cx={cx} cy={cy} r={r} fill={C.crust} />
        <circle cx={cx} cy={cy} r={rm} fill="url(#mantle)" />
        {/* mantle texture: faint concentric bands */}
        {[0.9, 0.8, 0.7, 0.62].map((k, i) => (
          <circle key={i} cx={cx} cy={cy} r={r * k} fill="none" stroke="#ffb27a" strokeOpacity={0.12} strokeWidth={2} strokeDasharray="6 14" />
        ))}
        <circle cx={cx} cy={cy} r={rc * 1.08} fill={C.outer0} opacity={0.35 * glow} filter="url(#blur12)" />
        <circle cx={cx} cy={cy} r={rc} fill="url(#outer)" />
        {[0, 1, 2].map((i) => (
          <circle key={i} cx={cx} cy={cy} r={rc * (0.6 + i * 0.12)} fill="none" stroke="#fff3c4" strokeOpacity={0.25}
            strokeWidth={3} strokeDasharray={`${20 + i * 8} 30`} strokeDashoffset={-f * (1 + i * 0.4)} />
        ))}
        <circle cx={cx} cy={cy} r={ri * 1.5} fill={C.yellow} opacity={0.5 * glow} filter="url(#blur12)" />
        <circle cx={cx} cy={cy} r={ri} fill="url(#inner)" />
        <rect x={cx - 3} y={cy - r} width={6} height={2 * r} fill="#2b0d2e" opacity={0.35} />
      </g>
    </g>
  );
};

/** small original character for human scale (round helmet, teal suit) */
export const Person: React.FC<{ x: number; y: number; s?: number; rot?: number; shovel?: boolean; wave?: number }> = ({
  x, y, s = 1, rot = 0, shovel = true, wave = 0,
}) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <ellipse cx={0} cy={0} rx={16} ry={4} fill="#000" opacity={0.25} />
    <rect x={-9} y={-30} width={7} height={30} rx={3.5} fill="#1e5f74" />
    <rect x={2} y={-30} width={7} height={30} rx={3.5} fill="#1e5f74" />
    <rect x={-13} y={-62} width={26} height={36} rx={11} fill={C.teal} />
    <rect x={-13} y={-62} width={10} height={36} rx={5} fill="#26c2b4" opacity={0.6} />
    <circle cx={0} cy={-76} r={13} fill="#ffd9b8" />
    <path d="M-14 -78 A14 14 0 0 1 14 -78 L14 -80 L-14 -80Z" fill={C.amber} />
    <rect x={-15} y={-82} width={30} height={5} rx={2.5} fill={C.amber} />
    <circle cx={4} cy={-75} r={1.8} fill="#2a1830" />
    <circle cx={-4} cy={-75} r={1.8} fill="#2a1830" />
    {shovel ? (
      <g transform={`rotate(${-20 + wave * 30} 12 -50)`}>
        <rect x={10} y={-80} width={4} height={62} rx={2} fill="#9b6b43" />
        <path d="M4 -20 H20 V-6 Q12 6 4 -6Z" fill="url(#metal)" />
        <rect x={7} y={-52} width={10} height={6} rx={3} fill="#ffd9b8" />
      </g>
    ) : (
      <rect x={10} y={-58} width={6} height={26} rx={3} fill={C.teal} transform={`rotate(${-130 + wave * 20} 13 -56)`} />
    )}
  </g>
);

/** pill label with a pointer line, pops in at frame `at` */
export const Label: React.FC<{
  x: number; y: number; at: number; text: string; sub?: string; color?: string; size?: number; anchor?: "start" | "middle" | "end";
  px?: number; py?: number; out?: number;
}> = ({ x, y, at, text, sub, color = C.cream, size = 46, anchor = "middle", px, py, out }) => {
  const f = useCurrentFrame();
  const p = pop(f, at);
  const o = out ? 1 - ramp(f, out, out + 10) : 1;
  if (p <= 0.001 || o <= 0) return null;
  const w = Math.max(text.length, (sub ?? "").length * 0.62) * size * 0.56 + 56;
  const h = sub ? size * 2.25 : size * 1.55;
  const bx = anchor === "middle" ? x - w / 2 : anchor === "end" ? x - w : x;
  return (
    <g opacity={Math.min(1, p) * o}>
      {px !== undefined && (
        <>
          <line x1={x} y1={y + (py! > y ? h / 2 : -h / 2)} x2={lerp(x, px, Math.min(1, p))} y2={lerp(y, py!, Math.min(1, p))}
            stroke={color} strokeWidth={3} strokeDasharray="2 8" strokeLinecap="round" />
          <circle cx={px} cy={py} r={9 * p} fill={color} />
          <circle cx={px} cy={py} r={18 * p} fill={color} opacity={0.25} />
        </>
      )}
      <g transform={`translate(${x} ${y}) scale(${p}) translate(${-x} ${-y})`}>
        <rect x={bx + 4} y={y - h / 2 + 6} width={w} height={h} rx={h / 2} fill="#000" opacity={0.25} />
        <rect x={bx} y={y - h / 2} width={w} height={h} rx={h / 2} fill="#1d0f66" opacity={0.92} stroke={color} strokeOpacity={0.95} strokeWidth={5} />
        <text x={bx + w / 2} y={sub ? y - size * 0.12 : y + size * 0.36} textAnchor="middle" fontFamily={FONT} fontWeight={600}
          fontSize={size} fill={color}>{text}</text>
        {sub && (
          <text x={bx + w / 2} y={y + size * 0.78} textAnchor="middle" fontFamily={FONT} fontWeight={400} fontSize={size * 0.6}
            fill={C.lilac}>{sub}</text>
        )}
      </g>
    </g>
  );
};

/** big number that counts up between frames a and b */
export const Counter: React.FC<{
  x: number; y: number; a: number; b: number; to: number; from?: number; unit: string; size?: number; color?: string; dec?: number; group?: boolean;
}> = ({ x, y, a, b, to, from = 0, unit, size = 96, color = C.yellow, dec = 0, group = true }) => {
  const f = useCurrentFrame();
  const p = pop(f, a);
  if (p <= 0.001) return null;
  const v = lerp(from, to, ramp(f, a, b));
  const s = v.toLocaleString("en-US", { minimumFractionDigits: dec, maximumFractionDigits: dec, useGrouping: group });
  return (
    <g transform={`translate(${x} ${y}) scale(${p})`}>
      <text x={0} y={0} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={size} fill={color}
        stroke="#1a0f45" strokeWidth={10} paintOrder="stroke">{s}<tspan fontSize={size * 0.5} fontWeight={500} fill={C.cream}> {unit}</tspan></text>
    </g>
  );
};
