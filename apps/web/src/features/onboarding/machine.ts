// The onboarding story as a state machine: one state per scene, answers as events.
// Making every transition explicit is what keeps Back, resume and the 3D camera in sync.
import { assign, setup } from 'xstate';
import type { DomainId } from '@shape/engine';
import { JOURNEY, quizSkills, type Answers } from './profile';

export interface OnboardingContext extends Answers {
  skillIndex: number;      // position in JOURNEY while on the road
  quizIds: DomainId[];     // the three skills the quick check asks about
  quizIndex: number;
  storyMode: boolean;      // false = "skip story": plain panels, no 3D
}

export type OnboardingEvent =
  | { type: 'NEXT' }
  | { type: 'BACK' }
  | { type: 'SET'; patch: Partial<Answers> }
  | { type: 'RATE'; level: number }
  | { type: 'QUIZ_ANSWERED'; correct: boolean }
  | { type: 'TOGGLE_STORY' }
  | { type: 'RESTART' };

export const initialContext: OnboardingContext = {
  name: '', aspiration: null, role: null, roleText: '', years: null, interests: [], ratings: {}, quizResults: {},
  minutesPerDay: 20, fromZero: false, skillIndex: 0, quizIds: [], quizIndex: 0, storyMode: true,
};

export const onboardingMachine = setup({
  types: { context: {} as OnboardingContext, events: {} as OnboardingEvent },
  guards: {
    hasAspiration: ({ context }) => !!context.aspiration,
    hasRole: ({ context }) => !!context.roleText.trim(),
    hasInterests: ({ context }) => context.interests.length > 0,
    isLastSkill: ({ context }) => context.skillIndex >= JOURNEY.length - 1,
    isFirstSkill: ({ context }) => context.skillIndex === 0,
    isLastQuiz: ({ context }) => context.quizIndex >= context.quizIds.length - 1,
    isFirstQuiz: ({ context }) => context.quizIndex === 0,
  },
  actions: {
    patch: assign(({ context, event }) => (event.type === 'SET' ? { ...context, ...event.patch } : context)),
    rate: assign({
      ratings: ({ context, event }) => (event.type === 'RATE' ? { ...context.ratings, [JOURNEY[context.skillIndex]]: event.level } : context.ratings),
    }),
    nextSkill: assign({ skillIndex: ({ context }) => Math.min(JOURNEY.length - 1, context.skillIndex + 1) }),
    prevSkill: assign({ skillIndex: ({ context }) => Math.max(0, context.skillIndex - 1) }),
    lastSkill: assign({ skillIndex: JOURNEY.length - 1 }),
    pickQuiz: assign({ quizIds: ({ context }) => quizSkills(context.ratings), quizIndex: 0 }),
    recordQuiz: assign({
      quizResults: ({ context, event }) => (event.type === 'QUIZ_ANSWERED'
        ? { ...context.quizResults, [context.quizIds[context.quizIndex]]: event.correct } : context.quizResults),
    }),
    nextQuiz: assign({ quizIndex: ({ context }) => context.quizIndex + 1 }),
    prevQuiz: assign({ quizIndex: ({ context }) => Math.max(0, context.quizIndex - 1) }),
    toggleStory: assign({ storyMode: ({ context }) => !context.storyMode }),
    reset: assign(({ context }) => ({ ...initialContext, storyMode: context.storyMode })),
  },
}).createMachine({
  id: 'onboarding',
  context: initialContext,
  initial: 'arrival',
  on: {
    SET: { actions: 'patch' },
    TOGGLE_STORY: { actions: 'toggleStory' },
    RESTART: { target: '.arrival', actions: 'reset' },
  },
  states: {
    arrival: { on: { NEXT: 'dream' } },
    dream: { on: { NEXT: { target: 'today', guard: 'hasAspiration' }, BACK: 'arrival' } },
    today: {
      on: {
        NEXT: [
          { target: 'interests', guard: ({ context }) => !!context.roleText.trim() && context.aspiration === 'explore' },
          { target: 'journey', guard: 'hasRole' },
        ],
        BACK: 'dream',
      },
    },
    interests: { on: { NEXT: { target: 'journey', guard: 'hasInterests' }, BACK: 'today' } },
    journey: {
      on: {
        RATE: [
          { guard: 'isLastSkill', actions: ['rate', 'pickQuiz'], target: 'check' },
          { actions: ['rate', 'nextSkill'] },
        ],
        BACK: [
          { guard: ({ context }) => context.skillIndex === 0 && context.aspiration === 'explore', target: 'interests' },
          { guard: 'isFirstSkill', target: 'today' },
          { actions: 'prevSkill' },
        ],
      },
    },
    check: {
      on: {
        QUIZ_ANSWERED: [
          { guard: 'isLastQuiz', actions: 'recordQuiz', target: 'profile' },
          { actions: ['recordQuiz', 'nextQuiz'] },
        ],
        BACK: [
          { guard: 'isFirstQuiz', target: 'journey', actions: 'lastSkill' },
          { actions: 'prevQuiz' },
        ],
      },
    },
    profile: { on: { NEXT: 'future', BACK: { target: 'check', actions: assign({ quizIndex: ({ context }) => Math.max(0, context.quizIds.length - 1) }) } } },
    future: { on: { NEXT: 'road', BACK: 'profile' } },
    road: { on: { NEXT: 'pricing', BACK: 'future' } },
    pricing: { on: { NEXT: 'done', BACK: 'road' } },
    done: { type: 'final' },
  },
});

export type Scene = 'arrival' | 'dream' | 'today' | 'interests' | 'journey' | 'check' | 'profile' | 'future' | 'road' | 'pricing' | 'done';

/** 0–1 progress for the top bar. */
export function progressOf(scene: Scene, ctx: OnboardingContext): number {
  const order: Record<Scene, number> = { arrival: 0, dream: 1, today: 2, interests: 3, journey: 3, check: 17, profile: 20, future: 21, road: 22, pricing: 23, done: 24 };
  const extra = scene === 'journey' ? ctx.skillIndex : scene === 'check' ? ctx.quizIndex : 0;
  return Math.min(1, (order[scene] + extra) / 24);
}
