'use client';
// Mini-game for dc.4-1: give every piece of data one home. Every card is something Chakki's product card shows or uses
// (its `visual`, a key of `CHAKKI_DATA`). Call it a prop, the card's own state, state lifted to the page, or a value
// derived while rendering (`DATA_HOMES`, scored by `dataHome`). Right calls write the line into the component as
// `componentCode` builds it: the props interface, the card's body, and the page that owns lifted state. First call
// scores; a missed card comes back later.
import { useState } from 'react';
import { motion } from 'motion/react';
import { CHAKKI_DATA, componentCode, dataHome, type ChakkiDatum, type DataHome as Home, type Episode } from '@shape/content';
import { springs } from '@shape/ui';
import { Button } from '@/components/base/buttons/button';
import { cx } from '@/utils/cx';
import { Burst, NibSays, StageTitle } from '../kit';
import { HOME_FILL } from '../scenes/StateLift';
import type { GameResult } from './DiamondSort';
import { play } from '@/lib/sound';

type Game = Episode['game'];

const WHY: Record<Home, string> = {
  prop: 'The page or the API decides it, and the card only reads it, so it comes in as a prop.',
  state: 'It changes as someone uses this one card, and nothing else needs it, so the card owns it.',
  lift: 'It changes here, but another part of the page reads it too, so it lives in the page and comes down with a callback.',
  derive: 'It follows from data the card already has, so it is worked out while rendering and never stored.',
};

/** One code line, wrapping on a phone instead of scrolling sideways. */
function Line({ text, fill, indent = 1 }: { text: string; fill: string; indent?: number }) {
  return (
    <motion.span initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={springs.pop}
      className="block break-words py-0.5" style={{ paddingLeft: `${indent * 0.75}rem`, boxShadow: `inset 3px 0 0 ${fill}` }}>
      {text}
    </motion.span>
  );
}

function Code({ placed }: { placed: ChakkiDatum[] }) {
  const code = componentCode(placed);
  const of = (h: Home) => placed.filter(k => dataHome(CHAKKI_DATA[k]) === h);
  const empty = <span className="block py-0.5 pl-3 text-gray-400">{'// …'}</span>;
  return (
    <div className="flex flex-col gap-3 rounded-2xl bg-gray-900 p-3 font-mono text-sm leading-snug text-gray-100 sm:p-4" aria-label="The component so far">
      <div>
        <span className="block text-gray-400">{'// ProductCard.tsx'}</span>
        <span className="block">{'interface Props {'}</span>
        {code.props.length ? (['prop', 'lift'] as const).flatMap(h => of(h).map(k => <Line key={k} text={CHAKKI_DATA[k].line} fill={HOME_FILL[h]} />)) : empty}
        <span className="block">{'}'}</span>
        <span className="block">{'function ProductCard({ … }: Props) {'}</span>
        {(['state', 'derive'] as const).flatMap(h => of(h).map(k => <Line key={k} text={CHAKKI_DATA[k].line} fill={HOME_FILL[h]} />))}
        {!code.state.length && !code.derived.length && empty}
        <span className="block pl-3">{'return <article>…</article>;'}</span>
        <span className="block">{'}'}</span>
      </div>
      <div>
        <span className="block text-gray-400">{'// CategoryPage.tsx: owns what the cart bar shares'}</span>
        {code.parent.length ? code.parent.map(l => <Line key={l} text={l} fill={HOME_FILL.lift} />) : empty}
      </div>
    </div>
  );
}

