// Episodes for chapter ui.3 · Colour. Drafts by Claude, for review.
import type { Episode } from '../episode';

export const ui3_1: Episode = {
  lessonId: 'ui.3-1',
  hook: '#2563EB. Now make it a bit darker. Hard, right? Turn the code into three dials and colour becomes something you can steer.',
  scene: {
    id: 'colour-models', duration: 34,
    beats: [
      { at: 0, title: 'A colour as a code', body: 'A button colour written as a hex code. Darker? More muted? The code doesn’t say how.' },
      { at: 6, title: 'Three dials', body: 'HSL splits it into hue (which colour), saturation (how vivid) and lightness (how light or dark).' },
      { at: 11, title: 'Turn the hue', body: 'Hue walks around the colour wheel: blue, purple, red, orange, green.' },
      { at: 16, title: 'Saturation and lightness', body: 'Drain the colour towards grey, or move it towards white and black. Same hue throughout.' },
      { at: 22, title: 'HSL’s lie', body: 'Six hues, all at HSL lightness 50. Yellow glares, blue looks dark. The maths says equal; your eyes disagree.' },
      { at: 29, title: 'Dials you can trust', body: 'HSL to steer by hand. OKLCH when shades must look evenly bright.' },
    ],
  },
  check: [
    { id: 'c1', prompt: 'Which dial changes which colour it is?', options: [{ id: 'a', label: 'Lightness' }, { id: 'b', label: 'Saturation' }, { id: 'c', label: 'Hue' }],
      correct: 'c', explanation: 'Hue is the position on the colour wheel.' },
    { id: 'c2', prompt: 'What was wrong with the six HSL swatches?', options: [{ id: 'a', label: 'Same lightness number, very different brightness' }, { id: 'b', label: 'They had different hues' }, { id: 'c', label: 'They were too saturated' }],
      correct: 'a', explanation: 'HSL lightness doesn’t match how bright colours look. OKLCH fixes that.' },
  ],
  game: {
    id: 'hsl-dial', title: 'Turn the right dial',
    instructions: 'First, match a colour with three sliders. Then, for each change the team asks for, pick the one dial that does it and watch the swatch move.',
    lanes: [
      { id: 'h', label: 'Hue', hint: 'Which colour it is' },
      { id: 's', label: 'Saturation', hint: 'How vivid or grey it is' },
      { id: 'l', label: 'Lightness', hint: 'How light or dark it is' },
    ],
    cards: [
      { id: 'g1', label: 'Turn the blue button green', lane: 'h', visual: '220,80,50>140,80,50' },
      { id: 'g2', label: 'A darker blue for the hover state', lane: 'l', visual: '220,80,50>220,80,38' },
      { id: 'g3', label: 'A dusty red for a calm illustration', lane: 's', visual: '0,80,50>0,35,50' },
      { id: 'g4', label: 'A pale blue tint for a selected row', lane: 'l', visual: '220,80,50>220,80,93' },
      { id: 'g5', label: 'Shift the orange towards red', lane: 'h', visual: '30,90,55>8,90,55' },
      { id: 'g6', label: 'Make a grey-ish green vivid', lane: 's', visual: '140,20,45>140,75,45' },
      { id: 'g7', label: 'A drained, disabled look for a purple button', lane: 's', visual: '260,70,55>260,10,55' },
      { id: 'g8', label: 'Turn the teal into purple', lane: 'h', visual: '175,70,40>275,70,40' },
      { id: 'g9', label: 'A lighter blue that reads on a dark background', lane: 'l', visual: '220,80,45>220,80,72' },
    ],
  },
  gap: {
    id: 'gap', from: 22, at: 25.6,
    prompt: 'All six swatches are HSL lightness 50, but yellow glares and blue looks dark. What fixes it?',
    options: [{ id: 'a', label: 'Add more saturation to the blue' }, { id: 'b', label: 'Build the shades in OKLCH, where lightness matches what eyes see' }, { id: 'c', label: 'Use only one hue' }],
    correct: 'b', explanation: 'OKLCH lightness is perceptual, so equal numbers look equally bright across hues.',
  },
  takeaways: [
    { title: 'Three dials', body: 'Hue picks the colour, saturation sets how vivid, lightness sets how light or dark.' },
    { title: 'Steer, don’t guess', body: 'Need a hover state? Change lightness only. A muted variant? Lower saturation only.' },
    { title: 'OKLCH for even shades', body: 'HSL lightness lies across hues. OKLCH keeps shades evenly bright, which makes palettes and contrast predictable.' },
  ],
  quiz: {
    seconds: 12,
    questions: [
      { id: 'q1', prompt: 'A darker hover colour changes…', options: [{ id: 'a', label: 'Lightness' }, { id: 'b', label: 'Hue' }], correct: 'a', explanation: 'Same colour, darker.' },
      { id: 'q2', prompt: 'Blue to green changes…', options: [{ id: 'a', label: 'Saturation' }, { id: 'b', label: 'Hue' }, { id: 'c', label: 'Lightness' }], correct: 'b', explanation: 'A different colour on the wheel.' },
      { id: 'q3', prompt: 'A muted, greyer version changes…', options: [{ id: 'a', label: 'Hue' }, { id: 'b', label: 'Lightness' }, { id: 'c', label: 'Opacity' }, { id: 'd', label: 'Saturation' }], correct: 'd', explanation: 'Less saturation, closer to grey.' },
      { id: 'q4', prompt: 'OKLCH’s lightness…', options: [{ id: 'a', label: 'Is the same as HSL’s' }, { id: 'b', label: 'Ignores hue' }, { id: 'c', label: 'Matches how bright colours look' }, { id: 'd', label: 'Only works for greys' }], correct: 'c', explanation: 'It’s perceptual.' },
    ],
  },
  ladder: [
    { id: 'l1', prompt: 'Hue is measured in…', hint: 'Think of a wheel.', options: [{ id: 'a', label: 'Degrees, 0 to 360' }, { id: 'b', label: 'Percent' }, { id: 'c', label: 'Pixels' }, { id: 'd', label: 'Hex digits' }], correct: 'a', explanation: '0 is red, 120 green, 240 blue, and 360 is back to red.' },
    { id: 'l2', prompt: 'What does the C in OKLCH stand for?', hint: 'Close to saturation.', options: [{ id: 'a', label: 'Contrast' }, { id: 'b', label: 'Chroma: how colourful it is' }, { id: 'c', label: 'Cyan' }, { id: 'd', label: 'Code' }], correct: 'b', explanation: 'Lightness, Chroma, Hue. Chroma is roughly how much colour there is.' },
    { id: 'l3', prompt: 'In HSL, saturation 100 and lightness 100 gives…', hint: 'Lightness at the top.', options: [{ id: 'a', label: 'A vivid colour' }, { id: 'b', label: 'Black' }, { id: 'c', label: 'White, whatever the hue' }, { id: 'd', label: 'Grey' }], correct: 'c', explanation: 'At lightness 100 every hue becomes white; at 0, black.' },
    { id: 'l4', prompt: 'Why can’t you use the same OKLCH chroma for every hue in a palette?', hint: 'Screens have limits.', options: [{ id: 'a', label: 'OKLCH forbids it' }, { id: 'b', label: 'It makes colours darker' }, { id: 'c', label: 'Hue would change' }, { id: 'd', label: 'Some hues can’t reach high chroma on screens, so the browser clips them' }], correct: 'd', explanation: 'Each hue has its own maximum chroma inside the screen’s range (gamut).' },
    { id: 'l5', prompt: 'You can write OKLCH directly in CSS. Which is valid?', hint: 'Lightness, chroma, hue.', options: [{ id: 'a', label: 'color: oklch(0.62 0.19 260)' }, { id: 'b', label: 'color: oklch(#2563EB)' }, { id: 'c', label: 'color: hsl-ok(220)' }, { id: 'd', label: 'color: lch-ok(blue)' }], correct: 'a', explanation: 'Modern browsers support oklch(L C H) natively.' },
  ],
};

