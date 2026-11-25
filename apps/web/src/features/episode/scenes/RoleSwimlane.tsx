'use client';
// Scene for ia.5-2: Tarang Software runs its annual check-up for 4,200 staff on Nabz for Business. The pilot was
// designed for one "user"; Farah draws the check-up as a swimlane of four roles (`NABZ_ROLES`), every step of
// `NABZ_DUTIES` in its owner's lane (`dutyOwner`), and counts the hand-offs (`roleHandoffs`). The ₹38 lakh order sits
// nine days with an approver on leave; group numbers show only for groups of `MIN_REPORT_GROUP` or more; each role
// gets its own home; the redesigned hand-off has a delegate and a visible status. Pure function of t (0–36). Also
// exports the swimlane, its tones and short labels for `role-swim`.
import { MIN_REPORT_GROUP, NABZ_DUTIES, NABZ_ROLES, dutyOwner, roleHandoffs, type NabzDuty, type NabzRole } from '@shape/content';
import { back, clamp, Grid, lerp, p, SC } from './shared';

const W = 960, H = 540;
export const ROLE_TONE: Record<NabzRole, string> = { employee: SC.discover, hr: SC.design, finance: SC.grow, nabz: SC.build };
export const ROLE_LABEL: Record<NabzRole, string> = { employee: 'Employee', hr: 'HR admin', finance: 'Finance', nabz: 'Nabz team' };
export const DUTY_SHORT: Record<NabzDuty, string> = {
  packages: 'Tests', order: '₹38 L', camps: 'Pune camp', slot: 'Book slot', remind: 'Remind', result: 'Result',
  consult: 'Consult', hydStats: 'Hyd. 31%', kochi: 'Kochi, 6', joiners: '+40 staff', topup: '+₹3.2 L',
};
const DUTIES = Object.keys(NABZ_DUTIES) as NabzDuty[];

/** Swimlane geometry: a label column, one band per role, one column per step in workflow order. */
export const LANE = { w: 840, label: 110, head: 6, band: 70, nodeW: 58, nodeH: 34 };
export const laneH = LANE.head + NABZ_ROLES.length * LANE.band;
/** Centre of a step's node: its column from its place in the workflow, its band from its owner. */
export const dutyPos = (k: NabzDuty) => {
  const col = (LANE.w - LANE.label) / DUTIES.length;
  return { x: LANE.label + DUTIES.indexOf(k) * col + col / 2, y: LANE.head + NABZ_ROLES.indexOf(dutyOwner(NABZ_DUTIES[k])) * LANE.band + LANE.band / 2 };
};

/** The swimlane with the steps drawn so far, arrows between consecutive ones, and hand-offs between lanes marked. */
export function Swimlane({ drawn, hot, k = 1, arrows = 1 }: { drawn: readonly NabzDuty[]; hot?: NabzDuty; k?: number; arrows?: number }) {
  const ordered = DUTIES.filter(d => drawn.includes(d));
  return (
    <g opacity={k}>
      {NABZ_ROLES.map((r, i) => (
        <g key={r}>
          <rect x={0} y={LANE.head + i * LANE.band} width={LANE.w} height={LANE.band - 4} rx={10} fill={ROLE_TONE[r]} opacity={0.1} />
          <rect x={0} y={LANE.head + i * LANE.band + 8} width={4} height={LANE.band - 20} rx={2} fill={ROLE_TONE[r]} />
          <text x={14} y={LANE.head + i * LANE.band + LANE.band / 2 + 3} fontSize={13} fontWeight={900} fill={SC.text}>{ROLE_LABEL[r]}</text>
        </g>
      ))}
      {ordered.slice(1).map((d, i) => {
        const a = dutyPos(ordered[i]), b = dutyPos(d);
        const hand = a.y !== b.y;
        const len = Math.hypot(b.x - a.x, b.y - a.y) + 40;
        return (
          <path key={`${ordered[i]}-${d}`} d={`M${a.x + LANE.nodeW / 2} ${a.y} C${a.x + LANE.nodeW / 2 + 12} ${a.y} ${b.x - LANE.nodeW / 2 - 12} ${b.y} ${b.x - LANE.nodeW / 2} ${b.y}`}
            fill="none" stroke={hand ? SC.text : SC.muted} strokeWidth={hand ? 2.2 : 1.5} strokeDasharray={len} strokeDashoffset={lerp(len, 0, clamp(arrows * ordered.length - i))} />
        );
      })}
      {ordered.map(d => {
        const { x, y } = dutyPos(d);
        const r = dutyOwner(NABZ_DUTIES[d]);
        return (
          <g key={d} transform={`translate(${x - LANE.nodeW / 2} ${y - LANE.nodeH / 2})`}>
            <rect width={LANE.nodeW} height={LANE.nodeH} rx={8} fill={SC.surface} stroke={ROLE_TONE[r]} strokeWidth={hot === d ? 3.5 : 2} />
            <text x={LANE.nodeW / 2} y={LANE.nodeH / 2 + 4} fontSize={10} fontWeight={800} fill={SC.text} textAnchor="middle">{DUTY_SHORT[d]}</text>
          </g>
        );
      })}
    </g>
  );
}

