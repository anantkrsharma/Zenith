export const dynamic = "force-dynamic";

import { getResume } from "@/actions/resume";
import React from "react";
import ResumeBuilder from "./_components/resume-builder";
import { auth } from "@clerk/nextjs/server";

const ResumePage = async () => {
  await auth.protect();
  const resume = await getResume();

  return (
    <div>
      <ResumeBuilder initialContent={resume?.content || ""} />
    </div>
  );
};

export default ResumePage;
