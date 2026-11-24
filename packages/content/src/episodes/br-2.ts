// Episodes for chapter br.2 · Visual identity. Drafts by Claude, for review.
// Sukoon is the meditation app from br.1: for busy professionals who can't switch off, calm in five minutes; calm, warm
// and expert. Kabir Malhotra founded it; Ishita Rao is the brand designer who builds its identity here. The marks, the
// kit and the misuses, and the rules they're judged by, are in ../identity and tested there.
import type { Episode } from '../episode';
import { SUKOON_KIT, SUKOON_MARKS, SUKOON_USES, type SukoonKitKey, type SukoonMark, type SukoonUse } from '../identity';

const mark = (k: SukoonMark) => SUKOON_MARKS[k].text;
const kit = (k: SukoonKitKey) => `${SUKOON_KIT[k].name}: ${SUKOON_KIT[k].text.charAt(0).toLowerCase()}${SUKOON_KIT[k].text.slice(1)}`;
const use = (k: SukoonUse) => SUKOON_USES[k].text;

export const br2_1: Episode = {
  lessonId: 'br.2-1',
  hook: 'Kabir wanted a logo by Friday and a gradient sunset he’d already found. Ishita asked for a week and forty pencil sketches.',
  scene: {
    id: 'logo-process', duration: 36,
    beats: [
      { at: 0, title: '“A logo by Friday”', body: 'Kabir has a gradient sunset saved on his phone. Ishita opens the brand platform instead: calm, warm, expert; calm in five minutes.' },
      { at: 6, title: 'Words before shapes', body: 'Calm: still water, dusk, a slow breath out. Warm: sunlight, hands, a cup of chai. Expert: precise, steady. Five minutes: a pause.' },
      { at: 11, title: 'Forty thumbnails', body: 'Twenty minutes, a pencil, boxes the size of a stamp. The obvious ideas come first and get used up: lotuses, suns, circles.' },
      { at: 16, title: 'Three on the wall', body: 'A fine-line mandala, Kabir’s gradient sunset, and a half-sun rising over a line, like one slow breath out.' },
      { at: 21, title: 'Test them small', body: 'At 16 px, in a browser tab, the mandala is a grey smudge. In one colour, the sunset is a plain blob. The half-sun still reads.' },
      { at: 26, title: 'Beside the rivals', body: 'Next to the category: lotuses, ensō circles, glowing heads. The half-sun looks like none of them.' },
      { at: 31, title: 'Refine, then lock up', body: 'The arc thickened where it meets the line, the line shortened so it balances, then the name beside it: Sukoon, सुकून.' },
    ],
  },
  check: [
    { id: 'c1', prompt: 'Why did Ishita sketch forty thumbnails instead of perfecting one?', options: [{ id: 'a', label: 'To bill more hours' }, { id: 'b', label: 'The obvious ideas come first; volume gets past them to something ownable' }, { id: 'c', label: 'The founder asked for forty' }],
      correct: 'b', explanation: 'Quantity first, quality second. Cheap sketches make it easy to throw ideas away.' },
    { id: 'c2', prompt: 'What happened to the gradient sunset in one colour?', options: [{ id: 'a', label: 'It looked better' }, { id: 'b', label: 'It became a plain blob: the idea lived in the gradient' }, { id: 'c', label: 'Nothing changed' }],
      correct: 'b', explanation: 'A mark has to work on a stamp, a fax, an embroidered cap. If colour is the idea, it fails there.' },
  ],
  game: {
    id: 'logo-stress', title: 'Stress-test the marks',
    instructions: 'Here are eight marks from Ishita’s wall. Run the lenses on each one: 16 px, one colour, reversed, beside the rivals. Then say the first test it fails, or that it’s ready.',
    lanes: [
      { id: 'small', label: 'Falls apart small', hint: 'Lines or gaps under a pixel at 16 px' },
      { id: 'mono', label: 'Needs colour', hint: 'Lost in one flat colour' },
      { id: 'generic', label: 'Looks like everyone', hint: 'The category’s stock symbol' },
      { id: 'ready', label: 'Ready to refine', hint: 'Survives every test' },
    ],
    cards: [
      { id: 'g1', label: mark('mandala'), lane: 'small', visual: 'mandala', note: 'Its petals are 2.5 units wide on a 96-unit drawing: under half a pixel at 16 px. In a tab it’s a grey smudge.' },
      { id: 'g2', label: mark('breath'), lane: 'ready', visual: 'breath', note: 'A 12-unit stroke is 2 px at icon size, it’s one flat colour, and nothing else in the category looks like it. This is the one Ishita refines.' },
      { id: 'g3', label: mark('dusk'), lane: 'mono', visual: 'dusk', note: 'The idea is the gradient. In one colour it’s a plain circle, so it dies on a rubber stamp, an embroidered cap or a one-colour newspaper ad.' },
      { id: 'g4', label: mark('lotus'), lane: 'generic', visual: 'lotus', note: 'Clean and simple, but it’s the symbol of every yoga studio and wellness app. Nobody would remember whose it was.' },
      { id: 'g5', label: mark('rays'), lane: 'small', visual: 'rays', note: 'The gaps between rays near the centre are 4 units: two-thirds of a pixel at 16 px, so they fill in. Fewer, thicker rays might survive.' },
      { id: 'g6', label: mark('overlap'), lane: 'mono', visual: 'overlap', note: 'The meaning is where the two colours mix into a third. In one colour the overlap disappears and it’s just two rings.' },
      { id: 'g7', label: mark('pause'), lane: 'ready', visual: 'pause', note: 'Bold strokes, one colour, and an S that’s Sukoon’s own. A strong runner-up.' },
      { id: 'g8', label: mark('enso'), lane: 'generic', visual: 'enso', note: 'The ensō is lovely and already used by countless meditation brands. Beside the rivals it disappears.' },
    ],
  },
  gap: {
    id: 'gap', from: 16, at: 20.6,
    prompt: 'Three marks are on the wall and Kabir wants to start polishing his sunset. What should Ishita do first?',
    options: [{ id: 'a', label: 'Polish all three in full colour' }, { id: 'b', label: 'Test all three: at 16 px, in one colour and beside the rivals' }, { id: 'c', label: 'Pick the one Kabir likes' }],
    correct: 'b', explanation: 'Tests are cheap and settle arguments. Polishing a mark that fails at 16 px wastes the week.',
  },
  takeaways: [
    { title: 'Start from the platform', body: 'Traits and positioning become words, and words become sketches.' },
    { title: 'Many, small, fast', body: 'Forty thumbnails get past the obvious ideas.' },
    { title: 'Test before you polish', body: '16 px, one colour, reversed, beside the rivals.' },
    { title: 'Then refine', body: 'Line weights, optical balance, and a lockup with the name.' },
  ],
  quiz: {
    seconds: 12,
    questions: [
      { id: 'q1', prompt: 'A logo should work in…', options: [{ id: 'a', label: 'One flat colour' }, { id: 'b', label: 'Only full colour' }], correct: 'a', explanation: 'Stamps, embroidery, one-colour print.' },
      { id: 'q2', prompt: 'A line 3 units wide on a 96-unit mark, shown at 16 px, is…', options: [{ id: 'a', label: '3 px' }, { id: 'b', label: 'Half a pixel, so it blurs' }, { id: 'c', label: '16 px' }], correct: 'b', explanation: '3 × 16 ÷ 96 = 0.5 px.' },
      { id: 'q3', prompt: 'For a meditation app, a lotus mark is risky because…', options: [{ id: 'a', label: 'It’s hard to draw' }, { id: 'b', label: 'Flowers are banned' }, { id: 'c', label: 'Every brand in the category uses one' }], correct: 'c', explanation: 'A stock symbol makes you look like your rivals.' },
      { id: 'q4', prompt: 'When do you refine line weights and balance?', options: [{ id: 'a', label: 'First, before sketching' }, { id: 'b', label: 'After the shortlist has passed its tests' }, { id: 'c', label: 'Never' }, { id: 'd', label: 'After launch' }], correct: 'b', explanation: 'Polish only what survives.' },
    ],
  },
  ladder: [
    { id: 'l1', prompt: 'What’s a lockup?', hint: 'Mark plus name.', options: [{ id: 'a', label: 'A fixed arrangement of the mark and the name, with set spacing and proportions' }, { id: 'b', label: 'A password for the logo files' }, { id: 'c', label: 'A trademark filing' }, { id: 'd', label: 'The logo in black' }], correct: 'a', explanation: 'Usually a horizontal and a stacked version, so nobody arranges them by eye.' },
    { id: 'l2', prompt: 'A circle and a square of the same height sit side by side. The circle looks smaller. What do designers do?', hint: 'Optical, not mathematical.', options: [{ id: 'a', label: 'Nothing: they’re the same height' }, { id: 'b', label: 'Let the circle overshoot slightly above and below, so they look the same size' }, { id: 'c', label: 'Make the square smaller still' }, { id: 'd', label: 'Use only squares' }], correct: 'b', explanation: 'Round shapes overshoot, as the bowl of an O dips below a type’s baseline.' },
    { id: 'l3', prompt: 'Why sketch on paper before going to vector software?', hint: 'Cost of an idea.', options: [{ id: 'a', label: 'Software is expensive' }, { id: 'b', label: 'A pencil sketch takes seconds, so you explore more and get less attached to any one idea' }, { id: 'c', label: 'Clients prefer paper' }, { id: 'd', label: 'Vectors can’t draw curves' }], correct: 'b', explanation: 'Software makes everything look finished too early.' },
    { id: 'l4', prompt: 'Which logo type is a name set in a distinctive way, with no symbol?', hint: 'Like Google’s or FedEx’s.', options: [{ id: 'a', label: 'A pictorial mark' }, { id: 'b', label: 'An emblem' }, { id: 'c', label: 'A wordmark' }, { id: 'd', label: 'A mascot' }], correct: 'c', explanation: 'Wordmarks suit short, distinctive names; symbols help when the name is long or the icon must stand alone.' },
    { id: 'l5', prompt: 'Before Sukoon settles on the half-sun, what should Ishita check legally?', hint: 'Someone may own it already.', options: [{ id: 'a', label: 'Nothing; logos can’t be copied' }, { id: 'b', label: 'That no similar mark is registered for the same kind of service, with a trademark search in India and other markets' }, { id: 'c', label: 'Only the domain name' }, { id: 'd', label: 'The font licence of the sketches' }], correct: 'b', explanation: 'A trademark search before launch is far cheaper than a rebrand after a notice.' },
  ],
};

