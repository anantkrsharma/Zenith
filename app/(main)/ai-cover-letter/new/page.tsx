'use client';

import { Button } from '@/components/ui/button';
import { coverLetterSchema } from '@/lib/form-schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import React from 'react'
import { useForm } from "react-hook-form";

const NewCover = () => {
    const {
        register,
        setValue,
        watch,
        control,
        formState: {
            errors,
        }
    } = useForm({
        resolver: zodResolver(coverLetterSchema),
        defaultValues: {
            jobTitle: "",
            companyName: "",
            jobDescription: ""
        }
    });

    return (
        <div className='space-y-4'>
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
        </div>
    )
}

export default NewCover