export const ui3_2: Episode = {
  lessonId: 'ui.3-2',
  hook: 'Fourteen blues, all slightly different, all picked on the day. A palette turns one colour into ten shades that each have a job.',
  scene: {
    id: 'palette-build', duration: 34,
    beats: [
      { at: 0, title: 'One brand colour', body: 'A single blue. Buttons, links, backgrounds and text all need versions of it.' },
      { at: 6, title: 'A ramp', body: 'Ten shades from 50 (palest) to 900 (darkest), evenly spaced in lightness.' },
      { at: 11, title: 'Every shade has a job', body: 'Tints for backgrounds, light shades for borders, the middle for solid fills, the darkest for text.' },
      { at: 17, title: 'Neutrals do most of the work', body: 'A grey ramp with a hint of blue carries text, surfaces and borders. Brand colour is the accent.' },
      { at: 23, title: 'Put it to work', body: 'A card built only from ramp steps: tint behind, border around, solid button, dark heading.' },
      { at: 29, title: 'Ramps, not one-offs', body: 'A few ramps with named steps replace every colour picked by eye.' },
    ],
  },
  check: [
    { id: 'c1', prompt: 'Which end of the ramp is for text on white?', options: [{ id: 'a', label: '50–100' }, { id: 'b', label: '800–900' }, { id: 'c', label: '400' }],
      correct: 'b', explanation: 'The darkest shades give text enough contrast on light backgrounds.' },
    { id: 'c2', prompt: 'What carried most of the interface?', options: [{ id: 'a', label: 'The neutral grey ramp' }, { id: 'b', label: 'The brand blue' }, { id: 'c', label: 'Pure black' }],
      correct: 'a', explanation: 'Neutrals do the bulk of the work; brand colour is an accent.' },
  ],
  game: {
    id: 'ramp-pick', title: 'Pick from the ramp',
    instructions: 'A blue ramp from 50 to 900. For each element, tap the part of the ramp it should use and see it painted.',
    lanes: [
      { id: 'tint', label: 'Tint · 50–100', hint: 'Backgrounds behind things' },
      { id: 'border', label: 'Light · 200–300', hint: 'Borders and dividers' },
      { id: 'solid', label: 'Solid · 500–600', hint: 'Buttons, links, active states' },
      { id: 'ink', label: 'Ink · 800–900', hint: 'Text on light backgrounds' },
    ],
    cards: [
      { id: 'g1', label: 'Background of the selected row in a list', lane: 'tint', visual: 'row' },
      { id: 'g2', label: 'Primary button fill', lane: 'solid', visual: 'button' },
      { id: 'g3', label: 'Text on a pale blue badge', lane: 'ink', visual: 'badge' },
      { id: 'g4', label: 'Border of a text input', lane: 'border', visual: 'input' },
      { id: 'g5', label: 'Background of an info banner', lane: 'tint', visual: 'banner' },
      { id: 'g6', label: 'A link in body text', lane: 'solid', visual: 'link' },
      { id: 'g7', label: 'A heading on a white page', lane: 'ink', visual: 'heading' },
      { id: 'g8', label: 'Divider between list items', lane: 'border', visual: 'divider' },
    ],
  },
  gap: {
    id: 'gap', from: 11, at: 15.6,
    prompt: 'You need body text on a white page. Which part of the ramp?',
    options: [{ id: 'a', label: '50, it’s the palest' }, { id: 'b', label: '500, the brand colour itself' }, { id: 'c', label: '800–900, the darkest' }],
    correct: 'c', explanation: 'Text needs strong contrast against white, which only the darkest shades give.',
  },
  takeaways: [
    { title: 'One colour, ten shades', body: 'Turn each base colour into a ramp from 50 to 900.' },
    { title: 'Jobs, not looks', body: 'Tints behind, light shades for borders, the middle for fills, the darkest for text.' },
    { title: 'Mostly neutral', body: 'Greys carry the interface; the brand colour is an accent used with purpose.' },
  ],
  quiz: {
    seconds: 12,
    questions: [
      { id: 'q1', prompt: 'A primary button fill is usually…', options: [{ id: 'a', label: '50' }, { id: 'b', label: '600' }], correct: 'b', explanation: 'The middle of the ramp.' },
      { id: 'q2', prompt: 'A selected row background is usually…', options: [{ id: 'a', label: 'A pale tint' }, { id: 'b', label: 'The darkest shade' }, { id: 'c', label: 'Pure black' }], correct: 'a', explanation: 'Tints sit behind things.' },
      { id: 'q3', prompt: 'Most of a well-built interface is…', options: [{ id: 'a', label: 'Brand colour' }, { id: 'b', label: 'Bright accents' }, { id: 'c', label: 'Neutral greys' }, { id: 'd', label: 'Gradients' }], correct: 'c', explanation: 'Neutrals carry it.' },
      { id: 'q4', prompt: 'Why number shades 50 to 900?', options: [{ id: 'a', label: 'It’s required by browsers' }, { id: 'b', label: 'Bigger numbers are brighter' }, { id: 'c', label: 'Random tradition' }, { id: 'd', label: 'Everyone can name and reuse the same step' }], correct: 'd', explanation: 'Shared names make shades reusable.' },
    ],
  },
  ladder: [
    { id: 'l1', prompt: 'Why give neutral greys a hint of the brand hue?', hint: 'Pure grey can feel cold.', options: [{ id: 'a', label: 'They feel related to the brand and less flat' }, { id: 'b', label: 'Browsers need it' }, { id: 'c', label: 'It improves contrast a lot' }, { id: 'd', label: 'It hides mistakes' }], correct: 'a', explanation: 'A slight tint ties neutrals to the palette.' },
    { id: 'l2', prompt: 'The 60-30-10 rule suggests…', hint: 'Proportions.', options: [{ id: 'a', label: 'Use 60 colours' }, { id: 'b', label: 'About 60% neutral, 30% secondary, 10% accent' }, { id: 'c', label: '60% brand colour everywhere' }, { id: 'd', label: 'Change colours every 60 days' }], correct: 'b', explanation: 'Accents work because they’re rare.' },
    { id: 'l3', prompt: 'Why build ramps in OKLCH rather than HSL?', hint: 'Remember the last lesson.', options: [{ id: 'a', label: 'OKLCH files are smaller' }, { id: 'b', label: 'HSL can’t make ramps' }, { id: 'c', label: 'Steps look evenly spaced, and step 600 of every hue has similar contrast' }, { id: 'd', label: 'OKLCH is older' }], correct: 'c', explanation: 'Perceptual lightness makes ramps predictable across hues.' },
    { id: 'l4', prompt: 'A designer needs a blue between 500 and 600. Best move?', hint: 'One-offs creep in this way.', options: [{ id: 'a', label: 'Make a new one-off blue' }, { id: 'b', label: 'Use whatever looks right' }, { id: 'c', label: 'Use 500 at 85% opacity' }, { id: 'd', label: 'Use 500 or 600; only add a step to the ramp if the need is real and repeated' }], correct: 'd', explanation: 'Keep the ramp closed unless a real gap appears.' },
    { id: 'l5', prompt: 'How do you name colours in code so they can change later?', hint: 'Two layers.', options: [{ id: 'a', label: 'Raw ramp tokens (blue-600) behind role tokens (button-bg)' }, { id: 'b', label: 'Hex codes inline everywhere' }, { id: 'c', label: 'Name them after screens' }, { id: 'd', label: 'One token for all colours' }], correct: 'a', explanation: 'Components use role tokens, which point at ramp steps. Change the pointer, not every component.' },
  ],
};

