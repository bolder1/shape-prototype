'use client';
// Takeaways: the lesson in three cards that flip in one by one.
import { useState } from 'react';
import { motion } from 'motion/react';
import { springs } from '@shape/ui';
import { Button } from '@/components/base/buttons/button';
import { FAMILY, NibSays, StageTitle } from '../kit';

export function Takeaways({ items, onDone }: { items: { title: string; body: string }[]; onDone: () => void }) {
  const [shown, setShown] = useState(1);
  const all = shown >= items.length;
  return (
    <div className="flex flex-col gap-6">
      <StageTitle eyebrow="Takeaways" title={`${items.length} things to keep`} />
      <div className="grid gap-4 sm:grid-cols-3" style={{ perspective: 900 }}>
        {items.map((it, i) => (
          <motion.button key={it.title} type="button" onClick={() => setShown(s => Math.max(s, i + 1))} disabled={i !== shown}
            initial={false} animate={{ rotateY: i < shown ? 0 : 180 }} transition={{ ...springs.gentle, delay: i < shown ? 0.05 : 0 }}
            style={{ transformStyle: 'preserve-3d' }} aria-label={i < shown ? `${it.title}. ${it.body}` : 'Hidden takeaway'}
            className="relative h-48 text-left disabled:cursor-default">
            {/* front */}
            <span className="absolute inset-0 flex flex-col gap-2 overflow-hidden rounded-2xl bg-primary p-5 shadow-md ring-1 ring-secondary ring-inset" style={{ backfaceVisibility: 'hidden' }}>
              <span className="absolute inset-x-0 top-0 h-1.5" style={{ background: FAMILY[i % 4] }} />
              <span className="text-display-xs font-bold tabular-nums" style={{ color: FAMILY[i % 4] }}>{i + 1}</span>
              <span className="text-lg font-semibold text-primary">{it.title}</span>
              <span className="text-sm text-tertiary">{it.body}</span>
            </span>
            {/* back */}
            <span className="absolute inset-0 grid place-items-center rounded-2xl bg-brand-solid text-display-sm font-bold text-white/30" style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>?</span>
          </motion.button>
        ))}
      </div>
      <NibSays mood={all ? 'cheer' : 'idle'}>{all ? 'That’s the whole lesson. Time to prove it, fast.' : 'Tap the next card to flip it.'}</NibSays>
      <div className="flex justify-end">
        {all ? <Button size="xl" onPress={onDone}>Start the rapid quiz</Button> : <Button size="xl" color="secondary" onPress={() => setShown(s => s + 1)}>Flip next</Button>}
      </div>
    </div>
  );
}
