'use client';
// Scene for st.3-2: Kahaani launches Apni Awaaz, recording a story in your own voice, and posts “12,000 recordings
// since launch!”. In Vizag, Lakshmi starts the monkey and the crocodile three times, and each time the screen locks and
// the recording stops. Tara draws the HEART grid (goals from `AWAAZ_GOALS`); the total fits no row. Goals fill first,
// then signals, then metrics, all from `AWAAZ_HEART`, and the task-success row lights up at 41% saved and 14 minutes.
// Recording keeps going when the screen locks, and the save rate climbs to 78%. `HEART_FILL` and `HEART_NAME` are
// shared with the Fill the HEART grid game. Pure function of t (0–36).
import { AWAAZ_GOALS, AWAAZ_HEART, HEART, type AwaazLine, type HeartDim } from '@shape/content';
import { back, clamp, Grid, lerp, p, SC } from './shared';
import { INK } from './EaseCurves';
import { KAHAANI } from './MetricTree';

const W = 960, H = 540;
/** Row colours; white on each passes 4.5:1. */
export const HEART_FILL: Record<HeartDim, string> = { happiness: '#C11574', engagement: '#155EEF', adoption: '#067647', retention: '#6941C6', task: '#B54708' };
export const HEART_NAME: Record<HeartDim, string> = { happiness: 'Happiness', engagement: 'Engagement', adoption: 'Adoption', retention: 'Retention', task: 'Task success' };
/** The signal and the metric line for each row. */
export const HEART_LINES: Record<HeartDim, { signal: AwaazLine; metric: AwaazLine }> = {
  happiness: { signal: 'hsig', metric: 'hmet' }, engagement: { signal: 'esig', metric: 'emet' }, adoption: { signal: 'asig', metric: 'amet' },
  retention: { signal: 'rsig', metric: 'rmet' }, task: { signal: 'tsig', metric: 'tmet' },
};

/** Word-wraps a line into at most `rows` rows of about `n` characters. */
const wrap = (s: string, n: number, rows = 2) => {
  const out: string[] = [];
  for (const w of s.split(' ')) {
    const last = out[out.length - 1];
    if (last !== undefined && (last + ' ' + w).length <= n) out[out.length - 1] = last + ' ' + w;
    else out.push(w);
  }
  return out.length > rows ? [...out.slice(0, rows - 1), out.slice(rows - 1).join(' ').slice(0, n - 1) + '…'] : out;
};

const ROW_Y = 118, ROW_H = 66, COLS = [{ x: 190, w: 240 }, { x: 440, w: 240 }, { x: 690, w: 240 }];

function Cell({ x, y, w, text, k, tone = SC.text }: { x: number; y: number; w: number; text: string; k: number; tone?: string }) {
  return (
    <g opacity={k}>
      <rect x={x} y={y} width={w} height={ROW_H - 8} rx={10} fill={SC.surface} stroke={SC.line} />
      {wrap(text, 34).map((r, i) => <text key={i} x={x + 10} y={y + 24 + i * 16} fontSize={11.5} fontWeight={800} fill={tone}>{r}</text>)}
    </g>
  );
}

