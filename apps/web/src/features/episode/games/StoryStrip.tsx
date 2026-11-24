'use client';
// Mini-game for bz.2-1: each card is a beat of Neha's rebuilt pitch (its `visual`, a key of `SAMAN_BEATS`). Call
// which part of the story spine it belongs to. A right call drops it into the pitch strip, which re-sorts itself in
// story order (`pitchOrder`) and re-times itself (`pitchTimeline`) against five minutes, with the first-minute mark:
// you can watch the problem land inside the first minute as the complication beats arrive. First call scores; a miss
// explains and the beat comes back later. The end plays the finished pitch back and checks it with `pitchFlaws`.
import { useState } from 'react';
import { motion } from 'motion/react';
import { PITCH_SECONDS, PROBLEM_BY, SAMAN_BEATS, pitchFlaws, pitchLength, pitchOrder, pitchTimeline, type Episode, type PitchPart, type SamanBeat } from '@shape/content';
import { springs } from '@shape/ui';
import { Button } from '@/components/base/buttons/button';
import { cx } from '@/utils/cx';
import { Burst, NibSays, StageTitle } from '../kit';
import { PART_COLOR, PART_NAME, clock } from '../scenes/StorySpine';
import { SC } from '../scenes/shared';
import type { GameResult } from './DiamondSort';
import { play } from '@/lib/sound';

type Game = Episode['game'];
const beatOf = (k: string) => SAMAN_BEATS[k as SamanBeat];

function Strip({ keys }: { keys: SamanBeat[] }) {
  const ordered = pitchOrder(keys, k => SAMAN_BEATS[k].part);
  const line = pitchTimeline(ordered.map(k => SAMAN_BEATS[k]));
  const end = line.at(-1)?.end ?? 0;
  const pct = (s: number) => `${(s / PITCH_SECONDS) * 100}%`;
  const problem = line.find(l => l.beat.part === 'complication');
  return (
    <div className="flex flex-col gap-2">
      <div className="relative h-9 overflow-hidden rounded-lg bg-primary ring-1 ring-secondary" role="img"
        aria-label={`The pitch so far: ${ordered.length} beats, ${clock(end)} of 5:00${problem ? `, problem at ${clock(problem.start)}` : ''}`}>
        {line.map((l, i) => (
          <motion.div key={ordered[i]} layout transition={springs.pop} className="absolute inset-y-1 rounded-md"
            style={{ left: pct(l.start), width: `calc(${pct(l.beat.secs)} - 3px)`, background: PART_COLOR[l.beat.part as PitchPart], opacity: 0.85 }} />
        ))}
        <div className="absolute inset-y-0 w-0.5" style={{ left: pct(PROBLEM_BY), background: SC.text }} aria-hidden />
      </div>
      <div className="flex justify-between text-xs font-semibold text-tertiary tabular-nums">
        <span>0:00</span>
        <span>1:00 problem by here</span>
        <span>{clock(end)} of 5:00</span>
      </div>
      <ol className="flex flex-col gap-1">
        {ordered.map(k => (
          <motion.li key={k} layout initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={springs.pop}
            className="flex items-start gap-2 rounded-lg bg-primary px-3 py-2 text-sm text-secondary ring-1 ring-secondary">
            <span className="mt-1 size-2.5 shrink-0 rounded-full" style={{ background: PART_COLOR[SAMAN_BEATS[k].part] }} aria-hidden />
            <span className="flex-1">{SAMAN_BEATS[k].text}</span>
            <span className="shrink-0 font-semibold text-tertiary tabular-nums">{SAMAN_BEATS[k].secs}s</span>
          </motion.li>
        ))}
      </ol>
    </div>
  );
}

