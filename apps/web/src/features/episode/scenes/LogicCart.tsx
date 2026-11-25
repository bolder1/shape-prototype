'use client';
// Scene for pr.4-1: Thela's cart prototype was 14 linked frames, and Lakshmi taps in an order nobody planned for. Then
// the cart gets memory (number variables set by expressions), decisions (a conditional on the ₹199 rule), stacked
// rules, modes that swap whole sets of values, and any order of taps working, all from `cartTotals`. Pure function of
// t (0–36). Also exports `WIRE_FILL`, which `logic-wire` uses.
import { CART_RULES, THELA_ITEMS, cartTotals, type ThelaQty, type WireKind } from '@shape/content';
import { back, clamp, Grid, lerp, p, SC } from './shared';

const W = 640, H = 360;
/** One fill per wire kind; white text on each passes 4.5:1. */
export const WIRE_FILL: Record<WireKind, string> = { variable: '#175CD3', conditional: '#B54708', mode: '#6941C6' };
const MONO = 'ui-monospace, SFMono-Regular, Menlo, monospace';
const rupee = (n: number) => `₹${n.toLocaleString('en-IN')}`;

/** The cart as a phone, for a set of quantities. `te` shows Telugu names. */
function Cart({ x, y, qty, te = false, plus = false, o = 1 }: { x: number; y: number; qty: ThelaQty; te?: boolean; plus?: boolean; o?: number }) {
  const c = cartTotals(qty, { plus });
  const bar = c.freeDeliveryNeed > 0 && c.count > 0;
  return (
    <g opacity={o}>
      <rect x={x} y={y} width={250} height={262} rx={22} fill={SC.surface} stroke={SC.line} strokeWidth={2} />
      <text x={x + 18} y={y + 34} fontSize={21} fontWeight={900} fill={SC.text}>{te ? 'బండి' : 'Cart'}</text>
      <rect x={x + 192} y={y + 14} width={40} height={28} rx={14} fill={WIRE_FILL.variable} />
      <text x={x + 212} y={y + 35} fontSize={21} fontWeight={900} fill="#fff" textAnchor="middle">{c.count}</text>
      {(['milk', 'atta', 'butter'] as const).map((id, i) => (
        <g key={id}>
          <text x={x + 18} y={y + 74 + i * 34} fontSize={21} fontWeight={700} fill={SC.text}>{te ? THELA_ITEMS[id].te : THELA_ITEMS[id].name}</text>
          <text x={x + 232} y={y + 74 + i * 34} fontSize={21} fontWeight={800} fill={SC.muted} textAnchor="end">×{qty[id]}</text>
        </g>
      ))}
      <rect x={x + 14} y={y + 170} width={222} height={34} rx={8} fill={bar ? WIRE_FILL.conditional : '#067647'} />
      <text x={x + 125} y={y + 194} fontSize={21} fontWeight={800} fill="#fff" textAnchor="middle">{c.count === 0 ? 'Empty' : bar ? `Add ${rupee(c.freeDeliveryNeed)} more` : 'Free delivery'}</text>
      <text x={x + 18} y={y + 240} fontSize={22} fontWeight={900} fill={SC.text}>{plus ? 'Plus · ' : ''}Total</text>
      <text x={x + 232} y={y + 240} fontSize={22} fontWeight={900} fill={SC.text} textAnchor="end">{rupee(c.total)}</text>
    </g>
  );
}

/** Taps over time: butter, then milk, then atta (an order the 14 frames never planned for). */
function tapsAt(k: number): ThelaQty {
  return { butter: k > 0.15 ? 1 : 0, milk: k > 0.45 ? 1 : 0, atta: k > 0.75 ? 1 : 0 };
}

