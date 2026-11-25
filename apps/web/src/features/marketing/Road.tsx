'use client';
import { motion, useReducedMotion } from 'motion/react';
import { FAMILIES, SKILL_META, skillsInFamily } from '@/lib/skills';
import { STATIONS } from './copy';

/**
 * The onboarding road as a vertical timeline. The mint line is Nib's signature move (docs/07-characters.md):
 * it draws itself down the stations as you scroll, the same line that becomes your progress path in the app.
 */
export function Road() {
  const reduce = useReducedMotion();
  return (
    <ol className="relative">
      {/* Track + the line Nib draws. */}
      <span aria-hidden className="absolute top-3 bottom-3 left-[11px] w-0.5 bg-border-secondary" />
      <motion.span aria-hidden className="absolute top-3 bottom-3 left-[11px] w-0.5 origin-top bg-mint-500"
        initial={reduce ? false : { scaleY: 0 }} whileInView={{ scaleY: 1 }} viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }} />
      {STATIONS.map((s, i) => {
        const fam = FAMILIES[s.family];
        return (
          <motion.li key={s.family} className="relative grid gap-2 pb-12 pl-12 last:pb-0"
            initial={reduce ? false : { opacity: 0, x: 12 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.6 }}
            transition={{ type: 'spring', stiffness: 160, damping: 22, delay: 0.15 + i * 0.12 }}>
            <span aria-hidden className="absolute top-1 left-0 grid size-6 place-items-center rounded-full bg-primary ring-2 ring-mint-500">
              <i className="size-2.5 rounded-full" style={{ background: fam.color }} />
            </span>
            <h3 className="text-lg font-semibold text-primary">{fam.label}</h3>
            <p className="max-w-prose text-md text-tertiary">{s.scene}</p>
            <ul className="mt-1 flex flex-wrap gap-2" aria-label={`${fam.label} skills`}>
              {skillsInFamily(s.family).map(id => {
                const { icon: Icon, short } = SKILL_META[id];
                return (
                  <li key={id} className="flex items-center gap-1.5 rounded-md bg-secondary px-2 py-1 text-sm text-secondary">
                    <Icon className="size-4" weight="duotone" style={{ color: fam.color }} aria-hidden />{short}
                  </li>
                );
              })}
            </ul>
          </motion.li>
        );
      })}
    </ol>
  );
}
