'use client';
// Mini-game for rs.5-3: Through the gates. Each card is a number from Bolo's dashboard (its `visual`, a key of
// `BOLO_SIGNALS`), with what changed in its tracking this week and, where Rehan has one, the same rate split by a
// slice (`segmentChanges`, read by `segmentStory`). The gates are drawn as a flow (`GATES`): stop the card at the
// first gate it fails, or let it through to act (scored by `signalGate`). A right call runs the card's token along
// the flow to its gate; a miss explains and the card comes back later. First call scores.
import { useState } from 'react';
import { motion } from 'motion/react';
import { BOLO_SIGNALS, GATES, SIGNAL_ALPHA, segmentChanges, segmentStory, signalGate, type BoloSignal, type Episode, type Gate } from '@shape/content';
import { springs } from '@shape/ui';
import { Button } from '@/components/base/buttons/button';
import { cx } from '@/utils/cx';
import { Burst, NibSays, StageTitle } from '../kit';
import type { GameResult } from './DiamondSort';
import { play } from '@/lib/sound';

type Game = Episode['game'];
/** The question each gate asks, in flow order (the last is where a card that passes them all ends up). */
const ASK: Record<Gate, string> = { instrument: 'Does it still mean what it did?', segment: 'Does one slice, or the mix, explain it?', ask: 'Does the data answer the question?', act: 'Through every gate' };
/** White text on each passes 4.5:1. */
export const GATE_FILL: Record<Gate, string> = { instrument: '#B42318', segment: 'var(--color-family-design-solid)', ask: 'var(--color-family-grow-solid)', act: '#067647' };
const pc = (x: number) => `${(x * 100).toFixed(1)}%`;
const n = (x: number) => x.toLocaleString('en-IN');

function Split({ k }: { k: BoloSignal }) {
  const s = BOLO_SIGNALS[k];
  if (!s.segments) return null;
  const { overall, slices } = segmentChanges(s.segments);
  return (
    <table className="w-full text-left text-sm tabular-nums">
      <caption className="pb-1 text-left text-xs font-semibold text-tertiary">{s.metric}, split</caption>
      <thead><tr className="text-xs text-tertiary"><th className="font-semibold">Slice</th><th className="font-semibold">Before</th><th className="font-semibold">After</th><th className="font-semibold">People after</th></tr></thead>
      <tbody>
        {slices.map((sl, i) => (
          <tr key={sl.name} className="border-t border-secondary">
            <td className="py-1 font-semibold text-primary">{sl.name}</td>
            <td className="text-secondary">{pc(sl.pa)}</td>
            <td className={cx(sl.p < SIGNAL_ALPHA ? 'font-bold text-primary' : 'text-secondary')}>{pc(sl.pb)}</td>
            <td className="text-tertiary">{n(s.segments![i].after.n)}</td>
          </tr>
        ))}
        <tr className="border-t-2 border-secondary"><td className="py-1 font-semibold text-primary">Everyone</td><td className="text-secondary">{pc(overall.pa)}</td><td className="font-bold text-primary">{pc(overall.pb)}</td><td className="text-tertiary">{n(s.segments.reduce((t, g) => t + g.after.n, 0))}</td></tr>
      </tbody>
    </table>
  );
}

