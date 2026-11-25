'use client';
// Mini-game for ax.3-2: crit a draft of Revathi's persona. Every card is a line from the draft (its `visual`, a key of
// `HAZRI_LINES`), shown with the research behind it (`evidence` of `PERSONA_SESSIONS`). Keep it, or name its worst
// problem: a stereotype, no evidence, or a label instead of a need (`PERSONA_FLAWS`, scored by `personaFlaw`). Right
// calls rebuild her card beside the deck: kept lines go in as they are, flawed ones as their `rewrite`, or are cut.
// First call scores; a missed card comes back later.
import { useState } from 'react';
import { motion } from 'motion/react';
import { HAZRI_LINES, PERSONA_SESSIONS, REVATHI, personaFlaw, type Episode, type HazriLine, type PersonaFlaw, type PersonaLine } from '@shape/content';
import { springs } from '@shape/ui';
import { Button } from '@/components/base/buttons/button';
import { cx } from '@/utils/cx';
import { Burst, NibSays, StageTitle } from '../kit';
import { VERDICT_FILL } from '../scenes/PersonaRewrite';
import type { GameResult } from './DiamondSort';
import { play } from '@/lib/sound';

type Game = Episode['game'];
const LABEL: Record<PersonaFlaw, string> = { keep: 'Keep', stereotype: 'Stereotype', unfounded: 'No evidence', diagnosis: 'Label' };
const PART_LABEL: Record<PersonaLine['part'], string> = { context: 'Context', setup: 'Setup', barrier: 'Barriers' };
const PARTS = ['context', 'setup', 'barrier'] as const;

/** What a decided line puts on the card: the line, its rewrite, or nothing. */
const onCard = (l: PersonaLine) => (personaFlaw(l) === 'keep' ? l.text : l.rewrite ?? null);

