'use client';
// Mini-game for ds.3-3: each card is a paragraph from Rasta's old Button page. Decide which block of the new page it
// belongs in, or cut it. Its rewrite (`visual`) drops into the block you picked on a live doc page, ringed red if that's
// the wrong block; a paragraph kept that should have been cut lands there word for word, and a rule cut by mistake goes
// to the bin. A reading-time meter (`readSeconds`) compares the old paragraphs with the page you've built. The props
// table at the bottom is drawn from BUTTON_API, the way a generated table would be.
import { useState } from 'react';
import { motion } from 'motion/react';
import { CheckIcon, XIcon } from '@phosphor-icons/react/ssr';
import { BUTTON_API, readSeconds, wordCount, type DocBlock, type Episode } from '@shape/content';
import { Button } from '@/components/base/buttons/button';
import { cx } from '@/utils/cx';
import { Burst, NibSays, StageTitle } from '../kit';
import type { GameResult } from './DiamondSort';
import { play } from '@/lib/sound';

type Game = Episode['game'];
type Card = Game['cards'][number];
const secs = (s: number) => (s >= 60 ? `${Math.floor(s / 60)} min ${s % 60} s` : `${s} s`);
const HEADS: Record<Exclude<DocBlock, 'cut'>, string> = { when: 'Use it for / don’t use it for', dodont: 'Do and don’t', a11y: 'Accessibility' };

