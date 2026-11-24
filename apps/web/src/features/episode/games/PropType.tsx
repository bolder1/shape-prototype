'use client';
// Mini-game for ds.3-2: each card is one thing that varies on Rasta's Button, with the values it takes (`visual`). Pick
// the kind of Figma property it should be. The component set on the right redraws with `frameCount` frames, so a
// property made a variant by mistake multiplies the wall in front of you, and the properties panel lists what you've
// set up so far with Figma's type marks.
import { useState } from 'react';
import { motion } from 'motion/react';
import { CheckIcon, XIcon } from '@phosphor-icons/react/ssr';
import { frameCount, propValues, type Episode, type PropType as Kind } from '@shape/content';
import { Button } from '@/components/base/buttons/button';
import { cx } from '@/utils/cx';
import { Burst, NibSays, StageTitle } from '../kit';
import { FIGMA_PURPLE, FrameWall } from '../scenes/VariantExplosion';
import type { GameResult } from './DiamondSort';
import { play } from '@/lib/sound';

type Game = Episode['game'];
const MARK: Record<Kind, string> = { variant: '◇', boolean: '◉', text: 'T', swap: '↻' };
const WALL_W = 420, WALL_H = 300;

function Wall({ n }: { n: number }) {
  return (
    <div className="flex flex-col gap-2 rounded-2xl bg-secondary p-3">
      <div className="flex items-baseline justify-between">
        <span className="text-sm font-semibold text-primary"><span aria-hidden style={{ color: FIGMA_PURPLE }}>◇</span> Button</span>
        <span className="text-sm font-semibold text-tertiary">Frames to draw: <span className={cx('text-lg font-bold tabular-nums', n === 60 ? 'text-success-primary' : 'text-primary')}>{n.toLocaleString('en-IN')}</span></span>
      </div>
      <svg viewBox={`-2 -2 ${WALL_W + 4} ${WALL_H + 4}`} className="w-full" role="img" aria-label={`A Figma component set with ${n} frames`}>
        <FrameWall n={n} w={WALL_W} h={WALL_H} cap={900} />
      </svg>
      {n > 900 && <span className="text-xs font-semibold text-tertiary">Showing 900. {(n - 900).toLocaleString('en-IN')} more not drawn.</span>}
    </div>
  );
}

function Panel({ cards, picks }: { cards: Game['cards']; picks: Record<string, Kind> }) {
  const decided = cards.filter(c => picks[c.id]);
  return (
    <ul className="flex flex-col gap-1.5 rounded-2xl bg-secondary p-3">
      <li className="text-sm font-semibold text-tertiary">Properties</li>
      {decided.length === 0 && <li className="text-sm text-tertiary">None yet.</li>}
      {decided.map(c => (
        <li key={c.id} className={cx('flex items-center gap-2 rounded-lg bg-primary px-2.5 py-1.5 text-sm ring-1 ring-inset', picks[c.id] === c.lane ? 'ring-secondary' : 'ring-error')}>
          <span aria-hidden className="w-4 text-center font-bold" style={picks[c.id] === 'variant' ? { color: FIGMA_PURPLE } : undefined}>{MARK[picks[c.id]]}</span>
          <span className="min-w-0 flex-1 truncate font-semibold text-primary">{c.label.split(':')[0]}</span>
          <span className="shrink-0 text-xs text-tertiary">{picks[c.id] === 'variant' ? `× ${propValues(c.visual ?? '').length}` : 'no frames'}</span>
        </li>
      ))}
    </ul>
  );
}

