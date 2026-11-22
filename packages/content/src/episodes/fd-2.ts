// Episodes for chapter fd.2 · Seeing like a designer. Drafts by Claude, for review.
import type { Episode } from '../episode';

const LAW_OPTS = [{ id: 'f', label: 'Fitts’s law' }, { id: 'h', label: 'Hick’s law' }, { id: 'j', label: 'Jakob’s law' }];

export const fd2_1: Episode = {
  lessonId: 'fd.2-1',
  hook: 'Your eyes group things before your brain catches up. Watch three principles fix a confusing form.',
  scene: {
    id: 'gestalt', duration: 34,
    beats: [
      { at: 0, title: 'A confusing form', body: 'Six fields, all evenly spaced. People can’t tell where “you” ends and “payment” begins.' },
      { at: 6, title: 'Proximity', body: 'Things close together feel related. Pull the groups apart and the form explains itself.' },
      { at: 14, title: 'Similarity', body: 'Things that look alike feel like the same kind of thing. The grey link looked like plain text.' },
      { at: 21, title: 'Closure', body: 'We complete shapes that aren’t fully drawn. Your eye finishes the circle for you.' },
      { at: 28, title: 'Seeing before thinking', body: 'Proximity, similarity, closure: free clarity, no extra lines or labels needed.' },
    ],
  },
  check: [
    { id: 'c1', prompt: 'What made the form read as two groups?', options: [{ id: 'a', label: 'A border around each field' }, { id: 'b', label: 'More space between the groups than within them' }, { id: 'c', label: 'Bigger labels' }],
      correct: 'b', explanation: 'Proximity: a bigger gap between groups than inside them is enough. No borders needed.' },
    { id: 'c2', prompt: 'Why did people skip the grey link?', options: [{ id: 'a', label: 'It didn’t look like the other links' }, { id: 'b', label: 'It was too short' }, { id: 'c', label: 'It was at the end' }],
      correct: 'a', explanation: 'Similarity: the odd one out looked like a different kind of thing.' },
  ],
  game: {
    id: 'gestalt-hunt', title: 'Gestalt hunt',
    instructions: 'A board of six pictures. Each round names one principle: tap every picture that shows it, then lock in.',
    lanes: [
      { id: 'prox', label: 'Proximity', hint: 'Grouping by space: close things feel related' },
      { id: 'sim', label: 'Similarity', hint: 'Grouping by looks: alike things feel the same kind' },
      { id: 'clo', label: 'Closure', hint: 'Completing a shape that isn’t fully drawn' },
    ],
    cards: [
      { id: 'g1', label: 'Two clusters of dots', lane: 'prox', visual: 'dot-clusters' },
      { id: 'g2', label: 'Form fields in two spaced groups', lane: 'prox', visual: 'field-groups' },
      { id: 'g3', label: 'Rows of circles and squares', lane: 'sim', visual: 'shape-rows' },
      { id: 'g4', label: 'Three blue links and one grey', lane: 'sim', visual: 'odd-link' },
      { id: 'g5', label: 'A circle drawn with gaps', lane: 'clo', visual: 'broken-circle' },
      { id: 'g6', label: 'A triangle made only by its corners', lane: 'clo', visual: 'implied-triangle' },
    ],
  },
  gap: {
    id: 'gap', from: 0, at: 5.6,
    prompt: 'Six fields, evenly spaced. How do you show they’re two groups, with the least extra stuff?',
    options: [{ id: 'a', label: 'Put a border around every field' }, { id: 'b', label: 'Add more space between the two groups' }, { id: 'c', label: 'Make every label bold' }],
    correct: 'b', explanation: 'Proximity does it for free: a larger gap between groups than within them. Borders add noise.',
  },
  takeaways: [
    { title: 'Space is a tool', body: 'Gaps group things better than lines and boxes.' },
    { title: 'Same look, same job', body: 'Make things that work alike look alike, and different things look different.' },
    { title: 'Less can say more', body: 'Eyes fill in gaps. You don’t have to draw everything.' },
  ],
  quiz: {
    seconds: 12,
    questions: [
      { id: 'q1', prompt: 'A label sits right above its input. Which principle?', options: [{ id: 'a', label: 'Similarity' }, { id: 'b', label: 'Proximity' }, { id: 'c', label: 'Closure' }], correct: 'b', explanation: 'Being close ties the label to its field.' },
      { id: 'q2', prompt: 'Every destructive button is red. Which principle?', options: [{ id: 'a', label: 'Similarity' }, { id: 'b', label: 'Closure' }, { id: 'c', label: 'Proximity' }], correct: 'a', explanation: 'Alike looks signal alike behaviour.' },
      { id: 'q3', prompt: 'A dotted outline still reads as a box. Which principle?', options: [{ id: 'a', label: 'Proximity' }, { id: 'b', label: 'Similarity' }, { id: 'c', label: 'Closure' }], correct: 'c', explanation: 'Your eye completes the shape.' },
      { id: 'q4', prompt: 'The gap between groups should be…', options: [{ id: 'a', label: 'The same as inside a group' }, { id: 'b', label: 'Smaller than inside a group' }, { id: 'c', label: 'Clearly larger, about 2–3×' }], correct: 'c', explanation: 'A clear difference is what makes the grouping obvious.' },
    ],
  },
  ladder: [
    { id: 'l1', prompt: 'Gestalt principles describe…', hint: 'It happens before you think.', options: [{ id: 'a', label: 'How code is structured' }, { id: 'b', label: 'How we automatically group what we see' }, { id: 'c', label: 'How to write copy' }, { id: 'd', label: 'Brand strategy' }], correct: 'b', explanation: 'They’re about perception: how eyes and brain organise a scene.' },
    { id: 'l2', prompt: 'One link is grey, the rest blue. What will people assume?', hint: 'The odd one out.', options: [{ id: 'a', label: 'All are links' }, { id: 'b', label: 'The grey one is most important' }, { id: 'c', label: 'The grey one isn’t a link' }, { id: 'd', label: 'Nothing' }], correct: 'c', explanation: 'Different look, different kind of thing.' },
    { id: 'l3', prompt: 'A settings page uses a divider line between every row. What’s often better?', hint: 'Which principle needs no ink?', options: [{ id: 'a', label: 'Thicker dividers' }, { id: 'b', label: 'Group rows with white space and section titles' }, { id: 'c', label: 'Colour each row' }, { id: 'd', label: 'Icons on every row' }], correct: 'b', explanation: 'Proximity groups related rows without the clutter of lines.' },
    { id: 'l4', prompt: 'Why can a logo leave parts of a shape undrawn?', hint: 'Eyes fill in gaps.', options: [{ id: 'a', label: 'Closure: people complete the shape' }, { id: 'b', label: 'It saves ink' }, { id: 'c', label: 'Printers can’t do full shapes' }, { id: 'd', label: 'Similarity' }], correct: 'a', explanation: 'Closure lets simple, open shapes still read as whole.' },
    { id: 'l5', prompt: 'Two unrelated buttons sit very close together. What’s the risk?', hint: 'Close means…', options: [{ id: 'a', label: 'None' }, { id: 'b', label: 'People read them as related or as one group' }, { id: 'c', label: 'They load slowly' }, { id: 'd', label: 'They look too big' }], correct: 'b', explanation: 'Proximity works both ways: closeness implies a relationship, wanted or not.' },
  ],
};

export const fd2_2: Episode = {
  lessonId: 'fd.2-2',
  hook: 'People decide where to look in seconds. Watch a page go from chaos to one clear path.',
  scene: {
    id: 'hierarchy', duration: 34,
    beats: [
      { at: 0, title: 'The five-second test', body: 'Show a page for five seconds. Where do people look?' },
      { at: 5, title: 'Everywhere at once', body: 'Same size, same weight, two identical buttons. Eyes bounce around and give up.' },
      { at: 11, title: 'Squint at it', body: 'Blur the page. If nothing stands out when blurry, nothing stands out at all.' },
      { at: 15, title: 'Build a hierarchy', body: 'One big title. One solid main button. The second action goes quiet.' },
      { at: 22, title: 'A clear path', body: 'Now eyes go title, then main point, then the button. In that order.' },
      { at: 26, title: 'Readable for everyone', body: 'Faint grey text fails. Darken it to at least 4.5:1 contrast.' },
    ],
  },
  check: [
    { id: 'c1', prompt: 'What was wrong with the two buttons?', options: [{ id: 'a', label: 'They were the same, so neither looked like the main action' }, { id: 'b', label: 'They were too small' }, { id: 'c', label: 'They were the wrong colour' }],
      correct: 'a', explanation: 'Equal weight means no main action. One solid, one quiet.' },
    { id: 'c2', prompt: 'What does squinting at a page tell you?', options: [{ id: 'a', label: 'Whether the fonts load' }, { id: 'b', label: 'Whether anything stands out' }, { id: 'c', label: 'If the colours are on brand' }],
      correct: 'b', explanation: 'Blur removes detail; what still pops is your real hierarchy.' },
  ],
  game: {
    id: 'squint-test', title: 'Squint test',
    instructions: 'Each layout appears blurred, like you’re squinting. Judge it: does one thing clearly stand out? Hold the eye button to peek at it sharp.',
    lanes: [
      { id: 'clear', label: 'Clear', hint: 'One thing clearly leads, the rest supports it' },
      { id: 'muddled', label: 'Muddled', hint: 'Everything competes, so nothing leads' },
    ],
    cards: [
      { id: 'g1', label: 'A big headline with one solid button', lane: 'clear', visual: 'hero-clear' },
      { id: 'g2', label: 'Two identical buttons side by side', lane: 'muddled', visual: 'twin-buttons' },
      { id: 'g3', label: 'Every line of text the same size and weight', lane: 'muddled', visual: 'flat-text' },
      { id: 'g4', label: 'A product card with a clear title and price', lane: 'clear', visual: 'card-clear' },
      { id: 'g5', label: 'A dashboard with one big number', lane: 'clear', visual: 'big-number' },
      { id: 'g6', label: 'A grid of twelve identical tiles, all shouting', lane: 'muddled', visual: 'tile-wall' },
      { id: 'g7', label: 'A form with one primary button and a quiet cancel link', lane: 'clear', visual: 'form-clear' },
      { id: 'g8', label: 'A banner where three colours fight for attention', lane: 'muddled', visual: 'loud-banner' },
    ],
  },
  gap: {
    id: 'gap', from: 11, at: 14.6,
    prompt: 'Squinting shows nothing stands out. What’s the single most useful fix?',
    options: [{ id: 'a', label: 'Make everything bold' }, { id: 'b', label: 'Make the main action solid and the other action quieter' }, { id: 'c', label: 'Add more colours' }],
    correct: 'b', explanation: 'Hierarchy is contrast: one thing leads, others step back. Making everything louder makes nothing louder.',
  },
  takeaways: [
    { title: 'One thing leads', body: 'Each screen needs one obvious place to start and one main action.' },
    { title: 'Squint to check', body: 'Blur it. Whatever still stands out is your real hierarchy.' },
    { title: 'Readable is required', body: 'Text needs at least 4.5:1 contrast. Faint grey looks elegant and fails people.' },
  ],
  quiz: {
    seconds: 12,
    questions: [
      { id: 'q1', prompt: 'Minimum contrast for normal body text (WCAG AA)?', options: [{ id: 'a', label: '2:1' }, { id: 'b', label: '3:1' }, { id: 'c', label: '4.5:1' }, { id: 'd', label: '10:1' }], correct: 'c', explanation: '4.5:1 for normal text, 3:1 for large text.' },
      { id: 'q2', prompt: 'Two actions on a screen. The main one should be…', options: [{ id: 'a', label: 'Solid and prominent' }, { id: 'b', label: 'Identical to the other' }, { id: 'c', label: 'A plain text link' }], correct: 'a', explanation: 'Primary is solid; secondary is quieter.' },
      { id: 'q3', prompt: 'Making everything bold makes…', options: [{ id: 'a', label: 'Everything important' }, { id: 'b', label: 'Nothing stand out' }, { id: 'c', label: 'The page faster' }], correct: 'b', explanation: 'Emphasis only works by contrast with what isn’t emphasised.' },
      { id: 'q4', prompt: 'Size, weight, colour and space are all tools for…', options: [{ id: 'a', label: 'Branding only' }, { id: 'b', label: 'Performance' }, { id: 'c', label: 'Visual hierarchy' }, { id: 'd', label: 'SEO' }], correct: 'c', explanation: 'They tell eyes what matters most.' },
    ],
  },
  ladder: [
    { id: 'l1', prompt: 'Visual hierarchy tells people…', hint: 'Order of attention.', options: [{ id: 'a', label: 'Where to look first' }, { id: 'b', label: 'What the brand is' }, { id: 'c', label: 'How fast the page is' }, { id: 'd', label: 'Who built it' }], correct: 'a', explanation: 'It sets the order in which people take in a screen.' },
    { id: 'l2', prompt: 'A five-second test shows people can’t say what a page is for. Likely cause?', hint: 'What should lead?', options: [{ id: 'a', label: 'Fonts too modern' }, { id: 'b', label: 'No clear headline or main point' }, { id: 'c', label: 'Too few images' }, { id: 'd', label: 'Slow server' }], correct: 'b', explanation: 'Without a clear lead, nothing tells people what the page is about.' },
    { id: 'l3', prompt: 'Helper text is #B0B0B0 on white, about 2:1. What should you do?', hint: 'There’s a number to hit.', options: [{ id: 'a', label: 'Make it smaller' }, { id: 'b', label: 'Darken it to at least 4.5:1' }, { id: 'c', label: 'Make it italic' }, { id: 'd', label: 'Leave it; it looks clean' }], correct: 'b', explanation: 'Clean but unreadable excludes people. Meet 4.5:1.' },
    { id: 'l4', prompt: 'Which signals “secondary action” best next to a solid primary button?', hint: 'Quieter, still clickable.', options: [{ id: 'a', label: 'Another solid button in red' }, { id: 'b', label: 'An outline or text button' }, { id: 'c', label: 'A bigger button' }, { id: 'd', label: 'An animated button' }], correct: 'b', explanation: 'Outline or text buttons step back while staying clearly interactive.' },
    { id: 'l5', prompt: 'Why does hierarchy matter more on mobile?', hint: 'Small screens, quick glances.', options: [{ id: 'a', label: 'It doesn’t' }, { id: 'b', label: 'Less space and divided attention, so the main thing must win instantly' }, { id: 'c', label: 'Phones can’t show colour' }, { id: 'd', label: 'Mobile users read every word' }], correct: 'b', explanation: 'On a small screen glanced at in a queue, the lead element has to be unmistakable.' },
  ],
};

