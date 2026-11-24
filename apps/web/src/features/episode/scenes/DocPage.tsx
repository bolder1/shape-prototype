'use client';
// Scene for ds.3-3: Rasta's Button page is 2,400 words that open with the Button's history. A reading heatmap shows the
// first two lines and the headings read and the rest skipped; Imran, new on Rasta for Business, ships a filter dialog with
// two primary buttons and a red "Remove filter". Then the page is rebuilt usage-first, block by block: what it's for, use
// it for / don't, do and don't pictures, accessibility, a props table generated from BUTTON_API, then a Figma description
// and a Storybook page, and Imran's question answered in five seconds. `MiniDialog` is shared with the Rewrite the Button
// docs game. Pure function of t (0–36).
import { BUTTON_API } from '@shape/content';
import { back, clamp, Grid, lerp, p, SC } from './shared';
import { RastaButton, type BtnVariant } from './PropSprawl';

const W = 960, H = 540;
const MONO = 'ui-monospace, Consolas, monospace';

/** A small dialog on a white card with a title and a row of buttons; `ring` marks buttons by index in red. */
export function MiniDialog({ x, y, w = 150, title, buttons, ring = [], mark }: {
  x: number; y: number; w?: number; title: string; buttons: { variant: BtnVariant; label: string }[]; ring?: number[]; mark?: 'do' | 'dont';
}) {
  const bw = (w - 16 - (buttons.length - 1) * 6) / buttons.length;
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect width={w} height={76} rx={10} fill="#FFFFFF" stroke={mark === 'do' ? '#079455' : mark === 'dont' ? '#D92D20' : '#D0D5DD'} strokeWidth={mark ? 2 : 1.2} />
      <text x={10} y={20} fontSize={11} fontWeight={900} fill="#101828">{title}</text>
      <rect x={10} y={28} width={44} height={12} rx={6} fill="#F2F4F7" /><rect x={58} y={28} width={36} height={12} rx={6} fill="#F2F4F7" />
      {buttons.map((b, k) => (
        <g key={k}>
          <RastaButton x={8 + k * (bw + 6)} y={48} w={bw} size="sm" variant={b.variant} label={b.label} />
          {ring.includes(k) && <rect x={5 + k * (bw + 6)} y={45} width={bw + 6} height={32} rx={8} fill="none" stroke="#D92D20" strokeWidth={2.4} />}
        </g>
      ))}
      {mark && (
        <g transform={`translate(${w - 34} 6)`}>
          <rect width={28} height={16} rx={8} fill={mark === 'do' ? '#079455' : '#D92D20'} />
          <text x={14} y={11.5} textAnchor="middle" fontSize={9} fontWeight={900} fill="#FFFFFF">{mark === 'do' ? 'DO' : 'DON’T'}</text>
        </g>
      )}
    </g>
  );
}

const OLD_HEADS = ['Background', 'Overview', 'Guidelines', 'Variants', 'Accessibility', 'Props'];

