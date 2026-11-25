'use client';
// Mini-game for pr.4-2: fit a prototype to each question on Thela's research board. Every card is a question (its
// `visual`, a key of `THELA_QUESTIONS`). Pick Figma, Framer or React (`PROTO_TOOLS`, scored by `protoTool`, the
// cheapest tool that covers the question's needs). Every pick lays the question's needs against what that tool makes
// real (`TOOL_CAN`): a cheaper tool shows what it would leave fake (`missingNeeds`), a dearer one shows the days it
// wastes. Right calls add the tool's `TOOL_DAYS` to the test plan. First call scores; a missed card comes back later.
import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { CheckIcon, XIcon } from '@phosphor-icons/react/ssr';
import {
  PROTO_NEED_LABEL, PROTO_TOOLS, PROTO_TOOL_LABEL, THELA_QUESTIONS, TOOL_DAYS, missingNeeds, protoTool,
  type Episode, type ProtoTool, type ThelaQuestion,
} from '@shape/content';
import { springs } from '@shape/ui';
import { Button } from '@/components/base/buttons/button';
import { cx } from '@/utils/cx';
import { Burst, NibSays, StageTitle } from '../kit';
import { TOOL_FILL } from '../scenes/ProtoLadder';
import type { GameResult } from './DiamondSort';
import { play } from '@/lib/sound';

type Game = Episode['game'];
const days = (n: number) => `${n} day${n === 1 ? '' : 's'}`;

/** The question's needs, each ticked or crossed for a tool. */
function NeedCheck({ q, tool }: { q: ThelaQuestion; tool: ProtoTool }) {
  const needs = THELA_QUESTIONS[q].needs;
  const fake = missingNeeds(tool, needs);
  return (
    <ul className="flex flex-col gap-1.5" aria-label={`What ${PROTO_TOOL_LABEL[tool]} makes real for this question`}>
      {needs.map((n, i) => {
        const ok = !fake.includes(n);
        return (
          <motion.li key={n} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ ...springs.pop, delay: i * 0.08 }}
            className="flex items-center gap-2 text-sm font-semibold text-primary">
            <span className={cx('grid size-6 shrink-0 place-items-center rounded-full text-white', ok ? 'bg-[#067647]' : 'bg-[#B42318]')} aria-hidden>
              {ok ? <CheckIcon size={14} weight="bold" /> : <XIcon size={14} weight="bold" />}
            </span>
            {PROTO_NEED_LABEL[n]}<span className="sr-only">{ok ? ': real' : ': left fake'}</span>
          </motion.li>
        );
      })}
    </ul>
  );
}

