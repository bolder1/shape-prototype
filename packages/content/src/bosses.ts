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

const rs4: BossBriefInput = {
  chapterId: 'rs.4',
  title: 'Run usability round 1',
  minutes: 120,
  scenario: [
    'This one happens in the real world. Take a clickable prototype, your own from the prototyping chapter or any flow you can build in Figma in an hour, and test it with five people who could really use it. Friends and family count if they fit; colleagues who built it don’t.',
    'Write three tasks, pilot them on one person, then run the five sessions: moderated, in person or on a video call, 20–30 minutes each, with their consent to take notes. Ask people to think aloud, and don’t help unless they’re fully stuck.',
    'Hand in your tasks and a findings report ranked by severity: what broke, for how many of the five, how badly, and what you’d fix first.',
  ],
  fields: [
    { id: 'setup', label: 'What you tested, with whom, and how', kind: 'long', minWords: 30, hint: 'The prototype and the question it should answer. A line on each of the five people (no full names), how you found them, and whether you met in person or on a call.' },
    { id: 'tasks', label: 'Your three tasks', kind: 'list', items: 3, minWords: 12, hint: 'Exactly as you read them out: a reason, a goal and an end you can see. Note anything you changed after the pilot.' },
    { id: 'findings', label: 'Findings, most severe first', kind: 'list', items: 5, minWords: 25, hint: 'Each one: severity (critical, major, minor or cosmetic), where it happens, what people did, how many of the five, a quote or observation, and a direction for the fix.' },
    { id: 'plan', label: 'What to fix first, and what to test next', kind: 'text', minWords: 25, hint: 'Which findings go first and why, what can wait, and how you’ll check the fixes worked.' },
  ],
  rubric: [
    { id: 'tasks', label: 'Tasks that test the design', strong: 'Every task gives a realistic reason and one goal with a visible end, and uses none of the interface’s labels or steps. Pilot changes are noted.', weight: 2, required: true },
    { id: 'evidence', label: 'Findings built on evidence', strong: 'Each finding says where, what people actually did, how many of the five, with a quote or observed behaviour. Opinions (“I like the colours”) are kept apart from behaviour.', weight: 2, required: true },
    { id: 'severity', label: 'A consistent severity ranking', strong: 'Severity combines how many hit it and how badly (noticed, slowed, blocked or lost money); blocked tasks and money come first even when few hit them; effort to fix is not mixed into the rating.', weight: 2 },
    { id: 'method', label: 'Sound sessions', strong: 'Five people who match the intended users, a method that fits the question (moderated for a rough prototype), and facilitation that hands questions back instead of helping.', weight: 1 },
    { id: 'plan', label: 'A plan that follows the ranking', strong: 'Fixes start with the most severe findings, cosmetic issues are parked, and there’s a specific way to check the fixes (e.g. the same task with three new people).', weight: 1 },
  ],
  tips: ['Read every task aloud to someone before session one. If they ask a question, rewrite the task so it answers it.', 'Write down what people did and said during the session; rate severity afterwards, alone, then compare with someone else if you can.'],
  example: {
    setup: 'A Figma prototype of “Change delivery address” for a grocery app, built to answer: can first-time users change the address after ordering, without help? Five people who order groceries online at least twice a month: A, 27, software tester; B, 45, homemaker; C, 31, nurse on shifts; D, 62, retired bank officer; E, 22, college student. Found through two housing-society WhatsApp groups. Three in person at their homes, two on Google Meet, 25 minutes each.',
    tasks: [
      'You’ve just ordered groceries, then remember you’re at your sister’s place tonight. Get the order sent there instead. (After the pilot I added “tonight”, because my pilot asked whether it was for a future order.)',
      'Your order is on its way and the delivery partner will need the gate code, 4417. Make sure they get it.',
      'You ordered yesterday and want to know whether you were charged for the address change. Find out.',
    ],
    findings: [
      'Critical. Order details: 4 of 5 looked for the address under the order, not in Account → Addresses, and 3 gave up. D: “I’d just call customer care.” Direction: put “Change address” on the order screen while the order can still be changed.',
      'Critical. Confirm screen: 2 of 5 tapped “Save” and believed the order was redirected, but Save only adds the address to the address book. Both were surprised when the summary showed the old address. Direction: one action, “Deliver here instead”, that changes this order.',
      'Major. Delivery note: 3 of 5 couldn’t find where to add the gate code and typed it into the address line. C: “Will the rider even see this?” Direction: a visible “Note for the delivery partner” field on the tracking screen.',
      'Minor. Address form: 2 of 5 hesitated at “Landmark (optional)” and asked whether it was needed; both went on. Direction: an example, “e.g. opposite Kamat Hotel”.',
      'Cosmetic. Order history: 1 of 5 (E) said the fee line “looks like an error” because it is in red. Didn’t affect the task. Direction: grey text with a label.',
    ],
    plan: 'Fix the two critical findings first: one “Deliver here instead” action on the order screen. Then the delivery note field. Park the landmark example and the fee colour for the next polish pass. Retest the same three tasks with three new people (unmoderated is fine now that the flow should hold up) and count how many finish task 1 without help.',
  },
};

const ia3: BossBriefInput = {
  chapterId: 'ia.3',
  title: 'Wireframe a booking flow',
  minutes: 90,
  scenario: [
    'Saaf sends trained cleaners to flats in Pune. Today people book over WhatsApp, and every booking takes six messages. The brief for the app: a customer picks a service (kitchen, bathrooms or the full home), says the flat size (1, 2 or 3 BHK), which sets the price, picks a date and a two-hour arrival window, gives the address with society name, flat number and any gate instructions, and pays by UPI now or in cash after the clean. They should see the total before paying and get a confirmation with the cleaner’s name.',
    'Wireframe the five screens of this booking flow on a phone. Draw them on paper or in Figma at low fidelity, then describe them here so a reviewer who can’t see your drawing could rebuild them: the grid, what’s on each screen top to bottom, the pattern each part uses, the real content, and the notes your drawing needs.',
  ],
  fields: [
    { id: 'grid', label: 'Your grid and fidelity', kind: 'long', minWords: 25, hint: 'Columns, margins and gutters, and that every screen uses them. What you kept plain (images, colour, type) and what you made real (prices, labels, names).' },
    { id: 'screens', label: 'The five screens, in order', kind: 'list', items: 5, minWords: 25, hint: 'For each: its name and one job, the blocks from top to bottom with the pattern each one uses and its real content, and the one primary action.' },
    { id: 'notes', label: 'Notes on the wireframes', kind: 'list', items: 3, minWords: 10, hint: 'A state, rule or behaviour the drawing can’t show, and which screen it belongs to. For example, what a full time window looks like.' },
    { id: 'choice', label: 'One pattern choice you made', kind: 'text', minWords: 20, hint: 'The job, the pattern you used, the one you considered and rejected, and why.' },
  ],
  rubric: [
    { id: 'flow', label: 'The brief, end to end', strong: 'Five screens cover the brief in a sensible order: service and flat size with the price, date and window, address with gate instructions, a review with the total before paying, payment choice, and a confirmation with the cleaner’s name. Each screen has one job and one primary action.', weight: 2, required: true },
    { id: 'fidelity', label: 'Plain looks, real content', strong: 'Images and branding are grey boxes and there is no colour or styling, but every label, price and example is real (“2 BHK · ₹2,400”, “10 am – 12 pm”), not lorem ipsum or ₹XXX.', weight: 2, required: true },
    { id: 'patterns', label: 'Patterns that fit the jobs', strong: 'Each part uses a familiar pattern chosen for its job: chips or a segmented control for a few visible choices, a form with labels for the address, a sheet or a review step for side tasks, and the choice section names a rejected alternative with a clear reason.', weight: 2 },
    { id: 'grid', label: 'One grid throughout', strong: 'A stated phone grid (e.g. 4 columns, 16 px margins), used on every screen, with blocks described by the columns they span and the primary action in the same place each time.', weight: 1 },
    { id: 'notes', label: 'Notes for what isn’t drawn', strong: 'Notes cover states and rules the drawing can’t show, such as a full window, a price change when the flat size changes, or what happens if UPI fails, each tied to its screen.', weight: 1 },
  ],
  tips: ['Write the real content before drawing a box. The longest society name and the price for each flat size will change your layout.', 'Draw each pattern once, then copy it. If two screens show the same thing differently, one of them is wrong.'],
  example: {
    grid: 'A 360 px phone, 4 columns, 16 px margins and 16 px gutters, on all five screens. Every block spans all 4 columns except the date chips (each one column wide, in a row that scrolls sideways). The primary action is always a full-width sticky bar at the bottom. One system font in two sizes, black on white, with grey boxes for the logo and the photos; every price, label and time is the real one from the brief.',
    screens: [
      '1 · Choose a clean. Job: pick what to clean and see the price. Top bar with a grey logo box and “Pune, Kothrud”. Three cards, one per service, each with a grey photo box, the name, what’s included (“Kitchen: hob, chimney, tiles, sink”) and “from ₹1,200”. Under the chosen card, segmented chips “1 BHK · 2 BHK · 3 BHK”; the price updates to “2 BHK · ₹2,400”. Sticky bar: “Choose a time · ₹2,400”.',
      '2 · Pick a time. Job: choose a date and an arrival window. A row of seven date chips (“Today 12”, “Sat 13”…). Below, a 2 × 3 grid of window chips (“8 – 10 am”, “10 am – 12 pm”…), full ones greyed out with “Full”. A line, “The clean takes about 4 hours for a 2 BHK.” Sticky bar: “Add address”, disabled until a window is picked.',
      '3 · Where. Job: tell the cleaner how to reach the flat. A form with labels above each field: Society or building (“Mayur Colony, Kothrud”), Flat and wing (“B-702”), and Gate instructions, optional (“Tell security it’s for Mehta”). A saved-address card above the form for returning customers. Sticky bar: “Review booking”.',
      '4 · Review and pay. Job: check everything before money moves. A summary card: service, flat size, date, window and address, each with “Change”. Price lines: “Full home, 2 BHK ₹2,400”, “Visit fee ₹0”, “Total ₹2,400”. Two payment chips: “UPI now” and “Cash after the clean”. A “Have a code?” link opens a bottom sheet with one field and Apply. Sticky bar: “Pay ₹2,400 by UPI” (or “Confirm booking” for cash).',
      '5 · Booked. Job: reassure and say what happens next. A tick in a grey circle, “Booked for Sat 13, 10 am – 12 pm”. A card with a grey avatar box: “Sunita will clean your flat. She’ll call 15 minutes before she arrives.” The address and total again. Two text buttons: “Add to calendar” and “Need to change it?”. Sticky bar: “Done”.',
    ],
    notes: [
      'Pick a time: a window with no cleaner free shows greyed with “Full” and can’t be tapped; if the whole day is full, the date chip itself greys out.',
      'Choose a clean: changing the flat size updates the price on the card and in the sticky bar at once, with no extra tap.',
      'Review and pay: if the UPI payment fails or is cancelled, the person comes back to this screen with everything kept and the message “Payment didn’t go through. You haven’t been charged.”',
    ],
    choice: 'For the arrival window I first drew a dropdown, “Select a time slot”. I rejected it because it hides which windows are full until you open it, and people pick by what’s free. Six chips in a 2 × 3 grid show every window and its state at a glance, and are easy to tap with a thumb.',
  },
};

