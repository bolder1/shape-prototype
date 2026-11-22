// Chapter br.1 · Brand foundations. Draft by Claude, for review.
import type { LessonContent } from '../schema';

export const br1: LessonContent[] = [
  {
    id: 'br.1-1', title: 'Brand vs. logo vs. identity', minutes: 4,
    steps: [
      { type: 'concept', id: 'c1', title: 'Three different things',
        body: ['A logo is a mark: a symbol or wordmark. A visual identity is the whole system around it: colours, typefaces, imagery, icons and tone of voice, used consistently.',
          'A brand is what people think and feel about you, built by every experience, from the app to a refund call. You design the logo and identity; the brand lives in people’s heads.'] },
      { type: 'sort', id: 's1', prompt: 'Logo, identity or brand?',
        explanation: 'The logo is the mark, the identity is the system, the brand is the perception.',
        buckets: [{ id: 'logo', label: 'Logo' }, { id: 'identity', label: 'Identity' }, { id: 'brand', label: 'Brand' }],
        items: [
          { id: 'a', label: 'The symbol in the app icon', bucket: 'logo' },
          { id: 'b', label: 'The exact orange used everywhere', bucket: 'identity' },
          { id: 'c', label: 'Customers saying “they always refund fast”', bucket: 'brand' },
          { id: 'd', label: 'The wordmark at the top of the website', bucket: 'logo' },
          { id: 'e', label: 'The tone-of-voice guide', bucket: 'identity' },
          { id: 'f', label: 'How people feel after a late delivery', bucket: 'brand' },
        ] },
      { type: 'pick', id: 'p1', prompt: 'A startup says “we need a new brand” and orders a new logo. What’s missing?',
        explanation: 'A logo alone changes the mark, not the experience people remember.',
        options: [
          { id: 'a', label: 'Nothing, the logo is the brand' },
          { id: 'b', label: 'The experiences and promises that shape what people feel' },
          { id: 'c', label: 'A bigger logo' },
          { id: 'd', label: 'More colours' },
        ], correct: 'b' },
    ],
  },
  {
    id: 'br.1-2', title: 'Positioning & personality', minutes: 4,
    steps: [
      { type: 'concept', id: 'c1', title: 'Where you stand, how you sound',
        body: ['Positioning is the space you own in people’s minds: for whom, what problem, and why you instead of the alternatives. A common template: For [audience] who [need], [brand] is the [category] that [benefit], unlike [alternative].',
          'Personality is how the brand behaves and speaks, described with a few traits (calm, warm, expert) and what each one isn’t. It guides copy, colour, motion and imagery.'] },
      { type: 'pick', id: 'p1', prompt: 'Which is the strongest positioning statement?',
        explanation: 'It names who, the need, the benefit and the alternative it beats.',
        options: [
          { id: 'a', label: 'We are the best app for everyone' },
          { id: 'b', label: 'For busy professionals who can’t switch off, Sukoon is the meditation app that fits calm into 5 minutes, unlike hour-long courses' },
          { id: 'c', label: 'Sukoon is innovative and user-friendly' },
          { id: 'd', label: 'Download Sukoon today' },
        ], correct: 'b' },
      { type: 'sort', id: 's1', prompt: 'Sukoon’s personality is calm, warm and expert. On brand or off?',
        explanation: 'On-brand copy sounds calm and kind and knows its stuff. Shouting, hype and jargon are off.',
        buckets: [{ id: 'on', label: 'On brand' }, { id: 'off', label: 'Off brand' }],
        items: [
          { id: 'a', label: '“Breathe. You’ve got five minutes.”', bucket: 'on' },
          { id: 'b', label: '“CRUSH your stress NOW!!! 🔥”', bucket: 'off' },
          { id: 'c', label: '“Slow breathing lowers your heart rate. Let’s try it.”', bucket: 'on' },
          { id: 'd', label: '“Leverage mindfulness synergies.”', bucket: 'off' },
        ] },
    ],
  },
  {
    id: 'br.1-3', title: 'Moodboards with intent', minutes: 4,
    steps: [
      { type: 'concept', id: 'c1', title: 'Every image earns its place',
        body: ['A moodboard collects colours, type, imagery and textures that express the brand’s personality before anything is designed.',
          'A good one is curated, not dumped. Group it by personality traits and be able to say why each piece is there. If you can’t, it goes.'] },
      { type: 'pick', id: 'p1', prompt: 'You have 60 images pinned for a calm, warm meditation brand. Best next step?',
        explanation: 'Curate down to pieces that clearly express the traits, grouped and annotated.',
        options: [
          { id: 'a', label: 'Add 60 more for variety' },
          { id: 'b', label: 'Keep about 12 that clearly say calm and warm, grouped by trait with a note on each' },
          { id: 'c', label: 'Send all 60 to the client' },
          { id: 'd', label: 'Pick the three prettiest' },
        ], correct: 'b' },
      { type: 'sort', id: 's1', prompt: 'For a calm, warm, expert brand: keep or drop?',
        explanation: 'Soft, warm, considered pieces fit. Loud, chaotic or cold ones work against the personality.',
        buckets: [{ id: 'keep', label: 'Keep' }, { id: 'drop', label: 'Drop' }],
        items: [
          { id: 'a', label: 'A sunrise in soft peach and sand tones', bucket: 'keep' },
          { id: 'b', label: 'A neon glitch texture', bucket: 'drop' },
          { id: 'c', label: 'A gentle serif with rounded details', bucket: 'keep' },
          { id: 'd', label: 'A packed, noisy crowd photo', bucket: 'drop' },
        ] },
    ],
  },
];
