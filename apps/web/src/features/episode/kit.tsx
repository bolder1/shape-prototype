'use client';
// Shared pieces for episode stages: Nib (the buddy), answer buttons, the confetti burst and the stage header.
import { useMemo } from 'react';
import { motion } from 'motion/react';
import { CheckIcon, XIcon } from '@phosphor-icons/react/ssr';
import { springs } from '@shape/ui';
import { cx } from '@/utils/cx';

export const FAMILY = ['var(--color-family-discover)', 'var(--color-family-design)', 'var(--color-family-grow)', 'var(--color-family-build)'];

export type NibMood = 'idle' | 'think' | 'cheer' | 'sad';

/**
 * Nib, drawn in SVG until the 3D/Rive model lands (docs/07-characters.md): a pen-nib body in midnight,
 * a glowing mint tip, vertical oval eyes and two floating hands. Mood lives in the eyes, tilt and tip glow.
 */
export function Nib({ mood = 'idle', size = 72, className }: { mood?: NibMood; size?: number; className?: string }) {
  const tilt = { idle: 0, think: -10, cheer: 8, sad: -4 }[mood];
  const eyeH = { idle: 9, think: 7, cheer: 4, sad: 6 }[mood];
  const glow = { idle: 0.55, think: 0.4, cheer: 1, sad: 0.2 }[mood];
  return (
    <motion.svg viewBox="0 0 80 96" width={size} height={size * 1.2} className={cx('overflow-visible', className)} aria-hidden
      animate={{ y: mood === 'cheer' ? [0, -10, 0] : [0, -4, 0], rotate: tilt }} transition={{ y: { duration: mood === 'cheer' ? 0.6 : 2.4, repeat: Infinity, ease: 'easeInOut' }, rotate: springs.pop }}>
      <defs>
        <radialGradient id="nib-glow"><stop offset="0" stopColor="#2BC08A" stopOpacity={0.9} /><stop offset="1" stopColor="#2BC08A" stopOpacity={0} /></radialGradient>
      </defs>
      <circle cx={40} cy={86} r={16 + glow * 8} fill="url(#nib-glow)" opacity={glow} />
      {/* body: a rounded pen nib, slit down the middle */}
      <path d="M40 4 C60 4 70 18 70 34 C70 52 52 70 40 84 C28 70 10 52 10 34 C10 18 20 4 40 4 Z" fill="#1E2A4A" stroke="#fff" strokeOpacity={0.18} strokeWidth={1.5} />
      <path d="M40 56 L40 84" stroke="#2BC08A" strokeWidth={2.5} strokeLinecap="round" opacity={0.6 + glow * 0.4} />
      <circle cx={40} cy={84} r={4.5} fill="#2BC08A" />
      <circle cx={40} cy={50} r={3} fill="#0F1730" />
      {/* eyes */}
      {[29, 51].map(x => (
        <motion.ellipse key={x} cx={x} cy={mood === 'sad' ? 32 : 30} rx={4.2} animate={{ ry: eyeH / 2 }} fill="#fff" transition={springs.pop} />
      ))}
      {mood === 'cheer' && [29, 51].map(x => <path key={x} d={`M${x - 5} 31 Q${x} 25 ${x + 5} 31`} stroke="#1E2A4A" strokeWidth={2.5} fill="none" />)}
      {/* hands */}
      <motion.circle r={5} fill="#1E2A4A" stroke="#fff" strokeOpacity={0.25} strokeWidth={1.5} animate={{ cx: mood === 'cheer' ? 0 : 2, cy: mood === 'cheer' ? 14 : 46 }} transition={springs.pop} />
      <motion.circle r={5} fill="#1E2A4A" stroke="#fff" strokeOpacity={0.25} strokeWidth={1.5} animate={{ cx: mood === 'cheer' ? 80 : mood === 'think' ? 62 : 78, cy: mood === 'cheer' ? 14 : mood === 'think' ? 50 : 46 }} transition={springs.pop} />
    </motion.svg>
  );
}

