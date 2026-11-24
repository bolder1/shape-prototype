'use client';
// Mini-game for st.3-3: each card is a question about Kahaani's new families (its `visual`, a key of `KAHAANI_ASKS`).
// Open the view that answers it: the funnel, the cohort table or the language split. A wrong view shakes, says why and
// the card comes back later; the right one opens with raw counts, and you estimate the answer as a percentage on a
// slider. Locking it in rings the cells it comes from and shows the answer (`askValue`) and how close you were
// (`estimateGrade`). The view scores on the first try; the estimate is tallied separately.
import { useState } from 'react';
import { motion } from 'motion/react';
import { FunnelIcon, TableIcon, TranslateIcon } from '@phosphor-icons/react/ssr';
import { DATA_VIEWS, KAHAANI_ASKS, KAHAANI_COHORTS, KAHAANI_FUNNEL, KAHAANI_SEGMENTS, askValue, estimateGrade, type DataAsk, type DataView, type Episode, type KahaaniAsk } from '@shape/content';
import { springs } from '@shape/ui';
import { Button } from '@/components/base/buttons/button';
import { cx } from '@/utils/cx';
import { Burst, NibSays, StageTitle } from '../kit';
import { cohortTint } from '../scenes/CohortTriangle';
import { Tune } from './MeasureTune';
import type { GameResult } from './DiamondSort';
import { play } from '@/lib/sound';

type Game = Episode['game'];
const ICON: Record<DataView, typeof FunnelIcon> = { funnel: FunnelIcon, cohort: TableIcon, segment: TranslateIcon };
const GRADE: Record<ReturnType<typeof estimateGrade>, string> = { spot: 'Spot on', close: 'Close', off: 'Off' };
const n = (x: number) => x.toLocaleString('en-IN');
const ring = 'ring-2 ring-inset ring-mint-600';

function FunnelView({ ask, shown }: { ask?: DataAsk; shown: boolean }) {
  const hit = (id: string) => shown && ask?.view === 'funnel' && (ask.from === id || ask.to === id);
  return (
    <ol className="flex flex-col gap-1.5">
      {KAHAANI_FUNNEL.map(s => (
        <li key={s.id} className={cx('flex items-center gap-2 rounded-lg p-1', hit(s.id) && ring)}>
          <span className="w-40 shrink-0 text-xs font-semibold text-secondary">{s.label}</span>
          <span className="relative h-6 flex-1 rounded-md bg-secondary">
            <span className="absolute inset-y-0 left-0 rounded-md bg-brand-solid" style={{ width: `${(s.n / KAHAANI_FUNNEL[0].n) * 100}%` }} />
          </span>
          <span className="w-14 text-right text-xs font-semibold text-primary tabular-nums">{n(s.n)}</span>
        </li>
      ))}
    </ol>
  );
}

