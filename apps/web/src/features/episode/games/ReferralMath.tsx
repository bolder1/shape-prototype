'use client';
// Mini-game for gr.4-4: run the numbers on Riyaaz's referral designs. Every card (its `visual`, a key of
// `RIYAAZ_REFERRALS`) shows its sum, invites × join × still practising, next to today's (`REFERRAL_BASE`). Call it
// ship, hollow, dark or flat (`REFERRAL_CALLS`, scored by `referralCall`): fairness first, then kept K, then K. Right
// calls plot it on a K × kept K chart with today's lines through it. First call scores; a missed card comes back later.
import { useState } from 'react';
import { motion } from 'motion/react';
import { REFERRAL_BASE, RIYAAZ_REFERRALS, kFactor, keptK, referralCall, type Episode, type ReferralCall, type RiyaazReferral } from '@shape/content';
import { springs } from '@shape/ui';
import { Button } from '@/components/base/buttons/button';
import { cx } from '@/utils/cx';
import { Burst, NibSays, StageTitle } from '../kit';
import { REFERRAL_FILL } from '../scenes/ViralLoop';
import type { GameResult } from './DiamondSort';
import { play } from '@/lib/sound';

type Game = Episode['game'];

const pct = (n: number) => `${Math.round(n * 100)}%`;
const K_MAX = 0.7, KEPT_MAX = 0.26;

function whyNot(k: RiyaazReferral) {
  const r = RIYAAZ_REFERRALS[k];
  switch (referralCall(r)) {
    case 'dark': return `${r.unfair}. Kept K is ${keptK(r)}, better than today, and it still isn’t fair.`;
    case 'hollow': return `K rises to ${kFactor(r)}, but kept K is ${keptK(r)}, below today’s ${keptK(REFERRAL_BASE)}. The friends leave.`;
    case 'flat': return `Fair, but kept K is ${keptK(r)}, no better than today’s ${keptK(REFERRAL_BASE)}.`;
    case 'ship': return `Fair, and kept K rises from ${keptK(REFERRAL_BASE)} to ${keptK(r)}.`;
  }
}

