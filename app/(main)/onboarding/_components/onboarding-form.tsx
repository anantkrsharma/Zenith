'use client';

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { onboardingSchema } from "@/app/lib/schema";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface OnboardingFormProps {
    industries: {
        id: string;
        name: string;
        subIndustries: string[];
    }[]
}

interface Industry {
    id: string;
    name: string;
    subIndustries: string[];
}

const OnboardingForm = ({ industries } : OnboardingFormProps) => {
    const [selectedIndustry, setSelectedIndustry] = useState<Industry | null>(null);
    const router = useRouter();

    const {
        register,
        handleSubmit,
        formState: {
            errors
        },
        setValue,
        watch
    } = useForm({
        resolver: zodResolver(onboardingSchema),
    });

    const watchIndustry = watch("industry");

    const onSubmit = async () => {
        
    }

    return (
        <div className="flex items-center justify-center bg-background">
            <Card className="w-full max-w-lg mt-10 mx-2">
                <CardHeader>
                    <CardTitle className="gradient-title text-4xl">Complete Your Profile</CardTitle>
                    <CardDescription>Select your industry to get personalised career insights and recommendations.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form action="" className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                        <div className="space-y-2">
                            <Label htmlFor="industry">Industry</Label>
                            <Select onValueChange={(val) => {
                                setValue('industry', val);
                                setSelectedIndustry(
                                    industries.find((ind) => ind.id === val) || null
                                );
                                setValue('subIndustry', '');
                            }}
                            >
                                <SelectTrigger id="industry" className="w-full hover:cursor-pointer">
                                    <SelectValue placeholder="Select an Industry" />
                                </SelectTrigger>
                                <SelectContent>
                                    {industries.map((ind) => {
                                        return <SelectItem value={ind.id} key={ind.id} className="hover:cursor-pointer">
                                            {ind.name}
                                        </SelectItem>
                                    })}
                                </SelectContent>
                            </Select>
                            {
                                errors.industry && (
                                    <p className="text-red-500 text-sm">{errors.industry.message}</p>
                                )
                            }
                        </div>

                        {
                        selectedIndustry && watchIndustry && 
                        <div className="space-y-2">
                            <Label htmlFor="sub-industry">Specialization</Label>
                            <Select onValueChange={(val) => {
                                setValue('subIndustry', val);
                            }}
                            >
                                <SelectTrigger id="sub-industry" className="w-full hover:cursor-pointer">
                                    <SelectValue placeholder="Select a Sub-Industry" />
                                </SelectTrigger>
                                <SelectContent>
                                    {selectedIndustry.subIndustries.map((subInd) => {
                                        return <SelectItem value={subInd} key={subInd} className="hover:cursor-pointer">
                                            {subInd}
                                        </SelectItem>
                                    })}
                                </SelectContent>
                            </Select>
                            {
                                errors.subIndustry && (
                                    <p className="text-red-500 text-sm">{errors.subIndustry.message}</p>
                                )
                            }
                        </div> 
                        }
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}

export default OnboardingForm;
