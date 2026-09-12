"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowUpRight,
  Compass,
  FileText,
  Mail,
  MessageSquare,
  ScanLine,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { workspaceNavigation as navigation } from "@/components/workspace-navigation";

const toolIcons = [ScanLine, FileText, MessageSquare, Mail];

export function WorkspaceShell({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  if (path.startsWith("/onboarding"))
    return <div className="onboarding-shell">{children}</div>;
  return (
    <div className="workspace-shell">
      <aside className="workspace-sidebar">
        <div className="zen-workspace-identity">
          <Compass size={23} strokeWidth={1.25} />
          <div>
            Make your next move.<span>YOUR CAREER WORKSPACE</span>
          </div>
        </div>
        <nav aria-label="Workspace navigation">
          {navigation.map(({ href, label }, index) => {
            const Icon = toolIcons[index];
            return (
              <Link
                key={href}
                href={href}
                aria-current={path.startsWith(href) ? "page" : undefined}
                className={cn(
                  "workspace-link",
                  path.startsWith(href) && "active",
                )}
              >
                <Icon size={17} strokeWidth={1.4} aria-hidden="true" />
                <span>{label}</span>
                <span className="zen-tool-number" aria-hidden="true">
                  0{index + 1}
                </span>
              </Link>
            );
          })}
        </nav>
        <div className="sidebar-note">
          <span className="zen-sidebar-caption">
            A LITTLE CLARITY GOES A LONG WAY.
          </span>
          <Link href="/#faq">
            Workspace guide <ArrowUpRight size={14} />
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
        </div>
        <div className="workspace-page">{children}</div>
      </div>
    </div>
  );
}
