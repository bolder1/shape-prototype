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

const pr1: BossBriefInput = {
  chapterId: 'pr.1',
  title: 'A prototype that answers one question',
  minutes: 90,
  scenario: [
    'Yatra, a bus-ticket app, is adding seat selection. The team argues about whether people will understand a seat map on a small phone screen, or whether a simple list (“Window, lower deck, seat 14”) works better.',
    'Build a clickable prototype (Figma or any tool) that answers one specific question about this, test it with at least three people, and report what you learned. Share a link to the prototype.',
  ],
  fields: [
    { id: 'question', label: 'Your question', kind: 'text', minWords: 12, hint: 'Who, what task, and how you’ll know it worked.' },
    { id: 'scope', label: 'What you built, and what you left out', kind: 'long', minWords: 25, hint: 'Fidelity level, the screens on the path, and what you deliberately skipped. Include the prototype link.' },
    { id: 'test', label: 'The test', kind: 'long', minWords: 20, hint: 'The task you gave, who tried it, and what you watched for.' },
    { id: 'answer', label: 'The answer', kind: 'long', minWords: 25, hint: 'What happened, what it means for the question, and what you’d build or test next.' },
  ],
  rubric: [
    { id: 'question', label: 'A sharp question', strong: 'Names who, the task and a signal of success (e.g. “Can first-time bus travellers pick a window seat on the lower deck within 30 seconds, without help?”).', weight: 2, required: true },
    { id: 'scope', label: 'Scoped to the question', strong: 'Builds only the screens on the task’s path at the lowest fidelity that can answer it, and says what was left out and why.', weight: 2, required: true },
    { id: 'test', label: 'A real test', strong: 'At least three people did a task (not a tour); the report notes what they did, not just what they said.', weight: 2 },
    { id: 'answer', label: 'An honest answer', strong: 'States what the evidence says about the question, including surprises, and a concrete next step.', weight: 1 },
    { id: 'craft', label: 'Working prototype', strong: 'Connections work end to end with a clear starting point, and overlays or variants are used where they fit.', weight: 1 },
  ],
  tips: ['Write the question before opening Figma. If you can’t say what would count as success, the question isn’t ready.', 'Give testers a scenario, e.g. “You get travel sick. Book a seat for tomorrow’s 7 am bus.”'],
  example: {
    question: 'Can first-time users pick a lower-deck window seat on the seat map within 30 seconds, without help?',
    scope: 'A clickable wireframe in Figma (grey boxes, real seat numbers): bus results, seat map with a deck switch, seat selected state, and the passenger details screen. Left out login, payment and search filters, since the task starts with a bus already chosen. Link: figma.com/proto/… (seat map test).',
    test: 'Three people (my cousin, a colleague, a neighbour), each given the scenario “you get travel sick, book a window seat on the lower deck for tomorrow’s 7 am bus”. I timed them and noted where they hesitated or tapped wrongly.',
    answer: 'Two of three succeeded in under 20 seconds. One didn’t notice the upper/lower deck switch and picked an upper seat, thinking it was lower. So the map works, but the deck switch is easy to miss. Next: make the decks two clear tabs above the map and re-test with three new people.',
  },
};

const ax1: BossBriefInput = {
  chapterId: 'ax.1',
  title: 'Audit a landing page for accessibility',
  minutes: 60,
  scenario: [
    'Pick a real landing page (a startup, a bank, a college, a government service) and audit it against the 15-point checklist below, using only your browser: a contrast checker, the Tab key, zoom to 200%, and a screen reader or the browser’s accessibility tree if you can.',
    'Checklist: 1 Text contrast 4.5:1 · 2 Large text and icons 3:1 · 3 Colour is never the only signal · 4 Meaningful images have alt text · 5 Videos have captions · 6 Everything works with the keyboard · 7 Focus is always visible · 8 Tab order follows the page · 9 Touch targets at least 44 px · 10 Page works at 200% zoom · 11 Headings form a logical outline · 12 Links say where they go (no bare “click here”) · 13 Form fields have visible labels · 14 Errors explain how to fix them · 15 Nothing flashes or auto-plays without control.',
  ],
  fields: [
    { id: 'page', label: 'The page you audited', kind: 'text', minWords: 8, hint: 'Name it and say what it’s for. No need to share private details.' },
    { id: 'findings', label: 'Your top five failures', kind: 'list', items: 5, minWords: 15, hint: 'For each: the checklist number, where it happens, how you tested it, and who it affects.' },
    { id: 'passes', label: 'What the page does well', kind: 'text', minWords: 12, hint: 'At least three checklist points it passes, with evidence.' },
    { id: 'fixes', label: 'Fixes, in priority order', kind: 'long', minWords: 30, hint: 'What you’d fix first and why: think impact on users and how many people it blocks.' },
  ],
  rubric: [
    { id: 'evidence', label: 'Tested, not guessed', strong: 'Each finding names how it was tested (contrast ratio, Tab key, zoom, screen reader) and gives specifics such as ratios or element names.', weight: 2, required: true },
    { id: 'coverage', label: 'Covers the checklist', strong: 'Findings and passes together touch most of the 15 points across perception, keyboard, structure and forms.', weight: 2, required: true },
    { id: 'impact', label: 'Names who is affected', strong: 'Connects each failure to people on the spectrum (e.g. keyboard users, low vision, colour blindness, one-handed use).', weight: 2 },
    { id: 'priority', label: 'Sensible priorities', strong: 'Puts blockers first (e.g. keyboard traps, unlabelled forms) ahead of minor issues, and says why.', weight: 1 },
    { id: 'fixes', label: 'Concrete fixes', strong: 'Each fix is specific enough to act on (e.g. “darken #9CA3AF helper text to #6B7280, 4.8:1”).', weight: 1 },
  ],
  tips: ['Start with the Tab key. Put the mouse away and try to complete the page’s main task.', 'Zoom to 200% and see what breaks before you check anything else.'],
  example: {
    page: 'The landing page of a food delivery startup, built to get people to download the app.',
    findings: [
      '#1 Text contrast: the light grey subheading (#A3A3A3 on white) is 2.5:1, checked with a contrast checker. Low-vision users and anyone in sunlight will struggle.',
      '#7 Focus visible: the “Download” and nav links show no focus ring when tabbing; the site sets outline: none. Keyboard users can’t tell where they are.',
      '#4 Alt text: the hero image of the app has no alt attribute, so a screen reader reads the file name “hero_v3_final.png”.',
      '#12 Links: three “Learn more” links go to different pages. Screen reader users listing links hear “Learn more” three times with no context.',
      '#9 Targets: the footer social icons are 20 px with 6 px between them; on a phone, I hit the wrong one twice.',
    ],
    passes: 'Headings follow a clear H1 to H3 outline (#11). The page reflows cleanly at 200% zoom (#10). The sign-up form has visible labels above every field (#13).',
    fixes: 'First, restore visible focus (#7), because keyboard users can’t use the page at all without it. Second, darken the subheading to at least #6B7280 (#1), which affects every visitor. Third, add alt text to the hero (#4) and rename the “Learn more” links (#12), both quick fixes for screen reader users. Last, enlarge and space the footer icons (#9).',
  },
};

