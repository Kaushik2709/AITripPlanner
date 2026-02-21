import { GoogleGenerativeAI } from "@google/generative-ai";

const generateTripItinerary = async (tripDetails) => {
  const { destination, duration, budget, companions } = tripDetails;

  const key = process.env.GEMINI_API_KEY;
  const genAI = new GoogleGenerativeAI(key);
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

  const prompt = `
    Generate a detailed travel itinerary for a trip to ${destination}.
    Duration: ${duration} days.
    Budget: ${budget}.
    Companions: ${companions}.
    
    Please provide the response in a structured JSON format.
    The JSON should have an architectural style like this:
    {
      "tripTitle": "...",
      "description": "...",
      "itinerary": [
        {
          "day": 1,
          "theme": "...",
          "activities": [
            {
              "time": "morning",
              "activity": "...",
              "location": "...",
              "description": "..."
            },
            ...
          ],
          "food": {
            "breakfast": "...",
            "lunch": "...",
            "dinner": "..."
          }
        },
        ...
      ],
      "travelTips": ["...", "..."],
      "estimatedExpenses": {
        "accommodation": "...",
        "food": "...",
        "activities": "..."
      }
    }
    Only return the JSON object, no other text.
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Clean potential markdown if AI returns it
    const jsonString = text.replace(/```json|```/g, '').trim();
    return JSON.parse(jsonString);
  } catch (error) {
    console.error("Gemini API Error Detail:", error.message || error);
    throw new Error(`Failed to generate itinerary: ${error.message || 'Unknown error'}`);
  }
};

export { generateTripItinerary };
