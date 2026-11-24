// Episodes for chapter fd.3 · Critique & feedback. Drafts by Claude, for review.
import type { Episode } from '../episode';

export const fd3_1: Episode = {
  lessonId: 'fd.3-1',
  hook: 'Four people review the same screen. Two say “make it pop”. Which comments can the designer actually use?',
  scene: {
    id: 'taste-reason', duration: 34,
    beats: [
      { at: 0, title: 'A screen up for review', body: 'Kosh, a payments app. Ananya shares the new home screen and the comments start.' },
      { at: 5, title: 'Taste', body: '“I don’t love the purple.” “Make it pop.” “Feels a bit off.” Strong opinions, nothing to act on.' },
      { at: 11, title: 'Ask why', body: 'Put each comment through one question: “What makes you say that?” Some turn into reasons. Some were only preference.' },
      { at: 16, title: 'Reasoning lands on the screen', body: 'Each reasoned comment points at something real: the balance, the buttons, the fee, and what it does to the person using it.' },
      { at: 23, title: 'See, effect, goal', body: 'What I see, what it does to the user, which goal it hurts. Three parts, every time.' },
      { at: 29, title: 'Taste is data about you', body: 'Keep it if you like, but label it. Reasoning is what moves a design forward.' },
    ],
  },
  check: [
    { id: 'c1', prompt: 'Why couldn’t Ananya act on “Make it pop”?', options: [{ id: 'a', label: 'It names no element, no user and no goal' }, { id: 'b', label: 'It was too long' }, { id: 'c', label: 'It came from a PM' }],
      correct: 'a', explanation: 'There’s nothing in it to change on purpose.' },
    { id: 'c2', prompt: 'What turns taste into something useful?', options: [{ id: 'a', label: 'Saying it louder' }, { id: 'b', label: 'Asking “What makes you say that?”' }, { id: 'c', label: 'A vote' }],
      correct: 'b', explanation: 'The question finds the reason, if there is one.' },
  ],
  game: {
    id: 'taste-filter', title: 'Taste or reason?',
    instructions: 'The Kosh home screen is up for review. Each comment points at part of it. Is it just taste, or reasoning the designer can act on? Reasons pin to the screen; taste goes to the “Ask why” tray.',
    lanes: [
      { id: 'taste', label: 'Just taste', hint: 'A preference with no why' },
      { id: 'reason', label: 'Reasoned', hint: 'What it does to users, and the goal' },
    ],
    cards: [
      { id: 'g1', label: '“I’m not a fan of this purple banner.”', visual: 'banner', lane: 'taste', note: 'Ask: “What is the banner competing with?” That leads to the real issue: it outshouts the balance.' },
      { id: 'g2', label: '“The cashback banner is bigger than the balance, but people open Kosh mostly to check their balance.”', visual: 'banner', lane: 'reason', note: 'What they see, the effect on users, and the goal it hurts. Easy to act on.' },
      { id: 'g3', label: '“Make the buttons pop more.”', visual: 'actions', lane: 'taste', note: 'Ask: “Pop compared with what? Which one should people tap first?”' },
      { id: 'g4', label: '“Pay and Request look identical. At a shop counter, one wrong tap sends a request instead of money.”', visual: 'actions', lane: 'reason', note: 'A real situation, a real mistake, and what it costs the user.' },
      { id: 'g5', label: '“The ₹10 fee is in 11px light grey. On a budget phone in sunlight, people will miss it.”', visual: 'fee', lane: 'reason', note: 'Names the size, the conditions and the risk: a charge nobody noticed.' },
      { id: 'g6', label: '“Honestly, it feels a bit off.”', visual: 'balance', lane: 'taste', note: 'Ask: “Off where? What did your eye land on first?”' },
      { id: 'g7', label: '“Round the corners on the list more. I just like them softer.”', visual: 'history', lane: 'taste', note: 'Stated as preference, so label it as one. Ask whether it changes anything for the user.' },
      { id: 'g8', label: '“Recent payments show UPI IDs, not names, so people can’t tell who they paid.”', visual: 'history', lane: 'reason', note: 'Ties what’s shown to a task people really do: checking who got their money.' },
      { id: 'g9', label: '“Another app uses a bottom sheet for this, so we should too.”', visual: 'actions', lane: 'taste', note: 'Borrowed taste. Ask: “What problem does the bottom sheet solve for our users?”' },
      { id: 'g10', label: '“The balance shows ₹12,450.5. Without the second decimal, it looks like a mistake.”', visual: 'balance', lane: 'reason', note: 'A specific detail that costs trust where it matters most: money.' },
    ],
  },
  gap: {
    id: 'gap', from: 11, at: 15.6,
    prompt: 'Rahul says “Make it pop.” What’s the most useful reply?',
    options: [{ id: 'a', label: 'Make everything bigger and brighter' }, { id: 'b', label: '“What should people notice first, and why?”' }, { id: 'c', label: 'Ignore it' }],
    correct: 'b', explanation: 'The question finds the goal behind the feeling.',
  },
  takeaways: [
    { title: 'Taste is about the speaker', body: '“I like” and “I don’t like” tell you about a person, not the design.' },
    { title: 'Reasoning has three parts', body: 'What I see, what it does to the user, which goal it helps or hurts.' },
    { title: 'Ask why', body: '“What makes you say that?” turns a feeling into a reason, or shows it was only preference.' },
  ],
  quiz: {
    seconds: 12,
    questions: [
      { id: 'q1', prompt: '“I don’t love the purple” is…', options: [{ id: 'a', label: 'Taste' }, { id: 'b', label: 'Reasoning' }], correct: 'a', explanation: 'No effect, no goal.' },
      { id: 'q2', prompt: 'Reasoned feedback names what it does to…', options: [{ id: 'a', label: 'The designer' }, { id: 'b', label: 'The user' }, { id: 'c', label: 'The brand team' }], correct: 'b', explanation: 'Effects on real people make it actionable.' },
      { id: 'q3', prompt: '“Another app does it” is…', options: [{ id: 'a', label: 'Always a strong reason' }, { id: 'b', label: 'Borrowed taste until you know why it works' }, { id: 'c', label: 'Copyright advice' }], correct: 'b', explanation: 'Ask what problem it solves for your users.' },
      { id: 'q4', prompt: 'Best reply to “It feels off”?', options: [{ id: 'a', label: '“It’s fine.”' }, { id: 'b', label: '“OK, I’ll redo it.”' }, { id: 'c', label: '“Off where? What did you look at first?”' }], correct: 'c', explanation: 'Locate the feeling on the screen.' },
    ],
  },
  ladder: [
    { id: 'l1', prompt: 'What makes a critique comment useful?', hint: 'Can the designer act on it?', options: [{ id: 'a', label: 'It’s confident' }, { id: 'b', label: 'It links what’s on screen to an effect on users and a goal' }, { id: 'c', label: 'It’s short' }, { id: 'd', label: 'It comes from someone senior' }], correct: 'b', explanation: 'That gives the designer something to change on purpose.' },
    { id: 'l2', prompt: 'Why start a critique by restating the screen’s goal?', hint: 'What are we judging against?', options: [{ id: 'a', label: 'To fill time' }, { id: 'b', label: 'So comments are judged against the goal, not personal taste' }, { id: 'c', label: 'To flatter the designer' }, { id: 'd', label: 'It’s a legal requirement' }], correct: 'b', explanation: 'Without a goal, every opinion weighs the same.' },
    { id: 'l3', prompt: 'A reviewer insists their preference is right. What’s the fairest move?', hint: 'Label, don’t fight.', options: [{ id: 'a', label: 'Argue until they agree' }, { id: 'b', label: 'Apply it to keep the peace' }, { id: 'c', label: 'Note it as preference and ask what it would change for users' }, { id: 'd', label: 'Delete the comment' }], correct: 'c', explanation: 'Labelled taste can still be weighed, just not as evidence.' },
    { id: 'l4', prompt: 'Can taste ever be valuable in critique?', hint: 'Experienced eyes notice things.', options: [{ id: 'a', label: 'Never' }, { id: 'b', label: 'Only from the CEO' }, { id: 'c', label: 'Only in branding work' }, { id: 'd', label: 'Yes, as a signal worth asking about, not as a verdict' }], correct: 'd', explanation: 'A trained gut often spots a real problem before it can name it. Ask until it can.' },
    { id: 'l5', prompt: 'Which is the strongest critique of a sign-up form?', hint: 'See, effect, goal.', options: [{ id: 'a', label: '“It’s boring.”' }, { id: 'b', label: '“Needs more personality.”' }, { id: 'c', label: '“Asking for date of birth before the phone number makes people drop off before we can verify them.”' }, { id: 'd', label: '“I’d have used a different font.”' }], correct: 'c', explanation: 'It names the element, the effect and the goal at stake.' },
  ],
};

