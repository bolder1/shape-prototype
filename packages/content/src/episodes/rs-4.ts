// Episodes for chapter rs.4 · Usability testing. Drafts by Claude, for review.
// One study runs through the chapter: Meher, the researcher at Safar (a train-booking app), tests a new prototype for
// booking and cancelling tickets with five people, rates what she finds, and runs a heuristic review with the designers.
import type { Episode } from '../episode';

export const rs4_1: Episode = {
  lessonId: 'rs.4-1',
  hook: 'Rohit finishes the task in three seconds, and Meher learns nothing. Watch one sentence ruin a test, and one fix it.',
  scene: {
    id: 'task-writing', duration: 34,
    beats: [
      { at: 0, title: 'A task that gives it away', body: 'Meher’s first task for the Safar test: “Tap My trips and cancel your ticket.”' },
      { at: 5, title: 'Done in three seconds', body: 'Rohit scans for the words “My trips” and taps them. The test checked his reading, not the design.' },
      { at: 10, title: 'Take out the clues', body: 'No button names, no steps. Give him a reason and a goal instead.' },
      { at: 15, title: 'A real reason', body: '“You can’t travel on Friday any more. Get your money back for this ticket.”' },
      { at: 21, title: 'Now he hunts', body: 'Profile, then Help, then My trips: 48 seconds. Nobody looks for a refund under “My trips”. That’s the finding.' },
      { at: 27, title: 'A task you can finish', body: 'A real reason, none of the screen’s words, one goal, and an end you can see: the refund amount.' },
    ],
  },
  check: [
    { id: 'c1', prompt: 'Why did Rohit finish so fast the first time?', options: [{ id: 'a', label: 'The task named the button to tap' }, { id: 'b', label: 'The design is excellent' }, { id: 'c', label: 'He had used Safar before' }],
      correct: 'a', explanation: 'When the task uses the screen’s words, people match words instead of looking for the feature.' },
    { id: 'c2', prompt: 'What did the rewritten task show?', options: [{ id: 'a', label: 'Rohit reads slowly' }, { id: 'b', label: 'People don’t look for refunds under “My trips”' }, { id: 'c', label: 'The app is slow' }],
      correct: 'b', explanation: 'Without the clue, the label itself was tested, and it failed.' },
  ],
  game: {
    id: 'task-fix', title: 'Fix the task',
    instructions: 'Meher’s draft tasks for the Safar test. Tap the words that spoil each task, or call it fair if nothing does. Then see what would happen in the session, and the rewrite.',
    lanes: [
      { id: 'leak', label: 'Gives the answer away', hint: 'Uses the words on the screen' },
      { id: 'steps', label: 'Spells out the steps', hint: 'Says how, not what for' },
      { id: 'vague', label: 'No clear goal', hint: 'Nothing to finish, or asks for an opinion' },
      { id: 'good', label: 'Fair task', hint: 'A reason, a goal and an end you can see' },
    ],
    cards: [
      { id: 'g1', label: 'Tap “My trips” and cancel your Friday ticket.', visual: 'Tap “My trips”', lane: 'leak', note: '“You can’t travel on Friday any more. Get your money back for this ticket.”' },
      { id: 'g2', label: 'Open the menu, choose Passengers, then add your aunt to Friday’s booking.', visual: 'Open the menu, choose Passengers, then', lane: 'steps', note: '“Your aunt has decided to come with you on Friday. Make sure she has a seat.”' },
      { id: 'g3', label: 'Have a look around the app and tell us what you think.', visual: 'Have a look around the app', lane: 'vague', note: '“You’re going to a wedding in Nagpur next month. Find a train that gets you there by Saturday morning.”' },
      { id: 'g4', label: 'You need to be in Nagpur by Saturday morning and have ₹1,500 to spend. Book a seat that works.', lane: 'good', note: 'A reason, a limit and a clear end, a booked seat, with none of the screen’s words in it.' },
      { id: 'g5', label: 'Use the Tatkal option to book a ticket for tomorrow.', visual: 'the Tatkal option', lane: 'leak', note: '“Your manager wants you in Mumbai tomorrow. See if you can still get a seat.”' },
      { id: 'g6', label: 'Would you use a feature that predicts whether a waitlisted ticket will confirm?', visual: 'Would you use a feature', lane: 'vague', note: '“Your ticket for the 14th is waitlisted at WL 12. Decide whether to keep it or book a bus instead.”' },
      { id: 'g7', label: 'Your train leaves in two hours. Find out which platform it leaves from.', lane: 'good', note: 'One goal, a real moment, and an end you can see: the platform number.' },
      { id: 'g8', label: 'Go to the second tab, scroll to the bottom and download your ticket as a PDF.', visual: 'Go to the second tab, scroll to the bottom and', lane: 'steps', note: '“The TTE will check your ticket and there may be no signal on the train. Make sure you can show it offline.”' },
    ],
  },
  gap: {
    id: 'gap', from: 4, at: 9.6,
    prompt: 'Meher’s task gave the answer away. What should she change?',
    options: [{ id: 'a', label: 'Add more steps so it’s harder' }, { id: 'b', label: 'Give a reason and a goal, without the screen’s words' }, { id: 'c', label: 'Ask Rohit to go slower' }],
    correct: 'b', explanation: 'Remove the clues, and the design has to do the work the task was doing.',
  },
  takeaways: [
    { title: 'A goal, not steps', body: 'Say what the person wants to get done and why, never which buttons to press.' },
    { title: 'Hide the screen’s words', body: 'If the task uses a label from the interface, people match words instead of looking.' },
    { title: 'An end you can see', body: 'A booked seat, a refund amount, a platform number: something that shows the task is done.' },
    { title: 'Pilot it first', body: 'Try every task on a colleague. A confusing task is cheapest to find before session one.' },
  ],
  quiz: {
    seconds: 12,
    questions: [
      { id: 'q1', prompt: '“Tap Search and pick a train” is weak because…', options: [{ id: 'a', label: 'It names the button' }, { id: 'b', label: 'It’s too short' }], correct: 'a', explanation: 'It tells people what to tap.' },
      { id: 'q2', prompt: 'A good task includes…', options: [{ id: 'a', label: 'The steps to follow' }, { id: 'b', label: 'A reason and a goal' }, { id: 'c', label: 'A question about features' }], correct: 'b', explanation: 'Why, and what “done” is.' },
      { id: 'q3', prompt: '“Would you use this?” is…', options: [{ id: 'a', label: 'A fair task' }, { id: 'b', label: 'An opinion question, not a task' }, { id: 'c', label: 'A leading task' }], correct: 'b', explanation: 'There’s nothing to do, only something to guess.' },
      { id: 'q4', prompt: 'Before the first real session…', options: [{ id: 'a', label: 'Pilot the tasks with a colleague' }, { id: 'b', label: 'Show the participant the answers' }, { id: 'c', label: 'Make the tasks longer' }], correct: 'a', explanation: 'A pilot catches confusing tasks early.' },
    ],
  },
  ladder: [
    { id: 'l1', prompt: 'Why give the participant a reason (“You can’t travel on Friday…”)?', hint: 'People act differently with a motive.', options: [{ id: 'a', label: 'To make the session longer' }, { id: 'b', label: 'So they behave as they would with a real need, and decide when they’re done' }, { id: 'c', label: 'It’s polite' }, { id: 'd', label: 'To test their memory' }], correct: 'b', explanation: 'A realistic motive makes the search and the stopping point real.' },
    { id: 'l2', prompt: 'A task says “Find a cheap train”. What’s missing?', hint: 'Cheap compared to what?', options: [{ id: 'a', label: 'Nothing' }, { id: 'b', label: 'A button name' }, { id: 'c', label: 'A clear end: a budget or a date, so you know when it’s done' }, { id: 'd', label: 'More steps' }], correct: 'c', explanation: 'Without a limit, “done” is a guess, and success can’t be judged.' },
    { id: 'l3', prompt: 'Your feature is called “Trip Shield”. How do you test whether people find it?', hint: 'Don’t say the name.', options: [{ id: 'a', label: '“Find Trip Shield.”' }, { id: 'b', label: '“Your trip might be cancelled by the railways. See if you can protect your money.”' }, { id: 'c', label: '“Do you like Trip Shield?”' }, { id: 'd', label: '“Tap the shield icon.”' }], correct: 'b', explanation: 'Describe the need. If they find Trip Shield from that, the name and placement work.' },
    { id: 'l4', prompt: 'How many goals should one task have?', hint: 'One thing to succeed or fail at.', options: [{ id: 'a', label: 'As many as fit' }, { id: 'b', label: 'Three, to save time' }, { id: 'c', label: 'It doesn’t matter' }, { id: 'd', label: 'One, so you know which part failed' }], correct: 'd', explanation: 'Bundle three goals and a failure won’t tell you which one broke.' },
    { id: 'l5', prompt: 'In the pilot, your colleague asks “Do you mean the return ticket too?” What do you do?', hint: 'The pilot just did its job.', options: [{ id: 'a', label: 'Tell real participants the same thing out loud' }, { id: 'b', label: 'Ignore it: colleagues aren’t real users' }, { id: 'c', label: 'Rewrite the task so it answers that question itself' }, { id: 'd', label: 'Drop the task' }], correct: 'c', explanation: 'An ambiguity in the pilot will hit every participant. Fix the wording once, now.' },
  ],
};

