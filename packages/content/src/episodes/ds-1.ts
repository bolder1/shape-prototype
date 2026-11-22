// Episodes for chapter ds.1 · Why systems. Drafts by Claude, for review.
import type { Episode } from '../episode';

export const ds1_1: Episode = {
  lessonId: 'ds.1-1',
  hook: 'Every page you’ve ever designed is made of the same few tiny parts. Get the parts right and the pages come almost for free.',
  scene: {
    id: 'atomic', duration: 34,
    beats: [
      { at: 0, title: 'Atoms', body: 'The smallest parts: an icon, a label, an input, a button. Each does one tiny job.' },
      { at: 6, title: 'Molecules', body: 'Atoms snap together into small groups with one job, like a search bar: input plus button.' },
      { at: 12, title: 'Organisms', body: 'Molecules and atoms form whole sections: a header with a logo, navigation and the search bar.' },
      { at: 18, title: 'Templates', body: 'Organisms are arranged into a page layout with grey placeholders where content will go.' },
      { at: 24, title: 'Pages', body: 'Real content fills the template. Change the button atom and every page updates.' },
      { at: 29, title: 'Build up, not over', body: 'Atoms, molecules, organisms, templates, pages. Fix it low, and it’s fixed everywhere.' },
    ],
  },
  check: [
    { id: 'c1', prompt: 'A search bar (input plus button) is a…', options: [{ id: 'a', label: 'Atom' }, { id: 'b', label: 'Molecule' }, { id: 'c', label: 'Template' }],
      correct: 'b', explanation: 'A few atoms working together on one job.' },
    { id: 'c2', prompt: 'What’s the difference between a template and a page?', options: [{ id: 'a', label: 'A page has real content; a template has placeholders' }, { id: 'b', label: 'Templates are bigger' }, { id: 'c', label: 'Pages have no layout' }],
      correct: 'a', explanation: 'Same layout; the page fills it with real content.' },
  ],
  game: {
    id: 'atom-stack', title: 'Stack the parts',
    instructions: 'Drag each part onto the level it belongs to, from atoms at the bottom to templates at the top. Or tap a level.',
    lanes: [
      { id: 'atom', label: 'Atom', hint: 'Smallest useful part' },
      { id: 'molecule', label: 'Molecule', hint: 'A few atoms doing one job' },
      { id: 'organism', label: 'Organism', hint: 'A whole section of a page' },
      { id: 'template', label: 'Template', hint: 'A page layout with placeholders' },
    ],
    cards: [
      { id: 'g1', label: 'A single icon', lane: 'atom', visual: 'icon' },
      { id: 'g2', label: 'A search bar: input and button', lane: 'molecule', visual: 'search' },
      { id: 'g3', label: 'A site header: logo, navigation and search', lane: 'organism', visual: 'header' },
      { id: 'g4', label: 'A product page layout with grey placeholders', lane: 'template', visual: 'layout' },
      { id: 'g5', label: 'A button', lane: 'atom', visual: 'button' },
      { id: 'g6', label: 'A form field: label, input and help text', lane: 'molecule', visual: 'field' },
      { id: 'g7', label: 'A grid of product cards', lane: 'organism', visual: 'grid' },
      { id: 'g8', label: 'A text label', lane: 'atom', visual: 'label' },
      { id: 'g9', label: 'An avatar with a name and role', lane: 'molecule', visual: 'avatar' },
      { id: 'g10', label: 'A checkout layout: form slot, summary slot, button slot', lane: 'template', visual: 'checkout' },
    ],
  },
  gap: {
    id: 'gap', from: 6, at: 10.6,
    prompt: 'An input and a button are atoms. Snapped together into a search bar, they become a…',
    options: [{ id: 'a', label: 'Page' }, { id: 'b', label: 'Bigger atom' }, { id: 'c', label: 'Molecule' }],
    correct: 'c', explanation: 'A small group of atoms doing one job is a molecule.',
  },
  takeaways: [
    { title: 'Five levels', body: 'Atoms, molecules, organisms, templates, pages, from smallest to biggest.' },
    { title: 'Fix it low', body: 'Change an atom and every molecule, organism and page that uses it changes too.' },
    { title: 'Templates vs pages', body: 'Templates show structure with placeholders; pages prove it works with real content.' },
  ],
  quiz: {
    seconds: 12,
    questions: [
      { id: 'q1', prompt: 'A button is an…', options: [{ id: 'a', label: 'Atom' }, { id: 'b', label: 'Organism' }], correct: 'a', explanation: 'Smallest useful part.' },
      { id: 'q2', prompt: 'A site header is an…', options: [{ id: 'a', label: 'Atom' }, { id: 'b', label: 'Organism' }, { id: 'c', label: 'Molecule' }], correct: 'b', explanation: 'A whole section.' },
      { id: 'q3', prompt: 'A layout with grey placeholders is a…', options: [{ id: 'a', label: 'Page' }, { id: 'b', label: 'Molecule' }, { id: 'c', label: 'Atom' }, { id: 'd', label: 'Template' }], correct: 'd', explanation: 'Structure without real content.' },
      { id: 'q4', prompt: 'Fix the button atom and…', options: [{ id: 'a', label: 'Only that screen changes' }, { id: 'b', label: 'Nothing changes' }, { id: 'c', label: 'Every place using it changes' }, { id: 'd', label: 'Pages break' }], correct: 'c', explanation: 'That’s the point of building up.' },
    ],
  },
  ladder: [
    { id: 'l1', prompt: 'Who came up with atomic design?', hint: 'A web designer, 2013.', options: [{ id: 'a', label: 'Brad Frost' }, { id: 'b', label: 'Don Norman' }, { id: 'c', label: 'Dieter Rams' }, { id: 'd', label: 'Jakob Nielsen' }], correct: 'a', explanation: 'Brad Frost described it in 2013, borrowing the idea from chemistry.' },
    { id: 'l2', prompt: 'Is a colour like #2563EB an atom?', hint: 'Can you put it on a screen by itself?', options: [{ id: 'a', label: 'Yes, the smallest atom' }, { id: 'b', label: 'No: it’s a token, a value that atoms use' }, { id: 'c', label: 'It’s a molecule' }, { id: 'd', label: 'It’s a page' }], correct: 'b', explanation: 'Tokens (colour, spacing, type) sit below atoms and feed them.' },
    { id: 'l3', prompt: 'A card is a molecule in one team and an organism in another. Problem?', hint: 'What matters is the shared language.', options: [{ id: 'a', label: 'Yes, one team is wrong' }, { id: 'b', label: 'Yes, cards are banned' }, { id: 'c', label: 'Not really: the levels are a thinking tool; agree your own boundaries' }, { id: 'd', label: 'Only in Figma' }], correct: 'c', explanation: 'Atomic design is a mental model, not a law. Consistency within the team matters.' },
    { id: 'l4', prompt: 'Why design pages at all if you have components?', hint: 'Real content misbehaves.', options: [{ id: 'a', label: 'You don’t need to' }, { id: 'b', label: 'For marketing only' }, { id: 'c', label: 'Pages are faster to load' }, { id: 'd', label: 'Real content (long names, missing photos) tests whether the parts hold up' }], correct: 'd', explanation: 'Pages catch the edge cases templates hide.' },
    { id: 'l5', prompt: 'A new screen needs a slightly different button. Best move?', hint: 'Think of the atom.', options: [{ id: 'a', label: 'Check if an existing variant fits; if not, add a variant to the button component' }, { id: 'b', label: 'Draw a new button just for this screen' }, { id: 'c', label: 'Copy one from an old screen and tweak it' }, { id: 'd', label: 'Use plain text instead' }], correct: 'a', explanation: 'Grow the atom, don’t fork it.' },
  ],
};

