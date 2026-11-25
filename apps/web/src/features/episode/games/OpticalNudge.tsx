'use client';
// Mini-game for ui.5-1: fix Bunkar's shapes by eye. Every card is a shape placed exactly by its box (its `visual`, a key
// of `BUNKAR_CASES`), drawn with its box guides. Choose the correction (`OPTICAL_FIXES`, scored by `opticalFix`); a
// right call applies it, measured where it can be (`centroidShift`, `equalAreaDiameter`), and a switch flips between
// the maths and the eye. A miss explains and the card comes back later; first call scores.
import { useState } from 'react';
import { motion } from 'motion/react';
import { BUNKAR_CASES, centroidShift, equalAreaDiameter, opticalFix, type BunkarCase, type Episode, type OpticalFix } from '@shape/content';
import { springs } from '@shape/ui';
import { Button } from '@/components/base/buttons/button';
import { cx } from '@/utils/cx';
import { Burst, NibSays, StageTitle } from '../kit';
import type { GameResult } from './DiamondSort';
import { play } from '@/lib/sound';

type Game = Episode['game'];
const ink = 'var(--color-text-primary)';
const guide = 'var(--color-fg-error-primary)';
const fill = 'var(--color-family-design)';
const mint = '#2BC08A';
const spring = { type: 'spring', stiffness: 160, damping: 18 } as const;

/** What the fix comes to on screen, in Bunkar's real sizes. */
const MEASURE: Record<BunkarCase, string> = {
  play: `${centroidShift(18)} px toward the point (18 px triangle)`,
  caps: 'Cap height centred: down about 1.5 px',
  swatch: 'Nothing: a circle in a circle is centred',
  avatar: `48 px → ${Math.round(equalAreaDiameter(48))} px circle`,
  star: 'Points run about 2 px past each line',
  wordmark: 'U and S run about 3% past both lines',
  quote: 'Quote mark hangs 10 px into the margin',
  bullets: 'Bullets hang 16 px; text on the heading’s edge',
  back: 'Icon box moves 4 px left; the arrow’s ink sits on 16 px',
  prices: 'Nothing: tabular figures, one right edge',
};