export const ui3_3: Episode = {
  lessonId: 'ui.3-3',
  hook: 'If your brand is red, every button looks like an error. Colours need names that say what they mean.',
  scene: {
    id: 'semantic-colour', duration: 34,
    beats: [
      { at: 0, title: 'Red everywhere', body: 'A red brand. The Pay button is red, and so is the card-declined error under it. Which one is the problem?' },
      { at: 6, title: 'Name colours by meaning', body: 'Red becomes error, green success, amber warning, blue info. Names say what, not how it looks.' },
      { at: 12, title: 'Brand steps aside', body: 'The brand moves to its own colour, so a button never looks like a failure.' },
      { at: 17, title: 'Without colour', body: 'Seen in greyscale, as some colour-blind people do, the error and success toasts look the same.' },
      { at: 23, title: 'Icon and words', body: 'Add an icon and a clear message. Now the meaning survives without colour.' },
      { at: 29, title: 'Meaning first', body: 'Semantic names, a brand that stays out of the way, and never colour alone.' },
    ],
  },
  check: [
    { id: 'c1', prompt: 'Why was the red brand a problem?', options: [{ id: 'a', label: 'Red is ugly' }, { id: 'b', label: 'Buttons and errors looked the same' }, { id: 'c', label: 'Red is too dark' }],
      correct: 'b', explanation: 'When brand and error share a colour, people can’t tell action from failure.' },
    { id: 'c2', prompt: 'What made the toasts readable without colour?', options: [{ id: 'a', label: 'Brighter colours' }, { id: 'b', label: 'Bigger toasts' }, { id: 'c', label: 'An icon and clear words' }],
      correct: 'c', explanation: 'Shape and words carry the meaning when colour can’t.' },
  ],
  game: {
    id: 'token-route', title: 'Colour the message',
    instructions: 'Each message needs a meaning. Pick error, success, warning or info and the toast takes that colour and icon.',
    lanes: [
      { id: 'error', label: 'Error', hint: 'Something failed or needs fixing now' },
      { id: 'success', label: 'Success', hint: 'Something worked or is done' },
      { id: 'warning', label: 'Warning', hint: 'Needs attention soon, nothing broken yet' },
      { id: 'info', label: 'Info', hint: 'Neutral news or a tip' },
    ],
    cards: [
      { id: 'g1', label: 'Payment failed. Your card was declined.', lane: 'error' },
      { id: 'g2', label: 'Profile saved.', lane: 'success' },
      { id: 'g3', label: 'Your plan ends in 3 days.', lane: 'warning' },
      { id: 'g4', label: 'Tip: swipe left on an order to archive it.', lane: 'info' },
      { id: 'g5', label: 'Couldn’t upload the photo. It’s over 10 MB.', lane: 'error' },
      { id: 'g6', label: 'Order delivered.', lane: 'success' },
      { id: 'g7', label: 'You’re offline. Changes will sync when you reconnect.', lane: 'warning' },
      { id: 'g8', label: 'A new version of the app is available.', lane: 'info' },
    ],
  },
  gap: {
    id: 'gap', from: 17, at: 21.6,
    prompt: 'In greyscale, the error and success toasts look identical. What do you add?',
    options: [{ id: 'a', label: 'Brighter red and green' }, { id: 'b', label: 'An icon and clear words on each' }, { id: 'c', label: 'A blinking animation' }],
    correct: 'b', explanation: 'Icons and words work for everyone, including people who can’t tell red from green.',
  },
  takeaways: [
    { title: 'Name by meaning', body: 'Error, success, warning, info. Not red, green, yellow, blue.' },
    { title: 'Keep brand separate', body: 'If the brand shares a colour with error, every action looks like a failure.' },
    { title: 'Never colour alone', body: 'Pair every semantic colour with an icon and words.' },
  ],
  quiz: {
    seconds: 12,
    questions: [
      { id: 'q1', prompt: '“Profile saved” is…', options: [{ id: 'a', label: 'Error' }, { id: 'b', label: 'Success' }], correct: 'b', explanation: 'It worked.' },
      { id: 'q2', prompt: '“Your plan ends in 3 days” is…', options: [{ id: 'a', label: 'Warning' }, { id: 'b', label: 'Error' }, { id: 'c', label: 'Success' }], correct: 'a', explanation: 'Needs attention soon.' },
      { id: 'q3', prompt: 'A good token name is…', options: [{ id: 'a', label: 'red-error-final-2' }, { id: 'b', label: 'bright-red' }, { id: 'c', label: 'colour-1' }, { id: 'd', label: 'error' }], correct: 'd', explanation: 'Named for meaning.' },
      { id: 'q4', prompt: 'Showing an error with colour alone…', options: [{ id: 'a', label: 'Is fine' }, { id: 'b', label: 'Is faster' }, { id: 'c', label: 'Fails people who can’t see the colour' }, { id: 'd', label: 'Is required' }], correct: 'c', explanation: 'Add an icon and words.' },
    ],
  },
  ladder: [
    { id: 'l1', prompt: 'Your brand colour is red. How do you keep errors clear?', hint: 'Errors need their own look.', options: [{ id: 'a', label: 'Use a distinct error red plus an icon and message, and keep brand red off error-like places' }, { id: 'b', label: 'Make errors green' }, { id: 'c', label: 'Don’t show errors' }, { id: 'd', label: 'Make everything red' }], correct: 'a', explanation: 'Separate the meanings with shade, icon and words.' },
    { id: 'l2', prompt: 'Red means danger in many places, but in China red means luck and in stock markets there it means up. What follows?', hint: 'Meaning is cultural.', options: [{ id: 'a', label: 'Never use red' }, { id: 'b', label: 'Don’t rely on colour meanings alone; words and icons carry the message' }, { id: 'c', label: 'Use red only in China' }, { id: 'd', label: 'Colour has no meaning' }], correct: 'b', explanation: 'Colour meanings vary; text and icons travel better.' },
    { id: 'l3', prompt: 'How many semantic colours does most UI need?', hint: 'Fewer is clearer.', options: [{ id: 'a', label: 'One per screen' }, { id: 'b', label: 'Twenty' }, { id: 'c', label: 'Four or five: error, success, warning, info, maybe neutral' }, { id: 'd', label: 'None' }], correct: 'c', explanation: 'A small set stays recognisable.' },
    { id: 'l4', prompt: 'Warning yellow text on white is hard to read. Fix?', hint: 'Yellow is very light.', options: [{ id: 'a', label: 'Use it anyway' }, { id: 'b', label: 'Make it bold' }, { id: 'c', label: 'Make it blink' }, { id: 'd', label: 'Use yellow for the background or icon and dark text for the words' }], correct: 'd', explanation: 'Yellow can’t reach text contrast on white. Use it behind dark text.' },
    { id: 'l5', prompt: 'Each semantic colour usually needs which variants?', hint: 'Think of a toast and a badge.', options: [{ id: 'a', label: 'A background tint, a border or icon shade, and a text shade' }, { id: 'b', label: 'Just one hex code' }, { id: 'c', label: 'A gradient' }, { id: 'd', label: 'A light and an ultra-light' }], correct: 'a', explanation: 'Like any ramp: tint behind, solid for icons, dark for text.' },
  ],
};

