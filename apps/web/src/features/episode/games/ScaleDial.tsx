'use client';
// Mini-game for ia.5-3: size Nabz's screens now that they carry thousands. Every card is a screen (its `visual`, a key
// of `NABZ_TASKS`): who uses it, what they're trying to do, and how many items it holds. A dial counts up to the real
// size on a log scale marked where show-all (`SHOW_ALL_MAX`) and a list (`SCALE_LIST_MAX`) stop working. Choose the
// pattern (`SCALE_PATTERNS`, scored by `scalePattern`); the game draws the screen in the pattern you picked at that
// size, and a wrong pick shows how it strains (a plain list costs `scrollScreens`). A miss explains and the card comes
// back later; first call scores.
import { useEffect, useState } from 'react';
import { animate, motion, useMotionValue, useTransform } from 'motion/react';
import { NABZ_TASKS, SCALE_LIST_MAX, SHOW_ALL_MAX, scalePattern, scrollScreens, type Episode, type NabzTask, type ScalePattern, type ScaleTask } from '@shape/content';
import { springs } from '@shape/ui';
import { Button } from '@/components/base/buttons/button';
import { cx } from '@/utils/cx';
import { Burst, NibSays, StageTitle } from '../kit';
import { PATTERN_LABEL, PATTERN_TONE } from '../scenes/ScaleUp';
import type { GameResult } from './DiamondSort';
import { play } from '@/lib/sound';

type Game = Episode['game'];
const MAX = 10_000;
const fmt = (n: number) => n.toLocaleString('en-IN');
/** Position on the dial, 0–100, on a log scale from 1 to 10,000. */
const dial = (n: number) => (Math.log10(Math.max(1, n)) / Math.log10(MAX)) * 100;
const JOB = { pick: 'Picking one', watch: 'Watching for the few that need them', act: 'Acting on many at once' } as const;

/** How a pattern strains on a job it doesn't fit (null when it fits). */
function strain(pattern: ScalePattern, t: ScaleTask): string | null {
  if (pattern === scalePattern(t)) return null;
  if (pattern === 'all') return t.count > SHOW_ALL_MAX ? `${fmt(t.count)} chips at once: too many to compare, and most fall off the screen.` : 'Chips are for picking one; this job needs to see the whole set in order.';
  if (pattern === 'list') return t.count > SCALE_LIST_MAX ? `${fmt(scrollScreens(t.count))} screens of scrolling. The scrolling becomes the work.` : 'A list hides a handful people could compare side by side.';
  if (pattern === 'search') return t.job !== 'pick' ? 'Search finds what you can name. Here the person doesn’t know which items need them yet.' : `Typing to find one of ${fmt(t.count)} they could simply see.`;
  return t.job === 'pick' ? 'Nothing to watch or act on: they need to pick one.' : `Counts and rules for ${fmt(t.count)} items is more machinery than the job needs.`;
}

function CountUp({ to }: { to: number }) {
  const v = useMotionValue(1);
  const text = useTransform(v, x => fmt(Math.round(x)));
  useEffect(() => { const c = animate(v, to, { duration: 1.1, ease: 'easeOut' }); return () => c.stop(); }, [to, v]);
  return <motion.span>{text}</motion.span>;
}

