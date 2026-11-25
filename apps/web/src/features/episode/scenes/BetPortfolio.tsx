'use client';
// Scene for st.4-2: Munim's CFO gives design ₹3 crore and asks what he'll get. Aarti prices every bet (`MUNIM_BETS`),
// works out its expected value on a cautious and a hopeful chance (`betRange`), funds, probes or kills it (`betCall`),
// checks the mix across core, adjacent and new (`portfolioMix`, `BET_MIX_GUIDE`), agrees kill criteria and judges
// the decisions, not the luck. Pure function of t (0–36). Also exports `BET_FILL` and `HORIZON_FILL`, which
// `bet-book` uses.
import { BET_HORIZONS, BET_HORIZON_LABEL, BET_MIX_GUIDE, MUNIM_BETS, MUNIM_BUDGET, betCall, betRange, betSpend, portfolioMix, type BetCall, type BetHorizon, type MunimBet } from '@shape/content';
import { back, clamp, Grid, lerp, p, SC } from './shared';

const W = 640, H = 360;
/** One fill per call; white text on each passes 4.5:1. */
export const BET_FILL: Record<BetCall, string> = { fund: '#067647', probe: '#175CD3', kill: '#B42318' };
/** One fill per horizon; white text on each passes 4.5:1. */
export const HORIZON_FILL: Record<BetHorizon, string> = { core: '#344054', adjacent: '#6941C6', new: '#B54708' };

const KEYS = Object.keys(MUNIM_BETS) as MunimBet[];
const ALL = KEYS.map(k => MUNIM_BETS[k]);
const SPENT = ALL.reduce((s, b) => s + betSpend(b), 0);
const MIX = portfolioMix(ALL);
/** ₹ in lakh, as people say it: “₹68 lakh”, “₹1.8 crore”. */
export const rupees = (lakh: number) => {
  const a = Math.abs(lakh), sign = lakh < 0 ? '−' : '';
  return a >= 100 ? `${sign}₹${(a / 100).toLocaleString('en-IN', { maximumFractionDigits: 2 })} crore` : `${sign}₹${a} lakh`;
};
const PROBES: [MunimBet, string, boolean][] = [['voice', 'Pass: 60% by voice', true], ['caInvite', 'Pass: 8% tap invite', false], ['forecast', 'Pass: within 15%', false], ['scan', 'Pass: half the time', true]];

