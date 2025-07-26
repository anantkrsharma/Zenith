import React, { Suspense } from 'react'
import CoverLetters from './_components/cover-letters'
import { BarLoader } from 'react-spinners'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

const CoverLettersPage = () => {
    return (
        <div className='space-y-4 md:space-y-6'>
            <div className='flex-col md:flex md:flex-row md:items-center md:justify-between border-b py-2 space-y-1 md:space-y-0'>
                <div className='text-4xl md:text-5xl gradient-title'>
                    My Cover Letters
                </div>

                <Link href={'/ai-cover-letter/new'}>
                    <Button 
                        variant={'outline'}
                        className='flex items-center bg-zinc-900 border-neutral-700 hover:cursor-pointer hover:bg-neutral-800 hover:border-zinc-500 transition-all duration-75 ease-in-out'
                        >
                        <Plus className='h-4 w-4'/>
                        Create New
                    </Button>
                </Link>
            </div>

            <Suspense fallback={<BarLoader className='mt-3' width={'100%'} color='gray' />}>
                <CoverLetters />
            </Suspense>
        </div>
    )
}

export default CoverLettersPage
