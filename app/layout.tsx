import { Inter } from 'next/font/google';
import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Header from "@/components/header";
import { ClerkProvider } from "@clerk/nextjs"; 
import {dark, neobrutalism} from '@clerk/themes';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Zenith - AI Career Coach",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
            
            <main className="min-h-screen pt-20">  
              {children}
            </main>
            
            {/* footer */}
            <footer className="bg-muted py-12">
              <div className="container mx-auto px-4 text-center text-gray-200">
                <p> Made with ❤️ by Anant Kr Sharma </p>
              </div>
            </footer>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
