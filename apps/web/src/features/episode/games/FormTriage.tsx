'use client';
// Mini-game for ia.4-1: Mandi's sign-up form as first drafted, drawn by the scene's MandiForm. Each card points at one
// field (`visual`, a key of MANDI_FIELDS), ringed on the phone. Call the fix it needs: label it, right keyboard, fix
// rules and errors, or cut it. Once called, the field redraws fixed (cut fields close up) and the "time to fill" clock,
// from `formSeconds`, drops. Scored on the call; the end shows the drafted and fixed forms with their times.
import { useState } from 'react';
import { motion } from 'motion/react';
import { CheckIcon, XIcon } from '@phosphor-icons/react/ssr';
import { formSeconds, type Episode, type MandiField } from '@shape/content';
import { Button } from '@/components/base/buttons/button';
import { cx } from '@/utils/cx';
import { Burst, NibSays, StageTitle } from '../kit';
import { FORM_H, FORM_W, MandiForm, mmss } from '../scenes/FormPain';
import type { GameResult } from './DiamondSort';
import { play } from '@/lib/sound';

type Game = Episode['game'];

function Phone({ fixed, focus, label }: { fixed: Partial<Record<MandiField, boolean>>; focus?: MandiField; label: string }) {
  return (
    <svg viewBox={`-4 -4 ${FORM_W + 8} ${FORM_H + 8}`} className="mx-auto w-full max-w-60" role="img" aria-label={label}>
      <MandiForm fixed={fixed} focus={focus} />
    </svg>
  );
}

function Clock({ s, tone }: { s: number; tone: 'idle' | 'good' }) {
  return (
    <div className={cx('flex items-baseline justify-between rounded-2xl bg-primary px-4 py-3 ring-2 ring-inset', tone === 'good' ? 'ring-mint-600' : 'ring-secondary')}>
      <span className="text-sm font-semibold text-tertiary">Time to fill</span>
      <motion.span key={s} initial={{ scale: 1.25 }} animate={{ scale: 1 }} className="text-2xl font-bold text-primary tabular-nums">{mmss(s)}</motion.span>
    </div>
  );
}

export function FormTriage({ game, onDone }: { game: Game; onDone: (results: GameResult[]) => void }) {
  const [i, setI] = useState(0);
  const [calls, setCalls] = useState<Record<string, string>>({});
  const card = game.cards[i];
  const picked = card ? calls[card.id] : undefined;
  // a field shows fixed once its card is decided (the right fix is applied either way)
  const fixed = Object.fromEntries(game.cards.filter(c => calls[c.id]).map(c => [c.visual, true])) as Partial<Record<MandiField, boolean>>;
  const start = formSeconds({}), now = formSeconds(fixed);

  const call = (laneId: string) => {
    if (!card || picked) return;
    play(laneId === card.lane ? 'correct' : 'wrong');
    setCalls(c => ({ ...c, [card.id]: laneId }));
  };

  if (!card) {
    const right = game.cards.filter(c => calls[c.id] === c.lane).length;
    return (
      <div className="relative flex flex-col items-center gap-5 py-6 text-center">
        <Burst count={36} />
        <StageTitle eyebrow="Form fixed" title={`${right} of ${game.cards.length} fixes right`}>
          {`From ${mmss(start)} to ${mmss(now)}, and two fields fewer to get wrong.`}
        </StageTitle>
        <div className="grid w-full grid-cols-2 gap-3">
          {[{ n: `As drafted · ${mmss(start)}`, f: {} }, { n: `Fixed · ${mmss(now)}`, f: fixed }].map(d => (
            <figure key={d.n} className="flex flex-col gap-2 rounded-2xl bg-primary p-3 ring-1 ring-secondary ring-inset">
              <Phone fixed={d.f} label={`Mandi’s sign-up form, ${d.n}`} />
              <figcaption className="text-sm font-semibold text-secondary">{d.n}</figcaption>
            </figure>
          ))}
        </div>
        <NibSays mood={right === game.cards.length ? 'cheer' : 'idle'}>Cut first, then fix what stays. Every field you keep should be one you could explain to the person filling it in.</NibSays>
        <Button size="xl" onPress={() => onDone(game.cards.map(c => ({ id: c.id, correct: calls[c.id] === c.lane })))}>Continue the story</Button>
      </div>
    );
  }

  const ok = picked === card.lane, owner = game.lanes.find(l => l.id === card.lane)!;
  return (
    <div className="flex flex-col gap-5">
      <StageTitle eyebrow="Play" title={game.title}>{game.instructions}</StageTitle>
      <div className="grid items-start gap-4 sm:grid-cols-[15rem_1fr]">
        <div className="flex flex-col gap-3">
          <div className="rounded-2xl bg-primary p-3 ring-1 ring-secondary ring-inset">
            <Phone fixed={fixed} focus={card.visual as MandiField} label={`Mandi’s sign-up form, with one field ringed`} />
          </div>
          <Clock s={now} tone={now < start ? 'good' : 'idle'} />
        </div>
        <div className="flex flex-col gap-4">
          <div className="flex items-baseline justify-between">
            <span className="text-sm font-semibold text-tertiary">The ringed field</span>
            <span className="text-sm font-semibold text-tertiary tabular-nums">{i + 1} / {game.cards.length}</span>
          </div>
          <motion.div key={card.id} initial={{ y: -12, opacity: 0 }} animate={picked && !ok ? { x: [0, -10, 10, -6, 6, 0], opacity: 1, y: 0 } : { y: 0, opacity: 1 }} transition={{ duration: 0.4 }}
            className={cx('rounded-2xl bg-primary px-5 py-4 text-lg font-semibold text-primary shadow-lg ring-2 ring-inset', !picked ? 'ring-secondary' : ok ? 'ring-mint-600' : 'ring-error')} data-current-card>
            {card.label}
          </motion.div>
          <div className="grid grid-cols-2 gap-2">
            {game.lanes.map(l => (
              <motion.button key={l.id} type="button" onClick={() => call(l.id)} disabled={!!picked} whileTap={{ scale: 0.96 }}
                className={cx('flex flex-col items-start gap-1 rounded-2xl bg-primary px-4 py-3 text-left ring-2 ring-secondary ring-inset transition disabled:cursor-default',
                  !picked && 'hover:bg-primary_hover', picked && l.id !== picked && l.id !== card.lane && 'opacity-40', picked && l.id === card.lane && 'ring-mint-600', picked === l.id && !ok && 'ring-error')}>
                <span className="text-sm font-bold text-primary">{l.label}</span>
                <span className="text-xs leading-tight text-tertiary">{l.hint}</span>
              </motion.button>
            ))}
          </div>
          {picked && (
            <NibSays mood={ok ? 'cheer' : 'sad'}>
              <span className="inline-flex items-center gap-1 font-semibold">{ok ? <CheckIcon className="size-4" weight="bold" /> : <XIcon className="size-4" weight="bold" />}{owner.label}.</span>{' '}{card.note}
            </NibSays>
          )}
          {picked && <div className="flex justify-end"><Button size="lg" onPress={() => setI(k => k + 1)}>{i + 1 < game.cards.length ? 'Next field' : 'See both forms'}</Button></div>}
        </div>
      </div>
    </div>
  );
}
