'use client';
// Scene for fd.3-3: Ananya presents Kosh's split-the-bill flow. Rahul couldn't find the uneven split; her pulse spikes
// and the defence comes out, and the room's other comments fade. Rewind: she listens, asks where he expected it, says it
// back, logs it, and after the session sorts the log into act / test / park. Pure function of t (0–34).
import { back, clamp, Grid, lerp, p, SC } from './shared';

const W = 960, H = 540;
const PX = 50, PY = 60;
/** Button fill that carries white text at 5.6:1 in both themes. */
const GO = '#047857';

function SplitScreen({ look }: { look: number }) {
  return (
    <g>
      <rect width={240} height={440} rx={30} fill={SC.surface} stroke={SC.text} strokeOpacity={0.5} strokeWidth={3} />
      <rect x={95} y={14} width={50} height={6} rx={3} fill={SC.line} />
      <text x={22} y={52} fontSize={17} fontWeight={800} fill={SC.text}>Split the bill</text>
      <text x={22} y={86} fontSize={10} fill={SC.muted}>Dinner at Toit</text>
      <text x={22} y={118} fontSize={28} fontWeight={800} fill={SC.text}>₹1,200</text>
      {look > 0 && <rect x={12} y={92} width={216} height={40} rx={10} fill="none" stroke={SC.design} strokeWidth={3} strokeDasharray="7 5" opacity={look} />}
      {['Rahul', 'Meera', 'You'].map((n, k) => (
        <g key={n} transform={`translate(22 ${160 + k * 48})`}>
          <circle cx={14} cy={14} r={14} fill={['#93c5fd', '#fcd34d', '#a7f3d0'][k]} />
          <text x={38} y={19} fontSize={12} fontWeight={700} fill={SC.text}>{n}</text>
          <text x={196} y={19} textAnchor="end" fontSize={12} fontWeight={700} fill={SC.text}>₹400</text>
        </g>
      ))}
      <text x={22} y={318} fontSize={9} fill={SC.muted} opacity={0.7}>More options ›</text>
      <rect x={14} y={372} width={212} height={44} rx={12} fill={GO} />
      <text x={120} y={399} textAnchor="middle" fontSize={14} fontWeight={800} fill="#fff">Send requests</text>
    </g>
  );
}

/** A speech bubble anchored at its left (or right) edge. */
function Say({ x, y, w, lines, k, side = 'left', tone = SC.line, who }: { x: number; y: number; w: number; lines: string[]; k: number; side?: 'left' | 'right'; tone?: string; who?: string }) {
  const h = 22 + lines.length * 20, x0 = side === 'left' ? x : x - w;
  return (
    <g transform={`translate(${x} ${y}) scale(${clamp(k)}) translate(${-x} ${-y})`}>
      <rect x={x0} y={y - h / 2} width={w} height={h} rx={16} fill={SC.surface} stroke={tone} strokeWidth={2.5} />
      {who && <text x={x0 + 16} y={y - h / 2 - 8} fontSize={12} fontWeight={800} fill={SC.muted}>{who}</text>}
      {lines.map((l, i) => <text key={i} x={x0 + 16} y={y - h / 2 + 25 + i * 20} fontSize={15} fontWeight={i === 0 ? 700 : 600} fill={SC.text}>{l}</text>)}
    </g>
  );
}

/** Ananya's pulse: a scrolling heartbeat whose spikes grow with `stress` (0–1). */
function Pulse({ t, stress, x, y }: { t: number; stress: number; x: number; y: number }) {
  const amp = 6 + stress * 30, period = lerp(70, 34, stress), shift = (t * 90) % period;
  const pts: string[] = [];
  for (let i = 0; i <= 240; i += 4) {
    const ph = ((i + shift) % period) / period;
    const v = ph > 0.42 && ph < 0.5 ? -amp : ph >= 0.5 && ph < 0.58 ? amp * 0.6 : 0;
    pts.push(`${x + i},${y + v}`);
  }
  return (
    <g>
      <polyline points={pts.join(' ')} fill="none" stroke={stress > 0.5 ? SC.error : SC.mint} strokeWidth={2.5} strokeLinejoin="round" />
      <text x={x} y={y - 42} fontSize={12} fontWeight={800} fill={SC.muted}>Ananya’s pulse</text>
    </g>
  );
}

