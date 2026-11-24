// Episodes for chapter ds.3 · Components & variants. Drafts by Claude, for review.
// Rasta (monthly bus passes in Chennai) again: ds.2 gave Kavya, its design-system designer, a three-tier token set.
// This chapter builds components on top of it, with Arjun, the front-end developer, and Imran, who has just joined
// the Rasta for Business team. ds.1 covered atomic design and ui.4 the look and states of buttons, inputs and cards;
// this chapter is about how a component is specified: its API, its Figma properties, and docs people read.
import type { Episode } from '../episode';

export const ds3_1: Episode = {
  lessonId: 'ds.3-1',
  hook: 'Rasta’s Button has twelve props, and Arjun just turned on isPrimary and isDanger together. Watch the API shrink to six props that can only describe buttons that should exist.',
  scene: {
    id: 'prop-sprawl', duration: 34,
    beats: [
      { at: 0, title: 'Twelve props', body: 'Two years of requests, one new prop each: isPrimary, isTertiary, isDanger, isSmall, isBig, isLoading, isDisabled, hasIcon, hasIconRight, isRounded, color and padding.' },
      { at: 5, title: 'Primary and danger at once', body: 'Arjun needs a Cancel pass button and sets both. Teal fill, red label: whichever rule comes last in the CSS wins.' },
      { at: 10, title: '1,024, and then endless', body: 'Ten on/off switches describe 1,024 buttons, and most are nonsense. color and padding take any value, so nobody can design or test them all.' },
      { at: 15, title: 'One choice, not three switches', body: 'isPrimary, isTertiary and isDanger fold into variant. isSmall and isBig fold into size. The look with no flags on becomes the default: secondary, md.' },
      { at: 20, title: 'Slots for content', body: 'hasIcon plus an icon name becomes iconLeading, which takes any icon. hasIconRight becomes iconTrailing.' },
      { at: 24, title: 'The system decides the rest', body: 'color, padding and isRounded go. The variant’s tokens set the colour, the size sets the padding, button-radius sets the corners.' },
      { at: 29, title: 'Forty-eight real buttons', body: 'Variant 4 × size 3 × loading × disabled: 48, every one of them a button Rasta means to ship. The Figma properties use the same names.' },
    ],
  },
  check: [
    { id: 'c1', prompt: 'Why could Arjun ask for a primary danger button?', options: [{ id: 'a', label: 'He misread the docs' }, { id: 'b', label: 'Choices that exclude each other were separate booleans, so nothing stopped both being on' }, { id: 'c', label: 'Danger buttons are always primary' }],
      correct: 'b', explanation: 'An enum holds one value at a time. Three booleans can all be true.' },
    { id: 'c2', prompt: 'Where did color and padding go?', options: [{ id: 'a', label: 'Into a new style prop' }, { id: 'b', label: 'Into the docs' }, { id: 'c', label: 'Nowhere: the variant’s tokens and the size set them' }],
      correct: 'c', explanation: 'If a value should always follow from a choice, it isn’t a prop.' },
  ],
  game: {
    id: 'api-build', title: 'Design the Button’s API',
    instructions: 'Each card is a prop from Rasta’s old Button and what people used it for. Decide what it becomes. The props panel rebuilds as you go, and the counter shows how many different buttons the API can describe.',
    lanes: [
      { id: 'enum', label: 'Option of a choice', hint: 'One of several looks that can’t combine' },
      { id: 'boolean', label: 'Boolean', hint: 'A real on/off state that works with any choice' },
      { id: 'slot', label: 'Slot', hint: 'Content that goes in: an icon, a label' },
      { id: 'fixed', label: 'Not a prop', hint: 'The system sets it from a choice or a token' },
    ],
    cards: [
      { id: 'g1', label: 'isPrimary · the Renew button, the one main action on the pass screen', lane: 'enum', visual: 'variant=primary', note: 'variant="primary". Primary, secondary, tertiary and danger are one choice: a button is exactly one of them.' },
      { id: 'g2', label: 'isDanger · Cancel pass, which can’t be undone', lane: 'enum', visual: 'variant=danger', note: 'variant="danger". As a boolean it could be switched on alongside isPrimary, which is how Arjun got teal and red at once.' },
      { id: 'g3', label: 'isTertiary · the text-only Skip on the onboarding screens', lane: 'enum', visual: 'variant=tertiary', note: 'variant="tertiary". The old button with no flags on was the outlined one, so secondary becomes the default.' },
      { id: 'g4', label: 'isSmall · compact buttons in the trips list', lane: 'enum', visual: 'size=sm', note: 'size="sm". Small and big can’t both be true, so they are options of one size prop, with md as the default.' },
      { id: 'g5', label: 'isBig · the full-width Renew at the bottom of the screen', lane: 'enum', visual: 'size=lg', note: 'size="lg". The width is the layout’s job: the screen stretches the button, the button doesn’t need a prop for it.' },
      { id: 'g6', label: 'isLoading · while the UPI app confirms the payment', lane: 'boolean', visual: 'isLoading', note: 'A primary button can be loading and so can a danger one. A state that combines with every choice is a boolean.' },
      { id: 'g7', label: 'isDisabled · Renew, until a zone is picked', lane: 'boolean', visual: 'isDisabled', note: 'Stays a boolean, and the is prefix says so. Every variant has a disabled look, drawn once per variant.' },
      { id: 'g8', label: 'hasIcon · a ticket icon before the label, chosen with iconName', lane: 'slot', visual: 'iconLeading', note: 'iconLeading={<TicketIcon />}. One slot replaces two props, takes any icon in the set, and the button sizes and spaces it.' },
      { id: 'g9', label: 'hasIconRight · the arrow after “See all trips”', lane: 'slot', visual: 'iconTrailing', note: 'iconTrailing. Named for where it sits in reading order, so it still reads right in a right-to-left language.' },
      { id: 'g10', label: 'color · “#0F766E”, typed in by whoever built the screen', lane: 'fixed', visual: 'variant', note: 'The variant picks the fill through color-action-primary. A free colour prop is how the eleven greys from ds.1 got in.' },
      { id: 'g11', label: 'padding · “12px 20px”, or whatever looked right that day', lane: 'fixed', visual: 'size', note: 'Each size sets its own padding and height. If padding varies by screen, the buttons stop lining up.' },
      { id: 'g12', label: 'isRounded · pill-shaped corners on the offers screen', lane: 'fixed', visual: 'button-radius', note: 'Corners come from the button-radius token. One screen with pill buttons is drift, not a feature.' },
    ],
  },
  gap: {
    id: 'gap', from: 10, at: 14.6,
    prompt: 'isPrimary, isTertiary and isDanger can all be switched on at once. What should Kavya do?',
    options: [{ id: 'a', label: 'Write in the docs that only one may be true' }, { id: 'b', label: 'Replace them with one prop, variant, that takes one value: primary, secondary, tertiary or danger' }, { id: 'c', label: 'Add an isPrimaryDanger prop for that case' }],
    correct: 'b', explanation: 'Make the impossible combination impossible to write. A rule in the docs gets missed; an enum can’t hold two values.',
  },
  takeaways: [
    { title: 'One enum, not a pile of switches', body: 'Choices that exclude each other are one prop with options: variant, size.' },
    { title: 'Booleans for real states', body: 'isLoading and isDisabled combine with any variant. That’s what makes them booleans.' },
    { title: 'Slots for content', body: 'iconLeading takes any icon. Don’t add a prop per icon or a has… switch beside it.' },
    { title: 'Don’t expose what the system decides', body: 'Colour, padding and corners follow from the variant, the size and the tokens. Defaults do the common thing.' },
  ],
  quiz: {
    seconds: 12,
    questions: [
      { id: 'q1', prompt: 'isSmall and isBig should become…', options: [{ id: 'a', label: 'One size prop' }, { id: 'b', label: 'Two booleans' }], correct: 'a', explanation: 'They can’t both be true.' },
      { id: 'q2', prompt: 'isLoading should be…', options: [{ id: 'a', label: 'A variant option' }, { id: 'b', label: 'A boolean' }, { id: 'c', label: 'Removed' }], correct: 'b', explanation: 'Any variant can be loading.' },
      { id: 'q3', prompt: 'A leading icon belongs in…', options: [{ id: 'a', label: 'A slot: iconLeading' }, { id: 'b', label: 'hasIcon plus iconName' }, { id: 'c', label: 'The label text' }, { id: 'd', label: 'A new component' }], correct: 'a', explanation: 'One prop, any icon.' },
      { id: 'q4', prompt: 'A color prop on the Button…', options: [{ id: 'a', label: 'Gives teams flexibility' }, { id: 'b', label: 'Is needed for dark mode' }, { id: 'c', label: 'Is fine if it’s a hex code' }, { id: 'd', label: 'Lets anyone bypass the tokens' }], correct: 'd', explanation: 'The variant sets the colour through tokens.' },
    ],
  },
  ladder: [
    { id: 'l1', prompt: 'Ten independent booleans can be set how many ways?', hint: 'Each one doubles it.', options: [{ id: 'a', label: '10' }, { id: 'b', label: '20' }, { id: 'c', label: '100' }, { id: 'd', label: '1,024' }], correct: 'd', explanation: '2¹⁰ = 1,024. Every boolean doubles what you have to design, build and test.' },
    { id: 'l2', prompt: 'What should <Button>Renew</Button>, with no props set, look like?', hint: 'Defaults.', options: [{ id: 'a', label: 'Unstyled, so people have to choose' }, { id: 'b', label: 'The most common, safest look: secondary, medium' }, { id: 'c', label: 'Primary, the most eye-catching' }, { id: 'd', label: 'It should throw an error' }], correct: 'b', explanation: 'A good default means the common case needs no props, and the loud primary look has to be asked for.' },
    { id: 'l3', prompt: 'Why variant="danger" and not color="red"?', hint: 'What if errors turn orange?', options: [{ id: 'a', label: 'It names the meaning, which survives a colour change and a dark mode' }, { id: 'b', label: 'Red is not a valid value' }, { id: 'c', label: 'It’s shorter' }, { id: 'd', label: 'There’s no difference' }], correct: 'a', explanation: 'The same reason semantic tokens name jobs. The look can change; the meaning stays.' },
    { id: 'l4', prompt: 'The trips list wants a button that also shows a count badge. Best first step?', hint: 'Is it a one-off?', options: [{ id: 'a', label: 'Add showBadge, badgeCount and badgeColor to the Button' }, { id: 'b', label: 'Fork the Button for the trips list' }, { id: 'c', label: 'Ask whether it recurs; if it does, add a slot or compose Button with the Badge component, not three props' }, { id: 'd', label: 'Say no to all requests' }], correct: 'c', explanation: 'Composition keeps the Button small. One-off requests are how it got twelve props.' },
    { id: 'l5', prompt: 'In React Aria, which Rasta’s button is built on, the click handler is onPress, not onClick. Why does that matter for the API?', hint: 'Touch, mouse and keyboard.', options: [{ id: 'a', label: 'It doesn’t, they’re the same' }, { id: 'b', label: 'onPress means the same thing for a tap, a click and the Enter or Space key, so callers handle one event' }, { id: 'c', label: 'onClick is deprecated in all browsers' }, { id: 'd', label: 'onPress is faster' }], correct: 'b', explanation: 'A good prop hides differences callers shouldn’t have to handle, like which input device fired it.' },
  ],
};

