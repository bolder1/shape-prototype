'use client';
// Mini-game for st.3-4: each card is a question the Kahaani team wants answered (its `visual`, a key of
// `TRACK_QUESTIONS`). Tap the moment on the shared `KahaaniPlayer` where the event that answers it fires. A wrong moment
// shakes, says why and the card comes back later; the right one asks which properties to send, from the event's own
// list plus a child's name that must stay out, checked by `propsCheck`. Each answered question adds a row to the
// tracking plan under the player. The moment scores on the first try.
import { useState } from 'react';
import { motion } from 'motion/react';
import { CheckIcon } from '@phosphor-icons/react/ssr';
import { KAHAANI_EVENTS, TRACK_QUESTIONS, propsCheck, type Episode, type KahaaniEvent, type TrackQuestion } from '@shape/content';
import { springs } from '@shape/ui';
import { Button } from '@/components/base/buttons/button';
import { cx } from '@/utils/cx';
import { Burst, NibSays, StageTitle } from '../kit';
import { KahaaniPlayer, PLAYER_H, PLAYER_SPOTS, PLAYER_W, SPOT_EVENT } from '../scenes/TrackPlan';
import type { GameResult } from './DiamondSort';
import { play } from '@/lib/sound';

type Game = Episode['game'];
type Card = Game['cards'][number];
type Spot = keyof typeof PLAYER_SPOTS;
/** Offered beside every event's own properties; it identifies a child, so it must never be picked. */
const TRAP = 'child_name';

