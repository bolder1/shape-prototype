'use client';
// Scene for gr.2-2: Meenakshi opens Kaksha's Batches screen to "No batches found." and Siddharth's funnel shows 46% of
// new tutors never make a batch. Nisha outlines the screen's four parts (`EMPTY_SLOTS`) and fills them one by one with
// the pieces from `EMPTY_PIECES` that `emptyFlaw` passes: the message, students from contacts (a tap counter races the
// old 11-field form), one button where four competed, and a faded example card where tiles of zeros sat. The numbers
// close it, with the Fees tab's empty state beside. Pure function of t (0–36).
import { EMPTY_PIECES, firstValueTaps } from '@shape/content';
import { back, clamp, Grid, p, SC } from './shared';
import { INK, INK_MUTED } from './EaseCurves';
import { KAKSHA, KAKSHA_SOFT, KakshaPhone } from './JustInTime';

const W = 960, H = 540;
const GOOD_TAPS = firstValueTaps([EMPTY_PIECES.fillContacts, EMPTY_PIECES.actOne]);
const SLOT_Y = { message: 70, starter: 150, action: 226, preview: 290 } as const;

function Slot({ y, h, label, show }: { y: number; h: number; label: string; show: number }) {
  return (
    <g opacity={show}>
      <rect x={18} y={y} width={184} height={h} rx={10} fill="none" stroke={KAKSHA} strokeWidth={1.5} strokeDasharray="5 4" />
      <text x={26} y={y + 14} fontSize={9} fontWeight={900} fill={KAKSHA}>{label.toUpperCase()}</text>
    </g>
  );
}

