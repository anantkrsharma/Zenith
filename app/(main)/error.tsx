"use client";

import Link from "next/link";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function WorkspaceError({
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  return (
    <div className="flex min-h-[450px] flex-col items-center justify-center rounded-xl border bg-card p-8 text-center">
      <h1 className="text-3xl tracking-tight">Let’s give that another try.</h1>
      <p className="mt-4 mb-7 max-w-md text-sm leading-7 text-muted-foreground">
        We couldn’t load this part of your workspace. Please try again in a
        moment.
      </p>
      <div className="flex gap-3">
        <Button onClick={retry}>
          <RefreshCw />
          Try again
        </Button>
        <Button asChild variant="outline">
          <Link href="/">Back to home</Link>
        </Button>
      </div>
    </div>
  );
}