const ia4: BossBriefInput = {
  chapterId: 'ia.4',
  title: 'Redesign a 12-field sign-up form',
  minutes: 75,
  scenario: [
    'Pedal rents bicycles by the hour from 60 stands across Bengaluru: scan the QR on a stand, ride, park at any other stand, pay by UPI. Its sign-up form loses more than half the people who start it, mostly on phones at the stand, with the bike right there.',
    'Today the form is one long page with these 12 fields, all required: 1 Title (Mr / Mrs / Ms dropdown), 2 First name, 3 Last name, 4 Email, 5 Confirm email, 6 Mobile number (opens the letter keyboard, no +91 shown), 7 Password (rules appear only after an error), 8 Confirm password, 9 Date of birth (three dropdowns: day, month, year), 10 Gender, 11 Home address, 12 How did you hear about us? Errors appear in a red box at the top after Submit, and the password fields are cleared. Pedal needs the mobile number to send ride receipts and reach riders, proof that the rider is 18 or over before the first ride, and a way to pay.',
    'Redesign it. Decide what happens to every one of the 12 fields, describe the new form screen by screen, and explain how its feedback and errors work on a phone.',
  ],
  fields: [
    { id: 'decisions', label: 'Every field, and what you did with it', kind: 'long', minWords: 120, hint: 'Go through all 12 in order. For each: keep, change, merge, ask later, or cut, and the reason in one line. A change without a reason doesn’t count.' },
    { id: 'form', label: 'The new form, screen by screen', kind: 'list', items: 2, minWords: 30, hint: 'For each screen: every field top to bottom with its label, keyboard and any hint text, and the one main button and what it says.' },
    { id: 'feedback', label: 'Feedback and errors', kind: 'long', minWords: 50, hint: 'When each field is checked, where errors appear and what one says, what the button does while it works, and what is kept when something fails.' },
    { id: 'phone', label: 'Built for a phone at the stand', kind: 'text', minWords: 25, hint: 'One-handed use, thumb reach, target sizes, autofill, and anything that saves typing.' },
    { id: 'measure', label: 'How you’d know it worked', kind: 'text', minWords: 15, hint: 'The number you’d watch, and what you’d compare it with.' },
  ],
  rubric: [
    { id: 'decisions', label: 'Every field decided, with a reason', strong: 'All 12 fields are covered. Duplicates (confirm email, confirm password) and fields Pedal can’t justify (title, gender, how did you hear) are cut; the age check moves to before the first ride or becomes one simple check; address is cut or deferred; each decision has a reason tied to what Pedal actually needs.', weight: 3, required: true },
    { id: 'form', label: 'A short, clear form', strong: 'The new form asks only for what the first ride needs, in a sensible order, in one column, with labels above the boxes (not placeholders), one full-name field, and a specific main button such as “Send code” or “Start riding”.', weight: 2, required: true },
    { id: 'feedback', label: 'Feedback that helps', strong: 'Rules are shown before typing, fields are checked when the rider leaves them, errors sit beside the field in plain words that say how to fix it, the button shows a pressed or busy state and ignores repeat taps, and nothing typed is ever cleared.', weight: 2 },
    { id: 'phone', label: 'Designed for touch', strong: 'Number pad for the mobile number with +91 shown, OTP autofill instead of a password where it fits, the main button in thumb reach and at least 44–48 px tall, and nothing that depends on hover.', weight: 1 },
    { id: 'measure', label: 'A way to tell', strong: 'Names a measure like the share of people who start sign-up and finish their first ride, or time to complete, and compares it with the old form or tests both.', weight: 1 },
  ],
  tips: ['Before you change anything, write next to each field who uses the answer and when. If nobody can say, cut it.', 'Fill your new form on your own phone with one hand, standing up. Every place you hesitate is a fix.'],
  example: {
    decisions: '1 Title: cut. Pedal never addresses riders by title, and it makes people state their marital status. 2–3 First and last name: merged into one “Full name” field, because many names don’t split into first and last, and receipts need only one line. 4 Email: made optional and asked after the first ride (“Get receipts by email?”); the mobile number is enough to create an account. 5 Confirm email: cut. It doubles the typing, and an optional email can be checked with a link. 6 Mobile number: kept and fixed. It is the account, so it gets the number pad, +91 shown in front, and an OTP to verify it. 7 Password: cut. The OTP signs people in, so there is nothing to forget at a stand. 8 Confirm password: cut with the password. 9 Date of birth: replaced by an “I’m 18 or older” check now and an ID check before the first ride, because Pedal needs proof of age, not the birthday itself. 10 Gender: cut. Nothing about renting a bike depends on it. 11 Home address: cut. Bikes are picked up and dropped at stands; nothing is delivered. 12 How did you hear about us: cut from sign-up, asked as one optional question on the first ride receipt.',
    form: [
      'Screen 1 · Your number. Heading “Start riding in a minute”. Field: label “Mobile number”, +91 shown in front, number pad, hint “We’ll text you a 6-digit code.” Field: label “Full name”, hint “As on your ID.” A checkbox, unticked: “I’m 18 or older”. Main button, full width at the bottom: “Send code”.',
      'Screen 2 · The code. Heading “Enter the code sent to +91 98450 12345” with “Change” next to the number. Six boxes that fill from the SMS by autofill, with the number pad. “Resend code in 0:25” below, which turns into a link. The code submits by itself when the sixth digit arrives; a “Verify and continue” button is there for anyone who types it. Then straight to the bike they scanned, with UPI set up at the first payment.',
    ],
    feedback: 'Each field is checked when the rider leaves it, never mid-typing. A short number shows “Enter all 10 digits” in red beside the field, with the digits kept. The name field accepts any letters, spaces and dots. If “I’m 18 or older” is left unticked, “You need to be 18 to ride” appears under it when they press Send code. Send code turns pressed, shows “Sending…” with a small spinner and ignores more taps; after 10 seconds it says “Still sending. Check your signal.” A wrong code shakes the boxes, says “That code didn’t match. Try again or resend,” and keeps the number. Nothing the rider typed is ever cleared.',
    phone: 'Everything sits in one column with the main button pinned at the bottom in thumb reach, 52 px tall. The number pad opens for the mobile number and the code, the OTP fills itself from the SMS, and the name field allows autofill from the phone. No dropdowns, no hover, and every tap target is at least 48 px.',
    measure: 'The share of people who open sign-up and start their first ride within 10 minutes, compared over two weeks between the old and new forms, plus the median time from opening the form to unlocking a bike.',
  },
};

