import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFoundPage() {
  return (
    <div className="mx-auto flex min-h-[80vh] max-w-xl flex-col items-center justify-center gap-6 px-6 text-center">
      <span className="eyebrow">404 / A SMALL DETOUR</span>
      <h1 className="text-4xl font-medium tracking-tight md:text-5xl">
        Let’s get you
        <br />
        <span className="text-primary">back on track.</span>
      </h1>
      <p className="max-w-sm text-sm leading-7 text-muted-foreground">
        This page may have moved, or the link may be incomplete. Your next
        chapter is still waiting.
      </p>
      <Button asChild size="lg">
        <Link href="/">Back to Zenith</Link>
      </Button>
    </div>
  );
}
