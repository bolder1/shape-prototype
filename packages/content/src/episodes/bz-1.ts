// Episodes for chapter bz.1 · How businesses make money. Drafts by Claude, for review.
import type { Episode } from '../episode';

export const bz1_1: Episode = {
  lessonId: 'bz.1-1',
  hook: 'Two apps can look identical and make money in completely different ways. The model decides what “good design” means.',
  scene: {
    id: 'business-models', duration: 34,
    beats: [
      { at: 0, title: 'Subscription', body: 'People pay every month. The app has to keep earning that fee, or they cancel.' },
      { at: 6, title: 'Marketplace', body: 'Buyers pay sellers, and the platform keeps a cut of each order. It must keep both sides happy.' },
      { at: 12, title: 'Advertising', body: 'Users pay nothing. Advertisers pay for their attention. The product sells time and eyes.' },
      { at: 18, title: 'Freemium', body: 'Most people use it free. A small share upgrade, and they pay for everyone.' },
      { at: 24, title: 'The model shapes the design', body: 'Subscription designs for retention, marketplaces for trust on both sides, ads for attention, freemium for the upgrade moment.' },
      { at: 29, title: 'Follow the money', body: 'Ask who pays, for what, and how often. Then you know what the design must do.' },
    ],
  },
  check: [
    { id: 'c1', prompt: 'In a marketplace, who does the platform need to keep happy?', options: [{ id: 'a', label: 'Only buyers' }, { id: 'b', label: 'Buyers and sellers' }, { id: 'c', label: 'Only advertisers' }],
      correct: 'b', explanation: 'No sellers, no buyers, and the other way round.' },
    { id: 'c2', prompt: 'In freemium, who pays?', options: [{ id: 'a', label: 'Everyone' }, { id: 'b', label: 'Advertisers' }, { id: 'c', label: 'A small share who upgrade' }],
      correct: 'c', explanation: 'A few paying users fund the free ones.' },
  ],
  game: {
    id: 'model-match', title: 'Follow the money',
    instructions: 'Each card is a product. Pick its business model and watch the money flow: who pays whom, and for what.',
    lanes: [
      { id: 'sub', label: 'Subscription', hint: 'Users pay a recurring fee' },
      { id: 'mkt', label: 'Marketplace', hint: 'A cut of each transaction' },
      { id: 'ads', label: 'Advertising', hint: 'Free to users, advertisers pay' },
      { id: 'free', label: 'Freemium', hint: 'Free for most, some pay to upgrade' },
    ],
    cards: [
      { id: 'g1', label: 'A streaming app at ₹199 a month', lane: 'sub' },
      { id: 'g2', label: 'A food delivery app taking 20% of each order from restaurants', lane: 'mkt' },
      { id: 'g3', label: 'A free news app paid for by banner ads', lane: 'ads' },
      { id: 'g4', label: 'A notes app, free on two devices, ₹149 a month for unlimited', lane: 'free' },
      { id: 'g5', label: 'A ride-hailing app keeping 25% of every fare', lane: 'mkt' },
      { id: 'g6', label: 'A gym app charging ₹499 a month', lane: 'sub' },
      { id: 'g7', label: 'A free video platform with ads before each video', lane: 'ads' },
      { id: 'g8', label: 'A design tool, free for individuals, paid for teams', lane: 'free' },
    ],
  },
  gap: {
    id: 'gap', from: 18, at: 23.4,
    prompt: 'Only 4% of a freemium app’s users pay. Where should design focus?',
    options: [{ id: 'a', label: 'Remove the free tier entirely' }, { id: 'b', label: 'Make the free tier great, and the moment of upgrade obvious and fair' }, { id: 'c', label: 'Add more ads' }],
    correct: 'b', explanation: 'Free users must love it; the upgrade must feel worth it when they hit a real limit.',
  },
  takeaways: [
    { title: 'Four common models', body: 'Subscription, marketplace, advertising, freemium.' },
    { title: 'Who pays, for what', body: 'The answer tells you who the design must serve best.' },
    { title: 'Models shape metrics', body: 'Retention for subscriptions, liquidity for marketplaces, attention for ads, conversion for freemium.' },
  ],
  quiz: {
    seconds: 12,
    questions: [
      { id: 'q1', prompt: 'A monthly fee is…', options: [{ id: 'a', label: 'Subscription' }, { id: 'b', label: 'Advertising' }], correct: 'a', explanation: 'Recurring payment.' },
      { id: 'q2', prompt: 'Taking a cut of each order is…', options: [{ id: 'a', label: 'Freemium' }, { id: 'b', label: 'Marketplace' }, { id: 'c', label: 'Advertising' }], correct: 'b', explanation: 'Commission.' },
      { id: 'q3', prompt: 'In an ad-funded app, the customer is…', options: [{ id: 'a', label: 'The user' }, { id: 'b', label: 'The designer' }, { id: 'c', label: 'The app store' }, { id: 'd', label: 'The advertiser' }], correct: 'd', explanation: 'They pay.' },
      { id: 'q4', prompt: 'Freemium depends on…', options: [{ id: 'a', label: 'Everyone paying' }, { id: 'b', label: 'Ads' }, { id: 'c', label: 'Some free users upgrading' }, { id: 'd', label: 'Commission' }], correct: 'c', explanation: 'Conversion to paid.' },
    ],
  },
  ladder: [
    { id: 'l1', prompt: 'What’s the “chicken and egg” problem in marketplaces?', hint: 'Two sides.', options: [{ id: 'a', label: 'Buyers won’t come without sellers, and sellers won’t come without buyers' }, { id: 'b', label: 'Eggs are expensive' }, { id: 'c', label: 'Ads vs. subscriptions' }, { id: 'd', label: 'Logo design' }], correct: 'a', explanation: 'Marketplaces must seed one side first.' },
    { id: 'l2', prompt: 'Why might an ad-funded app design for endless scrolling?', hint: 'What is being sold?', options: [{ id: 'a', label: 'Users ask for it' }, { id: 'b', label: 'More time on screen means more ads shown, which is the revenue' }, { id: 'c', label: 'It’s cheaper to build' }, { id: 'd', label: 'Accessibility' }], correct: 'b', explanation: 'The model creates incentives; designers should weigh them against users’ wellbeing.' },
    { id: 'l3', prompt: 'What’s a “take rate”?', hint: 'Marketplace term.', options: [{ id: 'a', label: 'App store rating' }, { id: 'b', label: 'Churn' }, { id: 'c', label: 'The % of each transaction the platform keeps' }, { id: 'd', label: 'Ad click rate' }], correct: 'c', explanation: 'E.g. a 20% commission on a food order.' },
    { id: 'l4', prompt: 'Many Indian consumer apps struggle with pure subscriptions. A common workaround?', hint: 'Small, flexible payments.', options: [{ id: 'a', label: 'Charge more' }, { id: 'b', label: 'Remove all free features' }, { id: 'c', label: 'Only accept cards' }, { id: 'd', label: 'Sachet pricing: small daily or weekly packs, often via UPI' }], correct: 'd', explanation: 'Low, frequent payments match how many people prefer to pay.' },
    { id: 'l5', prompt: 'Where should a freemium paywall appear?', hint: 'When value is clear.', options: [{ id: 'a', label: 'When a user hits a real limit after getting value' }, { id: 'b', label: 'Before they try anything' }, { id: 'c', label: 'At random' }, { id: 'd', label: 'Never' }], correct: 'a', explanation: 'Ask for money when the value is obvious.' },
  ],
};

