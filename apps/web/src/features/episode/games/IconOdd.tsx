'use client';
// Mini-game for ui.4-2: each card is a row of five Hisaab icons (`visual`, parsed by `iconRow`), drawn by the scene's
// IconRowArt with one icon broken: filled or heavier, smaller or bigger, a wrong picture ($, a mailbox), or missing its
// label. First tap the odd icon (a wrong tap rings yours red and the real one green), then say how it breaks the set.
// The row then redraws fixed. Scored only when both the tap and the reason are right.
import { useState } from 'react';
import { motion } from 'motion/react';
import { CheckIcon, XIcon } from '@phosphor-icons/react/ssr';
import { ICONS, iconRow, type Episode } from '@shape/content';
import { Button } from '@/components/base/buttons/button';
import { cx } from '@/utils/cx';
import { Burst, NibSays, StageTitle } from '../kit';
import { IconRowArt, ROW_H, ROW_W } from '../scenes/IconAudit';
import type { GameResult } from './DiamondSort';
import { play } from '@/lib/sound';

type Game = Episode['game'];
const OK = '#2BC08A', BAD = 'var(--color-fg-error-primary)';

export function IconOdd({ game, onDone }: { game: Game; onDone: (results: GameResult[]) => void }) {
  const [i, setI] = useState(0);
  const [taps, setTaps] = useState<Record<string, number>>({});
  const [whys, setWhys] = useState<Record<string, string>>({});
  const card = game.cards[i];
  const row = card ? iconRow(card.visual ?? '') : undefined;
  const tapped = card ? taps[card.id] : undefined, why = card ? whys[card.id] : undefined;
  const score = (c: Game['cards'][number]) => taps[c.id] === iconRow(c.visual ?? '').odd && whys[c.id] === c.lane;

  const tap = (k: number) => {
    if (!card || !row || tapped !== undefined) return;
    play(k === row.odd ? 'correct' : 'wrong');
    setTaps(t => ({ ...t, [card.id]: k }));
  };
  const name = (laneId: string) => {
    if (!card || why) return;
    play(laneId === card.lane ? 'correct' : 'wrong');
    setWhys(w => ({ ...w, [card.id]: laneId }));
  };

  if (!card || !row) {
    const right = game.cards.filter(score).length;
    return (
      <div className="relative flex flex-col items-center gap-5 py-6 text-center">
        <Burst count={36} />
        <StageTitle eyebrow="One family" title={`${right} of ${game.cards.length} rows fixed first time`}>
          Every icon on the same grid, with the same stroke, from pictures Hisaab’s users already know, and a word where the picture isn’t enough.
        </StageTitle>
        <div className="grid w-full gap-2">
          {game.cards.map(c => {
            const r = iconRow(c.visual ?? '');
            return (
              <svg key={c.id} viewBox={`-4 -4 ${ROW_W + 8} ${ROW_H + 8}`} className="mx-auto w-full max-w-md" role="img" aria-label={`${c.label}, fixed`}>
                <IconRowArt icons={r.icons} odd={r.odd} flaw={r.flaw} lane={c.lane} fixed />
              </svg>
            );
          })}
        </div>
        <NibSays mood={right === game.cards.length ? 'cheer' : 'idle'}>An icon is a word people have to guess. Make the guesses easy, and write the word when it isn’t.</NibSays>
        <Button size="xl" onPress={() => onDone(game.cards.map(c => ({ id: c.id, correct: score(c) })))}>Continue the story</Button>
      </div>
    );
  }

  const hitOdd = tapped === row.odd, ok = hitOdd && why === card.lane, owner = game.lanes.find(l => l.id === card.lane)!;
  return (
    <div className="flex flex-col gap-5">
      <StageTitle eyebrow="Play" title={game.title}>{game.instructions}</StageTitle>
      <div className="flex items-baseline justify-between">
        <span className="text-sm font-semibold text-tertiary">{card.label}</span>
        <span className="text-sm font-semibold text-tertiary tabular-nums">{i + 1} / {game.cards.length}</span>
      </div>
      <motion.div key={card.id} initial={{ y: -12, opacity: 0 }} animate={why && !ok ? { x: [0, -10, 10, -6, 6, 0], opacity: 1, y: 0 } : { y: 0, opacity: 1 }} transition={{ duration: 0.4 }}
        className="relative mx-auto w-full max-w-xl" data-current-card>
        <svg viewBox={`-4 -4 ${ROW_W + 8} ${ROW_H + 8}`} className="w-full" role="img" aria-label={`${card.label}: five icons${why ? ', fixed' : ''}`}>
          <IconRowArt icons={row.icons} odd={row.odd} flaw={row.flaw} lane={card.lane} fixed={!!why}
            ring={tapped === undefined ? undefined : row.odd} ringTone={OK} />
          {tapped !== undefined && !hitOdd && <rect x={tapped * 80 + 6} y={8} width={68} height={72} rx={16} fill="none" stroke={BAD} strokeWidth={3} />}
        </svg>
        <div className="absolute inset-x-[1%] inset-y-[4%] grid grid-cols-5">
          {row.icons.map((n, k) => (
            <button key={k} type="button" onClick={() => tap(k)} disabled={tapped !== undefined} aria-label={`Icon ${k + 1}${k === row.odd && card.lane === 'label' ? '' : `: ${ICONS[n]}`}`}
              className="rounded-2xl transition hover:ring-2 hover:ring-secondary hover:ring-inset focus-visible:outline-2 focus-visible:outline-brand disabled:cursor-default disabled:hover:ring-0" />
          ))}
        </div>
      </motion.div>
      {tapped === undefined && <p className="text-center text-sm font-semibold text-tertiary">Tap the icon that breaks the set.</p>}
      {tapped !== undefined && (
        <>
          <p className={cx('text-center text-sm font-semibold', hitOdd ? 'text-primary' : 'text-error-primary')}>{hitOdd ? 'That’s the one. How does it break the set?' : 'Not that one: it’s the one ringed in green. How does it break the set?'}</p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {game.lanes.map(l => (
              <motion.button key={l.id} type="button" onClick={() => name(l.id)} disabled={!!why} whileTap={{ scale: 0.96 }}
                className={cx('flex flex-col items-start gap-1 rounded-2xl bg-primary px-3 py-3 text-left ring-2 ring-secondary ring-inset transition disabled:cursor-default',
                  !why && 'hover:bg-primary_hover', why && l.id !== why && l.id !== card.lane && 'opacity-40', why && l.id === card.lane && 'ring-mint-600', why === l.id && l.id !== card.lane && 'ring-error')}>
                <span className="text-sm font-bold text-primary">{l.label}</span>
                <span className="text-xs leading-tight text-tertiary">{l.hint}</span>
              </motion.button>
            ))}
          </div>
        </>
      )}
      {why && (
        <NibSays mood={ok ? 'cheer' : 'sad'}>
          <span className="inline-flex items-center gap-1 font-semibold">{ok ? <CheckIcon className="size-4" weight="bold" /> : <XIcon className="size-4" weight="bold" />}{owner.label}.</span>{' '}{card.note}
        </NibSays>
      )}
      {why && <div className="flex justify-end"><Button size="lg" onPress={() => setI(k => k + 1)}>{i + 1 < game.cards.length ? 'Next row' : 'See every row'}</Button></div>}
    </div>
  );
}
