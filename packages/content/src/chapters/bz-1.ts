// Chapter bz.1 · How businesses make money. Draft by Claude, for review.
import type { LessonContent } from '../schema';

export const bz1: LessonContent[] = [
  {
    id: 'bz.1-1', title: 'Business models', minutes: 4,
    steps: [
      { type: 'concept', id: 'c1', title: 'Who pays, for what',
        body: ['A business model is how a product turns value into money. Common ones: subscription (pay every month), marketplace (take a cut of each transaction), advertising (users are free, advertisers pay) and freemium (most users free, some pay to upgrade).',
          'The model shapes design. A subscription app must keep earning its fee; a marketplace must serve buyers and sellers; an ad-funded app must balance attention with respect.'] },
      { type: 'sort', id: 's1', prompt: 'Which model?',
        explanation: 'Monthly fee: subscription. A cut of each order: marketplace. Free with ads: advertising.',
        buckets: [{ id: 'sub', label: 'Subscription' }, { id: 'mkt', label: 'Marketplace' }, { id: 'ads', label: 'Advertising' }],
        items: [
          { id: 'a', label: 'A streaming app at ₹199 a month', bucket: 'sub' },
          { id: 'b', label: 'A food delivery app taking 20% of each order', bucket: 'mkt' },
          { id: 'c', label: 'A free news app with banner ads', bucket: 'ads' },
          { id: 'd', label: 'A gym app charging ₹499 a month', bucket: 'sub' },
          { id: 'e', label: 'A ride-hailing app keeping 25% of each fare', bucket: 'mkt' },
          { id: 'f', label: 'A free video platform with ads before videos', bucket: 'ads' },
        ] },
      { type: 'pick', id: 'p1', prompt: 'Why does a subscription app care so much about retention?',
        explanation: 'Revenue arrives month by month, so every cancellation stops future income.',
        options: [
          { id: 'a', label: 'It doesn’t' },
          { id: 'b', label: 'Each month a user stays is another payment; churn cuts off future revenue' },
          { id: 'c', label: 'Retention lowers server costs' },
          { id: 'd', label: 'Advertisers require it' },
        ], correct: 'b' },
    ],
  },
  {
    id: 'bz.1-2', title: 'Unit economics for designers', minutes: 4,
    steps: [
      { type: 'concept', id: 'c1', title: 'Does one customer make money?',
        body: ['Unit economics asks whether a single customer is profitable. Lifetime value (LTV) is what a customer brings in over their whole time with you: monthly revenue × months they stay × margin.',
          'Customer acquisition cost (CAC) is what it costs to win them. A common rule of thumb: LTV should be at least 3× CAC. Design moves both: better onboarding lowers CAC, better retention raises LTV.'] },
      { type: 'pick', id: 'p1', prompt: '₹200 a month, customers stay 10 months, 50% margin. What’s the LTV?',
        explanation: '₹200 × 10 × 50% = ₹1,000.',
        options: [
          { id: 'a', label: '₹2,000' },
          { id: 'b', label: '₹200' },
          { id: 'c', label: '₹1,000' },
          { id: 'd', label: '₹100' },
        ], correct: 'c' },
      { type: 'sort', id: 's1', prompt: 'Which number does this design change mainly move?',
        explanation: 'Retention work raises lifetime value; making sign-up and activation easier lowers acquisition cost.',
        buckets: [{ id: 'ltv', label: 'Raises LTV' }, { id: 'cac', label: 'Lowers CAC' }],
        items: [
          { id: 'a', label: 'A habit feature that keeps people subscribed longer', bucket: 'ltv' },
          { id: 'b', label: 'A shorter sign-up, so more ad clicks become customers', bucket: 'cac' },
          { id: 'c', label: 'An annual plan people happily choose', bucket: 'ltv' },
          { id: 'd', label: 'A referral flow that brings in friends for free', bucket: 'cac' },
        ] },
    ],
  },
  {
    id: 'bz.1-3', title: 'B2B vs. B2C buying journeys', minutes: 4,
    steps: [
      { type: 'concept', id: 'c1', title: 'One buyer, or a committee',
        body: ['In B2C (business to consumer), one person usually decides quickly: they see it, try it, buy it. In B2B (business to business), a group decides over weeks or months.',
          'The B2B buying group often includes the daily users, a manager with the budget, IT or security, and procurement or legal. Each needs different things from the product and its website.'] },
      { type: 'pick', id: 'p1', prompt: 'Who usually asks “Does it support single sign-on and where is our data stored?”',
        explanation: 'IT and security teams check that a tool is safe and fits their systems.',
        options: [
          { id: 'a', label: 'The daily user' },
          { id: 'b', label: 'IT or security' },
          { id: 'c', label: 'The marketing team' },
          { id: 'd', label: 'A consumer' },
        ], correct: 'b' },
      { type: 'sort', id: 's1', prompt: 'B2B or B2C?',
        explanation: 'Consumers buy for themselves, often on impulse; businesses buy for teams, with approvals.',
        buckets: [{ id: 'b2c', label: 'B2C' }, { id: 'b2b', label: 'B2B' }],
        items: [
          { id: 'a', label: 'Buying a meditation app subscription on your phone', bucket: 'b2c' },
          { id: 'b', label: 'A company choosing payroll software for 500 staff', bucket: 'b2b' },
          { id: 'c', label: 'Ordering shoes after seeing an ad', bucket: 'b2c' },
          { id: 'd', label: 'A hospital buying a patient records system', bucket: 'b2b' },
        ] },
    ],
  },
];
