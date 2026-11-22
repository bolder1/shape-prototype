'use client';
// Scene for pr.1-1: a polished prototype built for a simple layout question draws colour comments; then a fidelity ladder
// climbs rung by rung (paper, clickable wireframe, high fidelity, coded), each with its artefact, cost and the kind of
// question it answers. Pure function of t (0–34).
import { back, clamp, Grid, p, SC } from './shared';

const W = 960, H = 540;
export const RUNGS = [
  { id: 'paper', n: 'Paper', cost: '30 min', q: 'Which ideas are worth pursuing?', at: 6 },
  { id: 'wire', n: 'Clickable wireframe', cost: 'a few hours', q: 'Can people find their way?', at: 12 },
  { id: 'hifi', n: 'High fidelity', cost: 'a few days', q: 'Does it feel trustworthy, on-brand?', at: 18 },
  { id: 'code', n: 'Coded', cost: 'a week or more', q: 'Does it work with real data and gestures?', at: 24 },
];

/** The artefact for a rung, drawn around (0, 0) in a 260 × 300 box. */
function Artefact({ id }: { id: string }) {
  if (id === 'paper') return (
    <g>
      <rect x={-130} y={-150} width={260} height={300} rx={6} fill="#fdf6e3" transform="rotate(-2)" />
      {[[-100, -110, 90], [-100, -80, 200], [-100, -40, 200], [-100, 60, 120]].map(([x, y, w], i) => <path key={i} d={`M${x} ${y} q ${w / 2} ${i % 2 ? 4 : -4} ${w} 0`} stroke="#57534e" strokeWidth={3} fill="none" strokeLinecap="round" />)}
      <rect x={-100} y={-20} width={200} height={60} rx={4} fill="none" stroke="#57534e" strokeWidth={2.5} strokeDasharray="1 0" />
      <path d="M-100 -20 L100 40 M100 -20 L-100 40" stroke="#57534e" strokeWidth={1.5} />
      <rect x={-100} y={90} width={90} height={30} rx={6} fill="none" stroke="#57534e" strokeWidth={2.5} />
    </g>
  );
  if (id === 'wire') return (
    <g>
      {[-70, 70].map((x, i) => (
        <g key={x}>
          <rect x={x - 62} y={-130} width={124} height={250} rx={14} fill={SC.surface} stroke={SC.line} strokeWidth={2} />
          {[0, 1, 2].map(r => <rect key={r} x={x - 46} y={-108 + r * 50} width={92} height={36} rx={6} fill={SC.line} />)}
          {i === 0 && <rect x={x - 46} y={-108} width={92} height={36} rx={6} fill="none" stroke={SC.discover} strokeWidth={2.5} />}
        </g>
      ))}
      <path d="M-24 -90 C 0 -120, 10 -120, 8 -110" stroke={SC.discover} strokeWidth={2.5} fill="none" markerEnd="url(#fid-arrow)" />
    </g>
  );
  if (id === 'hifi') return (
    <g>
      <rect x={-110} y={-150} width={220} height={300} rx={24} fill="#ffffff" stroke={SC.line} strokeWidth={2} />
      <rect x={-90} y={-128} width={180} height={90} rx={14} fill="url(#fid-hero)" />
      <text x={-90} y={-10} fontSize={18} fontWeight={800} fill="#111827">Pay ₹1,240</text>
      <text x={-90} y={14} fontSize={12} fill="#4b5563">Secured by UPI · refund in 2 days</text>
      <rect x={-90} y={80} width={180} height={44} rx={12} fill="#16a34a" />
      <text x={0} y={108} textAnchor="middle" fontSize={15} fontWeight={800} fill="#fff">Pay securely</text>
    </g>
  );
  return (
    <g>
      <rect x={-100} y={-150} width={200} height={300} rx={28} fill="#0f172a" stroke={SC.line} strokeWidth={2} />
      <rect x={-88} y={-136} width={176} height={272} rx={18} fill="#ffffff" />
      {[0, 1, 2, 3].map(r => (
        <g key={r} transform={`translate(${r === 1 ? -26 : 0} 0)`}>
          <rect x={-76} y={-122 + r * 62} width={152} height={52} rx={10} fill={r === 1 ? '#dbeafe' : '#f3f4f6'} />
          <text x={-64} y={-92 + r * 62} fontSize={12} fontWeight={700} fill="#111827">{['Dal makhani · ₹220', 'Paneer roll · ₹160', 'Veg biryani · ₹260', 'Masala dosa · ₹120'][r]}</text>
        </g>
      ))}
      <path d="M40 -42 h40" stroke="#2563eb" strokeWidth={3} markerEnd="url(#fid-arrow)" />
    </g>
  );
}

