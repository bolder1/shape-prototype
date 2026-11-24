'use client';
// Mini-game for rs.4-3: eight findings from the five Safar sessions. Each shows how many of the five hit it and how
// badly (`visual`, read by `findingOf`). Rate it cosmetic to critical; it drops onto a frequency × impact grid as a
// numbered dot in its real severity's colour (a miss is ringed). At the end the grid fills with the severity zones
// (`severityOf`) and the findings report ranks itself, most severe first.
import { useState } from 'react';
import { motion } from 'motion/react';
import { CheckIcon, UserIcon, XIcon } from '@phosphor-icons/react/ssr';
import { SEVERITY, findingOf, severityOf, type Episode, type Severity } from '@shape/content';
import { springs } from '@shape/ui';
import { Button } from '@/components/base/buttons/button';
import { cx } from '@/utils/cx';
import { Burst, NibSays, StageTitle } from '../kit';
import { SEV_STYLE } from '../scenes/Severity';
import type { GameResult } from './DiamondSort';
import { play } from '@/lib/sound';

type Game = Episode['game'];
type Card = Game['cards'][number];
const IMPACT = ['', 'Noticed it', 'Slowed down or detoured', 'Blocked, or lost money'];
const X0 = 96, COL = 76, ROW = 54;

function Grid({ cards, rated, zones }: { cards: Card[]; rated: Record<string, string>; zones: boolean }) {
  const placed = cards.filter(c => rated[c.id]);
  return (
    <svg viewBox="0 0 490 220" className="w-full" role="img" aria-label={`Frequency and impact grid with ${placed.length} findings placed`}>
      {[3, 2, 1].map((imp, r) => [1, 2, 3, 4, 5].map(u => (
        <rect key={`${imp}${u}`} x={X0 + (u - 1) * COL + 2} y={r * ROW + 2} width={COL - 4} height={ROW - 4} rx={8}
          fill={zones ? SEV_STYLE[severityOf(u, imp)].zone : 'var(--color-bg-secondary)'} fillOpacity={zones ? 0.55 : 1} stroke="var(--color-border-secondary)" />
      )))}
      {['Blocked', 'Slowed', 'Noticed'].map((l, r) => <text key={l} x={X0 - 10} y={r * ROW + 32} textAnchor="end" fontSize={13} fontWeight={800} fill="var(--color-text-primary)">{l}</text>)}
      {[1, 2, 3, 4, 5].map(u => <text key={u} x={X0 + (u - 0.5) * COL} y={3 * ROW + 20} textAnchor="middle" fontSize={13} fontWeight={800} fill="var(--color-text-primary)">{u}</text>)}
      <text x={X0 + 2.5 * COL} y={3 * ROW + 42} textAnchor="middle" fontSize={11} fontWeight={800} fill="var(--color-text-tertiary)">PEOPLE WHO HIT IT, OF 5</text>
      {placed.map(c => {
        const { users, impact } = findingOf(c.visual ?? ''), sev = severityOf(users, impact), n = cards.indexOf(c) + 1;
        const same = placed.filter(o => o.visual === c.visual), k = same.indexOf(c);
        return (
          <motion.g key={c.id} initial={{ opacity: 0, scale: 0.4 }} animate={{ opacity: 1, scale: 1 }} transition={springs.pop}
            style={{ transformOrigin: `${X0 + (users - 0.5) * COL}px ${(3 - impact + 0.5) * ROW}px` }}>
            <g transform={`translate(${X0 + (users - 0.5) * COL + (k - (same.length - 1) / 2) * 26} ${(3 - impact + 0.5) * ROW})`}>
              {rated[c.id] !== c.lane && <circle r={16} fill="none" stroke="var(--color-fg-error-primary)" strokeWidth={3} />}
              <circle r={12} fill={SEV_STYLE[sev].solid} />
              <text y={4.5} textAnchor="middle" fontSize={12} fontWeight={900} fill={SEV_STYLE[sev].ink}>{n}</text>
            </g>
          </motion.g>
        );
      })}
    </svg>
  );
}

function Pill({ sev }: { sev: Severity }) {
  return <span className="inline-flex shrink-0 items-center rounded-full px-2.5 py-0.5 text-xs font-bold" style={{ background: SEV_STYLE[sev].solid, color: SEV_STYLE[sev].ink }}>{SEV_STYLE[sev].name}</span>;
}

