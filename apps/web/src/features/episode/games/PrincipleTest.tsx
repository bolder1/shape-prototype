'use client';
// Mini-game for fd.4-2: does it decide? Every card is a draft from Haat's principles workshop (its `visual`, a key of
// `HAAT_PRINCIPLES`). Call it a platitude, too vague, or a principle that decides (`PRINCIPLE_VERDICTS`, scored by
// `principleVerdict`). Haat's four live disputes sit above the card (`HAAT_DISPUTES`); every principle filed as
// deciding settles its disputes on the strip (`disputeState`), and a dispute pulled both ways turns red until the end,
// when Ritika's ranking (`PRINCIPLE_RANK`) settles it. A miss explains and the card comes back later; first call scores.
import { useState } from 'react';
import { motion } from 'motion/react';
import { DISPUTE_IDS, HAAT_DISPUTES, HAAT_PRINCIPLES, PRINCIPLE_RANK, disputeState, principleVerdict, type Episode, type HaatDispute, type HaatPrinciple, type PrincipleVerdict } from '@shape/content';
import { springs } from '@shape/ui';
import { Button } from '@/components/base/buttons/button';
import { cx } from '@/utils/cx';
import { Burst, NibSays, StageTitle } from '../kit';
import { VERDICT_TONE } from '../scenes/PrinciplePoster';
import type { GameResult } from './DiamondSort';
import { play } from '@/lib/sound';

type Game = Episode['game'];

function Disputes({ kept, hot, ranked }: { kept: HaatPrinciple[]; hot?: HaatPrinciple; ranked?: boolean }) {
  const ps = kept.map(k => HAAT_PRINCIPLES[k]);
  const { settled, torn } = disputeState(ps);
  const touched = hot ? (Object.keys(HAAT_PRINCIPLES[hot].settles) as HaatDispute[]) : [];
  return (
    <div className="grid grid-cols-2 gap-2 lg:grid-cols-4" role="status" aria-label="Haat’s live disputes">
      {DISPUTE_IDS.map(d => {
        const q = HAAT_DISPUTES[d];
        const isTorn = torn.includes(d) && !ranked;
        const side = ranked && torn.includes(d) ? HAAT_PRINCIPLES[PRINCIPLE_RANK[0]].settles[d] : settled.includes(d) ? ps.map(p => p.settles[d]).find(Boolean) : undefined;
        return (
          <motion.div key={d} layout animate={touched.includes(d) ? { scale: [1, 1.04, 1] } : { scale: 1 }} transition={{ duration: 0.4 }}
            className={cx('flex flex-col gap-1 rounded-xl bg-primary p-2.5 ring-inset', isTorn ? 'ring-2 ring-error' : side ? 'ring-2 ring-mint-600' : 'ring-1 ring-secondary')}>
            <span className="text-xs font-semibold text-tertiary">{q.question}</span>
            <span className={cx('text-sm font-bold', isTorn ? 'text-error-primary' : 'text-primary')}>
              {isTorn ? 'Pulled both ways' : side ? `Settled: ${q[side]}` : 'Still argued'}
            </span>
          </motion.div>
        );
      })}
    </div>
  );
}