export const fd2_3: Episode = {
  lessonId: 'fd.2-3',
  hook: 'Three laws explain why people miss buttons, freeze at menus and get lost. Then you’ll feel them yourself.',
  scene: {
    id: 'ux-laws', duration: 34,
    beats: [
      { at: 0, title: 'Fitts’s law', body: 'Small, far targets are slow and easy to miss. Big, close ones are fast.' },
      { at: 11, title: 'Hick’s law', body: 'More choices, slower decisions. Nine plans take far longer to choose from than three.' },
      { at: 22, title: 'Jakob’s law', body: 'People expect your product to work like the ones they already use. Put the cart where they look.' },
      { at: 30, title: 'Three laws, every week', body: 'Size and distance, number of choices, familiar patterns.' },
    ],
  },
  check: [
    { id: 'c1', prompt: 'Why did people miss the little ×?', options: [{ id: 'a', label: 'It was small and far away' }, { id: 'b', label: 'It was the wrong colour' }, { id: 'c', label: 'They didn’t want to close it' }],
      correct: 'a', explanation: 'Fitts’s law: small, far targets are slow and error-prone.' },
    { id: 'c2', prompt: 'What happened when the plans went from 9 to 3?', options: [{ id: 'a', label: 'People chose faster' }, { id: 'b', label: 'Nothing' }, { id: 'c', label: 'People left' }],
      correct: 'a', explanation: 'Hick’s law: fewer options, quicker decisions.' },
  ],
  game: {
    id: 'law-lab', title: 'Law lab',
    instructions: 'Feel each law with three quick experiments, then name the law behind each real-world problem.',
    lanes: [
      { id: 'f', label: 'Fitts’s law', hint: 'Bigger, closer targets are faster to hit' },
      { id: 'h', label: 'Hick’s law', hint: 'More choices make decisions slower' },
      { id: 'j', label: 'Jakob’s law', hint: 'People expect familiar patterns from other products' },
    ],
    cards: [
      { id: 'g1', label: 'Users keep missing a tiny “×” on mobile', lane: 'f' },
      { id: 'g2', label: 'A menu with 40 items takes ages to scan', lane: 'h' },
      { id: 'g3', label: 'The search box is hidden in the footer and nobody finds it', lane: 'j' },
      { id: 'g4', label: 'The Buy button is far from where your thumb rests', lane: 'f' },
      { id: 'g5', label: 'Onboarding asks you to choose from 12 goals at once', lane: 'h' },
      { id: 'g6', label: 'Swipe-left means “keep” in your app, unlike everywhere else', lane: 'j' },
    ],
  },
  gap: {
    id: 'gap', from: 11, at: 16,
    prompt: 'Nine plans side by side, and sign-ups drop. What helps most?',
    options: [{ id: 'a', label: 'Add a tenth plan for power users' }, { id: 'b', label: 'Show about three plans and highlight one' }, { id: 'c', label: 'Make the text smaller so they fit' }],
    correct: 'b', explanation: 'Hick’s law: fewer, clearer options mean faster, more confident decisions.',
  },
  takeaways: [
    { title: 'Big and close', body: 'Make important targets large (about 44px+) and near where hands already are.' },
    { title: 'Fewer choices', body: 'Cut, group or stage options so each decision is quick.' },
    { title: 'Familiar first', body: 'Be different where it adds value, not in navigation or basic controls.' },
  ],
  quiz: {
    seconds: 12,
    questions: [
      { id: 'q1', prompt: 'Tiny close buttons break…', options: LAW_OPTS, correct: 'f', explanation: 'Fitts: size and distance.' },
      { id: 'q2', prompt: 'A logo that doesn’t link home breaks…', options: LAW_OPTS, correct: 'j', explanation: 'Jakob: everyone expects the logo to go home.' },
      { id: 'q3', prompt: '30 filter options shown at once break…', options: LAW_OPTS, correct: 'h', explanation: 'Hick: more choices, slower decisions.' },
      { id: 'q4', prompt: 'A good minimum touch target is about…', options: [{ id: 'a', label: '12px' }, { id: 'b', label: '24px' }, { id: 'c', label: '44px' }, { id: 'd', label: '120px' }], correct: 'c', explanation: 'Around 44px (iOS) to 48dp (Android).' },
    ],
  },
  ladder: [
    { id: 'l1', prompt: 'Fitts’s law is about…', hint: 'Pointing at things.', options: [{ id: 'a', label: 'Colour' }, { id: 'b', label: 'Target size and distance' }, { id: 'c', label: 'Number of options' }, { id: 'd', label: 'Brand' }], correct: 'b', explanation: 'Time to hit a target depends on its size and distance.' },
    { id: 'l2', prompt: 'Why do corners of a desktop screen make great targets?', hint: 'The cursor can’t overshoot.', options: [{ id: 'a', label: 'They’re pretty' }, { id: 'b', label: 'The cursor stops at the edge, so they act infinitely big' }, { id: 'c', label: 'Nobody looks there' }, { id: 'd', label: 'They load first' }], correct: 'b', explanation: 'Edges stop the cursor, making edge targets effectively huge.' },
    { id: 'l3', prompt: 'You need 12 options. How do you respect Hick’s law?', hint: 'You don’t have to show all at once.', options: [{ id: 'a', label: 'Show all 12 in a row' }, { id: 'b', label: 'Group them or reveal them in steps, with a sensible default' }, { id: 'c', label: 'Hide them all' }, { id: 'd', label: 'Make them smaller' }], correct: 'b', explanation: 'Grouping and progressive disclosure make each decision small.' },
    { id: 'l4', prompt: 'When is breaking Jakob’s law worth it?', hint: 'Different has a cost.', options: [{ id: 'a', label: 'Always, to stand out' }, { id: 'b', label: 'When the new pattern is clearly better and you help people learn it' }, { id: 'c', label: 'Never' }, { id: 'd', label: 'Only on Fridays' }], correct: 'b', explanation: 'Innovation must pay for the learning cost it adds.' },
    { id: 'l5', prompt: 'A checkout’s Pay button sits top-left on mobile. Which laws suffer?', hint: 'Think thumbs and habits.', options: [{ id: 'a', label: 'Only Hick' }, { id: 'b', label: 'Fitts (far from thumbs) and Jakob (unusual place)' }, { id: 'c', label: 'None' }, { id: 'd', label: 'Only Jakob' }], correct: 'b', explanation: 'It’s a stretch for thumbs and not where people expect the main action.' },
  ],
};

