'use client';
// Scene for br.1-3: a messy dump of pins; Sukoon's traits (calm, warm, expert) appear; off-brand pieces fall away; the
// keepers fly into three trait columns with a note under each. Pure function of t (0–34).
import { back, clamp, Grid, lerp, p, SC } from './shared';

const W = 960, H = 540;

/** A moodboard tile, drawn in a 120 × 90 box. Shared with the Curate the board game. */
export function MoodTile({ visual }: { visual?: string }) {
  switch (visual) {
    case 'palette-warm': return <g>{['#e9d5b7', '#f4b9a1', '#b7c4a8', '#fdf6ec'].map((c, i) => <rect key={c} x={i * 30} width={30} height={90} fill={c} />)}</g>;
    case 'palette-neon': return <g>{['#ff2bd6', '#39ff14', '#00e5ff', '#ffef00'].map((c, i) => <rect key={c} x={i * 30} width={30} height={90} fill={c} />)}</g>;
    case 'type-serif': return <g><rect width={120} height={90} fill="#fdf6ec" /><text x={60} y={58} textAnchor="middle" fontSize={36} fontFamily="Georgia, serif" fill="#5b4636">Aa</text></g>;
    case 'type-grunge': return <g><rect width={120} height={90} fill="#111" /><text x={60} y={60} textAnchor="middle" fontSize={34} fontWeight={900} fontFamily="Impact, sans-serif" fill="#eee" transform="rotate(-6 60 50)" letterSpacing={-2}>RAW</text><path d="M10 20 L50 70 M70 10 L110 80" stroke="#eee" strokeWidth={2} opacity={0.4} /></g>;
    case 'photo-sunrise': return <g><defs><linearGradient id="mt-sun" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#fbcfb0" /><stop offset="1" stopColor="#fde9c9" /></linearGradient></defs><rect width={120} height={90} fill="url(#mt-sun)" /><circle cx={60} cy={58} r={16} fill="#fbbf86" /><path d="M0 70 Q30 52 60 66 T120 62 V90 H0 Z" fill="#c9b8a0" /><path d="M0 78 Q40 66 80 76 T120 74 V90 H0 Z" fill="#a8a08a" /></g>;
    case 'photo-crowd': return <g><rect width={120} height={90} fill="#4b5563" />{Array.from({ length: 18 }, (_, i) => <circle key={i} cx={8 + (i % 6) * 21} cy={30 + Math.floor(i / 6) * 22} r={9} fill={['#f87171', '#fbbf24', '#60a5fa', '#e5e7eb'][i % 4]} />)}</g>;
    case 'texture-paper': return <g><rect width={120} height={90} fill="#f3eadb" />{Array.from({ length: 14 }, (_, i) => <path key={i} d={`M${(i * 37) % 120} ${(i * 23) % 90} l${6 + (i % 5)} ${2 + (i % 3)}`} stroke="#d6c7ad" strokeWidth={1.5} />)}</g>;
    case 'texture-glitch': return <g><rect width={120} height={90} fill="#0b0b0f" />{Array.from({ length: 10 }, (_, i) => <rect key={i} x={(i * 29) % 100} y={i * 9} width={20 + ((i * 17) % 60)} height={5} fill={['#ff2bd6', '#00e5ff', '#39ff14'][i % 3]} />)}</g>;
    case 'icon-line': return <g><rect width={120} height={90} fill="#fdf6ec" /><circle cx={34} cy={45} r={14} fill="none" stroke="#7c6a58" strokeWidth={2} /><path d="M62 52 q10 -20 20 0" fill="none" stroke="#7c6a58" strokeWidth={2} strokeLinecap="round" /><path d="M92 36 v18 M83 45 h18" stroke="#7c6a58" strokeWidth={2} strokeLinecap="round" /></g>;
    case 'icon-3d': return <g><rect width={120} height={90} fill="#e0e7ff" />{[30, 60, 90].map((x, i) => <g key={x}><circle cx={x} cy={46} r={15} fill={['#facc15', '#f472b6', '#38bdf8'][i]} /><circle cx={x - 5} cy={40} r={5} fill="#fff" opacity={0.7} /></g>)}</g>;
    default: return null;
  }
}

