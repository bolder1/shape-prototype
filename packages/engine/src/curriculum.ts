// Single source of truth for the curriculum.
// The app, the DB seed (scripts/seed-sql.ts) and the personalization engine all read this file.
//
// Tiers:  bar  = Literacy (target level 2)   stem = Practitioner (level 3)   deep = Expert (level 4–5)
// Mechanics (lesson interaction types the Lesson Player supports):
//   drag    arrange / reorder elements        spot     find the flaw(s) in an artifact
//   pick    A/B choice + justify              tune     slider tuning (contrast, spacing, scale…)
//   sort    card sort / categorize            flow     build a flow / map from nodes
//   rewrite rewrite copy or a brief           estimate predict a number / metric
//   build   free canvas construction          critique write or score a critique against a rubric

export type Tier = 'bar' | 'stem' | 'deep';
export type Mechanic = 'drag' | 'spot' | 'pick' | 'tune' | 'sort' | 'flow' | 'rewrite' | 'estimate' | 'build' | 'critique';
export type DomainId = 'fd' | 'rs' | 'ia' | 'ui' | 'ds' | 'pr' | 'cw' | 'ax' | 'st' | 'gr' | 'br' | 'bz' | 'dc' | 'ld';
export interface Lesson { title: string; mechanic: Mechanic }
export interface Chapter { id: string; title: string; tier: Tier; lessons: Lesson[]; boss: string; prereqs: string[]; studio?: string }
export interface Domain { id: DomainId; name: string; tagline: string; adjacent: DomainId[]; chapters: Chapter[] }
export interface FlatChapter extends Chapter { domain: DomainId }

const L = (title: string, mechanic: Mechanic): Lesson => ({ title, mechanic });
const ch = (id: string, title: string, tier: Tier, lessons: Lesson[], boss: string, prereqs: string[] = [], studio?: string): Chapter =>
  ({ id, title, tier, lessons, boss, prereqs, studio });

