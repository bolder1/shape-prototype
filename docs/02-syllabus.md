# Master Syllabus

> Generated from `curriculum/curriculum.mjs`. Do not edit by hand; run `node scripts/build-syllabus.mjs`.

**14 domains · 60 chapters · 200 lessons · 60 boss assignments · 19 Studio layers**

Tiers: **Literacy** (bar, level 2) → **Practitioner** (stem, level 3) → **Expert** (deep, level 4–5).
Nobody takes everything in order. The personalization engine picks a path through this graph from each learner's T-shape.

## Domain overview

| Domain | Tagline | Literacy | Practitioner | Expert | Neighbours |
|---|---|---|---|---|---|
| **Foundations** `fd` | How designers think and see | 2 | 1 | 1 | ui, rs, ia |
| **UX Research** `rs` | Know the human before you draw the box | 2 | 2 | 2 | ia, st, cw |
| **IA & Interaction** `ia` | Structure, flows and behaviour | 2 | 2 | 1 | rs, ui, pr, cw |
| **Visual & UI Design** `ui` | Make it clear, then make it beautiful | 3 | 1 | 2 | ds, br, pr, ax |
| **Design Systems** `ds` | Design once, ship everywhere | 1 | 2 | 2 | ui, dc, ax |
| **Prototyping & Motion** `pr` | Make it feel real | 1 | 2 | 1 | ia, ui, dc |
| **Content & UX Writing** `cw` | Words are interface | 1 | 1 | 1 | ia, br, rs |
| **Accessibility & Inclusion** `ax` | Design for everyone, by default | 1 | 1 | 1 | ui, ds, dc |
| **Product Strategy & Metrics** `st` | Design the right thing | 1 | 2 | 1 | rs, gr, bz |
| **Growth Design** `gr` | Design that moves numbers | 1 | 2 | 1 | st, br, cw |
| **Brand & Marketing Design** `br` | Make people remember | 1 | 2 | 1 | ui, gr, cw, bz |
| **Business, Sales & Stakeholders** `bz` | Get your design shipped | 1 | 2 | 1 | st, br, ld |
| **Design Engineering & AI** `dc` | Speak code, use AI, ship faster | 1 | 2 | 1 | ds, pr, ax |
| **Leadership & Design Ops** `ld` | Grow people, not just pixels | 1 | 1 | 2 | bz, ds, st |

---

## Foundations — _How designers think and see_

### `fd.1` What design actually is  ·  Literacy
1. Problem vs. solution space — *sort*
2. Double Diamond in motion — *flow*
3. Design thinking: myths & reality — *pick*
4. The roles on a product team — *drag*

**Boss:** Reframe a vague request ("make it pop") into a problem statement with a success metric.

### `fd.2` Seeing like a designer  ·  Literacy
_Requires:_ `fd.1` What design actually is

1. Gestalt: proximity, similarity, closure — *drag*
2. Visual hierarchy in 5 seconds — *spot*
3. Laws of UX: Fitts, Hick, Jakob — *pick*
4. Cognitive load & chunking — *sort*

**Boss:** Annotate a real app screen with every principle it uses or breaks.

### `fd.3` Critique & feedback  ·  Practitioner
_Requires:_ `fd.2` Seeing like a designer

1. Separating taste from reasoning — *critique*
2. The "I like / I wish / What if" frame — *rewrite*
3. Receiving critique without defending — *pick*

**Boss:** Run (and record) a 15-min critique of a peer's boss submission.

### `fd.4` Design judgment at scale  ·  Expert
_Requires:_ `fd.3` Critique & feedback

1. Trade-off matrices — *sort*
2. Principles that actually decide things — *rewrite*
3. When to break the rules — *critique*

**Boss:** Write 5 design principles for your Studio product and use them to settle 3 real decisions.

---

## UX Research — _Know the human before you draw the box_

### `rs.1` Research basics  ·  Literacy
_Requires:_ `fd.1` What design actually is

1. Generative vs. evaluative — *sort*
2. Qual vs. quant: when each lies — *pick*
3. Writing a research question — *rewrite*
4. Bias spotting in questions — *spot*

