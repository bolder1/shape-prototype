'use client';
// Mini-game for fd.3-1: the Kosh home screen (drawn by the scene's KoshHome) is up for review, and each card is a
// comment about one part of it (`visual`). Call it: just taste, or reasoned? Reasoned comments pin to the screen as
// numbered markers; taste goes to the "Ask why" tray with the question that would draw out a reason (`note`).
// Scored on the first call.
import { useState } from 'react';
import { motion } from 'motion/react';
import { CheckIcon, PushPinIcon, QuestionIcon, XIcon } from '@phosphor-icons/react/ssr';
import type { Episode, KoshPart } from '@shape/content';
import { Button } from '@/components/base/buttons/button';
import { cx } from '@/utils/cx';
import { Burst, FAMILY_SOLID, NibSays, StageTitle } from '../kit';
import { KOSH_BOX, KoshHome } from '../scenes/TasteReason';
import type { GameResult } from './DiamondSort';
import { play } from '@/lib/sound';

type Game = Episode['game'];
type Card = Game['cards'][number];

/** The phone with a numbered pin for every reasoned comment placed so far. */
function Board({ lit, pins }: { lit?: KoshPart | null; pins: Card[] }) {
  return (
    <svg viewBox="-4 -4 272 448" className="w-44 shrink-0 sm:w-52" role="img" aria-label={`The Kosh home screen with ${pins.length} reasoned comments pinned`}>
      <KoshHome lit={lit} />
      {pins.map((c, k) => {
        const box = KOSH_BOX[c.visual as KoshPart], same = pins.slice(0, k).filter(o => o.visual === c.visual).length;
        return (
          <motion.g key={c.id} initial={{ scale: 0 }} animate={{ scale: 1 }}>
            <circle cx={246 - same * 22} cy={box.y + 10} r={10} fill={FAMILY_SOLID[1]} />
            <text x={246 - same * 22} y={box.y + 14} textAnchor="middle" fontSize={11} fontWeight={800} fill="#fff">{k + 1}</text>
          </motion.g>
        );
      })}
    </svg>
  );
}

