// Chapter ax.1 · Accessibility basics. Draft by Claude, for review.
import type { LessonContent } from '../schema';

export const ax1: LessonContent[] = [
  {
    id: 'ax.1-1', title: 'Disability is a spectrum', minutes: 4,
    steps: [
      { type: 'concept', id: 'c1', title: 'Permanent, temporary, situational',
        body: ['Disability isn’t only a permanent condition. Someone with one arm, someone with a broken wrist and a parent holding a baby all need to use a phone one-handed.',
          'Designing for the permanent case helps everyone on the spectrum. Captions help deaf people, people with an ear infection, and people on a noisy train.'] },
      { type: 'sort', id: 's1', prompt: 'Permanent, temporary or situational?',
        explanation: 'Permanent lasts a lifetime, temporary heals, situational depends on where you are or what you’re doing.',
        buckets: [{ id: 'perm', label: 'Permanent' }, { id: 'temp', label: 'Temporary' }, { id: 'sit', label: 'Situational' }],
        items: [
          { id: 'a', label: 'Blind since birth', bucket: 'perm' },
          { id: 'b', label: 'Broken wrist in a cast', bucket: 'temp' },
          { id: 'c', label: 'Holding a baby in one arm', bucket: 'sit' },
          { id: 'd', label: 'Deaf', bucket: 'perm' },
          { id: 'e', label: 'Ear infection', bucket: 'temp' },
          { id: 'f', label: 'Reading a phone in bright sunlight', bucket: 'sit' },
        ] },
      { type: 'pick', id: 'p1', prompt: 'Why design captions for videos?',
        explanation: 'One fix serves the whole spectrum: deaf viewers, people with temporary hearing loss, and anyone in a loud or silent place.',
        options: [
          { id: 'a', label: 'Only a few deaf users need them' },
          { id: 'b', label: 'They help deaf people, people with ear infections and anyone on a noisy train' },
          { id: 'c', label: 'They make videos load faster' },
          { id: 'd', label: 'The law says nothing about them' },
        ], correct: 'b' },
    ],
  },
  {
    id: 'ax.1-2', title: 'WCAG POUR principles', minutes: 4,
    steps: [
      { type: 'concept', id: 'c1', title: 'Four principles',
        body: ['WCAG, the Web Content Accessibility Guidelines, groups its rules under four principles: Perceivable, Operable, Understandable and Robust (POUR).',
          'Perceivable: people can sense the content (alt text, captions, contrast). Operable: they can use it (keyboard, enough time). Understandable: it makes sense (clear errors, consistent navigation). Robust: it works with assistive technology.'] },
      { type: 'order', id: 'o1', prompt: 'Spell out POUR in order.',
        explanation: 'Perceivable, Operable, Understandable, Robust.',
        items: [
          { id: 'a', label: 'Perceivable' },
          { id: 'b', label: 'Operable' },
          { id: 'c', label: 'Understandable' },
          { id: 'd', label: 'Robust' },
        ] },
      { type: 'sort', id: 's1', prompt: 'Which principle?',
        explanation: 'Alt text helps people perceive images; keyboard support makes things operable; clear errors make forms understandable.',
        buckets: [{ id: 'p', label: 'Perceivable' }, { id: 'o', label: 'Operable' }, { id: 'u', label: 'Understandable' }],
        items: [
          { id: 'a', label: 'Images have alt text', bucket: 'p' },
          { id: 'b', label: 'Everything works with a keyboard', bucket: 'o' },
          { id: 'c', label: 'Error messages say how to fix the problem', bucket: 'u' },
          { id: 'd', label: 'Videos have captions', bucket: 'p' },
          { id: 'e', label: 'Time limits can be extended', bucket: 'o' },
          { id: 'f', label: 'Navigation stays in the same place on every page', bucket: 'u' },
        ] },
    ],
  },
  {
    id: 'ax.1-3', title: 'Contrast & colour blindness', minutes: 4,
    steps: [
      { type: 'concept', id: 'c1', title: 'Never colour alone',
        body: ['About 1 in 12 men and 1 in 200 women have some colour vision deficiency. Red and green are the most common pair to confuse.',
          'If colour is the only difference (a red line vs a green line, a red border on an error), some people miss it. Add labels, icons, patterns or a clear lightness difference, and keep text at 4.5:1 contrast.'] },
      { type: 'tune', id: 't1', mock: 'contrast-label', prompt: 'Darken the helper text until it’s readable for everyone (WCAG AA, 4.5:1).',
        explanation: 'Body-size text needs at least 4.5:1 contrast against its background. Faint grey text looks elegant in a mockup and fails real people.',
        min: 20, max: 90, step: 1, start: 30, target: [55, 90], unit: '% darkness' },
      { type: 'pick', id: 'p1', prompt: 'A chart shows profit in green and loss in red. What makes it work for colour-blind users?',
        explanation: 'Direct labels (or icons and patterns) carry the meaning without relying on hue.',
        options: [
          { id: 'a', label: 'Brighter red and green' },
          { id: 'b', label: 'Label each line directly, e.g. “Profit” and “Loss”' },
          { id: 'c', label: 'A bigger legend in the corner' },
          { id: 'd', label: 'Nothing, most people see colour' },
        ], correct: 'b' },
    ],
  },
  {
    id: 'ax.1-4', title: 'Target sizes & focus', minutes: 4,
    steps: [
      { type: 'concept', id: 'c1', title: 'Big enough to hit, easy to follow',
        body: ['A fingertip covers about 10 mm. Touch targets should be at least 44 × 44 points (iOS) or 48 × 48 dp (Android), with space between them. WCAG’s minimum is 24 × 24 CSS pixels.',
          'Keyboard users need to see where they are. Never remove the focus ring without replacing it with something just as visible.'] },
      { type: 'pick', id: 'p1', prompt: 'A close icon is 16 × 16 px with nothing around it. Best fix?',
        explanation: 'Keep the icon small if you like, but give it a tap area of at least 44 × 44.',
        options: [
          { id: 'a', label: 'Make the icon bold' },
          { id: 'b', label: 'Give it a 44 × 44 tap area with padding' },
          { id: 'c', label: 'Move it to the bottom' },
          { id: 'd', label: 'Make it red' },
        ], correct: 'b' },
      { type: 'sort', id: 's1', prompt: 'Problem or fine?',
        explanation: 'Tiny or crowded targets and missing focus indicators are problems. Large, spaced targets with visible focus are fine.',
        buckets: [{ id: 'bad', label: 'Problem' }, { id: 'ok', label: 'Fine' }],
        items: [
          { id: 'a', label: 'Two links 4px apart in a footer', bucket: 'bad' },
          { id: 'b', label: 'A 48px tall primary button', bucket: 'ok' },
          { id: 'c', label: 'outline: none on every input', bucket: 'bad' },
          { id: 'd', label: 'A thick custom focus ring on buttons', bucket: 'ok' },
        ] },
    ],
  },
];
