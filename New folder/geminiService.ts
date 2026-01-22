
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateTrekDetails = async (prompt: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Suggest a unique trekking itinerary and details based on this interest: ${prompt}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            location: { type: Type.STRING },
            description: { type: Type.STRING },
            difficulty: { type: Type.STRING },
            cost: { type: Type.STRING },
            journey: { type: Type.STRING },
            requirements: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          }
        }
      }
    });

    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Error generating trek details:", error);
    return null;
  }
};
