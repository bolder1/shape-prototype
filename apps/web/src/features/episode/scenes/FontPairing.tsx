'use client';
// Scene for ui.2-3: a café menu in five fonts shouts; it is stripped back to a serif + sans pair; two near-identical sans
// fonts look like a mistake; one family in three weights gives hierarchy with one voice. Pure function of t (0–34).
import { back, clamp, Grid, lerp, p, SC } from './shared';

const W = 960, H = 540;
/** Real font stacks, shared with the Pair or clash? game. Each falls back to a font of the same kind. */
export const FONT: Record<string, string> = {
  serif: 'Georgia, Cambria, serif',
  times: '"Times New Roman", Times, serif',
  sans: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
  verdana: 'Verdana, Geneva, sans-serif',
  tahoma: 'Tahoma, Geneva, Verdana, sans-serif',
  script: '"Brush Script MT", "Segoe Script", "Lucida Handwriting", cursive',
  display: 'Impact, "Arial Black", "Franklin Gothic Heavy", sans-serif',
  mono: 'ui-monospace, Consolas, Menlo, monospace',
};

const MENU = [
  { text: 'CHAI CORNER', f: 'display', size: 44, w: 400, keep: 'h' },
  { text: 'Fresh every morning', f: 'script', size: 30, w: 400 },
  { text: 'Masala chai ₹30', f: 'mono', size: 22, w: 400, keep: 'b' },
  { text: 'Ginger toast ₹40', f: 'times', size: 24, w: 700, keep: 'b' },
  { text: 'Open 7am to 9pm', f: 'verdana', size: 18, w: 400 },
];

const Card = ({ x, y, w = 330, h: hh = 190, children, stroke = SC.line }: { x: number; y: number; w?: number; h?: number; children: React.ReactNode; stroke?: string }) => (
  <g transform={`translate(${x} ${y})`}>
    <rect width={w} height={hh} rx={20} fill={SC.surface} stroke={stroke} strokeWidth={stroke === SC.line ? 2 : 3} />
    {children}
  </g>
);

