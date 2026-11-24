// Episodes for chapter br.3 · Marketing & web design. Drafts by Claude, for review.
// Sukoon is the meditation app from br.1 and br.2, now launching: free for 7 days, then ₹149 a month or ₹999 a year.
// Kabir Malhotra founded it; Ishita Rao, the brand designer, builds the launch page and campaign. The sections, drafts,
// assets and the page Google reads, and the rules they're judged by, are in ../marketing and tested there.
import type { Episode } from '../episode';
import { SEO_AREA_OF, SUKOON_ASSETS, SUKOON_DRAFTS, SUKOON_SECTIONS, copyLine, type SeoIssue, type SukoonAsset, type SukoonDraft, type SukoonSection } from '../marketing';

const sec = (k: SukoonSection) => ({ label: SUKOON_SECTIONS[k].text, lane: SUKOON_SECTIONS[k].zone, visual: k });
const draft = (k: SukoonDraft) => { const d = SUKOON_DRAFTS[k]; return { label: copyLine(d, d.segments.map(() => 0)), lane: d.slot, visual: k }; };
const asset = (k: SukoonAsset) => ({ label: SUKOON_ASSETS[k].text, lane: SUKOON_ASSETS[k].format, visual: k });
const seo = (k: SeoIssue, label: string) => ({ label, lane: SEO_AREA_OF[k], visual: k });

