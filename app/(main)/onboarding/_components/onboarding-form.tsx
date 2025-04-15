import React from 'react'

interface OnboardingFormProps {
    industries: {
        id: string;
        name: string;
        subIndustries: string[];
    }[]
}

const OnboardingForm = ({ industries } : OnboardingFormProps) => {
    return (
        <div>
            ONBOARDING FORM
        </div>
    )
}

export default OnboardingForm
