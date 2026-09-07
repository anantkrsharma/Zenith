export const dynamic = "force-dynamic";

import { PageHeading } from "@/components/page-heading";
import React, { Suspense } from "react";
import CoverLetterCards from "./_components/cover-letters";
import { BarLoader } from "react-spinners";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { getCoverLetters } from "@/actions/cover-letter";
import { auth } from "@clerk/nextjs/server";

const CoverLettersPage = async () => {
  await auth.protect();
  const coverLetters = await getCoverLetters();

  return (
    <div className="space-y-4 md:space-y-6">
      <PageHeading
        eyebrow="A STRONGER FIRST IMPRESSION"
        title="Open the right doors."
        description="Thoughtful introductions, tailored to your next opportunity."
      >
        <Link href={"/ai-cover-letter/new"}>
          <Button
            variant={"outline"}
            className="flex items-center bg-card border-input cursor-pointer hover:bg-accent hover:border-primary/40 transition-colors duration-200"
          >
            <Plus className="h-4 w-4" />
            Create New
          </Button>
        </Link>
      </PageHeading>

      <Suspense
        fallback={<BarLoader className="mt-3" width={"100%"} color="gray" />}
      >
        <CoverLetterCards coverLettersData={coverLetters} />
      </Suspense>
    </div>
  );
};

export default CoverLettersPage;
