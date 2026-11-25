'use client';
// Mini-game for gr.4-2: crit Riyaaz's draft notifications. Every card (its `visual`, a key of `RIYAAZ_NUDGES`) shows as
// it would on Sunita's lock screen, with the time it would arrive and how many of its kind she has ignored. Call it
// send, pressure, noise or hold (`NUDGE_CALLS`, scored by `nudgeCall`): pressure first, then whose need, then the
// moment. Right calls file it into her week: sent, held (with `holdReason`), or kept off her phone. First call scores;
// a missed card comes back later.
import { useState } from 'react';
import { motion } from 'motion/react';
import { IGNORE_LIMIT, QUIET_FROM, QUIET_TO, RIYAAZ_NUDGES, holdReason, nudgeCall, type Episode, type NudgeCall, type RiyaazNudge } from '@shape/content';
import { springs } from '@shape/ui';
import { Button } from '@/components/base/buttons/button';
import { cx } from '@/utils/cx';
import { Burst, NibSays, StageTitle } from '../kit';
import { NUDGE_FILL, clock } from '../scenes/NudgeWeek';
import type { GameResult } from './DiamondSort';
import { play } from '@/lib/sound';

type Game = Episode['game'];

function whyNot(k: RiyaazNudge) {
  const n = RIYAAZ_NUDGES[k];
  switch (nudgeCall(n)) {
    case 'pressure': return `It pushes with ${n.pressure}. That’s a dark pattern, whoever it’s for.`;
    case 'noise': return 'It serves Riyaaz, not Sunita. Nobody is waiting on her and she didn’t ask for it.';
    case 'hold': return holdReason(n) === 'quiet'
      ? `Right message, but ${clock(n.hour)} is inside quiet hours (${QUIET_FROM}:00–${QUIET_TO}:00).`
      : `Right kind of message, but she has ignored ${n.ignored} in a row. After ${IGNORE_LIMIT}, stop and ask.`;
    case 'send': return 'It’s hers, it’s honest, and the time is fine. Send it.';
  }
}

const SHELF: { id: 'sent' | 'held' | 'off'; label: string }[] = [
  { id: 'sent', label: 'Sent' }, { id: 'held', label: 'Held or stopped' }, { id: 'off', label: 'Kept off her phone' },
];
const shelfOf = (c: NudgeCall) => (c === 'send' ? 'sent' : c === 'hold' ? 'held' : 'off');

