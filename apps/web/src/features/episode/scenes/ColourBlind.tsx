'use client';
// Scene for ax.1-3: a red/green chart, then the same chart seen with deuteranopia (simulated with an SVG colour matrix);
// status dots and an error border lose their meaning; labels, icons and a message bring it back; lightness differences
// survive. Pure function of t (0–34).
import { back, clamp, Grid, p, SC } from './shared';

const W = 960, H = 540;
/** Colour-vision-deficiency matrices (Machado et al. 2009, full severity), applied in linear RGB. Used by the scene and the Through other eyes game. */
export const CVD: Record<string, { n: string; m: string }> = {
  deut: { n: 'Deuteranopia', m: '0.367322 0.860646 -0.227968 0 0  0.280085 0.672501 0.047413 0 0  -0.01182 0.04294 0.968881 0 0  0 0 0 1 0' },
  prot: { n: 'Protanopia', m: '0.152286 1.052583 -0.204868 0 0  0.114503 0.786281 0.099216 0 0  -0.003882 -0.048116 1.051998 0 0  0 0 0 1 0' },
  trit: { n: 'Tritanopia', m: '1.255528 -0.076749 -0.178779 0 0  -0.078411 0.930809 0.147602 0 0  0.004733 0.691367 0.3039 0 0  0 0 0 1 0' },
};
/** SVG filter definitions (#cvd-deut, #cvd-prot, #cvd-trit). Render once; HTML can use them via CSS filter: url(#cvd-deut). */
export function CvdFilters() {
  return (
    <svg width="0" height="0" className="absolute" aria-hidden>
      <defs>
        {Object.entries(CVD).map(([id, c]) => <filter key={id} id={`cvd-${id}`} colorInterpolationFilters="linearRGB"><feColorMatrix type="matrix" values={c.m} /></filter>)}
      </defs>
    </svg>
  );
}

const RED = '#dc2626', GREEN = '#16a34a';
const LINE_A = 'M0 120 L50 100 L100 108 L150 70 L200 60 L250 30';
const LINE_B = 'M0 60 L50 80 L100 70 L150 100 L200 96 L250 120';

/** One panel of the story at time t, drawn at (0, 0) in a 360 × 330 box. */
function Panel({ t }: { t: number }) {
  const fix = t >= 18;
  return (
    <g>
      <rect width={360} height={330} rx={18} fill="#ffffff" stroke={SC.line} strokeWidth={2} />
      {/* chart */}
      {t < 12 || t >= 18 ? (
        <g transform="translate(30 30)">
          <text x={0} y={0} fontSize={13} fontWeight={800} fill="#111827">Profit vs loss</text>
          <g transform="translate(0 20)">
            <path d={LINE_A} stroke={GREEN} strokeWidth={4} fill="none" />
            <path d={LINE_B} stroke={RED} strokeWidth={4} fill="none" strokeDasharray={fix ? '8 6' : undefined} />
            {fix ? (<><text x={256} y={34} fontSize={12} fontWeight={800} fill="#111827">Profit</text><text x={256} y={124} fontSize={12} fontWeight={800} fill="#111827">Loss</text></>)
              : (<g transform="translate(200 150)"><circle r={5} fill={GREEN} /><text x={10} y={4} fontSize={11} fill="#374151">Profit</text><circle cy={16} r={5} fill={RED} /><text x={10} y={20} fontSize={11} fill="#374151">Loss</text></g>)}
          </g>
        </g>
      ) : null}
      {/* interface */}
      {t >= 12 && t < 24 && (
        <g transform={`translate(30 ${t >= 18 ? 200 : 40})`}>
          {[{ n: 'Payments API', c: GREEN, up: true }, { n: 'Search API', c: RED, up: false }].map((s, i) => (
            <g key={s.n} transform={`translate(0 ${i * 30})`}>
              <circle cx={8} cy={0} r={8} fill={s.c} />
              {fix && <text x={8} y={4} textAnchor="middle" fontSize={11} fontWeight={900} fill="#fff">{s.up ? '✓' : '✕'}</text>}
              <text x={26} y={5} fontSize={13} fill="#111827">{s.n}{fix ? (s.up ? ' · Up' : ' · Down') : ''}</text>
            </g>
          ))}
          {t < 18 && (
            <g transform="translate(0 80)">
              <text x={0} y={0} fontSize={12} fontWeight={700} fill="#374151">Email</text>
              <rect x={0} y={10} width={300} height={40} rx={8} fill="#fff" stroke={RED} strokeWidth={2.5} />
              <text x={12} y={35} fontSize={13} fill="#111827">asha@example</text>
            </g>
          )}
        </g>
      )}
      {t >= 18 && t < 24 && <text x={30} y={300} fontSize={12} fontWeight={700} fill="#b91c1c">⚠ Email needs a domain, like .com</text>}
      {/* lightness */}
      {t >= 24 && (
        <g transform="translate(30 210)">
          {[RED, GREEN].map((c, i) => <rect key={c} x={i * 70} y={0} width={60} height={60} rx={10} fill={c} />)}
          {['#bfdbfe', '#1e3a8a'].map((c, i) => <rect key={c} x={160 + i * 70} y={0} width={60} height={60} rx={10} fill={c} />)}
          <text x={0} y={84} fontSize={11} fontWeight={700} fill="#374151">Hue only</text>
          <text x={160} y={84} fontSize={11} fontWeight={700} fill="#374151">Light vs dark</text>
        </g>
      )}
    </g>
  );
}

