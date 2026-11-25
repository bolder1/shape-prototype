'use client';
// Scene for rs.5-1: Bolo's quick survey and the fixed one. Kunal's in-app pop-up asks a leading question and gets
// 2,300 answers, 81% yes. Tanushree rewrites the question, then shows who the pop-up reached: only active learners
// who chose to tap, while six in ten sign-ups have stopped practising. The Literary Digest's 2.4 million ballots in
// 1936 show that size can't fix a skewed sample. A random 1,200 (`BOLO_FIELD`), lapsed learners included, gives 492
// answers and an honest ±4.4 points (`moe`). Pure function of t (0–36).
import { BOLO_FIELD, BOLO_ITEMS, moe } from '@shape/content';
import { back, clamp, Grid, lerp, p, Pen, SC } from './shared';

const W = 960, H = 540;
const COLS = 15, ROWS = 6;
/** Which of the 90 sign-ups are lapsed (about six in ten), which active ones tapped the pop-up, and which were drawn
 *  at random for the fixed survey. Fixed patterns, so the scene is the same every frame. */
const lapsed = (i: number) => (i * 37) % 10 < 6;
const tapped = (i: number) => !lapsed(i) && (i * 13) % 3 === 0;
const drawn = (i: number) => (i * 29) % 7 === 0;
const POP = 2300;

function Para({ x, y, w, h, size = 15, weight = 800, children, muted }: { x: number; y: number; w: number; h: number; size?: number; weight?: number; children: React.ReactNode; muted?: boolean }) {
  return (
    <foreignObject x={x} y={y} width={w} height={h}>
      <p style={{ margin: 0, font: `${weight} ${size}px/1.35 Inter, system-ui, sans-serif`, color: muted ? 'var(--color-text-tertiary)' : 'var(--color-text-primary)' }}>{children}</p>
    </foreignObject>
  );
}

function People({ t, mode }: { t: number; mode: 'popup' | 'random' }) {
  return (
    <g>
      {Array.from({ length: COLS * ROWS }, (_, i) => {
        const cx = (i % COLS) * 34, cy = Math.floor(i / COLS) * 34;
        const on = mode === 'popup' ? tapped(i) : drawn(i);
        const k = mode === 'popup' ? p(t, 12 + (i % 9) * 0.15, 12.6 + (i % 9) * 0.15) : p(t, 21.6 + (i % 11) * 0.18, 22.2 + (i % 11) * 0.18);
        return (
          <g key={i} transform={`translate(${cx} ${cy})`}>
            <circle r={11} fill={lapsed(i) ? SC.soft : SC.surface} stroke={lapsed(i) ? SC.line : SC.muted} strokeWidth={2} strokeDasharray={lapsed(i) ? '3 3' : undefined} />
            {on && <circle r={lerp(4, 11, k)} fill={mode === 'popup' ? SC.grow : SC.brand} opacity={k} />}
          </g>
        );
      })}
    </g>
  );
}

