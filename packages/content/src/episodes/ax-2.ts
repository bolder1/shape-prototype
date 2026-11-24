// Episodes for chapter ax.2 · Accessible interaction. Drafts by Claude, for review.
// Rahi (raahi is Hindi for traveller) is a Pune app for booking intercity buses: pick a date, a seat and a boarding
// point, then pay by UPI. Meera is its product designer and Arjun its front-end developer. Kabir has a tremor and uses
// only the keyboard; Farhan is blind and uses NVDA on his laptop and TalkBack on his phone; both are booking the
// ₹1,280 overnight sleeper to Goa. Sunita Kulkarni, 67, books a ₹640 seat to Kolhapur. ax.1 covered who disability
// affects, POUR, contrast and target sizes with visible focus; this chapter is about how people actually operate the
// interface: by keyboard, by ear, through forms, and with a memory that doesn't hold everything.
import type { Episode } from '../episode';

export const ax2_1: Episode = {
  lessonId: 'ax.2-1',
  hook: 'Kabir books buses with only a keyboard. On Rahi’s seat map, Tab skipped every seat. After Arjun’s fix, it took 61 presses to reach Pay.',
  scene: {
    id: 'keyboard-flow', duration: 36,
    beats: [
      { at: 0, title: 'Tab skips the seats', body: 'Kabir has a tremor and books with the keyboard. On Rahi, Tab jumps from the date chips straight to Pay. The 36 seats are divs with click handlers, so no key can reach them (2.1.1 Keyboard).' },
      { at: 6, title: '61 presses to Pay', body: 'Arjun adds tabindex="0" to everything that looks clickable: every seat, every date, the hidden mobile menu, even the bus illustration. Now Kabir can reach seat 12, after 61 presses to get to Pay.' },
      { at: 12, title: 'One stop, arrows inside', body: 'Meera makes the seat map one Tab stop. Inside it, the arrow keys move from seat to seat and Space picks one: a roving tabindex. The date chips become a radio group that works the same way.' },
      { at: 18, title: 'Skip the header', body: 'A “Skip to seats” link is the first thing Tab reaches. It appears when focused, and one Enter jumps past the header links (2.4.1 Bypass Blocks).' },
      { at: 24, title: 'Order follows the page', body: 'Tab goes through the page in reading order, because the code is in reading order (2.4.3 Focus Order). The closed menu and the illustration take no stops. Pay is now 10 presses away.' },
      { at: 30, title: 'Dialogs hold focus, then give it back', body: 'The boarding point dialog moves focus in, keeps Tab inside, closes on Esc, and puts focus back on the button that opened it. Never a dead end (2.1.2 No Keyboard Trap).' },
      { at: 33, title: 'Draw the path', body: 'Meera adds the focus order and the arrow-key groups to the design file, so the next screen is built right the first time.' },
    ],
  },
  check: [
    { id: 'c1', prompt: 'Why couldn’t Kabir pick a seat at first?', options: [{ id: 'a', label: 'The seats were too small' }, { id: 'b', label: 'The seats were divs with click handlers, so the keyboard couldn’t reach them' }, { id: 'c', label: 'The focus ring was hidden' }],
      correct: 'b', explanation: 'A click handler isn’t keyboard support. Native buttons, or proper keyboard handling, are.' },
    { id: 'c2', prompt: 'How did Meera cut 61 presses to 10?', options: [{ id: 'a', label: 'One Tab stop per group of seats and dates, arrow keys inside, and nothing hidden taking focus' }, { id: 'b', label: 'Removing seats' }, { id: 'c', label: 'Setting tabindex="1" on Pay' }],
      correct: 'a', explanation: 'Groups of similar choices are one stop; separate actions get their own.' },
  ],
  game: {
    id: 'focus-path', title: 'Plan the Tab path',
    instructions: 'Each card is a part of Rahi’s seat page, top to bottom. Decide how the keyboard reaches it. The page counts how many Tab presses Kabir needs to get to Pay.',
    lanes: [
      { id: 'tab', label: 'Its own Tab stops', hint: 'Each item is a separate action' },
      { id: 'arrows', label: 'One stop, arrows inside', hint: 'A group of similar choices' },
      { id: 'none', label: 'Not focusable', hint: 'Can’t be operated, or isn’t on screen' },
    ],
    cards: [
      { id: 'g1', label: 'A “Skip to seats” link, first on the page', lane: 'tab', visual: 'skip', note: 'One stop that saves six presses. It can stay hidden until it’s focused, but it must appear then, so a sighted keyboard user knows where they are.' },
      { id: 'g2', label: 'Five header links: Home, Bookings, Offers, Help, Account', lane: 'tab', visual: 'nav', note: 'Five different destinations, so five stops. This is why the skip link exists: on every page, they come first.' },
      { id: 'g3', label: 'The mobile menu’s six links, while the menu is closed', lane: 'none', visual: 'menu', note: 'Invisible but focusable is the worst of both: focus vanishes for six presses. Closed menus get display: none or the inert attribute.' },
      { id: 'g4', label: 'Seven date chips, Mon 14 to Sun 20', lane: 'arrows', visual: 'dates', note: 'One choice out of seven, like a radio group: Tab lands on the chosen day, and the arrows change it.' },
      { id: 'g5', label: 'The bus illustration beside the dates', lane: 'none', visual: 'art', note: 'Arjun gave it tabindex="0" because it looked clickable. Nothing happens when you press it, so it shouldn’t take focus. Decorative, and hidden from screen readers too.' },
      { id: 'g6', label: 'The 36 seats in the seat map', lane: 'arrows', visual: 'seats', note: 'A grid: Tab in, the arrow keys move across rows and down columns, Space or Enter picks a seat, and Tab leaves. 36 stops become 1.' },
      { id: 'g7', label: 'The seat legend: Available, Booked, Ladies', lane: 'none', visual: 'legend', note: 'Text that explains the map. Screen readers read it in the flow; it isn’t a control, so it gets no Tab stop.' },
      { id: 'g8', label: 'The boarding point button', lane: 'tab', visual: 'boarding', note: 'It opens a dialog. Its own stop, and the place focus returns to when the dialog closes.' },
      { id: 'g9', label: 'The fare breakdown: ₹1,180 + ₹100 GST and fees', lane: 'none', visual: 'fare', note: 'Plain text. Making text focusable to “help screen readers” actually adds noise: they read text without it.' },
      { id: 'g10', label: 'The Pay ₹1,280 button', lane: 'tab', visual: 'pay', note: 'The goal of the page. Reached in reading order, after everything it depends on, without any tabindex number.' },
    ],
  },
  gap: {
    id: 'gap', from: 6, at: 11.4,
    prompt: 'Every seat is now a Tab stop: 61 presses to reach Pay. What should Meera do?',
    options: [{ id: 'a', label: 'Give Pay tabindex="1" so it comes first' }, { id: 'b', label: 'Make the seat map and the dates one Tab stop each, with arrow keys inside, and take focus off things that do nothing' }, { id: 'c', label: 'Tell keyboard users to use the mouse for seats' }],
    correct: 'b', explanation: 'A positive tabindex breaks the order for everything else. Fewer, better stops fix it.',
  },
  takeaways: [
    { title: 'Everything by keyboard', body: 'If a mouse can do it, a key must too (2.1.1). Native buttons and links get this for free.' },
    { title: 'One stop per group', body: 'Seats, dates, tabs and toolbars: Tab in, arrows inside, Tab out.' },
    { title: 'Order is the source', body: 'Tab follows the code. Keep it in reading order and never use a positive tabindex.' },
    { title: 'In, around, back', body: 'Dialogs take focus in, keep it, close on Esc and return it to where it came from.' },
  ],
  quiz: {
    seconds: 12,
    questions: [
      { id: 'q1', prompt: 'A closed mobile menu’s links should be…', options: [{ id: 'a', label: 'Not focusable' }, { id: 'b', label: 'Tab stops' }], correct: 'a', explanation: 'Hidden things take no focus.' },
      { id: 'q2', prompt: 'Inside a seat map with one Tab stop, which keys move between seats?', options: [{ id: 'a', label: 'Tab and Shift+Tab' }, { id: 'b', label: 'The arrow keys' }, { id: 'c', label: 'Esc' }], correct: 'b', explanation: 'Tab moves between groups; arrows move inside one.' },
      { id: 'q3', prompt: 'What does a skip link meet?', options: [{ id: 'a', label: '1.4.3 Contrast' }, { id: 'b', label: '2.5.8 Target Size' }, { id: 'c', label: '3.3.1 Error Identification' }, { id: 'd', label: '2.4.1 Bypass Blocks' }], correct: 'd', explanation: 'It lets keyboard users jump past repeated blocks.' },
      { id: 'q4', prompt: 'A dialog closes. Focus should go…', options: [{ id: 'a', label: 'To the top of the page' }, { id: 'b', label: 'Nowhere' }, { id: 'c', label: 'Back to what opened it' }, { id: 'd', label: 'To the footer' }], correct: 'c', explanation: 'So people carry on from where they were.' },
    ],
  },
  ladder: [
    { id: 'l1', prompt: 'What’s wrong with tabindex="5" on the Pay button?', hint: 'Positive numbers.', options: [{ id: 'a', label: 'Nothing; it makes Pay easier to reach' }, { id: 'b', label: 'Positive tabindex values jump ahead of the whole page, so focus order no longer matches reading order' }, { id: 'c', label: 'It should be tabindex="-1"' }, { id: 'd', label: 'Buttons can’t take tabindex' }], correct: 'b', explanation: 'Use 0 to add something to the natural order, −1 to focus it from code only, and never a positive number.' },
    { id: 'l2', prompt: 'In a roving tabindex, what tabindex do the seats have?', hint: 'One of them is reachable.', options: [{ id: 'a', label: 'All 0' }, { id: 'b', label: 'All −1' }, { id: 'c', label: 'The current seat 0, the others −1, updated as the arrows move' }, { id: 'd', label: 'Numbered 1 to 36' }], correct: 'c', explanation: 'Only one item in the group is in the Tab order at a time.' },
    { id: 'l3', prompt: 'A modal dialog is open. What does keeping focus inside it mean?', hint: 'And what it doesn’t mean.', options: [{ id: 'a', label: 'Tab cycles through the dialog’s controls, the page behind is inert, and Esc still closes it' }, { id: 'b', label: 'Nothing can close it but the mouse' }, { id: 'c', label: 'Focus goes back to the page after the last button' }, { id: 'd', label: 'The dialog takes no focus at all' }], correct: 'a', explanation: 'Containing focus in a modal is right; trapping someone with no way out fails 2.1.2.' },
    { id: 'l4', prompt: 'Arjun’s custom date chip is a <div role="radio">. What else does he have to build by hand?', hint: 'A native element gives these free.', options: [{ id: 'a', label: 'Nothing' }, { id: 'b', label: 'Only the colour' }, { id: 'c', label: 'Focus with tabindex, arrow-key and Space handling, and aria-checked kept in sync' }, { id: 'd', label: 'An alt attribute' }], correct: 'c', explanation: 'ARIA changes what’s announced, not how it behaves. A role is a promise you then have to keep in code.' },
    { id: 'l5', prompt: 'How do you hand off a keyboard flow so it gets built right?', hint: 'In the design file.', options: [{ id: 'a', label: 'Say “make it accessible” in the ticket' }, { id: 'b', label: 'Numbered focus order on the screen, which groups use arrow keys, where focus goes when dialogs open and close, and the skip link' }, { id: 'c', label: 'Only the visual focus ring style' }, { id: 'd', label: 'Let the developer decide after launch' }], correct: 'b', explanation: 'That’s the start of the boss: annotations a developer can build from.' },
  ],
};

