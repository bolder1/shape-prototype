// Episodes for chapter pr.4 · Advanced prototyping. Drafts by Claude, for review.
// Thela is a Hyderabad grocery app that delivers in about 15 minutes from dark stores in Kukatpally, Madhapur and
// Kondapur. Ananya Reddy leads design, Vikram builds the front end and the code prototypes, and Sana runs research.
// Lakshmi, who shops for a family of five in Kukatpally, is one of Sana's participants. pr.1 asked how much fidelity a
// question needs; this chapter is about the prototypes senior designers build when the answer is "a lot": logic, code
// and AI. The behaviours, questions and studies, and the rules they're judged by, are in ../advproto and tested there.
import type { Episode } from '../episode';
import {
  THELA_BEHAVIOURS, THELA_QUESTIONS, THELA_STUDIES, outputMethod, protoTool, wireKind,
  type ThelaBehaviour, type ThelaQuestion, type ThelaStudy,
} from '../advproto';

const behaviour = (k: ThelaBehaviour) => THELA_BEHAVIOURS[k].text;
const wire = (k: ThelaBehaviour) => wireKind(THELA_BEHAVIOURS[k]);
const question = (k: ThelaQuestion) => THELA_QUESTIONS[k].text;
const tool = (k: ThelaQuestion) => protoTool(THELA_QUESTIONS[k].needs);
const study = (k: ThelaStudy) => THELA_STUDIES[k].text;
const method = (k: ThelaStudy) => outputMethod(THELA_STUDIES[k]);

