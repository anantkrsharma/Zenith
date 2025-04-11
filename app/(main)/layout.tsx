import React from 'react'

const MainRoutesLayout = ({ children }: { children: React.ReactNode}) => {
    //redirect the user after onboarding
    
    return (
        <div className='container mx-auto mt-24 mb-20'>
            {children}
        </div>
    )
}

export default MainRoutesLayout
