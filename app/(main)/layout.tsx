export const dynamic = "force-dynamic";

import React from "react";
import RedirectToOnboarding from "./_components/redirect-to-onboarding";
import { getUserOnboardingStatus } from "@/actions/user";
import { WorkspaceShell } from "@/components/workspace-shell";
import { auth } from "@clerk/nextjs/server";
import { AuthenticatedWorkspace } from "@/components/authenticated-workspace";

const MainRoutesLayout = async ({
  children,
}: {
  children: React.ReactNode;
}) => {
  await auth.protect();
  const { isUser, isOnboarded } = await getUserOnboardingStatus();

  return (
    <AuthenticatedWorkspace>
      <WorkspaceShell>
        <RedirectToOnboarding isUser={isUser} isOnboarded={isOnboarded} />

        {children}
      </WorkspaceShell>
    </AuthenticatedWorkspace>
  );
};

export default MainRoutesLayout;