export const ax2_2: Episode = {
  lessonId: 'ax.2-2',
  hook: 'Farhan is blind. On Rahi’s search screen his screen reader said “button”, “button”, then nothing at all.',
  scene: {
    id: 'sr-semantics', duration: 36,
    beats: [
      { at: 0, title: '“Button. Button.”', body: 'Farhan books with NVDA on his laptop. He tabs through Rahi’s search: “Pune, edit”, then silence where the swap icon is, then “button”. Which button? He can’t tell.' },
      { at: 6, title: 'Name, role, state', body: 'A screen reader can’t see the design. It reads what the code says about each control: its name, its role and its state. WCAG 4.1.2 Name, Role, Value asks for all three.' },
      { at: 12, title: 'Native first', body: 'The swap icon is a div with a click handler: no role, no focus, no Enter key. Arjun swaps it for a <button>, which comes with all three. That’s the first rule of ARIA: use the HTML element if there is one.' },
      { at: 18, title: 'Name the icons', body: 'The magnifier gets aria-label="Search buses". The operator’s logo gets alt="Konkan Travels". The sunset photo gets alt="", so NVDA skips it (1.1.1 Non-text Content).' },
      { at: 24, title: 'Say the state', body: 'The AC switch only changed colour. Now aria-checked says on or off. “Sort” says collapsed or expanded, and booked seats say unavailable.' },
      { at: 30, title: 'Headings to jump', body: '“Choose your seat” was just bold text. As an <h2>, Farhan presses H and jumps straight to it, the way sighted people skim (1.3.1 Info and Relationships).' },
      { at: 33, title: 'What he hears now', body: '“Search buses, button.” “AC buses only, switch, off.” “Seat 14, window, button, unavailable.” Same screen, finally readable.' },
    ],
  },
  check: [
    { id: 'c1', prompt: 'What three things does a screen reader need from every control?', options: [{ id: 'a', label: 'Colour, size and position' }, { id: 'b', label: 'Its name, its role and its state' }, { id: 'c', label: 'A tooltip, an icon and a label' }],
      correct: 'b', explanation: 'What it’s called, what it is, and what condition it’s in.' },
    { id: 'c2', prompt: 'Why did Arjun replace the swap div with a <button>?', options: [{ id: 'a', label: 'It looks better' }, { id: 'b', label: 'A native button brings its role, focus and keyboard support; a div brings none' }, { id: 'c', label: 'Divs can’t have icons' }],
      correct: 'b', explanation: 'Native first; ARIA only for what HTML can’t do.' },
  ],
  game: {
    id: 'sr-listen', title: 'Listen to the screen',
    instructions: 'Each card is a control on Rahi, with what a screen reader says when Farhan reaches it. Decide what it fails to tell him: its role, its name, its state, or nothing. Then hear the fix.',
    lanes: [
      { id: 'role', label: 'Role', hint: 'Not the element it acts like' },
      { id: 'name', label: 'Name', hint: 'Nothing to call it' },
      { id: 'state', label: 'State', hint: 'A change it can’t hear' },
      { id: 'ok', label: 'Says it all', hint: 'Name, role and any state' },
    ],
    cards: [
      { id: 'g1', label: 'The ⇄ icon that swaps From and To', lane: 'role', visual: 'swap', note: 'A div with a click handler: NVDA says nothing, and Tab can’t even reach it. A <button> fixes the role and the focus; aria-label gives it a name.' },
      { id: 'g2', label: 'The magnifier button that runs the search', lane: 'name', visual: 'search', note: 'A real button with nothing inside but an SVG, so NVDA says only “button”. aria-label="Search buses", and aria-hidden on the icon.' },
      { id: 'g3', label: '“Choose your seat”, in big bold type', lane: 'role', visual: 'heading', note: 'It looks like a heading but it’s a div, so Farhan can’t jump to it. An <h2> joins the page outline that screen reader users navigate by.' },
      { id: 'g4', label: 'The “AC buses only” switch', lane: 'state', visual: 'ac', note: 'It turned teal when on, and that was all. aria-checked="true" or "false" makes NVDA say on or off, and announces the change when he presses it.' },
      { id: 'g5', label: 'The bus operator’s logo on a result', lane: 'name', visual: 'logo', note: 'No alt, so NVDA says “graphic” or reads the file name, op_2231.png. The logo is the only place the operator’s name appears, so alt="Konkan Travels".' },
      { id: 'g6', label: 'A decorative photo of the bus at sunset', lane: 'ok', visual: 'photo', note: 'alt="" is right here: it tells NVDA to skip an image that adds nothing. Silence can be correct.' },
      { id: 'g7', label: '“Fare rules”, which opens a dialog', lane: 'role', visual: 'rules', note: 'A link promises to go somewhere; this opens a dialog on the same page. People choose links and buttons differently, so it should say “button”.' },
      { id: 'g8', label: 'The “Sort: Departure” menu button', lane: 'state', visual: 'sort', note: 'Nothing says it opens a menu or whether the menu is open. aria-expanded="false" makes it “collapsed”, and “expanded” once open.' },
      { id: 'g9', label: 'Seat 14, greyed out because it’s booked', lane: 'state', visual: 'booked', note: 'Grey means booked only to people who can see grey. aria-disabled="true" makes NVDA say “unavailable”, and the seat can still be focused and explained.' },
      { id: 'g10', label: 'The boarding point dropdown', lane: 'ok', visual: 'boarding', note: 'A native <select> with a <label for>: name, role and value, without a single ARIA attribute.' },
      { id: 'g11', label: 'The Pay button', lane: 'ok', visual: 'pay', note: 'A <button> whose text is its name. “Pay ₹1,280, button” is everything he needs.' },
    ],
  },
  gap: {
    id: 'gap', from: 6, at: 11.4,
    prompt: 'The swap icon is a div with a click handler, and NVDA says nothing on it. What’s the best fix?',
    options: [{ id: 'a', label: 'Add role="button" to the div' }, { id: 'b', label: 'Use a <button> with aria-label="Swap From and To"' }, { id: 'c', label: 'Add a tooltip that says Swap' }],
    correct: 'b', explanation: 'role="button" alone still leaves focus and Enter and Space to build by hand. The native button has them, and the label gives it a name.',
  },
  takeaways: [
    { title: 'Name, role, state', body: 'Every control says what it’s called, what it is, and what condition it’s in (4.1.2).' },
    { title: 'Native first', body: 'A <button> or <select> is accessible for free. ARIA is a promise you must keep in code.' },
    { title: 'Name every icon', body: 'aria-label for icon buttons, alt for meaningful images, alt="" for decoration.' },
    { title: 'Structure is navigation', body: 'Real headings and landmarks let screen reader users skim the way sighted people do.' },
  ],
  quiz: {
    seconds: 12,
    questions: [
      { id: 'q1', prompt: 'A decorative image should have…', options: [{ id: 'a', label: 'alt=""' }, { id: 'b', label: 'No alt attribute' }], correct: 'a', explanation: 'Empty alt says “skip me”; a missing alt can mean the file name gets read.' },
      { id: 'q2', prompt: 'NVDA says just “button”. What’s missing?', options: [{ id: 'a', label: 'The role' }, { id: 'b', label: 'The state' }, { id: 'c', label: 'The name' }], correct: 'c', explanation: 'It knows what it is, not what it’s called.' },
      { id: 'q3', prompt: 'Which attribute says whether a menu is open?', options: [{ id: 'a', label: 'aria-checked' }, { id: 'b', label: 'aria-expanded' }, { id: 'c', label: 'aria-hidden' }, { id: 'd', label: 'aria-label' }], correct: 'b', explanation: 'Collapsed or expanded.' },
      { id: 'q4', prompt: 'Which success criterion asks for name, role and value?', options: [{ id: 'a', label: '1.4.3' }, { id: 'b', label: '2.4.7' }, { id: 'c', label: '3.3.2' }, { id: 'd', label: '4.1.2' }], correct: 'd', explanation: '4.1.2 Name, Role, Value, under Robust.' },
    ],
  },
  ladder: [
    { id: 'l1', prompt: 'What is the first rule of ARIA?', hint: 'Before reaching for any attribute.', options: [{ id: 'a', label: 'Add ARIA to every element' }, { id: 'b', label: 'If a native HTML element or attribute already does the job, use it instead of ARIA' }, { id: 'c', label: 'Always use aria-label' }, { id: 'd', label: 'ARIA replaces HTML' }], correct: 'b', explanation: 'Native elements bring behaviour; ARIA only changes what’s announced.' },
    { id: 'l2', prompt: 'A button shows the text “Book” but has aria-label="Confirm". Why is that a problem?', hint: 'People who use voice control.', options: [{ id: 'a', label: 'It isn’t' }, { id: 'b', label: 'Voice control users say “click Book”, but its name is Confirm, so nothing happens (2.5.3 Label in Name)' }, { id: 'c', label: 'aria-label is too long' }, { id: 'd', label: 'It makes the button smaller' }], correct: 'b', explanation: 'The accessible name should contain the visible text.' },
    { id: 'l3', prompt: 'Seats fill up while Farhan is on the page. How should he hear “Only 2 seats left”?', hint: 'He’s focused somewhere else.', options: [{ id: 'a', label: 'Move focus to the message' }, { id: 'b', label: 'Put it in a polite live region (role="status") so it’s announced without moving his focus' }, { id: 'c', label: 'Change its colour to red' }, { id: 'd', label: 'He’ll find it eventually' }], correct: 'b', explanation: '4.1.3 Status Messages: announced, not focused.' },
    { id: 'l4', prompt: 'What should aria-hidden="true" never be put on?', hint: 'It hides from screen readers only.', options: [{ id: 'a', label: 'A decorative icon' }, { id: 'b', label: 'An SVG inside a labelled button' }, { id: 'c', label: 'Something focusable, like a button, because keyboard focus still lands on it and the screen reader says nothing' }, { id: 'd', label: 'A divider line' }], correct: 'c', explanation: 'Hidden from the screen reader but still in the Tab order is a silent trap.' },
    { id: 'l5', prompt: 'How do you check what a screen reader will say before launch?', hint: 'Free tools.', options: [{ id: 'a', label: 'Read the CSS' }, { id: 'b', label: 'Use NVDA on Windows, VoiceOver on Mac and iPhone, TalkBack on Android, and the browser’s accessibility tree' }, { id: 'c', label: 'Run a contrast checker' }, { id: 'd', label: 'Ask a designer' }], correct: 'b', explanation: 'Testing with real assistive technology, and later with people who use it every day, is the only real check.' },
  ],
};

