import { Inngest } from "inngest";

// Create a client to send and receive events
export const inngest = new Inngest({ 
    id: "zenith",
    name: "Zenith",
    credentials: {
        gemini: {
            apiKey: process.env.GENAI_API_KEY || "",
        }
    }
});
