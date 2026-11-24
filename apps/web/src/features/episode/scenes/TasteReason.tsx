'use client';
// Scene for fd.3-1: Kosh's home screen is up for review. Three taste comments arrive and give the designer nothing to
// act on; each is asked "Why?". "Make it pop" and "Feels off" turn into reasons that pin to the screen, the purple one
// drops into the taste tray, and two more reasoned comments pin to the buttons and the fee. Then see + effect + goal.
// Pure function of t (0–34).
import type { KoshPart } from '@shape/content';
import { back, clamp, Grid, lerp, p, SC } from './shared';

const W = 960, H = 540;
/** Banner fill: violet that carries white text at 7:1 in both themes. */
const VIOLET = '#6D28D9';

/** Where each part of the phone sits (in the 240 × 440 phone's own coordinates). */
export const KOSH_BOX: Record<KoshPart, { y: number; h: number }> = {
  balance: { y: 66, h: 46 },
  banner: { y: 118, h: 100 },
  actions: { y: 226, h: 56 },
  fee: { y: 286, h: 20 },
  history: { y: 314, h: 112 },
};

/** Kosh's home screen in a 240 × 440 phone, with its review problems baked in: a small balance under a loud banner,
 *  twin buttons, a faint fee line and payments listed by UPI ID. `lit` outlines one part. Shared with Taste or reason?. */
export function KoshHome({ lit, dim = 0 }: { lit?: KoshPart | null; dim?: number }) {
  const box = lit ? KOSH_BOX[lit] : null;
  return (
    <g>
      <rect width={240} height={440} rx={30} fill={SC.surface} stroke={SC.text} strokeOpacity={0.5} strokeWidth={3} />
      <rect x={95} y={14} width={50} height={6} rx={3} fill={SC.line} />
      <g opacity={1 - dim}>
        <text x={22} y={50} fontSize={17} fontWeight={800} fill={SC.text}>Kosh</text>
        <circle cx={208} cy={45} r={11} fill={SC.line} />
        <text x={22} y={84} fontSize={10} fontWeight={600} fill={SC.muted}>Balance</text>
        <text x={22} y={104} fontSize={15} fontWeight={800} fill={SC.text}>₹12,450.5</text>
        <rect x={14} y={122} width={212} height={92} rx={14} fill={VIOLET} />
        <text x={30} y={158} fontSize={19} fontWeight={800} fill="#fff">5% cashback</text>
        <text x={30} y={180} fontSize={12} fontWeight={600} fill="#fff">on every electricity bill</text>
        <rect x={30} y={190} width={64} height={14} rx={7} fill="#fff" opacity={0.25} />
        {['Pay', 'Request'].map((b, k) => (
          <g key={b}>
            <rect x={22 + k * 102} y={232} width={94} height={42} rx={12} fill={SC.soft} stroke={SC.line} strokeWidth={1.5} />
            <text x={69 + k * 102} y={258} textAnchor="middle" fontSize={13} fontWeight={700} fill={SC.text}>{b}</text>
          </g>
        ))}
        <text x={22} y={299} fontSize={8} fill={SC.muted} opacity={0.6}>₹10 fee on card top-ups</text>
        <text x={22} y={332} fontSize={11} fontWeight={800} fill={SC.text}>Recent</text>
        {['rahul.k@okaxis', '98xxxx4417@ybl', 'meera22@oksbi'].map((id, k) => (
          <g key={id} transform={`translate(22 ${344 + k * 26})`}>
            <circle cx={9} cy={9} r={9} fill={SC.line} />
            <text x={26} y={13} fontSize={10} fill={SC.text}>{id}</text>
            <text x={196} y={13} textAnchor="end" fontSize={10} fontWeight={700} fill={SC.text}>−₹{[250, 1200, 80][k]}</text>
          </g>
        ))}
      </g>
      {box && <rect x={8} y={box.y - 2} width={224} height={box.h + 4} rx={12} fill="none" stroke={SC.design} strokeWidth={3} strokeDasharray="7 5" />}
    </g>
  );
}

const PX = 360, PY = 60;   // the phone's spot in the scene
const TASTE = ['“I don’t love the purple.”', '“Make it pop.”', '“Feels a bit off.”'];
const REASONS: { part: KoshPart; at: number; l1: string; l2: string; y: number }[] = [
  { part: 'balance', at: 17.4, l1: '“Off” → ₹12,450.5 is missing a 0', l2: 'and reads like a mistake', y: 112 },
  { part: 'banner', at: 16.2, l1: '“Pop” → the banner outshouts', l2: 'the balance people came to see', y: 206 },
  { part: 'actions', at: 19.4, l1: 'Pay and Request look the same:', l2: 'one wrong tap at the counter', y: 300 },
  { part: 'fee', at: 21, l1: 'The ₹10 fee is tiny and grey:', l2: 'missed on a phone in sunlight', y: 394 },
];

