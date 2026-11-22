'use client';
// Scene for br.1-2: a shelf of look-alike meditation apps; a positioning map reveals an empty corner (quick + expert);
// Sukoon claims it in one sentence; then a personality of three traits, each with what it isn't, reshapes one screen.
// Pure function of t (0–34).
import { back, clamp, Grid, lerp, p, SC } from './shared';

const W = 960, H = 540;
const STATEMENT = 'For busy professionals who can’t switch off, Sukoon is the meditation app that fits calm into five minutes, unlike hour-long courses.';
/** Competitors on the map: x = session length (0 quick, 1 long), y = tone (0 playful, 1 expert). */
const RIVALS = [[0.2, 0.15], [0.35, 0.3], [0.7, 0.8], [0.8, 0.65], [0.6, 0.2], [0.85, 0.9], [0.3, 0.45], [0.75, 0.4], [0.55, 0.55]];
const TRAITS = [
  { n: 'Calm', not: 'not sleepy', c: SC.discover },
  { n: 'Warm', not: 'not cutesy', c: SC.design },
  { n: 'Expert', not: 'not preachy', c: SC.mint },
];

function wrap(text: string, n: number) {
  const out: string[] = []; let line = '';
  for (const w of text.split(' ')) { if (line && (line + ' ' + w).length > n) { out.push(line); line = w; } else line = line ? `${line} ${w}` : w; }
  if (line) out.push(line);
  return out;
}