const ui4: BossBriefInput = {
  chapterId: 'ui.4',
  title: 'Take your wireframes to high fidelity',
  minutes: 120,
  scenario: [
    'Saaf sends trained cleaners to flats in Pune, and its five-screen booking flow is wireframed: 1 Choose a clean (service cards and flat size, with the price), 2 Pick a time (date chips and two-hour arrival windows), 3 Where (society, flat and gate instructions), 4 Review and pay (a summary, the price lines, UPI now or cash after), 5 Booked (the cleaner’s name and what happens next). Use your own wireframes from the Wireframing boss if you have them, or this outline. Saaf also needs a “My bookings” screen listing a customer’s past and upcoming cleans with date, service, cleaner, amount and status.',
    'Take it to high fidelity in Figma or any tool. Build the components first, then the screens from them. Describe your work here so a reviewer who can’t see your file could check it: the foundations, every component with its states, two finished screens, the icons and images, and how My bookings shows its data.',
  ],
  fields: [
    { id: 'foundations', label: 'Your foundations', kind: 'long', minWords: 30, hint: 'The type scale, colour roles (with at least two contrast ratios), spacing scale and corner radius the screens use.' },
    { id: 'components', label: 'Components and their states', kind: 'list', items: 3, minWords: 25, hint: 'One item each for the button, the input and the card: the variants (e.g. primary, secondary, text, destructive), sizes, and how focus, disabled, loading and error look.' },
    { id: 'screens', label: 'Two screens in high fidelity', kind: 'list', items: 2, minWords: 40, hint: 'Choose a clean and Review and pay. Top to bottom: each part, the component it uses, its real content and its size or colour role, and the one primary action.' },
    { id: 'imagery', label: 'Icons and images', kind: 'long', minWords: 30, hint: 'Which icon family and size, where icons have labels, and for each image: photo, illustration or none, and why. Include alt text for one image.' },
    { id: 'data', label: 'My bookings', kind: 'text', minWords: 25, hint: 'Columns, alignment, number and date formats, sorting, how status shows without colour alone, and what the phone shows instead of a table.' },
  ],
  rubric: [
    { id: 'components', label: 'Components with every state', strong: 'Button, input and card are each defined once, with a clear rank of button variants (one primary per screen, destructive set apart), labels above inputs with helper and error text, cards with one job, and focus, disabled, loading and error states described for each.', weight: 3, required: true },
    { id: 'screens', label: 'Screens built from the components', strong: 'Both screens are described top to bottom with real content (“2 BHK · ₹2,400”), use only the defined components and foundations, keep the wireframe’s structure and grid, and have one primary action each.', weight: 2, required: true },
    { id: 'foundations', label: 'Foundations that hold together', strong: 'A named type scale, colour roles with contrast ratios that pass AA (4.5:1 for body text), a 4- or 8-pt spacing scale and one radius, applied consistently.', weight: 1 },
    { id: 'imagery', label: 'Icons and images with a job', strong: 'One icon family on one grid with labels where meaning isn’t universal, ₹ and local metaphors, 44–48 px tap areas; photos only for real things (the cleaner, not stock), illustrations for ideas and empty states, and meaningful alt text.', weight: 1 },
    { id: 'data', label: 'Data that reads at a glance', strong: 'Amounts right-aligned in tabular figures with ₹ and Indian grouping, dates in one short format, upcoming bookings sorted first, status in words as well as colour, no heavy grid lines, and rows turned into cards on a phone.', weight: 1 },
  ],
  tips: ['Build the button, input and card with all their states before you touch a screen. Every screen after that is assembly.', 'Check your finished screens in greyscale and at arm’s length. The primary action should still be the first thing you see.'],
  example: {
    foundations: 'Type: Inter, a 1.25 scale from a 16 px base: 32 / 25 / 20 / 16 / 13, body at 16/24. Colour roles: text #101828 (17.7:1 on white), muted text #475467 (7.7:1), brand teal #0E7C66 for primary buttons with white text (5.1:1), error #B42318 (6.6:1), surface white, raised surface #F9FAFB, borders #D0D5DD. Spacing on an 8-pt scale: 4, 8, 12, 16, 24, 32. One radius, 12 px for cards and inputs, 10 px for buttons. The 4-column grid with 16 px margins from the wireframes stays.',
    components: [
      'Button: four variants. Primary, filled teal with white text, one per screen, full width at the bottom, 52 px tall. Secondary, white with a teal border. Text, teal text with no box, for “Change”. Destructive, red text, kept apart from the primary. States: pressed darkens by one step; focus adds a 2 px #1570EF ring 2 px outside; disabled is #F2F4F7 with #98A2B3 text and a reason line above; loading shows a spinner and “Paying…”, keeps its width and ignores taps.',
      'Input: label above in 14 px medium, a 48 px box with a #D0D5DD border, helper text below in muted 13 px. Focus: 2 px teal border. Disabled: #F9FAFB fill with muted text still readable. Error: red border, an alert icon and a message under the box such as “Enter your flat number, like B-702”, with what was typed kept. The flat field opens the default keyboard; the phone field opens the number pad with +91 shown.',
      'Card: white, 12 px radius, 1 px border, 16 px padding, one job. The service card has a title (20 px semibold), one line of what’s included (muted), “from ₹1,200” on the right, and the whole card is tappable with a selected state: a 2 px teal border and a filled check. Focus is a ring round the whole card. Loading is a skeleton of the title and price lines; error says “Couldn’t load prices · Retry” inside the card.',
    ],
    screens: [
      'Choose a clean. Top bar: the Saaf logo on the left, “Kothrud, Pune” with a map-pin icon and label on the right. Heading “What should we clean?” at 25 px. Three service cards stacked with 12 px between them: Kitchen (“Hob, chimney, tiles, sink · from ₹1,200”), Bathrooms (“from ₹900”), Full home (“from ₹2,400”), each with a small square illustration in one style. Under the selected card, segmented chips “1 BHK · 2 BHK · 3 BHK”, 44 px tall. A sticky white bar with a top border holds the primary button “Choose a time · ₹2,400”.',
      'Review and pay. Heading “Check your booking”. A summary card with four rows, each a muted label on the left, the value on the right and a text button “Change”: Service “Full home, 2 BHK”, When “Sat 13 Dec, 10 am – 12 pm”, Where “B-702, Mayur Colony, Kothrud”, Gate “Tell security it’s for Mehta”. A price card with right-aligned tabular amounts: “Full home, 2 BHK ₹2,400”, “Visit fee ₹0”, a rule, and “Total ₹2,400” in bold. Two radio cards: “UPI now” and “Cash after the clean”. A text button “Have a code?” opens a bottom sheet. Primary button: “Pay ₹2,400 by UPI”.',
    ],
    imagery: 'Icons: Phosphor regular, 24 px on a 24 px grid with a 1.5 px stroke, outline everywhere and filled only for the selected tab; every icon has a word beside or under it except search and close, and every icon button has a 48 px tap area. ₹ is used for money, a chat bubble for messages. Images: the three service cards use small illustrations, because a photo of a clean kitchen is generic stock; the Booked screen shows a real photo of the assigned cleaner, cropped square, because customers want to know who is coming; My bookings has no images. Alt text for the cleaner photo: “Sunita Patil, your cleaner, smiling in her Saaf uniform”.',
    data: 'On desktop, My bookings is a table with columns Date, Service, Cleaner, Amount (₹) and Status. Upcoming bookings sit first, then past ones newest first; Date and Amount headers sort. Dates read “Sat 13 Dec”, amounts “₹2,400”, right-aligned in tabular figures. Status is a small badge with words and an icon: “Upcoming”, “Done”, “Cancelled”, never colour alone. Only light rules between rows, no vertical lines. On a phone each booking is a card: date and service on the first line, cleaner and amount on the second, the status badge on the right; tapping opens the details.',
  },
};

