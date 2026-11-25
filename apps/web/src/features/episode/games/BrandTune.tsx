'use client';
// Mini-game for ds.5-1: build Sawari's brand layer. Every card is a request from Meera, Sawari's brand lead (its
// `visual`, a key of `SAWARI_REQUESTS`). Theme it, tune it, or keep it shared (`BRAND_CALLS`, scored by `brandCall`).
// Right calls apply it to a live Sawari preview in light and dark and add it to the brand layer or the shared list; a
// `tune` card then gets a slider along its ramp (`SAWARI_RAMPS`), checked live by `tuneCheck`, and can only be locked
// on a step that passes. First call scores; a missed card comes back later.
import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  BRAND_THEMES, SAWARI_RAMPS, SAWARI_REQUESTS, brandCall, sawariHex, sawariSteps, tuneCheck,
  type BrandCall, type Episode, type SawariRequest,
} from '@shape/content';
import { springs } from '@shape/ui';
import { Button } from '@/components/base/buttons/button';
import { cx } from '@/utils/cx';
import { Burst, NibSays, StageTitle } from '../kit';
import { CALL_FILL } from '../scenes/ThemeStack';
import { Tune } from './MeasureTune';
import type { GameResult } from './DiamondSort';
import { play } from '@/lib/sound';

type Game = Episode['game'];
const LABEL: Record<BrandCall, string> = { theme: 'Theme it', tune: 'Tune it', shared: 'Shared' };
/** What each themed request sets the token to. Tuned ones show the step the player locked. */
const VALUE: Partial<Record<SawariRequest, string>> = { serif: 'serif', radius: '12 px', cardEdge: 'gold-400', motion: '280 ms', iconStroke: '1.5 px' };
/** What the shared ones keep. */
const KEPT: Partial<Record<SawariRequest, string>> = { errorGold: 'Errors stay red', slimButton: '44 px tap area', focusRing: 'Focus ring stays' };
const SERIF = 'Georgia, "Times New Roman", serif';

/** Sawari's ticket card in one mode, with whatever the player has set so far. */
function Preview({ mode, set, tuned }: { mode: 'light' | 'dark'; set: Set<SawariRequest>; tuned: Partial<Record<SawariRequest, number>> }) {
  const th = BRAND_THEMES.sawari[mode];
  const radius = set.has('radius') ? 12 : 8;
  const link = mode === 'light' ? (tuned.plumLink ? sawariHex('plum', tuned.plumLink) : th.actionPrimary) : (tuned.darkLink ? sawariHex('plum', tuned.darkLink) : th.actionPrimary);
  const gold = tuned.goldLabel !== undefined;
  return (
    <div className="flex min-w-0 flex-col gap-2 overflow-hidden p-3 ring-1 ring-secondary ring-inset" style={{ background: th.surface, borderRadius: radius + 4, borderTop: set.has('cardEdge') ? `4px solid ${SAWARI_RAMPS.gold[400]}` : undefined, transition: `all ${set.has('motion') ? 280 : 200}ms ease` }}>
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-bold uppercase" style={{ color: th.text, opacity: 0.75 }}>{mode}</span>
        <svg viewBox="0 0 24 24" className="size-5" aria-hidden><rect x={4} y={4} width={16} height={13} rx={3} fill="none" stroke={th.text} strokeWidth={set.has('iconStroke') ? 1.5 : 2} /><circle cx={8} cy={19} r={1.6} fill={th.text} /><circle cx={16} cy={19} r={1.6} fill={th.text} /></svg>
      </div>
      <span className="text-md font-bold" style={{ color: th.text, fontFamily: set.has('serif') ? SERIF : undefined }}>Chennai → Bengaluru</span>
      <span className="text-sm font-semibold underline" style={{ color: link }}>Fare rules</span>
      <span className="rounded-lg px-3 py-2 text-center text-sm font-bold" style={gold && mode === 'light'
        ? { background: SAWARI_RAMPS.gold[400], color: sawariHex('plum', tuned.goldLabel!), borderRadius: radius }
        : { background: th.actionPrimary, color: th.onAction, borderRadius: radius }}>Book seat</span>
    </div>
  );
}

