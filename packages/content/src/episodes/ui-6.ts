// Episodes for chapter ui.6 · Data visualization. Drafts by Claude, for review.
// Roshni puts rooftop solar on homes, housing societies and schools in eight Indian cities and runs 1,400 systems from
// one ops console. Farah Qureshi, its lead product designer, rebuilds the console's charts: the form each question
// needs, colour with one job that survives colour blindness, and a morning dashboard for Manoj Yadav, the Jaipur
// service head. The questions, charts and tiles, and the rules they're judged by, are in ../dataviz and tested there.
import type { Episode } from '../episode';
import {
  ROSHNI_CHARTS, ROSHNI_QUESTIONS, ROSHNI_TILES, chartFor, paletteFor, tileVerdict,
  type RoshniChart, type RoshniQuestion, type RoshniTile,
} from '../dataviz';

const question = (k: RoshniQuestion) => ROSHNI_QUESTIONS[k].text;
const form = (k: RoshniQuestion) => chartFor(ROSHNI_QUESTIONS[k]);
const chart = (k: RoshniChart) => ROSHNI_CHARTS[k].text;
const job = (k: RoshniChart) => paletteFor(ROSHNI_CHARTS[k]);
const tile = (k: RoshniTile) => ROSHNI_TILES[k].text;
const verdict = (k: RoshniTile) => tileVerdict(ROSHNI_TILES[k]);

