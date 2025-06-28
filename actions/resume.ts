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
