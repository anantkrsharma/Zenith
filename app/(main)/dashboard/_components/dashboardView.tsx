'use client';

import { IndustryInsight } from '@/lib/generated/client'
import React from 'react'

const DashboardView = ({ insights }: { insights: IndustryInsight }) => {
    return (
        <div>
            {JSON.stringify(insights)}
        </div>
    )
}

export default DashboardView
