import "server-only";
import { GoogleGenAI, type GenerateContentParameters } from "@google/genai";

// Stable, free-tier model. Override explicitly when deploying to another tier.
export const DEFAULT_GEMINI_MODEL = "gemini-3.5-flash-lite";
let client: GoogleGenAI | undefined;

export async function generateContent(
  parameters: Omit<GenerateContentParameters, "model">,
) {
  const apiKey = process.env.GENAI_API_KEY;
  if (!apiKey) throw new Error("GENAI_API_KEY is not configured.");
  client ??= new GoogleGenAI({ apiKey });
  const response = await client.models.generateContent({
    ...parameters,
    model: process.env.GEMINI_MODEL || DEFAULT_GEMINI_MODEL,
  });
  if (!response.text?.trim())
    throw new Error("The AI returned an empty response. Please try again.");
  return response;
}
