import React, { Suspense } from 'react'
import { BarLoader } from 'react-spinners';

const Layout = ({children}: {children: React.ReactNode}) => {
    return (
        <div>
            <div className="flex items-center justify-between mb-5">
                <h1 className="text-4xl md:text-5xl gradient-title">Industry Insights</h1>
            </div>

            <Suspense fallback={<BarLoader className='mt-3' width={'100%'} color='gray' />}>
                {children}
            </Suspense>
        </div>
    )
}

export default Layout
