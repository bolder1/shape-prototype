'use client';
// Scene for ui.6-3: Manoj scrolls past eleven tiles on Roshni's Jaipur ops dashboard and plans on paper. Farah writes
// the decision (where six crews go today), moves tiles that serve someone else's decision, cuts the ones that serve
// nobody's, gives numbers a comparison and swaps dials and pies for sorted bars (`tileVerdict`), lays the answer out top
// left, and times Manoj: two minutes instead of twenty. Pure function of t (0–36). Also exports `TileGlyph` and
// `TILE_SHORT`, which `dash-critique` uses to draw each tile before and after its fix.
import { CHART_GREY, CHART_SERIES, ROSHNI_TILES, tileVerdict, type RoshniTile } from '@shape/content';
import { back, clamp, Grid, lerp, p, SC } from './shared';

const W = 640, H = 360;
const BLUE = CHART_SERIES[0];
export const TILE_SHORT: Record<RoshniTile, string> = {
  under: 'Below 80%', tickets: 'Fault age', crews: 'Crews', faultRate: 'Fault rate', gauges: '140 dials', pie: 'Fault pie',
  revenue: 'Revenue', carbon: 'CO₂ saved', downloads: 'Downloads', lifetime: 'Lifetime', rating: 'Rating',
};
/** The short title a tile takes once it's fixed, where that changes. */
export const TILE_FIXED: Partial<Record<RoshniTile, string>> = { gauges: 'Site output', pie: 'Fault types' };
const ORDER = Object.keys(ROSHNI_TILES) as RoshniTile[];

/** A tile's chart inside (x, y, w, h), as it was or, with `fixed`, after Farah's fix. `fs`: size of any numbers. */
export function TileGlyph({ k, x, y, w, h, fixed = false, fs = 21 }: { k: RoshniTile; x: number; y: number; w: number; h: number; fixed?: boolean; fs?: number }) {
  const bars = (vals: number[], c: string = BLUE) => vals.map((v, i) => (
    <rect key={i} x={x} y={y + (i * h) / vals.length + 1} width={Math.max(2, v * w)} height={h / vals.length - 3} rx={2} fill={c} />
  ));
  const big = (s: string) => <text x={x + w / 2} y={y + h / 2 + fs * 0.35} fontSize={fs} fontWeight={900} fill={SC.text} textAnchor="middle">{s}</text>;
  if (k === 'under' || (k === 'gauges' && fixed)) return <g>{bars([0.95, 0.8, 0.62, 0.48, 0.3].slice(0, Math.max(2, Math.floor(h / 10))))}</g>;
  if (k === 'pie' && fixed) return <g>{bars([0.9, 0.6, 0.42, 0.25])}</g>;
  if (k === 'tickets') {
    const vs = [0.3, 0.55, 0.8, 0.5, 0.35, 0.2];
    return (
      <g>
        {vs.map((v, i) => <rect key={i} x={x + (i * w) / vs.length + 2} y={y + h - v * h} width={w / vs.length - 4} height={v * h} rx={2} fill={i >= 4 ? '#c2403a' : BLUE} />)}
        <line x1={x + (4 * w) / vs.length - 1} y1={y} x2={x + (4 * w) / vs.length - 1} y2={y + h} stroke={SC.text} strokeWidth={2} strokeDasharray="4 3" />
      </g>
    );
  }
  if (k === 'crews') {
    const pts = [[0.1, 0.3], [0.35, 0.7], [0.6, 0.25], [0.85, 0.6], [0.5, 0.9], [0.2, 0.85]];
    return (
      <g>
        <rect x={x} y={y} width={w} height={h} rx={4} fill={SC.soft} />
        {pts.map(([a, b], i) => <circle key={i} cx={x + a * w} cy={y + b * h} r={Math.min(6, h / 8)} fill={BLUE} />)}
        <polyline points={pts.slice(0, 4).map(([a, b]) => `${x + a * w},${y + b * h}`).join(' ')} fill="none" stroke={SC.muted} strokeWidth={1.5} strokeDasharray="3 3" />
      </g>
    );
  }
  if (k === 'faultRate') {
    if (!fixed) return big('3.1%');
    const vs = [2.2, 2.4, 2.3, 2.6, 2.5, 2.8, 2.9, 3.1];
    const sy = (v: number) => y + h - ((v - 1.5) / 3) * h;
    return (
      <g>
        <text x={x} y={y + fs * 0.9} fontSize={fs} fontWeight={900} fill={SC.text}>3.1%</text>
        <polyline points={vs.map((v, i) => `${x + w * 0.45 + (i / 7) * w * 0.55},${sy(v)}`).join(' ')} fill="none" stroke={BLUE} strokeWidth={2.5} />
        <line x1={x + w * 0.45} y1={sy(4)} x2={x + w} y2={sy(4)} stroke={SC.text} strokeWidth={1.5} strokeDasharray="4 3" />
      </g>
    );
  }
  if (k === 'gauges') {
    const n = 12, cols = 6, r = Math.min(w / cols / 2 - 2, h / 4 - 2);
    return (
      <g>
        {Array.from({ length: n }, (_, i) => {
          const cx = x + (i % cols + 0.5) * (w / cols), cy = y + (Math.floor(i / cols) + 0.75) * (h / 2);
          const a = -Math.PI * (0.2 + ((i * 37) % 10) / 14);
          return <g key={i}><path d={`M${cx - r} ${cy} A${r} ${r} 0 0 1 ${cx + r} ${cy}`} fill="none" stroke={SC.line} strokeWidth={3} /><line x1={cx} y1={cy} x2={cx + r * Math.cos(a)} y2={cy + r * Math.sin(a)} stroke={SC.text} strokeWidth={1.5} /></g>;
        })}
      </g>
    );
  }
  if (k === 'pie') {
    const cx = x + w / 2, cy = y + h / 2, r = Math.min(w, h) / 2 - 2;
    const parts = [0.2, 0.16, 0.14, 0.12, 0.1, 0.09, 0.08, 0.06, 0.05];
    return (
      <g>
        {parts.map((v, i) => {
          const a0 = -Math.PI / 2 + parts.slice(0, i).reduce((s, x) => s + x, 0) * Math.PI * 2, a1 = a0 + v * Math.PI * 2;
          const d = `M${cx} ${cy} L${cx + r * Math.cos(a0)} ${cy + r * Math.sin(a0)} A${r} ${r} 0 0 1 ${cx + r * Math.cos(a1)} ${cy + r * Math.sin(a1)} Z`;
          return <path key={i} d={d} fill={i % 2 ? SC.design : SC.discover} opacity={0.3 + (i % 3) * 0.25} stroke="var(--color-bg-primary)" strokeWidth={1.5} />;
        })}
      </g>
    );
  }
  if (k === 'revenue') return <g>{bars([0.9, 0.75, 0.66, 0.4], CHART_GREY)}</g>;
  if (k === 'carbon') return big('1,204 t');
  if (k === 'downloads') return big('+3,420');
  if (k === 'lifetime') return big('48.2M');
  return big('4.6 ★');
}

