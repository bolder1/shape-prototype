'use client';
// Mini-game for ui.3-4. First a tuner: darken helper text on white until the live WCAG ratio reaches 4.5:1. Then each card
// (`visual` "#fg|#bg") shows body and large text in that pair; judge it as fine for body text, large text only, or failing.
// The real ratio is revealed after each pick. Scored on the first pick.
import { useState } from 'react';
import { motion } from 'motion/react';
import { CheckIcon, LockSimpleIcon, XIcon } from '@phosphor-icons/react/ssr';
import { contrastLane, contrastRatio, type Episode } from '@shape/content';
import { Button } from '@/components/base/buttons/button';
import { cx } from '@/utils/cx';
import { Burst, FAMILY, NibSays, StageTitle } from '../kit';
import { mixHex } from '../scenes/ContrastDark';
import { Tune } from './MeasureTune';
import type { GameResult } from './DiamondSort';
import { play } from '@/lib/sound';

type Game = Episode['game'];

function Sample({ fg, bg }: { fg: string; bg: string }) {
  return (
    <div className="flex w-full flex-col gap-2 rounded-2xl p-5 ring-1 ring-black/10" style={{ background: bg, color: fg }}>
      <p className="text-2xl font-semibold">Large text · ₹12,400</p>
      <p className="text-md">Body text: your budget resets on the 1st of every month.</p>
    </div>
  );
}

function Tuner({ onLocked }: { onLocked: () => void }) {
  const [dark, setDark] = useState(10);
  const fg = mixHex('#e5e7eb', '#111827', dark / 100), r = contrastRatio(fg, '#ffffff');
  return (
    <div className="flex flex-col gap-5">
      <h2 className="text-xl font-semibold text-primary">Darken the helper text until everyone can read it</h2>
      <div className="flex flex-col gap-2 rounded-2xl bg-white p-5 ring-1 ring-black/10">
        <span className="text-sm font-bold text-[#111827]">Email</span>
        <span className="rounded-lg border border-[#d1d5db] px-3 py-2.5 text-md text-[#111827]">asha@example.com</span>
        <span className="text-sm font-medium" style={{ color: fg }}>We’ll send your receipts here.</span>
      </div>
      <Tune label="Text darkness" value={dark} min={0} max={100} step={1} ok={r >= 4.5} fmt={() => `${r.toFixed(2)}:1`} onChange={setDark} />
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm text-tertiary">{r >= 4.5 ? 'Passes WCAG AA for body text.' : 'Body text needs 4.5:1. The readout turns green when it passes.'}</span>
        <Button size="lg" iconLeading={LockSimpleIcon} isDisabled={r < 4.5} onPress={() => { play('fanfare'); onLocked(); }}>Lock it in</Button>
      </div>
    </div>
  );
}

export function ContrastCheck({ game, onDone }: { game: Game; onDone: (results: GameResult[]) => void }) {
  const [tuned, setTuned] = useState(false);
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

  if (!tuned) return <div className="flex flex-col gap-5"><StageTitle eyebrow="Play · tune" title={game.title}>{game.instructions}</StageTitle><Tuner onLocked={() => setTuned(true)} /></div>;

  if (!card) {
    return (
      <div className="relative flex flex-col items-center gap-5 py-6 text-center">
        <Burst count={36} />
        <StageTitle eyebrow="Game over" title={`${right} of ${game.cards.length} pairs judged right`}>4.5:1 for body text, 3:1 for large text.</StageTitle>
        <NibSays mood={right === game.cards.length ? 'cheer' : 'idle'}>Your eye is a rough guide. A contrast checker gives the real number, so check every pair, in both themes.</NibSays>
        <Button size="xl" onPress={() => onDone(game.cards.map(c => ({ id: c.id, correct: !!results[c.id] })))}>Continue the story</Button>
      </div>
    );
  }

  const [fg, bg] = (card.visual ?? '#000000|#ffffff').split('|');
  const ratio = contrastRatio(fg, bg), lane = contrastLane(ratio);
  const ok = picked === card.lane;
  return (
    <div className="flex flex-col gap-5">
      <StageTitle eyebrow="Play · judge" title={game.title}>Fine for body text, large text only, or failing?</StageTitle>
      <div className="flex items-baseline justify-between gap-3">
        <p className="text-md font-semibold text-secondary" data-current-card>{card.label}</p>
        <span className="shrink-0 text-sm font-semibold text-tertiary tabular-nums">{i + 1} / {game.cards.length}</span>
      </div>
      <motion.div animate={picked && !ok ? { x: [0, -10, 10, -6, 6, 0] } : { x: 0 }} transition={{ duration: 0.4 }}
        className={cx('relative rounded-2xl p-1 ring-2 ring-inset transition-colors', !picked ? 'ring-secondary' : ok ? 'ring-mint-600' : 'ring-error')}>
        <Sample fg={fg} bg={bg} />
        {picked && (
          <span className={cx('absolute top-3 right-3 rounded-full px-3 py-1 text-sm font-bold text-white tabular-nums', lane === 'fail' ? 'bg-error-solid' : 'bg-mint-600')}>
            {ratio.toFixed(2)}:1
          </span>
        )}
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
            <span className="inline-flex items-center gap-1 font-semibold">{ok ? <CheckIcon className="size-4" weight="bold" /> : <XIcon className="size-4" weight="bold" />}{ratio.toFixed(1)}:1.</span>{' '}
            {lane === 'pass' ? 'Clears 4.5:1, so it works for body text.' : lane === 'large' ? 'Above 3:1 but under 4.5:1: fine for large text and icons, not for body text.' : 'Under 3:1: too faint even for large text.'}
          </NibSays>
          <div className="flex justify-end"><Button size="lg" onPress={() => { setPicked(null); setI(n => n + 1); }}>{i + 1 < game.cards.length ? 'Next pair' : 'See results'}</Button></div>
        </div>
      )}
    </div>
  );
}
