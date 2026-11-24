'use client';
// Mini-game for dc.2-3: trace Sana's contrast fix through Gaadi's code. Every card is a line that paints something
// green (its `visual`, a key of `GAADI_CODE`), shown as code with its platform. Say how it gets its colour
// (`REF_KINDS`): it follows the token, points at the palette, or has the value copied in (`refKind`). Each call
// shows that button before and after `TOKEN_CHANGE` (`renderedGreen`) with its contrast (`onGreen`), and a lint
// panel counts what it would flag (`lintFlags`). A miss explains and the card comes back later; first call scores.
import { useState } from 'react';
import { motion } from 'motion/react';
import { GAADI_CODE, GAADI_GREENS, TOKEN_CHANGE, TOKEN_PLATFORMS, lintFlags, onGreen, refKind, renderedGreen, type Episode, type GaadiCode, type GaadiGreen, type RefKind } from '@shape/content';
import { springs } from '@shape/ui';
import { Button } from '@/components/base/buttons/button';
import { cx } from '@/utils/cx';
import { Burst, NibSays, StageTitle } from '../kit';
import { PLATFORM_NAME, REF_TONE } from '../scenes/TokenPipeline';
import type { GameResult } from './DiamondSort';
import { play } from '@/lib/sound';

type Game = Episode['game'];

function Swatch({ g, label, caption }: { g: GaadiGreen; label: string; caption: string }) {
  const r = onGreen(g);
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs font-bold text-tertiary">{caption}</span>
      <div className="flex items-center gap-2">
        <span className="rounded-lg px-4 py-2 text-sm font-bold text-white" style={{ background: GAADI_GREENS[g] }}>{label}</span>
        <span className={cx('rounded-full px-2 py-0.5 text-xs font-bold tabular-nums', r >= 4.5 ? 'bg-success-primary text-success-primary' : 'bg-error-primary text-error-primary')}>{r.toFixed(1)}:1</span>
      </div>
    </div>
  );
}

function Lint({ traced }: { traced: GaadiCode[] }) {
  const flags = lintFlags(traced);
  return (
    <div className="flex flex-col gap-1.5 rounded-2xl bg-gray-900 p-4 font-mono text-xs text-gray-100" aria-live="polite">
      <span className="font-sans text-xs font-bold text-blue-300">token-lint · {flags.length} problem{flags.length === 1 ? '' : 's'}</span>
      {traced.length === 0 && <span className="text-gray-400">Lines you trace are checked here.</span>}
      {traced.map(k => {
        const kind = refKind(GAADI_CODE[k].code);
        return (
          <motion.span key={k} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-2">
            <span className={kind === 'follows' ? 'text-green-300' : 'text-red-300'}>{kind === 'follows' ? 'ok ' : 'err'}</span>
            <span className="truncate">{GAADI_CODE[k].platform}: {GAADI_CODE[k].code}</span>
          </motion.span>
        );
      })}
    </div>
  );
}

