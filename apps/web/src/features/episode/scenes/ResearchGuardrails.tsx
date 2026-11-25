'use client';
// Scene for rs.6-3: Musafir opens research up to its squads. Nine squads, three researchers; a PM's phone recordings
// turn up in a WhatsApp group (`MUSAFIR_PLANS.phoneClips`); Lavanya has them deleted and makes the approved way easier
// instead of banning research; Siddharth builds the kit; four levels of support (`SUPPORT`, judged by `support`);
// the harassment study is researcher-led with care; a quarter later squads have run 41 studies and researchers spend
// their time on six. Pure function of t (0–36). Also exports `SUPPORT_TONE` for `plan-critique`.
import { MUSAFIR_PLANS, SUPPORT, support, type Support } from '@shape/content';
import { back, clamp, Grid, lerp, p, SC } from './shared';

const W = 960, H = 540;
export const SUPPORT_TONE: Record<Support, string> = { go: SC.mint, review: SC.discover, partner: SC.design, stop: SC.error };
export const SUPPORT_LABEL: Record<Support, string> = { go: 'Go ahead', review: 'Review first', partner: 'Researcher leads', stop: 'Stop' };
const EXAMPLE: Record<Support, string> = {
  go: 'A usability test of your own design, with the panel and the template',
  review: 'Interviews, surveys, or anything a launch or money rides on',
  partner: 'Big open questions, or people who could be hurt by taking part',
  stop: 'No consent, personal phones, booking data as a call list',
};
const SQUADS = ['Search', 'Booking', 'Payments', 'Pass', 'Boarding', 'Support', 'Operator app', 'Trust & safety', 'Growth'];
const KIT = [
  { title: 'Research panel', body: '3,200 travellers who agreed to be contacted' },
  { title: 'Templates', body: 'Usability test, interview guide, consent form' },
  { title: 'Two-hour course', body: 'Before anyone runs a session' },
  { title: 'Office hours', body: 'Every Thursday, 4–5 pm' },
];

function Para({ x, y, w, h, size = 15, weight = 800, children, muted }: { x: number; y: number; w: number; h: number; size?: number; weight?: number; children: React.ReactNode; muted?: boolean }) {
  return (
    <foreignObject x={x} y={y} width={w} height={h}>
      <p style={{ margin: 0, font: `${weight} ${size}px/1.35 Inter, system-ui, sans-serif`, color: muted ? 'var(--color-text-tertiary)' : 'var(--color-text-primary)' }}>{children}</p>
    </foreignObject>
  );
}

