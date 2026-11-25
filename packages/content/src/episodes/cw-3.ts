// Episodes for chapter cw.3 · Content strategy. Drafts by Claude, for review.
// Taar is a Pune fibre broadband company with about 3 lakh homes. Its help centre, in English, Hindi and Marathi, feeds
// the website, the app, the IVR and Taar Assist, an AI chatbot. Meera Kulkarni leads content strategy, Rohan is the
// content designer, Farah runs support operations and Aditya builds the help platform. Sunita Joshi works from home in
// Kothrud. cw.1 and cw.2 were about writing strings, voice and tone; this chapter is about the system the words live in:
// the model, the rules that keep it true, and the AI that now writes from it. Data and rules: ../contentstrategy.
import type { Episode } from '../episode';
import {
  TAAR_ANSWERS, TAAR_AUDIT, TAAR_CHUNKS, answerFlaw, auditCall, modelPlace,
  type TaarAnswer, type TaarAuditItem, type TaarChunk,
} from '../contentstrategy';

const chunk = (k: TaarChunk) => TAAR_CHUNKS[k].text;
const place = (k: TaarChunk) => modelPlace(TAAR_CHUNKS[k]);
const item = (k: TaarAuditItem) => TAAR_AUDIT[k].text;
const call = (k: TaarAuditItem) => auditCall(TAAR_AUDIT[k]);
const answer = (k: TaarAnswer) => TAAR_ANSWERS[k].question;
const flaw = (k: TaarAnswer) => answerFlaw(TAAR_ANSWERS[k]);

