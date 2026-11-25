'use client';
// Mini-game for ds.5-2: sort Sawari's booking-flow decisions for parity. Every card is a decision (its `visual`, a key
// of `SAWARI_DECISIONS`). Same everywhere, adapted to each platform's units, or each platform's own control
// (`PARITY_CALLS`, scored by `parityCall`). Right calls draw it on iOS, Android and the web from its `show`, and add a
// row to the flow's platform table. First call scores; a missed card comes back later.
import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  PARITY_PLATFORMS, PARITY_PLATFORM_LABEL, SAWARI_DECISIONS, parityCall,
  type Episode, type ParityCall, type ParityPlatform, type SawariDecision,
} from '@shape/content';
import { springs } from '@shape/ui';
import { Button } from '@/components/base/buttons/button';
import { cx } from '@/utils/cx';
import { Burst, NibSays, StageTitle } from '../kit';
import { PARITY_FILL } from '../scenes/PlatformParity';
import type { GameResult } from './DiamondSort';
import { play } from '@/lib/sound';

type Game = Episode['game'];
const LABEL: Record<ParityCall, string> = { same: 'Same', adapt: 'Adapt', native: 'Native' };

/** One platform's frame, with what it shows. */
function Device({ platform, text, call, i }: { platform: ParityPlatform; text: string; call: ParityCall; i: number }) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ ...springs.pop, delay: i * 0.12 }}
      className={cx('flex min-w-0 flex-col items-center gap-1.5 border-2 border-secondary bg-primary px-2 pt-2 pb-3', platform === 'web' ? 'rounded-lg' : 'rounded-2xl')}>
      <span aria-hidden className={cx('bg-secondary', platform === 'ios' ? 'h-2 w-8 rounded-full' : platform === 'android' ? 'size-2 rounded-full' : 'h-2 w-full rounded-full')} />
      <span className="text-xs font-bold text-tertiary">{PARITY_PLATFORM_LABEL[platform]}</span>
      <span className="flex min-h-12 w-full items-center justify-center rounded-md px-1.5 py-1 text-center text-sm font-semibold break-words text-primary" style={{ boxShadow: `inset 0 0 0 2px ${PARITY_FILL[call]}` }}>{text}</span>
    </motion.div>
  );
}

