// Chapter fd.3 · Critique & feedback. Draft by Claude, for review.
import type { LessonContent } from '../schema';

export const fd3: LessonContent[] = [
  {
    id: 'fd.3-1', title: 'Separating taste from reasoning', minutes: 4,
    steps: [
      { type: 'concept', id: 'c1', title: '“I don’t like it” is about you',
        body: ['Taste is a preference: “I don’t love this purple”, “make it pop”, “feels off”. It tells you about the person speaking, not about whether the design works, and there is nothing in it a designer can act on.',
          'Reasoning ties what you see to its effect on a user and to the goal of the screen: “The cashback banner is bigger than the balance, but people open the app to check their balance.” When you hear taste, ask “What makes you say that?” until it becomes reasoning or turns out to be only preference.'] },
      { type: 'sort', id: 's1', prompt: 'A review of a payments app’s home screen. Taste or reasoning?',
        explanation: 'Reasoning names what is on the screen, what it does to the user, and the goal it helps or hurts. Taste stops at liking.',
        buckets: [{ id: 'taste', label: 'Taste' }, { id: 'reason', label: 'Reasoning' }],
        items: [
          { id: 'a', label: '“I’m not a fan of this purple.”', bucket: 'taste' },
          { id: 'b', label: '“Pay and Request look identical, so at a shop counter one wrong tap sends a request instead of money.”', bucket: 'reason' },
          { id: 'c', label: '“Make the buttons pop more.”', bucket: 'taste' },
          { id: 'd', label: '“The ₹10 fee is in light grey 11px text; people will miss it in sunlight.”', bucket: 'reason' },
          { id: 'e', label: '“Another app uses a bottom sheet, so we should too.”', bucket: 'taste' },
        ] },
      { type: 'pick', id: 'p1', prompt: 'Your manager says “It feels a bit off.” What’s the most useful reply?',
        explanation: 'A question turns a feeling into something you can act on, or shows it was only preference.',
        options: [
          { id: 'a', label: 'Change the colours until they’re happy' },
          { id: 'b', label: '“Where did your eye go first, and what were you expecting to see?”' },
          { id: 'c', label: 'Ignore it, since it’s only taste' },
          { id: 'd', label: 'Explain why your choices are right' },
        ], correct: 'b' },
    ],
  },
  {
    id: 'fd.3-2', title: 'The "I like / I wish / What if" frame', minutes: 4,
    steps: [
      { type: 'concept', id: 'c1', title: 'Three kinds of useful feedback',
        body: ['“I like” names something specific that works, so the designer knows what to keep. “I wish” names a problem from a user’s point of view, without dictating the fix. “What if” offers an idea the designer is free to take or leave.',
          'The frame works because it keeps feedback about the work and the people using it, not about the designer. “This checkout is confusing, redo it” becomes “I wish I’d seen the delivery slot before paying; the 7 am slot was gone by the time I found it.”'] },
      { type: 'sort', id: 's1', prompt: 'Feedback on a grocery app’s checkout. Which part of the frame is it?',
        explanation: 'I like: what to keep. I wish: a problem someone hit. What if: an idea, offered not ordered.',
        buckets: [{ id: 'like', label: 'I like' }, { id: 'wish', label: 'I wish' }, { id: 'whatif', label: 'What if' }],
        items: [
          { id: 'a', label: 'The total stays pinned above Pay, so I always knew what I’d spend', bucket: 'like' },
          { id: 'b', label: 'Out-of-stock items vanished with no message; I thought I’d ordered coriander', bucket: 'wish' },
          { id: 'c', label: 'The next three delivery slots could sit as chips right above Pay', bucket: 'whatif' },
          { id: 'd', label: 'The coupon field sent me off to hunt for codes before I’d paid', bucket: 'wish' },
          { id: 'e', label: 'Each item shows its weight next to the price, so comparing is easy', bucket: 'like' },
        ] },
      { type: 'pick', id: 'p1', prompt: 'Which is the best “I wish”?',
        explanation: 'A good wish describes the problem a user hit and why it matters. It leaves the solution to the designer.',
        options: [
          { id: 'a', label: '“I wish you’d make it better.”' },
          { id: 'b', label: '“I wish the button were orange.”' },
          { id: 'c', label: '“I wish I could tell which address the order was going to before I paid.”' },
          { id: 'd', label: '“I wish you were more careful.”' },
        ], correct: 'c' },
    ],
  },
  {
    id: 'fd.3-3', title: 'Receiving critique without defending', minutes: 4,
    steps: [
      { type: 'concept', id: 'c1', title: 'Listen, ask, log',
        body: ['When someone criticises your work, the reflex is to explain why they’re wrong: “But it’s right there under More options.” Every defence teaches the room to stop giving you feedback, and you lose what they saw.',
          'Instead: listen to the end, ask a question to understand (“Where did you expect it?”), say it back in your own words, and note it down. Decide what to do later, against the goal of the work. Share a fact they didn’t have only when it changes the picture, once, without arguing.'] },
      { type: 'sort', id: 's1', prompt: 'Someone says “I couldn’t find how to split a bill unevenly.” Helpful reply or defence?',
        explanation: 'Helpful replies try to understand what they saw. Defences try to prove they shouldn’t have seen it.',
        buckets: [{ id: 'help', label: 'Helpful' }, { id: 'defend', label: 'Defending' }],
        items: [
          { id: 'a', label: '“Where did you expect to find it?”', bucket: 'help' },
          { id: 'b', label: '“It’s under More options, it’s obvious.”', bucket: 'defend' },
          { id: 'c', label: '“So uneven splits need to show near the amount. Noted.”', bucket: 'help' },
          { id: 'd', label: '“Nobody else had a problem with it.”', bucket: 'defend' },
          { id: 'e', label: '“I followed the guidelines, so it’s correct.”', bucket: 'defend' },
        ] },
      { type: 'pick', id: 'p1', prompt: 'You disagree with a piece of feedback. When should you decide what to do about it?',
        explanation: 'In the moment you’re reacting. Later, you can weigh it against the goal and other evidence.',
        options: [
          { id: 'a', label: 'Immediately, so the room knows where you stand' },
          { id: 'b', label: 'Never: all feedback must be applied' },
          { id: 'c', label: 'After the session, against the goal of the work' },
          { id: 'd', label: 'Only once the most senior person agrees' },
        ], correct: 'c' },
    ],
  },
];
