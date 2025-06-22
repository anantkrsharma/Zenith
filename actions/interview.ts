'use server';

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
    apiKey: process.env.GENAI_API_KEY
});

//Fn to generate interview quiz questions based on user's industry and skills
export async function generateInterviewQuestions() {
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
            Generate 20 technical interview questions for a ${user.industry} 
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
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            throw new Error("AI response did not contain valid JSON");
        }
        let jsonString = jsonMatch[0];
        jsonString = jsonString.replace(/,\s*([\]}])/g, '$1');
        const interviewQuestions = JSON.parse(jsonString);
        
        return interviewQuestions.questions;
    } catch (error) {
        if (error instanceof Error) {
            console.error("Error while generating the interview questions:", error.message);
            throw new Error("Failed to generate the interview questions");
        } else {
            console.error("An unknown error occurred while generating the interview questions");
            throw new Error("An unknown error occurred while generating the interview questions");
        }
    }
}

interface QuestionDataProp {
    question: string;
    options: string[];
    correctAnswer: string;
    explanation: string;
}

//Fn to save interview quiz assessment based on user's answers
export async function saveInterviewAssessment(questions: QuestionDataProp[], answers: string[], score: number) {
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

        const questionData = questions.map((q, index) => ({
            question: q.question,
            correctAnswer: q.correctAnswer,
            userAnswer: answers[index],
            isCorrect: q.correctAnswer === answers[index],
            explanation: q.explanation,
        }));

        const wrongAnswers = questionData.filter((quesData) => quesData.isCorrect === false);

        let improvementTip = "";

        if(wrongAnswers.length > 0){
            const wrongAnswerDetails = wrongAnswers.map((wrongAns) => `
                Question: ${wrongAns.question}\nCorrect Answer: ${wrongAns.correctAnswer}\nUser's Answer: ${wrongAns.userAnswer}
            `).join("\n\n");

            const improvementTipPrompt = `
                The user got the following ${user.industry} technical interview questions wrong:

                ${wrongAnswerDetails}

                Based on these mistakes, provide a concise, specific improvement tip.
                Focus on the knowledge gaps revealed by these wrong answers.
                Keep the response under 2 sentences and make it encouraging.
                Don't explicitly mention the mistakes, instead focus on what to learn/practice.
            `;
            
            const res = await ai.models.generateContent({
                model: "gemini-2.0-flash",
                contents: improvementTipPrompt
            });
            improvementTip = res.text?.trim() || "";
        }
        
        const interviewAssessment = await db.assessment.create({
            data: {
                userId: user.id,
                quizScore: score,
                questions: questionData,
                improvementTip,
                category: "Technical",
            }
        });

        return interviewAssessment;
    } catch (error) {
        if (error instanceof Error) {
            console.error("Error saving interview quiz:", error.message);
            throw new Error("Failed to save interview quiz");
        } else {
            console.error("An unknown error occurred while saving interview quiz.");
            throw new Error("An unknown error occurred while saving interview quiz.");
        }
    }
}

export async function getInterviewAssessments(){
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

        const assessments = await db.assessment.findMany({
            where: {
                userId: user.id,
                category: "Technical",
            },
            orderBy: {
                createdAt: "asc",
            }
        });

        return assessments;
    } catch (error) {
        if (error instanceof Error) {
            console.error("Error fetching interview assessments:", error.message);
            throw new Error("Failed to fetch interview assessments");
        } else {
            console.error("An unknown error occurred while fetching interview assessments.");
            throw new Error("An unknown error occurred while fetching interview assessments.");
        }
    }
}
