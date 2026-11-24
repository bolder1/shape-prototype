'use client';
// Mini-game for br.3-2: each card is a draft line for one slot of a hero (its `visual`, a key of `SUKOON_DRAFTS`),
// written as phrases. Tap a phrase to swap it for the next option; the line re-checks itself live with `copyFlaws`,
// underlining buzzwords and we-words (`flaggedWords`). Lock it in when it's clean: it scores if the first lock passes.
// A failed lock names what's wrong and you keep editing. The hero mock above fills slot by slot for the page the line
// belongs to (the launch page or Sukoon for Teams). The end shows both heroes.
import { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowsClockwiseIcon } from '@phosphor-icons/react/ssr';
import { COPY_LIMITS, SUKOON_DRAFTS, copyFlaws, copyLine, flaggedWords, wordsOf, type CopyDraft, type CopyFlaw, type Episode, type HeroSlot, type SukoonDraft } from '@shape/content';
import { springs } from '@shape/ui';
import { Button } from '@/components/base/buttons/button';
import { cx } from '@/utils/cx';
import { Burst, NibSays, StageTitle } from '../kit';
import { HeroMock } from '../scenes/ConversionCopy';
import type { GameResult } from './DiamondSort';
import { play } from '@/lib/sound';

type Game = Episode['game'];
type Page = CopyDraft['page'];
const PAGE_NAME: Record<Page, string> = { launch: 'Launch page, for people who can’t switch off', teams: 'Sukoon for Teams, for HR heads' };
const draftOf = (k: string) => SUKOON_DRAFTS[k as SukoonDraft] as CopyDraft;
const FLAW_TEXT = (f: CopyFlaw, slot: HeroSlot, n: number) => ({
  long: `Too long: ${n} words, and this line carries ${COPY_LIMITS[slot]}.`,
  buzz: 'Buzzwords nobody can picture.',
  we: 'It’s about “we”, not the visitor.',
  generic: 'It says what the button does, not what you get.',
  vague: 'Nothing concrete: no number, no time.',
}[f]);
/** What a hero shows before a slot is written. */
const BLANK: Record<HeroSlot, string> = { headline: 'Headline', sub: 'The line under it', cta: 'Button', reassure: '' };

function Hero({ page, lines }: { page: Page; lines: Partial<Record<HeroSlot, string>> }) {
  return (
    <svg viewBox="0 0 520 380" className="w-full" role="img" aria-label={`${PAGE_NAME[page]}: ${Object.values(lines).join(' · ')}`}>
      <HeroMock head={lines.headline ?? BLANK.headline} sub={lines.sub ?? BLANK.sub} cta={lines.cta ?? BLANK.cta} safe={lines.reassure} x={4} y={4} w={512} />
    </svg>
  );
}

