'use client';

import { format, formatDistanceToNow } from 'date-fns';
import { IndustryInsight } from '@/lib/generated/client'
import { Brain, BriefcaseIcon, LineChart, TrendingDown, TrendingUp } from 'lucide-react';
import React from 'react'
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

type SalaryRange = {
    role: string;
    min: number;
    max: number;
    median: number;
    location?: string; // Optional, as not all salary ranges may have a location
};

const DashboardView = ({ insights }: { insights: IndustryInsight }) => {
    const salaryData = (insights.salaryRanges as SalaryRange[]).map((salRange) => ({
        name: salRange.role,
        min: salRange.min / 1000,
        max: salRange.max / 1000,
        median: salRange.median / 1000,
        location: salRange.location
    }));

    const getDemandLevelColor = (level: 'High' | 'Medium' | 'Low') => {
        switch (level.toLowerCase()) {
            case 'high':
                return 'bg-green-500';
            case 'medium':
                return 'bg-yellow-500';
            case 'low':
                return 'bg-red-500';
            default:
                return 'bg-gray-500';
        }
    };
    const demandLevelColor = getDemandLevelColor(insights.demandLevel);

    const getMarketOutlookInfo = (outlook: 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE') => {
        switch (outlook.toLowerCase()) {
            case 'positive':
                return { icon: TrendingUp, color: 'text-green-500' };
            case 'neutral':
                return { icon: LineChart, color: 'text-yellow-500' };
            case 'negative':
                return { icon: TrendingDown, color: 'text-red-500' };
            default:
                return { icon: LineChart, color: 'text-gray-500' };
        }
    };
    const MarketOutlookIcon = getMarketOutlookInfo(insights.marketOutlook).icon;
    const marketOutlookColor = getMarketOutlookInfo(insights.marketOutlook).color;


    const lastUpdate = format(new Date(insights.lastUpdated), 'dd/MM/yyyy');
    const nextUpdateDifference = formatDistanceToNow(
        new Date(insights.nextUpdate), 
        { addSuffix: true }
    );

    return (
        <div className='space-y-6'>
            <div className='flex items-center justify-between'>
                <Badge variant={'outline'}>
                    Last updated: {lastUpdate}
                </Badge>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
                <Card>
                    <CardHeader className='flex flex-row items-center justify-between space-y-0'>
                        <CardTitle className='text-sm font-medium'>
                            Market Outlook
                        </CardTitle>
                        <MarketOutlookIcon className={`${marketOutlookColor} h-4 w-4`} />
                    </CardHeader>
                    <CardContent>
                        <div className='text-2xl font-semibold'>
                            {insights.marketOutlook}
                        </div>
                        <div className='text-sm text-muted-foreground'>
                            Next update {nextUpdateDifference}
                        </div>
                    </CardContent>
                </Card>
                
                <Card>
                    <CardHeader className='flex flex-row items-center justify-between space-y-0'>
                        <CardTitle className='text-sm font-medium'>
                            Industry Growth Rate
                        </CardTitle>
                        <TrendingUp className='h-4 w-4 text-muted-foreground'/>
                    </CardHeader>
                    <CardContent className='flex flex-col justify-between h-full'>
                        <div className='text-2xl font-semibold'>
                            {insights.growthRate.toFixed(1)}%
                        </div>
                        <div className='text-sm text-muted-foreground'>
                            Next update {nextUpdateDifference}
                        </div>
                        <Progress value={insights.growthRate} className='mt-2' />
                    </CardContent>
                </Card>
                
                <Card>
                    <CardHeader className='flex flex-row items-center justify-between space-y-0'>
                        <CardTitle className='text-sm font-medium'>
                            Demand Level
                        </CardTitle>
                        <BriefcaseIcon className="text-muted-foreground h-4 w-4" />
                    </CardHeader>
                    <CardContent className='flex flex-col justify-between h-full'>
                        <div className='text-2xl font-semibold'>
                            {insights.demandLevel}
                        </div>
                        <div className={`h-[7px] w-full rounded-full mt-2 ${demandLevelColor}`} />
                    </CardContent>
                </Card>
                
                <Card>
                    <CardHeader className='flex flex-row items-center justify-between space-y-0'>
                        <CardTitle className='text-sm font-medium'>
                            Top Skills
                        </CardTitle>
                        <Brain className="text-muted-foreground h-4 w-4" />
                    </CardHeader>
                    <CardContent>
                        <div className='flex flex-wrap gap-1'>
                            {insights.topSkills.map((skill, index) => (
                                <Badge key={index} variant={'secondary'}>
                                    {skill}
                                </Badge>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

export default DashboardView
