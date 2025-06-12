import React, { Suspense } from 'react'
import { BarLoader } from 'react-spinners'

const InterviewLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div>
            <Suspense fallback={<BarLoader className='mt-3' width={'100%'} color='gray' />}>
                {children}
            </Suspense>
        </div>
    )
}

export default InterviewLayout
