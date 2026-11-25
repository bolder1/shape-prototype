'use client';
// Mini-game for ld.1-1: where does it go? Every card is something that comes up for Nisha in the sprint that builds
// Rasoi's "Pause my meals" (its `visual`, a key of `RASOI_ITEMS`), on the day it comes up. Raise it at stand-up,
// refinement, the review or the retro (`CEREMONIES`, scored by `ceremonyFor`). A right call pins the item to the sprint
// calendar on the day it's raised (`raisedOn`), with how long it waited (`waitDays`); anything that waits for next
// sprint goes in a column beside it. A miss explains and the card comes back later; first call scores. The end compares
// the days blockers kept someone waiting (`blockedDays`) with holding everything for the retro.
import { useState } from 'react';
import { motion } from 'motion/react';
import { CEREMONY_DAY, RASOI_ITEMS, SPRINT_DAYS, blockedDays, ceremonyFor, raisedOn, waitDays, type Ceremony, type Episode, type RasoiItem } from '@shape/content';
import { springs } from '@shape/ui';
import { Button } from '@/components/base/buttons/button';
import { cx } from '@/utils/cx';
import { Burst, NibSays, StageTitle } from '../kit';
import { CEREMONY_SHORT, CEREMONY_TONE } from '../scenes/SprintCadence';
import type { GameResult } from './DiamondSort';
import { play } from '@/lib/sound';

type Game = Episode['game'];
const ALL = Object.values(RASOI_ITEMS);
const AT_RETRO = blockedDays(ALL, () => 'retro');
const SHORT: Record<RasoiItem, string> = {
  cutoff: 'Cut-off rule for Rohan', refund: 'Refund or extend? Karthik', smallphone: 'Calendar cut off on small phones', banner: 'Banner covers Pay',
  swap: 'Swap flow, to size', oneday: 'Most pauses are one day', diwali: 'Diwali pause idea', staging: 'Pausing works on staging',
  wallet: 'Refund in the wallet', kannada: 'Kannada and Hindi copy', dayone: 'Designs arrive on day 1', qalate: 'Design QA after release',
};
const days = (n: number) => `${n} day${n === 1 ? '' : 's'}`;

function Chip({ k, hot }: { k: RasoiItem; hot: boolean }) {
  const c = ceremonyFor(RASOI_ITEMS[k]);
  return (
    <motion.span layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={springs.pop}
      className={cx('flex flex-col rounded-md bg-primary px-1.5 py-1 text-[11px] leading-tight ring-1 ring-inset', hot ? 'ring-mint-600' : 'ring-secondary')}>
      <span className="flex items-center gap-1 font-semibold text-primary"><span className="size-2 shrink-0 rounded-full" style={{ background: CEREMONY_TONE[c] }} aria-hidden />{SHORT[k]}</span>
      <span className="text-tertiary">waited {days(waitDays(RASOI_ITEMS[k]))}</span>
    </motion.span>
  );
}

const MEETS = (d: number) => (Object.keys(CEREMONY_DAY) as Exclude<Ceremony, 'standup'>[]).filter(c => CEREMONY_DAY[c] === d);

function Calendar({ placed, hot }: { placed: RasoiItem[]; hot?: RasoiItem }) {
  const day = (k: RasoiItem) => raisedOn(RASOI_ITEMS[k].day, ceremonyFor(RASOI_ITEMS[k]));
  const later = placed.filter(k => day(k) > SPRINT_DAYS);
  const blocked = blockedDays(placed.map(k => RASOI_ITEMS[k]));
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-baseline justify-between rounded-2xl bg-secondary p-4" role="status">
        <span className="text-sm font-bold text-primary">Days blockers kept someone waiting</span>
        <span className="text-lg font-bold text-primary tabular-nums">{blocked}</span>
      </div>
      <div className="grid grid-cols-5 gap-1.5">
        {Array.from({ length: SPRINT_DAYS }, (_, i) => {
          const d = i + 1;
          const meets = MEETS(d);
          return (
            <div key={d} className="flex min-h-24 flex-col gap-1 rounded-xl bg-secondary p-1.5">
              <span className="flex items-center justify-between text-xs font-bold text-tertiary">
                Day {d}
                <span className="flex gap-0.5" aria-label={['Stand-up', ...meets.map(m => CEREMONY_SHORT[m])].join(', ')}>
                  {(['standup', ...meets] as Ceremony[]).map(m => <span key={m} className="size-2 rounded-full" style={{ background: CEREMONY_TONE[m] }} />)}
                </span>
              </span>
              {placed.filter(k => day(k) === d).map(k => <Chip key={k} k={k} hot={hot === k} />)}
            </div>
          );
        })}
      </div>
      <div className="flex flex-col gap-1.5 rounded-xl bg-secondary p-2">
        <span className="text-xs font-bold text-tertiary">Next sprint</span>
        {later.length === 0 && <span className="text-xs text-quaternary">Nothing waiting yet.</span>}
        {later.map(k => <Chip key={k} k={k} hot={hot === k} />)}
      </div>
    </div>
  );
}