const ds2: BossBriefInput = {
  chapterId: 'ds.2',
  title: 'A three-tier token set with light and dark',
  minutes: 120,
  scenario: [
    'Define the design tokens for your Studio product, or for Rasta, the Chennai bus-pass app from this chapter, if you don’t have one yet. Build them in three tiers: primitives (the palette and the scales), semantic tokens (jobs, each with a light and a dark value) and component tokens where a component needs its own handle.',
    'Set it up in Figma variables, a JSON file or a spreadsheet, then describe it here so a reviewer who can’t open your file could rebuild it: the primitives, the semantic colours in both modes with their contrast, the component tokens and why each exists, your naming rules, and one change you’d make to prove the tiers work.',
  ],
  fields: [
    { id: 'primitives', label: 'Primitives', kind: 'long', minWords: 30, hint: 'Your colour ramps (hue and steps, a few hex codes), spacing scale, radius scale and type sizes. Named for what they are.' },
    { id: 'semantic', label: 'Semantic colours, light and dark', kind: 'list', items: 8, minWords: 8, hint: 'One per line: the name, the primitive it uses in light and in dark, and the contrast against what it sits on in each mode. Cover the page, raised surfaces, two text levels, a border, the primary action and its label, and an error colour.' },
    { id: 'components', label: 'Component tokens', kind: 'list', items: 3, minWords: 12, hint: 'Three component tokens, what each points at, and why that component needs its own handle instead of using the semantic token directly.' },
    { id: 'naming', label: 'Your naming rules', kind: 'long', minWords: 25, hint: 'The order of the parts, the case, which tier may mention hues, how states are written, and what happens to a renamed token.' },
    { id: 'change', label: 'Prove the tiers work', kind: 'text', minWords: 25, hint: 'One realistic change (a festival colour, a softer card, a second brand) and exactly which token you’d edit, what changes and what doesn’t.' },
  ],
  rubric: [
    { id: 'tiers', label: 'Three clean tiers', strong: 'Primitives hold only values and are named for what they are; every semantic token points at a primitive and names a job; component tokens point at semantic tokens, and no component points at a primitive directly.', weight: 3, required: true },
    { id: 'modes', label: 'Dark mode tuned, not inverted', strong: 'Every semantic colour has a light and a dark value from the same palette, with contrast given for both: dark-grey page, lighter raised surfaces, off-white text, accents a step or two lighter, text at 4.5:1 or more, and the primary action’s label flipped where needed.', weight: 3, required: true },
    { id: 'naming', label: 'Names you could guess', strong: 'One documented order (category, concept, variant, state) and one case, used by every name; hues and shade numbers appear only in primitives; no new, final or numbered versions; a deprecation rule for renames.', weight: 2 },
    { id: 'components', label: 'Component tokens with a reason', strong: 'A small number of component tokens, each justified by a real exception (a tab line on a dark header, button-only corners) rather than one per property.', weight: 1 },
    { id: 'change', label: 'A change that lands in one place', strong: 'The worked change edits one token in the right tier, and lists what changes and what stays the same.', weight: 1 },
  ],
  tips: ['Do dark mode in the semantic tier and check each pair as you go. It’s much slower to fix twenty contrast failures at the end.', 'If two semantic tokens point at the same primitive, keep both. That shared value is exactly what lets them part later.'],
  example: {
    primitives: 'Colour ramps from 100 to 900: teal (teal-500 #14B8A6, teal-700 #0F766E), red (red-400 #F87171, red-600 #DC2626), amber (amber-500 #F59E0B, amber-700 #B45309), and grey from 25 to 950 (grey-25 #FCFCFD, grey-100 #F2F4F7, grey-400 #98A2B3, grey-600 #475467, grey-800 #1D2939, grey-900 #101828), plus white. Spacing on a 4-pt scale: space-1 (4) to space-8 (32), named by step. Radius: radius-8, radius-16, radius-20, radius-full. Type sizes: font-size-13, 16, 20, 25, 32.',
    semantic: [
      'color-surface-page: grey-50 light, grey-900 dark. Body text on it: 17.0:1 light, 16.1:1 dark.',
      'color-surface-raised: grey-25 light, grey-800 dark. One step lighter than the page at night; body text on it 13.3:1.',
      'color-text-primary: grey-900 light (17.7:1 on white), grey-100 dark (16.1:1 on grey-900).',
      'color-text-secondary: grey-600 light (7.7:1 on white), grey-400 dark (6.9:1 on grey-900).',
      'color-border-default: grey-300 light, grey-700 dark (1.7:1 on the page). Only separates; inputs use color-border-control at 3:1.',
      'color-action-primary: teal-700 light (5.5:1 with a white label), teal-500 dark (7.1:1 with a grey-900 label).',
      'color-text-on-action: white light, grey-900 dark, so the Renew label passes in both modes.',
      'color-feedback-error: red-600 light (4.8:1 on white), red-400 dark (6.4:1 on grey-900).',
    ],
    components: [
      'tab-indicator-color → color-text-on-inverse (white in both modes). The tab bar sits on the dark teal header, where the primary colour would vanish, so the tab line needs its own handle.',
      'button-radius → radius-control. Buttons may get rounder corners without rounding the inputs, which share radius-control today.',
      'button-primary-bg → color-action-primary. Festival campaigns restyle the main button only; this handle lets a campaign theme reach it without touching toggles.',
    ],
    naming: 'Order: category or component, concept, variant, state, so color-action-primary-hover and button-primary-bg. Kebab-case everywhere, which becomes --color-action-primary in CSS and is converted to camelCase for the Android and iOS builds. Hues and shade numbers appear only in primitives. States are hover, pressed, focus and disabled, always last. Modes are never in names. A renamed token stays for one release as a deprecated alias pointing at the new name, then is removed.',
    change: 'For Pongal week the primary action turns gold. I repoint color-action-primary at amber-700 in light mode (5.0:1 with a white label) and amber-500 in dark mode with a dark label. The Renew button, the active tab and the auto-renew toggle change; links, errors and every surface stay as they were. After the week, I point it back.',
  },
};