/** A tile with its short title, at (x, y). */
function Tile({ k, x, y, w, h, fixed, o = 1, hot = false }: { k: RoshniTile; x: number; y: number; w: number; h: number; fixed?: boolean; o?: number; hot?: boolean }) {
  return (
    <g opacity={o}>
      <rect x={x} y={y} width={w} height={h} rx={10} fill={SC.surface} stroke={hot ? BLUE : SC.line} strokeWidth={hot ? 3 : 1.5} />
      <text x={x + 10} y={y + 26} fontSize={21} fontWeight={800} fill={SC.text}>{fixed ? (TILE_FIXED[k] ?? TILE_SHORT[k]) : TILE_SHORT[k]}</text>
      <TileGlyph k={k} x={x + 10} y={y + 36} w={w - 20} h={h - 46} fixed={fixed} fs={21} />
    </g>
  );
}

const cell = (i: number) => ({ x: 24 + (i % 4) * 150, y: 64 + Math.floor(i / 4) * 98, w: 140, h: 90 });
/** Where the six surviving tiles sit on the new board: the answer big, top left. */
const NEW: Partial<Record<RoshniTile, { x: number; y: number; w: number; h: number }>> = {
  under: { x: 24, y: 64, w: 290, h: 186 }, tickets: { x: 326, y: 64, w: 140, h: 90 }, faultRate: { x: 476, y: 64, w: 140, h: 90 },
  gauges: { x: 326, y: 160, w: 140, h: 90 }, pie: { x: 476, y: 160, w: 140, h: 90 }, crews: { x: 24, y: 258, w: 592, h: 90 },
};