export function TasteReasonScene({ t }: { t: number }) {
  const fin = p(t, 29, 29.8);
  const enter = back((t - 0.2) / 0.7);
  const latest = [...REASONS].filter(r => t >= r.at && t < r.at + 1.6).pop();
  const leftFade = 1 - p(t, 22.6, 23.2);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" role="img" aria-label="Animated story: taste comments on a payments app's home screen are asked why, and the reasoned ones pin to the screen">
      <rect width={W} height={H} fill={SC.soft} />
      <Grid />
      <g opacity={1 - fin}>
        <text x={480} y={34} textAnchor="middle" fontSize={15} fontWeight={800} fill={SC.muted} opacity={1 - p(t, 4.4, 5)}>Design review · Kosh home screen</text>
        <g transform={`translate(${PX + 120} ${PY + 220}) scale(${clamp(enter)}) translate(-120 -220)`}><KoshHome lit={latest?.part} /></g>

        {/* taste bubbles, each asked why */}
        <g opacity={leftFade}>
          {TASTE.map((c, i) => {
            const at = 5.2 + i * 1.3, y = 120 + i * 86;
            if (t < at) return null;
            const why = p(t, 11.3 + i * 1.1, 11.8 + i * 1.1);
            const turned = i === 0 ? 0 : p(t, i === 1 ? 15.8 : 17, i === 1 ? 16.3 : 17.5);   // pop and off become reasons
            const drop = i === 0 ? p(t, 16.6, 17.4) : 0;                                      // purple falls to the tray
            return (
              <g key={c} transform={`translate(170 ${y + lerp(0, 475 - y, drop)}) scale(${clamp(back((t - at) / 0.4))}) translate(-170 ${-y})`} opacity={1 - turned}>
                <rect x={40} y={y - 26} width={260} height={52} rx={16} fill={SC.surface} stroke={SC.line} strokeWidth={2} />
                <text x={170} y={y + 6} textAnchor="middle" fontSize={16} fontWeight={700} fill={SC.text}>{c}</text>
                {why > 0 && drop === 0 && (
                  <g opacity={why}>
                    <rect x={248} y={y - 44} width={62} height={26} rx={13} fill={SC.surface} stroke={SC.design} strokeWidth={2} />
                    <text x={279} y={y - 26} textAnchor="middle" fontSize={13} fontWeight={800} fill={SC.text}>Why?</text>
                  </g>
                )}
              </g>
            );
          })}
          {t >= 9 && t < 11.3 && <text x={170} y={392} textAnchor="middle" fontSize={14} fontWeight={700} fill={SC.muted} opacity={clamp((t - 9) / 0.4)}>Strong feelings. Nothing to act on.</text>}
          {t >= 11.3 && <text x={170} y={392} textAnchor="middle" fontSize={14} fontWeight={700} fill={SC.muted} opacity={clamp((t - 11.3) / 0.4) * (1 - p(t, 16.2, 16.6))}>“What makes you say that?”</text>}
          {t >= 16.4 && (
            <g opacity={clamp((t - 16.4) / 0.4)}>
              <rect x={30} y={440} width={280} height={70} rx={16} fill="none" stroke={SC.muted} strokeWidth={2} strokeDasharray="6 5" />
              <text x={170} y={430} textAnchor="middle" fontSize={12} fontWeight={700} fill={SC.muted}>Taste tray: labelled, not evidence</text>
            </g>
          )}
        </g>

        {/* reasons pin to the screen */}
        {REASONS.map(r => {
          if (t < r.at) return null;
          const k = clamp(back((t - r.at) / 0.45)), line = p(t, r.at + 0.2, r.at + 0.8);
          const box = KOSH_BOX[r.part], ty = PY + box.y + box.h / 2;
          return (
            <g key={r.part}>
              <line x1={PX + 232} y1={ty} x2={lerp(PX + 232, 630, line)} y2={lerp(ty, r.y, line)} stroke={SC.design} strokeWidth={2.5} />
              <circle cx={PX + 232} cy={ty} r={5} fill={SC.design} />
              <g transform={`translate(780 ${r.y}) scale(${k})`}>
                <rect x={-150} y={-34} width={300} height={68} rx={14} fill={SC.surface} stroke={SC.design} strokeWidth={2.5} />
                <text x={-134} y={-6} fontSize={14} fontWeight={800} fill={SC.text}>{r.l1}</text>
                <text x={-134} y={16} fontSize={14} fontWeight={600} fill={SC.text}>{r.l2}</text>
              </g>
            </g>
          );
        })}

        {/* see + effect + goal */}
        {t >= 23 && [{ n: 'What I see', e: 'Pay and Request look the same', c: SC.discover }, { n: 'Effect on the user', e: 'a wrong tap at the counter', c: SC.design }, { n: 'Goal it hurts', e: 'paying quickly, with no mistakes', c: SC.mint }].map((f, i) => {
          const k = clamp(back((t - 23.3 - i * 0.6) / 0.45)), y = 130 + i * 120;
          return (
            <g key={f.n} transform={`translate(175 ${y}) scale(${k})`}>
              <rect x={-140} y={-38} width={280} height={76} rx={16} fill={SC.surface} stroke={f.c} strokeWidth={3} />
              <text y={-6} textAnchor="middle" fontSize={17} fontWeight={800} fill={SC.text}>{f.n}</text>
              <text y={20} textAnchor="middle" fontSize={13} fill={SC.muted}>{f.e}</text>
              {i < 2 && <text y={66} textAnchor="middle" fontSize={22} fontWeight={800} fill={SC.muted}>+</text>}
            </g>
          );
        })}
      </g>

      {fin > 0 && [{ x: 200, n: 'Taste', l: 'Data about the speaker', c: SC.muted }, { x: 480, n: 'Reason', l: 'See · effect · goal', c: SC.design }, { x: 760, n: 'Ask why', l: 'Turns a feeling into a reason', c: SC.mint }].map((f, i) => {
        const k = back((t - (29.2 + i * 0.25)) / 0.5);
        return (
          <g key={f.n} transform={`translate(${f.x} 260) scale(${clamp(k)})`}>
            <rect x={-125} y={-70} width={250} height={140} rx={18} fill={SC.surface} stroke={f.c} strokeWidth={3} />
            <text y={-8} textAnchor="middle" fontSize={24} fontWeight={800} fill={SC.text}>{f.n}</text>
            <text y={26} textAnchor="middle" fontSize={13} fontWeight={600} fill={SC.muted}>{f.l}</text>
          </g>
        );
      })}
    </svg>
  );
}
