'use client';
// Quick check: two questions straight after the video, each answered instantly, then a small result.
import { useState } from 'react';
import { motion } from 'motion/react';
import type { EpisodeQuestion } from '@shape/content';
import { springs } from '@shape/ui';
import { Button } from '@/components/base/buttons/button';
import { Burst, Choice, NibSays, StageTitle, choiceState } from '../kit';

export function Check({ questions, onDone }: { questions: EpisodeQuestion[]; onDone: (results: { id: string; correct: boolean }[]) => void }) {
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [results, setResults] = useState<{ id: string; correct: boolean }[]>([]);
  const q = questions[i];
  const finished = results.length === questions.length && i >= questions.length;

  const pick = (id: string) => {
    if (picked) return;
    setPicked(id);
    setResults(r => [...r, { id: q.id, correct: id === q.correct }]);
  };
  const next = () => { setPicked(null); setI(i + 1); };

  if (finished) {
    const right = results.filter(r => r.correct).length;
    return (
      <div className="relative flex flex-col items-center gap-6 py-6 text-center">
        {right === questions.length && <Burst />}
        <StageTitle eyebrow="Result" title={right === questions.length ? 'Clean sweep' : right ? 'Good start' : 'Worth another look'} />
        <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={springs.pop}
          className="grid size-36 place-items-center rounded-full bg-primary ring-8 ring-secondary">
          <span className="text-display-md font-bold text-primary tabular-nums">{right}<span className="text-display-xs text-quaternary">/{questions.length}</span></span>
        </motion.div>
        <NibSays mood={right === questions.length ? 'cheer' : 'think'}>
          {right === questions.length ? 'You were paying attention. Now let’s get your hands dirty.' : 'No stress. The game next will lock it in.'}
        </NibSays>
        <Button size="xl" onPress={() => onDone(results)}>Play the game</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <StageTitle eyebrow={`Quick check · ${i + 1} of ${questions.length}`} title={q.prompt} />
        <motion.div key={q.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }} className="flex flex-col gap-3">
          {q.options.map((o, j) => <Choice key={o.id} index={j} label={o.label} state={choiceState(o.id, picked, q.correct, !!picked)} onPress={() => pick(o.id)} disabled={!!picked} />)}
        </motion.div>
      {picked && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-4">
          <NibSays mood={picked === q.correct ? 'cheer' : 'sad'}>{q.explanation}</NibSays>
          <div className="flex justify-end"><Button size="lg" onPress={next}>{i + 1 < questions.length ? 'Next' : 'See result'}</Button></div>
        </motion.div>
      )}
    </div>
  );
}
