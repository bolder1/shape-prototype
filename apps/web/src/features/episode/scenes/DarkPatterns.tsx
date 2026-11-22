'use client';
// Scene for gr.1-4: a checkout full of tricks (pre-ticked add-on, fake timer, a fee that appears at the end), a
// confirmshaming pop-up, a roach-motel cancellation, the cost arriving as refunds and complaints, then the fair version.
// Pure function of t (0–34).
import { CheckIcon } from '@phosphor-icons/react/ssr';
import { back, clamp, Grid, p, SC } from './shared';

const W = 960, H = 540;
const Tag = ({ x, y, text, c = SC.error, o }: { x: number; y: number; text: string; c?: string; o: number }) => (
  <g transform={`translate(${x} ${y}) scale(${clamp(back(o * 1.2))})`} opacity={clamp(o * 3)}>
    <rect x={0} y={-15} width={text.length * 8 + 22} height={30} rx={15} fill={c} />
    <text x={11} y={5} fontSize={13} fontWeight={800} fill="#fff">{text}</text>
  </g>
);

function Checkout({ fair, t }: { fair: boolean; t: number }) {
  const fee = fair || t >= 3.6;
  const secs = 599 - Math.floor(t);   // a fake 10-minute countdown
  const timer = fair ? 'Sale ends Sun 30 Nov' : `Offer ends ${String(Math.floor(secs / 60)).padStart(2, '0')}:${String(secs % 60).padStart(2, '0')}`;
  return (
    <g>
      <rect width={300} height={330} rx={26} fill="#ffffff" stroke={SC.line} strokeWidth={2} />
      <text x={24} y={40} fontSize={17} fontWeight={800} fill="#111827">Your order</text>
      <rect x={24} y={56} width={252} height={30} rx={8} fill={fair ? '#ecfdf5' : '#fef2f2'} />
      <text x={36} y={76} fontSize={12} fontWeight={800} fill={fair ? '#047857' : '#b91c1c'}>{timer}</text>
      <text x={24} y={118} fontSize={14} fill="#111827">Thali for two</text><text x={276} y={118} textAnchor="end" fontSize={14} fill="#111827">₹340</text>
      <rect x={24} y={134} width={16} height={16} rx={4} fill={fair ? '#fff' : '#2563eb'} stroke="#2563eb" strokeWidth={2} />
      {!fair && <path d="M27 142 l4 4 7 -8" stroke="#fff" strokeWidth={2.5} fill="none" />}
      <text x={48} y={147} fontSize={13} fill="#374151">Order protection</text><text x={276} y={147} textAnchor="end" fontSize={13} fill="#374151">₹29</text>
      {fee && <><text x={24} y={178} fontSize={13} fill="#374151">Convenience fee</text><text x={276} y={178} textAnchor="end" fontSize={13} fill="#374151">₹49</text></>}
      <line x1={24} y1={196} x2={276} y2={196} stroke="#e5e7eb" />
      <text x={24} y={222} fontSize={15} fontWeight={800} fill="#111827">Total</text>
      <text x={276} y={222} textAnchor="end" fontSize={15} fontWeight={800} fill="#111827">{fair ? '₹389' : fee ? '₹418' : '₹369'}</text>
      <rect x={24} y={260} width={252} height={46} rx={12} fill="#2563eb" />
      <text x={150} y={289} textAnchor="middle" fontSize={15} fontWeight={800} fill="#fff">Pay now</text>
    </g>
  );
}

