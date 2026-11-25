'use client';
// Scene for cw.3-1: Taar raised Fibre 100 from ₹799 to ₹849 and the price was copied into 23 help pages; four were
// missed. Then the old “Reset your router” page comes apart into a content model: fields with rules, shared types
// referenced instead of copied (`TAAR_CHUNKS`, `editsFor`), tags from controlled lists, presentation left out, and one
// edit that reaches every channel (`TAAR_CHANNELS`). Pure function of t (0–36). Also exports `PLACE_FILL`, which
// `model-build` uses.
import { TAAR_CHANNELS, TAAR_CHUNKS, editsFor, type ModelPlace } from '@shape/content';
import { back, clamp, Grid, lerp, p, SC } from './shared';

const W = 640, H = 360;
/** One fill per place in the model; white text on each passes 4.5:1. */
export const PLACE_FILL: Record<ModelPlace, string> = { field: '#175CD3', type: '#6941C6', tag: '#067647', cut: '#B42318' };
const MISSED = new Set([5, 11, 17, 20]);

/** A rounded label with white text on a fill. */
function Pill({ x, y, w, text, fill, o = 1 }: { x: number; y: number; w: number; text: string; fill: string; o?: number }) {
  return (
    <g opacity={o}>
      <rect x={x} y={y} width={w} height={40} rx={20} fill={fill} />
      <text x={x + w / 2} y={y + 27} fontSize={21} fontWeight={800} fill="#fff" textAnchor="middle">{text}</text>
    </g>
  );
}

