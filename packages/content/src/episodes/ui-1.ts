// Episodes for chapter ui.1 · Layout & spacing. Drafts by Claude, for review.
import type { Episode } from '../episode';

export const ui1_1: Episode = {
  lessonId: 'ui.1-1',
  hook: '7px here, 13px there. Random spacing is why a screen feels “off” before anyone can say why.',
  scene: {
    id: 'spacing-scale', duration: 34,
    beats: [
      { at: 0, title: 'Spaces picked by eye', body: 'A card built one nudge at a time: 7px, 13px, 22px, 9px. Each looked fine on its own.' },
      { at: 6, title: 'Something feels off', body: 'Nobody can name it, but the rhythm wobbles. The eye keeps measuring.' },
      { at: 11, title: 'A short scale', body: '4, 8, 16, 24, 32, 48. Every space has to be one of these.' },
      { at: 16, title: 'Snap', body: 'Each gap moves to the nearest step. Same layout, steady rhythm.' },
      { at: 23, title: 'Close means related', body: 'Small steps inside a group, big steps between groups. The spacing now explains the structure.' },
      { at: 29, title: 'Fewer choices, calmer screens', body: 'A scale ends pixel debates and makes every screen feel like part of one product.' },
    ],
  },
  check: [
    { id: 'c1', prompt: 'Why did the first card feel off?', options: [{ id: 'a', label: 'Wrong colours' }, { id: 'b', label: 'Random spacing values made the rhythm uneven' }, { id: 'c', label: 'The font was too big' }],
      correct: 'b', explanation: 'Values picked by eye drift apart. People feel the uneven rhythm even if they can’t name it.' },
    { id: 'c2', prompt: 'Where did the small steps go?', options: [{ id: 'a', label: 'Between separate groups' }, { id: 'b', label: 'Everywhere equally' }, { id: 'c', label: 'Inside groups, between related things' }],
      correct: 'c', explanation: 'Small gaps join related things; big gaps separate groups.' },
  ],
  game: {
    id: 'spacing-fix', title: 'Spacing fix',
    instructions: 'Each pair of elements needs a gap from the scale. Pick tight, medium or loose and watch the gap snap into place.',
    lanes: [
      { id: 't', label: 'Tight · 4–8', hint: 'Things that belong to each other' },
      { id: 'm', label: 'Medium · 16–24', hint: 'Inside a container, or between siblings' },
      { id: 'l', label: 'Loose · 32–48', hint: 'Between separate groups and sections' },
    ],
    cards: [
      { id: 'g1', label: 'An icon and its label', lane: 't', visual: 'icon-label' },
      { id: 'g2', label: 'Padding inside a card', lane: 'm', visual: 'card-padding' },
      { id: 'g3', label: 'Between two page sections', lane: 'l', visual: 'sections' },
      { id: 'g4', label: 'A field label and its input', lane: 't', visual: 'label-input' },
      { id: 'g5', label: 'Between cards in a list', lane: 'm', visual: 'card-list' },
      { id: 'g6', label: 'Between the Address and Payment parts of a form', lane: 'l', visual: 'form-groups' },
      { id: 'g7', label: 'A name and the job title under it', lane: 't', visual: 'name-role' },
      { id: 'g8', label: 'Two buttons side by side', lane: 't', visual: 'button-pair' },
      { id: 'g9', label: 'Space above a new section heading', lane: 'l', visual: 'heading' },
    ],
  },
  gap: {
    id: 'gap', from: 11, at: 15.6,
    prompt: 'The gaps are 7, 13, 22 and 9px. With the scale 4·8·16·24·32, what do you do?',
    options: [{ id: 'a', label: 'Snap each to the nearest step: 8, 16, 24, 8' }, { id: 'b', label: 'Make every gap 16' }, { id: 'c', label: 'Keep them, they were chosen carefully' }],
    correct: 'a', explanation: 'Snapping keeps each gap’s intent (small stays small) while giving the card a steady rhythm.',
  },
  takeaways: [
    { title: 'Use a scale', body: 'Pick spaces from a short list (4, 8, 16, 24, 32, 48) instead of nudging by eye.' },
    { title: 'Small inside, big between', body: 'Related things get tight gaps; separate groups get loose ones.' },
    { title: 'Consistency is calm', body: 'A shared scale makes every screen feel like the same product.' },
  ],
  quiz: {
    seconds: 12,
    questions: [
      { id: 'q1', prompt: 'Which is on an 8-pt scale?', options: [{ id: 'a', label: '13px' }, { id: 'b', label: '24px' }], correct: 'b', explanation: '24 = 3 × 8.' },
      { id: 'q2', prompt: 'An icon and its label get…', options: [{ id: 'a', label: 'A loose gap' }, { id: 'b', label: 'A medium gap' }, { id: 'c', label: 'A tight gap' }], correct: 'c', explanation: 'They belong together.' },
      { id: 'q3', prompt: 'Two page sections get…', options: [{ id: 'a', label: 'A loose gap' }, { id: 'b', label: 'A tight gap' }, { id: 'c', label: 'No gap' }, { id: 'd', label: 'A divider only' }], correct: 'a', explanation: 'Separate groups, big space.' },
      { id: 'q4', prompt: 'The main benefit of a spacing scale?', options: [{ id: 'a', label: 'Smaller files' }, { id: 'b', label: 'Brighter colours' }, { id: 'c', label: 'Faster servers' }, { id: 'd', label: 'Consistent rhythm and fewer decisions' }], correct: 'd', explanation: 'Fewer choices, steadier layouts.' },
    ],
  },
  ladder: [
    { id: 'l1', prompt: 'Why is 4 often allowed on an 8-pt grid?', hint: 'Think of very small gaps.', options: [{ id: 'a', label: 'For tight gaps where 8 is too much, like icon to text' }, { id: 'b', label: 'It’s a mistake' }, { id: 'c', label: 'For page margins' }, { id: 'd', label: 'For font sizes only' }], correct: 'a', explanation: 'Half-steps cover tiny gaps without breaking the system.' },
    { id: 'l2', prompt: 'Why multiples of 8 rather than 5?', hint: 'Screens and halving.', options: [{ id: 'a', label: '8 is lucky' }, { id: 'b', label: '8 halves cleanly (4, 2) and scales well on common screen densities' }, { id: 'c', label: 'Browsers require it' }, { id: 'd', label: 'Fonts are 8px' }], correct: 'b', explanation: 'It divides evenly and renders crisply at 1.5× and 2× densities.' },
    { id: 'l3', prompt: 'A button’s padding is 12px top and 20px sides. Fine?', hint: 'Not every value must be a multiple of 8.', options: [{ id: 'a', label: 'Never, everything must be ×8' }, { id: 'b', label: 'Only on Android' }, { id: 'c', label: 'Often fine: what matters is that values come from the agreed scale' }, { id: 'd', label: 'Only for icons' }], correct: 'c', explanation: 'Many scales include 12 and 20. Consistency matters more than the number 8.' },
    { id: 'l4', prompt: 'The gap inside a group is bigger than the gap between groups. What happens?', hint: 'Proximity.', options: [{ id: 'a', label: 'Nothing' }, { id: 'b', label: 'It looks more modern' }, { id: 'c', label: 'Text gets bigger' }, { id: 'd', label: 'People group the wrong things together' }], correct: 'd', explanation: 'Spacing is read as grouping. Reverse it and the structure lies.' },
    { id: 'l5', prompt: 'How do you make a scale stick across a team?', hint: 'Make the right value the easy one.', options: [{ id: 'a', label: 'Spacing tokens in the design files and code' }, { id: 'b', label: 'A poster' }, { id: 'c', label: 'Review every screen by hand forever' }, { id: 'd', label: 'Ban spacing' }], correct: 'a', explanation: 'Named tokens (space-2, space-4…) in Figma and code make the scale the default.' },
  ],
};

