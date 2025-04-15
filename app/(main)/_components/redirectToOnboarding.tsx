'use client';

import { redirect, usePathname } from 'next/navigation';
import React from 'react'

const RedirectToOnboarding = ({ isOnboarded } : { isOnboarded: boolean }) => {
    //redirect to onboarding if not onboarded
    const path = usePathname();

    if (!isOnboarded && path !== '/onboarding') {
        redirect('/onboarding');
    }
    
    return null;
}

export default RedirectToOnboarding;