export const ds3_2: Episode = {
  lessonId: 'ds.3-2',
  hook: 'Kavya’s Button component set has 1,080 frames and takes 40 seconds to open. Watch three kinds of property cut it to 60, without losing a single look.',
  scene: {
    id: 'variant-explosion', duration: 34,
    beats: [
      { at: 0, title: 'Every look, drawn', body: 'Kavya made everything a variant: 4 hierarchies × 3 sizes × 5 states × 6 icons × 3 icon positions. 1,080 frames.' },
      { at: 5, title: 'The file crawls', body: 'The library takes 40 seconds to open. Adding one new icon means drawing 180 more frames.' },
      { at: 10, title: 'Show or hide: boolean', body: 'The leading icon and the trailing arrow become boolean properties: a layer shown or hidden. Icon position is gone. 360 frames.' },
      { at: 15, title: 'Which one: instance swap', body: 'The icon is a nested component. Swap ticket for bus in the properties panel. 60 frames.' },
      { at: 20, title: 'Words: text', body: 'The label is a text property. “Renew pass” and “Pay with UPI” are typed into the panel, never drawn.' },
      { at: 24, title: 'Same names as the code', body: 'variant, size, iconLeading in Figma and in React. State stays a variant in Figma only, because in code the browser supplies hover and focus.' },
      { at: 29, title: 'Draw only what changes the drawing', body: '1,080 frames became 60, and every look is still one click away.' },
    ],
  },
  check: [
    { id: 'c1', prompt: 'Why did the file have 1,080 frames?', options: [{ id: 'a', label: 'Every property was a variant, so each one multiplied the rest' }, { id: 'b', label: 'Kavya duplicated the set by mistake' }, { id: 'c', label: 'Figma needs a frame per screen' }],
      correct: 'a', explanation: 'Variants multiply: 4 × 3 × 5 × 6 × 3.' },
    { id: 'c2', prompt: 'Which property type picks the icon?', options: [{ id: 'a', label: 'Text' }, { id: 'b', label: 'Variant' }, { id: 'c', label: 'Instance swap' }],
      correct: 'c', explanation: 'The icon is a nested component, swapped in place.' },
  ],
  game: {
    id: 'prop-type', title: 'Build the component set',
    instructions: 'Each card is something that varies on Rasta’s Button. Pick the kind of Figma property it should be. The frame wall shows how many frames you’d have to draw.',
    lanes: [
      { id: 'variant', label: 'Variant', hint: 'The drawing changes: fill, size, border' },
      { id: 'boolean', label: 'Boolean', hint: 'A layer is shown or hidden' },
      { id: 'text', label: 'Text', hint: 'Different words, same drawing' },
      { id: 'swap', label: 'Instance swap', hint: 'A different nested component' },
    ],
    cards: [
      { id: 'g1', label: 'Hierarchy: primary, secondary, tertiary, danger', lane: 'variant', visual: 'primary,secondary,tertiary,danger', note: 'Each has its own fill, border and label colour, so each has to be drawn. A variant property.' },
      { id: 'g2', label: 'Size: sm, md, lg', lane: 'variant', visual: 'sm,md,lg', note: 'Height, padding and text size all change. A variant property, and it matches the size prop in code.' },
      { id: 'g3', label: 'State: default, hover, pressed, focus, disabled', lane: 'variant', visual: 'default,hover,pressed,focus,disabled', note: 'Each state looks different, so it’s drawn: a variant in Figma. In code there’s no state prop; the browser supplies hover and focus.' },
      { id: 'g4', label: 'Show the leading icon', lane: 'boolean', visual: 'on,off', note: 'The icon layer is just shown or hidden, with auto layout closing the gap. As a variant it would double every frame.' },
      { id: 'g5', label: 'Show the trailing arrow', lane: 'boolean', visual: 'on,off', note: 'Another layer shown or hidden. A boolean property costs no frames at all.' },
      { id: 'g6', label: 'The label: Renew pass, Share pass, Pay with UPI…', lane: 'text', visual: 'Renew pass,Share pass,Cancel pass,See all trips,Pay with UPI', note: 'Words change, the drawing doesn’t. A text property: type the label into the panel. A variant per label would never end.' },
      { id: 'g7', label: 'Which leading icon: ticket, bus, wallet, share, QR, receipt', lane: 'swap', visual: 'ticket,bus,wallet,share,qr,receipt', note: 'The icon is its own component nested in the button. Instance swap picks any icon in the library, including ones added next year.' },
      { id: 'g8', label: 'Which trailing icon: arrow, caret, external link', lane: 'swap', visual: 'arrow-right,caret-down,arrow-square-out', note: 'Also an instance swap. Limit it to the preferred icons so nobody drops a full-colour logo in there.' },
    ],
  },
  gap: {
    id: 'gap', from: 5, at: 9.6,
    prompt: 'The file takes 40 seconds to open and a new icon costs 180 frames. What should Kavya change first?',
    options: [{ id: 'a', label: 'Split the set into one file per icon' }, { id: 'b', label: 'Turn the icon into a boolean and an instance swap, so icons stop multiplying the frames' }, { id: 'c', label: 'Remove the states to save frames' }],
    correct: 'b', explanation: 'Icons don’t change how the button is drawn, only what sits in it. Showing and swapping it costs no frames; states really are different drawings.',
  },
  takeaways: [
    { title: 'Variants multiply', body: 'Every variant property multiplies the frames. 4 × 3 × 5 is 60; add six icons and it’s 360.' },
    { title: 'Draw only what changes the drawing', body: 'Fill, size and border are variants. Showing a layer is a boolean, words are text, a nested component is a swap.' },
    { title: 'Same names as the code', body: 'Figma properties and props share names and values, so handoff needs no translating.' },
    { title: 'State is a variant, not a prop', body: 'Draw hover, pressed and focus in Figma. In code the browser supplies them.' },
  ],
  quiz: {
    seconds: 12,
    questions: [
      { id: 'q1', prompt: 'The button’s label should be a…', options: [{ id: 'a', label: 'Text property' }, { id: 'b', label: 'Variant' }], correct: 'a', explanation: 'Words, not a drawing.' },
      { id: 'q2', prompt: 'Showing or hiding the leading icon is a…', options: [{ id: 'a', label: 'Variant' }, { id: 'b', label: 'Text property' }, { id: 'c', label: 'Boolean property' }], correct: 'c', explanation: 'A layer on or off.' },
      { id: 'q3', prompt: '4 variants × 3 sizes × 5 states is…', options: [{ id: 'a', label: '12 frames' }, { id: 'b', label: '60 frames' }, { id: 'c', label: '20 frames' }, { id: 'd', label: '35 frames' }], correct: 'b', explanation: '4 × 3 × 5.' },
      { id: 'q4', prompt: 'Picking which icon sits in the button is an…', options: [{ id: 'a', label: 'Boolean' }, { id: 'b', label: 'Variant' }, { id: 'c', label: 'Text property' }, { id: 'd', label: 'Instance swap' }], correct: 'd', explanation: 'A nested component, swapped.' },
    ],
  },
  ladder: [
    { id: 'l1', prompt: 'An icon-only button is square, with different padding. Variant or boolean?', hint: 'Does the drawing change?', options: [{ id: 'a', label: 'Boolean: just hide the label' }, { id: 'b', label: 'Text: leave the label empty' }, { id: 'c', label: 'A variant, or its own component: the shape and padding change' }, { id: 'd', label: 'Instance swap' }], correct: 'c', explanation: 'Hiding the label would leave a lopsided button. When the layout changes, it has to be drawn.' },
    { id: 'l2', prompt: 'Why name a Figma property “variant” with values like “primary”, and not “Type” with “Big teal”?', hint: 'Who reads it next?', options: [{ id: 'a', label: 'Figma requires lowercase' }, { id: 'b', label: 'The developer inspects the same name and value they type in code' }, { id: 'c', label: 'Shorter names load faster' }, { id: 'd', label: 'It doesn’t matter' }], correct: 'b', explanation: 'Matching names make the inspect panel a spec. “Big teal” has to be translated, and stops being true in dark mode.' },
    { id: 'l3', prompt: 'Where do booleans like “Show leading icon” work best in Figma?', hint: 'What closes the gap?', options: [{ id: 'a', label: 'On layers inside auto layout, so hiding one closes the gap' }, { id: 'b', label: 'On fixed-size frames' }, { id: 'c', label: 'Only on text layers' }, { id: 'd', label: 'Anywhere, it makes no difference' }], correct: 'a', explanation: 'Auto layout reflows when a layer is hidden, so one drawing works with and without the icon.' },
    { id: 'l4', prompt: 'Kavya restricts the trailing icon swap to three “preferred values”. Why?', hint: 'What else is in the library?', options: [{ id: 'a', label: 'To save frames' }, { id: 'b', label: 'Figma allows only three' }, { id: 'c', label: 'So the swap menu offers the icons that belong there, not every component in the library' }, { id: 'd', label: 'To hide icons from developers' }], correct: 'c', explanation: 'Preferred values guide the choice without forbidding others, much like a default guides a prop.' },
    { id: 'l5', prompt: 'A team wants a “Diwali” variant of the Button with a gold fill. Best answer?', hint: 'Remember ds.2.', options: [{ id: 'a', label: 'Add a sixth hierarchy value' }, { id: 'b', label: 'Theme it: repoint the semantic token for a season, and the component set doesn’t change' }, { id: 'c', label: 'Make a separate DiwaliButton' }, { id: 'd', label: 'Add a colour property' }], correct: 'b', explanation: 'A seasonal look is a theme. Variants are for meanings the button keeps all year.' },
  ],
};

