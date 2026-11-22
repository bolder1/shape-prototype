'use client';
import { useState } from 'react';
import { InfoIcon } from '@phosphor-icons/react/ssr';
import { LEVELS, type BossAnswers, type BossBrief, type Level } from '@shape/content';
import { Badge } from '@/components/base/badges/badges';
import { Button } from '@/components/base/buttons/button';
import { Segmented } from '@/components/inputs/Segmented';

const asList = (v: string | string[] | undefined) => (Array.isArray(v) ? v : v ? [v] : []);

function Answer({ value, tone }: { value: string | string[] | undefined; tone: 'mine' | 'strong' }) {
  const items = asList(value);
  return items.length > 1
    ? <ol className="flex list-decimal flex-col gap-1.5 pl-5 text-sm text-secondary">{items.map((t, i) => <li key={i}>{t || <em className="text-quaternary">Empty</em>}</li>)}</ol>
    : <p className={tone === 'mine' ? 'text-sm whitespace-pre-wrap text-secondary' : 'text-sm text-secondary'}>{items[0]}</p>;
}

/** Fallback when the AI review isn't available: compare with a strong answer, then rate yourself. */
export function SelfReview({ brief, answers, notice, onDone }: { brief: BossBrief; answers: BossAnswers; notice: string | null; onDone: (levels: Record<string, Level>) => void }) {
  const [levels, setLevels] = useState<Record<string, Level>>({});
  const rated = brief.rubric.every(c => levels[c.id] != null);
  return (
    <main className="mx-auto flex max-w-4xl flex-col gap-6 px-4 py-6 md:py-10">
      <div>
        <h1 className="text-xl font-semibold text-primary">Review your own work</h1>
        {notice && <p className="mt-2 flex gap-2 rounded-xl bg-primary p-3 text-sm text-tertiary ring-1 ring-secondary ring-inset"><InfoIcon className="mt-0.5 size-4 shrink-0" />{notice}</p>}
        <p className="mt-3 text-md text-tertiary">Put your answer next to a strong one, then rate each rubric line honestly. Your score counts, and it’s marked as self-reviewed.</p>
      </div>

      <section className="flex flex-col gap-4">
        {brief.fields.map(f => (
          <div key={f.id} className="rounded-2xl bg-primary p-5 ring-1 ring-secondary ring-inset">
            <h2 className="mb-3 text-md font-semibold text-primary">{f.label}</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <div><p className="mb-1.5 text-xs font-semibold tracking-wide text-quaternary uppercase">Yours</p><Answer value={answers[f.id]} tone="mine" /></div>
              <div className="rounded-xl bg-secondary p-3"><p className="mb-1.5 text-xs font-semibold tracking-wide text-quaternary uppercase">A strong answer</p><Answer value={brief.example[f.id]} tone="strong" /></div>
            </div>
          </div>
        ))}
      </section>

      <section className="rounded-2xl bg-primary p-5 ring-1 ring-secondary ring-inset">
        <h2 className="text-md font-semibold text-primary">Rate each line</h2>
        <ul className="mt-2 flex flex-col divide-y divide-secondary">
          {brief.rubric.map(c => (
            <li key={c.id} className="flex flex-col gap-3 py-4">
              <div>
                <p className="flex items-center gap-2 text-sm font-semibold text-primary">{c.label}{c.required && <Badge type="modern" color="gray" size="sm">Required</Badge>}</p>
                <p className="text-sm text-tertiary">Strong: {c.strong}</p>
              </div>
              <Segmented label={`Your level for ${c.label}`} value={levels[c.id] != null ? String(levels[c.id]) : undefined}
                onChange={v => setLevels(l => ({ ...l, [c.id]: Number(v) as Level }))}
                segments={LEVELS.map((name, i) => ({ value: String(i), label: name }))} />
            </li>
          ))}
        </ul>
      </section>

      <div className="flex justify-end"><Button size="xl" isDisabled={!rated} onPress={() => onDone(levels)}>See my score</Button></div>
    </main>
  );
}