export function PrincipleTest({ game, onDone }: { game: Game; onDone: (results: GameResult[]) => void }) {
  const [deck, setDeck] = useState(game.cards);
  const [results, setResults] = useState<Record<string, boolean>>({});
  const [kept, setKept] = useState<HaatPrinciple[]>([]);
  const [miss, setMiss] = useState<string | null>(null);
  const [right, setRight] = useState(false);
  const card = deck[0];

  if (!card) {
    const n = Object.values(results).filter(Boolean).length;
    const { torn } = disputeState(kept.map(k => HAAT_PRINCIPLES[k]));
    return (
      <div className="relative flex flex-col gap-5 py-6">
        <Burst count={36} />
        <StageTitle eyebrow="Principles tested" title={`${n} of ${game.cards.length} judged first time`}>
          {kept.length} principles kept, and every one of Haat’s four disputes settled. {torn.length > 0 && `The substitution clash is settled by a written ranking: “${HAAT_PRINCIPLES[PRINCIPLE_RANK[0]].text.split(':')[0]}” comes first.`}
        </StageTitle>
        <Disputes kept={kept} ranked />
        <NibSays mood={n === game.cards.length ? 'cheer' : 'idle'}>Two tests. Would a sensible team choose the opposite? If not, it’s a platitude. Does it settle an argument you actually have? If not, it’s still too vague. The “even when” is usually what makes it decide.</NibSays>
        <Button size="xl" onPress={() => onDone(game.cards.map(c => ({ id: c.id, correct: !!results[c.id] })))}>Continue the story</Button>
      </div>
    );
  }

  const k = card.visual as HaatPrinciple;
  const lane = principleVerdict(HAAT_PRINCIPLES[k]);
  const owner = game.lanes.find(l => l.id === lane)!;
  const done = game.cards.length - deck.length;
  const call = (laneId: string) => {
    if (miss || right) return;
    const ok = laneId === lane;
    play(ok ? 'correct' : 'wrong');
    setResults(r => (card.id in r ? r : { ...r, [card.id]: ok }));
    if (ok) { setRight(true); if (lane === 'decides') setKept(ks => [...ks, k]); }
    else { setMiss(laneId); setTimeout(() => { setMiss(null); setDeck(dk => [...dk.slice(1), dk[0]]); }, 3200); }
  };
  const next = () => { setRight(false); setDeck(dk => dk.slice(1)); };

  return (
    <div className="flex flex-col gap-5">
      <StageTitle eyebrow="Play" title={game.title}>{game.instructions}</StageTitle>
      <Disputes kept={kept} hot={right && lane === 'decides' ? k : undefined} />
      <div className="flex flex-col gap-4">
        <div className="flex items-baseline justify-between">
          <span className="text-sm font-semibold text-tertiary">From the workshop wall</span>
          <span className="text-sm font-semibold text-tertiary tabular-nums">{done} / {game.cards.length}</span>
        </div>
        <motion.blockquote key={`${card.id}-${deck.length}`} initial={{ y: 24, opacity: 0, rotate: -1 }} animate={miss ? { x: [0, -10, 10, -6, 6, 0], y: 0, opacity: 1, rotate: 0 } : { y: 0, opacity: 1, rotate: 0 }} transition={miss ? { duration: 0.4 } : springs.pop}
          className={cx('rounded-2xl bg-primary p-6 shadow-lg ring-2 ring-inset', miss ? 'ring-error' : right ? 'ring-mint-600' : 'ring-secondary')} data-current-card>
          <p className="text-xl font-semibold text-primary md:text-display-xs">“{card.label}”</p>
        </motion.blockquote>
        <div className="grid gap-2 sm:grid-cols-3" role="group" aria-label="Is it a principle that decides">
          {game.lanes.map(l => (
            <motion.button key={l.id} type="button" onClick={() => call(l.id)} disabled={!!miss || right} whileTap={{ scale: 0.97 }}
              className={cx('flex flex-col items-start gap-0.5 rounded-xl border-2 bg-primary px-3 py-2.5 text-left transition enabled:hover:bg-primary_hover disabled:cursor-default',
                right && l.id === lane ? 'border-mint-600' : miss === l.id ? 'border-error' : miss && l.id === lane ? 'border-mint-600' : 'border-secondary')}>
              <span className="flex items-center gap-1.5 text-md font-bold text-primary"><span className="size-2.5 rounded-full" style={{ background: VERDICT_TONE[l.id as PrincipleVerdict] }} aria-hidden />{l.label}</span>
              <span className="text-xs font-medium text-tertiary">{l.hint}</span>
            </motion.button>
          ))}
        </div>
        <div className="min-h-14" aria-live="polite">
          {miss && <NibSays mood="sad">Not quite: <strong>{owner.label.toLowerCase()}</strong>. {card.note} It’ll come back round.</NibSays>}
          {right && (
            <div className="flex flex-col gap-3">
              <NibSays mood="cheer">{card.note}</NibSays>
              <div className="flex justify-end"><Button size="lg" onPress={next}>{deck.length > 1 ? 'Next draft' : 'See the disputes'}</Button></div>
            </div>
          )}
          {!miss && !right && <NibSays mood="think">Would a sensible team choose the opposite? And if so, which of the four disputes does it settle?</NibSays>}
        </div>
      </div>
    </div>
  );
}
