// Episodes for chapter ds.4 · Governance & adoption. Drafts by Claude, for review.
// Rasta again, two years after ds.2 and ds.3: bus, metro and suburban-rail passes in four cities, 38 designers in
// nine squads. Kavya now leads a design-system team of four, with Arjun as its lead engineer. This chapter is about
// running the system as a product: how requests get in, how releases are numbered and old APIs retired, and how
// adoption is measured. The requests, changes and scans, and the rules they're judged by, are in ../governance and
// tested there.
import type { Episode } from '../episode';
import {
  RASTA_CHANGES, RASTA_REQUESTS, RASTA_SCANS, adoptionRead, bumpFor, contributionPath,
  type RastaChange, type RastaRequest, type RastaScan,
} from '../governance';

const request = (k: RastaRequest) => RASTA_REQUESTS[k].text;
const path = (k: RastaRequest) => contributionPath(RASTA_REQUESTS[k]);
const change = (k: RastaChange) => RASTA_CHANGES[k].text;
const bump = (k: RastaChange) => bumpFor(RASTA_CHANGES[k]);
const scan = (k: RastaScan) => RASTA_SCANS[k].text;
const read = (k: RastaScan) => adoptionRead(RASTA_SCANS[k]);

export const ds4_1: Episode = {
  lessonId: 'ds.4-1',
  hook: 'Kavya’s team of four has 61 requests in its queue, the oldest 14 weeks old. Meanwhile four squads have each built their own date picker. Watch the queue turn into a path.',
  scene: {
    id: 'contribution-models', duration: 36,
    beats: [
      { at: 0, title: 'Sixty-one requests', body: 'Rasta has 38 designers in nine squads now. Every request still goes to Kavya’s team of four. The oldest has waited 14 weeks, and four squads have built their own date pickers.' },
      { at: 6, title: 'Everything through one team', body: 'Centralised: quality stays high, and every request joins one queue. Past a few squads, the queue is the product.' },
      { at: 11, title: 'Everyone publishes', body: 'Federated: any squad can publish. Within a month the library has three tab bars and nobody owns any of them.' },
      { at: 16, title: 'A core and a path', body: 'Hybrid: the core team owns foundations, core components and releases. Squads contribute through a defined path, reviewed by the core.' },
      { at: 21, title: 'Route by need', body: 'Already exists: reuse it. One squad: keep it local, logged. Two squads, or a variant: the squad contributes. Three or more need a new component: core builds it.' },
      { at: 26, title: 'Cheaper than going around', body: 'A ten-minute proposal template, office hours every Thursday, a review within five working days, and the contributor’s name in the release notes.' },
      { at: 31, title: 'Two weeks, not fourteen', body: 'A quarter later: 18 requests open, a median wait of two weeks, and eleven contributions shipped by squads.' },
    ],
  },
  check: [
    { id: 'c1', prompt: 'Why did the fully federated model fail at Rasta?', options: [{ id: 'a', label: 'Squads designed badly' }, { id: 'b', label: 'Nobody was accountable for the whole, so duplicates went straight into the library' }, { id: 'c', label: 'It was too slow' }],
      correct: 'b', explanation: 'Shared ownership without a core owner means no one says no.' },
    { id: 'c2', prompt: 'A component only one squad needs goes…', options: [{ id: 'a', label: 'Into the system, in case' }, { id: 'b', label: 'In the product, on system tokens, logged so a second request finds it' }, { id: 'c', label: 'Nowhere: it’s refused' }],
      correct: 'b', explanation: 'Promote it when a second squad brings a second real case.' },
  ],
  game: {
    id: 'contribution-route', title: 'Route the queue',
    instructions: 'Each card is a request in Kavya’s queue. Route it: reuse what exists, keep it local, have the squad contribute it, or give it to the core team. Right calls show who does what, and spend the core team’s 320 hours for the quarter.',
    lanes: [
      { id: 'reuse', label: 'Reuse', hint: 'The system already does this job' },
      { id: 'local', label: 'Keep local', hint: 'One squad, or a one-off' },
      { id: 'contribute', label: 'Squad contributes', hint: 'A fix, a variant, or shared by two' },
      { id: 'core', label: 'Core builds', hint: 'A new component three or more squads need' },
    ],
    cards: [
      { id: 'g1', label: request('datePicker'), lane: path('datePicker'), visual: 'datePicker', note: 'Four squads, four date pickers, four sets of bugs. The core team gathers all four cases and builds one; the Bus squad pilots it.' },
      { id: 'g2', label: request('qrTicket'), lane: path('qrTicket'), visual: 'qrTicket', note: 'Only Metro has gates. Build it on system tokens, log it, and promote it when Suburban rail needs a gate ticket too.' },
      { id: 'g3', label: request('dangerTertiary'), lane: path('dangerTertiary'), visual: 'dangerTertiary', note: 'A variant two squads need. Payments builds it in the system; the core team checks contrast and that it fits the variant enum.' },
      { id: 'g4', label: request('focusRing'), lane: path('focusRing'), visual: 'focusRing', note: 'Fixes are welcome from anyone. The Rider support engineer who found it opens the pull request; the core team reviews it.' },
      { id: 'g5', label: request('snackbar'), lane: path('snackbar'), visual: 'snackbar', note: 'Rasta’s Toast already does this. The real fix is the docs: add “snackbar” as a search alias so the next person finds it.' },
      { id: 'g6', label: request('stepper'), lane: path('stepper'), visual: 'stepper', note: 'One flow, one squad. Build it from system parts in the product and log it. If Onboarding asks for one, that’s the second case.' },
      { id: 'g7', label: request('fareTable'), lane: path('fareTable'), visual: 'fareTable', note: 'Three squads, and tables are hard: sorting, sticky columns, screen readers. That’s core work, designed from all three cases.' },
      { id: 'g8', label: request('tabBadge'), lane: path('tabBadge'), visual: 'tabBadge', note: 'A small addition two squads share. Rider support contributes it, paired with a core engineer for the screen-reader count.' },
      { id: 'g9', label: request('routeSheet'), lane: path('routeSheet'), visual: 'routeSheet', note: 'That’s the Sheet component. Point the squad to it and ask why they missed it: the docs call it a “drawer”.' },
      { id: 'g10', label: request('stopPin'), lane: path('stopPin'), visual: 'stopPin', note: 'Two squads need it, and Metro needs it first. Metro builds it in the system with review, and Bus adopts it.' },
      { id: 'g11', label: request('pongal'), lane: path('pongal'), visual: 'pongal', note: 'A one-week campaign. Growth builds it from system parts; it never needed to be in the library.' },
    ],
  },
  gap: {
    id: 'gap', from: 11, at: 15.6,
    prompt: 'The squads complain that the core team is slow. The CTO suggests letting every squad publish to the library. What does Kavya propose?',
    options: [{ id: 'a', label: 'Agree: speed matters most' }, { id: 'b', label: 'A hybrid: the core keeps foundations, core components and the final review; squads contribute through a template with a five-day review' }, { id: 'c', label: 'Hire more people and keep the queue' }],
    correct: 'b', explanation: 'Open the path, keep an owner. Speed comes from routing, not from removing review.',
  },
  takeaways: [
    { title: 'Hybrid at scale', body: 'A small core owns foundations, core components and releases. Squads contribute the rest through a defined path.' },
    { title: 'Route by need', body: 'Exists: reuse. One squad: local and logged. Two squads or a variant: contribute. Three or more need a new component: core.' },
    { title: 'Fixes from anyone', body: 'The person who found the bug can fix it. The core team reviews.' },
    { title: 'Make the path cheap', body: 'A short template, office hours, a review time squads can plan around, and credit in the release notes.' },
  ],
  quiz: {
    seconds: 15,
    questions: [
      { id: 'q1', prompt: 'A bug fix from a product squad should be…', options: [{ id: 'a', label: 'Welcomed and reviewed' }, { id: 'b', label: 'Rejected' }, { id: 'c', label: 'Queued for the core team' }], correct: 'a', explanation: 'Fixes are the easiest contribution.' },
      { id: 'q2', prompt: 'Three squads need a new data table. Who builds it?', options: [{ id: 'a', label: 'The first squad to ask' }, { id: 'b', label: 'The core team' }, { id: 'c', label: 'Each squad' }], correct: 'b', explanation: 'Wide, hard, and has to fit every case.' },
      { id: 'q3', prompt: 'Only Metro needs a gate ticket card. It goes…', options: [{ id: 'a', label: 'Into the library' }, { id: 'b', label: 'In Metro’s product, logged' }, { id: 'c', label: 'Nowhere' }], correct: 'b', explanation: 'Promote it on the second request.' },
      { id: 'q4', prompt: 'Besides queue length, track…', options: [{ id: 'a', label: 'Queue age' }, { id: 'b', label: 'Slack messages' }, { id: 'c', label: 'Figma file size' }], correct: 'a', explanation: 'Old requests get built around.' },
    ],
  },
  ladder: [
    { id: 'l1', prompt: 'Why does a centralised model stop working as an organisation grows?', hint: 'Count the requests and the people.', options: [{ id: 'a', label: 'Central teams lose skill' }, { id: 'b', label: 'Requests grow with the number of squads, the core team doesn’t, and squads build around a queue they can’t wait for' }, { id: 'c', label: 'Leadership loses interest' }, { id: 'd', label: 'Tools get slower' }], correct: 'b', explanation: 'The workaround is a local copy, and local copies are what the system was meant to prevent.' },
    { id: 'l2', prompt: 'Why should a one-squad component wait for a second squad before joining the system?', hint: 'What does the API look like when it’s designed from one case?', options: [{ id: 'a', label: 'To save storage' }, { id: 'b', label: 'One case gives an API shaped like that case; the second case shows what’s really shared, before the API is promised to everyone' }, { id: 'c', label: 'To punish the first squad' }, { id: 'd', label: 'It’s a legal requirement' }], correct: 'b', explanation: 'Promoting too early means breaking the API when the second case arrives.' },
    { id: 'l3', prompt: 'A senior designer’s contribution is good but doesn’t fit the system’s variant enum. What should the review do?', hint: 'What does a contributor need from a review?', options: [{ id: 'a', label: 'Merge it to keep goodwill' }, { id: 'b', label: 'Reject it with a link to the rules' }, { id: 'c', label: 'Pair on reshaping it to fit the enum, explain why the API matters, and credit them when it ships' }, { id: 'd', label: 'Have the core team rebuild it quietly' }], correct: 'c', explanation: 'Reviews teach the system’s rules. A quiet rebuild teaches people not to contribute.' },
    { id: 'l4', prompt: 'Squads say contributing takes too long. The template is four pages. What’s the best first move?', hint: 'Compare it with going around.', options: [{ id: 'a', label: 'Make contribution mandatory' }, { id: 'b', label: 'Cut the template to what the review actually needs (the problem, which squads, screenshots) and publish a response time' }, { id: 'c', label: 'Add a fifth page explaining why' }, { id: 'd', label: 'Stop taking contributions' }], correct: 'b', explanation: 'If the path costs more than a local copy, people take the local copy.' },
    { id: 'l5', prompt: 'Who should have the final say on whether a contribution ships in the core library?', hint: 'Who is accountable when it breaks?', options: [{ id: 'a', label: 'The squad that built it' }, { id: 'b', label: 'A vote of all 38 designers' }, { id: 'c', label: 'The core team, against published criteria, with an escalation route to the design leadership group' }, { id: 'd', label: 'Whoever is most senior in the room' }], correct: 'c', explanation: 'Decision rights should be written down and sit with the people who maintain it.' },
  ],
};

