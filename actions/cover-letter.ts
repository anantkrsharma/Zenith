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

export async function createCoverLetter({ jobTitle, companyName, jobDescription }: CoverLetterInput){
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
            You are a professional career assistant AI.

            Generate a **cover letter** in **valid Markdown format** for the following job application:

            **Job Title**: ${jobTitle}  
            **Company**: ${companyName}

            ### About the candidate:
            - **Name**: ${user.name}
            - **Industry**: ${user.industry}
            - **Experience**: ${user.experience} years
            - **Skills**: ${user.skills?.join(", ")}
            - **Background**: ${user.bio}

            ${jobDescription ? `- **Job Description**:\n${jobDescription}` : ""}

            ### Instructions:
            - Do not include any introductory text, comments, or explanation.
            - Output only a business cover letter written in valid **Markdown**, properly formatted as:
            - Date
            - Greeting
            - Body (1–3 paragraphs)
            - Closing statement
            - Signature (Candidate's name)
            - Keep it under 400 words.
            - Use a **professional yet enthusiastic tone**.
            - Include specific examples of achievements
            - Relate candidate's background to job requirements
            - Use bullet points if necessary to highlight achievements.
        `.trim();
        
        const res = await ai.models.generateContent({
            model: "gemini-2.0-flash",
            contents: prompt
        });

        let content = res.text?.trim() || "";
        const regex = /^[\s\S]*?(?=\n#|Dear|To|Date:)/i;
        content = content.replace(regex, "").trim();

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
