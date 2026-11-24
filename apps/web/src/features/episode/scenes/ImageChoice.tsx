'use client';
// Scene for ui.4-3: Hisaab's website opens on a stock photo of a man in a suit shaking hands, and three of five
// shopkeepers think it's a bank. It becomes a photo of Ramesh ji at his own counter; the stock list gets a photo of each
// pack; "backed up every night" gets a drawing; a banner photo is taken off the ledger so eight rows fit; six photos
// weigh 720 kB against 48 kB of drawings on slow 4G; and the four kinds of image end with their jobs. `SlotArt` and
// `KIND_NAME` are shared with the Photo, drawing, icon or nothing? game. Pure function of t (0–34).
import { IMAGE_KB, type ImageKind } from '@shape/content';
import { back, clamp, Grid, lerp, p, SC } from './shared';
import { HIcon } from './IconAudit';

const W = 960, H = 540;

export const KIND_NAME: Record<ImageKind, string> = { photo: 'Photo', illus: 'Illustration', icon: 'Icon', none: 'Nothing' };

/** A "photo": flat layers in photographic tones. `subject` picks what it shows. */
function Photo({ w, h, subject }: { w: number; h: number; subject: 'stock' | 'counter' | 'pack5' | 'pack10' }) {
  if (subject === 'pack5' || subject === 'pack10') {
    const big = subject === 'pack10';
    return (
      <g>
        <rect width={w} height={h} rx={8} fill="#e9dfd0" />
        <rect x={w * (big ? 0.2 : 0.28)} y={h * (big ? 0.1 : 0.22)} width={w * (big ? 0.6 : 0.44)} height={h * (big ? 0.82 : 0.7)} rx={6} fill="#d98a2b" />
        <rect x={w * (big ? 0.26 : 0.33)} y={h * 0.42} width={w * (big ? 0.48 : 0.34)} height={h * 0.2} rx={3} fill="#fff6e6" />
        <text x={w / 2} y={h * 0.56} textAnchor="middle" fontSize={Math.max(8, h * 0.13)} fontWeight={900} fill="#7a3e00">{big ? '10 kg' : '5 kg'}</text>
      </g>
    );
  }
  if (subject === 'stock') {
    return (
      <g>
        <rect width={w} height={h} rx={8} fill="#b9c4cf" />
        <rect y={h * 0.62} width={w} height={h * 0.38} fill="#8d99a6" />
        <rect x={w * 0.08} y={h * 0.12} width={w * 0.22} height={h * 0.44} fill="#dfe5ea" />
        {/* two men in suits, shaking hands */}
        {[0.32, 0.68].map((cx, k) => (
          <g key={k}>
            <circle cx={w * cx} cy={h * 0.3} r={h * 0.1} fill="#e8c3a0" />
            <path d={`M${w * cx - h * 0.17} ${h} L${w * cx - h * 0.15} ${h * 0.5} Q${w * cx} ${h * 0.42} ${w * cx + h * 0.15} ${h * 0.5} L${w * cx + h * 0.17} ${h} Z`} fill={k ? '#2f3a4a' : '#3d4b5e'} />
          </g>
        ))}
        <rect x={w * 0.44} y={h * 0.6} width={w * 0.12} height={h * 0.07} rx={h * 0.03} fill="#e8c3a0" />
      </g>
    );
  }
  return (
    <g>
      <rect width={w} height={h} rx={8} fill="#d8c3a2" />
      {[0.14, 0.34, 0.54].map(y => <rect key={y} x={w * 0.05} y={h * y} width={w * 0.9} height={h * 0.03} fill="#8b6a43" />)}
      {Array.from({ length: 18 }, (_, k) => (
        <rect key={k} x={w * (0.07 + (k % 9) * 0.1)} y={h * (k < 9 ? 0.04 : 0.24)} width={w * 0.07} height={h * 0.1} rx={2}
          fill={['#c0392b', '#e1a23b', '#2e86c1', '#27ae60', '#d35400', '#8e44ad'][k % 6]} />
      ))}
      <rect y={h * 0.66} width={w} height={h * 0.34} fill="#a07a4f" />
      <circle cx={w * 0.4} cy={h * 0.42} r={h * 0.1} fill="#a86f4c" />
      <path d={`M${w * 0.27} ${h * 0.75} Q${w * 0.4} ${h * 0.48} ${w * 0.53} ${h * 0.75} Z`} fill="#f2f2f2" />
      <rect x={w * 0.58} y={h * 0.6} width={w * 0.16} height={h * 0.12} rx={2} fill="#f3e2b5" />
      <rect x={w * 0.5} y={h * 0.58} width={w * 0.06} height={h * 0.12} rx={2} fill="#222" />
    </g>
  );
}