const gr1: BossBriefInput = {
  chapterId: 'gr.1',
  title: 'Find the drop-offs in a real onboarding',
  minutes: 60,
  scenario: [
    'Install an app you’ve never used (a fintech, fitness, learning or shopping app works well) and go through its onboarding as a new user. Screenshot every screen from first open until you reach what you think is the aha moment.',
    'Find the three biggest drop-off risks: places where a new user is most likely to give up. Use the funnel, Fogg’s model (motivation, ability, prompt) and your dark-pattern radar to explain each one, and propose a fix.',
  ],
  fields: [
    { id: 'app', label: 'The app, and its aha moment', kind: 'text', minWords: 12, hint: 'Name the app and say what you think the aha moment is, and why.' },
    { id: 'path', label: 'The path to aha', kind: 'long', minWords: 25, hint: 'Every step from first open to the aha, numbered. Mark which steps the aha truly needs.' },
    { id: 'risks', label: 'Three drop-off risks', kind: 'list', items: 3, minWords: 20, hint: 'For each: the step, why people might quit (motivation, ability or prompt), and how you’d measure it.' },
    { id: 'fixes', label: 'Your fixes, and what you’d test first', kind: 'long', minWords: 25, hint: 'A fix per risk, plus which one you’d test first and the metric that would show it worked.' },
  ],
  rubric: [
    { id: 'aha', label: 'A credible aha moment', strong: 'Names a specific action where value is felt (not “sign-up”), with a reason it predicts people staying.', weight: 2, required: true },
    { id: 'diagnosis', label: 'Diagnosed, not just described', strong: 'Each risk is explained with motivation, ability or prompt (or a named dark pattern), tied to a specific step.', weight: 2, required: true },
    { id: 'path', label: 'Path mapped', strong: 'Lists every step to the aha and separates what the aha needs from what could move later or go.', weight: 2 },
    { id: 'fixes', label: 'Fixes that fit the diagnosis', strong: 'Each fix addresses the missing factor (e.g. defer sign-up for an ability problem) and stays ethical.', weight: 1 },
    { id: 'metric', label: 'Measurable', strong: 'Names a step-to-step conversion or activation metric to check whether the fix worked.', weight: 1 },
  ],
  tips: ['Count the taps and the typing between first open and the aha. Every one is a chance to quit.', 'Notice the moments you hesitated. Hesitation is where real users leave.'],
  example: {
    app: 'A UPI investing app. I think the aha is seeing your first mutual fund SIP set up, with the date of the first debit, because that’s when it feels real.',
    path: '1 Splash · 2 Phone number and OTP · 3 Email · 4 PAN number · 5 Selfie for KYC · 6 Bank account · 7 Risk questionnaire (12 questions) · 8 Fund recommendations · 9 Choose amount and date · 10 Set up UPI autopay (aha). Steps 2, 4, 5, 6, 9 and 10 are needed for a real SIP; 3 and 7 could move later or shrink.',
    risks: [
      'Step 5, selfie KYC: ability. It needs good light and a steady camera, and failed twice for me with no tip on why. Measure: KYC start to KYC complete.',
      'Step 7, 12-question risk quiz: motivation and ability. It feels like an exam before any value. Measure: drop-off within the questionnaire, question by question.',
      'Step 3, email: ability with no clear reason. It asks for email before explaining why. Measure: email screen exit rate.',
    ],
    fixes: 'Selfie: add live guidance (“move closer to a window”) and a retry tip after a failure. Quiz: cut to three questions and offer “browse funds first”. Email: move it after the first SIP, for statements. I’d test the quiz change first, since it touches everyone; success is a higher share of sign-ups reaching step 9 within a day.',
  },
};

