'use client';
// Mini-game for br.4-2: draw Sukoon's brand family tree. Every card is an offering (its `visual`, a key of
// `SUKOON_OFFERS`). Call it just Sukoon, a sub-brand, endorsed or its own brand (`ARCH_CALLS`, scored by `archCall`):
// the promise first, then the risk to it, then equity, then who buys. Each card shows the four questions; right calls
// answer them on the card and add the offering to the tree under the name `archName` gives it. First call scores; a
// missed card comes back later.
import { useState } from 'react';
import { motion } from 'motion/react';
import { SUKOON_OFFERS, archCall, archName, type ArchCall, type Episode, type Offering, type SukoonOffer } from '@shape/content';
import { springs } from '@shape/ui';
import { Button } from '@/components/base/buttons/button';
import { cx } from '@/utils/cx';
import { Burst, NibSays, StageTitle } from '../kit';
import { ARCH_FILL, ARCH_LABEL } from '../scenes/BrandSpectrum';
import type { GameResult } from './DiamondSort';
import { play } from '@/lib/sound';

type Game = Episode['game'];

/** The four questions, in order, and the answer that settles each one. */
const QUESTIONS: { q: string; yes: (o: Offering) => boolean }[] = [
  { q: 'Keeps the promise?', yes: o => o.fits },
  { q: 'Could break it?', yes: o => o.risk },
  { q: 'Has its own equity?', yes: o => o.equity },
  { q: 'A different buyer?', yes: o => o.newBuyer },
];
/** How many questions it takes to settle an offering: one if it breaks the promise, else the first yes, else all four. */
const asked = (o: Offering) => (!o.fits ? 1 : QUESTIONS.findIndex((x, i) => i > 0 && x.yes(o)) + 1 || QUESTIONS.length);

/** Why a wrong call is wrong, from the offering itself. */
function whyNot(k: SukoonOffer) {
  const o = SUKOON_OFFERS[k];
  switch (archCall(o)) {
    case 'own': return o.fits ? 'It keeps the promise, but a failure or a bad headline here would damage it. Keep it apart.' : 'It doesn’t keep the promise, calm in five minutes for busy professionals. Give it its own brand.';
    case 'endorsed': return 'It keeps the promise and has a name people already trust. Renaming it throws that away; endorse it.';
    case 'sub': return 'Same promise, but someone other than the subscriber chooses or pays. They need a name of their own, close to Sukoon.';
    case 'master': return 'Same promise, same subscriber, no name of its own to protect. A plain description is enough.';
  }
}

