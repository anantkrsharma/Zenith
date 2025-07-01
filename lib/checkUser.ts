import { currentUser } from "@clerk/nextjs/server"
import { db } from "./prisma";
import { toast } from "sonner";

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
        })

        if(loggedInUser) {
            return loggedInUser;
        }
        
        const newUser = await db.user.create({
            data: {
                clerkUserId: user.id,
                name: user.fullName,
                email: user.primaryEmailAddress?.emailAddress || user.emailAddresses[0].emailAddress,
                imageUrl: user.imageUrl,
            }
        })

        return newUser;
    } catch (error) {
        if (error instanceof Error) {
            console.log(error.message);
        } else {
            console.log("An unknown error occurred while checking the user.");
        }
    }
}
