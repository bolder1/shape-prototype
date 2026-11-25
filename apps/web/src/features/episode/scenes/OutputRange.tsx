'use client';
// Scene for pr.4-3: the pitch deck's perfect “biryani for 6” cart, then the real range of outputs Ask Thela gives, the
// three ways to supply outputs in a test (`OUTPUT_METHODS`: a wizard behind the curtain, recorded real outputs, the
// live model), real content instead of lorem ipsum (`CONTENT_RANGE`), and Lakshmi fixing the tested mistake in one
// tap. Pure function of t (0–36). Also exports `METHOD_FILL` and `METHOD_LABEL`, which `output-plan` uses.
import { CONTENT_RANGE, type OutputMethod } from '@shape/content';
import { back, clamp, Grid, p, SC } from './shared';

const W = 640, H = 360;
/** One fill per output method; white text on each passes 4.5:1. */
export const METHOD_FILL: Record<OutputMethod, string> = { wizard: '#6941C6', recorded: '#B54708', live: '#067647' };
export const METHOD_LABEL: Record<OutputMethod, string> = { wizard: 'Wizard of Oz', recorded: 'Recorded', live: 'Live model' };

/** A small phone with a title and one line under it. */
function Phone({ x, y, w = 190, title, line, stroke, o = 1 }: { x: number; y: number; w?: number; title: string; line: string; stroke?: string; o?: number }) {
  return (
    <g opacity={o}>
      <rect x={x} y={y} width={w} height={150} rx={18} fill={SC.surface} stroke={stroke ?? SC.line} strokeWidth={stroke ? 3 : 2} />
      <rect x={x + w / 2 - 18} y={y + 10} width={36} height={6} rx={3} fill={SC.line} />
      <text x={x + 14} y={y + 60} fontSize={21} fontWeight={900} fill={SC.text}>{title}</text>
      <text x={x + 14} y={y + 100} fontSize={21} fontWeight={700} fill={SC.muted}>{line}</text>
    </g>
  );
}