function CohortView({ ask, shown }: { ask?: DataAsk; shown: boolean }) {
  const hit = (id: string, w: number) => shown && ask?.view === 'cohort' && ask.cohorts.includes(id as never) && (w === 0 || w === ask.week);
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[30rem] border-separate border-spacing-1 text-xs tabular-nums">
        <thead>
          <tr className="text-tertiary"><th className="text-left font-semibold">Joined</th>{[0, 1, 2, 3, 4].map(w => <th key={w} className="font-semibold">Week {w}</th>)}</tr>
        </thead>
        <tbody>
          {KAHAANI_COHORTS.map(c => (
            <tr key={c.id}>
              <th className="text-left font-semibold text-primary">{c.label}{'note' in c && <span className="block font-normal text-tertiary">{c.note}</span>}</th>
              {[0, 1, 2, 3, 4].map(w => {
                const kept: number | undefined = (c.kept as readonly number[])[w];
                if (kept === undefined) return <td key={w} />;
                const tint = cohortTint(shown ? kept / c.kept[0] : 0.1);
                return (
                  <td key={w} className={cx('rounded-md px-1.5 py-1 text-center font-semibold', hit(c.id, w) && ring)} style={{ background: w === 0 ? undefined : tint.fill, color: w === 0 ? undefined : tint.text }}>
                    {n(kept)}{shown && w > 0 && <span className="block text-[10px] font-normal">{Math.round((kept / c.kept[0]) * 100)}%</span>}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function SegmentView({ ask, shown }: { ask?: DataAsk; shown: boolean }) {
  return (
    <table className="w-full border-separate border-spacing-1 text-xs tabular-nums">
      <thead><tr className="text-tertiary"><th className="text-left font-semibold">Language</th><th className="font-semibold">First stories started</th><th className="font-semibold">Finished</th></tr></thead>
      <tbody>
        {(Object.keys(KAHAANI_SEGMENTS) as (keyof typeof KAHAANI_SEGMENTS)[]).map(l => {
          const s = KAHAANI_SEGMENTS[l], hit = shown && ask?.view === 'segment' && ask.lang === l;
          return (
            <tr key={l} className="text-center">
              <th className="text-left font-semibold text-primary">{s.label}</th>
              <td className={cx('rounded-md bg-secondary py-1 font-semibold text-primary', hit && ring)}>{n(s.started)}</td>
              <td className={cx('rounded-md bg-secondary py-1 font-semibold text-primary', hit && ring)}>{n(s.finished)}{shown && <span className="block text-[10px] font-normal">{Math.round((s.finished / s.started) * 100)}%</span>}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

const VIEW: Record<DataView, typeof FunnelView> = { funnel: FunnelView, cohort: CohortView, segment: SegmentView };

export function CohortRead({ game, onDone }: { game: Game; onDone: (results: GameResult[]) => void }) {
  const [deck, setDeck] = useState(game.cards);
  const [results, setResults] = useState<Record<string, boolean>>({});
  const [grades, setGrades] = useState<Record<string, ReturnType<typeof estimateGrade>>>({});
  const [open, setOpen] = useState<DataView | null>(null);
  const [guess, setGuess] = useState(50);
  const [locked, setLocked] = useState(false);
  const [miss, setMiss] = useState(false);
  const card = deck[0];

  const pick = (v: DataView) => {
    if (!card || miss || open) return;
    const ok = v === card.lane;
    play(ok ? 'correct' : 'wrong');
    setResults(x => (card.id in x ? x : { ...x, [card.id]: ok }));
    if (ok) { setOpen(v); setGuess(50); setLocked(false); }
    else { setMiss(true); setTimeout(() => { setMiss(false); setDeck(d => [...d.slice(1), d[0]]); }, 2600); }
  };
  const lock = () => {
    const truth = askValue(KAHAANI_ASKS[card.visual as KahaaniAsk]);
    const g = estimateGrade(guess, truth);
    play(g === 'off' ? 'wrong' : 'correct');
    setGrades(x => ({ ...x, [card.id]: g }));
    setLocked(true);
  };
  const next = () => { setOpen(null); setLocked(false); setDeck(d => d.slice(1)); };

  if (!card) {
    const right = Object.values(results).filter(Boolean).length;
    const near = Object.values(grades).filter(g => g !== 'off').length;
    return (
      <div className="relative flex flex-col items-center gap-5 py-6 text-center">
        <Burst count={36} />
        <StageTitle eyebrow="Kahaani’s new families" title={`${right} of ${game.cards.length} right views first time`}>
          {`And ${near} of ${game.cards.length} estimates within 8 points. The funnel found the drop, the cohorts showed the change working, and the language split said who it belonged to.`}
        </StageTitle>
        <NibSays mood={right === game.cards.length ? 'cheer' : 'idle'}>The question picks the view. “Where do people drop?” is a funnel. “Did it work?” is cohorts at the same week. “For whom?” is a split.</NibSays>
        <Button size="xl" onPress={() => onDone(game.cards.map(c => ({ id: c.id, correct: !!results[c.id] })))}>Continue the story</Button>
      </div>
    );
  }

  const ask = KAHAANI_ASKS[card.visual as KahaaniAsk];
  const truth = askValue(ask);
  const lane = game.lanes.find(l => l.id === card.lane)!;
  const View = open ? VIEW[open] : null;
  const done = game.cards.length - deck.length;

  return (
    <div className="flex flex-col gap-5">
      <StageTitle eyebrow="Play" title={game.title}>{game.instructions}</StageTitle>
      <div className="flex items-baseline justify-between">
        <span className="text-sm font-semibold text-tertiary">{open ? 'Estimate the answer' : 'Which view answers it?'}</span>
        <span className="text-sm font-semibold text-tertiary tabular-nums">{done} / {game.cards.length}</span>
      </div>
      <motion.div key={`${card.id}-${deck.length}`} initial={{ y: -14, opacity: 0 }} animate={miss ? { x: [0, -10, 10, -6, 6, 0], opacity: 1 } : { y: 0, opacity: 1 }} transition={miss ? { duration: 0.4 } : springs.pop}
        className={cx('mx-auto w-full max-w-lg rounded-2xl bg-primary px-5 py-4 text-lg font-semibold text-primary shadow-lg ring-2 ring-inset', miss ? 'ring-error' : 'ring-secondary')} data-current-card>
        {card.label}
      </motion.div>
      <div className="grid grid-cols-3 gap-2" role="group" aria-label="Views">
        {DATA_VIEWS.map(v => {
          const l = game.lanes.find(x => x.id === v), Icon = ICON[v];
          return (
            <motion.button key={v} type="button" onClick={() => pick(v)} disabled={miss || !!open} whileTap={{ scale: 0.97 }} aria-pressed={open === v}
              className={cx('flex flex-col items-start gap-1 rounded-2xl border-2 bg-secondary p-3 text-left transition hover:bg-secondary_hover disabled:cursor-default',
                open === v ? 'border-brand' : miss && v === card.lane ? 'border-mint-600' : 'border-transparent', open && open !== v && 'opacity-50')}>
              <span className="flex items-center gap-1.5 text-sm font-bold text-primary"><Icon className="size-4" aria-hidden />{l?.label}</span>
              {l && <span className="hidden text-[11px] leading-tight text-tertiary sm:block">{l.hint}</span>}
            </motion.button>
          );
        })}
      </div>
      {View && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={springs.pop} className="flex flex-col gap-4 rounded-2xl bg-primary p-4 ring-1 ring-secondary ring-inset">
          <View ask={ask} shown={locked} />
          <Tune label="Your estimate" value={guess} min={0} max={100} step={1} ok={locked && grades[card.id] !== 'off'} fmt={v => `${v}%`} onChange={v => { if (!locked) setGuess(v); }} />
          {!locked
            ? <Button size="lg" onPress={lock}>Lock it in</Button>
            : (
              <div className="flex flex-col gap-3">
                <p className="text-sm text-secondary"><span className="font-semibold text-primary">{GRADE[grades[card.id]]}:</span> the answer is {truth}%, you said {guess}%.</p>
                <NibSays mood={grades[card.id] === 'off' ? 'think' : 'cheer'}>{card.note}</NibSays>
                <Button size="lg" onPress={next}>{deck.length > 1 ? 'Next question' : 'See how you did'}</Button>
              </div>
            )}
        </motion.div>
      )}
      {!open && (
        <div className="min-h-14">
          {miss && <NibSays mood="sad">Open the <strong>{lane.label.toLowerCase()}</strong>: {lane.hint.toLowerCase()}. It’ll come back round.</NibSays>}
        </div>
      )}
    </div>
  );
}
