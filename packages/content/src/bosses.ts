// Boss briefs for chapters with playable lessons. DRAFTS for review (same as the lesson files).
import { BossBrief, type BossBriefInput } from './boss';

const fd1: BossBriefInput = {
  chapterId: 'fd.1',
  title: 'Reframe “make it pop”',
  minutes: 30,
  scenario: [
    'You join Dabba, a lunch-subscription app in Bengaluru. On your first day the head of marketing messages you: “The menu screen is boring. Can you make it pop? Maybe more colour, bigger photos.”',
    'You have one fact: 62% of people who open the weekly menu leave without picking any meals, and most of them come back later to pick the default thali.',
    'Before you open a design tool, turn the request into a problem worth solving.',
  ],
  fields: [
    { id: 'request', label: 'The request, in its own words', kind: 'long', minWords: 8, hint: 'What was asked for, and what solution is already baked into it?' },
    { id: 'problem', label: 'Problem statement', kind: 'long', minWords: 15, hint: 'Who is stuck, doing what, and why it matters. No solution in it.', placeholder: 'People who … struggle to … because … which means …' },
    { id: 'metric', label: 'How you’ll know it’s solved', kind: 'text', minWords: 6, hint: 'One measurable signal, with a direction and a rough target.' },
    { id: 'questions', label: 'Questions to ask before designing', kind: 'list', items: 3, minWords: 4, hint: 'What would you need to find out? Ask about people and behaviour, not colours.' },
  ],
  rubric: [
    { id: 'solution-free', label: 'Stays in the problem space', strong: 'The problem statement names no UI change (no colours, photos, layouts). It notices that “more colour, bigger photos” is a solution in disguise.', weight: 2, required: true },
    { id: 'who-what-why', label: 'Who, what and why', strong: 'Names a specific group (e.g. weekly subscribers who open the menu), the struggle (leaving without choosing) and why it matters to them and to the business.', weight: 2, required: true },
    { id: 'uses-evidence', label: 'Uses the evidence', strong: 'Builds on the 62% drop-off and the fallback to the default thali instead of the stakeholder’s guess.', weight: 1 },
    { id: 'metric', label: 'Measurable success', strong: 'One metric tied to the problem (e.g. share of menu visits that end with a meal picked), with a direction and target, not “engagement”.', weight: 2 },
    { id: 'questions', label: 'Useful questions', strong: 'Questions probe behaviour and causes (why people leave, what they do instead), not preferences (“do you like blue?”).', weight: 1 },
  ],
  tips: ['If your problem statement still makes sense with any design, it’s solution-free.', 'A good metric can go down. “Users are happier” can’t.'],
  example: {
    request: 'Marketing asked for “more colour and bigger photos” on the menu. That’s a solution, and it assumes the problem is how the menu looks.',
    problem: 'Weekly subscribers open the menu to plan their lunches but 62% leave without choosing, then fall back to the default thali. They aren’t getting the variety they pay for, and Dabba risks them cancelling from boredom.',
    metric: 'Share of menu visits that end with at least one meal picked: from 38% to 55% in six weeks.',
    questions: ['What are people trying to decide when they open the menu, and what makes them give up?', 'When people come back later, what has changed?', 'Do people who always get the default thali cancel more often?'],
  },
};

const fd2: BossBriefInput = {
  chapterId: 'fd.2',
  title: 'Annotate a settings screen',
  minutes: 30,
  scenario: [
    'This is the account settings screen of a bill-splitting app. Support says people “can’t find anything” on it.',
    'Its twelve rows are below. Annotate it like a design reviewer: name the principles it uses or breaks, point to exactly where, and say what that does to the person using it.',
  ],
  mock: 'settings-list',
  fields: [
    { id: 'notes', label: 'Annotations', kind: 'list', items: 4, minWords: 10, hint: 'Principle → where on the screen → effect on the user. Mix what works and what breaks.', placeholder: 'Proximity (breaks): “Delete account” sits right next to “Edit profile”, so …' },
    { id: 'fix', label: 'The one change you’d make first', kind: 'long', minWords: 15, hint: 'Pick the annotation with the biggest effect and say why it goes first.' },
  ],
  rubric: [
    { id: 'named', label: 'Names real principles', strong: 'Each note names a principle from the chapter (proximity, similarity, hierarchy, Hick’s law, Fitts’s law, chunking…) and uses it correctly.', weight: 2, required: true },
    { id: 'located', label: 'Points to the exact spot', strong: 'Every note says where on the screen: which row, label or group. No generic “the layout is cluttered”.', weight: 2 },
    { id: 'effect', label: 'Says what it does to people', strong: 'Each note explains the effect on someone using it (slower to scan, risky tap, hard to find), not just “looks bad”.', weight: 2, required: true },
    { id: 'balance', label: 'Sees what works too', strong: 'At least one note is about something the screen does well and why.', weight: 1 },
    { id: 'priority', label: 'Prioritises with a reason', strong: 'The first change is chosen for its impact on the support complaint, with the reasoning spelled out.', weight: 1 },
  ],
  tips: ['Read the screen in 5 seconds first. What did your eye land on? That’s your hierarchy note.'],
  example: {
    notes: [
      'Chunking (breaks): all twelve options sit in one flat list, so people read every row to find one setting.',
      'Proximity (breaks): “Delete account” sits right under “Connected apps” with the same spacing and style, so it reads as an everyday option and is easy to tap by mistake.',
      'Similarity (works): every row uses the same icon, label and chevron pattern, so people learn quickly that each row opens a page.',
      'Hick’s law (breaks): with no groups, people choose among 12 options at once instead of 3–4 groups, which slows down every visit.',
    ],
    fix: 'Group the rows into Account, Notifications, Preferences and a separated Danger zone. It fixes the “can’t find anything” complaint (chunking and Hick’s law) and moves the risky action away from everyday ones.',
  },
};

