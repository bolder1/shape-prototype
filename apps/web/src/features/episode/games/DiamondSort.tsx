'use client';
// Mini-game for fd.1-2: send each activity card to its phase of the Double Diamond.
// Drag the card onto a phase, or tap a phase. Right answers inflate that quarter of the diamond and build a combo;
// mistakes cost a drop of ink (3 in the pen) and the card comes back later, so every card is eventually placed right.
import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { DropIcon, FireIcon } from '@phosphor-icons/react/ssr';
import type { Episode } from '@shape/content';
import { springs } from '@shape/ui';
import { Button } from '@/components/base/buttons/button';
import { cx } from '@/utils/cx';
import { Burst, FAMILY, NibSays, StageTitle } from '../kit';

type Game = Episode['game'];
export interface GameResult { id: string; correct: boolean }

// Four triangles: the halves of two diamonds, in lane order (viewBox 0 0 400 200).
const SHAPES = ['10,100 100,10 100,190', '100,10 190,100 100,190', '210,100 300,10 300,190', '300,10 390,100 300,190'];
const CENTROID = [[70, 100], [130, 100], [270, 100], [330, 100]];
const INK = 3;

export function DiamondSort({ game, onDone }: { game: Game; onDone: (results: GameResult[]) => void }) {
  // Deterministic shuffle so the deck is the same on every visit (reviewable), but not in lane order.
  const initial = useMemo(() => [...game.cards].sort((a, b) => ((a.id.charCodeAt(1) * 7) % 5) - ((b.id.charCodeAt(1) * 7) % 5) || a.id.localeCompare(b.id)), [game.cards]);
  const [deck, setDeck] = useState(initial);
  const [placed, setPlaced] = useState<Record<string, number>>({});   // lane → cards placed
  const [results, setResults] = useState<Record<string, boolean>>({});
  const [ink, setInk] = useState(INK);
  const [combo, setCombo] = useState(0);
  const [flash, setFlash] = useState<{ lane: string; ok: boolean } | null>(null);
  const [bursts, setBursts] = useState(0);
  const [turn, setTurn] = useState(0);   // advances when the next card comes up
  const card = deck[0];
  const total = game.cards.length;
  const done = !card;

  // Timing comes from timers, never from awaiting an animation: a throttled tab or reduced motion must not freeze the game.
  const send = (laneId: string) => {
    if (!card || flash) return;
    const ok = card.lane === laneId;
    setResults(r => (card.id in r ? r : { ...r, [card.id]: ok }));
    if (ok) {
      setFlash({ lane: laneId, ok: true });
      setCombo(c => c + 1);
      if ((combo + 1) % 3 === 0) setBursts(b => b + 1);
      setPlaced(p => ({ ...p, [laneId]: (p[laneId] ?? 0) + 1 }));
      setTimeout(() => { setDeck(d => d.slice(1)); setFlash(null); setTurn(n => n + 1); }, 420);
    } else {
      setFlash({ lane: card.lane, ok: false });   // light up where it should have gone
      setCombo(0);
      setInk(i => Math.max(0, i - 1));
      setTimeout(() => { setDeck(d => [...d.slice(1), d[0]]); setFlash(null); setTurn(n => n + 1); }, 1100);   // try again later
    }
  };

  /** Drop target under the pointer when a drag ends. */
  const laneAt = (x: number, y: number) =>
    document.elementsFromPoint(x - window.scrollX, y - window.scrollY).map(el => (el as HTMLElement).dataset?.lane).find(Boolean);

  const lanes = game.lanes;
  const firstTry = Object.values(results).filter(Boolean).length;

  if (done) {
    return (
      <div className="relative flex flex-col items-center gap-6 py-4 text-center">
        <Burst count={40} />
        <StageTitle eyebrow="Game over" title="Both diamonds built" />
        <Diamonds lanes={lanes} placed={placed} total={total} flash={null} onLane={() => {}} big />
        <p className="text-lg text-tertiary"><span className="font-semibold text-primary">{firstTry} of {total}</span> right on the first try{ink === INK ? ', and not a drop of ink spilled.' : '.'}</p>
        <Button size="xl" onPress={() => onDone(game.cards.map(c => ({ id: c.id, correct: !!results[c.id] })))}>Continue the story</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <StageTitle eyebrow="Play" title={game.title}>{game.instructions}</StageTitle>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1" aria-label={`${ink} of ${INK} ink drops left`}>
          {Array.from({ length: INK }, (_, i) => (
            <motion.span key={i} animate={{ scale: i < ink ? 1 : 0.7, opacity: i < ink ? 1 : 0.25 }} transition={springs.pop}>
              <DropIcon className="size-6 text-mint-600" weight="fill" />
            </motion.span>
          ))}
        </div>
        <AnimatePresence>
          {combo >= 2 && (
            <motion.span key={combo} initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ opacity: 0 }} transition={springs.pop}
              className="inline-flex items-center gap-1 rounded-full bg-secondary px-3 py-1 text-sm font-bold text-primary">
              <FireIcon className="size-4 text-fg-warning-primary" weight="fill" />{combo} in a row
            </motion.span>
          )}
        </AnimatePresence>
        <span className="text-sm font-semibold text-tertiary tabular-nums">{total - deck.length} / {total}</span>
      </div>

      {/* the card in play */}
      <div className="relative grid h-32 place-items-center">
        {bursts > 0 && <Burst key={bursts} seed={bursts} count={18} />}
        <PlayCard key={turn} label={card.label} cue={flash ? (flash.ok ? 'ok' : 'wrong') : 'idle'}
          onDrop={(x, y) => { const lane = laneAt(x, y); if (lane) send(lane); }} />
      </div>

      <Diamonds lanes={lanes} placed={placed} total={total} flash={flash} onLane={send} />
      <p className="text-center text-sm text-tertiary">Drag the card onto a phase, or tap the phase.</p>

      {flash && !flash.ok && (
        <NibSays mood="sad">Not that one. It goes in <strong>{lanes.find(l => l.id === flash.lane)!.label}</strong>: {lanes.find(l => l.id === flash.lane)!.hint.toLowerCase()}. It’ll come back round.</NibSays>
      )}
    </div>
  );
}