/** The screen, drawn in `pattern` at the task's size. */
function Mock({ pattern, task, bad }: { pattern: ScalePattern; task: ScaleTask; bad: boolean }) {
  const n = task.count;
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={springs.pop}
      className={cx('flex flex-col gap-2 rounded-xl bg-primary p-3 ring-2 ring-inset', bad ? 'ring-error' : 'ring-secondary')} aria-label={`${PATTERN_LABEL[pattern]}, ${fmt(n)} items`}>
      <span className="flex items-center gap-1.5 text-xs font-bold tracking-wide text-tertiary uppercase"><span className="size-2 rounded-full" style={{ background: PATTERN_TONE[pattern] }} aria-hidden />{PATTERN_LABEL[pattern]}</span>
      {pattern === 'all' && (
        <div className="flex flex-wrap gap-1.5" aria-hidden>
          {Array.from({ length: Math.min(n, 14) }, (_, i) => <span key={i} className={cx('h-8 w-14 rounded-full ring-1 ring-secondary ring-inset', i === 0 ? 'bg-secondary' : 'bg-primary')} />)}
          {n > 14 && <span className="flex h-8 items-center px-2 text-sm font-semibold text-error-primary">+{fmt(n - 14)} more</span>}
        </div>
      )}
      {pattern === 'list' && (
        <div className="flex flex-col gap-1" aria-hidden>
          {Array.from({ length: Math.min(n, 5) }, (_, i) => <span key={i} className="flex h-7 items-center gap-2 rounded-md bg-secondary px-2"><span className="size-3 rounded-sm ring-1 ring-primary ring-inset" /><span className="h-2 rounded-full bg-quaternary" style={{ width: `${40 + ((i * 17) % 40)}%` }} /></span>)}
          <span className={cx('text-xs font-semibold', n > SCALE_LIST_MAX ? 'text-error-primary' : 'text-tertiary')}>Screen 1 of {fmt(scrollScreens(n))}</span>
        </div>
      )}
      {pattern === 'search' && (
        <div className="flex flex-col gap-1.5" aria-hidden>
          <span className="flex h-9 items-center rounded-full bg-secondary px-3 text-sm text-tertiary">Search {fmt(n)}…</span>
          <span className="flex gap-1.5">{['Filter', 'Filter', 'Filter'].map((f, i) => <span key={i} className="rounded-full px-2.5 py-0.5 text-xs font-semibold text-tertiary ring-1 ring-secondary ring-inset">{f}</span>)}</span>
          {[0, 1, 2].map(i => <span key={i} className="h-6 rounded-md bg-secondary" />)}
        </div>
      )}
      {pattern === 'rules' && (
        <div className="flex flex-col gap-1.5" aria-hidden>
          <span className="grid grid-cols-3 gap-1.5">{['On track', 'Done', 'Needs you'].map((l, i) => <span key={l} className={cx('flex flex-col rounded-lg bg-secondary px-2 py-1', i === 2 && 'ring-2 ring-error ring-inset')}><span className="text-[11px] font-semibold text-tertiary">{l}</span><span className="h-3 w-8 rounded bg-quaternary" /></span>)}</span>
          {[0, 1].map(i => <span key={i} className="h-6 rounded-md bg-secondary" />)}
          <span className="self-start rounded-full px-2.5 py-0.5 text-xs font-semibold text-secondary ring-1 ring-secondary ring-inset">Act on a rule</span>
        </div>
      )}
      {bad && <p className="text-sm font-semibold text-error-primary">{strain(pattern, task)}</p>}
    </motion.div>
  );
}

