'use client';
// Mini-game for bz.3-3: route Lakshmi's ticket queue. Every card is a theme (its `visual`, a key of
// `PARCHA_SIGNALS`), shown as a ticket with its clinic, ticket count, clinics and revenue. Send it to one of four
// routes (`ROUTES`): a design fix, a guide, back to sales, or the roadmap. A right call drops it into that route's bin,
// whose clinics-to-tell (`loopAccounts`) and revenue (`arrByRoute`) update, and says who acts (`ROUTE_OWNER`). A miss
// explains and the ticket comes back later; first call scores. The end puts the queue ranked by tickets beside the
// queue ranked by revenue (`rankSignals`), so the loudest theme and the biggest one sit side by side.
import { useState } from 'react';
import { motion } from 'motion/react';
import { PARCHA_SIGNALS, ROUTE_OWNER, arrByRoute, lakh, loopAccounts, rankSignals, type Episode, type ParchaSignal, type Route } from '@shape/content';
import { springs } from '@shape/ui';
import { Button } from '@/components/base/buttons/button';
import { cx } from '@/utils/cx';
import { Burst, NibSays, StageTitle } from '../kit';
import { ROUTE_TONE, SIGNAL_SHORT } from '../scenes/CsLoop';
import type { GameResult } from './DiamondSort';
import { play } from '@/lib/sound';

type Game = Episode['game'];
const S = (k: string) => PARCHA_SIGNALS[k as ParchaSignal];

function Bins({ game, routed, hot }: { game: Game; routed: ParchaSignal[]; hot?: Route }) {
  const arr = arrByRoute(routed);
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
      {game.lanes.map(l => {
        const r = l.id as Route;
        const n = routed.filter(k => PARCHA_SIGNALS[k].route === r).length;
        return (
          <div key={r} className={cx('flex flex-col gap-1 rounded-xl bg-secondary p-3 ring-2 ring-inset transition', hot === r ? 'ring-mint-600' : 'ring-transparent')}>
            <span className="flex items-center gap-1.5 text-sm font-bold text-primary"><span className="size-2.5 rounded-full" style={{ background: ROUTE_TONE[r] }} aria-hidden />{l.label}</span>
            <span className="text-lg font-bold text-primary tabular-nums">{lakh(arr[r])}</span>
            <span className="text-xs font-medium text-tertiary tabular-nums">{n} theme{n === 1 ? '' : 's'} · {loopAccounts(routed, r)} clinics to tell</span>
          </div>
        );
      })}
    </div>
  );
}

