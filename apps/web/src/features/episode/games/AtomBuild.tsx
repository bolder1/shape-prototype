'use client';
// Mini-game for rs.6-2: build Musafir's research repository from old decks. Every card is a draft note (its `visual`,
// a key of `MUSAFIR_ATOMS`), shown with its source study (`MUSAFIR_STUDIES`) and the notes it says it rests on. File it
// as a fact, an insight or a recommendation, or send it back to fix (`ATOM_LANES`, scored by `atomLane`). Right calls
// add the note to the graph beside, linked to whatever it rests on that's already in, and the end traces each
// recommendation down to its studies (`studiesBehind`). A miss explains and the card comes back later; first call scores.
import { useState } from 'react';
import { motion } from 'motion/react';
import { MUSAFIR_ATOMS, MUSAFIR_STUDIES, atomLane, studiesBehind, type AtomLane, type Episode, type MusafirAtom } from '@shape/content';
import { springs } from '@shape/ui';
import { Button } from '@/components/base/buttons/button';
import { cx } from '@/utils/cx';
import { Burst, NibSays, StageTitle } from '../kit';
import { ATOM_TONE } from '../scenes/AtomRepo';
import type { GameResult } from './DiamondSort';
import { play } from '@/lib/sound';

type Game = Episode['game'];
/** Short names for the graph's nodes. */
const SHORT: Record<MusafirAtom, string> = {
  whenMoney: 'Didn’t know when money arrives', where48: '“Where is my refund?” in 48 h', landmarkSent: 'Sent a landmark or photo', landmarkTicket: 'Complaints name a landmark',
  hate: 'Users hate the policy', uncertain: 'They call because they can’t see when', landmarks: 'Found by landmark, not address', callDriver: 'Trust a call over a map',
  refundDate: 'Show the refund date', landmarkLine: 'Landmark and photo on ticket', chatbot: 'Refund chatbot', majestic: 'P4 at Majestic, so add photos',
};
const COLS: { lane: Exclude<AtomLane, 'fix'>; title: string; x: number }[] = [
  { lane: 'fact', title: 'Facts', x: 0 }, { lane: 'insight', title: 'Insights', x: 1 }, { lane: 'rec', title: 'Recommendations', x: 2 },
];
const GW = 300, COLW = 96, ROW = 46;

/** The repository so far: three columns of linked notes, and the pile sent back. */
function Graph({ built, hot }: { built: MusafirAtom[]; hot?: MusafirAtom }) {
  const pos = (k: MusafirAtom) => {
    const lane = atomLane(k);
    const col = COLS.find(c => c.lane === lane)!;
    const row = built.filter(b => atomLane(b) === lane).indexOf(k);
    return { x: col.x * (COLW + 6), y: 26 + row * ROW };
  };
  const inGraph = built.filter(k => atomLane(k) !== 'fix');
  const back = built.filter(k => atomLane(k) === 'fix');
  const rows = Math.max(1, ...COLS.map(c => built.filter(b => atomLane(b) === c.lane).length));
  return (
    <div className="flex flex-col gap-3 self-start rounded-2xl bg-secondary p-3" aria-label="Musafir’s repository">
      <p className="px-1 text-xs font-bold tracking-wide text-tertiary uppercase">Repository</p>
      <svg viewBox={`0 0 ${GW} ${30 + rows * ROW}`} className="w-full" role="img" aria-label={`${inGraph.length} notes in the repository`}>
        {COLS.map(c => <text key={c.lane} x={c.x * (COLW + 6) + 2} y={14} fontSize={10.5} fontWeight={800} fill="var(--color-text-tertiary)">{c.title.toUpperCase()}</text>)}
        {inGraph.flatMap(k => MUSAFIR_ATOMS[k].links.filter(l => inGraph.includes(l as MusafirAtom)).map(l => {
          const a = pos(l as MusafirAtom), b = pos(k);
          return <motion.path key={`${l}-${k}`} initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.6 }}
            d={`M${a.x + COLW} ${a.y + 18} C${a.x + COLW + 10} ${a.y + 18} ${b.x - 10} ${b.y + 18} ${b.x} ${b.y + 18}`} fill="none" stroke="var(--color-text-tertiary)" strokeWidth={1.5} />;
        }))}
        {inGraph.map(k => {
          const { x, y } = pos(k);
          return (
            <motion.g key={k} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={springs.pop} style={{ transformOrigin: `${x + COLW / 2}px ${y + 18}px` }}>
              <rect x={x} y={y} width={COLW} height={36} rx={7} fill="var(--color-bg-primary)" stroke={ATOM_TONE[atomLane(k)]} strokeWidth={hot === k ? 3 : 2} />
              <foreignObject x={x + 4} y={y + 2} width={COLW - 8} height={32}>
                <p style={{ margin: 0, font: '700 9.5px/1.2 Inter, system-ui, sans-serif', color: 'var(--color-text-primary)' }}>{SHORT[k]}</p>
              </foreignObject>
            </motion.g>
          );
        })}
      </svg>
      <div className="flex flex-col gap-1 px-1">
        <span className="flex items-center gap-1.5 text-xs font-bold text-secondary"><span className="size-2 rounded-full" style={{ background: ATOM_TONE.fix }} aria-hidden />Sent back to fix</span>
        {back.length === 0 && <span className="text-xs text-quaternary">Nothing yet</span>}
        {back.map(k => <span key={k} className={cx('rounded-lg bg-primary px-2.5 py-1 text-xs font-semibold text-secondary ring-1 ring-inset', hot === k ? 'ring-mint-600' : 'ring-secondary')}>{SHORT[k]}</span>)}
      </div>
    </div>
  );
}

