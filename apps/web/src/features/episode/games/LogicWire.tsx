'use client';
// Mini-game for pr.4-1: wire Thela's cart prototype. Every card is a behaviour Sana's test needs (its `visual`, a key
// of `THELA_BEHAVIOURS`). Wire it with a variable, a conditional or a mode (`WIRE_KINDS`, scored by `wireKind`). Right
// calls switch that behaviour on in a working cart beside the deck: + and − on three items, totals from `cartTotals`,
// the stock rule from `canAdd`, and toggles for the modes once they are wired. Until a behaviour is wired, the cart
// shows the static value a linked-frames mock would. First call scores; a missed card comes back later.
import { useState } from 'react';
import { motion } from 'motion/react';
import { MinusIcon, PlusIcon } from '@phosphor-icons/react/ssr';
import {
  THELA_BEHAVIOURS, THELA_ITEMS, THELA_ITEM_IDS, canAdd, cartTotals, wireKind,
  type Episode, type ThelaBehaviour, type ThelaItemId, type ThelaQty, type WireKind,
} from '@shape/content';
import { springs } from '@shape/ui';
import { Button } from '@/components/base/buttons/button';
import { cx } from '@/utils/cx';
import { Burst, NibSays, StageTitle } from '../kit';
import { WIRE_FILL } from '../scenes/LogicCart';
import type { GameResult } from './DiamondSort';
import { play } from '@/lib/sound';

type Game = Episode['game'];
const LABEL: Record<WireKind, string> = { variable: 'Variable', conditional: 'Conditional', mode: 'Mode' };
const rupee = (n: number) => `₹${n.toLocaleString('en-IN')}`;
const EN = { cart: 'Cart', saved: 'You saved', total: 'Total', fee: 'Small-cart fee', delivery: 'Delivery', free: 'Free delivery', more: (n: string) => `Add ${n} more for free delivery`, only: 'Only 2 left' };
const TE = { cart: 'బండి', saved: 'మీకు ఆదా', total: 'మొత్తం', fee: 'చిన్న బండి రుసుము', delivery: 'డెలివరీ', free: 'ఉచిత డెలివరీ', more: (n: string) => `ఉచిత డెలివరీకి ఇంకా ${n}`, only: '2 మాత్రమే ఉన్నాయి' };

/** A small switch row for a wired mode. */
function Toggle({ label, on, onChange, a, b }: { label: string; on: boolean; onChange: (v: boolean) => void; a: string; b: string }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="text-sm font-semibold text-secondary">{label}</span>
      <div className="flex rounded-full bg-secondary p-0.5" role="group" aria-label={label}>
        {[a, b].map((s, i) => (
          <button key={s} type="button" aria-pressed={on === (i === 1)} onClick={() => onChange(i === 1)}
            className={cx('min-h-9 rounded-full px-3 text-sm font-bold', on === (i === 1) ? 'text-white' : 'text-secondary')}
            style={on === (i === 1) ? { background: WIRE_FILL.mode } : undefined}>{s}</button>
        ))}
      </div>
    </div>
  );
}

