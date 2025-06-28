# Zenith – AI Career Coach

**Empowering job seekers with intelligent, personalized career guidance.**

Zenith is an all-in-one platform designed to assist job seekers through AI-driven tools. It offers features like an AI-powered resume and cover letter builder, real-time industry insights, and personalized skill assessments. By leveraging modern web technologies and AI capabilities, Zenith aims to streamline the job application process and support continuous professional development.

---

## Features

- **Real-Time Industry Insights**: Stay updated with the latest trends and demands in your tech stack through scheduled data fetching.
- **Personalized Skill Assessments**: Take AI-curated tests that adapt to your expertise level, with performance tracking over time.
- **AI-Powered Resume & Cover Letter Builder**: Generate tailored resumes and cover letters based on user input and job descriptions.
- **User Authentication**: Secure sign-up and sign-in processes using Clerk.
- **Responsive UI**: A clean and intuitive interface built with Shadcn UI components.

---

## Tech Stack

- **Frontend**: Next.js, React.js, TypeScript
- **Backend**: Next.js Server Actions, Inngest for background jobs, Gemini API for AI functionalities
- **Authentication**: Clerk
- **Database**: PostgreSQL
- **ORM**: Prisma
- **UI Components**: Shadcn UI

---

## Installation

1. **Clone the repository**:

     ```bash
     git clone https://github.com/AnantKrSharma/Zenith.git
     cd zenith
     ```
2. **Install dependencies**:

     ```bash
     pnpm install
     ```
3. **Set up environment variables**:

     ```
     NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY = 
     CLERK_SECRET_KEY = 
     
     GENAI_API_KEY = 
     
     NEXT_PUBLIC_CLERK_SIGN_IN_URL = /sign-in
     NEXT_PUBLIC_CLERK_SIGN_UP_URL = /sign-up
     
     NEXT_PUBLIC_CLERK_SIGN_IN_FORCE_REDIRECT_URL = /onboarding
     NEXT_PUBLIC_CLERK_SIGN_UP_FORCE_REDIRECT_URL = /onboarding
     
     DATABASE_URL = 
     NODE_ENV = "development"
     ```
4. **Set up the database**:

      ```bash
      pnpx prisma migrate dev --name init
      pnpx prisma generate
      ```
5. **Start Inngest Dev Server**:

      ```bash
      pnpx inngest-cli dev
      ```
5. **Run in dev environment**:

      ```bash
      pnpm dev
      ```
