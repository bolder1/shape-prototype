'use client';
// Mini-game for ia.1-3: first a quick look at the four patterns as live wireframes, then product briefs arrive one at a
// time and you pick the navigation that fits. Misses explain the rule and come back round (Classify).
import { useState } from 'react';
import { motion } from 'motion/react';
import type { Episode } from '@shape/content';
import { springs } from '@shape/ui';
import { Button } from '@/components/base/buttons/button';
import { FAMILY_SOLID, NibSays, StageTitle } from '../kit';
import { Classify } from './Classify';
import type { GameResult } from './DiamondSort';

type Game = Episode['game'];

/** A tiny wireframe of each pattern. White strokes, so it reads on the coloured lane buttons. */
export function PatternArt({ id, size = 56 }: { id: string; size?: number }) {
  const s = { fill: 'none', stroke: 'currentColor', strokeWidth: 2.2, strokeLinecap: 'round' as const };
  return (
    <svg viewBox="0 0 40 56" width={size * 0.72} height={size} className="text-white">
      <rect x={1.5} y={1.5} width={37} height={53} rx={6} {...s} />
      {id === 'tab' && (<><line x1={1.5} y1={44} x2={38.5} y2={44} {...s} />{[9, 17, 24, 31].map(x => <circle key={x} cx={x} cy={50} r={1.8} fill="currentColor" />)}<rect x={7} y={9} width={26} height={8} rx={2} {...s} /><rect x={7} y={21} width={26} height={8} rx={2} {...s} /></>)}
      {id === 'side' && (<><line x1={14} y1={1.5} x2={14} y2={54.5} {...s} />{[9, 16, 23, 30, 37, 44].map(y => <line key={y} x1={5} y1={y} x2={10} y2={y} {...s} />)}<rect x={18} y={8} width={16} height={10} rx={2} {...s} /></>)}
      {id === 'hub' && [[6, 9], [22, 9], [6, 24], [22, 24], [6, 39], [22, 39]].map(([x, y]) => <rect key={`${x}${y}`} x={x} y={y} width={12} height={11} rx={2.5} {...s} />)}
      {id === 'step' && (<><line x1={8} y1={12} x2={32} y2={12} {...s} />{[8, 16, 24, 32].map((x, i) => <circle key={x} cx={x} cy={12} r={3} fill={i < 2 ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={2} />)}<rect x={7} y={22} width={26} height={7} rx={2} {...s} /><rect x={7} y={33} width={26} height={7} rx={2} {...s} /><rect x={20} y={45} width={13} height={6} rx={2} fill="currentColor" /></>)}
    </svg>
  );
}

export function PatternFit({ game, onDone }: { game: Game; onDone: (results: GameResult[]) => void }) {
  const [started, setStarted] = useState(false);
  if (started) return <Classify game={game} title="Which navigation fits?" onDone={onDone} laneArt={id => <PatternArt id={id} />} />;
  return (
    <div className="flex flex-col gap-5">
      <StageTitle eyebrow="Play" title={game.title}>{game.instructions}</StageTitle>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {game.lanes.map((l, i) => (
          <motion.div key={l.id} initial={{ y: 16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ ...springs.pop, delay: i * 0.08 }}
            className="flex flex-col items-center gap-2 rounded-2xl px-3 py-4 text-center text-white" style={{ background: FAMILY_SOLID[[0, 1, 3, 2][i % 4]] }}>
            <PatternArt id={l.id} size={72} />
            <span className="text-md font-bold">{l.label}</span>
            <span className="text-xs font-medium opacity-90">{l.hint}</span>
          </motion.div>
        ))}
      </div>
      <NibSays mood="think">Ask two things: how many places are there, and do people switch between them or walk through them in order?</NibSays>
      <div className="flex justify-end"><Button size="lg" onPress={() => setStarted(true)}>Start the briefs</Button></div>
    </div>
  );
}
