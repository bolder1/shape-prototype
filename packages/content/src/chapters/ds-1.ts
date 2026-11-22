// Chapter ds.1 · Why systems. Draft by Claude, for review.
import type { LessonContent } from '../schema';

export const ds1: LessonContent[] = [
  {
    id: 'ds.1-1', title: 'Atoms → pages (atomic design)', minutes: 4,
    steps: [
      { type: 'concept', id: 'c1', title: 'Small parts, built up',
        body: ['Atomic design describes an interface in five levels. Atoms are the smallest parts (a label, an input, a button). Molecules combine a few atoms (a search bar). Organisms are larger sections (a header).',
          'Templates arrange organisms into a page layout with placeholder content, and pages are templates filled with real content. Build the small parts well and every page inherits them.'] },
      { type: 'order', id: 'o1', prompt: 'Put the levels in order, smallest first.',
        explanation: 'Atoms combine into molecules, molecules into organisms, organisms into templates, and templates with real content become pages.',
        items: [
          { id: 'a', label: 'Atom: a button' },
          { id: 'b', label: 'Molecule: a search bar' },
          { id: 'c', label: 'Organism: a site header' },
          { id: 'd', label: 'Template: a page layout with placeholders' },
          { id: 'e', label: 'Page: the layout with real content' },
        ] },
      { type: 'sort', id: 's1', prompt: 'Atom, molecule or organism?',
        explanation: 'Atoms can’t be broken down usefully, molecules are small groups doing one job, organisms are whole sections.',
        buckets: [{ id: 'atom', label: 'Atom' }, { id: 'mol', label: 'Molecule' }, { id: 'org', label: 'Organism' }],
        items: [
          { id: 'a', label: 'A single icon', bucket: 'atom' },
          { id: 'b', label: 'A form field: label, input and help text', bucket: 'mol' },
          { id: 'c', label: 'A footer with four link columns', bucket: 'org' },
          { id: 'd', label: 'A text label', bucket: 'atom' },
          { id: 'e', label: 'An avatar with a name beside it', bucket: 'mol' },
          { id: 'f', label: 'A grid of product cards', bucket: 'org' },
        ] },
    ],
  },
  {
    id: 'ds.1-2', title: 'Tokens explained', minutes: 4,
    steps: [
      { type: 'concept', id: 'c1', title: 'Name the decision once',
        body: ['A design token is a named value: color-primary instead of #2563EB, space-4 instead of 16px. Designers and engineers both use the name.',
          'When the value changes, it changes everywhere the name is used. A rebrand becomes one edit instead of hunting through hundreds of screens and files.'] },
      { type: 'pick', id: 'p1', prompt: 'The brand blue changes. The hex code is pasted in 40 places. With a token, how many places do you edit?',
        explanation: 'Every use points at the token, so one change updates all 40.',
        options: [
          { id: 'a', label: 'All 40' },
          { id: 'b', label: 'One: the token’s value' },
          { id: 'c', label: 'Half of them' },
          { id: 'd', label: 'None, tokens can’t change' },
        ], correct: 'b' },
      { type: 'sort', id: 's1', prompt: 'Which kind of token?',
        explanation: 'Colour tokens hold colours, spacing tokens hold distances, type tokens hold font settings.',
        buckets: [{ id: 'color', label: 'Colour' }, { id: 'space', label: 'Spacing' }, { id: 'type', label: 'Typography' }],
        items: [
          { id: 'a', label: '#2563EB for primary buttons', bucket: 'color' },
          { id: 'b', label: '16px between cards', bucket: 'space' },
          { id: 'c', label: '20px semibold for card titles', bucket: 'type' },
          { id: 'd', label: 'The red used for errors', bucket: 'color' },
          { id: 'e', label: '24px padding inside dialogs', bucket: 'space' },
          { id: 'f', label: 'Line height 1.5 for body text', bucket: 'type' },
        ] },
    ],
  },
  {
    id: 'ds.1-3', title: 'Spotting inconsistency debt', minutes: 4,
    steps: [
      { type: 'concept', id: 'c1', title: 'Small differences add up',
        body: ['Inconsistency debt builds up when similar things are made again and again, slightly differently: five primary buttons, eleven greys, four corner radii.',
          'Each one looked fine alone. Together they make the product feel messy, slow down every new screen, and multiply bugs. An inventory (screenshots of every variant, side by side) makes the debt visible.'] },
      { type: 'pick', id: 'p0', prompt: 'Which practice causes inconsistency debt?',
        explanation: 'Copying the closest-looking screen spreads whatever variant it happens to use.',
        options: [
          { id: 'a', label: 'Using the shared button component' },
          { id: 'b', label: 'Copying a button from whichever old screen looks closest' },
          { id: 'c', label: 'Picking colours from the token list' },
          { id: 'd', label: 'Checking the design system before making something new' },
        ], correct: 'b' },
      { type: 'pick', id: 'p1', prompt: 'Your audit finds five slightly different primary buttons. What’s the first step?',
        explanation: 'Agree one standard from the inventory, then replace the variants with it.',
        options: [
          { id: 'a', label: 'Add a sixth, better button' },
          { id: 'b', label: 'Ignore it, users don’t notice' },
          { id: 'c', label: 'Put them side by side, agree one standard, then replace the rest' },
          { id: 'd', label: 'Redesign every screen from scratch' },
        ], correct: 'c' },
    ],
  },
];
