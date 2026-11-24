'use client';
// Scene for pr.2-4: Shobha, a Jayanagar school teacher with vestibular migraine, turns on Reduce motion. Dabba ignores it:
// the lunch photo drifts (parallax), offers slide by themselves, pages slide and meals zoom open, and she closes the app.
// Then the setting as a signal (the media query and useReducedMotion), travel swapped for fades, what plays by itself
// stopped, and the small meaningful motion kept, ending on the same screen with Reduce motion off and on.
// `DabbaHome` draws every part of `DABBA_MOTIONS` in its full, stopped, faded or kept form and is shared with the Calm
// the home screen game. Pure function of t (0–36).
import { bezierAt, EASE_CURVES, type DabbaPart, type ReduceLane } from '@shape/content';
import { back, clamp, Grid, lerp, p, SC } from './shared';
import { DABBA, DABBA_SOFT, INK, INK_MUTED } from './EaseCurves';

const W = 960, H = 540;
const MONO = 'ui-monospace, Consolas, monospace';
const out = (k: number) => bezierAt(EASE_CURVES.out, clamp(k));
const inout = (k: number) => bezierAt(EASE_CURVES.inout, clamp(k));

export type PartMode = 'full' | ReduceLane;
export type Overlay = 'page' | 'sheet' | 'confetti';
export const OVERLAYS: readonly DabbaPart[] = ['page', 'sheet', 'confetti'];
const OFFERS = [['₹20 off your first week', DABBA], ['Free raita on Fridays', '#7A2E0E'], ['Refer a friend, get a day free', '#344054']] as const;

/** Where a part sits on the 260 × 500 phone (for rings). */
export const PART_BOX: Record<DabbaPart, [number, number, number, number]> = {
  hero: [12, 56, 236, 96], offers: [12, 160, 236, 58], press: [178, 236, 66, 36], fly: [20, 232, 228, 220],
  badge: [178, 452, 50, 44], toast: [20, 380, 220, 36], spinner: [12, 410, 236, 38], page: [4, 4, 252, 492],
  sheet: [4, 4, 252, 492], confetti: [4, 4, 252, 492],
};