export function StoryStrip({ game, onDone }: { game: Game; onDone: (results: GameResult[]) => void }) {
  const [deck, setDeck] = useState(game.cards);
  const [results, setResults] = useState<Record<string, boolean>>({});
  const [placed, setPlaced] = useState<SamanBeat[]>([]);
  const [miss, setMiss] = useState<string | null>(null);
  const [right, setRight] = useState(false);
  const card = deck[0];

  if (!card) {
    const n = Object.values(results).filter(Boolean).length;
    const beats = pitchOrder(placed, k => SAMAN_BEATS[k].part).map(k => SAMAN_BEATS[k]);
    const flaws = pitchFlaws(beats);
    return (
      <div className="relative flex flex-col gap-5 py-6">
        <Burst count={36} />
        <StageTitle eyebrow="The pitch, rebuilt" title={`${n} of ${game.cards.length} placed first time`}>
          {`${clock(pitchLength(beats))} of five minutes, the problem in the first minute, and it ends on the ask.${flaws.length ? '' : ' Nothing for the room to wait through.'}`}
        </StageTitle>
        <Strip keys={placed} />
        <NibSays mood={n === game.cards.length ? 'cheer' : 'idle'}>Write the ask first and build backwards: what does the room have to believe to say yes? Everything else goes in the appendix.</NibSays>
        <Button size="xl" onPress={() => onDone(game.cards.map(c => ({ id: c.id, correct: !!results[c.id] })))}>Continue the story</Button>
      </div>
    );
  }

  const b = beatOf(card.visual!);
  const owner = game.lanes.find(l => l.id === b.part)!;
  const done = game.cards.length - deck.length;
  const call = (laneId: string) => {
    if (miss || right) return;
    const ok = laneId === b.part;
    play(ok ? 'correct' : 'wrong');
    setResults(r => (card.id in r ? r : { ...r, [card.id]: ok }));
    if (ok) { setRight(true); setPlaced(ps => [...ps, card.visual as SamanBeat]); }
    else { setMiss(laneId); setTimeout(() => { setMiss(null); setDeck(d => [...d.slice(1), d[0]]); }, 3200); }
  };
  const next = () => { setRight(false); setDeck(d => d.slice(1)); };

  return (
    <div className="flex flex-col gap-5">
      <StageTitle eyebrow="Play" title={game.title}>{game.instructions}</StageTitle>
      <div className="flex items-baseline justify-between">
        <span className="text-sm font-semibold text-tertiary">{b.secs} seconds to say</span>
        <span className="text-sm font-semibold text-tertiary tabular-nums">{done} / {game.cards.length}</span>
      </div>
      <motion.div key={`${card.id}-${deck.length}`} initial={{ y: -14, opacity: 0 }} animate={miss ? { x: [0, -10, 10, -6, 6, 0], opacity: 1 } : { y: 0, opacity: 1 }} transition={miss ? { duration: 0.4 } : springs.pop}
        className={cx('rounded-2xl bg-primary p-5 ring-2 ring-inset', miss ? 'ring-error' : right ? 'ring-mint-600' : 'ring-secondary')} data-current-card>
        <p className="text-xl font-semibold text-primary">“{card.label}”</p>
      </motion.div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4" role="group" aria-label="Part of the story">
        {game.lanes.map((l, i) => (
          <motion.button key={l.id} type="button" onClick={() => call(l.id)} disabled={!!miss || right} whileTap={{ scale: 0.97 }}
            className={cx('flex flex-col items-start gap-0.5 rounded-xl border-2 bg-primary px-3 py-2.5 text-left transition enabled:hover:bg-primary_hover disabled:cursor-default',
              right && l.id === b.part ? 'border-mint-600' : miss === l.id ? 'border-error' : miss && l.id === b.part ? 'border-mint-600' : 'border-secondary')}>
            <span className="flex items-center gap-1.5 text-md font-bold text-primary">
              <span className="text-xs font-semibold text-tertiary tabular-nums">{i + 1}</span>
              <span className="size-2.5 rounded-full" style={{ background: PART_COLOR[l.id as PitchPart] }} aria-hidden />
              {PART_NAME[l.id as PitchPart] ?? l.label}
            </span>
            <span className="text-xs font-medium text-tertiary">{l.hint}</span>
          </motion.button>
        ))}
      </div>
      <div className="min-h-14" aria-live="polite">
        {miss && <NibSays mood="sad">Not quite: it’s <strong>{owner.label.toLowerCase()}</strong>. {card.note} It’ll come back round.</NibSays>}
        {right && (
          <div className="flex flex-col gap-3">
            <NibSays mood="cheer">{card.note}</NibSays>
            <div className="flex justify-end"><Button size="lg" onPress={next}>{deck.length > 1 ? 'Next beat' : 'Play the pitch back'}</Button></div>
          </div>
        )}
        {!miss && !right && <NibSays mood="think">Ask what job the beat does for the room: set the scene, show what’s wrong, show the fix, or ask for the decision.</NibSays>}
      </div>
      {placed.length > 0 && <Strip keys={placed} />}
    </div>
  );
}
