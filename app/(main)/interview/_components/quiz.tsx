'use client';

import { generateInterviewQuestions, saveInterviewAssessment } from '@/actions/interview';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import useFetch from '@/hooks/use-fetch';
import { ChevronLeft, ChevronRight, CircleCheckBig, Lightbulb, LightbulbOff, Loader2, SquareCheckBig } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { BarLoader } from 'react-spinners';
import { toast } from 'sonner';

export const Quiz = () => {
    const [currentQues, setCurrentQues] = useState<number>(0);
    const [userAnswers, setUserAnswers] = useState<any[]>([]);
    const [showExplanation, setShowExplanation] = useState<boolean>(false);
    
    const [quesLoadingToastId, setQuesLoadingToastId] = useState<string | number | null>(null); //to stop rendering the 'loading' spinner after successful quiz generation
    const [submitLoadingToastId, setSubmitLoadingToastId] = useState<string | number | null>(null); //to stop rendering the 'loading' spinner after successful quiz submission
    
    //question generation hook
    const {
        data: questionsData,
        loading: questionsLoading,
        error: questionsError,
        fn: getQuestions,
    } = useFetch();
    
    //quiz submission hook
    const {
        data: submitData,
        setData: setSubmitData,
        loading: submitLoading,
        error: submitError,
        fn: submitFn,
    } = useFetch();
    
    //generate question (hook fn)
    const handleGenerateQuiz = async () => {
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

    //useEffect for question generation hook fn aftermath and toasters
    useEffect(() => {
        if (questionsLoading && quesLoadingToastId == null) {
            const id = toast.loading("Generating mock interview quiz...");
            setQuesLoadingToastId(id);
        }
        if (!questionsLoading && quesLoadingToastId != null) {
            toast.dismiss(quesLoadingToastId);
            setQuesLoadingToastId(null);

            if (questionsData.length > 0) {
                setUserAnswers(new Array(questionsData.length).fill(null));
                toast.success("Generated mock interview quiz successfully");
            }
        }
    }, [questionsData, questionsLoading]);
    
    const handleChange = (val: string) => {  //fn to fill the radio component option selected by the user in the userAnswer array
        const userAnswersNew = [...userAnswers];
        userAnswersNew[currentQues] = val;
        setUserAnswers(userAnswersNew);
    }
    
    //submit quiz (hook fn)
    const handleSubmit = async () => {
        if(userAnswers.includes(null)){
            toast.error("Attempt each question in the quiz");
            return;
        }
        try {
            let score = 0;
            userAnswers.forEach((userAns, index) => {
                if(userAns === questionsData[index].correctAnswer)
                    score ++;
            });
            const scorePercentage = (score / questionsData.length) * 100;
            
            await submitFn(saveInterviewAssessment, questionsData, userAnswers, scorePercentage);

            if(submitError)
                throw new Error("An unknown error occured while submitting the quiz");
        } catch (error) {
            if(error instanceof Error){
                console.log(error.message);
                toast.error(error.message);
            }
            else{
                toast.error("An unknown error occured while submitting the quiz");
            }
        }
    }

    //useEffect for quiz submission hook fn toasters
    useEffect(() => {
        if (submitLoading && submitLoadingToastId == null) {
            const id = toast.loading("Submitting the quiz...");
            setSubmitLoadingToastId(id);
        }
        if (!submitLoading && submitLoadingToastId != null) {
            toast.dismiss(submitLoadingToastId);
            setSubmitLoadingToastId(null);
            
            if (submitData)
                toast.success("Submitted the quiz successfully");
        }
    }, [submitData, submitLoading]);
    
    //loader while generating the quiz questions
    if(questionsLoading)
        return <BarLoader className='mt-3' width={'100%'} color='gray' />
        
    //'Start the Quiz' component
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
                    <Button variant={'outline'} className='w-fit sm:px-auto sm:w-[50%] md:w-[40%] lg:w-[35%] flex items-center gap-2 bg-zinc-900 border-neutral-700 hover:cursor-pointer hover:bg-neutral-800 hover:border-zinc-500 transition-all duration-75 ease-in-out'
                            onClick={handleGenerateQuiz}
                            disabled={questionsLoading}
                    >
                        {questionsLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Generating the quiz...
                            </>
                        ) : (
                            <>            
                                Start the Quiz
                                <SquareCheckBig />
                            </>
                        )}
                    </Button>
                </CardFooter>
            </Card>
        </div>
        )
    }
    const question = questionsData[currentQues];

    //rendering quiz questions, one by one
    return (
        <Card>
            <CardHeader>
                <CardTitle className='text-muted-foreground'>
                    {`Question ${currentQues + 1} of ${questionsData.length}`}
                </CardTitle>
            </CardHeader>

            <CardContent className='space-y-4 -mt-2'>
                <p className='text-lg font-medium'>{question.question}</p>

                <RadioGroup className='space-y-2'
                            onValueChange={handleChange}
                            value={userAnswers[currentQues]}
                >
                    { question.options.map((option: string, index: number) => (
                        <div key={index} className="flex items-center space-x-2">
                            <RadioGroupItem className='hover:cursor-pointer border-neutral-400 hover:border-neutral-700 transition-colors duration-75 ease-in-out'
                                            value={option} 
                                            id={`option-${index}`}
                            />
                            <Label  className='hover:cursor-pointer'
                                    htmlFor={`option-${index}`}>
                                {option}
                            </Label>
                        </div>
                    ))
                    }
                </RadioGroup>
                <div className='flex items-center justify-center md:justify-start'>
                    { showExplanation ?
                        <Button variant={'outline'} 
                                className='flex items-center justify-center gap-1 bg-zinc-900 border-blue-900 hover:cursor-pointer hover:bg-neutral-800 hover:border-blue-700 transition-all duration-75 ease-in-out'
                                onClick={() => setShowExplanation(false)}>
                            <LightbulbOff />
                            Hide Explanation
                        </Button>
                        : 
                        <Button variant={'outline'} 
                                className='flex items-center justify-center gap-1 bg-zinc-900 border-blue-900 hover:cursor-pointer hover:bg-neutral-800 hover:border-blue-700 transition-all duration-75 ease-in-out'
                                onClick={() => setShowExplanation(true)}
                                disabled={userAnswers[currentQues] == null}
                        >
                            <Lightbulb />
                            Show Explanation
                        </Button>
                    }
                </div>
                { showExplanation &&
                    <div className='mt-2 p-4 space-y-1 rounded-lg bg-neutral-900 border border-zinc-800'>
                        <p className='font-medium'>Explanation:</p>
                        <p className='text-muted-foreground'>{question.explanation}</p>
                    </div>
                }
            </CardContent>

            <CardFooter className='flex items-center justify-center md:justify-start gap-2 md:gap-3 -mt-2'>
                {currentQues > 0 &&
                <Button variant={'outline'} 
                        className='flex items-center justify-center gap-1 bg-zinc-900 border-neutral-700 hover:cursor-pointer hover:bg-neutral-800 hover:border-zinc-500 transition-all duration-75 ease-in-out'
                        onClick={() => {
                            setCurrentQues(prev => prev - 1);
                            setShowExplanation(false);
                        }}
                >
                    <ChevronLeft />
                    Back
                </Button>
                }
                
                {currentQues < questionsData.length - 1 &&
                <Button variant={'outline'} 
                        className='flex items-center justify-center gap-1 bg-zinc-900 border-neutral-700 hover:cursor-pointer hover:bg-neutral-800 hover:border-zinc-500 transition-all duration-75 ease-in-out'
                        onClick={() => {
                            setCurrentQues(prev => prev + 1);
                            setShowExplanation(false);
                        }}
                        disabled={userAnswers[currentQues] == null}
                >
                    Next
                    <ChevronRight />
                </Button>
                }
                
                {currentQues == questionsData.length - 1 &&
                <Button variant={'default'}
                        className='flex items-center justify-center gap-1 text-black font-semibold hover:cursor-pointer hover:bg-zinc-300 transition-all duration-75 ease-in-out'
                        onClick={handleSubmit}
                        disabled={submitLoading}
                >
                    Submit Quiz
                    <CircleCheckBig />
                </Button>
                }
            </CardFooter>
            {JSON.stringify(userAnswers)}
            {JSON.stringify(submitData && submitData?.join("\n\n"))}
        </Card>
    )
}
