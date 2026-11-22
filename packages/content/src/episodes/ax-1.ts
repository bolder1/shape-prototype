// Episodes for chapter ax.1 · Accessibility basics. Drafts by Claude, for review.
import type { Episode } from '../episode';

export const ax1_1: Episode = {
  lessonId: 'ax.1-1',
  hook: 'A person with one arm, a person with a broken wrist, and a parent holding a baby. Same problem, same fix.',
  scene: {
    id: 'spectrum', duration: 34,
    beats: [
      { at: 0, title: 'One arm', body: 'Someone born with one arm uses a phone one-handed every day.' },
      { at: 5, title: 'A broken wrist', body: 'Someone else breaks their wrist. For six weeks, they use their phone one-handed too.' },
      { at: 10, title: 'A baby in one arm', body: 'A new parent holds a baby and scrolls with a thumb. One-handed again.' },
      { at: 15, title: 'Permanent, temporary, situational', body: 'The same need shows up as a lifelong condition, an injury that heals, or just the situation you’re in.' },
      { at: 21, title: 'It works for every sense', body: 'Blind, a cataract, glare from the sun. Deaf, an ear infection, a loud train platform.' },
      { at: 27, title: 'Solve for one, extend to many', body: 'Design for the permanent case and you help millions more who are on the spectrum for an hour or a month.' },
    ],
  },
  check: [
    { id: 'c1', prompt: 'What did the three people have in common?', options: [{ id: 'a', label: 'They all needed to use a phone one-handed' }, { id: 'b', label: 'They were all injured' }, { id: 'c', label: 'Nothing' }],
      correct: 'a', explanation: 'Same need, different causes.' },
    { id: 'c2', prompt: 'Holding a baby while using your phone is a…', options: [{ id: 'a', label: 'Permanent disability' }, { id: 'b', label: 'Temporary disability' }, { id: 'c', label: 'Situational limitation' }],
      correct: 'c', explanation: 'It depends on the situation, not your body.' },
  ],
  game: {
    id: 'persona-spectrum', title: 'Fill the spectrum',
    instructions: 'Each card is a person. Is their limitation permanent, temporary or situational? Each answer fills a cell in the spectrum, row by sense.',
    lanes: [
      { id: 'perm', label: 'Permanent', hint: 'Lasts a lifetime' },
      { id: 'temp', label: 'Temporary', hint: 'Heals or passes in weeks' },
      { id: 'sit', label: 'Situational', hint: 'Caused by where you are or what you’re doing' },
    ],
    cards: [
      { id: 'g1', label: 'Born without a left hand', lane: 'perm', visual: 'touch' },
      { id: 'g2', label: 'Blind since birth', lane: 'perm', visual: 'see' },
      { id: 'g3', label: 'Wrist in a cast for six weeks', lane: 'temp', visual: 'touch' },
      { id: 'g4', label: 'Reading a phone in bright sunlight', lane: 'sit', visual: 'see' },
      { id: 'g5', label: 'Deaf', lane: 'perm', visual: 'hear' },
      { id: 'g6', label: 'Holding a baby in one arm', lane: 'sit', visual: 'touch' },
      { id: 'g7', label: 'Eyes dilated after an eye test', lane: 'temp', visual: 'see' },
      { id: 'g8', label: 'Waiting on a loud train platform', lane: 'sit', visual: 'hear' },
      { id: 'g9', label: 'An ear infection', lane: 'temp', visual: 'hear' },
    ],
  },
  gap: {
    id: 'gap', from: 15, at: 20.4,
    prompt: 'You make a one-handed mode for people with one arm. Who else benefits?',
    options: [{ id: 'a', label: 'Nobody else' }, { id: 'b', label: 'People with a broken arm and parents holding a baby' }, { id: 'c', label: 'Only people with two phones' }],
    correct: 'b', explanation: 'Solve for the permanent case and the temporary and situational cases come along.',
  },
  takeaways: [
    { title: 'A spectrum, not a group', body: 'Permanent, temporary and situational limitations share the same needs.' },
    { title: 'Solve for one, extend to many', body: 'Fixes for permanent disabilities help millions more.' },
    { title: 'Everyone is on it sometimes', body: 'Sun glare, a noisy train, a full hand: accessibility is everyday design.' },
  ],
  quiz: {
    seconds: 12,
    questions: [
      { id: 'q1', prompt: 'A broken wrist is…', options: [{ id: 'a', label: 'Temporary' }, { id: 'b', label: 'Permanent' }], correct: 'a', explanation: 'It heals.' },
      { id: 'q2', prompt: 'Using a phone on a loud platform is…', options: [{ id: 'a', label: 'Permanent' }, { id: 'b', label: 'Temporary' }, { id: 'c', label: 'Situational' }], correct: 'c', explanation: 'It’s the place.' },
      { id: 'q3', prompt: 'Captions help…', options: [{ id: 'a', label: 'Only deaf people' }, { id: 'b', label: 'Nobody' }, { id: 'c', label: 'Only children' }, { id: 'd', label: 'Deaf people and anyone who can’t play sound' }], correct: 'd', explanation: 'Across the spectrum.' },
      { id: 'q4', prompt: 'Designing for permanent disabilities…', options: [{ id: 'a', label: 'Helps only a few' }, { id: 'b', label: 'Hurts others' }, { id: 'c', label: 'Often helps everyone on the spectrum' }, { id: 'd', label: 'Is optional' }], correct: 'c', explanation: 'Solve for one, extend to many.' },
    ],
  },
  ladder: [
    { id: 'l1', prompt: 'Roughly how many people worldwide live with a significant disability?', hint: 'WHO estimate.', options: [{ id: 'a', label: 'About 1 in 6 people (1.3 billion)' }, { id: 'b', label: 'About 1 in 1,000' }, { id: 'c', label: 'About 1 in 100' }, { id: 'd', label: 'Almost nobody' }], correct: 'a', explanation: 'The WHO estimates 1.3 billion people, about 16% of the world.' },
    { id: 'l2', prompt: 'Which framing of disability does inclusive design use?', hint: 'Where does the mismatch live?', options: [{ id: 'a', label: 'A medical problem to cure' }, { id: 'b', label: 'A mismatch between a person and their environment, which design can fix' }, { id: 'c', label: 'A rare edge case' }, { id: 'd', label: 'A legal checkbox' }], correct: 'b', explanation: 'Design causes many mismatches, so design can remove them.' },
    { id: 'l3', prompt: 'Which everyday invention started as an accessibility feature?', hint: 'Think pavements.', options: [{ id: 'a', label: 'Pop-up ads' }, { id: 'b', label: 'Loading spinners' }, { id: 'c', label: 'Kerb cuts, now used by strollers, suitcases and cyclists' }, { id: 'd', label: 'Captchas' }], correct: 'c', explanation: 'The “curb-cut effect”: built for wheelchairs, used by everyone.' },
    { id: 'l4', prompt: 'Ageing brings gradual changes in vision, hearing and dexterity. What does that mean for your users?', hint: 'Everyone ages.', options: [{ id: 'a', label: 'Nothing, apps are for young people' }, { id: 'b', label: 'Only fonts matter' }, { id: 'c', label: 'Older users don’t use apps' }, { id: 'd', label: 'A growing share of users will need accessible design, whether they call it disability or not' }], correct: 'd', explanation: 'Populations are ageing, including in India.' },
    { id: 'l5', prompt: 'The best time to think about accessibility is…', hint: 'Retrofitting costs more.', options: [{ id: 'a', label: 'From the first sketch, as part of every decision' }, { id: 'b', label: 'After launch, if someone complains' }, { id: 'c', label: 'Only before an audit' }, { id: 'd', label: 'Never, it’s engineering’s job' }], correct: 'a', explanation: 'Built in early, it’s cheap; bolted on later, it’s expensive.' },
  ],
};

