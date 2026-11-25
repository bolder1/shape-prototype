'use client';
// Mini-game for ui.5-3: run the detail pass on Bunkar's Diwali screens. Every card is a detail (its `visual`, a key of
// `BUNKAR_DETAILS`) drawn under a 400% loupe. Choose the check it fails, or ship it (`CRAFT_CHECKS`, scored by
// `craftCheck`). A right call shows the detail fixed and writes the fix (`craftFix`) into a running change list; a
// right "ship" adds a "kept" line, because leaving what's right alone is part of the pass. A miss explains and the card
// comes back later; first call scores.
import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { BUNKAR_DETAILS, craftCheck, craftFix, innerRadius, type BunkarDetail, type Episode } from '@shape/content';
import { springs } from '@shape/ui';
import { Button } from '@/components/base/buttons/button';
import { cx } from '@/utils/cx';
import { Burst, NibSays, StageTitle } from '../kit';
import type { GameResult } from './DiamondSort';
import { play } from '@/lib/sound';

type Game = Episode['game'];
const ink = 'var(--color-text-primary)';
const soft = 'var(--color-bg-secondary)';
const line = 'var(--color-border-secondary)';
const muted = 'var(--color-text-tertiary)';
const mint = '#2BC08A';
const tab = { fontVariantNumeric: 'tabular-nums' } as const;
const prop = { fontVariantNumeric: 'proportional-nums' } as const;

/** The detail at 400%, as found (`fixed` false) or after the pass. 300 × 170 canvas. */
function Detail({ k, fixed }: { k: BunkarDetail; fixed: boolean }) {
  const d = BUNKAR_DETAILS[k];
  switch (k) {
    case 'review':
      return <g>{(fixed ? ['“Softest Chanderi', 'I’ve owned”'] : ['"Softest Chanderi', 'I\'ve owned"']).map((l, i) => <text key={i} x={150} y={78 + i * 40} fontSize={30} fontWeight={600} fill={ink} textAnchor="middle" fontStyle="italic">{l}</text>)}</g>;
    case 'price':
    case 'delivery':
      return <text x={150} y={98} fontSize={k === 'price' ? 36 : 26} fontWeight={700} fill={ink} textAnchor="middle">{k === 'price' ? (fixed ? '₹2,400–₹3,100' : '₹2,400-₹3,100') : 'Arrives in 4–6 days'}</text>;
    case 'summary':
    case 'dates': {
      const rows = k === 'summary' ? [['Banarasi silk', '₹8,400'], ['Blouse piece', '₹1,150'], ['Gift wrap', '₹111'], ['Total', '₹9,661']] : [['Ordered', '11 Oct'], ['Shipped', '14 Oct'], ['Delivered', '18 Oct'], ['Returned', '21 Oct']];
      const style = k === 'dates' || fixed ? tab : prop;
      return (
        <g>
          <line x1={250} y1={14} x2={250} y2={156} stroke={mint} strokeDasharray="4 4" strokeWidth={1.5} opacity={0.8} />
          {rows.map(([a, b], i) => (
            <g key={a}>
              <text x={36} y={42 + i * 36} fontSize={17} fontWeight={600} fill={muted}>{a}</text>
              <text x={246} y={42 + i * 36} fontSize={24} fontWeight={i === 3 ? 800 : 600} fill={ink} textAnchor="end" style={style}>{b}</text>
            </g>
          ))}
        </g>
      );
    }
    case 'heading':
      return (
        <g>
          <rect x={6} y={30} width={288} height={110} rx={14} fill="var(--color-family-design)" opacity={0.16} />
          {(fixed ? ['Handwoven in Pochampally', 'for your Diwali'] : ['Handwoven in Pochampally for your', 'Diwali']).map((l, i) => (
            <text key={l} x={16} y={78 + i * 26} fontSize={15} fontWeight={700} fill={ink}>{l}</text>
          ))}
        </g>
      );
    case 'photo':
    case 'sheet': {
      const o = d.kind === 'radius' ? d : { outer: 16, padding: 8, inner: 8 };
      const s = 2.4, inner = fixed ? innerRadius(o.outer, o.padding) : o.inner;
      return (
        <g>
          <rect x={30} y={14} width={240} height={150} rx={o.outer * s} fill={soft} stroke={ink} strokeWidth={2} />
          <motion.rect x={30 + o.padding * s} y={14 + o.padding * s} width={240 - 2 * o.padding * s} height={150 - 2 * o.padding * s} fill={k === 'sheet' ? 'var(--color-family-discover)' : 'var(--color-family-design)'} opacity={0.5}
            initial={false} animate={{ rx: inner * s }} transition={{ type: 'spring', stiffness: 140, damping: 18 }} />
          <text x={150} y={96} fontSize={17} fontWeight={800} fill={ink} textAnchor="middle">{o.outer} / {o.padding} / {inner} px</text>
        </g>
      );
    }
    case 'tabs': {
      const widths = d.kind === 'stroke' ? d.widths : [];
      return (
        <g fill="none" stroke={ink} strokeLinecap="round" strokeLinejoin="round">
          {widths.map((w, i) => {
            const sw = (fixed ? 1.5 : w) * 2.6, x = 22 + i * 70;
            return (
              <g key={i} transform={`translate(${x} 50)`} strokeWidth={sw}>
                {i === 0 && <path d="M8 30 L32 10 L56 30 L56 60 L8 60 Z" />}
                {i === 1 && <><circle cx={28} cy={30} r={18} /><path d="M42 44 L56 58" /></>}
                {i === 2 && <path d="M32 58 C10 42 4 32 8 22 C12 12 26 10 32 22 C38 10 52 12 56 22 C60 32 54 42 32 58 Z" />}
                {i === 3 && <><path d="M10 24 L54 24 L50 60 L14 60 Z" /><path d="M22 24 C22 10 42 10 42 24" /></>}
              </g>
            );
          })}
        </g>
      );
    }
    case 'focus':
      return (
        <g>
          <rect x={50} y={55} width={200} height={60} rx={30} fill="var(--color-bg-brand-solid)" />
          <text x={150} y={92} fontSize={21} fontWeight={700} fill="#fff" textAnchor="middle">Add to bag</text>
          {fixed && <rect x={42} y={47} width={216} height={76} rx={38} fill="none" stroke="var(--color-focus-ring, #3B6FF5)" strokeWidth={4} />}
          {!fixed && <text x={150} y={150} fontSize={15} fontWeight={600} fill={muted} textAnchor="middle">Focused by keyboard. Can you tell?</text>}
        </g>
      );
    case 'coop':
      return (
        <g>
          <rect x={20} y={20} width={260} height={130} rx={14} fill={soft} stroke={line} />
          <clipPath id="dl-coop"><rect x={36} y={30} width={228} height={110} /></clipPath>
          <g clipPath="url(#dl-coop)">
            {(fixed ? ['Pochampally Handloom', 'Weavers’ Co-operative…'] : ['Pochampally Handloom Weavers’ Co-o']).map((l, i) => (
              <text key={l} x={36} y={68 + i * 28} fontSize={18} fontWeight={800} fill={ink}>{l}</text>
            ))}
          </g>
          <text x={36} y={134} fontSize={15} fontWeight={600} fill={muted}>{fixed ? 'Tap for the full name' : 'Cut mid-word, no way to read it'}</text>
        </g>
      );
    case 'wishlist':
      return (
        <g>
          <rect x={40} y={10} width={220} height={150} rx={14} fill="var(--color-bg-primary)" stroke={line} />
          <text x={58} y={40} fontSize={17} fontWeight={800} fill={ink}>Wishlist</text>
          {fixed && (
            <g>
              <text x={150} y={72} fontSize={26} fill="var(--color-family-build)" textAnchor="middle">♡</text>
              <text x={150} y={96} fontSize={14} fontWeight={600} fill={ink} textAnchor="middle">Tap ♡ on any sari</text>
              <text x={150} y={114} fontSize={14} fontWeight={600} fill={ink} textAnchor="middle">to save it here</text>
              <rect x={95} y={124} width={110} height={28} rx={14} fill={soft} stroke={line} />
              <text x={150} y={143} fontSize={14} fontWeight={700} fill={ink} textAnchor="middle">Diwali edit</text>
            </g>
          )}
        </g>
      );
  }
}

