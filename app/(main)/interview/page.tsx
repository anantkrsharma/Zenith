import Link from 'next/link'
import React from 'react'

const InterviewPrepPage = () => {
    return (
        <div>
            Interview Page
            <Link href={'/interview/mock'} className='border rounded-lg p-2 ml-6'>
                Mock
            </Link>
        </div>
    )
}

export default InterviewPrepPage