export function ResearchGuardrailsScene({ t }: { t: number }) {
  const intro = clamp(back(t / 0.6));
  const title = t < 6 ? 'Nine squads, three researchers' : t < 11 ? 'The clips' : t < 16 ? 'Not a ban' : t < 21 ? 'The kit' : t < 26 ? 'Four levels' : t < 31 ? 'The hard ones' : 'A quarter later';
  const strike = p(t, 11.6, 12.6);
  const squadStudies = Math.round(lerp(0, 41, p(t, 31.4, 33.4)));
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" role="img" aria-label="Animated story: Musafir has nine squads and three researchers. A PM's recordings of traveller calls, made on his own phone without consent, turn up in a WhatsApp group. Lavanya has them deleted and makes the approved recorder easier than a phone, instead of banning research. Siddharth builds a kit: a consented research panel, templates, a two-hour course and office hours. Plans get one of four levels: go ahead, review first, researcher leads, or stop. Calls with women who reported harassment are researcher-led with care. A quarter later, squads have run 41 studies and researchers spend their time on the six that need them.">
      <rect width={W} height={H} fill={SC.soft} />
      <Grid />
      <g opacity={intro}>
        <text x={60} y={60} fontSize={22} fontWeight={900} fill={SC.text}>{title}</text>

        {t < 6 && (
          <g transform="translate(60 100)">
            {SQUADS.map((s, i) => (
              <g key={s} transform={`translate(${(i % 3) * 176} ${Math.floor(i / 3) * 96})`} opacity={p(t, 0.3 + i * 0.25, 0.7 + i * 0.25)}>
                <rect width={160} height={80} rx={14} fill={SC.surface} stroke={SC.line} strokeWidth={2} />
                <text x={16} y={46} fontSize={15} fontWeight={900} fill={SC.text}>{s}</text>
              </g>
            ))}
            <g transform="translate(580 0)" opacity={p(t, 3, 3.6)}>
              {[0, 1, 2].map(i => <circle key={i} cx={30 + i * 70} cy={40} r={26} fill={SC.surface} stroke={SC.design} strokeWidth={3} />)}
              <text y={98} fontSize={15} fontWeight={800} fill={SC.muted}>Three researchers.</text>
              <text y={152} fontSize={44} fontWeight={900} fill={SC.text}>60 → 12</text>
              <text y={178} fontSize={15} fontWeight={800} fill={SC.muted}>requests a quarter → studies they can run</text>
              <Para x={0} y={212} w={300} h={80} size={14} muted>So the squads have started talking to travellers on their own.</Para>
            </g>
          </g>
        )}

        {t >= 6 && t < 16 && (
          <g transform="translate(60 92)">
            <g opacity={p(t, 6.2, 6.8)}>
              <rect width={280} height={410} rx={30} fill={SC.surface} stroke={SC.line} strokeWidth={2} />
              <text x={24} y={46} fontSize={15} fontWeight={900} fill={SC.text}>Search squad</text>
              <text x={24} y={66} fontSize={12} fontWeight={800} fill={SC.muted}>9 members</text>
              {[0, 1, 2].map(i => (
                <g key={i} transform={`translate(24 ${96 + i * 84})`} opacity={p(t, 7 + i * 0.6, 7.4 + i * 0.6)}>
                  <rect width={220} height={64} rx={14} fill={SC.soft} />
                  <circle cx={30} cy={32} r={16} fill={SC.brand} />
                  <path d="M25 24 l12 8 l-12 8 z" fill="#fff" />
                  {Array.from({ length: 14 }, (_, j) => <rect key={j} x={58 + j * 10} y={32 - ((j * 7 + i * 3) % 5) * 3 - 3} width={5} height={((j * 7 + i * 3) % 5) * 6 + 6} rx={2} fill={SC.muted} />)}
                  <path d={`M8 32 H${lerp(8, 212, strike)}`} stroke={SC.error} strokeWidth={3} opacity={strike} />
                </g>
              ))}
            </g>
            <g transform="translate(320 0)" opacity={p(t, 8.4, 9)}>
              <rect width={520} height={150} rx={16} fill={SC.surface} stroke={SC.error} strokeWidth={2.5} />
              <Para x={22} y={18} w={476} h={120} size={15}>{MUSAFIR_PLANS.phoneClips.breach}.</Para>
            </g>
            {t >= 11 && (
              <g transform="translate(320 180)" opacity={p(t, 12.6, 13.2)}>
                <rect width={520} height={210} rx={16} fill={SC.surface} stroke={SC.mint} strokeWidth={2.5} />
                <text x={22} y={38} fontSize={13} fontWeight={900} fill={SC.muted}>INSTEAD OF A BAN</text>
                <Para x={22} y={50} w={476} h={80} size={15}>The clips are deleted. The approved recorder now starts from one link in the calendar invite, with the consent line read out first.</Para>
                <rect x={22} y={140} width={210} height={46} rx={12} fill={SC.brand} opacity={p(t, 13.6, 14)} />
                <text x={127} y={169} textAnchor="middle" fontSize={14} fontWeight={900} fill="#fff" opacity={p(t, 13.6, 14)}>Start recording</text>
              </g>
            )}
          </g>
        )}

        {t >= 16 && t < 21 && (
          <g transform="translate(60 100)">
            {KIT.map((k, i) => (
              <g key={k.title} transform={`translate(${(i % 2) * 430} ${Math.floor(i / 2) * 170})`} opacity={p(t, 16.3 + i * 0.7, 16.8 + i * 0.7)}>
                <rect width={400} height={150} rx={18} fill={SC.surface} stroke={SC.line} strokeWidth={2} />
                <text x={26} y={56} fontSize={22} fontWeight={900} fill={SC.text}>{k.title}</text>
                <Para x={26} y={74} w={350} h={60} size={15} muted>{k.body}</Para>
              </g>
            ))}
          </g>
        )}

        {t >= 21 && t < 26 && (
          <g transform="translate(60 96)">
            {SUPPORT.map((s, i) => (
              <g key={s} transform={`translate(0 ${i * 100})`} opacity={p(t, 21.3 + i * 0.7, 21.8 + i * 0.7)}>
                <rect width={840} height={84} rx={16} fill={SC.surface} stroke={SUPPORT_TONE[s]} strokeWidth={2.5} />
                <rect x={0} y={0} width={10} height={84} rx={5} fill={SUPPORT_TONE[s]} />
                <text x={32} y={50} fontSize={20} fontWeight={900} fill={SC.text}>{SUPPORT_LABEL[s]}</text>
                <Para x={280} y={18} w={540} h={56} size={15} muted>{EXAMPLE[s]}</Para>
              </g>
            ))}
          </g>
        )}

        {t >= 26 && t < 31 && (
          <g transform="translate(60 96)">
            <g opacity={p(t, 26.2, 26.8)}>
              <rect width={840} height={130} rx={18} fill={SC.surface} stroke={SUPPORT_TONE[support(MUSAFIR_PLANS.harassment)]} strokeWidth={3} />
              <text x={26} y={36} fontSize={13} fontWeight={900} fill={SC.muted}>{MUSAFIR_PLANS.harassment.who.toUpperCase()}</text>
              <Para x={26} y={48} w={600} h={70} size={18}>{MUSAFIR_PLANS.harassment.text}</Para>
              <text x={814} y={36} fontSize={14} fontWeight={900} fill={SC.text} textAnchor="end">{SUPPORT_LABEL[support(MUSAFIR_PLANS.harassment)]}</text>
            </g>
            {['Sneha leads every call, with a colleague from the squad listening', 'Consent in writing, and the right to stop at any time', 'A counsellor’s number ready before the call starts', 'No recording without a separate yes; names never reach the repository'].map((line, i) => (
              <g key={line} transform={`translate(0 ${160 + i * 56})`} opacity={p(t, 27 + i * 0.6, 27.4 + i * 0.6)}>
                <circle cx={14} cy={18} r={11} fill={SC.surface} stroke={SC.design} strokeWidth={2.5} />
                <path d="M9 18 l4 4 l7 -8" fill="none" stroke={SC.text} strokeWidth={2.5} />
                <text x={40} y={24} fontSize={16} fontWeight={800} fill={SC.text}>{line}</text>
              </g>
            ))}
          </g>
        )}

        {t >= 31 && (
          <g transform="translate(60 110)">
            <text fontSize={13} fontWeight={900} fill={SC.muted}>STUDIES THIS QUARTER</text>
            <rect y={20} width={lerp(0, 41 * 16, p(t, 31.4, 33.4))} height={56} rx={10} fill={SC.surface} stroke={SC.mint} strokeWidth={2.5} />
            <text x={16} y={56} fontSize={18} fontWeight={900} fill={SC.text}>{squadStudies} run by squads</text>
            <rect y={96} width={lerp(0, 6 * 16, p(t, 32.4, 33.4))} height={56} rx={10} fill={SC.surface} stroke={SC.design} strokeWidth={2.5} />
            <text x={6 * 16 + 16} y={132} fontSize={18} fontWeight={900} fill={SC.text} opacity={p(t, 33, 33.5)}>6 led by researchers: the big and the sensitive ones</text>
            <Para x={0} y={200} w={840} h={90} size={17} muted>Researchers reviewed guides in two days, audited five squad studies, and spent the rest of their time where expertise mattered most.</Para>
          </g>
        )}
      </g>
    </svg>
  );
}
