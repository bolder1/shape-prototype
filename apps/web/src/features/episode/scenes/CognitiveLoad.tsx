'use client';
// Scene for fd.2-4: working memory as four slots. Twelve flat settings overflow them; three labelled groups fit;
// a phone number gets chunked; then a form sheds load. Pure function of t (seconds, 0–34).
import { BrainIcon, CheckIcon, WarningIcon } from '@phosphor-icons/react/ssr';
import { back, Grid, lerp, p, Pen, SC } from './shared';

const W = 960, H = 540;
const SLOT = (i: number) => ({ x: 640 + (i % 2) * 140, y: 170 + Math.floor(i / 2) * 120 });
const SETTINGS = ['Email', 'Password', 'Photo', 'Name', 'Ads', 'Location', 'Contacts', 'History', 'Push', 'Email digest', 'Sounds', 'Badges'];
const GROUPS = [{ name: 'Account', c: SC.discover }, { name: 'Privacy', c: SC.grow }, { name: 'Notifications', c: SC.build }];
const DIGITS = '9876543210';
const FORM = ['Full name', 'Email', 'Phone', 'Fax', 'Company size', 'PIN code', 'City', 'How did you hear about us?'];
const CUT = new Set([3, 4, 7]);   // optional fields removed; City gets pre-filled

