// Episodes for chapter dc.2 · Handoff & collaboration. Drafts by Claude, for review.
// Gaadi is an intercity bus-booking app. Sana Kapoor, its product designer, hands Ritesh Nair (front-end engineer) the
// "Change your trip" sheet, runs a design QA pass on his build, and fixes the Confirm button's contrast with one
// token change that reaches web, Android and iOS. The spec lines, QA findings and code lines, and the rules they're
// judged by, are in ../handoff and tested there.
import type { Episode } from '../episode';
import { GAADI_CODE, GAADI_QA, GAADI_SPEC, qaLane, refKind, type GaadiCode, type GaadiQa, type GaadiSpecItem } from '../handoff';

const line = (k: GaadiSpecItem) => GAADI_SPEC[k].text;
const finding = (k: GaadiQa) => `${GAADI_QA[k].where}: ${GAADI_QA[k].actual}`;
const lane = (k: GaadiQa) => qaLane(GAADI_QA[k]);
const code = (k: GaadiCode) => `${GAADI_CODE[k].where} (${GAADI_CODE[k].platform}): ${GAADI_CODE[k].code}`;
const ref = (k: GaadiCode) => refKind(GAADI_CODE[k].code);

export const dc2_1: Episode = {
  lessonId: 'dc.2-1',
  hook: 'Sana redlined every pixel of the sheet. Ritesh still sent 23 questions, and not one was about pixels.',
  scene: {
    id: 'spec-handoff', duration: 36,
    beats: [
      { at: 0, title: 'Every pixel, by hand', body: 'Sana’s first handoff for “Change your trip”: redlines on every gap, hex codes typed beside each colour, and a link to the research deck.' },
      { at: 6, title: '23 questions in Slack', body: 'Ritesh builds it and the questions arrive. What if it’s sold out? What loads first? What does TalkBack say? The redlines answer none of them.' },
      { at: 11, title: 'Dev Mode already knows', body: 'Every size, colour and font is in Dev Mode with its token name, and stays right when the design changes. Sana deletes the redlines.' },
      { at: 16, title: 'Every state, side by side', body: 'Default, loading, fare check failed, sold out, too late to change. Each drawn, each with its message and what the person can do next.' },
      { at: 21, title: 'Numbered notes', body: 'Long operator names, the layout at 320 px and 200% text, the screen reader label and focus order, and where the fare difference comes from.' },
      { at: 26, title: 'Twenty minutes, before the sprint', body: 'Sana walks Ritesh through the spec. He catches one gap, the ₹50 fee, and she adds it to the file while he watches.' },
      { at: 31, title: 'Two questions', body: 'The next feature’s build: two questions, both answered as comments in the file, where the next engineer will find them.' },
    ],
  },
  check: [
    { id: 'c1', prompt: 'Why did the redlines not stop Ritesh’s questions?', options: [{ id: 'a', label: 'They were the wrong size' }, { id: 'b', label: 'They repeated what Dev Mode shows, and left out states, edge cases and behaviour' }, { id: 'c', label: 'Ritesh didn’t read them' }],
      correct: 'b', explanation: 'Measurements were never the hard part. What happens when things go wrong was.' },
    { id: 'c2', prompt: 'Why walk Ritesh through the spec before the sprint?', options: [{ id: 'a', label: 'To get approval' }, { id: 'b', label: 'Gaps surface in 20 minutes, not halfway through the build' }, { id: 'c', label: 'It’s a company rule' }],
      correct: 'b', explanation: 'A short walkthrough is the cheapest point to find what the spec forgot.' },
  ],
  game: {
    id: 'spec-write', title: 'Write the spec Ritesh needs',
    instructions: 'Each card is a line Sana could put in the handoff. Write it in the spec, leave it to Dev Mode, or leave it out. Ritesh’s questions tick off as the spec answers them.',
    lanes: [
      { id: 'note', label: 'Write it in the spec', hint: 'Only the designer knows it' },
      { id: 'tool', label: 'Dev Mode shows it', hint: 'Sizes, colours, fonts, tokens' },
      { id: 'cut', label: 'Leave it out', hint: 'Not the spec’s job' },
    ],
    cards: [
      { id: 'g1', label: line('padding'), lane: 'tool', visual: 'padding', note: 'Dev Mode shows the exact values with their tokens. A hand-typed copy goes stale the first time the design changes.' },
      { id: 'g2', label: line('states'), lane: 'note', visual: 'states', note: 'Loading and failure only exist in Sana’s head until they’re drawn. And the old booking staying safe is a promise worth writing down.' },
      { id: 'g3', label: line('history'), lane: 'cut', visual: 'history', note: 'Ritesh builds the final version. One line on why it changed is enough; the rest stays in the file’s history.' },
      { id: 'g4', label: line('edge'), lane: 'note', visual: 'edge', note: 'The cases that cause the most Slack messages. Each gets its message and a way forward.' },
      { id: 'g5', label: line('hex'), lane: 'tool', visual: 'hex', note: 'A hex in the spec invites a hex in the code. Dev Mode shows the token, color-action-primary, which is what he should use.' },
      { id: 'g6', label: line('a11y'), lane: 'note', visual: 'a11y', note: 'The label, the role and the focus order aren’t visible in any frame. Without them, the screen reader reads “button, button, button”.' },
      { id: 'g7', label: line('vibe'), lane: 'cut', visual: 'vibe', note: 'Nobody can build a feeling. If the motion matters, give the duration and easing: 250 ms, ease-out.' },
      { id: 'g8', label: line('content'), lane: 'note', visual: 'content', note: 'Real data is longer than the mock. Say what wraps, what truncates, and what must never be cut.' },
      { id: 'g9', label: line('font'), lane: 'tool', visual: 'font', note: 'The text style is in Dev Mode by name. Retyping it is one more thing to keep in sync.' },
      { id: 'g10', label: line('responsive'), lane: 'note', visual: 'responsive', note: 'The mock is one phone at one text size. The rule for the others has to be written.' },
      { id: 'g11', label: line('deck'), lane: 'cut', visual: 'deck', note: 'Useful context, wrong place. One line of why at the top of the spec does the job.' },
      { id: 'g12', label: line('data'), lane: 'note', visual: 'data', note: 'Where a number comes from, and whether GST is in it, decides what the user is charged. Never leave it to a guess.' },
    ],
  },
  gap: {
    id: 'gap', from: 6, at: 10.6,
    prompt: 'Ritesh’s questions are piling up. What should Sana change about the handoff?',
    options: [{ id: 'a', label: 'Add even more redlines' }, { id: 'b', label: 'Drop the redlines for Dev Mode, and spend the time on states, edge cases and behaviour' }, { id: 'c', label: 'Ask Ritesh to stop messaging' }],
    correct: 'b', explanation: 'Let the tool carry the measurements; the spec carries what only the designer knows.',
  },
  takeaways: [
    { title: 'Don’t redline what Dev Mode shows', body: 'Sizes, colours and fonts come from the file, with their tokens.' },
    { title: 'Draw every state', body: 'Loading, error, empty, disabled, and the edge cases, side by side.' },
    { title: 'Write the invisible rules', body: 'Content limits, small screens and large text, screen reader labels and focus, data sources.' },
    { title: 'Walk it through, keep answers in the file', body: 'Twenty minutes before the sprint; questions answered as comments, not DMs.' },
  ],
  quiz: {
    seconds: 12,
    questions: [
      { id: 'q1', prompt: 'The most useful thing a spec adds to Dev Mode is…', options: [{ id: 'a', label: 'States, edge cases and behaviour' }, { id: 'b', label: 'Every measurement again' }], correct: 'a', explanation: 'The tool already has the measurements.' },
      { id: 'q2', prompt: 'A spec says “make it feel premium”. That’s…', options: [{ id: 'a', label: 'A clear instruction' }, { id: 'b', label: 'A legal requirement' }, { id: 'c', label: 'Not buildable: give durations, easing and examples instead' }], correct: 'c', explanation: 'Engineers build numbers and rules, not adjectives.' },
      { id: 'q3', prompt: 'Where should the answer to an engineer’s question live?', options: [{ id: 'a', label: 'As a comment or note in the design file' }, { id: 'b', label: 'In a private DM' }, { id: 'c', label: 'In someone’s memory' }], correct: 'a', explanation: 'Next to the design, where the next person looks.' },
      { id: 'q4', prompt: 'A handoff walkthrough works best…', options: [{ id: 'a', label: 'After the build is done' }, { id: 'b', label: 'Only for big features' }, { id: 'c', label: 'By email' }, { id: 'd', label: 'Before the sprint starts, with the engineer, in the file' }], correct: 'd', explanation: 'That’s when a gap costs minutes, not days.' },
    ],
  },
  ladder: [
    { id: 'l1', prompt: 'Why is hand-typing hex codes into a spec risky?', hint: 'What happens next week?', options: [{ id: 'a', label: 'They’re hard to read' }, { id: 'b', label: 'The copy drifts from the file, and it invites hard-coded values instead of tokens' }, { id: 'c', label: 'Hex is deprecated' }, { id: 'd', label: 'It isn’t risky' }], correct: 'b', explanation: 'One source of truth: the file and its tokens.' },
    { id: 'l2', prompt: 'Which states should a spec for a form-like sheet show?', hint: 'More than the happy path.', options: [{ id: 'a', label: 'Just the default' }, { id: 'b', label: 'Default and hover' }, { id: 'c', label: 'Default, loading, error, disabled and each edge case, with what the user can do next' }, { id: 'd', label: 'Only the error' }], correct: 'c', explanation: 'Every state an engineer must build needs a drawing or a rule.' },
    { id: 'l3', prompt: 'Ritesh says the sheet’s animation is “just a default slide”. Sana cares about it. What does she add?', hint: 'Make it buildable.', options: [{ id: 'a', label: '“Make it nicer”' }, { id: 'b', label: 'A duration, an easing curve, what moves, and what happens with reduced motion on' }, { id: 'c', label: 'A Dribbble link' }, { id: 'd', label: 'Nothing' }], correct: 'b', explanation: 'Numbers plus the reduced-motion rule, so it can be built and checked.' },
    { id: 'l4', prompt: 'A spec note says “truncate long names”. What’s missing?', hint: 'Which names, how?', options: [{ id: 'a', label: 'Nothing' }, { id: 'b', label: 'A colour' }, { id: 'c', label: 'The font' }, { id: 'd', label: 'Where it truncates, after how many lines, and what must never be cut' }], correct: 'd', explanation: 'A boarding point cut to “Majestic Bus St…” is a missed bus.' },
    { id: 'l5', prompt: 'Halfway through the build, Sana changes the sheet. What’s the right move?', hint: 'Who needs to know?', options: [{ id: 'a', label: 'Change the file quietly' }, { id: 'b', label: 'Mark the change in the file, note what and why, and tell Ritesh before he builds the old version' }, { id: 'c', label: 'Wait until QA' }, { id: 'd', label: 'Start a new file' }], correct: 'b', explanation: 'Silent changes are how builds and designs drift apart.' },
  ],
};