export const cw3_1: Episode = {
  lessonId: 'cw.3-1',
  hook: 'Taar raised Fibre 100 from ₹799 to ₹849. The price lived inside 23 help pages; Rohan fixed 19. Watch one page come apart into a model where the price lives once.',
  scene: {
    id: 'content-model', duration: 36,
    beats: [
      { at: 0, title: 'One price, 23 pages', body: '₹799 becomes ₹849. Rohan edits page after page by hand. Four are missed, and Taar Assist reads one of them.' },
      { at: 6, title: 'Pull the page apart', body: 'The “Reset your router” page is a blob of rich text. Inside it: a title, a summary, steps, a plan box, a router, a phone number.' },
      { at: 11, title: 'Fields with rules', body: '`title`, up to 60 characters. `summary`, up to 160, because search and Assist quote it. `steps`, one action each.' },
      { at: 16, title: 'Shared things get a type', body: 'Plan, Device, Contact option, Outage notice. The article references them instead of copying them.' },
      { at: 21, title: 'Tags, not folders', body: 'Topic, Service and Customer, from controlled lists. One article, found from every route.' },
      { at: 26, title: 'Leave the look out', body: 'A blue box, two columns, “the red button below”. That’s each channel’s design. The IVR has no blue.' },
      { at: 31, title: 'One edit, everywhere', body: 'Change the Plan once. The website, the app, the IVR and Taar Assist all say ₹849.' },
    ],
  },
  check: [
    { id: 'c1', prompt: 'Why did four pages keep the old price?', options: [{ id: 'a', label: 'Rohan was careless' }, { id: 'b', label: 'The price was copied into every page, so each copy had to be found and changed by hand' }, { id: 'c', label: 'The CMS was slow' }],
      correct: 'b', explanation: 'Copies drift. A reference can’t.' },
    { id: 'c2', prompt: 'What makes a piece its own content type?', options: [{ id: 'a', label: 'It’s long' }, { id: 'b', label: 'It appears in more than one place or changes on its own schedule' }, { id: 'c', label: 'It has a picture' }],
      correct: 'b', explanation: 'Reuse and a life of its own are the tests.' },
  ],
  game: {
    id: 'model-build', title: 'Build the model',
    instructions: 'Each card is a piece of Taar’s old “Reset your router” page. Make it a field of the article, its own type, a tag, or cut it as presentation. Right calls build the model beside you, and shared types show how many edits they save.',
    lanes: [
      { id: 'field', label: 'Field', hint: 'Part of this article only' },
      { id: 'type', label: 'Own type', hint: 'Shared, or has its own life' },
      { id: 'tag', label: 'Tag', hint: 'What it’s about, who it’s for' },
      { id: 'cut', label: 'Cut', hint: 'How it looks, not what it says' },
    ],
    cards: [
      { id: 'g1', label: chunk('plan'), lane: place('plan'), visual: 'plan', note: 'Copied onto 23 pages, so the price drifted. As a Plan type, articles reference it and the price changes once.' },
      { id: 'g2', label: chunk('title'), lane: place('title'), visual: 'title', note: 'Unique to the article. A field with rules: plain text, up to 60 characters, starting with what the reader wants to do.' },
      { id: 'g3', label: chunk('blueBox'), lane: place('blueBox'), visual: 'blueBox', note: 'That’s styling. Model it as a `tip` field and let each channel draw it: a box on the web, a banner in the app, a pause on the IVR.' },
      { id: 'g4', label: chunk('topic'), lane: place('topic'), visual: 'topic', note: 'It says what the article is about. A tag from a controlled Topic list drives navigation, search and Assist’s routing.' },
      { id: 'g5', label: chunk('contact'), lane: place('contact'), visual: 'contact', note: 'On 612 pages. When the hours change, one Contact option updates all of them.' },
      { id: 'g6', label: chunk('summary'), lane: place('summary'), visual: 'summary', note: 'A field of the article, capped at 160 characters, because search results and Taar Assist quote it word for word.' },
      { id: 'g7', label: chunk('outage'), lane: place('outage'), visual: 'outage', note: 'It appears once, but it starts and ends on its own. An Outage notice type with an end time expires by itself.' },
      { id: 'g8', label: chunk('appliesTo'), lane: place('appliesTo'), visual: 'appliesTo', note: 'A Service tag. AirFiber customers never see steps for a fibre router.' },
      { id: 'g9', label: chunk('device'), lane: place('device'), visual: 'device', note: 'The Hub X2 is described on 41 pages. One Device entry, with its photo and lights, referenced by each.' },
      { id: 'g10', label: chunk('redButton'), lane: place('redButton'), visual: 'redButton', note: 'Colour and position mean nothing on the IVR or to a screen reader. Write the label: “Select Restart router”.' },
      { id: 'g11', label: chunk('steps'), lane: place('steps'), visual: 'steps', note: 'An ordered list of steps, one action each. The IVR reads them one at a time; Assist can quote one.' },
      { id: 'g12', label: chunk('audience'), lane: place('audience'), visual: 'audience', note: 'A Customer tag, Home or Business. The app shows each customer only their own steps.' },
    ],
  },
  gap: {
    id: 'gap', from: 0, at: 5.6,
    prompt: 'Four pages still say ₹799, and Taar Assist is quoting one. Prices change again in April. What does Meera do?',
    options: [{ id: 'a', label: 'Search harder for copies next time' }, { id: 'b', label: 'Model the plan as its own type that articles reference, so the price lives in one place' }, { id: 'c', label: 'Stop putting prices in help articles' }],
    correct: 'b', explanation: 'Fix the structure, not the search.',
  },
  takeaways: [
    { title: 'Types, fields, references', body: 'Describe content as kinds of things with fields and links between them, not as pages.' },
    { title: 'Reuse is a type', body: 'Anything on more than one page, or with its own life, gets its own type and is referenced, never copied.' },
    { title: 'Tags from controlled lists', body: 'Topic, service and customer tags let one item appear wherever it fits.' },
    { title: 'Meaning, not looks', body: 'Leave presentation to each channel. The IVR and the AI can’t read a blue box.' },
  ],
  quiz: {
    seconds: 15,
    questions: [
      { id: 'q1', prompt: 'A plan’s price on 23 pages should be…', options: [{ id: 'a', label: 'Its own type, referenced' }, { id: 'b', label: 'A field in each article' }, { id: 'c', label: 'A tag' }], correct: 'a', explanation: 'One source, many references.' },
      { id: 'q2', prompt: '“Shown in a blue box” is…', options: [{ id: 'a', label: 'A field' }, { id: 'b', label: 'Presentation, so cut' }, { id: 'c', label: 'A type' }], correct: 'b', explanation: 'Each channel styles it.' },
      { id: 'q3', prompt: '“Topic: Internet not working” is…', options: [{ id: 'a', label: 'A tag' }, { id: 'b', label: 'The title' }, { id: 'c', label: 'A type' }], correct: 'a', explanation: 'It classifies the article.' },
      { id: 'q4', prompt: 'Why cap the summary at 160 characters?', options: [{ id: 'a', label: 'Style' }, { id: 'b', label: 'Search results and Assist quote it' }, { id: 'c', label: 'The CMS limit' }], correct: 'b', explanation: 'A field’s rules come from where it is used.' },
    ],
  },
  ladder: [
    { id: 'l1', prompt: 'The Outage notice for Baner appears on just one page. Why is it still its own type?', hint: 'When does it stop being true?', options: [{ id: 'a', label: 'It isn’t; it’s a field' }, { id: 'b', label: 'It has its own life: a start, an expected end and an area, so it can expire and show wherever that area is affected' }, { id: 'c', label: 'Outages are important' }, { id: 'd', label: 'It has a map' }], correct: 'b', explanation: 'A separate lifecycle is as good a reason as reuse.' },
    { id: 'l2', prompt: 'Aditya proposes one type, “Page”, with a single rich-text `body`. What does Taar lose?', hint: 'What can the IVR and Assist read?', options: [{ id: 'a', label: 'Nothing; it’s flexible' }, { id: 'b', label: 'Reuse, rules and every channel that isn’t a web page: no references, no field limits, nothing the voice line or Assist can pick apart' }, { id: 'c', label: 'Only search ranking' }, { id: 'd', label: 'The ability to add images' }], correct: 'b', explanation: 'A blob is a page with a database behind it.' },
    { id: 'l3', prompt: 'The Device type has 30 optional fields. Writers fill a different five each time. What does that suggest?', hint: 'Is it one thing?', options: [{ id: 'a', label: 'Make them all required' }, { id: 'b', label: 'It’s really several types, or the fields were designed from guesses; model from real devices and keep only fields every entry needs or a channel uses' }, { id: 'c', label: 'Train the writers' }, { id: 'd', label: 'Add more fields' }], correct: 'b', explanation: 'A model should match the content, not every possibility.' },
    { id: 'l4', prompt: 'Marathi and Hindi articles are separate items linked by hand. Halfway through a price change, the Marathi plan box still shows ₹799. What should the model do?', hint: 'What is translated and what isn’t?', options: [{ id: 'a', label: 'Add a reminder' }, { id: 'b', label: 'Localise fields, not items: one Plan with translated name fields and one price, so a price change reaches every language at once' }, { id: 'c', label: 'Drop Marathi' }, { id: 'd', label: 'Hire another writer' }], correct: 'b', explanation: 'Facts stay single; words get translated.' },
    { id: 'l5', prompt: 'How should Meera know the model works before migrating 640 items?', hint: 'Who reads it?', options: [{ id: 'a', label: 'Get sign-off on the diagram' }, { id: 'b', label: 'Rebuild twenty real, awkward articles in it and render each on the website, the app, the IVR and Assist' }, { id: 'c', label: 'Migrate everything and fix later' }, { id: 'd', label: 'Ask the CMS vendor' }], correct: 'b', explanation: 'Test a model with real content and real channels.' },
  ],
};