export function BetPortfolioScene({ t }: { t: number }) {
  const intro = clamp(back(t / 0.6));
  const title = t < 6 ? '₹3 crore, ten ideas' : t < 11 ? 'Price every bet' : t < 16 ? 'Two chances, not one' : t < 21 ? 'Fund, kill, probe' : t < 26 ? 'The mix' : t < 31 ? 'Kill criteria first' : 'Judge the decision';

  // A number line of expected value in lakh, −60 to +120.
  const ex = (v: number) => 210 + ((Math.max(-60, Math.min(120, v)) + 60) / 180) * 390;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" role="img" aria-label={`Animated story: Farhan, Munim’s CFO, gives design ${rupees(MUNIM_BUDGET)} and asks what he’ll get. Aarti has ten ideas. She prices each: the GST review costs ₹40 lakh, is worth ₹1.8 crore a year if it works, and has a 60 to 80% chance. Expected value is chance times payoff minus cost, at a cautious and a hopeful chance. ${KEYS.map(k => { const [lo, hi] = betRange(MUNIM_BETS[k]); return `${MUNIM_BETS[k].short}: ${rupees(lo)} to ${rupees(hi)}, ${betCall(MUNIM_BETS[k])}`; }).join('; ')}. The spend of ${rupees(SPENT)} splits ${BET_HORIZONS.map(h => `${Math.round(MIX[h] * 100)}% ${h}`).join(', ')}, close to 70/20/10, with ${rupees(MUNIM_BUDGET - SPENT)} held back. Each probe has a pass mark agreed first. Voice and barcode scanning pass and get the money; the CA invite and the forecast stop.`}>
      <rect width={W} height={H} fill={SC.soft} />
      <Grid w={W} h={H} />
      <g opacity={intro}>
        <text x={32} y={44} fontSize={26} fontWeight={900} fill={SC.text}>{title}</text>

        {t < 6 && (
          <g>
            {KEYS.map((k, i) => {
              const o = p(t, 0.6 + i * 0.3, 1.1 + i * 0.3);
              const x = 32 + (i % 2) * 200, y = 70 + Math.floor(i / 2) * 54;
              return (
                <g key={k} opacity={o} transform={`translate(${x} ${lerp(y - 12, y, o)})`}>
                  <rect width={188} height={44} rx={22} fill={SC.surface} stroke={SC.line} strokeWidth={2} />
                  <text x={94} y={29} fontSize={21} fontWeight={800} fill={SC.text} textAnchor="middle">{MUNIM_BETS[k].short.split(' ')[0]}</text>
                </g>
              );
            })}
            <g opacity={p(t, 3.8, 4.4)}>
              <circle cx={530} cy={170} r={72} fill={HORIZON_FILL.core} />
              <text x={530} y={166} fontSize={30} fontWeight={900} fill="#fff" textAnchor="middle">₹3 crore</text>
              <text x={530} y={196} fontSize={21} fontWeight={800} fill="#fff" textAnchor="middle">for bets</text>
            </g>
          </g>
        )}

        {t >= 6 && t < 11 && (() => {
          const b = MUNIM_BETS.gstReview;
          const rows: [string, string][] = [['Cost to build', rupees(b.cost)], ['Worth in a year if it works', rupees(b.payoff)], ['Chance it works', `${b.chance[0] * 100}–${b.chance[1] * 100}%`]];
          return (
            <g>
              <rect x={32} y={66} width={576} height={64} rx={12} fill={SC.surface} stroke={SC.line} strokeWidth={2} />
              <text x={52} y={106} fontSize={21} fontWeight={900} fill={SC.text}>{b.text.split(' so ')[0]}</text>
              {rows.map(([a, v], i) => (
                <g key={a} opacity={p(t, 6.6 + i * 1.1, 7.2 + i * 1.1)}>
                  <rect x={32} y={146 + i * 62} width={576} height={52} rx={12} fill={SC.surface} stroke={BET_FILL.fund} strokeWidth={2} />
                  <text x={52} y={179 + i * 62} fontSize={21} fontWeight={800} fill={SC.text}>{a}</text>
                  <text x={588} y={179 + i * 62} fontSize={24} fontWeight={900} fill={BET_FILL.fund} textAnchor="end">{v}</text>
                </g>
              ))}
            </g>
          );
        })()}

        {t >= 11 && t < 21 && (() => {
          const all = t >= 16;
          const shown: MunimBet[] = all ? KEYS : ['gstReview', 'voice'];
          const gap = all ? 28 : 90;
          return (
            <g>
              {!all && <text x={32} y={84} fontSize={21} fontWeight={800} fill={SC.muted}>chance × payoff − cost, at both ends</text>}
              <line x1={ex(0)} y1={all ? 58 : 110} x2={ex(0)} y2={all ? 336 : 270} stroke={SC.text} strokeWidth={2} strokeDasharray="5 5" />
              <text x={ex(0)} y={all ? 354 : 296} fontSize={21} fontWeight={800} fill={SC.muted} textAnchor="middle">₹0</text>
              {shown.map((k, i) => {
                const b = MUNIM_BETS[k];
                const [lo, hi] = betRange(b);
                const y = (all ? 74 : 140) + i * gap;
                const o = p(t, (all ? 16.2 : 11.6) + i * (all ? 0.25 : 1.4), (all ? 16.6 : 12.4) + i * (all ? 0.25 : 1.4));
                const fill = all ? BET_FILL[betCall(b)] : SC.text;
                return (
                  <g key={k} opacity={o}>
                    <text x={32} y={y + 7} fontSize={21} fontWeight={800} fill={SC.text}>{b.short}</text>
                    <line x1={ex(lo)} y1={y} x2={lerp(ex(lo), ex(hi), o)} y2={y} stroke={fill} strokeWidth={all ? 10 : 16} strokeLinecap="round" />
                    {!all && (
                      <>
                        <text x={210} y={y + 40} fontSize={21} fontWeight={800} fill={SC.muted}>{rupees(lo)} to {rupees(hi)}</text>
                      </>
                    )}
                  </g>
                );
              })}
            </g>
          );
        })()}

        {t >= 21 && t < 26 && (() => {
          const grow = p(t, 21.4, 23);
          let x = 32;
          return (
            <g>
              <text x={32} y={84} fontSize={21} fontWeight={800} fill={SC.muted}>{rupees(SPENT)} committed of {rupees(MUNIM_BUDGET)}</text>
              <rect x={32} y={100} width={576} height={56} rx={10} fill={SC.surface} stroke={SC.line} strokeWidth={2} />
              {BET_HORIZONS.map(h => {
                const w = (MIX[h] * SPENT / MUNIM_BUDGET) * 576 * grow, cx = x;
                x += w;
                return <rect key={h} x={cx} y={100} width={w} height={56} fill={HORIZON_FILL[h]} />;
              })}
              <text x={600} y={136} fontSize={21} fontWeight={800} fill={SC.text} textAnchor="end" opacity={p(t, 23, 23.6)}>held back {rupees(MUNIM_BUDGET - SPENT)}</text>
              {BET_HORIZONS.map((h, i) => (
                <g key={h} opacity={p(t, 23.2 + i * 0.4, 23.8 + i * 0.4)}>
                  <rect x={32} y={180 + i * 54} width={20} height={20} rx={4} fill={HORIZON_FILL[h]} />
                  <text x={64} y={198 + i * 54} fontSize={21} fontWeight={800} fill={SC.text}>{BET_HORIZON_LABEL[h]}</text>
                  <text x={330} y={198 + i * 54} fontSize={24} fontWeight={900} fill={SC.text} textAnchor="end">{Math.round(MIX[h] * 100)}%</text>
                  <text x={350} y={198 + i * 54} fontSize={21} fontWeight={800} fill={SC.muted}>guide {Math.round(BET_MIX_GUIDE[h] * 100)}%</text>
                </g>
              ))}
            </g>
          );
        })()}

        {t >= 26 && (
          <g>
            {PROBES.map(([k, mark, pass], i) => {
              const b = MUNIM_BETS[k];
              const judged = p(t, 31.4 + i * 0.6, 31.9 + i * 0.6);
              return (
                <g key={k} opacity={p(t, 26.2 + i * 0.6, 26.8 + i * 0.6)}>
                  <rect x={32} y={64 + i * 66} width={576} height={56} rx={12} fill={SC.surface} stroke={judged > 0.5 ? (pass ? BET_FILL.fund : BET_FILL.kill) : BET_FILL.probe} strokeWidth={2} />
                  <text x={52} y={99 + i * 66} fontSize={21} fontWeight={900} fill={SC.text}>{b.short}</text>
                  <text x={240} y={99 + i * 66} fontSize={21} fontWeight={700} fill={SC.muted}>{mark}</text>
                  {t >= 31 && (
                    <g opacity={judged}>
                      <rect x={496} y={74 + i * 66} width={100} height={36} rx={18} fill={pass ? BET_FILL.fund : BET_FILL.kill} />
                      <text x={546} y={99 + i * 66} fontSize={21} fontWeight={900} fill="#fff" textAnchor="middle">{pass ? 'Scale' : 'Stop'}</text>
                    </g>
                  )}
                </g>
              );
            })}
            <text x={32} y={340} fontSize={21} fontWeight={800} fill={SC.text} opacity={t >= 31 ? p(t, 34, 34.6) : p(t, 28.8, 29.4)}>
              {t >= 31 ? 'The money moves to what passed.' : 'Pass marks and review dates, agreed before.'}
            </text>
          </g>
        )}
      </g>
    </svg>
  );
}
