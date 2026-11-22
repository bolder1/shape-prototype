'use client';
// Mini-game for ui.2-3: each card sets a real heading and paragraph in the fonts its `visual` names
// ("headingFont|weight|bodyFont|weight", optional "|flat" for same size, or "five"). Judge: works or clashes?
// Every card's `note` explains the verdict. Scored on the first pick.
import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { CheckIcon, LightningIcon, XIcon } from '@phosphor-icons/react/ssr';
import type { Episode } from '@shape/content';
import { springs } from '@shape/ui';
import { Button } from '@/components/base/buttons/button';
import { cx } from '@/utils/cx';
import { Burst, NibSays, StageTitle } from '../kit';
import { FONT } from '../scenes/FontPairing';
import type { GameResult } from './DiamondSort';
import { play } from '@/lib/sound';

type Game = Episode['game'];
const HEAD = 'Monsoon recipes';
const BODY = 'Simple dals and curries for rainy evenings, each one ready in under thirty minutes with what’s already in your kitchen.';
/** The four body lines of the five-font card, each in its own font (the heading is the fifth). */
const FIVE = ['script', 'mono', 'serif', 'verdana'];

function Specimen({ visual }: { visual?: string }) {
  if (visual === 'five') {
    return (
      <div className="flex flex-col gap-1.5">
        <p style={{ fontFamily: FONT.display, fontSize: 30 }}>{HEAD.toUpperCase()}</p>
        {['Simple dals and curries', 'for rainy evenings,', 'ready in thirty minutes', 'with what’s in your kitchen.'].map((l, i) => (
          <p key={l} style={{ fontFamily: FONT[FIVE[i]], fontSize: i === 0 ? 22 : 17, fontWeight: i === 2 ? 700 : 400 }}>{l}</p>
        ))}
      </div>
    );
  }
  const [h, hw, b, bw, flat] = (visual ?? 'sans|700|sans|400').split('|');
  return (
    <div className="flex flex-col gap-2">
      <p style={{ fontFamily: FONT[h], fontWeight: Number(hw), fontSize: flat ? 17 : 32, lineHeight: 1.15 }}>{HEAD}</p>
      <p style={{ fontFamily: FONT[b], fontWeight: Number(bw), fontSize: 17, lineHeight: 1.55 }}>{BODY}</p>
    </div>
  );
}

export function PairJudge({ game, onDone }: { game: Game; onDone: (results: GameResult[]) => void }) {
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
        <StageTitle eyebrow="Game over" title={`${right} of ${game.cards.length} pairings judged right`}>Two fonts at most, clearly different, body chosen for reading.</StageTitle>
        <NibSays mood={right === game.cards.length ? 'cheer' : 'idle'}>When in doubt, use one good family in two or three weights. You can’t clash with yourself.</NibSays>
        <Button size="xl" onPress={() => onDone(game.cards.map(c => ({ id: c.id, correct: !!results[c.id] })))}>Continue the story</Button>
      </div>
    );
  }

  const ok = picked === card.lane, works = card.lane === 'works';
  return (
    <div className="flex flex-col gap-5">
      <StageTitle eyebrow="Play" title={game.title}>{game.instructions}</StageTitle>
      <div className="flex items-baseline justify-between">
        <span className="text-sm font-semibold text-tertiary">Specimen</span>
        <span className="text-sm font-semibold text-tertiary tabular-nums">{i + 1} / {game.cards.length}</span>
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={card.id} initial={{ y: -16, opacity: 0, rotate: -1.5 }} animate={picked && !ok ? { x: [0, -10, 10, -6, 6, 0], opacity: 1, rotate: 0, y: 0 } : { y: 0, opacity: 1, rotate: 0 }}
          exit={{ x: 60, opacity: 0 }} transition={picked && !ok ? { duration: 0.4 } : springs.pop}
          className={cx('relative flex flex-col gap-3 rounded-2xl bg-primary p-6 text-primary shadow-lg ring-2 ring-inset', !picked ? 'ring-secondary' : ok ? 'ring-mint-600' : 'ring-error')}
          data-current-card>
          {picked && ok && <Burst count={14} />}
          <Specimen visual={card.visual} />
          <p className="border-t border-secondary pt-3 text-sm font-semibold text-tertiary">{card.label}</p>
        </motion.div>
      </AnimatePresence>

      <div className="grid grid-cols-2 gap-3">
        {game.lanes.map(l => (
          <motion.button key={l.id} type="button" onClick={() => pick(l.id)} disabled={!!picked} whileTap={{ scale: 0.96 }}
            className={cx('flex items-center justify-center gap-2 rounded-2xl px-4 py-4 text-lg font-bold text-white transition disabled:cursor-default',
              l.id === 'works' ? 'bg-mint-600' : 'bg-error-solid', picked && l.id !== picked && l.id !== card.lane && 'opacity-40', picked && l.id === card.lane && 'ring-4 ring-mint-300')}>
            {l.id === 'works' ? <CheckIcon className="size-5" weight="bold" /> : <LightningIcon className="size-5" weight="fill" />}{l.label}
          </motion.button>
        ))}
      </div>

      {picked && (
        <div className="flex flex-col gap-3">
          <NibSays mood={ok ? 'cheer' : 'sad'}>
            <span className="inline-flex items-center gap-1 font-semibold">{ok ? <CheckIcon className="size-4" weight="bold" /> : <XIcon className="size-4" weight="bold" />}{works ? 'It works.' : 'It clashes.'}</span>{' '}
            {card.note}
          </NibSays>
          <div className="flex justify-end"><Button size="lg" onPress={() => { setPicked(null); setI(n => n + 1); }}>{i + 1 < game.cards.length ? 'Next specimen' : 'See results'}</Button></div>
        </div>
      )}
    </div>
  );
}
