import { Button } from '@/components/ui/button'
import { Download, Save } from 'lucide-react'
import React from 'react'

const ResumeBuilder = ({ initialContent }: { initialContent: string }) => {
    

    return (
        <div className='space-y-4'>
            <div className='flex flex-col md:flex-row md:items-center md:justify-between space-y-4'>
                <div className="text-4xl md:text-5xl gradient-title">
                    Resume Builder
                </div>

                <div className='flex items-center space-x-2 md:space-x-4'>
                    <Button 
                        variant={'outline'}
                        className='flex items-center bg-zinc-900 border-neutral-700 hover:cursor-pointer hover:bg-neutral-800 hover:border-zinc-500 transition-all duration-75 ease-in-out'
                        >
                        <Save />
                        Save
                    </Button>
                    
                    <Button 
                        variant={'outline'}
                        className='flex items-center text-white bg-cyan-950 border-cyan-800 hover:cursor-pointer hover:bg-cyan-900 hover:border-cyan-600 transition-all duration-75 ease-in-out'
                        >
                        <Download />
                        Download
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default ResumeBuilder