export function ProtoFit({ game, onDone }: { game: Game; onDone: (results: GameResult[]) => void }) {
  const [deck, setDeck] = useState(game.cards);
  const [results, setResults] = useState<Record<string, boolean>>({});
  const [plan, setPlan] = useState<ThelaQuestion[]>([]);
  const [miss, setMiss] = useState<ProtoTool | null>(null);
  const [right, setRight] = useState(false);
  const card = deck[0];
  const toolOf = (k: ThelaQuestion) => protoTool(THELA_QUESTIONS[k].needs);
  const spent = plan.reduce((s, k) => s + TOOL_DAYS[toolOf(k)], 0);
  const allCode = plan.length * TOOL_DAYS.code;

  const board = (
    <div className="flex flex-col gap-2 rounded-2xl bg-secondary p-3">
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-sm font-bold text-primary">Test plan</span>
        <span className="text-sm font-semibold text-tertiary tabular-nums">{days(spent)}{plan.length > 1 ? ` · all in React: ${days(allCode)}` : ''}</span>
      </div>
      {PROTO_TOOLS.map(tl => {
        const rows = plan.filter(k => toolOf(k) === tl);
        return (
          <div key={tl} className="flex flex-col gap-1">
            <span className="w-fit rounded-full px-2.5 py-0.5 text-xs font-bold text-white" style={{ background: TOOL_FILL[tl] }}>{PROTO_TOOL_LABEL[tl]} · {rows.length}</span>
            <ul className="flex flex-col gap-0.5 pl-4">
              <AnimatePresence initial={false}>
                {rows.map(k => (
                  <motion.li key={k} layout initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} transition={springs.pop} className="list-disc text-sm text-secondary">
                    {THELA_QUESTIONS[k].text}
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
        <StageTitle eyebrow="Plan fitted" title={`${n} of ${game.cards.length} right first time`}>
          {`${game.cards.length} questions in ${days(spent)} of prototyping, against ${days(allCode)} if everything had been built in React. Nothing the answers depend on is fake.`}
        </StageTitle>
        {board}
        <NibSays mood={n === game.cards.length ? 'cheer' : 'idle'}>Fake what the question doesn’t touch. Make real what its answer depends on. Pay for nothing else.</NibSays>
        <Button size="xl" onPress={() => onDone(game.cards.map(c => ({ id: c.id, correct: !!results[c.id] })))}>Continue the story</Button>
      </div>
    );
  }

  const k = card.visual as ThelaQuestion;
  const lane = toolOf(k);
  const picked = miss ?? (right ? lane : null);
  const done = game.cards.length - deck.length;
  const over = miss && PROTO_TOOLS.indexOf(miss) > PROTO_TOOLS.indexOf(lane);
  const call = (laneId: string) => {
    if (miss || right) return;
    const ok = laneId === lane;
    play(ok ? 'correct' : 'wrong');
    setResults(rs => (card.id in rs ? rs : { ...rs, [card.id]: ok }));
    if (ok) { setRight(true); setPlan(ps => [...ps, k]); }
    else { setMiss(laneId as ProtoTool); setTimeout(() => { setMiss(null); setDeck(dk => [...dk.slice(1), dk[0]]); }, 4200); }
  };
  const next = () => { setRight(false); setDeck(dk => dk.slice(1)); };

  return (
    <div className="flex flex-col gap-5">
      <StageTitle eyebrow="Play" title={game.title}>{game.instructions}</StageTitle>
      <div className="flex items-baseline justify-between">
        <span className="text-sm font-semibold text-tertiary">Sana’s research board</span>
        <span className="text-sm font-semibold text-tertiary tabular-nums">{done} / {game.cards.length}</span>
      </div>
      <motion.div key={`${card.id}-${deck.length}`} initial={{ y: 24, opacity: 0 }}
        animate={miss ? { x: [0, -10, 10, -6, 6, 0], y: 0, opacity: 1 } : { y: 0, opacity: 1 }}
        transition={miss ? { duration: 0.4 } : springs.pop}
        className={cx('flex flex-col gap-3 rounded-2xl bg-primary p-4 shadow-lg ring-2 ring-inset sm:p-5', miss ? 'ring-error' : right ? 'ring-mint-600' : 'ring-secondary')} data-current-card>
        <span className="text-xs font-bold tracking-wide text-tertiary uppercase">Question</span>
        <p className="text-lg font-semibold text-primary">{card.label}</p>
        {picked && (
          <div className="flex flex-col gap-2 rounded-xl bg-secondary p-3">
            <span className="text-xs font-bold tracking-wide text-tertiary uppercase">Needs, in {PROTO_TOOL_LABEL[picked]}</span>
            <NeedCheck q={k} tool={picked} />
            {over && <p className="text-sm font-semibold text-primary">Everything’s real, but {PROTO_TOOL_LABEL[lane]} would do it in {days(TOOL_DAYS[lane])}, not {days(TOOL_DAYS[picked])}.</p>}
          </div>
        )}
      </motion.div>
      <div className="grid grid-cols-3 gap-2" role="group" aria-label="Which tool to prototype it in">
        {game.lanes.map(l => (
          <motion.button key={l.id} type="button" onClick={() => call(l.id)} disabled={!!miss || right} whileTap={{ scale: 0.97 }}
            className={cx('flex flex-col items-start gap-0.5 rounded-xl border-2 bg-primary px-3 py-2.5 text-left transition enabled:hover:bg-primary_hover disabled:cursor-default',
              right && l.id === lane ? 'border-mint-600' : miss === l.id ? 'border-error' : miss && l.id === lane ? 'border-mint-600' : 'border-secondary')}>
            <span className="flex items-center gap-1.5 text-md font-bold text-primary"><span className="size-2.5 shrink-0 rounded-sm" style={{ background: TOOL_FILL[l.id as ProtoTool] }} aria-hidden />{l.label}</span>
            <span className="text-xs font-medium text-tertiary">{l.hint}</span>
          </motion.button>
        ))}
      </div>
      <div className="min-h-14" aria-live="polite">
        {miss && <NibSays mood="sad">{over ? 'More than it needs' : `${PROTO_TOOL_LABEL[miss]} would leave part of it fake`}: this one is <strong>{PROTO_TOOL_LABEL[lane]}</strong>. {card.note} It’ll come back round.</NibSays>}
        {right && (
          <div className="flex flex-col gap-3">
            <NibSays mood="cheer">{card.note}</NibSays>
            <div className="flex justify-end"><Button size="lg" onPress={next}>{deck.length > 1 ? 'Next question' : 'See the plan'}</Button></div>
          </div>
        )}
        {!miss && !right && <NibSays mood="think">What must be real for the answer to be true? Pick the cheapest tool that makes all of it real.</NibSays>}
      </div>
      {board}
    </div>
  );
}
