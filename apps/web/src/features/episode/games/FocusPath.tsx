'use client';
// Mini-game for ax.2-1: each card is a part of Rahi's seat page, top to bottom (its `visual`, a key of `RAHI_PARTS`).
// Decide how the keyboard reaches it: its own Tab stops, one stop with arrow keys inside, or not focusable. The page
// beside the card numbers the Tab stops you've decided so far, and a running count shows how many presses Kabir needs
// (`partStops`). Scored on the first pick. The end draws your whole path, counts the presses to Pay against Arjun's
// build and Meera's (`pressesToPay`), and gives you a real seat grid to try with the arrow keys.
import { useRef, useState } from 'react';
import { motion } from 'motion/react';
import { CheckIcon, XIcon } from '@phosphor-icons/react/ssr';
import { RAHI_PARTS, type Episode, type KeyWay, type RahiPart } from '@shape/content';
import { Button } from '@/components/base/buttons/button';
import { cx } from '@/utils/cx';
import { Burst, NibSays, StageTitle } from '../kit';
import { ALL_WAYS, BOOKED, GOOD_WAYS, PART_KEYS, RahiPage, partStops, pressesToPay, type Ways } from '../scenes/KeyboardFlow';
import type { GameResult } from './DiamondSort';
import { play } from '@/lib/sound';

type Game = Episode['game'];

/** A real 4 × 6 corner of the seat map with a roving tabindex: one Tab stop, arrows move, Space or Enter picks. */
function TrySeats() {
  const COLS = 6, N = 24;
  const [at, setAt] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const move = (to: number) => { if (to < 0 || to >= N) return; setAt(to); refs.current[to]?.focus(); };
  const onKey = (e: React.KeyboardEvent, i: number) => {
    const step = { ArrowRight: 1, ArrowLeft: -1, ArrowDown: COLS, ArrowUp: -COLS }[e.key];
    if (step) { e.preventDefault(); move(i + step); }
    else if (e.key === 'Home') { e.preventDefault(); move(i - (i % COLS)); }
    else if (e.key === 'End') { e.preventDefault(); move(i - (i % COLS) + COLS - 1); }
  };
  return (
    <div className="flex w-full flex-col items-center gap-2">
      <p className="text-sm text-tertiary">Try it: Tab into the seats, use the arrow keys, and press Space to pick one.</p>
      <div role="grid" aria-label="Seats, Pune to Goa" className="inline-grid gap-1.5 rounded-2xl bg-secondary p-3">
        {Array.from({ length: N / COLS }, (_, r) => (
          <div role="row" key={r} className="flex gap-1.5">
            {Array.from({ length: COLS }, (_, c) => {
              const i = r * COLS + c, booked = BOOKED.has(i), isWindow = c === 0 || c === COLS - 1;
              return (
                <span role="gridcell" key={c}>
                  <button type="button" ref={el => { refs.current[i] = el; }} tabIndex={i === at ? 0 : -1}
                    aria-label={`Seat ${i + 1}${isWindow ? ', window' : ''}`} aria-disabled={booked || undefined} aria-pressed={picked === i}
                    onKeyDown={e => onKey(e, i)} onFocus={() => setAt(i)} onClick={() => !booked && setPicked(i)}
                    className={cx('size-10 rounded-lg text-sm font-bold tabular-nums ring-2 ring-inset outline-offset-2 focus-visible:outline-2 focus-visible:outline-brand',
                      booked ? 'cursor-not-allowed bg-tertiary text-tertiary ring-transparent' : picked === i ? 'bg-brand-solid text-white ring-transparent' : 'bg-primary text-primary ring-brand')}>
                    {i + 1}
                  </button>
                </span>
              );
            })}
          </div>
        ))}
      </div>
      <p className="text-sm font-semibold text-primary" role="status">{picked === null ? 'No seat picked yet' : `Seat ${picked + 1} picked`}</p>
    </div>
  );
}

export function FocusPath({ game, onDone }: { game: Game; onDone: (results: GameResult[]) => void }) {
  const [i, setI] = useState(0);
  const [picks, setPicks] = useState<Partial<Record<RahiPart, KeyWay>>>({});
  const card = game.cards[i];

  /** Decided parts take the way you picked; undecided ones aren't drawn yet. */
  const ways = Object.fromEntries(PART_KEYS.map(k => [k, picks[k] ?? 'none'])) as Ways;
  const decidedStops = PART_KEYS.reduce((s, k) => s + (picks[k] ? partStops(k, picks[k]!) : 0), 0);

  if (!card) {
    const right = game.cards.filter(c => picks[c.visual as RahiPart] === c.lane).length;
    const mine = pressesToPay(ways), best = pressesToPay(GOOD_WAYS), arjun = pressesToPay(ALL_WAYS);
    return (
      <div className="relative flex flex-col items-center gap-5 py-6 text-center">
        <Burst count={36} />
        <StageTitle eyebrow="Kabir’s path to Pay" title={`${right} of ${game.cards.length} parts reached the right way`}>
          Your path reaches Pay in {mine} Tab presses. Arjun’s every-item-a-stop build took {arjun}; Meera’s takes {best}.
        </StageTitle>
        <div className="grid w-full items-start gap-4 sm:grid-cols-2">
          <figure className="flex flex-col gap-2">
            <svg viewBox="-12 -14 424 462" className="w-full rounded-2xl bg-secondary" role="img" aria-label="Rahi’s seat page with your Tab stops numbered in order">
              <RahiPage x={0} y={0} ways={ways} numbers picked={11} skipShown={ways.skip !== 'none'} />
            </svg>
            <figcaption className="text-sm text-tertiary">Your path, numbered in Tab order</figcaption>
          </figure>
          <ul className="flex flex-col gap-2 text-left">
            {game.cards.map(c => {
              const ok = picks[c.visual as RahiPart] === c.lane, lane = game.lanes.find(l => l.id === c.lane)!;
              return (
                <li key={c.id} className={cx('flex flex-col gap-0.5 rounded-xl bg-primary p-3 ring-1 ring-inset', ok ? 'ring-secondary' : 'ring-error')}>
                  <span className="text-sm font-semibold text-primary">{RAHI_PARTS[c.visual as RahiPart].label}: {lane.label.toLowerCase()}</span>
                  {!ok && <span className="text-xs text-tertiary">{c.note}</span>}
                </li>
              );
            })}
          </ul>
        </div>
        <TrySeats />
        <NibSays mood={right === game.cards.length ? 'cheer' : 'idle'}>Separate actions get their own stops; groups of similar choices are one stop with arrows inside; anything you can’t press or can’t see gets none.</NibSays>
        <Button size="xl" onPress={() => onDone(game.cards.map(c => ({ id: c.id, correct: picks[c.visual as RahiPart] === c.lane })))}>Continue the story</Button>
      </div>
    );
  }

  const part = card.visual as RahiPart, mine = picks[part], ok = mine === card.lane;
  const choose = (w: KeyWay) => { if (mine) return; play(w === card.lane ? 'correct' : 'wrong'); setPicks(ps => ({ ...ps, [part]: w })); };

  return (
    <div className="flex flex-col gap-5">
      <StageTitle eyebrow="Play" title={game.title}>{game.instructions}</StageTitle>
      <div className="grid items-start gap-4 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <svg viewBox="-12 -14 424 462" className="w-full rounded-2xl bg-secondary" role="img" aria-label={`Rahi’s seat page. ${decidedStops} Tab stops decided so far.`}>
          <RahiPage x={0} y={0} ways={ways} numbers picked={-1} skipShown={ways.skip !== 'none'}
            dim={PART_KEYS.filter(k => k !== part && !picks[k])} />
        </svg>
        <motion.div key={card.id} initial={{ y: -10, opacity: 0 }} animate={mine && !ok ? { x: [0, -10, 10, -6, 6, 0], opacity: 1, y: 0 } : { y: 0, opacity: 1 }} transition={{ duration: 0.4 }}
          className="flex flex-col gap-3" data-current-card>
          <div className="flex items-baseline justify-between gap-3">
            <span className="text-lg font-semibold text-primary">{card.label}</span>
            <span className="shrink-0 text-sm font-semibold text-tertiary tabular-nums">{i + 1} / {game.cards.length}</span>
          </div>
          <p className="text-sm text-tertiary tabular-nums" aria-live="polite">Tab stops so far: <span className="font-semibold text-primary">{decidedStops}</span></p>
          <div role="group" aria-label="How the keyboard reaches it" className="flex flex-col gap-2">
            {game.lanes.map(l => {
              const way = l.id as KeyWay;
              return (
                <button key={l.id} type="button" aria-pressed={mine === way} disabled={!!mine} onClick={() => choose(way)}
                  className={cx('flex items-center justify-between gap-3 rounded-2xl bg-primary px-4 py-3 text-left ring-2 ring-inset transition disabled:cursor-default',
                    !mine && 'ring-secondary hover:bg-primary_hover', mine && way === card.lane && 'ring-mint-600', mine && way === mine && !ok && 'ring-error', mine && way !== mine && way !== card.lane && 'ring-secondary opacity-60')}>
                  <span className="flex flex-col">
                    <span className="text-sm font-bold text-primary">{l.label}</span>
                    <span className="text-xs text-tertiary">{l.hint}</span>
                  </span>
                  <span className="shrink-0 text-sm font-semibold text-tertiary tabular-nums">+{partStops(part, way)}</span>
                </button>
              );
            })}
          </div>
        </motion.div>
      </div>
      {mine && (
        <>
          <NibSays mood={ok ? 'cheer' : 'sad'}>
            <span className="inline-flex items-center gap-1 font-semibold">{ok ? <CheckIcon className="size-4" weight="bold" /> : <XIcon className="size-4" weight="bold" />}{game.lanes.find(l => l.id === card.lane)!.label}.</span>{' '}{card.note}
          </NibSays>
          <div className="flex justify-end"><Button size="lg" onPress={() => setI(n => n + 1)}>{i + 1 < game.cards.length ? 'Next part' : 'See the path'}</Button></div>
        </>
      )}
    </div>
  );
}
