'use client';
// Scene for ax.1-1: the persona spectrum. A 3 × 3 grid (touch, see, hear × permanent, temporary, situational) fills in:
// first one arm, a broken arm and a parent holding a baby, then the other senses; finally a one-handed mode spreads
// across the whole touch row. Pure function of t (0–34).
import { BabyIcon, BandaidsIcon, EarIcon, EarSlashIcon, EyeIcon, EyeSlashIcon, HandPalmIcon, SunIcon, TrainIcon } from '@phosphor-icons/react/ssr';
import { back, clamp, Grid, p, SC } from './shared';

const W = 960, H = 540;
export const SENSES = [
  { id: 'touch', n: 'Touch', icon: HandPalmIcon },
  { id: 'see', n: 'See', icon: EyeIcon },
  { id: 'hear', n: 'Hear', icon: EarIcon },
] as const;
export const KINDS = [
  { id: 'perm', n: 'Permanent', c: SC.discover },
  { id: 'temp', n: 'Temporary', c: SC.design },
  { id: 'sit', n: 'Situational', c: SC.grow },
] as const;
const CELLS = [
  [{ l: 'One arm', i: HandPalmIcon, at: 0.4 }, { l: 'Broken arm', i: BandaidsIcon, at: 5.4 }, { l: 'Holding a baby', i: BabyIcon, at: 10.4 }],
  [{ l: 'Blind', i: EyeSlashIcon, at: 21.2 }, { l: 'Cataract', i: EyeIcon, at: 21.8 }, { l: 'Bright sun', i: SunIcon, at: 22.4 }],
  [{ l: 'Deaf', i: EarSlashIcon, at: 23 }, { l: 'Ear infection', i: EarIcon, at: 23.6 }, { l: 'Loud train', i: TrainIcon, at: 24.2 }],
];

export function SpectrumScene({ t }: { t: number }) {
  const fin = p(t, 29, 29.8);
  const heads = t >= 15 ? clamp((t - 15) / 0.5) : 0;
  const spread = p(t, 27.2, 28.4);
  const X0 = 250, Y0 = 130, CW = 210, CH = 110;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" role="img" aria-label="Animated story: the persona spectrum of permanent, temporary and situational disabilities">
      <rect width={W} height={H} fill={SC.soft} />
      <Grid />
      <g opacity={1 - fin}>
        {/* column heads */}
        {KINDS.map((k, j) => (
          <g key={k.id} opacity={heads} transform={`translate(${X0 + j * CW + CW / 2} ${Y0 - 30})`}>
            <rect x={-80} y={-18} width={160} height={36} rx={18} fill={k.c} />
            <text y={6} textAnchor="middle" fontSize={15} fontWeight={800} fill="#fff">{k.n}</text>
          </g>
        ))}
        {/* row heads */}
        {SENSES.map((s, r) => {
          const Icon = s.icon;
          return (
            <g key={s.id} opacity={r === 0 ? clamp(t / 0.5) : clamp((t - 20.8) / 0.5)} transform={`translate(${X0 - 110} ${Y0 + r * CH + CH / 2})`}>
              <Icon x={-14} y={-30} width={28} height={28} color={SC.muted} weight="duotone" />
              <text y={18} textAnchor="middle" fontSize={15} fontWeight={800} fill={SC.muted}>{s.n}</text>
            </g>
          );
        })}
        {/* cells */}
        {CELLS.map((row, r) => row.map((c, j) => {
          const Icon = c.i, k = clamp(back((t - c.at) / 0.5));
          const lit = r === 0 && spread > 0 ? 1 : 0;
          return k > 0 && (
            <g key={c.l} transform={`translate(${X0 + j * CW + CW / 2} ${Y0 + r * CH + CH / 2}) scale(${k})`}>
              <rect x={-95} y={-46} width={190} height={92} rx={16} fill={SC.surface} stroke={lit && spread > j * 0.33 ? SC.mint : KINDS[j].c} strokeWidth={lit && spread > j * 0.33 ? 4 : 2} />
              <Icon x={-16} y={-34} width={32} height={32} color={KINDS[j].c} weight="duotone" />
              <text y={24} textAnchor="middle" fontSize={16} fontWeight={800} fill={SC.text}>{c.l}</text>
            </g>
          );
        }))}
        {t >= 15.6 && t < 21 && <text x={480} y={470} textAnchor="middle" fontSize={17} fontWeight={800} fill={SC.mint} opacity={clamp((t - 15.6) / 0.4)}>Same need: using a phone with one hand.</text>}
        {t >= 27 && (
          <g opacity={clamp((t - 27) / 0.4)}>
            <rect x={X0 - 10} y={Y0 + CH - 2} width={CW * 3 * spread + 20} height={6} rx={3} fill={SC.mint} />
            <text x={480} y={470} textAnchor="middle" fontSize={17} fontWeight={800} fill={SC.mint}>One-handed mode: built for one arm, used by all three.</text>
          </g>
        )}
      </g>

      {fin > 0 && [{ x: 200, n: 'A spectrum', l: 'Permanent · temporary · situational', c: SC.discover }, { x: 480, n: 'Solve for one', l: 'Extend to many', c: SC.design }, { x: 760, n: 'Everyone, sometimes', l: 'Glare, noise, full hands', c: SC.mint }].map((f, i) => {
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
