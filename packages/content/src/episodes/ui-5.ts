// Episodes for chapter ui.5 · Visual craft & polish. Drafts by Claude, for review.
// Bunkar sells handloom saris straight from weavers’ co-operatives in Varanasi, Pochampally and Chanderi. The app works
// and tests well; the Diwali edit launches in a week. Kavya Menon, its principal designer, runs the polish pass:
// optical corrections where the maths looks wrong, one light and four heights, and a detail pass at 400% with every
// change written down. The cases, surfaces and details, and the rules they're judged by, are in ../polish and tested there.
import type { Episode } from '../episode';
import {
  BUNKAR_CASES, BUNKAR_DETAILS, BUNKAR_SURFACES, craftCheck, elevationOf, opticalFix,
  type BunkarCase, type BunkarDetail, type BunkarSurface,
} from '../polish';

const shape = (k: BunkarCase) => BUNKAR_CASES[k].text;
const fix = (k: BunkarCase) => opticalFix(BUNKAR_CASES[k]);
const surface = (k: BunkarSurface) => BUNKAR_SURFACES[k].text;
const height = (k: BunkarSurface) => elevationOf(BUNKAR_SURFACES[k]);
const detail = (k: BunkarDetail) => BUNKAR_DETAILS[k].text;
const check = (k: BunkarDetail) => craftCheck(BUNKAR_DETAILS[k]);

