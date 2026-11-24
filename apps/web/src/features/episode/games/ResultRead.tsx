'use client';
// Mini-game for gr.3-3: each card is a test readout from Tokri (its `visual`, a key of `TOKRI_RESULTS`): the raw
// counts for A and B, the planned sample a version, a guardrail if there is one, and how many slices were looked at
// for a claim about one slice. Make the call: ship, no clear effect, don't ship, or fix the test first. The right call
// is `readCall`. After a pick the analyst's checklist opens: the split (`srmP`), the sample against plan, the p-value
// against its threshold, the guardrail, and the difference drawn as a 95% confidence interval (`twoProp`). A wrong
// first pick is marked and the card comes back later. First try scores.
import { useState } from 'react';
import { motion } from 'motion/react';
import { CheckIcon, XIcon } from '@phosphor-icons/react/ssr';
import { READ_ALPHA, READ_CALLS, SRM_ALPHA, TOKRI_RESULTS, readCall, srmP, twoProp, type Episode, type ReadCall, type TestRead, type TokriResult } from '@shape/content';
import { springs } from '@shape/ui';
import { Button } from '@/components/base/buttons/button';
import { cx } from '@/utils/cx';
import { Burst, NibSays, StageTitle } from '../kit';
import type { GameResult } from './DiamondSort';
import { play } from '@/lib/sound';

type Game = Episode['game'];
/** One fill per call; white text on each passes 4.5:1. */
const CALL_FILL: Record<ReadCall, string> = { ship: '#067647', flat: '#475467', harm: '#B42318', distrust: '#6941C6' };
const n = (x: number) => x.toLocaleString('en-IN');
const pct = (x: number) => `${(x * 100).toFixed(2)}%`;
const pts = (x: number) => `${x >= 0 ? '+' : '−'}${Math.abs(x * 100).toFixed(2)}`;
const pv = (p: number) => (p < 0.001 ? '< 0.001' : p.toFixed(p < 0.01 ? 4 : 3));

/** The difference B − A as a dot on a line with its 95% range, against zero. */
function Interval({ diff, ci }: { diff: number; ci: readonly [number, number] }) {
  const lo = Math.min(-0.01, ci[0]), hi = Math.max(0.01, ci[1]), span = hi - lo;
  const x = (v: number) => `${((v - lo) / span) * 100}%`;
  const fill = ci[0] > 0 ? '#067647' : ci[1] < 0 ? '#B42318' : '#475467';
  return (
    <div className="flex flex-col gap-1">
      <div className="relative h-10">
        <div className="absolute inset-x-0 top-1/2 h-0.5 -translate-y-1/2 bg-quaternary" />
        <div className="absolute top-1 bottom-1 w-0.5 bg-fg-primary" style={{ left: x(0) }} aria-hidden />
        <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={springs.pop} className="absolute top-1/2 h-4 -translate-y-1/2 rounded-full opacity-40"
          style={{ left: x(ci[0]), width: `${((ci[1] - ci[0]) / span) * 100}%`, background: fill }} />
        <div className="absolute top-1/2 size-4 -translate-x-1/2 -translate-y-1/2 rounded-full" style={{ left: x(diff), background: fill }} />
      </div>
      <div className="flex justify-between text-xs font-semibold text-tertiary tabular-nums">
        <span>{pts(ci[0])}</span><span>B − A: {pts(diff)} points</span><span>{pts(ci[1])}</span>
      </div>
    </div>
  );
}

function Check({ ok, children }: { ok: boolean; children: React.ReactNode }) {
  const Icon = ok ? CheckIcon : XIcon;
  return (
    <li className="flex items-start gap-2 text-sm text-secondary">
      <span className={cx('mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full text-white', ok ? 'bg-mint-600' : 'bg-error-solid')}><Icon className="size-3" weight="bold" aria-hidden /></span>
      <span>{children}</span>
    </li>
  );
}

function Readout({ r, open }: { r: TestRead; open: boolean }) {
  const t = twoProp(r.a, r.b), split = srmP(r.a.n, r.b.n), alpha = READ_ALPHA / (r.slices ?? 1);
  const g = r.guard ? twoProp(r.guard.a, r.guard.b) : null;
  const full = r.a.n >= r.planned && r.b.n >= r.planned;
  return (
    <div className="flex flex-col gap-3">
      <table className="w-full border-separate border-spacing-y-1 text-sm tabular-nums">
        <thead><tr className="text-xs text-tertiary"><th className="text-left font-semibold">Version</th><th className="text-right font-semibold">People</th><th className="text-right font-semibold">{r.metric}</th>{r.guard && <th className="text-right font-semibold">{r.guard.name}</th>}</tr></thead>
        <tbody>
          {(['a', 'b'] as const).map(v => (
            <tr key={v} className="bg-secondary">
              <th className="rounded-l-lg px-2 py-1.5 text-left font-semibold text-primary">{v === 'a' ? 'A, today' : 'B, the change'}</th>
              <td className="px-2 text-right text-primary">{n(r[v].n)}</td>
              <td className={cx('px-2 text-right font-semibold text-primary', !r.guard && 'rounded-r-lg')}>{n(r[v].x)} · {pct(t[v === 'a' ? 'pa' : 'pb'])}</td>
              {r.guard && <td className="rounded-r-lg px-2 text-right text-primary">{n(r.guard[v].x)} of {n(r.guard[v].n)} · {pct(r.guard[v].x / r.guard[v].n)}</td>}
            </tr>
          ))}
        </tbody>
      </table>
      <p className="text-xs font-semibold text-tertiary">Planned: {n(r.planned)} a version{r.slices ? ` · this is 1 of ${r.slices} slices looked at after the test` : ''}</p>
      {open && (
        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={springs.pop} className="flex flex-col gap-3">
          <ul className="flex flex-col gap-1.5">
            <Check ok={split >= SRM_ALPHA}>Split: p = {pv(split)} for a 50/50 split{split < SRM_ALPHA ? ', below 0.001, so the split is broken' : ', as expected'}.</Check>
            {!r.slices && <Check ok={full}>Sample: {full ? 'ran to its plan' : `${Math.round((Math.min(r.a.n, r.b.n) / r.planned) * 100)}% of the planned sample, stopped early`}.</Check>}
            <Check ok={t.p < alpha}>Significance: p = {pv(t.p)} against {r.slices ? `0.05 ÷ ${r.slices} = ${alpha}` : '0.05'}.</Check>
            {g && r.guard && <Check ok={!(g.p < READ_ALPHA && g.diff > 0)}>{r.guard.name}: {pts(g.diff)} points, p = {pv(g.p)}{g.p < READ_ALPHA && g.diff > 0 ? ', significantly worse' : ', no significant harm'}.</Check>}
          </ul>
          <Interval diff={t.diff} ci={t.ci} />
        </motion.div>
      )}
    </div>
  );
}

