'use client';
// Scene for ia.2-3: one orders screen through its moments. The perfect full list, then a new user's blank page, then
// empty, loading (pulsing skeleton), error and success designed properly, then a state map where the phone follows the
// highlighted state. Pure function of t (0–34).
import { back, clamp, Grid, lerp, p, SC } from './shared';

const W = 960, H = 540;
export type UiState = 'list' | 'blank' | 'empty' | 'loading' | 'error' | 'success';
/** Button fill that passes 4.5:1 with white text, in both themes. */
const GO = '#047857';

/** A 240 × 440 phone showing the orders screen in one state. `t` drives the skeleton's pulse. `copy` ("title|sub|button")
 *  replaces the wording of the empty, error and success states; `header` is the screen title. Shared with the Pick the state game. */
export function PhoneState({ state, t = 0, copy, header = 'Your orders' }: { state: UiState; t?: number; copy?: string; header?: string }) {
  const DEF: Partial<Record<UiState, string>> = { empty: 'No orders yet|Your lunches will show up here.|Browse this week’s menu', error: 'Couldn’t load your orders|Check your connection.|Try again', success: 'Order placed|Arrives at 12:30' };
  const [title, sub, cta] = (copy ?? DEF[state] ?? '').split('|');
  const pulse = 0.45 + 0.35 * Math.sin(t * 5);
  const list = state === 'list' || state === 'success';
  return (
    <g>
      <rect width={240} height={440} rx={30} fill={SC.surface} stroke={SC.text} strokeOpacity={0.5} strokeWidth={3} />
      <rect x={95} y={14} width={50} height={6} rx={3} fill={SC.line} />
      {state !== 'blank' && <text x={22} y={58} fontSize={18} fontWeight={800} fill={SC.text}>{header}</text>}
      {list && [0, 1, 2, 3].map(k => (
        <g key={k} transform={`translate(22 ${80 + k * 80})`}>
          <rect width={56} height={56} rx={10} fill={['#fcd34d', '#a7f3d0', '#fca5a5', '#93c5fd'][k]} />
          <rect x={68} y={10} width={110} height={10} rx={5} fill={SC.text} opacity={0.75} />
          <rect x={68} y={32} width={70} height={9} rx={4} fill={SC.muted} opacity={0.6} />
        </g>
      ))}
      {state === 'empty' && (
        <g>
          <ellipse cx={120} cy={170} rx={52} ry={20} fill={SC.line} />
          <path d="M68 166 Q120 236 172 166" fill={SC.soft} stroke={SC.muted} strokeWidth={2.5} />
          <text x={120} y={262} textAnchor="middle" fontSize={17} fontWeight={800} fill={SC.text}>{title}</text>
          <text x={120} y={286} textAnchor="middle" fontSize={12} fill={SC.muted}>{sub}</text>
          <rect x={30} y={312} width={180} height={42} rx={12} fill={GO} />
          <text x={120} y={338} textAnchor="middle" fontSize={13} fontWeight={800} fill="#fff">{cta}</text>
        </g>
      )}
      {state === 'loading' && [0, 1, 2, 3].map(k => (
        <g key={k} transform={`translate(22 ${80 + k * 80})`} opacity={pulse}>
          <rect width={56} height={56} rx={10} fill={SC.line} />
          <rect x={68} y={10} width={110} height={10} rx={5} fill={SC.line} />
          <rect x={68} y={32} width={70} height={9} rx={4} fill={SC.line} />
        </g>
      ))}
      {state === 'error' && (
        <g>
          <circle cx={120} cy={170} r={34} fill={SC.error} opacity={0.15} />
          <text x={120} y={184} textAnchor="middle" fontSize={40} fontWeight={800} fill={SC.error}>!</text>
          <text x={120} y={250} textAnchor="middle" fontSize={16} fontWeight={800} fill={SC.text}>{title}</text>
          <text x={120} y={274} textAnchor="middle" fontSize={12} fill={SC.muted}>{sub}</text>
          <rect x={40} y={300} width={160} height={42} rx={12} fill="none" stroke={SC.text} strokeWidth={2} />
          <text x={120} y={326} textAnchor="middle" fontSize={14} fontWeight={800} fill={SC.text}>{cta}</text>
        </g>
      )}
      {state === 'success' && (
        <g>
          <rect x={14} y={372} width={212} height={50} rx={14} fill="#1f2937" />
          <circle cx={40} cy={397} r={11} fill={SC.mint} />
          <path d="M34 397 l4 4 l8 -8" fill="none" stroke="#fff" strokeWidth={2.5} strokeLinecap="round" />
          <text x={60} y={393} fontSize={12} fontWeight={800} fill="#fff">{title}</text>
          <text x={60} y={410} fontSize={11} fill="#d1d5db">{sub}</text>
        </g>
      )}
    </g>
  );
}