export function ContentModelScene({ t }: { t: number }) {
  const intro = clamp(back(t / 0.6));
  const title = t < 6 ? 'One price, 23 pages' : t < 11 ? 'Pull the page apart' : t < 16 ? 'Fields with rules' : t < 21 ? 'Shared things get a type' : t < 26 ? 'Tags, not folders' : t < 31 ? 'Leave the look out' : 'One edit, everywhere';

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" role="img" aria-label={`Animated story: Taar raised its Fibre 100 plan from ₹799 to ₹849. The price was copied into ${TAAR_CHUNKS.plan.pages} help pages, edited one by one, and four were missed. The old Reset your router page is pulled apart into a content model. The title, summary and steps become fields with rules, such as a 160-character summary. The plan, the router, the contact details and outage notices become their own types, referenced instead of copied. Topic, service and customer become tags from controlled lists. Presentation, like a blue box or the red button below, is left out for each channel to design. Then one edit to the Plan updates the website, the app, the IVR and Taar Assist.`}>
      <rect width={W} height={H} fill={SC.soft} />
      <Grid w={W} h={H} />
      <g opacity={intro}>
        <text x={32} y={44} fontSize={26} fontWeight={900} fill={SC.text}>{title}</text>

        {t < 6 && (
          <g>
            {Array.from({ length: TAAR_CHUNKS.plan.pages }, (_, i) => {
              const col = i % 8, row = Math.floor(i / 8);
              const done = t > 0.6 + i * 0.17;
              const missed = MISSED.has(i);
              const red = missed && t > 4.6;
              return (
                <g key={i}>
                  <rect x={32 + col * 72} y={72 + row * 62} width={64} height={50} rx={8} fill={SC.surface} stroke={red ? SC.error : SC.line} strokeWidth={red ? 3 : 2} />
                  <text x={64 + col * 72} y={104 + row * 62} fontSize={21} fontWeight={800} fill={red ? SC.error : SC.text} textAnchor="middle">{done && !missed ? '849' : '799'}</text>
                </g>
              );
            })}
            <text x={32} y={292} fontSize={21} fontWeight={700} fill={SC.muted} opacity={p(t, 1, 1.6)}>Rohan changes each copy by hand</text>
            <text x={32} y={330} fontSize={22} fontWeight={900} fill={SC.error} opacity={p(t, 4.6, 5.2)}>4 missed. Taar Assist reads one of them.</text>
          </g>
        )}

        {t >= 6 && t < 11 && (
          <g>
            <rect x={32} y={72} width={220} height={260} rx={12} fill={SC.surface} stroke={SC.line} strokeWidth={2} opacity={1 - p(t, 9.4, 10.4) * 0.6} />
            {[0, 1, 2, 3, 4, 5, 6, 7].map(i => <rect key={i} x={52} y={96 + i * 28} width={i % 3 === 2 ? 120 : 180} height={10} rx={5} fill={SC.line} opacity={1 - p(t, 7, 9)} />)}
            {['Title', 'Summary', 'Steps', 'Plan box, ₹849', 'Hub X2 router', 'Phone number'].map((s, i) => {
              const k = p(t, 6.6 + i * 0.4, 7.4 + i * 0.4);
              return (
                <g key={s} opacity={k} transform={`translate(${lerp(-200, 0, k)} 0)`}>
                  <rect x={292} y={72 + i * 44} width={316} height={36} rx={8} fill={SC.surface} stroke={SC.line} strokeWidth={2} />
                  <text x={308} y={97 + i * 44} fontSize={21} fontWeight={800} fill={SC.text}>{s}</text>
                </g>
              );
            })}
          </g>
        )}

        {t >= 11 && t < 16 && (() => {
          const n = Math.round(lerp(0, 160, p(t, 12.8, 14.6)));
          return (
            <g>
              <rect x={32} y={68} width={576} height={48} rx={10} fill={PLACE_FILL.field} />
              <text x={52} y={100} fontSize={22} fontWeight={900} fill="#fff">Help article</text>
              {[['title', 'plain text, up to 60'], ['summary', 'plain text, up to 160'], ['steps', 'a list, one action each']].map(([f, rule], i) => (
                <g key={f} opacity={p(t, 11.4 + i * 0.5, 12 + i * 0.5)}>
                  <rect x={32} y={128 + i * 52} width={576} height={44} rx={8} fill={SC.surface} stroke={SC.line} strokeWidth={2} />
                  <text x={52} y={157 + i * 52} fontSize={21} fontWeight={900} fill={SC.text}>{f}</text>
                  <text x={200} y={157 + i * 52} fontSize={21} fontWeight={700} fill={SC.muted}>{rule}</text>
                </g>
              ))}
              <g opacity={p(t, 12.6, 13)}>
                <rect x={32} y={300} width={460} height={14} rx={7} fill={SC.line} />
                <rect x={32} y={300} width={460 * (n / 160)} height={14} rx={7} fill={PLACE_FILL.field} />
                <text x={608} y={314} fontSize={21} fontWeight={900} fill={SC.text} textAnchor="end">{n} / 160</text>
                <text x={32} y={346} fontSize={21} fontWeight={700} fill={SC.muted}>Search and Assist quote the summary</text>
              </g>
            </g>
          );
        })()}

        {t >= 16 && t < 21 && (
          <g>
            <rect x={32} y={80} width={220} height={240} rx={12} fill={SC.surface} stroke={SC.line} strokeWidth={2} />
            <text x={52} y={114} fontSize={22} fontWeight={900} fill={SC.text}>Help article</text>
            {(['Plan', 'Device', 'Contact option', 'Outage notice'] as const).map((s, i) => {
              const k = p(t, 16.4 + i * 0.6, 17 + i * 0.6);
              const y = 80 + i * 62;
              return (
                <g key={s} opacity={k}>
                  <text x={52} y={160 + i * 44} fontSize={21} fontWeight={700} fill={SC.muted}>{s.toLowerCase().split(' ')[0]} →</text>
                  <path d={`M 252 ${152 + i * 44} C 300 ${152 + i * 44}, 300 ${y + 24}, 352 ${y + 24}`} fill="none" stroke={PLACE_FILL.type} strokeWidth={3} strokeDasharray={`${k * 160} 200`} />
                  <Pill x={352} y={y + 4} w={256} text={s} fill={PLACE_FILL.type} />
                </g>
              );
            })}
            <text x={32} y={346} fontSize={21} fontWeight={700} fill={SC.muted} opacity={p(t, 19.2, 19.8)}>Referenced, never copied</text>
          </g>
        )}

        {t >= 21 && t < 26 && (
          <g>
            {['Topic: Internet not working', 'Service: Fibre', 'Customer: Home'].map((s, i) => (
              <Pill key={s} x={32} y={76 + i * 54} w={[340, 220, 240][i]} text={s} fill={PLACE_FILL.tag} o={p(t, 21.3 + i * 0.5, 21.9 + i * 0.5)} />
            ))}
            {['Navigation', 'Search', 'Assist routing'].map((s, i) => (
              <g key={s} opacity={p(t, 23 + i * 0.5, 23.6 + i * 0.5)}>
                <rect x={420} y={76 + i * 54} width={188} height={40} rx={8} fill={SC.surface} stroke={SC.line} strokeWidth={2} />
                <text x={514} y={103 + i * 54} fontSize={21} fontWeight={800} fill={SC.text} textAnchor="middle">{s}</text>
              </g>
            ))}
            <text x={32} y={300} fontSize={21} fontWeight={700} fill={SC.muted} opacity={p(t, 24.4, 25)}>From controlled lists, not folders.</text>
            <text x={32} y={334} fontSize={21} fontWeight={800} fill={SC.text} opacity={p(t, 24.8, 25.4)}>One article, found from every route</text>
          </g>
        )}

        {t >= 26 && t < 31 && (
          <g>
            {['Blue box, bold, 18 px', 'Two columns on desktop', '“The red button below”'].map((s, i) => {
              const fall = p(t, 27.4 + i * 0.4, 28.6 + i * 0.4);
              return (
                <g key={s} opacity={1 - fall} transform={`translate(0 ${lerp(0, 80, fall)})`}>
                  <rect x={32} y={76 + i * 54} width={340} height={40} rx={8} fill={SC.surface} stroke={PLACE_FILL.cut} strokeWidth={2} />
                  <text x={48} y={103 + i * 54} fontSize={21} fontWeight={800} fill={SC.text}>{s}</text>
                  <line x1={40} y1={96 + i * 54} x2={364} y2={96 + i * 54} stroke={PLACE_FILL.cut} strokeWidth={3} opacity={p(t, 26.6 + i * 0.3, 27 + i * 0.3)} />
                </g>
              );
            })}
            <g opacity={p(t, 29, 29.6)}>
              <Pill x={32} y={220} w={120} text="tip" fill={PLACE_FILL.field} />
              <text x={172} y={248} fontSize={21} fontWeight={800} fill={SC.text}>Web: a box · App: a banner</text>
              <text x={172} y={284} fontSize={21} fontWeight={800} fill={SC.text}>IVR: read after the steps</text>
            </g>
          </g>
        )}

        {t >= 31 && (() => {
          const k = p(t, 31.6, 32.4);
          return (
            <g>
              <rect x={32} y={140} width={200} height={84} rx={12} fill={PLACE_FILL.type} />
              <text x={132} y={174} fontSize={21} fontWeight={800} fill="#fff" textAnchor="middle">Plan · Fibre 100</text>
              <text x={132} y={208} fontSize={24} fontWeight={900} fill="#fff" textAnchor="middle">{k < 0.5 ? '₹799' : '₹849'}</text>
              {TAAR_CHANNELS.map((ch, i) => {
                const y = 70 + i * 66;
                const o = p(t, 32.4 + i * 0.4, 33 + i * 0.4);
                return (
                  <g key={ch}>
                    <path d={`M 232 182 C 290 182, 290 ${y + 26}, 348 ${y + 26}`} fill="none" stroke={PLACE_FILL.type} strokeWidth={3} opacity={o} />
                    <rect x={348} y={y} width={260} height={52} rx={10} fill={SC.surface} stroke={SC.line} strokeWidth={2} opacity={o} />
                    <text x={364} y={y + 34} fontSize={21} fontWeight={800} fill={SC.text} opacity={o}>{ch}</text>
                    <text x={592} y={y + 34} fontSize={21} fontWeight={900} fill={PLACE_FILL.type} textAnchor="end" opacity={o}>₹849</text>
                  </g>
                );
              })}
              <text x={32} y={330} fontSize={22} fontWeight={900} fill={SC.text} opacity={p(t, 34, 34.6)}>
                {editsFor(TAAR_CHUNKS.plan, true)} edit, not {editsFor(TAAR_CHUNKS.plan, false)}
              </text>
            </g>
          );
        })()}
      </g>
    </svg>
  );
}