export const ui1_2: Episode = {
  lessonId: 'ui.1-2',
  hook: 'Don’t size things in pixels. Tell them how many columns to span, and the layout adapts on its own.',
  scene: {
    id: 'responsive-grid', duration: 34,
    beats: [
      { at: 0, title: 'Twelve columns', body: 'A desktop page split into 12 equal columns. Everything will sit on them.' },
      { at: 5, title: 'Span, don’t size', body: 'Each product card spans 3 columns, so four fit in a row.' },
      { at: 11, title: 'Gutters and margins', body: 'Gutters are the gaps between columns. Margins frame the page edges.' },
      { at: 17, title: 'Tablet: 8 columns', body: 'Same cards, now spanning 4 of 8 columns: two per row.' },
      { at: 23, title: 'Phone: 4 columns', body: 'Each card spans all 4 columns and they stack. No new design needed.' },
      { at: 29, title: 'One layout, every width', body: 'Columns and spans carry the layout from desktop to phone.' },
    ],
  },
  check: [
    { id: 'c1', prompt: 'On desktop, how many columns did each card span?', options: [{ id: 'a', label: '3 of 12' }, { id: 'b', label: '6 of 12' }, { id: 'c', label: '12 of 12' }],
      correct: 'a', explanation: '4 cards × 3 columns = 12.' },
    { id: 'c2', prompt: 'What are gutters?', options: [{ id: 'a', label: 'The page edges' }, { id: 'b', label: 'The gaps between columns' }, { id: 'c', label: 'The header' }],
      correct: 'b', explanation: 'Margins are the edges; gutters sit between columns.' },
  ],
  game: {
    id: 'column-span', title: 'Span it',
    instructions: 'A 12-column desktop grid. For each layout, choose how many columns one item spans. The grid fills in to show your answer.',
    lanes: [
      { id: '3', label: '3 columns', hint: 'Four per row' },
      { id: '4', label: '4 columns', hint: 'Three per row' },
      { id: '6', label: '6 columns', hint: 'Two per row' },
      { id: '12', label: '12 columns', hint: 'Full width' },
    ],
    cards: [
      { id: 'g1', label: 'Four product cards in a row', lane: '3' },
      { id: 'g2', label: 'Three feature cards in a row', lane: '4' },
      { id: 'g3', label: 'An image beside text, equal halves', lane: '6' },
      { id: 'g4', label: 'A full-width hero banner', lane: '12' },
      { id: 'g5', label: 'A footer with four link columns', lane: '3' },
      { id: 'g6', label: 'Three pricing plans side by side', lane: '4' },
      { id: 'g7', label: 'Two testimonials side by side', lane: '6' },
      { id: 'g8', label: 'A wide announcement strip across the page', lane: '12' },
    ],
  },
  gap: {
    id: 'gap', from: 17, at: 22.6,
    prompt: 'The phone grid has 4 columns. How should each card span?',
    options: [{ id: 'a', label: '1 column each, four tiny cards in a row' }, { id: 'b', label: 'All 4 columns, so the cards stack' }, { id: 'c', label: '12 columns, like desktop' }],
    correct: 'b', explanation: 'Spanning the full phone grid stacks the cards at a readable size.',
  },
  takeaways: [
    { title: 'Columns, gutters, margins', body: 'A grid gives every element a place to snap to.' },
    { title: 'Span, don’t size', body: 'Items span a number of columns instead of a fixed width.' },
    { title: 'Fewer columns on smaller screens', body: 'Common setups: 12 on desktop, 8 on tablet, 4 on phone.' },
  ],
  quiz: {
    seconds: 12,
    questions: [
      { id: 'q1', prompt: '3 per row on a 12-column grid: each spans…', options: [{ id: 'a', label: '3' }, { id: 'b', label: '4' }], correct: 'b', explanation: '12 ÷ 3 = 4.' },
      { id: 'q2', prompt: 'The space at the page edges is the…', options: [{ id: 'a', label: 'Gutter' }, { id: 'b', label: 'Column' }, { id: 'c', label: 'Margin' }], correct: 'c', explanation: 'Gutters sit between columns.' },
      { id: 'q3', prompt: 'A common phone grid has…', options: [{ id: 'a', label: '4 columns' }, { id: 'b', label: '12 columns' }, { id: 'c', label: '16 columns' }, { id: 'd', label: '1 column always' }], correct: 'a', explanation: '4 columns is typical on phones.' },
      { id: 'q4', prompt: 'Why is 12 a popular column count?', options: [{ id: 'a', label: 'It’s a dozen' }, { id: 'b', label: 'Browsers prefer it' }, { id: 'c', label: 'It loads faster' }, { id: 'd', label: 'It divides by 2, 3, 4 and 6' }], correct: 'd', explanation: 'Halves, thirds, quarters and sixths all fit.' },
    ],
  },
  ladder: [
    { id: 'l1', prompt: 'A sidebar spans 3 of 12 columns. The main content spans…', hint: 'They share one row.', options: [{ id: 'a', label: '9' }, { id: 'b', label: '3' }, { id: 'c', label: '12' }, { id: 'd', label: '6' }], correct: 'a', explanation: '3 + 9 = 12.' },
    { id: 'l2', prompt: 'Do gutters count as part of a column span?', hint: 'An item spanning 3 columns crosses some gaps.', options: [{ id: 'a', label: 'No, items stop at the first gutter' }, { id: 'b', label: 'Yes: a span includes the gutters between its columns' }, { id: 'c', label: 'Only on phones' }, { id: 'd', label: 'Gutters don’t exist' }], correct: 'b', explanation: 'A 3-column item covers 3 columns plus the 2 gutters inside them.' },
    { id: 'l3', prompt: 'What’s a breakpoint?', hint: 'Where the grid changes.', options: [{ id: 'a', label: 'A bug' }, { id: 'b', label: 'A broken link' }, { id: 'c', label: 'A screen width where the layout switches, e.g. 12 → 8 columns' }, { id: 'd', label: 'A page break for printing' }], correct: 'c', explanation: 'Breakpoints are widths where the grid or spans change.' },
    { id: 'l4', prompt: 'Text in a full-width 12-column block on a huge monitor becomes hard to read. Why?', hint: 'Line length.', options: [{ id: 'a', label: 'The font is too thin' }, { id: 'b', label: 'Colours fade' }, { id: 'c', label: 'Monitors blur text' }, { id: 'd', label: 'Lines get too long; cap the content width' }], correct: 'd', explanation: 'Very long lines tire the eye. Set a max width for reading content.' },
    { id: 'l5', prompt: 'Fluid vs. fixed grid: in a fluid grid, columns…', hint: 'What stretches?', options: [{ id: 'a', label: 'Stretch with the screen; gutters usually stay fixed' }, { id: 'b', label: 'Never change' }, { id: 'c', label: 'Disappear' }, { id: 'd', label: 'Turn into rows' }], correct: 'a', explanation: 'Fluid columns grow and shrink; gutters and margins usually stay constant.' },
  ],
};

