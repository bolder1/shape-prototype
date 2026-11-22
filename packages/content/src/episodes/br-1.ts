// Episodes for chapter br.1 · Brand foundations. Drafts by Claude, for review.
import type { Episode } from '../episode';

export const br1_1: Episode = {
  lessonId: 'br.1-1',
  hook: 'A company spent ₹40 lakh on a new logo. Customers still called it “the app that never refunds”. That’s the brand.',
  scene: {
    id: 'brand-layers', duration: 34,
    beats: [
      { at: 0, title: 'The logo', body: 'A mark: a symbol and a wordmark. Small, important, and only the centre of the story.' },
      { at: 6, title: 'The identity', body: 'Around it, a system: a colour palette, typefaces, icons, photo style and a tone of voice, used the same way everywhere.' },
      { at: 12, title: 'The brand', body: 'Outside it all: what people think and feel. Built by every delivery, every error message, every support call.' },
      { at: 18, title: 'A new logo, the same brand', body: 'Swap the logo. Refunds are still slow, so people still say “they never refund”. Nothing changed where it matters.' },
      { at: 24, title: 'Fix the experience', body: 'Refunds in two days, a kind apology message. Slowly, what people say changes. Now the brand moves.' },
      { at: 29, title: 'Mark, system, perception', body: 'You design the logo and identity. You earn the brand.' },
    ],
  },
  check: [
    { id: 'c1', prompt: 'What is a visual identity?', options: [{ id: 'a', label: 'Just the logo' }, { id: 'b', label: 'The system of colour, type, imagery and voice around the logo' }, { id: 'c', label: 'What customers feel' }],
      correct: 'b', explanation: 'The consistent system that surrounds the mark.' },
    { id: 'c2', prompt: 'Why didn’t the new logo change the brand?', options: [{ id: 'a', label: 'It was the wrong colour' }, { id: 'b', label: 'The experience, slow refunds, stayed the same' }, { id: 'c', label: 'Logos never matter' }],
      correct: 'b', explanation: 'Brands are built by experiences, not marks.' },
  ],
  game: {
    id: 'brand-layer', title: 'Logo, identity or brand?',
    instructions: 'Three rings: the logo at the centre, the identity around it, the brand on the outside. Tap the ring each item belongs to.',
    lanes: [
      { id: 'logo', label: 'Logo', hint: 'The mark itself' },
      { id: 'identity', label: 'Identity', hint: 'The designed system around it' },
      { id: 'brand', label: 'Brand', hint: 'What people think and feel' },
    ],
    cards: [
      { id: 'g1', label: 'The symbol on the app icon', lane: 'logo' },
      { id: 'g2', label: 'The exact orange used on every screen and bag', lane: 'identity' },
      { id: 'g3', label: 'Customers saying “they always refund fast”', lane: 'brand' },
      { id: 'g4', label: 'The tone-of-voice guide for all copy', lane: 'identity' },
      { id: 'g5', label: 'The wordmark at the top of the website', lane: 'logo' },
      { id: 'g6', label: 'How people feel after a late delivery', lane: 'brand' },
      { id: 'g7', label: 'The typeface on the packaging and the app', lane: 'identity' },
      { id: 'g8', label: 'A reputation for friendly support', lane: 'brand' },
      { id: 'g9', label: 'The photo style: real kitchens, natural light', lane: 'identity' },
    ],
  },
  gap: {
    id: 'gap', from: 18, at: 23.4,
    prompt: 'The new logo didn’t change what people say. What will?',
    options: [{ id: 'a', label: 'Another new logo' }, { id: 'b', label: 'Fixing the experience behind the complaints' }, { id: 'c', label: 'A brighter colour' }],
    correct: 'b', explanation: 'Change what people experience and, over time, what they say changes.',
  },
  takeaways: [
    { title: 'Logo = mark', body: 'A symbol or wordmark. Important, but small.' },
    { title: 'Identity = system', body: 'Colour, type, imagery, icons and voice, used consistently.' },
    { title: 'Brand = perception', body: 'What people think and feel, earned through every experience.' },
  ],
  quiz: {
    seconds: 12,
    questions: [
      { id: 'q1', prompt: 'A typeface used everywhere is part of the…', options: [{ id: 'a', label: 'Identity' }, { id: 'b', label: 'Brand perception' }], correct: 'a', explanation: 'It’s in the system.' },
      { id: 'q2', prompt: '“They always refund fast” is…', options: [{ id: 'a', label: 'The logo' }, { id: 'b', label: 'The identity' }, { id: 'c', label: 'The brand' }], correct: 'c', explanation: 'Perception.' },
      { id: 'q3', prompt: 'A new logo alone changes…', options: [{ id: 'a', label: 'The whole brand' }, { id: 'b', label: 'Customer trust' }, { id: 'c', label: 'Reviews' }, { id: 'd', label: 'Only the mark' }], correct: 'd', explanation: 'Experiences build brands.' },
      { id: 'q4', prompt: 'Who owns the brand, in the end?', options: [{ id: 'a', label: 'The designer' }, { id: 'b', label: 'The CEO' }, { id: 'c', label: 'The people who experience it' }, { id: 'd', label: 'The logo' }], correct: 'c', explanation: 'It lives in their heads.' },
    ],
  },
  ladder: [
    { id: 'l1', prompt: 'What’s a brand guideline document for?', hint: 'Consistency at scale.', options: [{ id: 'a', label: 'So everyone applies the identity the same way' }, { id: 'b', label: 'To replace the logo' }, { id: 'c', label: 'For legal use only' }, { id: 'd', label: 'To list competitors' }], correct: 'a', explanation: 'Rules and examples for logo, colour, type, voice and imagery.' },
    { id: 'l2', prompt: 'Which is a “brand touchpoint”?', hint: 'Any moment of contact.', options: [{ id: 'a', label: 'Only the logo' }, { id: 'b', label: 'Any interaction: app, packaging, support chat, delivery person' }, { id: 'c', label: 'Only ads' }, { id: 'd', label: 'The office' }], correct: 'b', explanation: 'Every touchpoint shapes the brand.' },
    { id: 'l3', prompt: 'How does product design affect the brand?', hint: 'Experiences.', options: [{ id: 'a', label: 'It doesn’t, brand is marketing’s job' }, { id: 'b', label: 'Only through the logo' }, { id: 'c', label: 'Every flow, error and wait is an experience people judge the brand by' }, { id: 'd', label: 'Only through colours' }], correct: 'c', explanation: 'Product designers shape brands daily.' },
    { id: 'l4', prompt: 'Two apps use the same blue and similar logos. How can they still feel different?', hint: 'Beyond visuals.', options: [{ id: 'a', label: 'They can’t' }, { id: 'b', label: 'Only with a new logo' }, { id: 'c', label: 'Only with more colours' }, { id: 'd', label: 'Voice, behaviour, service and what they promise make the difference' }], correct: 'd', explanation: 'Identity is one layer; experience is the rest.' },
    { id: 'l5', prompt: 'What’s brand equity?', hint: 'Value in the name.', options: [{ id: 'a', label: 'The extra value people place on a product because of its brand' }, { id: 'b', label: 'The logo’s file size' }, { id: 'c', label: 'Shares owned by the designer' }, { id: 'd', label: 'Ad spend' }], correct: 'a', explanation: 'Why people pay more, or forgive more, for brands they trust.' },
  ],
};

