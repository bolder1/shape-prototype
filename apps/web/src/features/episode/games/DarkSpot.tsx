'use client';
// Mini-game for gr.1-4: each card draws a piece of a checkout or subscription flow (its `visual`). Dark pattern or fair?
// Every card's `note` names the pattern or says why it's fair. Scored on the first pick.
import { useState } from 'react';
import { motion } from 'motion/react';
import { CheckIcon, ProhibitIcon, XIcon } from '@phosphor-icons/react/ssr';
import type { Episode } from '@shape/content';
import { Button } from '@/components/base/buttons/button';
import { cx } from '@/utils/cx';
import { Burst, NibSays, StageTitle } from '../kit';
import type { GameResult } from './DiamondSort';
import { play } from '@/lib/sound';

type Game = Episode['game'];

const Box = ({ on }: { on: boolean }) => <span className={cx('grid size-4 place-items-center rounded ring-2 ring-[#2563eb]', on ? 'bg-[#2563eb]' : 'bg-white')}>{on && <CheckIcon className="size-3 text-white" weight="bold" />}</span>;
const Row = ({ l, r, b }: { l: string; r: string; b?: boolean }) => <span className={cx('flex justify-between gap-6 text-sm text-[#111827]', b && 'font-bold')}><span>{l}</span><span>{r}</span></span>;

/** A small piece of UI, on white. */
function Piece({ visual }: { visual?: string }) {
  switch (visual) {
    case 'confirmshame':
    case 'decline-plain':
      return (
        <div className="flex w-64 flex-col items-center gap-3 rounded-xl p-4 ring-1 ring-[#e5e7eb]">
          <span className="text-md font-bold text-[#111827]">Get 10% off your next order?</span>
          <span className="w-full rounded-lg bg-[#2563eb] py-2 text-center text-sm font-bold text-white">Yes, please</span>
          <span className={cx('text-[#6b7280]', visual === 'confirmshame' ? 'text-[11px]' : 'w-full rounded-lg py-2 text-center text-sm font-semibold ring-1 ring-[#d1d5db]')}>{visual === 'confirmshame' ? 'No thanks, I don’t like saving money' : 'No thanks'}</span>
        </div>
      );
    case 'preticked':
    case 'optin':
      return (
        <div className="flex w-64 flex-col gap-2 rounded-xl p-4 ring-1 ring-[#e5e7eb]">
          <Row l="Bus ticket, Pune → Goa" r="₹1,150" />
          <span className="flex items-center gap-2 text-sm text-[#374151]"><Box on={visual === 'preticked'} />Travel insurance ₹149</span>
        </div>
      );
    case 'fake-timer':
    case 'real-deadline':
      return <span className={cx('rounded-lg px-4 py-2 text-sm font-bold', visual === 'fake-timer' ? 'bg-[#fef2f2] text-[#b91c1c]' : 'bg-[#ecfdf5] text-[#047857]')}>{visual === 'fake-timer' ? 'Offer ends in 09:59 ⏳' : 'Sale ends Sunday, 30 November'}</span>;
    case 'cancel-call':
    case 'cancel-easy':
      return visual === 'cancel-call'
        ? <div className="w-64 rounded-xl p-4 text-sm text-[#374151] ring-1 ring-[#e5e7eb]">To cancel your membership, call <b>1800-XXX-XXXX</b> between <b>10 and 11 am</b>, Monday to Friday.</div>
        : <div className="flex w-64 flex-col gap-2 rounded-xl p-4 ring-1 ring-[#e5e7eb]"><span className="text-sm font-bold text-[#111827]">Membership</span><span className="rounded-lg py-2 text-center text-sm font-semibold text-[#b91c1c] ring-1 ring-[#fecaca]">Cancel subscription</span></div>;
    case 'hidden-fee':
    case 'total-upfront':
      return (
        <div className="flex w-64 flex-col gap-1.5 rounded-xl p-4 ring-1 ring-[#e5e7eb]">
          <span className="text-xs font-semibold text-[#6b7280]">{visual === 'hidden-fee' ? 'Payment · step 4 of 4' : 'Cart · step 1 of 4'}</span>
          <Row l="Movie tickets × 2" r="₹500" />
          <Row l="Convenience fee" r="₹99" />
          <Row l="Total" r="₹599" b />
        </div>
      );
    default: return null;
  }
}

export function DarkSpot({ game, onDone }: { game: Game; onDone: (results: GameResult[]) => void }) {
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
        <StageTitle eyebrow="Game over" title={`${right} of ${game.cards.length} called right`}>If it only works when people don’t notice, it’s a dark pattern.</StageTitle>
        <NibSays mood={right === game.cards.length ? 'cheer' : 'idle'}>Every dark card had a fair twin that does the same job honestly. That twin is always an option.</NibSays>
        <Button size="xl" onPress={() => onDone(game.cards.map(c => ({ id: c.id, correct: !!results[c.id] })))}>Continue the story</Button>
      </div>
    );
  }

  const ok = picked === card.lane;
  return (
    <div className="flex flex-col gap-5">
      <StageTitle eyebrow="Play" title={game.title}>{game.instructions}</StageTitle>
      <div className="flex items-baseline justify-between gap-3">
        <p className="text-md font-semibold text-secondary" data-current-card>{card.label}</p>
        <span className="shrink-0 text-sm font-semibold text-tertiary tabular-nums">{i + 1} / {game.cards.length}</span>
      </div>
      <motion.div animate={picked && !ok ? { x: [0, -10, 10, -6, 6, 0] } : { x: 0 }} transition={{ duration: 0.4 }}
        className={cx('flex min-h-44 items-center justify-center rounded-2xl bg-white p-5 ring-2 ring-inset', !picked ? 'ring-secondary' : ok ? 'ring-mint-600' : 'ring-error')}>
        <Piece visual={card.visual} />
      </motion.div>
      <div className="grid grid-cols-2 gap-3">
        {game.lanes.map(l => (
          <motion.button key={l.id} type="button" onClick={() => pick(l.id)} disabled={!!picked} whileTap={{ scale: 0.96 }}
            className={cx('flex items-center justify-center gap-2 rounded-2xl px-4 py-4 text-lg font-bold text-white transition disabled:cursor-default',
              l.id === 'fair' ? 'bg-mint-700' : 'bg-error-solid', picked && l.id !== picked && l.id !== card.lane && 'opacity-40', picked && l.id === card.lane && 'ring-4 ring-mint-300')}>
            {l.id === 'fair' ? <CheckIcon className="size-5" weight="bold" /> : <ProhibitIcon className="size-5" weight="bold" />}{l.label}
          </motion.button>
        ))}
      </div>
      {picked && (
        <div className="flex flex-col gap-3">
          <NibSays mood={ok ? 'cheer' : 'sad'}>
            <span className="inline-flex items-center gap-1 font-semibold">{ok ? <CheckIcon className="size-4" weight="bold" /> : <XIcon className="size-4" weight="bold" />}{card.lane === 'dark' ? 'Dark pattern.' : 'Fair.'}</span>{' '}
            {card.note}
          </NibSays>
          <div className="flex justify-end"><Button size="lg" onPress={() => { setPicked(null); setI(n => n + 1); }}>{i + 1 < game.cards.length ? 'Next' : 'See results'}</Button></div>
        </div>
      )}
    </div>
  );
}
