import { Button } from '@/components/ui/button'
import { CardContent, CardFooter } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { CheckCircle2, Trophy, XCircle } from 'lucide-react'
import React from 'react'

export interface QuestionType {
    question: string,
    correctAnswer: string,
    userAnswer: string,
    isCorrect: boolean,
    explanation: string
}

export interface SubmitResultType {
    id: string;
    quizScore: number;
    questions: QuestionType[];
    category: string;
    improvementTip: string | null;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
}

interface QuizResultProps {
    submitResult: SubmitResultType
    startNewQuizFn?: () => void
    showNewQuizBtn?: boolean
}

const QuizResult = ({ submitResult, startNewQuizFn, showNewQuizBtn = true }: QuizResultProps) => {
    return (
    <div className="mx-auto space-y-7">
        <h1 className="flex items-center justify-center md:justify-start gap-2 text-2xl md:text-4xl gradient-title">
            <Trophy className="h-6 w-6 text-yellow-500" />
            Quiz Results
        </h1>

        <CardContent className="space-y-6 border-t pt-5">
            {/* Score Overview */}
            <div className="text-center space-y-2">
                <h3 className="text-2xl font-bold">{submitResult.quizScore.toFixed(1)}%</h3>
                <div className='w-full flex justify-center'>
                    <>
                        <Progress value={submitResult.quizScore} className="w-[60%] lg:w-[40%]" />
                    </>
                </div>
            </div>

            {/* Improvement Tip */}
            {submitResult.improvementTip && (
            <div className="bg-neutral-800/65 p-3 rounded-lg space-y-2">
                <p className="font-medium">Improvement Tip:</p>
                <p className="text-muted-foreground">{submitResult.improvementTip}</p>
            </div>
            )}

            {/* Questions Review */}
            <div className="space-y-6">
                <h3 className="text-base text-center md:text-start md:text-lg font-medium">Question Review</h3>
                
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    {submitResult.questions.map((q, index) => (
                    <div key={index} className="flex flex-col justify-between border border-neutral-700 rounded-lg p-4 space-y-3">
                        <div className='space-y-2'>
                            <div className="flex items-center justify-between gap-2">
                                <p className="font-medium">{`Q${index + 1}: ${q.question}`}</p>
                                {q.isCorrect ? (
                                <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                                ) : (
                                <XCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                                )}
                            </div>
                            <div className="text-sm">
                                <p>Your answer: 
                                    <span className='text-muted-foreground'> {q.userAnswer}</span>
                                </p>
                                {!q.isCorrect && <p>Correct answer: 
                                    <span className='text-muted-foreground'> {q.correctAnswer}</span>
                                </p>}
                            </div>
                        </div>
                        <div className="text-sm bg-neutral-800/70 p-[10px] rounded-md">
                            <p className="font-medium">Explanation:</p>
                            <p className='text-muted-foreground'>{q.explanation}</p>
                        </div>
                    </div>
                    ))}
                </div>
            </div>
        </CardContent>

        {showNewQuizBtn && (
            <CardFooter>
                <div className='w-full flex justify-center'>
                    <Button className="w-[50%] lg:w-[35%] flex items-center gap-2 text-white bg-zinc-800 border-neutral-600 hover:cursor-pointer hover:bg-neutral-700 hover:border-zinc-400 transition-all duration-75 ease-in-out"
                            variant={'outline'}
                            onClick={startNewQuizFn} 
                    >
                        Start New Quiz
                    </Button>
                </div>
            </CardFooter>
        )}
    </div>
    );
}

export default QuizResult
