'use client';
// Scene for bz.3-1: Karan's first Sunrise demo (`KARAN_FIRST_DEMO`) fills a timeline with the founding story, every
// settings tab, a "Test Patient 1" booking, inventory and an unbuilt AI scribe: 32 minutes against the 20-minute line,
// and none of Sunrise's three pains ticked (`demoGaps`, `demoFlaws`). Then Aditi's rebuild: the recap, a WhatsApp
// reminder to Asha Jadhav on Sunrise's own clinic, each pain answered in the order Sunrise ranked them (`demoOrder`),
// the tours struck off, and a pilot to close: 17 minutes, no flaws. Pure function of t (0–36).
// Also exports `PAIN_TONE`, `momentTone`, `MOMENT_SHORT` and `FLAW_NAME` for `demo-build`.
import { DEMO_MINUTES, DEMO_PAINS, KARAN_FIRST_DEMO, PAIN_NAME, SUNRISE_MOMENTS, demoFlaws, demoGaps, demoLength, demoOrder, type DemoFlaw, type DemoMoment, type DemoPain, type SunriseMoment } from '@shape/content';
import { back, clamp, Grid, p, SC } from './shared';

const W = 960, H = 540;
export const PAIN_TONE: Record<DemoPain, string> = { noshow: SC.discover, queue: SC.grow, rx: SC.build };
export const momentTone = (m: DemoMoment) => (m.kind === 'pain' && !m.dummy ? PAIN_TONE[m.pain!] : m.kind === 'open' || m.kind === 'close' ? SC.design : SC.muted);
export const FLAW_NAME: Record<DemoFlaw, string> = {
  long: `Over ${DEMO_MINUTES} minutes`, gap: 'A Sunrise problem never shown', tour: 'A tour nobody asked for', dummy: '“Test Patient 1” data', noclose: 'No next step',
};
export const MOMENT_SHORT: Record<SunriseMoment, string> = {
  recap: 'Recap', reminders: 'Reminders', billing: 'UPI bill', rx: 'Prescription', pilot: 'Pilot',
  history: 'Our story', settings: 'Settings ×14', inventory: 'Inventory', dummy: 'Test Patient 1', scribe: 'AI scribe',
};
const NEW: SunriseMoment[] = demoOrder(['pilot', 'rx', 'billing', 'reminders', 'recap'], k => SUNRISE_MOMENTS[k]);
const OLD = KARAN_FIRST_DEMO;
const OLD_FLAWS = demoFlaws(OLD.map(k => SUNRISE_MOMENTS[k]));
const SCALE = 22;   // px per minute (35 minutes fits in 770 px)

/** A demo as blocks on a minute timeline; each block appears at its own time in `shownAt`. */
function Timeline({ keys, y, shownAt, t, struck = [] }: { keys: readonly SunriseMoment[]; y: number; shownAt: (i: number) => number; t: number; struck?: readonly SunriseMoment[] }) {
  const starts = keys.map((_, i) => keys.slice(0, i).reduce((s, k) => s + SUNRISE_MOMENTS[k].mins, 0));
  return (
    <g transform={`translate(90 ${y})`}>
      <rect width={35 * SCALE} height={40} rx={8} fill={SC.surface} stroke={SC.line} />
      {keys.map((k, i) => {
        const m = SUNRISE_MOMENTS[k], x = starts[i] * SCALE;
        const o = p(t, shownAt(i), shownAt(i) + 0.5);
        const gone = struck.includes(k);
        return (
          <g key={k} opacity={o} transform={`translate(${x} ${(1 - o) * -16})`}>
            <rect x={2} y={3} width={m.mins * SCALE - 4} height={34} rx={6} fill={SC.soft} stroke={momentTone(m)} strokeWidth={3} />
            <text x={m.mins * SCALE / 2} y={25} textAnchor="middle" fontSize={m.mins >= 4 ? 13 : 11} fontWeight={800} fill={SC.text}>{MOMENT_SHORT[k]}</text>
            {gone && <line x1={6} x2={m.mins * SCALE - 6} y1={20} y2={20} stroke={SC.error} strokeWidth={3} />}
          </g>
        );
      })}
      <line x1={DEMO_MINUTES * SCALE} x2={DEMO_MINUTES * SCALE} y1={-12} y2={52} stroke={SC.text} strokeWidth={2} strokeDasharray="4 3" />
      <text x={DEMO_MINUTES * SCALE + 6} y={-14} fontSize={13} fontWeight={800} fill={SC.muted}>{DEMO_MINUTES} min: their questions start</text>
    </g>
  );
}

