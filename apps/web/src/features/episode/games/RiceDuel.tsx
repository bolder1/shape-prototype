'use client';
// Mini-game for st.1-3: two ideas side by side with their RICE inputs. Pick the one that scores higher, then watch both
// scores race up with the sum written out. Each card's `visual` holds both ideas (parsed by riceIdeas from @shape/content).
import { useState } from 'react';
import { motion } from 'motion/react';
import { CheckIcon, XIcon } from '@phosphor-icons/react/ssr';
import { riceIdeas, riceScore, type Episode, type RiceIdea } from '@shape/content';
import { springs } from '@shape/ui';
import { Button } from '@/components/base/buttons/button';
import { cx } from '@/utils/cx';
import { Burst, NibSays, StageTitle } from '../kit';
import type { GameResult } from './DiamondSort';
import { play } from '@/lib/sound';

type Game = Episode['game'];
const fmt = (n: number) => Math.round(n).toLocaleString('en-IN');

function IdeaCard({ idea, side, picked, winner, max, onPick }: { idea: RiceIdea; side: 'a' | 'b'; picked: string | null; winner: 'a' | 'b'; max: number; onPick: () => void }) {
  const s = riceScore(idea), shown = !!picked, won = winner === side;
  return (
    <motion.button type="button" onClick={onPick} disabled={shown} whileTap={{ scale: 0.98 }}
      className={cx('flex flex-col gap-3 rounded-2xl bg-primary p-4 text-left ring-2 ring-inset transition-colors disabled:cursor-default',
        shown ? (won ? 'ring-mint-600' : picked === side ? 'ring-error' : 'ring-secondary') : 'ring-secondary hover:bg-primary_hover')}>
      <span className="text-lg font-semibold text-primary">{idea.name}</span>
      <dl className="grid grid-cols-2 gap-x-3 gap-y-1 text-sm">
        {[['Reach', fmt(idea.reach)], ['Impact', String(idea.impact)], ['Confidence', `${idea.confidence}%`], ['Effort', `${idea.effort} wk`]].map(([k, v]) => (
          <div key={k} className="flex justify-between gap-2"><dt className="text-tertiary">{k}</dt><dd className="font-semibold text-primary tabular-nums">{v}</dd></div>
        ))}
      </dl>
      {shown && (
        <span className="flex flex-col gap-1">
          <span className="h-3 overflow-hidden rounded-full bg-secondary">
            <motion.span className={cx('block h-full rounded-full', won ? 'bg-mint-600' : 'bg-quaternary')} initial={{ width: 0 }} animate={{ width: `${Math.max(3, (s / max) * 100)}%` }} transition={{ ...springs.gentle, delay: 0.15 }} />
          </span>
          <span className="text-xs text-tertiary tabular-nums">{fmt(idea.reach)} × {idea.impact} × {idea.confidence}% ÷ {idea.effort} = <strong className="text-primary">{fmt(s)}</strong></span>
        </span>
      )}
    </motion.button>
  );
}

export function RiceDuel({ game, onDone }: { game: Game; onDone: (results: GameResult[]) => void }) {
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [results, setResults] = useState<Record<string, boolean>>({});
  const card = game.cards[i];
  const right = Object.values(results).filter(Boolean).length;

  if (!card) {
    return (
      <div className="relative flex flex-col items-center gap-5 py-6 text-center">
        <Burst count={36} />
        <StageTitle eyebrow="Game over" title={`${right} of ${game.cards.length} duels called right`}>Exciting and uncertain usually loses to boring and sure.</StageTitle>
        <NibSays mood={right === game.cards.length ? 'cheer' : 'idle'}>Watch confidence and effort: one multiplies, one divides. They swing more scores than reach does.</NibSays>
        <Button size="xl" onPress={() => onDone(game.cards.map(c => ({ id: c.id, correct: !!results[c.id] })))}>Continue the story</Button>
      </div>
    );
  }

  const [a, b] = riceIdeas(card.visual ?? '');
  const winner = card.lane as 'a' | 'b';
  const max = Math.max(riceScore(a), riceScore(b));
  const pick = (side: 'a' | 'b') => {
    if (picked) return;
    play(side === winner ? 'correct' : 'wrong');
    setPicked(side);
    setResults(r => ({ ...r, [card.id]: side === winner }));
  };
  const ok = picked === winner;

  return (
    <div className="flex flex-col gap-5">
      <StageTitle eyebrow="Play" title={game.title}>{game.instructions}</StageTitle>
      <div className="flex items-baseline justify-between">
        <p className="text-lg font-semibold text-primary" data-current-card>{card.label}</p>
        <span className="text-sm font-semibold text-tertiary tabular-nums">{i + 1} / {game.cards.length}</span>
      </div>
      <motion.div key={card.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={springs.pop} className="grid gap-3 sm:grid-cols-2">
        <IdeaCard idea={a} side="a" picked={picked} winner={winner} max={max} onPick={() => pick('a')} />
        <IdeaCard idea={b} side="b" picked={picked} winner={winner} max={max} onPick={() => pick('b')} />
      </motion.div>
      {picked && (
        <div className="flex flex-col gap-3">
          <NibSays mood={ok ? 'cheer' : 'sad'}>
            <span className="inline-flex items-center gap-1 font-semibold">{ok ? <CheckIcon className="size-4" weight="bold" /> : <XIcon className="size-4" weight="bold" />}{ok ? 'Right.' : 'Not this time.'}</span>{' '}
            <strong>{(winner === 'a' ? a : b).name}</strong> scores {fmt(max)} against {fmt(Math.min(riceScore(a), riceScore(b)))}.
          </NibSays>
          <div className="flex justify-end"><Button size="lg" onPress={() => { setPicked(null); setI(n => n + 1); }}>{i + 1 < game.cards.length ? 'Next duel' : 'See results'}</Button></div>
        </div>
      )}
    </div>
  );
}
