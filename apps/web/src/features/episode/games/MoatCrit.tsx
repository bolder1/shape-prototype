'use client';
// Mini-game for st.4-1: crit the advantages in Munim's draft design strategy. Every card is a claim (its `visual`, a
// key of `MUNIM_CLAIMS`), shown with its evidence and how many months a funded rival needs to copy it. Call it holds,
// copyable, unvalued or wrong customer (`ADVANTAGE_CALLS`, scored by `advantageCall`): value first, then fit, then
// time to copy. Right calls plot it on the moat map, a grid of who values it × whether it lasts a year. First call
// scores; a missed card comes back later.
import { useState } from 'react';
import { motion } from 'motion/react';
import { COPY_MONTHS, MUNIM_CLAIMS, advantageCall, type AdvantageCall, type Episode, type MunimClaim } from '@shape/content';
import { springs } from '@shape/ui';
import { Button } from '@/components/base/buttons/button';
import { cx } from '@/utils/cx';
import { Burst, NibSays, StageTitle } from '../kit';
import { MOAT_FILL, MOAT_ROWS, MOAT_ROW_LABEL, moatCol, moatRow } from '../scenes/MoatMap';
import type { GameResult } from './DiamondSort';
import { play } from '@/lib/sound';

type Game = Episode['game'];

/** Why a wrong call is wrong, from the claim itself. */
function whyNot(k: MunimClaim) {
  const c = MUNIM_CLAIMS[k];
  switch (advantageCall(c)) {
    case 'unvalued': return `Nobody chooses Munim for it. ${c.evidence}.`;
    case 'offstrategy': return `Someone values it, but not the small firms and CAs Munim serves. ${c.evidence}.`;
    case 'copyable': return `Customers value it, but a funded rival matches it in about ${c.copyMonths} months.`;
    case 'holds': return `Customers choose Munim for it, and a rival needs about ${c.copyMonths} months to match it.`;
  }
}

