'use client';
import { Reorder, useDragControls } from 'motion/react';
import { Radio, RadioGroup, Slider, SliderThumb, SliderTrack, Label, ToggleButton, ToggleButtonGroup } from 'react-aria-components';
import { ArrowDownIcon, ArrowUpIcon, CheckIcon, DotsSixVerticalIcon, XIcon } from '@phosphor-icons/react/ssr';
import type { Answer, Exercise, ExerciseOf, Grade, MockId } from '@shape/content';
import { cx } from '@/utils/cx';
import { Mock } from './mocks';

export interface ExerciseProps<T extends Exercise['type']> {
  exercise: ExerciseOf<T>;
  answer: Extract<Answer, { type: T }>;
  onChange: (a: Extract<Answer, { type: T }>) => void;
  /** Set after Check: locks input and shows right/wrong. */
  result: Grade | null;
}

const Prompt = ({ children }: { children: string }) => <h1 className="text-display-xs font-semibold text-primary">{children}</h1>;

/** Concept cards show mocks in their "good" state. */
const GOOD: Partial<Record<MockId, number>> = { 'group-spacing': 32, 'reading-text': 1.55, 'contrast-label': 70 };

export function ConceptView({ exercise }: { exercise: ExerciseOf<'concept'> }) {
  return (
    <div className="flex flex-col gap-5">
      <p className="text-sm font-semibold text-brand-secondary">New idea</p>
      <h1 className="text-display-xs font-semibold text-primary">{exercise.title}</h1>
      <div className="flex flex-col gap-3">{exercise.body.map((p, i) => <p key={i} className="text-lg text-secondary">{p}</p>)}</div>
      {exercise.mock && <Mock id={exercise.mock} value={GOOD[exercise.mock]} />}
    </div>
  );
}

export function PickView({ exercise, answer, onChange, result }: ExerciseProps<'pick'>) {
  return (
    <div className="flex flex-col gap-5">
      <Prompt>{exercise.prompt}</Prompt>
      {exercise.mock && <Mock id={exercise.mock} />}
      <RadioGroup aria-label={exercise.prompt} value={answer.choice} isDisabled={!!result}
        onChange={choice => onChange({ type: 'pick', choice })} className="flex flex-col gap-2">
        {exercise.options.map((o, i) => {
          const isCorrect = result && o.id === exercise.correct;
          const isWrong = result && result.wrong.includes(o.id);
          return (
            <Radio key={o.id} value={o.id} className={({ isSelected, isFocusVisible, isHovered }) => cx(
              'flex cursor-pointer items-center gap-3 rounded-xl bg-primary p-4 ring-1 ring-secondary outline-none transition ring-inset',
              isHovered && !result && !isSelected && 'bg-primary_hover',
              isSelected && !result && 'bg-brand-primary ring-2 ring-brand-solid',
              isCorrect && 'bg-mint-50 ring-2 ring-mint-600',
              isWrong && 'bg-error-primary ring-2 ring-error',
              isFocusVisible && 'outline-2 outline-offset-2 outline-brand-solid',
              result && 'cursor-default')}>
              <span className="grid size-7 shrink-0 place-items-center rounded-md bg-secondary text-xs font-semibold text-tertiary">
                {isCorrect ? <CheckIcon className="size-4 text-mint-700" weight="bold" /> : isWrong ? <XIcon className="size-4 text-error-primary" weight="bold" /> : String.fromCharCode(65 + i)}
              </span>
              <span className="text-md text-primary">{o.label}{o.detail && <span className="block text-sm text-tertiary">{o.detail}</span>}</span>
            </Radio>
          );
        })}
      </RadioGroup>
    </div>
  );
}

