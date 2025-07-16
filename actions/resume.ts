'use server'

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenAI } from "@google/genai";
import { revalidatePath } from "next/cache";

const ai = new GoogleGenAI({
    apiKey: process.env.GENAI_API_KEY
});

//fetch existing resume
export async function getResume(){
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
    
        return await db.resume.findUnique({
            where: {
                userId: user.id
            }
        });
    } catch (error) {
        if (error instanceof Error) {
            console.error("Error while fetching the resume", error.message);
            throw new Error("Error while fetching the resume");
        } else {
            console.error("An unknown error occurred while fetching the resume");
            throw new Error("An unknown error occurred while fetching the resume");
        }
    }
}

//save or update resume
export async function saveResume(resumeContent: string){
    try {
        const { userId } = await auth();
        if (!userId) {
            throw new Error("Unauthenticated");
        }

        const user = await db.user.findUnique({
            where: { clerkUserId: userId },
        });
        if (!user) {
            throw new Error("User not found");
        }
        
        const resume = await db.resume.upsert({
            where: {
                userId: user.id
            },
            update: {
                content: resumeContent
            },
            create: {
                userId: user.id,
                content: resumeContent,
            },
        });

        revalidatePath('/resume');
        return resume;
    } catch (error) {    
        if (error instanceof Error) {
            console.error("Error while saving the resume", error.message);
            throw new Error("Error while saving the resume");
        } else {
            console.error("An unknown error occurred while saving the resume");
            throw new Error("An unknown error occurred while saving the resume");
        }
    }
}

type ImproveWithAIParams = {
    type: string, 
    currentDesc: string, 
    title: string, 
    organization?: string,
    skills?: string[]
}

//generate AI improved content (project, job, skills, etc)
export async function improveWithAI({ type, currentDesc, title, organization, skills }: ImproveWithAIParams){
    try {    
        const { userId } = await auth();
        if(!userId){
            throw new Error("Unauthenticated");
        }

        const user = await db.user.findUnique({
            where: {
                clerkUserId: userId
            },
            include: {
                resume: true
            }
        });
        if(!user){
            throw new Error("User not found");
        }

        const prompt = `
            As an expert resume writer, improve the following ${type} description for a ${user.industry} professional.
            Make it more impactful, quantifiable, and aligned with industry standards.
            Current description: ${currentDesc.toString()}
            Title: ${title.toString()}
            ${organization && `Organization: ${organization.toString()}`}
            ${skills && `Skills: ${skills.join(', ')}`}

            Requirements:
            1. Use action verbs
            2. Include metrics and results where possible
            3. Highlight relevant technical skills
            4. Keep it concise but detailed
            5. Focus on achievements over responsibilities
            6. Use industry-specific keywords
            
            Format the response as a single paragraph without any additional text or explanations.
        `;

        const res = await ai.models.generateContent({
            model: "gemini-2.0-flash",
            contents: prompt
        });
        
        return res.text?.trim().replace(/^"|"$/g, '') || "";
        
    } catch (error) {
        if (error instanceof Error) {
            console.error("Error while generating AI job description", error.message);
            throw new Error("Error while generating AI job description");
        } else {
            console.error("An unknown error occurred while generating AI job description");
            throw new Error("An unknown error occurred while generating AI job description");
        }
    }
}

//TO-DO
//generate AI Professional-Summary
export async function generateAiSummary(){

}
