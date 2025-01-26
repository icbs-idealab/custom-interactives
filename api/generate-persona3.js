import OpenAI from "openai";
import { z } from "zod";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Zod schema for your persona
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
  imageUrl: z.string().optional(),
});

export default async function handler(req, res) {
  // Force GET if you prefer SSE via GET. If you want POST body data, you'll
  // need some extra nuance (SSE typically uses GET).  
  // For simplicity, let's do brand name/desc via query params:
  if (req.method !== "GET") {
    return res.status(405).send("Method not allowed - use GET for SSE.");
  }

  // Grab brand info from query
  const brandName = req.query.brandName || "";
  const brandDescription = req.query.brandDescription || "";

  // 1) Set SSE headers
  res.setHeader("Cache-Control", "no-cache, no-transform");
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Connection", "keep-alive");
  // Helpful for some serverless setups to flush headers immediately:
  if (res.flushHeaders) {
    res.flushHeaders();
  }

  try {
    // 2) Start streaming from OpenAI
    const completionStream = await openai.chat.completions.create({
      model: "gpt-4",
      stream: true,
      temperature: 1,
      messages: [
        {
          role: "system",
          content:
            "You are a marketing expert generating a structured consumer persona. " +
            "Output valid JSON matching the provided schema, without extra text. " +
            "But do so in a streaming manner so the user sees tokens in real-time.",
        },
        {
          role: "user",
          content: `Generate a consumer persona using these brand details:
- Brand Name: ${brandName}
- Brand Description: ${brandDescription}

The persona must include these properties:
- demographics (name, age, gender, occupation, incomeLevel, educationLevel, location)
- psychographics (valuesAndBeliefs, lifestyle, personalityTraits, goalsAndAspirations)
- behavioral (buyingHabits, painPoints, motivations, preferredChannels)
- situational (technologyUsage, decisionMakingProcess, brandAffinities, roleInBuyingProcess)
- quote
- scenario
- personalityRadar with numeric values (0-100) for: openness, conscientiousness, extraversion, agreeableness, neuroticism

Return strictly valid JSON that matches the schema. Do not add extra commentary or text outside the JSON.`,
        },
      ],
    });

    let fullResponse = "";

    // 3) Stream out partial tokens + accumulate
    for await (const chunk of completionStream) {
      const contentChunk = chunk.choices[0]?.delta?.content;
      if (contentChunk) {
        // Send partial text down to the client
        res.write(
          `data: ${JSON.stringify({ type: "chunk", text: contentChunk })}\n\n`
        );
        // Also accumulate the entire string so we can parse it at the end
        fullResponse += contentChunk;
      }
    }

    // 4) Once done, parse the final JSON
    let personaData;
    try {
      personaData = JSON.parse(fullResponse);
    } catch (err) {
      // If it fails to parse, let the client know
      res.write(
        `data: ${JSON.stringify({
          type: "error",
          error: "Failed to parse JSON from streamed content.",
        })}\n\n`
      );
      res.end();
      return;
    }

    // Optionally validate with Zod
    try {
      PersonaSchema.parse(personaData);
    } catch (zodErr) {
      console.error("Zod validation error:", zodErr);
      res.write(
        `data: ${JSON.stringify({
          type: "error",
          error: "Persona JSON structure did not match schema.",
          details: zodErr.issues,
        })}\n\n`
      );
      res.end();
      return;
    }

    // 5) DALL·E image generation
    try {
      const { name, age, gender } = personaData.demographics;
      const imagePrompt = `A realistic portrait of a ${age}-year-old ${gender} named ${name}, digital art, highly detailed, professional, photorealistic.`;
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
      // If it fails, oh well, we skip
    }

    // 6) Send final persona data to client
    res.write(
      `data: ${JSON.stringify({ type: "final", persona: personaData })}\n\n`
    );

    // 7) Let the client know we're done:
    res.write(`data: [DONE]\n\n`);
    res.end();
  } catch (error) {
    console.error("Error in SSE persona generation:", error);
    res.write(
      `data: ${JSON.stringify({
        type: "error",
        error: error.message || "Unknown error",
      })}\n\n`
    );
    res.end();
  }
}
