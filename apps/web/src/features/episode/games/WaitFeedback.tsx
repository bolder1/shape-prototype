'use client';
// Mini-game for ia.4-2: each card is an action in Mandi and how long it really takes (`visual`, in ms). Pick the
// feedback it needs. The wait then drops onto the scene's WaitLine (split at 0.1 s, 1 s and 10 s, the answer from
// `feedbackFor`), and FeedbackPhone plays the right feedback, sped up; a wrong pick plays beside it in red. Scored on
// the pick; the end lays every action on the line.
import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { CheckIcon, XIcon } from '@phosphor-icons/react/ssr';
import type { Episode, Feedback } from '@shape/content';
import { Button } from '@/components/base/buttons/button';
import { cx } from '@/utils/cx';
import { Burst, NibSays, StageTitle } from '../kit';
import { FeedbackPhone, fmtWait, WaitLine, waitX } from '../scenes/PressFeedback';
import type { GameResult } from './DiamondSort';
import { play } from '@/lib/sound';

type Game = Episode['game'];

/** Plays a wait from 0 to 1 over about two seconds, then holds. */
function Playback({ kind, label, wrong }: { kind: Feedback; label: string; wrong?: boolean }) {
  const [k, setK] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setK(x => Math.min(1, x + 0.025)), 50);
    return () => clearInterval(id);
  }, []);
  return (
    <figure className={cx('flex flex-col items-center gap-1 rounded-2xl bg-primary p-2 ring-2 ring-inset', wrong ? 'ring-error' : 'ring-mint-600')}>
      <svg viewBox="-2 -2 204 154" className="w-full max-w-52" role="img" aria-label={`${label}: ${kind} feedback`}>
        <FeedbackPhone kind={kind} k={k} label={label} />
      </svg>
      <figcaption className="text-xs font-semibold text-tertiary">{wrong ? 'What you picked' : 'What it needs'}</figcaption>
    </figure>
  );
}

export function WaitFeedback({ game, onDone }: { game: Game; onDone: (results: GameResult[]) => void }) {
  const [i, setI] = useState(0);
  const [picks, setPicks] = useState<Record<string, string>>({});
  const card = game.cards[i];
  const picked = card ? picks[card.id] : undefined;

  const pick = (laneId: string) => {
    if (!card || picked) return;
    play(laneId === card.lane ? 'correct' : 'wrong');
    setPicks(p => ({ ...p, [card.id]: laneId }));
  };

  if (!card) {
    const right = game.cards.filter(c => picks[c.id] === c.lane).length;
    return (
      <div className="relative flex flex-col items-center gap-5 py-6 text-center">
        <Burst count={36} />
        <StageTitle eyebrow="Every wait answered" title={`${right} of ${game.cards.length} right`}>
          From a 40 ms tick to a two-minute upload: the longer the wait, the more the screen has to say.
        </StageTitle>
        <div className="w-full rounded-2xl bg-primary p-3 ring-1 ring-secondary ring-inset">
          <svg viewBox="0 -24 640 64" className="w-full" role="img" aria-label="Every action placed on the feedback time line">
            <WaitLine x={0} y={0} w={640} />
            {game.cards.map(c => {
              const ms = Number(c.visual);
              return <circle key={c.id} cx={waitX(ms) * 640} cy={8} r={5} fill={picks[c.id] === c.lane ? 'var(--color-text-primary)' : 'var(--color-fg-error-primary)'} stroke="var(--color-bg-primary)" strokeWidth={2} />;
            })}
          </svg>
        </div>
        <ul className="grid w-full gap-1 text-left text-sm">
          {game.cards.map(c => (
            <li key={c.id} className="flex justify-between gap-3 rounded-xl bg-secondary px-3 py-2"><span className="text-primary">{c.label}</span><span className="shrink-0 font-semibold text-tertiary tabular-nums">{fmtWait(Number(c.visual))}</span></li>
          ))}
        </ul>
        <NibSays mood={right === game.cards.length ? 'cheer' : 'idle'}>Under a tenth of a second, the change is the answer. After that, every second of silence makes people tap again.</NibSays>
        <Button size="xl" onPress={() => onDone(game.cards.map(c => ({ id: c.id, correct: picks[c.id] === c.lane })))}>Continue the story</Button>
      </div>
    );
  }

  const ms = Number(card.visual), ok = picked === card.lane, owner = game.lanes.find(l => l.id === card.lane)!;
  return (
    <div className="flex flex-col gap-5">
      <StageTitle eyebrow="Play" title={game.title}>{game.instructions}</StageTitle>
      <div className="flex items-baseline justify-between">
        <span className="text-sm font-semibold text-tertiary">The action</span>
        <span className="text-sm font-semibold text-tertiary tabular-nums">{i + 1} / {game.cards.length}</span>
      </div>
      <motion.div key={card.id} initial={{ y: -12, opacity: 0 }} animate={picked && !ok ? { x: [0, -10, 10, -6, 6, 0], opacity: 1, y: 0 } : { y: 0, opacity: 1 }} transition={{ duration: 0.4 }}
        className={cx('flex items-baseline justify-between gap-4 rounded-2xl bg-primary px-5 py-4 shadow-lg ring-2 ring-inset', !picked ? 'ring-secondary' : ok ? 'ring-mint-600' : 'ring-error')} data-current-card>
        <span className="text-lg font-semibold text-primary">{card.label}</span>
        <span className="shrink-0 text-lg font-bold text-tertiary tabular-nums">takes {fmtWait(ms)}</span>
      </motion.div>
      <div className="rounded-2xl bg-primary px-3 pt-3 ring-1 ring-secondary ring-inset">
        <svg viewBox="-20 -40 680 84" className="w-full" role="img" aria-label={picked ? `${fmtWait(ms)} falls in the ${owner.label} zone` : 'The feedback time line'}>
          <WaitLine x={0} y={0} w={640} marker={picked ? ms : undefined} lit={picked ? (card.lane as Feedback) : undefined} />
        </svg>
      </div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {game.lanes.map(l => (
          <motion.button key={l.id} type="button" onClick={() => pick(l.id)} disabled={!!picked} whileTap={{ scale: 0.96 }}
            className={cx('flex flex-col items-start gap-1 rounded-2xl bg-primary px-3 py-3 text-left ring-2 ring-secondary ring-inset transition disabled:cursor-default',
              !picked && 'hover:bg-primary_hover', picked && l.id !== picked && l.id !== card.lane && 'opacity-40', picked && l.id === card.lane && 'ring-mint-600', picked === l.id && !ok && 'ring-error')}>
            <span className="text-sm font-bold text-primary">{l.label}</span>
            <span className="text-xs leading-tight text-tertiary">{l.hint}</span>
          </motion.button>
        ))}
      </div>
      {picked && (
        <>
          <div className={cx('grid gap-3', ok ? 'grid-cols-1 justify-items-center' : 'grid-cols-2')}>
            {!ok && <Playback key={`${card.id}-w`} kind={picked as Feedback} label={card.label} wrong />}
            <Playback key={card.id} kind={card.lane as Feedback} label={card.label} />
          </div>
          <NibSays mood={ok ? 'cheer' : 'sad'}>
            <span className="inline-flex items-center gap-1 font-semibold">{ok ? <CheckIcon className="size-4" weight="bold" /> : <XIcon className="size-4" weight="bold" />}{owner.label}.</span>{' '}{card.note}
          </NibSays>
          <div className="flex justify-end"><Button size="lg" onPress={() => setI(k => k + 1)}>{i + 1 < game.cards.length ? 'Next action' : 'See the time line'}</Button></div>
        </>
      )}
    </div>
  );
}
