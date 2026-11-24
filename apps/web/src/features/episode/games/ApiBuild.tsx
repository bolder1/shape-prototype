'use client';
// Mini-game for ds.3-1: each card is a prop from Rasta's old Button ("isDanger Â· Cancel passâ€¦"). Decide what it becomes:
// an option of a choice, a boolean, a slot, or not a prop at all. The props panel is rebuilt from your decisions so far
// by `apiFrom` (mistakes included: isDanger as a boolean stays a boolean, isLoading as an option becomes variant
// "loading"), the props still undecided wait underneath, and `comboCount` counts the buttons the API can describe.
import { useState } from 'react';
import { motion } from 'motion/react';
import { CheckIcon, XIcon } from '@phosphor-icons/react/ssr';
import { apiFrom, comboCount, type ApiDecision, type ApiKind, type ApiProp, type Episode } from '@shape/content';
import { Button } from '@/components/base/buttons/button';
import { cx } from '@/utils/cx';
import { Burst, NibSays, StageTitle } from '../kit';
import type { GameResult } from './DiamondSort';
import { play } from '@/lib/sound';

type Game = Episode['game'];
const oldOf = (label: string) => label.split(' Â· ')[0];
const purposeOf = (label: string) => label.split(' Â· ').slice(1).join(' Â· ');
const fmt = (n: number) => (n === Infinity ? 'âˆž' : n.toLocaleString('en-IN'));
const KIND_TEXT: Record<ApiProp['kind'], string> = { enum: 'text-brand-secondary', boolean: 'text-primary', slot: 'text-primary', free: 'text-error-primary' };

function PropsPanel({ api, waiting, fresh }: { api: ApiProp[]; waiting: string[]; fresh?: string }) {
  const count = comboCount(api);
  return (
    <div className="flex flex-col gap-3 rounded-2xl bg-secondary p-4">
      <div className="flex items-baseline justify-between gap-3">
        <span className="text-sm font-semibold text-tertiary">Button props</span>
        <span className="text-sm font-semibold text-tertiary">Buttons it can describe: <span className={cx('text-lg font-bold tabular-nums', count === 48 ? 'text-success-primary' : 'text-primary')}>{fmt(count)}</span></span>
      </div>
      <ul className="flex flex-col gap-1.5">
        {api.filter(a => !waiting.includes(a.name)).map(a => (
          <motion.li key={a.name} layout initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
            className={cx('flex flex-wrap items-baseline gap-x-2 rounded-lg bg-primary px-3 py-1.5 ring-1 ring-secondary ring-inset', fresh === a.name && 'ring-2 ring-brand')}>
            <code className={cx('font-mono text-sm font-bold', KIND_TEXT[a.kind])}>{a.name}</code>
            <span className="font-mono text-xs text-tertiary">{a.kind === 'enum' ? a.options!.map(o => `"${o}"`).join(' | ') : a.kind === 'slot' ? 'slot' : a.kind}</span>
          </motion.li>
        ))}
      </ul>
      {waiting.length > 0 && (
        <p className="text-xs leading-relaxed text-tertiary">
          Still the old props: {waiting.map((w, k) => <code key={w} className="font-mono">{w}{k < waiting.length - 1 ? ', ' : ''}</code>)}
        </p>
      )}
    </div>
  );
}

