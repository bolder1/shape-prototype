'use client';
// Scene for pr.2-2: Dabba's week screen opens with the header, five meal cards and the Pay button all arriving together,
// each for 600 ms. A timing chart beside the phone shows every bar the same. Then durations by size (a press, a sheet,
// a whole page, each played at its real length), the sheet leaving faster than it came, the screen choreographed (header
// first, cards 40 ms apart, button last), a 20-card stagger capped with `staggerStep`, and before against after.
// `BandRuler` and `TimingPreview` are shared with the Tune the timing game. Phone replays run at a third of real speed,
// and say so. Pure function of t (0–34).
import { bezierAt, DURATION_BANDS, EASE_CURVES, staggerEnd, staggerStep, type DurationBand, type DurationKind } from '@shape/content';
import { back, clamp, Grid, lerp, p, SC } from './shared';
import { DABBA, DABBA_SOFT, INK, INK_MUTED } from './EaseCurves';

const W = 960, H = 540;
const out = (k: number) => bezierAt(EASE_CURVES.out, k);
const inn = (k: number) => bezierAt(EASE_CURVES.in, k);
export const BAND_NAME: Record<DurationBand, string> = { instant: 'Instant', quick: 'Quick', standard: 'Standard', long: 'Long' };
const BAND_TONE: Record<DurationBand, string> = { instant: SC.mint, quick: SC.discover, standard: SC.design, long: SC.grow };
export const RULER_MAX = 1200;

/** A 0–1200 ms ruler split into the duration bands, past 600 ms marked "waiting". Optional marker and lit band. */
export function BandRuler({ x, y, w, marker, lit, show = 1 }: { x: number; y: number; w: number; marker?: number; lit?: DurationBand; show?: number }) {
  const sx = (ms: number) => (clamp(ms / RULER_MAX)) * w;
  return (
    <g transform={`translate(${x} ${y})`}>
      {DURATION_BANDS.map((b, i) => (
        <g key={b.id} opacity={clamp(show * 5 - i)}>
          <rect x={sx(b.min)} y={0} width={sx(b.max) - sx(b.min) - 2} height={16} rx={4} fill={BAND_TONE[b.id]} opacity={!lit || lit === b.id ? 0.9 : 0.25} />
          <text x={(sx(b.min) + sx(b.max)) / 2} y={36} textAnchor="middle" fontSize={11} fontWeight={800} fill={SC.text}>{BAND_NAME[b.id]}</text>
        </g>
      ))}
      <g opacity={clamp(show * 5 - 4)}>
        <rect x={sx(601)} y={0} width={w - sx(601)} height={16} rx={4} fill={SC.line} />
        <text x={(sx(600) + w) / 2} y={36} textAnchor="middle" fontSize={11} fontWeight={800} fill={SC.muted}>People wait</text>
      </g>
      {[0, 100, 200, 400, 600, 1200].map(ms => <text key={ms} x={sx(ms)} y={-6} textAnchor="middle" fontSize={10.5} fontWeight={800} fill={SC.muted} opacity={show}>{ms}</text>)}
      {marker !== undefined && (
        <g transform={`translate(${sx(marker)} 0)`}>
          <path d="M0 -2 L-7 -14 L7 -14 Z" fill={SC.text} />
          <line y1={0} y2={18} stroke={SC.text} strokeWidth={2.5} />
        </g>
      )}
    </g>
  );
}

