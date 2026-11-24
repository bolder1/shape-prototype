'use client';
// Scene for dc.2-2: Ritesh's test build of the "Change your trip" sheet matches Figma on Sana's iPhone. On an ordinary
// Android with large text, TalkBack and slow data (`QA_DEVICE`), an overlay finds drift and running the task finds
// what breaks (`GAADI_QA`). Findings sort into block, fix and let go (`qaLane`); each becomes a ticket that stands
// alone (`qaTicket`); the release gate holds while blockers are open (`qaVerdict`), then ships. Pure function of t (0–36).
// Also exports `QA_TONE`, `QA_NAME` and `QA_SHORT` for `qa-pass`.
import { GAADI_QA, QA_DEVICE, QA_LANES, qaLane, qaTicket, qaVerdict, type GaadiQa, type QaLane } from '@shape/content';
import { back, clamp, Grid, p, SC } from './shared';
import { MiniSheet } from './SpecHandoff';

const W = 960, H = 540;
export const QA_TONE: Record<QaLane, string> = { blocker: SC.error, fix: SC.design, pass: SC.muted };
export const QA_NAME: Record<QaLane, string> = { blocker: 'Blocks release', fix: 'Fix this sprint', pass: 'Let it go' };
export const QA_SHORT: Record<GaadiQa, string> = {
  double: 'Double charge', focus: 'TalkBack focus', seats: '“3 seats left” 2.5:1', gst: '₹180 shown, ₹212 charged',
  hex: 'Hard-coded hex', gap: '12 px rows', wrap: 'Name cut short', weight: 'Font renders heavier', handle: 'Handle 1 px low', shadow: 'Softer shadow',
};
const KEYS = Object.keys(GAADI_QA) as GaadiQa[];
const BLOCKERS = KEYS.filter(k => qaLane(GAADI_QA[k]) === 'blocker');
const DRIFT: GaadiQa[] = ['gap', 'hex', 'wrap'];

function Phone({ x, y, label, children, o = 1 }: { x: number; y: number; label: string; children?: React.ReactNode; o?: number }) {
  return (
    <g transform={`translate(${x} ${y})`} opacity={o}>
      <rect width={230} height={370} rx={28} fill={SC.text} opacity={0.9} />
      <g transform="translate(15 26)">{children}</g>
      <text x={115} y={396} textAnchor="middle" fontSize={13} fontWeight={800} fill={SC.muted}>{label}</text>
    </g>
  );
}

