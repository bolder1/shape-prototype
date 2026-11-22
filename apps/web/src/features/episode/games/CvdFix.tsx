'use client';
// Mini-game for ax.1-3. First an explorer: one dashboard seen through typical vision and three simulated colour vision
// deficiencies. Then each card's design (its `visual`) is drawn twice, as most people see it and with deuteranopia;
// judge whether its meaning survives. Every card's `note` explains. Scored on the first pick.
import { useState } from 'react';
import { motion } from 'motion/react';
import { CheckIcon, EyeIcon, WarningCircleIcon, XIcon } from '@phosphor-icons/react/ssr';
import type { Episode } from '@shape/content';
import { Button } from '@/components/base/buttons/button';
import { cx } from '@/utils/cx';
import { Burst, NibSays, StageTitle } from '../kit';
import { CVD, CvdFilters } from '../scenes/ColourBlind';
import type { GameResult } from './DiamondSort';
import { play } from '@/lib/sound';

type Game = Episode['game'];
const RED = '#dc2626', GREEN = '#16a34a';

/** A small design, drawn on white. */
function Design({ visual }: { visual?: string }) {
  switch (visual) {
    case 'chart-rg':
    case 'chart-labels': {
      const labels = visual === 'chart-labels';
      return (
        <svg viewBox="0 0 220 120" className="w-full max-w-56">
          <path d="M10 100 L60 80 L110 86 L160 50 L200 40" stroke={GREEN} strokeWidth={4} fill="none" />
          <path d="M10 40 L60 60 L110 52 L160 82 L200 78" stroke={RED} strokeWidth={4} fill="none" />
          {labels ? <><text x={160} y={32} fontSize={12} fontWeight={800} fill="#111827">Profit</text><text x={164} y={100} fontSize={12} fontWeight={800} fill="#111827">Loss</text></>
            : <g transform="translate(14 110)"><circle r={4} fill={GREEN} /><text x={8} y={4} fontSize={10} fill="#374151">Profit</text><circle cx={60} r={4} fill={RED} /><text x={68} y={4} fontSize={10} fill="#374151">Loss</text></g>}
        </svg>
      );
    }
    case 'dots':
    case 'dots-icons': {
      const icons = visual === 'dots-icons';
      return (
        <div className="flex flex-col gap-2 text-sm text-[#111827]">
          {[{ n: 'Payments', c: GREEN, up: true }, { n: 'Search', c: RED, up: false }, { n: 'Orders', c: GREEN, up: true }].map(s => (
            <span key={s.n} className="flex items-center gap-2">
              <span className="grid size-5 place-items-center rounded-full text-[11px] font-black text-white" style={{ background: s.c }}>{icons ? (s.up ? '✓' : '✕') : ''}</span>
              {s.n}{icons && <span className="font-semibold">{s.up ? '· Up' : '· Down'}</span>}
            </span>
          ))}
        </div>
      );
    }
    case 'error-border':
    case 'error-message': {
      const msg = visual === 'error-message';
      return (
        <div className="flex w-full max-w-56 flex-col gap-1 text-left text-sm">
          <span className="font-semibold text-[#374151]">Phone</span>
          <span className="rounded-md bg-white px-2.5 py-2 text-[#111827]" style={{ border: `2px solid ${RED}` }}>98765 432</span>
          {msg && <span className="flex items-center gap-1 text-xs font-semibold text-[#b91c1c]"><WarningCircleIcon className="size-4" weight="fill" />Enter all 10 digits</span>}
        </div>
      );
    }
    case 'link-colour':
    case 'link-underline':
      return <p className="max-w-56 text-left text-sm text-[#374151]">Your refund is on its way. <span className={cx('font-medium text-[#2563eb]', visual === 'link-underline' && 'underline')}>Track the refund</span> or contact support.</p>;
    case 'heat-rg':
    case 'heat-blue': {
      const cs = visual === 'heat-rg' ? ['#dc2626', '#f97316', '#eab308', '#84cc16', '#16a34a'] : ['#eff6ff', '#bfdbfe', '#60a5fa', '#2563eb', '#1e3a8a'];
      return <div className="grid grid-cols-5 gap-1">{Array.from({ length: 15 }, (_, i) => <span key={i} className="size-7 rounded" style={{ background: cs[(i * 3 + Math.floor(i / 5)) % 5] }} />)}</div>;
    }
    default: return null;
  }
}

