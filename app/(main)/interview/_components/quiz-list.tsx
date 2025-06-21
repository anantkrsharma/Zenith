'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Assessment } from '@/lib/generated/client'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'

const QuizList = ({ assessments }: { assessments: Assessment[] }) => {
    const router = useRouter();
    const [selectedQuiz, setSelectedQuiz] = useState(null);

    return (
        <>
            <Card>
                <CardHeader>
                    <div>
                        <CardTitle className='gradient-title text-3xl md:text-4xl'>
                            Recent Quizzes
                        </CardTitle>
                        <CardDescription className='text-muted-foreground'>
                            Review you past quiz performance
                        </CardDescription>
                    </div>
                    <div className='flex justify-center py-4'>
                        <Button 
                            variant={'outline'}
                            className='w-fit sm:px-auto sm:w-[50%] md:w-[55%] py-5 flex items-center justify-center gap-1 bg-zinc-900 border-neutral-700 hover:cursor-pointer hover:bg-neutral-800 hover:border-zinc-500 transition-all duration-75 ease-in-out'
                            >
                            Start New Quiz
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <p>Card Content</p>
                </CardContent>
                <CardFooter>
                    <p>Card Footer</p>
                </CardFooter>
            </Card>
        </>
    )
}

export default QuizList
