'use client';
// Mini-game for ia.3-1: Zoya's draft of the Khelo turf list, drawn by the scene's KheloList, mixes polish with
// placeholders. Each card points at one part of it (`visual`, one of KHELO_PARTS), ringed on the phone. Call it: make it
// plainer, make it realer, or leave it. Once called, the part redraws the right way (grey box, real words, or as it was)
// and the note says why. One call per part, scored on that call; the end shows the draft beside the fixed wireframe.
import { useState } from 'react';
import { motion } from 'motion/react';
import { CheckIcon, XIcon } from '@phosphor-icons/react/ssr';
import type { Episode, KheloPart } from '@shape/content';
import { Button } from '@/components/base/buttons/button';
import { cx } from '@/utils/cx';
import { Burst, NibSays, StageTitle } from '../kit';
import { KheloList } from '../scenes/StayUgly';
import type { GameResult } from './DiamondSort';
import { play } from '@/lib/sound';

type Game = Episode['game'];

function Phone({ fixed, focus, label }: { fixed: Partial<Record<KheloPart, boolean>>; focus?: KheloPart; label: string }) {
  return (
    <svg viewBox="-4 -4 248 478" className="mx-auto w-full max-w-60" role="img" aria-label={label}>
      <KheloList fixed={fixed} focus={focus} />
    </svg>
  );
}

export function FidelityTidy({ game, onDone }: { game: Game; onDone: (results: GameResult[]) => void }) {
  const [i, setI] = useState(0);
  const [calls, setCalls] = useState<Record<string, string>>({});
  const card = game.cards[i];
  const picked = card ? calls[card.id] : undefined;
  // a part shows fixed once its card is decided (the right fix is applied either way)
  const fixed = Object.fromEntries(game.cards.filter(c => calls[c.id]).map(c => [c.visual, c.lane !== 'fine'])) as Partial<Record<KheloPart, boolean>>;

  const call = (laneId: string) => {
    if (!card || picked) return;
    play(laneId === card.lane ? 'correct' : 'wrong');
    setCalls(c => ({ ...c, [card.id]: laneId }));
  };

  if (!card) {
    const right = game.cards.filter(c => calls[c.id] === c.lane).length;
    return (
      <div className="relative flex flex-col items-center gap-5 py-6 text-center">
        <Burst count={36} />
        <StageTitle eyebrow="Wireframe tidied" title={`${right} of ${game.cards.length} calls right`}>
          Same layout, two drafts. The one on the right gets feedback about structure.
        </StageTitle>
        <div className="grid w-full grid-cols-2 gap-3">
          {[{ n: 'Zoya’s draft', f: {} }, { n: 'At the right fidelity', f: fixed }].map(d => (
            <figure key={d.n} className="flex flex-col gap-2 rounded-2xl bg-primary p-3 ring-1 ring-secondary ring-inset">
              <Phone fixed={d.f} label={`${d.n}: the Khelo turf list`} />
              <figcaption className="text-sm font-semibold text-secondary">{d.n}</figcaption>
            </figure>
          ))}
        </div>
        <NibSays mood={right === game.cards.length ? 'cheer' : 'idle'}>Plain looks, real words. If someone can’t picture the final product, show them one polished sample screen, and keep reviewing structure on the grey ones.</NibSays>
        <Button size="xl" onPress={() => onDone(game.cards.map(c => ({ id: c.id, correct: calls[c.id] === c.lane })))}>Continue the story</Button>
      </div>
    );
  }

  const ok = picked === card.lane, owner = game.lanes.find(l => l.id === card.lane)!;
  return (
    <div className="flex flex-col gap-5">
      <StageTitle eyebrow="Play" title={game.title}>{game.instructions}</StageTitle>
      <div className="grid items-start gap-4 sm:grid-cols-[15rem_1fr]">
        <div className="rounded-2xl bg-primary p-3 ring-1 ring-secondary ring-inset">
          <Phone fixed={fixed} focus={card.visual as KheloPart} label={`The Khelo turf list, with the ${card.visual} ringed`} />
        </div>
        <div className="flex flex-col gap-4">
          <div className="flex items-baseline justify-between">
            <span className="text-sm font-semibold text-tertiary">The ringed part</span>
            <span className="text-sm font-semibold text-tertiary tabular-nums">{i + 1} / {game.cards.length}</span>
          </div>
          <motion.div key={card.id} initial={{ y: -12, opacity: 0 }} animate={picked && !ok ? { x: [0, -10, 10, -6, 6, 0], opacity: 1, y: 0 } : { y: 0, opacity: 1 }} transition={{ duration: 0.4 }}
            className={cx('rounded-2xl bg-primary px-5 py-4 text-lg font-semibold text-primary shadow-lg ring-2 ring-inset', !picked ? 'ring-secondary' : ok ? 'ring-mint-600' : 'ring-error')} data-current-card>
            {card.label}
          </motion.div>
          <div className="grid gap-2 sm:grid-cols-3">
            {game.lanes.map(l => (
              <motion.button key={l.id} type="button" onClick={() => call(l.id)} disabled={!!picked} whileTap={{ scale: 0.96 }}
                className={cx('flex flex-col items-start gap-1 rounded-2xl bg-primary px-4 py-3 text-left ring-2 ring-secondary ring-inset transition disabled:cursor-default',
                  !picked && 'hover:bg-primary_hover', picked && l.id !== picked && l.id !== card.lane && 'opacity-40', picked && l.id === card.lane && 'ring-mint-600', picked === l.id && !ok && 'ring-error')}>
                <span className="text-sm font-bold text-primary">{l.label}</span>
                <span className="text-xs leading-tight text-tertiary">{l.hint}</span>
              </motion.button>
            ))}
          </div>
          {picked && (
            <NibSays mood={ok ? 'cheer' : 'sad'}>
              <span className="inline-flex items-center gap-1 font-semibold">{ok ? <CheckIcon className="size-4" weight="bold" /> : <XIcon className="size-4" weight="bold" />}{owner.label}.</span>{' '}{card.note}
            </NibSays>
          )}
          {picked && <div className="flex justify-end"><Button size="lg" onPress={() => setI(k => k + 1)}>{i + 1 < game.cards.length ? 'Next part' : 'See both drafts'}</Button></div>}
        </div>
      </div>
    </div>
  );
}
