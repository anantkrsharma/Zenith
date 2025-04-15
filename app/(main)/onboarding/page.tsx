import React from 'react'
import OnboardingForm from './_components/onboarding-form'
import { industries } from '@/data/industries'

const OnboardingPage = () => {
    // redirect to the dashboard if already onboarded
    
    return (
        <main>
            <OnboardingForm industries={industries}/>
        </main>
    )
}

export default OnboardingPage
