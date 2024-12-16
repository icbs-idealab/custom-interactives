
import React, { useState } from "react";

const AIPersonaBuilder = () => {
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [validationError, setValidationError] = useState("");
  const storageKey = "marketing_campaigns_generated";
  const hasGenerated = localStorage.getItem(storageKey);

  const [formData, setFormData] = useState({
    targetAudience: "",
    brandName: "",
    brandDescription: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const isFormValid = () => {
    return Object.values(formData).every(value => value.trim() !== "");
  };

  const generateAnalysis = async () => {
    if (!isFormValid()) {
      setValidationError("Please fill in all fields before generating campaigns");
      return;
    }
    setValidationError("");
    setLoading(true);
    try {
      const analysisResponse = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
          },
          body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [
              {
                role: "user",
                content: `Generate three marketing campaign ideas for a brand with the following details:
                Target Audience: ${formData.targetAudience}
                Brand Name: ${formData.brandName}
                Brand Description: ${formData.brandDescription}
                
                Respond with a strict JSON object using this format:
                {
                  "campaigns": [
                    {
                      "name": "campaign name",
                      "description": "campaign description",
                      "platforms": ["platform1", "platform2"],
                      "engagementStrategies": ["strategy1", "strategy2"],
                      "risks": ["risk1", "risk2"],
                      "opportunities": ["opportunity1", "opportunity2"]
                    }
                  ]
                }`,
              },
            ],
          }),
        },
      );

      const data = await analysisResponse.json();
      const generatedAnalysis = JSON.parse(data.choices[0].message.content);
      setAnalysis(generatedAnalysis);
      localStorage.setItem(storageKey, "true");
    } catch (error) {
      console.error("Error:", error);
    }
    setLoading(false);
  };

  const resetAnalysis = () => {
    localStorage.removeItem(storageKey);
    setAnalysis(null);
    setFormData({
      targetAudience: "",
      brandName: "",
      brandDescription: "",
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Marketing Campaign Generator
      </h1>

      <div className="space-y-6 mb-8">
        <div className="transform transition-all hover:scale-[1.02]">
          <label className="block text-lg font-semibold text-indigo-700 mb-2">
            Target Audience
          </label>
          <textarea
            name="targetAudience"
            value={formData.targetAudience}
            onChange={handleChange}
            className="mt-1 block w-full rounded-xl border-2 border-indigo-200 shadow-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/50 bg-gradient-to-r from-white to-indigo-50 p-4 text-gray-700 placeholder-gray-400 transition-all duration-300"
            placeholder="Describe your target audience (demographics, interests, behaviors)"
            rows="3"
          />
        </div>

        <div className="transform transition-all hover:scale-[1.02]">
          <label className="block text-lg font-semibold text-purple-700 mb-2">
            Brand Name
          </label>
          <input
            type="text"
            name="brandName"
            value={formData.brandName}
            onChange={handleChange}
            className="mt-1 block w-full rounded-xl border-2 border-purple-200 shadow-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 bg-gradient-to-r from-white to-purple-50 p-4 text-gray-700 placeholder-gray-400 transition-all duration-300"
            placeholder="Enter your brand name"
          />
        </div>

        <div className="transform transition-all hover:scale-[1.02]">
          <label className="block text-lg font-semibold text-pink-700 mb-2">
            Brand Description
          </label>
          <textarea
            name="brandDescription"
            value={formData.brandDescription}
            onChange={handleChange}
            className="mt-1 block w-full rounded-xl border-2 border-pink-200 shadow-lg focus:border-pink-500 focus:ring-2 focus:ring-pink-500/50 bg-gradient-to-r from-white to-pink-50 p-4 text-gray-700 placeholder-gray-400 transition-all duration-300"
            placeholder="What does your brand do? What problems does it solve?"
            rows="3"
          />
        </div>
      </div>

      {validationError && (
        <p className="text-red-500 text-sm mb-2">{validationError}</p>
      )}
      <button
        onClick={generateAnalysis}
        disabled={loading || hasGenerated}
        className={`w-full py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
          hasGenerated
            ? "bg-gray-400 text-gray-600 cursor-not-allowed"
            : "bg-indigo-600 text-white hover:bg-indigo-700"
        }`}
      >
        {loading
          ? "Generating..."
          : hasGenerated
            ? "Campaigns Generated"
            : "Generate Campaigns"}
      </button>

      {hasGenerated && (
        <button
          onClick={resetAnalysis}
          className="mt-4 w-full bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition"
        >
          Reset & Generate New Campaigns
        </button>
      )}

      {analysis && (
        <div className="mt-8 space-y-6">
          {analysis.campaigns.map((campaign, index) => (
            <div
              key={index}
              className="p-6 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg"
            >
              <h3 className="text-xl font-bold mb-3 border-b border-white/20 pb-2">
                Campaign {index + 1}: {campaign.name}
              </h3>
              
              <div className="space-y-4">
                <div>
                  <p className="text-white/90">{campaign.description}</p>
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
                  <h4 className="font-semibold mb-2">Engagement Strategies</h4>
                  <ul className="list-disc ml-4 space-y-1">
                    {campaign.engagementStrategies.map((strategy, i) => (
                      <li key={i}>• {strategy}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Risks</h4>
                  <ul className="list-disc ml-4 space-y-1">
                    {campaign.risks.map((risk, i) => (
                      <li key={i}>• {risk}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Opportunities</h4>
                  <ul className="list-disc ml-4 space-y-1">
                    {campaign.opportunities.map((opportunity, i) => (
                      <li key={i}>• {opportunity}</li>
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

export default AIPersonaBuilder;