export const fd3_2: Episode = {
  lessonId: 'fd.3-2',
  hook: '“This checkout is confusing. Redo it.” True, maybe, and useless. Watch the same thought become feedback Kabir can use.',
  scene: {
    id: 'feedback-frame', duration: 34,
    beats: [
      { at: 0, title: 'The blunt version', body: 'Kabir shares the Sabzi checkout. The first reply: “Honestly this is confusing. Redo it.” He has no idea what to change.' },
      { at: 6, title: 'I like', body: '“I like that the total stays pinned above Pay. I always knew what I’d spend.” Now he knows what to keep.' },
      { at: 12, title: 'I wish', body: '“I wish I’d picked the delivery slot before paying. By the time I found it, the 7 am slot was gone.” A problem, from a user’s seat.' },
      { at: 18, title: 'What if', body: '“What if the next three slots sat as chips right above Pay?” An idea, offered. Kabir decides.' },
      { at: 24, title: 'About the work, not the person', body: 'Point at the screen. Say who it affects. Leave the solution to the designer.' },
      { at: 29, title: 'Like, wish, what if', body: 'Keep this, fix this problem, consider this idea. The same honesty, now usable.' },
    ],
  },
  check: [
    { id: 'c1', prompt: 'What does an “I like” tell the designer?', options: [{ id: 'a', label: 'That you’re being polite' }, { id: 'b', label: 'What specifically to keep' }, { id: 'c', label: 'What to remove' }],
      correct: 'b', explanation: 'Specific praise protects what works.' },
    { id: 'c2', prompt: 'Who decides whether to use a “What if”?', options: [{ id: 'a', label: 'The person who suggested it' }, { id: 'b', label: 'The designer' }, { id: 'c', label: 'Whoever is most senior' }],
      correct: 'b', explanation: 'It’s an offer, not an order.' },
  ],
  game: {
    id: 'frame-feedback', title: 'Write the note',
    instructions: 'You tried Kabir’s Sabzi checkout. Each card is a thought you had. File it under I like, I wish or What if, and watch it become a sentence in your note. Anything unkind or unusable goes in the bin.',
    lanes: [
      { id: 'like', label: 'I like', hint: 'Something specific to keep' },
      { id: 'wish', label: 'I wish', hint: 'A problem someone hit' },
      { id: 'whatif', label: 'What if', hint: 'An idea, offered' },
      { id: 'bin', label: 'Bin it', hint: 'Personal, vague or unkind' },
    ],
    cards: [
      { id: 'g1', label: 'The total stays pinned above Pay, so I always knew what I’d spend.', visual: 'I like that the total stays pinned above Pay: I always knew what I’d spend.', lane: 'like', note: 'Specific praise tells Kabir not to lose this in the next version.' },
      { id: 'g2', label: 'I only found the delivery slot after paying, and the 7 am slot was gone.', visual: 'I wish I’d picked the delivery slot before paying; by the time I found it, 7 am was gone.', lane: 'wish', note: 'A real problem with a real cost, told from the user’s seat.' },
      { id: 'g3', label: 'The next three delivery slots could sit as chips right above Pay.', visual: 'What if the next three delivery slots sat as chips right above Pay?', lane: 'whatif', note: 'One idea for the slot problem, offered. Kabir may find a better one.' },
      { id: 'g4', label: 'This green is ugly.', lane: 'bin', note: 'Taste with no reason. If the colour causes a problem, say what the problem is.' },
      { id: 'g5', label: 'Out-of-stock items vanished from the cart with no message. I thought I’d ordered coriander.', visual: 'I wish the cart told me when an item went out of stock; I thought I’d ordered coriander.', lane: 'wish', note: 'Says what happened and what the user wrongly believed.' },
      { id: 'g6', label: 'Saved addresses show the flat number first, which is what the rider needs.', visual: 'I like that saved addresses lead with the flat number, which is what the rider needs.', lane: 'like', note: 'Names a detail and why it works, so it survives the redesign.' },
      { id: 'g7', label: 'You clearly rushed this.', lane: 'bin', note: 'About the person, not the work. Nothing here helps the checkout.' },
      { id: 'g8', label: 'Out-of-stock items could default to “Call me” instead of a silent swap.', visual: 'What if out-of-stock items defaulted to “Call me” instead of a silent swap?', lane: 'whatif', note: 'A concrete option Kabir can test or set aside.' },
      { id: 'g9', label: 'The coupon box at the top made me leave to hunt for codes.', visual: 'I wish the coupon box didn’t lead with an empty field; I left to hunt for codes.', lane: 'wish', note: 'Describes the behaviour it caused, not just a dislike of the box.' },
      { id: 'g10', label: 'Each item shows its weight beside the price, so comparing is easy.', visual: 'I like that every item shows its weight beside the price, so comparing is easy.', lane: 'like', note: 'Praise with a reason: it helps people choose.' },
    ],
  },
  gap: {
    id: 'gap', from: 12, at: 17.4,
    prompt: 'You want to suggest delivery-slot chips. How should you say it?',
    options: [{ id: 'a', label: '“Add slot chips above Pay.”' }, { id: 'b', label: '“What if the next three slots sat as chips right above Pay?”' }, { id: 'c', label: '“Slots are wrong.”' }],
    correct: 'b', explanation: 'Offer the idea and leave the decision with the designer.',
  },
  takeaways: [
    { title: 'I like', body: 'Name a specific thing that works, so it gets kept.' },
    { title: 'I wish', body: 'Describe a problem someone hit, and why it matters. Leave the fix open.' },
    { title: 'What if', body: 'Offer an idea. The designer decides what to do with it.' },
  ],
  quiz: {
    seconds: 12,
    questions: [
      { id: 'q1', prompt: '“You clearly rushed this” is…', options: [{ id: 'a', label: 'An “I wish”' }, { id: 'b', label: 'About the person: bin it' }], correct: 'b', explanation: 'Critique the work, not the designer.' },
      { id: 'q2', prompt: 'An “I wish” should describe…', options: [{ id: 'a', label: 'The exact fix' }, { id: 'b', label: 'A problem a user hit' }, { id: 'c', label: 'Your favourite colour' }], correct: 'b', explanation: 'The designer owns the solution.' },
      { id: 'q3', prompt: 'Why bother with “I like”?', options: [{ id: 'a', label: 'To soften the blow' }, { id: 'b', label: 'So good parts survive the next version' }, { id: 'c', label: 'It’s optional politeness' }], correct: 'b', explanation: 'Unnamed strengths get redesigned away.' },
      { id: 'q4', prompt: '“What if” is…', options: [{ id: 'a', label: 'An order' }, { id: 'b', label: 'A complaint' }, { id: 'c', label: 'An idea, offered' }], correct: 'c', explanation: 'Take it or leave it.' },
    ],
  },
  ladder: [
    { id: 'l1', prompt: 'What makes “I like the design” weak?', hint: 'Keep what, exactly?', options: [{ id: 'a', label: 'It’s too positive' }, { id: 'b', label: 'It doesn’t say what to keep or why' }, { id: 'c', label: 'It’s too short to be rude' }, { id: 'd', label: 'Nothing, it’s fine' }], correct: 'b', explanation: 'Vague praise is as unusable as vague criticism.' },
    { id: 'l2', prompt: 'Why does “I wish” avoid giving the solution?', hint: 'Who knows the constraints?', options: [{ id: 'a', label: 'Solutions are rude' }, { id: 'b', label: 'The designer knows the constraints and may find a better fix' }, { id: 'c', label: 'To save time' }, { id: 'd', label: 'Reviewers aren’t allowed ideas' }], correct: 'b', explanation: 'Name the problem clearly; ideas go in “What if”.' },
    { id: 'l3', prompt: 'Turn “The checkout is confusing” into a good wish.', hint: 'Who, what happened, why it matters.', options: [{ id: 'a', label: '“I wish it were less confusing.”' }, { id: 'b', label: '“I wish you’d redo it.”' }, { id: 'c', label: '“I wish I could tell which address it was going to before I paid; I nearly sent it home instead of the office.”' }, { id: 'd', label: '“I wish it were blue.”' }], correct: 'c', explanation: 'Specific, from the user’s seat, with a consequence.' },
    { id: 'l4', prompt: 'You have one big problem and three small nits. What goes first?', hint: 'Attention runs out.', options: [{ id: 'a', label: 'The nits, to warm up' }, { id: 'b', label: 'All four, equal weight' }, { id: 'c', label: 'None, just praise' }, { id: 'd', label: 'The big problem, clearly marked as the main one' }], correct: 'd', explanation: 'Prioritise, or the designer may fix the nits and miss the problem.' },
    { id: 'l5', prompt: 'When is the frame the wrong tool?', hint: 'Some things aren’t up for discussion.', options: [{ id: 'a', label: 'Never' }, { id: 'b', label: 'With senior designers' }, { id: 'c', label: 'When something is a hard blocker, like failing accessibility law: say it plainly' }, { id: 'd', label: 'In written feedback' }], correct: 'c', explanation: 'A legal or safety must-fix isn’t a wish. Be clear and kind, not vague.' },
  ],
};