export const rs4_2: Episode = {
  lessonId: 'rs.4-2',
  hook: 'Five people with Meher beside them, or forty on their own overnight? Watch what each brings back.',
  scene: {
    id: 'mod-unmod', duration: 34,
    beats: [
      { at: 0, title: 'Two ways to run it', body: 'Meher can sit in on every session, or send the tasks out and watch the recordings later.' },
      { at: 5, title: 'Moderated', body: 'On a video call, Anjali stops at the refund screen. Meher asks: “What did you expect there?” “I thought cancelling would cost me the whole fare.”' },
      { at: 11, title: 'You get the why', body: 'Five sessions over two days. Every pause can be followed up, and a broken screen can be patched between sessions.' },
      { at: 16, title: 'Unmoderated', body: 'The same task goes to 40 people through a testing tool. By morning: 40 recordings, and 62% finished.' },
      { at: 22, title: 'You get how many', body: 'Nobody asked why the other 38% gave up. And one unclear task would have wasted all forty sessions.' },
      { at: 28, title: 'Pick by the question', body: 'Why, early, rough or sensitive: moderated. How many and how fast, on a sturdy prototype: unmoderated.' },
    ],
  },
  check: [
    { id: 'c1', prompt: 'What did the moderated session give Meher that the recordings couldn’t?', options: [{ id: 'a', label: 'A follow-up question at the moment Anjali stopped' }, { id: 'b', label: 'A bigger sample' }, { id: 'c', label: 'Faster results' }],
      correct: 'a', explanation: 'The “why” behind the pause came from asking at that moment.' },
    { id: 'c2', prompt: 'When is unmoderated the better choice?', options: [{ id: 'a', label: 'A rough prototype, first round' }, { id: 'b', label: 'Simple tasks on a sturdy prototype, with many people' }, { id: 'c', label: 'A sensitive topic' }],
      correct: 'b', explanation: 'With nobody there to help, the prototype and the tasks have to stand on their own.' },
  ],
  game: {
    id: 'method-pick', title: 'Book the sessions',
    instructions: 'Seven studies on Meher’s list. Book each one: in person, on a video call, or unmoderated through a testing tool. Every booking costs days and rupees. See what comes back, and what the whole plan costs.',
    lanes: [
      { id: 'person', label: 'In person', hint: 'Moderated, side by side' },
      { id: 'remote', label: 'Video call', hint: 'Moderated, remote' },
      { id: 'unmod', label: 'Unmoderated', hint: 'A tool runs it and you watch later' },
    ],
    cards: [
      { id: 'g1', label: 'A first look at a paper sketch of the new refund flow', visual: '5', lane: 'person', note: 'Paper needs someone to play the computer and swap the sheets. It only works in the room.' },
      { id: 'g2', label: 'Can people find PNR status on the live app?', visual: '40', lane: 'unmod', note: 'A simple task on a working app. Forty recordings overnight give a success rate you can trust.' },
      { id: 'g3', label: 'Why do travellers over 60 give up at UPI payment? They live in Kochi, Jaipur and Patna.', visual: '5', lane: 'remote', note: 'You need follow-up questions, and they’re in three cities. A video call gets both without the travel.' },
      { id: 'g4', label: 'Which of two seat maps lets people pick a lower berth faster?', visual: '60', lane: 'unmod', note: 'Comparing two versions on time and success needs numbers, and numbers need many people.' },
      { id: 'g5', label: 'A clickable cancellation prototype with three screens unfinished, for people across India', visual: '5', lane: 'remote', note: 'A shaky prototype needs someone to steer past the gaps and ask why. Remote reaches people outside Pune.' },
      { id: 'g6', label: 'Booking a ticket with blind travellers who use screen readers on their own phones', visual: '4', lane: 'person', note: 'Their own phone and settings matter, and so does getting the setup right. Sit with them and ask as you go.' },
      { id: 'g7', label: 'After the fix, is the “Download ticket” button easy to find?', visual: '30', lane: 'unmod', note: 'A narrow check on a design that already works. An unmoderated test answers it in a day.' },
    ],
  },
  gap: {
    id: 'gap', from: 16, at: 21.4,
    prompt: '40 recordings, 62% finished. What can’t Meher learn from these alone?',
    options: [{ id: 'a', label: 'How many people finished' }, { id: 'b', label: 'Why the others gave up' }, { id: 'c', label: 'How long it took' }],
    correct: 'b', explanation: 'Unmoderated tests count well. Nobody was there to ask why.',
  },
  takeaways: [
    { title: 'Moderated finds why', body: 'A facilitator can follow up on every pause and steer past an unfinished screen.' },
    { title: 'Unmoderated counts', body: 'Many sessions, fast, for simple tasks on a sturdy prototype. No follow-ups.' },
    { title: 'Often both', body: 'Five moderated sessions to find the problems, then many unmoderated ones to measure the fix.' },
  ],
  quiz: {
    seconds: 12,
    questions: [
      { id: 'q1', prompt: 'A paper prototype needs…', options: [{ id: 'a', label: 'A moderated session' }, { id: 'b', label: 'An unmoderated tool' }], correct: 'a', explanation: 'Someone has to swap the screens.' },
      { id: 'q2', prompt: 'To compare two designs on success rate, use…', options: [{ id: 'a', label: 'Two interviews' }, { id: 'b', label: 'An unmoderated test with many people' }, { id: 'c', label: 'One moderated session' }], correct: 'b', explanation: 'Rates need numbers.' },
      { id: 'q3', prompt: 'The big risk of unmoderated tests?', options: [{ id: 'a', label: 'They take weeks' }, { id: 'b', label: 'One unclear task wastes every session' }, { id: 'c', label: 'They need a room' }], correct: 'b', explanation: 'Nobody is there to clarify.' },
      { id: 'q4', prompt: 'A remote moderated session is good when…', options: [{ id: 'a', label: 'You need follow-ups but people are far away' }, { id: 'b', label: 'You need 200 people' }, { id: 'c', label: 'You’re testing paper' }], correct: 'a', explanation: 'Video calls keep the conversation and skip the travel.' },
    ],
  },
  ladder: [
    { id: 'l1', prompt: 'Why can a moderated session rescue a broken prototype?', hint: 'Who’s in the room?', options: [{ id: 'a', label: 'It can’t' }, { id: 'b', label: 'The facilitator can explain the gap and move the person on to the next screen' }, { id: 'c', label: 'Moderated tools fix bugs' }, { id: 'd', label: 'Participants are more patient' }], correct: 'b', explanation: 'A person can work around a gap. A tool just records someone stuck.' },
    { id: 'l2', prompt: 'In a moderated session the participant asks, “Should I tap this?” What do you say?', hint: 'Don’t steer.', options: [{ id: 'a', label: '“Yes, that one.”' }, { id: 'b', label: '“No, try the other one.”' }, { id: 'c', label: '“What would you do if I weren’t here?”' }, { id: 'd', label: 'Say nothing and look away' }], correct: 'c', explanation: 'Hand the question back. Answering it tests your help, not the design.' },
    { id: 'l3', prompt: 'Why write unmoderated tasks even more carefully than moderated ones?', hint: 'Nobody can clarify.', options: [{ id: 'a', label: 'They’re more expensive' }, { id: 'b', label: 'Tools charge per word' }, { id: 'c', label: 'Every participant reads the same words alone, so one ambiguity repeats across every session' }, { id: 'd', label: 'They aren’t recorded' }], correct: 'c', explanation: 'In unmoderated tests the task text is the only facilitator you have.' },
    { id: 'l4', prompt: '60 people ran an unmoderated test and 18 failed one task. What next?', hint: 'You know where, not why.', options: [{ id: 'a', label: 'Ship anyway, 70% passed' }, { id: 'b', label: 'Watch those 18 recordings, then run a few moderated sessions to ask why' }, { id: 'c', label: 'Run 60 more' }, { id: 'd', label: 'Delete the task' }], correct: 'b', explanation: 'Numbers point at the problem. Recordings and conversations explain it.' },
    { id: 'l5', prompt: 'Why might you meet a participant in their own home or office?', hint: 'Context matters.', options: [{ id: 'a', label: 'It’s cheaper' }, { id: 'b', label: 'To see their real device, setup and interruptions, which a lab hides' }, { id: 'c', label: 'Labs are illegal' }, { id: 'd', label: 'It makes sessions shorter' }], correct: 'b', explanation: 'A shared family phone, a slow network or a screen reader setting can change everything.' },
  ],
};

