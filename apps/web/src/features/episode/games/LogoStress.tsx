'use client';
// Mini-game for br.2-1: each card is a mark from Ishita's wall (its `visual`, a key of `SUKOON_MARKS`), drawn from its
// numbers. Five lenses re-draw it: as designed, at 16 px (a browser tab, plus a loupe blurred by half an icon pixel),
// in one flat colour, reversed out of ink, and beside the category's app icons. Then call the first test it fails, or
// `ready`; the answer is `markVerdict`. First call scores; a miss explains and the mark comes back later. The end shows
// the marks that survived, locked up with the name.
import { useState } from 'react';
import { motion } from 'motion/react';
import { ICON_PX, SUKOON_MARKS, markPx, markVerdict, type Episode, type SukoonMark } from '@shape/content';
import { springs } from '@shape/ui';
import { Button } from '@/components/base/buttons/button';
import { cx } from '@/utils/cx';
import { Burst, NibSays, StageTitle } from '../kit';
import { ICON_BLUR, MarkArt, SUKOON } from '../scenes/LogoProcess';
import type { GameResult } from './DiamondSort';
import { play } from '@/lib/sound';

type Game = Episode['game'];
const LENSES = [
  { id: 'full', label: 'As drawn' },
  { id: 'small', label: '16 px' },
  { id: 'mono', label: 'One colour' },
  { id: 'reversed', label: 'Reversed' },
  { id: 'rivals', label: 'Beside rivals' },
] as const;
type Lens = (typeof LENSES)[number]['id'];

function Svg({ size, children, label }: { size: number; children: React.ReactNode; label?: string }) {
  return <svg viewBox="0 0 96 96" width={size} height={size} role={label ? 'img' : undefined} aria-label={label} aria-hidden={label ? undefined : true}>{children}</svg>;
}

function LensView({ k, lens }: { k: SukoonMark; lens: Lens }) {
  const m = SUKOON_MARKS[k];
  if (lens === 'small') {
    return (
      <div className="flex flex-col items-center gap-3">
        <div className="flex items-center gap-2 rounded-t-lg border border-b-0 border-secondary bg-primary px-3 py-2">
          <Svg size={ICON_PX}><MarkArt k={k} /></Svg>
          <span className="text-xs font-semibold text-secondary">Sukoon · Breathe</span>
        </div>
        <div className="rounded-2xl bg-primary p-2 ring-1 ring-secondary"><Svg size={128} label={`${m.text}, magnified from ${ICON_PX} px`}><MarkArt k={k} blur={ICON_BLUR} /></Svg></div>
        <span className="text-sm font-semibold text-tertiary tabular-nums">Thinnest line or gap: {m.thin} of 96 units = {markPx(m.thin).toFixed(2)} px</span>
      </div>
    );
  }
  if (lens === 'rivals') {
    return (
      <div className="grid grid-cols-4 gap-2">
        {(['lotus', 'enso', 'head', k] as const).map((r, i) => (
          <div key={i} className={cx('flex aspect-square items-center justify-center rounded-2xl p-2', i === 3 ? 'bg-[#F3E9DC] ring-2 ring-[#2F5D50]' : 'bg-primary ring-1 ring-secondary')}>
            <Svg size={64} label={i === 3 ? `Sukoon: ${m.text}` : 'A rival app icon'}><MarkArt k={r} mono={i === 3 ? undefined : '#667085'} /></Svg>
          </div>
        ))}
      </div>
    );
  }
  const bg = lens === 'reversed' ? SUKOON.ink : lens === 'mono' ? '#FFFFFF' : SUKOON.sand;
  const mono = lens === 'reversed' ? '#FFFFFF' : lens === 'mono' ? SUKOON.ink : undefined;
  return <div className="rounded-2xl p-4" style={{ background: bg }}><Svg size={160} label={m.text}><MarkArt k={k} mono={mono} /></Svg></div>;
}

