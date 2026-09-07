export const dynamic = "force-dynamic";

import React from "react";
import { OnboardingForm } from "./_components/onboarding-form";
import { industries } from "@/data/industries";
import { getUserOnboardingStatus } from "@/actions/user";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";

const OnboardingPage = async () => {
  await auth.protect();
  // redirect to the dashboard if already onboarded
  const { isUser, isOnboarded } = await getUserOnboardingStatus();

  if (!isUser) {
    return null;
  }
  if (isOnboarded) {
    redirect("/dashboard");
  }

  return (
    <div>
      <OnboardingForm industries={industries} />
    </div>
  );
};

export default OnboardingPage;
