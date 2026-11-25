'use client';
// Mini-game for cw.3-2: run Taar's quarterly content audit. Every card is an item in the help centre (its `visual`, a
// key of `TAAR_AUDIT`), shown with the facts the audit reads: views, its review date against the cadence for its kind
// (`REVIEW_DAYS`, `reviewDue`), and whether it is still true, a duplicate or required. Keep, refresh, merge or retire
// it (`AUDIT_CALLS`, scored by `auditCall`). Right calls show what happens next: the owner and review date
// (`KIND_OWNER`), or the redirect. A tally of the help centre updates as you go. First call scores; a missed card comes
// back later.
import { useState } from 'react';
import { motion } from 'motion/react';
import { AUDIT_CALLS, KIND_OWNER, LOW_VIEWS, REVIEW_DAYS, TAAR_AUDIT, auditCall, reviewDue, type AuditCall, type AuditItem, type Episode, type TaarAuditItem } from '@shape/content';
import { springs } from '@shape/ui';
import { Button } from '@/components/base/buttons/button';
import { cx } from '@/utils/cx';
import { Burst, NibSays, StageTitle } from '../kit';
import { CALL_FILL, KIND_LABEL } from '../scenes/ContentLifecycle';
import type { GameResult } from './DiamondSort';
import { play } from '@/lib/sound';

type Game = Episode['game'];
const LABEL: Record<AuditCall, string> = { keep: 'Keep', refresh: 'Refresh', merge: 'Merge', retire: 'Retire' };

/** The facts the audit reads for an item. */
function facts(i: AuditItem) {
  const due = reviewDue(i);
  const rows: { text: string; flag?: boolean }[] = [
    { text: `${i.views.toLocaleString('en-IN')} views a month`, flag: i.views < LOW_VIEWS },
    { text: `Reviewed ${i.daysSinceReview} days ago · ${KIND_LABEL[i.kind]} is reviewed every ${REVIEW_DAYS[i.kind]}`, flag: due < 0 },
  ];
  if (i.gone) rows.unshift({ text: 'What it describes no longer exists', flag: true });
  if (i.duplicateOf) rows.unshift({ text: `Same task as “${i.duplicateOf}”`, flag: true });
  if (i.required) rows.push({ text: 'Required by Taar’s licence' });
  return rows;
}

/** What happens to an item after the call. */
function outcome(i: AuditItem, c: AuditCall) {
  const due = reviewDue(i);
  if (c === 'keep') return `Stays live. ${KIND_OWNER[i.kind]} reviews it in ${due} days.`;
  if (c === 'refresh') return `${KIND_OWNER[i.kind]} rechecks it now: ${-due} days overdue. Next review ${REVIEW_DAYS[i.kind]} days after.`;
  if (c === 'merge') return `Merged into “${i.duplicateOf}”. The URL redirects there.`;
  return `Unpublished, redirected to “${i.redirect}”, and removed from Taar Assist’s index.`;
}

