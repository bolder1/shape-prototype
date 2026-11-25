'use client';
// Mini-game for ds.4-1: route Kavya's queue. Every card is a request (its `visual`, a key of `RASTA_REQUESTS`) shown as
// a ticket: the squad, what kind of change it is, how many squads need it, and what a search of the system finds.
// Route it (`CONTRIBUTION_PATHS`, scored by `contributionPath`). A right call lays out who does each step on that path
// (`PATH_STEPS`) and spends the core team's hours (`PATH_HOURS`) against the quarter's `REQUEST_BUDGET`. First call
// scores; a missed card comes back later. The end compares the hours with what building everything in the core costs.
import { useState } from 'react';
import { motion } from 'motion/react';
import {
  PATH_HOURS, PATH_STEPS, RASTA_REQUESTS, REQUEST_BUDGET, contributionPath, requestHours,
  type ContributionPath, type Episode, type RastaRequest,
} from '@shape/content';
import { springs } from '@shape/ui';
import { Button } from '@/components/base/buttons/button';
import { cx } from '@/utils/cx';
import { Burst, NibSays, StageTitle } from '../kit';
import { PATH_FILL, PATH_LABEL } from '../scenes/ContributionModels';
import type { GameResult } from './DiamondSort';
import { play } from '@/lib/sound';

type Game = Episode['game'];
const KIND = { fix: 'Fix', variant: 'Variant of an existing component', component: 'New component' } as const;

/** The core team's hours this quarter, as a bar against the budget. */
function Hours({ used }: { used: number }) {
  const over = used > REQUEST_BUDGET;
  return (
    <div className="flex flex-col gap-1.5 rounded-xl bg-secondary p-3">
      <div className="flex items-baseline justify-between gap-2 text-sm">
        <span className="font-semibold text-primary">Core team hours this quarter</span>
        <span className={cx('font-semibold tabular-nums', over ? 'text-error-primary' : 'text-secondary')}>{used} / {REQUEST_BUDGET} h</span>
      </div>
      <div className="h-2.5 w-full overflow-hidden rounded-full bg-primary ring-1 ring-secondary ring-inset" aria-hidden>
        <motion.div className={cx('h-full rounded-full', over ? 'bg-error-solid' : 'bg-brand-solid')} initial={false} animate={{ width: `${Math.min(100, (used / REQUEST_BUDGET) * 100)}%` }} transition={springs.pop} />
      </div>
    </div>
  );
}

/** Who does what on a path. */
function Steps({ path }: { path: ContributionPath }) {
  return (
    <ol className="flex flex-col gap-1.5">
      {PATH_STEPS[path].map((s, i) => (
        <motion.li key={s.step} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ ...springs.pop, delay: i * 0.12 }} className="flex items-center gap-2 text-sm">
          <span className={cx('w-16 shrink-0 rounded-full px-2 py-0.5 text-center text-xs font-bold', s.who === 'squad' ? 'bg-secondary text-primary ring-1 ring-secondary ring-inset' : 'text-white')}
            style={s.who === 'system' ? { background: PATH_FILL.core } : undefined}>{s.who === 'squad' ? 'Squad' : 'Core'}</span>
          <span className="text-secondary">{s.step}</span>
        </motion.li>
      ))}
    </ol>
  );
}

