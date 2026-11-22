'use client';
// Runs an episode: title card → watch → check → play → finish the story → takeaways → rapid quiz → prize ladder → grade card.
import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { FilmSlateIcon, GameControllerIcon, LadderIcon, LightbulbIcon, LightningIcon, ListChecksIcon, MedalIcon, PlayCircleIcon, PlayIcon, TimerIcon, XIcon } from '@phosphor-icons/react/ssr';
import { findExercise, type Episode } from '@shape/content';
import { springs } from '@shape/ui';
import { cx } from '@/utils/cx';
import type { StepResult } from '../progress/store';
import { Nib } from './kit';
import { gradeEpisode, type Scored } from './scoring';
import { Coach } from './coach/Coach';
import type { Missed } from './coach/offline';
import { Check } from './stages/Check';
import { DiamondSort, type GameResult } from './games/DiamondSort';
import { SwipeSort } from './games/SwipeSort';
import { MythPop } from './games/MythPop';
import { RoleRoute } from './games/RoleRoute';
import { GestaltHunt } from './games/GestaltHunt';
import { SquintTest } from './games/SquintTest';
import { LawLab } from './games/LawLab';
import { ChunkLab } from './games/ChunkLab';
import { Flashlight } from './games/Flashlight';
import { ScaleSort } from './games/ScaleSort';
import { QuestionForge } from './games/QuestionForge';
import { RedPen } from './games/RedPen';
import { JargonSwap } from './games/JargonSwap';
import { CrowdSort } from './games/CrowdSort';
import { PatternFit } from './games/PatternFit';
import { TreeTest } from './games/TreeTest';
import { SpacingFix } from './games/SpacingFix';
import { ColumnSpan } from './games/ColumnSpan';
import { LineCut } from './games/LineCut';
import { AlignSnap } from './games/AlignSnap';
import { GradeCard } from './stages/GradeCard';
import { Ladder } from './stages/Ladder';
import { Quiz } from './stages/Quiz';
import { Takeaways } from './stages/Takeaways';
import { Watch } from './stages/Watch';
import { play } from '@/lib/sound';
import { SoundToggle } from '@/components/SoundToggle';

const STAGES = [
  { key: 'watch', label: 'Watch', icon: PlayCircleIcon },
  { key: 'check', label: 'Quick check', icon: ListChecksIcon },
  { key: 'play', label: 'Play', icon: GameControllerIcon },
  { key: 'story', label: 'Your call', icon: FilmSlateIcon },
  { key: 'takeaways', label: 'Takeaways', icon: LightbulbIcon },
  { key: 'quiz', label: 'Rapid quiz', icon: TimerIcon },
  { key: 'ladder', label: 'Prize ladder', icon: LadderIcon },
  { key: 'grade', label: 'Grade card', icon: MedalIcon },
] as const;
type StageKey = (typeof STAGES)[number]['key'];

/** One mini-game per episode, chosen by the episode's `game.id`. */
const GAMES: Record<Episode['game']['id'], React.ComponentType<{ game: Episode['game']; onDone: (r: GameResult[]) => void }>> = {
  'diamond-sort': DiamondSort,
  'swipe-sort': SwipeSort,
  'myth-pop': MythPop,
  'role-route': RoleRoute,
  'gestalt-hunt': GestaltHunt,
  'squint-test': SquintTest,
  'law-lab': LawLab,
  'chunk-lab': ChunkLab,
  flashlight: Flashlight,
  'scale-sort': ScaleSort,
  'question-forge': QuestionForge,
  'red-pen': RedPen,
  'jargon-swap': JargonSwap,
  'crowd-sort': CrowdSort,
  'pattern-fit': PatternFit,
  'tree-test': TreeTest,
  'spacing-fix': SpacingFix,
  'column-span': ColumnSpan,
  'line-cut': LineCut,
  'align-snap': AlignSnap,
};

interface Props {
  episode: Episode;
  title: string;
  /** e.g. "What design actually is · Lesson 2 of 4" */
  eyebrow: string;
  name: string;
  exitHref: string;
  next?: { href: string; label: string };
  /** Saves progress (results go to the review deck); returns what to celebrate. */
  onComplete: (results: StepResult[], xp: number) => { xp: number; streak: number; newDay: boolean };
}

