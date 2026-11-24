'use client';
// Mini-game for bz.2-2: each card is an objection from Saman's leadership team (its `visual`, a key of
// `SAMAN_OBJECTIONS`), said by that person at the table. Two moves: name the worry underneath it (the lane), then pick
// one of three replies. Exactly one passes `replyFlaw`; the others are defensive, cave in, stay vague or skip the
// acknowledgement, and the game says which. Every first reply moves the room's trust meter by `replyTrust`. A card
// scores when both moves are right first time. The end shows where the room's trust finished.
import { useState } from 'react';
import { motion } from 'motion/react';
import { SAMAN_OBJECTIONS, goodReply, replyFlaw, replyTrust, type Episode, type Objection, type ReplyFlaw, type SamanObjection } from '@shape/content';
import { springs } from '@shape/ui';
import { Button } from '@/components/base/buttons/button';
import { cx } from '@/utils/cx';
import { Burst, NibSays, StageTitle } from '../kit';
import { Person } from '../scenes/ObjectionRoom';
import type { GameResult } from './DiamondSort';
import { play } from '@/lib/sound';

type Game = Episode['game'];
const objOf = (k: string) => SAMAN_OBJECTIONS[k as SamanObjection] as Objection;
const FLAW_TEXT: Record<ReplyFlaw, string> = {
  defensive: 'Defensive: it argues with the person, not the point.',
  caves: 'It caves: the plan is dropped with no reason.',
  vague: 'Vague: no number, no fact, no dated plan.',
  dismissive: 'Concrete, but it skips the worry: it tells them not to have it.',
};

function Meter({ trust, max }: { trust: number; max: number }) {
  const pct = Math.max(-1, Math.min(1, trust / max));
  const min = 0 - max;
  return (
    <div className="flex items-center gap-3" role="meter" aria-valuemin={min} aria-valuemax={max} aria-valuenow={trust} aria-label="The room’s trust">
      <span className="text-sm font-semibold text-tertiary">Room’s trust</span>
      <div className="relative h-3 flex-1 overflow-hidden rounded-full bg-primary ring-1 ring-secondary">
        <div className="absolute inset-y-0 left-1/2 w-px" style={{ background: 'var(--color-border-primary)' }} aria-hidden />
        <motion.div className={cx('absolute inset-y-0 rounded-full', pct >= 0 ? 'bg-mint-600' : 'bg-error-solid')} initial={false} transition={springs.pop}
          animate={pct >= 0 ? { left: '50%', width: `${pct * 50}%` } : { left: `${50 + pct * 50}%`, width: `${-pct * 50}%` }} />
      </div>
      <span className="w-8 text-right text-sm font-bold text-primary tabular-nums">{trust > 0 ? `+${trust}` : trust}</span>
    </div>
  );
}

