'use client';
// Scene for rs.5-3: Bolo's Monday dashboard. Trial-to-paid falls from 20% to 16% (`BOLO_SIGNALS.trial`). Gate 1:
// nothing changed in how it's counted. Gate 2: split by who signed up, both groups convert exactly as before, and the
// college campaign tripled the students, so the blend fell (`segmentChanges`, `segmentStory` = mix). Then finished
// lessons fall everywhere after speaking drills moved first (`speakFirst`): the data says what but not why, so
// Tanushree calls six learners, and a "Speak later" button brings the number back. Pure function of t (0–36).
import { BOLO_SIGNALS, segmentChanges } from '@shape/content';
import { back, clamp, Grid, lerp, p, Pen, SC } from './shared';

const W = 960, H = 540;
const trial = BOLO_SIGNALS.trial.segments!, speak = BOLO_SIGNALS.speakFirst.segments!;
const T = segmentChanges(trial), S = segmentChanges(speak);
/** Weekly trial-to-paid as the campaign ramps up: the blend of the two groups' (unchanged) rates as students grow
 *  from a third of trials to three in five. */
const WEEKS = Array.from({ length: 8 }, (_, i) => {
  const share = i < 3 ? 1 / 3 : lerp(1 / 3, 0.6, Math.min(1, (i - 2) / 4));
  return (1 - share) * T.slices[0].pa + share * T.slices[1].pa;
});
const CALLS = ['On the bus to college', 'Shared room, my sister studies', 'At the shop counter', 'Hostel, four of us', 'Office canteen', 'I just felt silly'];
const pc = (x: number) => `${Math.round(x * 100)}%`;

function Chart({ t, values, y0, y1, label, from }: { t: number; values: readonly number[]; y0: number; y1: number; label: string; from: number }) {
  const w = 520, h = 220, x = (i: number) => (i / (values.length - 1)) * w, y = (v: number) => h - ((v - y0) / (y1 - y0)) * h;
  const shown = lerp(1, values.length, p(t, from, from + 3));
  const pts = values.slice(0, Math.ceil(shown)).map((v, i) => `${x(i)},${y(v)}`).join(' ');
  return (
    <g>
      <rect x={-20} y={-40} width={w + 40} height={h + 80} rx={18} fill={SC.surface} stroke={SC.line} strokeWidth={2} />
      <text x={0} y={-12} fontSize={13} fontWeight={900} fill={SC.muted}>{label}</text>
      {[y0, (y0 + y1) / 2, y1].map(v => <g key={v}><line x1={0} x2={w} y1={y(v)} y2={y(v)} stroke={SC.line} /><text x={w + 6} y={y(v) + 4} fontSize={11} fontWeight={800} fill={SC.muted}>{pc(v)}</text></g>)}
      <polyline points={pts} fill="none" stroke={SC.brand} strokeWidth={4} strokeLinejoin="round" strokeLinecap="round" />
      {values.slice(0, Math.ceil(shown)).map((v, i) => <circle key={i} cx={x(i)} cy={y(v)} r={5} fill={SC.brand} />)}
    </g>
  );
}

