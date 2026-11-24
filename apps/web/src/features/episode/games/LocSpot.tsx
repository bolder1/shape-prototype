'use client';
// Mini-game for cw.2-3: every string on Chaabi's rent screen, each in a box as wide as the characters it holds (its
// `visual`, "chars|piece|piece…"). Flip on the pseudo-locale preview and every string turns accented and padded to
// `roomFor` its length: boxes that can't grow clip in red, and strings joined in code show their seams as separate
// brackets. Tap a string, then call it: ready, built from pieces, idiom, or no room to grow. Scored on the first call.
// The end groups every string by verdict, with its fix.
import { useState } from 'react';
import { motion } from 'motion/react';
import { CheckIcon, TranslateIcon, XIcon } from '@phosphor-icons/react/ssr';
import { locParse, pseudoLocalize, roomFor, type Episode, type LocLane } from '@shape/content';
import { Button } from '@/components/base/buttons/button';
import { cx } from '@/utils/cx';
import { Burst, NibSays, StageTitle } from '../kit';
import type { GameResult } from './DiamondSort';
import { play } from '@/lib/sound';

type Game = Episode['game'];
type Card = Game['cards'][number];

/** What a string shows: English, or the pseudo-locale with each joined piece bracketed on its own. */
const showText = (c: Card, pseudo: boolean) => {
  const { parts, text } = locParse(c.visual ?? '');
  return pseudo ? parts.map(pseudoLocalize).join('') : text;
};
const clipsIn = (c: Card) => { const { chars, text } = locParse(c.visual ?? ''); return roomFor(text.length) > chars; };

function StringBox({ c, pseudo }: { c: Card; pseudo: boolean }) {
  const { chars } = locParse(c.visual ?? '');
  const clip = pseudo && clipsIn(c);
  return (
    <span className={cx('block max-w-full overflow-hidden whitespace-nowrap rounded-md bg-secondary px-1.5 py-1 font-mono text-sm text-primary ring-2 ring-inset',
      clip ? 'ring-error' : 'ring-transparent')} style={{ width: `${chars + 2}ch` }}>
      {showText(c, pseudo)}
    </span>
  );
}

