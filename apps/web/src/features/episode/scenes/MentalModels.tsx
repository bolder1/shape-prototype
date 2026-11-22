'use client';
// Scene for ia.1-1: Meera looks for "Pay bills"; the app's menu speaks the bank's language (BBPS, IMPS, KYC). She gets lost,
// the designer learns her words, and the same menu is relabelled in them. Pure function of t (0–34).
import { CheckCircleIcon, NotePencilIcon, QuestionIcon } from '@phosphor-icons/react/ssr';
import { back, clamp, Grid, lerp, p, Pen, SC } from './shared';

const W = 960, H = 540;
const ROWS = [
  { sys: 'BBPS services', user: 'Pay bills' },
  { sys: 'IMPS / NEFT', user: 'Send money' },
  { sys: 'KYC module', user: 'Verify your ID' },
  { sys: 'Merchant hub', user: 'Shops near you' },
  { sys: 'Ticketing portal', user: 'Get help' },
];
const PX = 560, PY = 70, PW = 270, ROW0 = 160, RH = 58;

function Meera({ lost }: { lost: number }) {
  return (
    <g transform="translate(200 430)">
      <circle cy={-118} r={34} fill="#C99A7A" />
      <path d="M-34 -124 C-34 -168 34 -168 34 -124 C24 -146 -24 -146 -34 -124 Z" fill="#3A2A22" />
      <rect x={-44} y={-82} width={88} height={120} rx={30} fill={SC.design} />
      {lost > 0 && <QuestionIcon x={30} y={-200} width={44} height={44} color={SC.error} weight="bold" opacity={lost} />}
      {lost > 0.5 && <QuestionIcon x={-74} y={-186} width={32} height={32} color={SC.error} weight="bold" opacity={lost} />}
      <text y={70} textAnchor="middle" fontSize={13} fontWeight={700} fill={SC.muted}>Meera, 52</text>
    </g>
  );
}

export function MentalModelsScene({ t }: { t: number }) {
  const phone = back((t - 5) / 0.6);
  const swap = p(t, 24, 26);                    // labels change to her words
  const hunting = t >= 11 && t < 19;
  const huntRow = Math.floor((t - 11) / 1.1) % ROWS.length;
  const lost = hunting ? clamp((t - 13) / 1) : 0;
  const fin = p(t, 30, 30.8);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" role="img" aria-label="Animated story: a user's mental model versus the app's menu labels">
      <rect width={W} height={H} fill={SC.soft} />
      <Grid />
      <g opacity={1 - fin}>
        <Meera lost={lost} />
        {/* what she's thinking */}
        <g transform={`translate(250 120) scale(${back((t - 0.6) / 0.5)})`}>
          <circle cx={-40} cy={74} r={7} fill={SC.surface} stroke={SC.line} /><circle cx={-26} cy={56} r={11} fill={SC.surface} stroke={SC.line} />
          <rect x={-20} y={-34} width={190} height={64} rx={32} fill={SC.surface} stroke={SC.design} strokeWidth={2.5} />
          <text x={75} y={-6} textAnchor="middle" fontSize={12} fontWeight={700} fill={SC.muted}>I want to…</text>
          <text x={75} y={16} textAnchor="middle" fontSize={18} fontWeight={800} fill={SC.text}>pay my bill</text>
        </g>

        {/* the phone */}
        {phone > 0 && (
          <g transform={`translate(${PX + PW / 2} ${PY + 200}) scale(${phone}) translate(${-(PX + PW / 2)} ${-(PY + 200)})`}>
            <rect x={PX} y={PY} width={PW} height={420} rx={34} fill={SC.surface} stroke={SC.text} strokeOpacity={0.3} strokeWidth={3} />
            <text x={PX + 26} y={PY + 56} fontSize={20} fontWeight={800} fill={SC.text}>Menu</text>
            {ROWS.map((r, i) => {
              const y = ROW0 + i * RH, show = clamp((t - 5.6 - i * 0.35) / 0.3);
              const hit = hunting && i === huntRow, found = swap > 0.9 && i === 0 && t >= 27;
              return (
                <g key={r.sys} opacity={show}>
                  <rect x={PX + 14} y={y - 22} width={PW - 28} height={46} rx={12}
                    fill={found ? SC.mint : hit ? SC.error : SC.soft} fillOpacity={found ? 0.22 : hit ? 0.16 : 1} stroke={found ? SC.mint : 'none'} strokeWidth={2} />
                  <text x={PX + 30} y={y + 6} fontSize={16} fontWeight={700} fill={SC.text} opacity={1 - swap}>{r.sys}</text>
                  <text x={PX + 30} y={y + 6} fontSize={16} fontWeight={700} fill={SC.text} opacity={swap}>{r.user}</text>
                  {found && <CheckCircleIcon x={PX + PW - 56} y={y - 14} width={28} height={28} color={SC.mint} weight="fill" />}
                </g>
              );
            })}
            {/* her finger, hunting, then finding */}
            {(hunting || (t >= 26 && t < 30)) && (
              <circle cx={PX + PW - 60} cy={hunting ? ROW0 + huntRow * RH : lerp(ROW0 + 2 * RH, ROW0, p(t, 26, 27))} r={13} fill={SC.design} fillOpacity={0.55} stroke="#fff" strokeWidth={2} />
            )}
          </g>
        )}

        {hunting && t >= 15 && (
          <g opacity={clamp((t - 15) / 0.5)}>
            <rect x={330} y={16} width={300} height={40} rx={20} fill={SC.surface} stroke={SC.error} strokeWidth={2} />
            <text x={480} y={42} textAnchor="middle" fontSize={15} fontWeight={800} fill={SC.error}>Her map ≠ the app’s map</text>
          </g>
        )}

        {/* the designer learns her words */}
        {t >= 19 && t < 25 && (
          <g opacity={clamp((t - 19) / 0.4) * (1 - p(t, 24.4, 25))}>
            <Pen x={390} y={260} scale={0.5} mood="think" />
            <g transform="translate(300 300)">
              <rect width={180} height={150} rx={14} fill={SC.surface} stroke={SC.line} strokeWidth={2} />
              <NotePencilIcon x={14} y={12} width={22} height={22} color={SC.discover} weight="duotone" />
              <text x={44} y={29} fontSize={12} fontWeight={800} fill={SC.muted}>HER WORDS</text>
              {['“pay my bill”', '“send money”', '“my ID”', '“get help”'].map((w, i) => (
                <text key={w} x={18} y={60 + i * 24} fontSize={14} fontWeight={600} fontStyle="italic" fill={SC.text} opacity={clamp((t - 19.8 - i * 0.6) / 0.3)}>{w}</text>
              ))}
            </g>
          </g>
        )}
        {t >= 27 && t < 30 && <text x={PX + PW / 2} y={PY + 450} textAnchor="middle" fontSize={15} fontWeight={800} fill={SC.mint} opacity={clamp((t - 27) / 0.4)}>Found it in one tap.</text>}
      </g>

      {fin > 0 && [{ x: 200, n: 'Their words', l: 'Label by goal, not system', c: SC.design }, { x: 480, n: 'Their groups', l: 'Group the way they think', c: SC.discover }, { x: 760, n: 'Their map', l: 'Learn it from people', c: SC.mint }].map((f, i) => {
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
