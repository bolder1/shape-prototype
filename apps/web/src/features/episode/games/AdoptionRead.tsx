'use client';
// Mini-game for ds.4-3: read each squad's scan. Every card is a squad (its `visual`, a key of `RASTA_SCANS`), drawn as
// 100 cells (`Waffle`, from `waffle`). First estimate the share of live system components by eye (graded by
// `shareGrade` against `systemShare`), then the full scan opens (coverage, version lag, detach rate, local share,
// against `ADOPTION_LIMITS`) and the player diagnoses it (`ADOPTION_READS`, scored by `adoptionRead`). The diagnosis
// scores; estimates are tallied at the end, beside the company-wide numbers the slide should have shown.
import { useState } from 'react';
import { motion } from 'motion/react';
import {
  ADOPTION_LIMITS, RASTA_REPOS, RASTA_SCANS, SCAN_KINDS, adoptionRead, currentShare, overallShare, scanTotal, shareGrade, systemShare,
  type AdoptionRead as Read, type Episode, type RastaScan, type SquadScan,
} from '@shape/content';
import { springs } from '@shape/ui';
import { Button } from '@/components/base/buttons/button';
import { cx } from '@/utils/cx';
import { Burst, NibSays, StageTitle } from '../kit';
import { SCAN_FILL, SCAN_LABEL, Waffle } from '../scenes/AdoptionSignals';
import { Tune } from './MeasureTune';
import type { GameResult } from './DiamondSort';
import { play } from '@/lib/sound';

type Game = Episode['game'];
type Grade = ReturnType<typeof shareGrade>;
const GRADE: Record<Grade, string> = { spot: 'Spot on', close: 'Close', off: 'Off' };
/** One fill per diagnosis; white text on each passes 4.5:1. */
const READ_FILL: Record<Read, string> = { healthy: '#067647', stale: '#B54708', detaching: '#6941C6', bypassing: '#475467' };
const pc = (x: number) => `${Math.round(x * 100)}%`;

/** The four signals for a scan, each against the line where it changes the diagnosis. */
function Signals({ s }: { s: SquadScan }) {
  const rows = [
    { l: 'Coverage: live system instances', v: systemShare(s), line: null },
    { l: 'Squad’s own components', v: s.local / scanTotal(s), line: ADOPTION_LIMITS.local },
    { l: 'Detached, of what came from the system', v: s.detached / (s.current + s.old + s.detached), line: ADOPTION_LIMITS.detached },
    { l: 'On the old major, of live system', v: s.old / (s.current + s.old), line: ADOPTION_LIMITS.old },
  ];
  return (
    <ul className="flex flex-col gap-2">
      {rows.map((r, i) => {
        const high = r.line !== null && r.v >= r.line;
        return (
          <motion.li key={r.l} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ ...springs.pop, delay: i * 0.08 }} className="flex flex-col gap-1">
            <div className="flex items-baseline justify-between gap-2 text-sm">
              <span className="text-secondary">{r.l}</span>
              <span className={cx('font-semibold tabular-nums', high ? 'text-error-primary' : 'text-primary')}>{pc(r.v)}</span>
            </div>
            <div className="relative h-2 w-full rounded-full bg-secondary" aria-hidden>
              <div className={cx('h-full rounded-full', high ? 'bg-error-solid' : 'bg-brand-solid')} style={{ width: `${r.v * 100}%` }} />
              {r.line !== null && <div className="absolute -top-1 h-4 w-0.5 bg-fg-primary" style={{ left: `${r.line * 100}%` }} />}
            </div>
          </motion.li>
        );
      })}
    </ul>
  );
}