/** One transition drawn in a 200 × 150 box, `k` (0 → 1) of the way through. */
export function TimingPreview({ kind, k, x = 0, y = 0 }: { kind: DurationKind; k: number; x?: number; y?: number }) {
  const e = out(clamp(k));
  return (
    <g transform={`translate(${x} ${y})`}>
      <clipPath id={`tp-${kind}`}><rect width={200} height={150} rx={18} /></clipPath>
      <rect width={200} height={150} rx={18} fill="#FFFFFF" stroke="#D0D5DD" strokeWidth={1.5} />
      <g clipPath={`url(#tp-${kind})`}>
        {kind === 'press' && (
          <g transform="translate(40 56)">
            <rect width={120} height={40} rx={12} fill={k > 0 && k < 1 ? '#8A3209' : DABBA} />
            <text x={60} y={25} textAnchor="middle" fontSize={13} fontWeight={800} fill="#FFFFFF">Add</text>
            <text x={60} y={66} textAnchor="middle" fontSize={10.5} fontWeight={700} fill={INK_MUTED}>{k > 0 && k < 1 ? 'pressed' : 'tap'}</text>
          </g>
        )}
        {kind === 'check' && (
          <g transform="translate(78 52)">
            <rect width={44} height={44} rx={12} fill={e > 0.02 ? DABBA : '#FFFFFF'} stroke={DABBA} strokeWidth={2} />
            <path d="M11 23 L19 31 L34 15" fill="none" stroke="#FFFFFF" strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - e} />
          </g>
        )}
        {kind === 'tooltip' && (
          <g>
            <rect x={56} y={92} width={88} height={30} rx={15} fill={DABBA_SOFT} stroke={DABBA} />
            <text x={100} y={112} textAnchor="middle" fontSize={11.5} fontWeight={800} fill={INK}>Rajma</text>
            <g transform={`translate(100 80) scale(${lerp(0.85, 1, e)})`} opacity={e}>
              <rect x={-64} y={-38} width={128} height={30} rx={8} fill={INK} />
              <path d="M-6 -8 L0 -2 L6 -8 Z" fill={INK} />
              <text y={-18} textAnchor="middle" fontSize={11} fontWeight={700} fill="#FFFFFF">Veg · 520 kcal</text>
            </g>
          </g>
        )}
        {kind === 'toast' && (
          <g transform={`translate(20 ${lerp(108, 100, e)})`} opacity={e}>
            <rect width={160} height={32} rx={10} fill={INK} />
            <text x={14} y={21} fontSize={11.5} fontWeight={700} fill="#FFFFFF">Added to Tuesday</text>
            <text x={146} y={21} textAnchor="end" fontSize={11.5} fontWeight={800} fill="#FDB022">Undo</text>
          </g>
        )}
        {(kind === 'sheet' || kind === 'sheet-out') && (
          <g transform={`translate(10 ${lerp(150, 40, kind === 'sheet' ? e : 1 - inn(clamp(k)))})`}>
            <rect width={180} height={130} rx={16} fill="#FFFFFF" stroke="#D0D5DD" strokeWidth={1.5} />
            <rect x={70} y={8} width={40} height={4} rx={2} fill="#D0D5DD" />
            <rect x={14} y={20} width={152} height={46} rx={10} fill={DABBA_SOFT} />
            <text x={14} y={86} fontSize={12.5} fontWeight={900} fill={INK}>Rajma chawal</text>
            <rect x={14} y={96} width={152} height={24} rx={8} fill={DABBA} />
          </g>
        )}
        {kind === 'page' && (
          <g>
            <text x={16} y={30} fontSize={12} fontWeight={900} fill={INK}>Menu</text>
            {[0, 1, 2].map(i => <rect key={i} x={16} y={44 + i * 32} width={168} height={24} rx={6} fill="#F2F4F7" />)}
            <g transform={`translate(${lerp(200, 0, bezierAt(EASE_CURVES.inout, clamp(k)))} 0)`}>
              <rect width={200} height={150} fill={DABBA_SOFT} />
              <text x={16} y={30} fontSize={12} fontWeight={900} fill={INK}>Plans</text>
              {['5 days · ₹495', '20 days · ₹1,880'].map((l, i) => <g key={l}><rect x={16} y={46 + i * 44} width={168} height={34} rx={8} fill="#FFFFFF" stroke={DABBA} strokeWidth={1} /><text x={28} y={68 + i * 44} fontSize={11.5} fontWeight={800} fill={INK}>{l}</text></g>)}
            </g>
          </g>
        )}
        {kind === 'menu' && (
          <g>
            {[0, 1, 2, 3, 4].map(i => {
              const ki = out(clamp((k - i * 0.12) / 0.52));
              return <rect key={i} x={16} y={14 + i * 25 + (1 - ki) * 10} width={168} height={20} rx={6} fill={i % 2 ? '#F2F4F7' : DABBA_SOFT} opacity={ki} />;
            })}
          </g>
        )}
      </g>
    </g>
  );
}

