'use client';
// Scene for br.1-1: three rings. The logo at the centre, the identity system around it (colour, type, icons, photos,
// voice), and the brand on the outside as what people say. A new logo leaves the complaints unchanged; fixing refunds
// changes what people say. Pure function of t (0–34).
import { back, clamp, Grid, p, SC } from './shared';

const W = 960, H = 540;
export const RINGS = [
  { id: 'logo', n: 'Logo', r: 62, c: SC.design },
  { id: 'identity', n: 'Identity', r: 150, c: SC.discover },
  { id: 'brand', n: 'Brand', r: 240, c: SC.mint },
] as const;

/** The three rings around (cx, cy), drawn outside in; `lit` highlights one ring. Shared with the game. */
export function Rings({ cx, cy, scale = 1, lit, show = [1, 1, 1] }: { cx: number; cy: number; scale?: number; lit?: string; show?: number[] }) {
  return (
    <g transform={`translate(${cx} ${cy}) scale(${scale})`}>
      {[...RINGS].reverse().map((r, k) => {
        const i = RINGS.length - 1 - k, o = show[i];
        return o > 0 && (
          <g key={r.id} opacity={o}>
            <circle r={r.r} fill={SC.surface} stroke={r.c} strokeWidth={lit === r.id ? 6 : 3} opacity={lit && lit !== r.id ? 0.6 : 1} />
            <text y={-r.r + 26} textAnchor="middle" fontSize={15} fontWeight={800} fill={r.c}>{r.n}</text>
          </g>
        );
      })}
    </g>
  );
}

/** A tiny mark: the old logo, or the redesigned one. */
const Mark = ({ v }: { v: 0 | 1 }) => v === 0
  ? <g><circle r={26} fill="#f97316" /><path d="M-12 4 h24 a12 12 0 0 1 -24 0 Z" fill="#fff" /></g>
  : <g><rect x={-26} y={-26} width={52} height={52} rx={14} fill="#7c3aed" /><path d="M-12 6 h24 a12 12 0 0 1 -24 0 Z" fill="#fff" /><circle cy={-8} r={5} fill="#fff" /></g>;

const IDENTITY = [
  { a: -54, el: <g>{['#f97316', '#fdba74', '#1f2937'].map((c, i) => <rect key={c} x={-30 + i * 20} y={-10} width={18} height={20} rx={4} fill={c} />)}</g>, l: 'Colours' },
  { a: 18, el: <text y={8} textAnchor="middle" fontSize={24} fontWeight={800} fill={SC.text}>Aa</text>, l: 'Type' },
  { a: 90, el: <g><circle r={10} fill="none" stroke={SC.text} strokeWidth={2.5} /><path d="M-4 0 l3 3 6 -6" stroke={SC.text} strokeWidth={2.5} fill="none" /></g>, l: 'Icons' },
  { a: 162, el: <rect x={-18} y={-12} width={36} height={24} rx={4} fill="url(#bl-photo)" />, l: 'Photos' },
  { a: 234, el: <text y={6} textAnchor="middle" fontSize={13} fontWeight={800} fill={SC.text}>“Hi!”</text>, l: 'Voice' },
];

export function BrandLayersScene({ t }: { t: number }) {
  const fin = p(t, 29, 29.8);
  const CX = 480, CY = 280;
  const swapped = t >= 18.6 ? 1 : 0;
  const better = t >= 24.6;
  const quotes = better ? ['“Refund in 2 days!”', '“So kind on chat”', '“Finally reliable”'] : ['“Never refunds”', '“Late again”', '“Support ignores you”'];

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" role="img" aria-label="Animated story: the logo, the identity system around it, and the brand as what people think">
      <rect width={W} height={H} fill={SC.soft} />
      <Grid />
      <defs><linearGradient id="bl-photo" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#fde68a" /><stop offset="1" stopColor="#f97316" /></linearGradient></defs>
      <g opacity={1 - fin}>
        <Rings cx={CX} cy={CY} scale={0.95} show={[clamp(back(t / 0.5)), clamp((t - 6) / 0.6), clamp((t - 12) / 0.6)]} lit={t < 6 ? 'logo' : t < 12 ? 'identity' : t < 18 ? 'brand' : undefined} />
        {/* the mark */}
        <g transform={`translate(${CX} ${CY + 8}) scale(${t >= 18 && t < 19.2 ? 1 + 0.2 * Math.sin((t - 18) * 8) : 1})`}><Mark v={swapped as 0 | 1} /></g>
        {/* identity pieces */}
        {t >= 6.4 && IDENTITY.map((d, i) => {
          const a = (d.a * Math.PI) / 180, x = CX + Math.cos(a) * 100, y = CY + Math.sin(a) * 100;
          return (
            <g key={d.l} transform={`translate(${x} ${y}) scale(${clamp(back((t - 6.6 - i * 0.3) / 0.4))})`}>
              {d.el}
              <text y={28} textAnchor="middle" fontSize={10} fontWeight={700} fill={SC.muted}>{d.l}</text>
            </g>
          );
        })}
        {/* what people say */}
        {t >= 12.4 && quotes.map((q, i) => {
          const a = ((30 + i * 60) * Math.PI) / 180, x = CX + Math.cos(a) * 290, y = CY + Math.sin(a) * 190;
          return (
            <g key={q} transform={`translate(${x} ${y}) scale(${clamp(back((t - (better ? 24.8 : 12.6) - i * 0.3) / 0.4))})`}>
              <rect x={-90} y={-18} width={180} height={36} rx={18} fill={better ? SC.mint : SC.error} />
              <text y={5} textAnchor="middle" fontSize={13} fontWeight={800} fill="#fff">{q}</text>
            </g>
          );
        })}
        {t >= 19.4 && t < 24.4 && <text x={CX} y={34} textAnchor="middle" fontSize={16} fontWeight={800} fill={SC.error}>New logo. Same refunds. Same complaints.</text>}
        {t >= 25.6 && t < 29 && <text x={CX} y={34} textAnchor="middle" fontSize={16} fontWeight={800} fill={SC.mint}>Refunds fixed. What people say starts to change.</text>}
      </g>

      {fin > 0 && [{ x: 200, n: 'Logo', l: 'The mark', c: SC.design }, { x: 480, n: 'Identity', l: 'The designed system', c: SC.discover }, { x: 760, n: 'Brand', l: 'What people feel, earned', c: SC.mint }].map((f, i) => {
        const k = back((t - (29.2 + i * 0.25)) / 0.5);
        return (
          <g key={f.n} transform={`translate(${f.x} 260) scale(${clamp(k)})`}>
            <rect x={-125} y={-70} width={250} height={140} rx={18} fill={SC.surface} stroke={f.c} strokeWidth={3} />
            <text y={-8} textAnchor="middle" fontSize={22} fontWeight={800} fill={f.c}>{f.n}</text>
            <text y={26} textAnchor="middle" fontSize={13} fontWeight={600} fill={SC.text}>{f.l}</text>
          </g>
        );
      })}
    </svg>
  );
}