export function ObjectionReply({ game, onDone }: { game: Game; onDone: (results: GameResult[]) => void }) {
  const [i, setI] = useState(0);
  const [results, setResults] = useState<Record<string, boolean>>({});
  const [kindPick, setKindPick] = useState<string | null>(null);
  const [replyPicks, setReplyPicks] = useState<number[]>([]);
  const [trust, setTrust] = useState(0);
  const card = game.cards[i];
  const max = game.cards.length * 2;

  if (!card) {
    const n = Object.values(results).filter(Boolean).length;
    return (
      <div className="relative flex flex-col items-center gap-5 py-6 text-center">
        <Burst count={36} />
        <StageTitle eyebrow="The room, answered" title={`${n} of ${game.cards.length} handled first time`}>
          {trust >= max / 2 ? 'The room trusts the plan. Approved for the 10% rollout, review on 15 January.' : 'The room is still unsure. A follow-up with the numbers they asked for could still win it.'}
        </StageTitle>
        <div className="w-full max-w-md"><Meter trust={trust} max={max} /></div>
        <NibSays mood={n === game.cards.length ? 'cheer' : 'idle'}>Before the meeting, write down each person’s likely objection from what they’re measured on. Then it’s a question you’ve already answered.</NibSays>
        <Button size="xl" onPress={() => onDone(game.cards.map(c => ({ id: c.id, correct: !!results[c.id] })))}>Continue the story</Button>
      </div>
    );
  }

  const o = objOf(card.visual!);
  const good = goodReply(o);
  const kindDone = kindPick !== null;
  const kindOk = kindPick === o.kind;
  const landed = replyPicks.includes(good);
  const pickKind = (id: string) => {
    if (kindDone) return;
    play(id === o.kind ? 'correct' : 'wrong');
    setKindPick(id);
  };
  const pickReply = (r: number) => {
    if (!kindDone || landed || replyPicks.includes(r)) return;
    const f = replyFlaw(o.replies[r]);
    play(f === null ? 'correct' : 'wrong');
    if (replyPicks.length === 0) {
      setTrust(x => x + replyTrust(f));
      setResults(res => ({ ...res, [card.id]: kindOk && f === null }));
    }
    setReplyPicks(ps => [...ps, r]);
  };
  const next = () => { setKindPick(null); setReplyPicks([]); setI(i + 1); };
  const lastFlaw = replyPicks.length ? replyFlaw(o.replies[replyPicks.at(-1)!]) : null;

  return (
    <div className="flex flex-col gap-5">
      <StageTitle eyebrow="Play" title={game.title}>{game.instructions}</StageTitle>
      <Meter trust={trust} max={max} />
      <div className="flex items-baseline justify-end"><span className="text-sm font-semibold text-tertiary tabular-nums">{i} / {game.cards.length}</span></div>
      <motion.div key={card.id} initial={{ y: -14, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={springs.pop}
        className="flex items-start gap-4 rounded-2xl bg-secondary p-4" data-current-card>
        <svg viewBox="-50 -50 100 130" width={72} height={94} aria-hidden className="shrink-0"><Person x={0} y={0} who={o.who} active r={30} /></svg>
        <div className="flex flex-col gap-1">
          <span className="text-sm font-semibold text-tertiary">{o.who}, {o.role}</span>
          <p className="text-xl font-semibold text-primary">“{o.text}”</p>
        </div>
      </motion.div>

      <div className="flex flex-col gap-2">
        <span className="text-sm font-bold text-primary">1. What’s the worry underneath?</span>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4" role="group" aria-label="The worry">
          {game.lanes.map(l => (
            <motion.button key={l.id} type="button" onClick={() => pickKind(l.id)} disabled={kindDone} whileTap={{ scale: 0.97 }}
              className={cx('flex flex-col items-start gap-0.5 rounded-xl border-2 bg-primary px-3 py-2.5 text-left transition enabled:hover:bg-primary_hover disabled:cursor-default',
                kindDone && l.id === o.kind ? 'border-mint-600' : kindPick === l.id ? 'border-error' : 'border-secondary')}>
              <span className="text-md font-bold text-primary">{l.label}</span>
              <span className="text-xs font-medium text-tertiary">{l.hint}</span>
            </motion.button>
          ))}
        </div>
        {kindDone && !kindOk && <NibSays mood="sad">It’s really about <strong>{game.lanes.find(l => l.id === o.kind)!.label.toLowerCase()}</strong>. Answer that worry, or you’ll answer a question nobody asked.</NibSays>}
      </div>

      {kindDone && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={springs.pop} className="flex flex-col gap-2">
          <span className="text-sm font-bold text-primary">2. What does Neha say?</span>
          <div className="flex flex-col gap-2" role="group" aria-label="Replies">
            {o.replies.map((r, k) => {
              const picked = replyPicks.includes(k);
              const f = replyFlaw(r);
              return (
                <motion.button key={k} type="button" onClick={() => pickReply(k)} disabled={landed || picked} whileTap={{ scale: 0.98 }}
                  animate={picked && f ? { x: [0, -8, 8, -4, 4, 0] } : undefined} transition={{ duration: 0.4 }}
                  className={cx('rounded-xl border-2 bg-primary px-4 py-3 text-left text-md font-medium text-primary transition enabled:hover:bg-primary_hover disabled:cursor-default',
                    picked && f === null ? 'border-mint-600' : picked ? 'border-error opacity-70' : landed ? 'border-secondary opacity-60' : 'border-secondary')}>
                  “{r.text}”
                  {picked && f && <span className="mt-1 block text-sm font-semibold text-error-primary">{FLAW_TEXT[f]}</span>}
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      )}

      <div className="min-h-14" aria-live="polite">
        {!kindDone && <NibSays mood="think">Is it about money and people, something breaking, the evidence, or what else could come first?</NibSays>}
        {kindDone && !replyPicks.length && <NibSays mood="think">Look for the reply that says the worry back, then answers it with something concrete.</NibSays>}
        {kindDone && replyPicks.length > 0 && !landed && lastFlaw && <NibSays mood="sad">The room cools. Try another reply.</NibSays>}
        {landed && (
          <div className="flex flex-col gap-3">
            <NibSays mood="cheer">{card.note}</NibSays>
            <div className="flex justify-end"><Button size="lg" onPress={next}>{i + 1 < game.cards.length ? 'Next question' : 'Leave the room'}</Button></div>
          </div>
        )}
      </div>
    </div>
  );
}