export const br3_1: Episode = {
  lessonId: 'br.3-1',
  hook: 'Kabir’s launch page opened on a full-screen logo and kept the sign-up form for the very bottom. Two in three visitors never scrolled that far.',
  scene: {
    id: 'landing-anatomy', duration: 36,
    beats: [
      { at: 0, title: 'The page the company wanted', body: 'A logo banner, “Welcome to Sukoon”, a beach slideshow, the features, the founders’ story, and a five-field form at the end.' },
      { at: 6, title: 'Where people stop', body: 'Each screen of scrolling keeps about 70% of the visitors who got that far. The form starts 2,860 px down: a third of visitors ever see it.' },
      { at: 11, title: 'Four questions, in order', body: 'What is it, and is it for me? Why should I believe you? How does it work? What does it cost, and what now?' },
      { at: 16, title: 'The first screen', body: 'Headline, one line under it, the button with “No card needed”, and a phone mid-session. All of it above the fold.' },
      { at: 21, title: 'Proof before price', body: '4.8 stars from 12,000 ratings, three named reviews, the teams that use it at work. Then how it works, in three steps.' },
      { at: 26, title: 'Close, and ask again', body: 'Free for 7 days, then ₹149 a month. The questions people ask before paying. The button again, for the third who read to the end.' },
      { at: 31, title: 'One page, one goal', body: 'The top bar keeps the logo and the button. Every visitor sees a way to start, and the trial sign-ups can be counted.' },
    ],
  },
  check: [
    { id: 'c1', prompt: 'Why did so few people sign up on Kabir’s page?', options: [{ id: 'a', label: 'The logo was ugly' }, { id: 'b', label: 'The only way to sign up was at the bottom, and most visitors never scrolled that far' }, { id: 'c', label: 'The price was too high' }],
      correct: 'b', explanation: 'Every screen of scrolling loses people. The button belongs on the first screen.' },
    { id: 'c2', prompt: 'Why does proof come before the price?', options: [{ id: 'a', label: 'It looks nicer' }, { id: 'b', label: 'People need a reason to believe before they’re asked to pay' }, { id: 'c', label: 'Prices are secret' }],
      correct: 'b', explanation: 'The page follows the visitor’s questions: what, why believe, how, then cost.' },
  ],
  game: {
    id: 'page-stack', title: 'Build the launch page',
    instructions: 'Drag each piece onto the part of the page whose question it answers, or tap the part. The phone builds the page as you go, with the share of visitors who scroll far enough to see each piece.',
    lanes: [
      { id: 'hero', label: 'First screen', hint: 'What is it, and is it for me?' },
      { id: 'proof', label: 'Proof', hint: 'Why should I believe you?' },
      { id: 'how', label: 'How it works', hint: 'How does it work, what do I get?' },
      { id: 'close', label: 'Close', hint: 'What does it cost, and what now?' },
    ],
    cards: [
      { id: 'g1', ...sec('headline'), note: 'The outcome, the time it takes and the moment it fits. It answers “what is it, and is it for me?” before anything else.' },
      { id: 'g2', ...sec('pricing'), note: 'Price comes once the visitor believes it works. Here it’s seen by about a third of visitors, the ones who are interested.' },
      { id: 'g3', ...sec('quotes'), note: 'Names, jobs and cities make a review believable. “Great app!” from “User123” doesn’t.' },
      { id: 'g4', ...sec('heroCta'), note: 'On the first screen, every visitor sees it. “No card needed” answers the fear right where they’ll press.' },
      { id: 'g5', ...sec('steps'), note: 'Three steps make it feel easy. Each one is something the visitor does, not something the company built.' },
      { id: 'g6', ...sec('rating'), note: 'One number from a store people trust, right under the first screen, where the doubt starts.' },
      { id: 'g7', ...sec('faq'), note: 'The last questions before paying: can I cancel, does it work offline, who sees my data. Answer them here, not in a support chat.' },
      { id: 'g8', ...sec('heroShot'), note: 'Show the product doing its job: a session mid-breath, not a beach.' },
      { id: 'g9', ...sec('features'), note: 'What you get, once you know how it works. Benefits in the visitor’s words: “sessions offline on the metro”, not “offline caching”.' },
      { id: 'g10', ...sec('logos'), note: 'Teams that already use it at work tell an HR head this is safe to try.' },
      { id: 'g11', ...sec('finalCta'), note: 'Whoever reads to the end is ready. Don’t make them scroll back up to start.' },
    ],
  },
  gap: {
    id: 'gap', from: 6, at: 10.4,
    prompt: 'Only a third of visitors ever reach Kabir’s form. What should Ishita change first?',
    options: [{ id: 'a', label: 'Make the form brighter' }, { id: 'b', label: 'Put what Sukoon is and a “Start your free week” button on the first screen' }, { id: 'c', label: 'Add more features above the form' }],
    correct: 'b', explanation: 'Answer the first question and offer the action where every visitor is: above the fold.',
  },
  takeaways: [
    { title: 'Follow the visitor’s questions', body: 'What and for whom, why believe, how, then cost and what now.' },
    { title: 'Win the first screen', body: 'Headline, a line under it, the button and the product, above the fold.' },
    { title: 'Proof before price', body: 'Ratings, named reviews and who uses it, before you ask for money.' },
    { title: 'One goal', body: 'One action, offered at the top and again at the end; few ways off the page.' },
  ],
  quiz: {
    seconds: 12,
    questions: [
      { id: 'q1', prompt: 'A landing page should have…', options: [{ id: 'a', label: 'One main action' }, { id: 'b', label: 'As many links as possible' }], correct: 'a', explanation: 'One kind of visitor, one action.' },
      { id: 'q2', prompt: '“Above the fold” means…', options: [{ id: 'a', label: 'The footer' }, { id: 'b', label: 'What shows before any scrolling' }, { id: 'c', label: 'A folded flyer' }], correct: 'b', explanation: 'On a phone, about the first 700 px.' },
      { id: 'q3', prompt: 'If each screen keeps 70% of visitors, how many see the third screen?', options: [{ id: 'a', label: '70%' }, { id: 'b', label: '30%' }, { id: 'c', label: 'About half' }, { id: 'd', label: 'Everyone' }], correct: 'c', explanation: '0.7 × 0.7 = 0.49.' },
      { id: 'q4', prompt: 'Why repeat the button at the end?', options: [{ id: 'a', label: 'To fill space' }, { id: 'b', label: 'So readers who reach the end can start without scrolling back' }, { id: 'c', label: 'Google needs two' }, { id: 'd', label: 'It shouldn’t be' }], correct: 'b', explanation: 'They’re the most convinced visitors on the page.' },
    ],
  },
  ladder: [
    { id: 'l1', prompt: 'How is a landing page different from a homepage?', hint: 'Count the goals.', options: [{ id: 'a', label: 'It isn’t' }, { id: 'b', label: 'A landing page serves one audience and one action, often for one campaign; a homepage serves everyone and links everywhere' }, { id: 'c', label: 'A homepage has no images' }, { id: 'd', label: 'Landing pages are only for apps' }], correct: 'b', explanation: 'Ads and launches send people to landing pages so the message matches the click.' },
    { id: 'l2', prompt: 'An Instagram ad says “Calm before your 9 am stand-up”. The page it opens says “Welcome to Sukoon”. What’s broken?', hint: 'Message match.', options: [{ id: 'a', label: 'Nothing' }, { id: 'b', label: 'The page doesn’t repeat the promise people clicked on, so they wonder if they’re in the right place' }, { id: 'c', label: 'The ad is too short' }, { id: 'd', label: 'Instagram ads can’t link to pages' }], correct: 'b', explanation: 'The headline should echo the ad’s words.' },
    { id: 'l3', prompt: 'Sukoon wants to sell to individuals and HR heads. One page or two?', hint: 'Different questions.', options: [{ id: 'a', label: 'One page with both' }, { id: 'b', label: 'Two pages: each audience has different questions, proof and a different action (trial vs. demo)' }, { id: 'c', label: 'One page, HR in the footer' }, { id: 'd', label: 'No page for HR' }], correct: 'b', explanation: 'An HR head asks about privacy, reporting and price per seat.' },
    { id: 'l4', prompt: 'How would you check the page’s order is working after launch?', hint: 'Where do people stop?', options: [{ id: 'a', label: 'Ask the founder' }, { id: 'b', label: 'Look at scroll depth and button clicks by section, and watch a few session recordings' }, { id: 'c', label: 'Count the words' }, { id: 'd', label: 'Check it on a desktop' }], correct: 'b', explanation: 'Scroll maps show where attention ends; clicks show which button does the work (st.3).' },
    { id: 'l5', prompt: 'A review says “Life-changing! — Priya”. How do you make it more believable?', hint: 'Specifics.', options: [{ id: 'a', label: 'Add more exclamation marks' }, { id: 'b', label: 'Full name, job and city, a photo with permission, and a specific detail like “I do it in the cab to work”' }, { id: 'c', label: 'Make it longer' }, { id: 'd', label: 'Write one yourself' }], correct: 'b', explanation: 'Specific, attributable reviews persuade; vague ones read as fake. Never invent them.' },
  ],
};

