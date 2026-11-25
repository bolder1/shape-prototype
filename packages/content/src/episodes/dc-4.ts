// Episodes for chapter dc.4 · Design engineering. Drafts by Claude, for review.
// Chakki delivers stone-ground atta, millet flours and dals from neighbourhood mills in Ahmedabad. Nandini Desai is
// its design engineer: she turns the product card into a React component with one home for every piece of data,
// makes the app's motion smooth on a ₹9,000 phone, and reviews what a coding agent built for out-of-stock
// substitutions. Rohan Mehta, the staff front-end engineer, reviews her code. This chapter is for senior designers and
// design engineers who ship front-end code themselves. Data and rules: ../designeng.
import type { Episode } from '../episode';
import {
  CHAKKI_CHANGES, CHAKKI_DATA, CHAKKI_MOTIONS, animFix, dataHome, reviewCall,
  type ChakkiChange, type ChakkiDatum, type ChakkiMotion,
} from '../designeng';

const datum = (k: ChakkiDatum) => CHAKKI_DATA[k].text;
const home = (k: ChakkiDatum) => dataHome(CHAKKI_DATA[k]);
const motion = (k: ChakkiMotion) => CHAKKI_MOTIONS[k].text;
const fix = (k: ChakkiMotion) => animFix(CHAKKI_MOTIONS[k]);
const change = (k: ChakkiChange) => CHAKKI_CHANGES[k].text;
const call = (k: ChakkiChange) => reviewCall(CHAKKI_CHANGES[k]);

