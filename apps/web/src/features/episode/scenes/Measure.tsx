'use client';
// Scene for ui.2-4: a paragraph stretched to ~130 characters a line; the eye sweeps back and lands on the wrong line; the
// measure narrows to ~62; then the leading collapses to 1.0 and opens to 1.5. Pure function of t (0–34).
import { back, clamp, Grid, lerp, p, SC } from './shared';

const W = 960, H = 540;
export const PARAGRAPH = 'The monsoon reached the city on a Tuesday. By noon the streets had turned to rivers, and the chai stalls under the flyover were the only dry places left. People who had never spoken stood shoulder to shoulder, holding small glasses with both hands, watching the water rise past the kerb. Nobody was in a hurry any more. The buses had stopped, the phones had no signal, and for an hour the whole street shared one long, warm conversation about the rain.';

/** Greedy word wrap to about `n` characters a line. */
export function wrap(text: string, n: number) {
  const lines: string[] = [];
  let line = '';
  for (const word of text.split(' ')) {
    if (line && (line + ' ' + word).length > n) { lines.push(line); line = word; } else line = line ? `${line} ${word}` : word;
  }
  if (line) lines.push(line);
  return lines;
}

const Chip = ({ x, y, label, ok }: { x: number; y: number; label: string; ok: boolean }) => (
  <g transform={`translate(${x} ${y})`}>
    <rect x={-70} y={-15} width={140} height={30} rx={15} fill={ok ? SC.mint : SC.error} />
    <text y={5} textAnchor="middle" fontSize={14} fontWeight={800} fill="#fff">{label}</text>
  </g>
);

export function MeasureScene({ t }: { t: number }) {
  const fin = p(t, 29, 29.8);
  const narrow = p(t, 11.4, 13.4);
  const chars = Math.round(lerp(130, 62, narrow));
  const size = lerp(12.5, 18, narrow);
  const leading = t < 17 ? 1.5 : lerp(lerp(1.5, 1.0, p(t, 17.2, 18.2)), 1.5, p(t, 22.2, 23.4));
  const lines = wrap(PARAGRAPH, chars).slice(0, 7);
  const lh = size * leading;
  const left = lerp(40, 480 - chars * size * 0.25, narrow);
  const top = 150;

  // The eye: sweeps line 1, then jumps back and lands two lines down.
  const sweep = t >= 2.2 && t < 10.8;
  const sx = sweep ? (t < 5 ? lerp(left, left + chars * size * 0.5, (t - 2.2) / 2.8) : lerp(left + chars * size * 0.5, left, clamp((t - 5) / 1.2))) : 0;
  const sy = top + (t < 5 ? 0 : lerp(0, 2, clamp((t - 5) / 1.2))) * lh - size * 0.35;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" role="img" aria-label="Animated story: long lines are hard to follow; a narrower measure and a line height of 1.5 make text comfortable">
      <rect width={W} height={H} fill={SC.soft} />
      <Grid />
      <g opacity={1 - fin}>
        <g opacity={clamp(t / 0.6)}>
          <rect x={20} y={100} width={920} height={360} rx={20} fill={SC.surface} stroke={SC.line} strokeWidth={2} />
          {lines.map((l, i) => (
            <text key={i} x={left} y={top + i * lh} fontSize={size} fill={SC.text}
              opacity={t >= 6.2 && t < 10.8 && i === 1 ? 0.35 : 1}>{l}</text>
          ))}
          {sweep && (
            <g>
              <circle cx={sx} cy={sy} r={9} fill={SC.design} opacity={0.75} />
              {t >= 6.2 && <text x={480} y={420} textAnchor="middle" fontSize={17} fontWeight={800} fill={SC.error} opacity={clamp((t - 6.2) / 0.3)}>Wrong line! Where was I?</text>}
            </g>
          )}
        </g>

        {/* the readouts */}
        {t >= 0.6 && t < 17 && <Chip x={480} y={70} label={`~${chars} characters`} ok={chars <= 75} />}
        {t >= 13.4 && t < 17 && (
          <g opacity={clamp((t - 13.4) / 0.4)}>
            <line x1={left} x2={left + chars * size * 0.5} y1={top + lines.length * lh} y2={top + lines.length * lh} stroke={SC.mint} strokeWidth={3} />
            <text x={480} y={top + lines.length * lh + 28} textAnchor="middle" fontSize={15} fontWeight={800} fill={SC.mint}>45–75 characters: a short, sure trip back</text>
          </g>
        )}
        {t >= 17 && t < 29 && <Chip x={480} y={70} label={`Line height ${leading.toFixed(1)}`} ok={leading >= 1.4} />}
        {t >= 18.4 && t < 22.2 && <text x={480} y={490} textAnchor="middle" fontSize={15} fontWeight={800} fill={SC.error} opacity={clamp((t - 18.4) / 0.4)}>Tails touch capitals. The paragraph turns into a grey block.</text>}
        {t >= 23.6 && t < 29 && <text x={480} y={490} textAnchor="middle" fontSize={15} fontWeight={800} fill={SC.mint} opacity={clamp((t - 23.6) / 0.4)}>Room to breathe. The eye glides line to line.</text>}
      </g>

      {fin > 0 && [{ x: 200, n: '45–75 chars', l: 'Cap the text width', c: SC.discover }, { x: 480, n: 'Leading ≈ 1.5', l: 'For body text', c: SC.design }, { x: 760, n: 'Tighter for titles', l: 'About 1.1–1.3', c: SC.mint }].map((f, i) => {
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
