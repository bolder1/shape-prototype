'use client';
// Mini-game for ds.1-2: two cards full of hard-coded values. Each game card names one value (its `visual` is the element);
// pick the token it should become and the element gets a token tag. At the end, change a token (rebrand, rounder,
// roomier) and every bound element updates at once. Scored on the first pick.
import { useState } from 'react';
import { motion } from 'motion/react';
import { CheckIcon, XIcon } from '@phosphor-icons/react/ssr';
import type { Episode } from '@shape/content';
import { Button } from '@/components/base/buttons/button';
import { cx } from '@/utils/cx';
import { Burst, FAMILY_SOLID, NibSays, StageTitle } from '../kit';
import type { GameResult } from './DiamondSort';
import { play } from '@/lib/sound';

type Game = Episode['game'];
interface Tokens { color: string; space: number; radius: number }
const START: Tokens = { color: '#2563eb', space: 16, radius: 8 };

/** The two-card screen. `on` is the element being asked about; `bound` maps element → token name once it's swapped. */
function Screen({ tok, on, bound, state }: { tok: Tokens; on?: string; bound: Record<string, string>; state?: 'ok' | 'bad' }) {
  const ring = (v: string) => cx('transition-all duration-500', on === v && 'outline-2 outline-offset-2', on === v && (state === 'ok' ? 'outline-mint-600' : state === 'bad' ? 'outline-error' : 'outline-dashed outline-brand'));
  const tag = (v: string) => bound[v] && <span className="ml-1.5 w-fit self-start rounded bg-mint-600 px-1.5 py-0.5 align-middle font-mono text-[10px] font-semibold text-white">{bound[v]}</span>;
  const card = (n: 1 | 2) => (
    <div className={cx('flex flex-col gap-2 border border-[#e5e7eb] bg-white text-[#111827]', n === 1 ? ring('padding') : '', ring('card-radius'))} style={{ padding: tok.space, borderRadius: tok.radius, transition: 'all 500ms' }}>
      <p className={ring(n === 1 ? 'title' : 'title2')} style={{ fontSize: 20, fontWeight: 600 }}>{n === 1 ? 'Monthly budget' : 'Savings goal'}{tag(n === 1 ? 'title' : 'title2')}</p>
      {n === 1 ? (
        <>
          <p className="text-sm text-[#4b5563]">₹12,400 left this month. <span className={cx('font-semibold underline', ring('link'))} style={{ color: tok.color }}>See spending</span>{tag('link')}</p>
          <div className="flex flex-wrap items-center gap-1">
            <span className={cx('inline-block px-4 py-2 text-sm font-semibold text-white', ring('button-fill'), ring('button-radius'))} style={{ background: tok.color, borderRadius: tok.radius, transition: 'all 500ms' }}>Add expense</span>
            {tag('button-fill')}{tag('button-radius')}
          </div>
        </>
      ) : <p className="text-sm text-[#4b5563]">₹18,000 of ₹50,000 saved for a new laptop.</p>}
      {n === 1 && tag('padding')}{n === 2 && tag('card-radius')}
    </div>
  );
  return (
    <div className="flex flex-col rounded-2xl bg-[#f3f4f6] p-4" style={{ gap: tok.space, transition: 'gap 500ms' }}>
      {card(1)}
      <div className={cx('-my-1 h-0', ring('gap'))}>{bound.gap && <span className="relative -top-2.5 block text-center">{tag('gap')}</span>}</div>
      {card(2)}
    </div>
  );
}

