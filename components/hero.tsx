import Link from 'next/link'
import { Button } from './ui/button'
import HeroSectionImage from './heroImage';

const HeroSection = () => {
    return (
        <section className='w-full pt-36 md:pt-48 pb-10'>
            <div className='space-y-6 text-center'>
                    <div className='space-y-6 mx-auto'>
                        <h1 className='gradient-title font-bold text-4xl md:text-6xl lg:text-7xl'>
                            Your AI Career Coach for
                            <br />
                            Professional Success
                        </h1>
                        <p className='mx-auto max-w-[450px] md:max-w-[600px] text-muted-foreground md:text-xl'>
                            Advance your career with personalized guidance, interview prep, and AI-powered tools for job success.
                        </p>
                    </div>

                    <div className='flex justify-center items-center space-x-4'>
                        <Link href={'/dashboard'}>
                            <Button size={'default'} 
                                    variant={'outline'}
                                    className='px-8 bg-zinc-900 border-neutral-700 hover:cursor-pointer hover:bg-neutral-800 hover:border-zinc-500 transition-all duration-75 ease-in-out'>
                                Get Started
                            </Button>
                        </Link>
                        <Link href={''}>
                            <Button size={'default'} 
                                    variant={'outline'}
                                    className='px-8 text-white bg-cyan-950 border-cyan-800 hover:cursor-pointer hover:bg-cyan-900 hover:border-cyan-600 transition-all duration-75 ease-in-out' 
                            >
                                Watch Demo
                            </Button>
                        </Link>
                    </div>

                    <HeroSectionImage />
            </div>
        </section>
    )
}

export default HeroSection;