export function HeartGoalsScene({ t }: { t: number }) {
  const intro = clamp(back(t / 0.6));
  const story = t < 11.6 ? 1 - p(t, 11, 11.6) : 0;
  const grid = t >= 11 ? p(t, 11.3, 12) : 0;
  const tries = t < 7 ? 0 : t < 8.4 ? 1 : t < 9.8 ? 2 : 3;
  const saved = lerp(41, 78, p(t, 32.5, 34.5));

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" role="img" aria-label="Animated story: Kahaani's launch post counts 12,000 recordings, while a grandmother's recordings stop each time her screen locks; the team fills a HEART grid with a goal, a signal and a metric for each row, finds only 41% of recordings get saved, keeps recording when the screen locks, and the save rate rises to 78%">
      <rect width={W} height={H} fill={SC.soft} />
      <Grid />
      <g opacity={intro}>
        {story > 0 && (
          <g opacity={story}>
            <g transform="translate(60 70)">
              <rect width={360} height={200} rx={20} fill={KAHAANI} />
              <text x={28} y={50} fontSize={15} fontWeight={800} fill="#E9D7FE">Kahaani team · launch week</text>
              <text x={28} y={104} fontSize={44} fontWeight={900} fill="#FFFFFF">12,000</text>
              <text x={28} y={140} fontSize={18} fontWeight={900} fill="#FFFFFF">recordings since launch!</text>
              <text x={28} y={176} fontSize={13} fontWeight={800} fill="#E9D7FE">Apni Awaaz: record a story in your own voice</text>
            </g>
            {t >= 5.6 && (
              <g transform="translate(520 50)" opacity={p(t, 5.8, 6.5)}>
                <rect width={300} height={440} rx={34} fill="#101828" />
                <rect x={14} y={14} width={272} height={412} rx={24} fill="#FFFFFF" />
                <text x={150} y={58} textAnchor="middle" fontSize={13} fontWeight={800} fill="#475467">Lakshmi · Vizag</text>
                <text x={150} y={86} textAnchor="middle" fontSize={16} fontWeight={900} fill={INK}>The monkey and the crocodile</text>
                {Array.from({ length: 22 }, (_, i) => {
                  const h = 10 + 26 * Math.abs(Math.sin(i * 1.7 + t * 4)) * (tries < 3 ? 1 : 0.15);
                  return <rect key={i} x={40 + i * 10} y={170 - h / 2} width={6} height={h} rx={3} fill={tries >= 1 && (t % 1.4) > 0.9 ? '#D0D5DD' : KAHAANI} />;
                })}
                {tries > 0 && (
                  <g transform="translate(36 228)">
                    <rect width={228} height={64} rx={14} fill="#FEF3F2" stroke="#B42318" />
                    <text x={114} y={28} textAnchor="middle" fontSize={14} fontWeight={900} fill="#B42318">Screen locked. Recording stopped.</text>
                    <text x={114} y={50} textAnchor="middle" fontSize={12} fontWeight={800} fill="#B42318">Attempt {tries} of 3</text>
                  </g>
                )}
                {t >= 10 && <text x={150} y={340} textAnchor="middle" fontSize={14} fontWeight={900} fill={INK} opacity={p(t, 10, 10.5)}>She gives up.</text>}
                <circle cx={150} cy={386} r={22} fill="#B42318" />
              </g>
            )}
          </g>
        )}

        {grid > 0 && (
          <g opacity={grid}>
            <text x={30} y={50} fontSize={22} fontWeight={900} fill={SC.text}>
              {t < 16 ? 'HEART: five kinds of experience' : t < 21 ? 'Goals first, in words' : t < 26 ? 'Then signals you could notice' : t < 31 ? 'Then metrics that can fall' : 'Fix it, and measure the fix'}
            </text>
            {['Goal', 'Signal', 'Metric'].map((h, i) => <text key={h} x={COLS[i].x + 10} y={100} fontSize={13} fontWeight={900} fill={SC.muted}>{h}</text>)}
            {HEART.map((d, r) => {
              const y = ROW_Y + r * ROW_H, focus = t >= 26 && t < 31.5 && d === 'task';
              return (
                <g key={d} opacity={p(t, 11.6 + r * 0.3, 12.1 + r * 0.3)}>
                  <rect x={30} y={y} width={150} height={ROW_H - 8} rx={10} fill={HEART_FILL[d]} />
                  <text x={44} y={y + 34} fontSize={15} fontWeight={900} fill="#FFFFFF">{HEART_NAME[d]}</text>
                  <Cell x={COLS[0].x} y={y} w={COLS[0].w} text={AWAAZ_GOALS[d]} k={p(t, 16.2 + r * 0.6, 16.8 + r * 0.6)} />
                  <Cell x={COLS[1].x} y={y} w={COLS[1].w} text={AWAAZ_HEART[HEART_LINES[d].signal].text} k={p(t, 21.2 + r * 0.6, 21.8 + r * 0.6)} />
                  <Cell x={COLS[2].x} y={y} w={COLS[2].w} text={AWAAZ_HEART[HEART_LINES[d].metric].text} k={p(t, 26.2 + r * 0.5, 26.8 + r * 0.5) * (d === 'task' && t >= 28.6 ? 0 : 1)} />
                  {focus && t >= 28.6 && (
                    <g opacity={p(t, 28.6, 29.2)}>
                      <rect x={COLS[2].x} y={y} width={COLS[2].w} height={ROW_H - 8} rx={10} fill="#FEF3F2" stroke="#B42318" strokeWidth={2} />
                      <text x={COLS[2].x + 12} y={y + 25} fontSize={15} fontWeight={900} fill="#B42318">41% of recordings saved</text>
                      <text x={COLS[2].x + 12} y={y + 45} fontSize={13} fontWeight={800} fill="#B42318">median 14 minutes to save one</text>
                    </g>
                  )}
                </g>
              );
            })}
            {t >= 12 && t < 16 && (
              <g transform={`translate(${lerp(760, 720, Math.sin(t * 14) * 0.5 + 0.5)} 66)`} opacity={p(t, 12.6, 13.2) * (1 - p(t, 15, 15.8))}>
                <rect width={210} height={34} rx={17} fill="#475467" />
                <text x={105} y={22} textAnchor="middle" fontSize={12.5} fontWeight={900} fill="#FFFFFF">12,000 since launch: no row</text>
              </g>
            )}
            {t >= 31.5 && (
              <g transform="translate(690 118)" opacity={p(t, 31.5, 32.2)}>
                <rect width={240} height={250} rx={14} fill={SC.surface} stroke={HEART_FILL.task} strokeWidth={2} />
                <text x={16} y={30} fontSize={13} fontWeight={900} fill={SC.text}>Fix: keep recording</text>
                <text x={16} y={48} fontSize={13} fontWeight={900} fill={SC.text}>when the screen locks</text>
                <rect x={16} y={70} width={208} height={22} rx={11} fill={SC.soft} />
                <rect x={16} y={70} width={208 * saved / 100} height={22} rx={11} fill={HEART_FILL.task} />
                <text x={16} y={128} fontSize={38} fontWeight={900} fill={SC.text}>{Math.round(saved)}%</text>
                <text x={16} y={152} fontSize={12} fontWeight={800} fill={SC.muted}>of recordings saved, next week</text>
                <text x={16} y={200} fontSize={12.5} fontWeight={900} fill={SC.text} opacity={p(t, 34.6, 35.2)}>Lakshmi’s story plays</text>
                <text x={16} y={218} fontSize={12.5} fontWeight={900} fill={SC.text} opacity={p(t, 34.6, 35.2)}>in Kondapur tonight.</text>
              </g>
            )}
          </g>
        )}
      </g>
    </svg>
  );
}
