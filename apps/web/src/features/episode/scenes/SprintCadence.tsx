'use client';
// Scene for ld.1-1: Nisha at Rasoi learns to design inside the sprint. Three weeks alone produce 22 screens and a
// handoff; day 1 of the build brings questions that cross out half of them. Then two tracks (`TRACKS`): discovery a
// sprint ahead, delivery inside it. A ten-day sprint calendar lights up stand-up (Rohan's cut-off blocker,
// `RASOI_ITEMS`), refinement on day 6 (`CEREMONY_DAY`), then the review and retro on day 10. The end compares the days
// blockers wait at stand-up with holding them for the retro (`blockedDays`). Pure function of t (0–36).
// Also exports `CEREMONY_TONE` and `CEREMONY_SHORT` for `ceremony-route`.
import { CEREMONY_DAY, RASOI_ITEMS, SPRINT_DAYS, TRACKS, blockedDays, type Ceremony } from '@shape/content';
import { back, clamp, Grid, lerp, p, SC } from './shared';

const W = 960, H = 540;
export const CEREMONY_TONE: Record<Ceremony, string> = { standup: SC.build, refinement: SC.discover, review: SC.design, retro: SC.grow };
export const CEREMONY_SHORT: Record<Ceremony, string> = { standup: 'Stand-up', refinement: 'Refinement', review: 'Review', retro: 'Retro' };
const ITEMS = Object.values(RASOI_ITEMS);
const AT_STANDUP = blockedDays(ITEMS);
const AT_RETRO = blockedDays(ITEMS, () => 'retro');
const QUESTIONS = ['After the 9 pm cut-off?', 'Refund mid-week?', 'Small phones?'];

/** One day cell of the sprint calendar, with the meetings that happen on it. */
function Day({ d, x, y, lit, hot }: { d: number; x: number; y: number; lit: Ceremony | null; hot?: string }) {
  const meets: Ceremony[] = ['standup', ...(Object.keys(CEREMONY_DAY) as Exclude<Ceremony, 'standup'>[]).filter(c => CEREMONY_DAY[c] === d)];
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect width={150} height={104} rx={12} fill={SC.surface} stroke={lit && meets.includes(lit) ? CEREMONY_TONE[lit] : SC.line} strokeWidth={lit && meets.includes(lit) ? 3 : 1} />
      <text x={12} y={24} fontSize={13} fontWeight={800} fill={SC.muted}>Day {d}</text>
      {meets.map((m, i) => (
        <g key={m} transform={`translate(12 ${38 + i * 20})`} opacity={!lit || lit === m ? 1 : 0.35}>
          <rect width={8} height={14} rx={3} fill={CEREMONY_TONE[m]} />
          <text x={14} y={12} fontSize={12} fontWeight={700} fill={SC.text}>{CEREMONY_SHORT[m]}</text>
        </g>
      ))}
      {hot && (
        <g transform="translate(12 82)">
          <rect width={126} height={16} rx={5} fill={SC.soft} stroke={SC.brand} />
          <text x={6} y={12} fontSize={10.5} fontWeight={800} fill={SC.text}>{hot}</text>
        </g>
      )}
    </g>
  );
}

