'use client';
// Mini-game for ia.5-2: run Tarang Software's annual check-up on Nabz for Business. Every card is one step (its
// `visual`, a key of `NABZ_DUTIES`), in workflow order, with the facts that decide who owns it: an amount against
// HR's limit (`HR_SPEND_LIMIT`), a group size against the reporting floor (`MIN_REPORT_GROUP`). Put it in the lane of
// the role that owns it (`NABZ_ROLES`, scored by `dutyOwner`). Right calls draw it on the swimlane with an arrow from
// the last step, and a running count of hand-offs between roles (`roleHandoffs`). A miss explains and the card comes
// back later; first call scores.
import { useState } from 'react';
import { motion } from 'motion/react';
import { HR_SPEND_LIMIT, MIN_REPORT_GROUP, NABZ_DUTIES, dutyOwner, roleHandoffs, type Episode, type NabzDuty, type NabzRole } from '@shape/content';
import { springs } from '@shape/ui';
import { Button } from '@/components/base/buttons/button';
import { cx } from '@/utils/cx';
import { Burst, NibSays, StageTitle } from '../kit';
import { LANE, ROLE_TONE, Swimlane, laneH } from '../scenes/RoleSwimlane';
import type { GameResult } from './DiamondSort';
import { play } from '@/lib/sound';

type Game = Episode['game'];
const rupees = (n: number) => `₹${n.toLocaleString('en-IN')}`;
/** The fact on the card that decides it, if it has one. */
const fact = (k: NabzDuty) => {
  const d = NABZ_DUTIES[k];
  if (d.kind === 'spend') return `${rupees(d.amount ?? 0)} · HR can approve up to ${rupees(HR_SPEND_LIMIT)}`;
  if (d.kind === 'aggregate') return `A group of ${(d.group ?? 0).toLocaleString('en-IN')} · health numbers are reported for groups of ${MIN_REPORT_GROUP} or more`;
  if (d.kind === 'personal') return 'About one person';
  return null;
};

function Lanes({ drawn, hot }: { drawn: NabzDuty[]; hot?: NabzDuty }) {
  const owners = (Object.keys(NABZ_DUTIES) as NabzDuty[]).filter(d => drawn.includes(d)).map(d => dutyOwner(NABZ_DUTIES[d]));
  return (
    <div className="flex flex-col gap-2 rounded-2xl bg-secondary p-3">
      <div className="flex items-baseline justify-between px-1">
        <span className="text-xs font-bold tracking-wide text-tertiary uppercase">Swimlane</span>
        <span className="text-sm font-semibold text-secondary tabular-nums">{roleHandoffs(owners)} hand-offs</span>
      </div>
      <div className="overflow-x-auto">
        <svg viewBox={`-2 0 ${LANE.w + 4} ${laneH + 2}`} className="w-full min-w-[34rem]" role="img" aria-label={`Swimlane with ${drawn.length} steps and ${roleHandoffs(owners)} hand-offs between roles`}>
          <Swimlane drawn={drawn} hot={hot} />
        </svg>
      </div>
    </div>
  );
}

