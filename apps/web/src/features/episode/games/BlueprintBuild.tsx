'use client';
// Mini-game for ia.5-1: blueprint Nabz's 7 am home blood test. Every card is one step of the service (its `visual`, a
// key of `NABZ_STEPS`), in time order, tagged with its phase. Put it in its row: customer actions, frontstage,
// backstage or support (`BLUEPRINT_ROWS`, scored by `blueprintRow`). Right calls pin it to the board in its row and
// phase column; fail points (`failPoints`) light up once placed, with what goes wrong there. The end shows the whole
// blueprint and lists the fail points by the line they sit under. A miss explains and the card comes back later;
// first call scores.
import { useState } from 'react';
import { motion } from 'motion/react';
import { NABZ_STEPS, PHASE_LABEL, blueprintRow, failPoints, type BlueprintRow, type Episode, type NabzStep } from '@shape/content';
import { springs } from '@shape/ui';
import { Button } from '@/components/base/buttons/button';
import { cx } from '@/utils/cx';
import { Burst, NibSays, StageTitle } from '../kit';
import { BOARD, BlueprintBoard, ROW_LABEL, ROW_TONE } from '../scenes/ServiceBlueprint';
import type { GameResult } from './DiamondSort';
import { play } from '@/lib/sound';

type Game = Episode['game'];
const FAILS = failPoints() as NabzStep[];

function Board({ placed, hot }: { placed: NabzStep[]; hot?: NabzStep }) {
  return (
    <div className="overflow-x-auto rounded-2xl bg-secondary p-3">
      <svg viewBox={`-4 0 ${BOARD.w + 8} ${BOARD.h + 4}`} className="w-full min-w-[34rem]" role="img" aria-label={`Service blueprint with ${placed.length} steps placed`}>
        <BlueprintBoard placed={placed} fails hot={hot} />
      </svg>
    </div>
  );
}