export function FidelityScene({ t }: { t: number }) {
  const fin = p(t, 29, 29.8);
  const rung = RUNGS.reduce((k, r, i) => (t >= r.at ? i : k), -1);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" role="img" aria-label="Animated story: the fidelity ladder from paper to code, and what each rung costs">
      <rect width={W} height={H} fill={SC.soft} />
      <Grid />
      <defs>
        <marker id="fid-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 L10 5 L0 10 Z" fill={SC.discover} /></marker>
        <linearGradient id="fid-hero" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#6366f1" /><stop offset="1" stopColor="#ec4899" /></linearGradient>
      </defs>
      <g opacity={1 - fin}>
        {/* the over-polished start */}
        {t < 6.4 && (
          <g opacity={clamp(t / 0.5) * (1 - p(t, 5.8, 6.4))}>
            <g transform={`translate(330 280) scale(${clamp(back(t / 0.6))})`}><Artefact id="hifi" /></g>
            <g transform="translate(560 150)">
              <rect width={300} height={46} rx={14} fill={SC.surface} stroke={SC.line} strokeWidth={2} />
              <text x={16} y={29} fontSize={15} fontWeight={800} fill={SC.text}>Question: which layout is clearer?</text>
            </g>
            <g transform="translate(560 214)"><rect width={120} height={34} rx={17} fill={SC.error} /><text x={60} y={22} textAnchor="middle" fontSize={14} fontWeight={800} fill="#fff">3 days</text></g>
            {['“I don’t love that pink.”', '“Can the button be rounder?”'].map((q, i) => (
              <g key={q} transform={`translate(560 ${290 + i * 60}) scale(${clamp(back((t - 2 - i * 0.9) / 0.4))})`}>
                <rect width={290} height={44} rx={14} fill={SC.surface} stroke={SC.line} strokeWidth={2} />
                <text x={16} y={28} fontSize={15} fontWeight={700} fontStyle="italic" fill={SC.text}>{q}</text>
              </g>
            ))}
          </g>
        )}

        {/* the ladder */}
        {t >= 6 && t < 29.4 && (
          <g opacity={clamp((t - 6) / 0.5)}>
            {RUNGS.map((r, i) => {
              const y = 430 - i * 95, on = i === rung, done = i < rung;
              return (
                <g key={r.id} opacity={i <= rung ? 1 : 0.35}>
                  <rect x={60} y={y - 34} width={300} height={68} rx={16} fill={on ? SC.discover : SC.surface} stroke={on || done ? SC.discover : SC.line} strokeWidth={2} />
                  <text x={80} y={y - 4} fontSize={17} fontWeight={800} fill={on ? '#fff' : SC.text}>{r.n}</text>
                  <text x={80} y={y + 18} fontSize={13} fontWeight={700} fill={on ? '#fff' : SC.muted}>{r.cost}</text>
                </g>
              );
            })}
            {rung >= 0 && (
              <g key={rung}>
                <g transform={`translate(640 250) scale(${clamp(back((t - RUNGS[rung].at) / 0.5))})`}><Artefact id={RUNGS[rung].id} /></g>
                <text x={640} y={445} textAnchor="middle" fontSize={16} fontWeight={800} fill={SC.mint} opacity={clamp((t - RUNGS[rung].at - 0.6) / 0.4)}>{RUNGS[rung].q}</text>
              </g>
            )}
          </g>
        )}
      </g>

      {fin > 0 && [{ x: 200, n: 'Fidelity costs', l: 'Minutes → weeks', c: SC.discover }, { x: 480, n: 'Feedback follows', l: 'Polish draws polish comments', c: SC.design }, { x: 760, n: 'Lowest rung', l: 'That can answer the question', c: SC.mint }].map((f, i) => {
        const k = back((t - (29.2 + i * 0.25)) / 0.5);
        return (
          <g key={f.n} transform={`translate(${f.x} 260) scale(${clamp(k)})`}>
            <rect x={-125} y={-70} width={250} height={140} rx={18} fill={SC.surface} stroke={f.c} strokeWidth={3} />
            <text y={-8} textAnchor="middle" fontSize={22} fontWeight={800} fill={f.c}>{f.n}</text>
            <text y={26} textAnchor="middle" fontSize={13} fontWeight={600} fill={SC.text}>{f.l}</text>
          </g>
        );
      })}
    </svg>
  );
}
