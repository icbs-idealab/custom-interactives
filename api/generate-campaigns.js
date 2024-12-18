import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Securely use the API key from Vercel environment variables
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { startupIdea, targetAudience } = req.body;

  try {
    const response = await openai.beta.chat.completions.parse({
      model: "gpt-4o-2024-08-06",
      messages: [
        {
          role: "system",
          content:
            "You are a marketing expert generating structured campaign ideas.",
        },
        {
          role: "user",
          content: `Create three marketing campaign ideas for the following:
          - Startup Idea: ${startupIdea}
          - Target Audience: ${targetAudience}
          Respond strictly in JSON format.`,
        },
      ],
      response_format: { type: "json" },
    });

    res.status(200).json(response.choices[0].message.parsed);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to generate campaigns" });
  }
}
