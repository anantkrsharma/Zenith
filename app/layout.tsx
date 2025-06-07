import { Inter } from 'next/font/google';
import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Header from "@/components/header";
import { ClerkProvider } from "@clerk/nextjs"; 
import {dark, neobrutalism} from '@clerk/themes';
import Link from 'next/link';
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Zenith - AI Career Coach",
  description: "",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  
  return (
    <ClerkProvider appearance={{
      baseTheme: dark,
    }}>  
      <html lang="en" suppressHydrationWarning>
        <body className= {`${inter.className}`} >

          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
            >
            {/* header */}
            <Header />
            
            <Toaster richColors/>
            
            <main className="min-h-screen">  
              {children}
            </main>
            
            {/* footer */}
            <footer className="bg-zinc-900 text-white py-10 px-6 border-t border-zinc-900">
              <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
                <div>
                  <h2 className="text-2xl font-bold mb-4">Zenith</h2>
                  <p className="text-sm text-gray-400">
                    Empowering your career path with AI-driven insights and personalized coaching.
                  </p>
                </div>

                <div>
                  <h3 className="text-base font-semibold mb-3">Quick Links</h3>
                  <ul className="space-y-2 text-sm text-gray-300">
                    <li><Link href="/" className="hover:text-white">Home</Link></li>
                    <li><Link href="/dashboard" className="hover:text-white">Dashboard</Link></li>
                    <li><Link href="/" className="hover:text-white">Services</Link></li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-base font-semibold mb-3">Support</h3>
                  <ul className="space-y-2 text-sm text-gray-300">
                    <li><a href="#" className="hover:text-white">Help Center</a></li>
                    <li><a href="#" className="hover:text-white">Contact Us</a></li>
                    <li><a href="#" className="hover:text-white">Terms of Service</a></li>
                    <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-base font-semibold mb-3">Stay Connected</h3>
                  <form className="flex flex-col sm:flex-row md:flex-col gap-3">
                    <input
                      type="email"
                      placeholder="Your email"
                      className="px-4 py-2 rounded-lg text-gray-300 w-full border border-zinc-400"
                    />
                    <button className="bg-zinc-600 hover:bg-zinc-800 transition-all duration-200 hover:cursor-pointer rounded px-4 py-2 w-full">
                      Subscribe
                    </button>
                  </form>
                </div>
              </div>

              <div className="mt-10 border-t border-gray-700 pt-4 text-center text-xs text-gray-400">
                &copy; {new Date().getFullYear()} Zenith. All rights reserved.
              </div>
            </footer>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
