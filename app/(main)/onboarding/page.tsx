import React from 'react'
import { OnboardingForm } from './_components/onboarding-form'
import { industries }  from '@/data/industries'
import { getUserOnboardingStatus } from '@/actions/user'
import { redirect } from 'next/navigation'

const OnboardingPage = async () => {
    // redirect to the dashboard if already onboarded
    const { isUser, isOnboarded } = await getUserOnboardingStatus();
    
    if (!isUser) {
        return null;
    }
    if (isOnboarded) {
        redirect('/dashboard');
    }

    return (
        <main>
            <OnboardingForm industries={industries}/>
        </main>
    )
}

export default OnboardingPage
