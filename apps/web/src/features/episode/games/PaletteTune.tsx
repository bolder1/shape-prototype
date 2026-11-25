'use client';
// Mini-game for ui.6-2: give colour its job in each of Roshni's charts. Every card is a chart (its `visual`, a key of
// `ROSHNI_CHARTS`), drawn in grey by `PaletteChart`. Choose the job its colour should do (`PALETTE_JOBS`, scored by
// `paletteFor`); the chart is recoloured with that job's palette (`markColour`), so a miss shows what goes wrong and a
// right call shows it working. A switch shows the chart as a deuteranope sees it (`simulateCvd`), with the closest
// pair of colours on screen measured (`cvdDistance`). First call scores; a missed card comes back later.
import { useState } from 'react';
import { motion } from 'motion/react';
import { CHART_DIVERGING, CHART_GREY, CHART_RAMP, CHART_SERIES, CVD_MIN, PALETTE_JOBS, ROSHNI_CHARTS, cvdDistance, paletteFor, simulateCvd, type Episode, type PaletteJob, type RoshniChart } from '@shape/content';
import { springs } from '@shape/ui';
import { Button } from '@/components/base/buttons/button';
import { cx } from '@/utils/cx';
import { Burst, NibSays, StageTitle } from '../kit';
import { JOB_LABEL, PaletteChart } from '../scenes/ColourJobs';
import type { GameResult } from './DiamondSort';
import { play } from '@/lib/sound';

type Game = Episode['game'];

/** The swatches a job uses for a chart with `n` series. */
function swatches(job: PaletteJob, n: number): string[] {
  if (job === 'categorical') return CHART_SERIES.slice(0, Math.min(n, CHART_SERIES.length));
  if (job === 'sequential') return [...CHART_RAMP];
  if (job === 'diverging') return [...[...CHART_DIVERGING.below].reverse(), CHART_DIVERGING.mid, ...CHART_DIVERGING.above];
  return [CHART_GREY, CHART_SERIES[0]];
}
/** The closest neighbouring pair in a set of swatches, for everyone (normal vision and both red-green types). */
const closest = (cs: string[]) => cs.slice(1).reduce((m, c, i) => Math.min(m, cvdDistance(cs[i], c)), Infinity);

