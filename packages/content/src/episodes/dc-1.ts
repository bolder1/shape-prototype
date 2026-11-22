// Episodes for chapter dc.1 · Code literacy for designers. Drafts by Claude, for review.
import type { Episode } from '../episode';

export const dc1_1: Episode = {
  lessonId: 'dc.1-1',
  hook: 'Two pages look pixel-identical. One is a tree of meaningful elements; the other is 400 nested divs. Only one works for everyone.',
  scene: {
    id: 'dom-tree', duration: 34,
    beats: [
      { at: 0, title: 'A page you can see', body: 'A recipe page: logo and search at the top, links, the recipe, a footer.' },
      { at: 5, title: 'A tree you can’t', body: 'Underneath, the browser builds a tree: html, body, then header, nav, main and footer, each with children.' },
      { at: 11, title: 'Div soup', body: 'Built only from divs, the tree has no meaning. To a screen reader, it’s one long blur.' },
      { at: 17, title: 'Landmarks', body: 'With header, nav, main and footer, a screen reader user can jump straight to the recipe.' },
      { at: 23, title: 'Real buttons', body: 'A <button> can be reached with Tab and pressed with Enter. A clickable <div> can’t, unless someone rebuilds all that by hand.' },
      { at: 29, title: 'Say what it is', body: 'Pick elements for meaning, not looks. The styling comes from CSS.' },
    ],
  },
  check: [
    { id: 'c1', prompt: 'What is the DOM?', options: [{ id: 'a', label: 'A design tool' }, { id: 'b', label: 'The tree of elements the browser builds from HTML' }, { id: 'c', label: 'A colour format' }],
      correct: 'b', explanation: 'Document Object Model: the page as a tree.' },
    { id: 'c2', prompt: 'How did landmarks help the screen reader user?', options: [{ id: 'a', label: 'They made text bigger' }, { id: 'b', label: 'They let them jump straight to the main content' }, { id: 'c', label: 'They added colour' }],
      correct: 'b', explanation: 'Landmarks are shortcuts through the page.' },
  ],
  game: {
    id: 'tag-match', title: 'Tag the page',
    instructions: 'A recipe page in wireframe. Drag each part onto the landmark element that should hold it, or tap the region.',
    lanes: [
      { id: 'header', label: '<header>', hint: 'The top bar: logo, search, account' },
      { id: 'nav', label: '<nav>', hint: 'Links for getting around the site' },
      { id: 'main', label: '<main>', hint: 'This page’s own content' },
      { id: 'footer', label: '<footer>', hint: 'Bottom info: legal, contact, social' },
    ],
    cards: [
      { id: 'g1', label: 'The site logo', lane: 'header' },
      { id: 'g2', label: 'Links to Recipes, Videos and Shop', lane: 'nav' },
      { id: 'g3', label: 'The recipe title, steps and photos', lane: 'main' },
      { id: 'g4', label: 'Copyright and privacy policy', lane: 'footer' },
      { id: 'g5', label: 'The search box at the top', lane: 'header' },
      { id: 'g6', label: 'A breadcrumb: Home › Dinners › Dal', lane: 'nav' },
      { id: 'g7', label: 'The ingredients list and the “Save recipe” button', lane: 'main' },
      { id: 'g8', label: 'Social links and the company address', lane: 'footer' },
    ],
  },
  gap: {
    id: 'gap', from: 11, at: 16.4,
    prompt: 'The page is all divs. What gives a screen reader user a way to jump to the recipe?',
    options: [{ id: 'a', label: 'Bigger fonts' }, { id: 'b', label: 'Landmark elements: header, nav, main, footer' }, { id: 'c', label: 'More colours' }],
    correct: 'b', explanation: 'Landmarks announce the page’s regions and allow jumping between them.',
  },
  takeaways: [
    { title: 'Pages are trees', body: 'HTML nests elements; the browser builds the DOM from them.' },
    { title: 'Meaning, not looks', body: 'header, nav, main, footer, button, h1: pick by what it is.' },
    { title: 'Free accessibility', body: 'Native elements bring keyboard support and screen reader meaning.' },
  ],
  quiz: {
    seconds: 12,
    questions: [
      { id: 'q1', prompt: 'Site links usually go in…', options: [{ id: 'a', label: '<nav>' }, { id: 'b', label: '<footer>' }], correct: 'a', explanation: 'Navigation.' },
      { id: 'q2', prompt: 'A clickable action should be a…', options: [{ id: 'a', label: '<div>' }, { id: 'b', label: '<button>' }, { id: 'c', label: '<span>' }], correct: 'b', explanation: 'Keyboard and screen reader support.' },
      { id: 'q3', prompt: 'The page’s own content goes in…', options: [{ id: 'a', label: '<header>' }, { id: 'b', label: '<nav>' }, { id: 'c', label: '<footer>' }, { id: 'd', label: '<main>' }], correct: 'd', explanation: 'One per page.' },
      { id: 'q4', prompt: 'The DOM is…', options: [{ id: 'a', label: 'A CSS file' }, { id: 'b', label: 'A server' }, { id: 'c', label: 'The tree of elements' }, { id: 'd', label: 'A font' }], correct: 'c', explanation: 'Document Object Model.' },
    ],
  },
  ladder: [
    { id: 'l1', prompt: 'How many <h1> headings should a page usually have?', hint: 'The page title.', options: [{ id: 'a', label: 'One, for the page’s main title' }, { id: 'b', label: 'As many as you like' }, { id: 'c', label: 'None' }, { id: 'd', label: 'One per section' }], correct: 'a', explanation: 'Then h2 for sections, h3 inside them.' },
    { id: 'l2', prompt: 'Link or button?', hint: 'Go somewhere vs. do something.', options: [{ id: 'a', label: 'Always a button' }, { id: 'b', label: 'Links go to a page or place; buttons perform an action' }, { id: 'c', label: 'Always a link' }, { id: 'd', label: 'There’s no difference' }], correct: 'b', explanation: '“View order” is a link; “Cancel order” is a button.' },
    { id: 'l3', prompt: 'Why does a <label> for an input matter?', hint: 'Click and announce.', options: [{ id: 'a', label: 'It’s decorative' }, { id: 'b', label: 'Search engines need it' }, { id: 'c', label: 'Screen readers announce it, and clicking it focuses the field' }, { id: 'd', label: 'It changes colour' }], correct: 'c', explanation: 'Placeholders aren’t labels.' },
    { id: 'l4', prompt: 'In browser dev tools, what does the Elements panel show?', hint: 'Inspect.', options: [{ id: 'a', label: 'Network speed' }, { id: 'b', label: 'Passwords' }, { id: 'c', label: 'Server logs' }, { id: 'd', label: 'The live DOM tree and the CSS applied to each element' }], correct: 'd', explanation: 'Right-click → Inspect on any website.' },
    { id: 'l5', prompt: 'How can a designer’s file help developers pick the right elements?', hint: 'Name things.', options: [{ id: 'a', label: 'Name layers and components by meaning (Header, Nav, Primary button) and mark headings' }, { id: 'b', label: 'Use only images' }, { id: 'c', label: 'Flatten all layers' }, { id: 'd', label: 'Avoid naming' }], correct: 'a', explanation: 'Semantic names in design become semantic code.' },
  ],
};