const br1: BossBriefInput = {
  chapterId: 'br.1',
  title: 'Write a brand platform',
  minutes: 60,
  scenario: [
    'Pick a product: your own idea, a side project, or a fictional one (for example, a tiffin subscription for students, or an app that helps families split chores). Write the brand platform a design team would use to make every decision about it.',
    'A brand platform has three parts: purpose (why it exists beyond money), positioning (who it’s for, what it beats, why), and personality (how it behaves and sounds). Show how the personality would change one real screen.',
  ],
  fields: [
    { id: 'product', label: 'The product', kind: 'text', minWords: 12, hint: 'What it is, who uses it, and the main alternative people use today.' },
    { id: 'purpose', label: 'Purpose', kind: 'text', minWords: 12, hint: 'One or two sentences: why it exists, beyond making money.' },
    { id: 'positioning', label: 'Positioning statement', kind: 'long', minWords: 20, hint: 'For [audience] who [need], [brand] is the [category] that [benefit], unlike [alternative]. Then a line on why that space is open.' },
    { id: 'personality', label: 'Personality traits', kind: 'list', items: 3, minWords: 10, hint: 'One trait per item: the trait, what it isn’t, and one example of it in copy or design.' },
    { id: 'applied', label: 'One screen, before and after', kind: 'long', minWords: 25, hint: 'Pick a real screen (an empty state, an error, onboarding). Write the generic version and the on-brand version, and say what changed.' },
  ],
  rubric: [
    { id: 'positioning', label: 'Sharp positioning', strong: 'Names a specific audience, a real need, a clear benefit and a named alternative, in a space competitors don’t clearly own.', weight: 2, required: true },
    { id: 'personality', label: 'Usable personality', strong: 'Three distinct traits, each with a “not” and a concrete example a designer or writer could follow.', weight: 2, required: true },
    { id: 'applied', label: 'Applied to the product', strong: 'The before/after screen clearly shows the traits in copy and design choices, not just adjectives.', weight: 2 },
    { id: 'purpose', label: 'A believable purpose', strong: 'States why the product matters to people, beyond revenue, in plain words.', weight: 1 },
    { id: 'consistency', label: 'Hangs together', strong: 'Purpose, positioning and personality point the same way; nothing contradicts.', weight: 1 },
  ],
  tips: ['Write the “unlike” part first. If you can’t name what you beat, the positioning isn’t sharp yet.', 'Test each trait on an error message. Personality is easy on a homepage and hard when things go wrong.'],
  example: {
    product: 'Dabba, a tiffin subscription for college students living away from home. Today they rely on canteen food, instant noodles or skipping meals.',
    purpose: 'To make sure no student away from home goes without a proper, affordable meal.',
    positioning: 'For students away from home who miss real food but have no time or kitchen, Dabba is the tiffin subscription that brings home-style meals to campus for ₹99, unlike food delivery apps built for occasional treats. Delivery apps compete on variety and speed; nobody owns “everyday, affordable, homely”.',
    personality: [
      'Caring, not smothering: we check in, we don’t nag. “Exams this week? We’ll keep lunch simple and on time.”',
      'Cheerful, not childish: light jokes, no baby talk. “Your dabba is on its way. Rotis are warm, promises are kept.”',
      'Dependable, not dull: plain facts, on time, every time. “Arriving 12:40 at Hostel B gate.”',
    ],
    applied: 'Empty orders screen. Generic: “No orders yet. Start ordering now!” On-brand: “Your first dabba is one tap away. Pick a plan, we’ll handle lunch from tomorrow.” Plus a warm illustration of a steel tiffin and the price, ₹99 a day, upfront. It’s caring (we’ll handle it), dependable (tomorrow, a clear price) and gently cheerful.',
  },
};

