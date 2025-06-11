'use server';

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
    apiKey: process.env.GENAI_API_KEY
});

export async function generateInterviewQuiz(industry: string) {
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

        const prompt = `
            Generate 10 technical interview questions for a ${user.industry} 
            professional${user.skills?.length ? ` with expertise in ${user.skills.join(", ")}` : ""}.
            
            Each question should be multiple choice with 4 options.
            
            Return the response in this JSON format only, no additional text:
            {
            "questions": [
                {
                "question": "string",
                "options": ["string", "string", "string", "string"],
                "correctAnswer": "string",
                "explanation": "string"
                }
            ]
            }
        `;

        const result = await ai.models.generateContent({
            model: "gemini-2.0-flash",
            contents: prompt
        });

        let text = result.text ?? "";
        text = text.replace(/```(?:json)?\n?/g, "").trim();

        const interviewQuiz  = JSON.parse(text);
        
        return interviewQuiz.questions;
    } catch (error) {
        if (error instanceof Error) {
            console.error("Error generating interview questions:", error.message);
            throw new Error("Failed to generate interview questions");
        } else {
            console.error("An unknown error occurred while generating interview questions.");
            throw new Error("An unknown error occurred while generating interview questions.");
        }
    }
}
