'use client';
// Mini-game for fd.1-4: decision tickets arrive one at a time, each with a timer. Send it to the role who usually owns it.
// A wrong desk or a timeout counts as a miss, shows who owns it and why, and the ticket comes back later.
// Timing uses an interval clock, never animation callbacks, so it can't stall.
import { useEffect, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { CodeIcon, PenNibIcon, TargetIcon, TimerIcon, UserIcon } from '@phosphor-icons/react/ssr';
import type { Episode } from '@shape/content';
import { springs } from '@shape/ui';
import { Button } from '@/components/base/buttons/button';
import type { PhosphorIcon } from '@/lib/skills';
import { cx } from '@/utils/cx';
import { Burst, FAMILY, NibSays, StageTitle } from '../kit';
import type { GameResult } from './DiamondSort';
import { play } from '@/lib/sound';

type Game = Episode['game'];
const SECONDS = 9;
/** Icons for the usual roles; anything else gets a generic person. */
const ROLE_ICON: Record<string, PhosphorIcon> = { pm: TargetIcon, des: PenNibIcon, eng: CodeIcon };
const ROLE_COLOR = [FAMILY[0], FAMILY[1], FAMILY[3], FAMILY[2]];

export function RoleRoute({ game, onDone }: { game: Game; onDone: (results: GameResult[]) => void }) {
  const initial = useMemo(() => [...game.cards].map((c, i) => ({ c, k: (i * 5) % game.cards.length })).sort((a, b) => a.k - b.k).map(x => x.c), [game.cards]);
  const [deck, setDeck] = useState(initial);
  const [results, setResults] = useState<Record<string, boolean>>({});
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [feedback, setFeedback] = useState<{ chose: string | null; owner: string; ok: boolean } | null>(null);
  const [ticketAt, setTicketAt] = useState(() => performance.now());
  const [now, setNow] = useState(() => performance.now());
  const [turn, setTurn] = useState(0);
  const card = deck[0];
  const left = Math.max(0, SECONDS - (now - ticketAt) / 1000);

  const resolve = (chose: string | null) => {
    if (!card || feedback) return;
    const ok = chose === card.lane;
    play(ok ? 'correct' : 'wrong');
    setResults(r => (card.id in r ? r : { ...r, [card.id]: ok }));
    setFeedback({ chose, owner: card.lane, ok });
    if (ok) setCounts(c => ({ ...c, [card.lane]: (c[card.lane] ?? 0) + 1 }));
    setTimeout(() => {
      setDeck(d => (ok ? d.slice(1) : [...d.slice(1), d[0]]));
      setFeedback(null); setTurn(n => n + 1); setTicketAt(performance.now());
    }, ok ? 650 : 2200);
  };

  // Clock for the ticket timer; running out counts as a miss.
  useEffect(() => {
    if (!card || feedback) return;
    const id = setInterval(() => {
      const n = performance.now();
      setNow(n);
      if (n - ticketAt >= SECONDS * 1000) { clearInterval(id); resolve(null); }
    }, 100);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [turn, feedback, ticketAt]);

  const total = game.cards.length;
  const firstTry = Object.values(results).filter(Boolean).length;
  const lane = (id: string) => game.lanes.find(l => l.id === id)!;

  if (!card) {
    return (
      <div className="relative flex flex-col items-center gap-5 py-6 text-center">
        <Burst count={40} />
        <StageTitle eyebrow="Game over" title="Every decision has an owner">{firstTry} of {total} routed right the first time.</StageTitle>
        <NibSays mood={firstTry === total ? 'cheer' : 'idle'}>{firstTry === total ? 'You’d run a tidy team.' : 'Owners can still ask for help. Knowing who decides just keeps things moving.'}</NibSays>
        <Button size="xl" onPress={() => onDone(game.cards.map(c => ({ id: c.id, correct: !!results[c.id] })))}>Continue the story</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <StageTitle eyebrow="Play" title={game.title}>{game.instructions}</StageTitle>
      <p className="text-right text-sm font-semibold text-tertiary tabular-nums">{total - deck.length} / {total}</p>

      {/* the ticket */}
      <motion.div key={turn} initial={{ y: -30, opacity: 0, rotate: -3 }} animate={feedback ? (feedback.ok ? { y: 140, opacity: 0, scale: 0.5 } : { x: [0, -12, 12, -8, 8, 0] }) : { y: 0, opacity: 1, rotate: 0 }}
        transition={feedback ? { duration: 0.45 } : springs.pop}
        className={cx('relative mx-auto w-full max-w-md overflow-hidden rounded-2xl bg-primary px-5 pt-4 pb-5 shadow-xl ring-2 ring-inset', feedback && !feedback.ok ? 'ring-error' : 'ring-secondary')}>
        <p className="flex items-center justify-between text-xs font-semibold tracking-wide text-quaternary uppercase">
          <span>Decision ticket</span>
          <span className={cx('inline-flex items-center gap-1 tabular-nums', left < 3 ? 'text-error-primary' : '')}><TimerIcon className="size-3.5" weight="bold" />{Math.ceil(left)}s</span>
        </p>
        <p className="mt-1.5 text-xl font-semibold text-primary" data-current-card>{card.label}</p>
        <span className="absolute inset-x-0 bottom-0 h-1.5 bg-secondary">
          <span className={cx('block h-full', left < 3 ? 'bg-error-solid' : 'bg-mint-600')} style={{ width: `${(left / SECONDS) * 100}%` }} />
        </span>
      </motion.div>

      {/* the desks */}
      <div className="grid gap-3" style={{ gridTemplateColumns: `repeat(${game.lanes.length}, minmax(0, 1fr))` }}>
        {game.lanes.map((l, i) => {
          const Icon = ROLE_ICON[l.id] ?? UserIcon;
          const isOwner = feedback?.owner === l.id, chose = feedback?.chose === l.id;
          return (
            <motion.button key={l.id} type="button" onClick={() => resolve(l.id)} disabled={!!feedback}
              animate={isOwner && feedback?.ok ? { y: [0, -14, 0] } : chose && !feedback?.ok ? { x: [0, -8, 8, 0] } : {}} transition={{ duration: 0.4 }}
              whileTap={{ scale: 0.96 }}
              className={cx('flex flex-col items-center gap-2 rounded-2xl bg-primary px-2 py-4 ring-2 transition-colors ring-inset disabled:cursor-default',
                isOwner ? 'ring-mint-600' : chose ? 'ring-error' : 'ring-secondary hover:bg-primary_hover')}>
              <span className="relative grid size-16 place-items-center rounded-full text-white" style={{ background: ROLE_COLOR[i % 4] }}>
                <Icon className="size-8" weight="bold" />
                {(counts[l.id] ?? 0) > 0 && (
                  <motion.span key={counts[l.id]} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={springs.pop}
                    className="absolute -top-1 -right-1 grid size-6 place-items-center rounded-full bg-mint-600 text-xs font-bold text-white ring-2 ring-primary">{counts[l.id]}</motion.span>
                )}
              </span>
              <span className="text-center text-sm font-bold text-primary">{l.label}</span>
            </motion.button>
          );
        })}
      </div>

      <div className="min-h-16">
        {feedback && !feedback.ok && (
          <NibSays mood="sad">{feedback.chose ? 'Not quite. ' : 'Time’s up! '}<strong>{lane(feedback.owner).label}</strong> owns this one: {lane(feedback.owner).hint.toLowerCase()}.</NibSays>
        )}
        {feedback?.ok && <NibSays mood="cheer">Right desk.</NibSays>}
      </div>
    </div>
  );
}
