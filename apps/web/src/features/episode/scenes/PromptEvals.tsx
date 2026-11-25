'use client';
// Scene for dc.3-3: Ask Hisaab's prompt starts as one line (`FIRST_PROMPT`) and fails all ten real test questions
// (`HISAAB_EVALS`, `evalRun`). Meera adds the facts, then limits and the reply's shape (`buildPrompt`), and a rerun
// passes seven; the last three (sums, a staff login, a bill's note giving orders) are fixed in code (`codeChanges`).
// It ends on the prompt and its test set versioned together, rerun on every change and model update. Pure function
// of t (0–36).
// Also exports `PART_TONE` and `CASE_SHORT` for `eval-fix`.
import { FIRST_PROMPT, HISAAB_EVALS, PROMPT_PARTS, buildPrompt, codeChanges, evalRun, type HisaabCase, type PromptPart } from '@shape/content';
import { back, clamp, Grid, p, SC } from './shared';

const W = 960, H = 540;
export const PART_TONE: Record<PromptPart, string> = { context: SC.discover, rules: SC.error, format: SC.design, code: SC.grow };
export const CASE_SHORT: Record<HisaabCase, string> = {
  owe: 'Sharma ji’s balance', most: 'Who owes most', unknown: 'A customer who isn’t there', tax: 'Quarterly GST?', essay: 'Today’s earnings',
  lang: 'Asked in Hindi', tone: 'A payment reminder', month: 'Last month’s sales', staff: 'Staff asks for the bank balance', inject: 'A bill note giving orders',
};
const KEYS = Object.keys(HISAAB_EVALS) as HisaabCase[];
const byPart = (part: PromptPart) => KEYS.filter(k => HISAAB_EVALS[k].fix === part);
const clip = (s: string, n: number) => (s.length > n ? `${s.slice(0, n - 1)}…` : s);

