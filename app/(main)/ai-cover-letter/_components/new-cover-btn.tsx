'use client';

import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation'
import React from 'react'

const NewCovButton = () => {
    const router = useRouter();

    return (
        <Button 
            variant={'outline'}
            className='flex items-center bg-zinc-900 border-neutral-700 hover:cursor-pointer hover:bg-neutral-800 hover:border-zinc-500 transition-all duration-75 ease-in-out'
            onClick={() => router.push('/ai-cover-letter/new')}
        >
            <Plus className='h-4 w-4'/>
            Create New
        </Button>
    )
}

export default NewCovButton
