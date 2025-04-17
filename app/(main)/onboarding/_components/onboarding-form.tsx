'use client';

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { onboardingSchema } from "@/app/lib/schema";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface OnboardingFormProps {
    industries: {
        id: string;
        name: string;
        subIndustries: string[];
    }[]
}

const OnboardingForm = ({ industries } : OnboardingFormProps) => {
    const [selectedIndustry, setSelectedIndustry] = useState<string | null>(null);
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

    return (
        <div className="flex items-center justify-center">
            <Card>
                <CardHeader>
                    <CardTitle>Onboarding Form</CardTitle>
                    <CardDescription></CardDescription>
                </CardHeader>
                <CardContent>
                    
                </CardContent>
            </Card>
        </div>
    )
}

export default OnboardingForm;
