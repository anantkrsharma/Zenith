import { Inter } from 'next/font/google';
import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Header from "@/components/header";
import { ClerkProvider } from "@clerk/nextjs"; 
import {dark, neobrutalism} from '@clerk/themes';
import Link from 'next/link';
import { Toaster } from "@/components/ui/sonner";
import Footer from '@/components/footer';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Zenith - AI Career Coach",
  description: "",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  
  return (
    <ClerkProvider appearance={{
      baseTheme: dark,
    }}
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
    >  
      <html lang="en" suppressHydrationWarning>
        <body className= {`${inter.className}`} >

          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <Header />
            
            <Toaster richColors />
            
            <main className="min-h-screen">  
              {children}
            </main>
            
            <Footer />                      
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
