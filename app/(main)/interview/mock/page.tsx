export const dynamic = "force-dynamic";

import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Quiz } from "../_components/quiz";
import { PageHeading } from "@/components/page-heading";
import { auth } from "@clerk/nextjs/server";

const MockInterviewPage = async () => {
  await auth.protect();
  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div className="flex flex-col gap-6">
        <Button asChild variant="outline" className="w-fit">
          <Link href="/interview">
            <ArrowLeft />
            Back to interview prep
          </Link>
        </Button>
        <PageHeading
          eyebrow="YOUR PRACTICE STUDIO"
          title="Confidence starts here."
          description="Take your time. Think it through. Learn something with every answer."
        />
      </div>

      <Quiz />
    </div>
  );
};

export default MockInterviewPage;