export function DataHome({ game, onDone }: { game: Game; onDone: (results: GameResult[]) => void }) {
  const [deck, setDeck] = useState(game.cards);
  const [results, setResults] = useState<Record<string, boolean>>({});
  const [placed, setPlaced] = useState<ChakkiDatum[]>([]);
  const [miss, setMiss] = useState<{ lane: string; why: string } | null>(null);
  const [right, setRight] = useState(false);
  const card = deck[0];

  if (!card) {
    const n = Object.values(results).filter(Boolean).length;
    const code = componentCode(placed);
    return (
      <div className="relative flex flex-col gap-5 py-6">
        <Burst count={36} />
        <StageTitle eyebrow="Component built" title={`${n} of ${game.cards.length} right first time`}>
          {code.props.length} props in, {code.state.length} pieces of the card’s own state, {code.derived.length} values derived, and {code.parent.length} lifted to the page. Nothing is stored twice.
        </StageTitle>
        <Code placed={placed} />
        <NibSays mood={n === game.cards.length ? 'cheer' : 'idle'}>Data flows down, events flow up, and every fact has exactly one home.</NibSays>
        <Button size="xl" onPress={() => onDone(game.cards.map(c => ({ id: c.id, correct: !!results[c.id] })))}>Continue the story</Button>
      </div>
    );
  }

  const k = card.visual as ChakkiDatum;
  const d = CHAKKI_DATA[k];
  const lane = dataHome(d);
  const done = game.cards.length - deck.length;
  const call = (laneId: string) => {
    if (miss || right) return;
    const ok = laneId === lane;
    play(ok ? 'correct' : 'wrong');
    setResults(rs => (card.id in rs ? rs : { ...rs, [card.id]: ok }));
    if (ok) { setRight(true); setPlaced(ps => [...ps, k]); }
    else {
      setMiss({ lane: laneId, why: WHY[lane] });
      setTimeout(() => { setMiss(null); setDeck(dk => [...dk.slice(1), dk[0]]); }, 4200);
    }
  };
  const next = () => { setRight(false); setDeck(dk => dk.slice(1)); };

  return (
    <div className="flex flex-col gap-5">
      <StageTitle eyebrow="Play" title={game.title}>{game.instructions}</StageTitle>
      <div className="flex items-baseline justify-between">
        <span className="text-sm font-semibold text-tertiary">ProductCard · Sharbati atta, 5 kg</span>
        <span className="text-sm font-semibold text-tertiary tabular-nums">{done} / {game.cards.length}</span>
      </div>
      <motion.div key={`${card.id}-${deck.length}`} initial={{ y: 24, opacity: 0 }}
        animate={miss ? { x: [0, -10, 10, -6, 6, 0], y: 0, opacity: 1 } : { y: 0, opacity: 1 }}
        transition={miss ? { duration: 0.4 } : springs.pop}
        className={cx('flex flex-col gap-3 rounded-2xl bg-primary p-4 shadow-lg ring-2 ring-inset sm:p-5', miss ? 'ring-error' : right ? 'ring-mint-600' : 'ring-secondary')} data-current-card>
        <span className="self-start rounded-md bg-secondary px-2 py-0.5 font-mono text-sm font-semibold text-secondary">{d.short}</span>
        <p className="text-lg font-semibold text-primary">{card.label}</p>
        {right && (
          <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={springs.pop}
            className="break-words rounded-lg bg-secondary px-3 py-2 font-mono text-sm font-semibold text-primary" style={{ boxShadow: `inset 3px 0 0 ${HOME_FILL[lane]}` }}>
            {d.line}
          </motion.p>
        )}
      </motion.div>
      <div className="grid grid-cols-2 gap-2" role="group" aria-label="Where this data lives">
        {game.lanes.map(l => (
          <motion.button key={l.id} type="button" onClick={() => call(l.id)} disabled={!!miss || right} whileTap={{ scale: 0.97 }}
            className={cx('flex flex-col items-start gap-0.5 rounded-xl border-2 bg-primary px-3 py-2.5 text-left transition enabled:hover:bg-primary_hover disabled:cursor-default',
              right && l.id === lane ? 'border-mint-600' : miss?.lane === l.id ? 'border-error' : miss && l.id === lane ? 'border-mint-600' : 'border-secondary')}>
            <span className="flex items-center gap-1.5 text-md font-bold text-primary"><span className="size-2.5 shrink-0 rounded-full" style={{ background: HOME_FILL[l.id as Home] }} aria-hidden />{l.label}</span>
            <span className="text-xs font-medium text-tertiary">{l.hint}</span>
          </motion.button>
        ))}
      </div>
      <div className="min-h-14" aria-live="polite">
        {miss && <NibSays mood="sad">{miss.why} {card.note} It’ll come back round.</NibSays>}
        {right && (
          <div className="flex flex-col gap-3">
            <NibSays mood="cheer">{card.note}</NibSays>
            <div className="flex justify-end"><Button size="lg" onPress={next}>{deck.length > 1 ? 'Next piece' : 'See the component'}</Button></div>
          </div>
        )}
        {!miss && !right && <NibSays mood="think">Can you work it out from what the card has? Does the parent decide it? Does anything else on the page need it?</NibSays>}
      </div>
      <Code placed={placed} />
    </div>
  );
}
