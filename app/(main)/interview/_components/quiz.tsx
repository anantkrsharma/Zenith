'use client';

import { generateInterviewQuestions } from '@/actions/interview';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import useFetch from '@/hooks/use-fetch';
import { Loader2, SquareCheckBig } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner';

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

    const handleClick = async () => {
        try {
            await getQuestions(generateInterviewQuestions);
            if(questionsError)
                throw new Error("An unknown error occured while generating mock interview quiz questions");
        } catch (error) {
            if(error instanceof Error){
                console.log(error.message);
                toast.error(error.message);
            }
            else{
                toast.error("An unknown error occured while generating mock interview quiz questions");
            }
        }
    }

    const [toastId, setToastId] = useState<string | number | null>(null);
    useEffect(() => {
        if (questionsLoading && toastId == null) {
            const id = toast.loading("Generating mock interview quiz...");
            setToastId(id);
        }
        if (!questionsLoading && toastId != null) {
            toast.dismiss(toastId);
            setToastId(null);

            if (questionsData.length > 0) {
            toast.success("Generated mock interview quiz successfully.");
            }
        }
    }, [questionsData, questionsLoading]);

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
                    <Button variant={'secondary'} className='w-4/5 md:w-3/5 flex items-center gap-2 border hover:cursor-pointer hover:bg-neutral-950 transition-all duration-75 ease-in-out'
                            onClick={handleClick}
                            disabled={questionsLoading}
                    >
                        {questionsLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Generating the quiz...
                            </>
                        ) : (
                            <>            
                                <SquareCheckBig />
                                Start the quiz
                            </>
                        )}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    }

    return (
        <div>
            {questionsData.length > 0 
            && 
            questionsData.map((q: any) => {
                    return <div key={q.question}>
                    <div>
                        {JSON.stringify(q)}
                    </div>
                    <br />
                    <br />
                    </div> 
                })
            }
        </div>
    )
}
