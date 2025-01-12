import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { brandName, brandDescription } = req.body;

  try {
    // Generate persona text
    const textResponse = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a marketing expert creating detailed consumer personas.",
        },
        {
          role: "user",
          content: `Create a detailed consumer persona for the following brand:
            Brand Name: ${brandName}
            Brand Description: ${brandDescription}
            
            Provide a JSON response with the following structure:
            {
              "demographics": { ... },
              "psychographics": { ... },
              "behavioralCharacteristics": { ... },
              "situationalDetails": { ... },
              "contextualElements": { ... }
            }`
        },
      ],
      temperature: 0.7,
    });

    // Log and parse
    const rawContent = textResponse.choices[0].message.content.trim();
    console.log("ChatGPT output:", rawContent);
    const persona = JSON.parse(rawContent);

    // Generate image (remove model parameter for now)
    const imagePrompt = `Professional headshot of ${persona.demographics.name}, ...`;
    const imageResponse = await openai.images.generate({
      prompt: imagePrompt,
      size: "1024x1024",
      n: 1,
    });

    // Combine text and image data
    const responseData = {
      ...persona,
      image: imageResponse.data[0].url,
    };

    return res.status(200).json(responseData);
  } catch (error) {
    console.error("Error generating persona:", error);
    return res.status(500).json({
      error: "Failed to generate persona",
      details: error.message || "Unknown error occurred",
    });
  }
}
