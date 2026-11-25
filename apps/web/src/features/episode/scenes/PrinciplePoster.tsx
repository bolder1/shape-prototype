'use client';
// Scene for fd.4-2: Haat's principles poster ("Simple. Fast. Delightful. Customer first.") fails a real argument, when
// both sides of the substitution dispute quote "Customer first". The opposite test flips each word into something
// nobody would choose. Ritika rewrites them around real choices with a cost ("even when…"), applies them to the four
// disputes (`HAAT_DISPUTES`, `disputeState`), finds two good principles pulling substitutions opposite ways, and ranks
// them (`PRINCIPLE_RANK`). Pure function of t (0–36).
// Also exports `VERDICT_TONE` for `principle-test`.
import { DISPUTE_IDS, HAAT_DISPUTES, HAAT_PRINCIPLES, PRINCIPLE_RANK, disputeState, principleVerdict, type HaatPrinciple, type PrincipleVerdict } from '@shape/content';
import { back, clamp, Grid, p, SC } from './shared';

const W = 960, H = 540;
export const VERDICT_TONE: Record<PrincipleVerdict, string> = { platitude: SC.muted, vague: SC.grow, decides: SC.mint };
const POSTER = [{ word: 'Simple', opposite: 'Complicated' }, { word: 'Fast', opposite: 'Slow' }, { word: 'Delightful', opposite: 'Joyless' }, { word: 'Customer first', opposite: 'Customer last' }];
const GOOD = (Object.keys(HAAT_PRINCIPLES) as HaatPrinciple[]).filter(k => principleVerdict(HAAT_PRINCIPLES[k]) === 'decides');
const SHORT: Partial<Record<HaatPrinciple, string>> = {
  till: 'The first price you see is the price you pay', basket: 'The basket is the customer’s', speed: 'A weekly shop in under three minutes',
  answer: 'Search answers the search', fair: 'Buyers protected before sellers pleased',
};

function Para({ x, y, w, h, size = 15, weight = 800, children, muted }: { x: number; y: number; w: number; h: number; size?: number; weight?: number; children: React.ReactNode; muted?: boolean }) {
  return (
    <foreignObject x={x} y={y} width={w} height={h}>
      <p style={{ margin: 0, font: `${weight} ${size}px/1.35 Inter, system-ui, sans-serif`, color: muted ? 'var(--color-text-tertiary)' : 'var(--color-text-primary)' }}>{children}</p>
    </foreignObject>
  );
}

