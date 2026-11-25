'use client';
// Mini-game for ui.6-1: pick the chart form for each question on Roshni's ops console. Every card is a question (its
// `visual`, a key of `ROSHNI_QUESTIONS`). Choose a form (`CHART_FORMS`, scored by `chartFor`); a right call draws the
// question's real data in that form with `FormChart`, bars from zero (`valueAxis`), histograms with the average marked
// (`histogram`), and says what scale it used. A miss names the task the question asks for, explains, and the card comes
// back later; first call scores.
import { useState } from 'react';
import { motion } from 'motion/react';
import { CHART_FORMS, ROSHNI_QUESTIONS, chartFor, valueAxis, type ChartForm, type ChartQuestion, type Episode, type RoshniQuestion } from '@shape/content';
import { springs } from '@shape/ui';
import { Button } from '@/components/base/buttons/button';
import { cx } from '@/utils/cx';
import { Burst, NibSays, StageTitle } from '../kit';
import { FORM_LABEL, FormChart } from '../scenes/ChartForms';
import type { GameResult } from './DiamondSort';
import { play } from '@/lib/sound';

type Game = Episode['game'];
const TASK: Record<ChartQuestion['task'], string> = { compare: 'comparing categories', trend: 'change over time', part: 'parts of a whole', distribution: 'how values spread', relationship: 'whether two measures move together' };

/** What the data is, in words, before it's drawn. */
function dataLine(q: ChartQuestion) {
  const d = q.data;
  if (d.kind === 'values') return `${d.values.length} values in ${d.unit}: ${d.labels.slice(0, 3).join(', ')}${d.labels.length > 3 ? '…' : ''}`;
  if (d.kind === 'samples') return `${d.values.length} ${d.unit === '₹' ? 'amounts in ₹' : `values in ${d.unit}`}, one per customer`;
  return `${d.points.length} pairs: ${d.x.toLowerCase()} and ${d.y.toLowerCase()}`;
}
/** How the drawn chart is scaled, so the honesty is visible. */
function scaleLine(q: ChartQuestion, f: ChartForm) {
  const d = q.data;
  if (d.kind === 'values') { const a = valueAxis(f === 'line' ? 'line' : 'bar', d.values); return f === 'line' ? `Axis ${a.min}–${a.max} ${d.unit}: a line can zoom, its slope stays true` : `Bars from 0 to ${a.max} ${d.unit}${q.task === 'trend' ? ', in time order' : ', sorted'}`; }
  if (d.kind === 'samples') return `Bins of ${d.unit === '₹' ? `₹${d.width}` : `${d.width} ${d.unit}`}, counts from zero, average marked`;
  return 'Both axes from zero, one dot each';
}

