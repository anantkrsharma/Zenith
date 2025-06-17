import { getInterviewAssessments } from '@/actions/interview'
import React from 'react'
import QuizStats from './_components/quiz-stats';
import PerformanceChart from './_components/performance-chart';
import QuizList from './_components/quiz-list';

const InterviewPrepPage = async () => {
    const assessments = await getInterviewAssessments();

    return (
        <div>
            <div className="text-3xl md:text-5xl gradient-title">
                Interview Preparation
            </div>

            <QuizStats assessments={assessments}/>
            <PerformanceChart assessments={assessments}/>
            <QuizList assessments={assessments}/>
        </div>
    )
}

export default InterviewPrepPage
