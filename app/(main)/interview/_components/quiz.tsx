'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import useFetch from '@/hooks/use-fetch';
import { ArrowRight } from 'lucide-react';
import React, { useState } from 'react'

export const Quiz = () => {
    const [currentQues, setCurrentQues] = useState();
    const [userAnswers, setUserAnswers] = useState([]);
    const [showExplanation, setShowExplanation] = useState(false);

    const {
        data: questionsData,
        loading: questionsLoading,
        fn: getQuestions,
        error: questionsError,
    } = useFetch();

    const handleClick = () => {
        
    }

    if(!questionsData){
        return <div className='flex justify-center'>
            <Card className='[&>*]:flex [&>*]:justify-center space-y-4'>
                <CardHeader className='[&>*]:flex [&>*]:justify-center space-y-2'>
                    <CardTitle className='text-lg md:text-xl'>
                        Ready to test your knowledge?
                    </CardTitle>
                    <CardDescription>
                        <p className='text-muted-foreground'>
                            This quiz contains 10 questions, specific to your industry and skills. Choose
                            the best answer for each question.
                        </p>
                    </CardDescription>
                </CardHeader>
                <CardFooter>
                    <Button variant={'secondary'} className='w-4/5 md:w-3/5 flex items-center border hover:cursor-pointer hover:bg-neutral-950 transition-all duration-75 ease-in-out'
                            onClick={handleClick}
                    >
                        Start the quiz
                        <ArrowRight />
                    </Button>
                </CardFooter>
            </Card>
        </div>
    }

    return (
        <div>
            WTF
        </div>
    )
}
