'use client';

import Image from 'next/image'
import React, { useEffect, useRef } from 'react'

const HeroSectionImage = () => {
    const imageRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const imageElement = imageRef.current;
        
        const handleScroll = () => {
            const scrollPosition = window.scrollY;
            const scrollThreshold = 400;
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
        <div className='mt-5 md:mt-0 hero-image-wrapper'>
            <div ref={imageRef} className='hero-image'>
                <Image 
                    src={'/Banner_1.png'}
                    alt='Banner Image'
                    width={1024}
                    height={576}
                    className='rounded-lg shadow-2xl border mx-auto'
                    priority={true}
                />    
            </div>
        </div>
    )
}

export default HeroSectionImage