export function DashboardDigScene({ t }: { t: number }) {
  const intro = clamp(back(t / 0.6));
  const title = t < 6 ? 'Monday’s dashboard' : t < 11 ? 'Gate 1: the instrument' : t < 16 ? 'Gate 2: split it' : t < 21 ? 'The mix moved' : t < 26 ? 'Another number' : t < 31 ? 'Gate 3: why?' : 'Back to the data';
  const studentShare = (k: number) => lerp(trial[1].before.n / (trial[0].before.n + trial[1].before.n), trial[1].after.n / (trial[0].after.n + trial[1].after.n), k);
  const mixK = p(t, 16.6, 19);
  const blend = (1 - studentShare(mixK)) * T.slices[0].pa + studentShare(mixK) * T.slices[1].pa;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" role="img" aria-label={`Animated story: Bolo's trial-to-paid falls from ${pc(T.overall.pa)} to ${pc(T.overall.pb)}. Nothing changed in how a conversion is counted. Split by who signed up, job-seekers convert at ${pc(T.slices[0].pa)} before and after, and students at ${pc(T.slices[1].pa)} before and after, but a college campaign tripled the students, so the blend fell. Then finished lessons fall from ${pc(S.overall.pa)} to ${pc(S.overall.pb)} for everyone after speaking drills moved to the start. Six phone calls find learners practise on buses and in shared rooms and won't speak aloud there. A "Speak later" button brings finished lessons back to 63%.`}>
      <rect width={W} height={H} fill={SC.soft} />
      <Grid />
      <g opacity={intro}>
        <text x={60} y={60} fontSize={22} fontWeight={900} fill={SC.text}>{title}</text>

        {t < 11 && (
          <g transform="translate(80 150)" opacity={p(t, 0.2, 0.7)}>
            <Chart t={t} values={WEEKS} y0={0.12} y1={0.22} label="TRIALS THAT BECOME PAID, BY WEEK" from={0.6} />
            {t >= 6 && (
              <g transform="translate(600 -40)">
                {['Release notes: 6.0 → 6.1', 'Event “subscription_paid”: unchanged', 'Payment provider: unchanged'].map((r, i) => (
                  <g key={r} transform={`translate(0 ${i * 70})`} opacity={p(t, 6.4 + i * 0.9, 6.9 + i * 0.9)}>
                    <rect width={260} height={54} rx={12} fill={SC.surface} stroke={SC.line} />
                    <circle cx={26} cy={27} r={11} fill={SC.mint} />
                    <path d="M20 27 l5 5 l9 -10" fill="none" stroke="#fff" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
                    <foreignObject x={46} y={8} width={206} height={40}><p style={{ margin: 0, font: '800 13px/1.3 Inter, system-ui, sans-serif', color: 'var(--color-text-primary)' }}>{r}</p></foreignObject>
                  </g>
                ))}
                <text y={240} fontSize={15} fontWeight={800} fill={SC.muted} opacity={p(t, 9.4, 9.9)}>The number still means what it did.</text>
              </g>
            )}
          </g>
        )}

        {t >= 11 && t < 21 && (
          <g transform="translate(60 110)">
            {T.slices.map((s, i) => {
              const nB = trial[i].before.n, nA = trial[i].after.n;
              return (
                <g key={s.name} transform={`translate(0 ${i * 130})`} opacity={p(t, 11.3 + i * 0.8, 11.8 + i * 0.8)}>
                  <text fontSize={17} fontWeight={900} fill={SC.text}>{s.name}</text>
                  <text x={180} fontSize={15} fontWeight={800} fill={SC.muted}>converts {pc(s.pa)} → {pc(s.pb)}</text>
                  <rect y={16} width={nB / 25} height={34} rx={8} fill={SC.line} />
                  <text x={nB / 25 + 10} y={40} fontSize={13} fontWeight={800} fill={SC.muted}>{nB.toLocaleString('en-IN')} trials before</text>
                  <rect y={58} width={lerp(nB, nA, p(t, 12.8 + i * 0.6, 14.2 + i * 0.6)) / 25} height={34} rx={8} fill={i ? SC.design : SC.discover} />
                  <text x={nA / 25 + 10} y={82} fontSize={13} fontWeight={800} fill={SC.muted} opacity={p(t, 14, 14.5)}>{nA.toLocaleString('en-IN')} after</text>
                </g>
              );
            })}
            {t >= 16 && (
              <g transform="translate(0 290)">
                <rect width={840} height={110} rx={16} fill={SC.surface} stroke={SC.line} strokeWidth={2} />
                <text x={24} y={36} fontSize={13} fontWeight={900} fill={SC.muted}>EVERYONE: THE BLEND OF THE TWO</text>
                <text x={24} y={84} fontSize={40} fontWeight={900} fill={SC.text}>{(blend * 100).toFixed(1)}%</text>
                <foreignObject x={210} y={30} width={600} height={70}><p style={{ margin: 0, font: '800 15px/1.35 Inter, system-ui, sans-serif', color: 'var(--color-text-tertiary)' }}>Students go from {pc(studentShare(0))} of trials to {pc(studentShare(1))}. Nobody converts any differently; more of the people who always convert less arrived.</p></foreignObject>
              </g>
            )}
          </g>
        )}

        {t >= 21 && t < 26 && (
          <g transform="translate(60 120)">
            <text fontSize={15} fontWeight={900} fill={SC.muted}>LESSONS FINISHED, SINCE SPEAKING DRILLS MOVED FIRST</text>
            {S.slices.map((s, i) => (
              <g key={s.name} transform={`translate(0 ${40 + i * 110})`} opacity={p(t, 21.3 + i * 0.6, 21.8 + i * 0.6)}>
                <text y={18} fontSize={17} fontWeight={900} fill={SC.text}>{s.name}</text>
                <rect x={170} width={s.pa * 900} height={26} rx={6} fill={SC.line} />
                <rect x={170} y={32} width={lerp(s.pa, s.pb, p(t, 22.4, 23.6)) * 900} height={26} rx={6} fill={SC.brand} />
                <text x={170 + s.pa * 900 + 10} y={20} fontSize={14} fontWeight={800} fill={SC.muted}>{pc(s.pa)}</text>
                <text x={170 + s.pb * 900 + 10} y={52} fontSize={14} fontWeight={900} fill={SC.text} opacity={p(t, 23.4, 23.8)}>{pc(s.pb)}</text>
              </g>
            ))}
            <text y={300} fontSize={16} fontWeight={800} fill={SC.muted} opacity={p(t, 24, 24.6)}>Sound data, and the drop is everywhere. No slice explains it.</text>
          </g>
        )}

        {t >= 26 && t < 31 && (
          <g transform="translate(60 100)">
            {CALLS.map((c, i) => (
              <g key={c} transform={`translate(${(i % 3) * 285} ${Math.floor(i / 3) * 130})`} opacity={p(t, 26.3 + i * 0.4, 26.8 + i * 0.4)}>
                <rect width={265} height={100} rx={18} fill={SC.surface} stroke={i < 5 ? SC.design : SC.line} strokeWidth={2.5} />
                <text x={20} y={30} fontSize={12} fontWeight={900} fill={SC.muted}>CALL {i + 1}</text>
                <foreignObject x={20} y={40} width={230} height={56}><p style={{ margin: 0, font: '800 15px/1.3 Inter, system-ui, sans-serif', color: 'var(--color-text-primary)' }}>“{c}”</p></foreignObject>
              </g>
            ))}
            <text y={300} fontSize={16} fontWeight={800} fill={SC.text} opacity={p(t, 29, 29.5)}>Five of six won’t speak aloud where they practise. The logs could never have said that.</text>
          </g>
        )}

        {t >= 31 && (
          <g transform="translate(80 150)" opacity={p(t, 31.1, 31.6)}>
            <Chart t={t} values={[S.overall.pa, S.overall.pa, S.overall.pb, S.overall.pb, 0.6, 0.62, 0.63]} y0={0.5} y1={0.7} label="LESSONS FINISHED, BY WEEK" from={31.2} />
            <g transform="translate(600 0)" opacity={p(t, 32.6, 33.1)}>
              <rect width={220} height={56} rx={14} fill={SC.brand} />
              <text x={110} y={35} textAnchor="middle" fontSize={17} fontWeight={900} fill="#fff">Speak later</text>
              <foreignObject x={0} y={76} width={240} height={110}><p style={{ margin: 0, font: '800 15px/1.35 Inter, system-ui, sans-serif', color: 'var(--color-text-tertiary)' }}>Data found where to look. People said why. The same number shows the fix worked.</p></foreignObject>
            </g>
            <Pen x={860} y={280} mood="cheer" scale={0.45} />
          </g>
        )}
      </g>
    </svg>
  );
}
