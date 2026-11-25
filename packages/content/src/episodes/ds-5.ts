// Episodes for chapter ds.5 · Multi-brand & cross-platform systems. Drafts by Claude, for review.
// Rasta again, a year after ds.4. Rasta has bought Sawari, a premium intercity coach brand with its own iOS, Android
// and web apps, and Kavya's system team has two quarters to put it on Rasta's components without forking them. Meera
// Iyer is Sawari's brand lead; Arjun runs the token pipeline. The requests, decisions and drifts, and the rules they're
// judged by, are in ../multibrand and tested there.
import type { Episode } from '../episode';
import {
  SAWARI_DECISIONS, SAWARI_DRIFTS, SAWARI_REQUESTS, brandCall, parityCall, syncMove,
  type SawariDecision, type SawariDrift, type SawariRequest,
} from '../multibrand';

const request = (k: SawariRequest) => SAWARI_REQUESTS[k].text;
const call = (k: SawariRequest) => brandCall(SAWARI_REQUESTS[k]);
const decision = (k: SawariDecision) => SAWARI_DECISIONS[k].text;
const parity = (k: SawariDecision) => parityCall(SAWARI_DECISIONS[k]);
const drift = (k: SawariDrift) => SAWARI_DRIFTS[k].text;
const move = (k: SawariDrift) => syncMove(SAWARI_DRIFTS[k]);

