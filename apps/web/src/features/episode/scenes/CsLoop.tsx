'use client';
// Scene for bz.3-3: Lakshmi's ticket queue, 212 a month, that design never sees. Aditi sits in and they agree tags;
// the themes (`PARCHA_SIGNALS`) rank two ways (`rankSignals`): GST invoices top the ticket count, rescheduling tops
// the revenue (`lakh`). The themes flow into four routes (`ROUTES`, `ROUTE_OWNER`) with their revenue totted up
// (`arrByRoute`). The reschedule fix ships after CS reviews it, the Marathi promise goes back to sales, and the loop
// closes: CS tells the clinics (`loopAccounts`) and reschedule tickets fall (`RESCHEDULE_TICKETS`).
// Pure function of t (0–36). Also exports `ROUTE_TONE`, `ROUTE_NAME` and `SIGNAL_SHORT` for `signal-route`.
import { PARCHA_SIGNALS, RESCHEDULE_TICKETS, ROUTES, arrByRoute, lakh, loopAccounts, rankSignals, type ParchaSignal, type Route } from '@shape/content';
import { back, clamp, Grid, lerp, p, SC } from './shared';

const W = 960, H = 540;
export const ROUTE_TONE: Record<Route, string> = { fix: SC.design, guide: SC.discover, promise: SC.build, roadmap: SC.grow };
export const ROUTE_NAME: Record<Route, string> = { fix: 'Design fix', guide: 'Guide', promise: 'Sales promise', roadmap: 'Roadmap' };
const KEYS = Object.keys(PARCHA_SIGNALS) as ParchaSignal[];
export const SIGNAL_SHORT: Record<ParchaSignal, string> = {
  reschedule: 'Rescheduling', blank: 'Blank reschedule link', invoice: 'Where are GST invoices?', timings: 'Second doctor’s timings',
  marathi: 'Marathi reminders', scribe: 'The AI scribe', lab: 'Lab reports', emi: 'Instalments',
};
const TAG: Record<ParchaSignal, string> = {
  reschedule: 'reschedule', blank: 'reminder-link', invoice: 'invoices', timings: 'doctor-timings', marathi: 'language', scribe: 'ai-scribe', lab: 'lab-reports', emi: 'payments',
};
const BY_TICKETS = rankSignals(KEYS, 'tickets').slice(0, 4);
const BY_ARR = rankSignals(KEYS, 'arr').slice(0, 4);
const ARR = arrByRoute(KEYS);
const TOLD = loopAccounts(['reschedule'], 'fix');

function Ranking({ x, title, keys, by, o, t0, t }: { x: number; title: string; keys: ParchaSignal[]; by: 'tickets' | 'arr'; o: number; t0: number; t: number }) {
  const max = PARCHA_SIGNALS[keys[0]][by];
  return (
    <g transform={`translate(${x} 130)`} opacity={o}>
      <text x={0} y={0} fontSize={15} fontWeight={900} fill={SC.text}>{title}</text>
      {keys.map((k, i) => {
        const s = PARCHA_SIGNALS[k], w = (s[by] / max) * 240 * p(t, t0 + i * 0.3, t0 + 0.8 + i * 0.3);
        const top = k === 'reschedule' || (by === 'tickets' && i === 0);
        return (
          <g key={k} transform={`translate(0 ${24 + i * 52})`}>
            <text x={0} y={14} fontSize={13} fontWeight={800} fill={SC.text}>{SIGNAL_SHORT[k]}</text>
            <rect x={0} y={22} width={Math.max(0, w)} height={16} rx={6} fill={top ? ROUTE_TONE[s.route] : SC.line} />
            <text x={Math.max(0, w) + 8} y={35} fontSize={13} fontWeight={800} fill={SC.muted}>{by === 'tickets' ? `${s.tickets} tickets` : `${lakh(s.arr)} · ${s.accounts} clinics`}</text>
          </g>
        );
      })}
    </g>
  );
}

