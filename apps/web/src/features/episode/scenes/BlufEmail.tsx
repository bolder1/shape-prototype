'use client';
// Scene for bz.2-3: Neha's long update (`NEHA_UPDATE_ORDER`) opens on the research and ends on the ask, so the CFO's
// inbox preview (`inboxPreview`) shows nothing worth opening and it's archived. The rewrite puts the bottom line up
// front: the ask, then why in rupees and minutes, then the plan with dates (`buildSummary`); the method lines fly out
// to a link. It ends on the reading time (`readSeconds`) and a one-word reply. Pure function of t (0–36).
// Also exports `InboxRow` and `PART_TONE` for `summary-build`.
import { NEHA_UPDATE_ORDER, SAMAN_UPDATE, buildSummary, inboxPreview, readSeconds, summaryFlaws, summaryWords, type SamanLine, type SummaryPart } from '@shape/content';
import { back, clamp, Grid, p, SC } from './shared';
import { wrap } from './Measure';

const W = 960, H = 540;
export const PART_TONE: Record<SummaryPart, string> = { ask: SC.build, why: SC.discover, plan: SC.grow, cut: SC.muted };
const OLD = NEHA_UPDATE_ORDER.map(k => SAMAN_UPDATE[k]);
const OLD_TEXT = OLD.map(l => l.text).join(' ');
const NEW_KEYS = buildSummary(Object.keys(SAMAN_UPDATE) as SamanLine[]);
const NEW = NEW_KEYS.map(k => SAMAN_UPDATE[k]);
const NEW_TEXT = NEW.map(l => l.text).join(' ');

/** One row of an inbox: sender, subject and the preview line. */
export function InboxRow({ x, y, w, subject, body, dim }: { x: number; y: number; w: number; subject: string; body: string; dim?: boolean }) {
  return (
    <g transform={`translate(${x} ${y})`} opacity={dim ? 0.45 : 1}>
      <rect width={w} height={66} rx={10} fill={SC.surface} stroke={SC.line} />
      <circle cx={28} cy={33} r={16} fill={SC.soft} stroke={SC.line} />
      <text x={28} y={38} textAnchor="middle" fontSize={14} fontWeight={900} fill={SC.text}>N</text>
      <text x={54} y={26} fontSize={14} fontWeight={900} fill={SC.text}>Neha Iyer · {subject}</text>
      <text x={54} y={48} fontSize={13} fontWeight={600} fill={SC.muted}>{inboxPreview(body, Math.floor((w - 70) / 6.6))}</text>
    </g>
  );
}

