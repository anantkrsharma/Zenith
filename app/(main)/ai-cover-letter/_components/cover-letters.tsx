'use client'

import React, { useState } from 'react';
import { deleteCoverLetter } from '@/actions/cover-letter';
import {
    AlertDialog,
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogCancel,
    AlertDialogAction,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { Eye, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';
import { CoverLetter } from '@/lib/generated/client';
import { toast } from 'sonner';
import {
    Card, CardHeader, CardTitle, CardDescription, CardContent,
} from '@/components/ui/card';
import { useRouter } from 'next/navigation';

const CoverLetterCards = ({ coverLettersData }: { coverLettersData: CoverLetter[] }) => {
    const router = useRouter();
    
    const handleDelete = async (id: string) => {
        try {
            await deleteCoverLetter(id);
            toast.success('Deleted cover letter successfully');
            router.refresh();
        } catch (error) {
            if(error instanceof Error){
                toast.error(error.message || 'Error while deleting the cover letter');
                console.log("Error while deleting the cover letter" + error.message);
            } else {
                toast.error("Error while deleting the cover letter");
                console.log("Error while deleting the cover letter" + error);
            }
        }
    };

    return (
        <div className="w-full">
            {coverLettersData?.length ? (
                <div className="space-y-4">
                { coverLettersData.map((letter) => {
                    const [open, setOpen] = useState(false);

                    return (
                        <Card key={letter.id} className="group relative bg-neutral-900/70">
                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <div>
                                    <CardTitle className="text-xl gradient-title">
                                        {letter.jobTitle}{' '}
                                        <span className="font-medium text-muted-foreground/50 mx-0.5">
                                        at
                                        </span>{' '}
                                        {letter.companyName}
                                    </CardTitle>
                                    <CardDescription>
                                        Created {format(new Date(letter.createdAt), 'PPP')}
                                    </CardDescription>
                                    </div>
                                    <div className="flex space-x-2">
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Link href={`/ai-cover-letter/${letter.id}`}>
                                                    <Button
                                                        variant="outline"
                                                        size="icon"
                                                        className="hover:cursor-pointer flex items-center border bg-neutral-950 border-zinc-700 hover:bg-neutral-900 hover:border-zinc-500 transition-colors duration-75 ease-in-out"
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                            <p>View</p>
                                            </TooltipContent>
                                        </Tooltip>

                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    onClick={() => setOpen(true)}
                                                    className="hover:cursor-pointer border-zinc-700 hover:border-red-800 hover:bg-red-700/20 transition-all duration-150 ease-in-out"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>Delete</p>
                                            </TooltipContent>
                                        </Tooltip>

                                        <AlertDialog open={open} onOpenChange={setOpen}>
                                            <AlertDialogTrigger asChild>
                                            {/*dummy trigger*/}
                                            <span />
                                            </AlertDialogTrigger>
                                            <AlertDialogContent onOpenAutoFocus={(e) => e.preventDefault()}>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Delete Cover Letter?</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                This action cannot be undone. Permanently delete your cover letter for{' '}
                                                {letter.jobTitle} at {letter.companyName}.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel 
                                                    onClick={() => setOpen(false)}
                                                    className='hover:cursor-pointer'
                                                >
                                                    Cancel
                                                </AlertDialogCancel>
                                                <AlertDialogAction
                                                    onClick={() => {
                                                        handleDelete(letter.id);
                                                        setOpen(false);
                                                    }}
                                                    className="hover:cursor-pointer text-white bg-red-800 hover:bg-red-950 transition-all duration-150 ease-in-out"
                                                >
                                                    Delete
                                                </AlertDialogAction>
                                            </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                            <div className="text-muted-foreground text-sm line-clamp-3">
                                {letter.jobDescription}
                            </div>
                            </CardContent>
                        </Card>
                        );
                    })
                }
                </div>
            ) : (
                <div className="flex flex-col justify-center min-h-[70vh]">
                    <div className="flex items-center justify-center text-muted-foreground">
                        We could not find any cover letter. Please create one first.
                    </div>
                </div>
            )}
        </div>
    );
};

export default CoverLetterCards;