export function ColourBlindScene({ t }: { t: number }) {
  const fin = p(t, 29, 29.8);
  const split = p(t, 6, 7.4);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" role="img" aria-label="Animated story: designs seen with colour blindness, and how labels and icons keep them clear">
      <rect width={W} height={H} fill={SC.soft} />
      <Grid />
      <defs>
        <filter id="cvd-scene" colorInterpolationFilters="linearRGB"><feColorMatrix type="matrix" values={CVD.deut.m} /></filter>
      </defs>
      <g opacity={1 - fin}>
        <g transform={`translate(${300 - split * 210} 110) scale(${clamp(back(t / 0.6))})`}>
          <Panel t={t} />
          {split > 0 && <text x={180} y={-16} textAnchor="middle" fontSize={15} fontWeight={800} fill={SC.muted} opacity={split}>Typical colour vision</text>}
        </g>
        {split > 0 && (
          <g transform={`translate(${300 + split * 210} 110)`} opacity={split}>
            <g filter="url(#cvd-scene)"><Panel t={t} /></g>
            <text x={180} y={-16} textAnchor="middle" fontSize={15} fontWeight={800} fill={SC.muted}>Deuteranopia (simulated)</text>
          </g>
        )}
        {t >= 7.8 && t < 12 && <text x={480} y={480} textAnchor="middle" fontSize={17} fontWeight={800} fill={SC.error}>Which line is profit? On the right, you can’t tell.</text>}
        {t >= 13.4 && t < 18 && <text x={480} y={480} textAnchor="middle" fontSize={17} fontWeight={800} fill={SC.error}>Which API is down? Which field is wrong?</text>}
        {t >= 19.2 && t < 24 && <text x={480} y={480} textAnchor="middle" fontSize={17} fontWeight={800} fill={SC.mint}>Labels, icons and a message: clear in both.</text>}
        {t >= 25 && t < 29 && <text x={480} y={480} textAnchor="middle" fontSize={17} fontWeight={800} fill={SC.mint}>Lightness differences survive. Hue alone doesn’t.</text>}
      </g>

      {fin > 0 && [{ x: 200, n: '1 in 12 men', l: 'Red–green is most common', c: SC.discover }, { x: 480, n: 'A second signal', l: 'Labels · icons · patterns', c: SC.design }, { x: 760, n: 'Lean on lightness', l: 'Light vs dark stays visible', c: SC.mint }].map((f, i) => {
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