const ds3: BossBriefInput = {
  chapterId: 'ds.3',
  title: 'Eight documented components',
  minutes: 120,
  scenario: [
    'Build eight components for your Studio product in Figma, on top of the tokens from the last boss. If you don’t have a product yet, use Rasta, the Chennai bus-pass app from this chapter. Cover actions, inputs, feedback and containers, and draw every interactive state.',
    'Then describe the library here so a reviewer who can’t open your file could rebuild it: what each component is for and its properties, the full API of your most complex component, the states you drew, how many frames each set needed, and one component’s doc page as you’d publish it.',
  ],
  fields: [
    { id: 'inventory', label: 'The eight components', kind: 'list', items: 8, minWords: 12, hint: 'One per line: the name, what it’s for, its variant properties with their values, and its other properties (boolean, text, instance swap).' },
    { id: 'api', label: 'One component’s API', kind: 'long', minWords: 60, hint: 'Your most complex component. Every property: its type, its values and default, and why it’s a variant or a component property. Name the code prop it maps to, and anything you deliberately left out.' },
    { id: 'states', label: 'States', kind: 'list', items: 4, minWords: 12, hint: 'Four interactive components, one per line: which states you drew (default, hover, pressed, focus, disabled, plus error or loading where they exist) and what changes in each.' },
    { id: 'frames', label: 'Frame count', kind: 'text', minWords: 25, hint: 'The frames in each component set, and one place where a boolean, text or instance-swap property replaced a variant. How many frames did it save?' },
    { id: 'docs', label: 'One doc page', kind: 'long', minWords: 80, hint: 'As published: one line on what it’s for, use it for and don’t use it for, two do and don’t pairs (describe each picture), accessibility, and where the docs live.' },
  ],
  rubric: [
    { id: 'api', label: 'An API that can’t describe a wrong component', strong: 'Choices that exclude each other are one variant property, never a stack of booleans; booleans are real on/off states; content goes in text or instance-swap properties; nothing the tokens should decide (colour, padding, radius) is exposed; every property has a sensible default and the same name as its code prop.', weight: 3, required: true },
    { id: 'variants', label: 'Variants only where the drawing changes', strong: 'Frame counts are given and add up; icons, labels and optional layers are not variants; every interactive component has default, hover, pressed, focus and disabled drawn, with error, loading or selected where they apply, and a visible focus ring.', weight: 3, required: true },
    { id: 'docs', label: 'Docs that answer the question', strong: 'The page leads with what it’s for and when not to use it (naming the alternative); do and don’t pairs show real mistakes in real screens; accessibility notes are specific and testable; history is left out; the props table is generated, and the docs live in Figma and next to the code.', weight: 2 },
    { id: 'tokens', label: 'Built on tokens', strong: 'Components use semantic or component tokens from the last boss, never raw hex values, so modes and themes reach them.', weight: 1 },
    { id: 'coverage', label: 'A useful set of eight', strong: 'The eight cover actions, inputs, feedback and containers, and each is distinct: no two components that should be one with a variant.', weight: 1 },
  ],
  tips: ['Count the frames before you draw them: multiply the values of every variant property. If the number surprises you, one of them should be a component property.', 'Write the doc page’s first two lines before you build the component. If you can’t say when not to use it, it may not need to exist.'],
  example: {
    inventory: [
      'Button: any action, from Renew to Cancel pass. Variant property hierarchy (primary, secondary, tertiary, danger), size (sm, md, lg), state (default, hover, pressed, focus, disabled, loading). Booleans: leading icon, trailing icon. Instance swaps: which icon each. Text: label.',
      'Icon button: an action with only an icon, in the header and on the QR card. Variants: hierarchy (secondary, tertiary), size (sm, md), state (five). Instance swap: icon. Text: accessible label, written in the description.',
      'Text input: one line of typed input, such as a UPI ID or a phone number. Variants: state (default, hover, focus, disabled, error). Text: label, value, help text, error text. Booleans: help text, leading icon. Instance swap: leading icon.',
      'Toggle: an on/off setting that applies at once, like auto-renew. Variants: on (true, false), state (default, hover, focus, disabled). Boolean: label shown. Text: label.',
      'Chip: one choice from a short set, such as a fare zone. Variants: selected (true, false), state (default, hover, focus, disabled). Text: label. Boolean: count shown.',
      'Banner: a message about the whole screen, like “Your pass ends in 2 days”. Variant: tone (info, warning, error, success). Text: message. Booleans: action, close button. Instance swap: icon.',
      'Pass card: the rider’s current pass. Variant: status (active, ending, expired). Text: pass name, zones, valid-till date, price. Boolean: QR code shown.',
      'Tab bar: the app’s top-level navigation. Variant: items (3, 4). Each item is a nested Tab with variants selected (true, false) and state (default, pressed, focus), an instance-swap icon and a text label.',
    ],
    api: 'Button. hierarchy (variant property; code prop variant): primary, secondary, tertiary, danger; default secondary, so the loud look has to be asked for. Danger is only for actions that can’t be undone. size (variant; code prop size): sm 32 px, md 40 px, lg 48 px; default md. Height, padding and text size follow from it. state (variant in Figma only): default, hover, pressed, focus, disabled, loading. In code hover, pressed and focus come from the browser; disabled and loading are the props isDisabled and isLoading, because any variant can be either. Leading icon and trailing icon (booleans) with Icon and Trailing icon (instance swaps, restricted to the 24 px icon set): code props iconLeading and iconTrailing, which are slots. Label (text property): the children. Left out on purpose: colour (the hierarchy picks it through color-action-primary and friends), padding (the size sets it), corner radius (the button-radius token), and width (the layout stretches it).',
    states: [
      'Button: default; hover darkens the fill one step; pressed two steps; focus adds a 2 px ring in color-border-focus with a 2 px gap; disabled drops to color-bg-disabled with grey text; loading swaps the label for a spinner and keeps the width.',
      'Text input: default with a 1 px color-border-control border; hover darkens the border; focus uses a 2 px color-border-focus border; disabled greys the field and text; error turns the border color-feedback-error and shows the error text under the field.',
      'Toggle: off and on, each with default, hover (the track darkens), focus (the ring) and disabled (50% track, no shadow on the knob). On uses color-action-primary.',
      'Chip: unselected has an outline, selected fills with color-action-primary-subtle and a check icon; hover darkens the outline; focus adds the ring; disabled greys it.',
    ],
    frames: 'Button 4 × 3 × 6 = 72 frames. Icon button 2 × 2 × 5 = 20. Text input 5. Toggle 2 × 4 = 8. Chip 2 × 4 = 8. Banner 4. Pass card 3. Tab bar 2, plus 6 for the nested Tab. 128 in all. Making the button’s icon a boolean plus an instance swap, instead of a variant for each of 6 icons in 3 positions, kept the Button at 72 frames instead of 1,296.',
    docs: 'Button. Starts an action: Renew, Pay, Save. Use it for: anything that does something on this screen. Don’t use it for: going to another page (use a Link: “See the fare chart”), or choosing between options (use Chips). One primary button per screen or dialog; everything else is secondary or tertiary. Do / don’t 1: the filter dialog with “Apply” as primary and “Clear all” as tertiary (do) next to the same dialog with both primary (don’t). Do / don’t 2: danger on “Cancel pass”, which can’t be undone (do), next to danger on “Remove filter” (don’t). Labels: a verb first, three words at most plus an amount, like “Renew · ₹1,000”; never “OK” or “Submit”. Accessibility: tap area at least 48 × 48 px, even for sm, using padding outside the visible edge; never remove the focus ring; icon-only buttons need an aria-label; while loading, keep the width and announce “Renewing…”. Props: generated from the code by Storybook. Where it lives: a two-line description on the Figma component that links here, and this page beside the live examples. It changes in the same pull request as the component.',
  },
};

const pr2: BossBriefInput = {
  chapterId: 'pr.2',
  title: 'Three transitions, justified',
  minutes: 90,
  scenario: [
    'Pick three transitions in your Studio product that would explain something if they moved: something arriving, something leaving or changing place, and something giving feedback. If you don’t have a product yet, use Dabba, the Bengaluru lunch-subscription app from this chapter: opening a meal, adding it to the week, and paying.',
    'Animate all three in Figma (Smart Animate), Principle, Framer or code, and share a link or a screen recording. Then write the spec here as you would hand it to a developer, so someone who can’t see the recording could build each one, including what it becomes when Reduce motion is on.',
  ],
  fields: [
    { id: 'link', label: 'Prototype or recording', kind: 'text', minWords: 6, hint: 'The link, and the tool you used.' },
    { id: 'transitions', label: 'The three transitions', kind: 'list', items: 3, minWords: 40, hint: 'One per line: what triggers it, what moves and from where to where, the curve (named, with its cubic-bezier or spring values), the duration in ms, and any stagger or order.' },
    { id: 'why', label: 'Why each one moves', kind: 'list', items: 3, minWords: 20, hint: 'One per line: the job the motion does (where it went, what changed, or where to look), and what someone would miss if it were cut.' },
    { id: 'reduced', label: 'With Reduce motion on', kind: 'list', items: 3, minWords: 12, hint: 'One per line: does it stop, become a fade (with its duration), or stay as it is, and why.' },
    { id: 'cut', label: 'What you didn’t animate', kind: 'text', minWords: 20, hint: 'One motion you considered and left out, or one you cut from the product, and why it had no job.' },
  ],
  rubric: [
    { id: 'meaning', label: 'Every motion has a job', strong: 'Each transition explains something specific (spatial continuity, a change of state, or a single pointer to what matters), the justification says what would be lost without it, motion is paired with words where it carries a message, and decoration is cut on purpose.', weight: 3, required: true },
    { id: 'curves', label: 'The right curve and time', strong: 'Arrivals ease out, exits ease in, moves across the screen ease in-out, and only loops or finger-driven motion are linear; durations fit the size of the change (under 100 ms for presses, roughly 150–400 ms for most UI, at most about 500 ms for a full screen); exits are shorter than entrances; values are exact enough to build.', weight: 3, required: true },
    { id: 'reduced', label: 'Reduced motion decided per motion', strong: 'Every transition has a reduced version: large travel, zoom and parallax become a fade or an instant change, anything that plays by itself stops, and small meaningful changes and status indicators stay. No blanket “animation: none”.', weight: 2 },
    { id: 'choreo', label: 'Choreography', strong: 'Where several things move, one leads in reading order, staggers are 30–50 ms and capped, and the whole transition settles in about half a second. Direction is consistent: deeper one way, back the reverse.', weight: 1 },
    { id: 'system', label: 'Built as a system', strong: 'Curves and durations are named tokens (ease-enter, duration-standard) reused across the three, not one-off values.', weight: 1 },
  ],
  tips: ['Before you animate, write one sentence for each transition: “This motion shows that…”. If you can’t finish the sentence, don’t animate it.', 'Watch your recording at half speed. Anything that jolts at the start or end has the wrong curve; anything you wait for is too long.'],
  example: {
    link: 'Figma prototype with Smart Animate, plus a 40-second screen recording: figma.com/proto/… (Dabba motion).',
    transitions: [
      'Opening a meal. Trigger: tap a meal card on the week screen. The card’s photo grows from its place in the list to the full-width header of the meal page, while the rest of the menu fades out and the page’s text fades up 8 px behind it, 40 ms after the photo starts. Curve: ease-enter, cubic-bezier(0.16, 1, 0.3, 1). Duration: 350 ms for the photo, 250 ms for the text. Back reverses it with ease-exit, cubic-bezier(0.7, 0, 0.84, 0), in 250 ms.',
      'Adding a meal to the week. Trigger: tap Add on the meal page. The Add button darkens on press in 80 ms. A 48 px copy of the photo shrinks to 16 px and travels along a short arc to the cart tab, ease-move, cubic-bezier(0.65, 0, 0.35, 1), in 400 ms. As it lands the badge counts from 2 to 3 with a 1.2× scale that settles in 150 ms, and the toast “Added to Tuesday · Undo” rises 8 px and fades in over 200 ms with ease-enter.',
      'Paying. Trigger: tap Pay ₹495. The button keeps its width, swaps its label for a linear spinner (one turn per 800 ms) and the words “Waiting for your UPI app…”. On success the spinner becomes a tick that draws in over 300 ms with ease-enter, and “Order placed for the week” fades in 100 ms after. On a wrong PIN the field shakes once, 3 cycles of 6 px in 300 ms, and the error text appears below it at the same moment.',
    ],
    why: [
      'Continuity: the photo that grows is the card Kiran tapped, so she knows this page is that meal and doesn’t have to find her place. Cut it and the page swaps with no link to what she touched. Direction stays consistent: deeper grows out, Back shrinks in.',
      'Where it went: the flight shows the meal going into the cart, and the badge confirms it. In testing, without it two of five people tapped Add twice. The toast says it in words, and its Undo covers a mis-tap.',
      'What changed: the spinner with words says the payment is still going, so nobody taps Pay again; the tick and the shake say yes and no. The words carry the same message for anyone who can’t see the motion or has it turned off.',
    ],
    reduced: [
      'Opening a meal becomes a 150 ms cross-fade. The growing photo is movement in depth, a vestibular trigger; the photo at the top of the page still says which meal it is.',
      'The flight stops. The badge changes from 2 to 3 with a brief colour highlight, and the toast fades in without rising. The meaning, “it went into the cart”, stays.',
      'Stays as it is. The spinner turns in place and is the only sign the payment is still going, and the tick is small. The shake becomes a red border and the error text, with no movement.',
    ],
    cut: 'The Dabba logo spinning on every launch. It told people nothing, delayed the menu by 600 ms on every open, and played twenty times a month for a daily user. It now plays once, on the very first launch, and never with Reduce motion on. The roti and chilli icons floating behind the menu went too: constant background motion pulled the eye away from the meals.',
  },
};

