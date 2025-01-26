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
    age: z.string(),
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
  personalityRadar: z.object({
    openness: z.number(),
    conscientiousness: z.number(),
    extraversion: z.number(),
    agreeableness: z.number(),
    neuroticism: z.number(),
  }),
  // Changed to plain string so that "format": "url" won't appear in the JSON schema
  imageUrl: z.string().optional(),
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { brandName, brandDescription } = req.body;

  try {
    // Use GPT-4o with Structured Outputs to create a persona JSON
    const completion = await openai.beta.chat.completions.parse({
      model: "gpt-4o-mini-2024-07-18", // or another supported GPT-4o model
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

Additionally, include a new property called "personalityRadar" with numeric values (each between 0 and 100) for the following traits:
- Openness
- Conscientiousness
- Extraversion
- Agreeableness
- Neuroticism

Do not always use basic English names; it should be 50/50 as to whether you use bog-standard British names or not. Similarly, should be 50/50 as to whether you use male or female names.

Respond using only valid JSON that exactly conforms to the provided schema.
          `,
        },
      ],
      temperature: 1, // Increase randomness
      response_format: zodResponseFormat(PersonaSchema, "persona"),
    });

    console.log("Full completion object:", JSON.stringify(completion, null, 2));

    // Extract the structured persona from the response
    const personaData = completion.choices[0].message.parsed;
    console.log("Parsed persona data:", JSON.stringify(personaData, null, 2));

    // --- DALL·E Image Generation ---
    try {
      const { name, age, gender } = personaData.demographics || {};
      const imagePrompt = `A realistic photo of a ${age}-year-old ${gender} named ${name}, highly detailed, professional, photorealistic.`;

      const imageResponse = await openai.images.generate({
        prompt: imagePrompt,
        n: 1,
        size: "256x256",
      });

      if (imageResponse.data && imageResponse.data.length > 0) {
        personaData.imageUrl = imageResponse.data[0].url;
      }
    } catch (imageError) {
      console.error("Error generating DALL·E image:", imageError);
      // If there's an error, we just won't set personaData.imageUrl
    }
    // --- End DALL·E Image Generation ---

    // Return only the persona data
    return res.status(200).json(personaData);
  } catch (error) {
    console.error("Error generating consumer persona:", error);
    return res.status(500).json({
      error: "Failed to generate consumer persona",
      details: error.message || "Unknown error occurred",
    });
  }
}