export const ax2_3: Episode = {
  lessonId: 'ax.2-3',
  hook: 'Farhan pressed Pay on Rahi’s passenger form. Three fields turned red. His screen reader said nothing, and he had no idea which three.',
  scene: {
    id: 'form-errors', duration: 36,
    beats: [
      { at: 0, title: 'Red, and silent', body: 'Farhan presses Pay. Email, PAN and the cancellation checkbox turn red. Focus stays on the button. NVDA says nothing, so he presses Pay again.' },
      { at: 6, title: 'Colour isn’t a message', body: 'A red border is invisible to Farhan and unclear to many people with colour blindness. An error must be said in words (1.4.1 Use of Color, 3.3.1 Error Identification).' },
      { at: 12, title: 'Labels that stay', body: 'Age and Promo code are placeholders. Once typed in, the clue is gone: “34” in a box, for what? Visible labels, tied with <label for> (3.3.2 Labels or Instructions).' },
      { at: 18, title: 'Errors you can hear', body: 'Each message is linked to its field with aria-describedby, and the field gets aria-invalid. NVDA: “Email for your ticket, edit, invalid entry, Enter an email like name@example.com”.' },
      { at: 24, title: 'Say how to fix it', body: '“Invalid input” becomes “Enter a 10-digit mobile number, like 98200 12345” (3.3.3 Error Suggestion). “Something went wrong” on UPI becomes “Check your UPI ID, like name@okhdfc”.' },
      { at: 30, title: 'Start at the summary', body: 'After a failed submit, focus moves to “There are 3 problems”, with a link to each field. Everything he typed is still there.' },
      { at: 33, title: 'One fix, everyone', body: 'Visible labels and clear errors help Sunita, Kabir and anyone on a bumpy bus as much as Farhan.' },
    ],
  },
  check: [
    { id: 'c1', prompt: 'Why didn’t Farhan know what went wrong?', options: [{ id: 'a', label: 'The errors were shown only as red borders, not text he could hear, and focus didn’t move' }, { id: 'b', label: 'He typed too fast' }, { id: 'c', label: 'The Pay button was too small' }],
      correct: 'a', explanation: 'A colour change is not a message.' },
    { id: 'c2', prompt: 'What makes NVDA read an error when he reaches the field?', options: [{ id: 'a', label: 'Making it red' }, { id: 'b', label: 'aria-describedby linking the field to the message, and aria-invalid on the field' }, { id: 'c', label: 'A tooltip' }],
      correct: 'b', explanation: 'Linked text is read as part of the field.' },
  ],
  game: {
    id: 'form-tab', title: 'Tab through the form',
    instructions: 'Farhan has just pressed Pay. Tab through Rahi’s passenger form one field at a time. See what a sighted person sees and hear what NVDA says, then flag each field.',
    lanes: [
      { id: 'label', label: 'No real label', hint: 'Only a placeholder, or none' },
      { id: 'error', label: 'Error not in text', hint: 'Colour only, or a screen reader can’t hear it' },
      { id: 'help', label: 'Error with no fix', hint: 'Says it’s wrong, not what to do' },
      { id: 'ok', label: 'Fine', hint: 'Labelled, and any error is heard and helpful' },
    ],
    cards: [
      { id: 'g1', label: 'Full name, as on your ID', lane: 'ok', visual: 'name', note: 'A visible label tied with <label for>. “As on your ID” matters: the conductor checks it at boarding.' },
      { id: 'g2', label: 'Age', lane: 'label', visual: 'age', note: 'NVDA falls back on the placeholder, but on screen “34” now sits in an unnamed box. A visible label above the field, always.' },
      { id: 'g3', label: 'Gender, with Male picked', lane: 'ok', visual: 'gender', note: 'Radio buttons in a <fieldset> with a <legend>, so NVDA says the group, then “Male, radio button, checked”.' },
      { id: 'g4', label: 'Mobile number', lane: 'help', visual: 'mobile', note: 'Heard and linked, but “Invalid input” doesn’t say what’s valid. “Enter a 10-digit mobile number, like 98200 12345.”' },
      { id: 'g5', label: 'Email for your ticket', lane: 'error', visual: 'email', note: 'A red border and nothing else. Add “Enter an email like name@example.com” under the field, linked with aria-describedby.' },
      { id: 'g6', label: 'PAN, to show when you board', lane: 'error', visual: 'idnum', note: 'The message is good and visible, but not linked, so NVDA reads only the field. One aria-describedby, and aria-invalid="true".' },
      { id: 'g7', label: 'Pincode', lane: 'ok', visual: 'pin', note: 'An error done right: linked, heard on focus, and it says exactly what’s expected, with an example.' },
      { id: 'g8', label: 'Promo code', lane: 'label', visual: 'promo', note: 'Placeholder only. Once he types GOA100, nothing on screen says what the field was. Label it “Promo code (optional)”.' },
      { id: 'g9', label: 'UPI ID', lane: 'help', visual: 'upi', note: '“Something went wrong” could mean anything. If the ID wasn’t found, say so: “We couldn’t find farhan@okhdfc. Check it, or pay by card.”' },
      { id: 'g10', label: 'I accept the cancellation policy', lane: 'error', visual: 'terms', note: 'A red asterisk is the only sign. Say “Tick this to accept the cancellation policy”, linked to the checkbox.' },
      { id: 'g11', label: 'Send my ticket on WhatsApp', lane: 'ok', visual: 'whatsapp', note: 'A checkbox with its label as part of the click area. No error, nothing to fix.' },
    ],
  },
  gap: {
    id: 'gap', from: 0, at: 5.6,
    prompt: 'Farhan pressed Pay, three fields turned red, and NVDA said nothing. What should happen after a failed submit?',
    options: [{ id: 'a', label: 'Clear the form so he can start again' }, { id: 'b', label: 'Play an error sound' }, { id: 'c', label: 'Move focus to a summary of the problems, with a link to each field, and keep what he typed' }],
    correct: 'c', explanation: 'He hears how many problems there are and can go straight to each one.',
  },
  takeaways: [
    { title: 'Labels stay visible', body: 'A placeholder is a hint, not a label. Tie every label with <label for>.' },
    { title: 'Errors in words', body: 'Never only red. Say what’s wrong in text, right by the field.' },
    { title: 'Linked and heard', body: 'aria-describedby and aria-invalid, so the error is read with the field.' },
    { title: 'Say the fix, start at the top', body: 'What’s expected, with an example. Focus on a summary after submit, and keep their input.' },
  ],
  quiz: {
    seconds: 12,
    questions: [
      { id: 'q1', prompt: 'Is a placeholder a label?', options: [{ id: 'a', label: 'No' }, { id: 'b', label: 'Yes' }], correct: 'a', explanation: 'It disappears when you type.' },
      { id: 'q2', prompt: 'An error shown only with a red border fails…', options: [{ id: 'a', label: '2.4.1 Bypass Blocks' }, { id: 'b', label: '1.4.1 Use of Color and 3.3.1 Error Identification' }, { id: 'c', label: 'Nothing' }], correct: 'b', explanation: 'Colour alone, and no error in text.' },
      { id: 'q3', prompt: 'Which attribute ties an error message to its field?', options: [{ id: 'a', label: 'aria-hidden' }, { id: 'b', label: 'aria-live' }, { id: 'c', label: 'aria-expanded' }, { id: 'd', label: 'aria-describedby' }], correct: 'd', explanation: 'It points the field at the message’s id.' },
      { id: 'q4', prompt: 'After a failed submit, the form should…', options: [{ id: 'a', label: 'Clear every field' }, { id: 'b', label: 'Reload the page' }, { id: 'c', label: 'Keep the input and move focus to an error summary' }, { id: 'd', label: 'Do nothing' }], correct: 'c', explanation: 'Nobody should type a form twice.' },
    ],
  },
  ladder: [
    { id: 'l1', prompt: 'Should Rahi show errors as Farhan types each character?', hint: 'He hasn’t finished yet.', options: [{ id: 'a', label: 'Yes, on every key press' }, { id: 'b', label: 'No: check when he leaves the field or submits, so he isn’t told he’s wrong halfway through typing' }, { id: 'c', label: 'Only on the last field' }, { id: 'd', label: 'Never show errors' }], correct: 'b', explanation: 'Early errors are noise, and a screen reader may announce every one.' },
    { id: 'l2', prompt: 'Which autocomplete value lets the browser fill Farhan’s mobile number?', hint: '1.3.5 Identify Input Purpose.', options: [{ id: 'a', label: 'autocomplete="off"' }, { id: 'b', label: 'autocomplete="tel"' }, { id: 'c', label: 'autocomplete="number"' }, { id: 'd', label: 'autocomplete="phone"' }], correct: 'b', explanation: 'Standard tokens like name, email and tel let browsers and assistive tools fill and label fields.' },
    { id: 'l3', prompt: 'Where should a required field say it’s required?', hint: 'Not just a red asterisk.', options: [{ id: 'a', label: 'Only in the error after submit' }, { id: 'b', label: 'In the label (or a note that * means required, at the top), and with the required attribute in code' }, { id: 'c', label: 'In a tooltip' }, { id: 'd', label: 'In the page title' }], correct: 'b', explanation: 'Say it before they fill it in, in words and in code.' },
    { id: 'l4', prompt: 'Why shouldn’t the error summary just be a red banner that appears?', hint: 'Where is Farhan’s focus?', options: [{ id: 'a', label: 'Banners are ugly' }, { id: 'b', label: 'Nothing announces it or moves him to it, so he still doesn’t know; move focus to it, or use a live region' }, { id: 'c', label: 'It should be at the bottom' }, { id: 'd', label: 'It’s fine as is' }], correct: 'b', explanation: 'A change on screen isn’t a change he can hear.' },
    { id: 'l5', prompt: 'Rahi asks for gender because operators reserve ladies’ seats. How should the form handle that well?', hint: 'Explain, don’t just ask.', options: [{ id: 'a', label: 'Make it a hidden field' }, { id: 'b', label: 'Say why in the label or hint (“Used for ladies’ seat rules”) so people understand the question and can answer confidently' }, { id: 'c', label: 'Guess it from the name' }, { id: 'd', label: 'Ask it on every screen' }], correct: 'b', explanation: 'Instructions are part of 3.3.2: say what’s needed and, for sensitive questions, why.' },
  ],
};

