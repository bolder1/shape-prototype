'use client';
// Mini-game for st.3-2: each card is a line from the Apni Awaaz HEART plan (its `visual`, a key of `AWAAZ_HEART`).
// First call it a signal, a metric or a total to cut (`gsmPart` reads it from the words). A signal or metric then goes
// in its HEART row, beside the goal from `AWAAZ_GOALS`; a total drops into the cut tray. A wrong part shakes and the
// card comes back later; a wrong row flashes, the line slides into its real row, and it doesn't score. First try at
// both scores. The end is the full grid: five goals, five signals, five metrics.
import { useState } from 'react';
import { motion } from 'motion/react';
import { AWAAZ_GOALS, AWAAZ_HEART, GSM_PARTS, HEART, type AwaazLine, type Episode, type GsmPart, type HeartDim } from '@shape/content';
import { springs } from '@shape/ui';
import { Button } from '@/components/base/buttons/button';
import { cx } from '@/utils/cx';
import { Burst, NibSays, StageTitle } from '../kit';
import { HEART_FILL, HEART_NAME } from '../scenes/HeartGoals';
import type { GameResult } from './DiamondSort';
import { play } from '@/lib/sound';

type Game = Episode['game'];
type Card = Game['cards'][number];
const dimOf = (c: Card) => (AWAAZ_HEART[c.visual as AwaazLine] as { dim?: HeartDim }).dim;
const PART_NAME: Record<GsmPart, string> = { signal: 'Signal', metric: 'Metric', cut: 'Cut it' };

function Grid({ placed, onRow, flash, pick }: { placed: Card[]; onRow?: (d: HeartDim) => void; flash?: HeartDim; pick?: boolean }) {
  const at = (d: HeartDim, part: GsmPart) => placed.find(c => c.lane === part && dimOf(c) === d);
  return (
    <div className="flex flex-col gap-1.5" role={pick ? 'group' : undefined} aria-label={pick ? 'Pick the HEART row' : undefined}>
      <div className="hidden grid-cols-[7.5rem_1fr_1fr_1fr] gap-1.5 px-1 text-xs font-bold text-tertiary sm:grid">
        <span /><span>Goal</span><span>Signal</span><span>Metric</span>
      </div>
      {HEART.map(d => {
        const row = (
          <>
            <span className="flex items-center rounded-lg px-2 py-1.5 text-xs font-bold text-white" style={{ background: HEART_FILL[d] }}>{HEART_NAME[d]}</span>
            <span className="rounded-lg bg-primary px-2 py-1.5 text-xs text-secondary">{AWAAZ_GOALS[d]}</span>
            {(['signal', 'metric'] as const).map(part => {
              const c = at(d, part);
              return (
                <span key={part} className={cx('min-h-9 rounded-lg px-2 py-1.5 text-xs', c ? 'bg-primary font-semibold text-primary ring-2 ring-inset' : 'border border-dashed border-secondary text-quaternary')}
                  style={c ? { ['--tw-ring-color' as string]: HEART_FILL[d] } : undefined}>
                  {c ? <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }}>{c.label}</motion.span> : <span className="sm:hidden">{PART_NAME[part]}</span>}
                </span>
              );
            })}
          </>
        );
        const cls = cx('grid grid-cols-[6.5rem_1fr] gap-1.5 rounded-xl p-1 text-left sm:grid-cols-[7.5rem_1fr_1fr_1fr]', flash === d ? 'bg-error-primary' : 'bg-secondary');
        return pick && onRow
          ? <motion.button key={d} type="button" onClick={() => onRow(d)} whileTap={{ scale: 0.99 }} className={cx(cls, 'ring-2 ring-transparent ring-inset hover:ring-brand')} aria-label={`${HEART_NAME[d]}: ${AWAAZ_GOALS[d]}`}>{row}</motion.button>
          : <div key={d} className={cls}>{row}</div>;
      })}
    </div>
  );
}

