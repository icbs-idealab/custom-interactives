import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Ensure this is set in your environment variables
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { startupIdea, targetAudience } = req.body;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // or 'gpt-4' if you have access
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

Respond ONLY in JSON format, without any additional text or explanation. Use the following template:

{
  "campaigns": [
    {
      "name": "string",
      "approach": "string",
      "platforms": ["string"],
      "engagementMethods": ["string"],
      "evaluationMetrics": ["string"]
    },
    ...
  ]
}

Ensure the JSON is valid and can be parsed by JSON.parse() in JavaScript.`,
        },
      ],
      temperature: 0, // For more deterministic output
    });

    const assistantMessage = response.choices[0].message.content;

    // Try parsing the assistant's message as JSON
    let parsedContent;
    try {
      parsedContent = JSON.parse(assistantMessage);
    } catch (parseError) {
      console.error("Error parsing assistant message as JSON:", parseError);
      console.error("Assistant message:", assistantMessage);
      return res
        .status(500)
        .json({ error: "Failed to parse response from OpenAI" });
    }

    // Return the parsed content to the client
    res.status(200).json(parsedContent);
  } catch (error) {
    console.error("Error from OpenAI:", error);
    res.status(500).json({
      error: "Failed to generate campaigns",
      details: error.message || "Unknown error occurred",
    });
  }
}
