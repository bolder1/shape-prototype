// Episodes for chapter ui.2 · Typography. Drafts by Claude, for review.
import type { Episode } from '../episode';

export const ui2_1: Episode = {
  lessonId: 'ui.2-1',
  hook: 'Every letter you read sits on lines you never see. Learn the lines and type stops being a mystery.',
  scene: {
    id: 'type-anatomy', duration: 34,
    beats: [
      { at: 0, title: 'Letters sit on a line', body: 'Draw a line under any word. Every letter rests on it: the baseline.' },
      { at: 6, title: 'The x-height', body: 'Lowercase letters stop at the same height, named after the letter x.' },
      { at: 11, title: 'The cap height', body: 'Capitals reach higher, to the cap height.' },
      { at: 16, title: 'Descenders', body: 'Tails on p, g and y hang below the baseline. Leading has to leave room for them.' },
      { at: 22, title: 'Same size, different look', body: 'Two fonts, both 16px. The one with the taller x-height looks bigger and reads better when small.' },
      { at: 29, title: 'Four lines', body: 'Baseline, x-height, cap height, descender. Every font is built on them.' },
    ],
  },
  check: [
    { id: 'c1', prompt: 'What do all the letters rest on?', options: [{ id: 'a', label: 'The cap height' }, { id: 'b', label: 'The baseline' }, { id: 'c', label: 'The descender' }],
      correct: 'b', explanation: 'The baseline is the line every letter sits on. Only tails hang below it.' },
    { id: 'c2', prompt: 'The x-height is the height of…', options: [{ id: 'a', label: 'Lowercase letters like x, a and o' }, { id: 'b', label: 'Capital letters' }, { id: 'c', label: 'The whole line of text' }],
      correct: 'a', explanation: 'It’s the height of lowercase letters without ascenders, named after the x.' },
  ],
  game: {
    id: 'anatomy-pin', title: 'Pin the line',
    instructions: 'A giant word with its four lines drawn in. Read each clue and tap the line it describes.',
    lanes: [
      { id: 'cap', label: 'Cap height', hint: 'Where capital letters stop' },
      { id: 'x', label: 'x-height', hint: 'Where most lowercase letters stop' },
      { id: 'base', label: 'Baseline', hint: 'The line letters sit on' },
      { id: 'desc', label: 'Descender', hint: 'How far tails hang below the baseline' },
    ],
    cards: [
      { id: 'g1', label: 'The top of a capital H', lane: 'cap' },
      { id: 'g2', label: 'Where the top of a lowercase o stops', lane: 'x' },
      { id: 'g3', label: 'The line every letter sits on', lane: 'base' },
      { id: 'g4', label: 'Where the tail of a p ends', lane: 'desc' },
      { id: 'g5', label: 'Raise it and small text gets easier to read at the same size', lane: 'x' },
      { id: 'g6', label: 'The bottom of an icon should line up with this', lane: 'base' },
      { id: 'g7', label: 'With too little leading, these hit the capitals on the next line', lane: 'desc' },
      { id: 'g8', label: 'The top of a capital T in a heading', lane: 'cap' },
    ],
  },
  gap: {
    id: 'gap', from: 22, at: 25.6,
    prompt: 'Both words are set at 16px. Which one looks bigger?',
    options: [{ id: 'a', label: 'The one with the shorter x-height' }, { id: 'b', label: 'They look the same, they’re both 16px' }, { id: 'c', label: 'The one with the taller x-height' }],
    correct: 'c', explanation: 'Font size measures the box, not the letters. A taller x-height makes lowercase bigger inside the same box.',
  },
  takeaways: [
    { title: 'The baseline', body: 'Every letter sits on it. Align icons and other elements to it.' },
    { title: 'x-height decides size', body: 'Fonts at the same size can look bigger or smaller. A tall x-height reads better when small.' },
    { title: 'Leave room for tails', body: 'Descenders and capitals need space between lines, which is what leading gives them.' },
  ],
  quiz: {
    seconds: 12,
    questions: [
      { id: 'q1', prompt: 'Letters sit on the…', options: [{ id: 'a', label: 'Baseline' }, { id: 'b', label: 'x-height' }], correct: 'a', explanation: 'The baseline.' },
      { id: 'q2', prompt: 'The tail of a y is a…', options: [{ id: 'a', label: 'Serif' }, { id: 'b', label: 'Descender' }, { id: 'c', label: 'Ligature' }], correct: 'b', explanation: 'It hangs below the baseline.' },
      { id: 'q3', prompt: 'Capitals reach the…', options: [{ id: 'a', label: 'Baseline' }, { id: 'b', label: 'x-height' }, { id: 'c', label: 'Descender' }, { id: 'd', label: 'Cap height' }], correct: 'd', explanation: 'Cap height.' },
      { id: 'q4', prompt: 'A taller x-height makes text look…', options: [{ id: 'a', label: 'Smaller' }, { id: 'b', label: 'Thinner' }, { id: 'c', label: 'Bigger at the same size' }, { id: 'd', label: 'Italic' }], correct: 'c', explanation: 'More of the box is used by lowercase letters.' },
    ],
  },
  ladder: [
    { id: 'l1', prompt: 'What does the “16px” in font-size actually measure?', hint: 'Not the letters themselves.', options: [{ id: 'a', label: 'The height of a capital letter' }, { id: 'b', label: 'The em box the font is designed in' }, { id: 'c', label: 'The width of the letter m' }, { id: 'd', label: 'The x-height' }], correct: 'b', explanation: 'Size sets the em box. How big the letters are inside it is up to the font’s designer.' },
    { id: 'l2', prompt: 'What are serifs?', hint: 'Look at the ends of the strokes.', options: [{ id: 'a', label: 'Tails below the baseline' }, { id: 'b', label: 'Joined letter pairs' }, { id: 'c', label: 'Small strokes at the ends of letters' }, { id: 'd', label: 'The space between letters' }], correct: 'c', explanation: 'Serif fonts have them; sans-serif (“without serif”) fonts don’t.' },
    { id: 'l3', prompt: 'Ascenders (the tall parts of b, d and h) usually reach…', hint: 'Compare with capitals.', options: [{ id: 'a', label: 'At or slightly above the cap height' }, { id: 'b', label: 'The x-height' }, { id: 'c', label: 'Below the baseline' }, { id: 'd', label: 'Half the x-height' }], correct: 'a', explanation: 'In many fonts ascenders rise a little above the capitals.' },
    { id: 'l4', prompt: 'You put an icon next to a button label and centre both. The icon looks too low. Why?', hint: 'Which part of the text does the eye see?', options: [{ id: 'a', label: 'Icons are always too low' }, { id: 'b', label: 'The font is too thin' }, { id: 'c', label: 'The button is too wide' }, { id: 'd', label: 'The text box includes space for descenders, so centre on the cap height instead' }], correct: 'd', explanation: 'The line box is taller than the visible letters. Centre icons on the cap height or x-height.' },
    { id: 'l5', prompt: 'Why do fonts for small UI text often have a large x-height?', hint: 'Think about 12px labels.', options: [{ id: 'a', label: 'Lowercase letters stay open and legible at small sizes' }, { id: 'b', label: 'They load faster' }, { id: 'c', label: 'They use less ink' }, { id: 'd', label: 'Screens require it' }], correct: 'a', explanation: 'Bigger lowercase letters keep their shapes clear when the text is tiny.' },
  ],
};

