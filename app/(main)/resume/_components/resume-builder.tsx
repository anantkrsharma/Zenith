'use client';

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea';
import useFetch from '@/hooks/use-fetch';
import { resumeSchema } from '@/lib/form-schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { error } from 'console';
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
                className="space-y-2"
                value={activeTab} 
                onValueChange={(val) => setActiveTab(val)} 
            >
                <TabsList className='[&>*]:hover:cursor-pointer'>
                    <TabsTrigger value="form"> Form </TabsTrigger>
                    <TabsTrigger value="markdown-preview"> Markdown-preview </TabsTrigger>
                </TabsList>

                <TabsContent value="form" className='p-1'> 
                    <form 
                        action="submit"
                        className='space-y-5'
                        onSubmit={handleSubmit(onSubmit)}
                    >   
                        {/* Contact Info */}
                        <div className='space-y-2'>
                            <h3 className='text-lg font-medium'> 
                                Contact Information 
                            </h3>

                            <div className='grid grid-cols-1 md:grid-cols-2 gap-6 p-4 rounded-lg bg-neutral-800/40'>
                                <div className='space-y-2'>
                                    <Label htmlFor='email' className='text-sm'> * Email </Label>
                                    <Input 
                                        {...register('contactInfo.email')}
                                        id='email' 
                                        type='email'
                                        placeholder='example@gmail.com'
                                        className='bg-black/69'
                                    />
                                    {errors.contactInfo?.email && 
                                        <p className='text-xs md:text-sm text-red-500'>
                                            {errors.contactInfo.email.message}
                                        </p>
                                    }
                                </div>

                                <div className='space-y-2'>
                                    <Label htmlFor='mobile' className='text-sm'> Mobile Number </Label>
                                    <Input 
                                        {...register('contactInfo.mobile')}
                                        id='mobile' 
                                        type='tel'
                                        placeholder='XXXXX XXXXX'    
                                        className='bg-black/69'
                                    />
                                    {errors.contactInfo?.mobile && 
                                        <p className='text-xs md:text-sm text-red-500'>
                                            {errors.contactInfo.mobile.message}
                                        </p>
                                    }
                                </div>
                                
                                <div className='space-y-2'>
                                    <Label htmlFor='linkedin' className='text-sm'> LinkedIn </Label>
                                    <Input 
                                        {...register('contactInfo.linkedin')}
                                        id='linkedin' 
                                        type='url'
                                        placeholder='https://www.linkedin.com/in/your-username'
                                        className='bg-black/69'
                                    />
                                    {errors.contactInfo?.linkedin && 
                                        <p className='text-xs md:text-sm text-red-500'>
                                            {errors.contactInfo.linkedin.message}
                                        </p>
                                    }
                                </div>
                                
                                <div className='space-y-2'>
                                    <Label htmlFor='twitter' className='text-sm'> Twitter (X) </Label>
                                    <Input 
                                        {...register('contactInfo.twitter')}
                                        id='twitter' 
                                        type='url'    
                                        placeholder='https://x.com/your-username'
                                        className='bg-black/69'
                                    />
                                    {errors.contactInfo?.twitter && 
                                        <p className='text-xs md:text-sm text-red-500'>
                                            {errors.contactInfo.twitter.message}
                                        </p>
                                    }
                                </div>
                            </div>
                        </div>

                        {/* Professional Summary */}
                        <div className='space-y-2'>
                            <Label htmlFor='summary' className='text-lg font-medium'> Professional Summary </Label>
                            <Textarea 
                                {...register('summary')}
                                id='summary'
                                placeholder={`Hi I'm John Doe and I'm a Software Engineer...`}
                                className='resize-none bg-black/69'
                            />
                        </div>
                    </form> 
                </TabsContent>

                <TabsContent value="markdown-preview" className='p-1'> 
                    MD 
                </TabsContent>
            </Tabs>
        </div>
    )
}

export default ResumeBuilder
