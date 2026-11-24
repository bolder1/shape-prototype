// Episodes for chapter pr.2 · Motion principles. Drafts by Claude, for review.
// Dabba, the Bengaluru lunch-subscription app (₹99 tiffins, planned a week at a time), is adding motion to its new build.
// Neha is its designer and Farhan its front-end developer. Kiran, a student, plans her week's lunches on it, and
// Shobha, a Jayanagar school teacher with vestibular migraine, has Reduce motion turned on. pr.1 covered prototyping;
// this chapter is about how things move: the curve, the timing, the reason, and what changes when motion hurts.
import type { Episode } from '../episode';

export const pr2_1: Episode = {
  lessonId: 'pr.2-1',
  hook: 'Dabba’s meal sheet moves at one speed and stops dead, like a lift with no brakes. Watch four curves give every motion the right start and the right stop.',
  scene: {
    id: 'ease-curves', duration: 34,
    beats: [
      { at: 0, title: 'The sheet that slams', body: 'Kiran taps Tuesday’s rajma chawal and the meal sheet rises at one steady speed, then stops dead. Linear: every frame moves the same distance.' },
      { at: 5, title: 'Slow to answer', body: 'Farhan tries ease-in. Now the sheet dawdles for the first frames, as if the tap didn’t register, then slams into place at full speed.' },
      { at: 10, title: 'Fast start, soft landing', body: 'Ease-out starts at full speed, so the tap is answered at once, and slows as it arrives. Things entering the screen decelerate, like a car pulling up.' },
      { at: 15, title: 'The curve is a graph', body: 'Time runs along, progress runs up. cubic-bezier(0.16, 1, 0.3, 1) is steep at the start and flat at the end. The dots are frames: far apart is fast.' },
      { at: 20, title: 'Leaving: speed up and go', body: 'When Kiran taps Done, the sheet accelerates away: ease-in. Leaving slowly at the end would make people wait for something they’ve finished with.' },
      { at: 25, title: 'Moving across: both', body: 'Swap Tuesday’s meal to Wednesday and the card speeds up, then slows into its new slot. It starts and ends on screen, so it eases in and out.' },
      { at: 29, title: 'Linear for loops and fingers', body: 'A spinner never starts or stops, and a sheet you drag follows your thumb exactly. Those are linear. Everything else gets a curve.' },
    ],
  },
  check: [
    { id: 'c1', prompt: 'Why did the ease-in sheet feel broken?', options: [{ id: 'a', label: 'It moved too far' }, { id: 'b', label: 'It started slowly, so the tap seemed ignored, then hit the end at full speed' }, { id: 'c', label: 'Ease-in is only for web' }],
      correct: 'b', explanation: 'An entrance should answer the tap at once and settle gently. Ease-in does the opposite.' },
    { id: 'c2', prompt: 'On the graph, what do dots far apart mean?', options: [{ id: 'a', label: 'The motion is fast there' }, { id: 'b', label: 'The motion is slow there' }, { id: 'c', label: 'Dropped frames' }],
      correct: 'a', explanation: 'Each dot is one frame. More distance between frames is more speed.' },
  ],
  game: {
    id: 'ease-tune', title: 'Pick the curve',
    instructions: 'Each card is a moment in Dabba. Pick the easing curve it needs. The motion plays on your curve, and if it’s wrong, the right one plays beside it.',
    lanes: [
      { id: 'out', label: 'Ease out', hint: 'Fast start, gentle stop: arriving' },
      { id: 'in', label: 'Ease in', hint: 'Gentle start, fast exit: leaving' },
      { id: 'inout', label: 'Ease in-out', hint: 'Speeds up, slows down: moving across' },
      { id: 'linear', label: 'Linear', hint: 'One speed: loops and fingers' },
    ],
    cards: [
      { id: 'g1', label: 'The meal sheet rises when Kiran taps Tuesday’s rajma chawal', lane: 'out', visual: 'off>on', note: 'It arrives, so it decelerates. The fast first frames answer the tap; the slow last ones let the eye catch it.' },
      { id: 'g2', label: 'The “Added to Tuesday” toast appears at the bottom', lane: 'out', visual: 'off>on', note: 'Another arrival. Ease-out makes it feel quick without a jolt at the end.' },
      { id: 'g3', label: 'The meal sheet closes when Kiran taps Done', lane: 'in', visual: 'on>off', note: 'Leaving: start gently, then get out of the way. A slow ending would hold up a screen she’s finished with.' },
      { id: 'g4', label: 'A skipped day’s card slides off the week list', lane: 'in', visual: 'on>off', note: 'It accelerates away, like something being thrown out. Keep exits shorter than entrances too.' },
      { id: 'g5', label: 'Rajma chawal moves from Tuesday to Wednesday when Kiran swaps days', lane: 'inout', visual: 'on>on', note: 'It starts and ends on screen, so it speeds up out of Tuesday and slows into Wednesday. Ease-out alone would launch it with a jerk.' },
      { id: 'g6', label: 'The tab indicator slides from Menu to Orders', lane: 'inout', visual: 'on>on', note: 'Same shape: a move between two places on screen. Ease in-out reads as one smooth trip.' },
      { id: 'g7', label: 'The spinner while the UPI app confirms ₹99', lane: 'linear', visual: 'loop', note: 'A loop never starts or stops, so it keeps one speed. An eased spinner would lurch every turn.' },
      { id: 'g8', label: 'The sheet follows Kiran’s thumb as she drags it down', lane: 'linear', visual: 'finger', note: 'While a finger drives it, it moves exactly with the finger. The curve takes over only when she lets go.' },
    ],
  },
  gap: {
    id: 'gap', from: 5, at: 9.6,
    prompt: 'The ease-in sheet seems to ignore the tap, then slams into place. What should Farhan try?',
    options: [{ id: 'a', label: 'Make it slower so the slam is softer' }, { id: 'b', label: 'Ease out: start at full speed and slow down as it arrives' }, { id: 'c', label: 'Remove the animation' }],
    correct: 'b', explanation: 'Entrances decelerate. Ease-out responds at once and lands gently.',
  },
  takeaways: [
    { title: 'Arriving: ease out', body: 'Fast start, soft landing. The tap is answered at once.' },
    { title: 'Leaving: ease in', body: 'Start gently and accelerate away, so nobody waits on a screen they’ve finished with.' },
    { title: 'Moving across: ease in-out', body: 'Speed up from where it was, slow into where it goes.' },
    { title: 'Linear is for loops and fingers', body: 'Spinners and anything a finger drives keep one speed. Nothing else should.' },
  ],
  quiz: {
    seconds: 12,
    questions: [
      { id: 'q1', prompt: 'A dialog appearing should use…', options: [{ id: 'a', label: 'Ease out' }, { id: 'b', label: 'Ease in' }], correct: 'a', explanation: 'It’s arriving.' },
      { id: 'q2', prompt: 'A spinner should rotate with…', options: [{ id: 'a', label: 'Ease in-out' }, { id: 'b', label: 'Ease out' }, { id: 'c', label: 'Linear' }], correct: 'c', explanation: 'A loop keeps one speed.' },
      { id: 'q3', prompt: 'A card moving from one slot to another uses…', options: [{ id: 'a', label: 'Linear' }, { id: 'b', label: 'Ease in-out' }, { id: 'c', label: 'Ease in' }, { id: 'd', label: 'No curve' }], correct: 'b', explanation: 'It starts and ends on screen.' },
      { id: 'q4', prompt: 'A snackbar leaving the screen uses…', options: [{ id: 'a', label: 'Ease out' }, { id: 'b', label: 'Linear' }, { id: 'c', label: 'Ease in-out' }, { id: 'd', label: 'Ease in' }], correct: 'd', explanation: 'It’s leaving: accelerate away.' },
    ],
  },
  ladder: [
    { id: 'l1', prompt: 'Why does linear motion look mechanical?', hint: 'How do real things start and stop?', options: [{ id: 'a', label: 'Nothing physical starts at full speed and stops instantly; linear does both' }, { id: 'b', label: 'Screens can’t draw it smoothly' }, { id: 'c', label: 'It is too fast' }, { id: 'd', label: 'It uses more battery' }], correct: 'a', explanation: 'Objects with mass speed up and slow down. A curve borrows that, so motion reads as natural.' },
    { id: 'l2', prompt: 'In cubic-bezier(0.16, 1, 0.3, 1), what do the four numbers set?', hint: 'Two points.', options: [{ id: 'a', label: 'Duration, delay, distance and speed' }, { id: 'b', label: 'The x and y of two control handles that bend the curve between (0, 0) and (1, 1)' }, { id: 'c', label: 'The start and end colours' }, { id: 'd', label: 'Frames per second' }], correct: 'b', explanation: 'Time is x, progress is y. The handles pull the curve: here the first one makes it steep at the start.' },
    { id: 'l3', prompt: 'Kiran flicks the sheet down fast and lets go. What should happen next?', hint: 'Her finger had speed.', options: [{ id: 'a', label: 'It stops, then plays a fresh ease-in from zero' }, { id: 'b', label: 'It jumps closed' }, { id: 'c', label: 'It carries on at her finger’s speed and finishes from there, which a spring does well' }, { id: 'd', label: 'It bounces back up' }], correct: 'c', explanation: 'Motion should continue from the speed it already has. Springs take a starting velocity; fixed curves start from rest.' },
    { id: 'l4', prompt: 'Why might a product pick a spring over a cubic-bezier for its sheets?', hint: 'Interruptions.', options: [{ id: 'a', label: 'Springs are always faster' }, { id: 'b', label: 'If the sheet is reversed halfway, a spring turns around smoothly from its current speed' }, { id: 'c', label: 'Browsers don’t support cubic-bezier' }, { id: 'd', label: 'Springs need no duration, so they never end' }], correct: 'b', explanation: 'A curve restarted mid-flight jerks. A spring keeps its momentum, which is why iOS and Motion use springs for gestures.' },
    { id: 'l5', prompt: 'Neha wants one easing for the whole app. What’s the better system?', hint: 'Think tokens.', options: [{ id: 'a', label: 'Linear everywhere, for consistency' }, { id: 'b', label: 'A few named motion tokens, like ease-enter, ease-exit and ease-move, used by every component' }, { id: 'c', label: 'Each developer picks per screen' }, { id: 'd', label: 'Copy whatever a competitor uses' }], correct: 'b', explanation: 'Named curves, like colour tokens, keep the whole product moving with one personality.' },
  ],
};

