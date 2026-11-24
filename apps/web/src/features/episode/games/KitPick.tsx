'use client';
// Mini-game for br.2-2: four jobs in Sukoon's kit (the lanes, `KIT_SLOTS`), three options each (cards whose `visual`
// is a key of `SUKOON_KIT`). Tap an option to try it on a Sukoon session screen: the heading and text faces set an
// English and a Hindi line (a face without Devanagari shows tofu), the button and background show their contrast
// ratio, and the shelf of rival icons shows whether the colour is already someone's. "Use this" commits; `kitFlaw`
// judges it. A wrong pick says why and you choose again. The first pick of each job scores its three cards.
import { useState } from 'react';
import { motion } from 'motion/react';
import { KIT_MIN_CONTRAST, SUKOON_INK, SUKOON_KIT, contrastRatio, kitFlaw, rivalOf, type Episode, type KitFlaw, type KitOption, type SukoonKitKey } from '@shape/content';
import { Button } from '@/components/base/buttons/button';
import { cx } from '@/utils/cx';
import { Burst, NibSays, StageTitle } from '../kit';
import { FACE, HINDI, RIVAL_FILL, tofu } from '../scenes/BrandPalette';
import type { GameResult } from './DiamondSort';
import { play } from '@/lib/sound';

type Game = Episode['game'];
type Picks = Partial<Record<string, SukoonKitKey>>;
const opt = (k: SukoonKitKey) => SUKOON_KIT[k] as KitOption;
const hasDeva = (k?: SukoonKitKey) => !k || (opt(k).kind === 'type' && (opt(k) as Extract<KitOption, { kind: 'type' }>).scripts.includes('deva'));
const hex = (k: SukoonKitKey | undefined, fallback: string) => { const o = k ? opt(k) : null; return o?.kind === 'colour' ? o.hex : fallback; };

const WHY: Record<KitFlaw, (o: KitOption) => string> = {
  script: () => 'It has no Devanagari, so the Hindi turns into empty boxes.',
  contrast: o => (o.kind === 'colour' ? `Its text is ${contrastRatio(o.hex, o.on).toFixed(1)}:1, under ${KIT_MIN_CONTRAST}:1.` : ''),
  rival: o => (o.kind === 'colour' ? `It reads as the ${rivalOf(o.hex)} the shelf’s biggest app already owns.` : ''),
  trait: o => `It fights Sukoon’s ${o.fights ?? 'personality'}.`,
};

/** The session screen, wearing whatever has been picked or is being tried. */
function Screen({ picks }: { picks: Picks }) {
  const bg = hex(picks.session, '#FFFFFF'), btn = hex(picks.action, '#667085');
  const d = picks.display, tx = picks.text;
  const head = d ? FACE[d] : 'Georgia, serif', body = tx ? FACE[tx] : 'system-ui, sans-serif';
  return (
    <div className="mx-auto flex w-60 flex-col gap-3 rounded-[28px] p-5 shadow-lg ring-1 ring-secondary" style={{ background: bg, color: SUKOON_INK }} aria-label="Sukoon session screen preview">
      <span className="text-xs font-bold uppercase tracking-wide opacity-70" style={{ fontFamily: body }}>Sukoon · 5 min</span>
      <p className="text-2xl font-bold leading-tight" style={{ fontFamily: head }}>Breathe. You’ve got five minutes.</p>
      <p className="text-xl font-bold leading-tight" style={{ fontFamily: head, letterSpacing: hasDeva(d) ? undefined : 4 }}>{hasDeva(d) ? 'साँस लीजिए' : tofu(HINDI)}</p>
      <p className="text-sm leading-snug" style={{ fontFamily: body }}>Breathe in for four, and out for six.</p>
      <p className="text-sm leading-snug" style={{ fontFamily: body, letterSpacing: hasDeva(tx) ? undefined : 3 }}>{hasDeva(tx) ? 'चार तक साँस लीजिए, छह तक छोड़िए।' : tofu('चार तक साँस लीजिए')}</p>
      <span className="mt-2 rounded-full py-3 text-center text-md font-bold text-white" style={{ background: btn, fontFamily: body }}>Begin</span>
    </div>
  );
}

function Readout({ k }: { k: SukoonKitKey }) {
  const o = opt(k);
  if (o.kind === 'type') return <span className="text-sm font-semibold text-tertiary">{o.scripts.includes('deva') ? 'Sets Latin and Devanagari' : 'Latin only: no Devanagari'}</span>;
  const r = contrastRatio(o.hex, o.on), rival = rivalOf(o.hex);
  return (
    <div className="flex flex-col items-center gap-2">
      <span className={cx('text-sm font-bold tabular-nums', r >= KIT_MIN_CONTRAST ? 'text-success-primary' : 'text-error-primary')}>{o.on === '#FFFFFF' ? 'White' : 'Ink'} text: {r.toFixed(1)} : 1</span>
      <div className="flex items-center gap-1.5" aria-label={rival ? `Looks like the rival's ${rival}` : 'Not a rival colour'}>
        {[RIVAL_FILL.blue, RIVAL_FILL.orange, RIVAL_FILL.violet].map(c => <span key={c} className="size-6 rounded-md" style={{ background: c }} />)}
        <span className={cx('size-7 rounded-md ring-2', rival ? 'ring-error' : 'ring-transparent')} style={{ background: o.hex }} />
        <span className="text-xs font-semibold text-tertiary">{rival ? 'on the shelf already' : 'nobody’s'}</span>
      </div>
    </div>
  );
}