const rs1: BossBriefInput = {
  chapterId: 'rs.1',
  title: 'Turn an assumption into research',
  minutes: 30,
  scenario: [
    'The founder of a UPI payments app is sure that “older users don’t trust QR payments, so we should add a voice confirmation”.',
    'Nobody has checked. Your job is to turn this belief into research the team can run next week, without assuming the answer.',
  ],
  fields: [
    { id: 'assumption', label: 'The assumption, split into parts', kind: 'long', minWords: 12, hint: 'What is believed about who, what they feel, and what would fix it? Each part can be wrong separately.' },
    { id: 'questions', label: 'Three research questions', kind: 'list', items: 3, minWords: 6, hint: 'Open, neutral, answerable. What the team needs to learn, not what you’d ask in an interview.' },
    { id: 'method', label: 'How you’d answer the first one', kind: 'long', minWords: 15, hint: 'Generative or evaluative? Qual or quant? Who, how many, and why that method.' },
  ],
  rubric: [
    { id: 'decomposed', label: 'Splits the assumption', strong: 'Separates the claims (older users hesitate with QR; the cause is trust; voice confirmation would help) so each can be tested on its own.', weight: 2 },
    { id: 'neutral', label: 'Neutral questions', strong: 'No question presumes the answer (“Why don’t older users trust QR?” presumes they don’t). Each could come back “no”.', weight: 2, required: true },
    { id: 'answerable', label: 'Answerable and specific', strong: 'Each question names who and what behaviour, and research could actually answer it.', weight: 2, required: true },
    { id: 'method', label: 'Fitting method', strong: 'The method suits the question (e.g. observation or interviews to find causes, data to measure the drop-off) and explains who and how many.', weight: 1 },
  ],
  tips: ['If you can only imagine one answer to your question, it’s leading.'],
  example: {
    assumption: 'Three beliefs: (1) people over 55 drop out of QR payments more than others; (2) the reason is distrust, not, say, small text or a slow camera; (3) a voice confirmation would address that reason.',
    questions: ['How does the QR payment completion rate of people over 55 compare with other age groups?', 'Where in the QR payment flow do older users hesitate or drop out, and what are they doing at that moment?', 'What do older users do to feel sure a payment went through?'],
    method: 'Generative and qualitative for the second question: watch 6–8 people over 55 pay a local shop with QR, in context, and ask them to think aloud. Watching shows where they hesitate and why, which a survey can’t.',
  },
};

