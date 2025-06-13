import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import { Quiz } from '../_components/quiz'

const MockInterviewPage = () => {
    return (
        <div className='container mx-auto py-3 space-y-8 [&>*]:mx-4 md:[&>*]:mx-3'>
            <div className='flex flex-col space-y-3'>
                <Link href={'/interview'}>
                    <Button variant={'link'} className='flex items-center pl-0 gap-2 border hover:bg-neutral-800 hover:cursor-pointer hover:no-underline transition-colors duration-75 ease-in-out'>
                        <ArrowLeft />
                        Back to Interview Page
                    </Button>
                </Link>
                <div>
                    <h1 className="text-5xl gradient-title">Mock Interview</h1>
                    <p className='text-muted-foreground'>
                        Test your skills with industry-specific questions
                    </p>
                </div>
            </div>

            <div className='flex justify-center'>
                <Quiz />
            </div>
        </div>
    )
}

export default MockInterviewPage
