'use client';
// Mini-game for ui.2-2: a reading screen on a phone, every piece of text still grey. Each card names one piece (its
// `visual`); pick a step of the scale and that text animates to the size. By the end the whole screen is set.
import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { BookmarkSimpleIcon, CheckIcon, HouseIcon, UserIcon, XIcon } from '@phosphor-icons/react/ssr';
import type { Episode } from '@shape/content';
import { springs } from '@shape/ui';
import { Button } from '@/components/base/buttons/button';
import { cx } from '@/utils/cx';
import { Burst, FAMILY_SOLID, NibSays, StageTitle } from '../kit';
import type { GameResult } from './DiamondSort';
import { play } from '@/lib/sound';

type Game = Episode['game'];
/** px for each step, and the weight and line height that step uses. */
const STEP: Record<string, { px: number; w: number; lh: number }> = {
  display: { px: 39, w: 800, lh: 1.15 }, heading: { px: 25, w: 700, lh: 1.25 }, body: { px: 16, w: 400, lh: 1.55 }, small: { px: 13, w: 500, lh: 1.4 },
};
const TEXT: Record<string, string> = {
  title: 'The slow joy of chai',
  byline: 'By Asha Rao · 6 min read',
  caption: 'Morning chai at a stall in Kolkata',
  section1: 'Where the leaves grow',
  para1: 'Most of India’s tea grows in Assam and Darjeeling, on hills that stay misty all morning.',
  section2: 'Brewing it right',
  para2: 'Boil the water with ginger first, then add the leaves and milk, and let it rise twice.',
};

