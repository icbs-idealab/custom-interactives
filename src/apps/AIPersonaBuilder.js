import React, { useState } from "react";

const AIPersonaBuilder = () => {
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [validationError, setValidationError] = useState("");
  const storageKey = "consumer_analysis_generated";
  const hasGenerated = localStorage.getItem(storageKey);

  const audienceProfiles = {
    gen_z_urban: "Gen Z Urban Professionals (18-25)",
    millennials: "Millennials (26-40)",
    gen_x: "Generation X (41-56)",
    boomers: "Baby Boomers (57-75)",
    custom: "Custom Profile",
  };

  const [formData, setFormData] = useState({
    profile: "",
    demographics: "",
    psychographics: "",
    behavior: "",
    context: "",
    campaignIdea: "",
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
      setValidationError("Please fill in all fields before generating analysis");
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
                content: `You are a marketing analysis tool. Create a JSON analysis of the following consumer audience:
              Profile: ${formData.profile}
              Demographics: ${formData.demographics}
              Psychographics: ${formData.psychographics}
              Behavioral Traits: ${formData.behavior}
              Context: ${formData.context}
              Campaign Idea: ${formData.campaignIdea}
              
              Respond with a strict JSON object using this exact format but use your imagination in the responses; you don't have to stick strictly to what was input entirely:
              {
                "consumerNeeds": ["need1", "need2"],
                "purchasingMotivations": ["motivation1", "motivation2"],
                "barriers": ["barrier1", "barrier2"],
                "emotionalTriggers": ["trigger1", "trigger2"],
                "engagementStrategies": {
                  "platforms": "platform description",
                  "tone": "tone description",
                  "contentTypes": "content types description"
                },
                "campaignFeedback": "campaign feedback text"
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
      profile: "",
      demographics: "",
      psychographics: "",
      behavior: "",
      context: "",
      campaignIdea: "",
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Consumer Behavior Analyzer
      </h1>

      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Audience Profile
          </label>
          <select
            name="profile"
            value={formData.profile}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="">Select a profile</option>
            {Object.entries(audienceProfiles).map(([key, value]) => (
              <option key={key} value={key}>
                {value}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Demographics
          </label>
          <input
            type="text"
            name="demographics"
            value={formData.demographics}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="e.g., age 25-34, urban areas, middle income"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Psychographics
          </label>
          <input
            type="text"
            name="psychographics"
            value={formData.psychographics}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="e.g., values sustainability, health-conscious"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Behavioral Traits
          </label>
          <input
            type="text"
            name="behavior"
            value={formData.behavior}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="e.g., price-sensitive, brand loyal"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Context
          </label>
          <input
            type="text"
            name="context"
            value={formData.context}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="e.g., new product launch, holiday season"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Campaign Idea
          </label>
          <textarea
            name="campaignIdea"
            value={formData.campaignIdea}
            onChange={handleChange}
            rows="3"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="Describe your campaign or product idea..."
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
          ? "Analyzing..."
          : hasGenerated
            ? "Analysis Already Generated"
            : "Generate Analysis"}
      </button>

      {hasGenerated && (
        <button
          onClick={resetAnalysis}
          className="mt-4 w-full bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition"
        >
          Reset & Generate New Analysis
        </button>
      )}

      {analysis && (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-6 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg transform hover:scale-105 transition-transform">
            <h3 className="text-xl font-bold mb-3 border-b border-white/20 pb-2">
              Consumer Needs
            </h3>
            <ul className="space-y-2">
              {analysis.consumerNeeds.map((need, index) => (
                <li key={index} className="list-disc ml-4">• {need}</li>
              ))}
            </ul>
          </div>

          <div className="p-6 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-lg transform hover:scale-105 transition-transform">
            <h3 className="text-xl font-bold mb-3 border-b border-white/20 pb-2">
              Purchasing Motivations
            </h3>
            <ul className="space-y-2">
              {analysis.purchasingMotivations.map((motivation, index) => (
                <li key={index} className="list-disc ml-4">• {motivation}</li>
              ))}
            </ul>
          </div>

          <div className="p-6 rounded-xl bg-gradient-to-br from-red-500 to-red-600 text-white shadow-lg transform hover:scale-105 transition-transform">
            <h3 className="text-xl font-bold mb-3 border-b border-white/20 pb-2">
              Potential Barriers
            </h3>
            <ul className="space-y-2">
              {analysis.barriers.map((barrier, index) => (
                <li key={index} className="list-disc ml-4">• {barrier}</li>
              ))}
            </ul>
          </div>

          <div className="p-6 rounded-xl bg-gradient-to-br from-green-500 to-green-600 text-white shadow-lg transform hover:scale-105 transition-transform">
            <h3 className="text-xl font-bold mb-3 border-b border-white/20 pb-2">
              Emotional Triggers
            </h3>
            <ul className="space-y-2">
              {analysis.emotionalTriggers.map((trigger, index) => (
                <li key={index} className="list-disc ml-4">• {trigger}</li>
              ))}
            </ul>
          </div>

          <div className="p-6 rounded-xl bg-gradient-to-br from-yellow-500 to-yellow-600 text-white shadow-lg transform hover:scale-105 transition-transform">
            <h3 className="text-xl font-bold mb-3 border-b border-white/20 pb-2">
              Engagement Strategies
            </h3>
            <ul className="space-y-4">
              <li>
                <strong className="block mb-1">Platforms</strong>
                <p className="list-disc ml-4">• {analysis.engagementStrategies.platforms}</p>
              </li>
              <li>
                <strong className="block mb-1">Tone</strong>
                <p className="list-disc ml-4">• {analysis.engagementStrategies.tone}</p>
              </li>
              <li>
                <strong className="block mb-1">Content Types</strong>
                <p className="list-disc ml-4">• {analysis.engagementStrategies.contentTypes}</p>
              </li>
            </ul>
          </div>

          <div className="p-6 rounded-xl bg-gradient-to-br from-pink-500 to-pink-600 text-white shadow-lg transform hover:scale-105 transition-transform">
            <h3 className="text-xl font-bold mb-3 border-b border-white/20 pb-2">
              Campaign Feedback
            </h3>
            <p className="list-disc ml-4">• {analysis.campaignFeedback}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIPersonaBuilder;