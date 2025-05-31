'use client';

import { redirect, usePathname } from 'next/navigation';
import { toast } from 'sonner';

const RedirectToOnboarding = ({ isOnboarded } : { isOnboarded: boolean }) => {
    //redirect to onboarding if not onboarded (protects all routes of (main) folder, as its present in parent layout.tsx)
    const path = usePathname();

    if (!isOnboarded && path != '/onboarding') {
        redirect('/onboarding');
    }
    else if(isOnboarded && path == '/onboarding') {
        redirect('/dashboard');
    }
    return null;
}

export default RedirectToOnboarding;
