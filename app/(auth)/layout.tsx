import React from 'react'

function layout({ children }: { children: React.ReactNode }): React.ReactNode {
    return (
        <div className='flex justify-center items-center h-screen'>
            {children}
        </div>
    )
}

export default layout
