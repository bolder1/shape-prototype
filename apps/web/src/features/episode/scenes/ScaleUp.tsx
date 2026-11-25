'use client';
// Scene for ia.5-3: Nabz's HR portal was designed with a 12-person pilot. At Tarang's 4,200 staff the checkbox list is
// 420 screens of scrolling (`scrollScreens`), so picking moves to search; five slots stay as chips, 23 offices become a
// sorted list, 1,850 tests need search (`scalePattern`, `NABZ_TASKS`). The lab's 9,000-row sample list becomes counts
// and exceptions, and reminding 1,140 people becomes a rule with a preview. Pure function of t (0–36). Also exports
// `PATTERN_TONE` and `PATTERN_LABEL` for `scale-dial`.
import { NABZ_TASKS, SCALE_LIST_MAX, SHOW_ALL_MAX, scrollScreens, type ScalePattern } from '@shape/content';
import { back, clamp, Grid, lerp, p, SC } from './shared';

const W = 960, H = 540;
export const PATTERN_TONE: Record<ScalePattern, string> = { all: SC.discover, list: SC.design, search: SC.grow, rules: SC.build };
export const PATTERN_LABEL: Record<ScalePattern, string> = { all: 'Show them all', list: 'A sorted list', search: 'Search and filter', rules: 'Counts, exceptions, rules' };
const PILOT = ['Aditi Rao', 'Bhavesh Shah', 'Chitra Nair', 'Deepak Verma', 'Esha Gupta', 'Farhan Ali', 'Gauri Joshi', 'Harish Kumar', 'Ishita Sen', 'Jayant Patil', 'Kavitha M', 'Lokesh Reddy'];

function Box({ x, y, w, h, tone, k = 1, children }: { x: number; y: number; w: number; h: number; tone: string; k?: number; children?: React.ReactNode }) {
  return (
    <g transform={`translate(${x} ${y + (1 - k) * 14})`} opacity={k}>
      <rect width={w} height={h} rx={16} fill={SC.surface} stroke={tone} strokeWidth={2.5} />
      {children}
    </g>
  );
}

function Check({ x, y, on }: { x: number; y: number; on?: boolean }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect width={16} height={16} rx={4} fill={SC.surface} stroke={SC.muted} strokeWidth={1.8} />
      {on && <path d="M3.5 8 l3 3 l6 -7" fill="none" stroke={SC.text} strokeWidth={2.2} strokeLinecap="round" />}
    </g>
  );
}

