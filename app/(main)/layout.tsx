import React from 'react'

const MainRoutesLayout = ({ children }: { children: React.ReactNode}) => {
    //redirect to onboarding if not onboarded
    
    return (
        <div className='border container mx-auto mt-24 mb-20'>
            main route layout
            {children}
        </div>
    )
}

export default MainRoutesLayout