export function LogoStress({ game, onDone }: { game: Game; onDone: (results: GameResult[]) => void }) {
  const [deck, setDeck] = useState(game.cards);
  const [results, setResults] = useState<Record<string, boolean>>({});
  const [lens, setLens] = useState<Lens>('full');
  const [seen, setSeen] = useState<Lens[]>(['full']);
  const [miss, setMiss] = useState<string | null>(null);
  const [right, setRight] = useState(false);
  const card = deck[0];

  if (!card) {
    const n = Object.values(results).filter(Boolean).length;
    const ready = game.cards.filter(c => c.lane === 'ready');
    return (
      <div className="relative flex flex-col items-center gap-5 py-6 text-center">
        <Burst count={36} />
        <StageTitle eyebrow="The wall, tested" title={`${n} of ${game.cards.length} called first time`}>
          {`${ready.length} marks survived 16 px, one colour and the rivals. Only those get refined.`}
        </StageTitle>
        <div className="flex flex-wrap justify-center gap-4">
          {ready.map(c => (
            <div key={c.id} className="flex items-center gap-2 rounded-2xl px-4 py-3" style={{ background: SUKOON.sand }}>
              <Svg size={56}><MarkArt k={c.visual as SukoonMark} /></Svg>
              <span className="font-serif text-2xl font-bold" style={{ color: SUKOON.ink }}>Sukoon</span>
            </div>
          ))}
        </div>
        <NibSays mood={n === game.cards.length ? 'cheer' : 'idle'}>Print your shortlist the size of a fingernail and look at it from across the room. Whatever you can still recognise will survive a browser tab.</NibSays>
        <Button size="xl" onPress={() => onDone(game.cards.map(c => ({ id: c.id, correct: !!results[c.id] })))}>Continue the story</Button>
      </div>
    );
  }

  const k = card.visual as SukoonMark;
  const verdict = markVerdict(SUKOON_MARKS[k]);
  const owner = game.lanes.find(l => l.id === verdict)!;
  const done = game.cards.length - deck.length;
  const look = (l: Lens) => { setLens(l); setSeen(s => (s.includes(l) ? s : [...s, l])); };
  const call = (laneId: string) => {
    if (miss || right) return;
    const ok = laneId === verdict;
    play(ok ? 'correct' : 'wrong');
    setResults(r => (card.id in r ? r : { ...r, [card.id]: ok }));
    if (ok) setRight(true);
    else { setMiss(laneId); setTimeout(() => { setMiss(null); setLens('full'); setSeen(['full']); setDeck(d => [...d.slice(1), d[0]]); }, 3200); }
  };
  const next = () => { setRight(false); setLens('full'); setSeen(['full']); setDeck(d => d.slice(1)); };

  return (
    <div className="flex flex-col gap-5">
      <StageTitle eyebrow="Play" title={game.title}>{game.instructions}</StageTitle>
      <div className="flex items-baseline justify-between">
        <span className="text-sm font-semibold text-tertiary">{card.label}</span>
        <span className="text-sm font-semibold text-tertiary tabular-nums">{done} / {game.cards.length}</span>
      </div>
      <motion.div key={`${card.id}-${deck.length}`} initial={{ y: -14, opacity: 0 }} animate={miss ? { x: [0, -10, 10, -6, 6, 0], opacity: 1 } : { y: 0, opacity: 1 }} transition={miss ? { duration: 0.4 } : springs.pop}
        className={cx('flex flex-col items-center gap-4 rounded-2xl bg-secondary p-4 ring-2 ring-inset', miss ? 'ring-error' : right ? 'ring-mint-600' : 'ring-secondary')} data-current-card>
        <div className="flex flex-wrap justify-center gap-1.5" role="group" aria-label="Lenses">
          {LENSES.map(l => (
            <button key={l.id} type="button" onClick={() => look(l.id)} aria-pressed={lens === l.id}
              className={cx('rounded-full px-3 py-1.5 text-sm font-semibold transition', lens === l.id ? 'bg-brand-solid text-white' : 'bg-primary text-secondary ring-1 ring-secondary hover:bg-primary_hover')}>
              {l.label}{seen.includes(l.id) && lens !== l.id ? ' ✓' : ''}
            </button>
          ))}
        </div>
        <motion.div key={lens} initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={springs.pop} className="flex min-h-52 items-center justify-center">
          <LensView k={k} lens={lens} />
        </motion.div>
      </motion.div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4" role="group" aria-label="Verdict">
        {game.lanes.map(l => (
          <motion.button key={l.id} type="button" onClick={() => call(l.id)} disabled={!!miss || right} whileTap={{ scale: 0.97 }}
            className={cx('flex flex-col items-start gap-0.5 rounded-xl border-2 bg-primary px-3 py-2.5 text-left transition enabled:hover:bg-primary_hover disabled:cursor-default',
              right && l.id === verdict ? 'border-mint-600' : miss === l.id ? 'border-error' : miss && l.id === verdict ? 'border-mint-600' : 'border-secondary')}>
            <span className="text-md font-bold text-primary">{l.label}</span>
            <span className="text-xs font-medium text-tertiary">{l.hint}</span>
          </motion.button>
        ))}
      </div>
      <div className="min-h-14" aria-live="polite">
        {miss && <NibSays mood="sad">Not quite: it’s <strong>{owner.label.toLowerCase()}</strong>. {card.note} It’ll come back round.</NibSays>}
        {right && (
          <div className="flex flex-col gap-3">
            <NibSays mood="cheer">{card.note}</NibSays>
            <div className="flex justify-end"><Button size="lg" onPress={next}>{deck.length > 1 ? 'Next mark' : 'See the survivors'}</Button></div>
          </div>
        )}
        {!miss && !right && seen.length < 3 && <NibSays mood="think">Try a few lenses before you call it. Each one is a place this logo will have to live.</NibSays>}
      </div>
    </div>
  );
}
