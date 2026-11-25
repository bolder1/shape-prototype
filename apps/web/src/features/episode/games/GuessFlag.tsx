'use client';
// Mini-game for dc.3-2: flag the AI's guesses. Every card is a field the AI read off Shree Ganesh Distributors' bill
// (its `visual`, a key of `HISAAB_FIELDS`), shown as a crop of the paper with the read value, a confidence meter and
// what a mistake would cost. Fill it in, highlight it for Ramesh to check, or leave it blank and ask
// (`FIELD_TREATMENTS`, scored by `fieldTreatment`). Placed fields build the review screen on a phone beside it. A miss
// explains and the card comes back later; first call scores. The end compares the first draft with the learner's
// screen: wrong values that reach the khata (`slipped`) and fields to check (`reviewLoad`).
import { useState } from 'react';
import { motion } from 'motion/react';
import { ASK_BELOW, AUTO_ABOVE, DRAFT_TREATMENT, HISAAB_FIELDS, failsCheck, fieldTreatment, reviewLoad, slipped, type Episode, type FieldTreatment, type HisaabField } from '@shape/content';
import { springs } from '@shape/ui';
import { Button } from '@/components/base/buttons/button';
import { cx } from '@/utils/cx';
import { Burst, NibSays, StageTitle } from '../kit';
import { TREAT_TONE } from '../scenes/BillScan';
import type { GameResult } from './DiamondSort';
import { play } from '@/lib/sound';

type Game = Episode['game'];
const KEYS = Object.keys(HISAAB_FIELDS) as HisaabField[];
const STAKES = { money: 'Money: reaches balances and GST', record: 'Record: reaches GST credit', label: 'Label: one tap to fix later' } as const;

function Review({ placed, hot }: { placed: HisaabField[]; hot?: HisaabField }) {
  return (
    <div className="flex flex-col gap-2 rounded-[1.75rem] bg-primary p-4 shadow-lg ring-2 ring-inset ring-secondary">
      <span className="text-sm font-bold text-primary">Check this bill</span>
      <span className="text-xs text-tertiary">Read from your photo. Check the highlighted fields.</span>
      <ul className="flex flex-col gap-1">
        {KEYS.map(k => {
          const f = HISAAB_FIELDS[k];
          const on = placed.includes(k);
          const tr = fieldTreatment(k);
          return (
            <li key={k} className="grid grid-cols-[6.5rem_1fr] items-center gap-2">
              <span className="truncate text-xs font-medium text-tertiary">{f.label}</span>
              {!on ? <span className="h-6 rounded-md bg-secondary" aria-label="Not placed yet" />
                : (
                  <motion.span initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={springs.pop}
                    className={cx('flex h-6 items-center justify-between gap-2 truncate rounded-md px-2 text-xs font-semibold',
                      tr === 'auto' && 'bg-primary text-primary ring-1 ring-inset ring-secondary',
                      tr === 'check' && 'bg-warning-primary text-primary ring-2 ring-inset ring-yellow-500',
                      tr === 'ask' && 'border-2 border-dashed border-error bg-primary text-tertiary',
                      hot === k && 'shadow-md')}>
                    <span className="truncate">{tr === 'ask' ? 'What does this say?' : f.read}</span>
                    {tr === 'check' && <span className="shrink-0 font-bold text-primary">Check</span>}
                  </motion.span>
                )}
            </li>
          );
        })}
      </ul>
      <span className="mt-1 flex h-10 items-center justify-center rounded-xl text-sm font-bold text-white" style={{ background: '#15803D' }}>Save to khata</span>
    </div>
  );
}