export function DocPageScene({ t }: { t: number }) {
  const intro = clamp(back(t / 0.6));
  const heat = p(t, 5, 5.8) * (1 - p(t, 14.4, 15));
  const rebuilt = t >= 15;
  const ask = t >= 31;
  const block = (a: number) => p(t, a, a + 0.5);
  const fin = p(t, 33.4, 34);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" role="img" aria-label="Animated story: a long Button doc page goes unread, a dialog ships with two primary buttons, then the page is rebuilt usage first and the answer takes five seconds to find">
      <rect width={W} height={H} fill={SC.soft} />
      <Grid />
      {/* the old page */}
      <g transform={`translate(36 ${lerp(42, 30, intro)})`} opacity={intro * (rebuilt ? lerp(1, 0.35, p(t, 15, 15.6)) : 1)}>
        <rect width={300} height={480} rx={14} fill={SC.surface} stroke={SC.line} strokeWidth={1.5} />
        <text x={20} y={36} fontSize={18} fontWeight={900} fill={SC.text}>Button</text>
        <text x={280} y={36} textAnchor="end" fontSize={10.5} fontWeight={700} fill={SC.muted}>Wiki · edited March</text>
        <text x={20} y={56} fontSize={10.5} fontWeight={700} fill={SC.muted}>2,400 words · 10 min read</text>
        {OLD_HEADS.map((h, k) => (
          <g key={h} transform={`translate(20 ${96 + k * 62})`}>
            <text fontSize={11} fontWeight={900} fill={SC.text}>{h}</text>
            {[0, 1, 2, 3].map(r => <rect key={r} x={0} y={8 + r * 11} width={r === 3 ? 150 : 256 - ((k * 3 + r * 5) % 4) * 14} height={5} rx={2.5} fill={SC.line} />)}
          </g>
        ))}
        {t < 15 && <text x={20} y={74} fontSize={9.5} fontWeight={700} fill={SC.muted} opacity={p(t, 0.8, 1.3)}>“The Button was first introduced in version 1.2…”</text>}
        {heat > 0 && (
          <g opacity={heat}>
            <rect x={14} y={62} width={272} height={44} rx={8} fill="#F04438" opacity={0.45} />
            {OLD_HEADS.map((h, k) => k > 0 && <rect key={h} x={14} y={84 + k * 62} width={90} height={16} rx={6} fill="#F79009" opacity={0.4} />)}
            <rect x={14} y={112} width={272} height={350} rx={8} fill="#2E90FA" opacity={0.08} />
            <g transform="translate(150 300)">
              <rect x={-118} y={-22} width={236} height={44} rx={10} fill={SC.surface} stroke={SC.line} />
              <text textAnchor="middle" y={-3} fontSize={12} fontWeight={800} fill={SC.text}>Read: two lines and the headings</text>
              <text textAnchor="middle" y={13} fontSize={10.5} fontWeight={700} fill={SC.muted}>Most visits end within 30 seconds</text>
            </g>
          </g>
        )}
      </g>

      {/* Imran's dialog */}
      {t >= 10 && t < 15.4 && (
        <g opacity={p(t, 10, 10.5) * (1 - p(t, 14.8, 15.4))}>
          <text x={380} y={110} fontSize={13} fontWeight={800} fill={SC.text}>Imran · Rasta for Business · filter dialog</text>
          <g transform="translate(380 128) scale(2)">
            <MiniDialog x={0} y={0} w={260} title="Filter trips" ring={t >= 11.6 ? [0, 1, 2] : []}
              buttons={[{ variant: 'danger', label: 'Remove filter' }, { variant: 'primary', label: 'Clear all' }, { variant: 'primary', label: 'Apply' }]} />
          </g>
          <text x={380} y={330} fontSize={13} fontWeight={700} fill={SC.error} opacity={p(t, 11.8, 12.3)}>Two primary buttons, and danger on something that can be undone.</text>
          <text x={380} y={352} fontSize={12} fontWeight={700} fill={SC.muted} opacity={p(t, 12.4, 12.9)}>Both rules were on the page, in paragraph nine.</text>
        </g>
      )}

      {/* the new page */}
      {rebuilt && (
        <g transform="translate(372 30)" opacity={p(t, 15, 15.4) * (1 - fin * 0.75)}>
          <rect width={552} height={480} rx={14} fill={SC.surface} stroke={SC.line} strokeWidth={1.5} />
          <text x={22} y={36} fontSize={20} fontWeight={900} fill={SC.text}>Button</text>
          <text x={22} y={58} fontSize={12.5} fontWeight={700} fill={SC.muted}>Starts an action: Renew, Pay, Save.</text>
          {t >= 27 && (
            <g opacity={block(27)}>
              {([['Figma description', 22, 112], ['Storybook · live examples', 144, 156], ['Same pull request', 310, 112]] as const).map(([l, x, w]) => (
                <g key={l} transform={`translate(${x} 438)`}>
                  <rect width={w} height={20} rx={10} fill={SC.brand} opacity={0.12} />
                  <text x={w / 2} y={14} textAnchor="middle" fontSize={9.5} fontWeight={800} fill={SC.text}>{l}</text>
                </g>
              ))}
            </g>
          )}
          <g transform="translate(22 86)" opacity={block(15.6)}>
            <text fontSize={11} fontWeight={900} fill="#079455">USE IT FOR</text>
            <text y={17} fontSize={11.5} fontWeight={700} fill={SC.text}>Doing something: Renew, Pay, Save</text>
            <text x={270} fontSize={11} fontWeight={900} fill={SC.error}>DON’T USE IT FOR</text>
            <text x={270} y={17} fontSize={11.5} fontWeight={700} fill={SC.text}>Going somewhere: use a Link</text>
          </g>
          <g transform="translate(22 132)" opacity={block(16.2)}>
            {ask && <rect x={-8} y={-16} width={520} height={24} rx={6} fill={SC.mint} opacity={0.22 * p(t, 32, 32.4)} />}
            <text fontSize={12.5} fontWeight={900} fill={SC.text}>One primary button per screen or dialog. The rest are secondary or tertiary.</text>
          </g>
          <g transform="translate(22 152)" opacity={block(19)}>
            <MiniDialog x={0} y={0} w={120} title="Filter trips" mark="do" buttons={[{ variant: 'tertiary', label: 'Clear' }, { variant: 'primary', label: 'Apply' }]} />
            <MiniDialog x={128} y={0} w={120} title="Filter trips" mark="dont" ring={[0, 1]} buttons={[{ variant: 'primary', label: 'Clear' }, { variant: 'primary', label: 'Apply' }]} />
            <g opacity={block(20.4)}>
              <MiniDialog x={264} y={0} w={120} title="Cancel pass?" mark="do" buttons={[{ variant: 'secondary', label: 'Keep' }, { variant: 'danger', label: 'Cancel' }]} />
              <MiniDialog x={392} y={0} w={120} title="Filter trips" mark="dont" ring={[0]} buttons={[{ variant: 'danger', label: 'Remove' }, { variant: 'primary', label: 'Apply' }]} />
            </g>
          </g>
          <g transform="translate(22 256)" opacity={block(23)}>
            <text fontSize={11} fontWeight={900} fill={SC.text}>ACCESSIBILITY</text>
            {['Tap area at least 48 × 48 px', 'Never remove the focus ring', 'Icon-only buttons need an aria-label', 'While loading, keep the width and announce “Renewing…”'].map((l, k) => (
              <text key={l} y={18 + k * 16} fontSize={11.5} fontWeight={700} fill={SC.text}>· {l}</text>
            ))}
          </g>
          <g transform="translate(22 336)" opacity={block(24.5)}>
            <text fontSize={11} fontWeight={900} fill={SC.text}>PROPS</text>
            <rect x={52} y={-11} width={130} height={16} rx={8} fill={SC.grow} opacity={0.2} />
            <text x={60} y={1} fontSize={9.5} fontWeight={800} fill={SC.text}>generated from code</text>
            {BUTTON_API.map((a, k) => (
              <g key={a.name} transform={`translate(0 ${17 + k * 14})`}>
                <text fontSize={11} fontWeight={700} fill={SC.brand} fontFamily={MONO}>{a.name}</text>
                <text x={96} fontSize={10.5} fontWeight={600} fill={SC.muted} fontFamily={MONO}>{a.kind === 'enum' ? a.options!.join(' | ') : a.kind}</text>
              </g>
            ))}
          </g>
          <text x={22} y={473} fontSize={10.5} fontWeight={700} fill={SC.muted} opacity={block(25.5)}>History: see the changelog.</text>
        </g>
      )}
      {ask && (
        <g transform="translate(36 440)" opacity={p(t, 31, 31.5) * (1 - fin)}>
          <rect width={340} height={56} rx={16} fill={SC.text} />
          <text x={18} y={24} fontSize={12.5} fontWeight={800} fill={SC.surface}>Imran: two primary buttons in one dialog?</text>
          <text x={18} y={43} fontSize={11.5} fontWeight={700} fill={SC.surface} opacity={p(t, 32, 32.4)}>Found in the second line · 5 seconds</text>
        </g>
      )}
      {t >= 33.4 && (
        <g transform="translate(200 160)" opacity={fin}>
          <rect width={560} height={210} rx={20} fill={SC.surface} stroke={SC.line} strokeWidth={2} />
          <text x={28} y={48} fontSize={21} fontWeight={900} fill={SC.text}>Answer the question someone has now</text>
          <text x={28} y={98} fontSize={34} fontWeight={900} fill={SC.error} opacity={0.7}>10 min</text>
          <text x={150} y={98} fontSize={34} fontWeight={900} fill={SC.mint}>→ 90 s</text>
          <text x={28} y={140} fontSize={13.5} fontWeight={700} fill={SC.muted}>Usage first · do and don’t pictures · specific accessibility</text>
          <text x={28} y={164} fontSize={13.5} fontWeight={700} fill={SC.muted}>Props generated · lives in Figma and Storybook · same pull request</text>
        </g>
      )}
    </svg>
  );
}