export const ui1_3: Episode = {
  lessonId: 'ui.1-3',
  hook: 'Every line and box you add is something else to look at. Space can usually do the job quietly.',
  scene: {
    id: 'whitespace', duration: 34,
    beats: [
      { at: 0, title: 'A noisy screen', body: 'A settings page with lines under every row and boxes around every group.' },
      { at: 6, title: 'Boxes inside boxes', body: 'Count the lines: twenty of them, all saying “these are separate”.' },
      { at: 12, title: 'Remove the lines', body: 'Without them, the rows run together. The lines were doing the spacing’s job.' },
      { at: 18, title: 'Group by space', body: 'Small gaps inside each group, big gaps between groups. The structure is back, quieter.' },
      { at: 24, title: 'Keep lines that mean something', body: 'A focus ring and an error border stay. They show state, not separation.' },
      { at: 29, title: 'Calm and clear', body: 'Space for structure, lines for meaning.' },
    ],
  },
  check: [
    { id: 'c1', prompt: 'What were most of the lines doing?', options: [{ id: 'a', label: 'Showing errors' }, { id: 'b', label: 'Separating things space could separate' }, { id: 'c', label: 'Nothing at all' }],
      correct: 'b', explanation: 'They grouped and separated, which spacing can do with less noise.' },
    { id: 'c2', prompt: 'Which lines stayed?', options: [{ id: 'a', label: 'The ones that show state, like focus and errors' }, { id: 'b', label: 'Every second line' }, { id: 'c', label: 'The thickest ones' }],
      correct: 'a', explanation: 'Lines that carry meaning stay; decoration goes.' },
  ],
  game: {
    id: 'line-cut', title: 'Cut the lines',
    instructions: 'Every line and box on this screen is listed. Cut the ones space could replace and keep the ones that carry meaning. Then hand it in.',
    lanes: [
      { id: 'cut', label: 'Cut it', hint: 'It only separates, and space can do that' },
      { id: 'keep', label: 'Keep it', hint: 'It shows state or helps read dense data' },
    ],
    cards: [
      { id: 'g1', label: 'A divider under every row of a 4-item list', lane: 'cut', note: 'Even gaps already separate the rows.' },
      { id: 'g2', label: 'A box around each section of the settings page', lane: 'cut', note: 'A bigger gap between sections groups them without a box.' },
      { id: 'g3', label: 'The focus ring on the field you’re typing in', lane: 'keep', note: 'It shows state: where your typing goes.' },
      { id: 'g4', label: 'A line under every heading', lane: 'cut', note: 'Size, weight and space above the heading already set it apart.' },
      { id: 'g5', label: 'A red border on a field with an error', lane: 'keep', note: 'It carries meaning: something needs fixing.' },
      { id: 'g6', label: 'Grid lines in a 40-row data table', lane: 'keep', note: 'In dense data, lines help the eye follow a row across.' },
      { id: 'g7', label: 'A vertical line between each label and its value', lane: 'cut', note: 'Alignment and a gap pair them without a line.' },
      { id: 'g8', label: 'The underline on the selected tab', lane: 'keep', note: 'It shows which tab you’re on.' },
    ],
  },
  gap: {
    id: 'gap', from: 12, at: 17.6,
    prompt: 'The lines are gone and the rows run together. What now?',
    options: [{ id: 'a', label: 'Put the lines back' }, { id: 'b', label: 'Small gaps inside groups, big gaps between them' }, { id: 'c', label: 'Make every label bold' }],
    correct: 'b', explanation: 'Space takes over the grouping the lines were doing.',
  },
  takeaways: [
    { title: 'Space groups', body: 'Small gaps join, big gaps separate. That alone shows structure.' },
    { title: 'Lines add noise', body: 'Each divider and box is another thing to look at. Remove the ones space can replace.' },
    { title: 'Keep lines with meaning', body: 'Focus, errors, selection and dense tables still need them.' },
  ],
  quiz: {
    seconds: 12,
    questions: [
      { id: 'q1', prompt: 'A line under every heading is usually…', options: [{ id: 'a', label: 'Needed' }, { id: 'b', label: 'Replaceable by space' }], correct: 'b', explanation: 'Size and space set headings apart.' },
      { id: 'q2', prompt: 'An error border should…', options: [{ id: 'a', label: 'Stay' }, { id: 'b', label: 'Go' }, { id: 'c', label: 'Be grey' }], correct: 'a', explanation: 'It carries meaning.' },
      { id: 'q3', prompt: 'Whitespace mainly…', options: [{ id: 'a', label: 'Wastes room' }, { id: 'b', label: 'Hides content' }, { id: 'c', label: 'Groups and separates content' }, { id: 'd', label: 'Slows pages' }], correct: 'c', explanation: 'It’s structure, not emptiness.' },
      { id: 'q4', prompt: 'Grid lines in a big data table…', options: [{ id: 'a', label: 'Always go' }, { id: 'b', label: 'Should be thick' }, { id: 'c', label: 'Should be red' }, { id: 'd', label: 'Can help the eye track rows' }], correct: 'd', explanation: 'Dense data benefits from guides.' },
    ],
  },
  ladder: [
    { id: 'l1', prompt: 'More whitespace on a dense dashboard means…', hint: 'Space costs room.', options: [{ id: 'a', label: 'Clarity, but less fits on screen: a trade-off' }, { id: 'b', label: 'Always better' }, { id: 'c', label: 'Always worse' }, { id: 'd', label: 'No change' }], correct: 'a', explanation: 'Tools for experts may be denser on purpose. Balance clarity and density.' },
    { id: 'l2', prompt: 'Two groups have the same gap inside as between. People…', hint: 'Proximity again.', options: [{ id: 'a', label: 'See two groups' }, { id: 'b', label: 'See one long list' }, { id: 'c', label: 'See three groups' }, { id: 'd', label: 'Notice nothing' }], correct: 'b', explanation: 'Without a bigger gap between them, the groups merge.' },
    { id: 'l3', prompt: 'When is a card border on a white page useful?', hint: 'Think about what’s behind the card.', options: [{ id: 'a', label: 'Never' }, { id: 'b', label: 'Always' }, { id: 'c', label: 'When the card and page are the same colour and the card is tappable' }, { id: 'd', label: 'Only in dark mode' }], correct: 'c', explanation: 'A border or shadow can show the edge of a tappable area when there’s no contrast.' },
    { id: 'l4', prompt: '“Our users want everything on one screen”, so the team removes all whitespace. Risk?', hint: 'Fitting isn’t finding.', options: [{ id: 'a', label: 'None' }, { id: 'b', label: 'Larger files' }, { id: 'c', label: 'Slower loading' }, { id: 'd', label: 'Everything fits, but nothing is findable' }], correct: 'd', explanation: 'Without grouping, people scan everything to find one thing.' },
    { id: 'l5', prompt: 'Best order when cleaning up a noisy screen?', hint: 'Structure first.', options: [{ id: 'a', label: 'Fix grouping with space, then remove the lines it made redundant' }, { id: 'b', label: 'Remove everything, then add lines back' }, { id: 'c', label: 'Change colours first' }, { id: 'd', label: 'Add more boxes' }], correct: 'a', explanation: 'Let space carry the structure, then the redundant lines are easy to spot.' },
  ],
};

