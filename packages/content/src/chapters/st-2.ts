// Chapter st.2 · Vision & roadmaps. Draft by Claude, for review.
import type { LessonContent } from '../schema';

export const st2: LessonContent[] = [
  {
    id: 'st.2-1', title: 'Product vision narratives', minutes: 5,
    steps: [
      { type: 'concept', id: 'c1', title: 'A vision is a story, not a slogan',
        body: ['A product vision describes the world three to five years out, once the product has done its job, for a real person. It names the struggle they have today, what is different for them then, and why this team can get there.',
          'Leave out what a vision can’t carry: feature lists (that’s the roadmap), target numbers (those are goals) and words like “leading” or “AI-powered” that sound big and decide nothing. A good vision lets a team say no.'] },
      { type: 'pick', id: 'p1', prompt: 'Which line belongs in Galla’s vision? Galla is a ledger app for kirana shops.',
        explanation: 'It names a real person and a change in her life, so the team can test every idea against it. The others are a slogan, a feature and a target.',
        options: [
          { id: 'a', label: 'Galla will be India’s leading AI-powered retail platform.' },
          { id: 'b', label: 'Launch voice entry and GST billing next year.' },
          { id: 'c', label: 'Shabnam closes her shop at 9 and knows to the rupee who owes her, without opening a notebook or chasing anyone.' },
          { id: 'd', label: 'Reach 10 lakh shops by 2027.' },
        ], correct: 'c' },
      { type: 'sort', id: 's1', prompt: 'Keep it in the vision, or move it somewhere else?',
        explanation: 'A vision keeps the person, the struggle and the future. Features go to the roadmap, targets to goals, and buzzwords go.',
        buckets: [{ id: 'k', label: 'Keep in the vision' }, { id: 'm', label: 'Move or cut' }],
        items: [
          { id: 'a', label: 'Today she spends her Sunday adding up a notebook of 60 customers', bucket: 'k' },
          { id: 'b', label: 'A seamless, best-in-class experience', bucket: 'm' },
          { id: 'c', label: 'Customers pay what they owe before she has to ask', bucket: 'k' },
          { id: 'd', label: 'Integrate with three distributor apps', bucket: 'm' },
          { id: 'e', label: 'We already hold 40,000 shops’ ledgers, so we see udhaar patterns nobody else can', bucket: 'k' },
          { id: 'f', label: '30% month-on-month growth', bucket: 'm' },
        ] },
    ],
  },
  {
    id: 'st.2-2', title: 'Now / Next / Later roadmaps', minutes: 5,
    steps: [
      { type: 'concept', id: 'c1', title: 'Columns, not dates',
        body: ['A Now / Next / Later roadmap, popularised by Janna Bastow at ProdPad, swaps the timeline for three columns of certainty. Now is what the team is working on, committed and detailed. Next is shaped but open. Later is problems worth solving, kept fuzzy on purpose.',
          'Each item names a problem or an outcome, not a feature, so the team can change the solution without breaking a promise. Anything that doesn’t serve the vision stays off the roadmap.'] },
      { type: 'order', id: 'o1', prompt: 'Order these bets from Now to Later by what the team knows.',
        explanation: 'A tested fix is ready to build now. A proven problem needs shaping first. A single signal waits in Later until there’s more evidence.',
        items: [
          { id: 'a', label: 'Reminders: a 40-shop pilot got udhaar paid back faster' },
          { id: 'b', label: 'Voice entry: we watched shopkeepers skip entries in the rush' },
          { id: 'c', label: 'Loans: a few shopkeepers asked about Diwali cash' },
        ] },
      { type: 'pick', id: 'p1', prompt: 'A sales lead wants a date for “low-stock alerts”, which sits in Next. What’s the best answer?',
        explanation: 'Next means the problem is proven and the solution isn’t settled. Give the outcome and what would move it to Now, not a date you can’t keep.',
        options: [
          { id: 'a', label: '“15 March,” to keep the deal moving' },
          { id: 'b', label: '“It’s in Next: we know shops run out of fast sellers. It moves to Now once our test with 20 shops works, and I’ll tell you when.”' },
          { id: 'c', label: '“Roadmaps don’t have dates, sorry”' },
          { id: 'd', label: 'Move it to Now so there’s a date' },
        ], correct: 'b' },
    ],
  },
  {
    id: 'st.2-3', title: 'Competitive analysis', minutes: 5,
    steps: [
      { type: 'concept', id: 'c1', title: 'Your rival is whatever gets the job done',
        body: ['Start from the job, not the category. Direct competitors are products like yours. Indirect ones are different products that do the same job. Substitutes are habits and workarounds, like a paper notebook. Doing nothing counts too.',
          'For each one, note what it does better than you, and why people use it anyway. The goal isn’t a feature table with ticks; it’s finding where you can be clearly better for the job.'] },
      { type: 'sort', id: 's1', prompt: 'For a shop’s credit ledger app: direct, indirect or substitute?',
        explanation: 'Same kind of product is direct; a different product doing the same job is indirect; habits and workarounds are substitutes.',
        buckets: [{ id: 'd', label: 'Direct' }, { id: 'i', label: 'Indirect' }, { id: 's', label: 'Substitute' }],
        items: [
          { id: 'a', label: 'Another udhaar ledger app', bucket: 'd' },
          { id: 'b', label: 'The paper khata on the counter', bucket: 's' },
          { id: 'c', label: 'A UPI app’s “request money” button', bucket: 'i' },
          { id: 'd', label: 'Her son remembering who owes what', bucket: 's' },
          { id: 'e', label: 'A billing app with a credit-sale tab', bucket: 'i' },
          { id: 'f', label: 'A second ledger app with free SMS reminders', bucket: 'd' },
        ] },
      { type: 'pick', id: 'p1', prompt: 'Your feature table shows Galla ticks more boxes than both rival apps. Why might you still lose?',
        explanation: 'Most shopkeepers use none of the apps. The notebook is free, always works and customers trust it. Ticks against apps miss the real rival.',
        options: [
          { id: 'a', label: 'You won’t; more ticks wins' },
          { id: 'b', label: 'The biggest rival is the paper notebook, which isn’t in the table' },
          { id: 'c', label: 'The table needs more rows' },
          { id: 'd', label: 'Your logo is weaker' },
        ], correct: 'b' },
    ],
  },
];
