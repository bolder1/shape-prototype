'use client';
// Mini-game for dc.2-1: write the spec Ritesh needs. Every card is a line Sana could put in the handoff (its `visual`,
// a key of `GAADI_SPEC`). Send it to the spec, leave it to Dev Mode, or leave it out (`SPEC_SOURCES`). Spec lines are
// numbered onto a spec page and tick off Ritesh's questions (`specAnswered`); Dev Mode lines appear in an inspect
// panel with the token they come from (`inspect`), not as a hand-typed copy; cut lines drop into a pile. A miss
// explains and the card comes back later; first call scores. The end shows the finished spec beside the questions.
import { useState } from 'react';
import { motion } from 'motion/react';
import { CheckIcon } from '@phosphor-icons/react/ssr';
import { DEV_QUESTIONS, GAADI_SPEC, specAnswered, type Episode, type GaadiSpecItem, type SpecSource } from '@shape/content';
import { springs } from '@shape/ui';
import { Button } from '@/components/base/buttons/button';
import { cx } from '@/utils/cx';
import { Burst, NibSays, StageTitle } from '../kit';
import { QUESTION_SHORT, SOURCE_TONE } from '../scenes/SpecHandoff';
import type { GameResult } from './DiamondSort';
import { play } from '@/lib/sound';

type Game = Episode['game'];
const I = (k: string) => GAADI_SPEC[k as GaadiSpecItem];

function SpecPage({ placed }: { placed: GaadiSpecItem[] }) {
  const notes = placed.filter(k => GAADI_SPEC[k].source === 'note');
  const tools = placed.filter(k => GAADI_SPEC[k].source === 'tool');
  const answered = specAnswered(notes.map(k => GAADI_SPEC[k]));
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-2 rounded-2xl bg-secondary p-4">
        <span className="text-sm font-bold text-primary">Spec · Change your trip</span>
        {notes.length === 0 && <span className="text-sm text-quaternary">Notes you write appear here, numbered on the frame.</span>}
        <ol className="flex flex-col gap-1.5">
          {notes.map((k, i) => (
            <motion.li key={k} layout initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={springs.pop} className="flex gap-2 rounded-lg bg-primary px-3 py-2 text-sm text-primary">
              <span className="flex size-5 shrink-0 items-center justify-center rounded-full text-xs font-bold" style={{ boxShadow: `inset 0 0 0 2px ${SOURCE_TONE.note}` }}>{i + 1}</span>
              <span className="line-clamp-2">{GAADI_SPEC[k].text}</span>
            </motion.li>
          ))}
        </ol>
        <div className="flex flex-col gap-1 pt-1">
          <span className="text-xs font-semibold text-tertiary">Ritesh’s questions · {answered.length} of {DEV_QUESTIONS.length}</span>
          <div className="grid grid-cols-2 gap-1">
            {DEV_QUESTIONS.map(q => {
              const ok = answered.includes(q);
              return (
                <span key={q} className={cx('flex items-center gap-1.5 text-xs font-semibold', ok ? 'text-primary' : 'text-quaternary')}>
                  <span className={cx('flex size-4 shrink-0 items-center justify-center rounded-full ring-2 ring-inset', ok ? 'bg-mint-600 ring-mint-600' : 'ring-secondary')} aria-hidden>{ok && <CheckIcon className="size-2.5 text-white" weight="bold" />}</span>
                  {QUESTION_SHORT[q]}<span className="sr-only">{ok ? ', answered' : ', not answered yet'}</span>
                </span>
              );
            })}
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-1.5 rounded-2xl bg-gray-900 p-4 font-mono text-xs text-gray-100">
        <span className="font-sans text-xs font-bold text-blue-300">Dev Mode · already in the file</span>
        {tools.length === 0 && <span className="text-gray-400">Values left to Dev Mode show here, with their tokens.</span>}
        {tools.map(k => <motion.span key={k} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>{GAADI_SPEC[k].inspect}</motion.span>)}
      </div>
    </div>
  );
}

