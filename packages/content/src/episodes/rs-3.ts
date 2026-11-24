// Episodes for chapter rs.3 · Synthesis. Drafts by Claude, for review.
// One study runs through the chapter: Nisha's team at Dawaa, a medicine-delivery app, interviewed 12 people (P1–P12)
// about keeping a family's regular medicines topped up.
import type { Episode } from '../episode';

export const rs3_1: Episode = {
  lessonId: 'rs.3-1',
  hook: 'Twelve interviews, 140 sticky notes and one wall. Watch the notes find their own groups.',
  scene: {
    id: 'affinity-map', duration: 34,
    beats: [
      { at: 0, title: 'A wall of notes', body: 'Nisha’s team at Dawaa has finished 12 interviews about medicine refills. Every note goes on the wall.' },
      { at: 5, title: 'One note, one idea', body: 'Each sticky holds one quote or one thing someone did, tagged with who: P1 to P12.' },
      { at: 10, title: 'Topics first', body: 'Arjun draws columns before reading: Price, Delivery, App. Half the notes fit nowhere, and the rest pile into App.' },
      { at: 16, title: 'Bottom up', body: 'Start again from the notes. Move the ones that belong together, and groups appear by themselves.' },
      { at: 22, title: 'Name it like a person', body: '“Ordering” becomes “I order for someone I can’t see”. The label now says what the group found.' },
      { at: 27, title: 'Count the people', body: 'Seven of twelve people are in that group. One note from one loud person is a lead to check, not a finding.' },
    ],
  },
  check: [
    { id: 'c1', prompt: 'Why did Arjun’s topic columns fail?', options: [{ id: 'a', label: 'They were written before reading the notes' }, { id: 'b', label: 'There were too few sticky notes' }, { id: 'c', label: 'The wall was too small' }],
      correct: 'a', explanation: 'Groups come from the notes. Topics you pick in advance only find what you expected.' },
    { id: 'c2', prompt: 'What makes a group a finding rather than a lead?', options: [{ id: 'a', label: 'It has the most notes' }, { id: 'b', label: 'Its notes come from many different people' }, { id: 'c', label: 'The manager likes it' }],
      correct: 'b', explanation: 'Count people, not notes. Ten notes from one person is still one person.' },
  ],
  game: {
    id: 'affinity-wall', title: 'Group the wall',
    instructions: 'Twelve notes from the Dawaa interviews, each tagged with who said or did it. Stick each note under the group it belongs to. Watch how many different people each group holds.',
    lanes: [
      { id: 'far', label: '“I order for someone I can’t see”', hint: 'Refills run from another city' },
      { id: 'rx', label: '“The prescription is somewhere in WhatsApp”', hint: 'Finding the right prescription' },
      { id: 'swap', label: '“A different strip looks like the wrong medicine”', hint: 'Substitutes and trust' },
      { id: 'chemist', label: '“The chemist remembers for us”', hint: 'Why the local shop wins' },
    ],
    cards: [
      { id: 'g1', label: '“I only find out she’s run out when she calls me at work.”', visual: 'P3', lane: 'far', note: 'Sunita orders from Pune; her mother is in Nashik. The order starts with a phone call, too late.' },
      { id: 'g2', label: '“I scroll back months in the family group to find the newest prescription.”', visual: 'P1', lane: 'rx', note: 'The prescription exists, but nobody knows which photo is the current one.' },
      { id: 'g3', label: 'Refused tablets that came in a blue strip instead of the usual white one.', visual: 'P7', lane: 'swap', note: 'Same medicine, different packaging. To her, it looked like a mistake.' },
      { id: 'g4', label: '“Sharma uncle knows her medicines. I just say ‘the usual’.”', visual: 'P4', lane: 'chemist', note: 'The chemist holds the list in his head, so the family doesn’t have to.' },
      { id: 'g5', label: 'Orders his father’s insulin from Dubai, through a cousin in Lucknow.', visual: 'P5', lane: 'far', note: 'Ordering from another country, through a third person. The same theme, further away.' },
      { id: 'g6', label: 'Sent a prescription photo that had expired. The order was cancelled the next morning.', visual: 'P8', lane: 'rx', note: 'An old photo looks the same as a new one in a chat.' },
      { id: 'g7', label: '“The chemist said it’s the same salt. My mother still wouldn’t take it.”', visual: 'P9', lane: 'swap', note: 'Being told it’s the same didn’t make her trust it.' },
      { id: 'g8', label: '“My brother and I both ordered last month. Neither of us knew.”', visual: 'P6', lane: 'far', note: 'Two people ordering from two cities, and neither can see the other’s orders.' },
      { id: 'g9', label: '“Dad’s doctor writes on a paper slip. I ask him to photograph it, and it comes out blurry.”', visual: 'P12', lane: 'rx', note: 'Getting the prescription into the app depends on someone else’s camera.' },
      { id: 'g10', label: 'Phones his son to read out the brand name before taking anything new.', visual: 'P2', lane: 'swap', note: 'A new name on the strip needs a second opinion before he’ll swallow it.' },
      { id: 'g11', label: 'Keeps a photo of her parents’ medicine shelf to check what’s left.', visual: 'P11', lane: 'far', note: 'A workaround for not being there: a photo stands in for looking at the shelf.' },
      { id: 'g12', label: 'The chemist’s boy drops the strips home and checks them with her at the door.', visual: 'P10', lane: 'chemist', note: 'Someone checks the delivery with her. The app delivers a box and leaves.' },
    ],
  },
  gap: {
    id: 'gap', from: 10, at: 15.4,
    prompt: 'Arjun’s columns aren’t working. What should the team do?',
    options: [{ id: 'a', label: 'Add more topic columns' }, { id: 'b', label: 'Start from the notes: move the ones that belong together, then name the groups' }, { id: 'c', label: 'Throw away the notes that don’t fit' }],
    correct: 'b', explanation: 'Build groups from the bottom up. The notes that didn’t fit are often the finding.',
  },
  takeaways: [
    { title: 'One note, one idea', body: 'A single quote or observation per note, tagged with who it came from.' },
    { title: 'Bottom up', body: 'Let groups form from the notes. Topics written in advance only find what you expected.' },
    { title: 'Name and count', body: 'Label a group with a sentence a participant could say, and count the people in it.' },
  ],
  quiz: {
    seconds: 12,
    questions: [
      { id: 'q1', prompt: 'A sticky note should hold…', options: [{ id: 'a', label: 'A whole interview' }, { id: 'b', label: 'One quote or observation' }], correct: 'b', explanation: 'One idea per note, so it can move freely.' },
      { id: 'q2', prompt: 'Which label is stronger?', options: [{ id: 'a', label: '“I order for someone I can’t see”' }, { id: 'b', label: 'Ordering' }, { id: 'c', label: 'Misc' }], correct: 'a', explanation: 'A sentence says what was found.' },
      { id: 'q3', prompt: 'Ten notes, all from P4, show…', options: [{ id: 'a', label: 'A strong theme' }, { id: 'b', label: 'A pattern across users' }, { id: 'c', label: 'One person’s view, worth checking' }], correct: 'c', explanation: 'Count people, not notes.' },
      { id: 'q4', prompt: 'Why tag each note with P1–P12?', options: [{ id: 'a', label: 'To count how many people a group holds' }, { id: 'b', label: 'For decoration' }, { id: 'c', label: 'To blame participants' }], correct: 'a', explanation: 'The tag is what lets you count reach.' },
    ],
  },
  ladder: [
    { id: 'l1', prompt: 'Why do affinity groups form from the bottom up?', hint: 'What do topic columns miss?', options: [{ id: 'a', label: 'It’s faster' }, { id: 'b', label: 'So the research can show things the team didn’t expect' }, { id: 'c', label: 'Tools require it' }, { id: 'd', label: 'To avoid labels' }], correct: 'b', explanation: 'Pre-set topics bend every note toward what you already believed.' },
    { id: 'l2', prompt: 'A note fits two groups. What do you do?', hint: 'Notes are cheap.', options: [{ id: 'a', label: 'Throw it away' }, { id: 'b', label: 'Pick one at random' }, { id: 'c', label: 'Copy it into both, and look at whether the groups should merge' }, { id: 'd', label: 'Make it its own group' }], correct: 'c', explanation: 'A note that sits in two places often shows two groups are one idea.' },
    { id: 'l3', prompt: 'A group has 15 notes. What should you check next?', hint: 'Big isn’t the same as broad.', options: [{ id: 'a', label: 'How many different participants they came from' }, { id: 'b', label: 'Whether the notes are neat' }, { id: 'c', label: 'Its colour' }, { id: 'd', label: 'Nothing, it’s the biggest' }], correct: 'a', explanation: 'Fifteen notes from two people is narrower than five from five.' },
    { id: 'l4', prompt: 'When should you rename a group?', hint: 'Labels are drafts.', options: [{ id: 'a', label: 'Never, once it’s named' }, { id: 'b', label: 'Only at the end of the project' }, { id: 'c', label: 'Only if the manager asks' }, { id: 'd', label: 'Whenever new notes change what it’s really about' }], correct: 'd', explanation: 'The label should always say what the notes in it show.' },
    { id: 'l5', prompt: 'Three notes fit no group at all. What are they?', hint: 'Odd ones out.', options: [{ id: 'a', label: 'Noise to delete' }, { id: 'b', label: 'Possible surprises: keep them visible and look for more' }, { id: 'c', label: 'Proof the research failed' }, { id: 'd', label: 'Notes to merge into the biggest group' }], correct: 'b', explanation: 'Outliers can be the start of the most valuable finding. Park them where everyone can see.' },
  ],
};

