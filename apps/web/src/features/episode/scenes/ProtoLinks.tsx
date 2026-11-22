'use client';
// Scene for pr.1-3: two static frames on a Figma-like canvas; the product card becomes a hotspot; a connection is dragged
// to the product page; the interaction panel shows trigger, action and animation; Filters opens an overlay; then play
// mode taps through it. Pure function of t (0–34).
import { CursorIcon, PlayIcon } from '@phosphor-icons/react/ssr';
import { back, clamp, Grid, lerp, p, SC } from './shared';

const W = 960, H = 540;
const BLUE = '#2563eb';

/** A phone frame at (x, y), 180 × 320, showing the list or the product page. */
function Frame({ x, y, kind, label }: { x: number; y: number; kind: 'list' | 'product'; label?: string }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      {label && <text x={0} y={-10} fontSize={12} fontWeight={700} fill={SC.muted}>{label}</text>}
      <rect width={180} height={320} rx={18} fill="#ffffff" stroke={SC.line} strokeWidth={2} />
      {kind === 'list' ? (
        <g>
          <text x={16} y={32} fontSize={14} fontWeight={800} fill="#111827">Kurtas</text>
          <rect x={112} y={18} width={52} height={22} rx={11} fill="#eff6ff" /><text x={138} y={33} textAnchor="middle" fontSize={10} fontWeight={800} fill={BLUE}>Filters</text>
          {[0, 1, 2].map(r => (
            <g key={r}>
              <rect x={16} y={54 + r * 86} width={148} height={74} rx={10} fill="#f3f4f6" />
              <rect x={24} y={62 + r * 86} width={46} height={58} rx={6} fill={['#f59e0b', '#8b5cf6', '#10b981'][r]} opacity={0.7} />
              <text x={78} y={84 + r * 86} fontSize={11} fontWeight={800} fill="#111827">{['Cotton kurta', 'Silk kurta', 'Linen kurta'][r]}</text>
              <text x={78} y={102 + r * 86} fontSize={10} fill="#4b5563">{['₹899', '₹1,499', '₹1,199'][r]}</text>
            </g>
          ))}
        </g>
      ) : (
        <g>
          <text x={16} y={32} fontSize={14} fontWeight={800} fill="#111827">← Cotton kurta</text>
          <rect x={16} y={48} width={148} height={150} rx={12} fill="#f59e0b" opacity={0.7} />
          <text x={16} y={224} fontSize={16} fontWeight={800} fill="#111827">₹899</text>
          <text x={16} y={246} fontSize={10} fill="#4b5563">Soft cotton, 3 colours</text>
          <rect x={16} y={264} width={148} height={38} rx={10} fill={BLUE} /><text x={90} y={288} textAnchor="middle" fontSize={12} fontWeight={800} fill="#fff">Add to bag</text>
        </g>
      )}
    </g>
  );
}

