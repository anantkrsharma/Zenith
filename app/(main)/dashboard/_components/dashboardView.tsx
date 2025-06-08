'use client';

import { format, formatDistanceToNow } from 'date-fns';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Rectangle } from 'recharts';
import { IndustryInsight } from '@/lib/generated/client'
import { Brain, BriefcaseIcon, Dot, LineChart, TrendingDown, TrendingUp } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
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
        name: salRange.role, // Split role name for better readability in the chart
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

    const [isLargeScreen, setIsLargeScreen] = useState(false);
    const [isMediumScreen, setIsMediumScreen] = useState(false);
    const [isSmallScreen, setIsSmallScreen] = useState(false);

    useEffect(() => {
        const checkScreenSize = () => {
            setIsLargeScreen(window.innerWidth >= 1280);
            setIsMediumScreen(window.innerWidth < 1024);
            setIsSmallScreen(window.innerWidth < 769);
        };

        checkScreenSize(); // initial check
        window.addEventListener('resize', checkScreenSize);

        return () => {
            if (typeof window !== 'undefined') {
            window.removeEventListener('resize', checkScreenSize);
            }
        };
        }, []);

    return (
        <div className='space-y-6'>
            <div className='flex items-center justify-between'>
                <Badge variant={'secondary'}>
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
                    <CardContent>
                        <div className='text-2xl font-semibold'>
                            {insights.growthRate.toFixed(1)}%
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
                    <CardContent>
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
                                <Badge key={index} variant={'outline'} className='bg-neutral-900'>
                                    {skill}
                                </Badge>
                            ))}
                        </div>
                    </CardContent>
                </Card>
                
                <Card className='col-span-1 md:col-span-2 lg:col-span-4'>
                    <CardHeader>
                        <CardTitle className='font-semibold'>
                            Salary Ranges by Role
                        </CardTitle>
                        <CardDescription>
                            <p className='text-sm text-muted-foreground'>
                                Displaying minimum, median, and maximum salaries (in thousands)
                            </p>
                            <br />
                            {isSmallScreen && 
                            <span className='text-sm text-cyan-400'>
                                * Tap / Hover on the graph bars for salary details *
                            </span>
                            }
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className={`h-[${isMediumScreen ? (isSmallScreen ? `200` : `400`) : `500`}px] w-full`}>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart   data={salaryData}
                                            margin={{
                                                left: isSmallScreen ? -25 : -5, 
                                                right: isMediumScreen ? (isSmallScreen ? 10 : 30) : 20, 
                                                bottom: isMediumScreen ? (isSmallScreen ? -15 : 70) : 30 
                                            }}
                                            barCategoryGap={isSmallScreen ? '15%' : '11%'}
                                >
                                    <CartesianGrid strokeDasharray="5 5" />
                                    <XAxis
                                            dataKey={"name"}
                                            interval={0}
                                            angle={isMediumScreen ? (isSmallScreen ? 0 : -35) : isLargeScreen ? 0 : -10}
                                            dy={isMediumScreen ? (isSmallScreen ? 0 : 35) : 15}
                                            tick={!isSmallScreen}
                                    />
                                    <YAxis />
                                    <Tooltip content={({ active, payload, label }) => {
                                        if(active && payload && payload.length) {
                                            return (
                                                <div className='bg-background border rounded-lg p-2 shadow-lg'>
                                                    <p className='font-medium'>{label}</p>
                                                    {payload.map((item, index) => (
                                                        <p key={index} className='text-sm'>
                                                            {item.name}: ${item.value}K
                                                        </p>
                                                    ))}
                                                </div>
                                            )
                                        }
                                        return null;
                                    }}/>
                                    <Bar 
                                        dataKey="min" 
                                        fill="#505050" 
                                        activeBar={<Rectangle fill="#505050" stroke="black" />} 
                                    />
                                    <Bar 
                                        dataKey="median" 
                                        fill="#808080" 
                                        activeBar={<Rectangle fill="#808080" stroke="black" />} 
                                    />
                                    <Bar 
                                        dataKey="max" 
                                        fill="#C0C0C0" 
                                        activeBar={<Rectangle fill="#C0C0C0" stroke="black" />} 
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            </div>
            
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4 '>
                <Card>
                    <CardHeader>
                        <CardTitle className='font-medium'>
                            Industry trends
                        </CardTitle>
                        <CardDescription className='text-sm text-muted-foreground'>
                            Ongoing trends shaping the industry.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className='flex flex-col justify-center gap-[6px]'>
                            {insights.keyTrends.map((trend, index) => {
                                    return <div className='flex items-center gap-[1px]' key={index}>
                                        <span>
                                            <Dot size={26}/>
                                        </span>
                                        <p className='text-sm'>
                                            {trend}.
                                        </p>
                                    </div>
                            })}
                        </div>
                    </CardContent>
                </Card>
                
                <Card>
                    <CardHeader>
                        <CardTitle className='font-medium'>
                            Recommended Skills
                        </CardTitle>
                        <CardDescription className='text-sm text-muted-foreground'>
                            Skills to develop for future opportunities.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className='flex items-center flex-wrap gap-[6px]'>
                            {insights.recommendedSkills.map((skill, index) => {
                                    return <div className='flex items-center gap-[1px]' key={index}>
                                        <Badge variant={'outline'} className='text-sm bg-neutral-800'>
                                            {skill}
                                        </Badge>
                                    </div>
                            })}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

export default DashboardView;
