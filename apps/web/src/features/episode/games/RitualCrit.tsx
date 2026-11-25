'use client';
// Mini-game for ld.3-3: audit the calendar. Every card is a ritual on Kaarigar's design calendar (its `visual`, a key
// of `KAARIGAR_RITUALS`). Keep it, reshape it, make it safe or cut it (`RITUAL_CALLS`, scored by `ritualCall`). Right
// calls rewrite the ritual into the new week with its `fixed` version, and the hours each designer gets back come from
// `ritualMinutes`. First call scores; a missed card comes back later.
import { useState } from 'react';
import { motion } from 'motion/react';
import { KAARIGAR_RITUALS, hoursLabel, ritualCall, ritualMinutes, type Episode, type KaarigarRitual, type RitualCall } from '@shape/content';
import { springs } from '@shape/ui';
import { Button } from '@/components/base/buttons/button';
import { cx } from '@/utils/cx';
import { Burst, NibSays, StageTitle } from '../kit';
import { RITUAL_FILL, RITUAL_LABEL } from '../scenes/RitualWeek';
import type { GameResult } from './DiamondSort';
import { play } from '@/lib/sound';

type Game = Episode['game'];

const WHY: Record<RitualCall, string> = {
  keep: 'It has a reason nothing else covers, it is safe to bring rough work, and a decision or artefact comes out of it.',
  reshape: 'Its reason is good and it is safe, but nothing comes out of it. Give it an output: a decision, a log, an owner.',
  'make-safe': 'It has a purpose, but it punishes showing rough or honest work, so people hold back. Fix that first.',
  cut: 'Its reason has gone, or something else already does its job. No fix makes it worth the time.',
};

/** The two weeks side by side: minutes before, and after the calls made so far. */
function Hours({ decided }: { decided: KaarigarRitual[] }) {
  const all = Object.keys(KAARIGAR_RITUALS) as KaarigarRitual[];
  const total = ritualMinutes(all).before;
  const { before, after } = ritualMinutes(decided);
  const now = total - before + after;
  return (
    <div className="flex flex-col gap-2 rounded-2xl border-2 border-secondary bg-primary p-3" aria-label={`Rituals each week, per designer: ${hoursLabel(total)} before, ${hoursLabel(now)} now`}>
      {([['Before', total], ['Now', now]] as const).map(([l, m]) => (
        <div key={l} className="flex flex-col gap-1">
          <div className="flex items-baseline justify-between text-sm font-semibold"><span className="text-tertiary">{l}</span><span className="tabular-nums text-primary">{hoursLabel(m)} a week</span></div>
          <div className="h-3 overflow-hidden rounded-full bg-secondary">
            <motion.div className="h-full rounded-full" style={{ background: l === 'Now' ? RITUAL_FILL.keep : RITUAL_FILL.cut }} initial={false} animate={{ width: `${(m / total) * 100}%` }} transition={springs.pop} />
          </div>
        </div>
      ))}
    </div>
  );
}

/** The new week: every ritual decided so far, as it is now. */
function NewWeek({ decided }: { decided: KaarigarRitual[] }) {
  if (!decided.length) return null;
  return (
    <ul className="flex flex-col gap-2" aria-label="The week so far">
      {decided.map(k => {
        const r = KAARIGAR_RITUALS[k], c = ritualCall(r);
        return (
          <motion.li key={k} layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={springs.pop}
            className="flex flex-col gap-1 rounded-xl border-2 border-secondary bg-primary p-3" style={{ boxShadow: `inset 4px 0 0 ${RITUAL_FILL[c]}` }}>
            <div className="flex flex-wrap items-center justify-between gap-2 pl-1">
              <span className={cx('text-md font-bold', c === 'cut' ? 'text-tertiary line-through' : 'text-primary')}>{r.short}</span>
              <span className="rounded-md px-2 py-0.5 text-sm font-semibold text-white" style={{ background: RITUAL_FILL[c] }}>{RITUAL_LABEL[c]}</span>
            </div>
            {c !== 'keep' && <span className="pl-1 text-sm text-secondary">{r.fixed}</span>}
          </motion.li>
        );
      })}
    </ul>
  );
}

