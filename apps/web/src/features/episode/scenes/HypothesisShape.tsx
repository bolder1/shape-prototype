'use client';
// Scene for gr.3-1: Tokri's Monday meeting fires ideas straight into tests, and the green Pay button comes back flat
// (8.0% against 8.1%) with nothing learned. Ananya finds the evidence in session recordings (31% of dropped carts stop
// where the ₹25 fee first appears), and the hypothesis builds part by part from `HYPO_PARTS`: because, we believe, for,
// will. The cart on the phone gains its fee line, the checkout gauge sets its target, and the scene ends on what a win
// and a flat result would each teach. `TokriPhone`, `TOKRI`, `HYPO_FILL` and `HYPO_LEAD` are shared with the other gr.3
// scenes and games. Pure function of t (0–36).
import { HYPO_PARTS, type HypoPart } from '@shape/content';
import { back, clamp, Grid, p, SC } from './shared';
import { INK, INK_MUTED } from './EaseCurves';

const W = 960, H = 540;
/** Tokri's brand colour, a deep leaf green; white text on it passes 4.5:1 (about 7.5:1). */
export const TOKRI = '#05603A';
export const TOKRI_SOFT = '#DCFAE6';
/** One fill per hypothesis part; white text on each passes 4.5:1. */
export const HYPO_FILL: Record<HypoPart, string> = { because: '#175CD3', change: '#6941C6', who: '#B54708', expect: '#067647' };
export const HYPO_LEAD: Record<HypoPart, string> = { because: 'Because', change: 'We believe', who: 'For', expect: 'Will' };
export const PHONE_W = 220, PHONE_H = 420;

/** Tokri on a phone, 220 × 420, with a header bar. Children draw on the white screen below the header (y from 56). */
export function TokriPhone({ title, children }: { title: string; children?: React.ReactNode }) {
  return (
    <g>
      <rect width={PHONE_W} height={PHONE_H} rx={30} fill="#101828" />
      <rect x={8} y={8} width={PHONE_W - 16} height={PHONE_H - 16} rx={24} fill="#FFFFFF" />
      <path d={`M8 32 Q8 8 32 8 L${PHONE_W - 32} 8 Q${PHONE_W - 8} 8 ${PHONE_W - 8} 32 L${PHONE_W - 8} 52 L8 52 Z`} fill={TOKRI} />
      <text x={PHONE_W / 2} y={37} textAnchor="middle" fontSize={14} fontWeight={900} fill="#FFFFFF">{title}</text>
      {children}
    </g>
  );
}

const ITEMS = [{ name: 'Tomatoes, 1 kg', price: 38 }, { name: 'Aashirvaad atta, 5 kg', price: 245 }, { name: 'Amul milk, 1 L', price: 66 }, { name: 'Bananas, 6', price: 42 }];
const SUBTOTAL = ITEMS.reduce((s, i) => s + i.price, 0);

/** Tokri's cart: four items, and the ₹25 fee line once `fee` is on. */
function Cart({ fee = 0, pay = false }: { fee?: number; pay?: boolean }) {
  return (
    <g>
      {ITEMS.map((it, i) => (
        <g key={it.name} transform={`translate(22 ${70 + i * 40})`}>
          <rect width={176} height={32} rx={8} fill="#F2F4F7" />
          <text x={10} y={21} fontSize={11} fontWeight={800} fill={INK}>{it.name}</text>
          <text x={166} y={21} textAnchor="end" fontSize={11} fontWeight={800} fill={INK}>₹{it.price}</text>
        </g>
      ))}
      <g transform="translate(22 240)">
        <text x={0} y={14} fontSize={11} fontWeight={700} fill={INK_MUTED}>Items</text>
        <text x={176} y={14} textAnchor="end" fontSize={11} fontWeight={700} fill={INK_MUTED}>₹{SUBTOTAL}</text>
        <g opacity={fee}>
          <rect x={-6} y={22} width={188} height={24} rx={6} fill={TOKRI_SOFT} />
          <text x={0} y={38} fontSize={11} fontWeight={900} fill={TOKRI}>Delivery fee</text>
          <text x={176} y={38} textAnchor="end" fontSize={11} fontWeight={900} fill={TOKRI}>₹25</text>
        </g>
        <text x={0} y={72} fontSize={13} fontWeight={900} fill={INK}>Total</text>
        <text x={176} y={72} textAnchor="end" fontSize={13} fontWeight={900} fill={INK}>₹{SUBTOTAL + (fee > 0.5 ? 25 : 0)}</text>
      </g>
      <rect x={22} y={336} width={176} height={36} rx={18} fill={pay ? '#12B76A' : TOKRI} />
      <text x={110} y={359} textAnchor="middle" fontSize={12} fontWeight={900} fill={pay ? INK : '#FFFFFF'}>{pay ? 'Pay' : 'Checkout'}</text>
    </g>
  );
}

