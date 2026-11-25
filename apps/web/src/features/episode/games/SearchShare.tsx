'use client';
// Mini-game for br.4-3: read share of search. Every card is a month of search data (its `visual`, a key of
// `SUKOON_READINGS`): the brand's searches, every brand search in the category, and its share of paying subscribers.
// Call it gaining, holding, losing or distorted (`SOS_CALLS`, scored by `sosCall`): check the count is real, then
// compare share of search with share of market (`SOS_GAP`). Right calls plot clean readings on a share of search ×
// share of market chart, numbered and listed below it, and set distorted ones aside with what is wrong with them.
// First call scores; a missed card comes back later.
import { useState } from 'react';
import { motion } from 'motion/react';
import { SOS_GAP, SUKOON_READINGS, shareOfSearch, sosCall, sosGap, type Episode, type SosCall, type SukoonReading } from '@shape/content';
import { springs } from '@shape/ui';
import { Button } from '@/components/base/buttons/button';
import { cx } from '@/utils/cx';
import { Burst, NibSays, StageTitle } from '../kit';
import { SOS_FILL } from '../scenes/BrandTracker';
import type { GameResult } from './DiamondSort';
import { play } from '@/lib/sound';

type Game = Episode['game'];
const signed = (n: number) => (n > 0 ? `+${n}` : `${n}`);

/** Why a wrong call is wrong, from the reading itself. */
function whyNot(k: SukoonReading) {
  const r = SUKOON_READINGS[k];
  if (!r.clean) return `Check the count first. ${r.distortion}.`;
  const s = shareOfSearch(r), g = sosGap(r);
  return `${r.searches} of ${r.category} is ${s}% of searches against ${r.share}% of the market: ${signed(g)} points, ${Math.abs(g) < SOS_GAP ? 'within' : 'beyond'} ${SOS_GAP}.`;
}

