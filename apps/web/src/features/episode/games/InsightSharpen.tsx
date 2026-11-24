'use client';
// Mini-game for rs.3-2: Arjun's draft insights from the Dawaa study, one at a time. Diagnose each: no why, no one in
// it, a feature in disguise, or already sharp. Then the insight is rebuilt as three blocks, who · what they do ·
// because (`visual`, parsed by `insightParts`), and the block the draft was missing lights up as added. A feature is
// struck and rebuilt whole. One call per draft; the end lists the sharpened set.
import { useState } from 'react';
import { motion } from 'motion/react';
import { CheckIcon, XIcon } from '@phosphor-icons/react/ssr';
import { insightParts, type Episode } from '@shape/content';
import { springs } from '@shape/ui';
import { Button } from '@/components/base/buttons/button';
import { cx } from '@/utils/cx';
import { Burst, FAMILY_SOLID, NibSays, StageTitle } from '../kit';
import type { GameResult } from './DiamondSort';
import { play } from '@/lib/sound';

type Game = Episode['game'];
type Card = Game['cards'][number];
const PARTS = [{ k: 'who', n: 'Who', c: FAMILY_SOLID[0] }, { k: 'what', n: 'What they do', c: FAMILY_SOLID[2] }, { k: 'why', n: 'Because', c: FAMILY_SOLID[1] }] as const;
/** Which blocks each diagnosis adds. */
const ADDED: Record<string, readonly string[]> = { why: ['why'], who: ['who'], fix: ['who', 'what', 'why'], good: [] };

/** The insight as three coloured blocks; `added` blocks are marked as new. */
function Blocks({ card, added, compact = false }: { card: Card; added: readonly string[]; compact?: boolean }) {
  const parts = insightParts(card.visual ?? '');
  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-[1fr_1.2fr_1.6fr]">
      {PARTS.map((p, k) => {
        const isNew = added.includes(p.k);
        return (
          <motion.div key={p.k} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ ...springs.pop, delay: compact ? 0 : 0.15 + k * 0.25 }}
            className={cx('flex flex-col gap-1 rounded-xl text-white', compact ? 'px-3 py-2' : 'px-4 py-3', isNew && !compact && 'ring-4 ring-mint-600')}
            style={{ background: p.c }}>
            <span className="flex items-center justify-between text-xs font-bold tracking-wide uppercase">{p.n}{isNew && !compact && <span className="rounded-full bg-white px-1.5 py-0.5 text-[10px] text-black">Added</span>}</span>
            <span className={cx('font-semibold', compact ? 'text-sm' : 'text-md')}>{parts[p.k]}</span>
          </motion.div>
        );
      })}
    </div>
  );
}

export function InsightSharpen({ game, onDone }: { game: Game; onDone: (results: GameResult[]) => void }) {
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [results, setResults] = useState<Record<string, boolean>>({});
  const card = game.cards[i];

  const call = (laneId: string) => {
    if (!card || picked) return;
    const ok = laneId === card.lane;
    play(ok ? 'correct' : 'wrong');
    setPicked(laneId);
    setResults(r => ({ ...r, [card.id]: ok }));
  };

  if (!card) {
    const right = Object.values(results).filter(Boolean).length;
    return (
      <div className="relative flex flex-col items-center gap-5 py-6 text-center">
        <Burst count={36} />
        <StageTitle eyebrow="Insights sharpened" title={`${right} of ${game.cards.length} drafts diagnosed right`}>
          Every one now says who, what they do, and because.
        </StageTitle>
        <ol className="flex w-full flex-col gap-3 text-left">
          {game.cards.map(c => <li key={c.id}><Blocks card={c} added={[]} compact /></li>)}
        </ol>
        <NibSays mood={right === game.cards.length ? 'cheer' : 'idle'}>Before you share an insight, read it back and check for all three parts. If you can name a feature in it, you skipped the why.</NibSays>
        <Button size="xl" onPress={() => onDone(game.cards.map(c => ({ id: c.id, correct: !!results[c.id] })))}>Continue the story</Button>
      </div>
    );
  }

  const ok = picked === card.lane, answer = game.lanes.find(l => l.id === card.lane)!;
  return (
    <div className="flex flex-col gap-5">
      <StageTitle eyebrow="Play" title={game.title}>{game.instructions}</StageTitle>
      <div className="flex items-baseline justify-between">
        <span className="text-sm font-semibold text-tertiary">Arjun’s draft</span>
        <span className="text-sm font-semibold text-tertiary tabular-nums">{i + 1} / {game.cards.length}</span>
      </div>
      <motion.div key={card.id} initial={{ y: -12, opacity: 0 }} animate={picked && !ok ? { x: [0, -10, 10, -6, 6, 0], opacity: 1, y: 0 } : { y: 0, opacity: 1 }} transition={{ duration: 0.4 }}
        className={cx('rounded-2xl bg-primary px-5 py-4 text-lg font-semibold shadow-lg ring-2 ring-inset', !picked ? 'ring-secondary' : ok ? 'ring-mint-600' : 'ring-error')} data-current-card>
        <span className={cx('transition-colors', picked && card.lane !== 'good' ? 'text-tertiary line-through decoration-2' : 'text-primary')}>{card.label}</span>
      </motion.div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {game.lanes.map(l => (
          <motion.button key={l.id} type="button" onClick={() => call(l.id)} disabled={!!picked} whileTap={{ scale: 0.96 }}
            className={cx('flex flex-col items-start gap-0.5 rounded-2xl bg-primary px-3 py-3 text-left ring-2 ring-secondary ring-inset transition disabled:cursor-default',
              !picked && 'hover:bg-primary_hover', picked && l.id !== picked && l.id !== card.lane && 'opacity-40', picked && l.id === card.lane && 'ring-mint-600', picked === l.id && !ok && 'ring-error')}>
            <span className="text-md font-bold text-primary">{l.label}</span>
            <span className="text-xs leading-tight text-tertiary">{l.hint}</span>
          </motion.button>
        ))}
      </div>
      {picked && (
        <div className="flex flex-col gap-3">
          <NibSays mood={ok ? 'cheer' : 'sad'}>
            <span className="inline-flex items-center gap-1 font-semibold">{ok ? <CheckIcon className="size-4" weight="bold" /> : <XIcon className="size-4" weight="bold" />}{answer.label}.</span>{' '}{card.note}
          </NibSays>
          <Blocks key={card.id} card={card} added={ADDED[card.lane] ?? []} />
          <div className="flex justify-end"><Button size="lg" onPress={() => { setPicked(null); setI(n => n + 1); }}>{i + 1 < game.cards.length ? 'Next draft' : 'See the set'}</Button></div>
        </div>
      )}
    </div>
  );
}
