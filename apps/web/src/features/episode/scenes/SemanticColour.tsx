'use client';
// Scene for ui.3-3: a red brand makes the Pay button and the error look alike; colours get meaning names; the brand
// moves to indigo; in greyscale two colour-only toasts look the same, until icons and words are added. Pure function of t (0–34).
import { CheckCircleIcon, InfoIcon, WarningIcon, XCircleIcon } from '@phosphor-icons/react/ssr';
import { back, clamp, Grid, p, SC } from './shared';

const W = 960, H = 540;
/** Semantic tokens: the colour, a darker solid that carries white text and icons at 4.5:1+, tint and ink, its plain name and its icon. Shared with the Colour the message game. */
export const TOKENS = {
  error: { c: '#dc2626', solid: '#b91c1c', tint: '#fee2e2', ink: '#7f1d1d', plain: 'red', icon: XCircleIcon },
  success: { c: '#16a34a', solid: '#15803d', tint: '#dcfce7', ink: '#14532d', plain: 'green', icon: CheckCircleIcon },
  warning: { c: '#d97706', solid: '#b45309', tint: '#fef3c7', ink: '#78350f', plain: 'amber', icon: WarningIcon },
  info: { c: '#2563eb', solid: '#1d4ed8', tint: '#dbeafe', ink: '#1e3a8a', plain: 'blue', icon: InfoIcon },
} as const;
const BRAND = '#4f46e5';

function Toast({ x, y, c, text, icon: Icon }: { x: number; y: number; c: string; text: string; icon?: typeof InfoIcon }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect width={300} height={60} rx={14} fill={c} />
      {Icon && <Icon x={16} y={14} width={32} height={32} color="#fff" weight="fill" />}
      <text x={Icon ? 58 : 20} y={37} fontSize={17} fontWeight={800} fill="#fff">{text}</text>
    </g>
  );
}