export function LocSpot({ game, onDone }: { game: Game; onDone: (results: GameResult[]) => void }) {
  const [pseudo, setPseudo] = useState(false);
  const [sel, setSel] = useState<string | null>(null);
  const [calls, setCalls] = useState<Record<string, LocLane>>({});
  const [last, setLast] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const decided = Object.keys(calls).length;

  if (done) {
    const right = game.cards.filter(c => calls[c.id] === c.lane).length;
    return (
      <div className="relative flex flex-col items-center gap-5 py-6 text-center">
        <Burst count={36} />
        <StageTitle eyebrow="Ready for Bengali and Hindi" title={`${right} of ${game.cards.length} strings called right`}>
          A pseudo-locale build catches the joined pieces and the boxes that can’t grow. Idioms need a person to read them.
        </StageTitle>
        <div className="grid w-full gap-3 text-left sm:grid-cols-2">
          {game.lanes.map(l => (
            <section key={l.id} className="flex flex-col gap-2 rounded-2xl bg-secondary p-3">
              <h2 className={cx('text-sm font-semibold', l.id === 'ready' ? 'text-primary' : 'text-error-primary')}>{l.label}</h2>
              {game.cards.filter(c => c.lane === l.id).map(c => (
                <figure key={c.id} className={cx('flex flex-col gap-1 rounded-xl bg-primary p-3 ring-1 ring-inset', calls[c.id] === c.lane ? 'ring-secondary' : 'ring-error')}>
                  <span className="font-mono text-sm font-semibold text-primary">{c.label}</span>
                  <figcaption className="text-xs text-tertiary">{c.note}</figcaption>
                </figure>
              ))}
            </section>
          ))}
        </div>
        <NibSays mood={right === game.cards.length ? 'cheer' : 'idle'}>Whole sentences with placeholders, plain meaning instead of idioms, and boxes that grow. Fix them in English once, and they’re fixed in every language.</NibSays>
        <Button size="xl" onPress={() => onDone(game.cards.map(c => ({ id: c.id, correct: calls[c.id] === c.lane })))}>Continue the story</Button>
      </div>
    );
  }

  const current = game.cards.find(c => c.id === sel);
  const lastCard = game.cards.find(c => c.id === last);
  const call = (lane: LocLane) => {
    if (!current || calls[current.id]) return;
    play(lane === current.lane ? 'correct' : 'wrong');
    setCalls(cs => ({ ...cs, [current.id]: lane }));
    setLast(current.id);
    setSel(null);
  };

  return (
    <div className="flex flex-col gap-5">
      <StageTitle eyebrow="Play" title={game.title}>{game.instructions}</StageTitle>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button size="md" color={pseudo ? 'primary' : 'secondary'} iconLeading={<TranslateIcon data-icon weight="bold" />} aria-pressed={pseudo} onPress={() => setPseudo(v => !v)}>
          Pseudo-locale {pseudo ? 'on' : 'off'}
        </Button>
        <span className="text-sm font-semibold text-tertiary tabular-nums">{decided} / {game.cards.length} called</span>
      </div>
      <ul className="flex flex-col gap-2 rounded-3xl bg-primary p-4 shadow-lg ring-1 ring-secondary ring-inset" aria-label="Strings on Chaabi’s rent screen">
        {game.cards.map(c => {
          const mine = calls[c.id], lane = game.lanes.find(l => l.id === c.lane)!;
          return (
            <li key={c.id}>
              <motion.button type="button" onClick={() => !mine && setSel(c.id)} disabled={!!mine} aria-pressed={sel === c.id} whileTap={{ scale: 0.98 }}
                animate={mine && mine !== c.lane && last === c.id ? { x: [0, -8, 8, -4, 4, 0] } : { x: 0 }} transition={{ duration: 0.4 }}
                aria-label={`${c.label}${mine ? `. ${lane.label}` : ''}`}
                className={cx('flex w-full flex-wrap items-center justify-between gap-2 rounded-xl p-2 text-left ring-2 ring-inset transition disabled:cursor-default',
                  sel === c.id ? 'ring-brand' : 'ring-transparent', !mine && 'hover:bg-primary_hover', mine && (mine === c.lane ? 'bg-secondary' : 'bg-error-primary'))}>
                <StringBox c={c} pseudo={pseudo} />
                {mine && (
                  <span className={cx('inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-bold', mine === c.lane ? 'text-primary' : 'text-error-primary')}>
                    {mine === c.lane ? <CheckIcon className="size-3.5" weight="bold" /> : <XIcon className="size-3.5" weight="bold" />}{lane.label}
                  </span>
                )}
              </motion.button>
            </li>
          );
        })}
      </ul>
      {current && (
        <div className="flex flex-col gap-2">
          <span className="text-sm font-semibold text-primary">“{current.label}” is…</span>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {game.lanes.map(l => (
              <motion.button key={l.id} type="button" onClick={() => call(l.id as LocLane)} whileTap={{ scale: 0.96 }}
                className="flex flex-col items-start gap-1 rounded-2xl bg-primary px-3 py-3 text-left ring-2 ring-secondary ring-inset transition hover:bg-primary_hover">
                <span className="text-sm font-bold text-primary">{l.label}</span>
                <span className="text-xs leading-tight text-tertiary">{l.hint}</span>
              </motion.button>
            ))}
          </div>
        </div>
      )}
      {!current && lastCard && (
        <NibSays mood={calls[lastCard.id] === lastCard.lane ? 'cheer' : 'sad'}>
          <span className="font-semibold">{game.lanes.find(l => l.id === lastCard.lane)!.label}.</span>{' '}{lastCard.note}
        </NibSays>
      )}
      {!current && !lastCard && <NibSays mood="think">Tap a string to call it. Try the pseudo-locale preview first: it shows what a machine can catch.</NibSays>}
      {decided === game.cards.length && <div className="flex justify-end"><Button size="lg" onPress={() => setDone(true)}>See the verdicts</Button></div>}
    </div>
  );
}
