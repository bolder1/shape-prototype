// Chapter ui.2 · Typography. Draft by Claude, for review.
import type { LessonContent } from '../schema';

export const ui2: LessonContent[] = [
  {
    id: 'ui.2-1', title: 'Type anatomy', minutes: 4,
    steps: [
      { type: 'concept', id: 'c1', title: 'Four invisible lines',
        body: ['Every line of text sits on a baseline. Lowercase letters reach up to the x-height, capitals to the cap height, and tails like p and y hang down to the descender line.',
          'Fonts set at the same size can look very different. A font with a tall x-height looks bigger and stays readable at small sizes.'] },
      { type: 'sort', id: 's1', prompt: 'Which line is it?',
        explanation: 'Lowercase tops out at the x-height, capitals at the cap height, and tails reach down to the descender line.',
        buckets: [{ id: 'x', label: 'x-height' }, { id: 'cap', label: 'Cap height' }, { id: 'desc', label: 'Descender' }],
        items: [
          { id: 'a', label: 'The top of a lowercase a, e or o', bucket: 'x' },
          { id: 'b', label: 'The top of a capital H', bucket: 'cap' },
          { id: 'c', label: 'How far the tail of a g hangs down', bucket: 'desc' },
          { id: 'd', label: 'The top of a lowercase x', bucket: 'x' },
          { id: 'e', label: 'The bottom of the tail of a y', bucket: 'desc' },
        ] },
      { type: 'pick', id: 'p1', prompt: 'Two fonts are both set at 14px. One looks noticeably bigger. Why?',
        explanation: 'Font size measures the whole box, not the letters. A taller x-height makes lowercase letters bigger inside the same box.',
        options: [
          { id: 'a', label: 'One screen is zoomed in' },
          { id: 'b', label: 'It has a taller x-height' },
          { id: 'c', label: 'It is a serif font' },
          { id: 'd', label: 'It has wider margins' },
        ], correct: 'b' },
    ],
  },
  {
    id: 'ui.2-2', title: 'Type scales', minutes: 4,
    steps: [
      { type: 'concept', id: 'c1', title: 'A base and a ratio',
        body: ['A type scale is a short list of sizes. Start with a base (often 16px for body text) and multiply by a ratio, such as 1.25, to get each step: 13, 16, 20, 25, 31, 39.',
          'Sizes picked by eye end up too close together, like 17 and 18. Nobody can tell which is the heading. A scale keeps the steps far enough apart to read as different levels.'] },
      { type: 'pick', id: 'p1', prompt: 'Base 16px, ratio 1.25. What’s the next step up?',
        explanation: '16 × 1.25 = 20. The step after that is 20 × 1.25 = 25.',
        options: [
          { id: 'a', label: '17px' },
          { id: 'b', label: '18px' },
          { id: 'c', label: '20px' },
          { id: 'd', label: '32px' },
        ], correct: 'c' },
      { type: 'sort', id: 's1', prompt: 'Which step of the scale?',
        explanation: 'The big steps are for the few things that lead the page. Body text sits at the base, and supporting details sit one step below.',
        buckets: [{ id: 'big', label: 'Display or heading' }, { id: 'body', label: 'Body · 16' }, { id: 'small', label: 'Small · 13' }],
        items: [
          { id: 'a', label: 'An article title', bucket: 'big' },
          { id: 'b', label: 'A paragraph of the article', bucket: 'body' },
          { id: 'c', label: 'A photo caption', bucket: 'small' },
          { id: 'd', label: 'A section heading', bucket: 'big' },
          { id: 'e', label: 'The date under the title', bucket: 'small' },
        ] },
    ],
  },
  {
    id: 'ui.2-3', title: 'Pairing fonts', minutes: 4,
    steps: [
      { type: 'concept', id: 'c1', title: 'Two voices at most',
        body: ['Most products need one or two fonts. Each extra font is another voice on the page, and the page starts to feel noisy.',
          'If you pair two fonts, make them clearly different, such as a serif for headings and a sans for body text. Two fonts that look nearly alike look like a mistake. One family in several weights is often enough.'] },
      { type: 'pick', id: 'p1', prompt: 'Which pairing is safest for a reading app?',
        explanation: 'A serif for headings and a sans for body gives clear contrast, and both are easy to read.',
        options: [
          { id: 'a', label: 'A script font for all text' },
          { id: 'b', label: 'Two sans fonts that look almost the same' },
          { id: 'c', label: 'A serif for headings, a sans for body text' },
          { id: 'd', label: 'A different font for every section' },
        ], correct: 'c' },
      { type: 'sort', id: 's1', prompt: 'Does the pairing work?',
        explanation: 'Pairings work when the fonts clearly differ and the body font is easy to read. They fail when the fonts are too alike, too many, or hard to read in paragraphs.',
        buckets: [{ id: 'works', label: 'Works' }, { id: 'clash', label: 'Clashes' }],
        items: [
          { id: 'a', label: 'One sans family: bold headings, regular body', bucket: 'works' },
          { id: 'b', label: 'Five fonts on one screen', bucket: 'clash' },
          { id: 'c', label: 'Paragraphs set in a script font', bucket: 'clash' },
          { id: 'd', label: 'A serif heading over sans body text', bucket: 'works' },
        ] },
    ],
  },
  {
    id: 'ui.2-4', title: 'Line length & leading', minutes: 4,
    steps: [
      { type: 'concept', id: 'c1', title: 'How wide, how tall',
        body: ['Line length (the measure) is how many characters fit on a line. For body text, 45 to 75 is comfortable. Longer lines make it hard to find the start of the next one.',
          'Leading (line height) is the space from one line to the next. Body text reads best at about 1.4 to 1.7 times the font size. Big headings need less.'] },
      { type: 'tune', id: 't1', mock: 'reading-text', prompt: 'Adjust the line height until this paragraph is comfortable to read.',
        explanation: 'Body text reads best around 1.4–1.7× its font size. Too tight and lines blur together; too loose and the eye loses its place.',
        min: 1, max: 2.4, step: 0.05, start: 1.05, target: [1.4, 1.7], unit: '×' },
      { type: 'pick', id: 'p1', prompt: 'An article runs about 120 characters a line on a wide monitor. Best fix?',
        explanation: 'Capping the text width brings each line back into the 45–75 character range, whatever the screen size.',
        options: [
          { id: 'a', label: 'Make the font smaller' },
          { id: 'b', label: 'Give the text a maximum width of about 65 characters' },
          { id: 'c', label: 'Justify the text' },
          { id: 'd', label: 'Add more line height and leave the width' },
        ], correct: 'b' },
    ],
  },
];