export function RitualCrit({ game, onDone }: { game: Game; onDone: (results: GameResult[]) => void }) {
  const [deck, setDeck] = useState(game.cards);
  const [results, setResults] = useState<Record<string, boolean>>({});
  const [decided, setDecided] = useState<KaarigarRitual[]>([]);
  const [miss, setMiss] = useState<{ lane: string; why: string } | null>(null);
  const [right, setRight] = useState(false);
  const card = deck[0];

  if (!card) {
    const n = Object.values(results).filter(Boolean).length;
    const { before, after } = ritualMinutes(decided);
    return (
      <div className="relative flex flex-col gap-5 py-6">
        <Burst count={36} />
        <StageTitle eyebrow="Week rebuilt" title={`${n} of ${game.cards.length} right first time`}>
          From {hoursLabel(before)} to {hoursLabel(after)} a week for each designer, and every ritual left has a reason, is safe for rough work, and produces something.
        </StageTitle>
        <Hours decided={decided} />
        <NewWeek decided={decided} />
        <NibSays mood={n === game.cards.length ? 'cheer' : 'idle'}>Culture is what the calendar rewards. Ask the three questions again next quarter.</NibSays>
        <Button size="xl" onPress={() => onDone(game.cards.map(c => ({ id: c.id, correct: !!results[c.id] })))}>Continue the story</Button>
      </div>
    );
  }

  const k = card.visual as KaarigarRitual;
  const r = KAARIGAR_RITUALS[k];
  const lane = ritualCall(r);
  const done = game.cards.length - deck.length;
  const call = (laneId: string) => {
    if (miss || right) return;
    const ok = laneId === lane;
    play(ok ? 'correct' : 'wrong');
    setResults(rs => (card.id in rs ? rs : { ...rs, [card.id]: ok }));
    if (ok) { setRight(true); setDecided(ds => [...ds, k]); }
    else {
      setMiss({ lane: laneId, why: WHY[lane] });
      setTimeout(() => { setMiss(null); setDeck(dk => [...dk.slice(1), dk[0]]); }, 4200);
    }
  };
  const next = () => { setRight(false); setDeck(dk => dk.slice(1)); };

  return (
    <div className="flex flex-col gap-5">
      <StageTitle eyebrow="Play" title={game.title}>{game.instructions}</StageTitle>
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-sm font-semibold text-tertiary">Kaarigar design · the team calendar</span>
        <span className="text-sm font-semibold text-tertiary tabular-nums">{done} / {game.cards.length}</span>
      </div>
      <motion.div key={`${card.id}-${deck.length}`} initial={{ y: 24, opacity: 0 }}
        animate={miss ? { x: [0, -10, 10, -6, 6, 0], y: 0, opacity: 1 } : { y: 0, opacity: 1 }}
        transition={miss ? { duration: 0.4 } : springs.pop}
        className={cx('flex flex-col gap-3 rounded-2xl bg-primary p-4 shadow-lg ring-2 ring-inset sm:p-5', miss ? 'ring-error' : right ? 'ring-mint-600' : 'ring-secondary')} data-current-card>
        <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
          <span className="text-md font-bold text-primary">{r.short}</span>
          <span className="text-sm font-semibold text-tertiary">{r.when}{r.minutes ? ` · ${hoursLabel(r.minutes)} a week each` : ''}</span>
        </div>
        <p className="text-lg font-semibold text-primary">{card.label}</p>
        {right && (
          <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={springs.pop}
            className="rounded-lg bg-secondary px-3 py-2 text-sm font-semibold text-primary" style={{ boxShadow: `inset 3px 0 0 ${RITUAL_FILL[lane]}` }}>
            {r.fixed}
          </motion.p>
        )}
      </motion.div>
      <div className="grid grid-cols-2 gap-2" role="group" aria-label="What to do with this ritual">
        {game.lanes.map(l => (
          <motion.button key={l.id} type="button" onClick={() => call(l.id)} disabled={!!miss || right} whileTap={{ scale: 0.97 }}
            className={cx('flex flex-col items-start gap-0.5 rounded-xl border-2 bg-primary px-3 py-2.5 text-left transition enabled:hover:bg-primary_hover disabled:cursor-default',
              right && l.id === lane ? 'border-mint-600' : miss?.lane === l.id ? 'border-error' : miss && l.id === lane ? 'border-mint-600' : 'border-secondary')}>
            <span className="flex items-center gap-1.5 text-md font-bold text-primary"><span className="size-2.5 shrink-0 rounded-full" style={{ background: RITUAL_FILL[l.id as RitualCall] }} aria-hidden />{l.label}</span>
            <span className="text-xs font-medium text-tertiary">{l.hint}</span>
          </motion.button>
        ))}
      </div>
      <div className="min-h-14" aria-live="polite">
        {miss && <NibSays mood="sad">{miss.why} {card.note} It’ll come back round.</NibSays>}
        {right && (
          <div className="flex flex-col gap-3">
            <NibSays mood="cheer">{card.note}</NibSays>
            <div className="flex justify-end"><Button size="lg" onPress={next}>{deck.length > 1 ? 'Next ritual' : 'See the new week'}</Button></div>
          </div>
        )}
        {!miss && !right && <NibSays mood="think">Is there still a reason for it? Is it safe to bring rough work? Does anything come out of it?</NibSays>}
      </div>
      <Hours decided={decided} />
      <NewWeek decided={decided} />
    </div>
  );
}