export const ds5_1: Episode = {
  lessonId: 'ds.5-1',
  hook: 'Rasta has bought Sawari, a premium coach brand with 140 components of its own. Arjun’s plan is to copy Rasta’s library and paint it plum. Watch Kavya do it with 38 tokens instead.',
  scene: {
    id: 'theme-stack', duration: 36,
    beats: [
      { at: 0, title: 'A second brand', body: 'Sawari runs premium coaches on 11 intercity routes. It keeps its name, its plum and gold and its serif headings. It has two quarters to move onto Rasta’s system.' },
      { at: 6, title: 'The fork', body: 'Copy the library and restyle it: two Buttons by June, two sets of bugs by August, and Sawari stops getting Rasta’s fixes.' },
      { at: 11, title: 'Brand is a layer', body: 'Components read semantic tokens. Each brand gives those tokens its own values. The Button never asks which brand it’s in.' },
      { at: 16, title: 'Two brands, two modes', body: 'Rasta and Sawari, light and dark: four themes from one set of components, built for every platform.' },
      { at: 21, title: 'What a brand can turn', body: 'Colour roles, the heading face, radius, motion, icon stroke. Not error colours, tap targets, focus rings or the API.' },
      { at: 26, title: 'Every theme is checked', body: 'Plum-700 on gold-400 reads 4.25:1 and fails. One step darker, plum-800, reads 5.4:1 and still looks like Sawari.' },
      { at: 31, title: '38 of 412', body: 'Sawari sets 38 tokens and inherits the rest. When the focus ring is fixed, both apps get it in the same release.' },
    ],
  },
  check: [
    { id: 'c1', prompt: 'Why not copy the library for Sawari?', options: [{ id: 'a', label: 'Copying is against the rules' }, { id: 'b', label: 'Every fix has to land twice, and the copies drift apart within months' }, { id: 'c', label: 'It would be too fast' }],
      correct: 'b', explanation: 'A fork is a second system to maintain.' },
    { id: 'c2', prompt: 'How does the Button know it’s in Sawari?', options: [{ id: 'a', label: 'A `brand` prop' }, { id: 'b', label: 'It doesn’t: it reads semantic tokens, and Sawari’s theme gives them values' }, { id: 'c', label: 'A Sawari variant' }],
      correct: 'b', explanation: 'Brands are themes. Components stay brand-blind.' },
  ],
  game: {
    id: 'brand-tune', title: 'Tune the brand',
    instructions: 'Each card is a request from Meera, Sawari’s brand lead. Put it in Sawari’s theme as asked, tune it until it passes the shared contrast rule, or keep it shared by every brand. Tuned colours get a slider: find a step that passes.',
    lanes: [
      { id: 'theme', label: 'Theme it', hint: 'A brand value, fine as asked' },
      { id: 'tune', label: 'Tune it', hint: 'A brand value that fails as asked' },
      { id: 'shared', label: 'Keep shared', hint: 'Meaning, access or API: no brand owns it' },
    ],
    cards: [
      { id: 'g1', label: request('serif'), lane: call('serif'), visual: 'serif', note: 'The heading face is a brand token, `font-family-display`. Body text stays in the sans, which is tuned for small sizes and Indian scripts.' },
      { id: 'g2', label: request('goldLabel'), lane: call('goldLabel'), visual: 'goldLabel', note: 'Plum-700 on gold-400 is 4.25:1, close and failing. Plum-800 reaches 5.4:1, one step darker, and still reads as Sawari.' },
      { id: 'g3', label: request('errorGold'), lane: call('errorGold'), visual: 'errorGold', note: 'Error colours carry meaning across every brand, and gold already means “premium” in Sawari. Errors stay in the red family.' },
      { id: 'g4', label: request('radius'), lane: call('radius'), visual: 'radius', note: '`radius-container` is on the brand list. Sawari sets 12; every Card and Sheet follows without a code change.' },
      { id: 'g5', label: request('plumLink'), lane: call('plumLink'), visual: 'plumLink', note: 'Plum-400 on white is 2.9:1. Plum-500 just passes at 4.6:1; plum-600 gives more room.' },
      { id: 'g6', label: request('slimButton'), lane: call('slimButton'), visual: 'slimButton', note: 'The minimum tap area is shared: 44 px for a rider on a moving bus, whatever the brand. The button can look slimmer with less padding, but the target stays.' },
      { id: 'g7', label: request('cardEdge'), lane: call('cardEdge'), visual: 'cardEdge', note: 'Not a SawariCard. The Card reads a component token, `card-accent-border`; Sawari sets it to gold-400, Rasta leaves it transparent.' },
      { id: 'g8', label: request('darkLink'), lane: call('darkLink'), visual: 'darkLink', note: 'Plum-600 on the dark page is 2.9:1. Dark mode needs the light end of the ramp: plum-400 reaches 6.5:1.' },
      { id: 'g9', label: request('motion'), lane: call('motion'), visual: 'motion', note: 'Timing is brand personality. `motion-duration-base` goes to 280 ms for Sawari, and reduced motion still turns it off in both brands.' },
      { id: 'g10', label: request('focusRing'), lane: call('focusRing'), visual: 'focusRing', note: 'Keyboard and switch users need the ring in every brand. Sawari can tune its colour, not remove it.' },
      { id: 'g11', label: request('iconStroke'), lane: call('iconStroke'), visual: 'iconStroke', note: 'Icon stroke is style, so it’s a brand token. Check the 1.5 px icons at 16 px: thin strokes can vanish at small sizes.' },
    ],
  },
  gap: {
    id: 'gap', from: 6, at: 10.6,
    prompt: 'The CTO says copying the library is the fastest way to get Sawari live. What does Kavya propose?',
    options: [{ id: 'a', label: 'Copy it; fix the drift later' }, { id: 'b', label: 'One set of components, with a Sawari brand layer of tokens the build turns into Sawari’s light and dark themes' }, { id: 'c', label: 'A `brand` prop on every component' }],
    correct: 'b', explanation: 'Keep the components single, and put the brand in the values.',
  },
  takeaways: [
    { title: 'Brands are themes', body: 'Components read semantic and component tokens. Each brand gives them values. No brand props, no brand variants.' },
    { title: 'Brand × mode', body: 'Two brands in light and dark are four themes, all built from one source for every platform.' },
    { title: 'A short list of knobs', body: 'Publish what a brand may set. Most brands need a few dozen tokens; the rest is inherited.' },
    { title: 'Shared rules, tuned values', body: 'Every theme passes the same checks. A brand colour that fails moves along its ramp; the rule doesn’t bend.' },
  ],
  quiz: {
    seconds: 15,
    questions: [
      { id: 'q1', prompt: 'Two brands, light and dark. How many themes?', options: [{ id: 'a', label: '2' }, { id: 'b', label: '4' }, { id: 'c', label: '8' }], correct: 'b', explanation: 'Brand times mode.' },
      { id: 'q2', prompt: 'Sawari wants gold error messages. That’s…', options: [{ id: 'a', label: 'A brand token' }, { id: 'b', label: 'Shared: errors keep their meaning' }, { id: 'c', label: 'A new variant' }], correct: 'b', explanation: 'Feedback colours mean the same in every brand.' },
      { id: 'q3', prompt: 'A brand colour fails contrast. First move?', options: [{ id: 'a', label: 'Waive the check' }, { id: 'b', label: 'Tune it along its ramp' }, { id: 'c', label: 'Drop the colour' }], correct: 'b', explanation: 'Usually a step or two fixes it.' },
      { id: 'q4', prompt: 'Sawari’s cards need a gold edge. Best way?', options: [{ id: 'a', label: 'A component token each brand sets' }, { id: 'b', label: 'A SawariCard' }, { id: 'c', label: 'A `brand` prop' }], correct: 'a', explanation: 'The Card stays one component.' },
    ],
  },
  ladder: [
    { id: 'l1', prompt: 'Why keep the brand layer small?', hint: 'Count the combinations.', options: [{ id: 'a', label: 'Small files load faster' }, { id: 'b', label: 'Every token a brand can set multiplies by modes and platforms, and has to be checked in each; a short list keeps that testable and keeps the brands on the same system' }, { id: 'c', label: 'Brand teams can’t handle many tokens' }, { id: 'd', label: 'It doesn’t matter' }], correct: 'b', explanation: 'A brand that can set everything is a fork in token form.' },
    { id: 'l2', prompt: 'Sawari’s dark theme uses plum-300 for the primary button. Why not the light theme’s plum-700?', hint: 'What is it sitting on?', options: [{ id: 'a', label: 'Plum-300 is more on brand' }, { id: 'b', label: 'Plum-700 on the near-black page is about 2:1; the dark theme needs the light end of the ramp, with a dark label' }, { id: 'c', label: 'Dark mode should always be pastel' }, { id: 'd', label: 'To save battery' }], correct: 'b', explanation: 'Each brand needs its own dark values. Modes are per brand, not shared.' },
    { id: 'l3', prompt: 'A third brand, a white-label app for a city transport corporation, wants a different spacing scale. What should Kavya say?', hint: 'What do components assume about spacing?', options: [{ id: 'a', label: 'Yes, spacing is brand' }, { id: 'b', label: 'The scale is shared, because layouts and components are built on its steps; a brand can choose which steps a few component tokens use, like card padding' }, { id: 'c', label: 'Fork the layout components' }, { id: 'd', label: 'Refuse the brand' }], correct: 'b', explanation: 'Share the structure; let the brand pick within it.' },
    { id: 'l4', prompt: 'How should the system catch a brand colour that fails contrast before it ships?', hint: 'Who looks at all four themes?', options: [{ id: 'a', label: 'Designers check by eye' }, { id: 'b', label: 'The token build checks every text and control pair in every brand and mode, and fails the build when one is below the rule' }, { id: 'c', label: 'QA tests the app once a quarter' }, { id: 'd', label: 'Riders report it' }], correct: 'b', explanation: 'Four themes are too many to check by eye. Let the build do it every time.' },
    { id: 'l5', prompt: 'Six months in, Sawari’s team asks for 120 more brand tokens. What is that a sign of?', hint: 'What are they trying to change?', options: [{ id: 'a', label: 'Sawari is growing' }, { id: 'b', label: 'They want components to behave differently, not just look different; find which ones, and decide whether it’s a missing variant for everyone or a product component of their own' }, { id: 'c', label: 'The token names are too long' }, { id: 'd', label: 'Nothing; approve them' }], correct: 'b', explanation: 'A brand layer that keeps growing is a fork arriving slowly. Find the real need.' },
  ],
};

