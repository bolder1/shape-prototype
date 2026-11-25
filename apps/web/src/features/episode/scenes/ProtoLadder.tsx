'use client';
// Scene for pr.4-2: Thela's Figma search prototype showed toor dal whatever was typed, so the test reported that
// search works. Then: start from the question and what must be real, the three rungs (`PROTO_TOOLS`, what each makes
// real from `TOOL_CAN`, what each costs from `TOOL_DAYS`), the cheapest tool that covers the needs (`protoTool`), and
// code prototypes built to be thrown away. Pure function of t (0–36). Also exports `TOOL_FILL`, which `proto-fit` uses.
import { PROTO_NEED_LABEL, PROTO_NEEDS, PROTO_TOOLS, PROTO_TOOL_LABEL, THELA_QUESTIONS, TOOL_CAN, TOOL_DAYS, protoTool, type ProtoTool } from '@shape/content';
import { back, clamp, Grid, lerp, p, SC } from './shared';

const W = 640, H = 360;
/** One fill per tool; white text on each passes 4.5:1. */
export const TOOL_FILL: Record<ProtoTool, string> = { figma: '#C11574', framer: '#175CD3', code: '#067647' };

/** A tool's rung: name, days, and a tick per need it makes real. `lit` highlights it. */
function Rung({ tool, y, o, lit }: { tool: ProtoTool; y: number; o: number; lit?: boolean }) {
  const n = TOOL_CAN[tool].length;
  return (
    <g opacity={o}>
      <rect x={32} y={y} width={576} height={66} rx={12} fill={SC.surface} stroke={lit ? TOOL_FILL[tool] : SC.line} strokeWidth={lit ? 3 : 2} />
      <rect x={48} y={y + 15} width={112} height={36} rx={18} fill={TOOL_FILL[tool]} />
      <text x={104} y={y + 40} fontSize={21} fontWeight={900} fill="#fff" textAnchor="middle">{PROTO_TOOL_LABEL[tool]}</text>
      {PROTO_NEEDS.map((need, i) => (
        <rect key={need} x={180 + i * 44} y={y + 21} width={32} height={24} rx={6} fill={i < n ? TOOL_FILL[tool] : 'transparent'} stroke={i < n ? 'none' : SC.line} strokeWidth={2} />
      ))
      }
      <text x={592} y={y + 41} fontSize={21} fontWeight={900} fill={SC.text} textAnchor="end">{TOOL_DAYS[tool]} d</text>
    </g>
  );
}

