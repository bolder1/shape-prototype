// Chapter br.2 · Visual identity. Draft by Claude, for review.
import type { LessonContent } from '../schema';

export const br2: LessonContent[] = [
  {
    id: 'br.2-1', title: 'Logo design process', minutes: 5,
    steps: [
      { type: 'concept', id: 'c1', title: 'Words first, then many sketches, then tests',
        body: ['A logo starts from the brand platform, not from software. Turn the traits and the positioning into words and images (calm: still water, a slow breath, dusk), then sketch fast: forty small thumbnails in pencil, in twenty minutes, so the obvious ideas get used up early.',
          'Shortlist three and test them before polishing any. Does the mark still read at 16 px, in a browser tab? Does it work in one flat colour, and reversed out of a dark background? Does it look different from everything else in the category? Only the survivors get refined: line weights, optical balance, then a lockup with the name.'] },
      { type: 'order', id: 'o1', prompt: 'Put Ishita’s logo process for Sukoon in order.',
        explanation: 'Brief, words, many sketches, a shortlist, tests, then refinement. Refining before testing polishes marks that will fail at 16 px.',
        items: [
          { id: 'a', label: 'Reread the platform: calm, warm, expert; five minutes' },
          { id: 'b', label: 'List words and images for each trait' },
          { id: 'c', label: 'Sketch forty thumbnails in pencil' },
          { id: 'd', label: 'Shortlist three and test them small, in one colour and beside rivals' },
          { id: 'e', label: 'Refine the survivor and lock it up with the name' },
        ] },
      { type: 'sort', id: 's1', prompt: 'Does this mark pass its tests, or fail one?',
        explanation: 'Hairlines vanish at icon size, gradients and overlaps need colour to read, and the category’s stock symbol (a lotus, for meditation) makes you look like everyone else.',
        buckets: [{ id: 'pass', label: 'Passes' }, { id: 'fail', label: 'Fails a test' }],
        items: [
          { id: 'a', label: 'A sun with sixteen hairline rays', bucket: 'fail' },
          { id: 'b', label: 'A bold half-sun over a line, in one colour', bucket: 'pass' },
          { id: 'c', label: 'A sunset that only works as a gradient', bucket: 'fail' },
          { id: 'd', label: 'A lotus flower', bucket: 'fail' },
        ] },
      { type: 'pick', id: 'p1', prompt: 'The founder loves the gradient sunset and wants to skip the tests. What do you say?',
        explanation: 'A logo lives on rubber stamps, embroidery, one-colour newspaper ads and 16 px tabs. Showing the gradient in one colour settles it faster than an argument.',
        options: [
          { id: 'a', label: 'Fine: founders decide' },
          { id: 'b', label: 'Show it in one flat colour and at 16 px, beside the other two, and decide from that' },
          { id: 'c', label: 'Add more colours to make it stronger' },
          { id: 'd', label: 'Run a poll on Instagram' },
        ], correct: 'b' },
    ],
  },
  {
    id: 'br.2-2', title: 'Brand typography & colour', minutes: 5,
    steps: [
      { type: 'concept', id: 'c1', title: 'Pick for the traits, then for the job',
        body: ['A brand typeface should sound like the personality, and it has to do the job: if the product ships in Hindi, it needs Devanagari as well as Latin, or every Hindi word falls back to whatever font the phone has. Most brands use two faces with clear jobs: one with character for headlines, one plain and readable for everything else.',
          'Brand colour starts from the moodboard, then meets the rules. A soft colour that sets the mood may be too pale to carry white text (it needs 4.5:1), so it becomes a background and a deeper shade does the work. Check the shelf too: if the category’s leaders already own blue and orange, a third blue makes you look like them. A common split is 60% background, 30% the main colour, 10% accent.'] },
      { type: 'pick', id: 'p1', prompt: 'Sukoon is in English and Hindi. Which heading face fits?',
        explanation: 'Playfair has no Devanagari, so सुकून would fall back to a system font. Baloo 2 has Devanagari but sounds bubbly, not expert. Tiro sets both scripts in one calm voice.',
        options: [
          { id: 'a', label: 'Playfair Display: elegant, Latin only' },
          { id: 'b', label: 'Baloo 2: round and bubbly, Latin and Devanagari' },
          { id: 'c', label: 'Tiro Devanagari Hindi: a calm book serif, Latin and Devanagari' },
        ], correct: 'c' },
      { type: 'sort', id: 's1', prompt: 'Sukoon’s main button has a white label. Use this colour for it, or not?',
        explanation: 'White on peach is about 1.9:1, far under 4.5:1. Cobalt passes but looks like the category leader. Deep sage passes at about 7.5:1 and nobody else owns it.',
        buckets: [{ id: 'use', label: 'Use it' }, { id: 'no', label: 'Don’t' }],
        items: [
          { id: 'a', label: 'Deep sage, #2F5D50', bucket: 'use' },
          { id: 'b', label: 'Moodboard peach, #F2A98A', bucket: 'no' },
          { id: 'c', label: 'Cobalt blue, the shade the biggest rival uses', bucket: 'no' },
        ] },
      { type: 'pick', id: 'p2', prompt: 'Where does the soft peach go, if not on the button?',
        explanation: 'Keep the mood colour where it doesn’t carry white text: backgrounds, illustrations, a highlight. About 10% of a screen.',
        options: [
          { id: 'a', label: 'Nowhere: delete it from the palette' },
          { id: 'b', label: 'As an accent: illustration, highlights, a card behind ink text' },
          { id: 'c', label: 'On every heading' },
          { id: 'd', label: 'On the button anyway, with bold text' },
        ], correct: 'b' },
    ],
  },
  {
    id: 'br.2-3', title: 'Identity systems & guidelines', minutes: 5,
    steps: [
      { type: 'concept', id: 'c1', title: 'A system other people can use without you',
        body: ['An identity is a system: the logo and its lockups, the palette and its text pairs, the typefaces and their sizes, the photo style, the voice. Once partners, agencies and the marketing team start using it, every gap gets filled by a guess, and the guesses don’t match.',
          'A brand guide closes the gaps. For the logo: clear space (often measured with a part of the mark), minimum size, and what never to do. For colour: exact values (HEX and RGB for screens, CMYK for print) and which pairs can carry text. For type: which face for what, at which sizes. For imagery and voice: examples of right and wrong. Do and don’t pictures teach faster than paragraphs, and templates help more than rules.'] },
      { type: 'sort', id: 's1', prompt: 'Which part of Sukoon’s guide would have stopped this?',
        explanation: 'Each misuse breaks one rule: logo proportion and space, the palette and its text pairs, or the type system.',
        buckets: [{ id: 'logo', label: 'Logo' }, { id: 'colour', label: 'Colour' }, { id: 'type', label: 'Type' }],
        items: [
          { id: 'a', label: 'The logo stretched wide to fill a banner', bucket: 'logo' },
          { id: 'b', label: 'A Diwali offer in gold', bucket: 'colour' },
          { id: 'c', label: 'A quote card in a comic marker font', bucket: 'type' },
          { id: 'd', label: 'Captions set in Tiro at 12 px', bucket: 'type' },
          { id: 'e', label: 'The logo jammed into the corner, touching the headline', bucket: 'logo' },
        ] },
      { type: 'pick', id: 'p1', prompt: 'Why measure clear space in “suns”, the height of the half-sun in the mark, instead of in pixels?',
        explanation: 'A unit taken from the mark scales with it: the same rule works on a 16 px icon and a 3-metre hoarding.',
        options: [
          { id: 'a', label: 'It sounds nicer' },
          { id: 'b', label: 'It grows and shrinks with the logo, so one rule works at every size' },
          { id: 'c', label: 'Pixels aren’t allowed in guides' },
          { id: 'd', label: 'So nobody can check it' },
        ], correct: 'b' },
      { type: 'pick', id: 'p2', prompt: 'The marketing team keeps making off-brand posts despite a 60-page guide. What helps most?',
        explanation: 'Most misuse is people in a hurry. Ready templates make the right thing the easy thing; a one-page summary covers what they actually look up.',
        options: [
          { id: 'a', label: 'A longer guide' },
          { id: 'b', label: 'Templates for the common formats in the tools they use, and a one-page summary' },
          { id: 'c', label: 'Approve every post personally' },
          { id: 'd', label: 'Remove the logo files from the shared drive' },
        ], correct: 'b' },
    ],
  },
];
