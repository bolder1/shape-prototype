'use client';
// Mini-game for pr.4-3: plan how Ask Thela's outputs reach participants. Every card is a study in Sana's plan (its
// `visual`, a key of `THELA_STUDIES`). A person plays the model, everyone sees the same chosen real outputs, or the live
// model answers each participant (`OUTPUT_METHODS`, scored by `outputMethod`). Right calls show what three participants
// were shown (`seen`): the same output three times when recorded, three different ones when live, and a wizard's
// hand-built carts marked as such. First call scores; a missed card comes back later.
import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { THELA_STUDIES, outputMethod, type Episode, type OutputMethod, type ThelaStudy } from '@shape/content';
import { springs } from '@shape/ui';
import { Button } from '@/components/base/buttons/button';
import { cx } from '@/utils/cx';
import { Burst, NibSays, StageTitle } from '../kit';
import { METHOD_FILL, METHOD_LABEL } from '../scenes/OutputRange';
import type { GameResult } from './DiamondSort';
import { play } from '@/lib/sound';

type Game = Episode['game'];
const PARTICIPANTS = ['Lakshmi', 'Imran', 'Divya'] as const;
const BY: Record<OutputMethod, string> = { wizard: 'Built by Sana', recorded: 'Chosen in advance', live: 'From the model' };

/** One participant's screen. */
function Seen({ who, text, method, i }: { who: string; text: string; method: OutputMethod; i: number }) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ ...springs.pop, delay: i * 0.12 }}
      className="flex min-w-0 flex-col gap-1.5 rounded-2xl border-2 border-secondary bg-primary px-2 pt-2 pb-3">
      <span aria-hidden className="mx-auto h-1.5 w-8 rounded-full bg-secondary" />
      <span className="text-xs font-bold text-tertiary">{who}</span>
      <span className="min-h-14 rounded-md px-1.5 py-1 text-sm font-semibold break-words text-primary" style={{ boxShadow: `inset 0 0 0 2px ${METHOD_FILL[method]}` }}>{text}</span>
      <span className="text-xs font-semibold text-tertiary">{BY[method]}</span>
    </motion.div>
  );
}

