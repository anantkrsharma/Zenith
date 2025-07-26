'use client';

import { createCoverLetter } from '@/actions/cover-letter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import useFetch from '@/hooks/use-fetch';
import { coverLetterSchema } from '@/lib/form-schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { Controller, useForm } from "react-hook-form";
import { toast } from 'sonner';
import { z } from 'zod';

const NewCover = () => {
    const [toastId, setToastId] = useState<string | number | null>(null);
    const router = useRouter();

    const {
        register,
        watch,
        handleSubmit,
        control,
        formState: {
            errors
        }
    } = useForm({
        resolver: zodResolver(coverLetterSchema),
        defaultValues: {
            jobTitle: "",
            companyName: "",
            jobDescription: ""
        }
    });

    const {
        data: letterData,
        loading: letterLoading,
        error: letterError,
        fn: letterFn
    } = useFetch();

    const onSubmit = async (data: z.infer<typeof coverLetterSchema>) => {
        try {
            await letterFn(createCoverLetter, data);
        } catch (error) {
            if(error instanceof Error){
                toast.error("Error while creating cover letter");
                console.log("Error while creating cover letter" + error.message);
            } else {
                toast.error("Error while creating cover letter");
                console.log("Error while creating cover letter" + error);
            }
        }
    }

    useEffect(() => {
        if(letterLoading && toastId == null){
            const id = toast.loading("Creating cover letter...")
            setToastId(id);
        }
        if(!letterLoading && toastId != null){
            toast.dismiss(toastId);
            setToastId(null);

            if(letterData){
                toast.success("Cover letter created successfully");
                router.push(`/ai-cover-letter/${letterData.id}`)
            }
        }
    }, [toastId, letterLoading, letterData])

    return (
        <div className='space-y-6'>
            <div>
                <Link href={'/ai-cover-letter'}>
                    <Button
                        variant={'outline'}
                        className='flex items-center pl-0 gap-2 border bg-neutral-950 border-zinc-700 hover:bg-black hover:border-zinc-500 hover:cursor-pointer hover:no-underline transition-colors duration-75 ease-in-out'
                        >
                        <ArrowLeft className='w-4 h-4'/>
                        Back
                    </Button>
                </Link>
                <div className='text-4xl md:text-5xl gradient-title border-b py-2 md:py-4'>
                    New Cover Letter
                </div>
            </div>

            <Card className='bg-neutral-800/40 border-none'>
                <CardContent>
                    <form 
                        action="submit"
                        className='space-y-6'
                        onSubmit={handleSubmit(onSubmit)}
                    >   
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                            <div className='space-y-2 flex flex-col'>
                                <Label htmlFor='job-title'>
                                    * Job Title
                                </Label>
                                <Input
                                    {...register('jobTitle')}
                                    id='job-title'
                                    placeholder='e.g. Software Engineer'
                                    className='bg-black/69'
                                />
                                { errors.jobTitle &&
                                    <p className='text-xs sm:text-sm text-red-500'>
                                        {errors.jobTitle.message}
                                    </p>
                                }
                            </div>

                            <div className='space-y-2 flex flex-col'>
                                <Label htmlFor='company-name'>
                                    * Company Name
                                </Label>
                                <Input
                                    {...register('companyName')}
                                    id='company-name'
                                    placeholder='e.g. Google'
                                    className='bg-black/69'
                                />
                                { errors.companyName &&
                                    <p className='text-xs sm:text-sm text-red-500'>
                                        {errors.companyName.message}
                                    </p>
                                }
                            </div>
                        </div>

                        <div className='space-y-2'>
                            <Label htmlFor='job-desc'>
                                Job Description
                            </Label>
                            <Controller
                                control={control}
                                name='jobDescription'
                                render={({ field }) => (
                                    <Textarea
                                        {...field}
                                        id='job-desc'
                                        placeholder='Tell us more about your job role.'
                                        className='h-24 bg-black/69'
                                    />
                                )}
                            />
                            { errors.jobDescription &&
                                    <p className='text-xs sm:text-sm text-red-500'>
                                        {errors.jobDescription.message}
                                    </p>
                                }
                        </div>

                        <Button
                            type='submit'
                            variant={'outline'}
                            size={'lg'}
                            className='text-md flex items-center bg-zinc-950 border-neutral-700 hover:cursor-pointer hover:bg-neutral-900 hover:border-zinc-500 transition-all duration-75 ease-in-out'
                        >   
                            Create 
                            <Sparkles className='w-4 h-4' />
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}

export default NewCover;