function PainNote({ pain, x, y, solved, o }: { pain: DemoPain; x: number; y: number; solved: boolean; o: number }) {
  return (
    <g transform={`translate(${x} ${y})`} opacity={o}>
      <rect width={240} height={46} rx={10} fill={SC.surface} stroke={PAIN_TONE[pain]} strokeWidth={solved ? 3 : 2} />
      <circle cx={24} cy={23} r={11} fill={solved ? SC.mint : 'none'} stroke={solved ? SC.mint : SC.line} strokeWidth={2} />
      {solved && <path d="M18 23 l4 4 l8 -8" fill="none" stroke={SC.surface} strokeWidth={3} strokeLinecap="round" />}
      <text x={46} y={29} fontSize={15} fontWeight={800} fill={SC.text}>{PAIN_NAME[pain]}</text>
    </g>
  );
}

/** Asha's WhatsApp reminder, on a small phone. */
function Phone({ x, y, o }: { x: number; y: number; o: number }) {
  return (
    <g transform={`translate(${x} ${y})`} opacity={o}>
      <rect width={190} height={250} rx={24} fill={SC.surface} stroke={SC.text} strokeWidth={3} />
      <rect x={14} y={30} width={162} height={32} rx={8} fill={SC.soft} />
      <text x={26} y={51} fontSize={12} fontWeight={800} fill={SC.text}>Sunrise Clinics</text>
      <rect x={14} y={74} width={150} height={112} rx={12} fill={SC.soft} stroke={SC.mint} strokeWidth={2} />
      {['Hi Asha, a reminder:', 'Dr. Kulkarni, Tue 10:30', 'Sunrise Koregaon Park'].map((l, i) => (
        <text key={i} x={26} y={98 + i * 20} fontSize={12} fontWeight={i ? 700 : 800} fill={SC.text}>{l}</text>
      ))}
      <rect x={26} y={150} width={126} height={26} rx={13} fill={SC.surface} stroke={SC.mint} strokeWidth={2} />
      <text x={89} y={168} textAnchor="middle" fontSize={12} fontWeight={900} fill={SC.text}>Reschedule</text>
    </g>
  );
}

