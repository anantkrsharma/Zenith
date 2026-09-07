import { Show, SignInButton, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import {
  ArrowUpRight,
  ChevronDown,
  FileText,
  GraduationCap,
  LayoutDashboard,
  Menu,
  PenLine,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Brand } from "@/components/brand";
import { checkUser } from "@/lib/checkUser";

export default async function Header() {
  await checkUser();
  return (
    <header className="site-header">
      <nav
        className="site-container flex h-[76px] items-center justify-between gap-4"
        aria-label="Main navigation"
      >
        <Brand />
        <div className="hidden md:flex items-center gap-8 text-xs text-muted-foreground">
          <Link href="/#workspace">Your career, connected</Link>
          <Link href="/#how-it-works">How it works</Link>
          <Link href="/#faq">FAQ</Link>
        </div>
        <div className="flex items-center gap-3">
          <Show when="signed-in">
            <Button asChild variant="ghost" className="hidden lg:inline-flex">
              <Link href="/dashboard">
                <LayoutDashboard />
                Workspace
              </Link>
            </Button>
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
                {[
                  {
                    href: "/dashboard",
                    label: "Industry insights",
                    icon: LayoutDashboard,
                  },
                  { href: "/resume", label: "Resume studio", icon: FileText },
                  {
                    href: "/interview",
                    label: "Interview preparation",
                    icon: GraduationCap,
                  },
                  {
                    href: "/ai-cover-letter",
                    label: "Cover letters",
                    icon: PenLine,
                  },
                ].map(({ href, label, icon: Icon }) => (
                  <DropdownMenuItem key={href} asChild>
                    <Link href={href} className="gap-3 py-3">
                      <Icon size={16} />
                      {label}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <UserButton appearance={{ elements: { avatarBox: "w-8 h-8" } }} />
          </Show>
          <Show when="signed-out">
            <SignInButton>
              <Button variant="ghost" size="sm">
                Sign in
              </Button>
            </SignInButton>
            <Button asChild size="sm">
              <Link href="/sign-up">
                Get started <ArrowUpRight />
              </Link>
            </Button>
          </Show>
        </div>
      </nav>
    </header>
  );
}
