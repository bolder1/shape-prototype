'use client';
// Mini-game for pr.3-1: three of Gullak's micro-interactions arrive in pieces (cards grouped by `visual`, see
// `microStrips`). Pick a piece from the tray, then the part of the trigger → rules → feedback → loops strip it belongs
// in. A piece dropped in the wrong part shakes and moves to its own part, marked. When all four parts are in, the strip
// plays the micro-interaction (the scene's `MicroDemo`) and each part's note opens. With reduced motion on, the demo
// holds its finished frame until Play is pressed. The end lays out all three strips.
import { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { CheckIcon, PlayIcon, XIcon } from '@phosphor-icons/react/ssr';
import { GULLAK_MICROS, MICRO_PARTS, type Episode, type GullakMicro, type MicroPart } from '@shape/content';
import { Button } from '@/components/base/buttons/button';
import { cx } from '@/utils/cx';
import { Burst, NibSays, StageTitle } from '../kit';
import { MICRO_NAME, MicroDemo, PART_NAME } from '../scenes/MicroAnatomy';
import { tileLoop } from '../scenes/MotionMeaning';
import { useMotionDemo } from './useMotionDemo';
import type { GameResult } from './DiamondSort';
import { play } from '@/lib/sound';

type Game = Episode['game'];
type Card = Game['cards'][number];
const LOOP = 4;

function Demo({ micro, k, label }: { micro: GullakMicro; k: number; label: string }) {
  return (
    <svg viewBox="-2 -2 204 154" className="w-full" role="img" aria-label={label}>
      <MicroDemo micro={micro} k={k} />
    </svg>
  );
}

/** The pieces in a fixed but mixed order, so the tray never reads top to bottom as the answer. */
const mixed = (cards: Card[]) => [2, 0, 3, 1].map(i => cards[i]).filter(Boolean).concat(cards.slice(4));

export function MicroBuild({ game, onDone }: { game: Game; onDone: (results: GameResult[]) => void }) {
  const micros = useMemo(() => GULLAK_MICROS.filter(m => game.cards.some(c => c.visual === m)), [game.cards]);
  const [mi, setMi] = useState(0);
  const [picks, setPicks] = useState<Record<string, MicroPart>>({});
  const [held, setHeld] = useState<string | null>(null);
  const [miss, setMiss] = useState<string | null>(null);
  const clock = useMotionDemo(LOOP);
  const kOf = (offset = 0) => (clock.still ? 1 : tileLoop(clock.t, offset, LOOP));

  const micro = micros[mi];
  if (!micro) {
    const right = game.cards.filter(c => picks[c.id] === c.lane).length;
    return (
      <div className="relative flex flex-col items-center gap-5 py-6 text-center">
        <Burst count={36} />
        <StageTitle eyebrow="Three micro-interactions, specified" title={`${right} of ${game.cards.length} parts in the right place`}>
          Every one has a trigger, rules, feedback and a loop. The rules and the loops are the parts a mock-up never shows.
        </StageTitle>
        <div className="grid w-full gap-3 text-left">
          {micros.map((m, n) => (
            <section key={m} className="grid items-center gap-3 rounded-2xl bg-secondary p-3 sm:grid-cols-[10rem_1fr]">
              <div className="flex flex-col gap-1">
                <h2 className="text-sm font-semibold text-primary">{MICRO_NAME[m]}</h2>
                <Demo micro={m} k={kOf(n * 0.5)} label={`${MICRO_NAME[m]}, playing`} />
              </div>
              <ol className="grid gap-1 sm:grid-cols-2">
                {MICRO_PARTS.map(part => {
                  const c = game.cards.find(x => x.visual === m && x.lane === part)!;
                  return (
                    <li key={part} className={cx('rounded-xl bg-primary px-3 py-2 text-sm ring-1 ring-inset', picks[c.id] === c.lane ? 'ring-secondary' : 'ring-error')}>
                      <span className="block text-xs font-bold text-tertiary">{PART_NAME[part]}</span>
                      <span className="text-primary">{c.label}</span>
                    </li>
                  );
                })}
              </ol>
            </section>
          ))}
        </div>
        <NibSays mood={right === game.cards.length ? 'cheer' : 'idle'}>Write the strip before anyone animates. The double payment, the vanished ₹6 and the lying spinner were all missing parts, not missing polish.</NibSays>
        <Button size="xl" onPress={() => onDone(game.cards.map(c => ({ id: c.id, correct: picks[c.id] === c.lane })))}>Continue the story</Button>
      </div>
    );
  }

  const cards = game.cards.filter(c => c.visual === micro);
  const tray = mixed(cards).filter(c => !picks[c.id]);
  const complete = tray.length === 0;
  const inSlot = (part: MicroPart) => cards.find(c => c.lane === part && picks[c.id]);
  const drop = (part: MicroPart) => {
    if (!held) return;
    const card = cards.find(c => c.id === held)!;
    const ok = card.lane === part;
    play(ok ? 'correct' : 'wrong');
    setPicks(p => ({ ...p, [card.id]: part }));
    setMiss(ok ? null : card.id);
    setHeld(null);
  };
  const next = () => { setMi(n => n + 1); setMiss(null); setHeld(null); };

  return (
    <div className="flex flex-col gap-5">
      <StageTitle eyebrow="Play" title={game.title}>{game.instructions}</StageTitle>
      <div className="flex items-baseline justify-between">
        <span className="text-lg font-semibold text-primary">{MICRO_NAME[micro]}</span>
        <span className="text-sm font-semibold text-tertiary tabular-nums">{mi + 1} / {micros.length}</span>
      </div>

      <ol className="grid gap-2 sm:grid-cols-4" aria-label="The strip">
        {MICRO_PARTS.map(part => {
          const lane = game.lanes.find(l => l.id === part)!;
          const c = inSlot(part);
          const wrong = c && picks[c.id] !== c.lane;
          return (
            <li key={part}>
              <motion.button type="button" onClick={() => drop(part)} disabled={!held || !!c} whileTap={held && !c ? { scale: 0.97 } : undefined}
                animate={c && c.id === miss ? { x: [0, -8, 8, -5, 5, 0] } : undefined} transition={{ duration: 0.4 }}
                className={cx('flex h-full min-h-28 w-full flex-col items-start gap-1 rounded-2xl px-3 py-3 text-left ring-2 ring-inset transition disabled:cursor-default',
                  c ? 'bg-primary' : 'bg-secondary', !c && held ? 'ring-brand hover:bg-primary_hover' : 'ring-secondary', c && !wrong && 'ring-mint-600', wrong && 'ring-error')}>
                <span className="text-xs font-bold text-tertiary">{lane.label}</span>
                {c
                  ? <span className="text-sm text-primary">{c.label}</span>
                  : <span className="text-xs leading-tight text-tertiary">{lane.hint}</span>}
                {wrong && <span className="mt-auto inline-flex items-center gap-1 text-xs font-semibold text-error-primary"><XIcon className="size-3" weight="bold" />You put it in {PART_NAME[picks[c.id]]}</span>}
              </motion.button>
            </li>
          );
        })}
      </ol>

      {!complete && (
        <div className="flex flex-col gap-2">
          <span className="text-sm font-semibold text-tertiary">{held ? 'Now pick its part of the strip' : 'Pick a piece'}</span>
          <div className="grid gap-2 sm:grid-cols-2">
            {tray.map(c => (
              <motion.button key={c.id} type="button" layout onClick={() => setHeld(h => (h === c.id ? null : c.id))} whileTap={{ scale: 0.97 }} aria-pressed={held === c.id}
                className={cx('rounded-2xl bg-primary px-4 py-3 text-left text-sm font-semibold text-primary shadow-sm ring-2 ring-inset transition hover:bg-primary_hover', held === c.id ? 'ring-brand' : 'ring-secondary')}
                data-current-card={held === c.id ? true : undefined}>
                {c.label}
              </motion.button>
            ))}
          </div>
        </div>
      )}
      {miss && !complete && (
        <NibSays mood="sad">{cards.find(c => c.id === miss)!.note}</NibSays>
      )}

      {complete && (
        <>
          <div className="grid items-center gap-4 rounded-2xl bg-secondary p-3 sm:grid-cols-[2fr_3fr]">
            <div className="flex flex-col items-center gap-2">
              <div className="w-full max-w-64"><Demo micro={micro} k={kOf()} label={`${MICRO_NAME[micro]}, playing with all four parts`} /></div>
              {clock.reduce && <Button size="sm" color="secondary" iconLeading={<PlayIcon data-icon weight="bold" />} onPress={clock.play}>Play once</Button>}
            </div>
            <ul className="grid gap-2 text-left text-sm">
              {MICRO_PARTS.map(part => {
                const c = cards.find(x => x.lane === part)!;
                return (
                  <li key={part} className="flex gap-2">
                    {picks[c.id] === c.lane ? <CheckIcon className="mt-0.5 size-4 shrink-0 text-primary" weight="bold" /> : <XIcon className="mt-0.5 size-4 shrink-0 text-error-primary" weight="bold" />}
                    <span><span className="font-semibold text-primary">{PART_NAME[part]}.</span> <span className="text-secondary">{c.note}</span></span>
                  </li>
                );
              })}
            </ul>
          </div>
          <div className="flex justify-end"><Button size="lg" onPress={next}>{mi + 1 < micros.length ? 'Next micro-interaction' : 'See all three'}</Button></div>
        </>
      )}
    </div>
  );
}
