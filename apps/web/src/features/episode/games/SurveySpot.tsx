'use client';
// Mini-game for rs.5-1: Lint the survey. Every card is an item from Bolo's draft survey (its `visual`, a key of
// `BOLO_ITEMS`), drawn as it would go out: the question, its answer options, and who it's sent to. Tap the broken
// part, or send it if it's sound (`SURVEY_PARTS`, scored by `surveyFlaw`). A right call names the flaw (`optionFlaw`,
// `sampleFlaw`); a miss explains and the card comes back later. First tap scores. The end sizes the fixed survey
// (`BOLO_FIELD`, `moe`, `responsesFor`, `invitesFor`).
import { useState } from 'react';
import { motion } from 'motion/react';
import { PaperPlaneTiltIcon } from '@phosphor-icons/react/ssr';
import { BOLO_FIELD, BOLO_ITEMS, invitesFor, moe, optionFlaw, responsesFor, sampleFlaw, surveyFlaw, type BoloItem, type Episode, type SurveyPart } from '@shape/content';
import { springs } from '@shape/ui';
import { Button } from '@/components/base/buttons/button';
import { cx } from '@/utils/cx';
import { Burst, NibSays, StageTitle } from '../kit';
import type { GameResult } from './DiamondSort';
import { play } from '@/lib/sound';

type Game = Episode['game'];
const FLAW_NAME: Record<string, string> = {
  leading: 'Leading', double: 'Two questions in one', hypothetical: 'About the future',
  overlap: 'Ranges overlap', gap: 'Ranges leave a gap', unbalanced: 'Lopsided scale', 'no-out': 'No way out',
  coverage: 'Can’t reach everyone', 'self-selected': 'People pick themselves',
};
/** White text on this green passes 4.5:1. */
const OK_FILL = '#067647';
const n = (x: number) => x.toLocaleString('en-IN');

/** The name of what's broken in an item, or null if it's sound. */
const flawName = (k: BoloItem) => {
  const i = BOLO_ITEMS[k];
  const f = i.stemFlaw ?? optionFlaw(i) ?? sampleFlaw(i);
  return f ? FLAW_NAME[f] : null;
};

function Region({ part, pick, state, children, label }: { part: SurveyPart; pick: (p: SurveyPart) => void; state: 'idle' | 'right' | 'wrong' | 'answer'; children: React.ReactNode; label: string }) {
  return (
    <motion.button type="button" onClick={() => pick(part)} whileTap={{ scale: 0.99 }} aria-label={label}
      className={cx('w-full rounded-xl px-3 py-2.5 text-left ring-2 ring-inset transition', state === 'idle' ? 'ring-transparent hover:ring-brand' : state === 'wrong' ? 'ring-error' : 'ring-mint-600')}>
      {children}
    </motion.button>
  );
}