export const ui2_2: Episode = {
  lessonId: 'ui.2-2',
  hook: '17px or 18px? If you have to ask, nobody can see the difference. A type scale picks sizes far enough apart to matter.',
  scene: {
    id: 'type-scale', duration: 34,
    beats: [
      { at: 0, title: 'Sizes picked by eye', body: 'A reading screen with text at 15, 17, 18, 22 and 23px.' },
      { at: 6, title: 'Which one is the heading?', body: '17 and 18 look the same. So do 22 and 23. The hierarchy is muddy.' },
      { at: 11, title: 'A base and a ratio', body: 'Start at 16px for body text. Multiply by 1.25 for each step.' },
      { at: 16, title: 'The scale climbs', body: '13, 16, 20, 25, 31, 39. Each step is clearly bigger than the last.' },
      { at: 22, title: 'Snap to the steps', body: 'Every piece of text takes a step. Title, heading, body and caption now look like what they are.' },
      { at: 29, title: 'Fewer sizes, clearer levels', body: 'A handful of sizes, far enough apart to read as different levels.' },
    ],
  },
  check: [
    { id: 'c1', prompt: 'What was wrong with the first screen?', options: [{ id: 'a', label: 'The text was too big' }, { id: 'b', label: 'Sizes were so close that levels blurred' }, { id: 'c', label: 'It used a serif font' }],
      correct: 'b', explanation: '17 vs 18 and 22 vs 23 are too close to read as different levels.' },
    { id: 'c2', prompt: 'How was the scale built?', options: [{ id: 'a', label: 'A base size multiplied by a ratio' }, { id: 'b', label: 'Adding 1px each time' }, { id: 'c', label: 'Whatever looked right' }],
      correct: 'a', explanation: '16 × 1.25 = 20, × 1.25 = 25, and so on.' },
  ],
  game: {
    id: 'size-it', title: 'Size the screen',
    instructions: 'A reading screen with every size missing. Pick a step from the scale for each piece of text and watch the screen take shape.',
    lanes: [
      { id: 'display', label: 'Display · 39', hint: 'The one thing that leads the page' },
      { id: 'heading', label: 'Heading · 25', hint: 'Starts a new section' },
      { id: 'body', label: 'Body · 16', hint: 'Text people read in full' },
      { id: 'small', label: 'Small · 13', hint: 'Supporting details' },
    ],
    cards: [
      { id: 'g1', label: 'The article title', lane: 'display', visual: 'title' },
      { id: 'g2', label: 'The byline and reading time', lane: 'small', visual: 'byline' },
      { id: 'g3', label: 'The caption under the photo', lane: 'small', visual: 'caption' },
      { id: 'g4', label: 'The first section heading', lane: 'heading', visual: 'section1' },
      { id: 'g5', label: 'The first paragraph', lane: 'body', visual: 'para1' },
      { id: 'g6', label: 'The second section heading', lane: 'heading', visual: 'section2' },
      { id: 'g7', label: 'The second paragraph', lane: 'body', visual: 'para2' },
      { id: 'g8', label: 'The tab bar labels', lane: 'small', visual: 'tabs' },
    ],
  },
  gap: {
    id: 'gap', from: 16, at: 21.6,
    prompt: 'The headings were 22 and 23px. On the new scale, where should a section heading go?',
    options: [{ id: 'a', label: 'Keep 22 and 23, they’re close enough' }, { id: 'b', label: 'One step: 25px for every section heading' }, { id: 'c', label: '17px, the same as body text' }],
    correct: 'b', explanation: 'Every heading of the same level gets the same step, far enough above body text to read as a heading.',
  },
  takeaways: [
    { title: 'Base × ratio', body: 'Start at your body size and multiply by one ratio, such as 1.25, for each step.' },
    { title: 'Far enough apart', body: 'Steps must be clearly different. 17 and 18 aren’t two levels; they’re one level drawn twice.' },
    { title: 'Same role, same step', body: 'Every section heading uses the same size. Name the steps (display, heading, body, small) so the team reuses them.' },
  ],
  quiz: {
    seconds: 12,
    questions: [
      { id: 'q1', prompt: '16 × 1.25 =', options: [{ id: 'a', label: '18' }, { id: 'b', label: '20' }], correct: 'b', explanation: '16 × 1.25 = 20.' },
      { id: 'q2', prompt: 'Body text usually sits at…', options: [{ id: 'a', label: 'The base step' }, { id: 'b', label: 'The biggest step' }, { id: 'c', label: 'The smallest step' }], correct: 'a', explanation: 'The base is the body size.' },
      { id: 'q3', prompt: 'A photo caption usually gets…', options: [{ id: 'a', label: 'Display' }, { id: 'b', label: 'Heading' }, { id: 'c', label: 'Small' }, { id: 'd', label: 'A random size' }], correct: 'c', explanation: 'It supports the photo.' },
      { id: 'q4', prompt: 'Why not use 17 and 18 for two levels?', options: [{ id: 'a', label: 'Odd numbers are banned' }, { id: 'b', label: 'Browsers round them' }, { id: 'c', label: 'They’re too slow' }, { id: 'd', label: 'People can’t tell them apart' }], correct: 'd', explanation: 'Levels must look different.' },
    ],
  },
  ladder: [
    { id: 'l1', prompt: 'A dense dashboard needs many small sizes. Which ratio suits it?', hint: 'Smaller ratio, smaller jumps.', options: [{ id: 'a', label: 'A small ratio like 1.125' }, { id: 'b', label: 'A huge ratio like 2' }, { id: 'c', label: 'No ratio' }, { id: 'd', label: 'Golden ratio only' }], correct: 'a', explanation: 'Small ratios give more steps that fit tight spaces. Editorial pages can use bigger ratios.' },
    { id: 'l2', prompt: 'Size isn’t the only way to show a level. What else works?', hint: 'Think beyond size.', options: [{ id: 'a', label: 'Only colour' }, { id: 'b', label: 'Weight, colour and spacing as well as size' }, { id: 'c', label: 'Underlining everything' }, { id: 'd', label: 'Nothing else works' }], correct: 'b', explanation: 'A bold 16px label can outrank a regular 20px one. Combine size, weight and colour.' },
    { id: 'l3', prompt: 'On phones, a 39px display size can feel huge. Common fix?', hint: 'Scales can change by screen.', options: [{ id: 'a', label: 'Use 39px everywhere anyway' }, { id: 'b', label: 'Drop display text entirely' }, { id: 'c', label: 'Use a smaller ratio on small screens, so the top steps shrink' }, { id: 'd', label: 'Make body text bigger to match' }], correct: 'c', explanation: 'Many systems use a tighter ratio on mobile, so headings shrink while body stays put.' },
    { id: 'l4', prompt: 'The scale gives 31.25px. What do you do with the decimal?', hint: 'Screens draw whole pixels best.', options: [{ id: 'a', label: 'Keep all decimals' }, { id: 'b', label: 'Add 0.75' }, { id: 'c', label: 'Pick a new ratio' }, { id: 'd', label: 'Round to a whole number, like 31 or 32' }], correct: 'd', explanation: 'Round the steps; the ratio is a guide, not a law.' },
    { id: 'l5', prompt: 'How do you stop the team inventing new sizes?', hint: 'Make the right size the easy one.', options: [{ id: 'a', label: 'Named text styles in Figma and tokens in code' }, { id: 'b', label: 'Ask everyone to remember' }, { id: 'c', label: 'Ban headings' }, { id: 'd', label: 'Only use one size' }], correct: 'a', explanation: 'Text styles like “Heading/25” make the scale the default choice.' },
  ],
};