export function ReferralMath({ game, onDone }: { game: Game; onDone: (results: GameResult[]) => void }) {
  const [deck, setDeck] = useState(game.cards);
  const [results, setResults] = useState<Record<string, boolean>>({});
  const [placed, setPlaced] = useState<RiyaazReferral[]>([]);
  const [miss, setMiss] = useState<{ lane: string; why: string } | null>(null);
  const [right, setRight] = useState(false);
  const card = deck[0];

  const x = (k: number) => 40 + (Math.min(k, K_MAX) / K_MAX) * 290;
  const y = (k: number) => 170 - (Math.min(k, KEPT_MAX) / KEPT_MAX) * 150;
  const chart = (
    <div className="flex flex-col gap-2 rounded-2xl bg-secondary p-3">
      <span className="text-sm font-bold text-primary">K against kept K</span>
      <svg viewBox="0 0 340 200" className="w-full rounded-lg bg-primary" role="img" aria-label={`Chart of ${placed.length} designs placed so far: ${placed.map(k => `${RIYAAZ_REFERRALS[k].short}, K ${kFactor(RIYAAZ_REFERRALS[k])}, kept K ${keptK(RIYAAZ_REFERRALS[k])}`).join('; ')}`}>
        <line x1={x(kFactor(REFERRAL_BASE))} y1={14} x2={x(kFactor(REFERRAL_BASE))} y2={170} stroke="var(--color-border-secondary)" strokeWidth={2} strokeDasharray="5 5" />
        <line x1={40} y1={y(keptK(REFERRAL_BASE))} x2={330} y2={y(keptK(REFERRAL_BASE))} stroke="var(--color-border-secondary)" strokeWidth={2} strokeDasharray="5 5" />
        <line x1={40} y1={170} x2={330} y2={170} stroke="var(--color-text-tertiary)" strokeWidth={1.5} />
        <line x1={40} y1={14} x2={40} y2={170} stroke="var(--color-text-tertiary)" strokeWidth={1.5} />
        <text x={330} y={192} fontSize={14} fontWeight={700} fill="var(--color-text-tertiary)" textAnchor="end">K →</text>
        <text x={44} y={26} fontSize={14} fontWeight={700} fill="var(--color-text-tertiary)">kept K ↑</text>
        <text x={x(kFactor(REFERRAL_BASE)) + 4} y={164} fontSize={14} fontWeight={700} fill="var(--color-text-tertiary)">today</text>
        {placed.map(k => {
          const r = RIYAAZ_REFERRALS[k];
          const c = referralCall(r);
          return (
            <motion.g key={k} initial={{ opacity: 0, scale: 0.4 }} animate={{ opacity: 1, scale: 1 }} transition={springs.pop} style={{ transformOrigin: `${x(kFactor(r))}px ${y(keptK(r))}px` }}>
              {c === 'dark'
                ? <path d={`M${x(kFactor(r)) - 6} ${y(keptK(r)) - 6} l12 12 m0 -12 l-12 12`} stroke={REFERRAL_FILL.dark} strokeWidth={3} strokeLinecap="round" />
                : <circle cx={x(kFactor(r))} cy={y(keptK(r))} r={6} fill={REFERRAL_FILL[c]} />}
            </motion.g>
          );
        })}
      </svg>
      {placed.length > 0 && (
        <ul className="flex flex-wrap gap-1" aria-hidden>
          {placed.map(k => <li key={k} className="rounded-full px-2 py-0.5 text-xs font-bold text-white" style={{ background: REFERRAL_FILL[referralCall(RIYAAZ_REFERRALS[k])] }}>{RIYAAZ_REFERRALS[k].short}</li>)}
        </ul>
      )}
    </div>
  );

  if (!card) {
    const n = Object.values(results).filter(Boolean).length;
    return (
      <div className="relative flex flex-col gap-5 py-6">
        <Burst count={36} />
        <StageTitle eyebrow="Referral numbers run" title={`${n} of ${game.cards.length} right first time`}>
          Three designs bring people who stay. Three buy sign-ups who leave, three move nothing, and three would win on numbers alone and still aren’t the user’s choice.
        </StageTitle>
        {chart}
        <NibSays mood={n === game.cards.length ? 'cheer' : 'idle'}>Fair first. Then count the friends who are still singing a month later.</NibSays>
        <Button size="xl" onPress={() => onDone(game.cards.map(c => ({ id: c.id, correct: !!results[c.id] })))}>Continue the story</Button>
      </div>
    );
  }

  const k = card.visual as RiyaazReferral;
  const r = RIYAAZ_REFERRALS[k];
  const lane = referralCall(r);
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
  const row = (label: string, ref: typeof r, strong: boolean) => (
    <div className={cx('grid grid-cols-[4.5rem_1fr_1fr_1fr_1fr] items-center gap-1 rounded-lg px-2 py-1.5 text-sm tabular-nums', strong ? 'bg-secondary font-bold text-primary' : 'font-medium text-tertiary')}>
      <span className="text-xs font-bold">{label}</span>
      <span>{ref.invites}</span><span>{pct(ref.conversion)}</span><span>{pct(ref.kept)}</span>
      <span className={cx(strong && keptK(ref) > keptK(REFERRAL_BASE) ? 'text-success-primary' : '')}>{keptK(ref)}</span>
    </div>
  );

  return (
    <div className="flex flex-col gap-5">
      <StageTitle eyebrow="Play" title={game.title}>{game.instructions}</StageTitle>
      <div className="flex items-baseline justify-between">
        <span className="text-sm font-semibold text-tertiary">Referral designs</span>
        <span className="text-sm font-semibold text-tertiary tabular-nums">{done} / {game.cards.length}</span>
      </div>
      <motion.div key={`${card.id}-${deck.length}`} initial={{ y: 24, opacity: 0 }}
        animate={miss ? { x: [0, -10, 10, -6, 6, 0], y: 0, opacity: 1 } : { y: 0, opacity: 1 }}
        transition={miss ? { duration: 0.4 } : springs.pop}
        className={cx('flex flex-col gap-3 rounded-2xl bg-primary p-4 shadow-lg ring-2 ring-inset sm:p-5', miss ? 'ring-error' : right ? 'ring-mint-600' : 'ring-secondary')} data-current-card>
        <span className="text-xs font-bold tracking-wide text-tertiary uppercase">Referral design</span>
        <p className="text-lg font-semibold text-primary">{card.label}</p>
        <div className="flex flex-col gap-0.5" role="table" aria-label="Invites per student, share who join, share still practising at 30 days, and kept K">
          <div className="grid grid-cols-[4.5rem_1fr_1fr_1fr_1fr] gap-1 px-2 text-xs font-bold text-tertiary" aria-hidden>
            <span /><span>Invites</span><span>Join</span><span>Stay</span><span>Kept K</span>
          </div>
          {row('Today', REFERRAL_BASE, false)}
          {row('This', r, true)}
        </div>
      </motion.div>
      <div className="grid grid-cols-2 gap-2" role="group" aria-label="What to do with this design">
        {game.lanes.map(l => (
          <motion.button key={l.id} type="button" onClick={() => call(l.id)} disabled={!!miss || right} whileTap={{ scale: 0.97 }}
            className={cx('flex flex-col items-start gap-0.5 rounded-xl border-2 bg-primary px-3 py-2.5 text-left transition enabled:hover:bg-primary_hover disabled:cursor-default',
              right && l.id === lane ? 'border-mint-600' : miss?.lane === l.id ? 'border-error' : miss && l.id === lane ? 'border-mint-600' : 'border-secondary')}>
            <span className="flex items-center gap-1.5 text-md font-bold text-primary"><span className="size-2.5 shrink-0 rounded-full" style={{ background: REFERRAL_FILL[l.id as ReferralCall] }} aria-hidden />{l.label}</span>
            <span className="text-xs font-medium text-tertiary">{l.hint}</span>
          </motion.button>
        ))}
      </div>
      <div className="min-h-14" aria-live="polite">
        {miss && <NibSays mood="sad">{miss.why} {card.note} It’ll come back round.</NibSays>}
        {right && (
          <div className="flex flex-col gap-3">
            <NibSays mood="cheer">{card.note}</NibSays>
            <div className="flex justify-end"><Button size="lg" onPress={next}>{deck.length > 1 ? 'Next design' : 'See the chart'}</Button></div>
          </div>
        )}
        {!miss && !right && <NibSays mood="think">Is every message the student’s own choice? Then: do the friends it brings still practise a month later?</NibSays>}
      </div>
      {chart}
    </div>
  );
}