export function SortView({ exercise, answer, onChange, result }: ExerciseProps<'sort'>) {
  return (
    <div className="flex flex-col gap-5">
      <Prompt>{exercise.prompt}</Prompt>
      <ul className="flex flex-col gap-2">
        {exercise.items.map(item => {
          const wrong = result?.wrong.includes(item.id);
          const correctBucket = exercise.buckets.find(b => b.id === item.bucket)?.label;
          return (
            <li key={item.id} className={cx('flex flex-col gap-3 rounded-xl bg-primary p-4 ring-1 ring-secondary ring-inset sm:flex-row sm:items-center sm:justify-between',
              result && (wrong ? 'bg-error-primary ring-error_subtle' : 'bg-mint-50 ring-mint-200'))}>
              <span className="text-md text-primary">{item.label}
                {wrong && <span className="mt-1 block text-sm text-error-primary">Belongs in: {correctBucket}</span>}
              </span>
              <ToggleButtonGroup aria-label={`Category for: ${item.label}`} selectionMode="single" isDisabled={!!result}
                selectedKeys={answer.placement[item.id] ? [answer.placement[item.id]] : []}
                onSelectionChange={keys => { const k = [...keys][0]; if (k != null) onChange({ type: 'sort', placement: { ...answer.placement, [item.id]: String(k) } }); }}
                className="flex shrink-0 gap-1 rounded-lg bg-secondary p-1">
                {exercise.buckets.map(b => (
                  <ToggleButton key={b.id} id={b.id} className={({ isSelected, isFocusVisible }) => cx(
                    'cursor-pointer rounded-md px-3 py-1.5 text-sm font-semibold whitespace-nowrap outline-none transition',
                    isSelected ? 'bg-brand-solid text-white shadow-xs' : 'text-tertiary hover:text-secondary',
                    isFocusVisible && 'outline-2 outline-offset-2 outline-brand-solid', result && 'cursor-default')}>{b.label}</ToggleButton>
                ))}
              </ToggleButtonGroup>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function OrderRow({ id, label, index, total, move, disabled, wrong, done }: {
  id: string; label: string; index: number; total: number; move: (from: number, to: number) => void; disabled: boolean; wrong: boolean; done: boolean;
}) {
  const controls = useDragControls();
  return (
    <Reorder.Item value={id} dragListener={false} dragControls={controls}
      transition={{ layout: { duration: 0.16, ease: "easeOut" } }}
      className={cx('flex items-center gap-3 rounded-xl bg-primary p-3 ring-1 ring-secondary ring-inset select-none',
        done && (wrong ? 'bg-error-primary ring-error_subtle' : 'bg-mint-50 ring-mint-200'))}>
      <button type="button" aria-label="Drag to reorder" disabled={disabled} onPointerDown={e => controls.start(e)}
        className="grid size-8 shrink-0 cursor-grab touch-none place-items-center rounded-md text-fg-quaternary hover:bg-secondary active:cursor-grabbing disabled:cursor-default">
        <DotsSixVerticalIcon className="size-5" weight="bold" />
      </button>
      <span className="grid size-7 shrink-0 place-items-center rounded-full bg-secondary text-sm font-semibold text-tertiary">{index + 1}</span>
      <span className="flex-1 text-md text-primary">{label}</span>
      <div className="flex gap-1">
        <button type="button" aria-label={`Move “${label}” up`} disabled={disabled || index === 0} onClick={() => move(index, index - 1)}
          className="grid size-8 place-items-center rounded-md text-fg-tertiary hover:bg-secondary disabled:opacity-30"><ArrowUpIcon className="size-4" weight="bold" /></button>
        <button type="button" aria-label={`Move “${label}” down`} disabled={disabled || index === total - 1} onClick={() => move(index, index + 1)}
          className="grid size-8 place-items-center rounded-md text-fg-tertiary hover:bg-secondary disabled:opacity-30"><ArrowDownIcon className="size-4" weight="bold" /></button>
      </div>
    </Reorder.Item>
  );
}

export function OrderView({ exercise, answer, onChange, result }: ExerciseProps<'order'>) {
  const label = (id: string) => exercise.items.find(i => i.id === id)?.label ?? id;
  const move = (from: number, to: number) => {
    const seq = [...answer.sequence]; const [x] = seq.splice(from, 1); seq.splice(to, 0, x);
    onChange({ type: 'order', sequence: seq });
  };
  return (
    <div className="flex flex-col gap-5">
      <Prompt>{exercise.prompt}</Prompt>
      <p className="-mt-2 text-sm text-tertiary">Drag the handles, or use the arrows.</p>
      <Reorder.Group axis="y" values={answer.sequence} onReorder={seq => !result && onChange({ type: 'order', sequence: seq })} className="flex flex-col gap-2">
        {answer.sequence.map((id, i) => (
          <OrderRow key={id} id={id} label={label(id)} index={i} total={answer.sequence.length} move={move}
            disabled={!!result} done={!!result} wrong={!!result?.wrong.includes(id)} />
        ))}
      </Reorder.Group>
      {result && !result.correct && (
        <p className="text-sm text-secondary"><span className="font-semibold">Correct order:</span> {exercise.items.map(i => i.label).join(' → ')}</p>
      )}
    </div>
  );
}

export function SpotView({ exercise, answer, onChange, result }: ExerciseProps<'spot'>) {
  const toggle = (id: string) => onChange({ type: 'spot', selected: answer.selected.includes(id) ? answer.selected.filter(s => s !== id) : [...answer.selected, id] });
  return (
    <div className="flex flex-col gap-5">
      <Prompt>{exercise.prompt}</Prompt>
      <p className="-mt-2 text-sm text-tertiary">Tap to mark, tap again to unmark. {answer.selected.length} marked.</p>
      <Mock id={exercise.mock} spot={{ selected: answer.selected, onToggle: toggle, disabled: !!result, reveal: result ? { targets: exercise.targets } : undefined }} />
      {result && !result.correct && <p className="text-sm text-secondary">Green outlines are the real problems. Dashed means you missed it; red means it was fine.</p>}
    </div>
  );
}

export function TuneView({ exercise, answer, onChange, result }: ExerciseProps<'tune'>) {
  const fmt = (v: number) => `${Number.isInteger(exercise.step) ? v : v.toFixed(2)}${exercise.unit.startsWith('%') || exercise.unit === '×' ? '' : ' '}${exercise.unit}`;
  return (
    <div className="flex flex-col gap-5">
      <Prompt>{exercise.prompt}</Prompt>
      <Mock id={exercise.mock} value={answer.value} />
      <Slider minValue={exercise.min} maxValue={exercise.max} step={exercise.step} value={answer.value} isDisabled={!!result}
        onChange={v => onChange({ type: 'tune', value: v as number })} className="flex flex-col gap-3">
        <div className="flex justify-between text-sm">
          <Label className="font-medium text-secondary">Adjust</Label>
          <output className="font-mono text-primary tabular-nums">{fmt(answer.value)}</output>
        </div>
        <SliderTrack className="relative h-6 w-full">
          {({ state }) => (
            <>
              <div className="absolute top-1/2 h-2 w-full -translate-y-1/2 rounded-full bg-secondary" />
              {result && (
                <div className="absolute top-1/2 h-2 -translate-y-1/2 rounded-full bg-mint-200"
                  style={{ left: `${((exercise.target[0] - exercise.min) / (exercise.max - exercise.min)) * 100}%`, width: `${((exercise.target[1] - exercise.target[0]) / (exercise.max - exercise.min)) * 100}%` }} />
              )}
              <div className="absolute top-1/2 h-2 -translate-y-1/2 rounded-full bg-brand-solid" style={{ width: `${state.getThumbPercent(0) * 100}%` }} />
              <SliderThumb className={({ isFocusVisible, isDragging }) => cx('top-1/2 size-6 rounded-full bg-primary shadow-md ring-2 ring-brand-solid transition-transform',
                isDragging && 'scale-110', isFocusVisible && 'outline-2 outline-offset-2 outline-brand-solid')} />
            </>
          )}
        </SliderTrack>
      </Slider>
      {result && !result.correct && <p className="text-sm text-secondary">The sweet spot is {fmt(exercise.target[0])} to {fmt(exercise.target[1])} (shown in mint).</p>}
    </div>
  );
}