export function DarkPatternsScene({ t }: { t: number }) {
  const fin = p(t, 29, 29.8);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" role="img" aria-label="Animated story: common dark patterns, what they cost, and the fair alternative">
      <rect width={W} height={H} fill={SC.soft} />
      <Grid />
      <g opacity={1 - fin}>
        {/* tricks at checkout */}
        {t < 6.4 && (
          <g opacity={clamp(t / 0.5) * (1 - p(t, 5.8, 6.4))}>
            <g transform="translate(330 100)"><Checkout fair={false} t={t} /></g>
            <Tag x={650} y={170} text="Fake countdown" o={clamp((t - 1) / 0.5)} />
            <Tag x={650} y={240} text="Pre-ticked add-on" o={clamp((t - 2.2) / 0.5)} />
            <Tag x={650} y={292} text="Fee revealed last" o={clamp((t - 3.8) / 0.5)} />
          </g>
        )}

        {/* confirmshaming */}
        {t >= 6 && t < 11.4 && (
          <g opacity={clamp((t - 6) / 0.5) * (1 - p(t, 10.8, 11.4))}>
            <g transform={`translate(300 120) scale(${clamp(back((t - 6.2) / 0.5))})`}>
              <rect width={360} height={240} rx={22} fill="#ffffff" stroke={SC.line} strokeWidth={2} />
              <text x={180} y={56} textAnchor="middle" fontSize={20} fontWeight={800} fill="#111827">Get 10% off your next order?</text>
              <rect x={40} y={92} width={280} height={50} rx={12} fill="#2563eb" />
              <text x={180} y={123} textAnchor="middle" fontSize={16} fontWeight={800} fill="#fff">Yes, I love saving!</text>
              <text x={180} y={182} textAnchor="middle" fontSize={12} fill="#9ca3af">No thanks, I don’t like saving money</text>
            </g>
            <Tag x={420} y={410} text="Confirmshaming" o={clamp((t - 7.4) / 0.5)} />
          </g>
        )}

        {/* roach motel */}
        {t >= 11 && t < 17.4 && (
          <g opacity={clamp((t - 11) / 0.5) * (1 - p(t, 16.8, 17.4))}>
            <g transform="translate(120 140)">
              <rect width={170} height={60} rx={14} fill={SC.mint} />
              <text x={85} y={37} textAnchor="middle" fontSize={16} fontWeight={800} fill="#fff">Subscribe: 1 tap</text>
            </g>
            {['Settings', 'Account', 'Membership', 'Manage', 'Are you sure?', 'Call 10–11 am, weekdays'].map((s, i) => (
              <g key={s} transform={`translate(${340 + (i % 3) * 190} ${120 + Math.floor(i / 3) * 110}) scale(${clamp(back((t - 11.6 - i * 0.45) / 0.4))})`}>
                <rect width={170} height={60} rx={14} fill={SC.surface} stroke={i === 5 ? SC.error : SC.line} strokeWidth={2} />
                <text x={85} y={36} textAnchor="middle" fontSize={i === 5 ? 12 : 14} fontWeight={800} fill={i === 5 ? SC.error : SC.text}>{s}</text>
              </g>
            ))}
            <text x={720} y={330} fontSize={12} fontWeight={700} fill={SC.muted}>…to cancel</text>
            <Tag x={380} y={400} text="Roach motel" o={clamp((t - 14.6) / 0.5)} />
          </g>
        )}

        {/* the cost */}
        {t >= 17 && t < 23.4 && (
          <g opacity={clamp((t - 17) / 0.5) * (1 - p(t, 22.8, 23.4))}>
            <line x1={160} y1={420} x2={800} y2={420} stroke={SC.muted} strokeWidth={2} />
            <line x1={160} y1={420} x2={160} y2={120} stroke={SC.muted} strokeWidth={2} />
            {(() => {
              const k = p(t, 17.4, 21);
              const pts = (f: (x: number) => number) => Array.from({ length: 30 }, (_, i) => { const x = i / 29; return `${i ? 'L' : 'M'}${160 + x * 640 * k} ${420 - f(x * k) * 280}`; }).join(' ');
              return (
                <g>
                  <path d={pts(x => 0.3 + 0.35 * Math.min(1, x * 3) - Math.max(0, x - 0.4) * 0.5)} stroke={SC.discover} strokeWidth={4} fill="none" />
                  <path d={pts(x => 0.05 + Math.max(0, x - 0.3) * 0.9)} stroke={SC.error} strokeWidth={4} fill="none" />
                  <path d={pts(x => 0.85 - Math.max(0, x - 0.2) * 0.8)} stroke={SC.mint} strokeWidth={4} strokeDasharray="8 6" fill="none" />
                </g>
              );
            })()}
            {[{ n: 'Conversions', c: SC.discover }, { n: 'Refunds & complaints', c: SC.error }, { n: 'Trust', c: SC.mint }].map((l, i) => (
              <g key={l.n} transform={`translate(${200 + i * 210} 470)`}><rect width={14} height={14} rx={3} fill={l.c} /><text x={22} y={12} fontSize={13} fontWeight={700} fill={SC.text}>{l.n}</text></g>
            ))}
          </g>
        )}

        {/* the fair version */}
        {t >= 23 && t < 29.4 && (
          <g opacity={clamp((t - 23) / 0.5)}>
            <g transform="translate(250 100)"><Checkout fair t={t} /></g>
            {['Opt-in, unticked', 'All fees up front', 'A real deadline', 'Cancel in two taps'].map((s, i) => (
              <g key={s} transform={`translate(590 ${150 + i * 56}) scale(${clamp(back((t - 23.6 - i * 0.5) / 0.4))})`}>
                <circle r={13} fill={SC.mint} /><CheckIcon x={-8} y={-8} width={16} height={16} color="#fff" weight="bold" />
                <text x={24} y={5} fontSize={15} fontWeight={800} fill={SC.text}>{s}</text>
              </g>
            ))}
          </g>
        )}
      </g>

      {fin > 0 && [{ x: 200, n: 'Name them', l: 'Shaming · sneaking · fake urgency', c: SC.discover }, { x: 480, n: 'They cost later', l: 'Refunds, churn, regulators', c: SC.design }, { x: 760, n: 'Fair by default', l: 'Opt-in, honest, easy exits', c: SC.mint }].map((f, i) => {
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
