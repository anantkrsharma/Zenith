import { z } from "zod";

export const industryInsightsSchema = z.object({
  salaryRanges: z
    .array(
      z.object({
        role: z.string(),
        min: z.number(),
        max: z.number(),
        median: z.number(),
        location: z.string().optional(),
      }),
    )
    .min(1),
  growthRate: z.number(),
  demandLevel: z.enum(["High", "Medium", "Low"]),
  topSkills: z.array(z.string()),
  marketOutlook: z.enum(["POSITIVE", "NEUTRAL", "NEGATIVE"]),
  keyTrends: z.array(z.string()),
  recommendedSkills: z.array(z.string()),
});
export type IndustryInsights = z.infer<typeof industryInsightsSchema>;

export const interviewQuestionsSchema = z.object({
  questions: z
    .array(
      z
        .object({
          question: z.string(),
          options: z.array(z.string()).length(4),
          correctAnswer: z.string(),
          explanation: z.string(),
        })
        .refine(
          (question) => question.options.includes(question.correctAnswer),
          "Correct answer must match an option",
        ),
    )
    .min(1),
});
