'use client';
// Mini-game for gr.4-3: keep, retarget, soften or cut Riyaaz's proposed game mechanics. Every card (its `visual`, a key
// of `RIYAAZ_MECHANICS`) shows what the mechanic counts, whether it pushes, and whether it charges. Call it
// (`REWARD_CALLS`, scored by `rewardCall`): money from loss or chance first, then what it counts, then how it feels.
// Right calls fill a scorecard, and kept mechanics light the self-determination need they support (`SDT_NEEDS`).
// First call scores; a missed card comes back later.
import { useState } from 'react';
import { motion } from 'motion/react';
import { RIYAAZ_MECHANICS, SDT_NEEDS, rewardCall, type Episode, type RewardCall, type RiyaazMechanic } from '@shape/content';
import { springs } from '@shape/ui';
import { Button } from '@/components/base/buttons/button';
import { cx } from '@/utils/cx';
import { Burst, NibSays, StageTitle } from '../kit';
import { REWARD_FILL } from '../scenes/StreakTrap';
import type { GameResult } from './DiamondSort';
import { play } from '@/lib/sound';

type Game = Episode['game'];

const COUNTS = { skill: 'The skill itself', practice: 'Real practice', proxy: 'A stand-in' } as const;
const NEED = { competence: 'Competence', autonomy: 'Autonomy', relatedness: 'Relatedness' } as const;

function whyNot(k: RiyaazMechanic) {
  const m = RIYAAZ_MECHANICS[k];
  switch (rewardCall(m)) {
    case 'cut': return 'It takes money from a loss or a chance. That gets cut before anything else.';
    case 'retarget': return 'It counts a stand-in: people can earn it without singing better.';
    case 'soften': return 'It counts the right thing, but it pushes with loss, ranking or force instead of informing.';
    case 'keep': return 'It counts the real thing and only informs. Keep it.';
  }
}

