import { currentUser } from "@clerk/nextjs/server"
import { db } from "./prisma";

export const checkUser = async () => {
    const user = await currentUser();
    if(!user) {
        console.log("Not logged in");
        return null;
    }
    
    try {
        const loggedInUser = await db.user.findUnique({
            where: {
                clerkUserId: user.id
            }
        });

        if(loggedInUser) {
            return loggedInUser;
        }

        try {
            const newUser = await db.user.create({
                data: {
                    clerkUserId: user.id,
                    name: user.fullName,
                    email: user.primaryEmailAddress?.emailAddress || user.emailAddresses[0].emailAddress,
                    imageUrl: user.imageUrl,
                }
            });
            return newUser;
        } catch (createError: any) {
            // Prisma unique constraint error code
            if (createError.code === 'P2002') {
                //another parallel request created the user (getUserOnboardingStatus() OR header.tsx), fetch and return
                return await db.user.findUnique({
                    where: { clerkUserId: user.id }
                });
            }
            throw createError;
        }
    } catch (error) {
        if (error instanceof Error) {
            console.log(error.message);
        } else {
            console.log("An unknown error occurred while checking the user.");
        }
        return null;
    }
}