export function SprintCadenceScene({ t }: { t: number }) {
  const intro = clamp(back(t / 0.6));
  const title = t < 6 ? 'Three weeks, then a handoff' : t < 11 ? 'The surprises' : t < 16 ? 'Two tracks' : t < 21 ? 'Stand-up' : t < 26 ? 'Refinement' : t < 31 ? 'Review, then retro' : 'Thin slices, early answers';
  const lit: Ceremony | null = t < 16 ? null : t < 21 ? 'standup' : t < 26 ? 'refinement' : t < 28.5 ? 'review' : 'retro';
  const hotDay = t < 21 ? 3 : t < 26 ? 6 : 10;
  const hotText = t < 21 ? 'Rohan: the 9 pm cut-off' : t < 26 ? 'Swap flow, sized' : t < 28.5 ? 'Pause, live on staging' : 'Designs to refinement first';
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" role="img" aria-label={`Animated story: Nisha, Rasoi's designer, spends three weeks alone on 22 screens for Pause my meals, and on day 1 of the build the developers' questions cross out half of them. Next time she works in two tracks: ${TRACKS.map(tr => `${tr.label}, ${tr.does}`).join('; ')}. On a ten-day sprint calendar, Rohan's blocker is raised at the next stand-up, the swap flow is sized at refinement on day ${CEREMONY_DAY.refinement}, and on day ${CEREMONY_DAY.review} pausing is shown working at the review before the retro. Raised at stand-up, blockers wait ${AT_STANDUP} days in all; held for the retro, they would wait ${AT_RETRO}.`}>
      <rect width={W} height={H} fill={SC.soft} />
      <Grid />
      <g opacity={intro}>
        <text x={60} y={60} fontSize={22} fontWeight={900} fill={SC.text}>{title}</text>

        {t < 11 && (
          <g>
            {['Week 1', 'Week 2', 'Week 3'].map((w, i) => (
              <g key={w} transform={`translate(${80 + i * 170} 110)`} opacity={p(t, 0.3 + i * 0.6, 0.8 + i * 0.6)}>
                <rect width={150} height={30} rx={8} fill={SC.surface} stroke={SC.line} />
                <text x={14} y={20} fontSize={13} fontWeight={800} fill={SC.muted}>{w} · Nisha alone</text>
              </g>
            ))}
            {Array.from({ length: 22 }, (_, i) => {
              const crossed = i % 2 === 0;
              const x = 80 + (i % 11) * 46, y = 170 + Math.floor(i / 11) * 90;
              return (
                <g key={i} transform={`translate(${x} ${y})`} opacity={p(t, 0.6 + i * 0.12, 1 + i * 0.12)}>
                  <rect width={38} height={72} rx={7} fill={SC.surface} stroke={SC.line} />
                  <rect x={6} y={8} width={26} height={14} rx={3} fill={SC.soft} />
                  {[0, 1, 2].map(r => <rect key={r} x={6} y={30 + r * 10} width={26 - r * 6} height={5} rx={2} fill={SC.line} />)}
                  {crossed && t >= 6 && <path d="M2 2 L36 70 M36 2 L2 70" stroke={SC.error} strokeWidth={3} opacity={p(t, 7.5 + i * 0.05, 8 + i * 0.05)} />}
                </g>
              );
            })}
            <g transform="translate(620 170)" opacity={p(t, 4, 4.6)}>
              <path d="M0 40 H60" stroke={SC.text} strokeWidth={3} markerEnd="url(#sc-arrow)" />
              <text x={0} y={24} fontSize={13} fontWeight={800} fill={SC.muted}>Handoff</text>
              <rect x={80} y={0} width={190} height={84} rx={14} fill={SC.surface} stroke={SC.line} />
              <text x={96} y={34} fontSize={15} fontWeight={900} fill={SC.text}>Rohan, Karthik</text>
              <text x={96} y={58} fontSize={13} fontWeight={700} fill={SC.muted}>see it for the first time</text>
            </g>
            {t >= 6 && QUESTIONS.map((q, i) => (
              <g key={q} transform={`translate(${640 + (i % 2) * 40} ${290 + i * 52})`} opacity={p(t, 6.3 + i * 0.6, 6.8 + i * 0.6)}>
                <rect width={240} height={38} rx={12} fill={SC.surface} stroke={SC.error} strokeWidth={2} />
                <text x={14} y={25} fontSize={14} fontWeight={800} fill={SC.text}>{q}</text>
              </g>
            ))}
            {t >= 6 && <text x={80} y={420} fontSize={18} fontWeight={900} fill={SC.error} opacity={p(t, 8.6, 9.2)}>11 screens redrawn · the sprint slips four days</text>}
            <defs><marker id="sc-arrow" viewBox="0 0 10 10" refX={8} refY={5} markerWidth={7} markerHeight={7} orient="auto"><path d="M0 0 L10 5 L0 10 Z" fill={SC.text} /></marker></defs>
          </g>
        )}

        {t >= 11 && t < 16 && (
          <g transform="translate(80 120)">
            {[0, 1, 2, 3].map(s => (
              <text key={s} x={180 + s * 170} y={0} fontSize={13} fontWeight={800} fill={SC.muted} opacity={p(t, 11.2, 11.7)}>Sprint {s + 1}</text>
            ))}
            {TRACKS.map((tr, r) => (
              <g key={tr.id} transform={`translate(0 ${30 + r * 150})`} opacity={p(t, 11.4 + r * 0.8, 11.9 + r * 0.8)}>
                <text y={24} fontSize={16} fontWeight={900} fill={SC.text}>{tr.label}</text>
                <text y={46} fontSize={12} fontWeight={700} fill={SC.muted}>{r === 0 ? 'a sprint ahead' : 'this sprint'}</text>
                {/* A story tested in sprint s is built in sprint s + 1. */}
                {(r === 0 ? [0, 1, 2, 3] : [1, 2, 3]).map(s => {
                  const story = String.fromCharCode(65 + (r === 0 ? s : s - 1));
                  const tone = r === 0 ? SC.discover : SC.build;
                  return (
                    <g key={s} transform={`translate(${180 + s * 170} 0)`} opacity={p(t, 12.2 + s * 0.5 + r * 0.25, 12.7 + s * 0.5 + r * 0.25)}>
                      <rect width={156} height={60} rx={12} fill={SC.surface} stroke={tone} strokeWidth={2} />
                      <rect width={8} height={60} rx={4} fill={tone} />
                      <text x={20} y={26} fontSize={13} fontWeight={800} fill={SC.text}>{r === 0 ? 'Test' : 'Build'} story {story}</text>
                      <text x={20} y={46} fontSize={11.5} fontWeight={700} fill={SC.muted}>{r === 0 ? 'interviews, a flow' : 'questions, design QA'}</text>
                    </g>
                  );
                })}
              </g>
            ))}
            {[1, 2, 3].map(s => (
              <path key={s} d={`M${180 + (s - 1) * 170 + 78} 92 C ${180 + (s - 1) * 170 + 78} 140, ${180 + s * 170 + 78} 120, ${180 + s * 170 + 78} 178`} fill="none" stroke={SC.muted} strokeWidth={2} strokeDasharray="5 5" opacity={p(t, 13.5 + s * 0.4, 14 + s * 0.4)} />
            ))}
          </g>
        )}

        {t >= 16 && t < 31 && (
          <g>
            {Array.from({ length: SPRINT_DAYS }, (_, i) => (
              <g key={i} opacity={p(t, 16 + i * 0.06, 16.4 + i * 0.06)}>
                <Day d={i + 1} x={80 + (i % 5) * 164} y={110 + Math.floor(i / 5) * 124} lit={lit} hot={i + 1 === hotDay ? hotText : undefined} />
              </g>
            ))}
            <g transform="translate(80 380)">
              {t < 21 && <text fontSize={16} fontWeight={800} fill={SC.text} opacity={p(t, 17, 17.6)}>Day 2, after stand-up: Rohan is stuck. Day 3, 9:30 am: he says so. Answered by lunch.</text>}
              {t >= 21 && t < 26 && <text fontSize={16} fontWeight={800} fill={SC.text} opacity={p(t, 21.6, 22.2)}>Karthik: “Swaps after 9 pm can’t reach the kitchen in time.” Found before it’s built.</text>}
              {t >= 26 && t < 28.5 && <text fontSize={16} fontWeight={800} fill={SC.text} opacity={p(t, 26.4, 27)}>Vikram and Sunita pause a meal themselves, on a real phone.</text>}
              {t >= 28.5 && <text fontSize={16} fontWeight={800} fill={SC.text} opacity={p(t, 28.7, 29.2)}>Retro: designs reach developers on day 1. Fix: bring them to refinement first.</text>}
            </g>
          </g>
        )}

        {t >= 31 && (
          <g transform="translate(80 120)">
            <text fontSize={18} fontWeight={900} fill={SC.text} opacity={p(t, 31.1, 31.6)}>Days the four blockers kept someone waiting</text>
            {[
              { l: 'Held for the retro', v: AT_RETRO, c: SC.muted },
              { l: 'Raised at stand-up', v: AT_STANDUP, c: CEREMONY_TONE.standup },
            ].map((r, i) => {
              const k = p(t, 31.6 + i * 0.7, 32.8 + i * 0.7);
              return (
                <g key={r.l} transform={`translate(0 ${40 + i * 70})`}>
                  <text y={18} fontSize={14} fontWeight={800} fill={SC.muted}>{r.l}</text>
                  <rect x={180} width={lerp(0, r.v * 30, k)} height={30} rx={8} fill={r.c} />
                  <text x={190 + lerp(0, r.v * 30, k)} y={21} fontSize={16} fontWeight={900} fill={SC.text} opacity={k}>{r.v} days</text>
                </g>
              );
            })}
            <g transform="translate(0 210)" opacity={p(t, 33.6, 34.2)}>
              <rect width={720} height={70} rx={14} fill={SC.surface} stroke={SC.line} />
              <rect width={8} height={70} rx={4} fill={SC.design} />
              <text x={24} y={30} fontSize={15} fontWeight={900} fill={SC.text}>This sprint’s slice: pause a single day, refund to the wallet</text>
              <text x={24} y={52} fontSize={13} fontWeight={700} fill={SC.muted}>Works end to end for a real subscriber. Presets and festival plans come later.</text>
            </g>
          </g>
        )}
      </g>
    </svg>
  );
}
