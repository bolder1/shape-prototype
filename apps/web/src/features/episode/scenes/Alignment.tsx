'use client';
// Scene for ui.1-4: a card with ragged edges snaps to one shared edge; a centred paragraph becomes left-aligned; amounts
// that trail their labels line up on the right; a short empty state sits in the centre. Pure function of t (0–34).
import { BasketIcon } from '@phosphor-icons/react/ssr';
import { back, clamp, Grid, lerp, p, Pen, SC } from './shared';

const W = 960, H = 540;
const RAGGED = [0, 22, 9, 34];
const LINES = [300, 340, 260, 320, 180];
const ROWS = [{ l: 'Items', a: '₹1,420' }, { l: 'Delivery fee', a: '₹30' }, { l: 'Discount', a: '−₹100' }, { l: 'Total', a: '₹1,350' }];

function Card({ x, y, w, h, children }: { x: number; y: number; w: number; h: number; children: React.ReactNode }) {
  return <g><rect x={x} y={y} width={w} height={h} rx={18} fill={SC.surface} stroke={SC.line} strokeWidth={2} />{children}</g>;
}

export function AlignmentScene({ t }: { t: number }) {
  const fin = p(t, 29, 29.8);
  const act = t < 12 ? 0 : t < 18 ? 1 : t < 24 ? 2 : 3;
  const actIn = (a: number, at: number) => (act === a ? clamp((t - at) / 0.4) : 0);
  const snap = p(t, 7, 8.5), para = p(t, 14, 15.5), nums = p(t, 20, 21.5);
  const X = 300, CW = 360;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" role="img" aria-label="Animated story: aligning elements to shared edges">
      <rect width={W} height={H} fill={SC.soft} />
      <Grid />
      <g opacity={1 - fin}>
        {/* 1. ragged card snaps to one edge */}
        {act === 0 && (
          <g opacity={actIn(0, 0)}>
            <Card x={X} y={90} w={CW} h={330}>
              {[{ h: 120, w: CW - 60, c: SC.grow, o: 0.35 }, { h: 24, w: 200, c: SC.text, o: 0.85 }, { h: 14, w: 260, c: SC.muted, o: 0.5 }, { h: 40, w: 140, c: SC.discover, o: 1 }].map((e, i) => {
                const y = [120, 262, 300, 340][i], x = X + 30 + RAGGED[i] * (1 - snap);
                return <rect key={i} x={x} y={y} width={e.w} height={e.h} rx={8} fill={e.c} opacity={e.o} />;
              })}
            </Card>
            {t >= 6 && <line x1={X + 30} x2={X + 30} y1={70} y2={440} stroke={SC.mint} strokeWidth={2} strokeDasharray="6 5" opacity={clamp((t - 6) / 0.4)} />}
            {t >= 9 && <text x={X + CW + 30} y={260} fontSize={16} fontWeight={800} fill={SC.mint} opacity={clamp((t - 9) / 0.4)}>One shared edge</text>}
          </g>
        )}

        {/* 2. centred paragraph → left */}
        {act === 1 && (
          <g opacity={actIn(1, 12)}>
            <Card x={X - 40} y={130} w={CW + 80} h={240}>
              {LINES.map((w, i) => {
                const x = lerp(X - 40 + (CW + 80 - w) / 2, X - 10, para);
                return <rect key={i} x={x} y={170 + i * 36} width={w} height={14} rx={7} fill={SC.text} opacity={0.75} />;
              })}
            </Card>
            {t < 14 && LINES.map((w, i) => <circle key={i} cx={X - 40 + (CW + 80 - w) / 2 - 12} cy={177 + i * 36} r={5} fill={SC.error} opacity={clamp((t - 12.6 - i * 0.15) / 0.3)} />)}
            <text x={480} y={420} textAnchor="middle" fontSize={16} fontWeight={800} fill={para < 1 ? SC.error : SC.mint}>{para < 1 ? 'Every line starts somewhere new' : 'The eye knows where each line starts'}</text>
          </g>
        )}

        {/* 3. amounts line up on the right */}
        {act === 2 && (
          <g opacity={actIn(2, 18)}>
            <Card x={X - 20} y={120} w={CW + 40} h={260}>
              {ROWS.map((r, i) => {
                const y = 170 + i * 50, trailing = X + 10 + r.l.length * 9 + 24 + r.a.length * 9.5, right = X + CW - 10;
                return (
                  <g key={r.l}>
                    <text x={X + 10} y={y} fontSize={17} fontWeight={i === 3 ? 900 : 600} fill={SC.text}>{r.l}</text>
                    <text x={lerp(trailing, right, nums)} y={y} textAnchor="end" fontSize={17} fontWeight={i === 3 ? 900 : 700} fill={SC.text} style={{ fontVariantNumeric: 'tabular-nums' }}>{r.a}</text>
                  </g>
                );
              })}
            </Card>
            {nums >= 1 && <line x1={X + CW - 2} x2={X + CW - 2} y1={140} y2={350} stroke={SC.mint} strokeWidth={2} strokeDasharray="6 5" />}
            <text x={480} y={420} textAnchor="middle" fontSize={16} fontWeight={800} fill={nums < 1 ? SC.error : SC.mint}>{nums < 1 ? 'Hard to compare' : 'Digits line up by place value'}</text>
          </g>
        )}

        {/* 4. centre the short standalone */}
        {act === 3 && (
          <g opacity={actIn(3, 24)}>
            <Card x={X} y={110} w={CW} h={280}>
              <BasketIcon x={X + CW / 2 - 32} y={170} width={64} height={64} color={SC.muted} weight="duotone" />
              <text x={X + CW / 2} y={280} textAnchor="middle" fontSize={20} fontWeight={800} fill={SC.text}>Your basket is empty</text>
              <text x={X + CW / 2} y={310} textAnchor="middle" fontSize={14} fontWeight={600} fill={SC.muted}>Add something tasty</text>
            </Card>
            <line x1={X + CW / 2} x2={X + CW / 2} y1={90} y2={410} stroke={SC.mint} strokeWidth={2} strokeDasharray="6 5" opacity={0.7} />
            <Pen x={780} y={330} scale={0.45} mood="cheer" />
          </g>
        )}
      </g>

      {fin > 0 && [{ x: 200, n: 'Left', l: 'Text people read', c: SC.discover }, { x: 480, n: 'Right', l: 'Numbers people compare', c: SC.mint }, { x: 760, n: 'Centre', l: 'Short, standalone lines', c: SC.design }].map((f, i) => {
        const k = back((t - (29.2 + i * 0.25)) / 0.5);
        return (
          <g key={f.n} transform={`translate(${f.x} 260) scale(${clamp(k)})`}>
            <rect x={-125} y={-70} width={250} height={140} rx={18} fill={SC.surface} stroke={f.c} strokeWidth={3} />
            <text y={-8} textAnchor="middle" fontSize={22} fontWeight={800} fill={f.c}>{f.n}</text>
            <text y={26} textAnchor="middle" fontSize={14} fontWeight={600} fill={SC.text}>{f.l}</text>
          </g>
        );
      })}
    </svg>
  );
}