export function TokenSwap({ game, onDone }: { game: Game; onDone: (results: GameResult[]) => void }) {
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [results, setResults] = useState<Record<string, boolean>>({});
  const [tok, setTok] = useState<Tokens>(START);
  const card = game.cards[i];
  const right = Object.values(results).filter(Boolean).length;
  const name = (laneId: string) => game.lanes.find(l => l.id === laneId)!.label;
  const bound = Object.fromEntries(game.cards.slice(0, picked ? i + 1 : i).map(c => [c.visual!, name(c.lane)]));

  const pick = (laneId: string) => {
    if (!card || picked) return;
    const ok = laneId === card.lane;
    play(ok ? 'correct' : 'wrong');
    setPicked(laneId);
    setResults(r => ({ ...r, [card.id]: ok }));
  };

  if (!card) {
    const changes: { label: string; next: Partial<Tokens> }[] = [
      { label: tok.color === START.color ? 'Rebrand to green' : 'Back to blue', next: { color: tok.color === START.color ? '#15803d' : START.color } },
      { label: tok.radius === START.radius ? 'Rounder corners' : 'Sharper corners', next: { radius: tok.radius === START.radius ? 18 : START.radius } },
      { label: tok.space === START.space ? 'More breathing room' : 'Tighter', next: { space: tok.space === START.space ? 26 : START.space } },
    ];
    return (
      <div className="relative flex flex-col items-center gap-5 py-6 text-center">
        <Burst count={36} />
        <StageTitle eyebrow="Tokens in place" title={`${right} of ${game.cards.length} values swapped right`}>Now change a token. Watch every use follow.</StageTitle>
        <div className="w-full text-left"><Screen tok={tok} bound={bound} /></div>
        <div className="flex flex-wrap justify-center gap-2">
          {changes.map(c => <Button key={c.label} size="md" color="secondary" onPress={() => { play('whoosh'); setTok(t => ({ ...t, ...c.next })); }}>{c.label}</Button>)}
        </div>
        <NibSays mood={right === game.cards.length ? 'cheer' : 'idle'}>One edit to color-primary changed the button and the link together. That’s a rebrand in one line.</NibSays>
        <Button size="xl" onPress={() => onDone(game.cards.map(c => ({ id: c.id, correct: !!results[c.id] })))}>Continue the story</Button>
      </div>
    );
  }

  const ok = picked === card.lane, owner = game.lanes.find(l => l.id === card.lane)!;
  return (
    <div className="flex flex-col gap-5">
      <StageTitle eyebrow="Play" title={game.title}>{game.instructions}</StageTitle>
      <div className="flex items-baseline justify-between gap-3">
        <p className="text-xl font-semibold text-primary" data-current-card>{card.label}</p>
        <span className="shrink-0 text-sm font-semibold text-tertiary tabular-nums">{i + 1} / {game.cards.length}</span>
      </div>
      <motion.div animate={picked && !ok ? { x: [0, -10, 10, -6, 6, 0] } : { x: 0 }} transition={{ duration: 0.4 }}>
        <Screen tok={tok} on={card.visual} bound={bound} state={picked ? (ok ? 'ok' : 'bad') : undefined} />
      </motion.div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {game.lanes.map((l, k) => (
          <motion.button key={l.id} type="button" onClick={() => pick(l.id)} disabled={!!picked} whileTap={{ scale: 0.96 }}
            className={cx('flex flex-col rounded-2xl px-3 py-3 text-left text-white transition disabled:cursor-default', picked && l.id !== picked && l.id !== card.lane && 'opacity-50',
              picked && l.id === card.lane && 'ring-4 ring-mint-500')}
            style={{ background: FAMILY_SOLID[k % 4] }}>
            <span className="font-mono text-sm font-bold">{l.label}</span>
            <span className="text-xs font-medium opacity-90">{l.hint}</span>
          </motion.button>
        ))}
      </div>
      {picked && (
        <div className="flex flex-col gap-3">
          <NibSays mood={ok ? 'cheer' : 'sad'}>
            <span className="inline-flex items-center gap-1 font-semibold">{ok ? <CheckIcon className="size-4" weight="bold" /> : <XIcon className="size-4" weight="bold" />}{ok ? 'Swapped.' : `That’s ${owner.label}.`}</span>{' '}
            {owner.hint}, so it points at <code className="font-mono">{owner.label}</code> now.
          </NibSays>
          <div className="flex justify-end"><Button size="lg" onPress={() => { setPicked(null); setI(n => n + 1); }}>{i + 1 < game.cards.length ? 'Next value' : 'Change a token'}</Button></div>
        </div>
      )}
    </div>
  );
}
