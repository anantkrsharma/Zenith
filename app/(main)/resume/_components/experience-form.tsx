'use client';

import { improveWithAI } from '@/actions/resume';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import useFetch from '@/hooks/use-fetch';
import { workExpSchema } from '@/lib/form-schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { set } from 'date-fns';
import { Loader2, PlusCircle, Sparkle, X } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner';

type ExperienceFormProps = {
    entries: any,
    onChange: (...event: any[]) => void
}

const ExperienceForm = ({ entries, onChange }: ExperienceFormProps) => {
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
        resolver: zodResolver(workExpSchema),
        defaultValues: {
            title: '',
            organization: '',
            description: '',
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

    const handleImproveDesc = async () => {
        const description = watch('description');
        if (!description) {
            toast.error("Description cannot be empty");
            return;
        }
        
        try {
            await aiFunction(
                improveWithAI,  
                {
                    type: "Work Experience".toLowerCase(),
                    currentDesc: description, 
                    title: watch('title'),
                    organization: watch('organization')
                }
            )
        } catch (error) {
            if(error instanceof Error){
                toast.error(`Error: ${error.message}`);
            }
            else {
                toast.error("An unknown error occurred while improving the description.");
            }
        }
    }

    useEffect(() => {
        if (aiData && !aiLoading) {
            setValue('description', aiData);
            toast.success("Description improved successfully!");
        }
        if (aiError) {
            if(aiError instanceof Error)
                toast.error(`Error: ${aiError.message}`);
            else
                toast.error(`An unknown error occurred while improving the description`);
        }
    }, [aiData, aiError, aiLoading]);

    const handleAdd = () => {
        
    }

    const handleDelete = () => {

    }

    return (
        <div className='py-1 px-1 md:px-2'>
            {addBtn && (
                <Card className='bg-neutral-800/40 border-none'>
                    <CardContent>
                        <div className='space-y-4'>
                            <div className='grid grid-cols-2 gap-4'>
                                <div className='space-y-2'>
                                    <Input
                                        {...register('title')}
                                        placeholder='Title/Positon'
                                        className='bg-black/69'
                                    />
                                    { errors.title &&
                                        <p className='text-sm text-red-500'>{errors.title.message}</p>
                                    }
                                </div>
                                <div className='space-y-2'>
                                    <Input
                                        {...register('organization')}
                                        placeholder='Organization/Company'
                                        className='bg-black/69'
                                    />
                                    { errors.organization &&
                                        <p className='text-sm text-red-500'>{errors.organization.message}</p>
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
                                        placeholder="End Date"
                                        onFocus={e => (e.currentTarget.type = 'month')}
                                        onBlur={e => (e.currentTarget.type = 'text')}
                                        disabled={current}
                                        className='bg-black/69'
                                    />
                                    { errors.endDate &&
                                        <p className='text-sm text-red-500'>{errors.endDate.message}</p>
                                    }
                                </div>
                            </div>

                            <div className='flex items-center space-x-2'>
                                <input
                                    {...register('current')}
                                    id='current'
                                    type='checkbox'
                                    onChange={(e) => {
                                        setValue('current', e.target.checked);
                                        if(e.target.checked)
                                            setValue('endDate', '');
                                    }}
                                    className='hover:cursor-pointer bg-black/69'
                                />
                                <Label htmlFor='current'>
                                    Current
                                </Label>
                            </div>

                            <div className='space-y-2'>
                                <Textarea
                                    {...register('description')}
                                    placeholder='Description of your work experience'
                                    className='h-20 bg-black/69'
                                />
                                <Button 
                                    className='hover:cursor-pointer border hover:border-cyan-800 hover:bg-cyan-500/10 transition-all duration-150 ease-in-out'
                                    variant={'ghost'}
                                    size={'sm'}
                                    onClick={handleImproveDesc}
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
                            Add Experience
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
                    Add Work Experience
                </Button>
            )}
        </div>
    )
}

export default ExperienceForm