export function ResultRead({ game, onDone }: { game: Game; onDone: (results: GameResult[]) => void }) {
  const [deck, setDeck] = useState(game.cards);
  const [results, setResults] = useState<Record<string, boolean>>({});
  const [chose, setChose] = useState<ReadCall | null>(null);
  const card = deck[0];

  if (!card) {
    const right = Object.values(results).filter(Boolean).length;
    return (
      <div className="relative flex flex-col items-center gap-5 py-6 text-center">
        <Burst count={36} />
        <StageTitle eyebrow="Tokri’s results, read" title={`${right} of ${game.cards.length} calls right first time`}>
          Check the split, the sample and the guardrail before the winner. Then read the range, not just the p-value.
        </StageTitle>
        <NibSays mood={right === game.cards.length ? 'cheer' : 'idle'}>Write the reading rules down before the test starts: when it ends, the split check, the one metric that decides, and what you’ll do if it’s flat.</NibSays>
        <Button size="xl" onPress={() => onDone(game.cards.map(c => ({ id: c.id, correct: !!results[c.id] })))}>Continue the story</Button>
      </div>
    );
  }

  const r = TOKRI_RESULTS[card.visual as TokriResult] as TestRead;
  const right = card.lane as ReadCall, ok = chose === right;
  const lane = game.lanes.find(l => l.id === right)!;
  const done = game.cards.length - deck.length;
  const why = readCall(r).why;

  const choose = (c: ReadCall) => {
    if (chose) return;
    play(c === right ? 'correct' : 'wrong');
    setResults(x => (card.id in x ? x : { ...x, [card.id]: c === right }));
    setChose(c);
  };
  const next = () => { setChose(null); setDeck(d => (ok ? d.slice(1) : [...d.slice(1), d[0]])); };

  return (
    <div className="flex flex-col gap-5">
      <StageTitle eyebrow="Play" title={game.title}>{game.instructions}</StageTitle>
      <div className="flex items-baseline justify-between">
        <span className="text-sm font-semibold text-tertiary">{chose ? 'The analyst’s checklist' : 'What’s the call?'}</span>
        <span className="text-sm font-semibold text-tertiary tabular-nums">{done} / {game.cards.length}</span>
      </div>
      <motion.div key={`${card.id}-${deck.length}`} initial={{ y: -14, opacity: 0 }} animate={chose && !ok ? { x: [0, -10, 10, -6, 6, 0], opacity: 1 } : { y: 0, opacity: 1 }} transition={chose && !ok ? { duration: 0.4 } : springs.pop}
        className={cx('flex flex-col gap-3 rounded-2xl bg-primary p-4 shadow-lg ring-2 ring-inset', chose ? (ok ? 'ring-mint-600' : 'ring-error') : 'ring-secondary')} data-current-card>
        <p className="text-lg font-semibold text-primary">{card.label}</p>
        <Readout r={r} open={!!chose} />
      </motion.div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4" role="group" aria-label="Calls">
        {READ_CALLS.map(c => {
          const l = game.lanes.find(x => x.id === c);
          return (
            <motion.button key={c} type="button" onClick={() => choose(c)} disabled={!!chose} whileTap={{ scale: 0.97 }} aria-pressed={chose === c}
              className={cx('flex flex-col items-start gap-1 rounded-2xl border-2 bg-secondary p-3 text-left transition enabled:hover:bg-secondary_hover disabled:cursor-default',
                chose && c === right ? 'border-mint-600' : chose === c ? 'border-error' : 'border-transparent')}>
              <span className="rounded-full px-2.5 py-0.5 text-xs font-bold text-white" style={{ background: CALL_FILL[c] }}>{l?.label}</span>
              {l && <span className="text-[11px] leading-tight text-tertiary">{l.hint}</span>}
            </motion.button>
          );
        })}
      </div>
      <div className="min-h-14" aria-live="polite">
        {chose && (
          <div className="flex flex-col gap-3">
            <NibSays mood={ok ? 'cheer' : 'sad'}>{ok ? '' : `The call is ${lane.label.toLowerCase()}${why === 'srm' ? ': the split is broken' : why === 'early' ? ': it stopped early' : why === 'fishing' ? ': a slice found by looking' : why === 'guardrail' ? ': a guardrail got worse' : ''}. `}{card.note}</NibSays>
            <div className="flex justify-end"><Button size="lg" onPress={next}>{!ok ? 'It’ll come back round' : deck.length > 1 ? 'Next readout' : 'See how you did'}</Button></div>
          </div>
        )}
      </div>
    </div>
  );
}
