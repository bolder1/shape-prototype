'use client';
import { useState, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowRightIcon, BookOpenIcon, BriefcaseIcon, ChalkboardTeacherIcon, CodeIcon, CursorClickIcon, FilmSlateIcon, HandshakeIcon,
  LockIcon, MagnifyingGlassIcon, MegaphoneIcon, PaintBrushIcon, PaletteIcon, PlantIcon, SparkleIcon, StrategyIcon,
  TreeStructureIcon, UserIcon,
} from '@phosphor-icons/react/ssr';
import { springs } from '@shape/ui';
import { Button } from '@/components/base/buttons/button';
import { Badge, BadgeWithDot } from '@/components/base/badges/badges';
import { Input } from '@/components/base/input/input';
import { Select } from '@/components/base/select/select';
import { SelectItem } from '@/components/base/select/select-item';
import { Toggle } from '@/components/base/toggle/toggle';
import { Tab, TabList, TabPanel, Tabs } from '@/components/application/tabs/tabs';
import { ChoiceCards } from '@/components/inputs/ChoiceCards';
import { ChipSelect } from '@/components/inputs/ChipSelect';
import { Segmented } from '@/components/inputs/Segmented';
import { RoleField } from '@/components/inputs/RoleField';

const LEVELS = [
  { value: '0', label: 'Not yet', description: "I haven't tried this", icon: PlantIcon },
  { value: '1', label: 'Aware', description: "I've read or watched about it", icon: BookOpenIcon },
  { value: '3', label: 'Practitioner', description: 'I do this in my work', icon: BriefcaseIcon },
  { value: '5', label: 'Expert', description: 'I could teach this', icon: ChalkboardTeacherIcon },
];
const ROLES = [
  { id: 'ui-designer', label: 'UI / visual designer', supportingText: 'Design', icon: PaletteIcon },
  { id: 'ux-designer', label: 'UX designer', supportingText: 'Design', icon: TreeStructureIcon },
  { id: 'product-designer', label: 'Product designer', supportingText: 'Design', icon: CursorClickIcon },
  { id: 'researcher', label: 'UX researcher', supportingText: 'Design', icon: MagnifyingGlassIcon },
  { id: 'graphic-designer', label: 'Graphic designer', supportingText: 'Neighbouring craft', icon: PaintBrushIcon },
  { id: 'motion-designer', label: 'Motion designer', supportingText: 'Neighbouring craft', icon: FilmSlateIcon },
  { id: 'frontend-engineer', label: 'Front-end engineer', supportingText: 'Neighbouring craft', icon: CodeIcon },
  { id: 'marketer', label: 'Marketing', supportingText: 'Neighbouring craft', icon: MegaphoneIcon },
  { id: 'sales', label: 'Sales or customer success', supportingText: 'Neighbouring craft', icon: HandshakeIcon },
  { id: 'product-manager', label: 'Product manager', supportingText: 'Neighbouring craft', icon: StrategyIcon },
  { id: 'student', label: 'Student or switching careers', supportingText: 'Starting out', icon: UserIcon },
];
const YEARS = [
  { id: '0', label: 'Just starting' }, { id: '1', label: 'Less than a year' }, { id: '2', label: '1–3 years' },
  { id: '5', label: '3–7 years' }, { id: '8', label: '7+ years' },
];
const PACE = [
  { value: '10', label: 'Casual', hint: '10 min/day' }, { value: '20', label: 'Regular', hint: '20 min/day' },
  { value: '30', label: 'Serious', hint: '30 min/day' }, { value: '60', label: 'Intense', hint: '1 h/day' },
];
const INTERESTS = [
  { value: 'rs', label: 'Understanding people' }, { value: 'ui', label: 'Beautiful screens' },
  { value: 'pr', label: 'Motion and interaction' }, { value: 'cw', label: 'Words and tone' },
  { value: 'gr', label: 'Growing a product' }, { value: 'st', label: 'Deciding what to build' },
  { value: 'dc', label: 'Building with code' },
];

function Field({ q, input, why, children }: { q: string; input: string; why: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-3 rounded-xl bg-primary p-5 shadow-xs ring-1 ring-secondary ring-inset">
      <div className="flex items-start justify-between gap-3">
        <p className="text-md font-semibold text-primary">{q}</p>
        <Badge type="modern" color="gray" size="sm">{input}</Badge>
      </div>
      {children}
      <p className="text-sm text-tertiary">{why}</p>
    </div>
  );
}

