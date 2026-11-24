// Episodes for chapter cw.2 · Voice, tone & content design. Drafts by Claude, for review.
// Chaabi (chaabi is Hindi for key) is a Kolkata app for renting a flat: find one, pay rent by UPI, raise repairs, get
// the deposit back. Ananya is its content designer and Dev its product designer. Tanvir is moving out of Flat 3B in
// Salt Lake, rented from Mrs Sen with a ₹45,000 deposit, into Flat 2A in Jadavpur, and Chaabi is about to launch in
// Bengali and Hindi. cw.1 covered clear strings one at a time and br.1 a brand's personality; this chapter is about one
// voice across every moment, writing the content before the layout, and writing English that survives translation.
import type { Episode } from '../episode';

export const cw2_1: Episode = {
  lessonId: 'cw.2-1',
  hook: 'Chaabi wished Tanvir “Uh-oh, your rent took a detour!” on the day ₹18,500 failed to reach his landlord. Same voice as the shortlist screen. Wrong tone.',
  scene: {
    id: 'voice-tone', duration: 36,
    beats: [
      { at: 0, title: 'A joke at the wrong time', body: 'Tanvir’s ₹18,500 rent fails on the day it’s due. Chaabi says “Uh-oh, your rent took a detour! Give it another spin?” He doesn’t know if the money left his account.' },
      { at: 6, title: 'Copied from a happy screen', body: 'The line was written in the same cheeky style as the shortlist screen: “Five flats on your shortlist. Someone’s serious about Jadavpur.” That one made people smile.' },
      { at: 11, title: 'Voice stays', body: 'Ananya writes down Chaabi’s voice: straight, neighbourly, sure. It’s the same on every screen, like a person who is recognisably themselves at a wedding and at a hospital.' },
      { at: 17, title: 'Tone moves', body: 'Tone is a dial from playful to serious. Two things turn it: the mood of the moment, and the stakes. Money, a home or a deadline push it one step graver.' },
      { at: 23, title: 'Turn the dial', body: 'A shortlist is good news, low stakes: playful. A deposit refund is good but big: warm. A PAN request is routine but blocks signing: plain. Failed rent is bad with money at stake: serious.' },
      { at: 29, title: 'The serious version', body: '“Your ₹18,500 rent didn’t go through, and no money left your account. It’s due today: pay with another UPI app, or tell Mrs Sen you’ll pay tomorrow.” Still Chaabi. Still straight and neighbourly.' },
      { at: 33, title: 'One voice, many tones', body: 'Ananya adds a tone for every type of moment to the guide, so nobody copies a joke into a failure again.' },
    ],
  },
  check: [
    { id: 'c1', prompt: 'What went wrong with the failed-rent message?', options: [{ id: 'a', label: 'It was in the wrong voice' }, { id: 'b', label: 'Its tone was set for good news, on a bad moment with money at stake' }, { id: 'c', label: 'It was too long' }],
      correct: 'b', explanation: 'The voice was Chaabi’s. The tone belonged to a happy, low-stakes screen.' },
    { id: 'c2', prompt: 'What turns the tone dial?', options: [{ id: 'a', label: 'The designer’s mood' }, { id: 'b', label: 'The time of day' }, { id: 'c', label: 'How the moment feels to the person, and what’s at stake' }],
      correct: 'c', explanation: 'Mood sets the starting point; money, a home or a deadline push it graver.' },
  ],
  game: {
    id: 'tone-dial', title: 'Turn the tone dial',
    instructions: 'Each card is a moment in Chaabi. Turn the dial and the message rewrites itself in each tone, in the same voice. Lock the tone the moment calls for.',
    lanes: [
      { id: 'playful', label: 'Playful', hint: 'Good news, nothing at stake' },
      { id: 'warm', label: 'Warm', hint: 'Good but big, or routine and small' },
      { id: 'plain', label: 'Plain', hint: 'Routine but important, or a small problem' },
      { id: 'serious', label: 'Serious', hint: 'Bad news with money, a home or a deadline at stake' },
    ],
    cards: [
      { id: 'g1', label: 'Tanvir saves a fifth flat to his shortlist', lane: 'playful', visual: 'shortlist', note: 'Good news and nothing rides on it. A light line here is where the voice gets to smile, and it costs nobody anything.' },
      { id: 'g2', label: 'Tanvir’s rent payment of ₹18,500 fails on the day it’s due', lane: 'serious', visual: 'rent-failed', note: 'Bad news, his money and his landlord’s trust at stake. The amount, whether money left, the deadline and two ways out. No jokes and no “don’t worry”.' },
      { id: 'g3', label: 'His deposit refund of ₹41,800 is approved', lane: 'warm', visual: 'deposit-back', note: 'Good news, but it’s ₹41,800 he has been anxious about for weeks. Warm and clear beats “Ka-ching!”: the amount and when it arrives.' },
      { id: 'g4', label: 'A search in Jadavpur finds no flats', lane: 'warm', visual: 'no-results', note: 'A small, routine setback. Warm and helpful: say why, offer a change that works, and promise to tell him. Not a joke at his expense, not a robot.' },
      { id: 'g5', label: 'He needs to add his PAN before he can sign the agreement', lane: 'plain', visual: 'kyc', note: 'Routine, but nothing moves until it’s done. Plain words: what, why and how long. “Paperwork party” and “pop in” make an important step sound optional.' },
      { id: 'g6', label: 'A photo on his repair request fails to upload', lane: 'plain', visual: 'photo-failed', note: 'A small problem. Say what happened and what to do, and that nothing else was lost. “Oh no!” and “together” overreact to a retry.' },
      { id: 'g7', label: 'Keys handed over at the new flat in Jadavpur', lane: 'playful', visual: 'move-in', note: 'A happy day with nothing at risk. The voice can be light, as long as it still tells him something useful.' },
      { id: 'g8', label: 'Mrs Sen sends a notice to leave Flat 3B', lane: 'serious', visual: 'notice', note: 'His home is at stake. The facts, the date, his rights, and a next step. Sympathy words like “we’re here for you” sound hollow next to a deadline.' },
    ],
  },
  gap: {
    id: 'gap', from: 23, at: 28.6,
    prompt: 'Failed rent is bad news with money at stake. Which line should Chaabi show?',
    options: [{ id: 'a', label: '“Your rent didn’t go through, but don’t worry, we’ll sort it out together.”' }, { id: 'b', label: '“Your ₹18,500 rent didn’t go through, and no money left your account. It’s due today: pay with another UPI app, or tell Mrs Sen you’ll pay tomorrow.”' }, { id: 'c', label: '“Payment failed.”' }],
    correct: 'b', explanation: 'Serious isn’t cold. It answers his two fears, the money and the deadline, in Chaabi’s straight, neighbourly voice.',
  },
  takeaways: [
    { title: 'Voice is constant', body: 'Who the product is. The same traits on every screen.' },
    { title: 'Tone flexes', body: 'How light that voice sounds, set by the moment.' },
    { title: 'Mood, then stakes', body: 'Good, routine or bad sets the start; money, a home or a deadline push it graver.' },
    { title: 'Write it down', body: 'A tone for each type of moment in the guide, so nobody copies a joke into a failure.' },
  ],
  quiz: {
    seconds: 12,
    questions: [
      { id: 'q1', prompt: 'What stays the same on every screen?', options: [{ id: 'a', label: 'Voice' }, { id: 'b', label: 'Tone' }], correct: 'a', explanation: 'Voice is character; tone is the moment.' },
      { id: 'q2', prompt: 'A notice to leave your flat calls for a tone that is…', options: [{ id: 'a', label: 'Playful, to soften it' }, { id: 'b', label: 'Serious' }, { id: 'c', label: 'Warm and chatty' }], correct: 'b', explanation: 'Bad news, a home at stake.' },
      { id: 'q3', prompt: 'Good news with a lot of money involved should sound…', options: [{ id: 'a', label: 'Like a party' }, { id: 'b', label: 'Cold and legal' }, { id: 'c', label: 'Warm and clear' }, { id: 'd', label: 'Silent' }], correct: 'c', explanation: 'Stakes push even good news a step graver.' },
      { id: 'q4', prompt: 'Which two things set the tone?', options: [{ id: 'a', label: 'Brand colour and font' }, { id: 'b', label: 'Screen size and platform' }, { id: 'c', label: 'Word count and reading age' }, { id: 'd', label: 'The moment’s mood and its stakes' }], correct: 'd', explanation: 'How it feels, and what could be lost.' },
    ],
  },
  ladder: [
    { id: 'l1', prompt: 'Why is “we’ll sort it out together” wrong on the failed rent screen, even though it’s kind?', hint: 'What does Tanvir need to know?', options: [{ id: 'a', label: 'It’s too formal' }, { id: 'b', label: 'Reassurance without facts: it doesn’t say whether money left or what to do before the deadline' }, { id: 'c', label: 'It uses “we”' }, { id: 'd', label: 'It’s too short' }], correct: 'b', explanation: 'On a serious moment, the kind thing is the facts and the way out.' },
    { id: 'l2', prompt: 'How should a voice and tone guide describe tone so writers can use it?', hint: 'A rule they can apply alone.', options: [{ id: 'a', label: '“Be friendly but professional”' }, { id: 'b', label: 'A list of adjectives' }, { id: 'c', label: 'Each type of moment, its tone, and a before-and-after example' }, { id: 'd', label: 'The brand’s mission statement' }], correct: 'c', explanation: '“Friendly but professional” means anything. Moments with examples can be followed.' },
    { id: 'l3', prompt: 'Nielsen Norman Group describes tone on four scales. Which is one of them?', hint: 'Like the dial.', options: [{ id: 'a', label: 'Funny vs. serious' }, { id: 'b', label: 'Long vs. short' }, { id: 'c', label: 'Blue vs. red' }, { id: 'd', label: 'Mobile vs. desktop' }], correct: 'a', explanation: 'Funny–serious, formal–casual, respectful–irreverent and enthusiastic–matter-of-fact.' },
    { id: 'l4', prompt: 'A push notification goes out at 11 pm: “Rent due tomorrow!” What’s the tone problem?', hint: 'Exclamation marks and timing.', options: [{ id: 'a', label: 'None' }, { id: 'b', label: 'It should be in capitals' }, { id: 'c', label: 'An exclamation at 11 pm reads as alarm; say “Rent of ₹18,500 is due tomorrow, 5th” in the morning instead' }, { id: 'd', label: 'It should include an emoji' }], correct: 'c', explanation: 'Tone includes punctuation and timing, not just words.' },
    { id: 'l5', prompt: 'Chaabi’s founder wants every message to be playful “because that’s our brand”. What’s the best reply?', hint: 'br.1’s traits.', options: [{ id: 'a', label: 'Agree; brand comes first' }, { id: 'b', label: 'The brand lives in the voice on every screen; tone decides how much playfulness each moment can carry, and failures and money can’t carry any' }, { id: 'c', label: 'Ban playfulness everywhere' }, { id: 'd', label: 'Let each designer decide' }], correct: 'b', explanation: 'A brand that jokes when your rent fails isn’t playful, it’s careless.' },
  ],
};

