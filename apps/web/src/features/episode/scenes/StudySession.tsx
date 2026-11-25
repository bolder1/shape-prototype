'use client';
// Scene for ax.3-1: Hazri's leave flow passed every automated check, then Salma, who is blind, couldn't book a day
// off with TalkBack. Then: a screener that asks about access needs (`HAZRI_SCREENER`) and fair pay
// (`INCENTIVE_PER_HOUR`), a study that is itself accessible, participants on their own setups leading the session,
// findings with a severity, a criterion and an owner, and a monthly panel. Pure function of t (0–36). Also exports
// `FLAW_FILL`, which `study-fix` uses.
import { HAZRI_SCREENER, INCENTIVE_PER_HOUR, type StudyFlaw } from '@shape/content';
import { back, clamp, Grid, lerp, p, SC } from './shared';

const W = 640, H = 360;
/** One fill per study flaw; white text on each passes 4.5:1. */
export const FLAW_FILL: Record<StudyFlaw, string> = { sound: '#067647', harms: '#B42318', excludes: '#6941C6', skews: '#175CD3' };

function Tick({ x, y, on }: { x: number; y: number; on: number }) {
  return (
    <g opacity={on}>
      <circle cx={x} cy={y} r={13} fill={FLAW_FILL.sound} />
      <path d={`M ${x - 6} ${y} L ${x - 2} ${y + 5} L ${x + 6} ${y - 5}`} fill="none" stroke="#fff" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
    </g>
  );
}

/** A phone outline with its screen origin at (x, y). */
function Phone({ x, y, children }: { x: number; y: number; children?: React.ReactNode }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect width={170} height={270} rx={24} fill={SC.surface} stroke={SC.text} strokeWidth={3} />
      <rect x={66} y={12} width={38} height={6} rx={3} fill={SC.line} />
      {children}
    </g>
  );
}

