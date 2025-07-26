'use client';

import { deleteCoverLetter, getCoverLetters } from '@/actions/cover-letter';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import useFetch from '@/hooks/use-fetch'
import { CoverLetter } from '@/lib/generated/client';
import { Loader2, X } from 'lucide-react';
import React, { useEffect } from 'react'
import { toast } from 'sonner';

const CoverLetters = () => {
    //fetch cover letters
    const {
        data: coverLettersData,
        fn: coverLettersFn
    } = useFetch();

    //delete cover letter
    const {
        data: deleteCoverData,
        loading: deleteCoverLoading,
        error: deleteCoverError,
        fn: deleteCoverFn
    } = useFetch();
    
    const fetchCoverLetters = async () => {
        try {
            await coverLettersFn(getCoverLetters);
        } catch (error) {
            if(error instanceof Error){
                toast.error("Error while fetching cover letters");
                console.log("Error while fetching cover letters" + error.message);
            } else {
                toast.error("Error while fetching cover letters");
                console.log("Error while fetching cover letters" + error);
            }
        }
    }

    useEffect(() => {
        fetchCoverLetters();
    }, [])

    const handleDelete = async (id: string) => {
        try {
            await deleteCoverFn(deleteCoverLetter, id);
            toast.success("Deleted cover letter successfully");
        } catch (error) {
            if(error instanceof Error){
                toast.error("Error while deleting the cover letter");
                console.log("Error while deleting the cover letter" + error.message);
            } else {
                toast.error("Error while deleting the cover letter");
                console.log("Error while deleting the cover letter" + error);
            }
        }
    }

    function formatDate(createdAt: string | Date): string {
        const date = new Date(createdAt);
        const options: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        };

        return date.toLocaleDateString('en-IN', options);
    }

    return (
        <div>
            { (coverLettersData && coverLettersData.length > 0) ?
                <div className='space-y-2'>
                    { coverLettersData.map((item: CoverLetter, idx: number) => (
                            <Card
                                key={idx}
                                className='hover:cursor-pointer hover:bg-neutral-900/90'
                            >
                                <CardHeader className='flex items-center justify-between'>
                                    <>
                                        <CardTitle>
                                            {item.jobTitle}
                                            <span className='text-muted-foreground'>at</span>
                                            {item.companyName}
                                        </CardTitle> 
                                        <CardDescription className='text-sm'>
                                            Created on {formatDate(item.createdAt)}
                                        </CardDescription>
                                    </>
                                    <Tooltip>
                                        <TooltipTrigger>
                                                <Button
                                                    variant={'outline'}
                                                    size={'sm'}
                                                    className='hover:cursor-pointer hover:border-red-800 hover:bg-red-700/10 transition-all duration-150 ease-in-out'
                                                    onClick={() => handleDelete(item.id)}
                                                    disabled={deleteCoverLoading}
                                                >
                                                    { deleteCoverLoading ? 
                                                        <Loader2 className='h-4 w-4 animate-spin' />
                                                        :
                                                        <X className='w-4 h-4'/>
                                                    }
                                                </Button>
                                        </TooltipTrigger>

                                        { !deleteCoverLoading &&
                                        <TooltipContent>
                                            <p>Delete</p>
                                        </TooltipContent>}
                                    </Tooltip>
                                </CardHeader>
                            </Card>
                        ))
                    }
                </div>
                :
                <div className='flex items-center justify-center text-muted-foreground'>
                    We could not find any cover letter. Please create a cover letter first.
                </div>
            }
        </div>
    )
}

export default CoverLetters;