type Bar = { label: string; start: number; dur: number };
/** A timing chart: one bar per element, ms along the bottom, and a playhead. */
function Gantt({ x, y, w, rows, max, head, title, rowH = 26 }: { x: number; y: number; w: number; rows: Bar[]; max: number; head?: number; title: string; rowH?: number }) {
  const sx = (ms: number) => (ms / max) * (w - 110);
  const h = rows.length * rowH;
  return (
    <g transform={`translate(${x} ${y})`}>
      <text x={0} y={0} fontSize={13} fontWeight={900} fill={SC.text}>{title}</text>
      <g transform="translate(0 16)">
        {rows.map((r, i) => (
          <g key={`${r.label}${i}`} transform={`translate(0 ${i * rowH})`}>
            {rowH > 12 && <text x={100} y={rowH * 0.62} textAnchor="end" fontSize={11.5} fontWeight={700} fill={SC.muted}>{r.label}</text>}
            <rect x={110 + sx(r.start)} y={2} width={Math.max(2, sx(r.dur))} height={rowH - 6} rx={Math.min(5, rowH / 3)} fill={DABBA} opacity={0.85} />
          </g>
        ))}
        <line x1={110} x2={w} y1={h + 4} y2={h + 4} stroke={SC.line} strokeWidth={1.5} />
        {Array.from({ length: Math.floor(max / 200) + 1 }, (_, k) => k * 200).map(ms => <text key={ms} x={110 + sx(ms)} y={h + 20} textAnchor="middle" fontSize={10.5} fontWeight={700} fill={SC.muted}>{ms} ms</text>)}
        {head !== undefined && <line x1={110 + sx(head)} x2={110 + sx(head)} y1={-4} y2={h + 6} stroke={SC.text} strokeWidth={2} />}
      </g>
    </g>
  );
}

const PARTS = ['Header', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Pay'];
const SLOW = 3;
const BEFORE: Bar[] = PARTS.map(label => ({ label, start: 0, dur: 600 }));
const AFTER: Bar[] = PARTS.map((label, i) => (i === 0 ? { label, start: 0, dur: 220 } : i < 6 ? { label, start: 40 * i, dur: 180 } : { label, start: 260, dur: 120 }));

/** The week screen arriving by a timing chart, `ms` into it. */
function WeekArriving({ x, y, bars, ms }: { x: number; y: number; bars: Bar[]; ms: number }) {
  const k = (i: number) => out(clamp((ms - bars[i].start) / bars[i].dur));
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect width={240} height={440} rx={28} fill="#FFFFFF" stroke={SC.line} strokeWidth={2} />
      <g opacity={k(0)} transform={`translate(0 ${(1 - k(0)) * 16})`}>
        <text x={22} y={44} fontSize={11} fontWeight={800} fill={DABBA}>DABBA</text>
        <text x={22} y={70} fontSize={18} fontWeight={900} fill={INK}>This week</text>
      </g>
      {['Veg pulao', 'Rajma chawal', 'Paneer roll', 'Curd rice', 'Pick a meal'].map((m, i) => (
        <g key={m} opacity={k(i + 1)} transform={`translate(16 ${90 + i * 58 + (1 - k(i + 1)) * 24})`}>
          <rect width={208} height={48} rx={12} fill="#FFFFFF" stroke="#EAECF0" strokeWidth={1.5} />
          <circle cx={26} cy={24} r={12} fill={DABBA_SOFT} />
          <text x={48} y={29} fontSize={12.5} fontWeight={700} fill={INK}>{m}</text>
        </g>
      ))}
      <g opacity={k(6)} transform={`translate(16 ${384 + (1 - k(6)) * 16})`}>
        <rect width={208} height={40} rx={12} fill={DABBA} />
        <text x={104} y={25} textAnchor="middle" fontSize={13} fontWeight={800} fill="#FFFFFF">Pay ₹495</text>
      </g>
    </g>
  );
}

const loopMs = (t: number, start: number, total: number, hold = 0.8) => {
  const period = (total * SLOW) / 1000 + hold, local = (((t - start) % period) + period) % period;
  return Math.min(total, (local * 1000) / SLOW);
};

