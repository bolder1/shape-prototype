'use client';
// Mini-game for pr.2-4: Shobha has Reduce motion on. Each card rings one moving part of Dabba's home screen (its
// `visual`, a key of `DABBA_MOTIONS`) on the scene's `DabbaHome`. Decide what it becomes: stop it, swap it for a fade,
// or keep it. The phone redraws that part the way you decided, so a spinner you stopped freezes and a slide you kept
// keeps sliding. The answer comes from `reduceFor`. The end puts the calmed screen beside the original, with a switch.
// With reduced motion on in this device too, the phone holds still until Play is pressed.
import { useState } from 'react';
import { motion } from 'motion/react';
import { CheckIcon, PlayIcon, XIcon } from '@phosphor-icons/react/ssr';
import { DABBA_MOTIONS, type DabbaPart, type Episode, type MotionSpec, type ReduceLane } from '@shape/content';
import { Button } from '@/components/base/buttons/button';
import { cx } from '@/utils/cx';
import { Burst, NibSays, StageTitle } from '../kit';
import { DabbaHome, OVERLAYS, type Overlay, type PartMode } from '../scenes/ReducedMotion';
import { useMotionDemo } from './useMotionDemo';
import type { GameResult } from './DiamondSort';
import { play } from '@/lib/sound';

type Game = Episode['game'];

/** What the part does, in a few words, from its spec. */
const specLine = (part: DabbaPart) => {
  const m: MotionSpec = DABBA_MOTIONS[part];
  const bits = [m.travel > 0 ? `moves ${m.travel} px` : 'moves in place', m.zoom && 'zooms', m.spin && 'spins', m.parallax && 'parallax', m.auto && 'plays by itself', m.status && 'shows status', m.meaning ? 'carries meaning' : 'decoration'];
  return bits.filter(Boolean).join(' · ');
};

function Phone({ time, modes, overlay, ring, label }: { time: number; modes: Partial<Record<DabbaPart, PartMode>>; overlay?: Overlay; ring?: DabbaPart; label: string }) {
  return (
    <svg viewBox="-6 -6 272 512" className="w-full max-w-64" role="img" aria-label={label}>
      <DabbaHome time={time} modes={modes} overlay={overlay} ring={ring} />
    </svg>
  );
}

