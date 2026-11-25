'use client';
// Mini-game for ld.4-3: shape the org. Every card is a problem Saathi hit growing from 9 designers to 38 (its `visual`,
// a key of `SAATHI_PROBLEMS`). Solve it in the squad, in the hub, with DesignOps or in a guild (`ORG_FIXES`, scored by
// `orgFix`). Right calls put the fix's owner into the org chart `orgShape` builds. First call scores; a missed card
// comes back later.
import { useState } from 'react';
import { motion } from 'motion/react';
import { ORG_FIXES, SAATHI_PROBLEMS, orgFix, orgShape, type Episode, type OrgFix, type SaathiProblem } from '@shape/content';
import { springs } from '@shape/ui';
import { Button } from '@/components/base/buttons/button';
import { cx } from '@/utils/cx';
import { Burst, NibSays, StageTitle } from '../kit';
import { ORG_FILL, ORG_LABEL } from '../scenes/HubSpoke';
import type { GameResult } from './DiamondSort';
import { play } from '@/lib/sound';

type Game = Episode['game'];

const WHY: Record<OrgFix, string> = {
  embed: 'Fixing it needs the squad’s daily context: its plans, its users, its engineers. Only a designer in the squad has that.',
  hub: 'No squad context needed, and it is a shared asset someone has to build and keep up for everyone. That is the hub.',
  ops: 'Nothing to build and no squad context: it is coordination or admin eating designers’ time. DesignOps runs it.',
  guild: 'Nothing to build or schedule: it is craft drifting between people in different squads. A guild connects them.',
};
const ROLE: Record<OrgFix, string> = {
  embed: 'Designers in squads, reporting to design', hub: 'Shared work, owned once', ops: 'Coordination and admin', guild: 'Craft across squads',
};

/** The org so far: each part, with the owners and fixes placed in it. */
function Org({ placed }: { placed: SaathiProblem[] }) {
  const shape = orgShape(placed);
  return (
    <div className="grid grid-cols-2 gap-2" aria-label="Saathi’s design org so far">
      {ORG_FIXES.map(f => (
        <div key={f} className="flex flex-col gap-1.5 rounded-xl border-2 border-secondary bg-primary p-3" style={{ boxShadow: `inset 0 4px 0 ${ORG_FILL[f]}` }}>
          <span className="text-sm font-bold text-primary">{ORG_LABEL[f]}</span>
          <span className="text-xs font-medium text-tertiary">{ROLE[f]}</span>
          <div className="flex flex-wrap gap-1">
            {shape[f].owners.map(o => (
              <motion.span key={o} layout initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={springs.pop}
                className="rounded-md px-2 py-0.5 text-xs font-semibold text-white" style={{ background: ORG_FILL[f] }}>{o}</motion.span>
            ))}
          </div>
          {shape[f].problems.length > 0 && <span className="text-xs font-medium tabular-nums text-tertiary">{shape[f].problems.length} fixed</span>}
        </div>
      ))}
    </div>
  );
}

