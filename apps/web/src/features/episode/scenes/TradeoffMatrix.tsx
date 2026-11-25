'use client';
// Scene for fd.4-1: Ritika reads Haat's trade-off matrices for the kind of call they are. Three weeks of arguing about
// the delivery fee end when the grid (`HAAT_DECISIONS.fee`) is weighed three ways and the basket bar wins every lens
// (`lensWinners`). "Pay later" flips with the weights, so it goes to Kabir as a priority call. The 10-minute promise
// wins every lens until its guessed safety score swings low and it fails a must-have (`withCell`, `clearsMusts`). It
// ends on the four kinds of call. Pure function of t (0–36).
// Also exports `MATRIX_TONE` for `matrix-read`.
import { HAAT_DECISIONS, clearsMusts, lensWinners, weighted, winner, withCell, type MatrixCall, type TradeDecision } from '@shape/content';
import { back, clamp, Grid, lerp, p, SC } from './shared';

const W = 960, H = 540;
export const MATRIX_TONE: Record<MatrixCall, string> = { clear: SC.mint, weights: SC.design, evidence: SC.discover, reframe: SC.grow };
const CALLS: { id: MatrixCall; label: string; body: string }[] = [
  { id: 'clear', label: 'Decide it', body: 'Same winner, every lens' },
  { id: 'weights', label: 'Settle priorities', body: 'The winner flips with the weights' },
  { id: 'evidence', label: 'Check the guess', body: 'A guessed score could flip it' },
  { id: 'reframe', label: 'Find a new option', body: 'Nothing clears the must-haves' },
];

/** A matrix at (x, y): options as rows, criteria as columns, weighted totals under lens `lens` (null: no totals yet).
 *  `shown` reveals the cells (0–1); `cell` overrides the unsure score. */
function Matrix({ d, x, y, lens, shown = 1, cell, fresh }: { d: TradeDecision; x: number; y: number; lens: number | null; shown?: number; cell?: number; fresh?: number }) {
  const m = cell === undefined ? d : withCell(d, cell);
  const weights = lens === null ? null : d.lenses[lens].weights;
  const best = weights ? winner(m, weights) : null;
  const colW = 118, labelW = 330, rowH = 50;
  return (
    <g transform={`translate(${x} ${y})`}>
      {d.criteria.map((c, j) => (
        <g key={c.label} transform={`translate(${labelW + j * colW} 0)`}>
          <foreignObject width={colW - 8} height={40}>
            <p style={{ margin: 0, font: '800 12.5px/1.2 Inter, system-ui, sans-serif', color: 'var(--color-text-primary)' }}>{c.label}{c.must ? ` · must ≥ ${c.must}` : ''}</p>
          </foreignObject>
          {weights && <text x={0} y={56} fontSize={12} fontWeight={900} fill={SC.design}>× {weights[j]}</text>}
        </g>
      ))}
      <text x={labelW + d.criteria.length * colW} y={16} fontSize={12.5} fontWeight={800} fill={SC.muted}>Total</text>
      {m.options.map((o, i) => {
        const out = !clearsMusts(m, o.scores);
        const k = clamp(shown * m.options.length - i);
        const win = best === i;
        return (
          <g key={o.label} transform={`translate(0 ${66 + i * (rowH + 8)})`} opacity={k}>
            <rect width={labelW + d.criteria.length * colW + 90} height={rowH} rx={12} fill={SC.surface}
              stroke={win ? SC.mint : fresh !== undefined && i === d.options.length - 1 ? SC.brand : SC.line} strokeWidth={win ? 3 : fresh !== undefined && i === d.options.length - 1 ? 2.5 * fresh : 1} />
            <foreignObject x={14} y={6} width={labelW - 24} height={rowH - 10}>
              <p style={{ margin: 0, font: '800 13.5px/1.25 Inter, system-ui, sans-serif', color: 'var(--color-text-primary)', display: 'flex', alignItems: 'center', height: '100%' }}>{o.label}</p>
            </foreignObject>
            {o.scores.map((s, j) => {
              const unsure = d.unsure && d.unsure.option === i && d.unsure.criterion === j;
              return (
                <g key={j} transform={`translate(${labelW + j * colW} ${rowH / 2})`}>
                  {unsure && <rect x={-8} y={-17} width={46} height={34} rx={8} fill="none" stroke={SC.discover} strokeWidth={2} strokeDasharray="5 4" />}
                  <text x={0} y={7} fontSize={20} fontWeight={900} fill={SC.text}>{s}{unsure ? '?' : ''}</text>
                </g>
              );
            })}
            <text x={labelW + d.criteria.length * colW} y={rowH / 2 + 7} fontSize={20} fontWeight={900} fill={out ? SC.error : win ? SC.text : SC.muted}>
              {out ? 'Out' : weights ? weighted(o.scores, weights) : '·'}
            </text>
            {out && <path d={`M10 ${rowH / 2} H${labelW + d.criteria.length * colW - 20}`} stroke={SC.error} strokeWidth={2.5} opacity={0.7} />}
          </g>
        );
      })}
    </g>
  );
}

