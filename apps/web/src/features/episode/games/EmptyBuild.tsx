'use client';
// Mini-game for gr.2-2: build Kaksha's empty Batches screen one part at a time (`EMPTY_SLOTS`). Each part offers its
// three candidate pieces from `EMPTY_PIECES` (the cards in that lane); pick the one `emptyFlaw` passes. A flawed pick
// shakes, names the flaw and its note, and you pick again; the right one drops into the phone preview, which grows
// part by part, and the tap counter adds the piece's taps (`firstValueTaps`). The right piece scores if it's the first
// pick for its part; a flawed piece scores if you never fell for it. The end is the finished screen and its taps.
import { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { EMPTY_PIECES, EMPTY_SLOTS, emptyFlaw, firstValueTaps, type EmptyFlaw, type EmptyPiece, type EmptyPieceId, type EmptySlot, type Episode } from '@shape/content';
import { springs } from '@shape/ui';
import { Button } from '@/components/base/buttons/button';
import { cx } from '@/utils/cx';
import { Burst, NibSays, StageTitle } from '../kit';
import { KAKSHA, KAKSHA_SOFT } from '../scenes/JustInTime';
import type { GameResult } from './DiamondSort';
import { play } from '@/lib/sound';

type Game = Episode['game'];
type Card = Game['cards'][number];
const pieceOf = (c: Card) => EMPTY_PIECES[c.visual as EmptyPieceId] as EmptyPiece;
const FLAW: Record<EmptyFlaw, string> = {
  'about-app': 'About the app, not her batches', vague: 'Doesn’t say what goes here or what to do', unmarked: 'Fake data, not marked as a sample',
  effort: 'Too much typing before anything works', 'dead-end': 'No way forward from here', competing: 'Too many equal choices',
  zeros: 'Zeros look like failure', 'pushes-down': 'Pushes the action off the screen',
};

/** The empty Batches screen as built so far. */
function Phone({ chosen }: { chosen: Partial<Record<EmptySlot, EmptyPiece>> }) {
  const { message, starter, action, preview } = chosen;
  return (
    <div className="mx-auto w-56 shrink-0 overflow-hidden rounded-[2rem] border-8 border-gray-900 bg-white text-left shadow-lg" aria-label="Preview of the empty Batches screen">
      <div className="px-4 py-3 text-center text-sm font-bold text-white" style={{ background: KAKSHA }}>Batches</div>
      <div className="flex min-h-80 flex-col gap-3 p-3">
        {message ? <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs font-semibold text-gray-900">{message.text}</motion.p>
          : <div className="h-10 rounded-lg border-2 border-dashed border-gray-300" />}
        {starter ? <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-lg px-2.5 py-2 text-[11px] font-semibold" style={{ background: KAKSHA_SOFT, color: KAKSHA }}>{starter.text}</motion.div>
          : <div className="h-9 rounded-lg border-2 border-dashed border-gray-300" />}
        {action ? <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="rounded-full px-3 py-2 text-center text-xs font-bold text-white" style={{ background: KAKSHA }}>Create a batch</motion.div>
          : <div className="h-8 rounded-full border-2 border-dashed border-gray-300" />}
        {preview ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative rounded-xl border border-gray-300 bg-gray-50 p-2.5 opacity-70">
            <span className="absolute top-2 right-2 rounded-full bg-gray-900 px-2 py-0.5 text-[10px] font-bold text-white">Example</span>
            <p className="text-xs font-bold text-gray-900">Class 10 Maths</p>
            <p className="text-[11px] text-gray-600">Mon Wed Fri · 5 pm</p>
            <p className="text-[11px] text-gray-600">8 students</p>
          </motion.div>
        ) : <div className="h-20 rounded-xl border-2 border-dashed border-gray-300" />}
      </div>
    </div>
  );
}