export const ds1_2: Episode = {
  lessonId: 'ds.1-2',
  hook: 'The brand blue changes on Monday. Is that one edit, or forty? Tokens decide.',
  scene: {
    id: 'tokens', duration: 34,
    beats: [
      { at: 0, title: 'A value pasted everywhere', body: '#2563EB on the button, the link, the tab, the badge. Three screens, dozens of copies.' },
      { at: 6, title: 'Rebrand day', body: 'Someone changes them by hand, one by one. One gets missed and stays the old blue.' },
      { at: 12, title: 'Give it a name', body: 'color-primary = #2563EB. Every element points at the name instead of the number.' },
      { at: 17, title: 'Change it once', body: 'Set color-primary to green. Every button, link and tab changes together. Nothing is missed.' },
      { at: 22, title: 'Not just colour', body: 'Spacing, type, corner radius and shadows get names too: space-4, text-title, radius-md.' },
      { at: 29, title: 'Decisions with names', body: 'Tokens are design decisions that designers and code share.' },
    ],
  },
  check: [
    { id: 'c1', prompt: 'What went wrong on rebrand day?', options: [{ id: 'a', label: 'The new blue was ugly' }, { id: 'b', label: 'One copy was missed' }, { id: 'c', label: 'The app crashed' }],
      correct: 'b', explanation: 'Editing copies by hand always misses some.' },
    { id: 'c2', prompt: 'What does a token give a value?', options: [{ id: 'a', label: 'A name everyone shares' }, { id: 'b', label: 'A brighter colour' }, { id: 'c', label: 'A smaller file' }],
      correct: 'a', explanation: 'Named once, used everywhere.' },
  ],
  game: {
    id: 'token-swap', title: 'Swap in the tokens',
    instructions: 'This screen is full of hard-coded values. Swap each one for the right token. Then change a token and watch every use update.',
    lanes: [
      { id: 'color', label: 'color-primary', hint: 'The brand blue, #2563EB' },
      { id: 'space', label: 'space-4', hint: '16px of space' },
      { id: 'text', label: 'text-title', hint: '20px semibold' },
      { id: 'radius', label: 'radius-md', hint: '8px rounded corners' },
    ],
    cards: [
      { id: 'g1', label: 'The button fill, #2563EB', lane: 'color', visual: 'button-fill' },
      { id: 'g2', label: 'The gap between the two cards, 16px', lane: 'space', visual: 'gap' },
      { id: 'g3', label: 'The first card’s title, 20px semibold', lane: 'text', visual: 'title' },
      { id: 'g4', label: 'The button corners, 8px', lane: 'radius', visual: 'button-radius' },
      { id: 'g5', label: 'The link colour, #2563EB', lane: 'color', visual: 'link' },
      { id: 'g6', label: 'The padding inside each card, 16px', lane: 'space', visual: 'padding' },
      { id: 'g7', label: 'The second card’s title, 20px semibold', lane: 'text', visual: 'title2' },
      { id: 'g8', label: 'The card corners, 8px', lane: 'radius', visual: 'card-radius' },
    ],
  },
  gap: {
    id: 'gap', from: 12, at: 16.6,
    prompt: 'Rebrand to green. With color-primary in place, how many values do you edit?',
    options: [{ id: 'a', label: 'One: the token' }, { id: 'b', label: 'Every button and link' }, { id: 'c', label: 'Only the ones you can find' }],
    correct: 'a', explanation: 'Everything points at the token, so changing it changes them all.',
  },
  takeaways: [
    { title: 'Name the value', body: 'color-primary, not #2563EB. space-4, not 16px.' },
    { title: 'Change once', body: 'Every use points at the token, so one edit updates the whole product.' },
    { title: 'Shared by design and code', body: 'The same names in Figma and in code means fewer hand-offs and no drift.' },
  ],
  quiz: {
    seconds: 12,
    questions: [
      { id: 'q1', prompt: 'A design token is…', options: [{ id: 'a', label: 'A named value' }, { id: 'b', label: 'A login key' }], correct: 'a', explanation: 'Like color-primary.' },
      { id: 'q2', prompt: 'space-4 most likely holds…', options: [{ id: 'a', label: 'A colour' }, { id: 'b', label: 'A distance like 16px' }, { id: 'c', label: 'A font' }], correct: 'b', explanation: 'Spacing token.' },
      { id: 'q3', prompt: 'With tokens, a rebrand is…', options: [{ id: 'a', label: 'Impossible' }, { id: 'b', label: 'Hundreds of edits' }, { id: 'c', label: 'Riskier' }, { id: 'd', label: 'A few token edits' }], correct: 'd', explanation: 'Change values, not uses.' },
      { id: 'q4', prompt: 'Which can be a token?', options: [{ id: 'a', label: 'Only colours' }, { id: 'b', label: 'Only fonts' }, { id: 'c', label: 'Colour, spacing, type, radius, shadow' }, { id: 'd', label: 'Only images' }], correct: 'c', explanation: 'Any repeated design decision.' },
    ],
  },
  ladder: [
    { id: 'l1', prompt: 'Why is “blue-600” a weaker name for a button than “color-primary”?', hint: 'What if the brand turns green?', options: [{ id: 'a', label: 'It describes the look, not the role, so it lies after a rebrand' }, { id: 'b', label: 'It’s too short' }, { id: 'c', label: 'Numbers aren’t allowed' }, { id: 'd', label: 'There’s no difference' }], correct: 'a', explanation: 'Role names survive changes; look names don’t.' },
    { id: 'l2', prompt: 'Tokens often come in layers. What’s a common setup?', hint: 'Raw values, then roles.', options: [{ id: 'a', label: 'One flat list' }, { id: 'b', label: 'Primitive tokens (blue-600) referenced by semantic tokens (color-primary)' }, { id: 'c', label: 'Tokens inside images' }, { id: 'd', label: 'A token per screen' }], correct: 'b', explanation: 'Primitives hold values; semantics give them jobs. You’ll go deeper in ds.2.' },
    { id: 'l3', prompt: 'How do tokens make dark mode easier?', hint: 'Same name, different value.', options: [{ id: 'a', label: 'They invert colours' }, { id: 'b', label: 'They don’t' }, { id: 'c', label: 'color-surface can point at white in light mode and dark grey in dark mode' }, { id: 'd', label: 'They remove colour' }], correct: 'c', explanation: 'Components use the role; the theme swaps the value.' },
    { id: 'l4', prompt: 'A designer uses 15px instead of space-4 (16px) “because it looks better”. Risk?', hint: 'One-offs multiply.', options: [{ id: 'a', label: 'None' }, { id: 'b', label: 'The app gets slower' }, { id: 'c', label: 'Tokens stop working' }, { id: 'd', label: 'An untracked one-off that won’t update with the system' }], correct: 'd', explanation: 'If 15 is truly needed often, add it to the scale; don’t sneak it in.' },
    { id: 'l5', prompt: 'Where do tokens usually live so design and code stay in sync?', hint: 'One source.', options: [{ id: 'a', label: 'A single source (e.g. a JSON file or Figma variables) exported to code' }, { id: 'b', label: 'In each designer’s head' }, { id: 'c', label: 'In screenshots' }, { id: 'd', label: 'In the README only' }], correct: 'a', explanation: 'One source of truth, turned into Figma variables and CSS variables.' },
  ],
};

