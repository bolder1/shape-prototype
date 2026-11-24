'use client';
// Mini-game for ui.4-4: Hisaab's udhaar table as copied from a spreadsheet, drawn by the scene's Ledger. Each card rings
// one part (`visual`, one of LEDGER_PARTS). Pick the fix: align it, one format, make it stand out, or cut it. The part
// then redraws fixed, whatever was picked, and the note says how. Scored on the pick; the end shows the finished table
// beside the phone version, where each row is a card.
import { useState } from 'react';
import { motion } from 'motion/react';
import { CheckIcon, XIcon } from '@phosphor-icons/react/ssr';
import type { Episode, LedgerPart } from '@shape/content';
import { Button } from '@/components/base/buttons/button';
import { cx } from '@/utils/cx';
import { Burst, NibSays, StageTitle } from '../kit';
import { CARDS_H, CARDS_W, Ledger, LEDGER_H, LEDGER_W, LedgerCards } from '../scenes/TableTidy';
import type { GameResult } from './DiamondSort';
import { play } from '@/lib/sound';

type Game = Episode['game'];

function Table({ fixed, focus }: { fixed: Partial<Record<LedgerPart, number>>; focus?: LedgerPart }) {
  return (
    <svg viewBox={`-6 -6 ${LEDGER_W + 12} ${LEDGER_H + 12}`} className="w-full" role="img" aria-label={`Hisaab’s udhaar table${focus ? `, with the ${focus} part ringed` : ''}`}>
      <Ledger fixed={fixed} focus={focus} />
    </svg>
  );
}

export function TableBuild({ game, onDone }: { game: Game; onDone: (results: GameResult[]) => void }) {
  const [i, setI] = useState(0);
  const [picks, setPicks] = useState<Record<string, string>>({});
  const card = game.cards[i];
  const picked = card ? picks[card.id] : undefined;
  const fixed = Object.fromEntries(game.cards.filter(c => picks[c.id]).map(c => [c.visual, 1])) as Partial<Record<LedgerPart, number>>;

  const pick = (laneId: string) => {
    if (!card || picked) return;
    play(laneId === card.lane ? 'correct' : 'wrong');
    setPicks(p => ({ ...p, [card.id]: laneId }));
  };

  if (!card) {
    const right = game.cards.filter(c => picks[c.id] === c.lane).length;
    return (
      <div className="relative flex flex-col items-center gap-5 py-6 text-center">
        <Burst count={36} />
        <StageTitle eyebrow="Table built" title={`${right} of ${game.cards.length} fixes right`}>
          Numbers that line up, one format, less ink, and what matters said in words. On the phone, each row becomes a card.
        </StageTitle>
        <div className="grid w-full grid-cols-[1fr_auto] items-center gap-3 rounded-2xl bg-secondary p-3 sm:grid-cols-[2fr_1fr]">
          <Table fixed={fixed} />
          <svg viewBox={`-4 -4 ${CARDS_W + 8} ${CARDS_H + 8}`} className="mx-auto w-28 sm:w-full sm:max-w-44" role="img" aria-label="The udhaar list on a phone, one card per customer">
            <LedgerCards />
          </svg>
        </div>
        <NibSays mood={right === game.cards.length ? 'cheer' : 'idle'}>A table is for comparing. Every fix here makes one comparison faster: who owes most, who is late, what it all adds up to.</NibSays>
        <Button size="xl" onPress={() => onDone(game.cards.map(c => ({ id: c.id, correct: picks[c.id] === c.lane })))}>Continue the story</Button>
      </div>
    );
  }

  const ok = picked === card.lane, owner = game.lanes.find(l => l.id === card.lane)!;
  return (
    <div className="flex flex-col gap-5">
      <StageTitle eyebrow="Play" title={game.title}>{game.instructions}</StageTitle>
      <div className="rounded-2xl bg-secondary p-3"><Table fixed={fixed} focus={card.visual as LedgerPart} /></div>
      <div className="flex items-baseline justify-between">
        <span className="text-sm font-semibold text-tertiary">The ringed part</span>
        <span className="text-sm font-semibold text-tertiary tabular-nums">{i + 1} / {game.cards.length}</span>
      </div>
      <motion.div key={card.id} initial={{ y: -12, opacity: 0 }} animate={picked && !ok ? { x: [0, -10, 10, -6, 6, 0], opacity: 1, y: 0 } : { y: 0, opacity: 1 }} transition={{ duration: 0.4 }}
        className={cx('rounded-2xl bg-primary px-5 py-4 text-lg font-semibold text-primary shadow-lg ring-2 ring-inset', !picked ? 'ring-secondary' : ok ? 'ring-mint-600' : 'ring-error')} data-current-card>
        {card.label}
      </motion.div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {game.lanes.map(l => (
          <motion.button key={l.id} type="button" onClick={() => pick(l.id)} disabled={!!picked} whileTap={{ scale: 0.96 }}
            className={cx('flex flex-col items-start gap-1 rounded-2xl bg-primary px-3 py-3 text-left ring-2 ring-secondary ring-inset transition disabled:cursor-default',
              !picked && 'hover:bg-primary_hover', picked && l.id !== picked && l.id !== card.lane && 'opacity-40', picked && l.id === card.lane && 'ring-mint-600', picked === l.id && !ok && 'ring-error')}>
            <span className="text-sm font-bold text-primary">{l.label}</span>
            <span className="text-xs leading-tight text-tertiary">{l.hint}</span>
          </motion.button>
        ))}
      </div>
      {picked && (
        <NibSays mood={ok ? 'cheer' : 'sad'}>
          <span className="inline-flex items-center gap-1 font-semibold">{ok ? <CheckIcon className="size-4" weight="bold" /> : <XIcon className="size-4" weight="bold" />}{owner.label}.</span>{' '}{card.note}
        </NibSays>
      )}
      {picked && <div className="flex justify-end"><Button size="lg" onPress={() => setI(k => k + 1)}>{i + 1 < game.cards.length ? 'Next part' : 'See the table'}</Button></div>}
    </div>
  );
}
