'use client';
// Mini-game for ds.2-1: each card is a change request for Rasta's pass screen, and its `visual` is the one token that
// does it ("color-action-primary:amber-700"). Pick the tier to edit. The game edits the token at that tier on the
// request's chain (a higher tier reaches its ancestor, a lower one only its first child), lights the chain, redraws the
// pass screen, and rings what changed as asked in mint and what changed by mistake, or was missed, in red.
import { useState } from 'react';
import { motion } from 'motion/react';
import { CheckIcon, XIcon } from '@phosphor-icons/react/ssr';
import { blastRadius, parentOf, resolveTokens, SEMANTIC, tierOf, TOKEN_TIERS, type ComponentToken, type Episode, type TokenTier } from '@shape/content';
import { Button } from '@/components/base/buttons/button';
import { cx } from '@/utils/cx';
import { Burst, NibSays, StageTitle } from '../kit';
import { CHAIN_H, CHAIN_W, PASS_H, PASS_W, RastaPass, TierChain } from '../scenes/TokenTiers';
import type { GameResult } from './DiamondSort';
import { play } from '@/lib/sound';

type Game = Episode['game'];
const rank = (t: TokenTier) => TOKEN_TIERS.indexOf(t);

/** What editing at `tier` does for a request whose right edit is `token` → `to`. */
export function editAt(token: string, to: string, tier: TokenTier) {
  const own = tierOf(token)!;
  let at = token, value = to;
  if (rank(tier) < rank(own)) {   // reach up the chain: a broader edit
    const raw = resolveTokens({ [token]: to })[blastRadius(token)[0]];
    while (tierOf(at) !== tier) at = parentOf(at)!;
    value = tier === 'primitive' ? raw : to;
  } else if (rank(tier) > rank(own)) {   // reach down: a narrower edit
    at = tier === 'component' ? blastRadius(token)[0] : Object.keys(SEMANTIC).find(s => (SEMANTIC as Record<string, string>)[s] === token)!;
  }
  const want = blastRadius(token), got = blastRadius(at);
  return {
    at, value, v: resolveTokens({ [at]: value }),
    good: got.filter(k => want.includes(k)) as ComponentToken[],
    over: got.filter(k => !want.includes(k)) as ComponentToken[],
    missed: want.filter(k => !got.includes(k)) as ComponentToken[],
  };
}

const human = (ks: readonly string[]) => ks.map(k => k.replace(/-(on-bg|bg|color|label|radius|border|text)$/, '').replace(/-/g, ' ')).filter((k, i, a) => a.indexOf(k) === i).join(', ');