/** The card in play. Each card owns its animation: it drops in, shakes on a miss, and flies into the diamond on a hit. */
function PlayCard({ label, cue, onDrop }: { label: string; cue: 'idle' | 'ok' | 'wrong'; onDrop: (x: number, y: number) => void }) {
  const target = cue === 'ok' ? { y: 150, scale: 0.3, opacity: 0, rotate: 0, x: 0 }
    : cue === 'wrong' ? { x: [0, -14, 14, -8, 8, 0], y: 0, opacity: 1, scale: 1, rotate: 0 }
    : { y: 0, opacity: 1, rotate: 0, scale: 1, x: 0 };
  return (
    <motion.div drag={cue === 'idle'} dragSnapToOrigin whileDrag={{ scale: 1.06, rotate: -2, cursor: 'grabbing' }}
      onDragEnd={(_, info) => onDrop(info.point.x, info.point.y)}
      initial={{ y: -40, opacity: 0, rotate: -6 }} animate={target} transition={cue === 'idle' ? springs.pop : { duration: 0.38 }}
      className={cx('relative z-10 w-72 cursor-grab touch-none rounded-2xl bg-primary px-5 py-4 text-center shadow-xl ring-2 select-none ring-inset',
        cue === 'wrong' ? 'ring-error' : 'ring-secondary')}>
      <p className="text-xs font-semibold tracking-wide text-quaternary uppercase">Activity</p>
      <p className="mt-1 text-lg font-semibold text-primary" data-current-card>{label}</p>
    </motion.div>
  );
}

/** The two diamonds as four tappable triangles. Each fills up as cards land in it. */
function Diamonds({ lanes, placed, total, flash, onLane, big }: {
  lanes: Game['lanes']; placed: Record<string, number>; total: number; flash: { lane: string; ok: boolean } | null; onLane: (id: string) => void; big?: boolean;
}) {
  const per = total / lanes.length;
  return (
    <svg viewBox="0 0 400 230" className={cx('mx-auto w-full', big ? 'max-w-md' : 'max-w-xl')} role="group" aria-label="Double Diamond phases">
      {lanes.map((l, i) => {
        const fill = Math.min(1, (placed[l.id] ?? 0) / per);
        const lit = flash?.lane === l.id;
        return (
          <g key={l.id} role="button" tabIndex={0} aria-label={`${l.label}: ${l.hint}`} className="cursor-pointer outline-none"
            onClick={() => onLane(l.id)} onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onLane(l.id); } }}>
            <motion.polygon data-lane={l.id} points={SHAPES[i]} fill={FAMILY[i]} stroke={FAMILY[i]} strokeWidth={3} strokeLinejoin="round"
              animate={{ fillOpacity: lit ? 0.85 : 0.12 + fill * 0.6, scale: lit && flash?.ok ? 1.06 : 1 }} transition={springs.pop}
              style={{ transformOrigin: `${CENTROID[i][0]}px ${CENTROID[i][1]}px` }} />
            <text x={CENTROID[i][0]} y={CENTROID[i][1] + 5} textAnchor="middle" fontSize={13} fontWeight={700} fill="var(--color-text-primary)" pointerEvents="none">{l.label}</text>
            <text x={CENTROID[i][0]} y={222} textAnchor="middle" fontSize={11} fill="var(--color-text-tertiary)" pointerEvents="none">{placed[l.id] ?? 0}/{Math.round(per)}</text>
          </g>
        );
      })}
      <text x={100} y={208} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--color-text-quaternary)" letterSpacing={1}>PROBLEM</text>
      <text x={300} y={208} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--color-text-quaternary)" letterSpacing={1}>SOLUTION</text>
    </svg>
  );
}
