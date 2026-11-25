'use client';
// Scene for ui.6-1: Roshni's ops console is all pies and gauges. Farah redraws the eight cities as sorted bars (length
// beats angle), shows a cut-axis uptime chart lying fourfold and fixes it from zero (`lieFactor`, `valueAxis`), lets a
// 90-day line zoom because slope is what it shows, finds the tail an average hides (`histogram`), plots size against
// tickets as a scatter, and ends with questions choosing forms (`chartFor`). Pure function of t (0–36). Also exports
// `FormChart`, which `chart-pick` uses to draw a question's real data in a form.
import { CHART_SERIES, ROSHNI_QUESTIONS, chartFor, histogram, lieFactor, mean, valueAxis, type ChartForm, type ChartQuestion, type RoshniQuestion } from '@shape/content';
import { back, clamp, Grid, lerp, p, SC } from './shared';

const W = 640, H = 360;
const BLUE = CHART_SERIES[0];
export const FORM_LABEL: Record<ChartForm, string> = { bar: 'Bars', line: 'Line', distribution: 'Histogram', scatter: 'Scatter' };

/** A question's data drawn as `form` inside (x, y, w, h). Bars from zero, sorted when the categories have no order;
 *  lines on a zoomed, labelled axis; histograms with the average marked; scatters with both axes from zero.
 *  `k` (0–1) grows the marks in. `fs` is the label size. */
