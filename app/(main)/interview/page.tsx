import { getInterviewAssessments } from '@/actions/interview'
import React, { Suspense } from 'react'
import QuizStats from './_components/quiz-stats';
import PerformanceChart from './_components/performance-chart';
import QuizList from './_components/quiz-list';
import { BarLoader } from 'react-spinners';

const InterviewPage = async () => {
    const assessments = await getInterviewAssessments();

    return (
        <div className='space-y-4'>
            <div className="text-4xl md:text-5xl gradient-title">
                Interview Preparation
            </div>

            <Suspense fallback={<BarLoader className='mt-3' width={'100%'} color='gray' />}>    
                <QuizStats assessments={assessments}/>
                <PerformanceChart assessments={assessments}/>
                <QuizList assessments={assessments}/>
            </Suspense>
        </div>
    )
}

export default InterviewPage