const ia1: BossBriefInput = {
  chapterId: 'ia.1',
  title: 'Untangle the Profile tab',
  minutes: 35,
  scenario: [
    'Thali, a food-delivery app, keeps adding things to its Profile tab. It is now one flat list of 16 rows, in the order they were built:',
    'Edit profile · Refund status · Saved addresses · Thali One membership · Payment methods · Order history · Notification settings · Coupons · Language · Help centre · Gift card balance · Dietary preferences · Report an issue · Refer a friend · Privacy & data · Log out.',
    'Support tickets say people can’t find refunds, coupons or how to change their address. Restructure the tab so people can find things, and say how you’d check it works.',
  ],
  fields: [
    { id: 'groups', label: 'Your groups', kind: 'list', items: 4, minWords: 6, hint: 'Name each group in the user’s words and list the rows inside it. Every one of the 16 rows needs a home.', placeholder: 'Your orders: Order history, Refund status, Report an issue' },
    { id: 'decisions', label: 'Hard calls', kind: 'long', minWords: 25, hint: 'Which rows could live in two places, and where did you put them? Did you rename, merge or move anything out of the tab?' },
    { id: 'test', label: 'How you’d check it', kind: 'long', minWords: 15, hint: 'Which method, with whom, and which tasks? Use the support complaints.' },
  ],
  rubric: [
    { id: 'complete', label: 'Every row has a home', strong: 'All 16 rows appear exactly once, or a row is deliberately cross-linked or removed with a reason.', weight: 1, required: true },
    { id: 'user-model', label: 'Groups follow the user’s model', strong: 'Groups reflect what people are trying to do (orders and problems with them, money, offers, my details), not how the company is organised. Labels are plain words, not jargon.', weight: 2, required: true },
    { id: 'balanced', label: 'Balanced structure', strong: 'About 3–5 groups of 2–6 rows. Nothing too wide (a 10-row group) or pointlessly deep. Log out sits apart from everyday rows.', weight: 2 },
    { id: 'ambiguous', label: 'Handles the ambiguous rows', strong: 'Spots the rows people could look for in two places (Refund status, Gift card balance, Report an issue) and chooses deliberately, e.g. a cross-link.', weight: 2 },
    { id: 'test', label: 'A real test plan', strong: 'Proposes a tree test or closed card sort with 15+ target users, using tasks drawn from the support tickets (find refund status, apply a coupon, change address).', weight: 1 },
  ],
  tips: ['Start from the support tickets: the three things people can’t find should be the easiest to reach.', 'If a group name could be on any app’s menu (“Other”, “More”), it’s not doing its job.'],
  example: {
    groups: [
      'Your orders: Order history, Refund status, Report an issue',
      'Money & offers: Payment methods, Gift card balance, Coupons, Thali One membership, Refer a friend',
      'You: Edit profile, Saved addresses, Dietary preferences',
      'App settings: Notification settings, Language, Privacy & data, Help centre, and Log out separated at the bottom',
    ],
    decisions: 'Refund status could be under Orders or Money; tickets show people think of a refund as part of an order, so it lives in Your orders with a link from Payment methods. Gift card balance goes with money, not offers, because people use it to pay. Help centre moves to settings but Report an issue stays with orders, where problems happen.',
    test: 'A tree test with 20 Thali users, with tasks from the tickets: “Check whether your refund came through”, “Use the coupon you got by SMS”, “Change where your food is delivered”. I’d look at first-click success and where wrong clicks go.',
  },
};

const ui1: BossBriefInput = {
  chapterId: 'ui.1',
  title: 'Fix three broken cards',
  minutes: 30,
  scenario: [
    'A grocery app’s developer built three cards by eye. They work, but they feel messy. You may only use this spacing scale: 4 · 8 · 16 · 24 · 32 · 48.',
    'Product card: 13px padding. Image → name 5px, name → price 22px, price → “Add” button 9px. The name is centred, the price is left-aligned and the button is right-aligned.',
    'Order summary: rows “Items ₹420”, “Delivery ₹30”, “Total ₹450”. Labels are left-aligned, amounts sit right after each label (not lined up). Every row has a divider, and there is 6px between rows and 6px above Total.',
    'Profile card: avatar → name 18px, name → city 17px, city → “Edit profile” button 3px. The avatar is centred, the text is left-aligned.',
  ],
  fields: [
    { id: 'fixes', label: 'Your fix for each card', kind: 'list', items: 3, minWords: 15, hint: 'Give every gap a value from the scale and say how you’d align things. One item per card.', placeholder: 'Product card: padding 16; image → name 8; …' },
    { id: 'rule', label: 'The rule you followed', kind: 'long', minWords: 12, hint: 'How did you decide which gaps are small and which are big?' },
    { id: 'lines', label: 'Lines you removed or kept', kind: 'text', minWords: 6, hint: 'Which dividers did you cut, and did anything need to stay?' },
  ],
  rubric: [
    { id: 'on-scale', label: 'Every value is on the scale', strong: 'Every gap and padding uses 4, 8, 16, 24, 32 or 48. No leftover 13s or 22s.', weight: 2, required: true },
    { id: 'grouping', label: 'Spacing shows grouping', strong: 'Related things get small gaps (name → price, city under name) and separate parts get bigger ones (above Total, before the button). Inside never exceeds between.', weight: 2, required: true },
    { id: 'alignment', label: 'Sensible alignment', strong: 'Each card uses one alignment edge; amounts are right-aligned so they line up; centred items are short and deliberate.', weight: 2 },
    { id: 'lines', label: 'Space over lines', strong: 'Removes the per-row dividers in the summary and uses a bigger gap (or a single divider) above Total instead.', weight: 1 },
    { id: 'rule', label: 'A clear rule', strong: 'States a reusable rule, e.g. “4–8 inside a group, 16–24 inside a card, 32+ between sections”.', weight: 1 },
  ],
  tips: ['Snap each value to its nearest step first, then check that small gaps sit inside groups and big ones between.'],
  example: {
    fixes: [
      'Product card: padding 16; image → name 8; name → price 4 (they belong together); price → button 16. Left-align the name and price with the button full width, so everything shares one edge.',
      'Order summary: drop the row dividers; 8 between rows, 24 above Total with one divider there; right-align all amounts in one column with tabular figures so ₹420, ₹30 and ₹450 line up.',
      'Profile card: padding 24; avatar → name 16; name → city 4; city → button 24. Left-align the avatar too, so the card has one edge instead of two.',
    ],
    rule: 'Tight (4–8) between things that describe the same item, medium (16–24) inside a card and before actions, loose (32+) between sections. A gap inside a group is never bigger than a gap between groups.',
    lines: 'Removed all three summary dividers; kept a single line above Total because it marks the sum.',
  },
};

