import { getUserOnboardingStatus } from '@/actions/user';
import { redirect } from 'next/navigation';
import React from 'react'

const IndustryInsightsPage = async () => {
    //redirect to onboarding if not onboarded
    const { isOnboarded } = await getUserOnboardingStatus();
    if(!isOnboarded) {
        console.log("User is not onboarded")
        redirect('/onboarding');
    }
    
    return (
        <div>
            Industry Insights Page
        </div>
    )
}

export default IndustryInsightsPage