export const pr2_2: Episode = {
  lessonId: 'pr.2-2',
  hook: 'Everything on Dabba’s week screen takes 600 ms and arrives at once. It feels slow and nobody knows where to look. Watch durations shrink to fit and one thing lead the rest.',
  scene: {
    id: 'motion-timing', duration: 34,
    beats: [
      { at: 0, title: 'Everything at 600 ms', body: 'The week screen opens. The header, five meal cards and the Pay button all fade and slide in together, each for 600 ms. It feels sluggish, and the eye has nowhere to start.' },
      { at: 6, title: 'Small and near is quick', body: 'A button press answers in under 100 ms. A tick or a tooltip takes about 150. Bigger things travel further, so they get longer: a sheet about 300 ms, a full page up to 500.' },
      { at: 12, title: 'Leave faster than you arrive', body: 'The meal sheet comes in over 300 ms and goes in 200. People have already decided; don’t make them watch it go.' },
      { at: 17, title: 'One thing leads', body: 'The header comes first, then the meal cards one after another, 40 ms apart, top to bottom, then the Pay button. The eye follows the order.' },
      { at: 23, title: 'Cap the stagger', body: 'Twenty cards at 40 ms each is 760 ms before the last one moves. Stagger the first few, bring the rest in together, and keep it all under about half a second.' },
      { at: 28, title: 'Faster than it was', body: 'The screen is fully in at 380 ms instead of 600, and it feels faster still, because something moves at once and the order tells the eye where to go.' },
    ],
  },
  check: [
    { id: 'c1', prompt: 'Why should a press answer faster than a sheet opens?', options: [{ id: 'a', label: 'Buttons are less important' }, { id: 'b', label: 'Small, near changes need little time; bigger moves cover more distance' }, { id: 'c', label: 'Sheets are slower to draw' }],
      correct: 'b', explanation: 'Duration scales with size and distance. A press is tiny and must feel instant.' },
    { id: 'c2', prompt: 'What did staggering the cards fix?', options: [{ id: 'a', label: 'It made the screen load data faster' }, { id: 'b', label: 'It gave the eye an order to follow, from the header down' }, { id: 'c', label: 'Nothing, it’s decoration' }],
      correct: 'b', explanation: 'Choreography leads attention. Everything at once is noise.' },
  ],
  game: {
    id: 'duration-tune', title: 'Tune the timing',
    instructions: 'Each card is a transition from Dabba’s first build, set to the duration it shipped with. Drag the slider to the time it should take, play it, then lock it in.',
    lanes: [
      { id: 'instant', label: 'Instant', hint: 'Up to 100 ms: presses and toggles' },
      { id: 'quick', label: 'Quick', hint: '100–200 ms: small things, and exits' },
      { id: 'standard', label: 'Standard', hint: '200–400 ms: sheets, cards, lists' },
      { id: 'long', label: 'Long', hint: '400–600 ms: the whole screen changes' },
    ],
    cards: [
      { id: 'g1', label: 'The Add button darkens when pressed', lane: 'instant', visual: '300|press', note: 'A press is feedback, not a show. Past about 100 ms people feel the gap and tap again.' },
      { id: 'g2', label: 'The tick on a chosen meal', lane: 'instant', visual: '500|check', note: 'A small mark on the spot Kiran just tapped. It should simply be there, in 100 ms or less.' },
      { id: 'g3', label: 'The “Veg · 520 kcal” tooltip on a long press', lane: 'quick', visual: '400|tooltip', note: 'Small, and it barely travels. Around 150 ms: long enough to see it arrive, short enough not to wait.' },
      { id: 'g4', label: 'The “Added to Tuesday” toast', lane: 'quick', visual: '40|toast', note: 'Too fast is wrong too: at 40 ms it blinks in and nobody sees where it came from. About 200 ms.' },
      { id: 'g5', label: 'The meal sheet closing after Done', lane: 'quick', visual: '600|sheet-out', note: 'It opened in 300 ms; it leaves in about 200. Exits are shorter, because Kiran has already moved on.' },
      { id: 'g6', label: 'The meal sheet rising', lane: 'standard', visual: '700|sheet', note: 'It covers half the screen, so it gets more time than a toast: about 300 ms with ease-out.' },
      { id: 'g7', label: 'The week’s five meal cards coming in', lane: 'standard', visual: '1200|menu', note: 'The header leads, then five cards 40 ms apart, each moving for 180 ms: all in by 380 ms. In the first build each card waited for the one before to finish.' },
      { id: 'g8', label: 'The plans page sliding in over the menu', lane: 'long', visual: '900|page', note: 'The whole screen changes, so the eye needs a little longer to follow: about 450 ms. 900 felt like the app was thinking.' },
      { id: 'g9', label: 'The order-placed screen growing out of the Pay button', lane: 'long', visual: '1500|page', note: 'The longest motion in the app, and still only about half a second. A celebration that holds people up stops being one.' },
    ],
  },
  gap: {
    id: 'gap', from: 12, at: 16.6,
    prompt: 'The header, five cards and the button all arrive together. How should Neha order them?',
    options: [{ id: 'a', label: 'Header first, then the cards one after another from the top, then the Pay button' }, { id: 'b', label: 'All together, but slower' }, { id: 'c', label: 'The button first, then everything else at random' }],
    correct: 'a', explanation: 'Choreography follows reading order and importance, so the eye has a path.',
  },
  takeaways: [
    { title: 'Size sets the time', body: 'Presses under 100 ms, small things 100–200, sheets and cards 200–400, full screens up to about 500.' },
    { title: 'Exits are shorter', body: 'Leave faster than you arrive; people have already decided.' },
    { title: 'One thing leads', body: 'Stagger in reading order, about 30–50 ms apart, so the eye knows where to go.' },
    { title: 'Cap the total', body: 'Long lists stagger a few items and bring the rest together. The whole screen should settle in about half a second.' },
  ],
  quiz: {
    seconds: 12,
    questions: [
      { id: 'q1', prompt: 'A button press should show within about…', options: [{ id: 'a', label: '100 ms' }, { id: 'b', label: '500 ms' }], correct: 'a', explanation: 'Anything slower feels like lag.' },
      { id: 'q2', prompt: 'A bottom sheet opening usually takes…', options: [{ id: 'a', label: '50 ms' }, { id: 'b', label: 'About 300 ms' }, { id: 'c', label: '1 second' }], correct: 'b', explanation: 'It covers a lot of the screen.' },
      { id: 'q3', prompt: 'Compared with entering, exiting should be…', options: [{ id: 'a', label: 'Longer' }, { id: 'b', label: 'The same' }, { id: 'c', label: 'Shorter' }, { id: 'd', label: 'Skipped' }], correct: 'c', explanation: 'People have moved on.' },
      { id: 'q4', prompt: 'A good stagger between list items is about…', options: [{ id: 'a', label: '300 ms' }, { id: 'b', label: '1 ms' }, { id: 'c', label: '200 ms' }, { id: 'd', label: '30–50 ms' }], correct: 'd', explanation: 'Enough to read an order, not enough to wait.' },
    ],
  },
  ladder: [
    { id: 'l1', prompt: 'Why does a 600 ms page transition feel slower on the tenth visit than the first?', hint: 'Who has seen it before?', options: [{ id: 'a', label: 'Phones slow down over time' }, { id: 'b', label: 'The first time it explains something; by the tenth, it only makes people wait' }, { id: 'c', label: 'It doesn’t' }, { id: 'd', label: 'The cache is full' }], correct: 'b', explanation: 'Frequent motion should be the shortest. Save longer motion for rare moments.' },
    { id: 'l2', prompt: 'On a tablet, the same sheet travels twice as far. Its duration should…', hint: 'Distance.', options: [{ id: 'a', label: 'Stay exactly the same' }, { id: 'b', label: 'Double' }, { id: 'c', label: 'Grow a little, so it doesn’t look rushed, but not double' }, { id: 'd', label: 'Halve' }], correct: 'c', explanation: 'Longer distance gets a bit more time, but people don’t want to wait twice as long on a bigger screen.' },
    { id: 'l3', prompt: 'Farhan staggers 20 menu cards at 40 ms each. What’s the problem?', hint: 'Do the sum.', options: [{ id: 'a', label: 'The last card starts 760 ms after the first, so the screen feels slow to settle' }, { id: 'b', label: '40 ms is too short to see' }, { id: 'c', label: 'Staggering is only for desktop' }, { id: 'd', label: 'There is no problem' }], correct: 'a', explanation: '19 × 40 = 760 ms. Stagger the first few visible cards and bring the rest in together.' },
    { id: 'l4', prompt: 'Where should a stagger start when Kiran taps a day halfway down the list?', hint: 'Where is her eye?', options: [{ id: 'a', label: 'Always at the top' }, { id: 'b', label: 'From the day she tapped, spreading outwards' }, { id: 'c', label: 'From the bottom' }, { id: 'd', label: 'In random order' }], correct: 'b', explanation: 'Motion should start where attention already is and lead away from it.' },
    { id: 'l5', prompt: 'How should Dabba keep durations consistent across a dozen screens?', hint: 'ds.2.', options: [{ id: 'a', label: 'A wiki page of advice' }, { id: 'b', label: 'Duration tokens, like duration-quick and duration-standard, alongside the easing tokens' }, { id: 'c', label: 'Each team times its own' }, { id: 'd', label: 'Make everything 300 ms' }], correct: 'b', explanation: 'Named durations and curves, used by every component, make timing a decision made once.' },
  ],
};

