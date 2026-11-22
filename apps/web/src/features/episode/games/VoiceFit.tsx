'use client';
// Mini-game for br.1-2. First forge Sukoon's positioning statement from tiles (game.rounds). Then each card is a line of
// copy or a design choice, shown inside a Sukoon screen: on brand (calm, warm, expert) or off? Every card's `note`
// explains. Scored on the first pick.
import { useState } from 'react';
import { motion } from 'motion/react';
import { CheckIcon, XIcon } from '@phosphor-icons/react/ssr';
import type { Episode } from '@shape/content';
import { Button } from '@/components/base/buttons/button';
import { cx } from '@/utils/cx';
import { Burst, NibSays, StageTitle } from '../kit';
import { Forge } from './ProtoScope';
import type { GameResult } from './DiamondSort';
import { play } from '@/lib/sound';

type Game = Episode['game'];

export function VoiceFit({ game, onDone }: { game: Game; onDone: (results: GameResult[]) => void }) {
  const round = game.rounds?.[0];
  const [forged, setForged] = useState<GameResult | null>(null);
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [results, setResults] = useState<Record<string, boolean>>({});
  const card = game.cards[i];
  const right = Object.values(results).filter(Boolean).length;

  if (round && !forged) {
    return (
      <div className="flex flex-col gap-5">
        <StageTitle eyebrow="Play · forge" title={game.title}>{game.instructions}</StageTitle>
        <Forge round={round} onDone={ok => setForged({ id: round.id, correct: ok })} next="Check the voice"
          win="Audience, need, benefit and the alternative it beats. That’s a position." lose="Close. “For everyone” and “innovative” could describe any app, so they position nothing." />
      </div>
    );
  }

  const pick = (laneId: string) => {
    if (!card || picked) return;
    const ok = laneId === card.lane;
    play(ok ? 'correct' : 'wrong');
    setPicked(laneId);
    setResults(r => ({ ...r, [card.id]: ok }));
  };

  if (!card) {
    return (
      <div className="relative flex flex-col items-center gap-5 py-6 text-center">
        <Burst count={36} />
        <StageTitle eyebrow="Game over" title={`${right} of ${game.cards.length} judged right`}>Calm, warm, expert: in words, colour and motion.</StageTitle>
        <NibSays mood={right === game.cards.length ? 'cheer' : 'idle'}>Personality isn’t only copy. A palette or a bounce can be off brand too.</NibSays>
        <Button size="xl" onPress={() => onDone([...(forged ? [forged] : []), ...game.cards.map(c => ({ id: c.id, correct: !!results[c.id] }))])}>Continue the story</Button>
      </div>
    );
  }

  const ok = picked === card.lane;
  return (
    <div className="flex flex-col gap-5">
      <StageTitle eyebrow="Play · judge" title={game.title}>On brand for Sukoon (calm, warm, expert), or off?</StageTitle>
      <div className="flex items-baseline justify-between">
        <span className="text-sm font-semibold text-tertiary">In the Sukoon app</span>
        <span className="text-sm font-semibold text-tertiary tabular-nums">{i + 1} / {game.cards.length}</span>
      </div>
      <motion.div animate={picked && !ok ? { x: [0, -10, 10, -6, 6, 0] } : { x: 0 }} transition={{ duration: 0.4 }}
        className={cx('mx-auto flex min-h-40 w-full max-w-sm flex-col justify-center gap-3 rounded-3xl bg-[#fdf6ec] p-6 text-center ring-2 ring-inset', !picked ? 'ring-[#e9d5b7]' : ok ? 'ring-mint-600' : 'ring-error')}
        data-current-card>
        <span className="text-xs font-bold tracking-wide text-[#a68a6d] uppercase">Sukoon</span>
        <span className="text-lg font-semibold text-[#3f3328]">{card.label}</span>
      </motion.div>
      <div className="grid grid-cols-2 gap-3">
        {game.lanes.map(l => (
          <motion.button key={l.id} type="button" onClick={() => pick(l.id)} disabled={!!picked} whileTap={{ scale: 0.96 }}
            className={cx('flex items-center justify-center gap-2 rounded-2xl px-4 py-4 text-lg font-bold text-white transition disabled:cursor-default',
              l.id === 'on' ? 'bg-mint-700' : 'bg-error-solid', picked && l.id !== picked && l.id !== card.lane && 'opacity-40', picked && l.id === card.lane && 'ring-4 ring-mint-300')}>
            {l.id === 'on' ? <CheckIcon className="size-5" weight="bold" /> : <XIcon className="size-5" weight="bold" />}{l.label}
          </motion.button>
        ))}
      </div>
      {picked && (
        <div className="flex flex-col gap-3">
          <NibSays mood={ok ? 'cheer' : 'sad'}><span className="font-semibold">{card.lane === 'on' ? 'On brand.' : 'Off brand.'}</span> {card.note}</NibSays>
          <div className="flex justify-end"><Button size="lg" onPress={() => { setPicked(null); setI(n => n + 1); }}>{i + 1 < game.cards.length ? 'Next' : 'See results'}</Button></div>
        </div>
      )}
    </div>
  );
}