export function OutputRangeScene({ t }: { t: number }) {
  const intro = clamp(back(t / 0.6));
  const title = t < 6 ? 'The demo cart' : t < 11 ? 'The real range' : t < 16 ? 'No model yet: a wizard' : t < 21 ? 'Same for all: recorded' : t < 26 ? 'Their own ask: live' : t < 31 ? 'Real content, not lorem' : 'Designed for the miss';

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" role="img" aria-label="Animated story: in the pitch deck, biryani for 6 becomes a perfect 14-item cart. Real outputs range wider: right, chicken in a veg biryani, a 9-second wait, 23 items, or a question back. Before a model exists, a researcher plays it behind the curtain, Wizard of Oz. When every participant must meet the same output, real outputs are generated beforehand and chosen. When the question is about people's own requests, the live model answers each one. Prototypes are stocked with real content: the shortest and longest names, Telugu labels, prices from ₹9 to ₹4,999 and an empty search. Lakshmi spots the chicken and removes it in one tap, because the mistake was designed for and tested.">
      <rect width={W} height={H} fill={SC.soft} />
      <Grid w={W} h={H} />
      <g opacity={intro}>
        <text x={32} y={44} fontSize={26} fontWeight={900} fill={SC.text}>{title}</text>

        {t < 6 && (
          <g>
            <g opacity={p(t, 0.3, 0.9)}>
              <rect x={32} y={70} width={320} height={56} rx={28} fill={SC.surface} stroke={SC.line} strokeWidth={2} />
              <text x={56} y={106} fontSize={22} fontWeight={800} fill={SC.text}>“Biryani for 6”</text>
            </g>
            <g opacity={p(t, 1.4, 2)}>
              <rect x={32} y={146} width={576} height={110} rx={16} fill={SC.surface} stroke="#067647" strokeWidth={3} />
              <text x={56} y={186} fontSize={22} fontWeight={900} fill={SC.text}>14 items · ₹1,180 · ready in 2 s</text>
              <text x={56} y={226} fontSize={21} fontWeight={700} fill={SC.muted}>Basmati, onions, curd, mint, whole spices…</text>
            </g>
            <text x={32} y={310} fontSize={22} fontWeight={900} fill={SC.text} opacity={p(t, 3, 3.6)}>The best answer the model ever gave</text>
          </g>
        )}

        {t >= 6 && t < 11 && (
          <g>
            {[
              { s: 'Right: 14 items', c: '#067647' },
              { s: 'Chicken in a veg biryani', c: SC.error },
              { s: '9 seconds of “Building…”', c: METHOD_FILL.recorded },
              { s: '23 items, for Diwali sweets', c: METHOD_FILL.recorded },
              { s: '“Basmati or sona masoori?”', c: METHOD_FILL.wizard },
            ].map((r, i) => (
              <g key={r.s} opacity={p(t, 6.2 + i * 0.5, 6.7 + i * 0.5)}>
                <rect x={32} y={64 + i * 56} width={576} height={46} rx={10} fill={SC.surface} stroke={r.c} strokeWidth={3} />
                <text x={52} y={95 + i * 56} fontSize={21} fontWeight={800} fill={SC.text}>{r.s}</text>
              </g>
            ))}
          </g>
        )}

        {t >= 11 && t < 16 && (
          <g>
            <Phone x={32} y={80} title="Pesarattu, 4" line="4 items" o={p(t, 11.2, 11.8)} />
            <g opacity={p(t, 12, 12.6)}>
              <rect x={240} y={70} width={16} height={180} rx={4} fill={METHOD_FILL.wizard} />
              <text x={248} y={290} fontSize={21} fontWeight={800} fill={SC.muted} textAnchor="middle">curtain</text>
            </g>
            <g opacity={p(t, 12.8, 13.4)}>
              <rect x={284} y={80} width={324} height={150} rx={14} fill={SC.surface} stroke={METHOD_FILL.wizard} strokeWidth={3} />
              <text x={304} y={120} fontSize={21} fontWeight={700} fill={SC.muted}>Sana, typing</text>
              <text x={304} y={160} fontSize={21} fontWeight={800} fill={SC.text}>moong dal, rice, ginger,</text>
              <text x={304} y={192} fontSize={21} fontWeight={800} fill={SC.text}>chillies{t % 1 > 0.5 ? '|' : ''}</text>
            </g>
            <text x={32} y={330} fontSize={21} fontWeight={800} fill={SC.text} opacity={p(t, 14, 14.6)}>Do people want this? Answered before any model.</text>
          </g>
        )}

        {t >= 16 && t < 21 && (
          <g>
            {[0, 1, 2].map(i => (
              <Phone key={i} x={32 + i * 200} y={76} title="Veg biryani" line="+ chicken" stroke={METHOD_FILL.recorded} o={p(t, 16.3 + i * 0.4, 16.8 + i * 0.4)} />
            ))}
            <text x={32} y={276} fontSize={21} fontWeight={800} fill={SC.text} opacity={p(t, 17.8, 18.4)}>Chosen from 200 real outputs, never edited</text>
            <text x={32} y={316} fontSize={21} fontWeight={700} fill={SC.muted} opacity={p(t, 18.6, 19.2)}>Every participant, the same step</text>
          </g>
        )}

        {t >= 21 && t < 26 && (
          <g>
            {[
              { title: 'Less oil, 4', line: '11 items' },
              { title: 'Ragi malt', line: '4 items' },
              { title: 'Fish fry', line: '1 fix' },
            ].map((ph, i) => (
              <Phone key={ph.title} x={32 + i * 200} y={76} title={ph.title} line={ph.line} stroke={METHOD_FILL.live} o={p(t, 21.3 + i * 0.4, 21.8 + i * 0.4)} />
            ))}
            <text x={32} y={276} fontSize={21} fontWeight={800} fill={SC.text} opacity={p(t, 22.8, 23.4)}>Each person’s own request, the real model</text>
            <text x={32} y={316} fontSize={21} fontWeight={700} fill={SC.muted} opacity={p(t, 23.6, 24.2)}>Log every output; expect surprises</text>
          </g>
        )}

        {t >= 26 && t < 31 && (
          <g>
            {CONTENT_RANGE.map((c, i) => (
              <g key={c.case} opacity={p(t, 26.2 + i * 0.5, 26.7 + i * 0.5)}>
                <text x={32} y={92 + i * 54} fontSize={21} fontWeight={700} fill={SC.muted}>{c.case}</text>
                <text x={190} y={92 + i * 54} fontSize={21} fontWeight={800} fill={SC.text}>{c.sample.length > 34 ? `${c.sample.slice(0, 33)}…` : c.sample}</text>
              </g>
            ))}
          </g>
        )}

        {t >= 31 && (() => {
          const gone = t > 33;
          return (
            <g>
              <g opacity={p(t, 31.2, 31.8)}>
                <rect x={32} y={66} width={576} height={170} rx={16} fill={SC.surface} stroke={SC.line} strokeWidth={2} />
                <text x={52} y={104} fontSize={22} fontWeight={900} fill={SC.text}>Veg biryani for 6</text>
                <text x={52} y={142} fontSize={21} fontWeight={700} fill={SC.muted}>Basmati 1.5 kg · curd · mint</text>
                <g opacity={gone ? 1 - p(t, 33, 33.6) : 1}>
                  <rect x={44} y={160} width={552} height={56} rx={10} fill="none" stroke={SC.error} strokeWidth={3} />
                  <text x={64} y={196} fontSize={21} fontWeight={800} fill={SC.text}>Chicken 1 kg · doesn’t fit “veg”</text>
                  <rect x={476} y={170} width={108} height={36} rx={18} fill="#B42318" />
                  <text x={530} y={195} fontSize={21} fontWeight={900} fill="#fff" textAnchor="middle">Remove</text>
                </g>
              </g>
              <text x={32} y={290} fontSize={22} fontWeight={900} fill={SC.text} opacity={p(t, 33.8, 34.4)}>One tap, because the miss was tested</text>
            </g>
          );
        })()}
      </g>
    </svg>
  );
}