export function SemanticColourScene({ t }: { t: number }) {
  const fin = p(t, 29, 29.8);
  const brand = p(t, 12.4, 13.4);   // the Pay button moves to indigo
  const grey = t < 17 ? 0 : p(t, 17.6, 18.8);
  const words = p(t, 23.2, 24);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" role="img" aria-label="Animated story: naming colours by meaning, keeping the brand separate, and not relying on colour alone">
      <rect width={W} height={H} fill={SC.soft} />
      <Grid />
      <defs>
        <filter id="sc-grey"><feColorMatrix type="saturate" values={String(1 - grey)} /></filter>
      </defs>
      <g opacity={1 - fin}>
        {/* the checkout: brand red vs error red, then indigo */}
        {(t < 6.2 || (t >= 11.6 && t < 17.2)) && (
          <g opacity={t < 6.2 ? clamp(t / 0.5) * (1 - p(t, 5.6, 6.2)) : clamp((t - 11.6) / 0.5) * (1 - p(t, 16.6, 17.2))}>
            <rect x={300} y={90} width={360} height={360} rx={28} fill={SC.surface} stroke={SC.line} strokeWidth={2} />
            <text x={332} y={140} fontSize={20} fontWeight={800} fill={SC.text}>Checkout</text>
            <text x={332} y={170} fontSize={15} fill={SC.muted}>Thali for two · ₹450</text>
            <rect x={332} y={200} width={296} height={56} rx={14} fill={t < 6.2 ? TOKENS.error.c : `color-mix(in oklab, ${TOKENS.error.c} ${100 - brand * 100}%, ${BRAND})`} />
            <text x={480} y={235} textAnchor="middle" fontSize={18} fontWeight={800} fill="#fff">Pay ₹450</text>
            <g transform="translate(332 290)">
              <rect width={296} height={60} rx={14} fill={TOKENS.error.tint} stroke={TOKENS.error.c} strokeWidth={2} />
              <XCircleIcon x={14} y={16} width={28} height={28} color={TOKENS.error.c} weight="fill" />
              <text x={52} y={37} fontSize={15} fontWeight={800} fill={TOKENS.error.ink}>Card declined. Try another.</text>
            </g>
            {t >= 2 && t < 6.2 && <text x={480} y={410} textAnchor="middle" fontSize={16} fontWeight={800} fill={SC.error} opacity={clamp((t - 2) / 0.4)}>Both red. Which one is the problem?</text>}
            {t >= 13.6 && <text x={480} y={410} textAnchor="middle" fontSize={16} fontWeight={800} fill={SC.mint} opacity={clamp((t - 13.6) / 0.4)}>Brand is indigo now. Red only means error.</text>}
          </g>
        )}

        {/* colour names become meanings */}
        {t >= 6 && t < 11.8 && (
          <g opacity={clamp((t - 6) / 0.5) * (1 - p(t, 11.2, 11.8))}>
            {(Object.keys(TOKENS) as (keyof typeof TOKENS)[]).map((k, i) => {
              const tk = TOKENS[k], Icon = tk.icon, x = 165 + i * 210, swap = p(t, 7.6 + i * 0.4, 8.2 + i * 0.4);
              return (
                <g key={k} transform={`translate(${x} 260) scale(${clamp(back((t - 6.2 - i * 0.2) / 0.5))})`}>
                  <rect x={-80} y={-90} width={160} height={120} rx={22} fill={tk.solid} />
                  <Icon x={-22} y={-62} width={44} height={44} color="#fff" weight="fill" opacity={swap} />
                  <text y={70} textAnchor="middle" fontSize={22} fontWeight={800} fill={SC.muted} opacity={1 - swap} fontFamily="ui-monospace, Consolas, monospace">{tk.plain}</text>
                  <text y={70} textAnchor="middle" fontSize={22} fontWeight={800} fill={SC.text} opacity={swap} fontFamily="ui-monospace, Consolas, monospace">{k}</text>
                </g>
              );
            })}
          </g>
        )}

        {/* without colour */}
        {t >= 17 && t < 29.4 && (
          <g opacity={clamp((t - 17) / 0.5)}>
            <g filter="url(#sc-grey)">
              <Toast x={150} y={200} c={TOKENS.error.solid} text={words > 0.5 ? 'Payment failed' : 'Payment update'} icon={words > 0.5 ? XCircleIcon : undefined} />
              <Toast x={510} y={200} c={TOKENS.success.solid} text={words > 0.5 ? 'Payment received' : 'Payment update'} icon={words > 0.5 ? CheckCircleIcon : undefined} />
            </g>
            <text x={480} y={160} textAnchor="middle" fontSize={15} fontWeight={800} fill={SC.muted} opacity={grey}>Seen in greyscale</text>
            {t >= 19.2 && t < 23.2 && <text x={480} y={330} textAnchor="middle" fontSize={17} fontWeight={800} fill={SC.error} opacity={clamp((t - 19.2) / 0.4)}>Which one failed? Colour was the only clue.</text>}
            {t >= 24.2 && <text x={480} y={330} textAnchor="middle" fontSize={17} fontWeight={800} fill={SC.mint} opacity={clamp((t - 24.2) / 0.4)}>An icon and words: clear with or without colour.</text>}
          </g>
        )}
      </g>

      {fin > 0 && [{ x: 200, n: 'Name by meaning', l: 'error · success · warning · info', c: SC.discover }, { x: 480, n: 'Brand apart', l: 'Actions never look like errors', c: SC.design }, { x: 760, n: 'Never colour alone', l: 'Add an icon and words', c: SC.mint }].map((f, i) => {
        const k = back((t - (29.2 + i * 0.25)) / 0.5);
        return (
          <g key={f.n} transform={`translate(${f.x} 260) scale(${clamp(k)})`}>
            <rect x={-125} y={-70} width={250} height={140} rx={18} fill={SC.surface} stroke={f.c} strokeWidth={3} />
            <text y={-8} textAnchor="middle" fontSize={20} fontWeight={800} fill={f.c}>{f.n}</text>
            <text y={26} textAnchor="middle" fontSize={13} fontWeight={600} fill={SC.text}>{f.l}</text>
          </g>
        );
      })}
    </svg>
  );
}