export function ChartPick({ game, onDone }: { game: Game; onDone: (results: GameResult[]) => void }) {
  const [deck, setDeck] = useState(game.cards);
  const [results, setResults] = useState<Record<string, boolean>>({});
  const [placed, setPlaced] = useState<RoshniQuestion[]>([]);
  const [miss, setMiss] = useState<ChartForm | null>(null);
  const [right, setRight] = useState(false);
  const card = deck[0];

  if (!card) {
    const n = Object.values(results).filter(Boolean).length;
    return (
      <div className="relative flex flex-col gap-5 py-6">
        <Burst count={36} />
        <StageTitle eyebrow="Forms picked" title={`${n} of ${game.cards.length} right first time`}>Every question, drawn in the form its task needs.</StageTitle>
        <ul className="flex flex-col gap-2">
          {CHART_FORMS.map(f => (
            <li key={f} className="flex flex-col gap-1 rounded-xl bg-secondary p-3">
              <span className="text-md font-bold text-primary">{FORM_LABEL[f]}</span>
              <span className="text-sm text-secondary">{placed.filter(k => chartFor(ROSHNI_QUESTIONS[k]) === f).map(k => ROSHNI_QUESTIONS[k].text).join(' · ')}</span>
            </li>
          ))}
        </ul>
        <NibSays mood={n === game.cards.length ? 'cheer' : 'idle'}>Name the task, then the form follows: bars to compare, a line for many points in time, a histogram for spread, a scatter for two measures. Bars always start at zero.</NibSays>
        <Button size="xl" onPress={() => onDone(game.cards.map(c => ({ id: c.id, correct: !!results[c.id] })))}>Continue the story</Button>
      </div>
    );
  }

  const k = card.visual as RoshniQuestion;
  const q = ROSHNI_QUESTIONS[k];
  const lane = chartFor(q);
  const owner = game.lanes.find(l => l.id === lane)!;
  const done = game.cards.length - deck.length;
  const rows = q.data.kind === 'values' && lane === 'bar' && q.task !== 'trend' ? q.data.values.length : 0;
  const vh = rows ? rows * 22 + 8 : 180;
  const call = (laneId: string) => {
    if (miss || right) return;
    const ok = laneId === lane;
    play(ok ? 'correct' : 'wrong');
    setResults(rs => (card.id in rs ? rs : { ...rs, [card.id]: ok }));
    if (ok) { setRight(true); setPlaced(ps => [...ps, k]); }
    else { setMiss(laneId as ChartForm); setTimeout(() => { setMiss(null); setDeck(dk => [...dk.slice(1), dk[0]]); }, 3600); }
  };
  const next = () => { setRight(false); setDeck(dk => dk.slice(1)); };

  return (
    <div className="flex flex-col gap-5">
      <StageTitle eyebrow="Play" title={game.title}>{game.instructions}</StageTitle>
      <div className="flex items-baseline justify-between">
        <span className="text-sm font-semibold text-tertiary">Questions</span>
        <span className="text-sm font-semibold text-tertiary tabular-nums">{done} / {game.cards.length}</span>
      </div>
      <motion.div key={`${card.id}-${deck.length}`} initial={{ y: 24, opacity: 0 }} animate={miss ? { x: [0, -10, 10, -6, 6, 0], y: 0, opacity: 1 } : { y: 0, opacity: 1 }} transition={miss ? { duration: 0.4 } : springs.pop}
        className={cx('flex flex-col gap-3 rounded-2xl bg-primary p-4 shadow-lg ring-2 ring-inset sm:p-5', miss ? 'ring-error' : right ? 'ring-mint-600' : 'ring-secondary')} data-current-card>
        <p className="text-lg font-semibold text-primary">{card.label}</p>
        <p className="text-sm font-medium text-tertiary">The data: {dataLine(q)}</p>
        <div className="rounded-xl bg-secondary p-3">
          {right ? (
            <motion.svg viewBox={`0 0 320 ${vh}`} className="w-full" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}
              role="img" aria-label={`${FORM_LABEL[lane]} of: ${card.label}`}>
              <FormChart q={q} form={lane} x={4} y={rows ? 4 : 18} w={312} h={rows ? vh - 8 : vh - 40} fs={13} />
            </motion.svg>
          ) : (
            <div className="flex h-32 items-center justify-center text-center text-sm font-semibold text-tertiary">
              {miss ? `${FORM_LABEL[miss]} can’t show ${TASK[q.task]} well here.` : 'Pick a form to draw the data'}
            </div>
          )}
        </div>
        {right && <p className="text-sm font-semibold text-secondary">{scaleLine(q, lane)}</p>}
      </motion.div>
      <div className="grid grid-cols-2 gap-2 md:grid-cols-4" role="group" aria-label="Chart form for this question">
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
        {miss && <NibSays mood="sad">This question is about {TASK[q.task]}, so it needs <strong>{owner.label.toLowerCase()}</strong>. {card.note} It’ll come back round.</NibSays>}
        {right && (
          <div className="flex flex-col gap-3">
            <NibSays mood="cheer">{card.note}</NibSays>
            <div className="flex justify-end"><Button size="lg" onPress={next}>{deck.length > 1 ? 'Next question' : 'See the forms'}</Button></div>
          </div>
        )}
        {!miss && !right && <NibSays mood="think">What does the reader have to do with these numbers: compare things, follow a change over time, see how they spread, or see whether two measures move together?</NibSays>}
      </div>
    </div>
  );
}
