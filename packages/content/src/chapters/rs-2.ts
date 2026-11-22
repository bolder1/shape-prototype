// Chapter rs.2 · Interviews & observation. Draft by Claude, for review.
import type { LessonContent } from '../schema';

export const rs2: LessonContent[] = [
  {
    id: 'rs.2-1', title: 'Interview script anatomy', minutes: 4,
    steps: [
      { type: 'concept', id: 'c1', title: 'A shape, not a questionnaire',
        body: ['A good interview script has a shape: an intro that sets people at ease, a warm-up about their life, broad questions about the topic, then a deep dive into specific stories, and a wrap-up.',
          'Go from broad to narrow. If you start with your product, people talk about your product instead of their lives.'] },
      { type: 'order', id: 'o1', prompt: 'Put the parts of the script in order.',
        explanation: 'Intro and consent, warm-up, broad context, specific stories, then wrap-up and thanks.',
        items: [
          { id: 'a', label: 'Intro: who you are, how long, no wrong answers, consent to record' },
          { id: 'b', label: 'Warm-up: their work and a typical day' },
          { id: 'c', label: 'Broad: how they handle money today' },
          { id: 'd', label: 'Deep dive: the last time a payment went wrong' },
          { id: 'e', label: 'Wrap-up: anything we missed? Thanks' },
        ] },
      { type: 'pick', id: 'p1', prompt: 'Why ask about their day before the topic?',
        explanation: 'Easy questions build trust and give you context, so later answers are more honest and make more sense.',
        options: [
          { id: 'a', label: 'To fill time' },
          { id: 'b', label: 'It builds trust and gives context for later answers' },
          { id: 'c', label: 'It’s required by law' },
          { id: 'd', label: 'To test the recorder' },
        ], correct: 'b' },
    ],
  },
  {
    id: 'rs.2-2', title: 'Leading vs. open questions', minutes: 4,
    steps: [
      { type: 'concept', id: 'c1', title: 'Open doors, then follow them',
        body: ['Open questions (“Tell me about…”, “Walk me through…”) invite stories. Closed ones (“Do you…?”) get a yes or no and stop.',
          'The best material comes from follow-ups: “Tell me more”, “Why was that?”, and simply staying quiet for a few seconds.'] },
      { type: 'sort', id: 's1', prompt: 'Opens up or closes down?',
        explanation: 'Open questions ask for stories and reasons. Closed or leading ones get a word, or the answer you suggested.',
        buckets: [{ id: 'o', label: 'Opens up' }, { id: 'c', label: 'Closes down' }],
        items: [
          { id: 'a', label: 'Walk me through the last time you paid rent.', bucket: 'o' },
          { id: 'b', label: 'Do you use UPI?', bucket: 'c' },
          { id: 'c', label: 'What happened next?', bucket: 'o' },
          { id: 'd', label: 'That must have been frustrating, right?', bucket: 'c' },
          { id: 'e', label: 'Why was that important to you?', bucket: 'o' },
          { id: 'f', label: 'Would you say it was easy?', bucket: 'c' },
        ] },
      { type: 'pick', id: 'p1', prompt: 'A participant says, “I just gave up on it.” Best follow-up?',
        explanation: 'It asks for the story behind the moment without suggesting a reason.',
        options: [
          { id: 'a', label: '“Because it was too slow?”' },
          { id: 'b', label: '“Tell me about the moment you gave up.”' },
          { id: 'c', label: '“OK, next question.”' },
          { id: 'd', label: '“Most people don’t give up.”' },
        ], correct: 'b' },
    ],
  },
  {
    id: 'rs.2-3', title: 'Jobs-to-be-Done interviews', minutes: 4,
    steps: [
      { type: 'concept', id: 'c1', title: 'People hire products for a job',
        body: ['Jobs-to-be-Done says people “hire” a product to make progress in a situation. The job stays the same even when products change.',
          'A JTBD interview reconstructs the story of one real switch: the first thought, looking around, deciding, and using it.'] },
      { type: 'pick', id: 'p1', prompt: 'Which is a job, not a feature request?',
        explanation: 'A job describes the situation and the progress wanted. The others name a solution.',
        options: [
          { id: 'a', label: '“Add a dark mode.”' },
          { id: 'b', label: '“When I’m stuck in back-to-back meetings, I want lunch to just arrive, so I don’t crash at 4 pm.”' },
          { id: 'c', label: '“Make the button bigger.”' },
          { id: 'd', label: '“Add more filters.”' },
        ], correct: 'b' },
      { type: 'order', id: 'o1', prompt: 'Put the moments of a switch in order.',
        explanation: 'First thought, passive looking, active looking, deciding, then using it for the first time.',
        items: [
          { id: 'a', label: 'First thought: “this isn’t working for me”' },
          { id: 'b', label: 'Passive looking: noticing alternatives' },
          { id: 'c', label: 'Active looking: comparing options' },
          { id: 'd', label: 'Deciding and paying' },
          { id: 'e', label: 'First use' },
        ] },
    ],
  },
  {
    id: 'rs.2-4', title: 'Contextual inquiry', minutes: 4,
    steps: [
      { type: 'concept', id: 'c1', title: 'Go where the work happens',
        body: ['People can’t tell you everything they do: habits and workarounds are invisible to them. In a contextual inquiry you watch people in their own place, doing real tasks.',
          'Act like an apprentice learning from a master: watch, ask “why did you do that?” in the moment, and notice the sticky notes and paper.'] },
      { type: 'pick', id: 'p1', prompt: 'A shop owner says, “I do everything in the app.” At the shop you see a paper ledger. What does that tell you?',
        explanation: 'What people say and what they do often differ. The ledger is a workaround worth asking about.',
        options: [
          { id: 'a', label: 'They lied' },
          { id: 'b', label: 'There’s a gap between what they say and do; ask why the ledger exists' },
          { id: 'c', label: 'Paper is old-fashioned, ignore it' },
          { id: 'd', label: 'The app is perfect' },
        ], correct: 'b' },
      { type: 'sort', id: 's1', prompt: 'Better found by asking or by watching?',
        explanation: 'Feelings, reasons and history need asking. Habits, workarounds and the environment need watching.',
        buckets: [{ id: 'ask', label: 'Asking' }, { id: 'watch', label: 'Watching' }],
        items: [
          { id: 'a', label: 'Why she switched banks last year', bucket: 'ask' },
          { id: 'b', label: 'The calculator he opens before every sale', bucket: 'watch' },
          { id: 'c', label: 'What worries her about lending apps', bucket: 'ask' },
          { id: 'd', label: 'Sticky notes with order numbers on the monitor', bucket: 'watch' },
        ] },
    ],
  },
];
