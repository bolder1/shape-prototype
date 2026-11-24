'use client';
// Mini-game for br.3-3: each card is a campaign asset the agency sent (its `visual`, a key of `SUKOON_ASSETS`), drawn
// from its layout by `AssetArt`. Select the headline, the logo or the button and nudge it by `ASSET_STEP`; step the
// headline through `ASSET_SIZES`, or tap for its shorter line. Two checks help: the app's own bars over the asset, and
// how tall the headline is on the phone (`shownSize`). Ship it when you think it survives; it scores if
// `assetIssues` finds nothing on the first ship. A failed ship rings the blocks at fault and you keep fixing. One
// asset is already right. The end lines up every format.
import { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowDownIcon, ArrowUpIcon, MinusIcon, PlusIcon } from '@phosphor-icons/react/ssr';
import { ASSET_SIZES, ASSET_STEP, ASSET_WORDS, FORMAT_SPECS, MIN_SHOWN_PX, SUKOON_ASSETS, assetBoxes, assetIssues, shownSize, wordsOf, type Asset, type AssetIssue, type AssetLayout, type Episode, type SukoonAsset } from '@shape/content';
import { springs } from '@shape/ui';
import { Button } from '@/components/base/buttons/button';
import { cx } from '@/utils/cx';
import { Burst, NibSays, StageTitle } from '../kit';
import { AssetArt } from '../scenes/CampaignCut';
import type { GameResult } from './DiamondSort';
import { play } from '@/lib/sound';

type Game = Episode['game'];
type Block = 'head' | 'logo' | 'cta';
const assetOf = (k: string) => SUKOON_ASSETS[k as SukoonAsset] as Asset;
const BLOCK_NAME: Record<Block, string> = { head: 'Headline', logo: 'Logo', cta: 'Button' };
const ISSUE_TEXT = (i: AssetIssue, a: Asset, l: AssetLayout) => ({
  unsafe: FORMAT_SPECS[a.format].top ? 'Something sits under the app’s bars at the top or bottom.' : 'Something runs into the edge of the frame.',
  overlap: 'Two blocks overlap. Check where the headline wraps.',
  tiny: `The headline is ${shownSize(a.format, l.size).toFixed(1)} px tall on the phone; it needs ${MIN_SHOWN_PX}.`,
  wordy: `${wordsOf(a.lines[l.line]).length} words: someone scrolling past reads about ${ASSET_WORDS}.`,
}[i]);

/** Which blocks are at fault for the issues found, so the art can ring them. */
const culprits = (a: Asset, l: AssetLayout, issues: readonly AssetIssue[]) => {
  const s = FORMAT_SPECS[a.format], boxes = assetBoxes(a, l), out = new Set<string>();
  if (issues.includes('unsafe')) for (const b of boxes) if (b.top < Math.max(s.top, s.margin) || b.bottom > s.h - Math.max(s.bottom, s.margin)) out.add(b.id);
  if (issues.includes('overlap')) for (const b of boxes) if (boxes.some(c => c !== b && b.top < c.bottom && c.top < b.bottom)) out.add(b.id);
  if (issues.includes('tiny') || issues.includes('wordy')) out.add('head');
  return [...out];
};