export function FamilySort({ game, onDone }: { game: Game; onDone: (results: GameResult[]) => void }) {
  const [deck, setDeck] = useState(game.cards);
  const [results, setResults] = useState<Record<string, boolean>>({});
  const [placed, setPlaced] = useState<SukoonOffer[]>([]);
  const [miss, setMiss] = useState<{ lane: string; why: string } | null>(null);
  const [right, setRight] = useState(false);
  const card = deck[0];

  const branch = (c: ArchCall) => {
    const here = placed.filter(k => archCall(SUKOON_OFFERS[k]) === c);
    return (
      <div key={c} className={cx('flex flex-col gap-1 rounded-lg bg-primary p-2', c === 'own' && 'border-2 border-dashed border-secondary')}>
        <span className="text-xs font-bold" style={{ color: ARCH_FILL[c] }}>{c === 'own' ? 'Kept apart' : ARCH_LABEL[c]}</span>
        <div className="flex min-h-7 flex-wrap gap-1">
          {here.map(k => (
            <motion.span key={k} initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={springs.pop}
              className="rounded-full px-2 py-0.5 text-xs font-bold text-white" style={{ background: ARCH_FILL[c] }}>{archName(SUKOON_OFFERS[k])}</motion.span>
          ))}
        </div>
      </div>
    );
  };

  const tree = (
    <div className="flex flex-col gap-2 rounded-2xl bg-secondary p-3">
      <span className="text-sm font-bold text-primary">The brand family</span>
      <div className="self-center rounded-lg px-4 py-1.5 text-md font-bold text-white" style={{ background: ARCH_FILL.master }}>Sukoon</div>
      <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-3">
        {(['master', 'sub', 'endorsed'] as const).map(branch)}
      </div>
      {branch('own')}
    </div>
  );

  if (!card) {
    const n = Object.values(results).filter(Boolean).length;
    return (
      <div className="relative flex flex-col gap-5 py-6">
        <Burst count={36} />
        <StageTitle eyebrow="Family drawn" title={`${n} of ${game.cards.length} right first time`}>
          Four things are simply Sukoon, three are sub-brands for other buyers, two keep names Sukoon bought, and three stand apart to protect the promise.
        </StageTitle>
        {tree}
        <NibSays mood={n === game.cards.length ? 'cheer' : 'idle'}>Promise, risk, equity, buyer. Write them down and the next naming request takes minutes.</NibSays>
        <Button size="xl" onPress={() => onDone(game.cards.map(c => ({ id: c.id, correct: !!results[c.id] })))}>Continue the story</Button>
      </div>
    );
  }

  const k = card.visual as SukoonOffer;
  const o = SUKOON_OFFERS[k];
  const lane = archCall(o);
  const done = game.cards.length - deck.length;
  const call = (laneId: string) => {
    if (miss || right) return;
    const ok = laneId === lane;
    play(ok ? 'correct' : 'wrong');
    setResults(rs => (card.id in rs ? rs : { ...rs, [card.id]: ok }));
    if (ok) { setRight(true); setPlaced(ps => [...ps, k]); }
    else {
      setMiss({ lane: laneId, why: whyNot(k) });
      setTimeout(() => { setMiss(null); setDeck(dk => [...dk.slice(1), dk[0]]); }, 4200);
    }
  };
  const next = () => { setRight(false); setDeck(dk => dk.slice(1)); };
  const n = asked(o);

  return (
    <div className="flex flex-col gap-5">
      <StageTitle eyebrow="Play" title={game.title}>{game.instructions}</StageTitle>
      <div className="flex items-baseline justify-between">
        <span className="text-sm font-semibold text-tertiary">Naming review · Sukoon Wellness</span>
        <span className="text-sm font-semibold text-tertiary tabular-nums">{done} / {game.cards.length}</span>
      </div>
      <motion.div key={`${card.id}-${deck.length}`} initial={{ y: 24, opacity: 0 }}
        animate={miss ? { x: [0, -10, 10, -6, 6, 0], y: 0, opacity: 1 } : { y: 0, opacity: 1 }}
        transition={miss ? { duration: 0.4 } : springs.pop}
        className={cx('flex flex-col gap-3 rounded-2xl bg-primary p-4 shadow-lg ring-2 ring-inset sm:p-5', miss ? 'ring-error' : right ? 'ring-mint-600' : 'ring-secondary')} data-current-card>
        <span className="text-xs font-bold tracking-wide text-tertiary uppercase">{o.short}</span>
        <p className="text-lg font-semibold text-primary">{card.label}</p>
        <ol className="grid grid-cols-1 gap-1.5 text-sm sm:grid-cols-2">
          {QUESTIONS.map((x, i) => {
            const shown = right && i < n;
            return (
              <li key={x.q} className={'flex items-center justify-between gap-2 rounded-lg bg-secondary px-2.5 py-1.5'}>
                <span className="font-semibold text-secondary">{i + 1}. {x.q}</span>
                <span className={cx('font-bold', shown ? 'text-primary' : 'text-tertiary')}>{shown ? (x.yes(o) ? 'Yes' : 'No') : right ? '–' : '?'}</span>
              </li>
            );
          })}
        </ol>
        {right && (
          <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={springs.pop}
            className="rounded-lg px-3 py-2 text-sm font-semibold text-primary" style={{ boxShadow: `inset 3px 0 0 ${ARCH_FILL[lane]}` }}>
            Its name: {archName(o)}
          </motion.p>
        )}
      </motion.div>
      <div className="grid grid-cols-2 gap-2" role="group" aria-label="Where this offering sits in the family">
        {game.lanes.map(l => (
          <motion.button key={l.id} type="button" onClick={() => call(l.id)} disabled={!!miss || right} whileTap={{ scale: 0.97 }}
            className={cx('flex flex-col items-start gap-0.5 rounded-xl border-2 bg-primary px-3 py-2.5 text-left transition enabled:hover:bg-primary_hover disabled:cursor-default',
              right && l.id === lane ? 'border-mint-600' : miss?.lane === l.id ? 'border-error' : miss && l.id === lane ? 'border-mint-600' : 'border-secondary')}>
            <span className="flex items-center gap-1.5 text-md font-bold text-primary"><span className="size-2.5 shrink-0 rounded-full" style={{ background: ARCH_FILL[l.id as ArchCall] }} aria-hidden />{l.label}</span>
            <span className="text-xs font-medium text-tertiary">{l.hint}</span>
          </motion.button>
        ))}
      </div>
      <div className="min-h-14" aria-live="polite">
        {miss && <NibSays mood="sad">{miss.why} {card.note} It’ll come back round.</NibSays>}
        {right && (
          <div className="flex flex-col gap-3">
            <NibSays mood="cheer">{card.note}</NibSays>
            <div className="flex justify-end"><Button size="lg" onPress={next}>{deck.length > 1 ? 'Next offering' : 'See the family'}</Button></div>
          </div>
        )}
        {!miss && !right && <NibSays mood="think">Ask in order. The first answer that settles it decides: breaks or risks the promise, then equity, then buyer.</NibSays>}
      </div>
      {tree}
    </div>
  );
}
