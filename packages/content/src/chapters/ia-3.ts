// Chapter ia.3 · Wireframing. Draft by Claude, for review.
import type { LessonContent } from '../schema';

export const ia3: LessonContent[] = [
  {
    id: 'ia.3-1', title: 'Fidelity: when to stay ugly', minutes: 4,
    steps: [
      { type: 'concept', id: 'c1', title: 'Plain on looks, real on words',
        body: ['A wireframe is there to settle structure: what is on each screen, in what order, and what you tap next. People give feedback on what they can see. Show them a brand green, a real photo and a glossy button, and the review turns into a talk about green, photos and buttons. Grey boxes, one plain font and no colour leave only the structure to talk about.',
          'Content is the exception. “Lorem ipsum”, “₹XXX” and “Tab 1” hide the very things a wireframe has to test: does a long turf name fit, is the price per hour or per person, which sports go in the tabs? Keep the looks low and the words real. Raise the visual fidelity only once the structure stops changing.'] },
      { type: 'sort', id: 's1', prompt: 'A first wireframe for a turf-booking app. Make it plainer, make it realer, or leave it?',
        explanation: 'Visual polish draws comments about looks, so strip it. Placeholder text hides what the structure must hold, so replace it with real content. Plain, real parts are already right.',
        buckets: [{ id: 'plain', label: 'Make it plainer' }, { id: 'real', label: 'Make it realer' }, { id: 'fine', label: 'Leave it' }],
        items: [
          { id: 'a', label: 'A photo of the turf at sunset', bucket: 'plain' },
          { id: 'b', label: 'Each card’s title reads “Lorem ipsum dolor”', bucket: 'real' },
          { id: 'c', label: 'A green gradient Book button with a drop shadow', bucket: 'plain' },
          { id: 'd', label: 'The price shows as “₹XXX”', bucket: 'real' },
          { id: 'e', label: 'A grey search box that reads “Search turfs near you”', bucket: 'fine' },
          { id: 'f', label: 'Tabs labelled “Tab 1, Tab 2, Tab 3”', bucket: 'real' },
        ] },
      { type: 'pick', id: 'p1', prompt: 'When is it time to move the booking screens to high fidelity?',
        explanation: 'Polish is expensive to throw away. Add it once the structure has stopped changing between reviews.',
        options: [
          { id: 'a', label: 'Straight away, so stakeholders get excited' },
          { id: 'b', label: 'Once reviews stop changing what is on each screen and in what order' },
          { id: 'c', label: 'Never: ship the wireframes' },
          { id: 'd', label: 'As soon as the logo is final' },
        ], correct: 'b' },
    ],
  },
  {
    id: 'ia.3-2', title: 'Layout grids for wireframes', minutes: 4,
    steps: [
      { type: 'concept', id: 'c1', title: 'Lay the grid before the boxes',
        body: ['Boxes placed by eye drift: one card starts 3 px further left than the next, and every screen gets its own margins. Set the grid first. A common choice is 12 columns on desktop, 8 on a tablet and 4 on a phone, with fixed gutters between the columns and margins at the edges, for example 16 px on a phone.',
          'Then every block starts and ends on a column edge, and its width shows how much it matters: the slot picker takes eight columns, the price summary four. A full-bleed photo can break out of the margins on purpose. Use the same grid on every screen of the flow, and the five screens read as one product.'] },
      { type: 'sort', id: 's1', prompt: 'A desktop page for one turf on a 12-column grid. Where does each block go?',
        explanation: 'The task gets the wide main column, what must stay in view goes beside it in the side column, and what belongs to the whole page runs across the full width.',
        buckets: [{ id: 'full', label: 'Full width, 1–12' }, { id: 'main', label: 'Main, 1–8' }, { id: 'side', label: 'Side, 9–12' }],
        items: [
          { id: 'a', label: 'Top bar with the logo, search and your account', bucket: 'full' },
          { id: 'b', label: 'The slot picker for Saturday', bucket: 'main' },
          { id: 'c', label: 'Price summary and the Book button', bucket: 'side' },
          { id: 'd', label: 'Turf name, rating and address', bucket: 'full' },
          { id: 'e', label: 'Players’ reviews', bucket: 'main' },
          { id: 'f', label: 'A small map with directions', bucket: 'side' },
        ] },
      { type: 'pick', id: 'p1', prompt: 'On a 4-column phone grid, what happens to the 4-column side block from desktop?',
        explanation: 'On a phone every block spans all four columns, so the side column stacks under the main one. Things that must stay in view, like Book, often become a sticky bar.',
        options: [
          { id: 'a', label: 'It keeps its width and squeezes next to the main block' },
          { id: 'b', label: 'It is removed on mobile' },
          { id: 'c', label: 'It stacks below the main block at full width, or becomes a sticky bar' },
          { id: 'd', label: 'It moves to the top of the screen' },
        ], correct: 'c' },
    ],
  },
  {
    id: 'ia.3-3', title: 'Wireframing patterns library', minutes: 5,
    steps: [
      { type: 'concept', id: 'c1', title: 'Someone has already solved this',
        body: ['Most screens are made of a few well-known patterns: a list of cards to compare options, chips to pick one of a few choices you can see at once, a form to type details in, a bottom sheet for a short task that shouldn’t lose your place, a stepper for a multi-step task. People already know how these work, so they don’t have to learn your app.',
          'Keep a pattern library: each pattern drawn once as a wireframe component, with its name, when to use it and when not to. Figma and Balsamiq have wireframe kits, and sites like Mobbin collect real screens. Pick a pattern for the job, not out of habit: fourteen time slots read better as chips than as a dropdown, and three options don’t need a search box.'] },
      { type: 'sort', id: 's1', prompt: 'Booking a turf. Which pattern fits each job?',
        explanation: 'Cards compare options with the same details, chips pick from a few visible choices, and a bottom sheet handles a short side task without leaving the screen.',
        buckets: [{ id: 'cards', label: 'Card list' }, { id: 'chips', label: 'Chips' }, { id: 'sheet', label: 'Bottom sheet' }],
        items: [
          { id: 'a', label: 'Compare turfs near you by price, distance and rating', bucket: 'cards' },
          { id: 'b', label: 'Pick one of 14 one-hour slots on Saturday', bucket: 'chips' },
          { id: 'c', label: 'See the three courts at this turf, each with its size and surface', bucket: 'cards' },
          { id: 'd', label: 'Read the cancellation policy without leaving the turf page', bucket: 'sheet' },
          { id: 'e', label: 'Filter to 5-a-side or 7-a-side', bucket: 'chips' },
          { id: 'f', label: 'Apply a promo code at checkout', bucket: 'sheet' },
        ] },
      { type: 'pick', id: 'p1', prompt: 'A teammate wants a dropdown for Saturday’s 14 time slots. What’s the problem?',
        explanation: 'A dropdown hides the options. Chips show every slot at once, with booked ones greyed out, so people can scan and tap.',
        options: [
          { id: 'a', label: 'None: dropdowns save space' },
          { id: 'b', label: 'It hides which slots are free: chips show all 14 at once and grey out the booked ones' },
          { id: 'c', label: 'Dropdowns can’t hold 14 items' },
          { id: 'd', label: 'It should be a text field' },
        ], correct: 'b' },
    ],
  },
];
