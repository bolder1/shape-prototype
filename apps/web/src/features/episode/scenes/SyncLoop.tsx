'use client';
// Scene for ds.5-3: Figma shows Sawari's plum as 600 and the code ships 700, and the first nightly check finds 47
// differences (`DRIFTS_FOUND`). Then a source for each kind of thing (`SYNC_SOURCES`), tokens flowing out of one JSON
// source to Figma variables and three platforms, Code Connect keeping property names honest, the nightly diff, the two
// rules (`syncMove`), and one version for both sides (`SYNCED_VERSION`). Pure function of t (0–36). Also exports
// `MOVE_FILL`, which `sync-flow` uses.
import { DRIFTS_FOUND, DRIFTS_LEFT, SAWARI_RAMPS, SYNCED_VERSION, type SyncMove } from '@shape/content';
import { back, clamp, Grid, lerp, p, SC } from './shared';

const W = 640, H = 360;
/** One fill per sync move; white text on each passes 4.5:1. */
export const MOVE_FILL: Record<SyncMove, string> = { 'to-code': '#175CD3', 'to-figma': '#6941C6', revert: '#B42318' };
const MONO = 'ui-monospace, SFMono-Regular, Menlo, monospace';

/** A labelled box. */
function Box({ x, y, w, h, label, sub, stroke, o = 1 }: { x: number; y: number; w: number; h: number; label: string; sub?: string; stroke?: string; o?: number }) {
  return (
    <g opacity={o}>
      <rect x={x} y={y} width={w} height={h} rx={12} fill={SC.surface} stroke={stroke ?? SC.line} strokeWidth={stroke ? 3 : 2} />
      <text x={x + w / 2} y={y + (sub ? h / 2 - 4 : h / 2 + 8)} fontSize={22} fontWeight={900} fill={SC.text} textAnchor="middle">{label}</text>
      {sub && <text x={x + w / 2} y={y + h / 2 + 24} fontSize={21} fontWeight={700} fill={SC.muted} textAnchor="middle">{sub}</text>}
    </g>
  );
}

/** A dot travelling from (x1, y1) to (x2, y2) as k goes 0 → 1, on a faint line. */
function Flow({ x1, y1, x2, y2, k, c }: { x1: number; y1: number; x2: number; y2: number; k: number; c: string }) {
  return (
    <g>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={c} strokeWidth={3} strokeDasharray="6 6" opacity={0.6} />
      <circle cx={lerp(x1, x2, k)} cy={lerp(y1, y2, k)} r={8} fill={c} opacity={k > 0 && k < 1 ? 1 : 0} />
    </g>
  );
}

