'use client';
// Mini-game for ds.5-3: send each drift the nightly check found the right way. Every card is a difference between
// Sawari's Figma library and its code (its `visual`, a key of `SAWARI_DRIFTS`). Build it in code, bring Figma up to
// date, or revert it where it was made (`SYNC_MOVES`, scored by `syncMove`). Right calls animate the change along the
// flow to the side it acts on (`driftSide`) and count the drift down from `DRIFTS_FOUND` to `DRIFTS_LEFT`; the end
// screen releases both sides as `SYNCED_VERSION`. First call scores; a missed card comes back later.
import { useState } from 'react';
import { motion } from 'motion/react';
import {
  DRIFTS_FOUND, DRIFTS_LEFT, SAWARI_DRIFTS, SYNCED_VERSION, SYNC_SOURCES, driftSide, syncMove,
  type Episode, type SawariDrift, type SyncMove,
} from '@shape/content';
import { springs } from '@shape/ui';
import { Button } from '@/components/base/buttons/button';
import { cx } from '@/utils/cx';
import { Burst, NibSays, StageTitle } from '../kit';
import { MOVE_FILL } from '../scenes/SyncLoop';
import type { GameResult } from './DiamondSort';
import { play } from '@/lib/sound';

type Game = Episode['game'];
const LABEL: Record<SyncMove, string> = { 'to-code': 'To code', 'to-figma': 'To Figma', revert: 'Revert' };
const SOURCE_LABEL: Record<keyof typeof SYNC_SOURCES, string> = { tokens: 'Token value', api: 'Component API', design: 'New design' };

/** Change text with `code` spans set in mono. */
function Ticks({ s }: { s: string }) {
  return <>{s.split('`').map((part, i) => (i % 2 ? <code key={i} className="rounded bg-secondary px-1 font-mono text-[0.92em] text-primary">{part}</code> : part))}</>;
}

/** Figma and code side by side, with the move drawn between them. */
function FlowStrip({ drift, shown }: { drift: SawariDrift | null; shown: boolean }) {
  const d = drift ? SAWARI_DRIFTS[drift] : null;
  const move = d ? syncMove(d) : null;
  const side = d ? driftSide(d) : null;
  const node = (id: 'figma' | 'code', label: string) => {
    const has = d ? d[id] : false;
    const hit = shown && side === id;
    return (
      <motion.div animate={hit ? { scale: [1, 1.06, 1] } : { scale: 1 }} transition={{ duration: 0.5 }}
        className={cx('flex min-w-0 flex-1 flex-col items-center gap-1 rounded-xl bg-primary px-2 py-3 ring-2 ring-inset', hit ? '' : 'ring-secondary')}
        style={hit && move ? { boxShadow: `inset 0 0 0 3px ${MOVE_FILL[move]}` } : undefined}>
        <span className="text-md font-bold text-primary">{label}</span>
        <span className="text-xs font-semibold text-tertiary">
          {!d ? '—' : shown ? (move === 'revert' && hit ? 'Change undone' : hit ? 'Caught up' : has ? 'Has it' : 'Doesn’t have it') : has ? 'Has the change' : 'Doesn’t have it'}
        </span>
      </motion.div>
    );
  };
  const dir = move === 'to-code' ? 1 : move === 'to-figma' ? -1 : 0;
  return (
    <div className="flex items-stretch gap-2">
      {node('figma', 'Figma library')}
      <div className="relative flex w-16 shrink-0 items-center justify-center sm:w-24" aria-hidden>
        <div className="h-0.5 w-full bg-secondary" />
        {shown && move && dir !== 0 && (
          <motion.span key={drift} initial={{ x: dir * -28, opacity: 0 }} animate={{ x: dir * 28, opacity: [0, 1, 1, 0] }} transition={{ duration: 1.1 }}
            className="absolute size-3.5 rounded-full" style={{ background: MOVE_FILL[move] }} />
        )}
        {shown && move === 'revert' && (
          <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={springs.pop} className="absolute rounded-full px-2 py-0.5 text-xs font-bold text-white" style={{ background: MOVE_FILL.revert }}>undo</motion.span>
        )}
      </div>
      {node('code', 'Code')}
    </div>
  );
}

