'use client';
// Scene for fd.4-3: Thursday design review at Haat. The rulebook (`HAAT_RULES`) meets requests to break it
// (`HAAT_BREAKS`, judged by `ruleCall`): the Diwali banner at 2.1:1 is held because contrast is a floor, and a passing
// gold replaces it; "SALE" in capitals is held as taste; swipe-to-add goes to a test. Order tracking gets a second
// primary button as a logged exception, with the 40 support calls attached. Then the bottom bar costs people in three
// places (`CHANGE_AT`), and the rule itself is rewritten. Pure function of t (0–36).
// Also exports `RULE_TONE` for `rule-call`.
import { CHANGE_AT, HAAT_BREAKS, HAAT_RULES, ruleCall, type RuleCall } from '@shape/content';
import { back, clamp, Grid, lerp, p, SC } from './shared';

const W = 960, H = 540;
export const RULE_TONE: Record<RuleCall, string> = { hold: SC.error, test: SC.discover, exception: SC.design, change: SC.mint };
const STAMP: Record<RuleCall, string> = { hold: 'Held', test: 'Testing', exception: 'Exception logged', change: 'Rule rewritten' };
const BOOK = ['contrast', 'gst', 'primary', 'tabs', 'spacing', 'labels'] as const;
const PLACES = ['Payment', 'Returns', 'Sellers’ stock count'];

function Para({ x, y, w, h, size = 15, weight = 800, children, muted }: { x: number; y: number; w: number; h: number; size?: number; weight?: number; children: React.ReactNode; muted?: boolean }) {
  return (
    <foreignObject x={x} y={y} width={w} height={h}>
      <p style={{ margin: 0, font: `${weight} ${size}px/1.35 Inter, system-ui, sans-serif`, color: muted ? 'var(--color-text-tertiary)' : 'var(--color-text-primary)' }}>{children}</p>
    </foreignObject>
  );
}

function Stamp({ x, y, call, k }: { x: number; y: number; call: RuleCall; k: number }) {
  const s = lerp(1.4, 1, k);
  return (
    <g transform={`translate(${x} ${y}) rotate(-6) scale(${s})`} opacity={k}>
      <rect x={-90} y={-20} width={180} height={40} rx={10} fill={SC.surface} stroke={RULE_TONE[call]} strokeWidth={3} />
      <text y={6} textAnchor="middle" fontSize={16} fontWeight={900} fill={SC.text}>{STAMP[call]}</text>
    </g>
  );
}