export function PaletteTune({ game, onDone }: { game: Game; onDone: (results: GameResult[]) => void }) {
  const [deck, setDeck] = useState(game.cards);
  const [results, setResults] = useState<Record<string, boolean>>({});
  const [placed, setPlaced] = useState<RoshniChart[]>([]);
  const [miss, setMiss] = useState<PaletteJob | null>(null);
  const [right, setRight] = useState(false);
  const [cvd, setCvd] = useState(false);
  const card = deck[0];

  if (!card) {
    const n = Object.values(results).filter(Boolean).length;
    return (
      <div className="relative flex flex-col gap-5 py-6">
        <Burst count={36} />
        <StageTitle eyebrow="Colour set" title={`${n} of ${game.cards.length} right first time`}>One job per palette, readable by everyone.</StageTitle>
        <ul className="flex flex-col gap-2">
          {PALETTE_JOBS.map(j => (
            <li key={j} className="flex flex-col gap-1.5 rounded-xl bg-secondary p-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-md font-bold text-primary">{JOB_LABEL[j]}</span>
                <span className="flex gap-1" aria-hidden>{swatches(j, 4).map(c => <span key={c} className="size-4 rounded-sm" style={{ background: c }} />)}</span>
              </div>
              <span className="text-sm text-secondary">{placed.filter(k => paletteFor(ROSHNI_CHARTS[k]) === j).map(k => ROSHNI_CHARTS[k].text).join(' · ')}</span>
            </li>
          ))}
        </ul>
        <NibSays mood={n === game.cards.length ? 'cheer' : 'idle'}>Names get distinct hues in a fixed order. Amounts get one hue, light to dark. A meaningful middle gets two hues and a grey. When the chart is about one thing, everything else goes grey.</NibSays>
        <Button size="xl" onPress={() => onDone(game.cards.map(c => ({ id: c.id, correct: !!results[c.id] })))}>Continue the story</Button>
      </div>
    );
  }

  const k = card.visual as RoshniChart;
  const c = ROSHNI_CHARTS[k];
  const lane = paletteFor(c);
  const owner = game.lanes.find(l => l.id === lane)!;
  const done = game.cards.length - deck.length;
  const shown: PaletteJob | null = right ? lane : miss;
  const sw = shown ? swatches(shown, c.series) : [];
  const near = sw.length > 1 ? closest(sw) : null;
  const call = (laneId: string) => {
    if (miss || right) return;
    const ok = laneId === lane;
    play(ok ? 'correct' : 'wrong');
    setResults(rs => (card.id in rs ? rs : { ...rs, [card.id]: ok }));
    if (ok) { setRight(true); setPlaced(ps => [...ps, k]); }
    else { setMiss(laneId as PaletteJob); setTimeout(() => { setMiss(null); setDeck(dk => [...dk.slice(1), dk[0]]); }, 3800); }
  };
  const next = () => { setRight(false); setDeck(dk => dk.slice(1)); };

  return (
    <div className="flex flex-col gap-5">
      <StageTitle eyebrow="Play" title={game.title}>{game.instructions}</StageTitle>
      <div className="flex items-baseline justify-between">
        <span className="text-sm font-semibold text-tertiary">Charts to colour</span>
        <span className="text-sm font-semibold text-tertiary tabular-nums">{done} / {game.cards.length}</span>
      </div>
      <motion.div key={`${card.id}-${deck.length}`} initial={{ y: 24, opacity: 0 }} animate={miss ? { x: [0, -10, 10, -6, 6, 0], y: 0, opacity: 1 } : { y: 0, opacity: 1 }} transition={miss ? { duration: 0.4 } : springs.pop}
        className={cx('flex flex-col gap-3 rounded-2xl bg-primary p-4 shadow-lg ring-2 ring-inset sm:p-5', miss ? 'ring-error' : right ? 'ring-mint-600' : 'ring-secondary')} data-current-card>
        <p className="text-lg font-semibold text-primary">{card.label}</p>
        <div className="rounded-xl bg-primary p-2 ring-1 ring-secondary ring-inset">
          <svg viewBox="0 0 320 170" className="w-full" role="img" aria-label={`${card.label}, ${shown ? `coloured as ${JOB_LABEL[shown].toLowerCase()}` : 'in grey'}${cvd ? ', as a deuteranope sees it' : ''}`}>
            <PaletteChart k={k} job={shown} cvd={cvd} x={6} y={6} w={308} h={158} />
          </svg>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="flex min-w-0 flex-wrap items-center gap-2 text-sm font-semibold text-secondary">
            {shown ? (
              <>
                <span className="flex gap-0.5" aria-hidden>{sw.map(s => <span key={s} className="size-3.5 rounded-sm" style={{ background: cvd ? simulateCvd(s, 'deutan') : s }} />)}</span>
                <span>{miss ? `${JOB_LABEL[miss]}: wrong job` : near !== null && lane === 'categorical' ? `Closest pair ΔE ${near.toFixed(0)} ${near >= CVD_MIN ? '✓' : '✗'}` : JOB_LABEL[lane]}</span>
              </>
            ) : 'Grey until colour has a job'}
          </span>
          <div className="flex rounded-full bg-secondary p-1" role="group" aria-label="Vision">
            {([[false, 'Normal'], [true, 'Colour-blind']] as const).map(([v, l]) => (
              <button key={l} type="button" aria-pressed={cvd === v} onClick={() => setCvd(v)}
                className={cx('rounded-full px-3 py-1 text-sm font-semibold transition', cvd === v ? 'bg-primary text-primary shadow-xs' : 'text-tertiary hover:text-secondary')}>{l}</button>
            ))}
          </div>
        </div>
      </motion.div>
      <div className="grid grid-cols-2 gap-2 md:grid-cols-4" role="group" aria-label="Colour job for this chart">
        {game.lanes.map(l => (
          <motion.button key={l.id} type="button" onClick={() => call(l.id)} disabled={!!miss || right} whileTap={{ scale: 0.97 }}
            className={cx('flex flex-col items-start gap-0.5 rounded-xl border-2 bg-primary px-3 py-2.5 text-left transition enabled:hover:bg-primary_hover disabled:cursor-default',
              right && l.id === lane ? 'border-mint-600' : miss === l.id ? 'border-error' : miss && l.id === lane ? 'border-mint-600' : 'border-secondary')}>
            <span className="text-md font-bold text-primary">{l.label}</span>
            <span className="text-xs font-medium text-tertiary">{l.hint}</span>
          </motion.button>
        ))}
      </div>
      <div className="min-h-14" aria-live="polite">
        {miss && <NibSays mood="sad">That’s the chart with {JOB_LABEL[miss].toLowerCase()} colour. It needs <strong>{owner.label.toLowerCase()}</strong>. {card.note} It’ll come back round.</NibSays>}
        {right && (
          <div className="flex flex-col gap-3">
            <NibSays mood="cheer">{card.note}</NibSays>
            <div className="flex justify-end"><Button size="lg" onPress={next}>{deck.length > 1 ? 'Next chart' : 'See the palettes'}</Button></div>
          </div>
        )}
        {!miss && !right && <NibSays mood="think">Is the colour telling names apart, showing more and less of an amount, showing both sides of a middle, or picking out the one thing the chart is about?</NibSays>}
      </div>
    </div>
  );
}
