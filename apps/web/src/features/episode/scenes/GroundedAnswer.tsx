'use client';
// Scene for cw.3-3: Taar Assist told Sunita Fibre 100 was ₹799 (from a stale page) and promised a ₹100 credit (from
// nowhere). Then: retrieval feeds generation, the instructions content design writes, the fixed words around every
// answer (`ASSIST_FRAME`), a test set of real questions, the rubric read worst flaw first (`ANSWER_FLAWS`, as
// `answerFlaw` asks them), and fixes made at the cause. Pure function of t (0–36). Also exports `FLAW_FILL` and
// `FLAW_LABEL`, which `answer-crit` uses.
import { ASSIST_FRAME, TAAR_ANSWERS, ungrounded, type AnswerFlaw } from '@shape/content';
import { back, clamp, Grid, lerp, p, SC } from './shared';

const W = 640, H = 360;
/** One fill per verdict; white text on each passes 4.5:1. */
export const FLAW_FILL: Record<AnswerFlaw, string> = { ship: '#067647', invents: '#B42318', tone: '#B54708', handoff: '#175CD3' };
export const FLAW_LABEL: Record<AnswerFlaw, string> = { ship: 'Ship', invents: 'Invents', tone: 'Tone', handoff: 'Handoff' };

/** A chat bubble. `me`: the customer, on the right. */
function Bubble({ y, lines, me, o = 1, mark }: { y: number; lines: string[]; me?: boolean; o?: number; mark?: number }) {
  const w = 440, h = 20 + lines.length * 30;
  const x = me ? W - 32 - w : 32;
  return (
    <g opacity={o}>
      <rect x={x} y={y} width={w} height={h} rx={16} fill={SC.surface} stroke={me ? SC.line : FLAW_FILL.handoff} strokeWidth={2} />
      {lines.map((l, i) => (
        <g key={l}>
          <text x={x + 18} y={y + 34 + i * 30} fontSize={21} fontWeight={700} fill={SC.text}>{l}</text>
          {mark !== undefined && i === mark && <line x1={x + 18} y1={y + 40 + i * 30} x2={x + w - 18} y2={y + 40 + i * 30} stroke={SC.error} strokeWidth={3} />}
        </g>
      ))}
    </g>
  );
}