export function FormChart({ q, form, x, y, w, h, k = 1, fs = 13 }: { q: ChartQuestion; form: ChartForm; x: number; y: number; w: number; h: number; k?: number; fs?: number }) {
  const d = q.data;
  const axis = <line x1={x} y1={y + h} x2={x + w} y2={y + h} stroke={SC.muted} strokeWidth={1.5} />;
  if (form === 'bar' && d.kind === 'values') {
    const { max } = valueAxis('bar', d.values);
    if (q.task === 'trend') {
      const bw = w / d.values.length;
      return (
        <g>
          {d.values.map((v, i) => {
            const bh = (v / max) * (h - fs - 4) * k;
            return (
              <g key={i}>
                <rect x={x + i * bw + bw * 0.15} y={y + h - bh} width={bw * 0.7} height={bh} rx={3} fill={BLUE} />
                <text x={x + i * bw + bw / 2} y={y + h - bh - 4} fontSize={fs} fontWeight={700} fill={SC.text} textAnchor="middle" opacity={k}>{v.toLocaleString('en-IN')}</text>
                <text x={x + i * bw + bw / 2} y={y + h + fs + 2} fontSize={fs} fontWeight={600} fill={SC.muted} textAnchor="middle">{d.labels[i]}</text>
              </g>
            );
          })}
          {axis}
        </g>
      );
    }
    const rows = d.values.map((v, i) => ({ v, l: d.labels[i] })).sort((a, b) => b.v - a.v);
    const rh = h / rows.length, lw = w * 0.3;
    return (
      <g>
        {rows.map((r, i) => (
          <g key={r.l}>
            <text x={x + lw - 6} y={y + i * rh + rh / 2 + fs * 0.35} fontSize={fs} fontWeight={600} fill={SC.text} textAnchor="end">{r.l}</text>
            <rect x={x + lw} y={y + i * rh + rh * 0.15} width={Math.max(1, ((w - lw - fs * 3) * r.v * k) / max)} height={rh * 0.7} rx={3} fill={BLUE} />
            <text x={x + lw + ((w - lw - fs * 3) * r.v * k) / max + 4} y={y + i * rh + rh / 2 + fs * 0.35} fontSize={fs} fontWeight={700} fill={SC.muted} opacity={k}>{r.v}{d.unit === '%' ? '%' : ''}</text>
          </g>
        ))}
        <line x1={x + lw} y1={y} x2={x + lw} y2={y + h} stroke={SC.muted} strokeWidth={1.5} />
      </g>
    );
  }
  if (form === 'line' && d.kind === 'values') {
    const { min, max } = valueAxis('line', d.values);
    const lx = x + fs * 3, lw = w - fs * 3;
    const pts = d.values.map((v, i) => [lx + (i / (d.values.length - 1)) * lw, y + h - ((v - min) / (max - min)) * h] as const);
    const n = Math.max(2, Math.round(pts.length * k));
    return (
      <g>
        {[min, max].map(v => (
          <g key={v}>
            <line x1={lx} y1={y + h - ((v - min) / (max - min)) * h} x2={x + w} y2={y + h - ((v - min) / (max - min)) * h} stroke={SC.line} />
            <text x={lx - 4} y={y + h - ((v - min) / (max - min)) * h + fs * 0.35} fontSize={fs} fontWeight={600} fill={SC.muted} textAnchor="end">{v}</text>
          </g>
        ))}
        <polyline points={pts.slice(0, n).map(q => q.join(',')).join(' ')} fill="none" stroke={BLUE} strokeWidth={2.5} strokeLinejoin="round" />
        <text x={x + w} y={y + h + fs + 2} fontSize={fs} fontWeight={600} fill={SC.muted} textAnchor="end">{d.labels.at(-1)} · {d.unit}</text>
        <text x={lx} y={y + h + fs + 2} fontSize={fs} fontWeight={600} fill={SC.muted}>{d.labels[0]}</text>
      </g>
    );
  }
  if (form === 'distribution' && d.kind === 'samples') {
    const bins = histogram(d.values, d.width);
    const top = Math.max(...bins.map(b => b.count));
    const lo = bins[0].from, hi = bins.at(-1)!.from + d.width;
    const sx = (v: number) => x + ((v - lo) / (hi - lo)) * w;
    const m = mean(d.values);
    return (
      <g>
        {bins.map(b => {
          const bh = (b.count / top) * (h - fs - 6) * k;
          return <rect key={b.from} x={sx(b.from) + 1} y={y + h - bh} width={Math.max(1, sx(b.from + d.width) - sx(b.from) - 2)} height={bh} rx={2} fill={BLUE} />;
        })}
        {axis}
        <line x1={sx(m)} y1={y} x2={sx(m)} y2={y + h} stroke={SC.text} strokeWidth={2} strokeDasharray="5 4" opacity={k} />
        <text x={sx(m) + 5} y={y + fs} fontSize={fs} fontWeight={700} fill={SC.text} opacity={k}>Average {d.unit === '₹' ? `₹${Math.round(m).toLocaleString('en-IN')}` : `${Math.round(m)} ${d.unit}`}</text>
        <text x={x} y={y + h + fs + 2} fontSize={fs} fontWeight={600} fill={SC.muted}>{d.unit === '₹' ? `₹${lo.toLocaleString('en-IN')}` : `${lo} ${d.unit}`}</text>
        <text x={x + w} y={y + h + fs + 2} fontSize={fs} fontWeight={600} fill={SC.muted} textAnchor="end">{d.unit === '₹' ? `₹${hi.toLocaleString('en-IN')}` : `${hi} ${d.unit}`}</text>
      </g>
    );
  }
  if (form === 'scatter' && d.kind === 'pairs') {
    const mx = valueAxis('bar', d.points.map(pt => pt[0])).max, my = valueAxis('bar', d.points.map(pt => pt[1])).max;
    const lx = x + fs * 1.5;
    return (
      <g>
        <line x1={lx} y1={y} x2={lx} y2={y + h} stroke={SC.muted} strokeWidth={1.5} />
        <line x1={lx} y1={y + h} x2={x + w} y2={y + h} stroke={SC.muted} strokeWidth={1.5} />
        {d.points.map(([a, b], i) => (
          <circle key={i} cx={lx + (a / mx) * (x + w - lx - 6)} cy={y + h - (b / my) * (h - 6)} r={4.5} fill={BLUE} stroke="var(--color-bg-primary)" strokeWidth={1.5} opacity={clamp(k * 1.5 - i / d.points.length / 2)} />
        ))}
        <text x={x + w} y={y + h + fs + 2} fontSize={fs} fontWeight={600} fill={SC.muted} textAnchor="end">{d.x} →</text>
        <text x={lx + 6} y={y + fs * 0.4} fontSize={fs} fontWeight={600} fill={SC.muted}>↑ {d.y}</text>
      </g>
    );
  }
  return null;
}

