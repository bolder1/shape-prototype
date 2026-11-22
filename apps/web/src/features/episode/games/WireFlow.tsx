'use client';
// Mini-game for pr.1-3: each card is an interaction in a shopping app. Pick the Figma action that builds it and a mini
// prototype plays that action back (navigate slides to a new frame, overlay raises a sheet, back slides home, change flips
// a variant). A miss plays the right one beside yours. Scored on the first pick.
import { useState } from 'react';
import { motion } from 'motion/react';
import { CheckIcon, HeartIcon, XIcon } from '@phosphor-icons/react/ssr';
import type { Episode } from '@shape/content';
import { Button } from '@/components/base/buttons/button';
import { cx } from '@/utils/cx';
import { Burst, FAMILY_SOLID, NibSays, StageTitle } from '../kit';
import type { GameResult } from './DiamondSort';
import { play } from '@/lib/sound';

type Game = Episode['game'];

const Rows = ({ tone = '#e5e7eb' }: { tone?: string }) => (
  <div className="flex flex-col gap-1.5 p-2">{[0, 1, 2].map(r => <span key={r} className="h-8 rounded-md" style={{ background: tone }} />)}</div>
);

/** A 120 × 200 phone that plays one prototype action. */
function Demo({ action, label }: { action: string; label: string }) {
  const ease = { duration: 0.6, delay: 0.5, ease: 'easeInOut' } as const;
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative h-[200px] w-[120px] overflow-hidden rounded-2xl bg-white shadow-md ring-1 ring-black/10">
        {action === 'navigate' && (
          <>
            <motion.div className="absolute inset-0" initial={{ x: 0 }} animate={{ x: -120 }} transition={ease}><Rows /></motion.div>
            <motion.div className="absolute inset-0 bg-white" initial={{ x: 120 }} animate={{ x: 0 }} transition={ease}><div className="m-2 h-20 rounded-md bg-[#f59e0b]/70" /><Rows tone="#f3f4f6" /></motion.div>
          </>
        )}
        {action === 'overlay' && (
          <>
            <Rows />
            <motion.div className="absolute inset-0 bg-black" initial={{ opacity: 0 }} animate={{ opacity: 0.35 }} transition={ease} />
            <motion.div className="absolute inset-x-0 bottom-0 h-24 rounded-t-xl bg-white p-2" initial={{ y: 100 }} animate={{ y: 0 }} transition={ease}>
              <span className="block h-2 w-10 rounded-full bg-[#d1d5db]" /><span className="mt-2 block h-4 rounded bg-[#e5e7eb]" /><span className="mt-1.5 block h-4 rounded bg-[#e5e7eb]" />
            </motion.div>
          </>
        )}
        {action === 'back' && (
          <>
            <motion.div className="absolute inset-0" initial={{ x: -120 }} animate={{ x: 0 }} transition={ease}><Rows /></motion.div>
            <motion.div className="absolute inset-0 bg-white" initial={{ x: 0 }} animate={{ x: 120 }} transition={ease}><div className="m-2 h-20 rounded-md bg-[#f59e0b]/70" /><Rows tone="#f3f4f6" /></motion.div>
            <span className="absolute top-1 left-2 text-xs font-bold text-[#111827]">←</span>
          </>
        )}
        {action === 'change' && (
          <div className="flex h-full flex-col items-center justify-center gap-5">
            <motion.span className="relative h-6 w-11 rounded-full" initial={{ background: '#d1d5db' }} animate={{ background: '#2563eb' }} transition={ease}>
              <motion.span className="absolute top-0.5 left-0.5 size-5 rounded-full bg-white shadow" initial={{ x: 0 }} animate={{ x: 20 }} transition={ease} />
            </motion.span>
            <motion.span initial={{ color: '#9ca3af', scale: 1 }} animate={{ color: '#e11d48', scale: [1, 1.25, 1] }} transition={ease}><HeartIcon className="size-8" weight="fill" /></motion.span>
          </div>
        )}
      </div>
      <span className="text-xs font-semibold text-tertiary">{label}</span>
    </div>
  );
}

