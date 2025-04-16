'use client';

import { redirect, usePathname } from 'next/navigation';

const RedirectToOnboarding = ({ isOnboarded } : { isOnboarded: boolean }) => {
    //redirect to onboarding if not onboarded (protects all routes of (main) folder, as its present in parent layout.tsx)
    const path = usePathname();

    if (!isOnboarded && path !== '/onboarding') {
        redirect('/onboarding');
    }
    
    return null;
}

export default RedirectToOnboarding;
