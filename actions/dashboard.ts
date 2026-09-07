"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { generateAiInsight } from "@/lib/industry-insights";

export async function getIndustryInsights() {
  try {
    const { userId } = await auth();
    if (!userId) {
      throw new Error("Unauthenticated");
    }

    const user = await db.user.findUnique({
      where: {
        clerkUserId: userId,
      },
      include: {
        industryInsight: true,
      },
    });
    if (!user) {
      throw new Error("User not found");
    }

    if (!user.industry) throw new Error("Please complete your profile first.");

    if (!user.industryInsight) {
      const insights = await generateAiInsight(user.industry);

      const industryInsight = await db.industryInsight.create({
        data: {
          industry: user.industry,
          ...insights,
          nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), //7 days from now
        },
      });

      return industryInsight;
    }

    return user.industryInsight;
  } catch (error) {
    if (error instanceof Error) {
      console.error(
        "Error while getting the industry insights:",
        error.message,
      );
      throw new Error(
        "Error while getting the industry insights. Please try again later.",
      );
    } else {
      console.error(
        "An unknown error occurred while getting the industry insights.",
      );
      throw new Error(
        "An unknown error occurred while getting the industry insights. Please try again later.",
      );
    }
  }
}
