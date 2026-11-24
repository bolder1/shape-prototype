'use client';
// Scene for gr.2-1: Kaksha's seven-screen welcome tour flicks past in twelve seconds, and on the 1st Meenakshi can't
// find fee reminders, so she writes to 22 parents by hand. Nisha draws her first month as a flow of four moments
// (`KAKSHA_MOMENTS`), first open asks for one batch, and each tip from `KAKSHA_TIPS` drops onto the moment `cueFor`
// gives it while the phone shows it in place. A three-item checklist ticks off, and the numbers close it. `KakshaPhone`
// and `KAKSHA` are shared with the other gr.2 scenes and games. Pure function of t (0–36).
import { KAKSHA_MOMENTS, KAKSHA_TIPS, cueFor, type KakshaMoment, type KakshaTip } from '@shape/content';
import { back, clamp, Grid, p, SC } from './shared';
import { INK, INK_MUTED } from './EaseCurves';

const W = 960, H = 540;
/** Kaksha's brand colour; white text on it passes 4.5:1. */
export const KAKSHA = '#0E7090';
export const KAKSHA_SOFT = '#E0F2F7';
export const PHONE_W = 220, PHONE_H = 420;

/** Kaksha on a phone, 220 × 420, with a header bar. Children draw on the white screen below the header (y from 56). */
export function KakshaPhone({ title, children }: { title: string; children?: React.ReactNode }) {
  return (
    <g>
      <rect width={PHONE_W} height={PHONE_H} rx={30} fill="#101828" />
      <rect x={8} y={8} width={PHONE_W - 16} height={PHONE_H - 16} rx={24} fill="#FFFFFF" />
      <path d={`M8 32 Q8 8 32 8 L${PHONE_W - 32} 8 Q${PHONE_W - 8} 8 ${PHONE_W - 8} 32 L${PHONE_W - 8} 52 L8 52 Z`} fill={KAKSHA} />
      <text x={PHONE_W / 2} y={37} textAnchor="middle" fontSize={14} fontWeight={900} fill="#FFFFFF">{title}</text>
      {children}
    </g>
  );
}

const MOMENTS = Object.keys(KAKSHA_MOMENTS) as KakshaMoment[];
const TOUR = ['Batches', 'Attendance', 'Homework', 'Fees', 'Reports', 'Reschedule', 'Parents'];
/** Tips the scene drops, in order, and what the phone shows for each. */
const DROPS: { tip: KakshaTip; at: number; screen: string }[] = [
  { tip: 'batch', at: 17.4, screen: 'Batches' },
  { tip: 'attendance', at: 22.4, screen: 'Class 10 Maths' },
  { tip: 'homework', at: 24.2, screen: 'Class done' },
  { tip: 'remind', at: 26, screen: 'Fees · 1 Dec' },
];
const SHORT: Record<KakshaTip, string> = {
  batch: 'Create your first batch', students: 'Add students from contacts', attendance: 'Tap a name: present',
  parents: 'Choose parent updates', homework: 'Send tonight’s homework', reschedule: 'Move a class',
  remind: 'Remind who hasn’t paid', report: 'Monthly report',
};
const CHECKS = ['Create a batch', 'Add students', 'Mark your first class'];

function Coach({ text, y }: { text: string; y: number }) {
  return (
    <g transform={`translate(20 ${y})`}>
      <rect width={180} height={46} rx={12} fill={INK} />
      <path d="M30 46 L40 56 L50 46 Z" fill={INK} />
      <text x={12} y={20} fontSize={11} fontWeight={900} fill="#FFFFFF">{text}</text>
      <text x={12} y={36} fontSize={10} fontWeight={700} fill="#D0D5DD">Got it</text>
    </g>
  );
}