export const ui5_1: Episode = {
  lessonId: 'ui.5-1',
  hook: 'Every shape on Bunkar’s sari page is aligned to the pixel, and three of them look wrong. Kavya trusts her eye, then measures the fix.',
  scene: {
    id: 'optical-centre', duration: 36,
    beats: [
      { at: 0, title: 'Centred, and wrong', body: 'The play button on the sari video. Figma says the triangle is dead centre. Everyone who looks at it says it’s off to the left.' },
      { at: 6, title: 'Mass, not box', body: 'The triangle’s weight sits a third from its flat side. Kavya moves it 3 px toward the point, most of a sixth of its 18 px.' },
      { at: 11, title: 'Capitals sit high', body: '“ADD TO BAG” is centred by its line box, which keeps room for descenders the capitals don’t have. Centre on the cap height.' },
      { at: 16, title: 'Round shapes overshoot', body: 'An O drawn exactly to the H’s lines looks smaller. Type designers let it run past the baseline and the cap height.' },
      { at: 21, title: 'Circle against square', body: 'Same 48 px, but the circle has a fifth less area. Equal area reads as equal size: the weaver’s photo goes to 54 px.' },
      { at: 26, title: 'Hang the edges', body: 'The opening quote mark and the bullets carry little ink. Flush with the margin, the edge looks dented. Hang them outside it.' },
      { at: 31, title: 'Where maths wins', body: 'Prices in a column stay exact, in tabular figures. Fix single shapes by eye; keep what repeats on the grid.' },
    ],
  },
  check: [
    { id: 'c1', prompt: 'Why does the box-centred play triangle look left of centre?', options: [{ id: 'a', label: 'The button isn’t round' }, { id: 'b', label: 'Its visual mass, the centroid, sits a third from its flat side, not halfway' }, { id: 'c', label: 'Screens render triangles badly' }],
      correct: 'b', explanation: 'The eye centres mass. The tool centres the box.' },
    { id: 'c2', prompt: 'Which stays mathematically exact?', options: [{ id: 'a', label: 'Prices in a column' }, { id: 'b', label: 'A pull quote’s opening mark' }, { id: 'c', label: 'A round photo next to square ones' }],
      correct: 'a', explanation: 'Data people compare row by row needs exact alignment.' },
  ],
  game: {
    id: 'optical-nudge', title: 'Fix it by eye',
    instructions: 'Each card is a shape on Bunkar’s screens, placed exactly by its box. Choose what it needs. Right calls apply the correction: flip between the maths and the eye to see the difference.',
    lanes: [
      { id: 'nudge', label: 'Nudge to its mass', hint: 'Its weight isn’t at its box centre' },
      { id: 'overshoot', label: 'Overshoot the line', hint: 'Round or pointed edges look small' },
      { id: 'hang', label: 'Hang the edge', hint: 'Ink-light edges dent a margin' },
      { id: 'exact', label: 'Leave the maths', hint: 'It already looks right, or it’s data' },
    ],
    cards: [
      { id: 'g1', label: shape('play'), lane: fix('play'), visual: 'play', note: 'Its centroid is a third from the flat side. Move it about 3 px toward the point on an 18 px triangle, and draw that into the icon so it travels with it.' },
      { id: 'g2', label: shape('caps'), lane: fix('caps'), visual: 'caps', note: 'The line box keeps room for descenders capitals don’t have, so the word sits high. Centre the cap height in the button instead.' },
      { id: 'g3', label: shape('avatar'), lane: fix('avatar'), visual: 'avatar', note: 'A 48 px circle has a fifth less area than a 48 px square. About 52–54 px reads as the same size.' },
      { id: 'g4', label: shape('prices'), lane: fix('prices'), visual: 'prices', note: 'Numbers people read down a column stay exact. Tabular figures already line up every digit.' },
      { id: 'g5', label: shape('quote'), lane: fix('quote'), visual: 'quote', note: 'The quote mark is mostly air, so the paragraph looks indented. Hang it in the margin and the letters line up.' },
      { id: 'g6', label: shape('star'), lane: fix('star'), visual: 'star', note: 'A star touches the top and bottom with thin points. Let the points run a little past the line so its body matches the squares.' },
      { id: 'g7', label: shape('swatch'), lane: fix('swatch'), visual: 'swatch', note: 'A circle in a circle is symmetric: its mass is its centre. Nothing to correct.' },
      { id: 'g8', label: shape('bullets'), lane: fix('bullets'), visual: 'bullets', note: 'Hang the bullets outside the column so the text lines up with the heading. The bullets mark the list; the words carry the edge.' },
      { id: 'g9', label: shape('wordmark'), lane: fix('wordmark'), visual: 'wordmark', note: 'Hand-drawn lettering doesn’t get the font’s built-in overshoot. Push the U’s bowl and the S’s curves a little past both lines.' },
      { id: 'g10', label: shape('back'), lane: fix('back'), visual: 'back', note: 'Align the ink, not the box: shift the icon 4 px left so the arrow itself sits on the 16 px margin with the title below it.' },
    ],
  },
  gap: {
    id: 'gap', from: 16, at: 20.6,
    prompt: 'The round weaver photo looks smaller than the square sari thumbnails beside it, all 48 px. What should Kavya do?',
    options: [{ id: 'a', label: 'Make every image square' }, { id: 'b', label: 'Grow the circle until its area matches, about 52–54 px' }, { id: 'c', label: 'Give the circle a border' }],
    correct: 'b', explanation: 'Equal area reads as equal size. A circle needs to be a little bigger than the square it stands beside.',
  },
  takeaways: [
    { title: 'The eye centres mass', body: 'Triangles, arrows and capitals in a line box all look off when their box is centred. Move them toward their weight.' },
    { title: 'Round and pointed overshoot', body: 'They touch a line at one point, so they need to run past it, or be drawn larger, to look the same size.' },
    { title: 'Hang light edges', body: 'Quote marks, bullets and an icon’s own padding sit outside the margin, so the ink lines up.' },
    { title: 'Keep data exact', body: 'Fix single shapes by eye, in the asset itself. Columns, gutters and repeating parts stay on the grid.' },
  ],
  quiz: {
    seconds: 15,
    questions: [
      { id: 'q1', prompt: 'An 18 px play triangle, box-centred. Roughly how far should it move?', options: [{ id: 'a', label: 'About 3 px toward the point' }, { id: 'b', label: '9 px' }, { id: 'c', label: 'Not at all' }], correct: 'a', explanation: 'A sixth of its width, then judge by eye.' },
      { id: 'q2', prompt: 'An O beside an H on the same baseline should…', options: [{ id: 'a', label: 'Stop exactly at both' }, { id: 'b', label: 'Run a little past the baseline and cap height' }, { id: 'c', label: 'Be bolder' }], correct: 'b', explanation: 'Overshoot makes round letters look the same size.' },
      { id: 'q3', prompt: 'A pull quote’s opening mark goes…', options: [{ id: 'a', label: 'Into the margin' }, { id: 'b', label: 'Flush with the text' }, { id: 'c', label: 'On its own line' }], correct: 'a', explanation: 'Hang it, so the letters line up.' },
      { id: 'q4', prompt: 'Where should an optical offset live?', options: [{ id: 'a', label: 'In each layout that uses it' }, { id: 'b', label: 'In the icon or component itself' }, { id: 'c', label: 'Nowhere; tell engineers' }], correct: 'b', explanation: 'Then it travels with the shape and nobody undoes it.' },
    ],
  },
  ladder: [
    { id: 'l1', prompt: 'Why do design tools get optical alignment wrong?', hint: 'What does the tool actually measure?', options: [{ id: 'a', label: 'They’re badly built' }, { id: 'b', label: 'They align bounding boxes, and the eye judges visual mass and the ink at the edges' }, { id: 'c', label: 'Screens aren’t precise enough' }, { id: 'd', label: 'They don’t; it’s taste' }], correct: 'b', explanation: 'Boxes and mass agree for symmetric shapes and disagree for triangles, circles, capitals and punctuation.' },
    { id: 'l2', prompt: 'Why is a circle drawn bigger than a square on an icon grid?', hint: 'Compare the areas.', options: [{ id: 'a', label: 'Tradition' }, { id: 'b', label: 'A circle as wide as a square has about 21% less area, so it reads smaller' }, { id: 'c', label: 'Circles are more important' }, { id: 'd', label: 'To fit the stroke' }], correct: 'b', explanation: 'Keylines (like 20 px against 18 px) give shapes equal visual weight.' },
    { id: 'l3', prompt: 'An engineer “fixes” Kavya’s nudged play icon back to the exact centre. What would have prevented it?', hint: 'Where did the 3 px live?', options: [{ id: 'a', label: 'A sterner comment in Figma' }, { id: 'b', label: 'Building the offset into the icon’s drawing, and naming the reason in the spec' }, { id: 'c', label: 'Not using a play icon' }, { id: 'd', label: 'A bigger button' }], correct: 'b', explanation: 'A correction in the asset can’t drift. A correction in a layout gets “fixed” by the next person who measures it.' },
    { id: 'l4', prompt: 'Should Kavya optically adjust each price in the order summary?', hint: 'Who reads it, and how?', options: [{ id: 'a', label: 'Yes, every one by eye' }, { id: 'b', label: 'No: people compare numbers down a column, so they stay exact, in tabular figures' }, { id: 'c', label: 'Only the total' }, { id: 'd', label: 'Yes, but only on mobile' }], correct: 'b', explanation: 'Optical fixes are for single shapes judged alone. Data and repeating parts need consistency more than a perfect look.' },
    { id: 'l5', prompt: 'Two designers disagree about whether an icon “looks centred”. What settles it?', hint: 'Remove the bias.', options: [{ id: 'a', label: 'The more senior one decides' }, { id: 'b', label: 'Flip it, blur it and see it at real size on a device, then measure the offset you settle on and write it down' }, { id: 'c', label: 'Ask the engineer' }, { id: 'd', label: 'Go with the maths, always' }], correct: 'b', explanation: 'Flipping and blurring hide the details the eye has got used to. A measured, written offset ends the argument for next time.' },
  ],
};