/** The shape, drawn by its box (`eye` false) or corrected (`eye` true). 300 × 150 canvas. */
function Shape({ k, eye }: { k: BunkarCase; eye: boolean }) {
  const e = eye ? 1 : 0;
  const box = !eye;
  switch (k) {
    case 'play': {
      const w = 54, h = 60, x0 = 150 - w / 2;
      return (
        <g>
          <circle cx={150} cy={75} r={62} fill={fill} opacity={0.3} />
          <motion.path d={`M${x0} ${75 - h / 2} L${x0 + w} 75 L${x0} ${75 + h / 2} Z`} fill={ink} animate={{ x: e * centroidShift(w) }} transition={spring} />
          {box && <><rect x={x0} y={75 - h / 2} width={w} height={h} fill="none" stroke={guide} strokeDasharray="5 4" strokeWidth={1.5} /><line x1={150} y1={8} x2={150} y2={142} stroke={guide} strokeDasharray="5 4" strokeWidth={1.5} /></>}
        </g>
      );
    }
    case 'caps':
      return (
        <g>
          <rect x={30} y={40} width={240} height={70} rx={35} fill="var(--color-bg-brand-solid)" />
          <motion.text x={150} y={84} fontSize={26} fontWeight={800} fill="#fff" textAnchor="middle" letterSpacing={1.5} animate={{ y: e * 4 }} transition={spring}>ADD TO BAG</motion.text>
          {box && <rect x={70} y={57} width={160} height={34} fill={guide} opacity={0.22} />}
          {eye && <line x1={40} y1={75} x2={260} y2={75} stroke={mint} strokeDasharray="5 4" strokeWidth={1.5} />}
        </g>
      );
    case 'swatch':
      return (
        <g>
          <circle cx={150} cy={75} r={52} fill="none" stroke={ink} strokeWidth={3} />
          <circle cx={150} cy={75} r={34} fill="var(--color-family-build)" />
          <line x1={150} y1={12} x2={150} y2={138} stroke={eye ? mint : guide} strokeDasharray="5 4" strokeWidth={1.5} />
          <line x1={88} y1={75} x2={212} y2={75} stroke={eye ? mint : guide} strokeDasharray="5 4" strokeWidth={1.5} />
        </g>
      );
    case 'avatar': {
      const s = 64, d = s + e * (equalAreaDiameter(s) - s);
      return (
        <g>
          <line x1={10} y1={43} x2={290} y2={43} stroke={guide} strokeDasharray="5 4" strokeWidth={1.5} opacity={0.7} />
          <line x1={10} y1={107} x2={290} y2={107} stroke={guide} strokeDasharray="5 4" strokeWidth={1.5} opacity={0.7} />
          <rect x={30} y={43} width={s} height={s} rx={6} fill="var(--color-family-grow)" opacity={0.5} />
          <motion.circle cx={150} cy={75} fill="var(--color-family-discover)" opacity={0.6} animate={{ r: d / 2 }} transition={spring} initial={{ r: s / 2 }} />
          <rect x={206} y={43} width={s} height={s} rx={6} fill="var(--color-family-grow)" opacity={0.5} />
        </g>
      );
    }
    case 'star': {
      const sc = 1 + e * 0.12;
      const pts = Array.from({ length: 10 }, (_, i) => { const a = -Math.PI / 2 + (i * Math.PI) / 5, r = i % 2 ? 14 : 32; return `${(Math.cos(a) * r).toFixed(1)},${(Math.sin(a) * r + 3).toFixed(1)}`; }).join(' ');
      return (
        <g>
          <line x1={10} y1={45} x2={290} y2={45} stroke={guide} strokeDasharray="5 4" strokeWidth={1.5} opacity={0.7} />
          <line x1={10} y1={105} x2={290} y2={105} stroke={guide} strokeDasharray="5 4" strokeWidth={1.5} opacity={0.7} />
          <rect x={40} y={45} width={60} height={60} rx={8} fill="var(--color-family-grow)" opacity={0.5} />
          <g transform="translate(150 75)"><motion.g animate={{ scale: sc }} transition={spring}><polygon points={pts} fill={fill} /></motion.g></g>
          <rect x={200} y={45} width={60} height={60} rx={8} fill="var(--color-family-grow)" opacity={0.5} />
        </g>
      );
    }
    case 'wordmark':
      return (
        <g>
          <line x1={10} y1={48} x2={290} y2={48} stroke={guide} strokeDasharray="5 4" strokeWidth={1.5} opacity={0.7} />
          <line x1={10} y1={110} x2={290} y2={110} stroke={guide} strokeDasharray="5 4" strokeWidth={1.5} opacity={0.7} />
          {['U', 'T', 'S', 'A', 'V'].map((l, i) => {
            const round = l === 'U' || l === 'S';
            return (
              <motion.text key={l} x={38 + i * 56} y={110} fontSize={84} fontWeight={800} fill={ink} textAnchor="middle" animate={{ scaleY: round ? 1 + e * 0.06 : 1 }} transition={spring}>{l}</motion.text>
            );
          })}
        </g>
      );
    case 'quote':
      return (
        <g>
          <line x1={60} y1={10} x2={60} y2={140} stroke={eye ? mint : guide} strokeDasharray="5 4" strokeWidth={1.5} />
          <motion.text x={60} y={66} fontSize={56} fontWeight={800} fill={fill} animate={{ x: e * -24 }} transition={spring}>“</motion.text>
          <motion.rect y={38} height={14} rx={4} fill={ink} opacity={0.75} animate={{ x: eye ? 60 : 84, width: eye ? 210 : 186 }} transition={spring} initial={false} />
          {[64, 90, 116].map(y => <rect key={y} x={60} y={y} width={y === 116 ? 140 : 210} height={14} rx={4} fill={ink} opacity={0.75} />)}
        </g>
      );
    case 'bullets':
      return (
        <g>
          <line x1={60} y1={10} x2={60} y2={140} stroke={eye ? mint : guide} strokeDasharray="5 4" strokeWidth={1.5} />
          <rect x={60} y={20} width={150} height={18} rx={4} fill={ink} />
          {[62, 92, 122].map((y, i) => (
            <g key={y}>
              <motion.circle cy={y} r={5} fill={fill} animate={{ cx: eye ? 46 : 66 }} transition={spring} initial={false} />
              <motion.rect y={y - 7} height={14} rx={4} fill={ink} opacity={0.65} animate={{ x: eye ? 60 : 80 }} transition={spring} initial={false} width={180 - i * 30} />
            </g>
          ))}
        </g>
      );
    case 'back':
      return (
        <g>
          <line x1={48} y1={6} x2={48} y2={144} stroke={eye ? mint : guide} strokeDasharray="5 4" strokeWidth={1.5} />
          <motion.g animate={{ x: eye ? -12 : 0 }} transition={spring}>
            <rect x={48} y={18} width={72} height={72} fill="none" stroke={box ? guide : 'transparent'} strokeDasharray="5 4" strokeWidth={1.5} />
            <path d="M84 33 L60 54 L84 75 M60 54 L108 54" fill="none" stroke={ink} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" />
          </motion.g>
          <rect x={48} y={108} width={170} height={20} rx={5} fill={ink} />
        </g>
      );
    case 'prices':
      return (
        <g>
          <line x1={232} y1={6} x2={232} y2={144} stroke={eye ? mint : guide} strokeDasharray="5 4" strokeWidth={1.5} />
          {['₹2,400', '₹11,150', '₹640', '₹14,190'].map((v, i) => (
            <text key={v} x={228} y={34 + i * 34} fontSize={22} fontWeight={i === 3 ? 800 : 600} fill={ink} textAnchor="end" style={{ fontVariantNumeric: 'tabular-nums' }}>{v}</text>
          ))}
          <text x={70} y={34} fontSize={16} fontWeight={600} fill="var(--color-text-tertiary)">Banarasi</text>
          <text x={70} y={68} fontSize={16} fontWeight={600} fill="var(--color-text-tertiary)">Kanjivaram</text>
          <text x={70} y={102} fontSize={16} fontWeight={600} fill="var(--color-text-tertiary)">Blouse piece</text>
          <text x={70} y={136} fontSize={16} fontWeight={800} fill="var(--color-text-tertiary)">Total</text>
        </g>
      );
  }
}

