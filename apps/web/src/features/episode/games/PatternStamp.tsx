'use client';
// Mini-game for ia.3-3: the five screens of the Khelo booking flow stand empty. Each card is a job one screen must do
// (`visual`, one of KHELO_SCREENS), and that screen is ringed. Pick a pattern from the library tray (card list, chips,
// form, bottom sheet, drawn by the scene's PatternArt). The right pattern is added to the screen; a wrong one is added in
// red and crossed out while the note says why, and the right one takes its place. Scored on the first pick; the end
// shows the five screens built.
import { useState } from 'react';
import { motion } from 'motion/react';
import { CheckIcon, XIcon } from '@phosphor-icons/react/ssr';
import { KHELO_SCREENS, type Episode, type KheloScreen } from '@shape/content';
import { Button } from '@/components/base/buttons/button';
import { cx } from '@/utils/cx';
import { Burst, NibSays, StageTitle } from '../kit';
import { FlowPhone, KHELO_FLOW, PATTERN_H, PATTERN_NAME, PatternArt, type PatternId } from '../scenes/PatternLibrary';
import type { GameResult } from './DiamondSort';
import { play } from '@/lib/sound';

type Game = Episode['game'];
type Card = Game['cards'][number];
const PW = 104, PH = 210, GAP = 14;
const phoneX = (k: number) => 4 + k * (PW + GAP);

function Flow({ cards, decided, target, wrong }: { cards: Card[]; decided: Set<string>; target?: KheloScreen; wrong?: PatternId }) {
  return (
    <svg viewBox={`0 0 ${phoneX(5) - GAP + 4} ${PH + 30}`} className="w-full" role="img" aria-label={`The five booking screens, ${decided.size} parts added`}>
      {KHELO_SCREENS.map((s, k) => {
        const parts = cards.filter(c => c.visual === s && decided.has(c.id)).map(c => c.lane as PatternId);
        const x = phoneX(k), stack = parts.filter(id => id !== 'sheet');
        const wy = 6 + 24 + stack.reduce((a, id) => a + PATTERN_H[id] + 8, 0);
        const on = s === target;
        return (
          <g key={s}>
            {on && <rect x={x - 3} y={3} width={PW + 6} height={PH + 6} rx={16} fill="none" stroke="var(--color-bg-brand-solid)" strokeWidth={2.5} strokeDasharray="6 4" />}
            <FlowPhone x={x} y={6} w={PW} h={PH} parts={parts} />
            {on && wrong && (
              <motion.g initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} style={{ transformOrigin: `${x + PW / 2}px ${wy}px` }}>
                {wrong === 'sheet'
                  ? <PatternArt id="sheet" x={x} y={24} w={PW} screenH={PH - 18} tone="var(--color-fg-error-primary)" />
                  : <PatternArt id={wrong} x={x + 8} y={wy} w={PW - 16} tone="var(--color-fg-error-primary)" />}
                <g stroke="var(--color-fg-error-primary)" strokeWidth={3} strokeLinecap="round">
                  <line x1={x + 10} y1={wrong === 'sheet' ? PH - 60 : wy} x2={x + PW - 10} y2={wrong === 'sheet' ? PH - 10 : wy + Math.max(PATTERN_H[wrong], 20)} />
                </g>
              </motion.g>
            )}
            <text x={x + PW / 2} y={PH + 26} textAnchor="middle" fontSize={12} fontWeight={800} fill={on ? 'var(--color-text-primary)' : 'var(--color-text-tertiary)'}>{k + 1} · {KHELO_FLOW[k].n}</text>
          </g>
        );
      })}
    </svg>
  );
}

