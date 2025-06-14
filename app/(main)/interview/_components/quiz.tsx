'use client';

import { generateInterviewQuestions } from '@/actions/interview';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import useFetch from '@/hooks/use-fetch';
import { ChevronLeft, ChevronRight, Loader2, SquareCheckBig } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { BarLoader } from 'react-spinners';
import { toast } from 'sonner';

export const Quiz = () => {
    const [currentQues, setCurrentQues] = useState<number>(0);
    const [userAnswers, setUserAnswers] = useState<any[]>([]);
    const [showExplanation, setShowExplanation] = useState<boolean>(false);

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

    const [toastId, setToastId] = useState<string | number | null>(null); //to stop rendering the 'loading' spinner after successful data fetching
    useEffect(() => {
        if (questionsLoading && toastId == null) {
            const id = toast.loading("Generating mock interview quiz");
            setToastId(id);
        }
        if (!questionsLoading && toastId != null) {
            toast.dismiss(toastId);
            setToastId(null);

            if (questionsData.length > 0) {
                setUserAnswers(new Array(questionsData.length).fill(null));
                toast.success("Generated mock interview quiz successfully");
            }
        }
    }, [questionsData, questionsLoading]);

    if(questionsLoading)
        return <BarLoader className='mt-3' width={'100%'} color='gray' />

    if(!questionsData){
        return (
        <div className='flex justify-center'>
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
                    <Button variant={'secondary'} className='w-fit sm:px-auto sm:w-[50%] md:w-[40%] lg:w-[35%] flex items-center gap-2 border hover:cursor-pointer hover:bg-neutral-950 transition-all duration-75 ease-in-out'
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
        )
    }

    const question = questionsData[currentQues];

    const handleChange = (val: string) => {
        const userAnswersNew = [...userAnswers];
        userAnswersNew[currentQues] = val;
        setUserAnswers(userAnswersNew);
    }

    const handleSubmit = () => {
        if(userAnswers.includes(null)){
            toast.error("Attempt each question in the quiz");
            return;
        }
        toast.success("Quiz submitted")
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className='text-muted-foreground'>
                    {`Question ${currentQues + 1} of ${questionsData.length}`}
                </CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
                <p className='text-lg font-medium'>{question.question}</p>

                <RadioGroup className='space-y-2'
                            onValueChange={handleChange}
                            value={userAnswers[currentQues]}
                >
                    { question.options.map((option: string, index: number) => (
                        <div key={index} className="flex items-center space-x-2">
                            <RadioGroupItem value={option} id={`option-${index}`} className='hover:cursor-pointer border-neutral-400 hover:border-neutral-700 transition-colors duration-75 ease-in-out'/>
                            <Label htmlFor={`option-${index}`}>{option}</Label>
                        </div>
                    ))
                    }
                </RadioGroup>
            </CardContent>
            <CardFooter className='flex items-center justify-center md:justify-start gap-2 md:gap-4'>
                {currentQues > 0 &&
                <Button variant={'outline'} 
                        className='flex items-center justify-center gap-1 bg-neutral-900 hover:cursor-pointer hover:bg-zinc-950 transition-all duration-75 ease-in-out'
                        onClick={() => setCurrentQues(prev => prev - 1)}
                >
                    <ChevronLeft />
                    Back
                </Button>
                }
                {currentQues < questionsData.length - 1 &&
                <Button variant={'outline'} 
                        className='flex items-center justify-center gap-1 bg-neutral-900 hover:cursor-pointer hover:bg-zinc-950 transition-all duration-75 ease-in-out'
                        onClick={() => setCurrentQues(prev => prev + 1)}
                >
                    Next
                    <ChevronRight />
                </Button>
                }
                {
                    currentQues == questionsData.length - 1 &&
                    <Button variant={'default'}
                            className='flex items-center justify-center gap-1 hover:cursor-pointer hover:bg-zinc-400 transition-all duration-75 ease-in-out'
                            onClick={handleSubmit}
                    >
                        Submit Quiz
                    </Button>
                }
            </CardFooter>
            {JSON.stringify(userAnswers)}
        </Card>
    )
}
