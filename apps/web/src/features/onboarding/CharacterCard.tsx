'use client';
import { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowsClockwiseIcon, SparkleIcon } from '@phosphor-icons/react/ssr';
import type { PathResult } from '@shape/engine';
import { FAMILIES, SKILL_META } from '@/lib/skills';
import { cx } from '@/utils/cx';

function Face({ title, subtitle, level, levels, future, name }: {
  title: string; subtitle: string; level: number; levels: { id: keyof typeof SKILL_META; v: number }[]; future?: boolean; name: string;
}) {
  return (
    <div className={cx('absolute inset-0 flex flex-col rounded-2xl p-5 [backface-visibility:hidden]',
      future ? 'bg-brand-solid text-white [transform:rotateY(180deg)]' : 'bg-primary ring-1 ring-secondary ring-inset')}>
      <div className="flex items-center justify-between">
        <span className={cx('rounded-full px-2.5 py-0.5 text-xs font-semibold', future ? 'bg-mint-500 text-brand-950' : 'bg-secondary text-secondary')}>
          {future ? 'Future you' : 'Today'}
        </span>
        <span className={cx('text-sm font-semibold tabular-nums', future ? 'text-white' : 'text-primary')}>Level {level}</span>
      </div>
      <div className="mt-4">
        <p className={cx('text-xl font-semibold', future ? 'text-white' : 'text-primary')}>{name || 'You'}</p>
        <p className={cx('text-sm', future ? 'text-brand-200' : 'text-tertiary')}>{title}</p>
        <p className={cx('mt-1 text-xs', future ? 'text-brand-300' : 'text-quaternary')}>{subtitle}</p>
      </div>
      <ul className="mt-auto flex flex-col gap-2">
        {levels.map(({ id, v }) => { const m = SKILL_META[id]; return (
          <li key={id} className="grid grid-cols-[18px_1fr_70px_16px] items-center gap-2 text-xs">
            <m.icon className="size-4" style={{ color: future ? '#fff' : FAMILIES[m.family].color }} weight="duotone" />
            <span className={future ? 'text-brand-100' : 'text-secondary'}>{m.short}</span>
            <span className={cx('h-1.5 overflow-hidden rounded-full', future ? 'bg-white/15' : 'bg-secondary')}>
              <span className={cx('block h-full rounded-full', future ? 'bg-mint-500' : 'bg-brand-solid')} style={{ width: `${(v / 5) * 100}%` }} />
            </span>
            <span className={cx('text-right tabular-nums', future ? 'text-white' : 'text-primary')}>{v}</span>
          </li>
        ); })}
      </ul>
    </div>
  );
}

/** Two-sided card: who you are today, flip to who you could be. Shareable later as an image (@vercel/og). */
export function CharacterCard({ result, persona, future, name, weeks }: { result: PathResult; persona: string; future: string; name: string; weeks: number }) {
  const [flipped, setFlipped] = useState(false);
  const top = (key: 'current' | 'target') => [...result.tshape.columns].sort((a, b) => b[key] - a[key]).slice(0, 5).map(c => ({ id: c.domain, v: c[key] }));
  const lvl = (key: 'current' | 'target') => result.tshape.columns.reduce((s, c) => s + c[key], 0);
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="h-[22rem] w-full max-w-[18rem] [perspective:1200px]">
        <motion.div className="relative size-full [transform-style:preserve-3d]" animate={{ rotateY: flipped ? 180 : 0 }}
          transition={{ type: 'spring', stiffness: 120, damping: 18 }}>
          <Face title={persona} subtitle="Based on your answers and quick check" level={lvl('current')} levels={top('current')} name={name} />
          <Face future title={future} subtitle={`In about ${weeks} weeks on your path`} level={lvl('target')} levels={top('target')} name={name} />
        </motion.div>
      </div>
      <button onClick={() => setFlipped(f => !f)} className="inline-flex items-center gap-2 text-sm font-semibold text-brand-secondary hover:text-brand-secondary_hover">
        {flipped ? <ArrowsClockwiseIcon className="size-4" weight="bold" /> : <SparkleIcon className="size-4" weight="fill" />}
        {flipped ? 'Back to today' : 'Reveal future you'}
      </button>
    </div>
  );
}
