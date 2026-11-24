'use client';
// Mini-game for cw.2-1: each card is a moment in Chaabi (its `visual`, a key of `CHAABI_MOMENTS`). Turn the dial through
// playful, warm, plain and serious, and the phone rewrites the moment's message in that tone, always in Chaabi's voice.
// Lock the tone the moment calls for (`toneFor`: mood sets the start, stakes push it graver). Once locked, the mood and
// stakes appear with the rule, and a miss says how many steps off it was (`toneGap`). Scored on the first lock. The end
// is the tone map: every moment at its tone, with the line that ships.
import { useState } from 'react';
import { motion } from 'motion/react';
import { CheckIcon, LockSimpleIcon, XIcon } from '@phosphor-icons/react/ssr';
import { CHAABI_MOMENTS, TONES, toneFor, toneGap, type ChaabiMoment, type Episode, type Tone } from '@shape/content';
import { Button } from '@/components/base/buttons/button';
import { cx } from '@/utils/cx';
import { Burst, NibSays, StageTitle } from '../kit';
import { ChaabiPhone, MOMENT_TITLE, MOOD_NAME, STAKES_NAME, TONE_FILL, TONE_NAME, ToneDial as DialArt, VOICE } from '../scenes/VoiceTone';
import type { GameResult } from './DiamondSort';
import { play } from '@/lib/sound';

type Game = Episode['game'];

