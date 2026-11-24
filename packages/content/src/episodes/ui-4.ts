// Episodes for chapter ui.4 · UI components & screens. Drafts by Claude, for review.
// One product runs through the chapter: Nisha, the designer at Hisaab (a ledger app for small shops: sales, udhaar
// and stock), takes her wireframes to high fidelity for Ramesh ji, who runs a kirana store in Jaipur’s Malviya Nagar:
// the buttons, inputs and cards, the icons, the images, and the udhaar table.
import type { Episode } from '../episode';

export const ui4_1: Episode = {
  lessonId: 'ui.4-1',
  hook: 'Ramesh ji means to save a payment and deletes a customer instead. Watch three grey boxes become a button with a rank, an input with a label and a card with one job.',
  scene: {
    id: 'component-kit', duration: 34,
    beats: [
      { at: 0, title: 'Grey boxes', body: 'Nisha’s wireframe of “Record payment”: three identical buttons in a row, a box for the amount, a customer card.' },
      { at: 5, title: 'Three equal buttons', body: 'Ramesh ji taps the one on the right, as usual. This time it was “Delete customer”, not “Save”.' },
      { at: 10, title: 'Give them a rank', body: '“Save payment” becomes one filled button, full width. The receipt is outlined. Delete moves away, as red text.' },
      { at: 15, title: 'A box with a label', body: '“Amount (₹)” above the box, ₹ in front, a hint below and the number pad.' },
      { at: 19, title: 'When it goes wrong', body: 'Save with ₹0: a red border, “Enter an amount above ₹0” under the box, and the zero is still there to fix.' },
      { at: 23, title: 'A card with one job', body: 'Sunita Sharma’s card: her name first, what she owes on the right, the last payment in grey. The whole card opens her page.' },
      { at: 28, title: 'Draw every state', body: 'Focus, disabled, loading and error for each part, on one sheet, before anyone writes code.' },
    ],
  },
  check: [
    { id: 'c1', prompt: 'Why did Ramesh ji delete the customer?', options: [{ id: 'a', label: 'He wanted to' }, { id: 'b', label: 'Three buttons looked the same, so nothing told Save and Delete apart' }, { id: 'c', label: 'The screen was too small' }],
      correct: 'b', explanation: 'When every action has the same weight, people go by position and habit, and the dangerous one gets hit.' },
    { id: 'c2', prompt: 'What did the error do right?', options: [{ id: 'a', label: 'It cleared the box' }, { id: 'b', label: 'It sat under the box, said how to fix it, and kept what he typed' }, { id: 'c', label: 'It appeared as a pop-up' }],
      correct: 'b', explanation: 'Errors belong beside the field, in plain words, with the input kept.' },
  ],
  game: {
    id: 'state-sheet', title: 'Fill the state sheet',
    instructions: 'Hisaab’s button, amount box and customer card each need their states drawn before they’re built. For each moment, pick the state the part is in. It’s drawn into its cell on the sheet.',
    lanes: [
      { id: 'focus', label: 'Focus', hint: 'Reached by keyboard or being typed into' },
      { id: 'disabled', label: 'Disabled', hint: 'Can’t be used right now' },
      { id: 'loading', label: 'Loading', hint: 'Waiting for the server' },
      { id: 'error', label: 'Error', hint: 'Something went wrong; say how to fix it' },
    ],
    cards: [
      { id: 'g1', label: 'Ramesh ji’s nephew presses Tab on a laptop until he reaches “Save payment”', visual: 'button', lane: 'focus', note: 'A 2 px ring just outside the button, in a colour with at least 3:1 contrast. Never remove the outline without drawing a better one.' },
      { id: 'g2', label: '“Save payment” before any amount has been typed', visual: 'button', lane: 'disabled', note: 'Greyed and not tappable, but still readable, with the reason close by: “Enter an amount to save”.' },
      { id: 'g3', label: '“Save payment” just after it’s tapped, while the phone talks to the server', visual: 'button', lane: 'loading', note: 'A spinner inside the button and the label “Saving…”. The button keeps its width, so nothing jumps, and ignores more taps.' },
      { id: 'g4', label: 'The amount box while the cursor is in it', visual: 'input', lane: 'focus', note: 'The border turns brand blue and thicker, and the label stays above the box, so you always know what you’re typing.' },
      { id: 'g5', label: 'The customer’s mobile number, which can’t be changed on this screen', visual: 'input', lane: 'disabled', note: 'A grey fill and muted text that can still be read and copied, with a hint: “Change it on the customer’s page”.' },
      { id: 'g6', label: 'The amount box after someone tries to save ₹0', visual: 'input', lane: 'error', note: 'A red border, an error icon and “Enter an amount above ₹0” under the box. The 0 stays, ready to fix.' },
      { id: 'g7', label: 'Sunita Sharma’s card, reached with the Tab key', visual: 'card', lane: 'focus', note: 'The ring goes round the whole card, because the whole card is the link to her page.' },
      { id: 'g8', label: 'Sunita Sharma’s card while her balance is still on its way', visual: 'card', lane: 'loading', note: 'A skeleton: grey bars in the shape of the name and amount, so the list doesn’t jump when the numbers arrive.' },
      { id: 'g9', label: 'Sunita Sharma’s card when her balance couldn’t be fetched', visual: 'card', lane: 'error', note: 'Her name stays, and where the amount was: “Couldn’t load balance · Retry”. The rest of the list still works.' },
    ],
  },
  gap: {
    id: 'gap', from: 5, at: 9.6,
    prompt: 'Ramesh ji tapped Delete instead of Save. What should Nisha change first?',
    options: [{ id: 'a', label: 'Add a confirmation pop-up to every button' }, { id: 'b', label: 'Give the buttons a rank: one filled Save, the rest lighter, and Delete set apart' }, { id: 'c', label: 'Make all three buttons bigger' }],
    correct: 'b', explanation: 'A clear primary action and a destructive one moved away stops the mistake before it happens. Pop-ups on everything get tapped through.',
  },
  takeaways: [
    { title: 'One primary per screen', body: 'Filled for the main job, outlined or text for the rest, destructive actions set apart.' },
    { title: 'Inputs need words', body: 'A label above, a hint below, the right keyboard, and an error that says how to fix it.' },
    { title: 'A card does one job', body: 'One title, one key value, and either the whole card taps or it has one clear action.' },
    { title: 'Draw the states', body: 'Focus, disabled, loading and error for every part, before it’s built.' },
  ],
  quiz: {
    seconds: 12,
    questions: [
      { id: 'q1', prompt: 'How many filled primary buttons should one screen usually have?', options: [{ id: 'a', label: 'One' }, { id: 'b', label: 'As many as there are actions' }], correct: 'a', explanation: 'One main action keeps the choice obvious.' },
      { id: 'q2', prompt: 'Where does an input’s label go?', options: [{ id: 'a', label: 'Inside the box as placeholder text' }, { id: 'b', label: 'Above the box, always visible' }, { id: 'c', label: 'In a tooltip' }], correct: 'b', explanation: 'A placeholder vanishes as soon as you type.' },
      { id: 'q3', prompt: 'A loading button should…', options: [{ id: 'a', label: 'Disappear' }, { id: 'b', label: 'Shrink to a spinner' }, { id: 'c', label: 'Keep its width, show progress and ignore extra taps' }], correct: 'c', explanation: 'Nothing jumps, and nothing is sent twice.' },
      { id: 'q4', prompt: 'A focus ring is for…', options: [{ id: 'a', label: 'Decoration' }, { id: 'b', label: 'People using a keyboard, to see where they are' }, { id: 'c', label: 'Errors' }], correct: 'b', explanation: 'Without it, keyboard users are lost.' },
    ],
  },
  ladder: [
    { id: 'l1', prompt: 'Why style “Delete customer” as red text, away from Save, instead of a big red button?', hint: 'How often is it used?', options: [{ id: 'a', label: 'Red buttons are ugly' }, { id: 'b', label: 'It’s rare and risky, so it shouldn’t compete with the main action or sit under the thumb' }, { id: 'c', label: 'Text is easier to code' }, { id: 'd', label: 'So nobody can find it' }], correct: 'b', explanation: 'Weight follows importance and frequency. Risky actions get a deliberate step away.' },
    { id: 'l2', prompt: 'Is a disabled button always a good idea?', hint: 'What does the person learn from it?', options: [{ id: 'a', label: 'Yes, always disable until the form is valid' }, { id: 'b', label: 'Only if the reason is shown nearby; otherwise people don’t know what to fix, so letting them tap and showing the error can be better' }, { id: 'c', label: 'Never use disabled' }, { id: 'd', label: 'Only on desktop' }], correct: 'b', explanation: 'A silent grey button is a dead end. Say why, or let them try and explain.' },
    { id: 'l3', prompt: 'A customer card has three buttons inside it and the card itself is also tappable. What’s the problem?', hint: 'Where does a tap go?', options: [{ id: 'a', label: 'None' }, { id: 'b', label: 'Tap targets fight each other, and people hit the card when they meant a button' }, { id: 'c', label: 'Cards can’t have buttons' }, { id: 'd', label: 'It needs a shadow' }], correct: 'b', explanation: 'Either the whole card is one target, or it has one or two clear buttons and the card itself isn’t tappable.' },
    { id: 'l4', prompt: 'Why draw a skeleton instead of a spinner for a loading card?', hint: 'What happens when the data arrives?', options: [{ id: 'a', label: 'Skeletons are trendier' }, { id: 'b', label: 'It holds the card’s shape, so the layout doesn’t jump and people see what’s coming' }, { id: 'c', label: 'Spinners are slower' }, { id: 'd', label: 'It hides errors' }], correct: 'b', explanation: 'A skeleton reserves the space and hints at the content.' },
    { id: 'l5', prompt: 'Which detail makes the ₹ amount box faster to fill?', hint: 'What keyboard opens?', options: [{ id: 'a', label: 'A bigger font' }, { id: 'b', label: 'The number pad, with ₹ shown in front so it isn’t typed' }, { id: 'c', label: 'An animated border' }, { id: 'd', label: 'A placeholder saying “Amount”' }], correct: 'b', explanation: 'The right keyboard and a fixed prefix save keystrokes and mistakes.' },
  ],
};