export const bz1_2: Episode = {
  lessonId: 'bz.1-2',
  hook: 'Every new customer costs ₹500 to win and brings in ₹350 before leaving. The faster this app grows, the faster it dies.',
  scene: {
    id: 'unit-economics', duration: 34,
    beats: [
      { at: 0, title: 'One customer', body: 'Follow a single customer. Winning them through ads costs ₹500. That’s CAC.' },
      { at: 6, title: 'What they bring', body: '₹99 a month, for six months, at 60% margin: about ₹356 over their lifetime. That’s LTV.' },
      { at: 11, title: 'Underwater', body: 'LTV ₹356, CAC ₹500. Each new customer loses money. Growth makes it worse.' },
      { at: 17, title: 'Design moves LTV', body: 'Better onboarding and habits keep people for 14 months instead of 6. LTV climbs to about ₹830.' },
      { at: 23, title: 'Design moves CAC', body: 'A shorter sign-up converts more ad clicks, and referrals bring friends for free. CAC falls to ₹250.' },
      { at: 29, title: 'LTV ≥ 3 × CAC', body: '₹830 against ₹250: over three times. Now growth makes money.' },
    ],
  },
  check: [
    { id: 'c1', prompt: 'Why was the app losing money on every customer?', options: [{ id: 'a', label: 'LTV (₹356) was lower than CAC (₹500)' }, { id: 'b', label: 'The price was too high' }, { id: 'c', label: 'Too few customers' }],
      correct: 'a', explanation: 'It cost more to win a customer than they brought in.' },
    { id: 'c2', prompt: 'How did design raise LTV?', options: [{ id: 'a', label: 'By raising prices' }, { id: 'b', label: 'By keeping customers longer' }, { id: 'c', label: 'By cutting the free trial' }],
      correct: 'b', explanation: 'Retention multiplies lifetime value.' },
  ],
  game: {
    id: 'unit-calc', title: 'Healthy, risky or losing?',
    instructions: 'Each card is a business: price per month, months a customer stays, margin, and the cost to win a customer. Estimate the health, then see the maths.',
    lanes: [
      { id: 'losing', label: 'Losing', hint: 'LTV below CAC' },
      { id: 'risky', label: 'Risky', hint: 'LTV 1–3 × CAC' },
      { id: 'healthy', label: 'Healthy', hint: 'LTV at least 3 × CAC' },
    ],
    cards: [
      { id: 'g1', label: 'A music app', lane: 'healthy', visual: '199|20|70|600' },
      { id: 'g2', label: 'A recipe app', lane: 'losing', visual: '99|6|60|500' },
      { id: 'g3', label: 'A coding course platform', lane: 'risky', visual: '499|10|50|1200' },
      { id: 'g4', label: 'A budgeting app', lane: 'healthy', visual: '149|24|80|400' },
      { id: 'g5', label: 'A meal-kit service', lane: 'losing', visual: '299|4|40|900' },
      { id: 'g6', label: 'A B2B scheduling tool', lane: 'risky', visual: '999|12|30|2000' },
      { id: 'g7', label: 'A cloud photo backup app', lane: 'healthy', visual: '59|36|90|300' },
      { id: 'g8', label: 'A fitness class pass', lane: 'losing', visual: '249|8|50|1300' },
      { id: 'g9', label: 'A language tutoring app', lane: 'risky', visual: '799|6|50|1100' },
    ],
  },
  gap: {
    id: 'gap', from: 11, at: 16.4,
    prompt: 'Each customer costs ₹500 and brings in ₹356. What should the team NOT do?',
    options: [{ id: 'a', label: 'Spend more on ads to grow faster' }, { id: 'b', label: 'Improve retention' }, { id: 'c', label: 'Make sign-up easier' }],
    correct: 'a', explanation: 'More ads means more customers who each lose money. Fix the unit economics first.',
  },
  takeaways: [
    { title: 'LTV', body: 'Monthly revenue × months they stay × margin.' },
    { title: 'CAC', body: 'What it costs to win one customer.' },
    { title: 'LTV ≥ 3 × CAC', body: 'Design moves both: retention raises LTV, easier conversion and referrals lower CAC.' },
  ],
  quiz: {
    seconds: 12,
    questions: [
      { id: 'q1', prompt: '₹100 × 10 months × 50% margin =', options: [{ id: 'a', label: '₹500' }, { id: 'b', label: '₹1,000' }], correct: 'a', explanation: 'LTV ₹500.' },
      { id: 'q2', prompt: 'CAC is…', options: [{ id: 'a', label: 'Monthly price' }, { id: 'b', label: 'Profit margin' }, { id: 'c', label: 'The cost to win a customer' }], correct: 'c', explanation: 'Acquisition cost.' },
      { id: 'q3', prompt: 'LTV ₹900, CAC ₹300 is…', options: [{ id: 'a', label: 'Losing' }, { id: 'b', label: 'Risky' }, { id: 'c', label: 'Impossible' }, { id: 'd', label: 'Healthy (3×)' }], correct: 'd', explanation: '900 ÷ 300 = 3.' },
      { id: 'q4', prompt: 'Better retention mainly raises…', options: [{ id: 'a', label: 'CAC' }, { id: 'b', label: 'LTV' }, { id: 'c', label: 'Ad costs' }, { id: 'd', label: 'Margin only' }], correct: 'b', explanation: 'More months.' },
    ],
  },
  ladder: [
    { id: 'l1', prompt: 'What’s “payback period”?', hint: 'Months to earn back CAC.', options: [{ id: 'a', label: 'How many months of margin it takes to recover CAC' }, { id: 'b', label: 'Refund window' }, { id: 'c', label: 'Loan length' }, { id: 'd', label: 'Free trial length' }], correct: 'a', explanation: 'Shorter payback means less cash tied up in growth.' },
    { id: 'l2', prompt: 'Monthly churn is 10%. Roughly how long does the average customer stay?', hint: '1 ÷ churn.', options: [{ id: 'a', label: '1 month' }, { id: 'b', label: 'About 10 months' }, { id: 'c', label: '100 months' }, { id: 'd', label: 'Forever' }], correct: 'b', explanation: 'Average lifetime ≈ 1 ÷ monthly churn.' },
    { id: 'l3', prompt: 'Why use margin, not revenue, in LTV?', hint: 'Costs to serve.', options: [{ id: 'a', label: 'It’s smaller' }, { id: 'b', label: 'Tradition' }, { id: 'c', label: 'Serving a customer costs money (delivery, servers, support), so only the margin is profit' }, { id: 'd', label: 'Revenue is unknown' }], correct: 'c', explanation: 'A ₹300 meal kit with ₹180 costs only earns ₹120.' },
    { id: 'l4', prompt: 'A “free delivery forever” promo boosts sign-ups. What should you check?', hint: 'Unit economics.', options: [{ id: 'a', label: 'Only sign-ups' }, { id: 'b', label: 'App store rank' }, { id: 'c', label: 'Logo recall' }, { id: 'd', label: 'Whether margin per order is still positive, and whether those users stay' }], correct: 'd', explanation: 'Growth bought at a loss isn’t growth.' },
    { id: 'l5', prompt: 'Which design work most often lowers CAC?', hint: 'Turning interest into customers.', options: [{ id: 'a', label: 'Clearer landing pages, easier sign-up and referral loops' }, { id: 'b', label: 'Darker colours' }, { id: 'c', label: 'Longer forms' }, { id: 'd', label: 'More pop-ups' }], correct: 'a', explanation: 'Higher conversion means each rupee of ads wins more customers.' },
  ],
};