function DocPreview({ cards, picks, fresh }: { cards: Card[]; picks: Record<string, DocBlock>; fresh?: string }) {
  const placed = (block: DocBlock) => cards.filter(c => picks[c.id] === block);
  const binned = placed('cut');
  return (
    <div className="flex flex-col gap-3 rounded-2xl bg-secondary p-4 text-left">
      <div>
        <p className="text-lg font-bold text-primary">Button</p>
        <p className="text-sm text-tertiary">Starts an action: Renew, Pay, Save.</p>
      </div>
      {(Object.keys(HEADS) as (keyof typeof HEADS)[]).map(b => (
        <section key={b} className="flex flex-col gap-1.5">
          <h3 className="text-xs font-bold tracking-wide text-tertiary uppercase">{HEADS[b]}</h3>
          {placed(b).length === 0 && <p className="text-sm text-quaternary">Nothing here yet.</p>}
          {placed(b).map(c => {
            const right = c.lane === b, text = c.visual ?? c.label;
            return (
              <motion.p key={c.id} layout initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
                className={cx('rounded-lg bg-primary px-3 py-2 text-sm text-primary ring-1 ring-inset', right ? 'ring-secondary' : 'ring-error', fresh === c.id && right && 'ring-2 ring-mint-600')}>
                {text}
                {!right && <span className="mt-1 block text-xs font-semibold text-error-primary">{c.lane === 'cut' ? 'Kept word for word: this should have been cut.' : 'Wrong block.'}</span>}
              </motion.p>
            );
          })}
        </section>
      ))}
      <section className="flex flex-col gap-1">
        <h3 className="text-xs font-bold tracking-wide text-tertiary uppercase">Props <span className="ml-1 rounded-full bg-primary px-2 py-0.5 normal-case tracking-normal">generated from code</span></h3>
        <table className="w-full text-left text-xs">
          <tbody>
            {BUTTON_API.map(a => (
              <tr key={a.name} className="border-t border-secondary">
                <td className="py-1 pr-3 font-mono font-semibold text-primary">{a.name}</td>
                <td className="py-1 font-mono text-tertiary">{a.kind === 'enum' ? a.options!.join(' | ') : a.kind}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
      {binned.length > 0 && (
        <p className="text-xs text-tertiary">
          Cut: {binned.map((c, k) => <span key={c.id} className={cx('line-through', c.lane !== 'cut' && 'font-semibold text-error-primary')}>{c.label.split(' ').slice(0, 6).join(' ')}…{k < binned.length - 1 ? ' · ' : ''}</span>)}
        </p>
      )}
    </div>
  );
}

function Meter({ cards, picks }: { cards: Card[]; picks: Record<string, DocBlock> }) {
  const before = cards.reduce((n, c) => n + readSeconds(c.label), 0);
  const after = cards.reduce((n, c) => n + (picks[c.id] === 'cut' ? 0 : readSeconds(picks[c.id] && c.visual ? c.visual : c.label)), 0);
  return (
    <div className="flex items-center gap-3 rounded-2xl bg-secondary px-4 py-3">
      <span className="text-sm font-semibold text-tertiary">Reading time</span>
      <div className="relative h-2 flex-1 overflow-hidden rounded-full bg-primary">
        <motion.div className="absolute inset-y-0 left-0 rounded-full bg-brand-solid" animate={{ width: `${(after / before) * 100}%` }} />
      </div>
      <span className="text-sm font-semibold text-primary tabular-nums">{secs(after)} <span className="text-tertiary">of {secs(before)}</span></span>
    </div>
  );
}

export function DocRewrite({ game, onDone }: { game: Game; onDone: (results: GameResult[]) => void }) {
  const [i, setI] = useState(0);
  const [picks, setPicks] = useState<Record<string, DocBlock>>({});
  const card = game.cards[i];
  const picked = card ? picks[card.id] : undefined;

  if (!card) {
    const right = game.cards.filter(c => picks[c.id] === c.lane).length;
    return (
      <div className="relative flex flex-col items-center gap-5 py-6 text-center">
        <Burst count={36} />
        <StageTitle eyebrow="Docs rewritten" title={`${right} of ${game.cards.length} paragraphs in the right place`}>
          Usage first, rules as pictures, accessibility you can check, and the rest cut or generated.
        </StageTitle>
        <div className="flex w-full flex-col gap-3"><Meter cards={game.cards} picks={picks} /><DocPreview cards={game.cards} picks={picks} /></div>
        <NibSays mood={right === game.cards.length ? 'cheer' : 'idle'}>Imran’s question is now the second thing on the page. Give the new page to someone new with three real questions and time them: that’s how you know it works.</NibSays>
        <Button size="xl" onPress={() => onDone(game.cards.map(c => ({ id: c.id, correct: picks[c.id] === c.lane })))}>Continue the story</Button>
      </div>
    );
  }

  const ok = picked === card.lane;
  const pick = (b: DocBlock) => { if (picked) return; play(b === card.lane ? 'correct' : 'wrong'); setPicks(p => ({ ...p, [card.id]: b })); };

  return (
    <div className="flex flex-col gap-5">
      <StageTitle eyebrow="Play" title={game.title}>{game.instructions}</StageTitle>
      <div className="flex items-baseline justify-between">
        <span className="text-sm font-semibold text-tertiary">From the old page · {wordCount(card.label)} words</span>
        <span className="text-sm font-semibold text-tertiary tabular-nums">{i + 1} / {game.cards.length}</span>
      </div>
      <motion.blockquote key={card.id} initial={{ y: -12, opacity: 0 }} animate={picked && !ok ? { x: [0, -10, 10, -6, 6, 0], opacity: 1, y: 0 } : { y: 0, opacity: 1 }} transition={{ duration: 0.4 }}
        className={cx('rounded-2xl bg-primary px-5 py-4 text-md text-secondary shadow-lg ring-2 ring-inset', !picked ? 'ring-secondary' : ok ? 'ring-mint-600' : 'ring-error')} data-current-card>
        {card.label}
      </motion.blockquote>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {game.lanes.map(l => (
          <motion.button key={l.id} type="button" onClick={() => pick(l.id as DocBlock)} disabled={!!picked} whileTap={{ scale: 0.96 }}
            className={cx('flex flex-col items-start gap-1 rounded-2xl bg-primary px-3 py-3 text-left ring-2 ring-secondary ring-inset transition disabled:cursor-default',
              !picked && 'hover:bg-primary_hover', picked && l.id !== picked && l.id !== card.lane && 'opacity-40', picked && l.id === card.lane && 'ring-mint-600', picked === l.id && !ok && 'ring-error')}>
            <span className="text-sm font-bold text-primary">{l.label}</span>
            <span className="text-xs leading-tight text-tertiary">{l.hint}</span>
          </motion.button>
        ))}
      </div>
      {picked && (
        <NibSays mood={ok ? 'cheer' : 'sad'}>
          <span className="inline-flex items-center gap-1 font-semibold">{ok ? <CheckIcon className="size-4" weight="bold" /> : <XIcon className="size-4" weight="bold" />}{game.lanes.find(l => l.id === card.lane)?.label}.</span>{' '}
          {card.visual && <>Rewrite: <em>{card.visual}</em> </>}
          {card.note}
        </NibSays>
      )}
      {picked && <div className="flex justify-end"><Button size="lg" onPress={() => setI(k => k + 1)}>{i + 1 < game.cards.length ? 'Next paragraph' : 'See the page'}</Button></div>}
      <Meter cards={game.cards} picks={picks} />
      <DocPreview cards={game.cards} picks={picks} fresh={card.id} />
    </div>
  );
}
