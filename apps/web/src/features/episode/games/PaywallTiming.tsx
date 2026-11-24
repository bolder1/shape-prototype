'use client';
// Mini-game for gr.2-3: each card is a moment in Meenakshi's first months with Kaksha (its `visual`, a key of
// `PRO_MOMENTS`). Choose what Kaksha does about Pro: offer it now, let her finish then offer, mention it quietly, or not
// sell. The right move is what `upgradeMove` says. Every first pick lands on the month's tally as `moveEffect`
// describes it (a sale, a lost draft, an annoyed tutor, a missed sale); a wrong pick shakes, says why and the card
// comes back later. First try scores. The end is the tally next to the fair Pro screen.
import { useState } from 'react';
import { motion } from 'motion/react';
import { KAKSHA_PRO, PRO_MOMENTS, UPGRADE_MOVES, moveEffect, type Episode, type ProMomentId, type UpgradeMove } from '@shape/content';
import { springs } from '@shape/ui';
import { Button } from '@/components/base/buttons/button';
import { cx } from '@/utils/cx';
import { Burst, NibSays, StageTitle } from '../kit';
import { MOVE_FILL, MOVE_NAME } from '../scenes/UpgradeMoment';
import type { GameResult } from './DiamondSort';
import { play } from '@/lib/sound';

type Game = Episode['game'];
type Effect = ReturnType<typeof moveEffect>;
const EFFECT: Record<Exclude<Effect, 'ok'>, { label: string; say: string }> = {
  sale: { label: 'Upgrades', say: 'She upgrades: she knows exactly what she’s paying for.' },
  lost: { label: 'Work lost', say: 'The paywall covered her task and she lost what she was doing.' },
  annoyed: { label: 'Annoyed', say: 'A pitch she didn’t need. That’s how the one-star reviews started.' },
  missed: { label: 'Sales missed', say: 'She reached for Pro and nothing offered it.' },
};

function Tally({ tally }: { tally: Record<Effect, number> }) {
  return (
    <dl className="grid grid-cols-2 gap-2 sm:grid-cols-4">
      {(Object.keys(EFFECT) as (keyof typeof EFFECT)[]).map(e => (
        <div key={e} className={cx('rounded-xl bg-secondary px-3 py-2 text-left', e !== 'sale' && tally[e] > 0 && 'ring-2 ring-error ring-inset')}>
          <dt className="text-xs font-semibold text-tertiary">{EFFECT[e].label}</dt>
          <dd className="text-display-xs font-semibold text-primary tabular-nums">{tally[e]}</dd>
        </div>
      ))}
    </dl>
  );
}

export function PaywallTiming({ game, onDone }: { game: Game; onDone: (results: GameResult[]) => void }) {
  const [deck, setDeck] = useState(game.cards);
  const [results, setResults] = useState<Record<string, boolean>>({});
  const [tally, setTally] = useState<Record<Effect, number>>({ sale: 0, lost: 0, annoyed: 0, missed: 0, ok: 0 });
  const [miss, setMiss] = useState<{ chose: UpgradeMove; effect: Effect } | null>(null);
  const [last, setLast] = useState<Game['cards'][number] | null>(null);
  const card = deck[0];
  const done = game.cards.length - deck.length;

  const choose = (m: UpgradeMove) => {
    if (!card || miss) return;
    const right = card.lane as UpgradeMove, ok = m === right, effect = moveEffect(m, right);
    play(ok ? 'correct' : 'wrong');
    if (!(card.id in results)) { setResults(x => ({ ...x, [card.id]: ok })); setTally(x => ({ ...x, [effect]: x[effect] + 1 })); }
    if (ok) { setLast(card); setDeck(d => d.slice(1)); }
    else { setLast(null); setMiss({ chose: m, effect }); setTimeout(() => { setMiss(null); setDeck(d => [...d.slice(1), d[0]]); }, 2800); }
  };

  if (!card) {
    const right = Object.values(results).filter(Boolean).length;
    return (
      <div className="relative flex flex-col items-center gap-5 py-6 text-center">
        <Burst count={36} />
        <StageTitle eyebrow="Kaksha Pro, timed" title={`${right} of ${game.cards.length} moments called first time`}>
          {`Pro is offered only when she has had value and reaches for it, and it says ₹${KAKSHA_PRO.yearly} a year, about ₹${Math.round(KAKSHA_PRO.yearly / 12)} a month, with a plain “Not now”.`}
        </StageTitle>
        <div className="w-full"><Tally tally={tally} /></div>
        <NibSays mood={tally.lost + tally.annoyed === 0 ? 'cheer' : 'idle'}>List every place your product asks for money, an account or a review. For each one, ask: has she had value yet, and is she in the middle of something?</NibSays>
        <Button size="xl" onPress={() => onDone(game.cards.map(c => ({ id: c.id, correct: !!results[c.id] })))}>Continue the story</Button>
      </div>
    );
  }

  const m = PRO_MOMENTS[card.visual as ProMomentId];
  const lane = game.lanes.find(l => l.id === card.lane)!;
  return (
    <div className="flex flex-col gap-5">
      <StageTitle eyebrow="Play" title={game.title}>{game.instructions}</StageTitle>
      <div className="flex items-baseline justify-between">
        <span className="text-sm font-semibold text-tertiary">{m.value ? 'She’s had value from Kaksha' : 'Before her first class'}</span>
        <span className="text-sm font-semibold text-tertiary tabular-nums">{done} / {game.cards.length}</span>
      </div>
      <motion.div key={`${card.id}-${deck.length}`} initial={{ y: -14, opacity: 0 }} animate={miss ? { x: [0, -10, 10, -6, 6, 0], opacity: 1 } : { y: 0, opacity: 1 }} transition={miss ? { duration: 0.4 } : springs.pop}
        className={cx('mx-auto w-full max-w-lg rounded-2xl bg-primary px-5 py-4 text-lg font-semibold text-primary shadow-lg ring-2 ring-inset', miss ? 'ring-error' : 'ring-secondary')} data-current-card>
        {card.label}
      </motion.div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {UPGRADE_MOVES.map(mv => {
          const l = game.lanes.find(x => x.id === mv);
          return (
            <motion.button key={mv} type="button" onClick={() => choose(mv)} disabled={!!miss} whileTap={{ scale: 0.97 }}
              className={cx('flex flex-col items-start gap-1 rounded-2xl border-2 bg-secondary p-3 text-left transition enabled:hover:bg-secondary_hover disabled:cursor-default',
                miss && mv === card.lane ? 'border-mint-600' : miss?.chose === mv ? 'border-error' : 'border-transparent')}>
              <span className="rounded-full px-2.5 py-0.5 text-xs font-bold text-white" style={{ background: MOVE_FILL[mv] }}>{MOVE_NAME[mv]}</span>
              {l && <span className="text-[11px] leading-tight text-tertiary">{l.hint}</span>}
            </motion.button>
          );
        })}
      </div>
      <Tally tally={tally} />
      <div className="min-h-14" aria-live="polite">
        {miss
          ? <NibSays mood="sad">{miss.effect !== 'ok' ? `${EFFECT[miss.effect].say} ` : ''}Here it’s <strong>{lane.label.toLowerCase()}</strong>. {card.note} It’ll come back round.</NibSays>
          : last && <NibSays mood="cheer">{last.note}</NibSays>}
      </div>
    </div>
  );
}
