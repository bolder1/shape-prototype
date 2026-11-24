'use client';
// Mini-game for pr.3-2: a design review of Gullak's playful build. Each card is a moment drawn and played by the scene's
// `MomentTile` (its `visual`, a key of `GULLAK_MOMENTS`). Watch it and give the critique: keep it, too often, in the way,
// or wrong tone. Once you've called it, the moment's numbers appear (duration × times a month = `delightCost`) and a
// sticky note with your verdict lands on the tile. A meter tracks the seconds a month Meera gets back from every cut.
// The end is the review board, grouped by verdict. With reduced motion on, tiles hold a still frame until Play.
import { useState } from 'react';
import { motion } from 'motion/react';
import { CheckIcon, PlayIcon, XIcon } from '@phosphor-icons/react/ssr';
import { GULLAK_MOMENTS, delightCost, type DelightLane, type Episode, type GullakMoment } from '@shape/content';
import { Button } from '@/components/base/buttons/button';
import { cx } from '@/utils/cx';
import { Burst, NibSays, StageTitle } from '../kit';
import { LANE_NAME, MomentTile, fmtCost } from '../scenes/DelightCheck';
import { tileLoop } from '../scenes/MotionMeaning';
import { useMotionDemo } from './useMotionDemo';
import type { GameResult } from './DiamondSort';
import { play } from '@/lib/sound';

type Game = Episode['game'];
/** The frame a tile shows when it can't move: where the moment is clearest. */
const STILL_AT: Record<GullakMoment, number> = {
  'coin-rain': 0.3, 'unlock-dance': 0.3, 'pay-confetti': 0.2, 'tap-jingle': 0.05, 'balance-sparkle': 0.1, 'failed-wink': 0.3,
  'late-fee-party': 0.2, 'goal-burst': 0.5, 'tick-draw': 0.5, 'pull-coin': 0.4,
};

function Tile({ m, k, label, note, bad }: { m: GullakMoment; k: number; label: string; note?: string; bad?: boolean }) {
  return (
    <svg viewBox="-2 -2 204 154" className="w-full" role="img" aria-label={note ? `${label}. Verdict: ${note}` : label}>
      <g opacity={note && bad ? 0.6 : 1}><MomentTile moment={m} k={k} /></g>
      {note && (
        <g transform="translate(112 112) rotate(-4)">
          <rect width={84} height={30} rx={4} fill={bad ? '#FEE4E2' : '#D1FADF'} stroke={bad ? '#B42318' : '#067647'} strokeWidth={1.5} />
          <text x={42} y={20} textAnchor="middle" fontSize={12} fontWeight={900} fill={bad ? '#912018' : '#05603A'}>{note}</text>
        </g>
      )}
    </svg>
  );
}

