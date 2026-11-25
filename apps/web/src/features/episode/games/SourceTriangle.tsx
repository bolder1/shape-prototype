'use client';
// Mini-game for rs.5-4: Weigh the memo. Each card is a claim from Bolo's decision memo (its `visual`, a key of
// `BOLO_CLAIMS`), with its sources filed under what people say and what they do (`METHOD_KIND`), each marked as
// agreeing or not. A small triangle lights its say and do corners as the evidence covers them, and turns its base red
// on a disagreement. Weigh the claim (`WEIGHTS`, scored by `triangulate`); right calls add it to the memo beside the
// card, and the end splits the memo into what to decide on and what to research next. A miss explains and the card
// comes back later; first call scores.
import { useState } from 'react';
import { motion } from 'motion/react';
import { CheckIcon, XIcon } from '@phosphor-icons/react/ssr';
import { BOLO_CLAIMS, METHOD_KIND, METHOD_LABEL, triangulate, type BoloClaim, type Episode, type Weight } from '@shape/content';
import { springs } from '@shape/ui';
import { Button } from '@/components/base/buttons/button';
import { cx } from '@/utils/cx';
import { Burst, NibSays, StageTitle } from '../kit';
import type { GameResult } from './DiamondSort';
import { play } from '@/lib/sound';

type Game = Episode['game'];
/** White text on each passes 4.5:1. */
export const WEIGHT_FILL: Record<Weight, string> = { confident: '#067647', lead: 'var(--color-family-discover-solid)', conflict: '#B42318' };
const KIND_LABEL = { say: 'What people say', do: 'What people do' } as const;

/** Say and do at the base, the claim at the top: a corner lights when evidence of that kind agrees. */
function Triangle({ k }: { k: BoloClaim }) {
  const c = BOLO_CLAIMS[k];
  const has = (kind: 'say' | 'do') => c.sources.some(s => METHOD_KIND[s.method] === kind && s.agrees);
  const clash = c.sources.some(s => !s.agrees);
  const on = 'var(--color-bg-brand-solid)', off = 'var(--color-border-secondary)';
  return (
    <svg viewBox="0 0 120 100" className="h-20 w-24 shrink-0" role="img" aria-label={`Say: ${has('say') ? 'agrees' : 'no support'}. Do: ${has('do') ? 'agrees' : 'no support'}.${clash ? ' A source disagrees.' : ''}`}>
      <path d="M60 12 L16 84" stroke={has('say') ? on : off} strokeWidth={4} strokeLinecap="round" />
      <path d="M60 12 L104 84" stroke={has('do') ? on : off} strokeWidth={4} strokeLinecap="round" />
      <path d="M16 84 L104 84" stroke={clash ? 'var(--color-fg-error-primary)' : has('say') && has('do') ? on : off} strokeWidth={4} strokeLinecap="round" strokeDasharray={clash ? '6 5' : undefined} />
      <circle cx={60} cy={12} r={8} fill="var(--color-bg-primary)" stroke={on} strokeWidth={3} />
      <circle cx={16} cy={84} r={8} fill={has('say') ? on : 'var(--color-bg-primary)'} stroke={has('say') ? on : off} strokeWidth={3} />
      <circle cx={104} cy={84} r={8} fill={has('do') ? on : 'var(--color-bg-primary)'} stroke={has('do') ? on : off} strokeWidth={3} />
      <text x={16} y={99} textAnchor="middle" fontSize={10} fontWeight={700} fill="var(--color-text-tertiary)">SAY</text>
      <text x={104} y={99} textAnchor="middle" fontSize={10} fontWeight={700} fill="var(--color-text-tertiary)">DO</text>
    </svg>
  );
}

