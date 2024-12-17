
import React, { useState } from "react";
import OpenAI from "openai";
import { z } from "zod";
import { zodResponseFormat } from "openai/helpers/zod";

const openai = new OpenAI({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

const CampaignSchema = z.object({
  campaigns: z.array(
    z.object({
      name: z.string(),
      approach: z.string(),
      platforms: z.array(z.string()),
      engagementMethods: z.array(z.string()),
      evaluationMetrics: z.array(z.string()),
    }),
  ),
});

const MarketingCampaignGenerator = () => {
  const [loading, setLoading] = useState(false);
  const [campaigns, setCampaigns] = useState(null);
  const [formData, setFormData] = useState({
    startupIdea: "",
    targetAudience: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const isFormValid = () => {
    return Object.values(formData).every((value) => value.trim() !== "");
  };

  const generateCampaigns = async () => {
    if (!isFormValid()) {
      setError("Please fill in all fields.");
      return;
    }
    setError("");
    setLoading(true);

    try {
      const response = await openai.beta.chat.completions.parse({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content:
              "You are a marketing expert generating structured campaign ideas.",
          },
          {
            role: "user",
            content: `Create three marketing campaign ideas for the following:
            - Startup Idea: ${formData.startupIdea}
            - Target Audience: ${formData.targetAudience}

            Include:
            - A name for each campaign.
            - A suggested approach.
            - Platforms (e.g., social media, TV, online ads, etc.).
            - Engagement methods.
            - Evaluation metrics to measure success.`,
          },
        ],
        response_format: zodResponseFormat(CampaignSchema, "campaign_ideas"),
      });

      const parsedResponse = response.choices[0].message.parsed;
      setCampaigns(parsedResponse.campaigns);
    } catch (err) {
      console.error("Error:", err);
      setError("Failed to generate campaigns. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Marketing Campaign Generator
      </h1>

      <div className="space-y-6 mb-8">
        <div className="transform transition-all hover:scale-[1.02]">
          <label className="block text-lg font-semibold text-indigo-700 mb-2">
            Startup Idea
          </label>
          <textarea
            name="startupIdea"
            value={formData.startupIdea}
            onChange={handleChange}
            className="mt-1 block w-full rounded-xl border-2 border-indigo-200 shadow-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/50 bg-gradient-to-r from-white to-indigo-50 p-4 text-gray-700 placeholder-gray-400 transition-all duration-300"
            placeholder="Describe your startup idea..."
            rows="3"
          />
        </div>

        <div className="transform transition-all hover:scale-[1.02]">
          <label className="block text-lg font-semibold text-purple-700 mb-2">
            Target Audience
          </label>
          <textarea
            name="targetAudience"
            value={formData.targetAudience}
            onChange={handleChange}
            className="mt-1 block w-full rounded-xl border-2 border-purple-200 shadow-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 bg-gradient-to-r from-white to-purple-50 p-4 text-gray-700 placeholder-gray-400 transition-all duration-300"
            placeholder="Describe your target audience..."
            rows="3"
          />
        </div>
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <button
        onClick={generateCampaigns}
        disabled={loading}
        className="w-full py-2 px-4 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-300"
      >
        {loading ? "Generating..." : "Generate Campaign Ideas"}
      </button>

      {campaigns && (
        <div className="mt-8 space-y-6">
          {campaigns.map((campaign, index) => (
            <div
              key={index}
              className="p-6 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg"
            >
              <h3 className="text-xl font-bold mb-3 border-b border-white/20 pb-2">
                Campaign {index + 1}: {campaign.name}
              </h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Approach</h4>
                  <p className="text-white/90">{campaign.approach}</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Platforms</h4>
                  <ul className="list-disc ml-4 space-y-1">
                    {campaign.platforms.map((platform, i) => (
                      <li key={i}>• {platform}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Engagement Methods</h4>
                  <ul className="list-disc ml-4 space-y-1">
                    {campaign.engagementMethods.map((method, i) => (
                      <li key={i}>• {method}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Evaluation Metrics</h4>
                  <ul className="list-disc ml-4 space-y-1">
                    {campaign.evaluationMetrics.map((metric, i) => (
                      <li key={i}>• {metric}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MarketingCampaignGenerator;