const bz1: BossBriefInput = {
  chapterId: 'bz.1',
  title: 'Map the business model canvas',
  minutes: 60,
  scenario: [
    'Take your Studio product (or any product idea you’re working on) and fill in the business model canvas: the nine blocks that describe how it creates, delivers and captures value.',
    'Then do the unit economics on the back of an envelope, and name two design decisions the model implies. Rough numbers are fine; say where each one comes from.',
  ],
  fields: [
    { id: 'product', label: 'The product', kind: 'text', minWords: 10, hint: 'One or two lines: what it is and who it’s for.' },
    { id: 'canvas', label: 'The canvas, block by block', kind: 'list', items: 9, minWords: 5, hint: 'One item per block: customer segments, value proposition, channels, customer relationships, revenue streams, key resources, key activities, key partners, cost structure.' },
    { id: 'economics', label: 'Unit economics', kind: 'long', minWords: 25, hint: 'Price, months a customer stays, margin, LTV, and an estimated CAC. Is LTV at least 3× CAC? Show the sums.' },
    { id: 'design', label: 'Two design decisions the model implies', kind: 'list', items: 2, minWords: 15, hint: 'What the model means for the product: what to optimise, what to avoid, which metric matters.' },
  ],
  rubric: [
    { id: 'canvas', label: 'A coherent canvas', strong: 'All nine blocks filled with specifics, and they connect: the revenue stream matches the segment, the costs match the activities.', weight: 2, required: true },
    { id: 'economics', label: 'Honest unit economics', strong: 'Shows LTV = price × months × margin, an estimated CAC with a source or assumption, and a clear verdict on the ratio.', weight: 2, required: true },
    { id: 'design', label: 'Design follows the model', strong: 'Each decision ties a design choice to the model (e.g. retention features for a subscription, seller tools for a marketplace).', weight: 2 },
    { id: 'segment', label: 'A focused segment', strong: 'Names a specific first customer segment rather than “everyone”.', weight: 1 },
    { id: 'risks', label: 'Knows the weak spot', strong: 'Points out the riskiest block or assumption and how to test it.', weight: 1 },
  ],
  tips: ['Start with the customer segment and value proposition; the other blocks follow from them.', 'Use 1 ÷ monthly churn to estimate how many months a customer stays.'],
  example: {
    product: 'Dabba, a ₹99-a-day tiffin subscription for college students living away from home.',
    canvas: [
      'Customer segments: students in hostels and PGs near three Pune campuses.',
      'Value proposition: home-style lunch on campus, ₹99, no cooking, no delivery fees.',
      'Channels: campus ambassadors, Instagram, WhatsApp groups, the app.',
      'Customer relationships: self-serve app, WhatsApp support, monthly feedback polls.',
      'Revenue streams: weekly and monthly subscriptions paid by UPI autopay.',
      'Key resources: partner home cooks, delivery riders, the ordering app.',
      'Key activities: menu planning, cook quality checks, daily lunchtime delivery.',
      'Key partners: home cooks, a packaging supplier, college canteens for pickup points.',
      'Cost structure: food from cooks, riders, packaging, marketing to students.',
    ],
    economics: 'Monthly revenue ₹2,200 (22 lunches). Margin about 25% after cooks, riders and packaging, so ₹550 a month. Monthly churn about 12% (exams and holidays), so customers stay about 8 months. LTV ≈ ₹2,200 × 8 × 25% = ₹4,400. CAC from ambassador referrals is about ₹600. LTV ÷ CAC ≈ 7: healthy, if churn holds in the holidays.',
    design: [
      'Pause, don’t cancel: let students pause during exams and holidays in one tap, because churn is our biggest risk and pausing keeps them as subscribers.',
      'Make referral the main growth loop: a one-tap “bring a hostel-mate” flow, since referred students cost a fraction of Instagram ads and lower CAC.',
    ],
  },
};

const dc1: BossBriefInput = {
  chapterId: 'dc.1',
  title: 'Rebuild a screen in HTML and CSS',
  minutes: 90,
  scenario: [
    'Pick one screen you designed in Studio (or any simple screen: a sign-up form, a product card list, a settings page) and rebuild it in plain HTML and CSS. Use any free online editor, such as CodePen.',
    'Use semantic elements, flexbox or grid for layout, and CSS variables for your colours and spacing. It doesn’t need to be pixel-perfect; it needs to be structured the way a developer would build it. Share the link.',
  ],
  fields: [
    { id: 'screen', label: 'The screen and the link', kind: 'text', minWords: 10, hint: 'What the screen is, and a link to your code.' },
    { id: 'structure', label: 'Your HTML structure', kind: 'long', minWords: 25, hint: 'The landmarks and key elements you used, and why (e.g. a real <button>, labels on inputs, one <h1>).' },
    { id: 'layout', label: 'Your layout choices', kind: 'long', minWords: 25, hint: 'Where you used flexbox or grid, with the gap, padding and alignment, and how they map to your Figma auto layout.' },
    { id: 'tokens', label: 'Tokens as CSS variables', kind: 'text', minWords: 12, hint: 'The variables you defined (colours, spacing, radius) and where they’re used.' },
    { id: 'learned', label: 'What surprised you', kind: 'text', minWords: 15, hint: 'One thing that was harder than expected, and what you’d design differently now.' },
  ],
  rubric: [
    { id: 'semantics', label: 'Semantic HTML', strong: 'Uses landmarks, a single h1 with ordered headings, real buttons and links, and labelled form fields.', weight: 2, required: true },
    { id: 'layout', label: 'Modern layout', strong: 'Layout uses flexbox and/or grid with gap and padding (no absolute positioning hacks), mirroring auto layout.', weight: 2, required: true },
    { id: 'tokens', label: 'Tokens in code', strong: 'Colours, spacing and radius come from CSS variables named by role, reused across the screen.', weight: 2 },
    { id: 'states', label: 'States considered', strong: 'Includes at least hover and focus styles, and mentions empty, loading or error states where they apply.', weight: 1 },
    { id: 'reflection', label: 'Design insight', strong: 'Names a concrete design habit that would make handoff easier next time.', weight: 1 },
  ],
  tips: ['Write the HTML first with no CSS at all. If it reads sensibly unstyled, the structure is right.', 'Recreate your auto layout frames one by one as flex containers: direction, gap, padding, alignment.'],
  example: {
    screen: 'The sign-up screen for Dabba, my tiffin subscription idea. Code: codepen.io/… (Dabba sign-up).',
    structure: 'A <header> with the logo, a <main> containing one <h1> “Get lunch from tomorrow”, and a <form> with three <label>/<input> pairs (name, phone, hostel), a plan choice as radio buttons inside a <fieldset> with a <legend>, and a real <button type="submit">. A <footer> holds the terms link.',
    layout: 'The form is a flex column with gap: 16px and padding: 24px, matching my auto layout frame. The two plan cards sit in a grid with grid-template-columns: 1fr 1fr and gap: 12px, falling to one column under 400px. The header is a flex row with justify-content: space-between and align-items: center.',
    tokens: ':root defines --color-primary, --color-surface, --color-text, --space-2 to --space-6 and --radius-md. Buttons, cards and inputs all use them, so a theme change is one edit.',
    learned: 'Radio buttons styled as cards were harder than expected: I had to keep the real input for keyboard use. Next time I’ll design selected and focused states for the plan cards up front.',
  },
};