export function SpecWrite({ game, onDone }: { game: Game; onDone: (results: GameResult[]) => void }) {
  const [deck, setDeck] = useState(game.cards);
  const [results, setResults] = useState<Record<string, boolean>>({});
  const [placed, setPlaced] = useState<GaadiSpecItem[]>([]);
  const [miss, setMiss] = useState<string | null>(null);
  const [right, setRight] = useState(false);
  const card = deck[0];
  const cut = placed.filter(k => GAADI_SPEC[k].source === 'cut').length;

  if (!card) {
    const n = Object.values(results).filter(Boolean).length;
    return (
      <div className="relative flex flex-col gap-5 py-6">
        <Burst count={36} />
        <StageTitle eyebrow="Spec handed off" title={`${n} of ${game.cards.length} placed first time`}>
          Every question answered before the build starts, no values retyped by hand, and nothing Ritesh has to read twice.
        </StageTitle>
        <SpecPage placed={placed} />
        <NibSays mood={n === game.cards.length ? 'cheer' : 'idle'}>Book 20 minutes with the engineer before the sprint and walk the spec together. Every gap they find then costs minutes; found mid-build, it costs days.</NibSays>
        <Button size="xl" onPress={() => onDone(game.cards.map(c => ({ id: c.id, correct: !!results[c.id] })))}>Continue the story</Button>
      </div>
    );
  }

  const k = card.visual as GaadiSpecItem;
  const item = I(k);
  const owner = game.lanes.find(l => l.id === item.source)!;
  const done = game.cards.length - deck.length;
  const call = (laneId: string) => {
    if (miss || right) return;
    const ok = laneId === item.source;
    play(ok ? 'correct' : 'wrong');
    setResults(r => (card.id in r ? r : { ...r, [card.id]: ok }));
    if (ok) { setRight(true); setPlaced(ps => [...ps, k]); }
    else { setMiss(laneId); setTimeout(() => { setMiss(null); setDeck(d => [...d.slice(1), d[0]]); }, 3200); }
  };
  const next = () => { setRight(false); setDeck(d => d.slice(1)); };

  return (
    <div className="flex flex-col gap-5">
      <StageTitle eyebrow="Play" title={game.title}>{game.instructions}</StageTitle>
      <div className="grid gap-5 md:grid-cols-[1fr_minmax(0,22rem)]">
        <div className="flex flex-col gap-4">
          <div className="flex items-baseline justify-between">
            <span className="text-sm font-semibold text-tertiary">A line for the handoff</span>
            <span className="text-sm font-semibold text-tertiary tabular-nums">{done} / {game.cards.length}</span>
          </div>
          <motion.div key={`${card.id}-${deck.length}`} initial={{ y: 24, opacity: 0 }} animate={miss ? { x: [0, -10, 10, -6, 6, 0], y: 0, opacity: 1 } : { y: 0, opacity: 1 }} transition={miss ? { duration: 0.4 } : springs.pop}
            className={cx('rounded-2xl bg-primary p-5 shadow-lg ring-2 ring-inset', miss ? 'ring-error' : right ? 'ring-mint-600' : 'ring-secondary')} data-current-card>
            <p className="text-lg font-semibold text-primary">{card.label}</p>
          </motion.div>
          <div className="grid gap-2 sm:grid-cols-3" role="group" aria-label="Where it belongs">
            {game.lanes.map(l => (
              <motion.button key={l.id} type="button" onClick={() => call(l.id)} disabled={!!miss || right} whileTap={{ scale: 0.97 }}
                className={cx('flex flex-col items-start gap-0.5 rounded-xl border-2 bg-primary px-3 py-2.5 text-left transition enabled:hover:bg-primary_hover disabled:cursor-default',
                  right && l.id === item.source ? 'border-mint-600' : miss === l.id ? 'border-error' : miss && l.id === item.source ? 'border-mint-600' : 'border-secondary')}>
                <span className="flex items-center gap-1.5 text-md font-bold text-primary"><span className="size-2.5 rounded-full" style={{ background: SOURCE_TONE[l.id as SpecSource] }} aria-hidden />{l.label}</span>
                <span className="text-xs font-medium text-tertiary">{l.hint}</span>
              </motion.button>
            ))}
          </div>
          <div className="min-h-14" aria-live="polite">
            {miss && <NibSays mood="sad">Not quite: <strong>{owner.label.toLowerCase()}</strong>. {card.note} It’ll come back round.</NibSays>}
            {right && (
              <div className="flex flex-col gap-3">
                <NibSays mood="cheer">{card.note}</NibSays>
                <div className="flex justify-end"><Button size="lg" onPress={next}>{deck.length > 1 ? 'Next line' : 'See the spec'}</Button></div>
              </div>
            )}
            {!miss && !right && <NibSays mood="think">Could Ritesh read this off the file in Dev Mode? Would he have to guess it? Or does he not need it at all?</NibSays>}
          </div>
          {cut > 0 && <span className="text-xs font-semibold text-tertiary">Left out: {cut}</span>}
        </div>
        <SpecPage placed={placed} />
      </div>
    </div>
  );
}
