'use client';
// Mini-game for ds.1-3: an audit wall. The system's primary button sits at the top; below, every primary button found in
// the app, drawn from its `visual` ("bg|radius|paddingX|weight|label"). Tap the ones that drift, then hand in the audit:
// hits, misses and false alarms are marked, and every drift's `note` says what's off. Each card scores on its final call.
import { useState } from 'react';
import { motion } from 'motion/react';
import { CheckIcon, FlagIcon, XIcon } from '@phosphor-icons/react/ssr';
import type { Episode } from '@shape/content';
import { springs } from '@shape/ui';
import { Button } from '@/components/base/buttons/button';
import { cx } from '@/utils/cx';
import { Burst, NibSays, StageTitle } from '../kit';
import type { GameResult } from './DiamondSort';
import { play } from '@/lib/sound';

type Game = Episode['game'];

/** A real button drawn from "bg|radius|paddingX|weight|label". */
function Specimen({ visual }: { visual?: string }) {
  const [bg, r, px, wt, label] = (visual ?? '#2563eb|8|20|600|Button').split('|');
  return <span className="inline-block py-2.5 text-sm text-white" style={{ background: bg, borderRadius: Number(r), paddingInline: Number(px), fontWeight: Number(wt) }}>{label}</span>;
}

export function DebtHunt({ game, onDone }: { game: Game; onDone: (results: GameResult[]) => void }) {
  const [flags, setFlags] = useState<string[]>([]);
  const [done, setDone] = useState(false);
  const system = game.cards.find(c => c.lane === 'ok');
  const [sysBg, sysR, sysPx, sysWt] = (system?.visual ?? '').split('|');
  const verdict = (id: string, lane: string) => flags.includes(id) === (lane === 'debt');
  const right = game.cards.filter(c => verdict(c.id, c.lane)).length;
  const drifts = game.cards.filter(c => c.lane === 'debt');

  const toggle = (id: string) => { if (done) return; play('tap'); setFlags(f => (f.includes(id) ? f.filter(x => x !== id) : [...f, id])); };
  const handIn = () => { play(right === game.cards.length ? 'fanfare' : 'reveal'); setDone(true); };

  return (
    <div className="relative flex flex-col gap-5">
      {done && right === game.cards.length && <Burst count={36} />}
      <StageTitle eyebrow={done ? 'Audit handed in' : 'Play'} title={done ? `${right} of ${game.cards.length} calls right` : game.title}>{done ? 'Drifts you caught are ticked. Misses and false alarms are marked.' : game.instructions}</StageTitle>

      <div className="flex flex-wrap items-center gap-4 rounded-2xl bg-white p-4 ring-2 ring-mint-600 ring-inset">
        <span className="text-xs font-bold tracking-wide text-[#047857] uppercase">The system button</span>
        <Specimen visual={system?.visual?.replace(/[^|]+$/, 'Primary')} />
        <span className="font-mono text-xs text-[#4b5563]">color-primary {sysBg} · radius {sysR} · padding {sysPx} · weight {sysWt}</span>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {game.cards.map(c => {
          const flagged = flags.includes(c.id), ok = verdict(c.id, c.lane);
          const mark = !done ? null : c.lane === 'debt' ? (flagged ? 'caught' : 'missed') : flagged ? 'false alarm' : null;
          return (
            <motion.button key={c.id} type="button" onClick={() => toggle(c.id)} whileTap={done ? undefined : { scale: 0.97 }} aria-pressed={flagged}
              className={cx('relative flex min-h-28 flex-col items-center justify-center gap-2 rounded-2xl bg-white p-3 ring-2 ring-inset transition-colors',
                !done ? (flagged ? 'ring-error' : 'ring-[#e5e7eb] hover:ring-[#cbd5e1]') : ok ? 'ring-mint-600' : 'ring-error', done && 'cursor-default')}>
              <Specimen visual={c.visual} />
              <span className="text-xs font-medium text-[#4b5563]">{c.label}</span>
              {flagged && !done && (
                <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={springs.pop} className="absolute top-2 right-2 grid size-6 place-items-center rounded-full bg-error-solid text-white">
                  <FlagIcon className="size-3.5" weight="fill" />
                </motion.span>
              )}
              {mark && (
                <span className={cx('absolute top-2 right-2 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-bold text-white', ok ? 'bg-mint-600' : 'bg-error-solid')}>
                  {ok ? <CheckIcon className="size-3" weight="bold" /> : <XIcon className="size-3" weight="bold" />}{mark}
                </span>
              )}
            </motion.button>
          );
        })}
      </div>

      {!done ? (
        <div className="flex items-center justify-between gap-3">
          <span className="text-sm text-tertiary">{flags.length} flagged. Tap again to unflag.</span>
          <Button size="lg" iconLeading={FlagIcon} onPress={handIn}>Hand in the audit</Button>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <ul className="flex flex-col gap-1.5 rounded-2xl bg-secondary p-4 text-sm text-secondary">
            {drifts.map(c => <li key={c.id}><strong className="text-primary">{c.label}:</strong> {c.note}</li>)}
          </ul>
          <NibSays mood={right === game.cards.length ? 'cheer' : 'idle'}>{drifts.length} drifts in {game.cards.length} buttons. Each one looked fine alone; side by side, the debt is obvious.</NibSays>
          <div className="flex justify-end"><Button size="xl" onPress={() => onDone(game.cards.map(c => ({ id: c.id, correct: verdict(c.id, c.lane) })))}>Continue the story</Button></div>
        </div>
      )}
    </div>
  );
}
