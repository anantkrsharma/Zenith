'use client'

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Assessment } from '@/lib/generated/client'
import { format } from 'date-fns';
import React, { useEffect, useState } from 'react'
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

interface ChartData {
    date: string,
    score: number
}

const PerformanceChart = ({ assessments }: { assessments: Assessment[] }) => {
    const [chartData, setChartData] = useState<ChartData[]>([]);

    useEffect(() => {
        if(assessments){
            const chartDataArr = assessments.map((assessment) => ({
                    date: format(new Date(assessment.createdAt), 'MMM dd yyyy'),
                    score: parseFloat(assessment.quizScore.toFixed(1))
                })
            );
            setChartData(chartDataArr);
        }
    }, [assessments]);

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
    const heightClass = isMediumScreen ? (isSmallScreen ? 'h-[200px]' : 'h-[400px]') : 'h-[500px]';

    return (
        <Card>
            <CardHeader>
                <CardTitle className='md:text-lg'>
                    Performance Trend
                </CardTitle>
                <CardDescription className='space-y-0'>
                    <div>
                        Your quiz scores over time
                    </div>
                    <br />
                    {isSmallScreen && 
                    <span className='text-sm text-cyan-500'>
                        * Tap / hover on the graph lines for quiz progress details *
                    </span>
                    }
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className={`${heightClass} w-full`}>
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                            data={chartData}
                            margin={{
                                left: isSmallScreen ? -25 : -5,
                                right: isMediumScreen ? (isSmallScreen ? 10 : 50) : 50,
                                bottom: isMediumScreen ? (isSmallScreen ? -15 : 70) : 30
                            }}
                            barCategoryGap={isSmallScreen ? '15%' : '11%'}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis 
                                dataKey="date" 
                                interval={0}
                                angle={isMediumScreen ? (isSmallScreen ? 0 : -15) : isLargeScreen ? 0 : -10}
                                dy={isMediumScreen ? (isSmallScreen ? 0 : 15) : 15}
                                tick={!isSmallScreen}
                            />
                            <YAxis 
                                domain={[0, 100]}
                            />
                            <Tooltip content={({ active, payload, label }) => {
                                if (active && payload && payload.length) {
                                    return (
                                        <div className="bg-neutral-900 border border-zinc-700 rounded-lg p-2 space-y-[2px] shadow-lg text-center">
                                            <p className="text-sm font-medium">
                                                Score: {payload[0].value}%
                                            </p>
                                            <p className="text-xs md:text-sm text-muted-foreground">
                                                {payload[0].payload.date}
                                            </p>
                                        </div>
                                    )
                                }
                                return null;
                            }} />
                            <Line 
                                type="monotone" 
                                dataKey="score" 
                                stroke="#00CBCB" 
                                strokeWidth={1.65}
                                activeDot={{ r: 7 }} 
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    )
}

export default PerformanceChart
