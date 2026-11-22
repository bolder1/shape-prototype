'use client';
import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { PaperPlaneRightIcon, SparkleIcon, XIcon } from '@phosphor-icons/react/ssr';
import { domainById } from '@shape/engine';
import { FAMILIES, SKILL_META } from '@/lib/skills';
import { SKILL_COPY } from './content';
import type { OnboardingContext, Scene } from './machine';
import { JOURNEY } from './profile';

/** What the buddy explains for each scene: why we ask, in plain words. */
function contextHelp(scene: Scene, ctx: OnboardingContext): { title: string; body: string } {
  if (scene === 'journey') {
    const id = JOURNEY[ctx.skillIndex];
    return { title: domainById[id].name, body: `${SKILL_COPY[id].what} ${SKILL_COPY[id].example} Answer honestly: your path skips what you already know, so overrating only skips lessons you need.` };
  }
  const help: Partial<Record<Scene, { title: string; body: string }>> = {
    arrival: { title: 'Hi, I’m your buddy', body: 'I’ll walk the road with you. Ask me anything along the way. After onboarding I become your coach in lessons.' },
    dream: { title: 'Why the dream matters', body: 'Your goal decides which skills go deep and which stay broad. Not sure? “Not sure yet” is a great answer.' },
    today: { title: 'Why we ask about today', body: 'Your current craft is a strength. If you come from motion, code or marketing, that becomes your home base and we build around it.' },
    check: { title: 'About the quick check', body: 'Three questions on your strongest skills. A wrong answer only adjusts where your path starts, nothing else.' },
    profile: { title: 'Reading your profile', body: 'Dark dots are where you are today. Mint rings are where your path takes you. Hover a row for details.' },
    road: { title: 'Your roadmap', body: 'Four milestones. Starting from zero adds the basics back in if you want a full refresher.' },
  };
  return help[scene] ?? { title: 'Your buddy', body: 'Ask me anything about design or this step.' };
}

export function Buddy({ scene, ctx }: { scene: Scene; ctx: OnboardingContext }) {
  const [open, setOpen] = useState(false);
  const [bubble, setBubble] = useState<string | null>(null);
  const [chat, setChat] = useState<{ q: string; a: string }[]>([]);
  const [draft, setDraft] = useState('');
  const lastFamily = useRef<string | null>(null);
  const help = contextHelp(scene, ctx);

  // Short, reactive comments at moments that matter: arriving at a new station.
  useEffect(() => {
    if (scene !== 'journey') { lastFamily.current = null; return; }
    const fam = SKILL_META[JOURNEY[ctx.skillIndex]].family;
    if (fam !== lastFamily.current) {
      const first = lastFamily.current === null && ctx.skillIndex === 0;
      lastFamily.current = fam;
      setBubble(first ? `Welcome to ${FAMILIES[fam].label}. Tap me if a skill sounds unfamiliar.` : `Next stop: ${FAMILIES[fam].label}.`);
    }
  }, [scene, ctx.skillIndex]);

  // Each bubble hides itself; independent of scene changes, so it can't get stuck on screen.
  useEffect(() => {
    if (!bubble) return;
    const t = setTimeout(() => setBubble(null), 3800);
    return () => clearTimeout(t);
  }, [bubble]);

  const ask = () => {
    const q = draft.trim(); if (!q) return;
    setChat(c => [...c, { q, a: `Good question. Soon I’ll answer anything with AI. For now, here’s what helps on this step: ${help.body}` }]);
    setDraft('');
  };

  return (
    <div className="pointer-events-none fixed right-4 bottom-4 z-30 flex flex-col items-end gap-3 md:right-6 md:bottom-6">
      <AnimatePresence>
        {open && (
          <motion.section initial={{ opacity: 0, y: 12, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 12, scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 320, damping: 28 }} aria-label="Buddy"
            className="pointer-events-auto flex max-h-[60vh] w-[min(22rem,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl bg-primary shadow-xl ring-1 ring-secondary">
            <header className="flex items-start justify-between gap-3 border-b border-secondary p-4">
              <div>
                <p className="text-xs font-semibold text-brand-secondary">What’s this?</p>
                <p className="text-md font-semibold text-primary">{help.title}</p>
              </div>
              <button aria-label="Close buddy" onClick={() => setOpen(false)} className="rounded-md p-1 text-fg-quaternary hover:bg-primary_hover"><XIcon className="size-5" /></button>
            </header>
            <div className="flex flex-1 flex-col gap-3 overflow-y-auto p-4 text-sm">
              <p className="text-secondary">{help.body}</p>
              {chat.map((m, i) => (
                <div key={i} className="flex flex-col gap-2">
                  <p className="self-end rounded-xl rounded-br-sm bg-brand-solid px-3 py-2 text-white">{m.q}</p>
                  <p className="rounded-xl rounded-bl-sm bg-secondary px-3 py-2 text-secondary">{m.a}</p>
                </div>
              ))}
            </div>
            <form className="flex gap-2 border-t border-secondary p-3" onSubmit={e => { e.preventDefault(); ask(); }}>
              <input value={draft} onChange={e => setDraft(e.target.value)} placeholder="Ask anything" aria-label="Ask your buddy"
                className="min-w-0 flex-1 rounded-lg bg-primary px-3 py-2 text-sm text-primary shadow-xs ring-1 ring-primary outline-none ring-inset placeholder:text-placeholder focus:ring-2 focus:ring-brand" />
              <button type="submit" aria-label="Send" className="grid size-9 place-items-center rounded-lg bg-brand-solid text-white hover:bg-brand-solid_hover"><PaperPlaneRightIcon className="size-4" weight="fill" /></button>
            </form>
          </motion.section>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {bubble && !open && (
          <motion.p initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }} role="status"
            className="pointer-events-auto max-w-64 rounded-xl rounded-br-sm bg-primary px-3 py-2 text-sm text-secondary shadow-lg ring-1 ring-secondary">{bubble}</motion.p>
        )}
      </AnimatePresence>
      <button onClick={() => setOpen(o => !o)} aria-expanded={open}
        className="pointer-events-auto flex items-center gap-2 rounded-full bg-primary py-1.5 pr-4 pl-1.5 text-sm font-semibold text-primary shadow-lg ring-1 ring-secondary transition hover:shadow-xl">
        {/* Placeholder buddy until the generated character (Rive/glTF) arrives. */}
        <span className="grid size-9 place-items-center rounded-full bg-[radial-gradient(circle_at_30%_30%,#5EE2B0,#139E6F)] text-white">
          <SparkleIcon className="size-5" weight="fill" />
        </span>
        Ask your buddy
      </button>
    </div>
  );
}