export function PromptEvalsScene({ t }: { t: number }) {
  const intro = clamp(back(t / 0.6));
  const title = t < 6 ? 'One line' : t < 11 ? 'Ten real questions' : t < 16 ? 'Give it the facts' : t < 21 ? 'Limits and shape' : t < 26 ? `${KEYS.length - byPart('code').length} of ${KEYS.length}` : t < 31 ? 'Fix it in code' : `${KEYS.length} of ${KEYS.length}, and again`;
  const fixed: HisaabCase[] = [
    ...(t >= 12 ? byPart('context') : []),
    ...(t >= 16.5 ? byPart('rules') : []),
    ...(t >= 18.5 ? byPart('format') : []),
    ...(t >= 27 ? byPart('code') : []),
  ];
  const run = evalRun(fixed);
  const prompt = buildPrompt(fixed.filter(k => HISAAB_EVALS[k].fix !== 'code')).split('\n').filter(Boolean);
  const code = codeChanges(fixed);
  const showRows = t >= 6;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" role="img" aria-label={`Animated story: Ask Hisaab's instructions are one line, "${FIRST_PROMPT}", and it fails all ${KEYS.length} real test questions from shop owners, even inventing a balance for a customer who doesn't exist. Meera gives it the shop's khata, then adds limits (never guess an amount, tax decisions go to a CA) and the reply's shape (the number first, two lines, the language they asked in, warm reminders). A rerun passes seven. The last three, last month's total, a staff login seeing the bank balance, and a bill's note giving orders, are fixed in code. The prompt and its tests are versioned together and rerun on every change and model update.`}>
      <rect width={W} height={H} fill={SC.soft} />
      <Grid />
      <g opacity={intro}>
        <text x={60} y={60} fontSize={22} fontWeight={900} fill={SC.text}>{title}</text>

        {t < 31 && (
          <g transform="translate(60 90)" fontFamily="ui-monospace, Consolas, monospace">
            <rect width={470} height={t >= 26 ? 270 : 420} rx={16} fill="#0F172A" />
            <text x={18} y={30} fontSize={12} fontWeight={800} fill="#93C5FD" fontFamily="inherit">ask-hisaab.prompt.md</text>
            {prompt.map((l, i) => (
              <text key={`${i}-${l}`} x={18} y={60 + i * 19} fontSize={l.startsWith('##') ? 12 : 11} fontWeight={l.startsWith('##') ? 800 : 600} fontFamily="inherit"
                fill={l.startsWith('##') ? '#FDE68A' : i === 0 ? '#E2E8F0' : '#CBD5E1'}>{clip(l, l.startsWith('##') ? 40 : 62)}</text>
            ))}
            {t < 6 && <rect x={18 + FIRST_PROMPT.length * 6.6} y={48} width={7} height={15} fill="#E2E8F0" opacity={Math.floor(t * 2) % 2} />}
          </g>
        )}

        {t >= 26 && t < 31 && (
          <g transform="translate(60 376)" opacity={p(t, 26.3, 26.9)} fontFamily="ui-monospace, Consolas, monospace">
            <rect width={470} height={140} rx={16} fill={SC.surface} stroke={PART_TONE.code} strokeWidth={2} />
            <text x={18} y={28} fontSize={12} fontWeight={800} fill={SC.text} fontFamily="inherit">In code, not the prompt</text>
            {byPart('code').map((k, i) => (
              <text key={k} x={18} y={56 + i * 26} fontSize={11} fontWeight={700} fill={SC.text} fontFamily="inherit" opacity={code.includes(HISAAB_EVALS[k].line) ? 1 : 0.25}>
                {['✓ Totals added up in code', '✓ Access checked before the model', '✓ Bill text is data; his tap acts'][i]}
              </text>
            ))}
          </g>
        )}

        {showRows && t < 31 && (
          <g transform="translate(560 90)">
            <rect width={340} height={430} rx={16} fill={SC.surface} stroke={SC.line} />
            <text x={18} y={30} fontSize={14} fontWeight={900} fill={SC.text}>Test set</text>
            <text x={322} y={30} textAnchor="end" fontSize={14} fontWeight={900} fill={SC.text}>{run.pass.length} / {KEYS.length} pass</text>
            {KEYS.map((k, i) => {
              const ok = run.pass.includes(k);
              const stuck = t >= 21 && t < 27 && !ok;
              return (
                <g key={k} transform={`translate(18 ${50 + i * 37})`} opacity={p(t, 6.3 + i * 0.25, 6.6 + i * 0.25)}>
                  <rect width={304} height={30} rx={8} fill={stuck ? 'var(--color-bg-error-primary)' : SC.soft} />
                  <circle cx={16} cy={15} r={8} fill={ok ? SC.mint : SC.error} />
                  <text x={32} y={20} fontSize={12} fontWeight={800} fill={SC.text}>{CASE_SHORT[k]}</text>
                  <rect x={262} y={8} width={34} height={14} rx={7} fill={PART_TONE[HISAAB_EVALS[k].fix]} opacity={ok ? 0.9 : 0} />
                </g>
              );
            })}
          </g>
        )}

        {t >= 31 && (
          <g transform="translate(80 120)" opacity={p(t, 31, 31.5)}>
            {[{ v: 'v1', n: 0, l: 'One line' }, { v: 'v2', n: KEYS.length - byPart('code').length, l: 'Facts, limits, shape' }, { v: 'v3', n: KEYS.length, l: 'Plus three fixes in code' }].map((r, i) => (
              <g key={r.v} transform={`translate(0 ${i * 70})`} opacity={p(t, 31.2 + i * 0.6, 31.7 + i * 0.6)}>
                <text y={20} fontSize={18} fontWeight={900} fill={SC.text}>{r.v}</text>
                <text x={50} y={20} fontSize={14} fontWeight={800} fill={SC.muted}>{r.l}</text>
                <rect x={280} y={4} width={Math.max(6, (r.n / KEYS.length) * 380)} height={22} rx={6} fill={r.n === KEYS.length ? SC.mint : r.n ? SC.design : SC.error} />
                <text x={280 + Math.max(6, (r.n / KEYS.length) * 380) + 12} y={21} fontSize={16} fontWeight={900} fill={SC.text}>{r.n}/{KEYS.length}</text>
              </g>
            ))}
            <g transform="translate(0 240)" opacity={p(t, 33.4, 34)}>
              <rect width={720} height={56} rx={14} fill={SC.surface} stroke={SC.brand} strokeWidth={2} />
              <text x={20} y={34} fontSize={16} fontWeight={800} fill={SC.text}>Model updated → rerun all {KEYS.length} before it reaches a single shop</text>
            </g>
            <g transform="translate(0 316)" opacity={p(t, 34, 34.5)}>
              {PROMPT_PARTS.map((part, i) => (
                <g key={part} transform={`translate(${i * 150} 0)`}>
                  <rect width={12} height={12} rx={6} fill={PART_TONE[part]} />
                  <text x={20} y={11} fontSize={13} fontWeight={800} fill={SC.muted}>{{ context: 'Facts', rules: 'Limits', format: 'Shape', code: 'Code' }[part]} · {byPart(part).length}</text>
                </g>
              ))}
            </g>
          </g>
        )}
      </g>
    </svg>
  );
}
