// Chapter ld.2 · Career & portfolio. Draft by Claude, for review.
import type { LessonContent } from '../schema';

export const ld2: LessonContent[] = [
  {
    id: 'ld.2-1', title: 'Case study structure', minutes: 4,
    steps: [
      { type: 'concept', id: 'c1', title: 'A story, not a gallery',
        body: ['A good case study tells the story of a problem you solved: the context and your role, the process and key decisions, the solution, and the outcome. Hiring managers read it to see how you think.',
          'Lead with a one-line summary and the result. Many reviewers spend under a minute per portfolio, so the shape must be obvious at a glance.'] },
      { type: 'order', id: 'o1', prompt: 'Put the parts of a case study in order.',
        explanation: 'Context and role, then process, solution, outcome, and what you learned.',
        items: [
          { id: 'a', label: 'Context: the problem and your role' },
          { id: 'b', label: 'Process: research and key decisions' },
          { id: 'c', label: 'Solution: what you designed and why' },
          { id: 'd', label: 'Outcome: what changed, with numbers if you have them' },
          { id: 'e', label: 'Learnings: what you’d do differently' },
        ] },
      { type: 'pick', id: 'p1', prompt: 'What should the first lines of a case study say?',
        explanation: 'A one-line summary of the problem, your role and the outcome lets a busy reader decide to keep going.',
        options: [
          { id: 'a', label: 'Your life story' },
          { id: 'b', label: 'A summary: the problem, your role and the result' },
          { id: 'c', label: 'A list of tools you used' },
          { id: 'd', label: 'Nothing, start with screens' },
        ], correct: 'b' },
    ],
  },
  {
    id: 'ld.2-2', title: 'Portfolio critique', minutes: 4,
    steps: [
      { type: 'concept', id: 'c1', title: 'Show your thinking',
        body: ['Strong portfolios show decisions, not just pixels: what the problem was, what you tried, why you chose one direction, and what happened.',
          'Weak ones are galleries of polished screens with vague words like “clean” and “modern”, no role, and no outcome. Honest trade-offs and mistakes make you more credible, not less.'] },
      { type: 'sort', id: 's1', prompt: 'Strong or weak?',
        explanation: 'Strong lines name a problem, a decision or a result. Weak lines are vague or only about looks.',
        buckets: [{ id: 'weak', label: 'Weak' }, { id: 'strong', label: 'Strong' }],
        items: [
          { id: 'a', label: '“I made the app look modern and clean.”', bucket: 'weak' },
          { id: 'b', label: '“Payment drop-off fell from 38% to 21%.”', bucket: 'strong' },
          { id: 'c', label: '“Here are all 40 screens.”', bucket: 'weak' },
          { id: 'd', label: '“We cut saved addresses to ship on time; it came back in v2.”', bucket: 'strong' },
        ] },
      { type: 'pick', id: 'p1', prompt: 'You worked on a team project. How should the case study describe your part?',
        explanation: 'Be specific about what you did versus the team. Reviewers want to know your contribution.',
        options: [
          { id: 'a', label: '“I designed everything.”' },
          { id: 'b', label: 'Say exactly what you owned and who you worked with' },
          { id: 'c', label: 'Don’t mention the team' },
          { id: 'd', label: 'Only show the final screens' },
        ], correct: 'b' },
    ],
  },
  {
    id: 'ld.2-3', title: 'Interviews & whiteboard challenges', minutes: 4,
    steps: [
      { type: 'concept', id: 'c1', title: 'They’re watching how you think',
        body: ['In a whiteboard challenge you get a vague prompt (“design a parking app”) and 45 minutes. The interviewer cares more about your process than your final sketch.',
          'A reliable shape: clarify the brief, define the user and their goal, explore a few ideas and pick one, then say how you’d measure success and what you traded off. Think out loud the whole time.'] },
      { type: 'order', id: 'o1', prompt: 'Put the steps of a whiteboard challenge in order.',
        explanation: 'Clarify, users and goals, ideas and a choice, then measures and trade-offs.',
        items: [
          { id: 'a', label: 'Clarify the brief with questions' },
          { id: 'b', label: 'Define the user and their goal' },
          { id: 'c', label: 'Sketch a few ideas, then pick one' },
          { id: 'd', label: 'Say how you’d measure success and the trade-offs' },
        ] },
      { type: 'pick', id: 'p1', prompt: 'The prompt is “Design an app for parking.” What’s the best first move?',
        explanation: 'Asking who it’s for and what problem matters most shapes everything after.',
        options: [
          { id: 'a', label: 'Start drawing screens immediately' },
          { id: 'b', label: 'Ask clarifying questions: who, where, which problem' },
          { id: 'c', label: 'Pick colours' },
          { id: 'd', label: 'Say you need a week' },
        ], correct: 'b' },
    ],
  },
];