export function EmptyBuild({ game, onDone }: { game: Game; onDone: (results: GameResult[]) => void }) {
  const [step, setStep] = useState(0);
  const [fell, setFell] = useState<string[]>([]);
  const [chosen, setChosen] = useState<Partial<Record<EmptySlot, EmptyPiece>>>({});
  const [miss, setMiss] = useState<Card | null>(null);
  const [lastRight, setLastRight] = useState<Card | null>(null);
  const slot = EMPTY_SLOTS[step];
  // A fixed shuffle per slot, so the good piece isn't always in the same place.
  const options = useMemo(() => {
    if (!slot) return [];
    const cs = game.cards.filter(c => c.lane === slot);
    return cs.map((c, i) => ({ c, k: (i + step) % cs.length })).sort((a, b) => a.k - b.k).map(x => x.c);
  }, [game.cards, slot, step]);
  const taps = firstValueTaps(Object.values(chosen));

  const pick = (c: Card) => {
    if (miss) return;
    const flaw = emptyFlaw(pieceOf(c));
    play(flaw ? 'wrong' : 'correct');
    if (flaw) { setFell(f => [...f, c.id]); setMiss(c); setLastRight(null); setTimeout(() => setMiss(null), 2400); return; }
    setChosen(x => ({ ...x, [slot]: pieceOf(c) }));
    setLastRight(c);
    setStep(s => s + 1);
  };

  const results = (): GameResult[] => game.cards.map(c => {
    const good = emptyFlaw(pieceOf(c)) === null;
    const slotFell = game.cards.some(o => o.lane === c.lane && fell.includes(o.id));
    return { id: c.id, correct: good ? !slotFell : !fell.includes(c.id) };
  });

  if (!slot) {
    const right = results().filter(r => r.correct).length;
    return (
      <div className="relative flex flex-col items-center gap-5 py-6 text-center">
        <Burst count={36} />
        <StageTitle eyebrow="Kaksha’s empty Batches screen" title={`${right} of ${game.cards.length} pieces judged right`}>
          {`${taps} taps from an empty screen to a first batch with students in it. The old screen needed the menu, a form and an evening.`}
        </StageTitle>
        <Phone chosen={chosen} />
        <NibSays mood={fell.length === 0 ? 'cheer' : 'idle'}>Open your own product on a fresh account and count the taps from each empty screen to its first real content. Then make the first step cheaper.</NibSays>
        <Button size="xl" onPress={() => onDone(results())}>Continue the story</Button>
      </div>
    );
  }

  const lane = game.lanes.find(l => l.id === slot)!;
  const flaw = miss ? emptyFlaw(pieceOf(miss)) : null;
  return (
    <div className="flex flex-col gap-5">
      <StageTitle eyebrow="Play" title={game.title}>{game.instructions}</StageTitle>
      <div className="flex items-baseline justify-between">
        <span className="text-sm font-semibold text-tertiary">Part {step + 1} of {EMPTY_SLOTS.length}: {lane.label} · {lane.hint.toLowerCase()}</span>
        <span className="text-sm font-semibold text-tertiary tabular-nums">{taps} taps so far</span>
      </div>
      <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-start">
        <Phone chosen={chosen} />
        <div className="flex w-full flex-col gap-2" role="group" aria-label={`Pieces for the ${lane.label.toLowerCase()}`}>
          {options.map(c => {
            const tried = fell.includes(c.id);
            return (
              <motion.button key={c.id} type="button" onClick={() => pick(c)} disabled={!!miss || tried} whileTap={{ scale: 0.98 }}
                animate={miss?.id === c.id ? { x: [0, -8, 8, -4, 4, 0] } : { x: 0 }} transition={miss?.id === c.id ? { duration: 0.4 } : springs.pop}
                className={cx('rounded-2xl border-2 bg-primary p-3 text-left text-sm font-medium text-primary transition enabled:hover:bg-primary_hover disabled:cursor-default',
                  miss?.id === c.id ? 'border-error' : tried ? 'border-secondary line-through opacity-60' : 'border-secondary')}>
                {c.label}
                {tried && <span className="mt-1 block text-xs font-semibold text-error-primary no-underline">{FLAW[emptyFlaw(pieceOf(c))!]}</span>}
              </motion.button>
            );
          })}
        </div>
      </div>
      <div className="min-h-14" aria-live="polite">
        {miss && flaw
          ? <NibSays mood="sad"><strong>{FLAW[flaw]}.</strong> {miss.note} Pick again.</NibSays>
          : lastRight && <NibSays mood="cheer">{lastRight.note}</NibSays>}
      </div>
    </div>
  );
}