/** A speech bubble next to Nib. */
export function NibSays({ mood, children, className }: { mood?: NibMood; children: React.ReactNode; className?: string }) {
  return (
    <div className={cx('flex items-end gap-3', className)}>
      <Nib mood={mood} size={48} className="shrink-0" />
      <motion.p key={String(children)} initial={{ opacity: 0, y: 6, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={springs.pop}
        className="relative rounded-2xl rounded-bl-sm bg-secondary px-4 py-2.5 text-md text-primary ring-1 ring-secondary ring-inset">{children}</motion.p>
    </div>
  );
}

export type ChoiceState = 'idle' | 'selected' | 'correct' | 'wrong' | 'dim' | 'hidden';

/** A big tappable answer. Letters A–D, springy press, and a clear right/wrong state with icon + colour. */
export function Choice({ index, label, state, onPress, disabled, tone = 'default' }: {
  index: number; label: string; state: ChoiceState; onPress: () => void; disabled?: boolean; tone?: 'default' | 'stage';
}) {
  if (state === 'hidden') return <div className="h-[60px] rounded-2xl border-2 border-dashed border-secondary opacity-40" aria-hidden />;
  return (
    <motion.button type="button" onClick={onPress} disabled={disabled} whileTap={disabled ? undefined : { scale: 0.97 }} whileHover={disabled ? undefined : { y: -2 }}
      animate={state === 'wrong' ? { x: [0, -8, 8, -5, 5, 0] } : state === 'correct' ? { scale: [1, 1.04, 1] } : {}} transition={{ duration: 0.4 }}
      className={cx('flex min-h-[60px] w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-md font-semibold ring-2 transition-colors ring-inset disabled:cursor-default',
        state === 'idle' && (tone === 'stage' ? 'bg-white/5 text-white ring-white/15 hover:bg-white/10' : 'bg-primary text-primary ring-secondary hover:bg-primary_hover'),
        state === 'selected' && (tone === 'stage' ? 'bg-white/20 text-white ring-white' : 'bg-brand-primary text-primary ring-brand-solid'),
        state === 'correct' && 'bg-mint-600 text-white ring-mint-600',
        state === 'wrong' && 'bg-error-solid text-white ring-error-solid',
        state === 'dim' && (tone === 'stage' ? 'bg-white/5 text-white/40 ring-white/10' : 'bg-primary text-quaternary ring-secondary'))}>
      <span className={cx('grid size-8 shrink-0 place-items-center rounded-lg text-sm font-bold',
        state === 'correct' || state === 'wrong' ? 'bg-white/20' : tone === 'stage' ? 'bg-white/10' : 'bg-secondary text-tertiary')}>
        {state === 'correct' ? <CheckIcon className="size-4" weight="bold" /> : state === 'wrong' ? <XIcon className="size-4" weight="bold" /> : String.fromCharCode(65 + index)}
      </span>
      <span className="flex-1">{label}</span>
    </motion.button>
  );
}

/** Choice state for a question once the learner has picked (or not). */
export function choiceState(id: string, picked: string | null, correct: string, revealed: boolean): ChoiceState {
  if (!revealed) return picked === id ? 'selected' : 'idle';
  if (id === correct) return 'correct';
  if (id === picked) return 'wrong';
  return 'dim';
}

/** Confetti in the four family colours, bursting from the centre of its parent. */
export function Burst({ count = 28, seed = 1 }: { count?: number; seed?: number }) {
  const bits = useMemo(() => Array.from({ length: count }, (_, i) => {
    const a = ((i * 137.5 + seed * 31) % 360) * (Math.PI / 180), d = 90 + ((i * 53 + seed * 17) % 120);
    return { x: Math.cos(a) * d, y: Math.sin(a) * d - 40, r: (i * 47) % 360, c: FAMILY[i % 4], w: 6 + (i % 3) * 3 };
  }), [count, seed]);
  return (
    <div className="pointer-events-none absolute inset-0 grid place-items-center" aria-hidden>
      {bits.map((b, i) => (
        <motion.span key={i} className="absolute rounded-sm" style={{ width: b.w, height: b.w * 0.5, background: b.c }}
          initial={{ x: 0, y: 0, opacity: 1, rotate: 0, scale: 0.4 }}
          animate={{ x: b.x, y: [0, b.y, b.y + 120], opacity: [1, 1, 0], rotate: b.r * 3, scale: 1 }}
          transition={{ duration: 1.4, ease: 'easeOut', times: [0, 0.5, 1] }} />
      ))}
    </div>
  );
}

/** Big stage heading with an eyebrow (the stage name). */
export function StageTitle({ eyebrow, title, children }: { eyebrow: string; title: string; children?: React.ReactNode }) {
  return (
    <motion.header initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={springs.gentle} className="flex flex-col gap-1.5">
      <p className="text-sm font-semibold tracking-wide text-brand-secondary uppercase">{eyebrow}</p>
      <h1 className="text-display-xs font-semibold text-primary md:text-display-sm">{title}</h1>
      {children && <p className="text-lg text-tertiary">{children}</p>}
    </motion.header>
  );
}
