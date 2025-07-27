'use client'

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CoverLetter } from '@/lib/generated/client';
import CoverLetterCard from './cover-letter-card';

const CoverLetterCards = ({ coverLettersData }: { coverLettersData: CoverLetter[] }) => {

    //Framer Motion variants for staggered animation
    const containerVariants = {
        hidden: {},
        show: {
            transition: {
                staggerChildren: 0.12,
            },
        },
    };
    const cardVariants = {
        hidden: { opacity: 0, y: 64, scale: 0.96 },
        show: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                duration: 0.85,
                type: 'spring',
                bounce: 0.35,
                ease: [0.22, 1, 0.36, 1],
            },
        },
    };

    return (
        <div className="w-full">
            {coverLettersData?.length ? (
                <motion.div
                    className="space-y-4"
                    variants={containerVariants}
                    initial="hidden"
                    animate="show"
                >
                    <AnimatePresence>
                        {coverLettersData.map((letter) => (
                            <motion.div
                                key={letter.id}
                                variants={cardVariants}
                                initial="hidden"
                                animate="show"
                                exit="hidden"
                                layout
                            >
                                <CoverLetterCard letter={letter} />
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>
            ) : (
                <div className="flex flex-col justify-center min-h-[70vh]">
                    <div className="flex items-center justify-center text-muted-foreground">
                        We could not find any cover letter. Please create one first.
                    </div>
                </div>
            )}
        </div>
    );
};

export default CoverLetterCards;
