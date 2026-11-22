'use client';
// Ask Nib: a chat with the coach, available during an episode's learning stages. Replies stream from /api/coach;
// if that's unavailable (no API key, offline, daily limit), Nib switches to offline mode and answers from the lesson.
// Locked during the rapid quiz and the prize ladder, so the coach is never an answer key.
import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { LockSimpleIcon, PaperPlaneRightIcon, XIcon } from '@phosphor-icons/react/ssr';
import type { Episode } from '@shape/content';
import { springs } from '@shape/ui';
import { cx } from '@/utils/cx';
import { Nib } from '../kit';
import { offlineAnswer, type Missed, type QuickAsk } from './offline';

export type CoachStage = 'watch' | 'check' | 'play' | 'story' | 'takeaways' | 'quiz' | 'ladder' | 'grade';
interface Msg { role: 'user' | 'assistant'; content: string }

const LOCKED: CoachStage[] = ['quiz', 'ladder'];
const QUICK: { key: QuickAsk; label: string }[] = [
  { key: 'simple', label: 'Explain it simply' },
  { key: 'example', label: 'Give me an example' },
  { key: 'why-wrong', label: 'Why was my answer wrong?' },
];

export function Coach({ episode, stage, missed }: { episode: Episode; stage: CoachStage; missed?: Missed }) {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [draft, setDraft] = useState('');
  const [busy, setBusy] = useState(false);
  const [offline, setOffline] = useState(false);
  const input = useRef<HTMLTextAreaElement>(null);
  const list = useRef<HTMLDivElement>(null);
  const locked = LOCKED.includes(stage);
  const isOpen = open && !locked;

  useEffect(() => { if (isOpen) input.current?.focus(); }, [isOpen]);
  useEffect(() => { list.current?.scrollTo({ top: list.current.scrollHeight, behavior: 'smooth' }); }, [msgs]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const append = (text: string) => setMsgs(m => { const copy = [...m]; copy[copy.length - 1] = { role: 'assistant', content: copy[copy.length - 1].content + text }; return copy; });

  const ask = async (text: string, quick?: QuickAsk) => {
    const q = text.trim();
    if (!q || busy) return;
    const history: Msg[] = [...msgs, { role: 'user', content: q }];
    setMsgs([...history, { role: 'assistant', content: '' }]);
    setDraft('');
    setBusy(true);
    const fallback = () => { setOffline(true); append(offlineAnswer(episode, q, missed, quick)); };
    try {
      if (offline) { fallback(); return; }
      const res = await fetch('/api/coach', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lessonId: episode.lessonId, stage: stage === 'quiz' || stage === 'ladder' ? 'grade' : stage, missed, messages: history.slice(-12) }),
      });
      if (!res.ok || !res.body) { fallback(); return; }
      const reader = res.body.getReader(), decoder = new TextDecoder();
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        append(decoder.decode(value, { stream: true }));
      }
    } catch {
      fallback();
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      {/* the launcher */}
      <motion.button type="button" onClick={() => !locked && setOpen(o => !o)} disabled={locked} aria-expanded={isOpen}
        initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={springs.pop} whileTap={locked ? undefined : { scale: 0.95 }}
        className={cx('fixed right-4 bottom-4 z-40 inline-flex items-center gap-2 rounded-full py-1.5 pr-4 pl-1.5 text-sm font-bold shadow-xl ring-1 ring-inset',
          locked ? 'bg-secondary text-quaternary ring-secondary' : 'bg-brand-solid text-white ring-white/10 hover:bg-brand-solid_hover', isOpen && 'hidden')}
        title={locked ? 'Nib stays quiet during the quiz' : 'Ask Nib about this lesson'}>
        <span className="grid size-9 place-items-center rounded-full bg-white/10"><Nib size={26} mood={locked ? 'idle' : 'idle'} /></span>
        {locked ? <><LockSimpleIcon className="size-4" weight="bold" />Quiet during the quiz</> : 'Ask Nib'}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.section role="dialog" aria-label="Ask Nib" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 24 }} transition={springs.gentle}
            className="fixed inset-x-0 bottom-0 z-50 flex h-[72dvh] flex-col rounded-t-3xl bg-primary shadow-2xl ring-1 ring-secondary sm:inset-x-auto sm:right-4 sm:bottom-4 sm:h-[560px] sm:w-[380px] sm:rounded-3xl">
            <header className="flex items-center gap-3 border-b border-secondary px-4 py-3">
              <Nib size={34} mood={busy ? 'think' : 'cheer'} />
              <div className="flex-1">
                <p className="text-md font-bold text-primary">Ask Nib</p>
                <p className="text-xs text-tertiary">{offline ? 'Offline mode · answers from this lesson' : 'Your coach for this lesson'}</p>
              </div>
              <button type="button" onClick={() => setOpen(false)} aria-label="Close" className="grid size-9 place-items-center rounded-lg text-fg-quaternary hover:bg-primary_hover"><XIcon className="size-5" /></button>
            </header>

            <div ref={list} className="flex flex-1 flex-col gap-3 overflow-y-auto px-4 py-4" aria-live="polite">
              {!msgs.length && (
                <div className="rounded-2xl rounded-tl-sm bg-secondary px-4 py-3 text-md text-primary">
                  Hi! I’m here for anything in <strong>this lesson</strong>. Stuck on an idea, want an example, or curious why an answer was wrong? Ask away.
                </div>
              )}
              {msgs.map((m, i) => (
                <div key={i} className={cx('max-w-[88%] rounded-2xl px-4 py-2.5 text-md whitespace-pre-wrap',
                  m.role === 'user' ? 'self-end rounded-br-sm bg-brand-solid text-white' : 'self-start rounded-tl-sm bg-secondary text-primary')}>
                  {m.content || <span className="inline-flex gap-1" aria-label="Nib is typing">{[0, 1, 2].map(d => <motion.span key={d} className="size-1.5 rounded-full bg-fg-quaternary" animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1, repeat: Infinity, delay: d * 0.15 }} />)}</span>}
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-1.5 px-4 pb-2">
              {QUICK.filter(q => q.key !== 'why-wrong' || missed).map(q => (
                <button key={q.key} type="button" onClick={() => ask(q.label, q.key)} disabled={busy}
                  className="rounded-full bg-secondary px-3 py-1.5 text-xs font-semibold text-secondary ring-1 ring-secondary transition ring-inset hover:bg-primary_hover disabled:opacity-50">{q.label}</button>
              ))}
            </div>
            <form className="flex items-end gap-2 border-t border-secondary p-3" onSubmit={e => { e.preventDefault(); ask(draft); }}>
              <label htmlFor="ask-nib" className="sr-only">Your question</label>
              <textarea id="ask-nib" ref={input} rows={1} value={draft} maxLength={1200} onChange={e => setDraft(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); ask(draft); } }}
                placeholder="Ask about this lesson…" className="max-h-28 min-h-11 flex-1 resize-none rounded-xl bg-secondary px-3 py-2.5 text-md text-primary ring-1 ring-secondary outline-none ring-inset placeholder:text-placeholder focus:ring-brand-solid" />
              <button type="submit" disabled={busy || !draft.trim()} aria-label="Send"
                className="grid size-11 shrink-0 place-items-center rounded-xl bg-brand-solid text-white transition hover:bg-brand-solid_hover disabled:opacity-40">
                <PaperPlaneRightIcon className="size-5" weight="fill" />
              </button>
            </form>
          </motion.section>
        )}
      </AnimatePresence>
    </>
  );
}
