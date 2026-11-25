'use client';
// Mini-game for br.4-1: map the pieces of Sukoon's "Switch off" campaign. Every card is a piece (its `visual`, a key of
// `SUKOON_PIECES`) with the channel it runs on. Call it the tension, the turn or the proof in Meera's story, or cut it
// (`CAMPAIGN_ROLES`, scored by `arcRole`): a piece about the brand, or one that claims instead of showing, is cut.
// Right calls place it on the campaign arc, three acts with a tension line above them, or on the cutting-room floor.
// First call scores; a missed card comes back later.
import { useState } from 'react';
import { motion } from 'motion/react';
import { SUKOON_PIECES, arcRole, type CampaignRole, type Episode, type SukoonPiece } from '@shape/content';
import { springs } from '@shape/ui';
import { Button } from '@/components/base/buttons/button';
import { cx } from '@/utils/cx';
import { Burst, NibSays, StageTitle } from '../kit';
import { ROLE_FILL, ROLE_LABEL } from '../scenes/CampaignArc';
import type { GameResult } from './DiamondSort';
import { play } from '@/lib/sound';

type Game = Episode['game'];
const ACTS = ['tension', 'turn', 'proof'] as const;

/** Why a wrong call is wrong, from the piece itself. */
function whyNot(k: SukoonPiece) {
  const c = SUKOON_PIECES[k];
  if (c.about === 'brand') return 'This piece is about Sukoon, not about anyone watching. The brand is the guide, not the hero.';
  if (!c.specific) return 'It claims a feeling instead of showing a moment, and any brand could say it.';
  return c.shows === 'problem' ? 'It shows the problem as people live it: that’s the tension.'
    : c.shows === 'change' ? 'It shows Sukoon helping in a way you can see and do: that’s the turn.'
      : 'It shows life after the change, in a way you can check: that’s the proof.';
}