const ld2: BossBriefInput = {
  chapterId: 'ld.2',
  title: 'Write your case study',
  minutes: 90,
  scenario: [
    'Turn your Studio product (or the strongest project you have) into a portfolio case study a hiring manager could skim in under a minute and read in five.',
    'Write it in the structure from this chapter. Be specific about the problem, your part, the key decisions and what changed. If you don’t have hard numbers, use honest qualitative evidence.',
  ],
  fields: [
    { id: 'title', label: 'Title and one-line summary', kind: 'text', minWords: 15, hint: 'A title that names the problem, plus one sentence: the problem, your role, the result.' },
    { id: 'context', label: 'Context and your role', kind: 'long', minWords: 30, hint: 'The problem, who it affected, and exactly what you owned (team, timeline, constraints).' },
    { id: 'process', label: 'Process: three key decisions', kind: 'list', items: 3, minWords: 20, hint: 'For each: what you learned or tried, and the decision it led to.' },
    { id: 'outcome', label: 'Solution and outcome', kind: 'long', minWords: 30, hint: 'What you designed, the evidence it worked (numbers, test results or quotes), and one honest trade-off.' },
    { id: 'learned', label: 'What you’d do differently', kind: 'text', minWords: 15, hint: 'One specific reflection.' },
  ],
  rubric: [
    { id: 'summary', label: 'Skimmable summary', strong: 'The title and first line state the problem, the role and the result; a reviewer knows the story in seconds.', weight: 2, required: true },
    { id: 'decisions', label: 'Decisions, not steps', strong: 'Each process item links an insight or test to a specific design decision, rather than listing activities.', weight: 2, required: true },
    { id: 'role', label: 'Clear ownership', strong: 'States exactly what the author did, with whom, and under what constraints.', weight: 2 },
    { id: 'evidence', label: 'Honest evidence', strong: 'Shows results with real numbers or credible qualitative evidence, and names a trade-off.', weight: 1 },
    { id: 'reflection', label: 'Real reflection', strong: 'A specific lesson the author would apply next time, not a generic one.', weight: 1 },
  ],
  tips: ['Write the one-line summary last, once you know the story.', 'Read it aloud in 40 seconds. If the problem, your part and the result aren’t clear, restructure.'],
  example: {
    title: '“Getting students their first tiffin in two taps.” I was the solo designer on Dabba’s sign-up; first-order completion went from 31% to 58% in testing.',
    context: 'Dabba sells ₹99 home-style lunches to college students. Most people who opened the app never ordered: sign-up asked for nine fields before showing a menu. I was the only designer, working with one developer for four weeks; we couldn’t change the payment provider.',
    process: [
      'Watching five students sign up showed they quit at the address form, so I moved hostel selection to a single picker of known campus pickup points.',
      'Students didn’t trust a new food service, so I showed real tiffin photos and the cook’s name before asking for anything.',
      'A test of two plan pages showed weekly plans felt safer than monthly, so weekly became the default with monthly as a saving.',
    ],
    outcome: 'The new flow asks for phone, hostel and plan, then payment: four steps instead of nine. In moderated tests with 12 students, first-order completion rose from 31% to 58%. Trade-off: we dropped dietary preferences from sign-up; they now appear after the first order.',
    learned: 'I’d recruit test participants from the second campus earlier; their pickup points behaved differently and I only found out after launch.',
  },
};

