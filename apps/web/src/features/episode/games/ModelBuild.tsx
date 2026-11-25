'use client';
// Mini-game for cw.3-1: build Taar's help-centre content model from the old “Reset your router” page. Every card is a
// piece of that page (its `visual`, a key of `TAAR_CHUNKS`). Make it a field of the article, its own type, a tag, or
// cut it as presentation (`MODEL_PLACES`, scored by `modelPlace`). Right calls add it to the model beside the deck, as
// what it becomes (`as`); shared types show the edits a change now costs (`editsFor`), and the model keeps a running
// count of edits saved. First call scores; a missed card comes back later.
import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { MODEL_PLACES, TAAR_CHUNKS, editsFor, modelPlace, type Episode, type ModelPlace, type TaarChunk } from '@shape/content';
import { springs } from '@shape/ui';
import { Button } from '@/components/base/buttons/button';
import { cx } from '@/utils/cx';
import { Burst, NibSays, StageTitle } from '../kit';
import { PLACE_FILL } from '../scenes/ContentModel';
import type { GameResult } from './DiamondSort';
import { play } from '@/lib/sound';

type Game = Episode['game'];
const SECTION: Record<ModelPlace, string> = { field: 'Help article · fields', type: 'Content types, referenced', tag: 'Tags', cut: 'Left to each channel' };
const LANE_NAME: Record<ModelPlace, string> = { field: 'a field', type: 'its own type', tag: 'a tag', cut: 'cut' };

