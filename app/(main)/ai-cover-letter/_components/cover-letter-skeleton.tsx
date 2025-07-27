import { Skeleton } from '@/components/ui/skeleton'
import React from 'react'

const CoverLetterSkeleton = () => {
    return (
        <div className='flex min-h-[70vh] w-full'>
            <div className="w-full rounded-xl bg-background p-8 shadow-md">
                <div className="flex flex-col space-y-4 w-full">
                    <div className="space-y-3 w-full">
                        <Skeleton className="h-6 w-3/4 animate-pulse bg-zinc-800/60" />
                        <Skeleton className="h-6 w-2/3 animate-pulse bg-zinc-800/60" />
                    </div>
                    <Skeleton className="h-[350px] w-full rounded-xl mb-4 animate-pulse bg-zinc-800/60" />
                </div>
            </div>
        </div>
    )
}

export default CoverLetterSkeleton
