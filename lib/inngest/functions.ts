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
    // NOTE: Original schedule was "0 0 * * 0" (Sunday 00:00). Top-of-hour bursts can
    // collide with provider maintenance & rate limit spikes. Consider shifting to
    // "10 0 * * 0" (00:10) after deploying if 429s persist. Keeping original for now.
    { cron: "0 0 * * 0" }, // Runs every Sunday at midnight
    async ({ step }) => {
        // Helper: detect provider rate limit style errors (Gemini 429 or generic)
        const isRateLimitError = (err: unknown): boolean => {
            if (!err || typeof err !== "object") return false;
            const anyErr = err as any;
            const status = anyErr.status || anyErr.code || anyErr.error?.code;
            return status === 429 || status === "429" || status === "RESOURCE_EXHAUSTED";
        };

        // Generic exponential backoff with jitter. Uses step.sleep for observability.
        const retryWithBackoff = async <T>(
            key: string,
            fn: () => Promise<T>,
            opts?: { attempts?: number; baseMs?: number; maxMs?: number }
        ): Promise<T> => {
            const attempts = opts?.attempts ?? 5; // total tries
            const baseMs = opts?.baseMs ?? 1000; // initial backoff
            const maxMs = opts?.maxMs ?? 60_000; // cap
            let lastErr: unknown;
            for (let attempt = 1; attempt <= attempts; attempt++) {
                try {
                    return await fn();
                } catch (err) {
                    lastErr = err;
                    const rateLimited = isRateLimitError(err);
                    const isLast = attempt === attempts;
                    if (!rateLimited && isLast) break; // non-rate limit final failure
                    if (!rateLimited && attempt === attempts) break; // bail
                    const exp = Math.min(baseMs * 2 ** (attempt - 1), maxMs);
                    const jitter = exp * (0.5 + Math.random()); // full jitter [0.5x,1.5x]
                    const waitMs = Math.round(jitter);
                    await step.sleep(`${key}-backoff-${attempt}`, `${waitMs}ms`);
                }
            }
            throw lastErr instanceof Error ? lastErr : new Error("Unknown error in retry");
        };

        const industries = await step.run("fetch-all-industries", async () => { 
            return await db.industryInsight.findMany({
                select: { industry: true }
            })
        });

        //update each and every industry insight in the database
        const results: Array<{ industry: string; status: string; error?: string }> = [];

        // Sequential processing reduces concurrent pressure on model provider.
        for (const { industry } of industries) {
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
            const generateInsightFn = ai.models.generateContent.bind(ai.models);
            
            try {
                // generating updated insights using Gemini with retry/backoff
                const { text } = await retryWithBackoff(
                    `gemini-${industry}`,
                    async () =>
                        await step.ai.wrap(
                            `ai-generated-insight-for-${industry}`,
                            generateInsightFn,
                            {
                                model: "gemini-2.0-flash",
                                contents: prompt
                            }
                        ),
                    { attempts: 6, baseMs: 1500, maxMs: 45_000 }
                );

                let insights: Record<string, any> = {};
                try {
                    const cleanedText = (text ?? "").replace(/```(?:json)?\n?/g, "").trim();
                    if (!cleanedText) throw new Error("Empty JSON from model");
                    insights = JSON.parse(cleanedText);
                } catch (parseErr) {
                    // Record parse issue but continue with next industry
                    console.error(`Parsing failure for ${industry}:`, parseErr);
                    results.push({ industry, status: "parse_failed", error: (parseErr as Error).message });
                    continue;
                }

                // updating the industry insight in the database
                await step.run(
                    `update-${industry}-in-industryInsights-db`,
                    async () => {
                        return await db.industryInsight.update({
                            where: { industry },
                            data: {
                                ...insights,
                                lastUpdated: new Date(),
                                nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 1 week later
                            }
                        });
                    }
                );
                results.push({ industry, status: "updated" });
            } catch (err) {
                const errMsg = err instanceof Error ? err.message : String(err);
                console.error(`Failed updating ${industry}:`, errMsg);
                results.push({ industry, status: "failed", error: errMsg });
                // If it's a rate limit error, insert a small jitter before next industry to relieve pressure
                if (isRateLimitError(err)) {
                    const jitter = 2000 + Math.random() * 3000; // 2-5s
                    await step.sleep(`post-rate-limit-jitter-${industry}`, `${Math.round(jitter)}ms`);
                }
            }
        }
        // Optionally return a summary for observability
        return { processed: results.length, results };
    }
)
