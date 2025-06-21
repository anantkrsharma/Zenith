'use client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Assessment } from '@/lib/generated/client'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'

const QuizList = ({ assessments }: { assessments: Assessment[] }) => {
    const router = useRouter();
    const [selectedQuiz, setSelectedQuiz] = useState(null);

    return (
        <div>
            <Card>
                <CardHeader>
                    <CardTitle>Card Title</CardTitle>
                    <CardDescription>Card Description</CardDescription>
                </CardHeader>
                <CardContent>
                    <p>Card Content</p>
                </CardContent>
                <CardFooter>
                    <p>Card Footer</p>
                </CardFooter>
            </Card>
        </div>
    )
}

export default QuizList
