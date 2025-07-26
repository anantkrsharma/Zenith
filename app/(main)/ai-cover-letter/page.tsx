import React, { Suspense } from 'react'
import NewCovButton from './_components/new-cover-btn'
import CoverLetters from './_components/cover-letters'
import { BarLoader } from 'react-spinners'

const CoverLettersPage = () => {
    return (
        <div className='space-y-4 md:space-y-6'>
            <div className='flex-col md:flex md:flex-row md:items-center md:justify-between border-b py-2 md:py-4 space-y-1 md:space-y-0'>
                <div className='text-4xl md:text-5xl gradient-title'>
                    My Cover Letters
                </div>

                <NewCovButton />
            </div>

            <Suspense fallback={<BarLoader className='mt-3' width={'100%'} color='gray' />}>
                <CoverLetters />
            </Suspense>
        </div>
    )
}

export default CoverLettersPage
