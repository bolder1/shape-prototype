'use client';
// Mini-game for bz.1-2: each card is a business (`visual` = price|months|margin%|CAC). Estimate whether it's losing,
// risky or healthy; then the maths is shown: LTV = price × months × margin, as a bar against CAC and the 3 × CAC line.
// Scored on the first pick.
import { useState } from 'react';
import { motion } from 'motion/react';
import { CheckIcon, XIcon } from '@phosphor-icons/react/ssr';
import { unitHealth, unitNumbers, type Episode } from '@shape/content';
import { Button } from '@/components/base/buttons/button';
import { cx } from '@/utils/cx';
import { Burst, NibSays, StageTitle } from '../kit';
import type { GameResult } from './DiamondSort';
import { play } from '@/lib/sound';

type Game = Episode['game'];
const rupees = (n: number) => `₹${Math.round(n).toLocaleString('en-IN')}`;
const LANE_BG: Record<string, string> = { losing: 'bg-error-solid', risky: 'bg-[#b45309]', healthy: 'bg-mint-700' };

export function UnitCalc({ game, onDone }: { game: Game; onDone: (results: GameResult[]) => void }) {
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

  if (!card) {
    return (
      <div className="relative flex flex-col items-center gap-5 py-6 text-center">
        <Burst count={36} />
        <StageTitle eyebrow="Game over" title={`${right} of ${game.cards.length} businesses judged right`}>LTV = price × months × margin. Aim for 3 × CAC.</StageTitle>
        <NibSays mood={right === game.cards.length ? 'cheer' : 'idle'}>Notice how often “months they stay” decided it. That number is mostly design’s job.</NibSays>
        <Button size="xl" onPress={() => onDone(game.cards.map(c => ({ id: c.id, correct: !!results[c.id] })))}>Continue the story</Button>
      </div>
    );
  }

  const n = unitNumbers(card.visual ?? '1|1|1|1'), ratio = n.ltv / n.cac, health = unitHealth(ratio);
  const top = Math.max(n.ltv, 3 * n.cac) * 1.1;
  const ok = picked === card.lane;
  return (
    <div className="flex flex-col gap-5">
      <StageTitle eyebrow="Play" title={game.title}>{game.instructions}</StageTitle>
      <div className="flex items-baseline justify-between gap-3">
        <p className="text-xl font-semibold text-primary" data-current-card>{card.label}</p>
        <span className="shrink-0 text-sm font-semibold text-tertiary tabular-nums">{i + 1} / {game.cards.length}</span>
      </div>
      <motion.div animate={picked && !ok ? { x: [0, -10, 10, -6, 6, 0] } : { x: 0 }} transition={{ duration: 0.4 }}
        className={cx('flex flex-col gap-4 rounded-2xl bg-secondary p-4 ring-2 ring-inset', !picked ? 'ring-secondary' : ok ? 'ring-mint-600' : 'ring-error')}>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {[{ k: 'Price', v: `${rupees(n.price)}/mo` }, { k: 'Stays', v: `${n.months} months` }, { k: 'Margin', v: `${n.margin}%` }, { k: 'CAC', v: rupees(n.cac) }].map(s => (
            <div key={s.k} className="flex flex-col rounded-xl bg-primary px-3 py-2">
              <span className="text-xs font-semibold text-tertiary">{s.k}</span>
              <span className="text-lg font-bold text-primary tabular-nums">{s.v}</span>
            </div>
          ))}
        </div>
        {picked && (
          <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-2">
            <p className="text-sm font-semibold text-secondary tabular-nums">LTV = {rupees(n.price)} × {n.months} × {n.margin}% = <span className="text-primary">{rupees(n.ltv)}</span> · {ratio.toFixed(1)} × CAC</p>
            <div className="relative flex h-28 items-end gap-6 rounded-xl bg-primary px-6 pb-2">
              {[{ l: 'CAC', v: n.cac, c: 'var(--color-fg-error-primary)' }, { l: 'LTV', v: n.ltv, c: 'var(--color-family-discover)' }].map(b => (
                <div key={b.l} className="flex flex-1 flex-col items-center gap-1">
                  <motion.span className="w-full rounded-t-md" initial={{ height: 0 }} animate={{ height: `${(b.v / top) * 88}px` }} transition={{ duration: 0.6 }} style={{ background: b.c }} />
                  <span className="text-xs font-bold text-secondary">{b.l}</span>
                </div>
              ))}
              <span className="absolute inset-x-3 border-t-2 border-dashed border-mint-600" style={{ bottom: `${8 + 16 + (3 * n.cac / top) * 88}px` }} />
              <span className="absolute left-3 text-[10px] font-bold text-mint-700" style={{ bottom: `${12 + 16 + (3 * n.cac / top) * 88}px` }}>3 × CAC</span>
            </div>
          </motion.div>
        )}
      </motion.div>
      <div className="grid grid-cols-3 gap-3">
        {game.lanes.map(l => (
          <motion.button key={l.id} type="button" onClick={() => pick(l.id)} disabled={!!picked} whileTap={{ scale: 0.96 }}
            className={cx('flex flex-col rounded-2xl px-3 py-3 text-left text-white transition disabled:cursor-default', LANE_BG[l.id], picked && l.id !== picked && l.id !== card.lane && 'opacity-50',
              picked && l.id === card.lane && 'ring-4 ring-mint-300')}>
            <span className="text-md font-bold">{l.label}</span>
            <span className="text-xs font-medium opacity-90">{l.hint}</span>
          </motion.button>
        ))}
      </div>
      {picked && (
        <div className="flex flex-col gap-3">
          <NibSays mood={ok ? 'cheer' : 'sad'}>
            <span className="inline-flex items-center gap-1 font-semibold">{ok ? <CheckIcon className="size-4" weight="bold" /> : <XIcon className="size-4" weight="bold" />}{health === 'healthy' ? 'Healthy.' : health === 'risky' ? 'Risky.' : 'Losing money.'}</span>{' '}
            {health === 'losing' ? 'Each new customer costs more than they bring in. Fix retention or CAC before growing.' : health === 'risky' ? 'It makes money, but thinly. Longer retention would make it healthy.' : 'Each customer brings in well over three times what they cost to win.'}
          </NibSays>
          <div className="flex justify-end"><Button size="lg" onPress={() => { setPicked(null); setI(n => n + 1); }}>{i + 1 < game.cards.length ? 'Next business' : 'See results'}</Button></div>
        </div>
      )}
    </div>
  );
}