export function RuleBreakScene({ t }: { t: number }) {
  const intro = clamp(back(t / 0.6));
  const title = t < 6 ? 'The rulebook' : t < 11 ? 'Floors' : t < 16 ? 'Taste and hunches' : t < 21 ? 'Evidence, once' : t < 26 ? 'Logged' : t < 31 ? 'The third time' : 'Change the rule';
  const calls = Math.round(lerp(0, 40, p(t, 17.4, 19.4)));
  const rewrite = p(t, 31.6, 32.6);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" role="img" aria-label={`Animated story: Haat's design review hears requests to break design-system rules. The Diwali banner at 2.1:1 contrast is held, because contrast is a floor, and a darker gold that passes replaces it. "SALE" in capitals is held as taste. Swipe-to-add, a hunch, goes to a test. Order tracking gets a second primary button as a logged exception, backed by 40 support calls. When payment, returns and the sellers' stock count all lose people through the bottom bar, the rule "${HAAT_RULES.tabs}" is rewritten: the bottom bar hides during focused tasks.`}>
      <rect width={W} height={H} fill={SC.soft} />
      <Grid />
      <g opacity={intro}>
        <text x={60} y={60} fontSize={22} fontWeight={900} fill={SC.text}>{title}</text>

        {t < 6 && (
          <g transform="translate(60 96)">
            <rect width={520} height={390} rx={18} fill={SC.surface} stroke={SC.line} strokeWidth={2} opacity={p(t, 0.2, 0.7)} />
            <text x={28} y={42} fontSize={13} fontWeight={900} fill={SC.muted} opacity={p(t, 0.4, 0.9)}>HAAT DESIGN SYSTEM · RULES</text>
            {BOOK.map((r, i) => (
              <g key={r} transform={`translate(28 ${70 + i * 52})`} opacity={p(t, 0.8 + i * 0.35, 1.2 + i * 0.35)}>
                <rect width={464} height={42} rx={10} fill={SC.soft} />
                <text x={16} y={27} fontSize={15} fontWeight={800} fill={SC.text}>{HAAT_RULES[r]}</text>
              </g>
            ))}
            <g transform="translate(560 40)" opacity={p(t, 3.4, 4)}>
              <text fontSize={44} fontWeight={900} fill={SC.text}>14</text>
              <text y={28} fontSize={15} fontWeight={800} fill={SC.muted}>designers</text>
              <text y={110} fontSize={44} fontWeight={900} fill={SC.text}>900</text>
              <text y={138} fontSize={15} fontWeight={800} fill={SC.muted}>screens</text>
              <text y={220} fontSize={15} fontWeight={800} fill={SC.muted}>Every Thursday: requests</text>
              <text y={242} fontSize={15} fontWeight={800} fill={SC.muted}>to break the rules.</text>
            </g>
          </g>
        )}

        {t >= 6 && t < 11 && (
          <g transform="translate(60 100)">
            {[{ fg: '#D8A636', label: '2.1 : 1', ok: false }, { fg: '#7A4E00', label: '6.7 : 1', ok: true }].map((b, i) => (
              <g key={b.fg} transform={`translate(${i * 430} 0)`} opacity={i ? p(t, 8.6, 9.2) : p(t, 6.2, 6.8)}>
                <rect width={400} height={150} rx={18} fill="#FFF6E0" stroke={SC.line} />
                <text x={28} y={64} fontSize={34} fontWeight={900} fill={b.fg}>Diwali Dhamaka</text>
                <text x={28} y={104} fontSize={18} fontWeight={800} fill={b.fg}>Up to 40% off sweets and diyas</text>
                <text x={0} y={186} fontSize={16} fontWeight={900} fill={b.ok ? SC.text : SC.error}>{b.label} {b.ok ? '· passes' : '· fails 4.5 : 1'}</text>
              </g>
            ))}
            <Stamp x={300} y={40} call={ruleCall(HAAT_BREAKS.diwali)} k={p(t, 7.4, 7.9)} />
            <Para x={0} y={230} w={840} h={60} muted>Contrast is a floor: it decides who can read the sale at all. The festival weeks are when the most people shop.</Para>
          </g>
        )}

        {t >= 11 && t < 16 && (
          <g transform="translate(60 100)">
            {(['caps', 'swipe'] as const).map((k, i) => (
              <g key={k} transform={`translate(${i * 430} 0)`} opacity={p(t, 11.2 + i * 1.6, 11.7 + i * 1.6)}>
                <rect width={400} height={190} rx={18} fill={SC.surface} stroke={SC.line} strokeWidth={2} />
                <Para x={22} y={20} w={356} h={110}>{HAAT_BREAKS[k].text}</Para>
                <text x={22} y={164} fontSize={13} fontWeight={900} fill={SC.muted}>Rule: {HAAT_RULES[HAAT_BREAKS[k].rule]}</text>
                <Stamp x={260} y={230} call={ruleCall(HAAT_BREAKS[k])} k={p(t, 12.4 + i * 1.6, 12.9 + i * 1.6)} />
              </g>
            ))}
            <Para x={0} y={290} w={840} h={50} muted>“It feels more exciting” is taste: no. “I’m sure it’s faster” is a guess about users: test it on a share of shoppers.</Para>
          </g>
        )}

        {t >= 16 && t < 26 && (
          <g transform="translate(60 92)">
            <g opacity={p(t, 16.2, 16.8)}>
              <rect width={250} height={420} rx={32} fill={SC.surface} stroke={SC.line} strokeWidth={2} />
              <text x={24} y={52} fontSize={15} fontWeight={900} fill={SC.text}>Arriving in 6 min</text>
              <rect x={24} y={72} width={202} height={170} rx={14} fill={SC.soft} />
              <path d="M50 210 C90 150 140 180 190 100" fill="none" stroke={SC.muted} strokeWidth={3} strokeDasharray="6 6" />
              <circle cx={190} cy={100} r={8} fill={SC.brand} />
              <rect x={24} y={290} width={202} height={44} rx={12} fill={SC.brand} />
              <text x={125} y={318} textAnchor="middle" fontSize={14} fontWeight={900} fill="#fff">Call rider</text>
              <g opacity={p(t, 19.6, 20.2)}>
                <rect x={24} y={346} width={202} height={44} rx={12} fill={SC.brand} />
                <text x={125} y={374} textAnchor="middle" fontSize={14} fontWeight={900} fill="#fff">Share location</text>
              </g>
            </g>
            <g transform="translate(300 0)" opacity={p(t, 17, 17.5)}>
              <text fontSize={13} fontWeight={900} fill={SC.muted} y={16}>SUPPORT CALLS: RIDER CAN’T FIND THE FLAT</text>
              <text y={86} fontSize={64} fontWeight={900} fill={SC.text}>{calls}</text>
              <Para x={0} y={104} w={520} h={60} muted>People missed “Share location” as a text link. One screen, real evidence.</Para>
            </g>
            {t >= 21 && (
              <g transform="translate(300 200)" opacity={p(t, 21.2, 21.8)}>
                <rect width={540} height={190} rx={16} fill={SC.surface} stroke={SC.design} strokeWidth={2.5} />
                <text x={22} y={34} fontSize={13} fontWeight={900} fill={SC.muted}>EXCEPTIONS LOG · #12</text>
                <Para x={22} y={48} w={500} h={130}>{`Rule: ${HAAT_RULES.primary}. Where: order tracking only. Why: 40 support calls where riders couldn’t find the flat. Review again: in six months.`}</Para>
                <Stamp x={420} y={180} call={ruleCall(HAAT_BREAKS.track)} k={p(t, 22.4, 22.9)} />
              </g>
            )}
          </g>
        )}

        {t >= 26 && (
          <g transform="translate(60 96)">
            {PLACES.map((pl, i) => (
              <g key={pl} transform={`translate(${i * 285} 0)`} opacity={p(t, 26.3 + i * 1, 26.8 + i * 1)}>
                <rect width={265} height={120} rx={16} fill={SC.surface} stroke={i < CHANGE_AT - 1 || t >= 28.3 ? SC.grow : SC.line} strokeWidth={2.5} />
                <text x={20} y={36} fontSize={17} fontWeight={900} fill={SC.text}>{pl}</text>
                <Para x={20} y={50} w={230} h={64} size={13.5} muted>People tap the bottom bar mid-task and lose their place.</Para>
              </g>
            ))}
            <text x={0} y={170} fontSize={16} fontWeight={900} fill={SC.text} opacity={p(t, 29, 29.5)}>Three places, the same evidence. That’s not an exception any more.</text>
            {t >= 31 && (
              <g transform="translate(0 200)">
                <rect width={840} height={150} rx={18} fill={SC.surface} stroke={SC.mint} strokeWidth={3} opacity={p(t, 31.1, 31.5)} />
                <text x={28} y={44} fontSize={13} fontWeight={900} fill={SC.muted} opacity={p(t, 31.1, 31.5)}>HAAT DESIGN SYSTEM · RULE 4</text>
                <text x={28} y={84} fontSize={20} fontWeight={900} fill={SC.muted} opacity={1 - rewrite * 0.6}>{HAAT_RULES.tabs}</text>
                <path d={`M28 78 H${lerp(28, 470, rewrite)}`} stroke={SC.error} strokeWidth={3} />
                <text x={28} y={124} fontSize={20} fontWeight={900} fill={SC.text} opacity={p(t, 32.4, 33)}>The bottom bar hides during payment and other focused tasks</text>
                <Stamp x={700} y={44} call={ruleCall(HAAT_BREAKS.focus)} k={p(t, 33.2, 33.7)} />
              </g>
            )}
          </g>
        )}
      </g>
    </svg>
  );
}