function Flow({ lanes, stop, pick, disabled, wrong }: { lanes: Game['lanes']; stop: Gate | null; pick: (g: Gate) => void; disabled: boolean; wrong: Gate | null }) {
  const at = stop ? GATES.indexOf(stop) : -1;
  return (
    <div className="relative">
      <div className="absolute top-[1.625rem] right-[12.5%] left-[12.5%] h-1 rounded-full bg-secondary" aria-hidden />
      {at >= 0 && <motion.div className="absolute top-[1.625rem] left-[12.5%] h-1 rounded-full bg-brand-solid" initial={{ width: 0 }} animate={{ width: `${(at / (GATES.length - 1)) * 75}%` }} transition={{ duration: 0.6 }} aria-hidden />}
      <ol className="relative grid grid-cols-4 gap-2" aria-label="The gates">
        {GATES.map((g, i) => {
          const l = lanes.find(x => x.id === g)!;
          return (
            <li key={g}>
              <motion.button type="button" onClick={() => pick(g)} disabled={disabled} whileTap={{ scale: 0.96 }}
                className={cx('flex w-full flex-col items-center gap-1.5 rounded-xl px-1 py-1 text-center transition enabled:hover:bg-primary_hover disabled:cursor-default')}>
                <motion.span animate={at === i ? { scale: [1, 1.25, 1] } : { scale: 1 }} transition={{ delay: 0.5, duration: 0.4 }}
                  className={cx('grid size-12 place-items-center rounded-full border-4 bg-primary text-md font-bold text-primary', wrong === g ? 'border-error' : at === i ? 'border-mint-600' : 'border-secondary')}
                  style={at === i ? { background: GATE_FILL[g], color: '#fff' } : undefined}>{i < 3 ? i + 1 : '✓'}</motion.span>
                <span className="text-sm font-bold text-primary">{l.label}</span>
                <span className="text-xs font-medium text-tertiary">{ASK[g]}</span>
              </motion.button>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

export function SignalGate({ game, onDone }: { game: Game; onDone: (results: GameResult[]) => void }) {
  const [deck, setDeck] = useState(game.cards);
  const [results, setResults] = useState<Record<string, boolean>>({});
  const [miss, setMiss] = useState<Gate | null>(null);
  const [right, setRight] = useState(false);
  const card = deck[0];

  if (!card) {
    const got = Object.values(results).filter(Boolean).length;
    const by = Object.fromEntries(GATES.map(g => [g, game.cards.filter(c => c.lane === g).length])) as Record<Gate, number>;
    return (
      <div className="relative flex flex-col gap-5 py-6">
        <Burst count={36} />
        <StageTitle eyebrow="Dashboard read" title={`${got} of ${game.cards.length} stopped at the right gate`}>
          {by.instrument} numbers needed their tracking fixed, {by.segment} were explained by one slice or the mix, {by.ask} needed someone to ask why, and {by.act} answered their own question.
        </StageTitle>
        <NibSays mood={got === game.cards.length ? 'cheer' : 'idle'}>Half of Bolo’s numbers would have sent the team the wrong way if they’d been explained straight off the chart. Measurement, then mix, then meaning.</NibSays>
        <Button size="xl" onPress={() => onDone(game.cards.map(c => ({ id: c.id, correct: !!results[c.id] })))}>Continue the story</Button>
      </div>
    );
  }

  const k = card.visual as BoloSignal;
  const s = BOLO_SIGNALS[k];
  const gate = signalGate(s), owner = game.lanes.find(l => l.id === gate)!;
  const story = segmentStory(s.segments);
  const done = game.cards.length - deck.length;
  const pick = (g: Gate) => {
    if (miss || right) return;
    const ok = g === gate;
    play(ok ? 'correct' : 'wrong');
    setResults(r => (card.id in r ? r : { ...r, [card.id]: ok }));
    if (ok) setRight(true);
    else { setMiss(g); setTimeout(() => { setMiss(null); setDeck(dk => [...dk.slice(1), dk[0]]); }, 3400); }
  };
  const next = () => { setRight(false); setDeck(dk => dk.slice(1)); };
  const moved = s.segments ? segmentChanges(s.segments).slices.filter(x => x.p < SIGNAL_ALPHA).map(x => x.name) : [];

  return (
    <div className="flex flex-col gap-5">
      <StageTitle eyebrow="Play" title={game.title}>{game.instructions}</StageTitle>
      <div className="flex items-baseline justify-between">
        <span className="text-sm font-semibold text-tertiary">Bolo dashboard · {s.metric}</span>
        <span className="text-sm font-semibold text-tertiary tabular-nums">{done} / {game.cards.length}</span>
      </div>
      <motion.div key={`${card.id}-${deck.length}`} initial={{ y: 20, opacity: 0 }} animate={miss ? { x: [0, -8, 8, -5, 5, 0], y: 0, opacity: 1 } : { y: 0, opacity: 1 }} transition={miss ? { duration: 0.4 } : springs.pop}
        className={cx('flex flex-col gap-3 rounded-2xl bg-primary p-4 shadow-lg ring-2 ring-inset', miss ? 'ring-error' : right ? 'ring-mint-600' : 'ring-secondary')} data-current-card>
        <p className="text-lg font-semibold text-primary">{card.label}</p>
        <p className="rounded-lg bg-secondary px-3 py-2 text-sm text-secondary"><span className="font-semibold text-primary">Tracking this week: </span>{s.broken ?? 'No change to how this is counted.'}</p>
        <Split k={k} />
      </motion.div>
      <Flow lanes={game.lanes} stop={right ? gate : null} pick={pick} disabled={!!miss || right} wrong={miss} />
      <div className="min-h-14" aria-live="polite">
        {miss && <NibSays mood="sad">Not quite: <strong>{owner.label.toLowerCase()}</strong>. {card.note} It’ll come back round.</NibSays>}
        {right && (
          <div className="flex flex-col gap-3">
            {story && <span className="self-start rounded-full px-2.5 py-0.5 text-xs font-bold text-white" style={{ background: GATE_FILL.segment }}>{story === 'mix' ? 'Every slice flat: the mix moved' : `Only ${moved[0]} moved`}</span>}
            <NibSays mood="cheer">{card.note}</NibSays>
            <div className="flex justify-end"><Button size="lg" onPress={next}>{deck.length > 1 ? 'Next number' : 'See the dashboard'}</Button></div>
          </div>
        )}
        {!miss && !right && <NibSays mood="think">Start at gate 1. Did the way it’s counted change? If not, does one slice, or a change in who the users are, explain it? If not, is the question a what, or a why?</NibSays>}
      </div>
    </div>
  );
}