export const ui1_4: Episode = {
  lessonId: 'ui.1-4',
  hook: 'Nobody sees the line that elements line up on. Everybody notices when it’s missing.',
  scene: {
    id: 'alignment', duration: 34,
    beats: [
      { at: 0, title: 'Ragged edges', body: 'A card where every element starts at a slightly different place.' },
      { at: 6, title: 'Find the line', body: 'One shared left edge. Everything snaps to it, and the card calms down.' },
      { at: 12, title: 'Text reads from the left', body: 'A centred paragraph makes every line start somewhere new. Left-aligned, the eye knows where to go.' },
      { at: 18, title: 'Numbers line up right', body: 'Left-aligned amounts are hard to compare. Right-aligned, the digits line up by place value.' },
      { at: 24, title: 'Centre the short things', body: 'A short, standalone message like an empty state can sit in the centre.' },
      { at: 29, title: 'Shared edges', body: 'Left for reading, right for numbers, centre for short standalone lines.' },
    ],
  },
  check: [
    { id: 'c1', prompt: 'What calmed the first card down?', options: [{ id: 'a', label: 'A new font' }, { id: 'b', label: 'Snapping everything to one shared edge' }, { id: 'c', label: 'Bigger images' }],
      correct: 'b', explanation: 'A shared edge removes the little misalignments the eye keeps noticing.' },
    { id: 'c2', prompt: 'Why right-align the amounts?', options: [{ id: 'a', label: 'So digits line up by place value' }, { id: 'b', label: 'It looks fancier' }, { id: 'c', label: 'It saves space' }],
      correct: 'a', explanation: 'Units under units, tens under tens: easy to compare.' },
  ],
  game: {
    id: 'align-snap', title: 'Snap to the line',
    instructions: 'Drag each block onto the alignment line it belongs on: left, centre or right. Or use the buttons.',
    lanes: [
      { id: 'left', label: 'Left', hint: 'Text people read, labels, navigation' },
      { id: 'center', label: 'Centre', hint: 'Short, standalone lines' },
      { id: 'right', label: 'Right', hint: 'Numbers people compare' },
    ],
    cards: [
      { id: 'g1', label: 'A paragraph of body text', lane: 'left' },
      { id: 'g2', label: 'Prices in a table column', lane: 'right' },
      { id: 'g3', label: 'A short empty-state message', lane: 'center' },
      { id: 'g4', label: 'Form labels above their inputs', lane: 'left' },
      { id: 'g5', label: 'Amounts on a bank statement', lane: 'right' },
      { id: 'g6', label: 'A one-line “Payment successful” message', lane: 'center' },
      { id: 'g7', label: 'Links in a sidebar', lane: 'left' },
      { id: 'g8', label: 'Percentages in a comparison table', lane: 'right' },
    ],
  },
  gap: {
    id: 'gap', from: 18, at: 23.6,
    prompt: 'The amounts are hard to compare. How do you align them?',
    options: [{ id: 'a', label: 'Centre them' }, { id: 'b', label: 'Right-align them so the digits line up' }, { id: 'c', label: 'Left-align them like the text' }],
    correct: 'b', explanation: 'Right alignment (with tabular figures) lines up digits by place value.',
  },
  takeaways: [
    { title: 'Shared edges', body: 'Aligned elements share an invisible line, which makes layouts feel calm.' },
    { title: 'Left for reading', body: 'Paragraphs, labels and lists start at the same place every line.' },
    { title: 'Right for numbers', body: 'Amounts and figures line up by place value. Centre only short, standalone lines.' },
  ],
  quiz: {
    seconds: 12,
    questions: [
      { id: 'q1', prompt: 'Body paragraphs should be…', options: [{ id: 'a', label: 'Centred' }, { id: 'b', label: 'Left-aligned' }], correct: 'b', explanation: 'Every line starts in the same place.' },
      { id: 'q2', prompt: 'A column of prices should be…', options: [{ id: 'a', label: 'Left-aligned' }, { id: 'b', label: 'Centred' }, { id: 'c', label: 'Right-aligned' }], correct: 'c', explanation: 'Digits line up.' },
      { id: 'q3', prompt: 'A short empty-state message can be…', options: [{ id: 'a', label: 'Centred' }, { id: 'b', label: 'Right-aligned' }, { id: 'c', label: 'Justified' }, { id: 'd', label: 'Rotated' }], correct: 'a', explanation: 'Short and standalone.' },
      { id: 'q4', prompt: 'Ragged edges in a card make it feel…', options: [{ id: 'a', label: 'Modern' }, { id: 'b', label: 'Faster' }, { id: 'c', label: 'Bigger' }, { id: 'd', label: 'Messy, even if nobody can say why' }], correct: 'd', explanation: 'People sense misalignment.' },
    ],
  },
  ladder: [
    { id: 'l1', prompt: 'Why use tabular figures for numbers in tables?', hint: 'Width of each digit.', options: [{ id: 'a', label: 'Every digit has the same width, so columns line up' }, { id: 'b', label: 'They are bolder' }, { id: 'c', label: 'They are smaller' }, { id: 'd', label: 'They load faster' }], correct: 'a', explanation: 'Proportional digits (a narrow 1) shift; tabular ones stack neatly.' },
    { id: 'l2', prompt: 'An icon looks off-centre in a circle even though the maths says it’s centred. Why?', hint: 'Eyes, not maths.', options: [{ id: 'a', label: 'The screen is broken' }, { id: 'b', label: 'Its visual weight sits off-centre; nudge it optically' }, { id: 'c', label: 'Icons can’t be centred' }, { id: 'd', label: 'The circle is too big' }], correct: 'b', explanation: 'A play triangle, for example, needs nudging right to look centred.' },
    { id: 'l3', prompt: 'Should a table column’s header match its content alignment?', hint: 'Think of the column as one unit.', options: [{ id: 'a', label: 'No, headers are always centred' }, { id: 'b', label: 'No, always left' }, { id: 'c', label: 'Yes: right-aligned numbers get a right-aligned header' }, { id: 'd', label: 'Headers don’t matter' }], correct: 'c', explanation: 'Matching keeps the header visually attached to its column.' },
    { id: 'l4', prompt: 'In right-to-left languages like Arabic or Urdu, reading text aligns…', hint: 'Where does a line start?', options: [{ id: 'a', label: 'Left' }, { id: 'b', label: 'Centre' }, { id: 'c', label: 'Justified only' }, { id: 'd', label: 'Right, where lines start' }], correct: 'd', explanation: 'Align to where reading starts. Use logical “start/end” rather than left/right.' },
    { id: 'l5', prompt: 'A card has left-aligned text and a centred button below. Better?', hint: 'One edge or two?', options: [{ id: 'a', label: 'Align the button to the same left edge (or make it full width)' }, { id: 'b', label: 'Centre the text too' }, { id: 'c', label: 'Right-align everything' }, { id: 'd', label: 'Keep it, mixing is fine' }], correct: 'a', explanation: 'Mixing alignments in one card creates extra edges. Pick one.' },
  ],
};
