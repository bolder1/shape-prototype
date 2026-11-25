'use client';
// Scene for ds.4-2: Rasta's 3.5.0 renamed Button's `type` to `variant` and deleted `type`, a squad's dependency bot
// merged it as a minor, and 14 screens broke. Then the three numbers of semver and what each promises, the rename done
// properly (deprecate with a warning, a codemod, a counted window), removal in a planned major, and a changelog grouped
// by what squads must do (`CHANGELOG_SECTIONS`). Pure function of t (0–36). Also exports `BUMP_FILL`, which
// `release-plan` uses.
import { CHANGELOG_SECTIONS, RASTA_VERSION, VERSION_BUMPS, bumpVersion, type VersionBump } from '@shape/content';
import { back, clamp, Grid, lerp, p, SC } from './shared';

const W = 640, H = 360;
/** One fill per bump; white text on each passes 4.5:1. */
export const BUMP_FILL: Record<VersionBump, string> = { patch: '#475467', minor: '#175CD3', major: '#B42318' };
const MONO = 'ui-monospace, SFMono-Regular, Menlo, monospace';

/** A code panel with lines of text, at (x, y). */
function Code({ x, y, w, lines, o = 1 }: { x: number; y: number; w: number; lines: { s: string; c?: string }[]; o?: number }) {
  return (
    <g opacity={o}>
      <rect x={x} y={y} width={w} height={22 + lines.length * 32} rx={12} fill="#101828" />
      {lines.map((l, i) => <text key={i} x={x + 18} y={y + 40 + i * 32} fontSize={21} fontFamily={MONO} fontWeight={600} fill={l.c ?? '#E4E7EC'}>{l.s}</text>)}
    </g>
  );
}

