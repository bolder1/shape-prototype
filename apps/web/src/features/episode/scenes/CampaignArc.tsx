'use client';
// Scene for br.4-1: the agency's "Switch off" film makes Sukoon the hero and is forgotten, so Ishita finds the tension
// in a diary study and rebuilds it as Meera's story: tension at dinner, the turn in the lift with Sukoon as guide, proof
// the next evening. The tension curve is `SUKOON_FILM`; the last act cuts the arc across channels. Pure function of
// t (0–36). Also exports `ROLE_FILL` and `ROLE_LABEL`, which `arc-map` uses to draw the same arc.
import { SUKOON_FILM, SUKOON_NARRATIVE, type CampaignRole } from '@shape/content';
import { back, clamp, Grid, lerp, p, SC } from './shared';

const W = 640, H = 360;
/** One fill per part of the story; white text on each passes 4.5:1. */
export const ROLE_FILL: Record<CampaignRole, string> = { tension: '#B42318', turn: '#175CD3', proof: '#067647', off: '#475467' };
export const ROLE_LABEL: Record<CampaignRole, string> = { tension: 'Tension', turn: 'Turn', proof: 'Proof', off: 'Cut' };

const AGENCY = ['Logo', '“#1”', 'Features', 'Founder', 'Badges'];
const DIARY: [string, string][] = [['9:40 pm', '“Still replying to my manager.”'], ['10:15 pm', '“Laptop shut, head still in the call.”'], ['11:50 pm', '“Lying awake, replaying the review.”']];
const CUTS: [string, CampaignRole[]][] = [['60 s film', ['tension', 'turn', 'proof']], ['Billboard', ['tension']], ['6 s ad', ['turn']], ['Instagram', ['proof']]];

