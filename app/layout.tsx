import "./globals.css";
import "./experience.css";
import { Inter } from "next/font/google";
import type { Metadata } from "next";
import { ThemeProvider } from "@/components/theme-provider";
import Header from "@/components/header";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/sonner";
import Footer from "@/components/footer";
import { Analytics } from "@vercel/analytics/next";
import { MotionProvider } from "@/components/motion-provider";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Zenith - AI Career Coach",
  description:
    "Your personal AI career workspace. Explore industry insights, build your resume, write tailored cover letters, and prepare for your next interview with Zenith.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ClerkProvider
      appearance={{
        theme: "clerk",
        variables: {
          colorPrimary: "#70b7c2",
          colorBackground: "#11181b",
          colorForeground: "#e7edef",
          borderRadius: "0.4rem",
        },
      }}
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
      afterSignOutUrl="/"
    >
      <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning>
        <body className={`${inter.className} ${inter.variable}`}>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            forcedTheme="dark"
          >
            <MotionProvider>
              <a
                href="#main-content"
                className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:rounded-lg focus:bg-primary focus:px-4 focus:py-3 focus:text-primary-foreground"
              >
                Skip to content
              </a>
              <Header />

              <Toaster richColors />
              <Analytics />

              <main id="main-content" className="min-h-screen">
                {children}
              </main>

              <Footer />
            </MotionProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
