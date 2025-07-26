"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenAI } from "@google/genai";
import { revalidatePath } from "next/cache";

const ai = new GoogleGenAI({
    apiKey: process.env.GENAI_API_KEY
});

type CoverLetterInput = {
    jobTitle: string;
    companyName: string;
    jobDescription?: string;
}

export async function generateCoverLetter({ jobTitle, companyName, jobDescription }: CoverLetterInput){
    try {
        const { userId } = await auth();
        if (!userId) {
            throw new Error("Unauthenticated");
        }

        const user = await db.user.findUnique({
            where: {
                clerkUserId: userId
            }
        });
        if (!user) {
            throw new Error("User not found");
        }

        const prompt = `
            Write a professional cover letter for a ${jobTitle} position at ${companyName}.
            
            About the candidate:
            - Industry: ${user.industry}
            - Years of Experience: ${user.experience}
            - Skills: ${user.skills?.join(", ")}
            - Professional Background: ${user.bio}
            
            ${jobDescription && `Job Description: ${jobDescription}`}
            
            Requirements:
            1. Use a professional, enthusiastic tone
            2. Highlight relevant skills and experience
            3. Show understanding of the company's needs
            4. Keep it concise (max 400 words)
            5. Use proper business letter formatting in markdown
            6. Include specific examples of achievements
            7. Relate candidate's background to job requirements
            
            Format the letter in markdown.
        `
        
        const res = await ai.models.generateContent({
            model: "gemini-2.0-flash",
            contents: prompt
        });
        const content = res.text?.trim() || '';

        return await db.coverLetter.create({
            data: {
                userId: user.id,
                content,
                jobTitle,
                companyName,
                jobDescription,
                status: "completed"
            }
        });
    } catch (error) {
        if (error instanceof Error) {
            console.error("Error while generating cover letter", error.message);
            throw new Error("Error while generating cover letter");
        } else {
            console.error("An unknown error occurred while generating cover letter");
            throw new Error("An unknown error occurred while generating cover letter");
        }
    }
}

export async function getCoverLetters(){
    try {
        const { userId } = await auth();
        if (!userId) {
            throw new Error("Unauthenticated");
        }

        const user = await db.user.findUnique({
            where: {
                clerkUserId: userId
            }
        });
        if (!user) {
            throw new Error("User not found");
        }

        //latest first
        const coverLetters = await db.coverLetter.findMany({
            where: {
                userId: user.id
            },
            orderBy: {
                createdAt: "desc" 
            }
        });

        return coverLetters;
    } catch (error) {
        if (error instanceof Error) {
            console.error("Error while fetching cover letters", error.message);
            throw new Error("Error while fetching cover letters");
        } else {
            console.error("An unknown error occurred while fetching cover letters");
            throw new Error("An unknown error occurred while fetching cover letters");
        }
    }
}

export async function getCoverLetter(id: string){
    try {
        const { userId } = await auth();
        if (!userId) {
            throw new Error("Unauthenticated");
        }

        const user = await db.user.findUnique({
            where: {
                clerkUserId: userId
            }
        });
        if (!user) {
            throw new Error("User not found");
        }

        const coverLetter = await db.coverLetter.findUnique({
            where: {
                userId: user.id,
                id
            }
        });

        if (!coverLetter) {
            throw new Error("Cover letter not found");
        }

        return coverLetter;
    } catch (error) {
        if (error instanceof Error) {
            console.error("Error while fetching cover letter", error.message);
            throw new Error("Error while fetching cover letter");
        } else {
            console.error("An unknown error occurred while fetching cover letter");
            throw new Error("An unknown error occurred while fetching cover letter");
        }
    }
}

export async function deleteCoverLetter(id: string){
    try {
        const { userId } = await auth();
        if(!userId){
            throw new Error("Unauthenticated");
        }

        const user = await db.user.findUnique({
            where: {
                clerkUserId: userId
            }
        });
        if(!user){
            throw new Error("User not found");
        }

        const deletedCoverLetter = await db.coverLetter.delete({
            where: {
                userId: user.id,
                id
            }
        });

        revalidatePath('/ai-cover-letter');
        return deleteCoverLetter;
    } catch (error) {
        if (error instanceof Error) {
            console.error("Error while deleting cover letter", error.message);
            throw new Error("Error while deleting cover letter");
        } else {
            console.error("An unknown error occurred while deleting cover letter");
            throw new Error("An unknown error occurred while deleting cover letter");
        }
    }
}