export const ui6_1: Episode = {
  lessonId: 'ui.6-1',
  hook: 'Roshni’s ops console has eleven pies, four gauges and a bar chart that makes a three-point gap look fourfold. Farah starts from the questions instead.',
  scene: {
    id: 'chart-forms', duration: 36,
    beats: [
      { at: 0, title: 'A console of pies', body: 'Generation, revenue, faults, crews: every number on Roshni’s console is a pie or a gauge. Nobody can say which city is ahead.' },
      { at: 6, title: 'Length beats angle', body: 'The same eight cities as slices, then as sorted bars. Jaipur and Pune are a sliver apart as slices; as bars the gap is plain.' },
      { at: 11, title: 'Bars start at zero', body: 'Uptime of 97% against 94%, drawn from 93%: one bar looks four times the other. From zero, they’re nearly level. That is the truth.' },
      { at: 16, title: 'Lines can zoom', body: 'Ninety days of one society’s generation. A line is read by its slope, so its axis can start near the data, and the drop after day 60 shows.' },
      { at: 21, title: 'The average hides people', body: 'Switch-on takes 24 days on average. The histogram shows half wait under 20, and a tail of six waits five to nine weeks.' },
      { at: 26, title: 'Two measures, one dot', body: 'Do bigger systems get more tickets? One dot per system, size across, tickets up. Barely. Age matters more.' },
      { at: 31, title: 'Question, then form', body: 'Farah writes each question at the top of its chart. The question decides the form, and often the title too.' },
    ],
  },
  check: [
    { id: 'c1', prompt: 'Why did the cities read better as bars than as slices?', options: [{ id: 'a', label: 'Bars are more colourful' }, { id: 'b', label: 'People judge lengths on a common scale far more accurately than angles or areas' }, { id: 'c', label: 'Pies can’t show eight things' }],
      correct: 'b', explanation: 'Position and length are the most accurate channels we have. Angle and area come well after.' },
    { id: 'c2', prompt: 'Why can the 90-day line start near the data, but the uptime bars can’t?', options: [{ id: 'a', label: 'Lines are read by slope; bars are read by length, so a cut axis distorts them' }, { id: 'b', label: 'Lines have more points' }, { id: 'c', label: 'It’s just convention' }],
      correct: 'a', explanation: 'Cut a bar and its length lies. Zoom a line and its slope is still true, as long as the axis is labelled.' },
  ],
  game: {
    id: 'chart-pick', title: 'Pick the form',
    instructions: 'Each card is a question someone at Roshni asks of the data. Pick the form that answers it. Right calls draw the real data in that form, honestly scaled.',
    lanes: [
      { id: 'bar', label: 'Bars', hint: 'Compare categories, a few periods, parts' },
      { id: 'line', label: 'Line', hint: 'Change over many points in time' },
      { id: 'distribution', label: 'Histogram', hint: 'How values spread, not just the average' },
      { id: 'scatter', label: 'Scatter', hint: 'Do two measures move together?' },
    ],
    cards: [
      { id: 'g1', label: question('cities'), lane: form('cities'), visual: 'cities', note: 'Eight cities to compare: bars, sorted longest first, from zero. Jaipur leads by 72 kW, which no pie would show.' },
      { id: 'g2', label: question('heights'), lane: form('heights'), visual: 'heights', note: 'Ninety days is a slope to read. The line shows generation sliding after day 60: worth a cleaning visit before a fault.' },
      { id: 'g3', label: question('wait'), lane: form('wait'), visual: 'wait', note: 'The average is 24 days, but half wait under 20 and six wait over five weeks. Those six are the complaints.' },
      { id: 'g4', label: question('size'), lane: form('size'), visual: 'size', note: 'One dot per system. Tickets rise only a little with size, so size alone won’t predict where crews are needed.' },
      { id: 'g5', label: question('mix'), lane: form('mix'), visual: 'mix', note: 'Three parts of a whole: one stacked bar, or three sorted bars, labelled with the percentages. A pie makes 46 and 38 look alike.' },
      { id: 'g6', label: question('quarters'), lane: form('quarters'), visual: 'quarters', note: 'Four periods are four things to compare. A line between them would draw a path through months nobody measured.' },
      { id: 'g7', label: question('cloud'), lane: form('cloud'), visual: 'cloud', note: 'Each day is a dot, cloud across, generation up. The dots fall steadily: cloud explains most of the bad days, so this isn’t a fault.' },
      { id: 'g8', label: question('hours'), lane: form('hours'), visual: 'hours', note: 'Twenty-four points through the day: a line. Calls follow the sun, peaking at midday, which is when crews should be free.' },
      { id: 'g9', label: question('savings'), lane: form('savings'), visual: 'savings', note: 'Most homes save ₹1,000–2,000 a month, a few far more. Quote the median and the range, not one average, in sales material.' },
      { id: 'g10', label: question('crews'), lane: form('crews'), visual: 'crews', note: 'Twelve people to compare: horizontal bars, sorted, from zero. Meena at 58% stands out for coaching, not blame; check her fault mix first.' },
    ],
  },
  gap: {
    id: 'gap', from: 11, at: 15.6,
    prompt: 'Sales likes the cut-axis uptime chart: “It makes Jaipur look great.” What does Farah do?',
    options: [{ id: 'a', label: 'Keep it for sales only' }, { id: 'b', label: 'Start the bars at zero, and if the gap matters, chart downtime: 3% against 6%' }, { id: 'c', label: 'Remove the axis labels' }],
    correct: 'b', explanation: 'A chart that misleads once is distrusted forever. Downtime makes the real gap visible honestly: Pune is down twice as long.',
  },
  takeaways: [
    { title: 'The question picks the form', body: 'Compare, change over time, part of a whole, spread, relationship. Name the task, then the chart follows.' },
    { title: 'Length on a common scale', body: 'Bars beat slices and dials, because people judge length best. Sort them unless the order means something.' },
    { title: 'Bars from zero; lines may zoom', body: 'A bar is its length, so never cut it. A line is its slope, so its axis can start near the data, labelled.' },
    { title: 'Show the spread', body: 'An average hides the people in the tail. A histogram or a median with its range shows them.' },
  ],
  quiz: {
    seconds: 15,
    questions: [
      { id: 'q1', prompt: 'Monthly installs across four quarters. Form?', options: [{ id: 'a', label: 'Bars' }, { id: 'b', label: 'Line' }, { id: 'c', label: 'Pie' }], correct: 'a', explanation: 'A few periods are things to compare.' },
      { id: 'q2', prompt: 'Does cloud cover explain low days?', options: [{ id: 'a', label: 'Scatter' }, { id: 'b', label: 'Pie' }, { id: 'c', label: 'Gauge' }], correct: 'a', explanation: 'Two measures per day: one dot each.' },
      { id: 'q3', prompt: 'A bar chart’s axis must start at…', options: [{ id: 'a', label: 'The smallest value' }, { id: 'b', label: 'Zero' }, { id: 'c', label: 'Wherever looks best' }], correct: 'b', explanation: 'Bars are read as length.' },
      { id: 'q4', prompt: 'Two measures, two y-axes. Verdict?', options: [{ id: 'a', label: 'Fine if labelled' }, { id: 'b', label: 'Avoid: the scales decide where lines cross' }, { id: 'c', label: 'Best practice' }], correct: 'b', explanation: 'Use two charts, or index both to a common base.' },
    ],
  },
  ladder: [
    { id: 'l1', prompt: 'Why is a pie a poor way to compare Roshni’s eight cities?', hint: 'Which visual judgement is easiest?', options: [{ id: 'a', label: 'Pies are old-fashioned' }, { id: 'b', label: 'It asks readers to compare angles and areas, which they judge far less accurately than lengths' }, { id: 'c', label: 'Pies can’t be coloured well' }, { id: 'd', label: 'Pies don’t work on phones' }], correct: 'b', explanation: 'Cleveland and McGill ranked position and length above angle and area. Two or three very different parts can survive a pie; eight similar ones can’t.' },
    { id: 'l2', prompt: 'A stakeholder says, “Starting the axis at 93% shows the difference better.” What’s the strongest reply?', hint: 'What does the reader compare first?', options: [{ id: 'a', label: '“It’s against the style guide”' }, { id: 'b', label: '“Bars are read as lengths, so a cut axis turns a 3-point gap into a fourfold one. If the gap matters, chart the gap itself”' }, { id: 'c', label: '“It looks cluttered”' }, { id: 'd', label: '“The tool doesn’t allow it”' }], correct: 'b', explanation: 'Name the mechanism and offer the honest alternative: downtime, a dot plot, or the difference as its own bar.' },
    { id: 'l3', prompt: 'Revenue and tickets on one chart with two y-axes show the lines crossing in March. What does the crossing mean?', hint: 'Who chose the scales?', options: [{ id: 'a', label: 'Tickets overtook revenue in March' }, { id: 'b', label: 'Nothing: change either axis and the lines cross somewhere else' }, { id: 'c', label: 'The business broke even' }, { id: 'd', label: 'Tickets are growing faster' }], correct: 'b', explanation: 'With two scales, the crossing is an artefact. Index both to 100 at a start date, or use two aligned charts.' },
    { id: 'l4', prompt: 'Average switch-on wait is 24 days, and the target is 25. Is the install team on target?', hint: 'What does the average leave out?', options: [{ id: 'a', label: 'Yes' }, { id: 'b', label: 'Can’t tell: look at the spread; a long tail of customers waiting six weeks can sit behind an on-target average' }, { id: 'c', label: 'No, it should be lower' }, { id: 'd', label: 'Only if the median is 21' }], correct: 'b', explanation: 'Set targets on a percentile, like 90% switched on within 30 days, and show the histogram.' },
    { id: 'l5', prompt: 'Manoj needs the exact pending amount for each of 14 customers before calling them. Which form?', hint: 'Is he comparing or looking up?', options: [{ id: 'a', label: 'Sorted bars' }, { id: 'b', label: 'A table, sorted by amount, with tabular figures' }, { id: 'c', label: 'A pie' }, { id: 'd', label: 'A line' }], correct: 'b', explanation: 'Charts show patterns; tables give exact values to look up. Sometimes the right chart is no chart.' },
  ],
};