function Card({ x, y, w, h, tone, k, children }: { x: number; y: number; w: number; h: number; tone: string; k: number; children: React.ReactNode }) {
  return (
    <g transform={`translate(${x} ${y + (1 - k) * 16})`} opacity={k}>
      <rect width={w} height={h} rx={16} fill={SC.surface} stroke={tone} strokeWidth={2.5} />
      {children}
    </g>
  );
}

export function RoleSwimlaneScene({ t }: { t: number }) {
  const intro = clamp(back(t / 0.6));
  const title = t < 6 ? 'Who’s the user?' : t < 11 ? 'One lane each' : t < 16 ? 'Every arrow is a wait' : t < 21 ? 'Nine days' : t < 26 ? 'Whose data?' : t < 31 ? 'A home for each role' : 'Designed hand-offs';
  const owners = DUTIES.map(d => dutyOwner(NABZ_DUTIES[d]));
  const total = roleHandoffs(owners);
  const growing = Math.floor(lerp(0, DUTIES.length, p(t, 6.4, 10)) + 0.0001);
  const drawn = t < 11 ? DUTIES.slice(0, growing) : DUTIES;
  const arrowsK = t < 11 ? 0 : p(t, 11.2, 14.4);
  const counted = roleHandoffs(owners.slice(0, Math.round(arrowsK * DUTIES.length)));
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" role="img" aria-label={`Animated story: Tarang Software's annual check-up involves four roles: an HR admin who buys and runs it, a finance approver, 4,200 employees, and Nabz's camp team. The designer draws it as a swimlane, each step in its owner's lane, with ${total} hand-offs between roles. The ₹38 lakh order waited nine days with an approver on leave. Individual results belong to the employee; HR sees group numbers only for groups of ${MIN_REPORT_GROUP} or more, so the six-person Kochi office isn't shown. Each role gets its own home screen, and the redesigned approval has a delegate after two working days and a visible status: the next order was approved in a day and a half.`}>
      <rect width={W} height={H} fill={SC.soft} />
      <Grid />
      <g opacity={intro}>
        <text x={60} y={60} fontSize={22} fontWeight={900} fill={SC.text}>{title}</text>

        {t < 6 && (
          <g>
            {([['hr', 'Meera Kulkarni', 'Buys and runs it'], ['finance', 'Rahul Menon', 'Approves over ₹2 lakh'], ['employee', '4,200 staff', 'Get tested'], ['nabz', 'Nabz camp team', 'Phlebotomists and kits']] as const).map(([r, who, what], i) => (
              <Card key={r} x={60 + i * 215} y={130} w={195} h={170} tone={ROLE_TONE[r]} k={p(t, 0.4 + i * 0.6, 0.9 + i * 0.6)}>
                <circle cx={40} cy={50} r={22} fill={ROLE_TONE[r]} opacity={0.3} />
                <text x={20} y={104} fontSize={15} fontWeight={900} fill={SC.text}>{who}</text>
                <text x={20} y={126} fontSize={12.5} fontWeight={800} fill={SC.muted}>{ROLE_LABEL[r]}</text>
                <text x={20} y={148} fontSize={12.5} fontWeight={800} fill={SC.muted}>{what}</text>
              </Card>
            ))}
            <g opacity={p(t, 3.4, 4)}>
              <text x={60} y={370} fontSize={17} fontWeight={800} fill={SC.muted}>The pilot was designed for one “user”.</text>
              <line x1={58} x2={lerp(58, 352, p(t, 4.4, 5.2))} y1={364} y2={364} stroke={SC.error} strokeWidth={3} />
              <text x={60} y={404} fontSize={17} fontWeight={900} fill={SC.text} opacity={p(t, 5, 5.6)}>Four people, four goals, four different moments.</text>
            </g>
          </g>
        )}

        {t >= 6 && t < 16 && (
          <g transform="translate(60 110)">
            <Swimlane drawn={drawn} arrows={arrowsK} />
            <g transform={`translate(0 ${laneH + 40})`} opacity={p(t, 11.4, 12)}>
              <text fontSize={40} fontWeight={900} fill={SC.text}>{counted}</text>
              <text x={60} y={-14} fontSize={14} fontWeight={800} fill={SC.muted}>hand-offs between roles</text>
              <text x={60} y={4} fontSize={14} fontWeight={800} fill={SC.muted}>Each one: a message, a wait, a place it can stall.</text>
            </g>
          </g>
        )}

        {t >= 16 && t < 21 && (
          <g>
            <Card x={60} y={110} w={400} h={300} tone={ROLE_TONE.finance} k={p(t, 16.2, 16.8)}>
              <text x={24} y={40} fontSize={13} fontWeight={900} fill={SC.muted}>ORDER · ₹38,00,000</text>
              <text x={24} y={74} fontSize={18} fontWeight={900} fill={SC.text}>Waiting for approval</text>
              <text x={24} y={100} fontSize={13} fontWeight={800} fill={SC.muted}>Rahul Menon · on leave until the 18th</text>
              {Array.from({ length: 9 }, (_, i) => (
                <g key={i} transform={`translate(${24 + (i % 5) * 70} ${130 + Math.floor(i / 5) * 70})`} opacity={p(t, 16.8 + i * 0.28, 17 + i * 0.28)}>
                  <rect width={58} height={58} rx={10} fill={SC.soft} stroke={SC.line} strokeWidth={2} />
                  <text x={29} y={37} fontSize={18} fontWeight={900} fill={SC.text} textAnchor="middle">{i + 1}</text>
                </g>
              ))}
            </Card>
            <Card x={500} y={110} w={400} h={300} tone={ROLE_TONE.hr} k={p(t, 17.6, 18.2)}>
              <text x={24} y={40} fontSize={13} fontWeight={900} fill={SC.muted}>WHAT MEERA SEES</text>
              <text x={24} y={80} fontSize={18} fontWeight={900} fill={SC.text}>Order status: Submitted</text>
              <text x={24} y={110} fontSize={13} fontWeight={800} fill={SC.muted}>No owner, no date, no reminder.</text>
              <text x={24} y={200} fontSize={60} fontWeight={900} fill={SC.error} opacity={p(t, 19, 19.6)}>9 days</text>
              <text x={24} y={234} fontSize={14} fontWeight={800} fill={SC.muted} opacity={p(t, 19.4, 20)}>before anyone noticed</text>
            </Card>
          </g>
        )}

        {t >= 21 && t < 26 && (
          <g>
            <Card x={60} y={100} w={260} h={330} tone={ROLE_TONE.employee} k={p(t, 21.2, 21.8)}>
              <text x={22} y={38} fontSize={13} fontWeight={900} fill={SC.muted}>ONE EMPLOYEE</text>
              <text x={22} y={76} fontSize={30} fontWeight={900} fill={SC.text}>HbA1c 6.4%</text>
              <text x={22} y={104} fontSize={13} fontWeight={800} fill={SC.muted}>Seen by her, and by a Nabz</text>
              <text x={22} y={122} fontSize={13} fontWeight={800} fill={SC.muted}>doctor if she agrees.</text>
              <rect x={22} y={150} width={216} height={40} rx={10} fill={SC.soft} />
              <text x={36} y={175} fontSize={13} fontWeight={900} fill={SC.text}>Tarang never sees it</text>
            </Card>
            <Card x={350} y={100} w={260} h={330} tone={ROLE_TONE.hr} k={p(t, 22, 22.6)}>
              <text x={22} y={38} fontSize={13} fontWeight={900} fill={SC.muted}>HYDERABAD · 2,900 STAFF</text>
              <text x={22} y={86} fontSize={40} fontWeight={900} fill={SC.text}>31%</text>
              <text x={22} y={112} fontSize={13} fontWeight={800} fill={SC.muted}>high cholesterol</text>
              <rect x={22} y={140} width={216} height={18} rx={9} fill={SC.soft} />
              <rect x={22} y={140} width={lerp(0, 216 * 0.31, p(t, 22.6, 23.6))} height={18} rx={9} fill={ROLE_TONE.hr} />
              <text x={22} y={200} fontSize={13} fontWeight={800} fill={SC.muted}>Big enough to hide anyone in.</text>
            </Card>
            <Card x={640} y={100} w={260} h={330} tone={SC.line} k={p(t, 23, 23.6)}>
              <text x={22} y={38} fontSize={13} fontWeight={900} fill={SC.muted}>KOCHI · 6 STAFF</text>
              <text x={22} y={86} fontSize={26} fontWeight={900} fill={SC.text}>Fewer than {MIN_REPORT_GROUP}</text>
              <text x={22} y={112} fontSize={13} fontWeight={800} fill={SC.muted}>Not reported to HR</text>
              {Array.from({ length: 6 }, (_, i) => <circle key={i} cx={40 + i * 36} cy={170} r={13} fill={SC.soft} stroke={SC.line} strokeWidth={2} />)}
              <text x={22} y={228} fontSize={13} fontWeight={800} fill={SC.muted}>In a group of six, a count</text>
              <text x={22} y={246} fontSize={13} fontWeight={800} fill={SC.muted}>points at people.</text>
            </Card>
          </g>
        )}

        {t >= 26 && t < 31 && (
          <g>
            {([
              ['hr', 'Meera’s home', ['2,814 of 4,200 booked', '2 things waiting on you', 'Pune camp: 14 March']],
              ['employee', 'Asha’s home', ['Your slot: 7:30, Gachibowli', 'Fast from 9:30 the night before', 'Results: only you']],
              ['finance', 'Rahul’s home', ['1 to approve: +₹3.2 lakh', 'Delegate: Shreya Iyer', 'Year so far: ₹38 lakh']],
            ] as const).map(([r, head, lines], i) => (
              <Card key={r} x={60 + i * 290} y={110} w={260} h={300} tone={ROLE_TONE[r]} k={p(t, 26.2 + i * 0.6, 26.8 + i * 0.6)}>
                <text x={22} y={40} fontSize={16} fontWeight={900} fill={SC.text}>{head}</text>
                {lines.map((l, j) => (
                  <g key={l} transform={`translate(22 ${66 + j * 64})`}>
                    <rect width={216} height={50} rx={10} fill={SC.soft} />
                    <text x={14} y={30} fontSize={13} fontWeight={800} fill={SC.text}>{l}</text>
                  </g>
                ))}
              </Card>
            ))}
            <text x={60} y={460} fontSize={15} fontWeight={800} fill={SC.muted} opacity={p(t, 28.6, 29.2)}>Each home starts with the work waiting for that role.</text>
          </g>
        )}

        {t >= 31 && (
          <g transform="translate(60 110)">
            {['Submitted to Rahul', 'Reminder after 1 day', 'Sent to his delegate after 2', 'Approved'].map((s, i) => (
              <g key={s} transform={`translate(${i * 215} 0)`} opacity={p(t, 31.2 + i * 0.6, 31.7 + i * 0.6)}>
                <rect width={195} height={64} rx={14} fill={SC.surface} stroke={i === 3 ? SC.mint : ROLE_TONE.finance} strokeWidth={2.5} />
                <text x={16} y={38} fontSize={13} fontWeight={900} fill={SC.text}>{s}</text>
                {i < 3 && <path d="M199 32 h12 m-6 -5 l6 5 l-6 5" fill="none" stroke={SC.text} strokeWidth={2} />}
              </g>
            ))}
            <text y={110} fontSize={14} fontWeight={800} fill={SC.muted} opacity={p(t, 33, 33.5)}>Meera sees where it is and with whom, at every step.</text>
            <g transform="translate(0 160)" opacity={p(t, 33.4, 34)}>
              <text fontSize={13} fontWeight={900} fill={SC.muted}>DAYS TO APPROVE</text>
              <rect y={16} width={540} height={30} rx={8} fill={SC.error} opacity={0.3} />
              <text x={552} y={37} fontSize={15} fontWeight={900} fill={SC.text}>9 days</text>
              <rect y={60} width={lerp(540, 90, p(t, 34, 35.2))} height={30} rx={8} fill={SC.mint} opacity={0.6} />
              <text x={lerp(552, 102, p(t, 34, 35.2))} y={81} fontSize={15} fontWeight={900} fill={SC.text}>1.5 days</text>
            </g>
          </g>
        )}
      </g>
    </svg>
  );
}