export function OpticalNudge({ game, onDone }: { game: Game; onDone: (results: GameResult[]) => void }) {
  const [deck, setDeck] = useState(game.cards);
  const [results, setResults] = useState<Record<string, boolean>>({});
  const [fixed, setFixed] = useState<BunkarCase[]>([]);
  const [miss, setMiss] = useState<string | null>(null);
  const [right, setRight] = useState(false);
  const [eye, setEye] = useState(true);
  const card = deck[0];

  if (!card) {
    const n = Object.values(results).filter(Boolean).length;
    return (
      <div className="relative flex flex-col gap-5 py-6">
        <Burst count={36} />
        <StageTitle eyebrow="Pass done" title={`${n} of ${game.cards.length} called first time`}>Every correction, measured, for the spec.</StageTitle>
        <ul className="flex flex-col gap-2 rounded-2xl bg-secondary p-3">
          {fixed.map(k => (
            <li key={k} className="flex flex-col gap-0.5 rounded-lg bg-primary px-3 py-2 sm:flex-row sm:items-baseline sm:justify-between sm:gap-3">
              <span className="text-sm font-semibold text-primary">{game.lanes.find(l => l.id === opticalFix(BUNKAR_CASES[k]))!.label}</span>
              <span className="text-sm text-secondary">{MEASURE[k]}</span>
            </li>
          ))}
        </ul>
        <NibSays mood={n === game.cards.length ? 'cheer' : 'idle'}>Boxes and mass agree for symmetric shapes. Where they don’t, move toward the mass, overshoot round and pointed edges, and hang the light ones. Keep data exact, and put every correction in the asset so it lasts.</NibSays>
        <Button size="xl" onPress={() => onDone(game.cards.map(c => ({ id: c.id, correct: !!results[c.id] })))}>Continue the story</Button>
      </div>
    );
  }

  const k = card.visual as BunkarCase;
  const lane = opticalFix(BUNKAR_CASES[k]) as OpticalFix;
  const owner = game.lanes.find(l => l.id === lane)!;
  const done = game.cards.length - deck.length;
  const call = (laneId: string) => {
    if (miss || right) return;
    const ok = laneId === lane;
    play(ok ? 'correct' : 'wrong');
    setResults(rs => (card.id in rs ? rs : { ...rs, [card.id]: ok }));
    if (ok) { setRight(true); setEye(true); setFixed(fs => [...fs, k]); }
    else { setMiss(laneId); setTimeout(() => { setMiss(null); setDeck(dk => [...dk.slice(1), dk[0]]); }, 3600); }
  };
  const next = () => { setRight(false); setDeck(dk => dk.slice(1)); };

  return (
    <div className="flex flex-col gap-5">
      <StageTitle eyebrow="Play" title={game.title}>{game.instructions}</StageTitle>
      <div className="flex items-baseline justify-between">
        <span className="text-sm font-semibold text-tertiary">Shapes to check</span>
        <span className="text-sm font-semibold text-tertiary tabular-nums">{done} / {game.cards.length}</span>
      </div>
      <motion.div key={`${card.id}-${deck.length}`} initial={{ y: 24, opacity: 0 }} animate={miss ? { x: [0, -10, 10, -6, 6, 0], y: 0, opacity: 1 } : { y: 0, opacity: 1 }} transition={miss ? { duration: 0.4 } : springs.pop}
        className={cx('flex flex-col gap-3 rounded-2xl bg-primary p-4 shadow-lg ring-2 ring-inset sm:p-5', miss ? 'ring-error' : right ? 'ring-mint-600' : 'ring-secondary')} data-current-card>
        <p className="text-lg font-semibold text-primary">{card.label}</p>
        <div className="mx-auto w-full max-w-sm rounded-xl bg-secondary">
          <svg viewBox="0 0 300 150" className="w-full" role="img" aria-label={right && eye ? `${card.label}, corrected: ${MEASURE[k]}` : `${card.label}, placed by its box`}>
            <Shape k={k} eye={right && eye} />
          </svg>
        </div>
        {right && (
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-sm font-semibold text-secondary">{MEASURE[k]}</span>
            <div className="flex rounded-full bg-secondary p-1" role="group" aria-label="Compare">
              {([[false, 'The maths'], [true, 'The eye']] as const).map(([v, l]) => (
                <button key={l} type="button" aria-pressed={eye === v} onClick={() => setEye(v)}
                  className={cx('rounded-full px-3 py-1 text-sm font-semibold transition', eye === v ? 'bg-primary text-primary shadow-xs' : 'text-tertiary hover:text-secondary')}>{l}</button>
              ))}
            </div>
          </div>
        )}
      </motion.div>
      <div className="grid grid-cols-2 gap-2 md:grid-cols-4" role="group" aria-label="Correction for this shape">
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
            <div className="flex justify-end"><Button size="lg" onPress={next}>{deck.length > 1 ? 'Next shape' : 'See the spec'}</Button></div>
          </div>
        )}
        {!miss && !right && <NibSays mood="think">Where does its weight sit? What touches the line or the edge: something flat, round, pointed, or nearly no ink at all? And is it data people compare?</NibSays>}
      </div>
    </div>
  );
}
