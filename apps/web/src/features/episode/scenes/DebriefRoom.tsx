'use client';
// Scene for ld.3-1: Kaarigar hires a senior designer for its partner app. Five interviewers, and the first to speak in
// the debrief says “great culture fit”; everyone nods. Shalini has notes written before anyone talks, draws the ladder
// (a rung is the scope someone works at unaided), sets aside notes with no behaviour, places the rest, and levels where
// most of the evidence sits: senior. The same ladder then places the team. Pure function of t (0–36). Also exports
// `BAR_FILL` and `RUNG_LABEL`, which `level-call` uses.
import type { BarCall, LadderLevel } from '@shape/content';
import { back, clamp, Grid, lerp, p, SC } from './shared';

const W = 640, H = 360;
/** One fill per call; white text on each passes 4.5:1. */
export const BAR_FILL: Record<BarCall, string> = { noise: '#475467', below: '#B54708', at: '#067647', above: '#175CD3' };
export const RUNG_LABEL: Record<LadderLevel, string> = { associate: 'Associate', designer: 'Designer', senior: 'Senior', lead: 'Lead' };
const RUNGS: { level: LadderLevel; scope: string }[] = [
  { level: 'lead', scope: 'several teams' }, { level: 'senior', scope: 'a product area' },
  { level: 'designer', scope: 'a feature' }, { level: 'associate', scope: 'a framed task' },
];
const PANEL = ['Aditya', 'Irfan', 'Neelam', 'Kavya', 'Shalini'] as const;
const AVATAR = '#344054';
const rungY = (i: number) => 76 + i * 62;

/** The ladder, rungs top (lead) to bottom (associate), with the senior bar marked. */
function Ladder({ k = 1, x = 32, scopes = false }: { k?: number; x?: number; scopes?: boolean }) {
  return (
    <g>
      {RUNGS.map((r, i) => (
        <g key={r.level} opacity={clamp(k * 4 - (3 - i))}>
          <rect x={x} y={rungY(i)} width={300} height={50} rx={10} fill={SC.surface} stroke={r.level === 'senior' ? BAR_FILL.at : SC.line} strokeWidth={r.level === 'senior' ? 3 : 2} />
          <text x={x + 16} y={rungY(i) + 33} fontSize={21} fontWeight={900} fill={SC.text}>{RUNG_LABEL[r.level]}</text>
          {scopes && <text x={x + 284} y={rungY(i) + 33} fontSize={21} fontWeight={800} fill={SC.muted} textAnchor="end">{r.scope}</text>}
        </g>
      ))}
    </g>
  );
}

