// Episodes for chapter ds.2 · Tokens & foundations. Drafts by Claude, for review.
// One product runs through the chapter: Kavya, the designer who looks after Rasta’s design system (Rasta sells monthly
// bus passes in Chennai), with Arjun, the front-end developer who uses her tokens. Selvi, a nurse who rides home on
// the night bus, is the rider. ds.1 covered what a token is; this chapter is about how a token set is built: the
// three tiers, modes and themes, and names people can guess.
import type { Episode } from '../episode';

export const ds2_1: Episode = {
  lessonId: 'ds.2-1',
  hook: 'Marketing wants Pongal-gold buttons for one week. Kavya changes one token and the links turn gold too. Watch a flat token list become three tiers, so each change lands exactly where it should.',
  scene: {
    id: 'token-tiers', duration: 34,
    beats: [
      { at: 0, title: 'One flat list', body: 'Rasta’s pass screen: the Renew button, the active tab, the auto-renew toggle and the fare-chart link all use teal-700 directly.' },
      { at: 5, title: 'Pongal week', body: 'Marketing wants every primary action gold for the festival, links unchanged. Kavya edits teal-700. The links turn gold too, and so does everything else that was teal.' },
      { at: 10, title: 'Tier 1: primitives', body: 'The palette and scales, named for what they are: teal-700, amber-700, red-600, radius-8. No primitive knows where it’s used.' },
      { at: 15, title: 'Tier 2: semantic', body: 'Jobs that point at primitives: color-action-primary → teal-700, color-text-link → teal-700. Two jobs can share a value and still be changed apart.' },
      { at: 20, title: 'Tier 3: component', body: 'Only where a component needs its own handle: button-primary-bg → color-action-primary, tab-indicator-color → color-action-primary.' },
      { at: 24, title: 'Edit the right tier', body: 'Point color-action-primary at amber-700. The button, the tab and the toggle turn gold. The link stays teal. After Pongal, point it back.' },
      { at: 29, title: 'The smallest tier that does the whole job', body: 'Raw value everywhere: primitive. A role: semantic. One component: component.' },
    ],
  },
  check: [
    { id: 'c1', prompt: 'Why did the links turn gold?', options: [{ id: 'a', label: 'A bug in the code' }, { id: 'b', label: 'Links and buttons used the same raw value, with nothing to tell their jobs apart' }, { id: 'c', label: 'Links are always the brand colour' }],
      correct: 'b', explanation: 'With a flat list, editing the value edits every use. A semantic tier gives the link and the button separate handles.' },
    { id: 'c2', prompt: 'Which tier did Kavya edit for Pongal week?', options: [{ id: 'a', label: 'Primitive' }, { id: 'b', label: 'Semantic' }, { id: 'c', label: 'Component' }],
      correct: 'b', explanation: 'She repointed color-action-primary. Every primary action changed and nothing else did.' },
  ],
  game: {
    id: 'tier-edit', title: 'Edit the right tier',
    instructions: 'Each request is a change to Rasta’s pass screen. Pick the tier you’d edit. The token chain lights up, the screen changes, and anything that changed by mistake is ringed in red.',
    lanes: [
      { id: 'primitive', label: 'Primitive', hint: 'Change a raw value everywhere it’s used' },
      { id: 'semantic', label: 'Semantic', hint: 'Change what one job points at' },
      { id: 'component', label: 'Component', hint: 'Change one part of one component' },
    ],
    cards: [
      { id: 'g1', label: 'The brand team retunes Rasta’s teal itself: teal-700 gets a little deeper, everywhere it appears', lane: 'primitive', visual: 'teal-700:#0B5F59', note: 'A palette refresh is a primitive edit. Every job that points at teal-700, buttons and links alike, follows on its own.' },
      { id: 'g2', label: 'For Pongal week, every primary action turns gold. Links stay teal', lane: 'semantic', visual: 'color-action-primary:amber-700', note: 'Repoint color-action-primary at amber-700. Editing teal-700 would turn the links gold too.' },
      { id: 'g3', label: 'Buttons get softer corners, 16 px. Inputs keep their 8 px', lane: 'component', visual: 'button-radius:radius-16', note: 'Only button-radius moves. radius-control is shared with the input, so changing it would round the UPI box as well.' },
      { id: 'g4', label: 'Every container, the pass card and the expiry banner, gets rounder: 20 px instead of 16', lane: 'semantic', visual: 'radius-container:radius-20', note: 'Point radius-container at radius-20. Don’t set radius-16 to 20 px: a primitive named 16 that holds 20 is a lie everyone will trip on.' },
      { id: 'g5', label: 'The red in the palette is warmed slightly, wherever red-600 is used', lane: 'primitive', visual: 'red-600:#D92D20', note: 'The colour itself is changing, not its job, so edit the primitive. Check the new value still passes 4.5:1 on white.' },
      { id: 'g6', label: 'The header is now dark teal, so the active-tab line must be white. Buttons and the toggle stay teal', lane: 'component', visual: 'tab-indicator-color:white', note: 'One component needs an exception, which is what component tokens are for. color-action-primary would also turn the button and toggle white.' },
      { id: 'g7', label: 'Card titles should read a touch softer, grey-800. The dark header must stay grey-900', lane: 'semantic', visual: 'color-text-primary:grey-800', note: 'Repoint color-text-primary at grey-800. grey-900 also paints the header, so editing the primitive would lighten it.' },
    ],
  },
  gap: {
    id: 'gap', from: 5, at: 9.6,
    prompt: 'The links turned gold along with the buttons. What does Kavya need?',
    options: [{ id: 'a', label: 'A second teal, teal-700-links, with the same value' }, { id: 'b', label: 'A tier between the palette and the screen: names for jobs, like color-action-primary and color-text-link' }, { id: 'c', label: 'To change the buttons by hand for the week' }],
    correct: 'b', explanation: 'Semantic tokens give each job its own handle. Both can point at teal-700 until the day they need to differ.',
  },
  takeaways: [
    { title: 'Three tiers', body: 'Primitives hold values, semantic tokens give them jobs, component tokens give one component its own handle.' },
    { title: 'Components never use primitives', body: 'A button points at color-action-primary, never at teal-700, so a role can change without touching the palette.' },
    { title: 'Edit the smallest tier that does the whole job', body: 'Palette change: primitive. A role: semantic. One component’s exception: component.' },
    { title: 'Repoint, don’t redefine', body: 'Need 20 px corners? Point the role at radius-20. A primitive’s name must keep matching its value.' },
  ],
  quiz: {
    seconds: 12,
    questions: [
      { id: 'q1', prompt: 'teal-700 is a…', options: [{ id: 'a', label: 'Primitive token' }, { id: 'b', label: 'Component token' }], correct: 'a', explanation: 'A raw value, named for what it is.' },
      { id: 'q2', prompt: 'color-action-primary is a…', options: [{ id: 'a', label: 'Primitive token' }, { id: 'b', label: 'Component token' }, { id: 'c', label: 'Semantic token' }], correct: 'c', explanation: 'It names a job, not a colour.' },
      { id: 'q3', prompt: 'A button’s fill should reference…', options: [{ id: 'a', label: '#0F766E' }, { id: 'b', label: 'A semantic token, through its component token' }, { id: 'c', label: 'teal-700 directly' }, { id: 'd', label: 'Whatever the last screen used' }], correct: 'b', explanation: 'Component → semantic → primitive.' },
      { id: 'q4', prompt: 'Only the toggle needs a new colour. Edit the…', options: [{ id: 'a', label: 'Primitive' }, { id: 'b', label: 'Semantic token' }, { id: 'c', label: 'Whole palette' }, { id: 'd', label: 'Component token' }], correct: 'd', explanation: 'One component, one handle.' },
    ],
  },
  ladder: [
    { id: 'l1', prompt: 'Does every component need its own component tokens?', hint: 'What do they cost?', options: [{ id: 'a', label: 'Yes, every property of every component' }, { id: 'b', label: 'No. Add them where a component needs its own handle; otherwise point straight at semantic tokens' }, { id: 'c', label: 'No, component tokens are never useful' }, { id: 'd', label: 'Only for buttons' }], correct: 'b', explanation: 'Thousands of one-to-one component tokens become a list nobody can maintain. Add the tier where exceptions are likely.' },
    { id: 'l2', prompt: 'Two semantic tokens point at the same primitive. Is that duplication?', hint: 'Will they always match?', options: [{ id: 'a', label: 'Yes, merge them' }, { id: 'b', label: 'Only if they have different names' }, { id: 'c', label: 'No. They share a value today and can be pulled apart tomorrow' }, { id: 'd', label: 'Yes, delete one' }], correct: 'c', explanation: 'That’s why links and buttons survived Pongal week.' },
    { id: 'l3', prompt: 'Why should designers avoid using primitives directly in mock-ups?', hint: 'Think about dark mode.', options: [{ id: 'a', label: 'Primitives are slower in Figma' }, { id: 'b', label: 'A screen built on teal-700 can’t follow a role change or a mode switch' }, { id: 'c', label: 'Primitives are private to developers' }, { id: 'd', label: 'There’s no reason' }], correct: 'b', explanation: 'Modes and themes swap values at the semantic tier. Skip it and the screen is stuck in one mode.' },
    { id: 'l4', prompt: 'In Figma, how is the three-tier chain usually built?', hint: 'Variables can point at other variables.', options: [{ id: 'a', label: 'One big colour style per screen' }, { id: 'b', label: 'Text notes on the canvas' }, { id: 'c', label: 'Copying hex codes into a spreadsheet' }, { id: 'd', label: 'A primitives collection, and semantic variables that alias it' }], correct: 'd', explanation: 'Aliasing is the same chain in Figma. In code it becomes CSS variables that reference each other.' },
    { id: 'l5', prompt: 'The W3C Design Tokens Community Group format writes a reference like this. Which one?', hint: 'Curly braces.', options: [{ id: 'a', label: '"$value": "{color.teal.700}"' }, { id: 'b', label: '"$value": "teal-700()"' }, { id: 'c', label: '"$value": "#teal700"' }, { id: 'd', label: '"$value": "@teal-700"' }], correct: 'a', explanation: 'An alias in braces points one token at another, so tools like Style Dictionary can build the chain into CSS, iOS and Android.' },
  ],
};

