'use client';
// Scene for ia.4-2: "Skip this week" is grey footnote text on Mandi's basket screen, so people ring support. It becomes
// an outlined button (a signifier), but a tap gives two seconds of nothing, so Arjun taps three times: skip, unskip,
// skip. Then the button answers at once (pressed, "Skipping…", extra taps ignored), the four feedback zones are laid on
// a time line, and it ends on "Skipped · Undo". `WaitLine` and `FeedbackPhone` are shared with the Feedback on the
// clock game. Pure function of t (0–34).
import { FEEDBACK, WAIT_LIMITS, type Feedback } from '@shape/content';
import { back, clamp, Grid, lerp, p, SC } from './shared';

const W = 960, H = 540;

/** Position of a wait (ms) on a log time line from 10 ms to 1000 s, 0 → 1. */
export const waitX = (ms: number) => clamp((Math.log10(ms) - 1) / 5);
export const FEEDBACK_NAME: Record<Feedback, string> = { instant: 'Just change it', pressed: 'Show the press', spinner: 'Spinner with words', progress: 'Progress you can leave' };
const ZONE_TONE: Record<Feedback, string> = { instant: SC.mint, pressed: SC.discover, spinner: SC.design, progress: SC.grow };
export const fmtWait = (ms: number) => (ms < 1000 ? `${ms} ms` : ms < 60000 ? `${ms / 1000} s` : `${ms / 60000} min`);

/** A time line split at 0.1 s, 1 s and 10 s into the four feedback zones, with an optional marker. */
export function WaitLine({ x, y, w, marker, show = 1, lit }: { x: number; y: number; w: number; marker?: number; show?: number; lit?: Feedback }) {
  const edges = [10, ...WAIT_LIMITS, 1e6];
  return (
    <g transform={`translate(${x} ${y})`}>
      {FEEDBACK.map((f, k) => {
        const a = waitX(edges[k]) * w, b = waitX(edges[k + 1]) * w;
        return (
          <g key={f} opacity={clamp(show * 4 - k)}>
            <rect x={a} y={0} width={b - a - 2} height={16} rx={4} fill={ZONE_TONE[f]} opacity={!lit || lit === f ? 0.9 : 0.25} />
            <text x={(a + b) / 2} y={36} textAnchor="middle" fontSize={11} fontWeight={800} fill={SC.text}>{FEEDBACK_NAME[f]}</text>
          </g>
        );
      })}
      {WAIT_LIMITS.map(l => <text key={l} x={waitX(l) * w} y={-6} textAnchor="middle" fontSize={11} fontWeight={800} fill={SC.muted} opacity={show}>{fmtWait(l)}</text>)}
      {marker !== undefined && (
        <g transform={`translate(${waitX(marker) * w} 0)`}>
          <path d="M0 -2 L-7 -14 L7 -14 Z" fill={SC.text} />
          <line y1={0} y2={18} stroke={SC.text} strokeWidth={2.5} />
          <text y={-20} textAnchor="middle" fontSize={12} fontWeight={900} fill={SC.text}>{fmtWait(marker)}</text>
        </g>
      )}
    </g>
  );
}

/** A small phone showing one kind of feedback, `k` of the way through the wait (0 → 1). */
export function FeedbackPhone({ kind, k, label, x = 0, y = 0 }: { kind: Feedback; k: number; label: string; x?: number; y?: number }) {
  const done = k >= 1, spin = (k * 1440) % 360;
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect width={200} height={150} rx={22} fill={SC.surface} stroke={SC.line} strokeWidth={2} />
      <text x={100} y={30} textAnchor="middle" fontSize={11} fontWeight={800} fill={SC.muted}>{label.length > 34 ? `${label.slice(0, 33)}…` : label}</text>
      {kind === 'instant' && (
        <g transform="translate(40 58)">
          <rect width={28} height={28} rx={6} fill={k > 0.05 ? SC.brand : SC.surface} stroke={k > 0.05 ? SC.brand : SC.line} strokeWidth={2} />
          {k > 0.05 && <path d="M7 14 L12 19 L21 9" fill="none" stroke="#fff" strokeWidth={3} strokeLinecap="round" />}
          <text x={40} y={19} fontSize={13} fontWeight={800} fill={SC.text}>Done</text>
        </g>
      )}
      {kind === 'pressed' && (
        <g transform="translate(30 56)">
          <rect width={140} height={36} rx={10} fill={done ? SC.surface : SC.brand} stroke={SC.brand} strokeWidth={2} opacity={done ? 1 : lerp(1, 0.72, clamp(k * 6))} transform={done ? undefined : 'translate(0 1.5)'} />
          <text x={70} y={23} textAnchor="middle" fontSize={13} fontWeight={800} fill={done ? SC.text : '#fff'}>{done ? '✓ Done · Undo' : 'Working'}</text>
        </g>
      )}
      {kind === 'spinner' && (
        <g transform="translate(30 56)">
          {done
            ? <text x={70} y={22} textAnchor="middle" fontSize={14} fontWeight={800} fill={SC.mint}>✓ Done</text>
            : <g><circle cx={14} cy={17} r={10} fill="none" stroke={SC.line} strokeWidth={3} /><path d="M14 7 A10 10 0 0 1 24 17" fill="none" stroke={SC.brand} strokeWidth={3} strokeLinecap="round" transform={`rotate(${spin} 14 17)`} />
              <text x={34} y={22} fontSize={13} fontWeight={800} fill={SC.text}>Checking…</text></g>}
        </g>
      )}
      {kind === 'progress' && (
        <g transform="translate(24 54)">
          <rect width={152} height={10} rx={5} fill={SC.soft} stroke={SC.line} />
          <rect width={152 * clamp(k)} height={10} rx={5} fill={SC.brand} />
          <text y={30} fontSize={11.5} fontWeight={800} fill={SC.text}>{done ? '✓ All done' : `${Math.round(clamp(k) * 100)}% · about ${Math.max(1, Math.round((1 - k) * 4))} min left`}</text>
          <text y={48} fontSize={10.5} fontWeight={700} fill={SC.muted}>Carry on, we’ll tell you</text>
        </g>
      )}
    </g>
  );
}