const ia2: BossBriefInput = {
  chapterId: 'ia.2',
  title: 'Map the reset-password flow',
  minutes: 45,
  scenario: [
    'Dabba’s support inbox gets dozens of “I can’t get back into my account” messages a week. The current reset flow was designed for the happy path only: anything unexpected ends in “Something went wrong”.',
    'Map the complete reset-password flow: the happy path, the edge cases at each step with their way back, and the states each screen needs. Keep it as short as it can be without losing clarity.',
  ],
  fields: [
    { id: 'happy', label: 'The happy path, step by step', kind: 'list', items: 4, minWords: 4, hint: 'One screen or action per item, from “Forgot password?” to signed in.' },
    { id: 'edges', label: 'Edge cases and their way back', kind: 'list', items: 5, minWords: 10, hint: 'For each: the step where it happens, what goes wrong, and how the person gets back on the path.' },
    { id: 'states', label: 'States for the code screen', kind: 'long', minWords: 30, hint: 'What the code screen shows while waiting, on success, on a wrong or expired code, and if nothing arrives.' },
    { id: 'error', label: 'One error message, written out', kind: 'text', minWords: 10, hint: 'The exact words for one failure: what happened and what to do next.' },
    { id: 'trim', label: 'A step you cut, merged or deferred', kind: 'text', minWords: 15, hint: 'Which step, what you did with it, and why clarity didn’t suffer.' },
  ],
  rubric: [
    { id: 'coverage', label: 'Edge cases covered', strong: 'Covers wrong input, slow or missing messages, expiry and interruption across different steps, not just one screen.', weight: 2, required: true },
    { id: 'recovery', label: 'No dead ends', strong: 'Every edge case returns the person to the path without losing what they typed or starting over.', weight: 2, required: true },
    { id: 'states', label: 'States designed', strong: 'The code screen has distinct waiting, success, error and nothing-arrived states, each saying what to do next.', weight: 2 },
    { id: 'privacy', label: 'Safe by design', strong: 'Never reveals whether an email has an account, and asks about signing out other devices.', weight: 1 },
    { id: 'lean', label: 'Lean but clear', strong: 'Removes or combines a step with a clear reason, and keeps steps that prevent mistakes.', weight: 1 },
  ],
  tips: ['Ask of every step: what if it’s wrong, slow, missing or interrupted?', 'Draw an arrow back to the path for every branch. If you can’t, it’s a dead end.'],
  example: {
    happy: ['Tap “Forgot password?” on the sign-in screen', 'Check the email filled in from sign-in and tap Send code', 'Type the six-digit code that arrives', 'Choose a new password and land back where you were, signed in'],
    edges: [
      'Enter email: a typo like gmial.com. Suggest “Did you mean gmail.com?” before sending, then continue.',
      'Enter email: no account exists. Show the same “If an account exists, we’ve sent a code” message, with a link to sign up.',
      'Enter code: nothing arrives. After 30 seconds show “Resend code” and “Send by SMS instead”, staying on the same screen.',
      'Enter code: the code expired. Say so and offer “Send a new code”; the new code replaces the old one in place.',
      'New password: the connection drops on Save. Keep the typed password, show “You’re offline”, and retry when the connection returns.',
    ],
    states: 'Waiting: the six boxes are ready with a countdown “Resend in 0:30”. Success: a tick, then straight to the new-password screen. Wrong code: the boxes shake, stay filled, and the text says “That code doesn’t match. Check the latest message.” Expired: “This code has expired” with a Send a new code button. Nothing arrived: after 30 seconds, resend and SMS options appear.',
    error: '“That code has expired. We’ve sent a new one to your phone ending 4417.”',
    trim: 'I merged the separate “Enter your email” screen into Send code: the address from sign-in is already filled in, so most people just tap Send. They can still edit it, so nobody sends a code to the wrong place.',
  },
};

const fd3: BossBriefInput = {
  chapterId: 'fd.3',
  title: 'Run a 15-minute critique',
  minutes: 60,
  scenario: [
    'This one happens with a real person. Find a peer who has finished a boss project (any chapter) or a piece of design work they care about, and run a 15-minute critique of it with them, on a call or in person. Ask before you record it, and record it.',
    'Open by agreeing the goal of the work and what kind of feedback they want. Give your feedback with I like / I wish / What if, catch at least one comment of your own that was only taste, and watch how they receive it. Hand in your notes and what you learned.',
  ],
  fields: [
    { id: 'work', label: 'What you critiqued, and its goal', kind: 'text', minWords: 15, hint: 'Whose work (no full names), what it is, and the goal or brief it was meant to meet.' },
    { id: 'setup', label: 'How you ran the 15 minutes', kind: 'long', minWords: 30, hint: 'How you opened, what feedback the designer asked for, how you split the time, and how you recorded it with their consent.' },
    { id: 'likes', label: 'I like', kind: 'list', items: 2, minWords: 10, hint: 'Specific things that work, and why, so they survive the next version.' },
    { id: 'wishes', label: 'I wish', kind: 'list', items: 3, minWords: 12, hint: 'Problems a user would hit: what you saw, what it does to them, and the goal it hurts. Mark the most important one.' },
    { id: 'whatifs', label: 'What if', kind: 'list', items: 2, minWords: 8, hint: 'Ideas, offered as questions. The designer decides.' },
    { id: 'taste', label: 'A taste comment you caught', kind: 'text', minWords: 20, hint: 'Something you nearly said (or did say) that was only preference, and what it became when you asked yourself why.' },
    { id: 'receiving', label: 'How it was received, and what you’d change', kind: 'long', minWords: 40, hint: 'Where the designer asked questions or defended, what you did then, and one thing you’d run differently next time.' },
  ],
  rubric: [
    { id: 'reasoned', label: 'Reasoned, not taste', strong: 'Every wish names what was seen, its effect on a user, and the goal it hurts. No unlabelled preferences.', weight: 2, required: true },
    { id: 'frame', label: 'The frame used well', strong: 'Likes are specific enough to keep; wishes describe problems without dictating fixes and the main one is marked; what-ifs are offered as options, not orders.', weight: 2, required: true },
    { id: 'taste', label: 'Taste caught and converted', strong: 'Names a real taste comment and shows how asking “why” turned it into reasoning, or honestly labels it as preference.', weight: 1 },
    { id: 'session', label: 'A session with shape', strong: 'Agrees the goal and the kind of feedback up front, keeps to the 15 minutes, leaves time for the designer’s questions, and is recorded with consent.', weight: 1 },
    { id: 'receiving', label: 'Honest reflection on receiving', strong: 'Describes a specific moment where the designer asked or defended, how the critic responded, and one concrete change for next time.', weight: 2 },
  ],
  tips: ['Ask the designer first: “What do you want feedback on today?” An early sketch and a final screen need different feedback.', 'Before each wish, check: what did I see, what does it do to the user, which goal does it hurt?'],
  example: {
    work: 'A classmate’s boss for ia.2, “Map the reset-password flow” for Dabba, the lunch app. The goal: a reset flow with no dead ends, every edge case returning people to the path.',
    setup: 'I opened by reading the brief aloud and asking what she wanted from me. She said “Are my edge cases complete?”, so I left visual polish out. Two minutes on context, eight on my feedback, five for her questions. We recorded the video call after she agreed, and I kept notes in a shared doc.',
    likes: ['I like that a wrong code keeps the six boxes filled, so people can fix one digit instead of retyping all of them.', 'I like the “If an account exists, we’ve sent a code” message, because it never reveals who has an account.'],
    wishes: [
      'Main one: I wish the code screen said where the code went. If someone has two numbers, they will wait on the wrong phone and think the app is broken.',
      'I wish the expired-code state had a button on the same screen. Right now it links back to step one, which throws away the email they typed.',
      'I wish the “connection lost” case on the password screen kept the new password. Losing it means typing a long password twice on a shaky connection.',
    ],
    whatifs: ['What if the code screen showed “Sent to ••••4417” under the boxes?', 'What if “Send by SMS instead” appeared after 30 seconds of waiting?'],
    taste: 'I nearly said “the success screen feels flat”. Asking myself why, the real point was that it doesn’t say where people will land next, so it reads like a dead end. I said that instead.',
    receiving: 'When I raised the expired code, she started with “But the brief said four steps.” I asked what she thought a person would do when the link sent them back, and she said they would probably give up. After that she asked questions instead of explaining. Next time I would say up front that wishes are about users, not her, and I would leave more than five minutes for her questions because we ran over.',
  },
};