export const ui4_2: Episode = {
  lessonId: 'ui.4-2',
  hook: 'Ramesh ji can find two of Hisaab’s eight tiles. Watch icons from three free packs become one family, with words under them.',
  scene: {
    id: 'icon-audit', duration: 34,
    beats: [
      { at: 0, title: 'Eight tiles, no words', body: 'Hisaab’s home screen: eight icons from three free icon packs, and no labels.' },
      { at: 5, title: 'Find udhaar', body: 'Ramesh ji is asked where to write down udhaar. He taps the bolt, then the book. Two of eight found.' },
      { at: 10, title: 'A $ in a rupee shop', body: 'Payments has a dollar sign. Messages is an American mailbox, which he reads as the post office.' },
      { at: 14, title: 'Three packs, one row', body: 'Strokes of 1.5, 2 and 3 px. One icon filled, one drawn edge to edge, corners round and sharp.' },
      { at: 18, title: 'One family, one grid', body: 'Every icon redrawn on a 24 px grid with a 2 px stroke and round ends, filling the same area.' },
      { at: 22, title: 'Words under icons', body: 'New sale, Udhaar, Stock, Payments with ₹, Messages with a speech bubble.' },
      { at: 27, title: 'Small icon, big target', body: 'The icon stays 24 px. The tap area around it is 48 px.' },
      { at: 30, title: 'Eight of eight', body: 'Same test, same shopkeeper. He finds every one first time.' },
    ],
  },
  check: [
    { id: 'c1', prompt: 'Why did Ramesh ji read the mailbox as the post office?', options: [{ id: 'a', label: 'He was careless' }, { id: 'b', label: 'An American kerbside mailbox isn’t how messages look to him; a chat bubble is' }, { id: 'c', label: 'The icon was too small' }],
      correct: 'b', explanation: 'A picture only works if it matches what the user already knows.' },
    { id: 'c2', prompt: 'What made the redrawn icons look like one set?', options: [{ id: 'a', label: 'They were all blue' }, { id: 'b', label: 'One grid, one stroke width, one corner style, the same visual size' }, { id: 'c', label: 'They were bigger' }],
      correct: 'b', explanation: 'Consistency is in the drawing rules, not the colour.' },
  ],
  game: {
    id: 'icon-odd', title: 'Spot the odd icon',
    instructions: 'Each row is a set of icons from Hisaab. One breaks the set. Tap it, then say how: its style, its size, its picture, or a missing label.',
    lanes: [
      { id: 'style', label: 'Style', hint: 'A different stroke, fill or corner' },
      { id: 'size', label: 'Size', hint: 'Bigger, smaller or off the shared line' },
      { id: 'meaning', label: 'Picture', hint: 'Means something else to the user' },
      { id: 'label', label: 'Label', hint: 'Can’t be guessed without a word' },
    ],
    cards: [
      { id: 'g1', label: 'The bottom tab bar, on the Home tab', visual: 'home,sale,udhaar,stock,reports|2|fill', lane: 'style', note: 'Udhaar is filled while the others are outlines, so it looks like the selected tab. Fill only the tab you’re on.' },
      { id: 'g2', label: 'The toolbar on a customer’s page', visual: 'call,chat,edit,share,trash|3|bold', lane: 'style', note: 'Share has a 3 px stroke beside 2 px ones; it came from another pack. Redraw it in the same family.' },
      { id: 'g3', label: 'The home screen tiles', visual: 'sale,udhaar,stock,customers,reports|3|small', lane: 'size', note: 'Customers was pasted in at 18 px and sits low. Every icon fills the same 24 px grid and shares a centre line.' },
      { id: 'g4', label: 'The icons at the top of the stock list', visual: 'search,scan,calendar,bell,settings|1|big', lane: 'size', note: 'Scan is drawn edge to edge, beyond the padding the others keep inside their box, so it looks bigger and more important than it is. Keep the same live area.' },
      { id: 'g5', label: 'The home screen tiles, second row', visual: 'sale,udhaar,dollar,stock,reports|2', lane: 'meaning', note: 'A dollar sign on Payments. Hisaab works in rupees: use ₹, the symbol on every price tag in the shop.' },
      { id: 'g6', label: 'The menu on the Home screen', visual: 'home,customers,mailbox,bell,settings|2', lane: 'meaning', note: 'Ramesh ji read the American mailbox as the post office. A speech bubble is what every chat app on his phone uses.' },
      { id: 'g7', label: 'The quick actions on Home', visual: 'sale,bolt,udhaar,stock,reports|1', lane: 'label', note: 'A lightning bolt could mean fast, power, or the electricity bill. Write “Quick sale” under it, as the others have.' },
      { id: 'g8', label: 'The shortcuts above the ledger', visual: 'home,sale,stock,udhaar,settings|3', lane: 'label', note: 'A book could be the register, a guide or a report. Label it “Udhaar”, the word Ramesh ji uses at the counter.' },
    ],
  },
  gap: {
    id: 'gap', from: 10, at: 17.6,
    prompt: 'Ramesh ji found two of eight tiles. What should Nisha do?',
    options: [{ id: 'a', label: 'Add a tutorial explaining each icon' }, { id: 'b', label: 'Redraw the icons as one family, swap the pictures that don’t fit, and put a word under each' }, { id: 'c', label: 'Make the icons bigger and more colourful' }],
    correct: 'b', explanation: 'Labels do the explaining, familiar pictures help the eye, and one consistent set stops any icon looking special by accident.',
  },
  takeaways: [
    { title: 'Label your icons', body: 'Only a few, like search, home and close, are understood alone. Put a word with the rest.' },
    { title: 'Pictures from their world', body: '₹, not $. A chat bubble, not a mailbox. Test icons on the people who’ll use them.' },
    { title: 'One family, one grid', body: 'Same stroke, corners and visual size on a 24 px grid. Outline normal, filled selected.' },
    { title: 'Small icon, big target', body: 'A 20–24 px icon in a 44–48 px tap area.' },
  ],
  quiz: {
    seconds: 12,
    questions: [
      { id: 'q1', prompt: 'Which icon is usually understood without a label?', options: [{ id: 'a', label: 'A magnifying glass for search' }, { id: 'b', label: 'A lightning bolt for quick sale' }], correct: 'a', explanation: 'Search is one of the few universal icons.' },
      { id: 'q2', prompt: 'In a tab bar, a filled icon should mean…', options: [{ id: 'a', label: 'It’s important' }, { id: 'b', label: 'It’s the tab you’re on' }, { id: 'c', label: 'Nothing' }], correct: 'b', explanation: 'Outline for the rest, filled for the selected one.' },
      { id: 'q3', prompt: 'Mixing icons from three packs mostly breaks…', options: [{ id: 'a', label: 'Load time' }, { id: 'b', label: 'Accessibility law' }, { id: 'c', label: 'Consistency: stroke, corners and size differ' }], correct: 'c', explanation: 'One family keeps the drawing rules the same.' },
      { id: 'q4', prompt: 'A good tap area for a 24 px icon is…', options: [{ id: 'a', label: '24 px' }, { id: 'b', label: '44–48 px' }, { id: 'c', label: '100 px' }], correct: 'b', explanation: 'The icon stays small; the target doesn’t.' },
    ],
  },
  ladder: [
    { id: 'l1', prompt: 'Why can two icons at the same 24 px size look different sizes?', hint: 'Think of a circle and a square.', options: [{ id: 'a', label: 'They can’t' }, { id: 'b', label: 'Shapes fill the box differently: a square looks bigger than a circle, so icons are drawn to the same visual area, not the same edges' }, { id: 'c', label: 'Screens are uneven' }, { id: 'd', label: 'Because of the colour' }], correct: 'b', explanation: 'Icon grids give circles, squares and tall shapes their own key lines so they look the same size.' },
    { id: 'l2', prompt: 'Is a floppy disk still a good “Save” icon?', hint: 'What do people recognise, even if they never used one?', options: [{ id: 'a', label: 'No, nobody has seen a floppy' }, { id: 'b', label: 'It’s widely learned as “save”, but in an app for first-time smartphone users a word works better still' }, { id: 'c', label: 'Yes, and it needs no label anywhere' }, { id: 'd', label: 'Only on Windows' }], correct: 'b', explanation: 'Some icons become conventions. Check against your users, and when in doubt, label.' },
    { id: 'l3', prompt: 'An icon-only button needs what for screen-reader users?', hint: 'What is read aloud?', options: [{ id: 'a', label: 'Nothing' }, { id: 'b', label: 'An accessible name, such as aria-label “Delete entry”' }, { id: 'c', label: 'A bigger icon' }, { id: 'd', label: 'A tooltip on hover' }], correct: 'b', explanation: 'Without a name, it’s read as “button” and nothing else.' },
    { id: 'l4', prompt: 'Should icon colour carry meaning, like a red icon for overdue?', hint: 'Not everyone sees red.', options: [{ id: 'a', label: 'Yes, colour alone is enough' }, { id: 'b', label: 'Colour can help, but pair it with a shape or a word so it works without colour' }, { id: 'c', label: 'Icons should never be coloured' }, { id: 'd', label: 'Only in dark mode' }], correct: 'b', explanation: 'Never rely on colour alone; give it a second cue.' },
    { id: 'l5', prompt: 'Nisha wants a fresh icon style for Hisaab. What should she do with the system’s own icons, like share?', hint: 'What do people already know?', options: [{ id: 'a', label: 'Redraw them in a new metaphor' }, { id: 'b', label: 'Keep the platform’s familiar shapes (Android’s share, iOS’s share) in her style, so they’re still recognised' }, { id: 'c', label: 'Remove them' }, { id: 'd', label: 'Use text only everywhere' }], correct: 'b', explanation: 'Style is hers to choose; the shape people recognise isn’t.' },
  ],
};

