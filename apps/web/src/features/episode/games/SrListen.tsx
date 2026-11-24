'use client';
// Mini-game for ax.2-2: each card is a control on Rahi's search screen (its `visual`, a key of `RAHI_CONTROLS`). The
// screen rings the control, and the bubble shows what a screen reader says on it (`announce`); “Hear it” speaks it
// with the browser's voice where there is one. Decide what the control fails to tell Farhan: its role, its name, its
// state, or nothing (`srGap`). Scored on the first call. Then the code before and after, and what he hears once it's
// fixed (`fixedControl`). The end lists every control by verdict, with its fixed announcement.
import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { CheckIcon, SpeakerHighIcon, XIcon } from '@phosphor-icons/react/ssr';
import { announce, fixedControl, RAHI_CONTROLS, type Episode, type RahiControl, type SrControl, type SrGap } from '@shape/content';
import { Button } from '@/components/base/buttons/button';
import { cx } from '@/utils/cx';
import { Burst, NibSays, StageTitle } from '../kit';
import { CONTROL_BOX, RahiSearch } from '../scenes/SrSemantics';
import type { GameResult } from './DiamondSort';
import { play } from '@/lib/sound';

type Game = Episode['game'];
const C = RAHI_CONTROLS as Record<RahiControl, SrControl>;

/** Speaks `text` with the browser's speech synthesis, if it has one. */
const speak = (text: string) => {
  try {
    const s = window.speechSynthesis;
    if (!s) return;
    s.cancel();
    s.speak(new SpeechSynthesisUtterance(text || 'Nothing.'));
  } catch { /* no voice available */ }
};

function Said({ text, tag }: { text: string; tag: string }) {
  return (
    <div className="flex flex-col gap-1 rounded-2xl bg-primary p-3 ring-1 ring-secondary ring-inset">
      <span className="text-xs font-semibold tracking-wide text-tertiary uppercase">{tag}</span>
      <span className={cx('text-lg font-semibold', text ? 'text-primary' : 'text-tertiary italic')}>{text ? `“${text}”` : '(silence)'}</span>
    </div>
  );
}