export const dc1_2: Episode = {
  lessonId: 'dc.1-2',
  hook: 'Auto layout is flexbox wearing a Figma costume. Learn the real names and your specs stop getting “interpreted”.',
  scene: {
    id: 'box-model', duration: 34,
    beats: [
      { at: 0, title: 'Every element is a box', body: 'Content in the middle, padding around it, then the border, then margin outside.' },
      { at: 6, title: 'Flexbox: a row', body: 'Put three items in a flex container. They line up in a row, with a gap between them.' },
      { at: 11, title: 'Justify and align', body: 'justify-content spreads them along the row; align-items lines them up across it.' },
      { at: 17, title: 'Same as auto layout', body: 'Figma’s direction, gap, padding and alignment are the same ideas with friendlier names.' },
      { at: 23, title: 'Grid: rows and columns', body: 'For two dimensions, CSS grid places items into columns and rows at once, like a layout grid.' },
      { at: 29, title: 'Speak the developer’s language', body: 'Gap, padding, justify, align. Spec it in these words and it gets built as designed.' },
    ],
  },
  check: [
    { id: 'c1', prompt: 'Which sits outside the border?', options: [{ id: 'a', label: 'Padding' }, { id: 'b', label: 'Margin' }, { id: 'c', label: 'Content' }],
      correct: 'b', explanation: 'Margin is outside; padding is inside.' },
    { id: 'c2', prompt: 'Figma auto layout is closest to…', options: [{ id: 'a', label: 'CSS flexbox' }, { id: 'b', label: 'HTML tables' }, { id: 'c', label: 'JavaScript' }],
      correct: 'a', explanation: 'Direction, gap, padding, alignment.' },
  ],
  game: {
    id: 'flex-tune', title: 'Flex it',
    instructions: 'First, play with a flex container. Then, for each layout request, pick the CSS property that does it and watch it change.',
    lanes: [
      { id: 'direction', label: 'flex-direction', hint: 'Row or column' },
      { id: 'justify', label: 'justify-content', hint: 'Spread along the main direction' },
      { id: 'align', label: 'align-items', hint: 'Line up across it' },
      { id: 'gap', label: 'gap', hint: 'Space between items' },
    ],
    cards: [
      { id: 'g1', label: 'Put the three cards in a column instead of a row', lane: 'direction', visual: 'flex-direction: column' },
      { id: 'g2', label: 'Push the logo left and the menu right', lane: 'justify', visual: 'justify-content: space-between' },
      { id: 'g3', label: 'Line up the icon and its label along their middles', lane: 'align', visual: 'align-items: center' },
      { id: 'g4', label: 'Put 16px between the chips', lane: 'gap', visual: 'gap: 16px' },
      { id: 'g5', label: 'Centre the buttons in the bar', lane: 'justify', visual: 'justify-content: center' },
      { id: 'g6', label: 'Make every item in the row the same height', lane: 'align', visual: 'align-items: stretch' },
      { id: 'g7', label: 'Stack the form fields one under another', lane: 'direction', visual: 'flex-direction: column' },
      { id: 'g8', label: 'Leave 32px between the cards', lane: 'gap', visual: 'gap: 32px' },
    ],
  },
  gap: {
    id: 'gap', from: 11, at: 16.4,
    prompt: 'The logo should sit at the left and the menu at the right of the bar. Which value?',
    options: [{ id: 'a', label: 'justify-content: space-between' }, { id: 'b', label: 'align-items: center' }, { id: 'c', label: 'flex-direction: column' }],
    correct: 'a', explanation: 'space-between pushes the first and last items to the edges.',
  },
  takeaways: [
    { title: 'Box model', body: 'Content, padding, border, margin, from the inside out.' },
    { title: 'Flexbox', body: 'direction, justify-content, align-items, gap: one dimension.' },
    { title: 'Grid', body: 'Rows and columns at once, for page-level layout.' },
  ],
  quiz: {
    seconds: 12,
    questions: [
      { id: 'q1', prompt: 'Space between flex items is…', options: [{ id: 'a', label: 'gap' }, { id: 'b', label: 'border' }], correct: 'a', explanation: 'Like auto layout spacing.' },
      { id: 'q2', prompt: 'Stack items vertically with…', options: [{ id: 'a', label: 'align-items: center' }, { id: 'b', label: 'flex-direction: column' }, { id: 'c', label: 'gap: 0' }], correct: 'b', explanation: 'Column.' },
      { id: 'q3', prompt: 'Space inside the border is…', options: [{ id: 'a', label: 'Margin' }, { id: 'b', label: 'Gap' }, { id: 'c', label: 'Content' }, { id: 'd', label: 'Padding' }], correct: 'd', explanation: 'Inside.' },
      { id: 'q4', prompt: 'Two-dimensional layout uses…', options: [{ id: 'a', label: 'Flexbox only' }, { id: 'b', label: 'Margins' }, { id: 'c', label: 'CSS grid' }, { id: 'd', label: 'Tables' }], correct: 'c', explanation: 'Rows and columns.' },
    ],
  },
  ladder: [
    { id: 'l1', prompt: 'What does box-sizing: border-box change?', hint: 'What does width include?', options: [{ id: 'a', label: 'Width includes padding and border, like Figma frames' }, { id: 'b', label: 'It adds a border' }, { id: 'c', label: 'It removes margin' }, { id: 'd', label: 'Nothing' }], correct: 'a', explanation: 'Most sites set it everywhere so sizes behave predictably.' },
    { id: 'l2', prompt: 'Figma’s “Hug contents” and “Fill container” map to…', hint: 'Sizing.', options: [{ id: 'a', label: 'Colours' }, { id: 'b', label: 'Size to content vs. flex: 1 (take the remaining space)' }, { id: 'c', label: 'Fonts' }, { id: 'd', label: 'Borders' }], correct: 'b', explanation: 'Fill is like flex: 1 or width: 100%.' },
    { id: 'l3', prompt: 'Why can two margins between stacked blocks sometimes become one?', hint: 'Margin collapse.', options: [{ id: 'a', label: 'A bug' }, { id: 'b', label: 'Fonts' }, { id: 'c', label: 'Vertical margins between blocks collapse to the larger one' }, { id: 'd', label: 'Padding' }], correct: 'c', explanation: 'One reason many teams prefer gap in flex and grid layouts.' },
    { id: 'l4', prompt: 'A card grid should fit as many 240px columns as the screen allows. Which tool?', hint: 'Responsive without breakpoints.', options: [{ id: 'a', label: 'Fixed widths' }, { id: 'b', label: 'Absolute positioning' }, { id: 'c', label: 'A table' }, { id: 'd', label: 'CSS grid with repeat(auto-fill, minmax(240px, 1fr))' }], correct: 'd', explanation: 'Grid fills the row and wraps automatically.' },
    { id: 'l5', prompt: 'What’s the most useful spec detail for a developer building a card?', hint: 'Their vocabulary.', options: [{ id: 'a', label: 'Padding, gap, alignment and which tokens to use' }, { id: 'b', label: 'Pixel x/y positions of every element' }, { id: 'c', label: 'A screenshot only' }, { id: 'd', label: 'The Figma file name' }], correct: 'a', explanation: 'Relationships beat coordinates.' },
  ],
};