export function DesignQaScene({ t }: { t: number }) {
  const intro = clamp(back(t / 0.6));
  const fixedBlockers = t < 31 ? 0 : Math.min(BLOCKERS.length, Math.floor((t - 31.4) / 0.6) + 1);
  const open = BLOCKERS.slice(fixedBlockers).map(k => GAADI_QA[k]);
  const verdict = qaVerdict(open);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" role="img" aria-label={`Animated story: Ritesh's test build of the Change your trip sheet matches Figma on Sana's iPhone. On a ${QA_DEVICE} with TalkBack and slow data, overlaying the design finds rows 12 px apart, a hard-coded hex and a name cut short. Running the task finds a double charge on Confirm, TalkBack focus stuck behind the sheet, 3 seats left at 2.5 to 1 contrast, and a fare that rises at payment. Broken tasks, money and access block the release; drift is fixed this sprint; a pixel and font rendering are let go. Each ticket gives where, expected, actual and device. Ritesh fixes the four blockers, Sana re-tests, and it ships.`}>
      <rect width={W} height={H} fill={SC.soft} />
      <Grid />
      <g opacity={intro}>
        <text x={60} y={60} fontSize={22} fontWeight={900} fill={SC.text}>
          {t < 6 ? 'The build is on test' : t < 11 ? 'An ordinary phone' : t < 16 ? 'Overlay the design' : t < 21 ? 'What actually breaks' : t < 26 ? 'Block, fix, let go' : t < 31 ? 'Tickets that stand alone' : 'Ship it'}
        </text>

        {t < 21 && (
          <g>
            <Phone x={90} y={90} label={t < 6 ? 'Sana’s iPhone' : QA_DEVICE}>
              <MiniSheet x={0} y={0} s={1} />
              {t >= 11 && t < 16 && (
                <g opacity={0.45 * p(t, 11, 11.6)} transform="translate(3 4)"><MiniSheet x={0} y={0} s={1} /></g>
              )}
            </Phone>
            {t < 6 && (
              <g transform="translate(360 170)" opacity={p(t, 1, 1.6)}>
                <rect width={300} height={60} rx={14} fill={SC.surface} stroke={SC.mint} strokeWidth={2.5} />
                <text x={20} y={37} fontSize={16} fontWeight={900} fill={SC.text}>Matches Figma. Sign it off?</text>
              </g>
            )}
            {t >= 6 && t < 11 && ['Text size 130%', 'TalkBack on', 'Slow 4G', 'Redmi 12, ₹9,000'].map((c, i) => (
              <g key={c} transform={`translate(360 ${130 + i * 62})`} opacity={p(t, 6.4 + i * 0.5, 6.9 + i * 0.5)}>
                <rect width={260} height={46} rx={23} fill={SC.surface} stroke={SC.discover} strokeWidth={2} />
                <text x={22} y={29} fontSize={15} fontWeight={800} fill={SC.text}>{c}</text>
              </g>
            ))}
            {t >= 11 && t < 16 && DRIFT.map((k, i) => (
              <g key={k} transform={`translate(360 ${130 + i * 70})`} opacity={p(t, 11.8 + i * 0.6, 12.3 + i * 0.6)}>
                <rect width={460} height={56} rx={12} fill={SC.surface} stroke={SC.design} strokeWidth={2} />
                <text x={18} y={23} fontSize={14} fontWeight={900} fill={SC.text}>{GAADI_QA[k].where}</text>
                <text x={18} y={43} fontSize={13} fontWeight={700} fill={SC.muted}>Expected {GAADI_QA[k].expected} · got {GAADI_QA[k].actual}</text>
              </g>
            ))}
            {t >= 16 && BLOCKERS.map((k, i) => (
              <g key={k} transform={`translate(360 ${110 + i * 74})`} opacity={p(t, 16.2 + i * 0.7, 16.7 + i * 0.7)}>
                <rect width={520} height={60} rx={12} fill={SC.surface} stroke={SC.error} strokeWidth={2.5} />
                <text x={18} y={24} fontSize={14} fontWeight={900} fill={SC.text}>{GAADI_QA[k].where}</text>
                <text x={18} y={45} fontSize={13} fontWeight={700} fill={SC.muted}>{GAADI_QA[k].actual}</text>
              </g>
            ))}
          </g>
        )}

        {t >= 21 && t < 26 && QA_LANES.map((l, i) => {
          const ks = KEYS.filter(k => qaLane(GAADI_QA[k]) === l);
          return (
            <g key={l} transform={`translate(${60 + i * 290} 100)`} opacity={p(t, 21 + i * 0.4, 21.6 + i * 0.4)}>
              <rect width={270} height={360} rx={16} fill={SC.surface} stroke={QA_TONE[l]} strokeWidth={2.5} />
              <text x={18} y={34} fontSize={17} fontWeight={900} fill={SC.text}>{QA_NAME[l]}</text>
              {ks.map((k, j) => (
                <g key={k} transform={`translate(14 ${54 + j * 66})`} opacity={p(t, 21.8 + j * 0.4 + i * 0.3, 22.2 + j * 0.4 + i * 0.3)}>
                  <rect width={242} height={54} rx={10} fill={SC.soft} />
                  <text x={14} y={32} fontSize={14} fontWeight={800} fill={SC.text}>{QA_SHORT[k]}</text>
                </g>
              ))}
            </g>
          );
        })}

        {t >= 26 && t < 31 && (
          <g transform="translate(60 120)" opacity={p(t, 26.2, 26.8)}>
            <rect width={840} height={230} rx={16} fill={SC.surface} stroke={SC.error} strokeWidth={2.5} />
            <text x={24} y={40} fontSize={14} fontWeight={900} fill={SC.muted}>GAADI-412 · Blocks release</text>
            {qaTicket(GAADI_QA.double).split('. ').map((l, i) => (
              <text key={i} x={24} y={84 + i * 34} fontSize={17} fontWeight={i ? 700 : 900} fill={SC.text} opacity={p(t, 26.6 + i * 0.5, 27 + i * 0.5)}>{l.replace(/\.$/, '')}</text>
            ))}
            <text x={24} y={214} fontSize={15} fontWeight={800} fill={SC.mint} opacity={p(t, 29, 29.5)}>Fixed in a day. No questions asked.</text>
          </g>
        )}

        {t >= 31 && (
          <g transform="translate(180 130)" opacity={p(t, 31, 31.5)}>
            <rect width={600} height={260} rx={20} fill={SC.surface} stroke={verdict === 'ship' ? SC.mint : SC.error} strokeWidth={4} />
            <text x={300} y={70} textAnchor="middle" fontSize={16} fontWeight={800} fill={SC.muted}>Release gate · re-tested on the Redmi</text>
            <text x={300} y={140} textAnchor="middle" fontSize={40} fontWeight={900} fill={SC.text}>{verdict === 'ship' ? 'Ship it' : `Hold: ${open.length} blocker${open.length === 1 ? '' : 's'}`}</text>
            <text x={300} y={200} textAnchor="middle" fontSize={15} fontWeight={700} fill={SC.muted}>{verdict === 'ship' ? 'The three drift fixes follow next sprint' : 'Blockers closing as Ritesh fixes them'}</text>
          </g>
        )}
      </g>
    </svg>
  );
}
