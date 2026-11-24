'use client';
// Mini-game for st.2-1: each card is a line from a draft of Galla's vision. Send it to the part of the story it tells
// (today, 2030, why us) or cut it. Kept lines are written onto a postcard from 2030 under their part; cut lines show the
// words `visionFlags` caught, struck through, with the rewrite (`note`) beneath. The line goes to its right place either
// way, and a miss is marked. Scored on the first call. The end is the whole postcard beside the lines that didn't make it.
import { useState } from 'react';
import { motion } from 'motion/react';
import { CheckIcon, ScissorsIcon, XIcon } from '@phosphor-icons/react/ssr';
import { VISION_PARTS, type Episode, type VisionPart } from '@shape/content';
import { Button } from '@/components/base/buttons/button';
import { cx } from '@/utils/cx';
import { Burst, NibSays, StageTitle } from '../kit';
import { GALLA, PART_FILL, PART_NAME, STORY_PARTS, splitByFlags } from '../scenes/VisionNarrative';
import type { GameResult } from './DiamondSort';
import { play } from '@/lib/sound';

type Game = Episode['game'];
type Card = Game['cards'][number];

/** A cut line, its caught words marked and struck. */
function Flagged({ text }: { text: string }) {
  return (
    <span>
      {splitByFlags(text).map((s, i) => s.flag
        ? <mark key={i} className="rounded px-0.5 line-through decoration-2" style={{ background: '#FEF0C7', color: '#1D2939', textDecorationColor: '#B42318' }}>{s.text}</mark>
        : <span key={i}>{s.text}</span>)}
    </span>
  );
}

/** The postcard from 2030 as built so far. */
function Card2030({ cards, fresh }: { cards: Card[]; fresh?: string }) {
  return (
    <section className="relative flex flex-col gap-3 rounded-2xl bg-primary p-4 text-left shadow-md ring-1 ring-inset ring-secondary" aria-label="Postcard from 2030">
      <div className="flex items-center justify-between">
        <span className="text-sm font-bold" style={{ color: GALLA }}>A postcard from Aminabad</span>
        <span className="rounded-md border-2 border-dashed px-2 py-1 text-xs font-bold" style={{ borderColor: GALLA, color: GALLA }}>2030</span>
      </div>
      {STORY_PARTS.map(part => {
        const lines = cards.filter(c => c.lane === part);
        return (
          <div key={part} className="flex flex-col gap-1">
            <span className="w-fit rounded-full px-2.5 py-0.5 text-xs font-bold text-white" style={{ background: PART_FILL[part] }}>{PART_NAME[part]}</span>
            {lines.length
              ? lines.map(c => (
                <motion.p key={c.id} initial={c.id === fresh ? { opacity: 0, y: 6 } : false} animate={{ opacity: 1, y: 0 }} className="text-sm text-primary">{c.label}</motion.p>
              ))
              : <p className="text-sm text-quaternary">…</p>}
          </div>
        );
      })}
    </section>
  );
}

