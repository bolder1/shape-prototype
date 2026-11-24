// Episodes for chapter st.3 · Metrics that matter. Drafts by Claude, for review.
// Kahaani is a Hyderabad app of bedtime audio stories for children, in Hindi, Telugu and English. Sameer Rao founded it,
// Kunal is its product manager and Tara its product designer. Pooja Reddy listens with her son Advik, 5, in Kondapur;
// his grandmother Lakshmi, 68, lives in Vizag. st.1 covered outcomes and prioritising; this chapter is about choosing
// the numbers that say whether the product is working, and setting the product up to record them.
import { AWAAZ_HEART, KAHAANI_METRICS, type AwaazLine, type KahaaniMetric, type Episode } from '../episode';

const metric = (m: KahaaniMetric) => KAHAANI_METRICS[m].name;
const line = (l: AwaazLine) => AWAAZ_HEART[l].text;

export const st3_1: Episode = {
  lessonId: 'st.3-1',
  hook: 'Minutes played were up 40%. So were the children still awake at 10:30 pm, and the parents switching Kahaani’s notifications off.',
  scene: {
    id: 'metric-tree', duration: 36,
    beats: [
      { at: 0, title: 'A dashboard of good news', body: 'Kunal’s Monday dashboard: 1 lakh downloads, 9 lakh stories ever played, minutes played up 40% since autoplay. The team cheers.' },
      { at: 6, title: 'What’s behind the minutes', body: 'Autoplay keeps going after Advik falls asleep, and long stories keep him awake. Pooja turns off notifications. The minutes went up; the nights got worse.' },
      { at: 12, title: 'What do families come for?', body: 'Tara asks one question: what does a family get from Kahaani? A child who finishes a story and falls asleep. So the north star is story-nights a week.' },
      { at: 17, title: 'Break it into inputs', body: 'Story-nights = families listening × nights each opens Kahaani × the share of those nights a story is finished. 40,000 × 3.5 × 60% ≈ 84,000.' },
      { at: 23, title: 'A lever for each team', body: 'Onboarding owns families who finish a story in week one. The player team owns the finish share. Content owns new Telugu stories. Each can move theirs in weeks.' },
      { at: 28, title: 'Guardrails', body: 'Pushing harder mustn’t cost sleep: children still listening after 10 pm and parents muting notifications sit beside the tree, and must not rise.' },
      { at: 32, title: 'Into the bin', body: 'Downloads and stories ever played only go up. They can’t tell you anything went wrong, so they leave the dashboard.' },
    ],
  },
  check: [
    { id: 'c1', prompt: 'Why was “minutes played up 40%” misleading?', options: [{ id: 'a', label: 'The number was wrong' }, { id: 'b', label: 'It rose because autoplay kept playing after children slept, while families got less of what they came for' }, { id: 'c', label: 'Minutes should be counted in hours' }],
      correct: 'b', explanation: 'A metric can rise while the experience gets worse. That’s why the north star has to count value, not activity.' },
    { id: 'c2', prompt: 'What makes “story-nights a week” a good north star?', options: [{ id: 'a', label: 'It’s the biggest number' }, { id: 'b', label: 'It counts the value a family gets, and it falls if they stop getting it' }, { id: 'c', label: 'One team can move it in a day' }],
      correct: 'b', explanation: 'It goes down when families stop getting value, so it can warn you.' },
  ],
  game: {
    id: 'metric-flow', title: 'Wire the metric tree',
    instructions: 'Each card is a metric someone at Kahaani wants on the dashboard. Wire it into the tree: the north star, an input under it, a guardrail beside it, or the vanity bin.',
    lanes: [
      { id: 'north', label: 'North star', hint: 'The value families get, owned by no single team' },
      { id: 'input', label: 'Input', hint: 'A lever one team can pull in weeks that moves the north star' },
      { id: 'guardrail', label: 'Guardrail', hint: 'A harm that must not rise while you push' },
      { id: 'vanity', label: 'Vanity', hint: 'A running total, or a number that can rise while families get less' },
    ],
    cards: [
      { id: 'g1', label: metric('nights'), lane: 'north', visual: 'nights', note: 'It counts the thing families come for, and it falls when they stop getting it. Everything else on the tree exists to move it.' },
      { id: 'g2', label: metric('downloads'), lane: 'vanity', visual: 'downloads', note: 'It only ever goes up, even in a week when every family stops listening. Keep it for the press release.' },
      { id: 'g3', label: metric('firstweek'), lane: 'input', visual: 'firstweek', note: 'The onboarding team can move it in weeks, and families who finish a first story early keep coming back. A lever.' },
      { id: 'g4', label: metric('late'), lane: 'guardrail', visual: 'late', note: 'A story that keeps Advik awake is a failure, however long it plays. If this rises, stop and look, even if the north star went up.' },
      { id: 'g5', label: metric('finish'), lane: 'input', visual: 'finish', note: 'The player team owns it: shorter starts, a sleep timer, the next story in the same language. It feeds the north star directly.' },
      { id: 'g6', label: metric('screens'), lane: 'vanity', visual: 'screens', note: 'A team can push it up, but more screens at bedtime usually means a parent hunting for something. It doesn’t move story-nights.' },
      { id: 'g7', label: metric('opens'), lane: 'input', visual: 'opens', note: 'More nights opened means more chances for a story-night. Reminders and a bedtime routine move it.' },
      { id: 'g8', label: metric('played'), lane: 'vanity', visual: 'played', note: 'It sounds like value, but it’s a running total: it can’t fall, so it can’t warn you. The weekly count of finished stories is the useful version.' },
      { id: 'g9', label: metric('mute'), lane: 'guardrail', visual: 'mute', note: 'Push reminders too hard and parents switch them off for good. Watch it whenever a team pulls the “nights opened” lever.' },
      { id: 'g10', label: metric('shelf'), lane: 'input', visual: 'shelf', note: 'Telugu families finish fewer stories because there are fewer short ones. The content team can move this, and it moves the finish share.' },
    ],
  },
  gap: {
    id: 'gap', from: 23, at: 27.6,
    prompt: 'The content team proposes making every story 25 minutes long, to push minutes played. What does the tree say?',
    options: [{ id: 'a', label: 'Do it: more minutes is more value' }, { id: 'b', label: 'Don’t: longer stories lower the finish share and push up listening after 10 pm, so story-nights would fall' }, { id: 'c', label: 'Ask the CEO' }],
    correct: 'b', explanation: 'The tree turns an argument into a check: which input does this move, and which guardrail does it touch?',
  },
  takeaways: [
    { title: 'Count the value', body: 'A north star counts what users get, and falls when they stop getting it.' },
    { title: 'Inputs are levers', body: 'Break it into a few inputs that teams can move in weeks, and give each an owner.' },
    { title: 'Guard the harms', body: 'Put the costs beside the tree, so pushing a number can’t quietly hurt people.' },
    { title: 'Totals are vanity', body: 'A number that only goes up can’t tell you anything went wrong.' },
  ],
  quiz: {
    seconds: 12,
    questions: [
      { id: 'q1', prompt: '“Total downloads since launch” is…', options: [{ id: 'a', label: 'A vanity metric' }, { id: 'b', label: 'An input metric' }], correct: 'a', explanation: 'A running total can’t fall, so it can’t warn you.' },
      { id: 'q2', prompt: 'Who owns the north star?', options: [{ id: 'a', label: 'The design team' }, { id: 'b', label: 'The whole company; teams own the inputs under it' }, { id: 'c', label: 'Whoever made the dashboard' }], correct: 'b', explanation: 'It moves slowly and needs every team. Inputs are where ownership lives.' },
      { id: 'q3', prompt: 'A guardrail metric is…', options: [{ id: 'a', label: 'The biggest input' }, { id: 'b', label: 'A harm that must not rise while you push the north star' }, { id: 'c', label: 'A target for next year' }], correct: 'b', explanation: 'It stops a team winning its number by hurting users.' },
      { id: 'q4', prompt: 'Which company’s north star is often given as “nights booked”?', options: [{ id: 'a', label: 'Airbnb' }, { id: 'b', label: 'Swiggy' }, { id: 'c', label: 'WhatsApp' }, { id: 'd', label: 'Google Maps' }], correct: 'a', explanation: 'A night someone stays is the value both guest and host get.' },
    ],
  },
  ladder: [
    { id: 'l1', prompt: 'Why is “minutes played” a weak north star for a bedtime app?', hint: 'What’s a good night for a five-year-old?', options: [{ id: 'a', label: 'Minutes are hard to count' }, { id: 'b', label: 'More minutes can mean a child who can’t sleep, so it rises when the product fails' }, { id: 'c', label: 'Parents don’t care about time' }, { id: 'd', label: 'It isn’t big enough' }], correct: 'b', explanation: 'For Kahaani, a short story that ends in sleep is the win. A good north star rewards that.' },
    { id: 'l2', prompt: 'What makes a good input metric?', hint: 'Who can move it, and how fast?', options: [{ id: 'a', label: 'It’s the north star, split by city' }, { id: 'b', label: 'A team can move it within weeks, and moving it moves the north star' }, { id: 'c', label: 'It’s a running total' }, { id: 'd', label: 'Investors like it' }], correct: 'b', explanation: 'An input is a lever: owned, quick to respond, and connected to the value.' },
    { id: 'l3', prompt: '“When a measure becomes a target, it ceases to be a good measure.” Whose law is this, in Marilyn Strathern’s phrasing?', hint: 'An economist, 1975.', options: [{ id: 'a', label: 'Murphy' }, { id: 'b', label: 'Goodhart' }, { id: 'c', label: 'Moore' }, { id: 'd', label: 'Hick' }], correct: 'b', explanation: 'Goodhart’s law. Guardrails are how you notice a team gaming its number.' },
    { id: 'l4', prompt: 'The player team ships autoplay and the finish share goes up, but listening after 10 pm doubles. What now?', hint: 'Which line is the stop sign?', options: [{ id: 'a', label: 'Celebrate the input' }, { id: 'b', label: 'Treat the guardrail as a stop sign: roll back or change autoplay until late listening is back down' }, { id: 'c', label: 'Remove the guardrail from the dashboard' }, { id: 'd', label: 'Wait for the quarter to end' }], correct: 'b', explanation: 'A guardrail that moves means the win cost users something. It has to be fixed, not explained away.' },
    { id: 'l5', prompt: 'Where does a designer use a metric tree day to day?', hint: 'Think of a design review.', options: [{ id: 'a', label: 'Only in the quarterly report' }, { id: 'b', label: 'To say which input a design should move, how you’ll know, and which guardrail it might touch' }, { id: 'c', label: 'To pick colours for the chart' }, { id: 'd', label: 'Never; metrics are for PMs' }], correct: 'b', explanation: 'Naming the input and the guardrail up front turns “I think it’s better” into something you can check.' },
  ],
};