export const rs4_3: Episode = {
  lessonId: 'rs.4-3',
  hook: 'Thirty-one problems after five sessions, and room in the sprint for six. Watch Meher decide which six.',
  scene: {
    id: 'severity', duration: 34,
    beats: [
      { at: 0, title: 'Thirty-one findings', body: 'Five sessions, thirty-one problems on the wall. Each one looks as urgent as the next.' },
      { at: 5, title: 'Easiest first', body: 'Kabir starts with the typo, the grey fare text and the old icon. Done by lunch. The refund problem waits.' },
      { at: 10, title: 'How many hit it', body: 'Meher spreads the notes by how many of the five people ran into each one.' },
      { at: 15, title: 'How badly', body: 'Then by what it cost them: they noticed, they slowed down, or they couldn’t finish.' },
      { at: 21, title: 'A severity scale', body: 'Cosmetic, minor, major, critical. 4 of 5 couldn’t cancel a ticket: critical. The grey fare text: cosmetic.' },
      { at: 27, title: 'A ranked report', body: 'Critical and major go first, each with who hit it. How hard it is to fix sits in its own column.' },
    ],
  },
  check: [
    { id: 'c1', prompt: 'Why is “4 of 5 couldn’t cancel” critical?', options: [{ id: 'a', label: 'Most people hit it and it stopped the task' }, { id: 'b', label: 'It was found first' }, { id: 'c', label: 'It’s easy to fix' }],
      correct: 'a', explanation: 'High frequency and high impact together put it at the top.' },
    { id: 'c2', prompt: 'Where does the effort to fix go?', options: [{ id: 'a', label: 'Into the severity rating' }, { id: 'b', label: 'In its own column, next to severity' }, { id: 'c', label: 'Nowhere' }],
      correct: 'b', explanation: 'Keep them apart, so a hard fix can’t make a serious problem look small.' },
  ],
  game: {
    id: 'severity-rate', title: 'Rate the findings',
    instructions: 'Eight findings from the five Safar sessions. Rate each one. It lands on the grid by how many people hit it and how badly, and the report ranks itself.',
    lanes: [
      { id: 'cosmetic', label: 'Cosmetic', hint: 'Noticed, but nobody slowed down' },
      { id: 'minor', label: 'Minor', hint: 'Slowed a few people, or bothered nearly everyone a little' },
      { id: 'major', label: 'Major', hint: 'Slowed most people, or blocked one' },
      { id: 'critical', label: 'Critical', hint: 'Blocked two or more, or cost them money' },
    ],
    cards: [
      { id: 'g1', label: 'Couldn’t find how to cancel a ticket, and gave up', visual: '4|3', lane: 'critical', note: 'Four of five failed the core task. This goes to the top of the report.' },
      { id: 'g2', label: 'Tapped Pay twice because nothing showed it was working, and paid twice', visual: '2|3', lane: 'critical', note: 'Only two people, but they lost money. Lost money and blocked tasks rate high even when few hit them.' },
      { id: 'g3', label: 'Stopped at “Quota: GN” and guessed what it meant', visual: '3|2', lane: 'major', note: 'Three of five stalled on jargon. They got through, but a guess on a booking is a risk.' },
      { id: 'g4', label: 'Mr Iyer couldn’t read the seat map at all and asked for help', visual: '1|3', lane: 'major', note: 'One person, fully blocked. Recruit more older travellers before you decide it’s rare.' },
      { id: 'g5', label: 'Typed the date as 14-3 and had to try again with the picker', visual: '2|2', lane: 'minor', note: 'A short detour that both people recovered from.' },
      { id: 'g6', label: 'Took a second look to find the fare in light grey', visual: '5|1', lane: 'minor', note: 'A tiny cost, but all five paid it. Frequency lifts a cosmetic problem to minor.' },
      { id: 'g7', label: 'Said the train icon looks old-fashioned', visual: '1|1', lane: 'cosmetic', note: 'One opinion, no effect on the task. Log it, don’t schedule it.' },
      { id: 'g8', label: 'Noticed that the two Back buttons look different', visual: '2|1', lane: 'cosmetic', note: 'Inconsistent and noticed, but nobody slowed down. Polish later.' },
    ],
  },
  gap: {
    id: 'gap', from: 4, at: 9.6,
    prompt: 'Kabir is fixing the easiest problems first. What should Meher do?',
    options: [{ id: 'a', label: 'Let him: quick wins are wins' }, { id: 'b', label: 'Rate each one by how many people hit it and how badly, then fix the worst first' }, { id: 'c', label: 'Fix all thirty-one before launch' }],
    correct: 'b', explanation: 'Severity decides the order. Ease of fixing is a separate question.',
  },
  takeaways: [
    { title: 'Frequency × impact', body: 'How many people hit it, and whether they noticed, slowed down or couldn’t finish.' },
    { title: 'Blocked and costly first', body: 'A problem that stops a task or takes money rates high even if only one or two people hit it.' },
    { title: 'Effort is separate', body: 'Rate the harm to users. Put the cost of the fix in its own column.' },
  ],
  quiz: {
    seconds: 12,
    questions: [
      { id: 'q1', prompt: 'One opinion about an icon is…', options: [{ id: 'a', label: 'Cosmetic' }, { id: 'b', label: 'Critical' }], correct: 'a', explanation: 'No effect on the task.' },
      { id: 'q2', prompt: 'Two people were charged twice. That is…', options: [{ id: 'a', label: 'Minor, only two' }, { id: 'b', label: 'Critical: it cost them money' }, { id: 'c', label: 'Cosmetic' }], correct: 'b', explanation: 'Impact outweighs frequency here.' },
      { id: 'q3', prompt: 'Severity combines…', options: [{ id: 'a', label: 'Effort and cost' }, { id: 'b', label: 'Frequency, impact and persistence' }, { id: 'c', label: 'Colour and size' }], correct: 'b', explanation: 'How many, how badly, how often again.' },
      { id: 'q4', prompt: 'A finding’s severity should be rated by…', options: [{ id: 'a', label: 'The loudest person in the room' }, { id: 'b', label: 'Each teammate alone, then compared' }, { id: 'c', label: 'The developer who fixes it' }], correct: 'b', explanation: 'Independent ratings, then agreement, reduce one person’s bias.' },
    ],
  },
  ladder: [
    { id: 'l1', prompt: 'Why is “persistence” part of severity?', hint: 'First time vs. every time.', options: [{ id: 'a', label: 'It isn’t' }, { id: 'b', label: 'A problem people learn to avoid hurts less than one that trips them every time' }, { id: 'c', label: 'It measures how long the bug has existed' }, { id: 'd', label: 'It’s the same as frequency' }], correct: 'b', explanation: 'Something that catches everyone, every visit, costs more than a one-time surprise.' },
    { id: 'l2', prompt: 'With five participants, one person hit a problem. What does that tell you?', hint: 'Five is small.', options: [{ id: 'a', label: 'Exactly 20% of all users will hit it' }, { id: 'b', label: 'It’s safe to ignore' }, { id: 'c', label: 'It’s real, but you can’t say how common: rate by its impact and watch for it next round' }, { id: 'd', label: 'The test failed' }], correct: 'c', explanation: 'Small tests find problems. They don’t measure how often they happen.' },
    { id: 'l3', prompt: 'A critical problem would take a week to fix. A cosmetic one takes ten minutes. What goes first?', hint: 'Severity sets priority.', options: [{ id: 'a', label: 'The cosmetic one: it’s quick' }, { id: 'b', label: 'The critical one, and start now; the quick fix can ride along if it’s free' }, { id: 'c', label: 'Neither' }, { id: 'd', label: 'Whichever the developer prefers' }], correct: 'b', explanation: 'Quick wins are fine as extras, never instead of the problems that stop people.' },
    { id: 'l4', prompt: 'What makes a finding in a report actionable?', hint: 'Could a developer start tomorrow?', options: [{ id: 'a', label: 'A long description' }, { id: 'b', label: 'Where it happens, what people did, how many, the severity, and a suggested direction' }, { id: 'c', label: 'A screenshot only' }, { id: 'd', label: 'The participant’s name' }], correct: 'b', explanation: 'Location, evidence, count and severity let the team act without re-watching every session.' },
    { id: 'l5', prompt: 'You and Kabir rated the same finding “minor” and “critical”. What now?', hint: 'The gap is information.', options: [{ id: 'a', label: 'Average it to “major”' }, { id: 'b', label: 'The senior person wins' }, { id: 'c', label: 'Discuss what each of you saw: usually one of you knows an impact the other missed' }, { id: 'd', label: 'Leave it unrated' }], correct: 'c', explanation: 'Disagreement usually means different evidence. Talk it through, then rate.' },
  ],
};

