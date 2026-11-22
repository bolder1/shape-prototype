'use client';
// Shared second half of the "lab" games: one card at a time, a button per lane, untimed.
// A miss explains the rule and the card comes back later, so the round ends on getting every one right.
import { useState } from 'react';
import { motion } from 'motion/react';
import type { Episode } from '@shape/content';
import { springs } from '@shape/ui';
import { cx } from '@/utils/cx';
import { FAMILY, NibSays } from '../kit';
import type { GameResult } from './DiamondSort';

type Game = Episode['game'];

export function Classify({ game, title, onDone }: { game: Game; title: string; onDone: (results: GameResult[]) => void }) {
  const [deck, setDeck] = useState(game.cards);
  const [results, setResults] = useState<Record<string, boolean>>({});
  const [feedback, setFeedback] = useState<{ chose: string; ok: boolean } | null>(null);
  const [turn, setTurn] = useState(0);
  const card = deck[0];

  const choose = (laneId: string) => {
    if (!card || feedback) return;
    const ok = laneId === card.lane;
    const nextResults = card.id in results ? results : { ...results, [card.id]: ok };
    setResults(nextResults);
    setFeedback({ chose: laneId, ok });
    setTimeout(() => {
      const rest = ok ? deck.slice(1) : [...deck.slice(1), deck[0]];
      setDeck(rest); setFeedback(null); setTurn(n => n + 1);
      if (!rest.length) onDone(game.cards.map(c => ({ id: c.id, correct: !!nextResults[c.id] })));
    }, ok ? 650 : 2000);
  };

  if (!card) return null;
  const owner = game.lanes.find(l => l.id === card.lane)!;
  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-baseline justify-between">
        <h2 className="text-xl font-semibold text-primary">{title}</h2>
        <span className="text-sm font-semibold text-tertiary tabular-nums">{game.cards.length - deck.length} / {game.cards.length}</span>
      </div>
      <motion.div key={turn} initial={{ y: -20, opacity: 0 }} animate={feedback ? (feedback.ok ? { y: 60, opacity: 0, scale: 0.8 } : { x: [0, -12, 12, -8, 8, 0] }) : { y: 0, opacity: 1 }}
        transition={feedback ? { duration: 0.4 } : springs.pop}
        className={cx('rounded-2xl bg-primary px-5 py-5 text-center text-xl font-semibold text-primary shadow-lg ring-2 ring-inset', feedback && !feedback.ok ? 'ring-error' : 'ring-secondary')}
        data-current-card>
        {card.label}
      </motion.div>
      <div className="grid gap-3" style={{ gridTemplateColumns: `repeat(${game.lanes.length}, minmax(0, 1fr))` }}>
        {game.lanes.map((l, i) => (
          <motion.button key={l.id} type="button" onClick={() => choose(l.id)} disabled={!!feedback} whileTap={{ scale: 0.96 }}
            className={cx('rounded-2xl px-3 py-4 text-md font-bold text-white transition disabled:opacity-60', feedback?.ok === false && l.id === card.lane && 'ring-4 ring-mint-500')}
            style={{ background: FAMILY[[0, 1, 3, 2][i % 4]] }}>
            {l.label}
          </motion.button>
        ))}
      </div>
      <div className="min-h-14">
        {feedback && !feedback.ok && <NibSays mood="sad">That’s <strong>{owner.label}</strong>: {owner.hint.toLowerCase()}. It’ll come back round.</NibSays>}
        {feedback?.ok && <NibSays mood="cheer">Right.</NibSays>}
      </div>
    </div>
  );
}