export function SearchShare({ game, onDone }: { game: Game; onDone: (results: GameResult[]) => void }) {
  const [deck, setDeck] = useState(game.cards);
  const [results, setResults] = useState<Record<string, boolean>>({});
  const [placed, setPlaced] = useState<SukoonReading[]>([]);
  const [miss, setMiss] = useState<{ lane: string; why: string } | null>(null);
  const [right, setRight] = useState(false);
  const card = deck[0];

  const clean = placed.filter(k => SUKOON_READINGS[k].clean);
  const aside = placed.filter(k => !SUKOON_READINGS[k].clean);
  // Chart: x = share of market, y = share of search, both 0–40%.
  const X = (v: number) => 40 + (v / 40) * 270, Y = (v: number) => 200 - (v / 40) * 180;
  const chart = (
    <div className="flex flex-col gap-2 rounded-2xl bg-secondary p-3">
      <span className="text-sm font-bold text-primary">Share of search against share of market</span>
      <svg viewBox="0 0 320 236" className="w-full" role="img" aria-label={`Chart of ${clean.length} clean readings: above the band is gaining, inside it holding, below it losing.`}>
        <polygon points={`${X(0)},${Y(SOS_GAP)} ${X(40 - SOS_GAP)},${Y(40)} ${X(40)},${Y(40)} ${X(40)},${Y(40 - SOS_GAP)} ${X(SOS_GAP)},${Y(0)} ${X(0)},${Y(0)}`} fill={SOS_FILL.hold} opacity={0.12} />
        <line x1={X(0)} y1={Y(0)} x2={X(40)} y2={Y(40)} stroke="currentColor" strokeDasharray="4 4" className="text-tertiary" />
        <line x1={X(0)} y1={Y(0)} x2={X(40)} y2={Y(0)} stroke="currentColor" className="text-tertiary" />
        <line x1={X(0)} y1={Y(0)} x2={X(0)} y2={Y(40)} stroke="currentColor" className="text-tertiary" />
        {[0, 20, 40].map(v => (
          <g key={v} className="fill-current text-tertiary">
            <text x={X(v)} y={Y(0) + 16} fontSize={12} fontWeight={700} textAnchor="middle">{v}%</text>
            <text x={X(0) - 6} y={Y(v) + 4} fontSize={12} fontWeight={700} textAnchor="end">{v}%</text>
          </g>
        ))}
        <text x={X(20)} y={232} fontSize={12} fontWeight={700} textAnchor="middle" className="fill-current text-tertiary">Share of market</text>
        <text x={X(2)} y={Y(36)} fontSize={12} fontWeight={800} fill={SOS_FILL.gain}>Gaining</text>
        <text x={X(38)} y={Y(8)} fontSize={12} fontWeight={800} fill={SOS_FILL.lose} textAnchor="end">Losing</text>
        {clean.map((k, i) => {
          const r = SUKOON_READINGS[k];
          return (
            <g key={k}>
              <circle cx={X(r.share)} cy={Y(shareOfSearch(r))} r={9} fill={SOS_FILL[sosCall(r)]} />
              <text x={X(r.share)} y={Y(shareOfSearch(r)) + 4} fontSize={11} fontWeight={800} fill="#fff" textAnchor="middle">{i + 1}</text>
            </g>
          );
        })}
      </svg>
      {clean.length > 0 && (
        <ol className="flex flex-col gap-0.5 text-sm">
          {clean.map((k, i) => {
            const r = SUKOON_READINGS[k];
            return (
              <li key={k} className="flex items-center justify-between gap-2">
                <span className="flex items-center gap-1.5 font-semibold text-secondary"><span className="flex size-5 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white" style={{ background: SOS_FILL[sosCall(r)] }}>{i + 1}</span>{r.short}</span>
                <span className="font-bold text-primary tabular-nums">{shareOfSearch(r)}% vs {r.share}%</span>
              </li>
            );
          })}
        </ol>
      )}
      {aside.length > 0 && (
        <div className="flex flex-col gap-1 rounded-lg border-2 border-dashed border-secondary p-2">
          <span className="text-xs font-bold text-tertiary">Set aside</span>
          {aside.map(k => <span key={k} className="text-sm font-semibold text-secondary">{SUKOON_READINGS[k].short}</span>)}
        </div>
      )}
    </div>
  );

  if (!card) {
    const n = Object.values(results).filter(Boolean).length;
    return (
      <div className="relative flex flex-col gap-5 py-6">
        <Burst count={36} />
        <StageTitle eyebrow="Search read" title={`${n} of ${game.cards.length} right first time`}>
          Sukoon is searched for more than its share where the campaign ran, and less in Hyderabad, where it didn’t. Shaant leads today, and fewer people are looking for it.
        </StageTitle>
        {chart}
        <NibSays mood={n === game.cards.length ? 'cheer' : 'idle'}>Clean the count, then compare. Share of search usually moves before share of market does.</NibSays>
        <Button size="xl" onPress={() => onDone(game.cards.map(c => ({ id: c.id, correct: !!results[c.id] })))}>Continue the story</Button>
      </div>
    );
  }

  const k = card.visual as SukoonReading;
  const r = SUKOON_READINGS[k];
  const lane = sosCall(r);
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
        <span className="text-sm font-semibold text-tertiary">Brand dashboard · search</span>
        <span className="text-sm font-semibold text-tertiary tabular-nums">{done} / {game.cards.length}</span>
      </div>
      <motion.div key={`${card.id}-${deck.length}`} initial={{ y: 24, opacity: 0 }}
        animate={miss ? { x: [0, -10, 10, -6, 6, 0], y: 0, opacity: 1 } : { y: 0, opacity: 1 }}
        transition={miss ? { duration: 0.4 } : springs.pop}
        className={cx('flex flex-col gap-3 rounded-2xl bg-primary p-4 shadow-lg ring-2 ring-inset sm:p-5', miss ? 'ring-error' : right ? 'ring-mint-600' : 'ring-secondary')} data-current-card>
        <p className="text-lg font-semibold text-primary">{card.label}</p>
        <dl className="grid grid-cols-1 gap-1.5 text-sm sm:grid-cols-3">
          <div className="flex items-center justify-between gap-3 rounded-lg bg-secondary px-3 py-2 sm:flex-col sm:items-start sm:gap-0.5">
            <dt className="text-xs font-bold text-tertiary">{r.brand} searches</dt>
            <dd className="font-bold text-primary tabular-nums">{r.searches}k</dd>
          </div>
          <div className="flex items-center justify-between gap-3 rounded-lg bg-secondary px-3 py-2 sm:flex-col sm:items-start sm:gap-0.5">
            <dt className="text-xs font-bold text-tertiary">All brand searches</dt>
            <dd className="font-bold text-primary tabular-nums">{r.category}k</dd>
          </div>
          <div className="flex items-center justify-between gap-3 rounded-lg bg-secondary px-3 py-2 sm:flex-col sm:items-start sm:gap-0.5">
            <dt className="text-xs font-bold text-tertiary">Share of market</dt>
            <dd className="font-bold text-primary tabular-nums">{r.share}%</dd>
          </div>
        </dl>
        <div className="h-3 overflow-hidden rounded-full bg-secondary" aria-hidden>
          <div className="h-full rounded-full bg-fg-quaternary" style={{ width: `${Math.min(100, (r.searches / r.category) * 100)}%` }} />
        </div>
        {right && (
          <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={springs.pop}
            className="rounded-lg px-3 py-2 text-sm font-semibold text-primary" style={{ boxShadow: `inset 3px 0 0 ${SOS_FILL[lane]}` }}>
            {r.clean ? `Share of search ${shareOfSearch(r)}%, ${signed(sosGap(r))} points against share of market.` : `${r.distortion}.`}
          </motion.p>
        )}
      </motion.div>
      <div className="grid grid-cols-2 gap-2" role="group" aria-label="What this month says about the brand">
        {game.lanes.map(l => (
          <motion.button key={l.id} type="button" onClick={() => call(l.id)} disabled={!!miss || right} whileTap={{ scale: 0.97 }}
            className={cx('flex flex-col items-start gap-0.5 rounded-xl border-2 bg-primary px-3 py-2.5 text-left transition enabled:hover:bg-primary_hover disabled:cursor-default',
              right && l.id === lane ? 'border-mint-600' : miss?.lane === l.id ? 'border-error' : miss && l.id === lane ? 'border-mint-600' : 'border-secondary')}>
            <span className="flex items-center gap-1.5 text-md font-bold text-primary"><span className="size-2.5 shrink-0 rounded-full" style={{ background: SOS_FILL[l.id as SosCall] }} aria-hidden />{l.label}</span>
            <span className="text-xs font-medium text-tertiary">{l.hint}</span>
          </motion.button>
        ))}
      </div>
      <div className="min-h-14" aria-live="polite">
        {miss && <NibSays mood="sad">{miss.why} {card.note} It’ll come back round.</NibSays>}
        {right && (
          <div className="flex flex-col gap-3">
            <NibSays mood="cheer">{card.note}</NibSays>
            <div className="flex justify-end"><Button size="lg" onPress={next}>{deck.length > 1 ? 'Next month' : 'See the chart'}</Button></div>
          </div>
        )}
        {!miss && !right && <NibSays mood="think">Is the count people looking for the brand? Then: searches ÷ all brand searches, against share of market.</NibSays>}
      </div>
      {chart}
    </div>
  );
}