export function PatternStamp({ game, onDone }: { game: Game; onDone: (results: GameResult[]) => void }) {
  const [i, setI] = useState(0);
  const [picks, setPicks] = useState<Record<string, string>>({});
  const card = game.cards[i];
  const picked = card ? picks[card.id] : undefined;
  const ok = !!card && picked === card.lane;
  // a card's pattern sits on its screen once decided; a right pick shows straight away
  const decided = new Set(game.cards.filter((c, k) => k < i || (c.id === card?.id && ok)).map(c => c.id));

  const pick = (laneId: string) => {
    if (!card || picked) return;
    play(laneId === card.lane ? 'correct' : 'wrong');
    setPicks(p => ({ ...p, [card.id]: laneId }));
  };

  if (!card) {
    const right = game.cards.filter(c => picks[c.id] === c.lane).length;
    return (
      <div className="relative flex flex-col items-center gap-5 py-6 text-center">
        <Burst count={36} />
        <StageTitle eyebrow="Flow built" title={`${right} of ${game.cards.length} patterns picked right`}>
          Five screens from four patterns, each one already familiar to the people who’ll use it.
        </StageTitle>
        <div className="w-full rounded-2xl bg-secondary p-3"><Flow cards={game.cards} decided={new Set(game.cards.map(c => c.id))} /></div>
        <NibSays mood={right === game.cards.length ? 'cheer' : 'idle'}>Make each pattern one component in your library and drop in copies. Change the component once, and every screen updates.</NibSays>
        <Button size="xl" onPress={() => onDone(game.cards.map(c => ({ id: c.id, correct: picks[c.id] === c.lane })))}>Continue the story</Button>
      </div>
    );
  }

  const screen = KHELO_FLOW.find(s => s.id === card.visual)!;
  return (
    <div className="flex flex-col gap-5">
      <StageTitle eyebrow="Play" title={game.title}>{game.instructions}</StageTitle>
      <div className="rounded-2xl bg-secondary p-3"><Flow cards={game.cards} decided={decided} target={card.visual as KheloScreen} wrong={picked && !ok ? (picked as PatternId) : undefined} /></div>
      <div className="flex items-baseline justify-between">
        <span className="text-sm font-semibold text-tertiary">Screen {KHELO_SCREENS.indexOf(screen.id) + 1} · {screen.n}</span>
        <span className="text-sm font-semibold text-tertiary tabular-nums">{i + 1} / {game.cards.length}</span>
      </div>
      <motion.div key={card.id} initial={{ y: -12, opacity: 0 }} animate={picked && !ok ? { x: [0, -10, 10, -6, 6, 0], opacity: 1, y: 0 } : { y: 0, opacity: 1 }} transition={{ duration: 0.4 }}
        className={cx('rounded-2xl bg-primary px-5 py-4 text-lg font-semibold text-primary shadow-lg ring-2 ring-inset', !picked ? 'ring-secondary' : ok ? 'ring-mint-600' : 'ring-error')} data-current-card>
        {card.label}
      </motion.div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {game.lanes.map(l => (
          <motion.button key={l.id} type="button" onClick={() => pick(l.id)} disabled={!!picked} whileTap={{ scale: 0.96 }}
            className={cx('flex flex-col items-start gap-2 rounded-2xl bg-primary px-3 py-3 text-left ring-2 ring-secondary ring-inset transition disabled:cursor-default',
              !picked && 'hover:bg-primary_hover', picked && l.id !== picked && l.id !== card.lane && 'opacity-40', picked && l.id === card.lane && 'ring-mint-600', picked === l.id && !ok && 'ring-error')}>
            <svg viewBox="0 0 96 70" className="h-14 w-full" aria-hidden>
              <rect x={0.75} y={0.75} width={94.5} height={68.5} rx={8} fill="var(--color-bg-secondary)" />
              <PatternArt id={l.id as PatternId} x={l.id === 'sheet' ? 0.75 : 8} y={l.id === 'sheet' ? 0.75 : l.id === 'chips' ? 24 : 4} w={l.id === 'sheet' ? 94.5 : 80} screenH={68.5} />
            </svg>
            <span className="text-sm font-bold text-primary">{PATTERN_NAME[l.id as PatternId] ?? l.label}</span>
            <span className="text-xs leading-tight text-tertiary">{l.hint}</span>
          </motion.button>
        ))}
      </div>
      {picked && (
        <NibSays mood={ok ? 'cheer' : 'sad'}>
          <span className="inline-flex items-center gap-1 font-semibold">{ok ? <CheckIcon className="size-4" weight="bold" /> : <XIcon className="size-4" weight="bold" />}{game.lanes.find(l => l.id === card.lane)?.label}.</span>{' '}{card.note}
        </NibSays>
      )}
      {picked && <div className="flex justify-end"><Button size="lg" onPress={() => setI(k => k + 1)}>{i + 1 < game.cards.length ? 'Next job' : 'See the flow'}</Button></div>}
    </div>
  );
}
