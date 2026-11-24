'use client';
// Scene for ax.2-4: Sunita Kulkarni, 67, books a ₹640 seat from Pune to Kolhapur. Since a stroke she reads slowly and
// loses numbers she saw a moment ago. Rahi stacks barriers on her (`RAHI_BARRIERS`, each with its `load`): a seat hold
// that ends without warning, an OTP box that blocks paste, details asked twice, fare names to decode and an error
// code. Her load meter fills, then Meera lifts each one: a warning with Add 5 minutes, the code filled from the SMS,
// details carried forward, plain fares, Step 2 of 4, help in one place and a review before paying. `LoadMeter` is
// shared with the Lighten Sunita's load game. Pure function of t (0–36).
import { RAHI_BARRIERS, wrapText, type RahiBarrier } from '@shape/content';
import { back, clamp, Grid, lerp, p, SC } from './shared';
import { INK, INK_MUTED } from './EaseCurves';
import { RAHI, RAHI_SOFT } from './KeyboardFlow';

const W = 960, H = 540;
const ERR = '#D92D20';
/** Short names for the meter's blocks. */
export const BARRIER_SHORT: Record<RahiBarrier, string> = {
  hold: 'Seat hold ends', idle: 'Signed out', otp: 'Copy the OTP', retype: 'Type it again', captcha: 'Password + puzzle',
  jargon: 'Flexi+?', code: 'Error 4012', steps: 'How many left?', help: 'Where’s help?', jump: 'Jumped ahead', final: 'Charged, no review',
};
/** A block colour per load: heavier is darker. White on each passes 4.5:1. */
export const LOAD_FILL = { 1: '#B54708', 2: '#B42318', 3: '#7A271A' } as const;

/** Sunita's load meter: a column of blocks, one per barrier, each as tall as its load. `out` (0–1 per barrier) lifts
 *  a block away. */
export function LoadMeter({ x, y, blocks, out = {}, height = 300, total = 22 }: { x: number; y: number; blocks: RahiBarrier[]; out?: Partial<Record<RahiBarrier, number>>; height?: number; total?: number }) {
  const unit = height / total;
  const share = blocks.map(b => RAHI_BARRIERS[b].load * (1 - (out[b] ?? 0)));
  const left = share.reduce((s, v) => s + v, 0);
  /** Each block's top: the meter's height minus everything still stacked under and including it. */
  const tops = share.map((_, i) => height - share.slice(0, i + 1).reduce((s, v) => s + v, 0) * unit);
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x={-6} y={-6} width={172} height={height + 12} rx={14} fill={SC.surface} stroke={SC.line} strokeWidth={2} />
      {blocks.map((b, i) => {
        const k = out[b] ?? 0, h = RAHI_BARRIERS[b].load * unit, at = tops[i];
        return (
          <g key={b} transform={`translate(0 ${at - k * 40})`} opacity={1 - k}>
            <rect width={160} height={h - 3} rx={7} fill={LOAD_FILL[RAHI_BARRIERS[b].load]} />
            <text x={10} y={Math.min(h - 3, 26) / 2 + 5} fontSize={12} fontWeight={800} fill="#FFFFFF">{BARRIER_SHORT[b]}</text>
          </g>
        );
      })}
      <text x={0} y={height + 30} fontSize={14} fontWeight={900} fill={SC.text}>Sunita’s load: {Math.round(left)}</text>
    </g>
  );
}

function Screen({ x, y, step, help = false, children }: { x: number; y: number; step?: string; help?: boolean; children: React.ReactNode }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect width={400} height={440} rx={18} fill="#FFFFFF" stroke={INK} strokeOpacity={0.15} strokeWidth={2} />
      <rect width={400} height={40} rx={18} fill={RAHI} /><rect y={22} width={400} height={18} fill={RAHI} />
      <text x={16} y={27} fontSize={15} fontWeight={900} fill="#FFFFFF">Rahi · Pune → Kolhapur</text>
      {help && <text x={386} y={27} textAnchor="end" fontSize={10.5} fontWeight={800} fill="#FFFFFF">Call us: 020 4800 1234</text>}
      {step && <text x={16} y={62} fontSize={11} fontWeight={800} fill={RAHI}>{step}</text>}
      {children}
    </g>
  );
}

function Lines({ x, y, text, size = 13, per = 46, fill = INK, weight = 700 }: { x: number; y: number; text: string; size?: number; per?: number; fill?: string; weight?: number }) {
  return (
    <text x={x} y={y} fontSize={size} fontWeight={weight} fill={fill}>
      {wrapText(text, per).map((ln, i) => <tspan key={i} x={x} dy={i ? size * 1.5 : 0}>{ln}</tspan>)}
    </text>
  );
}