export function TasteFilter({ game, onDone }: { game: Game; onDone: (results: GameResult[]) => void }) {
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [results, setResults] = useState<Record<string, boolean>>({});
  const card = game.cards[i];
  const decided = game.cards.slice(0, picked ? i + 1 : i);
  const pins = decided.filter(c => c.lane === 'reason');
  const tray = decided.filter(c => c.lane === 'taste');
  const right = Object.values(results).filter(Boolean).length;

  const call = (laneId: string) => {
    if (!card || picked) return;
    const ok = laneId === card.lane;
    play(ok ? 'correct' : 'wrong');
    setPicked(laneId);
    setResults(r => ({ ...r, [card.id]: ok }));
  };

  const trayList = tray.length > 0 && (
    <div className="flex flex-col gap-2 rounded-2xl bg-secondary p-3">
      <span className="flex items-center gap-1.5 text-sm font-bold text-secondary"><QuestionIcon className="size-4" weight="bold" aria-hidden />Ask why</span>
      {tray.map(c => (
        <div key={c.id} className="flex flex-col gap-0.5 rounded-xl bg-primary px-3 py-2 text-left">
          <span className="text-sm font-semibold text-tertiary line-through decoration-1">{c.label}</span>
          <span className="text-sm text-primary">{c.note}</span>
        </div>
      ))}
    </div>
  );

  if (!card) {
    return (
      <div className="relative flex flex-col items-center gap-5 py-6 text-center">
        <Burst count={36} />
        <StageTitle eyebrow="Review sorted" title={`${right} of ${game.cards.length} comments called right`}>
          {pins.length} reasons pinned to the screen; {tray.length} preferences waiting on a “why”.
        </StageTitle>
        <div className="flex w-full flex-col items-center gap-5 sm:flex-row sm:items-start">
          <Board pins={pins} />
          <ol className="flex w-full flex-col gap-2 text-left">
            {pins.map((c, k) => (
              <li key={c.id} className="flex gap-2 rounded-xl bg-primary px-3 py-2 text-sm text-primary ring-1 ring-secondary ring-inset">
                <span className="flex size-5 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white" style={{ background: FAMILY_SOLID[1] }}>{k + 1}</span>{c.label}
              </li>
            ))}
          </ol>
        </div>
        <div className="w-full">{trayList}</div>
        <NibSays mood={right === game.cards.length ? 'cheer' : 'idle'}>Next review you’re in, listen for “I like” and “make it pop”, and ask: what makes you say that?</NibSays>
        <Button size="xl" onPress={() => onDone(game.cards.map(c => ({ id: c.id, correct: !!results[c.id] })))}>Continue the story</Button>
      </div>
    );
  }

  const ok = picked === card.lane, answer = game.lanes.find(l => l.id === card.lane)!;
  return (
    <div className="flex flex-col gap-5">
      <StageTitle eyebrow="Play" title={game.title}>{game.instructions}</StageTitle>
      <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-start">
        <Board lit={card.visual as KoshPart} pins={pins} />
        <div className="flex w-full flex-col gap-4">
          <div className="flex items-baseline justify-between">
            <span className="text-sm font-semibold text-tertiary">A reviewer says</span>
            <span className="text-sm font-semibold text-tertiary tabular-nums">{i + 1} / {game.cards.length}</span>
          </div>
          <motion.div key={card.id} initial={{ y: -12, opacity: 0 }} animate={picked && !ok ? { x: [0, -10, 10, -6, 6, 0], opacity: 1, y: 0 } : { y: 0, opacity: 1 }} transition={{ duration: 0.4 }}
            className={cx('relative rounded-2xl rounded-bl-sm bg-primary px-5 py-4 text-lg font-semibold text-primary shadow-lg ring-2 ring-inset', !picked ? 'ring-secondary' : ok ? 'ring-mint-600' : 'ring-error')} data-current-card>
            {card.label}
          </motion.div>
          <div className="grid grid-cols-2 gap-3">
            {game.lanes.map(l => (
              <motion.button key={l.id} type="button" onClick={() => call(l.id)} disabled={!!picked} whileTap={{ scale: 0.96 }}
                className={cx('flex items-start gap-2 rounded-2xl bg-primary px-4 py-3 text-left ring-2 ring-secondary ring-inset transition disabled:cursor-default',
                  !picked && 'hover:bg-primary_hover', picked && l.id !== picked && l.id !== card.lane && 'opacity-40', picked && l.id === card.lane && 'ring-mint-600', picked === l.id && !ok && 'ring-error')}>
                {l.id === 'reason' ? <PushPinIcon className="mt-0.5 size-5 shrink-0 text-fg-secondary" weight="bold" aria-hidden /> : <QuestionIcon className="mt-0.5 size-5 shrink-0 text-fg-secondary" weight="bold" aria-hidden />}
                <span className="flex flex-col gap-0.5">
                  <span className="text-md font-bold text-primary">{l.label}</span>
                  <span className="text-xs text-tertiary">{l.hint}</span>
                </span>
              </motion.button>
            ))}
          </div>
          {picked && (
            <div className="flex flex-col gap-3">
              <NibSays mood={ok ? 'cheer' : 'sad'}>
                <span className="inline-flex items-center gap-1 font-semibold">{ok ? <CheckIcon className="size-4" weight="bold" /> : <XIcon className="size-4" weight="bold" />}{answer.label}.</span>{' '}{card.note}
              </NibSays>
              <div className="flex justify-end"><Button size="lg" onPress={() => { setPicked(null); setI(n => n + 1); }}>{i + 1 < game.cards.length ? 'Next comment' : 'See the review'}</Button></div>
            </div>
          )}
          {trayList}
        </div>
      </div>
    </div>
  );
}
