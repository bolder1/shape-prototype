'use client';
// Mini-game for ld.3-1: level the loop. Every card is a note from Ritu's interview loop for a senior role (its
// `visual`, a key of `KAARIGAR_NOTES`). Call it not evidence, or below, at or above the senior bar (`BAR_CALLS`,
// scored by `barCall`). Right calls put the note on Kaarigar's ladder at the rung `noteLevel` gives, or set it aside;
// the finished loop shows the level `offerLevel` supports. First call scores; a missed card comes back later.
import { useState } from 'react';
import { motion } from 'motion/react';
import { DESIGN_LADDER, KAARIGAR_NOTES, LADDER_LINES, barCall, noteLevel, offerLevel, type BarCall, type Episode, type KaarigarNote } from '@shape/content';
import { springs } from '@shape/ui';
import { Button } from '@/components/base/buttons/button';
import { cx } from '@/utils/cx';
import { Burst, NibSays, StageTitle } from '../kit';
import { BAR_FILL, RUNG_LABEL } from '../scenes/DebriefRoom';
import type { GameResult } from './DiamondSort';
import { play } from '@/lib/sound';

type Game = Episode['game'];

const WHY: Record<BarCall, string> = {
  noise: 'It says nothing about what she did or said: where she worked, how long, or how the interviewer felt. It counts for nothing.',
  below: 'The behaviour is real, but at feature scope, or someone else set the problem, so it sits below the senior bar.',
  at: 'She owned a product area and set its problems herself. That is the senior bar.',
  above: 'It shaped how other designers or teams work. That is lead-level scope, above the bar for this role.',
};

/** Kaarigar's ladder, lead at the top, with each placed note on its rung and the noise set aside. */
function LadderBoard({ placed, offer }: { placed: KaarigarNote[]; offer?: string | null }) {
  const noise = placed.filter(k => !noteLevel(KAARIGAR_NOTES[k]));
  return (
    <div className="flex flex-col gap-2" aria-label="Kaarigar’s design ladder with the notes placed so far">
      {[...DESIGN_LADDER].reverse().map(l => {
        const here = placed.filter(k => noteLevel(KAARIGAR_NOTES[k]) === l);
        const bar = l === 'senior';
        return (
          <div key={l} className={cx('flex flex-col gap-1.5 rounded-xl border-2 bg-primary p-3', bar ? 'border-mint-600' : 'border-secondary', offer === l && 'ring-2 ring-mint-600 ring-offset-2')}>
            <div className="flex flex-wrap items-baseline justify-between gap-x-2">
              <span className="text-md font-bold text-primary">{RUNG_LABEL[l]}{bar && <span className="ml-1.5 text-sm font-semibold text-tertiary">· the bar</span>}</span>
              {offer === l && <span className="text-sm font-bold text-primary">Offer</span>}
            </div>
            <span className="text-sm text-tertiary">{LADDER_LINES[l]}</span>
            {here.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {here.map(k => (
                  <motion.span key={k} layout initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={springs.pop}
                    className="rounded-md px-2 py-0.5 text-sm font-semibold text-white" style={{ background: BAR_FILL[barCall(KAARIGAR_NOTES[k])] }}>
                    {KAARIGAR_NOTES[k].short}
                  </motion.span>
                ))}
              </div>
            )}
          </div>
        );
      })}
      <div className="flex flex-wrap items-center gap-1.5 rounded-xl border-2 border-dashed border-secondary p-3">
        <span className="text-sm font-semibold text-tertiary">Set aside, not evidence:</span>
        {noise.length ? noise.map(k => <span key={k} className="rounded-md bg-secondary px-2 py-0.5 text-sm font-semibold text-tertiary line-through">{KAARIGAR_NOTES[k].short}</span>) : <span className="text-sm text-tertiary">none yet</span>}
      </div>
    </div>
  );
}

