'use client';
// Mini-game for ui.3-1. First a matcher: three HSL sliders, locked in once the swatch is close to the target. Then each
// card asks for a change ("a darker blue for hover"); pick the one dial that does it, and the swatch slides to the result
// with the moved dial lit up. Each card's `visual` is "h,s,l>h,s,l". Scored on the first pick.
import { useState } from 'react';
import { motion } from 'motion/react';
import { CheckIcon, LockSimpleIcon, XIcon } from '@phosphor-icons/react/ssr';
import { hslChange, type Episode, type Hsl } from '@shape/content';
import { Button } from '@/components/base/buttons/button';
import { cx } from '@/utils/cx';
import { Burst, FAMILY, NibSays, StageTitle } from '../kit';
import { Tune } from './MeasureTune';
import type { GameResult } from './DiamondSort';
import { play } from '@/lib/sound';

type Game = Episode['game'];
const css = ([h, s, l]: Hsl) => `hsl(${h} ${s}% ${l}%)`;
const TARGET: Hsl = [150, 60, 40];
const NAMES = ['H', 'S', 'L'];

function Swatch({ c, label, big }: { c: Hsl; label: string; big?: boolean }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className={cx('rounded-2xl shadow-md ring-1 ring-black/10 transition-colors duration-700', big ? 'size-36' : 'size-28')} style={{ background: css(c) }} />
      <span className="text-sm font-semibold text-tertiary">{label}</span>
    </div>
  );
}

function Matcher({ onLocked }: { onLocked: () => void }) {
  const [c, setC] = useState<Hsl>([220, 80, 60]);
  const near = [Math.min(Math.abs(c[0] - TARGET[0]), 360 - Math.abs(c[0] - TARGET[0])) <= 12, Math.abs(c[1] - TARGET[1]) <= 12, Math.abs(c[2] - TARGET[2]) <= 6];
  const set = (i: number) => (v: number) => setC(x => x.map((n, k) => (k === i ? v : n)) as Hsl);
  return (
    <div className="flex flex-col gap-5">
      <h2 className="text-xl font-semibold text-primary">Match the target with three dials</h2>
      <div className="flex justify-center gap-8 rounded-2xl bg-secondary p-5"><Swatch c={c} label="Yours" big /><Swatch c={TARGET} label="Target" big /></div>
      <Tune label="Hue · which colour" value={c[0]} min={0} max={360} step={1} ok={near[0]} fmt={v => `${v}°`} onChange={set(0)} />
      <Tune label="Saturation · how vivid" value={c[1]} min={0} max={100} step={1} ok={near[1]} fmt={v => `${v}%`} onChange={set(1)} />
      <Tune label="Lightness · how light" value={c[2]} min={0} max={100} step={1} ok={near[2]} fmt={v => `${v}%`} onChange={set(2)} />
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm text-tertiary">{near.every(Boolean) ? 'Close enough to the eye.' : 'Each readout turns green when that dial is close.'}</span>
        <Button size="lg" iconLeading={LockSimpleIcon} isDisabled={!near.every(Boolean)} onPress={() => { play('fanfare'); onLocked(); }}>Lock it in</Button>
      </div>
    </div>
  );
}