export function ApiBuild({ game, onDone }: { game: Game; onDone: (results: GameResult[]) => void }) {
  const [i, setI] = useState(0);
  const [picks, setPicks] = useState<Record<string, ApiKind>>({});
  const card = game.cards[i];
  const picked = card ? picks[card.id] : undefined;
  const decisions: ApiDecision[] = game.cards.map(c => ({ old: oldOf(c.label), visual: c.visual ?? '', kind: picks[c.id] }));
  const api = apiFrom(decisions);
  const waiting = decisions.filter(d => !d.kind).map(d => d.old);
  const laneLabel = (id: string) => game.lanes.find(l => l.id === id)?.label ?? id;

  if (!card) {
    const right = game.cards.filter(c => picks[c.id] === c.lane).length;
    return (
      <div className="relative flex flex-col items-center gap-5 py-6 text-center">
        <Burst count={36} />
        <StageTitle eyebrow="API designed" title={`${right} of ${game.cards.length} props turned into the right thing`}>
          Twelve props that allowed endless buttons became an API that describes {fmt(comboCount(api))}.
        </StageTitle>
        <div className="w-full max-w-lg text-left"><PropsPanel api={api} waiting={[]} /></div>
        <NibSays mood={comboCount(api) === 48 ? 'cheer' : 'idle'}>
          {comboCount(api) === 48 ? 'Forty-eight, and every one a button Rasta means to ship.' : 'The right API describes 48 buttons. Every extra one here is a combination nobody designed.'} One choice per enum, booleans for real states, slots for content, and tokens for the rest.
        </NibSays>
        <Button size="xl" onPress={() => onDone(game.cards.map(c => ({ id: c.id, correct: picks[c.id] === c.lane })))}>Continue the story</Button>
      </div>
    );
  }

  const ok = picked === card.lane;
  const pick = (kind: ApiKind) => { if (picked) return; play(kind === card.lane ? 'correct' : 'wrong'); setPicks(p => ({ ...p, [card.id]: kind })); };
  const [name] = (card.visual ?? '').split('=');
  const freshName = picked === 'enum' ? (card.visual?.includes('=') ? name : 'variant') : picked === 'fixed' ? undefined : picked === card.lane ? card.visual : oldOf(card.label);

  return (
    <div className="flex flex-col gap-5">
      <StageTitle eyebrow="Play" title={game.title}>{game.instructions}</StageTitle>
      <div className="flex items-baseline justify-between">
        <span className="text-sm font-semibold text-tertiary">Old prop</span>
        <span className="text-sm font-semibold text-tertiary tabular-nums">{i + 1} / {game.cards.length}</span>
      </div>
      <motion.div key={card.id} initial={{ y: -12, opacity: 0 }} animate={picked && !ok ? { x: [0, -10, 10, -6, 6, 0], opacity: 1, y: 0 } : { y: 0, opacity: 1 }} transition={{ duration: 0.4 }}
        className={cx('flex flex-col gap-1 rounded-2xl bg-primary px-5 py-4 shadow-lg ring-2 ring-inset', !picked ? 'ring-secondary' : ok ? 'ring-mint-600' : 'ring-error')} data-current-card>
        <code className="font-mono text-lg font-bold text-primary">{oldOf(card.label)}</code>
        <span className="text-md text-tertiary">{purposeOf(card.label)}</span>
      </motion.div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {game.lanes.map(l => (
          <motion.button key={l.id} type="button" onClick={() => pick(l.id as ApiKind)} disabled={!!picked} whileTap={{ scale: 0.96 }}
            className={cx('flex flex-col items-start gap-1 rounded-2xl bg-primary px-3 py-3 text-left ring-2 ring-secondary ring-inset transition disabled:cursor-default',
              !picked && 'hover:bg-primary_hover', picked && l.id !== picked && l.id !== card.lane && 'opacity-40', picked && l.id === card.lane && 'ring-mint-600', picked === l.id && !ok && 'ring-error')}>
            <span className="text-sm font-bold text-primary">{l.label}</span>
            <span className="text-xs leading-tight text-tertiary">{l.hint}</span>
          </motion.button>
        ))}
      </div>
      <PropsPanel api={api} waiting={waiting} fresh={freshName} />
      {picked && (
        <NibSays mood={ok ? 'cheer' : 'sad'}>
          <span className="inline-flex items-center gap-1 font-semibold">{ok ? <CheckIcon className="size-4" weight="bold" /> : <XIcon className="size-4" weight="bold" />}{laneLabel(card.lane)}.</span>{' '}
          {card.note}
        </NibSays>
      )}
      {picked && <div className="flex justify-end"><Button size="lg" onPress={() => setI(k => k + 1)}>{i + 1 < game.cards.length ? 'Next prop' : 'See the API'}</Button></div>}
    </div>
  );
}