export function AdoptionRead({ game, onDone }: { game: Game; onDone: (results: GameResult[]) => void }) {
  const [i, setI] = useState(0);
  const [guess, setGuess] = useState(50);
  const [grade, setGrade] = useState<Grade | null>(null);
  const [picked, setPicked] = useState<Read | null>(null);
  const [log, setLog] = useState<Record<string, { grade: Grade; right: boolean }>>({});
  const card = game.cards[i];

  if (!card) {
    const right = Object.values(log).filter(l => l.right).length, near = Object.values(log).filter(l => l.grade !== 'off').length;
    const all = Object.values(RASTA_SCANS);
    return (
      <div className="relative flex flex-col gap-5 py-6">
        <Burst count={36} />
        <StageTitle eyebrow="Scans read" title={`${right} of ${game.cards.length} diagnosed right`}>
          {near} of your estimates were within 12 points. Across all nine squads, the numbers the slide should have shown:
        </StageTitle>
        <dl className="grid grid-cols-3 gap-2">
          {[{ l: 'Repos install it', v: RASTA_REPOS.installed / RASTA_REPOS.total }, { l: 'Live system instances', v: overallShare(all) }, { l: 'On the current major', v: currentShare(all) }].map(x => (
            <div key={x.l} className="flex flex-col gap-0.5 rounded-xl bg-secondary px-3 py-2">
              <dd className="text-display-xs font-bold text-primary tabular-nums">{pc(x.v)}</dd>
              <dt className="text-xs font-semibold text-tertiary">{x.l}</dt>
            </div>
          ))}
        </dl>
        <NibSays mood={right >= game.cards.length - 1 ? 'cheer' : 'idle'}>Coverage starts the story. Version lag, detaches and local share finish it, and each diagnosis points to a different next step.</NibSays>
        <Button size="xl" onPress={() => onDone(game.cards.map(c => ({ id: c.id, correct: !!log[c.id]?.right })))}>Continue the story</Button>
      </div>
    );
  }

  const s = RASTA_SCANS[card.visual as RastaScan];
  const truth = Math.round(systemShare(s) * 100);
  const read = adoptionRead(s), lane = game.lanes.find(l => l.id === read)!;
  const lock = () => { const g = shareGrade(guess, truth); play(g === 'off' ? 'wrong' : 'tap'); setGrade(g); };
  const choose = (r: Read) => {
    if (picked || !grade) return;
    const ok = r === read;
    play(ok ? 'correct' : 'wrong');
    setPicked(r);
    setLog(l => ({ ...l, [card.id]: { grade, right: ok } }));
  };
  const next = () => { setI(x => x + 1); setGuess(50); setGrade(null); setPicked(null); };

  return (
    <div className="flex flex-col gap-5">
      <StageTitle eyebrow="Play" title={game.title}>{game.instructions}</StageTitle>
      <div className="flex items-baseline justify-between">
        <span className="text-sm font-semibold text-tertiary">{scanTotal(s).toLocaleString('en-IN')} instances</span>
        <span className="text-sm font-semibold text-tertiary tabular-nums">{i} / {game.cards.length}</span>
      </div>
      <motion.div key={card.id} initial={{ y: -14, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={springs.pop}
        className="flex flex-col gap-3 rounded-2xl bg-primary p-4 shadow-lg ring-2 ring-secondary ring-inset" data-current-card>
        <p className="text-lg font-semibold text-primary">{card.label}</p>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
          <svg viewBox="0 0 200 200" className="mx-auto w-44 shrink-0 sm:mx-0" role="img"
            aria-label={`${SCAN_KINDS.map(k => `${SCAN_LABEL[k]} ${pc(s[k] / scanTotal(s))}`).join(', ')}`}>
            <Waffle s={s} x={0} y={0} size={200} />
          </svg>
          <ul className="grid grid-cols-2 gap-x-3 gap-y-1.5 sm:grid-cols-1">
            {SCAN_KINDS.map(k => (
              <li key={k} className="flex items-center gap-2 text-sm text-secondary">
                <span className="size-3 shrink-0 rounded-sm" style={{ background: SCAN_FILL[k] }} aria-hidden />{SCAN_LABEL[k]}
                {grade && <span className="ml-auto font-semibold text-primary tabular-nums">{pc(s[k] / scanTotal(s))}</span>}
              </li>
            ))}
          </ul>
        </div>
      </motion.div>

      <div className="flex flex-col gap-4 rounded-2xl bg-primary p-4 ring-1 ring-secondary ring-inset">
        {!grade ? (
          <>
            <Tune label="Live system components, both blues" value={guess} min={0} max={100} step={1} ok={false} fmt={v => `${v}%`} onChange={setGuess} />
            <div className="flex justify-end"><Button size="lg" onPress={lock}>Lock it in</Button></div>
          </>
        ) : (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={springs.pop} className="flex flex-col gap-3">
            <p className="text-sm text-secondary tabular-nums"><span className="font-semibold text-primary">{GRADE[grade]}:</span> you said {guess}%; it’s {truth}%. Now the full scan:</p>
            <Signals s={s} />
            <div className="grid grid-cols-2 gap-2" role="group" aria-label="Diagnosis for this squad">
              {game.lanes.map(l => (
                <motion.button key={l.id} type="button" onClick={() => choose(l.id as Read)} disabled={!!picked} whileTap={{ scale: 0.97 }}
                  className={cx('flex flex-col items-start gap-0.5 rounded-xl border-2 bg-primary px-3 py-2.5 text-left transition enabled:hover:bg-primary_hover disabled:cursor-default',
                    picked && l.id === read ? 'border-mint-600' : picked === l.id ? 'border-error' : 'border-secondary')}>
                  <span className="flex items-center gap-1.5 text-md font-bold text-primary"><span className="size-2.5 shrink-0 rounded-full" style={{ background: READ_FILL[l.id as Read] }} aria-hidden />{l.label}</span>
                  <span className="text-xs font-medium text-tertiary">{l.hint}</span>
                </motion.button>
              ))}
            </div>
            <div aria-live="polite" className="flex flex-col gap-3">
              {picked && (
                <>
                  <span className="w-fit rounded-full px-2.5 py-0.5 text-xs font-bold text-white" style={{ background: READ_FILL[read] }}>{lane.label}</span>
                  <NibSays mood={picked === read ? 'cheer' : 'think'}>{picked === read ? '' : 'Not quite. '}{card.note}</NibSays>
                  <div className="flex justify-end"><Button size="lg" onPress={next}>{i < game.cards.length - 1 ? 'Next squad' : 'See the whole picture'}</Button></div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
