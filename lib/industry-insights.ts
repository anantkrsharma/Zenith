import "server-only";
import { generateContent } from "@/lib/ai";
import { industryInsightsSchema } from "@/lib/ai-schema";

export const generateAiInsight = async (industry: string | null) => {
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

  const result = await generateContent({
    contents: prompt,
    config: { responseMimeType: "application/json" },
  });

  let text = result.text ?? "";
  text = text.replace(/```(?:json)?\n?/g, "").trim();

  return industryInsightsSchema.parse(JSON.parse(text));
};