function Btn({ x, y, w, label, primary = true }: { x: number; y: number; w: number; label: string; primary?: boolean }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect width={w} height={40} rx={10} fill={primary ? RAHI : '#FFFFFF'} stroke={RAHI} strokeWidth={2} />
      <text x={w / 2} y={25} textAnchor="middle" fontSize={13} fontWeight={900} fill={primary ? '#FFFFFF' : RAHI}>{label}</text>
    </g>
  );
}

function Panel({ title, lines, t0, t }: { title: string; lines: string[]; t0: number; t: number }) {
  return (
    <g opacity={p(t, t0, t0 + 0.5)}>
      <text x={0} y={0} fontSize={26} fontWeight={900} fill={SC.text}>{title}</text>
      <text x={0} y={34} fontSize={14.5} fontWeight={800} fill={SC.muted}>
        {lines.map((l, i) => <tspan key={i} x={0} dy={i ? 22 : 0}>{l}</tspan>)}
      </text>
    </g>
  );
}

const mmss = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
const ADDED: [RahiBarrier, number][] = [['hold', 4.6], ['otp', 8], ['retype', 10.4], ['jargon', 13.4], ['code', 15.8]];
const LIFTED: [RahiBarrier, number][] = [['hold', 19.4], ['otp', 21], ['retype', 22.6], ['jargon', 25], ['code', 27]];

