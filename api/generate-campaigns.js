import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Use the secure environment variable
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { startupIdea, targetAudience } = req.body;

  try {
    const response = await openai.beta.chat.completions.parse({
      model: "gpt-4o-2024-08-06", // Ensure you're using a valid model
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
      response_format: { type: "json_object" }, // Correct response format
    });

    // Log response for debugging
    console.log("OpenAI Response:", response);

    res.status(200).json(response.choices[0].message.parsed);
  } catch (error) {
    console.error("Error from OpenAI:", error);
    res.status(500).json({
      error: "Failed to generate campaigns",
      details: error.message || "Unknown error occurred",
    });
  }
}