export function ArcMap({ game, onDone }: { game: Game; onDone: (results: GameResult[]) => void }) {
  const [deck, setDeck] = useState(game.cards);
  const [results, setResults] = useState<Record<string, boolean>>({});
  const [placed, setPlaced] = useState<SukoonPiece[]>([]);
  const [miss, setMiss] = useState<{ lane: string; why: string } | null>(null);
  const [right, setRight] = useState(false);
  const card = deck[0];

  const chip = (k: SukoonPiece) => (
    <motion.span key={k} initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={springs.pop}
      className="rounded-full px-2 py-0.5 text-xs font-bold text-white" style={{ background: ROLE_FILL[arcRole(SUKOON_PIECES[k])] }}>{SUKOON_PIECES[k].short}</motion.span>
  );
  const cut = placed.filter(k => arcRole(SUKOON_PIECES[k]) === 'off');

  const map = (
    <div className="flex flex-col gap-2 rounded-2xl bg-secondary p-3">
      <span className="text-sm font-bold text-primary">The campaign arc</span>
      <svg viewBox="0 0 300 40" className="h-8 w-full" aria-hidden preserveAspectRatio="none">
        <path d="M4 26 C 60 22, 90 4, 120 6 S 200 30, 296 36" fill="none" stroke="currentColor" strokeWidth={3} className="text-tertiary" vectorEffect="non-scaling-stroke" />
      </svg>
      <div className="grid grid-cols-3 gap-1.5">
        {ACTS.map(r => (
          <div key={r} className="flex flex-col gap-1">
            <span className="text-xs font-bold" style={{ color: ROLE_FILL[r] }}>{ROLE_LABEL[r]}</span>
            <div className="flex min-h-11 flex-col items-start gap-1 rounded-lg bg-primary p-1.5">
              {placed.filter(k => arcRole(SUKOON_PIECES[k]) === r).map(chip)}
            </div>
          </div>
        ))}
      </div>
      <div className="flex min-h-9 flex-wrap items-center gap-1 rounded-lg border-2 border-dashed border-secondary p-1.5">
        <span className="px-1 text-xs font-bold text-tertiary">Cut</span>
        {cut.map(chip)}
      </div>
    </div>
  );

  if (!card) {
    const n = Object.values(results).filter(Boolean).length;
    return (
      <div className="relative flex flex-col gap-5 py-6">
        <Burst count={36} />
        <StageTitle eyebrow="Campaign mapped" title={`${n} of ${game.cards.length} right first time`}>
          Nine pieces tell one story across six channels: the problem as people live it, Sukoon as the guide, and life after. Three were about the brand, or claimed instead of showing, and were cut.
        </StageTitle>
        {map}
        <NibSays mood={n === game.cards.length ? 'cheer' : 'idle'}>Every piece makes sense alone, and they add up to Meera’s story. That’s a campaign.</NibSays>
        <Button size="xl" onPress={() => onDone(game.cards.map(c => ({ id: c.id, correct: !!results[c.id] })))}>Continue the story</Button>
      </div>
    );
  }

  const k = card.visual as SukoonPiece;
  const c = SUKOON_PIECES[k];
  const lane = arcRole(c);
  const done = game.cards.length - deck.length;
  const call = (laneId: string) => {
    if (miss || right) return;
    const ok = laneId === lane;
    play(ok ? 'correct' : 'wrong');
    setResults(rs => (card.id in rs ? rs : { ...rs, [card.id]: ok }));
    if (ok) { setRight(true); setPlaced(ps => [...ps, k]); }
    else {
      setMiss({ lane: laneId, why: whyNot(k) });
      setTimeout(() => { setMiss(null); setDeck(dk => [...dk.slice(1), dk[0]]); }, 4200);
    }
  };
  const next = () => { setRight(false); setDeck(dk => dk.slice(1)); };

  return (
    <div className="flex flex-col gap-5">
      <StageTitle eyebrow="Play" title={game.title}>{game.instructions}</StageTitle>
      <div className="flex items-baseline justify-between">
        <span className="text-sm font-semibold text-tertiary">“Switch off” · campaign board</span>
        <span className="text-sm font-semibold text-tertiary tabular-nums">{done} / {game.cards.length}</span>
      </div>
      <motion.div key={`${card.id}-${deck.length}`} initial={{ y: 24, opacity: 0 }}
        animate={miss ? { x: [0, -10, 10, -6, 6, 0], y: 0, opacity: 1 } : { y: 0, opacity: 1 }}
        transition={miss ? { duration: 0.4 } : springs.pop}
        className={cx('flex flex-col gap-3 rounded-2xl bg-primary p-4 shadow-lg ring-2 ring-inset sm:p-5', miss ? 'ring-error' : right ? 'ring-mint-600' : 'ring-secondary')} data-current-card>
        <span className="self-start rounded-full bg-secondary px-2.5 py-1 text-xs font-bold text-secondary">{c.channel}</span>
        <p className="text-lg font-semibold text-primary">{card.label}</p>
      </motion.div>
      <div className="grid grid-cols-2 gap-2" role="group" aria-label="Which part of the story this piece carries">
        {game.lanes.map(l => (
          <motion.button key={l.id} type="button" onClick={() => call(l.id)} disabled={!!miss || right} whileTap={{ scale: 0.97 }}
            className={cx('flex flex-col items-start gap-0.5 rounded-xl border-2 bg-primary px-3 py-2.5 text-left transition enabled:hover:bg-primary_hover disabled:cursor-default',
              right && l.id === lane ? 'border-mint-600' : miss?.lane === l.id ? 'border-error' : miss && l.id === lane ? 'border-mint-600' : 'border-secondary')}>
            <span className="flex items-center gap-1.5 text-md font-bold text-primary"><span className="size-2.5 shrink-0 rounded-full" style={{ background: ROLE_FILL[l.id as CampaignRole] }} aria-hidden />{l.label}</span>
            <span className="text-xs font-medium text-tertiary">{l.hint}</span>
          </motion.button>
        ))}
      </div>
      <div className="min-h-14" aria-live="polite">
        {miss && <NibSays mood="sad">{miss.why} {card.note} It’ll come back round.</NibSays>}
        {right && (
          <div className="flex flex-col gap-3">
            <NibSays mood="cheer">{card.note}</NibSays>
            <div className="flex justify-end"><Button size="lg" onPress={next}>{deck.length > 1 ? 'Next piece' : 'See the arc'}</Button></div>
          </div>
        )}
        {!miss && !right && <NibSays mood="think">First: is it about Meera, or about Sukoon? Is it a moment you can see, or a claim? Then: problem, help, or life after?</NibSays>}
      </div>
      {map}
    </div>
  );
}