export function LogicCartScene({ t }: { t: number }) {
  const intro = clamp(back(t / 0.6));
  const title = t < 6 ? 'Fourteen frames' : t < 11 ? 'Give it memory' : t < 16 ? 'Let it decide' : t < 21 ? 'Rules stack' : t < 26 ? 'Switch whole sets' : t < 31 ? 'Any order works' : 'Now the test is real';
  const r = CART_RULES;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" role="img" aria-label={`Animated story: Thela's cart prototype is 14 linked frames, one per expected cart, and a participant who adds butter first lands on a frame with the wrong total. Number variables, itemCount and subtotal, give it memory: each plus button sets subtotal to subtotal plus the price. A conditional checks if the subtotal is under ₹${r.freeDeliveryAt} and shows how much more is needed for free delivery. More rules stack up: a ₹${r.smallCartFee} fee under ₹${r.smallCartBelow}, the FIRST50 coupon from ₹${r.couponMin}, and a stock limit of 2 on butter. Modes swap whole sets of values: English or Telugu labels, regular or Plus prices, a new or returning customer. Now any order of taps gives the right total, and six of eight participants added one more item to reach free delivery.`}>
      <rect width={W} height={H} fill={SC.soft} />
      <Grid w={W} h={H} />
      <g opacity={intro}>
        <text x={32} y={44} fontSize={26} fontWeight={900} fill={SC.text}>{title}</text>

        {t < 6 && (
          <g>
            {Array.from({ length: 14 }, (_, i) => (
              <rect key={i} x={32 + (i % 7) * 46} y={80 + Math.floor(i / 7) * 74} width={36} height={60} rx={6} fill={SC.surface} stroke={SC.line} strokeWidth={2} opacity={p(t, 0.2 + i * 0.08, 0.5 + i * 0.08)} />
            ))}
            <text x={32} y={262} fontSize={21} fontWeight={700} fill={SC.muted} opacity={p(t, 1.6, 2.2)}>One frame per cart Ananya expected</text>
            <g opacity={p(t, 2.6, 3.2)}>
              <rect x={384} y={76} width={224} height={170} rx={18} fill={SC.surface} stroke={SC.error} strokeWidth={3} />
              <text x={404} y={114} fontSize={21} fontWeight={700} fill={SC.muted}>Lakshmi adds butter</text>
              <text x={404} y={170} fontSize={40} fontWeight={900} fill={SC.error}>₹265</text>
              <text x={404} y={214} fontSize={21} fontWeight={700} fill={SC.muted}>for a ₹56 pack</text>
            </g>
            <text x={32} y={318} fontSize={22} fontWeight={900} fill={SC.text} opacity={p(t, 3.8, 4.4)}>Frames follow paths. People don’t.</text>
          </g>
        )}

        {t >= 6 && t < 11 && (() => {
          const sub = Math.round(lerp(0, 54, p(t, 8, 8.6)) + lerp(0, 265, p(t, 9, 9.6)));
          return (
            <g>
              {[
                { n: 'itemCount', v: String((t > 8.6 ? 1 : 0) + (t > 9.6 ? 1 : 0)) },
                { n: 'subtotal', v: `₹${sub}` },
              ].map((v, i) => (
                <g key={v.n} opacity={p(t, 6.3 + i * 0.5, 6.9 + i * 0.5)}>
                  <rect x={32} y={74 + i * 72} width={280} height={56} rx={12} fill={SC.surface} stroke={WIRE_FILL.variable} strokeWidth={3} />
                  <text x={50} y={110 + i * 72} fontSize={21} fontWeight={800} fill={SC.text} fontFamily={MONO}>{v.n}</text>
                  <text x={294} y={110 + i * 72} fontSize={22} fontWeight={900} fill={WIRE_FILL.variable} textAnchor="end">{v.v}</text>
                </g>
              ))}
              <g opacity={p(t, 7.2, 7.8)}>
                <rect x={32} y={228} width={576} height={96} rx={12} fill="#101828" />
                <text x={52} y={264} fontSize={21} fontWeight={600} fill="#98A2B3" fontFamily={MONO}>On tap “+ milk”</text>
                <text x={52} y={302} fontSize={21} fontWeight={600} fill="#E4E7EC" fontFamily={MONO}>Set subtotal = subtotal + 54</text>
              </g>
              <g opacity={p(t, 7.6, 8.2)}>
                <rect x={340} y={74} width={268} height={128} rx={14} fill={SC.surface} stroke={SC.line} strokeWidth={2} />
                <text x={360} y={112} fontSize={21} fontWeight={700} fill={SC.muted}>Bound to it</text>
                <text x={360} y={150} fontSize={21} fontWeight={800} fill={SC.text}>Badge, subtotal,</text>
                <text x={360} y={180} fontSize={21} fontWeight={800} fill={SC.text}>Pay ₹{sub}</text>
              </g>
            </g>
          );
        })()}

        {t >= 11 && t < 16 && (() => {
          const sub = Math.round(lerp(54, 265, p(t, 13.2, 14.2)));
          const under = sub < r.freeDeliveryAt;
          return (
            <g>
              <g opacity={p(t, 11.2, 11.8)}>
                <rect x={32} y={70} width={300} height={176} rx={12} fill="#101828" />
                <text x={50} y={106} fontSize={21} fontWeight={600} fill="#E4E7EC" fontFamily={MONO}>if subtotal &lt; 199</text>
                <text x={50} y={140} fontSize={21} fontWeight={600} fill="#98A2B3" fontFamily={MONO}>  show bar</text>
                <text x={50} y={172} fontSize={21} fontWeight={600} fill="#98A2B3" fontFamily={MONO}>  delivery = 25</text>
                <text x={50} y={206} fontSize={21} fontWeight={600} fill="#E4E7EC" fontFamily={MONO}>else delivery = 0</text>
              </g>
              <g opacity={p(t, 12, 12.6)}>
                <text x={360} y={100} fontSize={21} fontWeight={700} fill={SC.muted}>subtotal</text>
                <text x={360} y={140} fontSize={36} fontWeight={900} fill={SC.text}>₹{sub}</text>
                <rect x={360} y={164} width={248} height={44} rx={10} fill={under ? WIRE_FILL.conditional : '#067647'} />
                <text x={484} y={193} fontSize={21} fontWeight={800} fill="#fff" textAnchor="middle">{under ? `Add ₹${r.freeDeliveryAt - sub} more` : 'Free delivery'}</text>
              </g>
              <text x={32} y={300} fontSize={22} fontWeight={900} fill={SC.text} opacity={p(t, 14.4, 15)}>Variables remember. Conditionals decide.</text>
            </g>
          );
        })()}

        {t >= 16 && t < 21 && (
          <g>
            {[
              { rule: `Under ₹${r.smallCartBelow}`, then: `+ ₹${r.smallCartFee} small-cart fee` },
              { rule: `FIRST50 from ₹${r.couponMin}`, then: `₹${r.couponOff} off, or “Add ₹X more”` },
              { rule: 'Butter stock = 2', then: '+ stops: “Only 2 left”' },
            ].map((row, i) => (
              <g key={row.rule} opacity={p(t, 16.3 + i * 0.8, 16.9 + i * 0.8)}>
                <rect x={32} y={72 + i * 84} width={576} height={68} rx={12} fill={SC.surface} stroke={WIRE_FILL.conditional} strokeWidth={3} />
                <text x={52} y={114 + i * 84} fontSize={21} fontWeight={900} fill={SC.text}>{row.rule}</text>
                <text x={588} y={114 + i * 84} fontSize={21} fontWeight={700} fill={SC.muted} textAnchor="end">{row.then}</text>
              </g>
            ))}
            <text x={32} y={336} fontSize={21} fontWeight={700} fill={SC.muted} opacity={p(t, 19, 19.6)}>Thresholds live in their own variables</text>
          </g>
        )}

        {t >= 21 && t < 26 && (() => {
          const te = t > 22.6 && t < 24.2;
          const plus = t > 24.2;
          return (
            <g>
              <Cart x={32} y={72} qty={{ milk: 1, atta: 0, butter: 1 }} te={te} plus={plus} o={p(t, 21.2, 21.8)} />
              {[
                { m: 'Language', v: te ? 'Telugu' : 'English', on: t > 22.6 },
                { m: 'Member', v: plus ? 'Plus' : 'Regular', on: t > 24.2 },
                { m: 'Customer', v: 'Returning', on: t > 24.8 },
              ].map((row, i) => (
                <g key={row.m} opacity={p(t, 21.6 + i * 0.4, 22.2 + i * 0.4)}>
                  <rect x={312} y={80 + i * 80} width={296} height={62} rx={12} fill={SC.surface} stroke={row.on ? WIRE_FILL.mode : SC.line} strokeWidth={row.on ? 3 : 2} />
                  <text x={332} y={118 + i * 80} fontSize={21} fontWeight={700} fill={SC.muted}>{row.m}</text>
                  <text x={588} y={118 + i * 80} fontSize={21} fontWeight={900} fill={SC.text} textAnchor="end">{row.v}</text>
                </g>
              ))}
            </g>
          );
        })()}

        {t >= 26 && t < 31 && (() => {
          const qty = tapsAt(p(t, 26.4, 30));
          const steps = ['+ butter', '+ milk', '+ atta'];
          return (
            <g>
              <Cart x={32} y={72} qty={qty} />
              {steps.map((s, i) => (
                <g key={s} opacity={p(t, 26.6 + i * 1.1, 27 + i * 1.1)}>
                  <rect x={330} y={84 + i * 70} width={140} height={50} rx={25} fill={WIRE_FILL.variable} />
                  <text x={400} y={116 + i * 70} fontSize={21} fontWeight={900} fill="#fff" textAnchor="middle">{s}</text>
                </g>
              ))}
              <text x={330} y={318} fontSize={22} fontWeight={900} fill={SC.text} opacity={p(t, 29.6, 30.2)}>Right, in any order</text>
            </g>
          );
        })()}

        {t >= 31 && (
          <g>
            {Array.from({ length: 8 }, (_, i) => (
              <g key={i} opacity={p(t, 31.2 + i * 0.2, 31.5 + i * 0.2)}>
                <circle cx={80 + i * 68} cy={130} r={26} fill={i < 6 ? '#067647' : SC.line} />
                <text x={80 + i * 68} y={138} fontSize={21} fontWeight={900} fill={i < 6 ? '#fff' : SC.text} textAnchor="middle">{i < 6 ? '+1' : '–'}</text>
              </g>
            ))}
            <text x={320} y={218} fontSize={26} fontWeight={900} fill={SC.text} textAnchor="middle" opacity={p(t, 33, 33.6)}>6 of 8 added one more item</text>
            <text x={320} y={262} fontSize={21} fontWeight={700} fill={SC.muted} textAnchor="middle" opacity={p(t, 33.6, 34.2)}>A finding about the design,</text>
            <text x={320} y={292} fontSize={21} fontWeight={700} fill={SC.muted} textAnchor="middle" opacity={p(t, 33.6, 34.2)}>not about the prototype</text>
          </g>
        )}
      </g>
    </svg>
  );
}
