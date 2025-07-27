import { Skeleton } from '@/components/ui/skeleton'
import React from 'react'

const CoverLetterSkeleton = () => {
    return (
        <div className='flex items-center justify-center min-h-[70vh] w-full'>
            <div className="flex flex-col items-center justify-center w-full max-w-3xl min-h-[60vh] rounded-xl bg-background p-8 shadow-md">
                <div className="flex flex-col space-y-4 w-full">
                    <Skeleton className="h-[300px] w-full rounded-xl mb-4 animate-pulse bg-zinc-800/60" />
                    <div className="space-y-3 w-full">
                        <Skeleton className="h-6 w-3/4 animate-pulse bg-zinc-800/60" />
                        <Skeleton className="h-6 w-2/3 animate-pulse bg-zinc-800/60" />
                        <Skeleton className="h-6 w-1/2 animate-pulse bg-zinc-800/60" />
                        <Skeleton className="h-6 w-5/6 animate-pulse bg-zinc-800/60" />
                        <Skeleton className="h-6 w-1/3 animate-pulse bg-zinc-800/60" />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CoverLetterSkeleton