export function ProtoLadderScene({ t }: { t: number }) {
  const intro = clamp(back(t / 0.6));
  const title = t < 6 ? 'A test that lied' : t < 11 ? 'Start from the question' : t < 16 ? 'Figma: flows and rules' : t < 21 ? 'Framer: a real web page' : t < 26 ? 'React: the real thing, briefly' : t < 31 ? 'The cheapest that covers it' : 'Built to be thrown away';
  const rungTop = (i: number) => 216 - i * 76;
  const search = THELA_QUESTIONS.search;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" role="img" aria-label={`Animated story: Thela's Figma search prototype showed toor dal whatever was typed, so the test reported that search works, while the app finds nothing for kandi pappu. The team starts from the research question and lists what must be real. Figma with variables makes flows and rules real in about ${TOOL_DAYS.figma} day. Framer adds real scrolling, hover and breakpoints, real typing and lists from a CMS, in about ${TOOL_DAYS.framer} days. React adds live data, real timing, the camera and people's own orders, in about ${TOOL_DAYS.code} days. The rule: pick the cheapest tool that makes every need real. Code prototypes cover only the tested screens, use the design system's components and are thrown away after the test.`}>
      <rect width={W} height={H} fill={SC.soft} />
      <Grid w={W} h={H} />
      <g opacity={intro}>
        <text x={32} y={44} fontSize={26} fontWeight={900} fill={SC.text}>{title}</text>

        {t < 6 && (
          <g>
            {['tur', 'arhar', 'kandi pappu'].map((q, i) => (
              <g key={q} opacity={p(t, 0.3 + i * 0.6, 0.8 + i * 0.6)}>
                <rect x={32} y={74 + i * 72} width={260} height={54} rx={27} fill={SC.surface} stroke={SC.line} strokeWidth={2} />
                <text x={56} y={109 + i * 72} fontSize={21} fontWeight={800} fill={SC.text}>“{q}”</text>
                <text x={312} y={109 + i * 72} fontSize={21} fontWeight={800} fill="#067647">→ Toor dal ✓</text>
              </g>
            ))}
            <g opacity={p(t, 2.8, 3.4)}>
              <text x={32} y={318} fontSize={22} fontWeight={900} fill={SC.error}>In the app: 0 results for “kandi pappu”</text>
            </g>
          </g>
        )}

        {t >= 6 && t < 11 && (
          <g>
            <g opacity={p(t, 6.2, 6.8)}>
              <rect x={32} y={70} width={576} height={84} rx={14} fill={SC.surface} stroke={SC.line} strokeWidth={2} />
              <text x={52} y={104} fontSize={21} fontWeight={700} fill={SC.muted}>Question</text>
              <text x={52} y={136} fontSize={21} fontWeight={800} fill={SC.text}>Does search find every spelling of toor dal?</text>
            </g>
            <text x={32} y={196} fontSize={21} fontWeight={700} fill={SC.muted} opacity={p(t, 7, 7.6)}>Must be real</text>
            {search.needs.map((n, i) => (
              <g key={n} opacity={p(t, 7.6 + i * 0.6, 8.2 + i * 0.6)}>
                <rect x={32 + i * 296} y={212} width={280} height={54} rx={27} fill={TOOL_FILL.code} />
                <text x={172 + i * 296} y={246} fontSize={21} fontWeight={800} fill="#fff" textAnchor="middle">{PROTO_NEED_LABEL[n]}</text>
              </g>
            ))}
            <text x={32} y={318} fontSize={21} fontWeight={700} fill={SC.muted} opacity={p(t, 9.2, 9.8)}>Everything else can stay fake</text>
          </g>
        )}

        {t >= 11 && t < 26 && (
          <g>
            {PROTO_TOOLS.map((tool, i) => {
              const from = 11 + i * 5;
              return <Rung key={tool} tool={tool} y={rungTop(i)} o={t >= from ? p(t, from + 0.2, from + 0.8) : 0} lit={t >= from && t < from + 5} />;
            })}
            {(() => {
              const i = Math.min(2, Math.floor((t - 11) / 5));
              const tool = PROTO_TOOLS[i];
              const adds = TOOL_CAN[tool].filter(n => i === 0 || !TOOL_CAN[PROTO_TOOLS[i - 1]].includes(n));
              return (
                <text x={32} y={330} fontSize={21} fontWeight={800} fill={SC.text} opacity={p(t, 11.8 + i * 5, 12.4 + i * 5)}>
                  {i === 0 ? 'Makes real: ' : 'Adds: '}{adds.map(n => PROTO_NEED_LABEL[n].toLowerCase()).slice(0, 3).join(', ')}
                </text>
              );
            })()}
          </g>
        )}

        {t >= 26 && t < 31 && (
          <g>
            {(['nudge', 'address', 'search'] as const).map((k, i) => {
              const tool = protoTool(THELA_QUESTIONS[k].needs);
              const short = { nudge: 'Notice the ₹199 bar?', address: 'Fill the address form?', search: 'Find “kandi pappu”?' }[k];
              return (
                <g key={k} opacity={p(t, 26.3 + i * 0.9, 26.9 + i * 0.9)}>
                  <rect x={32} y={72 + i * 84} width={576} height={68} rx={12} fill={SC.surface} stroke={SC.line} strokeWidth={2} />
                  <text x={52} y={114 + i * 84} fontSize={21} fontWeight={800} fill={SC.text}>{short}</text>
                  <rect x={460} y={88 + i * 84} width={132} height={36} rx={18} fill={TOOL_FILL[tool]} />
                  <text x={526} y={113 + i * 84} fontSize={21} fontWeight={900} fill="#fff" textAnchor="middle">{PROTO_TOOL_LABEL[tool]}</text>
                </g>
              );
            })}
            <text x={32} y={336} fontSize={21} fontWeight={700} fill={SC.muted} opacity={p(t, 29.2, 29.8)}>The first rung that makes every need real</text>
          </g>
        )}

        {t >= 31 && (() => {
          const k = p(t, 33.4, 35);
          return (
            <g>
              {['Only the tested screens', 'The system’s components', 'Flags to switch per session'].map((s, i) => (
                <g key={s} opacity={p(t, 31.2 + i * 0.5, 31.7 + i * 0.5)}>
                  <rect x={32} y={70 + i * 62} width={360} height={48} rx={10} fill={SC.surface} stroke={SC.line} strokeWidth={2} />
                  <text x={50} y={102 + i * 62} fontSize={21} fontWeight={800} fill={SC.text}>{s}</text>
                </g>
              ))}
              <g opacity={p(t, 32.8, 33.2)}>
                <rect x={430} y={80} width={178} height={110} rx={14} fill={TOOL_FILL.code} opacity={1 - k * 0.7} transform={`translate(0 ${lerp(0, 60, k)})`} />
                <text x={519} y={144} fontSize={22} fontWeight={900} fill="#fff" textAnchor="middle" opacity={1 - k} transform={`translate(0 ${lerp(0, 60, k)})`}>&lt;Prototype/&gt;</text>
              </g>
              <text x={32} y={310} fontSize={24} fontWeight={900} fill={SC.text} opacity={p(t, 34, 34.6)}>Keep the findings. Bin the code.</text>
            </g>
          );
        })()}
      </g>
    </svg>
  );
}
