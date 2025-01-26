

const OpenAI = require("openai");
const { z } = require("zod");
const { Readable } = require("stream");
require("dotenv").config();

// Initialize OpenAI with your API key
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Ensure your API key is set in Vercel's environment variables
});

// Define the persona schema using Zod (including the new "imageUrl" field)
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
  imageUrl: z.string().url().optional(), // Optional until generated
});

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const { brandName, brandDescription } = req.body;

  if (!brandName || !brandDescription) {
    res.status(400).json({ error: "Missing brandName or brandDescription" });
    return;
  }

  try {
    // Set headers for SSE
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache, no-transform");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders(); // Flush the headers to establish SSE with the client

    // Initialize OpenAI streaming for persona generation
    const personaStream = await openai.chat.completions.create({
      model: "gpt-4o-mini", // Replace with your desired model
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

Additionally, include a new property called "personalityRadar" with numeric values (each between 0 and 100) for the following traits (try to vary it but based on the description of their persona):
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

    // Stream persona data to the client
    for await (const chunk of personaStream) {
      if (chunk.choices && chunk.choices[0].delta && chunk.choices[0].delta.content) {
        const content = chunk.choices[0].delta.content;
        personaData += content;

        // Stream the chunk to the client
        res.write(`data: ${content}\n\n`);
      }
    }

    // Once persona data is fully received, parse it
    let parsedPersona;
    try {
      parsedPersona = PersonaSchema.parse(JSON.parse(personaData));
    } catch (parseError) {
      console.error("Error parsing persona JSON:", parseError);
      res.write(`data: {"error": "Invalid persona format."}\n\n`);
      res.end();
      return;
    }

    // --- DALL·E Image Generation ---
    try {
      const { name, age, gender, occupation, location } = parsedPersona.demographics || {};
      const imagePrompt = `A professional portrait of ${name}, a ${age}-year-old ${gender} ${occupation} from ${location}.`;

      const imageResponse = await openai.images.generate({
        prompt: imagePrompt,
        n: 1,
        size: "512x512", // Adjust size as needed
        response_format: "url",
      });

      if (imageResponse.data && imageResponse.data.length > 0) {
        const imageUrl = imageResponse.data[0].url;
        parsedPersona.imageUrl = imageUrl;

        // Stream the image URL to the client
        res.write(`data: ${JSON.stringify({ imageUrl })}\n\n`);
      }
    } catch (imageError) {
      console.error("Error generating DALL·E image:", imageError);
      // If there's an error, stream an error message
      res.write(`data: {"error": "Failed to generate image."}\n\n`);
    }
    // --- End DALL·E Image Generation ---

    // End the SSE stream
    res.write("event: end\ndata: \n\n");
    res.end();
  } catch (error) {
    console.error("Error generating consumer persona:", error);
    res.write(
      `data: {"error": "Failed to generate consumer persona.", "details": "${error.message || "Unknown error."}"}\n\n`
    );
    res.end();
  }
};
