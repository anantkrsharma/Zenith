'use server';

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";


export async function getIndustryInsights(){
    try {
        const { userId } = await auth();
        if(!userId) {
            throw new Error("Unauthenticated");
        }

        const user = await db.user.findUnique({
            where: {
                clerkUserId: userId
            }  
        });
        if(!user) {
            throw new Error("User not found");
        }

        

    } catch (error) {
        
    }
}
