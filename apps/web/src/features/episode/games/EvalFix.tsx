'use client';
// Mini-game for dc.3-3: fix the failing answers. Every card is a test question for Ask Hisaab and what the one-line
// prompt replied (its `visual`, a key of `HISAAB_EVALS`), drawn as a chat on a phone. Decide where the fix goes
// (`PROMPT_PARTS`): give the model the facts, set a limit, shape the reply, or fix it in code. A right call writes the
// line into the prompt file (`buildPrompt`) or the code changes (`codeChanges`), and the test results (`evalRun`) turn
// that row green. A miss explains and the card comes back later; first call scores. The end shows the whole prompt,
// the code changes, and ten of ten.
import { useState } from 'react';
import { motion } from 'motion/react';
import { HISAAB_EVALS, buildPrompt, codeChanges, evalRun, type Episode, type HisaabCase, type PromptPart } from '@shape/content';
import { springs } from '@shape/ui';
import { Button } from '@/components/base/buttons/button';
import { cx } from '@/utils/cx';
import { Burst, NibSays, StageTitle } from '../kit';
import { CASE_SHORT, PART_TONE } from '../scenes/PromptEvals';
import type { GameResult } from './DiamondSort';
import { play } from '@/lib/sound';

type Game = Episode['game'];
const KEYS = Object.keys(HISAAB_EVALS) as HisaabCase[];