const cw1: BossBriefInput = {
  chapterId: 'cw.1',
  title: 'Rewrite a broken onboarding',
  minutes: 30,
  scenario: [
    'Paisa, a savings app, has a three-screen onboarding. Most people quit before finishing. Every string on it is below. Rewrite them so a first-time user gets through without thinking.',
    'Screen 1 · Welcome. Headline: “Unlock financial freedom 🚀”. Body: “Leverage our synergistic ecosystem to optimise your wealth journey.” Button: “Let’s go!”',
    'Screen 2 · Phone number. Label: “MSISDN”. Button: “Submit”. Error when a 9-digit number is typed: “Error 4012: invalid input”.',
    'Screen 3 · Home, first visit. The savings goals list is empty and says only “No data.”',
  ],
  fields: [
    { id: 'welcome', label: 'Screen 1: headline, body and button', kind: 'long', minWords: 15, hint: 'Say what the app does for this person and what the button leads to.' },
    { id: 'phone', label: 'Screen 2: label, button and error', kind: 'long', minWords: 15, hint: 'Plain label, a verb-plus-object button, and an error that says what’s wrong and how to fix it.' },
    { id: 'empty', label: 'Screen 3: the empty goals list', kind: 'long', minWords: 12, hint: 'What goes here, why it’s empty, and one action.' },
    { id: 'principles', label: 'The rules you followed', kind: 'list', items: 3, minWords: 5, hint: 'Three short rules a teammate could use on the next screen.' },
  ],
  rubric: [
    { id: 'clear', label: 'Clear over clever', strong: 'The welcome says plainly what Paisa does for the user (e.g. save a little every day towards a goal). No jargon (“synergistic”, “leverage”, “MSISDN”) and no slogan that needs decoding.', weight: 2, required: true },
    { id: 'buttons', label: 'Buttons say what happens', strong: 'Every button is a verb plus object or outcome (“Set a savings goal”, “Send OTP”), never “Submit” or “Let’s go!”.', weight: 2, required: true },
    { id: 'error', label: 'A helpful error', strong: 'The error says what’s wrong and how to fix it (“Phone numbers need 10 digits”), shown at the field, without blame or codes.', weight: 2 },
    { id: 'empty', label: 'A useful empty state', strong: 'Explains what goals are, that there are none yet, and gives one clear action to create the first goal.', weight: 1 },
    { id: 'rules', label: 'Reusable rules', strong: 'Three rules a teammate could apply elsewhere (e.g. “verb + object on every button”, “errors say what and how”).', weight: 1 },
  ],
  tips: ['Read your strings in two seconds each, as if on a crowded bus. Anything you have to reread, rewrite.'],
  example: {
    welcome: 'Headline: “Save a little every day.” Body: “Set a goal, like a phone or a trip, and Paisa puts aside small amounts for you.” Button: “Set my first goal”.',
    phone: 'Label: “Mobile number”. Button: “Send OTP”. Error under the field: “Mobile numbers need 10 digits. You’ve entered 9.”',
    empty: '“Your savings goals will show up here. You haven’t set one yet.” Button: “Create a goal”.',
    principles: ['Say what the app does, not what it dreams of', 'Every button is a verb plus what it acts on', 'Errors say what went wrong and how to fix it'],
  },
};

