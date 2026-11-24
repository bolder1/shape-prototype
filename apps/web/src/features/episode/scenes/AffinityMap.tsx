'use client';
// Scene for rs.3-1: the Dawaa team's wall after 12 interviews. Notes fly in, one is read up close (one quote, tagged
// P3), then Arjun's topic columns (Price, Delivery, App) swallow some notes and leave the rest stranded. The columns go,
// the notes regroup by meaning into four clusters, "Ordering" is struck for a sentence in a participant's voice, and
// each cluster counts its people: 7 of 12 is a finding, 2 of 12 a lead to check. Pure function of t (0–34).
import { FAMILY_SOLID } from '../kit';
import { back, clamp, Grid, lerp, p, SC } from './shared';

const W = 960, H = 540;
/** Sticky-note paper and ink: fixed, so the notes read the same in both themes (ink on paper is 11:1). */
const PAPER = '#FDE68A', INK = '#3B2F0B';
const NW = 58, NH = 40;   // a note on the wall

/** Clusters by meaning: label as a topic, label as a sentence, and the slot centre. */
const CLUSTERS = [
  { topic: 'Ordering', line: ['“I order for someone', 'I can’t see”'], x: 140 },
  { topic: 'Prescriptions', line: ['“The prescription is', 'somewhere in WhatsApp”'], x: 380 },
  { topic: 'Brands', line: ['“A different strip looks', 'like the wrong medicine”'], x: 620 },
  { topic: 'Chemist', line: ['“The chemist', 'remembers for us”'], x: 850 },
];
const TOPICS = ['Price', 'Delivery', 'App'];

/** Each note: who it came from, its cluster by meaning, and the topic column Arjun forced it into (-1: fits nowhere). */
const NOTES: { who: number; c: number; topic: number }[] = [
  { who: 3, c: 0, topic: 2 }, { who: 5, c: 0, topic: 1 }, { who: 6, c: 0, topic: -1 }, { who: 11, c: 0, topic: -1 },
  { who: 1, c: 0, topic: 2 }, { who: 8, c: 0, topic: -1 }, { who: 12, c: 0, topic: 2 },
  { who: 1, c: 1, topic: 2 }, { who: 8, c: 1, topic: 2 }, { who: 12, c: 1, topic: -1 }, { who: 4, c: 1, topic: 2 },
  { who: 7, c: 2, topic: -1 }, { who: 9, c: 2, topic: 0 }, { who: 2, c: 2, topic: -1 },
  { who: 4, c: 3, topic: 0 }, { who: 10, c: 3, topic: 1 },
];
const REACH = CLUSTERS.map((_, c) => new Set(NOTES.filter(n => n.c === c).map(n => n.who)).size);

/** Deterministic scatter for the opening wall. */
const scatter = (i: number) => [70 + ((i * 197) % 800), 120 + ((i * 113) % 330)] as const;