export function PrinciplePosterScene({ t }: { t: number }) {
  const intro = clamp(back(t / 0.6));
  const title = t < 6 ? 'The poster' : t < 11 ? 'Both sides quote it' : t < 16 ? 'The opposite test' : t < 21 ? 'Name the cost' : t < 26 ? 'Against the disputes' : t < 31 ? 'Two good ones collide' : 'Ranked, written down';
  // How many of the good principles are applied so far (21–26), and what that settles.
  const applied = t < 21 ? 0 : Math.min(GOOD.length, Math.floor((t - 21.2) / 0.8) + 1);
  const state = disputeState(GOOD.slice(0, applied).map(k => HAAT_PRINCIPLES[k]));
  const ranked = t >= 31;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" role="img" aria-label={`Animated story: Haat's principles poster reads Simple, Fast, Delightful, Customer first. In the argument about swapping out-of-stock items, both sides quote "Customer first". Ritika applies the opposite test: nobody would choose complicated, slow, joyless or customer last, so the words rule nothing out. She rewrites them around real choices with a cost, applies them to four disputes: ${DISPUTE_IDS.map(d => HAAT_DISPUTES[d].question).join(' ')} Two good principles pull substitutions opposite ways, so she ranks "${SHORT[PRINCIPLE_RANK[0]]}" above "${SHORT[PRINCIPLE_RANK[1]]}", and the argument closes.`}>
      <rect width={W} height={H} fill={SC.soft} />
      <Grid />
      <g opacity={intro}>
        <text x={60} y={60} fontSize={22} fontWeight={900} fill={SC.text}>{title}</text>

        {t < 16 && (
          <g transform="translate(60 96)">
            <rect width={340} height={380} rx={18} fill={SC.surface} stroke={SC.line} strokeWidth={2} opacity={p(t, 0.2, 0.7)} />
            <text x={28} y={44} fontSize={13} fontWeight={900} fill={SC.muted} opacity={p(t, 0.4, 0.9)}>HAAT · OUR PRINCIPLES</text>
            {POSTER.map((w, i) => {
              const flip = p(t, 11.6 + i * 0.7, 12.1 + i * 0.7);
              return (
                <g key={w.word} transform={`translate(28 ${96 + i * 72})`} opacity={p(t, 0.8 + i * 0.5, 1.3 + i * 0.5)}>
                  <text fontSize={30} fontWeight={900} fill={SC.text} opacity={1 - flip * 0.7}>{w.word}</text>
                  {flip > 0 && (
                    <g opacity={flip}>
                      <text x={0} y={30} fontSize={15} fontWeight={800} fill={SC.error}>Opposite: “{w.opposite}”?</text>
                      <path d="M0 -10 H260" stroke={SC.error} strokeWidth={3} opacity={0.6} />
                    </g>
                  )}
                </g>
              );
            })}
          </g>
        )}

        {t >= 6 && t < 11 && (
          <g transform="translate(440 96)">
            <rect width={460} height={62} rx={14} fill={SC.surface} stroke={SC.brand} strokeWidth={2.5} opacity={p(t, 6.2, 6.7)} />
            <Para x={18} y={18} w={430} h={40}>{HAAT_DISPUTES.substitute.question}</Para>
            {[{ who: 'Sandeep, operations', says: '“Customer first: the order arrives complete. Swap it.”' }, { who: 'Ritika, design', says: '“Customer first: it’s their basket. Ask them.”' }].map((b, i) => (
              <g key={b.who} transform={`translate(${i * 40} ${92 + i * 120})`} opacity={p(t, 7 + i * 1.2, 7.6 + i * 1.2)}>
                <rect width={420} height={100} rx={16} fill={SC.surface} stroke={SC.line} />
                <text x={18} y={28} fontSize={13} fontWeight={900} fill={SC.muted}>{b.who}</text>
                <Para x={18} y={40} w={390} h={56}>{b.says}</Para>
              </g>
            ))}
          </g>
        )}

        {t >= 11 && t < 16 && (
          <g transform="translate(440 140)" opacity={p(t, 11.2, 11.7)}>
            <rect width={460} height={200} rx={18} fill={SC.surface} stroke={SC.line} strokeWidth={2} />
            <Para x={24} y={24} w={420} h={60} size={18} weight={900}>Would a sensible team choose the opposite?</Para>
            <Para x={24} y={92} w={420} h={100} muted>If not, the principle rules nothing out. Both sides of every argument can claim it, and the meeting goes on.</Para>
          </g>
        )}

        {t >= 16 && t < 21 && (
          <g transform="translate(60 110)">
            <text fontSize={14} fontWeight={900} fill={SC.muted} opacity={p(t, 16.2, 16.6)}>Before</text>
            <text y={40} fontSize={28} fontWeight={900} fill={SC.muted} opacity={p(t, 16.3, 16.8)}>Customer first.</text>
            <text y={110} fontSize={14} fontWeight={900} fill={SC.muted} opacity={p(t, 17, 17.4)}>After</text>
            <g opacity={p(t, 17.2, 17.9)}>
              <rect y={126} width={840} height={110} rx={18} fill={SC.surface} stroke={SC.mint} strokeWidth={3} />
              <Para x={24} y={146} w={790} h={80} size={22} weight={900}>{HAAT_PRINCIPLES.till.text}</Para>
            </g>
            <g transform="translate(0 270)" opacity={p(t, 18.6, 19.1)}>
              <rect width={400} height={56} rx={14} fill={SC.surface} stroke={SC.line} />
              <Para x={18} y={16} w={370} h={36}>The choice: show the fee early.</Para>
              <rect x={440} width={400} height={56} rx={14} fill={SC.surface} stroke={SC.grow} strokeWidth={2} />
              <Para x={458} y={16} w={370} h={36}>The cost: some orders a hidden fee would win.</Para>
            </g>
          </g>
        )}

        {t >= 21 && (
          <g transform="translate(60 92)">
            {DISPUTE_IDS.map((d, i) => {
              const torn = state.torn.includes(d) && !ranked;
              const settledSide = ranked && d === 'substitute' ? HAAT_PRINCIPLES[PRINCIPLE_RANK[0]].settles.substitute
                : state.settled.includes(d) ? GOOD.slice(0, applied).map(k => HAAT_PRINCIPLES[k].settles[d]).find(Boolean) : undefined;
              const tone = torn ? SC.error : settledSide ? SC.mint : SC.line;
              return (
                <g key={d} transform={`translate(${i * 212} 0)`} opacity={p(t, 21 + i * 0.15, 21.4 + i * 0.15)}>
                  <rect width={200} height={118} rx={14} fill={SC.surface} stroke={tone} strokeWidth={tone === SC.line ? 1 : 3} />
                  <Para x={14} y={12} w={176} h={62} size={13}>{HAAT_DISPUTES[d].question}</Para>
                  <text x={14} y={102} fontSize={14} fontWeight={900} fill={torn ? SC.error : SC.text}>
                    {torn ? 'Pulled both ways' : settledSide ? `Settled: ${HAAT_DISPUTES[d][settledSide]}` : 'Open'}
                  </text>
                </g>
              );
            })}
            {GOOD.map((k, i) => {
              const on = i < applied;
              const rank = PRINCIPLE_RANK.indexOf(k);
              const hot = t >= 26 && rank >= 0;
              return (
                <g key={k} transform={`translate(0 ${148 + i * 52})`} opacity={on ? p(t, 21.2 + i * 0.8, 21.7 + i * 0.8) : 0}>
                  <rect width={840} height={42} rx={12} fill={SC.surface} stroke={hot ? SC.design : SC.line} strokeWidth={hot ? 2.5 : 1} />
                  {ranked && rank >= 0 && <text x={16} y={27} fontSize={15} fontWeight={900} fill={SC.design}>{rank + 1}.</text>}
                  <text x={ranked && rank >= 0 ? 40 : 16} y={27} fontSize={14.5} fontWeight={800} fill={SC.text}>{SHORT[k]}</text>
                  <text x={824} y={27} textAnchor="end" fontSize={13} fontWeight={800} fill={SC.muted}>
                    {Object.entries(HAAT_PRINCIPLES[k].settles).map(([d, s]) => `${HAAT_DISPUTES[d as keyof typeof HAAT_DISPUTES][s as 'a' | 'b']}`).join(', ')}
                  </text>
                </g>
              );
            })}
          </g>
        )}
      </g>
    </svg>
  );
}