export const fd3_3: Episode = {
  lessonId: 'fd.3-3',
  hook: '“I couldn’t find how to split the bill unevenly.” Ananya’s pulse jumps. What she says next decides whether the room keeps talking.',
  scene: {
    id: 'receive-critique', duration: 34,
    beats: [
      { at: 0, title: 'The comment lands', body: 'Ananya presents Kosh’s split-the-bill flow. Rahul: “I couldn’t find how to split unevenly.”' },
      { at: 4, title: 'The reflex', body: '“But it’s right there under More options. I followed the guidelines.” True, and the room goes quiet.' },
      { at: 9, title: 'Listen to the end', body: 'Rewind. She breathes, lets him finish, and doesn’t reach for the defence.' },
      { at: 14, title: 'Ask to understand', body: '“Where did you expect to find it?” “Next to the amount, where I typed ₹1,200.”' },
      { at: 19, title: 'Say it back, write it down', body: '“So uneven splits need to show where the amount is.” It goes in the critique log.' },
      { at: 24, title: 'Decide later', body: 'After the session she sorts the log against the goal: act on it, test it, or park it with a reason.' },
      { at: 29, title: 'It’s about the work', body: 'Feedback on the work isn’t a verdict on you. Every defence costs you the next comment.' },
    ],
  },
  check: [
    { id: 'c1', prompt: 'What did the first reply do to the room?', options: [{ id: 'a', label: 'Made people share more' }, { id: 'b', label: 'Made people stop giving feedback' }, { id: 'c', label: 'Nothing' }],
      correct: 'b', explanation: 'Defending signals that feedback isn’t welcome.' },
    { id: 'c2', prompt: 'When does Ananya decide what to change?', options: [{ id: 'a', label: 'On the spot' }, { id: 'b', label: 'After the session, against the goal' }, { id: 'c', label: 'Whenever Rahul agrees' }],
      correct: 'b', explanation: 'Collect first, decide later.' },
  ],
  game: {
    id: 'calm-reply', title: 'Keep your cool',
    instructions: 'You’re presenting Kosh’s split-the-bill flow. Each card is a comment, with the defensive reply you feel like giving. Choose the better move: ask a question, note it, or share a fact they didn’t have.',
    lanes: [
      { id: 'ask', label: 'Ask', hint: 'Vague or a fix: find what’s behind it' },
      { id: 'note', label: 'Note it', hint: 'Specific: thank them and log it' },
      { id: 'context', label: 'Add context', hint: 'They lack a fact: state it once' },
    ],
    cards: [
      { id: 'g1', label: '“This feels cluttered.”', visual: 'It’s not cluttered, it’s information-dense.', lane: 'ask', note: '“Which part did your eye land on first?” Vague feedback needs a question before it’s useful.' },
      { id: 'g2', label: '“On a small phone, the Split button is below the fold.”', visual: 'Most of our users have big phones.', lane: 'note', note: '“Good catch, I’ll check it on a 5-inch screen.” Specific and testable: log it.' },
      { id: 'g3', label: '“Why not show the shares as a pie chart?”', visual: 'Pie charts are bad, everyone knows that.', lane: 'context', note: '“We tested one: four of five people misread the shares. Happy to share the clips.” Evidence, once, then move on.' },
      { id: 'g4', label: '“Make the amount bigger.”', visual: 'It’s already 24 pixels.', lane: 'ask', note: '“What should people notice first on this screen?” Find the goal behind the requested fix.' },
      { id: 'g5', label: '“‘Invalid split’ doesn’t tell me what to fix.”', visual: 'Engineering wrote that message.', lane: 'note', note: '“You’re right. It should say the shares must add up to ₹1,200.” Own it and log it.' },
      { id: 'g6', label: '“Can’t we just copy how Splitwise does it?”', visual: 'We’re not Splitwise.', lane: 'ask', note: '“Which part of Splitwise works well for you?” There may be a real need under the reference.' },
      { id: 'g7', label: '“Why doesn’t this screen have a dark mode?”', visual: 'That’s not my job.', lane: 'context', note: '“Dark mode is planned for the whole app next quarter; this screen already uses the shared colour tokens.” A plain fact they didn’t have.' },
      { id: 'g8', label: '“I didn’t realise the request had been sent.”', visual: 'There’s a toast. You must have missed it.', lane: 'note', note: '“So the confirmation is easy to miss. Noted.” If one person missed it, others will.' },
    ],
  },
  gap: {
    id: 'gap', from: 9, at: 13.6,
    prompt: 'Rahul has just said he couldn’t find the uneven split. What should Ananya say first?',
    options: [{ id: 'a', label: '“It’s under More options.”' }, { id: 'b', label: '“Where did you expect to find it?”' }, { id: 'c', label: '“OK, I’ll redo the whole flow.”' }],
    correct: 'b', explanation: 'Understand what he saw before deciding anything.',
  },
  takeaways: [
    { title: 'Listen to the end', body: 'Let the comment land. The urge to explain is a reflex, not a plan.' },
    { title: 'Ask, then say it back', body: '“Where did you expect it?” then “So you’re saying…” Make sure you heard the real problem.' },
    { title: 'Log now, decide later', body: 'Write it down. After the session, act on it, test it or park it against the goal.' },
  ],
  quiz: {
    seconds: 12,
    questions: [
      { id: 'q1', prompt: '“Most of our users have big phones” is…', options: [{ id: 'a', label: 'A defence' }, { id: 'b', label: 'A clarifying question' }], correct: 'a', explanation: 'It argues instead of checking.' },
      { id: 'q2', prompt: 'First response to vague feedback?', options: [{ id: 'a', label: 'Disagree' }, { id: 'b', label: 'Ask a question' }, { id: 'c', label: 'Apply it immediately' }], correct: 'b', explanation: 'Find out what they saw.' },
      { id: 'q3', prompt: 'When is sharing context OK?', options: [{ id: 'a', label: 'Always, at length' }, { id: 'b', label: 'Never' }, { id: 'c', label: 'When it’s a fact they lacked, said once' }], correct: 'c', explanation: 'Inform, don’t argue.' },
      { id: 'q4', prompt: 'Critique of your work is…', options: [{ id: 'a', label: 'A verdict on you' }, { id: 'b', label: 'Information about the work' }, { id: 'c', label: 'An attack to answer' }], correct: 'b', explanation: 'Separate yourself from the pixels.' },
    ],
  },
  ladder: [
    { id: 'l1', prompt: 'Why does defending hurt you, even when you’re right?', hint: 'What happens to the next comment?', options: [{ id: 'a', label: 'It doesn’t' }, { id: 'b', label: 'People stop telling you what they see' }, { id: 'c', label: 'It wastes paper' }, { id: 'd', label: 'Managers dislike long answers' }], correct: 'b', explanation: 'You win the point and lose the information.' },
    { id: 'l2', prompt: 'What does saying the feedback back achieve?', hint: '“So you’re saying…”', options: [{ id: 'a', label: 'It checks you understood the real problem' }, { id: 'b', label: 'It buys time to plan a defence' }, { id: 'c', label: 'It shows you agree' }, { id: 'd', label: 'Nothing' }], correct: 'a', explanation: 'Misheard feedback leads to the wrong fix.' },
    { id: 'l3', prompt: 'Before a critique, what should the designer say?', hint: 'Steer the room.', options: [{ id: 'a', label: 'Nothing, let it flow' }, { id: 'b', label: 'Why the work is finished' }, { id: 'c', label: 'The goal, the stage of the work, and what kind of feedback they need' }, { id: 'd', label: 'A list of rules for reviewers' }], correct: 'c', explanation: 'An early sketch and a final spec need different feedback.' },
    { id: 'l4', prompt: 'Two reviewers give opposite feedback. What do you do?', hint: 'Go back to the goal.', options: [{ id: 'a', label: 'Follow the more senior one' }, { id: 'b', label: 'Average them' }, { id: 'c', label: 'Ignore both' }, { id: 'd', label: 'Weigh both against the goal, and test if it’s still unclear' }], correct: 'd', explanation: 'The goal and evidence decide, not rank.' },
    { id: 'l5', prompt: 'You decide not to act on a piece of feedback. What then?', hint: 'Close the loop.', options: [{ id: 'a', label: 'Tell the reviewer what you decided and why' }, { id: 'b', label: 'Say nothing and hope they forget' }, { id: 'c', label: 'Apply it anyway' }, { id: 'd', label: 'Delete it from the log' }], correct: 'a', explanation: 'People keep giving feedback when they see it was considered.' },
  ],
};
