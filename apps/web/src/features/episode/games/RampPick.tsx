'use client';
// Mini-game for ui.3-2: a blue ramp from 50 to 900 with four zones. Each card names an element (its `visual`); tap the
// zone it should use and the element is painted with that shade. A miss shows your shade next to the better one.
// Previews sit on white so the shades read honestly in both themes. Scored on the first pick.
import { useState } from 'react';
import { motion } from 'motion/react';
import { CheckIcon, XIcon } from '@phosphor-icons/react/ssr';
import type { Episode } from '@shape/content';
import { Button } from '@/components/base/buttons/button';
import { cx } from '@/utils/cx';
import { Burst, NibSays, StageTitle } from '../kit';
import { BLUE, SLATE, STEPS, ZONES } from '../scenes/PaletteBuild';
import type { GameResult } from './DiamondSort';
import { play } from '@/lib/sound';

type Game = Episode['game'];
/** The shade each zone paints with. */
const SHADE: Record<string, string> = { tint: BLUE[1], border: BLUE[2], solid: BLUE[6], ink: BLUE[9] };
const STEP: Record<string, number> = { tint: 100, border: 200, solid: 600, ink: 900 };

/** The element a card names, painted with `c` (or a dashed placeholder while unanswered). */
function Preview({ visual, c }: { visual?: string; c?: string }) {
  const ph = !c, paint = c ?? SLATE[3];
  const text = SLATE[9], body = SLATE[6];
  switch (visual) {
    case 'row': return (
      <div className="flex w-56 flex-col overflow-hidden rounded-xl border" style={{ borderColor: SLATE[2] }}>
        {['Groceries', 'Rent', 'Travel'].map((n, i) => <div key={n} className={cx('px-4 py-2.5 text-sm font-semibold', ph && i === 1 && 'outline-2 -outline-offset-2 outline-dashed')} style={{ color: text, background: i === 1 && !ph ? paint : '#fff', outlineColor: SLATE[4] }}>{n}</div>)}
      </div>
    );
    case 'button': return <div className={cx('rounded-xl px-6 py-3 text-md font-bold', ph && 'outline-2 outline-dashed')} style={{ background: ph ? '#fff' : paint, color: ph ? body : '#fff', outlineColor: SLATE[4] }}>Add expense</div>;
    case 'badge': return <span className="rounded-full px-3 py-1 text-sm font-bold" style={{ background: BLUE[1], color: ph ? SLATE[4] : paint }}>{ph ? '? text colour' : 'Recurring'}</span>;
    case 'input': return <div className="w-60 rounded-lg px-3 py-2.5 text-sm" style={{ border: `2px ${ph ? 'dashed' : 'solid'} ${paint}`, color: body }}>Amount in ₹</div>;
    case 'banner': return <div className={cx('w-64 rounded-xl px-4 py-3 text-sm font-semibold', ph && 'outline-2 outline-dashed')} style={{ background: ph ? '#fff' : paint, color: BLUE[9], outlineColor: SLATE[4] }}>Your salary arrives on the 1st.</div>;
    case 'link': return <p className="w-64 text-sm" style={{ color: body }}>You spent 12% more on food. <span className={cx('font-semibold underline', ph && 'decoration-dashed')} style={{ color: ph ? SLATE[4] : paint }}>See the breakdown</span></p>;
    case 'heading': return <p className="text-2xl font-bold" style={{ color: ph ? SLATE[3] : paint }}>November budget</p>;
    case 'divider': return (
      <div className="flex w-56 flex-col">
        {['Groceries', 'Rent', 'Travel'].map((n, i) => <div key={n} className="px-1 py-2 text-sm font-semibold" style={{ color: text, borderTop: i ? `${ph ? 2 : 1}px ${ph ? 'dashed' : 'solid'} ${paint}` : undefined }}>{n}</div>)}
      </div>
    );
    default: return null;
  }
}

export function RampPick({ game, onDone }: { game: Game; onDone: (results: GameResult[]) => void }) {
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
        <StageTitle eyebrow="Game over" title={`${right} of ${game.cards.length} shades picked first time`}>Tints behind, light for borders, solid for actions, ink for text.</StageTitle>
        <NibSays mood={right === game.cards.length ? 'cheer' : 'idle'}>When a shade feels wrong, ask what its job is. The job usually names the zone.</NibSays>
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

      <motion.div animate={picked && !ok ? { x: [0, -10, 10, -6, 6, 0] } : { x: 0 }} transition={{ duration: 0.4 }}
        className={cx('flex min-h-40 flex-wrap items-center justify-center gap-6 rounded-2xl bg-white p-6 ring-2 ring-inset transition-colors', !picked ? 'ring-secondary' : ok ? 'ring-mint-600' : 'ring-error')}>
        <div className="flex flex-col items-center gap-2">
          <Preview visual={card.visual} c={picked ? SHADE[picked] : undefined} />
          {picked && <span className="text-xs font-bold" style={{ color: SLATE[6] }}>{ok ? `blue-${STEP[picked]}` : `Yours · blue-${STEP[picked]}`}</span>}
        </div>
        {picked && !ok && (
          <div className="flex flex-col items-center gap-2">
            <Preview visual={card.visual} c={SHADE[card.lane]} />
            <span className="text-xs font-bold" style={{ color: '#047857' }}>Better · blue-{STEP[card.lane]}</span>
          </div>
        )}
      </motion.div>

      {/* the ramp: each zone is a button */}
      <div className="flex flex-col gap-2">
        <div className="grid grid-cols-10 gap-1">
          {BLUE.map((c, k) => <div key={c} className="flex flex-col items-center gap-1"><span className="h-10 w-full rounded-md ring-1 ring-black/10" style={{ background: c }} /><span className="text-[10px] font-semibold text-tertiary tabular-nums">{STEPS[k]}</span></div>)}
        </div>
        <div className="grid grid-cols-10 gap-1">
          {ZONES.map(z => {
            const lane = game.lanes.find(l => l.id === z.id)!;
            return (
              <motion.button key={z.id} type="button" onClick={() => pick(z.id)} disabled={!!picked} whileTap={{ scale: 0.96 }}
                className={cx('flex flex-col items-center rounded-xl bg-primary px-1 py-2 text-center ring-2 ring-inset transition disabled:cursor-default',
                  picked && z.id === card.lane ? 'ring-mint-600' : picked === z.id ? 'ring-error' : 'ring-secondary hover:bg-primary_hover', picked && z.id !== picked && z.id !== card.lane && 'opacity-50')}
                style={{ gridColumn: `${z.from + 1} / ${z.to + 2}` }}>
                <span className="text-sm font-bold text-primary">{lane.label.split(' ·')[0]}</span>
                <span className="text-[11px] font-medium text-tertiary">{lane.hint}</span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {picked && (
        <div className="flex flex-col gap-3">
          <NibSays mood={ok ? 'cheer' : 'sad'}>
            <span className="inline-flex items-center gap-1 font-semibold">{ok ? <CheckIcon className="size-4" weight="bold" /> : <XIcon className="size-4" weight="bold" />}{ok ? 'Painted.' : `That’s a job for ${owner.label.toLowerCase()}.`}</span>{' '}
            {owner.hint}.
          </NibSays>
          <div className="flex justify-end"><Button size="lg" onPress={() => { setPicked(null); setI(n => n + 1); }}>{i + 1 < game.cards.length ? 'Next element' : 'See results'}</Button></div>
        </div>
      )}
    </div>
  );
}