export function CopySwap({ game, onDone }: { game: Game; onDone: (results: GameResult[]) => void }) {
  const [i, setI] = useState(0);
  const [results, setResults] = useState<Record<string, boolean>>({});
  const [locked, setLocked] = useState<Record<string, string>>({});
  const [picks, setPicks] = useState<number[]>(() => draftOf(game.cards[0].visual!).segments.map(() => 0));
  const [miss, setMiss] = useState<CopyFlaw[] | null>(null);
  const [done, setDone] = useState(false);
  const card = game.cards[i];

  const heroFor = (page: Page, extra?: { slot: HeroSlot; line: string }) => {
    const lines: Partial<Record<HeroSlot, string>> = {};
    for (const c of game.cards) { const d = draftOf(c.visual!); if (d.page === page && locked[c.id]) lines[d.slot] = locked[c.id]; }
    if (extra) lines[extra.slot] = extra.line;
    return lines;
  };

  if (!card) {
    const right = Object.values(results).filter(Boolean).length;
    return (
      <div className="relative flex flex-col items-center gap-5 py-6 text-center">
        <Burst count={36} />
        <StageTitle eyebrow="Two heroes, rewritten" title={`${right} of ${game.cards.length} locked clean first time`}>Clear, concrete, about the visitor, and short enough for five seconds. Next: a five-second test with five real people.</StageTitle>
        <div className="grid w-full gap-3 sm:grid-cols-2">
          {(['launch', 'teams'] as const).map(pg => (
            <div key={pg} className="flex flex-col gap-1 text-left"><span className="text-xs font-semibold text-tertiary">{PAGE_NAME[pg]}</span><Hero page={pg} lines={heroFor(pg)} /></div>
          ))}
        </div>
        <NibSays mood={right === game.cards.length ? 'cheer' : 'idle'}>Rules catch the obvious. Real visitors catch the rest: ask five people what the page is and who it’s for, after five seconds.</NibSays>
        <Button size="xl" onPress={() => onDone(game.cards.map(c => ({ id: c.id, correct: !!results[c.id] })))}>Continue the story</Button>
      </div>
    );
  }

  const d = draftOf(card.visual!);
  const line = copyLine(d, picks);
  const flaws = copyFlaws(line, d.slot);
  const flags = flaggedWords(line);
  const lane = game.lanes.find(l => l.id === d.slot)!;
  const swap = (s: number) => { if (done) return; setMiss(null); setPicks(ps => ps.map((v, j) => (j === s ? (v + 1) % d.segments[s].length : v))); };
  const lock = () => {
    const ok = flaws.length === 0;
    play(ok ? 'correct' : 'wrong');
    setResults(r => (card.id in r ? r : { ...r, [card.id]: ok }));
    if (ok) { setLocked(l => ({ ...l, [card.id]: line })); setDone(true); } else setMiss(flaws);
  };
  const next = () => {
    const n = game.cards[i + 1];
    setDone(false); setMiss(null);
    if (n) setPicks(draftOf(n.visual!).segments.map(() => 0));
    setI(i + 1);
  };

  return (
    <div className="flex flex-col gap-5">
      <StageTitle eyebrow="Play" title={game.title}>{game.instructions}</StageTitle>
      <div className="flex items-baseline justify-between gap-3">
        <span className="text-sm font-semibold text-tertiary">{PAGE_NAME[d.page]}</span>
        <span className="text-sm font-semibold text-tertiary tabular-nums">{i} / {game.cards.length}</span>
      </div>
      <div className="rounded-2xl bg-secondary p-2"><Hero page={d.page} lines={heroFor(d.page, { slot: d.slot, line })} /></div>
      <motion.div key={card.id} initial={{ y: -14, opacity: 0 }} animate={miss ? { x: [0, -10, 10, -6, 6, 0], opacity: 1 } : { y: 0, opacity: 1 }} transition={miss ? { duration: 0.4 } : springs.pop}
        className={cx('flex flex-col gap-3 rounded-2xl bg-primary p-4 ring-2 ring-inset', miss ? 'ring-error' : done ? 'ring-mint-600' : 'ring-secondary')} data-current-card>
        <span className="text-sm font-bold text-primary">{lane.label} <span className="font-medium text-tertiary">· {lane.hint}</span></span>
        <div className="flex flex-wrap items-center gap-1.5" role="group" aria-label="Phrases: tap one to swap it">
          {d.segments.map((seg, s) => {
            const text = seg[picks[s] ?? 0];
            const ws = wordsOf(text);
            const start = d.segments.slice(0, s).reduce((n, sg, j) => n + wordsOf(sg[picks[j] ?? 0]).length, 0);
            return (
              <button key={s} type="button" onClick={() => swap(s)} disabled={done || seg.length < 2}
                className={cx('inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-left text-lg font-semibold text-primary transition', seg.length > 1 && !done ? 'bg-secondary ring-1 ring-secondary hover:bg-primary_hover' : 'bg-transparent')}
                aria-label={seg.length > 1 ? `${text}. Tap to swap, ${seg.length} options` : text}>
                <span>{ws.map((x, k) => <span key={k} className={cx(flags[start + k] && 'text-error-primary underline decoration-2 underline-offset-4')}>{k ? ' ' : ''}{x}</span>)}</span>
                {seg.length > 1 && !done && <ArrowsClockwiseIcon className="size-4 shrink-0 text-quaternary" aria-hidden />}
              </button>
            );
          })}
        </div>
        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold" aria-live="polite">
          <span className={cx('rounded-full px-2 py-1 tabular-nums', wordsOf(line).length > COPY_LIMITS[d.slot] ? 'bg-error-primary text-error-primary' : 'bg-secondary text-tertiary')}>{wordsOf(line).length} / {COPY_LIMITS[d.slot]} words</span>
          {done && <span className="rounded-full bg-secondary px-2 py-1 text-tertiary">Locked</span>}
        </div>
      </motion.div>
      <div className="min-h-14" aria-live="polite">
        {miss && <NibSays mood="sad">Not yet. {miss.map(f => FLAW_TEXT(f, d.slot, wordsOf(line).length)).join(' ')} Swap a phrase and try again.</NibSays>}
        {done && (
          <div className="flex flex-col gap-3">
            <NibSays mood="cheer">{card.note}</NibSays>
            <div className="flex justify-end"><Button size="lg" onPress={next}>{i + 1 < game.cards.length ? 'Next line' : 'See both heroes'}</Button></div>
          </div>
        )}
        {!miss && !done && (
          <div className="flex items-center justify-between gap-3">
            <span className="text-sm font-medium text-tertiary">Read it as a visitor: would you know what you get?</span>
            <Button size="lg" onPress={lock}>Lock it in</Button>
          </div>
        )}
      </div>
    </div>
  );
}