export const br3_2: Episode = {
  lessonId: 'br.3-2',
  hook: '“Unlock your inner calm with our AI-powered meditation ecosystem.” Five people looked at it for five seconds. None of them could say what Sukoon did.',
  scene: {
    id: 'conversion-copy', duration: 36,
    beats: [
      { at: 0, title: 'The agency’s hero', body: '“Unlock your inner calm with our AI-powered meditation ecosystem.” A sub about a team of passionate experts. A button that says Submit.' },
      { at: 6, title: 'A five-second test', body: 'Five people see it for five seconds. “Some AI thing?” “A wellness community?” “No idea.” Nobody says “meditation in five minutes”.' },
      { at: 11, title: 'The visitor’s words', body: 'In reviews and interviews, people say “I can’t switch off” and “I’ve only got five minutes”. The headline becomes “Calm in five minutes, between meetings.”' },
      { at: 16, title: 'How, and for whom', body: 'The sub gets concrete: “Five-minute guided sessions you can do at your desk, in a cab or before a call.” We becomes you.' },
      { at: 21, title: 'A button that promises', body: '“Submit” becomes “Start your free week”: a verb and what you get.' },
      { at: 26, title: 'The fear before the click', body: 'Under the button: “Free for 7 days. No card needed.” The legal line moves to the sign-up screen.' },
      { at: 31, title: 'Tested', body: 'Five of five now say what it is. In a two-week A/B test, trial starts rise from 2.1% to 3.4% of visitors.' },
    ],
  },
  check: [
    { id: 'c1', prompt: 'Where did the new headline’s words come from?', options: [{ id: 'a', label: 'A thesaurus' }, { id: 'b', label: 'What people said in reviews and interviews' }, { id: 'c', label: 'The competitor’s page' }],
      correct: 'b', explanation: 'Visitors recognise their own words. Mine reviews, interviews and support chats for them.' },
    { id: 'c2', prompt: 'What does “No card needed” do under the button?', options: [{ id: 'a', label: 'Fills space' }, { id: 'b', label: 'Answers the fear people have right before pressing' }, { id: 'c', label: 'Meets a legal rule' }],
      correct: 'b', explanation: 'Reassurance belongs where the hesitation happens.' },
  ],
  game: {
    id: 'copy-swap', title: 'Rewrite the hero',
    instructions: 'Each line is a draft from Kabir or the agency. Tap a phrase to swap it for another; the line checks itself as you go. Lock it in when it’s clear, specific, about the visitor, and short enough to read in five seconds.',
    lanes: [
      { id: 'headline', label: 'Headline', hint: 'The outcome, with a number, in 8 words or fewer' },
      { id: 'sub', label: 'The line under it', hint: 'How and for whom, concretely, in 20 words' },
      { id: 'cta', label: 'Button', hint: 'A verb and what you get, not “Submit”' },
      { id: 'reassure', label: 'Under the button', hint: 'The fear right before the click' },
    ],
    cards: [
      { id: 'g1', ...draft('launchHead'), note: '“Calm in five minutes, between meetings”: the outcome, the time and the moment, in the words people used in interviews.' },
      { id: 'g2', ...draft('launchSub'), note: 'How (five-minute guided sessions) and where it fits (desk, cab, before a call). No team, no platform, no journey.' },
      { id: 'g3', ...draft('launchCta'), note: '“Start your free week” says what happens and what you get. “Submit” is what a form does, not what a visitor wants.' },
      { id: 'g4', ...draft('launchSafe'), note: 'The two worries before a trial are paying and being stuck. “Free for 7 days. No card needed.” answers both in seven words.' },
      { id: 'g5', ...draft('teamsHead'), note: 'An HR head can picture “five-minute calm breaks for your team”. Nobody can picture “holistic employee wellness”.' },
      { id: 'g6', ...draft('teamsSub'), note: 'What their people get, with a number, and the answer to the HR worry: they see usage, never names.' },
      { id: 'g7', ...draft('teamsCta'), note: 'A demo is the real next step for a team purchase, and “20-minute” tells a busy manager what it costs them.' },
      { id: 'g8', ...draft('teamsSafe'), note: 'The fear before booking a demo is a long sales pitch. “A real person, no slides” answers it.' },
    ],
  },
  gap: {
    id: 'gap', from: 6, at: 10.4,
    prompt: 'Nobody in the five-second test could say what Sukoon does. What should Ishita do?',
    options: [{ id: 'a', label: 'Make the headline bigger' }, { id: 'b', label: 'Rewrite it in the words people use about the problem, naming the outcome' }, { id: 'c', label: 'Add “AI” twice for credibility' }],
    correct: 'b', explanation: 'Clear beats clever: say what it does, in the visitor’s words.',
  },
  takeaways: [
    { title: 'The visitor’s words', body: 'Headlines name the outcome people want, in the words they use.' },
    { title: 'Concrete and about “you”', body: 'Numbers, places, moments. Cut unlock, seamless, journey, platform.' },
    { title: 'Buttons promise', body: 'A verb and what you get: “Start your free week”.' },
    { title: 'Test it', body: 'A five-second test first, then an A/B test on what you’re unsure of.' },
  ],
  quiz: {
    seconds: 12,
    questions: [
      { id: 'q1', prompt: 'Which button label is stronger?', options: [{ id: 'a', label: 'Start your free week' }, { id: 'b', label: 'Submit' }], correct: 'a', explanation: 'A verb and the value.' },
      { id: 'q2', prompt: 'A five-second test asks people…', options: [{ id: 'a', label: 'To rate the colours' }, { id: 'b', label: 'What the page is and who it’s for, after seeing it for five seconds' }, { id: 'c', label: 'To sign up within five seconds' }], correct: 'b', explanation: 'It checks the hero is understood at a glance.' },
      { id: 'q3', prompt: 'Which word should you cut from a headline?', options: [{ id: 'a', label: 'Five' }, { id: 'b', label: 'Calm' }, { id: 'c', label: 'Seamless' }, { id: 'd', label: 'Meetings' }], correct: 'c', explanation: 'Nobody can picture “seamless”.' },
      { id: 'q4', prompt: 'Trial starts rise from 2.1% to 3.4%. That’s a relative lift of about…', options: [{ id: 'a', label: '1.3%' }, { id: 'b', label: '62%' }, { id: 'c', label: '34%' }, { id: 'd', label: '3.4×' }], correct: 'b', explanation: '(3.4 − 2.1) ÷ 2.1 ≈ 0.62.' },
    ],
  },
  ladder: [
    { id: 'l1', prompt: 'Where do you find the words customers use for their problem?', hint: 'Listen, don’t invent.', options: [{ id: 'a', label: 'In the company’s pitch deck' }, { id: 'b', label: 'App-store reviews, interview notes, support chats and search terms' }, { id: 'c', label: 'A list of synonyms' }, { id: 'd', label: 'The CEO’s LinkedIn posts' }], correct: 'b', explanation: 'Copy from the voice of the customer converts because people recognise themselves.' },
    { id: 'l2', prompt: 'Is “Get started” a good button label?', hint: 'Started with what?', options: [{ id: 'a', label: 'Always' }, { id: 'b', label: 'It’s generic: it names an action but not what you get, so “Start your free week” usually does better' }, { id: 'c', label: 'Only in blue' }, { id: 'd', label: 'It’s illegal' }], correct: 'b', explanation: 'Specific beats generic, though only a test settles it for your page.' },
    { id: 'l3', prompt: 'A countdown says “Offer ends in 09:59” and resets every visit. What’s wrong?', hint: 'gr.1-4.', options: [{ id: 'a', label: 'Nothing, urgency works' }, { id: 'b', label: 'It’s fake urgency, a dark pattern: it lies, and people who notice stop trusting the brand' }, { id: 'c', label: 'It should be red' }, { id: 'd', label: 'It should count up' }], correct: 'b', explanation: 'Real deadlines are fine; invented ones are deception.' },
    { id: 'l4', prompt: 'How is conversion copy different from UX writing (cw.1)?', hint: 'Before and after sign-up.', options: [{ id: 'a', label: 'It isn’t' }, { id: 'b', label: 'Conversion copy persuades someone to start; UX writing helps someone already inside get things done. Both stay clear and in the brand’s voice' }, { id: 'c', label: 'Conversion copy can lie' }, { id: 'd', label: 'UX writing is longer' }], correct: 'b', explanation: 'Same voice, different jobs.' },
    { id: 'l5', prompt: 'Two headlines tie in a five-second test. How do you choose?', hint: 'Real visitors.', options: [{ id: 'a', label: 'The founder picks' }, { id: 'b', label: 'Run an A/B test on real traffic, sized for the lift you care about (gr.3)' }, { id: 'c', label: 'Use both, one after the other' }, { id: 'd', label: 'Flip a coin' }], correct: 'b', explanation: 'A five-second test checks understanding; an A/B test checks behaviour.' },
  ],
};

