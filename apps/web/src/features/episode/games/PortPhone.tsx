'use client';
// Mini-game for ia.4-3: Mandi's desktop packing dashboard (the scene's DeskDash) sits beside a packer's phone
// (PhoneDash), which starts as the desktop squeezed down. Each card rings one part of the desktop (`visual`, one of
// PACKING_PARTS). Choose what it becomes on the phone: shown on screen, a ⋯ menu, a bottom sheet, or moved into thumb
// reach. The phone then redraws that part ported, glowing, whatever was picked, and the note says how. Scored on the
// pick; the end shows the desktop and the finished phone side by side.
import { useState } from 'react';
import { motion } from 'motion/react';
import { CheckIcon, XIcon } from '@phosphor-icons/react/ssr';
import type { Episode, PackingPart } from '@shape/content';
import { Button } from '@/components/base/buttons/button';
import { cx } from '@/utils/cx';
import { Burst, NibSays, StageTitle } from '../kit';
import { DESK_H, DESK_W, DeskDash, PHONE_H, PHONE_W, PhoneDash } from '../scenes/TwoDevices';
import type { GameResult } from './DiamondSort';
import { play } from '@/lib/sound';

type Game = Episode['game'];

function Pair({ ported, focus, glow }: { ported: Partial<Record<PackingPart, boolean>>; focus?: PackingPart; glow?: PackingPart }) {
  return (
    <div className="grid grid-cols-[1fr_auto] items-center gap-3 rounded-2xl bg-secondary p-3 sm:grid-cols-[2fr_1fr]">
      <figure className="flex flex-col gap-1">
        <svg viewBox={`-6 -6 ${DESK_W + 12} ${DESK_H + 12}`} className="w-full" role="img" aria-label={`The desktop packing dashboard${focus ? `, with the ${focus} part ringed` : ''}`}>
          <DeskDash focus={focus} />
        </svg>
        <figcaption className="text-xs font-semibold text-tertiary">Desktop, for a mouse</figcaption>
      </figure>
      <figure className="flex flex-col gap-1">
        <svg viewBox={`-4 -4 ${PHONE_W + 8} ${PHONE_H + 8}`} className="mx-auto w-28 sm:w-full sm:max-w-44" role="img" aria-label="The packer’s phone">
          <PhoneDash ported={ported} glow={glow} />
        </svg>
        <figcaption className="text-center text-xs font-semibold text-tertiary">Phone, for a thumb</figcaption>
      </figure>
    </div>
  );
}

export function PortPhone({ game, onDone }: { game: Game; onDone: (results: GameResult[]) => void }) {
  const [i, setI] = useState(0);
  const [picks, setPicks] = useState<Record<string, string>>({});
  const card = game.cards[i];
  const picked = card ? picks[card.id] : undefined;
  const ported = Object.fromEntries(game.cards.filter(c => picks[c.id]).map(c => [c.visual, true])) as Partial<Record<PackingPart, boolean>>;

  const pick = (laneId: string) => {
    if (!card || picked) return;
    play(laneId === card.lane ? 'correct' : 'wrong');
    setPicks(p => ({ ...p, [card.id]: laneId }));
  };

  if (!card) {
    const right = game.cards.filter(c => picks[c.id] === c.lane).length;
    return (
      <div className="relative flex flex-col items-center gap-5 py-6 text-center">
        <Burst count={36} />
        <StageTitle eyebrow="Ported" title={`${right} of ${game.cards.length} parts ported right`}>
          The same jobs on both screens. The desktop stays dense for a mouse; the phone is built for a thumb.
        </StageTitle>
        <Pair ported={ported} />
        <NibSays mood={right === game.cards.length ? 'cheer' : 'idle'}>Nothing on the phone needs a hover, and everything a packer does all day sits low on the screen and big enough to hit with a crate in the other hand.</NibSays>
        <Button size="xl" onPress={() => onDone(game.cards.map(c => ({ id: c.id, correct: picks[c.id] === c.lane })))}>Continue the story</Button>
      </div>
    );
  }

  const ok = picked === card.lane, owner = game.lanes.find(l => l.id === card.lane)!;
  return (
    <div className="flex flex-col gap-5">
      <StageTitle eyebrow="Play" title={game.title}>{game.instructions}</StageTitle>
      <Pair ported={ported} focus={card.visual as PackingPart} glow={picked ? (card.visual as PackingPart) : undefined} />
      <div className="flex items-baseline justify-between">
        <span className="text-sm font-semibold text-tertiary">The ringed part</span>
        <span className="text-sm font-semibold text-tertiary tabular-nums">{i + 1} / {game.cards.length}</span>
      </div>
      <motion.div key={card.id} initial={{ y: -12, opacity: 0 }} animate={picked && !ok ? { x: [0, -10, 10, -6, 6, 0], opacity: 1, y: 0 } : { y: 0, opacity: 1 }} transition={{ duration: 0.4 }}
        className={cx('rounded-2xl bg-primary px-5 py-4 text-lg font-semibold text-primary shadow-lg ring-2 ring-inset', !picked ? 'ring-secondary' : ok ? 'ring-mint-600' : 'ring-error')} data-current-card>
        {card.label}
      </motion.div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {game.lanes.map(l => (
          <motion.button key={l.id} type="button" onClick={() => pick(l.id)} disabled={!!picked} whileTap={{ scale: 0.96 }}
            className={cx('flex flex-col items-start gap-1 rounded-2xl bg-primary px-3 py-3 text-left ring-2 ring-secondary ring-inset transition disabled:cursor-default',
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
      {picked && <div className="flex justify-end"><Button size="lg" onPress={() => setI(k => k + 1)}>{i + 1 < game.cards.length ? 'Next part' : 'See both screens'}</Button></div>}
    </div>
  );
}
