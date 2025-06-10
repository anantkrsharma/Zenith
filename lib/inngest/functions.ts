import { GoogleGenAI } from "@google/genai";
import { db } from "../prisma";
import { inngest } from "./client";

// export const helloWorld = inngest.createFunction(
//     { id: "hello-world" },
//     { event: "test/hello.world" },
//     async ({ event, step }) => {
//         await step.sleep("wait-a-moment", "1s");
//         return { message: `Hello ${event.data.email}!` };
//     },
// );

const ai = new GoogleGenAI({
    apiKey: process.env.GENAI_API_KEY
});

export const updateIndustryInsights = inngest.createFunction(
    { id: "update-industry-insights", name: "update-industry-insights" },
    { cron: "0 0 * * 0" }, //Runs every Sunday at midnight
    async ({ step }) => {
        const industries = await step.run("fetch-all-industries", async () => { 
            return await db.industryInsight.findMany({
                select: { industry: true }
            })
        });

        //update each and every industry insight in the database
        for(const { industry } of industries) {
            const prompt = `
                Analyze the current state of the ${industry} industry and provide insights in ONLY the following JSON format without any additional notes or explanations:
                {
                    "salaryRanges": [
                    { "role": "string", "min": number, "max": number, "median": number, "location": "string" }
                    ],
                    "growthRate": number,
                    "demandLevel": "High" | "Medium" | "Low",
                    "topSkills": ["skill1", "skill2"],
                    "marketOutlook": "POSITIVE" | "NEUTRAL" | "NEGATIVE",
                    "keyTrends": ["trend1", "trend2"],
                    "recommendedSkills": ["skill1", "skill2"]
                }
                
                IMPORTANT: Return ONLY the JSON. No additional text, notes, or markdown formatting.
                Include at least 5 common roles for salary ranges.
                Growth rate should be a percentage.
                Include at least 10 skills and trends.
            `;
            
            //binding to prevent the original parent object context of generateContent function, into a new function, and then using the new function in step.ai.wrap
            const generateInsight = ai.models.generateContent.bind(ai.models);
            
            //generating updated insights using Gemini
            const { text } = await step.ai.wrap(
                `ai-generated-insight-for-${industry}`,
                generateInsight,
                {
                    model: "gemini-2.0-flash",
                    contents: prompt
                }
            )
            const cleanedText = (text ?? "").replace(/```(?:json)?\n?/g, "").trim();
            const insights = JSON.parse(cleanedText);

            //updating the industry insight in the database
            await step.run(
                `update-${industry}-in-industryInsights-db`,
                async () => {
                    return await db.industryInsight.upsert({
                        where: { industry },
                        create: {
                            industry,
                            ...insights,
                            lastUpdated: new Date(),
                            nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 1 week later
                        },
                        update: {
                            ...insights,
                            lastUpdated: new Date(),
                            nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 1 week later
                        }
                    })
                }
            )
        }
    }
)
