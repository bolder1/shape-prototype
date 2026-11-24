'use client';
// Scene for bz.2-2: Saman's leadership review after Neha's pitch. Farah (CFO) asks what ₹9 lakh buys; Neha's first
// reply argues with her (`replyFlaw` says defensive) and the trust meter drops (`replyTrust`). Then she names the
// worry (cost) and answers in rupees, and takes Sanjay's risk, Vikram's doubt about eight shopkeepers and Farah's
// one-engineer push the same way: acknowledge, then something concrete. It ends on a yes with a review date.
// Pure function of t (0–36). Also exports `Person`, `PEOPLE` and `KIND_NAME` for `objection-reply`.
import { SAMAN_OBJECTIONS, goodReply, replyFlaw, replyTrust, type Objection, type ObjectionKind, type Reply, type SamanObjection } from '@shape/content';
import { back, clamp, Grid, p, SC } from './shared';
import { wrap } from './Measure';

const W = 960, H = 540;
export const PEOPLE = [
  { who: 'Vikram', role: 'COO', tone: SC.discover },
  { who: 'Farah', role: 'CFO', tone: SC.design },
  { who: 'Sanjay', role: 'CTO', tone: SC.build },
  { who: 'Arjun', role: 'Head of Sales', tone: SC.grow },
] as const;
export const KIND_NAME: Record<ObjectionKind, string> = { cost: 'Cost', risk: 'Risk', proof: 'Proof', priority: 'Priority' };

/** A seat at the table: a ring in the person's family colour around their initial. */
export function Person({ x, y, who, active, r = 34 }: { x: number; y: number; who: string; active?: boolean; r?: number }) {
  const person = PEOPLE.find(q => q.who === who) ?? { who, role: 'Designer', tone: SC.mint };
  return (
    <g transform={`translate(${x} ${y})`}>
      <circle r={r + 6} fill="none" stroke={person.tone} strokeWidth={active ? 5 : 2} opacity={active ? 1 : 0.6} />
      <circle r={r} fill={SC.surface} stroke={SC.line} />
      <text y={r * 0.32} textAnchor="middle" fontSize={r * 0.9} fontWeight={900} fill={SC.text}>{who[0]}</text>
      <text y={r + 26} textAnchor="middle" fontSize={13} fontWeight={800} fill={SC.text}>{who}</text>
      <text y={r + 42} textAnchor="middle" fontSize={11} fontWeight={700} fill={SC.muted}>{person.role}</text>
    </g>
  );
}

function Bubble({ x, y, w, text, tone, opacity }: { x: number; y: number; w: number; text: string; tone: string; opacity: number }) {
  const lines = wrap(text, Math.floor(w / 8.4));
  return (
    <g transform={`translate(${x} ${y})`} opacity={opacity}>
      <rect width={w} height={24 + lines.length * 21} rx={14} fill={SC.surface} stroke={tone} strokeWidth={2} />
      {lines.map((l, i) => <text key={i} x={16} y={28 + i * 21} fontSize={15} fontWeight={700} fill={SC.text}>{l}</text>)}
    </g>
  );
}

const O = (k: SamanObjection) => SAMAN_OBJECTIONS[k] as Objection;
/** The moments of the meeting: which objection, which reply Neha gives, when. */
const MOMENTS: { from: number; k: SamanObjection; reply: Reply }[] = [
  { from: 0, k: 'cost', reply: O('cost').replies.find(r => replyFlaw(r) === 'defensive')! },
  { from: 11, k: 'cost', reply: O('cost').replies[goodReply(O('cost'))] },
  { from: 16, k: 'lost', reply: O('lost').replies[goodReply(O('lost'))] },
  { from: 21, k: 'eight', reply: O('eight').replies[goodReply(O('eight'))] },
  { from: 26, k: 'oneEngineer', reply: O('oneEngineer').replies[goodReply(O('oneEngineer'))] },
];
const replyAt = (m: (typeof MOMENTS)[number]) => (m.from === 0 ? 6 : m.from + 1.6);

