'use server';

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
export async function generateAiSummary({ summary, skills, workExp = [], projects = [], education =[] }: { summary: string, skills: string, workExp?: string[], projects?: string[], education?: string[] }){
    try {
        const { userId } = await auth();
        if (!userId) {
            throw new Error("Unauthenticated");
        }

        // Prepare structured content for the AI prompt
        const skillsList = skills.split(',').map(s => s.trim()).filter(Boolean);

        const workExpArr = workExp?.map(item => {
            try {
                return JSON.parse(item);
            } catch {
                return null;
            }
        }).filter(Boolean);

        const projectsArr = projects?.map(item => {
            try {
                return JSON.parse(item);
            } catch {
                return null;
            }
        }).filter(Boolean);

        const educationArr = education?.map(item => {
            try {
                return JSON.parse(item);
            } catch {
                return null;
            }
        }).filter(Boolean);

        // Build prompt sections
        // Prepare sections, only including non-empty ones
        const sections: string[] = [];

        if (skillsList.length > 0) {
            sections.push(`Skills: ${skillsList.join(', ')}`);
        }

        if (workExpArr && workExpArr.length > 0) {
            const workExpSection = workExpArr
            .map((w, idx) => `${w.title} at ${w.organization} (${w.startDate} - ${w.current ? 'Present' : w.endDate}): ${w.description}`)
            .join('; ');
            sections.push(`Work Experience: ${workExpSection}`);
        }

        if (projectsArr && projectsArr.length > 0) {
            const projectsSection = projectsArr
            .map((p, idx) => `${p.title} (${p.startDate} - ${p.current ? 'Present' : p.endDate}): ${p.description}`)
            .join('; ');
            sections.push(`Projects: ${projectsSection}`);
        }

        if (educationArr && educationArr.length > 0) {
            const educationSection = educationArr
            .map((e, idx) => `${e.title} at ${e.institute} (${e.startDate} - ${e.current ? 'Present' : e.endDate})${e.description ? ': ' + e.description : ''}`)
            .join('; ');
            sections.push(`Education: ${educationSection}`);
        }

        // Compose the prompt
        const prompt = `
    You are an expert resume writer. Write a concise, impactful professional summary for a candidate based on the following details. 
    If work experience, projects, or education are provided, ensure the summary reflects these aspects. 
    Highlight the most relevant skills, achievements, and experience, using industry-appropriate language. 
    Keep the summary to a single paragraph, not exceeding 4-5 sentences. 
    Do not include any section headers, lists, or extra explanations.

    Current Summary: ${summary}
    ${sections.length > 0 ? '\n' + sections.join('\n') : ''}

    Requirements:
    1. Use action verbs.
    2. Include metrics and results where possible.
    3. Highlight relevant technical skills.
    4. Focus on achievements over responsibilities.
    5. Use industry-specific keywords.

    Respond only with the improved summary paragraph.
        `.trim();

        const res = await ai.models.generateContent({
            model: "gemini-2.0-flash",
            contents: prompt
        });

        return res.text?.trim().replace(/^"|"$/g, '') || "";
    } catch (error) {
        if (error instanceof Error) {
            console.error("Error while generating AI professional summary", error.message);
            throw new Error("Error while generating AI professional summary");
        } else {
            console.error("An unknown error occurred while generating AI professional summary");
            throw new Error("An unknown error occurred while generating AI professional summary");
        }
    }
}