function Explorer({ onNext }: { onNext: () => void }) {
  const [mode, setMode] = useState<'none' | keyof typeof CVD>('none');
  return (
    <div className="flex flex-col gap-5">
      <h2 className="text-xl font-semibold text-primary">Look through four kinds of vision</h2>
      <div className="flex flex-wrap items-center justify-center gap-6 rounded-2xl bg-white p-5 transition-[filter] duration-300" style={{ filter: mode === 'none' ? 'none' : `url(#cvd-${mode})` }}>
        <Design visual="chart-rg" /><Design visual="dots" /><Design visual="heat-rg" />
      </div>
      <div className="flex flex-wrap justify-center gap-2">
        {([['none', 'Typical'], ...Object.entries(CVD).map(([k, v]) => [k, v.n])] as [string, string][]).map(([k, n]) => (
          <Button key={k} size="md" color={mode === k ? 'primary' : 'secondary'} iconLeading={EyeIcon} onPress={() => { play('tap'); setMode(k as typeof mode); }}>{n}</Button>
        ))}
      </div>
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm text-tertiary">Try each one. Which parts stop making sense?</span>
        <Button size="lg" onPress={onNext}>Judge some designs</Button>
      </div>
    </div>
  );
}

export function CvdFix({ game, onDone }: { game: Game; onDone: (results: GameResult[]) => void }) {
  const [explored, setExplored] = useState(false);
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

  let body: React.ReactNode;
  if (!explored) body = <><StageTitle eyebrow="Play · explore" title={game.title}>{game.instructions}</StageTitle><Explorer onNext={() => setExplored(true)} /></>;
  else if (!card) {
    body = (
      <div className="relative flex flex-col items-center gap-5 py-6 text-center">
        <Burst count={36} />
        <StageTitle eyebrow="Game over" title={`${right} of ${game.cards.length} designs judged right`}>If hue is the only difference, someone can’t see it.</StageTitle>
        <NibSays mood={right === game.cards.length ? 'cheer' : 'idle'}>Quick test: imagine the design in greyscale. If the meaning survives, you’re safe.</NibSays>
        <Button size="xl" onPress={() => onDone(game.cards.map(c => ({ id: c.id, correct: !!results[c.id] })))}>Continue the story</Button>
      </div>
    );
  } else {
    const ok = picked === card.lane;
    body = (
      <div className="flex flex-col gap-5">
        <StageTitle eyebrow="Play · judge" title={game.title}>Does the meaning survive colour blindness?</StageTitle>
        <div className="flex items-baseline justify-between gap-3">
          <p className="text-md font-semibold text-secondary" data-current-card>{card.label}</p>
          <span className="shrink-0 text-sm font-semibold text-tertiary tabular-nums">{i + 1} / {game.cards.length}</span>
        </div>
        <motion.div animate={picked && !ok ? { x: [0, -10, 10, -6, 6, 0] } : { x: 0 }} transition={{ duration: 0.4 }}
          className={cx('grid gap-3 rounded-2xl p-1 ring-2 ring-inset sm:grid-cols-2', !picked ? 'ring-secondary' : ok ? 'ring-mint-600' : 'ring-error')}>
          {[{ n: 'Typical vision', f: 'none' }, { n: 'Deuteranopia (simulated)', f: 'url(#cvd-deut)' }].map(v => (
            <div key={v.n} className="flex flex-col gap-2">
              <div className="flex min-h-36 items-center justify-center rounded-xl bg-white p-4" style={{ filter: v.f }}><Design visual={card.visual} /></div>
              <span className="text-center text-xs font-semibold text-tertiary">{v.n}</span>
            </div>
          ))}
        </motion.div>
        <div className="grid grid-cols-2 gap-3">
          {game.lanes.map(l => (
            <motion.button key={l.id} type="button" onClick={() => pick(l.id)} disabled={!!picked} whileTap={{ scale: 0.96 }}
              className={cx('flex items-center justify-center gap-2 rounded-2xl px-4 py-4 text-lg font-bold text-white transition disabled:cursor-default',
                l.id === 'clear' ? 'bg-mint-700' : 'bg-error-solid', picked && l.id !== picked && l.id !== card.lane && 'opacity-40', picked && l.id === card.lane && 'ring-4 ring-mint-300')}>
              {l.id === 'clear' ? <CheckIcon className="size-5" weight="bold" /> : <XIcon className="size-5" weight="bold" />}{l.label}
            </motion.button>
          ))}
        </div>
        {picked && (
          <div className="flex flex-col gap-3">
            <NibSays mood={ok ? 'cheer' : 'sad'}><span className="font-semibold">{card.lane === 'clear' ? 'Still clear.' : 'It breaks.'}</span> {card.note}</NibSays>
            <div className="flex justify-end"><Button size="lg" onPress={() => { setPicked(null); setI(n => n + 1); }}>{i + 1 < game.cards.length ? 'Next design' : 'See results'}</Button></div>
          </div>
        )}
      </div>
    );
  }
  return <div className="relative flex flex-col gap-5"><CvdFilters />{body}</div>;
}
