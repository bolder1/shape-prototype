'use client';
// Scene for dc.2-1: Sana's first handoff for Gaadi's "Change your trip" sheet is redlines and hex codes by hand
// (`SANA_FIRST_SPEC`), and Ritesh's Slack questions pile up (`DEV_QUESTIONS`, `BUILD_QUESTIONS`). Dev Mode already
// shows every value with its token (`GAADI_SPEC` `inspect`), so the redlines go; the spec page fills with the sheet's
// states side by side and numbered notes that tick the questions off (`specAnswered`). A 20-minute walkthrough adds the
// ₹50 fee, and the next build has two questions. Pure function of t (0–36).
// Also exports `SOURCE_TONE`, `QUESTION_SHORT` and `MiniSheet` for `spec-write`.
import { BUILD_QUESTIONS, DEV_QUESTIONS, DEV_QUESTION_TEXT, GAADI_SPEC, specAnswered, type DevQuestion, type SpecSource } from '@shape/content';
import { back, clamp, Grid, lerp, p, SC } from './shared';

const W = 960, H = 540;
export const SOURCE_TONE: Record<SpecSource, string> = { note: SC.design, tool: SC.discover, cut: SC.muted };
export const QUESTION_SHORT: Record<DevQuestion, string> = {
  states: 'Loading and errors', edge: 'Sold out, too late', content: 'Long names', responsive: 'Small phones, large text', a11y: 'Screen reader and focus', data: 'Fare and GST',
};
const NOTES = (Object.keys(GAADI_SPEC) as (keyof typeof GAADI_SPEC)[]).filter(k => GAADI_SPEC[k].source === 'note');
const STATES = ['Default', 'Loading', 'Fare check failed', 'Sold out', 'Too late'] as const;

/** The "Change your trip" sheet, drawn small. `state` changes what the fare row and Confirm show. */
export function MiniSheet({ x, y, s = 1, state = 'Default' }: { x: number; y: number; s?: number; state?: (typeof STATES)[number] }) {
  const off = state !== 'Default';
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect width={200} height={300} rx={18} fill={SC.surface} stroke={SC.line} strokeWidth={2} />
      <rect x={84} y={10} width={32} height={5} rx={2.5} fill={SC.line} />
      <text x={16} y={42} fontSize={15} fontWeight={900} fill={SC.text}>Change your trip</text>
      <text x={16} y={62} fontSize={11} fontWeight={700} fill={SC.muted}>Bengaluru → Chennai · Fri 12 Dec</text>
      {[0, 1, 2].map(i => {
        const sold = state === 'Sold out' && i === 1;
        return (
          <g key={i} transform={`translate(16 ${80 + i * 46})`} opacity={state === 'Too late' ? 0.35 : 1}>
            <rect width={168} height={38} rx={8} fill={i === 0 && state !== 'Too late' ? SC.soft : 'none'} stroke={i === 0 && !off ? SC.mint : SC.line} strokeWidth={i === 0 && !off ? 2 : 1} />
            <text x={10} y={16} fontSize={11} fontWeight={800} fill={SC.text}>{['9:30 p.m.', '10:15 p.m.', '11:00 p.m.'][i]}</text>
            <text x={10} y={30} fontSize={10} fontWeight={700} fill={SC.muted}>{['Volvo AC sleeper', 'Sharma Travels', 'KSRTC Airavat'][i]}</text>
            <text x={158} y={24} textAnchor="end" fontSize={11} fontWeight={800} fill={sold ? SC.error : SC.text}>{sold ? 'Sold out' : ['₹180 more', '₹60 more', '₹120 back'][i]}</text>
          </g>
        );
      })}
      <g transform="translate(16 222)">
        {state === 'Loading' ? <rect width={168} height={14} rx={7} fill={SC.line} />
          : state === 'Fare check failed' ? <text x={0} y={11} fontSize={10} fontWeight={800} fill={SC.error}>Couldn’t check the fare · Retry</text>
            : state === 'Too late' ? <text x={0} y={11} fontSize={10} fontWeight={800} fill={SC.text}>Changes close 6 hours before</text>
              : <text x={0} y={11} fontSize={11} fontWeight={800} fill={SC.text}>₹180 more + ₹50 fee</text>}
      </g>
      <rect x={16} y={248} width={168} height={36} rx={10} fill={state === 'Default' || state === 'Sold out' ? '#15803D' : SC.line} />
      <text x={100} y={271} textAnchor="middle" fontSize={13} fontWeight={900} fill={state === 'Default' || state === 'Sold out' ? '#FFFFFF' : SC.muted}>{state === 'Too late' ? 'Cancel instead' : 'Confirm'}</text>
    </g>
  );
}

