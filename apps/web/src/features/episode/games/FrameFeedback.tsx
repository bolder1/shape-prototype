'use client';
// Mini-game for fd.3-2: you tried Kabir's Sabzi checkout, and each card is a raw thought about it. File it under I like,
// I wish or What if, and it's written into your feedback note as a framed sentence (`visual`); personal, vague or unkind
// thoughts go in the bin. A miss explains (`note`) and the thought comes back later. First try scores.
import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { TrashIcon } from '@phosphor-icons/react/ssr';
import { FRAME_LEAD, type Episode } from '@shape/content';
import { springs } from '@shape/ui';
import { Button } from '@/components/base/buttons/button';
import { cx } from '@/utils/cx';
import { Burst, FAMILY_SOLID, NibSays, StageTitle } from '../kit';
import type { GameResult } from './DiamondSort';
import { play } from '@/lib/sound';

type Game = Episode['game'];
type Lead = keyof typeof FRAME_LEAD;
const FRAMES: Lead[] = ['like', 'wish', 'whatif'];
/** Each frame's colour: a solid family fill that carries white text. */
const TONE: Record<Lead, string> = { like: FAMILY_SOLID[0], wish: FAMILY_SOLID[1], whatif: FAMILY_SOLID[2] };

export function FrameFeedback({ game, onDone }: { game: Game; onDone: (results: GameResult[]) => void }) {
  const [deck, setDeck] = useState(game.cards);
  const [results, setResults] = useState<Record<string, boolean>>({});
  const [filed, setFiled] = useState<string[]>([]);
  const [miss, setMiss] = useState(false);
  const [last, setLast] = useState<string | null>(null);
  const card = deck[0];
  const placed = game.cards.filter(c => filed.includes(c.id));
  const binned = placed.filter(c => c.lane === 'bin');
  const lastCard = game.cards.find(c => c.id === last);

  const file = (laneId: string) => {
    if (!card || miss) return;
    const ok = laneId === card.lane;
    play(ok ? 'correct' : 'wrong');
    setResults(r => (card.id in r ? r : { ...r, [card.id]: ok }));
    if (ok) { setFiled(f => [...f, card.id]); setLast(card.id); setDeck(d => d.slice(1)); }
    else { setMiss(true); setLast(null); setTimeout(() => { setMiss(false); setDeck(d => [...d.slice(1), d[0]]); }, 2400); }
  };

  const note = (
    <div className="flex flex-col gap-4 rounded-2xl bg-primary p-5 text-left shadow-lg ring-1 ring-secondary ring-inset">
      <p className="text-sm font-semibold text-tertiary">Feedback for Kabir · Sabzi checkout</p>
      {FRAMES.map(f => {
        const lines = placed.filter(c => c.lane === f);
        return (
          <div key={f} className="flex flex-col gap-1.5">
            <span className="w-fit rounded-full px-2.5 py-0.5 text-xs font-bold text-white" style={{ background: TONE[f] }}>{FRAME_LEAD[f]}</span>
            {lines.length === 0 && <span className="text-sm text-quaternary">Nothing yet</span>}
            <AnimatePresence initial={false}>
              {lines.map(c => (
                <motion.p key={c.id} initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} transition={springs.pop} className="text-md text-primary">{c.visual}</motion.p>
              ))}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );

  if (!card) {
    const right = Object.values(results).filter(Boolean).length;
    return (
      <div className="relative flex flex-col items-center gap-5 py-6 text-center">
        <Burst count={36} />
        <StageTitle eyebrow="Note written" title={`${right} of ${game.cards.length} thoughts filed right first time`}>
          {placed.length - binned.length} sentences Kabir can use, {binned.length} thoughts left in the bin.
        </StageTitle>
        <div className="w-full">{note}</div>
        <NibSays mood={right === game.cards.length ? 'cheer' : 'idle'}>Same honesty as “this is confusing, redo it”. Now Kabir knows what to keep, what hurt, and one idea to try.</NibSays>
        <Button size="xl" onPress={() => onDone(game.cards.map(c => ({ id: c.id, correct: !!results[c.id] })))}>Continue the story</Button>
      </div>
    );
  }

  const owner = game.lanes.find(l => l.id === card.lane)!;
  return (
    <div className="flex flex-col gap-5">
      <StageTitle eyebrow="Play" title={game.title}>{game.instructions}</StageTitle>
      <div className="flex items-baseline justify-between">
        <span className="text-sm font-semibold text-tertiary">A thought you had</span>
        <span className="text-sm font-semibold text-tertiary tabular-nums">{filed.length} / {game.cards.length}</span>
      </div>
      <motion.div key={`${card.id}-${deck.length}`} initial={{ y: -14, opacity: 0, rotate: -1 }} animate={miss ? { x: [0, -10, 10, -6, 6, 0], opacity: 1, rotate: 0 } : { y: 0, opacity: 1, rotate: 0 }}
        transition={miss ? { duration: 0.4 } : springs.pop}
        className={cx('rounded-2xl bg-secondary px-5 py-4 text-center text-lg font-semibold text-primary italic ring-2 ring-inset', miss ? 'ring-error' : 'ring-secondary')} data-current-card>
        {card.label}
      </motion.div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {game.lanes.map(l => (
          <motion.button key={l.id} type="button" onClick={() => file(l.id)} disabled={miss} whileTap={{ scale: 0.96 }}
            className={cx('flex flex-col items-start gap-1 rounded-2xl bg-primary px-3 py-3 text-left ring-2 ring-secondary ring-inset transition disabled:cursor-default hover:bg-primary_hover',
              miss && l.id === card.lane && 'ring-mint-600 ring-4')}>
            {l.id === 'bin'
              ? <span className="flex items-center gap-1 text-md font-bold text-primary"><TrashIcon className="size-4 text-fg-secondary" weight="bold" aria-hidden />{l.label}</span>
              : <span className="rounded-full px-2.5 py-0.5 text-sm font-bold text-white" style={{ background: TONE[l.id as Lead] }}>{l.label}</span>}
            <span className="text-xs leading-tight text-tertiary">{l.hint}</span>
          </motion.button>
        ))}
      </div>
      <div className="min-h-14">
        {miss && <NibSays mood="sad">That one belongs in <strong>{owner.label}</strong>. {card.note} It’ll come back round.</NibSays>}
        {!miss && lastCard && <NibSays mood="cheer">{lastCard.lane === 'bin' ? <><strong>Binned.</strong> {lastCard.note}</> : lastCard.note}</NibSays>}
      </div>
      {note}
    </div>
  );
}
