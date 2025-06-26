import { Resume } from "@/lib/generated/client";
import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function saveResume(resumeData: Resume){
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
                ...resumeData
            },
            create: {
                ...resumeData,
                userId: user.id,
            },
        });

    } catch (error) {    
    if (error instanceof Error) {
        console.error("Error while saving the resume", error.message);
        throw new Error("Failed to save the resume");
    } else {
        console.error("An unknown error occurred while saving the resume");
        throw new Error("An unknown error occurred while saving the resume");
    }
    }
}
