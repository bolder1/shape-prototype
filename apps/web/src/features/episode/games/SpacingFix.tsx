'use client';
// Mini-game for ui.1-1: two elements and the gap between them. Pick tight, medium or loose and the gap animates to that
// size, so you see the choice before you're told. Each card's `visual` says which pair to draw. Scored on the first pick.
import { useState } from 'react';
import { motion } from 'motion/react';
import { CheckIcon, StarIcon, XIcon } from '@phosphor-icons/react/ssr';
import type { Episode } from '@shape/content';
import { springs } from '@shape/ui';
import { Button } from '@/components/base/buttons/button';
import { cx } from '@/utils/cx';
import { Burst, FAMILY_SOLID, NibSays, StageTitle } from '../kit';
import type { GameResult } from './DiamondSort';
import { play } from '@/lib/sound';

type Game = Episode['game'];
/** The gap each lane animates to, in px. */
const GAP: Record<string, number> = { t: 6, m: 20, l: 44 };
const PX: Record<string, string> = { t: '4–8', m: '16–24', l: '32–48' };

const Bar = ({ w, h = 10, tone = 'bg-quaternary' }: { w: string; h?: number; tone?: string }) => <span className={cx('block rounded-full', tone)} style={{ width: w, height: h }} />;
const Input = () => <span className="block h-9 w-56 rounded-lg bg-primary ring-1 ring-primary ring-inset" />;
const Block = ({ title }: { title?: boolean }) => (
  <span className="flex flex-col gap-1.5">{title && <Bar w="40%" h={12} tone="bg-fg-quaternary" />}<Bar w="16rem" /><Bar w="13rem" /></span>
);

/** Draws the pair of elements for a card, with `gap` px between them. */
function Pair({ visual, gap }: { visual?: string; gap: number }) {
  const g = { gap } as React.CSSProperties;
  const anim = { animate: { gap }, transition: springs.pop };
  switch (visual) {
    case 'icon-label': return <motion.span {...anim} style={g} className="flex items-center"><StarIcon className="size-6 text-[var(--color-family-design)]" weight="fill" /><Bar w="8rem" h={12} tone="bg-fg-quaternary" /></motion.span>;
    case 'button-pair': return <motion.span {...anim} style={g} className="flex"><span className="rounded-lg bg-secondary px-4 py-2 text-sm font-semibold text-secondary ring-1 ring-primary ring-inset">Cancel</span><span className="rounded-lg bg-brand-solid px-4 py-2 text-sm font-semibold text-white">Save</span></motion.span>;
    case 'card-padding': return <motion.span animate={{ padding: gap }} transition={springs.pop} style={{ padding: gap }} className="block rounded-xl bg-primary ring-1 ring-primary ring-inset"><Block title /></motion.span>;
    case 'label-input': return <motion.span {...anim} style={g} className="flex flex-col"><Bar w="5rem" tone="bg-fg-quaternary" /><Input /></motion.span>;
    case 'name-role': return <motion.span {...anim} style={g} className="flex flex-col items-start"><Bar w="9rem" h={14} tone="bg-fg-quaternary" /><Bar w="6rem" /></motion.span>;
    case 'card-list': return <motion.span {...anim} style={g} className="flex flex-col">{[0, 1].map(i => <span key={i} className="block rounded-xl bg-primary p-3 ring-1 ring-primary ring-inset"><Block /></span>)}</motion.span>;
    case 'form-groups': return <motion.span {...anim} style={g} className="flex flex-col">{['Address', 'Payment'].map(n => <span key={n} className="flex flex-col gap-1.5"><span className="text-xs font-bold text-tertiary uppercase">{n}</span><Input /><Input /></span>)}</motion.span>;
    case 'heading': return <motion.span {...anim} style={g} className="flex flex-col"><Block /><span className="flex flex-col gap-1.5"><Bar w="45%" h={16} tone="bg-fg-quaternary" /><Bar w="16rem" /></span></motion.span>;
    default: return <motion.span {...anim} style={g} className="flex flex-col"><Block title /><Block title /></motion.span>;
  }
}