/** The payment page, where the fee used to appear for the first time. */
function Payment({ hot = 0 }: { hot?: number }) {
  return (
    <g>
      <text x={22} y={86} fontSize={12} fontWeight={900} fill={INK}>Pay with</text>
      {['UPI · PhonePe', 'UPI · Google Pay', 'Cash on delivery'].map((m, i) => (
        <g key={m} transform={`translate(22 ${100 + i * 38})`}>
          <rect width={176} height={30} rx={8} fill="#F2F4F7" />
          <text x={10} y={20} fontSize={11} fontWeight={800} fill={INK}>{m}</text>
        </g>
      ))}
      <g transform="translate(22 232)">
        <text x={0} y={14} fontSize={11} fontWeight={700} fill={INK_MUTED}>Items ₹{SUBTOTAL}</text>
        <rect x={-6} y={22} width={188} height={26} rx={6} fill="#FEE4E2" opacity={hot} />
        <text x={0} y={40} fontSize={12} fontWeight={900} fill="#B42318">+ Delivery fee ₹25</text>
        <text x={0} y={72} fontSize={13} fontWeight={900} fill={INK}>Total ₹{SUBTOTAL + 25}</text>
      </g>
    </g>
  );
}

/** Short versions of the fee hypothesis, for the scene. */
const SHORT: Record<HypoPart, string> = {
  because: '31% of dropped carts stop where the ₹25 fee first appears,',
  change: 'showing the fee on the cart',
  who: 'people who reach the cart',
  expect: 'lift checkout conversion from 8% to at least 8.8%.',
};
const FILL_AT: Record<HypoPart, number> = { because: 13, change: 17, who: 18.8, expect: 22 };

function Sentence({ t, x, y }: { t: number; x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      {HYPO_PARTS.map((part, i) => {
        const k = p(t, FILL_AT[part], FILL_AT[part] + 0.6);
        return (
          <g key={part} transform={`translate(0 ${i * 58})`}>
            <rect width={560} height={46} rx={12} fill={SC.surface} stroke={k > 0.5 ? HYPO_FILL[part] : SC.line} strokeWidth={k > 0.5 ? 2 : 1} />
            <rect x={8} y={9} width={104} height={28} rx={14} fill={HYPO_FILL[part]} opacity={0.25 + 0.75 * k} />
            <text x={60} y={28} textAnchor="middle" fontSize={12} fontWeight={900} fill="#FFFFFF">{HYPO_LEAD[part]}</text>
            <text x={124} y={29} fontSize={14} fontWeight={800} fill={SC.text} opacity={k}>{SHORT[part]}</text>
            {k < 0.5 && <text x={124} y={29} fontSize={14} fontWeight={700} fill={SC.muted}>…</text>}
          </g>
        );
      })}
    </g>
  );
}

const IDEAS = ['Make the Pay button green', 'A bigger offers banner', 'A new font for prices'];