export function DeprecationPathScene({ t }: { t: number }) {
  const intro = clamp(back(t / 0.6));
  const title = t < 6 ? 'A minor that broke' : t < 11 ? 'Three numbers, three promises' : t < 16 ? 'Deprecate, don’t delete' : t < 21 ? 'A codemod does the moving' : t < 26 ? 'Count down the uses' : t < 31 ? 'Remove it in the major' : 'A changelog people read';
  const minor = bumpVersion(RASTA_VERSION, 'minor');

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" role="img" aria-label="Animated story: version 3.5.0 renamed the Button's type prop to variant and removed type. A dependency bot merged it because it was a minor release, and 14 screens failed to build. The three numbers of a version: patch fixes what the docs promised, minor adds without changing anything, major means squads must act. The rename is redone: variant ships in a minor, type keeps working with a warning and a docs badge. A codemod rewrites the old prop and opens pull requests. A weekly scan counts the uses left, 212 then 64 then zero, across two minor releases. The removal waits for 4.0.0 in June, with a migration guide. The changelog is grouped: breaking first, then added and deprecated, then fixed.">
      <rect width={W} height={H} fill={SC.soft} />
      <Grid w={W} h={H} />
      <g opacity={intro}>
        <text x={32} y={44} fontSize={26} fontWeight={900} fill={SC.text}>{title}</text>

        {t < 6 && (
          <g>
            <g opacity={p(t, 0.3, 1)}>
              <rect x={32} y={72} width={150} height={44} rx={22} fill={SC.surface} stroke={SC.line} strokeWidth={2} />
              <text x={107} y={102} fontSize={22} fontWeight={900} fill={SC.text} textAnchor="middle">{RASTA_VERSION}</text>
              <path d="M192 94 h36 m-10 -9 l10 9 l-10 9" fill="none" stroke={SC.muted} strokeWidth={3} />
              <rect x={238} y={72} width={150} height={44} rx={22} fill={BUMP_FILL.minor} />
              <text x={313} y={102} fontSize={22} fontWeight={900} fill="#fff" textAnchor="middle">{minor}</text>
              <text x={404} y={102} fontSize={21} fontWeight={800} fill={SC.muted} opacity={p(t, 1.2, 1.8)}>auto-merged</text>
            </g>
            <Code x={32} y={136} w={576} o={p(t, 1.8, 2.6)} lines={[
              { s: '$ npm run build' },
              { s: '✕ Button: unknown prop `type`', c: '#FDA29B' },
              { s: '✕ 14 screens failed in Business', c: '#FDA29B' },
              { s: '  Tuesday, 10:42', c: '#98A2B3' },
            ]} />
          </g>
        )}

        {t >= 6 && t < 11 && (
          <g>
            {(['major', 'minor', 'patch'] as const).map((b, i) => {
              const x = 32 + i * 196;
              const said = { major: ['You must act,', 'or screens change'], minor: ['Something new,', 'nothing changed'], patch: ['Now does what', 'the docs said'] }[b];
              return (
                <g key={b} opacity={p(t, 6.2 + i * 0.6, 6.8 + i * 0.6)}>
                  <rect x={x} y={76} width={180} height={110} rx={14} fill={BUMP_FILL[b]} />
                  <text x={x + 90} y={148} fontSize={64} fontWeight={900} fill="#fff" textAnchor="middle">{RASTA_VERSION.split('.')[i]}</text>
                  <text x={x + 90} y={220} fontSize={22} fontWeight={900} fill={SC.text} textAnchor="middle">{b.toUpperCase()}</text>
                  <text x={x + 90} y={256} fontSize={21} fontWeight={700} fill={SC.muted} textAnchor="middle">{said[0]}</text>
                  <text x={x + 90} y={284} fontSize={21} fontWeight={700} fill={SC.muted} textAnchor="middle">{said[1]}</text>
                </g>
              );
            })}
          </g>
        )}

        {t >= 11 && t < 16 && (
          <g>
            <Code x={32} y={72} w={576} o={p(t, 11.2, 11.8)} lines={[
              { s: '<Button type="primary">Renew</Button>' },
              { s: '⚠ `type` is deprecated. Use `variant`.', c: '#FEC84B' },
              { s: '  Removed in 4.0.0', c: '#98A2B3' },
            ]} />
            <g opacity={p(t, 12.8, 13.5)}>
              <rect x={32} y={228} width={576} height={96} rx={12} fill={SC.surface} stroke={SC.line} strokeWidth={2} />
              <text x={52} y={266} fontSize={22} fontWeight={900} fill={SC.text}>Button · type</text>
              <rect x={226} y={244} width={142} height={30} rx={15} fill={BUMP_FILL.major} />
              <text x={297} y={266} fontSize={18} fontWeight={800} fill="#fff" textAnchor="middle">DEPRECATED</text>
              <text x={52} y={304} fontSize={21} fontWeight={700} fill={SC.muted}>Use variant. Still works until 4.0.0.</text>
            </g>
          </g>
        )}

        {t >= 16 && t < 21 && (() => {
          const k = p(t, 16.8, 18.4);
          const word = k < 0.5 ? 'type' : 'variant';
          return (
            <g>
              <Code x={32} y={72} w={576} lines={[
                { s: '$ npx @rasta/codemods type-to-variant' },
                { s: `<Button ${word}="primary">`, c: k < 0.5 ? '#FDA29B' : '#75E0A7' },
                { s: `<Button ${word}="secondary">`, c: k < 0.5 ? '#FDA29B' : '#75E0A7' },
                { s: `✓ ${Math.round(lerp(0, 148, k))} files rewritten`, c: '#75E0A7' },
              ]} />
              {['Business', 'Payments', 'Growth', 'Metro'].map((s, i) => (
                <g key={s} opacity={p(t, 18.6 + i * 0.4, 19.1 + i * 0.4)}>
                  <rect x={32 + i * 146} y={256} width={134} height={58} rx={10} fill={SC.surface} stroke={SC.mint} strokeWidth={2} />
                  <text x={99 + i * 146} y={280} fontSize={21} fontWeight={800} fill={SC.text} textAnchor="middle">PR opened</text>
                  <text x={99 + i * 146} y={304} fontSize={21} fontWeight={700} fill={SC.muted} textAnchor="middle">{s}</text>
                </g>
              ))}
            </g>
          );
        })()}

        {t >= 21 && t < 26 && (() => {
          const rel = [{ v: minor, n: 212 }, { v: bumpVersion(minor, 'minor'), n: 64 }, { v: bumpVersion(bumpVersion(minor, 'minor'), 'minor'), n: 0 }];
          return (
            <g>
              <text x={32} y={92} fontSize={21} fontWeight={800} fill={SC.muted}>Uses of `type` left, from the weekly scan</text>
              {rel.map((r, i) => {
                const k = p(t, 21.4 + i * 1.1, 22.3 + i * 1.1);
                const n = lerp(i ? rel[i - 1].n : 212, r.n, k), w = (n / 212) * 400;
                return (
                  <g key={r.v} opacity={p(t, 21.2 + i * 1.1, 21.6 + i * 1.1)}>
                    <text x={32} y={150 + i * 70} fontSize={22} fontWeight={900} fill={SC.text}>{r.v}</text>
                    <rect x={120} y={124 + i * 70} width={Math.max(4, w)} height={36} rx={6} fill={r.n ? BUMP_FILL.minor : SC.mint} />
                    <text x={132 + Math.max(4, w)} y={150 + i * 70} fontSize={22} fontWeight={900} fill={SC.text}>{Math.round(n)}</text>
                  </g>
                );
              })}
            </g>
          );
        })()}

        {t >= 26 && t < 31 && (() => {
          const stops = [{ v: minor, s: 'Deprecate', when: 'Jan' }, { v: '3.6.0', s: 'Codemod PRs', when: 'Feb' }, { v: '3.7.0', s: 'Count: 0', when: 'Apr' }, { v: '4.0.0', s: 'Remove', when: 'Jun' }];
          return (
            <g>
              <line x1={64} y1={180} x2={584} y2={180} stroke={SC.line} strokeWidth={4} />
              <line x1={64} y1={180} x2={lerp(64, 584, p(t, 26.2, 29))} y2={180} stroke={SC.text} strokeWidth={4} />
              {stops.map((st, i) => {
                const x = 64 + i * (520 / 3), last = i === 3;
                return (
                  <g key={st.v} opacity={p(t, 26.4 + i * 0.7, 26.9 + i * 0.7)}>
                    <circle cx={x} cy={180} r={last ? 16 : 11} fill={last ? BUMP_FILL.major : SC.surface} stroke={last ? BUMP_FILL.major : SC.text} strokeWidth={3} />
                    <text x={x} y={140} fontSize={22} fontWeight={900} fill={SC.text} textAnchor="middle">{st.v}</text>
                    <text x={x} y={226} fontSize={21} fontWeight={800} fill={SC.text} textAnchor="middle">{st.s}</text>
                    <text x={x} y={256} fontSize={21} fontWeight={700} fill={SC.muted} textAnchor="middle">{st.when}</text>
                  </g>
                );
              })}
              <text x={320} y={318} fontSize={21} fontWeight={800} fill={SC.muted} textAnchor="middle" opacity={p(t, 29, 29.6)}>Announced in March · one migration guide</text>
            </g>
          );
        })()}

        {t >= 31 && (
          <g>
            <rect x={32} y={66} width={576} height={274} rx={14} fill={SC.surface} stroke={SC.line} strokeWidth={2} />
            <text x={52} y={102} fontSize={22} fontWeight={900} fill={SC.text}>Release notes, grouped by what you do</text>
            {[...VERSION_BUMPS].reverse().map((b, i) => {
              const item = { major: '4.0.0: `type` removed. Run type-to-variant', minor: '3.5.0: DatePicker. Chip deprecated, use Tag', patch: '3.5.0: focus ring visible on teal, dark mode' }[b];
              return (
                <g key={b} opacity={p(t, 31.4 + i * 0.6, 32 + i * 0.6)}>
                  <rect x={52} y={122 + i * 70} width={8} height={52} rx={4} fill={BUMP_FILL[b]} />
                  <text x={74} y={142 + i * 70} fontSize={21} fontWeight={900} fill={SC.text}>{CHANGELOG_SECTIONS[b].split(':')[0]}</text>
                  <text x={74} y={170 + i * 70} fontSize={21} fontWeight={600} fill={SC.muted}>{item}</text>
                </g>
              );
            })}
          </g>
        )}
      </g>
    </svg>
  );
}
