'use client';

import Image from 'next/image';
import Link from 'next/link'
import { usePathname } from 'next/navigation';
import React from 'react'
import { Button } from './ui/button';

const Footer = () => {
    const path = usePathname();

    if(path.startsWith('/sign-in') || path.startsWith('/sign-up'))
        return null;

    return (
        <footer className="bg-zinc-900 text-white py-10 px-6 border-t border-zinc-900">
            <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
            <div>
                <Image src='/logo.png' alt='logo' width={90} height={60} className='pb-2 md:pb-4' />
                <p className="text-sm text-gray-400">
                    Empowering your career path with AI driven insights and various career growth tools
                </p>
            </div>

            <div>
                <h3 className="text-base font-semibold mb-3">Quick Links</h3>
                <ul className="space-y-2 text-sm text-gray-300">
                <li><Link href="/" className="hover:text-white">Home</Link></li>
                <li><Link href="/dashboard" className="hover:text-white">Dashboard</Link></li>
                <li><Link href="/" className="hover:text-white">Services</Link></li>
                </ul>
            </div>

            <div>
                <h3 className="text-base font-semibold mb-3">Support</h3>
                <ul className="space-y-2 text-sm text-gray-300">
                <li><a href="#" className="hover:text-white">Help Center</a></li>
                <li><a href="#" className="hover:text-white">Contact Us</a></li>
                <li><a href="#" className="hover:text-white">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
                </ul>
            </div>
            
            <div>
                <h3 className="text-base font-semibold mb-3">Stay Connected</h3>
                <form className="flex flex-col sm:flex-row md:flex-col gap-3">
                <input
                    type="email"
                    placeholder="Your email"
                    className="px-4 py-2 rounded-lg text-gray-300 w-full border border-zinc-400"
                />
                <Button 
                    variant={'outline'}
                    className="bg-zinc-700 border-zinc-500 hover:cursor-pointer hover:bg-zinc-600 hover:border-zinc-400 transition-all duration-75 ease-in-out rounded-lg px-4 py-2 w-full"
                >   
                    Subscribe
                </Button>
                </form>
            </div>
            </div>

            <div className="mt-10 border-t border-gray-700 pt-4 text-center text-xs md:text-sm text-gray-400">
                &copy; {new Date().getFullYear()} Zenith. All rights reserved.
            </div>
        </footer>
    )
}

export default Footer