const st1: BossBriefInput = {
  chapterId: 'st.1',
  title: 'Pick the top 3 of 10',
  minutes: 40,
  scenario: [
    'You’re the designer on Thali, a lunch-delivery app. This quarter’s outcome: more weekly orders from regulars (people who ordered at least 3 times last month). There’s room for three projects.',
    'The requests (reach = regulars affected per month; effort in weeks): 1 One-tap reorder (reach 9,000; 2 wks). 2 Dark mode (12,000; 3 wks). 3 Lunchtime reminder with your usual (8,000; 1 wk). 4 Group orders with colleagues (2,000; 6 wks). 5 Voice search (12,000; 8 wks). 6 Free delivery over ₹199 (10,000; 1 wk, costs margin). 7 Recipe blog (1,000; 4 wks). 8 Fix slow checkout on older Android phones (5,000; 3 wks). 9 Loyalty tiers (6,000; 8 wks). 10 Weekly lunch plan set once (4,000; 4 wks).',
    'The CEO loves voice search. Support says checkout on older phones is the top complaint.',
  ],
  fields: [
    { id: 'scores', label: 'Your RICE estimates for the main contenders', kind: 'long', minWords: 30, hint: 'Give impact (3 massive, 2 high, 1 medium, 0.5 low) and confidence (%) for at least five requests, and show the score.' },
    { id: 'top', label: 'Your top 3, in order', kind: 'list', items: 3, minWords: 8, hint: 'For each: the request and why it moves weekly orders from regulars.' },
    { id: 'no', label: 'What you’d say no to, and how you’d tell the CEO', kind: 'long', minWords: 20, hint: 'Be kind and specific: tie the answer back to the outcome and the numbers.' },
    { id: 'measure', label: 'How you’ll know it worked', kind: 'text', minWords: 8, hint: 'Which number, measured how, after how long?' },
  ],
  rubric: [
    { id: 'outcome', label: 'Tied to the outcome', strong: 'Every top pick is argued in terms of weekly orders from regulars, not general appeal. Requests that don’t serve regulars (recipe blog, dark mode) are recognised as off-outcome.', weight: 2, required: true },
    { id: 'rice', label: 'Sensible RICE scoring', strong: 'Uses reach and effort from the brief, states impact and confidence on a scale, does the maths right, and lets confidence drop for unproven ideas like voice search.', weight: 2, required: true },
    { id: 'judgment', label: 'Judgment beyond the numbers', strong: 'Spots trade-offs the score hides (free delivery costs margin; the checkout bug is a basic that’s broken) and explains any departure from pure score order.', weight: 2 },
    { id: 'no', label: 'A good no', strong: 'Says no to voice search respectfully, with the numbers and the outcome, and offers what would change the decision (e.g. evidence of demand).', weight: 1 },
    { id: 'measure', label: 'Measurable success', strong: 'Names the metric (weekly orders per regular), a baseline or target and a time frame.', weight: 1 },
  ],
  tips: ['Score first, then argue. If you break the score order, say why.'],
  example: {
    scores: 'One-tap reorder: 9,000 × 2 × 80% ÷ 2 = 7,200. Lunchtime reminder: 8,000 × 1 × 80% ÷ 1 = 6,400. Free delivery over ₹199: 10,000 × 1 × 50% ÷ 1 = 5,000. Fix slow checkout: 5,000 × 2 × 90% ÷ 3 = 3,000. Voice search: 12,000 × 0.5 × 20% ÷ 8 = 150. Dark mode: 12,000 × 0.25 × 80% ÷ 3 = 800.',
    top: [
      'One-tap reorder: regulars reorder the same lunch, and removing steps makes the repeat order effortless.',
      'Lunchtime reminder with your usual: it’s cheap, and interviews say regulars simply forget. It pairs with one-tap reorder.',
      'Fix slow checkout on older Android phones: it scores below free delivery, but it’s a broken basic, the top support complaint, and we lose orders we already won.',
    ],
    no: 'Voice search scores 150 against 7,200 for reorder: few regulars would use it, we have no evidence they want it, and it takes 8 weeks. I’d tell the CEO it’s parked, not dead: if a quick test shows demand, it comes back with higher confidence.',
    measure: 'Weekly orders per regular, from 1.2 to 1.5 within six weeks of the three launches, compared with last quarter.',
  },
};