export const ds2_2: Episode = {
  lessonId: 'ds.2-2',
  hook: 'At 11 pm on the last bus, Selvi opens Rasta and the white screen lights up the whole bus. Watch dark mode built properly: not inverted, but tuned token by token.',
  scene: {
    id: 'mode-swap', duration: 34,
    beats: [
      { at: 0, title: 'The night bus', body: 'Selvi is coming off a night shift. Her pass screen is a bright white rectangle in a dark bus.' },
      { at: 5, title: 'Just invert it?', body: 'Flip every colour: the page goes pure black, the teal turns salmon pink, the error red turns cyan. Same contrast maths, wrong meaning.' },
      { at: 10, title: 'Modes live in the semantic tier', body: 'Each semantic colour gets a light value and a dark value. The components don’t change; they still ask for color-action-primary.' },
      { at: 15, title: 'Dark grey, raised is lighter', body: 'The page is grey-900, not black. The pass card sits one step lighter, grey-800, because shadows barely show on dark.' },
      { at: 19, title: 'Accents step lighter', body: 'teal-700 is only 3.2:1 on the dark page. teal-500 reaches 7.1:1, and its label flips to dark text.' },
      { at: 24, title: 'Every pair, checked', body: 'Text, secondary text, error, warning, borders: each dark value is checked against what it sits on, not guessed.' },
      { at: 29, title: 'Themes are the same trick', body: 'Rasta for Business swaps teal for indigo. Two themes × two modes: four sets of values, one set of components.' },
    ],
  },
  check: [
    { id: 'c1', prompt: 'What went wrong with inverting?', options: [{ id: 'a', label: 'Nothing, it’s the standard way' }, { id: 'b', label: 'Colours lost their meaning, and pure black against white text glares' }, { id: 'c', label: 'It made the app slower' }],
      correct: 'b', explanation: 'Inverting flips hues too: brand teal turns pink and error red turns cyan.' },
    { id: 'c2', prompt: 'Where do the dark values live?', options: [{ id: 'a', label: 'In each component' }, { id: 'b', label: 'In the semantic tier: one light and one dark value per token' }, { id: 'c', label: 'In a separate dark-mode app' }],
      correct: 'b', explanation: 'Components ask for a job; the mode decides the value.' },
  ],
  game: {
    id: 'mode-tune', title: 'Tune the night mode',
    instructions: 'Each of Rasta’s semantic colours starts at its light-mode value on the dark pass screen. Slide along its ramp until it does its job at night, then set it. The contrast is shown live; the rule is under the slider.',
    lanes: [
      { id: 'surface', label: 'Surface', hint: 'Dark grey, never pure black. Raised layers go lighter, not shadowed.' },
      { id: 'text', label: 'Text', hint: 'Off-white, not glaring white. Secondary text still clears 4.5:1.' },
      { id: 'accent', label: 'Accent', hint: 'Lighter than in light mode, so it clears 4.5:1 on the dark page without glowing.' },
      { id: 'border', label: 'Border', hint: 'Visible on the dark page, but quiet: under 3:1.' },
    ],
    cards: [
      { id: 'g1', label: 'color-surface-page, the page behind everything', lane: 'surface', visual: 'color-surface-page', note: 'grey-900 or 950: dark enough that body text sits above 15:1, without the smear of pure black on OLED screens when you scroll.' },
      { id: 'g2', label: 'color-surface-raised, the pass card and the bottom sheet', lane: 'surface', visual: 'color-surface-raised', note: 'grey-800, one step lighter than the page. In dark mode, higher layers get lighter, because a shadow on a dark page is almost invisible.' },
      { id: 'g3', label: 'color-text-primary, the pass name and every heading', lane: 'text', visual: 'color-text-primary', note: 'A light grey such as grey-100 or 200. Pure white on near-black is so sharp that letters seem to bleed, especially for people with astigmatism.' },
      { id: 'g4', label: 'color-text-secondary, “Valid till 30 Nov” and the stop names', lane: 'text', visual: 'color-text-secondary', note: 'grey-400: quieter than the headings and still 6.9:1. The light-mode grey-600 sinks to 2.3:1 on the dark page.' },
      { id: 'g5', label: 'color-action-primary, the Renew button', lane: 'accent', visual: 'color-action-primary', note: 'teal-600 to 400. teal-700, the light-mode value, drops to 3.2:1. Its label flips to dark text, which is its own token: color-text-on-action.' },
      { id: 'g6', label: 'color-feedback-error, “Payment failed. Try another UPI app”', lane: 'accent', visual: 'color-feedback-error', note: 'red-500 to 300. red-600 is only 3.7:1 at night, and an error nobody can read is worse than none.' },
      { id: 'g7', label: 'color-feedback-warning, “Your pass ends in 2 days”', lane: 'accent', visual: 'color-feedback-warning', note: 'amber-600 to 400. The pale ends of the ramp glow like a sign on a dark page and stop looking like a warning.' },
      { id: 'g8', label: 'color-border-default, the line between the pass card and the trips list', lane: 'border', visual: 'color-border-default', note: 'grey-700 or 600. The light-mode grey-300 is 12:1 at night: a bright outline round everything. A border that alone marks an input needs 3:1; this one only separates.' },
    ],
  },
  gap: {
    id: 'gap', from: 15, at: 18.6,
    prompt: 'The Renew button keeps teal-700 at night and scores 3.2:1 on the dark page. What should Kavya do?',
    options: [{ id: 'a', label: 'Keep it: brand colours never change' }, { id: 'b', label: 'Give color-action-primary a lighter dark-mode value, like teal-500, and a dark label' }, { id: 'c', label: 'Add a white outline round the button' }],
    correct: 'b', explanation: 'The role stays the same; its value per mode changes. teal-500 reaches 7.1:1 and still reads as Rasta’s teal.',
  },
  takeaways: [
    { title: 'Modes swap semantic values', body: 'Each semantic colour has a light and a dark value. Components never know which mode they’re in.' },
    { title: 'Don’t invert', body: 'Dark grey, not black. Off-white text. Raised layers lighter. Accents a step or two lighter.' },
    { title: 'Check each pair', body: 'Every dark value is measured against what it sits on: 4.5:1 for text, 3:1 for controls.' },
    { title: 'Themes work the same way', body: 'A second brand swaps the values behind the same names. Themes × modes, one set of components.' },
  ],
  quiz: {
    seconds: 12,
    questions: [
      { id: 'q1', prompt: 'A dark page should be…', options: [{ id: 'a', label: 'Dark grey' }, { id: 'b', label: 'Pure black' }], correct: 'a', explanation: 'Softer against light text.' },
      { id: 'q2', prompt: 'In dark mode, a raised card is…', options: [{ id: 'a', label: 'Darker than the page' }, { id: 'b', label: 'The same as the page, with a shadow' }, { id: 'c', label: 'A step lighter than the page' }], correct: 'c', explanation: 'Elevation shows as lightness.' },
      { id: 'q3', prompt: 'The brand teal in dark mode is usually…', options: [{ id: 'a', label: 'Unchanged' }, { id: 'b', label: 'A step or two lighter' }, { id: 'c', label: 'Inverted' }, { id: 'd', label: 'Removed' }], correct: 'b', explanation: 'To hold contrast on dark.' },
      { id: 'q4', prompt: 'Which tier holds the per-mode values?', options: [{ id: 'a', label: 'Component' }, { id: 'b', label: 'Primitive' }, { id: 'c', label: 'Semantic' }, { id: 'd', label: 'None' }], correct: 'c', explanation: 'Roles map to different primitives per mode.' },
    ],
  },
  ladder: [
    { id: 'l1', prompt: 'Should primitives change between light and dark mode?', hint: 'teal-500 is teal-500 at noon and at midnight.', options: [{ id: 'a', label: 'No. The palette stays; semantic tokens point at different steps in each mode' }, { id: 'b', label: 'Yes, every primitive needs a dark twin' }, { id: 'c', label: 'Only the greys' }, { id: 'd', label: 'Yes, invert them' }], correct: 'a', explanation: 'One palette, two mappings. That keeps the modes easy to compare and audit.' },
    { id: 'l2', prompt: 'Why can’t a mode switch just swap the whole grey ramp end to end (50 ↔ 950)?', hint: 'Do surfaces and text move the same distance?', options: [{ id: 'a', label: 'It can, that’s all dark mode is' }, { id: 'b', label: 'Ramps can’t be reversed' }, { id: 'c', label: 'Text, surfaces and borders each need their own tuning; a mirror makes borders glare and secondary text too faint' }, { id: 'd', label: 'Because of fonts' }], correct: 'c', explanation: 'A mirror sends the page to near-black and every colour to whichever step lands opposite, and nothing checks the new pairs. Tune and measure each one.' },
    { id: 'l3', prompt: 'Rasta adds a high-contrast mode for riders with low vision. Where does it go?', hint: 'It’s another set of values.', options: [{ id: 'a', label: 'A new set of components' }, { id: 'b', label: 'A third mode in the semantic tier, with bigger contrast targets (7:1 and up)' }, { id: 'c', label: 'A setting that makes everything bold' }, { id: 'd', label: 'It can’t be done with tokens' }], correct: 'b', explanation: 'Modes are just more columns of values behind the same names.' },
    { id: 'l4', prompt: 'How does the app know which mode to show by default?', hint: 'The phone already knows.', options: [{ id: 'a', label: 'It guesses from the time of day' }, { id: 'b', label: 'It asks on every launch' }, { id: 'c', label: 'It always starts light' }, { id: 'd', label: 'It follows the system setting (prefers-color-scheme on the web), with an in-app override' }], correct: 'd', explanation: 'Respect the phone’s setting, and let people override it in Settings.' },
    { id: 'l5', prompt: 'Rasta for Business is indigo, in light and dark. How many sets of semantic values?', hint: 'Themes × modes.', options: [{ id: 'a', label: 'Two' }, { id: 'b', label: 'Three' }, { id: 'c', label: 'Four: two themes, each with a light and a dark mode' }, { id: 'd', label: 'Eight' }], correct: 'c', explanation: 'Each combination is a column of values. The components stay one set.' },
  ],
};

