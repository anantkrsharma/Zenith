import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { projectSchema } from '@/lib/form-schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { PlusCircle } from 'lucide-react'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'

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
            github: '',
            liveLink: '',
            startDate: '',
            endDate: '',
            current: false
        }
    })

    const watchCurrent = watch('current');
    
    return (
        <div className='py-1 px-1 md:px-2'>
            {addBtn && (
                <Card className='bg-neutral-800/40 border-none'>
                    <CardContent>
                        <div className='space-y-4'>
                            <div className='grid grid-cols-2 gap-4'>
                                <div className='space-y-2 col-span-2'>
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
                                        placeholder="End Date"
                                        onFocus={e => (e.currentTarget.type = 'month')}
                                        onBlur={e => (e.currentTarget.type = 'text')}
                                        disabled={watchCurrent}
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
                                    className='hover:cursor-pointer bg-black/69`'
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
                                { errors.description &&
                                    <p className='text-sm text-red-500'>{errors.description.message}</p>
                                }
                            </div>
                        </div>
                    </CardContent>
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