const Thumb = ({ x, y, o }: { x: number; y: number; o: number }) => (
  <g opacity={o}><ellipse cx={x} cy={y} rx={22} ry={26} fill="#f5c9a8" stroke="#c2410c" strokeOpacity={0.4} strokeWidth={2} opacity={0.85} /><ellipse cx={x} cy={y - 8} rx={12} ry={10} fill="#fde2cf" opacity={0.8} /></g>
);

const PX = 110, PY = 50;
const ITEMS = [['Tomatoes', '1 kg'], ['Spinach', '2 bunches'], ['Okra', '500 g'], ['Alphonso mangoes', '6']];
const TAPS = [11.6, 12.6, 13.6];

export function PressFeedbackScene({ t }: { t: number }) {
  const button = p(t, 6, 7), fixedRun = t >= 19;
  const tapK = (a: number) => clamp(1 - Math.abs(t - a) / 0.25);
  const lastTap = fixedRun ? 19.6 : TAPS.find(a => t >= a - 0.25 && t < a + 0.25);
  const pressed = fixedRun && t >= 19.6 && t < 22.4, skipping = fixedRun && t >= 19.7 && t < 22.4;
  const skipped = t >= 22.4;
  const log = [{ at: 15.2, say: 'skip', on: false }, { at: 16.2, say: 'unskip', on: true }, { at: 17.2, say: 'skip', on: false }];
  const zones = p(t, 24, 25.4) * (1 - p(t, 28.6, 29.2));
  const by = PY + 300;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" role="img" aria-label="Animated story: a hidden skip link becomes a button, a tap with no feedback is repeated three times, then the button answers at once and offers Undo">
      <rect width={W} height={H} fill={SC.soft} />
      <Grid />
      <g opacity={clamp(back(t / 0.6))}>
        <rect x={PX} y={PY} width={260} height={440} rx={30} fill={SC.surface} stroke={SC.line} strokeWidth={2} />
        <text x={PX + 20} y={PY + 40} fontSize={17} fontWeight={900} fill={SC.text}>Saturday’s box</text>
        <text x={PX + 20} y={PY + 60} fontSize={12} fontWeight={700} fill={SC.muted}>Sat 14 Dec · ₹640</text>
        {ITEMS.map(([n, q], k) => (
          <g key={n} transform={`translate(${PX + 20} ${PY + 80 + k * 46})`}>
            <rect width={36} height={36} rx={8} fill={SC.soft} stroke={SC.line} />
            <text x={48} y={16} fontSize={13} fontWeight={800} fill={SC.text}>{n}</text>
            <text x={48} y={31} fontSize={11.5} fontWeight={600} fill={SC.muted}>{q}</text>
          </g>
        ))}
        {/* the skip control: footnote text, then a button */}
        <g opacity={1 - button}><text x={PX + 20} y={by + 18} fontSize={10.5} fontWeight={500} fill={SC.muted}>Delivery Saturdays 7–10 am. Skip this week. T&amp;C apply.</text></g>
        <g opacity={button}>
          <rect x={PX + 20} y={by} width={220} height={42} rx={10} fill={pressed ? SC.brand : SC.surface} stroke={skipped ? SC.mint : SC.brand} strokeWidth={2} transform={pressed ? 'translate(0 1.5)' : undefined} />
          <text x={PX + 130} y={by + 27} textAnchor="middle" fontSize={14} fontWeight={800} fill={pressed ? '#fff' : SC.text}>{skipping ? 'Skipping…' : skipped ? '✓ Skipped this week' : 'Skip this week'}</text>
        </g>
        {lastTap !== undefined && <Thumb x={PX + 160} y={by + 30} o={fixedRun ? clamp(1 - Math.abs(t - 19.6) / 0.4) : tapK(lastTap)} />}
        {fixedRun && [20.2, 20.8].map(a => t >= a && t < 22.4 && <text key={a} x={PX + 250} y={by + 10 + (a - 20.2) * 30} fontSize={11} fontWeight={800} fill={SC.muted}>tap ignored</text>)}
        {/* undo toast */}
        {t >= 29 && (
          <g opacity={p(t, 29, 29.5)} transform={`translate(${PX + 16} ${lerp(PY + 440, PY + 380, back(p(t, 29, 29.6)))})`}>
            <rect width={228} height={44} rx={12} fill={SC.text} />
            <text x={16} y={27} fontSize={13} fontWeight={800} fill={SC.surface}>Skipped Sat 14 Dec</text>
            <text x={186} y={27} fontSize={13} fontWeight={900} fill={SC.mint}>Undo</text>
          </g>
        )}
      </g>

      {/* support calls */}
      {t < 6 && (
        <g transform="translate(470 120)" opacity={p(t, 1.4, 2) * (1 - p(t, 5.4, 6))}>
          <rect width={400} height={120} rx={18} fill={SC.surface} stroke={SC.error} strokeWidth={2} />
          <text x={24} y={40} fontSize={14} fontWeight={800} fill={SC.muted}>Mandi support, this week</text>
          <text x={24} y={80} fontSize={30} fontWeight={900} fill={SC.text}>{Math.round(lerp(0, 23, p(t, 2, 4.4)))} calls</text>
          <text x={24} y={104} fontSize={14} fontWeight={700} fill={SC.muted}>“How do I skip a week?”</text>
        </g>
      )}
      {t >= 6 && t < 11 && (
        <g transform="translate(470 140)" opacity={p(t, 7, 7.6) * (1 - p(t, 10.4, 11))}>
          <text fontSize={20} fontWeight={900} fill={SC.text}>A shape that says “press me”</text>
          <text y={30} fontSize={15} fontWeight={700} fill={SC.muted}>A filled or outlined box, with a verb on it.</text>
        </g>
      )}
      {/* the repeated taps hit the server */}
      {t >= 11 && t < 19 && (
        <g transform="translate(470 80)" opacity={p(t, 11, 11.5) * (1 - p(t, 18.4, 19))}>
          <text fontSize={14} fontWeight={800} fill={SC.muted}>{t < 14.4 ? `Waiting… ${Math.min(2, (t - 11.6)).toFixed(1)} s, nothing on screen` : 'What the server got'}</text>
          {log.map((l, k) => t >= l.at && (
            <g key={k} transform={`translate(0 ${30 + k * 56})`} opacity={p(t, l.at, l.at + 0.4)}>
              <rect width={400} height={44} rx={12} fill={SC.surface} stroke={SC.line} strokeWidth={1.5} />
              <text x={18} y={28} fontSize={15} fontWeight={800} fill={SC.text}>Tap {k + 1} → {l.say}</text>
              <rect x={268} y={10} width={116} height={24} rx={12} fill={l.on ? SC.mint : SC.error} />
              <text x={326} y={27} textAnchor="middle" fontSize={12} fontWeight={800} fill={l.on ? SC.text : '#fff'}>{l.on ? 'Box ON' : 'Box OFF'}</text>
            </g>
          ))}
          {t >= 17.8 && <text y={220} fontSize={15} fontWeight={800} fill={SC.error} opacity={p(t, 17.8, 18.2)}>Arjun isn’t sure which one stuck.</text>}
        </g>
      )}
      {t >= 19 && t < 24 && (
        <g transform="translate(470 120)" opacity={p(t, 19.4, 19.9) * (1 - p(t, 23.4, 24))}>
          {['Darkens the moment it’s touched', 'Says what it’s doing: “Skipping…”', 'Ignores more taps until it’s done'].map((s, k) => (
            <text key={s} y={k * 34} fontSize={16} fontWeight={800} fill={SC.text} opacity={p(t, 19.8 + k * 0.7, 20.3 + k * 0.7)}><tspan fill={SC.mint}>✓ </tspan>{s}</text>
          ))}
        </g>
      )}
      {zones > 0 && (
        <g opacity={zones}>
          <text x={440} y={150} fontSize={20} fontWeight={900} fill={SC.text}>Match the feedback to the wait</text>
          <WaitLine x={440} y={210} w={480} show={p(t, 24.4, 26.4)} marker={t >= 26.8 ? 700 : undefined} lit={t >= 26.8 ? 'pressed' : undefined} />
          {t >= 26.8 && <text x={440} y={300} fontSize={15} fontWeight={700} fill={SC.muted} opacity={p(t, 26.8, 27.3)}>Skipping takes 0.7 s: show the press, no spinner.</text>}
        </g>
      )}
      {t >= 29 && (
        <g transform="translate(470 150)" opacity={p(t, 29.6, 30.2)}>
          <text fontSize={20} fontWeight={900} fill={SC.text}>Show what it does.</text>
          <text y={34} fontSize={20} fontWeight={900} fill={SC.text}>Then show that it did.</text>
          <text y={70} fontSize={15} fontWeight={700} fill={SC.muted}>And let people take back what’s easy to regret.</text>
        </g>
      )}
    </svg>
  );
}