export function FontPairingScene({ t }: { t: number }) {
  const fin = p(t, 29, 29.8);
  const calm = p(t, 6.4, 8.4);   // the menu settles into two fonts
  const close = p(t, 7.8, 8.8);   // …and the kept lines close the gaps

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" role="img" aria-label="Animated story: too many fonts, a clear serif and sans pair, near-twins, and one family in three weights">
      <rect width={W} height={H} fill={SC.soft} />
      <Grid />
      <g opacity={1 - fin}>
        {/* the menu: five fonts, then two */}
        {t < 11.4 && (
          <g opacity={clamp(t / 0.5) * (1 - p(t, 10.8, 11.4))} transform={`translate(${p(t, 9, 10.6) * -170} 0)`}>
            <rect x={300} y={70} width={360} height={400} rx={24} fill={SC.surface} stroke={SC.line} strokeWidth={2} />
            {MENU.map((m, i) => {
              const kept = MENU.slice(0, i).filter(x => x.keep).length;
              const y = lerp(140 + i * 70, 190 + kept * 70, m.keep ? close : 0);
              const jit = (1 - calm) * Math.sin(t * 9 + i * 2) * 2.2;
              const gone = !m.keep ? calm : 0;
              const fam = m.keep === 'h' ? (calm > 0.5 ? FONT.serif : FONT[m.f]) : m.keep === 'b' ? (calm > 0.5 ? FONT.sans : FONT[m.f]) : FONT[m.f];
              const size = m.keep === 'h' && calm > 0.5 ? 38 : m.keep === 'b' && calm > 0.5 ? 20 : m.size;
              return (
                <text key={m.text} x={480} y={y} textAnchor="middle" fontFamily={fam} fontSize={size} fontWeight={m.keep === 'h' && calm > 0.5 ? 700 : m.keep === 'b' && calm > 0.5 ? 400 : m.w}
                  fill={SC.text} opacity={1 - gone} transform={`rotate(${jit} 480 ${y})`}>{m.keep === 'h' && calm > 0.5 ? 'Chai Corner' : m.text}</text>
              );
            })}
            {t >= 2 && t < 6.4 && <text x={480} y={505} textAnchor="middle" fontSize={16} fontWeight={800} fill={SC.error} opacity={clamp((t - 2) / 0.4)}>Five fonts, five voices. Nothing leads.</text>}
          </g>
        )}

        {/* contrast, not conflict */}
        {t >= 10.6 && t < 23.4 && (
          <g opacity={clamp((t - 10.6) / 0.5) * (1 - p(t, 22.8, 23.4))}>
            <g transform={`translate(0 ${(1 - clamp(back((t - 10.8) / 0.5))) * 30})`}>
              <Card x={90} y={150} stroke={SC.mint}>
                <text x={28} y={66} fontFamily={FONT.serif} fontSize={34} fontWeight={700} fill={SC.text}>Chai Corner</text>
                <text x={28} y={108} fontFamily={FONT.sans} fontSize={17} fill={SC.text}>Masala chai and ginger toast,</text>
                <text x={28} y={134} fontFamily={FONT.sans} fontSize={17} fill={SC.text}>fresh every morning from 7am.</text>
                <text x={28} y={172} fontSize={13} fontWeight={800} fill={SC.mint}>SERIF HEADING · SANS BODY</text>
              </Card>
            </g>
            {t >= 17 && (
              <g transform={`translate(0 ${(1 - clamp(back((t - 17) / 0.5))) * 30})`} opacity={clamp((t - 17) / 0.4)}>
                <Card x={540} y={150} stroke={SC.error}>
                  <text x={28} y={66} fontFamily={FONT.verdana} fontSize={30} fontWeight={700} fill={SC.text}>Chai Corner</text>
                  <text x={28} y={108} fontFamily={FONT.tahoma} fontSize={17} fill={SC.text}>Masala chai and ginger toast,</text>
                  <text x={28} y={134} fontFamily={FONT.tahoma} fontSize={17} fill={SC.text}>fresh every morning from 7am.</text>
                  <text x={28} y={172} fontSize={13} fontWeight={800} fill={SC.error}>VERDANA · TAHOMA</text>
                </Card>
                <text x={705} y={390} textAnchor="middle" fontSize={16} fontWeight={800} fill={SC.error} opacity={clamp((t - 18.2) / 0.4)}>Almost the same. Looks like a mistake.</text>
              </g>
            )}
            {t >= 12 && <text x={255} y={390} textAnchor="middle" fontSize={16} fontWeight={800} fill={SC.mint} opacity={clamp((t - 12) / 0.4)}>Clearly different, so each has a job</text>}
          </g>
        )}

        {/* one family, three weights */}
        {t >= 23 && t < 29.4 && (
          <g opacity={clamp((t - 23) / 0.5)}>
            {[{ w: 800, n: 'Bold · headings', s: 38 }, { w: 600, n: 'Semibold · labels', s: 24 }, { w: 400, n: 'Regular · reading', s: 18 }].map((r, i) => (
              <g key={r.w} transform={`translate(240 ${170 + i * 90}) scale(${clamp(back((t - 23.3 - i * 0.35) / 0.5))})`}>
                <text x={0} y={0} fontFamily={FONT.sans} fontSize={r.s} fontWeight={r.w} fill={SC.text}>Chai Corner</text>
                <text x={340} y={-4} fontSize={15} fontWeight={800} fill={SC.design}>{r.n}</text>
              </g>
            ))}
            <text x={480} y={470} textAnchor="middle" fontSize={16} fontWeight={800} fill={SC.mint} opacity={clamp((t - 25) / 0.4)}>One family. Hierarchy without a second voice.</text>
          </g>
        )}
      </g>

      {fin > 0 && [{ x: 200, n: 'Two at most', l: 'Fewer voices, calmer page', c: SC.discover }, { x: 480, n: 'Contrast clearly', l: 'Near-twins look like errors', c: SC.design }, { x: 760, n: 'Body font first', l: 'Chosen for reading', c: SC.mint }].map((f, i) => {
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
