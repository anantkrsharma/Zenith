import { educationSchema } from '@/lib/form-schema'
import { zodResolver } from '@hookform/resolvers/zod'
import React from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

type ProjectFormProps = {
    entries: z.infer<typeof educationSchema>,
    onChange: (...event: any[]) => void
}

const EducationForm = ({ entries, onChange }: ProjectFormProps) => {
    const {
        register,
        watch,
        setValue,
        handleSubmit: handleValidation,
        formState: {
            errors
        }
    } = useForm({
        resolver: zodResolver(educationSchema),
        defaultValues: {
            title: '',
            institute: '',
            description: '',
            startDate: '',
            endDate: '',
            current: false
        }
    })
    
    const watchCurrent = watch('current');

    return (
        <div>
        
        </div>
    )
}

export default EducationForm
