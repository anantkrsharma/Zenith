'use server';

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { generateAiInsight } from "./dashboard";
//onboarding page server actions

interface updateUserProps {
    bio: string;
    experience: number;
    skills: string[];
    industry: string;
}
    
export async function updateUser(data: updateUserProps) {
    try {
        const { userId } = await auth();
        if(!userId) {
            throw new Error("Unauthenticated");
        }
        
        const user = await db.user.findUnique({
            where: {
                clerkUserId: userId
            }
        })
        if(!user){
            throw new Error("User not found");
        }
        
        const result = await db.$transaction(async (tx) => {
            //check if the industry already exists
            let industryInsight = await tx.industryInsight.findUnique({
                where: {
                    industry: data.industry
                }
            })

            if(!industryInsight){
                //AI-curated industry insights
                const insights = await generateAiInsight(data.industry);

                industryInsight = await tx.industryInsight.create({
                    data: {
                        industry: data.industry,
                        ...insights,
                        nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), //7 days from now
                    }
                })
            }
            
            //update user with onboarding data
            const updatedUser = await tx.user.update({
                where: {
                    id: user.id
                },
                data: {
                    bio: data.bio,
                    experience: data.experience,
                    skills: data.skills,
                    industry: industryInsight.industry
                }
            })

            return { industryInsight, updatedUser };
        },
        {
            timeout: 10000
        })
        
        revalidatePath("/");
        
        return {
            success: "User updated successfully",
            ...result
        };
    } catch (error) {
        if(error instanceof Error) {
            console.log("Error while updating the user and industry:", error.message);
            throw new Error("Error while onboarding the user. Please try again later.");        
        } else{
            console.log("An unknown error occured while onboarding the user.");
            throw new Error("An unknown error occured while onboarding the user. Please try again later.");
        }
    }
}

export async function getUserOnboardingStatus() {
    try {
        const { userId } = await auth();
        if(!userId) {
            throw new Error("Unauthorized");
        }
        
        const user = await db.user.findUnique({
            where: {
                clerkUserId: userId
            },
            select: {
                industry: true
            }
        })
        if(!user){
            throw new Error("User not found");
        }

        return {
            isOnboarded: user.industry !== null,
        };
    } catch(error) {
        if(error instanceof Error) {
            console.log("Error while getting the user onboarding status:", error.message);
            throw new Error("Error while getting the user onboarding status. Please try again later.");        
        }
        else{
            console.log("An unknown error occured while getting the user onboarding status.");
            throw new Error("An unknown error occured while getting the user onboarding status. Please try again later.");
        }
    }
}
