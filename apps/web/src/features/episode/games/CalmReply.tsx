'use client';
// Mini-game for fd.3-3: you're presenting, and each card is a comment from the room plus the defensive reply you feel
// like giving (`visual`). Pick the better move: ask, note it, or add context. The reflex is struck out and replaced by
// the better reply (`note`); a wrong move spikes your pulse line. Every exchange goes into the critique log. First pick
// scores.
import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { CheckIcon, XIcon } from '@phosphor-icons/react/ssr';
import type { Episode } from '@shape/content';
import { springs } from '@shape/ui';
import { Button } from '@/components/base/buttons/button';
import { cx } from '@/utils/cx';
import { Burst, FAMILY_SOLID, NibSays, StageTitle } from '../kit';
import type { GameResult } from './DiamondSort';
import { play } from '@/lib/sound';

type Game = Episode['game'];
/** Tag colour per move: a solid family fill that carries white text. */
const TONE: Record<string, string> = { ask: FAMILY_SOLID[0], note: FAMILY_SOLID[2], context: FAMILY_SOLID[1] };

/** A heartbeat that scrolls; `stress` (0–1) makes it spike higher and faster, and decays on its own. */
function PulseLine({ stress }: { stress: number }) {
  const [t, setT] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setT(x => x + 0.05), 50);
    return () => clearInterval(id);
  }, []);
  const amp = 4 + stress * 18, period = 60 - stress * 28, shift = (t * 70) % period;
  const pts: string[] = [];
  for (let x = 0; x <= 300; x += 3) {
    const ph = ((x + shift) % period) / period;
    pts.push(`${x},${24 + (ph > 0.42 && ph < 0.5 ? -amp : ph >= 0.5 && ph < 0.58 ? amp * 0.6 : 0)}`);
  }
  return (
    <svg viewBox="0 0 300 48" className="h-10 w-full" role="img" aria-label={stress > 0.4 ? 'Your pulse is racing' : 'Your pulse is calm'}>
      <polyline points={pts.join(' ')} fill="none" stroke={stress > 0.4 ? 'var(--color-fg-error-primary)' : '#2BC08A'} strokeWidth={2.5} strokeLinejoin="round" />
    </svg>
  );
}

