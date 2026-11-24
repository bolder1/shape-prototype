// Episodes for chapter ia.3 · Wireframing. Drafts by Claude, for review.
// One project runs through the chapter: Zoya, the designer at Khelo (an app for booking football and cricket turfs
// in Bengaluru), wireframes the booking flow: first at the right fidelity, then on a grid, then from a pattern library.
import type { Episode } from '../episode';

export const ia3_1: Episode = {
  lessonId: 'ia.3-1',
  hook: 'Zoya’s first draft looks finished, and the whole review is about the shade of green. Watch an uglier draft get better feedback.',
  scene: {
    id: 'stay-ugly', duration: 34,
    beats: [
      { at: 0, title: 'A draft that looks done', body: 'Zoya’s first turf list for Khelo: brand gradient, sunset photos, a glossy Book button. The text is “Lorem ipsum” and “₹XXX”, to be filled in later.' },
      { at: 5, title: 'Feedback on the paint', body: '“Can the green be brighter?” “That photo is the wrong turf.” “The button shadow looks dated.” Twenty minutes, all on looks.' },
      { at: 11, title: 'And nothing on the list', body: 'Nobody can judge the cards. Is ₹XXX per hour or per person? Does a real turf name even fit?' },
      { at: 16, title: 'Strip the paint', body: 'The logo, photos and button turn into grey boxes. One plain font, no colour.' },
      { at: 21, title: 'Make the words real', body: '“Smash Arena, HSR Layout Sector 2”, “₹1,200 / hour”, “Football · Cricket · Pickleball”. Now the title needs two lines.' },
      { at: 26, title: 'Now they talk structure', body: '“Where do I pick a time?” “Can I filter to 5-a-side?” The review is finally about what the wireframe is for.' },
      { at: 30, title: 'Ugly looks, real words', body: 'Keep the polish low and the content real until the structure stops changing.' },
    ],
  },
  check: [
    { id: 'c1', prompt: 'Why was the first review all about looks?', options: [{ id: 'a', label: 'The draft showed colour, photos and polish, so that’s what people reacted to' }, { id: 'b', label: 'The stakeholders don’t care about structure' }, { id: 'c', label: 'The green really was wrong' }],
      correct: 'a', explanation: 'People give feedback on what they can see. Polish invites comments on polish.' },
    { id: 'c2', prompt: 'What did Zoya keep detailed in the second draft?', options: [{ id: 'a', label: 'The colours' }, { id: 'b', label: 'The content: real names, prices and sports' }, { id: 'c', label: 'The photos' }],
      correct: 'b', explanation: 'Real content tests whether the structure holds. Placeholder text hides that.' },
  ],
  game: {
    id: 'fidelity-tidy', title: 'Plainer or realer?',
    instructions: 'Zoya’s draft of the Khelo turf list mixes polish with placeholders. For each part, make it plainer, make it realer, or leave it. The wireframe redraws as you go.',
    lanes: [
      { id: 'plain', label: 'Make it plainer', hint: 'Polish that will pull the review towards looks' },
      { id: 'real', label: 'Make it realer', hint: 'Placeholder that hides what the layout must hold' },
      { id: 'fine', label: 'Leave it', hint: 'Already plain looks and real words' },
    ],
    cards: [
      { id: 'g1', label: 'The Khelo logo in a green-to-yellow gradient, top left', visual: 'logo', lane: 'plain', note: 'A grey box marked “Logo” keeps its place. The real logo arrives with the visual design.' },
      { id: 'g2', label: 'The sport tabs read “Tab 1 · Tab 2 · Tab 3”', visual: 'tabs', lane: 'real', note: '“Football · Cricket · Pickleball”. Now you can see whether three sports fit, and whether a fourth would.' },
      { id: 'g3', label: 'A plain search box that reads “Search turfs in HSR Layout”', visual: 'search', lane: 'fine', note: 'Real words, plain looks. It’s already a good wireframe.' },
      { id: 'g4', label: 'A sunset photo of the turf on every card', visual: 'photo', lane: 'plain', note: 'A grey box with a cross. It still shows how much room the photo takes, and nobody can argue about the sunset.' },
      { id: 'g5', label: 'Every card’s title is “Lorem ipsum dolor”', visual: 'name', lane: 'real', note: '“Smash Arena, HSR Layout Sector 2”. Real names are long, and now you can see the title needs two lines.' },
      { id: 'g6', label: 'The rating reads “4.6 · 212 reviews” in plain text', visual: 'rating', lane: 'fine', note: 'Real numbers and no stars to style. Leave it as it is.' },
      { id: 'g7', label: 'The price shows as “₹XXX”', visual: 'price', lane: 'real', note: '“₹1,200 / hour”. The placeholder hid the first question everyone asks: per hour, or per person?' },
      { id: 'g8', label: 'A glossy green Book button with a drop shadow', visual: 'button', lane: 'plain', note: 'An outlined box that says “Book a slot”. Keep the words, lose the gloss.' },
    ],
  },
  gap: {
    id: 'gap', from: 5, at: 15.4,
    prompt: 'The review is stuck on the shade of green, and nobody can judge the list. What should Zoya do next?',
    options: [{ id: 'a', label: 'Try three brighter greens' }, { id: 'b', label: 'Strip the colour and photos to grey, and put real names and prices in' }, { id: 'c', label: 'Cancel reviews until the design is final' }],
    correct: 'b', explanation: 'Lower the polish so people stop reacting to it, and raise the content so they can judge the structure.',
  },
  takeaways: [
    { title: 'People react to what they see', body: 'Show colour and photos and you get feedback on colour and photos.' },
    { title: 'Plain looks', body: 'Grey boxes for images, one font, no brand colour, no shadows.' },
    { title: 'Real words', body: 'Real names, prices and labels test whether the layout holds. “Lorem ipsum” tests nothing.' },
    { title: 'Polish last', body: 'Raise the visual fidelity once the structure stops changing between reviews.' },
  ],
  quiz: {
    seconds: 12,
    questions: [
      { id: 'q1', prompt: 'In a wireframe, a turf photo should be…', options: [{ id: 'a', label: 'A grey box with a cross' }, { id: 'b', label: 'The best photo you have' }], correct: 'a', explanation: 'It holds the space without drawing comments.' },
      { id: 'q2', prompt: '“₹XXX” in a wireframe…', options: [{ id: 'a', label: 'Is fine until hi-fi' }, { id: 'b', label: 'Hides whether the price is per hour or per person' }, { id: 'c', label: 'Looks more professional' }], correct: 'b', explanation: 'Real content is part of the structure.' },
      { id: 'q3', prompt: 'A polished first draft tends to get feedback on…', options: [{ id: 'a', label: 'Structure' }, { id: 'b', label: 'Colours and pictures' }, { id: 'c', label: 'Nothing' }], correct: 'b', explanation: 'People respond to what stands out.' },
      { id: 'q4', prompt: 'Move to high fidelity when…', options: [{ id: 'a', label: 'The structure has stopped changing' }, { id: 'b', label: 'The first review is booked' }, { id: 'c', label: 'The wireframe looks boring' }], correct: 'a', explanation: 'Polish is costly to throw away.' },
    ],
  },
  ladder: [
    { id: 'l1', prompt: 'Why keep wireframes in one plain font?', hint: 'What would people comment on?', options: [{ id: 'a', label: 'Fonts are expensive' }, { id: 'b', label: 'So type choices don’t pull the review away from structure' }, { id: 'c', label: 'Plain fonts load faster' }, { id: 'd', label: 'It’s a rule of Figma' }], correct: 'b', explanation: 'Every visual choice you show is one more thing to debate.' },
    { id: 'l2', prompt: 'Why do real turf names matter in a wireframe?', hint: 'Real names are long.', options: [{ id: 'a', label: 'They don’t' }, { id: 'b', label: 'To please the turf owners' }, { id: 'c', label: 'They show whether the card can hold long titles, which can change the layout' }, { id: 'd', label: 'For search engines' }], correct: 'c', explanation: '“Lorem ipsum” is always the length you hoped for. Real content isn’t.' },
    { id: 'l3', prompt: 'One stakeholder can’t picture the product from grey boxes. What helps?', hint: 'Don’t repaint everything.', options: [{ id: 'a', label: 'Make the whole flow high fidelity' }, { id: 'b', label: 'Show one polished screen beside the wireframes as a look-and-feel sample, and keep reviewing structure on the grey ones' }, { id: 'c', label: 'Stop inviting them' }, { id: 'd', label: 'Add photos back in' }], correct: 'b', explanation: 'A single mood sample answers “what will it look like?” without turning every review into a paint review.' },
    { id: 'l4', prompt: 'Which detail belongs in a wireframe even though it isn’t visual polish?', hint: 'It changes what’s on screen.', options: [{ id: 'a', label: 'The brand gradient' }, { id: 'b', label: 'What a booked slot looks like versus a free one' }, { id: 'c', label: 'The final icon set' }, { id: 'd', label: 'Drop shadows' }], correct: 'b', explanation: 'States are structure: people need to see which slots they can tap.' },
    { id: 'l5', prompt: 'Your wireframe gets “looks great!” and nothing else. What’s likely wrong?', hint: 'What were they looking at?', options: [{ id: 'a', label: 'Nothing, it’s done' }, { id: 'b', label: 'It looked too finished, so people judged it as finished; ask about a specific task instead' }, { id: 'c', label: 'The reviewers were tired' }, { id: 'd', label: 'It needs more colour' }], correct: 'b', explanation: 'Polish signals “decided”. Rough work and a task-based question, like “where would you pick a time?”, invite real feedback.' },
  ],
};

