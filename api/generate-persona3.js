// api/generate-persona2.js

import OpenAI from "openai";
import { z } from "zod";
import { zodResponseFormat } from "openai/helpers/zod";

// Initialize OpenAI with your API key
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Ensure your API key is set in Vercel's environment variables
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
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { brandName, brandDescription } = req.body;

  if (!brandName || !brandDescription) {
    return res.status(400).json({ error: "Missing brandName or brandDescription" });
  }

  try {
    // Set headers for SSE
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache, no-transform");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders(); // Flush the headers to establish SSE with the client

    // Initialize OpenAI streaming for persona generation
    const personaStream = await openai.chat.completions.create({
      model: "gpt-4o-mini-2024-07-18", // Replace with your desired model
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

Do not always use basic English names; it should be 50/50 as to whether you use bog-standard British names or not. Similarly, it should be 50/50 as to whether you use male or female names.

Respond using only valid JSON that exactly conforms to the provided schema.
          `,
        },
      ],
      temperature: 1, // Increase randomness
      stream: true, // Enable streaming
    });

    let personaData = "";

    // Function to send data to the client
    const sendSSE = (data) => {
      res.write(`data: ${JSON.stringify(data)}\n\n`);
    };

    // Listen to the stream and send data incrementally
    personaStream.on("data", (chunk) => {
      const parsed = chunk.choices?.[0]?.delta?.content;
      if (parsed) {
        personaData += parsed;
        // Attempt to parse the JSON as it builds
        try {
          const json = JSON.parse(personaData);
          // Validate against Zod schema
          PersonaSchema.parse(json);
          // If valid, send the current data
          sendSSE(json);
        } catch (err) {
          // If JSON is incomplete, wait for more data
        }
      }
    });

    personaStream.on("end", async () => {
      // Once streaming is done, parse the complete persona data
      let parsedPersona;
      try {
        parsedPersona = PersonaSchema.parse(JSON.parse(personaData));
      } catch (parseError) {
        console.error("Error parsing persona JSON:", parseError);
        sendSSE({ error: "Invalid persona format." });
        res.end();
        return;
      }

      // --- DALL·E Image Generation ---
      try {
        const { name, age, gender, occupation, location } = parsedPersona.demographics || {};
        const imagePrompt = `A realistic portrait of a ${age}-year-old ${gender} named ${name}, a ${occupation} from ${location}, digital art, highly detailed, professional, photorealistic.`;

        const imageResponse = await openai.images.generate({
          prompt: imagePrompt,
          n: 1,
          size: "512x512", // Adjust size as needed
          response_format: "url",
        });

        if (imageResponse.data && imageResponse.data.length > 0) {
          parsedPersona.imageUrl = imageResponse.data[0].url;
          // Send the image URL to the client
          sendSSE({ imageUrl: parsedPersona.imageUrl });
        }
      } catch (imageError) {
        console.error("Error generating DALL·E image:", imageError);
        // If there's an error, stream an error message
        sendSSE({ error: "Failed to generate image." });
      }
      // --- End DALL·E Image Generation ---

      // End the SSE stream
      res.write("event: end\ndata: \n\n");
      res.end();
    });

    personaStream.on("error", (error) => {
      console.error("Error during persona generation:", error);
      sendSSE({ error: "Failed to generate consumer persona." });
      res.end();
    });
  } catch (error) {
    console.error("Error generating consumer persona:", error);
    sendSSE({ error: "Failed to generate consumer persona.", details: error.message || "Unknown error occurred." });
    res.end();
  }
}
