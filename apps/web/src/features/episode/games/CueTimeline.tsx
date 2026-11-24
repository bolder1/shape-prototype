'use client';
// Mini-game for gr.2-1: each card is a piece of Kaksha's onboarding (its `visual`, a key of `KAKSHA_TIPS`). Drop it on
// the moment in Meenakshi's first month (`KAKSHA_MOMENTS`) when she can first use it. A right drop pins the tip under
// that moment; a wrong one shakes, `cueVerdict` says whether it came too early (and what she hasn't done yet) or too
// late (she already needed it), and the card comes back later. First try scores. The end is the whole month, the old
// up-front tour spread across four moments.
import { useState } from 'react';
import { motion } from 'motion/react';
import { KAKSHA_MOMENTS, KAKSHA_TIPS, cueFor, cueVerdict, type Episode, type KakshaMoment, type KakshaTip } from '@shape/content';
import { springs } from '@shape/ui';
import { Button } from '@/components/base/buttons/button';
import { cx } from '@/utils/cx';
import { Burst, NibSays, StageTitle } from '../kit';
import { KAKSHA } from '../scenes/JustInTime';
import type { GameResult } from './DiamondSort';
import { play } from '@/lib/sound';

type Game = Episode['game'];
type Card = Game['cards'][number];
const MOMENTS = Object.keys(KAKSHA_MOMENTS) as KakshaMoment[];

/** What she has done by a moment, in words. */
const doneBy = (m: KakshaMoment) => {
  const s = KAKSHA_MOMENTS[m];
  return s.students === 0 ? 'nothing made yet' : `${s.students} students, ${s.classes === 0 ? 'no classes yet' : `${s.classes} class${s.classes > 1 ? 'es' : ''} taken`}${s.feesDue ? ', fees due' : ''}`;
};

function Month({ placed, onPick, disabled, wrong, right }: { placed: Card[]; onPick?: (m: KakshaMoment) => void; disabled?: boolean; wrong?: KakshaMoment | null; right?: KakshaMoment | null }) {
  return (
    <ol className="relative grid grid-cols-1 gap-3 sm:grid-cols-4" aria-label="Meenakshi’s first month">
      <span className="absolute top-6 right-[12.5%] left-[12.5%] hidden h-1 rounded-full bg-tertiary sm:block" aria-hidden />
      {MOMENTS.map((m, i) => {
        const here = placed.filter(c => c.lane === m);
        return (
          <li key={m} className="relative flex flex-col items-stretch gap-2">
            <motion.button type="button" onClick={() => onPick?.(m)} disabled={disabled || !onPick} whileTap={{ scale: 0.97 }}
              animate={wrong === m ? { x: [0, -8, 8, -4, 4, 0] } : { x: 0 }} transition={{ duration: 0.4 }}
              className={cx('relative z-10 flex flex-col items-center gap-1 rounded-2xl border-2 bg-primary p-2 text-center transition enabled:hover:bg-primary_hover disabled:cursor-default',
                wrong === m ? 'border-error' : right === m ? 'border-mint-600' : 'border-secondary')}>
              <span className="flex size-8 items-center justify-center rounded-full text-sm font-bold text-white" style={{ background: KAKSHA }}>{i + 1}</span>
              <span className="text-sm font-semibold text-primary">{KAKSHA_MOMENTS[m].label}</span>
              <span className="text-[11px] leading-tight text-tertiary">{doneBy(m)}</span>
            </motion.button>
            <ul className="flex min-h-10 flex-col gap-1.5">
              {here.map(c => (
                <motion.li key={c.id} layout initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={springs.pop}
                  className="rounded-xl border-l-4 bg-secondary px-2.5 py-1.5 text-xs font-medium text-primary" style={{ borderColor: KAKSHA }}>
                  {c.label}
                </motion.li>
              ))}
            </ul>
          </li>
        );
      })}
    </ol>
  );
}

export function CueTimeline({ game, onDone }: { game: Game; onDone: (results: GameResult[]) => void }) {
  const [deck, setDeck] = useState(game.cards);
  const [results, setResults] = useState<Record<string, boolean>>({});
  const [placed, setPlaced] = useState<Card[]>([]);
  const [miss, setMiss] = useState<KakshaMoment | null>(null);
  const card = deck[0];
  const last = placed[placed.length - 1];

  const pick = (m: KakshaMoment) => {
    if (!card || miss) return;
    const ok = m === card.lane;
    play(ok ? 'correct' : 'wrong');
    setResults(x => (card.id in x ? x : { ...x, [card.id]: ok }));
    if (ok) { setPlaced(x => [...x, card]); setDeck(d => d.slice(1)); }
    else { setMiss(m); setTimeout(() => { setMiss(null); setDeck(d => [...d.slice(1), d[0]]); }, 2800); }
  };

  if (!card) {
    const right = Object.values(results).filter(Boolean).length;
    return (
      <div className="relative flex flex-col items-center gap-5 py-6 text-center">
        <Burst count={36} />
        <StageTitle eyebrow="Kaksha’s first month" title={`${right} of ${game.cards.length} tips timed first time`}>
          The tour that taught everything on first open is now spread across the month, each tip on the moment she can use it.
        </StageTitle>
        <div className="w-full text-left"><Month placed={placed} /></div>
        <NibSays mood={right === game.cards.length ? 'cheer' : 'idle'}>For every tip in your product, finish the sentence “show it when they have just…”. If the only ending you can find is a day number, it’s in the wrong place.</NibSays>
        <Button size="xl" onPress={() => onDone(game.cards.map(c => ({ id: c.id, correct: !!results[c.id] })))}>Continue the story</Button>
      </div>
    );
  }

  const needs = KAKSHA_TIPS[card.visual as KakshaTip].needs;
  const verdict = miss ? cueVerdict(needs, miss) : null;
  const due = cueFor(needs);
  return (
    <div className="flex flex-col gap-5">
      <StageTitle eyebrow="Play" title={game.title}>{game.instructions}</StageTitle>
      <div className="flex items-baseline justify-between">
        <span className="text-sm font-semibold text-tertiary">When does she first need this?</span>
        <span className="text-sm font-semibold text-tertiary tabular-nums">{placed.length} / {game.cards.length}</span>
      </div>
      <motion.div key={`${card.id}-${deck.length}`} initial={{ y: -14, opacity: 0 }} animate={miss ? { x: [0, -10, 10, -6, 6, 0], opacity: 1 } : { y: 0, opacity: 1 }} transition={miss ? { duration: 0.4 } : springs.pop}
        className={cx('mx-auto w-full max-w-lg rounded-2xl bg-primary px-5 py-4 text-lg font-semibold text-primary shadow-lg ring-2 ring-inset', miss ? 'ring-error' : 'ring-secondary')} data-current-card>
        {card.label}
      </motion.div>
      <Month placed={placed} onPick={pick} disabled={!!miss} wrong={miss} right={miss ? due : null} />
      <div className="min-h-14" aria-live="polite">
        {miss && verdict
          ? <NibSays mood="sad"><strong>Too {verdict}.</strong> {verdict === 'early'
            ? `At “${KAKSHA_MOMENTS[miss].label}” she has ${doneBy(miss)}, so she can’t use it yet.`
            : `By “${KAKSHA_MOMENTS[miss].label}” she already needed it.`} {card.note} It’ll come back round.</NibSays>
          : last && <NibSays mood="cheer">{last.note}</NibSays>}
      </div>
    </div>
  );
}