export const ia3_2: Episode = {
  lessonId: 'ia.3-2',
  hook: 'Every box on Zoya’s turf page is a few pixels off from the next. Watch a 12-column grid pull it into line, then fold it onto a phone.',
  scene: {
    id: 'wire-grid', duration: 34,
    beats: [
      { at: 0, title: 'Boxes by eye', body: 'The desktop page for one turf, drawn by eye. No two left edges line up, and the gaps are all different.' },
      { at: 6, title: 'Lay the grid first', body: 'Twelve columns, 24 px gutters, 80 px margins. Now every edge has somewhere to go.' },
      { at: 11, title: 'Snap to the columns', body: 'Every block starts and ends on a column edge. Nothing sits in a gutter.' },
      { at: 17, title: 'Width shows weight', body: 'The slot picker, the task, takes columns 1–8. The price summary takes 9–12, beside it, in view.' },
      { at: 22, title: 'Break it on purpose', body: 'One block breaks out: the turf photo runs edge to edge, past the margins.' },
      { at: 26, title: 'Fold to the phone', body: 'Four columns, 16 px margins. Every block spans all four, and the side column stacks under the main one.' },
      { at: 31, title: 'One grid for the flow', body: 'Same grid on all five screens, so they read as one product.' },
    ],
  },
  check: [
    { id: 'c1', prompt: 'What should you set before drawing any boxes?', options: [{ id: 'a', label: 'The colours' }, { id: 'b', label: 'The grid: columns, gutters and margins' }, { id: 'c', label: 'The fonts' }],
      correct: 'b', explanation: 'With the grid in place, every edge has a line to sit on.' },
    { id: 'c2', prompt: 'Why does the slot picker get eight columns and the summary four?', options: [{ id: 'a', label: 'Width shows how much each block matters to the task' }, { id: 'b', label: 'Eight is a lucky number' }, { id: 'c', label: 'It was random' }],
      correct: 'a', explanation: 'The task gets the room; supporting detail sits beside it.' },
  ],
  game: {
    id: 'grid-place', title: 'Place it on the grid',
    instructions: 'Build the desktop page for one turf on a 12-column grid. Drag each block to the area it belongs in, or tap the area. It snaps to its columns. At the end, fold the page onto a phone.',
    lanes: [
      { id: 'bleed', label: 'Edge to edge', hint: 'Breaks the margins on purpose' },
      { id: 'full', label: 'Full width · 1–12', hint: 'Runs across the content area' },
      { id: 'main', label: 'Main · 1–8', hint: 'The task and what you read for it' },
      { id: 'side', label: 'Side · 9–12', hint: 'Stays in view beside the main column' },
    ],
    cards: [
      { id: 'g1', label: 'Top bar: Khelo logo, search and your account', visual: '1', lane: 'full', note: 'It spans 1–12 inside the margins, so its edges line up with everything below it.' },
      { id: 'g2', label: 'A wide photo of the turf', visual: '2', lane: 'bleed', note: 'The one block allowed past the margins. Edge to edge says “this is the place” before any text does.' },
      { id: 'g3', label: 'Turf name, rating and address', visual: '3', lane: 'full', note: 'The heading belongs to the whole page, both columns, so it spans 1–12.' },
      { id: 'g4', label: 'Saturday’s slot picker: 14 one-hour slots', visual: '4', lane: 'main', note: 'This is the task, so it gets the widest column, 1–8.' },
      { id: 'g5', label: 'Price summary with the Book button', visual: '4', lane: 'side', note: 'Columns 9–12, right beside the slots, so the total changes in view as you pick. On a phone it stacks just under them.' },
      { id: 'g6', label: 'What’s at the turf: floodlights, changing rooms, parking', visual: '5', lane: 'main', note: 'Detail you read to decide, so it stays in the main column.' },
      { id: 'g7', label: 'A small map with directions', visual: '5', lane: 'side', note: 'Useful, but not the task. Four columns is plenty.' },
      { id: 'g8', label: 'Players’ reviews', visual: '6', lane: 'main', note: 'Long reading, so it gets a comfortable line length in the main column.' },
      { id: 'g9', label: 'Footer: help, terms and contact', visual: '7', lane: 'full', note: 'Spans the content area like the top bar, closing the page on the same edges.' },
    ],
  },
  gap: {
    id: 'gap', from: 0, at: 5.6,
    prompt: 'No two edges on Zoya’s page line up. What should she do first?',
    options: [{ id: 'a', label: 'Nudge each box by eye until it looks right' }, { id: 'b', label: 'Set a grid of columns, gutters and margins, then snap every block to it' }, { id: 'c', label: 'Add colour so nobody notices' }],
    correct: 'b', explanation: 'Nudging by eye fixes one edge and breaks another. A grid gives every edge a line to sit on.',
  },
  takeaways: [
    { title: 'Grid first', body: 'Choose columns, gutters and margins before drawing boxes: often 12 on desktop, 8 on tablet, 4 on phone.' },
    { title: 'Edges on columns', body: 'Every block starts and ends on a column edge; gutters stay empty.' },
    { title: 'Width shows weight', body: 'Give the task the widest column, and break the grid only on purpose.' },
    { title: 'One grid, every screen', body: 'Use the same grid across the flow so the screens feel like one product.' },
  ],
  quiz: {
    seconds: 12,
    questions: [
      { id: 'q1', prompt: 'A common phone grid has…', options: [{ id: 'a', label: '4 columns' }, { id: 'b', label: '12 columns' }], correct: 'a', explanation: 'Phones are narrow: 4 columns, 16 px margins is a common start.' },
      { id: 'q2', prompt: 'A block’s edge should sit…', options: [{ id: 'a', label: 'In a gutter' }, { id: 'b', label: 'On a column edge' }, { id: 'c', label: 'Wherever looks right' }], correct: 'b', explanation: 'Gutters are the space between, not a place to land.' },
      { id: 'q3', prompt: 'On desktop, the price summary beside the slots goes in…', options: [{ id: 'a', label: 'The side column' }, { id: 'b', label: 'The footer' }, { id: 'c', label: 'A new page' }], correct: 'a', explanation: 'In view while you pick.' },
      { id: 'q4', prompt: 'A full-bleed photo…', options: [{ id: 'a', label: 'Is always a mistake' }, { id: 'b', label: 'Breaks the margins on purpose' }, { id: 'c', label: 'Must span 4 columns' }], correct: 'b', explanation: 'Breaking the grid works when it’s a choice.' },
    ],
  },
  ladder: [
    { id: 'l1', prompt: 'What does a gutter do?', hint: 'It’s the space between.', options: [{ id: 'a', label: 'Holds small text' }, { id: 'b', label: 'Keeps a fixed gap between columns, so blocks side by side never touch' }, { id: 'c', label: 'Marks the page edge' }, { id: 'd', label: 'Nothing in wireframes' }], correct: 'b', explanation: 'Fixed gutters give every pair of neighbouring blocks the same gap.' },
    { id: 'l2', prompt: 'Why use the same grid on all five screens of the booking flow?', hint: 'Moving between screens.', options: [{ id: 'a', label: 'It’s faster to draw' }, { id: 'b', label: 'Content stays in the same place from screen to screen, so the flow feels like one product and nothing jumps' }, { id: 'c', label: 'Developers require it' }, { id: 'd', label: 'It doesn’t matter' }], correct: 'b', explanation: 'If the margins change between screens, the whole page seems to shift as you tap Next.' },
    { id: 'l3', prompt: 'A block spans 7.5 columns. What’s wrong?', hint: 'Where does its edge land?', options: [{ id: 'a', label: 'Nothing' }, { id: 'b', label: 'Its edge sits in the middle of a column, so it won’t line up with anything else' }, { id: 'c', label: 'It’s too wide' }, { id: 'd', label: 'It should be 7' }], correct: 'b', explanation: 'Half columns break the shared edges the grid exists to give you.' },
    { id: 'l4', prompt: 'On the phone, the desktop side column…', hint: 'Four columns only.', options: [{ id: 'a', label: 'Shrinks to one column' }, { id: 'b', label: 'Is deleted' }, { id: 'c', label: 'Stacks under the main block at full width, or becomes a sticky bar if it must stay in view' }, { id: 'd', label: 'Floats over the content' }], correct: 'c', explanation: 'One column of reading on a phone; Book often becomes a sticky bottom bar.' },
    { id: 'l5', prompt: 'Why lay a grid even in a rough wireframe?', hint: 'Developers build what you draw.', options: [{ id: 'a', label: 'It isn’t needed until hi-fi' }, { id: 'b', label: 'The layout decisions you test, and the ones developers build, are the grid; adding it later moves everything' }, { id: 'c', label: 'It makes the wireframe prettier' }, { id: 'd', label: 'Figma forces it' }], correct: 'b', explanation: 'Structure includes where things sit. A grid now saves re-laying every screen later.' },
  ],
};

