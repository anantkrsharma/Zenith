"use client";

import { PageHeading } from "@/components/page-heading";
import { createCoverLetter } from "@/actions/cover-letter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import useFetch from "@/hooks/use-fetch";
import { coverLetterSchema } from "@/lib/form-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import { motion } from "motion/react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const NewCover = () => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(coverLetterSchema),
    defaultValues: {
      jobTitle: "",
      companyName: "",
      jobDescription: "",
    },
  });

  const { loading: newLetterLoading, fn: newLetterFn } =
    useFetch<Awaited<ReturnType<typeof createCoverLetter>>>();
  const letterContext = useWatch({ control });

  const onSubmit = async (data: z.infer<typeof coverLetterSchema>) => {
    try {
      const result = await newLetterFn(createCoverLetter, data);
      if (result) {
        toast.success("Cover letter created successfully");
        router.push(`/ai-cover-letter/${result.id}`);
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error("Error while creating cover letter");
        console.error("Error while creating cover letter" + error.message);
      } else {
        toast.error("Error while creating cover letter");
        console.error("Error while creating cover letter" + error);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <Link href={"/ai-cover-letter"}>
          <Button
            variant={"outline"}
            className="flex items-center pl-0 gap-2 border bg-neutral-950 border-zinc-700 hover:bg-black hover:border-zinc-500 cursor-pointer hover:no-underline transition-colors duration-75 ease-in-out"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
        </Link>
        <PageHeading
          className="mt-6"
          eyebrow="MAKE THE INTRODUCTION COUNT"
          title="A letter with your name on it."
          description="Tell us about the opportunity. We’ll help you connect your experience to the role."
        />
      </div>

      <motion.div
        className="letter-composer"
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.33, ease: [0.4, 0, 0.2, 1] }}
      >
        <Card className="bg-card letter-input-panel">
          <CardContent>
            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2 flex flex-col">
                  <Label htmlFor="job-title">* Job Title</Label>
                  <Input
                    {...register("jobTitle")}
                    id="job-title"
                    placeholder="e.g. Software Engineer"
                    className="bg-background"
                  />
                  {errors.jobTitle && (
                    <p className="text-xs sm:text-sm text-red-500">
                      {errors.jobTitle.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2 flex flex-col">
                  <Label htmlFor="company-name">* Company Name</Label>
                  <Input
                    {...register("companyName")}
                    id="company-name"
                    placeholder="e.g. Google"
                    className="bg-background"
                  />
                  {errors.companyName && (
                    <p className="text-xs sm:text-sm text-red-500">
                      {errors.companyName.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="job-desc">Job Description</Label>
                <Controller
                  control={control}
                  name="jobDescription"
                  render={({ field }) => (
                    <Textarea
                      {...field}
                      id="job-desc"
                      placeholder="Tell us more about your job role."
                      className="min-h-48 bg-background"
                    />
                  )}
                />
                {errors.jobDescription && (
                  <p className="text-xs sm:text-sm text-red-500">
                    {errors.jobDescription.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                variant={"outline"}
                size={"lg"}
                className="text-md flex items-center bg-primary text-primary-foreground border-primary cursor-pointer hover:bg-primary/90 hover:border-primary transition-colors duration-200"
                disabled={newLetterLoading}
              >
                {newLetterLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>Create cover letter</>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
        <aside className="letter-context-panel">
          <p className="eyebrow">A THOUGHTFUL CONNECTION</p>
          <h2>
            Your story.
            <br />
            Their next chapter.
          </h2>
          <div className="letter-context-step">
            <span>01</span>
            <div>
              <small>THE STARTING POINT</small>
              <strong>Your professional experience</strong>
              <p>From the profile you shared with Zenith.</p>
            </div>
          </div>
          <div className="letter-context-step">
            <span>02</span>
            <div>
              <small>THE OPPORTUNITY</small>
              <strong>{letterContext.jobTitle || "Your target role"}</strong>
              <p>
                {letterContext.companyName || "The company you want to join"}
              </p>
            </div>
          </div>
          <div className="letter-context-step">
            <span>03</span>
            <div>
              <small>THE CONNECTION</small>
              <strong>A tailored introduction</strong>
              <p>
                {letterContext.jobDescription
                  ? "Your job context helps connect the right experience to this role."
                  : "Add the job description to give your letter a clear focus."}
              </p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground leading-6 mt-8">
            Your letter is saved after generation. Review it, then download a
            PDF when you’re ready.
          </p>
        </aside>
      </motion.div>
    </div>
  );
};

export default NewCover;
