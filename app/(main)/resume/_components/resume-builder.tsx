'use client';

import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import useFetch from '@/hooks/use-fetch';
import { resumeSchema } from '@/lib/form-schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Download, Save } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

const ResumeBuilder = ({ initialContent }: { initialContent: string }) => {
    const [activeTab, setActiveTab] = useState<string>('form');
    
    useEffect(() => {
        if(initialContent.length > 0)
            setActiveTab('markdown-preview');
    }, [initialContent]);

    const { 
        control,
        register,
        handleSubmit,
        setValue,
        watch,
        formState: {
            errors
        }
    } = useForm({
        resolver: zodResolver(resumeSchema),
        defaultValues: {
            contactInfo: {},
            summary: "",
            skills: "",
            education: [],
            workExp: [],
            projects: []
        }
    });
    
    const watchForm = watch();
    
    type resumeFormType = z.infer<typeof resumeSchema>

    const {
        data: saveResumeData,
        fn: saveResumeFn,
        loading: saveResumeLoading,
        error: saveResumeError,
    } = useFetch();

    const onSubmit = (val: resumeFormType) => {
        try {
            
        } catch (error) {
            if(error instanceof Error){
                toast.error("Error while saving the resume");
                console.log(error.message);
            }
            else{
                toast.error("Error while saving the resume");
                console.log(error);
            }
        }
    }

    
    return (
        <div className='space-y-4'>
            <div className='flex-col md:flex md:flex-row md:items-center md:justify-between border-b py-2 md:py-4'>
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

            <Tabs 
                className="w-[400px] py-1 md:py-2"
                value={activeTab} 
                onValueChange={(val) => setActiveTab(val)} 
            >
                <TabsList className='[&>*]:hover:cursor-pointer'>
                    <TabsTrigger value="form"> Form </TabsTrigger>
                    <TabsTrigger value="markdown-preview"> Markdown-preview </TabsTrigger>
                </TabsList>
                <TabsContent value="form"> 
                    <form 
                        action="submit"
                        onSubmit={handleSubmit(onSubmit)}
                    >

                    </form>
                </TabsContent>
                <TabsContent value="markdown-preview"> MD </TabsContent>
            </Tabs>
        </div>
    )
}

export default ResumeBuilder
