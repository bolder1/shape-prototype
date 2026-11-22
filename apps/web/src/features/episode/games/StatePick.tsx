'use client';
// Mini-game for ia.2-3: each card is a moment in a lunch app. Pick the state the screen should show (empty, loading,
// error, success); the phone, drawn by the scene's PhoneState with the card's own wording (`visual`), then shows that
// state designed properly, and the card's `note` says why. Scored on the first pick.
import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { CheckIcon, XIcon } from '@phosphor-icons/react/ssr';
import type { Episode } from '@shape/content';
import { Button } from '@/components/base/buttons/button';
import { cx } from '@/utils/cx';
import { Burst, NibSays, StageTitle } from '../kit';
import { PhoneState, type UiState } from '../scenes/UiStates';
import type { GameResult } from './DiamondSort';
import { play } from '@/lib/sound';

type Game = Episode['game'];

/** Ticks while loading is on screen, so the skeleton pulses. */
function usePulse(on: boolean) {
  const [t, setT] = useState(0);
  useEffect(() => {
    if (!on) return;
    const id = setInterval(() => setT(x => x + 0.05), 50);
    return () => clearInterval(id);
  }, [on]);
  return t;
}

export function StatePick({ game, onDone }: { game: Game; onDone: (results: GameResult[]) => void }) {
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [results, setResults] = useState<Record<string, boolean>>({});
  const card = game.cards[i];
  const right = Object.values(results).filter(Boolean).length;
  const shown: UiState = picked && card ? (card.lane as UiState) : 'blank';
  const t = usePulse(shown === 'loading');

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
        <StageTitle eyebrow="States designed" title={`${right} of ${game.cards.length} moments matched`}>Empty, loading, error, success: one screen, four designs.</StageTitle>
        <div className="flex flex-wrap justify-center gap-3">
          {(['empty', 'loading', 'error', 'success'] as const).map(s => (
            <div key={s} className="flex flex-col items-center gap-1">
              <svg viewBox="-4 -4 248 448" className="w-28" aria-hidden><PhoneState state={s} t={1.2} header="Dabba" /></svg>
              <span className="text-xs font-bold text-secondary">{game.lanes.find(l => l.id === s)?.label}</span>
            </div>
          ))}
        </div>
        <NibSays mood={right === game.cards.length ? 'cheer' : 'idle'}>Open any screen you’ve designed and ask: what does it look like with nothing, while waiting, when it breaks, and when it works?</NibSays>
        <Button size="xl" onPress={() => onDone(game.cards.map(c => ({ id: c.id, correct: !!results[c.id] })))}>Continue the story</Button>
      </div>
    );
  }

  const ok = picked === card.lane, answer = game.lanes.find(l => l.id === card.lane)!;
  return (
    <div className="flex flex-col gap-5">
      <StageTitle eyebrow="Play" title={game.title}>{game.instructions}</StageTitle>
      <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-start">
        <motion.svg key={`${card.id}-${shown}`} initial={{ scale: 0.96, opacity: 0.6 }} animate={{ scale: 1, opacity: 1 }} viewBox="-4 -4 248 448"
          className="w-40 shrink-0 sm:w-48" role="img" aria-label={picked ? `The screen in its ${answer.label.toLowerCase()} state` : 'The screen, waiting for your call'}>
          <PhoneState state={shown} t={t} copy={card.visual} header="Dabba" />
          {shown === 'blank' && <text x={120} y={240} textAnchor="middle" fontSize={56} fontWeight={800} fill="var(--color-text-quaternary)">?</text>}
        </motion.svg>
        <div className="flex w-full flex-col gap-4">
          <div className="flex items-baseline justify-between">
            <span className="text-sm font-semibold text-tertiary">The moment</span>
            <span className="text-sm font-semibold text-tertiary tabular-nums">{i + 1} / {game.cards.length}</span>
          </div>
          <motion.div key={card.id} initial={{ y: -12, opacity: 0 }} animate={picked && !ok ? { x: [0, -10, 10, -6, 6, 0], opacity: 1, y: 0 } : { y: 0, opacity: 1 }} transition={{ duration: 0.4 }}
            className={cx('rounded-2xl bg-primary px-5 py-4 text-lg font-semibold text-primary shadow-lg ring-2 ring-inset', !picked ? 'ring-secondary' : ok ? 'ring-mint-600' : 'ring-error')} data-current-card>
            {card.label}
          </motion.div>
          <div className="grid grid-cols-2 gap-3">
            {game.lanes.map(l => (
              <motion.button key={l.id} type="button" onClick={() => pick(l.id)} disabled={!!picked} whileTap={{ scale: 0.96 }}
                className={cx('flex flex-col items-start gap-0.5 rounded-2xl bg-primary px-4 py-3 text-left ring-2 ring-secondary ring-inset transition disabled:cursor-default',
                  !picked && 'hover:bg-primary_hover', picked && l.id !== picked && l.id !== card.lane && 'opacity-40', picked && l.id === card.lane && 'ring-mint-600', picked === l.id && !ok && 'ring-error')}>
                <span className="text-md font-bold text-primary">{l.label}</span>
                <span className="text-xs text-tertiary">{l.hint}</span>
              </motion.button>
            ))}
          </div>
          {picked && (
            <div className="flex flex-col gap-3">
              <NibSays mood={ok ? 'cheer' : 'sad'}>
                <span className="inline-flex items-center gap-1 font-semibold">{ok ? <CheckIcon className="size-4" weight="bold" /> : <XIcon className="size-4" weight="bold" />}{answer.label}.</span>{' '}{card.note}
              </NibSays>
              <div className="flex justify-end"><Button size="lg" onPress={() => { setPicked(null); setI(n => n + 1); }}>{i + 1 < game.cards.length ? 'Next moment' : 'See results'}</Button></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
