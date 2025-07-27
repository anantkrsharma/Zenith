'use client';

export const dynamic = "force-dynamic";
import { getCoverLetter } from '@/actions/cover-letter'
import { Button } from '@/components/ui/button';
import useFetch from '@/hooks/use-fetch'
import MDEditor from '@uiw/react-md-editor'
import { ArrowLeft, Download, Loader2 } from 'lucide-react';
import Link from 'next/link';
import React, { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import CoverLetterSkeleton from '../_components/cover-letter-skeleton';

type Html2PdfChainable = {
    set: (options: object) => Html2PdfChainable;
    from: (element: HTMLElement | null) => Html2PdfChainable;
    save: () => Promise<void>;
};

type Html2PdfFn = () => Html2PdfChainable;

const CoverLetterPage = ({ params }: { params: Promise<{ id: string }> }) => {
    const { id } = React.use(params);
    const [isDownloading, setIsDownloading] = useState<boolean>(false);
    const pdfLib = useRef<Html2PdfFn | null>(null);

    const {
        data: letterData,
        loading: letterLoading,
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
                <div className="flex flex-col space-y-2 md:space-y-4">
                    <Link href={'/ai-cover-letter'}>
                        <Button
                            variant={'outline'}
                            className='flex items-center pl-0 gap-2 border bg-neutral-950 border-zinc-700 hover:bg-black hover:border-zinc-500 hover:cursor-pointer hover:no-underline transition-colors duration-75 ease-in-out'
                            >
                            <ArrowLeft className='w-4 h-4'/>
                            Back to Cover Letters
                        </Button>
                    </Link>
                    <div className='flex flex-col sm:flex-row md:items-center justify-between'>
                        <h1 className="text-3xl md:text-5xl font-bold gradient-title">
                            {letterData?.jobTitle} <span className='font-normal text-neutral-800/50'> at </span> {letterData?.companyName}
                        </h1>
                        <div className='flex justify-end'>
                            <Button 
                                variant={'outline'}
                                className='flex items-center text-white bg-cyan-950 border-cyan-800 hover:cursor-pointer hover:bg-cyan-900 hover:border-cyan-600 transition-all duration-75 ease-in-out'
                                disabled={isDownloading}
                                onClick={generatePDF}
                                >   
                                { isDownloading ?
                                    <>
                                        <Loader2 className='h-4 w-4 animate-spin' />
                                        Generating PDF...
                                    </>
                                    :
                                    <>
                                        <Download />
                                        Download PDF
                                    </>
                                }
                            </Button>
                        </div>
                    </div>
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
                    <div className='hidden'>
                        <div id='cover-letter'>
                            <MDEditor.Markdown
                                source={letterData?.content}
                                style={{ background: 'white', color: 'black' }}
                            />
                        </div>
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