const rs2: BossBriefInput = {
  chapterId: 'rs.2',
  title: 'Interview three people',
  minutes: 120,
  scenario: [
    'This one happens in the real world. Pick an everyday habit, like how people pay bills, plan meals, commute or save money, and interview three real people about it (friends and family count). 20–30 minutes each, with their consent.',
    'Hand in your script and your notes. Notes should record what people said and did, kept separate from what you think it means. Then name what you saw across all three.',
  ],
  fields: [
    { id: 'habit', label: 'The habit, and who you spoke to', kind: 'text', minWords: 10, hint: 'The habit, plus a line on each person (no full names).' },
    { id: 'script', label: 'Your core questions', kind: 'list', items: 5, minWords: 6, hint: 'From warm-up to deep dive. Open, about real past behaviour.' },
    { id: 'notes', label: 'Notes, one item per person', kind: 'list', items: 3, minWords: 30, hint: 'Quotes and observed behaviour first. Mark your interpretations clearly, e.g. “I think…”.' },
    { id: 'patterns', label: 'What you saw across all three', kind: 'long', minWords: 30, hint: 'One or two patterns, one surprise, and one thing you’d ask differently next time.' },
  ],
  rubric: [
    { id: 'questions', label: 'Open questions about real behaviour', strong: 'Core questions are open (“Walk me through…”, “Tell me about the last time…”), ask about the past rather than predictions, and don’t lead.', weight: 2, required: true },
    { id: 'shape', label: 'A script with shape', strong: 'Moves from warm-up to broad questions to a specific recent story.', weight: 1 },
    { id: 'notes', label: 'Observation separate from interpretation', strong: 'Notes record quotes and behaviour, with interpretations clearly marked as such. Includes at least one verbatim quote per person.', weight: 2, required: true },
    { id: 'patterns', label: 'Patterns across people', strong: 'Names a pattern seen in at least two of the three, supported by notes, and a surprise or contradiction.', weight: 2 },
    { id: 'reflection', label: 'Honest reflection', strong: 'Names a specific question or moment they’d handle differently (e.g. “I led with ‘was it hard?’”).', weight: 1 },
  ],
  tips: ['Ask “tell me about the last time…” more than any other question.', 'Write quotes word for word, in quotation marks. Your summary of them goes on a separate line.'],
  example: {
    habit: 'How people pay household bills. A, 58, retired teacher; B, 31, software tester; C, 24, college student living with her parents.',
    script: ['Tell me a bit about your household and who handles what.', 'How do you keep track of bills that are coming up?', 'Walk me through the last bill you paid, from remembering it to it being done.', 'Tell me about a time a bill payment went wrong.', 'Is there anything about this I should have asked?'],
    notes: [
      'A: “My son sets them up, I just press the button he shows me.” Keeps a paper list of due dates on the fridge. Checks the bank SMS twice before believing it’s paid. I think: trust comes from the SMS, not the app.',
      'B: “I pay everything the minute the reminder comes, or I forget.” Showed me five apps with reminders. Missed the water bill last month because it has no reminder. I think: reminders are the real product for him.',
      'C: “Dad pays, I just tell him the amount.” Uses screenshots of bills on WhatsApp to send to her father. I think: one person pays for the family; others are messengers.',
    ],
    patterns: 'Pattern: in two of three homes one person pays and others pass on information (A’s son, C’s father), often over WhatsApp screenshots. Surprise: B is the most digital but missed a bill, because he relies entirely on reminders. Next time I’d stop asking “was that hard?”, which led A to agree.',
  },
};

const ui2: BossBriefInput = {
  chapterId: 'ui.2',
  title: 'Set the type for a reading app',
  minutes: 40,
  scenario: [
    'Kahani is a short-story app for phones and tablets. Right now every screen uses text sizes picked by eye: 14, 15, 17, 18, 21, 22 and 30px, in three different fonts, and story text runs edge to edge on tablets at line height 1.2.',
    'Set one type scale for the whole app and apply it to two screens. The Library screen lists stories: a screen title, a “Continue reading” card (story title, author, “12 min left”), and a list of stories, each with a title, author and a one-line blurb. The Story screen shows a story title, author and reading time, then the story text with a few section breaks.',
  ],
  fields: [
    { id: 'scale', label: 'Your type scale', kind: 'long', minWords: 15, hint: 'Base size, ratio, and every step with a name and what it’s for.', placeholder: 'Base 16, ratio 1.25: small 13 (…), body 16 (…), …' },
    { id: 'fonts', label: 'Fonts, and why', kind: 'text', minWords: 12, hint: 'One or two fonts, the weights you’ll use, and why they suit long reading.' },
    { id: 'screens', label: 'Each screen, set', kind: 'list', items: 2, minWords: 25, hint: 'One item per screen. Give every piece of text a step, a weight and (for body text) a line height.' },
    { id: 'reading', label: 'Line length and leading for story text', kind: 'text', minWords: 12, hint: 'How you keep story text comfortable on a phone and on a tablet.' },
  ],
  rubric: [
    { id: 'scale', label: 'A real scale', strong: 'A base around 16–18px and one ratio, with steps rounded and named by role. No leftover near-duplicates like 17 and 18.', weight: 2, required: true },
    { id: 'reading', label: 'Comfortable story text', strong: 'Story text at the base size or one step up, line height about 1.5, and a maximum width of about 65 characters on tablets.', weight: 2, required: true },
    { id: 'hierarchy', label: 'Clear levels on both screens', strong: 'Titles, headings, body and details each use a distinct step or weight, and the same role uses the same step on both screens.', weight: 2 },
    { id: 'fonts', label: 'Restrained pairing', strong: 'One or two clearly different fonts, a body font chosen for reading, and only a few weights.', weight: 1 },
    { id: 'details', label: 'Typographic details', strong: 'Mentions at least one detail such as tighter leading for big titles, tabular figures for times, or left-aligned body text.', weight: 1 },
  ],
  tips: ['Start from the story text: pick its size and line height first, then build the scale up and down from it.', 'Check the two screens side by side. A story title should look the same on both.'],
  example: {
    scale: 'Base 16, ratio 1.25, rounded: Small 13 (author, time left, tab labels), Body 16 (blurbs, UI text), Large 20 (story text, and story titles in lists), Heading 25 (screen titles, section breaks), Display 31 (story title on the Story screen).',
    fonts: 'A serif (Source Serif) for story text and the Story title, because it’s calm for long reading; one sans (Inter) in Regular and Semibold for all UI text. Four files in total.',
    screens: [
      'Library: “Library” Heading 25 Semibold sans. Continue card: story title Large 20 Semibold, author Small 13, “12 min left” Small 13 with tabular figures. Each list row: title Large 20 Semibold, author Small 13, blurb Body 16 at 1.5, one line.',
      'Story: title Display 31 serif at line height 1.2, author and reading time Small 13 sans on one line, story text Large 20 serif at line height 1.6, section breaks as Heading 25 serif with 32px space above.',
    ],
    reading: 'Story text gets max-width 65ch, centred in the screen on tablets, left-aligned inside. On phones it’s about 35 characters a line, which is normal; I keep it at 20px rather than shrinking it to fit more.',
  },
};