**Boss:** Turn a stakeholder assumption into 3 testable research questions.

### `rs.2` Interviews & observation  ·  Literacy
_Requires:_ `rs.1` Research basics

1. Interview script anatomy — *drag*
2. Leading vs. open questions — *spot*
3. Jobs-to-be-Done interviews — *flow*
4. Contextual inquiry — *pick*

**Boss:** Interview 3 real people about a habit; submit script + notes.

**Studio layer:** Discovery interviews for your product

### `rs.3` Synthesis  ·  Practitioner
_Requires:_ `rs.2` Interviews & observation

1. Affinity mapping — *sort*
2. From observation to insight — *rewrite*
3. Personas vs. JTBD vs. archetypes — *pick*
4. Journey maps that drive decisions — *flow*

**Boss:** Synthesize a provided 12-interview dataset into 4 insights + a journey map.

### `rs.4` Usability testing  ·  Practitioner
_Requires:_ `rs.3` Synthesis, `pr.1` Prototyping

1. Task writing — *rewrite*
2. Moderated vs. unmoderated — *pick*
3. Severity rating — *sort*
4. Heuristic evaluation (Nielsen 10) — *spot*

**Boss:** Test a prototype with 5 users; deliver a severity-ranked findings report.

**Studio layer:** Usability round 1

### `rs.5` Surveys & quant research  ·  Expert
_Requires:_ `rs.4` Usability testing

1. Survey design & sampling — *spot*
2. Statistical significance, intuitively — *estimate*
3. Analytics as research — *flow*
4. Triangulation — *sort*

**Boss:** Design, run and analyse a survey (n ≥ 30) that decides between two product directions.

### `rs.6` ResearchOps & strategy  ·  Expert
_Requires:_ `rs.5` Surveys & quant research, `st.2` Vision & roadmaps

1. Research roadmaps — *drag*
2. Repositories & atomic research — *build*
3. Democratizing research safely — *critique*

**Boss:** Write a 2-quarter research roadmap for a real or fictional company.

---

## IA & Interaction — _Structure, flows and behaviour_

### `ia.1` Information architecture  ·  Literacy
_Requires:_ `fd.2` Seeing like a designer

1. Mental models — *pick*
2. Card sorting — *sort*
3. Navigation patterns — *drag*
4. Sitemaps — *flow*

**Boss:** Restructure the navigation of a cluttered settings page.

### `ia.2` User flows & task design  ·  Literacy
_Requires:_ `ia.1` Information architecture

1. Happy path vs. edge cases — *flow*
2. Reducing steps without losing clarity — *spot*
3. States: empty, loading, error, success — *sort*

**Boss:** Map the complete flow (with all states) for "reset password".

**Studio layer:** Core flows

### `ia.3` Wireframing  ·  Practitioner
_Requires:_ `ia.2` User flows & task design

1. Fidelity: when to stay ugly — *pick*
2. Layout grids for wireframes — *drag*
3. Wireframing patterns library — *build*

**Boss:** Wireframe 5 screens of a booking flow from a written brief.

**Studio layer:** Wireframes

### `ia.4` Interaction patterns  ·  Practitioner
_Requires:_ `ia.3` Wireframing

1. Forms that don't hurt — *spot*
2. Feedback & affordance — *pick*
3. Mobile vs. desktop interaction — *sort*
4. Gestures & direct manipulation — *build*

**Boss:** Redesign a 12-field signup form; justify every change.

### `ia.5` Complex systems & service design  ·  Expert
_Requires:_ `ia.4` Interaction patterns, `rs.3` Synthesis

1. Service blueprints — *flow*
2. Multi-role / B2B workflows — *flow*
3. Designing for scale: 10 → 10,000 items — *pick*

**Boss:** Blueprint a multi-actor service (e.g., food delivery) front & back stage.

---

## Visual & UI Design — _Make it clear, then make it beautiful_

### `ui.1` Layout & spacing  ·  Literacy
_Requires:_ `fd.2` Seeing like a designer

1. The 8-pt grid — *tune*
2. Columns & responsive grids — *drag*
3. Whitespace as structure — *spot*
4. Alignment — *drag*

