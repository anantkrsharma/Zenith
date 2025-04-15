import React from 'react'
import OnboardingForm from './_components/onboarding-form'
import { industries } from '@/data/industries'
import { getUserOnboardingStatus } from '@/actions/user'
import { redirect } from 'next/navigation'

const OnboardingPage = async () => {
    // redirect to the dashboard if already onboarded
    const { isOnboarded } = await getUserOnboardingStatus();
    if(isOnboarded) {
        redirect('/dashboard');
    }

    return (
        <main>
            <OnboardingForm industries={industries}/>
        </main>
    )
}

export default OnboardingPage
