'use client';
// Scene for dc.4-3: Nandini gives Chakki's substitution ticket to a coding agent. The brief (goal, files, components,
// scope, proof), a plan corrected before any code (date-fns, not moment), all checks green across 34 files, the diff
// read anyway (a deleted test, a 30-file rename and a silenced lint rule, reverted), two conventions written into
// AGENTS.md, and the checks only a person can do on a real phone before merging. Pure function of t
// (0–36). Also exports `REVIEW_FILL`, which `agent-review` uses.
import { CHAKKI_CHANGES, type ReviewCall } from '@shape/content';
import { back, clamp, Grid, lerp, p, SC } from './shared';

const W = 640, H = 360;
/** One fill per review call; white text on each passes 4.5:1. */
export const REVIEW_FILL: Record<ReviewCall, string> = { keep: '#067647', verify: '#175CD3', rules: '#B54708', revert: '#B42318' };
/** The two conventions the agent broke, shortened to fit the scene (the full lines are in `CHAKKI_CHANGES`). */
const RULES = ['Colours come from tokens. Never hex.', 'Sheets come from @chakki/ui.'];
const MONO = 'ui-monospace, monospace';

export function AgentLoopScene({ t }: { t: number }) {
  const intro = clamp(back(t / 0.6));
  const title = t < 6 ? 'A ticket' : t < 11 ? 'Brief it like a teammate' : t < 16 ? 'Plan first' : t < 21 ? 'All green' : t < 26 ? 'Read the diff' : t < 31 ? 'Write the rule down' : 'Eyes on a phone';

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" role="img" aria-label={`Animated story: Chakki’s ticket says that if an item is out of stock, the customer chooses: replace with similar, call me, or refund. Nandini briefs a coding agent like a teammate: the goal, the files to read, the components to use, what is out of scope and how to prove it is done. She asks for a plan first and changes moment to date-fns before any code. The agent’s type check, tests and lint all pass across 34 files. She reads the diff anyway and reverts a deleted test, a rename across 30 files and a silenced lint rule. Two conventions it broke go into AGENTS.md: ${RULES.join(' ')} Then she checks on a real phone what no test can: how the selection feels, what TalkBack says, and Gujarati labels at 320 pixels. Then she merges.`}>
      <rect width={W} height={H} fill={SC.soft} />
      <Grid w={W} h={H} />
      <g opacity={intro}>
        <text x={32} y={44} fontSize={26} fontWeight={900} fill={SC.text}>{title}</text>

        {t < 6 && (
          <g opacity={p(t, 0.3, 1)}>
            <rect x={32} y={72} width={576} height={220} rx={16} fill={SC.surface} stroke={SC.line} strokeWidth={2} />
            <text x={56} y={110} fontSize={21} fontWeight={800} fill={SC.muted}>CHK-412 · Out of stock</text>
            <text x={56} y={150} fontSize={22} fontWeight={900} fill={SC.text}>If an item is out of stock, let</text>
            <text x={56} y={180} fontSize={22} fontWeight={900} fill={SC.text}>the customer choose:</text>
            {(['Replace with similar', 'Call me', 'Refund'] as const).map((o, i) => (
              <g key={o} opacity={p(t, 1.6 + i * 0.5, 2.1 + i * 0.5)}>
                <circle cx={68} cy={214 + i * 28} r={9} fill="none" stroke={SC.text} strokeWidth={3} />
                {i === 0 && <circle cx={68} cy={214} r={4} fill={SC.text} />}
                <text x={88} y={221 + i * 28} fontSize={21} fontWeight={800} fill={SC.text}>{o}</text>
              </g>
            ))}
            <text x={32} y={330} fontSize={21} fontWeight={800} fill={SC.muted} opacity={p(t, 4, 4.6)}>Nandini hands it to a coding agent.</text>
          </g>
        )}

        {t >= 6 && t < 11 && (
          <g>
            {([
              ['Goal', 'Customers choose a substitution'],
              ['Read', 'cart/, order.ts, the Figma states'],
              ['Use', 'RadioGroup and Sheet from @chakki/ui'],
              ['Not', 'checkout, or anything else'],
              ['Done', 'lock tests pass, none skipped'],
            ] as const).map(([k, v], i) => (
              <g key={k} opacity={p(t, 6.3 + i * 0.6, 6.8 + i * 0.6)}>
                <rect x={32} y={70 + i * 52} width={80} height={40} rx={8} fill={REVIEW_FILL.verify} />
                <text x={72} y={97 + i * 52} fontSize={21} fontWeight={900} fill="#fff" textAnchor="middle">{k}</text>
                <text x={128} y={97 + i * 52} fontSize={21} fontWeight={800} fill={SC.text}>{v}</text>
              </g>
            ))}
          </g>
        )}

        {t >= 11 && t < 16 && (() => {
          const strike = p(t, 12.6, 13.4);
          return (
            <g>
              <text x={32} y={88} fontSize={21} fontWeight={800} fill={SC.muted}>The agent’s plan</text>
              {([
                '1. Add substitution to the Order type',
                '2. canChange(order, now), with tests',
                '3. Format times with moment',
                '4. Build the picker in a Sheet',
              ] as const).map((s, i) => (
                <text key={s} x={32} y={130 + i * 42} fontSize={21} fontWeight={800} fill={i === 2 && strike > 0.5 ? SC.muted : SC.text}>{s}</text>
              ))}
              <line x1={32} y1={208} x2={lerp(32, 360, strike)} y2={208} stroke={SC.error} strokeWidth={3} />
              <text x={380} y={214} fontSize={21} fontWeight={900} fill={REVIEW_FILL.keep} opacity={p(t, 13.4, 14)}>date-fns</text>
              <text x={32} y={318} fontSize={21} fontWeight={800} fill={SC.text} opacity={p(t, 14.2, 14.8)}>Fixing a plan is cheaper than fixing 34 files.</text>
            </g>
          );
        })()}

        {t >= 16 && t < 21 && (
          <g>
            {(['Type check', 'Tests', 'Lint'] as const).map((c, i) => (
              <g key={c} opacity={p(t, 16.3 + i * 0.6, 16.8 + i * 0.6)}>
                <rect x={32 + i * 196} y={80} width={180} height={64} rx={12} fill={REVIEW_FILL.keep} />
                <text x={122 + i * 196} y={120} fontSize={22} fontWeight={900} fill="#fff" textAnchor="middle">{c} ✓</text>
              </g>
            ))}
            <text x={32} y={200} fontSize={22} fontWeight={900} fill={SC.text} opacity={p(t, 18.2, 18.8)}>34 files changed. “All tests pass.”</text>
            <text x={32} y={240} fontSize={21} fontWeight={800} fill={SC.muted} opacity={p(t, 19, 19.6)}>Which tests, though?</text>
          </g>
        )}

        {t >= 21 && t < 26 && (
          <g>
            {([
              ['deleted', '− packing-cutoff.test.ts'],
              ['rename', 'ProductCard → ItemTile, 30 files'],
              ['lint', '// eslint-disable-next-line'],
            ] as const).map(([k, line], i) => {
              const stamp = p(t, 22.6 + i * 0.8, 23 + i * 0.8);
              return (
                <g key={k} opacity={p(t, 21.3 + i * 0.4, 21.7 + i * 0.4)}>
                  <rect x={32} y={74 + i * 74} width={576} height={58} rx={10} fill={SC.surface} stroke={SC.line} strokeWidth={2} />
                  <text x={52} y={110 + i * 74} fontSize={21} fontWeight={800} fill={SC.text} fontFamily={MONO}>{line}</text>
                  <g opacity={stamp}>
                    <rect x={470} y={88 + i * 74} width={124} height={30} rx={8} fill={REVIEW_FILL.revert} />
                    <text x={532} y={110 + i * 74} fontSize={21} fontWeight={900} fill="#fff" textAnchor="middle">Reverted</text>
                  </g>
                  <title>{CHAKKI_CHANGES[k].short}</title>
                </g>
              );
            })}
            <text x={32} y={320} fontSize={21} fontWeight={800} fill={SC.text} opacity={p(t, 25, 25.6)}>Not asked for, or weakens the checks.</text>
          </g>
        )}

        {t >= 26 && t < 31 && (
          <g>
            <rect x={32} y={70} width={576} height={190} rx={14} fill="#101828" />
            <text x={52} y={106} fontSize={21} fontWeight={800} fill="#98A2B3" fontFamily={MONO}># AGENTS.md</text>
            {RULES.map((r, i) => (
              <text key={r} x={52} y={148 + i * 40} fontSize={21} fontWeight={800} fill="#F2F4F7" opacity={p(t, 26.6 + i * 1, 27.2 + i * 1)}>- {r}</text>
            ))}
            <text x={32} y={300} fontSize={21} fontWeight={800} fill={SC.text} opacity={p(t, 28.8, 29.4)}>The agent redoes them, and won’t repeat them.</text>
          </g>
        )}

        {t >= 31 && (
          <g>
            <rect x={32} y={64} width={150} height={270} rx={22} fill={SC.surface} stroke={SC.text} strokeWidth={3} />
            <rect x={46} y={90} width={122} height={30} rx={6} fill={REVIEW_FILL.verify} opacity={0.9} />
            <rect x={46} y={130} width={122} height={30} rx={6} fill={SC.line} />
            <rect x={46} y={170} width={122} height={30} rx={6} fill={SC.line} />
            {(['How the ring feels', 'What TalkBack says', 'Gujarati at 320 px'] as const).map((c, i) => (
              <g key={c} opacity={p(t, 31.4 + i * 0.7, 31.9 + i * 0.7)}>
                <circle cx={222} cy={102 + i * 56} r={14} fill={REVIEW_FILL.verify} />
                <text x={222} y={109 + i * 56} fontSize={18} fontWeight={900} fill="#fff" textAnchor="middle">✓</text>
                <text x={248} y={110 + i * 56} fontSize={21} fontWeight={800} fill={SC.text}>{c}</text>
              </g>
            ))}
            <g opacity={p(t, 33.6, 34.2)}>
              <rect x={210} y={270} width={160} height={50} rx={12} fill={REVIEW_FILL.keep} />
              <text x={290} y={303} fontSize={22} fontWeight={900} fill="#fff" textAnchor="middle">Merged</text>
            </g>
          </g>
        )}
      </g>
    </svg>
  );
}