export const rs3_2: Episode = {
  lessonId: 'rs.3-2',
  hook: '“Users want refill reminders.” It sounds like an insight. Watch Nisha ask one question that turns it into one.',
  scene: {
    id: 'observation-insight', duration: 34,
    beats: [
      { at: 0, title: 'An observation', body: 'P3, Sunita: “I only find out she’s run out when she calls me at work.” True, and specific.' },
      { at: 5, title: 'A pattern', body: 'Seven of twelve people order medicines for a parent in another city. Still only what happens.' },
      { at: 10, title: 'The tempting leap', body: 'Arjun writes: “Insight: users want refill reminders.” That’s a feature, and it skips the why.' },
      { at: 15, title: 'Ask why', body: 'Why do they reorder late? They can’t see the shelf. The only sign stock is low is the parent’s call.' },
      { at: 21, title: 'Who, what, because', body: 'Children in another city reorder late, because the only sign that stock is low is a call from home.' },
      { at: 27, title: 'Now the team can design', body: 'How might the person far away see a refill coming before it’s urgent? A reminder is one answer; there are others.' },
    ],
  },
  check: [
    { id: 'c1', prompt: 'What was wrong with “users want refill reminders”?', options: [{ id: 'a', label: 'It named a feature instead of the reason' }, { id: 'b', label: 'It was false' }, { id: 'c', label: 'It was too long' }],
      correct: 'a', explanation: 'A solution in disguise closes off every other answer.' },
    { id: 'c2', prompt: 'What turned the pattern into an insight?', options: [{ id: 'a', label: 'More interviews' }, { id: 'b', label: 'A chart' }, { id: 'c', label: 'Asking why it happens' }],
      correct: 'c', explanation: 'The because is what a design can work on.' },
  ],
  game: {
    id: 'insight-sharpen', title: 'Sharpen the insight',
    instructions: 'Arjun’s first drafts of the Dawaa insights. Diagnose each one: is the why missing, is nobody specific in it, is it a feature in disguise, or is it already sharp? Then watch it rebuilt as who · what · because.',
    lanes: [
      { id: 'why', label: 'No why', hint: 'Says what happens, not why' },
      { id: 'who', label: 'No one in it', hint: '“Users” instead of who exactly' },
      { id: 'fix', label: 'A feature', hint: 'A solution dressed as an insight' },
      { id: 'good', label: 'Sharp', hint: 'Who, what they do, and because' },
    ],
    cards: [
      { id: 'g1', label: 'Seven of twelve people order medicines for a parent in another city.', lane: 'why', visual: 'Children in another city|reorder a parent’s medicines late|because the only sign that stock is low is the parent’s call', note: 'A true pattern that stops before the reason. Ask “why does that matter?”' },
      { id: 'g2', label: 'Users find prescriptions hard.', lane: 'who', visual: 'People ordering for a parent|scroll back months through family chats|because each new prescription arrives as one more WhatsApp photo', note: '“Users” could be anyone. Name who, and what “hard” looked like.' },
      { id: 'g3', label: 'Users want a refill reminder.', lane: 'fix', visual: 'Children far from home|order in a panic after a call|because they can’t see the strip running low from another city', note: 'A reminder is one answer. The insight is the problem it would solve.' },
      { id: 'g4', label: 'Older parents refuse substitute brands because they tell their tablets apart by the strip’s colour.', lane: 'good', visual: 'Older parents|refuse substitute brands|because they tell their tablets apart by the strip’s colour', note: 'Who, what they do, and why. A designer can work with that.' },
      { id: 'g5', label: 'Parents pay the delivery agent in cash even when the order is prepaid.', lane: 'why', visual: 'Parents at home|pay the agent in cash for prepaid orders|because nothing at the door tells them their child already paid', note: 'An odd behaviour is a clue, not yet an insight. Find the reason behind it.' },
      { id: 'g6', label: 'We should add a chat with a pharmacist.', lane: 'fix', visual: 'Parents|stay loyal to the local chemist|because he knows their medicines and checks the strips with them', note: 'A feature idea. Ask what need it would serve, and what the evidence says.' },
      { id: 'g7', label: 'People don’t trust online pharmacies.', lane: 'who', visual: 'Parents who’ve used one chemist for years|doubt deliveries from strangers|because nobody checks the strips with them at the door', note: 'Too broad to act on. Whose trust, lost at which moment?' },
      { id: 'g8', label: 'Siblings both reorder the same medicines because neither can see what the other has ordered.', lane: 'good', visual: 'Siblings|both reorder the same medicines|because neither can see what the other has ordered', note: 'Specific people, a real behaviour, and the reason. Sharp.' },
    ],
  },
  gap: {
    id: 'gap', from: 10, at: 14.6,
    prompt: 'Arjun has written “users want refill reminders”. What should Nisha ask?',
    options: [{ id: 'a', label: '“Which reminder style should we use?”' }, { id: 'b', label: '“Why do people reorder late?”' }, { id: 'c', label: 'Nothing, it’s fine' }],
    correct: 'b', explanation: 'Asking why takes you from a feature back to the problem.',
  },
  takeaways: [
    { title: 'Observation first', body: 'What people said and did, with who. True, but not yet a direction.' },
    { title: 'Insight adds because', body: 'Who, what they do, and why. The why is what a design can change.' },
    { title: 'Features aren’t insights', body: '“Users want X” skips the problem. Ask why they’d want it.' },
  ],
  quiz: {
    seconds: 12,
    questions: [
      { id: 'q1', prompt: '“Most orders arrive between 7 and 9 pm” is…', options: [{ id: 'a', label: 'An insight' }, { id: 'b', label: 'An observation' }], correct: 'b', explanation: 'It reports what happens, not why.' },
      { id: 'q2', prompt: 'An insight needs…', options: [{ id: 'a', label: 'A feature name' }, { id: 'b', label: 'A percentage' }, { id: 'c', label: 'Who, what they do, and why' }], correct: 'c', explanation: 'All three, or the team can’t act on it.' },
      { id: 'q3', prompt: '“Users want dark mode” is…', options: [{ id: 'a', label: 'A solution dressed as an insight' }, { id: 'b', label: 'A sharp insight' }, { id: 'c', label: 'An observation' }], correct: 'a', explanation: 'Ask why they want it.' },
      { id: 'q4', prompt: 'The best question to sharpen a pattern?', options: [{ id: 'a', label: '“How many?”' }, { id: 'b', label: '“Why does that happen?”' }, { id: 'c', label: '“What colour?”' }], correct: 'b', explanation: 'The why is the insight.' },
    ],
  },
  ladder: [
    { id: 'l1', prompt: 'Why is “users” weak in an insight?', hint: 'Who exactly?', options: [{ id: 'a', label: 'It’s too formal' }, { id: 'b', label: 'It hides which people behave this way, so the team designs for everyone and no one' }, { id: 'c', label: 'It’s fine' }, { id: 'd', label: 'It’s too short' }], correct: 'b', explanation: 'Naming the group (“children ordering from another city”) makes the insight testable.' },
    { id: 'l2', prompt: 'How do you know an insight is backed by evidence?', hint: 'Point at the wall.', options: [{ id: 'a', label: 'It sounds right' }, { id: 'b', label: 'The team agrees' }, { id: 'c', label: 'It’s written in bold' }, { id: 'd', label: 'You can name the notes and participants behind it' }], correct: 'd', explanation: 'Every insight should trace back to specific notes from several people.' },
    { id: 'l3', prompt: 'What does a good insight usually contain?', hint: 'Something pulls two ways.', options: [{ id: 'a', label: 'A tension: what people want against what gets in the way' }, { id: 'b', label: 'A feature list' }, { id: 'c', label: 'The app’s name' }, { id: 'd', label: 'A deadline' }], correct: 'a', explanation: 'The tension is where design has room to help.' },
    { id: 'l4', prompt: 'What usually comes right after an insight?', hint: 'Open, not closed.', options: [{ id: 'a', label: 'A final spec' }, { id: 'b', label: 'A “How might we…?” question that invites several answers' }, { id: 'c', label: 'A launch date' }, { id: 'd', label: 'A survey' }], correct: 'b', explanation: 'HMW keeps the solution open so the team can explore.' },
    { id: 'l5', prompt: 'An insight surprises nobody on the team. Is it useless?', hint: 'Confirmation has value too.', options: [{ id: 'a', label: 'Yes, delete it' }, { id: 'b', label: 'Not if it’s evidenced: it can settle a debate. But look harder for the why nobody had named' }, { id: 'c', label: 'Only if the CEO already knew' }, { id: 'd', label: 'Yes, insights must shock' }], correct: 'b', explanation: 'Obvious and evidenced still counts. The best insights often explain something everyone saw but nobody understood.' },
  ],
};

