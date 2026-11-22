'use client';
// Mini-game for rs.2-2: an interview as a chat. The participant has just said something (`visual`); the interviewer's
// follow-up (`label`) appears. Does it open the story up or close it down? Weak follow-ups (first lane) are then replaced
// by a better one (`note`). First call scores.
import { useState } from 'react';
import { motion } from 'motion/react';
import { CheckIcon, XIcon } from '@phosphor-icons/react/ssr';
import type { Episode } from '@shape/content';
import { springs } from '@shape/ui';
import { Button } from '@/components/base/buttons/button';
import { cx } from '@/utils/cx';
import { Burst, NibSays, StageTitle } from '../kit';
import type { GameResult } from './DiamondSort';
import { play } from '@/lib/sound';

type Game = Episode['game'];

export function ChatProbe({ game, onDone }: { game: Game; onDone: (results: GameResult[]) => void }) {
  const [closes, opens] = game.lanes;
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [results, setResults] = useState<Record<string, boolean>>({});
  const card = game.cards[i];
  const right = Object.values(results).filter(Boolean).length;

  if (!card) {
    return (
      <div className="relative flex flex-col items-center gap-5 py-6 text-center">
        <Burst count={36} />
        <StageTitle eyebrow="Interview over" title={`${right} of ${game.cards.length} follow-ups called right`}>Open, follow, wait.</StageTitle>
        <NibSays mood={right === game.cards.length ? 'cheer' : 'idle'}>A good follow-up uses their words and asks for the story, never your guess.</NibSays>
        <Button size="xl" onPress={() => onDone(game.cards.map(c => ({ id: c.id, correct: !!results[c.id] })))}>Continue the story</Button>
      </div>
    );
  }

  const ok = picked === card.lane, weak = card.lane === closes.id;
  const call = (laneId: string) => {
    if (picked) return;
    play(laneId === card.lane ? 'correct' : 'wrong');
    setPicked(laneId);
    setResults(r => ({ ...r, [card.id]: laneId === card.lane }));
  };

  return (
    <div className="flex flex-col gap-5">
      <StageTitle eyebrow="Play" title={game.title}>{game.instructions}</StageTitle>
      <p className="text-right text-sm font-semibold text-tertiary tabular-nums">{i + 1} / {game.cards.length}</p>

      {/* the chat */}
      <motion.div key={card.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-3 rounded-2xl bg-secondary p-4 ring-1 ring-secondary ring-inset">
        <motion.div initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={springs.pop} className="flex flex-col items-end gap-1 self-end">
          <span className="text-xs font-semibold text-tertiary">Participant</span>
          <span className="max-w-[80%] rounded-2xl rounded-tr-sm bg-primary px-4 py-2.5 text-md font-medium text-primary italic shadow-sm ring-1 ring-secondary ring-inset">{card.visual}</span>
        </motion.div>
        <motion.div initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ ...springs.pop, delay: 0.35 }} className="flex flex-col items-start gap-1 self-start">
          <span className="text-xs font-semibold text-tertiary">You</span>
          <span className={cx('max-w-[80%] rounded-2xl rounded-tl-sm px-4 py-2.5 text-md font-semibold text-white', picked && weak ? 'bg-quaternary line-through' : 'bg-brand-solid')} data-current-card>{card.label}</span>
          {picked && weak && card.note && (
            <motion.span initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ ...springs.pop, delay: 0.2 }}
              className="max-w-[80%] rounded-2xl rounded-tl-sm bg-mint-600 px-4 py-2.5 text-md font-semibold text-white">{card.note}</motion.span>
          )}
        </motion.div>
      </motion.div>

      {!picked ? (
        <div className="grid grid-cols-2 gap-3">
          {[closes, opens].map((l, k) => (
            <motion.button key={l.id} type="button" whileTap={{ scale: 0.96 }} onClick={() => call(l.id)}
              className="rounded-2xl px-3 py-4 text-left text-white" style={{ background: k ? 'var(--color-family-grow-solid)' : 'var(--color-family-build-solid)' }}>
              <span className="block text-md font-bold">{l.label}</span>
              <span className="block text-xs font-medium opacity-90">{l.hint}</span>
            </motion.button>
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          <NibSays mood={ok ? 'cheer' : 'sad'}>
            <span className="inline-flex items-center gap-1 font-semibold">{ok ? <CheckIcon className="size-4" weight="bold" /> : <XIcon className="size-4" weight="bold" />}{ok ? 'Right.' : 'Not quite.'}</span>{' '}
            {weak ? 'It closes the door or puts words in their mouth. The green one keeps the story going.' : 'It invites them to keep talking, in their own words.'}
          </NibSays>
          <div className="flex justify-end"><Button size="lg" onPress={() => { setPicked(null); setI(n => n + 1); }}>{i + 1 < game.cards.length ? 'Next moment' : 'See results'}</Button></div>
        </div>
      )}
    </div>
  );
}
