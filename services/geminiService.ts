
import { GoogleGenAI } from "@google/genai";
import { InventoryItem } from "../types";

export const analyzeInventory = async (items: InventoryItem[]) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `Analyze the following inventory and marketplace data for the KORD Asset Engine. 
  Identify stock in/out flow patterns, prioritize reorders for marketplace-linked items, 
  and highlight potential revenue risks on Takealot.
  
  Inventory Data:
  ${JSON.stringify(items, null, 2)}
  
  Format the response as a high-level strategic report for an executive dashboard.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || "Analysis engine offline.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Audit failed. Check uplink.";
  }
};

export const chatWithInventory = async (query: string, items: InventoryItem[]) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `You are KORD AI, the central nervous system for an enterprise warehouse. 
  You manage assets and marketplace integrations (Takealot, etc.). 
  Inventory: ${JSON.stringify(items)} 
  Query: "${query}"
  Answer like a high-tech facility manager. Focus on stock flow and marketplace performance.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || "Command unrecognized.";
  } catch (error) {
    console.error("Gemini Chat Error:", error);
    return "Terminal signal lost.";
  }
};
