'use client';
// Scene for rs.5-4: Tanushree's decision memo. Nine claims (`BOLO_CLAIMS`), every source tagged as what people say or
// what they do (`METHOD_KIND`). "Drills" is backed by both, so it's confident; live rooms for job-seekers is a
// conflict (58% say yes, 9% joined), and the gap turns out to be the 7 pm slot and nerves; the certificate is a lead,
// all say and no do, so it becomes a test. Every claim is weighed by `triangulate`. Pure function of t (0–36).
import { BOLO_CLAIMS, METHOD_KIND, METHOD_LABEL, triangulate, type BoloClaim, type ResearchMethod, type Weight } from '@shape/content';
import { back, clamp, Grid, lerp, p, Pen, SC } from './shared';

const W = 960, H = 540;
/** Stamp fills; white text on each passes 4.5:1. */
const FILL: Record<Weight, string> = { confident: '#067647', lead: 'var(--color-family-discover-solid)', conflict: '#B42318' };
const STAMP: Record<Weight, string> = { confident: 'Confident', lead: 'A lead', conflict: 'Conflict' };
const KEYS = Object.keys(BOLO_CLAIMS) as BoloClaim[];
const METHODS = Object.keys(METHOD_KIND) as ResearchMethod[];
/** When practice sessions start (share of all sessions): before 7 pm, then each evening hour to 11 pm. */
const HOURS = [{ h: 'Earlier', v: 0.06 }, { h: '7 pm', v: 0.08 }, { h: '8 pm', v: 0.15 }, { h: '9 pm', v: 0.38 }, { h: '10 pm', v: 0.33 }];