export const ui2_3: Episode = {
  lessonId: 'ui.2-3',
  hook: 'Fonts are voices. Two can have a conversation. Five is a shouting match.',
  scene: {
    id: 'font-pairing', duration: 34,
    beats: [
      { at: 0, title: 'Five fonts, one poster', body: 'A café menu with a different font on every line. Each one is shouting.' },
      { at: 6, title: 'Every font is a voice', body: 'Strip it back to two: one for headings, one for reading.' },
      { at: 11, title: 'Contrast, not conflict', body: 'A serif heading over a sans body. Clearly different, so each has a job.' },
      { at: 17, title: 'Too alike', body: 'Two sans fonts that look almost the same. People don’t see a pairing; they see a mistake.' },
      { at: 23, title: 'One family, many weights', body: 'Regular, semibold and bold of a single font. Hierarchy without a second voice.' },
      { at: 29, title: 'Pick a pair on purpose', body: 'Two fonts at most, clearly different, and the body font chosen for reading.' },
    ],
  },
  check: [
    { id: 'c1', prompt: 'What was wrong with the first menu?', options: [{ id: 'a', label: 'Too many fonts competing' }, { id: 'b', label: 'The text was too small' }, { id: 'c', label: 'It had no colour' }],
      correct: 'a', explanation: 'Five fonts means five voices. Nothing leads.' },
    { id: 'c2', prompt: 'Why did the serif + sans pair work?', options: [{ id: 'a', label: 'Serifs are always better' }, { id: 'b', label: 'They look alike' }, { id: 'c', label: 'They’re clearly different, so each has a job' }],
      correct: 'c', explanation: 'Clear contrast tells people which text is a heading and which is for reading.' },
  ],
  game: {
    id: 'pair-judge', title: 'Pair or clash?',
    instructions: 'Each card sets a heading and a paragraph in real fonts. Does the pairing work, or do the fonts clash?',
    lanes: [
      { id: 'works', label: 'Works', hint: 'Clearly different fonts, easy to read' },
      { id: 'clash', label: 'Clashes', hint: 'Too alike, too many, or hard to read' },
    ],
    cards: [
      { id: 'g1', label: 'A serif heading over sans body text', lane: 'works', visual: 'serif|700|sans|400', note: 'Clear contrast, and the sans body is easy to read on screen.' },
      { id: 'g2', label: 'Verdana heading over Tahoma body', lane: 'clash', visual: 'verdana|700|tahoma|400', note: 'They’re nearly the same font. Pick one and use weight for contrast.' },
      { id: 'g3', label: 'One sans family: bold heading, regular body', lane: 'works', visual: 'sans|800|sans|400', note: 'One voice, with weight doing the work.' },
      { id: 'g4', label: 'A paragraph set in a script font', lane: 'clash', visual: 'sans|700|script|400', note: 'Script is for a word or two. In paragraphs it’s slow and tiring to read.' },
      { id: 'g5', label: 'Five different fonts on one card', lane: 'clash', visual: 'five', note: 'Every font is another voice. Two is plenty.' },
      { id: 'g6', label: 'A bold display font for a short headline, a serif for reading', lane: 'works', visual: 'display|400|serif|400', note: 'A loud headline works when it’s short and the body stays quiet.' },
      { id: 'g7', label: 'Georgia heading over Times body', lane: 'clash', visual: 'serif|700|times|400', note: 'Two serifs this close look like a mix-up. Use one serif in two weights.' },
      { id: 'g8', label: 'Heading and body in the same font, weight and size', lane: 'clash', visual: 'sans|400|sans|400|flat', note: 'No contrast at all: the heading doesn’t read as a heading. Change size or weight.' },
      { id: 'g9', label: 'One serif family: bold heading, regular body', lane: 'works', visual: 'serif|700|serif|400', note: 'One family keeps it calm. Weight sets the heading apart.' },
      { id: 'g10', label: 'A short script heading over sans body text', lane: 'works', visual: 'script|400|sans|400', note: 'Script works for a short, decorative heading while the body stays readable.' },
    ],
  },
  gap: {
    id: 'gap', from: 17, at: 22.6,
    prompt: 'The two sans fonts look almost the same. What do you do?',
    options: [{ id: 'a', label: 'Add a third font to break the tie' }, { id: 'b', label: 'Use one of them for both, with different weights' }, { id: 'c', label: 'Keep both, nobody will notice' }],
    correct: 'b', explanation: 'One family in two weights gives contrast without looking like a mistake.',
  },
  takeaways: [
    { title: 'Two fonts at most', body: 'Every extra font is another voice. One or two is enough for most products.' },
    { title: 'Contrast clearly', body: 'Pair fonts that are obviously different, such as a serif with a sans. Near-twins look like errors.' },
    { title: 'Body font first', body: 'Choose the reading font for comfort. Character can come from the heading font.' },
  ],
  quiz: {
    seconds: 12,
    questions: [
      { id: 'q1', prompt: 'How many fonts does most UI need?', options: [{ id: 'a', label: 'One or two' }, { id: 'b', label: 'Five or more' }], correct: 'a', explanation: 'Fewer voices, calmer pages.' },
      { id: 'q2', prompt: 'Two nearly identical sans fonts…', options: [{ id: 'a', label: 'Pair perfectly' }, { id: 'b', label: 'Look like a mistake' }, { id: 'c', label: 'Load faster' }], correct: 'b', explanation: 'Pair fonts that clearly differ.' },
      { id: 'q3', prompt: 'Script fonts are best for…', options: [{ id: 'a', label: 'Long paragraphs' }, { id: 'b', label: 'Form labels' }, { id: 'c', label: 'Error messages' }, { id: 'd', label: 'A short decorative heading' }], correct: 'd', explanation: 'A word or two, not paragraphs.' },
      { id: 'q4', prompt: 'One family in several weights gives…', options: [{ id: 'a', label: 'No hierarchy' }, { id: 'b', label: 'Slower pages' }, { id: 'c', label: 'Hierarchy without a second font' }, { id: 'd', label: 'Clashing voices' }], correct: 'c', explanation: 'Weight does the work.' },
    ],
  },
  ladder: [
    { id: 'l1', prompt: 'Why do fonts with similar x-heights often pair well?', hint: 'Look at them side by side.', options: [{ id: 'a', label: 'Mixed on one line, their lowercase letters look the same size' }, { id: 'b', label: 'They cost less' }, { id: 'c', label: 'They load together' }, { id: 'd', label: 'It doesn’t matter at all' }], correct: 'a', explanation: 'Matching x-heights keep a mixed line looking even.' },
    { id: 'l2', prompt: 'What’s a superfamily?', hint: 'One designer, several styles.', options: [{ id: 'a', label: 'A font with only bold weights' }, { id: 'b', label: 'Serif and sans versions designed to work together' }, { id: 'c', label: 'Any five fonts' }, { id: 'd', label: 'A font for logos only' }], correct: 'b', explanation: 'Superfamilies (like Source Serif and Source Sans) are pairs designed as a set.' },
    { id: 'l3', prompt: 'Your app must support Hindi and Tamil as well as English. What matters when choosing fonts?', hint: 'Not every font has every script.', options: [{ id: 'a', label: 'Nothing, all fonts support every language' }, { id: 'b', label: 'Use a script font' }, { id: 'c', label: 'Check each script is covered, with matching weights and sizes' }, { id: 'd', label: 'Use images of text' }], correct: 'c', explanation: 'Families like Noto cover many scripts with a consistent look.' },
    { id: 'l4', prompt: 'Every font file adds download time. A sensible budget for a mobile web app?', hint: 'Fewer files, faster first paint.', options: [{ id: 'a', label: 'As many weights as the designer likes' }, { id: 'b', label: 'Ten weights of two fonts' }, { id: 'c', label: 'Every italic too' }, { id: 'd', label: 'Two or three weights, or one variable font' }], correct: 'd', explanation: 'Each weight is a file. A variable font holds many weights in one.' },
    { id: 'l5', prompt: 'Should a mono font be used for body text in a banking app?', hint: 'Where does mono shine?', options: [{ id: 'a', label: 'No: keep mono for code or figures where equal widths help' }, { id: 'b', label: 'Yes, it looks technical' }, { id: 'c', label: 'Yes, it’s more secure' }, { id: 'd', label: 'Only in dark mode' }], correct: 'a', explanation: 'Monospaced text is slower to read in paragraphs. Use tabular figures for numbers instead.' },
  ],
};