export const br2_2: Episode = {
  lessonId: 'br.2-2',
  hook: 'The moodboard said peach. White text on peach measured 1.9:1, and Sukoon’s name in Hindi came out as empty boxes.',
  scene: {
    id: 'brand-palette', duration: 36,
    beats: [
      { at: 0, title: 'From the moodboard', body: 'Sand, peach and sage: warm and quiet, the board everyone agreed on. Now they have to work on real screens.' },
      { at: 6, title: 'Peach can’t carry text', body: 'Ishita puts “Begin” in white on a peach button: 1.9:1. Text needs 4.5:1. Peach stays, but as a background.' },
      { at: 11, title: 'A colour nobody owns', body: 'The two biggest meditation apps own blue and orange. Deep sage is free, and white on it measures 7.5:1.' },
      { at: 16, title: '60, 30, 10', body: 'Sand for most of the screen, sage for buttons and the mark, peach for the small warm touches.' },
      { at: 21, title: 'A face that speaks Hindi', body: 'Set in Playfair Display, सुकून turns into empty boxes: no Devanagari. Tiro Devanagari Hindi sets both scripts in one voice.' },
      { at: 26, title: 'Two faces, clear jobs', body: 'Tiro for headlines, 24 px and up. Mukta, a plain humanist sans with Devanagari, for everything else.' },
      { at: 31, title: 'The kit', body: 'Five colours with their text pairs, two typefaces with their sizes. Everything after this is built from it.' },
    ],
  },
  check: [
    { id: 'c1', prompt: 'Why didn’t peach become the button colour?', options: [{ id: 'a', label: 'Kabir disliked it' }, { id: 'b', label: 'White text on it is 1.9:1, far under the 4.5:1 text needs' }, { id: 'c', label: 'Peach is out of fashion' }],
      correct: 'b', explanation: 'A mood colour can be too pale to carry text. It moves to backgrounds and accents.' },
    { id: 'c2', prompt: 'What went wrong with Playfair Display?', options: [{ id: 'a', label: 'It costs money' }, { id: 'b', label: 'It has no Devanagari, so Sukoon’s Hindi text couldn’t be set in it' }, { id: 'c', label: 'It’s too thin' }],
      correct: 'b', explanation: 'A brand face has to cover every script the product ships in.' },
  ],
  game: {
    id: 'kit-pick', title: 'Pick Sukoon’s kit',
    instructions: 'Four jobs, three options each. Try each option on the Sukoon screen and watch what happens to the Hindi, the contrast and the shelf of rivals. Then pick the one that fits.',
    lanes: [
      { id: 'display', label: 'Heading face', hint: 'Latin and Devanagari, with Sukoon’s calm' },
      { id: 'text', label: 'Text face', hint: 'Readable, in English and Hindi' },
      { id: 'action', label: 'Main button', hint: 'White label at 4.5:1, a colour nobody owns' },
      { id: 'session', label: 'Session background', hint: 'Ink text at 4.5:1, and calm' },
    ],
    cards: [
      { id: 'g1', label: kit('playfair'), lane: 'display', visual: 'playfair', note: 'No Devanagari: सुकून falls back to whatever font the phone has, or shows as empty boxes. Half the app would be in a different voice.' },
      { id: 'g2', label: kit('tiro'), lane: 'display', visual: 'tiro', note: 'One calm, bookish voice in both scripts, drawn to work together. This is Sukoon’s heading face.' },
      { id: 'g3', label: kit('baloo'), lane: 'display', visual: 'baloo', note: 'It sets Hindi well, but it’s round and bubbly: it sounds like a children’s app, not an expert one.' },
      { id: 'g4', label: kit('inter'), lane: 'text', visual: 'inter', note: 'A superb interface face, but no Devanagari, so every Hindi line would switch fonts mid-screen.' },
      { id: 'g5', label: kit('yatra'), lane: 'text', visual: 'yatra', note: 'It has both scripts, but a heavy brush poster face shouts. Body text in it would be anything but calm, and tiring to read.' },
      { id: 'g6', label: kit('mukta'), lane: 'text', visual: 'mukta', note: 'Plain, open and readable at 14 px in both scripts. It lets Tiro do the talking.' },
      { id: 'g7', label: kit('peach'), lane: 'action', visual: 'peach', note: 'White on peach is about 1.9:1. People can’t read “Begin”. Keep peach for backgrounds and accents.' },
      { id: 'g8', label: kit('sage'), lane: 'action', visual: 'sage', note: 'White on deep sage is about 7.5:1, and no big meditation app owns green. It becomes Sukoon’s main colour.' },
      { id: 'g9', label: kit('cobalt'), lane: 'action', visual: 'cobalt', note: 'It passes contrast, but it’s the blue of the biggest app on the shelf. Sukoon would look like a copy.' },
      { id: 'g10', label: kit('rani'), lane: 'session', visual: 'rani', note: 'Ink on rani pink passes at about 4.8:1, but a bright pink full screen is the opposite of calm for a breathing session.' },
      { id: 'g11', label: kit('slate'), lane: 'session', visual: 'slate', note: 'Ink on slate is about 1.7:1: the text disappears. A dark session screen needs light text, which is a different job.' },
      { id: 'g12', label: kit('sand'), lane: 'session', visual: 'sand', note: 'Warm, quiet, and ink on sand is well over 10:1. It fills 60% of Sukoon’s screens.' },
    ],
  },
  gap: {
    id: 'gap', from: 21, at: 25.4,
    prompt: 'Playfair Display shows सुकून as empty boxes. What should Ishita do?',
    options: [{ id: 'a', label: 'Keep Playfair for English and let the phone pick a Hindi font' }, { id: 'b', label: 'Choose a face drawn for both Latin and Devanagari, like Tiro Devanagari Hindi' }, { id: 'c', label: 'Drop Hindi from the app' }],
    correct: 'b', explanation: 'A face that covers both scripts keeps one voice across languages.',
  },
  takeaways: [
    { title: 'Traits, then the job', body: 'A face must sound right and set every script you ship.' },
    { title: 'Two faces, clear jobs', body: 'Character for headlines, plain and readable for the rest.' },
    { title: 'Mood colours meet rules', body: 'Text needs 4.5:1. Pale colours become backgrounds.' },
    { title: 'Own a colour', body: 'Check the shelf, then split it about 60, 30, 10.' },
  ],
  quiz: {
    seconds: 12,
    questions: [
      { id: 'q1', prompt: 'Small text needs a contrast of at least…', options: [{ id: 'a', label: '4.5:1' }, { id: 'b', label: '2:1' }], correct: 'a', explanation: 'WCAG AA for body text.' },
      { id: 'q2', prompt: 'Empty boxes in place of Hindi letters mean…', options: [{ id: 'a', label: 'A slow connection' }, { id: 'b', label: 'The font has no Devanagari glyphs' }, { id: 'c', label: 'The phone is in English' }], correct: 'b', explanation: 'Designers call them tofu.' },
      { id: 'q3', prompt: 'In a 60-30-10 split, the 60 is usually…', options: [{ id: 'a', label: 'The accent' }, { id: 'b', label: 'The brightest colour' }, { id: 'c', label: 'The background' }, { id: 'd', label: 'The logo' }], correct: 'c', explanation: 'A quiet base, a main colour, a small accent.' },
      { id: 'q4', prompt: 'A new brand picks the exact blue of its biggest rival. The risk?', options: [{ id: 'a', label: 'None' }, { id: 'b', label: 'Blue is too dark' }, { id: 'c', label: 'People mistake it for, or think it’s copying, the rival' }, { id: 'd', label: 'It fails contrast' }], correct: 'c', explanation: 'Colour is one of the fastest ways people recognise a brand.' },
    ],
  },
  ladder: [
    { id: 'l1', prompt: 'Why do brands specify HEX, RGB and CMYK for each colour?', hint: 'Screens and paper.', options: [{ id: 'a', label: 'Screens mix light (RGB, HEX) and printers mix ink (CMYK), and a converted colour can shift' }, { id: 'b', label: 'For decoration' }, { id: 'c', label: 'CMYK is for dark mode' }, { id: 'd', label: 'Legal requirement' }], correct: 'a', explanation: 'Many brands add a Pantone spot colour for print they care about most.' },
    { id: 'l2', prompt: 'Sukoon wants a dark mode for night sessions. Can it reuse ink-on-slate?', hint: 'The text has to change too.', options: [{ id: 'a', label: 'Yes, as is' }, { id: 'b', label: 'No: dark backgrounds need light text, so the pair becomes sand on slate, checked again for 4.5:1' }, { id: 'c', label: 'Only at night' }, { id: 'd', label: 'Dark mode doesn’t need contrast' }], correct: 'b', explanation: 'Every text pair is checked in each mode (ui.3-4).' },
    { id: 'l3', prompt: 'What licence question matters before choosing a brand typeface?', hint: 'Where will it be used?', options: [{ id: 'a', label: 'None: fonts are free' }, { id: 'b', label: 'Whether the licence covers the app, the website, print and logos; open-licence fonts like Mukta and Tiro do' }, { id: 'c', label: 'Only the colour' }, { id: 'd', label: 'Whether it’s on Instagram' }], correct: 'b', explanation: 'Commercial fonts often charge separately for app embedding.' },
    { id: 'l4', prompt: 'Devanagari text at the same font size often looks smaller than Latin. Why?', hint: 'The headline, the shirorekha.', options: [{ id: 'a', label: 'It isn’t' }, { id: 'b', label: 'Its letters hang from a headline and need room for marks above and below, so the body is smaller in the same box; set Hindi a step larger or choose a face balanced for both' }, { id: 'c', label: 'Hindi fonts are cheaper' }, { id: 'd', label: 'Phones shrink it' }], correct: 'b', explanation: 'Faces designed for both scripts balance this; check the two side by side.' },
    { id: 'l5', prompt: 'A brand colour should be tested for colour blindness because…', hint: 'ax.1-3.', options: [{ id: 'a', label: 'It’s required by app stores' }, { id: 'b', label: 'About 1 in 12 men can’t tell some reds and greens apart, so meaning shouldn’t rely on hue alone' }, { id: 'c', label: 'It changes the logo' }, { id: 'd', label: 'Sage is red' }], correct: 'b', explanation: 'Use contrast, shape and labels as well as hue.' },
  ],
};