export const pr4_1: Episode = {
  lessonId: 'pr.4-1',
  hook: 'Lakshmi adds butter before atta, and Thela’s 14-frame cart prototype shows her ₹265 for a ₹56 pack. Watch one frame with three variables and four rules replace all fourteen.',
  scene: {
    id: 'logic-cart', duration: 36,
    beats: [
      { at: 0, title: 'Fourteen frames', body: 'Ananya linked a frame for every cart she expected. Lakshmi taps in a different order and lands on the wrong total.' },
      { at: 6, title: 'Give it memory', body: 'Number variables `itemCount` and `subtotal`. Each + runs Set variable: subtotal + 54. Everything bound to them updates.' },
      { at: 11, title: 'Let it decide', body: 'A conditional on the cart: if subtotal < 199, show “Add ₹X more for free delivery”. Else, delivery is free.' },
      { at: 16, title: 'Rules stack', body: 'A ₹15 fee under ₹99. FIRST50 from ₹299. + stops at 2 when only 2 packs of butter are left.' },
      { at: 21, title: 'Switch whole sets', body: 'Modes: English or Telugu labels, regular or Plus prices, a new or a returning customer. One file, set on the first frame.' },
      { at: 26, title: 'Any order works', body: 'Lakshmi adds butter, then milk, then atta. The bar fills, the fee vanishes, the total is right every time.' },
      { at: 31, title: 'Now the test is real', body: 'Six of eight participants added one more item to reach ₹199. That’s a finding about the design, not the prototype.' },
    ],
  },
  check: [
    { id: 'c1', prompt: 'Why did the 14-frame prototype fail?', options: [{ id: 'a', label: 'Too few colours' }, { id: 'b', label: 'It could only follow the orders Ananya expected, and the test is about what people choose' }, { id: 'c', label: 'Figma is slow' }],
      correct: 'b', explanation: 'Frames follow paths. Variables follow people.' },
    { id: 'c2', prompt: 'What does a conditional add that a variable doesn’t?', options: [{ id: 'a', label: 'A colour' }, { id: 'b', label: 'A decision: it checks a value and does one thing or another' }, { id: 'c', label: 'A new frame' }],
      correct: 'b', explanation: 'Variables remember; conditionals decide.' },
  ],
  game: {
    id: 'logic-wire', title: 'Wire the cart',
    instructions: 'Each card is a behaviour Sana’s test needs. Wire it with a variable, a conditional or a mode. Right calls switch it on in the cart prototype beside you: tap + and − and watch it work.',
    lanes: [
      { id: 'variable', label: 'Variable', hint: 'Remember a value and show it' },
      { id: 'conditional', label: 'Conditional', hint: 'Check a value, then branch' },
      { id: 'mode', label: 'Mode', hint: 'Swap a whole set of values' },
    ],
    cards: [
      { id: 'g1', label: behaviour('badge'), lane: wire('badge'), visual: 'badge', note: 'A number variable, `itemCount`. Each + sets it to itemCount + 1, each − to itemCount − 1, and the badge text is bound to it.' },
      { id: 'g2', label: behaviour('freeDelivery'), lane: wire('freeDelivery'), visual: 'freeDelivery', note: 'One conditional after every change: if subtotal < 199, show the bar with 199 − subtotal and set delivery to 25; else hide it and set 0.' },
      { id: 'g3', label: behaviour('telugu'), lane: wire('telugu'), visual: 'telugu', note: 'Every label is a string variable with an English and a Telugu mode. One switch changes them all, and the layout shows whether Telugu fits.' },
      { id: 'g4', label: behaviour('subtotal'), lane: wire('subtotal'), visual: 'subtotal', note: 'An expression on each +: subtotal + 54 for milk, + 265 for atta. One variable, bound to the subtotal and the Pay button.' },
      { id: 'g5', label: behaviour('stock'), lane: wire('stock'), visual: 'stock', note: 'If butterQty < 2, add one; else show “Only 2 left” and do nothing. Without it, the prototype lets people do what the app won’t.' },
      { id: 'g6', label: behaviour('plus'), lane: wire('plus'), visual: 'plus', note: 'A Member mode holds Plus prices and the free-delivery rule. Switch it, and the same flow is the Plus version.' },
      { id: 'g7', label: behaviour('smallCart'), lane: wire('smallCart'), visual: 'smallCart', note: 'If subtotal < 99, set smallCartFee to 15. Watch whether people notice it appear and disappear as they change quantities.' },
      { id: 'g8', label: behaviour('savings'), lane: wire('savings'), visual: 'savings', note: 'Each + adds the item’s MRP minus Thela’s price. Milk and atta together save ₹37.' },
      { id: 'g9', label: behaviour('coupon'), lane: wire('coupon'), visual: 'coupon', note: 'If subtotal ≥ 299, take ₹50 off; else say “Add ₹X more to use FIRST50”. Testing the message is the point.' },
      { id: 'g10', label: behaviour('returning'), lane: wire('returning'), visual: 'returning', note: 'A New / Returning mode holds the saved address and past orders. Sana sets it on the first frame and resets between participants.' },
    ],
  },
  gap: {
    id: 'gap', from: 0, at: 5.6,
    prompt: 'Lakshmi has landed on a wrong total. Sana has five more sessions this afternoon. What does Ananya do?',
    options: [{ id: 'a', label: 'Add the missing frames between sessions' }, { id: 'b', label: 'Rebuild the cart as one frame with variables and conditionals, so any order gives the right total' }, { id: 'c', label: 'Ask participants to follow a script' }],
    correct: 'b', explanation: 'The test is about choices, so the prototype has to handle any choice.',
  },
  takeaways: [
    { title: 'Variables remember', body: 'Number, string and boolean variables hold the cart’s state; Set variable with an expression updates them, and everything bound to them follows.' },
    { title: 'Conditionals decide', body: 'If / else on a value gives real thresholds and limits: free delivery, fees, coupons, stock.' },
    { title: 'Modes switch sets', body: 'Language, membership and the participant’s starting data become modes in one file, set on the first frame.' },
    { title: 'Real where it’s tested', body: 'Make real what the test observes. Write down what the prototype still fakes.' },
  ],
  quiz: {
    seconds: 15,
    questions: [
      { id: 'q1', prompt: 'The cart badge count needs…', options: [{ id: 'a', label: 'A variable' }, { id: 'b', label: 'A conditional' }, { id: 'c', label: 'A mode' }], correct: 'a', explanation: 'It stores and shows a number.' },
      { id: 'q2', prompt: 'Free delivery from ₹199 needs…', options: [{ id: 'a', label: 'A mode' }, { id: 'b', label: 'A conditional' }, { id: 'c', label: 'A new frame' }], correct: 'b', explanation: 'It compares the subtotal.' },
      { id: 'q3', prompt: 'English and Telugu labels in one file use…', options: [{ id: 'a', label: 'Modes' }, { id: 'b', label: 'Two files' }, { id: 'c', label: 'A boolean per label' }], correct: 'a', explanation: 'A mode swaps every string at once.' },
      { id: 'q4', prompt: 'Milk ₹54 and atta ₹265. Free delivery?', options: [{ id: 'a', label: 'Yes, ₹319 is over ₹199' }, { id: 'b', label: 'No' }, { id: 'c', label: 'Only with FIRST50' }], correct: 'a', explanation: 'And FIRST50 works too, from ₹299.' },
    ],
  },
  ladder: [
    { id: 'l1', prompt: 'When is a linked-frames prototype still the right call?', hint: 'What does the test observe?', options: [{ id: 'a', label: 'Never' }, { id: 'b', label: 'When the question is about finding the way or understanding a screen, not about choices that change values' }, { id: 'c', label: 'When the designer is junior' }, { id: 'd', label: 'When it has more than 20 frames' }], correct: 'b', explanation: 'Add logic when the behaviour under test depends on it.' },
    { id: 'l2', prompt: 'Why name the prototype’s variables `itemCount`, `subtotal` and `delivery`, as engineering will?', hint: 'Who reads the prototype after the test?', options: [{ id: 'a', label: 'Figma requires it' }, { id: 'b', label: 'The rules become a readable spec: engineers can check the thresholds and states against what they build' }, { id: 'c', label: 'Shorter names are faster' }, { id: 'd', label: 'It doesn’t matter' }], correct: 'b', explanation: 'A wired prototype doubles as a spec of the rules.' },
    { id: 'l3', prompt: 'Sana resets the prototype between participants by reopening it. Halfway through, a participant starts with yesterday’s cart. What should Ananya add?', hint: 'Where does the session begin?', options: [{ id: 'a', label: 'Ask Sana to clear her browser' }, { id: 'b', label: 'A start frame that sets every variable to its starting value and the participant’s mode, so each session begins the same' }, { id: 'c', label: 'A new file per participant' }, { id: 'd', label: 'Nothing; it’s random' }], correct: 'b', explanation: 'Make the starting state explicit and repeatable.' },
    { id: 'l4', prompt: 'The cart has nine rules now, spread across every + button. A threshold changes from ₹199 to ₹149. What does that reveal?', hint: 'How many places hold 199?', options: [{ id: 'a', label: 'Figma is the wrong tool' }, { id: 'b', label: 'Thresholds belong in variables of their own, like `freeDeliveryAt`, so one change updates every rule' }, { id: 'c', label: 'Rules shouldn’t change' }, { id: 'd', label: 'Delete the rules' }], correct: 'b', explanation: 'Same as code: no magic numbers.' },
    { id: 'l5', prompt: 'Which is the strongest reason to stop adding logic and move to code?', hint: 'What can’t variables hold?', options: [{ id: 'a', label: 'The file looks busy' }, { id: 'b', label: 'The test needs things variables can’t do: lists of real items, real typing into search, live data or real timing' }, { id: 'c', label: 'The engineers are free' }, { id: 'd', label: 'Stakeholders prefer code' }], correct: 'b', explanation: 'Variables cover state and rules; they don’t cover data or input.' },
  ],
};

