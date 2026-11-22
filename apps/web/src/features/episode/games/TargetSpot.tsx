'use client';
// Mini-game for ax.1-4: a checkout screen built from real-sized elements (each card's `visual`). Tap the elements that
// fail the thumb or keyboard test to flag them, then hand in: a 44 px "thumb" circle appears over every element,
// with caught / missed / false-alarm marks and each card's `note`. Each card scores on its final call.
import { useState } from 'react';
import { motion } from 'motion/react';
import { CheckIcon, FlagIcon, HouseIcon, ListIcon, MinusIcon, PlusIcon, UserIcon, XIcon } from '@phosphor-icons/react/ssr';
import type { Episode } from '@shape/content';
import { springs } from '@shape/ui';
import { Button } from '@/components/base/buttons/button';
import { cx } from '@/utils/cx';
import { Burst, NibSays, StageTitle } from '../kit';
import type { GameResult } from './DiamondSort';
import { play } from '@/lib/sound';

type Game = Episode['game'];

/** The element itself, drawn at real size on a light surface. */
function Element({ visual }: { visual?: string }) {
  switch (visual) {
    case 'close-small': return <span className="grid size-4 place-items-center rounded bg-[#374151] text-[10px] leading-none font-black text-white">×</span>;
    case 'pay-button': return <span className="flex h-12 w-full items-center justify-center rounded-xl bg-[#2563eb] text-sm font-bold text-white">Pay ₹640</span>;
    case 'links-close': return <span className="text-xs text-[#2563eb] underline"><span>Terms</span><span className="ml-1">Privacy</span></span>;
    case 'focus-ring': return <span className="block w-full rounded-lg bg-white px-3 py-2.5 text-sm text-[#6b7280] outline-3 outline-offset-2 outline-[#2563eb] ring-1 ring-[#d1d5db]">Coupon code</span>;
    case 'no-focus': return <span className="block w-full rounded-lg bg-white px-3 py-2.5 text-sm text-[#111827] ring-1 ring-[#d1d5db]">12 MG Road|</span>;
    case 'stepper': return <span className="flex items-center gap-3"><span className="grid size-11 place-items-center rounded-lg bg-[#f3f4f6] text-[#111827]"><MinusIcon className="size-5" weight="bold" /></span><span className="text-sm font-bold text-[#111827]">2</span><span className="grid size-11 place-items-center rounded-lg bg-[#f3f4f6] text-[#111827]"><PlusIcon className="size-5" weight="bold" /></span></span>;
    case 'tiny-check': return <span className="flex items-center gap-1.5 text-xs text-[#374151]"><span className="size-3 rounded-sm ring-1 ring-[#6b7280]" />Send me offers</span>;
    case 'tabs': return <span className="flex w-full justify-around rounded-xl bg-[#f9fafb] py-2 text-[11px] font-semibold text-[#374151]">{[{ I: HouseIcon, n: 'Home' }, { I: ListIcon, n: 'Orders' }, { I: UserIcon, n: 'You' }].map(({ I, n }) => <span key={n} className="flex h-10 flex-col items-center justify-center"><I className="size-5" weight="duotone" />{n}</span>)}</span>;
    default: return null;
  }
}

export function TargetSpot({ game, onDone }: { game: Game; onDone: (results: GameResult[]) => void }) {
  const [flags, setFlags] = useState<string[]>([]);
  const [done, setDone] = useState(false);
  const call = (id: string, lane: string) => flags.includes(id) === (lane === 'problem');
  const right = game.cards.filter(c => call(c.id, c.lane)).length;
  const toggle = (id: string) => { if (done) return; play('tap'); setFlags(f => (f.includes(id) ? f.filter(x => x !== id) : [...f, id])); };

  return (
    <div className="relative flex flex-col gap-5">
      {done && right === game.cards.length && <Burst count={36} />}
      <StageTitle eyebrow={done ? 'Audit handed in' : 'Play'} title={done ? `${right} of ${game.cards.length} calls right` : game.title}>
        {done ? 'The dashed circle is a 44 px thumb. Compare it with each target.' : game.instructions}
      </StageTitle>
      <div className="mx-auto flex w-full max-w-md flex-col gap-2 rounded-[2rem] bg-white p-4 ring-8 ring-gray-900/80">
        <p className="px-1 text-sm font-bold text-[#111827]">Checkout</p>
        {game.cards.map(c => {
          const on = flags.includes(c.id), ok = call(c.id, c.lane);
          const mark = !done ? null : c.lane === 'problem' ? (on ? 'caught' : 'missed') : on ? 'false alarm' : null;
          return (
            <motion.button key={c.id} type="button" onClick={() => toggle(c.id)} aria-pressed={on} aria-label={c.label} whileTap={done ? undefined : { scale: 0.98 }}
              className={cx('relative flex min-h-16 flex-col items-start gap-1.5 rounded-xl px-3 py-2.5 text-left ring-2 ring-inset transition-colors',
                !done ? (on ? 'bg-[#fef2f2] ring-[#dc2626]' : 'ring-transparent hover:bg-[#f9fafb]') : ok ? 'ring-[#059669]' : 'ring-[#dc2626]', done && 'cursor-default')}>
              <span className="relative flex w-full items-center">
                <Element visual={c.visual} />
                {done && <span className="pointer-events-none absolute top-1/2 left-0 size-11 -translate-y-1/2 rounded-full border-2 border-dashed border-[#c2410c] bg-[#fdba74]/25" aria-hidden />}
              </span>
              <span className="text-[11px] text-[#6b7280]">{c.label}</span>
              {done && <span className="text-[11px] font-semibold text-[#374151]">{c.note}</span>}
              {!done && on && <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={springs.pop} className="absolute top-2 right-2 grid size-6 place-items-center rounded-full bg-[#dc2626] text-white"><FlagIcon className="size-3.5" weight="fill" /></motion.span>}
              {mark && (
                <span className={cx('absolute top-2 right-2 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-bold text-white', ok ? 'bg-[#047857]' : 'bg-[#b91c1c]')}>
                  {ok ? <CheckIcon className="size-3" weight="bold" /> : <XIcon className="size-3" weight="bold" />}{mark}
                </span>
              )}
            </motion.button>
          );
        })}
      </div>
      {!done ? (
        <div className="flex items-center justify-between gap-3">
          <span className="text-sm text-tertiary">{flags.length} flagged. Tap again to unflag.</span>
          <Button size="lg" iconLeading={FlagIcon} onPress={() => { play(right === game.cards.length ? 'fanfare' : 'reveal'); setDone(true); }}>Hand in the audit</Button>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          <NibSays mood={right === game.cards.length ? 'cheer' : 'idle'}>Anything smaller than the dashed thumb needs a bigger tap area. And every field needs a focus style you can see.</NibSays>
          <div className="flex justify-end"><Button size="xl" onPress={() => onDone(game.cards.map(c => ({ id: c.id, correct: call(c.id, c.lane) })))}>Continue the story</Button></div>
        </div>
      )}
    </div>
  );
}