export function TierEdit({ game, onDone }: { game: Game; onDone: (results: GameResult[]) => void }) {
  const [i, setI] = useState(0);
  const [picks, setPicks] = useState<Record<string, string>>({});
  const card = game.cards[i];
  const picked = card ? (picks[card.id] as TokenTier | undefined) : undefined;

  if (!card) {
    const right = game.cards.filter(c => picks[c.id] === c.lane).length;
    return (
      <div className="relative flex flex-col items-center gap-5 py-6 text-center">
        <Burst count={36} />
        <StageTitle eyebrow="All edits made" title={`${right} of ${game.cards.length} at the right tier`}>
          Palette changes went to primitives, jobs to semantic tokens, one component’s exception to its own token.
        </StageTitle>
        <div className="w-full rounded-2xl bg-secondary p-3">
          <svg viewBox={`-8 -4 ${CHAIN_W + 16} ${CHAIN_H + 8}`} className="w-full" role="img" aria-label="Rasta’s tokens in three tiers, each pointing at the tier before"><TierChain /></svg>
        </div>
        <NibSays mood={right === game.cards.length ? 'cheer' : 'idle'}>Too high and a change spills onto things nobody asked about. Too low and you miss half of what was asked. The tier is the size of the change.</NibSays>
        <Button size="xl" onPress={() => onDone(game.cards.map(c => ({ id: c.id, correct: picks[c.id] === c.lane })))}>Continue the story</Button>
      </div>
    );
  }

  const [token, to] = (card.visual ?? '').split(':');
  const result = picked ? editAt(token, to, picked) : null;
  const ok = picked === card.lane;
  const pick = (tier: TokenTier) => { if (picked) return; play(tier === card.lane ? 'correct' : 'wrong'); setPicks(p => ({ ...p, [card.id]: tier })); };

  return (
    <div className="flex flex-col gap-5">
      <StageTitle eyebrow="Play" title={game.title}>{game.instructions}</StageTitle>
      <div className="flex items-baseline justify-between">
        <span className="text-sm font-semibold text-tertiary">Change request</span>
        <span className="text-sm font-semibold text-tertiary tabular-nums">{i + 1} / {game.cards.length}</span>
      </div>
      <motion.div key={card.id} initial={{ y: -12, opacity: 0 }} animate={picked && !ok ? { x: [0, -10, 10, -6, 6, 0], opacity: 1, y: 0 } : { y: 0, opacity: 1 }} transition={{ duration: 0.4 }}
        className={cx('rounded-2xl bg-primary px-5 py-4 text-lg font-semibold text-primary shadow-lg ring-2 ring-inset', !picked ? 'ring-secondary' : ok ? 'ring-mint-600' : 'ring-error')} data-current-card>
        {card.label}
      </motion.div>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
        {game.lanes.map(l => (
          <motion.button key={l.id} type="button" onClick={() => pick(l.id as TokenTier)} disabled={!!picked} whileTap={{ scale: 0.96 }}
            className={cx('flex flex-col items-start gap-1 rounded-2xl bg-primary px-3 py-3 text-left ring-2 ring-secondary ring-inset transition disabled:cursor-default',
              !picked && 'hover:bg-primary_hover', picked && l.id !== picked && l.id !== card.lane && 'opacity-40', picked && l.id === card.lane && 'ring-mint-600', picked === l.id && !ok && 'ring-error')}>
            <span className="text-sm font-bold text-primary">{l.label}</span>
            <span className="text-xs leading-tight text-tertiary">{l.hint}</span>
          </motion.button>
        ))}
      </div>
      <div className="grid items-center gap-3 rounded-2xl bg-secondary p-3 sm:grid-cols-[3fr_2fr]">
        <svg viewBox={`-8 -4 ${CHAIN_W + 16} ${CHAIN_H + 8}`} className="w-full" role="img" aria-label={result ? `Token chain with ${result.at} edited` : 'Rasta’s token chain'}>
          <TierChain edits={result ? { [result.at]: result.value } : {}} lit={result?.at} />
        </svg>
        <svg viewBox={`-6 -6 ${PASS_W + 12} ${PASS_H + 12}`} className="mx-auto w-44 sm:w-full" role="img" aria-label={result ? 'Rasta’s pass screen after the edit' : 'Rasta’s pass screen'}>
          <RastaPass v={result?.v ?? resolveTokens()} good={result?.good} bad={result ? [...result.over, ...result.missed] : []} />
        </svg>
      </div>
      {picked && result && (
        <NibSays mood={ok ? 'cheer' : 'sad'}>
          <span className="inline-flex items-center gap-1 font-semibold">{ok ? <CheckIcon className="size-4" weight="bold" /> : <XIcon className="size-4" weight="bold" />}Edit <code className="font-mono">{token}</code>.</span>{' '}
          {!ok && result.over.length > 0 && <>Editing <code className="font-mono">{result.at}</code> also changed the {human(result.over)}. </>}
          {!ok && result.missed.length > 0 && <>Editing <code className="font-mono">{result.at}</code> missed the {human(result.missed)}. </>}
          {!ok && !result.over.length && !result.missed.length && <>Editing <code className="font-mono">{result.at}</code> looks the same today, but it puts the change in the wrong place. </>}
          {card.note}
        </NibSays>
      )}
      {picked && <div className="flex justify-end"><Button size="lg" onPress={() => setI(k => k + 1)}>{i + 1 < game.cards.length ? 'Next request' : 'See the tiers'}</Button></div>}
    </div>
  );
}
