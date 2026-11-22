'use client';
// Mini-game for ui.2-4. First a tuner: two sliders (characters per line, line height) on a real paragraph, locked in once
// both sit in the comfortable range. Then each card's `visual` ("characters|lineHeight") sets a paragraph to judge:
// fix the line length, fix the line height, or reads well? After each pick the paragraph shows its fixed version.
import { useState } from 'react';
import { motion } from 'motion/react';
import { CheckIcon, LockSimpleIcon, XIcon } from '@phosphor-icons/react/ssr';
import { Label, Slider, SliderThumb, SliderTrack } from 'react-aria-components';
import { MEASURE, measureSetting, measureVerdict, type Episode, type MeasureSetting } from '@shape/content';
import { Button } from '@/components/base/buttons/button';
import { cx } from '@/utils/cx';
import { Burst, FAMILY, NibSays, StageTitle } from '../kit';
import { PARAGRAPH, wrap } from '../scenes/Measure';
import type { GameResult } from './DiamondSort';
import { play } from '@/lib/sound';

type Game = Episode['game'];
/** The widest setting any card uses, so every paragraph is drawn at the same font size. */
const MAX_CHARS = 104;
const FIXED: Record<string, (s: MeasureSetting) => MeasureSetting> = { measure: s => ({ ...s, chars: 62 }), leading: s => ({ ...s, leading: 1.5 }), ok: s => s };

/** The paragraph, broken at about `chars` characters a line. Font size is fixed by the box width, so lengths compare honestly. */
function Paragraph({ s, lines = 6 }: { s: MeasureSetting; lines?: number }) {
  const rows = wrap(PARAGRAPH, s.chars);
  return (
    <div className="w-full overflow-hidden" style={{ containerType: 'inline-size' }}>
      <div className="relative text-primary" style={{ fontSize: `min(17px, calc(100cqw / ${MAX_CHARS * 0.5}))`, lineHeight: s.leading, transition: 'line-height 400ms ease' }}>
        {rows.slice(0, lines).map((r, i) => <span key={i} className="block whitespace-nowrap">{r}</span>)}
        {rows.length > lines && <span className="pointer-events-none absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-[var(--color-bg-secondary)]" />}
      </div>
      <p className="mt-2 text-xs text-tertiary sm:hidden">Zoomed out, so long lines still fit your screen. Pinch to read.</p>
    </div>
  );
}

/** A labelled slider whose readout turns mint when the value is in range. Shared by the tuning games. */
export function Tune({ label, value, min, max, step, ok, fmt, onChange }: { label: string; value: number; min: number; max: number; step: number; ok: boolean; fmt: (v: number) => string; onChange: (v: number) => void }) {
  return (
    <Slider minValue={min} maxValue={max} step={step} value={value} onChange={v => onChange(v as number)} className="flex flex-col gap-2">
      <div className="flex justify-between text-sm">
        <Label className="font-semibold text-secondary">{label}</Label>
        <output className={cx('rounded-full px-2 py-0.5 font-mono font-semibold tabular-nums', ok ? 'bg-mint-600 text-white' : 'bg-secondary text-primary')}>{fmt(value)}</output>
      </div>
      <SliderTrack className="relative h-6 w-full">
        {({ state }) => (
          <>
            <div className="absolute top-1/2 h-2 w-full -translate-y-1/2 rounded-full bg-secondary" />
            <div className="absolute top-1/2 h-2 -translate-y-1/2 rounded-full bg-brand-solid" style={{ width: `${state.getThumbPercent(0) * 100}%` }} />
            <SliderThumb className={({ isFocusVisible, isDragging }) => cx('top-1/2 size-6 rounded-full bg-primary shadow-md ring-2 ring-brand-solid transition-transform',
              isDragging && 'scale-110', isFocusVisible && 'outline-2 outline-offset-2 outline-brand-solid')} />
          </>
        )}
      </SliderTrack>
    </Slider>
  );
}

function Tuner({ onLocked }: { onLocked: () => void }) {
  const [s, setS] = useState<MeasureSetting>({ chars: 100, leading: 1.05 });
  const charsOk = s.chars >= MEASURE.chars[0] && s.chars <= MEASURE.chars[1];
  const leadOk = s.leading >= MEASURE.leading[0] && s.leading <= MEASURE.leading[1];
  return (
    <div className="flex flex-col gap-5">
      <h2 className="text-xl font-semibold text-primary">Make this paragraph comfortable to read</h2>
      <div className={cx('rounded-2xl bg-secondary p-5 ring-2 ring-inset transition-colors', charsOk && leadOk ? 'ring-mint-600' : 'ring-secondary')}><Paragraph s={s} /></div>
      <Tune label="Line length" value={s.chars} min={20} max={MAX_CHARS} step={1} ok={charsOk} fmt={v => `~${v} characters`} onChange={chars => setS(x => ({ ...x, chars }))} />
      <Tune label="Line height" value={s.leading} min={1} max={2.4} step={0.05} ok={leadOk} fmt={v => `${v.toFixed(2)}×`} onChange={leading => setS(x => ({ ...x, leading }))} />
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm text-tertiary">{charsOk && leadOk ? 'Both in the comfortable range.' : 'Both readouts turn green when they’re comfortable.'}</span>
        <Button size="lg" iconLeading={LockSimpleIcon} isDisabled={!(charsOk && leadOk)} onPress={() => { play('fanfare'); onLocked(); }}>Lock it in</Button>
      </div>
    </div>
  );
}