export const fd2_4: Episode = {
  lessonId: 'fd.2-4',
  hook: 'Your memory holds about four things at once. See what happens when a screen asks for twelve.',
  scene: {
    id: 'cognitive-load', duration: 34,
    beats: [
      { at: 0, title: 'Working memory is small', body: 'People can juggle only about four chunks of information at once.' },
      { at: 5, title: 'Twelve settings at once', body: 'One long, flat list. The slots overflow and things fall out.' },
      { at: 12, title: 'Chunk it', body: 'Group the twelve into three labelled sections. Three chunks fit easily.' },
      { at: 20, title: 'Chunking everywhere', body: 'Ten digits are hard. Two groups of five are easy. Same number.' },
      { at: 26, title: 'Cut what you can', body: 'Defaults, fewer fields, one task per screen: less to hold, less to forget.' },
    ],
  },
  check: [
    { id: 'c1', prompt: 'Why did the flat list of 12 settings feel hard?', options: [{ id: 'a', label: 'It asked people to hold too much at once' }, { id: 'b', label: 'The font was small' }, { id: 'c', label: 'Settings are boring' }],
      correct: 'a', explanation: 'Twelve unrelated items overflow working memory.' },
    { id: 'c2', prompt: 'What made the phone number easier?', options: [{ id: 'a', label: 'A bigger font' }, { id: 'b', label: 'Splitting it into chunks' }, { id: 'c', label: 'Fewer digits' }],
      correct: 'b', explanation: 'Same digits, fewer chunks to remember.' },
  ],
  game: {
    id: 'chunk-lab', title: 'Chunk lab',
    instructions: 'First, a real memory test: unchunked, then chunked. Then decide whether each design change adds or reduces load.',
    lanes: [
      { id: 'adds', label: 'Adds load', hint: 'It gives people more to read, remember or decide' },
      { id: 'reduces', label: 'Reduces load', hint: 'It gives people less to hold in their head' },
    ],
    cards: [
      { id: 'g1', label: 'Grouping 12 settings into 3 labelled sections', lane: 'reduces' },
      { id: 'g2', label: 'Asking for the same address twice', lane: 'adds' },
      { id: 'g3', label: 'Pre-filling the city from the PIN code', lane: 'reduces' },
      { id: 'g4', label: 'Showing an error only after the whole form is sent', lane: 'adds' },
      { id: 'g5', label: 'One clear task per screen', lane: 'reduces' },
      { id: 'g6', label: 'A 16-character code shown in one long run', lane: 'adds' },
      { id: 'g7', label: 'Sensible defaults for most settings', lane: 'reduces' },
      { id: 'g8', label: 'Making people remember a code from the previous screen', lane: 'adds' },
    ],
  },
  gap: {
    id: 'gap', from: 5, at: 11.6,
    prompt: 'Twelve settings in one long list. What reduces the load most?',
    options: [{ id: 'a', label: 'Sort them alphabetically' }, { id: 'b', label: 'Group them into a few labelled sections' }, { id: 'c', label: 'Add an icon to every one' }],
    correct: 'b', explanation: 'Grouping turns twelve things into three chunks, which fit in working memory. Sorting and icons don’t reduce the count.',
  },
  takeaways: [
    { title: 'About four chunks', body: 'Design as if people can hold only a handful of things at once.' },
    { title: 'Group and label', body: 'Chunks with clear names turn many items into a few.' },
    { title: 'Remove, don’t ask', body: 'Defaults, pre-fills and fewer steps beat clever explanations.' },
  ],
  quiz: {
    seconds: 12,
    questions: [
      { id: 'q1', prompt: 'Roughly how many chunks fit in working memory?', options: [{ id: 'a', label: 'About 4' }, { id: 'b', label: 'About 20' }, { id: 'c', label: 'Unlimited' }, { id: 'd', label: '1' }], correct: 'a', explanation: 'Modern research puts it around four chunks.' },
      { id: 'q2', prompt: 'Pre-filling a field from data you already have…', options: [{ id: 'a', label: 'Adds load' }, { id: 'b', label: 'Reduces load' }], correct: 'b', explanation: 'Less to type and remember.' },
      { id: 'q3', prompt: '“98765 43210” is easier than “9876543210” because of…', options: [{ id: 'a', label: 'Colour' }, { id: 'b', label: 'Proximity only' }, { id: 'c', label: 'Chunking' }, { id: 'd', label: 'Font size' }], correct: 'c', explanation: 'Two chunks instead of ten digits.' },
      { id: 'q4', prompt: 'Long paragraphs feel easier with…', options: [{ id: 'a', label: 'Tighter line height' }, { id: 'b', label: 'Comfortable line height and short lines' }, { id: 'c', label: 'All caps' }, { id: 'd', label: 'Centred text' }], correct: 'b', explanation: 'Comfortable spacing reduces the effort of reading.' },
    ],
  },
  ladder: [
    { id: 'l1', prompt: 'Cognitive load is…', hint: 'Mental effort.', options: [{ id: 'a', label: 'Server load' }, { id: 'b', label: 'The mental effort a design asks of people' }, { id: 'c', label: 'Page weight' }, { id: 'd', label: 'Number of colours' }], correct: 'b', explanation: 'It’s how much thinking and remembering a task needs.' },
    { id: 'l2', prompt: 'Chunking works because…', hint: 'Count the chunks, not the items.', options: [{ id: 'a', label: 'It makes things prettier' }, { id: 'b', label: 'Memory counts chunks, so grouped items take fewer slots' }, { id: 'c', label: 'It hides information' }, { id: 'd', label: 'It’s faster to render' }], correct: 'b', explanation: 'A named group occupies one slot instead of many.' },
    { id: 'l3', prompt: 'Which change reduces load most on a long sign-up form?', hint: 'Fewer things to deal with at once.', options: [{ id: 'a', label: 'More helper text everywhere' }, { id: 'b', label: 'Split it into short steps and remove optional fields' }, { id: 'c', label: 'Make it one huge page' }, { id: 'd', label: 'Add a progress video' }], correct: 'b', explanation: 'Fewer fields per step and fewer fields overall.' },
    { id: 'l4', prompt: '“Recognition over recall” means…', hint: 'Seeing is easier than remembering.', options: [{ id: 'a', label: 'Show options instead of making people remember them' }, { id: 'b', label: 'Use more icons' }, { id: 'c', label: 'Hide menus' }, { id: 'd', label: 'Ask quiz questions' }], correct: 'a', explanation: 'Recognising from a visible list is easier than recalling from memory.' },
    { id: 'l5', prompt: 'A one-time code is shown on one screen and must be typed on the next. Better?', hint: 'Don’t make them carry it.', options: [{ id: 'a', label: 'Make it longer' }, { id: 'b', label: 'Auto-fill it or keep it visible where it’s typed' }, { id: 'c', label: 'Show it faster' }, { id: 'd', label: 'Add a timer' }], correct: 'b', explanation: 'Carrying information between screens is pure memory load. Remove it.' },
  ],
};
