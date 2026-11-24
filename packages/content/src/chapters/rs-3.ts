// Chapter rs.3 · Synthesis. Draft by Claude, for review.
import type { LessonContent } from '../schema';

export const rs3: LessonContent[] = [
  {
    id: 'rs.3-1', title: 'Affinity mapping', minutes: 4,
    steps: [
      { type: 'concept', id: 'c1', title: 'Let the notes find their groups',
        body: ['After a round of interviews you have hundreds of notes. Affinity mapping puts one observation or quote on each sticky note, tagged with who said it, then groups notes that belong together. You build the groups from the notes upwards, not from a list of topics you wrote before the research.',
          'Name each group with a sentence a participant could have said: “I order for someone I can’t see”, not “Ordering”. A topic label hides the finding. Then count who is in each group: a theme seen in seven interviews is a finding, a theme from one loud person is a lead to check.'] },
      { type: 'sort', id: 's1', prompt: 'Notes from 12 interviews about medicine refills. Which group does each belong to?',
        explanation: 'Group by what the notes mean, not by the words they share. Both groups mix people, places and moments.',
        buckets: [{ id: 'far', label: '“I order for someone I can’t see”' }, { id: 'swap', label: '“A different strip looks like the wrong medicine”' }],
        items: [
          { id: 'a', label: 'P3: “I only find out she’s run out when she calls me at work.”', bucket: 'far' },
          { id: 'b', label: 'P7: refused tablets that came in a blue strip instead of the usual white one', bucket: 'swap' },
          { id: 'c', label: 'P5 orders his father’s insulin from Dubai through a cousin in Lucknow', bucket: 'far' },
          { id: 'd', label: 'P9: “The chemist said it’s the same salt. My mother still wouldn’t take it.”', bucket: 'swap' },
          { id: 'e', label: 'P11 keeps a photo of her parents’ medicine shelf to check what’s left', bucket: 'far' },
          { id: 'f', label: 'P2 calls his son to read out the brand name before swallowing anything new', bucket: 'swap' },
        ] },
      { type: 'pick', id: 'p1', prompt: 'Which is the best label for a group of notes?',
        explanation: 'A sentence in the user’s voice says what the group found. A topic word only says what it’s about.',
        options: [
          { id: 'a', label: 'Prescriptions' },
          { id: 'b', label: '“The latest prescription is somewhere in WhatsApp”' },
          { id: 'c', label: 'Misc' },
          { id: 'd', label: 'Pain points' },
        ], correct: 'b' },
    ],
  },
  {
    id: 'rs.3-2', title: 'From observation to insight', minutes: 4,
    steps: [
      { type: 'concept', id: 'c1', title: 'Observation, then why',
        body: ['An observation is what you saw or heard: “Seven of twelve people order medicines for a parent in another city.” It is true, but it doesn’t tell the team what to do.',
          'An insight explains why it happens and where the tension is: “The person who orders can’t see the strip running low, so every refill starts with a worried phone call.” Write it as who, what they do, and because. If it names a feature (“users want reminders”), you have skipped the why and jumped to a solution.'] },
      { type: 'sort', id: 's1', prompt: 'Observation or insight?',
        explanation: 'Observations report what happened. Insights add the reason behind it, and that reason is what a design can work on.',
        buckets: [{ id: 'obs', label: 'Observation' }, { id: 'ins', label: 'Insight' }],
        items: [
          { id: 'a', label: 'Five people keep prescription photos in WhatsApp chats', bucket: 'obs' },
          { id: 'b', label: 'Parents refuse substitute brands because the strip’s colour is how they tell their tablets apart', bucket: 'ins' },
          { id: 'c', label: 'P4 paid the delivery agent in cash although she had paid online', bucket: 'obs' },
          { id: 'd', label: 'Children reorder late because the only signal that stock is low is a call from the parent', bucket: 'ins' },
          { id: 'e', label: 'Most orders arrive between 7 and 9 pm', bucket: 'obs' },
        ] },
      { type: 'pick', id: 'p1', prompt: 'A teammate writes: “Insight: users want refill reminders.” What’s wrong with it?',
        explanation: 'It names a solution. Ask why people would want it, and the answer is the insight.',
        options: [
          { id: 'a', label: 'Nothing, it’s clear' },
          { id: 'b', label: 'It’s too short' },
          { id: 'c', label: 'It’s a feature dressed as an insight: it skips who and why' },
          { id: 'd', label: 'It should be in capital letters' },
        ], correct: 'c' },
    ],
  },
  {
    id: 'rs.3-3', title: 'Personas vs. JTBD vs. archetypes', minutes: 4,
    steps: [
      { type: 'concept', id: 'c1', title: 'Three tools, three questions',
        body: ['A persona is one research-based person, with context, goals and frustrations: a shared picture so a whole team designs for the same human. Its weakness is fake detail. A favourite cricket team or a car model changes no decision, so leave it out.',
          'A job story (Jobs-to-be-Done) is a situation, a motivation and an outcome: “When my mother’s tablets are about to run out and I’m 200 km away, I want to know before she does, so I’m not ordering in a panic.” Archetypes group people by behaviour, not age or city: the remote organiser, the self-manager, the local helper. Pick the tool by the question you need answered.'] },
      { type: 'sort', id: 's1', prompt: 'Which tool answers the team’s question best?',
        explanation: 'Personas build shared empathy for one person. Jobs explain the progress wanted and what you compete with. Archetypes show how behaviour differs across people.',
        buckets: [{ id: 'persona', label: 'Persona' }, { id: 'job', label: 'Job story' }, { id: 'arch', label: 'Archetypes' }],
        items: [
          { id: 'a', label: '“Why do people stick with the local chemist instead of us?”', bucket: 'job' },
          { id: 'b', label: '“Do we design for people who manage their own medicines or for those who manage someone else’s?”', bucket: 'arch' },
          { id: 'c', label: '“New engineers keep asking who our user is. What do we show them?”', bucket: 'persona' },
          { id: 'd', label: '“What does ‘done’ look like for someone refilling a parent’s tablets?”', bucket: 'job' },
          { id: 'e', label: '“Are 70-year-olds who order for themselves a separate group from 30-year-olds who do?”', bucket: 'arch' },
        ] },
      { type: 'pick', id: 'p1', prompt: 'Which detail belongs in a persona?',
        explanation: 'Keep details that change a design decision. Distance from the parent changes how a refill works; hobbies don’t.',
        options: [
          { id: 'a', label: 'Supports Mumbai Indians' },
          { id: 'b', label: 'Lives in Pune; her mother lives alone in Nashik' },
          { id: 'c', label: 'Favourite colour is green' },
          { id: 'd', label: 'Drives a Hyundai i20' },
        ], correct: 'b' },
    ],
  },
  {
    id: 'rs.3-4', title: 'Journey maps that drive decisions', minutes: 4,
    steps: [
      { type: 'concept', id: 'c1', title: 'A map is for choosing',
        body: ['A journey map lays out the stages someone goes through, what they do and feel at each one, and the evidence behind it. A map that’s only nicely drawn gets admired and then filed away. A useful one is built from research, not guesses, and points to where to act.',
          'Plot how people feel at each stage from what they said and did, and mark the lowest point. That is usually the first thing to fix, and it is often not where the team expected. Add who owns each stage and one opportunity per low point, so the map ends in a decision.'] },
      { type: 'order', id: 'o1', prompt: 'Put the stages of a remote medicine refill in order.',
        explanation: 'Noticing stock is low starts the journey; checking the delivery ends it.',
        items: [
          { id: 'a', label: 'Notice the tablets are running low' },
          { id: 'b', label: 'Find the latest prescription' },
          { id: 'c', label: 'Order and pay' },
          { id: 'd', label: 'Wait for the delivery' },
          { id: 'e', label: 'Receive and check the strips' },
        ] },
      { type: 'pick', id: 'p1', prompt: 'The team wants to redesign checkout. The journey map shows checkout as the one stage people feel fine about, and the lowest point at “Notice it’s running low”. What should the map change?',
        explanation: 'A map earns its keep when it moves effort to where people struggle, even if that wasn’t the plan.',
        options: [
          { id: 'a', label: 'Nothing: the roadmap is already set' },
          { id: 'b', label: 'Redraw the map so checkout looks worse' },
          { id: 'c', label: 'Move the effort to the low point, and share the evidence for it' },
          { id: 'd', label: 'Fix every stage at once' },
        ], correct: 'c' },
    ],
  },
];
