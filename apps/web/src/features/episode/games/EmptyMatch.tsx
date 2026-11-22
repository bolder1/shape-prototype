'use client';
// Mini-game for cw.1-4: a screen is empty for a reason. Pick which kind of empty it is, and the phone fills with the
// empty state that kind needs (icon, one line, one action). Lane ids pick the template: first, done, noresults, error.
import { useState } from 'react';
import { motion } from 'motion/react';
import type { Icon } from '@phosphor-icons/react';
import { BookmarkSimpleIcon, CheckCircleIcon, CheckIcon, MagnifyingGlassIcon, WifiSlashIcon, XIcon } from '@phosphor-icons/react/ssr';
import type { Episode } from '@shape/content';
import { springs } from '@shape/ui';
import { Button } from '@/components/base/buttons/button';
import { cx } from '@/utils/cx';
import { Burst, FAMILY, NibSays, StageTitle } from '../kit';
import type { GameResult } from './DiamondSort';
import { play } from '@/lib/sound';

type Game = Episode['game'];
const TEMPLATE: Record<string, { icon: Icon; line: string; sub: string; btn: string; color: string }> = {
  first: { icon: BookmarkSimpleIcon, line: 'Nothing here yet', sub: 'Here’s what will show up, and how to add the first one.', btn: 'Get started', color: FAMILY[0] },
  done: { icon: CheckCircleIcon, line: 'All done!', sub: 'You cleared everything. Nice work.', btn: 'Back to home', color: 'var(--color-mint-600)' },
  noresults: { icon: MagnifyingGlassIcon, line: 'No matches', sub: 'Try another word, or clear your filters.', btn: 'Clear filters', color: FAMILY[3] },
  error: { icon: WifiSlashIcon, line: 'Couldn’t load this', sub: 'Your data is safe. Check your connection and retry.', btn: 'Try again', color: 'var(--color-fg-error-primary)' },
};

export function EmptyMatch({ game, onDone }: { game: Game; onDone: (results: GameResult[]) => void }) {
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [results, setResults] = useState<Record<string, boolean>>({});
  const card = game.cards[i];
  const right = Object.values(results).filter(Boolean).length;

  if (!card) {
    return (
      <div className="relative flex flex-col items-center gap-5 py-6 text-center">
        <Burst count={36} />
        <StageTitle eyebrow="Game over" title={`${right} of ${game.cards.length} screens filled right`}>Every kind of empty needs its own words.</StageTitle>
        <NibSays mood={right === game.cards.length ? 'cheer' : 'idle'}>Ask why it’s empty first. The words follow from the reason.</NibSays>
        <Button size="xl" onPress={() => onDone(game.cards.map(c => ({ id: c.id, correct: !!results[c.id] })))}>Continue the story</Button>
      </div>
    );
  }

  const ok = picked === card.lane, owner = game.lanes.find(l => l.id === card.lane)!;
  const tpl = picked ? TEMPLATE[card.lane] : null;
  const pick = (laneId: string) => {
    if (picked) return;
    play(laneId === card.lane ? 'correct' : 'wrong');
    setPicked(laneId);
    setResults(r => ({ ...r, [card.id]: laneId === card.lane }));
  };

  return (
    <div className="flex flex-col gap-5">
      <StageTitle eyebrow="Play" title={game.title}>{game.instructions}</StageTitle>
      <div className="grid items-center gap-5 md:grid-cols-[1fr_240px]">
        <div className="flex flex-col gap-4">
          <div className="flex items-baseline justify-between gap-3">
            <motion.p key={card.id} initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={springs.pop} className="text-xl font-semibold text-primary" data-current-card>{card.label}</motion.p>
            <span className="shrink-0 text-sm font-semibold text-tertiary tabular-nums">{i + 1} / {game.cards.length}</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {game.lanes.map(l => {
              const T = TEMPLATE[l.id];
              return (
                <motion.button key={l.id} type="button" onClick={() => pick(l.id)} disabled={!!picked} whileTap={{ scale: 0.96 }}
                  className={cx('flex flex-col rounded-2xl bg-primary px-4 py-3 text-left ring-2 ring-inset transition-colors disabled:cursor-default',
                    picked === l.id ? (ok ? 'ring-mint-600' : 'ring-error') : picked && l.id === card.lane ? 'ring-mint-600' : 'ring-secondary hover:bg-primary_hover',
                    picked && picked !== l.id && l.id !== card.lane && 'opacity-50')}>
                  <span className="inline-flex items-center gap-1.5 text-md font-bold text-primary"><T.icon className="size-4" weight="duotone" style={{ color: T.color }} />{l.label}</span>
                  <span className="text-xs text-tertiary">{l.hint}</span>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* the phone, empty until you decide */}
        <div className="mx-auto flex h-80 w-full max-w-[240px] flex-col rounded-[2rem] bg-primary p-4 shadow-xl ring-2 ring-secondary ring-inset">
          <span className="block h-3 w-1/2 rounded-full bg-quaternary" />
          <div className="flex flex-1 flex-col items-center justify-center gap-2 text-center">
            {tpl ? (
              <motion.div key={card.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={springs.pop} className="flex flex-col items-center gap-2">
                <span className="grid size-14 place-items-center rounded-full" style={{ background: `color-mix(in srgb, ${tpl.color} 15%, transparent)` }}>
                  <tpl.icon className="size-7" weight="duotone" style={{ color: tpl.color }} />
                </span>
                <span className="text-md font-bold text-primary">{tpl.line}</span>
                <span className="text-xs text-tertiary">{tpl.sub}</span>
                <span className="mt-2 rounded-lg px-4 py-2 text-sm font-semibold text-white" style={{ background: tpl.color }}>{tpl.btn}</span>
              </motion.div>
            ) : <span className="text-sm text-quaternary">Empty. But why?</span>}
          </div>
        </div>
      </div>

      {picked && (
        <div className="flex flex-col gap-3">
          <NibSays mood={ok ? 'cheer' : 'sad'}>
            <span className="inline-flex items-center gap-1 font-semibold">{ok ? <CheckIcon className="size-4" weight="bold" /> : <XIcon className="size-4" weight="bold" />}{ok ? 'Right.' : `That’s “${owner.label}”.`}</span>{' '}
            {owner.hint}.
          </NibSays>
          <div className="flex justify-end"><Button size="lg" onPress={() => { setPicked(null); setI(n => n + 1); }}>{i + 1 < game.cards.length ? 'Next screen' : 'See results'}</Button></div>
        </div>
      )}
    </div>
  );
}