export const ui5_2: Episode = {
  lessonId: 'ui.5-2',
  hook: 'Bunkar’s app has 23 shadows and four suns. Kavya picks one light and four heights, and a dropdown stops hiding in dark mode.',
  scene: {
    id: 'light-source', duration: 36,
    beats: [
      { at: 0, title: 'Four suns', body: 'One shadow falls left, one down-right, one is purple. Each team tuned its own. Together they say nothing about what’s on top.' },
      { at: 6, title: 'One light, from above', body: 'Kavya picks a single light source above the screen. Every shadow now falls straight down.' },
      { at: 11, title: 'Height by behaviour', body: 'The page is flat. A sari card rests low. The sticky bag bar and the menu are raised. The delivery sheet is an overlay.' },
      { at: 16, title: 'Higher, further, softer', body: 'The higher a surface, the further its shadow falls and the softer it gets: a tight key shadow and a soft ambient one.' },
      { at: 21, title: 'If everything floats', body: 'The old grid gave every card a big shadow. Nothing stood out, not even the open menu. Depth is a budget.' },
      { at: 26, title: 'Dark mode', body: 'On a dark page, shadows vanish and the menu sinks into the page. So surfaces get lighter as they rise.' },
      { at: 31, title: 'Four tokens', body: '23 shadows become four tokens, assigned by rule. New screens pick a height, never a shadow.' },
    ],
  },
  check: [
    { id: 'c1', prompt: 'What decides a surface’s height?', options: [{ id: 'a', label: 'How important it is to the business' }, { id: 'b', label: 'What it does: rests on the page, sits over content, or blocks the page' }, { id: 'c', label: 'Its colour' }],
      correct: 'b', explanation: 'Height is a claim about behaviour, so it follows behaviour.' },
    { id: 'c2', prompt: 'How does a surface show height in dark mode?', options: [{ id: 'a', label: 'A bigger black shadow' }, { id: 'b', label: 'A lighter fill the higher it sits' }, { id: 'c', label: 'A white glow' }],
      correct: 'b', explanation: 'Shadows don’t show on dark backgrounds; lightness does.' },
  ],
  game: {
    id: 'elevation-lift', title: 'Lift the surface',
    instructions: 'Each card is a surface on Bunkar’s sari page or checkout. Choose the height it should sit at. Right calls lift it in the side view and give it its shadow token; switch to dark mode to see height as lightness.',
    lanes: [
      { id: 'flat', label: 'Flat', hint: 'Part of the page: fill, space or a hairline' },
      { id: 'low', label: 'Low', hint: 'A separate object resting on the page' },
      { id: 'raised', label: 'Raised', hint: 'On top of other content' },
      { id: 'overlay', label: 'Overlay', hint: 'Blocks the page, with a scrim' },
    ],
    cards: [
      { id: 'g1', label: surface('card'), lane: height('card'), visual: 'card', note: 'A separate object you tap as a whole: low. A small shadow is enough to lift it off the page.' },
      { id: 'g2', label: surface('page'), lane: height('page'), visual: 'page', note: 'The page is the ground everything stands on. No shadow.' },
      { id: 'g3', label: surface('menu'), lane: height('menu'), visual: 'menu', note: 'It covers the content under it while it’s open: raised, with a shadow that clearly separates it.' },
      { id: 'g4', label: surface('pincode'), lane: height('pincode'), visual: 'pincode', note: 'Fields are part of the form, so they stay flat with a border. A shadow makes a field look like a button.' },
      { id: 'g5', label: surface('sheet'), lane: height('sheet'), visual: 'sheet', note: 'The page behind can’t be used until it closes: an overlay, with the largest shadow and a scrim.' },
      { id: 'g6', label: surface('bagBar'), lane: height('bagBar'), visual: 'bagBar', note: 'The page scrolls under it, so it’s above content: raised. Some teams only show the shadow once something is under it.' },
      { id: 'g7', label: surface('care'), lane: height('care'), visual: 'care', note: 'A section of the page: separate it with space or a fill change, not a shadow.' },
      { id: 'g8', label: surface('toast'), lane: height('toast'), visual: 'toast', note: 'It sits over the page but doesn’t block it: raised, and gone in a few seconds.' },
      { id: 'g9', label: surface('weaver'), lane: height('weaver'), visual: 'weaver', note: 'A tappable object of its own on the page: low, like the product cards.' },
      { id: 'g10', label: surface('dialog'), lane: height('dialog'), visual: 'dialog', note: 'It stops everything until she answers: overlay, with a scrim to say the page is on hold.' },
      { id: 'g11', label: surface('drag'), lane: height('drag'), visual: 'drag', note: 'Picked up, it passes over the other cards: raised. The bigger shadow tells her it’s moving.' },
    ],
  },
  gap: {
    id: 'gap', from: 16, at: 20.6,
    prompt: 'Marketing asks for a bigger shadow on every Diwali card, “so they pop”. What should Kavya say?',
    options: [{ id: 'a', label: 'Yes: more shadow, more festive' }, { id: 'b', label: 'Cards stay low. If every card floats, the menu and the bag bar stop standing out. Make them pop with the photos and colour' }, { id: 'c', label: 'Give the cards a coloured glow instead' }],
    correct: 'b', explanation: 'Height is a budget. Spend it on behaviour, and draw attention with content.',
  },
  takeaways: [
    { title: 'One light source', body: 'Pick it once, from above. Every shadow falls the same way.' },
    { title: 'A few heights, by behaviour', body: 'Flat, low, raised, overlay. What a surface does decides how high it sits.' },
    { title: 'Higher is further and softer', body: 'Grow offset and blur together, with a key and an ambient layer, and make them tokens.' },
    { title: 'Dark mode lightens', body: 'Shadows vanish on dark pages, so higher surfaces get lighter fills.' },
  ],
  quiz: {
    seconds: 15,
    questions: [
      { id: 'q1', prompt: 'A dropdown menu, open over the page, sits…', options: [{ id: 'a', label: 'Raised' }, { id: 'b', label: 'Flat' }, { id: 'c', label: 'Overlay' }], correct: 'a', explanation: 'Over content, but not blocking it.' },
      { id: 'q2', prompt: 'A text field should have…', options: [{ id: 'a', label: 'A raised shadow' }, { id: 'b', label: 'A border, no shadow' }, { id: 'c', label: 'An overlay shadow' }], correct: 'b', explanation: 'A shadow makes a field read as a button.' },
      { id: 'q3', prompt: 'Higher surfaces cast shadows that are…', options: [{ id: 'a', label: 'Further, larger and softer' }, { id: 'b', label: 'Sharper' }, { id: 'c', label: 'The same' }], correct: 'a', explanation: 'Further from the page, more diffuse.' },
      { id: 'q4', prompt: 'A bottom sheet that dims the page is…', options: [{ id: 'a', label: 'Low' }, { id: 'b', label: 'An overlay' }, { id: 'c', label: 'Flat' }], correct: 'b', explanation: 'It blocks the page until it closes.' },
    ],
  },
  ladder: [
    { id: 'l1', prompt: 'What does a shadow tell someone using the app?', hint: 'Think about what “on top” lets a thing do.', options: [{ id: 'a', label: 'That it’s decorative' }, { id: 'b', label: 'That this surface is above another, so it can move, cover or be dismissed' }, { id: 'c', label: 'That it’s a premium feature' }, { id: 'd', label: 'Nothing; it’s style' }], correct: 'b', explanation: 'Depth is a cue about behaviour, so an inconsistent shadow is a false promise.' },
    { id: 'l2', prompt: 'Why two layers in each shadow token?', hint: 'Look at a real object on a table.', options: [{ id: 'a', label: 'To look richer' }, { id: 'b', label: 'A tight key shadow anchors the contact edge; a soft ambient one shows the height' }, { id: 'c', label: 'Browsers need two' }, { id: 'd', label: 'One for light mode, one for dark' }], correct: 'b', explanation: 'Real objects cast both. Together they look natural at small sizes.' },
    { id: 'l3', prompt: 'A team wants a fifth elevation “between raised and overlay” for a new tooltip. What should Kavya ask?', hint: 'Does it behave differently?', options: [{ id: 'a', label: 'What colour it should be' }, { id: 'b', label: 'Does it behave differently from a menu or a toast? If not, it uses raised' }, { id: 'c', label: 'How many people asked' }, { id: 'd', label: 'Nothing; add it' }], correct: 'b', explanation: 'Each height should mean a different behaviour. More levels than behaviours blurs them all.' },
    { id: 'l4', prompt: 'In dark mode two raised surfaces overlap and blur together. What helps besides a lighter fill?', hint: 'Edges.', options: [{ id: 'a', label: 'A white shadow' }, { id: 'b', label: 'A faint border on the higher surface where they meet' }, { id: 'c', label: 'Turning off dark mode' }, { id: 'd', label: 'A gradient' }], correct: 'b', explanation: 'A low-contrast hairline separates dark surfaces where lightness alone isn’t enough.' },
    { id: 'l5', prompt: 'The sticky bag bar has a shadow even at the bottom of the page, with nothing under it. Is that right?', hint: 'When is it above content?', options: [{ id: 'a', label: 'Yes, always' }, { id: 'b', label: 'Better to show the shadow only while content scrolls under it' }, { id: 'c', label: 'Remove the bar' }, { id: 'd', label: 'Make it an overlay' }], correct: 'b', explanation: 'Height follows behaviour moment by moment: it’s raised only while it’s over something.' },
  ],
};