export const ax1_2: Episode = {
  lessonId: 'ax.1-2',
  hook: 'WCAG has dozens of rules. Every one of them lives under four words: Perceivable, Operable, Understandable, Robust.',
  scene: {
    id: 'pour', duration: 34,
    beats: [
      { at: 0, title: 'One page, four questions', body: 'A booking page. Can people sense it? Use it? Understand it? Will it work with their tools?' },
      { at: 5, title: 'Perceivable', body: 'Images get alt text, videos get captions, text gets enough contrast. Nothing is locked inside one sense.' },
      { at: 11, title: 'Operable', body: 'Everything works with a keyboard, nothing flashes, and time limits can be extended.' },
      { at: 17, title: 'Understandable', body: 'Plain labels, predictable navigation, and errors that say how to fix them.' },
      { at: 23, title: 'Robust', body: 'Proper HTML so screen readers, voice control and future browsers can all read it.' },
      { at: 29, title: 'POUR', body: 'Every WCAG rule answers one of four questions.' },
    ],
  },
  check: [
    { id: 'c1', prompt: 'Alt text on images is about making content…', options: [{ id: 'a', label: 'Perceivable' }, { id: 'b', label: 'Robust' }, { id: 'c', label: 'Operable' }],
      correct: 'a', explanation: 'It lets people who can’t see the image perceive it.' },
    { id: 'c2', prompt: 'Keyboard support falls under…', options: [{ id: 'a', label: 'Understandable' }, { id: 'b', label: 'Operable' }, { id: 'c', label: 'Perceivable' }],
      correct: 'b', explanation: 'It’s about being able to operate the interface.' },
  ],
  game: {
    id: 'pour-sort', title: 'Build the four pillars',
    instructions: 'Drag each fix onto the pillar it belongs to, or tap a pillar. Fill all four.',
    lanes: [
      { id: 'p', label: 'Perceivable', hint: 'People can sense the content' },
      { id: 'o', label: 'Operable', hint: 'People can use the controls' },
      { id: 'u', label: 'Understandable', hint: 'People can make sense of it' },
      { id: 'r', label: 'Robust', hint: 'It works with assistive technology' },
    ],
    cards: [
      { id: 'g1', label: 'Images have alt text', lane: 'p' },
      { id: 'g2', label: 'Everything works with a keyboard', lane: 'o' },
      { id: 'g3', label: 'Error messages say how to fix the problem', lane: 'u' },
      { id: 'g4', label: 'Buttons are real <button> elements, not clickable divs', lane: 'r' },
      { id: 'g5', label: 'Videos have captions', lane: 'p' },
      { id: 'g6', label: 'Session timeouts can be extended', lane: 'o' },
      { id: 'g7', label: 'Navigation stays in the same place on every page', lane: 'u' },
      { id: 'g8', label: 'Custom controls announce their name and state to screen readers', lane: 'r' },
    ],
  },
  gap: {
    id: 'gap', from: 17, at: 22.4,
    prompt: 'The error says “Invalid input”. Which principle does it break?',
    options: [{ id: 'a', label: 'Robust' }, { id: 'b', label: 'Perceivable' }, { id: 'c', label: 'Understandable' }],
    correct: 'c', explanation: 'People can see it, but they can’t tell what went wrong or how to fix it.',
  },
  takeaways: [
    { title: 'Perceivable', body: 'Alt text, captions, contrast: content reaches more than one sense.' },
    { title: 'Operable · Understandable', body: 'Keyboard and time to act; plain words and predictable patterns.' },
    { title: 'Robust', body: 'Real HTML semantics so assistive tech, now and later, can read it.' },
  ],
  quiz: {
    seconds: 12,
    questions: [
      { id: 'q1', prompt: 'Captions are…', options: [{ id: 'a', label: 'Perceivable' }, { id: 'b', label: 'Robust' }], correct: 'a', explanation: 'Sound becomes text.' },
      { id: 'q2', prompt: 'A clickable div instead of a button breaks…', options: [{ id: 'a', label: 'Understandable' }, { id: 'b', label: 'Robust' }, { id: 'c', label: 'Perceivable' }], correct: 'b', explanation: 'Assistive tech can’t tell it’s a button.' },
      { id: 'q3', prompt: 'A session that times out with no warning breaks…', options: [{ id: 'a', label: 'Perceivable' }, { id: 'b', label: 'Robust' }, { id: 'c', label: 'Understandable' }, { id: 'd', label: 'Operable' }], correct: 'd', explanation: 'People need enough time to act.' },
      { id: 'q4', prompt: 'What does POUR stand for?', options: [{ id: 'a', label: 'Pretty, Open, Usable, Rich' }, { id: 'b', label: 'Public, Official, Universal, Required' }, { id: 'c', label: 'Perceivable, Operable, Understandable, Robust' }, { id: 'd', label: 'Plain, Obvious, Useful, Readable' }], correct: 'c', explanation: 'The four WCAG principles.' },
    ],
  },
  ladder: [
    { id: 'l1', prompt: 'What are WCAG’s conformance levels?', hint: 'Three letters, three levels.', options: [{ id: 'a', label: 'A, AA and AAA' }, { id: 'b', label: 'Bronze, silver, gold' }, { id: 'c', label: '1, 2, 3' }, { id: 'd', label: 'Low, medium, high' }], correct: 'a', explanation: 'Most laws and teams target AA.' },
    { id: 'l2', prompt: 'What should alt text for a decorative swirl be?', hint: 'Does it carry meaning?', options: [{ id: 'a', label: '“Decorative swirl image”' }, { id: 'b', label: 'Empty (alt=""), so screen readers skip it' }, { id: 'c', label: 'The file name' }, { id: 'd', label: 'A long description' }], correct: 'b', explanation: 'Decoration is hidden; meaningful images are described.' },
    { id: 'l3', prompt: 'Which law or policy requires accessible government websites in India?', hint: 'Rights of persons…', options: [{ id: 'a', label: 'None' }, { id: 'b', label: 'Only US law applies' }, { id: 'c', label: 'The Rights of Persons with Disabilities Act 2016 and the GIGW guidelines' }, { id: 'd', label: 'The Copyright Act' }], correct: 'c', explanation: 'The RPwD Act and GIGW align with WCAG.' },
    { id: 'l4', prompt: 'A carousel auto-advances every 3 seconds with no pause. Which principle?', hint: 'Can everyone keep up?', options: [{ id: 'a', label: 'Robust' }, { id: 'b', label: 'Perceivable only' }, { id: 'c', label: 'None' }, { id: 'd', label: 'Operable: moving content needs pause, stop or hide controls' }], correct: 'd', explanation: 'Give people control over moving content.' },
    { id: 'l5', prompt: 'Why is “first rule of ARIA: don’t use ARIA” good advice?', hint: 'Native elements come with behaviour.', options: [{ id: 'a', label: 'Native HTML elements already have the right roles and keyboard behaviour' }, { id: 'b', label: 'ARIA is banned' }, { id: 'c', label: 'ARIA slows pages' }, { id: 'd', label: 'Screen readers ignore ARIA' }], correct: 'a', explanation: 'Use a real <button> before you add role="button" to a div.' },
  ],
};

