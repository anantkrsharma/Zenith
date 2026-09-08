"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { workspaceNavigation as navigation } from "@/components/workspace-navigation";

export function WorkspaceShell({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  if (path.startsWith("/onboarding"))
    return <div className="onboarding-shell">{children}</div>;
  return (
    <div className="workspace-shell">
      <aside className="workspace-sidebar">
        <p className="eyebrow mb-6">YOUR CAREER WORKSPACE</p>
        <nav aria-label="Workspace navigation">
          {navigation.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              aria-current={path.startsWith(href) ? "page" : undefined}
              className={cn(
                "workspace-link",
                path.startsWith(href) && "active",
              )}
            >
              <span>{label}</span>
            </Link>
          ))}
        </nav>
        <div className="sidebar-note">
          <Link href="/#faq">Workspace guide</Link>
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