/** A flat illustration in Hisaab's one style: a khata, and a cloud when it's about backing up. */
function Illus({ w, h, cloud }: { w: number; h: number; cloud?: boolean }) {
  const s = Math.min(w, h);
  return (
    <g>
      <rect width={w} height={h} rx={8} fill={SC.soft} />
      <g transform={`translate(${w / 2} ${h / 2 + (cloud ? s * 0.08 : 0)})`}>
        <rect x={-s * 0.28} y={-s * 0.2} width={s * 0.56} height={s * 0.4} rx={s * 0.04} fill="var(--color-family-design)" opacity={0.85} />
        <rect x={-s * 0.02} y={-s * 0.2} width={s * 0.04} height={s * 0.4} fill="#fff" opacity={0.6} />
        {[-0.1, 0, 0.1].map(y => <rect key={y} x={-s * 0.22} y={s * y - s * 0.01} width={s * 0.15} height={s * 0.025} rx={1} fill="#fff" opacity={0.8} />)}
        {cloud && <path d={`M${-s * 0.2} ${-s * 0.28} a${s * 0.08} ${s * 0.08} 0 0 1 ${s * 0.12} ${-s * 0.1} a${s * 0.1} ${s * 0.1} 0 0 1 ${s * 0.2} ${s * 0.02} a${s * 0.07} ${s * 0.07} 0 0 1 ${s * 0.08} ${s * 0.08} Z`} fill="var(--color-family-discover)" opacity={0.85} />}
      </g>
    </g>
  );
}

/** Text lines standing in for real content. */
const Lines = ({ w, n, y = 0 }: { w: number; n: number; y?: number }) => (
  <g>{Array.from({ length: n }, (_, k) => <rect key={k} x={0} y={y + k * 16} width={w * (k % 3 === 2 ? 0.6 : 0.9)} height={8} rx={4} fill={SC.line} />)}</g>
);

/** One kind of image in a w × h slot, with its weight in kB under it when `kb` is set. */
export function SlotArt({ kind, w, h, kb, subject = 'counter', cloud }: { kind: ImageKind; w: number; h: number; kb?: boolean; subject?: 'stock' | 'counter' | 'pack5' | 'pack10'; cloud?: boolean }) {
  return (
    <g>
      {kind === 'photo' && <Photo w={w} h={h} subject={subject} />}
      {kind === 'illus' && <Illus w={w} h={h} cloud={cloud} />}
      {kind === 'icon' && (
        <g>
          {[0, 1, 2].map(k => (
            <g key={k} transform={`translate(0 ${k * (h / 3)})`}>
              <HIcon name={(['settings', 'bell', 'share'] as const)[k]} x={6} y={h / 6 - 11} size={22} color={SC.brand} />
              <rect x={40} y={h / 6 - 4} width={w * 0.5} height={8} rx={4} fill={SC.line} />
            </g>
          ))}
        </g>
      )}
      {kind === 'none' && <Lines w={w} n={Math.max(2, Math.floor(h / 16))} y={4} />}
      {kb && <text x={w} y={h + 16} textAnchor="end" fontSize={11} fontWeight={800} fill={SC.muted}>{IMAGE_KB[kind]} kB</text>}
    </g>
  );
}