export function HypothesisShapeScene({ t }: { t: number }) {
  const intro = clamp(back(t / 0.6));
  const target = p(t, 22.6, 24);
  const phoneTitle = t >= 11 && t < 16 ? 'Payment' : 'Cart';

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" role="img" aria-label="Animated story: Tokri's team turns ideas like a green Pay button straight into tests, and the green button comes back flat at 8.0% against 8.1% with nothing learned; session recordings show 31% of dropped carts stop on the payment page where the ₹25 delivery fee first appears; the hypothesis builds in four parts: because of that evidence, we believe showing the fee on the cart, for people who reach the cart, will lift checkout conversion from 8% to at least 8.8%; a win means ship it, a flat result means fee shock wasn't the reason">
      <rect width={W} height={H} fill={SC.soft} />
      <Grid />
      <g opacity={intro}>
        <text x={330} y={56} fontSize={22} fontWeight={900} fill={SC.text}>
          {t < 6 ? 'Make it green' : t < 11 ? 'Flat, and nothing learned' : t < 16 ? 'Because: start from what you saw' : t < 21 ? 'One change, the right people' : t < 26 ? 'Will: a metric and a size' : t < 31 ? 'The whole sentence' : 'Either way, you learn'}
        </text>

        <g transform="translate(60 70)">
          <TokriPhone title={phoneTitle}>
            {phoneTitle === 'Payment' ? <Payment hot={p(t, 12, 12.8)} /> : <Cart fee={t >= 16 ? p(t, 16.4, 17.2) : 0} pay={t < 11} />}
          </TokriPhone>
        </g>

        {t < 6 && (
          <g transform="translate(330 100)">
            {IDEAS.map((idea, i) => {
              const k = p(t, 0.6 + i * 1.2, 1.2 + i * 1.2);
              return (
                <g key={idea} transform={`translate(${i % 2 ? 30 : 0} ${i * 96})`} opacity={k}>
                  <rect width={300} height={64} rx={8} fill="#FEF0C7" transform={`rotate(${i % 2 ? 1.5 : -1.5} 150 32)`} />
                  <text x={20} y={38} fontSize={16} fontWeight={800} fill={INK}>{idea}</text>
                  <path d="M316 32 L370 32" stroke={SC.muted} strokeWidth={2.5}/>
                  <path d="M362 25 L372 32 L362 39" stroke={SC.muted} strokeWidth={2.5} fill="none" />
                  <rect x={384} y={14} width={108} height={36} rx={18} fill={SC.surface} stroke={SC.line} />
                  <text x={438} y={37} textAnchor="middle" fontSize={13} fontWeight={900} fill={SC.text}>Test it!</text>
                </g>
              );
            })}
          </g>
        )}

        {t >= 6 && t < 11 && (
          <g transform="translate(330 96)">
            <g opacity={p(t, 6.2, 6.8)}>
              <rect width={540} height={170} rx={16} fill={SC.surface} stroke={SC.line} />
              <text x={24} y={38} fontSize={15} fontWeight={900} fill={SC.text}>Green Pay button · 2 weeks</text>
              {[{ l: 'A, today', v: 8.0 }, { l: 'B, green', v: 8.1 }].map((r, i) => (
                <g key={r.l} transform={`translate(24 ${64 + i * 44})`}>
                  <text x={0} y={20} fontSize={13} fontWeight={800} fill={SC.muted}>{r.l}</text>
                  <rect x={96} y={4} width={330 * (r.v / 10) * p(t, 6.6 + i * 0.3, 7.6 + i * 0.3)} height={22} rx={6} fill={i ? '#12B76A' : TOKRI} />
                  <text x={440} y={21} fontSize={14} fontWeight={900} fill={SC.text}>{r.v.toFixed(1)}%</text>
                </g>
              ))}
            </g>
            <g opacity={p(t, 8.2, 8.8)}>
              <text x={0} y={226} fontSize={20} fontWeight={900} fill={SC.text}>So what did we learn?</text>
              <text x={0} y={258} fontSize={16} fontWeight={800} fill={SC.muted}>Nobody had said what they expected, or why.</text>
              <text x={0} y={284} fontSize={16} fontWeight={800} fill={SC.muted}>Nine of eleven tests last quarter ended like this.</text>
            </g>
          </g>
        )}

        {t >= 11 && t < 16 && (
          <g transform="translate(330 96)">
            <g opacity={p(t, 11.2, 11.8)}>
              <text x={0} y={0} fontSize={15} fontWeight={800} fill={SC.muted}>Where last month’s dropped carts stopped</text>
              {[{ l: 'Cart', v: 22 }, { l: 'Delivery slot', v: 19 }, { l: 'Address', v: 28 }, { l: 'Payment', v: 31 }].map((r, i) => (
                <g key={r.l} transform={`translate(0 ${22 + i * 40})`}>
                  <text x={0} y={20} fontSize={13} fontWeight={800} fill={SC.text}>{r.l}</text>
                  <rect x={120} y={4} width={9 * r.v * p(t, 11.6 + i * 0.2, 12.6 + i * 0.2)} height={22} rx={6} fill={r.l === 'Payment' ? '#B42318' : SC.line} />
                  <text x={130 + 9 * r.v} y={21} fontSize={13} fontWeight={900} fill={SC.text} opacity={p(t, 12.6, 13)}>{r.v}%</text>
                </g>
              ))}
            </g>
            <g opacity={p(t, 12.6, 13.2)} transform="translate(0 196)">
              <rect width={104} height={28} rx={14} fill={HYPO_FILL.because} />
              <text x={52} y={19} textAnchor="middle" fontSize={12} fontWeight={900} fill="#FFFFFF">Because</text>
              <text x={118} y={19} fontSize={15} fontWeight={800} fill={SC.text}>the payment page is where the ₹25 fee first appears.</text>
              <text x={118} y={46} fontSize={14} fontWeight={700} fill={SC.muted}>Evidence about Tokri’s own customers, not an opinion.</text>
            </g>
          </g>
        )}

        {t >= 16 && t < 26 && <Sentence t={t} x={330} y={96} />}
        {t >= 21 && t < 26 && (
          <g transform="translate(330 350)" opacity={p(t, 22.2, 22.8)}>
            <text x={0} y={18} fontSize={14} fontWeight={800} fill={SC.muted}>Checkout conversion</text>
            <rect x={0} y={32} width={500} height={24} rx={12} fill={SC.line} />
            <rect x={0} y={32} width={500 * 0.8} height={24} rx={12} fill={SC.muted} />
            <rect x={500 * 0.8} y={32} width={500 * 0.08 * target} height={24} fill={HYPO_FILL.expect} />
            <text x={0} y={84} fontSize={14} fontWeight={900} fill={SC.text}>8% today</text>
            <text x={500 * 0.88} y={84} textAnchor="middle" fontSize={14} fontWeight={900} fill={HYPO_FILL.expect} opacity={target}>at least 8.8%</text>
            <text x={0} y={112} fontSize={14} fontWeight={700} fill={SC.muted} opacity={p(t, 24, 24.6)}>The size tells Kavya how big a test to run, and what counts as a win.</text>
          </g>
        )}

        {t >= 26 && t < 31 && (
          <g transform="translate(330 96)">
            {HYPO_PARTS.map((part, i) => (
              <g key={part} transform={`translate(0 ${i * 72})`} opacity={p(t, 26.2 + i * 0.5, 26.8 + i * 0.5)}>
                <rect width={8} height={56} rx={4} fill={HYPO_FILL[part]} />
                <text x={22} y={22} fontSize={13} fontWeight={900} fill={HYPO_FILL[part]}>{HYPO_LEAD[part].toUpperCase()}</text>
                <text x={22} y={46} fontSize={16} fontWeight={800} fill={SC.text}>{SHORT[part]}</text>
              </g>
            ))}
            <text x={0} y={318} fontSize={14} fontWeight={700} fill={SC.muted} opacity={p(t, 28.6, 29.2)}>Written down before the test starts.</text>
          </g>
        )}

        {t >= 31 && (
          <g transform="translate(330 110)">
            {[{ head: 'If it wins', body: ['Ship the fee on the cart.', 'The reason held: fee shock lost carts.'], fill: '#067647' },
              { head: 'If it’s flat', body: ['Fee shock wasn’t why people left,', 'at least not by that much. Next:', 'the address step, at 28%.'], fill: '#475467' }].map((b, i) => (
              <g key={b.head} transform={`translate(${i * 285} 0)`} opacity={p(t, 31.2 + i * 0.8, 31.8 + i * 0.8)}>
                <rect width={265} height={200} rx={16} fill={SC.surface} stroke={SC.line} />
                <rect x={18} y={18} width={120} height={30} rx={15} fill={b.fill} />
                <text x={78} y={38} textAnchor="middle" fontSize={13} fontWeight={900} fill="#FFFFFF">{b.head}</text>
                {b.body.map((line, k) => <text key={line} x={18} y={86 + k * 26} fontSize={15} fontWeight={800} fill={SC.text}>{line}</text>)}
              </g>
            ))}
            <text x={0} y={250} fontSize={16} fontWeight={800} fill={SC.muted} opacity={p(t, 33, 33.6)}>Either result teaches the team something.</text>
          </g>
        )}
      </g>
    </svg>
  );
}