export function SrListen({ game, onDone }: { game: Game; onDone: (results: GameResult[]) => void }) {
  const [i, setI] = useState(0);
  const [calls, setCalls] = useState<Record<string, SrGap>>({});
  const [canSpeak] = useState(() => typeof window !== 'undefined' && 'speechSynthesis' in window);
  useEffect(() => () => { try { window.speechSynthesis?.cancel(); } catch { /* none */ } }, []);
  const card = game.cards[i];

  if (!card) {
    const right = game.cards.filter(c => calls[c.id] === c.lane).length;
    return (
      <div className="relative flex flex-col items-center gap-5 py-6 text-center">
        <Burst count={36} />
        <StageTitle eyebrow="What Farhan hears now" title={`${right} of ${game.cards.length} controls called right`}>
          Every control says its name, its role, and its state when it has one.
        </StageTitle>
        <div className="grid w-full gap-3 text-left sm:grid-cols-2">
          {game.lanes.map(l => (
            <section key={l.id} className="flex flex-col gap-2 rounded-2xl bg-secondary p-3">
              <h2 className="text-sm font-semibold text-primary">{l.id === 'ok' ? l.label : `${l.label} missing`}</h2>
              {game.cards.filter(c => c.lane === l.id).map(c => {
                const ctl = C[c.visual as RahiControl], now = announce(fixedControl(ctl));
                return (
                  <figure key={c.id} className={cx('flex flex-col gap-1 rounded-xl bg-primary p-3 ring-1 ring-inset', calls[c.id] === c.lane ? 'ring-secondary' : 'ring-error')}>
                    <figcaption className="text-xs font-semibold text-tertiary">{c.label}</figcaption>
                    <span className="text-sm text-primary">{now ? `“${now}”` : '(skipped, as it should be)'}</span>
                  </figure>
                );
              })}
            </section>
          ))}
        </div>
        <NibSays mood={right === game.cards.length ? 'cheer' : 'idle'}>Native elements first, a name for every icon, a state for anything that changes. Then test it with NVDA, VoiceOver or TalkBack, not with your eyes.</NibSays>
        <Button size="xl" onPress={() => onDone(game.cards.map(c => ({ id: c.id, correct: calls[c.id] === c.lane })))}>Continue the story</Button>
      </div>
    );
  }

  const key = card.visual as RahiControl, ctl = C[key];
  const mine = calls[card.id], ok = mine === card.lane;
  const before = announce(ctl), after = announce(fixedControl(ctl));
  const call = (g: SrGap) => { if (mine) return; play(g === card.lane ? 'correct' : 'wrong'); setCalls(cs => ({ ...cs, [card.id]: g })); };

  return (
    <div className="flex flex-col gap-5">
      <StageTitle eyebrow="Play" title={game.title}>{game.instructions}</StageTitle>
      <div className="flex items-baseline justify-between gap-3">
        <span className="text-lg font-semibold text-primary">{card.label}</span>
        <span className="shrink-0 text-sm font-semibold text-tertiary tabular-nums">{i + 1} / {game.cards.length}</span>
      </div>
      <motion.div key={card.id} initial={{ y: -10, opacity: 0 }} animate={mine && !ok ? { x: [0, -10, 10, -6, 6, 0], opacity: 1, y: 0 } : { y: 0, opacity: 1 }} transition={{ duration: 0.4 }}
        className="grid items-start gap-4 sm:grid-cols-[minmax(0,17rem)_1fr]" data-current-card>
        <svg viewBox="-8 -8 416 456" className="mx-auto w-full max-w-72 rounded-2xl bg-secondary" aria-hidden>
          <RahiSearch x={0} y={0} focus={CONTROL_BOX[key]} />
        </svg>
        <div className="flex flex-col gap-3">
          <div aria-live="polite"><Said tag={mine ? 'Before' : 'The screen reader says'} text={before} /></div>
          {canSpeak && <Button size="sm" color="secondary" iconLeading={<SpeakerHighIcon data-icon weight="bold" />} onPress={() => speak(mine ? after : before)}>Hear it{mine ? ' fixed' : ''}</Button>}
          <div role="group" aria-label="What it fails to tell him" className="grid grid-cols-2 gap-2">
            {game.lanes.map(l => {
              const g = l.id as SrGap;
              return (
                <button key={l.id} type="button" aria-pressed={mine === g} disabled={!!mine} onClick={() => call(g)}
                  className={cx('flex flex-col items-start gap-1 rounded-2xl bg-primary px-3 py-2.5 text-left ring-2 ring-inset transition disabled:cursor-default',
                    !mine && 'ring-secondary hover:bg-primary_hover', mine && g === card.lane && 'ring-mint-600', mine && g === mine && !ok && 'ring-error', mine && g !== mine && g !== card.lane && 'ring-secondary opacity-60')}>
                  <span className="text-sm font-bold text-primary">{l.label}</span>
                  <span className="text-xs leading-tight text-tertiary">{l.hint}</span>
                </button>
              );
            })}
          </div>
          {mine && (
            <div className="flex flex-col gap-2">
              <Said tag="After the fix" text={after} />
              <pre className="overflow-x-auto rounded-xl bg-secondary p-3 text-xs leading-relaxed text-primary"><code>{ctl.code[0] === ctl.code[1] ? ctl.code[1] : `${ctl.code[0]}\n→\n${ctl.code[1]}`}</code></pre>
            </div>
          )}
        </div>
      </motion.div>
      {mine && (
        <>
          <NibSays mood={ok ? 'cheer' : 'sad'}>
            <span className="inline-flex items-center gap-1 font-semibold">{ok ? <CheckIcon className="size-4" weight="bold" /> : <XIcon className="size-4" weight="bold" />}{card.lane === 'ok' ? 'Says it all' : `${game.lanes.find(l => l.id === card.lane)!.label} missing`}.</span>{' '}{card.note}
          </NibSays>
          <div className="flex justify-end"><Button size="lg" onPress={() => { try { window.speechSynthesis?.cancel(); } catch { /* none */ } setI(n => n + 1); }}>{i + 1 < game.cards.length ? 'Next control' : 'See what he hears'}</Button></div>
        </>
      )}
    </div>
  );
}
