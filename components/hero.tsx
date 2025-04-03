import Link from 'next/link'
import React from 'react'
import { Button } from './ui/button'
import Image from 'next/image'

const HeroSection = () => {
    return (
        <section className='w-full pt-36 md:pt-48 pb-10'>
            <div className='border border-red-500 text-center'>
                
                <div className='border border-red-500 space-y-6 mx-auto'>
                    <h1>
                        Your AI Career Coach for
                        <br />
                        Professional Success
                    </h1>
                    <p>
                        Advance your career with personalized guidance, interview prep, and AI-powered tools for job success.
                    </p>
                </div>

                <div>
                    <Link href={'/dashboard'}>
                        <Button size={'default'} className='px-8'>
                            Get Started
                        </Button>
                    </Link>
                    <Link href={''}>
                        <Button size={'default'} className='px-8' variant={'outline'}>
                            Watch Demo
                        </Button>
                    </Link>
                </div>

                <div>
                    <div>
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

export default HeroSection