export function RoleSwim({ game, onDone }: { game: Game; onDone: (results: GameResult[]) => void }) {
  const [deck, setDeck] = useState(game.cards);
  const [results, setResults] = useState<Record<string, boolean>>({});
  const [drawn, setDrawn] = useState<NabzDuty[]>([]);
  const [miss, setMiss] = useState<string | null>(null);
  const [right, setRight] = useState(false);
  const card = deck[0];

  if (!card) {
    const n = Object.values(results).filter(Boolean).length;
    const owners = (Object.keys(NABZ_DUTIES) as NabzDuty[]).map(d => dutyOwner(NABZ_DUTIES[d]));
    return (
      <div className="relative flex flex-col gap-5 py-6">
        <Burst count={36} />
        <StageTitle eyebrow="Check-up mapped" title={`${n} of ${game.cards.length} owners right first time`}>
          {roleHandoffs(owners)} hand-offs across four roles. Each one needs a message, a fallback when nobody acts, and a status the person waiting can see.
        </StageTitle>
        <Lanes drawn={drawn} />
        <NibSays mood={n === game.cards.length ? 'cheer' : 'idle'}>Set ownership from the data and the limits, not the job titles. One person’s booking, consent and results are theirs. Money over HR’s limit goes to finance. Health numbers go to HR only for groups big enough to hide anyone in. Camps and kits are Nabz’s.</NibSays>
        <Button size="xl" onPress={() => onDone(game.cards.map(c => ({ id: c.id, correct: !!results[c.id] })))}>Continue the story</Button>
      </div>
    );
  }

  const k = card.visual as NabzDuty;
  const lane = dutyOwner(NABZ_DUTIES[k]);
  const owner = game.lanes.find(l => l.id === lane)!;
  const done = game.cards.length - deck.length;
  const why = fact(k);
  const call = (laneId: string) => {
    if (miss || right) return;
    const ok = laneId === lane;
    play(ok ? 'correct' : 'wrong');
    setResults(rs => (card.id in rs ? rs : { ...rs, [card.id]: ok }));
    if (ok) { setRight(true); setDrawn(ds => [...ds, k]); }
    else { setMiss(laneId); setTimeout(() => { setMiss(null); setDeck(dk => [...dk.slice(1), dk[0]]); }, 3200); }
  };
  const next = () => { setRight(false); setDeck(dk => dk.slice(1)); };

  return (
    <div className="flex flex-col gap-5">
      <StageTitle eyebrow="Play" title={game.title}>{game.instructions}</StageTitle>
      <Lanes drawn={drawn} hot={right ? k : undefined} />
      <div className="flex items-baseline justify-between">
        <span className="text-sm font-semibold text-tertiary">Steps in the check-up</span>
        <span className="text-sm font-semibold text-tertiary tabular-nums">{done} / {game.cards.length}</span>
      </div>
      <motion.div key={`${card.id}-${deck.length}`} initial={{ y: 24, opacity: 0 }} animate={miss ? { x: [0, -10, 10, -6, 6, 0], y: 0, opacity: 1 } : { y: 0, opacity: 1 }} transition={miss ? { duration: 0.4 } : springs.pop}
        className={cx('flex flex-col gap-2 rounded-2xl bg-primary p-5 shadow-lg ring-2 ring-inset', miss ? 'ring-error' : right ? 'ring-mint-600' : 'ring-secondary')} data-current-card>
        <span className="text-xs font-bold tracking-wide text-tertiary uppercase">Tarang · annual check-up</span>
        <p className="text-lg font-semibold text-primary">{card.label}</p>
        {why && <p className="text-sm font-medium text-tertiary">{why}</p>}
      </motion.div>
      <div className="grid grid-cols-2 gap-2 md:grid-cols-4" role="group" aria-label="Role that owns it">
        {game.lanes.map(l => (
          <motion.button key={l.id} type="button" onClick={() => call(l.id)} disabled={!!miss || right} whileTap={{ scale: 0.97 }}
            className={cx('flex flex-col items-start gap-0.5 rounded-xl border-2 bg-primary px-3 py-2.5 text-left transition enabled:hover:bg-primary_hover disabled:cursor-default',
              right && l.id === lane ? 'border-mint-600' : miss === l.id ? 'border-error' : miss && l.id === lane ? 'border-mint-600' : 'border-secondary')}>
            <span className="flex items-center gap-1.5 text-md font-bold text-primary"><span className="size-2.5 rounded-full" style={{ background: ROLE_TONE[l.id as NabzRole] }} aria-hidden />{l.label}</span>
            <span className="text-xs font-medium text-tertiary">{l.hint}</span>
          </motion.button>
        ))}
      </div>
      <div className="min-h-14" aria-live="polite">
        {miss && <NibSays mood="sad">Not quite: <strong>{owner.label.toLowerCase()}</strong>. {card.note} It’ll come back round.</NibSays>}
        {right && (
          <div className="flex flex-col gap-3">
            <NibSays mood="cheer">{card.note}</NibSays>
            <div className="flex justify-end"><Button size="lg" onPress={next}>{deck.length > 1 ? 'Next step' : 'See the swimlane'}</Button></div>
          </div>
        )}
        {!miss && !right && <NibSays mood="think">Whose data is it, how much money is it, and how big is the group? Those decide the lane, more than who asked.</NibSays>}
      </div>
    </div>
  );
}