function Workbench({ fixed, hot }: { fixed: HisaabCase[]; hot?: HisaabCase }) {
  const run = evalRun(fixed);
  const prompt = buildPrompt(fixed).split('\n').filter(Boolean);
  const code = codeChanges(fixed);
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-1 rounded-2xl bg-gray-900 p-4 font-mono text-xs text-gray-200">
        <span className="font-sans text-xs font-bold text-blue-300">ask-hisaab.prompt.md</span>
        {prompt.map((l, i) => (
          <motion.span key={`${i}-${l.slice(0, 24)}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className={cx(l.startsWith('##') ? 'pt-1.5 font-bold text-yellow-200' : 'text-gray-200', hot && l.includes(HISAAB_EVALS[hot].line) && 'text-white')}>
            {l}
          </motion.span>
        ))}
      </div>
      <div className="flex flex-col gap-1.5 rounded-2xl bg-secondary p-3">
        <span className="flex items-center gap-1.5 text-sm font-bold text-primary"><span className="size-2.5 rounded-full" style={{ background: PART_TONE.code }} aria-hidden />In code, not the prompt</span>
        {code.length === 0 && <span className="text-xs text-quaternary">Guarantees a prompt can’t give go here.</span>}
        {code.map(l => <motion.span key={l} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} className="rounded-lg bg-primary px-2.5 py-1.5 text-xs font-medium text-primary ring-1 ring-inset ring-secondary">{l}</motion.span>)}
      </div>
      <div className="flex flex-col gap-1.5 rounded-2xl bg-secondary p-3" role="status">
        <span className="text-sm font-bold text-primary">Test set · {run.pass.length} of {KEYS.length} pass</span>
        <ul className="grid grid-cols-1 gap-1 sm:grid-cols-2">
          {KEYS.map(k => {
            const ok = run.pass.includes(k);
            return (
              <li key={k} className={cx('flex items-center gap-1.5 text-xs font-semibold', ok ? 'text-primary' : 'text-tertiary')}>
                <span className={cx('size-2.5 shrink-0 rounded-full', ok ? 'bg-mint-600' : 'bg-error-solid')} aria-hidden />
                {CASE_SHORT[k]}<span className="sr-only">{ok ? ', passes' : ', fails'}</span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

export function EvalFix({ game, onDone }: { game: Game; onDone: (results: GameResult[]) => void }) {
  const [deck, setDeck] = useState(game.cards);
  const [results, setResults] = useState<Record<string, boolean>>({});
  const [fixed, setFixed] = useState<HisaabCase[]>([]);
  const [miss, setMiss] = useState<string | null>(null);
  const [right, setRight] = useState(false);
  const card = deck[0];

  if (!card) {
    const n = Object.values(results).filter(Boolean).length;
    return (
      <div className="relative flex flex-col gap-5 py-6">
        <Burst count={36} />
        <StageTitle eyebrow="All tests pass" title={`${n} of ${game.cards.length} fixed first time`}>
          The prompt gives the facts, sets the limits and shapes the reply. Sums, access and bill text are handled in code, where they can be guaranteed.
        </StageTitle>
        <Workbench fixed={fixed} />
        <NibSays mood={n === game.cards.length ? 'cheer' : 'idle'}>Keep the prompt and its test set together, and rerun every case after any change and whenever the model is updated. A fix for one answer can quietly break another.</NibSays>
        <Button size="xl" onPress={() => onDone(game.cards.map(c => ({ id: c.id, correct: !!results[c.id] })))}>Continue the story</Button>
      </div>
    );
  }

  const k = card.visual as HisaabCase;
  const e = HISAAB_EVALS[k];
  const owner = game.lanes.find(l => l.id === e.fix)!;
  const done = game.cards.length - deck.length;
  const call = (laneId: string) => {
    if (miss || right) return;
    const ok = laneId === e.fix;
    play(ok ? 'correct' : 'wrong');
    setResults(r => (card.id in r ? r : { ...r, [card.id]: ok }));
    if (ok) { setRight(true); setFixed(fs => [...fs, k]); }
    else { setMiss(laneId); setTimeout(() => { setMiss(null); setDeck(d => [...d.slice(1), d[0]]); }, 3200); }
  };
  const next = () => { setRight(false); setDeck(d => d.slice(1)); };

  return (
    <div className="flex flex-col gap-5">
      <StageTitle eyebrow="Play" title={game.title}>{game.instructions}</StageTitle>
      <div className="grid gap-5 md:grid-cols-[1fr_minmax(0,24rem)]">
        <div className="flex flex-col gap-4">
          <div className="flex items-baseline justify-between">
            <span className="text-sm font-semibold text-tertiary">A failing test · {CASE_SHORT[k]}</span>
            <span className="text-sm font-semibold text-tertiary tabular-nums">{done} / {game.cards.length}</span>
          </div>
          <motion.div key={`${card.id}-${deck.length}`} initial={{ y: 24, opacity: 0 }} animate={miss ? { x: [0, -10, 10, -6, 6, 0], y: 0, opacity: 1 } : { y: 0, opacity: 1 }} transition={miss ? { duration: 0.4 } : springs.pop}
            className={cx('flex flex-col gap-2.5 rounded-2xl bg-secondary p-4 shadow-lg ring-2 ring-inset', miss ? 'ring-error' : right ? 'ring-mint-600' : 'ring-secondary')} data-current-card>
            <span className="sr-only">{card.label}</span>
            <span className="max-w-[85%] self-end rounded-2xl rounded-br-md bg-primary px-4 py-2.5 text-md font-semibold text-primary shadow-xs ring-1 ring-inset ring-secondary" aria-hidden>{e.ask}</span>
            <span className={cx('max-w-[85%] self-start rounded-2xl rounded-bl-md px-4 py-2.5 text-md font-medium ring-2 ring-inset', right ? 'bg-primary text-tertiary line-through ring-secondary' : 'bg-primary text-primary ring-error')} aria-hidden>{e.bad}</span>
            <span className={cx('self-start text-xs font-semibold', right ? 'text-success-primary' : 'text-error-primary')} aria-hidden>{right ? 'Fixed: passes' : 'Fails the test'}</span>
          </motion.div>
          <div className="grid gap-2 sm:grid-cols-2" role="group" aria-label="Where the fix goes">
            {game.lanes.map(l => (
              <motion.button key={l.id} type="button" onClick={() => call(l.id)} disabled={!!miss || right} whileTap={{ scale: 0.97 }}
                className={cx('flex flex-col items-start gap-0.5 rounded-xl border-2 bg-primary px-3 py-2.5 text-left transition enabled:hover:bg-primary_hover disabled:cursor-default',
                  right && l.id === e.fix ? 'border-mint-600' : miss === l.id ? 'border-error' : miss && l.id === e.fix ? 'border-mint-600' : 'border-secondary')}>
                <span className="flex items-center gap-1.5 text-md font-bold text-primary"><span className="size-2.5 rounded-full" style={{ background: PART_TONE[l.id as PromptPart] }} aria-hidden />{l.label}</span>
                <span className="text-xs font-medium text-tertiary">{l.hint}</span>
              </motion.button>
            ))}
          </div>
          <div className="min-h-14" aria-live="polite">
            {miss && <NibSays mood="sad">Not quite: <strong>{owner.label.toLowerCase()}</strong>. {card.note} It’ll come back round.</NibSays>}
            {right && (
              <div className="flex flex-col gap-3">
                <NibSays mood="cheer">{card.note}</NibSays>
                <div className="flex justify-end"><Button size="lg" onPress={next}>{deck.length > 1 ? 'Next test' : 'Rerun everything'}</Button></div>
              </div>
            )}
            {!miss && !right && <NibSays mood="think">Was it missing facts, missing a limit, or the wrong shape? Or is this something no prompt can guarantee?</NibSays>}
          </div>
        </div>
        <Workbench fixed={fixed} hot={right ? k : undefined} />
      </div>
    </div>
  );
}
