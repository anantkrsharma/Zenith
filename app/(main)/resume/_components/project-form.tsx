import { improveWithAI } from '@/actions/resume'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import useFetch from '@/hooks/use-fetch'
import { projectSchema } from '@/lib/form-schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { format, parse } from 'date-fns'
import { Code, ExternalLink, Github, Loader2, PlusCircle, Sparkle, X } from 'lucide-react'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

type ProjectFormProps = {
    entries: any,
    onChange: (...event: any[]) => void
}

const ProjectForm = ({ entries, onChange }: ProjectFormProps) => {
    const [addBtn, setAddBtn] = useState(false);

    const {
        register,
        watch,
        setValue,
        reset,
        handleSubmit: handleValidation,
        formState: {
            errors
        }
    } = useForm({
        resolver: zodResolver(projectSchema),
        defaultValues: {
            title: '',
            description: '',
            skills: '',
            github: '',
            liveLink: '',
            startDate: '',
            endDate: '',
            current: false
        }
    })

    const current = watch('current');

    const {
        data: aiData,
        loading: aiLoading,
        error: aiError,
        fn: aiFunction
    } = useFetch();

    const formatDate  = (dateString: string) => {
        if(!dateString) return '';
        const date = parse(dateString, 'yyyy-MM', new Date());
        return format(date, 'MMM yyyy');
    }

    const handleImproveDescription = async () => {
        const description = watch('description');
        if (!description) {
            toast.error("Project description cannot be empty");
            return;
        }
        try {
            await aiFunction(
                improveWithAI,  
                {
                    type: "Project".toLowerCase(),
                    currentDesc: description, 
                    title: watch('title'),
                    skills: watch('skills') ? watch('skills').split(',').map(skill => skill.trim()) : undefined,
                }
            );
        } catch (error) {
            if(error instanceof Error){
                toast.error(`Error: ${error.message}`);
            }
            else {
                toast.error("Unknown error occurred while improving the project description");
            }
        }
    }

    useEffect(() => {
        if (aiData && !aiLoading) {
            setValue('description', aiData);
            toast.success("Project description improved successfully!");
        }
        if (aiError) {
            if(aiError instanceof Error)
                toast.error(`Error: ${aiError.message}`);
            else
                toast.error(`Unknown error occurred while improving the project description`);
        }
    }, [aiData, aiError, aiLoading]);

    const handleAdd = handleValidation((data) => {
        const formattedData = {
            ...data,
            startDate: formatDate(data.startDate),
            endDate: data.current ? '' : formatDate(data.endDate ?? '')
        }

        // Add the new entry to the existing project-entries of the original resume form
        onChange([...entries, formattedData]);
        reset();
        setAddBtn(false);
    })

    const handleDelete = (index: number) => {
        onChange(entries.filter((_: z.infer<typeof projectSchema>, i: number) => i !== index));
    }
    
    return (
        <div className='space-y-4'>
            { entries.map((entry: z.infer<typeof projectSchema>, index: number) => (
                <Card key={index} className='bg-neutral-800/40 border-none'>
                    <CardHeader className='-mb-2'>
                        <CardTitle className='text-lg space-y-1'>
                            <div className=' flex items-center justify-between'>
                                <div className='flex items-center gap-4'>
                                    <p>{entry.title}</p>

                                    <div className='flex items-center gap-2'>
                                        { entry.github && (
                                            <Link href={entry.github} className='bg-black-950 rounded-md border-y border-neutral-700 flex items-center gap-1 px-2 py-0.5 text-sm text-neutral-300 hover:text-neutral-200 transition-colors duration-150 ease-in-out'>
                                                <Code className='h-4 w-4'/> GitHub
                                            </Link>
                                        )}
                                        { entry.liveLink && (
                                            <Link href={entry.liveLink} className='bg-black-950 rounded-md border-y border-neutral-700 flex items-center gap-1 px-2 py-0.5 text-sm text-neutral-300 hover:text-neutral-200 transition-colors duration-150 ease-in-out'>
                                                <ExternalLink className='h-4 w-4'/> Live
                                            </Link>
                                        )}
                                    </div>
                                </div>
                                <Button
                                    variant={'outline'}
                                    size={'sm'}
                                    className='hover:cursor-pointer hover:border-red-800 hover:bg-red-700/10 transition-all duration-150 ease-in-out'
                                    onClick={() => handleDelete(index)}
                                >
                                    <X className='h-4 w-4'/>
                                </Button>
                            </div>
                            <p className='font-medium text-sm text-neutral-400'>
                                {entry.startDate} - {entry.endDate || 'Present'}
                            </p>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div>
                            <p className='text-sm text-justify'>{entry.description}</p>
                        </div>
                        <div className='flex items-center flex-wrap gap-2 mt-4'>
                            { entry.skills && entry.skills.length > 0 && entry.skills.split(',').map((skill: string, i: number) => (
                                <Badge key={i} variant={'outline'} className='border-cyan-900 bg-cyan-800/10'>
                                    {skill.trim()}
                                </Badge>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            ))}

            {addBtn && (
                <Card className='bg-neutral-800/40 border-none'>
                    <CardContent>
                        <div className='space-y-4'>
                            <div className='grid grid-cols-2 gap-4'>
                                <div className='space-y-2'>
                                    <Input
                                        {...register('title')}
                                        placeholder='Title'
                                        className='bg-black/69'
                                    />
                                    { errors.title &&
                                        <p className='text-sm text-red-500'>{errors.title.message}</p>
                                    }
                                </div>
                                <div className='space-y-2'>
                                    <Input
                                        {...register('skills')}
                                        placeholder='Skills (comma separated)'
                                        className='bg-black/69'
                                    />
                                    { errors.skills &&
                                        <p className='text-sm text-red-500'>{errors.skills.message}</p>
                                    }
                                </div>
                                <div className='space-y-2'>
                                    <Input
                                        {...register('github')}
                                        placeholder='GitHub'
                                        className='bg-black/69'
                                    />
                                    { errors.github &&
                                        <p className='text-sm text-red-500'>{errors.github.message}</p>
                                    }
                                </div>
                                <div className='space-y-2'>
                                    <Input
                                        {...register('liveLink')}
                                        placeholder='Link'
                                        className='bg-black/69'
                                    />
                                    { errors.liveLink &&
                                        <p className='text-sm text-red-500'>{errors.liveLink.message}</p>
                                    }
                                </div>
                            </div>
                            
                            <div className='grid grid-cols-2 gap-4'>
                                <div className='space-y-2'>
                                    <Input
                                        {...register('startDate')}
                                        type="text"
                                        placeholder="Start Date"
                                        onFocus={e => (e.currentTarget.type = 'month')}
                                        onBlur={e => (e.currentTarget.type = 'text')}
                                        className='bg-black/69'
                                    />
                                    { errors.startDate &&
                                        <p className='text-sm text-red-500'>{errors.startDate.message}</p>
                                    }
                                </div>
                                <div className='space-y-2'>
                                    <Input
                                        {...register('endDate')}
                                        type="text"
                                        placeholder={current ? "Present" : "End Date"}
                                        onFocus={e => (e.currentTarget.type = 'month')}
                                        onBlur={e => (e.currentTarget.type = 'text')}
                                        disabled={current}
                                        className='bg-black/69'
                                    />
                                    { errors.endDate && !current &&
                                        <p className='text-sm text-red-500'>{errors.endDate.message}</p>
                                    }
                                </div>
                            </div>

                            <div className='flex items-center space-x-2 hover:cursor-pointer [&>*]:hover:cursor-pointer w-min'>
                                <input
                                    {...register('current')}
                                    id='current'
                                    type='checkbox'
                                    onChange={(e) => {
                                        setValue('current', e.target.checked);
                                        if(e.target.checked)
                                            setValue('endDate', '');
                                    }}
                                    className='bg-black/69'
                                />
                                <Label htmlFor='current'>
                                    Current
                                </Label>
                            </div>

                            <div className='space-y-2'>
                                <Textarea
                                    {...register('description')}
                                    placeholder='Description of your project'
                                    className='h-20 bg-black/69'
                                />
                                
                                <Button 
                                    className='hover:cursor-pointer border hover:border-cyan-800 hover:bg-cyan-500/10 transition-all duration-150 ease-in-out'
                                    variant={'ghost'}
                                    size={'sm'}
                                    onClick={handleImproveDescription}
                                    disabled={aiLoading || !watch('description')}
                                >   { aiLoading ?
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
                                { errors.description &&
                                    <p className='text-sm text-red-500'>{errors.description.message}</p>
                                }
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className='flex items-center justify-end gap-2'>
                        <Button
                            type='button'
                            variant={'outline'}
                            size={'sm'}
                            className='hover:cursor-pointer hover:border-red-800 hover:bg-red-700/10 transition-all duration-150 ease-in-out'
                            onClick={() => {
                                reset();
                                setAddBtn(false);
                            }}
                        >   
                            <X className='h-4 w-4'/>
                            Cancel
                        </Button>
                        <Button
                            type='button'
                            variant={'outline'}
                            size={'sm'}
                            className='hover:cursor-pointer hover:border-neutral-400 transition-all duration-150 ease-in-out'
                            onClick={handleAdd}
                        >
                            <PlusCircle className='h-4 w-4'/>
                            Add Project
                        </Button>
                    </CardFooter>
                </Card>
            )}
            
            {!addBtn && (
                <Button 
                    onClick={() => { setAddBtn(true) }}
                    className='hover:cursor-pointer'
                >   
                    <PlusCircle className='h-4 w-4'/>
                    Add Project
                </Button>
            )}
        </div>
    )
}

export default ProjectForm
