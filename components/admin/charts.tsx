"use client";

import { percent } from "@/lib/utils";

export const CHART_COLORS = [
  "#1f7b56",
  "#c9a227",
  "#0e7490",
  "#7c3aed",
  "#d2451e",
  "#4f46e5",
  "#db2777",
  "#65a30d",
  "#0f766e",
  "#b45309",
  "#475569",
  "#9333ea",
];

export interface Segment {
  label: string;
  value: number;
  color?: string;
}

/* ------------------------------ Donut ------------------------------ */
export function DonutChart({
  segments,
  centerLabel,
  size = 168,
  thickness = 22,
}: {
  segments: Segment[];
  centerLabel?: string;
  size?: number;
  thickness?: number;
}) {
  const total = segments.reduce((a, s) => a + s.value, 0);
  const r = (size - thickness) / 2;
  const circ = 2 * Math.PI * r;
  let offset = 0;

  return (
    <div className="flex items-center gap-5">
      <div className="relative shrink-0" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#e2e8f0" strokeWidth={thickness} />
          {segments.map((s, i) => {
            const frac = total > 0 ? s.value / total : 0;
            const dash = frac * circ;
            const el = (
              <circle
                key={s.label}
                cx={size / 2}
                cy={size / 2}
                r={r}
                fill="none"
                stroke={s.color ?? CHART_COLORS[i % CHART_COLORS.length]}
                strokeWidth={thickness}
                strokeDasharray={`${Math.max(dash - 1.2, 0)} ${circ - dash + 1.2}`}
                strokeDashoffset={-offset}
                strokeLinecap="butt"
              />
            );
            offset += dash;
            return el;
          })}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-2xl font-extrabold tracking-tight text-brand-950">{total}</span>
          {centerLabel && <span className="max-w-[90px] text-[10px] font-semibold uppercase tracking-wide text-slate-400">{centerLabel}</span>}
        </div>
      </div>
      <ul className="min-w-0 flex-1 space-y-1.5">
        {segments.map((s, i) => (
          <li key={s.label} className="flex items-center gap-2 text-sm">
            <span className="h-2.5 w-2.5 shrink-0 rounded-sm" style={{ background: s.color ?? CHART_COLORS[i % CHART_COLORS.length] }} />
            <span className="min-w-0 flex-1 truncate text-slate-600">{s.label}</span>
            <span className="font-bold text-slate-800">{s.value}</span>
            <span className="w-11 text-right text-xs text-slate-400">{percent(s.value, total)}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ---------------------------- Bar list ---------------------------- */
export function BarList({
  items,
  maxLabel,
  accent = "#1f7b56",
}: {
  items: { label: string; value: number }[];
  maxLabel?: string;
  accent?: string;
}) {
  const max = Math.max(...items.map((i) => i.value), 1);
  return (
    <div className="space-y-2.5">
      {items.map((item) => (
        <div key={item.label} className="group">
          <div className="mb-1 flex items-baseline justify-between gap-2">
            <span className="truncate text-[13px] font-medium text-slate-600">{item.label}</span>
            <span className="text-[13px] font-bold text-slate-800">{item.value}</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-paper-100">
            <div
              className="h-full rounded-full transition-colors duration-500"
              style={{ width: `${Math.max((item.value / max) * 100, item.value > 0 ? 2.5 : 0)}%`, background: accent }}
            />
          </div>
        </div>
      ))}
      {maxLabel && <p className="pt-1 text-right text-[11px] text-slate-400">{maxLabel}</p>}
    </div>
  );
}

/* --------------------------- Trend (area) --------------------------- */
export function TrendChart({ points, height = 190 }: { points: { label: string; value: number }[]; height?: number }) {
  const W = 640;
  const H = height;
  const pad = { l: 30, r: 12, t: 14, b: 26 };
  const iw = W - pad.l - pad.r;
  const ih = H - pad.t - pad.b;
  const max = Math.max(...points.map((p) => p.value), 4);
  const step = iw / Math.max(points.length - 1, 1);
  const xy = points.map((p, i) => [pad.l + i * step, pad.t + ih - (p.value / max) * ih] as const);
  const line = xy.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  const area = `${line} L${(pad.l + (points.length - 1) * step).toFixed(1)},${pad.t + ih} L${pad.l},${pad.t + ih} Z`;
  const gridLines = [0.25, 0.5, 0.75, 1];

  return (
    <div className="w-full overflow-x-auto">
      <svg viewBox={`0 0 ${W} ${H}`} className="min-w-[480px] w-full" role="img" aria-label="Registration trend">
        <defs>
          <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#2e986c" stopOpacity="0.32" />
            <stop offset="1" stopColor="#2e986c" stopOpacity="0.02" />
          </linearGradient>
        </defs>
        {gridLines.map((g) => {
          const y = pad.t + ih - g * ih;
          return (
            <g key={g}>
              <line x1={pad.l} x2={W - pad.r} y1={y} y2={y} stroke="#e2e8f0" strokeWidth="1" strokeDasharray="3 4" />
              <text x={pad.l - 6} y={y + 3} textAnchor="end" fontSize="9" fill="#94a3b8">
                {Math.round(max * g)}
              </text>
            </g>
          );
        })}
        <path d={area} fill="url(#trendFill)" />
        <path d={line} fill="none" stroke="#1f7b56" strokeWidth="2.4" strokeLinejoin="round" strokeLinecap="round" />
        {xy.map(([x, y], i) => (
          <g key={i}>
            <circle cx={x} cy={y} r="3.4" fill="#ffffff" stroke="#1f7b56" strokeWidth="2.4" />
            <text x={x} y={H - 8} textAnchor="middle" fontSize="8.5" fill="#94a3b8">
              {points[i].label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}