export function KitPick({ game, onDone }: { game: Game; onDone: (results: GameResult[]) => void }) {
  const [slot, setSlot] = useState(0);
  const [picks, setPicks] = useState<Picks>({});
  const [trying, setTrying] = useState<SukoonKitKey | null>(null);
  const [first, setFirst] = useState<Record<string, SukoonKitKey>>({});
  const [wrong, setWrong] = useState<SukoonKitKey[]>([]);
  const [done, setDone] = useState(false);
  const lane = game.lanes[slot];

  if (!lane) {
    const results = game.cards.map(c => { const f = first[c.lane]; const fits = kitFlaw(opt(c.visual as SukoonKitKey)) === null; return { id: c.id, correct: fits ? f === c.visual : f !== c.visual }; });
    const firstRight = game.lanes.filter(l => { const f = first[l.id]; return f && kitFlaw(opt(f)) === null; }).length;
    return (
      <div className="relative flex flex-col items-center gap-5 py-6 text-center">
        <Burst count={36} />
        <StageTitle eyebrow="Sukoon’s kit" title={`${firstRight} of ${game.lanes.length} jobs right first time`}>Two faces that both speak Hindi, a button colour nobody owns that white text can sit on, and a calm background.</StageTitle>
        <Screen picks={picks} />
        <NibSays mood={firstRight === game.lanes.length ? 'cheer' : 'idle'}>Before you fall for a typeface, type your product’s name in every language it ships in. Empty boxes end the affair quickly.</NibSays>
        <Button size="xl" onPress={() => onDone(results)}>Continue the story</Button>
      </div>
    );
  }

  const options = game.cards.filter(c => c.lane === lane.id);
  const shown: Picks = trying ? { ...picks, [lane.id]: trying } : picks;
  const tryCard = trying ? options.find(c => c.visual === trying) : undefined;
  const commit = () => {
    if (!trying || done) return;
    const flaw = kitFlaw(opt(trying));
    play(flaw ? 'wrong' : 'correct');
    setFirst(f => (lane.id in f ? f : { ...f, [lane.id]: trying }));
    if (flaw) setWrong(w => [...w, trying]);
    else { setPicks(p => ({ ...p, [lane.id]: trying })); setDone(true); }
  };
  const next = () => { setSlot(s => s + 1); setTrying(null); setWrong([]); setDone(false); };
  const lastWrong = wrong[wrong.length - 1];
  const wrongNow = lastWrong && lastWrong === trying;

  return (
    <div className="flex flex-col gap-5">
      <StageTitle eyebrow="Play" title={game.title}>{game.instructions}</StageTitle>
      <div className="flex items-baseline justify-between">
        <span className="text-sm font-semibold text-tertiary">{lane.label} · {lane.hint}</span>
        <span className="text-sm font-semibold text-tertiary tabular-nums">{slot} / {game.lanes.length}</span>
      </div>
      <div className="grid items-start gap-5 sm:grid-cols-[1fr_auto]">
        <div className="flex flex-col gap-2" role="group" aria-label={`Options for ${lane.label}`}>
          {options.map(c => {
            const k = c.visual as SukoonKitKey, o = opt(k), out = wrong.includes(k);
            return (
              <motion.button key={c.id} type="button" onClick={() => !done && setTrying(k)} disabled={done || out} whileTap={{ scale: 0.98 }} aria-pressed={trying === k} layout
                className={cx('flex items-center gap-3 rounded-2xl border-2 bg-primary p-3 text-left transition enabled:hover:bg-primary_hover disabled:cursor-default',
                  done && picks[lane.id] === k ? 'border-mint-600' : out ? 'border-error opacity-60' : trying === k ? 'border-brand' : 'border-secondary')}>
                {o.kind === 'colour'
                  ? <span className="size-12 shrink-0 rounded-xl ring-1 ring-secondary" style={{ background: o.hex }} aria-hidden />
                  : <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-secondary text-2xl font-bold text-primary" style={{ fontFamily: FACE[k] }} aria-hidden>Aa</span>}
                <span className="flex flex-col">
                  <span className="text-md font-bold text-primary">{o.name}</span>
                  <span className="text-sm text-tertiary">{o.text}</span>
                </span>
              </motion.button>
            );
          })}
          {trying && <motion.div key={trying} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-center py-1"><Readout k={trying} /></motion.div>}
        </div>
        <Screen picks={shown} />
      </div>
      <div className="min-h-14" aria-live="polite">
        {!trying && !done && <NibSays mood="think">Tap an option to try it on the screen. Look at the Hindi, the numbers and the shelf before you choose.</NibSays>}
        {trying && !done && !wrongNow && <div className="flex justify-end"><Button size="lg" onPress={commit}>Use {opt(trying).name}</Button></div>}
        {wrongNow && tryCard && <NibSays mood="sad">{WHY[kitFlaw(opt(trying!))!](opt(trying!))} {tryCard.note} Try another.</NibSays>}
        {done && (
          <div className="flex flex-col gap-3">
            <NibSays mood="cheer">{options.find(c => c.visual === picks[lane.id])?.note}</NibSays>
            <div className="flex justify-end"><Button size="lg" onPress={next}>{slot < game.lanes.length - 1 ? 'Next job' : 'See the kit'}</Button></div>
          </div>
        )}
      </div>
    </div>
  );
}