export const ui6_2: Episode = {
  lessonId: 'ui.6-2',
  hook: 'Roshni’s “on track” dots are red and green. Anil, its best technician, is colour-blind, and has been guessing for two years.',
  scene: {
    id: 'colour-jobs', duration: 36,
    beats: [
      { at: 0, title: 'Red, green, guess', body: 'The site list marks each site on track in green, off track in red. Seen as a deuteranope sees it, both are the same olive.' },
      { at: 6, title: 'Names: distinct hues', body: 'Four cities, four lines. Distinct hues in a fixed order, so Pune is always orange, even when a filter hides Jaipur.' },
      { at: 11, title: 'Amounts: one hue', body: 'Generation by hour and month. A rainbow makes bands that aren’t there. One blue, light to dark, reads as more and less.' },
      { at: 16, title: 'A middle that means something', body: 'Output against expected, from −30% to +20%. Red below, blue above, grey at zero: the side is the story.' },
      { at: 21, title: 'Grey is a colour', body: 'Twenty societies, one fell behind. Nineteen grey lines, one blue, labelled. Nobody needs a legend.' },
      { at: 26, title: 'Never colour alone', body: 'The site list gets an icon and a word: ✓ On track, ! Off track. Lines get direct labels. Anil stops guessing.' },
      { at: 31, title: 'Check it, don’t eyeball it', body: 'Every pair in the palette runs through a simulator, and every line clears 3:1 against the background.' },
    ],
  },
  check: [
    { id: 'c1', prompt: 'Which scale suits “output against expected, from −30% to +20%”?', options: [{ id: 'a', label: 'A rainbow' }, { id: 'b', label: 'Diverging: two hues meeting at a neutral grey at 0%' }, { id: 'c', label: 'One hue, light to dark' }],
      correct: 'b', explanation: 'A meaningful middle needs two sides.' },
    { id: 'c2', prompt: 'What fixed the red and green dots for Anil?', options: [{ id: 'a', label: 'Brighter red' }, { id: 'b', label: 'An icon and a word with each colour, so colour isn’t the only signal' }, { id: 'c', label: 'Bigger dots' }],
      correct: 'b', explanation: 'Redundant encoding works for everyone, including print and bright sun.' },
  ],
  game: {
    id: 'palette-tune', title: 'Give colour its job',
    instructions: 'Each card is a chart on Roshni’s console, drawn in grey. Choose the job its colour should do. Right calls colour it from Roshni’s palette; switch to the colour-blind view to see it as a deuteranope would.',
    lanes: [
      { id: 'categorical', label: 'Categorical', hint: 'Tell a few names apart' },
      { id: 'sequential', label: 'Sequential', hint: 'More and less of one amount' },
      { id: 'diverging', label: 'Diverging', hint: 'Both sides of a meaningful middle' },
      { id: 'highlight', label: 'Highlight', hint: 'Grey, and one colour for the point' },
    ],
    cards: [
      { id: 'g1', label: chart('cities'), lane: job('cities'), visual: 'cities', note: 'Four names to tell apart: four distinct hues, in the system’s fixed order, each line labelled at its end.' },
      { id: 'g2', label: chart('heat'), lane: job('heat'), visual: 'heat', note: 'An amount on a grid: one blue from light to dark. The midday summer peak reads instantly, with no false bands.' },
      { id: 'g3', label: chart('target'), lane: job('target'), visual: 'target', note: 'Expected output is the middle that matters. Red below, blue above, grey at zero, darker the further out.' },
      { id: 'g4', label: chart('society'), lane: job('society'), visual: 'society', note: 'The review is about one society. Nineteen grey lines give context; the one in blue, labelled, is the story.' },
      { id: 'g5', label: chart('mix'), lane: job('mix'), visual: 'mix', note: 'Three customer types are names, not amounts: three distinct hues, the same three on every chart on the console.' },
      { id: 'g6', label: chart('roof'), lane: job('roof'), visual: 'roof', note: 'Temperature is an amount: one hue. The hot panels near the water tank show as the darkest cells.' },
      { id: 'g7', label: chart('yoy'), lane: job('yoy'), visual: 'yoy', note: 'Up and down from last year: no change is grey, growth blue, decline red. A single hue would hide which cities shrank.' },
      { id: 'g8', label: chart('skus'), lane: job('skus'), visual: 'skus', note: 'Eleven hues can’t be matched to a legend. Grey all eleven, colour the two models with rising tickets, or split into small multiples.' },
      { id: 'g9', label: chart('wards'), lane: job('wards'), visual: 'wards', note: 'Installs per 1,000 homes is an ordered amount: light to dark, normalised so big wards don’t look best just for being big.' },
      { id: 'g10', label: chart('survey'), lane: job('survey'), visual: 'survey', note: 'Agree and disagree are two sides of a neutral middle: a diverging stack, neutral in grey at the centre.' },
      { id: 'g11', label: chart('pune'), lane: job('pune'), visual: 'pune', note: 'The Pune team’s chart is about Pune. Pune in colour, the other seven grey and unlabelled: context, not competition.' },
    ],
  },
  gap: {
    id: 'gap', from: 0, at: 5.6,
    prompt: 'Anil reads the red and green dots as the same colour. What should Farah do first?',
    options: [{ id: 'a', label: 'Add an icon and a word to every status, so colour isn’t the only signal' }, { id: 'b', label: 'Switch to a colour-blind mode Anil has to turn on' }, { id: 'c', label: 'Make the red darker' }],
    correct: 'a', explanation: 'Redundant encoding helps everyone by default. A mode someone has to find and switch on helps almost nobody.',
  },
  takeaways: [
    { title: 'One job per palette', body: 'Names get distinct hues. Amounts get one hue, light to dark. A meaningful middle gets two hues meeting at grey.' },
    { title: 'Grey is the default', body: 'When the chart is about one thing, colour only that. Past six categories, grey them or split the chart.' },
    { title: 'Colour follows the entity', body: 'Fixed order, never cycled: Pune is orange on every chart, even when filters change.' },
    { title: 'Never colour alone', body: 'Simulate colour blindness, keep marks at 3:1, and add labels, icons and words.' },
  ],
  quiz: {
    seconds: 15,
    questions: [
      { id: 'q1', prompt: 'Generation by hour and month, as a grid. Palette?', options: [{ id: 'a', label: 'Sequential, one hue' }, { id: 'b', label: 'Rainbow' }, { id: 'c', label: 'Categorical' }], correct: 'a', explanation: 'An amount: light to dark.' },
      { id: 'q2', prompt: 'Strongly disagree to strongly agree. Palette?', options: [{ id: 'a', label: 'Sequential' }, { id: 'b', label: 'Diverging' }, { id: 'c', label: 'Highlight' }], correct: 'b', explanation: 'Two sides of a neutral middle.' },
      { id: 'q3', prompt: 'Lines and dots need at least what contrast with the background?', options: [{ id: 'a', label: '3:1' }, { id: 'b', label: '1.5:1' }, { id: 'c', label: '7:1' }], correct: 'a', explanation: 'WCAG 1.4.11, for graphics.' },
      { id: 'q4', prompt: 'A filter hides Jaipur. Pune’s line should…', options: [{ id: 'a', label: 'Take Jaipur’s colour' }, { id: 'b', label: 'Turn grey' }, { id: 'c', label: 'Keep its colour' }], correct: 'c', explanation: 'Colour belongs to the entity, not its rank.' },
    ],
  },
  ladder: [
    { id: 'l1', prompt: 'Why is a rainbow scale a poor choice for generation by hour?', hint: 'Can you order the colours of a rainbow by amount?', options: [{ id: 'a', label: 'It’s garish' }, { id: 'b', label: 'Hue has no natural order, and its bright yellow band creates edges in the data that aren’t there' }, { id: 'c', label: 'It prints badly' }, { id: 'd', label: 'It’s slow to render' }], correct: 'b', explanation: 'Lightness reads as amount; hue doesn’t. A one-hue ramp is ordered and smooth.' },
    { id: 'l2', prompt: 'Why grey the seven other cities rather than delete them?', hint: 'How does Pune know it’s doing well?', options: [{ id: 'a', label: 'To fill space' }, { id: 'b', label: 'They are the context that tells Pune whether its line is good; grey keeps them without competing' }, { id: 'c', label: 'Legal reasons' }, { id: 'd', label: 'To use all the data' }], correct: 'b', explanation: 'Highlight charts keep context quiet and the story loud.' },
    { id: 'l3', prompt: 'A product manager wants the categorical colours reassigned by rank, so the top city is always blue. Why not?', hint: 'What happens next month?', options: [{ id: 'a', label: 'Blue is reserved' }, { id: 'b', label: 'When the ranking changes, every city changes colour, and people who learned “Pune is orange” misread every chart' }, { id: 'c', label: 'It’s slower' }, { id: 'd', label: 'There’s no reason not to' }], correct: 'b', explanation: 'Colour is identity. Rank belongs to position: sort the bars.' },
    { id: 'l4', prompt: 'The palette’s third series is a pale yellow at 1.6:1 on white. It’s the brand colour. What’s the best fix?', hint: 'The marks have to be seen.', options: [{ id: 'a', label: 'Keep it; it’s on brand' }, { id: 'b', label: 'Use a darker step of the yellow that clears 3:1, or label those marks directly and keep a table view' }, { id: 'c', label: 'Add a drop shadow' }, { id: 'd', label: 'Only use it in dark mode' }], correct: 'b', explanation: 'Brand hues can be stepped darker for charts. If they can’t, the marks must be carried by labels.' },
    { id: 'l5', prompt: 'Roshni’s status colours are green, amber and red. A new chart needs a fourth series and someone reaches for amber. What should Farah say?', hint: 'What will people think amber means?', options: [{ id: 'a', label: 'Fine, it’s free' }, { id: 'b', label: 'Status colours are reserved for status; use the next categorical slot, or amber series will read as warnings' }, { id: 'c', label: 'Use a gradient' }, { id: 'd', label: 'Use black' }], correct: 'b', explanation: 'Once a colour means “warning”, using it for data borrows that meaning.' },
  ],
};