export const ui5_3: Episode = {
  lessonId: 'ui.5-3',
  hook: 'The Diwali screens passed review. At 400%, Kavya finds nine things that make them feel cheap, and writes down every one.',
  scene: {
    id: 'detail-pass', duration: 36,
    beats: [
      { at: 0, title: 'It looks done', body: 'The Diwali edit page passed review on Monday. It launches next week. Kavya opens it at 400% with real content.' },
      { at: 6, title: 'Type first', body: 'Straight quotes in a review. A hyphen in ₹2,400-₹3,100. Prices that don’t line up because the figures are proportional.' },
      { at: 11, title: 'Then shapes', body: 'The photo’s corners match the card’s, so the gap swells at each corner. Inner radius is outer minus padding: 16 − 8 = 8.' },
      { at: 16, title: 'Then states', body: 'Tab to “Add to bag”: no focus ring. A 50-character co-op name in a 28-character title. An empty wishlist that’s just white.' },
      { at: 21, title: 'Leave what’s right', body: 'The en dash in “4–6 days” and the delivery sheet’s radii are already right. Polish isn’t change for its own sake.' },
      { at: 26, title: 'Write it all down', body: 'Every fix is one line: before, after, why. The list goes to engineering, and the system-wide ones to the design system.' },
      { at: 31, title: 'Before and after', body: 'Nobody will name a single change. In testing, people called the new page “more trustworthy” and “like a proper shop”.' },
    ],
  },
  check: [
    { id: 'c1', prompt: 'Why does the photo inside the card look wrong at its corners?', options: [{ id: 'a', label: 'The photo is too dark' }, { id: 'b', label: 'Its radius matches the card’s; nested, the inner radius should be the outer minus the padding' }, { id: 'c', label: 'Cards shouldn’t have photos' }],
      correct: 'b', explanation: '16 px outside, 8 px padding: 8 px inside, so the gap stays even.' },
    { id: 'c2', prompt: 'How does Kavya hand over the pass?', options: [{ id: 'a', label: 'A new Figma file' }, { id: 'b', label: 'A written change list: before, after and why for each fix' }, { id: 'c', label: 'A meeting' }],
      correct: 'b', explanation: 'A list can be built and checked. Two files can’t be compared by eye.' },
  ],
  game: {
    id: 'detail-loupe', title: 'Run the detail pass',
    instructions: 'Each card is a detail on Bunkar’s Diwali screens, under the loupe. Choose the check it fails, or ship it. Right calls fix it and add a line to your change list.',
    lanes: [
      { id: 'type', label: 'Type', hint: 'Quotes, dashes, figures, line breaks' },
      { id: 'shape', label: 'Shape', hint: 'Radii, strokes, edges' },
      { id: 'state', label: 'State', hint: 'Focus, long content, empty' },
      { id: 'ship', label: 'Ship it', hint: 'Already right: leave it alone' },
    ],
    cards: [
      { id: 'g1', label: detail('review'), lane: check('review'), visual: 'review', note: 'Straight quotes are a typewriter leftover. Curly quotes and a curly apostrophe: “Softest Chanderi I’ve owned”.' },
      { id: 'g2', label: detail('photo'), lane: check('photo'), visual: 'photo', note: 'Same radius inside and out makes the gap swell at the corners. 16 outside, 8 padding: 8 inside.' },
      { id: 'g3', label: detail('delivery'), lane: check('delivery'), visual: 'delivery', note: 'Already right: an en dash for a range. Leaving it alone is part of the pass.' },
      { id: 'g4', label: detail('focus'), lane: check('focus'), visual: 'focus', note: 'Someone removed the outline and drew nothing instead. Keyboard and switch users lose their place. Add a 2 px ring with a 2 px gap.' },
      { id: 'g5', label: detail('price'), lane: check('price'), visual: 'price', note: 'Ranges take an en dash: ₹2,400–₹3,100. A hyphen joins words, like “co-op”.' },
      { id: 'g6', label: detail('coop'), lane: check('coop'), visual: 'coop', note: 'The longest real name is the test. Wrap to two lines, then truncate with the full name on tap; never cut a weaver’s co-op mid-word with no way to read it.' },
      { id: 'g7', label: detail('summary'), lane: check('summary'), visual: 'summary', note: 'Proportional figures make a 1 narrower than an 8, so the places drift. Switch on tabular figures in any column of numbers.' },
      { id: 'g8', label: detail('sheet'), lane: check('sheet'), visual: 'sheet', note: '20 outside, 12 padding, 8 inside: the corners run parallel. Ship it.' },
      { id: 'g9', label: detail('tabs'), lane: check('tabs'), visual: 'tabs', note: 'One heavier icon looks selected when it isn’t. One stroke width for the set: 1.5 px.' },
      { id: 'g10', label: detail('wishlist'), lane: check('wishlist'), visual: 'wishlist', note: 'An empty state is a first impression. Say what goes here and give one way to start: “Tap ♡ on any sari to save it here”, and the Diwali edit below.' },
      { id: 'g11', label: detail('heading'), lane: check('heading'), visual: 'heading', note: 'A single word alone on a heading’s last line looks like a mistake. Rebalance the lines (text-wrap: balance) or edit the copy.' },
      { id: 'g12', label: detail('dates'), lane: check('dates'), visual: 'dates', note: 'Tabular figures, right-aligned: the dates already line up. Ship it.' },
    ],
  },
  gap: {
    id: 'gap', from: 16, at: 20.6,
    prompt: 'Kavya’s pass reaches the delivery sheet: 20 px corners, 12 px padding, an 8 px map inside. What should she do?',
    options: [{ id: 'a', label: 'Round the map to 20 px to match the sheet' }, { id: 'b', label: 'Leave it: 20 − 12 = 8, so the corners already run parallel' }, { id: 'c', label: 'Square off the map' }],
    correct: 'b', explanation: 'A pass fixes what’s wrong. Changing what’s already right adds risk and noise to the change list.',
  },
  takeaways: [
    { title: 'Zoom in, with real content', body: 'Look at 400%, with the longest names and real prices, in both themes.' },
    { title: 'Type, shape, state', body: 'Quotes, dashes, figures and rags. Radii and strokes. Focus, long content and empty. Every screen, every time.' },
    { title: 'Write every change down', body: 'One line each: before, after, why. Engineers can build it; reviewers can check it.' },
    { title: 'Leave what’s right', body: 'Polish is fixing what’s wrong, not changing things to show you looked.' },
  ],
  quiz: {
    seconds: 15,
    questions: [
      { id: 'q1', prompt: 'A 24 px card with 16 px padding. Inner radius?', options: [{ id: 'a', label: '8 px' }, { id: 'b', label: '24 px' }, { id: 'c', label: '16 px' }], correct: 'a', explanation: 'Outer minus padding: 24 − 16 = 8.' },
      { id: 'q2', prompt: '₹2,400 to ₹3,100 takes…', options: [{ id: 'a', label: 'A hyphen' }, { id: 'b', label: 'An en dash' }, { id: 'c', label: 'A slash' }], correct: 'b', explanation: 'En dashes mark ranges.' },
      { id: 'q3', prompt: 'Digits in a column don’t line up. Switch on…', options: [{ id: 'a', label: 'Tabular figures' }, { id: 'b', label: 'Bold' }, { id: 'c', label: 'Letter-spacing' }], correct: 'a', explanation: 'Every digit the same width.' },
      { id: 'q4', prompt: 'outline: none with nothing in its place breaks…', options: [{ id: 'a', label: 'Dark mode' }, { id: 'b', label: 'Keyboard focus' }, { id: 'c', label: 'Hover' }], correct: 'b', explanation: 'Keyboard users can’t see where they are.' },
    ],
  },
  ladder: [
    { id: 'l1', prompt: 'Why do small details matter if nobody can name them?', hint: 'What do people say about the page?', options: [{ id: 'a', label: 'They don’t; only designers notice' }, { id: 'b', label: 'Together they decide whether a product feels careful and trustworthy, which matters when someone is spending ₹3,000 on a sari' }, { id: 'c', label: 'They improve SEO' }, { id: 'd', label: 'Because reviews ask for them' }], correct: 'b', explanation: 'People feel polish as trust long before they could point at a single fix.' },
    { id: 'l2', prompt: 'Why write a change list instead of handing over the polished file?', hint: 'How would someone check 31 changes?', options: [{ id: 'a', label: 'For the designer’s portfolio' }, { id: 'b', label: 'Each change can be built, reviewed and kept; comparing two files by eye misses most of them' }, { id: 'c', label: 'Engineers prefer reading' }, { id: 'd', label: 'Figma can’t show changes' }], correct: 'b', explanation: 'A list turns taste into work items with reasons, and stops the same mistakes coming back.' },
    { id: 'l3', prompt: 'Six of Kavya’s fixes are the same tabular-figures problem on different screens. What’s the better fix?', hint: 'Where does the problem come from?', options: [{ id: 'a', label: 'Fix all six by hand' }, { id: 'b', label: 'Fix it once in the design system’s number and price styles, so every screen gets it' }, { id: 'c', label: 'Ignore it' }, { id: 'd', label: 'Change the font' }], correct: 'b', explanation: 'A detail that repeats is a system bug. Fix it at the source.' },
    { id: 'l4', prompt: 'The co-op name is 50 characters and the title fits 28. What’s the best rule?', hint: 'The name matters to the weaver and the buyer.', options: [{ id: 'a', label: 'Cut it at 28 characters' }, { id: 'b', label: 'Wrap to two lines, then truncate with an ellipsis and the full name on tap' }, { id: 'c', label: 'Shrink the font until it fits' }, { id: 'd', label: 'Ask co-ops to shorten their names' }], correct: 'b', explanation: 'Give long content room first, then a graceful limit, and always a way to read it in full.' },
    { id: 'l5', prompt: 'A week before launch, Kavya has 31 fixes and time for 20. How should she choose?', hint: 'Not all details are equal.', options: [{ id: 'a', label: 'The easiest 20' }, { id: 'b', label: 'First what breaks use or trust (focus, overflow, wrong prices), then what repeats across many screens, then the rest after launch' }, { id: 'c', label: 'The ones on the home screen only' }, { id: 'd', label: 'Delay the launch' }], correct: 'b', explanation: 'Rank by harm and reach. A missing focus ring stops people; a straight quote only costs a little trust.' },
  ],
};