export const br2_3: Episode = {
  lessonId: 'br.2-3',
  hook: 'Six months after launch, Sukoon’s logo had been stretched, squashed, gilded for Diwali and set beside a stock beach. Nobody had told anyone not to.',
  scene: {
    id: 'brand-guide', duration: 36,
    beats: [
      { at: 0, title: 'Six months in the wild', body: 'A partner gym, the agency’s Diwali offer, a WhatsApp banner, an app-store screenshot. All Sukoon, none of them alike.' },
      { at: 6, title: 'Everyone guessed', body: 'The logo files and two colours were on a shared drive. Everything else, each team made up.' },
      { at: 11, title: 'Logo: space and size', body: 'Clear space the height of the sun on every side. The full logo never under 24 px tall; smaller than that, the mark alone.' },
      { at: 16, title: 'Colour and type', body: 'Five colours with HEX, RGB and CMYK, and the three pairs that can carry text. Tiro for headlines from 24 px, Mukta for the rest.' },
      { at: 21, title: 'Imagery and voice', body: 'Real people in real Indian homes and commutes, in natural light. Words that sound like “Breathe. You’ve got five minutes.”' },
      { at: 26, title: 'Do and don’t', body: 'Every rule gets a picture: the right way and the wrong way, side by side. People skim rules; they remember pictures.' },
      { at: 31, title: 'Templates over policing', body: 'Ready templates for posts, banners and offers. The next Diwali campaign comes back with diyas in the photos and the palette untouched.' },
    ],
  },
  check: [
    { id: 'c1', prompt: 'Why did Sukoon’s identity drift?', options: [{ id: 'a', label: 'The logo was bad' }, { id: 'b', label: 'Only the files were shared; every rule was a guess' }, { id: 'c', label: 'Partners were careless on purpose' }],
      correct: 'b', explanation: 'An identity with no written rules gets filled in differently by everyone who uses it.' },
    { id: 'c2', prompt: 'How did the next Diwali campaign stay on brand?', options: [{ id: 'a', label: 'Ishita approved every post' }, { id: 'b', label: 'A template: festive photos and words, the same palette and type' }, { id: 'c', label: 'They skipped Diwali' }],
      correct: 'b', explanation: 'A festival changes the imagery and the message, not the system.' },
  ],
  game: {
    id: 'guide-build', title: 'Write the guide',
    instructions: 'Nine pieces of Sukoon from the wild. Drag each one into the section of the guide whose rule it breaks, or tap the section. Every right call writes a rule into the guide.',
    lanes: [
      { id: 'logo', label: 'Logo', hint: 'Proportion, clear space, minimum size' },
      { id: 'colour', label: 'Colour', hint: 'The palette and its text pairs' },
      { id: 'type', label: 'Type', hint: 'Which face, and at which sizes' },
      { id: 'imagery', label: 'Imagery', hint: 'The photo style' },
    ],
    cards: [
      { id: 'g1', label: use('gym'), lane: 'logo', visual: 'gym', note: 'Stretched 40% wider, the half-sun becomes an oval and the letters go fat. Scale in proportion, and leave the rest of the banner empty if you must.' },
      { id: 'g2', label: use('diwali'), lane: 'colour', visual: 'diwali', note: 'Gold isn’t in the palette. Festive diyas and marigolds in the photo say Diwali; the colours stay Sukoon’s.' },
      { id: 'g3', label: use('comic'), lane: 'type', visual: 'comic', note: 'A comic marker font sounds like a different brand. Headlines are Tiro, every time.' },
      { id: 'g4', label: use('beach'), lane: 'imagery', visual: 'beach', note: 'A posed stock model on a beach is every wellness ad. Sukoon’s people are commuters and parents, in real homes and on real trains.' },
      { id: 'g5', label: use('whatsapp'), lane: 'logo', visual: 'whatsapp', note: 'With a fifth of a sun of space, the logo merges into the headline. It needs a full sun on every side.' },
      { id: 'g6', label: use('peachButton'), lane: 'colour', visual: 'peachButton', note: 'Both colours are in the palette, but white on peach is about 1.9:1. The guide lists which pairs can carry text.' },
      { id: 'g7', label: use('tinyTiro'), lane: 'type', visual: 'tinyTiro', note: 'Tiro’s fine details clog at 12 px. Captions are Mukta, 14 px or more.' },
      { id: 'g8', label: use('partnerList'), lane: 'logo', visual: 'partnerList', note: 'At 12 px tall the name is unreadable. Under 24 px, use the half-sun on its own.' },
      { id: 'g9', label: use('neon'), lane: 'imagery', visual: 'neon', note: 'The photo is right, a real commuter, but the neon filter makes it anxious, not calm. Natural light, no filters.' },
    ],
  },
  gap: {
    id: 'gap', from: 6, at: 10.4,
    prompt: 'Every team has been guessing. What should Ishita make first?',
    options: [{ id: 'a', label: 'A new logo' }, { id: 'b', label: 'A guide that writes down the rules, with pictures of right and wrong, and templates for common formats' }, { id: 'c', label: 'A rule that only she can make posts' }],
    correct: 'b', explanation: 'Written rules and ready templates let other people get it right without asking.',
  },
  takeaways: [
    { title: 'An identity is a system', body: 'Logo, colour, type, imagery and voice, with rules for each.' },
    { title: 'Measure with the mark', body: 'Clear space in suns, not pixels, so it works at every size.' },
    { title: 'Show do and don’t', body: 'Pictures of right and wrong teach faster than paragraphs.' },
    { title: 'Templates beat policing', body: 'Make the right thing the easy thing.' },
  ],
  quiz: {
    seconds: 12,
    questions: [
      { id: 'q1', prompt: 'Clear space is…', options: [{ id: 'a', label: 'Empty space kept around the logo' }, { id: 'b', label: 'A transparent logo file' }], correct: 'a', explanation: 'So nothing crowds it.' },
      { id: 'q2', prompt: 'A brand guide’s colour page should list…', options: [{ id: 'a', label: 'Favourite colours of the team' }, { id: 'b', label: 'Exact values and which pairs can carry text' }, { id: 'c', label: 'Only the logo colour' }], correct: 'b', explanation: 'HEX, RGB, CMYK and the text pairs.' },
      { id: 'q3', prompt: 'Below the minimum size, the guide says to…', options: [{ id: 'a', label: 'Stretch it' }, { id: 'b', label: 'Use it anyway' }, { id: 'c', label: 'Use the mark alone' }, { id: 'd', label: 'Make the name bold' }], correct: 'c', explanation: 'A simpler version for small spaces.' },
      { id: 'q4', prompt: 'The best way to stop off-brand posts is usually…', options: [{ id: 'a', label: 'A longer guide' }, { id: 'b', label: 'Ready templates for common formats' }, { id: 'c', label: 'Hiding the logo' }, { id: 'd', label: 'Fewer posts' }], correct: 'b', explanation: 'Make it easy to do right.' },
    ],
  },
  ladder: [
    { id: 'l1', prompt: 'What’s the difference between a brand guide and a design system?', hint: 'Where each is used.', options: [{ id: 'a', label: 'None' }, { id: 'b', label: 'A brand guide covers the identity everywhere (print, social, signage); a design system turns it into components and tokens for the product' }, { id: 'c', label: 'A design system is for print' }, { id: 'd', label: 'A brand guide is only the logo' }], correct: 'b', explanation: 'The same palette becomes ds.1 tokens like color-action-primary.' },
    { id: 'l2', prompt: 'A partner wants to put their logo next to Sukoon’s. What does the guide need?', hint: 'Co-branding.', options: [{ id: 'a', label: 'Nothing' }, { id: 'b', label: 'A co-branding rule: equal visual weight, a divider line, and clear space between the two' }, { id: 'c', label: 'Merge the two logos' }, { id: 'd', label: 'Put Sukoon’s inside theirs' }], correct: 'b', explanation: 'Partnerships are where logos get squashed most.' },
    { id: 'l3', prompt: 'Why should the guide include voice and tone, not just visuals?', hint: 'br.1-2.', options: [{ id: 'a', label: 'It shouldn’t' }, { id: 'b', label: 'Words are part of the identity: an error message in the wrong voice breaks the brand as surely as a stretched logo' }, { id: 'c', label: 'To fill pages' }, { id: 'd', label: 'Lawyers ask for it' }], correct: 'b', explanation: 'Calm, warm, expert applies to every sentence (cw.2).' },
    { id: 'l4', prompt: 'How do you know if a guide works?', hint: 'Watch people use it.', options: [{ id: 'a', label: 'Count its pages' }, { id: 'b', label: 'Give a new designer or partner a task with it and see what they make, and where they had to guess' }, { id: 'c', label: 'Ask the CEO' }, { id: 'd', label: 'Check it’s a PDF' }], correct: 'b', explanation: 'Every guess is a missing rule or template.' },
    { id: 'l5', prompt: 'Where should the guide live?', hint: 'Easy to find, easy to update.', options: [{ id: 'a', label: 'A printed book in the office' }, { id: 'b', label: 'A web page or shared site with download links for the files and templates, kept up to date' }, { id: 'c', label: 'In Ishita’s head' }, { id: 'd', label: 'An email attachment from 2026' }], correct: 'b', explanation: 'A living guide gets used; a stale PDF gets ignored.' },
  ],
};