function Plan({ rows }: { rows: { card: Card; props: string[] }[] }) {
  if (!rows.length) return null;
  return (
    <div className="overflow-x-auto rounded-2xl bg-secondary p-3">
      <table className="w-full min-w-[28rem] text-left text-xs">
        <thead className="text-tertiary"><tr><th className="pb-1 font-semibold">Event</th><th className="pb-1 font-semibold">Properties</th><th className="pb-1 font-semibold">Answers</th></tr></thead>
        <tbody>
          {rows.map(({ card, props }) => (
            <motion.tr key={card.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="border-t border-secondary align-top">
              <td className="py-1.5 pr-2 font-mono font-semibold text-primary">{card.lane}</td>
              <td className="py-1.5 pr-2 font-mono text-secondary">{props.join(', ')}</td>
              <td className="py-1.5 text-secondary">{card.label}</td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function EventWire({ game, onDone }: { game: Game; onDone: (results: GameResult[]) => void }) {
  const [deck, setDeck] = useState(game.cards);
  const [results, setResults] = useState<Record<string, boolean>>({});
  const [rows, setRows] = useState<{ card: Card; props: string[] }[]>([]);
  const [wired, setWired] = useState(false);
  const [chosen, setChosen] = useState<string[]>([]);
  const [check, setCheck] = useState<ReturnType<typeof propsCheck> | null>(null);
  const [miss, setMiss] = useState<Spot | null>(null);
  const card = deck[0];

  const tapSpot = (s: Spot) => {
    if (!card || miss || wired) return;
    const ok = SPOT_EVENT[s] === card.lane;
    play(ok ? 'correct' : 'wrong');
    setResults(x => (card.id in x ? x : { ...x, [card.id]: ok }));
    if (ok) { setWired(true); setChosen([]); setCheck(null); }
    else { setMiss(s); setTimeout(() => { setMiss(null); setDeck(d => [...d.slice(1), d[0]]); }, 2600); }
  };
  const toggle = (prop: string) => { setCheck(null); setChosen(c => (c.includes(prop) ? c.filter(x => x !== prop) : [...c, prop])); };
  const send = () => {
    const q = TRACK_QUESTIONS[card.visual as TrackQuestion];
    const r = propsCheck(q.props, chosen);
    play(r.ok ? 'correct' : 'wrong');
    setCheck(r);
    if (r.ok) setTimeout(() => { setRows(x => [...x, { card, props: chosen }]); setWired(false); setCheck(null); setDeck(d => d.slice(1)); }, 1600);
  };

  if (!card) {
    const right = Object.values(results).filter(Boolean).length;
    return (
      <div className="relative flex flex-col items-center gap-5 py-6 text-center">
        <Burst count={36} />
        <StageTitle eyebrow="Kahaani’s tracking plan" title={`${right} of ${game.cards.length} moments found first time`}>
          Four events, each fired by something that happened to a story, each carrying only what a question needs. No names.
        </StageTitle>
        <div className="w-full"><Plan rows={rows} /></div>
        <NibSays mood={right === game.cards.length ? 'cheer' : 'idle'}>Put this table next to the design file. Before release, play each moment in a test build and watch the event arrive with its properties.</NibSays>
        <Button size="xl" onPress={() => onDone(game.cards.map(c => ({ id: c.id, correct: !!results[c.id] })))}>Continue the story</Button>
      </div>
    );
  }

  const event = card.lane as KahaaniEvent;
  const lane = game.lanes.find(l => l.id === card.lane)!;
  const offered = [...KAHAANI_EVENTS[event].props, TRAP].sort();
  const litSpot = KAHAANI_EVENTS[event].where;

  return (
    <div className="flex flex-col gap-5">
      <StageTitle eyebrow="Play" title={game.title}>{game.instructions}</StageTitle>
      <div className="flex items-baseline justify-between">
        <span className="text-sm font-semibold text-tertiary">{wired ? `Properties for ${event}` : 'Where does the answer get recorded?'}</span>
        <span className="text-sm font-semibold text-tertiary tabular-nums">{rows.length} / {game.cards.length}</span>
      </div>
      <motion.div key={`${card.id}-${deck.length}`} initial={{ y: -14, opacity: 0 }} animate={miss ? { x: [0, -10, 10, -6, 6, 0], opacity: 1 } : { y: 0, opacity: 1 }} transition={miss ? { duration: 0.4 } : springs.pop}
        className={cx('mx-auto w-full max-w-lg rounded-2xl bg-primary px-5 py-4 text-lg font-semibold text-primary shadow-lg ring-2 ring-inset', miss ? 'ring-error' : 'ring-secondary')} data-current-card>
        {card.label}
      </motion.div>
      <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
        <div className="relative w-56 shrink-0" style={{ aspectRatio: `${PLAYER_W} / ${PLAYER_H}` }}>
          <svg viewBox={`0 0 ${PLAYER_W} ${PLAYER_H}`} className="absolute inset-0 h-full w-full" aria-hidden>
            <KahaaniPlayer lit={wired ? [litSpot] : miss ? [miss] : []} tags={wired || !!miss} progress={0.55} />
          </svg>
          {(Object.keys(PLAYER_SPOTS) as Spot[]).map(s => (
            <button key={s} type="button" onClick={() => tapSpot(s)} disabled={!!miss || wired}
              className="absolute size-12 -translate-x-1/2 -translate-y-1/2 rounded-full outline-offset-2 focus-visible:outline-2 focus-visible:outline-brand-solid disabled:cursor-default"
              style={{ left: `${(PLAYER_SPOTS[s].x / PLAYER_W) * 100}%`, top: `${(PLAYER_SPOTS[s].y / PLAYER_H) * 100}%` }}
              aria-label={`${PLAYER_SPOTS[s].label}: fires ${SPOT_EVENT[s]}`} />
          ))}
        </div>
        <div className="flex w-full flex-col gap-2">
          {!wired && (
            <ul className="flex flex-col gap-1.5 text-xs">
              {game.lanes.map(l => (
                <li key={l.id} className="rounded-lg bg-secondary px-2.5 py-1.5 text-secondary"><span className="font-mono font-semibold text-primary">{l.label}</span> · {l.hint}</li>
              ))}
            </ul>
          )}
          {wired && (
            <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-3">
              <p className="text-sm text-secondary"><span className="font-mono font-semibold text-primary">{event}</span> fires when {KAHAANI_EVENTS[event].trigger.charAt(0).toLowerCase() + KAHAANI_EVENTS[event].trigger.slice(1)}. Which properties answer the question?</p>
              <div className="flex flex-wrap gap-2" role="group" aria-label="Properties">
                {offered.map(prop => {
                  const on = chosen.includes(prop), bad = check && (check.pii.includes(prop) || check.missing.includes(prop));
                  return (
                    <button key={prop} type="button" onClick={() => toggle(prop)} aria-pressed={on}
                      className={cx('flex items-center gap-1 rounded-full px-3 py-1.5 font-mono text-xs font-semibold ring-2 ring-inset transition',
                        on ? 'bg-brand-solid text-white ring-brand-solid' : 'bg-primary text-primary ring-secondary hover:bg-secondary_hover', bad && 'ring-error')}>
                      {on && <CheckIcon className="size-3.5" aria-hidden />}{prop}
                    </button>
                  );
                })}
              </div>
              <Button size="lg" onPress={send} isDisabled={!!check?.ok}>Add to the plan</Button>
              {check && (check.ok
                ? <NibSays mood="cheer">{card.note}</NibSays>
                : <NibSays mood="sad">{check.pii.length ? 'A child’s name identifies a child and answers no question: take it out. ' : ''}{check.missing.length ? `The question needs ${check.missing.join(' and ')}.` : ''}</NibSays>)}
            </motion.div>
          )}
        </div>
      </div>
      {miss && <NibSays mood="sad">That moment fires <strong className="font-mono">{SPOT_EVENT[miss]}</strong>. This one is recorded by <strong className="font-mono">{lane.label}</strong>: {lane.hint.toLowerCase()}. It’ll come back round.</NibSays>}
      <Plan rows={rows} />
    </div>
  );
}