export const ds2_3: Episode = {
  lessonId: 'ds.2-3',
  hook: 'Arjun has to pick between tealNew, primaryBtnFinal and blue2. He guesses, and ships the wrong teal. Watch a token file get a grammar, so the right name is the one you’d guess.',
  scene: {
    id: 'token-names', duration: 34,
    beats: [
      { at: 0, title: 'The file nobody trusts', body: 'Rasta’s token file after two years: tealNew, primaryBtnFinal, blue2, color-grey-light, hover-primary, space17.' },
      { at: 5, title: 'Arjun guesses', body: 'He needs the Renew button’s hover colour. Three names look right. He picks blue2, which is from the old logo.' },
      { at: 10, title: 'One grammar', body: 'Category, concept, variant, state, always in that order: color-action-primary-hover.' },
      { at: 15, title: 'Name the job, not the look', body: 'color-grey-light becomes color-text-secondary. Hues and shades belong to primitives, never to roles.' },
      { at: 20, title: 'No new, final or 2', body: 'tealNew and primaryBtnFinal mean “someone changed this once”. They become one name with a job.' },
      { at: 24, title: 'One style', body: 'camelCase, snake_case and kebab-case in one file means three ways to spell every token. Pick one: kebab-case.' },
      { at: 29, title: 'Names you can guess', body: 'Arjun types color-action- and autocomplete offers primary, primary-hover, secondary, danger. He gets it right first time.' },
    ],
  },
  check: [
    { id: 'c1', prompt: 'Why did Arjun pick the wrong token?', options: [{ id: 'a', label: 'He was careless' }, { id: 'b', label: 'Three names could have meant the same thing, and none said what it was for' }, { id: 'c', label: 'The token file was too short' }],
      correct: 'b', explanation: 'When names don’t say their job, people guess.' },
    { id: 'c2', prompt: 'What order does Rasta’s grammar use?', options: [{ id: 'a', label: 'State, variant, category' }, { id: 'b', label: 'Any order, as long as it’s short' }, { id: 'c', label: 'Category, concept, variant, state' }],
      correct: 'c', explanation: 'From general to specific, with the state always last.' },
  ],
  game: {
    id: 'token-rename', title: 'Rename the token',
    instructions: 'Each bad name is from Rasta’s old token file, with what it’s used for. First say what’s wrong with it, then build the good name from tiles, in the grammar’s order.',
    lanes: [
      { id: 'look', label: 'Names the look', hint: 'A colour or shade where the job should be' },
      { id: 'order', label: 'Wrong order', hint: 'The right words, out of order' },
      { id: 'vague', label: 'Vague or versioned', hint: 'new, final, 2: history, not meaning' },
      { id: 'style', label: 'Mixed style', hint: 'camelCase or snake_case in a kebab-case file' },
    ],
    cards: [
      { id: 'g1', label: 'color-red · error messages and the border of a wrong UPI ID', lane: 'look', visual: 'color-feedback-error', note: 'Say what it’s for. If errors ever turn orange, color-red would be a lie.' },
      { id: 'g2', label: 'color-teal-button · the fill of the Renew button, the active tab and the toggle', lane: 'look', visual: 'color-action-primary', note: 'It’s used by three components, so the name is the job they share. Teal belongs to the primitive behind it.' },
      { id: 'g3', label: 'color-grey-light · “Valid till 30 Nov” and the stop names under each trip', lane: 'look', visual: 'color-text-secondary', note: 'At night this text is a lighter grey on a dark page, so “light” stops meaning anything. The role holds in both modes.' },
      { id: 'g4', label: 'hover-color-action-primary · the Renew button’s fill under the mouse', lane: 'order', visual: 'color-action-primary-hover', note: 'Category first, state last. Then every hover token sorts next to its base token.' },
      { id: 'g5', label: 'color-disabled-text · text on anything that can’t be used yet', lane: 'order', visual: 'color-text-disabled', note: 'Concept before state: color-text-disabled sits with color-text-primary and color-text-secondary.' },
      { id: 'g6', label: 'color-surface-new · the background of cards and sheets since the redesign', lane: 'vague', visual: 'color-surface-raised', note: 'New is only new until the next redesign. Raised says what it does: sits above the page.' },
      { id: 'g7', label: 'color-border-final-2 · the line between the pass card and the trips list', lane: 'vague', visual: 'color-border-default', note: 'final-2 is a version history. Keep versions in git; the name only needs the job.' },
      { id: 'g8', label: 'buttonPrimaryBg · the primary button’s fill, as a component token', lane: 'style', visual: 'button-primary-bg', note: 'The words were right. Kebab-case keeps it in step with the rest of the file and with CSS variables: --button-primary-bg.' },
      { id: 'g9', label: 'color_text_primary · pass names and headings', lane: 'style', visual: 'color-text-primary', note: 'Same words, one style. Mixed styles mean three spellings to search for every token.' },
    ],
  },
  gap: {
    id: 'gap', from: 5, at: 9.6,
    prompt: 'Arjun guessed blue2 and got the old logo colour. What fixes this for good?',
    options: [{ id: 'a', label: 'A wiki page explaining each token' }, { id: 'b', label: 'Ask Kavya every time' }, { id: 'c', label: 'A naming grammar, so the right name is the one you’d guess, and old names are removed' }],
    correct: 'c', explanation: 'Docs help, but a name that says its job and follows one pattern needs no lookup.',
  },
  takeaways: [
    { title: 'One grammar, one order', body: 'Category, concept, variant, state: color-action-primary-hover.' },
    { title: 'Roles, not looks', body: 'Hues and shade numbers belong to primitives. Semantic names say the job.' },
    { title: 'No history in names', body: 'new, final, old and 2 go. Deprecate the old name and point it at the new one until it’s removed.' },
    { title: 'One style', body: 'Pick kebab-case (or the platform’s own) and use it everywhere.' },
  ],
  quiz: {
    seconds: 12,
    questions: [
      { id: 'q1', prompt: 'Which name follows the grammar?', options: [{ id: 'a', label: 'color-text-secondary' }, { id: 'b', label: 'secondaryTextGrey' }], correct: 'a', explanation: 'Category, concept, variant, in kebab-case.' },
      { id: 'q2', prompt: 'Where does the state go?', options: [{ id: 'a', label: 'First' }, { id: 'b', label: 'Anywhere' }, { id: 'c', label: 'Last' }], correct: 'c', explanation: 'color-action-primary-hover.' },
      { id: 'q3', prompt: 'What’s wrong with color-blue-link?', options: [{ id: 'a', label: 'It’s too short' }, { id: 'b', label: 'Links can’t have tokens' }, { id: 'c', label: 'It’s fine' }, { id: 'd', label: 'It names the look; the link may not stay blue' }], correct: 'd', explanation: 'color-text-link names the job.' },
      { id: 'q4', prompt: 'A semantic token is renamed. The old name should…', options: [{ id: 'a', label: 'Be deleted that afternoon' }, { id: 'b', label: 'Stay forever' }, { id: 'c', label: 'Point at the new name, marked deprecated, until uses are moved' }, { id: 'd', label: 'Be renamed again' }], correct: 'c', explanation: 'Nothing breaks, and the warning moves people over.' },
    ],
  },
  ladder: [
    { id: 'l1', prompt: 'Primitives are named teal-700, grey-900. Isn’t that “naming the look”?', hint: 'Which tier are they in?', options: [{ id: 'a', label: 'Yes, rename them too' }, { id: 'b', label: 'That’s correct for primitives: they are the look. Only semantic and component names must say the job' }, { id: 'c', label: 'Primitives shouldn’t have names' }, { id: 'd', label: 'Only in dark mode' }], correct: 'b', explanation: 'Each tier names what it holds: values, jobs, or one component’s part.' },
    { id: 'l2', prompt: 'Why do numbered steps like grey-100 to grey-900 beat light, lighter, lightest?', hint: 'Where would a new shade go?', options: [{ id: 'a', label: 'Numbers are shorter' }, { id: 'b', label: 'They sort in order and leave room: grey-850 can slot in later' }, { id: 'c', label: 'Words are banned' }, { id: 'd', label: 'There’s no difference' }], correct: 'b', explanation: 'Comparatives run out (“extra-lightest”) and don’t sort.' },
    { id: 'l3', prompt: 'Spacing tokens: space-4 (meaning 16 px) or space-16?', hint: 'Both are common. What matters?', options: [{ id: 'a', label: 'Only space-16 is valid' }, { id: 'b', label: 'Only space-4 is valid' }, { id: 'c', label: 'Pick one rule (a step number or the pixel value), write it down, and never mix them' }, { id: 'd', label: 'Use both for flexibility' }], correct: 'c', explanation: 'Mixed schemes make space-8 mean 8 px in one place and 32 px in another.' },
    { id: 'l4', prompt: 'Why does kebab-case suit tokens on the web?', hint: 'What do they become in CSS?', options: [{ id: 'a', label: 'It’s shorter' }, { id: 'b', label: 'It’s required by Figma' }, { id: 'c', label: 'It sorts better' }, { id: 'd', label: 'CSS custom properties use it, so --color-action-primary matches the Figma name exactly' }], correct: 'd', explanation: 'Build tools can turn it into camelCase for iOS and Android, so one source name works everywhere.' },
    { id: 'l5', prompt: 'A new designer wants to add color-action-primary-hover-dark. What’s the problem?', hint: 'Where do modes live?', options: [{ id: 'a', label: 'It’s too long' }, { id: 'b', label: 'The mode is in the name. Modes are values of one token, not separate tokens' }, { id: 'c', label: 'Hover can’t be dark' }, { id: 'd', label: 'Nothing' }], correct: 'b', explanation: 'color-action-primary-hover already has a dark value. A “-dark” token can’t follow a mode switch.' },
  ],
};
