'use server';

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import {GoogleGenAI} from '@google/genai';

//Gemini AI instance
const ai = new GoogleGenAI({
    apiKey: process.env.GENAI_API_KEY
});

const generateAiInsight = async (industry: string | null) => {
    const prompt = `
        Analyze the current state of the ${industry} industry and provide insights in ONLY the following JSON format without any additional notes or explanations:
        {
            "salaryRanges": [
            { "role": "string", "min": number, "max": number, "median": number, "location": "string" }
            ],
            "growthRate": number,
            "demandLevel": "High" | "Medium" | "Low",
            "topSkills": ["skill1", "skill2"],
            "marketOutlook": "Positive" | "Neutral" | "Negative",
            "keyTrends": ["trend1", "trend2"],
            "recommendedSkills": ["skill1", "skill2"]
        }
        
        IMPORTANT: Return ONLY the JSON. No additional text, notes, or markdown formatting.
        Include at least 5 common roles for salary ranges.
        Growth rate should be a percentage.
        Include at least 5 skills and trends.
    `;
    
    const result = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: prompt
    });

    let text = result.text ?? "";
    text = text.replace(/```(?:json)?\n?/g, "").trim();

    return JSON.parse(text);
}

export async function getIndustryInsights(){
    try {
        const { userId } = await auth();
        if(!userId) {
            throw new Error("Unauthenticated");
        }

        const user = await db.user.findUnique({
            where: {
                clerkUserId: userId
            },
            include: {
                industryInsight: true
            }
        });
        if(!user) {
            throw new Error("User not found");
        }

        if(!user.industryInsight) {
            const insights = await generateAiInsight(user.industry);

            const industryInsight = await db.industryInsight.create({
                data: {
                    industry: user.industry,
                    ...insights,
                    nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), //7 days from now
                }
            })

            return industryInsight;
        }

        return user.industryInsight;
    } catch (error) {
        if (error instanceof Error) {
            console.log("Error while getting the industry insights:", error.message);
            throw new Error("Error while getting the industry insights. Please try again later.");
        } else {
            console.log("An unknown error occurred while getting the industry insights.");
            throw new Error("An unknown error occurred while getting the industry insights. Please try again later.");
        }
    }
}
