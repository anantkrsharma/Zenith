import { Assessment } from '@/lib/generated/client'
import React from 'react'

const QuizList = ({ assessments }: { assessments: Assessment[] }) => {
    return (
        <div>
            {
                assessments.map((ass, index) => (
                    <div key={index}>
                        {JSON.stringify(ass)}
                    </div>
                ))
            }
        </div>
    )
}

export default QuizList
