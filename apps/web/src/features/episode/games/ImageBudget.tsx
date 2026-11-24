'use client';
// Mini-game for ui.4-3: each card is a Hisaab screen (`visual`, its short name). Pick the image it needs: photo,
// illustration, icon or nothing. A small phone then draws the screen with the right kind (the scene's SlotArt), with
// your pick beside it in red if it differs, and a data meter adds up what the screens weigh so far (`pageWeight`)
// against a photo on every one. Scored on the pick; the end shows every screen and the two totals.
import { useState } from 'react';
import { motion } from 'motion/react';
import { CheckIcon, XIcon } from '@phosphor-icons/react/ssr';
import { pageWeight, type Episode, type ImageKind } from '@shape/content';
import { Button } from '@/components/base/buttons/button';
import { cx } from '@/utils/cx';
import { Burst, NibSays, StageTitle } from '../kit';
import { KIND_NAME, SlotArt } from '../scenes/ImageChoice';
import type { GameResult } from './DiamondSort';
import { play } from '@/lib/sound';

type Game = Episode['game'];
const subjectFor = (screen: string) => (screen === 'Stock' ? 'pack5' : 'counter');

function MiniPhone({ screen, kind, tone }: { screen: string; kind: ImageKind; tone: 'right' | 'wrong' }) {
  return (
    <figure className={cx('flex flex-col items-center gap-1 rounded-2xl bg-primary p-2 ring-2 ring-inset', tone === 'wrong' ? 'ring-error' : 'ring-mint-600')}>
      <svg viewBox="0 0 160 220" className="w-full max-w-40" role="img" aria-label={`${screen} screen with ${KIND_NAME[kind].toLowerCase()}`}>
        <rect x={1} y={1} width={158} height={218} rx={20} fill="var(--color-bg-primary)" stroke="var(--color-border-secondary)" strokeWidth={2} />
        <text x={14} y={30} fontSize={13} fontWeight={900} fill="var(--color-text-primary)">{screen}</text>
        <g transform="translate(14 42)"><SlotArt kind={kind} w={132} h={96} kb subject={subjectFor(screen)} cloud={screen === 'Welcome'} /></g>
        {[0, 1, 2].map(k => <rect key={k} x={14} y={164 + k * 14} width={k === 2 ? 70 : 120} height={7} rx={3.5} fill="var(--color-border-secondary)" />)}
      </svg>
      <figcaption className="text-xs font-semibold text-tertiary">{tone === 'wrong' ? 'Your pick' : 'What it needs'}</figcaption>
    </figure>
  );
}

function Meter({ picked, photo }: { picked: number; photo: number }) {
  const max = Math.max(photo, 1);
  return (
    <div className="flex flex-col gap-2 rounded-2xl bg-primary px-4 py-3 ring-1 ring-secondary ring-inset">
      {([['Your screens', picked, 'bg-mint-600'], ['A photo on every one', photo, 'bg-error-solid']] as const).map(([label, kb, bar]) => (
        <div key={label} className="flex flex-col gap-1">
          <div className="flex justify-between text-sm font-semibold"><span className="text-tertiary">{label}</span><span className="text-primary tabular-nums">{kb} kB</span></div>
          <div className="h-2.5 overflow-hidden rounded-full bg-secondary"><motion.div className={cx('h-full rounded-full', bar)} animate={{ width: `${(kb / max) * 100}%` }} /></div>
        </div>
      ))}
    </div>
  );
}

export function ImageBudget({ game, onDone }: { game: Game; onDone: (results: GameResult[]) => void }) {
  const [i, setI] = useState(0);
  const [picks, setPicks] = useState<Record<string, string>>({});
  const card = game.cards[i];
  const picked = card ? picks[card.id] : undefined;
  const answered = game.cards.filter(c => picks[c.id]);
  const weight = pageWeight(answered.map(c => picks[c.id])), photo = pageWeight(answered.map(() => 'photo'));

  const pick = (laneId: string) => {
    if (!card || picked) return;
    play(laneId === card.lane ? 'correct' : 'wrong');
    setPicks(p => ({ ...p, [card.id]: laneId }));
  };

  if (!card) {
    const right = game.cards.filter(c => picks[c.id] === c.lane).length;
    const best = pageWeight(game.cards.map(c => c.lane));
    return (
      <div className="relative flex flex-col items-center gap-5 py-6 text-center">
        <Burst count={36} />
        <StageTitle eyebrow="Every image has a job" title={`${right} of ${game.cards.length} screens right`}>
          Photos where people need the real thing, drawings for ideas, icons to label, and nothing where the numbers speak. The right set weighs {best} kB.
        </StageTitle>
        <div className="grid w-full grid-cols-2 gap-2 sm:grid-cols-4">
          {game.cards.map(c => (
            <svg key={c.id} viewBox="0 0 132 132" className="w-full rounded-xl bg-primary p-1 ring-1 ring-secondary ring-inset" role="img" aria-label={`${c.visual}: ${KIND_NAME[c.lane as ImageKind]}`}>
              <text x={4} y={14} fontSize={11} fontWeight={800} fill="var(--color-text-primary)">{c.visual}</text>
              <g transform="translate(4 22)"><SlotArt kind={c.lane as ImageKind} w={124} h={92} subject={subjectFor(c.visual ?? '')} cloud={c.visual === 'Welcome'} /></g>
            </svg>
          ))}
        </div>
        <div className="w-full"><Meter picked={weight} photo={photo} /></div>
        <NibSays mood={right === game.cards.length ? 'cheer' : 'idle'}>On a slow connection every photo is a wait. Keep the ones that show something real, and let words and numbers stand on their own.</NibSays>
        <Button size="xl" onPress={() => onDone(game.cards.map(c => ({ id: c.id, correct: picks[c.id] === c.lane })))}>Continue the story</Button>
      </div>
    );
  }

  const ok = picked === card.lane, owner = game.lanes.find(l => l.id === card.lane)!;
  return (
    <div className="flex flex-col gap-5">
      <StageTitle eyebrow="Play" title={game.title}>{game.instructions}</StageTitle>
      <div className="flex items-baseline justify-between">
        <span className="text-sm font-semibold text-tertiary">The screen</span>
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
        <>
          <div className={cx('grid gap-3', ok ? 'grid-cols-1 justify-items-center' : 'grid-cols-2')}>
            {!ok && <MiniPhone screen={card.visual ?? ''} kind={picked as ImageKind} tone="wrong" />}
            <MiniPhone screen={card.visual ?? ''} kind={card.lane as ImageKind} tone="right" />
          </div>
          <NibSays mood={ok ? 'cheer' : 'sad'}>
            <span className="inline-flex items-center gap-1 font-semibold">{ok ? <CheckIcon className="size-4" weight="bold" /> : <XIcon className="size-4" weight="bold" />}{owner.label}.</span>{' '}{card.note}
          </NibSays>
        </>
      )}
      <Meter picked={weight} photo={photo} />
      {picked && <div className="flex justify-end"><Button size="lg" onPress={() => setI(k => k + 1)}>{i + 1 < game.cards.length ? 'Next screen' : 'See every screen'}</Button></div>}
    </div>
  );
}