export const cw2_2: Episode = {
  lessonId: 'cw.2-2',
  hook: 'Dev’s move-out screen looked perfect in lorem ipsum. Then the real words arrived: “₹41,800 of your ₹45,000 deposit is coming back” didn’t fit a single box.',
  scene: {
    id: 'content-first', duration: 36,
    beats: [
      { at: 0, title: 'A perfect lorem layout', body: 'Dev draws Chaabi’s move-out screen: an 18-character headline, three equal tiles, two short buttons. In lorem ipsum, everything fits.' },
      { at: 6, title: 'The real words arrive', body: 'The headline needs three lines. The reason for a ₹2,400 deduction doesn’t fit a tile. “Question a deduction” spills out of its button. Dev starts cutting words.' },
      { at: 12, title: 'Start from the questions', body: 'Ananya asks what Tanvir wants to know when he moves out, in his order: How much do I get back? Why was anything kept? When will it reach me? What do I do now?' },
      { at: 18, title: 'Answer each one', body: 'She writes real answers: ₹41,800 of ₹45,000. ₹2,400 to repaint the bedroom wall, with Mrs Sen’s photo of the damp patch. In your bank by 14 March.' },
      { at: 24, title: 'The layout follows', body: 'Now each question is a block, sized to its answer. The amount is the biggest thing on the screen, the reasons sit right under it, and the buttons grow with their words.' },
      { at: 30, title: 'Fewer disputes', body: 'Tenants who see the reason and the photo before they tap rarely question a deduction. The content was the design.' },
      { at: 33, title: 'Words before boxes', body: 'Questions, real answers, then layout. Lorem ipsum is always the right length; nothing real is.' },
    ],
  },
  check: [
    { id: 'c1', prompt: 'Why did the lorem layout break?', options: [{ id: 'a', label: 'The real content was longer and needed reasons the boxes had no room for' }, { id: 'b', label: 'The font was wrong' }, { id: 'c', label: 'Ananya wrote too much' }],
      correct: 'a', explanation: 'Lorem ipsum hid how long and how detailed the real content was.' },
    { id: 'c2', prompt: 'Where did Ananya start?', options: [{ id: 'a', label: 'With a shorter headline' }, { id: 'b', label: 'With Tanvir’s questions, in the order he asks them' }, { id: 'c', label: 'With the hero photo' }],
      correct: 'b', explanation: 'Each question becomes a block, sized to its answer.' },
  ],
  game: {
    id: 'question-flow', title: 'Build the move-out flow',
    instructions: 'Each card is real content for Chaabi’s move-out flow. Drop it on the screen that answers its question. Watch it break Dev’s lorem box, then settle into a flow built around it.',
    lanes: [
      { id: 'howmuch', label: 'How much do I get back?', hint: 'The amount, up front' },
      { id: 'why', label: 'Why was anything kept?', hint: 'Each deduction and its proof' },
      { id: 'when', label: 'When will it reach me?', hint: 'Dates and who acts next' },
      { id: 'next', label: 'What do I do now?', hint: 'His actions' },
    ],
    cards: [
      { id: 'g1', label: '₹41,800 of your ₹45,000 deposit is coming back', lane: 'howmuch', visual: 'headline', note: 'The one thing he opened the screen for. It takes three lines in Dev’s 18-character headline, so the layout has to make room, not the sentence.' },
      { id: 'g2', label: '₹3,200 kept for two repairs', lane: 'howmuch', visual: 'tile', note: 'The other half of the sum, right next to it. Seeing both numbers together stops him doing the maths and wondering.' },
      { id: 'g3', label: '₹2,400 to repaint the bedroom wall, with Mrs Sen’s photo of the damp patch', lane: 'why', visual: 'body', note: 'A deduction without a reason reads as a grab. The reason and the photo are long, and they’re the content that prevents a dispute.' },
      { id: 'g4', label: '₹800 for the broken geyser knob, from the plumber’s bill', lane: 'why', visual: 'body', note: 'Proof, named: the plumber’s bill. Short enough for Dev’s box this time, which is luck, not design.' },
      { id: 'g5', label: 'Normal wear, like faded paint in the hall, can’t be charged', lane: 'why', visual: 'tile', note: 'Tells him his rights before he has to ask. A two-line tile can’t hold it, and it’s exactly what an anxious tenant looks for.' },
      { id: 'g6', label: 'In your bank by 14 March', lane: 'when', visual: 'tile', note: 'A date, not “soon” or “5–7 working days”. Short, and the most reassuring line on the screen.' },
      { id: 'g7', label: 'Mrs Sen has 3 days to approve. If she doesn’t, it’s approved for her', lane: 'when', visual: 'body', note: 'Who acts next and what happens if they don’t. Without it, “by 14 March” is a promise nobody controls.' },
      { id: 'g8', label: 'Accept and get paid', lane: 'next', visual: 'button', note: 'Verb and result, from cw.1. Nineteen characters in Dev’s 14-character button, so the button grows with its label.' },
      { id: 'g9', label: 'Question a deduction', lane: 'next', visual: 'button', note: 'The second action matters as much as the first. Squeezing it to “Dispute” would sound like a fight he hasn’t started.' },
      { id: 'g10', label: 'Hand the keys to Bapi da, the caretaker, before you leave', lane: 'next', visual: 'body', note: 'The real-world step the app can’t do for him. Real names make it actionable: Bapi da, not “the building contact”.' },
    ],
  },
  gap: {
    id: 'gap', from: 6, at: 11.4,
    prompt: 'The real words don’t fit Dev’s boxes. What should happen next?',
    options: [{ id: 'a', label: 'Cut the words until they fit' }, { id: 'b', label: 'Go back to what Tanvir needs to know, write the real answers, and lay out the screen around them' }, { id: 'c', label: 'Shrink the font to 11 px' }],
    correct: 'b', explanation: 'Cutting to fit removes the reasons and dates people needed. Let the content set the layout.',
  },
  takeaways: [
    { title: 'Questions first', body: 'List what the person wants to know, in the order they ask.' },
    { title: 'Real content', body: 'Write the real answers, longest likely version included, before drawing boxes.' },
    { title: 'Layout follows', body: 'Size and order each block by its content and how much it matters.' },
    { title: 'Lorem lies', body: 'It is always the right length. Real names, amounts and reasons never are.' },
  ],
  quiz: {
    seconds: 12,
    questions: [
      { id: 'q1', prompt: 'In content-first design, which comes first?', options: [{ id: 'a', label: 'The content' }, { id: 'b', label: 'The layout' }], correct: 'a', explanation: 'Words before boxes.' },
      { id: 'q2', prompt: 'The biggest thing on the move-out screen should be…', options: [{ id: 'a', label: 'A photo of the flat' }, { id: 'b', label: 'The amount coming back' }, { id: 'c', label: 'The Chaabi logo' }], correct: 'b', explanation: 'It answers his first question.' },
      { id: 'q3', prompt: 'Lorem ipsum hides…', options: [{ id: 'a', label: 'The brand colour' }, { id: 'b', label: 'Nothing' }, { id: 'c', label: 'The icon set' }, { id: 'd', label: 'How long and detailed the real content is' }], correct: 'd', explanation: 'It always fits.' },
      { id: 'q4', prompt: 'A deduction shown without a reason is likely to…', options: [{ id: 'a', label: 'Go unnoticed' }, { id: 'b', label: 'Be disputed' }, { id: 'c', label: 'Speed things up' }, { id: 'd', label: 'Look cleaner, so be better' }], correct: 'b', explanation: 'The reason and proof are the content that prevents disputes.' },
    ],
  },
  ladder: [
    { id: 'l1', prompt: 'What’s a good first artefact for content-first design?', hint: 'Before any wireframe.', options: [{ id: 'a', label: 'A moodboard' }, { id: 'b', label: 'A priority list of the person’s questions with real answers, in order' }, { id: 'c', label: 'A high-fidelity mock-up' }, { id: 'd', label: 'The logo' }], correct: 'b', explanation: 'A content priority list turns straight into the order of a screen or a flow.' },
    { id: 'l2', prompt: 'You can’t get real content yet. What’s the next best thing?', hint: 'Not lorem.', options: [{ id: 'a', label: 'Lorem ipsum' }, { id: 'b', label: '“Text goes here”' }, { id: 'c', label: 'Realistic drafts written from real cases, including the longest name and biggest amount you can find' }, { id: 'd', label: 'Leave the boxes empty' }], correct: 'c', explanation: 'Proto-content from real cases shows the true lengths and shapes.' },
    { id: 'l3', prompt: 'Tanvir’s full name is Tanvir Ahmed Bandyopadhyay. What should the design test?', hint: 'Edge cases.', options: [{ id: 'a', label: 'Only “Tanvir”' }, { id: 'b', label: 'That long names wrap or truncate gracefully wherever a name appears' }, { id: 'c', label: 'Nothing; names are short' }, { id: 'd', label: 'That his name fits in capitals' }], correct: 'b', explanation: 'Design with the longest likely content, not the average.' },
    { id: 'l4', prompt: 'Why did each question in the move-out flow become its own block or screen?', hint: 'One question at a time.', options: [{ id: 'a', label: 'It’s cheaper to build' }, { id: 'b', label: 'Each answer has a different shape: a number, reasons with proof, dates, actions; grouping by question keeps each one findable' }, { id: 'c', label: 'Screens should have one word each' }, { id: 'd', label: 'Developers asked for it' }], correct: 'b', explanation: 'Content groups follow the questions people bring.' },
    { id: 'l5', prompt: 'How would you show content-first worked here?', hint: 'A metric.', options: [{ id: 'a', label: 'The screen looks nicer' }, { id: 'b', label: 'Fewer deductions questioned and fewer support calls about deposits after the change' }, { id: 'c', label: 'More words on the screen' }, { id: 'd', label: 'Dev is happy' }], correct: 'b', explanation: 'Good content answers questions before people have to ask them.' },
  ],
};