export const st3_2: Episode = {
  lessonId: 'st.3-2',
  hook: 'Kunal posted “12,000 recordings since launch!” Lakshmi, 68, had started three of them and finished none.',
  scene: {
    id: 'heart-goals', duration: 36,
    beats: [
      { at: 0, title: 'Apni Awaaz ships', body: 'Kahaani’s new feature lets a grandparent record a story in their own voice. A week later the launch post says: 12,000 recordings since launch.' },
      { at: 6, title: 'Lakshmi in Vizag', body: 'Advik’s grandmother starts the monkey and the crocodile three times. Each time her screen locks, the recording stops, and she gives up.' },
      { at: 11, title: 'Five kinds of experience', body: 'Tara draws Google’s HEART grid: Happiness, Engagement, Adoption, Retention, Task success. A total fits none of the rows.' },
      { at: 16, title: 'Goals first', body: 'For each row, a goal in words. Task success: a 70-year-old can record a story without help. Retention: recorders keep recording, not just once.' },
      { at: 21, title: 'Then signals', body: 'What would you notice if the goal were true, or false? Grandparents giving up halfway. Families coming back to record another.' },
      { at: 26, title: 'Then metrics', body: 'Share of recordings started that are saved: 41%. Median time to save one: 14 minutes. Now the problem has a number.' },
      { at: 31, title: 'Fix and measure', body: 'Recording keeps going when the screen locks. Next week, 78% of recordings are saved, and Lakshmi’s story plays in Kondapur.' },
    ],
  },
  check: [
    { id: 'c1', prompt: 'What did “12,000 recordings since launch” hide?', options: [{ id: 'a', label: 'Nothing; it was a success' }, { id: 'b', label: 'That most recordings were started and abandoned, so the feature was failing at the task' }, { id: 'c', label: 'The number of downloads' }],
      correct: 'b', explanation: 'A running total counts attempts. It can’t say whether anyone succeeded.' },
    { id: 'c2', prompt: 'In what order did Tara fill the grid?', options: [{ id: 'a', label: 'Metrics, then goals' }, { id: 'b', label: 'Goals, then signals, then metrics' }, { id: 'c', label: 'Whatever the analytics tool offered' }],
      correct: 'b', explanation: 'Goals, signals, metrics: start from what you want to be true.' },
  ],
  game: {
    id: 'heart-grid', title: 'Fill the HEART grid',
    instructions: 'Each card is a line from the Apni Awaaz plan. Say whether it’s a signal, a metric, or a number to cut. Then put signals and metrics in their HEART row, next to the goal they belong to.',
    lanes: [
      { id: 'signal', label: 'Signal', hint: 'Something you could notice people doing or feeling' },
      { id: 'metric', label: 'Metric', hint: 'A rate, share or average over a time window' },
      { id: 'cut', label: 'Cut', hint: 'A running total that can only go up' },
    ],
    cards: [
      { id: 'g1', label: line('tsig'), lane: 'signal', visual: 'tsig', note: 'A task-success signal: you can see it in the recordings that stop. Its metric is the share of recordings that get saved.' },
      { id: 'g2', label: line('total'), lane: 'cut', visual: 'total', note: 'Every abandoned attempt still counts, so it rose all week while Lakshmi gave up. Cut it, or show it beside a rate.' },
      { id: 'g3', label: line('hmet'), lane: 'metric', visual: 'hmet', note: 'Happiness, measured: a one-question rating right after the story plays, averaged each week.' },
      { id: 'g4', label: line('esig'), lane: 'signal', visual: 'esig', note: 'Engagement you can notice: a child asking for the same voice again. Plays per recording counts it.' },
      { id: 'g5', label: line('amet'), lane: 'metric', visual: 'amet', note: 'Adoption: a share of the families who could use it, over a set window. “12,000 recordings” never said how many families tried.' },
      { id: 'g6', label: line('rsig'), lane: 'signal', visual: 'rsig', note: 'Retention’s signal: a second recording means the first one was worth it.' },
      { id: 'g7', label: line('tmet'), lane: 'metric', visual: 'tmet', note: 'Task success has two halves: did they finish, and how long did it take? 41% and 14 minutes was the alarm.' },
      { id: 'g8', label: line('hsig'), lane: 'signal', visual: 'hsig', note: 'A happiness signal, straight from interviews. The weekly rating turns it into a number.' },
      { id: 'g9', label: line('emet'), lane: 'metric', visual: 'emet', note: 'Engagement per recording, in a fixed window, so old and new recordings compare fairly.' },
      { id: 'g10', label: line('rmet'), lane: 'metric', visual: 'rmet', note: 'Retention: of the people who recorded once, the share who did it again within four weeks.' },
      { id: 'g11', label: line('asig'), lane: 'signal', visual: 'asig', note: 'Adoption you can watch for: someone trying it for the first time. The metric makes it a share of families.' },
      { id: 'g12', label: line('taps'), lane: 'cut', visual: 'taps', note: 'Taps aren’t recordings, and a total can’t fall. If Record gets lots of taps and few saves, the save rate will show it.' },
    ],
  },
  gap: {
    id: 'gap', from: 21, at: 25.6,
    prompt: 'Which number should Tara put on the task-success row?',
    options: [{ id: 'a', label: 'Total recordings since launch' }, { id: 'b', label: 'The share of recordings started that are saved, and how long one takes' }, { id: 'c', label: 'App downloads in Vizag' }],
    correct: 'b', explanation: 'Task success asks whether people can do it, and how easily. A total can’t answer either.',
  },
  takeaways: [
    { title: 'Five kinds of experience', body: 'Happiness, Engagement, Adoption, Retention, Task success. Pick the ones that fit the feature.' },
    { title: 'Goals, signals, metrics', body: 'Say what should be true, what you’d notice, then the number that counts it.' },
    { title: 'Rates over totals', body: 'A metric is a share, rate or average over a time window, so it can fall.' },
    { title: 'Task success is design’s row', body: 'Completion and time tell you whether the screen works for the people using it.' },
  ],
  quiz: {
    seconds: 12,
    questions: [
      { id: 'q1', prompt: 'The “A” in HEART stands for…', options: [{ id: 'a', label: 'Adoption' }, { id: 'b', label: 'Accessibility' }], correct: 'a', explanation: 'New people starting to use the product or feature.' },
      { id: 'q2', prompt: '“Share of recorders who record again within 4 weeks” measures…', options: [{ id: 'a', label: 'Happiness' }, { id: 'b', label: 'Retention' }, { id: 'c', label: 'Task success' }], correct: 'b', explanation: 'Coming back after a while is retention.' },
      { id: 'q3', prompt: 'Which comes first in the goals–signals–metrics process?', options: [{ id: 'a', label: 'The metric' }, { id: 'b', label: 'The goal' }, { id: 'c', label: 'The dashboard' }], correct: 'b', explanation: 'Start with what you want to be true.' },
      { id: 'q4', prompt: 'Where did HEART come from?', options: [{ id: 'a', label: 'A 2010 paper by Google researchers' }, { id: 'b', label: 'Apple’s design guidelines' }, { id: 'c', label: 'The Nielsen Norman Group’s heuristics' }, { id: 'd', label: 'A 1990s marketing book' }], correct: 'a', explanation: 'Kerry Rodden, Hilary Hutchinson and Xin Fu, presented at CHI 2010.' },
    ],
  },
  ladder: [
    { id: 'l1', prompt: 'Why might Tara leave Engagement out of the Apni Awaaz plan at first?', hint: 'Not every row fits every feature.', options: [{ id: 'a', label: 'Engagement is never useful' }, { id: 'b', label: 'Recording is something a grandparent does now and then; whether they succeed and come back matters more than how often' }, { id: 'c', label: 'It’s too hard to count' }, { id: 'd', label: 'HEART only allows three rows' }], correct: 'b', explanation: 'Pick the dimensions that match the goal. Measuring all five can bury the one that matters.' },
    { id: 'l2', prompt: 'How can you measure Happiness without annoying people?', hint: 'One question, at the right moment.', options: [{ id: 'a', label: 'A 20-question survey every night' }, { id: 'b', label: 'A one-question rating right after the moment, shown to a sample, tracked over weeks' }, { id: 'c', label: 'Count the smiley emojis in reviews' }, { id: 'd', label: 'Ask the sales team' }], correct: 'b', explanation: 'Short, well-timed and sampled keeps the signal clean and the parents calm.' },
    { id: 'l3', prompt: 'The save rate rose from 41% to 78%, but the median time to save went up too. What could that mean?', hint: 'More people finishing.', options: [{ id: 'a', label: 'The fix failed' }, { id: 'b', label: 'Slower recorders who used to give up now finish, which pulls the median up; check it by age before calling it a problem' }, { id: 'c', label: 'The data is broken' }, { id: 'd', label: 'Nothing; ignore time' }], correct: 'b', explanation: 'When a fix lets new people succeed, averages shift. Look at who is in the number.' },
    { id: 'l4', prompt: 'HEART measures user experience. How does it relate to Kahaani’s north star?', hint: 'st.3-1.', options: [{ id: 'a', label: 'It replaces the north star' }, { id: 'b', label: 'HEART metrics for a feature are inputs or guardrails: they should explain how the feature moves story-nights' }, { id: 'c', label: 'They’re unrelated' }, { id: 'd', label: 'HEART is only for B2B products' }], correct: 'b', explanation: 'A feature’s HEART plan zooms in; the north star says why the feature matters at all.' },
    { id: 'l5', prompt: 'Which pair of metrics best shows Task success for recording a story?', hint: 'Did they finish, and how easily?', options: [{ id: 'a', label: 'Downloads and ratings' }, { id: 'b', label: 'Share of recordings saved, and median minutes to save one' }, { id: 'c', label: 'Total taps and total recordings' }, { id: 'd', label: 'Monthly revenue and churn' }], correct: 'b', explanation: 'Completion plus time (or errors) is the classic task-success pair.' },
  ],
};

