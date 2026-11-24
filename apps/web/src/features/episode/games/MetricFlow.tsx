'use client';
// Mini-game for st.3-1: each card is a metric someone at Kahaani wants on the dashboard (its `visual`, a key of
// `KAHAANI_METRICS`). Wire it into the metric tree: the north star at the top, an input under it, a guardrail beside it,
// or the vanity bin. A right call grows the tree, and the inputs pulse a flow up into the north star (still when the
// device asks for reduced motion); a miss shakes, says why (`metricRole`) and the card comes back later. First try
// scores. The end is the whole tree with this week's story-nights from `storyNights`.
import { useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { ShieldWarningIcon, StarIcon, TrashIcon, TreeStructureIcon } from '@phosphor-icons/react/ssr';
import { KAHAANI_METRICS, KAHAANI_WEEK, METRIC_ROLES, storyNights, type Episode, type KahaaniMetric, type MetricRole } from '@shape/content';
import { springs } from '@shape/ui';
import { Button } from '@/components/base/buttons/button';
import { cx } from '@/utils/cx';
import { Burst, NibSays, StageTitle } from '../kit';
import { INPUT_OWNER, ROLE_FILL, ROLE_NAME } from '../scenes/MetricTree';
import type { GameResult } from './DiamondSort';
import { play } from '@/lib/sound';

type Game = Episode['game'];
type Card = Game['cards'][number];
const ICON: Record<MetricRole, typeof StarIcon> = { north: StarIcon, input: TreeStructureIcon, guardrail: ShieldWarningIcon, vanity: TrashIcon };

function Chip({ c, role }: { c: Card; role: MetricRole }) {
  const m = KAHAANI_METRICS[c.visual as KahaaniMetric];
  return (
    <motion.li layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={springs.pop}
      className={cx('rounded-lg border-2 bg-primary px-2 py-1 text-xs font-semibold text-primary', role === 'vanity' && 'line-through decoration-2')}
      style={{ borderColor: ROLE_FILL[role] }}>
      {m.short}{role === 'input' && INPUT_OWNER[c.visual as KahaaniMetric] ? <span className="font-normal text-tertiary"> · {INPUT_OWNER[c.visual as KahaaniMetric]}</span> : null}
    </motion.li>
  );
}

/** The tree: north star on top, inputs feeding it, guardrails beside, the bin below. */
function Tree({ on, done }: { on: (r: MetricRole) => Card[]; done?: boolean }) {
  const still = useReducedMotion();
  const north = on('north'), inputs = on('input');
  return (
    <div className="grid gap-3 sm:grid-cols-[1fr_12rem]">
      <div className="flex flex-col items-center gap-2 rounded-2xl bg-secondary p-3">
        <div className="flex min-h-12 w-full max-w-sm flex-col items-center justify-center rounded-xl px-3 py-2 text-center text-sm font-semibold text-white" style={{ background: ROLE_FILL.north }}>
          {north.length ? KAHAANI_METRICS[north[0].visual as KahaaniMetric].short : 'North star: ?'}
          {done && <span className="text-xs font-normal">≈ {storyNights(KAHAANI_WEEK).toLocaleString('en-IN')} this week</span>}
        </div>
        <div className="relative h-6 w-full max-w-sm" aria-hidden>
          <div className="absolute inset-x-1/2 h-full w-0.5 -translate-x-1/2" style={{ background: ROLE_FILL.input }} />
          {inputs.length > 0 && !still && (
            <motion.span className="absolute left-1/2 size-2 -translate-x-1/2 rounded-full" style={{ background: ROLE_FILL.input }}
              animate={{ y: [20, 0], opacity: [0, 1, 0] }} transition={{ duration: 1.2, repeat: Infinity, ease: 'easeOut' }} />
          )}
        </div>
        <ul className="flex min-h-10 w-full flex-wrap justify-center gap-1.5 rounded-xl border-2 border-dashed p-2" style={{ borderColor: ROLE_FILL.input }}>
          {inputs.length ? inputs.map(c => <Chip key={c.id} c={c} role="input" />) : <li className="text-xs text-tertiary">Inputs go here</li>}
        </ul>
      </div>
      <div className="flex flex-col gap-3">
        <ul className="flex min-h-16 flex-col gap-1.5 rounded-2xl bg-secondary p-2">
          <li className="flex items-center gap-1 text-xs font-bold text-secondary"><ShieldWarningIcon className="size-3.5" aria-hidden />Guardrails: must not rise</li>
          {on('guardrail').map(c => <Chip key={c.id} c={c} role="guardrail" />)}
        </ul>
        <ul className="flex min-h-16 flex-col gap-1.5 rounded-2xl bg-secondary p-2">
          <li className="text-xs font-bold text-tertiary">Vanity bin</li>
          {on('vanity').map(c => <Chip key={c.id} c={c} role="vanity" />)}
        </ul>
      </div>
    </div>
  );
}

export function MetricFlow({ game, onDone }: { game: Game; onDone: (results: GameResult[]) => void }) {
  const [deck, setDeck] = useState(game.cards);
  const [results, setResults] = useState<Record<string, boolean>>({});
  const [placed, setPlaced] = useState<string[]>([]);
  const [miss, setMiss] = useState(false);
  const card = deck[0];
  const on = (r: MetricRole) => game.cards.filter(c => c.lane === r && placed.includes(c.id));
  const last = placed.length ? game.cards.find(c => c.id === placed[placed.length - 1]) : undefined;

  const send = (r: MetricRole) => {
    if (!card || miss) return;
    const ok = r === card.lane;
    play(ok ? 'correct' : 'wrong');
    setResults(x => (card.id in x ? x : { ...x, [card.id]: ok }));
    if (ok) { setPlaced(x => [...x, card.id]); setDeck(d => d.slice(1)); }
    else { setMiss(true); setTimeout(() => { setMiss(false); setDeck(d => [...d.slice(1), d[0]]); }, 2600); }
  };

  if (!card) {
    const right = Object.values(results).filter(Boolean).length;
    return (
      <div className="relative flex flex-col items-center gap-5 py-6 text-center">
        <Burst count={36} />
        <StageTitle eyebrow="Kahaani’s metric tree" title={`${right} of ${game.cards.length} metrics wired first time`}>
          {`${KAHAANI_WEEK.families.toLocaleString('en-IN')} families × ${KAHAANI_WEEK.opens} nights opened × ${KAHAANI_WEEK.finish * 100}% finished. Each input has an owner, and two guardrails keep the push honest.`}
        </StageTitle>
        <div className="w-full text-left"><Tree on={on} done /></div>
        <NibSays mood={right === game.cards.length ? 'cheer' : 'idle'}>Next time someone proposes a feature, ask which input it moves and which guardrail it touches. If the answer is “downloads”, it’s going in the bin.</NibSays>
        <Button size="xl" onPress={() => onDone(game.cards.map(c => ({ id: c.id, correct: !!results[c.id] })))}>Continue the story</Button>
      </div>
    );
  }

  const owner = game.lanes.find(l => l.id === card.lane)!;
  return (
    <div className="flex flex-col gap-5">
      <StageTitle eyebrow="Play" title={game.title}>{game.instructions}</StageTitle>
      <div className="flex items-baseline justify-between">
        <span className="text-sm font-semibold text-tertiary">Proposed for the dashboard</span>
        <span className="text-sm font-semibold text-tertiary tabular-nums">{placed.length} / {game.cards.length}</span>
      </div>
      <motion.div key={`${card.id}-${deck.length}`} initial={{ y: -14, opacity: 0 }} animate={miss ? { x: [0, -10, 10, -6, 6, 0], opacity: 1 } : { y: 0, opacity: 1 }} transition={miss ? { duration: 0.4 } : springs.pop}
        className={cx('mx-auto w-full max-w-lg rounded-2xl bg-primary px-5 py-4 text-lg font-semibold text-primary shadow-lg ring-2 ring-inset', miss ? 'ring-error' : 'ring-secondary')} data-current-card>
        {card.label}
      </motion.div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {METRIC_ROLES.map(r => {
          const lane = game.lanes.find(l => l.id === r), Icon = ICON[r];
          return (
            <motion.button key={r} type="button" onClick={() => send(r)} disabled={miss} whileTap={{ scale: 0.97 }}
              className={cx('flex flex-col items-start gap-1 rounded-2xl border-2 bg-secondary p-3 text-left transition hover:bg-secondary_hover disabled:cursor-default', miss && r === card.lane ? 'border-mint-600' : 'border-transparent')}>
              <span className="flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-bold text-white" style={{ background: ROLE_FILL[r] }}><Icon className="size-3.5" aria-hidden />{ROLE_NAME[r]}</span>
              {lane && <span className="text-[11px] leading-tight text-tertiary">{lane.hint}</span>}
            </motion.button>
          );
        })}
      </div>
      <Tree on={on} />
      <div className="min-h-14">
        {miss
          ? <NibSays mood="sad">It’s <strong>{owner.label}</strong>. {card.note} It’ll come back round.</NibSays>
          : last && <NibSays mood="cheer"><strong>{KAHAANI_METRICS[last.visual as KahaaniMetric].short}:</strong> {last.note}</NibSays>}
      </div>
    </div>
  );
}
