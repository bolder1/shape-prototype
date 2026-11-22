'use client';
// Mini-game for cw.1-1: each line flashes on a phone for 1.6 seconds, like a real glance, then blurs. Call it: did it
// tell you what happens, or make you think? Unclear lines (first lane) are then shown with their clear rewrite (`note`).
import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowCounterClockwiseIcon, CheckIcon, EyeIcon, XIcon } from '@phosphor-icons/react/ssr';
import type { Episode } from '@shape/content';
import { springs } from '@shape/ui';
import { Button } from '@/components/base/buttons/button';
import { Burst, NibSays, StageTitle } from '../kit';
import type { GameResult } from './DiamondSort';
import { play } from '@/lib/sound';

type Game = Episode['game'];
const FLASH_MS = 1600;

export function GlanceTest({ game, onDone }: { game: Game; onDone: (results: GameResult[]) => void }) {
  const [unclear, clear] = game.lanes;
  const [i, setI] = useState(0);
  const [phase, setPhase] = useState<'flash' | 'call' | 'reveal'>('flash');
  const [flashKey, setFlashKey] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [results, setResults] = useState<Record<string, boolean>>({});
  const card = game.cards[i];
  const right = Object.values(results).filter(Boolean).length;

  // Each card (and each replay) flashes, then blurs.
  useEffect(() => {
    if (!card || phase !== 'flash') return;
    const id = setTimeout(() => setPhase('call'), FLASH_MS);
    return () => clearTimeout(id);
  }, [card, phase, flashKey]);

  if (!card) {
    return (
      <div className="relative flex flex-col items-center gap-5 py-6 text-center">
        <Burst count={36} />
        <StageTitle eyebrow="Game over" title={`${right} of ${game.cards.length} called right`}>If it needs a second look, it needs a rewrite.</StageTitle>
        <NibSays mood={right === game.cards.length ? 'cheer' : 'idle'}>The test you just did is the one real people do with every screen, all day long.</NibSays>
        <Button size="xl" onPress={() => onDone(game.cards.map(c => ({ id: c.id, correct: !!results[c.id] })))}>Continue the story</Button>
      </div>
    );
  }

  const call = (laneId: string) => {
    if (phase === 'reveal') return;
    const ok = laneId === card.lane;
    play(ok ? 'correct' : 'wrong');
    setPicked(laneId);
    setResults(r => ({ ...r, [card.id]: ok }));
    setPhase('reveal');
  };
  const next = () => { setPicked(null); setPhase('flash'); setFlashKey(k => k + 1); setI(n => n + 1); };
  const ok = picked === card.lane;

  return (
    <div className="flex flex-col gap-5">
      <StageTitle eyebrow="Play" title={game.title}>{game.instructions}</StageTitle>
      <p className="text-right text-sm font-semibold text-tertiary tabular-nums">{i + 1} / {game.cards.length}</p>

      {/* the phone */}
      <div className="relative mx-auto flex h-64 w-full max-w-xs flex-col items-center justify-center overflow-hidden rounded-[2rem] bg-primary px-6 text-center shadow-xl ring-2 ring-secondary ring-inset">
        <motion.p key={`${card.id}-${flashKey}`} initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1, filter: phase === 'call' ? 'blur(10px)' : 'blur(0px)' }}
          transition={{ duration: 0.25 }} className="text-display-xs font-semibold text-primary" data-current-card>
          {card.label}
        </motion.p>
        {phase === 'reveal' && card.lane === unclear.id && card.note && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ ...springs.pop, delay: 0.2 }} className="mt-4 rounded-xl bg-mint-600/15 px-3 py-2 ring-1 ring-mint-600/40 ring-inset">
            <p className="text-xs font-bold tracking-wide text-mint-700 uppercase">Clear version</p>
            <p className="text-md font-semibold text-primary">{card.note}</p>
          </motion.div>
        )}
        {phase === 'flash' && (
          <span className="absolute inset-x-0 bottom-0 h-1.5 bg-secondary">
            <motion.span key={flashKey} className="block h-full bg-[var(--color-family-build)]" initial={{ width: '100%' }} animate={{ width: '0%' }} transition={{ duration: FLASH_MS / 1000, ease: 'linear' }} />
          </span>
        )}
        <span className="absolute top-3 left-4 inline-flex items-center gap-1 text-xs font-semibold text-tertiary"><EyeIcon className="size-3.5" weight="bold" />{phase === 'flash' ? 'Glance…' : phase === 'call' ? 'Time’s up' : 'Revealed'}</span>
      </div>

      {phase !== 'reveal' ? (
        <div className="flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-3">
            {[unclear, clear].map((l, k) => (
              <motion.button key={l.id} type="button" whileTap={{ scale: 0.96 }} onClick={() => call(l.id)} disabled={phase === 'flash'}
                className="rounded-2xl px-3 py-4 text-left text-white transition disabled:opacity-50" style={{ background: k ? 'var(--color-family-grow)' : 'var(--color-family-build)' }}>
                <span className="block text-md font-bold">{l.label}</span>
                <span className="block text-xs font-medium opacity-90">{l.hint}</span>
              </motion.button>
            ))}
          </div>
          {phase === 'call' && (
            <button type="button" onClick={() => { setPhase('flash'); setFlashKey(k => k + 1); }} className="inline-flex items-center gap-1.5 self-center text-sm font-semibold text-tertiary hover:text-secondary">
              <ArrowCounterClockwiseIcon className="size-4" />Glance again
            </button>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          <NibSays mood={ok ? 'cheer' : 'sad'}>
            <span className="inline-flex items-center gap-1 font-semibold">{ok ? <CheckIcon className="size-4" weight="bold" /> : <XIcon className="size-4" weight="bold" />}{ok ? 'Right.' : 'Not quite.'}</span>{' '}
            {card.lane === unclear.id ? 'It sounds fun, but a glance doesn’t tell you what happens.' : 'Plain and specific: you know what it does in one look.'}
          </NibSays>
          <div className="flex justify-end"><Button size="lg" onPress={next}>{i + 1 < game.cards.length ? 'Next line' : 'See results'}</Button></div>
        </div>
      )}
    </div>
  );
}
