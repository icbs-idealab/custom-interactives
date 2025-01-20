import OpenAI from "openai";
import { z } from "zod";
import { zodResponseFormat } from "openai/helpers/zod";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Ensure your API key is set
});

// Define the schema for the risk response
const RiskResponseSchema = z.object({
  jobTitle: z.string(),
  riskScore: z.number().min(0).max(10),
  explanation: z.string(),
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { jobTitle } = req.body;

  try {
    const completion = await openai.beta.chat.completions.parse({
      model: "gpt-4o-mini-2024-07-18",
      messages: [
        {
          role: "system",
          content: "You are an AI expert assessing the automation risk of job roles.",
        },
        {
          role: "user",
          content: `Evaluate the risk of automation for the job title: "${jobTitle}".
          Provide:
          - A risk score between 0 (no risk) and 10 (high risk).
          - A brief explanation for the score.`,
        },
      ],
      temperature: 0.7,
      response_format: zodResponseFormat(RiskResponseSchema, "riskResponse"),
    });

    const riskData = completion.choices[0].message.parsed;

    return res.status(200).json(riskData);
  } catch (error) {
    console.error("Error generating risk assessment:", error);
    return res.status(500).json({
      error: "Failed to assess automation risk",
      details: error.message || "Unknown error occurred",
    });
  }
}
