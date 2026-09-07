"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { generateAiInsight } from "@/lib/industry-insights";
import { checkUser } from "@/lib/checkUser";
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
    if (!userId) {
      throw new Error("Unauthenticated");
    }

    const user = await db.user.findUnique({
      where: {
        clerkUserId: userId,
      },
    });
    if (!user) {
      throw new Error("User not found");
    }

    const existingInsight = await db.industryInsight.findUnique({
      where: { industry: data.industry },
    });
    // Network generation must not hold open the database transaction.
    const generatedInsight = existingInsight
      ? null
      : await generateAiInsight(data.industry);

    const result = await db.$transaction(
      async (tx) => {
        const industryInsight =
          existingInsight ??
          (await tx.industryInsight.upsert({
            where: { industry: data.industry },
            update: {},
            create: {
              industry: data.industry,
              ...generatedInsight!,
              nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            },
          }));

        //update user with onboarding data
        const updatedUser = await tx.user.update({
          where: {
            id: user.id,
          },
          data: {
            bio: data.bio,
            experience: data.experience,
            skills: data.skills,
            industry: industryInsight.industry,
          },
        });

        return { industryInsight, updatedUser };
      },
      {
        timeout: 10000,
      },
    );

    revalidatePath("/");

    return {
      success: "User updated successfully",
      ...result,
    };
  } catch (error) {
    if (error instanceof Error) {
      console.error(
        "Error while updating the user and industry:",
        error.message,
      );
      throw new Error(
        "Error while onboarding the user. Please try again later.",
      );
    } else {
      console.error("An unknown error occured while onboarding the user.");
      throw new Error(
        "An unknown error occured while onboarding the user. Please try again later.",
      );
    }
  }
}

export async function getUserOnboardingStatus() {
  try {
    const { userId } = await auth();
    if (!userId) {
      // Instead of throwing, return not onboarded
      return {
        isUser: false,
        isOnboarded: false,
      };
    }

    const user = await checkUser();

    // If user is null, treat as not onboarded
    if (!user) {
      return {
        isUser: false,
        isOnboarded: false,
      };
    }

    return {
      isUser: true,
      isOnboarded: user?.industry !== null,
    };
  } catch (error) {
    if (error instanceof Error) {
      console.error(
        "Error while getting the user onboarding status:",
        error.message,
      );
      // Instead of throwing, return not onboarded
      return {
        isUser: false,
        isOnboarded: false,
      };
    } else {
      console.error(
        "An unknown error occured while getting the user onboarding status.",
      );
      return {
        isUser: false,
        isOnboarded: false,
      };
    }
  }
}
