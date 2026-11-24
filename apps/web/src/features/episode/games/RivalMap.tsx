'use client';
// Mini-game for st.2-3: each card is something Shabnam could use instead of Galla (its `visual`, a key of
// `GALLA_RIVALS`). Pick its ring around her job: direct, indirect, substitute or not a rival. Then the facts behind the
// call appear (same people? same job? what is it?, as `ringFor` reads them) with what it does better than Galla, and its
// dot lands on its ring, right or wrong; a miss is marked. Scored on the first call. The end is the full map, the
// substitutes' ring the busiest, and every rival's edge.
import { useState } from 'react';
import { motion } from 'motion/react';
import { CheckIcon, XIcon } from '@phosphor-icons/react/ssr';
import { GALLA_RIVALS, RIVAL_RINGS, type Episode, type GallaRival, type RivalRing } from '@shape/content';
import { Button } from '@/components/base/buttons/button';
import { cx } from '@/utils/cx';
import { Burst, NibSays, StageTitle } from '../kit';
import { RING_FILL, RING_NAME, RIVAL_SHORT, RivalRings } from '../scenes/RivalRings';
import type { GameResult } from './DiamondSort';
import { play } from '@/lib/sound';

type Game = Episode['game'];
const KIND = { like: 'An app like Galla', product: 'A different product', makeshift: 'A habit or workaround' } as const;

function RingMap({ shown, lit }: { shown: GallaRival[]; lit?: GallaRival }) {
  return (
    <svg viewBox="-380 -262 760 524" className="mx-auto w-full max-w-md" role="img" aria-label={`Rings around Shabnam’s job with ${shown.length} rivals placed: ${shown.map(r => RIVAL_SHORT[r]).join(', ')}`}>
      <RivalRings x={0} y={0} shown={Object.fromEntries(shown.map(r => [r, 1]))} lit={lit} />
    </svg>
  );
}

