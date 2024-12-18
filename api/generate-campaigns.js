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
    const response = await openai.beta.chat.completions.create({
      model: "gpt-4o", // Use the correct model name
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
      response_format: { type: "json_object" }, // Use "json_object" here
    });

    res.status(200).json(response.choices[0].message.content);
  } catch (error) {
    console.error("Error from OpenAI:", error);
    res
      .status(500)
      .json({ error: "Failed to generate campaigns", details: error.message });
  }
}