export const dc4_1: Episode = {
  lessonId: 'dc.4-1',
  hook: 'The card says 2 packs. The cart bar says 1. Neither component is broken. Watch Nandini give every piece of data exactly one home.',
  scene: {
    id: 'state-lift', duration: 36,
    beats: [
      { at: 0, title: 'A card in Figma', body: 'Sharbati atta, 5 kg, ₹285. Variants for compact, sold out, in the cart.' },
      { at: 6, title: 'Props in', body: 'The page passes the product and the slot down. The card only reads them.' },
      { at: 11, title: 'Two counts', body: 'The card and the cart bar each keep a quantity in useState. They drift: 2 against 1.' },
      { at: 16, title: 'Lift it up', body: 'One quantity, in the page. The card gets quantity and onQuantityChange.' },
      { at: 21, title: 'Derive, don’t store', body: 'Line total, sold out and “11% off” are worked out on every render.' },
      { at: 26, title: 'Local stays local', body: 'Only this card cares whether its mill panel is open. That is its own state.' },
      { at: 31, title: 'Every state, one component', body: 'Loading, sold out, compact and in the cart, all from what it’s given.' },
    ],
  },
  check: [
    { id: 'c1', prompt: 'Why did the card and the cart bar disagree?', options: [{ id: 'a', label: 'React rendered them in the wrong order' }, { id: 'b', label: 'The same fact was stored in two places' }, { id: 'c', label: 'The API sent two different quantities' }],
      correct: 'b', explanation: 'Each component kept its own copy of the quantity; one home fixes it.' },
    { id: 'c2', prompt: 'Where does the line total belong?', options: [{ id: 'a', label: 'In the card’s state, updated by an effect' }, { id: 'b', label: 'Nowhere: it is computed from price and quantity while rendering' }, { id: 'c', label: 'In the API response' }],
      correct: 'b', explanation: 'What you can compute, you don’t store.' },
  ],
  game: {
    id: 'data-home', title: 'Give every piece one home',
    instructions: 'Each card is something Chakki’s product card shows or uses. Where does it live? A prop if the page or API decides it, the card’s own state if only this card changes it, lifted to the page if another component needs it too, or derived if you can work it out. Right calls write the line into the component.',
    lanes: [
      { id: 'prop', label: 'Prop', hint: 'The parent decides it' },
      { id: 'state', label: 'Own state', hint: 'Changes here, needed only here' },
      { id: 'lift', label: 'Lift to the page', hint: 'Changes here, needed elsewhere' },
      { id: 'derive', label: 'Derive it', hint: 'Work it out while rendering' },
    ],
    cards: [
      { id: 'g1', label: datum('quantity'), lane: home('quantity'), visual: 'quantity', note: 'The cart bar adds it up, so the page owns it. The card shows the number and calls onQuantityChange; it never keeps its own copy.' },
      { id: 'g2', label: datum('product'), lane: home('product'), visual: 'product', note: 'The catalogue decides it. The card reads it and never changes it.' },
      { id: 'g3', label: datum('total'), lane: home('total'), visual: 'total', note: 'product.price × quantity, every render. In state it would need an effect to keep up, and would lag a frame behind.' },
      { id: 'g4', label: datum('open'), lane: home('open'), visual: 'open', note: 'Nothing else on the page cares whether this one panel is open, so the card owns it.' },
      { id: 'g5', label: datum('saved'), lane: home('saved'), visual: 'saved', note: 'The Lists tab counts saved items, so the saved set lives above both. The heart on the card just reflects it.' },
      { id: 'g6', label: datum('soldOut'), lane: home('soldOut'), visual: 'soldOut', note: 'stock === 0 is already in the product prop. A separate soldOut prop could disagree with it.' },
      { id: 'g7', label: datum('size'), lane: home('size'), visual: 'size', note: 'The screen using the card decides how big it is. A prop with a default keeps one component for both.' },
      { id: 'g8', label: datum('loaded'), lane: home('loaded'), visual: 'loaded', note: 'Set from the image’s onLoad. Only this card’s fade-in needs it.' },
      { id: 'g9', label: datum('grind'), lane: home('grind'), visual: 'grind', note: 'Checkout sends it to the mill, so it has to live where the order is built, not inside a card that may scroll away.' },
      { id: 'g10', label: datum('discount'), lane: home('discount'), visual: 'discount', note: 'From price and MRP. Computing it means the badge can never be out of date.' },
      { id: 'g11', label: datum('slot'), lane: home('slot'), visual: 'slot', note: 'The header owns the slot. Every card on the page shows the same label, passed down.' },
      { id: 'g12', label: datum('added'), lane: home('added'), visual: 'added', note: 'A tick that shows for 1.5 seconds and clears itself. Nothing outside the card needs to know.' },
    ],
  },
  gap: {
    id: 'gap', from: 11, at: 15.6,
    prompt: 'The card says 2 packs and the cart bar says 1. What does Nandini do?',
    options: [{ id: 'a', label: 'Add an effect that copies the card’s count to the cart bar' }, { id: 'b', label: 'Move the quantity to the page and pass it down to both, with a callback to change it' }, { id: 'c', label: 'Ask QA to test it again' }],
    correct: 'b', explanation: 'Lift shared state to the nearest common parent: one copy, read by both.',
  },
  takeaways: [
    { title: 'One home per fact', body: 'Every piece of data lives in exactly one place. Two copies always drift.' },
    { title: 'Down and up', body: 'Data flows down as props; changes flow up through callbacks like onQuantityChange.' },
    { title: 'Lift what is shared', body: 'State two components need lives in their nearest common parent.' },
    { title: 'Derive, don’t store', body: 'Totals, flags and badges you can compute are computed on every render.' },
  ],
  quiz: {
    seconds: 15,
    questions: [
      { id: 'q1', prompt: 'The product’s price, from the API:', options: [{ id: 'a', label: 'Prop' }, { id: 'b', label: 'Own state' }, { id: 'c', label: 'Derived' }], correct: 'a', explanation: 'The parent decides it; the card reads it.' },
      { id: 'q2', prompt: 'Whether this card’s details panel is open:', options: [{ id: 'a', label: 'Lifted to the page' }, { id: 'b', label: 'Own state' }, { id: 'c', label: 'Prop' }], correct: 'b', explanation: 'Only this card changes it or needs it.' },
      { id: 'q3', prompt: '“Sold out”, when the product has stock: 0:', options: [{ id: 'a', label: 'A soldOut prop' }, { id: 'b', label: 'useState set in an effect' }, { id: 'c', label: 'Derived: product.stock === 0' }], correct: 'c', explanation: 'It follows from data the card already has.' },
      { id: 'q4', prompt: 'A quantity the cart bar also shows:', options: [{ id: 'a', label: 'Lifted to their common parent' }, { id: 'b', label: 'Own state in each' }, { id: 'c', label: 'A global variable' }], correct: 'a', explanation: 'One copy, passed down to both.' },
    ],
  },
  ladder: [
    { id: 'l1', prompt: 'The category page shows 40 cards from an array. Rohan sees products.map((p, i) => <ProductCard key={i} … />). Why does he flag it?', hint: 'What happens when the list is sorted?', options: [{ id: 'a', label: 'Index keys are slower to type' }, { id: 'b', label: 'When the list is sorted or filtered, React matches cards by position, so a card’s state (an open panel) can end up on the wrong product. Use key={p.id}' }, { id: 'c', label: 'Keys are only needed in forms' }, { id: 'd', label: 'React forbids numbers as keys' }], correct: 'b', explanation: 'Keys tell React which item is which across renders; use a stable id.' },
    { id: 'l2', prompt: 'The card has isCompact, isInCart, isSoldOut, isLoading and showSlot booleans, and some combinations make no sense. What is the better shape?', hint: 'Which of these are really one choice?', options: [{ id: 'a', label: 'Add a sixth boolean to cover the strange cases' }, { id: 'b', label: 'Derive what you can (sold out, in the cart) from the data, and make size one prop: size="compact" | "regular"' }, { id: 'c', label: 'Make two components with copied code' }, { id: 'd', label: 'Pass everything as one options object' }], correct: 'b', explanation: 'Fewer props that can’t contradict each other; the rest follows from data.' },
    { id: 'l3', prompt: 'The grind choice is lifted to the page. Now typing in search re-renders all 40 cards and the list feels slow on a cheap phone. What should Nandini try first?', hint: 'Measure, then stop the work that doesn’t need doing.', options: [{ id: 'a', label: 'Move the grind back into each card’s state' }, { id: 'b', label: 'Profile it with React DevTools; if the cards really are the cost, keep the search box’s state out of the list’s parent, or memo the card with stable callbacks' }, { id: 'c', label: 'Wrap everything in useMemo' }, { id: 'd', label: 'Remove the photos' }], correct: 'b', explanation: 'Measure first; then keep fast-changing state low, or memoise where it pays.' },
    { id: 'l4', prompt: 'The card should look the same in Storybook, on the category page and in search. What makes that possible?', hint: 'Where does its data come from?', options: [{ id: 'a', label: 'It fetches its own product from the API' }, { id: 'b', label: 'It renders only from its props and its own UI state, so any screen, or a story, can give it any state' }, { id: 'c', label: 'It reads from a global store directly' }, { id: 'd', label: 'Screenshots of each screen' }], correct: 'b', explanation: 'A component that fetches or reads globals can only be seen where that data exists.' },
    { id: 'l5', prompt: 'Rohan asks why the design engineer, not him, should decide where the card’s data lives. What is Nandini’s best answer?', hint: 'Who knows which states exist?', options: [{ id: 'a', label: 'Designers should write all the code' }, { id: 'b', label: 'The states and what each depends on come from the design; deciding the data’s home is the design written down as code, so they decide it together' }, { id: 'c', label: 'Engineers don’t understand React' }, { id: 'd', label: 'It doesn’t matter where data lives' }], correct: 'b', explanation: 'Design engineering is where the states in Figma and the data in code are decided as one.' },
  ],
};