**Boss:** Fix spacing and alignment on 3 broken cards using only a spacing scale.

### `ui.2` Typography  ·  Literacy
_Requires:_ `ui.1` Layout & spacing

1. Type anatomy — *sort*
2. Type scales — *tune*
3. Pairing fonts — *pick*
4. Line length & leading — *tune*

**Boss:** Set a full type scale for a reading app and apply it to 2 screens.

### `ui.3` Colour  ·  Literacy
_Requires:_ `ui.1` Layout & spacing

1. Colour models (HSL/OKLCH) — *tune*
2. Building a palette — *build*
3. Semantic colour — *sort*
4. Contrast & dark mode — *tune*

**Boss:** Build a light + dark palette that passes WCAG AA everywhere.

### `ui.4` UI components & screens  ·  Practitioner
_Requires:_ `ui.2` Typography, `ui.3` Colour, `ia.3` Wireframing

1. Buttons, inputs, cards — *build*
2. Iconography — *spot*
3. Imagery & illustration use — *pick*
4. Data display & tables — *build*

**Boss:** Take your wireframes to high-fidelity UI.

**Studio layer:** High-fidelity UI

### `ui.5` Visual craft & polish  ·  Expert
_Requires:_ `ui.4` UI components & screens

1. Optical vs. mathematical alignment — *tune*
2. Depth, elevation & light — *tune*
3. Detail pass checklist — *spot*

**Boss:** Polish pass: before/after of 3 screens with a written list of every change.

### `ui.6` Data visualization  ·  Expert
_Requires:_ `ui.4` UI components & screens, `st.3` Metrics that matter

1. Choosing the right chart — *pick*
2. Colour in charts — *tune*
3. Dashboards that answer questions — *critique*

**Boss:** Design an analytics dashboard for a defined persona and decision.

---

## Design Systems — _Design once, ship everywhere_

### `ds.1` Why systems  ·  Literacy
_Requires:_ `ui.4` UI components & screens

1. Atoms → pages (atomic design) — *drag*
2. Tokens explained — *sort*
3. Spotting inconsistency debt — *spot*

**Boss:** Audit an app: inventory every button / colour variant you can find.

### `ds.2` Tokens & foundations  ·  Practitioner
_Requires:_ `ds.1` Why systems

1. Primitive → semantic → component tokens — *flow*
2. Theming & modes — *tune*
3. Naming conventions — *rewrite*

**Boss:** Define a 3-tier token set for your Studio product with light/dark modes.

**Studio layer:** Design tokens

### `ds.3` Components & variants  ·  Practitioner
_Requires:_ `ds.2` Tokens & foundations

1. Component API design — *build*
2. Variants & properties — *sort*
3. Documentation that gets read — *rewrite*

**Boss:** Build 8 documented components (with states) in Figma.

**Studio layer:** Component library

### `ds.4` Governance & adoption  ·  Expert
_Requires:_ `ds.3` Components & variants, `ld.1` Working in a team

1. Contribution models — *pick*
2. Versioning & deprecation — *flow*
3. Measuring adoption — *estimate*

**Boss:** Write a governance proposal for a 40-designer org.

### `ds.5` Multi-brand & cross-platform systems  ·  Expert
_Requires:_ `ds.4` Governance & adoption, `dc.2` Handoff & collaboration

1. Multi-brand theming — *tune*
2. iOS / Android / Web parity — *sort*
3. Design-code sync — *flow*

**Boss:** Extend your system to a second brand without forking components.

---

## Prototyping & Motion — _Make it feel real_

### `pr.1` Prototyping  ·  Literacy
_Requires:_ `ia.2` User flows & task design

1. Paper → clickable — *pick*
2. Prototype for a question, not a demo — *rewrite*
3. Figma prototyping basics — *build*

**Boss:** Build a clickable prototype that answers one specific question.

### `pr.2` Motion principles  ·  Practitioner
_Requires:_ `pr.1` Prototyping, `ui.4` UI components & screens

1. Easing curves — *tune*
2. Duration & choreography — *tune*
3. Motion with meaning — *pick*
4. Reduced motion — *spot*

**Boss:** Animate 3 transitions in your product and justify each.

