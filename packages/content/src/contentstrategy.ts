// Content strategy at Taar, for chapter cw.3. Taar is a Pune fibre broadband company with about 3 lakh homes and a help
// centre in English, Hindi and Marathi that the website, the app, the IVR and the Taar Assist chatbot all draw from.
// Meera Kulkarni leads content strategy, Rohan is the content designer, Farah runs support operations and Aditya builds
// the help platform. Sunita Joshi, who works from home in Kothrud, is the customer the chapter keeps coming back to.
// This is the data the cw.3 scenes and games draw, and the rules they score against: where each piece of an old help
// page goes in a content model; what the quarterly audit does with each item; and what is wrong with an AI answer.

// ── Content models (cw.3-1, `model-build`) ─────────────────────────────────────────────────────────────────────────

/** Where a piece of an old help page goes in the content model (`model-build` lanes). `field`: a field of the Help
 *  article type. `type`: its own content type, referenced from every page that needs it. `tag`: a taxonomy value used
 *  to filter, route and find. `cut`: presentation, which belongs to each channel's design, not to the content. */
export const MODEL_PLACES = ['field', 'type', 'tag', 'cut'] as const;
export type ModelPlace = (typeof MODEL_PLACES)[number];

/** A piece of the old “Reset your Taar router” page, or something pasted into it. `look`: it describes how the page
 *  looks rather than what it says. `pages`: how many help pages carry a copy today. `ownLife`: it changes or expires on
 *  its own schedule, whatever the article does. `classifies`: it says what the article is about or who it's for, rather
 *  than being read as part of it. `as`: what it becomes in the model. */
export interface PageChunk { text: string; look: boolean; pages: number; ownLife: boolean; classifies: boolean; as: string }

/** Presentation is cut, whatever else is true. Anything copied onto more than one page, or with a life of its own, is
 *  its own type. Anything that describes the article is a tag. The rest is a field of the article. */
export const modelPlace = (c: PageChunk): ModelPlace =>
  c.look ? 'cut' : c.pages > 1 || c.ownLife ? 'type' : c.classifies ? 'tag' : 'field';

/** Edits a change to this chunk costs: one when it's its own type, else one per copy. */
export const editsFor = (c: PageChunk, modelled: boolean) => (modelled && modelPlace(c) === 'type' ? 1 : c.pages);

const CHUNKS = {
  title: { text: 'Reset your Taar router', look: false, pages: 1, ownLife: false, classifies: false, as: 'Field `title` · plain text, up to 60 characters, starts with a verb' },
  summary: { text: 'If your internet stops working, a reset fixes it in most homes in about 2 minutes.', look: false, pages: 1, ownLife: false, classifies: false, as: 'Field `summary` · plain text, up to 160 characters; search results and Taar Assist quote it' },
  steps: { text: '1. Hold the reset button for 10 seconds. 2. Wait for the light to turn green. 3. Reconnect your phone.', look: false, pages: 1, ownLife: false, classifies: false, as: 'Field `steps` · an ordered list, one action per step, each with an optional image' },
  plan: { text: 'Fibre 100 · 100 Mbps · unlimited data · ₹849 a month', look: false, pages: 23, ownLife: false, classifies: false, as: 'Type `Plan` · name, speed, data, price; articles reference it, so the price lives in one place' },
  device: { text: 'Taar Hub X2 router, with a photo of its ports and lights', look: false, pages: 41, ownLife: false, classifies: false, as: 'Type `Device` · model, photo, ports, what each light means; referenced by every article about it' },
  contact: { text: 'Still stuck? Call 1800 266 8277, 8 am to 10 pm, or chat with us', look: false, pages: 612, ownLife: false, classifies: false, as: 'Type `Contact option` · channel, number, hours; one change updates 612 pages' },
  outage: { text: 'Outage in Baner: engineers are fixing a cut cable, back by 6 pm', look: false, pages: 1, ownLife: true, classifies: false, as: 'Type `Outage notice` · area, cause, start, expected end; it expires on its own' },
  topic: { text: 'Topic: Internet not working', look: false, pages: 1, ownLife: false, classifies: true, as: 'Tag from the `Topic` taxonomy · drives navigation, search and Assist routing' },
  appliesTo: { text: 'Applies to: Fibre plans, not AirFiber', look: false, pages: 1, ownLife: false, classifies: true, as: 'Tag from `Service` · hides the article from AirFiber customers' },
  audience: { text: 'For: Home customers (Business has its own steps)', look: false, pages: 1, ownLife: false, classifies: true, as: 'Tag from `Customer` · Home or Business; the app shows only the customer’s own' },
  blueBox: { text: 'Shown in a blue box, bold, 18 px', look: true, pages: 1, ownLife: false, classifies: false, as: 'Cut · each channel styles a `tip` its own way; the IVR has no blue' },
  redButton: { text: '“Tap the red button below to restart”', look: true, pages: 1, ownLife: false, classifies: false, as: 'Cut · write “Select Restart router”, the label, not its colour or position' },
} as const satisfies Record<string, PageChunk>;
export type TaarChunk = keyof typeof CHUNKS;
export const TAAR_CHUNKS: Record<TaarChunk, PageChunk> = CHUNKS;

