import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { Quiz } from '../_components/quiz'

const MockInterviewPage = () => {
    return (
        <div className='container mx-auto py-3 space-y-8 [&>*]:mx-5 md:[&>*]:mx-3'>
            <div className='flex flex-col space-y-2 md:space-y-3.5 mx-3'>
                <Link href={'/interview'} className='w-fit'>
                    <Button variant={'secondary'} className='flex items-center pl-0 gap-2 border hover:bg-neutral-950 hover:cursor-pointer hover:no-underline transition-colors duration-75 ease-in-out'>
                        <ArrowLeft />
                        Back to Interview Page
                    </Button>
                </Link>
                <div>
                    <h1 className="text-5xl gradient-title">Mock Interview</h1>
                    <p className='text-muted-foreground'>
                        Test your skills with industry-specific questions!
                    </p>
                </div>
            </div>            
            
            <Quiz />
        </div>
    )
}

export default MockInterviewPage