function Lenses({ d, x, y, on }: { d: TradeDecision; x: number; y: number; on: number | null }) {
  const ws = lensWinners(d);
  return (
    <g transform={`translate(${x} ${y})`}>
      {d.lenses.map((l, i) => (
        <g key={l.who} transform={`translate(${i * 230} 0)`}>
          <rect width={216} height={44} rx={22} fill={on === i ? SC.soft : SC.surface} stroke={on === i ? SC.design : SC.line} strokeWidth={on === i ? 3 : 1} />
          <text x={18} y={20} fontSize={13} fontWeight={900} fill={SC.text}>{l.who}</text>
          <text x={18} y={36} fontSize={11.5} fontWeight={700} fill={SC.muted}>{on !== null && i <= on ? `Picks: ${d.options[ws[i] ?? 0].label.slice(0, 22)}${d.options[ws[i] ?? 0].label.length > 22 ? '…' : ''}` : 'Weighs it their way'}</text>
        </g>
      ))}
    </g>
  );
}

export function TradeoffMatrixScene({ t }: { t: number }) {
  const intro = clamp(back(t / 0.6));
  const title = t < 6 ? 'Three weeks, one fee' : t < 11 ? 'Rows and columns' : t < 16 ? 'Everyone’s weights' : t < 21 ? 'Pay later' : t < 26 ? 'Not a scoring problem' : t < 31 ? 'One guess' : 'What kind of call';
  const fee = HAAT_DECISIONS.fee, pay = HAAT_DECISIONS.paylater, ten = HAAT_DECISIONS.tenmin;
  const feeLens = t < 11.6 ? null : Math.min(fee.lenses.length - 1, Math.floor((t - 11.6) / 1.2));
  const payLens = t < 17 ? null : t < 19 ? 0 : 1;
  const tenCell = t < 27.5 ? undefined : Math.round(lerp(3, ten.unsure!.low, p(t, 27.5, 29)));
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" role="img" aria-label={`Animated story: Haat's team argues for three weeks about where to show the delivery fee. Ritika, the principal designer, draws a trade-off matrix and weighs it as growth, trust and engineering would; the basket bar wins every time, so they decide. "Pay later" picks a different winner for growth and for trust, so it goes to Kabir as a priority call. A 10-minute delivery promise wins every lens until its guessed rider-safety score swings low and it fails a must-have, so they check it first. Four kinds of call: decide it, settle priorities, check the guess, find a new option.`}>
      <rect width={W} height={H} fill={SC.soft} />
      <Grid />
      <g opacity={intro}>
        <text x={60} y={60} fontSize={22} fontWeight={900} fill={SC.text}>{title}</text>

        {t < 6 && (
          <g transform="translate(60 100)">
            {[0, 1, 2].map(w => (
              <g key={w} transform={`translate(${w * 120} 0)`} opacity={p(t, 0.3 + w * 0.5, 0.8 + w * 0.5)}>
                <rect width={104} height={40} rx={10} fill={SC.surface} stroke={SC.line} />
                <text x={52} y={26} textAnchor="middle" fontSize={14} fontWeight={900} fill={SC.text}>Week {w + 1}</text>
              </g>
            ))}
            {[{ who: 'Ishaan, growth', says: '“Cart page only. A fee on every card kills orders.”', x: 0 }, { who: 'Pooja, trust', says: '“Every product card. Surprises at checkout lose trust.”', x: 420 }].map((b, i) => (
              <g key={b.who} transform={`translate(${b.x} ${110 + i * 40})`} opacity={p(t, 2 + i * 1.2, 2.6 + i * 1.2)}>
                <rect width={400} height={96} rx={16} fill={SC.surface} stroke={i ? SC.grow : SC.design} strokeWidth={2} />
                <text x={20} y={30} fontSize={13} fontWeight={900} fill={SC.muted}>{b.who}</text>
                <foreignObject x={20} y={40} width={360} height={50}>
                  <p style={{ margin: 0, font: '800 15px/1.3 Inter, system-ui, sans-serif', color: 'var(--color-text-primary)' }}>{b.says}</p>
                </foreignObject>
              </g>
            ))}
            <text x={0} y={330} fontSize={15} fontWeight={800} fill={SC.muted} opacity={p(t, 4.4, 4.9)}>₹25 delivery on orders under ₹199. Same meeting, every Tuesday.</text>
          </g>
        )}

        {t >= 6 && t < 16 && (
          <g>
            <Matrix d={fee} x={60} y={90} lens={feeLens} shown={p(t, 6.3, 8.6)} fresh={p(t, 9, 9.6)} />
            {t >= 11 && <Lenses d={fee} x={60} y={340} on={feeLens} />}
            {t >= 9 && t < 11 && <text x={60} y={360} fontSize={15} fontWeight={800} fill={SC.text} opacity={p(t, 9.2, 9.7)}>A third option nobody had written down: the fee in the basket bar, from the first item.</text>}
            {t >= 14.6 && <text x={60} y={420} fontSize={17} fontWeight={900} fill={SC.text} opacity={p(t, 14.6, 15.1)}>Same winner for all three. Decided in twenty minutes.</text>}
          </g>
        )}

        {t >= 16 && t < 26 && (
          <g>
            <Matrix d={pay} x={60} y={90} lens={t < 21 ? payLens : 1} shown={p(t, 16.2, 17)} />
            <Lenses d={pay} x={60} y={340} on={t < 21 ? payLens : 1} />
            {t >= 21 && (
              <g transform="translate(60 410)" opacity={p(t, 21.3, 21.9)}>
                <rect width={840} height={84} rx={16} fill={SC.surface} stroke={SC.design} strokeWidth={2.5} />
                <foreignObject x={20} y={12} width={800} height={64}>
                  <p style={{ margin: 0, font: '800 15px/1.35 Inter, system-ui, sans-serif', color: 'var(--color-text-primary)' }}>The winner flips with the weights. Better scores won’t settle that: it’s about priorities. Ritika takes the grid to Kabir, head of product, with what each answer gives up.</p>
                </foreignObject>
              </g>
            )}
          </g>
        )}

        {t >= 26 && t < 31 && (
          <g>
            <Matrix d={ten} x={60} y={90} lens={1} cell={tenCell} shown={p(t, 26.2, 26.8)} />
            <g transform="translate(60 284)" opacity={p(t, 26.6, 27.1)}>
              <foreignObject width={840} height={60}>
                <p style={{ margin: 0, font: '800 14px/1.35 Inter, system-ui, sans-serif', color: 'var(--color-text-tertiary)' }}>{ten.unsure!.why}.</p>
              </foreignObject>
            </g>
            {t >= 29 && <text x={60} y={370} fontSize={17} fontWeight={900} fill={SC.text} opacity={p(t, 29.2, 29.7)}>At 1, the promise fails a must-have. Time real routes before promising anything.</text>}
          </g>
        )}

        {t >= 31 && (
          <g transform="translate(60 110)">
            {CALLS.map((c, i) => (
              <g key={c.id} transform={`translate(${(i % 2) * 430} ${Math.floor(i / 2) * 150})`} opacity={p(t, 31.2 + i * 0.5, 31.7 + i * 0.5)}>
                <rect width={410} height={130} rx={18} fill={SC.surface} stroke={MATRIX_TONE[c.id]} strokeWidth={3} />
                <circle cx={36} cy={40} r={10} fill={MATRIX_TONE[c.id]} />
                <text x={58} y={46} fontSize={20} fontWeight={900} fill={SC.text}>{c.label}</text>
                <text x={26} y={90} fontSize={15} fontWeight={800} fill={SC.muted}>{c.body}</text>
              </g>
            ))}
          </g>
        )}
      </g>
    </svg>
  );
}