export function CalmReply({ game, onDone }: { game: Game; onDone: (results: GameResult[]) => void }) {
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [results, setResults] = useState<Record<string, boolean>>({});
  const [stress, setStress] = useState(0.15);
  const card = game.cards[i];
  const right = Object.values(results).filter(Boolean).length;
  const log = game.cards.slice(0, picked ? i + 1 : i);

  useEffect(() => {
    if (stress <= 0.15) return;
    const id = setTimeout(() => setStress(s => Math.max(0.15, s - 0.05)), 120);
    return () => clearTimeout(id);
  }, [stress]);

  const move = (laneId: string) => {
    if (!card || picked) return;
    const ok = laneId === card.lane;
    play(ok ? 'correct' : 'wrong');
    if (!ok) setStress(1);
    setPicked(laneId);
    setResults(r => ({ ...r, [card.id]: ok }));
  };

  const logList = log.length > 0 && (
    <div className="flex flex-col gap-2 rounded-2xl bg-secondary p-3 text-left">
      <span className="text-sm font-bold text-secondary">Critique log</span>
      {log.map(c => (
        <div key={c.id} className="flex items-start gap-2 text-sm text-primary">
          <span className="shrink-0 rounded-full px-2 py-0.5 text-xs font-bold text-white" style={{ background: TONE[c.lane] }}>{game.lanes.find(l => l.id === c.lane)?.label}</span>
          <span>{c.label}</span>
        </div>
      ))}
    </div>
  );

  if (!card) {
    return (
      <div className="relative flex flex-col items-center gap-5 py-6 text-center">
        <Burst count={36} />
        <StageTitle eyebrow="Session over" title={`${right} of ${game.cards.length} comments answered calmly`}>No defences. Now sort the log against the goal: act on it, test it, or park it with a reason.</StageTitle>
        <div className="w-full">{logList}</div>
        <NibSays mood={right === game.cards.length ? 'cheer' : 'idle'}>Next time you feel the “But…” coming, swap it for a question. You can always explain later, once you know what they saw.</NibSays>
        <Button size="xl" onPress={() => onDone(game.cards.map(c => ({ id: c.id, correct: !!results[c.id] })))}>Continue the story</Button>
      </div>
    );
  }

  const ok = picked === card.lane, answer = game.lanes.find(l => l.id === card.lane)!;
  return (
    <div className="flex flex-col gap-5">
      <StageTitle eyebrow="Play" title={game.title}>{game.instructions}</StageTitle>
      <div className="flex items-center gap-3 rounded-2xl bg-primary px-4 py-2 ring-1 ring-secondary ring-inset">
        <span className="shrink-0 text-xs font-bold text-tertiary">Your pulse</span>
        <PulseLine stress={stress} />
        <span className="shrink-0 text-sm font-semibold text-tertiary tabular-nums">{i + 1} / {game.cards.length}</span>
      </div>
      <div className="flex flex-col gap-3">
        <motion.div key={card.id} initial={{ x: -16, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={springs.pop}
          className="max-w-[85%] self-start rounded-2xl rounded-tl-sm bg-primary px-4 py-3 text-lg font-semibold text-primary shadow-md ring-1 ring-secondary ring-inset" data-current-card>
          <span className="block text-xs font-bold text-tertiary">From the room</span>{card.label}
        </motion.div>
        <motion.div key={`${card.id}-reflex`} initial={{ x: 16, opacity: 0 }} animate={{ x: 0, opacity: picked ? 0.7 : 1 }} transition={{ ...springs.pop, delay: 0.2 }}
          className="max-w-[85%] self-end rounded-2xl rounded-tr-sm bg-secondary px-4 py-3 text-md text-secondary ring-1 ring-error ring-inset">
          <span className="block text-xs font-bold text-error-primary">Your reflex</span>
          <span className={cx(picked && 'line-through decoration-2')}>{card.visual}</span>
        </motion.div>
        {picked && (
          <motion.div initial={{ y: 8, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={springs.pop}
            className="max-w-[85%] self-end rounded-2xl rounded-tr-sm bg-primary px-4 py-3 text-md font-semibold text-primary ring-2 ring-mint-600 ring-inset">
            <span className="block text-xs font-bold text-tertiary">Better: {answer.label.toLowerCase()}</span>{card.note}
          </motion.div>
        )}
      </div>
      {!picked ? (
        <div className="grid grid-cols-3 gap-3">
          {game.lanes.map(l => (
            <motion.button key={l.id} type="button" onClick={() => move(l.id)} whileTap={{ scale: 0.96 }}
              className="flex flex-col items-start gap-1 rounded-2xl bg-primary px-3 py-3 text-left ring-2 ring-secondary ring-inset transition hover:bg-primary_hover">
              <span className="rounded-full px-2.5 py-0.5 text-sm font-bold text-white" style={{ background: TONE[l.id] }}>{l.label}</span>
              <span className="text-xs leading-tight text-tertiary">{l.hint}</span>
            </motion.button>
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          <NibSays mood={ok ? 'cheer' : 'sad'}>
            <span className="inline-flex items-center gap-1 font-semibold">{ok ? <CheckIcon className="size-4" weight="bold" /> : <XIcon className="size-4" weight="bold" />}{ok ? 'Calm and useful.' : `Better to ${answer.label.toLowerCase()} here.`}</span>{' '}{answer.hint}.
          </NibSays>
          <div className="flex justify-end"><Button size="lg" onPress={() => { setPicked(null); setI(n => n + 1); }}>{i + 1 < game.cards.length ? 'Next comment' : 'End the session'}</Button></div>
        </div>
      )}
      {logList}
    </div>
  );
}