export function JustInTimeScene({ t }: { t: number }) {
  const intro = clamp(back(t / 0.6));
  const page = Math.min(6, Math.floor(clamp((t - 0.8) / 4.4) * 7));
  const drop = [...DROPS].reverse().find(d => t >= d.at);
  const nodeX = (i: number) => 330 + i * 180;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" role="img" aria-label="Animated story: Kaksha's seven-screen welcome tour is swiped past in seconds, and on the 1st the tutor can't find fee reminders and messages 22 parents by hand; the designer maps her first month as four moments, first open asks only for a batch, each tip appears on the moment it becomes useful and on the screen where it's used, a three-item checklist ticks off, and day-one setup rises from 38% to 61%">
      <rect width={W} height={H} fill={SC.soft} />
      <Grid />
      <g opacity={intro}>
        <text x={330} y={56} fontSize={22} fontWeight={900} fill={SC.text}>
          {t < 6 ? 'The welcome tour' : t < 11 ? 'The 1st of the month' : t < 17 ? 'Her first month, as a flow' : t < 22 ? 'One step at first open' : t < 28 ? 'Each tip waits its turn' : t < 32 ? 'A short checklist' : 'Taught in place'}
        </text>

        <g transform="translate(60 70)">
          {t < 6 && (
            <KakshaPhone title="Welcome to Kaksha">
              <rect x={30} y={90} width={160} height={120} rx={16} fill={KAKSHA_SOFT} />
              <text x={110} y={160} textAnchor="middle" fontSize={20} fontWeight={900} fill={KAKSHA}>{TOUR[page]}</text>
              <text x={110} y={250} textAnchor="middle" fontSize={12} fontWeight={700} fill={INK_MUTED}>Feature {page * 2 + 1} and {page * 2 + 2} of 14</text>
              {TOUR.map((_, i) => <circle key={i} cx={62 + i * 16} cy={300} r={4} fill={i === page ? KAKSHA : '#D0D5DD'} />)}
              <rect x={30} y={330} width={160} height={40} rx={20} fill={KAKSHA} />
              <text x={110} y={355} textAnchor="middle" fontSize={13} fontWeight={900} fill="#FFFFFF">Next</text>
            </KakshaPhone>
          )}
          {t >= 6 && t < 11 && (
            <KakshaPhone title="Home">
              <text x={110} y={200} textAnchor="middle" fontSize={13} fontWeight={700} fill={INK_MUTED}>Where are fee reminders?</text>
              <circle cx={110} cy={150} r={22} fill="none" stroke="#D0D5DD" strokeWidth={3} />
              <text x={110} y={157} textAnchor="middle" fontSize={20} fontWeight={900} fill="#98A2B3">?</text>
            </KakshaPhone>
          )}
          {t >= 11 && (
            <KakshaPhone title={drop?.screen ?? 'Kaksha'}>
              {(!drop || drop.tip === 'batch') && t >= 17 && (
                <g opacity={p(t, 17, 17.6)}>
                  <text x={110} y={120} textAnchor="middle" fontSize={13} fontWeight={800} fill={INK}>Your batches live here</text>
                  <rect x={40} y={250} width={140} height={40} rx={20} fill={KAKSHA} />
                  <text x={110} y={275} textAnchor="middle" fontSize={13} fontWeight={900} fill="#FFFFFF">Create a batch</text>
                  <Coach text="Start here: one batch" y={180} />
                </g>
              )}
              {drop?.tip === 'attendance' && (
                <g>
                  {['Aditya', 'Divya', 'Karthik', 'Lakshmi', 'Rohan'].map((n, i) => (
                    <g key={n} transform={`translate(24 ${76 + i * 40})`}>
                      <rect width={172} height={32} rx={8} fill={i < Math.floor((t - 22.4) * 3) ? KAKSHA_SOFT : '#F2F4F7'} />
                      <text x={12} y={21} fontSize={12} fontWeight={800} fill={INK}>{n}</text>
                      {i < Math.floor((t - 22.4) * 3) && <text x={160} y={21} textAnchor="end" fontSize={11} fontWeight={900} fill={KAKSHA}>Present</text>}
                    </g>
                  ))}
                  <Coach text="Tap a name: present" y={290} />
                </g>
              )}
              {drop?.tip === 'homework' && (
                <g>
                  <text x={110} y={110} textAnchor="middle" fontSize={14} fontWeight={900} fill={INK}>8 of 8 present</text>
                  <text x={110} y={132} textAnchor="middle" fontSize={11} fontWeight={700} fill={INK_MUTED}>Parents told on WhatsApp</text>
                  <rect x={40} y={250} width={140} height={40} rx={20} fill={KAKSHA} />
                  <text x={110} y={275} textAnchor="middle" fontSize={13} fontWeight={900} fill="#FFFFFF">Send homework</text>
                  <Coach text="Tonight’s sums, to all" y={180} />
                </g>
              )}
              {drop?.tip === 'remind' && (
                <g>
                  {[['Aditya', true], ['Divya', false], ['Karthik', true], ['Rohan', false]].map(([n, paid], i) => (
                    <g key={String(n)} transform={`translate(24 ${76 + i * 40})`}>
                      <rect width={172} height={32} rx={8} fill="#F2F4F7" />
                      <text x={12} y={21} fontSize={12} fontWeight={800} fill={INK}>{n}</text>
                      <text x={160} y={21} textAnchor="end" fontSize={11} fontWeight={900} fill={paid ? '#067647' : '#B42318'}>{paid ? 'Paid' : 'Due ₹1,500'}</text>
                    </g>
                  ))}
                  <Coach text="Remind the 2 who haven’t paid" y={250} />
                </g>
              )}
            </KakshaPhone>
          )}
        </g>

        {t < 6 && (
          <g transform="translate(330 110)" opacity={p(t, 1, 1.6)}>
            <text x={0} y={0} fontSize={64} fontWeight={900} fill={SC.text}>12 s</text>
            <text x={0} y={34} fontSize={16} fontWeight={800} fill={SC.muted}>to swipe past fourteen features, between two classes</text>
          </g>
        )}

        {t >= 6 && t < 11 && (
          <g transform="translate(330 100)">
            {Array.from({ length: Math.min(22, Math.floor((t - 6.4) * 6)) }, (_, i) => (
              <g key={i} transform={`translate(${(i % 6) * 96} ${Math.floor(i / 6) * 52})`}>
                <rect width={86} height={40} rx={12} fill="#DCFAE6" />
                <text x={43} y={25} textAnchor="middle" fontSize={11} fontWeight={800} fill="#085D3A">Fees due…</text>
              </g>
            ))}
            <text x={0} y={250} fontSize={18} fontWeight={900} fill={SC.text} opacity={p(t, 8.6, 9.2)}>22 WhatsApp messages, typed one by one</text>
          </g>
        )}

        {t >= 11 && t < 28 && (
          <g>
            <line x1={nodeX(0)} x2={nodeX(0) + (nodeX(3) - nodeX(0)) * p(t, 11.4, 13)} y1={150} y2={150} stroke={SC.line} strokeWidth={4} />
            {MOMENTS.map((m, i) => (
              <g key={m} transform={`translate(${nodeX(i)} 150)`} opacity={p(t, 11.6 + i * 0.5, 12.2 + i * 0.5)}>
                <circle r={16} fill={drop && cueFor(KAKSHA_TIPS[drop.tip].needs) === m ? KAKSHA : SC.surface} stroke={KAKSHA} strokeWidth={3} />
                <text y={-30} textAnchor="middle" fontSize={13} fontWeight={900} fill={SC.text}>{KAKSHA_MOMENTS[m].label.split(',')[0]}</text>
                {DROPS.filter(d => cueFor(KAKSHA_TIPS[d.tip].needs) === m && t >= d.at).map(d => (
                  <g key={d.tip} transform={`translate(-78 ${34 + 50 * (1 - p(t, d.at, d.at + 0.6))})`} opacity={p(t, d.at, d.at + 0.5)}>
                    <rect width={156} height={40} rx={12} fill={SC.surface} stroke={KAKSHA} strokeWidth={2} />
                    <text x={78} y={25} textAnchor="middle" fontSize={11.5} fontWeight={800} fill={SC.text}>{SHORT[d.tip]}</text>
                  </g>
                ))}
              </g>
            ))}
            {t >= 13.6 && t < 17 && (
              <text x={330} y={290} fontSize={16} fontWeight={800} fill={SC.muted} opacity={p(t, 13.6, 14.2)}>Teach each thing when she can first use it. Not before, not after.</text>
            )}
          </g>
        )}

        {t >= 28 && t < 32 && (
          <g transform="translate(330 100)">
            <rect width={400} height={200} rx={18} fill={SC.surface} stroke={SC.line} />
            <text x={24} y={40} fontSize={15} fontWeight={900} fill={SC.text}>Get started · {Math.min(3, Math.floor((t - 28.4) / 0.9) + 1)} of 3</text>
            {CHECKS.map((c, i) => {
              const done = t >= 28.6 + i * 0.9;
              return (
                <g key={c} transform={`translate(24 ${70 + i * 40})`}>
                  <circle cx={12} cy={10} r={12} fill={done ? KAKSHA : 'none'} stroke={KAKSHA} strokeWidth={2} />
                  {done && <path d="M6 10 L10 14 L18 6" stroke="#FFFFFF" strokeWidth={2.5} fill="none" />}
                  <text x={36} y={15} fontSize={15} fontWeight={800} fill={SC.text}>{c}</text>
                </g>
              );
            })}
          </g>
        )}

        {t >= 32 && (
          <g transform="translate(330 110)">
            {[['Setup finished on day one', '38%', '61%'], ['Fee reminders sent, first month', '1×', '4×']].map(([label, a, b], i) => (
              <g key={label} transform={`translate(0 ${i * 120})`} opacity={p(t, 32.2 + i * 0.8, 32.8 + i * 0.8)}>
                <text x={0} y={0} fontSize={15} fontWeight={800} fill={SC.muted}>{label}</text>
                <text x={0} y={56} fontSize={48} fontWeight={900} fill={SC.muted}>{a}</text>
                <text x={130} y={52} fontSize={30} fontWeight={900} fill={SC.muted}>→</text>
                <text x={180} y={56} fontSize={48} fontWeight={900} fill={SC.text}>{b}</text>
              </g>
            ))}
          </g>
        )}
      </g>
    </svg>
  );
}
