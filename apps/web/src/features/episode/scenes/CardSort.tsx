'use client';
// Scene for ia.1-2: nine account-area cards, scattered. An open sort makes three named piles, twenty people later the
// agreement shows, "Gift card balance" wobbles between two piles, and a closed sort checks the groups. Pure function of t (0–34).
import { CheckIcon, UsersThreeIcon } from '@phosphor-icons/react/ssr';
import { at, back, clamp, Grid, p, SC } from './shared';

const W = 960, H = 540;
const PILES = [{ x: 200, name: 'Orders', c: SC.discover }, { x: 480, name: 'Payments', c: SC.grow }, { x: 760, name: 'My account', c: SC.design }];
const CARDS = [
  { l: 'Track a package', pile: 0, agree: 95, from: [120, 120] },
  { l: 'Saved cards', pile: 1, agree: 90, from: [700, 90] },
  { l: 'Change phone', pile: 2, agree: 90, from: [420, 380] },
  { l: 'Return an item', pile: 0, agree: 85, from: [820, 300] },
  { l: 'UPI settings', pile: 1, agree: 85, from: [250, 330] },
  { l: 'Notifications', pile: 2, agree: 80, from: [560, 200] },
  { l: 'Refund status', pile: 0, agree: 60, from: [130, 430] },
  { l: 'Gift card balance', pile: 1, agree: 55, from: [640, 440] },
  { l: 'Saved addresses', pile: 2, agree: 70, from: [330, 150] },
];
const GIFT = 7;
const CW = 200, CH = 38;

export function CardSortScene({ t }: { t: number }) {
  const people = t < 12 ? 1 : Math.min(20, 1 + Math.floor((t - 12) * 4));
  const fin = p(t, 30, 30.8);
  const closed = t >= 25;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" role="img" aria-label="Animated story: an open card sort, agreement across participants, then a closed sort">
      <rect width={W} height={H} fill={SC.soft} />
      <Grid />
      <g opacity={1 - fin}>
        {/* pile headers: handwritten in the open sort, fixed boxes in the closed sort */}
        {PILES.map((pl, i) => {
          const show = back((t - 6 - i * 1.4) / 0.5);
          return (
            <g key={pl.name} transform={`translate(${pl.x} 140) scale(${clamp(show)})`}>
              <rect x={-CW / 2 - 10} y={-26} width={CW + 20} height={46} rx={closed ? 10 : 22} fill={closed ? pl.c : SC.surface} stroke={pl.c} strokeWidth={2.5} strokeDasharray={closed ? undefined : '6 5'} />
              <text y={5} textAnchor="middle" fontSize={17} fontWeight={800} fill={closed ? '#fff' : pl.c} fontStyle={closed ? 'normal' : 'italic'}>{pl.name}</text>
            </g>
          );
        })}

        {CARDS.map((c, i) => {
          const slot = CARDS.slice(0, i).filter(o => o.pile === c.pile).length;
          const home = [PILES[c.pile].x, 204 + slot * 52] as const;
          const fly = p(t, 6 + c.pile * 1.4 + slot * 0.35, 6.8 + c.pile * 1.4 + slot * 0.35);
          // In the open sort every card flies to its pile. Gift cards then wobbles between Money and About me.
          let [x, y] = at(c.from, home, fly);
          const wobble = i === GIFT && t >= 19 && t < 25;
          if (wobble) { const k = (Math.sin((t - 19) * 2.2) + 1) / 2; x = PILES[1].x + (PILES[2].x - PILES[1].x) * k * 0.9; y = home[1] + 30; }
          const pop = back((t - 0.3 - i * 0.12) / 0.4);
          const showAgree = t >= 12.5 && t < 25;
          const bar = clamp((t - 12.5 - i * 0.15) / 0.8) * (c.agree / 100);
          const strong = c.agree >= 75;
          const ok = closed && t >= 26 + i * 0.15;
          return (
            <g key={c.l} transform={`translate(${x} ${y}) scale(${clamp(pop)})`}>
              <rect x={-CW / 2} y={-CH / 2} width={CW} height={CH} rx={9} fill={SC.surface} stroke={wobble ? SC.build : ok && c.agree < 60 ? SC.build : SC.line} strokeWidth={wobble ? 3 : 2}
                transform={`rotate(${fly < 1 ? (i % 3 - 1) * 6 * (1 - fly) : 0})`} />
              <text x={-CW / 2 + 12} y={5} fontSize={14} fontWeight={700} fill={SC.text}>{c.l}</text>
              {showAgree && !wobble && (
                <g>
                  <rect x={CW / 2 - 56} y={-6} width={44} height={8} rx={4} fill={SC.line} />
                  <rect x={CW / 2 - 56} y={-6} width={44 * bar} height={8} rx={4} fill={strong ? SC.mint : SC.build} />
                </g>
              )}
              {ok && c.agree >= 60 && <CheckIcon x={CW / 2 - 30} y={-11} width={22} height={22} color={SC.mint} weight="bold" />}
              {ok && c.agree < 60 && <text x={CW / 2 - 22} y={6} textAnchor="middle" fontSize={18} fontWeight={900} fill={SC.build}>?</text>}
            </g>
          );
        })}

        {t >= 19 && t < 25 && (
          <g opacity={clamp((t - 19) / 0.4)}>
            <text x={PILES[1].x} y={500} textAnchor="middle" fontSize={20} fontWeight={900} fill={SC.grow}>55%</text>
            <text x={PILES[2].x} y={500} textAnchor="middle" fontSize={20} fontWeight={900} fill={SC.design}>45%</text>
            <text x={620} y={470} textAnchor="middle" fontSize={14} fontWeight={700} fill={SC.build}>People see it two ways</text>
          </g>
        )}
        {/* participant counter */}
        {t >= 5 && (
          <g transform="translate(40 500)" opacity={clamp((t - 5) / 0.4)}>
            <UsersThreeIcon x={0} y={-24} width={30} height={30} color={SC.discover} weight="duotone" />
            <text x={38} y={-2} fontSize={16} fontWeight={800} fill={SC.text}>{people} {people === 1 ? 'person' : 'people'} · {closed ? 'closed sort' : 'open sort'}</text>
          </g>
        )}
      </g>

      {fin > 0 && [{ x: 200, n: 'Open sort', l: 'People make the groups', c: SC.discover }, { x: 480, n: 'Agreement', l: 'Where most people agree', c: SC.mint }, { x: 760, n: 'Closed sort', l: 'Check your groups', c: SC.design }].map((f, i) => {
        const k = back((t - (30.2 + i * 0.25)) / 0.5);
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
