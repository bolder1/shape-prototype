'use client';
// Scene for rs.2-4: in the interview room Suresh says he runs his shop on the app. At the counter, the researcher sees a
// paper ledger, a calculator and a sticky note, asks "why?" in the moment, and the say/do gap appears. Pure function of t (0–34).
import { BookOpenIcon, CalculatorIcon, ChatCircleIcon, DeviceMobileIcon, EyeIcon, NoteIcon } from '@phosphor-icons/react/ssr';
import { back, clamp, Grid, p, SC } from './shared';

const W = 960, H = 540;
const THINGS = [
  { n: 'Paper ledger', icon: BookOpenIcon, x: 350, at: 11.4 },
  { n: 'Calculator', icon: CalculatorIcon, x: 565, at: 12.6 },
  { n: 'Sticky note of UPI IDs', icon: NoteIcon, x: 780, at: 13.8 },
];

export function ContextVisitScene({ t }: { t: number }) {
  const fin = p(t, 29, 29.8);
  const shop = t >= 6 && t < 24;
  const split = t >= 24;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" role="img" aria-label="Animated story: what people say in an interview versus what you see at their workplace">
      <rect width={W} height={H} fill={SC.soft} />
      <Grid />
      <g opacity={1 - fin}>
        {/* the interview room */}
        {t < 6 && (
          <g opacity={1 - p(t, 5.4, 6)}>
            <rect x={140} y={110} width={680} height={320} rx={24} fill={SC.surface} stroke={SC.line} strokeWidth={2} />
            <text x={170} y={150} fontSize={13} fontWeight={800} letterSpacing={1} fill={SC.muted}>INTERVIEW ROOM</text>
            <g transform={`translate(480 270) scale(${clamp(back((t - 0.6) / 0.5))})`}>
              <ChatCircleIcon x={-210} y={-34} width={40} height={40} color={SC.discover} weight="duotone" />
              <text x={-160} y={-6} fontSize={24} fontWeight={800} fill={SC.text}>“I do everything in the app.”</text>
            </g>
          </g>
        )}

        {/* the shop counter */}
        {shop && (
          <g opacity={clamp((t - 6) / 0.5) * (1 - p(t, 23.4, 24))}>
            <text x={140} y={110} fontSize={13} fontWeight={800} letterSpacing={1} fill={SC.muted}>AT THE SHOP · A MORNING OF REAL SALES</text>
            <rect x={140} y={372} width={680} height={30} rx={8} fill={SC.build} opacity={0.35} />
            <g transform="translate(150 200)">
              <rect width={90} height={120} rx={14} fill={SC.surface} stroke={SC.line} strokeWidth={2} />
              <DeviceMobileIcon x={23} y={30} width={44} height={44} color={SC.discover} weight="duotone" />
              <text x={45} y={100} textAnchor="middle" fontSize={11} fontWeight={800} fill={SC.muted}>the app</text>
            </g>
            {THINGS.map(th => {
              const Icon = th.icon, s = clamp(back((t - th.at) / 0.5));
              const pulse = t >= th.at + 0.5 && t < 18 ? 1 + 0.08 * Math.sin((t - th.at) * 6) : 1;
              return (
                <g key={th.n} transform={`translate(${th.x} 260) scale(${s * pulse})`}>
                  <circle r={52} fill={SC.design} opacity={0.15} />
                  <Icon x={-30} y={-30} width={60} height={60} color={SC.design} weight="duotone" />
                  <text y={86} textAnchor="middle" fontSize={14} fontWeight={800} fill={SC.text}>{th.n}</text>
                </g>
              );
            })}
            {t >= 8 && t < 11 && (
              <g transform="translate(480 200)" opacity={clamp((t - 8) / 0.4)}>
                <EyeIcon x={-20} y={-40} width={40} height={40} color={SC.mint} weight="duotone" />
                <text y={20} textAnchor="middle" fontSize={16} fontWeight={800} fill={SC.mint}>Watching, quietly</text>
              </g>
            )}
            {t >= 18 && (
              <g opacity={clamp((t - 18) / 0.4)}>
                <g transform={`translate(160 128) scale(${clamp(back((t - 18) / 0.4))})`}>
                  <rect width={330} height={46} rx={14} fill={SC.discover} />
                  <text x={16} y={29} fontSize={15} fontWeight={800} fill="#fff">“Why did you write that in the book?”</text>
                </g>
                <g transform={`translate(470 420) scale(${clamp(back((t - 19.6) / 0.4))})`}>
                  <rect width={340} height={46} rx={14} fill={SC.surface} stroke={SC.line} strokeWidth={2} />
                  <text x={16} y={29} fontSize={15} fontWeight={700} fontStyle="italic" fill={SC.text}>“The app can’t do credit for regulars.”</text>
                </g>
              </g>
            )}
          </g>
        )}

        {/* say vs do */}
        {split && (
          <g opacity={clamp((t - 24) / 0.5)}>
            {[{ x: 270, h: 'What he said', l: '“Everything in the app”', c: SC.discover, icon: ChatCircleIcon }, { x: 690, h: 'What he did', l: 'App + ledger + calculator + notes', c: SC.design, icon: EyeIcon }].map((s, i) => {
              const Icon = s.icon;
              return (
                <g key={s.h} transform={`translate(${s.x} 260) scale(${clamp(back((t - 24.2 - i * 0.4) / 0.5))})`}>
                  <rect x={-180} y={-110} width={360} height={220} rx={22} fill={SC.surface} stroke={s.c} strokeWidth={3} />
                  <Icon x={-24} y={-90} width={48} height={48} color={s.c} weight="duotone" />
                  <text y={-10} textAnchor="middle" fontSize={20} fontWeight={800} fill={s.c}>{s.h}</text>
                  <text y={30} textAnchor="middle" fontSize={16} fontWeight={700} fill={SC.text}>{s.l}</text>
                </g>
              );
            })}
            <text x={480} y={268} textAnchor="middle" fontSize={34} fontWeight={900} fill={SC.muted}>≠</text>
            <text x={480} y={440} textAnchor="middle" fontSize={15} fontWeight={800} fill={SC.mint} opacity={clamp((t - 25.5) / 0.4)}>Not a lie. Habits are invisible to the people who have them.</text>
          </g>
        )}
      </g>

      {fin > 0 && [{ x: 200, n: 'Say ≠ do', l: 'Both are true', c: SC.design }, { x: 480, n: 'Go there', l: 'Where the work happens', c: SC.build }, { x: 760, n: 'Ask in the moment', l: 'Like an apprentice', c: SC.mint }].map((f, i) => {
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
