import Link from "next/link";
import { cn } from "@/lib/utils";

export function BrandMark({ className }: { className?: string }) {
  return (
    <span className={cn("brand-mark", className)} aria-hidden="true">
      <span />
      <span />
      <span />
    </span>
  );
}

export function Brand({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      aria-label="Zenith home"
      className={cn(
        "inline-flex items-center gap-2.5 text-xl font-semibold tracking-[-0.06em]",
        className,
      )}
    >
      <BrandMark />
      zenith<span className="mb-3 -ml-1 text-primary">.</span>
    </Link>
  );
}