export const pr4_2: Episode = {
  lessonId: 'pr.4-2',
  hook: 'Thela’s search test went beautifully: every spelling of toor dal found it. Because the prototype showed the same perfect results whatever was typed. Watch a team learn to pay for exactly the realism a question needs.',
  scene: {
    id: 'proto-ladder', duration: 36,
    beats: [
      { at: 0, title: 'A test that lied', body: 'The Figma search showed toor dal for anything typed. Sana reported that search works. In the app, “kandi pappu” finds nothing.' },
      { at: 6, title: 'Start from the question', body: 'Write it down, then list what must be real for the answer to be true. Everything else can stay fake.' },
      { at: 11, title: 'Figma: flows and rules', body: 'Taps, variables, conditionals and modes. About a day. Enough for the free-delivery bar and the fees.' },
      { at: 16, title: 'Framer: a real web page', body: 'Real scroll, hover and breakpoints, fields people type in, lists from a CMS. Two or three days.' },
      { at: 21, title: 'React: the real thing, briefly', body: 'Real search, real stock, real 4G timing, the camera, people’s own orders. About a week of Vikram’s time.' },
      { at: 26, title: 'The cheapest that covers it', body: 'Pick the first tool that makes every need real. More costs days and answers nothing extra.' },
      { at: 31, title: 'Built to be thrown away', body: 'Only the tested screens, the system’s components, flags to switch between sessions. Keep the findings; bin the code.' },
    ],
  },
  check: [
    { id: 'c1', prompt: 'Why was the search test wrong?', options: [{ id: 'a', label: 'Too few participants' }, { id: 'b', label: 'It faked the one thing the question was about' }, { id: 'c', label: 'Figma looked unpolished' }],
      correct: 'b', explanation: 'Fake the parts you aren’t testing, never the part you are.' },
    { id: 'c2', prompt: 'How do you pick the tool?', options: [{ id: 'a', label: 'The most realistic one' }, { id: 'b', label: 'The cheapest one that makes every need of the question real' }, { id: 'c', label: 'Whatever the team knows' }],
      correct: 'b', explanation: 'Realism is a cost. Pay for what the answer depends on.' },
  ],
  game: {
    id: 'proto-fit', title: 'Fit the prototype',
    instructions: 'Each card is a question on Sana’s research board. Pick the cheapest tool that makes everything it needs real. The checklist shows what each tool would leave fake, and the plan adds up the days.',
    lanes: [
      { id: 'figma', label: 'Figma', hint: 'Flows and rules · 1 day' },
      { id: 'framer', label: 'Framer', hint: 'Real web, typing, CMS · 3 days' },
      { id: 'code', label: 'React', hint: 'Live data, timing, device · 6 days' },
    ],
    cards: [
      { id: 'g1', label: question('nudge'), lane: tool('nudge'), visual: 'nudge', note: 'A flow and a rule. Figma variables and one conditional make both real in a day.' },
      { id: 'g2', label: question('search'), lane: tool('search'), visual: 'search', note: 'Real typing against the real index. Only code can tell you what “kandi pappu” returns.' },
      { id: 'g3', label: question('address'), lane: tool('address'), visual: 'address', note: 'People have to really type, with the real keyboard and autofill. Framer’s form fields do that; nothing needs live data.' },
      { id: 'g4', label: question('staples'), lane: tool('staples'), visual: 'staples', note: 'Finding the way is a flow question. Linked frames are enough.' },
      { id: 'g5', label: question('slots'), lane: tool('slots'), visual: 'slots', note: 'Real 4G timing can’t be faked convincingly. A React prototype calling the real slot API on a mid-range phone can.' },
      { id: 'g6', label: question('sticky'), lane: tool('sticky'), visual: 'sticky', note: 'Real scroll on a real laptop browser, at real breakpoints. Framer publishes exactly that.' },
      { id: 'g7', label: question('fee'), lane: tool('fee'), visual: 'fee', note: 'A conditional on the subtotal. Figma makes it real.' },
      { id: 'g8', label: question('scan'), lane: tool('scan'), visual: 'scan', note: 'The camera and the real text recognition. Only code reaches the phone’s camera.' },
      { id: 'g9', label: question('aisle'), lane: tool('aisle'), visual: 'aisle', note: '60 real packs from a CMS collection, on a page that scrolls for real. Framer, in two or three days.' },
      { id: 'g10', label: question('teluguCart'), lane: tool('teluguCart'), visual: 'teluguCart', note: 'A language mode on the cart prototype. Figma, with the same rules in both modes.' },
      { id: 'g11', label: question('buyAgain'), lane: tool('buyAgain'), visual: 'buyAgain', note: 'Trust depends on seeing their own orders. That needs their real data, loaded by code, with consent.' },
    ],
  },
  gap: {
    id: 'gap', from: 0, at: 5.6,
    prompt: 'The search test reported success, and the app finds nothing for “kandi pappu”. What should Sana and Ananya change?',
    options: [{ id: 'a', label: 'Retest the same prototype with more people' }, { id: 'b', label: 'List what the question needs to be real, and build a code prototype that sends real queries to the real search' }, { id: 'c', label: 'Make the Figma results look more realistic' }],
    correct: 'b', explanation: 'Start from what the answer depends on.',
  },
  takeaways: [
    { title: 'Question, then needs', body: 'Write the question, then list what must be real for its answer to be true.' },
    { title: 'A ladder of tools', body: 'Figma for flows and rules, Framer for real web, typing and CMS content, React for live data, timing and the device.' },
    { title: 'Cheapest that covers it', body: 'More realism than the question needs costs days and adds nothing.' },
    { title: 'Code prototypes are disposable', body: 'Build only what’s tested, use the system’s components, and keep the findings, not the code.' },
  ],
  quiz: {
    seconds: 15,
    questions: [
      { id: 'q1', prompt: 'Does the free-delivery bar work? Cheapest tool?', options: [{ id: 'a', label: 'Figma' }, { id: 'b', label: 'Framer' }, { id: 'c', label: 'React' }], correct: 'a', explanation: 'A flow and a rule.' },
      { id: 'q2', prompt: 'Real typing in a form, no live data?', options: [{ id: 'a', label: 'Figma' }, { id: 'b', label: 'Framer' }, { id: 'c', label: 'React' }], correct: 'b', explanation: 'Framer fields take real typing.' },
      { id: 'q3', prompt: 'Real network timing on 4G?', options: [{ id: 'a', label: 'React' }, { id: 'b', label: 'Figma delay' }, { id: 'c', label: 'Framer' }], correct: 'a', explanation: 'Only code meets the real network.' },
      { id: 'q4', prompt: 'After the test, the code prototype…', options: [{ id: 'a', label: 'Ships' }, { id: 'b', label: 'Is mostly thrown away' }, { id: 'c', label: 'Becomes the design system' }], correct: 'b', explanation: 'It was built to answer a question.' },
    ],
  },
  ladder: [
    { id: 'l1', prompt: 'What’s the risk of more fidelity than the question needs?', hint: 'Count days, and watch what participants talk about.', options: [{ id: 'a', label: 'None' }, { id: 'b', label: 'Days spent that answer nothing extra, and a polished thing people comment on instead of the question' }, { id: 'c', label: 'Participants get bored' }, { id: 'd', label: 'It’s harder to share' }], correct: 'b', explanation: 'Fidelity is a price.' },
    { id: 'l2', prompt: 'Framer can run React code components. Why plan that as a code prototype?', hint: 'Who writes it, and how long does it take?', options: [{ id: 'a', label: 'Framer charges more' }, { id: 'b', label: 'Once you’re writing components that fetch data, it needs an engineer’s time, test data and hosting like any code prototype' }, { id: 'c', label: 'It isn’t allowed' }, { id: 'd', label: 'It looks different' }], correct: 'b', explanation: 'Name the cost honestly.' },
    { id: 'l3', prompt: 'Vikram’s search prototype is ready. How should it be checked before Sana’s first session?', hint: 'Where will participants use it?', options: [{ id: 'a', label: 'On Vikram’s laptop on office Wi-Fi' }, { id: 'b', label: 'On a mid-range Android phone on 4G, with the real catalogue copy, and every spelling on Sana’s list' }, { id: 'c', label: 'Not at all; that’s what the test is for' }, { id: 'd', label: 'In Figma' }], correct: 'b', explanation: 'Real conditions are why you built it in code.' },
    { id: 'l4', prompt: 'The test shows the new ranking helps. Product wants to ship Vikram’s prototype next week. What should Ananya say?', hint: 'What was it built for?', options: [{ id: 'a', label: 'Ship it' }, { id: 'b', label: 'Keep the ranking finding and the flags data, and rebuild it properly; the prototype skipped error states, accessibility and tests' }, { id: 'c', label: 'Run the test again' }, { id: 'd', label: 'Ship it on the web only' }], correct: 'b', explanation: 'A prototype answers a question; a product survives real use.' },
    { id: 'l5', prompt: '“Buy again” needs each participant’s own orders. What must the plan include?', hint: 'Whose data is it?', options: [{ id: 'a', label: 'Nothing special' }, { id: 'b', label: 'Consent to load their data, a read-only copy, no screen recording of personal details, and deletion after the study' }, { id: 'c', label: 'Use made-up orders instead' }, { id: 'd', label: 'Ask them to type their orders in' }], correct: 'b', explanation: 'Real data means real responsibility.' },
  ],
};