export const dc2_2: Episode = {
  lessonId: 'dc.2-2',
  hook: 'On Sana’s iPhone the sheet looked perfect. On a ₹9,000 Android, Confirm charged the fee twice.',
  scene: {
    id: 'design-qa', duration: 36,
    beats: [
      { at: 0, title: 'The build is on test', body: 'Ritesh shares a test build of “Change your trip”. On Sana’s iPhone it matches Figma. She almost signs it off.' },
      { at: 6, title: 'An ordinary phone', body: 'She tests on a Redmi 12, the kind most Gaadi riders own, with text at 130%, TalkBack once through, and a slow 4G connection.' },
      { at: 11, title: 'Overlay the design', body: 'Figma at 50% over a screenshot. The bus rows are 12 px apart, not 16. Confirm is a hard-coded hex. A long operator name is cut short.' },
      { at: 16, title: 'What actually breaks', body: 'A double tap on Confirm charges ₹100. TalkBack can’t reach the bus list. “3 seats left” is 2.5:1. The fare says ₹180 but charges ₹212.' },
      { at: 21, title: 'Block, fix, let go', body: 'Broken tasks, wrong money and access failures block the release. Drift gets fixed this sprint. A pixel and a font’s rendering are let go.' },
      { at: 26, title: 'Tickets that stand alone', body: 'Each ticket: where, expected, actual, device. Ritesh fixes all four blockers in a day without a single question.' },
      { at: 31, title: 'Ship it', body: 'Sana re-tests on the same Redmi. No blockers open: it ships, and the three drift fixes follow next sprint.' },
    ],
  },
  check: [
    { id: 'c1', prompt: 'Why test on the Redmi with large text?', options: [{ id: 'a', label: 'It’s cheaper' }, { id: 'b', label: 'It’s closer to what riders use, and it exposes problems the designer’s own phone hides' }, { id: 'c', label: 'iPhones can’t run test builds' }],
      correct: 'b', explanation: 'QA on the designer’s phone checks the designer’s experience.' },
    { id: 'c2', prompt: 'Why let the 1 px handle difference go?', options: [{ id: 'a', label: 'Sana was tired' }, { id: 'b', label: 'It changes nothing for anyone, and noise buries the findings that matter' }, { id: 'c', label: 'Ritesh would be annoyed' }],
      correct: 'b', explanation: 'A QA list is useful in proportion to how much of it matters.' },
  ],
  game: {
    id: 'qa-pass', title: 'Run the QA pass',
    instructions: 'Each card is a difference Sana found between the design and the build. Decide: it blocks the release, it’s fixed this sprint, or you let it go. Each right call files the ticket, and the release gate updates.',
    lanes: [
      { id: 'blocker', label: 'Blocks release', hint: 'Breaks a task, the money, or access' },
      { id: 'fix', label: 'Fix this sprint', hint: 'Works, but drifts from the spec' },
      { id: 'pass', label: 'Let it go', hint: 'Within tolerance; nobody is affected' },
    ],
    cards: [
      { id: 'g1', label: finding('gap'), lane: lane('gap'), visual: 'gap', note: 'Nothing breaks, but it’s off the spacing scale, and drift adds up screen by screen. Fix it this sprint.' },
      { id: 'g2', label: finding('double'), lane: lane('double'), visual: 'double', note: 'Charging a rider twice is the worst kind of bug. Confirm must disable on the first tap until the change comes back.' },
      { id: 'g3', label: finding('handle'), lane: lane('handle'), visual: 'handle', note: 'One pixel, well within tolerance. Filing it would bury the real findings.' },
      { id: 'g4', label: finding('focus'), lane: lane('focus'), visual: 'focus', note: 'A blind rider can’t change their trip at all. That blocks the release like any broken task.' },
      { id: 'g5', label: finding('hex'), lane: lane('hex'), visual: 'hex', note: 'It looks right today, but it won’t follow the next token change, or dark mode. Swap in the token.' },
      { id: 'g6', label: finding('weight'), lane: lane('weight'), visual: 'weight', note: 'That’s how Android renders the font. Same weight, same token; nothing to fix.' },
      { id: 'g7', label: finding('seats'), lane: lane('seats'), visual: 'seats', note: 'Below 4.5:1 is an accessibility failure, and it’s the line that tells people to hurry. Use the tertiary text token.' },
      { id: 'g8', label: finding('wrap'), lane: lane('wrap'), visual: 'wrap', note: 'The spec said two lines. People can still tell buses apart by time and price, so it waits for the sprint, not the release.' },
      { id: 'g9', label: finding('gst'), lane: lane('gst'), visual: 'gst', note: 'A price that changes at payment breaks trust and probably the law on price display. Show GST in the sheet’s number.' },
      { id: 'g10', label: finding('shadow'), lane: lane('shadow'), visual: 'shadow', note: 'Android draws elevation its own way. Matching the Figma blur exactly isn’t worth anyone’s time.' },
    ],
  },
  gap: {
    id: 'gap', from: 11, at: 15.6,
    prompt: 'The overlay found drift. What else should Sana check before writing tickets?',
    options: [{ id: 'a', label: 'Nothing, the overlay found it all' }, { id: 'b', label: 'Run the real tasks end to end, with TalkBack and large text, and check the money' }, { id: 'c', label: 'Ask the PM to check it' }],
    correct: 'b', explanation: 'Overlays catch what looks wrong. Only doing the task catches what is wrong.',
  },
  takeaways: [
    { title: 'Test where your users are', body: 'An ordinary Android, large text, a screen reader once through, slow data.' },
    { title: 'Look, then do', body: 'Overlay the design for drift; run the real task for breakage.' },
    { title: 'Block, fix, let go', body: 'Broken tasks, money and access block. Drift is fixed soon. Noise is dropped.' },
    { title: 'Tickets that stand alone', body: 'Where, expected, actual, device. No “feels off”.' },
  ],
  quiz: {
    seconds: 12,
    questions: [
      { id: 'q1', prompt: 'A button that charges twice on a double tap…', options: [{ id: 'a', label: 'Can wait a sprint' }, { id: 'b', label: 'Blocks the release' }], correct: 'b', explanation: 'Money and broken tasks always block.' },
      { id: 'q2', prompt: 'Text at 2.5:1 contrast on white is…', options: [{ id: 'a', label: 'An accessibility failure that blocks' }, { id: 'b', label: 'Fine for small print' }, { id: 'c', label: 'A matter of taste' }], correct: 'a', explanation: 'Body text needs 4.5:1.' },
      { id: 'q3', prompt: 'A hard-coded hex that looks right is…', options: [{ id: 'a', label: 'Fine forever' }, { id: 'b', label: 'A blocker' }, { id: 'c', label: 'Drift to fix soon: it won’t follow token changes' }], correct: 'c', explanation: 'It works today and breaks on the next change.' },
      { id: 'q4', prompt: 'A good QA ticket includes…', options: [{ id: 'a', label: 'Where, expected, actual and the device' }, { id: 'b', label: '“Doesn’t match Figma”' }, { id: 'c', label: 'Only a screenshot' }, { id: 'd', label: 'The designer’s mood' }], correct: 'a', explanation: 'Anyone can reproduce it and check the fix.' },
    ],
  },
  ladder: [
    { id: 'l1', prompt: 'When should design QA happen?', hint: 'Before whom?', options: [{ id: 'a', label: 'After launch, from reviews' }, { id: 'b', label: 'On a test build, before release, with time left to fix blockers' }, { id: 'c', label: 'Only for redesigns' }, { id: 'd', label: 'Never: that’s QA’s job' }], correct: 'b', explanation: 'Build it into the sprint, not after it.' },
    { id: 'l2', prompt: 'Why overlay the Figma frame on a screenshot?', hint: 'What does the eye miss?', options: [{ id: 'a', label: 'It looks impressive' }, { id: 'b', label: 'Small spacing and alignment drift is invisible side by side but obvious overlaid' }, { id: 'c', label: 'To get pixel-perfect everywhere' }, { id: 'd', label: 'It replaces testing' }], correct: 'b', explanation: 'A tool for finding drift, not for demanding perfection.' },
    { id: 'l3', prompt: 'Ritesh says the 12 px gap was on purpose: 16 px pushed Confirm off a small screen. What now?', hint: 'The build taught you something.', options: [{ id: 'a', label: 'Insist on 16 px' }, { id: 'b', label: 'Check it on that screen; if he’s right, change the design and the spec, and solve the small screen properly' }, { id: 'c', label: 'Ignore it' }, { id: 'd', label: 'Escalate to his manager' }], correct: 'b', explanation: 'QA is a conversation. Sometimes the design is what needs fixing.' },
    { id: 'l4', prompt: 'You find 40 issues. What do you send?', hint: 'What gets fixed?', options: [{ id: 'a', label: 'All 40 in one list, unsorted' }, { id: 'b', label: 'Nothing, it’s too many' }, { id: 'c', label: 'Blockers first as separate tickets, drift grouped by component, noise dropped' }, { id: 'd', label: 'Only the ones that annoy you' }], correct: 'c', explanation: 'Sorted and grouped, a long list becomes a plan.' },
    { id: 'l5', prompt: 'The same drift turns up in three features. What’s the real fix?', hint: 'Upstream.', options: [{ id: 'a', label: 'Three more tickets' }, { id: 'b', label: 'Fix it in the shared component or token, and add the check to code review' }, { id: 'c', label: 'Accept it' }, { id: 'd', label: 'Redesign all three' }], correct: 'b', explanation: 'Repeated drift means the system, not the feature, needs the fix.' },
  ],
};