export function MotionAudit({ game, onDone }: { game: Game; onDone: (results: GameResult[]) => void }) {
  const [i, setI] = useState(0);
  const [picks, setPicks] = useState<Record<string, ReduceLane>>({});
  const [calm, setCalm] = useState(true);
  const clock = useMotionDemo(4);
  const card = game.cards[i];
  const picked = card ? picks[card.id] : undefined;
  const time = clock.still ? 1.6 : clock.t;
  const modes: Partial<Record<DabbaPart, PartMode>> = Object.fromEntries(game.cards.filter(c => picks[c.id]).map(c => [c.visual as DabbaPart, picks[c.id]]));

  if (!card) {
    const right = game.cards.filter(c => picks[c.id] === c.lane).length;
    const overlay = (['page', 'sheet', 'confetti'] as const)[Math.floor(time / 4) % 3];
    return (
      <div className="relative flex flex-col items-center gap-5 py-6 text-center">
        <Burst count={36} />
        <StageTitle eyebrow="Home screen calmed" title={`${right} of ${game.cards.length} parts decided right`}>
          Nothing large moves unless Shobha moves it, and every message still arrives.
        </StageTitle>
        <div className="flex items-center gap-2 rounded-full bg-secondary p-1" role="group" aria-label="Reduce motion">
          {[false, true].map(on => (
            <button key={String(on)} type="button" onClick={() => setCalm(on)} aria-pressed={calm === on}
              className={cx('rounded-full px-4 py-1.5 text-sm font-semibold transition', calm === on ? 'bg-primary text-primary shadow-sm' : 'text-tertiary')}>
              Reduce motion {on ? 'on' : 'off'}
            </button>
          ))}
        </div>
        <Phone time={time} modes={calm ? modes : {}} overlay={overlay} label={`Dabba's home screen with Reduce motion ${calm ? 'on, as you decided it' : 'off'}`} />
        {clock.reduce && <Button size="sm" color="secondary" iconLeading={<PlayIcon data-icon weight="bold" />} onPress={clock.play}>Play once</Button>}
        <ul className="grid w-full gap-1 text-left text-sm">
          {game.cards.map(c => (
            <li key={c.id} className="flex justify-between gap-3 rounded-xl bg-secondary px-3 py-2">
              <span className="text-primary">{c.label}</span>
              <span className={cx('shrink-0 font-semibold', picks[c.id] === c.lane ? 'text-tertiary' : 'text-error-primary')}>{game.lanes.find(l => l.id === c.lane)?.label}</span>
            </li>
          ))}
        </ul>
        <NibSays mood={right === game.cards.length ? 'cheer' : 'idle'}>Reduce motion isn’t no motion. Travel becomes a fade, autoplay waits, decoration goes, and the press, the spinner and the toast stay.</NibSays>
        <Button size="xl" onPress={() => onDone(game.cards.map(c => ({ id: c.id, correct: picks[c.id] === c.lane })))}>Continue the story</Button>
      </div>
    );
  }

  const part = card.visual as DabbaPart, ok = picked === card.lane;
  const owner = game.lanes.find(l => l.id === card.lane)!;
  const overlay = OVERLAYS.includes(part) ? (part as Overlay) : undefined;
  const pick = (lane: ReduceLane) => { if (picked) return; play(lane === card.lane ? 'correct' : 'wrong'); setPicks(p => ({ ...p, [card.id]: lane })); if (clock.reduce) clock.play(); };

  return (
    <div className="flex flex-col gap-5">
      <StageTitle eyebrow="Play" title={game.title}>{game.instructions}</StageTitle>
      <div className="flex items-baseline justify-between">
        <span className="text-sm font-semibold text-tertiary">The moving part</span>
        <span className="text-sm font-semibold text-tertiary tabular-nums">{i + 1} / {game.cards.length}</span>
      </div>
      <div className="grid items-start gap-4 sm:grid-cols-[2fr_3fr]">
        <div className="flex flex-col items-center gap-2">
          <Phone time={time} modes={modes} overlay={overlay} ring={part} label={`Dabba's home screen, with ${card.label.toLowerCase()} ringed`} />
          {clock.reduce && <Button size="sm" color="secondary" iconLeading={<PlayIcon data-icon weight="bold" />} onPress={clock.play}>Play once</Button>}
        </div>
        <div className="flex flex-col gap-3">
          <motion.div key={card.id} initial={{ y: -12, opacity: 0 }} animate={picked && !ok ? { x: [0, -10, 10, -6, 6, 0], opacity: 1, y: 0 } : { y: 0, opacity: 1 }} transition={{ duration: 0.4 }}
            className={cx('flex flex-col gap-1 rounded-2xl bg-primary px-5 py-4 shadow-lg ring-2 ring-inset', !picked ? 'ring-secondary' : ok ? 'ring-mint-600' : 'ring-error')} data-current-card>
            <span className="text-lg font-semibold text-primary">{card.label}</span>
            <span className="text-sm text-tertiary">{specLine(part)}</span>
          </motion.div>
          <div className="grid gap-2">
            {game.lanes.map(l => (
              <motion.button key={l.id} type="button" onClick={() => pick(l.id as ReduceLane)} disabled={!!picked} whileTap={{ scale: 0.97 }}
                className={cx('flex flex-col items-start gap-0.5 rounded-2xl bg-primary px-4 py-3 text-left ring-2 ring-secondary ring-inset transition disabled:cursor-default',
                  !picked && 'hover:bg-primary_hover', picked && l.id !== picked && l.id !== card.lane && 'opacity-40', picked && l.id === card.lane && 'ring-mint-600', picked === l.id && !ok && 'ring-error')}>
                <span className="text-sm font-bold text-primary">{l.label}</span>
                <span className="text-xs leading-tight text-tertiary">{l.hint}</span>
              </motion.button>
            ))}
          </div>
          {picked && (
            <NibSays mood={ok ? 'cheer' : 'sad'}>
              <span className="inline-flex items-center gap-1 font-semibold">{ok ? <CheckIcon className="size-4" weight="bold" /> : <XIcon className="size-4" weight="bold" />}{owner.label}.</span>{' '}
              {!ok && picked === 'keep' && <>It still moves the way that hurts. </>}
              {!ok && picked === 'stop' && card.lane !== 'stop' && <>Stopping it loses what it was telling her. </>}
              {card.note}
            </NibSays>
          )}
          {picked && <div className="flex justify-end"><Button size="lg" onPress={() => setI(n => n + 1)}>{i + 1 < game.cards.length ? 'Next part' : 'See the calm screen'}</Button></div>}
        </div>
      </div>
    </div>
  );
}
