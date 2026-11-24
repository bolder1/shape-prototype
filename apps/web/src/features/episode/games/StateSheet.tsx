'use client';
// Mini-game for ui.4-1: Hisaab's state sheet (the scene's StateSheet) has a row for the button, the amount input and the
// customer card, and a column for each of KIT_STATES. Each card is a moment for one component (`visual`, one of
// KIT_PARTS); its row is ringed and the part is shown big in its default state. Pick the state it's in. The right state
// is then drawn into its cell, whatever was picked, and the note says how it should look. Scored on the pick; the end
// shows the finished sheet.
import { useState } from 'react';
import { motion } from 'motion/react';
import { CheckIcon, XIcon } from '@phosphor-icons/react/ssr';
import { KIT_PARTS, type Episode, type KitPart, type KitState } from '@shape/content';
import { Button } from '@/components/base/buttons/button';
import { cx } from '@/utils/cx';
import { Burst, NibSays, StageTitle } from '../kit';
import { CELL_H, CELL_W, KitCell, StateSheet as Sheet } from '../scenes/ComponentKit';
import type { GameResult } from './DiamondSort';
import { play } from '@/lib/sound';

type Game = Episode['game'];
const S = 0.7, GAP = 14, CH = CELL_H * S + GAP, SHEET_W = 84 + 4 * (CELL_W * S + GAP);

function SheetView({ done, row }: { done: Set<string>; row?: KitPart }) {
  const r = row ? KIT_PARTS.indexOf(row) : -1;
  return (
    <svg viewBox={`-6 -18 ${SHEET_W + 12} ${14 + 3 * CH + 24}`} className="w-full" role="img" aria-label={`The state sheet, ${done.size} cells drawn${row ? `, the ${row} row ringed` : ''}`}>
      {r >= 0 && <rect x={-4} y={14 + r * CH - 6} width={SHEET_W + 4} height={CELL_H * S + 12} rx={12} fill="var(--color-bg-secondary)" stroke="var(--color-bg-brand-solid)" strokeWidth={2} strokeDasharray="6 5" />}
      <Sheet scale={S} gap={GAP} spin={45} show={(part, s) => (done.has(`${part}:${s}`) ? 1 : 0)} />
    </svg>
  );
}

export function StateSheet({ game, onDone }: { game: Game; onDone: (results: GameResult[]) => void }) {
  const [i, setI] = useState(0);
  const [picks, setPicks] = useState<Record<string, string>>({});
  const card = game.cards[i];
  const picked = card ? picks[card.id] : undefined;
  const done = new Set(game.cards.filter(c => picks[c.id]).map(c => `${c.visual}:${c.lane}`));

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
        <StageTitle eyebrow="Sheet drawn" title={`${right} of ${game.cards.length} states right`}>
          Every part, in every state it can be in, drawn once. Now whoever builds it doesn’t have to guess.
        </StageTitle>
        <div className="w-full rounded-2xl bg-primary p-3 ring-1 ring-secondary ring-inset"><SheetView done={done} /></div>
        <NibSays mood={right === game.cards.length ? 'cheer' : 'idle'}>A part without its states gets them made up later, by someone else, differently on every screen.</NibSays>
        <Button size="xl" onPress={() => onDone(game.cards.map(c => ({ id: c.id, correct: picks[c.id] === c.lane })))}>Continue the story</Button>
      </div>
    );
  }

  const part = card.visual as KitPart, ok = picked === card.lane, owner = game.lanes.find(l => l.id === card.lane)!;
  return (
    <div className="flex flex-col gap-5">
      <StageTitle eyebrow="Play" title={game.title}>{game.instructions}</StageTitle>
      <div className="rounded-2xl bg-primary p-3 ring-1 ring-secondary ring-inset"><SheetView done={done} row={part} /></div>
      <div className="flex items-baseline justify-between">
        <span className="text-sm font-semibold text-tertiary">The moment</span>
        <span className="text-sm font-semibold text-tertiary tabular-nums">{i + 1} / {game.cards.length}</span>
      </div>
      <motion.div key={card.id} initial={{ y: -12, opacity: 0 }} animate={picked && !ok ? { x: [0, -10, 10, -6, 6, 0], opacity: 1, y: 0 } : { y: 0, opacity: 1 }} transition={{ duration: 0.4 }}
        className={cx('flex flex-col items-center gap-3 rounded-2xl bg-primary px-5 py-4 shadow-lg ring-2 ring-inset sm:flex-row', !picked ? 'ring-secondary' : ok ? 'ring-mint-600' : 'ring-error')} data-current-card>
        <svg viewBox={`0 0 ${CELL_W} ${CELL_H + 4}`} className="w-48 shrink-0" role="img" aria-label={`The ${part}${picked ? `, ${card.lane}` : ''}`}>
          <KitCell part={part} state={picked ? (card.lane as KitState) : 'default'} spin={45} />
        </svg>
        <span className="text-lg font-semibold text-primary">{card.label}</span>
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
      {picked && <div className="flex justify-end"><Button size="lg" onPress={() => setI(k => k + 1)}>{i + 1 < game.cards.length ? 'Next moment' : 'See the sheet'}</Button></div>}
    </div>
  );
}