export function SpacingFix({ game, onDone }: { game: Game; onDone: (results: GameResult[]) => void }) {
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [results, setResults] = useState<Record<string, boolean>>({});
  const card = game.cards[i];
  const right = Object.values(results).filter(Boolean).length;

  const pick = (laneId: string) => {
    if (!card || picked) return;
    const ok = laneId === card.lane;
    play(ok ? 'correct' : 'wrong');
    setPicked(laneId);
    setResults(r => ({ ...r, [card.id]: ok }));
  };

  if (!card) {
    return (
      <div className="relative flex flex-col items-center gap-5 py-6 text-center">
        <Burst count={36} />
        <StageTitle eyebrow="Game over" title={`${right} of ${game.cards.length} gaps on the right step`}>Small inside, big between.</StageTitle>
        <NibSays mood={right === game.cards.length ? 'cheer' : 'idle'}>Quick check for any gap: do these two things belong to each other? Tight. Separate groups? Loose.</NibSays>
        <Button size="xl" onPress={() => onDone(game.cards.map(c => ({ id: c.id, correct: !!results[c.id] })))}>Continue the story</Button>
      </div>
    );
  }

  const ok = picked === card.lane, owner = game.lanes.find(l => l.id === card.lane)!;
  // After a miss, show the right gap.
  const gap = picked ? GAP[ok ? picked : card.lane] : 28;
  return (
    <div className="flex flex-col gap-5">
      <StageTitle eyebrow="Play" title={game.title}>{game.instructions}</StageTitle>
      <div className="flex items-baseline justify-between">
        <p className="text-xl font-semibold text-primary" data-current-card>{card.label}</p>
        <span className="text-sm font-semibold text-tertiary tabular-nums">{i + 1} / {game.cards.length}</span>
      </div>
      <div className={cx('relative flex min-h-64 items-center justify-center rounded-2xl bg-secondary p-6 ring-2 ring-inset transition-colors',
        !picked ? 'ring-secondary' : ok ? 'ring-mint-600' : 'ring-error')}>
        <Pair visual={card.visual} gap={gap} />
        <span className={cx('absolute top-3 right-3 rounded-full px-2.5 py-0.5 text-xs font-bold tabular-nums', picked ? (ok ? 'bg-mint-600 text-white' : 'bg-error-solid text-white') : 'bg-primary text-tertiary')}>
          {picked ? `${PX[ok ? picked : card.lane]}px` : '? px'}
        </span>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {game.lanes.map((l, k) => (
          <motion.button key={l.id} type="button" onClick={() => pick(l.id)} disabled={!!picked} whileTap={{ scale: 0.96 }}
            className={cx('flex flex-col rounded-2xl px-3 py-3 text-left text-white transition disabled:cursor-default', picked && l.id !== picked && l.id !== card.lane && 'opacity-50',
              picked && l.id === card.lane && 'ring-4 ring-mint-500')}
            style={{ background: FAMILY_SOLID[[0, 1, 3][k]] }}>
            <span className="text-md font-bold">{l.label}</span>
            <span className="text-xs font-medium opacity-90">{l.hint}</span>
          </motion.button>
        ))}
      </div>
      {picked && (
        <div className="flex flex-col gap-3">
          <NibSays mood={ok ? 'cheer' : 'sad'}>
            <span className="inline-flex items-center gap-1 font-semibold">{ok ? <CheckIcon className="size-4" weight="bold" /> : <XIcon className="size-4" weight="bold" />}{ok ? 'Right.' : `That’s ${owner.label.split(' ·')[0].toLowerCase()}.`}</span>{' '}
            {owner.hint}.
          </NibSays>
          <div className="flex justify-end"><Button size="lg" onPress={() => { setPicked(null); setI(n => n + 1); }}>{i + 1 < game.cards.length ? 'Next gap' : 'See results'}</Button></div>
        </div>
      )}
    </div>
  );
}