export function DetailLoupe({ game, onDone }: { game: Game; onDone: (results: GameResult[]) => void }) {
  const [deck, setDeck] = useState(game.cards);
  const [results, setResults] = useState<Record<string, boolean>>({});
  const [log, setLog] = useState<{ k: BunkarDetail; line: string; kept: boolean }[]>([]);
  const [miss, setMiss] = useState<string | null>(null);
  const [right, setRight] = useState(false);
  const card = deck[0];

  if (!card) {
    const n = Object.values(results).filter(Boolean).length;
    const changes = log.filter(l => !l.kept), kept = log.filter(l => l.kept);
    return (
      <div className="relative flex flex-col gap-5 py-6">
        <Burst count={36} />
        <StageTitle eyebrow="Change list" title={`${changes.length} changes, ${kept.length} kept`}>{n} of {game.cards.length} called first time. This is what goes to engineering.</StageTitle>
        <ol className="flex flex-col gap-1.5 rounded-2xl bg-secondary p-3">
          {changes.map((l, i) => (
            <li key={l.k} className="flex gap-3 rounded-lg bg-primary px-3 py-2">
              <span className="w-5 shrink-0 text-right text-sm font-bold text-tertiary tabular-nums">{i + 1}</span>
              <span className="flex flex-col"><span className="text-xs font-semibold text-tertiary">{BUNKAR_DETAILS[l.k].where}</span><span className="text-sm text-primary">{l.line}</span></span>
            </li>
          ))}
          {kept.map(l => (
            <li key={l.k} className="flex gap-3 px-3 py-1.5">
              <span className="w-5 shrink-0 text-right text-sm font-bold text-tertiary">✓</span>
              <span className="text-sm text-secondary">Kept: {BUNKAR_DETAILS[l.k].where.toLowerCase()}, already right</span>
            </li>
          ))}
        </ol>
        <NibSays mood={n === game.cards.length ? 'cheer' : 'idle'}>Type, shape, state, on every screen, at 400%, with real content. Write each change as before → after → why, and leave alone what’s right.</NibSays>
        <Button size="xl" onPress={() => onDone(game.cards.map(c => ({ id: c.id, correct: !!results[c.id] })))}>Continue the story</Button>
      </div>
    );
  }

  const k = card.visual as BunkarDetail;
  const d = BUNKAR_DETAILS[k];
  const lane = craftCheck(d);
  const owner = game.lanes.find(l => l.id === lane)!;
  const done = game.cards.length - deck.length;
  const call = (laneId: string) => {
    if (miss || right) return;
    const ok = laneId === lane;
    play(ok ? 'correct' : 'wrong');
    setResults(rs => (card.id in rs ? rs : { ...rs, [card.id]: ok }));
    if (ok) { setRight(true); const f = craftFix(d); setLog(ls => [...ls, { k, line: f ?? '', kept: f === null }]); }
    else { setMiss(laneId); setTimeout(() => { setMiss(null); setDeck(dk => [...dk.slice(1), dk[0]]); }, 3600); }
  };
  const next = () => { setRight(false); setDeck(dk => dk.slice(1)); };
  const fix = craftFix(d);

  return (
    <div className="flex flex-col gap-5">
      <StageTitle eyebrow="Play" title={game.title}>{game.instructions}</StageTitle>
      <div className="flex items-baseline justify-between">
        <span className="text-sm font-semibold text-tertiary">Details checked</span>
        <span className="text-sm font-semibold text-tertiary tabular-nums">{done} / {game.cards.length} · {log.filter(l => !l.kept).length} changes</span>
      </div>
      <motion.div key={`${card.id}-${deck.length}`} initial={{ y: 24, opacity: 0 }} animate={miss ? { x: [0, -10, 10, -6, 6, 0], y: 0, opacity: 1 } : { y: 0, opacity: 1 }} transition={miss ? { duration: 0.4 } : springs.pop}
        className={cx('flex flex-col gap-3 rounded-2xl bg-primary p-4 shadow-lg ring-2 ring-inset sm:p-5', miss ? 'ring-error' : right ? 'ring-mint-600' : 'ring-secondary')} data-current-card>
        <span className="text-xs font-bold tracking-wide text-tertiary uppercase">{d.where}</span>
        <p className="text-lg font-semibold text-primary">{card.label}</p>
        <div className="relative mx-auto w-full max-w-sm">
          <motion.div initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={springs.pop}
            className="overflow-hidden rounded-[2rem] bg-primary ring-4 ring-secondary">
            <svg viewBox="0 0 300 170" className="w-full" role="img" aria-label={right && fix ? `Fixed: ${fix}` : card.label}><Detail k={k} fixed={right} /></svg>
          </motion.div>
          <span className="absolute -top-2 right-4 rounded-full bg-secondary px-2 py-0.5 text-xs font-bold text-secondary ring-1 ring-secondary">400%</span>
        </div>
        <AnimatePresence>
          {right && (
            <motion.p initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="rounded-lg bg-secondary px-3 py-2 text-sm font-semibold text-primary">
              {fix ? <>Change {log.filter(l => !l.kept).length}: {fix}</> : 'Kept as it is: already right.'}
            </motion.p>
          )}
        </AnimatePresence>
      </motion.div>
      <div className="grid grid-cols-2 gap-2 md:grid-cols-4" role="group" aria-label="Check this detail fails">
        {game.lanes.map(l => (
          <motion.button key={l.id} type="button" onClick={() => call(l.id)} disabled={!!miss || right} whileTap={{ scale: 0.97 }}
            className={cx('flex flex-col items-start gap-0.5 rounded-xl border-2 bg-primary px-3 py-2.5 text-left transition enabled:hover:bg-primary_hover disabled:cursor-default',
              right && l.id === lane ? 'border-mint-600' : miss === l.id ? 'border-error' : miss && l.id === lane ? 'border-mint-600' : 'border-secondary')}>
            <span className="text-md font-bold text-primary">{l.label}</span>
            <span className="text-xs font-medium text-tertiary">{l.hint}</span>
          </motion.button>
        ))}
      </div>
      <div className="min-h-14" aria-live="polite">
        {miss && <NibSays mood="sad">Not quite: <strong>{owner.label.toLowerCase()}</strong>. {card.note} It’ll come back round.</NibSays>}
        {right && (
          <div className="flex flex-col gap-3">
            <NibSays mood="cheer">{card.note}</NibSays>
            <div className="flex justify-end"><Button size="lg" onPress={next}>{deck.length > 1 ? 'Next detail' : 'See the change list'}</Button></div>
          </div>
        )}
        {!miss && !right && <NibSays mood="think">Look at the glyphs, the corners and the strokes, then ask what happens with a keyboard, a long name or nothing at all. If it’s already right, ship it.</NibSays>}
      </div>
    </div>
  );
}
