'use client';
// Mini-game for ui.5-2: give each surface on Bunkar's sari page and checkout a height. Every card is a surface (its
// `visual`, a key of `BUNKAR_SURFACES`). Choose its elevation (`ELEVATIONS`, scored by `elevationOf`); the surface
// lifts in a side view and takes its shadow token (`shadowCss`), with a scrim for overlays (`SCRIM_ALPHA`). A switch
// shows dark mode, where height is lightness (`DARK_LIGHTNESS`) instead of shadow. A miss shows the surface at the
// wrong height, explains, and the card comes back later; first call scores.
import { useState } from 'react';
import { motion } from 'motion/react';
import { BUNKAR_SURFACES, DARK_LIGHTNESS, ELEVATIONS, SCRIM_ALPHA, elevationOf, shadowCss, type BunkarSurface, type Elevation, type Episode } from '@shape/content';
import { springs } from '@shape/ui';
import { Button } from '@/components/base/buttons/button';
import { cx } from '@/utils/cx';
import { Burst, NibSays, StageTitle } from '../kit';
import { ELEVATION_LABEL } from '../scenes/LightSource';
import type { GameResult } from './DiamondSort';
import { play } from '@/lib/sound';

type Game = Episode['game'];
const darkFill = (e: Elevation) => `hsl(222 18% ${DARK_LIGHTNESS[e]}%)`;

/** Where each surface sits in the preview, and what it says. */
const LAYOUT: Record<BunkarSurface, { box: React.CSSProperties; text: string; round?: string }> = {
  page: { box: { inset: 8 }, text: 'Diwali edit' },
  care: { box: { left: 12, right: 12, top: 64, height: 64 }, text: 'Care instructions' },
  pincode: { box: { left: 16, right: 16, top: 72, height: 44 }, text: 'Pincode' },
  card: { box: { left: 16, top: 20, width: '44%', height: 136 }, text: 'Banarasi silk · ₹8,400' },
  weaver: { box: { left: 16, right: 16, top: 56, height: 72 }, text: 'Meet Lakshmamma, Pochampally' },
  bagBar: { box: { left: 0, right: 0, bottom: 0, height: 52 }, text: '₹8,400 · Add to bag', round: '0' },
  menu: { box: { left: '28%', width: '56%', top: 36, height: 112 }, text: 'Plain · Zari border · Contrast' },
  toast: { box: { left: '18%', right: '18%', bottom: 14, height: 40 }, text: 'Added to bag' },
  drag: { box: { left: '30%', top: 28, width: '44%', height: 108, rotate: '-4deg' }, text: 'Chanderi cotton' },
  sheet: { box: { left: 0, right: 0, bottom: 0, height: '62%' }, text: 'Deliver to 500032', round: '16px 16px 0 0' },
  dialog: { box: { left: '14%', right: '14%', top: 40, height: 96 }, text: 'Remove from bag?' },
};