export function DebriefRoomScene({ t }: { t: number }) {
  const intro = clamp(back(t / 0.6));
  const title = t < 6 ? 'One role, five interviews' : t < 11 ? 'The loudest voice' : t < 16 ? 'Write first, talk second' : t < 21 ? 'What senior means here' : t < 26 ? 'Evidence, not vibes' : t < 31 ? 'Where most of it sits' : 'Same ladder inside';

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" role="img" aria-label="Animated story: Kaarigar is hiring a senior designer for its partner app, and Ritu has done a loop of five interviews. In the debrief, Aditya says “great culture fit” first and everyone nods; last time that hired a designer at a senior’s pay. Shalini has every interviewer write their notes before anyone talks. She draws the ladder: associate for a framed task, designer for a feature, senior for a product area, lead for several teams. “Ex-Flipkart, NID” is set aside because it describes no behaviour; “owned seller onboarding, drop-off from 41% to 23%” goes on the senior rung. Nine behavioural notes go on the ladder, one at associate, two at designer, three at senior and three at lead; the middle of them is senior, so the offer is senior. The same ladder places the team for promotions, and each level has its own pay band.">
      <rect width={W} height={H} fill={SC.soft} />
      <Grid w={W} h={H} />
      <g opacity={intro}>
        <text x={32} y={44} fontSize={26} fontWeight={900} fill={SC.text}>{title}</text>

        {t < 6 && (
          <g>
            <g opacity={p(t, 0.3, 1)}>
              <rect x={32} y={70} width={576} height={64} rx={14} fill={SC.surface} stroke={SC.line} strokeWidth={2} />
              <text x={52} y={100} fontSize={21} fontWeight={900} fill={SC.text}>Senior designer · partner app</text>
              <text x={52} y={124} fontSize={21} fontWeight={800} fill={SC.muted}>Candidate: Ritu Bhandari</text>
            </g>
            {PANEL.map((n, i) => (
              <g key={n} opacity={p(t, 1.4 + i * 0.4, 1.9 + i * 0.4)}>
                <circle cx={80 + i * 120} cy={196} r={30} fill={AVATAR} />
                <text x={80 + i * 120} y={204} fontSize={22} fontWeight={900} fill="#fff" textAnchor="middle">{n[0]}</text>
                <text x={80 + i * 120} y={256} fontSize={21} fontWeight={800} fill={SC.text} textAnchor="middle">{n}</text>
              </g>
            ))}
            <text x={32} y={318} fontSize={21} fontWeight={800} fill={SC.muted} opacity={p(t, 4, 4.6)}>Portfolio, critique, craft, product, values.</text>
          </g>
        )}

        {t >= 6 && t < 11 && (
          <g>
            {PANEL.map((n, i) => (
              <g key={n}>
                <circle cx={80 + i * 120} cy={250} r={30} fill={AVATAR} />
                <text x={80 + i * 120} y={258} fontSize={22} fontWeight={900} fill="#fff" textAnchor="middle">{n[0]}</text>
                {i > 0 && i < 4 && <text x={80 + i * 120} y={206} fontSize={22} fontWeight={900} fill={SC.muted} textAnchor="middle" opacity={p(t, 7.6 + i * 0.3, 8 + i * 0.3)}>✓</text>}
              </g>
            ))}
            <g opacity={p(t, 6.3, 6.9)}>
              <rect x={40} y={74} width={300} height={56} rx={14} fill={SC.surface} stroke={SC.error} strokeWidth={3} />
              <text x={60} y={110} fontSize={22} fontWeight={900} fill={SC.text}>“Great culture fit!”</text>
              <path d="M80 130 L80 214" stroke={SC.error} strokeWidth={3} />
            </g>
            <text x={32} y={330} fontSize={21} fontWeight={800} fill={SC.error} opacity={p(t, 9, 9.6)}>Last time: a designer, at a senior’s pay.</text>
          </g>
        )}

        {t >= 11 && t < 16 && (
          <g>
            {PANEL.map((n, i) => {
              const k = p(t, 11.3 + i * 0.25, 11.9 + i * 0.25);
              return (
                <g key={n} opacity={k} transform={`translate(${32 + i * 118} ${lerp(110, 80, k)})`}>
                  <rect width={106} height={150} rx={10} fill={SC.surface} stroke={SC.line} strokeWidth={2} />
                  <text x={53} y={34} fontSize={21} fontWeight={900} fill={SC.text} textAnchor="middle">{n}</text>
                  {[0, 1, 2, 3].map(j => <rect key={j} x={14} y={56 + j * 20} width={j === 3 ? 44 : 78} height={8} rx={4} fill={SC.line} opacity={p(t, 12.6 + j * 0.3, 13 + j * 0.3)} />)}
                </g>
              );
            })}
            <text x={32} y={280} fontSize={21} fontWeight={900} fill={SC.text} opacity={p(t, 13.8, 14.4)}>Notes in before anyone talks.</text>
            <text x={32} y={310} fontSize={21} fontWeight={800} fill={SC.muted} opacity={p(t, 14.4, 15)}>Nobody anchors on the first opinion.</text>
          </g>
        )}

        {t >= 16 && t < 21 && (
          <g>
            <Ladder k={p(t, 16.2, 18.4)} scopes />
            <g opacity={p(t, 18.8, 19.4)}>
              <text x={356} y={110} fontSize={21} fontWeight={900} fill={SC.text}>A rung is the scope</text>
              <text x={356} y={138} fontSize={21} fontWeight={900} fill={SC.text}>someone works at</text>
              <text x={356} y={166} fontSize={21} fontWeight={900} fill={SC.text}>without being told</text>
              <text x={356} y={194} fontSize={21} fontWeight={900} fill={SC.text}>the problem.</text>
              <text x={356} y={244} fontSize={21} fontWeight={800} fill={BAR_FILL.at}>The bar: senior.</text>
            </g>
          </g>
        )}

        {t >= 21 && t < 26 && (() => {
          const strike = p(t, 22, 22.8), slide = p(t, 23.4, 24.6);
          return (
            <g>
              <Ladder />
              <g opacity={1 - p(t, 23, 23.6) * 0.5}>
                <rect x={356} y={76} width={252} height={50} rx={10} fill={SC.surface} stroke={SC.line} strokeWidth={2} />
                <text x={372} y={109} fontSize={21} fontWeight={800} fill={SC.text}>Ex-Flipkart, NID</text>
                <line x1={368} y1={102} x2={lerp(368, 592, strike)} y2={102} stroke={SC.error} strokeWidth={3} />
              </g>
              <text x={356} y={152} fontSize={21} fontWeight={800} fill={SC.muted} opacity={strike}>Describes nothing she did.</text>
              <g transform={`translate(${lerp(356, 188, slide)} ${lerp(196, rungY(1) + 8, slide)})`}>
                <rect width={lerp(252, 132, slide)} height={34} rx={8} fill={BAR_FILL.at} />
                <text x={12} y={24} fontSize={21} fontWeight={900} fill="#fff">{slide > 0.5 ? '41→23%' : 'Drop-off 41→23%'}</text>
              </g>
              <text x={356} y={300} fontSize={21} fontWeight={800} fill={SC.text} opacity={p(t, 24.8, 25.4)}>Owned it, unaided.</text>
            </g>
          );
        })()}

        {t >= 26 && t < 31 && (
          <g>
            <Ladder />
            {([[0, 3], [1, 3], [2, 2], [3, 1]] as const).map(([i, n]) => Array.from({ length: n }, (_, j) => {
              const k = p(t, 26.3 + (i * 3 + j) * 0.2, 26.7 + (i * 3 + j) * 0.2);
              const fill = i === 0 ? BAR_FILL.above : i === 1 ? BAR_FILL.at : BAR_FILL.below;
              return <circle key={`${i}-${j}`} cx={170 + j * 34} cy={rungY(i) + 25} r={12 * k} fill={fill} />;
            }))}
            <g opacity={p(t, 28.6, 29.2)}>
              <rect x={356} y={rungY(1)} width={252} height={50} rx={10} fill={BAR_FILL.at} />
              <text x={372} y={rungY(1) + 33} fontSize={21} fontWeight={900} fill="#fff">Offer: Senior</text>
              <text x={356} y={220} fontSize={21} fontWeight={800} fill={SC.text}>The middle of nine</text>
              <text x={356} y={248} fontSize={21} fontWeight={800} fill={SC.text}>notes, not the best</text>
              <text x={356} y={276} fontSize={21} fontWeight={800} fill={SC.text}>or worst interview.</text>
            </g>
          </g>
        )}

        {t >= 31 && (
          <g>
            <Ladder />
            {([['N', 1], ['I', 1], ['P', 2], ['A', 2], ['T', 3]] as const).map(([n, i], j) => {
              const k = p(t, 31.3 + j * 0.35, 31.8 + j * 0.35);
              const sameRow = j === 1 || j === 3 ? 1 : 0;
              return (
                <g key={n} opacity={k}>
                  <circle cx={190 + sameRow * 40} cy={rungY(i) + 25} r={16} fill={AVATAR} />
                  <text x={190 + sameRow * 40} y={rungY(i) + 33} fontSize={21} fontWeight={900} fill="#fff" textAnchor="middle">{n}</text>
                </g>
              );
            })}
            <g opacity={p(t, 33.4, 34)}>
              <text x={356} y={110} fontSize={21} fontWeight={900} fill={SC.text}>Promotions use it too.</text>
              <text x={356} y={150} fontSize={21} fontWeight={800} fill={SC.muted}>One pay band per level,</text>
              <text x={356} y={178} fontSize={21} fontWeight={800} fill={SC.muted}>whoever negotiated.</text>
            </g>
          </g>
        )}
      </g>
    </svg>
  );
}