export function PersonaCrit({ game, onDone }: { game: Game; onDone: (results: GameResult[]) => void }) {
  const [deck, setDeck] = useState(game.cards);
  const [results, setResults] = useState<Record<string, boolean>>({});
  const [called, setCalled] = useState<HazriLine[]>([]);
  const [miss, setMiss] = useState<PersonaFlaw | null>(null);
  const [right, setRight] = useState(false);
  const card = deck[0];
  const cut = called.filter(k => onCard(HAZRI_LINES[k]) === null).length;

  const persona = (
    <div className="flex flex-col gap-3 rounded-2xl bg-secondary p-3">
      <div className="flex items-center gap-3 rounded-xl bg-primary px-3 py-2.5">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-secondary text-md font-bold text-primary" aria-hidden>R</span>
        <span className="flex min-w-0 flex-col">
          <span className="text-md font-bold text-primary">{REVATHI.name}, {REVATHI.age}</span>
          <span className="text-sm text-tertiary">{REVATHI.role}</span>
        </span>
      </div>
      {PARTS.map(part => {
        const rows = called.filter(k => HAZRI_LINES[k].part === part && onCard(HAZRI_LINES[k]) !== null);
        return (
          <div key={part} className="flex flex-col gap-1.5">
            <span className="text-xs font-bold tracking-wide text-tertiary uppercase">{PART_LABEL[part]}</span>
            {rows.length === 0 && <span className="text-sm text-quaternary">Nothing decided yet</span>}
            {rows.map(k => {
              const l = HAZRI_LINES[k];
              const kept = personaFlaw(l) === 'keep';
              return (
                <motion.span key={k} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={springs.pop}
                  className="pl-3 text-sm text-primary" style={{ boxShadow: `inset 3px 0 0 ${VERDICT_FILL[kept ? 'keep' : 'unfounded']}` }}>
                  {onCard(l)}{!kept && <span className="text-tertiary"> (rewritten)</span>}
                </motion.span>
              );
            })}
          </div>
        );
      })}
      {cut > 0 && <span className="text-sm font-semibold text-tertiary">{cut} {cut === 1 ? 'line' : 'lines'} cut</span>}
    </div>
  );

  if (!card) {
    const n = Object.values(results).filter(Boolean).length;
    return (
      <div className="relative flex flex-col gap-5 py-6">
        <Burst count={36} />
        <StageTitle eyebrow="Persona rebuilt" title={`${n} of ${game.cards.length} right first time`}>
          Every line on Revathi’s card is now something she does, uses or runs into, and every one traces to the research.
        </StageTitle>
        {persona}
        <NibSays mood={n === game.cards.length ? 'cheer' : 'idle'}>Now show it to Revathi and the employee disability network before it goes on the wall.</NibSays>
        <Button size="xl" onPress={() => onDone(game.cards.map(c => ({ id: c.id, correct: !!results[c.id] })))}>Continue the story</Button>
      </div>
    );
  }

  const k = card.visual as HazriLine;
  const l = HAZRI_LINES[k];
  const lane = personaFlaw(l);
  const done = game.cards.length - deck.length;
  const call = (laneId: string) => {
    if (miss || right) return;
    const ok = laneId === lane;
    play(ok ? 'correct' : 'wrong');
    setResults(rs => (card.id in rs ? rs : { ...rs, [card.id]: ok }));
    if (ok) { setRight(true); setCalled(cs => [...cs, k]); }
    else { setMiss(laneId as PersonaFlaw); setTimeout(() => { setMiss(null); setDeck(dk => [...dk.slice(1), dk[0]]); }, 3600); }
  };
  const next = () => { setRight(false); setDeck(dk => dk.slice(1)); };
  const result = onCard(l);

  return (
    <div className="flex flex-col gap-5">
      <StageTitle eyebrow="Play" title={game.title}>{game.instructions}</StageTitle>
      <div className="flex items-baseline justify-between">
        <span className="text-sm font-semibold text-tertiary">Draft persona · {REVATHI.name}</span>
        <span className="text-sm font-semibold text-tertiary tabular-nums">{done} / {game.cards.length}</span>
      </div>
      <motion.div key={`${card.id}-${deck.length}`} initial={{ y: 24, opacity: 0 }}
        animate={miss ? { x: [0, -10, 10, -6, 6, 0], y: 0, opacity: 1 } : { y: 0, opacity: 1 }}
        transition={miss ? { duration: 0.4 } : springs.pop}
        className={cx('flex flex-col gap-3 rounded-2xl bg-primary p-4 shadow-lg ring-2 ring-inset sm:p-5', miss ? 'ring-error' : right ? 'ring-mint-600' : 'ring-secondary')} data-current-card>
        <span className="text-xs font-bold tracking-wide text-tertiary uppercase">{PART_LABEL[l.part]}</span>
        <p className={cx('text-lg font-semibold text-primary', right && result === null && 'line-through decoration-2')}>“{card.label}”</p>
        <div className="flex flex-col gap-1">
          <div className="h-2 w-full overflow-hidden rounded-full bg-secondary" aria-hidden>
            <div className="h-full rounded-full" style={{ width: `${(100 * l.evidence) / PERSONA_SESSIONS}%`, background: VERDICT_FILL.unfounded }} />
          </div>
          <span className={cx('text-sm', l.evidence ? 'text-secondary' : 'font-semibold text-error-primary')}>
            {l.evidence ? `Seen in ${l.evidence} of ${PERSONA_SESSIONS} sessions` : `Seen in none of ${PERSONA_SESSIONS} sessions`}
          </span>
        </div>
        {right && (
          <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={springs.pop}
            className="rounded-lg px-3 py-2 text-sm font-semibold text-primary" style={{ boxShadow: `inset 3px 0 0 ${VERDICT_FILL[lane]}` }}>
            {lane === 'keep' ? 'Goes on her card as it is.' : result ? `Rewritten: ${result}` : 'Cut, with nothing in its place.'}
          </motion.p>
        )}
      </motion.div>
      <div className="grid grid-cols-2 gap-2" role="group" aria-label="What to do with this line">
        {game.lanes.map(ln => (
          <motion.button key={ln.id} type="button" onClick={() => call(ln.id)} disabled={!!miss || right} whileTap={{ scale: 0.97 }}
            className={cx('flex flex-col items-start gap-0.5 rounded-xl border-2 bg-primary px-3 py-2.5 text-left transition enabled:hover:bg-primary_hover disabled:cursor-default',
              right && ln.id === lane ? 'border-mint-600' : miss === ln.id ? 'border-error' : miss && ln.id === lane ? 'border-mint-600' : 'border-secondary')}>
            <span className="flex items-center gap-1.5 text-md font-bold text-primary"><span className="size-2.5 shrink-0 rounded-sm" style={{ background: VERDICT_FILL[ln.id as PersonaFlaw] }} aria-hidden />{ln.label}</span>
            <span className="text-xs font-medium text-tertiary">{ln.hint}</span>
          </motion.button>
        ))}
      </div>
      <div className="min-h-14" aria-live="polite">
        {miss && <NibSays mood="sad">Not {LABEL[miss].toLowerCase()}: this one is <strong>{LABEL[lane].toLowerCase()}</strong>. {card.note} It’ll come back round.</NibSays>}
        {right && (
          <div className="flex flex-col gap-3">
            <NibSays mood="cheer">{card.note}</NibSays>
            <div className="flex justify-end"><Button size="lg" onPress={next}>{deck.length > 1 ? 'Next line' : 'See her card'}</Button></div>
          </div>
        )}
        {!miss && !right && <NibSays mood="think">Worst first: is it a stereotype? Did any session show it? Does it say what she needs, or only name a condition?</NibSays>}
      </div>
      {persona}
    </div>
  );
}
