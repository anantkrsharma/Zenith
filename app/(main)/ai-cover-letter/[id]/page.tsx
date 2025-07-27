'use client';

import { getCoverLetter } from '@/actions/cover-letter'
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton'
import useFetch from '@/hooks/use-fetch'
import MDEditor from '@uiw/react-md-editor'
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import React, { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import CoverLetterSkeleton from '../_components/cover-letter-skeleton';

const CoverLetterPage = ({ params }: { params: Promise<{ id: string }> }) => {
    const { id } = React.use(params);
    const [isDownloading, setIsDownloading] = useState<boolean>(false);
    const pdfLib = useRef<any>(null);

    const {
        data: letterData,
        loading: letterLoading,
        error: letterError,
        fn: letterFn
    } = useFetch();

    useEffect(() => {
        async function fetchLetter(){
            try {
                await letterFn(getCoverLetter, id);

                console.log(JSON.stringify(letterData));
            } catch (error) {
                if(error instanceof Error){
                    toast.error("Error while fetching cover letter");
                    console.log("Error while fetching cover letter" + error.message);
                } else {
                    toast.error("Error while fetching cover letter");
                    console.log("Error while fetching cover letter" + error);
                }
            }
        }
        fetchLetter();
    }, [])

    //load html2pdf.js library
    useEffect(() => {
        import('html2pdf.js/dist/html2pdf.min.js')
        .then(mod => {
            pdfLib.current = mod.default;
        })
        .catch(err => {
            console.error('Failed to load html2pdf.js:', err);
        });
    }, []);

    const generatePDF = async () => {
        if (!pdfLib.current) {
            console.warn('PDF library not loaded yet');
            return;
        }
        setIsDownloading(true);
        try {
            const element = document.getElementById('cover-letter');

            const opt = {
                margin: [0, 10],
                filename: `Cover Letter.pdf`,
                image: { type: 'jpeg', quality: 1 },
                html2canvas: { scale: 2 },
                jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
            };

            await pdfLib.current().set(opt).from(element).save();

            toast.success('PDF generated successfully');
        } catch (error) {
            if (error instanceof Error) {
                console.log(error.message);
                toast.error('PDF generation error');
            } else {
                console.error('Unexpected error:', error);
                toast.error('PDF generation error');
            }
        } finally {
            setIsDownloading(false);
        }
    };

    return (
        <div className="container mx-auto">
            {letterData ? (
                <div className="flex flex-col space-y-2">
                    <Link href={'/ai-cover-letter'}>
                        <Button
                            variant={'outline'}
                            className='flex items-center pl-0 gap-2 border bg-neutral-950 border-zinc-700 hover:bg-black hover:border-zinc-500 hover:cursor-pointer hover:no-underline transition-colors duration-75 ease-in-out'
                        >
                            <ArrowLeft className='w-4 h-4'/>
                            Back to Cover Letters
                        </Button>
                    </Link>

                    <h1 className="text-6xl font-bold gradient-title mb-6">
                        {letterData?.jobTitle} <span className='font-medium text-muted-foreground/50'> at </span> {letterData?.companyName}
                    </h1>

                    <div id='cover-letter'>
                        <MDEditor.Markdown 
                            source={letterData?.content}
                            style={{ 
                                borderRadius: '0.7rem', 
                                overflow: 'hidden', 
                                paddingLeft: 15, 
                                paddingRight: 15, 
                                paddingTop: 10, 
                                paddingBottom: 10, 
                                border: '1px solid #333333'
                            }}
                        />
                    </div>
                </div>
            ) : (
                letterLoading ? (
                    <CoverLetterSkeleton />
                ) : (
                    <div className='flex items-center justify-center gap-1 min-h-[70vh] w-full text-muted-foreground'>
                        We could not find the cover letter.
                        <Link href={'/ai-cover-letter/new'}> <span className='underline decoration-cyan-700 underline-offset-2'>Create one</span> </Link>
                    </div>
                )
            )}
        </div>
    )
}

export default CoverLetterPage