/** The channels that read the model (the scene's “one edit, everywhere”). */
export const TAAR_CHANNELS = ['Website', 'App', 'IVR', 'Taar Assist'] as const;

// ── Content governance (cw.3-2, `rot-audit`) ───────────────────────────────────────────────────────────────────────

/** What the quarterly audit does with an item (`rot-audit` lanes). */
export const AUDIT_CALLS = ['keep', 'refresh', 'merge', 'retire'] as const;
export type AuditCall = (typeof AUDIT_CALLS)[number];

/** Kinds of help content, each with its owner and how often it must be reviewed (days), by risk. Billing changes with
 *  every price change and costs money when wrong; policy pages change rarely but must stay true. */
export const CONTENT_KINDS = ['billing', 'account', 'troubleshoot', 'policy'] as const;
export type ContentKind = (typeof CONTENT_KINDS)[number];
export const REVIEW_DAYS: Record<ContentKind, number> = { billing: 90, account: 180, troubleshoot: 180, policy: 365 };
export const KIND_OWNER: Record<ContentKind, string> = { billing: 'Billing team', account: 'Customer accounts', troubleshoot: 'Network support', policy: 'Legal' };

/** Below this many views a month, an item that no rule requires is trivial. */
export const LOW_VIEWS = 50;

/** An item in the audit. `gone`: what it describes no longer exists (a plan, an offer, an outage that's over).
 *  `duplicateOf`: another item says the same thing. `required`: a rule or regulator needs it published. `redirect`:
 *  where its URL should send people if it goes. */
export interface AuditItem {
  text: string; kind: ContentKind; views: number; daysSinceReview: number;
  gone: boolean; duplicateOf?: string; required: boolean; redirect?: string;
}

/** Days until the item's review is due (negative: overdue). */
export const reviewDue = (i: AuditItem) => REVIEW_DAYS[i.kind] - i.daysSinceReview;

/** Redundant, outdated, trivial, in that order: something that is no longer true goes, whatever its traffic; a
 *  duplicate merges into the item it repeats; a page nobody reads and nothing requires goes; an overdue page that's
 *  still needed is refreshed by its owner. The rest stays. */
export const auditCall = (i: AuditItem): AuditCall =>
  i.gone ? 'retire' : i.duplicateOf ? 'merge' : i.views < LOW_VIEWS && !i.required ? 'retire' : reviewDue(i) < 0 ? 'refresh' : 'keep';

const ITEMS = {
  fibre50: { text: 'Fibre 50 plan: speeds and prices', kind: 'billing', views: 900, daysSinceReview: 260, gone: true, required: false, redirect: 'Compare our plans' },
  baner: { text: 'Outage in Baner on 14 March: engineers are on site', kind: 'troubleshoot', views: 140, daysSinceReview: 255, gone: true, required: false, redirect: 'Check for an outage in your area' },
  ontLights: { text: 'What the lights mean on the old white ONT box', kind: 'troubleshoot', views: 12, daysSinceReview: 300, gone: false, required: false, redirect: 'What the lights on your router mean' },
  wifiX1: { text: 'Change your Wi-Fi password (Hub X1)', kind: 'troubleshoot', views: 1900, daysSinceReview: 130, gone: false, duplicateOf: 'Change your Wi-Fi password', required: false, redirect: 'Change your Wi-Fi password' },
  upi: { text: 'Pay your bill by UPI', kind: 'billing', views: 3100, daysSinceReview: 40, gone: false, duplicateOf: 'Pay your bill by UPI, card or net banking', required: false, redirect: 'Pay your bill by UPI, card or net banking' },
  bill: { text: 'Understand your bill', kind: 'billing', views: 12000, daysSinceReview: 160, gone: false, required: false },
  fup: { text: 'Fair usage policy', kind: 'policy', views: 30, daysSinceReview: 420, gone: false, required: true },
  move: { text: 'Move your connection to a new flat', kind: 'account', views: 2600, daysSinceReview: 205, gone: false, required: false },
  reset: { text: 'Reset your Taar router', kind: 'troubleshoot', views: 18000, daysSinceReview: 40, gone: false, required: false },
  autopay: { text: 'Get a refund for a failed autopay', kind: 'billing', views: 4000, daysSinceReview: 30, gone: false, required: false },
  parental: { text: 'Set up parental controls (Marathi)', kind: 'troubleshoot', views: 700, daysSinceReview: 90, gone: false, required: false },
} as const satisfies Record<string, AuditItem>;
export type TaarAuditItem = keyof typeof ITEMS;
export const TAAR_AUDIT: Record<TaarAuditItem, AuditItem> = ITEMS;

