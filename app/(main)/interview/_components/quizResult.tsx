import { Button } from '@/components/ui/button'
import { CardContent, CardFooter } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { CheckCircle2, Trophy, XCircle } from 'lucide-react'
import React from 'react'

interface QuestionType {
    question: string,
    correctAnswer: string,
    userAnswer: string,
    isCorrect: boolean,
    explanation: string
}

interface SubmitResultType {
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
    startNewQuizFn: () => void
    showNewQuizBtn?: boolean
}

const QuizResult = ({ submitResult, startNewQuizFn, showNewQuizBtn = true }: QuizResultProps) => {
    return (
    <div className="mx-auto">
        <h1 className="flex items-center gap-2 text-3xl gradient-title">
            <Trophy className="h-6 w-6 text-yellow-500" />
            Quiz Results
        </h1>

        <CardContent className="space-y-6">
            {/* Score Overview */}
            <div className="text-center space-y-2">
                <h3 className="text-2xl font-bold">{submitResult.quizScore.toFixed(1)}%</h3>
                <Progress value={submitResult.quizScore} className="w-full" />
            </div>

            {/* Improvement Tip */}
            {submitResult.improvementTip && (
            <div className="bg-muted p-4 rounded-lg">
                <p className="font-medium">Improvement Tip:</p>
                <p className="text-muted-foreground">{submitResult.improvementTip}</p>
            </div>
            )}

            {/* Questions Review */}
            <div className="space-y-4">
                <h3 className="font-medium">Question Review</h3>
                
                {submitResult.questions.map((q, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-2">
                    <div className="flex items-center justify-between gap-2">
                        <p className="font-medium">{q.question}</p>
                        {q.isCorrect ? (
                        <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                        ) : (
                        <XCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                        )}
                    </div>
                    <div className="text-sm text-muted-foreground">
                        <p>Your answer: {q.userAnswer}</p>
                        {!q.isCorrect && <p>Correct answer: {q.correctAnswer}</p>}
                    </div>
                    <div className="text-sm bg-muted p-2 rounded">
                        <p className="font-medium">Explanation:</p>
                        <p>{q.explanation}</p>
                    </div>
                </div>
            ))}
            </div>
        </CardContent>

        {showNewQuizBtn && (
            <CardFooter>
            <Button className="w-full"
                    onClick={startNewQuizFn} 
            >
                Start New Quiz
            </Button>
            </CardFooter>
        )}
    </div>
    );
}

export default QuizResult
