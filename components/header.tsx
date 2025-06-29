import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react'
import { Button } from './ui/button';
import { ChevronDown, FileText, GraduationCap, LayoutDashboard, Menu, PenBox, StarsIcon } from 'lucide-react';
import {
        DropdownMenu,
        DropdownMenuContent,
        DropdownMenuItem,
        DropdownMenuTrigger,
    } from "@/components/ui/dropdown-menu"
import { checkUser } from '@/lib/checkUser';

const Header = async () => {
    await checkUser();
    
    return (
        <header className='fixed top-0 w-full border-b border-cyan-950/50 bg-cyan-950/50 backdrop-blur-md z-50 supports-[backdrop-filter]:bg-cyan-950/7'> 
            <nav className='container md:min-w-full mx-auto w-full px-4 h-18 flex items-center justify-between'>
                <Link href='/'>
                    <Image src='/logo.png' alt='logo' width={90} height={60} className='p-0.5' />
                </Link>
                
                <div className='flex items-center space-x-2 md:space-x-4'>
                    <SignedIn>
                        <Link href='/dashboard'>
                            <Button variant={'outline'} className='cursor-pointer'>
                                <LayoutDashboard className='h-6 w-6'/>
                                <span className='hidden md:block'> Industry Insights </span>
                            </Button>
                        </Link>

                        <DropdownMenu modal={false}>
                            <DropdownMenuTrigger asChild>
                                <Button variant={'outline'} className='cursor-pointer'>
                                    <StarsIcon className='h-6 w-6 hidden md:block'/>
                                    <Menu className='h-6 w-6 block md:hidden'></Menu>
                                    <span className='hidden md:block'> Growth Tools </span>
                                    <ChevronDown className='h-6 w-6 hidden md:block'/>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="overflow-y-auto [&>*]:text-lg md:[&>*]:text-base">
                                <DropdownMenuItem>
                                    <Link href={'/resume'} className='flex items-center gap-2'>
                                        <FileText className='h-8 w-8 md:h-6 md:w-6'/>
                                        <span> Resume Builder </span>
                                    </Link>
                                </DropdownMenuItem>          
                                <DropdownMenuItem>
                                    <Link href={'/ai-cover-letter'} className='flex items-center gap-2'>
                                        <PenBox className='h-8 w-8 md:h-6 md:w-6'/>
                                        <span> Cover-Letter Builder </span>
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <Link href={'/interview'} className='flex items-center gap-2'>
                                        <GraduationCap className='h-8 w-8 md:h-6 md:w-6'/>
                                        <span> Interveiw Prep </span>
                                    </Link>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        <UserButton appearance={{
                                        elements: {
                                            avatarBox: 'w-10 h-10',
                                            userButtonPopoverCard: 'shadow-xl',
                                            userButtonMainIdentifier: 'font-semibold',
                                        }
                                    }}
                                    afterSignOutUrl='/'
                        />
                    </SignedIn>

                    <SignedOut>
                        <SignInButton>
                            <Button variant={'outline'} className='cursor-pointer'> Sign In </Button>
                        </SignInButton>
                    </SignedOut>
                </div>

            </nav>
        </header>
    )
}

export default Header;
