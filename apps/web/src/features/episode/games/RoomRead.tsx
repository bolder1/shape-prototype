'use client';
// Mini-game for ld.1-2: read the room. Every card is a moment in Nisha's 90-minute workshop at Rasoi (its `visual`, a
// key of `RASOI_MOMENTS`), dealt in the order they happen. Pick her move (`MOVES`, scored by `moveFor`): everyone writes
// alone first, go round the room, park it, or set a timer and decide. First calls feed `workshopResult`: a right move
// lights up the people it brings in around the table (`ROOM`), a wrong one adds its minutes to the clock. A miss
// explains and the card comes back later; first call scores. The end shows who was heard and how far over it ran.
import { useState } from 'react';
import { motion } from 'motion/react';
import { RASOI_MOMENTS, ROLE_OF, ROOM, WORKSHOP_MINUTES, moveFor, workshopResult, type Episode, type Move, type RasoiMoment } from '@shape/content';
import { springs } from '@shape/ui';
import { Button } from '@/components/base/buttons/button';
import { cx } from '@/utils/cx';
import { Burst, NibSays, StageTitle } from '../kit';
import { MOVE_TONE } from '../scenes/WorkshopRoom';
import type { GameResult } from './DiamondSort';
import { play } from '@/lib/sound';

type Game = Episode['game'];
type Calls = Partial<Record<RasoiMoment, boolean>>;
/** The bar's full width: the 90 minutes plus the most every wrong move could add. */
const SPAN = WORKSHOP_MINUTES + workshopResult(Object.fromEntries(Object.keys(RASOI_MOMENTS).map(k => [k, false]))).over;

