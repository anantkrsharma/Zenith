'use client';

import { Button } from '@/components/ui/button'
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea';
import useFetch from '@/hooks/use-fetch';
import { resumeSchema } from '@/lib/form-schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Download, Edit, Loader2, Monitor, Save, Sparkle, TriangleAlert } from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import ExperienceForm from './experience-form';
import ProjectForm from './project-form';
import EducationForm from './education-form';
import { generateAiSummary, saveResume } from '@/actions/resume';
import MDEditor from '@uiw/react-md-editor';
import rehypeSanitize from "rehype-sanitize";
import rehypeRaw from "rehype-raw";
import { contactToMarkdown, workExpToMarkdown, projectsToMarkdown, educationToMarkdown } from '@/lib/toMarkdown';
import { useUser } from '@clerk/nextjs';

const ResumeBuilder = ({ initialContent }: { initialContent: string }) => {
    const [activeTab, setActiveTab] = useState<string>('form');
    const [toastId, setToastId] = useState<string | number | null>(null);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [previewContent, setPreviewContent] = useState<string>(initialContent);
    const [isDownloading, setIsDownloading] = useState<boolean>(false);
    const { user } = useUser();
    const pdfLib = useRef<any>(null);
    
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

    const formValues = watch();

    //save resume data
    const {
        data: saveResumeData,
        fn: saveResumeFn,
        loading: saveResumeLoading,
        error: saveResumeError,
    } = useFetch();
    
    //generate AI Professional Summary
    const {
        data: aiSummaryData,
        fn: aiSummaryFn,
        loading: aiSummaryLoading,
        error: aiSummaryError,
    } = useFetch();

    const getMarkdownContent = () => {
        const { contactInfo, skills, summary, workExp, projects, education } = formValues;
        return [
            contactToMarkdown(user?.fullName || '' ,contactInfo),
            summary && `## Professional Summary\n\n${summary}`,
            skills && `## Skills\n\n${skills}`,
            workExp && workExpToMarkdown(
                workExp.map((exp: any) => ({
                    ...exp,
                    current: exp.current ?? false,
                }))
            ),
            projects && projectsToMarkdown(
                projects.map((proj: any) => ({
                    ...proj,
                    current: proj.current ?? false,
                }))
            ),
            education && educationToMarkdown(
                education.map((edu: any) => ({
                    ...edu,
                    current: edu.current ?? false,
                }))
            ),
        ]
        .filter(Boolean)
        .join('\n\n');
    }

    useEffect(() => {
        // Check if all form fields are empty
        const isFormEmpty = () => {
            const { contactInfo, summary, skills, education, workExp, projects } = formValues || {};
            const isContactEmpty = !contactInfo || Object.values(contactInfo).every(v => !v);
            const isSummaryEmpty = !summary;
            const isSkillsEmpty = !skills;
            const isEducationEmpty = !education || education.length === 0;
            const isWorkExpEmpty = !workExp || workExp.length === 0;
            const isProjectsEmpty = !projects || projects.length === 0;
            return isContactEmpty && isSummaryEmpty && isSkillsEmpty && isEducationEmpty && isWorkExpEmpty && isProjectsEmpty;
        };

        // Only update previewContent from form if not editing markdown directly
        if (!isEditing) {
            if (initialContent && isFormEmpty()) {
                setPreviewContent(initialContent);
            } else {
                setPreviewContent(getMarkdownContent());
            }
        }
    }, [initialContent, formValues, isEditing]);

    const handleAiSummary = async () => {
        const { summary, skills, workExp, projects, education } = formValues;
        if(!skills || skills.length === 0){
            toast.error("Please enter your skills before generating AI Professional Summary");
            return;
        }
        try {
            await aiSummaryFn(generateAiSummary, {
                summary: summary,
                skills: skills,
                workExp: workExp?.map((item: any) => JSON.stringify(item)),
                projects: projects?.map((item: any) => JSON.stringify(item)),
                education: education?.map((item: any) => JSON.stringify(item)),
            });
        } catch (error) {
            if(error instanceof Error){
                toast.error("Error while generating AI Professional Summary");
                console.log(error.message);
            }
            else{
                toast.error("Error while generating AI Professional Summary");
                console.log(error);
            }
        }
    }

    // Update summary field when aiSummaryData changes
    useEffect(() => {
        if (typeof aiSummaryData === 'string' && aiSummaryData.length > 0) {
            setValue('summary', aiSummaryData, { shouldDirty: true });
            toast.success("AI Professional Summary generated successfully");
        }
    }, [aiSummaryData, setValue]);

    const onSubmit = async () => {
        try {
            await saveResumeFn(saveResume, previewContent);
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

    useEffect(() => {
        import('html2pdf.js/dist/html2pdf.min.js')
        .then(mod => {
            pdfLib.current = mod.default;
        })
        .catch(err => {
            console.error('Failed to load html2pdf.js:', err);
        });
    }, []);

    const generatePDF = async () => {
        if (!pdfLib.current) {
            console.warn('PDF library not loaded yet');
            return;
        }
        setIsDownloading(true);
        try {
            const element = document.getElementById('resume-pdf');

            const opt = {
                margin: [0, 10],
                filename: `${user?.fullName} Resume.pdf`,
                image: { type: 'jpeg', quality: 1 },
                html2canvas: { scale: 2 },
                jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
            };

            await pdfLib.current().set(opt).from(element).save();

            toast.success('PDF generated successfully');
        } catch (error) {
            if (error instanceof Error) {
                console.log(error.message);
                toast.error('PDF generation error');
            } else {
                console.error('Unexpected error:', error);
                toast.error('PDF generation error');
            }
        } finally {
            setIsDownloading(false);
        }
    };

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
                        onClick={
                            activeTab === 'form'
                                ? handleSubmit(onSubmit)
                                : onSubmit
                        }
                        disabled={saveResumeLoading}
                    >
                        { saveResumeLoading ?
                            <>
                                <Loader2 className='h-4 w-4 animate-spin' />
                                Saving...
                            </>
                            :
                            <>
                                <Save />
                                Save
                            </>
                        }
                    </Button>
                    
                    <Button 
                        variant={'outline'}
                        className='flex items-center text-white bg-cyan-950 border-cyan-800 hover:cursor-pointer hover:bg-cyan-900 hover:border-cyan-600 transition-all duration-75 ease-in-out'
                        disabled={isDownloading}
                        onClick={generatePDF}
                    >   
                        { isDownloading ?
                            <>
                                <Loader2 className='h-4 w-4 animate-spin' />
                                Generating PDF...
                            </>
                            :
                            <>
                                <Download />
                                Download PDF
                            </>
                        }
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
                    <form className='space-y-6'>   
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
                                        type='text'
                                        placeholder='+1 234 567 8900'    
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
                            <Button 
                                variant={'ghost'}
                                className='hover:cursor-pointer border hover:border-cyan-800 hover:bg-cyan-500/10 transition-all duration-150 ease-in-out'
                                onClick={handleAiSummary}
                                size={'sm'}
                                disabled={aiSummaryLoading || !formValues.summary}
                            >
                                { aiSummaryLoading ?
                                    <>
                                        <Loader2 className='animate-spin h-4 w-4' />
                                        <p className='text-sm'>Improving...</p>
                                    </>
                                    : 
                                    <>
                                        <Sparkle className='h-4 w-4'/>
                                        <p className='text-sm'>
                                            Improve with AI
                                        </p>
                                    </>
                                }
                            </Button>
                        </div>

                        {/* Skills */}
                        <div className='space-y-2'>
                            <Label htmlFor='skills' className='text-lg font-medium'> * Skills </Label>
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
                    { (initialContent || previewContent.trim().replace(/^\n+|\n+$/g, '').length > 0) ?
                        <>
                            <Button 
                                variant={'outline'} 
                                type='button' 
                                className='mb-2 flex items-center bg-black border-neutral-700 hover:cursor-pointer hover:bg-neutral-900 hover:border-zinc-500 transition-all duration-75 ease-in-out'
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
                            <AnimatePresence>
                                {isEditing && (
                                    <motion.div
                                        className='flex items-center justify-center mb-2'
                                        initial={{ opacity: 0, y: -20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                                    >
                                        <div className='w-full flex items-center justify-center px-2 py-1.5 my-1 rounded-md text-neutral-300 bg-yellow-700/15 border-r border-b border-yellow-600/55 '>
                                            <TriangleAlert className='h-5 w-5 mr-2 text-yellow-500' />
                                            <p className='text-sm md:text-base'>
                                                You will lose the edited markdown if you update the form data
                                            </p>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                            }
                            
                            <div className="container">
                                <MDEditor
                                    value={previewContent}
                                    onChange={(val) => setPreviewContent(val || '')}
                                    previewOptions={{
                                        rehypePlugins: [[rehypeRaw], [rehypeSanitize]],
                                    }}
                                    height={800}
                                    style={{borderRadius: '0.5rem', overflow: 'hidden'}}
                                    preview={
                                        isEditing
                                            ? (typeof window !== 'undefined' && window.matchMedia('(min-width: 768px)').matches
                                                ? 'live'
                                                : 'edit')
                                            : 'preview'
                                    }
                                />
                            </div>
                        </>
                        : 
                        <>
                            <div className='flex items-center justify-center h-full'>
                                <p className='text-lg text-neutral-500'>No content to preview, please enter your resume details</p>
                            </div>
                        </>
                    }
                </TabsContent>
                <div className='hidden'>
                    <div id='resume-pdf'>
                        <MDEditor.Markdown
                            source={previewContent}
                            style={{ background: 'white', color: 'black' }}
                        />
                    </div>
                </div>
            </Tabs>
        </div>
        )
}

export default ResumeBuilder