export function BlueprintBuild({ game, onDone }: { game: Game; onDone: (results: GameResult[]) => void }) {
  const [deck, setDeck] = useState(game.cards);
  const [results, setResults] = useState<Record<string, boolean>>({});
  const [placed, setPlaced] = useState<NabzStep[]>([]);
  const [miss, setMiss] = useState<string | null>(null);
  const [right, setRight] = useState(false);
  const card = deck[0];

  if (!card) {
    const n = Object.values(results).filter(Boolean).length;
    return (
      <div className="relative flex flex-col gap-5 py-6">
        <Burst count={36} />
        <StageTitle eyebrow="Blueprint done" title={`${n} of ${game.cards.length} placed first time`}>
          {FAILS.length} fail points, and {FAILS.filter(s => blueprintRow(NABZ_STEPS[s]) !== 'front').length} of them sit below the line of visibility, where Mr Reddy never looks.
        </StageTitle>
        <Board placed={placed} />
        <ul className="flex flex-col gap-2">
          {FAILS.map(s => (
            <li key={s} className="flex flex-col gap-0.5 rounded-xl bg-primary px-4 py-3 ring-1 ring-secondary ring-inset">
              <span className="flex items-center gap-2 text-xs font-bold tracking-wide text-tertiary uppercase">
                <span className="size-2.5 rounded-full" style={{ background: ROW_TONE[blueprintRow(NABZ_STEPS[s])] }} aria-hidden />{ROW_LABEL[blueprintRow(NABZ_STEPS[s])]} · {PHASE_LABEL[NABZ_STEPS[s].phase]}
              </span>
              <span className="text-md font-semibold text-primary">{NABZ_STEPS[s].text}</span>
              <span className="text-sm text-error-primary">{NABZ_STEPS[s].fail}</span>
            </li>
          ))}
        </ul>
        <NibSays mood={n === game.cards.length ? 'cheer' : 'idle'}>Rows follow what the customer sees. His own actions on top; anything he sees or hears, from a person or a screen, is frontstage; staff he meets, working out of sight, are backstage; everyone and everything else supports them. Fix the fail points where they are.</NibSays>
        <Button size="xl" onPress={() => onDone(game.cards.map(c => ({ id: c.id, correct: !!results[c.id] })))}>Continue the story</Button>
      </div>
    );
  }

  const k = card.visual as NabzStep;
  const s = NABZ_STEPS[k];
  const lane = blueprintRow(s);
  const owner = game.lanes.find(l => l.id === lane)!;
  const done = game.cards.length - deck.length;
  const call = (laneId: string) => {
    if (miss || right) return;
    const ok = laneId === lane;
    play(ok ? 'correct' : 'wrong');
    setResults(rs => (card.id in rs ? rs : { ...rs, [card.id]: ok }));
    if (ok) { setRight(true); setPlaced(ps => [...ps, k]); }
    else { setMiss(laneId); setTimeout(() => { setMiss(null); setDeck(dk => [...dk.slice(1), dk[0]]); }, 3200); }
  };
  const next = () => { setRight(false); setDeck(dk => dk.slice(1)); };

  return (
    <div className="flex flex-col gap-5">
      <StageTitle eyebrow="Play" title={game.title}>{game.instructions}</StageTitle>
      <Board placed={placed} hot={right ? k : undefined} />
      <div className="flex items-baseline justify-between">
        <span className="text-sm font-semibold text-tertiary">Steps to place</span>
        <span className="text-sm font-semibold text-tertiary tabular-nums">{done} / {game.cards.length}</span>
      </div>
      <motion.div key={`${card.id}-${deck.length}`} initial={{ y: 24, opacity: 0 }} animate={miss ? { x: [0, -10, 10, -6, 6, 0], y: 0, opacity: 1 } : { y: 0, opacity: 1 }} transition={miss ? { duration: 0.4 } : springs.pop}
        className={cx('flex flex-col gap-2 rounded-2xl bg-primary p-5 shadow-lg ring-2 ring-inset', miss ? 'ring-error' : right ? 'ring-mint-600' : 'ring-secondary')} data-current-card>
        <span className="text-xs font-bold tracking-wide text-tertiary uppercase">{PHASE_LABEL[s.phase]}</span>
        <p className="text-lg font-semibold text-primary">{card.label}</p>
        {right && s.fail && (
          <motion.p initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={springs.pop} className="text-sm font-semibold text-error-primary">Fail point: {s.fail}.</motion.p>
        )}
      </motion.div>
      <div className="grid grid-cols-2 gap-2 md:grid-cols-4" role="group" aria-label="Row of the blueprint">
        {game.lanes.map(l => (
          <motion.button key={l.id} type="button" onClick={() => call(l.id)} disabled={!!miss || right} whileTap={{ scale: 0.97 }}
            className={cx('flex flex-col items-start gap-0.5 rounded-xl border-2 bg-primary px-3 py-2.5 text-left transition enabled:hover:bg-primary_hover disabled:cursor-default',
              right && l.id === lane ? 'border-mint-600' : miss === l.id ? 'border-error' : miss && l.id === lane ? 'border-mint-600' : 'border-secondary')}>
            <span className="flex items-center gap-1.5 text-md font-bold text-primary"><span className="size-2.5 rounded-full" style={{ background: ROW_TONE[l.id as BlueprintRow] }} aria-hidden />{l.label}</span>
            <span className="text-xs font-medium text-tertiary">{l.hint}</span>
          </motion.button>
        ))}
      </div>
      <div className="min-h-14" aria-live="polite">
        {miss && <NibSays mood="sad">Not quite: <strong>{owner.label.toLowerCase()}</strong>. {card.note} It’ll come back round.</NibSays>}
        {right && (
          <div className="flex flex-col gap-3">
            <NibSays mood="cheer">{card.note}</NibSays>
            <div className="flex justify-end"><Button size="lg" onPress={next}>{deck.length > 1 ? 'Next step' : 'See the blueprint'}</Button></div>
          </div>
        )}
        {!miss && !right && <NibSays mood="think">Ask two things. Who does it: Mr Reddy, someone he meets, or someone or something he never meets? And does he see or hear it happen?</NibSays>}
      </div>
    </div>
  );
}