export function GroundedAnswerScene({ t }: { t: number }) {
  const intro = clamp(back(t / 0.6));
  const title = t < 6 ? 'Assist said ₹799' : t < 11 ? 'It writes from your content' : t < 16 ? 'Write the instructions' : t < 21 ? 'The words around it' : t < 26 ? 'Critique the range' : t < 31 ? 'Worst flaw first' : 'Fix the cause';
  const credit = TAAR_ANSWERS.credit;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" role="img" aria-label={`Animated story: Taar Assist, an AI chatbot, told Sunita that Fibre 100 costs ₹799 and that a ₹100 credit was added to her bill. The price came from a stale help page; the credit came from no source at all. Assist retrieves help articles and then generates an answer, so content design writes what answers are made from: current sources, and instructions that say never to promise credits, dates or refunds no source states and to hand off money, closure and fraud cases to a person. Every answer gets fixed words around it: ${ASSIST_FRAME.join(', ')}. The team builds a test set of 120 real questions and reads each answer worst flaw first: is every claim in a source, is the tone right for the moment, does it hand off when it should. Then they fix the cause, the stale page and the missing rule, and the next answer is right.`}>
      <rect width={W} height={H} fill={SC.soft} />
      <Grid w={W} h={H} />
      <g opacity={intro}>
        <text x={32} y={44} fontSize={26} fontWeight={900} fill={SC.text}>{title}</text>

        {t < 6 && (
          <g>
            <Bubble y={64} me lines={['How much is Fibre 100 now?', 'Do I get money back for yesterday?']} o={p(t, 0.3, 0.9)} />
            <Bubble y={170} lines={['Fibre 100 is ₹799 a month.', 'We’ve added a ₹100 credit to', 'your next bill.']} o={p(t, 1.4, 2)} mark={t > 3.4 ? 0 : undefined} />
            <text x={32} y={330} fontSize={22} fontWeight={900} fill={SC.error} opacity={p(t, 3.8, 4.4)}>Neither is true.</text>
          </g>
        )}

        {t >= 6 && t < 11 && (
          <g>
            {['Articles', 'Retrieve', 'Model', 'Answer'].map((s, i) => (
              <g key={s} opacity={p(t, 6.2 + i * 0.4, 6.8 + i * 0.4)}>
                <rect x={32 + i * 148} y={78} width={132} height={52} rx={10} fill={i === 2 ? FLAW_FILL.handoff : SC.surface} stroke={i === 2 ? 'none' : SC.line} strokeWidth={2} />
                <text x={98 + i * 148} y={111} fontSize={21} fontWeight={800} fill={i === 2 ? '#fff' : SC.text} textAnchor="middle">{s}</text>
              </g>
            ))}
            <g opacity={p(t, 8, 8.6)}>
              <rect x={32} y={166} width={576} height={58} rx={10} fill={SC.surface} stroke={SC.error} strokeWidth={2} />
              <text x={52} y={203} fontSize={21} fontWeight={800} fill={SC.text}>“₹799” ← a stale plans page</text>
            </g>
            <g opacity={p(t, 9, 9.6)}>
              <rect x={32} y={240} width={576} height={58} rx={10} fill={SC.surface} stroke={SC.error} strokeWidth={2} />
              <text x={52} y={277} fontSize={21} fontWeight={800} fill={SC.text}>“₹100 credit” ← no source at all</text>
            </g>
          </g>
        )}

        {t >= 11 && t < 16 && (
          <g>
            <rect x={32} y={64} width={576} height={272} rx={12} fill={SC.surface} stroke={SC.line} strokeWidth={2} />
            {[['Voice', 'plain, warm, answer first'], ['Never', 'credits, dates, refunds no source states'], ['Hand off', 'money, closures, possible fraud'], ['No answer', 'say so, give the next step']].map(([k, v], i) => (
              <g key={k} opacity={p(t, 11.3 + i * 0.7, 11.9 + i * 0.7)}>
                <text x={52} y={110 + i * 60} fontSize={21} fontWeight={900} fill={FLAW_FILL.handoff}>{k}</text>
                <text x={52} y={136 + i * 60} fontSize={21} fontWeight={700} fill={SC.text}>{v}</text>
              </g>
            ))}
          </g>
        )}

        {t >= 16 && t < 21 && (
          <g>
            <text x={32} y={88} fontSize={21} fontWeight={900} fill={FLAW_FILL.handoff} opacity={p(t, 16.3, 16.9)}>{ASSIST_FRAME[0]}</text>
            <rect x={32} y={100} width={576} height={84} rx={14} fill={SC.surface} stroke={SC.line} strokeWidth={2} />
            <text x={52} y={136} fontSize={21} fontWeight={700} fill={SC.text}>Fibre 100 is ₹849 a month,</text>
            <text x={52} y={166} fontSize={21} fontWeight={700} fill={SC.text}>including GST.</text>
            <text x={32} y={216} fontSize={21} fontWeight={800} fill={SC.muted} opacity={p(t, 17, 17.6)} textDecoration="underline">{ASSIST_FRAME[1]}</text>
            <g opacity={p(t, 17.8, 18.4)}>
              <rect x={32} y={238} width={260} height={48} rx={24} fill={FLAW_FILL.handoff} />
              <text x={162} y={269} fontSize={21} fontWeight={800} fill="#fff" textAnchor="middle">{ASSIST_FRAME[2]}</text>
            </g>
            <g opacity={p(t, 18.6, 19.2)}>
              <text x={320} y={269} fontSize={21} fontWeight={800} fill={SC.text}>{ASSIST_FRAME[3]}</text>
              <text x={320} y={310} fontSize={21} fontWeight={800} fill={SC.muted}>Yes · No</text>
            </g>
          </g>
        )}

        {t >= 21 && t < 26 && (
          <g>
            {Array.from({ length: 120 }, (_, i) => {
              const col = i % 20, row = Math.floor(i / 20);
              const kind = i % 10 < 6 ? 0 : i % 10 < 8 ? 1 : i % 10 < 9 ? 2 : 3;
              const fill = [SC.muted, FLAW_FILL.tone, FLAW_FILL.handoff, FLAW_FILL.invents][kind];
              return <circle key={i} cx={46 + col * 28} cy={80 + row * 28} r={10} fill={fill} opacity={p(t, 21.2 + i * 0.02, 21.6 + i * 0.02)} />;
            })}
            {['Routine', 'Angry', 'Risky', 'No answer'].map((s, i) => (
              <g key={s} opacity={p(t, 24, 24.6)}>
                <circle cx={46 + i * 148} cy={268} r={10} fill={[SC.muted, FLAW_FILL.tone, FLAW_FILL.handoff, FLAW_FILL.invents][i]} />
                <text x={64 + i * 148} y={275} fontSize={21} fontWeight={800} fill={SC.text}>{s}</text>
              </g>
            ))}
            <text x={32} y={326} fontSize={21} fontWeight={700} fill={SC.muted} opacity={p(t, 24.4, 25)}>120 real questions from support logs</text>
          </g>
        )}

        {t >= 26 && t < 31 && (
          <g>
            <text x={32} y={86} fontSize={21} fontWeight={800} fill={SC.muted}>“{credit.question.slice(0, 40)}…”</text>
            {[['Every claim in a source?', ungrounded(credit).length === 0], ['Tone right for the moment?', true], ['Hands off when needed?', true]].map(([q, ok], i) => {
              const o = p(t, 26.4 + i * 0.9, 27 + i * 0.9);
              return (
                <g key={q as string} opacity={o}>
                  <rect x={32} y={104 + i * 60} width={576} height={48} rx={10} fill={SC.surface} stroke={i === 0 ? FLAW_FILL.invents : SC.line} strokeWidth={2} />
                  <text x={52} y={135 + i * 60} fontSize={21} fontWeight={800} fill={SC.text}>{i + 1}. {q}</text>
                  <text x={588} y={135 + i * 60} fontSize={21} fontWeight={900} fill={ok ? FLAW_FILL.ship : FLAW_FILL.invents} textAnchor="end">{ok ? 'Yes' : 'No'}</text>
                </g>
              );
            })}
            <g opacity={p(t, 29.4, 30)}>
              <rect x={32} y={292} width={180} height={44} rx={22} fill={FLAW_FILL.invents} />
              <text x={122} y={321} fontSize={21} fontWeight={900} fill="#fff" textAnchor="middle">Invents</text>
              <text x={232} y={321} fontSize={21} fontWeight={700} fill={SC.muted}>stop at the first failure</text>
            </g>
          </g>
        )}

        {t >= 31 && (() => {
          const run = Math.round(lerp(0, 120, p(t, 32.4, 34)));
          return (
            <g>
              {['Plans page: ₹799 → ₹849', 'Rule: no credit without a source', `Rerun: ${run} of 120 answers`].map((s, i) => (
                <g key={i} opacity={p(t, 31.2 + i * 0.5, 31.8 + i * 0.5)}>
                  <rect x={32} y={70 + i * 54} width={576} height={44} rx={10} fill={SC.surface} stroke={FLAW_FILL.ship} strokeWidth={2} />
                  <text x={52} y={99 + i * 54} fontSize={21} fontWeight={800} fill={SC.text}>{s}</text>
                </g>
              ))}
              <Bubble y={242} lines={['Fibre 100 is ₹849. Billing decides', 'outage credits within 7 days.']} o={p(t, 34.2, 34.8)} />
            </g>
          );
        })()}
      </g>
    </svg>
  );
}
