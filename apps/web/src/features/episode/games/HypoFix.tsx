'use client';
// Mini-game for gr.3-1: each card is a hypothesis from Tokri's backlog (its `visual`, a key of `TOKRI_HYPOS`), laid
// out as its four parts. Tap the part that stops it being testable; the right one is what `hypoFlaw` finds. A wrong tap
// shakes, says what that part needs and the card comes back later. Then choose the rewrite for the weak part: the fix,
// or a trap that is still weak in the same way (`hypoRewrite`). The tap scores on the first try; the rewrites are
// tallied. The end shows the backlog, mended.
import { useState } from 'react';
import { motion } from 'motion/react';
import { HYPO_PARTS, TOKRI_HYPOS, hypoFlaw, hypoRewrite, type Episode, type Hypothesis, type HypoPart, type TokriHypo } from '@shape/content';
import { springs } from '@shape/ui';
import { Button } from '@/components/base/buttons/button';
import { cx } from '@/utils/cx';
import { Burst, NibSays, StageTitle } from '../kit';
import { HYPO_FILL, HYPO_LEAD } from '../scenes/HypothesisShape';
import type { GameResult } from './DiamondSort';
import { play } from '@/lib/sound';

type Game = Episode['game'];

function Parts({ h, weak, picked, onTap, disabled }: { h: Hypothesis; weak?: HypoPart | null; picked?: HypoPart | null; onTap?: (p: HypoPart) => void; disabled?: boolean }) {
  return (
    <ol className="flex flex-col gap-2">
      {HYPO_PARTS.map(part => (
        <li key={part}>
          <motion.button type="button" onClick={() => onTap?.(part)} disabled={disabled} whileTap={{ scale: 0.98 }} layout
            className={cx('flex w-full items-start gap-3 rounded-xl border-2 bg-primary px-3 py-2.5 text-left transition enabled:hover:bg-primary_hover disabled:cursor-default',
              weak === part ? 'border-mint-600' : picked === part ? 'border-error' : 'border-secondary')}>
            <span className="mt-0.5 w-24 shrink-0 rounded-full px-2 py-0.5 text-center text-xs font-bold text-white" style={{ background: HYPO_FILL[part] }}>{HYPO_LEAD[part]}</span>
            <span className="text-md font-semibold text-primary">{h[part].text}</span>
          </motion.button>
        </li>
      ))}
    </ol>
  );
}

