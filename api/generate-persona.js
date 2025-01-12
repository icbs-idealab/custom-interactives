import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Make sure this is set in your environment variables
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { brandName, brandDescription } = req.body;

  try {
    // 1) Use GPT-3.5-Turbo to create a persona JSON
    const chatResponse = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `
You are a marketing expert generating a structured consumer persona. 
Output must be valid JSON with the following structure:

{
  "demographics": {
    "name": "string",
    "age": "string or number",
    "gender": "string",
    "occupation": "string",
    "incomeLevel": "string",
    "educationLevel": "string",
    "location": "string"
  },
  "psychographics": {
    "valuesAndBeliefs": "string",
    "lifestyle": "string",
    "personalityTraits": "string",
    "goalsAndAspirations": "string"
  },
  "behavioral": {
    "buyingHabits": "string",
    "painPoints": "string",
    "motivations": "string",
    "preferredChannels": "string"
  },
  "situational": {
    "technologyUsage": "string",
    "decisionMakingProcess": "string",
    "brandAffinities": "string",
    "roleInBuyingProcess": "string"
  },
  "quote": "string",
  "scenario": "string"
}
Answer only with JSON, no extra text.`,
        },
        {
          role: "user",
          content: `
Given the following brand:
- Brand Name: ${brandName}
- Brand Description: ${brandDescription}

Create a consumer persona card that includes:
Demographics (name, age, gender, occupation, income level, education level, location),
Psychographics (values and beliefs, lifestyle, personality traits, goals, aspirations),
Behavioral characteristics (buying habits, pain points, motivations, preferred channels),
Situational details (technology usage, decision-making process, brand affinities, role in the buying process),
A short quote,
And a short scenario describing a day in their life or typical interaction with the brand.
`,
        },
      ],
      temperature: 0,
    });

    const assistantMessage = chatResponse.choices[0].message.content;

    // Try parsing the assistant's message as JSON
    let personaData;
    try {
      personaData = JSON.parse(assistantMessage);
    } catch (parseError) {
      console.error("Error parsing assistant message as JSON:", parseError);
      console.error("Assistant message:", assistantMessage);
      return res.status(500).json({
        error: "Failed to parse persona data from OpenAI",
      });
    }

    // 2) Generate an image using DALL·E 3
    // We'll base the prompt on some persona details (like age, gender) to get a relevant image.
    // Note that DALL·E 3 uses the same `createImage` endpoint in the Node.js OpenAI library (as of now).
    const imagePrompt = `
Portrait photo of a ${personaData.demographics?.age || "35-year-old"} 
${personaData.demographics?.gender || "person"} 
who is a ${personaData.demographics?.occupation || "professional"} 
in a style that reflects their lifestyle (${personaData.psychographics?.lifestyle || "modern"}).
Background is simple, minimal.
`;

    const imageResponse = await openai.images.generate({
      prompt: imagePrompt,
      n: 1,
      size: "512x512", // or '1024x1024'
    });

    // Extract the image URL from the response
    const imageUrl = imageResponse.data[0].url;

    // Combine the personaData and the imageUrl into a single JSON object
    const finalResponse = {
      ...personaData,
      imageUrl,
    };

    return res.status(200).json(finalResponse);
  } catch (error) {
    console.error("Error from OpenAI:", error);
    res.status(500).json({
      error: "Failed to generate consumer persona",
      details: error.message || "Unknown error occurred",
    });
  }
}
