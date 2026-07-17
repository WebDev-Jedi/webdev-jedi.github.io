import { GoogleGenAI, Type } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

let aiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not configured. Please add it to your secrets.");
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

export async function POST(req: NextRequest) {
  try {
    const { itemName, itemType, tone, preset, categoryLanguage = "uk" } = await req.json();

    if (!itemName) {
      return NextResponse.json({ error: "Item name is required" }, { status: 400 });
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ 
        error: "GEMINI_API_KEY is not configured. Please add it to your secrets." 
      }, { status: 500 });
    }

    const languageContext = categoryLanguage === "uk" || itemName.match(/[а-яА-ЯёЁіІїЇєЄґҐ]/)
      ? "Ukrainian"
      : "English";

    let presetInstructions = "";
    if (preset === "Aggressive") {
      presetInstructions = "Preset Style: Aggressive. Create bold, urgent, high-impact, attention-grabbing titles and descriptions. Use strong emotional triggers, high CTR action words, and compelling hooks.";
    } else if (preset === "Informative") {
      presetInstructions = "Preset Style: Informative. Focus heavily on descriptive, authoritative, informative, and value-focused details. Be helpful and clear, building maximum trust and clear utility descriptions.";
    } else {
      presetInstructions = "Preset Style: Standard. Balanced, natural, professional yet appealing. High-converting but compliant, natural integration of keywords with high-quality descriptions.";
    }

    const prompt = `You are a world-class SEO specialist and copywriting expert.
Generate exactly 3 different highly optimized, high-CTR SEO metadata templates (Title and Meta Description) for an adult entertainment/dating portal page or article/offer.

Target Item Name: "${itemName}"
Target Item Type: ${itemType || "Offer/Article"}
Copywriting Strategy/Tone: "${tone || "High-CTR / Captivating"}"
${presetInstructions}
Target Language: ${languageContext}

Specific Instructions:
1. Title must be under 60 characters. It should include high-CTR trigger words like "Verified", "Safe", "Anonymous", "Premium", "Direct", "HD", "No registration", or specific appeal based on the item type.
2. Meta Description must be between 120 and 160 characters. It must end with a clear Call to Action (CTA) and summarize the core value of the offer or article.
3. Incorporate relevant high-traffic keywords naturally.
4. Each suggestion must include a brief Ukrainian or English explanation of why this copy will achieve high CTR (Click-Through Rate).
5. Ensure the content complies with standard adult dating directory SEO best practices (alluring yet professional, avoiding spammy keywords that trigger search filters).`;

    const response = await getGeminiClient().models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            suggestions: {
              type: Type.ARRAY,
              description: "List of exactly 3 different high-CTR SEO suggestions",
              items: {
                type: Type.OBJECT,
                properties: {
                  title: {
                    type: Type.STRING,
                    description: "SEO Page Title (Title Tag) - Max 60 characters",
                  },
                  description: {
                    type: Type.STRING,
                    description: "SEO Meta Description - Max 160 characters",
                  },
                  explanation: {
                    type: Type.STRING,
                    description: "Brief explanation of the CTR trigger and strategy used",
                  },
                },
                required: ["title", "description", "explanation"],
              },
            },
            suggestedKeywords: {
              type: Type.ARRAY,
              description: "A list of 5-8 highly relevant meta keywords",
              items: {
                type: Type.STRING,
              },
            },
          },
          required: ["suggestions", "suggestedKeywords"],
        },
      },
    });

    const resultText = response.text;
    if (!resultText) {
      throw new Error("No response generated from Gemini");
    }

    const parsedResult = JSON.parse(resultText);
    return NextResponse.json(parsedResult);

  } catch (error: any) {
    console.error("Gemini SEO generator error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate SEO suggestions" }, 
      { status: 500 }
    );
  }
}