export const br3_3: Episode = {
  lessonId: 'br.3-3',
  hook: 'The agency cut the launch post into a Story. The headline went under the profile bar, the button under the reply bar, and the YouTube thumbnail shrank to a smear.',
  scene: {
    id: 'campaign-cut', duration: 36,
    beats: [
      { at: 0, title: 'One key visual', body: 'Sand, the half-sun and “Calm in five minutes”. The launch post looks right in the feed.' },
      { at: 6, title: 'Squeezed into a Story', body: 'The agency fits the square into 1080 × 1920. The profile bar covers the headline; the reply bar covers the button.' },
      { at: 11, title: 'Shrunk to a thumbnail', body: 'The YouTube thumbnail has a 44 px headline on a 1280 px canvas. In the Up next list, 168 px wide, the letters are under 6 px.' },
      { at: 16, title: 'Safe zones', body: 'Each format gets its own layout. In a Story, text and buttons stay out of the top 250 px and the bottom 340.' },
      { at: 21, title: 'Big for its format', body: 'Size text for where it’s shown. The thumbnail’s headline becomes “Calm in 5 minutes”, 110 px tall, 14 px on screen.' },
      { at: 26, title: 'A template for each', body: 'Feed post, Story, thumbnail, link preview: the same message, sun and colours, each laid out for its frame.' },
      { at: 31, title: 'The campaign runs', body: 'Five weeks of posts, a review a week, built from the templates in minutes, and all of them look like Sukoon.' },
    ],
  },
  check: [
    { id: 'c1', prompt: 'Why did the Story fail?', options: [{ id: 'a', label: 'Stories can’t have text' }, { id: 'b', label: 'The headline and button sat under the app’s own bars' }, { id: 'c', label: 'The colours were wrong' }],
      correct: 'b', explanation: 'Each format has its own safe zones.' },
    { id: 'c2', prompt: 'Why couldn’t anyone read the thumbnail?', options: [{ id: 'a', label: 'It was blurry' }, { id: 'b', label: 'It’s shown 168 px wide, so a 44 px headline ends up under 6 px on screen' }, { id: 'c', label: 'YouTube compresses text' }],
      correct: 'b', explanation: 'Size text for the place it’s shown, not the canvas.' },
  ],
  game: {
    id: 'asset-fit', title: 'Fit the campaign',
    instructions: 'Six assets the agency sent. Select a block and nudge it, change the headline size, or tap the headline for a shorter one. Turn on the app’s bars and the real-size preview to check. Ship it when it survives its format; one is fine as it is.',
    lanes: [
      { id: 'post', label: 'Feed post', hint: '1080 × 1350, shown 360 px wide' },
      { id: 'story', label: 'Story or Status', hint: '1080 × 1920, bars top and bottom' },
      { id: 'thumb', label: 'YouTube thumbnail', hint: '1280 × 720, shown 168 px wide' },
      { id: 'link', label: 'Link preview', hint: '1200 × 630, shown about 300 px wide' },
    ],
    cards: [
      { id: 'g1', ...asset('storyLaunch'), note: 'Text and button move into the middle band: below the 250 px profile bar, above the 340 px reply bar.' },
      { id: 'g2', ...asset('postLaunch'), note: 'Thirteen words won’t be read in a scroll. “Sukoon is live. Calm in five minutes.” says it in seven; the features go in the caption.' },
      { id: 'g3', ...asset('thumbTalk'), note: '“Calm in 5 minutes” at 110 px is about 14 px on screen in the Up next list. The full title is YouTube’s job, under the picture.' },
      { id: 'g4', ...asset('postQuote'), note: 'Seven words, 28 px on screen, the logo clear at the bottom. Nothing to fix: knowing when to stop is part of the job.' },
      { id: 'g5', ...asset('linkCard'), note: 'At 40 px on a 1200 px card, the headline is 10 px in a chat. At 64 px it’s 16 px, and readable.' },
      { id: 'g6', ...asset('storyTeams'), note: 'The headline wraps to two lines and runs into the logo. Moving the logo down clears it; check the wrap, not just the first line.' },
    ],
  },
  gap: {
    id: 'gap', from: 6, at: 10.4,
    prompt: 'The squeezed Story hides the headline and the button. What should Ishita ask for?',
    options: [{ id: 'a', label: 'A bigger logo' }, { id: 'b', label: 'A layout made for 1080 × 1920, with text and the button inside the safe middle band' }, { id: 'c', label: 'Skip Stories' }],
    correct: 'b', explanation: 'Each format is its own layout, built from a template that knows its safe zones.',
  },
  takeaways: [
    { title: 'One idea, many layouts', body: 'The same message and look, laid out fresh for each format, never just cropped.' },
    { title: 'Mind the safe zones', body: 'In Stories, keep text out of the top 250 px and the bottom 340.' },
    { title: 'Size for where it’s shown', body: 'Check text at its real size on a phone, not on the canvas.' },
    { title: 'Templates keep it on brand', body: 'Build each format once; every post after is quick and consistent.' },
  ],
  quiz: {
    seconds: 12,
    questions: [
      { id: 'q1', prompt: 'A Story is…', options: [{ id: 'a', label: '1080 × 1920' }, { id: 'b', label: '1080 × 1080' }], correct: 'a', explanation: '9:16, full screen.' },
      { id: 'q2', prompt: 'A link preview on WhatsApp or LinkedIn is usually…', options: [{ id: 'a', label: 'Square' }, { id: 'b', label: 'About 1200 × 630' }, { id: 'c', label: 'Portrait' }], correct: 'b', explanation: 'Roughly 1.91:1, set with an og:image tag.' },
      { id: 'q3', prompt: 'A 1280 px thumbnail shown 168 px wide shrinks text to about…', options: [{ id: 'a', label: 'Half' }, { id: 'b', label: 'A third' }, { id: 'c', label: 'An eighth' }, { id: 'd', label: 'The same' }], correct: 'c', explanation: '168 ÷ 1280 ≈ 0.13.' },
      { id: 'q4', prompt: 'Where do the details go in a social post?', options: [{ id: 'a', label: 'All in the image' }, { id: 'b', label: 'In the caption and on the landing page' }, { id: 'c', label: 'Nowhere' }, { id: 'd', label: 'In the logo' }], correct: 'b', explanation: 'The image stops the scroll; the caption and page explain.' },
    ],
  },
  ladder: [
    { id: 'l1', prompt: 'What makes a set of posts read as one campaign?', hint: 'What stays the same?', options: [{ id: 'a', label: 'Using every brand colour in each' }, { id: 'b', label: 'One message and a repeated look: the same type, colours, mark placement and photo style across formats' }, { id: 'c', label: 'Posting them on the same day' }, { id: 'd', label: 'The same hashtag only' }], correct: 'b', explanation: 'Repetition is how people start recognising you before they read.' },
    { id: 'l2', prompt: 'Why should important text not go in the bottom-right of a YouTube thumbnail?', hint: 'Something sits there.', options: [{ id: 'a', label: 'It’s bad luck' }, { id: 'b', label: 'The video length is drawn over that corner' }, { id: 'c', label: 'YouTube crops it off' }, { id: 'd', label: 'It’s reserved for the logo' }], correct: 'b', explanation: 'Every platform draws its own UI over part of your asset.' },
    { id: 'l3', prompt: 'A post’s photo has a sun and a headline on a busy street scene. How do you keep the text readable?', hint: 'Contrast, again.', options: [{ id: 'a', label: 'Thinner text' }, { id: 'b', label: 'Put the text on a calm area, or a solid or gradient panel, and check it reaches 4.5:1' }, { id: 'c', label: 'Add a drop shadow and hope' }, { id: 'd', label: 'Make the text rainbow' }], correct: 'b', explanation: 'Text on photos needs a quiet background (ui.3-4).' },
    { id: 'l4', prompt: 'Who should be able to make next week’s post without the designer?', hint: 'Templates.', options: [{ id: 'a', label: 'Nobody' }, { id: 'b', label: 'The marketing team, from locked templates in a tool they use, with only the words and photo editable' }, { id: 'c', label: 'Only the agency' }, { id: 'd', label: 'An intern with the logo files' }], correct: 'b', explanation: 'The br.2 guide sets the rules; templates make them automatic.' },
    { id: 'l5', prompt: 'How do you know which campaign asset worked?', hint: 'Track it.', options: [{ id: 'a', label: 'Likes' }, { id: 'b', label: 'Give each format its own tagged link (UTM) and compare trial starts on the landing page, not just likes' }, { id: 'c', label: 'Ask the agency' }, { id: 'd', label: 'The most shared one' }], correct: 'b', explanation: 'Likes are vanity metrics; sign-ups are the outcome (st.3).' },
  ],
};