export const ds1_3: Episode = {
  lessonId: 'ds.1-3',
  hook: 'Nobody decided to have five primary buttons. It happened one copy-paste at a time.',
  scene: {
    id: 'inconsistency', duration: 34,
    beats: [
      { at: 0, title: 'Five screens', body: 'Home, cart, profile, settings, checkout. Each one has a primary button. Each one looks fine.' },
      { at: 6, title: 'Cut them out', body: 'Put all five buttons side by side. Different blues, corners, padding and weights.' },
      { at: 12, title: 'Count the debt', body: 'An inventory: 5 primary buttons, 9 greys, 4 corner radii. Nobody chose this.' },
      { at: 18, title: 'What it costs', body: 'Every new screen copies a random one. Developers rebuild the same thing. Fixes miss copies.' },
      { at: 24, title: 'Agree one', body: 'Pick one primary and one secondary button. Replace the rest. Five becomes two.' },
      { at: 29, title: 'Make the debt visible', body: 'Inventory, agree a standard, replace. Then keep it in the system.' },
    ],
  },
  check: [
    { id: 'c1', prompt: 'How did the five buttons come about?', options: [{ id: 'a', label: 'A deliberate brand choice' }, { id: 'b', label: 'One copy and tweak at a time' }, { id: 'c', label: 'A browser bug' }],
      correct: 'b', explanation: 'Small differences pile up when nobody compares them.' },
    { id: 'c2', prompt: 'What made the debt visible?', options: [{ id: 'a', label: 'A survey' }, { id: 'b', label: 'Laying every variant side by side' }, { id: 'c', label: 'Deleting screens' }],
      correct: 'b', explanation: 'An inventory turns a feeling into a number.' },
  ],
  game: {
    id: 'debt-hunt', title: 'Hunt the debt',
    instructions: 'The system’s primary button is shown at the top. Below is every primary button found in the app. Flag each one that drifts from the system, then hand in your audit.',
    lanes: [
      { id: 'debt', label: 'Drifts', hint: 'Differs from the system button' },
      { id: 'ok', label: 'Matches', hint: 'Exactly the system button' },
    ],
    cards: [
      { id: 'g1', label: 'Save button on Profile', lane: 'ok', visual: '#2563eb|8|20|600|Save' },
      { id: 'g2', label: 'Save button on Settings', lane: 'debt', visual: '#3b6fe0|8|20|600|Save', note: 'A near-identical blue (#3B6FE0) instead of color-primary.' },
      { id: 'g3', label: 'Continue button on Cart', lane: 'debt', visual: '#2563eb|4|20|600|Continue', note: 'Corners of 4px instead of radius-md (8px).' },
      { id: 'g4', label: 'Continue button on Onboarding', lane: 'ok', visual: '#2563eb|8|20|600|Continue' },
      { id: 'g5', label: 'Pay now button on Checkout', lane: 'debt', visual: '#2563eb|8|12|600|Pay now', note: 'Squeezed side padding: 12px instead of 20px.' },
      { id: 'g6', label: 'Sign up button on Home', lane: 'debt', visual: '#2563eb|8|20|400|Sign up', note: 'Regular weight label instead of semibold.' },
      { id: 'g7', label: 'Sign up button on Pricing', lane: 'ok', visual: '#2563eb|8|20|600|Sign up' },
      { id: 'g8', label: 'Book button on Offers', lane: 'debt', visual: '#2563eb|999|20|600|Book', note: 'A pill shape: fully rounded instead of 8px.' },
      { id: 'g9', label: 'Book button on Search results', lane: 'ok', visual: '#2563eb|8|20|600|Book' },
      { id: 'g10', label: 'Buy button on Product page', lane: 'debt', visual: '#1d4ed8|8|20|700|Buy', note: 'Darker blue and bold weight: two drifts in one.' },
    ],
  },
  gap: {
    id: 'gap', from: 12, at: 17,
    prompt: 'The inventory shows five primary buttons. What’s the first step?',
    options: [{ id: 'a', label: 'Design a sixth, better one' }, { id: 'b', label: 'Agree one standard from the five, then replace the rest' }, { id: 'c', label: 'Leave it, users don’t notice' }],
    correct: 'b', explanation: 'Pick the best existing one as the standard, document it, and swap the others out.',
  },
  takeaways: [
    { title: 'Debt is invisible until compared', body: 'Lay every variant side by side. The inventory is the argument.' },
    { title: 'It costs real time', body: 'Copies multiply bugs and slow every new screen.' },
    { title: 'Standardise, then protect', body: 'Agree one version, replace the rest, and put it in the system so the next screen uses it.' },
  ],
  quiz: {
    seconds: 12,
    questions: [
      { id: 'q1', prompt: 'An interface inventory is…', options: [{ id: 'a', label: 'Every variant of a part, side by side' }, { id: 'b', label: 'A stock list' }], correct: 'a', explanation: 'Screenshots, grouped.' },
      { id: 'q2', prompt: 'Five slightly different buttons are…', options: [{ id: 'a', label: 'Brand variety' }, { id: 'b', label: 'Inconsistency debt' }, { id: 'c', label: 'Required' }], correct: 'b', explanation: 'Unplanned drift.' },
      { id: 'q3', prompt: 'A cost of inconsistency debt?', options: [{ id: 'a', label: 'Better SEO' }, { id: 'b', label: 'Faster builds' }, { id: 'c', label: 'Cheaper hosting' }, { id: 'd', label: 'Fixes miss copies, and new screens take longer' }], correct: 'd', explanation: 'Every copy is another thing to maintain.' },
      { id: 'q4', prompt: 'After agreeing a standard, you…', options: [{ id: 'a', label: 'Keep all variants' }, { id: 'b', label: 'Start over' }, { id: 'c', label: 'Replace the variants and add it to the system' }, { id: 'd', label: 'Hide the old screens' }], correct: 'c', explanation: 'Replace, then protect.' },
    ],
  },
  ladder: [
    { id: 'l1', prompt: 'Why do audits often start with buttons and colours?', hint: 'Where is the debt easiest to see?', options: [{ id: 'a', label: 'They’re everywhere, so drift is easy to find and fixing them helps every screen' }, { id: 'b', label: 'They’re the only components' }, { id: 'c', label: 'Users only look at buttons' }, { id: 'd', label: 'It’s a rule' }], correct: 'a', explanation: 'High-use parts give the biggest return.' },
    { id: 'l2', prompt: 'How do you persuade a manager to fund cleanup?', hint: 'Make it concrete.', options: [{ id: 'a', label: 'Say it looks messy' }, { id: 'b', label: 'Show the inventory and the cost: hours rebuilding, bugs from copies' }, { id: 'c', label: 'Wait for complaints' }, { id: 'd', label: 'Do it secretly' }], correct: 'b', explanation: 'Numbers and screenshots beat opinions.' },
    { id: 'l3', prompt: 'Some variants are intentional, like a destructive red button. How do you treat them?', hint: 'Not all differences are debt.', options: [{ id: 'a', label: 'Remove them' }, { id: 'b', label: 'Make everything red' }, { id: 'c', label: 'Keep them as named variants with clear rules' }, { id: 'd', label: 'Ignore the rules' }], correct: 'c', explanation: 'Debt is unplanned difference; planned variants get names.' },
    { id: 'l4', prompt: 'How can you find colour drift in code quickly?', hint: 'Search.', options: [{ id: 'a', label: 'Read every file by eye' }, { id: 'b', label: 'Ask users' }, { id: 'c', label: 'Guess' }, { id: 'd', label: 'Search the codebase for raw hex codes and count unique values' }], correct: 'd', explanation: 'A quick search reveals how many one-off colours exist.' },
    { id: 'l5', prompt: 'What stops the debt coming back after cleanup?', hint: 'Make the right thing easy.', options: [{ id: 'a', label: 'Shared components and tokens, plus a quick check in reviews' }, { id: 'b', label: 'A one-time cleanup is enough' }, { id: 'c', label: 'Banning new screens' }, { id: 'd', label: 'More meetings' }], correct: 'a', explanation: 'Systems plus habits keep it clean.' },
  ],
};
