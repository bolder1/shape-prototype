'use client';
// Mini-game for dc.4-2: fix the motion. Every card is an animation in Chakki's app (its `visual`, a key of
// `CHAKKI_MOTIONS`), shown with how it is written now and the work it makes the browser redo each frame
// (`worstWork`: layout, paint, composite). Ship it, move geometry to transform, keep a leaving element mounted until
// its exit ends, or make it start from where it is (`ANIM_FIXES`, scored by `animFix`). Right calls show the fixed
// code and, for geometry, the pipeline after the fix. A tally of fixes builds up; first call scores; a miss comes back.
import { useState } from 'react';
import { motion } from 'motion/react';
import { CHAKKI_MOTIONS, RENDER_WORK, animFix, worstWork, type AnimFix as Fix, type ChakkiMotion, type Episode, type RenderWork } from '@shape/content';
import { springs } from '@shape/ui';
import { Button } from '@/components/base/buttons/button';
import { cx } from '@/utils/cx';
import { Burst, NibSays, StageTitle } from '../kit';
import { FIX_FILL } from '../scenes/FrameBudget';
import type { GameResult } from './DiamondSort';
import { play } from '@/lib/sound';

type Game = Episode['game'];
const STAGE_LABEL: Record<RenderWork, string> = { layout: 'Layout', paint: 'Paint', composite: 'Composite' };

/** Why a wrong call is wrong, from the animation itself. */
function whyNot(k: ChakkiMotion) {
  const a = CHAKKI_MOTIONS[k], fix = animFix(a);
  if (fix === 'transform') return `It animates ${a.props.filter(p => worstWork([p]) === 'layout').join(' and ')}: geometry, so the page is laid out again every frame.`;
  if (fix === 'exit') return 'It plays as the element leaves, but the element is removed from the DOM in the same render.';
  if (fix === 'interrupt') return 'Trigger it again half-way and it starts from a fixed first frame, so it jumps.';
  return `It only animates ${a.props.join(' and ')}, it exits and reverses cleanly, so it is ready.`;
}

/** The browser's work per frame: every stage from the heaviest one down is redone. */
function Pipeline({ work, label }: { work: RenderWork; label: string }) {
  const from = RENDER_WORK.indexOf(work);
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs font-bold text-tertiary">{label}</span>
      <div className="grid grid-cols-3 gap-1" role="img" aria-label={`${label}: ${[...RENDER_WORK].reverse().filter(s => RENDER_WORK.indexOf(s) <= from).map(s => STAGE_LABEL[s]).join(', ')}`}>
        {(['layout', 'paint', 'composite'] as const).map(s => {
          const on = RENDER_WORK.indexOf(s) <= from;
          return (
            <span key={s} className={cx('rounded-md px-1.5 py-1 text-center text-sm font-bold', on ? 'text-white' : 'bg-secondary text-tertiary line-through')}
              style={on ? { background: s === 'composite' ? '#067647' : s === 'paint' ? '#B54708' : '#B42318' } : undefined}>
              {STAGE_LABEL[s]}
            </span>
          );
        })}
      </div>
    </div>
  );
}