export function AtomBuild({ game, onDone }: { game: Game; onDone: (results: GameResult[]) => void }) {
  const [deck, setDeck] = useState(game.cards);
  const [results, setResults] = useState<Record<string, boolean>>({});
  const [built, setBuilt] = useState<MusafirAtom[]>([]);
  const [miss, setMiss] = useState<string | null>(null);
  const [right, setRight] = useState(false);
  const card = deck[0];

  if (!card) {
    const n = Object.values(results).filter(Boolean).length;
    const recs = built.filter(k => atomLane(k) === 'rec');
    return (
      <div className="relative flex flex-col gap-5 py-6">
        <Burst count={36} />
        <StageTitle eyebrow="Repository built" title={`${n} of ${game.cards.length} filed first time`}>
          Every recommendation now traces down to the people it came from.
        </StageTitle>
        <ul className="flex flex-col gap-2">
          {recs.map(k => (
            <li key={k} className="rounded-xl bg-primary p-3 ring-1 ring-secondary ring-inset">
              <p className="text-md font-semibold text-primary">{MUSAFIR_ATOMS[k].text}</p>
              <p className="text-sm text-tertiary">Rests on: {studiesBehind(k).map(s => MUSAFIR_STUDIES[s]).join('; ')}</p>
            </li>
          ))}
        </ul>
        <Graph built={built} />
        <NibSays mood={n === game.cards.length ? 'cheer' : 'idle'}>One kind of thing per note. A fact needs its source, an insight needs facts from two studies, and a recommendation needs an insight that holds. Anything else goes back to be fixed.</NibSays>
        <Button size="xl" onPress={() => onDone(game.cards.map(c => ({ id: c.id, correct: !!results[c.id] })))}>Continue the story</Button>
      </div>
    );
  }

  const k = card.visual as MusafirAtom;
  const a = MUSAFIR_ATOMS[k];
  const lane = atomLane(k);
  const owner = game.lanes.find(l => l.id === lane)!;
  const done = game.cards.length - deck.length;
  const call = (laneId: string) => {
    if (miss || right) return;
    const ok = laneId === lane;
    play(ok ? 'correct' : 'wrong');
    setResults(rs => (card.id in rs ? rs : { ...rs, [card.id]: ok }));
    if (ok) { setRight(true); setBuilt(bs => [...bs, k]); }
    else { setMiss(laneId); setTimeout(() => { setMiss(null); setDeck(dk => [...dk.slice(1), dk[0]]); }, 3200); }
  };
  const next = () => { setRight(false); setDeck(dk => dk.slice(1)); };

  return (
    <div className="flex flex-col gap-5">
      <StageTitle eyebrow="Play" title={game.title}>{game.instructions}</StageTitle>
      <div className="grid gap-5 md:grid-cols-[1fr_minmax(0,20rem)]">
        <div className="flex flex-col gap-4">
          <div className="flex items-baseline justify-between">
            <span className="text-sm font-semibold text-tertiary">From the old decks</span>
            <span className="text-sm font-semibold text-tertiary tabular-nums">{done} / {game.cards.length}</span>
          </div>
          <motion.div key={`${card.id}-${deck.length}`} initial={{ y: 24, opacity: 0, rotate: -1 }} animate={miss ? { x: [0, -10, 10, -6, 6, 0], y: 0, opacity: 1, rotate: 0 } : { y: 0, opacity: 1, rotate: 0 }} transition={miss ? { duration: 0.4 } : springs.pop}
            className={cx('flex flex-col gap-3 rounded-2xl bg-primary p-5 shadow-lg ring-2 ring-inset', miss ? 'ring-error' : right ? 'ring-mint-600' : 'ring-secondary')} data-current-card>
            <p className="text-lg font-semibold text-primary">{card.label}</p>
            <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-sm">
              <dt className="font-semibold text-tertiary">Source</dt>
              <dd className={a.source ? 'text-primary' : 'text-error-primary'}>{a.source ? MUSAFIR_STUDIES[a.source] : 'None given'}</dd>
              <dt className="font-semibold text-tertiary">Rests on</dt>
              <dd className="text-primary">{a.links.length ? a.links.map(l => SHORT[l as MusafirAtom]).join(' · ') : 'Nothing linked'}</dd>
              {a.links.length > 0 && <><dt className="font-semibold text-tertiary">Studies</dt><dd className="text-primary">{studiesBehind(k).map(s => MUSAFIR_STUDIES[s].split(' · ')[0]).join(', ')}</dd></>}
            </dl>
          </motion.div>
          <div className="grid grid-cols-2 gap-2" role="group" aria-label="Where it goes">
            {game.lanes.map(l => (
              <motion.button key={l.id} type="button" onClick={() => call(l.id)} disabled={!!miss || right} whileTap={{ scale: 0.97 }}
                className={cx('flex flex-col items-start gap-0.5 rounded-xl border-2 bg-primary px-3 py-2.5 text-left transition enabled:hover:bg-primary_hover disabled:cursor-default',
                  right && l.id === lane ? 'border-mint-600' : miss === l.id ? 'border-error' : miss && l.id === lane ? 'border-mint-600' : 'border-secondary')}>
                <span className="flex items-center gap-1.5 text-md font-bold text-primary"><span className="size-2.5 rounded-full" style={{ background: ATOM_TONE[l.id as AtomLane] }} aria-hidden />{l.label}</span>
                <span className="text-xs font-medium text-tertiary">{l.hint}</span>
              </motion.button>
            ))}
          </div>
          <div className="min-h-14" aria-live="polite">
            {miss && <NibSays mood="sad">Not quite: <strong>{owner.label.toLowerCase()}</strong>. {card.note} It’ll come back round.</NibSays>}
            {right && (
              <div className="flex flex-col gap-3">
                <NibSays mood="cheer">{card.note}</NibSays>
                <div className="flex justify-end"><Button size="lg" onPress={next}>{deck.length > 1 ? 'Next note' : 'See the repository'}</Button></div>
              </div>
            )}
            {!miss && !right && <NibSays mood="think">Is it something seen, what it means, or what to do? Does it say only one of those? And what holds it up?</NibSays>}
          </div>
        </div>
        <Graph built={built} hot={right ? k : undefined} />
      </div>
    </div>
  );
}