export function SyncLoopScene({ t }: { t: number }) {
  const intro = clamp(back(t / 0.6));
  const title = t < 6 ? 'Two truths' : t < 11 ? 'A source for each thing' : t < 16 ? 'Tokens flow out' : t < 21 ? 'Code beside the component' : t < 26 ? 'Every night, a diff' : t < 31 ? 'Catch up, or revert' : 'One version';

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" role="img" aria-label={`Animated story: Figma shows Sawari's primary colour as plum-600 while the app ships plum-700, and the first nightly check finds ${DRIFTS_FOUND} differences between the library and the code. Each kind of thing gets a source of truth: token values in the tokens repository, a component's API in the code, new designs in Figma once an RFC is approved. One JSON source builds Figma's variables and CSS, Compose and Swift for both brands in light and dark. Code Connect shows the real component code next to the Figma component. Every night a check compares the two and names the side that must move. If the source has a change, the side that's behind catches up; if not, it is reverted where it was made. Version ${SYNCED_VERSION} ships to Figma, npm, Maven and the Swift package on the same day, and the differences fall from ${DRIFTS_FOUND} to ${DRIFTS_LEFT}.`}>
      <rect width={W} height={H} fill={SC.soft} />
      <Grid w={W} h={H} />
      <g opacity={intro}>
        <text x={32} y={44} fontSize={26} fontWeight={900} fill={SC.text}>{title}</text>

        {t < 6 && (
          <g>
            {([{ x: 32, s: 600, label: 'Figma' }, { x: 368, s: 700, label: 'Shipped app' }] as const).map((b, i) => (
              <g key={b.label} opacity={p(t, 0.3 + i * 0.6, 0.9 + i * 0.6)}>
                <rect x={b.x} y={76} width={240} height={170} rx={14} fill={SC.surface} stroke={SC.line} strokeWidth={2} />
                <text x={b.x + 120} y={112} fontSize={22} fontWeight={900} fill={SC.text} textAnchor="middle">{b.label}</text>
                <rect x={b.x + 30} y={132} width={180} height={56} rx={12} fill={SAWARI_RAMPS.plum[b.s]} />
                <text x={b.x + 120} y={168} fontSize={22} fontWeight={900} fill="#fff" textAnchor="middle">Book seat</text>
                <text x={b.x + 120} y={226} fontSize={21} fontWeight={700} fill={SC.muted} textAnchor="middle">plum-{b.s}</text>
              </g>
            ))}
            <text x={320} y={180} fontSize={44} fontWeight={900} fill={SC.error} textAnchor="middle" opacity={p(t, 1.8, 2.3)}>≠</text>
            <text x={320} y={300} fontSize={22} fontWeight={900} fill={SC.text} textAnchor="middle" opacity={p(t, 2.8, 3.4)}>First nightly check: {Math.round(lerp(0, DRIFTS_FOUND, p(t, 2.8, 4.6)))} differences</text>
          </g>
        )}

        {t >= 6 && t < 11 && (
          <g>
            {[
              { what: 'Token values', where: 'The tokens repo' },
              { what: 'Component API', where: 'The code' },
              { what: 'New designs', where: 'Figma, after an RFC' },
            ].map((r, i) => (
              <g key={r.what} opacity={p(t, 6.3 + i * 0.7, 6.9 + i * 0.7)}>
                <rect x={32} y={72 + i * 88} width={576} height={72} rx={12} fill={SC.surface} stroke={SC.line} strokeWidth={2} />
                <text x={56} y={116 + i * 88} fontSize={22} fontWeight={900} fill={SC.text}>{r.what}</text>
                <path d={`M250 ${108 + i * 88} h40 m-10 -9 l10 9 l-10 9`} fill="none" stroke={SC.muted} strokeWidth={3} />
                <text x={308} y={116 + i * 88} fontSize={22} fontWeight={800} fill={SC.text}>{r.where}</text>
              </g>
            ))}
          </g>
        )}

        {t >= 11 && t < 16 && (() => {
          const k = (t - 11.6) % 1.6 / 1.6;
          const outs = [{ x: 32, w: 150, s: 'Figma vars' }, { x: 198, w: 120, s: 'CSS' }, { x: 334, w: 140, s: 'Compose' }, { x: 490, w: 118, s: 'Swift' }];
          return (
            <g>
              <Box x={200} y={66} w={240} h={70} label="tokens.json" sub="2 brands × 2 modes" stroke={MOVE_FILL['to-figma']} o={p(t, 11.1, 11.6)} />
              {outs.map((o, i) => (
                <g key={o.s} opacity={p(t, 11.6 + i * 0.4, 12 + i * 0.4)}>
                  <Flow x1={320} y1={136} x2={o.x + o.w / 2} y2={236} k={t > 11.6 ? k : 0} c={i ? MOVE_FILL['to-code'] : MOVE_FILL['to-figma']} />
                  <rect x={o.x} y={236} width={o.w} height={56} rx={10} fill={SC.surface} stroke={SC.line} strokeWidth={2} />
                  <text x={o.x + o.w / 2} y={271} fontSize={21} fontWeight={800} fill={SC.text} textAnchor="middle">{o.s}</text>
                </g>
              ))}
              <text x={320} y={330} fontSize={21} fontWeight={800} fill={SC.muted} textAnchor="middle" opacity={p(t, 13.4, 14)}>Outputs are built, never edited</text>
            </g>
          );
        })()}

        {t >= 16 && t < 21 && (
          <g>
            <rect x={32} y={68} width={576} height={268} rx={14} fill={SC.surface} stroke={SC.line} strokeWidth={2} />
            <text x={52} y={102} fontSize={22} fontWeight={900} fill={SC.text}>Dev Mode · Button</text>
            <g opacity={p(t, 16.4, 17)}>
              <text x={52} y={144} fontSize={21} fontWeight={700} fill={SC.muted}>Figma properties</text>
              <text x={52} y={176} fontSize={21} fontWeight={800} fill={SC.text} fontFamily={MONO}>variant: primary</text>
              <text x={52} y={206} fontSize={21} fontWeight={800} fill={SC.text} fontFamily={MONO}>size: md</text>
            </g>
            <g opacity={p(t, 17.4, 18)}>
              <rect x={52} y={226} width={536} height={90} rx={10} fill="#101828" />
              <text x={70} y={260} fontSize={21} fontWeight={600} fill="#98A2B3" fontFamily={MONO}>{'// Code Connect'}</text>
              <text x={70} y={294} fontSize={21} fontWeight={600} fill="#E4E7EC" fontFamily={MONO}>{'<Button variant="primary">'}</text>
            </g>
            <text x={588} y={176} fontSize={21} fontWeight={800} fill={SC.text} textAnchor="end" opacity={p(t, 18.6, 19.2)}>names match ✓</text>
          </g>
        )}

        {t >= 21 && t < 26 && (
          <g>
            {([
              { s: 'Button: `ghost` in Figma only', m: 'to-code' as const, label: 'To code' },
              { s: 'Input: `iconTrailing` in code only', m: 'to-figma' as const, label: 'To Figma' },
              { s: 'radius 20, set by hand in Figma', m: 'revert' as const, label: 'Revert' },
            ]).map((r, i) => (
              <g key={r.m} opacity={p(t, 21.3 + i * 0.8, 21.9 + i * 0.8)}>
                <rect x={32} y={70 + i * 84} width={576} height={68} rx={12} fill={SC.surface} stroke={SC.line} strokeWidth={2} />
                <text x={52} y={112 + i * 84} fontSize={21} fontWeight={800} fill={SC.text}>{r.s.replace(/`/g, '')}</text>
                <rect x={470} y={86 + i * 84} width={122} height={36} rx={18} fill={MOVE_FILL[r.m]} />
                <text x={531} y={111 + i * 84} fontSize={21} fontWeight={800} fill="#fff" textAnchor="middle">{r.label}</text>
              </g>
            ))}
            <text x={32} y={336} fontSize={21} fontWeight={700} fill={SC.muted} opacity={p(t, 24, 24.6)}>Each issue names the side that has to move</text>
          </g>
        )}

        {t >= 26 && t < 31 && (
          <g>
            {([
              { q: 'In its source?', a: 'Yes', s: 'The side that’s behind catches up', c: MOVE_FILL['to-code'] },
              { q: 'In its source?', a: 'No', s: 'Revert it where it was made', c: MOVE_FILL.revert },
            ]).map((r, i) => (
              <g key={r.a} opacity={p(t, 26.3 + i * 1, 26.9 + i * 1)}>
                <rect x={32} y={76 + i * 120} width={576} height={100} rx={14} fill={SC.surface} stroke={r.c} strokeWidth={3} />
                <text x={56} y={116 + i * 120} fontSize={21} fontWeight={700} fill={SC.muted}>{r.q}</text>
                <rect x={232} y={92 + i * 120} width={70} height={34} rx={17} fill={r.c} />
                <text x={267} y={116 + i * 120} fontSize={21} fontWeight={900} fill="#fff" textAnchor="middle">{r.a}</text>
                <text x={56} y={156 + i * 120} fontSize={22} fontWeight={900} fill={SC.text}>{r.s}</text>
              </g>
            ))}
          </g>
        )}

        {t >= 31 && (() => {
          const k = p(t, 32.4, 34.4);
          return (
            <g>
              <rect x={232} y={70} width={176} height={56} rx={28} fill={MOVE_FILL['to-code']} />
              <text x={320} y={106} fontSize={24} fontWeight={900} fill="#fff" textAnchor="middle">{SYNCED_VERSION}</text>
              {['Figma', 'npm', 'Maven', 'Swift pkg'].map((s, i) => (
                <g key={s} opacity={p(t, 31.4 + i * 0.3, 31.8 + i * 0.3)}>
                  <line x1={320} y1={126} x2={92 + i * 152} y2={170} stroke={SC.line} strokeWidth={3} />
                  <rect x={32 + i * 152} y={170} width={120} height={50} rx={10} fill={SC.surface} stroke={SC.line} strokeWidth={2} />
                  <text x={92 + i * 152} y={203} fontSize={21} fontWeight={800} fill={SC.text} textAnchor="middle">{s}</text>
                </g>
              ))}
              <text x={320} y={286} fontSize={26} fontWeight={900} fill={SC.text} textAnchor="middle" opacity={p(t, 32.2, 32.6)}>Drift: {Math.round(lerp(DRIFTS_FOUND, DRIFTS_LEFT, k))}</text>
              <text x={320} y={324} fontSize={21} fontWeight={700} fill={SC.muted} textAnchor="middle" opacity={p(t, 33, 33.6)}>Same day, same changelog</text>
            </g>
          );
        })()}
      </g>
    </svg>
  );
}