export const bz1_3: Episode = {
  lessonId: 'bz.1-3',
  hook: 'A consumer buys your app in two minutes on a bus. A company takes four months, five people and a security review.',
  scene: {
    id: 'buying-journey', duration: 34,
    beats: [
      { at: 0, title: 'B2C: one person, minutes', body: 'Priya sees an ad, downloads the app, tries it, pays ₹99. Done before her stop.' },
      { at: 6, title: 'B2B: a committee, months', body: 'A company choosing scheduling software for 300 nurses. Five people, four months.' },
      { at: 12, title: 'Different people, different questions', body: 'Nurses: is it easy? The manager: what’s the ROI? IT: is it secure? Procurement: what are the terms?' },
      { at: 18, title: 'One “no” can stop it', body: 'The nurses love the trial, but IT finds no single sign-on. The deal stalls.' },
      { at: 24, title: 'Design for each role', body: 'A delightful app for users, an ROI calculator for managers, a security page for IT, clear terms for procurement.' },
      { at: 29, title: 'Know who’s buying', body: 'B2C: one person, fast, emotional. B2B: many people, slow, risk-averse.' },
    ],
  },
  check: [
    { id: 'c1', prompt: 'Why did the B2B deal stall?', options: [{ id: 'a', label: 'Users disliked it' }, { id: 'b', label: 'IT found a missing security feature' }, { id: 'c', label: 'The price was too low' }],
      correct: 'b', explanation: 'Any member of the buying group can block it.' },
    { id: 'c2', prompt: 'Who asks about ROI?', options: [{ id: 'a', label: 'The daily user' }, { id: 'b', label: 'The manager with the budget' }, { id: 'c', label: 'IT' }],
      correct: 'b', explanation: 'They justify the spend.' },
  ],
  game: {
    id: 'buyer-role', title: 'Who’s asking?',
    instructions: 'A hospital is choosing nurse-scheduling software. Each card is a question from the buying group. Send it to the person who would ask it.',
    lanes: [
      { id: 'user', label: 'Daily user', hint: 'Nurses who use it every shift' },
      { id: 'buyer', label: 'Budget holder', hint: 'The manager who signs off the spend' },
      { id: 'it', label: 'IT & security', hint: 'Keeps systems and data safe' },
      { id: 'proc', label: 'Procurement', hint: 'Contracts, terms and vendors' },
    ],
    cards: [
      { id: 'g1', label: '“Can I swap a shift from my phone in a few taps?”', lane: 'user' },
      { id: 'g2', label: '“What will this save us per year, compared with overtime costs now?”', lane: 'buyer' },
      { id: 'g3', label: '“Does it support single sign-on with our staff accounts?”', lane: 'it' },
      { id: 'g4', label: '“We need net-60 payment terms and a signed data processing agreement.”', lane: 'proc' },
      { id: 'g5', label: '“Will it show my rota for next week at a glance?”', lane: 'user' },
      { id: 'g6', label: '“Can we start with one ward and expand next financial year?”', lane: 'buyer' },
      { id: 'g7', label: '“Where is patient and staff data stored, and is it encrypted?”', lane: 'it' },
      { id: 'g8', label: '“Policy says we need three vendor quotes before signing.”', lane: 'proc' },
    ],
  },
  gap: {
    id: 'gap', from: 18, at: 23.4,
    prompt: 'Users love the trial, but IT blocks it over security. What should the product team build?',
    options: [{ id: 'a', label: 'More features for nurses' }, { id: 'b', label: 'Single sign-on and a clear security page for IT' }, { id: 'c', label: 'A discount' }],
    correct: 'b', explanation: 'Remove the blocker for the role that’s saying no.',
  },
  takeaways: [
    { title: 'B2C: one buyer', body: 'Fast, personal, emotional. The product sells itself or not.' },
    { title: 'B2B: a buying group', body: 'Users, budget holder, IT, procurement. Each can say no.' },
    { title: 'Design for every role', body: 'Delight for users, ROI for managers, trust for IT, clarity for procurement.' },
  ],
  quiz: {
    seconds: 12,
    questions: [
      { id: 'q1', prompt: 'B2B buying usually takes…', options: [{ id: 'a', label: 'Weeks to months' }, { id: 'b', label: 'Seconds' }], correct: 'a', explanation: 'Approvals take time.' },
      { id: 'q2', prompt: '“Is our data encrypted?” comes from…', options: [{ id: 'a', label: 'Procurement' }, { id: 'b', label: 'IT & security' }, { id: 'c', label: 'Users' }], correct: 'b', explanation: 'Security.' },
      { id: 'q3', prompt: 'In B2C, who decides?', options: [{ id: 'a', label: 'A committee' }, { id: 'b', label: 'IT' }, { id: 'c', label: 'Procurement' }, { id: 'd', label: 'Usually one person' }], correct: 'd', explanation: 'The consumer.' },
      { id: 'q4', prompt: 'An ROI calculator mainly helps…', options: [{ id: 'a', label: 'Daily users' }, { id: 'b', label: 'IT' }, { id: 'c', label: 'The budget holder' }, { id: 'd', label: 'Consumers' }], correct: 'c', explanation: 'They justify the spend.' },
    ],
  },
  ladder: [
    { id: 'l1', prompt: 'In B2B, the user and the buyer are often…', hint: 'Same person?', options: [{ id: 'a', label: 'Different people, with different needs' }, { id: 'b', label: 'Always the same' }, { id: 'c', label: 'Competitors' }, { id: 'd', label: 'Consumers' }], correct: 'a', explanation: 'Design must win both.' },
    { id: 'l2', prompt: 'What’s a “champion” in B2B sales?', hint: 'An insider.', options: [{ id: 'a', label: 'The top salesperson' }, { id: 'b', label: 'Someone inside the customer who pushes for your product' }, { id: 'c', label: 'A competitor' }, { id: 'd', label: 'An award' }], correct: 'b', explanation: 'Give champions materials to convince others.' },
    { id: 'l3', prompt: 'Product-led growth (PLG) in B2B means…', hint: 'Bottom up.', options: [{ id: 'a', label: 'Only sales calls' }, { id: 'b', label: 'Ads on TV' }, { id: 'c', label: 'Users adopt a free version themselves, then the company buys' }, { id: 'd', label: 'No product at all' }], correct: 'c', explanation: 'Tools like Slack or Figma spread team by team.' },
    { id: 'l4', prompt: 'Why does onboarding matter even more in B2B trials?', hint: 'Short window, many judges.', options: [{ id: 'a', label: 'It doesn’t' }, { id: 'b', label: 'Trials are long' }, { id: 'c', label: 'Only IT sees it' }, { id: 'd', label: 'A trial is often a short evaluation; if the team can’t see value fast, the deal dies' }], correct: 'd', explanation: 'Time-to-value decides trials.' },
    { id: 'l5', prompt: 'A B2B pricing page should usually show…', hint: 'Different readers.', options: [{ id: 'a', label: 'Clear tiers, what’s included, security and contact options for larger teams' }, { id: 'b', label: 'Only “Contact us”' }, { id: 'c', label: 'Nothing' }, { id: 'd', label: 'Just a logo' }], correct: 'a', explanation: 'Serve the self-serve buyer and the committee.' },
  ],
};