export function SurveySpot({ game, onDone }: { game: Game; onDone: (results: GameResult[]) => void }) {
  const [deck, setDeck] = useState(game.cards);
  const [results, setResults] = useState<Record<string, boolean>>({});
  const [miss, setMiss] = useState<SurveyPart | null>(null);
  const [right, setRight] = useState(false);
  const card = deck[0];

  if (!card) {
    const got = Object.values(results).filter(Boolean).length;
    const rate = BOLO_FIELD.responded / BOLO_FIELD.invites, m = moe(BOLO_FIELD.responded) * 100;
    const need3 = responsesFor(0.03);
    return (
      <div className="relative flex flex-col gap-5 py-6">
        <Burst count={36} />
        <StageTitle eyebrow="Survey fixed" title={`${got} of ${game.cards.length} spotted first time`}>
          The rewritten survey went to {n(BOLO_FIELD.invites)} people picked at random, lapsed learners included. {n(BOLO_FIELD.responded)} answered ({Math.round(rate * 100)}%).
        </StageTitle>
        <dl className="grid grid-cols-3 gap-2 rounded-2xl bg-secondary p-3 text-center">
          <div><dt className="text-xs font-semibold text-tertiary">Invited</dt><dd className="text-xl font-bold text-primary tabular-nums">{n(BOLO_FIELD.invites)}</dd></div>
          <div><dt className="text-xs font-semibold text-tertiary">Answered</dt><dd className="text-xl font-bold text-primary tabular-nums">{n(BOLO_FIELD.responded)}</dd></div>
          <div><dt className="text-xs font-semibold text-tertiary">Margin on a share</dt><dd className="text-xl font-bold text-primary tabular-nums">±{m.toFixed(1)}</dd></div>
        </dl>
        <NibSays mood={got === game.cards.length ? 'cheer' : 'idle'}>That ±{m.toFixed(1)} is honest because the sample is random and reaches people who stopped. For ±3 you’d need {n(need3)} answers, about {n(invitesFor(need3, rate))} invitations. The pop-up’s 2,300 answers had a smaller margin around the wrong number.</NibSays>
        <Button size="xl" onPress={() => onDone(game.cards.map(c => ({ id: c.id, correct: !!results[c.id] })))}>Continue the story</Button>
      </div>
    );
  }

  const k = card.visual as BoloItem;
  const item = BOLO_ITEMS[k];
  const part = surveyFlaw(item);
  const owner = game.lanes.find(l => l.id === part)!;
  const done = game.cards.length - deck.length;
  const pick = (p: SurveyPart) => {
    if (miss || right) return;
    const ok = p === part;
    play(ok ? 'correct' : 'wrong');
    setResults(r => (card.id in r ? r : { ...r, [card.id]: ok }));
    if (ok) setRight(true);
    else { setMiss(p); setTimeout(() => { setMiss(null); setDeck(dk => [...dk.slice(1), dk[0]]); }, 3400); }
  };
  const state = (p: SurveyPart) => (right && p === part ? 'right' : miss === p ? 'wrong' : miss && p === part ? 'answer' : 'idle');
  const next = () => { setRight(false); setDeck(dk => dk.slice(1)); };
  const name = flawName(k);

  return (
    <div className="flex flex-col gap-5">
      <StageTitle eyebrow="Play" title={game.title}>{game.instructions}</StageTitle>
      <div className="flex items-baseline justify-between">
        <span className="text-sm font-semibold text-tertiary">Bolo survey draft</span>
        <span className="text-sm font-semibold text-tertiary tabular-nums">{done} / {game.cards.length}</span>
      </div>
      <motion.div key={`${card.id}-${deck.length}`} initial={{ y: 20, opacity: 0 }} animate={miss ? { x: [0, -8, 8, -5, 5, 0], y: 0, opacity: 1 } : { y: 0, opacity: 1 }} transition={miss ? { duration: 0.4 } : springs.pop}
        className="mx-auto flex w-full max-w-md flex-col gap-1 rounded-3xl bg-primary p-3 shadow-lg ring-1 ring-secondary ring-inset" data-current-card>
        <Region part="stem" pick={pick} state={state('stem')} label={`The question: ${item.stem}`}>
          <span className="text-xs font-semibold text-tertiary">Question</span>
          <p className="text-lg font-semibold text-primary">{item.stem}</p>
        </Region>
        <Region part="options" pick={pick} state={state('options')} label={`The answers: ${item.options.map(o => o.label).join(', ')}`}>
          <ul className="flex flex-col gap-1.5">
            {item.options.map(o => (
              <li key={o.label} className="flex items-center gap-2 rounded-lg bg-secondary px-2.5 py-1.5 text-sm font-medium text-primary">
                <span className="size-3.5 shrink-0 rounded-full ring-2 ring-tertiary ring-inset" aria-hidden />{o.label}
              </li>
            ))}
          </ul>
        </Region>
        <Region part="sample" pick={pick} state={state('sample')} label={`Who gets it: ${item.audience}`}>
          <span className="text-xs font-semibold text-tertiary">Sent to</span>
          <p className="text-sm font-medium text-secondary">{item.audience}</p>
        </Region>
      </motion.div>
      <div className="flex justify-center">
        <Button size="lg" color="secondary" iconLeading={PaperPlaneTiltIcon} isDisabled={!!miss || right} onPress={() => pick('sound')}
          className={cx(right && part === 'sound' && 'ring-2 ring-mint-600', miss === 'sound' && 'ring-2 ring-error')}>
          Sound: send it
        </Button>
      </div>
      <div className="min-h-14" aria-live="polite">
        {miss && <NibSays mood="sad">Not quite: it’s <strong>{owner.label.toLowerCase()}</strong>{name ? ` (${name.toLowerCase()})` : ''}. {card.note} It’ll come back round.</NibSays>}
        {right && (
          <div className="flex flex-col gap-3">
            {name && <span className="self-start rounded-full px-2.5 py-0.5 text-xs font-bold text-white" style={{ background: OK_FILL }}>{name}</span>}
            <NibSays mood="cheer">{card.note}</NibSays>
            <div className="flex justify-end"><Button size="lg" onPress={next}>{deck.length > 1 ? 'Next item' : 'Send the survey'}</Button></div>
          </div>
        )}
        {!miss && !right && <NibSays mood="think">Read it as a learner would. Does the question push you? Can you answer it truthfully? And could everyone the decision is about even receive it?</NibSays>}
      </div>
    </div>
  );
}