export const cw2_3: Episode = {
  lessonId: 'cw.2-3',
  hook: 'Chaabi’s first Bengali build said “1 repairs open”, put Mrs Sen’s name in the wrong place, and promised tenants it had “got their back”, word for word.',
  scene: {
    id: 'loc-ready', duration: 36,
    beats: [
      { at: 0, title: 'Launching in Bengali', body: 'Chaabi’s rent screen goes to Moumita, its Bengali translator. It comes back broken in ways nobody wrote into the Bengali.' },
      { at: 6, title: 'Built from pieces', body: 'The code joins “Rent due in ” + 3 + “ days”. Bengali and Hindi put the verb at the end, but the pieces lock English word order. With one repair, it shows “1 repairs open”.' },
      { at: 12, title: 'Whole sentences', body: 'Ananya rewrites them as whole messages with placeholders and a plural rule: “Rent due in {days, plural, one {# day} other {# days}}”. Moumita can order the sentence her own way.' },
      { at: 18, title: 'Idioms don’t travel', body: '“We’ve got your back” comes back as a sentence about someone’s spine. Ananya writes what it means: “We’ll help if anything goes wrong with your flat.”' },
      { at: 24, title: 'Room to grow', body: 'Pseudo-localization pads every string with accented letters. “Raise a request” clips in its fixed button; the Payments tab cuts off. Short strings grow the most, so boxes must grow too.' },
      { at: 30, title: 'Formats by locale', body: 'Dates show as 3 April, not 03/04. Money keeps Indian grouping: ₹1,00,000. The app formats them for each language.' },
      { at: 33, title: 'Ready to translate', body: 'Whole sentences, plain meaning, room to grow. Moumita translates the screen in an afternoon.' },
    ],
  },
  check: [
    { id: 'c1', prompt: 'Why did “Rent due in ” + 3 + “ days” break in Bengali?', options: [{ id: 'a', label: 'The joined pieces lock English word order' }, { id: 'b', label: 'Bengali has no numbers' }, { id: 'c', label: 'The font was missing' }],
      correct: 'a', explanation: 'Translators get fragments and can’t reorder them.' },
    { id: 'c2', prompt: 'What does pseudo-localization find?', options: [{ id: 'a', label: 'Spelling mistakes' }, { id: 'b', label: 'Text that clips or breaks once it’s longer or accented, before any translator starts' }, { id: 'c', label: 'Rude words' }],
      correct: 'b', explanation: 'Padded, accented fake text shows which boxes can’t grow.' },
  ],
  game: {
    id: 'loc-spot', title: 'Spot what breaks in translation',
    instructions: 'This is Chaabi’s rent screen, about to go to Bengali and Hindi translators. Turn on the pseudo-locale preview, tap each string and call it: ready, built from pieces, an idiom, or no room to grow.',
    lanes: [
      { id: 'ready', label: 'Ready', hint: 'Whole, plain, and room to grow' },
      { id: 'pieces', label: 'Built from pieces', hint: 'Joined fragments or a stuck plural' },
      { id: 'idiom', label: 'Idiom', hint: 'Means something else word for word' },
      { id: 'room', label: 'No room to grow', hint: 'Clips once it’s longer' },
    ],
    cards: [
      { id: 'g1', label: 'Pay rent', lane: 'ready', visual: '18|Pay rent', note: 'A plain verb and object in a button that grows with its label. In Hindi it becomes “किराया चुकाएँ”, about twice as long, and still fits.' },
      { id: 'g2', label: 'Rent due in 3 days', lane: 'pieces', visual: '40|Rent due in |3| days', note: 'Three pieces joined in code. Bengali and Hindi put “due” at the end. One message, “Rent due in {days} days”, with a plural rule, lets the translator order it.' },
      { id: 'g3', label: 'Paid to Mrs Sen', lane: 'pieces', visual: '36|Paid to |Mrs Sen', note: 'In Hindi the name comes first and the verb last: “श्रीमती सेन को भुगतान किया”. Make it “Paid to {name}” as one string.' },
      { id: 'g4', label: '1 repairs open', lane: 'pieces', visual: '40|1| repairs open', note: 'A count stuck onto a fixed plural. Use a plural rule so each language picks its own form, including ones with more than two.' },
      { id: 'g5', label: '2 repairs open', lane: 'ready', visual: '30|2 repairs open', note: 'The same line done right: one message with a plural rule behind it, and room in its box.' },
      { id: 'g6', label: 'We’ve got your back', lane: 'idiom', visual: '40|We’ve got your back', note: 'Word for word it’s about a spine. Say what it means: “We’ll help if anything goes wrong with your flat.”' },
      { id: 'g7', label: 'Your deposit is in the bag', lane: 'idiom', visual: '48|Your deposit is in the bag', note: 'A translator may put his deposit in a literal bag. Plain: “Your deposit is safe and will be returned when you move out.”' },
      { id: 'g8', label: 'Rent’s a piece of cake with Autopay', lane: 'idiom', visual: '56|Rent’s a piece of cake with Autopay', note: 'Cake has nothing to do with rent in Bengali either. “Autopay pays your rent on the 5th, so you don’t have to remember.”' },
      { id: 'g9', label: 'Raise a request', lane: 'room', visual: '16|Raise a request', note: 'Fifteen characters in a 16-character fixed button. Translated, it needs about 27. Let the button grow or wrap.' },
      { id: 'g10', label: 'Payments', lane: 'room', visual: '10|Payments', note: 'A tab sized to the English word. Strings this short can double. Give tabs room, or let them scroll.' },
      { id: 'g11', label: 'Mrs Sen will see this message.', lane: 'ready', visual: '60|Mrs Sen will see this message.', note: 'A whole sentence, plain meaning, and a box with room for it to grow by about half.' },
    ],
  },
  gap: {
    id: 'gap', from: 6, at: 11.4,
    prompt: '“Rent due in ” + 3 + “ days” locks English word order. How should Ananya fix it?',
    options: [{ id: 'a', label: 'Translate each piece separately' }, { id: 'b', label: 'One whole message with a {days} placeholder and a plural rule' }, { id: 'c', label: 'Show just the number 3' }],
    correct: 'b', explanation: 'Whole messages let each language put the words where its grammar needs them.',
  },
  takeaways: [
    { title: 'Whole sentences', body: 'One message with named placeholders. Never join fragments in code.' },
    { title: 'Plural rules', body: 'Let each language pick its own form. “1 repairs” means nobody did.' },
    { title: 'Say what you mean', body: 'Idioms translate into nonsense. Write the plain meaning.' },
    { title: 'Room to grow', body: 'Short strings can double. Pseudo-localize before translating, and format dates and money by locale.' },
  ],
  quiz: {
    seconds: 12,
    questions: [
      { id: 'q1', prompt: 'Which strings grow the most in translation?', options: [{ id: 'a', label: 'Short ones' }, { id: 'b', label: 'Long ones' }], correct: 'a', explanation: 'A 10-character button can double.' },
      { id: 'q2', prompt: '“Hit it out of the park” in a success message is…', options: [{ id: 'a', label: 'Ready' }, { id: 'b', label: 'An idiom to replace' }, { id: 'c', label: 'Built from pieces' }], correct: 'b', explanation: 'Say what it means.' },
      { id: 'q3', prompt: '03/04 shown to someone in the US means…', options: [{ id: 'a', label: '3 April' }, { id: 'b', label: 'Nothing' }, { id: 'c', label: 'The same as in India' }, { id: 'd', label: '4 March' }], correct: 'd', explanation: 'Write the month as a word and format by locale.' },
      { id: 'q4', prompt: 'Indian grouping writes one lakh rupees as…', options: [{ id: 'a', label: '₹100,000' }, { id: 'b', label: '₹1,00,000' }, { id: 'c', label: '₹1.00.000' }, { id: 'd', label: '₹10,0000' }], correct: 'b', explanation: 'Let the app format numbers for each locale.' },
    ],
  },
  ladder: [
    { id: 'l1', prompt: 'Why not translate the pieces of a joined string one by one?', hint: 'Grammar.', options: [{ id: 'a', label: 'It costs more' }, { id: 'b', label: 'Word order, gender and case change across languages; a piece can’t know what surrounds it' }, { id: 'c', label: 'Translators refuse' }, { id: 'd', label: 'It works fine' }], correct: 'b', explanation: 'Only a whole sentence can be reordered correctly.' },
    { id: 'l2', prompt: 'What should a string sent to translators come with?', hint: 'They can’t see the screen.', options: [{ id: 'a', label: 'Nothing; the words are enough' }, { id: 'b', label: 'A note on where it appears, its character limit, and what each placeholder will hold' }, { id: 'c', label: 'The English font' }, { id: 'd', label: 'A deadline only' }], correct: 'b', explanation: '“Close” could be a verb or an adjective. Context is how translators choose.' },
    { id: 'l3', prompt: 'Chaabi’s banner has “Move in this weekend!” baked into an image. What’s the problem?', hint: 'Can it be translated?', options: [{ id: 'a', label: 'None' }, { id: 'b', label: 'Text in images can’t be translated, resized or read by screen readers; put the text in the layout' }, { id: 'c', label: 'The image is too big' }, { id: 'd', label: 'Banners should be in English' }], correct: 'b', explanation: 'Keep words as text, over the image if needed.' },
    { id: 'l4', prompt: 'Hindi verbs often agree with the gender of the person addressed: “आप भुगतान कर रहे हैं” to a man, “आप भुगतान कर रही हैं” to a woman. What should English writers do?', hint: 'Avoid forcing it.', options: [{ id: 'a', label: 'Assume male' }, { id: 'b', label: 'Prefer structures that don’t force a gendered form, like “Payment in progress” instead of “You are paying”, and flag the ones that do' }, { id: 'c', label: 'Add “(m/f)” after each verb' }, { id: 'd', label: 'Skip Hindi' }], correct: 'b', explanation: 'Neutral structures spare translators an impossible choice.' },
    { id: 'l5', prompt: 'When should Chaabi first run a pseudo-localized build?', hint: 'Cheapest moment.', options: [{ id: 'a', label: 'After launch' }, { id: 'b', label: 'When the translations come back' }, { id: 'c', label: 'As soon as screens are built, before any translator starts, and on every new screen after' }, { id: 'd', label: 'Never; it’s fake text' }], correct: 'c', explanation: 'Fixing a box is cheap before translation and expensive in three languages.' },
  ],
};