function Stamp({ x, y, w, k }: { x: number; y: number; w: Weight; k: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(-6) scale(${lerp(1.4, 1, k)})`} opacity={k}>
      <rect x={-80} y={-20} width={160} height={40} rx={10} fill={FILL[w]} />
      <text y={6} textAnchor="middle" fontSize={17} fontWeight={900} fill="#fff">{STAMP[w]}</text>
    </g>
  );
}

function Tri({ say, act, clash, k }: { say: boolean; act: boolean; clash?: boolean; k: number }) {
  const on = SC.brand, off = SC.line;
  return (
    <g opacity={k}>
      <path d="M90 0 L0 150" stroke={say ? on : off} strokeWidth={6} strokeLinecap="round" />
      <path d="M90 0 L180 150" stroke={act ? on : off} strokeWidth={6} strokeLinecap="round" />
      <path d="M0 150 L180 150" stroke={clash ? SC.error : say && act ? on : off} strokeWidth={6} strokeDasharray={clash ? '10 8' : undefined} strokeLinecap="round" />
      <circle cx={90} cy={0} r={12} fill={SC.surface} stroke={on} strokeWidth={4} />
      <circle cx={0} cy={150} r={14} fill={say ? on : SC.surface} stroke={say ? on : off} strokeWidth={4} />
      <circle cx={180} cy={150} r={14} fill={act ? on : SC.surface} stroke={act ? on : off} strokeWidth={4} />
      <text x={0} y={186} textAnchor="middle" fontSize={13} fontWeight={900} fill={SC.muted}>SAY</text>
      <text x={180} y={186} textAnchor="middle" fontSize={13} fontWeight={900} fill={SC.muted}>DO</text>
    </g>
  );
}

function Claim({ k, t, from }: { k: BoloClaim; t: number; from: number }) {
  const c = BOLO_CLAIMS[k];
  return (
    <g>
      <foreignObject x={0} y={0} width={520} height={60}><p style={{ margin: 0, font: '900 20px/1.3 Inter, system-ui, sans-serif', color: 'var(--color-text-primary)' }}>“{c.text}”</p></foreignObject>
      {c.sources.map((s, i) => (
        <g key={s.method} transform={`translate(0 ${74 + i * 74})`} opacity={p(t, from + i * 0.6, from + 0.5 + i * 0.6)}>
          <rect width={520} height={62} rx={12} fill={SC.surface} stroke={s.agrees ? SC.line : SC.error} strokeWidth={2} />
          <text x={16} y={24} fontSize={12} fontWeight={900} fill={SC.muted}>{METHOD_LABEL[s.method].toUpperCase()} · {METHOD_KIND[s.method] === 'say' ? 'SAY' : 'DO'}</text>
          <foreignObject x={16} y={30} width={490} height={30}><p style={{ margin: 0, font: '700 13.5px/1.3 Inter, system-ui, sans-serif', color: 'var(--color-text-secondary)' }}>{s.finding}</p></foreignObject>
        </g>
      ))}
    </g>
  );
}

export function SourceWeaveScene({ t }: { t: number }) {
  const intro = clamp(back(t / 0.6));
  const title = t < 6 ? 'The memo' : t < 11 ? 'Say and do' : t < 16 ? 'Drills: confident' : t < 21 ? 'Live rooms: a conflict' : t < 26 ? 'The gap is the finding' : t < 31 ? 'Certificates: a lead' : 'The call';
  const kinds = (k: BoloClaim) => ({ say: BOLO_CLAIMS[k].sources.some(s => METHOD_KIND[s.method] === 'say' && s.agrees), act: BOLO_CLAIMS[k].sources.some(s => METHOD_KIND[s.method] === 'do' && s.agrees), clash: BOLO_CLAIMS[k].sources.some(s => !s.agrees) });
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" role="img" aria-label="Animated story: Tanushree writes Bolo's decision memo, tagging every source as what people say (surveys, interviews, support tickets) or what they do (analytics, usability tests). Daily drills are backed by a survey, behaviour data and interviews, so the claim is confident. Live rooms for job-seekers is a conflict: 58% said yes but 9% of those offered one joined, because the pilot ran at 7 pm while most practice starts after 9, and speaking to strangers felt like an interview. The certificate claim is only what people say, so it becomes a test. The call: build daily drills, and pilot a 9 pm live room.">
      <rect width={W} height={H} fill={SC.soft} />
      <Grid />
      <g opacity={intro}>
        <text x={60} y={60} fontSize={22} fontWeight={900} fill={SC.text}>{title}</text>

        {t < 6 && (
          <g transform="translate(60 92)">
            <rect width={560} height={410} rx={18} fill={SC.surface} stroke={SC.line} strokeWidth={2} opacity={p(t, 0.2, 0.7)} />
            <text x={28} y={40} fontSize={13} fontWeight={900} fill={SC.muted} opacity={p(t, 0.4, 0.9)}>DECISION MEMO · LIVE ROOMS OR DAILY DRILLS</text>
            {KEYS.map((k, i) => (
              <text key={k} x={28} y={80 + i * 36} fontSize={15} fontWeight={800} fill={SC.text} opacity={p(t, 0.8 + i * 0.3, 1.2 + i * 0.3)}>{i + 1}. {BOLO_CLAIMS[k].text}</text>
            ))}
          </g>
        )}

        {t >= 6 && t < 11 && (
          <g transform="translate(60 110)">
            {(['say', 'do'] as const).map((kind, c) => (
              <g key={kind} transform={`translate(${c * 430} 0)`}>
                <text fontSize={16} fontWeight={900} fill={SC.text} opacity={p(t, 6.2, 6.7)}>{kind === 'say' ? 'What people say' : 'What people do'}</text>
                {METHODS.filter(m => METHOD_KIND[m] === kind).map((m, i) => (
                  <g key={m} transform={`translate(0 ${30 + i * 70})`} opacity={p(t, 6.8 + (c * 3 + i) * 0.4, 7.3 + (c * 3 + i) * 0.4)}>
                    <rect width={380} height={54} rx={14} fill={SC.surface} stroke={kind === 'say' ? SC.design : SC.discover} strokeWidth={2.5} />
                    <text x={20} y={34} fontSize={17} fontWeight={900} fill={SC.text}>{METHOD_LABEL[m]}</text>
                  </g>
                ))}
              </g>
            ))}
            <foreignObject x={0} y={270} width={840} height={80}><p style={{ margin: 0, font: '800 15px/1.35 Inter, system-ui, sans-serif', color: 'var(--color-text-tertiary)' }}>Saying brings over-claimed futures and respectable reasons. Doing brings no reasons at all. Check a claim with both, and their blind spots don’t overlap.</p></foreignObject>
          </g>
        )}

        {t >= 11 && t < 21 && (() => {
          const k: BoloClaim = t < 16 ? 'drills' : 'liveDemand', from = t < 16 ? 11.4 : 16.4, kd = kinds(k);
          return (
            <g transform="translate(60 100)">
              <Claim k={k} t={t} from={from} />
              <g transform="translate(620 90)"><Tri say={kd.say} act={kd.act} clash={kd.clash} k={p(t, from + 2, from + 2.6)} /></g>
              <Stamp x={710} y={330} w={triangulate(BOLO_CLAIMS[k])} k={p(t, from + 3, from + 3.5)} />
            </g>
          );
        })()}

        {t >= 21 && t < 26 && (
          <g transform="translate(60 110)">
            <text fontSize={13} fontWeight={900} fill={SC.muted}>WHEN PRACTICE SESSIONS START</text>
            {HOURS.map((b, i) => {
              const hgt = b.v * 520;
              return (
                <g key={b.h} transform={`translate(${i * 80} 0)`} opacity={p(t, 21.2 + i * 0.25, 21.6 + i * 0.25)}>
                  <rect x={0} y={260 - hgt} width={56} height={hgt} rx={6} fill={b.h === '7 pm' ? SC.error : b.v > 0.3 ? SC.brand : SC.line} />
                  <text x={28} y={284} textAnchor="middle" fontSize={14} fontWeight={800} fill={SC.muted}>{b.h}</text>
                </g>
              );
            })}
            <text x={0} y={320} fontSize={15} fontWeight={800} fill={SC.text} opacity={p(t, 22.6, 23)}>The pilot ran at 7 pm. 71% of sessions start after 9.</text>
            <g transform="translate(460 40)" opacity={p(t, 23.4, 24)}>
              <rect width={380} height={130} rx={22} fill={SC.surface} stroke={SC.design} strokeWidth={2.5} />
              <foreignObject x={22} y={20} width={340} height={100}><p style={{ margin: 0, font: '800 17px/1.35 Inter, system-ui, sans-serif', color: 'var(--color-text-primary)' }}>“Speaking in front of five strangers felt like another interview.”</p></foreignObject>
              <text x={22} y={156} fontSize={13} fontWeight={800} fill={SC.muted}>One of six calls with job-seekers who didn’t join</text>
            </g>
          </g>
        )}

        {t >= 26 && t < 31 && (() => {
          const kd = kinds('certificate');
          return (
            <g transform="translate(60 100)">
              <Claim k="certificate" t={t} from={26.3} />
              <g transform="translate(620 90)"><Tri say={kd.say} act={kd.act} k={p(t, 27.6, 28.2)} /></g>
              <Stamp x={710} y={330} w={triangulate(BOLO_CLAIMS.certificate)} k={p(t, 28.4, 28.9)} />
              <text x={0} y={280} fontSize={15} fontWeight={800} fill={SC.text} opacity={p(t, 29.2, 29.7)}>Next: offer a certificate to a random tenth of learners, and measure practice.</text>
            </g>
          );
        })()}

        {t >= 31 && (
          <g transform="translate(60 110)">
            <rect width={600} height={150} rx={20} fill={SC.surface} stroke={SC.mint} strokeWidth={3} opacity={p(t, 31.1, 31.5)} />
            <text x={28} y={42} fontSize={13} fontWeight={900} fill={SC.muted} opacity={p(t, 31.2, 31.6)}>BUILD NOW</text>
            <text x={28} y={100} fontSize={44} fontWeight={900} fill={SC.text} opacity={p(t, 31.4, 31.9)}>Daily drills</text>
            {['A 9 pm live room for job-seekers: decide on attendance', 'A certificate for a random tenth: decide on practice'].map((r, i) => (
              <g key={r} transform={`translate(0 ${190 + i * 60})`} opacity={p(t, 32.4 + i * 0.6, 32.9 + i * 0.6)}>
                <rect width={600} height={46} rx={12} fill={SC.surface} stroke={SC.line} />
                <text x={20} y={29} fontSize={15} fontWeight={800} fill={SC.text}>Next research · {r}</text>
              </g>
            ))}
            <Pen x={760} y={260} mood="cheer" scale={0.5} />
          </g>
        )}
      </g>
    </svg>
  );
}