const Browser = ({ x, y, w, h, children }: { x: number; y: number; w: number; h: number; children: React.ReactNode }) => (
  <g transform={`translate(${x} ${y})`}>
    <rect width={w} height={h} rx={14} fill={SC.surface} stroke={SC.line} strokeWidth={2} />
    <rect width={w} height={30} rx={14} fill={SC.soft} />
    {[0, 1, 2].map(k => <circle key={k} cx={18 + k * 14} cy={15} r={4} fill={SC.line} />)}
    <rect x={70} y={8} width={w - 90} height={14} rx={7} fill={SC.surface} />
    <text x={80} y={19} fontSize={10} fontWeight={700} fill={SC.muted}>hisaab.in</text>
    <g transform="translate(0 30)">{children}</g>
  </g>
);

const Phone = ({ x, y, title, children }: { x: number; y: number; title: string; children: React.ReactNode }) => (
  <g transform={`translate(${x} ${y})`}>
    <rect width={260} height={440} rx={28} fill={SC.surface} stroke={SC.line} strokeWidth={2} />
    <text x={20} y={40} fontSize={17} fontWeight={900} fill={SC.text}>{title}</text>
    <g transform="translate(20 60)">{children}</g>
  </g>
);

const LEDGER = [['Sunita Sharma', '2,450'], ['Mohd. Irfan', '12,400'], ['Kavita Joshi', '800'], ['Ramprasad Meena', '8,000'], ['Pooja Agarwal', '1,250'], ['Deepak Saini', '3,600'], ['Anil Kumawat', '650'], ['Rekha Saini', '1,900']];
const FACES = ['“A bank?”', '“A bank?”', '“Insurance?”', '“A bank?”', '“Laptops?”'];

