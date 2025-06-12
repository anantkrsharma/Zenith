import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const MockInterviewPage = () => {
    return (
        <div>
            <Link href={'/interview'}>
                <Button variant={'link'} className='flex items-center pl-0 gap-2 border hover:bg-neutral-800 hover:cursor-pointer hover:no-underline transition-colors duration-100 ease-in-out'>
                    <ArrowLeft />
                    Back to Interview Page
                </Button>
            </Link>
        </div>
    )
}

export default MockInterviewPage