export function KitInteractive() {
  const [role, setRole] = useState('');
  const [level, setLevel] = useState<string>();
  const [pace, setPace] = useState<string>();
  const [interests, setInterests] = useState<string[]>([]);
  const [sound, setSound] = useState(false);
  const [shown, setShown] = useState(true);

  return (
    <>
      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold text-primary">Buttons and badges</h2>
        <div className="flex flex-wrap items-center gap-3">
          <Button size="lg" iconTrailing={ArrowRightIcon}>Continue</Button>
          <Button size="lg" color="secondary" iconLeading={SparkleIcon}>See your future self</Button>
          <Button size="lg" color="tertiary">Skip</Button>
          <Button size="lg" color="link-gray">Back</Button>
          <Button size="lg" isDisabled iconLeading={LockIcon}>Locked</Button>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge type="pill-color" color="brand" size="md">Practitioner</Badge>
          <Badge type="modern" color="gray" size="md">4 lessons · 20 min</Badge>
          <BadgeWithDot type="pill-color" color="success" size="md">On track</BadgeWithDot>
          <span className="inline-flex items-center rounded-full bg-mint-50 px-2.5 py-0.5 text-sm font-medium text-mint-700 ring-1 ring-mint-200 ring-inset">+120 XP</span>
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <div>
          <h2 className="text-lg font-semibold text-primary">Inputs: the right control for each question</h2>
          <p className="text-sm text-tertiary">Never one generic control. Each card shows the real onboarding question it answers.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Field q="What should we call you?" input="Text" why="Free text with a visible label. Optional, so there's always a skip.">
            <Input label="First name" placeholder="Priya" size="md" />
          </Field>
          <Field q="What do you do today?" input="Type + list" why="Long list: type to filter. If your role isn't listed, what you type is kept.">
            <RoleField label="Your current role" placeholder="Search or type your role" options={ROLES}
              hint={role ? `Saved as: ${role}` : 'Not listed? Just type it.'} onChange={v => setRole(v.text)} />
          </Field>
          <Field q="How long have you been doing it?" input="Dropdown" why="Short, known list where typing adds nothing.">
            <Select label="Years of experience" placeholder="Select" items={YEARS}>
              {item => <SelectItem id={item.id} label={item.label} />}
            </Select>
          </Field>
          <Field q="How much time can you give each day?" input="Segmented" why="2–5 ordered options that fit on one line.">
            <Segmented label="Daily time" segments={PACE} value={pace} onChange={setPace} />
          </Field>
          <div className="md:col-span-2">
            <Field q="Which of these sound fun? Pick up to 2." input="Chips" why="Several picks from a medium list. A third pick replaces the oldest, so you never get stuck.">
              <ChipSelect label="Interests" chips={INTERESTS} value={interests} onChange={setInterests} max={2} />
            </Field>
          </div>
          <div className="md:col-span-2">
            <Field q="User research: how much have you done this?" input="Cards" why="The core question, asked 14 times: big targets, a description per option, arrow keys work.">
              <ChoiceCards label="Your level in user research" hideLabel choices={LEVELS} value={level} onChange={setLevel} columns={4} />
            </Field>
          </div>
          <Field q="Play sounds?" input="Toggle" why="A single on/off setting.">
            <Toggle label="Sound effects" hint="Soft ticks and a chime on completion" isSelected={sound} onChange={setSound} size="md" />
          </Field>
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold text-primary">Tabs</h2>
        <Tabs>
          <TabList type="button-border" items={[{ id: 'path', label: 'Your path' }, { id: 'map', label: 'Skill map' }, { id: 'league', label: 'League' }]}>
            {tab => <Tab {...tab} />}
          </TabList>
          <TabPanel id="path" className="pt-3 text-sm text-tertiary">Your next 5 chapters.</TabPanel>
          <TabPanel id="map" className="pt-3 text-sm text-tertiary">All 60 chapters and how they connect.</TabPanel>
          <TabPanel id="league" className="pt-3 text-sm text-tertiary">This week&apos;s standings.</TabPanel>
        </Tabs>
      </section>

      <section className="flex flex-col gap-4">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-primary">Spring presets</h2>
            <p className="text-sm text-tertiary">From <code className="font-mono text-xs">packages/ui/src/motion.ts</code>. Toggle to replay.</p>
          </div>
          <Button color="secondary" onClick={() => setShown(s => !s)}>{shown ? 'Hide' : 'Show'}</Button>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {(['press', 'pop', 'gentle'] as const).map(n => (
            <div key={n} className="flex h-32 flex-col items-center justify-end gap-2 rounded-xl bg-primary p-3 ring-1 ring-secondary ring-inset">
              <AnimatePresence>
                {shown && (
                  <motion.div key={n} initial={{ y: -48, scale: 0.5, opacity: 0 }} animate={{ y: 0, scale: 1, opacity: 1 }}
                    exit={{ y: -48, scale: 0.5, opacity: 0 }} transition={springs[n]} className="size-11 rounded-lg bg-brand-solid" />
                )}
              </AnimatePresence>
              <span className="font-mono text-xs text-tertiary">{n}</span>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