export const ia3_3: Episode = {
  lessonId: 'ia.3-3',
  hook: 'Zoya spends a morning drawing a time picker from scratch. Watch a library of known patterns build all five booking screens in minutes.',
  scene: {
    id: 'pattern-library', duration: 34,
    beats: [
      { at: 0, title: 'A blank screen', body: 'Zoya draws a time picker from nothing. A wheel, then a clock face, then a slider. Each one needs explaining.' },
      { at: 6, title: 'Someone solved this', body: 'People already know a few patterns: card lists, chips, forms, bottom sheets. They don’t have to learn them again in Khelo.' },
      { at: 12, title: 'A pattern card', body: 'Each pattern is drawn once, with its name, when to use it and when not to.' },
      { at: 18, title: 'Build the flow', body: 'Find, turf, slot, players, pay: five screens put together from four patterns.' },
      { at: 24, title: 'The job picks the pattern', body: 'A dropdown hides 14 slots, so chips show them all. Three options don’t need a search box.' },
      { at: 29, title: 'Note what isn’t drawn', body: 'Short notes say what the wireframe can’t show: “Grey = booked”, “Held for 10 minutes”.' },
    ],
  },
  check: [
    { id: 'c1', prompt: 'Why start from known patterns instead of a blank screen?', options: [{ id: 'a', label: 'People already know how they work, and it saves hours' }, { id: 'b', label: 'Original ideas are banned' }, { id: 'c', label: 'Patterns look prettier' }],
      correct: 'a', explanation: 'Familiar patterns cost users nothing to learn, and cost you nothing to draw again.' },
    { id: 'c2', prompt: 'Why chips, not a dropdown, for 14 slots?', options: [{ id: 'a', label: 'Chips are newer' }, { id: 'b', label: 'Chips show every slot and which are booked at a glance' }, { id: 'c', label: 'Dropdowns can’t be wireframed' }],
      correct: 'b', explanation: 'A dropdown hides the options until you open it.' },
  ],
  game: {
    id: 'pattern-stamp', title: 'Build from the library',
    instructions: 'Each card is a job one of the five booking screens must do. Pick the pattern from the library that fits it, and it’s added to that screen. A pattern that doesn’t fit is added, shows why it’s wrong, and is taken off again.',
    lanes: [
      { id: 'cards', label: 'Card list', hint: 'Compare several options with the same details' },
      { id: 'chips', label: 'Chips', hint: 'Pick from a few choices, all visible' },
      { id: 'form', label: 'Form', hint: 'Type in details, one labelled field each' },
      { id: 'sheet', label: 'Bottom sheet', hint: 'A short side task without leaving the screen' },
    ],
    cards: [
      { id: 'g1', label: 'Compare turfs near you by price, distance and rating', visual: 'find', lane: 'cards', note: 'One card per turf, with the same details in the same places, so the eye can compare down the list.' },
      { id: 'g2', label: 'Narrow the list to 5-a-side or 7-a-side', visual: 'find', lane: 'chips', note: 'Filter chips: two or three options, all on screen, one tap each.' },
      { id: 'g3', label: 'See the three courts at this turf, each with its size and surface', visual: 'turf', lane: 'cards', note: 'Several options with the same details: a short card list.' },
      { id: 'g4', label: 'Read the cancellation policy without leaving the turf page', visual: 'turf', lane: 'sheet', note: 'A bottom sheet slides up over the page and closes back to it. The player doesn’t lose their place.' },
      { id: 'g5', label: 'Pick one of 14 one-hour slots on Saturday, with booked ones greyed out', visual: 'slot', lane: 'chips', note: 'A grid of chips shows every slot at once. Booked ones are greyed out and can’t be tapped.' },
      { id: 'g6', label: 'Pick the day: today, tomorrow or a date this week', visual: 'slot', lane: 'chips', note: 'A row of date chips. Seven days fit across a phone, and a calendar would be overkill.' },
      { id: 'g7', label: 'Enter the captain’s name and phone number', visual: 'players', lane: 'form', note: 'Two labelled fields, labels above the boxes, and the phone field opens the number pad.' },
      { id: 'g8', label: 'Add the other players’ numbers so each gets a UPI request for their share', visual: 'players', lane: 'form', note: 'A short form that repeats one field, with “Add another player” below it.' },
      { id: 'g9', label: 'Apply a promo code without losing sight of the total', visual: 'pay', lane: 'sheet', note: 'A sheet with one field and Apply. Close it and the new total is already on the page.' },
    ],
  },
  gap: {
    id: 'gap', from: 18, at: 23.6,
    prompt: 'A teammate puts Saturday’s 14 slots in a dropdown. What should Zoya say?',
    options: [{ id: 'a', label: 'Fine, it saves space' }, { id: 'b', label: 'Use chips: all 14 visible at once, with booked ones greyed out' }, { id: 'c', label: 'Use a text box for the time' }],
    correct: 'b', explanation: 'Pick the pattern for the job. Scanning for a free slot needs every slot on view.',
  },
  takeaways: [
    { title: 'Start from patterns', body: 'Card lists, chips, forms and bottom sheets are already familiar. Users don’t have to learn them.' },
    { title: 'Keep a library', body: 'Draw each pattern once, with its name, when to use it and when not to.' },
    { title: 'Fit the job', body: 'Choose the pattern for what the person is doing, not the one you used last time.' },
    { title: 'Write what isn’t drawn', body: 'Short notes explain states and rules the wireframe can’t show.' },
  ],
  quiz: {
    seconds: 12,
    questions: [
      { id: 'q1', prompt: 'To compare turfs by price and distance, use…', options: [{ id: 'a', label: 'A card list' }, { id: 'b', label: 'A bottom sheet' }], correct: 'a', explanation: 'The same details, card after card.' },
      { id: 'q2', prompt: 'A promo code at checkout fits…', options: [{ id: 'a', label: 'A new page' }, { id: 'b', label: 'A bottom sheet' }, { id: 'c', label: 'Chips' }], correct: 'b', explanation: 'A short side task that keeps the total in place.' },
      { id: 'q3', prompt: 'Picking one of three sports fits…', options: [{ id: 'a', label: 'Chips' }, { id: 'b', label: 'A search box' }, { id: 'c', label: 'A form' }], correct: 'a', explanation: 'A few options, all visible.' },
      { id: 'q4', prompt: 'A pattern library entry should include…', options: [{ id: 'a', label: 'Only the drawing' }, { id: 'b', label: 'Name, drawing, when to use and when not to' }, { id: 'c', label: 'Final colours' }], correct: 'b', explanation: 'The when-not-to stops it being used out of habit.' },
    ],
  },
  ladder: [
    { id: 'l1', prompt: 'When does a bottom sheet suit a task?', hint: 'Short, and on the side.', options: [{ id: 'a', label: 'For the main task of the app' }, { id: 'b', label: 'For a short side task where people should keep their place underneath' }, { id: 'c', label: 'For long forms' }, { id: 'd', label: 'Never on mobile' }], correct: 'b', explanation: 'Long tasks in a sheet feel cramped. Short ones keep the context behind.' },
    { id: 'l2', prompt: 'Your library has a card list and a table. A turf owner needs to see 60 bookings a week, sorted by time. Which one?', hint: 'Many rows, compared column by column.', options: [{ id: 'a', label: 'Card list' }, { id: 'b', label: 'Table: many rows with the same columns, easy to sort and scan' }, { id: 'c', label: 'Chips' }, { id: 'd', label: 'Bottom sheet' }], correct: 'b', explanation: 'Cards suit a few rich options. Tables suit many rows of the same data.' },
    { id: 'l3', prompt: 'What does an annotation on a wireframe add?', hint: 'What can’t a grey box say?', options: [{ id: 'a', label: 'Decoration' }, { id: 'b', label: 'Rules and states the drawing can’t show, like “held for 10 minutes”' }, { id: 'c', label: 'Colour names' }, { id: 'd', label: 'The designer’s name' }], correct: 'b', explanation: 'A short note saves a meeting about what happens when.' },
    { id: 'l4', prompt: 'Why copy a familiar pattern instead of inventing a new date picker?', hint: 'Jakob’s Law.', options: [{ id: 'a', label: 'Copying is always better' }, { id: 'b', label: 'People spend most of their time in other apps, so they expect yours to work the same way' }, { id: 'c', label: 'New patterns can’t be built' }, { id: 'd', label: 'It looks more modern' }], correct: 'b', explanation: 'Invent only where a familiar pattern truly fails the job.' },
    { id: 'l5', prompt: 'The same pattern is drawn three slightly different ways across your screens. What’s the fix?', hint: 'One source.', options: [{ id: 'a', label: 'Leave it: it’s only a wireframe' }, { id: 'b', label: 'Make it one library component and use instances of it everywhere' }, { id: 'c', label: 'Pick the prettiest' }, { id: 'd', label: 'Redraw it a fourth way' }], correct: 'b', explanation: 'One component, many instances: change it once, and every screen updates.' },
  ],
};