export function OutputPlan({ game, onDone }: { game: Game; onDone: (results: GameResult[]) => void }) {
  const [deck, setDeck] = useState(game.cards);
  const [results, setResults] = useState<Record<string, boolean>>({});
  const [planned, setPlanned] = useState<ThelaStudy[]>([]);
  const [miss, setMiss] = useState<OutputMethod | null>(null);
  const [right, setRight] = useState(false);
  const card = deck[0];
  const methodOf = (k: ThelaStudy) => outputMethod(THELA_STUDIES[k]);

  const plan = (
    <div className="flex flex-col gap-2 rounded-2xl bg-secondary p-3">
      <span className="text-sm font-bold text-primary">Ask Thela · research plan</span>
      {(['wizard', 'recorded', 'live'] as const).map(m => {
        const rows = planned.filter(k => methodOf(k) === m);
        return (
          <div key={m} className="flex flex-col gap-1">
            <span className="w-fit rounded-full px-2.5 py-0.5 text-xs font-bold text-white" style={{ background: METHOD_FILL[m] }}>{METHOD_LABEL[m]} · {rows.length}</span>
            <ul className="flex flex-col gap-0.5 pl-4">
              <AnimatePresence initial={false}>
                {rows.map(k => (
                  <motion.li key={k} layout initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} transition={springs.pop} className="list-disc text-sm text-secondary">
                    {THELA_STUDIES[k].text}
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>
          </div>
        );
      })}
    </div>
  );

  if (!card) {
    const n = Object.values(results).filter(Boolean).length;
    return (
      <div className="relative flex flex-col gap-5 py-6">
        <Burst count={36} />
        <StageTitle eyebrow="Plan written" title={`${n} of ${game.cards.length} right first time`}>
          A wizard before the model exists, chosen real outputs when everyone must meet the same one, and the live model when the question is about people’s own requests.
        </StageTitle>
        {plan}
        <NibSays mood={n === game.cards.length ? 'cheer' : 'idle'}>Test the AI you will ship, misses and all. And tell every participant afterwards what was real.</NibSays>
        <Button size="xl" onPress={() => onDone(game.cards.map(c => ({ id: c.id, correct: !!results[c.id] })))}>Continue the story</Button>
      </div>
    );
  }

  const k = card.visual as ThelaStudy;
  const s = THELA_STUDIES[k];
  const lane = methodOf(k);
  const done = game.cards.length - deck.length;
  const call = (laneId: string) => {
    if (miss || right) return;
    const ok = laneId === lane;
    play(ok ? 'correct' : 'wrong');
    setResults(rs => (card.id in rs ? rs : { ...rs, [card.id]: ok }));
    if (ok) { setRight(true); setPlanned(ps => [...ps, k]); }
    else { setMiss(laneId as OutputMethod); setTimeout(() => { setMiss(null); setDeck(dk => [...dk.slice(1), dk[0]]); }, 3600); }
  };
  const next = () => { setRight(false); setDeck(dk => dk.slice(1)); };

  return (
    <div className="flex flex-col gap-5">
      <StageTitle eyebrow="Play" title={game.title}>{game.instructions}</StageTitle>
      <div className="flex items-baseline justify-between">
        <span className="text-sm font-semibold text-tertiary">Sana’s plan for Ask Thela</span>
        <span className="text-sm font-semibold text-tertiary tabular-nums">{done} / {game.cards.length}</span>
      </div>
      <motion.div key={`${card.id}-${deck.length}`} initial={{ y: 24, opacity: 0 }}
        animate={miss ? { x: [0, -10, 10, -6, 6, 0], y: 0, opacity: 1 } : { y: 0, opacity: 1 }}
        transition={miss ? { duration: 0.4 } : springs.pop}
        className={cx('flex flex-col gap-3 rounded-2xl bg-primary p-4 shadow-lg ring-2 ring-inset sm:p-5', miss ? 'ring-error' : right ? 'ring-mint-600' : 'ring-secondary')} data-current-card>
        <span className="text-xs font-bold tracking-wide text-tertiary uppercase">Study</span>
        <p className="text-lg font-semibold text-primary">{card.label}</p>
        {right && (
          <div className="grid grid-cols-3 gap-2">
            {PARTICIPANTS.map((who, i) => <Seen key={who} who={who} text={s.seen[i]} method={lane} i={i} />)}
          </div>
        )}
      </motion.div>
      <div className="grid grid-cols-3 gap-2" role="group" aria-label="How the outputs reach participants">
        {game.lanes.map(l => (
          <motion.button key={l.id} type="button" onClick={() => call(l.id)} disabled={!!miss || right} whileTap={{ scale: 0.97 }}
            className={cx('flex flex-col items-start gap-0.5 rounded-xl border-2 bg-primary px-3 py-2.5 text-left transition enabled:hover:bg-primary_hover disabled:cursor-default',
              right && l.id === lane ? 'border-mint-600' : miss === l.id ? 'border-error' : miss && l.id === lane ? 'border-mint-600' : 'border-secondary')}>
            <span className="flex items-center gap-1.5 text-md font-bold text-primary"><span className="size-2.5 shrink-0 rounded-sm" style={{ background: METHOD_FILL[l.id as OutputMethod] }} aria-hidden />{l.label}</span>
            <span className="text-xs font-medium text-tertiary">{l.hint}</span>
          </motion.button>
        ))}
      </div>
      <div className="min-h-14" aria-live="polite">
        {miss && <NibSays mood="sad">Not {METHOD_LABEL[miss].toLowerCase()}: this one is <strong>{METHOD_LABEL[lane].toLowerCase()}</strong>. {card.note} It’ll come back round.</NibSays>}
        {right && (
          <div className="flex flex-col gap-3">
            <NibSays mood="cheer">{card.note}</NibSays>
            <div className="flex justify-end"><Button size="lg" onPress={next}>{deck.length > 1 ? 'Next study' : 'See the plan'}</Button></div>
          </div>
        )}
        {!miss && !right && <NibSays mood="think">Can a model do it yet? Does everyone need to meet the same output? Or is the question about what people ask for themselves?</NibSays>}
      </div>
      {plan}
    </div>
  );
}