export const pr2_3: Episode = {
  lessonId: 'pr.2-3',
  hook: 'In Dabba’s first build the logo spins, every card bounces, and Kiran still can’t tell whether her rajma chawal made it into the cart. Watch motion stop decorating and start explaining.',
  scene: {
    id: 'motion-meaning', duration: 34,
    beats: [
      { at: 0, title: 'Everything bounces', body: 'The logo spins, the cards bounce, roti and chilli icons float past. Kiran taps Add on Tuesday’s rajma chawal and can’t tell if anything happened.' },
      { at: 6, title: 'Where did it go?', body: 'Now the meal’s photo shrinks and flies along an arc into the cart tab, and the badge ticks from 2 to 3. She saw it go in.' },
      { at: 12, title: 'Where am I?', body: 'Opening a meal pushes the menu off to the left, and its photo grows from the card into the top of the page. Back slides it all the other way. Deeper is right, back is left.' },
      { at: 18, title: 'Did it work?', body: 'A wrong UPI PIN shakes the field once, the way a head shakes no. A right one draws a tick. The motion says what changed.' },
      { at: 24, title: 'Look here', body: 'Friday’s empty slot pulses once: “Pick Friday’s lunch by 9 pm.” One thing moves, so it’s the thing she notices.' },
      { at: 29, title: 'Every motion has a job', body: 'Show where something went or came from, show that something changed, or point at the one thing that matters. A motion with no job gets cut.' },
    ],
  },
  check: [
    { id: 'c1', prompt: 'Why couldn’t Kiran tell her meal was added?', options: [{ id: 'a', label: 'The Add button was too small' }, { id: 'b', label: 'Everything was moving, so the one change that mattered didn’t stand out' }, { id: 'c', label: 'There was no animation' }],
      correct: 'b', explanation: 'When everything moves, motion stops meaning anything.' },
    { id: 'c2', prompt: 'What does the menu sliding left tell her?', options: [{ id: 'a', label: 'That she went one level deeper, and Back will slide it the other way' }, { id: 'b', label: 'That the app is loading' }, { id: 'c', label: 'Nothing, it just looks nice' }],
      correct: 'a', explanation: 'Direction carries the map of the app: deeper one way, back the other.' },
  ],
  game: {
    id: 'motion-purpose', title: 'What is it for?',
    instructions: 'Each card is a motion from Dabba. Watch it, then say what job it does. If it does none, cut it.',
    lanes: [
      { id: 'where', label: 'Where it went', hint: 'Shows where something came from or went' },
      { id: 'state', label: 'What changed', hint: 'Shows that something happened, or is happening' },
      { id: 'focus', label: 'Look here', hint: 'Points at the one thing that needs attention' },
      { id: 'none', label: 'No job: cut it', hint: 'Decoration that competes with the rest' },
    ],
    cards: [
      { id: 'g1', label: 'Rajma chawal’s photo shrinks and flies into the cart tab', lane: 'where', visual: 'fly-to-cart', note: 'It shows where the meal went, so Kiran knows where to find it again. Pair it with the badge ticking up.' },
      { id: 'g2', label: 'Opening a meal pushes the menu off to the left', lane: 'where', visual: 'push-deeper', note: 'Direction is the map: deeper slides in from the right, Back slides out to the right. Keep it consistent everywhere.' },
      { id: 'g3', label: 'The meal photo grows from its card into the top of the detail page', lane: 'where', visual: 'expand-card', note: 'The same photo, kept on screen, says “this page is that card, opened up”. No need to find your place again.' },
      { id: 'g4', label: 'The UPI PIN field shakes once when the PIN is wrong', lane: 'state', visual: 'shake', note: 'One short shake reads as “no”, like a head. Always add the words, “Wrong PIN, 2 tries left”: motion alone isn’t enough.' },
      { id: 'g5', label: 'A tick draws itself when the order is placed', lane: 'state', visual: 'check-draw', note: 'It confirms the thing she was waiting for. A tick drawing in for 300 ms says “done” better than a static one.' },
      { id: 'g6', label: 'Grey placeholder cards shimmer while the menu loads', lane: 'state', visual: 'skeleton', note: 'The shimmer says “still loading” and shows the shape of what’s coming, so the wait feels shorter.' },
      { id: 'g7', label: 'The cart badge counts up from 2 to 3', lane: 'state', visual: 'count-up', note: 'A number that changes in place draws the eye to the change itself. Small, quick, and it means something.' },
      { id: 'g8', label: 'Friday’s empty slot pulses once: “Pick by 9 pm”', lane: 'focus', visual: 'pulse-once', note: 'Once, not forever. A single pulse on the one thing that needs doing is the strongest pointer a screen has.' },
      { id: 'g9', label: 'The Dabba logo spins every time the app opens', lane: 'none', visual: 'logo-spin', note: 'It tells Kiran nothing, and on the twentieth open it’s just a delay. Cut it, or play it once on the very first launch.' },
      { id: 'g10', label: 'Every card on the menu bounces when the screen loads', lane: 'none', visual: 'bounce-all', note: 'When everything moves, nothing stands out, which is exactly why Kiran missed her meal going into the cart.' },
      { id: 'g11', label: 'Roti and chilli icons float across the background', lane: 'none', visual: 'float-icons', note: 'Constant background motion pulls the eye away from the menu, and for some people it causes real dizziness. Cut it.' },
    ],
  },
  gap: {
    id: 'gap', from: 0, at: 5.6,
    prompt: 'Everything bounces and Kiran can’t tell whether her meal was added. What should Neha do first?',
    options: [{ id: 'a', label: 'Make the Add button bounce harder' }, { id: 'b', label: 'Cut the decoration and give the one change that matters its own motion: the meal flying into the cart' }, { id: 'c', label: 'Add a sound to every bounce' }],
    correct: 'b', explanation: 'Motion only means something when it’s rare. Remove the noise, then animate the change.',
  },
  takeaways: [
    { title: 'Where it went', body: 'Motion keeps things continuous: what flew to the cart, which card became the page.' },
    { title: 'What changed', body: 'A shake for no, a tick for done, a shimmer for loading, a number that counts up.' },
    { title: 'Look here', body: 'One pulse, once, on the one thing that needs doing.' },
    { title: 'No job, no motion', body: 'Decoration competes with the motion that means something. Cut it, or play it once.' },
  ],
  quiz: {
    seconds: 12,
    questions: [
      { id: 'q1', prompt: 'A logo that spins on every launch is…', options: [{ id: 'a', label: 'Decoration' }, { id: 'b', label: 'Feedback' }], correct: 'a', explanation: 'It says nothing.' },
      { id: 'q2', prompt: 'An item flying into the cart shows…', options: [{ id: 'a', label: 'Loading' }, { id: 'b', label: 'An error' }, { id: 'c', label: 'Where it went' }], correct: 'c', explanation: 'Spatial continuity.' },
      { id: 'q3', prompt: 'A field that shakes once means…', options: [{ id: 'a', label: 'It’s loading' }, { id: 'b', label: 'Something was wrong' }, { id: 'c', label: 'Look here' }, { id: 'd', label: 'Nothing' }], correct: 'b', explanation: 'Like a head shaking no.' },
      { id: 'q4', prompt: 'To draw attention to one slot, pulse it…', options: [{ id: 'a', label: 'Forever' }, { id: 'b', label: 'With every other slot' }, { id: 'c', label: 'Every 2 seconds' }, { id: 'd', label: 'Once' }], correct: 'd', explanation: 'Constant motion becomes noise.' },
    ],
  },
  ladder: [
    { id: 'l1', prompt: 'Opening a meal slides in from the right. Which way should Back go?', hint: 'Keep the map.', options: [{ id: 'a', label: 'Also in from the right' }, { id: 'b', label: 'The reverse: the page slides out to the right and the menu returns from the left' }, { id: 'c', label: 'Up' }, { id: 'd', label: 'A fade, always' }], correct: 'b', explanation: 'Reversing the motion tells people they went back the way they came.' },
    { id: 'l2', prompt: 'The PIN field shakes on a wrong PIN. What must go with it?', hint: 'Not everyone sees motion.', options: [{ id: 'a', label: 'A louder shake' }, { id: 'b', label: 'Words saying what’s wrong and what to do, announced to screen readers' }, { id: 'c', label: 'Nothing else' }, { id: 'd', label: 'A second shake' }], correct: 'b', explanation: 'Motion supports the message; it can’t be the only carrier of it.' },
    { id: 'l3', prompt: 'Which motion needs the shortest duration?', hint: 'How often does it play?', options: [{ id: 'a', label: 'The order-placed celebration' }, { id: 'b', label: 'The first-launch welcome' }, { id: 'c', label: 'The cart badge counting up, which plays every time she adds a meal' }, { id: 'd', label: 'The plans page transition' }], correct: 'c', explanation: 'The more often a motion plays, the quicker and quieter it should be.' },
    { id: 'l4', prompt: 'Neha wants a little delight. Where does it belong?', hint: 'Rare and earned.', options: [{ id: 'a', label: 'On every card' }, { id: 'b', label: 'On rare moments that matter, like the first order, kept short and skippable' }, { id: 'c', label: 'In the background of every screen' }, { id: 'd', label: 'On the loading spinner' }], correct: 'b', explanation: 'Delight works when it marks a moment. Everywhere, it’s noise. The next chapter, Micro-interactions, goes further.' },
    { id: 'l5', prompt: 'How can Neha test whether a motion carries meaning?', hint: 'Take it away.', options: [{ id: 'a', label: 'Ask if people like it' }, { id: 'b', label: 'Turn it off and see whether people still understand what happened; if nothing is lost, it was decoration' }, { id: 'c', label: 'Make it longer' }, { id: 'd', label: 'Count the frames' }], correct: 'b', explanation: 'If removing a motion costs no understanding, it had no job.' },
  ],
};