function Redline({ x1, y1, x2, y2, label, o }: { x1: number; y1: number; x2: number; y2: number; label: string; o: number }) {
  return (
    <g opacity={o}>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={SC.error} strokeWidth={1.5} />
      <rect x={(x1 + x2) / 2 - 22} y={(y1 + y2) / 2 - 9} width={44} height={18} rx={4} fill={SC.surface} stroke={SC.error} strokeWidth={1.5} />
      <text x={(x1 + x2) / 2} y={(y1 + y2) / 2 + 4} textAnchor="middle" fontSize={10} fontWeight={800} fill={SC.error}>{label}</text>
    </g>
  );
}

export function SpecHandoffScene({ t }: { t: number }) {
  const intro = clamp(back(t / 0.6));
  const lines = (1 - p(t, 11.5, 12.5));
  const asked = t < 6 ? 0 : Math.min(BUILD_QUESTIONS.before, Math.round(lerp(0, BUILD_QUESTIONS.before, p(t, 6.2, 10))));
  const noted = NOTES.slice(0, t < 21 ? 0 : Math.min(NOTES.length, Math.floor((t - 21) / 0.7) + 1));
  const answered = specAnswered(noted.map(k => GAADI_SPEC[k]));
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" role="img" aria-label={`Animated story: Sana hands off Gaadi's Change your trip sheet with redlines and hex codes typed by hand, and Ritesh still sends ${BUILD_QUESTIONS.before} questions about states, edge cases and screen readers. Dev Mode already shows every size, colour and font with its token, so the redlines go. Sana draws every state side by side (default, loading, fare check failed, sold out, too late) and writes numbered notes on long names, small screens, the screen reader and the fare, answering all ${DEV_QUESTIONS.length} questions. A 20-minute walkthrough adds the 50 rupee fee, and the next build has ${BUILD_QUESTIONS.after} questions.`}>
      <rect width={W} height={H} fill={SC.soft} />
      <Grid />
      <g opacity={intro}>
        <text x={60} y={60} fontSize={22} fontWeight={900} fill={SC.text}>
          {t < 6 ? 'Every pixel, by hand' : t < 11 ? `${asked} questions in Slack` : t < 16 ? 'Dev Mode already knows' : t < 21 ? 'Every state, side by side' : t < 26 ? 'Numbered notes' : t < 31 ? 'Twenty minutes, before the sprint' : 'Two questions'}
        </text>

        {t < 16 && (
          <g>
            <MiniSheet x={80} y={110} s={1.2} />
            <Redline x1={80} y1={470} x2={99} y2={470} label="24" o={lines * p(t, 0.5, 1)} />
            <Redline x1={60} y1={262} x2={60} y2={274} label="16" o={lines * p(t, 0.9, 1.4)} />
            <Redline x1={99} y1={430} x2={301} y2={430} label="#15803D" o={lines * p(t, 1.3, 1.8)} />
            <Redline x1={300} y1={196} x2={330} y2={196} label="16/24" o={lines * p(t, 1.7, 2.2)} />
            <g transform="translate(80 490)" opacity={lines * p(t, 2.4, 2.9)}>
              <rect width={240} height={30} rx={8} fill={SC.surface} stroke={SC.line} />
              <text x={12} y={20} fontSize={12} fontWeight={800} fill={SC.muted}>Research readout (30 slides) ↗</text>
            </g>
          </g>
        )}

        {t >= 6 && t < 11 && (
          <g transform="translate(420 100)">
            <rect width={480} height={370} rx={16} fill={SC.surface} stroke={SC.line} />
            <text x={20} y={34} fontSize={14} fontWeight={900} fill={SC.text}># gaadi-change-trip</text>
            {DEV_QUESTIONS.map((q, i) => (
              <g key={q} transform={`translate(20 ${56 + i * 50})`} opacity={p(t, 6.3 + i * 0.6, 6.7 + i * 0.6)}>
                <circle cx={14} cy={16} r={14} fill={SC.discover} opacity={0.25} />
                <text x={14} y={21} textAnchor="middle" fontSize={12} fontWeight={900} fill={SC.text}>R</text>
                <text x={38} y={21} fontSize={13} fontWeight={700} fill={SC.text}>{DEV_QUESTION_TEXT[q]}</text>
              </g>
            ))}
          </g>
        )}

        {t >= 11 && t < 16 && (
          <g transform="translate(420 110)" opacity={p(t, 11, 11.6)} fontFamily="ui-monospace, Consolas, monospace">
            <rect width={480} height={260} rx={16} fill="#0F172A" />
            <text x={20} y={34} fontSize={13} fontWeight={800} fill="#93C5FD" fontFamily="inherit">Dev Mode · Change your trip</text>
            {(['padding', 'hex', 'font'] as const).map((k, i) => (
              <g key={k} opacity={p(t, 11.6 + i * 0.6, 12 + i * 0.6)}>
                <text x={20} y={80 + i * 52} fontSize={12} fontWeight={700} fill="#94A3B8">{['Sheet', 'Confirm', 'Bus time'][i]}</text>
                <text x={20} y={100 + i * 52} fontSize={14} fontWeight={700} fill="#E2E8F0">{GAADI_SPEC[k].inspect}</text>
              </g>
            ))}
            <text x={20} y={240} fontSize={12} fontWeight={700} fill="#86EFAC">Exact, with tokens, and never out of date</text>
          </g>
        )}

        {t >= 16 && t < 21 && STATES.map((s, i) => (
          <g key={s} opacity={p(t, 16.2 + i * 0.5, 16.7 + i * 0.5)}>
            <MiniSheet x={60 + i * 172} y={120} s={0.8} state={s} />
            <text x={60 + i * 172 + 80} y={385} textAnchor="middle" fontSize={13} fontWeight={800} fill={SC.text}>{s}</text>
          </g>
        ))}

        {t >= 21 && (
          <g>
            <MiniSheet x={80} y={110} s={1.2} />
            {noted.map((k, i) => (
              <g key={k} transform={`translate(${[300, 300, 72, 300, 72, 300][i]} ${[150, 230, 210, 320, 330, 400][i]})`} opacity={p(t, 21 + i * 0.7, 21.4 + i * 0.7)}>
                <circle r={13} fill={SC.design} opacity={0.3} />
                <circle r={13} fill="none" stroke={SC.design} strokeWidth={2.5} />
                <text y={5} textAnchor="middle" fontSize={13} fontWeight={900} fill={SC.text}>{i + 1}</text>
              </g>
            ))}
            <g transform="translate(420 110)">
              <rect width={480} height={330} rx={16} fill={SC.surface} stroke={SC.line} />
              <text x={20} y={34} fontSize={14} fontWeight={900} fill={SC.text}>Ritesh’s questions</text>
              {DEV_QUESTIONS.map((q, i) => {
                const ok = answered.includes(q);
                return (
                  <g key={q} transform={`translate(20 ${54 + i * 42})`}>
                    <circle cx={12} cy={12} r={11} fill={ok ? SC.mint : 'none'} stroke={ok ? SC.mint : SC.line} strokeWidth={2} />
                    {ok && <path d="M7 12 l3.5 3.5 l6.5 -7" fill="none" stroke={SC.surface} strokeWidth={2.5} strokeLinecap="round" />}
                    <text x={32} y={17} fontSize={14} fontWeight={800} fill={ok ? SC.text : SC.muted}>{ok ? `${i + 1}. ` : ''}{QUESTION_SHORT[q]}</text>
                  </g>
                );
              })}
              {t >= 26 && (
                <g transform="translate(20 316)" opacity={p(t, 27, 27.6)}>
                  <rect y={-24} width={300} height={30} rx={8} fill={SC.soft} stroke={SC.design} strokeWidth={2} />
                  <text x={12} y={-4} fontSize={13} fontWeight={800} fill={SC.text}>+ The ₹50 change fee, its own line</text>
                </g>
              )}
            </g>
            {t >= 26 && t < 31 && (
              <g transform="translate(110 480)" opacity={p(t, 26, 26.5)}>
                {['S', 'R'].map((c, i) => (
                  <g key={c} transform={`translate(${i * 40} 0)`}>
                    <circle r={17} fill={i ? SC.discover : SC.design} opacity={0.3} />
                    <text y={5} textAnchor="middle" fontSize={14} fontWeight={900} fill={SC.text}>{c}</text>
                  </g>
                ))}
                <text x={64} y={5} fontSize={15} fontWeight={800} fill={SC.muted}>Sana walks Ritesh through it: 20 minutes</text>
              </g>
            )}
          </g>
        )}

        {t >= 31 && (
          <g transform="translate(60 508)" opacity={p(t, 31, 31.5)}>
            {[{ n: BUILD_QUESTIONS.before, l: 'Last build' }, { n: BUILD_QUESTIONS.after, l: 'Next build' }].map((b, i) => (
              <g key={b.l} transform={`translate(${i * 420} 0)`}>
                <text x={0} y={0} fontSize={13} fontWeight={800} fill={SC.muted}>{b.l}</text>
                <rect x={110} y={-14} width={Math.max(6, (b.n / BUILD_QUESTIONS.before) * 220 * p(t, 31.3 + i * 0.6, 32.3 + i * 0.6))} height={18} rx={6} fill={i ? SC.mint : SC.error} />
                <text x={110 + Math.max(6, (b.n / BUILD_QUESTIONS.before) * 220) + 10} y={0} fontSize={15} fontWeight={900} fill={SC.text}>{b.n} questions</text>
              </g>
            ))}
          </g>
        )}
      </g>
    </svg>
  );
}