export const ax1_3: Episode = {
  lessonId: 'ax.1-3',
  hook: 'Your red-and-green chart looks crystal clear. For 1 in 12 men, the two lines are the same muddy brown.',
  scene: {
    id: 'colour-blind', duration: 34,
    beats: [
      { at: 0, title: 'A clear chart', body: 'Profit in green, loss in red. Obvious, if you see red and green.' },
      { at: 6, title: 'Through other eyes', body: 'With deuteranopia, the most common colour blindness, the two lines look almost the same.' },
      { at: 12, title: 'The same in the interface', body: 'A red error border, green and red status dots: meaning carried by hue alone disappears.' },
      { at: 18, title: 'Add a second signal', body: 'Labels on the lines, icons on the dots, a message under the error. Now the meaning survives.' },
      { at: 24, title: 'Lightness helps too', body: 'Pick colours that differ in lightness, not just hue, and keep text at 4.5:1.' },
      { at: 29, title: 'Never colour alone', body: 'Colour can support meaning, but it can’t carry it alone.' },
    ],
  },
  check: [
    { id: 'c1', prompt: 'Why did the chart fail?', options: [{ id: 'a', label: 'The lines were too thin' }, { id: 'b', label: 'Red and green were the only difference' }, { id: 'c', label: 'It had too many labels' }],
      correct: 'b', explanation: 'Hue alone carried the meaning.' },
    { id: 'c2', prompt: 'What fixed it?', options: [{ id: 'a', label: 'Brighter colours' }, { id: 'b', label: 'A second signal: labels, icons or patterns' }, { id: 'c', label: 'Removing the chart' }],
      correct: 'b', explanation: 'Meaning that doesn’t depend on hue.' },
  ],
  game: {
    id: 'cvd-fix', title: 'Through other eyes',
    instructions: 'First, look at a dashboard through four kinds of vision. Then judge each design: does its meaning survive colour blindness, or does it break?',
    lanes: [
      { id: 'broken', label: 'Breaks', hint: 'Colour is the only signal' },
      { id: 'clear', label: 'Still clear', hint: 'A second signal carries the meaning' },
    ],
    cards: [
      { id: 'g1', label: 'A chart with a red line and a green line, legend in the corner', lane: 'broken', visual: 'chart-rg', note: 'Without hue, the lines are indistinguishable. Label each line directly.' },
      { id: 'g2', label: 'The same chart with each line labelled at its end', lane: 'clear', visual: 'chart-labels', note: 'The labels say which is which, whatever the colours look like.' },
      { id: 'g3', label: 'Server status shown by red and green dots', lane: 'broken', visual: 'dots', note: 'Red and green dots look alike. Add icons or words.' },
      { id: 'g4', label: 'Status dots with a tick, a cross and the words “Up” and “Down”', lane: 'clear', visual: 'dots-icons', note: 'The icons and words carry the meaning.' },
      { id: 'g5', label: 'An invalid field shown only by a red border', lane: 'broken', visual: 'error-border', note: 'A red border alone is easy to miss. Add an icon and a message.' },
      { id: 'g6', label: 'An invalid field with a red border, an icon and a message', lane: 'clear', visual: 'error-message', note: 'The message tells everyone what’s wrong.' },
      { id: 'g7', label: 'Links that differ from body text only by colour', lane: 'broken', visual: 'link-colour', note: 'Underline links in body text so they don’t rely on colour.' },
      { id: 'g8', label: 'Underlined links in body text', lane: 'clear', visual: 'link-underline', note: 'The underline marks the link for everyone.' },
      { id: 'g9', label: 'A heat map from red (bad) to green (good)', lane: 'broken', visual: 'heat-rg', note: 'Red and green collapse into one band. Use a scale that changes in lightness.' },
      { id: 'g10', label: 'A heat map from pale to dark blue', lane: 'clear', visual: 'heat-blue', note: 'Lightness changes are visible to almost everyone.' },
    ],
  },
  gap: {
    id: 'gap', from: 12, at: 17.6,
    prompt: 'The error field has only a red border. What do you add?',
    options: [{ id: 'a', label: 'A brighter red' }, { id: 'b', label: 'An icon and a message saying what’s wrong' }, { id: 'c', label: 'A green border on valid fields' }],
    correct: 'b', explanation: 'A second signal makes the error clear without relying on colour.',
  },
  takeaways: [
    { title: '1 in 12 men', body: 'Colour vision deficiency is common; red–green is the usual pair.' },
    { title: 'A second signal', body: 'Labels, icons, patterns or underlines carry meaning when hue can’t.' },
    { title: 'Lean on lightness', body: 'Colours that differ in lightness stay distinguishable; keep text at 4.5:1.' },
  ],
  quiz: {
    seconds: 12,
    questions: [
      { id: 'q1', prompt: 'The most commonly confused pair is…', options: [{ id: 'a', label: 'Red and green' }, { id: 'b', label: 'Black and white' }], correct: 'a', explanation: 'Red–green deficiencies are most common.' },
      { id: 'q2', prompt: 'Links in body text should be…', options: [{ id: 'a', label: 'Only a different colour' }, { id: 'b', label: 'Underlined (or otherwise marked)' }, { id: 'c', label: 'Hidden' }], correct: 'b', explanation: 'Don’t rely on colour alone.' },
      { id: 'q3', prompt: 'A safer heat map uses…', options: [{ id: 'a', label: 'Red to green' }, { id: 'b', label: 'Rainbow' }, { id: 'c', label: 'Random colours' }, { id: 'd', label: 'Light to dark of one hue' }], correct: 'd', explanation: 'Lightness is widely visible.' },
      { id: 'q4', prompt: 'Colour should…', options: [{ id: 'a', label: 'Carry meaning alone' }, { id: 'b', label: 'Never be used' }, { id: 'c', label: 'Support meaning, alongside text or icons' }, { id: 'd', label: 'Always be red' }], correct: 'c', explanation: 'Support, don’t carry.' },
    ],
  },
  ladder: [
    { id: 'l1', prompt: 'What is deuteranopia?', hint: 'One of three cone types.', options: [{ id: 'a', label: 'Missing green-sensitive cones, so red and green look alike' }, { id: 'b', label: 'Total blindness' }, { id: 'c', label: 'Seeing only blue' }, { id: 'd', label: 'Night blindness' }], correct: 'a', explanation: 'The most common form, along with deuteranomaly.' },
    { id: 'l2', prompt: 'How can you check a design for colour blindness in Figma?', hint: 'Simulate it.', options: [{ id: 'a', label: 'Ask everyone on the team' }, { id: 'b', label: 'Use a colour-blindness simulator plugin or preview' }, { id: 'c', label: 'Print it' }, { id: 'd', label: 'You can’t' }], correct: 'b', explanation: 'Simulators show how designs look with each deficiency.' },
    { id: 'l3', prompt: 'Which WCAG criterion covers this lesson?', hint: '1.4.1.', options: [{ id: 'a', label: 'Captions' }, { id: 'b', label: 'Keyboard' }, { id: 'c', label: 'Use of Color: colour isn’t the only way to convey information' }, { id: 'd', label: 'Page titles' }], correct: 'c', explanation: 'WCAG 1.4.1 Use of Color (Level A).' },
    { id: 'l4', prompt: 'Non-text elements like icons and chart lines need what contrast?', hint: 'Lower than text.', options: [{ id: 'a', label: 'None' }, { id: 'b', label: '7:1' }, { id: 'c', label: '21:1' }, { id: 'd', label: 'At least 3:1 against what’s next to them' }], correct: 'd', explanation: 'WCAG 1.4.11 Non-text Contrast.' },
    { id: 'l5', prompt: 'A map uses six colours for six regions. Most robust fix?', hint: 'Labels win.', options: [{ id: 'a', label: 'Label regions directly, and add patterns if they’re small' }, { id: 'b', label: 'Use brighter colours' }, { id: 'c', label: 'Add a bigger legend' }, { id: 'd', label: 'Use six shades of red' }], correct: 'a', explanation: 'Direct labels remove the colour-matching step entirely.' },
  ],
};