export function EmptyActivateScene({ t }: { t: number }) {
  const intro = clamp(back(t / 0.6));
  const slots = t >= 6 && t < 31 ? p(t, 6.6, 7.4) : 0;
  const msg = p(t, 11.2, 11.8), fill = p(t, 16.2, 16.8), act = p(t, 21.4, 22), prev = p(t, 26.4, 27);
  const contactTaps = Math.min(4, Math.floor(clamp((t - 17) / 2.4) * 5));
  const formTaps = Math.min(14, Math.floor(clamp((t - 17) / 3.6) * 15));

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" role="img" aria-label="Animated story: Kaksha's empty Batches screen says only 'No batches found' and 46% of new tutors never create a batch; the designer outlines four parts of the screen and fills them with a message that says what goes there, students picked from phone contacts in four taps instead of an eleven-field form, one Create a batch button instead of four, and a faded example card instead of tiles of zeros; tutors creating a batch on day one rise from 54% to 81%">
      <rect width={W} height={H} fill={SC.soft} />
      <Grid />
      <g opacity={intro}>
        <text x={330} y={56} fontSize={22} fontWeight={900} fill={SC.text}>
          {t < 6 ? '“No batches found.”' : t < 11 ? 'The first step, not a gap' : t < 16 ? 'Say what goes here' : t < 21 ? 'Make the first step cheap' : t < 26 ? 'One button' : t < 31 ? 'Show what it will look like' : 'A batch in five taps'}
        </text>

        <g transform="translate(60 70)">
          <KakshaPhone title="Batches">
            {t < 11 && <text x={110} y={210} textAnchor="middle" fontSize={13} fontWeight={700} fill="#98A2B3" opacity={1 - slots * 0.6}>No batches found.</text>}
            <Slot y={SLOT_Y.message} h={70} label="Message" show={slots} />
            <Slot y={SLOT_Y.starter} h={66} label="First content" show={slots} />
            <Slot y={SLOT_Y.action} h={56} label="Action" show={slots} />
            <Slot y={SLOT_Y.preview} h={100} label="Until then" show={slots} />

            <g opacity={msg}>
              <text x={30} y={SLOT_Y.message + 34} fontSize={12} fontWeight={900} fill={INK}>Your batches live here.</text>
              <text x={30} y={SLOT_Y.message + 50} fontSize={10} fontWeight={700} fill={INK_MUTED}>One for each group you teach;</text>
              <text x={30} y={SLOT_Y.message + 63} fontSize={10} fontWeight={700} fill={INK_MUTED}>we keep attendance, tell parents.</text>
            </g>
            <g opacity={fill}>
              <rect x={30} y={SLOT_Y.starter + 22} width={160} height={34} rx={10} fill={KAKSHA_SOFT} />
              <text x={42} y={SLOT_Y.starter + 43} fontSize={11} fontWeight={800} fill={KAKSHA}>Pick from contacts</text>
              <text x={180} y={SLOT_Y.starter + 43} textAnchor="end" fontSize={11} fontWeight={900} fill={KAKSHA}>{contactTaps} taps</text>
            </g>
            {t >= 21 && t < 21.6 && ['Batch', 'Student', 'Fees', 'Tutorial'].map((b, i) => (
              <g key={b} transform={`translate(${28 + i * 42} ${SLOT_Y.action + 22})`}>
                <rect width={38} height={26} rx={8} fill="#F2F4F7" stroke="#D0D5DD" />
                <text x={19} y={17} textAnchor="middle" fontSize={8} fontWeight={800} fill={INK}>{b}</text>
              </g>
            ))}
            <g opacity={act}>
              <rect x={30} y={SLOT_Y.action + 18} width={160} height={32} rx={16} fill={KAKSHA} />
              <text x={110} y={SLOT_Y.action + 39} textAnchor="middle" fontSize={12} fontWeight={900} fill="#FFFFFF">Create a batch</text>
            </g>
            {t >= 6 && t < 26.6 && (
              <g opacity={(1 - prev) * slots}>
                {['0 students', '0%', '₹0'].map((z, i) => (
                  <g key={z} transform={`translate(${28 + i * 56} ${SLOT_Y.preview + 30})`}>
                    <rect width={50} height={50} rx={10} fill="#F2F4F7" />
                    <text x={25} y={30} textAnchor="middle" fontSize={10} fontWeight={900} fill="#98A2B3">{z}</text>
                  </g>
                ))}
              </g>
            )}
            <g opacity={prev * 0.55}>
              <rect x={30} y={SLOT_Y.preview + 24} width={160} height={66} rx={12} fill="#F9FAFB" stroke="#D0D5DD" />
              <text x={42} y={SLOT_Y.preview + 46} fontSize={11} fontWeight={900} fill={INK}>Class 10 Maths</text>
              <text x={42} y={SLOT_Y.preview + 62} fontSize={9.5} fontWeight={700} fill={INK_MUTED}>Mon Wed Fri · 5 pm</text>
              <text x={42} y={SLOT_Y.preview + 78} fontSize={9.5} fontWeight={700} fill={INK_MUTED}>8 students</text>
            </g>
            <g opacity={prev}>
              <rect x={128} y={SLOT_Y.preview + 30} width={54} height={18} rx={9} fill={INK} />
              <text x={155} y={SLOT_Y.preview + 43} textAnchor="middle" fontSize={9} fontWeight={900} fill="#FFFFFF">Example</text>
            </g>
          </KakshaPhone>
        </g>

        {t < 6 && (
          <g transform="translate(330 110)" opacity={p(t, 1.4, 2)}>
            <text x={0} y={0} fontSize={15} fontWeight={800} fill={SC.muted}>New tutors this month</text>
            {[['Opened Batches', 100], ['Created a batch', 54]].map(([l, v], i) => (
              <g key={String(l)} transform={`translate(0 ${30 + i * 60})`}>
                <rect width={5 * Number(v)} height={40} rx={8} fill={i ? KAKSHA : INK_MUTED} opacity={p(t, 2 + i * 0.6, 2.6 + i * 0.6)} />
                <text x={12} y={26} fontSize={14} fontWeight={900} fill="#FFFFFF" opacity={p(t, 2 + i * 0.6, 2.6 + i * 0.6)}>{l} · {v}%</text>
              </g>
            ))}
            <text x={0} y={190} fontSize={22} fontWeight={900} fill={SC.text} opacity={p(t, 3.6, 4.2)}>46% never made one.</text>
          </g>
        )}

        {t >= 6 && t < 11 && (
          <g transform="translate(330 110)" opacity={p(t, 7, 7.6)}>
            <text x={0} y={0} fontSize={17} fontWeight={800} fill={SC.text}>For a new tutor, every screen starts empty.</text>
            <text x={0} y={32} fontSize={17} fontWeight={800} fill={SC.text}>So the empty screen has to start the work:</text>
            {['Say what goes here', 'Make the first content cheap', 'One action', 'Show what it will look like'].map((s, i) => (
              <text key={s} x={0} y={84 + i * 32} fontSize={16} fontWeight={800} fill={SC.muted} opacity={p(t, 7.8 + i * 0.5, 8.3 + i * 0.5)}>{i + 1}. {s}</text>
            ))}
          </g>
        )}

        {t >= 16 && t < 21 && (
          <g transform="translate(330 100)">
            {[['Pick from contacts', contactTaps, 4, KAKSHA], ['11-field form per student', formTaps, 14, '#98A2B3']].map(([label, n, max, fillC], i) => (
              <g key={String(label)} transform={`translate(0 ${i * 100})`} opacity={p(t, 16.4 + i * 0.4, 17 + i * 0.4)}>
                <text x={0} y={0} fontSize={15} fontWeight={800} fill={SC.text}>{label}</text>
                <rect y={14} width={400} height={30} rx={8} fill={SC.surface} stroke={SC.line} />
                <rect y={14} width={(400 * Number(n)) / 14} height={30} rx={8} fill={String(fillC)} />
                <text x={412} y={36} fontSize={15} fontWeight={900} fill={SC.text}>{n}{Number(n) >= Number(max) && i === 1 ? '+ taps, per student' : ' taps'}</text>
              </g>
            ))}
          </g>
        )}

        {t >= 21 && t < 26 && (
          <text x={330} y={140} fontSize={17} fontWeight={800} fill={SC.text} opacity={p(t, 22, 22.6)}>Four equal buttons ask her to choose before she knows the app.</text>
        )}
        {t >= 26 && t < 31 && (
          <g opacity={p(t, 27, 27.6)}><text x={330} y={140} fontSize={17} fontWeight={800} fill={SC.text}>A labelled example shows what a batch will look like.</text><text x={330} y={170} fontSize={17} fontWeight={800} fill={SC.muted}>Tiles of zeros only look like failure.</text></g>
        )}

        {t >= 31 && (
          <g transform="translate(330 110)">
            <g opacity={p(t, 31.2, 31.8)}>
              <text x={0} y={0} fontSize={15} fontWeight={800} fill={SC.muted}>Tutors who create a batch on day one</text>
              <text x={0} y={56} fontSize={48} fontWeight={900} fill={SC.muted}>54%</text>
              <text x={140} y={52} fontSize={30} fontWeight={900} fill={SC.muted}>→</text>
              <text x={190} y={56} fontSize={48} fontWeight={900} fill={SC.text}>81%</text>
              <text x={0} y={92} fontSize={15} fontWeight={800} fill={SC.muted}>{GOOD_TAPS} taps from empty screen to a batch with students</text>
            </g>
            <g transform="translate(0 130)" opacity={p(t, 32.6, 33.2)}>
              <rect width={520} height={96} rx={16} fill={SC.surface} stroke={SC.line} />
              <text x={20} y={30} fontSize={13} fontWeight={900} fill={SC.muted}>FEES TAB, WEEK ONE</text>
              <text x={20} y={56} fontSize={15} fontWeight={800} fill={SC.text}>“On the 1st, you’ll see who has paid here.”</text>
              <text x={20} y={80} fontSize={14} fontWeight={700} fill={SC.muted}>Set each batch’s fee so reminders are ready.</text>
            </g>
          </g>
        )}
      </g>
    </svg>
  );
}