export const ds5_2: Episode = {
  lessonId: 'ds.5-2',
  hook: 'On Android, Sawari showed the ₹62 fee after Pay. On iOS and the web, before it. Support got 300 calls in a week. Meanwhile, the web team was copying the iPhone’s wheel picker. Watch parity sorted out.',
  scene: {
    id: 'platform-parity', duration: 36,
    beats: [
      { at: 0, title: 'Three apps, one ticket', body: 'The same Chennai to Bengaluru seat, booked on iOS, Android and the web. On Android the ₹62 convenience fee appears after Pay.' },
      { at: 6, title: 'Identical isn’t the goal', body: 'The web team copied the iPhone’s wheel picker so everything matches. It fights the keyboard and the screen reader.' },
      { at: 11, title: 'Same: what it means', body: 'The fare and its fees, the order of the steps, what an error says, the brand. A rider gets the same answer everywhere.' },
      { at: 16, title: 'Adapt: how it’s measured', body: 'Body text: 17 pt, 16 sp, 1 rem. Tap area: 44 pt, 48 dp, 44 px. One token, each platform’s own unit.' },
      { at: 21, title: 'Native: what the OS owns', body: 'Going back, sharing, switches, time pickers. Riders already know them, and they come with accessibility built in.' },
      { at: 26, title: 'One table per component', body: 'The Button spec lists what’s shared, what’s adapted and to what, and where the platform takes over.' },
      { at: 31, title: 'Checked at release', body: 'Each release, the shared rows are checked on all three. The fee now shows before Pay everywhere.' },
    ],
  },
  check: [
    { id: 'c1', prompt: 'Why was the fee difference a bug, not a platform choice?', options: [{ id: 'a', label: 'It looked different' }, { id: 'b', label: 'When a rider learns what they’ll pay is meaning, and meaning must match everywhere' }, { id: 'c', label: 'Android is less important' }],
      correct: 'b', explanation: 'Prices, steps and words are the product.' },
    { id: 'c2', prompt: 'Why use each platform’s own time picker?', options: [{ id: 'a', label: 'It’s cheaper' }, { id: 'b', label: 'Riders know it, and it brings keyboard, screen reader and locale support with it' }, { id: 'c', label: 'Custom pickers are banned' }],
      correct: 'b', explanation: 'The native control is the accessible one.' },
  ],
  game: {
    id: 'parity-sort', title: 'Sort for parity',
    instructions: 'Each card is a decision in Sawari’s booking flow. Is it the same on iOS, Android and the web, adapted to each platform’s units, or each platform’s own control? Right calls draw it on all three.',
    lanes: [
      { id: 'same', label: 'Same', hint: 'Meaning or brand: identical everywhere' },
      { id: 'adapt', label: 'Adapt', hint: 'Same intent, each platform’s unit' },
      { id: 'native', label: 'Native', hint: 'The platform’s own control or gesture' },
    ],
    cards: [
      { id: 'g1', label: decision('fare'), lane: parity('fare'), visual: 'fare', note: 'The fee and when it appears are what the product charges. Identical, before Pay, on every platform.' },
      { id: 'g2', label: decision('back'), lane: parity('back'), visual: 'back', note: 'Edge swipe and the back button on iOS, the system back gesture on Android, the browser’s back on the web. Don’t fight any of them.' },
      { id: 'g3', label: decision('bodySize'), lane: parity('bodySize'), visual: 'bodySize', note: 'One token, “body”, built as 17 pt with Dynamic Type, 16 sp with the font scale and 1 rem with browser zoom.' },
      { id: 'g4', label: decision('steps'), lane: parity('steps'), visual: 'steps', note: 'A rider who starts on the web and finishes on the phone should meet the same steps in the same order.' },
      { id: 'g5', label: decision('share'), lane: parity('share'), visual: 'share', note: 'The system share sheet already lists the rider’s WhatsApp chats. A custom one would list fewer.' },
      { id: 'g6', label: decision('target'), lane: parity('target'), visual: 'target', note: 'Same intent, each platform’s guideline: 44 pt, 48 dp and 44 px. Seats on a coach map are small, so this one matters.' },
      { id: 'g7', label: decision('upiError'), lane: parity('upiError'), visual: 'upiError', note: 'The words come from one content source. “Not charged” on one platform and silence on another is how riders end up paying twice.' },
      { id: 'g8', label: decision('toggle'), lane: parity('toggle'), visual: 'toggle', note: 'An iOS switch, a Material switch, and on the web a switch with `role="switch"`. The setting it controls is the same.' },
      { id: 'g9', label: decision('elevation'), lane: parity('elevation'), visual: 'elevation', note: 'One token, “raised”. A shadow on iOS and the web, a lighter tonal surface on Android, as Material 3 does it.' },
      { id: 'g10', label: decision('plum'), lane: parity('plum'), visual: 'plum', note: 'The brand is the same everywhere. The value comes from one token, built into each platform’s colour format.' },
      { id: 'g11', label: decision('time'), lane: parity('time'), visual: 'time', note: 'The wheel on iOS, the clock dial on Android, `<input type="time">` on the web. What the alarm does is identical.' },
    ],
  },
  gap: {
    id: 'gap', from: 6, at: 10.6,
    prompt: 'The web team wants every screen pixel-identical to iOS, wheel picker and all. What does Kavya say?',
    options: [{ id: 'a', label: 'Agree: consistency is the point' }, { id: 'b', label: 'Match what the product means everywhere; adapt units, and use each platform’s own controls' }, { id: 'c', label: 'Let each platform design its own flow' }],
    correct: 'b', explanation: 'Parity is in meaning, not in pixels.',
  },
  takeaways: [
    { title: 'Same meaning', body: 'Prices, fees, steps, words and brand are identical on every platform.' },
    { title: 'Adapted units', body: 'Type size, tap targets and elevation keep one intent, in pt, dp, sp, px or rem.' },
    { title: 'Native controls', body: 'Back, share, switches and pickers belong to the platform, with their accessibility built in.' },
    { title: 'A table per component', body: 'Write down what is shared, adapted and native, and check the shared rows every release.' },
  ],
  quiz: {
    seconds: 15,
    questions: [
      { id: 'q1', prompt: 'The order of booking steps is…', options: [{ id: 'a', label: 'Same everywhere' }, { id: 'b', label: 'Adapted' }, { id: 'c', label: 'Native' }], correct: 'a', explanation: 'It’s what the product does.' },
      { id: 'q2', prompt: 'Minimum tap area on Android is…', options: [{ id: 'a', label: '44 pt' }, { id: 'b', label: '48 dp' }, { id: 'c', label: '24 px' }], correct: 'b', explanation: 'Material’s guideline; iOS uses 44 pt.' },
      { id: 'q3', prompt: 'Going back from the seat map should…', options: [{ id: 'a', label: 'Use a custom back button everywhere' }, { id: 'b', label: 'Follow each platform' }, { id: 'c', label: 'Be disabled' }], correct: 'b', explanation: 'Riders already know their platform’s back.' },
      { id: 'q4', prompt: 'Body text follows the phone’s text-size setting via…', options: [{ id: 'a', label: 'Dynamic Type and sp' }, { id: 'b', label: 'Fixed px' }, { id: 'c', label: 'Images of text' }], correct: 'a', explanation: 'Each platform’s own scaling.' },
    ],
  },
  ladder: [
    { id: 'l1', prompt: 'Why is pixel-identical a poor parity goal?', hint: 'Whose habits does it break?', options: [{ id: 'a', label: 'It’s too expensive' }, { id: 'b', label: 'It forces one platform’s controls onto the others, so every platform feels slightly wrong, and native accessibility is lost' }, { id: 'c', label: 'Screens can’t be measured' }, { id: 'd', label: 'Designers prefer variety' }], correct: 'b', explanation: 'Match meaning; respect each platform’s conventions.' },
    { id: 'l2', prompt: 'What makes “adapt” different from “native”?', hint: 'Who decides the value?', options: [{ id: 'a', label: 'Nothing' }, { id: 'b', label: 'Adapt: the system keeps one intent and each platform expresses it in its unit; native: the platform’s own control replaces the system’s' }, { id: 'c', label: 'Native is only for iOS' }, { id: 'd', label: 'Adapt is for the web only' }], correct: 'b', explanation: 'One is a token with three outputs; the other is a component the system doesn’t build.' },
    { id: 'l3', prompt: 'Sawari wants a custom date picker for pass ranges, because no platform control picks a start and end date with fares on each day. Is that a parity failure?', hint: 'Does a native control do this job?', options: [{ id: 'a', label: 'Yes: always use native' }, { id: 'b', label: 'No: when no platform control does the job, build one component, keep its behaviour the same, and make it meet each platform’s accessibility and input rules' }, { id: 'c', label: 'Build three different ones' }, { id: 'd', label: 'Drop the fares' }], correct: 'b', explanation: 'Native where it exists. Where it doesn’t, one shared component, held to each platform’s rules.' },
    { id: 'l4', prompt: 'How should Sawari check parity at each release?', hint: 'What actually has to match?', options: [{ id: 'a', label: 'Overlay screenshots from each platform' }, { id: 'b', label: 'Check the shared rows of each component’s platform table, and the flow’s fees, steps and copy, on all three' }, { id: 'c', label: 'Ask the brand team' }, { id: 'd', label: 'Check one platform; the others follow' }], correct: 'b', explanation: 'Check what must match, not what may differ.' },
    { id: 'l5', prompt: 'Where should the error copy for a failed UPI payment live, so all three apps say the same thing?', hint: 'How do tokens stay the same?', options: [{ id: 'a', label: 'Typed into each app' }, { id: 'b', label: 'In one content source, keyed by message, translated once and built into each platform, like tokens' }, { id: 'c', label: 'In the Figma file' }, { id: 'd', label: 'In the support team’s FAQ' }], correct: 'b', explanation: 'Words that must match need one source, the same as values.' },
  ],
};