export function BrandTune({ game, onDone }: { game: Game; onDone: (results: GameResult[]) => void }) {
  const [deck, setDeck] = useState(game.cards);
  const [results, setResults] = useState<Record<string, boolean>>({});
  const [placed, setPlaced] = useState<SawariRequest[]>([]);
  const [tuned, setTuned] = useState<Partial<Record<SawariRequest, number>>>({});
  const [miss, setMiss] = useState<BrandCall | null>(null);
  const [right, setRight] = useState(false);
  const [idx, setIdx] = useState(0);
  const card = deck[0];
  const set = new Set(placed.filter(k => brandCall(SAWARI_REQUESTS[k]) !== 'shared' && (SAWARI_REQUESTS[k].tune ? tuned[k] !== undefined : true)));
  const shared = placed.filter(k => brandCall(SAWARI_REQUESTS[k]) === 'shared');
  const layer = placed.filter(k => set.has(k));

  const board = (
    <div className="flex flex-col gap-3 rounded-2xl bg-secondary p-3">
      <div className="grid grid-cols-2 gap-2">
        <Preview mode="light" set={set} tuned={tuned} />
        <Preview mode="dark" set={set} tuned={tuned} />
      </div>
      <div className="flex flex-col gap-1.5">
        <span className="text-sm font-bold text-primary">Sawari’s brand layer · {layer.length} set</span>
        <div className="flex flex-wrap gap-1.5">
          <AnimatePresence initial={false}>
            {layer.map(k => (
              <motion.span key={k} layout initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} transition={springs.pop}
                className="rounded-md bg-primary px-2 py-1 font-mono text-xs text-primary ring-1 ring-secondary ring-inset">
                {SAWARI_REQUESTS[k].token}: {VALUE[k] ?? `plum-${tuned[k]}`}
              </motion.span>
            ))}
          </AnimatePresence>
          {layer.length === 0 && <span className="text-sm text-tertiary">Brand values land here.</span>}
        </div>
      </div>
      {shared.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-sm font-bold text-primary">Shared:</span>
          {shared.map(k => <span key={k} className="rounded-full px-2.5 py-0.5 text-xs font-bold text-white" style={{ background: CALL_FILL.shared }}>{KEPT[k] ?? SAWARI_REQUESTS[k].token}</span>)}
        </div>
      )}
    </div>
  );

  if (!card) {
    const n = Object.values(results).filter(Boolean).length;
    return (
      <div className="relative flex flex-col gap-5 py-6">
        <Burst count={36} />
        <StageTitle eyebrow="Brand layer built" title={`${n} of ${game.cards.length} right first time`}>
          Sawari now sets {layer.length} tokens on these requests and shares everything else with Rasta. The components didn’t change once.
        </StageTitle>
        {board}
        <NibSays mood={n === game.cards.length ? 'cheer' : 'idle'}>A brand sets values for a short list of tokens. Meaning, access and the API stay shared, and a brand colour that fails moves along its ramp until it passes.</NibSays>
        <Button size="xl" onPress={() => onDone(game.cards.map(c => ({ id: c.id, correct: !!results[c.id] })))}>Continue the story</Button>
      </div>
    );
  }

  const k = card.visual as SawariRequest;
  const req = SAWARI_REQUESTS[k];
  const lane = brandCall(req);
  const spec = req.tune;
  const steps = spec ? sawariSteps(spec.ramp) : [];
  const step = steps[idx];
  const check = spec && step !== undefined ? tuneCheck(spec, step) : null;
  const needsTune = right && lane === 'tune' && tuned[k] === undefined;
  const done = game.cards.length - deck.length;

  const call = (laneId: string) => {
    if (miss || right) return;
    const ok = laneId === lane;
    play(ok ? 'correct' : 'wrong');
    setResults(rs => (card.id in rs ? rs : { ...rs, [card.id]: ok }));
    if (ok) { setRight(true); setPlaced(ps => [...ps, k]); if (spec) setIdx(steps.indexOf(spec.asked)); }
    else { setMiss(laneId as BrandCall); setTimeout(() => { setMiss(null); setDeck(dk => [...dk.slice(1), dk[0]]); }, 3600); }
  };
  const lock = () => { if (check?.pass) { play('correct'); setTuned(ts => ({ ...ts, [k]: step })); } };
  const next = () => { setRight(false); setDeck(dk => dk.slice(1)); };

  return (
    <div className="flex flex-col gap-5">
      <StageTitle eyebrow="Play" title={game.title}>{game.instructions}</StageTitle>
      <div className="flex items-baseline justify-between">
        <span className="text-sm font-semibold text-tertiary">Meera’s requests</span>
        <span className="text-sm font-semibold text-tertiary tabular-nums">{done} / {game.cards.length}</span>
      </div>
      <motion.div key={`${card.id}-${deck.length}`} initial={{ y: 24, opacity: 0 }}
        animate={miss ? { x: [0, -10, 10, -6, 6, 0], y: 0, opacity: 1 } : { y: 0, opacity: 1 }}
        transition={miss ? { duration: 0.4 } : springs.pop}
        className={cx('flex flex-col gap-2 rounded-2xl bg-primary p-4 shadow-lg ring-2 ring-inset sm:p-5', miss ? 'ring-error' : right ? 'ring-mint-600' : 'ring-secondary')} data-current-card>
        <span className="text-xs font-bold tracking-wide text-tertiary uppercase">Request · <span className="font-mono normal-case">{req.token}</span></span>
        <p className="text-lg font-semibold text-primary">{card.label}</p>
        {right && <span className="w-fit rounded-full px-2.5 py-0.5 text-xs font-bold text-white" style={{ background: CALL_FILL[lane] }}>{LABEL[lane]}</span>}
        {needsTune && spec && check && (
          <div className="mt-1 flex flex-col gap-3 rounded-xl bg-secondary p-3">
            <div className="flex items-center gap-3">
              <span className="flex h-12 min-w-24 items-center justify-center rounded-lg px-3 text-sm font-bold ring-1 ring-secondary ring-inset" style={{ background: spec.against, color: sawariHex(spec.ramp, step) }}>Sample</span>
              <span className="text-sm font-semibold text-secondary">{spec.role}: <span className={cx('font-mono tabular-nums', check.pass ? 'text-primary' : 'text-error-primary')}>{check.ratio.toFixed(2)}:1</span>, needs {spec.min}</span>
            </div>
            <Tune label={`Move along the ${spec.ramp} ramp`} value={idx} min={0} max={steps.length - 1} step={1} ok={check.pass} fmt={i => `${spec.ramp}-${steps[i]}`} onChange={setIdx} />
            <div className="flex justify-end"><Button size="md" onPress={lock} isDisabled={!check.pass}>{check.pass ? `Lock ${spec.ramp}-${step}` : 'Fails: keep moving'}</Button></div>
          </div>
        )}
      </motion.div>
      <div className="grid grid-cols-3 gap-2" role="group" aria-label="What to do with this request">
        {game.lanes.map(l => (
          <motion.button key={l.id} type="button" onClick={() => call(l.id)} disabled={!!miss || right} whileTap={{ scale: 0.97 }}
            className={cx('flex flex-col items-start gap-0.5 rounded-xl border-2 bg-primary px-3 py-2.5 text-left transition enabled:hover:bg-primary_hover disabled:cursor-default',
              right && l.id === lane ? 'border-mint-600' : miss === l.id ? 'border-error' : miss && l.id === lane ? 'border-mint-600' : 'border-secondary')}>
            <span className="flex items-center gap-1.5 text-md font-bold text-primary"><span className="size-2.5 shrink-0 rounded-sm" style={{ background: CALL_FILL[l.id as BrandCall] }} aria-hidden />{l.label}</span>
            <span className="text-xs font-medium text-tertiary">{l.hint}</span>
          </motion.button>
        ))}
      </div>
      <div className="min-h-14" aria-live="polite">
        {miss && <NibSays mood="sad">Not “{LABEL[miss]}”: this one is <strong>{LABEL[lane]}</strong>. {card.note} It’ll come back round.</NibSays>}
        {right && needsTune && <NibSays mood="think">The rule doesn’t bend for a brand. Find the step nearest Meera’s choice that passes.</NibSays>}
        {right && !needsTune && (
          <div className="flex flex-col gap-3">
            <NibSays mood="cheer">{card.note}</NibSays>
            <div className="flex justify-end"><Button size="lg" onPress={next}>{deck.length > 1 ? 'Next request' : 'See the brand layer'}</Button></div>
          </div>
        )}
        {!miss && !right && <NibSays mood="think">Does it carry meaning, serve access or change the API? Then it’s shared. If it’s brand, would it pass contrast as asked?</NibSays>}
      </div>
      {board}
    </div>
  );
}