export const dc2_3: Episode = {
  lessonId: 'dc.2-3',
  hook: 'White on Gaadi’s green was 3.3:1. Sana fixed it with one line, and three buttons still failed.',
  scene: {
    id: 'token-pipeline', duration: 36,
    beats: [
      { at: 0, title: 'A failing green', body: 'White text on green-600 is 3.3:1. Every Confirm, Book and Pay button in Gaadi fails WCAG’s 4.5:1.' },
      { at: 6, title: 'One line at the source', body: 'In Figma variables, Sana repoints color.action.primary from green-600 to green-700: 5.0:1. Export: one line changes in tokens.json.' },
      { at: 11, title: 'One file, three platforms', body: 'Style Dictionary builds it: var(--color-action-primary) for the web, actionPrimary in Kotlin for Android and in Swift for iOS.' },
      { at: 16, title: 'The release goes out', body: 'Every button that uses the token turns green-700, on all three platforms, with nobody touching a screen.' },
      { at: 21, title: 'Six lines stay green-600', body: 'The fare banner and Pay buttons have the hex copied in. The selected seat points at the green-600 primitive. None of them got the fix.' },
      { at: 26, title: 'A lint in review', body: 'Ritesh adds a token lint: no hex codes and no primitives in component code. It flags six lines across the three codebases.' },
      { at: 31, title: 'Next time, one line', body: 'Six lines move to tokens. The next change, the dark theme, will reach every button from tokens.json.' },
    ],
  },
  check: [
    { id: 'c1', prompt: 'Why did the fare banner button not get the fix?', options: [{ id: 'a', label: 'The build failed' }, { id: 'b', label: 'Its colour was a hex copied into the code, so no token change can reach it' }, { id: 'c', label: 'It was cached' }],
      correct: 'b', explanation: 'A copied value is a dead end for every future change.' },
    { id: 'c2', prompt: 'What does Style Dictionary do?', options: [{ id: 'a', label: 'Picks colours' }, { id: 'b', label: 'Turns one token file into each platform’s code, named the way each platform expects' }, { id: 'c', label: 'Checks spelling' }],
      correct: 'b', explanation: 'One source, many outputs.' },
  ],
  game: {
    id: 'token-trace', title: 'Trace the fix',
    instructions: 'Sana repointed color.action.primary to green-700. Each card is a line of code that paints something green. Does it follow the token, point at the palette directly, or have the value copied in? Each call shows what that button looks like after the release.',
    lanes: [
      { id: 'follows', label: 'Follows the token', hint: 'Gets the fix' },
      { id: 'primitive', label: 'Points at the palette', hint: 'Skips the role, misses the fix' },
      { id: 'literal', label: 'Value copied in', hint: 'Nothing can reach it' },
    ],
    cards: [
      { id: 'g1', label: code('webBtn'), lane: ref('webBtn'), visual: 'webBtn', note: 'The semantic token, by its CSS name. The build changed what it points at.' },
      { id: 'g2', label: code('webHex'), lane: ref('webHex'), visual: 'webHex', note: 'Someone copied the hex from a spec. It stays 3.3:1 until a person finds it.' },
      { id: 'g3', label: code('androidSeat'), lane: ref('androidSeat'), visual: 'androidSeat', note: 'Green-600 is still green-600; only the role moved. If seats share the action colour’s job, they need a semantic token too.' },
      { id: 'g4', label: code('android'), lane: ref('android'), visual: 'android', note: 'Same token, Kotlin name. Android got the fix in the same release.' },
      { id: 'g5', label: code('iosRgb'), lane: ref('iosRgb'), visual: 'iosRgb', note: 'The same green as numbers from 0 to 1. Harder to spot than a hex, which is why a lint beats a search.' },
      { id: 'g6', label: code('webComp'), lane: ref('webComp'), visual: 'webComp', note: 'A component token that aliases color.action.primary. It follows the chain, so it got the fix.' },
      { id: 'g7', label: code('iosSeat'), lane: ref('iosSeat'), visual: 'iosSeat', note: 'A primitive in Swift. It compiles, it looks right today, and it ignores every role change.' },
      { id: 'g8', label: code('ios'), lane: ref('ios'), visual: 'ios', note: 'The Swift name for the same token, generated by the build.' },
      { id: 'g9', label: code('androidHex'), lane: ref('androidHex'), visual: 'androidHex', note: '0xFF plus the hex: a copied value in Compose. The Pay button still fails contrast.' },
      { id: 'g10', label: code('webSeat'), lane: ref('webSeat'), visual: 'webSeat', note: 'A CSS variable, but the primitive one. Being a variable isn’t enough; it has to be the right tier.' },
    ],
  },
  gap: {
    id: 'gap', from: 16, at: 20.6,
    prompt: 'The release went out. How does Sana find buttons that didn’t get the fix?',
    options: [{ id: 'a', label: 'Wait for complaints' }, { id: 'b', label: 'Ask engineering for a lint that flags hex codes and primitives in component code' }, { id: 'c', label: 'Check every screen by eye once a year' }],
    correct: 'b', explanation: 'A lint finds every copied value now, and stops new ones in review.',
  },
  takeaways: [
    { title: 'One source', body: 'Tokens live in one file, exported from Figma variables.' },
    { title: 'Built per platform', body: 'A build tool names them for CSS, Kotlin and Swift.' },
    { title: 'Code must use them', body: 'Semantic or component tokens only; no hex codes, no primitives.' },
    { title: 'Lint it', body: 'Catch copied values in review, before they ship.' },
  ],
  quiz: {
    seconds: 12,
    questions: [
      { id: 'q1', prompt: 'background: #16A34A; will get a token change…', options: [{ id: 'a', label: 'Never' }, { id: 'b', label: 'At the next release' }], correct: 'a', explanation: 'It isn’t connected to anything.' },
      { id: 'q2', prompt: 'On the web, color.action.primary becomes…', options: [{ id: 'a', label: 'actionPrimary' }, { id: 'b', label: 'var(--color-action-primary)' }, { id: 'c', label: '#15803D' }], correct: 'b', explanation: 'A CSS variable in kebab case.' },
      { id: 'q3', prompt: 'Why should components avoid primitive tokens?', options: [{ id: 'a', label: 'They’re slower' }, { id: 'b', label: 'They’re deprecated' }, { id: 'c', label: 'They skip the role, so role changes and dark mode miss them' }], correct: 'c', explanation: 'Components ask for a job, not a value.' },
      { id: 'q4', prompt: 'A token lint in code review…', options: [{ id: 'a', label: 'Picks the colours' }, { id: 'b', label: 'Replaces designers' }, { id: 'c', label: 'Slows everyone down' }, { id: 'd', label: 'Flags hard-coded values and primitives before they ship' }], correct: 'd', explanation: 'It keeps the system connected.' },
    ],
  },
  ladder: [
    { id: 'l1', prompt: 'Where should a token change start?', hint: 'One source of truth.', options: [{ id: 'a', label: 'In each codebase separately' }, { id: 'b', label: 'In the token source, Figma variables exported to tokens.json, reviewed like code' }, { id: 'c', label: 'In a Slack message' }, { id: 'd', label: 'In the spec' }], correct: 'b', explanation: 'Change it once; the build carries it.' },
    { id: 'l2', prompt: 'Why review tokens.json changes in a pull request?', hint: 'What could go wrong?', options: [{ id: 'a', label: 'It’s bureaucracy' }, { id: 'b', label: 'A token change touches every screen; review and a visual diff catch surprises before release' }, { id: 'c', label: 'Git requires it' }, { id: 'd', label: 'It doesn’t matter' }], correct: 'b', explanation: 'Small diff, big reach.' },
    { id: 'l3', prompt: 'Email templates can’t use CSS variables. What should they do?', hint: 'Still one source.', options: [{ id: 'a', label: 'Hard-code hex by hand' }, { id: 'b', label: 'Skip branding' }, { id: 'c', label: 'Use a build output that writes the resolved values in at build time' }, { id: 'd', label: 'Use images of buttons' }], correct: 'c', explanation: 'The value is copied by the build, not a person, so it updates.' },
    { id: 'l4', prompt: 'Android and web disagree on what a token should be called. What decides?', hint: 'Who names it?', options: [{ id: 'a', label: 'Whoever ships first' }, { id: 'b', label: 'One name in the source, and the build’s naming rule per platform' }, { id: 'c', label: 'Each team picks' }, { id: 'd', label: 'The designer, per screen' }], correct: 'b', explanation: 'The source names the token; transforms handle each platform’s conventions.' },
    { id: 'l5', prompt: 'The selected seat and the action button both used green-600. After the fix, should the seat change too?', hint: 'Same colour or same job?', options: [{ id: 'a', label: 'Yes, always match' }, { id: 'b', label: 'Never' }, { id: 'c', label: 'Only on iOS' }, { id: 'd', label: 'Decide its job: if it needs white text at 4.5:1 too, give it a semantic token of its own' }], correct: 'd', explanation: 'Tokens name jobs. Two things that share a colour don’t always share a job.' },
  ],
};