/** The publishing workflow every change goes through, in order (the scene and lesson). */
export const TAAR_WORKFLOW = ['Draft', 'Expert check', 'Content check', 'Publish', 'Review on time'] as const;

// ── Writing for AI-generated UI (cw.3-3, `answer-crit`) ────────────────────────────────────────────────────────────

/** What is wrong with a Taar Assist answer (`answer-crit` lanes). `ship`: nothing. `invents`: it says something its
 *  sources don't. `tone`: it jokes when the customer is upset. `handoff`: it needed to offer a person and didn't. */
export const ANSWER_FLAWS = ['ship', 'invents', 'tone', 'handoff'] as const;
export type AnswerFlaw = (typeof ANSWER_FLAWS)[number];

/** One sentence of an answer, and the source fact it rests on (an index into `source`), or null when none does.
 *  `aside`: a greeting, apology or joke that claims nothing, so it needs no source. */
export interface AnswerLine { text: string; fact: number | null; aside?: boolean }

/** A Taar Assist answer. `source`: what the help content it retrieved says. `upset`: the customer is angry, worried or
 *  has lost money or time. `jokey`: the answer plays for a laugh. `needsPerson`: the case needs a person (a money
 *  dispute, a closure, a possible fraud). `offersPerson`: the answer gives a clear route to one. */
export interface AssistAnswer {
  question: string; lines: readonly AnswerLine[]; source: readonly string[];
  upset: boolean; jokey: boolean; needsPerson: boolean; offersPerson: boolean;
}

/** The claims no source supports. */
export const ungrounded = (a: AssistAnswer) => a.lines.filter(l => !l.aside && (l.fact === null || l.fact < 0 || l.fact >= a.source.length));

/** The worst flaw first: an invented claim misleads; a joke at a bad moment loses trust; a missing handoff leaves the
 *  customer stuck. An answer without any of them ships. */
export const answerFlaw = (a: AssistAnswer): AnswerFlaw =>
  ungrounded(a).length ? 'invents' : a.upset && a.jokey ? 'tone' : a.needsPerson && !a.offersPerson ? 'handoff' : 'ship';