export function NudgeCrit({ game, onDone }: { game: Game; onDone: (results: GameResult[]) => void }) {
  const [deck, setDeck] = useState(game.cards);
  const [results, setResults] = useState<Record<string, boolean>>({});
  const [placed, setPlaced] = useState<RiyaazNudge[]>([]);
  const [miss, setMiss] = useState<{ lane: string; why: string } | null>(null);
  const [right, setRight] = useState(false);
  const card = deck[0];

  const week = (
    <div className="flex flex-col gap-2 rounded-2xl bg-secondary p-3">
      <span className="text-sm font-bold text-primary">Sunita’s week</span>
      {SHELF.map(s => {
        const here = placed.filter(k => shelfOf(nudgeCall(RIYAAZ_NUDGES[k])) === s.id);
        return (
          <div key={s.id} className="flex flex-col gap-1">
            <span className="text-xs font-bold text-secondary">{s.label} · {here.length}</span>
            <div className="flex min-h-9 flex-wrap content-start gap-1 rounded-lg bg-primary p-1.5">
              {here.map(k => {
                const n = RIYAAZ_NUDGES[k];
                const r = holdReason(n);
                return (
                  <motion.span key={k} initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={springs.pop}
                    className="rounded-full px-2 py-0.5 text-xs font-bold text-white" style={{ background: NUDGE_FILL[nudgeCall(n)] }}>
                    {n.short}{r === 'quiet' ? ' → 07:00' : r === 'ignored' ? ' → ask' : ''}
                  </motion.span>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );

  if (!card) {
    const n = Object.values(results).filter(Boolean).length;
    return (
      <div className="relative flex flex-col gap-5 py-6">
        <Burst count={36} />
        <StageTitle eyebrow="Notifications critiqued" title={`${n} of ${game.cards.length} right first time`}>
          Of twelve drafts, three go out as written and three wait for a better moment. The other six never reach her lock screen.
        </StageTitle>
        {week}
        <NibSays mood={n === game.cards.length ? 'cheer' : 'idle'}>Fewer, kinder, better timed. That’s how the teacher’s note still gets read.</NibSays>
        <Button size="xl" onPress={() => onDone(game.cards.map(c => ({ id: c.id, correct: !!results[c.id] })))}>Continue the story</Button>
      </div>
    );
  }

  const k = card.visual as RiyaazNudge;
  const nd = RIYAAZ_NUDGES[k];
  const lane = nudgeCall(nd);
  const done = game.cards.length - deck.length;
  const call = (laneId: string) => {
    if (miss || right) return;
    const ok = laneId === lane;
    play(ok ? 'correct' : 'wrong');
    setResults(rs => (card.id in rs ? rs : { ...rs, [card.id]: ok }));
    if (ok) { setRight(true); setPlaced(ps => [...ps, k]); }
    else {
      setMiss({ lane: laneId, why: whyNot(k) });
      setTimeout(() => { setMiss(null); setDeck(dk => [...dk.slice(1), dk[0]]); }, 4200);
    }
  };
  const next = () => { setRight(false); setDeck(dk => dk.slice(1)); };

  return (
    <div className="flex flex-col gap-5">
      <StageTitle eyebrow="Play" title={game.title}>{game.instructions}</StageTitle>
      <div className="flex items-baseline justify-between">
        <span className="text-sm font-semibold text-tertiary">Draft notifications</span>
        <span className="text-sm font-semibold text-tertiary tabular-nums">{done} / {game.cards.length}</span>
      </div>
      <motion.div key={`${card.id}-${deck.length}`} initial={{ y: 24, opacity: 0 }}
        animate={miss ? { x: [0, -10, 10, -6, 6, 0], y: 0, opacity: 1 } : { y: 0, opacity: 1 }}
        transition={miss ? { duration: 0.4 } : springs.pop}
        className={cx('flex flex-col gap-3 rounded-3xl bg-gray-950 p-4 shadow-lg ring-2 ring-inset sm:p-5', miss ? 'ring-error' : right ? 'ring-mint-600' : 'ring-transparent')} data-current-card>
        <span className="text-center text-3xl font-bold text-white tabular-nums">{clock(nd.hour)}</span>
        <div className="flex flex-col gap-1 rounded-2xl bg-white px-3.5 py-3">
          <span className="flex items-center justify-between text-xs font-bold text-gray-600"><span>RIYAAZ</span><span>now</span></span>
          <p className="text-md font-semibold text-gray-900">{card.label}</p>
        </div>
        {nd.ignored > 0 && <span className="text-center text-sm font-semibold text-gray-300">She ignored the last {nd.ignored} of these</span>}
      </motion.div>
      <div className="grid grid-cols-2 gap-2" role="group" aria-label="What to do with this notification">
        {game.lanes.map(l => (
          <motion.button key={l.id} type="button" onClick={() => call(l.id)} disabled={!!miss || right} whileTap={{ scale: 0.97 }}
            className={cx('flex flex-col items-start gap-0.5 rounded-xl border-2 bg-primary px-3 py-2.5 text-left transition enabled:hover:bg-primary_hover disabled:cursor-default',
              right && l.id === lane ? 'border-mint-600' : miss?.lane === l.id ? 'border-error' : miss && l.id === lane ? 'border-mint-600' : 'border-secondary')}>
            <span className="flex items-center gap-1.5 text-md font-bold text-primary"><span className="size-2.5 shrink-0 rounded-full" style={{ background: NUDGE_FILL[l.id as NudgeCall] }} aria-hidden />{l.label}</span>
            <span className="text-xs font-medium text-tertiary">{l.hint}</span>
          </motion.button>
        ))}
      </div>
      <div className="min-h-14" aria-live="polite">
        {miss && <NibSays mood="sad">{miss.why} {card.note} It’ll come back round.</NibSays>}
        {right && (
          <div className="flex flex-col gap-3">
            <NibSays mood="cheer">{card.note}</NibSays>
            <div className="flex justify-end"><Button size="lg" onPress={next}>{deck.length > 1 ? 'Next draft' : 'See her week'}</Button></div>
          </div>
        )}
        {!miss && !right && <NibSays mood="think">Does it pressure? Whose need is it? Is this the moment, and is she still listening?</NibSays>}
      </div>
      {week}
    </div>
  );
}
