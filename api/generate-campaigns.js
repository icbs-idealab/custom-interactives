import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Use secure API key
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { startupIdea, targetAudience } = req.body;

  try {
    const stream = await openai.beta.chat.completions.stream({
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
      response_format: { type: "json_object" }, // Ensure JSON output
    });

    res.writeHead(200, { "Content-Type": "application/json" });
    for await (const chunk of stream) {
      res.write(JSON.stringify(chunk)); // Stream chunks to the client
    }
    res.end();
  } catch (error) {
    console.error("Error from OpenAI:", error);
    res
      .status(500)
      .json({ error: "Failed to generate campaigns", details: error.message });
  }
}
