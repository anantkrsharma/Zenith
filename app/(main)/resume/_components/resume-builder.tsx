'use client';

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea';
import useFetch from '@/hooks/use-fetch';
import { resumeSchema } from '@/lib/form-schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Download, Edit, FileWarning, Monitor, Save, TriangleAlert } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import ExperienceForm from './experience-form';
import ProjectForm from './project-form';
import EducationForm from './education-form';
import { saveResume } from '@/actions/resume';

const ResumeBuilder = ({ initialContent }: { initialContent: string }) => {
    const [activeTab, setActiveTab] = useState<string>('form');
    const [toastId, setToastId] = useState<string | number | null>(null);
    const [isEditing, setIsEditing] = useState<boolean>(false);

    useEffect(() => {
        if(initialContent.length > 0)
            setActiveTab('md-preview');
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

    const onSubmit = async (val: resumeFormType) => {
        try {
            await saveResumeFn(saveResume, JSON.stringify(val));
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

    useEffect(() => {
        if(saveResumeLoading && toastId == null){
            const id = toast.loading("Saving the resume...");
            setToastId(id);
        }
        if(!saveResumeLoading && toastId !== null){
            toast.dismiss(toastId);
            setToastId(null)

            if(saveResumeData){
                toast.success("Saved resume successfully");
                setActiveTab("md-preview")
            }
        }
    }, [toastId, saveResumeLoading])

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
                    <TabsTrigger value="md-preview"> Preview </TabsTrigger>
                </TabsList>

                <TabsContent value="form" className='p-1'> 
                    <form 
                        action="submit"
                        className='space-y-6'
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
                            <Controller
                                name='summary'
                                control={control}
                                render={({ field }) => (
                                    <Textarea 
                                        {...field}
                                        id='summary'
                                        className='bg-black/69 h-24'
                                        placeholder='Write an appropriate professional summary'
                                    />
                                )}
                            />
                            {errors.summary &&
                                <p className='text-xs md:text-sm text-red-500'>
                                    {errors.summary.message}
                                </p>
                            }
                        </div>

                        {/* Skills */}
                        <div className='space-y-2'>
                            <Label htmlFor='skills' className='text-lg font-medium'> Skills </Label>
                            <p className="text-sm text-muted-foreground ml-0.5">Separate multiple skills with commas (,)</p>
                            <Controller
                                name='skills'
                                control={control}
                                render={({ field }) => (
                                    <Textarea 
                                        {...field}
                                        id='skills'
                                        className='bg-black/69 h-24'
                                        placeholder='Enter your key skills'
                                    />
                                )}
                            />
                            {errors.skills &&
                                <p className='text-xs md:text-sm text-red-500'>
                                    {errors.skills.message}
                                </p>
                            }
                        </div>
                        
                        {/* Work Experience */}
                        <div className='space-y-2'>
                            <h3 className='text-lg font-medium'> Work Experience </h3>
                            <Controller
                                name='workExp'
                                control={control}
                                render={({ field }) => (
                                    <ExperienceForm 
                                        entries={field.value}
                                        onChange={field.onChange}
                                    />
                                )}
                            />
                            {errors.workExp &&
                                <p className='text-xs md:text-sm text-red-500'>
                                    {errors.workExp.message}
                                </p>
                            }
                        </div>

                        {/* Projects */}
                        <div className='space-y-2'>
                            <h3 className='text-lg font-medium'> Projects </h3>
                            <Controller
                                name='projects'
                                control={control}
                                render={({ field }) => (
                                    <ProjectForm
                                        entries={field.value}
                                        onChange={field.onChange}
                                    />
                                )}
                            />
                            {errors.projects &&
                                <p className='text-xs md:text-sm text-red-500'>
                                    {errors.projects.message}
                                </p>
                            }
                        </div>

                        {/* Education */}
                        <div className='space-y-2'>
                            <h3 className='text-lg font-medium'> Education </h3>
                            <Controller
                                name='education'
                                control={control}
                                render={({ field }) => (
                                    <EducationForm 
                                        entries={field.value}
                                        onChange={field.onChange}
                                    />
                                )}
                            />
                            {errors.education &&
                                <p className='text-xs md:text-sm text-red-500'>
                                    {errors.education.message}
                                </p>
                            }
                        </div>
                    </form> 
                </TabsContent>

                <TabsContent value="md-preview" className='p-1'> 
                    <Button 
                        variant={'outline'} 
                        type='button' 
                        className='mb-2 flex items-center bg-zinc-900 border-neutral-700 hover:cursor-pointer hover:bg-neutral-800 hover:border-zinc-500 transition-all duration-75 ease-in-out'
                        onClick={() => setIsEditing(!isEditing)}
                    >   
                        { isEditing ? 
                            <>
                                <Monitor className='h-4 w-4' />
                                Markdown Preview
                            </>
                            :
                            <>
                                <Edit className='h-4 w-4' />
                                Edit Resume
                            </>
                        }
                    </Button>
                    { isEditing &&
                        <div className='text-sm sm:text-base flex items-center px-2 py-1 rounded-lg text-neutral-300 bg-yellow-700/20 border border-yellow-600/50 w-fit'>
                            <TriangleAlert className='h-4 w-4 mr-1 text-yellow-500' />
                            You will lose the edited markdown if you update the form data
                        </div>
                    }
                </TabsContent>
            </Tabs>
        </div>
    )
}

export default ResumeBuilder
