"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  AudioLines,
  ArrowUpRight,
  FileText,
  Globe2,
  PenLine,
  Route,
  BookOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  { href: "/dashboard", label: "Industry insights", icon: Globe2 },
  { href: "/resume", label: "Resume studio", icon: FileText },
  { href: "/interview", label: "Interview prep", icon: AudioLines },
  { href: "/ai-cover-letter", label: "Cover letters", icon: PenLine },
];

export function WorkspaceShell({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  if (path.startsWith("/onboarding"))
    return <div className="onboarding-shell">{children}</div>;
  return (
    <div className="workspace-shell">
      <aside className="workspace-sidebar">
        <p className="eyebrow mb-6">YOUR CAREER WORKSPACE</p>
        <nav aria-label="Workspace navigation">
          {navigation.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              aria-current={path.startsWith(href) ? "page" : undefined}
              className={cn(
                "workspace-link",
                path.startsWith(href) && "active",
              )}
            >
              <Icon size={17} />
              <span>{label}</span>
              {path.startsWith(href) && <span className="nav-active-dot" />}
            </Link>
          ))}
        </nav>
        <div className="sidebar-note">
          <Route size={20} />
          <p>
            A little progress.
            <br />
            Every single day.
          </p>
          <span>Your next chapter starts with the step you take today.</span>
          <Link href="/#faq">
            <BookOpen size={13} /> Workspace guide <ArrowUpRight size={13} />
          </Link>
        </div>
      </aside>
      <div className="workspace-main">
        <div className="workspace-breadcrumb">
          <span>Workspace</span>
          <span>/</span>
          <span>
            {navigation.find((item) => path.startsWith(item.href))?.label}
          </span>
          <span className="ml-auto hidden sm:flex items-center gap-2">
            <span className="status-dot" /> MAKE YOUR NEXT MOVE
          </span>
        </div>
        <div className="workspace-page">{children}</div>
      </div>
    </div>
  );
}
