'use client';
// Scene for cw.1-4: "No items." on an empty Saved recipes screen looks broken. It's rebuilt as what / why / next, then
// four phones show the four kinds of empty (first use, all done, no results, couldn't load). Pure function of t (0–34).
import { BookmarkSimpleIcon, CheckCircleIcon, MagnifyingGlassIcon, QuestionIcon, WifiSlashIcon } from '@phosphor-icons/react/ssr';
import { back, clamp, Grid, p, SC } from './shared';

const W = 960, H = 540;
const KINDS = [
  { n: 'First use', icon: BookmarkSimpleIcon, line: 'Save recipes you love', btn: 'Browse recipes', c: SC.discover },
  { n: 'All done', icon: CheckCircleIcon, line: 'All caught up!', btn: 'Back to home', c: SC.mint },
  { n: 'No results', icon: MagnifyingGlassIcon, line: 'No “biriyani” found', btn: 'Clear filters', c: SC.build },
  { n: 'Couldn’t load', icon: WifiSlashIcon, line: 'You’re offline', btn: 'Try again', c: SC.error },
];

export function EmptyStatesScene({ t }: { t: number }) {
  const fin = p(t, 29, 29.8);
  const rebuild = p(t, 10, 11);
  const four = t >= 16;
  const PX = 340, PY = 50, PW = 280, PH = 440;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" role="img" aria-label="Animated story: an unhelpful empty screen rebuilt into a helpful empty state">
      <rect width={W} height={H} fill={SC.soft} />
      <Grid />
      <g opacity={1 - fin}>
        {!four && (
          <g opacity={1 - p(t, 15.4, 16)}>
            <rect x={PX} y={PY} width={PW} height={PH} rx={34} fill={SC.surface} stroke={SC.text} strokeOpacity={0.3} strokeWidth={3} />
            <text x={PX + 26} y={PY + 52} fontSize={20} fontWeight={800} fill={SC.text}>Saved recipes</text>
            <text x={PX + PW / 2} y={PY + 230} textAnchor="middle" fontSize={15} fontWeight={600} fill={SC.muted} opacity={1 - rebuild}>No items.</text>
            <g opacity={rebuild}>
              <g transform={`translate(${PX + PW / 2} ${PY + 150}) scale(${clamp(back((t - 10.3) / 0.4))})`}>
                <circle r={40} fill={SC.discover} opacity={0.15} />
                <BookmarkSimpleIcon x={-22} y={-22} width={44} height={44} color={SC.discover} weight="duotone" />
              </g>
              <text x={PX + PW / 2} y={PY + 232} textAnchor="middle" fontSize={18} fontWeight={800} fill={SC.text} opacity={clamp((t - 11) / 0.4)}>Save recipes you love</text>
              <text x={PX + PW / 2} y={PY + 260} textAnchor="middle" fontSize={13} fontWeight={600} fill={SC.muted} opacity={clamp((t - 11.8) / 0.4)}>Tap the bookmark on any recipe.</text>
              <text x={PX + PW / 2} y={PY + 280} textAnchor="middle" fontSize={13} fontWeight={600} fill={SC.muted} opacity={clamp((t - 11.8) / 0.4)}>You haven’t saved one yet.</text>
              <g opacity={clamp((t - 12.6) / 0.4)}>
                <rect x={PX + 50} y={PY + 310} width={PW - 100} height={46} rx={12} fill={SC.discover} />
                <text x={PX + PW / 2} y={PY + 339} textAnchor="middle" fontSize={15} fontWeight={800} fill="#fff">Browse recipes</text>
              </g>
            </g>
            {/* tags */}
            {[{ at: 11, y: PY + 232, l: 'What it’s for', c: SC.discover }, { at: 11.8, y: PY + 270, l: 'Why it’s empty', c: SC.design }, { at: 12.6, y: PY + 333, l: 'What next', c: SC.mint }].map(tg => t >= tg.at && (
              <g key={tg.l} opacity={clamp((t - tg.at) / 0.4)}>
                <line x1={PX + PW + 8} x2={PX + PW + 40} y1={tg.y - 5} y2={tg.y - 5} stroke={tg.c} strokeWidth={2} />
                <text x={PX + PW + 48} y={tg.y} fontSize={15} fontWeight={800} fill={tg.c}>{tg.l}</text>
              </g>
            ))}
            {t >= 5 && t < 10 && (
              <g opacity={clamp((t - 5) / 0.4) * (1 - p(t, 9.5, 10))}>
                <QuestionIcon x={140} y={180} width={56} height={56} color={SC.error} weight="bold" />
                <text x={168} y={270} textAnchor="middle" fontSize={15} fontWeight={800} fill={SC.error}>Is it broken?</text>
              </g>
            )}
          </g>
        )}

        {four && KINDS.map((k, i) => {
          const x = 40 + i * 225, show = clamp(back((t - 16.2 - i * 0.4) / 0.5)), Icon = k.icon;
          const pulse = t >= 24 ? 1 + 0.06 * Math.sin((t - 24) * 6) : 1;
          return (
            <g key={k.n} transform={`translate(${x + 100} 270) scale(${show}) translate(${-(x + 100)} -270)`}>
              <text x={x + 100} y={70} textAnchor="middle" fontSize={16} fontWeight={800} fill={k.c}>{k.n}</text>
              <rect x={x} y={90} width={200} height={340} rx={26} fill={SC.surface} stroke={SC.text} strokeOpacity={0.25} strokeWidth={2} />
              <circle cx={x + 100} cy={200} r={34} fill={k.c} opacity={0.15} />
              <Icon x={x + 80} y={180} width={40} height={40} color={k.c} weight="duotone" />
              <text x={x + 100} y={270} textAnchor="middle" fontSize={15} fontWeight={800} fill={SC.text}>{k.line}</text>
              <g transform={`translate(${x + 100} 340) scale(${pulse}) translate(${-(x + 100)} -340)`}>
                <rect x={x + 30} y={318} width={140} height={42} rx={11} fill={k.c} />
                <text x={x + 100} y={345} textAnchor="middle" fontSize={14} fontWeight={800} fill="#fff">{k.btn}</text>
              </g>
            </g>
          );
        })}
        {t >= 24.4 && t < 29 && <text x={W / 2} y={490} textAnchor="middle" fontSize={16} fontWeight={800} fill={SC.mint} opacity={clamp((t - 24.4) / 0.4)}>Every one ends in a single next step</text>}
      </g>

      {fin > 0 && [{ x: 200, n: 'What · why · next', l: 'Explain, then invite', c: SC.discover }, { x: 480, n: 'Match the reason', l: 'Four kinds of empty', c: SC.design }, { x: 760, n: 'One action', l: 'Never a dead end', c: SC.mint }].map((f, i) => {
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