/** The cart prototype, with only the wired behaviours working. */
function CartProto({ wired }: { wired: Set<ThelaBehaviour> }) {
  const [qty, setQty] = useState<ThelaQty>({ milk: 1, atta: 0, butter: 0 });
  const [te, setTe] = useState(false);
  const [plus, setPlus] = useState(false);
  const [returning, setReturning] = useState(false);
  const [coupon, setCoupon] = useState(false);
  const w = (b: ThelaBehaviour) => wired.has(b);
  const L = w('telugu') && te ? TE : EN;
  const c = cartTotals(qty, { plus: w('plus') && plus, coupon: w('coupon') && coupon });
  const delivery = w('freeDelivery') ? c.delivery : 0;
  const fee = w('smallCart') ? c.smallCartFee : 0;
  const total = c.subtotal + delivery + fee - (w('coupon') ? c.couponOff : 0);
  const stat = 'text-quaternary';
  const add = (id: ThelaItemId, d: number) => setQty(q => {
    const next = Math.max(0, (q[id] ?? 0) + d);
    if (d > 0 && !canAdd(q, id)) return q;
    return { ...q, [id]: next };
  });

  return (
    <div className="flex flex-col gap-3 rounded-2xl bg-secondary p-3">
      <div className="flex items-baseline justify-between">
        <span className="text-sm font-bold text-primary">Thela · cart prototype</span>
        <span className="text-xs font-semibold text-tertiary tabular-nums">{wired.size} / {Object.keys(THELA_BEHAVIOURS).length} wired</span>
      </div>
      <div className="flex flex-col gap-2.5 rounded-xl bg-primary p-3 ring-1 ring-secondary ring-inset">
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-primary">{L.cart}</span>
          <span className="min-w-9 rounded-full px-2.5 py-0.5 text-center text-sm font-bold text-white tabular-nums" style={{ background: w('badge') ? WIRE_FILL.variable : '#667085' }}>{w('badge') ? c.count : 3}</span>
        </div>
        {w('returning') && <p className="text-sm text-secondary">{returning ? 'Deliver to Flat 302, Sai Residency, Kukatpally' : 'Add a delivery address'}</p>}
        <ul className="flex flex-col gap-1.5">
          {THELA_ITEM_IDS.map(id => {
            const it = THELA_ITEMS[id];
            const full = w('stock') && !canAdd(qty, id);
            return (
              <li key={id} className="flex items-center justify-between gap-2">
                <span className="min-w-0 text-sm text-primary">
                  <span className="font-semibold">{L === TE ? it.te : it.name}</span> <span className="text-tertiary">{it.unit} · {rupee(w('plus') && plus ? it.plus : it.price)}</span>
                  {full && <span className="block text-xs font-bold text-warning-primary">{L.only}</span>}
                </span>
                <span className="flex shrink-0 items-center gap-1">
                  <button type="button" aria-label={`Remove one ${it.name}`} onClick={() => add(id, -1)} className="grid size-9 place-items-center rounded-lg border border-secondary text-primary"><MinusIcon size={16} weight="bold" /></button>
                  <span className="w-6 text-center text-sm font-bold text-primary tabular-nums">{qty[id]}</span>
                  <button type="button" aria-label={`Add one ${it.name}`} onClick={() => add(id, 1)} disabled={full} className="grid size-9 place-items-center rounded-lg border border-secondary text-primary disabled:opacity-40"><PlusIcon size={16} weight="bold" /></button>
                </span>
              </li>
            );
          })}
        </ul>
        {w('freeDelivery') && (
          <motion.p layout className="rounded-lg px-3 py-2 text-sm font-bold text-white" style={{ background: c.freeDeliveryNeed > 0 && c.count > 0 ? WIRE_FILL.conditional : '#067647' }}>
            {c.count === 0 ? '—' : c.freeDeliveryNeed > 0 ? L.more(rupee(c.freeDeliveryNeed)) : L.free}
          </motion.p>
        )}
        {w('coupon') && (
          <div className="flex items-center justify-between gap-2">
            <button type="button" aria-pressed={coupon} onClick={() => setCoupon(v => !v)} className={cx('min-h-9 rounded-lg border-2 px-3 text-sm font-bold', coupon ? 'border-mint-600 text-primary' : 'border-secondary text-secondary')}>FIRST50</button>
            {coupon && <span className="text-sm text-secondary">{c.couponApplied ? '−₹50' : `Add ${rupee(c.couponNeed)} more`}</span>}
          </div>
        )}
        <dl className="flex flex-col gap-1 border-t border-secondary pt-2 text-sm">
          {w('freeDelivery') && <div className="flex justify-between"><dt className="text-secondary">{L.delivery}</dt><dd className="font-semibold text-primary tabular-nums">{rupee(delivery)}</dd></div>}
          {w('smallCart') && fee > 0 && <div className="flex justify-between"><dt className="text-secondary">{L.fee}</dt><dd className="font-semibold text-primary tabular-nums">{rupee(fee)}</dd></div>}
          {w('savings') && <div className="flex justify-between"><dt className="text-secondary">{L.saved}</dt><dd className="font-semibold text-success-primary tabular-nums">{rupee(c.savings)}</dd></div>}
          <div className="flex justify-between text-md"><dt className="font-bold text-primary">{L.total}</dt><dd className={cx('font-bold tabular-nums', w('subtotal') ? 'text-primary' : stat)}>{w('subtotal') ? rupee(total) : '₹374'}</dd></div>
        </dl>
        {!w('subtotal') && <p className="text-xs text-tertiary">Grey values are typed into the frame. They won’t change until they’re wired.</p>}
      </div>
      {(w('telugu') || w('plus') || w('returning')) && (
        <div className="flex flex-col gap-2">
          {w('telugu') && <Toggle label="Language" on={te} onChange={setTe} a="English" b="తెలుగు" />}
          {w('plus') && <Toggle label="Member" on={plus} onChange={setPlus} a="Regular" b="Plus" />}
          {w('returning') && <Toggle label="Customer" on={returning} onChange={setReturning} a="New" b="Returning" />}
        </div>
      )}
    </div>
  );
}