function Note({ x, y, who, tilt = 0, scale = 1, opacity = 1 }: { x: number; y: number; who: number; tilt?: number; scale?: number; opacity?: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${tilt}) scale(${scale})`} opacity={opacity}>
      <rect x={-NW / 2 + 2} y={-NH / 2 + 3} width={NW} height={NH} rx={3} fill="#000" opacity={0.12} />
      <rect x={-NW / 2} y={-NH / 2} width={NW} height={NH} rx={3} fill={PAPER} />
      <text x={-NW / 2 + 6} y={-NH / 2 + 12} fontSize={9} fontWeight={800} fill={INK}>P{who}</text>
      <rect x={-NW / 2 + 6} y={-1} width={NW - 14} height={3} rx={1.5} fill={INK} opacity={0.35} />
      <rect x={-NW / 2 + 6} y={7} width={NW - 24} height={3} rx={1.5} fill={INK} opacity={0.35} />
    </g>
  );
}

export function AffinityMapScene({ t }: { t: number }) {
  const zoom = p(t, 5.2, 6) * (1 - p(t, 9.2, 9.9));   // the close-up of one note
  const topics = p(t, 10.4, 12) * (1 - p(t, 16, 16.8));   // forced into Arjun's columns
  const regroup = p(t, 16.6, 19.5);
  const named = p(t, 22.2, 22.8), strike = p(t, 23, 23.6), sentence = p(t, 23.8, 24.4);
  const counted = p(t, 27.2, 28);

  // Where each note sits in each phase.
  const inCluster = (i: number) => {
    const n = NOTES[i], k = NOTES.slice(0, i).filter(o => o.c === n.c).length;
    return [CLUSTERS[n.c].x - 32 + (k % 2) * 64, 222 + Math.floor(k / 2) * 46] as const;
  };
  const inTopic = (i: number) => {
    const n = NOTES[i];
    if (n.topic < 0) { const k = NOTES.slice(0, i).filter(o => o.topic < 0).length; return [714 + (k % 3) * 66, 320 + Math.floor(k / 3) * 44] as const; }
    const k = NOTES.slice(0, i).filter(o => o.topic === n.topic).length;
    return [110 + n.topic * 190, 190 + k * 22] as const;   // App piles up: the notes overlap
  };

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" role="img" aria-label="Animated story: interview notes regrouped from topic columns into affinity clusters named in the participants’ words">
      <rect width={W} height={H} fill={SC.soft} />
      <Grid />
      <text x={40} y={58} fontSize={22} fontWeight={800} fill={SC.text}>Dawaa · 12 interviews</text>
      <text x={40} y={84} fontSize={14} fontWeight={600} fill={SC.muted}>
        {t < 10 ? 'One quote or one observation per note' : t < 16.4 ? 'Arjun’s columns, written before reading' : t < 27 ? 'Grouped by what the notes mean' : 'Count the people, not the notes'}
      </text>

      {/* Arjun's topic columns */}
      {topics > 0 && (
        <g opacity={topics}>
          {TOPICS.map((n, k) => (
            <g key={n}>
              <rect x={50 + k * 190} y={130} width={120} height={k === 2 ? 290 : 120} rx={12} fill={SC.surface} stroke={SC.line} strokeWidth={2} />
              <text x={110 + k * 190} y={156} textAnchor="middle" fontSize={16} fontWeight={800} fill={SC.text}>{n}</text>
            </g>
          ))}
          <rect x={660} y={290} width={240} height={150} rx={12} fill="none" stroke={SC.error} strokeWidth={2} strokeDasharray="6 5" />
          <text x={780} y={468} textAnchor="middle" fontSize={15} fontWeight={800} fill={SC.error} opacity={p(t, 12.6, 13.2)}>Fits nowhere</text>
          <text x={110 + 2 * 190} y={448} textAnchor="middle" fontSize={13} fontWeight={700} fill={SC.muted} opacity={p(t, 13.6, 14.2)}>“App” swallows everything</text>
        </g>
      )}

      {/* clusters by meaning */}
      {regroup > 0 && CLUSTERS.map((c, k) => {
        const pop = clamp(back((t - 17 - k * 0.3) / 0.5));
        return (
          <g key={c.topic} opacity={regroup}>
            <rect x={c.x - 104} y={160} width={208} height={300} rx={16} fill={SC.surface} stroke={FAMILY_SOLID[k]} strokeWidth={2.5} strokeOpacity={pop} />
            {named > 0 && (
              <g opacity={named}>
                {sentence < 1 && (
                  <g opacity={1 - sentence}>
                    <text x={c.x} y={192} textAnchor="middle" fontSize={17} fontWeight={800} fill={SC.text}>{c.topic}</text>
                    {k === 0 && <line x1={c.x - 42} x2={lerp(c.x - 42, c.x + 42, strike)} y1={186} y2={186} stroke={SC.error} strokeWidth={2.5} />}
                  </g>
                )}
                {sentence > 0 && c.line.map((l, j) => (
                  <text key={l} x={c.x} y={184 + j * 17} textAnchor="middle" fontSize={13.5} fontWeight={800} fill={SC.text} opacity={sentence}>{l}</text>
                ))}
              </g>
            )}
            {counted > 0 && (
              <g transform={`translate(${c.x} 432) scale(${clamp(back((t - 27.2 - k * 0.3) / 0.5))})`}>
                <rect x={-66} y={-15} width={132} height={30} rx={15} fill={REACH[k] >= 3 ? FAMILY_SOLID[k] : SC.surface} stroke={FAMILY_SOLID[k]} strokeWidth={2} />
                <text y={5} textAnchor="middle" fontSize={13} fontWeight={800} fill={REACH[k] >= 3 ? '#fff' : SC.text}>{REACH[k]} of 12 people</text>
              </g>
            )}
          </g>
        );
      })}

      {/* the notes */}
      {NOTES.map((n, i) => {
        const arrive = clamp(back((t - 0.3 - i * 0.12) / 0.5));
        if (arrive <= 0) return null;
        const s = scatter(i), f = inTopic(i), c = inCluster(i);
        const toTopic = topics > 0 ? p(t, 10.4 + (i % 5) * 0.15, 11.8 + (i % 5) * 0.15) : 0;
        let x = lerp(s[0], f[0], toTopic), y = lerp(s[1], f[1], toTopic);
        if (regroup > 0) { const k = p(t, 16.6 + (i % 6) * 0.2, 18.4 + (i % 6) * 0.2); x = lerp(f[0], c[0], k); y = lerp(f[1], c[1], k); }
        const tilt = ((i * 37) % 9) - 4;
        return <Note key={i} x={x} y={y} who={n.who} tilt={tilt} scale={arrive} opacity={1 - zoom * 0.75} />;
      })}

      {/* the lone loud voice is not a finding */}
      {counted > 0 && (
        <text x={850} y={500} textAnchor="middle" fontSize={13} fontWeight={700} fill={SC.muted} opacity={p(t, 29, 29.6)}>A lead to check, not a finding</text>
      )}
      {counted > 0 && (
        <text x={140} y={500} textAnchor="middle" fontSize={13} fontWeight={700} fill={SC.text} opacity={p(t, 28.4, 29)}>A finding</text>
      )}

      {/* one note, up close */}
      {zoom > 0 && (
        <g transform={`translate(480 290) scale(${lerp(0.4, 1, zoom)}) rotate(-2)`} opacity={zoom}>
          <rect x={-212} y={-114} width={430} height={234} rx={6} fill="#000" opacity={0.14} />
          <rect x={-218} y={-120} width={430} height={234} rx={6} fill={PAPER} />
          <text x={-190} y={-78} fontSize={18} fontWeight={800} fill={INK}>P3 · Sunita, Pune</text>
          <text x={-190} y={-28} fontSize={22} fontWeight={700} fill={INK}>“I only find out she’s run out</text>
          <text x={-190} y={4} fontSize={22} fontWeight={700} fill={INK}>when she calls me at work.”</text>
          <text x={-190} y={78} fontSize={14} fontWeight={600} fill={INK} opacity={0.75}>One quote. One person. One note.</text>
        </g>
      )}
    </svg>
  );
}