const pr3: BossBriefInput = {
  chapterId: 'pr.3',
  title: 'One key moment, fully specified',
  minutes: 90,
  scenario: [
    'Pick one key moment in your Studio product where getting the small details right matters: a payment succeeding, a booking confirmed, a goal reached, a file sent. If you don’t have a product yet, use Gullak, the Pune UPI and savings-jar app from this chapter, and design what happens when Meera pays Raju the milkman ₹240.',
    'Design it as a micro-interaction: trigger, rules, feedback and loops, including the slow, failed and repeated cases, not just the happy path. Prototype it in Figma, Principle, Framer or code and share a link or a screen recording. Then decide, with numbers, where any delight goes and where it doesn’t.',
  ],
  fields: [
    { id: 'link', label: 'Prototype or recording', kind: 'text', minWords: 6, hint: 'The link, and the tool you used.' },
    { id: 'trigger', label: 'Trigger', kind: 'text', minWords: 15, hint: 'What starts it, manual or system, and how the trigger shows what it will do.' },
    { id: 'rules', label: 'Rules', kind: 'list', items: 3, minWords: 10, hint: 'One per line: what it may do and what it won’t, including double taps, limits and edge cases.' },
    { id: 'feedback', label: 'Feedback for each outcome', kind: 'list', items: 3, minWords: 15, hint: 'One per line: the outcome (working, success, failure…), what the person sees, hears or feels, the words, and the timing in ms.' },
    { id: 'loops', label: 'Loops and modes', kind: 'list', items: 2, minWords: 12, hint: 'One per line: how it changes over a long wait, with repetition, offline, or with Reduce motion on.' },
    { id: 'delight', label: 'Where the delight goes, and where it doesn’t', kind: 'long', minWords: 50, hint: 'The one flourish you kept, with its duration × how often a daily user sees it, and one you cut, with why: too often, in the way, or the wrong tone.' },
  ],
  rubric: [
    { id: 'parts', label: 'All four parts, built to spec', strong: 'The trigger, rules, feedback and loops are each stated specifically enough to build without guessing; manual triggers say what they will do, and system triggers have feedback that explains what the app did on its own.', weight: 3, required: true },
    { id: 'edges', label: 'Beyond the happy path', strong: 'Rules cover the double tap, limits and edge cases; feedback is designed for every outcome the rules create (working, success, failure, pending), and failure says plainly what happened and what to do next.', weight: 3, required: true },
    { id: 'feedback', label: 'Feedback that answers', strong: 'Presses answer within about 100 ms; status is shown in words as well as motion; durations and curves are given and fit pr.2’s bands; the feedback changes over a long wait instead of looping unchanged.', weight: 2 },
    { id: 'delight', label: 'Delight judged, not sprinkled', strong: 'The kept flourish is rare and earned or small and quick, its cost is worked out (duration × frequency), it never blocks the next step, and a cut is justified by frequency, blocking or tone. Bad moments get no playfulness.', weight: 2 },
    { id: 'loops', label: 'It changes over time', strong: 'At least one loop shortens or changes the interaction for repeat users or long waits, and a mode (offline, Reduce motion) keeps the meaning.', weight: 1 },
  ],
  tips: ['Write the rules first and list every outcome they can produce. Each outcome needs its own feedback; most products only design one.', 'Multiply before you animate: a 1-second flourish on something done twice a day is a minute a month for every user.'],
  example: {
    link: 'Figma prototype with Smart Animate and a 35-second screen recording: figma.com/proto/… (Gullak · Pay Raju).',
    trigger: 'Manual: Meera taps the full-width button “Pay ₹240 to Raju” on Raju’s card, with his name and the amount in the label so the button says exactly what it will do. From the twentieth day the same trigger also appears as “Pay Raju ₹240 again” at the top of the home screen.',
    rules: [
      'One tap pays once: the button locks on the first tap and ignores further taps until the payment resolves.',
      'Payments over ₹1,000 ask for the UPI PIN; Raju’s ₹240 goes through UPI Lite with no PIN, from a Lite balance Meera tops up, and Gullak says so on the button the first time.',
      'If the bank hasn’t answered in 30 seconds, the payment is marked pending; Gullak never retries on its own and never lets Meera pay Raju again while one is pending.',
    ],
    feedback: [
      'Pressed: the button darkens and scales to 98% within 80 ms, and the phone gives one light haptic tap.',
      'Working: within 150 ms the label becomes a 20 px linear spinner (one turn per 800 ms) and the words “Waiting for your bank…”, with the button’s width kept so nothing jumps.',
      'Success: the spinner becomes a tick that draws in over 300 ms with ease-out, one firm buzz, and “₹240 paid to Raju · 7:42 am” with a receipt link. No confetti: this happens every day.',
      'Failure: no motion and no character. A red outline, “Payment failed. Your bank didn’t respond, and no money left your account.” and a Try again button, which is enabled straight away.',
    ],
    loops: [
      'Long wait: after 5 seconds the words become “Still waiting. Don’t pay again.”; after 30 seconds “Pending. We’ll tell you when it clears”, and a notification follows when it does.',
      'Repetition and modes: after 20 days, a one-tap “Pay Raju ₹240 again” and an offer of autopay. Offline, the button reads “You’re offline” and is disabled. With Reduce motion on, the tick appears without drawing and the press keeps only its colour change.',
    ],
    delight: 'Kept: when a payment’s round-up takes the Goa jar to its ₹15,000 goal, the jar fills and bursts with coins for 900 ms, once per goal. That is 900 ms × about one goal every few months, a fraction of a second a month, at a moment Meera earned, and the Done button works throughout. With Reduce motion on it becomes a still illustration of the full jar with “You saved ₹15,000 for Goa”. Cut: confetti on every payment. At 1.2 s × 60 payments it cost Meera 72 seconds a month and meant nothing after the second day. Also cut: the winking piggy on failures, because playfulness while someone is worried about their money reads as not taking it seriously.',
  },
};