export const cw3_2: Episode = {
  lessonId: 'cw.3-2',
  hook: 'In November, Taar’s home page still warned of a March outage in Baner, and the Fibre 50 page outlived the plan by eight months. Nobody owned either. Watch 640 items get owners, dates and a way out.',
  scene: {
    id: 'content-lifecycle', duration: 36,
    beats: [
      { at: 0, title: '640 items, no owners', body: 'A plan that ended in March. Two sets of Wi-Fi steps that disagree. A March outage still on the home page.' },
      { at: 6, title: 'Every type has an owner', body: 'Billing owns plans and payments. Network support owns troubleshooting. Legal owns policy. Content design owns the writing.' },
      { at: 11, title: 'Review by risk', body: 'Billing every 90 days. Troubleshooting every 180. Policy once a year. Outage notices end with the outage.' },
      { at: 16, title: 'One workflow', body: 'Draft, an expert check by the owner, a content check, publish, and the next review date set automatically.' },
      { at: 21, title: 'Audit with data', body: 'Every quarter: views, searches that ended there, and contacts after reading. One question at a time.' },
      { at: 26, title: 'Keep, refresh, merge, retire', body: 'Untrue goes. Duplicates merge. Unread and unrequired goes. Overdue gets refreshed by its owner.' },
      { at: 31, title: 'Retire with a redirect', body: 'Fibre 50 points to “Compare our plans”. 640 items become 410, every one with an owner and a date.' },
    ],
  },
  check: [
    { id: 'c1', prompt: 'Why did the March outage notice survive until November?', options: [{ id: 'a', label: 'It was badly written' }, { id: 'b', label: 'No one owned it and nothing made it expire' }, { id: 'c', label: 'People still read it' }],
      correct: 'b', explanation: 'Governance problems look like writing problems.' },
    { id: 'c2', prompt: 'How should review dates be set?', options: [{ id: 'a', label: 'Every item, once a year' }, { id: 'b', label: 'By risk: content that costs money when wrong is reviewed most often' }, { id: 'c', label: 'When someone complains' }],
      correct: 'b', explanation: 'Billing every 90 days, policy once a year.' },
  ],
  game: {
    id: 'rot-audit', title: 'Run the audit',
    instructions: 'It’s Taar’s quarterly content audit. For each item, keep it, send it to its owner to refresh, merge it into the item it repeats, or retire it. Ask in order: is it true? Is it a duplicate? Does anyone need it? Is it overdue? The help centre’s health updates as you go.',
    lanes: [
      { id: 'keep', label: 'Keep', hint: 'True, needed, on time' },
      { id: 'refresh', label: 'Refresh', hint: 'Needed but overdue' },
      { id: 'merge', label: 'Merge', hint: 'Says what another says' },
      { id: 'retire', label: 'Retire', hint: 'Untrue, or nobody needs it' },
    ],
    cards: [
      { id: 'g1', label: item('fibre50'), lane: call('fibre50'), visual: 'fibre50', note: 'The plan ended in March. 900 visits a month don’t make it true. Redirect the URL to “Compare our plans”.' },
      { id: 'g2', label: item('bill'), lane: call('bill'), visual: 'bill', note: '12,000 views a month and 70 days past its 90-day review, through a price change. Billing rechecks it this week.' },
      { id: 'g3', label: item('wifiX1'), lane: call('wifiX1'), visual: 'wifiX1', note: 'It repeats the main Wi-Fi article with different steps. Merge the Hub X1 steps in as a variant, and redirect.' },
      { id: 'g4', label: item('reset'), lane: call('reset'), visual: 'reset', note: 'Taar’s most-read article, checked 40 days ago. Leave it alone; its next review comes round on its own.' },
      { id: 'g5', label: item('fup'), lane: call('fup'), visual: 'fup', note: 'Hardly anyone reads it, but the licence requires it. It’s over a year since Legal looked, so Legal refreshes it.' },
      { id: 'g6', label: item('baner'), lane: call('baner'), visual: 'baner', note: 'The outage ended in March. Retire it, and make Outage notices expire at their end time so this can’t recur.' },
      { id: 'g7', label: item('upi'), lane: call('upi'), visual: 'upi', note: 'A narrower copy of the payments article. Merge, and redirect its 3,100 monthly visitors there.' },
      { id: 'g8', label: item('ontLights'), lane: call('ontLights'), visual: 'ontLights', note: '12 views a month and no rule needs it. Retire it, redirecting to the current router lights page.' },
      { id: 'g9', label: item('move'), lane: call('move'), visual: 'move', note: 'Still needed, 25 days past its 180-day review. Customer accounts checks the steps and the fees.' },
      { id: 'g10', label: item('autopay'), lane: call('autopay'), visual: 'autopay', note: 'Billing reviewed it a month ago. Keep, with its next review in 60 days.' },
      { id: 'g11', label: item('parental'), lane: call('parental'), visual: 'parental', note: 'True, read, and halfway to its review date. The Marathi version is as good as the English. Keep.' },
    ],
  },
  gap: {
    id: 'gap', from: 0, at: 5.6,
    prompt: 'Meera finds the March outage notice still live in November. What does she fix first?',
    options: [{ id: 'a', label: 'Take that notice down and move on' }, { id: 'b', label: 'Give every type an owner and a review or expiry rule, so stale items are caught by the system' }, { id: 'c', label: 'Rewrite the home page' }],
    correct: 'b', explanation: 'One stale item is a symptom. The missing rules are the cause.',
  },
  takeaways: [
    { title: 'Owners answer for truth', body: 'Each content type has an owner team. Content design owns the writing, not the refund rule.' },
    { title: 'Review by risk', body: 'Money content often, policy yearly, time-bound content expires by itself.' },
    { title: 'One workflow', body: 'Draft, expert check, content check, publish, next review date. Every change, every time.' },
    { title: 'Retire on purpose', body: 'Audit quarterly with data; merge duplicates; retire with redirects and remove from the AI’s index.' },
  ],
  quiz: {
    seconds: 15,
    questions: [
      { id: 'q1', prompt: 'A page for a plan that ended, with high traffic:', options: [{ id: 'a', label: 'Keep' }, { id: 'b', label: 'Retire and redirect' }, { id: 'c', label: 'Refresh' }], correct: 'b', explanation: 'Untrue goes, whatever its traffic.' },
      { id: 'q2', prompt: 'Two articles, same task, different steps:', options: [{ id: 'a', label: 'Merge' }, { id: 'b', label: 'Keep both' }, { id: 'c', label: 'Retire both' }], correct: 'a', explanation: 'One item, one set of steps.' },
      { id: 'q3', prompt: 'Who confirms a refund rule is right?', options: [{ id: 'a', label: 'The content designer' }, { id: 'b', label: 'The billing team that owns it' }, { id: 'c', label: 'The writer' }], correct: 'b', explanation: 'Owners answer for truth.' },
      { id: 'q4', prompt: 'A required policy page with 30 views, overdue:', options: [{ id: 'a', label: 'Retire' }, { id: 'b', label: 'Refresh' }, { id: 'c', label: 'Keep' }], correct: 'b', explanation: 'Required means it stays, and stays true.' },
    ],
  },
  ladder: [
    { id: 'l1', prompt: 'Why redirect a retired URL rather than delete it?', hint: 'Who still has the old link?', options: [{ id: 'a', label: 'It’s faster' }, { id: 'b', label: 'Search results, bookmarks, old emails and other articles still link to it; a redirect sends those people somewhere true' }, { id: 'c', label: 'Deleting is illegal' }, { id: 'd', label: 'It keeps the page count up' }], correct: 'b', explanation: 'Retiring is a move, not a hole.' },
    { id: 'l2', prompt: 'Network support never meets its review dates. 80 troubleshooting articles are overdue. What is the strongest fix?', hint: 'Is the cadence the problem, or the capacity?', options: [{ id: 'a', label: 'Mark them all reviewed' }, { id: 'b', label: 'Agree a named reviewer and time each month, cut what nobody reads, and set cadence by each article’s risk rather than one rule for all' }, { id: 'c', label: 'Move them to content design' }, { id: 'd', label: 'Stop reviewing' }], correct: 'b', explanation: 'Governance has to fit the people who run it.' },
    { id: 'l3', prompt: 'An article has 8,000 views a month and most readers contact support straight after. What does that tell Meera?', hint: 'Views measure arrival, not success.', options: [{ id: 'a', label: 'It’s a great article' }, { id: 'b', label: 'People find it but it doesn’t solve their problem; refresh it with support’s top reasons for those contacts' }, { id: 'c', label: 'Retire it' }, { id: 'd', label: 'Nothing' }], correct: 'b', explanation: 'Contact after reading is the sharper signal.' },
    { id: 'l4', prompt: 'A retired Fibre 50 page is gone from the website. Taar Assist still quotes it. What was missed?', hint: 'How many places read the content?', options: [{ id: 'a', label: 'Nothing; Assist will forget' }, { id: 'b', label: 'Retiring must also remove the item from the index Assist retrieves from; every reader of the content is part of the workflow' }, { id: 'c', label: 'A new chatbot' }, { id: 'd', label: 'A disclaimer' }], correct: 'b', explanation: 'Unpublish everywhere it’s read.' },
    { id: 'l5', prompt: 'Farah’s support agents want to publish fixes straight away during an outage, without the workflow. What should governance allow?', hint: 'Speed and safety can both be designed.', options: [{ id: 'a', label: 'Never; the workflow is the workflow' }, { id: 'b', label: 'A fast lane for Outage notices only: agents publish from a template with an end time, and the owner reviews within the hour' }, { id: 'c', label: 'Anyone can publish anything' }, { id: 'd', label: 'Email customers instead' }], correct: 'b', explanation: 'Match the workflow to the risk and the urgency.' },
  ],
};

