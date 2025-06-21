'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogOverlay, DialogTitle } from '@/components/ui/dialog';
import { Assessment } from '@/lib/generated/client'
import { format } from 'date-fns';
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import QuizResult, { QuestionType} from './quizResult';

const QuizList = ({ assessments }: { assessments: Assessment[] }) => {
    const router = useRouter();
    const [selectedQuiz, setSelectedQuiz] = useState<Assessment | null>(null);
    
    const getScoreColor = (score: string) => {
        return score >= '50' ? (score < '80' ? 'text-yellow-600' : 'text-green-600') : 'text-red-600';
    }

    return (
        <>
            <Card>
                <CardHeader className='flex flex-col md:flex-row gap-4 md:items-center justify-between'>
                    <div>
                        <CardTitle className='gradient-title text-3xl md:text-4xl'>
                            Recent Quizzes
                        </CardTitle>
                        <CardDescription className='text-muted-foreground'>
                            Review you past quiz performance
                        </CardDescription>
                    </div>
                    <Button 
                        variant={'outline'}
                        className='w-fit sm:px-auto sm:w-[35%] md:w-[25%] py-5 flex items-center justify-center gap-1 bg-zinc-900 border-neutral-700 hover:cursor-pointer hover:bg-neutral-800 hover:border-zinc-500 transition-all duration-75 ease-in-out'
                        onClick={() => router.push('/interview/mock')}
                        >
                        Start New Quiz
                    </Button>
                </CardHeader>
                <CardContent>
                    <div className='space-y-4 flex flex-col items-center'>
                        {assessments.map((ass, idx) => (
                            <Card
                                key={idx}
                                className='lg:w-[80%] hover:cursor-pointer hover:bg-neutral-900/90'
                                onClick={() => setSelectedQuiz(ass)}
                                >
                                <CardHeader>
                                    <CardTitle>Quiz {idx + 1}</CardTitle>
                                    <CardDescription className='md:flex items-center justify-between w-full'>
                                        <div>
                                            Score: <span className={`${getScoreColor(ass.quizScore.toFixed(1))}`}> {ass.quizScore.toFixed(1)}%</span>
                                        </div>
                                        <div className='text-white bg-zinc-800 rounded-md p-[7px] text-sm'>
                                            {format(new Date(ass.createdAt), "MMMM dd yyyy, HH:mm")}
                                        </div>
                                    </CardDescription>
                                </CardHeader>
                                
                                {ass.improvementTip && (
                                <CardContent>
                                    <p className='text-sm'>
                                        <span>
                                            Improvement tip: 
                                        </span>
                                        <span className='text-muted-foreground'> {ass.improvementTip}</span>
                                    </p>
                                </CardContent>
                                )}
                            </Card>
                            ))
                        }
                    </div>
                </CardContent>
            </Card>
            
            <Dialog 
                open={!!selectedQuiz} 
                onOpenChange={() => {setSelectedQuiz(null)}}
            >
                <DialogContent className='w-[70%] md:max-w-[65%] lg:max-w-[65%] xl:max-w-[60%] max-h-[85vh] overflow-y-auto'>
                    <DialogHeader>
                        <DialogTitle></DialogTitle>
                    </DialogHeader>
                    {selectedQuiz && (
                        <QuizResult 
                            submitResult={{
                                ...selectedQuiz,
                                questions: ((selectedQuiz.questions as unknown) as QuestionType[])
                            }}
                            showNewQuizBtn={false}
                        />
                    )}
                </DialogContent>
            </Dialog>
        </>
    )
}

export default QuizList