export function TokenTrace({ game, onDone }: { game: Game; onDone: (results: GameResult[]) => void }) {
  const [deck, setDeck] = useState(game.cards);
  const [results, setResults] = useState<Record<string, boolean>>({});
  const [traced, setTraced] = useState<GaadiCode[]>([]);
  const [miss, setMiss] = useState<string | null>(null);
  const [right, setRight] = useState(false);
  const card = deck[0];

  if (!card) {
    const n = Object.values(results).filter(Boolean).length;
    const fixed = traced.filter(k => renderedGreen(GAADI_CODE[k].code, true) === TOKEN_CHANGE.to).length;
    return (
      <div className="relative flex flex-col gap-5 py-6">
        <Burst count={36} />
        <StageTitle eyebrow="Fix traced" title={`${n} of ${game.cards.length} traced first time`}>
          {`${fixed} of ${traced.length} lines got the fix from one line in tokens.json. The other ${traced.length - fixed} need moving to a semantic token before the next change, or dark mode, can reach them.`}
        </StageTitle>
        <div className="grid gap-3 sm:grid-cols-3">
          {TOKEN_PLATFORMS.map(pl => (
            <div key={pl} className="flex flex-col gap-2 rounded-xl bg-secondary p-3">
              <span className="text-sm font-bold text-primary">{PLATFORM_NAME[pl]}</span>
              {traced.filter(k => GAADI_CODE[k].platform === pl).map(k => (
                <span key={k} className="flex items-center gap-2 text-xs font-semibold text-secondary">
                  <span className="size-3 rounded-sm" style={{ background: GAADI_GREENS[renderedGreen(GAADI_CODE[k].code, true)] }} aria-hidden />
                  {GAADI_CODE[k].where}<span className="sr-only">: {renderedGreen(GAADI_CODE[k].code, true)}</span>
                </span>
              ))}
            </div>
          ))}
        </div>
        <NibSays mood={n === game.cards.length ? 'cheer' : 'idle'}>Ask for the lint to run in code review, not once. It costs nothing to keep the codebase connected; reconnecting it later is a project.</NibSays>
        <Button size="xl" onPress={() => onDone(game.cards.map(c => ({ id: c.id, correct: !!results[c.id] })))}>Continue the story</Button>
      </div>
    );
  }

  const k = card.visual as GaadiCode;
  const line = GAADI_CODE[k];
  const kind = refKind(line.code);
  const owner = game.lanes.find(l => l.id === kind)!;
  const done = game.cards.length - deck.length;
  const call = (laneId: string) => {
    if (miss || right) return;
    const ok = laneId === kind;
    play(ok ? 'correct' : 'wrong');
    setResults(r => (card.id in r ? r : { ...r, [card.id]: ok }));
    if (ok) { setRight(true); setTraced(ts => [...ts, k]); }
    else { setMiss(laneId); setTimeout(() => { setMiss(null); setDeck(d => [...d.slice(1), d[0]]); }, 3200); }
  };
  const next = () => { setRight(false); setDeck(d => d.slice(1)); };
  const label = line.where.split(' ')[0];

  return (
    <div className="flex flex-col gap-5">
      <StageTitle eyebrow="Play" title={game.title}>{game.instructions}</StageTitle>
      <div className="grid gap-5 md:grid-cols-[1fr_minmax(0,20rem)]">
        <div className="flex flex-col gap-4">
          <div className="flex items-baseline justify-between">
            <span className="text-sm font-semibold text-tertiary">{PLATFORM_NAME[line.platform]} · {line.where}</span>
            <span className="text-sm font-semibold text-tertiary tabular-nums">{done} / {game.cards.length}</span>
          </div>
          <motion.div key={`${card.id}-${deck.length}`} initial={{ y: 24, opacity: 0 }} animate={miss ? { x: [0, -10, 10, -6, 6, 0], y: 0, opacity: 1 } : { y: 0, opacity: 1 }} transition={miss ? { duration: 0.4 } : springs.pop}
            className={cx('rounded-2xl bg-gray-900 p-5 shadow-lg ring-2 ring-inset', miss ? 'ring-error' : right ? 'ring-mint-600' : 'ring-transparent')} data-current-card aria-label={card.label}>
            <code className="block font-mono text-md break-words text-gray-100">{line.code}</code>
          </motion.div>
          <div className="grid gap-2 sm:grid-cols-3" role="group" aria-label="How it gets its colour">
            {game.lanes.map(l => (
              <motion.button key={l.id} type="button" onClick={() => call(l.id)} disabled={!!miss || right} whileTap={{ scale: 0.97 }}
                className={cx('flex flex-col items-start gap-0.5 rounded-xl border-2 bg-primary px-3 py-2.5 text-left transition enabled:hover:bg-primary_hover disabled:cursor-default',
                  right && l.id === kind ? 'border-mint-600' : miss === l.id ? 'border-error' : miss && l.id === kind ? 'border-mint-600' : 'border-secondary')}>
                <span className="flex items-center gap-1.5 text-md font-bold text-primary"><span className="size-2.5 rounded-full" style={{ background: REF_TONE[l.id as RefKind] }} aria-hidden />{l.label}</span>
                <span className="text-xs font-medium text-tertiary">{l.hint}</span>
              </motion.button>
            ))}
          </div>
          <div className="min-h-14" aria-live="polite">
            {miss && <NibSays mood="sad">Not quite: the answer is <strong>{owner.label.toLowerCase()}</strong>. {card.note} It’ll come back round.</NibSays>}
            {right && (
              <div className="flex flex-col gap-3">
                <div className="flex flex-wrap gap-6 rounded-xl bg-secondary p-4">
                  <Swatch g={renderedGreen(line.code, false)} label={label} caption="Before the release" />
                  <Swatch g={renderedGreen(line.code, true)} label={label} caption="After the release" />
                </div>
                <NibSays mood="cheer">{card.note}</NibSays>
                <div className="flex justify-end"><Button size="lg" onPress={next}>{deck.length > 1 ? 'Next line' : 'See every platform'}</Button></div>
              </div>
            )}
            {!miss && !right && <NibSays mood="think">{`Does this line name a job, like action-primary, a palette step, like green-600, or the colour itself? Only a job follows ${TOKEN_CHANGE.token}.`}</NibSays>}
          </div>
        </div>
        <Lint traced={traced} />
      </div>
    </div>
  );
}