export function CeremonyRoute({ game, onDone }: { game: Game; onDone: (results: GameResult[]) => void }) {
  const [deck, setDeck] = useState(game.cards);
  const [results, setResults] = useState<Record<string, boolean>>({});
  const [placed, setPlaced] = useState<RasoiItem[]>([]);
  const [miss, setMiss] = useState<string | null>(null);
  const [right, setRight] = useState(false);
  const card = deck[0];

  if (!card) {
    const n = Object.values(results).filter(Boolean).length;
    return (
      <div className="relative flex flex-col gap-5 py-6">
        <Burst count={36} />
        <StageTitle eyebrow="Sprint run" title={`${n} of ${game.cards.length} raised in the right place first time`}>
          The four blockers kept someone waiting {days(blockedDays(ALL))} in all. Held for the retro, they’d have cost {days(AT_RETRO)}.
        </StageTitle>
        <Calendar placed={placed} />
        <NibSays mood={n === game.cards.length ? 'cheer' : 'idle'}>Ask who is waiting on it. Someone blocked today: stand-up, or a message now. A story not yet planned: refinement. Something working: show it at the review. How you all work: the retro.</NibSays>
        <Button size="xl" onPress={() => onDone(game.cards.map(c => ({ id: c.id, correct: !!results[c.id] })))}>Continue the story</Button>
      </div>
    );
  }

  const k = card.visual as RasoiItem;
  const it = RASOI_ITEMS[k];
  const lane = ceremonyFor(it);
  const owner = game.lanes.find(l => l.id === lane)!;
  const done = game.cards.length - deck.length;
  const call = (laneId: string) => {
    if (miss || right) return;
    const ok = laneId === lane;
    play(ok ? 'correct' : 'wrong');
    setResults(r => (card.id in r ? r : { ...r, [card.id]: ok }));
    if (ok) { setRight(true); setPlaced(ps => [...ps, k]); }
    else { setMiss(laneId); setTimeout(() => { setMiss(null); setDeck(d => [...d.slice(1), d[0]]); }, 3200); }
  };
  const next = () => { setRight(false); setDeck(d => d.slice(1)); };
  const missWait = miss ? waitDays(it, miss as Ceremony) : 0;

  return (
    <div className="flex flex-col gap-5">
      <StageTitle eyebrow="Play" title={game.title}>{game.instructions}</StageTitle>
      <div className="grid gap-5 md:grid-cols-[1fr_minmax(0,24rem)]">
        <div className="flex flex-col gap-4">
          <div className="flex items-baseline justify-between">
            <span className="text-sm font-semibold text-tertiary">Comes up for Nisha</span>
            <span className="text-sm font-semibold text-tertiary tabular-nums">{done} / {game.cards.length}</span>
          </div>
          <motion.div key={`${card.id}-${deck.length}`} initial={{ y: 24, opacity: 0 }} animate={miss ? { x: [0, -10, 10, -6, 6, 0], y: 0, opacity: 1 } : { y: 0, opacity: 1 }} transition={miss ? { duration: 0.4 } : springs.pop}
            className={cx('flex flex-col gap-2 rounded-2xl bg-primary p-5 shadow-lg ring-2 ring-inset', miss ? 'ring-error' : right ? 'ring-mint-600' : 'ring-secondary')} data-current-card>
            <span className="text-sm font-bold text-tertiary">Day {it.day} of {SPRINT_DAYS}</span>
            <p className="text-lg font-semibold text-primary">{it.text}</p>
          </motion.div>
          <div className="grid grid-cols-2 gap-2" role="group" aria-label="Where to raise it">
            {game.lanes.map(l => (
              <motion.button key={l.id} type="button" onClick={() => call(l.id)} disabled={!!miss || right} whileTap={{ scale: 0.97 }}
                className={cx('flex flex-col items-start gap-0.5 rounded-xl border-2 bg-primary px-3 py-2.5 text-left transition enabled:hover:bg-primary_hover disabled:cursor-default',
                  right && l.id === lane ? 'border-mint-600' : miss === l.id ? 'border-error' : miss && l.id === lane ? 'border-mint-600' : 'border-secondary')}>
                <span className="flex items-center gap-1.5 text-md font-bold text-primary"><span className="size-2.5 rounded-full" style={{ background: CEREMONY_TONE[l.id as Ceremony] }} aria-hidden />{l.label}</span>
                <span className="text-xs font-medium text-tertiary">{l.hint}</span>
              </motion.button>
            ))}
          </div>
          <div className="min-h-14" aria-live="polite">
            {miss && <NibSays mood="sad">Not quite: <strong>{owner.label.toLowerCase()}</strong>{it.about === 'blocking' ? `. Held for ${CEREMONY_SHORT[miss as Ceremony].toLowerCase()}, someone waits ${days(missWait)}` : ''}. {card.note} It’ll come back round.</NibSays>}
            {right && (
              <div className="flex flex-col gap-3">
                <NibSays mood="cheer">{card.note}</NibSays>
                <div className="flex justify-end"><Button size="lg" onPress={next}>{deck.length > 1 ? 'Next' : 'See the sprint'}</Button></div>
              </div>
            )}
            {!miss && !right && <NibSays mood="think">Is someone stuck until it’s answered? Is it about a later story, something working, or how the team works?</NibSays>}
          </div>
        </div>
        <Calendar placed={placed} hot={right ? k : undefined} />
      </div>
    </div>
  );
}
