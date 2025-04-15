import React from 'react'
import RedirectToOnboarding from './_components/redirectToOnboarding';
import { getUserOnboardingStatus } from '@/actions/user';

const MainRoutesLayout = async ({ children }: { children: React.ReactNode}) => {
    const { isOnboarded } = await getUserOnboardingStatus();
    
    return (
        <div className='border container mx-auto mt-24 mb-20'>
            <RedirectToOnboarding isOnboarded = { isOnboarded }/>

            main route layout
            {children}
        </div>
    )
}

export default MainRoutesLayout;