export function RivalMap({ game, onDone }: { game: Game; onDone: (results: GameResult[]) => void }) {
  const [i, setI] = useState(0);
  const [calls, setCalls] = useState<Record<string, RivalRing>>({});
  const card = game.cards[i];
  const placed = game.cards.filter(c => calls[c.id]).map(c => c.visual as GallaRival);

  if (!card) {
    const right = game.cards.filter(c => calls[c.id] === c.lane).length;
    return (
      <div className="relative flex flex-col items-center gap-5 py-6 text-center">
        <Burst count={36} />
        <StageTitle eyebrow="Galla’s competition" title={`${right} of ${game.cards.length} rivals on the right ring`}>
          Two apps look like Galla. Three habits do its job in most shops. Start there.
        </StageTitle>
        <div className="grid w-full items-center gap-4 sm:grid-cols-2">
          <RingMap shown={placed} lit="notebook" />
          <ul className="flex flex-col gap-1.5 text-left">
            {game.cards.map(c => {
              const r = GALLA_RIVALS[c.visual as GallaRival];
              return (
                <li key={c.id} className={cx('flex flex-col rounded-xl bg-secondary px-3 py-2 ring-1 ring-inset', calls[c.id] === c.lane ? 'ring-transparent' : 'ring-error')}>
                  <span className="inline-flex items-center gap-2 text-sm font-semibold text-primary"><span className="size-2.5 shrink-0 rounded-full" style={{ background: RING_FILL[c.lane as RivalRing] }} aria-hidden />{RIVAL_SHORT[c.visual as GallaRival]} · {RING_NAME[c.lane as RivalRing]}</span>
                  <span className="text-xs text-tertiary">Does better: {r.edge}</span>
                </li>
              );
            })}
          </ul>
        </div>
        <NibSays mood={right === game.cards.length ? 'cheer' : 'idle'}>The feature table only had the inner ring. The khata wins on being free, always on and trusted, so Galla has to be as quick as ink, then do what ink can’t: chase the money politely.</NibSays>
        <Button size="xl" onPress={() => onDone(game.cards.map(c => ({ id: c.id, correct: calls[c.id] === c.lane })))}>Continue the story</Button>
      </div>
    );
  }

  const key = card.visual as GallaRival, r = GALLA_RIVALS[key];
  const call = calls[card.id], ok = call === card.lane;
  const choose = (ring: RivalRing) => { if (call) return; play(ring === card.lane ? 'correct' : 'wrong'); setCalls(c => ({ ...c, [card.id]: ring })); };
  const owner = game.lanes.find(l => l.id === card.lane)!;
  const facts = [
    { k: 'For', v: r.who === 'same' ? 'Kirana shopkeepers like Shabnam' : 'Different people', good: r.who === 'same' },
    { k: 'Job', v: r.job === 'same' ? 'Tracking udhaar and getting it back' : 'A different job', good: r.job === 'same' },
    { k: 'It is', v: KIND[r.kind], good: true },
  ];

  return (
    <div className="flex flex-col gap-5">
      <StageTitle eyebrow="Play" title={game.title}>{game.instructions}</StageTitle>
      <span className="self-end text-sm font-semibold text-tertiary tabular-nums">{i + 1} / {game.cards.length}</span>
      <motion.div key={card.id} initial={{ y: -12, opacity: 0 }} animate={call && !ok ? { x: [0, -10, 10, -6, 6, 0], opacity: 1, y: 0 } : { y: 0, opacity: 1 }} transition={{ duration: 0.4 }}
        className={cx('flex flex-col gap-3 rounded-2xl bg-primary px-5 py-4 shadow-lg ring-2 ring-inset', !call ? 'ring-secondary' : ok ? 'ring-mint-600' : 'ring-error')} data-current-card>
        <span className="text-lg font-semibold text-primary">{card.label}</span>
        {call && (
          <motion.dl initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid gap-1 text-sm sm:grid-cols-3">
            {facts.map(f => (
              <div key={f.k} className="flex flex-col rounded-lg bg-secondary px-3 py-1.5">
                <dt className="text-xs font-semibold text-tertiary">{f.k}</dt>
                <dd className={cx('font-semibold', f.good ? 'text-primary' : 'text-error-primary')}>{f.v}</dd>
              </div>
            ))}
            <div className="flex flex-col rounded-lg bg-secondary px-3 py-1.5 sm:col-span-3">
              <dt className="text-xs font-semibold text-tertiary">Does better than Galla</dt>
              <dd className="font-semibold text-primary">{r.edge}</dd>
            </div>
          </motion.dl>
        )}
      </motion.div>
      <div className="grid gap-4 sm:grid-cols-[1fr_1fr]">
        <div className="grid grid-cols-2 content-start gap-2">
          {RIVAL_RINGS.map(ring => {
            const lane = game.lanes.find(l => l.id === ring)!;
            return (
              <motion.button key={ring} type="button" onClick={() => choose(ring)} disabled={!!call} whileTap={{ scale: 0.97 }}
                className={cx('flex flex-col items-start gap-1 rounded-2xl bg-secondary p-3 text-left ring-2 ring-inset ring-transparent transition disabled:cursor-default',
                  !call && 'hover:ring-brand', call && ring === card.lane && 'ring-mint-600', call === ring && !ok && 'ring-error')}>
                <span className="rounded-full px-2.5 py-0.5 text-xs font-bold text-white" style={{ background: RING_FILL[ring] }}>{lane.label}</span>
                <span className="text-xs leading-tight text-tertiary">{lane.hint}</span>
              </motion.button>
            );
          })}
        </div>
        <RingMap shown={placed} lit={call ? key : undefined} />
      </div>
      {call && (
        <>
          <NibSays mood={ok ? 'cheer' : 'sad'}>
            <span className="inline-flex items-center gap-1 font-semibold">{ok ? <CheckIcon className="size-4" weight="bold" /> : <XIcon className="size-4" weight="bold" />}{owner.label}</span>{' '}
            {card.note}
          </NibSays>
          <div className="flex justify-end"><Button size="lg" onPress={() => setI(n => n + 1)}>{i + 1 < game.cards.length ? 'Next rival' : 'See the map'}</Button></div>
        </>
      )}
    </div>
  );
}