export function PositioningScene({ t }: { t: number }) {
  const fin = p(t, 29, 29.8);
  const MX = 300, MY = 86, MW = 360, MH = 300;   // the map
  const typed = Math.round(STATEMENT.length * clamp((t - 12.4) / 3.4));
  const applied = p(t, 24.4, 25.6);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" role="img" aria-label="Animated story: finding an open position on a map and defining a brand personality">
      <rect width={W} height={H} fill={SC.soft} />
      <Grid />
      <g opacity={1 - fin}>
        {/* a shelf of look-alikes */}
        {t < 6.4 && (
          <g opacity={clamp(t / 0.5) * (1 - p(t, 5.8, 6.4))}>
            {Array.from({ length: 10 }, (_, i) => (
              <g key={i} transform={`translate(${130 + (i % 5) * 175} ${170 + Math.floor(i / 5) * 160}) scale(${clamp(back((t - i * 0.12) / 0.4))})`}>
                <rect x={-45} y={-45} width={90} height={90} rx={22} fill={['#60a5fa', '#a78bfa', '#34d399', '#f472b6', '#fbbf24'][i % 5]} opacity={0.75} />
                <circle r={18} fill="#fff" opacity={0.8} />
                <text y={70} textAnchor="middle" fontSize={12} fontWeight={700} fill={SC.muted}>simple · for everyone</text>
              </g>
            ))}
          </g>
        )}

        {/* the map */}
        {t >= 6 && t < 18.4 && (
          <g opacity={clamp((t - 6) / 0.5) * (1 - p(t, 17.8, 18.4))}>
            <rect x={MX} y={MY} width={MW} height={MH} rx={16} fill={SC.surface} stroke={SC.line} strokeWidth={2} />
            <line x1={MX + MW / 2} y1={MY} x2={MX + MW / 2} y2={MY + MH} stroke={SC.line} strokeDasharray="6 5" />
            <line x1={MX} y1={MY + MH / 2} x2={MX + MW} y2={MY + MH / 2} stroke={SC.line} strokeDasharray="6 5" />
            <text x={MX} y={MY + MH + 26} fontSize={13} fontWeight={800} fill={SC.muted}>Quick sessions</text>
            <text x={MX + MW} y={MY + MH + 26} textAnchor="end" fontSize={13} fontWeight={800} fill={SC.muted}>Long courses</text>
            <text x={MX - 14} y={MY + 14} textAnchor="end" fontSize={13} fontWeight={800} fill={SC.muted}>Expert</text>
            <text x={MX - 14} y={MY + MH} textAnchor="end" fontSize={13} fontWeight={800} fill={SC.muted}>Playful</text>
            {RIVALS.map(([x, y], i) => <circle key={i} cx={MX + x * MW} cy={MY + MH - y * MH} r={12} fill={SC.muted} opacity={0.55 * clamp((t - 6.6 - i * 0.1) / 0.3)} />)}
            {t >= 8.6 && <rect x={MX + 8} y={MY + 8} width={MW / 2 - 16} height={MH / 2 - 16} rx={12} fill={SC.mint} opacity={0.12 + 0.06 * Math.sin(t * 4)} stroke={SC.mint} strokeDasharray="6 5" />}
            {t >= 9.6 && (
              <g transform={`translate(${MX + 0.15 * MW} ${MY + MH - 0.85 * MH}) scale(${clamp(back((t - 9.6) / 0.5))})`}>
                <circle r={16} fill={SC.mint} />
                <text x={24} y={5} fontSize={15} fontWeight={800} fill={SC.text}>Sukoon</text>
              </g>
            )}
            {t >= 12.2 && (
              <g>
                <rect x={60} y={440} width={840} height={78} rx={14} fill={SC.surface} stroke={SC.mint} strokeWidth={2} />
                {wrap(STATEMENT.slice(0, typed), 92).map((l, i) => <text key={i} x={80} y={472 + i * 24} fontSize={15} fontWeight={700} fill={SC.text}>{l}</text>)}
              </g>
            )}
          </g>
        )}

        {/* personality */}
        {t >= 18 && t < 29.4 && (
          <g opacity={clamp((t - 18) / 0.5)}>
            {TRAITS.map((tr, i) => (
              <g key={tr.n} transform={`translate(${lerp(200 + i * 280, 150, applied)} ${lerp(200, 150 + i * 110, applied)}) scale(${clamp(back((t - 18.3 - i * 0.4) / 0.5)) * lerp(1, 0.75, applied)})`}>
                <rect x={-110} y={-56} width={220} height={112} rx={18} fill={SC.surface} stroke={tr.c} strokeWidth={3} />
                <text y={-6} textAnchor="middle" fontSize={26} fontWeight={800} fill={tr.c}>{tr.n}</text>
                <text y={26} textAnchor="middle" fontSize={15} fontWeight={700} fill={SC.muted}>{tr.not}</text>
              </g>
            ))}
            {applied > 0 && (
              <g opacity={applied}>
                {[{ x: 360, h: 'Generic', bg: '#ffffff', btn: '#ef4444', msg: '“You missed your session! 😱”', sub: 'Streak lost. Don’t give up!!!' }, { x: 640, h: 'Sukoon', bg: '#fdf6ec', btn: '#9a5f48', msg: '“Missed a day? That’s fine.”', sub: 'Five minutes whenever you’re ready.' }].map(s => (
                  <g key={s.h} transform={`translate(${s.x} 110)`}>
                    <text x={120} y={-12} textAnchor="middle" fontSize={13} fontWeight={800} fill={SC.muted}>{s.h}</text>
                    <rect width={240} height={300} rx={22} fill={s.bg} stroke={SC.line} strokeWidth={2} />
                    <text x={20} y={120} fontSize={15} fontWeight={800} fill="#1f2937">{s.msg}</text>
                    <text x={20} y={146} fontSize={12} fill="#6b7280">{s.sub}</text>
                    <rect x={20} y={230} width={200} height={44} rx={14} fill={s.btn} />
                    <text x={120} y={258} textAnchor="middle" fontSize={14} fontWeight={800} fill="#fff">{s.h === 'Sukoon' ? 'Breathe now' : 'START NOW'}</text>
                  </g>
                ))}
              </g>
            )}
          </g>
        )}
      </g>

      {fin > 0 && [{ x: 200, n: 'Own a space', l: 'For whom · unlike what', c: SC.discover }, { x: 480, n: 'A personality', l: 'Traits, and what they aren’t', c: SC.design }, { x: 760, n: 'Applied everywhere', l: 'Copy, colour, motion, errors', c: SC.mint }].map((f, i) => {
        const k = back((t - (29.2 + i * 0.25)) / 0.5);
        return (
          <g key={f.n} transform={`translate(${f.x} 260) scale(${clamp(k)})`}>
            <rect x={-125} y={-70} width={250} height={140} rx={18} fill={SC.surface} stroke={f.c} strokeWidth={3} />
            <text y={-8} textAnchor="middle" fontSize={22} fontWeight={800} fill={f.c}>{f.n}</text>
            <text y={26} textAnchor="middle" fontSize={13} fontWeight={600} fill={SC.text}>{f.l}</text>
          </g>
        );
      })}
    </svg>
  );
}
