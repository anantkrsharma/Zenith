"use client";

import { RedirectToSignIn, Show } from "@clerk/nextjs";

export function AuthenticatedWorkspace({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Show when="signed-in">{children}</Show>
      <Show when="signed-out">
        <RedirectToSignIn />
      </Show>
    </>
  );
}