export function SeverityRate({ game, onDone }: { game: Game; onDone: (results: GameResult[]) => void }) {
  const [i, setI] = useState(0);
  const [rated, setRated] = useState<Record<string, string>>({});
  const card = game.cards[i];
  const picked = card ? rated[card.id] : undefined;

  const rate = (laneId: string) => {
    if (!card || picked) return;
    play(laneId === card.lane ? 'correct' : 'wrong');
    setRated(r => ({ ...r, [card.id]: laneId }));
  };

  if (!card) {
    const right = game.cards.filter(c => rated[c.id] === c.lane).length;
    const ranked = [...game.cards].sort((a, b) => {
      const fa = findingOf(a.visual ?? ''), fb = findingOf(b.visual ?? '');
      return SEVERITY.indexOf(b.lane as Severity) - SEVERITY.indexOf(a.lane as Severity) || fb.impact - fa.impact || fb.users - fa.users;
    });
    return (
      <div className="relative flex flex-col items-center gap-5 py-6 text-center">
        <Burst count={36} />
        <StageTitle eyebrow="Findings rated" title={`${right} of ${game.cards.length} rated right`}>
          The grid now shows the zones: blocked or costly problems rate high even when few people hit them.
        </StageTitle>
        <div className="w-full rounded-2xl bg-primary p-3 ring-1 ring-secondary ring-inset"><Grid cards={game.cards} rated={rated} zones /></div>
        <ol className="flex w-full flex-col gap-2 text-left">
          {ranked.map((c, k) => {
            const { users } = findingOf(c.visual ?? '');
            return (
              <li key={c.id} className="flex items-center gap-3 rounded-xl bg-primary px-4 py-2.5 ring-1 ring-secondary ring-inset">
                <span className="w-5 shrink-0 text-sm font-bold text-tertiary tabular-nums">{k + 1}</span>
                <Pill sev={c.lane as Severity} />
                <span className="flex-1 text-sm font-semibold text-primary">{c.label}</span>
                <span className="shrink-0 text-sm font-semibold text-tertiary tabular-nums">{users} of 5</span>
              </li>
            );
          })}
        </ol>
        <NibSays mood={right === game.cards.length ? 'cheer' : 'idle'}>The top of this list goes into the sprint. Put the effort to fix each one in a separate column, so a hard fix never drags a critical problem down.</NibSays>
        <Button size="xl" onPress={() => onDone(game.cards.map(c => ({ id: c.id, correct: rated[c.id] === c.lane })))}>Continue the story</Button>
      </div>
    );
  }

  const { users, impact } = findingOf(card.visual ?? ''), ok = picked === card.lane;
  return (
    <div className="flex flex-col gap-5">
      <StageTitle eyebrow="Play" title={game.title}>{game.instructions}</StageTitle>
      <div className="flex items-baseline justify-between">
        <span className="text-sm font-semibold text-tertiary">Finding {i + 1}</span>
        <span className="text-sm font-semibold text-tertiary tabular-nums">{i + 1} / {game.cards.length}</span>
      </div>
      <motion.div key={card.id} initial={{ y: -12, opacity: 0 }} animate={picked && !ok ? { x: [0, -10, 10, -6, 6, 0], opacity: 1, y: 0 } : { y: 0, opacity: 1 }} transition={{ duration: 0.4 }}
        className={cx('flex flex-col gap-3 rounded-2xl bg-primary px-5 py-4 shadow-lg ring-2 ring-inset', !picked ? 'ring-secondary' : ok ? 'ring-mint-600' : 'ring-error')} data-current-card>
        <span className="text-lg font-semibold text-primary">{card.label}</span>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm font-semibold text-secondary">
          <span className="inline-flex items-center gap-1.5" aria-label={`${users} of 5 people`}>
            {Array.from({ length: 5 }, (_, k) => <UserIcon key={k} className={cx('size-5', k < users ? 'text-primary' : 'text-quaternary')} weight={k < users ? 'fill' : 'regular'} aria-hidden />)}
            <span className="ml-1 tabular-nums">{users} of 5</span>
          </span>
          <span className="rounded-full bg-secondary px-2.5 py-0.5">{IMPACT[impact]}</span>
        </div>
      </motion.div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {game.lanes.map(l => (
          <motion.button key={l.id} type="button" onClick={() => rate(l.id)} disabled={!!picked} whileTap={{ scale: 0.96 }}
            className={cx('flex flex-col items-start gap-1 rounded-2xl bg-primary px-3 py-3 text-left ring-2 ring-secondary ring-inset transition disabled:cursor-default',
              !picked && 'hover:bg-primary_hover', picked && l.id !== picked && l.id !== card.lane && 'opacity-40', picked && l.id === card.lane && 'ring-mint-600', picked === l.id && !ok && 'ring-error')}>
            <Pill sev={l.id as Severity} />
            <span className="text-xs leading-tight text-tertiary">{l.hint}</span>
          </motion.button>
        ))}
      </div>
      {picked && (
        <NibSays mood={ok ? 'cheer' : 'sad'}>
          <span className="inline-flex items-center gap-1 font-semibold">{ok ? <CheckIcon className="size-4" weight="bold" /> : <XIcon className="size-4" weight="bold" />}{SEV_STYLE[card.lane as Severity].name}.</span>{' '}{card.note}
        </NibSays>
      )}
      <div className="rounded-2xl bg-primary p-3 ring-1 ring-secondary ring-inset"><Grid cards={game.cards} rated={rated} zones={false} /></div>
      {picked && <div className="flex justify-end"><Button size="lg" onPress={() => setI(k => k + 1)}>{i + 1 < game.cards.length ? 'Next finding' : 'See the report'}</Button></div>}
    </div>
  );
}
