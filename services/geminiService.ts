
import { GoogleGenAI, Type } from "@google/genai";

// Always use named parameter and process.env.API_KEY directly for initialization
const apiKey = process.env.API_KEY || '';
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export const generateProductDescription = async (productName: string, category: string): Promise<string> => {
  if (!ai) return "Fresh from our farm to your table. 🥬 #FarmFresh #Organic";
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: `Create an Instagram-style catchy caption for a farm-fresh product named "${productName}" in the category "${category}". Include emojis and hashtags. Keep it under 50 words.`,
      config: {
        temperature: 0.8,
      },
    });
    // Use the .text property directly, do not call as a method
    return response.text || "Fresh from our farm to your table. 🥬 #FarmFresh #Organic";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Fresh from our farm to your table.";
  }
};

export const summarizeFeedbackReport = async (reviews: any[]): Promise<string> => {
  if (!ai) return "Feedback report currently unavailable.";
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: `Summarize the following customer feedback into a constructive "Farmer Report". Highlight what customers love and what can be improved: ${JSON.stringify(reviews)}`,
      config: {
        temperature: 0.3,
      }
    });
    // Use the .text property directly
    return response.text || "No feedback to summarize.";
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return "Feedback report currently unavailable.";
  }
};

export const simulateChatResponse = async (userMessage: string, productName: string): Promise<string> => {
  if (!ai) return "I'll check on that for you right now!";
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: `You are a friendly local farmer. A customer is asking about your "${productName}". Customer says: "${userMessage}". Respond naturally and helpfully.`,
      config: { temperature: 0.7 }
    });
    // Use the .text property directly
    return response.text || "Thanks for asking! It's fresh and ready for you.";
  } catch (error) {
    return "I'll check on that for you right now!";
  }
};