export function SurveySampleScene({ t }: { t: number }) {
  const intro = clamp(back(t / 0.6));
  const title = t < 6 ? 'The quick survey' : t < 11 ? 'What the question did' : t < 16 ? 'Who answered' : t < 21 ? 'Bigger isn’t better' : t < 26 ? 'A random 1,200' : t < 31 ? `${BOLO_FIELD.responded} answers` : 'Honest about what it covers';
  const count = Math.round(lerp(0, POP, p(t, 1.6, 4.6)));
  const answered = Math.round(lerp(0, BOLO_FIELD.responded, p(t, 26.3, 28.3)));
  const mPop = moe(POP) * 100, mRand = moe(BOLO_FIELD.responded) * 100;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" role="img" aria-label={`Animated story: Bolo's in-app pop-up asks "${BOLO_ITEMS.confidence.stem}" and gets 2,300 answers, 81% yes. The question is leading, so Tanushree rewrites it. The pop-up only reached active learners who chose to tap; six in ten sign-ups had stopped practising and never saw it. In 1936 the Literary Digest's 2.4 million ballots called the US election wrong. A random sample of ${BOLO_FIELD.invites} people, lapsed learners included, gives ${BOLO_FIELD.responded} answers and a margin of error of plus or minus ${mRand.toFixed(1)} points.`}>
      <rect width={W} height={H} fill={SC.soft} />
      <Grid />
      <g opacity={intro}>
        <text x={60} y={60} fontSize={22} fontWeight={900} fill={SC.text}>{title}</text>

        {t < 11 && (
          <g transform="translate(60 92)">
            <rect width={260} height={410} rx={34} fill={SC.surface} stroke={SC.line} strokeWidth={2} opacity={p(t, 0.2, 0.7)} />
            <g opacity={p(t, 0.6, 1.1)}>
              <rect x={20} y={150} width={220} height={190} rx={18} fill={SC.soft} stroke={SC.line} />
              <text x={36} y={178} fontSize={12} fontWeight={900} fill={SC.muted}>QUICK QUESTION</text>
              <Para x={36} y={188} w={190} h={90} size={15}>{t < 7.6 ? BOLO_ITEMS.confidence.stem : 'In a normal week, which would you use more: a live room with a tutor, or a 10-minute drill?'}</Para>
              {t >= 6.4 && t < 7.6 && <rect x={34} y={190} width={lerp(0, 120, p(t, 6.4, 7.2))} height={22} rx={4} fill={SC.error} opacity={0.18} />}
              <rect x={36} y={292} width={88} height={34} rx={10} fill={SC.brand} />
              <text x={80} y={314} textAnchor="middle" fontSize={14} fontWeight={900} fill="#fff">{t < 7.6 ? 'Yes' : 'Live room'}</text>
              <rect x={136} y={292} width={88} height={34} rx={10} fill={SC.surface} stroke={SC.line} />
              <text x={180} y={314} textAnchor="middle" fontSize={14} fontWeight={900} fill={SC.text}>{t < 7.6 ? 'No' : 'Drill'}</text>
            </g>
            <g transform="translate(320 40)" opacity={p(t, 1.4, 1.9)}>
              <text fontSize={13} fontWeight={900} fill={SC.muted}>ANSWERS THIS WEEK</text>
              <text y={66} fontSize={60} fontWeight={900} fill={SC.text}>{count.toLocaleString('en-IN')}</text>
              <rect y={100} width={460} height={30} rx={8} fill={SC.surface} stroke={SC.line} />
              <rect y={100} width={lerp(0, 460 * 0.81, p(t, 3, 4.6))} height={30} rx={8} fill="var(--color-family-grow-solid)" />
              <text x={10} y={121} fontSize={15} fontWeight={900} fill="#fff" opacity={p(t, 4, 4.6)}>81% yes</text>
              {t >= 6 && <Para x={0} y={170} w={480} h={130} muted>“Wouldn’t it help…?” asks for a yes, and people are polite. One question, rewritten to name both options neutrally, measures what they’d actually choose.</Para>}
            </g>
          </g>
        )}

        {t >= 11 && t < 16 && (
          <g transform="translate(80 120)">
            <People t={t} mode="popup" />
            <Para x={0} y={220} w={800} h={80} muted>Dashed: learners who’ve stopped practising, six in ten sign-ups. The pop-up shows after a lesson, so it never reaches them. Green: the active learners who chose to tap.</Para>
          </g>
        )}

        {t >= 16 && t < 21 && (
          <g transform="translate(60 110)">
            {[{ who: 'Literary Digest, 1936', n: '2,400,000', said: 'Landon wins', ok: false, w: 520 }, { who: 'Gallup, 1936', n: 'about 50,000', said: 'Roosevelt wins', ok: true, w: 140 }].map((r, i) => (
              <g key={r.who} transform={`translate(0 ${i * 150})`} opacity={p(t, 16.3 + i * 1.4, 16.8 + i * 1.4)}>
                <text fontSize={15} fontWeight={900} fill={SC.muted}>{r.who.toUpperCase()}</text>
                <rect y={16} width={lerp(0, r.w, p(t, 16.5 + i * 1.4, 17.5 + i * 1.4))} height={44} rx={10} fill={i ? SC.brand : SC.line} />
                <text x={r.w + 16} y={46} fontSize={20} fontWeight={900} fill={SC.text}>{r.n}</text>
                <text y={92} fontSize={18} fontWeight={900} fill={r.ok ? SC.text : SC.error} opacity={p(t, 18.4 + i * 0.4, 18.9 + i * 0.4)}>{r.said} {r.ok ? '· right' : '· wrong'}</text>
              </g>
            ))}
            <Para x={0} y={310} w={820} h={60} muted>The Digest’s list leaned towards better-off voters, and the people who mailed ballots back chose themselves. Size can’t bring back people who are missing.</Para>
          </g>
        )}

        {t >= 21 && t < 26 && (
          <g transform="translate(80 120)">
            <People t={t} mode="random" />
            <Para x={0} y={220} w={800} h={80} muted>{`Picked at random from every sign-up, June to October, lapsed or not, and sent by SMS and WhatsApp with two reminders. Bolo chooses who; nobody picks themselves.`}</Para>
          </g>
        )}

        {t >= 26 && t < 31 && (
          <g transform="translate(60 100)">
            <text fontSize={13} fontWeight={900} fill={SC.muted}>{`INVITED ${BOLO_FIELD.invites.toLocaleString('en-IN')} · ANSWERED`}</text>
            <text y={70} fontSize={64} fontWeight={900} fill={SC.text}>{answered}</text>
            <text x={150} y={70} fontSize={24} fontWeight={900} fill={SC.muted} opacity={p(t, 28, 28.5)}>{Math.round((BOLO_FIELD.responded / BOLO_FIELD.invites) * 100)}% · ±{mRand.toFixed(1)} points</text>
            {[['Lucknow', 0.38, 0.37], ['Indore', 0.27, 0.28], ['Coimbatore', 0.21, 0.2], ['Patna', 0.14, 0.15]].map(([c, a, b], i) => (
              <g key={c as string} transform={`translate(0 ${120 + i * 50})`} opacity={p(t, 28.6 + i * 0.3, 29.1 + i * 0.3)}>
                <text y={18} fontSize={15} fontWeight={800} fill={SC.text}>{c}</text>
                <rect x={140} width={(a as number) * 900} height={12} rx={4} fill={SC.line} />
                <rect x={140} y={16} width={(b as number) * 900} height={12} rx={4} fill={SC.brand} />
              </g>
            ))}
            <text x={140} y={330} fontSize={13} fontWeight={800} fill={SC.muted} opacity={p(t, 29.6, 30)}>Grey: share of the list · Blue: share of the answers</text>
          </g>
        )}

        {t >= 31 && (
          <g transform="translate(60 110)">
            {[{ label: 'The pop-up', n: POP, m: mPop, ok: false, why: 'Active learners who chose to tap' }, { label: 'The random sample', n: BOLO_FIELD.responded, m: mRand, ok: true, why: 'Everyone who signed up, lapsed or not' }].map((c, i) => (
              <g key={c.label} transform={`translate(${i * 430} 0)`} opacity={p(t, 31.2 + i * 0.8, 31.7 + i * 0.8)}>
                <rect width={400} height={240} rx={18} fill={SC.surface} stroke={c.ok ? SC.mint : SC.line} strokeWidth={c.ok ? 3 : 2} />
                <text x={24} y={40} fontSize={15} fontWeight={900} fill={SC.muted}>{c.label.toUpperCase()}</text>
                <text x={24} y={96} fontSize={48} fontWeight={900} fill={SC.text}>{c.n.toLocaleString('en-IN')}</text>
                <text x={24} y={132} fontSize={17} fontWeight={900} fill={SC.text}>±{c.m.toFixed(1)} points</text>
                <Para x={24} y={150} w={350} h={70} size={14} muted>{c.why}. {c.ok ? 'The margin is honest about what it covers.' : 'A narrow margin around the wrong number.'}</Para>
              </g>
            ))}
            <Pen x={830} y={330} mood="cheer" scale={0.5} />
          </g>
        )}
      </g>
    </svg>
  );
}