export function ScaleUpScene({ t }: { t: number }) {
  const intro = clamp(back(t / 0.6));
  const title = t < 6 ? 'Designed at twelve' : t < 11 ? 'Now 4,200' : t < 16 ? 'Picking changes shape' : t < 21 ? '9,000 rows' : t < 26 ? 'Counts, then exceptions' : t < 31 ? 'Act on a rule' : 'Real data, real size';
  const staff = NABZ_TASKS.staff.count;
  const count = Math.round(lerp(PILOT.length, staff, p(t, 6.3, 8.2)));
  const typed = 'Meera'.slice(0, Math.max(0, Math.floor((t - 9) * 4)));
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" role="img" aria-label={`Animated story: an HR portal designed with a 12-person pilot lists every employee with a checkbox. At ${staff.toLocaleString('en-IN')} staff the same list is ${scrollScreens(staff)} screens of scrolling, so finding one person moves to search. Picking changes shape with size: five slots as chips, 23 offices as a sorted list, 1,850 tests as search with filters. The lab's list of 9,000 samples becomes counts by state and only the 40 samples near their deadline. Reminding 1,140 people becomes a rule with a count and a preview. Every design is checked with real data at its real size.`}>
      <rect width={W} height={H} fill={SC.soft} />
      <Grid />
      <g opacity={intro}>
        <text x={60} y={60} fontSize={22} fontWeight={900} fill={SC.text}>{title}</text>

        {t < 11 && (
          <g>
            <Box x={60} y={96} w={380} h={420} tone={PATTERN_TONE.list}>
              <text x={22} y={36} fontSize={13} fontWeight={900} fill={SC.muted}>STAFF · {count.toLocaleString('en-IN')}</text>
              {PILOT.map((n, i) => (
                <g key={n} transform={`translate(22 ${54 + i * 29})`} opacity={p(t, 0.3 + i * 0.15, 0.6 + i * 0.15)}>
                  <Check x={0} y={2} on={i % 3 === 0} />
                  <text x={28} y={15} fontSize={13.5} fontWeight={800} fill={SC.text}>{n}</text>
                </g>
              ))}
              <rect x={356} y={50} width={6} height={354} rx={3} fill={SC.soft} />
              <rect x={356} y={50} width={6} height={lerp(354, 4, p(t, 6.3, 8.2))} rx={3} fill={SC.muted} />
            </Box>
            <g transform="translate(500 120)" opacity={p(t, 2.4, 3)}>
              <text fontSize={16} fontWeight={800} fill={SC.muted}>{t < 6 ? 'Clean in every review, with twelve rows.' : 'The same list, ten rows a screen:'}</text>
              {t >= 6 && (
                <g opacity={p(t, 7.4, 8)}>
                  <text y={70} fontSize={60} fontWeight={900} fill={SC.text}>{scrollScreens(count)}</text>
                  <text y={100} fontSize={16} fontWeight={800} fill={SC.muted}>screens of scrolling to find one person</text>
                </g>
              )}
              {t >= 9 && (
                <g transform="translate(0 150)">
                  <rect width={380} height={48} rx={24} fill={SC.surface} stroke={PATTERN_TONE.search} strokeWidth={2.5} />
                  <circle cx={26} cy={22} r={8} fill="none" stroke={SC.muted} strokeWidth={2.2} /><path d="M32 28 l6 6" stroke={SC.muted} strokeWidth={2.2} />
                  <text x={48} y={30} fontSize={15} fontWeight={800} fill={SC.text}>{typed}</text>
                  <g opacity={p(t, 10, 10.4)}>
                    <rect y={58} width={380} height={48} rx={10} fill={SC.surface} stroke={SC.line} strokeWidth={2} />
                    <text x={18} y={88} fontSize={14} fontWeight={800} fill={SC.text}>Meera Kulkarni · HR · Hyderabad</text>
                  </g>
                </g>
              )}
            </g>
          </g>
        )}

        {t >= 11 && t < 16 && (
          <g>
            <Box x={60} y={110} w={260} h={330} tone={PATTERN_TONE.all} k={p(t, 11.1, 11.7)}>
              <text x={20} y={36} fontSize={13} fontWeight={900} fill={SC.muted}>{NABZ_TASKS.slots.count} SLOTS · SHOW ALL</text>
              {['7:00', '7:30', '8:00', '8:30', '9:00'].map((s, i) => (
                <g key={s} transform={`translate(${20 + (i % 3) * 76} ${60 + Math.floor(i / 3) * 52})`}>
                  <rect width={68} height={40} rx={20} fill={i === 1 ? SC.discover : SC.soft} opacity={i === 1 ? 0.35 : 1} stroke={SC.line} />
                  <text x={34} y={25} fontSize={13} fontWeight={900} fill={SC.text} textAnchor="middle">{s}</text>
                </g>
              ))}
              <text x={20} y={210} fontSize={12.5} fontWeight={800} fill={SC.muted}>Up to about {SHOW_ALL_MAX}, people</text>
              <text x={20} y={228} fontSize={12.5} fontWeight={800} fill={SC.muted}>compare at a glance.</text>
            </Box>
            <Box x={350} y={110} w={260} h={330} tone={PATTERN_TONE.list} k={p(t, 11.9, 12.5)}>
              <text x={20} y={36} fontSize={13} fontWeight={900} fill={SC.muted}>{NABZ_TASKS.sites.count} OFFICES · A LIST</text>
              {['Gachibowli (yours)', 'HITEC City', 'Madhapur', 'Nanakramguda', 'Pune · Hinjewadi', 'Pune · Kharadi', 'Kochi'].map((s, i) => (
                <g key={s} transform={`translate(20 ${54 + i * 34})`}>
                  <rect width={220} height={28} rx={7} fill={i === 0 ? SC.design : SC.soft} opacity={i === 0 ? 0.3 : 1} />
                  <text x={12} y={19} fontSize={12.5} fontWeight={800} fill={SC.text}>{s}</text>
                </g>
              ))}
              <text x={20} y={310} fontSize={12.5} fontWeight={800} fill={SC.muted}>Likeliest first. A few dozen at most.</text>
            </Box>
            <Box x={640} y={110} w={260} h={330} tone={PATTERN_TONE.search} k={p(t, 12.7, 13.3)}>
              <text x={20} y={36} fontSize={13} fontWeight={900} fill={SC.muted}>{NABZ_TASKS.tests.count.toLocaleString('en-IN')} TESTS · SEARCH</text>
              <rect x={20} y={52} width={220} height={36} rx={18} fill={SC.soft} stroke={SC.line} />
              <text x={38} y={75} fontSize={13} fontWeight={800} fill={SC.text}>{'sugar'.slice(0, Math.max(0, Math.floor((t - 13.4) * 5)))}</text>
              {['Diabetes', 'Heart', 'Thyroid'].map((f, i) => (
                <g key={f} transform={`translate(${20 + i * 74} 98)`}><rect width={68} height={24} rx={12} fill={SC.surface} stroke={SC.line} /><text x={34} y={16} fontSize={11} fontWeight={800} fill={SC.text} textAnchor="middle">{f}</text></g>
              ))}
              {['HbA1c', 'Fasting glucose', 'Glucose after meals'].map((r, i) => (
                <g key={r} transform={`translate(20 ${136 + i * 40})`} opacity={p(t, 14.4 + i * 0.25, 14.8 + i * 0.25)}>
                  <rect width={220} height={32} rx={8} fill={SC.soft} />
                  <text x={12} y={21} fontSize={12.5} fontWeight={800} fill={SC.text}>{r}</text>
                </g>
              ))}
              <text x={20} y={310} fontSize={12.5} fontWeight={800} fill={SC.muted}>Past {SCALE_LIST_MAX}, search, with filters.</text>
            </Box>
          </g>
        )}

        {t >= 16 && t < 21 && (
          <g>
            <Box x={60} y={96} w={520} h={420} tone={SC.line}>
              <text x={22} y={34} fontSize={13} fontWeight={900} fill={SC.muted}>ALL SAMPLES TODAY · {NABZ_TASKS.samples.count.toLocaleString('en-IN')}</text>
              {Array.from({ length: 34 }, (_, i) => {
                const y = 50 + ((i * 11 + (t - 16) * 90) % 360);
                const hot = i % 9 === 4;
                return <rect key={i} x={22} y={y} width={476} height={7} rx={3} fill={hot ? SC.error : SC.soft} opacity={hot ? 0.45 : 1} />;
              })}
            </Box>
            <g transform="translate(620 160)" opacity={p(t, 17, 17.6)}>
              <text fontSize={56} fontWeight={900} fill={SC.text}>40</text>
              <text y={30} fontSize={16} fontWeight={800} fill={SC.muted}>are about to miss their</text>
              <text y={50} fontSize={16} fontWeight={800} fill={SC.muted}>deadline, somewhere in here</text>
              <text y={120} fontSize={15} fontWeight={800} fill={SC.muted} opacity={p(t, 18.6, 19.2)}>Pages of 50 are 180 pages.</text>
              <text y={144} fontSize={15} fontWeight={800} fill={SC.muted} opacity={p(t, 19.2, 19.8)}>Red rows are still among 9,000.</text>
            </g>
          </g>
        )}

        {t >= 21 && t < 26 && (
          <g>
            {([['Received', '9,000'], ['Running', '2,310'], ['Reported', '6,650'], ['Near deadline', '40']] as const).map(([l, n], i) => (
              <Box key={l} x={60 + i * 215} y={96} w={195} h={100} tone={i === 3 ? SC.error : PATTERN_TONE.rules} k={p(t, 21.1 + i * 0.3, 21.6 + i * 0.3)}>
                <text x={18} y={32} fontSize={12.5} fontWeight={900} fill={SC.muted}>{l.toUpperCase()}</text>
                <text x={18} y={76} fontSize={34} fontWeight={900} fill={SC.text}>{n}</text>
              </Box>
            ))}
            <Box x={60} y={220} w={840} h={260} tone={SC.error} k={p(t, 22.6, 23.2)}>
              <text x={22} y={34} fontSize={13} fontWeight={900} fill={SC.muted}>NEEDS SOMEONE · MOST URGENT FIRST</text>
              {[['NBZ-4471 · Kondapur hub', '18 min left', 'Send rider'], ['NBZ-4502 · Kondapur hub', '24 min left', 'Send rider'], ['NBZ-3980 · Analyser 3 down', '41 min left', 'Move to analyser 5'], ['NBZ-5127 · Pune hub', '55 min left', 'Call hub']].map(([s, left, act], i) => (
                <g key={s} transform={`translate(22 ${52 + i * 50})`} opacity={p(t, 23.2 + i * 0.35, 23.6 + i * 0.35)}>
                  <rect width={796} height={40} rx={10} fill={SC.soft} />
                  <text x={16} y={26} fontSize={14} fontWeight={800} fill={SC.text}>{s}</text>
                  <text x={480} y={26} fontSize={14} fontWeight={900} fill={SC.text}>{left}</text>
                  <rect x={624} y={6} width={160} height={28} rx={14} fill={SC.surface} stroke={SC.line} />
                  <text x={704} y={25} fontSize={12.5} fontWeight={800} fill={SC.text} textAnchor="middle">{act}</text>
                </g>
              ))}
            </Box>
          </g>
        )}

        {t >= 26 && t < 31 && (
          <g>
            <Box x={60} y={100} w={840} h={150} tone={PATTERN_TONE.rules}>
              <text x={22} y={36} fontSize={13} fontWeight={900} fill={SC.muted}>REMIND EVERYONE WHO…</text>
              {['hasn’t booked', 'works in Pune', 'is on the 14 March camp'].map((c, i) => (
                <g key={c} transform={`translate(${22 + i * 250} 56)`} opacity={p(t, 26.3 + i * 0.6, 26.8 + i * 0.6)}>
                  <rect width={232} height={44} rx={22} fill={SC.build} opacity={0.18} />
                  <rect width={232} height={44} rx={22} fill="none" stroke={SC.build} strokeWidth={2} />
                  <text x={116} y={28} fontSize={14} fontWeight={900} fill={SC.text} textAnchor="middle">{c}</text>
                </g>
              ))}
              <text x={22} y={134} fontSize={15} fontWeight={900} fill={SC.text} opacity={p(t, 28.2, 28.7)}>Reaches {NABZ_TASKS.nudge.count.toLocaleString('en-IN')} people</text>
            </Box>
            <Box x={60} y={270} w={840} h={200} tone={SC.line} k={p(t, 28.6, 29.2)}>
              <text x={22} y={34} fontSize={13} fontWeight={900} fill={SC.muted}>PREVIEW</text>
              {['Nikhil Deshpande · Hinjewadi', 'Pooja Bhosale · Kharadi', 'Sameer Kulkarni · Hinjewadi'].map((n, i) => (
                <text key={n} x={22} y={70 + i * 30} fontSize={14} fontWeight={800} fill={SC.text}>{n}</text>
              ))}
              <text x={22} y={170} fontSize={14} fontWeight={800} fill={SC.muted}>and {(NABZ_TASKS.nudge.count - 3).toLocaleString('en-IN')} more. People drop off the rule as they book.</text>
            </Box>
          </g>
        )}

        {t >= 31 && (
          <g transform="translate(60 100)">
            {['The real count today, and in two years', 'The longest name: Venkata Satyanarayana Murthy Chilukuri', 'The busiest morning: 300 phlebotomists start at once', 'The empty state, one item, and a slow load'].map((s, i) => (
              <g key={s} transform={`translate(0 ${i * 78})`} opacity={p(t, 31.2 + i * 0.7, 31.7 + i * 0.7)}>
                <rect width={840} height={62} rx={14} fill={SC.surface} stroke={SC.line} strokeWidth={2} />
                <circle cx={34} cy={31} r={13} fill={SC.surface} stroke={SC.mint} strokeWidth={3} />
                <path d="M28 31 l4 4 l8 -8" fill="none" stroke={SC.mint} strokeWidth={3} strokeLinecap="round" />
                <text x={62} y={37} fontSize={16} fontWeight={800} fill={SC.text}>{s}</text>
              </g>
            ))}
          </g>
        )}
      </g>
    </svg>
  );
}