export const br1_2: Episode = {
  lessonId: 'br.1-2',
  hook: '“The best app for everyone” positions you nowhere. Pick who you’re for, what you beat, and how you sound.',
  scene: {
    id: 'positioning', duration: 34,
    beats: [
      { at: 0, title: 'A crowded shelf', body: 'Ten meditation apps, all “simple, beautiful, for everyone”. Nobody can tell them apart.' },
      { at: 6, title: 'Pick a space', body: 'Map them: quick vs. long sessions, playful vs. expert. One corner is empty: quick and expert.' },
      { at: 12, title: 'Say it in one sentence', body: 'For busy professionals who can’t switch off, Sukoon fits calm into five minutes, unlike hour-long courses.' },
      { at: 18, title: 'A personality', body: 'Calm, warm, expert. And what each trait isn’t: calm not sleepy, warm not cutesy, expert not preachy.' },
      { at: 24, title: 'It shapes everything', body: 'The same traits set the copy, the colours, the pace of animations, even the error messages.' },
      { at: 29, title: 'Own a space, sound like yourself', body: 'Positioning says where you stand. Personality says how you behave there.' },
    ],
  },
  check: [
    { id: 'c1', prompt: 'Why did Sukoon pick “quick and expert”?', options: [{ id: 'a', label: 'It was an empty space competitors didn’t own' }, { id: 'b', label: 'It sounded nice' }, { id: 'c', label: 'Random choice' }],
      correct: 'a', explanation: 'Positioning finds an ownable space.' },
    { id: 'c2', prompt: 'Why say what each trait isn’t?', options: [{ id: 'a', label: 'To make it longer' }, { id: 'b', label: 'To stop traits being overdone, like warm becoming cutesy' }, { id: 'c', label: 'It’s required' }],
      correct: 'b', explanation: 'The “not” keeps the trait in bounds.' },
  ],
  game: {
    id: 'voice-fit', title: 'Sound like Sukoon',
    instructions: 'First, forge Sukoon’s positioning statement. Then judge each line and design choice: on brand for a calm, warm, expert meditation app, or off?',
    lanes: [
      { id: 'off', label: 'Off brand', hint: 'Fights calm, warm or expert' },
      { id: 'on', label: 'On brand', hint: 'Calm, warm and knows its stuff' },
    ],
    cards: [
      { id: 'g1', label: '“Breathe. You’ve got five minutes.”', lane: 'on', note: 'Short, calm and kind.' },
      { id: 'g2', label: '“CRUSH your stress NOW!!! 🔥”', lane: 'off', note: 'Shouting and hype fight “calm”.' },
      { id: 'g3', label: '“Slow breathing lowers your heart rate. Let’s try it together.”', lane: 'on', note: 'Expert without preaching, and warm.' },
      { id: 'g4', label: '“Leverage mindfulness synergies for optimal outcomes.”', lane: 'off', note: 'Jargon is cold, not warm or expert.' },
      { id: 'g5', label: '“Missed a day? That’s fine. Start again whenever you’re ready.”', lane: 'on', note: 'Warm and forgiving.' },
      { id: 'g6', label: '“You broke your streak. Don’t let us down again.”', lane: 'off', note: 'Guilt is the opposite of warm.' },
      { id: 'g7', label: 'A soft sand-and-peach colour palette', lane: 'on', note: 'Warm, quiet colours support calm.' },
      { id: 'g8', label: 'Neon pink and electric green buttons', lane: 'off', note: 'Loud colours fight calm.' },
      { id: 'g9', label: 'Slow, gentle fades between screens', lane: 'on', note: 'Motion can be calm too.' },
      { id: 'g10', label: 'Bouncy confetti exploding after every breath', lane: 'off', note: 'Hyperactive motion breaks the calm.' },
    ],
    rounds: [
      { id: 'r1', prompt: 'Forge Sukoon’s positioning statement',
        answer: ['For busy professionals', 'who can’t switch off,', 'Sukoon is the meditation app', 'that fits calm into five minutes,', 'unlike hour-long courses.'],
        distractors: ['for everyone', 'with the best features', 'that is innovative'],
        weak: ['Sukoon is the best meditation app for everyone.', 'Sukoon is an innovative app with the best features.'] },
    ],
  },
  gap: {
    id: 'gap', from: 18, at: 23.4,
    prompt: 'Sukoon is “warm”. What stops warm turning into cutesy baby talk?',
    options: [{ id: 'a', label: 'Adding more emoji' }, { id: 'b', label: 'Defining what the trait isn’t: warm, not cutesy' }, { id: 'c', label: 'Making everything pink' }],
    correct: 'b', explanation: 'A “not” for each trait keeps it in bounds.',
  },
  takeaways: [
    { title: 'Positioning', body: 'For whom, which need, what benefit, and unlike what alternative.' },
    { title: 'Personality', body: 'Three or four traits, each with what it isn’t.' },
    { title: 'It shapes the product', body: 'Copy, colour, motion and even errors follow the traits.' },
  ],
  quiz: {
    seconds: 12,
    questions: [
      { id: 'q1', prompt: '“For everyone” positions you…', options: [{ id: 'a', label: 'Nowhere in particular' }, { id: 'b', label: 'Perfectly' }], correct: 'a', explanation: 'Pick a who.' },
      { id: 'q2', prompt: 'A positioning statement names…', options: [{ id: 'a', label: 'Only the logo' }, { id: 'b', label: 'Audience, need, benefit and alternative' }, { id: 'c', label: 'The price' }], correct: 'b', explanation: 'The template.' },
      { id: 'q3', prompt: 'For a calm brand, confetti on every tap is…', options: [{ id: 'a', label: 'On brand' }, { id: 'b', label: 'Required' }, { id: 'c', label: 'Neutral' }, { id: 'd', label: 'Off brand' }], correct: 'd', explanation: 'Motion has personality.' },
      { id: 'q4', prompt: '“Calm, not sleepy” is an example of…', options: [{ id: 'a', label: 'A tagline' }, { id: 'b', label: 'A logo rule' }, { id: 'c', label: 'A trait with its boundary' }, { id: 'd', label: 'A positioning statement' }], correct: 'c', explanation: 'Trait + what it isn’t.' },
    ],
  },
  ladder: [
    { id: 'l1', prompt: 'What does a positioning map plot?', hint: 'Two axes.', options: [{ id: 'a', label: 'Competitors on two dimensions customers care about, to find open space' }, { id: 'b', label: 'Sales by month' }, { id: 'c', label: 'Logo sizes' }, { id: 'd', label: 'Office locations' }], correct: 'a', explanation: 'Choose axes that matter to customers.' },
    { id: 'l2', prompt: 'Why do brands often avoid more than four personality traits?', hint: 'Memorable and usable.', options: [{ id: 'a', label: 'Legal limits' }, { id: 'b', label: 'More traits blur together and nobody can apply them consistently' }, { id: 'c', label: 'Four is lucky' }, { id: 'd', label: 'They run out of words' }], correct: 'b', explanation: 'Few, distinct traits are easier to live by.' },
    { id: 'l3', prompt: 'Brand archetypes (Sage, Caregiver, Hero…) are useful because…', hint: 'Shared shortcuts.', options: [{ id: 'a', label: 'They replace research' }, { id: 'b', label: 'Every brand must pick one' }, { id: 'c', label: 'They give a quick shared reference for personality' }, { id: 'd', label: 'They decide the logo' }], correct: 'c', explanation: 'A shortcut, not a rule.' },
    { id: 'l4', prompt: 'Sukoon’s error message for a failed payment should sound…', hint: 'Personality applies everywhere.', options: [{ id: 'a', label: 'Like a system log: “ERR 402”' }, { id: 'b', label: 'Cheerful and jokey' }, { id: 'c', label: 'Guilt-tripping' }, { id: 'd', label: 'Calm and helpful: what happened and what to do next' }], correct: 'd', explanation: 'Personality matters most when things go wrong.' },
    { id: 'l5', prompt: 'How do you test whether the positioning works?', hint: 'Ask the audience.', options: [{ id: 'a', label: 'Show the statement or concepts to target users and see if they get it and care' }, { id: 'b', label: 'Ask the CEO' }, { id: 'c', label: 'Count words' }, { id: 'd', label: 'Launch and hope' }], correct: 'a', explanation: 'Positioning lives in customers’ minds, so test it there.' },
  ],
};

