'use client';
// Scene for st.4-3: Munim's three products have each built their own sign-in, invoice and payment link, and Ganpat
// signs in twice. Aarti calls every capability (`MUNIM_CAPABILITIES`, `platformCall`): the shared platform for what
// three products need once it has settled (`RULE_OF_THREE`), harvest later for what is still changing, the product for
// what one product needs, and buy for commodities. Then the platform becomes a product for teams, measured by
// adoption. Pure function of t (0–36). Also exports `LAYER_FILL` and `CAP_SHORT`, which `layer-pick` uses.
import { MUNIM_CAPABILITIES, MUNIM_PRODUCTS, MUNIM_PRODUCT_LABEL, RULE_OF_THREE, platformCall, type MunimCapability, type MunimProduct, type PlatformCall } from '@shape/content';
import { back, clamp, Grid, lerp, p, SC } from './shared';

const W = 640, H = 360;
/** One fill per call; white text on each passes 4.5:1. */
export const LAYER_FILL: Record<PlatformCall, string> = { platform: '#067647', harvest: '#175CD3', product: '#6941C6', buy: '#344054' };
/** Names short enough for a chip in a product column. */
export const CAP_SHORT: Record<MunimCapability, string> = {
  signIn: 'Sign-in', gstInvoice: 'GST invoice', fields: 'Form fields', payLink: 'Pay link', alerts: 'Alerts', firstRun: 'First run',
  barcode: 'Barcodes', forecast: 'Forecast', reorder: 'Reorders', otp: 'OTP SMS', maps: 'Maps', helpChat: 'Help chat',
};

const KEYS = Object.keys(MUNIM_CAPABILITIES) as MunimCapability[];
const of = (c: PlatformCall) => KEYS.filter(k => platformCall(MUNIM_CAPABILITIES[k]) === c);
const COL_X = (i: number) => 32 + i * 196;
const COL_W = 184;
/** What each product built for itself before the platform. */
const DUPES: Record<MunimProduct, MunimCapability[]> = { books: ['signIn', 'gstInvoice', 'payLink'], pay: ['signIn', 'gstInvoice', 'payLink'], stock: ['signIn', 'gstInvoice'] };

function Chip({ x, y, w = COL_W - 16, label, fill, dashed = false, o = 1 }: { x: number; y: number; w?: number; label: string; fill: string; dashed?: boolean; o?: number }) {
  return (
    <g opacity={o}>
      <rect x={x} y={y} width={w} height={32} rx={16} fill={dashed ? SC.surface : fill} stroke={fill} strokeWidth={dashed ? 2.5 : 0} strokeDasharray={dashed ? '6 5' : undefined} />
      <text x={x + w / 2} y={y + 23} fontSize={21} fontWeight={800} fill={dashed ? SC.text : '#fff'} textAnchor="middle">{label}</text>
    </g>
  );
}

