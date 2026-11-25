'use client';
// Scene for dc.3-1: Meera's week on Hisaab's "Snap a bill". AI drafts the transcripts, review themes and dummy bills
// (`HISAAB_TASKS`, hours by hand shrinking to hours with AI); she replays a transcript number and fixes 60 to 16; a
// chatbot playing five shop owners wants automatic posting, and five real owners check every rupee
// (`SYNTHETIC_VS_REAL`); AI drafts 20 layouts and she picks two; the week ends with `hoursBack` and the roadmap call
// still hers. Pure function of t (0–36).
// Also exports `ROLE_TONE` for `ai-delegate`.
import { HISAAB_TASKS, SYNTHETIC_VS_REAL, hoursBack, type AiRole } from '@shape/content';
import { back, clamp, Grid, lerp, p, SC } from './shared';

const W = 960, H = 540;
export const ROLE_TONE: Record<AiRole, string> = { delegate: SC.discover, assist: SC.design, keep: SC.muted };
const FAST = ['transcribe', 'reviews', 'bills'] as const;
const FAST_SHORT = { transcribe: 'Transcribe 8 interviews', reviews: 'Theme 600 reviews', bills: '40 dummy bills' } as const;
const HOURS_BACK = hoursBack(Object.values(HISAAB_TASKS));

function Face({ x, y, bot, tone }: { x: number; y: number; bot?: boolean; tone: string }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      {bot ? <rect x={-20} y={-20} width={40} height={40} rx={10} fill={tone} opacity={0.25} /> : <circle r={20} fill={tone} opacity={0.25} />}
      {bot ? <rect x={-20} y={-20} width={40} height={40} rx={10} fill="none" stroke={tone} strokeWidth={2} /> : <circle r={20} fill="none" stroke={tone} strokeWidth={2} />}
      <circle cx={-7} cy={-3} r={2.6} fill={SC.text} /><circle cx={7} cy={-3} r={2.6} fill={SC.text} />
      {bot ? <line x1={-7} y1={8} x2={7} y2={8} stroke={SC.text} strokeWidth={2.5} strokeLinecap="round" /> : <path d="M-7 7 q7 6 14 0" fill="none" stroke={SC.text} strokeWidth={2.5} strokeLinecap="round" />}
    </g>
  );
}