export function OrgShape({ game, onDone }: { game: Game; onDone: (results: GameResult[]) => void }) {
  const [deck, setDeck] = useState(game.cards);
  const [results, setResults] = useState<Record<string, boolean>>({});
  const [placed, setPlaced] = useState<SaathiProblem[]>([]);
  const [miss, setMiss] = useState<{ lane: string; why: string } | null>(null);
  const [right, setRight] = useState(false);
  const card = deck[0];

  if (!card) {
    const n = Object.values(results).filter(Boolean).length;
    return (
      <div className="relative flex flex-col gap-5 py-6">
        <Burst count={36} />
        <StageTitle eyebrow="Org shaped" title={`${n} of ${game.cards.length} right first time`}>
          Designers in every squad for context, a hub for the system, content and accessibility, DesignOps for the coordination, and guilds so nobody designs alone.
        </StageTitle>
        <Org placed={placed} />
        <NibSays mood={n === game.cards.length ? 'cheer' : 'idle'}>Context, shared asset, coordination, craft: ask in that order. And check the shape again every half-year.</NibSays>
        <Button size="xl" onPress={() => onDone(game.cards.map(c => ({ id: c.id, correct: !!results[c.id] })))}>Continue the story</Button>
      </div>
    );
  }

  const k = card.visual as SaathiProblem;
  const pr = SAATHI_PROBLEMS[k];
  const lane = orgFix(pr);
  const done = game.cards.length - deck.length;
  const call = (laneId: string) => {
    if (miss || right) return;
    const ok = laneId === lane;
    play(ok ? 'correct' : 'wrong');
    setResults(rs => (card.id in rs ? rs : { ...rs, [card.id]: ok }));
    if (ok) { setRight(true); setPlaced(ps => [...ps, k]); }
    else {
      setMiss({ lane: laneId, why: WHY[lane] });
      setTimeout(() => { setMiss(null); setDeck(dk => [...dk.slice(1), dk[0]]); }, 4200);
    }
  };
  const next = () => { setRight(false); setDeck(dk => dk.slice(1)); };

  return (
    <div className="flex flex-col gap-5">
      <StageTitle eyebrow="Play" title={game.title}>{game.instructions}</StageTitle>
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-sm font-semibold text-tertiary">Saathi design · 9 designers to 38</span>
        <span className="text-sm font-semibold text-tertiary tabular-nums">{done} / {game.cards.length}</span>
      </div>
      <motion.div key={`${card.id}-${deck.length}`} initial={{ y: 24, opacity: 0 }}
        animate={miss ? { x: [0, -10, 10, -6, 6, 0], y: 0, opacity: 1 } : { y: 0, opacity: 1 }}
        transition={miss ? { duration: 0.4 } : springs.pop}
        className={cx('flex flex-col gap-3 rounded-2xl bg-primary p-4 shadow-lg ring-2 ring-inset sm:p-5', miss ? 'ring-error' : right ? 'ring-mint-600' : 'ring-secondary')} data-current-card>
        <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
          <span className="text-md font-bold text-primary">{pr.short}</span>
          <span className="text-sm font-semibold text-tertiary">{pr.squads === 1 ? 'One squad' : pr.squads === 11 ? 'Every squad' : `${pr.squads} squads`}</span>
        </div>
        <p className="text-lg font-semibold text-primary">{card.label}</p>
        <div className="flex gap-1" aria-label={`Touches ${pr.squads} of 11 squads`}>
          {Array.from({ length: 11 }, (_, i) => (
            <span key={i} className={cx('h-2 flex-1 rounded-full', i < pr.squads ? '' : 'bg-secondary')} style={i < pr.squads ? { background: right ? ORG_FILL[lane] : 'var(--color-text-tertiary)' } : undefined} aria-hidden />
          ))}
        </div>
        {right && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={springs.pop}
            className="flex flex-col gap-1 rounded-lg bg-secondary px-3 py-2" style={{ boxShadow: `inset 3px 0 0 ${ORG_FILL[lane]}` }}>
            <span className="text-xs font-bold uppercase tracking-wide text-tertiary">{pr.owner}</span>
            <span className="text-sm font-semibold text-primary">{pr.fixed}</span>
          </motion.div>
        )}
      </motion.div>
      <div className="grid grid-cols-2 gap-2" role="group" aria-label="Where this gets solved">
        {game.lanes.map(l => (
          <motion.button key={l.id} type="button" onClick={() => call(l.id)} disabled={!!miss || right} whileTap={{ scale: 0.97 }}
            className={cx('flex flex-col items-start gap-0.5 rounded-xl border-2 bg-primary px-3 py-2.5 text-left transition enabled:hover:bg-primary_hover disabled:cursor-default',
              right && l.id === lane ? 'border-mint-600' : miss?.lane === l.id ? 'border-error' : miss && l.id === lane ? 'border-mint-600' : 'border-secondary')}>
            <span className="flex items-center gap-1.5 text-md font-bold text-primary"><span className="size-2.5 shrink-0 rounded-full" style={{ background: ORG_FILL[l.id as OrgFix] }} aria-hidden />{l.label}</span>
            <span className="text-xs font-medium text-tertiary">{l.hint}</span>
          </motion.button>
        ))}
      </div>
      <div className="min-h-14" aria-live="polite">
        {miss && <NibSays mood="sad">{miss.why} {card.note} It’ll come back round.</NibSays>}
        {right && (
          <div className="flex flex-col gap-3">
            <NibSays mood="cheer">{card.note}</NibSays>
            <div className="flex justify-end"><Button size="lg" onPress={next}>{deck.length > 1 ? 'Next problem' : 'See the org'}</Button></div>
          </div>
        )}
        {!miss && !right && <NibSays mood="think">Does it need the squad’s context? A shared asset? Coordination? Or is it craft drifting apart?</NibSays>}
      </div>
      <Org placed={placed} />
    </div>
  );
}