/** A small screen with the surface drawn at height `e`. */
function Preview({ k, e, dark, bad }: { k: BunkarSurface; e: Elevation | null; dark: boolean; bad: boolean }) {
  const l = LAYOUT[k];
  const at = e ?? 'flat';
  const pageBg = dark ? darkFill('flat') : 'var(--color-bg-secondary)';
  const surfaceBg = dark ? darkFill(at) : 'var(--color-bg-primary)';
  const fg = dark ? '#fff' : 'var(--color-text-primary)';
  const lined = at === 'flat' || (dark && at !== 'low');
  return (
    <div className={cx('relative h-44 overflow-hidden rounded-xl ring-2 ring-inset', bad ? 'ring-error' : 'ring-secondary')} style={{ background: pageBg }}>
      <div className="absolute inset-x-4 top-4 flex flex-col gap-2 opacity-50" aria-hidden>
        {[70, 50, 85, 40, 65].map((w, i) => <span key={i} className="h-2.5 rounded-full" style={{ width: `${w}%`, background: dark ? 'hsl(222 18% 22%)' : 'var(--color-bg-quaternary)' }} />)}
      </div>
      {e === 'overlay' && <motion.div className="absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ background: `rgb(0 0 0 / ${SCRIM_ALPHA})` }} />}
      <motion.div className="absolute flex items-center px-3 text-sm font-semibold" initial={false}
        animate={{ boxShadow: dark || !e ? 'none' : shadowCss(at) }} transition={{ duration: 0.5 }}
        style={{ ...l.box, background: surfaceBg, color: fg, borderRadius: l.round ?? 12,
          border: lined ? `1px solid ${dark ? 'hsl(222 18% 26%)' : 'var(--color-border-secondary)'}` : '1px solid transparent' }}>
        {l.text}
      </motion.div>
    </div>
  );
}

/** The page from the side: four heights, and the surface lifted to `e`. */
function Side({ e }: { e: Elevation | null }) {
  const y = (x: Elevation) => 92 - ELEVATIONS.indexOf(x) * 24;
  return (
    <svg viewBox="0 0 300 104" className="w-full" role="img" aria-label={e ? `Side view: lifted to ${ELEVATION_LABEL[e].toLowerCase()}` : 'Side view: not lifted yet'}>
      {ELEVATIONS.map(x => (
        <g key={x}>
          <line x1={80} y1={y(x)} x2={292} y2={y(x)} stroke="var(--color-border-secondary)" strokeDasharray={x === 'flat' ? undefined : '4 4'} strokeWidth={x === 'flat' ? 2.5 : 1.5} />
          <text x={72} y={y(x) + 5} fontSize={14} fontWeight={700} fill={e === x ? 'var(--color-text-primary)' : 'var(--color-text-tertiary)'} textAnchor="end">{ELEVATION_LABEL[x]}</text>
        </g>
      ))}
      <motion.g initial={false} animate={{ y: e ? y(e) - 92 : 0 }} transition={{ type: 'spring', stiffness: 140, damping: 16 }}>
        <rect x={140} y={84} width={110} height={8} rx={4} fill="var(--color-family-design)" />
      </motion.g>
    </svg>
  );
}

export function ElevationLift({ game, onDone }: { game: Game; onDone: (results: GameResult[]) => void }) {
  const [deck, setDeck] = useState(game.cards);
  const [results, setResults] = useState<Record<string, boolean>>({});
  const [placed, setPlaced] = useState<BunkarSurface[]>([]);
  const [miss, setMiss] = useState<Elevation | null>(null);
  const [right, setRight] = useState(false);
  const [dark, setDark] = useState(false);
  const card = deck[0];

  if (!card) {
    const n = Object.values(results).filter(Boolean).length;
    return (
      <div className="relative flex flex-col gap-5 py-6">
        <Burst count={36} />
        <StageTitle eyebrow="Heights set" title={`${n} of ${game.cards.length} lifted first time`}>Four tokens, one light, every surface by what it does.</StageTitle>
        <ul className="flex flex-col gap-2">
          {[...ELEVATIONS].reverse().map(e => (
            <li key={e} className="flex flex-col gap-1.5 rounded-xl bg-secondary p-3">
              <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                <span className="text-md font-bold text-primary">{ELEVATION_LABEL[e]}</span>
                <code className="text-xs break-all text-tertiary">{shadowCss(e)}</code>
              </div>
              <span className="text-sm text-secondary">{placed.filter(k => elevationOf(BUNKAR_SURFACES[k]) === e).map(k => LAYOUT[k].text).join(' · ')}</span>
            </li>
          ))}
        </ul>
        <NibSays mood={n === game.cards.length ? 'cheer' : 'idle'}>The page is flat, objects rest low, what covers content is raised, and what blocks the page is an overlay with a scrim. In dark mode the same heights become lighter fills.</NibSays>
        <Button size="xl" onPress={() => onDone(game.cards.map(c => ({ id: c.id, correct: !!results[c.id] })))}>Continue the story</Button>
      </div>
    );
  }

  const k = card.visual as BunkarSurface;
  const lane = elevationOf(BUNKAR_SURFACES[k]);
  const owner = game.lanes.find(l => l.id === lane)!;
  const done = game.cards.length - deck.length;
  const shown: Elevation | null = right ? lane : miss;
  const call = (laneId: string) => {
    if (miss || right) return;
    const ok = laneId === lane;
    play(ok ? 'correct' : 'wrong');
    setResults(rs => (card.id in rs ? rs : { ...rs, [card.id]: ok }));
    if (ok) { setRight(true); setPlaced(ps => [...ps, k]); }
    else { setMiss(laneId as Elevation); setTimeout(() => { setMiss(null); setDeck(dk => [...dk.slice(1), dk[0]]); }, 3600); }
  };
  const next = () => { setRight(false); setDeck(dk => dk.slice(1)); };

  return (
    <div className="flex flex-col gap-5">
      <StageTitle eyebrow="Play" title={game.title}>{game.instructions}</StageTitle>
      <div className="flex items-baseline justify-between">
        <span className="text-sm font-semibold text-tertiary">Surfaces to lift</span>
        <span className="text-sm font-semibold text-tertiary tabular-nums">{done} / {game.cards.length}</span>
      </div>
      <motion.div key={`${card.id}-${deck.length}`} initial={{ y: 24, opacity: 0 }} animate={miss ? { x: [0, -10, 10, -6, 6, 0], y: 0, opacity: 1 } : { y: 0, opacity: 1 }} transition={miss ? { duration: 0.4 } : springs.pop}
        className={cx('flex flex-col gap-3 rounded-2xl bg-primary p-4 shadow-lg ring-2 ring-inset sm:p-5', miss ? 'ring-error' : right ? 'ring-mint-600' : 'ring-secondary')} data-current-card>
        <p className="text-lg font-semibold text-primary">{card.label}</p>
        <div className="grid gap-3 sm:grid-cols-2 sm:items-center">
          <Preview k={k} e={shown} dark={dark} bad={!!miss} />
          <Side e={shown} />
        </div>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-sm font-semibold text-secondary">{shown ? (dark ? `Dark mode: ${DARK_LIGHTNESS[shown]}% lightness, no shadow` : `Shadow: ${shadowCss(shown) === 'none' ? 'none' : 'the ' + ELEVATION_LABEL[shown].toLowerCase() + ' token'}`) : 'Not lifted yet'}</span>
          <div className="flex rounded-full bg-secondary p-1" role="group" aria-label="Theme">
            {([[false, 'Light'], [true, 'Dark']] as const).map(([v, l]) => (
              <button key={l} type="button" aria-pressed={dark === v} onClick={() => setDark(v)}
                className={cx('rounded-full px-3 py-1 text-sm font-semibold transition', dark === v ? 'bg-primary text-primary shadow-xs' : 'text-tertiary hover:text-secondary')}>{l}</button>
            ))}
          </div>
        </div>
      </motion.div>
      <div className="grid grid-cols-2 gap-2 md:grid-cols-4" role="group" aria-label="Height for this surface">
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
        {miss && <NibSays mood="sad">That’s how it looks at {ELEVATION_LABEL[miss].toLowerCase()}. It belongs at <strong>{owner.label.toLowerCase()}</strong>. {card.note} It’ll come back round.</NibSays>}
        {right && (
          <div className="flex flex-col gap-3">
            <NibSays mood="cheer">{card.note}</NibSays>
            <div className="flex justify-end"><Button size="lg" onPress={next}>{deck.length > 1 ? 'Next surface' : 'See the tokens'}</Button></div>
          </div>
        )}
        {!miss && !right && <NibSays mood="think">What does it do? Is it part of the page, an object on it, something over other content, or something that stops the page until it’s dealt with?</NibSays>}
      </div>
    </div>
  );
}