export function CognitiveLoadScene({ t }: { t: number }) {
  const memIn = p(t, 0.4, 1.4);
  const flatIn = p(t, 5, 6), flatOut = p(t, 11.6, 12.4);
  const grouped = p(t, 12.6, 14.4), toSlots = p(t, 15.4, 17);
  const groupsOut = p(t, 19.4, 20);
  const digitsIn = p(t, 20.2, 21), chunked = p(t, 22.8, 24), digitsOut = p(t, 25.4, 26);
  const formIn = p(t, 26, 26.8);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" role="img" aria-label="Animated story: working memory, chunking and cutting load">
      <rect width={W} height={H} fill={SC.soft} />
      <Grid />

      {/* ---- working memory: four slots ---- */}
      <g opacity={memIn * (t >= 26 ? 1 - p(t, 26, 26.6) * 0.75 : 1)}>
        <BrainIcon x={680} y={58} width={40} height={40} color={SC.grow} weight="duotone" />
        <text x={730} y={78} fontSize={15} fontWeight={800} fill={SC.text}>Working memory</text>
        <text x={730} y={98} fontSize={12.5} fill={SC.muted}>about 4 chunks</text>
        {[0, 1, 2, 3].map(i => {
          const s = SLOT(i);
          return <rect key={i} x={s.x - 60} y={s.y - 46} width={120} height={92} rx={14} fill={SC.surface} stroke={SC.grow} strokeWidth={2} strokeDasharray="6 5" />;
        })}
      </g>

      {/* ---- twelve flat settings: four fit, the rest spill ---- */}
      {flatIn > 0 && flatOut < 1 && SETTINGS.map((s, i) => {
        const fly = p(t, 6.4 + i * 0.32, 7.2 + i * 0.32);
        const fits = i < 4;
        const from = { x: 120, y: 90 + i * 34 };
        const to = fits ? SLOT(i) : { x: 640 + ((i % 3) - 1) * 90, y: 560 + (i % 2) * 20 };
        const bounce = !fits && fly > 0 ? Math.sin(fly * Math.PI) * -120 : 0;
        return (
          <g key={s} opacity={flatIn * (1 - flatOut)} transform={`translate(${lerp(from.x, to.x, fly)} ${lerp(from.y, to.y, fly) + bounce})`}>
            <rect x={-52} y={-13} width={104} height={26} rx={8} fill={SC.surface} stroke={SC.line} strokeWidth={1.5} />
            <text y={5} textAnchor="middle" fontSize={11.5} fontWeight={600} fill={SC.text}>{s}</text>
          </g>
        );
      })}
      {t >= 9.4 && t < 12 && (
        <g transform={`translate(780 480) scale(${back((t - 9.4) / 0.4)})`} opacity={1 - flatOut}>
          <WarningIcon x={-110} y={-14} width={26} height={26} color={SC.error} weight="fill" />
          <text x={-78} y={6} fontSize={15} fontWeight={800} fill={SC.error}>Overflow: 8 things lost</text>
        </g>
      )}

      {/* ---- the same twelve, in three labelled groups ---- */}
      {grouped > 0 && groupsOut < 1 && GROUPS.map((g, gi) => {
        const home = { x: 170, y: 120 + gi * 140 };
        const slot = SLOT(gi);
        const x = lerp(home.x, slot.x, toSlots), y = lerp(home.y, slot.y, toSlots), s = lerp(1, 0.62, toSlots);
        return (
          <g key={g.name} opacity={grouped * (1 - groupsOut)} transform={`translate(${x} ${y}) scale(${s})`}>
            <rect x={-130} y={-56} width={260} height={112} rx={16} fill={SC.surface} stroke={g.c} strokeWidth={3} />
            <text x={-112} y={-30} fontSize={15} fontWeight={800} fill={g.c}>{g.name}</text>
            {SETTINGS.slice(gi * 4, gi * 4 + 4).map((st, i) => (
              <g key={st} transform={`translate(${-112 + (i % 2) * 118} ${-8 + Math.floor(i / 2) * 32})`}>
                <rect width={106} height={24} rx={7} fill={SC.soft} />
                <text x={53} y={16} textAnchor="middle" fontSize={11} fontWeight={600} fill={SC.text}>{st}</text>
              </g>
            ))}
          </g>
        );
      })}
      {t >= 17.2 && t < 20 && (
        <g transform={`translate(780 480) scale(${back((t - 17.2) / 0.4)})`} opacity={1 - groupsOut}>
          <CheckIcon x={-120} y={-13} width={26} height={26} color={SC.mint} weight="bold" />
          <text x={-88} y={6} fontSize={15} fontWeight={800} fill={SC.mint}>3 chunks. Room to spare.</text>
        </g>
      )}

      {/* ---- a phone number, chunked ---- */}
      {digitsIn > 0 && digitsOut < 1 && (
        <g opacity={digitsIn * (1 - digitsOut)}>
          <text x={260} y={190} textAnchor="middle" fontSize={14} fontWeight={700} fill={SC.muted}>Remember this number</text>
          {DIGITS.split('').map((d, i) => {
            const gap = chunked * (i >= 5 ? 26 : 0);
            return (
              <g key={i} transform={`translate(${82 + i * 36 + gap} 250)`}>
                <rect x={-15} y={-26} width={30} height={46} rx={7} fill={SC.surface} stroke={chunked > 0.5 ? (i < 5 ? SC.discover : SC.grow) : SC.line} strokeWidth={2} />
                <text y={8} textAnchor="middle" fontSize={22} fontWeight={800} fill={SC.text}>{d}</text>
              </g>
            );
          })}
          <text x={260} y={320} textAnchor="middle" fontSize={15} fontWeight={800} fill={chunked > 0.5 ? SC.mint : SC.error}>{chunked > 0.5 ? '2 chunks: easy' : '10 separate digits: hard'}</text>
          {/* what the slots hold */}
          {[0, 1].map(i => chunked > 0.5 && (
            <g key={i} transform={`translate(${SLOT(i).x} ${SLOT(i).y}) scale(${back((chunked - 0.5) * 2)})`}>
              <text y={8} textAnchor="middle" fontSize={22} fontWeight={800} fill={i ? SC.grow : SC.discover}>{i ? '43210' : '98765'}</text>
            </g>
          ))}
        </g>
      )}

      {/* ---- cut what you can: a form sheds fields ---- */}
      {formIn > 0 && (
        <g opacity={formIn}>
          <rect x={150} y={60} width={340} height={440} rx={18} fill={SC.surface} stroke={SC.line} strokeWidth={2} />
          <text x={176} y={94} fontSize={16} fontWeight={800} fill={SC.text}>Sign up</text>
          {(() => {
            let row = 0;
            return FORM.map((f, i) => {
              const cut = CUT.has(i) ? p(t, 27.4 + i * 0.15, 28.2 + i * 0.15) : 0;
              const y = 120 + lerp(i, row, p(t, 28.6, 29.4)) * 44;
              if (!CUT.has(i)) row++;
              const prefilled = f === 'City' && t >= 29.6;
              return (
                <g key={f} transform={`translate(${176 + cut * 60} ${y})`} opacity={1 - cut}>
                  <text y={0} fontSize={11} fontWeight={600} fill={SC.muted}>{f}</text>
                  <rect y={5} width={288} height={26} rx={7} fill={prefilled ? 'color-mix(in srgb, #2BC08A 18%, transparent)' : SC.soft} stroke={prefilled ? SC.mint : SC.line} />
                  {prefilled && <text x={10} y={23} fontSize={12} fontWeight={700} fill={SC.mint}>Bengaluru (from your PIN)</text>}
                </g>
              );
            });
          })()}
          <text x={320} y={480} textAnchor="middle" fontSize={14} fontWeight={800} fill={SC.mint} opacity={p(t, 30, 30.6)}>8 fields → 5, one filled in for you</text>
          <g transform="translate(720 280)" opacity={p(t, 30.6, 31.4)}>
            <rect x={-170} y={-60} width={340} height={120} rx={18} fill={SC.surface} stroke={SC.grow} strokeWidth={3} />
            <text y={-12} textAnchor="middle" fontSize={20} fontWeight={800} fill={SC.text}>Less to hold, less to forget</text>
            <text y={20} textAnchor="middle" fontSize={14} fill={SC.muted}>Group it · Pre-fill it · Cut it</text>
          </g>
        </g>
      )}

      {t >= 12.4 && t < 15.4 && <Pen x={330} y={110} scale={0.45} tilt={-20} mood="cheer" />}
      {t >= 27 && t < 30 && <Pen x={540} y={200} scale={0.45} tilt={-20} mood="idle" />}
    </svg>
  );
}