export const ax1_4: Episode = {
  lessonId: 'ax.1-4',
  hook: 'A 16-pixel close button and a thumb the size of a coin. And for keyboard users, a focus ring someone deleted to “clean up the design”.',
  scene: {
    id: 'targets', duration: 34,
    beats: [
      { at: 0, title: 'Tiny targets', body: 'A 16 px close icon in the corner. The thumb lands on the ad behind it instead.' },
      { at: 6, title: '44 is the magic number', body: 'Give targets at least 44 × 44 points. The icon can stay small; the tap area grows.' },
      { at: 12, title: 'Space between', body: 'Two links 4 px apart: tap one, get the other. Spacing prevents mis-taps.' },
      { at: 18, title: 'The missing focus ring', body: 'A keyboard user tabs through a form, but the focus ring was removed. Where are they?' },
      { at: 24, title: 'Visible focus', body: 'A clear, thick focus ring. Every Tab press shows exactly where you are.' },
      { at: 29, title: 'Hittable and followable', body: '44-point targets, space between them, and focus you can always see.' },
    ],
  },
  check: [
    { id: 'c1', prompt: 'How big should a touch target be?', options: [{ id: 'a', label: 'At least 44 × 44 points' }, { id: 'b', label: '16 × 16 px is fine' }, { id: 'c', label: 'Exactly the icon size' }],
      correct: 'a', explanation: 'The tap area matters, not the icon.' },
    { id: 'c2', prompt: 'Why keep the focus ring?', options: [{ id: 'a', label: 'It’s decorative' }, { id: 'b', label: 'Keyboard users need to see where they are' }, { id: 'c', label: 'Browsers require it' }],
      correct: 'b', explanation: 'Without it, keyboard navigation is guesswork.' },
  ],
  game: {
    id: 'target-spot', title: 'Thumb and Tab test',
    instructions: 'Here is a checkout screen. Flag every element that fails the thumb or keyboard test, then hand in your audit to see a thumb drawn over each target.',
    lanes: [
      { id: 'problem', label: 'Fails', hint: 'Too small, too close, or no visible focus' },
      { id: 'ok', label: 'Passes', hint: 'Big enough, spaced, with visible focus' },
    ],
    cards: [
      { id: 'g1', label: 'Close icon, 16 × 16 px, no padding', lane: 'problem', visual: 'close-small', note: 'Give it a 44 × 44 tap area; the icon can stay small.' },
      { id: 'g2', label: 'Pay button, 48 px tall, full width', lane: 'ok', visual: 'pay-button', note: 'Big and easy to hit.' },
      { id: 'g3', label: '“Terms” and “Privacy” links 4 px apart', lane: 'problem', visual: 'links-close', note: 'Space them out or make each target bigger so a thumb hits only one.' },
      { id: 'g4', label: 'Coupon field showing a thick focus ring', lane: 'ok', visual: 'focus-ring', note: 'Keyboard users can see exactly where they are.' },
      { id: 'g5', label: 'Address field with outline: none and no replacement', lane: 'problem', visual: 'no-focus', note: 'Restore a visible focus style; never just remove it.' },
      { id: 'g6', label: 'Quantity − and + buttons, 44 × 44 each with a gap', lane: 'ok', visual: 'stepper', note: 'Each one is a full thumb-sized target.' },
      { id: 'g7', label: 'A 12 px checkbox whose label isn’t clickable', lane: 'problem', visual: 'tiny-check', note: 'Make the whole label clickable to grow the target.' },
      { id: 'g8', label: 'Bottom tab bar items, 56 px tall', lane: 'ok', visual: 'tabs', note: 'Generous targets right where thumbs rest.' },
    ],
  },
  gap: {
    id: 'gap', from: 18, at: 23.4,
    prompt: 'A keyboard user can’t tell which field is active because the focus ring was removed. Fix?',
    options: [{ id: 'a', label: 'Tell them to use a mouse' }, { id: 'b', label: 'Bring back a clear, visible focus style' }, { id: 'c', label: 'Make the fields bigger' }],
    correct: 'b', explanation: 'A visible focus indicator is essential for keyboard users (WCAG 2.4.7).',
  },
  takeaways: [
    { title: '44 × 44', body: 'Touch targets at least 44 pt (48 dp on Android); WCAG’s floor is 24 × 24.' },
    { title: 'Space between', body: 'Neighbouring targets need room so thumbs hit only one.' },
    { title: 'Keep focus visible', body: 'Never remove the focus ring without a replacement that’s just as clear.' },
  ],
  quiz: {
    seconds: 12,
    questions: [
      { id: 'q1', prompt: 'Minimum comfortable touch target on iOS?', options: [{ id: 'a', label: '44 × 44 pt' }, { id: 'b', label: '12 × 12 pt' }], correct: 'a', explanation: 'Apple’s guideline.' },
      { id: 'q2', prompt: 'outline: none with no replacement…', options: [{ id: 'a', label: 'Looks cleaner, no harm' }, { id: 'b', label: 'Hides focus from keyboard users' }, { id: 'c', label: 'Is required' }], correct: 'b', explanation: 'Keep focus visible.' },
      { id: 'q3', prompt: 'A small icon can stay small if…', options: [{ id: 'a', label: 'It’s red' }, { id: 'b', label: 'It’s at the top' }, { id: 'c', label: 'It’s bold' }, { id: 'd', label: 'Its tap area is padded to 44 × 44' }], correct: 'd', explanation: 'Tap area, not icon size.' },
      { id: 'q4', prompt: 'A checkbox’s target gets bigger when…', options: [{ id: 'a', label: 'You colour it' }, { id: 'b', label: 'You hide its label' }, { id: 'c', label: 'Its label is clickable too' }, { id: 'd', label: 'You shrink it' }], correct: 'c', explanation: 'The label becomes part of the target.' },
    ],
  },
  ladder: [
    { id: 'l1', prompt: 'What’s the Android guideline for touch targets?', hint: 'Density-independent pixels.', options: [{ id: 'a', label: '48 × 48 dp' }, { id: 'b', label: '24 × 24 dp' }, { id: 'c', label: '100 × 100 dp' }, { id: 'd', label: '10 × 10 dp' }], correct: 'a', explanation: 'Material Design recommends 48 dp.' },
    { id: 'l2', prompt: 'What does :focus-visible in CSS do?', hint: 'Keyboard vs mouse.', options: [{ id: 'a', label: 'Hides focus always' }, { id: 'b', label: 'Shows focus styles when the browser decides they’re needed, e.g. keyboard use' }, { id: 'c', label: 'Makes everything visible' }, { id: 'd', label: 'Focuses the first input' }], correct: 'b', explanation: 'Keyboard users get a ring; mouse clicks don’t show one.' },
    { id: 'l3', prompt: 'Which part of a phone screen is hardest to reach one-handed?', hint: 'Thumb zone.', options: [{ id: 'a', label: 'The bottom middle' }, { id: 'b', label: 'The centre' }, { id: 'c', label: 'The top corners' }, { id: 'd', label: 'Everywhere equally' }], correct: 'c', explanation: 'Put frequent actions within easy thumb reach.' },
    { id: 'l4', prompt: 'A sticky header covers the focused field when tabbing down a form. Which WCAG criterion?', hint: 'New in WCAG 2.2.', options: [{ id: 'a', label: 'Use of Color' }, { id: 'b', label: 'Captions' }, { id: 'c', label: 'Page titled' }, { id: 'd', label: 'Focus Not Obscured: focused items must not be hidden' }], correct: 'd', explanation: 'WCAG 2.4.11 Focus Not Obscured (2.2).' },
    { id: 'l5', prompt: 'What makes a good focus indicator?', hint: 'Contrast and size.', options: [{ id: 'a', label: 'Thick enough and 3:1 contrast against its surroundings' }, { id: 'b', label: 'A 1px light grey dotted line' }, { id: 'c', label: 'A colour change of the text only' }, { id: 'd', label: 'An animation that fades out' }], correct: 'a', explanation: 'Clearly visible against both the element and the page.' },
  ],
};