function Rank({ title, keys, by }: { title: string; keys: ParchaSignal[]; by: 'tickets' | 'arr' }) {
  const top = rankSignals(keys, by).slice(0, 4);
  const max = PARCHA_SIGNALS[top[0]][by];
  return (
    <div className="flex flex-col gap-2 rounded-xl bg-secondary p-4">
      <span className="text-sm font-bold text-primary">{title}</span>
      {top.map(k => (
        <div key={k} className="flex flex-col gap-1">
          <span className="text-xs font-semibold text-secondary">{SIGNAL_SHORT[k]}</span>
          <div className="flex items-center gap-2">
            <motion.div className="h-2.5 rounded-full" style={{ background: ROUTE_TONE[PARCHA_SIGNALS[k].route] }} initial={{ width: 0 }} animate={{ width: `${(PARCHA_SIGNALS[k][by] / max) * 70}%` }} transition={springs.pop} />
            <span className="shrink-0 text-xs font-bold text-primary tabular-nums">{by === 'tickets' ? `${PARCHA_SIGNALS[k].tickets} tickets` : lakh(PARCHA_SIGNALS[k].arr)}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

export function SignalRoute({ game, onDone }: { game: Game; onDone: (results: GameResult[]) => void }) {
  const [deck, setDeck] = useState(game.cards);
  const [results, setResults] = useState<Record<string, boolean>>({});
  const [routed, setRouted] = useState<ParchaSignal[]>([]);
  const [miss, setMiss] = useState<string | null>(null);
  const [right, setRight] = useState(false);
  const card = deck[0];

  if (!card) {
    const n = Object.values(results).filter(Boolean).length;
    return (
      <div className="relative flex flex-col gap-5 py-6">
        <Burst count={36} />
        <StageTitle eyebrow="Queue routed" title={`${n} of ${game.cards.length} routed first time`}>
          The loudest theme isn’t the biggest. Rank by the clinics and revenue behind a theme, then close the loop with everyone who asked.
        </StageTitle>
        <div className="grid gap-3 sm:grid-cols-2">
          <Rank title="By tickets" keys={routed} by="tickets" />
          <Rank title="By revenue of the clinics asking" keys={routed} by="arr" />
        </div>
        <Bins game={game} routed={routed} />
        <NibSays mood={n === game.cards.length ? 'cheer' : 'idle'}>Book a monthly half hour with CS to go through the tags together. The themes change less than you’d think; the counts tell you whether your fixes worked.</NibSays>
        <Button size="xl" onPress={() => onDone(game.cards.map(c => ({ id: c.id, correct: !!results[c.id] })))}>Continue the story</Button>
      </div>
    );
  }

  const k = card.visual as ParchaSignal;
  const s = S(k);
  const owner = game.lanes.find(l => l.id === s.route)!;
  const done = game.cards.length - deck.length;
  const call = (laneId: string) => {
    if (miss || right) return;
    const ok = laneId === s.route;
    play(ok ? 'correct' : 'wrong');
    setResults(r => (card.id in r ? r : { ...r, [card.id]: ok }));
    if (ok) { setRight(true); setRouted(rs => [...rs, k]); }
    else { setMiss(laneId); setTimeout(() => { setMiss(null); setDeck(d => [...d.slice(1), d[0]]); }, 3200); }
  };
  const next = () => { setRight(false); setDeck(d => d.slice(1)); };

  return (
    <div className="flex flex-col gap-5">
      <StageTitle eyebrow="Play" title={game.title}>{game.instructions}</StageTitle>
      <div className="flex items-baseline justify-between">
        <span className="text-sm font-semibold text-tertiary">Lakshmi’s queue, last month</span>
        <span className="text-sm font-semibold text-tertiary tabular-nums">{done} / {game.cards.length}</span>
      </div>
      <motion.div key={`${card.id}-${deck.length}`} initial={{ x: 40, opacity: 0 }} animate={miss ? { x: [0, -10, 10, -6, 6, 0], opacity: 1 } : { x: 0, opacity: 1 }} transition={miss ? { duration: 0.4 } : springs.pop}
        className={cx('flex flex-col gap-3 rounded-2xl bg-primary p-5 shadow-lg ring-2 ring-inset', miss ? 'ring-error' : right ? 'ring-mint-600' : 'ring-secondary')} data-current-card>
        <span className="text-sm font-semibold text-tertiary">{s.from}</span>
        <p className="text-lg font-semibold text-primary">“{s.text}”</p>
        <div className="flex flex-wrap gap-2 text-xs font-bold">
          <span className="rounded-full bg-secondary px-2.5 py-1 text-secondary tabular-nums">{s.tickets} tickets</span>
          <span className="rounded-full bg-secondary px-2.5 py-1 text-secondary tabular-nums">{s.accounts} clinic{s.accounts === 1 ? '' : 's'}</span>
          <span className="rounded-full bg-secondary px-2.5 py-1 text-secondary tabular-nums">{lakh(s.arr)} a year</span>
        </div>
      </motion.div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4" role="group" aria-label="Routes">
        {game.lanes.map(l => (
          <motion.button key={l.id} type="button" onClick={() => call(l.id)} disabled={!!miss || right} whileTap={{ scale: 0.97 }}
            className={cx('flex flex-col items-start gap-0.5 rounded-xl border-2 bg-primary px-3 py-2.5 text-left transition enabled:hover:bg-primary_hover disabled:cursor-default',
              right && l.id === s.route ? 'border-mint-600' : miss === l.id ? 'border-error' : miss && l.id === s.route ? 'border-mint-600' : 'border-secondary')}>
            <span className="flex items-center gap-1.5 text-md font-bold text-primary"><span className="size-2.5 rounded-full" style={{ background: ROUTE_TONE[l.id as Route] }} aria-hidden />{l.label}</span>
            <span className="text-xs font-medium text-tertiary">{l.hint}</span>
          </motion.button>
        ))}
      </div>
      <div className="min-h-14" aria-live="polite">
        {miss && <NibSays mood="sad">Not quite: it’s a <strong>{owner.label.toLowerCase()}</strong>. {card.note} It’ll come back round.</NibSays>}
        {right && (
          <div className="flex flex-col gap-3">
            <NibSays mood="cheer">{card.note} <span className="font-semibold">{ROUTE_OWNER[s.route]}</span></NibSays>
            <div className="flex justify-end"><Button size="lg" onPress={next}>{deck.length > 1 ? 'Next ticket' : 'See the queue ranked'}</Button></div>
          </div>
        )}
        {!miss && !right && <NibSays mood="think">Is the design wrong, is it hidden, was it promised, or does it not exist yet?</NibSays>}
      </div>
      <Bins game={game} routed={routed} hot={right ? s.route : undefined} />
    </div>
  );
}
