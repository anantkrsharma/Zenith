import { projectSchema } from '@/lib/form-schema'
import { zodResolver } from '@hookform/resolvers/zod'
import React from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

type ProjectFormProps = {
    entries: z.infer<typeof projectSchema>,
    onChange: (...event: any[]) => void
}

const ProjectForm = ({ entries, onChange }: ProjectFormProps) => {
    const {
        register,
        watch,
        setValue,
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
        <div>
        
        </div>
    )
}

export default ProjectForm