export const ui4_3: Episode = {
  lessonId: 'ui.4-3',
  hook: 'Hisaab’s website shows a man in a suit shaking hands, and shopkeepers think it’s a bank. Watch every image get a job, or get cut.',
  scene: {
    id: 'image-choice', duration: 34,
    beats: [
      { at: 0, title: 'A stranger on the homepage', body: 'Hisaab’s website: a stock photo of a man in a suit shaking hands, and “Smart accounting solutions”.' },
      { at: 5, title: 'Who is this for?', body: 'Five shopkeepers see the page. Three think it’s a bank. Nobody sees themselves.' },
      { at: 9, title: 'A real counter', body: 'The photo becomes Ramesh ji at his own counter, the old paper register beside his phone.' },
      { at: 14, title: 'Photos for real things', body: 'In the stock list, a photo of each pack, so the 5 kg atta isn’t mixed up with the 10 kg.' },
      { at: 18, title: 'Drawings for ideas', body: '“Backed up every night” can’t be photographed. A simple drawing of the khata and a cloud can show it.' },
      { at: 22, title: 'Sometimes nothing', body: 'A banner photo on the ledger pushes three rows off the screen. Take it out: eight rows fit.' },
      { at: 26, title: 'Every photo costs data', body: 'Six photos on one screen: 720 kB on a slow 4G connection. The same screen with drawings: 48 kB.' },
      { at: 30, title: 'Each image has a job', body: 'Photo for the real thing, drawing for the idea, icon for the small label, nothing for the numbers.' },
    ],
  },
  check: [
    { id: 'c1', prompt: 'Why did the stock photo fail?', options: [{ id: 'a', label: 'It was low resolution' }, { id: 'b', label: 'It showed nobody who uses Hisaab, so it said nothing about who it’s for' }, { id: 'c', label: 'Photos are always wrong' }],
      correct: 'b', explanation: 'Generic stock says “some company”. Real users say “this is for you”.' },
    { id: 'c2', prompt: 'Why a drawing for “Backed up every night”?', options: [{ id: 'a', label: 'Drawings are cheaper' }, { id: 'b', label: 'There’s nothing real to photograph; it’s an idea' }, { id: 'c', label: 'Photos are slow' }],
      correct: 'b', explanation: 'Illustration shows what a camera can’t.' },
  ],
  game: {
    id: 'image-budget', title: 'Photo, drawing, icon or nothing?',
    instructions: 'Choose the image for each Hisaab screen. The phone shows your pick, and the data meter adds up what the screens weigh on a slow connection.',
    lanes: [
      { id: 'photo', label: 'Photo', hint: 'People need to see the real thing' },
      { id: 'illus', label: 'Illustration', hint: 'An idea, an empty moment, a welcome' },
      { id: 'icon', label: 'Icon', hint: 'A small label for an action or a row' },
      { id: 'none', label: 'Nothing', hint: 'The words or numbers are the content' },
    ],
    cards: [
      { id: 'g1', label: 'The stock list, where atta 5 kg and atta 10 kg sit side by side', visual: 'Stock', lane: 'photo', note: 'A photo of each pack lets Ramesh ji tell them apart at a glance, the way he does on the shelf.' },
      { id: 'g2', label: 'The top of Hisaab’s website, showing who it’s for', visual: 'Website', lane: 'photo', note: 'A real shopkeeper at a real counter. Visitors see themselves; a stock handshake says nothing.' },
      { id: 'g3', label: 'The udhaar register before the first entry', visual: 'Udhaar', lane: 'illus', note: 'A small drawing of an empty khata, “No udhaar yet”, and an “Add udhaar” button. There’s nothing real to show yet.' },
      { id: 'g4', label: 'Onboarding: “Your khata is backed up every night”', visual: 'Welcome', lane: 'illus', note: 'A backup is an idea. A simple drawing of the register and a cloud explains it in one look.' },
      { id: 'g5', label: 'The rows in Settings: Language, Printer, Backup', visual: 'Settings', lane: 'icon', note: 'A small icon at the start of each row helps the eye find it; the words do the explaining.' },
      { id: 'g6', label: 'The bottom tabs: Home, Sales, Udhaar, Stock', visual: 'Tabs', lane: 'icon', note: 'One icon per tab, with its word under it, from the same family.' },
      { id: 'g7', label: 'The customer ledger, 40 rows of names and amounts', visual: 'Ledger', lane: 'none', note: 'The numbers are the content. A picture per row or a banner on top pushes rows off the screen.' },
      { id: 'g8', label: 'The monthly sales report', visual: 'Report', lane: 'none', note: 'The chart is the picture. A decorative photo on top only pushes the numbers down and costs data.' },
    ],
  },
  gap: {
    id: 'gap', from: 5, at: 8.6,
    prompt: 'Shopkeepers think Hisaab’s website is a bank. What should the header image be?',
    options: [{ id: 'a', label: 'A brighter stock photo of a happy team' }, { id: 'b', label: 'A photo of a real shopkeeper using Hisaab at their counter' }, { id: 'c', label: 'No image, just a long paragraph' }],
    correct: 'b', explanation: 'Show the real user in the real place, and people know at once it’s for them.',
  },
  takeaways: [
    { title: 'Photos for real things', body: 'Products, places and people that need to be recognised. Show your real users, not stock.' },
    { title: 'Drawings for ideas', body: 'Backups, empty states, welcomes: what no camera can catch. One style throughout.' },
    { title: 'Sometimes nothing', body: 'When words or numbers are the content, decoration only pushes them away.' },
    { title: 'Images cost', body: 'Data, load time and screen space. Every image earns its place, with alt text that says what it shows.' },
  ],
  quiz: {
    seconds: 12,
    questions: [
      { id: 'q1', prompt: 'An empty “No sales yet” screen suits…', options: [{ id: 'a', label: 'A small illustration and a clear next step' }, { id: 'b', label: 'A stock photo' }], correct: 'a', explanation: 'There’s nothing real to show; draw the moment and say what to do.' },
      { id: 'q2', prompt: 'A product list where packs look alike needs…', options: [{ id: 'a', label: 'Icons' }, { id: 'b', label: 'Photos of each pack' }, { id: 'c', label: 'No image' }], correct: 'b', explanation: 'People need to see the exact thing.' },
      { id: 'q3', prompt: 'Good alt text for a photo of Ramesh ji at his counter is…', options: [{ id: 'a', label: '“image1.jpg”' }, { id: 'b', label: '“Photo”' }, { id: 'c', label: '“A shopkeeper at his kirana counter, checking udhaar on his phone”' }], correct: 'c', explanation: 'Say what it shows and why it’s there.' },
      { id: 'q4', prompt: 'Mixing flat, 3D and hand-drawn illustrations…', options: [{ id: 'a', label: 'Makes the app feel stitched together' }, { id: 'b', label: 'Adds variety users love' }, { id: 'c', label: 'Doesn’t matter' }], correct: 'a', explanation: 'Pick one style and keep it.' },
    ],
  },
  ladder: [
    { id: 'l1', prompt: 'Why can a big photo on every screen hurt Hisaab’s users in particular?', hint: 'Phones, networks, data packs.', options: [{ id: 'a', label: 'It can’t' }, { id: 'b', label: 'Many use budget phones on slow or metered data; heavy images load slowly and use up their pack' }, { id: 'c', label: 'Photos break dark mode' }, { id: 'd', label: 'Shopkeepers don’t like photos' }], correct: 'b', explanation: 'Weight is a design decision. Compress, size images for the screen, and cut the decorative ones.' },
    { id: 'l2', prompt: 'A decorative illustration on the login screen needs what alt text?', hint: 'Does it tell the user anything?', options: [{ id: 'a', label: 'A long description of the drawing' }, { id: 'b', label: 'Empty alt (alt=""), so screen readers skip it' }, { id: 'c', label: '“Illustration”' }, { id: 'd', label: 'The file name' }], correct: 'b', explanation: 'Purely decorative images are hidden from screen readers; images that carry meaning get a description.' },
    { id: 'l3', prompt: 'Nisha’s customer photos come in every shape: tall, wide, square. What keeps the list tidy?', hint: 'Think of the frame.', options: [{ id: 'a', label: 'Show each at its own shape' }, { id: 'b', label: 'Crop all to one ratio, like a square or circle, with the face centred' }, { id: 'c', label: 'Remove all photos' }, { id: 'd', label: 'Stretch them to fit' }], correct: 'b', explanation: 'One ratio keeps rows aligned; never stretch.' },
    { id: 'l4', prompt: 'When is an illustration better than a photo of real users?', hint: 'What would the photo show?', options: [{ id: 'a', label: 'Always' }, { id: 'b', label: 'When the subject is abstract, or a photo would show private or unrealistic detail, like a backup or a payment going through' }, { id: 'c', label: 'Never' }, { id: 'd', label: 'Only for children' }], correct: 'b', explanation: 'Pick the medium that shows the idea most clearly.' },
    { id: 'l5', prompt: 'Text sits on top of the header photo and is hard to read. What fixes it?', hint: 'Contrast.', options: [{ id: 'a', label: 'Make the text smaller' }, { id: 'b', label: 'Put the text on a solid area or a dark overlay so it passes 4.5:1, or move it off the photo' }, { id: 'c', label: 'Add a drop shadow and hope' }, { id: 'd', label: 'Use a busier photo' }], correct: 'b', explanation: 'Text over images still has to meet contrast. Give it a calm, solid ground.' },
  ],
};

