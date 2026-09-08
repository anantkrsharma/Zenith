# Zenith — AI Career Coach

Zenith is a focused career workspace for understanding an industry, practicing interviews, and preparing stronger applications. It brings market signals, assessments, resume editing, and AI-assisted cover letters into one calm, professional interface.

## Features

- **Industry insights** — Review market outlook, growth, hiring demand, in-demand skills, trends, and salary ranges for your field.
- **Interview practice** — Take timed assessments, review every answer, and see where targeted practice can improve your score.
- **Resume studio** — Build and edit a structured resume with profile, education, experience, projects, and skills sections.
- **AI cover letters** — Generate a tailored first draft from your experience and a job description, then edit it before exporting.
- **Guided onboarding** — Capture a career profile once and use it to personalize the workspace.
- **Background refreshes** — Industry insights can be refreshed on a schedule through Inngest.

## Technology

- Next.js App Router and React with TypeScript
- Clerk for authentication and onboarding redirects
- PostgreSQL with Prisma ORM
- Google Gemini through the Google Gen AI SDK
- Inngest for scheduled and background work
- Tailwind CSS, Radix UI primitives, and Recharts
- Motion for small, accessible interface transitions

## Getting started

### Requirements

- Node.js 22.12 or newer
- pnpm 10.34.5 (the version pinned by `package.json`)
- A PostgreSQL database
- A Clerk application
- A Google AI Studio API key

### Install

```sh
corepack enable
pnpm install --frozen-lockfile
cp .env.example .env
```

Fill in the values in `.env`:

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Public Clerk application key |
| `CLERK_SECRET_KEY` | Server-side Clerk key |
| `DATABASE_URL` | PostgreSQL connection string |
| `GENAI_API_KEY` | Google AI Studio API key |
| `GEMINI_MODEL` | Optional Gemini model override |
| `NEXT_PUBLIC_CLERK_SIGN_IN_URL` | Sign-in route, normally `/sign-in` |
| `NEXT_PUBLIC_CLERK_SIGN_UP_URL` | Sign-up route, normally `/sign-up` |
| `NEXT_PUBLIC_CLERK_SIGN_IN_FORCE_REDIRECT_URL` | Sign-in destination, normally `/onboarding` |
| `NEXT_PUBLIC_CLERK_SIGN_UP_FORCE_REDIRECT_URL` | Sign-up destination, normally `/onboarding` |

Create the Prisma client and apply the development database migrations:

```sh
pnpm exec prisma generate
pnpm exec prisma migrate dev
```

Start the application:

```sh
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000). To run scheduled or background Inngest functions locally, use a second terminal:

```sh
pnpm dlx inngest-cli@latest dev -u http://localhost:3000/api/inngest
```

## Available commands

| Command | Description |
| --- | --- |
| `pnpm dev` | Start the development server with Turbopack |
| `pnpm build` | Create a production build |
| `pnpm start` | Serve the production build |
| `pnpm lint` | Run ESLint with warnings treated as errors |
| `pnpm typecheck` | Run the TypeScript compiler without emitting files |
| `pnpm test` | Run the project test suite |
| `pnpm format` | Format the repository with Prettier |
| `pnpm exec prisma studio` | Browse local database records |

## Project structure

```text
app/                 Next.js routes, layouts, API handlers, and page components
components/          Shared navigation, shell, UI primitives, and visual components
lib/                 Authentication, AI, database, and application helpers
prisma/               Database schema and migrations
public/               Static assets
tests/                Automated tests
```

The main workspace routes are `/dashboard`, `/interview`, `/resume`, and `/ai-cover-letter`. Authentication lives at `/sign-in` and `/sign-up`; new users continue through `/onboarding` before entering the workspace.

## AI and data behavior

AI responses are validated before they are used by the application. Industry figures are generated estimates intended to help with exploration, rather than a live compensation or labor-market feed. Prompts and the profile details needed to generate a response are sent to Google Gemini. User records and generated application content are stored in the configured PostgreSQL database.

For production, use production Clerk credentials, run `pnpm exec prisma migrate deploy`, and configure the Inngest event and signing keys required by your deployment environment.

## License

No license file is currently included in this repository.
