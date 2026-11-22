// Chapter gr.1 · Growth basics. Draft by Claude, for review.
import type { LessonContent } from '../schema';

export const gr1: LessonContent[] = [
  {
    id: 'gr.1-1', title: 'AARRR funnel', minutes: 4,
    steps: [
      { type: 'concept', id: 'c1', title: 'Five stages, one leaky pipe',
        body: ['The AARRR (“pirate”) funnel follows people through a product: Acquisition (they arrive), Activation (they get value for the first time), Retention (they come back), Referral (they tell others) and Revenue (they pay).',
          'Fewer people reach each stage. Measure the conversion between stages and fix the leakiest step first: more visitors won’t help if almost nobody activates.'] },
      { type: 'order', id: 'o1', prompt: 'Put the AARRR stages in order.',
        explanation: 'Acquisition, Activation, Retention, Referral, Revenue.',
        items: [
          { id: 'a', label: 'Acquisition: people arrive' },
          { id: 'b', label: 'Activation: first real value' },
          { id: 'c', label: 'Retention: they come back' },
          { id: 'd', label: 'Referral: they bring others' },
          { id: 'e', label: 'Revenue: they pay' },
        ] },
      { type: 'pick', id: 'p1', prompt: '1,000 visitors, 400 sign-ups, 40 activated, 30 still active after a month. Where do you start?',
        explanation: 'Only 10% of sign-ups activate, the steepest drop. Fixing activation multiplies everything after it.',
        options: [
          { id: 'a', label: 'Buy more ads' },
          { id: 'b', label: 'Activation: sign-up to first value' },
          { id: 'c', label: 'Retention after a month' },
          { id: 'd', label: 'The pricing page' },
        ], correct: 'b' },
    ],
  },
  {
    id: 'gr.1-2', title: 'Activation & aha moments', minutes: 4,
    steps: [
      { type: 'concept', id: 'c1', title: 'The moment it clicks',
        body: ['The aha moment is when a new user first feels the product’s value: their first ride booked, first song saved, first payment received.',
          'Activation means reaching it. Good onboarding removes every step that isn’t needed before the aha, and saves the rest for later.'] },
      { type: 'pick', id: 'p1', prompt: 'What’s the aha moment for a bill-splitting app?',
        explanation: 'Value is felt when the split is done and friends are notified, not when an account exists.',
        options: [
          { id: 'a', label: 'Creating an account' },
          { id: 'b', label: 'Uploading a profile photo' },
          { id: 'c', label: 'Splitting a first bill and seeing who owes what' },
          { id: 'd', label: 'Reading the FAQ' },
        ], correct: 'c' },
      { type: 'sort', id: 's1', prompt: 'A running app’s aha is finishing a first tracked run. Before or after that moment?',
        explanation: 'Only what the first run truly needs goes first. Everything else waits until the user has felt the value.',
        buckets: [{ id: 'before', label: 'Before the first run' }, { id: 'after', label: 'After it' }],
        items: [
          { id: 'a', label: 'Allow location access', bucket: 'before' },
          { id: 'b', label: 'Upload a profile photo', bucket: 'after' },
          { id: 'c', label: 'Tap “Start run”', bucket: 'before' },
          { id: 'd', label: 'Find friends from contacts', bucket: 'after' },
        ] },
    ],
  },
  {
    id: 'gr.1-3', title: 'Behavioural psychology (Fogg, hooks)', minutes: 4,
    steps: [
      { type: 'concept', id: 'c1', title: 'Behaviour = Motivation × Ability × Prompt',
        body: ['BJ Fogg’s model says a behaviour happens when motivation, ability and a prompt come together at the same moment. If something isn’t happening, one of the three is missing.',
          'Making things easier (ability) is usually more reliable than pumping up motivation. The Hook model adds a loop: trigger, action, variable reward, investment.'] },
      { type: 'sort', id: 's1', prompt: 'What’s missing?',
        explanation: 'No reminder means no prompt; too many steps means low ability; not caring means low motivation.',
        buckets: [{ id: 'm', label: 'Motivation' }, { id: 'a', label: 'Ability' }, { id: 'p', label: 'Prompt' }],
        items: [
          { id: 'a', label: 'People want to save but setup takes nine screens', bucket: 'a' },
          { id: 'b', label: 'Users love the habit tracker but forget to open it', bucket: 'p' },
          { id: 'c', label: 'A daily ping to log water, but users don’t care about water', bucket: 'm' },
          { id: 'd', label: 'Uploading a document needs a scanner most people don’t have', bucket: 'a' },
        ] },
      { type: 'pick', id: 'p1', prompt: 'Which change usually works best to get a behaviour going?',
        explanation: 'Making the behaviour easier is more reliable than trying to raise motivation.',
        options: [
          { id: 'a', label: 'A louder, more emotional message' },
          { id: 'b', label: 'Make the behaviour simpler and quicker' },
          { id: 'c', label: 'Send ten reminders a day' },
          { id: 'd', label: 'Offer a prize to everyone' },
        ], correct: 'b' },
    ],
  },
  {
    id: 'gr.1-4', title: 'Dark patterns to avoid', minutes: 4,
    steps: [
      { type: 'concept', id: 'c1', title: 'Growth that tricks people backfires',
        body: ['Dark patterns trick people into things they didn’t mean to do: pre-ticked add-ons, fake countdown timers, shaming “No thanks” buttons, hidden fees at checkout, subscriptions that are easy to start and hard to cancel.',
          'They lift a number for a while, then cost trust, refunds and complaints. India’s Department of Consumer Affairs now lists 13 of them as unfair trade practices.'] },
      { type: 'sort', id: 's1', prompt: 'Dark pattern or fair?',
        explanation: 'Fair design lets people choose freely with all the facts. Dark patterns rely on pressure, tricks or hidden information.',
        buckets: [{ id: 'dark', label: 'Dark pattern' }, { id: 'fair', label: 'Fair' }],
        items: [
          { id: 'a', label: 'Travel insurance pre-ticked at checkout', bucket: 'dark' },
          { id: 'b', label: 'Total price, fees included, shown from the start', bucket: 'fair' },
          { id: 'c', label: '“No thanks, I don’t like saving money”', bucket: 'dark' },
          { id: 'd', label: 'Cancel subscription in two taps from settings', bucket: 'fair' },
        ] },
      { type: 'pick', id: 'p1', prompt: 'A countdown says “Offer ends in 10:00” and restarts every time the page loads. What is it?',
        explanation: 'Fake urgency pressures people with a deadline that doesn’t exist.',
        options: [
          { id: 'a', label: 'Good marketing' },
          { id: 'b', label: 'False urgency, a dark pattern' },
          { id: 'c', label: 'A helpful reminder' },
          { id: 'd', label: 'A loading indicator' },
        ], correct: 'b' },
    ],
  },
];
