// Chapter dc.1 · Code literacy for designers. Draft by Claude, for review.
import type { LessonContent } from '../schema';

export const dc1: LessonContent[] = [
  {
    id: 'dc.1-1', title: 'HTML structure & the DOM', minutes: 4,
    steps: [
      { type: 'concept', id: 'c1', title: 'A page is a tree',
        body: ['HTML describes what each part of a page is: a header, navigation, the main content, a button, a heading. The browser turns it into a tree of nested elements called the DOM.',
          'Using the right element matters. A real <button> works with the keyboard and screen readers for free; a <div> styled to look like a button doesn’t. Landmarks like <header>, <nav>, <main> and <footer> let people jump around the page.'] },
      { type: 'sort', id: 's1', prompt: 'Which landmark?',
        explanation: 'The header holds the top bar, nav holds site links, main holds the page’s own content.',
        buckets: [{ id: 'header', label: '<header>' }, { id: 'nav', label: '<nav>' }, { id: 'main', label: '<main>' }],
        items: [
          { id: 'a', label: 'Logo and search bar at the top', bucket: 'header' },
          { id: 'b', label: 'Links to Home, Shop and Help', bucket: 'nav' },
          { id: 'c', label: 'The article you came to read', bucket: 'main' },
          { id: 'd', label: 'A breadcrumb trail', bucket: 'nav' },
          { id: 'e', label: 'The product details and Add to cart', bucket: 'main' },
        ] },
      { type: 'pick', id: 'p1', prompt: 'A developer builds “Pay now” as a <div> with a click handler. What breaks?',
        explanation: 'Divs aren’t focusable or announced as buttons, so keyboard and screen reader users can’t use it.',
        options: [
          { id: 'a', label: 'Nothing, it looks the same' },
          { id: 'b', label: 'Keyboard and screen reader users can’t find or press it' },
          { id: 'c', label: 'The colour changes' },
          { id: 'd', label: 'It loads slower' },
        ], correct: 'b' },
    ],
  },
  {
    id: 'dc.1-2', title: 'CSS box model, flex & grid', minutes: 4,
    steps: [
      { type: 'concept', id: 'c1', title: 'Boxes inside boxes',
        body: ['Every element is a box: content, then padding inside the border, then margin outside it. Auto layout in Figma maps closely to CSS flexbox: direction, gap, padding and alignment.',
          'Flexbox lays items out in one direction (a row or a column). Grid lays them out in rows and columns at once. Designers who speak this language write specs developers can build exactly.'] },
      { type: 'sort', id: 's1', prompt: 'Which CSS property does it?',
        explanation: 'flex-direction picks row or column, justify-content spreads items along it, gap sets the space between.',
        buckets: [{ id: 'dir', label: 'flex-direction' }, { id: 'justify', label: 'justify-content' }, { id: 'gap', label: 'gap' }],
        items: [
          { id: 'a', label: 'Stack the items in a column', bucket: 'dir' },
          { id: 'b', label: 'Push the logo left and the menu right', bucket: 'justify' },
          { id: 'c', label: 'Put 16px between the chips', bucket: 'gap' },
          { id: 'd', label: 'Centre the buttons in the bar', bucket: 'justify' },
        ] },
      { type: 'pick', id: 'p1', prompt: 'In Figma, an auto layout frame has 16px between items and 24px inside its edges. In CSS that’s…',
        explanation: 'Spacing between items is gap; space inside the edges is padding.',
        options: [
          { id: 'a', label: 'margin: 16px; border: 24px' },
          { id: 'b', label: 'gap: 16px; padding: 24px' },
          { id: 'c', label: 'width: 16px; height: 24px' },
          { id: 'd', label: 'gap: 24px; padding: 16px' },
        ], correct: 'b' },
    ],
  },
  {
    id: 'dc.1-3', title: 'How front-ends are built', minutes: 4,
    steps: [
      { type: 'concept', id: 'c1', title: 'From Figma to production',
        body: ['Modern front-ends are built from components, much like a design system: a Button with props (size, variant, disabled) reused everywhere. Design tokens become CSS variables.',
          'Components show data fetched from a server, and they have state (loading, empty, error, success), which is why designers draw those states. Changes are tested, previewed and deployed.'] },
      { type: 'order', id: 'o1', prompt: 'Put the journey of a new feature in order.',
        explanation: 'Design and tokens, then components, then connecting data and states, then testing and shipping.',
        items: [
          { id: 'a', label: 'Design the screens and agree tokens' },
          { id: 'b', label: 'Build or reuse components with props' },
          { id: 'c', label: 'Connect real data and handle loading, empty and error states' },
          { id: 'd', label: 'Test, review in a preview link, deploy' },
        ] },
      { type: 'pick', id: 'p1', prompt: 'Why do developers ask designers for loading, empty and error states?',
        explanation: 'Real data takes time, can be missing, or can fail. Every component has to show something in each case.',
        options: [
          { id: 'a', label: 'To make extra work' },
          { id: 'b', label: 'Because real data can be slow, missing or fail, and the screen must show something each time' },
          { id: 'c', label: 'For marketing screenshots' },
          { id: 'd', label: 'Browsers require three states' },
        ], correct: 'b' },
    ],
  },
];