export function HslDial({ game, onDone }: { game: Game; onDone: (results: GameResult[]) => void }) {
  const [matched, setMatched] = useState(false);
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [results, setResults] = useState<Record<string, boolean>>({});
  const card = game.cards[i];
  const right = Object.values(results).filter(Boolean).length;

  const pick = (laneId: string) => {
    if (!card || picked) return;
    const ok = laneId === card.lane;
    play(ok ? 'correct' : 'wrong');
    setPicked(laneId);
    setResults(r => ({ ...r, [card.id]: ok }));
  };

  if (!matched) return <div className="flex flex-col gap-5"><StageTitle eyebrow="Play · match" title={game.title}>{game.instructions}</StageTitle><Matcher onLocked={() => setMatched(true)} /></div>;

  if (!card) {
    return (
      <div className="relative flex flex-col items-center gap-5 py-6 text-center">
        <Burst count={36} />
        <StageTitle eyebrow="Game over" title={`${right} of ${game.cards.length} changes made with the right dial`}>Hue for which colour, saturation for how vivid, lightness for how light.</StageTitle>
        <NibSays mood={right === game.cards.length ? 'cheer' : 'idle'}>Hover and pressed states are almost always a lightness change. Keep hue and saturation still.</NibSays>
        <Button size="xl" onPress={() => onDone(game.cards.map(c => ({ id: c.id, correct: !!results[c.id] })))}>Continue the story</Button>
      </div>
    );
  }

  const { from, to } = hslChange(card.visual ?? '0,0,50>0,0,50');
  const ok = picked === card.lane, owner = game.lanes.find(l => l.id === card.lane)!;
  const now = picked ? to : from, moved = ['h', 's', 'l'].indexOf(card.lane);
  return (
    <div className="flex flex-col gap-5">
      <StageTitle eyebrow="Play · steer" title={game.title}>Pick the one dial that makes the change.</StageTitle>
      <div className="flex items-baseline justify-between gap-3">
        <p className="text-xl font-semibold text-primary" data-current-card>{card.label}</p>
        <span className="shrink-0 text-sm font-semibold text-tertiary tabular-nums">{i + 1} / {game.cards.length}</span>
      </div>
      <motion.div animate={picked && !ok ? { x: [0, -10, 10, -6, 6, 0] } : { x: 0 }} transition={{ duration: 0.4 }}
        className={cx('flex flex-col items-center gap-4 rounded-2xl bg-secondary p-6 ring-2 ring-inset transition-colors', !picked ? 'ring-secondary' : ok ? 'ring-mint-600' : 'ring-error')}>
        <div className="flex items-end gap-6">
          {picked && <Swatch c={from} label="Before" />}
          <Swatch c={now} label={picked ? 'After' : 'Now'} big />
        </div>
        <div className="flex gap-2 font-mono text-sm tabular-nums">
          {now.map((n, k) => (
            <span key={k} className={cx('rounded-lg px-2.5 py-1 font-semibold transition-colors', picked && k === moved ? 'bg-mint-600 text-white' : 'bg-primary text-secondary')}>
              {NAMES[k]} {n}{k ? '%' : '°'}
            </span>
          ))}
        </div>
      </motion.div>
      <div className="grid grid-cols-3 gap-3">
        {game.lanes.map((l, k) => (
          <motion.button key={l.id} type="button" onClick={() => pick(l.id)} disabled={!!picked} whileTap={{ scale: 0.96 }}
            className={cx('flex flex-col rounded-2xl px-3 py-3 text-left text-white transition disabled:cursor-default', picked && l.id !== picked && l.id !== card.lane && 'opacity-50',
              picked && l.id === card.lane && 'ring-4 ring-mint-500')}
            style={{ background: FAMILY[[0, 1, 3][k]] }}>
            <span className="text-md font-bold">{l.label}</span>
            <span className="text-xs font-medium opacity-90">{l.hint}</span>
          </motion.button>
        ))}
      </div>
      {picked && (
        <div className="flex flex-col gap-3">
          <NibSays mood={ok ? 'cheer' : 'sad'}>
            <span className="inline-flex items-center gap-1 font-semibold">{ok ? <CheckIcon className="size-4" weight="bold" /> : <XIcon className="size-4" weight="bold" />}{ok ? 'Right dial.' : `That’s a ${owner.label.toLowerCase()} change.`}</span>{' '}
            Only {owner.label.toLowerCase()} moved, from {from[moved]} to {to[moved]}{moved ? '%' : '°'}. The other two stayed put.
          </NibSays>
          <div className="flex justify-end"><Button size="lg" onPress={() => { setPicked(null); setI(n => n + 1); }}>{i + 1 < game.cards.length ? 'Next change' : 'See results'}</Button></div>
        </div>
      )}
    </div>
  );
}