export const ui6_3: Episode = {
  lessonId: 'ui.6-3',
  hook: 'Manoj opens Roshni’s ops dashboard at 7:30, scrolls past eleven tiles, and plans the day’s visits on paper anyway. Farah sits next to him.',
  scene: {
    id: 'decision-board', duration: 36,
    beats: [
      { at: 0, title: 'Eleven tiles, no answer', body: 'Lifetime units, a CO₂ counter, revenue by city, 140 speedometers. Manoj scrolls, then plans the six crews on paper.' },
      { at: 6, title: 'Write the decision', body: 'Farah writes one sentence: at 7:30, Manoj decides where six crews go today. Every tile must help with that.' },
      { at: 11, title: 'Someone else’s question', body: 'Revenue goes to the finance board. The CO₂ counter goes to the customer app. Downloads go to growth.' },
      { at: 16, title: 'Nobody’s question', body: 'Lifetime units and the all-time rating change no decision. They go.' },
      { at: 21, title: 'Give numbers a comparison', body: '3.1% fault rate gets eight weeks and the 4% line. 140 gauges become one sorted list of sites below 80%, ranked by units lost.' },
      { at: 26, title: 'Answer top left', body: 'Sites to visit, top left. Faults against the 48-hour promise beside it. Crews on the map below. Updated at 7:15, it says.' },
      { at: 31, title: 'Two minutes', body: 'Farah gives Manoj yesterday’s data on the new board. He plans the same six routes in two minutes instead of twenty.' },
    ],
  },
  check: [
    { id: 'c1', prompt: 'What did Farah write down before changing any tile?', options: [{ id: 'a', label: 'A list of metrics' }, { id: 'b', label: 'Who opens it, when, and the decision they make: where six crews go today' }, { id: 'c', label: 'A colour palette' }],
      correct: 'b', explanation: 'The decision is the test every tile has to pass.' },
    { id: 'c2', prompt: 'What happened to the revenue tile?', options: [{ id: 'a', label: 'Deleted' }, { id: 'b', label: 'Moved to the finance board, where it serves a decision' }, { id: 'c', label: 'Made smaller' }],
      correct: 'b', explanation: 'Real data, wrong person.' },
  ],
  game: {
    id: 'dash-critique', title: 'Critique the board',
    instructions: 'Each card is a tile on the old Jaipur ops dashboard. Manoj uses it to decide where six crews go today. Keep it, fix it, move it to someone else’s board, or cut it. The board rebuilds as you go.',
    lanes: [
      { id: 'keep', label: 'Keep', hint: 'Answers today’s decision as it is' },
      { id: 'fix', label: 'Fix', hint: 'Right data, no comparison or wrong form' },
      { id: 'move', label: 'Move', hint: 'Someone else’s decision' },
      { id: 'cut', label: 'Cut', hint: 'Changes nobody’s decision' },
    ],
    cards: [
      { id: 'g1', label: tile('lifetime'), lane: verdict('lifetime'), visual: 'lifetime', note: 'A number that only goes up and changes no decision. It’s a vanity metric; if marketing wants it, it’s theirs to ask for.' },
      { id: 'g2', label: tile('under'), lane: verdict('under'), visual: 'under', note: 'This is the question. Sites below 80%, ranked by units lost, is the list Manoj plans from. It goes top left.' },
      { id: 'g3', label: tile('gauges'), lane: verdict('gauges'), visual: 'gauges', note: '140 dials hide 140 comparisons. One sorted bar list of sites against expected answers it at a glance.' },
      { id: 'g4', label: tile('revenue'), lane: verdict('revenue'), visual: 'revenue', note: 'Real and important, for the finance team’s monthly review. Move it to their board; it doesn’t send a crew anywhere.' },
      { id: 'g5', label: tile('faultRate'), lane: verdict('faultRate'), visual: 'faultRate', note: '“Is 3.1% bad?” Add the last eight weeks as a small line and the 4% threshold where he acts. Now the tile answers.' },
      { id: 'g6', label: tile('tickets'), lane: verdict('tickets'), visual: 'tickets', note: 'Ticket age against the 48-hour promise tells him which faults can’t wait. It stays, beside the site list.' },
      { id: 'g7', label: tile('carbon'), lane: verdict('carbon'), visual: 'carbon', note: 'A real number for customers and investors. Move it to the customer app and the investor update.' },
      { id: 'g8', label: tile('pie'), lane: verdict('pie'), visual: 'pie', note: 'Fault types tell him which parts to load in the van, but nine slices can’t be compared. Sorted bars can.' },
      { id: 'g9', label: tile('rating'), lane: verdict('rating'), visual: 'rating', note: 'An all-time average barely moves and decides nothing today. Recent low ratings by site could be a tile; this one isn’t.' },
      { id: 'g10', label: tile('crews'), lane: verdict('crews'), visual: 'crews', note: 'Where crews are and how far apart the visits are: the second half of his decision. It stays, below the list.' },
      { id: 'g11', label: tile('downloads'), lane: verdict('downloads'), visual: 'downloads', note: 'The growth team’s question. Move it to their board.' },
    ],
  },
  gap: {
    id: 'gap', from: 16, at: 20.6,
    prompt: 'The fault-rate tile reads “3.1%”. Manoj asks, “Is that bad?” What should the tile show?',
    options: [{ id: 'a', label: 'The same number, in red' }, { id: 'b', label: 'The last eight weeks as a small line, with the 4% threshold where he sends a crew' }, { id: 'c', label: 'A gauge' }],
    correct: 'b', explanation: 'A number without a comparison isn’t an answer. Trend plus threshold is.',
  },
  takeaways: [
    { title: 'Write the decision first', body: 'Who opens it, when, and what they decide. Every tile is tested against that sentence.' },
    { title: 'Move, don’t hoard', body: 'Real data for someone else’s decision goes to their board. Data for nobody’s decision goes.' },
    { title: 'Numbers need a comparison', body: 'Against a target, a threshold or last period. A big number alone is not an answer.' },
    { title: 'Test it by watching', body: 'Give the person real data and time the decision. Cut what they never look at.' },
  ],
  quiz: {
    seconds: 15,
    questions: [
      { id: 'q1', prompt: 'A live CO₂ counter on an ops dashboard is…', options: [{ id: 'a', label: 'For another audience' }, { id: 'b', label: 'The headline' }, { id: 'c', label: 'Required' }], correct: 'a', explanation: 'Move it to customers and investors.' },
      { id: 'q2', prompt: 'The tile that answers the main question goes…', options: [{ id: 'a', label: 'Bottom right' }, { id: 'b', label: 'Top left' }, { id: 'c', label: 'In a tab' }], correct: 'b', explanation: 'Where the eye starts.' },
      { id: 'q3', prompt: '140 speedometers become…', options: [{ id: 'a', label: 'One sorted list' }, { id: 'b', label: 'Bigger dials' }, { id: 'c', label: 'A pie' }], correct: 'a', explanation: 'One comparison on a common scale.' },
      { id: 'q4', prompt: 'Every tile should say when its data…', options: [{ id: 'a', label: 'Was designed' }, { id: 'b', label: 'Will be deleted' }, { id: 'c', label: 'Last updated' }], correct: 'c', explanation: 'Stale data looks just like fresh data otherwise.' },
    ],
  },
  ladder: [
    { id: 'l1', prompt: 'Why start a dashboard from a decision rather than from the available data?', hint: 'What does starting from data produce?', options: [{ id: 'a', label: 'It’s faster' }, { id: 'b', label: 'Starting from data shows everything that can be counted; starting from the decision shows only what changes it' }, { id: 'c', label: 'Data teams prefer it' }, { id: 'd', label: 'It uses fewer charts' }], correct: 'b', explanation: 'The decision is the filter. Without one, every number seems worth a tile.' },
    { id: 'l2', prompt: 'The founders insist the CO₂ counter stays on the ops board. What makes this conversation easy?', hint: 'What has Farah written down?', options: [{ id: 'a', label: 'Her seniority' }, { id: 'b', label: 'The board’s written decision: ask which crew the counter would send where, and offer it a home that does serve a decision' }, { id: 'c', label: 'A user survey' }, { id: 'd', label: 'Hiding it behind a tab' }], correct: 'b', explanation: 'A named decision turns a taste argument into a test anyone can run.' },
    { id: 'l3', prompt: 'Manoj asks for a filter for every possible field “just in case”. What should Farah offer?', hint: 'What does he actually change each morning?', options: [{ id: 'a', label: 'All of them' }, { id: 'b', label: 'Defaults that match his morning (Jaipur, today) and the two or three filters he actually uses, found by watching him' }, { id: 'c', label: 'No filters at all' }, { id: 'd', label: 'A SQL box' }], correct: 'b', explanation: 'Good defaults answer the question on open. Filters are for the exceptions.' },
    { id: 'l4', prompt: 'The overnight data load fails. What should the board show at 7:30?', hint: 'What would Manoj otherwise believe?', options: [{ id: 'a', label: 'Yesterday’s numbers, as normal' }, { id: 'b', label: 'A clear banner: “Data last updated 6:10 pm yesterday. Today’s faults aren’t in yet”, with the old data marked stale' }, { id: 'c', label: 'A blank screen' }, { id: 'd', label: 'Zeros' }], correct: 'b', explanation: 'Stale data that looks fresh sends crews to the wrong sites. Late and broken states are part of the design.' },
    { id: 'l5', prompt: 'How should Farah know the new board works?', hint: 'What was the decision?', options: [{ id: 'a', label: 'Manoj says he likes it' }, { id: 'b', label: 'Manoj plans the day’s routes from it, faster, and the crews’ first-visit fix rate and SLA misses improve over the next month' }, { id: 'c', label: 'More page views' }, { id: 'd', label: 'It looks modern' }], correct: 'b', explanation: 'Measure the decision and its outcome, not time on the page.' },
  ],
};