### `pr.3` Micro-interactions  ·  Practitioner
_Requires:_ `pr.2` Motion principles

1. Trigger → rules → feedback → loops — *flow*
2. Delight vs. distraction — *critique*

**Boss:** Design a micro-interaction for a key moment (e.g., payment success).

**Studio layer:** Interaction polish

### `pr.4` Advanced prototyping  ·  Expert
_Requires:_ `pr.3` Micro-interactions, `dc.1` Code literacy for designers

1. Variables & conditional logic — *build*
2. Code prototypes (Framer / React) — *build*
3. Prototyping AI & dynamic content — *pick*

**Boss:** Build a data-driven prototype realistic enough for a usability test.

---

## Content & UX Writing — _Words are interface_

### `cw.1` UX writing basics  ·  Literacy
_Requires:_ `fd.2` Seeing like a designer

1. Clear > clever — *rewrite*
2. Buttons & CTAs — *pick*
3. Error messages that help — *rewrite*
4. Empty states — *rewrite*

**Boss:** Rewrite every string in a broken onboarding flow.

### `cw.2` Voice, tone & content design  ·  Practitioner
_Requires:_ `cw.1` UX writing basics

1. Voice vs. tone — *sort*
2. Content-first design — *flow*
3. Localization-ready writing — *spot*

**Boss:** Write a voice & tone guide and apply it to 10 product moments.

**Studio layer:** Product copy

### `cw.3` Content strategy  ·  Expert
_Requires:_ `cw.2` Voice, tone & content design, `ia.4` Interaction patterns

1. Content models — *build*
2. Content governance — *flow*
3. Writing for AI-generated UI — *critique*

**Boss:** Design the content model for a help center.

---

## Accessibility & Inclusion — _Design for everyone, by default_

### `ax.1` Accessibility basics  ·  Literacy
_Requires:_ `ui.3` Colour

1. Disability is a spectrum — *sort*
2. WCAG POUR principles — *drag*
3. Contrast & colour blindness — *tune*
4. Target sizes & focus — *spot*

**Boss:** Audit a landing page against a 15-point a11y checklist.

### `ax.2` Accessible interaction  ·  Practitioner
_Requires:_ `ax.1` Accessibility basics, `ia.4` Interaction patterns

1. Keyboard flows — *flow*
2. Screen reader semantics — *sort*
3. Accessible forms & errors — *spot*
4. Cognitive accessibility — *pick*

**Boss:** Annotate your Studio screens for dev handoff (focus order, labels, roles).

**Studio layer:** A11y annotations

### `ax.3` Inclusive design leadership  ·  Expert
_Requires:_ `ax.2` Accessible interaction, `ld.1` Working in a team

1. Testing with disabled users — *flow*
2. Inclusive personas — *critique*
3. Building an a11y program — *drag*

**Boss:** Plan an accessibility maturity roadmap for a company.

---

## Product Strategy & Metrics — _Design the right thing_

### `st.1` Product thinking  ·  Literacy
_Requires:_ `fd.1` What design actually is

1. Problem → outcome → output — *sort*
2. Opportunity solution trees — *flow*
3. Prioritization (RICE, Kano) — *estimate*

**Boss:** Prioritize 10 feature requests and defend the top 3.

### `st.2` Vision & roadmaps  ·  Practitioner
_Requires:_ `st.1` Product thinking, `rs.3` Synthesis

1. Product vision narratives — *rewrite*
2. Now / Next / Later roadmaps — *drag*
3. Competitive analysis — *sort*

**Boss:** Write a 1-page vision + roadmap for your Studio product.

**Studio layer:** Product strategy

### `st.3` Metrics that matter  ·  Practitioner
_Requires:_ `st.1` Product thinking

1. North star & input metrics — *flow*
2. HEART framework — *sort*
3. Funnels & cohorts — *estimate*
4. Instrumenting a design — *build*

**Boss:** Define a metric tree and tracking plan for one feature.

### `st.4` Design strategy  ·  Expert
_Requires:_ `st.2` Vision & roadmaps, `st.3` Metrics that matter, `bz.2` Presenting & persuading