function Memo({ decided }: { decided: BoloClaim[] }) {
  return (
    <ol className="flex flex-col gap-1.5 self-start rounded-2xl bg-secondary p-3" aria-label="Decision memo">
      <li className="px-1 pb-1 text-xs font-bold tracking-wide text-tertiary uppercase">Decision memo</li>
      {decided.length === 0 && <li className="px-1 text-xs text-tertiary">Claims you weigh land here.</li>}
      {decided.map(k => {
        const w = triangulate(BOLO_CLAIMS[k]);
        return (
          <motion.li key={k} layout initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={springs.pop}
            className="flex items-center justify-between gap-2 rounded-lg bg-primary px-2.5 py-1.5 ring-1 ring-secondary ring-inset">
            <span className="text-xs font-semibold text-primary">{BOLO_CLAIMS[k].text}</span>
            <span className="shrink-0 rounded-md px-1.5 py-0.5 text-[11px] font-bold text-white capitalize" style={{ background: WEIGHT_FILL[w] }}>{w}</span>
          </motion.li>
        );
      })}
    </ol>
  );
}

export function SourceTriangle({ game, onDone }: { game: Game; onDone: (results: GameResult[]) => void }) {
  const [deck, setDeck] = useState(game.cards);
  const [results, setResults] = useState<Record<string, boolean>>({});
  const [decided, setDecided] = useState<BoloClaim[]>([]);
  const [miss, setMiss] = useState<string | null>(null);
  const [right, setRight] = useState(false);
  const card = deck[0];

  if (!card) {
    const got = Object.values(results).filter(Boolean).length;
    const keys = game.cards.map(c => c.visual as BoloClaim);
    const sure = keys.filter(k => triangulate(BOLO_CLAIMS[k]) === 'confident'), next = keys.filter(k => triangulate(BOLO_CLAIMS[k]) !== 'confident');
    return (
      <div className="relative flex flex-col gap-5 py-6">
        <Burst count={36} />
        <StageTitle eyebrow="Memo weighed" title={`${got} of ${game.cards.length} weighed first time`}>
          Decide on the {sure.length} confident claims. The other {next.length} are the next round of research: check each lead the other way, and dig into each conflict.
        </StageTitle>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl bg-secondary p-3"><p className="pb-1 text-xs font-bold text-tertiary uppercase">Decide on</p><ul className="flex flex-col gap-1 text-sm font-medium text-primary">{sure.map(k => <li key={k}>{BOLO_CLAIMS[k].text}</li>)}</ul></div>
          <div className="rounded-2xl bg-secondary p-3"><p className="pb-1 text-xs font-bold text-tertiary uppercase">Research next</p><ul className="flex flex-col gap-1 text-sm font-medium text-primary">{next.map(k => <li key={k}>{BOLO_CLAIMS[k].text}</li>)}</ul></div>
        </div>
        <NibSays mood={got === game.cards.length ? 'cheer' : 'idle'}>Count kinds of evidence, not sources. Three surveys agreeing is still one blind spot; one survey and the event data is two.</NibSays>
        <Button size="xl" onPress={() => onDone(game.cards.map(c => ({ id: c.id, correct: !!results[c.id] })))}>Continue the story</Button>
      </div>
    );
  }

  const k = card.visual as BoloClaim;
  const cl = BOLO_CLAIMS[k];
  const lane = triangulate(cl), owner = game.lanes.find(l => l.id === lane)!;
  const done = game.cards.length - deck.length;
  const call = (laneId: string) => {
    if (miss || right) return;
    const ok = laneId === lane;
    play(ok ? 'correct' : 'wrong');
    setResults(r => (card.id in r ? r : { ...r, [card.id]: ok }));
    if (ok) { setRight(true); setDecided(ds => [...ds, k]); }
    else { setMiss(laneId); setTimeout(() => { setMiss(null); setDeck(dk => [...dk.slice(1), dk[0]]); }, 3400); }
  };
  const next = () => { setRight(false); setDeck(dk => dk.slice(1)); };

  return (
    <div className="flex flex-col gap-5">
      <StageTitle eyebrow="Play" title={game.title}>{game.instructions}</StageTitle>
      <div className="grid gap-5 md:grid-cols-[1fr_minmax(0,18rem)]">
        <div className="flex flex-col gap-4">
          <div className="flex items-baseline justify-between">
            <span className="text-sm font-semibold text-tertiary">Claim in the memo</span>
            <span className="text-sm font-semibold text-tertiary tabular-nums">{done} / {game.cards.length}</span>
          </div>
          <motion.div key={`${card.id}-${deck.length}`} initial={{ y: 20, opacity: 0 }} animate={miss ? { x: [0, -8, 8, -5, 5, 0], y: 0, opacity: 1 } : { y: 0, opacity: 1 }} transition={miss ? { duration: 0.4 } : springs.pop}
            className={cx('flex flex-col gap-3 rounded-2xl bg-primary p-4 shadow-lg ring-2 ring-inset', miss ? 'ring-error' : right ? 'ring-mint-600' : 'ring-secondary')} data-current-card>
            <div className="flex items-start justify-between gap-3">
              <p className="text-lg font-semibold text-primary">“{card.label}”</p>
              <Triangle k={k} />
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              {(['say', 'do'] as const).map(kind => (
                <div key={kind} className="flex flex-col gap-1.5">
                  <span className="text-xs font-bold text-tertiary uppercase">{KIND_LABEL[kind]}</span>
                  {cl.sources.filter(s => METHOD_KIND[s.method] === kind).map(s => (
                    <div key={s.method} className={cx('flex gap-2 rounded-lg bg-secondary px-2.5 py-2 ring-1 ring-inset', s.agrees ? 'ring-secondary' : 'ring-error')}>
                      {s.agrees ? <CheckIcon className="mt-0.5 size-4 shrink-0 text-fg-success-primary" weight="bold" aria-label="Agrees" /> : <XIcon className="mt-0.5 size-4 shrink-0 text-fg-error-primary" weight="bold" aria-label="Disagrees" />}
                      <span className="text-sm text-secondary"><span className="font-semibold text-primary">{METHOD_LABEL[s.method]}: </span>{s.finding}</span>
                    </div>
                  ))}
                  {!cl.sources.some(s => METHOD_KIND[s.method] === kind) && <span className="rounded-lg border border-dashed border-secondary px-2.5 py-2 text-sm text-tertiary">Nothing yet</span>}
                </div>
              ))}
            </div>
          </motion.div>
          <div className="grid grid-cols-3 gap-2" role="group" aria-label="Your call">
            {game.lanes.map(l => (
              <motion.button key={l.id} type="button" onClick={() => call(l.id)} disabled={!!miss || right} whileTap={{ scale: 0.97 }}
                className={cx('flex flex-col items-start gap-0.5 rounded-xl border-2 bg-primary px-3 py-2.5 text-left transition enabled:hover:bg-primary_hover disabled:cursor-default',
                  right && l.id === lane ? 'border-mint-600' : miss === l.id ? 'border-error' : miss && l.id === lane ? 'border-mint-600' : 'border-secondary')}>
                <span className="flex items-center gap-1.5 text-md font-bold text-primary"><span className="size-2.5 rounded-full" style={{ background: WEIGHT_FILL[l.id as Weight] }} aria-hidden />{l.label}</span>
                <span className="text-xs font-medium text-tertiary">{l.hint}</span>
              </motion.button>
            ))}
          </div>
          <div className="min-h-14" aria-live="polite">
            {miss && <NibSays mood="sad">Not quite: <strong>{owner.label.toLowerCase()}</strong>. {card.note} It’ll come back round.</NibSays>}
            {right && (
              <div className="flex flex-col gap-3">
                <NibSays mood="cheer">{card.note}</NibSays>
                <div className="flex justify-end"><Button size="lg" onPress={next}>{deck.length > 1 ? 'Next claim' : 'Finish the memo'}</Button></div>
              </div>
            )}
            {!miss && !right && <NibSays mood="think">Does anything disagree? If not, does the evidence cover both what people say and what they do, or only one of them?</NibSays>}
          </div>
        </div>
        <Memo decided={decided} />
      </div>
    </div>
  );
}