export const cw3_3: Episode = {
  lessonId: 'cw.3-3',
  hook: 'Taar Assist told Sunita her plan was ₹799 and that a ₹100 outage credit was on its way. Neither was true. Watch Meera stop editing answers and start writing what they are made from.',
  scene: {
    id: 'grounded-answer', duration: 36,
    beats: [
      { at: 0, title: 'Assist said ₹799', body: 'And “We’ve added a ₹100 credit to your next bill.” Sunita screenshots both and posts them.' },
      { at: 6, title: 'It writes from your content', body: 'Assist retrieves articles, then generates. A stale page gave it ₹799. Nothing at all gave it the credit.' },
      { at: 11, title: 'Write the instructions', body: 'Voice in concrete rules. Never promise a credit, a date or a refund no source states. Hand off for money, closures and fraud.' },
      { at: 16, title: 'The words around it', body: '“Answer by Taar Assist · AI”. The article it used. Talk to a person, always. “Was this right?”' },
      { at: 21, title: 'Critique the range', body: '120 real questions from support logs: the routine, the angry, the risky, the unanswerable.' },
      { at: 26, title: 'Worst flaw first', body: 'Is every claim in a source? Is the tone right for the moment? Does it hand off when it should?' },
      { at: 31, title: 'Fix the cause', body: 'Update the stale page. Add the missing rule. Run the set again. The next answer to Sunita is right.' },
    ],
  },
  check: [
    { id: 'c1', prompt: 'Where did the ₹100 credit come from?', options: [{ id: 'a', label: 'A stale page' }, { id: 'b', label: 'Nowhere: no source said it, and the model filled the gap' }, { id: 'c', label: 'The billing team' }],
      correct: 'b', explanation: 'An invented claim needs an instruction, not a page fix.' },
    { id: 'c2', prompt: 'What do content designers write for an AI feature?', options: [{ id: 'a', label: 'Every answer' }, { id: 'b', label: 'The sources, the instructions, the fixed words around answers and the rubric' }, { id: 'c', label: 'Nothing; the model writes it' }],
      correct: 'b', explanation: 'You write what the answers are made from.' },
  ],
  game: {
    id: 'answer-crit', title: 'Crit the answers',
    instructions: 'Each card is a real question and Taar Assist’s answer, with the sources it retrieved. Ship it, or name its worst flaw: a claim no source supports, the wrong tone for the moment, or a missing handoff to a person. Right calls mark every sentence against its source.',
    lanes: [
      { id: 'ship', label: 'Ship', hint: 'Grounded, right tone, right route' },
      { id: 'invents', label: 'Invents', hint: 'Says what no source says' },
      { id: 'tone', label: 'Tone', hint: 'Jokes at an upset customer' },
      { id: 'handoff', label: 'Handoff', hint: 'Needed a person, gave none' },
    ],
    cards: [
      { id: 'g1', label: answer('credit'), lane: flaw('credit'), visual: 'credit', note: 'Billing decides credits within 7 days; nothing says ₹100 is added. Instruction: never promise a credit, refund or date that no source states. Say who decides and when.' },
      { id: 'g2', label: answer('price'), lane: flaw('price'), visual: 'price', note: 'Both sentences come from the current Plan entry. Short, exact, nothing added. Ship.' },
      { id: 'g3', label: answer('gremlins'), lane: flaw('gremlins'), visual: 'gremlins', note: 'The steps are right and the handoff is there, but this is the third drop on a work call. Drop the joke: “Sorry, that’s frustrating mid-call.”' },
      { id: 'g4', label: answer('close'), lane: flaw('close'), visual: 'close', note: 'Everything it says is true, but closures are confirmed by the accounts team. Add “Tap Talk to a person to confirm the closure” and a handoff rule for closures.' },
      { id: 'g5', label: answer('staticIp'), lane: flaw('staticIp'), visual: 'staticIp', note: 'The source says ₹200 a month on Fibre 300 and above. “Free on every plan” came from nowhere.' },
      { id: 'g6', label: answer('redLight'), lane: flaw('redLight'), visual: 'redLight', note: 'Every step is in the Device entry, in order, with a clear point to call. Ship.' },
      { id: 'g7', label: answer('failedPay'), lane: flaw('failedPay'), visual: 'failedPay', note: 'Grounded and it hands off, but money was taken twice. No jokes when someone has lost money: “Sorry. Both payments will come back in 5 to 7 working days.”' },
      { id: 'g8', label: answer('otp'), lane: flaw('otp'), visual: 'otp', note: 'Right that Taar never asks for an OTP, but a possible fraud needs a route to report it now. Add the fraud line and Talk to a person.' },
      { id: 'g9', label: answer('hinjewadi'), lane: flaw('hinjewadi'), visual: 'hinjewadi', note: 'The source has no date. Assist made one up. “We don’t have a date yet. Register your interest and we’ll tell you first.”' },
      { id: 'g10', label: answer('bill'), lane: flaw('bill'), visual: 'bill', note: 'The explanation is grounded and the handoff is there. “Big bill energy” at someone calling it ridiculous is not. Start with the reason.' },
      { id: 'g11', label: answer('wifiPwd'), lane: flaw('wifiPwd'), visual: 'wifiPwd', note: 'Grounded, routine and complete. Ship.' },
    ],
  },
  gap: {
    id: 'gap', from: 6, at: 10.6,
    prompt: 'Meera has found why Assist said ₹799 and invented the credit. What does she change?',
    options: [{ id: 'a', label: 'Edit both answers by hand' }, { id: 'b', label: 'Fix the stale page, and add an instruction never to promise credits no source states' }, { id: 'c', label: 'Turn Assist off' }],
    correct: 'b', explanation: 'Two failures, two causes, two fixes at the source.',
  },
  takeaways: [
    { title: 'Write the sources', body: 'Structured, current, single-sourced content is what keeps generated answers true.' },
    { title: 'Write the instructions', body: 'Voice as concrete rules, what must never be promised, when to hand off, and how to say “I don’t know”.' },
    { title: 'Write the frame', body: 'Label AI answers, show the source, keep a person one tap away, ask if it was right.' },
    { title: 'Critique at scale', body: 'A test set of real questions, a rubric read worst flaw first, and fixes made at the cause.' },
  ],
  quiz: {
    seconds: 15,
    questions: [
      { id: 'q1', prompt: '“Static IPs are free” when the source says ₹200:', options: [{ id: 'a', label: 'Invents' }, { id: 'b', label: 'Tone' }, { id: 'c', label: 'Ship' }], correct: 'a', explanation: 'No source supports it.' },
      { id: 'q2', prompt: 'A joke for someone charged twice:', options: [{ id: 'a', label: 'Tone' }, { id: 'b', label: 'Ship' }, { id: 'c', label: 'Invents' }], correct: 'a', explanation: 'Match the moment.' },
      { id: 'q3', prompt: 'A possible fraud call, with no way to report it:', options: [{ id: 'a', label: 'Ship' }, { id: 'b', label: 'Handoff' }, { id: 'c', label: 'Tone' }], correct: 'b', explanation: 'Some cases need a person.' },
      { id: 'q4', prompt: 'Assist gets a fact wrong because a page is stale. Fix…', options: [{ id: 'a', label: 'The answer' }, { id: 'b', label: 'The page' }, { id: 'c', label: 'The model' }], correct: 'b', explanation: 'Fix the cause, at the source.' },
    ],
  },
  ladder: [
    { id: 'l1', prompt: 'Why read answers worst flaw first?', hint: 'Which failure costs most?', options: [{ id: 'a', label: 'It’s alphabetical' }, { id: 'b', label: 'An invented claim misleads even if the tone is perfect; checking it first stops a polished answer hiding a false one' }, { id: 'c', label: 'Tone is unimportant' }, { id: 'd', label: 'It’s faster' }], correct: 'b', explanation: 'Truth, then tone, then route.' },
    { id: 'l2', prompt: 'Rohan writes the instruction “Be friendly and helpful.” Why is that weak?', hint: 'Could two people disagree on what it means?', options: [{ id: 'a', label: 'It’s too short' }, { id: 'b', label: 'It can’t be checked; concrete rules (“no jokes when the customer has lost money or time”, “lead with the answer”) can be tested against outputs' }, { id: 'c', label: 'Models ignore adjectives' }, { id: 'd', label: 'It should be in capitals' }], correct: 'b', explanation: 'Write instructions you could grade an answer against.' },
    { id: 'l3', prompt: 'After a fix, the Hinjewadi answer is right. Meera reruns all 120 questions anyway. Why?', hint: 'What else did the change touch?', options: [{ id: 'a', label: 'Habit' }, { id: 'b', label: 'A new instruction can change other answers, sometimes for the worse; the whole set catches regressions' }, { id: 'c', label: 'To get a bigger number' }, { id: 'd', label: 'The model forgets' }], correct: 'b', explanation: 'Treat the test set like a regression suite.' },
    { id: 'l4', prompt: 'The “Was this right?” button gets 2% use. What should Meera do with it?', hint: 'Who sees a wrong answer first?', options: [{ id: 'a', label: 'Remove it' }, { id: 'b', label: 'Keep it, and also sample answers weekly with support, because 2% is skewed towards the angriest; add the worst to the test set' }, { id: 'c', label: 'Make it a pop-up' }, { id: 'd', label: 'Trust the 2%' }], correct: 'b', explanation: 'Feedback is a signal, not a sample.' },
    { id: 'l5', prompt: 'Product wants Assist to stop showing which article it used, “so it feels smarter”. What’s Meera’s case?', hint: 'How does a customer check an answer?', options: [{ id: 'a', label: 'Agree; it does look cleaner' }, { id: 'b', label: 'The source is how customers and support check an answer, and how the team traces a wrong one to its cause; hiding it trades trust for polish' }, { id: 'c', label: 'Show the source only in English' }, { id: 'd', label: 'Show the model’s name instead' }], correct: 'b', explanation: 'Show your working.' },
  ],
};