export function DemoTourScene({ t }: { t: number }) {
  const intro = clamp(back(t / 0.6));
  const rebuild = t >= 11;
  const solvedBy = (pain: DemoPain) => {
    return t >= newAt(NEW.findIndex(k => (SUNRISE_MOMENTS[k] as DemoMoment).pain === pain)) + 0.6;
  };
  const shownNew = NEW.filter((k, i) => t >= newAt(i));
  const newFlaws = demoFlaws(shownNew.map(k => SUNRISE_MOMENTS[k]));
  const mins = rebuild ? demoLength(shownNew.map(k => SUNRISE_MOMENTS[k])) : demoLength(OLD.filter((k, i) => t >= i * 1.1).map(k => SUNRISE_MOMENTS[k]));
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" role="img" aria-label={`Animated story: Karan's first demo for Sunrise Clinics runs 32 minutes: Parcha's founding story, all 14 settings tabs, a booking for Test Patient 1, inventory and an AI scribe that isn't built. None of Sunrise's three problems, ${DEMO_PAINS.map(d => PAIN_NAME[d]).join(', ')}, is shown solved. Aditi rebuilds it: a two-minute recap, then WhatsApp reminders for a patient at Sunrise's own clinic, UPI billing and tablet prescriptions, in the order Sunrise ranked the problems, then a four-week pilot. It runs 17 minutes.`}>
      <rect width={W} height={H} fill={SC.soft} />
      <Grid />
      <g opacity={intro}>
        <text x={60} y={60} fontSize={22} fontWeight={900} fill={SC.text}>
          {t < 6 ? 'Everything Parcha does' : t < 11 ? 'What Sunrise asked about' : t < 16 ? 'Say it back first' : t < 21 ? 'Their clinic, their data' : t < 26 ? 'Biggest problem first' : t < 31 ? 'Cut what they didn’t ask' : 'A small next step'}
        </text>
        <text x={60} y={88} fontSize={15} fontWeight={700} fill={SC.muted}>{rebuild ? 'Aditi’s rebuild' : 'Karan’s first demo'} · {mins} min</text>

        {!rebuild && <Timeline keys={OLD} y={150} shownAt={i => i * 1.1} t={t} />}
        {rebuild && <Timeline keys={NEW} y={150} shownAt={newAt} t={t} />}
        {rebuild && t >= 26 && (
          <g opacity={p(t, 26, 26.6) * (1 - p(t, 30.4, 31))}>
            <text x={90} y={232} fontSize={14} fontWeight={800} fill={SC.muted}>Cut</text>
            <Timeline keys={['history', 'settings', 'inventory', 'scribe']} y={244} shownAt={i => 26 + i * 0.4} t={t} struck={['history', 'settings', 'inventory', 'scribe']} />
          </g>
        )}

        <text x={60} y={334} fontSize={15} fontWeight={800} fill={SC.muted} opacity={p(t, 6, 6.5)}>What Sunrise said hurts</text>
        {DEMO_PAINS.map((d, i) => (
          <PainNote key={d} pain={d} x={60} y={348 + i * 56} o={p(t, 6.2 + i * 0.3, 6.8 + i * 0.3)} solved={rebuild ? solvedBy(d) : false} />
        ))}

        {!rebuild && t >= 7.5 && (
          <g transform="translate(340 350)" opacity={p(t, 7.5, 8.1)}>
            {OLD_FLAWS.map((f, i) => (
              <g key={f} transform={`translate(0 ${i * 30})`} opacity={p(t, 7.6 + i * 0.4, 8.1 + i * 0.4)}>
                <rect width={260} height={24} rx={12} fill={SC.surface} stroke={SC.error} strokeWidth={2} />
                <text x={14} y={17} fontSize={13} fontWeight={800} fill={SC.error}>{FLAW_NAME[f]}</text>
              </g>
            ))}
            <text x={0} y={-12} fontSize={14} fontWeight={800} fill={SC.muted}>{demoGaps(OLD.map(k => SUNRISE_MOMENTS[k])).length} of 3 problems never shown solved</text>
          </g>
        )}

        {rebuild && <Phone x={720} y={256} o={p(t, 16, 16.6) * (1 - p(t, 30.6, 31))} />}

        {rebuild && t >= 31 && (
          <g transform="translate(340 360)" opacity={p(t, 31.2, 31.8)}>
            <rect width={360} height={110} rx={16} fill={SC.surface} stroke={SC.mint} strokeWidth={3} />
            <text x={22} y={38} fontSize={20} fontWeight={900} fill={SC.text}>{newFlaws.length === 0 ? `Clean demo: ${mins} minutes` : FLAW_NAME[newFlaws[0]]}</text>
            <text x={22} y={66} fontSize={15} fontWeight={700} fill={SC.muted}>Pilot at two clinics, measured on</text>
            <text x={22} y={88} fontSize={15} fontWeight={700} fill={SC.muted}>no-shows and queue time</text>
          </g>
        )}
        {rebuild && t >= 33 && (
          <g transform="translate(720 300)" opacity={p(t, 33, 33.6)}>
            <rect width={200} height={62} rx={14} fill={SC.surface} stroke={SC.design} strokeWidth={2} />
            <text x={16} y={26} fontSize={13} fontWeight={800} fill={SC.muted}>Sunrise’s medical director</text>
            <text x={16} y={48} fontSize={15} fontWeight={900} fill={SC.text}>“When can we start?”</text>
          </g>
        )}
      </g>
    </svg>
  );
}

/** When each moment of the rebuilt demo joins the timeline. */
function newAt(i: number) {
  return i === 0 ? 11.4 : i === NEW.length - 1 ? 31 : 21 + (i - 1) * 1.4;
}
