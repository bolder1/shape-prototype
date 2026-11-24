'use client';
// Mini-game for rs.3-1: a research wall with four groups, each headed by a sentence a participant could say. Each card
// is a sticky note tagged with who it came from (`visual`, P1–P12). Stick it under its group: it lands tilted on the
// wall and the group's people counter goes up (counting people, not notes, via `themeReach`). A miss explains the group
// and the note comes back later. First try scores; the end shows each group's reach.
import { useState } from 'react';
import { motion } from 'motion/react';
import { UsersIcon } from '@phosphor-icons/react/ssr';
import { themeReach, type Episode } from '@shape/content';
import { springs } from '@shape/ui';
import { Button } from '@/components/base/buttons/button';
import { cx } from '@/utils/cx';
import { Burst, FAMILY_SOLID, NibSays, StageTitle } from '../kit';
import type { GameResult } from './DiamondSort';
import { play } from '@/lib/sound';

type Game = Episode['game'];
type Card = Game['cards'][number];
/** Sticky-note paper and ink, fixed in both themes (ink on paper is 11:1). */
const PAPER = '#FDE68A', INK = '#3B2F0B';
const tilt = (id: string) => ((id.length * 7 + id.charCodeAt(id.length - 1) * 3) % 7) - 3;

function Sticky({ card, big = false }: { card: Card; big?: boolean }) {
  return (
    <div className={cx('flex flex-col gap-1 rounded-sm text-left shadow-md', big ? 'px-5 py-4' : 'px-2.5 py-2')} style={{ background: PAPER, color: INK }}>
      <span className={cx('font-extrabold', big ? 'text-sm' : 'text-[11px]')}>{card.visual}</span>
      <span className={cx('leading-snug font-semibold', big ? 'text-lg' : 'text-xs')}>{card.label}</span>
    </div>
  );
}

export function AffinityWall({ game, onDone }: { game: Game; onDone: (results: GameResult[]) => void }) {
  const [deck, setDeck] = useState(game.cards);
  const [results, setResults] = useState<Record<string, boolean>>({});
  const [stuck, setStuck] = useState<string[]>([]);
  const [miss, setMiss] = useState(false);
  const [last, setLast] = useState<Card | null>(null);
  const card = deck[0];

  const stick = (laneId: string) => {
    if (!card || miss) return;
    const ok = laneId === card.lane;
    play(ok ? 'correct' : 'wrong');
    setResults(r => (card.id in r ? r : { ...r, [card.id]: ok }));
    if (ok) { setStuck(s => [...s, card.id]); setLast(card); setDeck(d => d.slice(1)); }
    else { setMiss(true); setLast(null); setTimeout(() => { setMiss(false); setDeck(d => [...d.slice(1), d[0]]); }, 2400); }
  };

  const wall = (
    <div className="grid grid-cols-2 gap-3 rounded-2xl bg-secondary p-3 sm:grid-cols-4">
      {game.lanes.map((l, k) => {
        const here = game.cards.filter(c => c.lane === l.id && stuck.includes(c.id));
        const reach = themeReach(here.map(c => c.visual ?? ''));
        return (
          <div key={l.id} className="flex flex-col gap-2">
            <motion.button type="button" onClick={() => stick(l.id)} disabled={miss || !card} whileTap={card ? { scale: 0.96 } : undefined}
              className={cx('flex min-h-24 flex-col justify-between gap-2 rounded-xl bg-primary px-3 py-2.5 text-left ring-2 ring-inset transition disabled:cursor-default',
                card && 'hover:bg-primary_hover', miss && l.id === card?.lane ? 'ring-4 ring-mint-600' : 'ring-secondary')}
              style={{ borderTop: `5px solid ${FAMILY_SOLID[k]}` }}>
              <span className="text-sm leading-snug font-bold text-primary">{l.label}</span>
              <span className="flex items-center gap-1 text-xs font-semibold text-tertiary tabular-nums">
                <UsersIcon className="size-3.5" weight="bold" aria-hidden />{reach} {reach === 1 ? 'person' : 'people'}
              </span>
            </motion.button>
            <div className="flex flex-col gap-1.5">
              {here.map(c => (
                <motion.div key={c.id} initial={{ y: -24, opacity: 0, rotate: 0 }} animate={{ y: 0, opacity: 1, rotate: tilt(c.id) }} transition={springs.pop}>
                  <Sticky card={c} />
                </motion.div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );

  if (!card) {
    const right = Object.values(results).filter(Boolean).length;
    const reach = game.lanes.map(l => ({ l, n: themeReach(game.cards.filter(c => c.lane === l.id).map(c => c.visual ?? '')) })).sort((a, b) => b.n - a.n);
    const top = reach[0], thin = reach[reach.length - 1];
    return (
      <div className="relative flex flex-col items-center gap-5 py-6 text-center">
        <Burst count={36} />
        <StageTitle eyebrow="Wall grouped" title={`${right} of ${game.cards.length} notes stuck right first time`}>
          Strongest group: {top.l.label}, from {top.n} people. Thinnest: {thin.n} people, so check it in the next round.
        </StageTitle>
        <div className="w-full">{wall}</div>
        <NibSays mood={right === game.cards.length ? 'cheer' : 'idle'}>Count people, not notes. A group from two people is a lead to follow up, not yet a finding.</NibSays>
        <Button size="xl" onPress={() => onDone(game.cards.map(c => ({ id: c.id, correct: !!results[c.id] })))}>Continue the story</Button>
      </div>
    );
  }

  const owner = game.lanes.find(l => l.id === card.lane)!;
  return (
    <div className="flex flex-col gap-5">
      <StageTitle eyebrow="Play" title={game.title}>{game.instructions}</StageTitle>
      <div className="flex items-baseline justify-between">
        <span className="text-sm font-semibold text-tertiary">Next note</span>
        <span className="text-sm font-semibold text-tertiary tabular-nums">{stuck.length} / {game.cards.length}</span>
      </div>
      <motion.div key={`${card.id}-${deck.length}`} initial={{ y: -14, opacity: 0, rotate: -2 }}
        animate={miss ? { x: [0, -10, 10, -6, 6, 0], opacity: 1, rotate: 0 } : { y: 0, opacity: 1, rotate: -1 }}
        transition={miss ? { duration: 0.4 } : springs.pop} className={cx('mx-auto w-full max-w-md rounded-sm', miss && 'ring-4 ring-error')} data-current-card>
        <Sticky card={card} big />
      </motion.div>
      <div className="min-h-14">
        {miss && <NibSays mood="sad">That note belongs with <strong>{owner.label}</strong>: {owner.hint.toLowerCase()}. {card.note} It’ll come back round.</NibSays>}
        {!miss && last && <NibSays mood="cheer">{last.note}</NibSays>}
      </div>
      {wall}
    </div>
  );
}