export const rs3_3: Episode = {
  lessonId: 'rs.3-3',
  hook: 'Ravi, 34, loves cricket and owns an iPhone. None of that came from research. Watch three better tools replace him.',
  scene: {
    id: 'persona-jtbd', duration: 34,
    beats: [
      { at: 0, title: 'A persona from nowhere', body: '“Ravi, 34, Bengaluru. Loves cricket and travel. iPhone user.” Nobody can say where he came from.' },
      { at: 5, title: 'Strike what changes nothing', body: 'Cricket, travel and the phone don’t change a single design decision. They go.' },
      { at: 10, title: 'A persona from research', body: 'Sunita, 41, Pune. Orders for her mother in Nashik. Finds out stock is low from a call at work. Built from seven interviews.' },
      { at: 16, title: 'A job story', body: '“When Ma’s tablets are about to run out and I’m 200 km away, I want to know before she does, so I’m not ordering in a panic.”' },
      { at: 22, title: 'Archetypes', body: 'Grouped by behaviour, not age: the remote organiser, the self-manager, the local helper. A 70-year-old and a 30-year-old can share one.' },
      { at: 28, title: 'Pick by the question', body: 'Who are we designing for? Persona. What progress, against which rivals? Job. How does behaviour differ? Archetypes.' },
    ],
  },
  check: [
    { id: 'c1', prompt: 'Why did Ravi’s cricket and iPhone go?', options: [{ id: 'a', label: 'They change no design decision' }, { id: 'b', label: 'Cricket is unpopular' }, { id: 'c', label: 'The persona was too short' }],
      correct: 'a', explanation: 'Detail that changes nothing only makes a persona feel real.' },
    { id: 'c2', prompt: 'What do archetypes group people by?', options: [{ id: 'a', label: 'Age' }, { id: 'b', label: 'City' }, { id: 'c', label: 'Behaviour' }],
      correct: 'c', explanation: 'What people do, whatever their age or city.' },
  ],
  game: {
    id: 'tool-fit', title: 'Which tool answers it?',
    instructions: 'The Dawaa team has a persona, a job story and three archetypes, all from the same 12 interviews. Each card is a question the team is stuck on. Tap the tool that answers it, and see the line that does.',
    lanes: [
      { id: 'persona', label: 'Persona', hint: 'One real person the team can picture' },
      { id: 'job', label: 'Job story', hint: 'Situation, motivation, outcome' },
      { id: 'arch', label: 'Archetypes', hint: 'Behaviour patterns, not demographics' },
    ],
    cards: [
      { id: 'g1', label: 'New engineers keep asking who our user is. What do we pin on the wall?', lane: 'persona', visual: 'context', note: 'One person, built from research, gives the whole team the same picture.' },
      { id: 'g2', label: 'What counts as success for someone refilling a parent’s tablets?', lane: 'job', visual: 'outcome', note: 'The outcome says what “done” means: not ordering in a panic.' },
      { id: 'g3', label: 'Should the home screen be built for people ordering their own medicines, or someone else’s?', lane: 'arch', visual: 'remote', note: 'Seven of twelve are remote organisers. That decides who the home screen serves first.' },
      { id: 'g4', label: 'Why do families stick with the local chemist instead of switching to us?', lane: 'job', visual: 'motivation', note: 'The chemist is hired for the same job: knowing before it runs out. That’s the real rival.' },
      { id: 'g5', label: 'A designer is writing the empty state for a first refill. Whose worry should it speak to?', lane: 'persona', visual: 'frustration', note: 'Sunita’s frustration, finding out from a worried call, gives the copy something real to answer.' },
      { id: 'g6', label: 'A 72-year-old orders her own tablets every month. Is she a different user from a 30-year-old who does the same?', lane: 'arch', visual: 'self', note: 'Same behaviour, same archetype. Age doesn’t split them.' },
      { id: 'g7', label: 'At what moment should a refill alert reach someone?', lane: 'job', visual: 'situation', note: 'The situation names the moment: tablets about to run out, family far away.' },
      { id: 'g8', label: 'Where do neighbours and chemists fit into a family’s refills?', lane: 'arch', visual: 'helper', note: 'The local helper is a behaviour pattern of its own, and a partner, not a rival.' },
      { id: 'g9', label: 'In one line, what does our main user need from the app?', lane: 'persona', visual: 'goal', note: 'Sunita’s goal: her mother’s medicines never run out.' },
    ],
  },
  gap: {
    id: 'gap', from: 16, at: 21.4,
    prompt: 'The team asks why families stay with the local chemist. Which tool answers that best?',
    options: [{ id: 'a', label: 'A persona' }, { id: 'b', label: 'A job story' }, { id: 'c', label: 'A stock photo' }],
    correct: 'b', explanation: 'The job shows what the chemist is hired for, so you can see what you’re competing with.',
  },
  takeaways: [
    { title: 'Personas from research', body: 'One real-feeling person for shared empathy. Cut any detail that changes no decision.' },
    { title: 'Jobs for progress', body: 'Situation, motivation, outcome. Shows what “done” means and who you really compete with.' },
    { title: 'Archetypes for behaviour', body: 'Group by what people do, not age or city. Choose the tool by the question.' },
  ],
  quiz: {
    seconds: 12,
    questions: [
      { id: 'q1', prompt: '“Loves cricket” in a persona is…', options: [{ id: 'a', label: 'Useful context' }, { id: 'b', label: 'Fluff, unless it changes a decision' }], correct: 'b', explanation: 'Keep only what matters to the design.' },
      { id: 'q2', prompt: 'A job story starts with…', options: [{ id: 'a', label: 'The situation: “When…”' }, { id: 'b', label: 'A name and age' }, { id: 'c', label: 'A feature' }], correct: 'a', explanation: 'When…, I want to…, so I can…' },
      { id: 'q3', prompt: 'Archetypes are built from…', options: [{ id: 'a', label: 'Census data' }, { id: 'b', label: 'Ages and cities' }, { id: 'c', label: 'Patterns of behaviour' }], correct: 'c', explanation: 'What people do.' },
      { id: 'q4', prompt: 'A persona’s main job is…', options: [{ id: 'a', label: 'Decorating the deck' }, { id: 'b', label: 'Giving a team one shared, research-based person' }, { id: 'c', label: 'Replacing research' }], correct: 'b', explanation: 'Shared empathy, grounded in evidence.' },
    ],
  },
  ladder: [
    { id: 'l1', prompt: 'What makes a persona dangerous?', hint: 'Where did Ravi come from?', options: [{ id: 'a', label: 'Invented detail that looks like evidence' }, { id: 'b', label: 'Having a photo' }, { id: 'c', label: 'Being one page' }, { id: 'd', label: 'Having a name' }], correct: 'a', explanation: 'A made-up persona gives assumptions a face, and people stop questioning them.' },
    { id: 'l2', prompt: 'Why can a job story outlast a product?', hint: 'The need stays; tools change.', options: [{ id: 'a', label: 'It’s shorter' }, { id: 'b', label: 'Engineers prefer it' }, { id: 'c', label: 'The progress people want stays the same when the products change' }, { id: 'd', label: 'It has no user in it' }], correct: 'c', explanation: 'People wanted refills sorted before apps existed; the chemist did that job.' },
    { id: 'l3', prompt: 'When do archetypes beat personas?', hint: 'Same age, different behaviour.', options: [{ id: 'a', label: 'Never' }, { id: 'b', label: 'When behaviour varies more than demographics do' }, { id: 'c', label: 'Only for B2B' }, { id: 'd', label: 'When there’s no research' }], correct: 'b', explanation: 'If a 30-year-old and a 70-year-old act the same, a demographic persona splits them for no reason.' },
    { id: 'l4', prompt: 'How many personas should a team usually have?', hint: 'Can you hold them in your head?', options: [{ id: 'a', label: 'One per user' }, { id: 'b', label: 'At least ten' }, { id: 'c', label: 'Exactly one, always' }, { id: 'd', label: 'Few enough to remember, each tied to a real difference in behaviour or need' }], correct: 'd', explanation: 'Usually two to four. More and nobody uses them.' },
    { id: 'l5', prompt: 'A stakeholder brings a persona with no research behind it. Best move?', hint: 'Test it, don’t fight it.', options: [{ id: 'a', label: 'Use it as is' }, { id: 'b', label: 'Bin it in front of them' }, { id: 'c', label: 'Treat it as a set of assumptions and check each against the interviews' }, { id: 'd', label: 'Add more detail to it' }], correct: 'c', explanation: 'An assumption persona is a useful list of things to test.' },
  ],
};