function Room({ calls, minute }: { calls: Calls; minute: number }) {
  const { heard, over } = workshopResult(calls);
  const clock = Math.min(minute, WORKSHOP_MINUTES) + over;
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-1.5 rounded-2xl bg-secondary p-4" role="status">
        <div className="flex items-baseline justify-between">
          <span className="text-sm font-bold text-primary">Workshop clock</span>
          <span className={cx('text-lg font-bold tabular-nums', over > 0 ? 'text-error-primary' : 'text-primary')}>{clock} / {WORKSHOP_MINUTES} min{over > 0 ? ` · ${over} over` : ''}</span>
        </div>
        <div className="relative h-2.5 overflow-hidden rounded-full bg-primary ring-1 ring-inset ring-secondary">
          <motion.div className="absolute inset-y-0 left-0 rounded-full bg-mint-600" initial={false} animate={{ width: `${(Math.min(minute, WORKSHOP_MINUTES) / SPAN) * 100}%` }} transition={springs.pop} />
          <motion.div className="absolute inset-y-0 rounded-full bg-error-solid" initial={false}
            animate={{ left: `${(Math.min(minute, WORKSHOP_MINUTES) / SPAN) * 100}%`, width: `${(over / SPAN) * 100}%` }} transition={springs.pop} />
        </div>
      </div>
      <div className="flex flex-col gap-2 rounded-2xl bg-secondary p-3">
        <span className="text-sm font-bold text-primary">Heard so far · {heard.length} of {ROOM.length}</span>
        <div className="grid grid-cols-2 gap-1.5">
          {ROOM.map(p => {
            const on = heard.includes(p);
            return (
              <motion.div key={p} layout animate={{ opacity: on ? 1 : 0.55 }} className={cx('flex items-center gap-2 rounded-lg bg-primary px-2.5 py-1.5 ring-1 ring-inset', on ? 'ring-mint-600' : 'ring-secondary')}>
                <span className={cx('flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ring-1 ring-inset', on ? 'bg-secondary text-primary ring-mint-600' : 'bg-secondary text-tertiary ring-secondary')}>{p[0]}</span>
                <span className="flex min-w-0 flex-col">
                  <span className="text-xs font-semibold text-primary">{p}</span>
                  <span className="truncate text-[11px] text-tertiary">{ROLE_OF[p]}</span>
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export function RoomRead({ game, onDone }: { game: Game; onDone: (results: GameResult[]) => void }) {
  const [deck, setDeck] = useState(game.cards);
  const [calls, setCalls] = useState<Calls>({});
  const [miss, setMiss] = useState<string | null>(null);
  const [right, setRight] = useState(false);
  const card = deck[0];
  const byCard = (id: string) => calls[game.cards.find(c => c.id === id)?.visual as RasoiMoment];
  const latest = Math.max(0, ...(Object.keys(calls) as RasoiMoment[]).map(k => RASOI_MOMENTS[k].minute));

  if (!card) {
    const n = game.cards.filter(c => byCard(c.id)).length;
    const { heard, over } = workshopResult(calls);
    return (
      <div className="relative flex flex-col gap-5 py-6">
        <Burst count={36} />
        <StageTitle eyebrow="Workshop over" title={`${n} of ${game.cards.length} moves right first time`}>
          {heard.length} of {ROOM.length} people heard, and {over === 0 ? 'finished on time' : `${over} minutes over`}.
        </StageTitle>
        <Room calls={calls} minute={WORKSHOP_MINUTES} />
        <NibSays mood={n === game.cards.length ? 'cheer' : 'idle'}>Name what’s going wrong before you pick a move. One voice setting the direction: write alone first. Voices missing: go round. Off the goal: park it with an owner. Going round in circles, or out of time: a timer, then a decision.</NibSays>
        <Button size="xl" onPress={() => onDone(game.cards.map(c => ({ id: c.id, correct: !!byCard(c.id) })))}>Continue the story</Button>
      </div>
    );
  }

  const k = card.visual as RasoiMoment;
  const m = RASOI_MOMENTS[k];
  const lane = moveFor(m);
  const owner = game.lanes.find(l => l.id === lane)!;
  const done = game.cards.length - deck.length;
  const call = (laneId: string) => {
    if (miss || right) return;
    const ok = laneId === lane;
    play(ok ? 'correct' : 'wrong');
    setCalls(c => (k in c ? c : { ...c, [k]: ok }));
    if (ok) setRight(true);
    else { setMiss(laneId); setTimeout(() => { setMiss(null); setDeck(d => [...d.slice(1), d[0]]); }, 3200); }
  };
  const next = () => { setRight(false); setDeck(d => d.slice(1)); };
  const lost = m.voices.length ? `${m.voices.join(' and ')} stay${m.voices.length === 1 ? 's' : ''} unheard` : `${m.cost} minutes go`;

  return (
    <div className="flex flex-col gap-5">
      <StageTitle eyebrow="Play" title={game.title}>{game.instructions}</StageTitle>
      <div className="grid gap-5 md:grid-cols-[1fr_minmax(0,22rem)]">
        <div className="flex flex-col gap-4">
          <div className="flex items-baseline justify-between">
            <span className="text-sm font-semibold text-tertiary">In the room</span>
            <span className="text-sm font-semibold text-tertiary tabular-nums">{done} / {game.cards.length}</span>
          </div>
          <motion.div key={`${card.id}-${deck.length}`} initial={{ y: 24, opacity: 0 }} animate={miss ? { x: [0, -10, 10, -6, 6, 0], y: 0, opacity: 1 } : { y: 0, opacity: 1 }} transition={miss ? { duration: 0.4 } : springs.pop}
            className={cx('flex flex-col gap-2 rounded-2xl bg-primary p-5 shadow-lg ring-2 ring-inset', miss ? 'ring-error' : right ? 'ring-mint-600' : 'ring-secondary')} data-current-card>
            <span className="text-sm font-bold text-tertiary tabular-nums">Minute {m.minute} of {WORKSHOP_MINUTES}</span>
            <p className="text-lg font-semibold text-primary">{m.text}</p>
          </motion.div>
          <div className="grid grid-cols-2 gap-2" role="group" aria-label="Nisha’s move">
            {game.lanes.map(l => (
              <motion.button key={l.id} type="button" onClick={() => call(l.id)} disabled={!!miss || right} whileTap={{ scale: 0.97 }}
                className={cx('flex flex-col items-start gap-0.5 rounded-xl border-2 bg-primary px-3 py-2.5 text-left transition enabled:hover:bg-primary_hover disabled:cursor-default',
                  right && l.id === lane ? 'border-mint-600' : miss === l.id ? 'border-error' : miss && l.id === lane ? 'border-mint-600' : 'border-secondary')}>
                <span className="flex items-center gap-1.5 text-md font-bold text-primary"><span className="size-2.5 rounded-full" style={{ background: MOVE_TONE[l.id as Move] }} aria-hidden />{l.label}</span>
                <span className="text-xs font-medium text-tertiary">{l.hint}</span>
              </motion.button>
            ))}
          </div>
          <div className="min-h-14" aria-live="polite">
            {miss && <NibSays mood="sad">Not quite: <strong>{owner.label.toLowerCase()}</strong>, or {lost}. {card.note} It’ll come back round.</NibSays>}
            {right && (
              <div className="flex flex-col gap-3">
                <NibSays mood="cheer">{card.note}</NibSays>
                <div className="flex justify-end"><Button size="lg" onPress={next}>{deck.length > 1 ? 'Next moment' : 'End the workshop'}</Button></div>
              </div>
            )}
            {!miss && !right && <NibSays mood="think">What’s going wrong: one view taking over, voices missing, a tangent, or the clock?</NibSays>}
          </div>
        </div>
        <Room calls={calls} minute={Math.max(latest, m.minute)} />
      </div>
    </div>
  );
}