export function PlatformLayersScene({ t }: { t: number }) {
  const intro = clamp(back(t / 0.6));
  const title = t < 6 ? 'Three of everything' : t < 11 ? 'The cost of copies' : t < 16 ? 'The rule of three' : t < 21 ? 'Not yet' : t < 26 ? 'Keep it, or buy it' : t < 31 ? 'A product for teams' : 'Measure adoption';
  const cols = t < 6 || (t >= 11 && t < 26);
  const platform = of('platform'), harvest = of('harvest'), product = of('product'), buy = of('buy');

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" role="img" aria-label={`Animated story: Munim Books, Pay and Stock have each built their own sign-in and GST invoice, and Books and Pay each have a payment link, so Ganpat signs in twice and gets two invoices for one sale. Copies mean three sets of bugs and three GST updates. By the rule of ${RULE_OF_THREE}, what all three products need and has settled moves into a shared platform: ${platform.map(k => CAP_SHORT[k].toLowerCase()).join(', ')}. What is shared but still changing is harvested later: ${harvest.map(k => CAP_SHORT[k].toLowerCase()).join(', ')}. What one product needs stays there: ${product.map(k => CAP_SHORT[k].toLowerCase()).join(', ')}. Commodities are bought: ${buy.map(k => CAP_SHORT[k].toLowerCase()).join(', ')}. The platform gets an owner, a roadmap and a support channel, with the product teams as its customers. New screens built on the platform rise and a common flow ships in a week instead of three. Ganpat signs in once.`}>
      <rect width={W} height={H} fill={SC.soft} />
      <Grid w={W} h={H} />
      <g opacity={intro}>
        <text x={32} y={44} fontSize={26} fontWeight={900} fill={SC.text}>{title}</text>

        {cols && MUNIM_PRODUCTS.map((pr, i) => (
          <g key={pr}>
            <rect x={COL_X(i)} y={64} width={COL_W} height={186} rx={12} fill={SC.surface} stroke={SC.line} strokeWidth={2} />
            <text x={COL_X(i) + COL_W / 2} y={90} fontSize={21} fontWeight={900} fill={SC.text} textAnchor="middle">{MUNIM_PRODUCT_LABEL[pr]}</text>
          </g>
        ))}

        {t < 6 && (
          <g>
            {MUNIM_PRODUCTS.map((pr, i) => DUPES[pr].map((k, j) => (
              <Chip key={`${pr}-${k}`} x={COL_X(i) + 8} y={102 + j * 36} label={CAP_SHORT[k]} fill={LAYER_FILL.buy} o={p(t, 0.6 + (i * 3 + j) * 0.25, 1.1 + (i * 3 + j) * 0.25)} />
            )))}
            <text x={32} y={330} fontSize={21} fontWeight={800} fill={SC.error} opacity={p(t, 3.6, 4.2)}>Ganpat: two passwords, two invoices, one sale</text>
          </g>
        )}

        {t >= 6 && t < 11 && (
          <g>
            {([['3×', 'the bugs to fix'], ['3', 'GST updates when the rules change'], ['1', 'customer who feels he uses three companies']] as const).map(([n, s], i) => (
              <g key={s} opacity={p(t, 6.3 + i * 1, 6.9 + i * 1)}>
                <rect x={32} y={70 + i * 84} width={576} height={70} rx={12} fill={SC.surface} stroke={SC.line} strokeWidth={2} />
                <text x={60} y={116 + i * 84} fontSize={36} fontWeight={900} fill={SC.error}>{n}</text>
                <text x={136} y={113 + i * 84} fontSize={21} fontWeight={800} fill={SC.text}>{s}</text>
              </g>
            ))}
          </g>
        )}

        {t >= 11 && t < 26 && (() => {
          const drop = p(t, 11.6, 13.2);
          const inCol = (pr: MunimProduct) => [
            ...(t >= 16 ? harvest.filter(k => (MUNIM_CAPABILITIES[k].products as readonly MunimProduct[]).includes(pr) && !(k === 'payLink' && pr === 'books')) : []),
            ...(t >= 21 ? product.filter(k => MUNIM_CAPABILITIES[k].products[0] === pr) : []),
          ];
          return (
            <g>
              <rect x={32} y={260} width={576} height={48} rx={12} fill={SC.surface} stroke={LAYER_FILL.platform} strokeWidth={2.5} />
              {platform.map((k, j) => (
                <Chip key={k} x={lerp(COL_X(j) + 8, 44 + j * 188, drop)} y={lerp(102, 268, drop)} w={lerp(COL_W - 16, 176, drop)} label={CAP_SHORT[k]} fill={LAYER_FILL.platform} />
              ))}
              {MUNIM_PRODUCTS.map((pr, i) => inCol(pr).map((k, j) => {
                const c = platformCall(MUNIM_CAPABILITIES[k]);
                const start = c === 'harvest' ? 16.3 : 21.3;
                return <Chip key={`${pr}-${k}`} x={COL_X(i) + 8} y={102 + j * 36} label={CAP_SHORT[k]} fill={LAYER_FILL[c]} dashed={c === 'harvest'} o={p(t, start + j * 0.4, start + 0.5 + j * 0.4)} />;
              }))}
              {t < 16 && <text x={32} y={342} fontSize={21} fontWeight={800} fill={LAYER_FILL.platform} opacity={p(t, 13.2, 13.8)}>Shared platform: built once, for all three</text>}
              {t >= 16 && t < 21 && <text x={32} y={342} fontSize={21} fontWeight={800} fill={LAYER_FILL.harvest} opacity={p(t, 17.4, 18)}>Dashed: harvest later. Books reuses Pay’s link.</text>}
              {t >= 21 && (
                <g>
                  <text x={32} y={342} fontSize={21} fontWeight={800} fill={SC.text} opacity={p(t, 22.6, 23)}>Bought:</text>
                  {buy.map((k, j) => <Chip key={k} x={128 + j * 162} y={318} w={150} label={CAP_SHORT[k]} fill={LAYER_FILL.buy} o={p(t, 22.8 + j * 0.4, 23.3 + j * 0.4)} />)}
                </g>
              )}
            </g>
          );
        })()}

        {t >= 26 && t < 31 && (
          <g>
            {MUNIM_PRODUCTS.map((pr, i) => (
              <g key={pr} opacity={p(t, 26.2 + i * 0.3, 26.7 + i * 0.3)}>
                <rect x={COL_X(i)} y={70} width={COL_W} height={56} rx={12} fill={LAYER_FILL.product} />
                <text x={COL_X(i) + COL_W / 2} y={106} fontSize={21} fontWeight={900} fill="#fff" textAnchor="middle">{MUNIM_PRODUCT_LABEL[pr]} team</text>
                <line x1={COL_X(i) + COL_W / 2} y1={190} x2={COL_X(i) + COL_W / 2} y2={136} stroke={SC.text} strokeWidth={3} markerEnd="url(#pl-arrow)" />
              </g>
            ))}
            <defs><marker id="pl-arrow" viewBox="0 0 10 10" refX={5} refY={5} markerWidth={6} markerHeight={6} orient="auto"><path d="M0 0 L10 5 L0 10 Z" fill={SC.text} /></marker></defs>
            <g opacity={p(t, 27.4, 28)}>
              <rect x={32} y={196} width={576} height={64} rx={12} fill={LAYER_FILL.platform} />
              <text x={320} y={236} fontSize={21} fontWeight={900} fill="#fff" textAnchor="middle">Platform team: owner, roadmap, support</text>
            </g>
            <text x={32} y={306} fontSize={21} fontWeight={800} fill={SC.text} opacity={p(t, 28.6, 29.2)}>Its customers are the product teams.</text>
          </g>
        )}

        {t >= 31 && (
          <g>
            {([['New screens built on the platform', `${Math.round(lerp(12, 78, p(t, 31.6, 33.6)))}%`], ['Time to ship a common flow', `${Math.round(lerp(21, 7, p(t, 31.8, 33.8)))} days`]] as const).map(([a, b], i) => (
              <g key={a} opacity={p(t, 31.2 + i * 0.4, 31.7 + i * 0.4)}>
                <rect x={32} y={68 + i * 74} width={576} height={60} rx={12} fill={SC.surface} stroke={SC.line} strokeWidth={2} />
                <text x={52} y={105 + i * 74} fontSize={21} fontWeight={800} fill={SC.text}>{a}</text>
                <text x={588} y={105 + i * 74} fontSize={24} fontWeight={900} fill={LAYER_FILL.platform} textAnchor="end">{b}</text>
              </g>
            ))}
            <g opacity={p(t, 34, 34.6)}>
              <rect x={32} y={236} width={290} height={52} rx={26} fill={LAYER_FILL.platform} />
              <text x={177} y={270} fontSize={21} fontWeight={900} fill="#fff" textAnchor="middle">Ganpat signs in once</text>
            </g>
          </g>
        )}
      </g>
    </svg>
  );
}
