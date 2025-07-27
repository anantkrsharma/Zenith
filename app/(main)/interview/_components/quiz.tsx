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
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import QuizResult from './quiz-result';

export const Quiz = () => {
    const [currentQues, setCurrentQues] = useState<number>(0);
    const [userAnswers, setUserAnswers] = useState<(string | null)[]>([]);
    const [showExplanation, setShowExplanation] = useState<boolean>(false);
    const [disableQuizOptn, setDisableQuizOptn] = useState<boolean>(false);
    
    const [quesLoadingToastId, setQuesLoadingToastId] = useState<string | number | null>(null); //to stop rendering the 'loading' spinner after successful quiz generation
    const [submitLoadingToastId, setSubmitLoadingToastId] = useState<string | number | null>(null); //to stop rendering the 'loading' spinner after successful quiz submission
    
    //question generation hook
    const {
        data: questionsData,
        setData: setQuestionsData,
        loading: questionsLoading,
        error: questionsError,
        fn: questionsFn,
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
            await questionsFn(generateInterviewQuestions);

            if(questionsError)
                throw new Error("An unknown error occured while generating mock interview quiz questions");
        } catch (error) {
            if(error instanceof Error){
                console.log(error.message);
                toast.error("Error while generating quiz questions");
            }
            else{
                toast.error("An unknown error occured while quiz questions");
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

            if(questionsData.length > 0) {
                setUserAnswers(new Array(questionsData.length).fill(null));
                toast.success("Generated mock interview quiz successfully");
            }
        }
    }, [questionsData, questionsLoading, quesLoadingToastId]);
    
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
                toast.error("Error while submitting the quiz");
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
            
            if(submitData)
                toast.success("Submitted the quiz successfully");
        }
    }, [submitData, submitLoading, submitLoadingToastId]);
    
    const startNewQuiz = () => { //function to clear all state variables, or to set them to null. Called when the user clicks to start a new quiz
        setCurrentQues(0);
        setUserAnswers([]);
        setQuestionsData(null);
        setShowExplanation(false);
        setDisableQuizOptn(false);
        setSubmitData(null);
        //new quiz questions
        questionsFn(generateInterviewQuestions);
    }
    
    // Animation variants
    const fadeSlide = {
        initial: { opacity: 0, y: 40 },
        animate: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.4, 0, 0.2, 1] } },
        exit: { opacity: 0, y: -40, transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] } }
    };

    return (
        <AnimatePresence mode="wait">
            {/* Quiz Result */}
            {submitData && (
                <motion.div
                    key="quiz-result"
                    variants={fadeSlide}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                >
                    <QuizResult submitResult={submitData} startNewQuizFn={startNewQuiz}/>
                </motion.div>
            )}

            {/* Loader */}
            {questionsLoading && !submitData && (
                <motion.div
                    key="quiz-loading"
                    variants={fadeSlide}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                >
                    <BarLoader className='mt-3' width={'100%'} color='gray' />
                </motion.div>
            )}

            {/* Start the Quiz */}
            {!questionsData && !questionsLoading && !submitData && (
                <motion.div
                    key="quiz-start"
                    variants={fadeSlide}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                >
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
                </motion.div>
            )}

            {/* Quiz Questions */}
            {questionsData && !submitData && !questionsLoading && (
                <motion.div
                    key={`quiz-question-${currentQues}`}
                    variants={fadeSlide}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                >
                    <Card>
                        <CardHeader>
                            <CardTitle className='text-muted-foreground'>
                                {`Question ${currentQues + 1} of ${questionsData.length}`}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className='space-y-4 -mt-2'>
                            <p className='text-lg font-medium'>{questionsData[currentQues].question}</p>
                            <RadioGroup className='space-y-2'
                                        onValueChange={handleChange}
                                        value={userAnswers[currentQues]}
                            >
                                { questionsData[currentQues].options.map((option: string, index: number) => (
                                    <div key={index} className="flex items-center space-x-2">
                                        <RadioGroupItem className='hover:cursor-pointer border-neutral-400 hover:border-neutral-700 transition-colors duration-75 ease-in-out'
                                                        value={option} 
                                                        id={`option-${index}`}
                                                        disabled={disableQuizOptn}
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
                                            className='flex items-center justify-center gap-1 bg-zinc-900 border-cyan-900 hover:cursor-pointer hover:bg-neutral-800 hover:border-cyan-800 transition-all duration-75 ease-in-out'
                                            onClick={() => {
                                                setShowExplanation(true)
                                                setDisableQuizOptn(true)
                                            }}
                                            disabled={userAnswers[currentQues] == null}
                                    >
                                        <Lightbulb />
                                        Show Explanation
                                    </Button>
                                }
                            </div>
                            { showExplanation &&
                                <motion.div
                                    key={`explanation-${currentQues}`}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0, transition: { duration: 0.35 } }}
                                    exit={{ opacity: 0, y: -20, transition: { duration: 0.2 } }}
                                    className='mt-2 p-4 space-y-1 rounded-lg bg-neutral-900 border border-zinc-800'
                                >
                                    <p className='font-medium'>Explanation:</p>
                                    <p className='text-muted-foreground'>{questionsData[currentQues].explanation}</p>
                                </motion.div>
                            }
                        </CardContent>
                        <CardFooter className='flex items-center justify-center md:justify-start gap-2 md:gap-3 -mt-2'>
                            {currentQues > 0 &&
                            <Button variant={'outline'} 
                                    className='flex items-center justify-center gap-1 bg-zinc-900 border-neutral-700 hover:cursor-pointer hover:bg-neutral-800 hover:border-zinc-500 transition-all duration-75 ease-in-out'
                                    onClick={() => {
                                        setCurrentQues(prev => prev - 1);
                                        setShowExplanation(false);
                                        setDisableQuizOptn(true);
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
                                        setDisableQuizOptn(false);
                                    }}
                                    disabled={userAnswers[currentQues] == null}
                            >
                                Next
                                <ChevronRight />
                            </Button>
                            }
                            {currentQues == questionsData.length - 1 &&
                            <Button variant={'outline'}
                                    className='flex items-center justify-center gap-1 text-white bg-cyan-950 border-cyan-800 hover:cursor-pointer hover:bg-cyan-900 hover:border-cyan-600 transition-all duration-75 ease-in-out'
                                    onClick={handleSubmit}
                                    disabled={submitLoading}
                            >
                                Submit Quiz
                                <CircleCheckBig />
                            </Button>
                            }
                        </CardFooter>
                    </Card>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
