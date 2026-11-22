// Chapter st.1 · Product thinking. Draft by Claude, for review.
import type { LessonContent } from '../schema';

export const st1: LessonContent[] = [
  {
    id: 'st.1-1', title: 'Problem → outcome → output', minutes: 4,
    steps: [
      { type: 'concept', id: 'c1', title: 'Shipping isn’t winning',
        body: ['An output is something you build: a button, a page, a feature. An outcome is a change in what people do: more orders, fewer drop-offs.',
          'Good teams start from a real problem, agree the outcome they want, and only then choose outputs that might get them there.'] },
      { type: 'sort', id: 's1', prompt: 'Problem, outcome or output?',
        explanation: 'Problems are people’s struggles. Outcomes are measurable changes in behaviour. Outputs are things the team builds.',
        buckets: [{ id: 'p', label: 'Problem' }, { id: 'o', label: 'Outcome' }, { id: 'x', label: 'Output' }],
        items: [
          { id: 'a', label: 'People forget to reorder their usual lunch', bucket: 'p' },
          { id: 'b', label: 'Weekly orders per customer go from 1.2 to 1.6', bucket: 'o' },
          { id: 'c', label: 'A one-tap reorder button', bucket: 'x' },
          { id: 'd', label: 'Checkout feels risky on unfamiliar sites', bucket: 'p' },
          { id: 'e', label: 'Payment drop-off falls from 40% to 25%', bucket: 'o' },
          { id: 'f', label: 'A new onboarding carousel', bucket: 'x' },
        ] },
      { type: 'pick', id: 'p1', prompt: 'The team shipped 12 features this quarter, but weekly orders didn’t move. What went wrong?',
        explanation: 'They measured success by outputs shipped, not by the outcome. Busy isn’t the same as effective.',
        options: [
          { id: 'a', label: 'They should have shipped 20 features' },
          { id: 'b', label: 'They chased outputs without tying them to an outcome' },
          { id: 'c', label: 'The features were the wrong colour' },
          { id: 'd', label: 'Nothing, shipping is the goal' },
        ], correct: 'b' },
    ],
  },
  {
    id: 'st.1-2', title: 'Opportunity solution trees', minutes: 4,
    steps: [
      { type: 'concept', id: 'c1', title: 'From outcome to experiments',
        body: ['An opportunity solution tree starts with one outcome at the top. Below it sit opportunities: unmet needs and pains found in research.',
          'Under each opportunity go possible solutions, and under each solution, small experiments to test it. It stops teams jumping straight to one idea.'] },
      { type: 'order', id: 'o1', prompt: 'Put the levels of the tree in order, top to bottom.',
        explanation: 'Outcome first, then the opportunities that could move it, then solutions for an opportunity, then experiments to test a solution.',
        items: [
          { id: 'a', label: 'Outcome: more weekly orders' },
          { id: 'b', label: 'Opportunity: “I forget to reorder”' },
          { id: 'c', label: 'Solution: one-tap reorder' },
          { id: 'd', label: 'Experiment: fake-door button for 5% of users' },
        ] },
      { type: 'pick', id: 'p1', prompt: 'Where do opportunities come from?',
        explanation: 'Opportunities are customer needs and pains, so they come from talking to and watching customers.',
        options: [
          { id: 'a', label: 'The competitor’s feature list' },
          { id: 'b', label: 'Research with customers: interviews, observation, data' },
          { id: 'c', label: 'The CEO’s favourite ideas' },
          { id: 'd', label: 'Random brainstorming' },
        ], correct: 'b' },
    ],
  },
  {
    id: 'st.1-3', title: 'Prioritization (RICE, Kano)', minutes: 5,
    steps: [
      { type: 'concept', id: 'c1', title: 'Score, don’t shout',
        body: ['RICE scores an idea by Reach × Impact × Confidence ÷ Effort. It turns “I think this matters” into numbers you can compare and argue about.',
          'Kano sorts features by how they make people feel: basics (expected, only noticed when missing), performance (more is better) and delighters (unexpected joy).'] },
      { type: 'pick', id: 'p1', prompt: 'Reach 1,000 users, impact 2, confidence 50%, effort 2 weeks. What’s the RICE score?',
        explanation: '1,000 × 2 × 0.5 ÷ 2 = 500.',
        options: [
          { id: 'a', label: '250' },
          { id: 'b', label: '500' },
          { id: 'c', label: '1,000' },
          { id: 'd', label: '2,000' },
        ], correct: 'b' },
      { type: 'sort', id: 's1', prompt: 'Kano: basic or delighter?',
        explanation: 'Basics are expected and only noticed when missing. Delighters are unexpected extras.',
        buckets: [{ id: 'b', label: 'Basic' }, { id: 'd', label: 'Delighter' }],
        items: [
          { id: 'a', label: 'The payment actually goes through', bucket: 'b' },
          { id: 'b', label: 'A birthday treat in your order', bucket: 'd' },
          { id: 'c', label: 'You can log in', bucket: 'b' },
          { id: 'd', label: 'The app remembers your spice level', bucket: 'd' },
        ] },
    ],
  },
];
