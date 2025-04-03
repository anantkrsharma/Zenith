'use client';

import Link from 'next/link'
import React, { useEffect, useRef } from 'react'
import { Button } from './ui/button'
import Image from 'next/image'

const HeroSection = () => {
    const imageRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const imageElement = imageRef.current;
        
        const handleScroll = () => {
            const scrollPosition = window.scrollY;
            const scrollThreshold = 100;
            if(scrollPosition > scrollThreshold) {
                imageElement && imageElement.classList.add('scrolled');
            }
            else{
                imageElement && imageElement.classList.remove('scrolled');
            }
        }

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        }
    }, [])

    return (
        <section className='w-full pt-36 md:pt-48 pb-10'>
            <div className='space-y-6 text-center'>
                
                <div className='space-y-6 mx-auto'>
                    <h1 className='gradient-title font-bold text-5xl md:text-6xl lg:text-7xl xl:text-8xl'>
                        Your AI Career Coach for
                        <br />
                        Professional Success
                    </h1>
                    <p className='mx-auto max-w-[600px] text-muted-foreground md:text-xl'>
                        Advance your career with personalized guidance, interview prep, and AI-powered tools for job success.
                    </p>
                </div>

                <div className='flex justify-center items-center space-x-4'>
                    <Link href={'/dashboard'}>
                        <Button size={'default'} className='px-8'>
                            Get Started
                        </Button>
                    </Link>
                    <Link href={''}>
                        <Button size={'default'} className='px-8 border border-blue-500' variant={'outline'}>
                            Watch Demo
                        </Button>
                    </Link>
                </div>

                <div className='mt-5 md:mt-0 hero-image-wrapper'>
                    <div ref={imageRef} className='hero-image'>
                        <Image 
                            src={'/Banner_1.jpeg'}
                            alt='Banner Image'
                            width={1280}
                            height={720}
                            className='rounded-lg shadow-2xl border mx-auto'
                            priority={true}
                        />    
                    </div>
                </div>

            </div>
        </section>
    )
}

export default HeroSection;
