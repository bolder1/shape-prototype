# Design system: decisions and rules

> Locked on 2026-11-21. Live reference: `/dev/kit` (`npm run dev`).

## Foundation

| Layer | Choice | Notes |
|---|---|---|
| Components | **Untitled UI React** (free, MIT) | React Aria underneath (strong accessibility), Tailwind v4. Vendored into `apps/web/src/components/{base,application,foundations}`. Matching **free Untitled UI Figma kit** for design work. Pro ($129 one-time) is optional later. |
| Icons | **Phosphor** (`@phosphor-icons/react/ssr`) | The *only* icon library. Never draw custom icons. Enforced by ESLint (`no-restricted-imports`). |
| Type | **Inter** | Untitled UI's type scale (`text-display-*`, `text-md`…). Matches the Figma kit. |
| Motion | **Motion** + presets in `packages/ui/src/motion.ts` | Every animation uses `press`, `pop` or `gentle`. |

## Colour

| Role | Token | Use for | Never for |
|---|---|---|---|
| **Midnight** (brand) | `brand-50…950`, solid = `brand-600` `#222F4F` | Chrome, primary buttons, selection, focus | Progress |
| **Mint** | `mint-50…900`; bars `mint-600`, text `mint-700`, fills `mint-500` | Progress, streaks, XP, completed, goals | Buttons, chrome |
| **Gray** | Untitled semantic tokens (`text-primary/secondary/tertiary`, `bg-primary`, `ring-secondary`…) | Text, borders, surfaces | — |
| **Families** | `family-discover` `#3B6FF5` · `family-design` `#B97508` · `family-grow` `#8B5CF6` · `family-build` `#D9467A` | Grouping the 14 skills (dots, skill icons) | Status, buttons |
| **Status** | Untitled `success/warning/error` | System feedback, always with icon + label | Categories |

**Checks run:** brand-600 is 13.2:1 on white. mint-600 is 4.0:1 on white and 3.4:1 on the progress track (WCAG 1.4.11). mint-700 text is 5.2:1. The family set passes the colour-blind and contrast validator in its fixed order (blue next to violet failed, so they're never adjacent). Dark mode comes from Untitled's `.dark-mode` token remap.

## Icons

- Import from `@phosphor-icons/react/ssr` (works in server and client components).
- **Weights:** `regular` for UI chrome, `bold` for small arrows and checks in buttons, `duotone` for skill and role icons, `fill` for the selected state.
- Skill icons live in one place: `src/lib/skills.ts`.
- Vendored Untitled components import icons through `src/components/icons/untitled-compat.ts` (Phosphor re-exported under Untitled's names). New Untitled component → add any new names there. Never install `@untitledui/icons`.
- Passing an icon from a **server** page to a client component: pass an element (`iconTrailing={<ArrowRightIcon data-icon />}`), not the component.

## Inputs: pick the control by the question

Never default to one control (no slider-for-everything). Use this table:

| Question shape | Control | Component |
|---|---|---|
| Free answer, short | Text field | Untitled `Input` |
| One of a **long** list (≥ 8), may not be listed | Type to search + list, custom value allowed | `inputs/RoleField` (Untitled `ComboBox`) |
| One of a **short, known** list where typing adds nothing | Dropdown | Untitled `Select` |
| One of **2–5 ordered** short options | Segmented | `inputs/Segmented` |
| One of 2–6 options that need **explaining** | Cards with icon + description | `inputs/ChoiceCards` |
| **Several** from a medium list, with a cap | Chips | `inputs/ChipSelect` (Untitled `TagGroup`) |
| On/off setting | Toggle | Untitled `Toggle` |

### Onboarding questions → controls

| Question | Control |
|---|---|
| What should we call you? | Text (optional, Skip) |
| Who do you want to become? | Cards (10 roles with icon + one-line description, 2 columns) |
| What do you do today? | Type + list (custom allowed) |
| How long have you been doing it? | Dropdown |
| Which of these sound fun? (only for "not sure yet") | Chips, max 2 |
| 14 × "How much have you done this?" | Cards (Not yet / Aware / Practitioner / Expert) |
| Quick check (3 scenario questions) | Cards (A–D) with Confirm |
| Daily time | Segmented |
| Where to start | Cards (Follow my path / Start from zero) |
| Sound effects | Toggle |