export const ui4_4: Episode = {
  lessonId: 'ui.4-4',
  hook: 'Ramesh ji needs 14 seconds to see who owes him the most. Watch a boxed, centred spreadsheet become a table he reads in three.',
  scene: {
    id: 'table-tidy', duration: 34,
    beats: [
      { at: 0, title: 'The udhaar register', body: 'Hisaab’s first table, copied from a spreadsheet: every cell boxed, every value centred, headers like CUST_NM.' },
      { at: 5, title: 'Who owes the most?', body: 'Ramesh ji runs his finger down the column. 12000.00 and ₹8000 look the same width. 14 seconds.' },
      { at: 9, title: 'Line up the numbers', body: 'Amounts right-aligned in tabular figures. Thousands sit under thousands, and ₹12,400 stands out.' },
      { at: 13, title: 'One format', body: 'Every amount as ₹1,250, every date as 3 Dec, headers in plain words with units: Owed (₹).' },
      { at: 17, title: 'Fewer lines', body: 'The boxes go, light rules stay. The ID column nobody reads is cut.' },
      { at: 21, title: 'Not just red', body: 'Overdue rows say “45 days” in words. The red is a second signal, not the only one.' },
      { at: 25, title: 'The total stands out', body: 'A bold total at the bottom, and a header that stays put while he scrolls.' },
      { at: 29, title: 'On the phone', body: 'Each row becomes a small card: name, amount, days overdue. Tap for the rest.' },
    ],
  },
  check: [
    { id: 'c1', prompt: 'What made the biggest amount easy to spot?', options: [{ id: 'a', label: 'Making it bold' }, { id: 'b', label: 'Right-aligning amounts in tabular figures, so place values line up' }, { id: 'c', label: 'Centring the column' }],
      correct: 'b', explanation: 'When digits stack, the longest number is visibly the biggest.' },
    { id: 'c2', prompt: 'Why add “45 days” in words to an overdue row?', options: [{ id: 'a', label: 'To fill space' }, { id: 'b', label: 'Colour alone is missed or can’t be seen by everyone' }, { id: 'c', label: 'Red is too bright' }],
      correct: 'b', explanation: 'Meaning needs a second cue besides colour.' },
  ],
  game: {
    id: 'table-build', title: 'Build the table',
    instructions: 'Hisaab’s udhaar table, as copied from a spreadsheet. For each ringed part, pick the fix: align it, format it the same way, make what matters stand out, or cut it. The table redraws as you go.',
    lanes: [
      { id: 'align', label: 'Align it', hint: 'Numbers right, in tabular figures; text left' },
      { id: 'format', label: 'One format', hint: 'Same style for every value, plain words in headers' },
      { id: 'stress', label: 'Make it stand out', hint: 'What matters, shown with more than colour' },
      { id: 'cut', label: 'Cut it', hint: 'Lines or columns that carry nothing' },
    ],
    cards: [
      { id: 'g1', label: 'The amounts owed, centred in their column', visual: 'amount', lane: 'align', note: 'Right-aligned in tabular figures and all written the same way, so thousands sit under thousands and the biggest amount is the longest.' },
      { id: 'g2', label: 'Days overdue, centred', visual: 'days', lane: 'align', note: 'Right-aligned like any number you compare, so 45 and 120 can be read down the column.' },
      { id: 'g3', label: 'Last paid dates written as 2024-12-03, 3/12 and “Dec 3rd”', visual: 'date', lane: 'format', note: 'One format everywhere: 3 Dec. Short, unambiguous, and the way the shop talks.' },
      { id: 'g4', label: 'Headers CUST_NM, AMT and LST_PD', visual: 'header', lane: 'format', note: 'Plain words in sentence case, with the unit where it belongs: Customer, Owed (₹), Last paid.' },
      { id: 'g5', label: 'Overdue rows marked only by a pale red background', visual: 'overdue', lane: 'stress', note: 'The days overdue in red text, with “overdue” said in words, so it reads without colour too.' },
      { id: 'g6', label: 'The total, a plain row that looks like every other', visual: 'total', lane: 'stress', note: 'Bold, with a heavier rule above it, so the one number Ramesh ji checks each evening is found first.' },
      { id: 'g7', label: 'A box around every single cell', visual: 'grid', lane: 'cut', note: 'Drop the vertical lines and keep light rules between rows. The alignment already makes the columns.' },
      { id: 'g8', label: 'A customer ID column, C-00231, that nobody reads', visual: 'id', lane: 'cut', note: 'Ramesh ji knows his customers by name. The ID can live on the detail page.' },
    ],
  },
  gap: {
    id: 'gap', from: 5, at: 8.6,
    prompt: 'Ramesh ji needs 14 seconds to find the biggest amount. What should Nisha try first?',
    options: [{ id: 'a', label: 'Colour the biggest amount red' }, { id: 'b', label: 'Right-align the amounts in tabular figures and write them all the same way' }, { id: 'c', label: 'Add a chart above the table' }],
    correct: 'b', explanation: 'Aligned, consistent numbers let the eye compare by length. Colouring one value fixes today’s question, not the next one.',
  },
  takeaways: [
    { title: 'Numbers right, text left', body: 'Right-align amounts in tabular figures so place values line up.' },
    { title: 'One format', body: '₹1,25,000 in Indian grouping, 3 Dec for dates, units in the header, a dash for empty.' },
    { title: 'Less ink', body: 'No boxes, light row rules, and no columns nobody reads.' },
    { title: 'Stress what matters', body: 'Overdue in words and colour, a bold total, a header that stays. On phones, rows become cards.' },
  ],
  quiz: {
    seconds: 12,
    questions: [
      { id: 'q1', prompt: 'Amounts in a table should be…', options: [{ id: 'a', label: 'Right-aligned' }, { id: 'b', label: 'Centred' }], correct: 'a', explanation: 'So digits line up by place value.' },
      { id: 'q2', prompt: '₹125000 in Indian grouping is…', options: [{ id: 'a', label: '₹125,000' }, { id: 'b', label: '₹1,25,000' }, { id: 'c', label: '₹12,50,00' }], correct: 'b', explanation: 'Three digits, then groups of two: one lakh twenty-five thousand.' },
      { id: 'q3', prompt: 'Tabular figures are…', options: [{ id: 'a', label: 'Bigger digits' }, { id: 'b', label: 'Bold digits' }, { id: 'c', label: 'Digits that all have the same width' }], correct: 'c', explanation: 'In CSS, font-variant-numeric: tabular-nums.' },
      { id: 'q4', prompt: 'Vertical lines between every column are usually…', options: [{ id: 'a', label: 'Noise you can remove' }, { id: 'b', label: 'Essential' }, { id: 'c', label: 'Required for accessibility' }], correct: 'a', explanation: 'Alignment and spacing make columns; light row rules are enough.' },
    ],
  },
  ladder: [
    { id: 'l1', prompt: 'What should the table be sorted by when it opens?', hint: 'What does Ramesh ji ask it every evening?', options: [{ id: 'a', label: 'Customer ID' }, { id: 'b', label: 'The question people ask most, here the amount owed or days overdue, with sorting on the headers' }, { id: 'c', label: 'Randomly' }, { id: 'd', label: 'Date added' }], correct: 'b', explanation: 'The default sort answers the main question without a tap.' },
    { id: 'l2', prompt: 'A table has 12 columns and the phone shows 3. What’s the best move?', hint: 'What does each row need on the go?', options: [{ id: 'a', label: 'Shrink the text to fit all 12' }, { id: 'b', label: 'Turn each row into a card with the two or three values people need, and put the rest in a detail view' }, { id: 'c', label: 'Make the user rotate the phone' }, { id: 'd', label: 'Hide the table on phones' }], correct: 'b', explanation: 'Pick what matters for the phone’s job, and let detail be one tap away.' },
    { id: 'l3', prompt: 'Should an empty “Last paid” cell be blank or show a dash?', hint: 'Is a blank a mistake or a fact?', options: [{ id: 'a', label: 'Blank' }, { id: 'b', label: 'A dash or “Never”, so it reads as a fact, not missing data' }, { id: 'c', label: 'Zero' }, { id: 'd', label: 'N/A in red' }], correct: 'b', explanation: 'An explicit empty value is clearer than a gap.' },
    { id: 'l4', prompt: 'Why keep the header row visible while scrolling a long ledger?', hint: 'Row 38 of 40.', options: [{ id: 'a', label: 'It looks modern' }, { id: 'b', label: 'So people still know which column is which deep in the list' }, { id: 'c', label: 'To hide rows' }, { id: 'd', label: 'Screen readers need it' }], correct: 'b', explanation: 'A sticky header keeps the meaning of every number in view.' },
    { id: 'l5', prompt: 'Zebra stripes or light row lines: which is right?', hint: 'What job do they do?', options: [{ id: 'a', label: 'Zebra stripes, always' }, { id: 'b', label: 'Either can help the eye follow a wide row; pick one, keep it light, and don’t add boxes too' }, { id: 'c', label: 'Neither, ever' }, { id: 'd', label: 'Both together' }], correct: 'b', explanation: 'Both guide the eye across a row. Use one, quietly.' },
  ],
};