const cw2: BossBriefInput = {
  chapterId: 'cw.2',
  title: 'A voice & tone guide, used ten times',
  minutes: 90,
  scenario: [
    'Write a short voice and tone guide for your Studio product, then prove it works by writing the copy for 10 real moments in it. If you don’t have a product yet, use Chaabi, the Kolkata flat-rental app from this chapter: finding a flat, paying rent by UPI, raising repairs and getting the deposit back, about to launch in Bengali and Hindi.',
    'The guide is for someone who joins next month and writes alone. Define the voice so it can be recognised, set out how the tone changes and why, and give the words to use and avoid. Then pick 10 moments that span the dial, good news to bad, low stakes to high, and write each one as it would ship, ready for translation.',
  ],
  fields: [
    { id: 'product', label: 'Product and the people it talks to', kind: 'text', minWords: 15, hint: 'What it does, for whom, and the situations they’re in when they read it.' },
    { id: 'voice', label: 'Voice: three traits', kind: 'list', items: 3, minWords: 12, hint: 'One per line: the trait, what it means in practice, and what it isn’t (“Straight, not blunt: …”).' },
    { id: 'tone', label: 'How the tone changes', kind: 'long', minWords: 60, hint: 'Your tone scale, what moves it along (mood, stakes, anything else), and a rule for each type of moment: good news, routine, small problems, serious ones.' },
    { id: 'words', label: 'Words and style', kind: 'list', items: 4, minWords: 6, hint: 'One per line: a word or habit to use and its opposite to avoid, with why (“tenant, not lessee”; no exclamation marks about money).' },
    { id: 'moments', label: '10 product moments', kind: 'list', items: 10, minWords: 15, hint: 'One per line: the moment, its tone and why, then the exact copy as it ships (headline, body, button).' },
    { id: 'translate', label: 'Ready for translation', kind: 'long', minWords: 40, hint: 'How your guide and copy keep strings whole, plain and with room to grow: placeholders, plurals, idioms you replaced, formats, and notes for translators.' },
  ],
  rubric: [
    { id: 'voice', label: 'A voice you can recognise', strong: 'Three distinct traits, each with what it means in practice and a boundary (“not …”) that stops it being overdone; every one of the 10 moments sounds like the same product.', weight: 3, required: true },
    { id: 'tone', label: 'Tone set by the moment', strong: 'The tone rules say what moves the tone (at least mood and stakes) and give a rule per type of moment; the 10 moments span the scale, and each one’s tone follows from the rules, with no playfulness on failures, money or anything at risk.', weight: 3, required: true },
    { id: 'moments', label: 'Copy that does its job', strong: 'Each moment answers what the person needs to know then, in their order: what happened, what it means for them (amounts, dates, names) and what to do, with verb-plus-object buttons from cw.1. Serious moments are calm and specific, not just sympathetic.', weight: 3, required: true },
    { id: 'usable', label: 'Usable by someone new', strong: 'The guide is short, concrete and example-led: a new writer could apply it to an eleventh moment without asking; the word list gives a reason for each entry.', weight: 2 },
    { id: 'translate', label: 'Ready for translation', strong: 'Strings are whole messages with named placeholders and plural rules, idioms are replaced with plain meaning, room to grow and locale formats are planned, and translators get context notes.', weight: 1 },
  ],
  tips: ['Write the serious moments first. If the voice still sounds like itself when rent has failed, it will survive anything.', 'Read your 10 moments in a row, out loud. If one sounds like a different company, either the voice or that line is wrong.'],
  example: {
    product: 'Chaabi helps people in Kolkata rent a flat and live in it: search, sign the agreement, pay rent by UPI, raise repairs and get the deposit back. Its users are tenants in their 20s and 30s, often new to the city, reading on a phone between work and a landlord’s call, sometimes worried about money or a deadline.',
    voice: [
      'Straight, not blunt: we say the thing that matters first, in plain words, with the amount, the date and the name. We don’t hide news behind “Oops” and we don’t bark orders.',
      'Neighbourly, not chummy: we sound like a helpful person in the next flat who knows how renting works. We use first names and “Mrs Sen”, not “the lessor”. We don’t do baby talk or forced slang.',
      'Sure, not bossy: we know the rules of renting and tell people their rights and next step with confidence. We don’t lecture, and we never guess.',
    ],
    tone: 'Our tone moves on one dial: playful, warm, plain, serious. Two things set it. The mood of the moment sets the start: good news starts playful, routine starts warm, bad news starts plain. The stakes push it one step graver: if money, a home or a deadline is involved, go one step towards serious. Rules: good news with nothing at stake may have one light line, never at the person’s expense. Big good news (a refund, a signed agreement) is warm: amount and date first, no sound effects. Routine steps that block progress (KYC, signing) are plain: what, why, how long. Small problems are plain: what happened, that nothing else was lost, and the fix. Serious moments (failed rent, notices, disputes) are short and calm: what happened, what it means for the money or home, and two ways forward. No exclamation marks, no emoji and no “don’t worry” anywhere near money going wrong.',
    words: [
      'Tenant and landlord, or their names, not lessee and lessor: people don’t use legal words about their own home.',
      'The exact amount (₹18,500), not “your payment”: money is what people check first.',
      'A date with the month as a word (14 March), not “soon” or 14/03: soon is a promise nobody can hold, and 14/03 is ambiguous across locales.',
      'No exclamation marks or emoji in anything about money, notices or repairs that affect safety: they read as alarm or as not taking it seriously.',
    ],
    moments: [
      'Shortlist saved (good, low stakes: playful): “Five flats on your shortlist. Someone’s serious about Jadavpur.” Button: “Compare flats”.',
      'Move-in day (good, low stakes: playful): “Keys in hand. Your rent, repairs and agreement for Flat 2A now live here.” Button: “Set up rent”.',
      'Deposit refund approved (good, high stakes: warm): “₹41,800 of your ₹45,000 deposit is on its way. It reaches your bank by 14 March.” Button: “See the deductions”.',
      'No search results (routine, low stakes: warm): “No flats match all your filters yet. Raise the rent limit to ₹20,000 to see 6 more, or we’ll tell you when one comes up.” Buttons: “Raise limit”, “Tell me”.',
      'PAN needed before signing (routine, high stakes: plain): “Add your PAN to sign. Mrs Sen needs it for your rent receipts. It takes about a minute.” Button: “Add PAN”.',
      'Repair photo failed (bad, low stakes: plain): “That photo didn’t upload. Your request is saved. Check your connection and try again.” Button: “Try again”.',
      'Repair request accepted (routine, low stakes: warm): “Mrs Sen has seen your request about the bathroom tap. The plumber can come Saturday, 10 am to 12 pm.” Buttons: “Book Saturday”, “Pick another time”.',
      'Rent reminder (routine, high stakes: plain): “Rent of ₹18,500 is due on the 5th, in 2 days.” Sent at 9 am, not at night. Button: “Pay ₹18,500”.',
      'Rent failed on the due date (bad, high stakes: serious): “Your ₹18,500 rent didn’t go through, and no money left your account. It’s due today: pay with another UPI app, or tell Mrs Sen you’ll pay tomorrow.” Buttons: “Pay another way”, “Message Mrs Sen”.',
      'Notice to leave (bad, high stakes: serious): “Mrs Sen has given you two months’ notice to leave Flat 3B, by 28 February. Your agreement allows this. You can read the notice, check your deposit terms and see flats near you.” Buttons: “Read notice”, “See flats”.',
    ],
    translate: 'Every string is one message with named placeholders: “Rent of {amount} is due on {date}”, never joined pieces, so Bengali and Hindi translators can put the verb at the end. Counts use plural rules (“{count, plural, one {# repair} other {# repairs}}”). I replaced the two idioms in our old copy, “We’ve got your back” and “in the bag”, with what they mean. Buttons and tabs grow with their labels, and we run a pseudo-localized build on every new screen. Dates and money are formatted by the app per locale (3 April, ₹1,00,000), and each string goes to translators with where it appears, its character limit and what each placeholder holds. Where Hindi would force a gendered verb (“You are paying”), we use a neutral form (“Payment in progress”).',
  },
};