const rs3: BossBriefInput = {
  chapterId: 'rs.3',
  title: 'Synthesise 12 lunch interviews',
  minutes: 90,
  scenario: [
    'Dabba, the office-lunch app, ran 12 interviews with people who work in Bengaluru offices, about how weekday lunch really happens. Below is one summary per interview, with quotes and what the researcher saw. Synthesise them: build affinity groups, write four insights, and map one journey that tells Dabba what to work on first.',
    'P1, 29, product analyst, Whitefield. “By the time my 12:30 call ends, everything good says 45 minutes.” Ordered at 1:20 on both days we looked at, and ate at her desk during a 2 pm call. “I want dal-chawal, not a burger, but dal-chawal is always the long wait.”',
    'P2, 34, accounts manager, Koramangala. Keeps a ₹180 daily limit in a notes app and checks it before ordering. Showed an order where a ₹149 thali became ₹212 at checkout after delivery, platform and packing fees. “I only see the real price at the last step, so I go back and remove the raita.”',
    'P3, 26, developer, Electronic City. Orders with three teammates to split the delivery fee. The order starts in a Slack thread at 12:50 and is placed around 1:15, once everyone has chosen. He pays the whole bill and collects on UPI. “Two of them pay the same day. One I chase till Thursday.”',
    'P4, 31, HR executive, Manyata Tech Park. In a five-person lunch group: fees split five ways make delivery “almost free”. Keeps a spreadsheet of who owes whom; ₹640 was outstanding the day we spoke. Limit about ₹200 a day. “If I’m alone I just eat at the canteen. Delivery isn’t worth it for one.”',
    'P5, 38, team lead, Indiranagar. Brings a dabba cooked by his mother Monday to Wednesday and orders on Thursday and Friday. “Outside food, I feel it by 4 pm.” Looks for words like “home-style” and “less oil” on menus, and says they mean nothing.',
    'P6, 27, sales associate, MG Road. Out on client visits most days. Orders to the office only on desk days, often at 1:30 after calls. Twice the food arrived while he was in a meeting and went cold at reception.',
    'P7, 30, designer, HSR Layout. Orders with two colleagues and always ends up as the one who pays and collects. Stopped group orders for two weeks “because I got tired of being the bank”. “Below ₹200 including everything, or I’m not ordering.”',
    'P8, 33, consultant, Bellandur. Says health is her top priority and logs protein in an app. Orders salad bowls Monday to Thursday. Friday is biryani with her team: “That’s the treat day, it doesn’t count.” Annoyed that a bowl costs ₹320 and a biryani ₹220.',
    'P9, 25, support executive, Marathahalli. His lunch break is 30 minutes, fixed at 1:00, so he orders at 12:15 to be safe. Showed a delivery that came at 1:34, after his break had ended; he skipped lunch that day. “Now I just order whatever says 20 minutes.”',
    'P10, 41, finance controller, Jayanagar. Limit ₹150: “Lunch is fuel, not an outing.” Uses a local tiffin service at ₹2,800 a month for a fixed home-style meal. Left it last year because the menu repeated, and came back after three weeks of app orders “came to more than double”.',
    'P11, 28, marketing executive, Koramangala. Lunch is decided in a WhatsApp group called “Lunch gang”: first message at 12:40, a poll, and the order goes in at 1:10. “The poll takes longer than the delivery.” Often eats at 2:15, between meetings.',
    'P12, 36, engineering manager, Whitefield. Wants “light, homely food” because heavy lunches make his 3 pm reviews hard. Spends about ₹200. Uses filters, but says ratings tell him nothing about oil or portion size. Eats roti-sabzi from the same cloud kitchen most days: “Boring, but I know what I’m getting.”',
  ],
  fields: [
    { id: 'groups', label: 'Your affinity groups', kind: 'long', minWords: 40, hint: 'Name each group as a sentence a participant could say, and list who is in it (e.g. P3, P7). Include notes that fit nowhere.' },
    { id: 'insights', label: 'Four insights', kind: 'list', items: 4, minWords: 25, hint: 'Each one: who, what they do, because why. Then the participants behind it and one “How might we…?”.' },
    { id: 'journey', label: 'The journey map', kind: 'long', minWords: 60, hint: 'One kind of person doing one job. 4–6 stages in order; for each, what they do, how they feel (−2 to +2) and the evidence (participant codes). Mark the low point.' },
    { id: 'decision', label: 'What Dabba should do first', kind: 'text', minWords: 25, hint: 'The one thing the map says to work on first, and one thing it says not to start yet.' },
    { id: 'doubts', label: 'Contradictions and thin evidence', kind: 'text', minWords: 20, hint: 'Who doesn’t fit, where people say one thing and do another, and which conclusions rest on few people.' },
  ],
  rubric: [
    { id: 'evidence', label: 'Grounded in the interviews', strong: 'Every insight and every journey stage names the participants behind it; each insight rests on at least three people; nothing is claimed that the summaries don’t support.', weight: 2, required: true },
    { id: 'insight', label: 'Insights, not observations or features', strong: 'Each insight names a specific group, what they do and why, with a tension a design could work on. None is a restated fact or a feature (“users want…”).', weight: 2, required: true },
    { id: 'groups', label: 'Groups built from the data', strong: 'Groups are labelled as sentences in the participants’ voice, show how many people each holds, and keep the outliers visible instead of forcing them in.', weight: 1 },
    { id: 'journey', label: 'A journey that drives a decision', strong: 'One kind of person and one job; stages in order; feelings that follow from the evidence; a clear low point; and a first move that follows from it.', weight: 2 },
    { id: 'honesty', label: 'Honest about limits', strong: 'Names at least one contradiction (e.g. P8’s health goal and Friday biryani) and one outlier (e.g. P9’s fixed break or P10’s tiffin service), and says which conclusions rest on few people.', weight: 1 },
  ],
  tips: ['Write one note per quote or observation, tagged with the participant, before you group anything.', 'For every insight, ask: who exactly, what do they do, and because what? Then point at the participants.'],
  example: {
    groups: '“My calendar decides when I eat” (P1, P3, P6, P9, P11). “The real price shows up at the last step” (P2, P4, P7, P10, P12). “I want food that won’t knock me out at 4 pm” (P1, P5, P8, P10, P12). “Someone has to be the bank” (P3, P4, P7, P11). Fit nowhere yet: P10’s monthly tiffin service; P8’s Friday “treat day”.',
    insights: [
      'People in meeting-heavy jobs decide lunch late because their calendar, not hunger, sets lunchtime, so they choose by delivery time and give up the food they wanted. (P1, P3, P6, P9, P11.) How might we help people settle lunch before the 12:30 call starts?',
      'People with a daily lunch limit trim or abandon orders at the last step, because fees appear only at checkout and turn a ₹149 thali into ₹212. (P2, P4, P7, P10, P12.) How might we show the full price at the moment people choose?',
      'People who want light, home-style food settle for the same safe dish, because menus say nothing reliable about oil or portion and ratings measure taste, not how they’ll feel at 4 pm. (P1, P5, P8, P10, P12.) How might we let people judge how heavy a meal is before ordering?',
      'In group orders one colleague pays for everyone and chases repayments for days, because the app takes a single payment, so the person who saves the group its fee pays for it in effort. (P3, P4, P7, P11; P7 stopped for two weeks.) How might we let everyone in a group order pay their own share?',
    ],
    journey: 'A desk worker in a meeting-heavy job ordering a weekday lunch. 1 Decide: −2. Lunch waits for calls and polls (P1 after a 12:30 call, P3’s Slack thread from 12:50, P11’s poll from 12:40). The low point. 2 Choose and order: −1. Fees appear at the last step (P2, P7); menus don’t say what’s light (P5, P12). 3 Wait: −1. Delivery lands after the break or during a meeting (P9, P6). 4 Eat: −1. At the desk, during a call, sometimes cold (P1, P6, P11). 5 Settle up (group orders only): −1 for whoever paid (P3, P4, P7). Every later stage gets worse because the first one starts late.',
    decision: 'Work first on the decision moment: help people choose lunch for a fixed slot before their late-morning meetings begin, alone or as a group. Don’t start a menu or checkout redesign yet; showing the full price earlier is a small fix that can ship alongside.',
    doubts: 'P8 says health comes first but has a weekly biryani “treat day”, so intention and habit differ. P9 orders early, not late: his problem is delivery times he can trust, not deciding. P10 left apps for a ₹2,800 tiffin plan, a rival for the same job worth a closer look. Settling up rests on four people, all in group orders.',
  },
};

/** Boss briefs keyed by chapter id. */
export const BOSSES: Record<string, BossBrief> = Object.fromEntries(
  [fd1, fd2, rs1, ia1, ui1, cw1, st1, rs2, ui2, ui3, ds1, pr1, ax1, gr1, br1, bz1, dc1, ld2, ia2, fd3, rs3].map(b => { const brief = BossBrief.parse(b); return [brief.chapterId, brief]; }),
);

export const getBoss = (chapterId: string): BossBrief | undefined => BOSSES[chapterId];