export const pr2_4: Episode = {
  lessonId: 'pr.2-4',
  hook: 'Shobha has Reduce motion turned on, and Dabba ignores it: the photo drifts, the offers slide by themselves, every page zooms. She closes the app feeling sick. Watch it calm down without losing a thing.',
  scene: {
    id: 'reduced-motion', duration: 36,
    beats: [
      { at: 0, title: 'Shobha turns on Reduce motion', body: 'She has vestibular migraine: large moving things on a screen can make her dizzy for hours. In Settings, under Accessibility, she switches Reduce motion on.' },
      { at: 6, title: 'Dabba ignores it', body: 'The lunch photo drifts as she scrolls, the offers slide by themselves every three seconds, and each meal zooms open. Two minutes in, she closes the app.' },
      { at: 12, title: 'The setting is a signal', body: 'Phones and browsers pass her choice on: prefers-reduced-motion in CSS, useReducedMotion in React. Dabba only had to listen.' },
      { at: 17, title: 'Swap travel for a fade', body: 'Pages that slid across now cross-fade. The meal that zoomed open fades in. The meal flying to the cart becomes the badge changing to 3 with a brief highlight.' },
      { at: 22, title: 'Stop what plays by itself', body: 'The offers stop sliding on their own; arrows and dots let her move them. The drifting photo holds still. The confetti is gone.' },
      { at: 27, title: 'Keep what tells her something', body: 'The press, the “Added to Tuesday” toast and the payment spinner stay. They are small and they carry meaning. Reduce motion, don’t remove it.' },
      { at: 31, title: 'Same app, calmer', body: 'Every message still arrives. Nothing large moves unless she moves it. Shobha plans her week in four minutes.' },
    ],
  },
  check: [
    { id: 'c1', prompt: 'What made Dabba hard for Shobha?', options: [{ id: 'a', label: 'The text was too small' }, { id: 'b', label: 'Large motion she didn’t start: parallax, an autoplaying carousel, zooming pages' }, { id: 'c', label: 'The colours were too bright' }],
      correct: 'b', explanation: 'Big, unexpected movement is what triggers vestibular symptoms.' },
    { id: 'c2', prompt: 'What happened to the meal sliding across to the cart?', options: [{ id: 'a', label: 'It was removed with nothing in its place' }, { id: 'b', label: 'It became the badge changing with a brief highlight, so the meaning stayed' }, { id: 'c', label: 'It plays more slowly' }],
      correct: 'b', explanation: 'The message stays; only the travel goes.' },
  ],
  game: {
    id: 'motion-audit', title: 'Calm the home screen',
    instructions: 'Shobha has Reduce motion on. Each card rings one moving part of Dabba’s home screen. Decide what it becomes: stopped, swapped for a fade, or kept as it is. The phone redraws as you go.',
    lanes: [
      { id: 'stop', label: 'Stop it', hint: 'Plays by itself, or moves a lot and means nothing' },
      { id: 'fade', label: 'Swap for a fade', hint: 'Moves a lot, but tells her something' },
      { id: 'keep', label: 'Keep it', hint: 'Small, and it carries meaning' },
    ],
    cards: [
      { id: 'g1', label: 'The lunch photo at the top drifts slower than the page as she scrolls', lane: 'stop', visual: 'hero', note: 'Parallax is one of the worst triggers: two layers moving at different speeds. It means nothing, so it simply holds still.' },
      { id: 'g2', label: 'The offers carousel slides to the next offer every three seconds', lane: 'stop', visual: 'offers', note: 'Motion she didn’t start. It stops, and arrows and dots let her move it herself. Anything moving by itself for more than five seconds needs a pause anyway (WCAG 2.2.2).' },
      { id: 'g3', label: 'Confetti bursts across the screen after an order', lane: 'stop', visual: 'confetti', note: 'Big, spinning and decorative. The tick and “Order placed” say it all; the confetti goes.' },
      { id: 'g4', label: 'The plans page slides across from the right', lane: 'fade', visual: 'page', note: 'A whole screen travelling is a lot of movement. A short cross-fade still shows the page changing.' },
      { id: 'g5', label: 'A meal zooms open from its card', lane: 'fade', visual: 'sheet', note: 'Zooming is movement in depth, a strong trigger. Fade the page in where it opens; the meaning, “this is that meal”, comes from the photo.' },
      { id: 'g6', label: 'The meal flies along an arc into the cart tab', lane: 'fade', visual: 'fly', note: 'The flight shows where it went. Without it, the badge changing to 3 with a brief highlight says the same thing without the travel.' },
      { id: 'g7', label: 'The Add button darkens when pressed', lane: 'keep', visual: 'press', note: 'A colour change, no movement at all. Removing it would leave her wondering whether the tap worked.' },
      { id: 'g8', label: 'The spinner while the UPI app confirms ₹99', lane: 'keep', visual: 'spinner', note: 'It turns in place and it’s the only sign the payment is still going. Keep it, ideally with words: “Waiting for your UPI app…”.' },
      { id: 'g9', label: 'The “Added to Tuesday” toast fades up a few pixels', lane: 'keep', visual: 'toast', note: 'Eight pixels and a fade. Small motion like this is fine; reduced motion isn’t no motion.' },
      { id: 'g10', label: 'The cart badge ticks from 2 to 3', lane: 'keep', visual: 'badge', note: 'A number changing in place. It is now the main sign her meal went in, so it stays.' },
    ],
  },
  gap: {
    id: 'gap', from: 12, at: 16.6,
    prompt: 'Dabba now knows Shobha wants less motion. What should Farhan do with every animation?',
    options: [{ id: 'a', label: 'Turn every animation off, including the spinner and the press' }, { id: 'b', label: 'Replace large travel and zoom with fades, stop what plays by itself, and keep small changes that carry meaning' }, { id: 'c', label: 'Make everything slower' }],
    correct: 'b', explanation: 'Reduced motion is about removing the movement that hurts, not the information motion carries.',
  },
  takeaways: [
    { title: 'Listen for the setting', body: 'prefers-reduced-motion in CSS, useReducedMotion in React. People turn it on for real reasons.' },
    { title: 'Swap travel for a fade', body: 'Large slides, zooms and flights become cross-fades or instant changes that keep their meaning.' },
    { title: 'Stop what plays by itself', body: 'Parallax, autoplay and decoration stop. Give people controls instead.' },
    { title: 'Reduce, don’t remove', body: 'Presses, spinners and small fades stay. Every message must still arrive.' },
  ],
  quiz: {
    seconds: 12,
    questions: [
      { id: 'q1', prompt: 'With Reduce motion on, a page slide should become…', options: [{ id: 'a', label: 'A cross-fade' }, { id: 'b', label: 'A slower slide' }], correct: 'a', explanation: 'The change stays, the travel goes.' },
      { id: 'q2', prompt: 'An autoplaying carousel should…', options: [{ id: 'a', label: 'Play faster' }, { id: 'b', label: 'Stop, with controls to move it' }, { id: 'c', label: 'Stay as it is' }], correct: 'b', explanation: 'Motion she didn’t start.' },
      { id: 'q3', prompt: 'A loading spinner should…', options: [{ id: 'a', label: 'Disappear' }, { id: 'b', label: 'Zoom' }, { id: 'c', label: 'Stay, as the only sign of progress' }, { id: 'd', label: 'Bounce' }], correct: 'c', explanation: 'It carries status.' },
      { id: 'q4', prompt: 'The CSS media query for this setting is…', options: [{ id: 'a', label: 'prefers-color-scheme' }, { id: 'b', label: 'prefers-contrast' }, { id: 'c', label: 'motion-safe-only' }, { id: 'd', label: 'prefers-reduced-motion' }], correct: 'd', explanation: '@media (prefers-reduced-motion: reduce).' },
    ],
  },
  ladder: [
    { id: 'l1', prompt: 'Which motion is most likely to trigger vestibular symptoms?', hint: 'Big, and not hers.', options: [{ id: 'a', label: 'A button changing colour' }, { id: 'b', label: 'A background moving at a different speed from the page as she scrolls' }, { id: 'c', label: 'A toast fading in' }, { id: 'd', label: 'A tick appearing' }], correct: 'b', explanation: 'Parallax and large motion she doesn’t control are the classic triggers.' },
    { id: 'l2', prompt: 'WCAG 2.2.2 (Pause, Stop, Hide) says content that moves by itself for more than five seconds needs…', hint: 'Who is in control?', options: [{ id: 'a', label: 'A way to pause, stop or hide it' }, { id: 'b', label: 'A slower speed' }, { id: 'c', label: 'A sound' }, { id: 'd', label: 'Nothing, if it’s pretty' }], correct: 'a', explanation: 'It applies to everyone, not only people with Reduce motion on.' },
    { id: 'l3', prompt: 'Farhan writes `* { animation: none !important; transition: none !important; }` for reduced motion. What breaks?', hint: 'What carried meaning?', options: [{ id: 'a', label: 'Nothing' }, { id: 'b', label: 'Spinners freeze, so a payment looks stuck, and fades that showed a change vanish' }, { id: 'c', label: 'The page loads faster, so it’s fine' }, { id: 'd', label: 'Only the colours' }], correct: 'b', explanation: 'A blanket off switch removes the meaning too. Decide per motion.' },
    { id: 'l4', prompt: 'Who else benefits from reduced motion done well?', hint: 'Not only vestibular disorders.', options: [{ id: 'a', label: 'Nobody' }, { id: 'b', label: 'People with migraine, ADHD or motion sickness, people on cheap phones that stutter, and anyone in a moving bus' }, { id: 'c', label: 'Only designers' }, { id: 'd', label: 'Only desktop users' }], correct: 'b', explanation: 'Calmer motion helps attention, battery and slow devices too.' },
    { id: 'l5', prompt: 'How should Neha hand reduced motion to Farhan?', hint: 'A spec, per motion.', options: [{ id: 'a', label: '“Make it accessible”' }, { id: 'b', label: 'For every motion in the spec, a reduced-motion line: stop, fade (with its duration) or keep' }, { id: 'c', label: 'A separate app' }, { id: 'd', label: 'Leave it to the operating system' }], correct: 'b', explanation: 'Each motion gets its reduced version decided at design time, like its curve and duration.' },
  ],
};