/** Dabba's home screen at `time` seconds, each part drawn in its mode. `overlay` plays a page, a zooming meal or confetti. */
export function DabbaHome({ time, modes, overlay, ring }: { time: number; modes: Partial<Record<DabbaPart, PartMode>>; overlay?: Overlay; ring?: DabbaPart }) {
  const m = (part: DabbaPart): PartMode => modes[part] ?? 'full';
  const moves = (part: DabbaPart) => m(part) === 'full' || m(part) === 'keep';
  const c = ((time % 4) + 4) % 4 / 4;
  const pressed = m('press') !== 'stop' && c > 0.08 && c < 0.16;
  const fly = clamp((c - 0.16) / 0.22), landed = c >= 0.38;
  const count = m('badge') === 'stop' ? 2 : landed ? 3 : 2;
  const bump = landed && moves('badge') ? clamp(1 - (c - 0.38) / 0.08) : 0;
  const glow = landed && m('fly') === 'fade' ? clamp(1 - (c - 0.38) / 0.2) : 0;
  const toastK = m('toast') === 'stop' ? 0 : clamp((c - 0.42) / 0.06) * clamp((0.92 - c) / 0.06);
  const offer = moves('offers') || m('offers') === 'fade' ? Math.floor(time / 3) % 3 : 0;
  const slideK = clamp(((time % 3) + 3) % 3 / 0.45);
  const parallax = moves('hero') ? Math.sin(time * 1.4) * 14 : 0;
  const ov = overlay ? m(overlay) : 'full';
  const ovK = clamp((c - 0.05) / 0.2);

  return (
    <g>
      <clipPath id="dabba-home"><rect width={260} height={500} rx={30} /></clipPath>
      <rect width={260} height={500} rx={30} fill="#FFFFFF" stroke={SC.line} strokeWidth={2} />
      <g clipPath="url(#dabba-home)">
        <text x={20} y={38} fontSize={12} fontWeight={900} fill={DABBA}>DABBA</text>
        <text x={240} y={38} textAnchor="end" fontSize={11} fontWeight={700} fill={INK_MUTED}>Hi, Shobha</text>
        {/* hero photo, with parallax */}
        <clipPath id="dabba-hero"><rect x={12} y={56} width={236} height={96} rx={14} /></clipPath>
        <g clipPath="url(#dabba-hero)">
          <rect x={12} y={40 + parallax} width={236} height={130} fill="#F7C99A" />
          <circle cx={90} cy={104 + parallax} r={34} fill={DABBA} opacity={0.75} />
          <circle cx={150} cy={96 + parallax} r={24} fill="#7A2E0E" opacity={0.55} />
          <text x={24} y={140} fontSize={12.5} fontWeight={900} fill={INK}>This week’s lunches</text>
        </g>
        {/* offers carousel */}
        <clipPath id="dabba-offers"><rect x={12} y={160} width={236} height={58} rx={12} /></clipPath>
        <g clipPath="url(#dabba-offers)">
          {OFFERS.map(([l, col], i) => {
            const prev = (offer + 2) % 3, e = inout(slideK), still = m('offers') === 'stop';
            const shown = still ? i === 0 : i === offer || i === prev;
            if (!shown) return null;
            const fade = m('offers') === 'fade';
            const x = still || fade ? 12 : i === offer ? 12 + (1 - e) * 236 : 12 - e * 236;
            const op = fade ? (i === offer ? e : 1 - e) : 1;
            return (
              <g key={l} opacity={op}>
                <rect x={x} y={160} width={236} height={58} rx={12} fill={col} />
                <text x={x + 16} y={194} fontSize={12.5} fontWeight={800} fill="#FFFFFF">{l}</text>
              </g>
            );
          })}
        </g>
        {m('offers') === 'stop' && (
          <g>
            <circle cx={232} cy={189} r={11} fill="#FFFFFF" opacity={0.9} />
            <path d="M229 184 L235 189 L229 194" fill="none" stroke={INK} strokeWidth={2} strokeLinecap="round" />
            {[0, 1, 2].map(i => <circle key={i} cx={118 + i * 12} cy={226} r={3} fill={i === 0 ? DABBA : '#D0D5DD'} />)}
          </g>
        )}
        {/* the week */}
        {[['Mon', 'Veg pulao', true], ['Tue', 'Rajma chawal', false], ['Wed', 'Paneer roll', true], ['Thu', 'Curd rice', true]].map(([d, meal, added], i) => (
          <g key={d as string} transform={`translate(16 ${236 + i * 44})`}>
            <rect width={228} height={36} rx={10} fill="#FFFFFF" stroke="#EAECF0" strokeWidth={1.5} />
            <text x={12} y={23} fontSize={10.5} fontWeight={800} fill={INK_MUTED}>{d}</text>
            <text x={44} y={23} fontSize={11.5} fontWeight={700} fill={INK}>{meal}</text>
            {!added && (
              <g transform="translate(164 5)">
                <rect width={56} height={26} rx={8} fill={pressed ? '#8A3209' : DABBA} />
                <text x={28} y={17.5} textAnchor="middle" fontSize={11} fontWeight={800} fill="#FFFFFF">{landed ? 'Added' : 'Add'}</text>
              </g>
            )}
          </g>
        ))}
        {moves('fly') && c > 0.16 && !landed && (
          <circle cx={lerp(200, 203, fly)} cy={lerp(298, 470, out(fly)) - Math.sin(fly * Math.PI) * 30} r={lerp(10, 5, fly)} fill={DABBA} opacity={0.9} />
        )}
        {/* toast */}
        <g transform={`translate(20 ${380 + (m('toast') === 'fade' ? 0 : (1 - toastK) * 8)})`} opacity={toastK}>
          <rect width={220} height={30} rx={9} fill={INK} />
          <text x={12} y={19.5} fontSize={11} fontWeight={700} fill="#FFFFFF">Added to Tuesday</text>
          <text x={208} y={19.5} textAnchor="end" fontSize={11} fontWeight={800} fill="#FDB022">Undo</text>
        </g>
        {/* paying */}
        <g transform="translate(12 416)">
          <rect width={236} height={30} rx={9} fill={DABBA_SOFT} />
          <g transform={`translate(20 15) rotate(${m('spinner') === 'stop' ? 40 : m('spinner') === 'fade' ? 0 : (time * 400) % 360})`} opacity={m('spinner') === 'fade' ? 0.5 + 0.5 * Math.abs(Math.sin(time * 2)) : 1}>
            <circle r={7} fill="none" stroke="#F7C99A" strokeWidth={2.5} />
            <path d="M0 -7 A7 7 0 0 1 7 0" fill="none" stroke={DABBA} strokeWidth={2.5} strokeLinecap="round" />
          </g>
          <text x={36} y={19} fontSize={11} fontWeight={700} fill={INK}>Waiting for your UPI app…</text>
        </g>
        {/* tab bar and cart */}
        <rect x={0} y={452} width={260} height={48} fill="#F9FAFB" />
        <line x1={0} x2={260} y1={452} y2={452} stroke="#EAECF0" />
        {['Week', 'Menu', 'Plans'].map((l, i) => <text key={l} x={36 + i * 60} y={480} textAnchor="middle" fontSize={10.5} fontWeight={800} fill={i ? INK_MUTED : DABBA}>{l}</text>)}
        <g transform="translate(203 474)">
          {glow > 0 && <circle r={22} fill={DABBA} opacity={glow * 0.25} />}
          <path d="M-11 -7 H-7 L-3 7 H9 L12 -3 H-5" fill="none" stroke={INK} strokeWidth={2} strokeLinejoin="round" />
          <circle cx={-1} cy={11} r={1.8} fill={INK} /><circle cx={7} cy={11} r={1.8} fill={INK} />
          <g transform={`translate(12 -10) scale(${1 + bump * 0.3})`}>
            <circle r={8} fill={DABBA} />
            <text y={4} textAnchor="middle" fontSize={10} fontWeight={900} fill="#FFFFFF">{count}</text>
          </g>
        </g>

        {overlay === 'page' && (() => {
          const k = ov === 'stop' ? 1 : ov === 'fade' ? out(ovK * 2.5) : inout(ovK);
          const x = ov === 'fade' || ov === 'stop' ? 0 : lerp(260, 0, k);
          return (
            <g transform={`translate(${x} 0)`} opacity={ov === 'fade' ? k : 1}>
              <rect width={260} height={500} fill="#FFFFFF" />
              <text x={20} y={44} fontSize={11} fontWeight={800} fill={INK_MUTED}>‹ Back</text>
              <text x={20} y={76} fontSize={18} fontWeight={900} fill={INK}>Plans</text>
              {['5 days · ₹495', '20 days · ₹1,880', 'Pause anytime'].map((l, i) => <g key={l}><rect x={20} y={96 + i * 56} width={220} height={44} rx={12} fill={i ? '#FFFFFF' : DABBA_SOFT} stroke={DABBA} strokeWidth={1} /><text x={34} y={123 + i * 56} fontSize={12.5} fontWeight={800} fill={INK}>{l}</text></g>)}
            </g>
          );
        })()}
        {overlay === 'sheet' && (() => {
          const k = ov === 'stop' ? 1 : ov === 'fade' ? out(ovK * 2.5) : out(ovK);
          const s = ov === 'full' || ov === 'keep' ? lerp(0.2, 1, k) : 1;
          return (
            <g transform={`translate(${lerp(196, 130, ov === 'full' || ov === 'keep' ? k : 1)} ${lerp(296, 250, ov === 'full' || ov === 'keep' ? k : 1)}) scale(${s}) translate(-130 -250)`} opacity={ov === 'fade' ? k : 1}>
              <rect width={260} height={500} fill="#FFFFFF" />
              <rect x={0} y={0} width={260} height={180} fill="#F7C99A" />
              <circle cx={130} cy={92} r={52} fill={DABBA} opacity={0.75} />
              <text x={20} y={214} fontSize={18} fontWeight={900} fill={INK}>Rajma chawal</text>
              <text x={20} y={236} fontSize={12} fontWeight={700} fill={INK_MUTED}>₹99 · Tuesday · Veg</text>
              <rect x={20} y={256} width={220} height={42} rx={12} fill={DABBA} />
              <text x={130} y={282} textAnchor="middle" fontSize={13} fontWeight={800} fill="#FFFFFF">Add to Tuesday</text>
            </g>
          );
        })()}
        {overlay === 'confetti' && (
          <g>
            <rect width={260} height={500} fill="#FFFFFF" opacity={0.92} />
            <circle cx={130} cy={210} r={36} fill="#067647" />
            <path d="M114 211 L126 223 L148 199" fill="none" stroke="#FFFFFF" strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" />
            <text x={130} y={280} textAnchor="middle" fontSize={15} fontWeight={900} fill={INK}>Order placed</text>
            {(ov === 'full' || ov === 'keep' || ov === 'fade') && Array.from({ length: 22 }, (_, i) => {
              const a = (i / 22) * Math.PI * 2, r = out(ovK * 1.5) * (90 + (i % 5) * 22);
              return <rect key={i} x={130 + Math.cos(a) * r} y={210 + Math.sin(a) * r + ovK * 60} width={8} height={4} fill={['#F79009', DABBA, '#2E90FA', '#12B76A'][i % 4]} transform={`rotate(${time * 500 + i * 40} ${130 + Math.cos(a) * r} ${210 + Math.sin(a) * r + ovK * 60})`} opacity={1 - ovK * 0.6} />;
            })}
          </g>
        )}
      </g>
      {ring && (() => {
        const [x, y, w, h] = PART_BOX[ring];
        return <rect x={x - 4} y={y - 4} width={w + 8} height={h + 8} rx={14} fill="none" stroke={SC.brand} strokeWidth={3} strokeDasharray="6 4" />;
      })()}
    </g>
  );
}