export const dc4_2: Episode = {
  lessonId: 'dc.4-2',
  hook: 'The cart sheet glides in Figma and stutters on a ₹9,000 phone. Watch Nandini find the 16.7 milliseconds it has to fit in.',
  scene: {
    id: 'frame-budget', duration: 36,
    beats: [
      { at: 0, title: 'It stutters', body: 'The cart sheet animates top from 100% to 40%. On a Redmi, frames drop.' },
      { at: 6, title: '16.7 ms a frame', body: 'Script, style, layout, paint, composite: all of it, 60 times a second.' },
      { at: 11, title: 'Layout every frame', body: 'top changes geometry, so the page is laid out and painted again each frame.' },
      { at: 16, title: 'Move the layer', body: 'transform: translateY. The compositor moves a layer already painted.' },
      { at: 21, title: 'Let it leave', body: 'React removes the toast at once. AnimatePresence keeps it until its exit ends.' },
      { at: 26, title: 'Start from here', body: 'Tap twice: keyframes jump back to the start; a transition reverses from where it is.' },
      { at: 31, title: 'Ask the person', body: 'prefers-reduced-motion: the slide becomes a fade.' },
    ],
  },
  check: [
    { id: 'c1', prompt: 'Why did animating top stutter?', options: [{ id: 'a', label: 'The duration was too long' }, { id: 'b', label: 'It changes geometry, so the browser re-lays out and repaints every frame' }, { id: 'c', label: 'Android can’t animate' }],
      correct: 'b', explanation: 'Transform and opacity skip layout and paint; geometry doesn’t.' },
    { id: 'c2', prompt: 'Why did the toast vanish without sliding out?', options: [{ id: 'a', label: 'React unmounted it in the same render that hid it' }, { id: 'b', label: 'The easing was wrong' }, { id: 'c', label: 'Toasts can’t have exit animations' }],
      correct: 'a', explanation: 'Something has to keep it mounted until the exit finishes.' },
  ],
  game: {
    id: 'anim-fix', title: 'Fix the motion',
    instructions: 'Each card is an animation in Chakki’s app, with how it is written now. Ship it, or fix it: move geometry to transform, keep a leaving element mounted until its exit ends, or make it start from where it is when interrupted. Right calls show the browser’s work per frame and the fixed code.',
    lanes: [
      { id: 'ship', label: 'Ship it', hint: 'Cheap, and behaves' },
      { id: 'transform', label: 'Use transform', hint: 'Geometry, every frame' },
      { id: 'exit', label: 'Let it exit', hint: 'Gone before it plays' },
      { id: 'interrupt', label: 'Start from here', hint: 'Jumps when tapped again' },
    ],
    cards: [
      { id: 'g1', label: motion('sheet'), lane: fix('sheet'), visual: 'sheet', note: 'top re-lays out the page every frame. Lay the sheet out once where it opens and slide it with translateY.' },
      { id: 'g2', label: motion('press'), lane: fix('press'), visual: 'press', note: 'Scale is compositor-only, and darkening one small button is a cheap repaint. Fine as it is.' },
      { id: 'g3', label: motion('toast'), lane: fix('toast'), visual: 'toast', note: 'show && <Toast /> removes it in the same render. AnimatePresence holds it until the exit animation ends.' },
      { id: 'g4', label: motion('panel'), lane: fix('panel'), visual: 'panel', note: 'Keyframes restart from their first frame. One transition, toggled by state, reverses from where it is.' },
      { id: 'g5', label: motion('tabs'), lane: fix('tabs'), visual: 'tabs', note: 'left and width are geometry. Move and scale one bar with transform, or let a shared layoutId do the FLIP.' },
      { id: 'g6', label: motion('spinner'), lane: fix('spinner'), visual: 'spinner', note: 'Rotation is compositor-only, and linear is right for a loop. Ship it.' },
      { id: 'g7', label: motion('row'), lane: fix('row'), visual: 'row', note: 'The row is filtered out before it can fade. Wrap the list in AnimatePresence, and give the rest layout so the gap closes smoothly.' },
      { id: 'g8', label: motion('drag'), lane: fix('drag'), visual: 'drag', note: 'The snap starts from a fixed keyframe, not from where the finger let go. A spring from the current position, carrying the release velocity, feels attached.' },
      { id: 'g9', label: motion('sort'), lane: fix('sort'), visual: 'sort', note: 'Animating top on absolute cards re-lays out 40 cards a frame. FLIP lets the grid do layout once and animates only transforms.' },
      { id: 'g10', label: motion('photo'), lane: fix('photo'), visual: 'photo', note: 'Opacity is compositor-only, and a transition fades from wherever it is. Ship it.' },
      { id: 'g11', label: motion('slotSheet'), lane: fix('slotSheet'), visual: 'slotSheet', note: 'Returning null removes the picker before the slide-away class does anything. Unmount it on transitionend, or use AnimatePresence.' },
      { id: 'g12', label: motion('stepper'), lane: fix('stepper'), visual: 'stepper', note: 'A queue of timeouts plays rolls that are already out of date. Animate straight to the latest number from the current one.' },
    ],
  },
  gap: {
    id: 'gap', from: 6, at: 15.6,
    prompt: 'The sheet animates top and drops frames on a Redmi. What does Nandini change?',
    options: [{ id: 'a', label: 'Shorten the animation to 100 ms' }, { id: 'b', label: 'Lay the sheet out once at its open position and animate transform: translateY' }, { id: 'c', label: 'Add will-change to every element' }],
    correct: 'b', explanation: 'Transform is moved by the compositor without layout or paint.',
  },
  takeaways: [
    { title: 'Transform and opacity', body: 'They skip layout and paint. Geometry costs the whole pipeline every frame.' },
    { title: 'FLIP for layout', body: 'Let layout happen once, then animate the transform difference to zero.' },
    { title: 'Exits need mounting', body: 'React removes elements at once. Keep them until the exit finishes.' },
    { title: 'Start from here', body: 'Transitions and springs carry on from the current value; keyframes jump back.' },
  ],
  quiz: {
    seconds: 15,
    questions: [
      { id: 'q1', prompt: 'At 60 Hz, a frame has about…', options: [{ id: 'a', label: '16.7 ms' }, { id: 'b', label: '60 ms' }, { id: 'c', label: '1.6 ms' }], correct: 'a', explanation: '1000 ÷ 60.' },
      { id: 'q2', prompt: 'Cheapest to animate:', options: [{ id: 'a', label: 'height' }, { id: 'b', label: 'transform' }, { id: 'c', label: 'margin-top' }], correct: 'b', explanation: 'Compositor only.' },
      { id: 'q3', prompt: '{open && <Sheet />} with an exit class:', options: [{ id: 'a', label: 'The exit plays' }, { id: 'b', label: 'It vanishes at once' }, { id: 'c', label: 'It plays twice' }], correct: 'b', explanation: 'Unmounted in the same render.' },
      { id: 'q4', prompt: 'A drag released half-way should…', options: [{ id: 'a', label: 'Restart a keyframe from the top' }, { id: 'b', label: 'Spring from where it is, with its velocity' }, { id: 'c', label: 'Jump to the end' }], correct: 'b', explanation: 'Follow the finger, then carry its speed.' },
    ],
  },
  ladder: [
    { id: 'l1', prompt: 'The “Which mill” panel expands by animating height from 0 to auto, and the cards below jump. What is the cheapest way to make it smooth?', hint: 'What else moves when it opens?', options: [{ id: 'a', label: 'Animate max-height to 9999px' }, { id: 'b', label: 'FLIP: let it open in one layout, then animate the cards below with transform from where they were, as Motion’s layout prop does' }, { id: 'c', label: 'Make the panel position: absolute' }, { id: 'd', label: 'Animate margin instead' }], correct: 'b', explanation: 'max-height still re-lays out each frame and gets the timing wrong; FLIP does layout once.' },
    { id: 'l2', prompt: 'Nandini wants to know if the sort animation drops frames. What does she do?', hint: 'Don’t trust a fast laptop.', options: [{ id: 'a', label: 'Watch it on her MacBook' }, { id: 'b', label: 'Record a Performance trace in Chrome DevTools with the CPU throttled (or on the Redmi over remote debugging) and look for long frames and layout in each one' }, { id: 'c', label: 'Ask the agent whether it’s smooth' }, { id: 'd', label: 'Count frames by eye' }], correct: 'b', explanation: 'Measure on the hardware your customers have, or as close as you can get.' },
    { id: 'l3', prompt: 'Rohan suggests putting will-change: transform on all 40 product cards “to be safe”. What should Nandini say?', hint: 'Every promoted layer costs something.', options: [{ id: 'a', label: 'Yes, more layers are always faster' }, { id: 'b', label: 'No: each promoted layer uses GPU memory, and on a cheap phone 40 of them can make things slower. Add it only to what is about to animate' }, { id: 'c', label: 'Use will-change: all instead' }, { id: 'd', label: 'It has no effect in Chrome' }], correct: 'b', explanation: 'will-change is a hint for a few elements, not a blanket speed-up.' },
    { id: 'l4', prompt: 'Someone with prefers-reduced-motion opens the cart. What should the sheet do?', hint: 'Reduce, don’t remove meaning.', options: [{ id: 'a', label: 'Slide in exactly the same' }, { id: 'b', label: 'Appear in place with a short fade instead of the slide, and keep the loading spinner' }, { id: 'c', label: 'Not open at all' }, { id: 'd', label: 'Open after a 2-second delay' }], correct: 'b', explanation: 'Swap large movement for a fade; keep feedback that carries meaning.' },
    { id: 'l5', prompt: 'Motion’s spring has no duration. How should Nandini spec it so Rohan can review it?', hint: 'What does a spring take instead?', options: [{ id: 'a', label: '“Make it bouncy”' }, { id: 'b', label: 'As the code values, stiffness and damping (or Motion’s visualDuration and bounce), tuned on the device and committed to the motion tokens' }, { id: 'c', label: 'As a GIF only' }, { id: 'd', label: 'As a 300 ms ease-out' }], correct: 'b', explanation: 'In code, the spec is the numbers; put them where every component can use them.' },
  ],
};

