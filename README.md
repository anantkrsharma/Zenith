# Zenith — AI Career Coach

A personal career workspace with industry insights, a resume studio, tailored cover letters, and interview practice. Built with Next.js, Clerk, PostgreSQL, Prisma, Google Gemini, and Inngest.

## Run locally

Use Node.js 22.12 or newer and the pinned pnpm 10.34.5 package manager. `pnpm-lock.yaml` is the canonical lockfile.

```sh
corepack enable
pnpm install --frozen-lockfile
```

Copy `.env.example` to `.env` and fill in your Clerk keys, Google AI Studio API key, and PostgreSQL connection URL. Existing environment variable names are preserved. Installation generates the Prisma client; stop the development server before regenerating it on Windows if its engine file is locked.

For a local database, apply the existing migrations, then start the app:

```sh
pnpm exec prisma migrate dev
pnpm dev
```

Open [localhost:3000](http://localhost:3000). In a separate terminal, run the Inngest development server to exercise background jobs:

```sh
pnpm dlx inngest-cli@latest dev -u http://localhost:3000/api/inngest
```

Production deployments also need Inngest configured with `INNGEST_EVENT_KEY` and `INNGEST_SIGNING_KEY`. The industry refresh runs each Sunday at 00:00 UTC. Deploy existing database migrations with `pnpm exec prisma migrate deploy`; this refresh does not change the database schema.

## AI configuration

All AI features use the server-only helper in `lib/ai.ts` and the current Google Gen AI SDK. The default is `gemini-3.5-flash-lite`, listed with free-tier input and output on [Google's pricing page](https://ai.google.dev/gemini-api/docs/pricing#gemini-3.5-flash-lite), verified September 6, 2026. Set `GEMINI_MODEL` to override it. Provider quotas and availability still apply.

Industry insights and interview questions are validated before use. Industry figures are model-generated estimates, not a grounded live market feed. Relevant user profile details and prompts are sent to Google for generation.

## Interface

The graphite and chartreuse identity expresses professional progression through an interactive career atlas, connected industry signals, assessment checkpoints, and layered professional documents. The landing page tells a sequence of product stories; the workspace uses calmer forms, readable charts, and focused editing surfaces. Radix primitives provide keyboard-accessible controls and dialogs; Motion respects reduced-motion preferences.

[Construct](https://construct.computer) informed the level of interaction craft and spatial storytelling. Zenith's compositions and assets are original SVG and CSS, with a separate mobile atlas composition and no WebGL dependency. Landing illustrations are labeled as conceptual; product screens use existing application data. See [redesign notes](docs/frontend-redesign.md) for the route audit, visual system, and verification scope.

## Dependency and migration notes

- Updated to Next.js 16, React 19.2, Clerk 7, Google Gen AI 2, Motion 13, Recharts 3, and current compatible UI packages.
- Migrated Next's deprecated middleware filename to `proxy.ts`, Clerk's auth display/appearance APIs, Clerk route matching to resource-level checks, and Framer Motion imports to `motion/react`.
- Prisma remains on aligned 6.19.3 packages, Zod on 3.25, and TypeScript on 5.9 to preserve database configuration and validation contracts. Their newer breaking majors are intentionally deferred.
- A scoped pnpm override updates Prisma config's `deepmerge-ts` to 8.0.0 for [CVE-2026-40345](https://github.com/RebeccaStevens/deepmerge-ts/releases/tag/v8.0.0). Prisma client generation is verified with this override.
- ESLint 10 uses the official compatibility adapter for older rules shipped through Next's config. Some upstream plugins still advertise ESLint 9 peer ranges; lint runs with zero warnings. Transitive `glob` and `node-domexception` deprecation notices originate upstream.
- Removed redundant UI frameworks, duplicate animation/theme packages, unused components and testimonial fixtures, debug output, and the stale npm lockfile.

## Validation

```sh
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm audit --prod
```

Regression tests cover AI response validation, onboarding normalization, contact/date validation, resume Markdown rendering, and preserving manual edits when toggling preview. `pnpm format` applies consistent formatting.

Browser checks cover desktop/mobile landing and auth layouts, product tabs and FAQ, tool screens with synthetic data, assessment review, resume editing, and completion of PDF generation. A minimal live Gemini request verified the configured model. Authenticated database writes, full generated quizzes, and scheduled Inngest execution still require an end-to-end check with a signed-in test account; no production data was changed during verification.
