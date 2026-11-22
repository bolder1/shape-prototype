'use client';
// Mini-game for dc.1-2. First a playground: a real flex container with three items and controls for flex-direction,
// justify-content, align-items and gap, with the live CSS beside it. Then each card is a layout request; pick the
// property that does it and the container switches to the card's `visual` declaration. Scored on the first pick.
import { useState } from 'react';
import { motion } from 'motion/react';
import { CheckIcon, XIcon } from '@phosphor-icons/react/ssr';
import type { Episode } from '@shape/content';
import { springs } from '@shape/ui';
import { Button } from '@/components/base/buttons/button';
import { cx } from '@/utils/cx';
import { Burst, FAMILY_SOLID, NibSays, StageTitle } from '../kit';
import type { GameResult } from './DiamondSort';
import { play } from '@/lib/sound';

type Game = Episode['game'];
interface Flex { 'flex-direction': string; 'justify-content': string; 'align-items': string; gap: string }
const BASE: Flex = { 'flex-direction': 'row', 'justify-content': 'flex-start', 'align-items': 'flex-start', gap: '8px' };
const OPTIONS: Record<keyof Flex, string[]> = {
  'flex-direction': ['row', 'column'],
  'justify-content': ['flex-start', 'center', 'space-between'],
  'align-items': ['flex-start', 'center', 'stretch'],
  gap: ['8px', '16px', '32px'],
};

function Box({ f, changed }: { f: Flex; changed?: keyof Flex }) {
  return (
    <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
      <div className="flex min-h-48 rounded-xl border-2 border-dashed border-[var(--color-family-discover)] bg-primary p-3 transition-all"
        style={{ flexDirection: f['flex-direction'] as 'row', justifyContent: f['justify-content'], alignItems: f['align-items'], gap: f.gap }}>
        {[48, 80, 32].map((h, i) => (
          <motion.span key={i} layout transition={springs.pop} className="grid min-w-14 place-items-center rounded-lg px-3 text-xs font-bold text-white"
            style={{ background: FAMILY_SOLID[i], minHeight: f['align-items'] === 'stretch' ? undefined : h }}>{i + 1}</motion.span>
        ))}
      </div>
      <pre className="rounded-xl bg-[#0f172a] p-3 font-mono text-xs leading-6 text-[#e2e8f0]">
        {'.row {\n  display: flex;\n'}
        {(Object.keys(f) as (keyof Flex)[]).map(k => <span key={k} className={cx(k === changed && 'rounded bg-[#15803d] px-1 text-white')}>{`  ${k}: ${f[k]};\n`}</span>)}
        {'}'}
      </pre>
    </div>
  );
}

function Playground({ onNext }: { onNext: () => void }) {
  const [f, setF] = useState<Flex>(BASE);
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xl font-semibold text-primary">Play with a flex container</h2>
      <Box f={f} />
      <div className="grid gap-2 sm:grid-cols-2">
        {(Object.keys(OPTIONS) as (keyof Flex)[]).map(k => (
          <div key={k} className="flex flex-col gap-1">
            <span className="font-mono text-xs font-semibold text-tertiary">{k}</span>
            <div className="flex flex-wrap gap-1">
              {OPTIONS[k].map(v => (
                <button key={v} type="button" onClick={() => { play('tap'); setF(x => ({ ...x, [k]: v })); }}
                  className={cx('rounded-lg px-2.5 py-1.5 font-mono text-xs font-semibold ring-1 ring-inset transition-colors', f[k] === v ? 'bg-brand-solid text-white ring-brand' : 'bg-primary text-secondary ring-secondary hover:bg-primary_hover')}>{v}</button>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-end"><Button size="lg" onPress={onNext}>Take some requests</Button></div>
    </div>
  );
}

export function FlexTune({ game, onDone }: { game: Game; onDone: (results: GameResult[]) => void }) {
  const [played, setPlayed] = useState(false);
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

  if (!played) return <div className="flex flex-col gap-5"><StageTitle eyebrow="Play · explore" title={game.title}>{game.instructions}</StageTitle><Playground onNext={() => setPlayed(true)} /></div>;

  if (!card) {
    return (
      <div className="relative flex flex-col items-center gap-5 py-6 text-center">
        <Burst count={36} />
        <StageTitle eyebrow="Game over" title={`${right} of ${game.cards.length} requests solved with the right property`}>Direction, justify, align, gap.</StageTitle>
        <NibSays mood={right === game.cards.length ? 'cheer' : 'idle'}>Next time you set up auto layout, say it out loud in these words. That’s your spec.</NibSays>
        <Button size="xl" onPress={() => onDone(game.cards.map(c => ({ id: c.id, correct: !!results[c.id] })))}>Continue the story</Button>
      </div>
    );
  }

  const [prop, value] = (card.visual ?? 'gap: 8px').split(': ') as [keyof Flex, string];
  const f = picked ? { ...BASE, [prop]: value } : BASE;
  const ok = picked === card.lane, owner = game.lanes.find(l => l.id === card.lane)!;
  return (
    <div className="flex flex-col gap-5">
      <StageTitle eyebrow="Play · build" title={game.title}>Which property makes this change?</StageTitle>
      <div className="flex items-baseline justify-between gap-3">
        <p className="text-xl font-semibold text-primary" data-current-card>{card.label}</p>
        <span className="shrink-0 text-sm font-semibold text-tertiary tabular-nums">{i + 1} / {game.cards.length}</span>
      </div>
      <motion.div animate={picked && !ok ? { x: [0, -10, 10, -6, 6, 0] } : { x: 0 }} transition={{ duration: 0.4 }}
        className={cx('rounded-2xl bg-secondary p-3 ring-2 ring-inset', !picked ? 'ring-secondary' : ok ? 'ring-mint-600' : 'ring-error')}>
        <Box f={f} changed={picked ? prop : undefined} />
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
            <span className="inline-flex items-center gap-1 font-semibold">{ok ? <CheckIcon className="size-4" weight="bold" /> : <XIcon className="size-4" weight="bold" />}{ok ? 'That’s it.' : `It’s ${owner.label}.`}</span>{' '}
            <code className="font-mono">{card.visual}</code>
          </NibSays>
          <div className="flex justify-end"><Button size="lg" onPress={() => { setPicked(null); setI(n => n + 1); }}>{i + 1 < game.cards.length ? 'Next request' : 'See results'}</Button></div>
        </div>
      )}
    </div>
  );
}
