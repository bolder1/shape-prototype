'use client';
// Mini-game for ds.4-2: plan Rasta's release from 3.4.2 (`RASTA_VERSION`). Every card is a change waiting to ship
// (its `visual`, a key of `RASTA_CHANGES`). Call it patch, minor or major (`VERSION_BUMPS`, scored by `bumpFor`). Right
// calls write it into a changelog under its section (`CHANGELOG_SECTIONS`): safe changes in this week's release,
// breaking ones in the planned major, with both version numbers worked out live (`planReleases`). First call scores; a
// missed card comes back later.
import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  CHANGELOG_SECTIONS, RASTA_CHANGES, RASTA_VERSION, VERSION_BUMPS, bumpFor, planReleases,
  type Episode, type RastaChange, type VersionBump,
} from '@shape/content';
import { springs } from '@shape/ui';
import { Button } from '@/components/base/buttons/button';
import { cx } from '@/utils/cx';
import { Burst, NibSays, StageTitle } from '../kit';
import { BUMP_FILL } from '../scenes/DeprecationPath';
import type { GameResult } from './DiamondSort';
import { play } from '@/lib/sound';

type Game = Episode['game'];
const LABEL: Record<VersionBump, string> = { patch: 'Patch', minor: 'Minor', major: 'Major' };

/** Change text with `code` spans set in mono. */
function Ticks({ s }: { s: string }) {
  return <>{s.split('`').map((part, i) => (i % 2 ? <code key={i} className="rounded bg-secondary px-1 font-mono text-[0.92em] text-primary">{part}</code> : part))}</>;
}