export function CognitiveA11yScene({ t }: { t: number }) {
  const intro = clamp(back(t / 0.6));
  const fin = p(t, 33, 33.6);
  const PX = 50, PY = 60;
  const blocks = ADDED.filter(([, at]) => t >= at).map(([b]) => b);
  const out = Object.fromEntries(LIFTED.map(([b, at]) => [b, p(t, at, at + 0.7)])) as Partial<Record<RahiBarrier, number>>;
  let screen: React.ReactNode = null, side: React.ReactNode = null;

  if (t < 6) {
    const left = Math.max(0, 300 - (t - 0.5) * 75);
    screen = (
      <Screen x={PX} y={PY}>
        <Lines x={20} y={74} size={16} weight={900} text="Seat 12, window · ₹640" />
        <rect x={20} y={92} width={360} height={44} rx={10} fill={left > 0 ? RAHI_SOFT : '#FEF3F2'} />
        <text x={36} y={120} fontSize={15} fontWeight={900} fill={left > 0 ? RAHI : ERR}>{left > 0 ? `Seat held · ${mmss(left)}` : 'Seat 12 was released'}</text>
        <Lines x={20} y={168} size={12} fill={INK_MUTED} text="Fare rules: Cancellation 24 hours or more before departure refunds 50% of the base fare. Within 24 hours, no refund. Operator terms apply. GST is not refunded…" />
      </Screen>
    );
    side = <Panel t={t} t0={0.2} title="Five minutes" lines={['Sunita reads slowly since her stroke. She reads', 'the fare rules carefully, and Rahi releases her', 'seat at 0:00 without a word.']} />;
  } else if (t < 12) {
    const pay = t > 10;
    screen = (
      <Screen x={PX} y={PY}>
        {!pay ? (
          <g>
            <rect x={20} y={56} width={360} height={52} rx={12} fill="#F2F4F7" />
            <text x={34} y={78} fontSize={11} fontWeight={800} fill={INK_MUTED}>Messages · now</text>
            <text x={34} y={98} fontSize={13} fontWeight={800} fill={INK}>482915 is your Rahi OTP</text>
            <Lines x={20} y={140} size={14} weight={900} text="Enter the 6-digit code" />
            {[0, 1, 2, 3, 4, 5].map(i => <rect key={i} x={20 + i * 58} y={156} width={48} height={52} rx={9} fill="#FFFFFF" stroke={INK} strokeOpacity={0.3} strokeWidth={1.5} />)}
            {'48'.split('').map((d, i) => <text key={i} x={44 + i * 58} y={190} textAnchor="middle" fontSize={22} fontWeight={900} fill={INK}>{t > 8.4 + i * 0.4 ? d : ''}</text>)}
            <g opacity={p(t, 7, 7.4)}><rect x={20} y={230} width={240} height={34} rx={8} fill={INK} /><text x={34} y={252} fontSize={12} fontWeight={800} fill="#FFFFFF">Paste isn’t allowed here</text></g>
          </g>
        ) : (
          <g>
            <Lines x={20} y={74} size={15} weight={900} text="Payment" />
            {['Full name', 'Mobile number'].map((l, i) => (
              <g key={l}>
                <text x={20} y={108 + i * 64} fontSize={11} fontWeight={800} fill={INK_MUTED}>{l}</text>
                <rect x={20} y={116 + i * 64} width={360} height={32} rx={8} fill="#FFFFFF" stroke={INK} strokeOpacity={0.3} strokeWidth={1.5} />
              </g>
            ))}
            <text x={20} y={250} fontSize={12} fontWeight={800} fill={ERR} opacity={p(t, 10.6, 11)}>She typed these two screens ago.</text>
          </g>
        )}
      </Screen>
    );
    side = <Panel t={t} t0={6} title="Remember this" lines={['The OTP box blocks paste, so she holds six digits', 'in her head between two apps. Then payment', 'asks for her name and number again.']} />;
  } else if (t < 18) {
    const err = t > 15.4;
    screen = (
      <Screen x={PX} y={PY}>
        {!err ? (
          <g>
            <Lines x={20} y={74} size={15} weight={900} text="Choose a fare" />
            {['Saver', 'Flexi', 'Flexi+'].map((l, i) => (
              <g key={l}>
                <rect x={20} y={92 + i * 58} width={360} height={48} rx={10} fill="#FFFFFF" stroke={INK} strokeOpacity={0.25} strokeWidth={1.5} />
                <text x={36} y={121 + i * 58} fontSize={15} fontWeight={900} fill={INK}>{l}</text>
                <text x={364} y={121 + i * 58} textAnchor="end" fontSize={13} fontWeight={800} fill={INK_MUTED}>{['₹640', '₹700', '₹745'][i]}</text>
              </g>
            ))}
            <text x={20} y={282} fontSize={11} fontWeight={700} fill={INK_MUTED}>T&C apply</text>
          </g>
        ) : (
          <g>
            <rect x={20} y={70} width={360} height={80} rx={12} fill="#FEF3F2" stroke={ERR} strokeWidth={1.5} />
            <text x={36} y={102} fontSize={16} fontWeight={900} fill={ERR}>Error 4012</text>
            <text x={36} y={128} fontSize={13} fontWeight={800} fill={INK}>Session invalid.</text>
          </g>
        )}
      </Screen>
    );
    side = <Panel t={t} t0={12} title="What’s Flexi+?" lines={['Three fare names to decode, then an error code', 'meant for developers. Each one is a puzzle', 'on top of the task.']} />;
  } else if (t < 24) {
    const k = t < 20.4 ? 0 : t < 22 ? 1 : 2;
    screen = (
      <Screen x={PX} y={PY}>
        {k === 0 && (
          <g>
            <Lines x={20} y={74} size={16} weight={900} text="Seat 12, window · ₹640" />
            <rect x={20} y={100} width={360} height={150} rx={14} fill="#FFFFFF" stroke={RAHI} strokeWidth={2} />
            <Lines x={36} y={132} size={14} weight={900} per={40} text="Your seat is held for 1 more minute." />
            <Lines x={36} y={160} size={12} fill={INK_MUTED} per={44} text="Need more time to read? You can add time as often as you need." />
            <Btn x={36} y={196} w={170} label="Add 5 minutes" />
          </g>
        )}
        {k === 1 && (
          <g>
            <Lines x={20} y={74} size={14} weight={900} text="Enter the 6-digit code" />
            {'482915'.split('').map((d, i) => (
              <g key={i}><rect x={20 + i * 58} y={90} width={48} height={52} rx={9} fill={RAHI_SOFT} stroke={RAHI} strokeWidth={1.5} /><text x={44 + i * 58} y={124} textAnchor="middle" fontSize={22} fontWeight={900} fill={INK}>{d}</text></g>
            ))}
            <text x={20} y={170} fontSize={12} fontWeight={800} fill={RAHI}>Filled in from Messages · paste works too</text>
          </g>
        )}
        {k === 2 && (
          <g>
            <Lines x={20} y={74} size={15} weight={900} text="Payment" />
            {[['Full name', 'Sunita Kulkarni'], ['Mobile number', '94220 51873']].map(([l, v], i) => (
              <g key={l}>
                <text x={20} y={108 + i * 64} fontSize={11} fontWeight={800} fill={INK_MUTED}>{l}</text>
                <text x={20} y={132 + i * 64} fontSize={14} fontWeight={800} fill={INK}>{v}</text>
                <text x={380} y={132 + i * 64} textAnchor="end" fontSize={12} fontWeight={800} fill={RAHI} textDecoration="underline">Change</text>
              </g>
            ))}
          </g>
        )}
      </Screen>
    );
    side = <Panel t={t} t0={18} title="Time, and nothing to remember" lines={['A warning a minute before, and one tap for more', 'time (2.2.1). The code fills itself in (3.3.8).', 'Her details carry forward (3.3.7).']} />;
  } else if (t < 30) {
    screen = (
      <Screen x={PX} y={PY} step={t > 26.4 ? 'Step 2 of 4 · Fare' : undefined} help={t > 28}>
        <Lines x={20} y={92} size={15} weight={900} text="Can you cancel?" />
        {[['Standard fare', '₹640', 'If you cancel, you get ₹320 back.'], ['With free cancellation', '₹700', 'Full refund until 24 hours before you travel.']].map(([h, price, b], i) => (
          <g key={h} opacity={p(t, 24.6 + i * 0.3, 25 + i * 0.3)}>
            <rect x={20} y={108 + i * 92} width={360} height={80} rx={12} fill="#FFFFFF" stroke={i === 0 ? RAHI : INK} strokeOpacity={i === 0 ? 1 : 0.25} strokeWidth={i === 0 ? 2 : 1.5} />
            <text x={36} y={136 + i * 92} fontSize={14} fontWeight={900} fill={INK}>{h}</text>
            <text x={364} y={136 + i * 92} textAnchor="end" fontSize={14} fontWeight={900} fill={INK}>{price}</text>
            <Lines x={36} y={160 + i * 92} size={12} fill={INK_MUTED} per={46} text={b} />
          </g>
        ))}
        <text x={20} y={318} fontSize={12} fontWeight={800} fill={INK_MUTED} opacity={p(t, 27, 27.5)}>Something went wrong? “This page was open a long time,</text>
        <text x={20} y={336} fontSize={12} fontWeight={800} fill={INK_MUTED} opacity={p(t, 27, 27.5)}>so we refreshed it. Your seat and details are still here.”</text>
      </Screen>
    );
    side = <Panel t={t} t0={24} title="Plain words, clear steps" lines={['Say what a fare does and costs, not its name.', 'Show where she is: Step 2 of 4. Keep help in', 'the same corner of every screen (3.2.6).']} />;
  } else {
    screen = (
      <Screen x={PX} y={PY} step="Step 4 of 4 · Review" help>
        <Lines x={20} y={96} size={16} weight={900} text="Check your booking" />
        {[['Route', 'Pune → Kolhapur'], ['When', 'Sat 14 Dec, 7:15 am'], ['Seat', '12, window'], ['Boarding', 'Swargate'], ['Total', '₹640']].map(([k, v], i) => (
          <g key={k}>
            <text x={20} y={132 + i * 30} fontSize={12} fontWeight={800} fill={INK_MUTED}>{k}</text>
            <text x={130} y={132 + i * 30} fontSize={13} fontWeight={900} fill={INK}>{v}</text>
          </g>
        ))}
        <Btn x={20} y={300} w={230} label="Pay ₹640" />
        <Btn x={262} y={300} w={118} label="Change" primary={false} />
      </Screen>
    );
    side = <Panel t={t} t0={30} title="No surprises" lines={['Picking a boarding point stays on the page until', 'she presses Continue (3.2.2). Nothing is charged', 'before she reviews it (3.3.4).']} />;
  }

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" role="img" aria-label="Animated story: Sunita, 67, books a bus after a stroke that affects her reading and memory. Barriers stack up on her load meter: a seat hold that ends without warning, an OTP box that blocks paste, details asked twice, fare names to decode and an error code. Then each is lifted: a warning with more time, the code filled in, details carried forward, plain fares, step numbers, help in one place, and a review before paying">
      <rect width={W} height={H} fill={SC.soft} />
      <Grid />
      <g opacity={intro * (1 - fin)} transform={`translate(0 ${lerp(10, 0, intro)})`}>
        {screen}
        <g transform="translate(500 110)">{side}</g>
        <LoadMeter x={760} y={222} blocks={blocks} out={out} height={220} total={11} />
      </g>
      {t >= 33 && (
        <g opacity={fin}>
          <text x={W / 2} y={100} textAnchor="middle" fontSize={26} fontWeight={900} fill={SC.text}>Lighter for everyone</text>
          {[['Enough time', 'Warn, and let her extend'], ['Nothing to remember', 'Carry it forward, allow paste'], ['Plain and in steps', 'Say what it does; Step 2 of 4'], ['No surprises', 'Help stays put; review before paying']].map(([h, b], i) => (
            <g key={h} transform={`translate(${60 + i * 215} 160)`} opacity={p(t, 33.2 + i * 0.3, 33.7 + i * 0.3)}>
              <rect width={196} height={150} rx={18} fill={SC.surface} stroke={RAHI} strokeWidth={2} />
              <text x={18} y={42} fontSize={16} fontWeight={900} fill={SC.text}>{h}</text>
              <text x={18} y={76} fontSize={13} fontWeight={700} fill={SC.muted}>{wrapText(b, 22).map((ln, j) => <tspan key={j} x={18} dy={j ? 20 : 0}>{ln}</tspan>)}</text>
            </g>
          ))}
          <text x={W / 2} y={370} textAnchor="middle" fontSize={15} fontWeight={800} fill={SC.muted} opacity={p(t, 34.5, 35)}>Sunita books in one go. So does the tired commuter, and the student reading in his third language.</text>
        </g>
      )}
    </svg>
  );
}
