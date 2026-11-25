'use client';
// Mini-game for dc.4-3: review the coding agent's pull request. Every card is one change in it (its `visual`, a key of
// `CHAKKI_CHANGES`), shown as a file in the diff. Keep it, check it yourself, add a rule and have it redone, or revert
// it (`REVIEW_CALLS`, scored by `reviewCall`): scope and weakened checks first, then broken conventions, then what only
// a person can prove. Right calls build the reviewed pull request (`reviewedPr`) and the rules file (`rulesFile`).
// First call scores; a missed card comes back later.
import { useState } from 'react';
import { motion } from 'motion/react';
import { CHAKKI_CHANGES, reviewCall, reviewedPr, rulesFile, type ChakkiChange, type Episode, type ReviewCall } from '@shape/content';
import { springs } from '@shape/ui';
import { Button } from '@/components/base/buttons/button';
import { cx } from '@/utils/cx';
import { Burst, NibSays, StageTitle } from '../kit';
import { REVIEW_FILL } from '../scenes/AgentLoop';
import type { GameResult } from './DiamondSort';
import { play } from '@/lib/sound';

type Game = Episode['game'];
const MARK: Record<ReviewCall, string> = { keep: 'Kept', verify: 'Check by hand', rules: 'Redo with rule', revert: 'Reverted' };

/** Why a wrong call is wrong, from the change itself. */
function whyNot(k: ChakkiChange) {
  const c = CHAKKI_CHANGES[k];
  if (!c.asked) return 'Nobody asked for this. Out-of-scope changes come out first, however tidy they look.';
  if (c.weakens) return 'It weakens a check that proves the work. That is reverted before anything else.';
  if (c.breaks) return `It breaks a team convention the agent wasn’t told: “${c.breaks}”`;
  if (c.proof === 'person') return 'No test or type check covers this; only a person on a real phone can.';
  return `It was asked for, follows the rules, and ${c.proof === 'test' ? 'its tests prove it' : 'the type checker proves it'}.`;
}