export function LogicWire({ game, onDone }: { game: Game; onDone: (results: GameResult[]) => void }) {
  const [deck, setDeck] = useState(game.cards);
  const [results, setResults] = useState<Record<string, boolean>>({});
  const [wired, setWired] = useState<Set<ThelaBehaviour>>(new Set());
  const [miss, setMiss] = useState<WireKind | null>(null);
  const [right, setRight] = useState(false);
  const card = deck[0];

  if (!card) {
    const n = Object.values(results).filter(Boolean).length;
    return (
      <div className="relative flex flex-col gap-5 py-6">
        <Burst count={36} />
        <StageTitle eyebrow="Cart wired" title={`${n} of ${game.cards.length} right first time`}>
          One frame, a handful of variables, four rules and three modes. Add things in any order: the total is right every time.
        </StageTitle>
        <CartProto wired={wired} />
        <NibSays mood={n === game.cards.length ? 'cheer' : 'idle'}>Variables remember, conditionals decide, modes swap whole sets. Now Sana’s test measures the cart, not the prototype.</NibSays>
        <Button size="xl" onPress={() => onDone(game.cards.map(c => ({ id: c.id, correct: !!results[c.id] })))}>Continue the story</Button>
      </div>
    );
  }

  const k = card.visual as ThelaBehaviour;
  const b = THELA_BEHAVIOURS[k];
  const lane = wireKind(b);
  const done = game.cards.length - deck.length;
  const call = (laneId: string) => {
    if (miss || right) return;
    const ok = laneId === lane;
    play(ok ? 'correct' : 'wrong');
    setResults(rs => (card.id in rs ? rs : { ...rs, [card.id]: ok }));
    if (ok) { setRight(true); setWired(ws => new Set(ws).add(k)); }
    else { setMiss(laneId as WireKind); setTimeout(() => { setMiss(null); setDeck(dk => [...dk.slice(1), dk[0]]); }, 3600); }
  };
  const next = () => { setRight(false); setDeck(dk => dk.slice(1)); };

  return (
    <div className="flex flex-col gap-5">
      <StageTitle eyebrow="Play" title={game.title}>{game.instructions}</StageTitle>
      <div className="flex items-baseline justify-between">
        <span className="text-sm font-semibold text-tertiary">Sana’s test needs</span>
        <span className="text-sm font-semibold text-tertiary tabular-nums">{done} / {game.cards.length}</span>
      </div>
      <motion.div key={`${card.id}-${deck.length}`} initial={{ y: 24, opacity: 0 }}
        animate={miss ? { x: [0, -10, 10, -6, 6, 0], y: 0, opacity: 1 } : { y: 0, opacity: 1 }}
        transition={miss ? { duration: 0.4 } : springs.pop}
        className={cx('flex flex-col gap-3 rounded-2xl bg-primary p-4 shadow-lg ring-2 ring-inset sm:p-5', miss ? 'ring-error' : right ? 'ring-mint-600' : 'ring-secondary')} data-current-card>
        <span className="text-xs font-bold tracking-wide text-tertiary uppercase">Behaviour</span>
        <p className="text-lg font-semibold text-primary">{card.label}</p>
        {right && (
          <motion.p initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={springs.pop}
            className="rounded-lg bg-secondary px-3 py-2 font-mono text-sm break-words text-primary" style={{ boxShadow: `inset 3px 0 0 ${WIRE_FILL[lane]}` }}>
            {b.wires}
          </motion.p>
        )}
      </motion.div>
      <div className="grid grid-cols-3 gap-2" role="group" aria-label="What to wire it with">
        {game.lanes.map(l => (
          <motion.button key={l.id} type="button" onClick={() => call(l.id)} disabled={!!miss || right} whileTap={{ scale: 0.97 }}
            className={cx('flex flex-col items-start gap-0.5 rounded-xl border-2 bg-primary px-3 py-2.5 text-left transition enabled:hover:bg-primary_hover disabled:cursor-default',
              right && l.id === lane ? 'border-mint-600' : miss === l.id ? 'border-error' : miss && l.id === lane ? 'border-mint-600' : 'border-secondary')}>
            <span className="flex items-center gap-1.5 text-md font-bold text-primary"><span className="size-2.5 shrink-0 rounded-sm" style={{ background: WIRE_FILL[l.id as WireKind] }} aria-hidden />{l.label}</span>
            <span className="text-xs font-medium text-tertiary">{l.hint}</span>
          </motion.button>
        ))}
      </div>
      <div className="min-h-14" aria-live="polite">
        {miss && <NibSays mood="sad">Not a {LABEL[miss].toLowerCase()}: this one is a <strong>{LABEL[lane].toLowerCase()}</strong>. {card.note} It’ll come back round.</NibSays>}
        {right && (
          <div className="flex flex-col gap-3">
            <NibSays mood="cheer">{card.note} Try it in the cart below.</NibSays>
            <div className="flex justify-end"><Button size="lg" onPress={next}>{deck.length > 1 ? 'Next behaviour' : 'Play with the cart'}</Button></div>
          </div>
        )}
        {!miss && !right && <NibSays mood="think">Does it swap a whole set of values? A mode. Does it compare a value and branch? A conditional. Otherwise it just remembers.</NibSays>}
      </div>
      <CartProto wired={wired} />
    </div>
  );
}
