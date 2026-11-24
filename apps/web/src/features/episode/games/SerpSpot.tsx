'use client';
// Mini-game for br.3-4: each card is something wrong with how search sees Sukoon's launch page (its `visual`, one of
// `SEO_ISSUES`). The page shows two ways: as visitors see it, and as Google reads it (`ReadView`, area by area). Tap
// the area where the problem lives (`SEO_AREA_OF`). A right tap applies that issue's fix (`SEO_FIXES`), so the page and
// its search result redraw from `fixSeo`; a miss shakes, rings the right area and the card comes back later. First
// tap scores. The end shows the result before and after.
import { useState } from 'react';
import { motion } from 'motion/react';
import { EyeIcon, MagnifyingGlassIcon } from '@phosphor-icons/react/ssr';
import { SEO_FIXES, SUKOON_SEO_BEFORE, fixSeo, type Episode, type SeoArea, type SeoIssue } from '@shape/content';
import { springs } from '@shape/ui';
import { Button } from '@/components/base/buttons/button';
import { cx } from '@/utils/cx';
import { Burst, NibSays, StageTitle } from '../kit';
import { ReadView, Serp } from '../scenes/SeoRead';
import type { GameResult } from './DiamondSort';
import { play } from '@/lib/sound';

type Game = Episode['game'];
/** What a visitor sees in each area: nothing wrong, which is the point. */
const SEEN: Record<SeoArea, string> = {
  snippet: 'A browser tab that says “Home”',
  headings: '“Calm in five minutes, between meetings”, big and bold, then How it works, Pricing, Questions',
  images: 'A calm photo, a row of five-star reviews, a soft wave behind the prices',
  links: '“See plans” in the pricing section, and a green “Start your free week” button',
};

export function SerpSpot({ game, onDone }: { game: Game; onDone: (results: GameResult[]) => void }) {
  const [deck, setDeck] = useState(game.cards);
  const [results, setResults] = useState<Record<string, boolean>>({});
  const [fixed, setFixed] = useState<SeoIssue[]>([]);
  const [view, setView] = useState<'seen' | 'read'>('read');
  const [miss, setMiss] = useState<string | null>(null);
  const [last, setLast] = useState<string | null>(null);
  const card = deck[0];
  const pg = fixSeo(SUKOON_SEO_BEFORE, fixed);

  if (!card) {
    const right = Object.values(results).filter(Boolean).length;
    return (
      <div className="relative flex flex-col items-center gap-5 py-6 text-center">
        <Burst count={36} />
        <StageTitle eyebrow="The page Google reads" title={`${right} of ${game.cards.length} found first time`}>Same page for people. For search, a title that fits, words people type, an outline, pictures with words, and links that go somewhere.</StageTitle>
        <div className="grid w-full gap-3 sm:grid-cols-2">
          <div className="flex flex-col gap-1 text-left"><span className="text-xs font-semibold text-tertiary">Before</span><svg viewBox="0 0 520 128" className="w-full" aria-hidden><Serp pg={SUKOON_SEO_BEFORE} /></svg></div>
          <div className="flex flex-col gap-1 text-left"><span className="text-xs font-semibold text-tertiary">After</span><svg viewBox="0 0 520 128" className="w-full" aria-hidden><Serp pg={pg} /></svg></div>
        </div>
        <NibSays mood={right === game.cards.length ? 'cheer' : 'idle'}>Most of this is the same work as accessibility: real headings, alt text, real links. Do it once, and it helps both.</NibSays>
        <Button size="xl" onPress={() => onDone(game.cards.map(c => ({ id: c.id, correct: !!results[c.id] })))}>Continue the story</Button>
      </div>
    );
  }

  const tap = (laneId: string) => {
    if (miss) return;
    const ok = laneId === card.lane;
    play(ok ? 'correct' : 'wrong');
    setResults(r => (card.id in r ? r : { ...r, [card.id]: ok }));
    if (ok) { setFixed(f => [...f, card.visual as SeoIssue]); setLast(card.id); setDeck(d => d.slice(1)); }
    else { setMiss(laneId); setTimeout(() => { setMiss(null); setDeck(d => [...d.slice(1), d[0]]); }, 2800); }
  };
  const lastCard = game.cards.find(c => c.id === last);
  const owner = game.lanes.find(l => l.id === card.lane)!;

  return (
    <div className="flex flex-col gap-5">
      <StageTitle eyebrow="Play" title={game.title}>{game.instructions}</StageTitle>
      <div className="flex items-baseline justify-between">
        <span className="text-sm font-semibold text-tertiary">What search is getting wrong</span>
        <span className="text-sm font-semibold text-tertiary tabular-nums">{fixed.length} / {game.cards.length}</span>
      </div>
      <motion.div key={`${card.id}-${deck.length}`} initial={{ y: -14, opacity: 0 }} animate={miss ? { x: [0, -10, 10, -6, 6, 0], opacity: 1 } : { y: 0, opacity: 1 }} transition={miss ? { duration: 0.4 } : springs.pop}
        className={cx('rounded-2xl bg-primary p-4 text-md font-semibold text-primary shadow-lg ring-2 ring-inset', miss ? 'ring-error' : 'ring-secondary')} data-current-card>
        {card.label}
      </motion.div>
      <div className="flex justify-center gap-1.5" role="group" aria-label="View">
        {([['seen', 'As visitors see it', EyeIcon], ['read', 'As Google reads it', MagnifyingGlassIcon]] as const).map(([id, label, Icon]) => (
          <button key={id} type="button" onClick={() => setView(id)} aria-pressed={view === id}
            className={cx('inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold transition', view === id ? 'bg-brand-solid text-white' : 'bg-primary text-secondary ring-1 ring-secondary hover:bg-primary_hover')}>
            <Icon className="size-4" aria-hidden />{label}
          </button>
        ))}
      </div>
      <div className="grid gap-2 sm:grid-cols-2" role="group" aria-label="Areas of the page">
        {game.lanes.map(l => {
          const done = fixed.filter(f => game.cards.find(c => c.visual === f)?.lane === l.id).length;
          return (
            <motion.button key={l.id} type="button" onClick={() => tap(l.id)} disabled={!!miss} whileTap={{ scale: 0.99 }}
              className={cx('flex min-h-32 flex-col items-start gap-2 rounded-xl border-2 bg-primary p-3 text-left transition-colors enabled:hover:bg-primary_hover disabled:cursor-default',
                miss === l.id ? 'border-error' : miss && l.id === card.lane ? 'border-mint-600' : 'border-secondary')}>
              <span className="flex w-full items-baseline justify-between gap-2 text-sm font-bold text-primary">{l.label}<span className="text-xs font-medium text-tertiary">{done ? `${done} fixed` : l.hint}</span></span>
              <div className="w-full">{view === 'read' ? <ReadView pg={pg} area={l.id as SeoArea} /> : <span className="text-sm text-secondary">{SEEN[l.id as SeoArea]}</span>}</div>
            </motion.button>
          );
        })}
      </div>
      <div className="min-h-14" aria-live="polite">
        {miss && <NibSays mood="sad">That lives in <strong>{owner.label.toLowerCase()}</strong>. {card.note} It’ll come back round.</NibSays>}
        {!miss && lastCard && <NibSays mood="cheer"><strong>{SEO_FIXES[lastCard.visual as SeoIssue].fix}.</strong> {lastCard.note}</NibSays>}
      </div>
    </div>
  );
}