export const pr4_3: Episode = {
  lessonId: 'pr.4-3',
  hook: 'In the deck, “biryani for 6” becomes a perfect 14-item cart. In the beta it once added a kilo of chicken to a veg biryani. Watch Sana test the AI Thela will actually ship, not the one in the slides.',
  scene: {
    id: 'output-range', duration: 36,
    beats: [
      { at: 0, title: 'The demo cart', body: '“Biryani for 6” becomes a tidy 14-item cart in the pitch deck. Everyone loves it. It is the best answer the model ever gave.' },
      { at: 6, title: 'The real range', body: 'Right. Chicken in a veg biryani. A 9-second wait. 23 items. A question back. Each needs a design.' },
      { at: 11, title: 'No model yet: a wizard', body: 'Sana types each cart behind the curtain from what the participant asks. It answers “do people want this?” in a week.' },
      { at: 16, title: 'Same for all: recorded', body: 'Generate 200 real outputs, choose one per case, and show every participant the same mistake at the same step.' },
      { at: 21, title: 'Their own ask: live', body: 'The real model answers each person’s own request. Log every output; expect surprises.' },
      { at: 26, title: 'Real content, not lorem', body: 'The shortest name and the longest. Telugu labels. ₹9 to ₹4,999. An empty search.' },
      { at: 31, title: 'Designed for the miss', body: 'Lakshmi spots the chicken and removes it in one tap. The fix was designed because the mistake was tested.' },
    ],
  },
  check: [
    { id: 'c1', prompt: 'What’s wrong with testing only the demo cart?', options: [{ id: 'a', label: 'It’s too short' }, { id: 'b', label: 'It tests a product that never gives a wrong, slow or long answer, which isn’t the one that ships' }, { id: 'c', label: 'Nothing' }],
      correct: 'b', explanation: 'Prototype the range, not the best answer.' },
    { id: 'c2', prompt: 'When is Wizard of Oz the right method?', options: [{ id: 'a', label: 'When no model can do it yet' }, { id: 'b', label: 'Always' }, { id: 'c', label: 'When the model is perfect' }],
      correct: 'a', explanation: 'A person plays the model to learn if it’s worth building.' },
  ],
  game: {
    id: 'output-plan', title: 'Plan the outputs',
    instructions: 'Each card is a study in Sana’s plan for Ask Thela. Should a person play the model, should everyone see the same real outputs chosen in advance, or should the live model answer each participant? Right calls show what three participants would see.',
    lanes: [
      { id: 'wizard', label: 'Wizard of Oz', hint: 'No model yet: a person plays it' },
      { id: 'recorded', label: 'Recorded', hint: 'Real outputs, the same for all' },
      { id: 'live', label: 'Live model', hint: 'Each person’s own request' },
    ],
    cards: [
      { id: 'g1', label: study('want'), lane: method('want'), visual: 'want', note: 'There’s no model, and the question is whether to build one. Sana builds each cart by hand from what people ask.' },
      { id: 'g2', label: study('wrongItem'), lane: method('wrongItem'), visual: 'wrongItem', note: 'The live model might not make that mistake today. A recorded real output makes sure every participant meets it, at the same step.' },
      { id: 'g3', label: study('realAsks'), lane: method('realAsks'), visual: 'realAsks', note: 'The question is what people ask for. Only their own requests, answered by the real model, can tell you.' },
      { id: 'g4', label: study('voice'), lane: method('voice'), visual: 'voice', note: 'The speech model can’t handle Telugu-English mixing yet. A researcher listens and builds the cart, and the recordings become training examples.' },
      { id: 'g5', label: study('layouts'), lane: method('layouts'), visual: 'layouts', note: 'A comparison needs the same cart in both layouts, or the difference could be the cart.' },
      { id: 'g6', label: study('trust'), lane: method('trust'), visual: 'trust', note: 'Trust in their own family recipes can only be tested with their own recipes. Live, with every output logged.' },
      { id: 'g7', label: study('wait'), lane: method('wait'), visual: 'wait', note: 'A fixed 9-second wait, the real one from the logs, shown to everyone. The live model’s timing would vary by session.' },
      { id: 'g8', label: study('followUp'), lane: method('followUp'), visual: 'followUp', note: 'Multi-turn isn’t built. A wizard asks the question and learns whether people find it helpful or a hurdle.' },
      { id: 'g9', label: study('longCart'), lane: method('longCart'), visual: 'longCart', note: 'A real 23-item output, chosen for its length, so everyone faces the same long list on the same small phone.' },
      { id: 'g10', label: study('fixRate'), lane: method('fixRate'), visual: 'fixRate', note: 'A rate across real requests needs the real model on people’s own asks. Count the fixes in the logs.' },
    ],
  },
  gap: {
    id: 'gap', from: 6, at: 10.6,
    prompt: 'Thela has no model yet. The product lead wants to know this month whether people want Ask Thela at all. What does Sana do?',
    options: [{ id: 'a', label: 'Wait for the model' }, { id: 'b', label: 'Run a Wizard of Oz study: she builds each cart by hand, behind the prototype, from what people ask' }, { id: 'c', label: 'Show everyone the demo cart' }],
    correct: 'b', explanation: 'A person can play the model long before there is one.',
  },
  takeaways: [
    { title: 'The range, not the best', body: 'Design and test the right, partly wrong, slow, long and failed outputs, not just the demo.' },
    { title: 'Three ways to supply outputs', body: 'Wizard of Oz before a model exists, recorded real outputs when everyone must see the same, live when the question is about people’s own requests.' },
    { title: 'Real content', body: 'Stock prototypes from the real catalogue: extremes of length, language, price and the empty case.' },
    { title: 'Honest afterwards', body: 'Tell participants what was real, and never let a wizard or a chosen output set a promise the model can’t keep.' },
  ],
  quiz: {
    seconds: 15,
    questions: [
      { id: 'q1', prompt: 'No model exists yet. Method?', options: [{ id: 'a', label: 'Wizard of Oz' }, { id: 'b', label: 'Live' }, { id: 'c', label: 'Recorded' }], correct: 'a', explanation: 'A person plays it.' },
      { id: 'q2', prompt: 'Everyone must meet the same mistake. Method?', options: [{ id: 'a', label: 'Live' }, { id: 'b', label: 'Recorded' }, { id: 'c', label: 'Wizard of Oz' }], correct: 'b', explanation: 'Chosen real outputs are controlled.' },
      { id: 'q3', prompt: 'What do people ask for themselves? Method?', options: [{ id: 'a', label: 'Recorded' }, { id: 'b', label: 'Live' }, { id: 'c', label: 'Lorem ipsum' }], correct: 'b', explanation: 'Their own input, the real model.' },
      { id: 'q4', prompt: 'A product list prototype should include…', options: [{ id: 'a', label: 'Tidy names only' }, { id: 'b', label: 'The longest names, Telugu, the price extremes and empty results' }, { id: 'c', label: 'Lorem ipsum' }], correct: 'b', explanation: 'Real content breaks layouts mock content doesn’t.' },
    ],
  },
  ladder: [
    { id: 'l1', prompt: 'Why choose recorded outputs rather than editing them to read better?', hint: 'What would you be testing?', options: [{ id: 'a', label: 'Editing takes too long' }, { id: 'b', label: 'Edited outputs test a better model than the one that ships; chosen real ones keep the test honest and still controlled' }, { id: 'c', label: 'Participants can tell' }, { id: 'd', label: 'It’s against Figma’s rules' }], correct: 'b', explanation: 'Control which outputs, never what they say.' },
    { id: 'l2', prompt: 'A Wizard of Oz study shows people love Ask Thela. What should Sana be careful to report?', hint: 'Who made the carts?', options: [{ id: 'a', label: 'Nothing; it’s a clear win' }, { id: 'b', label: 'That a person made every cart, so the results show demand, not that the model will be good enough' }, { id: 'c', label: 'That the model is ready' }, { id: 'd', label: 'Only the quotes' }], correct: 'b', explanation: 'Wizard results measure desire, not feasibility.' },
    { id: 'l3', prompt: 'The live study logs 40 outputs. Six have a wrong quantity. What does Ananya do with that?', hint: 'Where does the next study get its cases?', options: [{ id: 'a', label: 'Report the model as 85% accurate' }, { id: 'b', label: 'Design how wrong quantities are shown and fixed, and add a real wrong-quantity output to the recorded set for the next test' }, { id: 'c', label: 'Ignore them' }, { id: 'd', label: 'Hide quantities' }], correct: 'b', explanation: 'Live studies find the cases; recorded studies test the fixes.' },
    { id: 'l4', prompt: 'Lakshmi says, “It knew exactly what I wanted.” It was a wizard. What does Sana owe her?', hint: 'What did Lakshmi believe?', options: [{ id: 'a', label: 'Nothing' }, { id: 'b', label: 'A debrief that a person built the carts, why, and what the real product may do differently' }, { id: 'c', label: 'A discount' }, { id: 'd', label: 'Silence, to keep the study clean' }], correct: 'b', explanation: 'Deception ends when the session does.' },
    { id: 'l5', prompt: 'The longest product name, 64 characters, breaks the AI cart on a 360 px phone. When should that have been found?', hint: 'What was the prototype stocked with?', options: [{ id: 'a', label: 'After launch' }, { id: 'b', label: 'Before the first session, by stocking the prototype with the real catalogue’s extremes and checking it on a small phone' }, { id: 'c', label: 'Never: names are content' }, { id: 'd', label: 'In QA' }], correct: 'b', explanation: 'Real content is part of the prototype.' },
  ],
};