export function PropType({ game, onDone }: { game: Game; onDone: (results: GameResult[]) => void }) {
  const [i, setI] = useState(0);
  const [picks, setPicks] = useState<Record<string, Kind>>({});
  const card = game.cards[i];
  const picked = card ? picks[card.id] : undefined;
  const n = frameCount(game.cards.filter(c => picks[c.id]).map(c => ({ visual: c.visual, type: picks[c.id] })));


  if (!card) {
    const right = game.cards.filter(c => picks[c.id] === c.lane).length;
    return (
      <div className="relative flex flex-col items-center gap-5 py-6 text-center">
        <Burst count={36} />
        <StageTitle eyebrow="Component set built" title={`${right} of ${game.cards.length} properties of the right kind`}>
          {n === 60 ? 'Sixty frames: hierarchy × size × state. Everything else is set in the properties panel.' : `${n.toLocaleString('en-IN')} frames. The right set needs 60: hierarchy × size × state.`}
        </StageTitle>
        <div className="grid w-full gap-3 text-left sm:grid-cols-[3fr_2fr]"><Wall n={n} /><Panel cards={game.cards} picks={picks} /></div>
        <NibSays mood={n === 60 ? 'cheer' : 'idle'}>Draw a variant only when the drawing changes. Showing a layer, typing words and swapping a nested icon cost no frames at all.</NibSays>
        <Button size="xl" onPress={() => onDone(game.cards.map(c => ({ id: c.id, correct: picks[c.id] === c.lane })))}>Continue the story</Button>
      </div>
    );
  }

  const ok = picked === card.lane;
  const pick = (k: Kind) => { if (picked) return; play(k === card.lane ? 'correct' : 'wrong'); setPicks(p => ({ ...p, [card.id]: k })); };
  const values = propValues(card.visual ?? '');

  return (
    <div className="flex flex-col gap-5">
      <StageTitle eyebrow="Play" title={game.title}>{game.instructions}</StageTitle>
      <div className="flex items-baseline justify-between">
        <span className="text-sm font-semibold text-tertiary">What varies</span>
        <span className="text-sm font-semibold text-tertiary tabular-nums">{i + 1} / {game.cards.length}</span>
      </div>
      <motion.div key={card.id} initial={{ y: -12, opacity: 0 }} animate={picked && !ok ? { x: [0, -10, 10, -6, 6, 0], opacity: 1, y: 0 } : { y: 0, opacity: 1 }} transition={{ duration: 0.4 }}
        className={cx('flex flex-col gap-2 rounded-2xl bg-primary px-5 py-4 shadow-lg ring-2 ring-inset', !picked ? 'ring-secondary' : ok ? 'ring-mint-600' : 'ring-error')} data-current-card>
        <span className="text-lg font-semibold text-primary">{card.label}</span>
        <span className="flex flex-wrap gap-1.5">
          {values.map(v => <span key={v} className="rounded-full bg-secondary px-2 py-0.5 text-xs font-semibold text-secondary">{v}</span>)}
        </span>
      </motion.div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {game.lanes.map(l => (
          <motion.button key={l.id} type="button" onClick={() => pick(l.id as Kind)} disabled={!!picked} whileTap={{ scale: 0.96 }}
            className={cx('flex flex-col items-start gap-1 rounded-2xl bg-primary px-3 py-3 text-left ring-2 ring-secondary ring-inset transition disabled:cursor-default',
              !picked && 'hover:bg-primary_hover', picked && l.id !== picked && l.id !== card.lane && 'opacity-40', picked && l.id === card.lane && 'ring-mint-600', picked === l.id && !ok && 'ring-error')}>
            <span className="text-sm font-bold text-primary"><span aria-hidden>{MARK[l.id as Kind]} </span>{l.label}</span>
            <span className="text-xs leading-tight text-tertiary">{l.hint}</span>
          </motion.button>
        ))}
      </div>
      <div className="grid gap-3 sm:grid-cols-[3fr_2fr]"><Wall n={n} /><Panel cards={game.cards} picks={picks} /></div>
      {picked && (
        <NibSays mood={ok ? 'cheer' : 'sad'}>
          <span className="inline-flex items-center gap-1 font-semibold">{ok ? <CheckIcon className="size-4" weight="bold" /> : <XIcon className="size-4" weight="bold" />}{game.lanes.find(l => l.id === card.lane)?.label}.</span>{' '}
          {!ok && picked === 'variant' && <>As a variant it multiplied the set by {values.length}. </>}
          {card.note}
        </NibSays>
      )}
      {picked && <div className="flex justify-end"><Button size="lg" onPress={() => setI(k => k + 1)}>{i + 1 < game.cards.length ? 'Next' : 'See the set'}</Button></div>}
    </div>
  );
}
