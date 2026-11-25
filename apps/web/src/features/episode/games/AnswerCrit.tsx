'use client';
// Mini-game for cw.3-3: crit Taar Assist's answers. Every card is a real question and the answer Assist generated (its
// `visual`, a key of `TAAR_ANSWERS`), shown with the sources it retrieved. Ship it, or name its worst flaw: a claim no
// source supports, a joke at an upset customer, or a missing handoff (`ANSWER_FLAWS`, scored by `answerFlaw`). Right
// calls mark every line against its source (`ungrounded`): the fact it rests on, an aside, or nothing at all. First
// call scores; a missed card comes back later.
import { useState } from 'react';
import { motion } from 'motion/react';
import { ANSWER_FLAWS, TAAR_ANSWERS, answerFlaw, ungrounded, type AnswerFlaw, type AnswerLine, type AssistAnswer, type Episode, type TaarAnswer } from '@shape/content';
import { springs } from '@shape/ui';
import { Button } from '@/components/base/buttons/button';
import { cx } from '@/utils/cx';
import { Burst, NibSays, StageTitle } from '../kit';
import { FLAW_FILL, FLAW_LABEL } from '../scenes/GroundedAnswer';
import type { GameResult } from './DiamondSort';
import { play } from '@/lib/sound';

type Game = Episode['game'];

/** The marker a line gets once the answer is judged. */
function lineMark(a: AssistAnswer, l: AnswerLine) {
  if (l.aside) return { text: 'Aside', bad: a.upset && a.jokey };
  if (ungrounded(a).includes(l)) return { text: 'No source', bad: true };
  return { text: `Source ${(l.fact ?? 0) + 1}`, bad: false };
}