export function CampaignArcScene({ t }: { t: number }) {
  const intro = clamp(back(t / 0.6));
  const title = t < 6 ? 'The brand as hero' : t < 11 ? 'Find the tension' : t < 16 ? 'Tension' : t < 21 ? 'The turn' : t < 26 ? 'Proof' : t < 31 ? 'The shape' : 'One story, cut by channel';

  // The tension curve: x = seconds of film (0–60), y = tension (0–10).
  const cx = (s: number) => 60 + (s / 60) * 540;
  const cy = (v: number) => 300 - v * 22;
  const end = SUKOON_FILM[SUKOON_FILM.length - 1];
  const pts = [...SUKOON_FILM.map(b => [cx(b.at), cy(b.tension)] as const), [cx(60), cy(end.tension)] as const];
  const drawn = p(t, 26.2, 29.4) * (pts.length - 1);
  const shown = pts.slice(0, Math.floor(drawn) + 1);
  const i = Math.min(Math.floor(drawn), pts.length - 2), f = drawn - Math.floor(drawn);
  if (drawn < pts.length - 1) shown.push([lerp(pts[i][0], pts[i + 1][0], f), lerp(pts[i][1], pts[i + 1][1], f)] as const);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" role="img" aria-label={`Animated story: the agency’s film for Sukoon opens on the logo, then “India’s number 1”, a feature montage, the founder and the app-store badges, and nobody remembers it. Ishita reads a diary study: after 9 pm, subscribers are still answering work. She rebuilds the film as Meera’s story. Tension: Meera answers Slack at dinner and hears none of her daughter’s story. The turn: in the office lift she opens Sukoon and a voice says “Breathe out longer than you breathe in”, and her shoulders drop as the floors count down. Proof: the next evening she closes the laptop and hears the end of the story. Drawn as a curve, tension rises to ${Math.max(...SUKOON_FILM.map(b => b.tension))} out of 10 before the turn, then falls to ${end.tension}, lower than it started. The brand narrative: ${SUKOON_NARRATIVE} The story is cut by channel: the 60-second film carries all three parts, billboards the tension, a six-second ad the turn, Instagram the proof.`}>
      <rect width={W} height={H} fill={SC.soft} />
      <Grid w={W} h={H} />
      <g opacity={intro}>
        <text x={32} y={44} fontSize={26} fontWeight={900} fill={SC.text}>{title}</text>

        {t < 6 && (
          <g>
            {AGENCY.map((s, k) => (
              <g key={s} transform={`translate(${32 + k * 118} 90)`} opacity={p(t, 0.4 + k * 0.5, 0.9 + k * 0.5)}>
                <rect width={104} height={120} rx={10} fill={SC.surface} stroke={SC.line} strokeWidth={2} />
                <circle cx={52} cy={46} r={18} fill={ROLE_FILL.off} opacity={0.25} />
                <text x={52} y={100} fontSize={21} fontWeight={800} fill={SC.text} textAnchor="middle">{s}</text>
              </g>
            ))}
            <text x={32} y={266} fontSize={21} fontWeight={800} fill={SC.muted} opacity={p(t, 3.2, 3.8)}>Every frame is about Sukoon.</text>
            <text x={32} y={306} fontSize={24} fontWeight={900} fill={SC.error} opacity={p(t, 4.2, 4.8)}>A day later, viewers remember none of it.</text>
          </g>
        )}

        {t >= 6 && t < 11 && (
          <g>
            <text x={32} y={84} fontSize={21} fontWeight={800} fill={SC.muted}>Diary study, 40 subscribers, one week</text>
            {DIARY.map(([when, quote], k) => (
              <g key={when} opacity={p(t, 6.4 + k * 0.9, 7 + k * 0.9)}>
                <rect x={32} y={104 + k * 72} width={576} height={60} rx={12} fill={SC.surface} stroke={k === 1 ? ROLE_FILL.tension : SC.line} strokeWidth={2} />
                <text x={52} y={142 + k * 72} fontSize={21} fontWeight={900} fill={ROLE_FILL.tension}>{when}</text>
                <text x={164} y={142 + k * 72} fontSize={21} fontWeight={700} fill={SC.text}>{quote}</text>
              </g>
            ))}
            <text x={32} y={340} fontSize={21} fontWeight={800} fill={SC.text} opacity={p(t, 9.4, 10)}>The moment to start in: after 9 pm, still at work.</text>
          </g>
        )}

        {t >= 11 && t < 16 && (() => {
          const pings = Math.round(lerp(1, 9, p(t, 11.4, 14.6)));
          return (
            <g>
              <rect x={32} y={250} width={576} height={14} rx={7} fill={SC.line} />
              <circle cx={170} cy={150} r={30} fill={SC.surface} stroke={SC.text} strokeWidth={3} />
              <path d="M120 250 Q170 186 220 250" fill={SC.surface} stroke={SC.text} strokeWidth={3} />
              <rect x={196} y={196} width={60} height={40} rx={6} fill={ROLE_FILL.turn} opacity={0.9} />
              <text x={226} y={224} fontSize={21} fontWeight={900} fill="#fff" textAnchor="middle">{pings}</text>
              <circle cx={470} cy={168} r={22} fill={SC.surface} stroke={SC.text} strokeWidth={3} />
              <path d="M436 250 Q470 200 504 250" fill={SC.surface} stroke={SC.text} strokeWidth={3} />
              <g opacity={p(t, 11.8, 12.4)}>
                <rect x={330} y={74} width={278} height={56} rx={14} fill={SC.surface} stroke={SC.line} strokeWidth={2} />
                <text x={348} y={110} fontSize={21} fontWeight={700} fill={SC.text}>“…and then Riya said…”</text>
              </g>
              <g opacity={p(t, 13, 13.6)}>
                <rect x={60} y={74} width={130} height={50} rx={14} fill={SC.surface} stroke={SC.line} strokeWidth={2} />
                <text x={80} y={107} fontSize={21} fontWeight={700} fill={SC.muted}>“Mm-hm.”</text>
              </g>
              <text x={32} y={310} fontSize={21} fontWeight={800} fill={ROLE_FILL.tension} opacity={p(t, 14.2, 14.8)}>The villain: the day that won’t end.</text>
            </g>
          );
        })()}

        {t >= 16 && t < 21 && (() => {
          const floor = Math.round(lerp(14, 0, p(t, 16.6, 20)));
          const drop = p(t, 17.6, 19.6) * 14;
          return (
            <g>
              <rect x={32} y={70} width={240} height={250} rx={14} fill={SC.surface} stroke={SC.line} strokeWidth={2} />
              <rect x={112} y={86} width={80} height={44} rx={8} fill={ROLE_FILL.turn} />
              <text x={152} y={116} fontSize={24} fontWeight={900} fill="#fff" textAnchor="middle">{floor}</text>
              <circle cx={152} cy={186} r={24} fill={SC.soft} stroke={SC.text} strokeWidth={3} />
              <path d={`M92 ${296} Q100 ${226 + drop} 152 ${222 + drop} Q204 ${226 + drop} 212 ${296}`} fill={SC.soft} stroke={SC.text} strokeWidth={3} />
              <g opacity={p(t, 16.8, 17.4)}>
                <rect x={300} y={92} width={308} height={110} rx={14} fill={SC.surface} stroke={ROLE_FILL.turn} strokeWidth={2} />
                <text x={320} y={128} fontSize={21} fontWeight={900} fill={ROLE_FILL.turn}>Sukoon</text>
                <text x={320} y={158} fontSize={21} fontWeight={700} fill={SC.text}>“Breathe out longer</text>
                <text x={320} y={184} fontSize={21} fontWeight={700} fill={SC.text}>than you breathe in.”</text>
              </g>
              <text x={300} y={250} fontSize={21} fontWeight={800} fill={SC.text} opacity={p(t, 18.6, 19.2)}>Sukoon arrives as the guide,</text>
              <text x={300} y={278} fontSize={21} fontWeight={800} fill={SC.text} opacity={p(t, 18.6, 19.2)}>with a plan you can see.</text>
            </g>
          );
        })()}

        {t >= 21 && t < 26 && (() => {
          const lid = lerp(110, 8, p(t, 21.4, 22.8));
          return (
            <g>
              <rect x={32} y={250} width={576} height={14} rx={7} fill={SC.line} />
              <rect x={60} y={250 - lid} width={150} height={lid} rx={6} fill={SC.surface} stroke={SC.text} strokeWidth={3} />
              <rect x={50} y={246} width={170} height={8} rx={4} fill={SC.text} />
              <circle cx={330} cy={196} r={24} fill={SC.surface} stroke={SC.text} strokeWidth={3} />
              <circle cx={470} cy={196} r={20} fill={SC.surface} stroke={SC.text} strokeWidth={3} />
              <g opacity={p(t, 23, 23.6)}>
                <rect x={390} y={92} width={218} height={56} rx={14} fill={SC.surface} stroke={SC.line} strokeWidth={2} />
                <text x={408} y={128} fontSize={21} fontWeight={700} fill={SC.text}>“…the end!”</text>
              </g>
              <g opacity={p(t, 23.8, 24.4)}>
                <rect x={232} y={92} width={142} height={56} rx={14} fill={SC.surface} stroke={ROLE_FILL.proof} strokeWidth={2} />
                <text x={250} y={128} fontSize={21} fontWeight={700} fill={ROLE_FILL.proof}>“And then?”</text>
              </g>
              <text x={32} y={310} fontSize={21} fontWeight={800} fill={ROLE_FILL.proof} opacity={p(t, 24.4, 25)}>Shown, not claimed: she hears the end of the story.</text>
            </g>
          );
        })()}

        {t >= 26 && t < 31 && (
          <g>
            <rect x={cx(0)} y={64} width={cx(22) - cx(0)} height={240} fill={ROLE_FILL.tension} opacity={0.1} />
            <rect x={cx(22)} y={64} width={cx(40) - cx(22)} height={240} fill={ROLE_FILL.turn} opacity={0.1} />
            <rect x={cx(40)} y={64} width={cx(60) - cx(40)} height={240} fill={ROLE_FILL.proof} opacity={0.1} />
            {(['tension', 'turn', 'proof'] as const).map((r, k) => (
              <text key={r} x={[cx(11), cx(31), cx(50)][k]} y={90} fontSize={21} fontWeight={900} fill={ROLE_FILL[r]} textAnchor="middle">{ROLE_LABEL[r]}</text>
            ))}
            <line x1={cx(0)} y1={300} x2={cx(60)} y2={300} stroke={SC.line} strokeWidth={2} />
            <polyline points={shown.map(q => q.join(',')).join(' ')} fill="none" stroke={SC.text} strokeWidth={4} strokeLinejoin="round" strokeLinecap="round" />
            {SUKOON_FILM.map((b, k) => <circle key={b.at} cx={cx(b.at)} cy={cy(b.tension)} r={6} fill={SC.text} opacity={drawn >= k ? 1 : 0} />)}
            <text x={cx(0)} y={334} fontSize={21} fontWeight={800} fill={SC.muted}>0 s</text>
            <text x={cx(60)} y={334} fontSize={21} fontWeight={800} fill={SC.muted} textAnchor="end">60 s</text>
            <text x={cx(30)} y={334} fontSize={21} fontWeight={800} fill={SC.text} textAnchor="middle" opacity={p(t, 29.4, 30)}>Ends calmer than it began</text>
          </g>
        )}

        {t >= 31 && (
          <g>
            {CUTS.map(([channel, roles], k) => (
              <g key={channel} opacity={p(t, 31.2 + k * 0.7, 31.8 + k * 0.7)}>
                <text x={32} y={102 + k * 62} fontSize={21} fontWeight={800} fill={SC.text}>{channel}</text>
                {(['tension', 'turn', 'proof'] as const).map((r, j) => roles.includes(r) && (
                  <g key={r}>
                    <rect x={196 + j * 140} y={74 + k * 62} width={132} height={42} rx={21} fill={ROLE_FILL[r]} />
                    <text x={262 + j * 140} y={102 + k * 62} fontSize={21} fontWeight={800} fill="#fff" textAnchor="middle">{ROLE_LABEL[r]}</text>
                  </g>
                ))}
              </g>
            ))}
            <text x={32} y={340} fontSize={21} fontWeight={800} fill={SC.muted} opacity={p(t, 34, 34.6)}>Each works alone, and they add up.</text>
          </g>
        )}
      </g>
    </svg>
  );
}