export function ContributionRoute({ game, onDone }: { game: Game; onDone: (results: GameResult[]) => void }) {
  const [deck, setDeck] = useState(game.cards);
  const [results, setResults] = useState<Record<string, boolean>>({});
  const [routed, setRouted] = useState<RastaRequest[]>([]);
  const [miss, setMiss] = useState<ContributionPath | null>(null);
  const [right, setRight] = useState(false);
  const card = deck[0];
  const pathOf = (k: RastaRequest) => contributionPath(RASTA_REQUESTS[k]);
  const used = requestHours(routed.map(pathOf));

  if (!card) {
    const n = Object.values(results).filter(Boolean).length;
    const allCore = requestHours(game.cards.map(() => 'core'));
    return (
      <div className="relative flex flex-col gap-5 py-6">
        <Burst count={36} />
        <StageTitle eyebrow="Queue routed" title={`${n} of ${game.cards.length} right first time`}>
          Routed by need, the queue costs the core team {used} hours of its {REQUEST_BUDGET}. Building every request itself would have cost {allCore.toLocaleString('en-IN')}.
        </StageTitle>
        <Hours used={used} />
        <ul className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {(['reuse', 'local', 'contribute', 'core'] as const).map(pth => (
            <li key={pth} className="flex flex-col gap-1 rounded-xl bg-primary p-3 ring-1 ring-secondary ring-inset">
              <span className="w-fit rounded-full px-2 py-0.5 text-xs font-bold text-white" style={{ background: PATH_FILL[pth] }}>{PATH_LABEL[pth]}</span>
              <span className="text-sm text-secondary">{routed.filter(k => pathOf(k) === pth).length} requests · {PATH_HOURS[pth]} h each</span>
            </li>
          ))}
        </ul>
        <NibSays mood={n === game.cards.length ? 'cheer' : 'idle'}>Reuse what exists, keep one-squad needs local, let squads contribute fixes and shared variants, and save the core team for what three or more squads need.</NibSays>
        <Button size="xl" onPress={() => onDone(game.cards.map(c => ({ id: c.id, correct: !!results[c.id] })))}>Continue the story</Button>
      </div>
    );
  }

  const k = card.visual as RastaRequest;
  const r = RASTA_REQUESTS[k];
  const lane = pathOf(k);
  const owner = game.lanes.find(l => l.id === lane)!;
  const done = game.cards.length - deck.length;
  const call = (laneId: string) => {
    if (miss || right) return;
    const ok = laneId === lane;
    play(ok ? 'correct' : 'wrong');
    setResults(rs => (card.id in rs ? rs : { ...rs, [card.id]: ok }));
    if (ok) { setRight(true); setRouted(rs => [...rs, k]); }
    else { setMiss(laneId as ContributionPath); setTimeout(() => { setMiss(null); setDeck(dk => [...dk.slice(1), dk[0]]); }, 3600); }
  };
  const next = () => { setRight(false); setDeck(dk => dk.slice(1)); };

  return (
    <div className="flex flex-col gap-5">
      <StageTitle eyebrow="Play" title={game.title}>{game.instructions}</StageTitle>
      <div className="flex items-baseline justify-between">
        <span className="text-sm font-semibold text-tertiary">Requests in the queue</span>
        <span className="text-sm font-semibold text-tertiary tabular-nums">{done} / {game.cards.length}</span>
      </div>
      <motion.div key={`${card.id}-${deck.length}`} initial={{ y: 24, opacity: 0 }}
        animate={miss ? { x: [0, -10, 10, -6, 6, 0], y: 0, opacity: 1 } : { y: 0, opacity: 1 }}
        transition={miss ? { duration: 0.4 } : springs.pop}
        className={cx('flex flex-col gap-3 rounded-2xl bg-primary p-4 shadow-lg ring-2 ring-inset sm:p-5', miss ? 'ring-error' : right ? 'ring-mint-600' : 'ring-secondary')} data-current-card>
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-bold text-primary ring-1 ring-secondary ring-inset">{r.squad}</span>
          <span className="text-xs font-semibold text-tertiary">{KIND[r.kind]}</span>
        </div>
        <p className="text-lg font-semibold text-primary">{card.label}</p>
        <dl className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          <div className="rounded-xl bg-secondary px-3 py-2">
            <dt className="text-xs font-semibold text-tertiary">Squads that need it now</dt>
            <dd className="flex items-center gap-1 pt-1" aria-label={`${r.teams} of 9`}>
              {Array.from({ length: 9 }, (_, i) => <span key={i} className={cx('size-3 rounded-full', i < r.teams ? 'bg-brand-solid' : 'bg-primary ring-1 ring-secondary ring-inset')} />)}
              <span className="pl-1 text-sm font-semibold text-primary tabular-nums">{r.teams}</span>
            </dd>
          </div>
          <div className="rounded-xl bg-secondary px-3 py-2">
            <dt className="text-xs font-semibold text-tertiary">Search the system</dt>
            <dd className="text-sm font-semibold text-primary">{r.match ? <>Found: <span className="font-mono">{r.match}</span></> : 'No match'}</dd>
          </div>
        </dl>
        {right && (
          <div className="flex flex-col gap-2 border-t border-secondary pt-3">
            <span className="w-fit rounded-full px-2.5 py-0.5 text-xs font-bold text-white" style={{ background: PATH_FILL[lane] }}>{PATH_LABEL[lane]} · {PATH_HOURS[lane]} h of core time</span>
            <Steps path={lane} />
          </div>
        )}
      </motion.div>
      <div className="grid grid-cols-2 gap-2 md:grid-cols-4" role="group" aria-label="Where this request goes">
        {game.lanes.map(l => (
          <motion.button key={l.id} type="button" onClick={() => call(l.id)} disabled={!!miss || right} whileTap={{ scale: 0.97 }}
            className={cx('flex flex-col items-start gap-0.5 rounded-xl border-2 bg-primary px-3 py-2.5 text-left transition enabled:hover:bg-primary_hover disabled:cursor-default',
              right && l.id === lane ? 'border-mint-600' : miss === l.id ? 'border-error' : miss && l.id === lane ? 'border-mint-600' : 'border-secondary')}>
            <span className="flex items-center gap-1.5 text-md font-bold text-primary"><span className="size-2.5 shrink-0 rounded-full" style={{ background: PATH_FILL[l.id as ContributionPath] }} aria-hidden />{l.label}</span>
            <span className="text-xs font-medium text-tertiary">{l.hint}</span>
          </motion.button>
        ))}
      </div>
      <div className="min-h-14" aria-live="polite">
        {miss && <NibSays mood="sad">Not {PATH_LABEL[miss].toLowerCase()}: this one is <strong>{owner.label.toLowerCase()}</strong>. {card.note} It’ll come back round.</NibSays>}
        {right && (
          <div className="flex flex-col gap-3">
            <NibSays mood="cheer">{card.note}</NibSays>
            <div className="flex justify-end"><Button size="lg" onPress={next}>{deck.length > 1 ? 'Next request' : 'See the quarter'}</Button></div>
          </div>
        )}
        {!miss && !right && <NibSays mood="think">Does something already do this job? Is it a fix? How many squads need it now, and is it a whole new component?</NibSays>}
      </div>
      <Hours used={used} />
    </div>
  );
}