export function HeartGrid({ game, onDone }: { game: Game; onDone: (results: GameResult[]) => void }) {
  const [deck, setDeck] = useState(game.cards);
  const [results, setResults] = useState<Record<string, boolean>>({});
  const [placed, setPlaced] = useState<string[]>([]);
  const [step, setStep] = useState<'part' | 'row'>('part');
  const [miss, setMiss] = useState<'part' | 'row' | null>(null);
  const [flash, setFlash] = useState<HeartDim>();
  const card = deck[0];
  const placedCards = game.cards.filter(c => placed.includes(c.id));
  const last = placedCards.length ? game.cards.find(c => c.id === placed[placed.length - 1]) : undefined;

  const land = (ok: boolean) => {
    setResults(x => (card.id in x ? x : { ...x, [card.id]: ok }));
    setPlaced(x => [...x, card.id]); setDeck(d => d.slice(1)); setStep('part');
  };
  const choosePart = (part: GsmPart) => {
    if (!card || miss) return;
    const ok = part === card.lane;
    play(ok ? 'correct' : 'wrong');
    if (!ok) {
      setResults(x => (card.id in x ? x : { ...x, [card.id]: false }));
      setMiss('part'); setTimeout(() => { setMiss(null); setDeck(d => [...d.slice(1), d[0]]); }, 2600);
      return;
    }
    if (part === 'cut') land(true); else setStep('row');
  };
  const chooseRow = (d: HeartDim) => {
    if (!card || miss) return;
    const ok = d === dimOf(card);
    play(ok ? 'correct' : 'wrong');
    if (ok) { land(true); return; }   // a card that missed its part earlier keeps that miss
    setResults(x => ({ ...x, [card.id]: false }));
    setMiss('row'); setFlash(d);
    setTimeout(() => { setMiss(null); setFlash(undefined); land(false); }, 2400);
  };

  if (!card) {
    const right = Object.values(results).filter(Boolean).length;
    return (
      <div className="relative flex flex-col items-center gap-5 py-6 text-center">
        <Burst count={36} />
        <StageTitle eyebrow="Apni Awaaz · HEART plan" title={`${right} of ${game.cards.length} lines placed first time`}>
          Every row runs from a goal in words, to something you could notice, to a number that can fall. The two totals didn’t make it.
        </StageTitle>
        <div className="w-full text-left"><Grid placed={placedCards} /></div>
        <NibSays mood={right === game.cards.length ? 'cheer' : 'idle'}>You won’t always need all five rows. For Apni Awaaz, task success was the one that caught Lakshmi’s locked screen.</NibSays>
        <Button size="xl" onPress={() => onDone(game.cards.map(c => ({ id: c.id, correct: !!results[c.id] })))}>Continue the story</Button>
      </div>
    );
  }

  const lane = game.lanes.find(l => l.id === card.lane)!;
  const dim = dimOf(card);
  return (
    <div className="flex flex-col gap-5">
      <StageTitle eyebrow="Play" title={game.title}>{game.instructions}</StageTitle>
      <div className="flex items-baseline justify-between">
        <span className="text-sm font-semibold text-tertiary">{step === 'part' ? 'Signal, metric or cut?' : 'Which HEART row?'}</span>
        <span className="text-sm font-semibold text-tertiary tabular-nums">{placed.length} / {game.cards.length}</span>
      </div>
      <motion.div key={`${card.id}-${deck.length}`} initial={{ y: -14, opacity: 0 }} animate={miss ? { x: [0, -10, 10, -6, 6, 0], opacity: 1 } : { y: 0, opacity: 1 }} transition={miss ? { duration: 0.4 } : springs.pop}
        className={cx('mx-auto w-full max-w-lg rounded-2xl bg-primary px-5 py-4 shadow-lg ring-2 ring-inset', miss ? 'ring-error' : 'ring-secondary')} data-current-card>
        <span className="text-lg font-semibold text-primary">{card.label}</span>
        {step === 'row' && <span className="mt-1 block text-sm text-tertiary">A {card.lane}. Now tap its row.</span>}
      </motion.div>
      {step === 'part' && (
        <div className="grid grid-cols-3 gap-2">
          {GSM_PARTS.map(part => {
            const l = game.lanes.find(x => x.id === part);
            return (
              <motion.button key={part} type="button" onClick={() => choosePart(part)} disabled={!!miss} whileTap={{ scale: 0.97 }}
                className={cx('flex flex-col items-start gap-1 rounded-2xl border-2 bg-secondary p-3 text-left transition hover:bg-secondary_hover disabled:cursor-default', miss === 'part' && part === card.lane ? 'border-mint-600' : 'border-transparent')}>
                <span className="text-sm font-bold text-primary">{PART_NAME[part]}</span>
                {l && <span className="text-[11px] leading-tight text-tertiary">{l.hint}</span>}
              </motion.button>
            );
          })}
        </div>
      )}
      <Grid placed={placedCards} pick={step === 'row' && !miss} onRow={chooseRow} flash={flash} />
      <ul className="flex min-h-9 flex-wrap items-center gap-1.5 rounded-xl border border-dashed border-secondary p-2 text-xs text-tertiary">
        <li className="font-bold">Cut:</li>
        {placedCards.filter(c => c.lane === 'cut').map(c => <li key={c.id} className="rounded-md bg-secondary px-2 py-0.5 line-through">{c.label}</li>)}
      </ul>
      <div className="min-h-14">
        {miss === 'part'
          ? <NibSays mood="sad">It’s a <strong>{lane.label.toLowerCase()}</strong>: {lane.hint.toLowerCase()}. {card.note} It’ll come back round.</NibSays>
          : miss === 'row' && dim
            ? <NibSays mood="sad">It belongs in <strong>{HEART_NAME[dim]}</strong>, next to “{AWAAZ_GOALS[dim]}”. {card.note}</NibSays>
            : last && step === 'part' && <NibSays mood="cheer">{last.note}</NibSays>}
      </div>
    </div>
  );
}