const ui3: BossBriefInput = {
  chapterId: 'ui.3',
  title: 'A light and dark palette that passes',
  minutes: 45,
  scenario: [
    'Kosh is a budgeting app. Its colours were picked screen by screen: 11 blues, 6 greys, a red that’s also the brand colour, and a dark mode made by inverting everything. Support gets complaints that grey labels are hard to read and that “everything looks like an error”.',
    'Build one palette with a light and a dark theme. Every text and icon pair must pass WCAG AA (4.5:1 for body text, 3:1 for large text and icons). Use a contrast checker (any free one) and report the numbers.',
  ],
  fields: [
    { id: 'ramps', label: 'Your ramps', kind: 'long', minWords: 20, hint: 'Brand, neutral and semantic ramps: how many steps, built how (HSL or OKLCH), and a few key values.', placeholder: 'Brand: indigo, 10 steps in OKLCH, 600 = #4F46E5 …' },
    { id: 'roles', label: 'Role tokens in both themes', kind: 'list', items: 4, minWords: 10, hint: 'One item per role (e.g. text, muted text, surface, primary button). Say which ramp step it uses in light and in dark.' },
    { id: 'checks', label: 'Contrast checks', kind: 'long', minWords: 20, hint: 'At least six pairs with their ratios, covering both themes. Say what you changed when something failed.' },
    { id: 'semantic', label: 'Brand vs. error', kind: 'text', minWords: 12, hint: 'How you separated the brand from error, and how errors read without colour.' },
  ],
  rubric: [
    { id: 'contrast', label: 'Passes AA, with numbers', strong: 'Reports at least six real ratios across both themes; body text is 4.5:1 or more, large text and icons 3:1 or more, and failures were fixed.', weight: 2, required: true },
    { id: 'ramps', label: 'Real ramps', strong: 'A brand ramp, a neutral ramp and semantic colours, each with named steps built on a consistent method (ideally OKLCH), replacing the one-off colours.', weight: 2, required: true },
    { id: 'dark', label: 'Dark mode done properly', strong: 'Dark grey base rather than pure black, lighter raised surfaces, adjusted (not inverted) brand and text colours, chosen through role tokens.', weight: 2 },
    { id: 'semantic', label: 'Meaning separated from brand', strong: 'Brand moves away from error red, semantic tokens are named by meaning, and errors use an icon and words too.', weight: 1 },
    { id: 'tokens', label: 'Role tokens', strong: 'Components use roles (text, muted, surface, primary) that point at ramp steps, so themes swap pointers rather than colours.', weight: 1 },
  ],
  tips: ['Do the neutrals first. Text, surfaces and borders are most of the screen, and most contrast problems live there.', 'Check the muted text and the brand-coloured links in dark mode. They fail most often.'],
  example: {
    ramps: 'Brand moves from red to indigo, 10 steps in OKLCH (L from 0.97 to 0.28, hue 275); 600 = #4F46E5. Neutral: 10 greys with a hint of indigo, 50 = #F8F9FC to 900 = #111320. Semantic: error red, success green, warning amber, info blue, each with a tint (100), a solid (600) and a text shade (800).',
    roles: [
      'Text: neutral-900 in light (#111320) and neutral-50 in dark (#F8F9FC), for all body copy.',
      'Muted text: neutral-600 in light (#525771), neutral-300 in dark (#B7BACB).',
      'Surface: white in light; neutral-900 base (#111320) with raised cards at neutral-800 (#1C1F2E) in dark.',
      'Primary button: brand-600 with white text in light; brand-400 with neutral-900 text in dark.',
    ],
    checks: 'Light: text on white 18.1:1; muted text on white 7.4:1; white on brand-600 6.3:1; error-800 on error-100 7.9:1. Dark: text on base 17.2:1; muted on base 9.6:1 (was neutral-500 at 3.1:1, failed, moved to 300); neutral-900 on brand-400 7.0:1; brand link brand-300 on base 7.8:1 (brand-600 was only 3.0:1).',
    semantic: 'Brand is now indigo, so nothing brand-coloured looks like an error. Errors use error-600 with a warning icon and a message saying what to fix, so they still read in greyscale.',
  },
};