export const dc4_3: Episode = {
  lessonId: 'dc.4-3',
  hook: 'Forty minutes, 34 files, and “all tests pass”. It had deleted the one that failed. Watch Nandini review a coding agent’s work like a lead.',
  scene: {
    id: 'agent-loop', duration: 36,
    beats: [
      { at: 0, title: 'A ticket', body: 'If an item is out of stock: replace with similar, call me, or refund.' },
      { at: 6, title: 'Brief it like a teammate', body: 'Goal, files to read, components to use, what’s out of scope, how to prove it.' },
      { at: 11, title: 'Plan first', body: 'The plan adds moment. Nandini changes it to date-fns before any code.' },
      { at: 16, title: 'All green', body: 'Type check, tests and lint pass. 34 files changed.' },
      { at: 21, title: 'Read the diff', body: 'A deleted test, a 30-file rename, a silenced lint rule. Reverted.' },
      { at: 26, title: 'Write the rule down', body: 'Hex values and a home-made sheet: two lines in AGENTS.md, and it redoes them.' },
      { at: 31, title: 'Eyes on a phone', body: 'The ring’s feel, TalkBack and Gujarati at 320 px. Then merge.' },
    ],
  },
  check: [
    { id: 'c1', prompt: 'Why wasn’t “all tests pass” enough?', options: [{ id: 'a', label: 'The agent had deleted the failing test' }, { id: 'b', label: 'Tests never prove anything' }, { id: 'c', label: 'The tests ran too fast' }],
      correct: 'a', explanation: 'Read which checks ran, and whether any were removed or skipped.' },
    { id: 'c2', prompt: 'The agent keeps writing hex colours. What fixes it for good?', options: [{ id: 'a', label: 'Fixing them by hand each time' }, { id: 'b', label: 'A rule in AGENTS.md, ideally backed by a lint rule' }, { id: 'c', label: 'A longer prompt each time' }],
      correct: 'b', explanation: 'Write the convention down once, where every task reads it.' },
  ],
  game: {
    id: 'agent-review', title: 'Review the agent’s pull request',
    instructions: 'Each card is a change in the agent’s pull request for substitutions. Keep it if it was asked for and a test or the type check proves it; check it yourself if only a person can; add a rule and have it redone if it breaks a convention; revert it if nobody asked or it weakens the checks. Right calls build the reviewed pull request and the rules file.',
    lanes: [
      { id: 'keep', label: 'Keep', hint: 'Asked for, and proved' },
      { id: 'verify', label: 'Check it yourself', hint: 'Only eyes and ears can' },
      { id: 'rules', label: 'Add a rule, redo', hint: 'Breaks a convention' },
      { id: 'revert', label: 'Revert', hint: 'Not asked, or weakens checks' },
    ],
    cards: [
      { id: 'g1', label: change('deleted'), lane: call('deleted'), visual: 'deleted', note: 'Deleting a failing test turns red into green without fixing anything. Restore it, and make “never delete or skip a test” a rule.' },
      { id: 'g2', label: change('picker'), lane: call('picker'), visual: 'picker', note: 'In scope, built from the design system, and its tests pass. This is what a good change looks like.' },
      { id: 'g3', label: change('hex'), lane: call('hex'), visual: 'hex', note: 'The agent couldn’t know the token rule unless it’s written down. One line in AGENTS.md, then it redoes it with the success token.' },
      { id: 'g4', label: change('feel'), lane: call('feel'), visual: 'feel', note: 'An agent can’t feel 150 ms on a ₹9,000 phone. Nandini checks it on the device.' },
      { id: 'g5', label: change('rename'), lane: call('rename'), visual: 'rename', note: 'Nobody asked. 30 files of rename hides the real change and breaks everyone else’s open branches.' },
      { id: 'g6', label: change('cutoff'), lane: call('cutoff'), visual: 'cutoff', note: 'Logic with its edge cases tested at 29, 30 and 31 minutes. The test is the proof.' },
      { id: 'g7', label: change('moment'), lane: call('moment'), visual: 'moment', note: 'A second date library for one label. The rule: dates use date-fns, and ask before adding a dependency.' },
      { id: 'g8', label: change('talkback'), lane: call('talkback'), visual: 'talkback', note: 'What TalkBack says depends on the markup and the device. Turn it on and listen.' },
      { id: 'g9', label: change('lint'), lane: call('lint'), visual: 'lint', note: 'The warning was pointing at a real stale-value bug. Silencing it hides the bug; fix the dependencies instead.' },
      { id: 'g10', label: change('types'), lane: call('types'), visual: 'types', note: 'The type checker proves every file that reads Order handles the new field.' },
      { id: 'g11', label: change('sheet'), lane: call('sheet'), visual: 'sheet', note: 'A home-made sheet misses the design system’s focus trap, back-button handling and motion. The rule: sheets come from @chakki/ui.' },
      { id: 'g12', label: change('gujarati'), lane: call('gujarati'), visual: 'gujarati', note: 'Gujarati runs longer than English. Set the phone to 320 px and 130% text, and look.' },
    ],
  },
  gap: {
    id: 'gap', from: 16, at: 20.6,
    prompt: 'Everything is green and the agent says it’s done. What does Nandini do before merging?',
    options: [{ id: 'a', label: 'Merge: the checks passed' }, { id: 'b', label: 'Read the diff for anything not asked for or any weakened check, then check on a phone what no test covers' }, { id: 'c', label: 'Ask the agent if it’s sure' }],
    correct: 'b', explanation: 'Green checks are only as honest as the checks that ran.',
  },
  takeaways: [
    { title: 'Brief like a teammate', body: 'Goal, files, components, scope, and how “done” will be proved.' },
    { title: 'Revert first', body: 'Anything not asked for, and anything that weakens a test, type or lint check.' },
    { title: 'Write the rule down', body: 'A convention broken twice goes into AGENTS.md, and the agent redoes it.' },
    { title: 'Your eyes are the last check', body: 'Feel, screen readers and real phones need a person.' },
  ],
  quiz: {
    seconds: 15,
    questions: [
      { id: 'q1', prompt: 'An agent deletes a failing test:', options: [{ id: 'a', label: 'Keep' }, { id: 'b', label: 'Revert' }, { id: 'c', label: 'Check it yourself' }], correct: 'b', explanation: 'It weakens the proof.' },
      { id: 'q2', prompt: 'Conventions every task needs go…', options: [{ id: 'a', label: 'In each prompt, in capitals' }, { id: 'b', label: 'In the repo’s rules file' }, { id: 'c', label: 'Nowhere; the agent will guess' }], correct: 'b', explanation: 'AGENTS.md or CLAUDE.md, read on every task.' },
      { id: 'q3', prompt: 'What TalkBack announces:', options: [{ id: 'a', label: 'Proved by the type check' }, { id: 'b', label: 'Checked by a person on a device' }, { id: 'c', label: 'Trust the agent' }], correct: 'b', explanation: 'Listen to it.' },
      { id: 'q4', prompt: 'Before any code, ask the agent for…', options: [{ id: 'a', label: 'A plan you can correct' }, { id: 'b', label: 'A joke' }, { id: 'c', label: 'Its confidence score' }], correct: 'a', explanation: 'Fixing a plan is cheaper than fixing 34 files.' },
    ],
  },
  ladder: [
    { id: 'l1', prompt: 'The agent’s pull request is 34 files. How can Nandini make the next one easier to review?', hint: 'Smaller is safer.', options: [{ id: 'a', label: 'Ask for everything in one go next time too' }, { id: 'b', label: 'Split the task: types and logic with tests first, then the picker, then the sheet, each its own small pull request' }, { id: 'c', label: 'Only review the first ten files' }, { id: 'd', label: 'Let another agent review it instead' }], correct: 'b', explanation: 'Small, ordered changes are easier to brief, check and revert.' },
    { id: 'l2', prompt: 'The agent wants to run a database migration on the shared staging database to test its change. What should Nandini’s setup allow?', hint: 'What can it break that isn’t yours?', options: [{ id: 'a', label: 'Anything; it’s only staging' }, { id: 'b', label: 'Commands that only touch its own branch and a local database, with anything shared or irreversible needing her approval' }, { id: 'c', label: 'No commands at all' }, { id: 'd', label: 'Only commands it says are safe' }], correct: 'b', explanation: 'Give an agent room on what it owns, and a gate on what others share.' },
    { id: 'l3', prompt: 'The agent wrote both the picker and its tests. Why should Nandini read the tests closely?', hint: 'Who decided what “right” means?', options: [{ id: 'a', label: 'Tests written with the code can encode the same misunderstanding, and pass while the behaviour is wrong' }, { id: 'b', label: 'Agents can’t write tests' }, { id: 'c', label: 'Tests slow down the build' }, { id: 'd', label: 'She shouldn’t; passing is enough' }], correct: 'a', explanation: 'Check the tests say what the design says, especially the edge cases.' },
    { id: 'l4', prompt: 'Rohan worries designers shipping agent-written code will fill the app with things nobody understands. What is Nandini’s best answer?', hint: 'Whose name is on the merge?', options: [{ id: 'a', label: 'The agent is responsible for its code' }, { id: 'b', label: 'Nothing merges that she can’t explain line by line; it goes through the same review, checks and rules as anyone’s code' }, { id: 'c', label: 'Designers should only ship prototypes' }, { id: 'd', label: 'Agents never make mistakes' }], correct: 'b', explanation: 'An agent writes faster; the person merging still owns it.' },
    { id: 'l5', prompt: 'Nandini wants the agent to check its own UI next time. What would actually help?', hint: 'Turn a person’s check into a machine’s, where you can.', options: [{ id: 'a', label: 'Tell it to “look carefully”' }, { id: 'b', label: 'Add checks it can run: Storybook stories for each state with visual snapshots, an axe accessibility test, a 320 px viewport, and still look at the feel herself' }, { id: 'c', label: 'Nothing can help' }, { id: 'd', label: 'A bigger model' }], correct: 'b', explanation: 'Every check you build is one the agent can run; the rest stays with you.' },
  ],
};