export const ds4_2: Episode = {
  lessonId: 'ds.4-2',
  hook: 'A squad’s dependency bot merged Rasta’s 3.5.0 on a Tuesday, and 14 screens in the Business portal broke. It was meant to be a minor. Watch a prop retired the way it should have been.',
  scene: {
    id: 'deprecation-path', duration: 36,
    beats: [
      { at: 0, title: 'A minor that broke', body: '3.5.0 renamed Button’s `type` to `variant` and deleted `type`. The bot trusted the version number and merged it. Fourteen screens failed to build.' },
      { at: 6, title: 'Three numbers, three promises', body: 'Patch: it now does what the docs said. Minor: something new, nothing old changed. Major: you have to act, or your screens change.' },
      { at: 11, title: 'Deprecate, don’t delete', body: 'Ship `variant` in a minor. `type` keeps working, warns in the console and gets a badge in the docs naming the replacement.' },
      { at: 16, title: 'A codemod does the moving', body: 'Arjun writes a script that rewrites `type=` to `variant=`. It opens pull requests for the four squads with the most uses.' },
      { at: 21, title: 'Count down the uses', body: 'A weekly code scan tracks what’s left: 212 uses, then 64, then 0, across two minor releases.' },
      { at: 26, title: 'Remove it in the major', body: 'Breaking changes wait for 4.0.0, planned for June and announced in March, with one migration guide for all of them.' },
      { at: 31, title: 'A changelog people read', body: 'Grouped by what squads must do: breaking first, with the fix, then added and deprecated, then fixed.' },
    ],
  },
  check: [
    { id: 'c1', prompt: 'Why did the dependency bot merge a breaking change?', options: [{ id: 'a', label: 'The bot was misconfigured' }, { id: 'b', label: 'The version said minor, and minors promise nothing existing changes' }, { id: 'c', label: 'Nobody read Slack' }],
      correct: 'b', explanation: 'The version number is the contract machines read.' },
    { id: 'c2', prompt: 'When is it safe to remove a deprecated prop?', options: [{ id: 'a', label: 'When the date passes' }, { id: 'b', label: 'In a major, after the window, when the scan shows no uses left' }, { id: 'c', label: 'Any time, with a warning' }],
      correct: 'b', explanation: 'Uses at zero, not a calendar, make removal safe.' },
  ],
  game: {
    id: 'release-plan', title: 'Plan the release',
    instructions: 'Rasta’s system is on 3.4.2. Each card is a change waiting to ship. Call it patch, minor or major. Safe changes go out in this week’s release; breaking ones wait for the planned major. The changelog writes itself as you go.',
    lanes: [
      { id: 'patch', label: 'Patch', hint: 'Now does what the docs promised' },
      { id: 'minor', label: 'Minor', hint: 'Something new; nothing old changes' },
      { id: 'major', label: 'Major', hint: 'Squads must act, or screens change' },
    ],
    cards: [
      { id: 'g1', label: change('renameType'), lane: bump('renameType'), visual: 'renameType', note: 'Old code still works, it just warns. That’s a deprecation, and a deprecation is a minor.' },
      { id: 'g2', label: change('focusRing'), lane: bump('focusRing'), visual: 'focusRing', note: 'The docs promise a visible focus ring. This makes it true again: a patch.' },
      { id: 'g3', label: change('defaultSize'), lane: bump('defaultSize'), visual: 'defaultSize', note: 'No code breaks, but 2,000 buttons shrink without anyone asking. Changing what squads ship is major.' },
      { id: 'g4', label: change('datePicker'), lane: bump('datePicker'), visual: 'datePicker', note: 'A new component changes nothing that exists: a minor.' },
      { id: 'g5', label: change('removeType'), lane: bump('removeType'), visual: 'removeType', note: 'Removal breaks whoever hasn’t moved, even after the warning. It waits for 4.0.0, once the scan reads zero.' },
      { id: 'g6', label: change('textContrast'), lane: bump('textContrast'), visual: 'textContrast', note: 'A visible change, but one that makes the token keep its documented promise. Patch, with a line in the changelog.' },
      { id: 'g7', label: change('react17'), lane: bump('react17'), visual: 'react17', note: 'Squads still on React 17 can’t install it. Dropping a supported platform is major.' },
      { id: 'g8', label: change('trailingIcon'), lane: bump('trailingIcon'), visual: 'trailingIcon', note: 'Optional, so every existing Input is untouched: a minor.' },
      { id: 'g9', label: change('iconLabel'), lane: bump('iconLabel'), visual: 'iconLabel', note: 'Right for accessibility, and it fails every build that lacks a label. Major, with a codemod that flags each one.' },
      { id: 'g10', label: change('tooltipTouch'), lane: bump('tooltipTouch'), visual: 'tooltipTouch', note: 'The docs already say it shouldn’t open on scroll. Making that true is a patch.' },
      { id: 'g11', label: change('chipToTag'), lane: bump('chipToTag'), visual: 'chipToTag', note: 'Chip still works, with a warning and a codemod to Tag. Deprecating is minor; removing will be major.' },
    ],
  },
  gap: {
    id: 'gap', from: 6, at: 10.6,
    prompt: '`type` needs to become `variant`. What does Kavya ship this week?',
    options: [{ id: 'a', label: 'A minor that adds `variant` and keeps `type` working, with a warning, a docs badge and a codemod' }, { id: 'b', label: 'A major that renames it straight away' }, { id: 'c', label: 'Nothing until the next major' }],
    correct: 'a', explanation: 'Add the replacement now, and remove the old prop later, once nobody uses it.',
  },
  takeaways: [
    { title: 'The number is the contract', body: 'Patch fixes what the docs promised. Minor adds without changing. Major means squads must act, or their screens change.' },
    { title: 'Defaults are API', body: 'Changing a default size, colour or behaviour changes what squads ship. Treat it as breaking.' },
    { title: 'Deprecate, then remove', body: 'Replacement and warning in a minor, a codemod, a counted window, and removal only in a major.' },
    { title: 'Batch the breaks', body: 'Plan majors once or twice a year, announce them early, and write one migration guide.' },
  ],
  quiz: {
    seconds: 15,
    questions: [
      { id: 'q1', prompt: 'Adding an optional prop is a…', options: [{ id: 'a', label: 'Patch' }, { id: 'b', label: 'Minor' }, { id: 'c', label: 'Major' }], correct: 'b', explanation: 'New, and nothing old changes.' },
      { id: 'q2', prompt: 'Changing a component’s default size is a…', options: [{ id: 'a', label: 'Patch' }, { id: 'b', label: 'Minor' }, { id: 'c', label: 'Major' }], correct: 'c', explanation: 'Screens change without anyone asking.' },
      { id: 'q3', prompt: 'After 3.9.4, a minor release is…', options: [{ id: 'a', label: '3.10.0' }, { id: 'b', label: '4.0.0' }, { id: 'c', label: '3.9.5' }], correct: 'a', explanation: 'Minor goes up; patch resets.' },
      { id: 'q4', prompt: 'A deprecated prop should…', options: [{ id: 'a', label: 'Stop working' }, { id: 'b', label: 'Keep working and warn' }, { id: 'c', label: 'Vanish from the docs' }], correct: 'b', explanation: 'Warn, name the replacement, then remove in a major.' },
    ],
  },
  ladder: [
    { id: 'l1', prompt: 'A fix makes `color-text-secondary` pass 4.5:1, and the text gets visibly darker. Patch or major?', hint: 'What did the docs promise?', options: [{ id: 'a', label: 'Major: it’s a visible change' }, { id: 'b', label: 'Patch: it restores the contrast the docs already promise, and the changelog says so' }, { id: 'c', label: 'Minor: it adds contrast' }, { id: 'd', label: 'It shouldn’t ship' }], correct: 'b', explanation: 'A patch can be visible. The test is whether it changes the contract or keeps it.' },
    { id: 'l2', prompt: 'Why batch breaking changes into planned majors instead of shipping each when it’s ready?', hint: 'Think about a squad’s sprint.', options: [{ id: 'a', label: 'Majors are cheaper to build' }, { id: 'b', label: 'Squads can plan one migration with one guide, instead of an unplanned one every few weeks' }, { id: 'c', label: 'Version numbers stay smaller' }, { id: 'd', label: 'It hides the changes' }], correct: 'b', explanation: 'Frequent majors teach squads to pin old versions, and pinned squads stop getting fixes.' },
    { id: 'l3', prompt: 'The Growth squad pinned Rasta at 2.8 a year ago and won’t upgrade. What does that tell Kavya?', hint: 'What does upgrading cost them?', options: [{ id: 'a', label: 'Growth doesn’t care about quality' }, { id: 'b', label: 'Upgrading costs more than staying, so make it cheaper: codemods, a migration pull request, and a pairing day' }, { id: 'c', label: 'Remove 2.8 from the registry' }, { id: 'd', label: 'Nothing; it’s their choice' }], correct: 'b', explanation: 'Version lag is a cost signal. The system team can lower it.' },
    { id: 'l4', prompt: 'How long should a deprecation window be?', hint: 'Who needs time to move?', options: [{ id: 'a', label: 'A day' }, { id: 'b', label: 'Long enough for squads to plan it, at least two minors or a quarter, and over only when the scan shows no uses' }, { id: 'c', label: 'Forever' }, { id: 'd', label: 'Until the next designer joins' }], correct: 'b', explanation: 'A window is a minimum, and the usage count is the real gate.' },
    { id: 'l5', prompt: 'Rasta’s Figma library and React package release separately, and they have drifted. What policy helps most?', hint: 'What should a version mean in both places?', options: [{ id: 'a', label: 'Only version the code' }, { id: 'b', label: 'Release both together under one version and one changelog, so 4.0 means the same thing to designers and engineers' }, { id: 'c', label: 'Let designers update Figma whenever they like' }, { id: 'd', label: 'Freeze Figma' }], correct: 'b', explanation: 'One version for both sides makes “which Button are you on?” answerable.' },
  ],
};