export function ParitySort({ game, onDone }: { game: Game; onDone: (results: GameResult[]) => void }) {
  const [deck, setDeck] = useState(game.cards);
  const [results, setResults] = useState<Record<string, boolean>>({});
  const [placed, setPlaced] = useState<SawariDecision[]>([]);
  const [miss, setMiss] = useState<ParityCall | null>(null);
  const [right, setRight] = useState(false);
  const card = deck[0];
  const callOf = (k: SawariDecision) => parityCall(SAWARI_DECISIONS[k]);

  const table = (
    <div className="flex flex-col gap-2 rounded-2xl bg-secondary p-3">
      <span className="text-sm font-bold text-primary">Booking flow · platform table</span>
      {(['same', 'adapt', 'native'] as const).map(c => {
        const rows = placed.filter(k => callOf(k) === c);
        return (
          <div key={c} className="flex flex-col gap-1">
            <span className="w-fit rounded-full px-2.5 py-0.5 text-xs font-bold text-white" style={{ background: PARITY_FILL[c] }}>{LABEL[c]} · {rows.length}</span>
            <ul className="flex flex-col gap-0.5 pl-4">
              <AnimatePresence initial={false}>
                {rows.map(k => (
                  <motion.li key={k} layout initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} transition={springs.pop} className="list-disc text-sm text-secondary">
                    {SAWARI_DECISIONS[k].text}
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>
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
        <StageTitle eyebrow="Table written" title={`${n} of ${game.cards.length} right first time`}>
          The shared rows are what Sawari checks on all three platforms at every release. The rest is allowed, even expected, to differ.
        </StageTitle>
        {table}
        <NibSays mood={n === game.cards.length ? 'cheer' : 'idle'}>Match what the product means. Adapt what each platform measures its own way. Hand the rest to the platform riders already know.</NibSays>
        <Button size="xl" onPress={() => onDone(game.cards.map(c => ({ id: c.id, correct: !!results[c.id] })))}>Continue the story</Button>
      </div>
    );
  }

  const k = card.visual as SawariDecision;
  const d = SAWARI_DECISIONS[k];
  const lane = callOf(k);
  const done = game.cards.length - deck.length;
  const call = (laneId: string) => {
    if (miss || right) return;
    const ok = laneId === lane;
    play(ok ? 'correct' : 'wrong');
    setResults(rs => (card.id in rs ? rs : { ...rs, [card.id]: ok }));
    if (ok) { setRight(true); setPlaced(ps => [...ps, k]); }
    else { setMiss(laneId as ParityCall); setTimeout(() => { setMiss(null); setDeck(dk => [...dk.slice(1), dk[0]]); }, 3600); }
  };
  const next = () => { setRight(false); setDeck(dk => dk.slice(1)); };

  return (
    <div className="flex flex-col gap-5">
      <StageTitle eyebrow="Play" title={game.title}>{game.instructions}</StageTitle>
      <div className="flex items-baseline justify-between">
        <span className="text-sm font-semibold text-tertiary">Sawari’s booking flow</span>
        <span className="text-sm font-semibold text-tertiary tabular-nums">{done} / {game.cards.length}</span>
      </div>
      <motion.div key={`${card.id}-${deck.length}`} initial={{ y: 24, opacity: 0 }}
        animate={miss ? { x: [0, -10, 10, -6, 6, 0], y: 0, opacity: 1 } : { y: 0, opacity: 1 }}
        transition={miss ? { duration: 0.4 } : springs.pop}
        className={cx('flex flex-col gap-3 rounded-2xl bg-primary p-4 shadow-lg ring-2 ring-inset sm:p-5', miss ? 'ring-error' : right ? 'ring-mint-600' : 'ring-secondary')} data-current-card>
        <span className="text-xs font-bold tracking-wide text-tertiary uppercase">Decision</span>
        <p className="text-lg font-semibold text-primary">{card.label}</p>
        {right && (
          <div className="grid grid-cols-3 gap-2">
            {PARITY_PLATFORMS.map((pl, i) => <Device key={pl} platform={pl} text={d.show[pl]} call={lane} i={i} />)}
          </div>
        )}
      </motion.div>
      <div className="grid grid-cols-3 gap-2" role="group" aria-label="How this decision differs across platforms">
        {game.lanes.map(l => (
          <motion.button key={l.id} type="button" onClick={() => call(l.id)} disabled={!!miss || right} whileTap={{ scale: 0.97 }}
            className={cx('flex flex-col items-start gap-0.5 rounded-xl border-2 bg-primary px-3 py-2.5 text-left transition enabled:hover:bg-primary_hover disabled:cursor-default',
              right && l.id === lane ? 'border-mint-600' : miss === l.id ? 'border-error' : miss && l.id === lane ? 'border-mint-600' : 'border-secondary')}>
            <span className="flex items-center gap-1.5 text-md font-bold text-primary"><span className="size-2.5 shrink-0 rounded-sm" style={{ background: PARITY_FILL[l.id as ParityCall] }} aria-hidden />{l.label}</span>
            <span className="text-xs font-medium text-tertiary">{l.hint}</span>
          </motion.button>
        ))}
      </div>
      <div className="min-h-14" aria-live="polite">
        {miss && <NibSays mood="sad">Not {LABEL[miss].toLowerCase()}: this one is <strong>{LABEL[lane].toLowerCase()}</strong>. {card.note} It’ll come back round.</NibSays>}
        {right && (
          <div className="flex flex-col gap-3">
            <NibSays mood="cheer">{card.note}</NibSays>
            <div className="flex justify-end"><Button size="lg" onPress={next}>{deck.length > 1 ? 'Next decision' : 'See the table'}</Button></div>
          </div>
        )}
        {!miss && !right && <NibSays mood="think">Would a rider get a different answer, price or step? Then it’s the same everywhere. Does the OS already have its own control for it?</NibSays>}
      </div>
      {table}
    </div>
  );
}
