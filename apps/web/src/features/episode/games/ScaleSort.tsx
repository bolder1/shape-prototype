'use client';
// Mini-game for rs.1-2: questions drop in one at a time; send each to the pan that answers it (Why = qual, How many = quant).
// The beam tips as the pans fill. Drag the card onto a pan, or tap the pan. Misses come back later.
import { useState } from 'react';
import { motion } from 'motion/react';
import type { Episode } from '@shape/content';
import { springs } from '@shape/ui';
import { Button } from '@/components/base/buttons/button';
import { cx } from '@/utils/cx';
import { Burst, NibSays, StageTitle } from '../kit';
import type { GameResult } from './DiamondSort';

type Game = Episode['game'];
const COLORS = ['var(--color-family-grow)', 'var(--color-family-discover)'];

export function ScaleSort({ game, onDone }: { game: Game; onDone: (results: GameResult[]) => void }) {
  const [deck, setDeck] = useState(game.cards);
  const [results, setResults] = useState<Record<string, boolean>>({});
  const [pans, setPans] = useState<Record<string, string[]>>({});
  const [feedback, setFeedback] = useState<{ ok: boolean; owner: string } | null>(null);
  const [turn, setTurn] = useState(0);
  const card = deck[0];
  const [left, right] = game.lanes;
  const tilt = Math.max(-14, Math.min(14, ((pans[right.id]?.length ?? 0) - (pans[left.id]?.length ?? 0)) * 4));

  const drop = (laneId: string) => {
    if (!card || feedback) return;
    const ok = card.lane === laneId;
    setResults(r => (card.id in r ? r : { ...r, [card.id]: ok }));
    setFeedback({ ok, owner: card.lane });
    if (ok) setPans(p => ({ ...p, [laneId]: [...(p[laneId] ?? []), card.label] }));
    setTimeout(() => { setDeck(d => (ok ? d.slice(1) : [...d.slice(1), d[0]])); setFeedback(null); setTurn(n => n + 1); }, ok ? 600 : 1900);
  };
  const laneAt = (x: number, y: number) => document.elementsFromPoint(x - window.scrollX, y - window.scrollY).map(el => (el as HTMLElement).dataset?.lane).find(Boolean);

  if (!card) {
    const firstTry = Object.values(results).filter(Boolean).length;
    return (
      <div className="relative flex flex-col items-center gap-5 py-6 text-center">
        <Burst count={36} />
        <StageTitle eyebrow="Game over" title="Perfectly balanced">{firstTry} of {game.cards.length} on the first try.</StageTitle>
        <NibSays mood={firstTry === game.cards.length ? 'cheer' : 'idle'}>Starts with “why” or “what does it feel like”? Qual. “How many”, “which step”, “did it raise”? Quant.</NibSays>
        <Button size="xl" onPress={() => onDone(game.cards.map(c => ({ id: c.id, correct: !!results[c.id] })))}>Continue the story</Button>
      </div>
    );
  }

  const owner = game.lanes.find(l => l.id === feedback?.owner);
  return (
    <div className="flex flex-col gap-5">
      <StageTitle eyebrow="Play" title={game.title}>{game.instructions}</StageTitle>
      <p className="text-right text-sm font-semibold text-tertiary tabular-nums">{game.cards.length - deck.length} / {game.cards.length}</p>

      <motion.div key={turn} drag={!feedback} dragSnapToOrigin onDragEnd={(_, info) => { const l = laneAt(info.point.x, info.point.y); if (l) drop(l); }}
        initial={{ y: -40, opacity: 0 }} animate={feedback ? (feedback.ok ? { y: 120, opacity: 0, scale: 0.6 } : { x: [0, -12, 12, -8, 8, 0] }) : { y: 0, opacity: 1 }}
        transition={feedback ? { duration: 0.4 } : springs.pop} whileDrag={{ scale: 1.05, cursor: 'grabbing' }}
        className={cx('relative z-10 mx-auto w-full max-w-md cursor-grab touch-none rounded-2xl bg-primary px-5 py-4 text-center text-lg font-semibold text-primary shadow-xl ring-2 ring-inset select-none', feedback && !feedback.ok ? 'ring-error' : 'ring-secondary')}
        data-current-card>
        {card.label}
      </motion.div>

      {/* the scale */}
      <div className="relative mx-auto w-full max-w-xl">
        <motion.div animate={{ rotate: tilt }} transition={springs.gentle} className="relative mx-auto mt-4 h-1.5 w-[62%] origin-center sm:w-[86%] rounded-full bg-[var(--color-text-tertiary)]">
          {game.lanes.map((l, i) => (
            <motion.div key={l.id} animate={{ rotate: -tilt }} transition={springs.gentle}
              className={cx('absolute top-0 flex w-28 -translate-x-1/2 flex-col items-center sm:w-40', i ? 'left-full' : 'left-0')}>
              <span className="h-10 w-px bg-[var(--color-text-tertiary)]" />
              <button type="button" data-lane={l.id} onClick={() => drop(l.id)} disabled={!!feedback}
                className={cx('flex min-h-24 w-full flex-col-reverse items-stretch gap-1 rounded-b-[2rem] border-4 border-t-0 px-2 pt-2 pb-3 transition', feedback?.owner === l.id && !feedback.ok && 'ring-4 ring-mint-500')}
                style={{ borderColor: COLORS[i], background: `color-mix(in srgb, ${COLORS[i]} 10%, transparent)` }}>
                <span data-lane={l.id} className="text-center text-md font-black" style={{ color: COLORS[i] }}>{l.label}</span>
                {(pans[l.id] ?? []).map(q => (
                  <motion.span key={q} data-lane={l.id} initial={{ scale: 0, y: -20 }} animate={{ scale: 1, y: 0 }} transition={springs.pop}
                    className="h-2.5 rounded-full" style={{ background: COLORS[i] }} title={q} />
                ))}
              </button>
            </motion.div>
          ))}
        </motion.div>
        <div className="mx-auto mt-0 h-36 w-2 rounded-b bg-[var(--color-text-tertiary)]" aria-hidden />
        <div className="mx-auto h-2 w-28 rounded-full bg-[var(--color-text-tertiary)]" aria-hidden />
      </div>

      <div className="min-h-14">
        {feedback && !feedback.ok && owner && <NibSays mood="sad">That’s a <strong>{owner.label}</strong> question: {owner.hint.toLowerCase()}. It’ll come back round.</NibSays>}
      </div>
    </div>
  );
}
