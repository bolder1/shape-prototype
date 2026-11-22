// Chapter ia.2 · User flows & task design. Draft by Claude, for review.
import type { LessonContent } from '../schema';

export const ia2: LessonContent[] = [
  {
    id: 'ia.2-1', title: 'Happy path vs. edge cases', minutes: 4,
    steps: [
      { type: 'concept', id: 'c1', title: 'Real life leaves the path',
        body: ['A user flow is the route someone takes through a product to finish a task, like resetting a password. The happy path is the route where everything goes right: the email exists, the code arrives, the new password is accepted.',
          'Edge cases are everything else: a typo, an expired code, a lost connection, a password that breaks the rules. Each one needs its own branch with a way back to the path. Most confusion and support tickets live on those branches, so design them on purpose.'] },
      { type: 'sort', id: 's1', prompt: 'Happy path or edge case? (Resetting a password.)',
        explanation: 'The happy path is the one route where nothing goes wrong. Everything that interrupts it is an edge case that needs a branch and a way back.',
        buckets: [{ id: 'happy', label: 'Happy path' }, { id: 'edge', label: 'Edge case' }],
        items: [
          { id: 'a', label: 'Enter your email and get a code', bucket: 'happy' },
          { id: 'b', label: 'The code expired before you typed it', bucket: 'edge' },
          { id: 'c', label: 'Choose a new password that meets the rules', bucket: 'happy' },
          { id: 'd', label: 'The connection drops as you tap Save', bucket: 'edge' },
          { id: 'e', label: 'You typed gmial.com instead of gmail.com', bucket: 'edge' },
        ] },
      { type: 'pick', id: 'p1', prompt: 'The code someone typed has expired. What should the screen do?',
        explanation: 'Say what happened and offer the fix right there, so they rejoin the happy path without starting over.',
        options: [
          { id: 'a', label: 'Show “Error” and send them back to the start' },
          { id: 'b', label: 'Say the code expired and offer “Send a new code” on the same screen' },
          { id: 'c', label: 'Do nothing until they try again' },
          { id: 'd', label: 'Lock the account' },
        ], correct: 'b' },
    ],
  },
  {
    id: 'ia.2-2', title: 'Reducing steps without losing clarity', minutes: 4,
    steps: [
      { type: 'concept', id: 'c1', title: 'Fewer steps, same understanding',
        body: ['Every extra screen is a chance to give up. To shorten a flow, ask four questions of each step: can we cut it, merge it with a neighbour, defer it until after the user gets value, or must we keep it?',
          'Shorter is not always better. Cramming eleven screens into one long form hides what matters and makes mistakes easy. Keep the steps that build trust or prevent errors, like reviewing an order before paying.'] },
      { type: 'sort', id: 's1', prompt: 'A lunch app’s first order has too many screens. Cut, defer, or keep?',
        explanation: 'Cut what adds nothing, defer what can wait until after the first order, keep what prevents mistakes or builds trust.',
        buckets: [{ id: 'cut', label: 'Cut' }, { id: 'defer', label: 'Defer' }, { id: 'keep', label: 'Keep' }],
        items: [
          { id: 'a', label: 'A three-slide welcome carousel', bucket: 'cut' },
          { id: 'b', label: 'Upload a profile photo', bucket: 'defer' },
          { id: 'c', label: 'Review the order and total before paying', bucket: 'keep' },
          { id: 'd', label: 'A “Rate our app” pop-up before payment', bucket: 'cut' },
          { id: 'e', label: 'Set dietary preferences', bucket: 'defer' },
        ] },
      { type: 'pick', id: 'p1', prompt: 'A team squeezes their whole checkout into one very long scrolling form. What’s the risk?',
        explanation: 'Fewer screens isn’t the goal; less effort and fewer mistakes are. A wall of fields hides the important parts and makes errors easy to miss.',
        options: [
          { id: 'a', label: 'None: one screen is always fastest' },
          { id: 'b', label: 'People lose track of where they are and miss errors' },
          { id: 'c', label: 'It uses too much colour' },
          { id: 'd', label: 'Search engines can’t read it' },
        ], correct: 'b' },
    ],
  },
  {
    id: 'ia.2-3', title: 'States: empty, loading, error, success', minutes: 4,
    steps: [
      { type: 'concept', id: 'c1', title: 'One screen, many moments',
        body: ['A screen is not one design. Before there is data it is empty; while data is coming it is loading; when something breaks it shows an error; when an action works it confirms success.',
          'Each state needs its own design. Empty says what will appear and how to start. Loading shows progress and keeps the layout steady. Error says what happened and how to fix it. Success confirms what changed and what’s next.'] },
      { type: 'sort', id: 's1', prompt: 'Which state is it?',
        explanation: 'Empty: no data yet. Loading: data on its way. Error: something went wrong.',
        buckets: [{ id: 'empty', label: 'Empty' }, { id: 'loading', label: 'Loading' }, { id: 'error', label: 'Error' }],
        items: [
          { id: 'a', label: 'A new user opens Orders before ordering anything', bucket: 'empty' },
          { id: 'b', label: 'Grey placeholder blocks while the menu arrives', bucket: 'loading' },
          { id: 'c', label: 'The card was declined by the bank', bucket: 'error' },
          { id: 'd', label: 'A search for “paneer” matches nothing', bucket: 'empty' },
          { id: 'e', label: 'The connection dropped while loading', bucket: 'error' },
        ] },
      { type: 'pick', id: 'p1', prompt: 'What should a loading state do for a list that takes two seconds?',
        explanation: 'Skeleton blocks in the shape of the content show progress and stop the layout jumping when data arrives.',
        options: [
          { id: 'a', label: 'Show a blank white screen' },
          { id: 'b', label: 'Show placeholder blocks shaped like the list' },
          { id: 'c', label: 'Show an error until it loads' },
          { id: 'd', label: 'Play a long animation that hides the screen' },
        ], correct: 'b' },
    ],
  },
];
