
import { GoogleGenAI, Type } from "@google/genai";

export async function analyzeImage(base64Image: string, mimeType: string) {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  const prompt = `
    Analyze this photo for a photography contest. 
    1. Suggest a creative title.
    2. Provide 3-4 descriptive tags.
    3. Write a professional, brief (1-2 sentences) critique of its composition or mood.
    4. Categorize it into one of: Nature, Urban, Minimalist, Portrait, Cozy.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        {
          parts: [
            { text: prompt },
            {
              inlineData: {
                data: base64Image,
                mimeType: mimeType
              }
            }
          ]
        }
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            tags: { 
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            critique: { type: Type.STRING },
            category: { type: Type.STRING }
          },
          required: ["title", "tags", "critique", "category"]
        }
      }
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return null;
  }
}
