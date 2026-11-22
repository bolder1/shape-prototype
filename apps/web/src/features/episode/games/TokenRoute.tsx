'use client';
// Mini-game for ui.3-3: each card is a message a toast shows. Pick error, success, warning or info and the toast takes
// that token's tint, icon and colour. A miss shows the right toast under yours. The end screen lays out one toast per
// meaning with a greyscale switch, to prove icons and words carry the meaning without colour. Scored on the first pick.
import { useState } from 'react';
import { motion } from 'motion/react';
import { ChatCircleIcon, CheckIcon, XIcon } from '@phosphor-icons/react/ssr';
import type { Episode } from '@shape/content';
import { springs } from '@shape/ui';
import { Button } from '@/components/base/buttons/button';
import { cx } from '@/utils/cx';
import { Burst, NibSays, StageTitle } from '../kit';
import { TOKENS } from '../scenes/SemanticColour';
import type { GameResult } from './DiamondSort';
import { play } from '@/lib/sound';

type Game = Episode['game'];
type Token = keyof typeof TOKENS;

function Toast({ text, token }: { text: string; token?: string }) {
  const tk = token ? TOKENS[token as Token] : null, Icon = tk?.icon ?? ChatCircleIcon;
  return (
    <motion.div layout transition={springs.pop}
      className="flex w-full max-w-md items-center gap-3 rounded-xl px-4 py-3 text-left shadow-sm transition-colors duration-300"
      style={{ background: tk?.tint ?? '#f1f5f9', border: `2px solid ${tk?.c ?? '#cbd5e1'}`, color: tk?.ink ?? '#334155' }}>
      <Icon className="size-6 shrink-0" weight="fill" style={{ color: tk?.solid ?? '#94a3b8' }} />
      <span className="text-md font-semibold">{text}</span>
    </motion.div>
  );
}

export function TokenRoute({ game, onDone }: { game: Game; onDone: (results: GameResult[]) => void }) {
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [results, setResults] = useState<Record<string, boolean>>({});
  const [grey, setGrey] = useState(false);
  const card = game.cards[i];
  const right = Object.values(results).filter(Boolean).length;

  const pick = (laneId: string) => {
    if (!card || picked) return;
    const ok = laneId === card.lane;
    play(ok ? 'correct' : 'wrong');
    setPicked(laneId);
    setResults(r => ({ ...r, [card.id]: ok }));
  };

  if (!card) {
    const sample = game.lanes.map(l => game.cards.find(c => c.lane === l.id)!);
    return (
      <div className="relative flex flex-col items-center gap-5 py-6 text-center">
        <Burst count={36} />
        <StageTitle eyebrow="Game over" title={`${right} of ${game.cards.length} messages coloured right`}>Now take the colour away.</StageTitle>
        <div className="flex w-full flex-col items-center gap-2 rounded-2xl bg-white p-5 transition-[filter] duration-500" style={{ filter: grey ? 'grayscale(1)' : 'none' }}>
          {sample.map(c => <Toast key={c.id} text={c.label} token={c.lane} />)}
        </div>
        <Button size="md" color="secondary" onPress={() => { play('flip'); setGrey(g => !g); }}>{grey ? 'Bring the colour back' : 'See it in greyscale'}</Button>
        <NibSays mood={right === game.cards.length ? 'cheer' : 'idle'}>{grey ? 'Still readable: every toast has its own icon and says what happened.' : 'About 1 in 12 men sees some colours differently. Try the greyscale switch.'}</NibSays>
        <Button size="xl" onPress={() => onDone(game.cards.map(c => ({ id: c.id, correct: !!results[c.id] })))}>Continue the story</Button>
      </div>
    );
  }

  const ok = picked === card.lane, owner = game.lanes.find(l => l.id === card.lane)!;
  return (
    <div className="flex flex-col gap-5">
      <StageTitle eyebrow="Play" title={game.title}>{game.instructions}</StageTitle>
      <div className="flex items-baseline justify-between">
        <span className="text-sm font-semibold text-tertiary">The message</span>
        <span className="text-sm font-semibold text-tertiary tabular-nums">{i + 1} / {game.cards.length}</span>
      </div>
      <motion.div animate={picked && !ok ? { x: [0, -10, 10, -6, 6, 0] } : { x: 0 }} transition={{ duration: 0.4 }}
        className={cx('flex min-h-32 flex-col items-center justify-center gap-3 rounded-2xl bg-white p-5 ring-2 ring-inset transition-colors', !picked ? 'ring-secondary' : ok ? 'ring-mint-600' : 'ring-error')}
        data-current-card>
        <Toast text={card.label} token={picked ?? undefined} />
        {picked && !ok && (
          <>
            <span className="text-xs font-bold text-[#047857]">Better as {owner.label.toLowerCase()}</span>
            <Toast text={card.label} token={card.lane} />
          </>
        )}
      </motion.div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {game.lanes.map(l => {
          const tk = TOKENS[l.id as Token], Icon = tk.icon;
          return (
            <motion.button key={l.id} type="button" onClick={() => pick(l.id)} disabled={!!picked} whileTap={{ scale: 0.96 }}
              className={cx('flex flex-col items-start gap-1 rounded-2xl px-3 py-3 text-left text-white transition disabled:cursor-default', picked && l.id !== picked && l.id !== card.lane && 'opacity-40',
                picked && l.id === card.lane && 'ring-4 ring-mint-400')}
              style={{ background: tk.solid }}>
              <span className="flex items-center gap-1.5 text-md font-bold"><Icon className="size-5" weight="fill" />{l.label}</span>
              <span className="text-xs font-medium opacity-90">{l.hint}</span>
            </motion.button>
          );
        })}
      </div>
      {picked && (
        <div className="flex flex-col gap-3">
          <NibSays mood={ok ? 'cheer' : 'sad'}>
            <span className="inline-flex items-center gap-1 font-semibold">{ok ? <CheckIcon className="size-4" weight="bold" /> : <XIcon className="size-4" weight="bold" />}{ok ? `Right: ${owner.label.toLowerCase()}.` : `That’s ${owner.label.toLowerCase()}.`}</span>{' '}
            {owner.hint}.
          </NibSays>
          <div className="flex justify-end"><Button size="lg" onPress={() => { setPicked(null); setI(n => n + 1); }}>{i + 1 < game.cards.length ? 'Next message' : 'See results'}</Button></div>
        </div>
      )}
    </div>
  );
}