export function AssetFit({ game, onDone }: { game: Game; onDone: (results: GameResult[]) => void }) {
  const [i, setI] = useState(0);
  const [results, setResults] = useState<Record<string, boolean>>({});
  const [layout, setLayout] = useState<AssetLayout>(() => ({ ...assetOf(game.cards[0].visual!).draft }));
  const [sel, setSel] = useState<Block>('head');
  const [ui, setUi] = useState(false);
  const [miss, setMiss] = useState<AssetIssue[] | null>(null);
  const [done, setDone] = useState(false);
  const card = game.cards[i];

  if (!card) {
    const right = Object.values(results).filter(Boolean).length;
    return (
      <div className="relative flex flex-col items-center gap-5 py-6 text-center">
        <Burst count={36} />
        <StageTitle eyebrow="The launch campaign" title={`${right} of ${game.cards.length} shipped clean first time`}>One promise and one look, laid out fresh for every frame. Save each as a template and next week’s post takes minutes.</StageTitle>
        <div className="flex flex-wrap items-end justify-center gap-3">
          {game.cards.map(c => { const a = assetOf(c.visual!); return <div key={c.id} className="overflow-hidden rounded-lg ring-1 ring-secondary"><AssetArt a={a} l={a.fix} width={a.format === 'story' ? 90 : a.format === 'post' ? 120 : 170} /></div>; })}
        </div>
        <NibSays mood={right === game.cards.length ? 'cheer' : 'idle'}>Before anything ships, look at it on a real phone, in the real app, at the real size. That’s the only check that never lies.</NibSays>
        <Button size="xl" onPress={() => onDone(game.cards.map(c => ({ id: c.id, correct: !!results[c.id] })))}>Continue the story</Button>
      </div>
    );
  }

  const a = assetOf(card.visual!);
  const s = FORMAT_SPECS[a.format];
  const lane = game.lanes.find(l => l.id === a.format)!;
  const blocks: Block[] = a.draft.cta !== undefined ? ['head', 'logo', 'cta'] : ['head', 'logo'];
  const step = ASSET_STEP[a.format];
  const shown = shownSize(a.format, layout.size);
  const edit = (f: (l: AssetLayout) => AssetLayout) => { if (done) return; setMiss(null); setLayout(l => f(l)); };
  const move = (dir: 1 | -1) => edit(l => { const v = l[sel]; return v === undefined ? l : { ...l, [sel]: Math.min(s.h - step, Math.max(0, v + dir * step)) }; });
  const resize = (dir: 1 | -1) => edit(l => { const k = ASSET_SIZES.indexOf(l.size as (typeof ASSET_SIZES)[number]); const n = ASSET_SIZES[Math.min(ASSET_SIZES.length - 1, Math.max(0, k + dir))]; return { ...l, size: n }; });
  const ship = () => {
    const issues = assetIssues(a, layout), ok = issues.length === 0;
    play(ok ? 'correct' : 'wrong');
    setResults(r => (card.id in r ? r : { ...r, [card.id]: ok }));
    if (ok) setDone(true); else setMiss(issues);
  };
  const next = () => {
    const n = game.cards[i + 1];
    setDone(false); setMiss(null); setSel('head'); setUi(false);
    if (n) setLayout({ ...assetOf(n.visual!).draft });
    setI(i + 1);
  };
  const artW = a.format === 'story' ? 200 : a.format === 'post' ? 260 : 340;

  return (
    <div className="flex flex-col gap-5">
      <StageTitle eyebrow="Play" title={game.title}>{game.instructions}</StageTitle>
      <div className="flex items-baseline justify-between gap-3">
        <span className="text-sm font-semibold text-tertiary">{lane.label} · {lane.hint}</span>
        <span className="text-sm font-semibold text-tertiary tabular-nums">{i} / {game.cards.length}</span>
      </div>
      <motion.div key={card.id} initial={{ y: -14, opacity: 0 }} animate={miss ? { x: [0, -10, 10, -6, 6, 0], opacity: 1 } : { y: 0, opacity: 1 }} transition={miss ? { duration: 0.4 } : springs.pop}
        className={cx('grid gap-4 rounded-2xl bg-secondary p-4 ring-2 ring-inset sm:grid-cols-[auto_1fr]', miss ? 'ring-error' : done ? 'ring-mint-600' : 'ring-secondary')} data-current-card>
        <div className="mx-auto overflow-hidden rounded-lg shadow-md ring-1 ring-secondary">
          <AssetArt a={a} l={layout} width={artW} ui={ui} bad={miss ? culprits(a, layout, miss) : []} pick={done ? undefined : sel} />
        </div>
        <div className="flex flex-col gap-3">
          <span className="text-md font-semibold text-primary">{card.label}</span>
          <div className="flex flex-wrap gap-1.5" role="radiogroup" aria-label="Block to move">
            {blocks.map(b => (
              <button key={b} type="button" role="radio" aria-checked={sel === b} onClick={() => setSel(b)} disabled={done}
                className={cx('rounded-full px-3 py-1.5 text-sm font-semibold transition', sel === b ? 'bg-brand-solid text-white' : 'bg-primary text-secondary ring-1 ring-secondary hover:bg-primary_hover')}>{BLOCK_NAME[b]}</button>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button size="sm" color="secondary" iconLeading={ArrowUpIcon} onPress={() => move(-1)} isDisabled={done} aria-label={`Move the ${BLOCK_NAME[sel].toLowerCase()} up`}>Up</Button>
            <Button size="sm" color="secondary" iconLeading={ArrowDownIcon} onPress={() => move(1)} isDisabled={done} aria-label={`Move the ${BLOCK_NAME[sel].toLowerCase()} down`}>Down</Button>
            <span className="mx-1 h-6 w-px bg-[var(--color-border-secondary)]" aria-hidden />
            <Button size="sm" color="secondary" iconLeading={MinusIcon} onPress={() => resize(-1)} isDisabled={done} aria-label="Smaller headline">Text</Button>
            <Button size="sm" color="secondary" iconLeading={PlusIcon} onPress={() => resize(1)} isDisabled={done} aria-label="Bigger headline">Text</Button>
            {a.lines.length > 1 && <Button size="sm" color="secondary" onPress={() => edit(l => ({ ...l, line: (l.line + 1) % a.lines.length }))} isDisabled={done}>{layout.line === 0 ? 'Shorter line' : 'Original line'}</Button>}
          </div>
          <label className="flex items-center gap-2 text-sm font-semibold text-secondary">
            <input type="checkbox" checked={ui} onChange={e => setUi(e.target.checked)} className="size-4 accent-[#2F5D50]" />
            {s.top ? 'Show the app’s bars' : a.format === 'thumb' ? 'Show the video length' : 'Show the margins'}
          </label>
          <div className="flex flex-col gap-1 rounded-xl bg-primary p-3 ring-1 ring-secondary">
            <span className="text-xs font-semibold text-tertiary">On the phone, in {s.where}: headline {shown.toFixed(1)} px tall</span>
            <span className={cx('font-bold leading-tight', shown < MIN_SHOWN_PX ? 'text-error-primary' : 'text-primary')} style={{ fontSize: `${Math.max(3, shown)}px` }}>{a.lines[layout.line]}</span>
          </div>
        </div>
      </motion.div>
      <div className="min-h-14" aria-live="polite">
        {miss && <NibSays mood="sad">Not yet. {miss.map(x => ISSUE_TEXT(x, a, layout)).join(' ')} Keep fixing, then ship again.</NibSays>}
        {done && (
          <div className="flex flex-col gap-3">
            <NibSays mood="cheer">{card.note}</NibSays>
            <div className="flex justify-end"><Button size="lg" onPress={next}>{i + 1 < game.cards.length ? 'Next asset' : 'See the campaign'}</Button></div>
          </div>
        )}
        {!miss && !done && (
          <div className="flex items-center justify-between gap-3">
            <span className="text-sm font-medium text-tertiary">Check the bars and the phone size before you ship.</span>
            <Button size="lg" onPress={ship}>Ship it</Button>
          </div>
        )}
      </div>
    </div>
  );
}