export const br3_4: Episode = {
  lessonId: 'br.3-4',
  hook: 'People searching “meditation app” never found Sukoon’s launch page. To Google it was a title cut off at “Official Website of…”, two H1s and a 2.4 MB picture.',
  scene: {
    id: 'seo-read', duration: 36,
    beats: [
      { at: 0, title: 'What people see', body: 'The launch page looks right: sand, the half-sun, “Calm in five minutes, between meetings” over a photo.' },
      { at: 6, title: 'What Google reads', body: 'A title starting “Home | Welcome to the Official Website…”, no description, an address of /index.php?page_id=42.' },
      { at: 11, title: 'The headline is a picture', body: 'The headline is baked into hero.png, so the page’s H1s are “Sukoon” and “Welcome”. The hero weighs 2.4 MB: about 6.4 seconds on slow 4G.' },
      { at: 16, title: 'The result, fixed', body: '“5-minute meditation app | Sukoon”, a description that sells the click, and /meditation-app.' },
      { at: 21, title: 'An outline that makes sense', body: 'One H1, the headline as live text. How it works, Pricing and Questions as H2s, not an H4 then H2s.' },
      { at: 26, title: 'Pictures with words', body: 'The reviews screenshot gets alt text; the decorative wave an empty alt. The hero becomes a 140 kB WebP.' },
      { at: 31, title: 'Links that go somewhere', body: '“Click here” becomes “See plans and prices”, and the Start button becomes a real link. Now people can find the page, and so can Google.' },
    ],
  },
  check: [
    { id: 'c1', prompt: 'Why couldn’t Google read the headline?', options: [{ id: 'a', label: 'It was too short' }, { id: 'b', label: 'It was part of an image, not text in the page' }, { id: 'c', label: 'Google ignores headlines' }],
      correct: 'b', explanation: 'Set headlines as live text; alt text is a poor substitute for an H1.' },
    { id: 'c2', prompt: 'What does the title tag become?', options: [{ id: 'a', label: 'The blue link in the search result' }, { id: 'b', label: 'The page’s footer' }, { id: 'c', label: 'The logo' }],
      correct: 'a', explanation: 'With the description under it, it’s your advert in the results.' },
  ],
  game: {
    id: 'serp-spot', title: 'Read it like Google',
    instructions: 'Each card is something wrong with how search sees Sukoon’s page. Flip between what visitors see and what Google reads, then tap the part of the page where the problem lives. Each right tap fixes it, and the search result updates.',
    lanes: [
      { id: 'snippet', label: 'Search result', hint: 'Title, description, address' },
      { id: 'headings', label: 'Headings', hint: 'The H1 and the outline' },
      { id: 'images', label: 'Images', hint: 'Alt text, text in pictures, weight' },
      { id: 'links', label: 'Links and buttons', hint: 'What they say, where they go' },
    ],
    cards: [
      { id: 'g1', ...seo('titleLong', 'Google cuts the blue link off at “Official Website of Sukoon Wellness …”'), note: 'Google shows about 60 characters. “5-minute meditation app | Sukoon” fits, with the brand last.' },
      { id: 'g2', ...seo('h1', 'The page has two H1s, “Sukoon” and “Welcome”, and neither says what it is'), note: 'One H1, and it’s the headline: “Calm in five minutes, between meetings”.' },
      { id: 'g3', ...seo('heavy', 'The first screen takes over six seconds to appear on a slow 4G phone'), note: 'A 2,400 kB PNG becomes a 140 kB WebP at the size it’s shown. Speed counts for ranking and for people.' },
      { id: 'g4', ...seo('desc', 'Under the link, Google shows “Home · Login · We use cookies…”'), note: 'With no description, Google picks any text. Write one under 160 characters that sells the click.' },
      { id: 'g5', ...seo('crawl', 'Google never finds the sign-up page'), note: 'The Start button is a div that only works with script. A real link, <a href="/start">, can be followed.' },
      { id: 'g6', ...seo('alt', 'Google and screen readers get nothing from the 4.8-star reviews'), note: 'The reviews are a screenshot with no alt. “Rated 4.8 by 12,000 people on the Play Store” says what it shows.' },
      { id: 'g7', ...seo('titleQuery', 'The title never mentions meditation, so it doesn’t match what people search'), note: 'Start with the words people type: “5-minute meditation app”, not “Home”.' },
      { id: 'g8', ...seo('skip', 'In the outline, “How it works” is an H4 straight under the H1'), note: 'Headings step down one level at a time: H1, then H2s. Pick heading levels for structure, and size them with styles.' },
      { id: 'g9', ...seo('slug', 'The address is sukoon.app/index.php?page_id=42'), note: 'A readable address, /meditation-app, is clearer in the result and when shared.' },
      { id: 'g10', ...seo('textImage', 'Search the page for “between meetings” and nothing matches'), note: 'The headline is pixels in hero.png. Set it as live text over the photo, so it can be read, selected and translated.' },
      { id: 'g11', ...seo('linkText', 'A link in the pricing section just says “Click here”'), note: 'Link text tells search engines and screen readers where it goes: “See plans and prices”.' },
    ],
  },
  gap: {
    id: 'gap', from: 6, at: 10.4,
    prompt: 'The title Google shows starts “Home | Welcome to the Official Website…”. What should it say?',
    options: [{ id: 'a', label: 'Sukoon Wellness Private Limited' }, { id: 'b', label: '5-minute meditation app | Sukoon' }, { id: 'c', label: 'Best meditation app meditation app India' }],
    correct: 'b', explanation: 'The searcher’s words first, the brand last, under 60 characters, and no keyword stuffing.',
  },
  takeaways: [
    { title: 'Design the search result', body: 'Title under 60 characters, searchers’ words first; a description that sells the click.' },
    { title: 'Structure is in the code', body: 'One H1, headings in steps, headlines as live text.' },
    { title: 'Pictures need words and diets', body: 'Alt text for informative images, empty alt for decoration, exported small.' },
    { title: 'Links that go somewhere', body: 'Descriptive link text, and buttons that are real links.' },
  ],
  quiz: {
    seconds: 12,
    questions: [
      { id: 'q1', prompt: 'How many H1s should a page have?', options: [{ id: 'a', label: 'One' }, { id: 'b', label: 'As many as you like' }], correct: 'a', explanation: 'One main heading, then H2s.' },
      { id: 'q2', prompt: 'Google cuts titles at about…', options: [{ id: 'a', label: '20 characters' }, { id: 'b', label: '60 characters' }, { id: 'c', label: '300 characters' }], correct: 'b', explanation: 'Around 600 px wide on desktop.' },
      { id: 'q3', prompt: 'A decorative wave image should have…', options: [{ id: 'a', label: 'Keywords as alt' }, { id: 'b', label: 'A long description' }, { id: 'c', label: 'An empty alt, alt=""' }, { id: 'd', label: 'No alt attribute at all' }], correct: 'c', explanation: 'Empty alt tells screen readers to skip it.' },
      { id: 'q4', prompt: 'A 2,400 kB image on a 3 Mbps connection takes about…', options: [{ id: 'a', label: '0.6 s' }, { id: 'b', label: '2 s' }, { id: 'c', label: '6.4 s' }, { id: 'd', label: '24 s' }], correct: 'c', explanation: '2,400 kB × 8 = 19.2 megabits; ÷ 3 = 6.4 s.' },
    ],
  },
  ladder: [
    { id: 'l1', prompt: 'What does an og:image tag do?', hint: 'br.3-3.', options: [{ id: 'a', label: 'Sets the favicon' }, { id: 'b', label: 'Chooses the picture shown when the page is shared on WhatsApp, LinkedIn and others' }, { id: 'c', label: 'Ranks the page higher' }, { id: 'd', label: 'Compresses images' }], correct: 'b', explanation: 'With og:title and og:description it designs the link preview.' },
    { id: 'l2', prompt: 'Why does SEO overlap so much with accessibility?', hint: 'Who else reads code?', options: [{ id: 'a', label: 'It doesn’t' }, { id: 'b', label: 'Search engines and screen readers both read the code: headings, alt text, link text and real links help both' }, { id: 'c', label: 'Google is blind' }, { id: 'd', label: 'By law' }], correct: 'b', explanation: 'Semantic HTML serves both (ax.2-2).' },
    { id: 'l3', prompt: 'Which of these does Google use to judge page experience?', hint: 'Core Web Vitals.', options: [{ id: 'a', label: 'The number of colours' }, { id: 'b', label: 'How fast the main content appears, how quickly the page responds, and how much the layout jumps' }, { id: 'c', label: 'The font' }, { id: 'd', label: 'The logo size' }], correct: 'b', explanation: 'LCP, INP and CLS, and designers affect all three: image weight, heavy effects, and reserved space for images.' },
    { id: 'l4', prompt: 'Kabir wants “meditation app” repeated 30 times in white text on white. What do you say?', hint: 'Spam.', options: [{ id: 'a', label: 'Good idea' }, { id: 'b', label: 'No: hidden text and keyword stuffing break Google’s spam rules and can get the page demoted' }, { id: 'c', label: 'Only 15 times' }, { id: 'd', label: 'Use grey instead' }], correct: 'b', explanation: 'Write for people, in their words, once each where it fits.' },
    { id: 'l5', prompt: 'How would you know if the SEO fixes worked?', hint: 'Search Console.', options: [{ id: 'a', label: 'Google the brand name' }, { id: 'b', label: 'Watch impressions, clicks and click rate for searches like “meditation app” in Google Search Console over the following weeks' }, { id: 'c', label: 'Count the H2s' }, { id: 'd', label: 'Check the next day' }], correct: 'b', explanation: 'Search changes take weeks to show; measure the queries you care about.' },
  ],
};