export function AnimFix({ game, onDone }: { game: Game; onDone: (results: GameResult[]) => void }) {
  const [deck, setDeck] = useState(game.cards);
  const [results, setResults] = useState<Record<string, boolean>>({});
  const [placed, setPlaced] = useState<ChakkiMotion[]>([]);
  const [miss, setMiss] = useState<{ lane: string; why: string } | null>(null);
  const [right, setRight] = useState(false);
  const card = deck[0];

  const tally = (
    <div className="grid grid-cols-2 gap-2" aria-label="Animations sorted so far">
      {game.lanes.map(l => {
        const ks = placed.filter(k => animFix(CHAKKI_MOTIONS[k]) === l.id);
        return (
          <div key={l.id} className="flex flex-col gap-1 rounded-xl bg-secondary p-2.5">
            <span className="flex items-center gap-1.5 text-sm font-bold text-primary"><span className="size-2.5 shrink-0 rounded-full" style={{ background: FIX_FILL[l.id as Fix] }} aria-hidden />{l.label}</span>
            {ks.length === 0 ? <span className="text-sm text-tertiary">None yet</span> : ks.map(k => <span key={k} className="text-sm font-semibold text-secondary">{CHAKKI_MOTIONS[k].short}</span>)}
          </div>
        );
      })}
    </div>
  );

  if (!card) {
    const n = Object.values(results).filter(Boolean).length;
    const fixed = placed.filter(k => animFix(CHAKKI_MOTIONS[k]) !== 'ship').length;
    return (
      <div className="relative flex flex-col gap-5 py-6">
        <Burst count={36} />
        <StageTitle eyebrow="Motion fixed" title={`${n} of ${game.cards.length} right first time`}>
          {fixed} animations rewritten. Every one now moves only transform and opacity, plays its exit, and carries on from where it is when someone taps again.
        </StageTitle>
        {tally}
        <NibSays mood={n === game.cards.length ? 'cheer' : 'idle'}>Move layers, not layout. Keep leaving things mounted. Start from here.</NibSays>
        <Button size="xl" onPress={() => onDone(game.cards.map(c => ({ id: c.id, correct: !!results[c.id] })))}>Continue the story</Button>
      </div>
    );
  }

  const k = card.visual as ChakkiMotion;
  const a = CHAKKI_MOTIONS[k];
  const lane = animFix(a);
  const done = game.cards.length - deck.length;
  const call = (laneId: string) => {
    if (miss || right) return;
    const ok = laneId === lane;
    play(ok ? 'correct' : 'wrong');
    setResults(rs => (card.id in rs ? rs : { ...rs, [card.id]: ok }));
    if (ok) { setRight(true); setPlaced(ps => [...ps, k]); }
    else {
      setMiss({ lane: laneId, why: whyNot(k) });
      setTimeout(() => { setMiss(null); setDeck(dk => [...dk.slice(1), dk[0]]); }, 4200);
    }
  };
  const next = () => { setRight(false); setDeck(dk => dk.slice(1)); };

  return (
    <div className="flex flex-col gap-5">
      <StageTitle eyebrow="Play" title={game.title}>{game.instructions}</StageTitle>
      <div className="flex items-baseline justify-between">
        <span className="text-sm font-semibold text-tertiary">Chakki app · Redmi 12</span>
        <span className="text-sm font-semibold text-tertiary tabular-nums">{done} / {game.cards.length}</span>
      </div>
      <motion.div key={`${card.id}-${deck.length}`} initial={{ y: 24, opacity: 0 }}
        animate={miss ? { x: [0, -10, 10, -6, 6, 0], y: 0, opacity: 1 } : { y: 0, opacity: 1 }}
        transition={miss ? { duration: 0.4 } : springs.pop}
        className={cx('flex flex-col gap-3 rounded-2xl bg-primary p-4 shadow-lg ring-2 ring-inset sm:p-5', miss ? 'ring-error' : right ? 'ring-mint-600' : 'ring-secondary')} data-current-card>
        <span className="text-sm font-bold text-tertiary">{a.short}</span>
        <p className="text-lg font-semibold text-primary">{card.label}</p>
        <p className="break-words rounded-lg bg-gray-900 px-3 py-2 font-mono text-sm text-gray-100">{a.code}</p>
        <Pipeline work={worstWork(a.props)} label="Redone every frame" />
        {right && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={springs.pop} className="flex flex-col gap-2">
            <p className="break-words rounded-lg bg-secondary px-3 py-2 font-mono text-sm font-semibold text-primary" style={{ boxShadow: `inset 3px 0 0 ${FIX_FILL[lane]}` }}>{a.fixed}</p>
            {lane === 'transform' && <Pipeline work="composite" label="After the fix" />}
          </motion.div>
        )}
      </motion.div>
      <div className="grid grid-cols-2 gap-2" role="group" aria-label="What this animation needs">
        {game.lanes.map(l => (
          <motion.button key={l.id} type="button" onClick={() => call(l.id)} disabled={!!miss || right} whileTap={{ scale: 0.97 }}
            className={cx('flex flex-col items-start gap-0.5 rounded-xl border-2 bg-primary px-3 py-2.5 text-left transition enabled:hover:bg-primary_hover disabled:cursor-default',
              right && l.id === lane ? 'border-mint-600' : miss?.lane === l.id ? 'border-error' : miss && l.id === lane ? 'border-mint-600' : 'border-secondary')}>
            <span className="flex items-center gap-1.5 text-md font-bold text-primary"><span className="size-2.5 shrink-0 rounded-full" style={{ background: FIX_FILL[l.id as Fix] }} aria-hidden />{l.label}</span>
            <span className="text-xs font-medium text-tertiary">{l.hint}</span>
          </motion.button>
        ))}
      </div>
      <div className="min-h-14" aria-live="polite">
        {miss && <NibSays mood="sad">{miss.why} {card.note} It’ll come back round.</NibSays>}
        {right && (
          <div className="flex flex-col gap-3">
            <NibSays mood="cheer">{card.note}</NibSays>
            <div className="flex justify-end"><Button size="lg" onPress={next}>{deck.length > 1 ? 'Next animation' : 'See the tally'}</Button></div>
          </div>
        )}
        {!miss && !right && <NibSays mood="think">Does it change geometry? Does it play as something leaves? What happens if it’s triggered again half-way?</NibSays>}
      </div>
      {tally}
    </div>
  );
}