const NODES: { id: UiState; l: string; x: number; y: number }[] = [
  { id: 'loading', l: 'Loading', x: 560, y: 270 },
  { id: 'empty', l: 'Empty', x: 790, y: 130 },
  { id: 'list', l: 'List', x: 790, y: 270 },
  { id: 'error', l: 'Error', x: 790, y: 410 },
];

export function UiStatesScene({ t }: { t: number }) {
  const fin = p(t, 29, 29.8);
  const map = p(t, 25.8, 26.8);
  const cycle: UiState[] = ['loading', 'empty', 'loading', 'list', 'loading', 'error'];
  const ci = Math.max(0, Math.min(cycle.length - 1, Math.floor((t - 26.4) / 0.42)));
  const state: UiState = t < 3 ? 'list' : t < 6 ? 'blank' : t < 12 ? 'empty' : t < 17 ? 'loading' : t < 22 ? 'error' : t < 26.4 ? 'success' : cycle[ci];
  const px = lerp(360, 150, map);
  const tag = t < 3 ? 'The mock-up' : t < 6 ? 'A new user sees…' : t < 12 ? 'Empty' : t < 17 ? 'Loading' : t < 22 ? 'Error' : 'Success';

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" role="img" aria-label="Animated story: one screen designed for its empty, loading, error and success states">
      <rect width={W} height={H} fill={SC.soft} />
      <Grid />
      <g opacity={1 - fin}>
        <g transform={`translate(${px} 50)`}><PhoneState state={state} t={t} /></g>
        {state === 'blank' && <text x={px + 120} y={280} textAnchor="middle" fontSize={44} fontWeight={800} fill={SC.muted} opacity={clamp((t - 3.6) / 0.5) * 0.6}>?</text>}
        {t < 26 && (
          <text key={tag} x={px + 120} y={518} textAnchor="middle" fontSize={17} fontWeight={800} fill={t < 6 ? SC.muted : SC.mint} opacity={1 - map}>{tag}</text>
        )}
        {t >= 6 && t < 26 && (
          <g opacity={1 - map}>
            {['Empty', 'Loading', 'Error', 'Success'].map((s, i) => {
              const on = tag === s, done = ['Empty', 'Loading', 'Error', 'Success'].indexOf(tag) > i;
              return (
                <g key={s} transform={`translate(700 ${150 + i * 64})`}>
                  <rect x={-80} y={-22} width={160} height={44} rx={22} fill={on ? SC.mint : SC.surface} fillOpacity={on ? 0.18 : 1} stroke={on || done ? SC.mint : SC.line} strokeWidth={2} />
                  <text y={6} textAnchor="middle" fontSize={15} fontWeight={800} fill={on || done ? SC.text : SC.muted}>{s}</text>
                </g>
              );
            })}
          </g>
        )}

        {/* the state map */}
        {map > 0 && (
          <g opacity={map}>
            {NODES.slice(1).map(n => <line key={n.id} x1={620} y1={270} x2={n.x - 64} y2={n.y} stroke={SC.muted} strokeWidth={2} />)}
            <path d="M740 430 C640 470 560 420 560 300" fill="none" stroke={SC.design} strokeWidth={2.5} strokeDasharray="6 5" />
            <text x={604} y={470} fontSize={13} fontWeight={800} fill={SC.design}>Try again</text>
            {NODES.map(n => {
              const on = state === n.id || (n.id === 'list' && state === 'success');
              return (
                <g key={n.id} transform={`translate(${n.x} ${n.y}) scale(${clamp(back((t - 26 - NODES.indexOf(n) * 0.2) / 0.4))})`}>
                  <rect x={-64} y={-24} width={128} height={48} rx={24} fill={SC.surface} stroke={on ? SC.mint : SC.line} strokeWidth={on ? 3.5 : 2} />
                  <text y={6} textAnchor="middle" fontSize={15} fontWeight={800} fill={SC.text}>{n.l}</text>
                </g>
              );
            })}
            <text x={790} y={318} textAnchor="middle" fontSize={12} fontWeight={700} fill={SC.muted}>then Success when they act</text>
          </g>
        )}
      </g>

      {fin > 0 && [{ x: 200, n: 'Empty', l: 'What goes here, how to start', c: SC.discover }, { x: 480, n: 'Loading · Error', l: 'Progress, then what to do', c: SC.design }, { x: 760, n: 'Success', l: 'What changed, what’s next', c: SC.mint }].map((f, i) => {
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