export function DecisionBoardScene({ t }: { t: number }) {
  const intro = clamp(back(t / 0.6));
  const title = t < 6 ? 'Eleven tiles, no answer' : t < 11 ? 'Write the decision' : t < 16 ? 'Someone else’s question' : t < 21 ? 'Nobody’s question' : t < 26 ? 'Give numbers a comparison' : t < 31 ? 'Answer top left' : 'Two minutes';
  const gone = (k: RoshniTile) => {
    const v = tileVerdict(ROSHNI_TILES[k]);
    return v === 'move' ? p(t, 11.6, 13) : v === 'cut' ? p(t, 16.6, 18) : 0;
  };
  const fixed = t >= 21.6;
  const settle = p(t, 26.2, 27.6);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" role="img" aria-label="Animated story: an ops dashboard has eleven tiles: lifetime units, a CO₂ counter, revenue, 140 speedometers and more. Farah writes the decision it serves: where six crews go today. Revenue, the CO₂ counter and downloads move to other teams' boards. Lifetime units and the all-time rating are cut. The fault rate gets its trend and a 4% threshold; the dials and the pie become sorted bars. The answer, sites below 80% of expected, goes top left. Manoj plans the day in two minutes instead of twenty.">
      <rect width={W} height={H} fill={SC.soft} />
      <Grid w={W} h={H} />
      <g opacity={intro}>
        <text x={32} y={44} fontSize={26} fontWeight={900} fill={SC.text}>{title}</text>

        {t < 31 && ORDER.map((k, i) => {
          const g = gone(k);
          const v = tileVerdict(ROSHNI_TILES[k]);
          if (g >= 1 && t >= 13) return null;
          const a = cell(i), b = NEW[k] ?? a;
          const r = { x: lerp(a.x, b.x, settle), y: lerp(a.y, b.y, settle), w: lerp(a.w, b.w, settle), h: lerp(a.h, b.h, settle) };
          const dx = v === 'move' ? g * 260 : 0, dy = v === 'cut' ? g * 120 : 0;
          const dim = t >= 6 && t < 11 ? 0.35 : 1;
          return <Tile key={k} k={k} x={r.x + dx} y={r.y + dy} w={r.w} h={r.h} fixed={fixed && v === 'fix'} o={(1 - g) * dim * p(t, 0.2 + i * 0.12, 0.6 + i * 0.12)} hot={t >= 26 && k === 'under'} />;
        })}

        {t >= 6 && t < 11 && (
          <g opacity={p(t, 6.3, 7)}>
            <rect x={60} y={140} width={520} height={92} rx={14} fill={SC.surface} stroke={BLUE} strokeWidth={3} />
            <text x={320} y={178} fontSize={22} fontWeight={900} fill={SC.text} textAnchor="middle">At 7:30, Manoj decides where</text>
            <text x={320} y={210} fontSize={22} fontWeight={900} fill={SC.text} textAnchor="middle">six crews go today.</text>
          </g>
        )}

        {t >= 11 && t < 14 && (
          <g opacity={p(t, 12, 12.6) * (1 - p(t, 13.4, 14))}>
            {['→ Finance board', '→ Customer app', '→ Growth board'].map((s, i) => (
              <text key={s} x={624} y={288 + i * 24} fontSize={18} fontWeight={800} fill={SC.muted} textAnchor="end">{s}</text>
            ))}
          </g>
        )}

        {t >= 26 && t < 31 && <text x={616} y={44} fontSize={21} fontWeight={700} fill={SC.muted} textAnchor="end" opacity={p(t, 28, 28.6)}>Updated 7:15</text>}

        {t >= 31 && (() => {
          const k = p(t, 31.6, 33.6);
          const mins = Math.round(lerp(20, 2, k));
          return (
            <g>
              <circle cx={200} cy={210} r={92} fill={SC.surface} stroke={SC.line} strokeWidth={4} />
              <path d={`M200 210 L200 118 A92 92 0 ${mins > 10 ? 1 : 0} 1 ${200 + 92 * Math.sin((mins / 20) * Math.PI * 2)} ${210 - 92 * Math.cos((mins / 20) * Math.PI * 2)} Z`} fill={BLUE} opacity={0.85} />
              <text x={360} y={200} fontSize={64} fontWeight={900} fill={SC.text}>{mins} min</text>
              <text x={360} y={244} fontSize={21} fontWeight={800} fill={SC.muted}>{k < 1 ? 'On paper' : <><tspan x={360}>Same six routes,</tspan><tspan x={360} dy={28}>new board</tspan></>}</text>
            </g>
          );
        })()}
      </g>
    </svg>
  );
}
