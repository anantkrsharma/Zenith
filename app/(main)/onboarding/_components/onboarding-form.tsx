'use client';

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { onboardingSchema } from "@/lib/form-schema";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
    }[]
}

type OnboardingSchemaType = z.infer<typeof onboardingSchema>;

interface Industry {
    id: string;
    name: string;
    subIndustries: string[];
}

export const OnboardingForm = ({ industries } : OnboardingFormProps) => {
    const [selectedIndustry, setSelectedIndustry] = useState<Industry | null>(null);
    const router = useRouter();

    const { 
        data: onboardResult,
        fn: onboardUserFn,
        loading: onboardLoading,
    } = useFetch();

    const { 
        control,
        register,
        handleSubmit,
        setValue,
        watch,
        formState: {
            errors
        }
    } = useForm({
        resolver: zodResolver(onboardingSchema),
    });

    const watchIndustry = watch("industry");

    const onSubmit = async (values: OnboardingSchemaType) => {
        try {
            const formattedIndustry = `${values.industry}-${values.subIndustry.toLowerCase().replace(/ /g, "-")}`;

            await onboardUserFn(
                updateUser,
                {
                ...values,
                industry: formattedIndustry,
                }
            );
        } catch (error) {
            if(error instanceof Error) {
                toast.error("Error while onboarding the user");
            } else {
                toast.error("An unknown error occured. Please try again later.");
            }
        }
    }

    const [toastId, setToastId] = useState<string | number | null>(null);
    useEffect(() => {
        if (onboardLoading && toastId == null) {
            const id = toast.loading("Updating profile...");
            setToastId(id);
        }
        if (!onboardLoading && toastId != null) {
            toast.dismiss(toastId);
            setToastId(null);

            if (onboardResult?.success) {
                toast.success("Profile updated successfully");
                router.push("/dashboard");
            }
        }
    }, [onboardResult, onboardLoading]);

    return (
        <div className="flex items-center justify-center bg-background">
            <Card className="w-full max-w-lg mt-10 mx-2">
                <CardHeader>
                    <CardTitle className="gradient-title text-4xl">Complete Your Profile</CardTitle>
                    <CardDescription>Select your industry to get personalised career insights and recommendations.</CardDescription>
                </CardHeader> 

                <CardContent>
                    <form action="" className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
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
                                            setSelectedIndustry(industries.find((ind) => ind.id === val) || null);
                                            setValue('subIndustry', '');
                                        }}
                                    >
                                        <SelectTrigger id="industry" className="w-full hover:cursor-pointer">
                                            <SelectValue placeholder="Select an Industry" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {industries.map((ind) => (
                                                <SelectItem value={ind.id} key={ind.id} className="hover:cursor-pointer">
                                                    {ind.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            {
                                errors.industry && (
                                    <p className="text-red-500 text-xs md:text-sm">{errors.industry.message}</p>
                                )
                            }
                        </div>
                        
                        {/* Sub-Industry (Specialization) */}
                        { selectedIndustry && watchIndustry && 
                        <div className="space-y-2">
                            <Label htmlFor="sub-industry">* Specialization</Label>
                            <Controller
                                control={control}
                                name="subIndustry"
                                render={({ field }) => (
                                    <Select
                                        value={field.value}
                                        onValueChange={field.onChange}
                                    >
                                        <SelectTrigger id="sub-industry" className="w-full hover:cursor-pointer">
                                            <SelectValue placeholder="Select a Sub-Industry" />
                                        </SelectTrigger>
                                        <SelectContent>
                                        {selectedIndustry.subIndustries.map((subInd) => (
                                            <SelectItem value={subInd} key={subInd} className="hover:cursor-pointer">
                                                {subInd}
                                            </SelectItem>
                                        ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            {
                                errors.subIndustry && (
                                    <p className="text-red-500 text-xs md:text-sm">{errors.subIndustry.message}</p>
                                )
                            }
                        </div> 
                        }

                        {/* YOE */}
                        <div className="space-y-2">
                            <Label htmlFor="experience">Years of Experience</Label>
                            <Input  id="experience" 
                                    type="number"
                                    min={0}
                                    max={50}
                                    placeholder="Years of Experience"
                                    {...register("experience", {
                                        required: "Please enter your years of experience",
                                    })}
                            />
                            {
                                errors.experience && (
                                    <p className="text-red-500 text-xs md:text-sm">Enter valid years of experience (0 - 50)</p>
                                )
                            }
                        </div>
                        
                        {/* Skills */}
                        <div className="space-y-2">
                            <Label htmlFor="skills">Skills</Label>
                            <Input  id="skills" 
                                    type="text"
                                    placeholder="e.g. React, Node.js, Python"
                                    {...register("skills", {
                                        required: "Please enter your skills",
                                    })}
                            />
                            <p className="text-sm text-muted-foreground">Separate multiple skills with commas (,)</p>
                            {
                                errors.skills && (
                                    <p className="text-red-500 text-xs md:text-sm">{errors.skills.message}</p>
                                )
                            }
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
                            {
                                errors.bio && (
                                    <p className="text-red-500 text-xs md:text-sm">{errors.bio.message}</p>
                                )
                            }
                        </div>
                        
                        <Button type="submit" className="w-full hover:cursor-pointer" disabled={onboardLoading}>
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
    )
}