1. Design as competitive advantage — *critique*
2. Bets & portfolio thinking — *estimate*
3. Platform vs. product — *pick*

**Boss:** Pitch a 12-month design strategy to a (simulated) exec team.

---

## Growth Design — _Design that moves numbers_

### `gr.1` Growth basics  ·  Literacy
_Requires:_ `st.1` Product thinking

1. AARRR funnel — *flow*
2. Activation & aha moments — *pick*
3. Behavioural psychology (Fogg, hooks) — *sort*
4. Dark patterns to avoid — *spot*

**Boss:** Find the 3 biggest drop-off risks in a real onboarding flow.

### `gr.2` Onboarding & activation  ·  Practitioner
_Requires:_ `gr.1` Growth basics, `ia.2` User flows & task design

1. Progressive onboarding — *flow*
2. Empty states that activate — *build*
3. Paywalls & upgrade moments — *pick*

**Boss:** Redesign your Studio product's first-run experience.

**Studio layer:** Onboarding

### `gr.3` Experimentation  ·  Practitioner
_Requires:_ `gr.1` Growth basics, `st.3` Metrics that matter

1. Hypothesis writing — *rewrite*
2. A/B test design & sample size — *estimate*
3. Reading results without fooling yourself — *pick*

**Boss:** Design an experiment backlog of 5 tests with hypotheses and sample sizes.

### `gr.4` Retention & engagement loops  ·  Expert
_Requires:_ `gr.3` Experimentation

1. Habit loops — *flow*
2. Notifications without spam — *critique*
3. Gamification done right — *pick*
4. Referral & viral loops — *flow*

**Boss:** Design a retention loop with metrics; critique it for ethical risks.

---

## Brand & Marketing Design — _Make people remember_

### `br.1` Brand foundations  ·  Literacy
_Requires:_ `fd.2` Seeing like a designer

1. Brand vs. logo vs. identity — *sort*
2. Positioning & personality — *pick*
3. Moodboards with intent — *build*

**Boss:** Write a brand platform (purpose, positioning, personality) for your product.

**Studio layer:** Brand platform

### `br.2` Visual identity  ·  Practitioner
_Requires:_ `br.1` Brand foundations, `ui.2` Typography, `ui.3` Colour

1. Logo design process — *build*
2. Brand typography & colour — *pick*
3. Identity systems & guidelines — *drag*

**Boss:** Design a logo + mini brand guide.

**Studio layer:** Visual identity

### `br.3` Marketing & web design  ·  Practitioner
_Requires:_ `br.2` Visual identity, `cw.1` UX writing basics

1. Landing page anatomy — *drag*
2. Conversion copy & CTAs — *rewrite*
3. Social & campaign assets — *build*
4. SEO basics for designers — *spot*

**Boss:** Design and ship (no-code ok) a launch landing page for your product.

**Studio layer:** Launch page

### `br.4` Brand strategy & storytelling  ·  Expert
_Requires:_ `br.3` Marketing & web design

1. Narrative arcs for products — *flow*
2. Brand architecture — *sort*
3. Measuring brand — *estimate*

**Boss:** Create a launch campaign narrative across 3 channels.

---

## Business, Sales & Stakeholders — _Get your design shipped_

### `bz.1` How businesses make money  ·  Literacy
_Requires:_ `fd.1` What design actually is

1. Business models — *sort*
2. Unit economics for designers — *estimate*
3. B2B vs. B2C buying journeys — *flow*

**Boss:** Map the business model canvas for your Studio product.

### `bz.2` Presenting & persuading  ·  Practitioner
_Requires:_ `bz.1` How businesses make money, `fd.3` Critique & feedback

1. Storytelling your design — *flow*
2. Handling objections — *pick*
3. Exec summaries — *rewrite*

**Boss:** Record a 5-min design pitch; get peer scores.

### `bz.3` Design for sales & customers  ·  Practitioner
_Requires:_ `bz.2` Presenting & persuading, `br.3` Marketing & web design

1. Sales decks & demo design — *build*
2. Pricing pages — *pick*
3. Working with customer success — *flow*

**Boss:** Design a sales deck and pricing page for your product.

**Studio layer:** Sales kit