export function MotionTimingScene({ t }: { t: number }) {
  const intro = clamp(back(t / 0.6));
  const fin = p(t, 28, 28.6);
  const before = t < 6, sizes = t >= 6 && t < 12, exits = t >= 12 && t < 17, choreo = t >= 17 && t < 23, cap = t >= 23 && t < 28;
  const capped = t >= 25.5;
  const n = 20, step = capped ? staggerStep(6, 200) : 40;
  const many: Bar[] = Array.from({ length: n }, (_, i) => ({ label: `${i + 1}`, start: capped ? Math.min(i, 5) * step : i * 40, dur: 220 }));
  const manyEnd = Math.max(...many.map(b => b.start + b.dur));
  const bars = before ? BEFORE : AFTER;
  const ms = before ? loopMs(t, 0.4, 600) : loopMs(t, 17.4, 380);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" role="img" aria-label="Animated story: Dabba's week screen goes from every part arriving at once over 600 ms to durations sized to each change, a faster exit, and a capped stagger that settles in 380 ms">
      <rect width={W} height={H} fill={SC.soft} />
      <Grid />
      <g opacity={intro * (1 - fin)}>
        {(before || choreo) && (
          <g>
            <WeekArriving x={80} y={50} bars={bars} ms={ms} />
            <text x={200} y={512} textAnchor="middle" fontSize={11.5} fontWeight={700} fill={SC.muted}>Played at ⅓ speed</text>
            <Gantt x={400} y={90} w={500} rows={bars} max={800} head={ms} title={before ? 'Every part: 600 ms, all at once' : 'Header first, cards 40 ms apart, Pay last'} />
            <text x={400} y={330} fontSize={15} fontWeight={800} fill={before ? SC.error : SC.text}>
              {before ? '✗ Sluggish, and nowhere for the eye to start' : '✓ All in by 380 ms, in reading order'}
            </text>
          </g>
        )}
        {sizes && (
          <g>
            <text x={80} y={70} fontSize={22} fontWeight={900} fill={SC.text}>Bigger changes get longer, at real speed</text>
            {([['press', 80, 'A press', 'under 100 ms'], ['sheet', 300, 'A sheet', 'about 300 ms'], ['page', 450, 'A whole page', 'about 450 ms']] as const).map(([kind, d, a, b], i) => {
              const period = d / 1000 + 0.9, local = (((t - 6.3) % period) + period) % period;
              return (
                <g key={kind} transform={`translate(${80 + i * 270} 100)`} opacity={p(t, 6 + i * 0.4, 6.5 + i * 0.4)}>
                  <TimingPreview kind={kind} k={kind === 'press' ? (local < d / 1000 ? 0.5 : 1) : clamp(local / (d / 1000))} />
                  <text x={100} y={178} textAnchor="middle" fontSize={15} fontWeight={900} fill={SC.text}>{a}</text>
                  <text x={100} y={198} textAnchor="middle" fontSize={13} fontWeight={700} fill={SC.muted}>{b}</text>
                </g>
              );
            })}
            <BandRuler x={110} y={360} w={740} show={p(t, 7.5, 9)} marker={undefined} />
          </g>
        )}
        {exits && (
          <g>
            <text x={80} y={70} fontSize={22} fontWeight={900} fill={SC.text}>Leave faster than you arrive</text>
            {([['sheet', 300, 'Opening: 300 ms, ease out'], ['sheet-out', 200, 'Closing: 200 ms, ease in']] as const).map(([kind, d, l], i) => {
              const period = (d * SLOW) / 1000 + 0.8, local = (((t - 12.3) % period) + period) % period;
              return (
                <g key={kind} transform={`translate(${120 + i * 280} 110)`} opacity={p(t, 12 + i * 0.6, 12.5 + i * 0.6)}>
                  <TimingPreview kind={kind} k={clamp((local * 1000) / SLOW / d)} />
                  <text x={100} y={178} textAnchor="middle" fontSize={14} fontWeight={800} fill={SC.text}>{l}</text>
                </g>
              );
            })}
            <Gantt x={120} y={350} w={680} rows={[{ label: 'Open', start: 0, dur: 300 }, { label: 'Close', start: 0, dur: 200 }]} max={400} title="" />
            <text x={120} y={340} fontSize={12} fontWeight={700} fill={SC.muted}>Phones at ⅓ speed. People have already decided; don’t make them watch it go.</text>
          </g>
        )}
        {cap && (
          <g>
            <text x={80} y={70} fontSize={22} fontWeight={900} fill={capped ? SC.text : SC.error}>
              {capped ? `Stagger the first six, the rest together: ${manyEnd} ms` : `Twenty cards, 40 ms apart: the last starts at ${staggerEnd(20, 40)} ms`}
            </text>
            <Gantt x={80} y={110} w={800} rows={many} max={1000} title="" rowH={14} />
          </g>
        )}
      </g>

      {t >= 28 && (
        <g opacity={fin}>
          <text x={W / 2} y={70} textAnchor="middle" fontSize={24} fontWeight={900} fill={SC.text}>Faster, and it tells the eye where to go</text>
          <Gantt x={90} y={120} w={380} rows={BEFORE} max={800} title="Before: 600 ms" />
          <Gantt x={500} y={120} w={380} rows={AFTER} max={800} title="After: 380 ms" />
          <g transform="translate(90 400)" opacity={p(t, 29.5, 30)}>
            {['Size sets the time', 'Exits are shorter', 'One thing leads', 'Cap the stagger'].map((l, i) => (
              <g key={l} transform={`translate(${i * 200} 0)`}>
                <rect width={186} height={44} rx={12} fill={SC.surface} stroke={SC.line} strokeWidth={1.5} />
                <text x={93} y={27} textAnchor="middle" fontSize={13} fontWeight={800} fill={SC.text}>{l}</text>
              </g>
            ))}
          </g>
        </g>
      )}
    </svg>
  );
}