export function EpisodePlayer({ episode, title, eyebrow, name, exitHref, next, onComplete }: Props) {
  const [run, setRun] = useState(0);   // bump to replay from the top
  return <Run key={run} {...{ episode, title, eyebrow, name, exitHref, next, onComplete }} onReplay={() => setRun(r => r + 1)} />;
}

function Run({ episode, title, eyebrow, name, exitHref, next, onComplete, onReplay }: Props & { onReplay: () => void }) {
  const [stage, setStage] = useState<StageKey | 'intro'>('intro');
  const [scored, setScored] = useState<Scored[]>([]);
  const [saved, setSaved] = useState<{ xp: number; streak: number; newDay: boolean } | null>(null);
  const index = STAGES.findIndex(s => s.key === stage);
  // The most recent miss, resolved from our own content, so Nib can explain it.
  const missed = (() => {
    const last = [...scored].reverse().find(s => !s.correct && !s.unseen);
    const ex = last && findExercise(episode.lessonId, `${last.stage}.${last.id}`);
    if (!ex || ex.type !== 'pick') return undefined;
    return { prompt: ex.prompt, answer: ex.options.find(o => o.id === ex.correct)?.label ?? '', explanation: ex.explanation } satisfies Missed;
  })();
  const Game = GAMES[episode.game.id];
  const add = (items: Scored[]) => setScored(s => [...s, ...items]);
  const go = (k: StageKey) => { play('whoosh'); setStage(k); window.scrollTo({ top: 0, behavior: 'smooth' }); };

  const finish = (ladderItems: Scored[]) => {
    const all = [...scored, ...ladderItems];
    setScored(all);
    const result = gradeEpisode(all);
    // Everything answered goes to the review deck; misses come back tomorrow.
    const results: StepResult[] = all.filter(i => !i.unseen).map(i => ({ exerciseKey: `${episode.lessonId}:${i.stage}.${i.id}`, firstTry: i.correct, attempts: 1 }));
    setSaved(onComplete(results, result.xp));
    go('grade');
  };

  if (stage === 'intro') return <TitleCard episode={episode} title={title} eyebrow={eyebrow} exitHref={exitHref} onStart={() => go('watch')} />;

  return (
    <div className="min-h-dvh bg-primary">
      <header className="sticky top-0 z-20 border-b border-secondary bg-primary/90 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-2.5">
          <Link href={exitHref} aria-label="Leave episode" className="grid size-9 shrink-0 place-items-center rounded-lg text-fg-quaternary hover:bg-primary_hover"><XIcon className="size-5" /></Link>
          <ol className="flex flex-1 items-center gap-1" aria-label="Episode stages">
            {STAGES.map((s, i) => {
              const done = i < index, current = i === index;
              return (
                <li key={s.key} className="flex flex-1 items-center gap-1">
                  <motion.span animate={{ scale: current ? 1.15 : 1 }} transition={springs.pop} title={s.label} aria-current={current ? 'step' : undefined}
                    className={cx('grid size-8 shrink-0 place-items-center rounded-full transition-colors',
                      done ? 'bg-mint-600 text-white' : current ? 'bg-brand-solid text-white ring-4 ring-brand-solid/20' : 'bg-secondary text-quaternary')}>
                    <s.icon className="size-4" weight={done || current ? 'fill' : 'regular'} /><span className="sr-only">{s.label}{done ? ' (done)' : ''}</span>
                  </motion.span>
                  {i < STAGES.length - 1 && <span className={cx('hidden h-0.5 flex-1 rounded-full sm:block', done ? 'bg-mint-600' : 'bg-secondary')} />}
                </li>
              );
            })}
          </ol>
          <SoundToggle />
        </div>
      </header>

      <Coach episode={episode} stage={stage} missed={missed} />
      <main className="mx-auto w-full max-w-3xl px-4 pt-6 pb-24 md:pt-8">
          <motion.div key={stage} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.25 }}>
            {stage === 'watch' && <Watch episode={episode} mode="watch" onDone={() => go('check')} />}
            {stage === 'check' && <Check questions={episode.check} onDone={r => { add(r.map(x => ({ stage: 'check', ...x }))); go('play'); }} />}
            {stage === 'play' && <Game game={episode.game} onDone={r => { add(r.map(x => ({ stage: 'game', ...x }))); go('story'); }} />}
            {stage === 'story' && <Watch episode={episode} mode="gap" onDone={c => { add([{ stage: 'gap', id: episode.gap.id, correct: !!c }]); go('takeaways'); }} />}
            {stage === 'takeaways' && <Takeaways items={episode.takeaways} onDone={() => go('quiz')} />}
            {stage === 'quiz' && <Quiz quiz={episode.quiz} onDone={r => { add(r.map(x => ({ stage: 'quiz', id: x.id, correct: x.correct }))); go('ladder'); }} />}
            {stage === 'ladder' && <Ladder questions={episode.ladder} onDone={r => finish(episode.ladder.map(q => {
              const a = r.answered.find(x => x.id === q.id);
              return { stage: 'ladder', id: q.id, correct: !!a?.correct, unseen: !a };
            }))} />}
            {stage === 'grade' && saved && (
              <GradeCard lessonId={episode.lessonId} result={gradeEpisode(scored)} title={title} episode={eyebrow} name={name} xp={saved.xp} streak={saved.streak} newDay={saved.newDay}
                next={next} onReplay={onReplay} exitHref={exitHref} />
            )}
          </motion.div>
      </main>
    </div>
  );
}