export function RewardPick({ game, onDone }: { game: Game; onDone: (results: GameResult[]) => void }) {
  const [deck, setDeck] = useState(game.cards);
  const [results, setResults] = useState<Record<string, boolean>>({});
  const [placed, setPlaced] = useState<RiyaazMechanic[]>([]);
  const [miss, setMiss] = useState<{ lane: string; why: string } | null>(null);
  const [right, setRight] = useState(false);
  const card = deck[0];

  const lit = new Set(placed.map(k => RIYAAZ_MECHANICS[k].need).filter(Boolean));
  const scorecard = (
    <div className="flex flex-col gap-2 rounded-2xl bg-secondary p-3">
      <span className="text-sm font-bold text-primary">Riyaaz’s game, rebuilt</span>
      <div className="grid grid-cols-3 gap-1.5">
        {SDT_NEEDS.map(n => (
          <span key={n} className={cx('rounded-lg px-2 py-1.5 text-center text-xs font-bold transition', lit.has(n) ? 'text-white' : 'bg-primary text-tertiary')}
            style={lit.has(n) ? { background: REWARD_FILL.keep } : undefined}>{NEED[n]}</span>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-1.5">
        {game.lanes.map(l => {
          const here = placed.filter(k => rewardCall(RIYAAZ_MECHANICS[k]) === l.id);
          return (
            <div key={l.id} className="flex min-h-16 flex-col gap-1 rounded-lg bg-primary p-1.5">
              <span className="text-xs font-bold text-secondary">{l.label}</span>
              <div className="flex flex-wrap gap-1">
                {here.map(k => (
                  <motion.span key={k} initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={springs.pop}
                    className={cx('rounded-full px-2 py-0.5 text-xs font-bold text-white', l.id === 'cut' && 'line-through')} style={{ background: REWARD_FILL[l.id as RewardCall] }}>{RIYAAZ_MECHANICS[k].short}</motion.span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  if (!card) {
    const n = Object.values(results).filter(Boolean).length;
    return (
      <div className="relative flex flex-col gap-5 py-6">
        <Burst count={36} />
        <StageTitle eyebrow="Mechanics reviewed" title={`${n} of ${game.cards.length} right first time`}>
          Three kept, one for each need. Three pointed at the skill, three made kinder, three cut for good.
        </StageTitle>
        {scorecard}
        <NibSays mood={n === game.cards.length ? 'cheer' : 'idle'}>Reward the singing, inform the singer, and never sell them their own loss.</NibSays>
        <Button size="xl" onPress={() => onDone(game.cards.map(c => ({ id: c.id, correct: !!results[c.id] })))}>Continue the story</Button>
      </div>
    );
  }

  const k = card.visual as RiyaazMechanic;
  const m = RIYAAZ_MECHANICS[k];
  const lane = rewardCall(m);
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
  const facts: [string, string, boolean][] = [
    ['Counts', COUNTS[m.rewards], m.rewards === 'proxy'],
    ['Feels', m.controlling ? 'Pushes' : 'Informs', m.controlling],
    ['Charges', m.paid ? 'For a loss or a chance' : 'Nothing', m.paid],
  ];

  return (
    <div className="flex flex-col gap-5">
      <StageTitle eyebrow="Play" title={game.title}>{game.instructions}</StageTitle>
      <div className="flex items-baseline justify-between">
        <span className="text-sm font-semibold text-tertiary">Proposed mechanics</span>
        <span className="text-sm font-semibold text-tertiary tabular-nums">{done} / {game.cards.length}</span>
      </div>
      <motion.div key={`${card.id}-${deck.length}`} initial={{ y: 24, opacity: 0 }}
        animate={miss ? { x: [0, -10, 10, -6, 6, 0], y: 0, opacity: 1 } : { y: 0, opacity: 1 }}
        transition={miss ? { duration: 0.4 } : springs.pop}
        className={cx('flex flex-col gap-3 rounded-2xl bg-primary p-4 shadow-lg ring-2 ring-inset sm:p-5', miss ? 'ring-error' : right ? 'ring-mint-600' : 'ring-secondary')} data-current-card>
        <span className="text-xs font-bold tracking-wide text-tertiary uppercase">Mechanic</span>
        <p className="text-lg font-semibold text-primary">{card.label}</p>
        {(miss || right) && (
          <motion.dl initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-3 gap-1.5 text-sm">
            {facts.map(([dt, dd, bad]) => (
              <div key={dt} className="flex flex-col gap-0.5 rounded-lg bg-secondary px-2.5 py-2">
                <dt className="text-xs font-bold text-tertiary">{dt}</dt>
                <dd className={cx('font-bold', bad ? 'text-error-primary' : 'text-primary')}>{dd}</dd>
              </div>
            ))}
          </motion.dl>
        )}
        {right && m.need && <span className="self-start rounded-full px-2.5 py-1 text-xs font-bold text-white" style={{ background: REWARD_FILL.keep }}>Supports {NEED[m.need].toLowerCase()}</span>}
      </motion.div>
      <div className="grid grid-cols-2 gap-2" role="group" aria-label="What to do with this mechanic">
        {game.lanes.map(l => (
          <motion.button key={l.id} type="button" onClick={() => call(l.id)} disabled={!!miss || right} whileTap={{ scale: 0.97 }}
            className={cx('flex flex-col items-start gap-0.5 rounded-xl border-2 bg-primary px-3 py-2.5 text-left transition enabled:hover:bg-primary_hover disabled:cursor-default',
              right && l.id === lane ? 'border-mint-600' : miss?.lane === l.id ? 'border-error' : miss && l.id === lane ? 'border-mint-600' : 'border-secondary')}>
            <span className="flex items-center gap-1.5 text-md font-bold text-primary"><span className="size-2.5 shrink-0 rounded-full" style={{ background: REWARD_FILL[l.id as RewardCall] }} aria-hidden />{l.label}</span>
            <span className="text-xs font-medium text-tertiary">{l.hint}</span>
          </motion.button>
        ))}
      </div>
      <div className="min-h-14" aria-live="polite">
        {miss && <NibSays mood="sad">{miss.why} {card.note} It’ll come back round.</NibSays>}
        {right && (
          <div className="flex flex-col gap-3">
            <NibSays mood="cheer">{card.note}</NibSays>
            <div className="flex justify-end"><Button size="lg" onPress={next}>{deck.length > 1 ? 'Next mechanic' : 'See the scorecard'}</Button></div>
          </div>
        )}
        {!miss && !right && <NibSays mood="think">Does it charge for a loss or a chance? Does it count the singing? Does it inform, or push?</NibSays>}
      </div>
      {scorecard}
    </div>
  );
}
