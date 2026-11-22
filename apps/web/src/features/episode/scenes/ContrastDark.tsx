'use client';
// Scene for ui.3-4: pale helper text fails at 2.5:1 and is darkened past 4.5:1; a lazily inverted dark mode glares; a
// proper one uses dark grey, lighter raised surfaces and a softer blue; then a grey that fails on dark is lightened.
// Ratios are computed live with the WCAG formula. Pure function of t (0–34).
import { contrastRatio } from '@shape/content';
import { back, clamp, Grid, p, SC } from './shared';

const W = 960, H = 540;
/** Mixes two #rrggbb colours: k = 0 gives a, k = 1 gives b. */
export function mixHex(a: string, b: string, k: number) {
  const ch = (h: string, i: number) => parseInt(h.slice(i, i + 2), 16);
  return '#' + [1, 3, 5].map(i => Math.round(ch(a, i) + (ch(b, i) - ch(a, i)) * clamp(k)).toString(16).padStart(2, '0')).join('');
}

function Ratio({ x, y, fg, bg }: { x: number; y: number; fg: string; bg: string }) {
  const r = contrastRatio(fg, bg), ok = r >= 4.5;
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x={-95} y={-17} width={190} height={34} rx={17} fill={ok ? SC.mint : SC.error} />
      <text y={6} textAnchor="middle" fontSize={15} fontWeight={800} fill="#fff">{r.toFixed(1)}:1 · {ok ? 'passes AA' : 'fails'}</text>
    </g>
  );
}

function Form({ x, y, bg, field, text, helper, label }: { x: number; y: number; bg: string; field: string; text: string; helper: string; label: string }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect width={380} height={220} rx={24} fill={bg} stroke={SC.line} strokeWidth={2} />
      <text x={32} y={56} fontSize={17} fontWeight={800} fill={text}>{label}</text>
      <rect x={32} y={74} width={316} height={50} rx={12} fill={field} stroke={helper} strokeOpacity={0.5} strokeWidth={1.5} />
      <text x={48} y={105} fontSize={16} fill={text}>asha@example.com</text>
      <text x={32} y={156} fontSize={15} fontWeight={600} fill={helper}>We’ll send your receipts here.</text>
    </g>
  );
}

export function ContrastDarkScene({ t }: { t: number }) {
  const fin = p(t, 29, 29.8);
  const helperLight = mixHex('#a3a3a3', '#6b7280', p(t, 5.4, 7.4));
  const helperDark = mixHex('#4b5563', '#9ca3af', p(t, 24.6, 26.4));

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" role="img" aria-label="Animated story: fixing low-contrast text, and building a dark mode that isn’t just inverted">
      <rect width={W} height={H} fill={SC.soft} />
      <Grid />
      <g opacity={1 - fin}>
        {/* light: darken the helper text */}
        {t < 11.4 && (
          <g opacity={clamp(t / 0.5) * (1 - p(t, 10.8, 11.4))}>
            <Form x={290} y={130} bg="#ffffff" field="#ffffff" text="#111827" helper={helperLight} label="Email" />
            <Ratio x={480} y={400} fg={helperLight} bg="#ffffff" />
            <text x={480} y={100} textAnchor="middle" fontSize={15} fontWeight={800} fill={SC.muted}>Helper text against white</text>
          </g>
        )}

        {/* dark, the lazy way vs done well */}
        {t >= 11 && t < 23.4 && (
          <g opacity={clamp((t - 11) / 0.5) * (1 - p(t, 22.8, 23.4))}>
            <g transform={`translate(${p(t, 16.6, 17.6) * -200} 0)`}>
              <rect x={290} y={110} width={380} height={280} rx={24} fill="#000000" stroke={SC.line} strokeWidth={2} />
              <text x={322} y={170} fontSize={24} fontWeight={800} fill="#ffffff">Your budget</text>
              <text x={322} y={204} fontSize={16} fill="#ffffff">₹12,400 left this month</text>
              <rect x={322} y={300} width={200} height={54} rx={14} fill="#3b82f6" />
              <rect x={322} y={300} width={200} height={54} rx={14} fill="none" stroke="#3b82f6" strokeWidth={10} strokeOpacity={0.35} />
              <text x={422} y={333} textAnchor="middle" fontSize={17} fontWeight={800} fill="#ffffff">Add expense</text>
              {t >= 12 && ['Pure black', 'Glaring blue', 'Buzzing white'].map((l, i) => (
                <g key={l} opacity={clamp((t - 12 - i * 0.5) / 0.4) * (1 - p(t, 16.4, 17))}>
                  <rect x={690} y={140 + i * 70} width={170} height={36} rx={18} fill={SC.error} />
                  <text x={775} y={163 + i * 70} textAnchor="middle" fontSize={15} fontWeight={800} fill="#fff">{l}</text>
                </g>
              ))}
            </g>
            {t >= 17 && (
              <g opacity={clamp((t - 17.2) / 0.5)}>
                <rect x={500} y={100} width={380} height={300} rx={24} fill="#121417" stroke={SC.line} strokeWidth={2} />
                <rect x={524} y={124} width={332} height={150} rx={18} fill="#1b1e23" />
                <rect x={548} y={148} width={284} height={66} rx={14} fill="#25292f" />
                <text x={568} y={178} fontSize={18} fontWeight={800} fill="#e5e7eb">Your budget</text>
                <text x={568} y={202} fontSize={14} fill="#9ca3af">₹12,400 left this month</text>
                <rect x={548} y={310} width={200} height={54} rx={14} fill="#60a5fa" />
                <text x={648} y={343} textAnchor="middle" fontSize={17} fontWeight={800} fill="#0b1220">Add expense</text>
                <text x={690} y={432} textAnchor="middle" fontSize={15} fontWeight={800} fill={SC.mint} opacity={clamp((t - 18.2) / 0.4)}>Dark grey base · higher is lighter · softer blue</text>
              </g>
            )}
          </g>
        )}

        {/* check again in dark */}
        {t >= 23 && t < 29.4 && (
          <g opacity={clamp((t - 23) / 0.5)}>
            <Form x={290} y={130} bg="#121417" field="#1b1e23" text="#e5e7eb" helper={helperDark} label="Email" />
            <Ratio x={480} y={400} fg={helperDark} bg="#121417" />
            <text x={480} y={100} textAnchor="middle" fontSize={15} fontWeight={800} fill={SC.muted}>The same helper text, now on dark grey</text>
          </g>
        )}
      </g>

      {fin > 0 && [{ x: 200, n: '4.5 and 3', l: 'Body text · large text', c: SC.discover }, { x: 480, n: 'Not inverted', l: 'Dark grey, lighter when raised', c: SC.design }, { x: 760, n: 'Check both themes', l: 'Every pair, light and dark', c: SC.mint }].map((f, i) => {
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