export const dc1_3: Episode = {
  lessonId: 'dc.1-3',
  hook: 'The Figma file is done. That’s roughly the start of the journey to production. Here’s the rest of it.',
  scene: {
    id: 'frontend-build', duration: 34,
    beats: [
      { at: 0, title: 'A Figma component', body: 'A Button with variants: primary and secondary, small and large, enabled and disabled.' },
      { at: 6, title: 'A code component', body: 'Developers build the same Button once, with props: size, variant, disabled. Tokens become CSS variables.' },
      { at: 12, title: 'Reused everywhere', body: 'The Button appears on every screen. Fix it once, and all of them get the fix.' },
      { at: 17, title: 'Data and state', body: 'An order list asks the server for data. While waiting, it shows loading; if empty, an empty state; if it fails, an error.' },
      { at: 23, title: 'Test, preview, ship', body: 'Automated tests run, the team reviews a preview link, and the change goes live.' },
      { at: 29, title: 'Design for the whole journey', body: 'Components, props, states and tokens: design in the shape code is built.' },
    ],
  },
  check: [
    { id: 'c1', prompt: 'What are props?', options: [{ id: 'a', label: 'Settings passed into a component, like size or variant' }, { id: 'b', label: 'Stage furniture' }, { id: 'c', label: 'Server errors' }],
      correct: 'a', explanation: 'Like Figma component properties.' },
    { id: 'c2', prompt: 'Why did the list need a loading state?', options: [{ id: 'a', label: 'For decoration' }, { id: 'b', label: 'Data from the server takes time to arrive' }, { id: 'c', label: 'Browsers require it' }],
      correct: 'b', explanation: 'Something must show while waiting.' },
  ],
  game: {
    id: 'fe-flow', title: 'Down the pipeline',
    instructions: 'Four stations take a feature from design to production. Send each task to the station where it happens.',
    lanes: [
      { id: 'design', label: 'Design & tokens', hint: 'Screens, styles and shared decisions' },
      { id: 'component', label: 'Components', hint: 'Reusable code pieces with props' },
      { id: 'data', label: 'Data & state', hint: 'Fetching, loading, empty, error' },
      { id: 'ship', label: 'Test & ship', hint: 'Checks, previews, deployment' },
    ],
    cards: [
      { id: 'g1', label: 'Define colour tokens as Figma variables', lane: 'design' },
      { id: 'g2', label: 'Write a Button with size and variant props', lane: 'component' },
      { id: 'g3', label: 'Fetch the order list from the server', lane: 'data' },
      { id: 'g4', label: 'Run the automated tests and deploy', lane: 'ship' },
      { id: 'g5', label: 'Agree the spacing scale and type styles', lane: 'design' },
      { id: 'g6', label: 'Reuse the Card component on three pages', lane: 'component' },
      { id: 'g7', label: 'Show a spinner while the request is pending', lane: 'data' },
      { id: 'g8', label: 'Review the change in a preview link before release', lane: 'ship' },
    ],
  },
  gap: {
    id: 'gap', from: 17, at: 22.4,
    prompt: 'The order list request fails. What should the screen show?',
    options: [{ id: 'a', label: 'A blank white screen' }, { id: 'b', label: 'An error state with a way to retry' }, { id: 'c', label: 'The loading spinner forever' }],
    correct: 'b', explanation: 'Every data-driven component needs a designed error state.',
  },
  takeaways: [
    { title: 'Components and props', body: 'Code mirrors the design system: one Button, many uses.' },
    { title: 'Data has states', body: 'Loading, empty, error and success: design all four.' },
    { title: 'Tokens and pipelines', body: 'Tokens become CSS variables; changes are tested, previewed and shipped.' },
  ],
  quiz: {
    seconds: 12,
    questions: [
      { id: 'q1', prompt: 'A Button’s “size” setting in code is a…', options: [{ id: 'a', label: 'Prop' }, { id: 'b', label: 'Server' }], correct: 'a', explanation: 'Props configure components.' },
      { id: 'q2', prompt: 'Design tokens usually become…', options: [{ id: 'a', label: 'Images' }, { id: 'b', label: 'CSS variables' }, { id: 'c', label: 'Fonts' }], correct: 'b', explanation: 'Shared values in code.' },
      { id: 'q3', prompt: 'While data loads, show…', options: [{ id: 'a', label: 'Nothing' }, { id: 'b', label: 'An error' }, { id: 'c', label: 'The empty state' }, { id: 'd', label: 'A loading state' }], correct: 'd', explanation: 'Something is happening.' },
      { id: 'q4', prompt: 'A preview link lets the team…', options: [{ id: 'a', label: 'Edit Figma' }, { id: 'b', label: 'Skip testing' }, { id: 'c', label: 'Check the real change before it goes live' }, { id: 'd', label: 'Change servers' }], correct: 'c', explanation: 'Review before release.' },
    ],
  },
  ladder: [
    { id: 'l1', prompt: 'What’s an API, in plain words?', hint: 'A menu for data.', options: [{ id: 'a', label: 'A way for the app to ask a server for data or actions' }, { id: 'b', label: 'A design file' }, { id: 'c', label: 'A font' }, { id: 'd', label: 'A test' }], correct: 'a', explanation: 'The front-end calls the API; the server answers.' },
    { id: 'l2', prompt: 'What is “state” in a component?', hint: 'It changes.', options: [{ id: 'a', label: 'Its colour' }, { id: 'b', label: 'Data that can change while you use it, like an open menu or a typed value' }, { id: 'c', label: 'Its file name' }, { id: 'd', label: 'Its location' }], correct: 'b', explanation: 'State changes re-render the component.' },
    { id: 'l3', prompt: 'Why might a developer push back on a one-off button style?', hint: 'Components.', options: [{ id: 'a', label: 'They dislike colour' }, { id: 'b', label: 'It’s illegal' }, { id: 'c', label: 'It means a new variant or a fork of a shared component, which costs upkeep' }, { id: 'd', label: 'Buttons are banned' }], correct: 'c', explanation: 'Same reason as inconsistency debt.' },
    { id: 'l4', prompt: 'What’s a “skeleton screen”?', hint: 'Loading.', options: [{ id: 'a', label: 'An error page' }, { id: 'b', label: 'A Halloween theme' }, { id: 'c', label: 'A wireframe' }, { id: 'd', label: 'Grey placeholder shapes shown while content loads' }], correct: 'd', explanation: 'It feels faster than a spinner.' },
    { id: 'l5', prompt: 'Which habit makes design-to-code handoff smoother?', hint: 'Match the structure.', options: [{ id: 'a', label: 'Build Figma with components, variants and tokens that mirror the code' }, { id: 'b', label: 'Detach every instance' }, { id: 'c', label: 'Use random spacing' }, { id: 'd', label: 'Skip states' }], correct: 'a', explanation: 'When Figma and code share a structure, handoff is mostly mapping.' },
  ],
};
