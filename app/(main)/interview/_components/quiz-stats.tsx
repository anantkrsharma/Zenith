import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Assessment } from '@/lib/generated/client'
import { Brain, LineChart, Target, TrendingDown, TrendingUp } from 'lucide-react';
import React from 'react'

const QuizStats = ({ assessments }: { assessments: Assessment[] }) => {
    const getAvgScore = () => {
        if(assessments.length == 0) return 0;
        const totalScore = assessments.reduce((accumulator, assessment) => accumulator + assessment.quizScore, 0);
        return parseFloat((totalScore / assessments.length).toFixed(1));
    }

    const getAvgScoreInfo = (avgScore: number) => {
        if(avgScore >= 80)
            return { icon: TrendingUp, color: 'text-green-500' };
        else if(avgScore >= 50 && avgScore < 80)
            return { icon: LineChart, color: 'text-yellow-500' };
        else
            return { icon: TrendingDown, color: 'text-red-500' };
            
    }
    const AvgScoreIcon = getAvgScoreInfo(getAvgScore()).icon;
    const avgScoreColor = getAvgScoreInfo(getAvgScore()).color;
    
    const getLatestAssessment = () => {
        if(assessments.length == 0) return null;
        return assessments[0];
    }

    const getTotalQuestions = () => {
        if(assessments.length == 0) return 0;
        const totalQues = assessments.reduce((accumulator, assessment) => accumulator + assessment.questions.length, 0);
        return totalQues;
    }

    return (
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0'>
                    <CardTitle className='font-medium'>
                        Average Score
                    </CardTitle>
                    <AvgScoreIcon className={`${avgScoreColor} h-4 w-4`} />
                </CardHeader>
                <CardContent>
                    <div className='text-2xl font-semibold'>
                        {getAvgScore()}%
                    </div>
                    <div className='text-sm text-muted-foreground'>
                        Across all assessments 
                    </div>
                </CardContent>
            </Card>
            
            <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0'>
                    <CardTitle className='font-medium'>
                        Questions Practised
                    </CardTitle>
                    <Brain className={`h-4 w-4`} />
                </CardHeader>
                <CardContent>
                    <div className='text-2xl font-semibold'>
                        {getTotalQuestions()}
                    </div>
                    <div className='text-sm text-muted-foreground'>
                        Total Questions 
                    </div>
                </CardContent>
            </Card>
            
            <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0'>
                    <CardTitle className='font-medium'>
                        Latest Score
                    </CardTitle>
                    <Target className={`h-4 w-4`} />
                </CardHeader>
                <CardContent>
                    <div className='text-2xl font-semibold'>
                        {getLatestAssessment()?.quizScore.toFixed(1) || 0}%
                    </div>
                    <div className='text-sm text-muted-foreground'>
                        Most recent quiz 
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default QuizStats