export function MoatCrit({ game, onDone }: { game: Game; onDone: (results: GameResult[]) => void }) {
  const [deck, setDeck] = useState(game.cards);
  const [results, setResults] = useState<Record<string, boolean>>({});
  const [placed, setPlaced] = useState<MunimClaim[]>([]);
  const [miss, setMiss] = useState<{ lane: string; why: string } | null>(null);
  const [right, setRight] = useState(false);
  const card = deck[0];

  const map = (
    <div className="flex flex-col gap-2 rounded-2xl bg-secondary p-3">
      <span className="text-sm font-bold text-primary">The moat map</span>
      <div className="grid grid-cols-2 gap-1.5 text-xs font-bold text-tertiary">
        <span>Copied within a year</span><span>{COPY_MONTHS}+ months to copy</span>
      </div>
      {MOAT_ROWS.map(r => (
        <div key={r} className="flex flex-col gap-1">
          <span className="text-xs font-bold text-secondary">{MOAT_ROW_LABEL[r]}</span>
          <div className="grid grid-cols-2 gap-1.5">
            {(['soon', 'late'] as const).map(col => {
              const here = placed.filter(k => moatRow(MUNIM_CLAIMS[k]) === r && moatCol(MUNIM_CLAIMS[k]) === col);
              const moat = r === 'ours' && col === 'late';
              return (
                <div key={col} className={cx('flex min-h-11 flex-wrap content-start gap-1 rounded-lg bg-primary p-1.5', moat && 'ring-2 ring-inset ring-mint-600')}>
                  {here.map(k => (
                    <motion.span key={k} initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={springs.pop}
                      className="rounded-full px-2 py-0.5 text-xs font-bold text-white" style={{ background: MOAT_FILL[advantageCall(MUNIM_CLAIMS[k])] }}>{MUNIM_CLAIMS[k].short}</motion.span>
                  ))}
                  {here.length === 0 && moat && <span className="px-1 text-xs font-semibold text-tertiary">The advantage</span>}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );

  if (!card) {
    const n = Object.values(results).filter(Boolean).length;
    return (
      <div className="relative flex flex-col gap-5 py-6">
        <Burst count={36} />
        <StageTitle eyebrow="Strategy crit done" title={`${n} of ${game.cards.length} right first time`}>
          Three claims hold, and all three sit behind the screen: research and data, a network, and hard capability. The rest is quality to keep up, or work to stop.
        </StageTitle>
        {map}
        <NibSays mood={n === game.cards.length ? 'cheer' : 'idle'}>Valued by your customers, and a year or more to copy. That corner is the strategy.</NibSays>
        <Button size="xl" onPress={() => onDone(game.cards.map(c => ({ id: c.id, correct: !!results[c.id] })))}>Continue the story</Button>
      </div>
    );
  }

  const k = card.visual as MunimClaim;
  const c = MUNIM_CLAIMS[k];
  const lane = advantageCall(c);
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
        <span className="text-sm font-semibold text-tertiary">Design strategy · draft 1</span>
        <span className="text-sm font-semibold text-tertiary tabular-nums">{done} / {game.cards.length}</span>
      </div>
      <motion.div key={`${card.id}-${deck.length}`} initial={{ y: 24, opacity: 0 }}
        animate={miss ? { x: [0, -10, 10, -6, 6, 0], y: 0, opacity: 1 } : { y: 0, opacity: 1 }}
        transition={miss ? { duration: 0.4 } : springs.pop}
        className={cx('flex flex-col gap-3 rounded-2xl bg-primary p-4 shadow-lg ring-2 ring-inset sm:p-5', miss ? 'ring-error' : right ? 'ring-mint-600' : 'ring-secondary')} data-current-card>
        <span className="text-xs font-bold tracking-wide text-tertiary uppercase">Claimed advantage</span>
        <p className="text-lg font-semibold text-primary">“{card.label}”</p>
        <dl className="flex flex-col gap-1.5 text-sm">
          <div className="flex flex-col gap-0.5 rounded-lg bg-secondary px-3 py-2">
            <dt className="text-xs font-bold text-tertiary">Evidence</dt>
            <dd className="font-medium text-primary">{c.evidence}</dd>
          </div>
          <div className="flex items-center justify-between gap-3 rounded-lg bg-secondary px-3 py-2">
            <dt className="text-xs font-bold text-tertiary">A funded rival needs</dt>
            <dd className="font-bold text-primary tabular-nums">about {c.copyMonths} months</dd>
          </div>
        </dl>
        {right && c.source && (
          <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={springs.pop}
            className="rounded-lg px-3 py-2 text-sm font-semibold text-primary" style={{ boxShadow: `inset 3px 0 0 ${MOAT_FILL.holds}` }}>
            Why it lasts: {c.source}.
          </motion.p>
        )}
      </motion.div>
      <div className="grid grid-cols-2 gap-2" role="group" aria-label="What this claim is">
        {game.lanes.map(l => (
          <motion.button key={l.id} type="button" onClick={() => call(l.id)} disabled={!!miss || right} whileTap={{ scale: 0.97 }}
            className={cx('flex flex-col items-start gap-0.5 rounded-xl border-2 bg-primary px-3 py-2.5 text-left transition enabled:hover:bg-primary_hover disabled:cursor-default',
              right && l.id === lane ? 'border-mint-600' : miss?.lane === l.id ? 'border-error' : miss && l.id === lane ? 'border-mint-600' : 'border-secondary')}>
            <span className="flex items-center gap-1.5 text-md font-bold text-primary"><span className="size-2.5 shrink-0 rounded-full" style={{ background: MOAT_FILL[l.id as AdvantageCall] }} aria-hidden />{l.label}</span>
            <span className="text-xs font-medium text-tertiary">{l.hint}</span>
          </motion.button>
        ))}
      </div>
      <div className="min-h-14" aria-live="polite">
        {miss && <NibSays mood="sad">{miss.why} {card.note} It’ll come back round.</NibSays>}
        {right && (
          <div className="flex flex-col gap-3">
            <NibSays mood="cheer">{card.note}</NibSays>
            <div className="flex justify-end"><Button size="lg" onPress={next}>{deck.length > 1 ? 'Next claim' : 'See the map'}</Button></div>
          </div>
        )}
        {!miss && !right && <NibSays mood="think">First: do Munim’s customers choose it? Then: are they the customers Munim serves? Then: would a rival need a year?</NibSays>}
      </div>
      {map}
    </div>
  );
}
