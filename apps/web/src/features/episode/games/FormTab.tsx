'use client';
// Mini-game for ax.2-3: Rahi's passenger form just after Farhan pressed Pay, its fields in Tab order (each card's
// `visual`, a key of `RAHI_FIELDS`). Press Tab to move focus to the next field: you see it as a sighted person does
// (label or only a placeholder, red border, error text) and read what NVDA says on it (`fieldAnnounce`). Flag the field:
// no real label, error not in text, error with no fix, or fine (`fieldFlaw`). Scored on the first flag. The end groups
// every field by verdict, with its fix.
import { useState } from 'react';
import { motion } from 'motion/react';
import { CheckIcon, ArrowLineRightIcon, XIcon } from '@phosphor-icons/react/ssr';
import { fieldAnnounce, RAHI_FIELDS, type Episode, type FormField, type FormFlaw, type RahiField } from '@shape/content';
import { Button } from '@/components/base/buttons/button';
import { cx } from '@/utils/cx';
import { Burst, NibSays, StageTitle } from '../kit';
import type { GameResult } from './DiamondSort';
import { play } from '@/lib/sound';

type Game = Episode['game'];
const F = RAHI_FIELDS as Record<RahiField, FormField>;

/** One field as it looks after the failed submit. Drawn, not real: it's a picture of a broken form. */
function FieldView({ f, focused }: { f: FormField; focused: boolean }) {
  const err = !!f.error;
  const ring = focused ? 'outline-3 outline-offset-2 outline-[#C4320A]' : '';
  if (f.kind !== 'text') {
    const on = f.value === 'checked';
    return (
      <div className="flex flex-col gap-1">
        <div className={cx('flex items-center gap-2 rounded-lg p-1', ring)}>
          <span className={cx('grid size-5 shrink-0 place-items-center border-2 bg-primary', f.kind === 'radio' ? 'rounded-full' : 'rounded', err ? 'border-[#D92D20]' : 'border-primary')}>
            {on && <span className={cx('bg-brand-solid', f.kind === 'radio' ? 'size-2.5 rounded-full' : 'size-3 rounded-sm')} />}
          </span>
          <span className="text-sm text-primary">{f.label}{err && !f.error?.text && <span className="text-[#D92D20]"> *</span>}</span>
        </div>
        {err && f.error?.text && <span className="text-xs font-semibold text-error-primary">{f.error.text}</span>}
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-1">
      {f.label && <span className="text-xs font-semibold text-secondary">{f.label}</span>}
      <span className={cx('block rounded-lg bg-primary px-3 py-2 text-sm text-primary ring-inset', err ? 'ring-2 ring-[#D92D20]' : 'ring-1 ring-primary', ring)}>{f.value}</span>
      {err && f.error?.text && <span className="text-xs font-semibold text-error-primary">{f.error.text}</span>}
    </div>
  );
}

export function FormTab({ game, onDone }: { game: Game; onDone: (results: GameResult[]) => void }) {
  const [i, setI] = useState(-1);
  const [flags, setFlags] = useState<Record<string, FormFlaw>>({});
  const [done, setDone] = useState(false);

  if (done) {
    const right = game.cards.filter(c => flags[c.id] === c.lane).length;
    const broken = game.cards.filter(c => c.lane !== 'ok').length;
    return (
      <div className="relative flex flex-col items-center gap-5 py-6 text-center">
        <Burst count={36} />
        <StageTitle eyebrow="Rahi’s passenger form" title={`${right} of ${game.cards.length} fields flagged right`}>
          {broken} of {game.cards.length} fields let Farhan down. Each fix is a label, a linked message, or better words.
        </StageTitle>
        <div className="grid w-full gap-3 text-left sm:grid-cols-2">
          {game.lanes.map(l => (
            <section key={l.id} className="flex flex-col gap-2 rounded-2xl bg-secondary p-3">
              <h2 className={cx('text-sm font-semibold', l.id === 'ok' ? 'text-primary' : 'text-error-primary')}>{l.label}</h2>
              {game.cards.filter(c => c.lane === l.id).map(c => (
                <figure key={c.id} className={cx('flex flex-col gap-1 rounded-xl bg-primary p-3 ring-1 ring-inset', flags[c.id] === c.lane ? 'ring-secondary' : 'ring-error')}>
                  <span className="text-sm font-semibold text-primary">{c.label}</span>
                  <figcaption className="text-xs text-tertiary">{c.note}</figcaption>
                </figure>
              ))}
            </section>
          ))}
        </div>
        <NibSays mood={right === game.cards.length ? 'cheer' : 'idle'}>A label that stays, an error in words that’s linked to its field, and a message that says how to fix it. Then move focus to a summary, so nobody presses Pay into silence.</NibSays>
        <Button size="xl" onPress={() => onDone(game.cards.map(c => ({ id: c.id, correct: flags[c.id] === c.lane })))}>Continue the story</Button>
      </div>
    );
  }

  const card = i >= 0 ? game.cards[i] : undefined;
  const f = card ? F[card.visual as RahiField] : undefined;
  const mine = card ? flags[card.id] : undefined, ok = !!card && mine === card.lane;
  const flag = (l: FormFlaw) => { if (!card || mine) return; play(l === card.lane ? 'correct' : 'wrong'); setFlags(fs => ({ ...fs, [card.id]: l })); };
  const canTab = i < 0 || !!mine;
  const tab = () => { if (i + 1 < game.cards.length) setI(n => n + 1); else setDone(true); };

  return (
    <div className="flex flex-col gap-5">
      <StageTitle eyebrow="Play" title={game.title}>{game.instructions}</StageTitle>
      <div className="grid items-start gap-4 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <div className="flex flex-col gap-3 rounded-3xl bg-secondary p-4" aria-hidden>
          <span className="text-sm font-semibold text-primary">Passenger details · Pune → Goa</span>
          {game.cards.map((c, k) => (
            <div key={c.id} className={cx('transition', k === i ? '' : 'opacity-70')}><FieldView f={F[c.visual as RahiField]} focused={k === i} /></div>
          ))}
          <span className="rounded-xl bg-brand-solid py-2.5 text-center text-sm font-semibold text-white">Pay ₹1,280</span>
        </div>
        <div className="flex flex-col gap-3 sm:sticky sm:top-4">
          <div className="flex items-baseline justify-between gap-3">
            <span className="text-lg font-semibold text-primary">{card ? card.label : 'Focus is on Pay ₹1,280'}</span>
            <span className="shrink-0 text-sm font-semibold text-tertiary tabular-nums">{Math.max(0, i + 1)} / {game.cards.length}</span>
          </div>
          <motion.div key={card?.id ?? 'start'} initial={{ y: -8, opacity: 0 }} animate={mine && !ok ? { x: [0, -10, 10, -6, 6, 0], opacity: 1, y: 0 } : { y: 0, opacity: 1 }} transition={{ duration: 0.4 }}
            className="flex flex-col gap-1 rounded-2xl bg-primary p-3 ring-1 ring-secondary ring-inset" aria-live="polite" data-current-card>
            <span className="text-xs font-semibold tracking-wide text-tertiary uppercase">NVDA says</span>
            <span className="text-lg font-semibold text-primary">“{f ? fieldAnnounce(f) : 'Pay ₹1,280, button'}”</span>
          </motion.div>
          {card && (
            <div role="group" aria-label="Flag this field" className="grid grid-cols-2 gap-2">
              {game.lanes.map(l => {
                const id = l.id as FormFlaw;
                return (
                  <button key={l.id} type="button" aria-pressed={mine === id} disabled={!!mine} onClick={() => flag(id)}
                    className={cx('flex flex-col items-start gap-1 rounded-2xl bg-primary px-3 py-2.5 text-left ring-2 ring-inset transition disabled:cursor-default',
                      !mine && 'ring-secondary hover:bg-primary_hover', mine && id === card.lane && 'ring-mint-600', mine && id === mine && !ok && 'ring-error', mine && id !== mine && id !== card.lane && 'ring-secondary opacity-60')}>
                    <span className="text-sm font-bold text-primary">{l.label}</span>
                    <span className="text-xs leading-tight text-tertiary">{l.hint}</span>
                  </button>
                );
              })}
            </div>
          )}
          {card && mine && (
            <NibSays mood={ok ? 'cheer' : 'sad'}>
              <span className="inline-flex items-center gap-1 font-semibold">{ok ? <CheckIcon className="size-4" weight="bold" /> : <XIcon className="size-4" weight="bold" />}{game.lanes.find(l => l.id === card.lane)!.label}.</span>{' '}{card.note}
            </NibSays>
          )}
          {!card && <NibSays mood="think">Farhan pressed Pay and nothing was announced. Press Tab to walk the form the way he does, one field at a time.</NibSays>}
          {canTab && (
            <div className="flex justify-end">
              <Button size="lg" iconTrailing={<ArrowLineRightIcon data-icon weight="bold" />} onPress={tab}>{i + 1 < game.cards.length ? 'Tab to the next field' : 'See the verdicts'}</Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