### `bz.4` Design ROI & business cases  ·  Expert
_Requires:_ `bz.3` Design for sales & customers, `st.3` Metrics that matter

1. Quantifying design impact — *estimate*
2. Writing a business case — *rewrite*
3. Freelance & agency business — *sort*

**Boss:** Write a business case for a redesign, with projected ROI.

---

## Design Engineering & AI — _Speak code, use AI, ship faster_

### `dc.1` Code literacy for designers  ·  Literacy
_Requires:_ `ui.1` Layout & spacing

1. HTML structure & the DOM — *drag*
2. CSS box model, flex & grid — *tune*
3. How front-ends are built — *flow*

**Boss:** Rebuild one of your Studio screens in HTML/CSS.

### `dc.2` Handoff & collaboration  ·  Practitioner
_Requires:_ `dc.1` Code literacy for designers, `ds.2` Tokens & foundations

1. Specs devs actually use — *spot*
2. Design QA — *spot*
3. Tokens in code — *flow*

**Boss:** Hand off a feature with specs; run a QA pass on the built version.

**Studio layer:** Dev handoff

### `dc.3` Designing with & for AI  ·  Practitioner
_Requires:_ `dc.1` Code literacy for designers, `ia.4` Interaction patterns

1. AI in the design workflow — *pick*
2. Designing AI features: trust, errors, control — *critique*
3. Prompting as a design material — *rewrite*

**Boss:** Design an AI feature with explicit handling of uncertainty and failure.

### `dc.4` Design engineering  ·  Expert
_Requires:_ `dc.2` Handoff & collaboration, `dc.3` Designing with & for AI, `pr.3` Micro-interactions

1. Component code with React — *build*
2. Animation in code — *tune*
3. Building with AI coding agents — *build*

**Boss:** Ship a working, deployed front-end of your Studio product.

**Studio layer:** Ship it live

---

## Leadership & Design Ops — _Grow people, not just pixels_

### `ld.1` Working in a team  ·  Practitioner
_Requires:_ `fd.3` Critique & feedback

1. Design process in agile teams — *flow*
2. Facilitating workshops — *drag*
3. Design sprints — *flow*

**Boss:** Plan and facilitate a 90-min workshop (agenda + outputs).

### `ld.2` Career & portfolio  ·  Literacy
_Requires:_ `fd.1` What design actually is

1. Case study structure — *drag*
2. Portfolio critique — *critique*
3. Interviews & whiteboard challenges — *pick*

**Boss:** Turn your Studio product into a portfolio case study.

**Studio layer:** Case study

### `ld.3` Design leadership  ·  Expert
_Requires:_ `ld.1` Working in a team, `bz.2` Presenting & persuading

1. Hiring & leveling — *sort*
2. Managing designers — *pick*
3. Design culture & rituals — *critique*

**Boss:** Write a team charter + career ladder for a 6-person design team.

### `ld.4` DesignOps  ·  Expert
_Requires:_ `ld.3` Design leadership

1. Tooling & workflows — *flow*
2. Measuring design team health — *estimate*
3. Scaling design across an org — *drag*

**Boss:** Propose an ops plan that removes one bottleneck from a real team.

---

## Studio: the product you build across the curriculum

Each Studio layer adds to the same real product and ends as a portfolio case study.

1. **Discovery interviews for your product** (`rs.2`)
2. **Usability round 1** (`rs.4`)
3. **Core flows** (`ia.2`)
4. **Wireframes** (`ia.3`)
5. **High-fidelity UI** (`ui.4`)
6. **Design tokens** (`ds.2`)
7. **Component library** (`ds.3`)
8. **Interaction polish** (`pr.3`)
9. **Product copy** (`cw.2`)
10. **A11y annotations** (`ax.2`)
11. **Product strategy** (`st.2`)
12. **Onboarding** (`gr.2`)
13. **Brand platform** (`br.1`)
14. **Visual identity** (`br.2`)
15. **Launch page** (`br.3`)
16. **Sales kit** (`bz.3`)
17. **Dev handoff** (`dc.2`)
18. **Ship it live** (`dc.4`)
19. **Case study** (`ld.2`)