export function LevelCall({ game, onDone }: { game: Game; onDone: (results: GameResult[]) => void }) {
  const [deck, setDeck] = useState(game.cards);
  const [results, setResults] = useState<Record<string, boolean>>({});
  const [placed, setPlaced] = useState<KaarigarNote[]>([]);
  const [miss, setMiss] = useState<{ lane: string; why: string } | null>(null);
  const [right, setRight] = useState(false);
  const card = deck[0];

  if (!card) {
    const n = Object.values(results).filter(Boolean).length;
    const offer = offerLevel(placed.map(k => KAARIGAR_NOTES[k]));
    const evidence = placed.filter(k => noteLevel(KAARIGAR_NOTES[k])).length;
    return (
      <div className="relative flex flex-col gap-5 py-6">
        <Burst count={36} />
        <StageTitle eyebrow="Loop levelled" title={`${n} of ${game.cards.length} right first time`}>
          {evidence} notes of evidence on the ladder, {placed.length - evidence} set aside. Most of the evidence sits at {offer ? RUNG_LABEL[offer].toLowerCase() : '—'}, so that is the offer, at that level’s pay band.
        </StageTitle>
        <LadderBoard placed={placed} offer={offer} />
        <NibSays mood={n === game.cards.length ? 'cheer' : 'idle'}>Ladder first, notes before the debrief, behaviour only, and level where most of the evidence sits.</NibSays>
        <Button size="xl" onPress={() => onDone(game.cards.map(c => ({ id: c.id, correct: !!results[c.id] })))}>Continue the story</Button>
      </div>
    );
  }

  const k = card.visual as KaarigarNote;
  const d = KAARIGAR_NOTES[k];
  const lane = barCall(d);
  const done = game.cards.length - deck.length;
  const call = (laneId: string) => {
    if (miss || right) return;
    const ok = laneId === lane;
    play(ok ? 'correct' : 'wrong');
    setResults(rs => (card.id in rs ? rs : { ...rs, [card.id]: ok }));
    if (ok) { setRight(true); setPlaced(ps => [...ps, k]); }
    else {
      setMiss({ lane: laneId, why: WHY[lane] });
      setTimeout(() => { setMiss(null); setDeck(dk => [...dk.slice(1), dk[0]]); }, 4200);
    }
  };
  const next = () => { setRight(false); setDeck(dk => dk.slice(1)); };
  const level = noteLevel(d);

  return (
    <div className="flex flex-col gap-5">
      <StageTitle eyebrow="Play" title={game.title}>{game.instructions}</StageTitle>
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-sm font-semibold text-tertiary">Ritu Bhandari · senior designer, partner app</span>
        <span className="text-sm font-semibold text-tertiary tabular-nums">{done} / {game.cards.length}</span>
      </div>
      <motion.div key={`${card.id}-${deck.length}`} initial={{ y: 24, opacity: 0 }}
        animate={miss ? { x: [0, -10, 10, -6, 6, 0], y: 0, opacity: 1 } : { y: 0, opacity: 1 }}
        transition={miss ? { duration: 0.4 } : springs.pop}
        className={cx('flex flex-col gap-3 rounded-2xl bg-primary p-4 shadow-lg ring-2 ring-inset sm:p-5', miss ? 'ring-error' : right ? 'ring-mint-600' : 'ring-secondary')} data-current-card>
        <span className="self-start rounded-md bg-secondary px-2 py-0.5 text-sm font-semibold text-secondary">{d.who}</span>
        <p className="text-lg font-semibold text-primary">“{card.label}”</p>
        {right && (
          <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={springs.pop}
            className="rounded-lg px-3 py-2 text-sm font-semibold text-white" style={{ background: BAR_FILL[lane] }}>
            {level ? `On the ladder at ${RUNG_LABEL[level].toLowerCase()}${d.guided ? ', one rung down because someone else framed it' : ''}.` : 'Set aside: no behaviour to place.'}
          </motion.p>
        )}
      </motion.div>
      <div className="grid grid-cols-2 gap-2" role="group" aria-label="What this note is evidence of">
        {game.lanes.map(l => (
          <motion.button key={l.id} type="button" onClick={() => call(l.id)} disabled={!!miss || right} whileTap={{ scale: 0.97 }}
            className={cx('flex flex-col items-start gap-0.5 rounded-xl border-2 bg-primary px-3 py-2.5 text-left transition enabled:hover:bg-primary_hover disabled:cursor-default',
              right && l.id === lane ? 'border-mint-600' : miss?.lane === l.id ? 'border-error' : miss && l.id === lane ? 'border-mint-600' : 'border-secondary')}>
            <span className="flex items-center gap-1.5 text-md font-bold text-primary"><span className="size-2.5 shrink-0 rounded-full" style={{ background: BAR_FILL[l.id as BarCall] }} aria-hidden />{l.label}</span>
            <span className="text-xs font-medium text-tertiary">{l.hint}</span>
          </motion.button>
        ))}
      </div>
      <div className="min-h-14" aria-live="polite">
        {miss && <NibSays mood="sad">{miss.why} {card.note} It’ll come back round.</NibSays>}
        {right && (
          <div className="flex flex-col gap-3">
            <NibSays mood="cheer">{card.note}</NibSays>
            <div className="flex justify-end"><Button size="lg" onPress={next}>{deck.length > 1 ? 'Next note' : 'See the ladder'}</Button></div>
          </div>
        )}
        {!miss && !right && <NibSays mood="think">Does it describe something she did? How wide was it, and did she frame it herself?</NibSays>}
      </div>
      <LadderBoard placed={placed} />
    </div>
  );
}