export const rs3_4: Episode = {
  lessonId: 'rs.3-4',
  hook: 'The roadmap says “redesign checkout”. Twelve interviews, mapped stage by stage, say something else.',
  scene: {
    id: 'journey-map', duration: 34,
    beats: [
      { at: 0, title: 'The roadmap says checkout', body: 'Arjun’s plan for the quarter: redesign checkout. Nisha has the 12 Dawaa interviews.' },
      { at: 5, title: 'Stages', body: 'A refill from far away: notice it’s low, find the prescription, order and pay, receive and check.' },
      { at: 10, title: 'Evidence under each', body: 'Quotes and what people did, tagged P1 to P12, go under the stage where they happened.' },
      { at: 15, title: 'The feeling line', body: 'Plotted from what people said and did. Ordering and paying feels fine. Noticing hits the bottom.' },
      { at: 21, title: 'Mark the low point', body: '“Fix here first”, with the evidence, who owns it, and one opportunity.' },
      { at: 27, title: 'The map changes the plan', body: 'The quarter goes to letting families see a refill coming. Checkout stays as it is.' },
    ],
  },
  check: [
    { id: 'c1', prompt: 'Where was the lowest point on the map?', options: [{ id: 'a', label: 'Order and pay' }, { id: 'b', label: 'Noticing stock is low' }, { id: 'c', label: 'Nowhere' }],
      correct: 'b', explanation: 'People found out too late, from a worried phone call.' },
    { id: 'c2', prompt: 'What did the map change?', options: [{ id: 'a', label: 'The colour scheme' }, { id: 'b', label: 'Nothing' }, { id: 'c', label: 'What the team works on this quarter' }],
      correct: 'c', explanation: 'A journey map is worth making when it moves a decision.' },
  ],
  game: {
    id: 'journey-plot', title: 'Map the refill',
    instructions: 'Ten pieces of evidence from the Dawaa interviews. Put each under the stage of the refill where it happened. Each one adds a point to the feeling line. Then see where the map says to act.',
    lanes: [
      { id: 'notice', label: 'Notice it’s low', hint: 'Realising a refill is due' },
      { id: 'rx', label: 'Find the prescription', hint: 'Getting a valid prescription in' },
      { id: 'order', label: 'Order and pay', hint: 'Choosing, paying, confirming' },
      { id: 'arrive', label: 'Receive and check', hint: 'The box at the door' },
    ],
    cards: [
      { id: 'g1', label: 'P3: “I only find out she’s run out when she calls me at work.”', lane: 'notice', visual: '-2', note: 'The refill starts with a worry, and already late.' },
      { id: 'g2', label: 'P4: “Paying was the easy part. Two taps on UPI.”', lane: 'order', visual: '2', note: 'Checkout works. Redesigning it would polish the best part.' },
      { id: 'g3', label: 'P8 sent an expired prescription. The order was cancelled the next morning.', lane: 'rx', visual: '-2', note: 'A lost day, found out only after the order was placed.' },
      { id: 'g4', label: 'P7’s mother refused a blue strip that replaced her usual white one.', lane: 'arrive', visual: '-2', note: 'The right medicine, rejected at the door because it looked wrong.' },
      { id: 'g5', label: 'P5: “Insulin can’t run out. I lie awake doing the maths.”', lane: 'notice', visual: '-2', note: 'Counting days in his head, from another country.' },
      { id: 'g6', label: 'P1: “I scroll back months in the family group to find the newest one.”', lane: 'rx', visual: '-1', note: 'Annoying, not a disaster, but it happens every month.' },
      { id: 'g7', label: 'P9 reorders from “Past orders” in under a minute.', lane: 'order', visual: '1', note: 'Repeat orders are quick once someone knows it’s time.' },
      { id: 'g8', label: 'P11 waits for the Sunday photo of the medicine shelf to see what’s left.', lane: 'notice', visual: '-1', note: 'A weekly workaround, and a week is a long time when a strip runs out on Tuesday.' },
      { id: 'g9', label: 'P12: “Once I finally had a clear photo, uploading it was easy.”', lane: 'rx', visual: '0', note: 'The app part is fine. The pain is before it.' },
      { id: 'g10', label: 'P10’s order came at 8 pm. “She was relieved it was the right box.”', lane: 'arrive', visual: '1', note: 'Relief when it’s right, which shows how much worry the earlier stages build up.' },
    ],
  },
  gap: {
    id: 'gap', from: 15, at: 20.4,
    prompt: 'The lowest point is noticing stock is low. Checkout feels fine. What should the team do?',
    options: [{ id: 'a', label: 'Redesign checkout anyway, it’s on the roadmap' }, { id: 'b', label: 'Move the effort to noticing, and show the evidence' }, { id: 'c', label: 'Make the map look nicer' }],
    correct: 'b', explanation: 'Act where people struggle most, and bring the evidence so the change of plan is easy to agree.',
  },
  takeaways: [
    { title: 'Built from evidence', body: 'Every stage and every point on the feeling line traces back to what people said and did.' },
    { title: 'Find the low point', body: 'Mark where people feel worst. It’s often not where the team expected.' },
    { title: 'End in a decision', body: 'An owner and an opportunity at each low point, so the map changes the plan.' },
  ],
  quiz: {
    seconds: 12,
    questions: [
      { id: 'q1', prompt: 'A journey map’s feeling line comes from…', options: [{ id: 'a', label: 'The team’s guesses' }, { id: 'b', label: 'What participants said and did' }], correct: 'b', explanation: 'Evidence, not assumptions.' },
      { id: 'q2', prompt: 'Fix first at…', options: [{ id: 'a', label: 'The stage the roadmap names' }, { id: 'b', label: 'The prettiest stage' }, { id: 'c', label: 'The lowest point' }], correct: 'c', explanation: 'Where people struggle most.' },
      { id: 'q3', prompt: 'A map that changes no decision is…', options: [{ id: 'a', label: 'Decoration' }, { id: 'b', label: 'A success' }, { id: 'c', label: 'Finished' }], correct: 'a', explanation: 'The point is to choose what to do.' },
      { id: 'q4', prompt: 'Each low point should get…', options: [{ id: 'a', label: 'A bigger font' }, { id: 'b', label: 'An owner and an opportunity' }, { id: 'c', label: 'Nothing more' }], correct: 'b', explanation: 'So someone acts on it.' },
    ],
  },
  ladder: [
    { id: 'l1', prompt: 'Why map a journey across stages instead of listing pain points?', hint: 'Order matters.', options: [{ id: 'a', label: 'It looks better' }, { id: 'b', label: 'Stages show where a problem starts and how it builds up later' }, { id: 'c', label: 'Lists are banned' }, { id: 'd', label: 'Stages are shorter' }], correct: 'b', explanation: 'A late refill (notice) causes the panic order and the worried wait that follow.' },
    { id: 'l2', prompt: 'What should a journey map be about?', hint: 'One person, one goal.', options: [{ id: 'a', label: 'Every user and every task at once' }, { id: 'b', label: 'The app’s screens' }, { id: 'c', label: 'One kind of user doing one job, end to end' }, { id: 'd', label: 'The company’s org chart' }], correct: 'c', explanation: 'Mix several users or tasks and the feeling line means nothing.' },
    { id: 'l3', prompt: 'What’s the difference between a journey map and a service blueprint?', hint: 'Front stage and back stage.', options: [{ id: 'a', label: 'None' }, { id: 'b', label: 'Blueprints are only for hospitals' }, { id: 'c', label: 'Journey maps have no stages' }, { id: 'd', label: 'A blueprint adds the staff, systems and processes behind each step' }], correct: 'd', explanation: 'The journey is what the user lives; the blueprint shows what makes it happen.' },
    { id: 'l4', prompt: 'Should you map today’s journey or the future one first?', hint: 'Know where you start.', options: [{ id: 'a', label: 'Today’s, from research; then sketch the future one against it' }, { id: 'b', label: 'Only the future one' }, { id: 'c', label: 'Neither' }, { id: 'd', label: 'Whichever is prettier' }], correct: 'a', explanation: 'A future map with no current map has nothing to improve on.' },
    { id: 'l5', prompt: 'A stage has evidence from only one participant. What do you show?', hint: 'Be honest about weak spots.', options: [{ id: 'a', label: 'Hide the stage' }, { id: 'b', label: 'Mark it as thin evidence, to check in the next round' }, { id: 'c', label: 'Invent more quotes' }, { id: 'd', label: 'Average it with another stage' }], correct: 'b', explanation: 'A map that shows its gaps can be trusted.' },
  ],
};
