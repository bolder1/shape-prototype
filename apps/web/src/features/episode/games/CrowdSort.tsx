'use client';
// Mini-game for ia.1-2: a closed card sort that you take yourself. Tap a card, then a group (or tap a placed card to
// take it back). Once every card is placed, the crowd's votes are revealed: a card counts as right when it's where
// most of the 20 participants put it. Each card's `agree` is that majority share.
import { useState } from 'react';
import { motion } from 'motion/react';
import { CheckIcon, UsersThreeIcon, XIcon } from '@phosphor-icons/react/ssr';
import type { Episode } from '@shape/content';
import { springs } from '@shape/ui';
import { Button } from '@/components/base/buttons/button';
import { cx } from '@/utils/cx';
import { Burst, FAMILY_SOLID, NibSays, StageTitle } from '../kit';
import type { GameResult } from './DiamondSort';
import { play } from '@/lib/sound';

type Game = Episode['game'];
type Card = Game['cards'][number];
const PEOPLE = 20;

/** How strongly the crowd agreed on a card's home. */
const consensus = (agree: number) => (agree >= 75 ? 'Clear home' : 'Split');

export function CrowdSort({ game, onDone }: { game: Game; onDone: (results: GameResult[]) => void }) {
  const [placed, setPlaced] = useState<Record<string, string>>({});
  const [held, setHeld] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const tray = game.cards.filter(c => !placed[c.id]);
  const right = game.cards.filter(c => placed[c.id] === c.lane).length;

  const drop = (laneId: string) => {
    if (!held || revealed) return;
    play('tap');
    setPlaced(p => ({ ...p, [held]: laneId }));
    setHeld(null);
  };
  const lift = (id: string) => { if (revealed) return; setPlaced(p => { const n = { ...p }; delete n[id]; return n; }); setHeld(id); };
  const reveal = () => { play(right === game.cards.length ? 'fanfare' : 'reveal'); setRevealed(true); };

  const chip = (c: Card) => {
    const ok = placed[c.id] === c.lane, home = game.lanes.find(l => l.id === c.lane)!;
    return (
      <motion.li key={c.id} layout layoutId={c.id} transition={springs.pop}>
        <button type="button" onClick={() => (placed[c.id] ? lift(c.id) : setHeld(held === c.id ? null : c.id))} disabled={revealed}
          className={cx('w-full rounded-xl bg-primary px-3 py-2 text-left text-sm font-semibold text-primary shadow-sm ring-2 ring-inset disabled:cursor-default',
            held === c.id ? 'ring-brand-solid' : revealed ? (ok ? 'ring-mint-600' : 'ring-error') : 'ring-secondary')}>
          <span className="flex items-center gap-1.5">
            {revealed && (ok ? <CheckIcon className="size-4 shrink-0 text-mint-600" weight="bold" /> : <XIcon className="size-4 shrink-0 text-error-primary" weight="bold" />)}
            {c.label}
          </span>
          {revealed && (
            <span className="mt-1.5 block">
              <span className="flex flex-wrap items-center justify-between gap-x-2 text-xs font-medium text-tertiary">
                <span className="whitespace-nowrap">{Math.round(((c.agree ?? 0) / 100) * PEOPLE)}/{PEOPLE} chose {home.label}</span>
                <span className={cx('whitespace-nowrap font-bold', (c.agree ?? 0) >= 75 ? 'text-mint-700' : 'text-warning-primary')}>{consensus(c.agree ?? 0)}</span>
              </span>
              <span className="mt-1 block h-1.5 overflow-hidden rounded-full bg-tertiary">
                <motion.span className={cx('block h-full rounded-full', (c.agree ?? 0) >= 75 ? 'bg-mint-600' : 'bg-warning-solid')} initial={{ width: 0 }} animate={{ width: `${c.agree}%` }} transition={springs.gentle} />
              </span>
              {c.note && <span className="mt-1 block text-xs font-medium text-secondary">{c.note}</span>}
            </span>
          )}
        </button>
      </motion.li>
    );
  };

  return (
    <div className="flex flex-col gap-5">
      <StageTitle eyebrow="Play" title={game.title}>{game.instructions}</StageTitle>

      {!revealed && (
        <div className="rounded-2xl bg-secondary p-3 ring-1 ring-secondary ring-inset">
          <p className="mb-2 px-1 text-xs font-semibold tracking-wide text-quaternary uppercase">{tray.length ? (held ? 'Now tap a group' : 'Tap a card') : 'All sorted'}</p>
          <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3">{tray.map(c => chip(c))}</ul>
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-3">
        {game.lanes.map((l, i) => {
          const cards = game.cards.filter(c => placed[c.id] === l.id);
          return (
            <div key={l.id} className={cx('flex min-h-24 flex-col gap-2 rounded-2xl p-3 sm:min-h-40 ring-2 ring-inset transition-colors', held ? 'bg-primary_hover ring-brand' : 'bg-primary ring-secondary')}>
              <button type="button" onClick={() => drop(l.id)} disabled={!held || revealed}
                className="flex flex-col rounded-xl px-3 py-2 text-left text-white disabled:cursor-default" style={{ background: FAMILY_SOLID[i % 4] }}>
                <span className="text-md font-bold">{l.label}</span>
                <span className="text-xs font-medium opacity-90">{l.hint}</span>
              </button>
              <ul className="flex flex-col gap-2">{cards.map(c => chip(c))}</ul>
            </div>
          );
        })}
      </div>

      {!revealed && (
        <div className="flex items-center justify-between gap-3">
          <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-tertiary"><UsersThreeIcon className="size-4" weight="duotone" />{PEOPLE} people sorted these before you</span>
          <Button size="lg" isDisabled={tray.length > 0} onPress={reveal}>Reveal the crowd</Button>
        </div>
      )}
      {revealed && (
        <div className="relative flex flex-col items-center gap-4 text-center">
          {right === game.cards.length && <Burst count={36} />}
          <NibSays mood={right === game.cards.length ? 'cheer' : 'idle'}>
            {right} of {game.cards.length} matched the crowd. The splits matter most: those are the cards to relabel or link from two places.
          </NibSays>
          <Button size="xl" onPress={() => onDone(game.cards.map(c => ({ id: c.id, correct: placed[c.id] === c.lane })))}>Continue the story</Button>
        </div>
      )}
    </div>
  );
}