export function GuessFlag({ game, onDone }: { game: Game; onDone: (results: GameResult[]) => void }) {
  const [deck, setDeck] = useState(game.cards);
  const [results, setResults] = useState<Record<string, boolean>>({});
  const [placed, setPlaced] = useState<HisaabField[]>([]);
  const [miss, setMiss] = useState<string | null>(null);
  const [right, setRight] = useState(false);
  const card = deck[0];

  if (!card) {
    const n = Object.values(results).filter(Boolean).length;
    const rows = [
      { l: 'First draft, saved straight away', checks: reviewLoad(DRAFT_TREATMENT), slips: slipped(DRAFT_TREATMENT).length },
      { l: 'Your review screen', checks: reviewLoad(fieldTreatment), slips: slipped(fieldTreatment).length },
    ];
    return (
      <div className="relative flex flex-col gap-5 py-6">
        <Burst count={36} />
        <StageTitle eyebrow="Review screen built" title={`${n} of ${game.cards.length} called first time`}>
          Nothing wrong reaches Ramesh’s khata unseen, and he only looks at the fields that need him.
        </StageTitle>
        <div className="grid gap-2 sm:grid-cols-2">
          {rows.map(r => (
            <div key={r.l} className="flex flex-col gap-1 rounded-2xl bg-secondary p-4">
              <span className="text-sm font-bold text-primary">{r.l}</span>
              <span className="text-sm text-secondary">Fields to check: <strong className="tabular-nums">{r.checks}</strong></span>
              <span className={cx('text-sm font-semibold', r.slips ? 'text-error-primary' : 'text-success-primary')}>Wrong values in the khata: <span className="tabular-nums">{r.slips}</span></span>
            </div>
          ))}
        </div>
        <Review placed={placed} />
        <NibSays mood={n === game.cards.length ? 'cheer' : 'idle'}>Set your thresholds from how often the AI was actually right on real inputs, then test the screen with real people. If they start tapping past the highlights, you’re flagging too much.</NibSays>
        <Button size="xl" onPress={() => onDone(game.cards.map(c => ({ id: c.id, correct: !!results[c.id] })))}>Continue the story</Button>
      </div>
    );
  }

  const k = card.visual as HisaabField;
  const f = HISAAB_FIELDS[k];
  const lane = fieldTreatment(k);
  const owner = game.lanes.find(l => l.id === lane)!;
  const done = game.cards.length - deck.length;
  const pct = Math.round(f.conf * 100);
  const call = (laneId: string) => {
    if (miss || right) return;
    const ok = laneId === lane;
    play(ok ? 'correct' : 'wrong');
    setResults(r => (card.id in r ? r : { ...r, [card.id]: ok }));
    if (ok) { setRight(true); setPlaced(ps => [...ps, k]); }
    else { setMiss(laneId); setTimeout(() => { setMiss(null); setDeck(d => [...d.slice(1), d[0]]); }, 3200); }
  };
  const next = () => { setRight(false); setDeck(d => d.slice(1)); };

  return (
    <div className="flex flex-col gap-5">
      <StageTitle eyebrow="Play" title={game.title}>{game.instructions}</StageTitle>
      <div className="grid gap-5 md:grid-cols-[1fr_minmax(0,20rem)]">
        <div className="flex flex-col gap-4">
          <div className="flex items-baseline justify-between">
            <span className="text-sm font-semibold text-tertiary">What the AI read</span>
            <span className="text-sm font-semibold text-tertiary tabular-nums">{done} / {game.cards.length}</span>
          </div>
          <motion.div key={`${card.id}-${deck.length}`} initial={{ y: 24, opacity: 0 }} animate={miss ? { x: [0, -10, 10, -6, 6, 0], y: 0, opacity: 1 } : { y: 0, opacity: 1 }} transition={miss ? { duration: 0.4 } : springs.pop}
            className={cx('flex flex-col gap-3 rounded-2xl bg-primary p-5 shadow-lg ring-2 ring-inset', miss ? 'ring-error' : right ? 'ring-mint-600' : 'ring-secondary')} data-current-card>
            <span className="sr-only">{card.label}</span>
            <span className="text-sm font-bold text-tertiary" aria-hidden>{f.label}</span>
            <div className="flex items-center gap-3" aria-hidden>
              <span className="-rotate-1 rounded-md px-3 py-2 font-mono text-lg font-bold shadow-sm ring-1 ring-inset ring-[#D6D3C4]" style={{ background: '#FFFDF5', color: '#1E3A8A' }}>{f.read}</span>
              <span className="text-xs font-medium text-tertiary">crop of the bill</span>
            </div>
            <div className="flex flex-col gap-1" aria-hidden>
              <div className="flex justify-between text-xs font-semibold text-tertiary"><span>How sure the AI is</span><span className="tabular-nums text-primary">{pct}%</span></div>
              <div className="relative h-2.5 rounded-full bg-secondary">
                <motion.div className="h-full rounded-full bg-brand-solid" initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={springs.pop} />
                <span className="absolute -top-1 h-4.5 w-0.5 bg-error-solid" style={{ left: `${ASK_BELOW * 100}%` }} />
                <span className="absolute -top-1 h-4.5 w-0.5 bg-warning-solid" style={{ left: `${AUTO_ABOVE * 100}%` }} />
              </div>
              <div className="flex justify-between text-xs text-quaternary"><span>Guess below {ASK_BELOW * 100}%</span><span>Sure from {AUTO_ABOVE * 100}%</span></div>
            </div>
            <span className="text-sm font-medium text-secondary" aria-hidden>{STAKES[f.stakes]}</span>
            {failsCheck(k) && <span className="rounded-lg bg-warning-primary px-3 py-1.5 text-sm font-semibold text-primary" aria-hidden>Check failed: the lines plus GST don’t add up to this total</span>}
          </motion.div>
          <div className="grid gap-2 sm:grid-cols-3" role="group" aria-label="How the review screen shows it">
            {game.lanes.map(l => (
              <motion.button key={l.id} type="button" onClick={() => call(l.id)} disabled={!!miss || right} whileTap={{ scale: 0.97 }}
                className={cx('flex flex-col items-start gap-0.5 rounded-xl border-2 bg-primary px-3 py-2.5 text-left transition enabled:hover:bg-primary_hover disabled:cursor-default',
                  right && l.id === lane ? 'border-mint-600' : miss === l.id ? 'border-error' : miss && l.id === lane ? 'border-mint-600' : 'border-secondary')}>
                <span className="flex items-center gap-1.5 text-md font-bold text-primary"><span className="size-2.5 rounded-full" style={{ background: TREAT_TONE[l.id as FieldTreatment] }} aria-hidden />{l.label}</span>
                <span className="text-xs font-medium text-tertiary">{l.hint}</span>
              </motion.button>
            ))}
          </div>
          <div className="min-h-14" aria-live="polite">
            {miss && <NibSays mood="sad">Not quite: <strong>{owner.label.toLowerCase()}</strong>. {card.note} It’ll come back round.</NibSays>}
            {right && (
              <div className="flex flex-col gap-3">
                <NibSays mood="cheer">{card.note}</NibSays>
                <div className="flex justify-end"><Button size="lg" onPress={next}>{deck.length > 1 ? 'Next field' : 'See the screen'}</Button></div>
              </div>
            )}
            {!miss && !right && <NibSays mood="think">Is it a guess? If not: would a mistake here touch his money or his GST, and is the AI sure enough for that?</NibSays>}
          </div>
        </div>
        <Review placed={placed} hot={right ? k : undefined} />
      </div>
    </div>
  );
}