export function VisionPostcard({ game, onDone }: { game: Game; onDone: (results: GameResult[]) => void }) {
  const [i, setI] = useState(0);
  const [calls, setCalls] = useState<Record<string, VisionPart>>({});
  const card = game.cards[i];
  const done = game.cards.slice(0, card ? i + (calls[card.id] ? 1 : 0) : game.cards.length);
  const kept = done.filter(c => c.lane !== 'cut');

  if (!card) {
    const right = game.cards.filter(c => calls[c.id] === c.lane).length;
    return (
      <div className="relative flex flex-col items-center gap-5 py-6 text-center">
        <Burst count={36} />
        <StageTitle eyebrow="Galla’s vision" title={`${right} of ${game.cards.length} lines called right`}>
          A person, a struggle, a future and a reason. Everything else went to the roadmap, the goals or the bin.
        </StageTitle>
        <div className="grid w-full gap-4 sm:grid-cols-[3fr_2fr]">
          <Card2030 cards={game.cards} />
          <section className="flex flex-col gap-2 rounded-2xl bg-secondary p-4 text-left" aria-label="Cut lines and their rewrites">
            <h2 className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary"><ScissorsIcon className="size-4" aria-hidden />Cut</h2>
            {game.cards.filter(c => c.lane === 'cut').map(c => (
              <div key={c.id} className="flex flex-col gap-1 rounded-xl bg-primary p-3">
                <p className="text-sm text-tertiary"><Flagged text={c.label} /></p>
                <p className="text-sm text-primary">{c.note}</p>
              </div>
            ))}
          </section>
        </div>
        <NibSays mood={right === game.cards.length ? 'cheer' : 'idle'}>Read it with a rival’s name instead of Galla’s. If it still works, it isn’t a vision yet. This one only works for Galla, because of Shabnam and the 40,000 ledgers.</NibSays>
        <Button size="xl" onPress={() => onDone(game.cards.map(c => ({ id: c.id, correct: calls[c.id] === c.lane })))}>Continue the story</Button>
      </div>
    );
  }

  const call = calls[card.id], ok = call === card.lane;
  const choose = (v: VisionPart) => { if (call) return; play(v === card.lane ? 'correct' : 'wrong'); setCalls(c => ({ ...c, [card.id]: v })); };
  const owner = game.lanes.find(l => l.id === card.lane)!;

  return (
    <div className="flex flex-col gap-5">
      <StageTitle eyebrow="Play" title={game.title}>{game.instructions}</StageTitle>
      <span className="self-end text-sm font-semibold text-tertiary tabular-nums">{i + 1} / {game.cards.length}</span>
      <motion.div key={card.id} initial={{ y: -12, opacity: 0 }} animate={call && !ok ? { x: [0, -10, 10, -6, 6, 0], opacity: 1, y: 0 } : { y: 0, opacity: 1 }} transition={{ duration: 0.4 }}
        className={cx('rounded-2xl bg-primary px-5 py-4 shadow-lg ring-2 ring-inset', !call ? 'ring-secondary' : ok ? 'ring-mint-600' : 'ring-error')} data-current-card>
        <p className="text-lg font-semibold text-primary">{call && card.lane === 'cut' ? <Flagged text={card.label} /> : `“${card.label}”`}</p>
      </motion.div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {VISION_PARTS.map(v => {
          const lane = game.lanes.find(l => l.id === v)!;
          return (
            <motion.button key={v} type="button" onClick={() => choose(v)} disabled={!!call} whileTap={{ scale: 0.97 }}
              className={cx('flex flex-col items-start gap-1 rounded-2xl bg-secondary p-3 text-left ring-2 ring-inset ring-transparent transition disabled:cursor-default',
                !call && 'hover:ring-brand', call && v === card.lane && 'ring-mint-600', call === v && !ok && 'ring-error')}>
              <span className="rounded-full px-2.5 py-0.5 text-xs font-bold text-white" style={{ background: PART_FILL[v] }}>{lane.label}</span>
              <span className="text-xs leading-tight text-tertiary">{lane.hint}</span>
            </motion.button>
          );
        })}
      </div>
      <Card2030 cards={kept} fresh={call && card.lane !== 'cut' ? card.id : undefined} />
      {call && (
        <>
          <NibSays mood={ok ? 'cheer' : 'sad'}>
            <span className="inline-flex items-center gap-1 font-semibold">{ok ? <CheckIcon className="size-4" weight="bold" /> : <XIcon className="size-4" weight="bold" />}{owner.label}</span>{' '}
            {card.note}
          </NibSays>
          <div className="flex justify-end"><Button size="lg" onPress={() => setI(n => n + 1)}>{i + 1 < game.cards.length ? 'Next line' : 'Read the postcard'}</Button></div>
        </>
      )}
    </div>
  );
}
