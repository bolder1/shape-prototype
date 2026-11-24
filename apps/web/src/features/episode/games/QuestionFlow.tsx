'use client';
// Mini-game for cw.2-2: each card is a piece of real content for Chaabi's move-out flow. First it's shown in the lorem
// box Dev drew for it (its `visual`, a `LOREM_SLOTS` key), spilling out in red when it doesn't fit (`slotFits`). Then
// drop it on the screen of the flow that answers its question (`FLOW_QUESTIONS`). It lands on its own screen either
// way, and the screens grow around their content (`FlowScreen`). A wrong drop shakes and is marked. Scored on the first
// drop. The end is the whole flow, beside a count of the lorem boxes the real words broke.
import { useState } from 'react';
import { motion } from 'motion/react';
import { CheckIcon, XIcon } from '@phosphor-icons/react/ssr';
import { FLOW_QUESTIONS, LOREM_SLOTS, slotFits, wrapLines, type Episode, type FlowQuestion, type LoremSlot } from '@shape/content';
import { Button } from '@/components/base/buttons/button';
import { cx } from '@/utils/cx';
import { Burst, NibSays, StageTitle } from '../kit';
import { FlowScreen, QUESTION_NAME, SLOT_BOX, SLOT_NAME, SlotBox } from '../scenes/ContentFirst';
import type { GameResult } from './DiamondSort';
import { play } from '@/lib/sound';

type Game = Episode['game'];
type Card = Game['cards'][number];

const itemsOn = (cards: Card[], q: FlowQuestion, placed: Record<string, FlowQuestion>) =>
  cards.filter(c => c.lane === q && placed[c.id]).map(c => ({ text: c.label, slot: c.visual as LoremSlot }));

function Screen({ q, items, lit }: { q: FlowQuestion; items: { text: string; slot: LoremSlot }[]; lit?: boolean }) {
  return (
    <svg viewBox="-2 -2 194 304" className="w-full" aria-hidden>
      <FlowScreen x={0} y={0} q={q} items={items} lit={lit} />
    </svg>
  );
}

export function QuestionFlow({ game, onDone }: { game: Game; onDone: (results: GameResult[]) => void }) {
  const [i, setI] = useState(0);
  const [placed, setPlaced] = useState<Record<string, FlowQuestion>>({});
  const card = game.cards[i];

  if (!card) {
    const right = game.cards.filter(c => placed[c.id] === c.lane).length;
    const broke = game.cards.filter(c => !slotFits(c.label, c.visual as LoremSlot)).length;
    return (
      <div className="relative flex flex-col items-center gap-5 py-6 text-center">
        <Burst count={36} />
        <StageTitle eyebrow="The move-out flow, content first" title={`${right} of ${game.cards.length} answers on the right screen`}>
          The real words broke {broke} of Dev’s {game.cards.length} lorem boxes. Built from Tanvir’s questions, every one has room.
        </StageTitle>
        <ol className="grid w-full grid-cols-2 gap-3 sm:grid-cols-4">
          {FLOW_QUESTIONS.map(q => (
            <li key={q} className="flex flex-col gap-1">
              <Screen q={q} items={itemsOn(game.cards, q, placed)} />
              <span className="sr-only">{QUESTION_NAME[q]}: {game.cards.filter(c => c.lane === q).map(c => c.label).join('; ')}</span>
            </li>
          ))}
        </ol>
        <NibSays mood={right === game.cards.length ? 'cheer' : 'idle'}>Questions first, real answers second, layout last. Lorem ipsum is always the right length, so it can never tell you where the design will break.</NibSays>
        <Button size="xl" onPress={() => onDone(game.cards.map(c => ({ id: c.id, correct: placed[c.id] === c.lane })))}>Continue the story</Button>
      </div>
    );
  }

  const slot = card.visual as LoremSlot, box = SLOT_BOX[slot];
  const need = wrapLines(card.label, LOREM_SLOTS[slot].perLine), holds = LOREM_SLOTS[slot].lines;
  const fits = need <= holds;
  const drop = placed[card.id], ok = drop === card.lane;
  const place = (q: FlowQuestion) => { if (drop) return; play(q === card.lane ? 'correct' : 'wrong'); setPlaced(p => ({ ...p, [card.id]: q })); };
  const owner = game.lanes.find(l => l.id === card.lane)!;

  return (
    <div className="flex flex-col gap-5">
      <StageTitle eyebrow="Play" title={game.title}>{game.instructions}</StageTitle>
      <span className="self-end text-sm font-semibold text-tertiary tabular-nums">{i + 1} / {game.cards.length}</span>
      <motion.div key={card.id} initial={{ y: -12, opacity: 0 }} animate={drop && !ok ? { x: [0, -10, 10, -6, 6, 0], opacity: 1, y: 0 } : { y: 0, opacity: 1 }} transition={{ duration: 0.4 }}
        className={cx('grid items-center gap-4 rounded-2xl bg-primary px-5 py-4 shadow-lg ring-2 ring-inset sm:grid-cols-[1fr_auto]', !drop ? 'ring-secondary' : ok ? 'ring-mint-600' : 'ring-error')} data-current-card>
        <div className="flex flex-col gap-1">
          <span className="text-lg font-semibold text-primary">{card.label}</span>
          <span className={cx('text-sm font-semibold', fits ? 'text-tertiary' : 'text-error-primary')}>
            In Dev’s lorem {SLOT_NAME[slot]}: needs {need} {need === 1 ? 'line' : 'lines'}, holds {holds}.{fits ? ' It fits this time.' : ' It spills out.'}
          </span>
        </div>
        <svg viewBox={`-4 -4 ${box.w + 8} ${Math.max(box.h, need * box.fs * 1.3 + 8) + 8}`} className="w-full max-w-56 justify-self-center" role="img" aria-label={`The text in Dev’s lorem ${SLOT_NAME[slot]}${fits ? ', fitting' : ', spilling out of the box'}`}>
          <SlotBox x={0} y={0} slot={slot} text={card.label} />
        </svg>
      </motion.div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {FLOW_QUESTIONS.map((q, n) => {
          const lane = game.lanes.find(l => l.id === q)!;
          return (
            <motion.button key={q} type="button" onClick={() => place(q)} disabled={!!drop} whileTap={{ scale: 0.97 }} aria-label={`Screen ${n + 1}: ${lane.label}. ${lane.hint}`}
              className={cx('flex flex-col gap-1 rounded-2xl bg-secondary p-2 text-left ring-2 ring-inset ring-transparent transition disabled:cursor-default',
                !drop && 'hover:ring-brand', drop && q === card.lane && 'ring-mint-600', drop === q && !ok && 'ring-error')}>
              <span className="px-1 text-xs font-bold text-tertiary">Screen {n + 1} · {lane.hint}</span>
              <Screen q={q} items={itemsOn(game.cards, q, placed)} lit={drop ? q === card.lane : false} />
            </motion.button>
          );
        })}
      </div>
      {drop && (
        <>
          <NibSays mood={ok ? 'cheer' : 'sad'}>
            <span className="inline-flex items-center gap-1 font-semibold">{ok ? <CheckIcon className="size-4" weight="bold" /> : <XIcon className="size-4" weight="bold" />}{owner.label}</span>{' '}
            {card.note}
          </NibSays>
          <div className="flex justify-end"><Button size="lg" onPress={() => setI(n => n + 1)}>{i + 1 < game.cards.length ? 'Next piece' : 'See the flow'}</Button></div>
        </>
      )}
    </div>
  );
}