export const ui3_4: Episode = {
  lessonId: 'ui.3-4',
  hook: 'Pale grey text looks elegant in a mockup and vanishes on a sunny bus ride. Contrast is a number, and dark mode needs it checked twice.',
  scene: {
    id: 'contrast-dark', duration: 34,
    beats: [
      { at: 0, title: 'Elegant and unreadable', body: 'Helper text in light grey on white: 2.5:1. Many people can’t read it.' },
      { at: 5, title: 'Darken to 4.5', body: 'Darken the grey until the ratio reaches 4.5:1, the WCAG AA line for body text.' },
      { at: 11, title: 'Dark mode, the lazy way', body: 'Invert everything: pure black, glaring blue, white text that buzzes.' },
      { at: 17, title: 'Dark mode, done well', body: 'A dark grey base, surfaces getting lighter as they rise, and a softer brand blue.' },
      { at: 23, title: 'Check again', body: 'A grey that passed on white fails on the dark background. Lighten it until it passes.' },
      { at: 29, title: 'Contrast in both themes', body: '4.5:1 for body text, 3:1 for large text, checked in light and dark.' },
    ],
  },
  check: [
    { id: 'c1', prompt: 'What ratio does body text need for WCAG AA?', options: [{ id: 'a', label: '2:1' }, { id: 'b', label: '4.5:1' }, { id: 'c', label: '10:1' }],
      correct: 'b', explanation: '4.5:1 for body text; 3:1 for large text and icons.' },
    { id: 'c2', prompt: 'What does good dark mode use as its base?', options: [{ id: 'a', label: 'Pure black' }, { id: 'b', label: 'Inverted colours' }, { id: 'c', label: 'A very dark grey' }],
      correct: 'c', explanation: 'Dark grey is gentler and lets raised surfaces show as lighter greys.' },
  ],
  game: {
    id: 'contrast-check', title: 'Pass or fail?',
    instructions: 'First, darken some text until it passes. Then judge each pair: fine for body text, only for large text, or failing?',
    lanes: [
      { id: 'pass', label: 'Body text OK', hint: '4.5:1 or more' },
      { id: 'large', label: 'Large text only', hint: 'Between 3:1 and 4.5:1' },
      { id: 'fail', label: 'Fails', hint: 'Under 3:1' },
    ],
    cards: [
      { id: 'g1', label: 'Dark grey text on white', lane: 'pass', visual: '#1f2937|#ffffff' },
      { id: 'g2', label: 'Light grey helper text on white', lane: 'fail', visual: '#9ca3af|#ffffff' },
      { id: 'g3', label: 'White text on a bright blue button', lane: 'large', visual: '#ffffff|#3b82f6' },
      { id: 'g4', label: 'Mid grey text on white', lane: 'pass', visual: '#6b7280|#ffffff' },
      { id: 'g5', label: 'White text on a bright green badge', lane: 'fail', visual: '#ffffff|#22c55e' },
      { id: 'g6', label: 'White text on a deeper blue button', lane: 'pass', visual: '#ffffff|#2563eb' },
      { id: 'g7', label: 'Grey #888 text on white', lane: 'large', visual: '#888888|#ffffff' },
      { id: 'g8', label: 'Light grey text on a dark-mode background', lane: 'pass', visual: '#9ca3af|#121417' },
      { id: 'g9', label: 'Dark grey text on a dark-mode background', lane: 'fail', visual: '#4b5563|#121417' },
      { id: 'g10', label: 'Brand blue link on a dark-mode background', lane: 'large', visual: '#2563eb|#121417' },
    ],
  },
  gap: {
    id: 'gap', from: 0, at: 4.6,
    prompt: 'The helper text is 2.5:1 on white. What do you do?',
    options: [{ id: 'a', label: 'Make it bigger and keep the grey' }, { id: 'b', label: 'Darken it until it reaches at least 4.5:1' }, { id: 'c', label: 'Remove the helper text' }],
    correct: 'b', explanation: 'Body-size text needs 4.5:1. Darkening the grey keeps the hierarchy and makes it readable.',
  },
  takeaways: [
    { title: '4.5 and 3', body: 'WCAG AA: 4.5:1 for body text, 3:1 for large text and icons.' },
    { title: 'Dark mode isn’t inverted', body: 'Dark grey base, lighter raised surfaces, softer bright colours.' },
    { title: 'Check both themes', body: 'A colour that passes on white can fail on dark. Test every pair in each theme.' },
  ],
  quiz: {
    seconds: 12,
    questions: [
      { id: 'q1', prompt: 'Body text needs at least…', options: [{ id: 'a', label: '4.5:1' }, { id: 'b', label: '2:1' }], correct: 'a', explanation: 'WCAG AA.' },
      { id: 'q2', prompt: 'Large text needs at least…', options: [{ id: 'a', label: '7:1' }, { id: 'b', label: '1.5:1' }, { id: 'c', label: '3:1' }], correct: 'c', explanation: 'Bigger letters are easier to see.' },
      { id: 'q3', prompt: 'A good dark-mode base is…', options: [{ id: 'a', label: 'Pure black' }, { id: 'b', label: 'A very dark grey' }, { id: 'c', label: 'Navy brand colour' }, { id: 'd', label: 'Inverted white' }], correct: 'b', explanation: 'Gentler, with room for elevation.' },
      { id: 'q4', prompt: 'In dark mode, raised surfaces get…', options: [{ id: 'a', label: 'Darker' }, { id: 'b', label: 'Bigger shadows only' }, { id: 'c', label: 'Pure black' }, { id: 'd', label: 'Slightly lighter' }], correct: 'd', explanation: 'Lighter means closer.' },
    ],
  },
  ladder: [
    { id: 'l1', prompt: 'What counts as “large text” in WCAG?', hint: 'Size or weight.', options: [{ id: 'a', label: 'About 24px regular, or about 19px bold' }, { id: 'b', label: 'Anything above 12px' }, { id: 'c', label: 'Only headings' }, { id: 'd', label: 'Only uppercase' }], correct: 'a', explanation: '18pt (24px) regular or 14pt (about 19px) bold.' },
    { id: 'l2', prompt: 'What does WCAG AAA ask for body text?', hint: 'A stricter level.', options: [{ id: 'a', label: '3:1' }, { id: 'b', label: '7:1' }, { id: 'c', label: '4.5:1' }, { id: 'd', label: '21:1' }], correct: 'b', explanation: 'AAA is 7:1 for body text and 4.5:1 for large.' },
    { id: 'l3', prompt: 'Why is pure white text on pure black tiring for some people?', hint: 'Too much of a good thing.', options: [{ id: 'a', label: 'It’s below 4.5:1' }, { id: 'b', label: 'Screens can’t show it' }, { id: 'c', label: 'The extreme contrast can make letters blur or glow (halation)' }, { id: 'd', label: 'It uses more battery' }], correct: 'c', explanation: 'Soften to off-white on dark grey; contrast stays high.' },
    { id: 'l4', prompt: 'Does placeholder text in an input need 4.5:1?', hint: 'People read it.', options: [{ id: 'a', label: 'No, placeholders are exempt' }, { id: 'b', label: 'Only on mobile' }, { id: 'c', label: 'Only in dark mode' }, { id: 'd', label: 'If people need to read it, yes. And don’t use it instead of a label' }], correct: 'd', explanation: 'Readable placeholders, and real labels above the field.' },
    { id: 'l5', prompt: 'Your brand blue passes on white but fails as text on dark grey. Fix?', hint: 'Two themes, two shades.', options: [{ id: 'a', label: 'Use a lighter step of the blue ramp for dark mode, via a role token' }, { id: 'b', label: 'Keep it, it’s the brand' }, { id: 'c', label: 'Make the background white' }, { id: 'd', label: 'Underline it' }], correct: 'a', explanation: 'A role token like link-text points at blue-600 in light and blue-300 in dark.' },
  ],
};