export function AgentReview({ game, onDone }: { game: Game; onDone: (results: GameResult[]) => void }) {
  const [deck, setDeck] = useState(game.cards);
  const [results, setResults] = useState<Record<string, boolean>>({});
  const [placed, setPlaced] = useState<ChakkiChange[]>([]);
  const [miss, setMiss] = useState<{ lane: string; why: string } | null>(null);
  const [right, setRight] = useState(false);
  const card = deck[0];

  const rules = rulesFile(placed);
  const panels = (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-1.5 rounded-2xl bg-secondary p-3">
        <span className="text-sm font-bold text-primary">Pull request · Substitutions</span>
        {placed.length === 0 && <span className="text-sm text-tertiary">Reviewed changes land here.</span>}
        <ul className="flex flex-col gap-1">
          {placed.map(k => {
            const r = reviewCall(CHAKKI_CHANGES[k]);
            return (
              <motion.li key={k} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={springs.pop} className="flex items-start justify-between gap-2 text-sm">
                <span className={cx('min-w-0 font-semibold text-secondary', r === 'revert' && 'line-through')}>{CHAKKI_CHANGES[k].short}</span>
                <span className="shrink-0 rounded-md px-1.5 py-0.5 text-xs font-bold text-white" style={{ background: REVIEW_FILL[r] }}>{MARK[r]}</span>
              </motion.li>
            );
          })}
        </ul>
      </div>
      <div className="flex flex-col gap-1 rounded-2xl bg-gray-900 p-3 font-mono text-sm leading-snug text-gray-100">
        <span className="text-gray-400">{'# AGENTS.md: added in this review'}</span>
        {rules.length === 0 && <span className="text-gray-400">{'- …'}</span>}
        {rules.map(r => <motion.span key={r} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="block break-words">- {r}</motion.span>)}
      </div>
    </div>
  );

  if (!card) {
    const n = Object.values(results).filter(Boolean).length;
    const pr = reviewedPr(placed);
    return (
      <div className="relative flex flex-col gap-5 py-6">
        <Burst count={36} />
        <StageTitle eyebrow="Pull request reviewed" title={`${n} of ${game.cards.length} right first time`}>
          {pr.keep.length} changes merge as they are, {pr.revert.length} are reverted, {pr.rules.length} go back with {rules.length} new rules, and {pr.verify.length} wait for Nandini and a real phone.
        </StageTitle>
        {panels}
        <NibSays mood={n === game.cards.length ? 'cheer' : 'idle'}>Green checks are only as honest as the checks that ran. The last one is your own eyes.</NibSays>
        <Button size="xl" onPress={() => onDone(game.cards.map(c => ({ id: c.id, correct: !!results[c.id] })))}>Continue the story</Button>
      </div>
    );
  }

  const k = card.visual as ChakkiChange;
  const c = CHAKKI_CHANGES[k];
  const lane = reviewCall(c);
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

  return (
    <div className="flex flex-col gap-5">
      <StageTitle eyebrow="Play" title={game.title}>{game.instructions}</StageTitle>
      <div className="flex items-baseline justify-between">
        <span className="text-sm font-semibold text-tertiary">Agent’s pull request · 34 files</span>
        <span className="text-sm font-semibold text-tertiary tabular-nums">{done} / {game.cards.length}</span>
      </div>
      <motion.div key={`${card.id}-${deck.length}`} initial={{ y: 24, opacity: 0 }}
        animate={miss ? { x: [0, -10, 10, -6, 6, 0], y: 0, opacity: 1 } : { y: 0, opacity: 1 }}
        transition={miss ? { duration: 0.4 } : springs.pop}
        className={cx('flex flex-col gap-3 rounded-2xl bg-primary p-4 shadow-lg ring-2 ring-inset sm:p-5', miss ? 'ring-error' : right ? 'ring-mint-600' : 'ring-secondary')} data-current-card>
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-md bg-gray-900 px-2 py-0.5 font-mono text-sm text-gray-100">{c.file}</span>
          <span className="text-sm font-bold text-tertiary">{c.short}</span>
        </div>
        <p className="text-lg font-semibold text-primary">{card.label}</p>
        {right && (
          <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={springs.pop}
            className="rounded-lg px-3 py-2 text-sm font-semibold text-primary" style={{ boxShadow: `inset 3px 0 0 ${REVIEW_FILL[lane]}` }}>
            {lane === 'rules' ? `New rule: ${c.breaks}` : lane === 'verify' ? 'Added to Nandini’s checklist for the Redmi.' : lane === 'revert' ? 'Reverted.' : 'Kept.'}
          </motion.p>
        )}
      </motion.div>
      <div className="grid grid-cols-2 gap-2" role="group" aria-label="What to do with this change">
        {game.lanes.map(l => (
          <motion.button key={l.id} type="button" onClick={() => call(l.id)} disabled={!!miss || right} whileTap={{ scale: 0.97 }}
            className={cx('flex flex-col items-start gap-0.5 rounded-xl border-2 bg-primary px-3 py-2.5 text-left transition enabled:hover:bg-primary_hover disabled:cursor-default',
              right && l.id === lane ? 'border-mint-600' : miss?.lane === l.id ? 'border-error' : miss && l.id === lane ? 'border-mint-600' : 'border-secondary')}>
            <span className="flex items-center gap-1.5 text-md font-bold text-primary"><span className="size-2.5 shrink-0 rounded-full" style={{ background: REVIEW_FILL[l.id as ReviewCall] }} aria-hidden />{l.label}</span>
            <span className="text-xs font-medium text-tertiary">{l.hint}</span>
          </motion.button>
        ))}
      </div>
      <div className="min-h-14" aria-live="polite">
        {miss && <NibSays mood="sad">{miss.why} {card.note} It’ll come back round.</NibSays>}
        {right && (
          <div className="flex flex-col gap-3">
            <NibSays mood="cheer">{card.note}</NibSays>
            <div className="flex justify-end"><Button size="lg" onPress={next}>{deck.length > 1 ? 'Next change' : 'See the review'}</Button></div>
          </div>
        )}
        {!miss && !right && <NibSays mood="think">Was it asked for? Does it weaken a check? Does it break a convention? Can a test prove it, or only you?</NibSays>}
      </div>
      {panels}
    </div>
  );
}