export function ProtoLinksScene({ t }: { t: number }) {
  const fin = p(t, 29, 29.8);
  const canvas = t < 25;
  const noodle = p(t, 10.4, 12);
  const sheet = p(t, 20.6, 21.6);
  const LX = 170, RX = 560, FY = 130;
  // noodle: from the first product card (left frame) to the product page frame
  const sx = LX + 164, sy = FY + 91, ex = RX, ey = FY + 160;
  const nx = lerp(sx, ex, noodle), ny = lerp(sy, ey, noodle);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" role="img" aria-label="Animated story: linking two frames in a Figma prototype with a trigger, an action and an animation">
      <rect width={W} height={H} fill={SC.soft} />
      <Grid />
      <defs><marker id="pl-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 L10 5 L0 10 Z" fill={BLUE} /></marker></defs>
      <g opacity={1 - fin}>
        {canvas && (
          <g opacity={1 - p(t, 24.4, 25)}>
            <Frame x={LX} y={FY} kind="list" label="Product list" />
            <Frame x={RX} y={FY} kind="product" label="Product page" />
            {/* the hotspot */}
            {t >= 5 && <rect x={LX + 14} y={FY + 52} width={152} height={78} rx={11} fill="none" stroke={BLUE} strokeWidth={3} opacity={clamp((t - 5) / 0.4)} />}
            {t >= 5.4 && t < 10.4 && <text x={LX + 90} y={FY + 352} textAnchor="middle" fontSize={15} fontWeight={800} fill={SC.discover}>Hotspot: the product card</text>}
            {/* the connection */}
            {t >= 10.4 && (
              <g>
                <path d={`M${sx} ${sy} C ${sx + 80} ${sy}, ${nx - 80} ${ny}, ${nx} ${ny}`} stroke={BLUE} strokeWidth={3} fill="none" markerEnd={noodle >= 1 ? 'url(#pl-arrow)' : undefined} />
                <circle cx={sx} cy={sy} r={6} fill={BLUE} />
                {noodle < 1 && <CursorIcon x={nx - 4} y={ny - 2} width={26} height={26} color={SC.text} weight="fill" />}
              </g>
            )}
            {/* the interaction panel */}
            {t >= 15 && t < 20.6 && (
              <g transform={`translate(760 150) scale(${clamp(back((t - 15) / 0.5))})`}>
                <rect width={180} height={200} rx={14} fill={SC.surface} stroke={SC.line} strokeWidth={2} />
                <text x={16} y={28} fontSize={13} fontWeight={800} fill={SC.text}>Interaction</text>
                {[{ k: 'Trigger', v: 'On tap' }, { k: 'Action', v: 'Navigate to' }, { k: 'Animation', v: 'Smart animate' }, { k: 'Duration', v: '300 ms' }].map((r, i) => (
                  <g key={r.k} opacity={clamp((t - 15.4 - i * 0.6) / 0.4)}>
                    <text x={16} y={58 + i * 36} fontSize={11} fontWeight={700} fill={SC.muted}>{r.k}</text>
                    <rect x={16} y={64 + i * 36} width={148} height={20} rx={6} fill={SC.soft} />
                    <text x={24} y={78 + i * 36} fontSize={11} fontWeight={800} fill={SC.text}>{r.v}</text>
                  </g>
                ))}
              </g>
            )}
            {/* overlay */}
            {t >= 20 && (
              <g opacity={clamp((t - 20) / 0.4)}>
                <rect x={LX + 110} y={FY + 16} width={56} height={26} rx={13} fill="none" stroke={BLUE} strokeWidth={3} />
                <clipPath id="pl-clip"><rect x={LX} y={FY} width={180} height={320} rx={18} /></clipPath>
                <g clipPath="url(#pl-clip)">
                  <rect x={LX} y={FY} width={180} height={320} fill="#000" opacity={0.35 * sheet} />
                  <g transform={`translate(0 ${(1 - sheet) * 200})`}>
                    <rect x={LX} y={FY + 170} width={180} height={160} rx={16} fill="#ffffff" />
                    <text x={LX + 16} y={FY + 198} fontSize={13} fontWeight={800} fill="#111827">Filters</text>
                    {['Cotton', 'Under ₹1,000', 'Size M'].map((f, i) => <g key={f}><rect x={LX + 16} y={FY + 212 + i * 30} width={14} height={14} rx={3} fill={i < 2 ? BLUE : '#e5e7eb'} /><text x={LX + 38} y={FY + 224 + i * 30} fontSize={11} fill="#111827">{f}</text></g>)}
                  </g>
                </g>
                <text x={LX + 90} y={FY + 352} textAnchor="middle" fontSize={15} fontWeight={800} fill={SC.discover} opacity={sheet}>Open overlay: on top, not instead</text>
              </g>
            )}
          </g>
        )}

        {/* play mode */}
        {t >= 24.6 && t < 29.4 && (() => {
          const go = p(t, 26.4, 27.1);
          return (
            <g opacity={clamp((t - 24.6) / 0.4)}>
              <g transform="translate(480 80)"><rect x={-60} y={-18} width={120} height={36} rx={18} fill={SC.discover} /><PlayIcon x={-46} y={-9} width={18} height={18} color="#fff" weight="fill" /><text x={8} y={6} textAnchor="middle" fontSize={14} fontWeight={800} fill="#fff">Present</text></g>
              <clipPath id="pl-play"><rect x={390} y={120} width={180} height={320} rx={18} /></clipPath>
              <g clipPath="url(#pl-play)">
                <g transform={`translate(${-go * 180} 0)`}><Frame x={390} y={120} kind="list" /></g>
                <g transform={`translate(${(1 - go) * 180} 0)`}><Frame x={390} y={120} kind="product" /></g>
              </g>
              {t < 26.6 && <CursorIcon x={lerp(640, 470, p(t, 25, 26))} y={lerp(420, 210, p(t, 25, 26))} width={28} height={28} color={SC.text} weight="fill" />}
              {t >= 26 && t < 26.6 && <circle cx={478} cy={218} r={16} fill={BLUE} opacity={0.3} />}
            </g>
          );
        })()}
      </g>

      {fin > 0 && [{ x: 200, n: 'Hotspot → frame', l: 'Connections link them', c: SC.discover }, { x: 480, n: 'Trigger · action', l: '· and animation', c: SC.design }, { x: 760, n: 'Overlays', l: 'Sheets and dialogs on top', c: SC.mint }].map((f, i) => {
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