export function BlufEmailScene({ t }: { t: number }) {
  const intro = clamp(back(t / 0.6));
  const head = t < 6 ? 'Sent Thursday' : t < 11 ? 'What Farah sees' : t < 26 ? 'Bottom line up front' : t < 31 ? 'Cut the method' : 'Read in the lift';
  const stage = (k: SamanLine) => ({ ask: 11, why: 16, plan: 21, cut: 99 })[SAMAN_UPDATE[k].part];
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" role="img" aria-label={`Animated story: Neha's update opens on the research and puts the ask in the last line. It takes ${readSeconds(OLD_TEXT)} seconds to read, and the inbox preview shows only "${inboxPreview(OLD_TEXT, 60)}", so the CFO archives it. The rewrite opens on the decision, then why it matters in rupees and minutes, then the plan with dates. The workshop, personas and screens are linked, not listed. ${summaryWords(NEW)} words, ${readSeconds(NEW_TEXT)} seconds to read, and the CFO replies "Approved. Go."`}>
      <rect width={W} height={H} fill={SC.soft} />
      <Grid />
      <g opacity={intro}>
        <text x={60} y={60} fontSize={22} fontWeight={900} fill={SC.text}>{head}</text>

        {t < 11 && (
          <g>
            <g transform="translate(60 90)" opacity={t < 6 ? 1 : 1 - p(t, 6, 6.6) * 0.6}>
              <rect width={520} height={420} rx={14} fill={SC.surface} stroke={SC.line} />
              <text x={24} y={34} fontSize={14} fontWeight={900} fill={SC.text}>Subject: Restock research update</text>
              {OLD.reduce<{ y: number; els: React.ReactNode[] }>((acc, l, i) => {
                const lines = wrap(l.text, 76);
                acc.els.push(
                  <g key={i} opacity={p(t, 0.2 + i * 0.3, 0.6 + i * 0.3)}>
                    {lines.map((ln, j) => <text key={j} x={24} y={acc.y + j * 15} fontSize={12} fontWeight={l.part === 'ask' ? 900 : 600} fill={SC.text}>{ln}</text>)}
                  </g>,
                );
                acc.y += lines.length * 15 + 6;
                return acc;
              }, { y: 64, els: [] }).els}
              <text x={24} y={404} fontSize={13} fontWeight={800} fill={SC.error} opacity={p(t, 4, 4.6)}>The ask is the last line · {readSeconds(OLD_TEXT)} s to read · {summaryFlaws(OLD).length} problems</text>
            </g>
            {t >= 6 && (
              <g transform={`translate(${600 - p(t, 9.2, 10.2) * 400} 140)`} opacity={1 - p(t, 9.6, 10.4)}>
                <text x={0} y={-14} fontSize={14} fontWeight={800} fill={SC.muted}>Farah’s inbox, between two meetings</text>
                <InboxRow x={0} y={0} w={340} subject="Restock research update" body={OLD_TEXT} />
              </g>
            )}
            {t >= 6 && <text x={620} y={260} fontSize={16} fontWeight={900} fill={SC.text} opacity={p(t, 8, 8.6)}>No decision, no deadline.</text>}
            {t >= 6 && <text x={620} y={286} fontSize={16} fontWeight={900} fill={SC.error} opacity={p(t, 9.6, 10.2)}>Archived.</text>}
          </g>
        )}

        {t >= 11 && (
          <g>
            <g transform="translate(60 90)">
              <rect width={540} height={420} rx={14} fill={SC.surface} stroke={SC.line} />
              <text x={24} y={34} fontSize={14} fontWeight={900} fill={SC.text}>Subject: Decision by Fri: 2 engineers for restock rebuild</text>
              {NEW_KEYS.reduce<{ y: number; els: React.ReactNode[] }>((acc, k, i) => {
                const l = SAMAN_UPDATE[k];
                const lines = wrap(l.text, 64);
                const s = stage(k) + (NEW_KEYS.slice(0, i).filter(x => SAMAN_UPDATE[x].part === l.part).length) * 1.2;
                acc.els.push(
                  <g key={k} opacity={p(t, s, s + 0.6)}>
                    <rect x={14} y={acc.y - 14} width={4} height={lines.length * 18} rx={2} fill={PART_TONE[l.part]} />
                    {lines.map((ln, j) => <text key={j} x={26} y={acc.y + j * 18} fontSize={14} fontWeight={l.part === 'ask' ? 900 : 600} fill={SC.text}>{ln}</text>)}
                  </g>,
                );
                acc.y += lines.length * 18 + (NEW_KEYS[i + 1] && SAMAN_UPDATE[NEW_KEYS[i + 1]].part !== l.part ? 22 : 8);
                return acc;
              }, { y: 70, els: [] }).els}
              <text x={26} y={396} fontSize={13} fontWeight={800} fill={SC.muted} opacity={p(t, 26.6, 27.2)}>Research, personas and the prototype: linked below.</text>
            </g>
            <g transform="translate(630 110)">
              <text x={0} y={-14} fontSize={14} fontWeight={800} fill={SC.muted}>Farah’s inbox</text>
              <InboxRow x={0} y={0} w={300} subject="Decision by Fri" body={NEW_TEXT} />
            </g>
            {t >= 26 && t < 31 && (
              <g transform="translate(640 220)">
                {NEHA_UPDATE_ORDER.filter(k => SAMAN_UPDATE[k].part === 'cut').map((k, i) => {
                  const a = p(t, 26.2 + i * 0.5, 27 + i * 0.5);
                  return (
                    <g key={k} transform={`translate(${a * 60} ${i * 44})`} opacity={1 - a}>
                      <rect width={260} height={36} rx={8} fill={SC.soft} stroke={SC.line} />
                      <text x={12} y={23} fontSize={12} fontWeight={700} fill={SC.muted}>{wrap(SAMAN_UPDATE[k].text, 36)[0]}…</text>
                    </g>
                  );
                })}
              </g>
            )}
            {t >= 31 && (
              <g transform="translate(630 230)" opacity={p(t, 31.2, 31.8)}>
                <text x={0} y={0} fontSize={44} fontWeight={900} fill={SC.text}>{readSeconds(NEW_TEXT)} s</text>
                <text x={0} y={30} fontSize={16} fontWeight={800} fill={SC.muted}>{summaryWords(NEW)} words, down from {summaryWords(OLD)}</text>
                <g transform="translate(0 70)" opacity={p(t, 32.6, 33.2)}>
                  <rect width={280} height={56} rx={14} fill={SC.surface} stroke={SC.mint} strokeWidth={3} />
                  <text x={18} y={35} fontSize={18} fontWeight={900} fill={SC.text}>Farah: “Approved. Go.”</text>
                </g>
              </g>
            )}
          </g>
        )}
      </g>
    </svg>
  );
}
