export const dynamic = "force-dynamic";

import { getIndustryInsights } from "@/actions/dashboard";
import React from "react";
import { DashboardView } from "./_components/dashboard-view";
import { PageHeading } from "@/components/page-heading";
import { auth } from "@clerk/nextjs/server";

const IndustryInsightsPage = async () => {
  await auth.protect();
  const industryInsights = await getIndustryInsights();

  return (
    <div className="container mx-auto">
      <PageHeading
        eyebrow="YOUR CAREER, WITH DIRECTION"
        title="A clearer view. A next step."
        description="Understand the landscape around your career, then decide where to put your energy."
      />
      <DashboardView insights={industryInsights} />
    </div>
  );
};

export default IndustryInsightsPage;
