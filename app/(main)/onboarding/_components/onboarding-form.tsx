"use client";

import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { onboardingSchema } from "@/lib/form-schema";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { updateUser } from "@/actions/user";
import useFetch from "@/hooks/use-fetch";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Controller } from "react-hook-form";

interface OnboardingFormProps {
  industries: {
    id: string;
    name: string;
    subIndustries: string[];
  }[];
}

type OnboardingSchemaType = z.infer<typeof onboardingSchema>;

interface Industry {
  id: string;
  name: string;
  subIndustries: string[];
}

export const OnboardingForm = ({ industries }: OnboardingFormProps) => {
  const [selectedIndustry, setSelectedIndustry] = useState<Industry | null>(
    null,
  );
  const router = useRouter();

  const { fn: onboardUserFn, loading: onboardLoading } =
    useFetch<Awaited<ReturnType<typeof updateUser>>>();

  const {
    control,
    register,
    handleSubmit,
    setValue,

    formState: { errors },
  } = useForm({
    resolver: zodResolver(onboardingSchema),
  });

  const watchIndustry = useWatch({ control, name: "industry" });
  const identity = useWatch({ control });
  const identitySkills = (identity.skills || "")
    .split(",")
    .map((skill) => skill.trim())
    .filter(Boolean);

  const onSubmit = async (values: OnboardingSchemaType) => {
    try {
      const formattedIndustry = `${values.industry}-${values.subIndustry.toLowerCase().replace(/ /g, "-")}`;

      const result = await onboardUserFn(updateUser, {
        ...values,
        bio: values.bio ?? "",
        skills: values.skills ?? [],
        industry: formattedIndustry,
      });
      if (result) {
        toast.success("Profile updated successfully");
        router.push("/dashboard");
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error("Error while onboarding the user");
      } else {
        toast.error("An unknown error occured. Please try again later.");
      }
    }
  };

  return (
    <div className="identity-onboarding">
      <aside className="identity-intro">
        <p className="eyebrow">01 / YOUR STARTING POINT</p>
        <h1>
          Every direction
          <br />
          begins with <span>you.</span>
        </h1>
        <p>
          A few details connect your experience to useful guidance. Let’s get to
          know your professional world.
        </p>
        <div className="identity-map">
          <div className="identity-map-title">
            <span className="status-dot" /> YOUR PROFESSIONAL PROFILE
          </div>
          <div className="identity-line" data-filled={!!identity.industry}>
            <span>01</span>
            <div>
              <small>YOUR LANDSCAPE</small>
              <strong>{selectedIndustry?.name || "Your industry"}</strong>
            </div>
          </div>
          <div className="identity-line" data-filled={!!identity.subIndustry}>
            <span>02</span>
            <div>
              <small>YOUR SPECIALIZATION</small>
              <strong>{identity.subIndustry || "Your area of focus"}</strong>
            </div>
          </div>
          <div
            className="identity-line"
            data-filled={
              identity.experience !== undefined && identity.experience !== ""
            }
          >
            <span>03</span>
            <div>
              <small>YOUR EXPERIENCE</small>
              <strong>
                {identity.experience !== undefined && identity.experience !== ""
                  ? `${identity.experience} years of experience`
                  : "Your journey so far"}
              </strong>
            </div>
          </div>
          <div className="identity-skills">
            <small>YOUR SKILLS</small>
            <div>
              {identitySkills.length ? (
                identitySkills.map((skill, index) => (
                  <span key={index}>{skill}</span>
                ))
              ) : (
                <p>The skills you add will connect here.</p>
              )}
            </div>
          </div>
        </div>
        <p className="identity-note">
          Your profile shapes your insights, practice questions, and cover
          letters.
        </p>
      </aside>
      <Card className="identity-form">
        <CardHeader>
          <CardTitle className="gradient-title text-2xl">
            Let’s connect the pieces.
          </CardTitle>
          <CardDescription>
            Select your industry to get personalised career insights and
            recommendations.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form
            action=""
            className="space-y-6"
            onSubmit={handleSubmit(onSubmit)}
          >
            {/* Industry */}
            <div className="space-y-2">
              <Label htmlFor="industry">* Industry</Label>
              <Controller
                control={control}
                name="industry"
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={(val) => {
                      field.onChange(val);
                      setSelectedIndustry(
                        industries.find((ind) => ind.id === val) || null,
                      );
                      setValue("subIndustry", "");
                    }}
                  >
                    <SelectTrigger
                      id="industry"
                      className="w-full cursor-pointer"
                    >
                      <SelectValue placeholder="Select an Industry" />
                    </SelectTrigger>
                    <SelectContent>
                      {industries.map((ind) => (
                        <SelectItem
                          value={ind.id}
                          key={ind.id}
                          className="cursor-pointer"
                        >
                          {ind.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.industry && (
                <p className="text-red-500 text-xs md:text-sm">
                  {errors.industry.message}
                </p>
              )}
            </div>

            {/* Sub-Industry (Specialization) */}
            {selectedIndustry && watchIndustry && (
              <div className="space-y-2">
                <Label htmlFor="sub-industry">* Specialization</Label>
                <Controller
                  control={control}
                  name="subIndustry"
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger
                        id="sub-industry"
                        className="w-full cursor-pointer"
                      >
                        <SelectValue placeholder="Select a Sub-Industry" />
                      </SelectTrigger>
                      <SelectContent>
                        {selectedIndustry.subIndustries.map((subInd) => (
                          <SelectItem
                            value={subInd}
                            key={subInd}
                            className="cursor-pointer"
                          >
                            {subInd}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.subIndustry && (
                  <p className="text-red-500 text-xs md:text-sm">
                    {errors.subIndustry.message}
                  </p>
                )}
              </div>
            )}

            {/* YOE */}
            <div className="space-y-2">
              <Label htmlFor="experience">Years of Experience</Label>
              <Input
                id="experience"
                type="number"
                min={0}
                max={50}
                placeholder="Years of Experience"
                {...register("experience", {
                  required: "Please enter your years of experience",
                })}
              />
              {errors.experience && (
                <p className="text-red-500 text-xs md:text-sm">
                  Enter valid years of experience (0 - 50)
                </p>
              )}
            </div>

            {/* Skills */}
            <div className="space-y-2">
              <Label htmlFor="skills">Skills</Label>
              <Input
                id="skills"
                type="text"
                placeholder="e.g. React, Node.js, Python"
                {...register("skills", {
                  required: "Please enter your skills",
                })}
              />
              <p className="text-sm text-muted-foreground">
                Separate multiple skills with commas (,)
              </p>
              {errors.skills && (
                <p className="text-red-500 text-xs md:text-sm">
                  {errors.skills.message}
                </p>
              )}
            </div>

            {/* Bio */}
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Controller
                control={control}
                name="bio"
                render={({ field }) => (
                  <Textarea
                    {...field}
                    id="bio"
                    placeholder="Tell us about your professional background and interests."
                    className="resize-none"
                  />
                )}
              />
              {errors.bio && (
                <p className="text-red-500 text-xs md:text-sm">
                  {errors.bio.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full cursor-pointer"
              disabled={onboardLoading}
            >
              {onboardLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Complete Profile"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