const FULL: Partial<Record<DabbaPart, PartMode>> = {};
const FADED: Partial<Record<DabbaPart, PartMode>> = { page: 'fade', sheet: 'fade', fly: 'fade' };
const CALM: Partial<Record<DabbaPart, PartMode>> = { ...FADED, hero: 'stop', offers: 'stop', confetti: 'stop' };

function Settings({ on }: { on: number }) {
  return (
    <g>
      <rect width={260} height={500} rx={30} fill="#F2F4F7" stroke={SC.line} strokeWidth={2} />
      <text x={20} y={44} fontSize={11} fontWeight={800} fill="#475467">‹ Accessibility</text>
      <text x={20} y={78} fontSize={20} fontWeight={900} fill={INK}>Motion</text>
      <rect x={12} y={98} width={236} height={112} rx={14} fill="#FFFFFF" />
      <text x={28} y={130} fontSize={13} fontWeight={800} fill={INK}>Reduce motion</text>
      <g transform="translate(192 114)">
        <rect width={44} height={26} rx={13} fill={on > 0.5 ? '#12B76A' : '#D0D5DD'} />
        <circle cx={lerp(13, 31, on)} cy={13} r={11} fill="#FFFFFF" />
      </g>
      <text x={28} y={162} fontSize={10.5} fontWeight={700} fill="#475467">Reduce the motion of the user</text>
      <text x={28} y={177} fontSize={10.5} fontWeight={700} fill="#475467">interface, including parallax</text>
      <text x={28} y={192} fontSize={10.5} fontWeight={700} fill="#475467">and zooming.</text>
      <rect x={12} y={222} width={236} height={48} rx={14} fill="#FFFFFF" />
      <text x={28} y={251} fontSize={13} fontWeight={800} fill={INK}>Auto-play video previews</text>
    </g>
  );
}

