import React from 'react'
import RedirectToOnboarding from './_components/redirect-to-onboarding';
import { getUserOnboardingStatus } from '@/actions/user';

const MainRoutesLayout = async ({ children }: { children: React.ReactNode}) => {
    const { isOnboarded } = await getUserOnboardingStatus();
    
    return (
        <div className='container mx-auto mt-24 mb-20 px-4 md:px-2'>
            <RedirectToOnboarding isOnboarded = {isOnboarded}/>

            {children}
        </div>
    )
}

export default MainRoutesLayout;
