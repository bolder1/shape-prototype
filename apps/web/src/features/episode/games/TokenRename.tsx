'use client';
// Mini-game for ds.2-3: each card is a bad name from Rasta's old token file ("color-red · error messages…"). First say
// what's wrong with it (the lane, which `nameFlaw` agrees with), then build the good name (`visual`) by tapping tiles
// into slots labelled by the grammar: category or component first, state last. Distractor tiles are the bad name's own
// leftover words, plus a decoy. A card scores when both the diagnosis and the name are right.
import { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { CheckIcon, XIcon } from '@phosphor-icons/react/ssr';
import { badName, NAME_STATES, nameWords, type Episode } from '@shape/content';
import { Button } from '@/components/base/buttons/button';
import { cx } from '@/utils/cx';
import { Burst, NibSays, StageTitle } from '../kit';
import type { GameResult } from './DiamondSort';
import { play } from '@/lib/sound';

type Game = Episode['game'];
type Card = Game['cards'][number];
const COMPONENTS = ['button', 'card', 'input', 'tab', 'toggle', 'link', 'header', 'banner'];
const DECOYS = ['final', 'teal', 'new', 'light', 'main'];

/** What each slot of a good name holds, from the grammar. */
const slotKind = (part: string, k: number, n: number) =>
  k === 0 ? (COMPONENTS.includes(part) ? 'component' : 'category') : k === n - 1 && (NAME_STATES as readonly string[]).includes(part) ? 'state' : k === 1 ? 'concept' : 'variant';

function Builder({ card, onDone }: { card: Card; onDone: (ok: boolean) => void }) {
  const answer = (card.visual ?? '').split('-');
  const tiles = useMemo(() => {
    const extra = nameWords(badName(card.label)).filter(w => !answer.includes(w));
    const decoy = DECOYS.find(d => !answer.includes(d) && !extra.includes(d))!;
    return [...answer, ...extra, decoy].map((text, i) => ({ id: `t${i}`, text, k: (i * 5 + 3) % 7 })).sort((a, b) => a.k - b.k || a.id.localeCompare(b.id));
  }, [card]);   // eslint-disable-line react-hooks/exhaustive-deps
  const [placed, setPlaced] = useState<string[]>([]);
  const [verdict, setVerdict] = useState<boolean | null>(null);
  const built = placed.map(id => tiles.find(t => t.id === id)!.text);
  const shown = verdict === false ? answer : built;
  const check = () => { const ok = built.join('-') === answer.join('-'); play(ok ? 'correct' : 'wrong'); setVerdict(ok); };

  return (
    <div className="flex flex-col gap-4">
      <motion.div animate={verdict === false ? { x: [0, -10, 10, -6, 6, 0] } : {}} transition={{ duration: 0.45 }}
        className={cx('relative flex flex-wrap items-end gap-1 rounded-2xl bg-secondary px-3 py-3 ring-2 ring-inset', verdict === null ? 'ring-secondary' : verdict ? 'ring-mint-600' : 'ring-error')}>
        {verdict && <Burst count={16} />}
        {answer.map((part, k) => (
          <span key={k} className="flex items-end gap-1">
            <button type="button" disabled={verdict !== null || !shown[k]} onClick={() => { play('tap'); setPlaced(p => p.slice(0, k).concat(p.slice(k + 1))); }}
              className={cx('flex min-w-16 flex-col items-center gap-0.5 rounded-lg px-2 py-1.5 text-center ring-1 ring-inset disabled:cursor-default', shown[k] ? 'bg-primary ring-brand' : 'bg-primary ring-secondary')}>
              <span className="font-mono text-md font-semibold text-primary">{shown[k] ?? ' '}</span>
              <span className="text-[10px] font-semibold tracking-wide text-tertiary uppercase">{slotKind(part, k, answer.length)}</span>
            </button>
            {k < answer.length - 1 && <span className="pb-5 font-mono text-lg font-bold text-tertiary">-</span>}
          </span>
        ))}
      </motion.div>
      <div className="flex flex-wrap gap-2">
        {tiles.map(t => {
          const used = placed.includes(t.id);
          return (
            <motion.button key={t.id} type="button" whileTap={{ scale: 0.95 }} disabled={verdict !== null || used || placed.length >= answer.length}
              onClick={() => { play('tap'); setPlaced(p => [...p, t.id]); }}
              className={cx('rounded-xl px-3 py-2 font-mono text-md font-semibold shadow-sm ring-1 ring-inset transition-opacity disabled:cursor-default', used ? 'bg-secondary text-quaternary ring-secondary opacity-50' : 'bg-primary text-primary ring-secondary hover:bg-primary_hover')}>{t.text}</motion.button>
          );
        })}
      </div>
      {verdict === null ? (
        <div className="flex items-center justify-between gap-3">
          <span className="text-sm text-tertiary">Tap a filled slot to take its word back.</span>
          <Button size="lg" onPress={check} isDisabled={placed.length !== answer.length}>Rename it</Button>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          <NibSays mood={verdict ? 'cheer' : 'think'}>
            <span className="inline-flex items-center gap-1 font-semibold">{verdict ? <CheckIcon className="size-4" weight="bold" /> : <XIcon className="size-4" weight="bold" />}<code className="font-mono">{card.visual}</code>.</span>{' '}{card.note}
          </NibSays>
          <div className="flex justify-end"><Button size="lg" onPress={() => onDone(verdict)}>Next name</Button></div>
        </div>
      )}
    </div>
  );
}

export function TokenRename({ game, onDone }: { game: Game; onDone: (results: GameResult[]) => void }) {
  const [i, setI] = useState(0);
  const [flaw, setFlaw] = useState<Record<string, string>>({});
  const [named, setNamed] = useState<Record<string, boolean>>({});
  const card = game.cards[i];
  const score = (c: Card) => flaw[c.id] === c.lane && !!named[c.id];

  if (!card) {
    const right = game.cards.filter(score).length;
    return (
      <div className="relative flex flex-col items-center gap-5 py-6 text-center">
        <Burst count={36} />
        <StageTitle eyebrow="File renamed" title={`${right} of ${game.cards.length} names fixed`}>Every name now says its job, in one order and one style.</StageTitle>
        <div className="w-full overflow-hidden rounded-2xl bg-[#0C111D] p-4 text-left font-mono text-sm">
          {game.cards.map(c => (
            <div key={c.id} className="flex flex-wrap items-baseline gap-x-3 py-1">
              <span className="text-[#98A2B3] line-through">{badName(c.label)}</span>
              <span className="font-semibold text-[#5EEAD4]">{c.visual}</span>
            </div>
          ))}
        </div>
        <NibSays mood={right === game.cards.length ? 'cheer' : 'idle'}>Keep the old names as deprecated aliases for a release, pointing at the new ones, so nothing breaks while people move over.</NibSays>
        <Button size="xl" onPress={() => onDone(game.cards.map(c => ({ id: c.id, correct: score(c) })))}>Continue the story</Button>
      </div>
    );
  }

  const picked = flaw[card.id], ok = picked === card.lane, owner = game.lanes.find(l => l.id === card.lane)!;
  const [bad, use] = card.label.split(' · ');
  return (
    <div className="flex flex-col gap-5">
      <StageTitle eyebrow={picked ? 'Play · rename' : 'Play · diagnose'} title={game.title}>{game.instructions}</StageTitle>
      <div className="flex items-baseline justify-between">
        <span className="text-sm font-semibold text-tertiary">From the old file</span>
        <span className="text-sm font-semibold text-tertiary tabular-nums">{i + 1} / {game.cards.length}</span>
      </div>
      <motion.div key={card.id} initial={{ y: -12, opacity: 0 }} animate={picked && !ok ? { x: [0, -10, 10, -6, 6, 0], opacity: 1, y: 0 } : { y: 0, opacity: 1 }} transition={{ duration: 0.4 }}
        className={cx('flex flex-col gap-1 rounded-2xl bg-primary px-5 py-4 shadow-lg ring-2 ring-inset', !picked ? 'ring-secondary' : ok ? 'ring-mint-600' : 'ring-error')} data-current-card>
        <code className="font-mono text-lg font-semibold text-primary">{bad}</code>
        <span className="text-sm text-tertiary">Used for {use}</span>
      </motion.div>
      {!picked ? (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {game.lanes.map(l => (
            <motion.button key={l.id} type="button" onClick={() => { play(l.id === card.lane ? 'correct' : 'wrong'); setFlaw(f => ({ ...f, [card.id]: l.id })); }} whileTap={{ scale: 0.96 }}
              className="flex flex-col items-start gap-1 rounded-2xl bg-primary px-3 py-3 text-left ring-2 ring-secondary ring-inset transition hover:bg-primary_hover">
              <span className="text-sm font-bold text-primary">{l.label}</span>
              <span className="text-xs leading-tight text-tertiary">{l.hint}</span>
            </motion.button>
          ))}
        </div>
      ) : (
        <>
          <p className={cx('inline-flex items-center gap-1.5 text-sm font-semibold', ok ? 'text-mint-700' : 'text-error-primary')}>
            {ok ? <CheckIcon className="size-4" weight="bold" /> : <XIcon className="size-4" weight="bold" />}{owner.label}: {owner.hint.toLowerCase()}. Now build the name.
          </p>
          <Builder key={card.id} card={card} onDone={good => { setNamed(n => ({ ...n, [card.id]: good })); setI(k => k + 1); }} />
        </>
      )}
    </div>
  );
}
