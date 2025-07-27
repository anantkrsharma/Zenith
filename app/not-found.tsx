import { Button } from '@/components/ui/button'
import Link from 'next/link'
import React from 'react'

const NotFoundPage = () => {
    return (
        <div className='flex flex-col items-center justify-center h-screen gap-4'>    
            <h1 className='text-4xl md:text-5xl lg:text-6xl gradient-title font-extrabold'>404</h1>
            <p className='text-lg md:text-xl font-bold'>Page Not Found</p>
            <p className='text-muted-foreground mb-8'>Oops! the page you&apos;re looking for doesn&apos;t exist or has been moved.</p>
            <Link href={'/'}>
                <Button className='hover:cursor-pointer transition-all duration-150 border border-zinc-500' variant='default'>
                    Return to Home
                </Button>
            </Link>
        </div>
    )
}

export default NotFoundPage