export const ds3_3: Episode = {
  lessonId: 'ds.3-3',
  hook: 'Rasta’s Button page is 2,400 words long and opens with the Button’s history. Imran skipped it and shipped two primary buttons in one dialog. Watch the page rewritten so the answer takes five seconds to find.',
  scene: {
    id: 'doc-page', duration: 36,
    beats: [
      { at: 0, title: 'The Button page', body: '2,400 words on a wiki, opening with how the Button came to be in 2023. A ten-minute read.' },
      { at: 5, title: 'What people actually read', body: 'The first two lines, the headings, a search for one word. Most visits are over within 30 seconds.' },
      { at: 10, title: 'Imran’s dialog', body: 'New on Rasta for Business, he couldn’t find the rule. His filter dialog has two primary buttons and a red “Remove filter”.' },
      { at: 15, title: 'Usage first', body: 'One line on what it’s for, then Use it for and Don’t use it for. One primary button per screen or dialog.' },
      { at: 19, title: 'Show, don’t describe', body: 'Do and don’t pairs, each with a picture: danger on “Cancel pass”, yes; danger on “Remove filter”, no.' },
      { at: 23, title: 'Accessibility, then reference', body: '48 px tap areas, never remove the focus ring, a label for icon-only buttons. The props table is generated from the code.' },
      { at: 27, title: 'Where people work', body: 'A short description on the Figma component, shown in the properties panel, and the page next to the live Storybook examples. Updated in the same pull request.' },
      { at: 31, title: 'Five seconds', body: 'Imran asks again: two primary buttons? The answer is the second line. Ten minutes became ninety seconds.' },
    ],
  },
  check: [
    { id: 'c1', prompt: 'Why did Imran miss the rule?', options: [{ id: 'a', label: 'He didn’t care about the system' }, { id: 'b', label: 'It was buried in a long page that opened with history, and he came with one question' }, { id: 'c', label: 'There was no rule' }],
      correct: 'b', explanation: 'People arrive with one question. If the answer isn’t near the top, they guess.' },
    { id: 'c2', prompt: 'Where does the props table come from on the new page?', options: [{ id: 'a', label: 'Kavya types it each release' }, { id: 'b', label: 'Generated from the code' }, { id: 'c', label: 'It was cut' }],
      correct: 'b', explanation: 'A generated table can’t drift from the component.' },
  ],
  game: {
    id: 'doc-rewrite', title: 'Rewrite the Button docs',
    instructions: 'Each card is a paragraph from the old Button page. Decide where it belongs on the new page, or cut it. Its rewrite drops into that block, and the reading time updates.',
    lanes: [
      { id: 'when', label: 'Use it for / don’t', hint: 'When to reach for it, and when not to' },
      { id: 'dodont', label: 'Do and don’t', hint: 'A rule shown as a pair of pictures' },
      { id: 'a11y', label: 'Accessibility', hint: 'What everyone needs to be able to use it' },
      { id: 'cut', label: 'Cut it', hint: 'History, filler, or something a machine keeps up to date' },
    ],
    cards: [
      { id: 'g1', label: 'The Button component is a fundamental building block in the Rasta design system and should be used whenever a user needs to perform an action, such as submitting a form, confirming a choice or moving to the next step, although in some cases a link may be more suitable.', lane: 'when', visual: 'Use a button to do something: Renew, Pay, Save. Use a link to go somewhere: See the fare chart.', note: 'Twelve words carry the rule that took forty-five, and the examples are Rasta’s own.' },
      { id: 'g2', label: 'Our team has had many discussions about how many primary buttons can appear together, and the general consensus is that it is best to try to keep it to one wherever possible, unless there is a good reason not to.', lane: 'when', visual: 'One primary button per screen or dialog. Everything else is secondary or tertiary.', note: 'This is the rule Imran needed. “General consensus” and “unless there is a good reason” made it sound optional.' },
      { id: 'g3', label: 'Labels should be written in a clear way that tells the user what will happen, and generic words should generally be avoided where a more specific word could be used instead.', lane: 'dodont', visual: 'Do: “Renew pass”. Don’t: “OK” or “Submit”.', note: 'A pair of examples is faster to read and harder to misread than advice in the abstract.' },
      { id: 'g4', label: 'The danger variant has been designed for destructive actions and is therefore not intended to be used for actions that are merely negative, or for cancelling things that are not destructive.', lane: 'dodont', visual: 'Do: danger for “Cancel pass”, which can’t be undone. Don’t: danger for “Remove filter”.', note: 'Shown as two pictures side by side, this is the mistake in Imran’s dialog, caught before he makes it.' },
      { id: 'g5', label: 'It is important to consider accessibility, and designers should keep in mind that all users, including those with disabilities, should be able to use buttons comfortably.', lane: 'a11y', visual: 'Tap area at least 48 × 48 px. Never remove the focus ring. Icon-only buttons need an aria-label.', note: 'The old line was true and gave nobody anything to check. The rewrite is three things you can test.' },
      { id: 'g6', label: 'When a button is in the loading state, it is worth remembering that some users might not be able to see the spinner, so this should be taken into account where appropriate.', lane: 'a11y', visual: 'While loading, keep the button’s width and announce “Renewing…” to screen readers.', note: '“Taken into account where appropriate” becomes the two things to build: a width that doesn’t jump and a spoken status.' },
      { id: 'g7', label: 'The Button was first introduced in version 1.2 of the system in 2023, after a long process of research and alignment with stakeholders across several squads.', lane: 'cut', note: 'History belongs in the changelog. Nobody designing a dialog needs it, and it was the page’s first paragraph.' },
      { id: 'g8', label: 'Props: variant (string), size (string), isLoading (boolean), isDisabled (boolean), iconLeading (node). Typed out by hand, last updated in March.', lane: 'cut', note: 'Cut the hand-typed copy. The page shows a props table generated from the code, which can’t go stale.' },
      { id: 'g9', label: 'Please make sure you read this entire page carefully before using the Button component in any of your designs.', lane: 'cut', note: 'Nobody will, and asking doesn’t help. Put the answers where they look first.' },
    ],
  },
  gap: {
    id: 'gap', from: 10, at: 14.6,
    prompt: 'Imran couldn’t find the one-primary-button rule. What should Kavya do with the page?',
    options: [{ id: 'a', label: 'Add a bold warning at the top asking people to read it all' }, { id: 'b', label: 'Put usage first: what it’s for, when to use it and when not to, with the rules in the first lines' }, { id: 'c', label: 'Make it longer, with more detail' }],
    correct: 'b', explanation: 'People arrive with a question. Put the most-asked answers at the top and the reference material lower.',
  },
  takeaways: [
    { title: 'Usage first', body: 'What it’s for, use it for, don’t use it for. The rules people ask about go in the first lines.' },
    { title: 'Show, don’t describe', body: 'Do and don’t pairs with pictures beat paragraphs of advice.' },
    { title: 'Specific and testable', body: '“48 × 48 px tap area” can be checked. “Consider accessibility” can’t.' },
    { title: 'Generated and close by', body: 'Props tables come from code. Docs live in Figma and Storybook, and change in the same pull request.' },
  ],
  quiz: {
    seconds: 12,
    questions: [
      { id: 'q1', prompt: 'What goes at the top of a component page?', options: [{ id: 'a', label: 'What it’s for and when to use it' }, { id: 'b', label: 'Its history' }], correct: 'a', explanation: 'That’s what most people came for.' },
      { id: 'q2', prompt: 'The props table should be…', options: [{ id: 'a', label: 'Typed out each release' }, { id: 'b', label: 'Left out' }, { id: 'c', label: 'Generated from the code' }], correct: 'c', explanation: 'It can’t go stale.' },
      { id: 'q3', prompt: 'A rule is easiest to follow as…', options: [{ id: 'a', label: 'A long paragraph' }, { id: 'b', label: 'A do and don’t pair with pictures' }, { id: 'c', label: 'A link to another page' }, { id: 'd', label: 'A footnote' }], correct: 'b', explanation: 'People see the difference.' },
      { id: 'q4', prompt: 'Docs are best updated…', options: [{ id: 'a', label: 'Once a year' }, { id: 'b', label: 'When someone complains' }, { id: 'c', label: 'By a separate docs team' }, { id: 'd', label: 'In the same pull request as the component' }], correct: 'd', explanation: 'Then they change together.' },
    ],
  },
  ladder: [
    { id: 'l1', prompt: 'Why add a short description to the Figma component itself?', hint: 'Where are designers when they need it?', options: [{ id: 'a', label: 'Figma requires one' }, { id: 'b', label: 'It shows in the assets and properties panels, right where the designer is choosing it' }, { id: 'c', label: 'It replaces the docs site' }, { id: 'd', label: 'It makes the file smaller' }], correct: 'b', explanation: 'The best docs meet people where they work, with a link to the full page.' },
    { id: 'l2', prompt: 'Which do and don’t pair teaches the most?', hint: 'What’s the real mistake?', options: [{ id: 'a', label: 'A good button next to a deliberately ugly one' }, { id: 'b', label: 'Two good buttons' }, { id: 'c', label: 'The mistake people actually make, next to its fix, in the same real screen' }, { id: 'd', label: 'One picture with a long caption' }], correct: 'c', explanation: 'Imran’s dialog is the don’t. A straw man teaches nothing.' },
    { id: 'l3', prompt: 'How can Kavya tell whether the new page works?', hint: 'Watch someone use it.', options: [{ id: 'a', label: 'Count the words' }, { id: 'b', label: 'Ask the team if they like it' }, { id: 'c', label: 'Give a new designer three real questions and time how long each answer takes to find' }, { id: 'd', label: 'Check it has every heading' }], correct: 'c', explanation: 'Docs are a product too. Test them with tasks, the way rs.4 tests a screen.' },
    { id: 'l4', prompt: 'Imran asks the same question in Slack that the docs answer. Kavya should…', hint: 'Two jobs: help him, fix the leak.', options: [{ id: 'a', label: 'Tell him to read the docs' }, { id: 'b', label: 'Answer with a link to the exact line, and ask why he didn’t find it there' }, { id: 'c', label: 'Ignore it' }, { id: 'd', label: 'Copy the whole page into Slack' }], correct: 'b', explanation: 'Repeated questions show where the docs fail. Each one is a finding.' },
    { id: 'l5', prompt: 'Why list “when not to use it”, not just “when to use it”?', hint: 'Think about Imran’s red button.', options: [{ id: 'a', label: 'To make the page longer' }, { id: 'b', label: 'Most misuse is a component used where a nearby one fits better; naming the alternative prevents it' }, { id: 'c', label: 'It’s a legal requirement' }, { id: 'd', label: 'Because nobody reads the use-for section' }], correct: 'b', explanation: '“Don’t use a button to go somewhere: use a link” stops the most common mistake by pointing at the right component.' },
  ],
};
