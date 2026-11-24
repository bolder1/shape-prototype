'use client';
// Mini-game for rs.4-1: Meher's draft tasks for the Safar test, one at a time, as tappable words. Tap a word inside the
// run that spoils the task (`visual`, located by `flawSpan`), or call a fair task fair. The spoiling words are struck,
// the flaw is named, and a line shows what that wording would do to the session; then the rewrite (`note`) slides in.
// One call per task; the end lays out every task beside its rewrite.
import { useState } from 'react';
import { motion } from 'motion/react';
import { CheckIcon, XIcon } from '@phosphor-icons/react/ssr';
import { flawSpan, taskWords, type Episode } from '@shape/content';
import { springs } from '@shape/ui';
import { Button } from '@/components/base/buttons/button';
import { cx } from '@/utils/cx';
import { Burst, NibSays, StageTitle } from '../kit';
import type { GameResult } from './DiamondSort';
import { play } from '@/lib/sound';

type Game = Episode['game'];
type Card = Game['cards'][number];
/** What each kind of wording does to a real session. */
const IN_SESSION: Record<string, string> = {
  leak: 'Rohit scans for those words and taps them. Done in seconds, and you learn nothing about the design.',
  steps: 'Rohit follows your steps one by one. You’ve tested your instructions, not the interface.',
  vague: 'Rohit wanders, or gives you an opinion. There’s nothing to succeed or fail at.',
  good: 'Rohit has a reason and knows when he’s done. Wherever he goes looking is the finding.',
};

/** The task as words; the flaw's words are struck once revealed. */
function TaskText({ card, revealed, onWord, chosen }: { card: Card; revealed: boolean; onWord?: (i: number) => void; chosen: number | null }) {
  const span = card.visual ? flawSpan(card.label, card.visual) : null;
  return (
    <p className="flex flex-wrap gap-x-1.5 gap-y-1 text-lg leading-relaxed font-semibold">
      {taskWords(card.label).map((w, i) => {
        const inFlaw = !!span && i >= span[0] && i <= span[1];
        return (
          <button key={i} type="button" onClick={() => onWord?.(i)} disabled={revealed || !onWord}
            className={cx('rounded-md px-1 transition', !revealed && 'text-primary hover:bg-primary_hover hover:ring-2 hover:ring-secondary',
              revealed && inFlaw && 'bg-error-primary text-error-primary line-through decoration-2',
              revealed && !inFlaw && 'text-tertiary', chosen === i && revealed && !inFlaw && 'ring-2 ring-error')}>
            {w}
          </button>
        );
      })}
    </p>
  );
}

export function TaskFix({ game, onDone }: { game: Game; onDone: (results: GameResult[]) => void }) {
  const [i, setI] = useState(0);
  const [choice, setChoice] = useState<number | 'fair' | null>(null);
  const [results, setResults] = useState<Record<string, boolean>>({});
  const card = game.cards[i];

  const decide = (c: number | 'fair') => {
    if (!card || choice !== null) return;
    const span = card.visual ? flawSpan(card.label, card.visual) : null;
    const ok = c === 'fair' ? card.lane === 'good' : !!span && c >= span[0] && c <= span[1];
    play(ok ? 'correct' : 'wrong');
    setChoice(c);
    setResults(r => ({ ...r, [card.id]: ok }));
  };

  if (!card) {
    const right = Object.values(results).filter(Boolean).length;
    return (
      <div className="relative flex flex-col items-center gap-5 py-6 text-center">
        <Burst count={36} />
        <StageTitle eyebrow="Tasks fixed" title={`${right} of ${game.cards.length} tasks called right`}>
          Every task now gives a reason, a goal and an end you can see.
        </StageTitle>
        <ol className="flex w-full flex-col gap-2 text-left">
          {game.cards.map(c => (
            <li key={c.id} className="flex flex-col gap-1 rounded-xl bg-primary px-4 py-3 ring-1 ring-secondary ring-inset">
              <span className={cx('text-sm', c.lane === 'good' ? 'font-semibold text-primary' : 'text-tertiary line-through')}>{c.label}</span>
              {c.lane !== 'good' && <span className="text-md font-semibold text-primary">{c.note}</span>}
            </li>
          ))}
        </ol>
        <NibSays mood={right === game.cards.length ? 'cheer' : 'idle'}>Read each task aloud to a colleague before session one. If they ask a question, the task should have answered it.</NibSays>
        <Button size="xl" onPress={() => onDone(game.cards.map(c => ({ id: c.id, correct: !!results[c.id] })))}>Continue the story</Button>
      </div>
    );
  }

  const revealed = choice !== null, ok = !!results[card.id], lane = game.lanes.find(l => l.id === card.lane)!;
  return (
    <div className="flex flex-col gap-5">
      <StageTitle eyebrow="Play" title={game.title}>{game.instructions}</StageTitle>
      <div className="flex items-baseline justify-between">
        <span className="text-sm font-semibold text-tertiary">Draft task, read aloud to the participant</span>
        <span className="text-sm font-semibold text-tertiary tabular-nums">{i + 1} / {game.cards.length}</span>
      </div>
      <motion.div key={card.id} initial={{ y: -12, opacity: 0 }} animate={revealed && !ok ? { x: [0, -10, 10, -6, 6, 0], opacity: 1, y: 0 } : { y: 0, opacity: 1 }} transition={{ duration: 0.4 }}
        className={cx('flex flex-col gap-4 rounded-2xl bg-primary px-5 py-4 shadow-lg ring-2 ring-inset', !revealed ? 'ring-secondary' : ok ? 'ring-mint-600' : 'ring-error')} data-current-card>
        <TaskText card={card} revealed={revealed} onWord={decide} chosen={typeof choice === 'number' ? choice : null} />
        <div className="flex justify-end">
          <Button size="md" color="secondary" onPress={() => decide('fair')} isDisabled={revealed}>Nothing spoils it: it’s fair</Button>
        </div>
      </motion.div>
      {revealed && (
        <div className="flex flex-col gap-3">
          <NibSays mood={ok ? 'cheer' : 'sad'}>
            <span className="inline-flex items-center gap-1 font-semibold">{ok ? <CheckIcon className="size-4" weight="bold" /> : <XIcon className="size-4" weight="bold" />}{lane.label}.</span>{' '}{IN_SESSION[card.lane]}
          </NibSays>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ ...springs.pop, delay: 0.25 }}
            className={cx('flex flex-col gap-1 rounded-2xl px-5 py-4 ring-2 ring-inset', card.lane === 'good' ? 'bg-primary ring-mint-600' : 'bg-primary ring-brand')}>
            <span className="text-xs font-bold tracking-wide text-brand-secondary uppercase">{card.lane === 'good' ? 'Why it works' : 'Rewritten'}</span>
            <span className="text-lg font-semibold text-primary">{card.note}</span>
          </motion.div>
          <div className="flex justify-end"><Button size="lg" onPress={() => { setChoice(null); setI(n => n + 1); }}>{i + 1 < game.cards.length ? 'Next task' : 'See all the tasks'}</Button></div>
        </div>
      )}
    </div>
  );
}