const LOG = [
  { c: 'Uneven split: show it by the amount', tag: 'Act', tone: SC.mint },
  { c: 'Request sent: confirmation is easy to miss', tag: 'Act', tone: SC.mint },
  { c: 'Pie chart for shares', tag: 'Test', tone: SC.design },
  { c: 'Dark mode', tag: 'Park: app-wide, next quarter', tone: SC.muted },
];

export function ReceiveCritiqueScene({ t }: { t: number }) {
  const fin = p(t, 29, 29.8);
  const stress = t < 3.6 ? p(t, 1.6, 3.6) * 0.5 : t < 9 ? lerp(0.5, 1, p(t, 3.8, 5)) : lerp(1, 0, p(t, 9.2, 12));
  const strike = p(t, 7.6, 8.4);
  const rewind = t >= 8.4 && t < 9.4;
  const log = p(t, 20.6, 21.2);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" role="img" aria-label="Animated story: a designer hears critique, starts to defend, then listens, asks, says it back and logs it">
      <rect width={W} height={H} fill={SC.soft} />
      <Grid />
      <g opacity={1 - fin}>
        <g transform={`translate(${PX} ${PY})`}><SplitScreen look={p(t, 16.6, 17.2) * (1 - p(t, 23.6, 24))} /></g>

        {/* the comment */}
        {t < 24 && <Say x={340} y={92} w={430} lines={['I couldn’t find how to split', 'the bill unevenly.']} k={back((t - 0.4) / 0.45)} who="Rahul" />}

        {/* the reflex, struck; the room goes quiet */}
        {t >= 4 && t < 9.4 && (
          <g opacity={1 - p(t, 8.8, 9.4)}>
            <Say x={910} y={200} w={430} side="right" tone={SC.error} lines={['But it’s right there under More', 'options. I followed the guidelines.']} k={back((t - 4) / 0.45)} who="Ananya" />
            {strike > 0 && [189, 209].map(y => <line key={y} x1={496} x2={lerp(496, 892, strike)} y1={y} y2={y} stroke={SC.error} strokeWidth={3} />)}
            {['Meera', 'Vikram'].map((n, i) => (
              <g key={n} opacity={clamp((t - 5.4 - i * 0.4) / 0.4) * (1 - p(t, 6.8, 7.4))}>
                <rect x={360 + i * 140} y={262} width={120} height={36} rx={18} fill={SC.surface} stroke={SC.line} strokeWidth={2} />
                <text x={420 + i * 140} y={285} textAnchor="middle" fontSize={13} fontWeight={700} fill={SC.muted}>{n}: “…”</text>
              </g>
            ))}
            {t >= 7 && <text x={500} y={326} textAnchor="middle" fontSize={14} fontWeight={700} fill={SC.muted} opacity={clamp((t - 7) / 0.4)}>The room stops giving feedback.</text>}
          </g>
        )}
        {rewind && <text x={640} y={300} textAnchor="middle" fontSize={34} fontWeight={800} fill={SC.text} opacity={Math.sin(((t - 8.4) / 1) * Math.PI)}>◀◀ Rewind</text>}

        {/* listen: one slow breath */}
        {t >= 9.4 && t < 14 && (
          <g opacity={clamp((t - 9.4) / 0.4) * (1 - p(t, 13.4, 14))}>
            <circle cx={640} cy={240} r={30 + 22 * Math.sin(clamp((t - 9.6) / 3.6) * Math.PI)} fill={SC.mint} opacity={0.18} />
            <text x={640} y={246} textAnchor="middle" fontSize={16} fontWeight={800} fill={SC.text}>Listen to the end</text>
          </g>
        )}

        {/* ask, answer, say it back */}
        {t >= 14 && t < 24 && (
          <g opacity={1 - p(t, 23.4, 24)}>
            <Say x={910} y={190} w={380} side="right" tone={SC.mint} lines={['Where did you expect to find it?']} k={back((t - 14.2) / 0.45)} who="Ananya" />
            {t >= 15.8 && <Say x={340} y={262} w={430} lines={['Next to the amount, where I', 'typed ₹1,200.']} k={back((t - 15.8) / 0.45)} who="Rahul" />}
            {t >= 19 && <Say x={910} y={346} w={500} side="right" tone={SC.mint} lines={['So uneven splits need to show', 'where the amount is. Noted.']} k={back((t - 19) / 0.45)} who="Ananya" />}
          </g>
        )}

        {/* the critique log, then act / test / park */}
        {t >= 20.6 && (
          <g transform={`translate(0 ${lerp(30, 0, log)})`} opacity={log}>
            {(() => {
              const top = t < 24 ? 430 : lerp(430, 130, p(t, 24, 24.8));
              const rows = t < 24 ? 1 : LOG.length;
              return (
                <g>
                  <rect x={340} y={top - 34} width={570} height={30 + rows * 46} rx={16} fill={SC.surface} stroke={SC.line} strokeWidth={2} />
                  <text x={360} y={top - 12} fontSize={13} fontWeight={800} fill={SC.muted}>Critique log</text>
                  {LOG.slice(0, rows).map((r, i) => {
                    const tagK = p(t, 25.4 + i * 0.6, 25.8 + i * 0.6);
                    return (
                      <g key={r.c} opacity={i === 0 ? 1 : clamp((t - 24.6 - i * 0.2) / 0.3)}>
                        <text x={360} y={top + 22 + i * 46} fontSize={14} fontWeight={700} fill={SC.text}>{r.c}</text>
                        {tagK > 0 && (
                          <g transform={`translate(890 ${top + 17 + i * 46}) scale(${clamp(back(tagK))})`}>
                            <rect x={-(r.tag.length * 7 + 20)} y={-14} width={r.tag.length * 7 + 20} height={28} rx={14} fill="none" stroke={r.tone} strokeWidth={2} />
                            <text x={-(r.tag.length * 7 + 20) / 2} y={5} textAnchor="middle" fontSize={12} fontWeight={800} fill={SC.text}>{r.tag}</text>
                          </g>
                        )}
                      </g>
                    );
                  })}
                  {t >= 24.6 && <text x={625} y={top + 30 + rows * 46 + 26} textAnchor="middle" fontSize={14} fontWeight={700} fill={SC.muted} opacity={clamp((t - 24.6) / 0.4)}>After the session, against the goal: act, test or park.</text>}
                </g>
              );
            })()}
          </g>
        )}

        {t < 20.4 && <g opacity={1 - p(t, 19.6, 20.2)}><Pulse t={t} stress={stress} x={340} y={470} /></g>}
      </g>

      {fin > 0 && [{ x: 200, n: 'Listen', l: 'To the end, no defence', c: SC.mint }, { x: 480, n: 'Ask', l: 'Then say it back', c: SC.design }, { x: 760, n: 'Log', l: 'Decide later, against the goal', c: SC.discover }].map((f, i) => {
        const k = back((t - (29.2 + i * 0.25)) / 0.5);
        return (
          <g key={f.n} transform={`translate(${f.x} 260) scale(${clamp(k)})`}>
            <rect x={-125} y={-70} width={250} height={140} rx={18} fill={SC.surface} stroke={f.c} strokeWidth={3} />
            <text y={-8} textAnchor="middle" fontSize={24} fontWeight={800} fill={SC.text}>{f.n}</text>
            <text y={26} textAnchor="middle" fontSize={13} fontWeight={600} fill={SC.muted}>{f.l}</text>
          </g>
        );
      })}
    </svg>
  );
}
