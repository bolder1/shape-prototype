'use client';
// Scene for cw.3-2: Taar's 640 help items had no owners, so a plan page outlived its plan and a March outage notice
// was still up in November. Then: an owner per kind (`KIND_OWNER`), review cadence by risk (`REVIEW_DAYS`), one
// workflow (`TAAR_WORKFLOW`), a quarterly audit with data, the four calls in order (`AUDIT_CALLS`, as `auditCall`
// asks them), and retiring with a redirect. Pure function of t (0–36). Also exports `CALL_FILL`, which `rot-audit` uses.
import { CONTENT_KINDS, KIND_OWNER, REVIEW_DAYS, TAAR_AUDIT, TAAR_WORKFLOW, type AuditCall, type ContentKind } from '@shape/content';
import { back, clamp, Grid, lerp, p, SC } from './shared';

const W = 640, H = 360;
/** One fill per audit call; white text on each passes 4.5:1. */
export const CALL_FILL: Record<AuditCall, string> = { keep: '#067647', refresh: '#175CD3', merge: '#6941C6', retire: '#B42318' };
export const KIND_LABEL: Record<ContentKind, string> = { billing: 'Billing', account: 'Account', troubleshoot: 'Troubleshooting', policy: 'Policy' };

export function ContentLifecycleScene({ t }: { t: number }) {
  const intro = clamp(back(t / 0.6));
  const title = t < 6 ? '640 items, no owners' : t < 11 ? 'Every type has an owner' : t < 16 ? 'Review by risk' : t < 21 ? 'One workflow' : t < 26 ? 'Audit with data' : t < 31 ? 'Keep, refresh, merge, retire' : 'Retire with a redirect';

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" role="img" aria-label={`Animated story: Taar's help centre had 640 items and no owners. A Fibre 50 plan page outlived the plan, two Wi-Fi articles gave different steps, and a March outage notice was still on the home page in November. Each kind of content gets an owner team: ${CONTENT_KINDS.map(k => `${KIND_LABEL[k]} by ${KIND_OWNER[k]}`).join(', ')}, with content design owning the writing. Reviews follow risk: billing every ${REVIEW_DAYS.billing} days, troubleshooting every ${REVIEW_DAYS.troubleshoot}, policy every ${REVIEW_DAYS.policy}, and outage notices expire when the outage ends. Every change follows one workflow: ${TAAR_WORKFLOW.join(', ')}. Each quarter an audit reads views, searches that ended on the page and contacts after reading, and asks in order: is it true, is it a duplicate, does anyone need it, is it overdue. Items are kept, refreshed, merged or retired. Retired pages redirect, and 640 items become 410.`}>
      <rect width={W} height={H} fill={SC.soft} />
      <Grid w={W} h={H} />
      <g opacity={intro}>
        <text x={32} y={44} fontSize={26} fontWeight={900} fill={SC.text}>{title}</text>

        {t < 6 && (
          <g>
            {[['Fibre 50 plan', 'ended in March, page still live'], ['Change Wi-Fi password', 'two articles, two sets of steps'], ['Outage in Baner, 14 March', 'still on the home page']].map(([a, b], i) => (
              <g key={a} opacity={p(t, 0.4 + i * 0.9, 1 + i * 0.9)}>
                <rect x={32} y={72 + i * 76} width={576} height={64} rx={12} fill={SC.surface} stroke={SC.error} strokeWidth={2} />
                <text x={52} y={100 + i * 76} fontSize={21} fontWeight={900} fill={SC.text}>{a}</text>
                <text x={52} y={126 + i * 76} fontSize={21} fontWeight={700} fill={SC.muted}>{b}</text>
              </g>
            ))}
            <text x={32} y={334} fontSize={22} fontWeight={900} fill={SC.error} opacity={p(t, 3.6, 4.2)}>Owner: nobody. Review date: never.</text>
          </g>
        )}

        {t >= 6 && t < 11 && (
          <g>
            {[...CONTENT_KINDS.map(k => [KIND_LABEL[k], KIND_OWNER[k]] as const), ['The writing', 'Content design'] as const].map(([kind, owner], i) => (
              <g key={kind} opacity={p(t, 6.3 + i * 0.5, 6.9 + i * 0.5)}>
                <rect x={32} y={70 + i * 54} width={576} height={46} rx={10} fill={SC.surface} stroke={SC.line} strokeWidth={2} />
                <text x={52} y={100 + i * 54} fontSize={21} fontWeight={800} fill={SC.text}>{kind}</text>
                <text x={592} y={100 + i * 54} fontSize={21} fontWeight={900} fill={CALL_FILL.merge} textAnchor="end">{owner}</text>
              </g>
            ))}
          </g>
        )}

        {t >= 11 && t < 16 && (
          <g>
            {(['billing', 'troubleshoot', 'policy'] as const).map((k, i) => {
              const grow = p(t, 11.4 + i * 0.7, 12.4 + i * 0.7);
              const w = (REVIEW_DAYS[k] / 365) * 380;
              return (
                <g key={k}>
                  <text x={32} y={100 + i * 66} fontSize={21} fontWeight={800} fill={SC.text}>{KIND_LABEL[k]}</text>
                  <rect x={32} y={110 + i * 66} width={w * grow} height={18} rx={9} fill={CALL_FILL.refresh} />
                  <text x={44 + w * grow} y={126 + i * 66} fontSize={21} fontWeight={900} fill={SC.text} opacity={grow}>{REVIEW_DAYS[k]} days</text>
                </g>
              );
            })}
            <text x={32} y={318} fontSize={21} fontWeight={800} fill={SC.text} opacity={p(t, 13.8, 14.4)}>Outage notices expire when the outage ends</text>
          </g>
        )}

        {t >= 16 && t < 21 && (() => {
          const at = Math.min(TAAR_WORKFLOW.length - 1, Math.floor(lerp(0, TAAR_WORKFLOW.length, p(t, 16.6, 20.2))));
          return (
            <g>
              {TAAR_WORKFLOW.map((s, i) => {
                const on = i <= at;
                return (
                  <g key={s} opacity={p(t, 16.2 + i * 0.3, 16.6 + i * 0.3)}>
                    <rect x={32 + i * 64} y={66 + i * 54} width={260} height={44} rx={22} fill={on ? CALL_FILL.keep : SC.surface} stroke={on ? 'none' : SC.line} strokeWidth={2} />
                    <text x={162 + i * 64} y={95 + i * 54} fontSize={21} fontWeight={800} fill={on ? '#fff' : SC.text} textAnchor="middle">{s}</text>
                  </g>
                );
              })}
            </g>
          );
        })()}

        {t >= 21 && t < 26 && (
          <g>
            <text x={32} y={88} fontSize={21} fontWeight={800} fill={SC.muted} opacity={p(t, 21.2, 21.8)}>Understand your bill</text>
            {[['Views a month', TAAR_AUDIT.bill.views.toLocaleString('en-IN'), 1], ['Searches that ended here', '31%', 0.31], ['Contacted us after reading', '18%', 0.18]].map(([label, val, share], i) => (
              <g key={label as string} opacity={p(t, 21.8 + i * 0.6, 22.4 + i * 0.6)}>
                <text x={32} y={132 + i * 66} fontSize={21} fontWeight={800} fill={SC.text}>{label}</text>
                <rect x={32} y={142 + i * 66} width={420 * (share as number) * p(t, 22 + i * 0.6, 23 + i * 0.6)} height={14} rx={7} fill={i === 2 ? SC.error : CALL_FILL.refresh} />
                <text x={608} y={156 + i * 66} fontSize={21} fontWeight={900} fill={SC.text} textAnchor="end">{val}</text>
              </g>
            ))}
            <text x={32} y={338} fontSize={21} fontWeight={700} fill={SC.muted} opacity={p(t, 24, 24.6)}>Views say people arrive. Contacts say it failed.</text>
          </g>
        )}

        {t >= 26 && t < 31 && (
          <g>
            {([['Still true?', 'No', 'retire'], ['Says what another says?', 'Yes', 'merge'], ['Anyone need it?', 'No', 'retire'], ['Past its review date?', 'Yes', 'refresh'], ['Otherwise', '', 'keep']] as const).map(([q, a, call], i) => (
              <g key={q} opacity={p(t, 26.2 + i * 0.6, 26.8 + i * 0.6)}>
                <text x={32} y={98 + i * 54} fontSize={21} fontWeight={800} fill={SC.text}>{q}</text>
                <text x={372} y={98 + i * 54} fontSize={21} fontWeight={800} fill={SC.muted} textAnchor="end">{a}</text>
                <rect x={400} y={72 + i * 54} width={208} height={40} rx={20} fill={CALL_FILL[call]} />
                <text x={504} y={99 + i * 54} fontSize={21} fontWeight={900} fill="#fff" textAnchor="middle">{call[0].toUpperCase() + call.slice(1)}</text>
              </g>
            ))}
          </g>
        )}

        {t >= 31 && (() => {
          const n = Math.round(lerp(640, 410, p(t, 32.6, 34.6)));
          return (
            <g>
              <g opacity={p(t, 31.2, 31.8)}>
                <rect x={32} y={76} width={240} height={64} rx={12} fill={SC.surface} stroke={CALL_FILL.retire} strokeWidth={2} />
                <text x={52} y={116} fontSize={21} fontWeight={800} fill={SC.muted} textDecoration="line-through">/fibre-50</text>
              </g>
              <path d="M 280 108 L 340 108" stroke={CALL_FILL.retire} strokeWidth={4} opacity={p(t, 31.8, 32.2)} />
              <path d="M 332 98 L 344 108 L 332 118" fill="none" stroke={CALL_FILL.retire} strokeWidth={4} opacity={p(t, 31.8, 32.2)} />
              <g opacity={p(t, 32, 32.6)}>
                <rect x={352} y={76} width={256} height={64} rx={12} fill={CALL_FILL.keep} />
                <text x={480} y={116} fontSize={21} fontWeight={900} fill="#fff" textAnchor="middle">Compare our plans</text>
              </g>
              <text x={32} y={228} fontSize={56} fontWeight={900} fill={SC.text} opacity={p(t, 32.4, 33)}>{n}</text>
              <text x={160} y={226} fontSize={21} fontWeight={800} fill={SC.muted} opacity={p(t, 32.4, 33)}>items, each with an owner and a date</text>
              <text x={32} y={318} fontSize={21} fontWeight={800} fill={SC.text} opacity={p(t, 34.4, 35)}>Smaller, and all of it true</text>
            </g>
          );
        })()}
      </g>
    </svg>
  );
}