export function ReducedMotionScene({ t }: { t: number }) {
  const intro = clamp(back(t / 0.6));
  const fin = p(t, 31, 31.6);
  const px = 120, py = 20;
  const seg = t < 6 ? 'settings' : t < 12 ? 'ignored' : t < 17 ? 'signal' : t < 22 ? 'fade' : t < 27 ? 'stop' : 'keep';
  const overlay: Overlay | undefined = seg === 'ignored' ? (Math.floor((t - 6) / 4) % 2 ? 'sheet' : 'page') : seg === 'fade' ? (Math.floor((t - 17) / 2.5) % 2 ? 'sheet' : 'page') : seg === 'stop' && t >= 25 ? 'confetti' : undefined;
  const modes = seg === 'ignored' ? FULL : seg === 'fade' ? FADED : CALM;
  const keepRing: DabbaPart = (['press', 'toast', 'spinner', 'badge'] as const)[Math.floor(clamp((t - 27) / 4) * 3.99)];
  const ring: DabbaPart | undefined = seg === 'stop' ? (t < 23.6 ? 'hero' : t < 25 ? 'offers' : 'confetti') : seg === 'keep' ? keepRing : undefined;
  const dizzy = seg === 'ignored' ? p(t, 6.5, 11) : 0;

  const side: Record<string, { title: string; lines: string[]; tone?: string }> = {
    settings: { title: 'Shobha turns on Reduce motion', lines: ['She has vestibular migraine. Large movement', 'on a screen can make her dizzy for hours.', 'Settings › Accessibility › Motion.'] },
    ignored: { title: 'Dabba ignores it', tone: SC.error, lines: ['The photo drifts as she scrolls, offers slide', 'by themselves, pages slide, meals zoom open.'] },
    fade: { title: 'Swap travel for a fade', lines: ['Pages and meals fade in where they open.', 'The meal no longer flies to the cart: the', 'badge changes to 3 with a brief highlight.'] },
    stop: { title: 'Stop what plays by itself', lines: ['The photo holds still. Offers wait for her,', 'with an arrow and dots. The confetti goes;', 'the tick says it all.'] },
    keep: { title: 'Keep what tells her something', lines: ['The press, the toast, the spinner, the badge:', 'small, and they carry meaning.', 'Reduce motion, don’t remove it.'] },
  };

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" role="img" aria-label="Animated story: Dabba ignores Shobha's Reduce motion setting, then listens to it: large travel becomes fades, motion that plays by itself stops, and small meaningful motion stays">
      <rect width={W} height={H} fill={SC.soft} />
      <Grid />
      <g opacity={intro * (1 - fin)}>
        {seg !== 'signal' && (
          <g transform={`translate(${px} ${py}) rotate(${Math.sin(t * 5) * 1.5 * dizzy} 130 250)`}>
            {seg === 'settings' ? <Settings on={p(t, 3, 3.5)} /> : <DabbaHome time={t} modes={modes} overlay={overlay} ring={ring} />}
          </g>
        )}
        {seg !== 'signal' && (
          <g transform="translate(470 120)">
            <text x={0} y={0} fontSize={26} fontWeight={900} fill={side[seg].tone ?? SC.text}>{side[seg].title}</text>
            {side[seg].lines.map((l, i) => <text key={l} x={0} y={40 + i * 24} fontSize={15} fontWeight={700} fill={SC.muted} opacity={p(t, (seg === 'settings' ? 0.5 : 6) + i * 0.4, (seg === 'settings' ? 1 : 6.5) + i * 0.4)}>{l}</text>)}
            {seg === 'ignored' && (
              <g transform="translate(0 130)">
                <text x={0} y={0} fontSize={13} fontWeight={800} fill={SC.text}>How Shobha feels</text>
                <rect x={0} y={12} width={320} height={14} rx={7} fill={SC.line} />
                <rect x={0} y={12} width={320 * dizzy} height={14} rx={7} fill={SC.error} />
                <text x={0} y={52} fontSize={13} fontWeight={800} fill={SC.error} opacity={p(t, 10.6, 11)}>Two minutes in, she closes the app.</text>
              </g>
            )}
          </g>
        )}
        {seg === 'signal' && (
          <g transform="translate(130 80)" opacity={p(t, 12, 12.5)}>
            <text x={0} y={0} fontSize={26} fontWeight={900} fill={SC.text}>The setting is a signal</text>
            <text x={0} y={32} fontSize={15} fontWeight={700} fill={SC.muted}>Her phone passes the choice to every app and website.</text>
            {[{ h: 'CSS', lines: ['@media (prefers-reduced-motion: reduce) {', '  .page-enter { animation: fade-in 150ms; }', '  .offers { animation-play-state: paused; }', '}'] },
              { h: 'React with Motion', lines: ['const reduce = useReducedMotion();', '<motion.div initial={reduce', '  ? { opacity: 0 } : { x: 390 }} />'] }].map((b, i) => (
              <g key={b.h} transform={`translate(${i * 360} 70)`} opacity={p(t, 12.6 + i * 1.2, 13.2 + i * 1.2)}>
                <rect width={340} height={170} rx={14} fill={SC.surface} stroke={SC.line} strokeWidth={1.5} />
                <text x={18} y={30} fontSize={12} fontWeight={900} fill={SC.text}>{b.h}</text>
                {b.lines.map((l, k) => <text key={l} x={18} y={62 + k * 22} fontSize={11.5} fontWeight={700} fill={k === 0 ? SC.brand : SC.text} fontFamily={MONO}>{l}</text>)}
              </g>
            ))}
            <text x={0} y={290} fontSize={15} fontWeight={800} fill={SC.text} opacity={p(t, 15, 15.5)}>Dabba only had to listen. Now: decide what each motion becomes.</text>
          </g>
        )}
      </g>

      {t >= 31 && (
        <g opacity={fin}>
          <text x={W / 2} y={44} textAnchor="middle" fontSize={22} fontWeight={900} fill={SC.text}>Same app, calmer. Every message still arrives.</text>
          {[['Reduce motion off', FULL], ['Reduce motion on', CALM]].map(([l, md], i) => (
            <g key={l as string} transform={`translate(${250 + i * 260} 66) scale(0.88)`}>
              <DabbaHome time={t} modes={md as Partial<Record<DabbaPart, PartMode>>} overlay={Math.floor((t - 31) / 2.5) % 2 ? 'page' : undefined} />
              <text x={130} y={528} textAnchor="middle" fontSize={15} fontWeight={900} fill={SC.text}>{l as string}</text>
            </g>
          ))}
        </g>
      )}
    </svg>
  );
}
