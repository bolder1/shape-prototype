'use client';
import { CheckCircleIcon, CircleIcon } from '@phosphor-icons/react/ssr';
import { fieldReady, words, type BossAnswers, type BossBrief, type BossField } from '@shape/content';
import { Badge } from '@/components/base/badges/badges';
import { Input } from '@/components/base/input/input';
import { TextArea } from '@/components/base/textarea/textarea';
import { Mock } from '../lessons/mocks';

function ReadyMark({ ok, label }: { ok: boolean; label: string }) {
  return ok
    ? <span className="inline-flex items-center gap-1 text-xs font-semibold text-mint-700"><CheckCircleIcon className="size-4" weight="fill" />{label}</span>
    : <span className="inline-flex items-center gap-1 text-xs text-quaternary"><CircleIcon className="size-4" />{label}</span>;
}

function Field({ field, n, value, onChange }: { field: BossField; n: number; value: string | string[] | undefined; onChange: (v: string | string[]) => void }) {
  const ok = fieldReady(field, value);
  return (
    <section className="rounded-2xl bg-primary p-5 ring-1 ring-secondary ring-inset" aria-labelledby={`f-${field.id}`}>
      <div className="mb-1 flex items-start justify-between gap-3">
        <h2 id={`f-${field.id}`} className="text-md font-semibold text-primary"><span className="mr-2 text-quaternary">{n}</span>{field.label}</h2>
        <ReadyMark ok={ok} label={ok ? 'Ready' : field.kind === 'list' ? `${field.items} needed` : `${field.minWords}+ words`} />
      </div>
      <p className="mb-4 text-sm text-tertiary">{field.hint}</p>
      {field.kind === 'list' ? (
        <ol className="flex flex-col gap-3">
          {(Array.isArray(value) ? value : []).map((item, i, all) => (
            <li key={i} className="flex gap-3">
              <span className="mt-2.5 grid size-6 shrink-0 place-items-center rounded-full bg-secondary text-xs font-semibold text-tertiary">{i + 1}</span>
              <TextArea aria-label={`${field.label} ${i + 1}`} rows={2} className="flex-1" value={item}
                placeholder={i === 0 ? field.placeholder : undefined}
                onChange={v => onChange(all.map((x, j) => (j === i ? v : x)))} />
            </li>
          ))}
        </ol>
      ) : field.kind === 'long' ? (
        <TextArea aria-label={field.label} rows={4} value={(value as string) ?? ''} placeholder={field.placeholder} onChange={onChange}
          hint={`${words((value as string) ?? '')} words`} />
      ) : (
        <Input aria-label={field.label} value={(value as string) ?? ''} placeholder={field.placeholder} onChange={onChange} />
      )}
    </section>
  );
}

/** The workspace: every part of the hand-in, with the brief and rubric beside it on wide screens. */
export function BossFields({ brief, answers, onChange }: { brief: BossBrief; answers: BossAnswers; onChange: (a: BossAnswers) => void }) {
  const done = brief.fields.filter(f => fieldReady(f, answers[f.id])).length;
  return (
    <main className="mx-auto grid max-w-5xl gap-6 px-4 py-6 md:py-10 lg:grid-cols-[1fr_18rem]">
      <div className="flex flex-col gap-4">
        <div className="flex items-baseline justify-between">
          <h1 className="text-xl font-semibold text-primary">{brief.title}</h1>
          <span className="text-sm text-tertiary tabular-nums">{done} of {brief.fields.length} parts ready</span>
        </div>
        {brief.fields.map((f, i) => (
          <Field key={f.id} field={f} n={i + 1} value={answers[f.id]} onChange={v => onChange({ ...answers, [f.id]: v })} />
        ))}
      </div>
      <aside className="flex flex-col gap-4 lg:sticky lg:top-20 lg:self-start">
        {brief.mock && <Mock id={brief.mock} />}
        <section className="rounded-2xl bg-primary p-4 ring-1 ring-secondary ring-inset">
          <h2 className="text-sm font-semibold text-primary">Rubric</h2>
          <ul className="mt-2 flex flex-col gap-2.5">
            {brief.rubric.map(c => (
              <li key={c.id} className="text-xs text-tertiary">
                <span className="flex items-center gap-1.5 text-sm font-semibold text-secondary">{c.label}{c.required && <Badge type="modern" color="gray" size="sm">Required</Badge>}</span>
                {c.strong}
              </li>
            ))}
          </ul>
        </section>
      </aside>
    </main>
  );
}