const ds1: BossBriefInput = {
  chapterId: 'ds.1',
  title: 'Audit a real app',
  minutes: 60,
  scenario: [
    'This one uses a real product. Pick an app or website you use often (a food, banking, travel or shopping app works well) and audit it like a design-systems team would.',
    'Screenshot at least eight screens. Cut out every button and every text colour you can find and group them side by side. Count the variants, decide which are intentional and which are drift, and propose a smaller set.',
  ],
  fields: [
    { id: 'app', label: 'The app and the screens you covered', kind: 'text', minWords: 10, hint: 'Name the app and list the screens (at least eight).' },
    { id: 'buttons', label: 'Button inventory', kind: 'long', minWords: 30, hint: 'How many distinct buttons, and how they differ (colour, corners, padding, weight, size). Which are intentional variants and which are drift?' },
    { id: 'colours', label: 'Colour inventory', kind: 'long', minWords: 25, hint: 'How many distinct text and background colours, roughly. Note near-duplicates (two greys that are almost the same).' },
    { id: 'proposal', label: 'Your consolidated set', kind: 'list', items: 3, minWords: 12, hint: 'Three items: the buttons you’d keep, the colour tokens you’d keep, and the first thing you’d replace and why.' },
  ],
  rubric: [
    { id: 'evidence', label: 'A real inventory', strong: 'Covers eight or more screens and gives counts for buttons and colours, with specific differences named (e.g. “radius 4 on Cart, 8 elsewhere”).', weight: 2, required: true },
    { id: 'judgement', label: 'Drift vs. intent', strong: 'Separates intentional variants (destructive, secondary, small) from accidental drift, with a reason for each call.', weight: 2, required: true },
    { id: 'proposal', label: 'A smaller, clear set', strong: 'Proposes a short set of button variants and named colour tokens that covers every real need.', weight: 2 },
    { id: 'priority', label: 'Sensible first step', strong: 'Picks a first fix based on use and impact (e.g. the primary button, used on every screen), not just the ugliest one.', weight: 1 },
    { id: 'tokens', label: 'Uses system language', strong: 'Names tokens by role (color-primary, text-muted) and refers to components and variants rather than screens.', weight: 1 },
  ],
  tips: ['Screenshot first, judge later. Group everything on one big canvas before you decide anything.', 'Zoom in on near-duplicates. Two greys that look the same are the most common drift.'],
  example: {
    app: 'A food delivery app. Screens: home, search results, restaurant page, dish details, cart, checkout, order tracking, profile, help.',
    buttons: '11 distinct buttons. Intentional: primary (filled), secondary (outline), destructive (red “Cancel order”), small “Add” on dishes. Drift: three primary fills (#E23744, #E03546, #D9363E), corners of 6px on cart vs 8px elsewhere, a pill-shaped “Apply coupon”, and bold vs semibold labels between checkout and home.',
    colours: 'About 14 text colours and 9 backgrounds. Five greys for secondary text that are nearly identical (#6B6B6B, #707070, #696969, #757575, #6E6E6E). Two off-white backgrounds a single step apart. The brand red appears in four slightly different values.',
    proposal: [
      'Buttons: primary, secondary, destructive and small, each in one size scale with radius 8 and semibold labels.',
      'Colour tokens: color-primary (one red), text-primary, text-muted (one grey), surface, surface-raised, border, plus error and success.',
      'First fix: the primary button, because it appears on every screen and has three different reds, so one change makes the whole app feel consistent.',
    ],
  },
};

/** Boss briefs keyed by chapter id. */
export const BOSSES: Record<string, BossBrief> = Object.fromEntries(
  [fd1, fd2, rs1, ia1, ui1, cw1, st1, rs2, ui2, ui3, ds1].map(b => { const brief = BossBrief.parse(b); return [brief.chapterId, brief]; }),
);

export const getBoss = (chapterId: string): BossBrief | undefined => BOSSES[chapterId];
