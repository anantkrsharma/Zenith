export const dynamic = "force-dynamic";

import { getInterviewAssessments } from "@/actions/interview";
import React, { Suspense } from "react";
import QuizStats from "./_components/quiz-stats";
import PerformanceChart from "./_components/performance-chart";
import QuizList from "./_components/quiz-list";
import { BarLoader } from "react-spinners";
import { PageHeading } from "@/components/page-heading";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const InterviewPage = async () => {
  await auth.protect();
  const assessments = await getInterviewAssessments();

  return (
    <div className="space-y-4">
      <PageHeading
        eyebrow="PREPARATION BUILDS CONFIDENCE"
        title="Be ready for your moment."
        description="Practice with purpose. Learn from every answer and track your progress along the way."
      >
        <Button asChild>
          <Link href="/interview/mock">Start a practice session</Link>
        </Button>
      </PageHeading>

      <Suspense
        fallback={<BarLoader className="mt-3" width={"100%"} color="gray" />}
      >
        <QuizStats assessments={assessments} />
        <PerformanceChart assessments={assessments} />
        <QuizList assessments={assessments} />
      </Suspense>
    </div>
  );
};

export default InterviewPage;