/** The episode's opening: what it is, how long, and the eight stages ahead. */
function TitleCard({ episode, title, eyebrow, exitHref, onStart }: { episode: Episode; title: string; eyebrow: string; exitHref: string; onStart: () => void }) {
  return (
    <main className="relative flex min-h-dvh flex-col overflow-hidden bg-brand-950 text-white">
      <div aria-hidden className="pointer-events-none absolute inset-0" style={{ background: 'radial-gradient(50% 45% at 50% 30%, rgba(43,192,138,0.25), transparent 70%), radial-gradient(35% 35% at 15% 85%, rgba(59,111,245,0.3), transparent 70%), radial-gradient(35% 35% at 85% 85%, rgba(217,70,122,0.25), transparent 70%)' }} />
      <div className="relative flex items-center px-4 py-3">
        <Link href={exitHref} aria-label="Leave episode" className="grid size-9 place-items-center rounded-lg text-white/60 hover:bg-white/10"><XIcon className="size-5" /></Link>
      </div>
      <div className="relative mx-auto flex w-full max-w-2xl flex-1 flex-col items-center justify-center gap-6 px-4 pb-16 text-center">
        <motion.div initial={{ scale: 0.4, opacity: 0, rotate: -20 }} animate={{ scale: 1, opacity: 1, rotate: 0 }} transition={springs.pop}><Nib mood="cheer" size={96} /></motion.div>
        <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ ...springs.gentle, delay: 0.15 }} className="text-sm font-semibold tracking-wide text-mint-300 uppercase">{eyebrow}</motion.p>
        <motion.h1 initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ ...springs.gentle, delay: 0.25 }} className="text-display-md font-bold md:text-display-lg">{title}</motion.h1>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="max-w-lg text-lg text-white/75">{episode.hook}</motion.p>
        <ol className="flex flex-wrap justify-center gap-2" aria-label="What’s in this episode">
          {STAGES.map((s, i) => (
            <motion.li key={s.key} initial={{ opacity: 0, y: 10, scale: 0.8 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ ...springs.pop, delay: 0.5 + i * 0.06 }}
              className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-sm font-semibold ring-1 ring-white/15">
              <s.icon className="size-4 text-mint-300" weight="fill" />{s.label}
            </motion.li>
          ))}
        </ol>
        <motion.button type="button" onClick={onStart} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ ...springs.pop, delay: 1.1 }}
          whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
          className="mt-2 inline-flex items-center gap-2 rounded-2xl bg-mint-500 px-8 py-4 text-lg font-bold text-brand-950 shadow-lg shadow-mint-500/30">
          <PlayIcon className="size-5" weight="fill" />Start episode
        </motion.button>
        <p className="inline-flex items-center gap-1.5 text-sm text-white/60"><LightningIcon className="size-4" weight="fill" />About 8 minutes · up to 80 XP</p>
      </div>
    </main>
  );
}