export function AiWorkflowScene({ t }: { t: number }) {
  const intro = clamp(back(t / 0.6));
  const title = t < 6 ? 'One week, one feature' : t < 11 ? 'The fast parts' : t < 16 ? 'Check what it made' : t < 21 ? 'The shortcut' : t < 26 ? 'Real people disagree' : t < 31 ? 'Widen, then choose' : 'Hours back, judgment kept';
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" role="img" aria-label={`Animated story: Meera designs Hisaab's Snap a bill in one week. AI transcribes eight interviews, groups 600 reviews into themes and makes 40 dummy bills, and she checks the numbers, fixing a transcript that turned 16 bills a week into 60. A chatbot playing five shop owners says: ${SYNTHETIC_VS_REAL.synthetic} Five real owners disagree: ${SYNTHETIC_VS_REAL.real} AI drafts 20 layouts and Meera combines two. About ${Math.round(HOURS_BACK)} hours come back after checking, and the roadmap decision stays hers.`}>
      <rect width={W} height={H} fill={SC.soft} />
      <Grid />
      <g opacity={intro}>
        <text x={60} y={60} fontSize={22} fontWeight={900} fill={SC.text}>{title}</text>

        {t < 6 && (
          <g>
            <g transform="translate(90 120)" opacity={p(t, 0.3, 1)}>
              <rect width={220} height={340} rx={28} fill={SC.surface} stroke={SC.line} strokeWidth={2} />
              <rect x={20} y={30} width={180} height={200} rx={10} fill={SC.soft} />
              <g transform="translate(55 55) rotate(-4)">
                <rect width={110} height={150} rx={4} fill="#FFFDF5" stroke={SC.line} />
                {[0, 1, 2, 3, 4, 5].map(i => <rect key={i} x={10} y={16 + i * 20} width={i % 2 ? 60 : 85} height={6} rx={3} fill="#CBD5E1" />)}
              </g>
              <circle cx={110} cy={280} r={26} fill="none" stroke={SC.text} strokeWidth={3} />
              <circle cx={110} cy={280} r={18} fill={SC.text} opacity={p(t, 2, 2.4)} />
            </g>
            <g transform="translate(380 150)" opacity={p(t, 2.5, 3.2)}>
              <rect width={500} height={250} rx={16} fill={SC.surface} stroke={SC.line} />
              <text x={24} y={40} fontSize={16} fontWeight={900} fill={SC.text}>Purchase entry · filled from the photo</text>
              {['Supplier', 'Items', 'GST', 'Total'].map((l, i) => (
                <g key={l} transform={`translate(24 ${70 + i * 42})`} opacity={p(t, 3 + i * 0.4, 3.4 + i * 0.4)}>
                  <text y={16} fontSize={14} fontWeight={700} fill={SC.muted}>{l}</text>
                  <rect x={120} width={330} height={26} rx={6} fill={SC.soft} />
                </g>
              ))}
            </g>
          </g>
        )}

        {t >= 6 && t < 11 && FAST.map((k, i) => {
          const [solo, ai] = HISAAB_TASKS[k].hours ?? [0, 0];
          const k2 = p(t, 6.6 + i * 0.9, 7.8 + i * 0.9);
          const w = lerp(solo, ai, k2) * 34;
          return (
            <g key={k} transform={`translate(80 ${130 + i * 110})`} opacity={p(t, 6.2 + i * 0.6, 6.7 + i * 0.6)}>
              <text y={0} fontSize={16} fontWeight={800} fill={SC.text}>{FAST_SHORT[k]}</text>
              <rect y={14} width={solo * 34} height={26} rx={8} fill={SC.line} opacity={0.5} />
              <rect y={14} width={w} height={26} rx={8} fill={ROLE_TONE.delegate} />
              <text x={solo * 34 + 14} y={33} fontSize={14} fontWeight={800} fill={SC.muted}>{solo} h by hand</text>
              <text x={w + 10} y={33} fontSize={14} fontWeight={900} fill={SC.text} opacity={k2}>{ai} h with AI, checked</text>
            </g>
          );
        })}

        {t >= 11 && t < 16 && (
          <g transform="translate(80 110)">
            <rect width={800} height={320} rx={16} fill={SC.surface} stroke={SC.line} />
            <text x={24} y={40} fontSize={14} fontWeight={800} fill={SC.muted}>Interview 3 · Pune · translated from Marathi</text>
            <g transform="translate(24 70)">
              {Array.from({ length: 60 }, (_, i) => <rect key={i} x={i * 12.6} y={30 - (6 + Math.abs(Math.sin(i * 1.7)) * 24) / 2} width={7} height={6 + Math.abs(Math.sin(i * 1.7)) * 24} rx={3} fill={SC.line} />)}
              <line x1={lerp(0, 380, p(t, 11.4, 13))} x2={lerp(0, 380, p(t, 11.4, 13))} y1={-4} y2={64} stroke={SC.brand} strokeWidth={3} />
            </g>
            <text x={24} y={190} fontSize={22} fontWeight={700} fill={SC.text}>“We get about</text>
            <g transform="translate(190 190)">
              <text fontSize={22} fontWeight={900} fill={SC.error} opacity={1 - p(t, 13.2, 13.8)} textDecoration="line-through">60</text>
              <text y={0} x={0} fontSize={22} fontWeight={900} fill={SC.text} opacity={p(t, 13.4, 14)}>16</text>
              <rect x={-4} y={-24} width={36} height={32} rx={6} fill="none" stroke={t < 13.4 ? SC.error : SC.mint} strokeWidth={2.5} opacity={p(t, 12, 12.4)} />
            </g>
            <text x={240} y={190} fontSize={22} fontWeight={700} fill={SC.text}>bills a week from suppliers.”</text>
            <text x={24} y={260} fontSize={15} fontWeight={800} fill={SC.muted} opacity={p(t, 13.8, 14.4)}>Checked against the recording: numbers, names and quotes, every time.</text>
          </g>
        )}

        {t >= 16 && t < 26 && (
          <g>
            <g transform="translate(70 110)" opacity={t < 21 ? 1 : lerp(1, 0.35, p(t, 21, 22))}>
              <text fontSize={15} fontWeight={900} fill={SC.text}>Chatbot as five shop owners</text>
              {[0, 1, 2, 3, 4].map(i => (
                <g key={i} transform={`translate(0 ${30 + i * 66})`} opacity={p(t, 16.3 + i * 0.4, 16.7 + i * 0.4)}>
                  <Face x={22} y={22} bot tone={SC.muted} />
                  <rect x={56} y={4} width={300} height={36} rx={12} fill={SC.surface} stroke={SC.line} />
                  <text x={70} y={27} fontSize={13} fontWeight={700} fill={SC.text}>“Post bills automatically, no review.”</text>
                </g>
              ))}
              {t >= 21 && <line x1={-10} y1={14} x2={370} y2={360} stroke={SC.error} strokeWidth={4} strokeLinecap="round" opacity={p(t, 22, 22.6)} />}
            </g>
            {t >= 21 && (
              <g transform="translate(500 110)">
                <text fontSize={15} fontWeight={900} fill={SC.text}>Five real kirana owners</text>
                {['Ramesh, Pune', 'Lata, Nagpur', 'Imran, Indore', 'Kavita, Nashik', 'Joseph, Kochi'].map((n, i) => (
                  <g key={n} transform={`translate(0 ${30 + i * 66})`} opacity={p(t, 21.3 + i * 0.4, 21.7 + i * 0.4)}>
                    <Face x={22} y={22} tone={SC.design} />
                    <rect x={56} y={4} width={330} height={36} rx={12} fill={SC.surface} stroke={SC.design} strokeWidth={1.5} />
                    <text x={70} y={27} fontSize={13} fontWeight={700} fill={SC.text}>{n}: {i === 2 ? 'keeps paper bills a year' : 'checks every rupee'}</text>
                  </g>
                ))}
              </g>
            )}
          </g>
        )}

        {t >= 26 && t < 31 && (
          <g transform="translate(80 100)">
            {Array.from({ length: 20 }, (_, i) => {
              const pick = i === 6 || i === 13;
              const x = (i % 10) * 82, y = Math.floor(i / 10) * 140;
              const o = p(t, 26 + i * 0.08, 26.4 + i * 0.08) * (pick ? 1 : lerp(1, 0.3, p(t, 28, 28.6)));
              return (
                <g key={i} transform={`translate(${x} ${y})`} opacity={o}>
                  <rect width={70} height={124} rx={10} fill={SC.surface} stroke={pick && t > 28 ? SC.design : SC.line} strokeWidth={pick && t > 28 ? 3 : 1} />
                  <rect x={8} y={10 + (i % 3) * 6} width={54} height={i % 2 ? 30 : 44} rx={4} fill={SC.soft} />
                  {[0, 1, 2].map(r => <rect key={r} x={8} y={66 + r * 12 + (i % 4)} width={54 - ((i + r) % 3) * 12} height={6} rx={3} fill={SC.line} />)}
                  <rect x={8} y={104} width={54} height={12} rx={4} fill={i % 5 === 0 ? SC.muted : SC.brand} opacity={0.8} />
                </g>
              );
            })}
            <g transform="translate(0 300)" opacity={p(t, 28.8, 29.4)}>
              <rect width={360} height={34} rx={10} fill={SC.surface} stroke={SC.design} strokeWidth={2} />
              <text x={14} y={22} fontSize={14} fontWeight={800} fill={SC.text}>Meera picks two ideas and combines them</text>
              <g transform="translate(390 0)" opacity={p(t, 29.4, 30)}>
                <rect width={410} height={34} rx={10} fill={SC.surface} stroke={SC.error} strokeWidth={2} />
                <text x={14} y={22} fontSize={14} fontWeight={800} fill={SC.text}>Heuristics pass: grey hint text is 2.8:1, fix it</text>
              </g>
            </g>
          </g>
        )}

        {t >= 31 && (
          <g transform="translate(80 120)" opacity={p(t, 31, 31.5)}>
            <text fontSize={64} fontWeight={900} fill={SC.text}>{Math.round(lerp(0, HOURS_BACK, p(t, 31.2, 33)))} hours</text>
            <text y={40} fontSize={18} fontWeight={800} fill={SC.muted}>back this week, after checking everything AI made</text>
            {[
              { l: 'Spent on', v: 'two more shop visits', c: SC.design },
              { l: 'Kept human', v: 'interviews, quotes, customers’ data', c: SC.muted },
              { l: 'Her call', v: 'which feature ships first', c: SC.brand },
            ].map((r, i) => (
              <g key={r.l} transform={`translate(0 ${100 + i * 62})`} opacity={p(t, 32.6 + i * 0.6, 33.1 + i * 0.6)}>
                <rect width={600} height={46} rx={12} fill={SC.surface} stroke={SC.line} />
                <rect width={8} height={46} rx={4} fill={r.c} />
                <text x={24} y={29} fontSize={15} fontWeight={800} fill={SC.muted}>{r.l}</text>
                <text x={160} y={29} fontSize={16} fontWeight={900} fill={SC.text}>{r.v}</text>
              </g>
            ))}
          </g>
        )}
      </g>
    </svg>
  );
}
