"use client";

import { Show, SignInButton, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { ArrowUpRight, ChevronDown, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Brand } from "@/components/brand";
import { usePathname } from "next/navigation";
import { workspaceNavigation } from "@/components/workspace-navigation";

export default function HeaderNavigation() {
  const pathname = usePathname();
  const isLanding = pathname === "/";
  const hasWorkspaceNavigation = workspaceNavigation.some(
    ({ href }) => pathname === href || pathname.startsWith(`${href}/`),
  );
  return (
    <header className="site-header" data-landing={isLanding}>
      <nav
        className="site-container flex h-[76px] items-center justify-between gap-4"
        aria-label="Main navigation"
      >
        <Brand />
        {isLanding && (
          <div className="hidden md:flex items-center gap-8 text-xs text-muted-foreground">
            <Link href="/#workspace">The workspace</Link>
            <Link href="/#how-it-works">How it works</Link>
            <Link href="/#faq">FAQ</Link>
          </div>
        )}
        <div className="zen-header-actions flex items-center gap-3">
          {isLanding && (
            <div className="md:hidden">
              <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Explore Zenith navigation"
                  >
                    <Menu size={19} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-60 p-2">
                  {[
                    ["/#workspace", "The workspace"],
                    ["/#industry", "Industry insights"],
                    ["/#practice", "Interview preparation"],
                    ["/#documents", "Resume & cover letters"],
                    ["/#how-it-works", "How it works"],
                    ["/#faq", "Common questions"],
                  ].map(([href, label]) => (
                    <DropdownMenuItem key={href} asChild>
                      <Link href={href} className="py-3">
                        {label}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
          <Show when="signed-in">
            {!hasWorkspaceNavigation && (
              <Button asChild variant="ghost" className="hidden lg:inline-flex">
                <Link href="/dashboard">Workspace</Link>
              </Button>
            )}
            {!hasWorkspaceNavigation && (
              <div>
                <DropdownMenu modal={false}>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      aria-label="Open career tools"
                    >
                      <Menu className="md:hidden" />
                      <span className="hidden md:inline">Career tools</span>
                      <ChevronDown className="hidden md:block" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 p-2">
                    {workspaceNavigation.map(({ href, label }) => (
                      <DropdownMenuItem key={href} asChild>
                        <Link href={href} className="gap-3 py-3">
                          {label}
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
            <UserButton appearance={{ elements: { avatarBox: "w-8 h-8" } }} />
          </Show>
          <Show when="signed-out">
            <SignInButton>
              <Button variant="ghost" size="sm">
                Sign in
              </Button>
            </SignInButton>
            <Button asChild size="sm" className="zen-header-cta">
              <Link href="/sign-up">
                Get started <ArrowUpRight size={14} />
              </Link>
            </Button>
          </Show>
        </div>
      </nav>
    </header>
  );
}