export const domains: Domain[] = [
  {
    id: 'fd', name: 'Foundations', tagline: 'How designers think and see',
    adjacent: ['ui', 'rs', 'ia'],
    chapters: [
      ch('fd.1', 'What design actually is', 'bar', [
        L('Problem vs. solution space', 'sort'), L('Double Diamond in motion', 'flow'),
        L('Design thinking: myths & reality', 'pick'), L('The roles on a product team', 'drag'),
      ], 'Reframe a vague request ("make it pop") into a problem statement with a success metric.'),
      ch('fd.2', 'Seeing like a designer', 'bar', [
        L('Gestalt: proximity, similarity, closure', 'drag'), L('Visual hierarchy in 5 seconds', 'spot'),
        L('Laws of UX: Fitts, Hick, Jakob', 'pick'), L('Cognitive load & chunking', 'sort'),
      ], 'Annotate a real app screen with every principle it uses or breaks.', ['fd.1']),
      ch('fd.3', 'Critique & feedback', 'stem', [
        L('Separating taste from reasoning', 'critique'), L('The "I like / I wish / What if" frame', 'rewrite'),
        L('Receiving critique without defending', 'pick'),
      ], 'Run (and record) a 15-min critique of a peer\'s boss submission.', ['fd.2']),
      ch('fd.4', 'Design judgment at scale', 'deep', [
        L('Trade-off matrices', 'sort'), L('Principles that actually decide things', 'rewrite'),
        L('When to break the rules', 'critique'),
      ], 'Write 5 design principles for your Studio product and use them to settle 3 real decisions.', ['fd.3']),
    ],
  },
  {
    id: 'rs', name: 'UX Research', tagline: 'Know the human before you draw the box',
    adjacent: ['ia', 'st', 'cw'],
    chapters: [
      ch('rs.1', 'Research basics', 'bar', [
        L('Generative vs. evaluative', 'sort'), L('Qual vs. quant: when each lies', 'pick'),
        L('Writing a research question', 'rewrite'), L('Bias spotting in questions', 'spot'),
      ], 'Turn a stakeholder assumption into 3 testable research questions.', ['fd.1']),
      ch('rs.2', 'Interviews & observation', 'bar', [
        L('Interview script anatomy', 'drag'), L('Leading vs. open questions', 'spot'),
        L('Jobs-to-be-Done interviews', 'flow'), L('Contextual inquiry', 'pick'),
      ], 'Interview 3 real people about a habit; submit script + notes.', ['rs.1'], 'Discovery interviews for your product'),
      ch('rs.3', 'Synthesis', 'stem', [
        L('Affinity mapping', 'sort'), L('From observation to insight', 'rewrite'),
        L('Personas vs. JTBD vs. archetypes', 'pick'), L('Journey maps that drive decisions', 'flow'),
      ], 'Synthesize a provided 12-interview dataset into 4 insights + a journey map.', ['rs.2']),
      ch('rs.4', 'Usability testing', 'stem', [
        L('Task writing', 'rewrite'), L('Moderated vs. unmoderated', 'pick'),
        L('Severity rating', 'sort'), L('Heuristic evaluation (Nielsen 10)', 'spot'),
      ], 'Test a prototype with 5 users; deliver a severity-ranked findings report.', ['rs.3', 'pr.1'], 'Usability round 1'),
      ch('rs.5', 'Surveys & quant research', 'deep', [
        L('Survey design & sampling', 'spot'), L('Statistical significance, intuitively', 'estimate'),
        L('Analytics as research', 'flow'), L('Triangulation', 'sort'),
      ], 'Design, run and analyse a survey (n ≥ 30) that decides between two product directions.', ['rs.4']),
      ch('rs.6', 'ResearchOps & strategy', 'deep', [
        L('Research roadmaps', 'drag'), L('Repositories & atomic research', 'build'),
        L('Democratizing research safely', 'critique'),
      ], 'Write a 2-quarter research roadmap for a real or fictional company.', ['rs.5', 'st.2']),
    ],
  },
  {
    id: 'ia', name: 'IA & Interaction', tagline: 'Structure, flows and behaviour',
    adjacent: ['rs', 'ui', 'pr', 'cw'],
    chapters: [
      ch('ia.1', 'Information architecture', 'bar', [
        L('Mental models', 'pick'), L('Card sorting', 'sort'),
        L('Navigation patterns', 'drag'), L('Sitemaps', 'flow'),
      ], 'Restructure the navigation of a cluttered settings page.', ['fd.2']),
      ch('ia.2', 'User flows & task design', 'bar', [
        L('Happy path vs. edge cases', 'flow'), L('Reducing steps without losing clarity', 'spot'),
        L('States: empty, loading, error, success', 'sort'),
      ], 'Map the complete flow (with all states) for "reset password".', ['ia.1'], 'Core flows'),
      ch('ia.3', 'Wireframing', 'stem', [
        L('Fidelity: when to stay ugly', 'pick'), L('Layout grids for wireframes', 'drag'),
        L('Wireframing patterns library', 'build'),
      ], 'Wireframe 5 screens of a booking flow from a written brief.', ['ia.2'], 'Wireframes'),
      ch('ia.4', 'Interaction patterns', 'stem', [
        L('Forms that don\'t hurt', 'spot'), L('Feedback & affordance', 'pick'),
        L('Mobile vs. desktop interaction', 'sort'), L('Gestures & direct manipulation', 'build'),
      ], 'Redesign a 12-field signup form; justify every change.', ['ia.3']),
      ch('ia.5', 'Complex systems & service design', 'deep', [
        L('Service blueprints', 'flow'), L('Multi-role / B2B workflows', 'flow'),
        L('Designing for scale: 10 → 10,000 items', 'pick'),
      ], 'Blueprint a multi-actor service (e.g., food delivery) front & back stage.', ['ia.4', 'rs.3']),
    ],
  },
  {
    id: 'ui', name: 'Visual & UI Design', tagline: 'Make it clear, then make it beautiful',
    adjacent: ['ds', 'br', 'pr', 'ax'],
    chapters: [
      ch('ui.1', 'Layout & spacing', 'bar', [
        L('The 8-pt grid', 'tune'), L('Columns & responsive grids', 'drag'),
        L('Whitespace as structure', 'spot'), L('Alignment', 'drag'),
      ], 'Fix spacing and alignment on 3 broken cards using only a spacing scale.', ['fd.2']),
      ch('ui.2', 'Typography', 'bar', [
        L('Type anatomy', 'sort'), L('Type scales', 'tune'),
        L('Pairing fonts', 'pick'), L('Line length & leading', 'tune'),
      ], 'Set a full type scale for a reading app and apply it to 2 screens.', ['ui.1']),
      ch('ui.3', 'Colour', 'bar', [
        L('Colour models (HSL/OKLCH)', 'tune'), L('Building a palette', 'build'),
        L('Semantic colour', 'sort'), L('Contrast & dark mode', 'tune'),
      ], 'Build a light + dark palette that passes WCAG AA everywhere.', ['ui.1']),
      ch('ui.4', 'UI components & screens', 'stem', [
        L('Buttons, inputs, cards', 'build'), L('Iconography', 'spot'),
        L('Imagery & illustration use', 'pick'), L('Data display & tables', 'build'),
      ], 'Take your wireframes to high-fidelity UI.', ['ui.2', 'ui.3', 'ia.3'], 'High-fidelity UI'),
      ch('ui.5', 'Visual craft & polish', 'deep', [
        L('Optical vs. mathematical alignment', 'tune'), L('Depth, elevation & light', 'tune'),
        L('Detail pass checklist', 'spot'),
      ], 'Polish pass: before/after of 3 screens with a written list of every change.', ['ui.4']),
      ch('ui.6', 'Data visualization', 'deep', [
        L('Choosing the right chart', 'pick'), L('Colour in charts', 'tune'),
        L('Dashboards that answer questions', 'critique'),
      ], 'Design an analytics dashboard for a defined persona and decision.', ['ui.4', 'st.3']),
    ],
  },
  {
    id: 'ds', name: 'Design Systems', tagline: 'Design once, ship everywhere',
    adjacent: ['ui', 'dc', 'ax'],
    chapters: [
      ch('ds.1', 'Why systems', 'bar', [
        L('Atoms → pages (atomic design)', 'drag'), L('Tokens explained', 'sort'),
        L('Spotting inconsistency debt', 'spot'),
      ], 'Audit an app: inventory every button / colour variant you can find.', ['ui.4']),
      ch('ds.2', 'Tokens & foundations', 'stem', [
        L('Primitive → semantic → component tokens', 'flow'), L('Theming & modes', 'tune'),
        L('Naming conventions', 'rewrite'),
      ], 'Define a 3-tier token set for your Studio product with light/dark modes.', ['ds.1'], 'Design tokens'),
      ch('ds.3', 'Components & variants', 'stem', [
        L('Component API design', 'build'), L('Variants & properties', 'sort'),
        L('Documentation that gets read', 'rewrite'),
      ], 'Build 8 documented components (with states) in Figma.', ['ds.2'], 'Component library'),
      ch('ds.4', 'Governance & adoption', 'deep', [
        L('Contribution models', 'pick'), L('Versioning & deprecation', 'flow'),
        L('Measuring adoption', 'estimate'),
      ], 'Write a governance proposal for a 40-designer org.', ['ds.3', 'ld.1']),
      ch('ds.5', 'Multi-brand & cross-platform systems', 'deep', [
        L('Multi-brand theming', 'tune'), L('iOS / Android / Web parity', 'sort'),
        L('Design-code sync', 'flow'),
      ], 'Extend your system to a second brand without forking components.', ['ds.4', 'dc.2']),
    ],
  },
  {
    id: 'pr', name: 'Prototyping & Motion', tagline: 'Make it feel real',
    adjacent: ['ia', 'ui', 'dc'],
    chapters: [
      ch('pr.1', 'Prototyping', 'bar', [
        L('Paper → clickable', 'pick'), L('Prototype for a question, not a demo', 'rewrite'),
        L('Figma prototyping basics', 'build'),
      ], 'Build a clickable prototype that answers one specific question.', ['ia.2']),
      ch('pr.2', 'Motion principles', 'stem', [
        L('Easing curves', 'tune'), L('Duration & choreography', 'tune'),
        L('Motion with meaning', 'pick'), L('Reduced motion', 'spot'),
      ], 'Animate 3 transitions in your product and justify each.', ['pr.1', 'ui.4']),
      ch('pr.3', 'Micro-interactions', 'stem', [
        L('Trigger → rules → feedback → loops', 'flow'), L('Delight vs. distraction', 'critique'),
      ], 'Design a micro-interaction for a key moment (e.g., payment success).', ['pr.2'], 'Interaction polish'),
      ch('pr.4', 'Advanced prototyping', 'deep', [
        L('Variables & conditional logic', 'build'), L('Code prototypes (Framer / React)', 'build'),
        L('Prototyping AI & dynamic content', 'pick'),
      ], 'Build a data-driven prototype realistic enough for a usability test.', ['pr.3', 'dc.1']),
    ],
  },
  {
    id: 'cw', name: 'Content & UX Writing', tagline: 'Words are interface',
    adjacent: ['ia', 'br', 'rs'],
    chapters: [
      ch('cw.1', 'UX writing basics', 'bar', [
        L('Clear > clever', 'rewrite'), L('Buttons & CTAs', 'pick'),
        L('Error messages that help', 'rewrite'), L('Empty states', 'rewrite'),
      ], 'Rewrite every string in a broken onboarding flow.', ['fd.2']),
      ch('cw.2', 'Voice, tone & content design', 'stem', [
        L('Voice vs. tone', 'sort'), L('Content-first design', 'flow'),
        L('Localization-ready writing', 'spot'),
      ], 'Write a voice & tone guide and apply it to 10 product moments.', ['cw.1'], 'Product copy'),
      ch('cw.3', 'Content strategy', 'deep', [
        L('Content models', 'build'), L('Content governance', 'flow'),
        L('Writing for AI-generated UI', 'critique'),
      ], 'Design the content model for a help center.', ['cw.2', 'ia.4']),
    ],
  },
  {
    id: 'ax', name: 'Accessibility & Inclusion', tagline: 'Design for everyone, by default',
    adjacent: ['ui', 'ds', 'dc'],
    chapters: [
      ch('ax.1', 'Accessibility basics', 'bar', [
        L('Disability is a spectrum', 'sort'), L('WCAG POUR principles', 'drag'),
        L('Contrast & colour blindness', 'tune'), L('Target sizes & focus', 'spot'),
      ], 'Audit a landing page against a 15-point a11y checklist.', ['ui.3']),
      ch('ax.2', 'Accessible interaction', 'stem', [
        L('Keyboard flows', 'flow'), L('Screen reader semantics', 'sort'),
        L('Accessible forms & errors', 'spot'), L('Cognitive accessibility', 'pick'),
      ], 'Annotate your Studio screens for dev handoff (focus order, labels, roles).', ['ax.1', 'ia.4'], 'A11y annotations'),
      ch('ax.3', 'Inclusive design leadership', 'deep', [
        L('Testing with disabled users', 'flow'), L('Inclusive personas', 'critique'),
        L('Building an a11y program', 'drag'),
      ], 'Plan an accessibility maturity roadmap for a company.', ['ax.2', 'ld.1']),
    ],
  },
  {
    id: 'st', name: 'Product Strategy & Metrics', tagline: 'Design the right thing',
    adjacent: ['rs', 'gr', 'bz'],
    chapters: [
      ch('st.1', 'Product thinking', 'bar', [
        L('Problem → outcome → output', 'sort'), L('Opportunity solution trees', 'flow'),
        L('Prioritization (RICE, Kano)', 'estimate'),
      ], 'Prioritize 10 feature requests and defend the top 3.', ['fd.1']),
      ch('st.2', 'Vision & roadmaps', 'stem', [
        L('Product vision narratives', 'rewrite'), L('Now / Next / Later roadmaps', 'drag'),
        L('Competitive analysis', 'sort'),
      ], 'Write a 1-page vision + roadmap for your Studio product.', ['st.1', 'rs.3'], 'Product strategy'),
      ch('st.3', 'Metrics that matter', 'stem', [
        L('North star & input metrics', 'flow'), L('HEART framework', 'sort'),
        L('Funnels & cohorts', 'estimate'), L('Instrumenting a design', 'build'),
      ], 'Define a metric tree and tracking plan for one feature.', ['st.1']),
      ch('st.4', 'Design strategy', 'deep', [
        L('Design as competitive advantage', 'critique'), L('Bets & portfolio thinking', 'estimate'),
        L('Platform vs. product', 'pick'),
      ], 'Pitch a 12-month design strategy to a (simulated) exec team.', ['st.2', 'st.3', 'bz.2']),
    ],
  },
  {
    id: 'gr', name: 'Growth Design', tagline: 'Design that moves numbers',
    adjacent: ['st', 'br', 'cw'],
    chapters: [
      ch('gr.1', 'Growth basics', 'bar', [
        L('AARRR funnel', 'flow'), L('Activation & aha moments', 'pick'),
        L('Behavioural psychology (Fogg, hooks)', 'sort'), L('Dark patterns to avoid', 'spot'),
      ], 'Find the 3 biggest drop-off risks in a real onboarding flow.', ['st.1']),
      ch('gr.2', 'Onboarding & activation', 'stem', [
        L('Progressive onboarding', 'flow'), L('Empty states that activate', 'build'),
        L('Paywalls & upgrade moments', 'pick'),
      ], 'Redesign your Studio product\'s first-run experience.', ['gr.1', 'ia.2'], 'Onboarding'),
      ch('gr.3', 'Experimentation', 'stem', [
        L('Hypothesis writing', 'rewrite'), L('A/B test design & sample size', 'estimate'),
        L('Reading results without fooling yourself', 'pick'),
      ], 'Design an experiment backlog of 5 tests with hypotheses and sample sizes.', ['gr.1', 'st.3']),
      ch('gr.4', 'Retention & engagement loops', 'deep', [
        L('Habit loops', 'flow'), L('Notifications without spam', 'critique'),
        L('Gamification done right', 'pick'), L('Referral & viral loops', 'flow'),
      ], 'Design a retention loop with metrics; critique it for ethical risks.', ['gr.3']),
    ],
  },
  {
    id: 'br', name: 'Brand & Marketing Design', tagline: 'Make people remember',
    adjacent: ['ui', 'gr', 'cw', 'bz'],
    chapters: [
      ch('br.1', 'Brand foundations', 'bar', [
        L('Brand vs. logo vs. identity', 'sort'), L('Positioning & personality', 'pick'),
        L('Moodboards with intent', 'build'),
      ], 'Write a brand platform (purpose, positioning, personality) for your product.', ['fd.2'], 'Brand platform'),
      ch('br.2', 'Visual identity', 'stem', [
        L('Logo design process', 'build'), L('Brand typography & colour', 'pick'),
        L('Identity systems & guidelines', 'drag'),
      ], 'Design a logo + mini brand guide.', ['br.1', 'ui.2', 'ui.3'], 'Visual identity'),
      ch('br.3', 'Marketing & web design', 'stem', [
        L('Landing page anatomy', 'drag'), L('Conversion copy & CTAs', 'rewrite'),
        L('Social & campaign assets', 'build'), L('SEO basics for designers', 'spot'),
      ], 'Design and ship (no-code ok) a launch landing page for your product.', ['br.2', 'cw.1'], 'Launch page'),
      ch('br.4', 'Brand strategy & storytelling', 'deep', [
        L('Narrative arcs for products', 'flow'), L('Brand architecture', 'sort'),
        L('Measuring brand', 'estimate'),
      ], 'Create a launch campaign narrative across 3 channels.', ['br.3']),
    ],
  },
  {
    id: 'bz', name: 'Business, Sales & Stakeholders', tagline: 'Get your design shipped',
    adjacent: ['st', 'br', 'ld'],
    chapters: [
      ch('bz.1', 'How businesses make money', 'bar', [
        L('Business models', 'sort'), L('Unit economics for designers', 'estimate'),
        L('B2B vs. B2C buying journeys', 'flow'),
      ], 'Map the business model canvas for your Studio product.', ['fd.1']),
      ch('bz.2', 'Presenting & persuading', 'stem', [
        L('Storytelling your design', 'flow'), L('Handling objections', 'pick'),
        L('Exec summaries', 'rewrite'),
      ], 'Record a 5-min design pitch; get peer scores.', ['bz.1', 'fd.3']),
      ch('bz.3', 'Design for sales & customers', 'stem', [
        L('Sales decks & demo design', 'build'), L('Pricing pages', 'pick'),
        L('Working with customer success', 'flow'),
      ], 'Design a sales deck and pricing page for your product.', ['bz.2', 'br.3'], 'Sales kit'),
      ch('bz.4', 'Design ROI & business cases', 'deep', [
        L('Quantifying design impact', 'estimate'), L('Writing a business case', 'rewrite'),
        L('Freelance & agency business', 'sort'),
      ], 'Write a business case for a redesign, with projected ROI.', ['bz.3', 'st.3']),
    ],
  },
  {
    id: 'dc', name: 'Design Engineering & AI', tagline: 'Speak code, use AI, ship faster',
    adjacent: ['ds', 'pr', 'ax'],
    chapters: [
      ch('dc.1', 'Code literacy for designers', 'bar', [
        L('HTML structure & the DOM', 'drag'), L('CSS box model, flex & grid', 'tune'),
        L('How front-ends are built', 'flow'),
      ], 'Rebuild one of your Studio screens in HTML/CSS.', ['ui.1']),
      ch('dc.2', 'Handoff & collaboration', 'stem', [
        L('Specs devs actually use', 'spot'), L('Design QA', 'spot'),
        L('Tokens in code', 'flow'),
      ], 'Hand off a feature with specs; run a QA pass on the built version.', ['dc.1', 'ds.2'], 'Dev handoff'),
      ch('dc.3', 'Designing with & for AI', 'stem', [
        L('AI in the design workflow', 'pick'), L('Designing AI features: trust, errors, control', 'critique'),
        L('Prompting as a design material', 'rewrite'),
      ], 'Design an AI feature with explicit handling of uncertainty and failure.', ['dc.1', 'ia.4']),
      ch('dc.4', 'Design engineering', 'deep', [
        L('Component code with React', 'build'), L('Animation in code', 'tune'),
        L('Building with AI coding agents', 'build'),
      ], 'Ship a working, deployed front-end of your Studio product.', ['dc.2', 'dc.3', 'pr.3'], 'Ship it live'),
    ],
  },
  {
    id: 'ld', name: 'Leadership & Design Ops', tagline: 'Grow people, not just pixels',
    adjacent: ['bz', 'ds', 'st'],
    chapters: [
      ch('ld.1', 'Working in a team', 'stem', [
        L('Design process in agile teams', 'flow'), L('Facilitating workshops', 'drag'),
        L('Design sprints', 'flow'),
      ], 'Plan and facilitate a 90-min workshop (agenda + outputs).', ['fd.3']),
      ch('ld.2', 'Career & portfolio', 'bar', [
        L('Case study structure', 'drag'), L('Portfolio critique', 'critique'),
        L('Interviews & whiteboard challenges', 'pick'),
      ], 'Turn your Studio product into a portfolio case study.', ['fd.1'], 'Case study'),
      ch('ld.3', 'Design leadership', 'deep', [
        L('Hiring & leveling', 'sort'), L('Managing designers', 'pick'),
        L('Design culture & rituals', 'critique'),
      ], 'Write a team charter + career ladder for a 6-person design team.', ['ld.1', 'bz.2']),
      ch('ld.4', 'DesignOps', 'deep', [
        L('Tooling & workflows', 'flow'), L('Measuring design team health', 'estimate'),
        L('Scaling design across an org', 'drag'),
      ], 'Propose an ops plan that removes one bottleneck from a real team.', ['ld.3']),
    ],
  },
];

/** Flat lookup helpers */
export const chapters: FlatChapter[] = domains.flatMap(d => d.chapters.map(c => ({ ...c, domain: d.id })));
export const chapterById: Record<string, FlatChapter> = Object.fromEntries(chapters.map(c => [c.id, c]));
export const domainById = Object.fromEntries(domains.map(d => [d.id, d])) as Record<DomainId, Domain>;
export const DOMAIN_IDS = domains.map(d => d.id);

/** Target level each tier unlocks once all chapters in that tier are mastered. */
export const TIER_LEVEL: Record<Tier, number> = { bar: 2, stem: 3, deep: 5 };
