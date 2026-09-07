# Zenith frontend redesign

This frontend pass preserves the existing application contracts and frames career development as a series of understandable next steps.

## Audited journeys

| Route                               | Existing behavior retained                                                                                      |
| ----------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| `/`                                 | Marketing, workspace links, FAQ, sign-in and sign-up entry points                                               |
| `/sign-in`, `/sign-up`              | Clerk components, providers, and redirect behavior                                                              |
| `/onboarding`                       | Industry, specialization, experience, skills, bio, validation, profile save, dashboard redirect                 |
| `/dashboard`                        | Existing industry insight fetching, outlook, growth, demand, skills, salary ranges, trends, refresh information |
| `/interview`                        | Actual assessment statistics, score history, and answer review                                                  |
| `/interview/mock`                   | Question generation, selections, explanations, navigation, submission, scoring, saved results, restart          |
| `/resume`                           | Structured fields, experience/projects/education, AI improvements, Markdown editing, preview, save, PDF export  |
| `/ai-cover-letter`, `/new`, `/[id]` | Existing list, generation from job context, saved document, PDF export, and delete confirmation                 |
| `/api/inngest`                      | Existing background job registration and weekly industry refresh                                                |

The repository has no separate profile or settings routes. Cover letters have no persisted editing action. Neither was invented for this redesign. Assessment data contains overall scores, answers, explanations, and an improvement tip; the interface does not manufacture per-skill scores, a readiness metric, or future performance projections. Industry figures remain explicitly described as model-generated estimates.

## Visual system

- **Career atlas:** three elevated planes connect a starting point, practice, and professional presentation. The desktop scene uses original SVG, bounded pointer parallax, and a small scroll response. Mobile has three simpler staggered layers with the same stage controls.
- **Industry signals:** ordered information and connected skill groups explain the landscape around a career. Salary charts retain exact values in an accessible disclosure table.
- **Assessment checkpoints:** real attempts form the historical trajectory. Answer markers, correct/revisit filters, explanations, and percentage-point comparisons make feedback actionable.
- **Professional documents:** layered paper explains the product on the landing page. The resume studio pairs structured inputs with a live document; the cover-letter composer connects profile context, role, and company.
- **Professional identity:** onboarding builds a visible map directly from the fields being entered.

Shared CSS tokens define graphite surfaces, chartreuse emphasis, muted text, borders, and typography. Oversized editorial headings belong to marketing; working screens use restrained hierarchy. Common navigation, buttons, form controls, dialogs, and states keep the system consistent.

## Performance and accessibility

The redesign adds no packages. Its spatial assets are SVG and CSS, with no WebGL renderer, remote illustration payload, or continuous animation loop. Reveals run once in view. Reduced motion disables parallax and large transforms; charts render without entrance animation. Mobile disables the atlas transform and replaces its dense SVG composition.

Stage and filter controls expose pressed state, questions use labeled radio groups and progress semantics, and result explanations use native disclosures. Resume preview reuses the existing sanitized Markdown renderer and existing export pipeline. Responsive layouts were inspected at 390, 768, and 1440 pixels; the document illustration is clipped at the section boundary to prevent horizontal overflow.

## Verification scope

Browser checks used a temporary development-only screen rendering the real components with labeled synthetic fixtures. That screen and all its fixtures were removed after verification.

Checked interactions include atlas stages, illustrative practice comparison, FAQ, dashboard focus links and salary table, history dialogs, answer filters and explanations, live resume composition, manual Markdown edits surviving tab changes, PDF generation, onboarding field feedback, cover-letter validation, delete confirmation cancellation, and empty states. A signed-out visit to `/dashboard` redirects to Clerk sign-in with its destination preserved; Clerk sign-up also renders correctly.

Regression tests cover AI response schemas, onboarding/contact/date validation, resume Markdown output, and preserving manual resume edits. Authenticated generation, database persistence, and scheduled Inngest execution still need an end-to-end pass with a signed-in test account. No production data was changed during this frontend verification.

The preexisting working tree contained backend and dependency changes. A start-of-pass SHA-256 baseline was used to verify that this redesign did not change `actions/`, `lib/`, `prisma/`, `proxy.ts`, `package.json`, or `pnpm-lock.yaml`.