export function SizeIt({ game, onDone }: { game: Game; onDone: (results: GameResult[]) => void }) {
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [results, setResults] = useState<Record<string, boolean>>({});
  const card = game.cards[i];
  const right = Object.values(results).filter(Boolean).length;
  const set = new Set(game.cards.slice(0, i).map(c => c.visual));   // pieces already sized
  const laneOf = (v: string) => game.cards.find(c => c.visual === v)?.lane;

  // On phones the screen is taller than the viewport: bring the piece being sized into view.
  useEffect(() => {
    if (!window.matchMedia('(max-width: 767px)').matches) return;
    document.querySelector('[data-piece-current]')?.scrollIntoView({ block: 'center', behavior: 'smooth' });
  }, [i]);

  const pick = (laneId: string) => {
    if (!card || picked) return;
    const ok = laneId === card.lane;
    play(ok ? 'correct' : 'wrong');
    setPicked(laneId);
    setResults(r => ({ ...r, [card.id]: ok }));
  };

  /** One piece of text on the phone: grey skeleton until it's sized, highlighted while it's the current card. */
  const piece = (v: string, as: 'h1' | 'h2' | 'p' = 'p') => {
    const current = card?.visual === v;
    const lane = current ? (picked ? card.lane : null) : set.has(v) || !card ? laneOf(v) : null;
    const st = lane ? STEP[lane] : null;
    const Tag = motion[as];
    return (
      <Tag key={v} data-piece-current={current || undefined} initial={false} animate={{ fontSize: st?.px ?? 15 }} transition={springs.pop}
        className={cx('rounded-md transition-colors', current && 'outline-2 outline-offset-4', current && (picked ? (picked === card.lane ? 'outline-mint-600' : 'outline-error') : 'outline-dashed outline-brand'),
          st ? (lane === 'small' ? 'text-tertiary' : 'text-primary') : current ? 'text-secondary' : 'text-quaternary')}
        style={{ fontWeight: st?.w ?? 500, lineHeight: st?.lh ?? 1.4 }}>
        {st || current ? TEXT[v] : <span className="inline-block h-3 w-3/4 rounded-full bg-quaternary align-middle" />}
      </Tag>
    );
  };

  const tabsLane = card?.visual === 'tabs' ? (picked ? card.lane : null) : set.has('tabs') || !card ? laneOf('tabs') : null;
  const phone = (
    <div className="mx-auto w-full max-w-[340px] overflow-hidden text-left rounded-[2rem] bg-primary shadow-lg ring-8 ring-gray-900/80">
      <div className="flex flex-col gap-3 px-5 pt-6 pb-4">
        {piece('title', 'h1')}
        {piece('byline')}
        <div className="flex flex-col gap-1.5">
          <div className="h-28 rounded-xl bg-[linear-gradient(135deg,var(--color-family-build),var(--color-family-design))] opacity-70" />
          {piece('caption')}
        </div>
        {piece('section1', 'h2')}
        {piece('para1')}
        {piece('section2', 'h2')}
        {piece('para2')}
      </div>
      <div data-piece-current={card?.visual === 'tabs' || undefined} className={cx('flex justify-around border-t border-secondary px-4 py-2.5', card?.visual === 'tabs' && 'outline-2 -outline-offset-4', card?.visual === 'tabs' && (picked ? (picked === card.lane ? 'outline-mint-600' : 'outline-error') : 'outline-dashed outline-brand'))}>
        {[{ n: 'Home', I: HouseIcon }, { n: 'Saved', I: BookmarkSimpleIcon }, { n: 'Profile', I: UserIcon }].map(({ n, I }) => (
          <span key={n} className="flex flex-col items-center gap-0.5 text-secondary">
            <I className="size-5" weight="duotone" />
            <motion.span initial={false} animate={{ fontSize: tabsLane ? STEP[tabsLane].px : 15 }} transition={springs.pop} className="font-semibold">{n}</motion.span>
          </span>
        ))}
      </div>
    </div>
  );

  if (!card) {
    return (
      <div className="relative flex flex-col items-center gap-5 py-6 text-center">
        <Burst count={36} />
        <StageTitle eyebrow="Screen set" title={`${right} of ${game.cards.length} sized first time`}>Four steps, every piece of text on one.</StageTitle>
        <div className="w-full">{phone}</div>
        <NibSays mood={right === game.cards.length ? 'cheer' : 'idle'}>Both section headings share one step. That’s what makes them read as the same level.</NibSays>
        <Button size="xl" onPress={() => onDone(game.cards.map(c => ({ id: c.id, correct: !!results[c.id] })))}>Continue the story</Button>
      </div>
    );
  }

  const ok = picked === card.lane, owner = game.lanes.find(l => l.id === card.lane)!;
  return (
    <div className="flex flex-col gap-5">
      <StageTitle eyebrow="Play" title={game.title}>{game.instructions}</StageTitle>
      <div className="grid items-start gap-6 md:grid-cols-[340px_1fr]">
        {phone}
        {/* on phones the controls stick to the bottom of the screen, over the phone */}
        <div className="flex flex-col gap-4 max-md:sticky max-md:bottom-0 max-md:z-10 max-md:-mx-4 max-md:border-t max-md:border-secondary max-md:bg-primary max-md:px-4 max-md:pt-3 max-md:pb-16">
          <div className="flex items-baseline justify-between gap-3">
            <p className="text-xl font-semibold text-primary" data-current-card>{card.label}</p>
            <span className="shrink-0 text-sm font-semibold text-tertiary tabular-nums">{i + 1} / {game.cards.length}</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {game.lanes.map((l, k) => (
              <motion.button key={l.id} type="button" onClick={() => pick(l.id)} disabled={!!picked} whileTap={{ scale: 0.96 }}
                className={cx('flex flex-col rounded-2xl px-3 py-3 text-left text-white transition disabled:cursor-default', picked && l.id !== picked && l.id !== card.lane && 'opacity-50',
                  picked && l.id === card.lane && 'ring-4 ring-mint-500')}
                style={{ background: FAMILY_SOLID[k % 4] }}>
                <span className="text-md font-bold">{l.label}</span>
                <span className="text-xs font-medium opacity-90">{l.hint}</span>
              </motion.button>
            ))}
          </div>
          {picked && (
            <div className="flex flex-col gap-3">
              <NibSays mood={ok ? 'cheer' : 'sad'}>
                <span className="inline-flex items-center gap-1 font-semibold">{ok ? <CheckIcon className="size-4" weight="bold" /> : <XIcon className="size-4" weight="bold" />}{ok ? 'Set.' : `That one’s ${owner.label.split(' ·')[0].toLowerCase()}.`}</span>{' '}
                {owner.hint}.
              </NibSays>
              <div className="flex justify-end"><Button size="lg" onPress={() => { setPicked(null); setI(n => n + 1); }}>{i + 1 < game.cards.length ? 'Next piece' : 'See the screen'}</Button></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