export function ImageChoiceScene({ t }: { t: number }) {
  const real = p(t, 9, 10.4), banner = 1 - p(t, 23.4, 24.6);
  const view = t < 14 ? 'web' : t < 18 ? 'stock' : t < 22 ? 'welcome' : 'ledger';
  const fade = (a: number, b: number) => p(t, a, a + 0.5) * (1 - p(t, b - 0.5, b));

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" role="img" aria-label="Animated story: a stock photo is replaced by a real shopkeeper, product photos, an illustration for an idea, and no image on a ledger, with the data each costs">
      <rect width={W} height={H} fill={SC.soft} />
      <Grid />
      {view === 'web' && (
        <g opacity={clamp(back(t / 0.6)) * (1 - p(t, 13.5, 14))}>
          <Browser x={50} y={60} w={420} h={400}>
            <g transform="translate(20 20)">
              <g opacity={1 - real}><Photo w={380} h={200} subject="stock" /></g>
              <g opacity={real}><Photo w={380} h={200} subject="counter" /></g>
              <text y={236} fontSize={21} fontWeight={900} fill={SC.text}>{real > 0.5 ? 'Udhaar, off paper.' : 'Smart accounting solutions'}</text>
              <text y={262} fontSize={13} fontWeight={700} fill={SC.muted}>{real > 0.5 ? 'For kirana and general stores like yours.' : 'Empowering businesses with synergy.'}</text>
              <rect y={284} width={150} height={40} rx={10} fill={SC.brand} />
              <text x={75} y={309} textAnchor="middle" fontSize={13} fontWeight={800} fill="#fff">{real > 0.5 ? 'Try free' : 'Learn more'}</text>
            </g>
          </Browser>
        </g>
      )}
      {view === 'stock' && (
        <g opacity={p(t, 14, 14.5) * (1 - p(t, 17.5, 18))}>
          <Phone x={110} y={50} title="Stock">
            {[['Atta, 5 kg', 'pack5', '₹265'], ['Atta, 10 kg', 'pack10', '₹520'], ['Atta, 5 kg (chakki)', 'pack5', '₹290']].map(([n, s, pr], k) => (
              <g key={n} transform={`translate(0 ${k * 80})`} opacity={p(t, 14.4 + k * 0.4, 14.9 + k * 0.4)}>
                <rect width={220} height={68} rx={12} fill={SC.surface} stroke={SC.line} />
                <g transform="translate(8 8)"><Photo w={52} h={52} subject={s as 'pack5' | 'pack10'} /></g>
                <text x={72} y={30} fontSize={13.5} fontWeight={800} fill={SC.text}>{n}</text>
                <text x={72} y={50} fontSize={12} fontWeight={700} fill={SC.muted}>{pr} · 14 in stock</text>
              </g>
            ))}
          </Phone>
        </g>
      )}
      {view === 'welcome' && (
        <g opacity={p(t, 18, 18.5) * (1 - p(t, 21.5, 22))}>
          <Phone x={110} y={50} title="Welcome to Hisaab">
            <SlotArt kind="illus" w={220} h={180} cloud />
            <text y={214} fontSize={16} fontWeight={900} fill={SC.text}>Your khata is backed up</text>
            <text y={236} fontSize={16} fontWeight={900} fill={SC.text}>every night</text>
            <text y={262} fontSize={12} fontWeight={700} fill={SC.muted}>Lose your phone, keep every entry.</text>
            <rect y={318} width={220} height={46} rx={10} fill={SC.brand} />
            <text x={110} y={346} textAnchor="middle" fontSize={14} fontWeight={800} fill="#fff">Next</text>
          </Phone>
        </g>
      )}
      {view === 'ledger' && (
        <g opacity={p(t, 22, 22.5) * (1 - p(t, 29.5, 30))}>
          <Phone x={110} y={50} title="Udhaar">
            <svg x={0} y={0} width={220} height={360} viewBox="0 0 220 360" overflow="hidden">
              <g opacity={banner}><Photo w={220} h={120 * banner} subject="counter" /></g>
              {LEDGER.map(([n, a], k) => (
                <g key={n} transform={`translate(0 ${126 * banner + k * 42})`}>
                  <line x1={0} x2={220} y1={38} y2={38} stroke={SC.line} />
                  <text y={24} fontSize={13} fontWeight={800} fill={SC.text}>{n}</text>
                  <text x={220} y={24} textAnchor="end" fontSize={13} fontWeight={800} fill={SC.text} style={{ fontVariantNumeric: 'tabular-nums' }}>₹{a}</text>
                </g>
              ))}
            </svg>
          </Phone>
        </g>
      )}

      {t >= 4.6 && t < 9.4 && (
        <g transform="translate(520 130)" opacity={fade(4.6, 9.4)}>
          <text fontSize={20} fontWeight={900} fill={SC.text}>“Who is this for?”</text>
          {FACES.map((f, k) => (
            <g key={k} transform={`translate(${k * 78} 40)`} opacity={p(t, 5.2 + k * 0.4, 5.6 + k * 0.4)}>
              <circle cx={30} cy={30} r={26} fill={['#a86f4c', '#c58c63', '#8d5a3b', '#b87b55', '#9c6644'][k]} />
              <text x={30} y={82} textAnchor="middle" fontSize={12} fontWeight={800} fill={SC.text}>{f}</text>
            </g>
          ))}
          <text y={170} fontSize={16} fontWeight={800} fill={SC.error} opacity={p(t, 7.4, 7.8)}>3 of 5 shopkeepers thought it was a bank.</text>
        </g>
      )}
      {t >= 9.4 && t < 14 && (
        <g transform="translate(520 150)" opacity={fade(9.4, 14)}>
          <text fontSize={20} fontWeight={900} fill={SC.text}>Show the real user</text>
          <text y={32} fontSize={15} fontWeight={700} fill={SC.muted}>Ramesh ji, at his own counter,</text>
          <text y={56} fontSize={15} fontWeight={700} fill={SC.muted}>the old paper register beside his phone.</text>
        </g>
      )}
      {t >= 14 && t < 18 && (
        <g transform="translate(450 160)" opacity={fade(14, 18)}>
          <text fontSize={20} fontWeight={900} fill={SC.text}>Photo: the real thing</text>
          <text y={32} fontSize={15} fontWeight={700} fill={SC.muted}>The 5 kg and 10 kg packs, told apart at a glance,</text>
          <text y={56} fontSize={15} fontWeight={700} fill={SC.muted}>the way he does it on the shelf.</text>
        </g>
      )}
      {t >= 18 && t < 22 && (
        <g transform="translate(450 160)" opacity={fade(18, 22)}>
          <text fontSize={20} fontWeight={900} fill={SC.text}>Illustration: the idea</text>
          <text y={32} fontSize={15} fontWeight={700} fill={SC.muted}>No camera can catch “backed up”.</text>
          <text y={56} fontSize={15} fontWeight={700} fill={SC.muted}>A khata and a cloud, in one flat style.</text>
        </g>
      )}
      {t >= 22 && t < 26 && (
        <g transform="translate(450 160)" opacity={fade(22, 26)}>
          <text fontSize={20} fontWeight={900} fill={SC.text}>Nothing: the numbers are the content</text>
          <text y={36} fontSize={36} fontWeight={900} fill={SC.text}>{t < 24 ? 5 : Math.round(lerp(5, 8, p(t, 24, 24.6)))} rows</text>
          <text y={64} fontSize={15} fontWeight={700} fill={SC.muted}>fit on the screen{t >= 24.6 ? ' without the banner.' : ' under the banner.'}</text>
        </g>
      )}
      {t >= 26 && t < 30.4 && (
        <g transform="translate(450 140)" opacity={fade(26, 30.4)}>
          <text fontSize={20} fontWeight={900} fill={SC.text}>Every photo costs data</text>
          {([['6 photos', 720], ['6 illustrations', 48]] as const).map(([n, kb], k) => (
            <g key={n} transform={`translate(0 ${40 + k * 74})`}>
              <text fontSize={14} fontWeight={800} fill={SC.text}>{n}</text>
              <text x={440} textAnchor="end" fontSize={14} fontWeight={800} fill={SC.muted} style={{ fontVariantNumeric: 'tabular-nums' }}>{kb} kB · {(kb * 8 / 1000).toFixed(1)} s on 1 Mbps</text>
              <rect y={12} width={440} height={16} rx={8} fill={SC.surface} stroke={SC.line} />
              <rect y={12} width={440 * (kb / 720) * p(t, 26.6 + k * 0.4, 28 + k * 0.4)} height={16} rx={8} fill={k ? SC.mint : SC.error} />
            </g>
          ))}
        </g>
      )}
      {t >= 30 && (
        <g transform="translate(50 120)" opacity={p(t, 30.2, 30.8)}>
          <text x={430} y={-30} textAnchor="middle" fontSize={22} fontWeight={900} fill={SC.text}>Every image has a job</text>
          {(['photo', 'illus', 'icon', 'none'] as const).map((k, i) => (
            <g key={k} transform={`translate(${i * 220} 0)`} opacity={p(t, 30.4 + i * 0.4, 30.9 + i * 0.4)}>
              <rect width={200} height={260} rx={18} fill={SC.surface} stroke={SC.line} />
              <g transform="translate(20 20)"><SlotArt kind={k} w={160} h={120} subject="counter" cloud /></g>
              <text x={20} y={176} fontSize={16} fontWeight={900} fill={SC.text}>{KIND_NAME[k]}</text>
              <text x={20} y={200} fontSize={12.5} fontWeight={700} fill={SC.muted}>{['for the real thing', 'for an idea', 'to label a row', 'for the numbers'][i]}</text>
              <text x={20} y={236} fontSize={12} fontWeight={800} fill={SC.muted}>{IMAGE_KB[k]} kB</text>
            </g>
          ))}
        </g>
      )}
    </svg>
  );
}