export function SyncFlow({ game, onDone }: { game: Game; onDone: (results: GameResult[]) => void }) {
  const [deck, setDeck] = useState(game.cards);
  const [results, setResults] = useState<Record<string, boolean>>({});
  const [placed, setPlaced] = useState<SawariDrift[]>([]);
  const [miss, setMiss] = useState<SyncMove | null>(null);
  const [right, setRight] = useState(false);
  const card = deck[0];
  const drift = Math.round(DRIFTS_FOUND - (DRIFTS_FOUND - DRIFTS_LEFT) * (placed.length / game.cards.length));
  const counts = (['to-code', 'to-figma', 'revert'] as const).map(m => [m, placed.filter(k => syncMove(SAWARI_DRIFTS[k]) === m).length] as const);

  const meter = (
    <div className="flex flex-col gap-2 rounded-2xl bg-secondary p-3">
      <div className="flex items-baseline justify-between">
        <span className="text-sm font-bold text-primary">Open drift</span>
        <motion.span key={drift} initial={{ scale: 0.85 }} animate={{ scale: 1 }} transition={springs.pop} className="font-mono text-lg font-bold text-primary tabular-nums">{drift}</motion.span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-primary">
        <motion.div className="h-full rounded-full bg-brand-solid" animate={{ width: `${(drift / DRIFTS_FOUND) * 100}%` }} transition={springs.pop} />
      </div>
      <div className="flex flex-wrap gap-1.5">
        {counts.map(([m, n]) => <span key={m} className="rounded-full px-2.5 py-0.5 text-xs font-bold text-white" style={{ background: MOVE_FILL[m] }}>{LABEL[m]} · {n}</span>)}
      </div>
    </div>
  );

  if (!card) {
    const n = Object.values(results).filter(Boolean).length;
    return (
      <div className="relative flex flex-col gap-5 py-6">
        <Burst count={36} />
        <StageTitle eyebrow={`Released as ${SYNCED_VERSION}`} title={`${n} of ${game.cards.length} right first time`}>
          Drift is down from {DRIFTS_FOUND} to {DRIFTS_LEFT}, and {SYNCED_VERSION} ships to the Figma library, npm, Maven and the Swift package on the same day.
        </StageTitle>
        {meter}
        <NibSays mood={n === game.cards.length ? 'cheer' : 'idle'}>Every kind of thing has a source. If the source has a change, the side that’s behind catches up. If it doesn’t, the change is undone where it was made.</NibSays>
        <Button size="xl" onPress={() => onDone(game.cards.map(c => ({ id: c.id, correct: !!results[c.id] })))}>Continue the story</Button>
      </div>
    );
  }

  const k = card.visual as SawariDrift;
  const d = SAWARI_DRIFTS[k];
  const lane = syncMove(d);
  const done = game.cards.length - deck.length;
  const call = (laneId: string) => {
    if (miss || right) return;
    const ok = laneId === lane;
    play(ok ? 'correct' : 'wrong');
    setResults(rs => (card.id in rs ? rs : { ...rs, [card.id]: ok }));
    if (ok) { setRight(true); setPlaced(ps => [...ps, k]); }
    else { setMiss(laneId as SyncMove); setTimeout(() => { setMiss(null); setDeck(dk => [...dk.slice(1), dk[0]]); }, 3600); }
  };
  const next = () => { setRight(false); setDeck(dk => dk.slice(1)); };

  return (
    <div className="flex flex-col gap-5">
      <StageTitle eyebrow="Play" title={game.title}>{game.instructions}</StageTitle>
      <div className="flex items-baseline justify-between">
        <span className="text-sm font-semibold text-tertiary">Nightly check · Sawari</span>
        <span className="text-sm font-semibold text-tertiary tabular-nums">{done} / {game.cards.length}</span>
      </div>
      <motion.div key={`${card.id}-${deck.length}`} initial={{ y: 24, opacity: 0 }}
        animate={miss ? { x: [0, -10, 10, -6, 6, 0], y: 0, opacity: 1 } : { y: 0, opacity: 1 }}
        transition={miss ? { duration: 0.4 } : springs.pop}
        className={cx('flex flex-col gap-3 rounded-2xl bg-primary p-4 shadow-lg ring-2 ring-inset sm:p-5', miss ? 'ring-error' : right ? 'ring-mint-600' : 'ring-secondary')} data-current-card>
        <span className="text-xs font-bold tracking-wide text-tertiary uppercase">{SOURCE_LABEL[d.kind]} · source: {SYNC_SOURCES[d.kind]}</span>
        <p className="text-lg font-semibold text-primary"><Ticks s={card.label} /></p>
        <FlowStrip drift={k} shown={right} />
      </motion.div>
      <div className="grid grid-cols-3 gap-2" role="group" aria-label="Which way this drift should move">
        {game.lanes.map(l => (
          <motion.button key={l.id} type="button" onClick={() => call(l.id)} disabled={!!miss || right} whileTap={{ scale: 0.97 }}
            className={cx('flex flex-col items-start gap-0.5 rounded-xl border-2 bg-primary px-3 py-2.5 text-left transition enabled:hover:bg-primary_hover disabled:cursor-default',
              right && l.id === lane ? 'border-mint-600' : miss === l.id ? 'border-error' : miss && l.id === lane ? 'border-mint-600' : 'border-secondary')}>
            <span className="flex items-center gap-1.5 text-md font-bold text-primary"><span className="size-2.5 shrink-0 rounded-sm" style={{ background: MOVE_FILL[l.id as SyncMove] }} aria-hidden />{l.label}</span>
            <span className="text-xs font-medium text-tertiary">{l.hint}</span>
          </motion.button>
        ))}
      </div>
      <div className="min-h-14" aria-live="polite">
        {miss && <NibSays mood="sad">Not “{LABEL[miss]}”: this one is <strong>{LABEL[lane]}</strong>. {card.note} It’ll come back round.</NibSays>}
        {right && (
          <div className="flex flex-col gap-3">
            <NibSays mood="cheer">{card.note}</NibSays>
            <div className="flex justify-end"><Button size="lg" onPress={next}>{deck.length > 1 ? 'Next drift' : 'Release it'}</Button></div>
          </div>
        )}
        {!miss && !right && <NibSays mood="think">Is the change in its source: a merged tokens PR, a released version, an approved RFC? If so, which side is behind?</NibSays>}
      </div>
      {meter}
    </div>
  );
}