export const ui2_4: Episode = {
  lessonId: 'ui.2-4',
  hook: 'A line too long and you lose your place. Lines too close and they blur. Two settings decide whether people keep reading.',
  scene: {
    id: 'measure', duration: 34,
    beats: [
      { at: 0, title: 'A line that never ends', body: 'Body text stretched across a wide monitor: about 130 characters a line.' },
      { at: 6, title: 'Lost the line', body: 'At the end of each line the eye jumps back and lands on the wrong one.' },
      { at: 11, title: 'Narrow the measure', body: 'Cap the text at 45 to 75 characters. The jump back gets short and sure.' },
      { at: 17, title: 'Lines packed tight', body: 'Line height 1.0. Tails touch capitals on the next line and the text turns grey.' },
      { at: 22, title: 'Open the leading', body: 'Line height 1.5. Each line has room, and the eye glides.' },
      { at: 29, title: 'Measure and leading', body: '45–75 characters, about 1.5 line height. Big headings get tighter leading.' },
    ],
  },
  check: [
    { id: 'c1', prompt: 'Why was the wide paragraph hard to read?', options: [{ id: 'a', label: 'The font was too small' }, { id: 'b', label: 'The eye lost its place jumping back to the next line' }, { id: 'c', label: 'The colour was wrong' }],
      correct: 'b', explanation: 'Long lines make the return trip long, so the eye lands on the wrong line.' },
    { id: 'c2', prompt: 'What range of characters per line is comfortable?', options: [{ id: 'a', label: '20–30' }, { id: 'b', label: '100–140' }, { id: 'c', label: '45–75' }],
      correct: 'c', explanation: 'About 45–75 characters, with 65 often used as a target.' },
  ],
  game: {
    id: 'measure-tune', title: 'Tune the text',
    instructions: 'First, tune a paragraph yourself with two sliders. Then judge each paragraph: is the line length wrong, the line height wrong, or does it read well?',
    lanes: [
      { id: 'measure', label: 'Fix line length', hint: 'Lines are too long or too short' },
      { id: 'leading', label: 'Fix line height', hint: 'Lines are too close or too far apart' },
      { id: 'ok', label: 'Reads well', hint: 'About 45–75 characters, line height about 1.4–1.7' },
    ],
    cards: [
      { id: 'g1', label: 'About 100 characters a line, line height 1.5', lane: 'measure', visual: '100|1.5' },
      { id: 'g2', label: 'About 65 characters a line, line height 1.0', lane: 'leading', visual: '65|1' },
      { id: 'g3', label: 'About 62 characters a line, line height 1.5', lane: 'ok', visual: '62|1.5' },
      { id: 'g4', label: 'About 28 characters a line, line height 1.5', lane: 'measure', visual: '28|1.5' },
      { id: 'g5', label: 'About 58 characters a line, line height 2.4', lane: 'leading', visual: '58|2.4' },
      { id: 'g6', label: 'About 50 characters a line, line height 1.6', lane: 'ok', visual: '50|1.6' },
      { id: 'g7', label: 'About 90 characters a line, line height 1.45', lane: 'measure', visual: '90|1.45' },
      { id: 'g8', label: 'About 70 characters a line, line height 1.1', lane: 'leading', visual: '70|1.1' },
      { id: 'g9', label: 'About 66 characters a line, line height 1.55', lane: 'ok', visual: '66|1.55' },
    ],
  },
  gap: {
    id: 'gap', from: 17, at: 21.6,
    prompt: 'The lines are touching each other. What do you change?',
    options: [{ id: 'a', label: 'The line height, to about 1.5' }, { id: 'b', label: 'The font, to a bolder one' }, { id: 'c', label: 'The line length, to 130 characters' }],
    correct: 'a', explanation: 'Line height adds room between lines. About 1.5× the font size suits body text.',
  },
  takeaways: [
    { title: '45–75 characters', body: 'Cap the width of reading text so lines stay in this range on any screen.' },
    { title: 'Line height about 1.5', body: 'Body text reads best at 1.4–1.7× the font size. Too tight blurs; too loose scatters.' },
    { title: 'Big text, tighter leading', body: 'Headings already have big letters, so 1.1–1.3 keeps their lines together.' },
  ],
  quiz: {
    seconds: 12,
    questions: [
      { id: 'q1', prompt: '130 characters a line is…', options: [{ id: 'a', label: 'Comfortable' }, { id: 'b', label: 'Too long' }], correct: 'b', explanation: 'Aim for 45–75.' },
      { id: 'q2', prompt: 'Line height for body text?', options: [{ id: 'a', label: 'About 1.5' }, { id: 'b', label: 'Exactly 1.0' }, { id: 'c', label: 'About 3' }], correct: 'a', explanation: '1.4–1.7 works for most body text.' },
      { id: 'q3', prompt: 'Big headings usually need…', options: [{ id: 'a', label: 'More leading than body' }, { id: 'b', label: 'No leading' }, { id: 'c', label: 'Leading of 3' }, { id: 'd', label: 'Tighter leading than body' }], correct: 'd', explanation: 'Big letters already create space; 1.1–1.3 keeps them together.' },
      { id: 'q4', prompt: 'The simplest way to fix very long lines?', options: [{ id: 'a', label: 'Smaller font' }, { id: 'b', label: 'Justify the text' }, { id: 'c', label: 'A maximum width on the text' }, { id: 'd', label: 'Bold everything' }], correct: 'c', explanation: 'Cap the width at about 65 characters.' },
    ],
  },
  ladder: [
    { id: 'l1', prompt: 'In CSS, which unit sets a width in characters?', hint: 'Named after a character.', options: [{ id: 'a', label: 'ch, as in max-width: 65ch' }, { id: 'b', label: 'px only' }, { id: 'c', label: 'vh' }, { id: 'd', label: 'deg' }], correct: 'a', explanation: '1ch is the width of the “0” character, so 65ch is roughly 65 characters of text.' },
    { id: 'l2', prompt: 'On a phone, body text often runs 35–45 characters. Is that a problem?', hint: 'Small screens, different rules.', options: [{ id: 'a', label: 'Yes, always add more width' }, { id: 'b', label: 'No: shorter lines are normal on phones; just don’t make the font tiny to fit more' }, { id: 'c', label: 'Yes, rotate the phone' }, { id: 'd', label: 'Only for serif fonts' }], correct: 'b', explanation: 'Keep body text readable (about 16px). Fewer characters a line is fine on a phone.' },
    { id: 'l3', prompt: 'Why can justified text read badly on narrow screens?', hint: 'Look between the words.', options: [{ id: 'a', label: 'It uses more ink' }, { id: 'b', label: 'Browsers can’t render it' }, { id: 'c', label: 'It stretches the gaps between words into uneven holes' }, { id: 'd', label: 'It hides punctuation' }], correct: 'c', explanation: 'With few words per line, justification creates rivers of white. Left-align instead.' },
    { id: 'l4', prompt: 'Line height is set to 24px for 16px body text. The font size changes to 20px. What happens?', hint: 'A fixed number doesn’t grow.', options: [{ id: 'a', label: 'The leading grows with it' }, { id: 'b', label: 'Nothing changes' }, { id: 'c', label: 'The font shrinks' }, { id: 'd', label: 'Lines get cramped, because 24px is now only 1.2×' }], correct: 'd', explanation: 'Use a unitless line height like 1.5 so it scales with the font size.' },
    { id: 'l5', prompt: 'A long paragraph has a wide measure (75 characters). Should its leading go up or down?', hint: 'The return trip.', options: [{ id: 'a', label: 'Up a little: longer lines need a bit more leading to find the next one' }, { id: 'b', label: 'Down to 1.0' }, { id: 'c', label: 'No connection between them' }, { id: 'd', label: 'Remove leading' }], correct: 'a', explanation: 'Longer lines benefit from slightly more leading, so the eye can track back.' },
  ],
};