/** One release's changelog. */
function Release({ version, when, items, empty }: { version: string | null; when: string; items: RastaChange[]; empty: string }) {
  const sections = VERSION_BUMPS.slice().reverse().filter(b => items.some(k => bumpFor(RASTA_CHANGES[k]) === b));
  return (
    <div className="flex flex-col gap-2 rounded-xl bg-primary p-3 ring-1 ring-secondary ring-inset">
      <div className="flex items-baseline justify-between gap-2">
        <motion.span key={version ?? 'none'} initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={springs.pop}
          className="font-mono text-md font-bold text-primary tabular-nums">{version ?? RASTA_VERSION}</motion.span>
        <span className="text-xs font-semibold text-tertiary">{when}</span>
      </div>
      {sections.length === 0 && <p className="text-sm text-tertiary">{empty}</p>}
      {sections.map(b => (
        <div key={b} className="flex flex-col gap-1">
          <span className="flex items-center gap-1.5 text-xs font-bold text-primary"><span className="size-2.5 rounded-sm" style={{ background: BUMP_FILL[b] }} aria-hidden />{CHANGELOG_SECTIONS[b]}</span>
          <ul className="flex flex-col gap-1 pl-4">
            <AnimatePresence initial={false}>
              {items.filter(k => bumpFor(RASTA_CHANGES[k]) === b).map(k => (
                <motion.li key={k} layout initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} transition={springs.pop} className="list-disc text-sm text-secondary">
                  <Ticks s={RASTA_CHANGES[k].text} />
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        </div>
      ))}
    </div>
  );
}

export function ReleasePlan({ game, onDone }: { game: Game; onDone: (results: GameResult[]) => void }) {
  const [deck, setDeck] = useState(game.cards);
  const [results, setResults] = useState<Record<string, boolean>>({});
  const [placed, setPlaced] = useState<RastaChange[]>([]);
  const [miss, setMiss] = useState<VersionBump | null>(null);
  const [right, setRight] = useState(false);
  const card = deck[0];
  const bumpOf = (k: RastaChange) => bumpFor(RASTA_CHANGES[k]);
  const plan = planReleases(RASTA_VERSION, placed.map(bumpOf));
  const now = placed.filter(k => bumpOf(k) !== 'major'), later = placed.filter(k => bumpOf(k) === 'major');

  const changelog = (
    <div className="flex flex-col gap-2 rounded-2xl bg-secondary p-3">
      <span className="text-sm font-bold text-primary">Changelog</span>
      <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
        <Release version={plan.now} when="Ships Thursday" items={now} empty="Fixes and additions land here." />
        <Release version={plan.next} when="Planned for June, with a migration guide" items={later} empty="Breaking changes wait here." />
      </div>
    </div>
  );

  if (!card) {
    const n = Object.values(results).filter(Boolean).length;
    return (
      <div className="relative flex flex-col gap-5 py-6">
        <Burst count={36} />
        <StageTitle eyebrow="Release planned" title={`${n} of ${game.cards.length} right first time`}>
          {now.length} changes ship this week as {plan.now}; {later.length} breaking ones wait for {plan.next}, announced months ahead, so squads can plan the migration instead of finding it on a Tuesday.
        </StageTitle>
        {changelog}
        <NibSays mood={n === game.cards.length ? 'cheer' : 'idle'}>Patch keeps a promise, minor adds without changing, major makes squads act. Changed defaults, required props and dropped platforms are major too, even when no name changes.</NibSays>
        <Button size="xl" onPress={() => onDone(game.cards.map(c => ({ id: c.id, correct: !!results[c.id] })))}>Continue the story</Button>
      </div>
    );
  }

  const k = card.visual as RastaChange;
  const lane = bumpOf(k);
  const done = game.cards.length - deck.length;
  const call = (laneId: string) => {
    if (miss || right) return;
    const ok = laneId === lane;
    play(ok ? 'correct' : 'wrong');
    setResults(rs => (card.id in rs ? rs : { ...rs, [card.id]: ok }));
    if (ok) { setRight(true); setPlaced(ps => [...ps, k]); }
    else { setMiss(laneId as VersionBump); setTimeout(() => { setMiss(null); setDeck(dk => [...dk.slice(1), dk[0]]); }, 3600); }
  };
  const next = () => { setRight(false); setDeck(dk => dk.slice(1)); };

  return (
    <div className="flex flex-col gap-5">
      <StageTitle eyebrow="Play" title={game.title}>{game.instructions}</StageTitle>
      <div className="flex items-baseline justify-between">
        <span className="text-sm font-semibold text-tertiary">Changes waiting · on <span className="font-mono">{RASTA_VERSION}</span></span>
        <span className="text-sm font-semibold text-tertiary tabular-nums">{done} / {game.cards.length}</span>
      </div>
      <motion.div key={`${card.id}-${deck.length}`} initial={{ y: 24, opacity: 0 }}
        animate={miss ? { x: [0, -10, 10, -6, 6, 0], y: 0, opacity: 1 } : { y: 0, opacity: 1 }}
        transition={miss ? { duration: 0.4 } : springs.pop}
        className={cx('flex flex-col gap-2 rounded-2xl bg-primary p-4 shadow-lg ring-2 ring-inset sm:p-5', miss ? 'ring-error' : right ? 'ring-mint-600' : 'ring-secondary')} data-current-card>
        <span className="text-xs font-bold tracking-wide text-tertiary uppercase">Pull request</span>
        <p className="text-lg font-semibold text-primary"><Ticks s={card.label} /></p>
        {right && (
          <span className="w-fit rounded-full px-2.5 py-0.5 text-xs font-bold text-white" style={{ background: BUMP_FILL[lane] }}>
            {LABEL[lane]} · {lane === 'major' ? `waits for ${plan.next}` : `ships in ${plan.now}`}
          </span>
        )}
      </motion.div>
      <div className="grid grid-cols-3 gap-2" role="group" aria-label="Version bump for this change">
        {game.lanes.map(l => (
          <motion.button key={l.id} type="button" onClick={() => call(l.id)} disabled={!!miss || right} whileTap={{ scale: 0.97 }}
            className={cx('flex flex-col items-start gap-0.5 rounded-xl border-2 bg-primary px-3 py-2.5 text-left transition enabled:hover:bg-primary_hover disabled:cursor-default',
              right && l.id === lane ? 'border-mint-600' : miss === l.id ? 'border-error' : miss && l.id === lane ? 'border-mint-600' : 'border-secondary')}>
            <span className="flex items-center gap-1.5 text-md font-bold text-primary"><span className="size-2.5 shrink-0 rounded-sm" style={{ background: BUMP_FILL[l.id as VersionBump] }} aria-hidden />{l.label}</span>
            <span className="text-xs font-medium text-tertiary">{l.hint}</span>
          </motion.button>
        ))}
      </div>
      <div className="min-h-14" aria-live="polite">
        {miss && <NibSays mood="sad">Not {miss}: this one is <strong>{lane}</strong>. {card.note} It’ll come back round.</NibSays>}
        {right && (
          <div className="flex flex-col gap-3">
            <NibSays mood="cheer">{card.note}</NibSays>
            <div className="flex justify-end"><Button size="lg" onPress={next}>{deck.length > 1 ? 'Next change' : 'See the release'}</Button></div>
          </div>
        )}
        {!miss && !right && <NibSays mood="think">Does a squad have to change anything, or will their screens change without asking? If not, is it new, or does it make the docs true again?</NibSays>}
      </div>
      {changelog}
    </div>
  );
}