export const ax2_4: Episode = {
  lessonId: 'ax.2-4',
  hook: 'Sunita, 67, spent five minutes reading Rahi’s fare rules. When she looked up, her seat was gone, and so was everything she’d typed.',
  scene: {
    id: 'cognitive-a11y', duration: 36,
    beats: [
      { at: 0, title: 'Five minutes', body: 'Sunita books a ₹640 seat to Kolhapur to see her grandson. Since her stroke she reads slowly. Rahi holds the seat for 5:00, and releases it at 0:00 without a word.' },
      { at: 6, title: 'Remember this', body: 'The OTP box blocks paste, so she reads six digits in Messages and types them back from memory. Then payment asks for her name and mobile again.' },
      { at: 12, title: 'What’s Flexi+?', body: '“Saver, Flexi or Flexi+ (T&C apply)”. Then “Error 4012: session invalid”. Each one is a puzzle on top of the task.' },
      { at: 18, title: 'Enough time, nothing to remember', body: 'Meera adds a warning with a minute left and “Add 5 minutes” (2.2.1 Timing Adjustable). The code fills in from the SMS and paste works (3.3.8). Details carry forward (3.3.7 Redundant Entry).' },
      { at: 24, title: 'Plain words, clear steps', body: 'Flexi+ becomes “Free cancellation until 24 hours before: +₹60”. Every screen says “Step 2 of 4”. Help sits in the same corner on every screen (3.2.6 Consistent Help).' },
      { at: 30, title: 'No surprises', body: 'Picking a boarding point no longer jumps to payment (3.2.2 On Input), and a review screen comes before any money moves (3.3.4).' },
      { at: 33, title: 'Lighter for everyone', body: 'Sunita books in one go. So does the commuter on a crowded bus, and the student reading in his third language.' },
    ],
  },
  check: [
    { id: 'c1', prompt: 'What made the seat hold a barrier for Sunita?', options: [{ id: 'a', label: 'It ended with no warning and no way to get more time' }, { id: 'b', label: 'Five minutes is always too short' }, { id: 'c', label: 'The timer was too small' }],
      correct: 'a', explanation: 'A limit is fine when people are warned and can extend it.' },
    { id: 'c2', prompt: 'Why is blocking paste in the OTP field a cognitive barrier?', options: [{ id: 'a', label: 'It slows down hackers' }, { id: 'b', label: 'It forces her to hold six digits in memory and copy them by hand' }, { id: 'c', label: 'It isn’t one' }],
      correct: 'b', explanation: '3.3.8 Accessible Authentication: no memory or transcription test without help.' },
  ],
  game: {
    id: 'load-lift', title: 'Lighten Sunita’s load',
    instructions: 'Each card is a barrier in Rahi’s booking flow. Pick the habit that removes it, and see the screen after. Every right call lifts some weight off Sunita’s load meter.',
    lanes: [
      { id: 'time', label: 'Enough time', hint: 'Warn, and let her extend' },
      { id: 'memory', label: 'Nothing to remember', hint: 'Carry it forward, let it fill in' },
      { id: 'plain', label: 'Plain words, clear steps', hint: 'Say what it means, and where she is' },
      { id: 'predict', label: 'No surprises', hint: 'Things stay put, nothing happens without her' },
    ],
    cards: [
      { id: 'g1', label: 'The seat hold ends at 0:00, with no warning', lane: 'time', visual: 'hold', note: 'Warn at least 20 seconds before, with a single action to extend it. A minute’s warning and “Add 5 minutes” is kinder still.' },
      { id: 'g2', label: 'Two minutes without typing signs her out and empties the form', lane: 'time', visual: 'idle', note: 'She was finding her reading glasses. Ask if she’s still there before signing out, and keep what she typed either way.' },
      { id: 'g3', label: 'The OTP box won’t let her paste', lane: 'memory', visual: 'otp', note: 'Copying six digits by hand is a memory test. autocomplete="one-time-code" fills it from the SMS, and paste should always work.' },
      { id: 'g4', label: 'The payment step asks for her name and mobile again', lane: 'memory', visual: 'retype', note: 'She typed them two screens ago. Carry them forward and let her change them (3.3.7 Redundant Entry).' },
      { id: 'g5', label: 'Sign-in wants a remembered password, then a puzzle of wobbly letters', lane: 'memory', visual: 'captcha', note: 'Both are cognitive tests. Allow password managers and paste, offer a code sent to her phone, and drop the distorted-text puzzle.' },
      { id: 'g6', label: '“Choose a fare: Saver, Flexi or Flexi+ (T&C apply)”', lane: 'plain', visual: 'jargon', note: 'Names she has to decode. Say what each one does and what it costs: “Free cancellation until 24 hours before: +₹60.”' },
      { id: 'g7', label: '“Error 4012: session invalid”', lane: 'plain', visual: 'code', note: 'A code for the developers. Tell her what happened, that nothing was lost, and what to do.' },
      { id: 'g8', label: 'Screen after screen, with no idea how many are left', lane: 'plain', visual: 'steps', note: '“Step 3 of 4: Passenger details” tells her where she is and how far to go, and that she can finish.' },
      { id: 'g9', label: 'Help moves from the footer to the menu, and vanishes on payment', lane: 'predict', visual: 'help', note: 'The moment she needs help most, it’s gone. Same place, same order, on every screen (3.2.6 Consistent Help).' },
      { id: 'g10', label: 'Picking a boarding point jumps straight to payment', lane: 'predict', visual: 'jump', note: 'Choosing something shouldn’t move the page under her (3.2.2 On Input). Let her pick, check, and press Continue.' },
      { id: 'g11', label: 'One tap on Book charges ₹640, no review', lane: 'predict', visual: 'final', note: 'Money needs a review step, or an undo (3.3.4 Error Prevention). Route, date, time, seat and amount, one last time.' },
    ],
  },
  gap: {
    id: 'gap', from: 0, at: 5.6,
    prompt: 'Sunita’s seat hold is about to run out while she reads. What should Rahi do?',
    options: [{ id: 'a', label: 'Release the seat; rules are rules' }, { id: 'b', label: 'Show a bigger, redder timer' }, { id: 'c', label: 'Warn her with a minute left and let her add 5 minutes with one tap' }],
    correct: 'c', explanation: '2.2.1 Timing Adjustable: warn, and give a simple way to extend.',
  },
  takeaways: [
    { title: 'Enough time', body: 'Warn before limits and let people extend them. Keep their work if time runs out.' },
    { title: 'Nothing to remember', body: 'Carry details forward, allow paste and autofill, and never make sign-in a memory test.' },
    { title: 'Plain and in steps', body: 'Say what things do, not what they’re called. Show where people are in the flow.' },
    { title: 'No surprises', body: 'Help stays put, choices don’t jump pages, and money waits for a review.' },
  ],
  quiz: {
    seconds: 12,
    questions: [
      { id: 'q1', prompt: 'Should an OTP field allow paste?', options: [{ id: 'a', label: 'Yes' }, { id: 'b', label: 'No' }], correct: 'a', explanation: 'Blocking it turns sign-in into a memory test.' },
      { id: 'q2', prompt: 'Asking for the same details twice in one flow breaks…', options: [{ id: 'a', label: '1.4.3 Contrast' }, { id: 'b', label: '3.3.7 Redundant Entry' }, { id: 'c', label: '2.1.1 Keyboard' }], correct: 'b', explanation: 'Carry them forward, or let people pick them.' },
      { id: 'q3', prompt: 'Who gains from cognitive accessibility?', options: [{ id: 'a', label: 'Only people with dementia' }, { id: 'b', label: 'Nobody else' }, { id: 'c', label: 'Only children' }, { id: 'd', label: 'Anyone tired, stressed, distracted or reading in a second language, too' }], correct: 'd', explanation: 'Cognitive limits are often situational.' },
      { id: 'q4', prompt: 'A review screen before charging money meets…', options: [{ id: 'a', label: '3.3.4 Error Prevention (Legal, Financial, Data)' }, { id: 'b', label: '2.4.1 Bypass Blocks' }, { id: 'c', label: '1.1.1 Non-text Content' }, { id: 'd', label: '4.1.2 Name, Role, Value' }], correct: 'a', explanation: 'Reversible, checked, or confirmed.' },
    ],
  },
  ladder: [
    { id: 'l1', prompt: 'Rahi’s security team says blocking paste in password fields stops attacks. What’s the best reply?', hint: 'Who actually gets stopped?', options: [{ id: 'a', label: 'Agree and block paste everywhere' }, { id: 'b', label: 'Blocking paste stops password managers and forces people to remember and retype, which fails 3.3.8 and pushes them to weaker passwords' }, { id: 'c', label: 'Remove passwords entirely, today' }, { id: 'd', label: 'Allow paste only on desktop' }], correct: 'b', explanation: 'Security guidance, like NIST’s, also says to allow paste.' },
    { id: 'l2', prompt: 'Which is an acceptable alternative to a distorted-text CAPTCHA under 3.3.8 at Level AA?', hint: 'Exceptions include objects.', options: [{ id: 'a', label: 'A harder distorted-text puzzle' }, { id: 'b', label: 'A test that recognises common objects, or better, a non-cognitive check like a code sent to her phone that she can paste' }, { id: 'c', label: 'A maths question' }, { id: 'd', label: 'Typing the alphabet backwards' }], correct: 'b', explanation: 'Object recognition is allowed at AA (not at AAA); no puzzle at all is best.' },
    { id: 'l3', prompt: 'Which of these is a plain-language rewrite of “Your booking is subject to operator cancellation policy”?', hint: 'Who, what, how much.', options: [{ id: 'a', label: '“T&C apply”' }, { id: 'b', label: '“If you cancel 24 hours before, you get ₹320 back. After that, nothing.”' }, { id: 'c', label: '“Cancellation charges may be applicable as per policy.”' }, { id: 'd', label: '“See operator terms.”' }], correct: 'b', explanation: 'Real numbers and real consequences, in the order she needs them.' },
    { id: 'l4', prompt: 'Sunita picks “Swargate” and the fare updates beside it, without leaving the page. Does that break 3.2.2 On Input?', hint: 'Change of context vs. change of content.', options: [{ id: 'a', label: 'Yes, nothing may change' }, { id: 'b', label: 'No: updating content nearby is fine; a change of context, like jumping to another page or moving focus, is what 3.2.2 is about' }, { id: 'c', label: 'Only on mobile' }, { id: 'd', label: 'Only if the fare goes up' }], correct: 'b', explanation: 'Surprise comes from the page changing under you, not from helpful updates.' },
    { id: 'l5', prompt: 'How would you check Rahi’s flow is easier for people like Sunita?', hint: 'People, not a checklist.', options: [{ id: 'a', label: 'Run an automated checker only' }, { id: 'b', label: 'Usability sessions with older people and people with cognitive disabilities, measuring completion, time and where they stall, before and after' }, { id: 'c', label: 'Ask the team if it feels simpler' }, { id: 'd', label: 'Count the words on each screen' }], correct: 'b', explanation: 'Automated tools catch few cognitive barriers. That’s ax.3’s subject.' },
  ],
};
