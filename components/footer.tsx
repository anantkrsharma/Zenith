"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Code2 } from "lucide-react";
import { Brand } from "@/components/brand";

export default function Footer() {
  const path = usePathname();
  if (path.startsWith("/sign-in") || path.startsWith("/sign-up")) return null;
  if (path !== "/")
    return (
      <footer className="workspace-footer">
        <span>© {new Date().getFullYear()} Zenith</span>
        <Link href="/#faq">A little clarity for your next chapter</Link>
      </footer>
    );
  return (
    <footer className="site-footer">
      <div className="site-container">
        <div className="footer-grid">
          <div>
            <Brand />
            <p className="mt-5 max-w-xs text-sm leading-7 text-muted-foreground">
              A little clarity. A lot of possibility.
              <br />
              Your personal AI career workspace.
            </p>
          </div>
          <div>
            <h3>THE WORKSPACE</h3>
            <Link href="/dashboard">Industry insights</Link>
            <Link href="/resume">Resume studio</Link>
            <Link href="/interview">Interview preparation</Link>
            <Link href="/ai-cover-letter">Cover letters</Link>
          </div>
          <div>
            <h3>EXPLORE</h3>
            <Link href="/#how-it-works">How it works</Link>
            <Link href="/#faq">Common questions</Link>
            <a
              href="https://github.com/anantkrsharma/Zenith"
              target="_blank"
              rel="noreferrer"
            >
              View the source <Code2 size={13} />
            </a>
            <a href="https://anantx.dev" target="_blank" rel="noreferrer">
              Made by Anant Kr Sharma
            </a>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Zenith. All rights reserved.</span>
          <span className="flex items-center gap-2">BUILT FOR WHAT’S NEXT</span>
        </div>
      </div>
    </footer>
  );
}