export function MeasureTune({ game, onDone }: { game: Game; onDone: (results: GameResult[]) => void }) {
  const [tuned, setTuned] = useState(false);
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [results, setResults] = useState<Record<string, boolean>>({});
  const card = game.cards[i];
  const right = Object.values(results).filter(Boolean).length;

  const pick = (laneId: string) => {
    if (!card || picked) return;
    const ok = laneId === card.lane;
    play(ok ? 'correct' : 'wrong');
    setPicked(laneId);
    setResults(r => ({ ...r, [card.id]: ok }));
  };

  if (!tuned) return <div className="flex flex-col gap-5"><StageTitle eyebrow="Play · tune" title={game.title}>{game.instructions}</StageTitle><Tuner onLocked={() => setTuned(true)} /></div>;

  if (!card) {
    return (
      <div className="relative flex flex-col items-center gap-5 py-6 text-center">
        <Burst count={36} />
        <StageTitle eyebrow="Game over" title={`${right} of ${game.cards.length} paragraphs judged right`}>45–75 characters, line height about 1.5.</StageTitle>
        <NibSays mood={right === game.cards.length ? 'cheer' : 'idle'}>Fix the width first, then the leading. A good line height can’t rescue a 100-character line.</NibSays>
        <Button size="xl" onPress={() => onDone(game.cards.map(c => ({ id: c.id, correct: !!results[c.id] })))}>Continue the story</Button>
      </div>
    );
  }

  const set = measureSetting(card.visual ?? '62|1.5');
  const verdict = measureVerdict(set), shown = picked ? FIXED[verdict](set) : set;
  const ok = picked === card.lane, owner = game.lanes.find(l => l.id === card.lane)!;
  return (
    <div className="flex flex-col gap-5">
      <StageTitle eyebrow="Play · judge" title={game.title}>Is the line length wrong, the line height wrong, or does it read well?</StageTitle>
      <div className="flex items-baseline justify-between gap-3">
        <p className="text-md font-semibold text-secondary" data-current-card>{card.label}</p>
        <span className="shrink-0 text-sm font-semibold text-tertiary tabular-nums">{i + 1} / {game.cards.length}</span>
      </div>
      <motion.div animate={picked && !ok ? { x: [0, -10, 10, -6, 6, 0] } : { x: 0 }} transition={{ duration: 0.4 }}
        className={cx('rounded-2xl bg-secondary p-5 ring-2 ring-inset transition-colors', !picked ? 'ring-secondary' : ok ? 'ring-mint-600' : 'ring-error')}>
        <Paragraph s={shown} />
      </motion.div>
      <div className="grid grid-cols-3 gap-3">
        {game.lanes.map((l, k) => (
          <motion.button key={l.id} type="button" onClick={() => pick(l.id)} disabled={!!picked} whileTap={{ scale: 0.96 }}
            className={cx('flex flex-col rounded-2xl px-3 py-3 text-left text-white transition disabled:cursor-default', picked && l.id !== picked && l.id !== card.lane && 'opacity-50',
              picked && l.id === card.lane && 'ring-4 ring-mint-500')}
            style={{ background: FAMILY[[0, 1, 3][k]] }}>
            <span className="text-md font-bold">{l.label}</span>
            <span className="text-xs font-medium opacity-90">{l.hint}</span>
          </motion.button>
        ))}
      </div>
      {picked && (
        <div className="flex flex-col gap-3">
          <NibSays mood={ok ? 'cheer' : 'sad'}>
            <span className="inline-flex items-center gap-1 font-semibold">{ok ? <CheckIcon className="size-4" weight="bold" /> : <XIcon className="size-4" weight="bold" />}{ok ? 'Right.' : `${owner.label}.`}</span>{' '}
            {verdict === 'ok' ? 'It’s already in the comfortable range.' : `${owner.hint}. Above is the fixed version: ${verdict === 'measure' ? 'about 62 characters a line' : 'line height 1.5'}.`}
          </NibSays>
          <div className="flex justify-end"><Button size="lg" onPress={() => { setPicked(null); setI(n => n + 1); }}>{i + 1 < game.cards.length ? 'Next paragraph' : 'See results'}</Button></div>
        </div>
      )}
    </div>
  );
}