export function CsLoopScene({ t }: { t: number }) {
  const intro = clamp(back(t / 0.6));
  const routing = t >= 16;
  const shrink = p(t, 31.5, 33.5);
  const tickets = Math.round(lerp(RESCHEDULE_TICKETS.before, RESCHEDULE_TICKETS.after, shrink));
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" role="img" aria-label={`Animated story: Lakshmi's customer success team answers 212 tickets a month. Aditi sits in on calls and they agree one set of tags. Ranked by tickets, GST invoice questions come first, ${PARCHA_SIGNALS.invoice.tickets} tickets; ranked by revenue, rescheduling comes first, ${PARCHA_SIGNALS.reschedule.accounts} clinics paying ${lakh(PARCHA_SIGNALS.reschedule.arr)} a year. Themes go to four routes: design fix, guide, sales promise, roadmap. The one-tap reschedule ships after CS reviews it, the Marathi reminder promise goes back to sales, CS tells ${TOLD} clinics, and reschedule tickets fall from ${RESCHEDULE_TICKETS.before} to ${RESCHEDULE_TICKETS.after} a month.`}>
      <rect width={W} height={H} fill={SC.soft} />
      <Grid />
      <g opacity={intro}>
        <text x={60} y={60} fontSize={22} fontWeight={900} fill={SC.text}>
          {t < 6 ? '212 tickets a month' : t < 11 ? 'Sit in, read the queue' : t < 16 ? 'Loud isn’t big' : t < 21 ? 'Four routes' : t < 26 ? 'The fix, reviewed by CS' : t < 31 ? 'The promise goes back to sales' : 'Close the loop'}
        </text>

        {t < 11 && (
          <g>
            {Array.from({ length: 24 }, (_, i) => {
              const o = p(t, i * 0.15, i * 0.15 + 0.4);
              const tagged = t >= 6 + (i % 8) * 0.35;
              const k = KEYS[i % 8];
              return (
                <g key={i} transform={`translate(${60 + (i % 6) * 140} ${120 + Math.floor(i / 6) * 70})`} opacity={o}>
                  <rect width={128} height={56} rx={10} fill={SC.surface} stroke={tagged ? ROUTE_TONE[PARCHA_SIGNALS[k].route] : SC.line} strokeWidth={tagged ? 2.5 : 1} />
                  <rect x={12} y={14} width={86} height={6} rx={3} fill={SC.line} />
                  <rect x={12} y={26} width={60} height={6} rx={3} fill={SC.line} />
                  {tagged && <text x={12} y={48} fontSize={11} fontWeight={800} fill={SC.text}>#{TAG[k]}</text>}
                </g>
              );
            })}
            <text x={60} y={440} fontSize={16} fontWeight={800} fill={SC.muted} opacity={p(t, 1, 1.5)}>{t < 6 ? '212 tickets this month. Design has never read one.' : 'Aditi joins five CS calls. One shared set of tags, so every theme can be counted.'}</text>
          </g>
        )}

        {t >= 11 && t < 16 && (
          <g>
            <Ranking x={60} title="By tickets" keys={BY_TICKETS} by="tickets" o={p(t, 11, 11.5)} t0={11.2} t={t} />
            <Ranking x={500} title="By clinics and revenue" keys={BY_ARR} by="arr" o={p(t, 12.5, 13)} t0={12.7} t={t} />
          </g>
        )}

        {routing && (
          <g>
            {ROUTES.map((r, i) => {
              const ks = KEYS.filter(k => PARCHA_SIGNALS[k].route === r);
              const focus = (r === 'fix' && t >= 21 && t < 26) || (r === 'promise' && t >= 26 && t < 31);
              return (
                <g key={r} transform={`translate(${60 + i * 214} 120)`} opacity={p(t, 16 + i * 0.4, 16.6 + i * 0.4)}>
                  <rect width={200} height={250} rx={14} fill={SC.surface} stroke={ROUTE_TONE[r]} strokeWidth={focus ? 4 : 2} />
                  <text x={16} y={32} fontSize={17} fontWeight={900} fill={SC.text}>{ROUTE_NAME[r]}</text>
                  <text x={16} y={54} fontSize={13} fontWeight={800} fill={SC.muted}>{lakh(ARR[r])} a year</text>
                  {ks.map((k, j) => (
                    <g key={k} transform={`translate(12 ${72 + j * 50})`} opacity={p(t, 17 + j * 0.5 + i * 0.3, 17.5 + j * 0.5 + i * 0.3)}>
                      <rect width={176} height={42} rx={8} fill={SC.soft} />
                      <text x={10} y={18} fontSize={12} fontWeight={800} fill={SC.text}>{SIGNAL_SHORT[k]}</text>
                      <text x={10} y={34} fontSize={11} fontWeight={700} fill={SC.muted}>{PARCHA_SIGNALS[k].accounts} clinics · {PARCHA_SIGNALS[k].tickets} tickets</text>
                    </g>
                  ))}
                </g>
              );
            })}
          </g>
        )}

        {t >= 21 && t < 26 && (
          <g transform="translate(60 400)" opacity={p(t, 21.2, 21.8)}>
            <rect width={620} height={72} rx={14} fill={SC.surface} stroke={SC.design} strokeWidth={2} />
            <text x={20} y={30} fontSize={16} fontWeight={900} fill={SC.text}>Drag an appointment to reschedule: one tap, not four</text>
            <text x={20} y={54} fontSize={14} fontWeight={700} fill={SC.muted}>Lakshmi’s team tries it on the scripts they use with clinics</text>
          </g>
        )}
        {t >= 26 && t < 31 && (
          <g transform="translate(60 400)" opacity={p(t, 26.2, 26.8)}>
            <rect width={620} height={72} rx={14} fill={SC.surface} stroke={SC.build} strokeWidth={2} />
            <text x={20} y={30} fontSize={16} fontWeight={900} fill={SC.text}>Marathi reminders come off the deck until they’re built</text>
            <text x={20} y={54} fontSize={14} fontWeight={700} fill={SC.muted}>Karan changes the demo; Lakshmi calls Sunrise</text>
          </g>
        )}
        {t >= 31 && (
          <g transform="translate(60 400)" opacity={p(t, 31, 31.5)}>
            <rect width={620} height={84} rx={14} fill={SC.surface} stroke={SC.mint} strokeWidth={3} />
            <text x={20} y={34} fontSize={18} fontWeight={900} fill={SC.text}>CS tells all {TOLD} clinics it’s live</text>
            <text x={20} y={62} fontSize={15} fontWeight={700} fill={SC.muted}>Reschedule tickets next month:</text>
            <text x={262} y={62} fontSize={22} fontWeight={900} fill={SC.text}>{tickets}</text>
            <rect x={310} y={48} width={Math.max(4, (tickets / RESCHEDULE_TICKETS.before) * 280)} height={16} rx={6} fill={SC.mint} />
          </g>
        )}
      </g>
    </svg>
  );
}