export function ObjectionRoomScene({ t }: { t: number }) {
  const intro = clamp(back(t / 0.6));
  const m = [...MOMENTS].reverse().find(x => t >= x.from)!;
  const o = O(m.k);
  const flaw = replyFlaw(m.reply);
  const trust = MOMENTS.reduce((s, x) => s + (t >= replyAt(x) + 0.8 ? replyTrust(replyFlaw(x.reply)) : 0), 0);
  const end = t >= 31;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" role="img" aria-label="Animated story: after Neha's pitch, Farah the CFO asks what ₹9 lakh buys. Neha's first reply, that good design always pays for itself, argues with her and trust drops. She names the worry as cost and answers in rupees: unsent carts are about ₹1.6 crore a month. She answers Sanjay's risk with a 10% rollout, Vikram's doubt about eight shopkeepers with what the rollout will measure, and Farah's one-engineer question with the trade-off. The team approves the rollout, with a review on 15 January.">
      <rect width={W} height={H} fill={SC.soft} />
      <Grid />
      <g opacity={intro}>
        <text x={60} y={60} fontSize={22} fontWeight={900} fill={SC.text}>
          {t < 6 ? 'The questions start' : t < 11 ? 'The reflex' : t < 16 ? 'Name the worry' : t < 21 ? 'Risk, not resistance' : t < 26 ? 'What eight can show' : t < 31 ? 'Don’t cave' : 'A yes with a date'}
        </text>

        <rect x={120} y={190} width={520} height={80} rx={40} fill={SC.surface} stroke={SC.line} />
        {PEOPLE.map((q, i) => <Person key={q.who} x={160 + i * 146} y={110} who={q.who} active={!end && q.who === o.who} r={26} />)}
        <Person x={380} y={322} who="Neha" active={!end && t >= replyAt(m)} r={30} />

        {!end && (
          <g>
            <Bubble x={60} y={420} w={640} text={`${o.who}: “${o.text}”`} tone={PEOPLE.find(q => q.who === o.who)!.tone} opacity={t >= replyAt(m) ? 0 : p(t, m.from + 0.2, m.from + 0.8)} />
            <Bubble x={60} y={420} w={640} text={`Neha: “${m.reply.text}”`} tone={flaw ? SC.error : SC.mint} opacity={p(t, replyAt(m), replyAt(m) + 0.6)} />
            {t >= m.from + 0.6 && m.from >= 11 && (
              <g transform="translate(450 300)" opacity={p(t, m.from + 0.4, m.from + 1)}>
                <rect width={150} height={34} rx={17} fill={SC.surface} stroke={SC.text} strokeWidth={2} />
                <text x={75} y={22} textAnchor="middle" fontSize={14} fontWeight={900} fill={SC.text}>Worry: {KIND_NAME[o.kind]}</text>
              </g>
            )}
            {flaw && t >= replyAt(m) + 0.6 && (
              <text x={450} y={360} fontSize={15} fontWeight={900} fill={SC.error}>Defensive: argues with the person</text>
            )}
          </g>
        )}

        <g transform="translate(740 110)">
          <text x={0} y={0} fontSize={14} fontWeight={800} fill={SC.muted}>The room’s trust</text>
          <rect x={60} y={16} width={36} height={300} rx={18} fill={SC.surface} stroke={SC.line} />
          <line x1={52} x2={104} y1={166} y2={166} stroke={SC.muted} strokeDasharray="3 3" />
          {(() => { const h = Math.max(-140, Math.min(140, trust * 17.5)); return <rect x={64} y={h >= 0 ? 166 - h : 166} width={28} height={Math.abs(h)} rx={10} fill={h >= 0 ? SC.mint : SC.error} />; })()}
          <text x={120} y={170} fontSize={22} fontWeight={900} fill={SC.text}>{trust > 0 ? `+${trust}` : trust}</text>
        </g>

        {end && (
          <g transform="translate(150 420)" opacity={p(t, 31.2, 31.8)}>
            <rect width={480} height={84} rx={16} fill={SC.surface} stroke={SC.mint} strokeWidth={3} />
            <text x={24} y={36} fontSize={22} fontWeight={900} fill={SC.text}>Approved: the 10% rollout</text>
            <text x={24} y={64} fontSize={16} fontWeight={800} fill={SC.muted}>Review on 15 January, from carts sent</text>
          </g>
        )}
      </g>
    </svg>
  );
}
