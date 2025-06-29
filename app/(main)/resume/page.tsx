import { getResume } from '@/actions/resume'
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import React from 'react'

const ResumePage = async () => {
    const resume = await getResume();
    
    if(!resume){
        return (
            <div>
                Resume not found
                <Link href={'/resume/edit'}>
                    <Button
                        variant={'outline'}
                        className='bg-zinc-900 border-neutral-700 hover:cursor-pointer hover:bg-neutral-800 hover:border-zinc-500 transition-all duration-75 ease-in-out'
                    >
                        {"Create one ->"}
                    </Button>
                </Link>
            </div>
        )
    }
    
    return (
        <div>
        
        </div>
    )
}

export default ResumePage