/** A pie of the eight cities: angle and area, hard to compare. */
function Pie({ cx, cy, r, k }: { cx: number; cy: number; r: number; k: number }) {
  const d = ROSHNI_QUESTIONS.cities.data;
  if (d.kind !== 'values') return null;
  const total = d.values.reduce((s, v) => s + v, 0);
  const starts = d.values.map((_, i) => -Math.PI / 2 + (d.values.slice(0, i).reduce((s, v) => s + v, 0) / total) * Math.PI * 2);
  return (
    <g opacity={k}>
      {d.values.map((v, i) => {
        const a0 = starts[i], a1 = a0 + (v / total) * Math.PI * 2;
        const path = `M${cx} ${cy} L${cx + r * Math.cos(a0)} ${cy + r * Math.sin(a0)} A${r} ${r} 0 ${a1 - a0 > Math.PI ? 1 : 0} 1 ${cx + r * Math.cos(a1)} ${cy + r * Math.sin(a1)} Z`;
        return <path key={i} d={path} fill={i % 2 ? SC.design : SC.discover} opacity={0.35 + (i % 4) * 0.18} stroke="var(--color-bg-primary)" strokeWidth={2} />;
      })}
    </g>
  );
}

export function ChartFormsScene({ t }: { t: number }) {
  const intro = clamp(back(t / 0.6));
  const title = t < 6 ? 'A console of pies' : t < 11 ? 'Length beats angle' : t < 16 ? 'Bars start at zero' : t < 21 ? 'Lines can zoom' : t < 26 ? 'The average hides people' : t < 31 ? 'Two measures, one dot' : 'Question, then form';
  const q = (k: RoshniQuestion) => ROSHNI_QUESTIONS[k];
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" role="img" aria-label="Animated story: Roshni's console is pies and gauges. The eight cities become sorted bars, where the gap between Jaipur and Pune is plain. A bar chart of 97% against 94% uptime, drawn from 93%, makes one bar four times the other; from zero they are nearly level. A 90-day line can start near its data because slope is what it shows. A histogram of switch-on waits shows the long tail an average of 24 days hides. A scatter of system size against tickets shows they barely move together. Each question picks its form.">
      <rect width={W} height={H} fill={SC.soft} />
      <Grid w={W} h={H} />
      <g opacity={intro}>
        <text x={32} y={44} fontSize={26} fontWeight={900} fill={SC.text}>{title}</text>

        {t < 6 && (
          <g>
            {[0, 1, 2].map(i => <Pie key={i} cx={130 + i * 190} cy={180} r={64} k={p(t, 0.3 + i * 0.4, 1 + i * 0.4)} />)}
            {[0, 1, 2].map(i => (
              <g key={i} opacity={p(t, 1.8 + i * 0.4, 2.4 + i * 0.4)}>
                <path d={`M${70 + i * 190} 320 A60 60 0 0 1 ${190 + i * 190} 320`} fill="none" stroke={SC.line} strokeWidth={14} />
                <line x1={130 + i * 190} y1={320} x2={130 + i * 190 + 44 * Math.cos(-Math.PI * (0.3 + i * 0.2))} y2={320 + 44 * Math.sin(-Math.PI * (0.3 + i * 0.2))} stroke={SC.text} strokeWidth={4} strokeLinecap="round" />
              </g>
            ))}
            <text x={130} y={98} fontSize={21} fontWeight={800} fill={SC.muted} textAnchor="middle" opacity={p(t, 3, 3.6)}>Cities</text>
            <text x={320} y={98} fontSize={21} fontWeight={800} fill={SC.muted} textAnchor="middle" opacity={p(t, 3, 3.6)}>Revenue</text>
            <text x={510} y={98} fontSize={21} fontWeight={800} fill={SC.muted} textAnchor="middle" opacity={p(t, 3, 3.6)}>Faults</text>
          </g>
        )}

        {t >= 6 && t < 11 && (
          <g>
            <Pie cx={140} cy={205} r={95} k={1 - p(t, 9.5, 10.5) * 0.5} />
            <text x={140} y={334} fontSize={21} fontWeight={800} fill={SC.muted} textAnchor="middle">Jaipur or Pune?</text>
            <FormChart q={q('cities')} form="bar" x={290} y={80} w={320} h={250} k={p(t, 6.8, 8.6)} fs={21} />
          </g>
        )}

        {t >= 11 && t < 16 && (() => {
          const z = p(t, 12.6, 13.8);
          const floor = lerp(93, 0, z);
          const bar = (v: number) => ((v - floor) / (100 - floor)) * 200;
          const lf = lieFactor(94, 97, floor);
          return (
            <g>
              {[['Jaipur', 97], ['Pune', 94]].map(([l, v], i) => (
                <g key={l}>
                  <rect x={110 + i * 160} y={310 - bar(v as number)} width={110} height={bar(v as number)} rx={4} fill={BLUE} />
                  <text x={165 + i * 160} y={300 - bar(v as number)} fontSize={22} fontWeight={900} fill={SC.text} textAnchor="middle">{v}%</text>
                  <text x={165 + i * 160} y={340} fontSize={21} fontWeight={800} fill={SC.muted} textAnchor="middle">{l}</text>
                </g>
              ))}
              <line x1={90} y1={310} x2={400} y2={310} stroke={SC.text} strokeWidth={2} />
              <text x={84} y={316} fontSize={21} fontWeight={800} fill={SC.muted} textAnchor="end">{Math.round(floor)}%</text>
              <text x={440} y={170} fontSize={21} fontWeight={800} fill={SC.muted}>Lie factor</text>
              <text x={440} y={220} fontSize={44} fontWeight={900} fill={lf > 1.05 ? SC.error : SC.mint}>{lf > 10 ? Math.round(lf) : lf.toFixed(1)}</text>
              <text x={440} y={256} fontSize={21} fontWeight={800} fill={SC.muted}>{z < 0.5 ? 'Axis cut at 93%' : 'From zero: honest'}</text>
            </g>
          );
        })()}

        {t >= 16 && t < 21 && (
          <g>
            <FormChart q={q('heights')} form="line" x={40} y={90} w={560} h={210} k={p(t, 16.4, 19)} fs={21} />
            <text x={430} y={84} fontSize={21} fontWeight={800} fill={SC.text} opacity={p(t, 19, 19.6)}>Sliding since day 60</text>
          </g>
        )}

        {t >= 21 && t < 26 && (
          <g>
            <FormChart q={q('wait')} form="distribution" x={50} y={90} w={540} h={210} k={p(t, 21.4, 23)} fs={21} />
            <text x={590} y={210} fontSize={21} fontWeight={800} fill={SC.error} textAnchor="end" opacity={p(t, 23.6, 24.2)}>Six wait 5–9 weeks</text>
          </g>
        )}

        {t >= 26 && t < 31 && <FormChart q={q('size')} form="scatter" x={50} y={90} w={540} h={210} k={p(t, 26.4, 28.4)} fs={21} />}

        {t >= 31 && (
          <g>
            {(['cities', 'heights', 'wait', 'size'] as const).map((k, i) => {
              const f = chartFor(q(k));
              const o = p(t, 31.3 + i * 0.6, 31.9 + i * 0.6);
              return (
                <g key={k} opacity={o} transform={`translate(${lerp(-20, 0, o)} 0)`}>
                  <text x={40} y={100 + i * 64} fontSize={21} fontWeight={700} fill={SC.text}>{['Which city installed most?', '90 days of one society?', 'How long do people wait?', 'Size against tickets?'][i]}</text>
                  <text x={600} y={100 + i * 64} fontSize={22} fontWeight={900} fill={BLUE} textAnchor="end">→ {FORM_LABEL[f]}</text>
                  <line x1={40} y1={118 + i * 64} x2={600} y2={118 + i * 64} stroke={SC.line} />
                </g>
              );
            })}
          </g>
        )}
      </g>
    </svg>
  );
}
