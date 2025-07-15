'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { workExpSchema } from '@/lib/form-schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { PlusCircle } from 'lucide-react';
import React, { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'

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

    const watchCurrent = watch('current');

    return (
        <div className='p-4'>
            {addBtn && (
                <Card>
                    <CardHeader>
                        <CardTitle>Add Work Experience</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className='space-y-4'>
                            <div className='grid grid-cols-2 gap-4'>
                                <div className='space-y-2'>
                                    <Input
                                        {...register('title')}
                                        placeholder='Title/Positon'
                                    />
                                    { errors.title &&
                                        <p className='text-sm text-red-500'>{errors.title.message}</p>
                                    }
                                </div>
                                <div className='space-y-2'>
                                    <Input
                                        {...register('organization')}
                                        placeholder='Organization/Company'
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
                                        disabled={watchCurrent}
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
                                    className='hover:cursor-pointer'
                                />
                                <Label htmlFor='current'>
                                    Current
                                </Label>
                            </div>

                            <div className='space-y-2'>
                                <Textarea
                                    {...register('description')}
                                    placeholder='Description of your Work Experience'
                                    className='h-20'
                                />
                                { errors.description &&
                                    <p className='text-sm text-red-500'>{errors.description.message}</p>
                                }
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <p>Card Footer</p>
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