export const ds4_3: Episode = {
  lessonId: 'ds.4-3',
  hook: 'Kavya’s slide says “92% adoption”. The VP loves it. Then the Payments squad ships a screen with last year’s broken focus ring. Watch the number taken apart.',
  scene: {
    id: 'adoption-signals', duration: 36,
    beats: [
      { at: 0, title: '“92% adoption”', body: 'Eleven of Rasta’s twelve repositories install @rasta/ui. That was the number on the slide. It says nothing about what riders see.' },
      { at: 6, title: 'Count what’s on screen', body: 'A code scan counts every component instance: 5,500 across nine squads. System, the squad’s own, or detached from the system.' },
      { at: 11, title: 'Coverage, then lag', body: '68% of instances are live system components, but only 50% are on v3. Payments is at 89% coverage, and most of it is on v2.' },
      { at: 16, title: 'Detaching is a message', body: 'Rasta for Business detaches 37% of its system instances. Every detached Card adds a table row the Card can’t hold.' },
      { at: 21, title: 'Goodhart’s trap', body: 'Make coverage an OKR and a squad wraps its own components in a system Box. The number jumps. Nothing else does.' },
      { at: 26, title: 'Measure what it buys', body: 'Screens built from the system: 3 days from design to ship instead of 8, 70% fewer accessibility defects, one QA round instead of three.' },
      { at: 31, title: 'One action per squad', body: 'Payments: a migration pairing day. Business: a Card slot. Metro and Rail: office hours. The report names an owner for each.' },
    ],
  },
  check: [
    { id: 'c1', prompt: 'Why was “11 of 12 repositories” a poor adoption number?', options: [{ id: 'a', label: 'It was out of date' }, { id: 'b', label: 'Installing the package says nothing about how much of the UI is built from it' }, { id: 'c', label: 'Twelve is too few' }],
      correct: 'b', explanation: 'Count instances where they’re used.' },
    { id: 'c2', prompt: 'Payments has the highest coverage. What’s wrong?', options: [{ id: 'a', label: 'Nothing' }, { id: 'b', label: 'Most of it is on the old major, so it misses this year’s fixes' }, { id: 'c', label: 'Too many components' }],
      correct: 'b', explanation: 'Coverage without version lag hides a stale squad.' },
  ],
  game: {
    id: 'adoption-read', title: 'Read the scan',
    instructions: 'Each card is one squad’s scan, drawn as 100 squares. Estimate what share are live system components, then read the full scan and diagnose the squad: healthy, stale, detaching or bypassing.',
    lanes: [
      { id: 'healthy', label: 'Healthy', hint: 'Mostly system, current, not fought' },
      { id: 'stale', label: 'Stale', hint: 'System, but stuck on the old major' },
      { id: 'detaching', label: 'Detaching', hint: 'Uses it, keeps breaking away' },
      { id: 'bypassing', label: 'Bypassing', hint: 'Mostly its own components' },
    ],
    cards: [
      { id: 'g1', label: scan('bus'), lane: read('bus'), visual: 'bus', note: 'Mostly system, on the current version, rarely detached. Ask Bus passes what made the v3 rebuild work, and tell the other squads.' },
      { id: 'g2', label: scan('payments'), lane: read('payments'), visual: 'payments', note: '89% coverage, and four-fifths of it on v2. A migration pairing day and a codemod will do more here than any target.' },
      { id: 'g3', label: scan('business'), lane: read('business'), visual: 'business', note: 'They use the system and then detach it: 37% of what they took. The detached Cards all add a table row. That’s a missing slot.' },
      { id: 'g4', label: scan('metro'), lane: read('metro'), visual: 'metro', note: 'Most of Metro’s components are its own. Find out why: it couldn’t find them, they didn’t fit the gate flow, or nobody told Metro.' },
      { id: 'g5', label: scan('support'), lane: read('support'), visual: 'support', note: 'High coverage, current, barely detached. Healthy. Their help-centre patterns might be the next contribution.' },
      { id: 'g6', label: scan('rail'), lane: read('rail'), visual: 'rail', note: 'A squad that launched in six weeks built what it needed. Not a crime: offer an onboarding session and migration help now it has time.' },
      { id: 'g7', label: scan('onboarding'), lane: read('onboarding'), visual: 'onboarding', note: 'Over a quarter of what they took from the system is detached, mostly the KYC form fields. Ask what the Input can’t do.' },
      { id: 'g8', label: scan('growth'), lane: read('growth'), visual: 'growth', note: 'Pinned on v2 for festival campaigns. The upgrade costs them more than staying, so lower the cost: a migration pull request.' },
      { id: 'g9', label: scan('fleet'), lane: read('fleet'), visual: 'fleet', note: 'A web tool for depot staff, 80% system, current. Healthy, with a small tail of local tables waiting for the new data table.' },
    ],
  },
  gap: {
    id: 'gap', from: 16, at: 20.6,
    prompt: 'The VP wants 90% coverage in every squad by June, as an OKR. What does Kavya propose?',
    options: [{ id: 'a', label: 'Accept it' }, { id: 'b', label: 'Goals on outcomes (design-to-ship time, accessibility defects, QA rounds), with coverage, lag and detach rate as diagnostics' }, { id: 'c', label: 'A goal for the number of components' }],
    correct: 'b', explanation: 'A target on coverage gets met by wrapping. Targets belong on what the system is for.',
  },
  takeaways: [
    { title: 'Count instances, not installs', body: 'Scan code and Figma files for system, local and detached instances, per squad.' },
    { title: 'Coverage needs company', body: 'Add version lag and detach rate. High coverage on an old major is a stale squad.' },
    { title: 'Detaches are requests', body: 'What a squad keeps overriding is what the system is missing.' },
    { title: 'Target outcomes', body: 'Design-to-ship time, defects and QA rounds. Coverage is a diagnostic, never the goal.' },
  ],
  quiz: {
    seconds: 15,
    questions: [
      { id: 'q1', prompt: 'High coverage, mostly on the old major. Diagnosis?', options: [{ id: 'a', label: 'Healthy' }, { id: 'b', label: 'Stale' }, { id: 'c', label: 'Bypassing' }], correct: 'b', explanation: 'It misses this year’s fixes.' },
      { id: 'q2', prompt: 'A third of a squad’s Cards are detached. That’s…', options: [{ id: 'a', label: 'A missing variant or slot' }, { id: 'b', label: 'Bad discipline' }, { id: 'c', label: 'Fine' }], correct: 'a', explanation: 'Look at what the copies change.' },
      { id: 'q3', prompt: 'Coverage as an OKR invites…', options: [{ id: 'a', label: 'Wrapping to move the number' }, { id: 'b', label: 'Better quality' }, { id: 'c', label: 'Nothing' }], correct: 'a', explanation: 'Goodhart’s law.' },
      { id: 'q4', prompt: 'Which shows what the system buys?', options: [{ id: 'a', label: 'Docs page views' }, { id: 'b', label: 'Design-to-ship time' }, { id: 'c', label: 'Number of components' }], correct: 'b', explanation: 'An outcome, compared with screens built without it.' },
    ],
  },
  ladder: [
    { id: 'l1', prompt: 'Why don’t detached instances count as adoption?', hint: 'What happens at the next release?', options: [{ id: 'a', label: 'They look different' }, { id: 'b', label: 'They look like the system today but no longer get its fixes, so they drift with every release' }, { id: 'c', label: 'Figma counts them twice' }, { id: 'd', label: 'They’re slower' }], correct: 'b', explanation: 'A detached instance is a local component in disguise.' },
    { id: 'l2', prompt: 'Screens built from the system have 70% fewer accessibility defects. What makes that claim hold up?', hint: 'Compared with what?', options: [{ id: 'a', label: 'Saying it confidently' }, { id: 'b', label: 'Comparing like with like: similar screens built with and without the system, over the same releases, with how defects were counted' }, { id: 'c', label: 'Counting only the system’s screens' }, { id: 'd', label: 'A survey of designers' }], correct: 'b', explanation: 'Squads that adopt early may simply be better squads. Compare similar work.' },
    { id: 'l3', prompt: 'Suburban rail built 75% of its components itself in a six-week launch. What should Kavya’s report say?', hint: 'Is the cause the same as Metro’s?', options: [{ id: 'a', label: 'Rail ignored the rules' }, { id: 'b', label: 'Bypassing, because the launch couldn’t wait; now offer onboarding and a migration plan, and ask what they couldn’t find' }, { id: 'c', label: 'Healthy, since it shipped' }, { id: 'd', label: 'Remove Rail from the scan' }], correct: 'b', explanation: 'The same diagnosis can have different causes. The action follows the cause.' },
    { id: 'l4', prompt: 'Coverage rose from 68% to 84% in a quarter, and design-to-ship time didn’t move. What should Kavya check first?', hint: 'How could coverage rise without anything changing?', options: [{ id: 'a', label: 'Nothing; celebrate' }, { id: 'b', label: 'Whether squads wrapped local components in system primitives to move the number' }, { id: 'c', label: 'Whether the scanner is slow' }, { id: 'd', label: 'The docs site’s traffic' }], correct: 'b', explanation: 'When a measure becomes a target, check how it was met before you believe it.' },
    { id: 'l5', prompt: 'What belongs in the quarterly adoption report to design leadership?', hint: 'What should they be able to decide from it?', options: [{ id: 'a', label: 'One coverage number' }, { id: 'b', label: 'Per squad: coverage, version lag, detach rate and a diagnosis, with the outcome numbers, and one next action with an owner each' }, { id: 'c', label: 'A list of every component' }, { id: 'd', label: 'Screenshots of the library' }], correct: 'b', explanation: 'A report is for decisions: where to spend the system team’s next quarter.' },
  ],
};