export const st3_3: Episode = {
  lessonId: 'st.3-3',
  hook: 'Week-1 retention fell from 41% to 35% the month Kahaani changed its first night. Kunal wanted it rolled back by Friday.',
  scene: {
    id: 'cohort-triangle', duration: 38,
    beats: [
      { at: 0, title: 'One line goes down', body: 'Kunal’s dashboard: share of new families who come back in their second week. October: 41%. November: 35%. The new first night shipped on 9 November.' },
      { at: 6, title: 'The funnel first', body: 'Tara follows 10,000 new families step by step. 82% add a child, 74% of those start a story, but only 56% finish it. That’s the biggest drop.' },
      { at: 12, title: 'Group them by week', body: 'She lays the families out by the week they joined, one row each, with week 0, 1, 2… across. The rows get shorter: newer weeks haven’t happened yet.' },
      { at: 18, title: 'The Diwali week', body: 'The 2 November row is three times bigger: Diwali ads brought 6,000 families, and only 22% came back. They weren’t looking for bedtime stories.' },
      { at: 23, title: 'After the change', body: 'The 9 and 16 November rows come back at 52% and 54%, against 40–42% in October. The change worked.' },
      { at: 28, title: 'Why the average fell', body: 'Blend November together and the big Diwali row outweighs the two good ones: 35%. The average hid both stories.' },
      { at: 32, title: 'Split by language', body: 'One more cut: Hindi families finish 60% of first stories, Telugu families 40%. There are only a handful of short Telugu stories.' },
    ],
  },
  check: [
    { id: 'c1', prompt: 'What does a cohort table show that the funnel doesn’t?', options: [{ id: 'a', label: 'Which step people drop at' }, { id: 'b', label: 'Whether families who joined in different weeks stick differently over time' }, { id: 'c', label: 'Total downloads' }],
      correct: 'b', explanation: 'A funnel is steps; a cohort table is weeks. You need cohorts to see a change working.' },
    { id: 'c2', prompt: 'Why did November’s average fall although the change worked?', options: [{ id: 'a', label: 'The change broke something' }, { id: 'b', label: 'A big, low-intent Diwali-ads cohort outweighed the two better cohorts in the blend' }, { id: 'c', label: 'November has fewer days' }],
      correct: 'b', explanation: 'Blending gives the biggest group the most say. Look at each cohort before trusting the average.' },
  ],
  game: {
    id: 'cohort-read', title: 'Read the data',
    instructions: 'Each card is a question the team asked about new families. Open the view that answers it: the funnel, the cohort table or the language split. Then estimate the answer on the slider before it’s revealed.',
    lanes: [
      { id: 'funnel', label: 'Funnel', hint: 'The same families, step by step through one journey' },
      { id: 'cohort', label: 'Cohort table', hint: 'Families grouped by the week they joined, over the weeks after' },
      { id: 'segment', label: 'Language split', hint: 'Families grouped by something about them' },
    ],
    cards: [
      { id: 'g1', label: 'Of families who started a first story, what share finished it?', lane: 'funnel', visual: 'finishFirst', note: '3,400 of 6,100: about 56%. The biggest drop in the journey, and the player team’s job.' },
      { id: 'g2', label: 'Of the families who joined in the week of 9 November, with the new first night, what share came back in week 1?', lane: 'cohort', visual: 'newFirstNight', note: '1,144 of 2,200: 52%, up from 40–42% in October. One row of the table settles the argument.' },
      { id: 'g3', label: 'Of families listening in Telugu, what share finish the first story they start?', lane: 'segment', visual: 'telugu', note: '600 of 1,500: 40%, against 60% for Hindi. The fix is on the shelf: more short Telugu stories.' },
      { id: 'g4', label: 'Of families who installed Kahaani, what share came back a second night?', lane: 'funnel', visual: 'secondNight', note: '2,100 of 10,000: 21%. Read down the whole funnel, from the first step to the last.' },
      { id: 'g5', label: 'Of the families from the Diwali ads week of 2 November, what share came back in week 1?', lane: 'cohort', visual: 'diwali', note: '1,320 of 6,000: 22%. Judge a campaign by its cohort, not by what it does to the average.' },
      { id: 'g6', label: 'Of families listening in Hindi, what share finish the first story they start?', lane: 'segment', visual: 'hindi', note: '1,800 of 3,000: 60%. A split only helps when you compare: Hindi against Telugu.' },
      { id: 'g7', label: 'Of the families who joined in the week of 26 October, what share were still listening in week 4?', lane: 'cohort', visual: 'octWeek4', note: '600 of 2,000: 30%. October’s curve flattens around 30%: the families who stay, stay.' },
      { id: 'g8', label: 'Of families who added a child, what share went on to start a story?', lane: 'funnel', visual: 'startAfterChild', note: '6,100 of 8,200: about 74%. A step’s rate is out of the step before it, not out of everyone.' },
      { id: 'g9', label: 'Of all the families who joined in November, what share came back in week 1?', lane: 'cohort', visual: 'novBlend', note: '3,706 of 10,500: about 35%. The number on Kunal’s dashboard, and the one that nearly got a good change rolled back.' },
    ],
  },
  gap: {
    id: 'gap', from: 23, at: 31.6,
    prompt: 'Kunal still wants to roll back the new first night. What should Tara say?',
    options: [{ id: 'a', label: 'Roll it back; the average fell' }, { id: 'b', label: 'Keep it: the cohorts that got it come back at 52–54%, against 40–42% before. The average fell because of the Diwali-ads week' }, { id: 'c', label: 'Wait six months and see' }],
    correct: 'b', explanation: 'Compare like with like: new cohorts against old ones, at the same week.',
  },
  takeaways: [
    { title: 'Funnels find the drop', body: 'The same people through one journey; each step’s rate is out of the step before.' },
    { title: 'Cohorts show change', body: 'Group by join week and compare at the same week to see whether something worked.' },
    { title: 'Averages blend', body: 'One big, unusual group can drag a blended number the wrong way.' },
    { title: 'Split to explain', body: 'Cut by something about the people, like language, to find out who a problem belongs to.' },
  ],
  quiz: {
    seconds: 12,
    questions: [
      { id: 'q1', prompt: 'To see whether a change helped new users stick, look at…', options: [{ id: 'a', label: 'Cohorts' }, { id: 'b', label: 'Total users' }], correct: 'a', explanation: 'Compare cohorts before and after the change.' },
      { id: 'q2', prompt: '8,200 families added a child and 6,100 started a story. The step’s rate is…', options: [{ id: 'a', label: '61%' }, { id: 'b', label: 'About 74%' }, { id: 'c', label: '82%' }], correct: 'b', explanation: '6,100 ÷ 8,200. Out of the step before, not out of installs.' },
      { id: 'q3', prompt: 'Why are the newest rows of a cohort table shorter?', options: [{ id: 'a', label: 'Data was lost' }, { id: 'b', label: 'Those weeks haven’t happened yet for the newest cohorts' }, { id: 'c', label: 'Fewer people joined' }], correct: 'b', explanation: 'A family that joined last week can’t have a week 3 yet.' },
      { id: 'q4', prompt: 'A blended number moves one way while every group in it moves the other. This is called…', options: [{ id: 'a', label: 'Simpson’s paradox' }, { id: 'b', label: 'Hick’s law' }, { id: 'c', label: 'The peak-end rule' }, { id: 'd', label: 'Survivorship bias' }], correct: 'a', explanation: 'A change in the mix of groups can flip the overall trend.' },
    ],
  },
  ladder: [
    { id: 'l1', prompt: 'What does a retention curve that flattens out, rather than falling to zero, tell you?', hint: 'Who’s left?', options: [{ id: 'a', label: 'The data stopped' }, { id: 'b', label: 'A core of users keeps getting value, a good sign the product fits someone' }, { id: 'c', label: 'Everyone will leave soon' }, { id: 'd', label: 'The cohort was too small' }], correct: 'b', explanation: 'October’s curves flatten near 30%. The question then is who those families are.' },
    { id: 'l2', prompt: 'Why must a funnel follow the same people?', hint: 'Mixing groups.', options: [{ id: 'a', label: 'It doesn’t matter' }, { id: 'b', label: 'Counting each step across different people and dates mixes groups, so a step can seem to gain people or hide a drop' }, { id: 'c', label: 'Privacy law' }, { id: 'd', label: 'Funnels are prettier that way' }], correct: 'b', explanation: 'Follow one group from step to step, in a fixed window, so the rates mean something.' },
    { id: 'l3', prompt: 'The Diwali cohort retains at 22%. What should the growth team learn from it?', hint: 'Judge the campaign by its own row.', options: [{ id: 'a', label: 'Stop all marketing' }, { id: 'b', label: 'The ads reached families not looking for bedtime stories; judge campaigns by their cohort’s retention, not by installs' }, { id: 'c', label: 'Nothing; installs went up' }, { id: 'd', label: 'Change the app icon' }], correct: 'b', explanation: 'Cheap installs that leave in a week cost more than they look.' },
    { id: 'l4', prompt: 'Telugu families finish 40% of first stories, Hindi families 60%. What should Tara do before redesigning the player?', hint: 'Is it the screen, or what’s on it?', options: [{ id: 'a', label: 'Redesign the player for everyone' }, { id: 'b', label: 'Check what differs for Telugu families, like the length and number of stories on offer, before changing the screen' }, { id: 'c', label: 'Remove Telugu' }, { id: 'd', label: 'Average the two and move on' }], correct: 'b', explanation: 'A segment tells you who has the problem. The cause still needs finding.' },
    { id: 'l5', prompt: 'The cohort table shows the change worked. What’s the strongest way to be sure?', hint: 'Something else changed in November too.', options: [{ id: 'a', label: 'Ask the team if they like it' }, { id: 'b', label: 'Run an A/B test: half of new families get the old first night, so the season and the ads affect both groups the same' }, { id: 'c', label: 'Look at the average again' }, { id: 'd', label: 'Wait for December' }], correct: 'b', explanation: 'Cohorts before and after can be confused by other changes. A test splits people at the same time.' },
  ],
};