export const ds5_3: Episode = {
  lessonId: 'ds.5-3',
  hook: 'Figma says Sawari’s primary plum is 600. The code says 700. A design review turns into an argument about which one is real. Arjun’s first nightly check finds 47 differences like it. Watch them get a direction.',
  scene: {
    id: 'sync-loop', duration: 36,
    beats: [
      { at: 0, title: 'Two truths', body: 'Figma shows plum-600. The app ships plum-700. The first nightly check finds 47 differences between the library and the code.' },
      { at: 6, title: 'A source for each thing', body: 'Token values: the tokens repo. A component’s API: the code. New designs: Figma, once an RFC is approved.' },
      { at: 11, title: 'Tokens flow out', body: 'One JSON source builds Figma’s variables and CSS, Compose and Swift, for both brands in light and dark.' },
      { at: 16, title: 'Code beside the component', body: 'Code Connect shows the real component code in Dev Mode, so Figma’s property names have to match the code’s.' },
      { at: 21, title: 'Every night, a diff', body: 'The check compares components, properties and variable values, and opens an issue naming the side that must move.' },
      { at: 26, title: 'Catch up, or revert', body: 'In the source: the side that’s behind catches up. Not in the source: undo it where it was made.' },
      { at: 31, title: 'One version', body: '4.1.0 ships to Figma, npm, Maven and the Swift package on the same day. 47 drifts down to 3.' },
    ],
  },
  check: [
    { id: 'c1', prompt: 'Where does Sawari’s plum value live?', options: [{ id: 'a', label: 'Figma' }, { id: 'b', label: 'The tokens repo, which builds Figma and code' }, { id: 'c', label: 'The Android theme' }],
      correct: 'b', explanation: 'Both sides are outputs of one source.' },
    { id: 'c2', prompt: 'A change that isn’t in its source should be…', options: [{ id: 'a', label: 'Copied to the other side' }, { id: 'b', label: 'Reverted where it was made, and proposed properly if wanted' }, { id: 'c', label: 'Ignored' }],
      correct: 'b', explanation: 'Otherwise every hand edit becomes a release.' },
  ],
  game: {
    id: 'sync-flow', title: 'Send it the right way',
    instructions: 'Each card is a difference the nightly check found between Figma and code. Build it in code, bring Figma up to date, or revert it where it was made. Watch the drift count fall.',
    lanes: [
      { id: 'to-code', label: 'To code', hint: 'Approved, and code is behind' },
      { id: 'to-figma', label: 'To Figma', hint: 'Released or merged, and Figma is behind' },
      { id: 'revert', label: 'Revert', hint: 'Went around its source' },
    ],
    cards: [
      { id: 'g1', label: drift('ghost'), lane: move('ghost'), visual: 'ghost', note: 'RFC-41 approved it, so the design is the truth for now. Build it in React, Compose and SwiftUI, then Code Connect links all three.' },
      { id: 'g2', label: drift('handRadius'), lane: move('handRadius'), visual: 'handRadius', note: 'Figma’s variables are an output. Revert the edit, and if 20 px is better, open a tokens pull request so it changes everywhere.' },
      { id: 'g3', label: drift('slot'), lane: move('slot'), visual: 'slot', note: 'It shipped in 3.5.0, so code is the truth. Add the slot to the Figma Input, named exactly `iconTrailing`.' },
      { id: 'g4', label: drift('brandVariant'), lane: move('brandVariant'), visual: 'brandVariant', note: 'Brands are themes, not variants. Remove it, and switch the Sheet to Sawari’s mode to see it in plum.' },
      { id: 'g5', label: drift('focus'), lane: move('focus'), visual: 'focus', note: 'Approved after the audit, and the web is behind. The 3 px ring with a 2 px gap is a token change, so iOS and Android get it in the same build.' },
      { id: 'g6', label: drift('rename'), lane: move('rename'), visual: 'rename', note: 'Code owns the API. Rename the Figma property to “variant” so Dev Mode and Code Connect agree with the code.' },
      { id: 'g7', label: drift('brandProp'), lane: move('brandProp'), visual: 'brandProp', note: 'Decline it. The Card should read `card-accent-border`, which Sawari’s theme sets to gold.' },
      { id: 'g8', label: drift('plumValue'), lane: move('plumValue'), visual: 'plumValue', note: 'The tokens repo is the truth, and code already follows it. Run the variables sync so Figma’s Sawari mode shows plum-700.' },
      { id: 'g9', label: drift('goldBright'), lane: move('goldBright'), visual: 'goldBright', note: 'A colour only Android has will never reach iOS, the web or Figma. Remove it, and propose it as a token if Sawari needs it.' },
      { id: 'g10', label: drift('serifIos'), lane: move('serifIos'), visual: 'serifIos', note: 'Merged and released. The iOS build is behind: register the font and map `font-family-display` in the Swift theme.' },
      { id: 'g11', label: drift('iconSize'), lane: move('iconSize'), visual: 'iconSize', note: 'Nobody proposed it, and code doesn’t support it. Remove the size from Figma; if 20 px is needed, that’s an RFC.' },
    ],
  },
  gap: {
    id: 'gap', from: 21, at: 25.6,
    prompt: 'The check finds a Sawari radius edited by hand in Figma’s variables. A designer says it looks better. What happens?',
    options: [{ id: 'a', label: 'Engineers match Figma' }, { id: 'b', label: 'Revert it in Figma, and open a tokens pull request if it’s wanted' }, { id: 'c', label: 'Sync it back into the tokens repo automatically' }],
    correct: 'b', explanation: 'Change the source, through review, and every output follows.',
  },
  takeaways: [
    { title: 'A source for each thing', body: 'Token values in the tokens repo, component APIs in code, new designs in Figma once an RFC is approved.' },
    { title: 'Outputs aren’t edited', body: 'Figma variables and platform themes are built from the source. Hand edits are drift.' },
    { title: 'Drift has a direction', body: 'If the source has it, the side that’s behind catches up. If not, revert it where it was made.' },
    { title: 'One version, both sides', body: 'Release the library and the code together, so a version means the same thing to everyone.' },
  ],
  quiz: {
    seconds: 15,
    questions: [
      { id: 'q1', prompt: 'A shipped prop is missing in Figma. Move?', options: [{ id: 'a', label: 'To Figma' }, { id: 'b', label: 'To code' }, { id: 'c', label: 'Revert' }], correct: 'a', explanation: 'Code owns the API.' },
      { id: 'q2', prompt: 'An approved RFC variant isn’t in code. Move?', options: [{ id: 'a', label: 'Revert' }, { id: 'b', label: 'To code' }, { id: 'c', label: 'To Figma' }], correct: 'b', explanation: 'Approved designs get built.' },
      { id: 'q3', prompt: 'Code Connect shows…', options: [{ id: 'a', label: 'Real component code in Dev Mode' }, { id: 'b', label: 'Token contrast' }, { id: 'c', label: 'Analytics' }], correct: 'a', explanation: 'It links a Figma component to its code.' },
      { id: 'q4', prompt: 'A colour exists only in the Android theme. Move?', options: [{ id: 'a', label: 'Copy it to iOS' }, { id: 'b', label: 'Revert it' }, { id: 'c', label: 'Add it to Figma' }], correct: 'b', explanation: 'It never went through the tokens repo.' },
    ],
  },
  ladder: [
    { id: 'l1', prompt: 'Why shouldn’t Figma’s variables sync back into the tokens repo automatically?', hint: 'What would every hand edit become?', options: [{ id: 'a', label: 'The API is slow' }, { id: 'b', label: 'Every edit in a design file would become a change to every app, with no review and no contrast check' }, { id: 'c', label: 'Figma can’t export JSON' }, { id: 'd', label: 'It would be too consistent' }], correct: 'b', explanation: 'Changes reach the source through review. Outputs flow one way.' },
    { id: 'l2', prompt: 'Why is code, not Figma, the source of truth for a component’s API?', hint: 'Which one breaks builds?', options: [{ id: 'a', label: 'Engineers are senior' }, { id: 'b', label: 'Props and slots are a contract other code depends on and versioning protects; Figma mirrors that contract so designers use the same names' }, { id: 'c', label: 'Figma has no properties' }, { id: 'd', label: 'Code is newer' }], correct: 'b', explanation: 'The API is what squads build on, so it lives where it can break a build.' },
    { id: 'l3', prompt: 'The nightly check opens 47 issues on its first run. What should Arjun do first?', hint: 'Not all drift costs the same.', options: [{ id: 'a', label: 'Fix them in the order found' }, { id: 'b', label: 'Triage by impact: shipped values that differ from what designers see first, then APIs, then unused leftovers; and stop new drift by making Figma variables a build output' }, { id: 'c', label: 'Turn the check off until it’s quieter' }, { id: 'd', label: 'Close them all' }], correct: 'b', explanation: 'Stop the leak, then mop up by impact.' },
    { id: 'l4', prompt: 'Designers want to explore a new card layout without breaking the library. Where should they work?', hint: 'When does a design become the truth?', options: [{ id: 'a', label: 'In the main library' }, { id: 'b', label: 'In a Figma branch or a separate file, until an RFC is approved; then the library and code change together' }, { id: 'c', label: 'In code first' }, { id: 'd', label: 'In the tokens repo' }], correct: 'b', explanation: 'Exploration is free; it becomes the truth when it’s approved.' },
    { id: 'l5', prompt: 'What does releasing Figma and code under one version, 4.1.0, make possible?', hint: 'Think about a design review and a bug report.', options: [{ id: 'a', label: 'Fewer releases' }, { id: 'b', label: '“Which version are you on?” has one answer for designers and engineers, and a screen can be checked against the design for the same release' }, { id: 'c', label: 'Nothing; versions are for code' }, { id: 'd', label: 'Faster builds' }], correct: 'b', explanation: 'A shared version makes the library and the code comparable.' },
  ],
};