export function WireFlow({ game, onDone }: { game: Game; onDone: (results: GameResult[]) => void }) {
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [results, setResults] = useState<Record<string, boolean>>({});
  const card = game.cards[i];
  const right = Object.values(results).filter(Boolean).length;

  const pick = (laneId: string) => {
    if (!card || picked) return;
    const ok = laneId === card.lane;
    play(ok ? 'correct' : 'wrong');
    setPicked(laneId);
    setResults(r => ({ ...r, [card.id]: ok }));
  };

  if (!card) {
    return (
      <div className="relative flex flex-col items-center gap-5 py-6 text-center">
        <Burst count={36} />
        <StageTitle eyebrow="Game over" title={`${right} of ${game.cards.length} interactions wired right`}>Navigate, overlay, back, change: most prototypes need only these four.</StageTitle>
        <NibSays mood={right === game.cards.length ? 'cheer' : 'idle'}>Rule of thumb: if the old screen should still be there underneath, it’s an overlay.</NibSays>
        <Button size="xl" onPress={() => onDone(game.cards.map(c => ({ id: c.id, correct: !!results[c.id] })))}>Continue the story</Button>
      </div>
    );
  }

  const ok = picked === card.lane, owner = game.lanes.find(l => l.id === card.lane)!, mine = game.lanes.find(l => l.id === picked);
  return (
    <div className="flex flex-col gap-5">
      <StageTitle eyebrow="Play" title={game.title}>{game.instructions}</StageTitle>
      <div className="flex items-baseline justify-between gap-3">
        <p className="text-xl font-semibold text-primary" data-current-card>{card.label}</p>
        <span className="shrink-0 text-sm font-semibold text-tertiary tabular-nums">{i + 1} / {game.cards.length}</span>
      </div>
      <div className={cx('flex min-h-64 items-center justify-center gap-8 rounded-2xl bg-secondary p-5 ring-2 ring-inset transition-colors', !picked ? 'ring-secondary' : ok ? 'ring-mint-600' : 'ring-error')}>
        {!picked ? <span className="text-sm font-semibold text-tertiary">Pick an action to play it</span> : (
          <>
            <Demo key={`${card.id}-mine`} action={picked} label={ok ? mine!.label : `Yours · ${mine!.label}`} />
            {!ok && <Demo key={`${card.id}-right`} action={card.lane} label={`Needed · ${owner.label}`} />}
          </>
        )}
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {game.lanes.map((l, k) => (
          <motion.button key={l.id} type="button" onClick={() => pick(l.id)} disabled={!!picked} whileTap={{ scale: 0.96 }}
            className={cx('flex flex-col rounded-2xl px-3 py-3 text-left text-white transition disabled:cursor-default', picked && l.id !== picked && l.id !== card.lane && 'opacity-50',
              picked && l.id === card.lane && 'ring-4 ring-mint-500')}
            style={{ background: FAMILY_SOLID[k % 4] }}>
            <span className="text-md font-bold">{l.label}</span>
            <span className="text-xs font-medium opacity-90">{l.hint}</span>
          </motion.button>
        ))}
      </div>
      {picked && (
        <div className="flex flex-col gap-3">
          <NibSays mood={ok ? 'cheer' : 'sad'}>
            <span className="inline-flex items-center gap-1 font-semibold">{ok ? <CheckIcon className="size-4" weight="bold" /> : <XIcon className="size-4" weight="bold" />}{ok ? 'Wired.' : `That’s ${owner.label}.`}</span>{' '}
            {owner.hint}.
          </NibSays>
          <div className="flex justify-end"><Button size="lg" onPress={() => { setPicked(null); setI(n => n + 1); }}>{i + 1 < game.cards.length ? 'Next interaction' : 'See results'}</Button></div>
        </div>
      )}
    </div>
  );
}