export function ScaleDial({ game, onDone }: { game: Game; onDone: (results: GameResult[]) => void }) {
  const [deck, setDeck] = useState(game.cards);
  const [results, setResults] = useState<Record<string, boolean>>({});
  const [sized, setSized] = useState<NabzTask[]>([]);
  const [miss, setMiss] = useState<string | null>(null);
  const [right, setRight] = useState(false);
  const card = deck[0];

  if (!card) {
    const n = Object.values(results).filter(Boolean).length;
    const sorted = [...sized].sort((a, b) => NABZ_TASKS[a].count - NABZ_TASKS[b].count);
    return (
      <div className="relative flex flex-col gap-5 py-6">
        <Burst count={36} />
        <StageTitle eyebrow="Screens sized" title={`${n} of ${game.cards.length} sized first time`}>From five slots to nine thousand samples, smallest first.</StageTitle>
        <ul className="flex flex-col gap-1.5 rounded-2xl bg-secondary p-3">
          {sorted.map(k => {
            const t = NABZ_TASKS[k], pat = scalePattern(t);
            return (
              <li key={k} className="flex items-center gap-3">
                <span className="w-14 shrink-0 text-right text-sm font-bold text-primary tabular-nums">{fmt(t.count)}</span>
                <span className="relative h-6 flex-1 overflow-hidden rounded-md bg-primary">
                  <motion.span initial={{ width: 0 }} animate={{ width: `${Math.max(4, dial(t.count))}%` }} transition={{ duration: 0.8, ease: 'easeOut' }} className="absolute inset-y-0 left-0 rounded-md opacity-40" style={{ background: PATTERN_TONE[pat] }} />
                  <span className="relative flex h-full items-center px-2 text-xs font-semibold text-primary">{t.text}</span>
                </span>
                <span className="hidden w-40 shrink-0 text-xs font-semibold text-secondary sm:block">{PATTERN_LABEL[pat]}</span>
              </li>
            );
          })}
        </ul>
        <NibSays mood={n === game.cards.length ? 'cheer' : 'idle'}>Know the number and the job before you pick a pattern. Picking: show about {SHOW_ALL_MAX}, list a few dozen, search past {SCALE_LIST_MAX}. Watching or acting on more than that: counts, the exceptions, and rules with a preview.</NibSays>
        <Button size="xl" onPress={() => onDone(game.cards.map(c => ({ id: c.id, correct: !!results[c.id] })))}>Continue the story</Button>
      </div>
    );
  }

  const k = card.visual as NabzTask;
  const task = NABZ_TASKS[k];
  const lane = scalePattern(task);
  const owner = game.lanes.find(l => l.id === lane)!;
  const done = game.cards.length - deck.length;
  const call = (laneId: string) => {
    if (miss || right) return;
    const ok = laneId === lane;
    play(ok ? 'correct' : 'wrong');
    setResults(rs => (card.id in rs ? rs : { ...rs, [card.id]: ok }));
    if (ok) { setRight(true); setSized(ss => [...ss, k]); }
    else { setMiss(laneId); setTimeout(() => { setMiss(null); setDeck(dk => [...dk.slice(1), dk[0]]); }, 3600); }
  };
  const next = () => { setRight(false); setDeck(dk => dk.slice(1)); };

  return (
    <div className="flex flex-col gap-5">
      <StageTitle eyebrow="Play" title={game.title}>{game.instructions}</StageTitle>
      <div className="flex items-baseline justify-between">
        <span className="text-sm font-semibold text-tertiary">Screens to size</span>
        <span className="text-sm font-semibold text-tertiary tabular-nums">{done} / {game.cards.length}</span>
      </div>
      <motion.div key={`${card.id}-${deck.length}`} initial={{ y: 24, opacity: 0 }} animate={miss ? { x: [0, -10, 10, -6, 6, 0], y: 0, opacity: 1 } : { y: 0, opacity: 1 }} transition={miss ? { duration: 0.4 } : springs.pop}
        className={cx('flex flex-col gap-4 rounded-2xl bg-primary p-5 shadow-lg ring-2 ring-inset', miss ? 'ring-error' : right ? 'ring-mint-600' : 'ring-secondary')} data-current-card>
        <div className="flex flex-col gap-1">
          <span className="text-xs font-bold tracking-wide text-tertiary uppercase">{task.who} · {JOB[task.job]}</span>
          <p className="text-lg font-semibold text-primary">{card.label}</p>
        </div>
        <div className="flex flex-col gap-1.5" role="img" aria-label={`${fmt(task.count)} items`}>
          <span className="text-display-xs font-bold text-primary tabular-nums"><CountUp to={task.count} /> <span className="text-md font-semibold text-tertiary">items</span></span>
          <div className="relative h-3 rounded-full bg-secondary">
            <motion.span initial={{ width: 0 }} animate={{ width: `${dial(task.count)}%` }} transition={{ duration: 1.1, ease: 'easeOut' }} className="absolute inset-y-0 left-0 rounded-full bg-quaternary" />
            {[SHOW_ALL_MAX, SCALE_LIST_MAX].map(m => <span key={m} className="absolute -inset-y-1 w-0.5 rounded bg-fg-quaternary" style={{ left: `${dial(m)}%` }} />)}
          </div>
          <div className="relative h-4 text-xs font-semibold text-tertiary">
            {[1, SHOW_ALL_MAX, SCALE_LIST_MAX, 1000, MAX].map(m => <span key={m} className="absolute -translate-x-1/2 tabular-nums first:translate-x-0 last:-translate-x-full" style={{ left: `${dial(m)}%` }}>{fmt(m)}</span>)}
          </div>
        </div>
        {(right || miss) && <Mock pattern={(right ? lane : miss) as ScalePattern} task={task} bad={!right} />}
      </motion.div>
      <div className="grid grid-cols-2 gap-2 md:grid-cols-4" role="group" aria-label="Pattern for this screen">
        {game.lanes.map(l => (
          <motion.button key={l.id} type="button" onClick={() => call(l.id)} disabled={!!miss || right} whileTap={{ scale: 0.97 }}
            className={cx('flex flex-col items-start gap-0.5 rounded-xl border-2 bg-primary px-3 py-2.5 text-left transition enabled:hover:bg-primary_hover disabled:cursor-default',
              right && l.id === lane ? 'border-mint-600' : miss === l.id ? 'border-error' : miss && l.id === lane ? 'border-mint-600' : 'border-secondary')}>
            <span className="flex items-center gap-1.5 text-md font-bold text-primary"><span className="size-2.5 rounded-full" style={{ background: PATTERN_TONE[l.id as ScalePattern] }} aria-hidden />{l.label}</span>
            <span className="text-xs font-medium text-tertiary">{l.hint}</span>
          </motion.button>
        ))}
      </div>
      <div className="min-h-14" aria-live="polite">
        {miss && <NibSays mood="sad">Not quite: <strong>{owner.label.toLowerCase()}</strong>. {card.note} It’ll come back round.</NibSays>}
        {right && (
          <div className="flex flex-col gap-3">
            <NibSays mood="cheer">{card.note}</NibSays>
            <div className="flex justify-end"><Button size="lg" onPress={next}>{deck.length > 1 ? 'Next screen' : 'See them all'}</Button></div>
          </div>
        )}
        {!miss && !right && <NibSays mood="think">Two questions: how many items, really? And is the person picking one, watching for a few, or acting on many?</NibSays>}
      </div>
    </div>
  );
}