export function ToneDial({ game, onDone }: { game: Game; onDone: (results: GameResult[]) => void }) {
  const [i, setI] = useState(0);
  const [dial, setDial] = useState<Tone>('playful');
  const [locks, setLocks] = useState<Record<string, Tone>>({});
  const card = game.cards[i];

  if (!card) {
    const right = game.cards.filter(c => locks[c.id] === c.lane).length;
    return (
      <div className="relative flex flex-col items-center gap-5 py-6 text-center">
        <Burst count={36} />
        <StageTitle eyebrow="Chaabi’s tone map" title={`${right} of ${game.cards.length} tones right`}>
          One voice on every screen: {VOICE.map(v => v.trait.toLowerCase()).join(', ')}. The moment decides how light it can be.
        </StageTitle>
        <div className="grid w-full gap-3 text-left sm:grid-cols-2">
          {TONES.map(tone => (
            <section key={tone} className="flex flex-col gap-2 rounded-2xl bg-secondary p-3">
              <h2 className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
                <span className="size-3 rounded-full" style={{ background: TONE_FILL[tone] }} aria-hidden />{TONE_NAME[tone]}
              </h2>
              {game.cards.filter(c => c.lane === tone).map(c => (
                <figure key={c.id} className={cx('flex flex-col gap-1 rounded-xl bg-primary p-3 ring-1 ring-inset', locks[c.id] === c.lane ? 'ring-secondary' : 'ring-error')}>
                  <figcaption className="text-xs font-semibold text-tertiary">{MOMENT_TITLE[c.visual as ChaabiMoment]}</figcaption>
                  <p className="text-sm text-primary">{CHAABI_MOMENTS[c.visual as ChaabiMoment].lines[tone]}</p>
                </figure>
              ))}
            </section>
          ))}
        </div>
        <NibSays mood={right === game.cards.length ? 'cheer' : 'idle'}>Voice is who you are; tone is how you read the room. Good news can smile, and bad news with money or a home at stake gets the facts, calmly.</NibSays>
        <Button size="xl" onPress={() => onDone(game.cards.map(c => ({ id: c.id, correct: locks[c.id] === c.lane })))}>Continue the story</Button>
      </div>
    );
  }

  const m = card.visual as ChaabiMoment, spec = CHAABI_MOMENTS[m];
  const locked = locks[card.id], ok = locked === card.lane;
  const shown = locked ? (card.lane as Tone) : dial;
  const lock = () => { if (locked) return; play(dial === card.lane ? 'correct' : 'wrong'); setLocks(l => ({ ...l, [card.id]: dial })); };
  const next = () => { setI(n => n + 1); setDial('playful'); };
  const gap = locked ? toneGap(locked, card.lane as Tone) : 0;

  return (
    <div className="flex flex-col gap-5">
      <StageTitle eyebrow="Play" title={game.title}>{game.instructions}</StageTitle>
      <div className="flex items-baseline justify-between gap-3">
        <span className="text-lg font-semibold text-primary">{card.label}</span>
        <span className="shrink-0 text-sm font-semibold text-tertiary tabular-nums">{i + 1} / {game.cards.length}</span>
      </div>
      <motion.div key={card.id} initial={{ y: -12, opacity: 0 }} animate={locked && !ok ? { x: [0, -10, 10, -6, 6, 0], opacity: 1, y: 0 } : { y: 0, opacity: 1 }} transition={{ duration: 0.4 }}
        className={cx('grid items-center gap-4 rounded-2xl bg-primary p-4 shadow-lg ring-2 ring-inset sm:grid-cols-[minmax(0,15rem)_1fr]', !locked ? 'ring-secondary' : ok ? 'ring-mint-600' : 'ring-error')} data-current-card>
        <svg viewBox="0 0 240 400" className="mx-auto w-full max-w-60" role="img" aria-live="polite" aria-label={`${MOMENT_TITLE[m]}, in a ${TONE_NAME[shown].toLowerCase()} tone: ${spec.lines[shown]}`}>
          <motion.g key={`${m}-${shown}`} initial={{ opacity: 0.4 }} animate={{ opacity: 1 }} transition={{ duration: 0.25 }}>
            <ChaabiPhone x={0} y={0} moment={m} tone={shown} />
          </motion.g>
        </svg>
        <div className="flex flex-col gap-3">
          <svg viewBox="-200 -170 400 190" className="w-full max-w-sm self-center" aria-hidden>
            <DialArt x={0} y={0} r={118} at={TONES.indexOf(shown)} lit={shown} />
          </svg>
          <div role="radiogroup" aria-label="Tone" className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {game.lanes.map(l => {
              const tone = l.id as Tone, on = shown === tone;
              return (
                <button key={l.id} type="button" role="radio" aria-checked={on} disabled={!!locked} onClick={() => setDial(tone)}
                  className={cx('flex flex-col items-start gap-1 rounded-2xl bg-primary px-3 py-2.5 text-left ring-2 ring-inset transition disabled:cursor-default',
                    on ? 'ring-brand' : 'ring-secondary', !locked && 'hover:bg-primary_hover', locked && tone === locked && !ok && 'ring-error', locked && tone === card.lane && 'ring-mint-600')}>
                  <span className="inline-flex items-center gap-1.5 text-sm font-bold text-primary"><span className="size-2.5 rounded-full" style={{ background: TONE_FILL[tone] }} aria-hidden />{l.label}</span>
                  <span className="text-xs leading-tight text-tertiary">{l.hint}</span>
                </button>
              );
            })}
          </div>
          {!locked && <Button size="lg" iconLeading={<LockSimpleIcon data-icon weight="bold" />} onPress={lock}>Lock {TONE_NAME[dial].toLowerCase()}</Button>}
          {locked && (
            <dl className="grid grid-cols-3 gap-2 text-sm">
              <div><dt className="text-xs text-tertiary">Mood</dt><dd className="font-semibold text-primary">{MOOD_NAME[spec.mood]}</dd></div>
              <div><dt className="text-xs text-tertiary">Stakes</dt><dd className="font-semibold text-primary">{STAKES_NAME[spec.stakes]}</dd></div>
              <div><dt className="text-xs text-tertiary">So the tone is</dt><dd className="font-semibold text-primary">{TONE_NAME[toneFor(spec)]}</dd></div>
            </dl>
          )}
        </div>
      </motion.div>
      {locked && (
        <>
          <NibSays mood={ok ? 'cheer' : 'sad'}>
            <span className="inline-flex items-center gap-1 font-semibold">{ok ? <CheckIcon className="size-4" weight="bold" /> : <XIcon className="size-4" weight="bold" />}{TONE_NAME[card.lane as Tone]}.</span>{' '}
            {!ok && <>You locked {TONE_NAME[locked].toLowerCase()}, {gap === 1 ? 'one step' : `${gap} steps`} {TONES.indexOf(locked) < TONES.indexOf(card.lane as Tone) ? 'too light' : 'too grave'}. </>}
            {card.note}
          </NibSays>
          <div className="flex justify-end"><Button size="lg" onPress={next}>{i + 1 < game.cards.length ? 'Next moment' : 'See the tone map'}</Button></div>
        </>
      )}
    </div>
  );
}