export const st3_4: Episode = {
  lessonId: 'st.3-4',
  hook: 'Two weeks after the sleep timer shipped, Kunal asked if children finished more stories with it on. The only event in the data was “button_click”.',
  scene: {
    id: 'track-plan', duration: 36,
    beats: [
      { at: 0, title: 'The sleep timer ships', body: 'Kahaani’s player gets a moon button: stop the story after 10, 20 or 30 minutes. Two weeks later, Kunal asks whether it helps children finish stories.' },
      { at: 6, title: 'Nothing to answer with', body: 'The data has one event, button_click, with a screen name. No story, no timer length, nothing about how a story ended. Two weeks of nights, lost.' },
      { at: 11, title: 'Questions first', body: 'Tara writes the questions down before any event: Do stories finish more often with the timer on? Which timer length do parents pick? Where do Telugu stories get stopped?' },
      { at: 16, title: 'Events at moments', body: 'On the player she marks where each event fires: story_started when audio begins, story_finished on the last second, story_stopped when it ends early, timer_set when a parent picks a length.' },
      { at: 22, title: 'Properties answer questions', body: 'Each event carries only what a question needs: timer_on on story_finished, at_percent and reason on story_stopped, minutes on timer_set.' },
      { at: 27, title: 'Names and no names', body: 'One pattern: object_action, past tense, snake_case. And the developer’s child_name property comes out: an anonymous family id is enough.' },
      { at: 31, title: 'It ships with the design', body: 'The tracking plan sits next to the Figma file. Before release, Tara checks every event fires in the debug view, with the right properties.' },
    ],
  },
  check: [
    { id: 'c1', prompt: 'Why couldn’t “button_click” answer Kunal’s question?', options: [{ id: 'a', label: 'It fired too often' }, { id: 'b', label: 'It recorded taps, not what happened to the story, and carried none of the properties the question needed' }, { id: 'c', label: 'It was in the wrong language' }],
      correct: 'b', explanation: 'Events have to describe what happened, with the details a question needs.' },
    { id: 'c2', prompt: 'Where did Tara start the tracking plan?', options: [{ id: 'a', label: 'With every possible event' }, { id: 'b', label: 'With the questions the team will ask' }, { id: 'c', label: 'With the analytics tool’s defaults' }],
      correct: 'b', explanation: 'Questions decide which events and properties are worth recording.' },
  ],
  game: {
    id: 'event-wire', title: 'Wire the tracking plan',
    instructions: 'Each card is a question the team wants answered. Tap the moment on Kahaani’s player where the event that answers it fires. Then pick the properties it needs, and leave out anything personal.',
    lanes: [
      { id: 'story_started', label: 'story_started', hint: 'The story’s audio starts playing' },
      { id: 'story_finished', label: 'story_finished', hint: 'The last second of the story plays' },
      { id: 'story_stopped', label: 'story_stopped', hint: 'Playback stops before the end' },
      { id: 'timer_set', label: 'timer_set', hint: 'A parent picks a sleep-timer length' },
    ],
    cards: [
      { id: 'g1', label: 'When a story is finished, was the sleep timer on?', lane: 'story_finished', visual: 'timerOn', note: 'story_finished with timer_on. Compare it with stories started with the timer on, and Kunal has his answer.' },
      { id: 'g2', label: 'Where do plays start: the home shelf, search, or the next story playing by itself?', lane: 'story_started', visual: 'source', note: 'A source property on story_started. Without it, every play looks the same.' },
      { id: 'g3', label: 'Which sleep-timer length do parents pick most?', lane: 'timer_set', visual: 'minutes', note: 'timer_set with minutes. If nobody picks 30, the button can offer fewer choices.' },
      { id: 'g4', label: 'How far into a Telugu story do children stop listening?', lane: 'story_stopped', visual: 'teluguDrop', note: 'story_stopped with language and at_percent. If most stop in the first fifth, the openings are too slow.' },
      { id: 'g5', label: 'Which stories get finished most?', lane: 'story_finished', visual: 'favourite', note: 'story_id on story_finished. An id, not the title: titles get edited, ids don’t.' },
      { id: 'g6', label: 'Do stories stop because the timer ran out, or because a parent closed the app?', lane: 'story_stopped', visual: 'why', note: 'A reason property, from a fixed list (timer, pause, closed), so it can be counted.' },
      { id: 'g7', label: 'Which languages do families choose at bedtime?', lane: 'story_started', visual: 'language', note: 'language on story_started counts what families try; on story_finished, what works.' },
      { id: 'g8', label: 'Which stories make parents reach for the sleep timer?', lane: 'timer_set', visual: 'timerStory', note: 'story_id on timer_set. Long stories that keep getting a timer are a hint to write shorter ones.' },
    ],
  },
  gap: {
    id: 'gap', from: 22, at: 30.4,
    prompt: 'The developer wants to add child_name to every event “to make debugging easier”. What does Tara say?',
    options: [{ id: 'a', label: 'Fine, it’s only analytics' }, { id: 'b', label: 'No: names identify a child. An anonymous family id is enough to debug, and no question needs the name' }, { id: 'c', label: 'Only on story_finished' }],
    correct: 'b', explanation: 'Send what the questions need. Anything that identifies a person, especially a child, stays out.',
  },
  takeaways: [
    { title: 'Questions first', body: 'Write the questions, then the events and properties that answer them.' },
    { title: 'Name what happened', body: 'object_action, past tense, one pattern: story_finished, not play_btn_tap.' },
    { title: 'Only what’s needed', body: 'Each property answers a question. Nothing that identifies a person, least of all a child.' },
    { title: 'Ship it with the design', body: 'The tracking plan is part of the handoff, checked in a debug view before release.' },
  ],
  quiz: {
    seconds: 12,
    questions: [
      { id: 'q1', prompt: 'Which event name is better?', options: [{ id: 'a', label: 'timer_set' }, { id: 'b', label: 'moonBtnTap' }], correct: 'a', explanation: 'It says what happened, not which button was pressed.' },
      { id: 'q2', prompt: 'A tracking plan lists…', options: [{ id: 'a', label: 'Every screen in the app' }, { id: 'b', label: 'Events, when each fires, its properties, and the question it answers' }, { id: 'c', label: 'The release dates' }], correct: 'b', explanation: 'It’s the contract between design, engineering and whoever reads the data.' },
      { id: 'q3', prompt: 'Why use story_id rather than the story’s title?', options: [{ id: 'a', label: 'Titles are longer' }, { id: 'b', label: 'Titles change and repeat; an id stays the same' }, { id: 'c', label: 'Ids are prettier' }], correct: 'b', explanation: 'Stable ids keep the data joined up when the copy changes.' },
      { id: 'q4', prompt: 'Which property should never be sent?', options: [{ id: 'a', label: 'language' }, { id: 'b', label: 'minutes' }, { id: 'c', label: 'child_name' }, { id: 'd', label: 'reason' }], correct: 'c', explanation: 'It identifies a child and answers no question.' },
    ],
  },
  ladder: [
    { id: 'l1', prompt: 'Why should a designer, not only an engineer, write the tracking plan?', hint: 'Who knows the moments?', options: [{ id: 'a', label: 'Engineers can’t spell' }, { id: 'b', label: 'The designer knows the moments that matter and the questions the design is meant to answer' }, { id: 'c', label: 'It’s a design deliverable by law' }, { id: 'd', label: 'Designers own the database' }], correct: 'b', explanation: 'If the design has a hypothesis, the tracking plan is how it gets tested.' },
    { id: 'l2', prompt: 'Should story_finished fire when the screen shows “The end”, or when the last second of audio plays?', hint: 'What if the screen is off?', options: [{ id: 'a', label: 'When the screen shows it' }, { id: 'b', label: 'When the last second plays, because at bedtime the phone is often face down with the screen off' }, { id: 'c', label: 'When the parent taps Close' }, { id: 'd', label: 'Either; it doesn’t matter' }], correct: 'b', explanation: 'Define the trigger by what happened, not by what was on screen.' },
    { id: 'l3', prompt: 'The reason property is free text typed by the developer. What’s the risk?', hint: 'Try counting it.', options: [{ id: 'a', label: 'None' }, { id: 'b', label: '“Timer”, “timer ended” and “TIMER” become three answers; use a fixed list of values' }, { id: 'c', label: 'It uses more storage' }, { id: 'd', label: 'Text is slower' }], correct: 'b', explanation: 'Fixed values (timer, pause, closed) are what make a property countable.' },
    { id: 'l4', prompt: 'Kahaani’s listeners are children. Which approach should shape its tracking plan?', hint: 'Less is safer.', options: [{ id: 'a', label: 'Collect everything in case it’s useful' }, { id: 'b', label: 'Collect the least the questions need, tied to the parent’s account, with nothing that identifies a child; India’s DPDP Act 2023 sets stricter rules for children’s data' }, { id: 'c', label: 'Only track adults' }, { id: 'd', label: 'Ask the analytics vendor' }], correct: 'b', explanation: 'Data minimisation is good practice anywhere, and the law is stricter about children.' },
    { id: 'l5', prompt: 'How do you know the tracking works before release?', hint: 'Don’t wait two weeks again.', options: [{ id: 'a', label: 'Trust the code' }, { id: 'b', label: 'Play through each moment in a test build and check each event and its properties arrive in the analytics debug view' }, { id: 'c', label: 'Check the dashboard after launch' }, { id: 'd', label: 'Ask users' }], correct: 'b', explanation: 'A quick QA pass on events is far cheaper than two weeks of missing data.' },
  ],
};