export const br1_3: Episode = {
  lessonId: 'br.1-3',
  hook: 'Sixty beautiful pins and no idea what the brand is. A moodboard is an argument, not a scrapbook.',
  scene: {
    id: 'moodboard', duration: 34,
    beats: [
      { at: 0, title: 'The dump', body: 'Every pretty thing found online: neon, glitch art, crowds, grunge type. Lovely. Meaningless.' },
      { at: 6, title: 'Start from the traits', body: 'Sukoon is calm, warm and expert. Every piece must express at least one.' },
      { at: 12, title: 'Cut what fights it', body: 'The neon goes, the crowd photo goes, the glitch texture goes. They’re striking, but wrong.' },
      { at: 18, title: 'Group and annotate', body: 'Three columns, one per trait. A note under each piece: why it’s here.' },
      { at: 24, title: 'A board you can defend', body: 'Twelve pieces that say calm, warm and expert, and a reason for each.' },
      { at: 29, title: 'Curate, don’t collect', body: 'If you can’t say why it’s on the board, take it off.' },
    ],
  },
  check: [
    { id: 'c1', prompt: 'What was wrong with the first board?', options: [{ id: 'a', label: 'Too few images' }, { id: 'b', label: 'Pretty things with no link to the brand’s traits' }, { id: 'c', label: 'Wrong size' }],
      correct: 'b', explanation: 'Beauty isn’t the test; fit is.' },
    { id: 'c2', prompt: 'How was the final board organised?', options: [{ id: 'a', label: 'By colour' }, { id: 'b', label: 'Randomly' }, { id: 'c', label: 'By personality trait, with a note on each piece' }],
      correct: 'c', explanation: 'Grouped and annotated.' },
  ],
  game: {
    id: 'mood-build', title: 'Curate the board',
    instructions: 'Here are ten pieces someone pinned for Sukoon (calm, warm, expert). Tap the ones that belong on the board, then hand it in.',
    lanes: [
      { id: 'drop', label: 'Drop', hint: 'Fights the personality' },
      { id: 'keep', label: 'Keep', hint: 'Expresses calm, warm or expert' },
    ],
    cards: [
      { id: 'g1', label: 'A palette of sand, peach and soft sage', lane: 'keep', visual: 'palette-warm', note: 'Warm and quiet: calm and warm.' },
      { id: 'g2', label: 'A palette of neon pink and electric green', lane: 'drop', visual: 'palette-neon', note: 'Loud and cold; fights calm.' },
      { id: 'g3', label: 'A gentle serif with rounded details', lane: 'keep', visual: 'type-serif', note: 'Considered and warm; says expert without being stiff.' },
      { id: 'g4', label: 'A distressed grunge typeface', lane: 'drop', visual: 'type-grunge', note: 'Edgy and rough; not calm.' },
      { id: 'g5', label: 'A misty sunrise over hills', lane: 'keep', visual: 'photo-sunrise', note: 'Calm, warm light.' },
      { id: 'g6', label: 'A packed, noisy rush-hour crowd', lane: 'drop', visual: 'photo-crowd', note: 'The stress Sukoon helps people escape.' },
      { id: 'g7', label: 'Handmade paper texture', lane: 'keep', visual: 'texture-paper', note: 'Tactile and warm.' },
      { id: 'g8', label: 'A glitchy digital noise texture', lane: 'drop', visual: 'texture-glitch', note: 'Chaotic and anxious.' },
      { id: 'g9', label: 'Thin, rounded line icons', lane: 'keep', visual: 'icon-line', note: 'Light, precise and friendly.' },
      { id: 'g10', label: 'Glossy 3D emoji stickers', lane: 'drop', visual: 'icon-3d', note: 'Playful and loud; not calm or expert.' },
    ],
  },
  gap: {
    id: 'gap', from: 12, at: 17.4,
    prompt: 'A stunning neon artwork is on the board. Sukoon is calm and warm. What do you do?',
    options: [{ id: 'a', label: 'Keep it, it’s beautiful' }, { id: 'b', label: 'Drop it: it fights the personality' }, { id: 'c', label: 'Make it bigger' }],
    correct: 'b', explanation: 'Fit beats beauty. If it argues against the traits, it goes.',
  },
  takeaways: [
    { title: 'Start from traits', body: 'Every piece must express the brand’s personality.' },
    { title: 'Cut what fights it', body: 'Striking but off-brand pieces mislead everyone downstream.' },
    { title: 'Group and annotate', body: 'Columns by trait, a reason under every piece.' },
  ],
  quiz: {
    seconds: 12,
    questions: [
      { id: 'q1', prompt: 'A moodboard should be…', options: [{ id: 'a', label: 'Curated' }, { id: 'b', label: 'As big as possible' }], correct: 'a', explanation: 'Fewer, chosen pieces.' },
      { id: 'q2', prompt: 'For a calm brand, a glitch texture is…', options: [{ id: 'a', label: 'A keep' }, { id: 'b', label: 'A drop' }, { id: 'c', label: 'Required' }], correct: 'b', explanation: 'It fights calm.' },
      { id: 'q3', prompt: 'Each piece on the board needs…', options: [{ id: 'a', label: 'A big size' }, { id: 'b', label: 'A filter' }, { id: 'c', label: 'A border' }, { id: 'd', label: 'A reason it’s there' }], correct: 'd', explanation: 'Annotate.' },
      { id: 'q4', prompt: 'A good way to group a board is by…', options: [{ id: 'a', label: 'Date pinned' }, { id: 'b', label: 'File type' }, { id: 'c', label: 'Personality trait' }, { id: 'd', label: 'Random' }], correct: 'c', explanation: 'It shows how each trait looks.' },
    ],
  },
  ladder: [
    { id: 'l1', prompt: 'Why build a moodboard before designing screens?', hint: 'Cheap alignment.', options: [{ id: 'a', label: 'To agree the feel cheaply before anyone designs details' }, { id: 'b', label: 'It’s a legal requirement' }, { id: 'c', label: 'To pick the logo' }, { id: 'd', label: 'To avoid research' }], correct: 'a', explanation: 'Disagreements surface early, when they’re cheap.' },
    { id: 'l2', prompt: 'A client says “I love all of it!” about a 60-image board. Risk?', hint: 'Everything means nothing.', options: [{ id: 'a', label: 'None' }, { id: 'b', label: 'The board doesn’t constrain anything, so design can go anywhere' }, { id: 'c', label: 'Too much colour' }, { id: 'd', label: 'Copyright only' }], correct: 'b', explanation: 'A board must rule things out to be useful.' },
    { id: 'l3', prompt: 'What’s a “style tile”?', hint: 'Between moodboard and mockup.', options: [{ id: 'a', label: 'A floor tile' }, { id: 'b', label: 'A logo' }, { id: 'c', label: 'A single sheet with type, colours, buttons and textures applied, without a full layout' }, { id: 'd', label: 'A sitemap' }], correct: 'c', explanation: 'It turns a mood into interface ingredients.' },
    { id: 'l4', prompt: 'Using images from the web on a moodboard is…', hint: 'Internal vs. final.', options: [{ id: 'a', label: 'Never allowed' }, { id: 'b', label: 'Fine to ship in the product' }, { id: 'c', label: 'Required' }, { id: 'd', label: 'Usually fine for internal exploration, but final work needs licensed or original assets' }], correct: 'd', explanation: 'Inspiration isn’t a licence.' },
    { id: 'l5', prompt: 'How can you test a moodboard with users?', hint: 'Word association.', options: [{ id: 'a', label: 'Show two boards and ask which words each brings to mind' }, { id: 'b', label: 'Ask them to redraw it' }, { id: 'c', label: 'Count pins' }, { id: 'd', label: 'You can’t' }], correct: 'a', explanation: 'If people say “calm, warm”, the board works.' },
  ],
};