/** The pins in the dump: visual, whether it stays, its column (trait) and note. */
const PINS = [
  { v: 'palette-warm', keep: true, col: 1, note: 'warm light' },
  { v: 'texture-glitch', keep: false },
  { v: 'photo-sunrise', keep: true, col: 0, note: 'quiet mornings' },
  { v: 'palette-neon', keep: false },
  { v: 'type-serif', keep: true, col: 2, note: 'considered type' },
  { v: 'photo-crowd', keep: false },
  { v: 'texture-paper', keep: true, col: 1, note: 'touchable' },
  { v: 'icon-3d', keep: false },
  { v: 'icon-line', keep: true, col: 2, note: 'precise, gentle' },
  { v: 'type-grunge', keep: false },
];
const COLS = [{ n: 'Calm', c: SC.discover }, { n: 'Warm', c: SC.design }, { n: 'Expert', c: SC.mint }];

export function MoodboardScene({ t }: { t: number }) {
  const fin = p(t, 29, 29.8);
  const fall = p(t, 12.4, 13.6);
  const sort = p(t, 18.2, 19.6);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" role="img" aria-label="Animated story: turning a messy moodboard into a curated one grouped by brand traits">
      <rect width={W} height={H} fill={SC.soft} />
      <Grid />
      <g opacity={1 - fin}>
        {t >= 6 && COLS.map((c, i) => (
          <g key={c.n} transform={`translate(${220 + i * 260} 80) scale(${clamp(back((t - 6.2 - i * 0.3) / 0.5))})`}>
            <rect x={-70} y={-20} width={140} height={40} rx={20} fill={c.c} />
            <text y={6} textAnchor="middle" fontSize={17} fontWeight={800} fill="#fff">{c.n}</text>
          </g>
        ))}
        {PINS.map((pin, i) => {
          const x0 = 90 + (i % 5) * 170, y0 = 170 + Math.floor(i / 5) * 150, rot = ((i * 37) % 21) - 10;
          const colIndex = PINS.slice(0, i).filter(q => q.keep && q.col === pin.col).length;
          const x1 = 160 + (pin.col ?? 0) * 260, y1 = 140 + colIndex * 150;
          const x = pin.keep ? lerp(x0, x1, sort) : x0, y = pin.keep ? lerp(y0, y1, sort) : y0 + fall * 420;
          const o = pin.keep ? 1 : 1 - fall;
          return o > 0 && (
            <g key={pin.v} transform={`translate(${x} ${y}) rotate(${lerp(rot, 0, pin.keep ? sort : 0)}) scale(${clamp(back((t - 0.2 - i * 0.1) / 0.4))})`} opacity={o}>
              <rect x={-4} y={-4} width={128} height={98} rx={8} fill={SC.surface} stroke={!pin.keep && t >= 11 ? SC.error : SC.line} strokeWidth={!pin.keep && t >= 11 ? 3 : 1.5} />
              <g clipPath="url(#mb-clip)"><MoodTile visual={pin.v} /></g>
              {pin.keep && sort > 0.9 && <text x={60} y={112} textAnchor="middle" fontSize={12} fontWeight={700} fill={SC.muted}>{pin.note}</text>}
            </g>
          );
        })}
        <defs><clipPath id="mb-clip"><rect width={120} height={90} rx={6} /></clipPath></defs>
        {t >= 2 && t < 6 && <text x={480} y={500} textAnchor="middle" fontSize={16} fontWeight={800} fill={SC.error}>Pretty. But what is the brand?</text>}
        {t >= 11 && t < 13 && <text x={480} y={500} textAnchor="middle" fontSize={16} fontWeight={800} fill={SC.error}>Striking, but they fight calm and warm.</text>}
        {t >= 20 && t < 29 && <text x={480} y={500} textAnchor="middle" fontSize={16} fontWeight={800} fill={SC.mint}>Every piece has a trait and a reason.</text>}
      </g>

      {fin > 0 && [{ x: 200, n: 'Start from traits', l: 'Each piece expresses one', c: SC.discover }, { x: 480, n: 'Cut what fights', l: 'Fit beats beauty', c: SC.design }, { x: 760, n: 'Annotate', l: 'A reason under every piece', c: SC.mint }].map((f, i) => {
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