export function RotAudit({ game, onDone }: { game: Game; onDone: (results: GameResult[]) => void }) {
  const [deck, setDeck] = useState(game.cards);
  const [results, setResults] = useState<Record<string, boolean>>({});
  const [called, setCalled] = useState<TaarAuditItem[]>([]);
  const [miss, setMiss] = useState<AuditCall | null>(null);
  const [right, setRight] = useState(false);
  const card = deck[0];
  const callOf = (k: TaarAuditItem) => auditCall(TAAR_AUDIT[k]);

  const all = Object.keys(TAAR_AUDIT) as TaarAuditItem[];
  const gone = called.filter(k => ['merge', 'retire'].includes(callOf(k))).length;
  const overdue = all.filter(k => !called.includes(k) && (TAAR_AUDIT[k].gone || reviewDue(TAAR_AUDIT[k]) < 0)).length;
  const tally = (
    <div className="flex flex-col gap-2 rounded-2xl bg-secondary p-3">
      <span className="text-sm font-bold text-primary">Help centre health</span>
      <div className="grid grid-cols-2 gap-2">
        <div className="rounded-xl bg-primary px-3 py-2"><span className="block text-display-xs font-semibold text-primary tabular-nums">{all.length - gone}</span><span className="text-sm text-tertiary">items live</span></div>
        <div className="rounded-xl bg-primary px-3 py-2"><span className={cx('block text-display-xs font-semibold tabular-nums', overdue ? 'text-error-primary' : 'text-primary')}>{overdue}</span><span className="text-sm text-tertiary">still overdue or untrue</span></div>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {AUDIT_CALLS.map(c => (
          <span key={c} className="rounded-full px-2.5 py-0.5 text-xs font-bold text-white" style={{ background: CALL_FILL[c] }}>{LABEL[c]} · {called.filter(k => callOf(k) === c).length}</span>
        ))}
      </div>
    </div>
  );

  if (!card) {
    const n = Object.values(results).filter(Boolean).length;
    return (
      <div className="relative flex flex-col gap-5 py-6">
        <Burst count={36} />
        <StageTitle eyebrow="Audit done" title={`${n} of ${game.cards.length} right first time`}>
          Untrue items retired with redirects, duplicates merged, overdue items back with their owners, and the rest left alone until their date.
        </StageTitle>
        {tally}
        <NibSays mood={n === game.cards.length ? 'cheer' : 'idle'}>Fix the rule as well as the item: outage notices that expire on their own can’t sit on the home page until November.</NibSays>
        <Button size="xl" onPress={() => onDone(game.cards.map(c => ({ id: c.id, correct: !!results[c.id] })))}>Continue the story</Button>
      </div>
    );
  }

  const k = card.visual as TaarAuditItem;
  const it = TAAR_AUDIT[k];
  const lane = callOf(k);
  const done = game.cards.length - deck.length;
  const call = (laneId: string) => {
    if (miss || right) return;
    const ok = laneId === lane;
    play(ok ? 'correct' : 'wrong');
    setResults(rs => (card.id in rs ? rs : { ...rs, [card.id]: ok }));
    if (ok) { setRight(true); setCalled(cs => [...cs, k]); }
    else { setMiss(laneId as AuditCall); setTimeout(() => { setMiss(null); setDeck(dk => [...dk.slice(1), dk[0]]); }, 3600); }
  };
  const next = () => { setRight(false); setDeck(dk => dk.slice(1)); };

  return (
    <div className="flex flex-col gap-5">
      <StageTitle eyebrow="Play" title={game.title}>{game.instructions}</StageTitle>
      <div className="flex items-baseline justify-between">
        <span className="text-sm font-semibold text-tertiary">Quarterly audit · November</span>
        <span className="text-sm font-semibold text-tertiary tabular-nums">{done} / {game.cards.length}</span>
      </div>
      <motion.div key={`${card.id}-${deck.length}`} initial={{ y: 24, opacity: 0 }}
        animate={miss ? { x: [0, -10, 10, -6, 6, 0], y: 0, opacity: 1 } : { y: 0, opacity: 1 }}
        transition={miss ? { duration: 0.4 } : springs.pop}
        className={cx('flex flex-col gap-3 rounded-2xl bg-primary p-4 shadow-lg ring-2 ring-inset sm:p-5', miss ? 'ring-error' : right ? 'ring-mint-600' : 'ring-secondary')} data-current-card>
        <span className="text-xs font-bold tracking-wide text-tertiary uppercase">{KIND_LABEL[it.kind]} · owner {KIND_OWNER[it.kind]}</span>
        <p className="text-lg font-semibold text-primary">{card.label}</p>
        <ul className="flex flex-col gap-1">
          {facts(it).map(f => (
            <li key={f.text} className={cx('flex items-start gap-2 text-sm', f.flag ? 'font-semibold text-primary' : 'text-secondary')}>
              <span aria-hidden className={cx('mt-1.5 size-2 shrink-0 rounded-full', f.flag ? 'bg-error-solid' : 'bg-quaternary')} />{f.text}
            </li>
          ))}
        </ul>
        {right && (
          <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={springs.pop}
            className="rounded-lg px-3 py-2 text-sm font-semibold text-primary" style={{ boxShadow: `inset 3px 0 0 ${CALL_FILL[lane]}` }}>
            {outcome(it, lane)}
          </motion.p>
        )}
      </motion.div>
      <div className="grid grid-cols-2 gap-2" role="group" aria-label="What the audit does with it">
        {game.lanes.map(l => (
          <motion.button key={l.id} type="button" onClick={() => call(l.id)} disabled={!!miss || right} whileTap={{ scale: 0.97 }}
            className={cx('flex flex-col items-start gap-0.5 rounded-xl border-2 bg-primary px-3 py-2.5 text-left transition enabled:hover:bg-primary_hover disabled:cursor-default',
              right && l.id === lane ? 'border-mint-600' : miss === l.id ? 'border-error' : miss && l.id === lane ? 'border-mint-600' : 'border-secondary')}>
            <span className="flex items-center gap-1.5 text-md font-bold text-primary"><span className="size-2.5 shrink-0 rounded-sm" style={{ background: CALL_FILL[l.id as AuditCall] }} aria-hidden />{l.label}</span>
            <span className="text-xs font-medium text-tertiary">{l.hint}</span>
          </motion.button>
        ))}
      </div>
      <div className="min-h-14" aria-live="polite">
        {miss && <NibSays mood="sad">Not {LABEL[miss].toLowerCase()}: this one is <strong>{LABEL[lane].toLowerCase()}</strong>. {card.note} It’ll come back round.</NibSays>}
        {right && (
          <div className="flex flex-col gap-3">
            <NibSays mood="cheer">{card.note}</NibSays>
            <div className="flex justify-end"><Button size="lg" onPress={next}>{deck.length > 1 ? 'Next item' : 'See the help centre'}</Button></div>
          </div>
        )}
        {!miss && !right && <NibSays mood="think">In order: is it still true? Does it repeat another item? Does anyone need it? Is it past its review date?</NibSays>}
      </div>
      {tally}
    </div>
  );
}
