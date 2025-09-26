'use client';

import Link from 'next/link';
import { ExternalLink, Github, User } from 'lucide-react';
import { BorderBeam } from './ui/border-beam';

export default function CreatorBadge() {
    return (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 group rounded-2xl">
            <div className="relative">
                {/* Main glass background for container */}
                <div className="absolute inset-0 bg-black/40 backdrop-blur-lg rounded-2xl border border-white/10 shadow-2xl"></div>
                
                {/* Inner glass layer for container */}
                <div className="absolute inset-[1px] bg-gradient-to-br from-white/5 via-white/2 to-transparent rounded-2xl"></div>
                
                {/* Ambient glow for container */}
                <div className="absolute -inset-1 bg-gradient-to-br from-blue-500/20 via-neutral-700/30 to-cyan-500/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                
                {/* Portfolio Badge */}
                <Link 
                    href="https://anantx.dev"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative block hover:cursor-pointer group/portfolio"
                >
                    {/* Content for Portfolio */}
                    <div className="relative p-3 sm:p-4 space-y-2 min-w-[200px] sm:min-w-[220px] hover:bg-white/5 transition-colors rounded-t-2xl">
                        {/* Creator Info */}
                        <div className="flex items-center space-x-2 text-gray-300/90">
                            <div className="p-1 rounded-full bg-white/5 group-hover/portfolio:border-blue-300/30 transition-colors">
                                <User className="w-3 h-3 sm:w-4 sm:h-4 text-blue-300" />
                            </div>
                            <span className="text-xs sm:text-sm font-medium">Made by</span>
                        </div>
                        
                        {/* Creator name with subtle gradient */}
                        <div className="font-semibold text-sm sm:text-base tracking-wide bg-gradient-to-r from-white via-gray-100 to-white bg-clip-text text-transparent">
                            Anant Kr Sharma
                        </div>
                    </div>
                </Link>

                {/* Separator */}
                <div className="relative border-t border-white/10 mx-3 sm:mx-4"></div>

                {/* Repository Badge */}
                <Link
                    href="https://github.com/anantkrsharma/Zenith"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative block hover:cursor-pointer group/repo"
                >
                    {/* Content for Repository */}
                    <div className="relative p-3 sm:p-4 min-w-[200px] sm:min-w-[220px] hover:bg-white/5 transition-colors rounded-b-2xl">
                        <div className="flex items-center space-x-2 text-gray-300/80 group-hover/repo:text-blue-300 transition-all duration-200">
                            <div className="p-1 rounded-full bg-white/5 group-hover/repo:border-blue-300/30 transition-colors">
                                <Github className="w-3 h-3 sm:w-4 sm:h-4" />
                            </div>
                            <span className="text-xs sm:text-sm font-medium">View Repository</span>
                            <ExternalLink className="w-2.5 h-2.5 sm:w-3 sm:h-3 opacity-60 group-hover/repo:opacity-100 group-hover/repo:translate-x-0.5 group-hover/repo:-translate-y-0.5 transition-all duration-200" />
                        </div>
                    </div>
                </Link>
            </div>

            <BorderBeam
                duration={8}
                size={400}
                className="from-transparent via-cyan-700 to-transparent"
            />
            <BorderBeam
                duration={8}
                delay={3}
                size={400}
                borderWidth={2}
                className="from-transparent via-gray-300/70 to-transparent"
            />
        </div>
    );
}