const ANSWERS = {
  price: { question: 'How much is Fibre 100 now?',
    lines: [{ text: 'Fibre 100 is ₹849 a month, including GST.', fact: 0 }, { text: 'You get 100 Mbps with unlimited data.', fact: 1 }],
    source: ['Fibre 100: ₹849 a month including GST, from 1 November 2026.', 'Fibre 100: 100 Mbps, unlimited data.'],
    upset: false, jokey: false, needsPerson: false, offersPerson: false },
  credit: { question: 'Internet was down all day yesterday in Baner. Do I get money back?',
    lines: [{ text: 'Sorry, the Baner outage yesterday lasted 9 hours.', fact: 0 }, { text: 'We’ve added a ₹100 credit to your next bill.', fact: null }, { text: 'If you’d like to talk it through, tap Talk to a person.', fact: 2 }],
    source: ['Baner outage, 24 November: 9 hours, a cut cable.', 'Credits for outages over 4 hours are decided by the billing team within 7 days.', 'Billing questions: Talk to a person, 8 am to 10 pm.'],
    upset: true, jokey: false, needsPerson: true, offersPerson: true },
  gremlins: { question: 'My internet keeps dropping and I’m on a work call. Again.',
    lines: [{ text: 'Uh-oh, the internet gremlins are back! 🙈', fact: null, aside: true }, { text: 'Restart your router: hold the reset button for 10 seconds.', fact: 0 }, { text: 'Still dropping? Tap Talk to a person.', fact: 1 }],
    source: ['Reset: hold the reset button for 10 seconds; the light turns green in about 2 minutes.', 'If it drops again after a reset, a person can check your line.'],
    upset: true, jokey: true, needsPerson: false, offersPerson: true },
  close: { question: 'I want to close my account. We’re moving to Nagpur.',
    lines: [{ text: 'To close your account, return your router within 15 days.', fact: 0 }, { text: 'Your ₹1,000 deposit comes back to your bank account after the router reaches us.', fact: 1 }],
    source: ['Closing: return the router within 15 days.', 'Deposits are refunded to the bank account on file once the router is received.', 'Taar is not yet available in Nagpur.', 'Closures are confirmed by the accounts team: Talk to a person.'],
    upset: false, jokey: false, needsPerson: true, offersPerson: false },
  redLight: { question: 'There’s a red light on my router.',
    lines: [{ text: 'A red light means the router can’t reach our network.', fact: 0 }, { text: 'Check the green fibre cable is clicked in, then restart the router.', fact: 1 }, { text: 'If it stays red for 10 minutes, tap Talk to a person.', fact: 2 }],
    source: ['Red light: no connection to the Taar network.', 'First check the green fibre cable, then restart.', 'Red for more than 10 minutes: contact us.'],
    upset: false, jokey: false, needsPerson: false, offersPerson: true },
  staticIp: { question: 'Can I get a static IP?',
    lines: [{ text: 'Yes, static IPs are free on every Taar plan.', fact: null }, { text: 'Ask for one in the app under Plan add-ons.', fact: 1 }],
    source: ['Static IP: ₹200 a month, on Fibre 300 and above.', 'Add-ons are under Plan add-ons in the app.'],
    upset: false, jokey: false, needsPerson: false, offersPerson: false },
  failedPay: { question: 'My payment failed twice and the money was taken both times!',
    lines: [{ text: 'Oops, looks like your money went on a little holiday! 😅', fact: null, aside: true }, { text: 'Failed payments come back to your account in 5 to 7 working days.', fact: 0 }, { text: 'Tap Talk to a person and we’ll trace both payments now.', fact: 1 }],
    source: ['Failed payments are reversed by the bank in 5 to 7 working days.', 'Double charges: Talk to a person, who can trace the payment.'],
    upset: true, jokey: true, needsPerson: true, offersPerson: true },
  otp: { question: 'Someone from “Taar” is on the phone asking for my OTP. Is that you?',
    lines: [{ text: 'No. Taar never asks for your OTP, by phone or by message.', fact: 0 }, { text: 'Don’t share it.', fact: 0 }],
    source: ['Taar never asks for OTPs, passwords or card numbers.', 'Report suspected fraud: Talk to a person, or call 1800 266 8277.'],
    upset: true, jokey: false, needsPerson: true, offersPerson: false },
  hinjewadi: { question: 'When will fibre reach Hinjewadi Phase 3?',
    lines: [{ text: 'Fibre reaches Hinjewadi Phase 3 in January.', fact: null }, { text: 'Register your interest and we’ll tell you first.', fact: 1 }],
    source: ['Hinjewadi Phase 3: no date yet.', 'Register interest to hear when we arrive.'],
    upset: false, jokey: false, needsPerson: false, offersPerson: false },
  wifiPwd: { question: 'How do I change my Wi-Fi password?',
    lines: [{ text: 'In the app, go to My router, then Wi-Fi name and password.', fact: 0 }, { text: 'Your devices will need the new password to reconnect.', fact: 1 }],
    source: ['Change it in the app: My router › Wi-Fi name and password.', 'Every device must reconnect with the new password.'],
    upset: false, jokey: false, needsPerson: false, offersPerson: false },
  bill: { question: 'Why is my bill ₹1,200 more this month? This is ridiculous.',
    lines: [{ text: 'Whoa, big bill energy this month! 💸', fact: null, aside: true }, { text: 'Your plan changed on 1 November, so this bill has part of October at the old price and part at the new one.', fact: 0 }, { text: 'Tap Talk to a person to go through it line by line.', fact: 1 }],
    source: ['A plan change mid-cycle shows both prices, split by days, on the next bill.', 'Bill questions: Talk to a person, 8 am to 10 pm.'],
    upset: true, jokey: true, needsPerson: false, offersPerson: true },
} as const satisfies Record<string, AssistAnswer>;
export type TaarAnswer = keyof typeof ANSWERS;
export const TAAR_ANSWERS: Record<TaarAnswer, AssistAnswer> = ANSWERS;

/** The fixed words around every Taar Assist answer (the scene's “words around the AI”). */
export const ASSIST_FRAME = ['Answer by Taar Assist · AI', 'From: the help article it used', 'Talk to a person', 'Was this right?'] as const;