export function HypoFix({ game, onDone }: { game: Game; onDone: (results: GameResult[]) => void }) {
  const [deck, setDeck] = useState(game.cards);
  const [results, setResults] = useState<Record<string, boolean>>({});
  const [fixes, setFixes] = useState<Record<string, boolean>>({});
  const [miss, setMiss] = useState<HypoPart | null>(null);
  const [found, setFound] = useState(false);
  const [chose, setChose] = useState<'fix' | 'trap' | null>(null);
  const card = deck[0];

  if (!card) {
    const right = Object.values(results).filter(Boolean).length, mended = Object.values(fixes).filter(Boolean).length;
    return (
      <div className="relative flex flex-col items-center gap-5 py-6 text-center">
        <Burst count={36} />
        <StageTitle eyebrow="Tokri’s backlog, mended" title={`${right} of ${game.cards.length} weak parts found first time`}>
          {`And ${mended} of ${game.cards.length} rewrites picked right. Every hypothesis now has evidence, one change, the people who’ll meet it, and a result that could prove it wrong.`}
        </StageTitle>
        <NibSays mood={right === game.cards.length ? 'cheer' : 'idle'}>Before a test, read the hypothesis aloud and ask: what result would make us stop believing this? If nothing would, rewrite it.</NibSays>
        <Button size="xl" onPress={() => onDone(game.cards.map(c => ({ id: c.id, correct: !!results[c.id] })))}>Continue the story</Button>
      </div>
    );
  }

  const h = TOKRI_HYPOS[card.visual as TokriHypo] as Hypothesis;
  const weak = hypoFlaw(h)!;
  const lane = game.lanes.find(l => l.id === weak)!;
  const missLane = miss ? game.lanes.find(l => l.id === miss) : undefined;
  const done = game.cards.length - deck.length;
  // The fix and the trap swap places from card to card, so the right answer isn't always first.
  const options: ('fix' | 'trap')[] = done % 2 ? ['trap', 'fix'] : ['fix', 'trap'];
  const shown = chose ? hypoRewrite(h, 'fix') : h;

  const tap = (part: HypoPart) => {
    if (miss || found) return;
    const ok = part === weak;
    play(ok ? 'correct' : 'wrong');
    setResults(x => (card.id in x ? x : { ...x, [card.id]: ok }));
    if (ok) setFound(true);
    else { setMiss(part); setTimeout(() => { setMiss(null); setDeck(d => [...d.slice(1), d[0]]); }, 2800); }
  };
  const pick = (o: 'fix' | 'trap') => { play(o === 'fix' ? 'correct' : 'wrong'); setChose(o); setFixes(x => ({ ...x, [card.id]: o === 'fix' })); };
  const next = () => { setFound(false); setChose(null); setDeck(d => d.slice(1)); };

  return (
    <div className="flex flex-col gap-5">
      <StageTitle eyebrow="Play" title={game.title}>{game.instructions}</StageTitle>
      <div className="flex items-baseline justify-between">
        <span className="text-sm font-semibold text-tertiary">{!found ? 'Which part is weak?' : !chose ? `Rewrite the “${HYPO_LEAD[weak].toLowerCase()}”` : 'Mended'}</span>
        <span className="text-sm font-semibold text-tertiary tabular-nums">{done} / {game.cards.length}</span>
      </div>
      <motion.div key={`${card.id}-${deck.length}`} initial={{ y: -14, opacity: 0 }} animate={miss ? { x: [0, -10, 10, -6, 6, 0], opacity: 1 } : { y: 0, opacity: 1 }} transition={miss ? { duration: 0.4 } : springs.pop}
        className={cx('rounded-2xl bg-secondary p-3 ring-2 ring-inset', miss ? 'ring-error' : chose === 'fix' ? 'ring-mint-600' : 'ring-secondary')} data-current-card aria-label={card.label}>
        <Parts h={shown} weak={found ? weak : null} picked={miss} onTap={tap} disabled={!!miss || found} />
      </motion.div>
      {found && !chose && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={springs.pop} className="grid gap-2 sm:grid-cols-2" role="group" aria-label="Rewrites">
          {options.map(o => (
            <motion.button key={o} type="button" onClick={() => pick(o)} whileTap={{ scale: 0.98 }}
              className="flex flex-col items-start gap-1.5 rounded-2xl border-2 border-transparent bg-secondary p-3 text-left transition hover:bg-secondary_hover">
              <span className="rounded-full px-2 py-0.5 text-xs font-bold text-white" style={{ background: HYPO_FILL[weak] }}>{HYPO_LEAD[weak]}</span>
              <span className="text-md font-semibold text-primary">{h[o]}</span>
            </motion.button>
          ))}
        </motion.div>
      )}
      <div className="min-h-14" aria-live="polite">
        {miss && missLane && <NibSays mood="sad">That part has what it needs ({missLane.hint.toLowerCase()}). Look at the <strong>{lane.label.toLowerCase()}</strong> part. It’ll come back round.</NibSays>}
        {found && !chose && <NibSays mood="think">Found it: the “{HYPO_LEAD[weak].toLowerCase()}” needs {lane.hint.toLowerCase()}. Which rewrite fixes it?</NibSays>}
        {chose && (
          <div className="flex flex-col gap-3">
            <NibSays mood={chose === 'fix' ? 'cheer' : 'think'}>{chose === 'trap' ? `“${h.trap}” is still weak the same way. The fix is above. ` : ''}{card.note}</NibSays>
            <div className="flex justify-end"><Button size="lg" onPress={next}>{deck.length > 1 ? 'Next hypothesis' : 'See the backlog'}</Button></div>
          </div>
        )}
      </div>
    </div>
  );
}