export function StudySessionScene({ t }: { t: number }) {
  const intro = clamp(back(t / 0.6));
  const title = t < 6 ? 'Zero violations' : t < 11 ? '“Button. Button. Button.”' : t < 16 ? 'Ask what people use' : t < 21 ? 'Make the study accessible' : t < 26 ? 'Their setup, their lead' : t < 31 ? 'Findings with owners' : 'Every month, not once';

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" role="img" aria-label={`Animated story: Hazri's leave flow passes an automated scan with zero violations and a WCAG 2.2 AA checklist, and ships. Salma, who is blind, swipes through the date picker with TalkBack and hears only “button” for every date, so she can't apply for leave. The team's screener asks what people use, ${HAZRI_SCREENER.join(', ')}, never a diagnosis, and pays everyone ₹${INCENTIVE_PER_HOUR.toLocaleString('en-IN')} an hour. The study is made accessible: a consent form TalkBack can read, an Indian Sign Language interpreter Joseph chose, and a step-free room or a session at home. Salma uses her own phone at her own speech rate and shares its audio, and the moderator waits when she is stuck. Each finding gets a severity, the criterion it fails and the squad that owns the screen. A paid panel tests every month, and Salma books leave in 40 seconds.`}>
      <rect width={W} height={H} fill={SC.soft} />
      <Grid w={W} h={H} />
      <g opacity={intro}>
        <text x={32} y={44} fontSize={26} fontWeight={900} fill={SC.text}>{title}</text>

        {t < 6 && (
          <g>
            {[['Automated scan', '0 violations'], ['WCAG 2.2 AA checklist', 'every item passed'], ['Keyboard pass', 'every control reached']].map(([a, b], i) => (
              <g key={a} opacity={p(t, 0.4 + i * 0.8, 1 + i * 0.8)}>
                <rect x={32} y={72 + i * 72} width={576} height={58} rx={12} fill={SC.surface} stroke={SC.line} strokeWidth={2} />
                <text x={52} y={109 + i * 72} fontSize={21} fontWeight={900} fill={SC.text}>{a}</text>
                <text x={560} y={109 + i * 72} fontSize={21} fontWeight={800} fill={SC.muted} textAnchor="end">{b}</text>
                <Tick x={586} y={101 + i * 72} on={p(t, 0.8 + i * 0.8, 1.2 + i * 0.8)} />
              </g>
            ))}
            <g opacity={p(t, 3.6, 4.2)}>
              <rect x={32} y={294} width={210} height={44} rx={22} fill={FLAW_FILL.sound} />
              <text x={137} y={323} fontSize={21} fontWeight={900} fill="#fff" textAnchor="middle">Leave flow ships</text>
            </g>
          </g>
        )}

        {t >= 6 && t < 11 && (
          <g>
            <Phone x={32} y={70}>
              <text x={20} y={50} fontSize={21} fontWeight={900} fill={SC.text}>Apply for leave</text>
              {Array.from({ length: 12 }, (_, i) => {
                const focus = Math.floor(lerp(0, 12, p(t, 6.4, 10))) === i;
                return <rect key={i} x={20 + (i % 4) * 34} y={70 + Math.floor(i / 4) * 34} width={28} height={28} rx={6} fill={focus ? SC.brand : SC.soft} stroke={focus ? SC.text : SC.line} strokeWidth={focus ? 3 : 1.5} />;
              })}
              <rect x={20} y={196} width={130} height={40} rx={20} fill={SC.line} />
            </Phone>
            {[0, 1, 2].map(i => (
              <g key={i} opacity={p(t, 6.6 + i * 0.9, 7 + i * 0.9)}>
                <rect x={236} y={80 + i * 62} width={180} height={46} rx={23} fill={SC.surface} stroke={SC.text} strokeWidth={2} />
                <text x={326} y={110 + i * 62} fontSize={21} fontWeight={800} fill={SC.text} textAnchor="middle">“Button”</text>
              </g>
            ))}
            <text x={236} y={290} fontSize={21} fontWeight={800} fill={SC.muted} opacity={p(t, 9, 9.6)}>No date is read out.</text>
            <text x={236} y={322} fontSize={22} fontWeight={900} fill={SC.error} opacity={p(t, 9.4, 10)}>Salma can’t apply for leave.</text>
          </g>
        )}

        {t >= 11 && t < 16 && (
          <g>
            <text x={32} y={86} fontSize={21} fontWeight={800} fill={SC.muted} opacity={p(t, 11.2, 11.7)}>Which of these do you use?</text>
            {HAZRI_SCREENER.map((s, i) => (
              <g key={s} opacity={p(t, 11.5 + i * 0.4, 11.9 + i * 0.4)}>
                <rect x={32} y={102 + i * 40} width={24} height={24} rx={6} fill={SC.surface} stroke={SC.text} strokeWidth={2} />
                <text x={68} y={121 + i * 40} fontSize={21} fontWeight={700} fill={SC.text}>{s}</text>
              </g>
            ))}
            <g opacity={p(t, 14, 14.6)}>
              <text x={32} y={330} fontSize={21} fontWeight={900} fill={SC.text}>₹{INCENTIVE_PER_HOUR.toLocaleString('en-IN')} an hour, for everyone</text>
              <text x={608} y={330} fontSize={21} fontWeight={800} fill={FLAW_FILL.harms} textAnchor="end" textDecoration="line-through">Diagnosis?</text>
            </g>
          </g>
        )}

        {t >= 16 && t < 21 && (
          <g>
            {[['Consent form', 'TalkBack can read it'], ['ISL interpreter', 'the one Joseph chose'], ['Step-free room', 'or the session at home'], ['90 minutes', 'three tasks and a break']].map(([a, b], i) => (
              <g key={a} opacity={p(t, 16.3 + i * 0.7, 16.9 + i * 0.7)}>
                <rect x={32} y={70 + i * 66} width={576} height={54} rx={12} fill={SC.surface} stroke={FLAW_FILL.excludes} strokeWidth={2} />
                <text x={52} y={104 + i * 66} fontSize={21} fontWeight={900} fill={SC.text}>{a}</text>
                <text x={588} y={104 + i * 66} fontSize={21} fontWeight={700} fill={SC.muted} textAnchor="end">{b}</text>
              </g>
            ))}
          </g>
        )}

        {t >= 21 && t < 26 && (() => {
          const wait = Math.round(lerp(0, 30, p(t, 22.6, 25)));
          return (
            <g>
              <Phone x={32} y={70}>
                {Array.from({ length: 9 }, (_, i) => {
                  const h = 16 + 40 * Math.abs(Math.sin(t * 6 + i * 0.9));
                  return <rect key={i} x={24 + i * 14} y={140 - h / 2} width={8} height={h} rx={4} fill={FLAW_FILL.skews} />;
                })}
                <text x={85} y={216} fontSize={21} fontWeight={900} fill={SC.text} textAnchor="middle">2.5× speech</text>
              </Phone>
              <g opacity={p(t, 21.6, 22.2)}>
                <text x={236} y={100} fontSize={21} fontWeight={900} fill={SC.text}>Her phone, her settings</text>
                <text x={236} y={132} fontSize={21} fontWeight={700} fill={SC.muted}>Audio shared with the team</text>
              </g>
              <g opacity={p(t, 22.4, 23)}>
                <rect x={236} y={176} width={372} height={92} rx={14} fill={SC.surface} stroke={SC.line} strokeWidth={2} />
                <text x={256} y={212} fontSize={21} fontWeight={800} fill={SC.muted}>Stuck. The moderator waits</text>
                <text x={256} y={252} fontSize={30} fontWeight={900} fill={SC.text}>{wait} s</text>
              </g>
              <text x={236} y={318} fontSize={21} fontWeight={800} fill={SC.text} opacity={p(t, 24.6, 25.2)}>“What would you try next?”</text>
            </g>
          );
        })()}

        {t >= 26 && t < 31 && (
          <g>
            {([['Dates read as “button”', 'Critical · 4.1.2 · Leave squad', FLAW_FILL.harms], ['Submit icon has no name', 'Critical · 4.1.2 · Leave squad', FLAW_FILL.harms], ['Half-day rule unclear', 'Serious · no AA criterion · Content', FLAW_FILL.skews]] as const).map(([a, b, fill], i) => (
              <g key={a} opacity={p(t, 26.3 + i * 0.8, 26.9 + i * 0.8)}>
                <rect x={32} y={70 + i * 78} width={576} height={64} rx={12} fill={SC.surface} stroke={SC.line} strokeWidth={2} />
                <rect x={32} y={70 + i * 78} width={8} height={64} rx={4} fill={fill} />
                <text x={56} y={98 + i * 78} fontSize={21} fontWeight={900} fill={SC.text}>{a}</text>
                <text x={56} y={124 + i * 78} fontSize={21} fontWeight={700} fill={SC.muted}>{b}</text>
              </g>
            ))}
            <text x={32} y={334} fontSize={21} fontWeight={800} fill={SC.text} opacity={p(t, 29, 29.6)}>Recordings private. Participants: P1 to P6.</text>
          </g>
        )}

        {t >= 31 && (
          <g>
            {['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'].map((m, i) => {
              const on = p(t, 31.2 + i * 0.18, 31.5 + i * 0.18);
              return (
                <g key={i}>
                  <circle cx={56 + i * 48} cy={104} r={18} fill={FLAW_FILL.sound} opacity={on} />
                  <text x={56 + i * 48} y={111} fontSize={21} fontWeight={900} fill="#fff" textAnchor="middle" opacity={on}>{m}</text>
                </g>
              );
            })}
            <text x={32} y={164} fontSize={21} fontWeight={800} fill={SC.muted} opacity={p(t, 33, 33.5)}>A paid panel, every month</text>
            <g opacity={p(t, 33.6, 34.2)}>
              <rect x={32} y={198} width={576} height={84} rx={14} fill={FLAW_FILL.sound} />
              <text x={56} y={250} fontSize={26} fontWeight={900} fill="#fff">Salma books leave in 40 seconds</text>
            </g>
          </g>
        )}
      </g>
    </svg>
  );
}
