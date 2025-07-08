'use client';

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import useFetch from '@/hooks/use-fetch';
import { workExpSchema } from '@/lib/form-schema'
import { zodResolver } from '@hookform/resolvers/zod'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

type ExperienceFormProps = {
    entries: z.infer<typeof workExpSchema>[],
    onChange: (...event: any[]) => void
}

const ExperienceForm = ({ entries, onChange }: ExperienceFormProps) => {
    const [isAdding, setIsAdding] = useState(false);

    const {
        register,
        watch,
        setValue,
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

    const {
        data: aiData,
        loading: aiLoading,
        error: aiError,
        fn: aiFunction
    } = useFetch();

    return (
        <div className='p-4'>
            <Card>
                <CardHeader>
                    <CardTitle>Work Experience</CardTitle>
                </CardHeader>
                <CardContent>
                    { isAdding &&
                        <div className='grid grid-cols-2 gap-4'>
                            <div className='space-y-2'>
                                <Input
                                    {...register('title')}
                                    placeholder='Enter the job title'
                                />
                                {errors.title &&
                                    <p className='text-xs md:text-sm text-red-500'>
                                        {errors.title.message}
                                    </p>
                                }
                            </div>
                            
                            <div className='space-y-2'>
                                <Input
                                    {...register('organization')}
                                    placeholder='Enter the organization'
                                />
                                {errors.organization &&
                                    <p className='text-xs md:text-sm text-red-500'>
                                        {errors.organization.message}
                                    </p>
                                }
                            </div>
                            
                            <div className='space-y-2'>
                                <Textarea
                                    {...register('description')}
                                    placeholder='Enter the job description'
                                />
                                {errors.description &&
                                    <p className='text-xs md:text-sm text-red-500'>
                                        {errors.description.message}
                                    </p>
                                }
                            </div>

                            <div className='space-y-2'>
                                <Input
                                    type='month'
                                    {...register('startDate')}
                                    placeholder='From'
                                />
                                {errors.startDate &&
                                    <p className='text-xs md:text-sm text-red-500'>
                                        {errors.startDate.message}
                                    </p>
                                }
                            </div>

                            <div className='space-y-2'>
                                <Input
                                    type='month'
                                    {...register('endDate')}
                                    placeholder='To'
                                    disabled={watchCurrent}
                                    onChange={() => {
                                        setValue('current', false);
                                    }}
                                />
                                {errors.endDate &&
                                    <p className='text-xs md:text-sm text-red-500'>
                                        {errors.endDate.message}
                                    </p>
                                }
                            </div>

                            <div className='space-y-2'>
                                <Input
                                    type='checkbox'
                                    {...register('endDate')}
                                    placeholder='Working currently'
                                    onChange={() => {
                                        setValue('endDate', '');
                                    }}
                                />
                                {errors.current &&
                                    <p className='text-xs md:text-sm text-red-500'>
                                        {errors.current.message}
                                    </p>
                                }
                            </div>
                        </div>
                    }

                </CardContent>
                <CardFooter>
                    <p>Card Footer</p>
                </CardFooter>
            </Card>
        </div>
    )
}

export default ExperienceForm
