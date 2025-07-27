'use client'

import React from 'react';
import { deleteCoverLetter } from '@/actions/cover-letter';
import { CoverLetter } from '@/lib/generated/client';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import CoverLetterCard from './cover-letter-card';

const CoverLetterCards = ({ coverLettersData }: { coverLettersData: CoverLetter[] }) => {

    return (
        <div className="w-full">
            {coverLettersData?.length ? (
                <div className="space-y-4">
                    { coverLettersData.map((letter) => (
                        <CoverLetterCard letter={letter} key={letter.id}/>
                    ))}
                </div>
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
