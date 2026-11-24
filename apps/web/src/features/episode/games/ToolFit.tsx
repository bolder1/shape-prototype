'use client';
// Mini-game for rs.3-3: the Dawaa team's three synthesis tools sit side by side: Sunita's persona, a job story and an
// archetype map, each drawn line by line (`TOOL_PARTS`). Each card is a question the team is stuck on; tap the tool
// that answers it and the line that does (`visual`) lights up with why (`note`). A wrong tool shakes and the right one
// lights instead. One call per question.
import { useState } from 'react';
import { motion } from 'motion/react';
import { CheckIcon, XIcon } from '@phosphor-icons/react/ssr';
import { TOOL_PARTS, type Episode, type ToolLane } from '@shape/content';
import { Button } from '@/components/base/buttons/button';
import { cx } from '@/utils/cx';
import { Burst, FAMILY_SOLID, NibSays, StageTitle } from '../kit';
import type { GameResult } from './DiamondSort';
import { play } from '@/lib/sound';

type Game = Episode['game'];

/** What each tool says, line by line (the same study as the scene). */
const TOOL: Record<ToolLane, { title: string; sub: string; lines: Record<string, [string, string]> }> = {
  persona: { title: 'Sunita, 41 · Pune', sub: 'From 7 of 12 interviews', lines: {
    context: ['Context', 'Her mother, 68, lives alone in Nashik.'],
    goal: ['Goal', 'Ma’s four daily medicines never run out.'],
    frustration: ['Frustration', 'Finds out stock is low from a worried call at work.'],
  } },
  job: { title: 'Job story', sub: 'Situation · motivation · outcome', lines: {
    situation: ['When…', 'Ma’s tablets are about to run out and I’m 200 km away,'],
    motivation: ['I want to…', 'know before she does,'],
    outcome: ['So I…', 'am not ordering in a panic.'],
  } },
  arch: { title: 'Archetypes', sub: 'Grouped by behaviour, not age', lines: {
    remote: ['Remote organiser · 7 of 12', 'Orders for someone they can’t see.'],
    self: ['Self-manager · 3 of 12', 'Orders their own, aged 30 to 72.'],
    helper: ['Local helper · 2 of 12', 'A neighbour or chemist who fills the gaps.'],
  } },
};
const LANES = Object.keys(TOOL_PARTS) as ToolLane[];

export function ToolFit({ game, onDone }: { game: Game; onDone: (results: GameResult[]) => void }) {
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [results, setResults] = useState<Record<string, boolean>>({});
  const card = game.cards[i];
  const right = Object.values(results).filter(Boolean).length;

  const call = (laneId: string) => {
    if (!card || picked) return;
    const ok = laneId === card.lane;
    play(ok ? 'correct' : 'wrong');
    setPicked(laneId);
    setResults(r => ({ ...r, [card.id]: ok }));
  };

  const tools = (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      {LANES.map((lane, k) => {
        const tool = TOOL[lane], label = game.lanes.find(l => l.id === lane)?.label ?? lane;
        const isAnswer = !!picked && card?.lane === lane, wrong = picked === lane && card?.lane !== lane;
        return (
          <motion.button key={lane} type="button" onClick={() => call(lane)} disabled={!!picked || !card} whileTap={!picked && card ? { scale: 0.97 } : undefined}
            animate={wrong ? { x: [0, -8, 8, -5, 5, 0] } : {}} transition={{ duration: 0.4 }}
            className={cx('flex flex-col gap-2 rounded-2xl bg-primary p-3 text-left ring-2 ring-inset transition disabled:cursor-default',
              !picked && card && 'hover:bg-primary_hover', isAnswer ? 'ring-mint-600' : wrong ? 'ring-error' : 'ring-secondary', picked && !isAnswer && !wrong && 'opacity-50')}>
            <span className="w-fit rounded-full px-2.5 py-0.5 text-xs font-bold text-white" style={{ background: FAMILY_SOLID[k] }}>{label}</span>
            <span className="flex flex-col">
              <span className="text-md font-bold text-primary">{tool.title}</span>
              <span className="text-xs text-tertiary">{tool.sub}</span>
            </span>
            {TOOL_PARTS[lane].map(part => {
              const [head, text] = tool.lines[part], lit = isAnswer && card?.visual === part;
              return (
                <motion.span key={part} animate={lit ? { scale: [1, 1.03, 1] } : {}} transition={{ duration: 0.4 }}
                  className={cx('flex flex-col rounded-lg px-2 py-1.5 transition-colors', lit ? 'bg-secondary ring-2 ring-mint-600 ring-inset' : 'bg-secondary')}>
                  <span className="text-[11px] font-bold tracking-wide text-tertiary uppercase">{head}</span>
                  <span className="text-sm leading-snug font-medium text-primary">{text}</span>
                </motion.span>
              );
            })}
          </motion.button>
        );
      })}
    </div>
  );

  if (!card) {
    return (
      <div className="relative flex flex-col items-center gap-5 py-6 text-center">
        <Burst count={36} />
        <StageTitle eyebrow="Tools matched" title={`${right} of ${game.cards.length} questions sent to the right tool`}>
          Same 12 interviews, three ways of looking at them.
        </StageTitle>
        <ul className="flex w-full flex-col gap-2 text-left">
          {LANES.map((lane, k) => (
            <li key={lane} className="flex flex-col gap-1 rounded-xl bg-primary px-3 py-2 ring-1 ring-secondary ring-inset">
              <span className="w-fit rounded-full px-2.5 py-0.5 text-xs font-bold text-white" style={{ background: FAMILY_SOLID[k] }}>{game.lanes.find(l => l.id === lane)?.label}</span>
              {game.cards.filter(c => c.lane === lane).map(c => <span key={c.id} className="text-sm text-primary">{c.label}</span>)}
            </li>
          ))}
        </ul>
        <NibSays mood={right === game.cards.length ? 'cheer' : 'idle'}>Who are we designing for? Persona. What progress, against which rivals? Job. How does behaviour differ? Archetypes.</NibSays>
        <Button size="xl" onPress={() => onDone(game.cards.map(c => ({ id: c.id, correct: !!results[c.id] })))}>Continue the story</Button>
      </div>
    );
  }

  const ok = picked === card.lane, answer = game.lanes.find(l => l.id === card.lane)!;
  return (
    <div className="flex flex-col gap-5">
      <StageTitle eyebrow="Play" title={game.title}>{game.instructions}</StageTitle>
      <div className="flex items-baseline justify-between">
        <span className="text-sm font-semibold text-tertiary">The team asks</span>
        <span className="text-sm font-semibold text-tertiary tabular-nums">{i + 1} / {game.cards.length}</span>
      </div>
      <motion.div key={card.id} initial={{ y: -12, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
        className="rounded-2xl rounded-bl-sm bg-primary px-5 py-4 text-lg font-semibold text-primary shadow-lg ring-2 ring-secondary ring-inset" data-current-card>
        {card.label}
      </motion.div>
      {tools}
      {picked && (
        <div className="flex flex-col gap-3">
          <NibSays mood={ok ? 'cheer' : 'sad'}>
            <span className="inline-flex items-center gap-1 font-semibold">{ok ? <CheckIcon className="size-4" weight="bold" /> : <XIcon className="size-4" weight="bold" />}{answer.label}.</span>{' '}{card.note}
          </NibSays>
          <div className="flex justify-end"><Button size="lg" onPress={() => { setPicked(null); setI(n => n + 1); }}>{i + 1 < game.cards.length ? 'Next question' : 'See the tools'}</Button></div>
        </div>
      )}
    </div>
  );
}