export const rs4_4: Episode = {
  lessonId: 'rs.4-4',
  hook: 'No users this week and a release on Friday. Watch three designers check Safar against Nielsen’s ten heuristics.',
  scene: {
    id: 'heuristic-eval', duration: 34,
    beats: [
      { at: 0, title: 'No users this week', body: 'The new booking screen ships Friday. The next test round is in two weeks. Meher calls a heuristic evaluation.' },
      { at: 5, title: 'Ten heuristics', body: 'Jakob Nielsen’s ten rules of thumb for usable interfaces, from showing system status to help and documentation.' },
      { at: 11, title: 'Alone first', body: 'Kabir, Meher and Tara each go through the screen on their own, noting every place it breaks a heuristic.' },
      { at: 17, title: 'Different finds', body: 'Each finds about a third of the problems, and not the same third. Merged, they cover most of them.' },
      { at: 23, title: 'Write it so it can be fixed', body: 'Where it is, which heuristic, and why it hurts: “Quota codes GN and TQ: travellers don’t know them.”' },
      { at: 29, title: 'Then test with users', body: 'Experts predict problems; users show them. The review clears the obvious ones so the next test finds the rest.' },
    ],
  },
  check: [
    { id: 'c1', prompt: 'Why do evaluators work alone first?', options: [{ id: 'a', label: 'So they don’t steer each other, and each finds different problems' }, { id: 'b', label: 'To save meeting rooms' }, { id: 'c', label: 'It doesn’t matter' }],
      correct: 'a', explanation: 'Working together too early makes everyone find the same third.' },
    { id: 'c2', prompt: 'What can’t a heuristic evaluation replace?', options: [{ id: 'a', label: 'A design review' }, { id: 'b', label: 'Testing with real users' }, { id: 'c', label: 'A style guide' }],
      correct: 'b', explanation: 'Experts guess well, but users still surprise them.' },
  ],
  game: {
    id: 'heuristic-sweep', title: 'Sweep the screen',
    instructions: 'The Safar booking screen breaks four of Nielsen’s heuristics, twice each. For each heuristic, tap the part of the screen that breaks it. Every find is pinned and written into the evaluation log.',
    lanes: [
      { id: 'status', label: 'Visibility of system status', hint: 'Show what’s happening, and quickly' },
      { id: 'match', label: 'Match with the real world', hint: 'Use the traveller’s words, not the system’s' },
      { id: 'control', label: 'User control and freedom', hint: 'A clear way back, and undo' },
      { id: 'prevention', label: 'Error prevention', hint: 'Stop mistakes before they happen' },
    ],
    cards: [
      { id: 'g1', label: 'After tapping Search, nothing changes for eight seconds', visual: 'search', lane: 'status', note: 'Show a loading state at once, and say what’s being searched: “Finding trains, Pune to Nagpur…”.' },
      { id: 'g2', label: 'Stations are shown only as codes: PUNE → NGP', visual: 'route', lane: 'match', note: 'Show the names first, “Pune Jn → Nagpur”, with the codes small beside them.' },
      { id: 'g3', label: 'The back arrow throws away every passenger you’ve entered', visual: 'back', lane: 'control', note: 'Keep the draft, or ask first: “Leave and lose 2 passengers?”' },
      { id: 'g4', label: 'The date field accepts any text, including dates in the past', visual: 'date', lane: 'prevention', note: 'Use a date picker that starts at today and can’t select a past date.' },
      { id: 'g5', label: 'The fare changes from ₹1,180 to ₹1,420 with no notice', visual: 'fare', lane: 'status', note: 'Flag the change next to the fare and say why: “Tatkal fare from 10 am”.' },
      { id: 'g6', label: 'Quota choices are GN, TQ, LD and PT, with no explanation', visual: 'quota', lane: 'match', note: 'Use words, General, Tatkal, Ladies and Premium Tatkal, each with a line on who it’s for.' },
      { id: 'g7', label: 'A passenger can’t be removed once added, only “Clear all”', visual: 'passengers', lane: 'control', note: 'Give each passenger a Remove button, and an Undo after removing.' },
      { id: 'g8', label: '“Book now” pays at once, without showing the passengers and fare first', visual: 'book', lane: 'prevention', note: 'Add a review step with passengers, berths and the total before taking payment.' },
    ],
  },
  gap: {
    id: 'gap', from: 11, at: 16.4,
    prompt: 'Three designers have reviewed the screen alone. What next?',
    options: [{ id: 'a', label: 'Keep the longest list' }, { id: 'b', label: 'Merge all three lists and remove duplicates' }, { id: 'c', label: 'Average their scores' }],
    correct: 'b', explanation: 'Each list covers a different part of the problems. Together they cover most.',
  },
  takeaways: [
    { title: 'Ten heuristics', body: 'Nielsen’s ten are a checklist for spotting common usability problems without users.' },
    { title: 'Three to five, alone', body: 'One evaluator finds about a third. Several, working alone and then merging, find most.' },
    { title: 'Where, which, why', body: 'Log each problem with its location, the heuristic it breaks and why it hurts.' },
    { title: 'Not a user test', body: 'It clears the obvious problems quickly. Users still find the ones experts can’t predict.' },
  ],
  quiz: {
    seconds: 12,
    questions: [
      { id: 'q1', prompt: 'No spinner after tapping Pay breaks…', options: [{ id: 'a', label: 'Visibility of system status' }, { id: 'b', label: 'Help and documentation' }], correct: 'a', explanation: 'People can’t see that anything is happening.' },
      { id: 'q2', prompt: 'Showing “GN” instead of “General” breaks…', options: [{ id: 'a', label: 'Error prevention' }, { id: 'b', label: 'Match between the system and the real world' }, { id: 'c', label: 'Flexibility' }], correct: 'b', explanation: 'System codes instead of the user’s words.' },
      { id: 'q3', prompt: 'No undo after deleting a passenger breaks…', options: [{ id: 'a', label: 'User control and freedom' }, { id: 'b', label: 'Aesthetic design' }, { id: 'c', label: 'System status' }], correct: 'a', explanation: 'There’s no way back from a mistake.' },
      { id: 'q4', prompt: 'How many evaluators find most problems?', options: [{ id: 'a', label: 'One' }, { id: 'b', label: 'Three to five' }, { id: 'c', label: 'Twenty' }], correct: 'b', explanation: 'Beyond five, each new evaluator adds little.' },
      { id: 'q5', prompt: 'A date picker that blocks past dates is…', options: [{ id: 'a', label: 'Error prevention' }, { id: 'b', label: 'Minimalist design' }, { id: 'c', label: 'Documentation' }], correct: 'a', explanation: 'It stops the mistake before it happens.' },
    ],
  },
  ladder: [
    { id: 'l1', prompt: 'A form remembers your last three passengers so you can pick them. Which heuristic does that serve?', hint: 'Pick, don’t remember.', options: [{ id: 'a', label: 'Recognition rather than recall' }, { id: 'b', label: 'Error prevention' }, { id: 'c', label: 'Help and documentation' }, { id: 'd', label: 'System status' }], correct: 'a', explanation: 'Choosing from a list is easier than typing names and ages from memory.' },
    { id: 'l2', prompt: 'The error “Transaction failed (E-502)” breaks which heuristic?', hint: 'Can they recover?', options: [{ id: 'a', label: 'Consistency and standards' }, { id: 'b', label: 'Help users recognise, diagnose and recover from errors' }, { id: 'c', label: 'Aesthetic and minimalist design' }, { id: 'd', label: 'Flexibility' }], correct: 'b', explanation: 'It doesn’t say what went wrong, whether money left the account, or what to do next.' },
    { id: 'l3', prompt: 'Why must each finding name a heuristic and a location?', hint: 'Someone else will fix it.', options: [{ id: 'a', label: 'For decoration' }, { id: 'b', label: 'So the team can find it, see why it matters, and merge duplicates across evaluators' }, { id: 'c', label: 'To score the evaluator' }, { id: 'd', label: 'It’s not needed' }], correct: 'b', explanation: 'A vague “feels confusing” can’t be merged, prioritised or fixed.' },
    { id: 'l4', prompt: 'A heuristic review finds few problems. Is the design usable?', hint: 'Experts aren’t users.', options: [{ id: 'a', label: 'Yes, ship it' }, { id: 'b', label: 'It’s a good sign, but only users can tell you that' }, { id: 'c', label: 'No, the review failed' }, { id: 'd', label: 'Add more heuristics' }], correct: 'b', explanation: 'It catches known kinds of problems. Users bring their own context, words and surprises.' },
    { id: 'l5', prompt: 'Power users want to rebook a regular trip in one tap. Which heuristic asks for this?', hint: 'Shortcuts for experts.', options: [{ id: 'a', label: 'Match with the real world' }, { id: 'b', label: 'User control and freedom' }, { id: 'c', label: 'Flexibility and efficiency of use' }, { id: 'd', label: 'Error prevention' }], correct: 'c', explanation: 'Accelerators speed up frequent users without getting in the way of new ones.' },
  ],
};