export function ModelBuild({ game, onDone }: { game: Game; onDone: (results: GameResult[]) => void }) {
  const [deck, setDeck] = useState(game.cards);
  const [results, setResults] = useState<Record<string, boolean>>({});
  const [placed, setPlaced] = useState<TaarChunk[]>([]);
  const [miss, setMiss] = useState<ModelPlace | null>(null);
  const [right, setRight] = useState(false);
  const card = deck[0];
  const placeOf = (k: TaarChunk) => modelPlace(TAAR_CHUNKS[k]);
  const saved = placed.reduce((s, k) => s + editsFor(TAAR_CHUNKS[k], false) - editsFor(TAAR_CHUNKS[k], true), 0);

  const model = (
    <div className="flex flex-col gap-3 rounded-2xl bg-secondary p-3">
      <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
        <span className="text-sm font-bold text-primary">Taar help centre · content model</span>
        <span className="text-sm font-semibold text-tertiary tabular-nums">Edits saved per change: {saved.toLocaleString('en-IN')}</span>
      </div>
      {MODEL_PLACES.map(m => {
        const rows = placed.filter(k => placeOf(k) === m);
        return (
          <div key={m} className="flex flex-col gap-1.5">
            <span className="w-fit rounded-full px-2.5 py-0.5 text-xs font-bold text-white" style={{ background: PLACE_FILL[m] }}>{SECTION[m]} · {rows.length}</span>
            <ul className="flex flex-col gap-1">
              <AnimatePresence initial={false}>
                {rows.map(k => (
                  <motion.li key={k} layout initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} transition={springs.pop}
                    className={cx('rounded-lg bg-primary px-2.5 py-1.5 text-sm text-secondary', m === 'cut' && 'line-through decoration-2')}
                    style={{ boxShadow: `inset 3px 0 0 ${PLACE_FILL[m]}` }}>
                    {TAAR_CHUNKS[k].as}
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>
          </div>
        );
      })}
    </div>
  );

  if (!card) {
    const n = Object.values(results).filter(Boolean).length;
    return (
      <div className="relative flex flex-col gap-5 py-6">
        <Burst count={36} />
        <StageTitle eyebrow="Model built" title={`${n} of ${game.cards.length} right first time`}>
          One article with fields that have rules, four shared types it references, three tags from controlled lists, and no styling. A price change is now one edit.
        </StageTitle>
        {model}
        <NibSays mood={n === game.cards.length ? 'cheer' : 'idle'}>Next, rebuild twenty awkward articles in it and read each one on the website, the app, the IVR and Assist.</NibSays>
        <Button size="xl" onPress={() => onDone(game.cards.map(c => ({ id: c.id, correct: !!results[c.id] })))}>Continue the story</Button>
      </div>
    );
  }

  const k = card.visual as TaarChunk;
  const ch = TAAR_CHUNKS[k];
  const lane = placeOf(k);
  const done = game.cards.length - deck.length;
  const call = (laneId: string) => {
    if (miss || right) return;
    const ok = laneId === lane;
    play(ok ? 'correct' : 'wrong');
    setResults(rs => (card.id in rs ? rs : { ...rs, [card.id]: ok }));
    if (ok) { setRight(true); setPlaced(ps => [...ps, k]); }
    else { setMiss(laneId as ModelPlace); setTimeout(() => { setMiss(null); setDeck(dk => [...dk.slice(1), dk[0]]); }, 3600); }
  };
  const next = () => { setRight(false); setDeck(dk => dk.slice(1)); };

  return (
    <div className="flex flex-col gap-5">
      <StageTitle eyebrow="Play" title={game.title}>{game.instructions}</StageTitle>
      <div className="flex items-baseline justify-between">
        <span className="text-sm font-semibold text-tertiary">From “Reset your Taar router”</span>
        <span className="text-sm font-semibold text-tertiary tabular-nums">{done} / {game.cards.length}</span>
      </div>
      <motion.div key={`${card.id}-${deck.length}`} initial={{ y: 24, opacity: 0 }}
        animate={miss ? { x: [0, -10, 10, -6, 6, 0], y: 0, opacity: 1 } : { y: 0, opacity: 1 }}
        transition={miss ? { duration: 0.4 } : springs.pop}
        className={cx('flex flex-col gap-3 rounded-2xl bg-primary p-4 shadow-lg ring-2 ring-inset sm:p-5', miss ? 'ring-error' : right ? 'ring-mint-600' : 'ring-secondary')} data-current-card>
        <span className="text-xs font-bold tracking-wide text-tertiary uppercase">Piece of the old page</span>
        <p className="rounded-lg border-2 border-dashed border-secondary px-3 py-2 text-lg font-semibold text-primary">{card.label}</p>
        {right && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={springs.pop} className="flex flex-col gap-1.5">
            <span className="w-fit rounded-full px-2.5 py-0.5 text-xs font-bold text-white" style={{ background: PLACE_FILL[lane] }}>{SECTION[lane]}</span>
            <p className="text-md font-semibold text-primary">{ch.as}</p>
            {lane === 'type' && ch.pages > 1 && (
              <p className="text-sm font-semibold text-secondary tabular-nums">A change costs {editsFor(ch, true)} edit instead of {editsFor(ch, false).toLocaleString('en-IN')}.</p>
            )}
          </motion.div>
        )}
      </motion.div>
      <div className="grid grid-cols-2 gap-2" role="group" aria-label="Where it goes in the model">
        {game.lanes.map(l => (
          <motion.button key={l.id} type="button" onClick={() => call(l.id)} disabled={!!miss || right} whileTap={{ scale: 0.97 }}
            className={cx('flex flex-col items-start gap-0.5 rounded-xl border-2 bg-primary px-3 py-2.5 text-left transition enabled:hover:bg-primary_hover disabled:cursor-default',
              right && l.id === lane ? 'border-mint-600' : miss === l.id ? 'border-error' : miss && l.id === lane ? 'border-mint-600' : 'border-secondary')}>
            <span className="flex items-center gap-1.5 text-md font-bold text-primary"><span className="size-2.5 shrink-0 rounded-sm" style={{ background: PLACE_FILL[l.id as ModelPlace] }} aria-hidden />{l.label}</span>
            <span className="text-xs font-medium text-tertiary">{l.hint}</span>
          </motion.button>
        ))}
      </div>
      <div className="min-h-14" aria-live="polite">
        {miss && <NibSays mood="sad">Not {LANE_NAME[miss]}: this one is <strong>{LANE_NAME[lane]}</strong>. {card.note} It’ll come back round.</NibSays>}
        {right && (
          <div className="flex flex-col gap-3">
            <NibSays mood="cheer">{card.note}</NibSays>
            <div className="flex justify-end"><Button size="lg" onPress={next}>{deck.length > 1 ? 'Next piece' : 'See the model'}</Button></div>
          </div>
        )}
        {!miss && !right && <NibSays mood="think">Is it about looks? Is it on other pages, or does it change on its own? Does it say what the article is about? If none of those, it’s a field.</NibSays>}
      </div>
      {model}
    </div>
  );
}