const ax2: BossBriefInput = {
  chapterId: 'ax.2',
  title: 'A11y annotations for dev handoff',
  minutes: 90,
  scenario: [
    'Annotate three screens of your Studio product so a developer can build them accessibly without asking you a single question. If you don’t have a product yet, use Rahi, the Pune bus-booking app from this chapter: the search screen, the seat page with its boarding point dialog, and the passenger form.',
    'Annotations sit on top of the design, not in a separate essay. For each screen, number the focus order and mark the arrow-key groups; give every control its element or role, its accessible name and its states; and say what happens to focus and what a screen reader hears when things open, close, fail or change. Then note the time, memory and surprise traps you designed out.',
  ],
  fields: [
    { id: 'screens', label: 'The product and the three screens', kind: 'text', minWords: 15, hint: 'What the product does, and which three screens you annotated and why those.' },
    { id: 'focus', label: 'Focus order, screen by screen', kind: 'list', items: 3, minWords: 25, hint: 'One line per screen: the numbered Tab stops in order, which groups are one stop with arrow keys inside, the skip link, and where focus goes when a dialog or panel opens and closes.' },
    { id: 'controls', label: 'Names, roles and states', kind: 'list', items: 6, minWords: 10, hint: 'One control per line: the element or role, its accessible name (and where it comes from), and every state it needs (“Sort: native <button>, name from its text, aria-expanded”).' },
    { id: 'structure', label: 'Headings, landmarks and images', kind: 'long', minWords: 30, hint: 'The heading outline (h1, h2…), the landmarks (header, nav, main, footer), and the alt text for each image, including which are decorative.' },
    { id: 'forms', label: 'Forms, errors and announcements', kind: 'long', minWords: 50, hint: 'Labels, hints and required fields; when validation runs; the exact error text and how it’s linked; where focus goes after a failed submit; and which messages are announced in a live region.' },
    { id: 'cognitive', label: 'Time, memory and surprises', kind: 'long', minWords: 30, hint: 'Any time limits and how people extend them, what you carry forward so nothing is typed twice, how sign-in avoids memory tests, and what never happens without the person choosing it.' },
    { id: 'check', label: 'How you’ll check the build', kind: 'list', items: 3, minWords: 10, hint: 'One per line: a concrete test (keyboard only, a named screen reader, a zoom or automated check), what passes, and which success criteria it covers.' },
  ],
  rubric: [
    { id: 'focus', label: 'A focus path a developer can build', strong: 'Every interactive element on each screen is in a numbered order that follows reading order; groups of similar choices are one stop with arrow keys named; hidden things take no stop; dialogs say where focus goes on open, that Tab stays inside, that Esc closes, and where focus returns (2.1.1, 2.1.2, 2.4.3).', weight: 3, required: true },
    { id: 'semantics', label: 'Name, role and state for every control', strong: 'Each control gets a native element where one exists (ARIA only where HTML can’t), an accessible name that includes its visible text, and every state it can be in (checked, expanded, unavailable, selected); icon buttons and meaningful images are named and decorative ones hidden (4.1.2, 1.1.1, 2.5.3).', weight: 3, required: true },
    { id: 'forms', label: 'Errors people can see and hear', strong: 'Every field has a visible, linked label; errors are in text, specific, say how to fix it, and are linked with aria-describedby and aria-invalid; after a failed submit focus moves to a summary that links to each field, input is kept, and status messages use a live region (3.3.1, 3.3.2, 3.3.3, 4.1.3).', weight: 2, required: true },
    { id: 'structure', label: 'A page you can skim by ear', strong: 'A sensible heading outline with no skipped levels, landmarks for the main regions, and a skip link, so a screen reader user can jump to any part (1.3.1, 2.4.1, 2.4.6).', weight: 1 },
    { id: 'cognitive', label: 'No traps for memory or time', strong: 'Time limits are warned and extendable, details carry forward, sign-in allows paste and autofill with no puzzle, choices don’t change context on their own, and money or data changes get a review step (2.2.1, 3.3.7, 3.3.8, 3.2.2, 3.3.4).', weight: 1 },
    { id: 'check', label: 'A way to prove it', strong: 'Tests a developer and QA can run: a keyboard-only pass with the expected presses, a named screen reader with the expected announcements, and an automated check, each tied to the criteria it covers and honest that automated tools catch only part of it.', weight: 1 },
  ],
  tips: ['Annotate the dialog’s open and close as carefully as the screen. That’s where focus gets lost most often.', 'Write the announcement you expect, word for word (“Seat 14, window, button, unavailable”). It’s the fastest way for a developer to check their work.'],
  example: {
    screens: 'Rahi books intercity buses from Pune: search for a route, pick a date and seat, choose a boarding point and pay by UPI. I annotated the search screen, the seat page with its boarding point dialog, and the passenger form, because those are where keyboard and screen reader users got stuck in testing.',
    focus: [
      'Search: 1 Skip to results (visible on focus), 2–6 header links, 7 From, 8 Swap From and To, 9 To, 10 Date (opens a calendar dialog: focus moves to today’s date, arrow keys move by day, Esc closes and returns focus to the Date field), 11 Search buses. The closed mobile menu takes no stops.',
      'Seat page: 1 Skip to seats, 2–6 header links, 7 Date chips (one stop, a radio group: Left and Right change the day), 8 Seat map (one stop, a grid: arrows move, Space or Enter picks, booked seats are focusable but say unavailable), 9 Boarding point, 10 Pay ₹1,280. Boarding point opens a dialog: focus goes to its heading, Tab stays inside, Esc or Done closes it and returns focus to the Boarding point button.',
      'Passenger form: fields in visual order, 1 Full name to 10 Send my ticket on WhatsApp, then 11 Pay. After a failed submit, focus moves to the error summary heading “There are 3 problems”, whose links move focus to each field. No positive tabindex anywhere on any screen.',
    ],
    controls: [
      'Swap From and To: native <button>, name from aria-label="Swap From and To", the icon aria-hidden. NVDA: “Swap From and To, button”.',
      'Search: native <button>, name from aria-label="Search buses" because it shows only an icon. NVDA: “Search buses, button”.',
      'AC buses only: <button role="switch">, name from its visible text, aria-checked true or false. NVDA: “AC buses only, switch, off”.',
      'Sort: native <button> “Sort: Departure”, aria-expanded false or true, aria-controls pointing at the menu. NVDA: “Sort: Departure, button, collapsed”.',
      'Each seat: native <button> in a grid, name “Seat 14, window” (number plus position), aria-pressed for the seat he picked, aria-disabled="true" when booked. NVDA: “Seat 14, window, button, unavailable”.',
      'Fare rules: a <button>, not a link, because it opens a dialog on this page; the dialog has role="dialog", aria-modal="true" and aria-labelledby pointing at its heading “Fare rules”.',
    ],
    structure: 'Each screen has one h1 (“Buses from Pune to Goa”, “Choose your seat”, “Passenger details”) and h2s for each section (“Sort and filter”, “Results”, “Seat map”, “Fare”). Landmarks: header, nav for the header links, main for the content, footer. Operator logos get alt text with the operator’s name (alt="Konkan Travels"); the sunset photo and bus illustration are decorative, alt="" and no focus; seat icons are inside named buttons, so they are aria-hidden.',
    forms: 'Every field has a visible label above it tied with <label for>, never a placeholder alone; optional fields say “(optional)”; required ones have the required attribute and the form says at the top that all fields are required unless marked. Name, mobile and email use autocomplete name, tel and email. Validation runs when a field loses focus and on submit, not on every key. Errors appear in text under the field and are linked with aria-describedby, with aria-invalid="true" on the field: “Enter a 10-digit mobile number, like 98200 12345”, “Enter an email like name@example.com”, “Tick this to accept the cancellation policy”. On a failed submit, everything typed is kept and focus moves to an error summary that lists each problem as a link to its field. “Only 2 seats left” and “Seat 12 selected” are announced in a role="status" live region without moving focus.',
    cognitive: 'The seat hold is 10 minutes; with a minute left, a dialog says “Your seat is held for 1 more minute” with “Add 5 minutes”, and it can be extended at least ten times. Passenger details carry forward into payment with Change beside each. The OTP field uses autocomplete="one-time-code" and accepts paste, and sign-in has no CAPTCHA. Picking a boarding point never moves to another page; the person presses Continue. A review screen shows route, date, time, seat and amount before any payment. Help sits in the same top-right spot on every screen.',
    check: [
      'Keyboard only, mouse unplugged: book Pune to Goa from search to payment; Pay is reached in 10 Tab presses on the seat page, every focus is visible, and Esc closes every dialog back to its button (2.1.1, 2.1.2, 2.4.3, 2.4.7).',
      'NVDA with Chrome, and TalkBack on an Android phone: every control in the table announces exactly the expected name, role and state, and the error summary is read when focus lands on it (4.1.2, 3.3.1, 4.1.3).',
      'axe DevTools on each screen with zero violations, plus a manual check of what it can’t judge, like whether the error text is helpful and the focus order makes sense (1.1.1, 1.3.1, 3.3.3).',
    ],
  },
};

/** Boss briefs keyed by chapter id. */
export const BOSSES: Record<string, BossBrief> = Object.fromEntries(
  [fd1, fd2, rs1, ia1, ui1, cw1, st1, rs2, ui2, ui3, ds1, pr1, ax1, gr1, br1, bz1, dc1, ld2, ia2, fd3, rs3, rs4, ia3, ia4, ui4, ds2, ds3, pr2, pr3, cw2, ax2].map(b => { const brief = BossBrief.parse(b); return [brief.chapterId, brief]; }),
);

export const getBoss = (chapterId: string): BossBrief | undefined => BOSSES[chapterId];
