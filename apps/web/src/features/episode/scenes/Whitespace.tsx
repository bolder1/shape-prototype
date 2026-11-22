'use client';
// Scene for ui.1-3: a settings screen with a line under every row and a box around every group. The lines go, the rows run
// together, then gaps take over the grouping; only the focus ring and an error border stay. Pure function of t (0–34).
import { clamp, Grid, back, lerp, p, SC } from './shared';

const W = 960, H = 540;
const GROUPS = [
  { name: 'Account', rows: ['Name', 'Phone', 'Email'] },
  { name: 'Payments', rows: ['UPI ID', 'Saved cards'] },
  { name: 'Privacy', rows: ['Location', 'Contacts', 'Ads'] },
];
const RH = 30, X = 280, RW = 400;

export function WhitespaceScene({ t }: { t: number }) {
  const linesOff = p(t, 12, 13.5);
  const grouped = p(t, 18, 19.5);
  const within = lerp(8, 6, grouped), between = lerp(8, 34, grouped);
  const headings = grouped;
  const meaning = t >= 24;
  const fin = p(t, 29, 29.8);
  const counting = t >= 6 && t < 12;

  // lay rows out from the gaps
  let y = 70;
  const rows: { g: number; r: number; label: string; y: number }[] = [];
  const boxes: { y1: number; y2: number; head: number }[] = [];
  GROUPS.forEach((gr, gi) => {
    if (gi) y += between;
    const head = y;
    y += lerp(0, 26, headings);
    const y1 = y;
    gr.rows.forEach((label, ri) => { if (ri) y += within; rows.push({ g: gi, r: ri, label, y }); y += RH; });
    boxes.push({ y1: y1 - 6, y2: y + 6, head });
  });
  const lineCount = rows.length + boxes.length * 4;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" role="img" aria-label="Animated story: replacing lines and boxes with whitespace">
      <rect width={W} height={H} fill={SC.soft} />
      <Grid />
      <g opacity={1 - fin}>
        <rect x={X - 30} y={40} width={RW + 60} height={y - 20} rx={22} fill={SC.surface} stroke={SC.line} strokeWidth={2} />
        {/* group boxes */}
        {boxes.map((b, i) => (
          <rect key={i} x={X - 10} y={b.y1} width={RW + 20} height={b.y2 - b.y1} rx={8} fill="none" stroke={counting ? SC.error : SC.line} strokeWidth={2} opacity={1 - linesOff} />
        ))}
        {/* group headings */}
        {GROUPS.map((gr, i) => (
          <text key={gr.name} x={X} y={boxes[i].head + 18} fontSize={13} fontWeight={800} letterSpacing={1} fill={SC.muted} opacity={headings}>{gr.name.toUpperCase()}</text>
        ))}
        {rows.map((r, i) => {
          const focus = meaning && r.label === 'Phone', error = meaning && r.label === 'UPI ID';
          return (
            <g key={r.label}>
              <rect x={X} y={r.y} width={RW} height={RH} rx={6} fill="none"
                stroke={focus ? SC.mint : error ? SC.error : 'none'} strokeWidth={3} />
              <text x={X + 12} y={r.y + 20} fontSize={14} fontWeight={700} fill={SC.text}>{r.label}</text>
              <rect x={X + RW - 110} y={r.y + 11} width={90} height={8} rx={4} fill={SC.muted} opacity={0.35} />
              <line x1={X} x2={X + RW} y1={r.y + RH + within / 2} y2={r.y + RH + within / 2} stroke={counting ? SC.error : SC.line} strokeWidth={1.5} opacity={(1 - linesOff) * (i === rows.length - 1 ? 0 : 1)} />
              {error && <text x={X + RW + 14} y={r.y + 20} fontSize={12} fontWeight={800} fill={SC.error} opacity={clamp((t - 24.3) / 0.4)}>Invalid UPI ID</text>}
              {focus && <text x={X + RW + 14} y={r.y + 20} fontSize={12} fontWeight={800} fill={SC.mint} opacity={clamp((t - 24.3) / 0.4)}>Typing here</text>}
            </g>
          );
        })}
        {counting && (
          <g transform="translate(110 200)" opacity={clamp((t - 6) / 0.4)}>
            <text textAnchor="middle" fontSize={64} fontWeight={900} fill={SC.error}>{Math.min(lineCount, Math.floor((t - 6) * 8))}</text>
            <text y={30} textAnchor="middle" fontSize={14} fontWeight={800} fill={SC.error}>lines and box edges</text>
          </g>
        )}
        {t >= 13.5 && t < 18 && <text x={110} y={220} textAnchor="middle" fontSize={15} fontWeight={800} fill={SC.build} opacity={clamp((t - 14) / 0.4)}>All one blur</text>}
        {t >= 19.5 && t < 24 && (
          <g opacity={clamp((t - 19.5) / 0.4)}>
            <text x={110} y={210} textAnchor="middle" fontSize={15} fontWeight={800} fill={SC.mint}>Small gaps inside</text>
            <text x={110} y={236} textAnchor="middle" fontSize={15} fontWeight={800} fill={SC.mint}>Big gaps between</text>
          </g>
        )}
      </g>

      {fin > 0 && [{ x: 200, n: 'Space groups', l: 'Small inside, big between', c: SC.mint }, { x: 480, n: 'Cut decoration', l: 'Lines that only separate', c: SC.discover }, { x: 760, n: 'Keep meaning', l: 'Focus, errors, selection', c: SC.design }].map((f, i) => {
        const k = back((t - (29.2 + i * 0.25)) / 0.5);
        return (
          <g key={f.n} transform={`translate(${f.x} 260) scale(${clamp(k)})`}>
            <rect x={-125} y={-70} width={250} height={140} rx={18} fill={SC.surface} stroke={f.c} strokeWidth={3} />
            <text y={-8} textAnchor="middle" fontSize={22} fontWeight={800} fill={f.c}>{f.n}</text>
            <text y={26} textAnchor="middle" fontSize={14} fontWeight={600} fill={SC.text}>{f.l}</text>
          </g>
        );
      })}
    </svg>
  );
}
