'use client';
// Mini-game for ia.3-2: build the desktop page for one Khelo turf on a 12-column grid. Each block arrives as a card;
// drag it onto an area of the grid diagram (edge to edge, full width 1–12, main 1–8, side 9–12) or tap the area. A right
// call snaps the block onto the page drawing at its row (`visual`) and columns (`GRID_AREA`); a miss shakes, explains,
// and the block comes back later. First try scores. At the end the page folds onto a 4-column phone (`phoneStack`).
import { useRef, useState } from 'react';
import { motion } from 'motion/react';
import { DesktopIcon, DeviceMobileIcon, HandGrabbingIcon } from '@phosphor-icons/react/ssr';
import { GRID_AREA, phoneStack, type Episode, type GridArea } from '@shape/content';
import { springs } from '@shape/ui';
import { Button } from '@/components/base/buttons/button';
import { cx } from '@/utils/cx';
import { Burst, NibSays, StageTitle } from '../kit';
import type { GameResult } from './DiamondSort';
import { play } from '@/lib/sound';

type Game = Episode['game'];
type Card = Game['cards'][number];
const short = (label: string) => { const s = label.split(':')[0]; return s.length > 30 ? `${s.slice(0, 29)}…` : s; };

/** The page as placed so far, on a 12-column desktop grid or a 4-column phone. */
function Page({ cards, phone }: { cards: Card[]; phone: boolean }) {
  const PW = phone ? 260 : 640, M = phone ? 16 : 32, G = 12, N = phone ? 4 : 12;
  const COL = (PW - 2 * M - (N - 1) * G) / N, colX = (c: number) => M + (c - 1) * (COL + G);
  const rowH = phone ? 30 : 38;
  const order = phone ? phoneStack(cards) : cards;
  const rows = [...new Set(order.map(c => c.visual))].sort((a, b) => Number(a) - Number(b));
  const rect = (c: Card, k: number) => {
    if (phone) return { x: c.lane === 'bleed' ? 0 : M, y: 12 + k * (rowH + 8), w: c.lane === 'bleed' ? PW : PW - 2 * M };
    const [a, b] = GRID_AREA[c.lane as GridArea];
    return { x: c.lane === 'bleed' ? 0 : colX(a), y: 12 + rows.indexOf(c.visual) * (rowH + 8), w: c.lane === 'bleed' ? PW : colX(b) + COL - colX(a) };
  };
  const PH = 12 + (phone ? order.length : rows.length) * (rowH + 8) + 6;
  return (
    <svg viewBox={`0 0 ${PW} ${Math.max(PH, 120)}`} className={cx('mx-auto w-full', phone ? 'max-w-72' : '')} role="img" aria-label={`${phone ? 'Phone' : 'Desktop'} page with ${cards.length} blocks placed`}>
      <rect width={PW} height={Math.max(PH, 120)} rx={phone ? 20 : 10} fill="var(--color-bg-primary)" stroke="var(--color-border-secondary)" strokeWidth={2} />
      {Array.from({ length: N }, (_, k) => <rect key={k} x={colX(k + 1)} y={0} width={COL} height={Math.max(PH, 120)} fill="var(--color-family-discover)" fillOpacity={0.16} />)}
      {order.map((c, k) => {
        const r = rect(c, k);
        return (
          <motion.g key={c.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={springs.pop}>
            <motion.rect initial={false} animate={{ x: r.x, y: r.y, width: r.w }} transition={springs.pop} height={rowH} rx={c.lane === 'bleed' ? 0 : 6}
              fill={c.lane === 'bleed' ? 'var(--color-bg-secondary)' : 'var(--color-bg-primary)'} stroke="var(--color-text-primary)" strokeOpacity={0.55} strokeWidth={1.5} />
            <motion.text initial={false} animate={{ x: r.x + 10, y: r.y + rowH / 2 + 4 }} transition={springs.pop} fontSize={phone ? 11 : 12} fontWeight={700} fill="var(--color-text-secondary)">
              {short(c.label)}{!phone && c.lane !== 'bleed' ? ` · ${GRID_AREA[c.lane as GridArea].join('–')}` : ''}
            </motion.text>
          </motion.g>
        );
      })}
      {!cards.length && <text x={PW / 2} y={64} textAnchor="middle" fontSize={13} fontWeight={700} fill="var(--color-text-tertiary)">Blocks land here, on their columns</text>}
    </svg>
  );
}

export function GridPlace({ game, onDone }: { game: Game; onDone: (results: GameResult[]) => void }) {
  const [deck, setDeck] = useState(game.cards);
  const [results, setResults] = useState<Record<string, boolean>>({});
  const [placed, setPlaced] = useState<string[]>([]);
  const [miss, setMiss] = useState(false);
  const [phone, setPhone] = useState(false);
  const zones = useRef<Record<string, HTMLButtonElement | null>>({});
  const card = deck[0];
  const placedCards = game.cards.filter(c => placed.includes(c.id));
  const last = placedCards.length ? game.cards.find(c => c.id === placed[placed.length - 1]) : undefined;

  const send = (laneId: string) => {
    if (!card || miss) return;
    const ok = laneId === card.lane;
    play(ok ? 'correct' : 'wrong');
    setResults(r => (card.id in r ? r : { ...r, [card.id]: ok }));
    if (ok) { setPlaced(p => [...p, card.id]); setDeck(d => d.slice(1)); }
    else { setMiss(true); setTimeout(() => { setMiss(false); setDeck(d => [...d.slice(1), d[0]]); }, 2400); }
  };
  const drop = (e: MouseEvent | TouchEvent | PointerEvent) => {
    const pt = 'changedTouches' in e ? e.changedTouches[0] : e;
    const hit = game.lanes.find(l => {
      const r = zones.current[l.id]?.getBoundingClientRect();
      return r && pt.clientX >= r.left && pt.clientX <= r.right && pt.clientY >= r.top && pt.clientY <= r.bottom;
    });
    if (hit) send(hit.id);
  };

  if (!card) {
    const right = Object.values(results).filter(Boolean).length;
    return (
      <div className="relative flex flex-col items-center gap-5 py-6 text-center">
        <Burst count={36} />
        <StageTitle eyebrow="Page on the grid" title={`${right} of ${game.cards.length} blocks placed first time`}>
          Every edge sits on a column. Now fold it onto a phone.
        </StageTitle>
        <div className="inline-flex rounded-xl bg-secondary p-1" role="group" aria-label="Grid">
          {[{ v: false, n: 'Desktop · 12 columns', I: DesktopIcon }, { v: true, n: 'Phone · 4 columns', I: DeviceMobileIcon }].map(o => (
            <button key={o.n} type="button" onClick={() => setPhone(o.v)} aria-pressed={phone === o.v}
              className={cx('inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-semibold transition', phone === o.v ? 'bg-primary text-primary shadow-sm' : 'text-tertiary hover:text-secondary')}>
              <o.I className="size-4" aria-hidden />{o.n}
            </button>
          ))}
        </div>
        <div className="w-full rounded-2xl bg-secondary p-3"><Page cards={game.cards} phone={phone} /></div>
        <NibSays mood={right === game.cards.length ? 'cheer' : 'idle'}>
          {phone ? 'On a phone every block spans all four columns, and the side column stacks under the main one, row by row. The Book summary often becomes a sticky bar.' : 'The task gets columns 1–8, what must stay in view sits beside it on 9–12, and only the photo breaks the margins.'}
        </NibSays>
        <Button size="xl" onPress={() => onDone(game.cards.map(c => ({ id: c.id, correct: !!results[c.id] })))}>Continue the story</Button>
      </div>
    );
  }

  const owner = game.lanes.find(l => l.id === card.lane)!;
  const zone = (id: GridArea, className: string) => {
    const l = game.lanes.find(x => x.id === id);
    if (!l) return null;
    return (
      <motion.button ref={el => { zones.current[id] = el; }} type="button" onClick={() => send(id)} disabled={miss} whileTap={{ scale: 0.98 }}
        className={cx('flex min-h-14 flex-col items-start justify-center gap-0.5 rounded-lg border-2 border-dashed bg-primary px-3 py-2 text-left transition-colors hover:bg-primary_hover disabled:cursor-default', className,
          miss && id === card.lane ? 'border-mint-600' : 'border-secondary')}>
        <span className="text-xs font-bold text-primary">{l.label}</span>
        <span className="text-[11px] leading-tight text-tertiary">{l.hint}</span>
      </motion.button>
    );
  };

  return (
    <div className="flex flex-col gap-5">
      <StageTitle eyebrow="Play" title={game.title}>{game.instructions}</StageTitle>
      <div className="flex items-baseline justify-between">
        <span className="text-sm font-semibold text-tertiary">The block</span>
        <span className="text-sm font-semibold text-tertiary tabular-nums">{placed.length} / {game.cards.length}</span>
      </div>
      <motion.div key={`${card.id}-${deck.length}`} drag={!miss} dragSnapToOrigin dragElastic={0.6} dragMomentum={false} onDragEnd={drop} whileDrag={{ scale: 1.05, rotate: -2, zIndex: 20 }}
        initial={{ y: -14, opacity: 0 }} animate={miss ? { x: [0, -10, 10, -6, 6, 0], opacity: 1 } : { y: 0, opacity: 1 }} transition={miss ? { duration: 0.4 } : springs.pop}
        className={cx('relative mx-auto flex w-full max-w-md cursor-grab touch-none items-center gap-3 rounded-2xl bg-primary px-5 py-4 shadow-lg ring-2 ring-inset active:cursor-grabbing', miss ? 'ring-error' : 'ring-secondary')}
        data-current-card>
        <span className="flex-1 text-lg font-semibold text-primary">{card.label}</span>
        <HandGrabbingIcon className="size-5 shrink-0 text-quaternary" aria-hidden />
      </motion.div>
      {/* the grid's areas, drawn as the page they make */}
      <div className="flex flex-col gap-1.5 rounded-2xl bg-secondary py-2">
        {zone('bleed', 'mx-0 rounded-none')}
        <div className="flex flex-col gap-1.5 px-4">
          {zone('full', '')}
          <div className="grid grid-cols-12 gap-1.5">
            {zone('main', 'col-span-8')}
            {zone('side', 'col-span-4')}
          </div>
        </div>
      </div>
      <div className="rounded-2xl bg-secondary p-3"><Page cards={placedCards} phone={false} /></div>
      <div className="min-h-14">
        {miss
          ? <NibSays mood="sad">It belongs in <strong>{owner.label}</strong>. {card.note} It’ll come back round.</NibSays>
          : last && <NibSays mood="cheer"><strong>{short(last.label)}:</strong> {last.note}</NibSays>}
      </div>
    </div>
  );
}