export function DelightJudge({ game, onDone }: { game: Game; onDone: (results: GameResult[]) => void }) {
  const [i, setI] = useState(0);
  const [picks, setPicks] = useState<Record<string, DelightLane>>({});
  const clock = useMotionDemo(2.4);
  const card = game.cards[i];
  const kOf = (m: GullakMoment, offset = 0) => (clock.still ? STILL_AT[m] : tileLoop(clock.t, offset));
  const spec = (c: Game['cards'][number]) => GULLAK_MOMENTS[c.visual as GullakMoment];
  const saved = game.cards.filter(c => picks[c.id] && c.lane !== 'keep').reduce((s, c) => s + delightCost(spec(c)), 0);
  const total = game.cards.filter(c => c.lane !== 'keep').reduce((s, c) => s + delightCost(spec(c)), 0);

  if (!card) {
    const right = game.cards.filter(c => picks[c.id] === c.lane).length;
    return (
      <div className="relative flex flex-col items-center gap-5 py-6 text-center">
        <Burst count={36} />
        <StageTitle eyebrow="The delight review" title={`${right} of ${game.cards.length} critiques right`}>
          Cutting the distractions gives Meera back {fmtCost(Math.round(total))} a month. What’s left is rare, quick, or both.
        </StageTitle>
        <div className="grid w-full gap-3 text-left sm:grid-cols-2">
          {game.lanes.map(l => (
            <section key={l.id} className="flex flex-col gap-2 rounded-2xl bg-secondary p-3">
              <h2 className={cx('text-sm font-semibold', l.id === 'keep' ? 'text-primary' : 'text-error-primary')}>{l.label}</h2>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {game.cards.filter(c => c.lane === l.id).map((c, n) => (
                  <figure key={c.id} className={cx('flex flex-col gap-1 rounded-xl bg-primary p-1 ring-1 ring-inset', picks[c.id] === c.lane ? 'ring-secondary' : 'ring-error')}>
                    <Tile m={c.visual as GullakMoment} k={kOf(c.visual as GullakMoment, n * 0.3)} label={c.label} />
                    <figcaption className="px-1 text-xs font-semibold text-tertiary tabular-nums">{fmtCost(delightCost(spec(c)))} a month</figcaption>
                  </figure>
                ))}
              </div>
            </section>
          ))}
        </div>
        <NibSays mood={right === game.cards.length ? 'cheer' : 'idle'}>The more often something happens, the smaller its feedback. Celebrate what people earned, never what went wrong, and never in front of what they came to do.</NibSays>
        <Button size="xl" onPress={() => onDone(game.cards.map(c => ({ id: c.id, correct: picks[c.id] === c.lane })))}>Continue the story</Button>
      </div>
    );
  }

  const picked = picks[card.id], ok = picked === card.lane, m = card.visual as GullakMoment, s = spec(card);
  const owner = game.lanes.find(l => l.id === card.lane)!;
  const pick = (lane: DelightLane) => { if (picked) return; play(lane === card.lane ? 'correct' : 'wrong'); setPicks(p => ({ ...p, [card.id]: lane })); };

  return (
    <div className="flex flex-col gap-5">
      <StageTitle eyebrow="Play" title={game.title}>{game.instructions}</StageTitle>
      <div className="flex items-baseline justify-between gap-3">
        <span className="text-sm font-semibold text-tertiary tabular-nums">Given back to Meera: {fmtCost(Math.round(saved))} a month</span>
        <span className="text-sm font-semibold text-tertiary tabular-nums">{i + 1} / {game.cards.length}</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-secondary" aria-hidden>
        <motion.div className="h-full rounded-full bg-brand-solid" initial={false} animate={{ width: `${total ? (saved / total) * 100 : 0}%` }} transition={{ duration: 0.4 }} />
      </div>
      <motion.div key={card.id} initial={{ y: -12, opacity: 0 }} animate={picked && !ok ? { x: [0, -10, 10, -6, 6, 0], opacity: 1, y: 0 } : { y: 0, opacity: 1 }} transition={{ duration: 0.4 }}
        className={cx('grid items-center gap-4 rounded-2xl bg-primary px-5 py-4 shadow-lg ring-2 ring-inset sm:grid-cols-[1fr_1fr]', !picked ? 'ring-secondary' : ok ? 'ring-mint-600' : 'ring-error')} data-current-card>
        <div className="flex flex-col gap-3">
          <span className="text-lg font-semibold text-primary">{card.label}</span>
          {picked && (
            <dl className="grid grid-cols-3 gap-2 text-sm">
              <div><dt className="text-xs text-tertiary">Plays for</dt><dd className="font-semibold text-primary tabular-nums">{s.ms ? `${s.ms / 1000} s` : 'no extra time'}</dd></div>
              <div><dt className="text-xs text-tertiary">Seen</dt><dd className="font-semibold text-primary tabular-nums">{s.perMonth < 1 ? 'once a goal' : `${s.perMonth} × a month`}</dd></div>
              <div><dt className="text-xs text-tertiary">Costs</dt><dd className="font-semibold text-primary tabular-nums">{fmtCost(delightCost(s))} a month</dd></div>
            </dl>
          )}
        </div>
        <div className="flex flex-col items-center gap-2">
          <div className="w-full max-w-64"><Tile m={m} k={kOf(m)} label={card.label} note={picked ? LANE_NAME[card.lane as DelightLane] : undefined} bad={card.lane !== 'keep'} /></div>
          {clock.reduce && <Button size="sm" color="secondary" iconLeading={<PlayIcon data-icon weight="bold" />} onPress={clock.play}>Play once</Button>}
        </div>
      </motion.div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {game.lanes.map(l => (
          <motion.button key={l.id} type="button" onClick={() => pick(l.id as DelightLane)} disabled={!!picked} whileTap={{ scale: 0.96 }}
            className={cx('flex flex-col items-start gap-1 rounded-2xl bg-primary px-3 py-3 text-left ring-2 ring-secondary ring-inset transition disabled:cursor-default',
              !picked && 'hover:bg-primary_hover', picked && l.id !== picked && l.id !== card.lane && 'opacity-40', picked && l.id === card.lane && 'ring-mint-600', picked === l.id && !ok && 'ring-error')}>
            <span className="text-sm font-bold text-primary">{l.label}</span>
            <span className="text-xs leading-tight text-tertiary">{l.hint}</span>
          </motion.button>
        ))}
      </div>
      {picked && (
        <>
          <NibSays mood={ok ? 'cheer' : 'sad'}>
            <span className="inline-flex items-center gap-1 font-semibold">{ok ? <CheckIcon className="size-4" weight="bold" /> : <XIcon className="size-4" weight="bold" />}{owner.label}.</span>{' '}
            {!ok && picked === 'keep' && <>It costs Meera more than it gives her. </>}
            {!ok && card.lane === 'keep' && <>This one earns its place. </>}
            {card.note}
          </NibSays>
          <div className="flex justify-end"><Button size="lg" onPress={() => setI(n => n + 1)}>{i + 1 < game.cards.length ? 'Next moment' : 'See the review board'}</Button></div>
        </>
      )}
    </div>
  );
}