export function AnswerCrit({ game, onDone }: { game: Game; onDone: (results: GameResult[]) => void }) {
  const [deck, setDeck] = useState(game.cards);
  const [results, setResults] = useState<Record<string, boolean>>({});
  const [judged, setJudged] = useState<TaarAnswer[]>([]);
  const [miss, setMiss] = useState<AnswerFlaw | null>(null);
  const [right, setRight] = useState(false);
  const card = deck[0];
  const flawOf = (k: TaarAnswer) => answerFlaw(TAAR_ANSWERS[k]);

  const tally = (
    <div className="flex flex-col gap-2 rounded-2xl bg-secondary p-3">
      <span className="text-sm font-bold text-primary">Review of Taar Assist · {judged.length} of {game.cards.length} answers read</span>
      <div className="flex flex-wrap gap-1.5">
        {ANSWER_FLAWS.map(f => (
          <span key={f} className="rounded-full px-2.5 py-0.5 text-xs font-bold text-white" style={{ background: FLAW_FILL[f] }}>{FLAW_LABEL[f]} · {judged.filter(k => flawOf(k) === f).length}</span>
        ))}
      </div>
    </div>
  );

  if (!card) {
    const n = Object.values(results).filter(Boolean).length;
    return (
      <div className="relative flex flex-col gap-5 py-6">
        <Burst count={36} />
        <StageTitle eyebrow="Review done" title={`${n} of ${game.cards.length} right first time`}>
          Invented claims first, then the wrong tone, then the missing handoff. Each failure goes back to its cause: a page, an instruction or a handoff rule.
        </StageTitle>
        {tally}
        <NibSays mood={n === game.cards.length ? 'cheer' : 'idle'}>Add every failure to the test set, fix the cause, and run all the questions again.</NibSays>
        <Button size="xl" onPress={() => onDone(game.cards.map(c => ({ id: c.id, correct: !!results[c.id] })))}>Continue the story</Button>
      </div>
    );
  }

  const k = card.visual as TaarAnswer;
  const a = TAAR_ANSWERS[k];
  const lane = flawOf(k);
  const done = game.cards.length - deck.length;
  const call = (laneId: string) => {
    if (miss || right) return;
    const ok = laneId === lane;
    play(ok ? 'correct' : 'wrong');
    setResults(rs => (card.id in rs ? rs : { ...rs, [card.id]: ok }));
    if (ok) { setRight(true); setJudged(js => [...js, k]); }
    else { setMiss(laneId as AnswerFlaw); setTimeout(() => { setMiss(null); setDeck(dk => [...dk.slice(1), dk[0]]); }, 3600); }
  };
  const next = () => { setRight(false); setDeck(dk => dk.slice(1)); };

  return (
    <div className="flex flex-col gap-5">
      <StageTitle eyebrow="Play" title={game.title}>{game.instructions}</StageTitle>
      <div className="flex items-baseline justify-between">
        <span className="text-sm font-semibold text-tertiary">Test set · real questions</span>
        <span className="text-sm font-semibold text-tertiary tabular-nums">{done} / {game.cards.length}</span>
      </div>
      <motion.div key={`${card.id}-${deck.length}`} initial={{ y: 24, opacity: 0 }}
        animate={miss ? { x: [0, -10, 10, -6, 6, 0], y: 0, opacity: 1 } : { y: 0, opacity: 1 }}
        transition={miss ? { duration: 0.4 } : springs.pop}
        className={cx('flex flex-col gap-3 rounded-2xl bg-primary p-4 shadow-lg ring-2 ring-inset sm:p-5', miss ? 'ring-error' : right ? 'ring-mint-600' : 'ring-secondary')} data-current-card>
        <p className="ml-auto max-w-[85%] rounded-2xl rounded-br-md bg-secondary px-3 py-2 text-md font-semibold text-primary">{card.label}</p>
        <div className="flex max-w-[92%] flex-col gap-1.5">
          <span className="text-xs font-bold text-tertiary">Answer by Taar Assist · AI</span>
          <div className="flex flex-col gap-1.5 rounded-2xl rounded-bl-md border-2 border-secondary px-3 py-2">
            {a.lines.map(l => {
              const m = lineMark(a, l);
              return (
                <p key={l.text} className="text-md text-primary">
                  {l.text}
                  {right && <span className={cx('ml-1.5 inline-block rounded-full px-2 py-0.5 align-middle text-xs font-bold text-white')} style={{ background: m.bad ? FLAW_FILL[l.aside ? 'tone' : 'invents'] : FLAW_FILL.ship }}>{m.text}</span>}
                </p>
              );
            })}
          </div>
        </div>
        <div className="flex flex-col gap-1 rounded-xl bg-secondary px-3 py-2">
          <span className="text-xs font-bold tracking-wide text-tertiary uppercase">Sources retrieved</span>
          <ol className="flex list-decimal flex-col gap-0.5 pl-5">
            {a.source.map(s => <li key={s} className="text-sm text-secondary">{s}</li>)}
          </ol>
        </div>
      </motion.div>
      <div className="grid grid-cols-2 gap-2" role="group" aria-label="Your verdict on the answer">
        {game.lanes.map(l => (
          <motion.button key={l.id} type="button" onClick={() => call(l.id)} disabled={!!miss || right} whileTap={{ scale: 0.97 }}
            className={cx('flex flex-col items-start gap-0.5 rounded-xl border-2 bg-primary px-3 py-2.5 text-left transition enabled:hover:bg-primary_hover disabled:cursor-default',
              right && l.id === lane ? 'border-mint-600' : miss === l.id ? 'border-error' : miss && l.id === lane ? 'border-mint-600' : 'border-secondary')}>
            <span className="flex items-center gap-1.5 text-md font-bold text-primary"><span className="size-2.5 shrink-0 rounded-sm" style={{ background: FLAW_FILL[l.id as AnswerFlaw] }} aria-hidden />{l.label}</span>
            <span className="text-xs font-medium text-tertiary">{l.hint}</span>
          </motion.button>
        ))}
      </div>
      <div className="min-h-14" aria-live="polite">
        {miss && <NibSays mood="sad">Not {FLAW_LABEL[miss].toLowerCase()}: this one is <strong>{FLAW_LABEL[lane].toLowerCase()}</strong>. {card.note} It’ll come back round.</NibSays>}
        {right && (
          <div className="flex flex-col gap-3">
            <NibSays mood="cheer">{card.note}</NibSays>
            <div className="flex justify-end"><Button size="lg" onPress={next}>{deck.length > 1 ? 'Next answer' : 'See the review'}</Button></div>
          </div>
        )}
        {!miss && !right && <NibSays mood="think">Worst first: is every claim in a source? Then, is the tone right for how they feel? Then, did it need a person?</NibSays>}
      </div>
      {tally}
    </div>
  );
}
