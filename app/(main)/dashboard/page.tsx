import { getIndustryInsights } from '@/actions/dashboard'
import React from 'react'
import { DashboardView } from './_components/dashboard-view';

const IndustryInsightsPage = async () => {
    const industryInsights = await getIndustryInsights();
    
    return (
        <div className='container mx-auto'>
            <DashboardView insights={industryInsights}/>
        </div>
    )
}

export default IndustryInsightsPage
