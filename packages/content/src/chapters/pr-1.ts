// Chapter pr.1 · Prototyping. Draft by Claude, for review.
import type { LessonContent } from '../schema';

export const pr1: LessonContent[] = [
  {
    id: 'pr.1-1', title: 'Paper → clickable', minutes: 4,
    steps: [
      { type: 'concept', id: 'c1', title: 'Fidelity is a cost',
        body: ['Prototypes range from paper sketches (minutes) to clickable wireframes (hours), polished high-fidelity mockups (days) and coded prototypes (a week or more).',
          'Higher fidelity costs more and makes people comment on colours instead of the idea. Pick the lowest fidelity that can answer your question.'] },
      { type: 'pick', id: 'p1', prompt: 'You want to compare five layout ideas for a home screen this afternoon. Which fidelity?',
        explanation: 'Paper is fast and cheap to throw away, which is exactly what exploring many ideas needs.',
        options: [
          { id: 'a', label: 'Paper sketches' },
          { id: 'b', label: 'A polished high-fidelity prototype' },
          { id: 'c', label: 'A coded prototype' },
          { id: 'd', label: 'A finished app' },
        ], correct: 'a' },
      { type: 'sort', id: 's1', prompt: 'Low or high fidelity?',
        explanation: 'Structure and flow questions work at low fidelity. Feel, trust and real-data questions need higher fidelity.',
        buckets: [{ id: 'low', label: 'Low: paper or wireframe' }, { id: 'high', label: 'High: polished or coded' }],
        items: [
          { id: 'a', label: 'Can people find “Cancel order” in the menu?', bucket: 'low' },
          { id: 'b', label: 'Does the checkout feel trustworthy enough to pay?', bucket: 'high' },
          { id: 'c', label: 'Which of three layouts should we pursue?', bucket: 'low' },
          { id: 'd', label: 'Does a swipe gesture feel right on a real phone?', bucket: 'high' },
        ] },
    ],
  },
  {
    id: 'pr.1-2', title: 'Prototype for a question, not a demo', minutes: 4,
    steps: [
      { type: 'concept', id: 'c1', title: 'Start with the question',
        body: ['A prototype is a tool for learning. Before building, write the one question it must answer, such as “Can first-time users change the delivery address after ordering?”',
          'Then build only the screens on that path. A 40-screen demo gets polite praise; a 4-screen prototype built for a question gets a clear yes or no.'] },
      { type: 'pick', id: 'p1', prompt: 'Which is the best question for a prototype?',
        explanation: 'It names who, what task and a way to tell whether it worked.',
        options: [
          { id: 'a', label: 'Do people like the app?' },
          { id: 'b', label: 'Can first-time users change their delivery address after ordering, without help?' },
          { id: 'c', label: 'Is the design good?' },
          { id: 'd', label: 'What do people think of everything?' },
        ], correct: 'b' },
      { type: 'sort', id: 's1', prompt: 'The question is about changing a delivery address after ordering. Build the screen or skip it?',
        explanation: 'Keep only the screens on the path the question tests. Everything else is effort with no answer attached.',
        buckets: [{ id: 'keep', label: 'Build it' }, { id: 'cut', label: 'Skip it' }],
        items: [
          { id: 'a', label: 'Order tracking with a “Change address” option', bucket: 'keep' },
          { id: 'b', label: 'Onboarding carousel', bucket: 'cut' },
          { id: 'c', label: 'Address picker', bucket: 'keep' },
          { id: 'd', label: 'Rate your order', bucket: 'cut' },
        ] },
    ],
  },
  {
    id: 'pr.1-3', title: 'Figma prototyping basics', minutes: 4,
    steps: [
      { type: 'concept', id: 'c1', title: 'Trigger, action, animation',
        body: ['In Figma, a prototype is frames joined by connections. Each connection starts at a hotspot (like a button) and has a trigger (on tap), an action (navigate to, open overlay, back) and an animation (instant, dissolve, smart animate).',
          'Set a starting frame, press play, and click through it like an app. Overlays put sheets and dialogs on top of the current screen instead of replacing it.'] },
      { type: 'order', id: 'o1', prompt: 'Put the steps of making a connection in order.',
        explanation: 'Pick the hotspot, drag the connection to a frame, then set the trigger, action and animation, and test it.',
        items: [
          { id: 'a', label: 'Select the button that starts the interaction' },
          { id: 'b', label: 'Drag the connection to the destination frame' },
          { id: 'c', label: 'Set the trigger, e.g. On tap' },
          { id: 'd', label: 'Set the action and animation, e.g. Navigate, Smart animate' },
          { id: 'e', label: 'Press play and click through it' },
        ] },
      { type: 'pick', id: 'p1', prompt: 'A filter sheet should slide up over the product list, not replace it. Which action?',
        explanation: 'Open overlay shows a frame on top of the current one, which is how sheets and dialogs work.',
        options: [
          { id: 'a', label: 'Navigate to' },
          { id: 'b', label: 'Open overlay' },
          { id: 'c', label: 'Back' },
          { id: 'd', label: 'Open link' },
        ], correct: 'b' },
    ],
  },
];
