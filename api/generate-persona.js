import OpenAI from "openai";
import { z } from "zod";
import { zodResponseFormat } from "openai/helpers/zod";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Ensure your API key is set
});

// Define the persona schema using Zod
const PersonaSchema = z.object({
  demographics: z.object({
    name: z.string(),
    age: z.string(), // or z.number() if you prefer, adjust prompt accordingly
    gender: z.string(),
    occupation: z.string(),
    incomeLevel: z.string(),
    educationLevel: z.string(),
    location: z.string(),
  }),
  psychographics: z.object({
    valuesAndBeliefs: z.string(),
    lifestyle: z.string(),
    personalityTraits: z.string(),
    goalsAndAspirations: z.string(),
  }),
  behavioral: z.object({
    buyingHabits: z.string(),
    painPoints: z.string(),
    motivations: z.string(),
    preferredChannels: z.string(),
  }),
  situational: z.object({
    technologyUsage: z.string(),
    decisionMakingProcess: z.string(),
    brandAffinities: z.string(),
    roleInBuyingProcess: z.string(),
  }),
  quote: z.string(),
  scenario: z.string(),
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { brandName, brandDescription } = req.body;

  try {
    // 1) Use GPT-4o with Structured Outputs to create a persona JSON
    const completion = await openai.beta.chat.completions.parse({
      model: "gpt-4o-2024-08-06", // or another supported GPT-4o model
      messages: [
        {
          role: "system",
          content: `
You are a marketing expert generating a structured consumer persona.
Follow the schema exactly as provided.
          `,
        },
        {
          role: "user",
          content: `
Generate a consumer persona using the following brand details:
- Brand Name: ${brandName}
- Brand Description: ${brandDescription}

The persona must include:
- Demographics: name, age, gender, occupation, income level, education level, location
- Psychographics: values and beliefs, lifestyle, personality traits, goals and aspirations
- Behavioral: buying habits, pain points, motivations, preferred channels
- Situational: technology usage, decision-making process, brand affinities, role in buying process
- A short quote
- A short scenario describing a day in their life or their interaction with the brand

Respond using only valid JSON that exactly conforms to the provided schema.
          `,
        },
      ],
      response_format: zodResponseFormat(PersonaSchema, "persona"),
    });

    // Extract the structured persona from the response
    const personaData = completion.choices[0].message.parsed;

    // 2) Generate an image using DALL·E 3
    // Create an image prompt that uses some persona details (adjust as desired)
    const imagePrompt = `
Create a portrait of a ${
      personaData.demographics.age || "35-year-old"
    } ${personaData.demographics.gender || "person"}
who works as a ${personaData.demographics.occupation || "professional"}.
The portrait should reflect a style that fits a consumer who embraces a ${
      personaData.psychographics.lifestyle || "modern"
    } lifestyle. Use a minimal background.
`;

    const imageResponse = await openai.images.generate({
      prompt: imagePrompt,
      n: 1,
      size: "512x512", // You can also use 1024x1024 if preferred
    });

    // Extract the image URL
    const imageUrl = imageResponse.data[0].url;

    // Combine persona data and image URL in the final response
    const finalResponse = {
      ...personaData,
      imageUrl,
    };

    return res.status(200).json(finalResponse);
  } catch (error) {
    console.error("Error generating consumer persona:", error);

    res.status(500).json({
      error: "Failed to generate consumer persona",
      details: error.message || "Unknown error occurred",
    });
  }
}
